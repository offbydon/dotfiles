var LocalChanges = Backbone.Model.extend({
	/**
	 * Functions:
	 * add an unsynced change
	 * check for conflicts - this will show a modal even if a single server change has a conflict. if not, callback
	 */

	defaults: function() {
		return {
			unsyncedChanges: [],
			syncEnabled: true
		}
	},

	initialize: function() {
		pm.mediator.on("setSync", this.setSync, this);

		this.serverChangesReadyToBeSaved = new PriorityQueue({ comparator: function(r1,r2) {
			return (r1.revision - r2.revision);
		}});

		pm.mediator.on("addUnsyncedChange", this.onAddUnsyncedChange, this);
		pm.mediator.on("resolveConflicts", this.onResolveConflicts, this);
		pm.mediator.on("singleUnsyncedChangeSynced", this.onUnsyncedChangeSynced, this);
		pm.mediator.on("conflictsResolved", this.onConflictsResolved, this);
		pm.mediator.on("commitTransaction", this.onCommitTransaction, this);
		pm.mediator.on("singleClientChangeSent", this.onSingleClientChangeSent, this);
		pm.mediator.on("deleteSyncedData", this.deleteSyncedData, this);
		pm.mediator.on("checkForUnsyncedChangesBeforeLogout", this.onCheckForUnsyncedChangesBeforeLogout, this);
		pm.mediator.on("deleteUnsyncedData", this.onDeleteUnsyncedData, this);
		pm.mediator.on("syncAllObjects", this.syncAllObjects, this);
        pm.mediator.on("syncAllRequestsFix", this.syncAllRequestsFix, this);
		this.syncEnabled = this.get("syncEnabled");
		this.loadUnsyncedChanges();
	},

	setSync: function(syncEnabled) {
		this.syncEnabled = syncEnabled;
	},

	onDeleteUnsyncedData: function() {
		pm.indexedDB.clearUnsyncedChanges();
	},

	onCheckForUnsyncedChangesBeforeLogout: function() {
		var currentUnsynced = this.get("unsyncedChanges");
		if(currentUnsynced && currentUnsynced.length>0) {
			//show delete unsynced modal
			pm.mediator.trigger("showUnsyncedDeletetionModal");
		}
		else {
			//there are no unsynced changes - can proceed with log out
			//no action
		}
	},

	deleteSyncedData: function() {
		//delete all unsynced changes - 
		pm.indexedDB.clearUnsyncedChanges();
        this.set("unsyncedChanges", []);

		//clear all synced changes
		//all collections, envs, requests, responses, systemValues
		pm.indexedDB.deleteAllCollections(function() {
			pm.collections.reset();
		});

		pm.indexedDB.deleteEachCollectionRequest();

		pm.indexedDB.environments.deleteAllEnvironments(function() {
			pm.environments.reset();
		});
		pm.indexedDB.deleteAllHistoryRequests(function() {
			pm.history.reset();
		});

		pm.indexedDB.subscriptions.deleteAllSubscriptions(function() {
			pm.subscriptionManger.clearSubscriptions();
		});

		pm.indexedDB.headerPresets.deleteAllHeaderPresets(function() {
			pm.headerPresets.reset()
		});

		//delete globals
		var blankGlobals = {'globals': JSON.stringify([])};
		pm.storage.setValue(blankGlobals, function () {
			pm.globals.set({"globals": []});
			pm.appWindow.trigger("sendMessageObject", "updatedGlobals", []);
		});

		pm.indexedDB.deleteAllSince(function() {
			//all sinceIds deleted here
		});

		pm.mediator.trigger("clearSystemValues");
	},

	loadUnsyncedChanges: function() {
		if(!this.syncEnabled) return;

		var oldThis=this;
		pm.syncLogger.log(new Error(),"Loading unsynced changes from DB...");
		pm.indexedDB.getUnsyncedChanges(function(changes) {
			pm.syncLogger.log(new Error(),"DB returned "+changes.length+" changes.");
			oldThis.set("unsyncedChanges", changes);
		});
	},

	//this is only for realtime
	onUnsyncedChangeSynced: function(realtime, stream) {
		if(realtime === true) {
			//do not delete the change - nothing to be deleted
		}
		else {
			var currentUnsynced = this.get("unsyncedChanges");
			var idxToRemove = 0;
			for(var i = 0; i < currentUnsynced.length ; i++) {
				if(currentUnsynced[i].stream === stream) {
					idxToRemove = i;
					break;
				}
			}
			var changeToDelete = currentUnsynced.splice(idxToRemove,1)[0];
			if(!changeToDelete) {
				//console.log("Unsynced change not found");
				this.set("unsyncedChanges", currentUnsynced);
				pm.mediator.trigger("syncClientChanges", currentUnsynced, stream);
				return;
			}

			var oldThis = this;
			pm.indexedDB.deleteUnsyncedChange(changeToDelete.id, function(){
				//console.log(pm.syncLogger.getLogDate() + " - " +"Unsynced change deleted");
				oldThis.set("unsyncedChanges", currentUnsynced);
				pm.mediator.trigger("syncClientChanges", currentUnsynced, stream);
			});
		}
	},

	//This is called when all changesets of a collection have been added - not commited when offline
	onCommitTransaction: function(stream) {
		if(!this.syncEnabled) return;

		if(pm.syncManager.get("loggedIn")===true && pm.syncManager.get("allClientChangesSynced")===true) {
			//console.log(pm.syncLogger.getLogDate() + " - " +"Committing...");
			pm.mediator.trigger("syncClientChanges", this.get("unsyncedChanges"), stream);
		}
	},

	getUnsyncedChangeId: function(entity, verb, data, meta) {
		var entityKey;

		//for transfer changes, there won't be any data. The meta field will hold the request's id
		if(verb==="transfer" || verb==="unsubscribe") {
			entityKey = entity+":"+meta;
		}
		else {
			entityKey = entity+":"+data.id;
		}

		//user's don't need an ID - it's determined by the socket on the server side
		if(entity==="user") {
			entityKey = "user:NOID";
		}

		if(verb==="transfer") {
			entityKey += ":transfer";
			data["id"]=meta;
		}

		if(verb==="unsubscribe") {
			entityKey += ":unsubscribe";
			data["id"]=meta;
		}
		return entityKey;
	},

	/**
	 * @description Called when the syncManager is not connected to the socket, and the change must be saved locally
	 * @param entity
	 * @param verb
	 * @param data
	 * @param meta
	 */
	onAddUnsyncedChange: function(entity, verb, data, meta, sentOnce) {
		var timestamp = (new Date().getTime());
		var entityKey = this.getUnsyncedChangeId(entity, verb, data, meta);

		if(verb==="transfer") {
			data["id"]=meta;
		}

		if(verb==="unsubscribe") {
			data["id"]=meta;
		}

		var changesetStream = guid();
		if(entity === "collection") {
			changesetStream = data.id;
		}
		else if(data.hasOwnProperty("collection")) {
			changesetStream = data.collection;
		}

		var changeset = {id: entityKey, entity: entity, verb:verb, data:data, timestamp: timestamp, stream: changesetStream, sentOnce: sentOnce};

		var currentUnsynced = this.get("unsyncedChanges");
		var oldThis = this;
		var mergeChanges = true;

		if(verb=="transfer" && this._checkForTransferAfterCreate(entityKey, data)==-2) {
			pm.syncLogger.log(new Error(),"Transfer merged with create...no further action required");
			return;
		}

		if(verb=="destroy" && this._checkForDeleteAfterTransfer(entityKey, data)==-2) {
			pm.syncLogger.log(new Error(),"Delete after transfer. Transfer change deleted...the delete change will be added now");
		}

		var changeIndex = this._findIndex(currentUnsynced,function(change){return (change!=undefined && change.id===entityKey)});

		if(changeIndex==-1) {
			var unsyncedChange = changeset;
			currentUnsynced.push(unsyncedChange);
			oldThis.set('unsyncedChanges', currentUnsynced);
			pm.indexedDB.addUnsyncedChange(unsyncedChange,function() {});
		}
		else {
			//go through the data properties of the existing changeset
			var currentObj = currentUnsynced[changeIndex];
			var newVerb = this._getNewVerbAndResolveConflicts(verb, currentObj.verb, entityKey, currentUnsynced, currentObj, changeset);
			if(newVerb==-1) {
				pm.syncLogger.log(new Error(),"Changeset deleted");
				return;
			}
			_.extend(currentObj.data, changeset.data);

			currentObj.verb = newVerb;
			currentUnsynced[changeIndex]=currentObj;
			changeset.data = currentObj.data;
			changeset.verb = currentObj.verb;
			changeset.sentOnce = currentObj.sentOnce || sentOnce;

			var unsyncedChange = changeset;
			oldThis.set('unsyncedChanges', currentUnsynced);
			pm.indexedDB.updateUnsyncedChange(unsyncedChange,function() {});
		}
	},

	_checkForTransferAfterCreate: function(entityKey, data) {
		var parts = entityKey.split(":");
		var currentUnsynced = this.get("unsyncedChanges");
		var oldThis = this;
		parts.pop();
		var oldKey = parts.join(":");
		var changeIndex = this._findIndex(currentUnsynced,function(change){return (change!=undefined && change.verb=="create" && change.id===oldKey)});

		if(changeIndex !== -1) {
			var createChange = currentUnsynced[changeIndex];
			//copy the transfer object into the create object
			var transferObject={};
			var newTimestamp = (new Date().getTime());
			if(data.to.model=="collection") {
				transferObject["collection"]=data.to.model_id;
			}
			else if(data.to.model=="folder") {
				transferObject["folder"]=data.to.model_id;
			}
			else {
				pm.syncLogger.error("Fatal Error: has to transfer to a collection or folder. Tried to transfer to: " + data.to.model);
			}
			_.extend(createChange.data,transferObject);
			var changeset = {id: oldKey, entity: "request", verb:"create",
				data:createChange.data, timestamp: newTimestamp};
			pm.indexedDB.updateUnsyncedChange(changeset,function() {
				currentUnsynced[changeIndex] = createChange;
				oldThis.set('unsyncedChanges', currentUnsynced);
			});
			return -2;
		}
	},

	_checkForDeleteAfterTransfer: function(entityKey, data) {
		var oldKey = entityKey+":transfer";
		var currentUnsynced = this.get("unsyncedChanges");
		var oldThis = this;

		var changeIndex = this._findIndex(currentUnsynced,function(change){return (change!=undefined && change.verb=="transfer" && change.id===oldKey)});
		if(changeIndex!=-1) {
			var transferChange = currentUnsynced[changeIndex];
			//copy the transfer object into the create object
			pm.indexedDB.deleteUnsyncedChange(oldKey, function() {
				currentUnsynced.splice(changeIndex,1);
				oldThis.set('unsyncedChanges', currentUnsynced);
			});
			//-2 means the transfer request was deleted
			return -2;
		}
	},

	_findIndex: function(arr, cond) {
		var i, x;
		var len = arr.length;
		for(var i=0;i<len;i++) {
			x = arr[i];
			if (cond(x)) return parseInt(i);
		}
		return -1;
	},

	_getNewVerbAndResolveConflicts: function(newVerb, oldVerb, id, currentUnsynced, changeset, newObject) {
		//created/updated/destroyed
		var oldThis = this;
		if(newVerb==="create") {
			//this shouldn't ever be hit
			var ident = Math.ceil(Math.random()*1000);
			//pm.syncLogger.error("FATAL - "+ident+ "- The object being created already exists. ..continuing");
			//pm.syncLogger.error("COND - " + ident+"- Old Object: " + JSON.stringify(changeset));
			//pm.syncLogger.error("COND - " + ident+ "- New object: " + JSON.stringify(newObject));
            pm.syncLogger.error("Object already exists - merging creates");
			return "create";
		}
		if(newVerb==="destroy") {
			if(oldVerb==="create") {
				//The old entry SHOULD BE REMOVED FROM UNSYNCED TABLE
				//new entry should be discarded
				pm.indexedDB.deleteUnsyncedChange(id, function() {
					//delete currentUnsynced[id];
					currentUnsynced = _.without(currentUnsynced, _.findWhere(currentUnsynced, {id: id}));

					//if there are entries in the unsynced change table with the same folderId or collectionId as id, they should be deleted too
					var actualId = (id.indexOf(":")===-1)?id:id.split(":")[1];
					if(changeset.entity==="collection") //or model
					{
						for(var i=0;i<currentUnsynced.length;i++) {
							if(currentUnsynced[i].data.collection === actualId) {
								pm.indexedDB.deleteUnsyncedChange(currentUnsynced[i].id);
								currentUnsynced.splice(i,1);
								i--;
							}
						}
					}
					else if(changeset.entity==="folder") //or model
					{
						for(var i=0;i<currentUnsynced.length;i++) {
							if(currentUnsynced[i].data.folder === actualId) {
								pm.indexedDB.deleteUnsyncedChange(currentUnsynced[i].id);
								currentUnsynced.splice(i,1);
								i--;
							}
						}
					}

					oldThis.set('unsyncedChanges', currentUnsynced);

				});
				return -1;
			}
			if(oldVerb==="update" || oldVerb==="transfer") {
				return newVerb;
			}
		}
		if(newVerb==="update") {
			if(oldVerb==="create") {
				return "create";
			}
			if(oldVerb==="update") {
				return "update";
			}
			if(oldVerb==="destroy") {
				pm.syncLogger.error("Fatal Error: Cannot update deleted object");
				return;
			}
		}
		if(newVerb==="transfer") {
			if(oldVerb!=="transfer") {
				pm.syncLogger.error("FATAL error - One transfer, and one create/update entry cannot have the same id");
				return;
			}
			return newVerb;
		}
	},


	onResolveConflicts: function(serverChanges) {
		if(!this.syncEnabled) return;

		//here, server queue represents all server changes
		//for each change, add it to an array, setting conflict=true if there is a conflict
		if(serverChanges.length === 0) {
			//no more server changes to process
			pm.mediator.trigger("syncClientChanges", this.get("unsyncedChanges"), null);
			return;
		}

		var anyConflict = false;
		var firstChange;
		while(serverChanges.length!==0 && (firstChange=serverChanges.dequeue())) {
			pm.syncLogger.log(new Error(),"Server change to process: ");
			pm.syncLogger.log(new Error(),firstChange);

			//This should not be here
			if(firstChange.meta.model==="user") {
				firstChange.model_id="NOID";
			}
			var changesetId = firstChange.meta.model+":"+firstChange.model_id;
			if(firstChange.meta.action==="transfer") {
				changesetId += ":transfer";
			}


			//check for conflicts
			var conflictingChange = this._findConflictingLocalChange(changesetId);
			if(conflictingChange===null) {
				pm.syncLogger.log(new Error(),"No conflict for this server change - adding change to processable changes");
				this.serverChangesReadyToBeSaved.queue(firstChange);
			}
			else {
				var conflictRows = this._getConflictRows(conflictingChange, firstChange);
				//getConflictRows returns an array of rows to be displayed in the conflict resolver table

				if(conflictRows!==null && conflictRows.length>0) {
					anyConflict = true;
					var numRows = this._addConflictRows(conflictRows);
				}
			}
		}

		//if there is a conflict, saveServerChanges() will be called when the conflicts are resolved
		if(!anyConflict) {
			this._saveProcessedServerChange();
		}
		else {
			pm.conflictResolverModal.showModal();
		}
	},

	_findConflictingLocalChange: function(id) {
		var currentUnsynced = this.get("unsyncedChanges");
		var numChanges = currentUnsynced.length;
		for(var i=0;i<numChanges;i++) {
			if(currentUnsynced[i].id===id) {
				return currentUnsynced[i];
			}
		}
		return null;
	},

	_getConflictRows: function(localChange, remoteChange) {
		pm.syncLogger.log(new Error(),"Getting conflictRow for: localChange=");
		pm.syncLogger.log(new Error(),localChange);
		pm.syncLogger.log(new Error()," and remoteChange=");
		pm.syncLogger.log(new Error(),remoteChange);

		var idParts = localChange.id.split(":");
		var model = idParts[0];
		var model_id = idParts[1];
		var localAction; //string
		var remoteAction; //string

		var remoteNameOrId = remoteChange.data.name;
		if(remoteNameOrId==null) {
			remoteNameOrId=remoteChange.data.id;
		}

		var localNameOrId = localChange.data.name;
		if(localNameOrId==null) {
			localNameOrId=localChange.data.id;
		}

		var ret = [];
		var ret_template = {};

		ret_template.localChange = _.cloneDeep(localChange);
		ret_template.remoteChange = _.cloneDeep(remoteChange);
		ret_template.model = model;
		ret_template.model_id = model_id;
		ret_template.nameOrId = localNameOrId;
		ret_template.id = model_id;
		ret_template.conflictId = localChange.id;
		ret_template.key="";
		ret_template.revision = remoteChange.revision;
		ret_template.showRow = true;

		if(localChange.verb==="destroy" && remoteChange.action==="destroy") {
			this.deleteUnsyncedChange(localChange.id);
			return null;
		}
		if(localChange.verb==="create" && remoteChange.action==="create") {
			//two creates should still be merged
			localAction = "Created";
			remoteAction = "Created";
			var ret_template_temp = _.clone(ret_template);

			ret_template_temp.localAction = localAction;
			ret_template_temp.remoteAction = remoteAction;

			//get changed keys
			var localUpdates = localChange.data;
			var subRevision = 0.001;
			var anyRowConflicting = false;
			for(var pKey in localUpdates) {
				if(localUpdates.hasOwnProperty(pKey)) {
					ret_template_temp.showRow = true;
					if(pKey==="owner") {
						ret_template_temp.key = pKey;
						ret_template_temp.revision = remoteChange.revision + subRevision;
						ret_template_temp.showRow = false;
						ret.push(_.clone(ret_template_temp));
					}
					else if(model==="folder" && pKey==="collection") {
						ret_template_temp.key = pKey;
						ret_template_temp.revision = remoteChange.revision + subRevision;
						ret_template_temp.showRow = false;
						ret.push(_.clone(ret_template_temp));
					}
					else if(remoteChange.data[pKey]!==localUpdates[pKey] && !arraysEqual(remoteChange.data[pKey], localUpdates[pKey])) {
						anyRowConflicting = true;
						ret_template_temp.key = pKey;
						ret_template_temp.serverValue = "Set to: " + remoteChange.data[pKey];
						ret_template_temp.localValue = "Set to: " + localUpdates[pKey];
						ret_template_temp.revision = remoteChange.revision + subRevision;
						subRevision += 0.001;

						//Hack if the key is globals
						if(pKey==="globals" && model==="user") {
							this._setGlobalConflictMessage(ret_template_temp, localUpdates["globals"], remoteChange.data["globals"]);
						}

						//remove all unnessecary keys from the change
						for(var key1 in ret_template_temp.localChange.data) {
							if(key1!=="id" && key1!==pKey && !(model=="folder" && key1==="collection")) {
								delete ret_template_temp.localChange.data[key1];
								delete ret_template_temp.remoteChange.data[key1];
							}
						}

						ret.push(_.clone(ret_template_temp));
					}
				}
			}
			if(anyRowConflicting === false) {
				return null;
			}
		}

		if(localChange.verb==="update" && remoteChange.action==="update") {
			localAction = "Updated";
			remoteAction = "Updated";

			var localUpdates = _.cloneDeep(localChange.data);

			var pKeys = [];
			for(var pKeysIterator in localUpdates) {
				if(localUpdates.hasOwnProperty(pKeysIterator)) {
					pKeys.push(pKeysIterator);
				}
			}
			var numKeys = pKeys.length;

			//get changed keys

			var subRevision = 0.001;
			//for(var pKey in localUpdates) {
			for(var i=0;i<numKeys;i++) {
				var ret_template_temp = _.cloneDeep(ret_template);
				ret_template_temp.localAction = localAction;
				ret_template_temp.remoteAction = remoteAction;

				var pKey = pKeys[i];
				if(localUpdates.hasOwnProperty(pKey)) {
					if(pKey === "time" || pKey === "timestamp") {
						continue;
					}

					ret_template_temp.showRow = true;
					if(pKey==="owner") {
						ret_template_temp.key = pKey;
						ret_template_temp.revision = remoteChange.revision + subRevision;
						ret_template_temp.showRow = false;
						ret.push(_.clone(ret_template_temp));
					}
					else if(model==="folder" && pKey==="collection") {
						ret_template_temp.key = pKey;
						ret_template_temp.revision = remoteChange.revision + subRevision;
						ret_template_temp.showRow = false;
						ret.push(_.clone(ret_template_temp));
					}
					else if(remoteChange.data[pKey]!==localUpdates[pKey] && !arraysEqual(remoteChange.data[pKey], localUpdates[pKey])) {
						ret_template_temp.key = pKey;

						//Replace so that word-break works correctly
						var localChangeToShow = localUpdates[pKey];
						if(typeof localChangeToShow === "object") {
							localChangeToShow = JSON.stringify(localChangeToShow).replace(/":"/g,'": "').replace(/","/g,'", "');
						}

						var remoteChangeToShow = remoteChange.data[pKey];
						if(typeof remoteChangeToShow === "object") {
							remoteChangeToShow = JSON.stringify(remoteChangeToShow).replace(/":"/g,'": "').replace(/","/g,'", "');
						}
						ret_template_temp.serverValue = "Updated to: " + remoteChangeToShow;
						ret_template_temp.localValue = "Updated to: " + localChangeToShow;

						ret_template_temp.revision = remoteChange.revision + subRevision;
						subRevision += 0.001;

						//Hack if the key is globals
						if(pKey==="globals" && model==="user") {
							this._setGlobalConflictMessage(ret_template_temp, localUpdates["globals"], remoteChange.data["globals"]);
						}

						//remove all unnessecary keys from the change
						for(var key1 in ret_template_temp.localChange.data) {
							if(key1!=="id" && key1!==pKey && !(model=="folder" && key1==="collection")) {
								delete ret_template_temp.localChange.data[key1];
								delete ret_template_temp.remoteChange.data[key1];
							}
						}

						ret.push(_.clone(ret_template_temp));
					}
				}
			}
		}
		else if(localChange.verb==="destroy" && remoteChange.action==="update") {
			localAction = "Deleted";
			remoteAction = "Updated";
			var ret_template_temp = _.clone(ret_template);
			ret_template_temp.localAction = localAction;
			ret_template_temp.serverValue = "Updated to: " + remoteChange.data;
			ret_template_temp.localValue = "Deleted";
			ret_template_temp.remoteAction = remoteAction;
			ret.push(ret_template_temp);
		}
		else if(localChange.verb==="update" && remoteChange.action==="destroy") {
			localAction = "Updated";
			remoteAction = "Deleted";
			var ret_template_temp = _.clone(ret_template);
			ret_template_temp.localAction = localAction;
			ret_template_temp.remoteAction = remoteAction;
			ret_template_temp.serverValue = "Deleted";
			ret_template_temp.localValue = "Updated to: " + localChange.data;
			ret.push(ret_template_temp);
		}
		else if(localChange.verb==="transfer" && remoteChange.action==="transfer") {
			localAction = "Moved";
			remoteAction = "Moved";
			var ret_template_temp = _.clone(ret_template);
			ret_template_temp.key = "Destination";

			ret_template_temp.localAction = localAction;
			ret_template_temp.remoteAction = remoteAction;
			ret_template_temp.serverValue = "Moved to: " + remoteChange.data.to.model+":"+remoteChange.data.to.model_id;
			ret_template_temp.localValue = "Moved to: " + localChange.data.to.model+":"+localChange.data.to.model_id;
			ret.push(ret_template_temp);
		}

		pm.syncLogger.log(new Error(),["Conflict row generated: ",ret]);
		return ret;
	},

	_updateUnsyncedChange: function(changeId, newChange) {
		pm.syncLogger.log(new Error(),["Updating changeId: ",changeId," with change: ",newChange]);
		var currentUnsynced = this.get("unsyncedChanges");
		var numUnsynced = currentUnsynced.length;
		for(var i=0;i<numUnsynced; i++) {
			if(currentUnsynced[i].id===changeId) {
				currentUnsynced[i]=newChange;
				this.set("unsyncedChanges", currentUnsynced);
			}
		}
		return 0;
	},

	deleteUnsyncedChange: function(changeId) {
		var currentUnsynced = this.get("unsyncedChanges");
		var numUnsynced = currentUnsynced.length;
		for(var i=0;i<numUnsynced; i++) {
			if(currentUnsynced[i].id===changeId) {
				pm.syncLogger.log(new Error(),"Deleting change with changeId: " + changeId);
				currentUnsynced.splice(i,1);
				this.set("unsyncedChanges", currentUnsynced);
				return changeId;
			}
		}
		return -1;
	},

	_getJsonStringFromGlobal: function(global) {
		var numGlobals = global.length;
		var obj = [];
		for(var i=0;i<numGlobals;i++) {
			var thisObj = {};
			thisObj[global[i].key] = global[i].value;
			obj.push(thisObj);
		}
		return obj;
	},

	_setGlobalConflictMessage: function(ret_template_temp, localGlobals, remoteGlobals) {
		var localValue= "Updated to " + JSON.stringify(this._getJsonStringFromGlobal(localGlobals),null,2);
		var serverValue = "Updated to " + JSON.stringify(this._getJsonStringFromGlobal(remoteGlobals),null,2);
		ret_template_temp.serverValue = serverValue;
		ret_template_temp.localValue = localValue;
	},

	_addConflictRows: function(rowObject) {
		var numRows = rowObject.length;
		for(var i=0; i<numRows; i++) {
			pm.conflictResolverModal.addRow(rowObject[i]);
			//pm.indexedDB.addSyncConflict(rowObject[i], function(){});
		}
	},

	_saveProcessedServerChange: function() {
		//dequeue the first server change, and execute, passing this function again in the callback
		if(this.serverChangesReadyToBeSaved.length === 0) {
			//stream = null because any change can go
			pm.mediator.trigger("syncClientChanges", this.get("unsyncedChanges"), null);
			return;
		}
		var changeToSave = this.serverChangesReadyToBeSaved.dequeue();
		this._saveServerChange(changeToSave, _.bind(this._saveProcessedServerChange, this));
	},

	_saveServerChange: function(message, callback) {
		if(!this.syncEnabled) return;

		var model = message.meta.model;
		var model_id = message.model_id;
		var action = message.meta.action;
		var data = message.data;

		pm.syncManager.executeOrAddFunctionToQueue(function() {
			//Accounting for API Change
			message.model = message.meta.model;
			message.action = message.meta.action;
			pm.mediator.trigger("syncChangeReceived",action, message, callback);
		});
	},

	_syncFirstClientChange: function() {
		if(!this.syncEnabled) return;
		//check connectivity

		//check serverChanges.length===0
		pm.syncLogger.log(new Error(),"Syncing client change to sever...");

		var currentUnsynced = this.get("unsyncedChanges");
		if(currentUnsynced.length===0) {
			pm.syncLogger.log(new Error(),"All client side changes have been resolved and synced");
			this.set("allClientChangesSynced", true);
			if(pm.syncManager.get("loggedIn")===true) {
				this.set("syncFinished", true);
				this.trigger("syncFinished");
			}
			return;
		}
		else {
			pm.syncLogger.log(new Error(),"Change so sync: ");
			pm.syncLogger.log(new Error(),changeToSync);
			var changeToSync = currentUnsynced[0];
			var verb = changeToSync.verb;
			var entity = changeToSync.entity;
			var data = changeToSync.data;
			var meta = changeToSync.meta;
			if(verb==="transfer" && data && data.id!=null) {
				meta = data.id;
			}
			this._syncClientChangeToServer(verb, entity, data, meta, false);
		}
	},

	onConflictsResolved: function(radioArray) {
		var numValues = radioArray.length;
		pm.syncLogger.log(new Error(),"Resolving " + numValues+" conflicts...");
		for(var i=0;i<numValues;i++) {
			var thisRadio = $(radioArray[i]);
			var model = thisRadio.attr('data-model');
			var model_id = thisRadio.attr('data-model-id');
			var key = thisRadio.attr('data-key');
			var value = thisRadio.attr('value');
			var changeToSync = thisRadio.data("change");
			var remoteAction = thisRadio.attr('data-remote-action');
			var localAction = thisRadio.attr('data-local-action');
			var conflictID = thisRadio.attr('data-conflict-id');

			if(remoteAction==="Updated" && localAction==="Updated") {
				var objToUpdate = {};
				objToUpdate['id'] = model_id;
				objToUpdate[key] = value;

				//id enetity verb data timestamp
				if(thisRadio.attr('data-which-change')==="local") {
					this._updateUnsyncedChange(conflictID, changeToSync);
					pm.indexedDB.updateUnsyncedChange(changeToSync);
				}
				else {
					//Add changeToSync to the serverChangesReadyToBeProcessedQueue
					//this should contain a revision!
					this.serverChangesReadyToBeSaved.queue(changeToSync);

					if(this.deleteUnsyncedChange(conflictID)) {
						pm.indexedDB.deleteUnsyncedChange(conflictID);
					}
				}
			}
			else if(remoteAction==="Created" && localAction==="Created") {
				if(thisRadio.attr('data-which-change')==="local") {
					//change update to create. (the entity needs to be recreated on the server)
					//if the local change is selected, only the update needs to be sent to the server
					changeToSync.verb="update";
					this._updateUnsyncedChange(conflictID, changeToSync);
					pm.indexedDB.updateUnsyncedChange(changeToSync);
				}
				else {
					//you choose the server. In this case, no need to send the local change.
					changeToSync.action = "update";
					this.serverChangesReadyToBeSaved.queue(changeToSync);

					if(this.deleteUnsyncedChange(conflictID)) {
						pm.indexedDB.deleteUnsyncedChange(conflictID);
					}
				}
			}
			else if(remoteAction==="Deleted" && localAction==="Updated") {
				if(thisRadio.attr('data-which-change')==="local") {
					//change update to create. (the entity needs to be recreated on the server)
					changeToSync.verb="create";
					this._updateUnsyncedChange(conflictID, changeToSync);
					pm.indexedDB.updateUnsyncedChange(changeToSync);
				}
				else {
					//you choose the server. In this case, no need to send the local change.
					this.serverChangesReadyToBeSaved.queue(changeToSync);

					if(this.deleteUnsyncedChange(conflictID)) {
						pm.indexedDB.deleteUnsyncedChange(conflictID);
					}
				}
			}
			else if(remoteAction==="Updated" && localAction==="Deleted") {
				if(thisRadio.attr('data-which-change')==="local") {
					//don't do anything - the local unsyncedChange is still there
				}
				else {
					this.serverChangesReadyToBeSaved.queue(changeToSync);
					if(this.deleteUnsyncedChange(conflictID)) {
						pm.indexedDB.deleteUnsyncedChange(conflictID);
					}
				}
			}
			else if(remoteAction==="Moved" && localAction==="Moved") {
				if(thisRadio.attr('data-which-change')==="local") {
					this._updateUnsyncedChange(conflictID, changeToSync);
					pm.indexedDB.updateUnsyncedChange(changeToSync);
				}
				else {
					this.serverChangesReadyToBeSaved.queue(changeToSync);
					if(this.deleteUnsyncedChange(conflictID)) {
						pm.indexedDB.deleteUnsyncedChange(conflictID);
					}
				}
			}
			else {
				pm.syncLogger.log(new Error(),"ERROR");
			}
		}
		//all conflicts have been resolved
		pm.conflictResolverModal.clearTable();

		//to save first processes change from the queue
		this._saveProcessedServerChange();
	},

    syncAllRequestsFix: function() {
        if(!this.syncEnabled) return;
        var collModels = pm.collections.getAllCollections();
        var collRequests = _.flatten(collModels.map(function(a) {return a.get("requests")})); //to sync
        collRequests.map(function(obj) {
            pm.syncManager.addChangeset("request","create",obj, null, true);
        });
    },

	syncAllObjects: function() {
		if(!this.syncEnabled) return;

		var collModels = pm.collections.getAllCollections();
		var collJsons = collModels.map(function(a){return a.getAsJSON()}); //to sync

		var folderJsons = _.flatten(collModels.map(function(a){return a.get("folders")})); //to sync

		var collRequests = _.flatten(collModels.map(function(a) {return a.get("requests")})); //to sync

		var responses = _.flatten(
			collRequests.map(function(a) {
				_.map(a["responses"], function(res) {
					res.collectionId = a.collectionId;
					res.requestId = a.id;
					res.owner = a.owner;
				});
				return a["responses"];
			})
		); //to sync

		var envModels = pm.environments.models;
		var envJsons = envModels.map(function(a) {return a.toJSON()}); //to sync

		//NOT syncing initial history
		// var historyModels = pm.history.models;
		// var historyJsons = historyModels.map(function(a) {return a.toJSON()}); //to sync

		var headerPresetModels = pm.headerPresets.models;
		var headerPresetJsons = headerPresetModels.map(function(a) {return a.toJSON()}); //to sync

		var collIds = [];

		collJsons.map(function(obj) {
			pm.syncManager.addChangeset("collection","create",obj, null, true);
			collIds.push(obj.id);
		});

		folderJsons.map(function(obj) {
			pm.syncManager.addChangeset("folder","create",obj, null, true);
		});

		collRequests.map(function(obj) {
			pm.syncManager.addChangeset("request","create",obj, null, true);
		});

		envJsons.map(function(obj) {
			if(obj && obj.id) {
				//don't add the default empty env
				pm.syncManager.addChangeset("environment","create",obj, null, true);
			}
		});

		responses.map(function(obj) {
			if(!obj) return;
			if(!obj.hasOwnProperty("request")) return;

			obj.requestObject = JSON.stringify(obj.request);
			obj.request = obj.requestId;
			obj.collection = obj.collectionId;
			obj.collectonId = obj.collectionId;
			obj.owner = request.owner;
			pm.syncManager.addChangeset("response", "create",obj, null, true);
		});

		// historyJsons.map(function(obj) {
		// 	pm.syncManager.addChangeset("request","history",obj, null, true);
		// });

		headerPresetJsons.map(function(obj) {
			pm.syncManager.addChangeset("headerpreset","create",obj, null, true);
		});

		// Update globals later. Once the server changes have come
		setTimeout(function() {
			pm.storage.getValue('globals', function (gs) {
				var objectToUpdate = {"globals": JSON.parse(gs)};
				pm.syncManager.addChangeset("user", "update", objectToUpdate, null, true);
			});
		}, 4000);

		pm.syncLogger.error("Synced all objects including " + collJsons.length +
		" collections. Ids = " + JSON.stringify(collIds));

		console.log(pm.syncLogger.getLogDate() + " - " +"All data exported");
	}
});