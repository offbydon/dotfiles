var SubscriptionHandler = Backbone.Model.extend({
	initialize: function() {
		//--Sync listeners---
		this.loadSubscriptions();
		this.subscribedTo = [];
		pm.mediator.on("syncChangeReceived", this.onSyncChangeReceived, this);
		pm.mediator.on("unsubscribeFromCollection", this.unsubscribeFromCollectionWithOptSync, this);
	},

	isSubscribedTo: function(subsId) {
		if(this.subscribedTo.indexOf(subsId)===-1) {return false;}
		return true;
	},

	clearSubscriptions: function() {
		this.subscribedTo = [];
	},

	loadSubscriptions: function() {
		var oldThis = this;
		pm.indexedDB.subscriptions.getAllSubscriptions(function(subs) {
			_.map(subs, function(sub) {
				oldThis.subscribedTo.push(sub.id);
			});
		});
	},

	//Sync handlers
	onSyncChangeReceived: function(verb, message, callback) {
		if(verb !== "subscribe" && verb !== "unsubscribe") {
			return;
		}

		var orgs = pm.user.get("organizations");
		if(!orgs || orgs.length <= 0) {
			//Teams are not enabled
			return;
		}

		var oldThis = this;
		if(verb === "subscribe") {
			if(message.data && message.data.hasOwnProperty("user")) {
				//someone else subscribed to my collection
				//do nothing
				if (typeof callback === "function") {
					callback();
				}
			}
			else {
				this.subscribeToCollectionWithOptSync(message, false, function (alreadySubscribed) {
					//pm.mediator.trigger("subscribedToCollection", message.data.model_id);
					if(alreadySubscribed!==true) {
						oldThis.getFoldersForObject(message.data, message.data.owner);
						oldThis.getRequestsForObject(message.data, message.data.owner, message.data.id, "collection");
					}
					if (typeof callback === "function") {
						callback();
					}
				});
			}
		}

		else if(verb === "unsubscribe") {
			if(message.data && message.data.hasOwnProperty("user")) {
				//someone else subscribed to my collection
				//do nothing
				//console.log(pm.syncLogger.getLogDate() + " - " +"Someone unsubscribed from my collection");
				if (typeof callback === "function") {
					callback();
				}
			}
			else {
				this.unsubscribeFromCollectionWithOptSync(message, false, function () {
					//pm.mediator.trigger("unsubscribedFromCollection", message.data.model_id);
					if (typeof callback === "function") {
						callback();
					}
				});
			}
		}
	},

	unsubscribeFromCollectionWithOptSync: function(message, toSync, callback) {
		//var subsId = message.owner + ":" + message.collectionId;
		var subsId = message.model_id || message.data.id;
		var oldThis = this;
		if(this.isSubscribedTo(subsId)) {
			pm.indexedDB.subscriptions.deleteSubscription(subsId, function () {

				if (toSync) {
					pm.syncManager.addChangeset("collection", "unsubscribe", {owner: message.owner}, message.model_id, true);
				}

				var subsIdx = oldThis.subscribedTo.indexOf(subsId);
				if (subsIdx !== -1) {
					oldThis.subscribedTo.splice(subsIdx, 1);
				}

				var status = pm.collections.deleteCollectionFromDataStoreWithOptSync(message.model_id, true, false, function() {});

				if(typeof callback === "function") {
					callback();
				}
			});
		}
		else {
			console.log(pm.syncLogger.getLogDate() + " - " +"Cannot unsubscribe - you are not subscribed to the collection with id: " + subsId);
			pm.mediator.trigger("databaseOperationComplete");
			pm.mediator.trigger('syncOperationDone');
			if(typeof callback === "function") {
				callback();
			}
		}

		//call callback regardless
		pm.syncManager.updateSinceFromMessage(message);
	},

	subscribeToCollectionWithOptSync: function(wholeMessage, toSync, callback) {
		var message = wholeMessage.data;
		var oldThis = this;
		//add subscription data to DB
		var subscription = {
			//id: message.owner+":"+message.id,
			id: message.id,
			userId: message.owner,
			collectionId: message.id
		};
		//console.log("Subscribing to collection: " + message.name);
		if(this.isSubscribedTo(subscription.id)) {
			console.log(pm.syncLogger.getLogDate() + " - " +"Already subscribed to collection with id: " + subscription.id);
			pm.mediator.trigger("databaseOperationComplete");
			pm.mediator.trigger('syncOperationDone');
			if(typeof callback === "function") {
				callback(true);
			}
			pm.syncManager.updateSinceFromMessage(wholeMessage);
			return;
		}
		var status = pm.indexedDB.subscriptions.addSubscription(subscription, function(subscription) {
			//create a collection from the message, and add it
			//once it's added, look the the folder field and order field, and get requests
			var newCollection = {
				id: message.id,
				name: message.name,
				description: message.description,
				owner: message.owner,
				order: message.order || [],
				write: message.write,
				subscribed: true,
				justSubscribed: true
			};

			pm.collections.addFullCollection(newCollection, true, callback);

			if(toSync) {
				pm.syncManager.addChangeset("collection", "subscribe", {owner: message.owner}, message.id, true);
			}

			pm.mediator.trigger("addedSubscription"); //TODO: This should add a sinceId of 0 for this subscription
			oldThis.subscribedTo.push(subscription.id);
		});

		if(status==-1) {
			pm.mediator.trigger('syncOperationFailed', 'Adding db subscription failed');
		}
		else {
			pm.syncManager.updateSinceFromMessage(wholeMessage);
		}
	},

	getFoldersForObject: function(objectWithFolders, ownerId) {
		var folderIds = objectWithFolders.folders_ids;
		var oldThis = this;
		if(!folderIds) {
			//get folder ids
			pm.syncManager.getEntityForCollection("folder", ownerId, objectWithFolders.id, function(results) {

				_.map(results, function (res) {
					if (oldThis.subscribedTo.indexOf(res.collection) === -1) {
						//console.log("the collection was unsubscribed to before this folder was received");
						return;
					}

					pm.collections.addFolderFromRemote(res, null);

					//for nested folders
					if (res.folders_ids) {
						oldThis.getFoldersForObject(res, ownerId);
					}
					oldThis.getRequestsForObject(res, ownerId, res.id, "folder");
				});
			});
		}
		else {
			_.map(folderIds, function (fid) {
				pm.syncManager.getEntityFromId("folder", fid, ownerId, null, function (res) {
					//res will be a folder
					if (oldThis.subscribedTo.indexOf(res.collection) === -1) {
						//console.log("the collection was unsubscribed to before this folder was received");
						return;
					}

					pm.collections.addFolderFromRemote(res, null);

					//for nested folders
					if (res.folders_ids) {
						oldThis.getFoldersForObject(res, ownerId);
					}
					oldThis.getRequestsForObject(res, ownerId, fid, "folder");
				});
			});
		}

	},

	getRequestsForObject: function(objectWithOrder, ownerId, parentId, parentType) {
		var oldThis = this;
		var numRequestsAdded = 0;
		_.map(objectWithOrder.order, function(requestId) {
			pm.syncManager.getEntityFromId("request",requestId, ownerId, objectWithOrder, function(res,owo) {
				if(oldThis.subscribedTo.indexOf(res.collection)===-1) {
					//console.log("the collection was unsubscribed to before this request was received");
					return;
				}

				res["collectionId"]=res.collection;
				if(res.dataMode==="raw" && res.rawModeData) {
					res.data = res.rawModeData;
					delete res.rawModeData;
				}
				pm.collections.addFullCollectionRequest(res, null);

				oldThis.getResponsesForRequest(res.id, ownerId);
				numRequestsAdded++;
				//Change objectWithOrder to owo if order becomes a problem
				if(numRequestsAdded === objectWithOrder.order.length) {

					setTimeout(function(pt, pi, oo) {
						return function() {
							pm.collections.trigger("sortRequestContainer", pt, pi, oo);
						}
					}(parentType, parentId, objectWithOrder.order), 1000);

				}
 			});
		});
	},

	//TODO: Change
	getResponsesForRequest: function(requestId, ownerId) {
		pm.syncSocket.get("/"+postman_sync_api_version+"/response?request="+requestId+"&owner="+ownerId, function(res) {
			if(res.error && res.error.message) {
				//console.log(pm.syncLogger.getLogDate() + "Error getting responses for request: " + requestId + ". Reason:" + res.error.message);
				return;
			}
			if(res.length==0) {
				//console.log("No responses for this request");
				return;
			}
			//console.log(pm.syncLogger.getLogDate() + " - " +"GET complete", res);
			pm.collections.addResponsesToCollectionRequestWithoutSync(requestId, res, function() {});
		});
	}
});

