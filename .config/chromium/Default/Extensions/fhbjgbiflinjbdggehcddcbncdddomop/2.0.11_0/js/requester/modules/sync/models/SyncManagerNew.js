var SyncManagerNew = Backbone.Model.extend({
    defaults: function() {
        return {
            unsyncedChanges: [],
            syncConflicts: null,
            loggedIn: false,
            socketConnected: false,
            sinceId: 0,
            syncFinished: false,
            finishedLoading: {
                environments: false,
                collections: false,
                history: false,
                globals: false
            },
            connectingToSocket: false,
            syncEnabled: false
        };
    },


    // Fixed
    initialize: function() {
        //Don't init syncManager if this is the test runner app
        if(window.hasOwnProperty("TestRunApp")) {
            return;
        }

        //GLOBAL SYNC FLAG
        pm.mediator.on("setSync", this.setSync, this);

        this.showServerErrors = false;

        this.sentChanges = [];
        this.retrySentChangesInterval = null;
        this.lastKeyTried = null;
        this.lastKeyCount = 0;

        this.serverChanges = new PriorityQueue({ comparator: function(r1,r2) {
            return (r1.revision - r2.revision);
        }});

        this.clientChangesReadyToBeSent = [];
        this.set("loginAttempts", 0);

        pm.mediator.on("databaseOperationComplete", function() {
            pm.syncLogger.log(new Error(),"Database operation complete...checking for next item in sync queue");
            if(pm.syncQueue.length===0) {
                pm.syncLogger.log(new Error(),"Sync queue is empty");
                return;
            }
            pm.syncQueue.shift();
            if(pm.syncQueue.length===0) {
                pm.syncLogger.log(new Error(),"Sync queue had one operation, which was already completed");
                return;
            }

            pm.syncLogger.log(new Error(),"Executing next function...");
            var funcToExecute = pm.syncQueue[0];
            funcToExecute();
        });



	    pm.mediator.on("syncOperationDone", function() {
            return;
		    if(pm.syncManager.get("loggedIn") === true) {
//				pm.syncManager._processNextServerChange();
			    //pm.syncManager._saveNextServerChange();
		    }
	    });

        pm.mediator.on("syncOperationFailed", function(err) {
            pm.syncLogger.error("Sync Operation Failed. Reason: " + JSON.stringify(err));
            //take the first item, add it to the end
            if(pm.syncQueue.length===0) {
                return;
            }
            var failedItem = pm.syncQueue.shift();
            //pm.syncQueue.push(failedItem);
            if(pm.syncQueue.length===0) {
                return;
            }
            var funcToExecute = pm.syncQueue[0];
            funcToExecute();
        });

	    pm.mediator.on("syncClientChanges", this.onSyncClientChanges, this);

        pm.mediator.on("clearSystemValues", this.onClearSystemValues, this);

        this.on("itemLoaded", this.itemLoaded, this);

        this.on("singleSyncDone", this._syncFirstClientChange, this);

        this.updateSince(); //should stay in this file
        this.set("loggedIn",false);
        this.set("finalRevisionNumber",-1);
        this.set("csrfToken","");
        this.createSocket();

        this.set("allClientChangesSynced", false);
    },

    setSync: function(syncEnabled) {
        this.syncEnabled = syncEnabled;
        if(syncEnabled == true) {
            this.signIn();
        }
    },

    onClearSystemValues: function() {
        this.set("since",{own:0});
        this.set("lastTimestamp",null);
        pm.indexedDB.deleteAllSyncValues(function() {
            //pm.syncStatusManager.clearNotifs();
        });
    },

    itemLoaded: function(item) {
        var currentLoaded = this.get("finishedLoading");
        currentLoaded[item]=true;
        this.set("finishedLoading", currentLoaded);
        this.signIn();
    },

    hasDatabaseLoaded: function() {
        var currentLoaded = this.get("finishedLoading");
        for(var prop in currentLoaded) {
            if(currentLoaded.hasOwnProperty(prop)) {
                if(currentLoaded[prop]===false) {
                    return false;
                }
            }
        }
        return true;
    },

    createSocket: function() {
        if(!this.syncEnabled) return;
        pm.syncLogger.log(new Error(),"Trying to connect to socket: " + postman_syncserver_url);
        pm.syncSocket = io.connect(postman_syncserver_url);
        this.set("connectingToSocket", true);
        this.attachListeners();
    },

    //call when and how - pass the model to some view.
    //or include this code there directly
    signIn: function() {
        if(!this.syncEnabled) {
            pm.syncLogger.log(new Error(),"Sync is not enabled...cannot proceed with sign in");
            return;
        }

        if(pm.isTesting===true && (pm["hasStartedSyncTest"] !== true)) {
            return;
        }

        pm.syncLogger.log(new Error(),"Attempting to sign in...");
        //if you are already logged in to the socket
        if(this.get("loggedIn")===true) {
            pm.syncLogger.log(new Error(),"The user is already logged in to anakin...cannot sign in again");
            return;
        }

        //if you're not logged in to postman
        if(pm.user.isLoggedIn()===false && pm.isTesting===false) {
            pm.syncLogger.log(new Error(),"The user isn't logged in to Postman...cannot sign in to anakin");
            return;
        }

        //if all object have not been loaded
        if(this.hasDatabaseLoaded()===false) {
            pm.syncLogger.log(new Error(),"Database hasn't loaded yet...cannot sign in to anakin");
            return;
        }

        //if the socket object doesn't exist
        if(pm.syncSocket==null) {
            pm.syncLogger.log(new Error(),"Socket doesn't exist - will try after connection is established");
            this.createSocket();
            return;
        }

        //if the socket hasn't been connected yet
        if(this.get("socketConnected")===false) {
            pm.syncLogger.log(new Error(),"Socket connection is not established yet...you will be signed in to sync as soon as the socket is connected");
            if(this.get("connectingToSocket")===false && pm.syncSocket===null) {
                this.createSocket();
            }
            else if(this.get("connectingToSocket")===false) {
                pm.syncSocket.socket.reconnect();
            }
            return;
        }

        if(this.get("loggingIn")===true) {
            pm.syncLogger.log(new Error(),"Sync login is already in progress");
            return;
        }


        var oldThis=this;

        var testUserId = (pm.isTesting===true)?'test':'1';
        var testAccessToken = (pm.isTesting===true)?'test':'xyz';

        var userId = (postman_env==="local")?testUserId:pm.user.id;
        var accessToken = (postman_env==="local")?testAccessToken:pm.user.get("access_token");

        this.set("loggingIn",true);

        setTimeout(function() {
            if(pm.syncManager.get("loggingIn") && !pm.syncManager.get("loggedIn")) {
                //still not logged in
                var loginsAttempted = oldThis.get("loginAttempts");
                if(loginsAttempted > 5) {
                    noty(
                        {
                            type: 'error',
                            text: 'Oops. We\'re having trouble connecting you to the Sync service. Please try after some time',
                            layout: 'topCenter',
                            timeout: 3050
                        }
                    );
                    oldThis.set("loginAttempts", 0);
                    return;
                }
                oldThis.set("loginAttempts", loginsAttempted+1);
                pm.syncManager.set("loggingIn", false);
                pm.syncManager.signIn();
            }
        },10000);

        pm.syncLogger.log(new Error(),"Sending login request with user_id="+userId+", access_token="+accessToken);

        pm.syncSocket.get('/csrfToken', function(res) {
            //oldThis.set("csrfToken", encodeURIComponent(res["_csrf"]));
            oldThis.set("csrfToken", (res["_csrf"]));
            pm.syncSocket.post('/'+postman_sync_api_version+'/session/create', {user_id: userId, access_token: accessToken, _csrf: res["_csrf"]}, function (resData) {
                oldThis.set("syncFinished", false);
                oldThis.set("loginAttempts", 0);
                if(resData.error) {
                    pm.syncLogger.log(new Error(),"Login failure - " + resData.error.description);
                    oldThis.set("loggingIn",false);
                    oldThis.set("loggedIn",false);
                }
                else {
                    pm.syncLogger.log(new Error(),"Logged in: ...");
                    pm.syncLogger.log(new Error(),resData);
                    oldThis.set("loggedIn",true);
                    oldThis.set("loggingIn",false);
                    oldThis.checkAllSync();
                    oldThis.requestInitialSync();
                }
            });
        });
    },

    checkAllSync: function() {
        if(!pm.settings.getSetting("syncedOnce")) {
            pm.mediator.trigger("syncAllObjects");
            pm.settings.setSetting("syncedOnce", true);
        }
    },

    signOut: function() {
        if(!this.syncEnabled) return;

        var oldThis=this;
        if(pm.syncSocket==null) {
            pm.syncLogger.log(new Error(),"Socket doesn't exists - cannot sign out");
            this.set("loggedIn",false);
            this.set("connectingToSocket", false);
            return;
        }


        if(this.get("connectingToSocket")===true || this.get("loggedIn")===false) {
            pm.syncLogger.log(new Error(),"Already connecting, or user isn't loggedIn...cannot sign out");
            return;
        }

        pm.syncSocket.get('/'+postman_sync_api_version+'/session/destroy', function (resData) {
            pm.syncLogger.log(new Error(),"Logged out: ");
            pm.syncLogger.log(new Error(),resData);
            oldThis.set("loggedIn",false);
            oldThis.set("socketConnected", false);
            oldThis.set("connectingToSocket", false);
            oldThis.syncEnabled = false;
            pm.syncSocket.disconnect();
        });
    },

    updateSinceFromMessage: function(message) {
        if(message.revision!=null && (typeof message.revision !== "undefined")) {
            var currentTimestamp = (new Date()).getTime();
            pm.indexedDB.updateSince(message.revision,currentTimestamp, function() {
                pm.syncLogger.log(new Error(),"SinceId updated to "+message.revision+", timestamp updated to " + currentTimestamp);
                pm.syncManager.set("sinceId", message.revision);
                pm.syncManager.set("since", {own: message.revision});
                pm.syncManager.set("lastTimestamp", currentTimestamp);
            });
        }
        else {
            if(message.action==="subscribe" || message.action==="unsubscribe") {
                //console.log(pm.syncLogger.getLogDate() + " - " +"No revisionId received for subscribe/unsubscribe");
            }
            else if(message.hasOwnProperty("model_id") && message.hasOwnProperty("owner")) {
                //console.log(pm.syncLogger.getLogDate() + " - " +"No revisionId received for subscribe/unsubscribe");
            }
            else {
                if(!message.error || !(message.error.name==="instanceFoundError")) {
                    //dont throw errors for duplication
                    if(message.error === "CSRF mismatch") {
                        pm.syncSocket.get('/csrfToken', function(res) {
                            pm.syncManager.set("csrfToken", (res["_csrf"]));
                        });
                    }
                    pm.syncLogger.error("Invalid sinceId received. Message: " + JSON.stringify(message));
                    pm.syncLogger.log(new Error(), "Invalid sinceId received. Message: ");
                    pm.syncLogger.log(new Error(), message);
                }

                //if it is instanceNotFound, ask them to duplicate it
                if(message.error && message.error.name=="instanceNotFoundError" && message.error.details && message.error.details.model) {
                    var modelName = message.error.details.model;
                    var additionalInfoForRequest = (modelName=="folder" || modelName=="collection")
                        ?"If you were working on a request, duplicate the parent folder or collection.":"";

                    var errorMsg = "The " + modelName + " was not found. Try duplicating it. " + additionalInfoForRequest;
                    pm.syncLogger.error("Notifying the user to duplicate the " + modelName);
                    if(pm.syncManager.showServerErrors) {
                        noty(
                            {
                                type: 'error',
                                text: errorMsg,
                                layout: 'topCenter',
                                timeout: 3050
                            }
                        );
                    }
                }
                else {
                    if(pm.syncManager.showServerErrors) {
                        var error_msg = (message.err && message.err.error) ? message.err.error : ((message.error) ? message.error.message : "Unknown error");
                        noty(
                            {
                                type: 'error',
                                text: error_msg,
                                layout: 'topCenter',
                                timeout: 1050
                            }
                        );
                    }
                }
            }
        }
    },

    updateSince: function() {
        var oldThis=this;
        pm.indexedDB.getSince(function(a) {
            //a will be an array (own: 2, u1:c1: 4...)
            if(a==null || (typeof a === "undefined")) {
                pm.syncLogger.log(new Error(),"sinceId not updated. Obj from db: ");
                pm.syncLogger.log(new Error(),a);
            }
            var sinceObject = {};
            _.map(a, function(elem) {
                sinceObject[elem.id] = elem.value;
            });
            oldThis.set("since", sinceObject);
            oldThis.set("lastTimestamp", (new Date()).getTime());//a.timestamp);
        });
    },

    /**
     * @description called ONLY when signIn is successful
     */
    requestInitialSync: function() {
        if(!this.syncEnabled) return;

        pm.syncLogger.log(new Error(),"Making initial since request");
        var sinceId = this.get("since").own || 0;
        var lastTimestamp = this.get("lastTimestamp");
        this._sendSyncRequest(sinceId, lastTimestamp, 40000, -1);
    },

    /**
     * @description This sends the initial sync request to POST /sync, which gets a paginated list of server-side changes (S). Will be called after sign in
     * @param lastRevisionNumber
     * @param lastTimestamp
     * @param maxEntries
     * @param finalRevisionNumber
     * @private
     */
    _sendSyncRequest: function(lastRevisionNumber, lastTimestamp, maxEntries, finalRevisionNumber) {
        if(!this.syncEnabled) return;

        var syncRequestObject = {};
        syncRequestObject["since_id"] = lastRevisionNumber
        syncRequestObject["since_timestamp"] = lastTimestamp;
        syncRequestObject["count"] = maxEntries;
        syncRequestObject["_csrf"] = this.get("csrfToken");
        pm.syncLogger.log(new Error(),"Making /sync request with obj: ...");
        pm.syncLogger.log(new Error(),syncRequestObject);
        if(finalRevisionNumber!==-1) {
            //syncRequestObject["max_id"] = finalRevisionNumber;
        }
        var oldThis = this;
        pm.syncSocket.post("/"+postman_sync_api_version+"/session/sync",syncRequestObject,function(msg) {
            pm.syncLogger.log(new Error(),"Sync response received: ");
            pm.syncLogger.log(new Error(),msg);
            oldThis._handleNewSyncResponse(msg);
        });
    },

    /**
     * @description This adds all server changes to the server queue, makes an additional sync call if needed, and starts processing
     * @param message
     * @private
     */
    _handleNewSyncResponse: function(message) {
        pm.syncLogger.log(new Error(),"Handling sync response: ");
        pm.syncLogger.log(new Error(),message);

        if(message.own) {
            var finalRevisionNumberToExpect = message.own.max_id;
            var lastSinceId = message.own.last_since_id;
            if(lastSinceId!==-1) {
                var messageForSinceUpdate = {"revision":lastSinceId};
                //Since ID update not requred here. It'll be updated when the individual server changes are saved
                //this.updateSinceFromMessage(messageForSinceUpdate);
            }

            this.set("finalRevisionNumber", finalRevisionNumberToExpect);

            var changes = _.filter(message.own.entities, function(entity) {
                return !(entity["action"]==="subscribe");
            });
            changes = changes.concat(_.map(message.subscribe.entities, function(entity) {
                entity["subscribe"]=true;
                return entity;
            }));

            var numChanges = changes.length;
            var currentMaxRevision = 0;
            for(var i=0;i<numChanges;i++) {
                //this change will have a revisionNumber and a changeset
                if(!changes[i].hasOwnProperty("meta")) {
                    pm.syncLogger.log(new Error(),"Server change did not have meta field. " + JSON.stringify(changes[i]));
                    continue;
                }

                this.serverChanges.queue(changes[i]);
                if(changes[i].revision > currentMaxRevision) {
                    currentMaxRevision = changes[i].revision;
                }
            }

            //TODO:!!!!! fix this
            if(false) {//currentMaxRevision < finalRevisionNumberToExpect) {
                pm.syncLogger.log(new Error(),"Sync results not complete, requesting another page. This is a problem!!");
                pm.syncLogger.error("Sync results not complete - FATAL");
                this._sendSyncRequest(currentMaxRevision, (new Date()).getTime(), 40000, finalRevisionNumberToExpect);
            }
            else {
                //ONLY start processing the S queue once all S requests have arrived
                //or, put it outside the else ? :S
                this.set("initialSyncComplete",true); //this means that the S changes have been received
                pm.mediator.trigger('resolveConflicts',this.serverChanges);
            }
        }
        else {
            console.error("Failure to sync.");
            noty(
                {
                    type: 'error',
                    text: 'There was an error while syncing. Please sign out (clear data), and sign back in',
                    layout: 'topCenter',
                    timeout: 3050
                }
            );
            pm.syncLogger.error("Sync operation returned malformed message (no message.own): " + JSON.stringify(message));
        }

    },

    //is called during the initial sync operation
    onSyncClientChanges: function(allUnsyncedChanges, stream) {
        var unsyncedChanges = _.filter(allUnsyncedChanges, function(changeset) {
            if(!stream || changeset.stream===stream) {
                return true;
            }
        });

        if(unsyncedChanges.length === 0) {
            //all client changes have been synced
            this.trigger("syncFinished");
            this.set("allClientChangesSynced", true);
        }
        else {
            var changeToSync = unsyncedChanges[0];
            //console.log(pm.syncLogger.getLogDate() + " - " +"Change to sync to server: ");
            //console.log(pm.syncLogger.getLogDate() + " - " + changeToSync.id + ", " + changeToSync.verb);
            this._syncClientChange(changeToSync, stream);
        }
    },

	_syncClientChange: function(changeToSync, stream) {
        if(!this.syncEnabled) return;

        //check serverChanges.length===0
        pm.syncLogger.log(new Error(),"Syncing client change to sever...");
        pm.syncLogger.log(new Error(),"Change so sync: ");
        pm.syncLogger.log(new Error(),changeToSync);
        var verb = changeToSync.verb;
        var entity = changeToSync.entity;
        var data = changeToSync.data;
        var meta = changeToSync.meta;
        if(verb==="transfer" && data && data.id!=null) {
            meta = data.id;
        }
        if(verb==="unsubscribe" && data && data.id!=null) {
            meta = data.id;
        }

        //set the right owner
        //for folders
        if(!data.hasOwnProperty("owner")) {
            if (data.hasOwnProperty("collection")) {
                var collection = pm.collections.getCollectionById(data.collection);
                if(collection) {
                    data.owner = pm.collections.getCollectionById(data.collection).get("owner");
                }
            }
            //for collections
            if (entity === "collection") {
                var collection = pm.collections.getCollectionById(data.id);
                if(collection) {
                    data.owner = pm.collections.getCollectionById(data.id).get("owner");
                }
            }
            //for requests
            if (entity === "request") {
                var request = pm.collections.getRequestById(data.id);
                if(request) {
                    data.owner = pm.collections.getRequestById(data.id).owner;
                }
            }
        }

        this._syncClientChangeToServer(verb, entity, data, meta, false, stream, null);
    },


    _getInitSynObject: function(since, changes) {
        var ret = {};
        ret["since_id"]=since;
        var clientData = [];
        var numChanges = changes.length;
        for(var i=0;i<numChanges;i++) {
            var change = changes[i];
            var model = change.entity;
            var model_id = change.data.id;
            var action = change.verb;
            var data = change.data;
            clientData.push({
                "model": model,
                "model_id": model_id,
                "action": action,
                "data": data
            });
        }
        ret["client_data"] = clientData;
        return ret;
    },

    executeOrAddFunctionToQueue: function(func) {
		pm.syncQueue.push(func);
        if(pm.syncQueue.length==1) {
        	var funcToExec = pm.syncQueue.shift();
			funcToExec();
        }
    },

    //Since the serverhas now moved action and model to the meta property.
    handleNewMessageFormat: function(message) {
        if(!message.hasOwnProperty("meta")) {
                return;
            }

            message.model = message.meta.model;
        message.action = message.meta.action;
    },

    attachListeners: function() {
        if(!this.syncEnabled) return;

        if(pm.syncSocket==null) return;
        pm.syncLogger.log(new Error(),"Attaching listeners to socket.");
        var syncManager = this;
        pm.syncSocket.on('connect', function socketConnected() {
                pm.syncManager.set("connectingToSocket", false);
                pm.syncManager.set("socketConnected",true);
                pm.syncSocket.on('user', function (message) {
					//console.log(pm.syncLogger.getLogDate() + " - " +"Not listening to user events");
                });

                pm.syncSocket.on('subscribe',function(message) {
                    syncManager.handleNewMessageFormat(message);
                    //console.log(pm.syncLogger.getLogDate() + " - " +"subscribe_collection: ",message);
                    pm.syncManager.executeOrAddFunctionToQueue(function() {
                        //TODO: check for errors here
                        pm.mediator.trigger("syncChangeReceived","subscribe",message);
                    });
                });

                pm.syncSocket.on('unsubscribe',function(message) {
                    syncManager.handleNewMessageFormat(message);
                    //console.log(pm.syncLogger.getLogDate() + " - " +"unsubscribe_collection: ",message);
                    pm.syncManager.executeOrAddFunctionToQueue(function() {
                        pm.mediator.trigger("syncChangeReceived","unsubscribe",message);
                    });
                });

                pm.syncSocket.on('create',function(message) {
                    syncManager.handleNewMessageFormat(message);
                    //console.log(pm.syncLogger.getLogDate() + " - " +"Created: ",message);
	                pm.syncManager.executeOrAddFunctionToQueue(function() {
						pm.mediator.trigger("syncChangeReceived","create",message);
	                });
                });

                pm.syncSocket.on('update',function(message) {
                    syncManager.handleNewMessageFormat(message);
                    //console.log(pm.syncLogger.getLogDate() + " - " +"Updated: ",message);
	                pm.syncManager.executeOrAddFunctionToQueue(function() {
		                pm.mediator.trigger("syncChangeReceived","update",message);
	                });
                });

                pm.syncSocket.on('destroy',function(message) {
                    syncManager.handleNewMessageFormat(message);
                    //console.log(pm.syncLogger.getLogDate() + " - " +"Destroyed: "+message);
	                pm.syncManager.executeOrAddFunctionToQueue(function() {
		                pm.mediator.trigger("syncChangeReceived","destroy",message);
	                });
                });

                pm.syncSocket.on('history',function(message) {
                    syncManager.handleNewMessageFormat(message);
                    pm.syncLogger.log(new Error(),["History: ", message]);
	                pm.syncManager.executeOrAddFunctionToQueue(function() {
		                pm.mediator.trigger("syncChangeReceived","history",message);
	                });
                });

                pm.syncSocket.on('transfer', function(message) {
                    syncManager.handleNewMessageFormat(message);
                    pm.syncLogger.log(new Error(),"Transfer notif received");
                    if(message.revision!=null) {
                        pm.syncManager.updateSinceFromMessage(message);
                    }
	                pm.syncManager.executeOrAddFunctionToQueue(function() {
		                pm.mediator.trigger("syncChangeReceived","transfer",message);
	                });
                });

                pm.syncSocket.on('disconnect', function () {
                    pm.syncLogger.log(new Error(),'Socket is now disconnected!');
                    syncManager.set("loggedIn",false);
                });

                if(pm.user.isLoggedIn()===true) {
                    pm.syncManager.signIn();
                }

        });
    },

    /**
     * @description - invoked after a single client->server message's response has been received. may be a realtime event,
     * or one sent after the user has logged in (as part of the sync flow). In the latter case, unsyncedChange[0] will be deleted
     * @param realtime
     * @param callback
     * @private
     */
    _clearClientChangeIfNeeded: function(realtime, stream, callback) {
	    //only delete the unsynced change IF the change is not a realtime change
	    pm.mediator.trigger("singleUnsyncedChangeSynced", realtime, stream);
        //console.log(pm.syncLogger.getLogDate() + " - " +"Successfully sent client change to server");
	    callback();
    },

    getEntityFromId: function (entity, id, ownerId, secondArgument, callback) {
        if(!this.syncEnabled) return;

        pm.syncSocket.get("/"+postman_sync_api_version+"/"+entity+"/"+id+"?owner="+ownerId, function(res) {
            //console.log(pm.syncLogger.getLogDate() + " - " +"GET complete", res);
            callback(res, secondArgument);
        });
    },

    getEntityForCollection: function(entity, ownerId, collectionId, callback) {
        if(!this.syncEnabled) return;

        pm.syncSocket.get("/"+postman_sync_api_version+"/"+entity+"?collection="+collectionId+"&owner="+ownerId, function(res) {
            //console.log(pm.syncLogger.getLogDate() + " - " +"GET complete", res);
            callback(res);
        });
    },


    /**
     * @description handle custom error names as sent by anakin
     * @param res
     * @private
     */
    _handleErrorObject: function(res) {
        //error received from sync server
        //add custom handlers for various error types - https://bitbucket.org/postmanlabs/postman-sync-server/src/dd57827802a5a0d607058a980ab7e18fa5c3939a/api/services/Errors.js?at=master
        //if()
    },

    handleInstanceNotFound: function(details) {
        if(!details) {
            pm.syncLogger.error("Sobti - No details received for instanceNotFound");
        }
        var status = true;
        switch(details.model) {
            case "collection":
                status = pm.collections.resyncCollectionId(details.model_id);
                break;
            case "folder":
                status = pm.collections.resyncFolderId(details.model_id);
                break;
            case "request":
                status = pm.collections.resyncRequestId(details.model_id);
                break;
            default:
                pm.syncLogger.error("instanceNotFound recd for model: " + details.model);
                break;
        }
        return status;
    },

    _syncClientChangeToServer: function (verb, entity, data, meta, realtime, stream, unsyncedKey) {
        var oldThis = this;

        var testUserId = (pm.isTesting===true)?'test':'1';
        var userId = (postman_env==="local")?testUserId:pm.user.id;

        if(data) {
            data["_csrf"] = this.get("csrfToken");
        }

        switch (verb) {
            case 'share':
                pm.syncSocket.put("/"+postman_sync_api_version+"/collection/share/"+meta, data, function(realtime, stream, data) {
                  return function(res) {
                      var clearChange = true;
                      if(res.hasOwnProperty("error")) {
                          if(res.error.name === "instanceFoundError") {
                              //ignore for now
                          }
                          else {
                              pm.syncManager._handleErrorObject(res);
                              pm.mediator.trigger("syncErrorReceived", "share", res);

                              if (res.error.name === "instanceNotFoundError") {
                                  var status = oldThis.handleInstanceNotFound(res.error.details);
                                  if(status === false) {
                                      clearChange = true;
                                      //nothing we can do  - clear the unsynced change (since the parent instance was not found)
                                  }
                                  else {
                                      clearChange = false;
                                  }
                              }
                              else {
                                  pm.syncLogger.error("Error while sending share event to server. Data: " + JSON.stringify(data));
                              }

                              if(res.error === "CSRF mismatch") {
                                  clearChange = false;
                              }
                          }
                      }

                      if(clearChange) {
                          pm.syncManager._handleServerResponseAfterSendingClientChange(res, realtime, stream);
                          oldThis.sentChanges = _.reject(oldThis.sentChanges, function (obj) {
                              return obj.key === unsyncedKey
                          });
                      }
                  }
                }(realtime, stream, data, unsyncedKey));
                break;
            case 'unshare':
                pm.syncSocket.put("/"+postman_sync_api_version+"/collection/unshare/"+meta, {_csrf: oldThis.get("csrfToken")}, function(realtime, stream, meta) {
                    return function(res) {
                        var clearChange = true;
                        if(res.hasOwnProperty("error")) {
                            if(res.error.name === "instanceFoundError") {
                                //ignore for now
                            }
                            else {
                                pm.syncManager._handleErrorObject(res);

                                if (res.error.name === "instanceNotFoundError") {
                                    var status = oldThis.handleInstanceNotFound(res.error.details);
                                    if(status === false) {
                                        clearChange = true;
                                        //nothing we can do  - clear the unsynced change (since the parent instance was not found)
                                    }
                                    else {
                                        clearChange = false;
                                    }
                                }
                                else {
                                    pm.syncLogger.error("Error while sending unshare event to server. Meta: " + meta);
                                }

                                if(res.error === "CSRF mismatch") {
                                    clearChange = false;
                                }
                            }
                        }

                        if(clearChange) {
                            pm.syncManager._handleServerResponseAfterSendingClientChange(res, realtime, stream);
                            oldThis.sentChanges = _.reject(oldThis.sentChanges, function (obj) {
                                return obj.key === unsyncedKey
                            });
                        }
                    }
                }(realtime, stream, meta, unsyncedKey));
                break;
            case 'create':
                if(entity==="collection" && !data.owner) {
                    pm.collections.updateCollectionOwnerWithoutSync(data.id, userId);
                }

                var optOwner = "";
                if(data.owner) optOwner = "?owner="+data.owner;
                
                pm.syncSocket.post('/'+postman_sync_api_version+'/' + entity + optOwner, data, function(realtime, stream, data) {
                    return function(res) {
                        var clearChange = true;
                        if(res.hasOwnProperty("error")) {
                            if(res.error.name === "instanceFoundError") {
                                //ignore for now
                            }
                            else {
                                pm.syncManager._handleErrorObject(res);
                                if (res.error.name === "instanceNotFoundError") {
                                    var status = oldThis.handleInstanceNotFound(res.error.details);
                                    if(status === false) {
                                        clearChange = true;
                                        //nothing we can do  - clear the unsynced change (since the parent instance was not found)
                                    }
                                    else {
                                        clearChange = false;
                                    }
                                }
                                else {
                                    pm.syncLogger.error("Error while sending create event to server. Data: " + JSON.stringify(data));
                                }

                                if(res.error === "CSRF mismatch") {
                                    clearChange = false;
                                }
                            }
                        }

                        if(clearChange) {
                            pm.syncManager._handleServerResponseAfterSendingClientChange(res, realtime, stream);
                            oldThis.sentChanges = _.reject(oldThis.sentChanges, function (obj) {
                                return obj.key === unsyncedKey
                            });
                        }
                    }
                }(realtime, stream, data, unsyncedKey));

                break;
            case 'update':
                if (entity == "user") {
                    data.id = userId;
                }
                pm.syncSocket.put('/'+postman_sync_api_version+'/' + entity + '/' + data.id, data, function(realtime, stream, data) {
                    return function(res) {
                        var clearChange = true;
                        if(res.hasOwnProperty("error")) {
                            if (res.error.name === "instanceFoundError") {
                                //ignore for now
                            }
                            else {
                                pm.syncManager._handleErrorObject(res);
                                if (res.error.name === "instanceNotFoundError") {
                                    var status = oldThis.handleInstanceNotFound(res.error.details);
                                    if(status === false) {
                                        clearChange = true;
                                        //nothing we can do  - clear the unsynced change (since the parent instance was not found)
                                    }
                                    else {
                                        clearChange = false;
                                    }
                                }
                                else if(res.error.name === "orderUpdateError") {
                                    //while updating a folder or collection
                                    if(data.hasOwnProperty("collection")) {
                                        //it's a folder
                                        var folderId=data.id;
                                        pm.collections.resyncFolderId(folderId);
                                        clearChange = pm.collections.correctFolderOrder(folderId, res.error.details.order, data.order, data.owner);
                                    }
                                    else {
                                        clearChange = pm.collections.correctCollectionOrder(data.id, res.error.details.order, data.order, data.owner);
                                    }
                                }
                                else {
                                    pm.syncLogger.error("Error while sending update event to server. Data: " + JSON.stringify(data));
                                }

                                if(res.error === "CSRF mismatch") {
                                    clearChange = false;
                                }
                            }
                        }

                        if(clearChange) {
                            pm.syncManager._handleServerResponseAfterSendingClientChange(res, realtime, stream);
                            oldThis.sentChanges = _.reject(oldThis.sentChanges, function (obj) {
                                return obj.key === unsyncedKey
                            });
                        }
                    }
                }(realtime, stream, data, unsyncedKey));
                break;
            case 'destroy':
                var optOwner = "?";
                if(data.owner) optOwner = "?owner="+data.owner;

                pm.syncSocket.delete('/'+postman_sync_api_version+'/' + entity + '/' + data.id + optOwner,{_csrf: oldThis.get("csrfToken")}, function(realtime, stream, data) {
                    return function(res) {
                        var clearChange = true;
                        if(res.hasOwnProperty("error")) {
                            pm.syncManager._handleErrorObject(res);
                            if(res.error.name === "instanceNotFoundError") {
                                //oldThis.handleInstanceNotFound(res.error.details);
                                clearChange = true; //always clear the change if instanceNotFound while deleting
                            }
                            else {
                                pm.syncLogger.error("Error while sending destroy event to server. Data: " + JSON.stringify(data));
                            }

                            if(res.error === "CSRF mismatch") {
                                clearChange = false;
                            }
                        }

                        if(clearChange) {
                            pm.syncManager._handleServerResponseAfterSendingClientChange(res, realtime, stream);
                            oldThis.sentChanges = _.reject(oldThis.sentChanges, function (obj) {
                                return obj.key === unsyncedKey
                            });
                        }
                    }
                }(realtime, stream, data, unsyncedKey));
                break;
            case 'history':
                pm.syncSocket.post('/'+postman_sync_api_version+'/user/history', data, function(realtime, stream, data) {
                    return function(res) {
                        var clearChange = true;
                        if(res.hasOwnProperty("error")) {
                            pm.syncManager._handleErrorObject(res);

                            if(res.error.name === "instanceNotFoundError") {
                                var status = oldThis.handleInstanceNotFound(res.error.details);
                                if(status === false) {
                                    clearChange = true;
                                    //nothing we can do  - clear the unsynced change (since the parent instance was not found)
                                }
                                else {
                                    clearChange = false;
                                }
                            }
                            else {
                                pm.syncLogger.error("Error while sending history event to server. Data: " + JSON.stringify(data));
                            }

                            if(res.error === "CSRF mismatch") {
                                clearChange = false;
                            }

                        }

                        if(clearChange) {
                            pm.syncManager._handleServerResponseAfterSendingClientChange(res, realtime, stream);
                            oldThis.sentChanges = _.reject(oldThis.sentChanges, function (obj) {
                                return obj.key === unsyncedKey
                            });
                        }
                    }
                }(realtime, stream, data, unsyncedKey));
                break;
            case 'transfer':
                pm.syncSocket.put('/'+postman_sync_api_version+'/request/transfer/'+meta, data, function(realtime, stream, data) {
                    return function(res) {
                        var clearChange = true;
                        if(res.hasOwnProperty("error")) {
                            pm.syncManager._handleErrorObject(res);
                            if(res.error.name === "instanceNotFoundError") {
                                var status = oldThis.handleInstanceNotFound(res.error.details);
                                if(status === false) {
                                    clearChange = true;
                                    //nothing we can do  - clear the unsynced change (since the parent instance was not found)
                                }
                                else {
                                    clearChange = false;
                                }
                            }
                            else {
                                pm.syncLogger.error("Error while sending transfer event to server. Data: " + JSON.stringify(data));
                            }

                            if(res.error === "CSRF mismatch") {
                                clearChange = false;
                            }
                        }

                        if(clearChange) {
                            pm.syncManager._handleServerResponseAfterSendingClientChange(res, realtime, stream);
                            oldThis.sentChanges = _.reject(oldThis.sentChanges, function (obj) {
                                return obj.key === unsyncedKey
                            });
                        }
                    }
                }(realtime, stream, data, unsyncedKey));
                break;
            case 'subscribe':
                pm.syncSocket.put('/'+postman_sync_api_version+'/' + entity + '/subscribe/'+meta, data, function(realtime, stream, data) {
                    return function(res) {
                        var clearChange = true;
                        if(res.hasOwnProperty("error")) {
                            pm.syncManager._handleErrorObject(res);
                            if(res.error.name === "instanceNotFoundError") {
                                var status = oldThis.handleInstanceNotFound(res.error.details);
                                if(status === false) {
                                    clearChange = true;
                                    //nothing we can do  - clear the unsynced change (since the parent instance was not found)
                                }
                                else {
                                    clearChange = false;
                                }
                            }
                            else {
                                pm.syncLogger.error("Error while sending subscribe event to server. Data: " + JSON.stringify(data));
                            }

                            if(res.error === "CSRF mismatch") {
                                clearChange = false;
                            }
                        }

                        if(clearChange) {
                            pm.mediator.trigger("successfulSubscribe", res);
                            pm.syncManager._handleServerResponseAfterSendingClientChange(res, realtime, stream);
                            oldThis.sentChanges = _.reject(oldThis.sentChanges, function (obj) {
                                return obj.key === unsyncedKey
                            });
                        }
                    }
                }(realtime, stream, data, unsyncedKey));
                break;
            case 'unsubscribe':
                pm.syncSocket.put('/'+postman_sync_api_version+'/' + entity + '/unsubscribe/' + meta, data, function(realtime, stream, data) {
                    return function(res) {
                        var clearChange = true;
                        if(res.hasOwnProperty("error")) {
                            pm.syncManager._handleErrorObject(res);
                            if(res.error.name === "instanceNotFoundError") {
                                var status = oldThis.handleInstanceNotFound(res.error.details);
                                if(status === false) {
                                    clearChange = true;
                                    //nothing we can do  - clear the unsynced change (since the parent instance was not found)
                                }
                                else {
                                    clearChange = false;
                                }
                            }
                            else {
                                pm.syncLogger.error("Error while sending unsubscribe event to server. Entity: " + entity+", Data: " + JSON.stringify(data));
                            }

                            if(res.error === "CSRF mismatch") {
                                clearChange = false;
                            }
                        }

                        if(clearChange) {
                            pm.mediator.trigger("successfulUnsubscribe", res);
                            pm.syncManager._handleServerResponseAfterSendingClientChange(res, realtime, stream);
                            oldThis.sentChanges = _.reject(oldThis.sentChanges, function (obj) {
                                return obj.key === unsyncedKey
                            });
                        }
                    }
                }(realtime, stream, data, unsyncedKey));
                break;
            default:
                pm.syncLogger.log(new Error(),"Invalid action: " + verb);
                pm.syncManager._handleServerResponseAfterSendingClientChange(null, null, stream);
                oldThis.sentChanges = _.reject(oldThis.sentChanges, function (obj) {
                    return obj.key === unsyncedKey
                });
                break;
        }
    },

    _handleServerResponseAfterSendingClientChange: function(res, realtime, stream) {
        pm.syncLogger.log(new Error(),["Response after sending data to server: ", res]);
        pm.syncManager._clearClientChangeIfNeeded(realtime, stream, function() {
            pm.syncManager.updateSinceFromMessage(res);
//	        pm.mediator.trigger("singleUnsyncedChangeSynced");
        });
    },

	checkSizeOfFields: function(entity, verb, data) {
		if(entity === "response" && verb==="create") {
			if(data.text && data.text.length > 60000) {
				noty(
					{
						type:'warning',
						text:'Response too large. The response "'+data.name+'" cannot be synced. The maximum length for the response text is 60000 characters',
						layout:'topCenter',
						timeout:5000
					});
				return false;
			}
		}

		else if(entity==="request") {
			if(data.rawModeData && data.rawModeData.length > 60000) {
				noty(
					{
						type:'warning',
						text:'Request data too large. The request "'+data.name+'" cannot be synced. The maximum length for the raw data is 60000 characters',
						layout:'topCenter',
						timeout:5000
					});
				return false;
			}

			if(data.preRequestScript && data.preRequestScript.length > 60000) {
				noty(
					{
						type:'warning',
						text:'Request data too large. The request "'+data.name+'" cannot be synced. The maximum length for the pre-request script is 60000 characters',
						layout:'topCenter',
						timeout:5000
					});
				return false;
			}

			if(data.tests && data.tests.length > 60000) {
				noty(
					{
						type:'warning',
						text:'Request data too large. The request "'+data.name+'" cannot be synced. The maximum length for the test script is 60000 characters',
						layout:'topCenter',
						timeout:5000
					});
				return false;
			}
		}

		return true;
	},

    addChangeset: function(entity, verb, data_orig, meta, syncImmediately) {
        if(!this.syncEnabled) return;

        var data = _.clone(data_orig);
        //data.timestamp=(new Date()).getTime();
        if(data!=null) {
            data.timestamp=new Date(data.timestamp);
        }

        var testUserId = (pm.isTesting===true)?'test':'1';
        var userId = (postman_env==="local")?testUserId:pm.user.id;

        pm.syncLogger.log(new Error(),["Changeset recorder - entity:",entity," verb:",verb," data:",data]);

        //Set owner in request and response
        if((entity==="request" || entity==="response") && !data.owner) {
            data.owner = pm.collections.getOwnerForCollection(data.collectionId);
            if(!data.owner || postman_env==="local") {
                data.owner = userId;
            }
        }

        //Set owner for folder
        else if((entity==="folder") && !data.owner) {
            data.owner = pm.collections.getOwnerForCollection(data.collection_id);
            if(!data.owner || postman_env==="local") {
                data.owner = userId;
            }
        }
        else if(verb === "create" && !data.owner && postman_env==="local") {
            data.owner = userId;
        }

	    //To preserve type of request.data
	    if(entity==="request") {
		    if(data["dataMode"]==="raw" && (typeof data["data"] === "string")) {
			    data["rawModeData"] = data["data"];
			    data["data"] = [];
		    }
	    }

	    //remove useless header descriptions
        if(entity==="response" && verb==="create") {
            var numHeaders = (data.headers)?data.headers.length:0;
            for(var i=0;i<numHeaders;i++) {
                data.headers[i].description="";
            }

            if(data.responseCode && data.responseCode.detail) {
                delete data.responseCode.detail;
            }
        }

        //ensure a method for requests
        if(entity==="request" && verb==="create") {
            if(!data.method) {
                data.method = "GET";
            }
        }

	    //set correct collectionid in child entities
        if((entity==="request" || entity==="folder" || entity==="response") && verb==="create") {
            data["collection"]=data["collectionId"];
            delete data["collectionId"];
        }

        if(entity==="request" && data.hasOwnProperty("helperAttributes") && (typeof data.helperAttributes === 'object')) {
            data.helperAttributes = JSON.stringify(data.helperAttributes);
        }

        if(entity==="request" && data.hasOwnProperty("folder") && !data.folder) {
            delete data.folder;
        }

	    if(entity==="request" && verb==="create" && data.hasOwnProperty("folderId") && !data.folder) {
		    data.folder = data.folderId;
	    }

	    //Adding check for SIZE
	    if(this.checkSizeOfFields(entity, verb, data) === false) {
		    console.log("One of the size checks failed. Not syncing");
		    return;
	    }

        //if((entity==="request" || entity==="response") && verb==="create") {
        //    data["owner"] = pm.collections.getOwnerForCollection(data_orig.collectionId);
        //}
        //---END HACKS

        if(entity==="folder" && (verb==="create" || verb==="update")) {
            data["collection"]=data["collection_id"];
            delete data["collection_id"];
        }

        if(entity==="collection" && verb==="create") {
            data["folders"] = [];
        }


        if(this.get("loggedIn")===false || syncImmediately===false || this.get("allClientChangesSynced")===false) {
            if(data==null) {
                data={'id':meta};
            }
            pm.mediator.trigger("addUnsyncedChange",entity, verb, data, meta, false);
        }
        else {
            if(data==null) {
                data={'id':meta};
            }

            try {
                //NOT adding to unsynced...screw it
                var unsyncedChangeKey = pm.localChanges.getUnsyncedChangeId(entity, verb, data, meta);
                //pm.mediator.trigger("addUnsyncedChange",entity, verb, data, meta, true);
                this.sentChanges.push({
                    key: unsyncedChangeKey,
                    changeset: {
                        entity: entity,
                        verb: verb,
                        data: data,
                        meta: meta
                    }
                });
                clearInterval(this.retrySentChangesInterval);
                var oldThis = this;
                this.retrySentChangesInterval = setInterval(function() {
                    oldThis.retrySentChanges();
                },5000);

                this._syncClientChangeToServer(verb, entity, data, meta, true, null, unsyncedChangeKey);
            }
            catch(e) {
                pm.syncLogger.error("SyncClientChangeToServer threw error. That means the socket wasnt connected properly. Adding to unsynced");
                //will be synced when connection is reestablished
            }
        }
    },

    retrySentChanges: function() {
        if(this.lastKeyCount > 3) {
            //add each to unsynced and clear timeout
            var numChanges = this.sentChanges.length;
            while(this.sentChanges.length) {
                var thisChange = this.sentChanges[0].changeset;
                pm.mediator.trigger("addUnsyncedChange",thisChange.entity, thisChange.verb, thisChange.data, thisChange.meta, true);
                this.sentChanges = this.sentChanges.splice(1);
            }
            this.lastKeyCount = 0;
            clearInterval(this.retrySentChangesInterval);
        }
        if(this.sentChanges.length > 0) {
            var changeKey = this.sentChanges[0].key;
            var thisChange = this.sentChanges[0].changeset;
            //console.log("Resending: " + changeKey);
            if(this.lastKeyTried === changeKey) {
                this.lastKeyCount++;
            }
            else {
                this.lastKeyCount = 0;
            }
            this.lastKeyTried = changeKey;

            this._syncClientChangeToServer(thisChange.verb, thisChange.entity, thisChange.data, thisChange.meta, true, null, changeKey);
            return;
        }
        else {
            clearInterval(this.retrySentChangesInterval);
        }
    },

    saveGlobals: function(newGlobals) {
        pm.globals.saveGlobals(newGlobals, false);
    },

    mergeEntitiesForUpdate: function (newO, oldO) {
        var ret = {};
        ret["id"]=newO.id;
        ret["owner"]=newO.owner;
        for(key in oldO) {
            if((newO[key]!=oldO[key]) && (JSON.stringify(newO[key])!=JSON.stringify(oldO[key]))) {
                ret[key]=newO[key];
            }
        }
        return ret;
    }
});