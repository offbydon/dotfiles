var PmCollections = Backbone.Collection.extend({
    originalCollectionId: "",
    toBeImportedCollection:{},

    model: PmCollection,

    isLoaded: false,
    initializedSyncing: false,
    syncFileTypeCollection: "collection",
    syncFileTypeCollectionRequest: "collection_request",

    comparator: function(a, b) {
        var counter;

        var aName = a.get("name");
        var bName = b.get("name");

        if(aName==null) return -1;
        if(bName==null) return 1;

        if (aName.length > bName.legnth)
            counter = bName.length;
        else
            counter = aName.length;

        for (var i = 0; i < counter; i++) {
            if (aName[i] == bName[i]) {
                continue;
            } else if (aName[i] > bName[i]) {
                return 1;
            } else {
                return -1;
            }
        }
        return 1;
    },

    initialize: function() {
        this.loadAllCollections();
        this.collectionIdUserMap = {};
        // TODO Add events for in-memory updates
        pm.appWindow.trigger("registerInternalEvent", "addedCollection", this.onAddedCollection, this);
        pm.appWindow.trigger("registerInternalEvent", "updatedCollection", this.onUpdatedCollection, this);
        pm.appWindow.trigger("registerInternalEvent", "deletedCollection", this.onDeletedCollection, this);

        pm.appWindow.trigger("registerInternalEvent", "addedCollectionRequest", this.onAddedCollectionRequest, this);
        pm.appWindow.trigger("registerInternalEvent", "updatedCollectionRequest", this.onUpdatedCollectionRequest, this);
        pm.appWindow.trigger("registerInternalEvent", "deletedCollectionRequest", this.onDeletedCollectionRequest, this);

        pm.mediator.on("addDirectoryCollection", this.onAddDirectoryCollection, this);
        pm.mediator.on("addResponseToCollectionRequest", this.addResponseToCollectionRequest, this);
        pm.mediator.on("updateResponsesForCollectionRequest", this.updateResponsesForCollectionRequest, this);
        pm.mediator.on("updateResponsesForCollectionRequestWithOptSync", this.updateResponsesForCollectionRequestWithOptSync, this);
        pm.mediator.on("deletedSharedCollection", this.onDeletedSharedCollection, this);
        pm.mediator.on("overwriteCollection", this.onOverwriteCollection, this);
        pm.mediator.on("uploadAllLocalCollections", this.onUploadAllLocalCollections, this);


        //--Sync listeners---
        pm.mediator.on("syncChangeReceived", this.onSyncChangeReceived, this);
        pm.mediator.on("syncErrorReceived", this.onSyncErrorReceived, this);

        this.on("unsubscribeFromCollection", this.unsubscribeFromCollection, this);
    },

    unsubscribeFromCollection: function(collectionMeta) {
        console.error("Wrong event triggered");
    },

    getOwnerForCollection: function(collectionId) {
        var owner = this.collectionIdUserMap[collectionId];
        return (!!owner)?owner:0;
    },

    onAddedCollection: function(collection) {
        this.add(collection, { merge: true });
    },

    onUpdatedCollection: function(collection) {
        this.add(collection, { merge: true });
        this.trigger("updateCollection");
        pm.syncManager.addUnsyncedChange("collection","update",collection);
    },

    onDeletedCollection: function(id) {
        this.remove(id);
        pm.syncManager.addUnsyncedChange("collection","destroy",{id:id});
    },

    onAddedCollectionRequest: function(request) {
        var collection = this.get(request.collectionId);

        if (collection) {
            collection.addRequest(request);
        }
    },

    onUpdatedCollectionRequest: function(request) {
        var collection = this.get(request.collectionId);

        if (collection) {
            collection.updateRequest(request);
        }
    },

    onDeletedCollectionRequest: function(id) {
        var collection = this.get(request.collectionId);

        if (collection) {
            collection.deleteRequest(id);
        }
    },

    onUploadAllLocalCollections: function() {

        var uploaded = 0;
        var count = this.models.length;

        pm.tracker.trackEvent("collection", "share", "upload_all", count);

        function callback() {
            uploaded++;

            if (uploaded === count) {
                pm.mediator.trigger("refreshSharedCollections");
            }
        }

        for(var i = 0; i < this.models.length; i++) {
            this.uploadCollection(this.models[i].get("id"), false, false, callback);
        }
    },

    getCollectionById: function(id) {
        for(var i = 0; i < this.models.length; i++) {
            if(id===this.models[i].get("id")) {
                return this.models[i];
            }
        }
        return null;
    },

    getAllCollections: function() {
        return this.models;
    },

    // Load all collections
    loadAllCollections:function () {
        var pmCollection = this;

        this.startListeningForFileSystemSyncEvents();

        pm.indexedDB.getCollections(function (items) {
            var itemsLength = items.length;
            var loaded = 0;

            function onGetAllRequestsInCollection(collection, requests) {
                var c = new PmCollection(collection);
                c.setRequests(requests);
                pmCollection.add(c, {merge: true});

                pmCollection.collectionIdUserMap[collection.id] = collection.owner;

                loaded++;

                for(var i = 0; i < requests.length; i++) {
                    pm.mediator.trigger("addToURLCache", requests[i].url);
                }

                if (loaded === itemsLength) {
                    pmCollection.isLoaded = true;
                    pmCollection.trigger("startSync");
                    if(pm.syncManager) pm.syncManager.trigger("itemLoaded","collections");
                    pm.mediator.trigger("refreshCollections");
                    pm.mediator.trigger("loadedCollections");
                }
            }

            if (itemsLength === 0) {
                pmCollection.isLoaded = true;
                pmCollection.trigger("startSync");
                if(pm.syncManager) pm.syncManager.trigger("itemLoaded","collections");
            }
            else {
                for (var i = 0; i < itemsLength; i++) {
                    var collection = items[i];
                    pm.indexedDB.getAllRequestsInCollection(collection, onGetAllRequestsInCollection);
                }
            }
        });
    },


    startListeningForFileSystemSyncEvents: function() {
        var pmCollection = this;
        var isLoaded = pmCollection.isLoaded;
        var initializedSyncing = pmCollection.initializedSyncing;

        pm.mediator.on("initializedSyncableFileSystem", function() {
            pmCollection.initializedSyncing = true;
            pmCollection.trigger("startSync");
        });

        this.on("startSync", this.startSyncing, this);
    },

    startSyncing: function() {
        var i;
        var j;
        var pmCollection = this;
        var collection;
        var requests;
        var request;
        var synced;
        var syncableFile;

        if (this.isLoaded && this.initializedSyncing) {

            pm.mediator.on("addSyncableFileFromRemote", function(type, data) {
                if (type === "collection") {
                    pmCollection.onReceivingSyncableFileData(data);
                }
                else if (type === "collection_request") {
                    pmCollection.onReceivingSyncableFileDataForRequests(data);
                }
            });

            pm.mediator.on("updateSyncableFileFromRemote", function(type, data) {
                if (type === "collection") {
                    pmCollection.onReceivingSyncableFileData(data);
                }
                else if (type === "collection_request") {
                    pmCollection.onReceivingSyncableFileDataForRequests(data);
                }
            });

            pm.mediator.on("deleteSyncableFileFromRemote", function(type, id) {
                if (type === "collection") {
                    pmCollection.onRemoveSyncableFile(id);
                }
                else if (type === "collection_request") {
                    pmCollection.onRemoveSyncableFileForRequests(id);
                }
            });

            // And this
            for(i = 0; i < this.models.length; i++) {
                collection = this.models[i];
                synced = collection.get("synced");

                if (!synced) {
                    this.addToSyncableFilesystem(collection.get("id"));
                }

                requests = collection.get("requests");

                for(j = 0; j < requests.length; j++) {
                    request = requests[j];

                    if (request.hasOwnProperty("synced")) {
                        if (!request.synced) {
                            this.addRequestToSyncableFilesystem(request.id);
                        }
                    }
                    else {
                        this.addRequestToSyncableFilesystem(request.id);
                    }
                }
            }
        }
        else {
        }
    },

    onReceivingSyncableFileData: function(data) {
        var collection = JSON.parse(data);
        this.addCollectionFromSyncableFileSystem(collection);
    },

    onRemoveSyncableFile: function(id) {
        this.deleteCollectionFromDataStore(id, false, function() {
        });
    },

    onReceivingSyncableFileDataForRequests: function(data) {
        var request = JSON.parse(data);
        this.addRequestFromSyncableFileSystem(request);
    },

    onRemoveSyncableFileForRequests: function(id) {
        this.deleteRequestFromDataStore(id, false, false, function() {
        });
    },

    onOverwriteCollection: function(collection) {
        this.overwriteCollection(collection);
    },

    onDeletedSharedCollection: function(collection) {
        var c;
        var pmCollection = this;

        for(var i = 0; i < this.models.length; i++) {
            var c = this.models[i];
            if (c && (c.get("remote_id") === collection.remote_id)) {
                var oldC = pmCollection.getJSONFromCollection(c);
                c.set("remote_id", 0);
                pmCollection.updateCollectionInDataStore(c.getAsJSON(), oldC, true, function (c) {
                });
                break;
            }
        }
    },

    getAsSyncableFile: function(id) {
        var collection = this.get(id);
        var name = id + ".collection";
        var type = "collection";

        var data = JSON.stringify(collection.toSyncableJSON());

        return {
            "name": name,
            "type": type,
            "data": data
        };
    },

    getRequestAsSyncableFile: function(id) {
        var request = this.getRequestById(id);
        var name = id + ".collection_request";
        var type = "collection_request";

        if(request!=null) {
            request.synced = true;
        }

        var data = JSON.stringify(request);

        return {
            "name": name,
            "type": type,
            "data": data
        };
    },

    addToSyncableFilesystem: function(id) {
        var pmCollection = this;

        var syncableFile = this.getAsSyncableFile(id);
        pm.mediator.trigger("addSyncableFile", syncableFile, function(result) {
            if(result === "success") {
                pmCollection.updateCollectionSyncStatus(id, true);
            }
        });
    },

    removeFromSyncableFilesystem: function(id) {
        var name = id + ".collection";
        pm.mediator.trigger("removeSyncableFile", name, function(result) {
        });
    },

    addRequestToSyncableFilesystem: function(id) {
        var pmCollection = this;

        var syncableFile = this.getRequestAsSyncableFile(id);
        pm.mediator.trigger("addSyncableFile", syncableFile, function(result) {
            if(result === "success") {
                pmCollection.updateCollectionRequestSyncStatus(id, true);
            }
        });
    },

    removeRequestFromSyncableFilesystem: function(id) {
        var name = id + ".collection_request";
        pm.mediator.trigger("removeSyncableFile", name, function(resfult) {
        });
    },

    getMissingServerRequest: function(requestId, owner) {
        pm.syncManager.getEntityFromId("request",requestId, owner, null, function(res,owo) {

            res["collectionId"]=res.collection;
            if(res.dataMode==="raw" && res.rawModeData) {
                res.data = res.rawModeData;
                delete res.rawModeData;
            }
            pm.collections.addFullCollectionRequest(res, null);
        });
    },


    correctFolderOrder: function(id, serverOrder, localOrder, owner) {
        var localFolder = pm.collections.getFolderById(id);
        if(!localFolder) {
            console.log("Fatal - tried to update folder order but can't find the folder locally");
            return true; //clearChange should be true - this cannot be updated
        }

        //iterate through server order
        var serverLength = serverOrder.length;
        for(var i=0;i<serverLength;i++) {
            if(localOrder.indexOf(serverOrder[i])==-1) {
                //this request doesnt exist locally - get it
                this.getMissingServerRequest(serverOrder[i], owner);
            }
        }

        for(var i=0;i<localOrder.length; i++) {
            if(serverOrder.indexOf(localOrder[i])==-1) {
                //this request doesn't exist on the server - send it
                pm.collections.resyncRequestId(localOrder[i]);
            }
        }

        return false; //can resync the original order update
    },

    correctCollectionOrder: function(id, serverOrder, localOrder, owner) {
        var localCollection = pm.collections.getCollectionById(id);
        if(!localCollection) {
            console.log("Fatal - tried to update folder order but can't find the folder locally");
            return true; //clearChange should be true - this cannot be updated
        }

        var serverLength = serverOrder.length;
        for(var i=0;i<serverLength;i++) {
            if(localOrder.indexOf(serverOrder[i])==-1) {
                //this request doesnt exist locally - get it
                this.getMissingServerRequest(serverOrder[i], owner);
            }
        }

        for(var i=0;i<localOrder.length; i++) {
            if(serverOrder.indexOf(localOrder[i])==-1) {
                //this request doesn't exist on the server - send it
                pm.collections.resyncRequestId(localOrder[i]);
            }
        }

        return false; //can resync the original order update
    },

    /* Base data store functions*/
    addCollectionToDataStore: function(collectionJSON, sync, terminateTransaction, callback) {
        var pmCollection = this
        var justSubscribed = collectionJSON.justSubscribed;
        delete collectionJSON.justSubscribed;

        pm.indexedDB.addCollection(collectionJSON, function (c) {
            var collection = new PmCollection(c);
            collection.justSubscribed = justSubscribed;
            pmCollection.add(collection, {merge: true});
            pm.appWindow.trigger("sendMessageObject", "addedCollection", collection);
            pm.mediator.trigger("databaseOperationComplete");

            pm.mediator.trigger("refreshCollections");
            pm.mediator.trigger('syncOperationDone');

            if(!collection.attributes.synced) {
                pm.syncManager.addChangeset("collection","create",c, null, terminateTransaction);
                if(terminateTransaction==false && c.hasOwnProperty("folders") && c.folders instanceof Array) {
                    var numFolders = c.folders.length;
                    var i;
                    for(i=0;i<numFolders;i++) {
                        pm.syncManager.addChangeset("folder","create", c.folders[i], null, false);

                        //if there are requests, the commit will be sent after the requests have been added
                        //if not we'll send it now
                        if(i === numFolders-1 && c.hasRequests!==true) {
                            pm.mediator.trigger("commitTransaction", c.id);
                        }
                    }
                }
            }

            if (sync) {
                pmCollection.addToSyncableFilesystem(collection.get("id"));
            }

            if (callback) {
                callback(c);
            }
        });
    },

    updateCollectionInDataStoreWithOptSync: function(collectionJSON, oldCollection, sync, toSync, callback) {
        var pmCollection = this;

        pm.indexedDB.updateCollection(collectionJSON, oldCollection, toSync, function (c) {
            var collection = pmCollection.get(c.id);
            pmCollection.add(collection, {merge: true});
            pm.appWindow.trigger("sendMessageObject", "updatedCollection", collection);
            pm.mediator.trigger("databaseOperationComplete");
            pm.mediator.trigger("refreshCollections");

            if(toSync) {
                var objectToUpdate = pm.syncManager.mergeEntitiesForUpdate(c, oldCollection);
                pm.syncManager.addChangeset("collection","update",objectToUpdate, null, true);
            }

            if (sync && collection!=null) {
                pmCollection.addToSyncableFilesystem(collection.get("id"));
            }

            if (callback) {
                callback(c);
            }
        });
    },

    updateCollectionInDataStore: function(collectionJSON, oldCollection, sync, callback) {
        this.updateCollectionInDataStoreWithOptSync(collectionJSON, oldCollection, sync, true, callback);
    },

    updateCollectionInDataStoreWithoutSync: function(collectionJSON, oldCollection, sync, callback) {
        this.updateCollectionInDataStoreWithOptSync(collectionJSON, oldCollection, sync, false, callback);
    },

    mergeEntitiesForUpdate: function (newO, oldO) {
        var ret = {};
        ret["id"] = newO.id;
        for (key in oldO) {
            ret[key] = oldO[key];
        }
        for (key in newO) {
            ret[key] = newO[key];
        }
        return ret;
    },

    updateRemoteCollectionInDataStore: function(collectionJSON, oldCollection, sync, callback) {
        var pmCollection = this;
        try {
            oldCollection = pm.collections.getCollectionById(collectionJSON.id);
            if(!oldCollection) {
                pm.syncLogger.error("Updating remote collection failed. Collection id " + collectionJSON.id + " doesn't exist on this machine");
            }
            oldCollection = oldCollection.getAsJSON();

            collectionJSON = this.mergeEntitiesForUpdate(collectionJSON, oldCollection);
            if(collectionJSON.hasOwnProperty("shared")) {
                collectionJSON.sharedWithTeam = collectionJSON.shared;
            }

            pm.indexedDB.updateCollection(collectionJSON, oldCollection, false, function (c) {
                var collection = new PmCollection(collectionJSON);//pmCollection.get(c.id);
                var oldRequests = pm.collections.getCollectionById(c.id).get("requests");
                collection.setRequests(oldRequests);

                pmCollection.add(collection, {merge: true});

                pm.appWindow.trigger("sendMessageObject", "updatedCollection", collection);
                pm.mediator.trigger("databaseOperationComplete");
                pm.mediator.trigger("refreshCollections");
                pm.collections.trigger('updateCollectionMeta',collection)
                pm.mediator.trigger('syncOperationDone');

                if (sync) {
                    pmCollection.addToSyncableFilesystem(collection.get("id"));
                }

                if (typeof callback === "function") {
                    callback(c);
                }
            });
        }
        catch(e) {
            pm.syncLogger.error("Update collection failed: "+e);
            if(typeof callback === "function") {
                callback();
            }
            return -1;
        }
        return 0;
    },

    deleteCollectionFromDataStoreWithOptSync: function(id, sync, toSync, callback) {
        var pmCollection = this;

        pm.indexedDB.deleteCollectionWithOptSync(id, toSync, function () {
            pmCollection.remove(id);
            pm.appWindow.trigger("sendMessageObject", "deletedCollection", id);
            pm.mediator.trigger("databaseOperationComplete");
            pm.mediator.trigger('syncOperationDone');
            if (sync) {
                pmCollection.removeFromSyncableFilesystem(id);
            }

            if(toSync) {
                pm.syncManager.addChangeset("collection","destroy",{id:id}, null, true);
            }

            pm.api.deleteCollectionFromTeam(pm.user.id,  pm.user.get("access_token"), id, function() {
                //console.log("Deleted from team");
            }, function() {
                //console.log("Could not delete collection from team");
            });

            pm.indexedDB.getAllRequestsForCollectionId(id, function(requests) {
                var deleted = 0;
                var requestCount = requests.length;
                var request;
                var i;

                if (requestCount > 0) {
                    for(i = 0; i < requestCount; i++) {
                        request = requests[i];

                        pm.indexedDB.deleteCollectionRequestWithOptSync(request.id, false, function (requestId) {
                            deleted++;

                            pm.mediator.trigger("databaseOperationComplete");

                            if (sync) {
                                pmCollection.removeRequestFromSyncableFilesystem(requestId);
                            }


                            if (deleted === requestCount) {
                                pm.mediator.trigger("refreshCollections");
                                if (callback) {
                                    callback();
                                }
                            }
                        });
                    }
                }
                else {
                    if (callback) {
                        callback();
                    }
                }
            });
        });
    },

    deleteCollectionFromDataStore: function(id, sync, callback) {
        //Children shouldn't be deleted
        this.deleteCollectionFromDataStoreWithOptSync(id, sync, false, callback);
    },

    getJSONFromCollection: function(collection) {
        return {
            "id": collection.attributes.id,
            "name": collection.attributes.name,
            "description": collection.attributes.description,
            "order": collection.attributes.order,
            "folders": collection.attributes.folders,
            "timestamp": collection.attributes.timestamp,
            "synced": collection.attributes.synced,
            "owner": collection.attributes.owner,
            "remote_id": collection.attributes.remote_id,
            "remoteLink": collection.attributes.remoteLink,
            "write": collection.attributes.write
        }
    },

    getJSONFromRequest: function(collectionRequest) {
        if(!collectionRequest) return null;

        return {
            "collectionId": collectionRequest["collectionId"],
            "data": _.clone(collectionRequest["data"]),
            "dataMode": collectionRequest["dataMode"],
            "description": collectionRequest["description"],
            "headers": collectionRequest["headers"],
            "id": collectionRequest["id"],
            "method": collectionRequest["method"],
            "name": collectionRequest["name"],
            "pathVariables": _.clone(collectionRequest["pathVariables"]),
            "preRequestScript": collectionRequest["preRequestScript"],
            "responses": _.clone(collectionRequest["responses"]),
            "tests": collectionRequest["tests"],
            "time": collectionRequest["time"],
            "url": collectionRequest["url"],
            "version": collectionRequest["version"]
        }
    },

    addRequestToDataStoreWithOptSync: function(request, sync, toSync, syncImmediately, callback) {
        var pmCollection = this;

        //this property is only used for callback. to trigger CommitTransaction after the last request has been sent
        var requestToSave = _.clone(request);
        delete request.isLastRequest;

        pm.indexedDB.addCollectionRequest(request, toSync, function (req) {
            pm.mediator.trigger("addToURLCache", request.url);

            var collection = pmCollection.get(request.collectionId);
            pm.mediator.trigger("databaseOperationComplete");

            if (collection) {
                collection.addRequest(request);
                pm.appWindow.trigger("sendMessageObject", "addedCollectionRequest", request);
            }

            if(toSync) {
                pm.syncManager.addChangeset("request","create",req, null, syncImmediately);


                //sync responses as well
                var responses = req.responses || [];
                for(var i=0;i<responses.length;i++) {
                    responses[i].owner = req.owner;
                    responses[i].request = req.id;
                    responses[i].collectionId = req.collectionId;
                    var responseToSync = _.clone(responses[i]);
                    if(syncImmediately == false) {
                        pm.syncManager.addChangeset("response", "create", responseToSync, null, false);
                    }
                    else {
                        setTimeout(function (response) {
                            return function () {
                                pm.syncManager.addChangeset("response", "create", response, null, true);
                            }
                        }(responseToSync), 500);
                    }

                }
            }

            if (sync) {
                pmCollection.addRequestToSyncableFilesystem(request.id);
            }

            if (callback) {
                callback(requestToSave);
            }
        });
    },

    /**
     *
     * @param request: the request JSON
     * @param sync: sync param for google drive
     * @param syncImmediately whether the request change is sent to the anakin server immediately, or added to a batch
     * @param callback
     */
    addRequestToDataStore: function(request, sync, syncImmediately, callback) {
        this.addRequestToDataStoreWithOptSync(request,sync,true, syncImmediately, callback);
    },

    addRemoteRequestToDataStore: function(request, sync, callback) {
        this.addRequestToDataStoreWithOptSync(request, sync, false, true, callback);
    },

    updateRequestInDataStore: function(request, oldRequest, sync, callback, toSync) {
        var pmCollection = this;

        if (!request.name) {
            request.name = request.url;
        }

        pm.indexedDB.updateCollectionRequest(request, oldRequest, toSync, function (req) {
            var collection = pmCollection.get(request.collectionId);

            if (collection) {
                collection.updateRequest(request);
                pm.appWindow.trigger("sendMessageObject", "updatedCollectionRequest", request);
            }

            pm.mediator.trigger("databaseOperationComplete");

            if(toSync) {
                var objectToUpdate = pm.syncManager.mergeEntitiesForUpdate(req, oldRequest);
                //ensure dataMode is present
                if(req.dataMode) objectToUpdate.dataMode = req.dataMode;
                objectToUpdate.owner = collection.get("owner");
                pm.syncManager.addChangeset("request","update",objectToUpdate, null, true);
            }


            if (sync) {
                pmCollection.addRequestToSyncableFilesystem(request.id);
            }

            if (callback) {
                callback(request);
            }
        });
    },

    deleteRequestFromDataStoreWithOptSync: function(id, sync, syncCollection, toSync, callback) {
        var pmCollection = this;

        var request = this.getRequestById(id);

        var targetCollection;

        if (request) {
            targetCollection = this.get(request.collectionId);
        }

        pm.indexedDB.deleteCollectionRequestWithOptSync(id, toSync, function () {
            if (targetCollection) {
                var oldCollection = targetCollection.getAsJSON();
                targetCollection.deleteRequest(id);
                collection = targetCollection.getAsJSON();
                pm.mediator.trigger("databaseOperationComplete");
                if (sync) {
                    pmCollection.removeRequestFromSyncableFilesystem(id);
                    pm.appWindow.trigger("sendMessageObject", "deletedCollectionRequest", id);
                }

                if(toSync) {
                    pm.syncManager.addChangeset("request","destroy",{id:id, owner: collection.owner}, null, true);
                }

                if(callback) {
                    callback();
                }

                // A request deletion should never cause a collection update in sync
                pmCollection.updateCollectionInDataStoreWithoutSync(collection, oldCollection, syncCollection, function(c) {
                });

            }
            else {
                if (sync) {
                    pmCollection.removeRequestFromSyncableFilesystem(id);
                }

                if(callback) {
                    callback();
                }
            }
        });
    },

    deleteRequestFromDataStore: function(id, sync, syncCollection, callback) {
        this.deleteRequestFromDataStoreWithOptSync(id,sync,syncCollection, true, callback);
    },

    /* Finish base data store functions*/

    // Get collection by folder ID
    getCollectionForFolderId: function(id) {
        function existingFolderFinder(r) {
            return r.id === id;
        }

        for(var i = 0; i < this.length; i++) {
            var collection = this.models[i];
            var folders = collection.get("folders");
            var folder = _.find(folders, existingFolderFinder);
            if (folder) {
                return collection;
            }
        }

        return null;
    },

    // Add collection from modal
    addCollection:function (name, description) {
        var pmCollection = this;

        var collection = {};

        if (name) {
            collection.id = guid();
            collection.name = name;
            collection.description = description;
            collection.order = [];
            collection.timestamp = new Date().getTime();
            collection.owner = pm.user.id;
            collection.sharedWithTeam = false;
            pmCollection.collectionIdUserMap[collection.id] = pm.user.id;
            pmCollection.addCollectionToDataStore(collection, true, true);
        }
    },

    resyncCollectionId: function(collectionId) {
        var collectionModel = pm.collections.getCollectionById(collectionId);
        if(!collectionModel) {
            console.log("Could not find collection");
            return false;
        }

        var collection = collectionModel.getAsJSON();
        if(collection.owner !== pm.user.id) {
            console.log("Only the owner can recreate the lost objects");
            return false;
        }

        pm.syncManager.addChangeset("collection","create",collection, null, true);

        //send all folders
        var numFolders = collection.folders?collection.folders.length:0;
        for(var i=0;i<numFolders;i++) {
            var folder = collection.folders[i];
            this.resyncWholeFolder(folder);
        }

        //send all requests
        var order = collection.order || [];
        for(var i=0;i<order.length;i++) {
            this.resyncRequestId(collection.order[i]);
        }
        return true;
    },

    resyncFolderId: function(fid) {
        var folder = pm.collections.getFolderById(fid);
        this.resyncWholeFolder(folder);
    },

    resyncWholeFolder: function(folder) {
        if(!folder) {
            console.log("Cannot find folder");
            return false;
        }

        if(folder.owner !== pm.user.id) {
            console.log("Only the owner can recreate the lost objects");
            return false;
        }

        pm.syncManager.addChangeset("folder","create",folder, null, true);
        var order = folder.order || [];
        for(var i=0;i<order.length;i++) {
            this.resyncRequestId(folder.order[i]);
        }

        //setTimeout(function(folder) {
        //    return function() {
        //        var jsonToSend = {
        //            id: folder.id,
        //            order: folder.order,
        //            owner: folder.owner
        //        };
        //        pm.syncManager.addChangeset("folder","update",jsonToSend, null, false);
        //    }
        //} (folder),1000);
        return true;
    },

    resyncRequestId: function(rid) {
        var request = pm.collections.getRequestById(rid);
        if(!request) {
            return false;
        }
        if((request.owner !== pm.user.id) &&
            !(pm.collections.getOwnerForCollection(request.collectionId) == pm.user.id)) {

            console.log("Only the owner can recreate the lost objects");
            return false;
        }
        pm.syncManager.addChangeset("request","create",request, null, true);
        var numResponses = request.responses?request.responses.length:0;
        for(var i=0;i<numResponses.length;i++) {
            pm.syncManager.addChangeset("response","create",request.responses[i], null, true);
        }
        return true;
    },

    addFullCollection: function (collection,sync, callback) {
        var pmCollection = this;
        pmCollection.collectionIdUserMap[collection.id] = collection.owner;
        collection.synced=sync;
        collection.sharedWithTeam = collection.shared;

        //Cascade the editable property in all requests and responses
        //if(!collection.hasOwnProperty("editable") || (typeof collection.editable==="undefined")) {
        collection.write = (collection.write==true || pm.user.id==collection.owner);
        //}

        try {
            pmCollection.addCollectionToDataStore(collection, true, true, callback);
        }
        catch(e) {
            console.log("Adding collection failed: "+e);
            return -1;
        }
        return 0;
    },

    addCollectionFromSyncableFileSystem:function (collection) {
        var pmCollection = this;

        pmCollection.addCollectionToDataStore(collection, false, false, function(c) {
            pm.indexedDB.getAllRequestsInCollection(c, function(c, requests) {
                var collectionModel = pmCollection.get(c.id);
                collectionModel.set("synced", true);
                collectionModel.setRequests(requests);
                pmCollection.trigger("updateCollection", collectionModel);
            });
        });
    },

    addRequestFromSyncableFileSystem: function(request) {
        var pmCollection = this;

        pmCollection.addRequestToDataStore(request, false, true, function(r) {
            var collectionModel = pmCollection.get(request.collectionId);
            var folderId;
            var folder;
            var requestLocation;

            if (collectionModel) {
                requestLocation = pmCollection.getRequestLocation(request.id);

                if (requestLocation.type === "collection") {
                    pmCollection.trigger("moveRequestToCollection", null, collectionModel, request);
                }
                else if (requestLocation.type === "folder") {
                    folder = pmCollection.getFolderById(requestLocation.folderId);
                    pmCollection.trigger("moveRequestToFolder", null, collectionModel, folder, request);
                }
            }

        });
    },

    // Deprecated
    // Rename this
    // Add collection data to the database with new IDs
    addAsNewCollection:function(collection) {
        var pmCollection = this;
        var folders = [];
        var folder;
        var order;
        var j, count;
        var idHashTable = {};

        var dbCollection = _.clone(collection);
        dbCollection["requests"] = [];
        dbCollection["sharedWithTeam"] = false;
        dbCollection["subscribed"] = false;
        dbCollection["remoteLink"] = "";
        dbCollection["remote_id"] = 0;
        dbCollection["public"] = false;
        dbCollection["write"] = true;

        pmCollection.addCollectionToDataStore(dbCollection, true, false, function(c) {
            var collectionModel;
            var requests;
            var ordered;
            var i;
            var request;
            var newId;
            var currentId;
            var loc;

            collectionModel = pmCollection.get(c.id);
            var oldCollection = _.clone(collectionModel);

            // Shows successs message
            pmCollection.trigger("importCollection", {
                type: "collection",
                name:collection.name,
                action:"added"
            });

            requests = [];

            ordered = false;

            // Check against legacy collections which do not have an order
            if ("order" in collection) {
                ordered = true;
            }
            else {
                ordered = false;
                collection["order"] = [];
                collection.requests.sort(sortAlphabetical);
            }

            // Change ID of request - Also need to change collection order
            // and add request to indexedDB
            for (i = 0; i < collection.requests.length; i++) {
                request = collection.requests[i];
                request.collectionId = collection.id;

                if(request.hasOwnProperty("rawModeData")) {
                    request.data = request.rawModeData;
                    delete request.rawModeData;
                }

                var newId = guid();
                idHashTable[request.id] = newId;

                if (ordered) {
                    currentId = request.id;
                    loc = _.indexOf(collection["order"], currentId);
                    collection["order"][loc] = newId;
                }
                else {
                    collection["order"].push(newId);
                }

                request.id = newId;

                if ("responses" in request) {
                    for (j = 0, count = request["responses"].length; j < count; j++) {
                        request["responses"][j].id = guid();
                        request["responses"][j].collectionRequestId = newId;
                    }
                }

                requests.push(request);
            }

            // Change order inside folders with new IDs
            if ("folders" in collection) {
                folders = collection["folders"];

                for(i = 0; i < folders.length; i++) {
                    folders[i].id = guid();
                    order = folders[i].order;
                    for(j = 0; j < order.length; j++) {
                        order[j] = idHashTable[order[j]];
                    }

                }
            }

            collectionModel.setRequests(requests);
            collectionModel.set("folders", folders);
            collectionModel.set("order", collection["order"]);


            // Check for remote_id

            if (pm.user.isLoggedIn()) {
                var remoteId = pm.user.getRemoteIdForCollection(c.id);
                collectionModel.set("remote_id", remoteId);
            }

            // Add new collection to the database
            pmCollection.updateCollectionInDataStoreWithOptSync(collectionModel.getAsJSON(), oldCollection, true, true, function() {
                var i;
                var request;

                for (i = 0; i < requests.length; i++) {
                    request = requests[i];
                    var callback=function(r) {
                        if(r.isLastRequest) {
                            pm.mediator.trigger("commitTransaction", collectionModel.id);
                        }
                    }
                    if(i==requests.length-1) {
                        request.isLastRequest = true;
                    }
                    pmCollection.addRequestToDataStore(request, true, false, callback);
                }

                pmCollection.trigger("updateCollection", collectionModel);
            });
        });

    },

    updateCollectionOwnerWithoutSync: function(id, owner) {
        var pmCollection = this;

        var targetCollection = pmCollection.get(id);
        var oldCollection = pmCollection.getJSONFromCollection(targetCollection);
        targetCollection.set("owner", owner);

        pmCollection.updateCollectionInDataStoreWithoutSync(targetCollection.getAsJSON(), oldCollection, true, function (collection) {
        });
    },

    updateCollectionOrder: function(id, order) {
        var pmCollection = this;

        var targetCollection = pmCollection.get(id);
        var oldCollection = pmCollection.getJSONFromCollection(targetCollection);
        targetCollection.set("order", order);

        pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), oldCollection, true, function (collection) {
        });
    },

    updateCollectionSyncStatus: function(id, status) {
        var pmCollection = this;

        var targetCollection = pmCollection.get(id);
        var oldCollection = pmCollection.getJSONFromCollection(targetCollection);
        targetCollection.set("synced", status);

        pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), oldCollection, false, function (collection) {
        });
    },

    updateCollectionWrite: function(id, write) {
        var pmCollection = this;

        var targetCollection = pmCollection.get(id);
        var oldCollection = pmCollection.getJSONFromCollection(targetCollection);

        targetCollection.set("write", write);

        pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), oldCollection,true, function (collection) {
            pmCollection.trigger("updateCollectionMeta", targetCollection);
        });
    },

    updateCollectionMeta: function(id, name, description) {
        var pmCollection = this;

        var targetCollection = pmCollection.get(id);
        var oldCollection = pmCollection.getJSONFromCollection(targetCollection);

        targetCollection.set("name", name);
        targetCollection.set("description", description);

        pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), oldCollection,true, function (collection) {
            pmCollection.trigger("updateCollectionMeta", targetCollection);
            if(collection.sharedWithTeam === true) {
                pm.api.updateCollectionToTeam(pm.user.id, pm.user.get("access_token"), id, targetCollection.get("name"), targetCollection.get("description"), targetCollection.get("owner"), function (result) {
                    //try to update collection in team dir
                });
            }
        });
    },

    deleteCollection:function (id, sync, callback) {
        //called when the user pressed "yes" in the delete modal
        this.deleteCollectionFromDataStoreWithOptSync(id, sync, true, callback);
    },

    // Get collection data for file
    getCollectionDataForFile:function (id, callback) {
        pm.indexedDB.getCollection(id, function (data) {
            var c = data;
            var i;
            var name;
            var type;
            var filedata;

            pm.indexedDB.getAllRequestsInCollection(c, function (collection, requests) {
                for (i = 0, count = requests.length; i < count; i++) {
                    requests[i]["synced"] = false;

                    if(requests[i]["dataMode"]==="raw") {
                        requests[i]["rawModeData"]=requests[i]["data"];
                        requests[i]["data"]=[];
                    }
                }

                if (collection.hasOwnProperty("remote_id")) {
                    delete collection['remote_id'];
                }

                //Get all collection requests with one call
                collection['synced'] = false;
                collection['requests'] = requests;

                name = collection['name'] + ".json";
                type = "application/json";

                filedata = JSON.stringify(collection, null, '\t');
                callback(name, type, filedata);
            });
        });
    },

    // Save collection as a file
    saveCollection:function (id) {
        this.getCollectionDataForFile(id, function (name, type, filedata) {
            var filename = name + ".postman_collection";
            pm.filesystem.saveAndOpenFile(filename, filedata, type, function () {
                noty(
                    {
                        type:'success',
                        text:'Saved collection to disk',
                        layout:'topCenter',
                        timeout:750
                    });
            });
            pm.tracker.trackEvent("collection", "share", "json");

        });
    },

    uploadAndGetLinkForCollection: function (id, isPublic, callback) {
        var pmCollection = this;

        this.getCollectionDataForFile(id, function (name, type, filedata) {
            pm.api.uploadCollection(filedata, isPublic, function (data) {
                var link = data.link;

                if (callback) {
                    callback(link);
                }

	            //to show the collection in the MyCollections modal
	            pm.mediator.trigger("refreshSharedCollections");

                var collection = pmCollection.get(id);
                var remote_id = parseInt(data.id, 10);
                var oldCollection = pmCollection.getJSONFromCollection(collection)
                collection.set("remote_id", remote_id);
                collection.set("remoteLink", link);
                collection.set("public", isPublic);

                //the new remote_id and remoteLink fields also have to be sent!
                pmCollection.updateCollectionInDataStoreWithOptSync(collection.getAsJSON(), oldCollection, true, true, function (c) {

                });
            });
            if(isPublic) {
                pm.tracker.trackEvent("collection", "share", "api_directory");
            }
            else {
                pm.tracker.trackEvent("collection", "share", "upload");
            }
        });
    },

    // Upload collection
    uploadCollection:function (id, isPublic, isTeam, refreshSharedCollections, callback) {
        var pmCollection = this;

        this.uploadAndGetLinkForCollection(id, isPublic, callback);

        var thisCollection = pmCollection.get(id);


        if(isTeam === true && thisCollection.get("sharedWithTeam")!==true) {
            //share with team

            var oldCollection = pmCollection.getJSONFromCollection(thisCollection);
            thisCollection.set("sharedWithTeam", true);

            //writeable is set on checkbox change
            //thisCollection.set("write", isWriteable);

            var orgs = pm.user.get("organizations");
            if(orgs.length > 0) {
                var orgId = orgs[0].id;
                pm.syncManager.addChangeset("collection", "share", {"team": orgId}, id, true);
                pmCollection.updateCollectionInDataStoreWithOptSync(thisCollection.getAsJSON(), oldCollection, true, false, function (c) {
                    pmCollection.trigger("updateCollection", thisCollection);
                });
            }
            else {
                console.log("Cannot share. You are not a member of a team.");
            }
        }
        else if(isTeam === false && thisCollection.get("sharedWithTeam")===true) {
            //unshare with team
            var thisCollection = pmCollection.get(id);
            var oldCollection = pmCollection.getJSONFromCollection(thisCollection);
            thisCollection.set("sharedWithTeam", false);
            pm.syncManager.addChangeset("collection", "unshare", null, id, true);
            pmCollection.updateCollectionInDataStoreWithOptSync(thisCollection.getAsJSON(), oldCollection, true, false, function (c) {
                pmCollection.trigger("updateCollection", thisCollection);
                pm.api.deleteCollectionFromTeam(pm.user.id, pm.user.get("access_token"), id, function (result) {
                    //console.log("Deleted collection from team: " + result);
                }, function() {
                    console.log("Could not delete collection from team");
                });
            });
        }
    },

    unshareCollection: function(collectionId) {
        pm.api.deleteCollectionFromTeam(pm.user.id,  pm.user.get("access_token"), collectionId, function() {
            //console.log("Deleted from team");
        }, function() {
            console.log("Could not delete collection from team");
        });
    },

    // New version of overwrite collection
    // called when importing a collection
    overwriteCollection:function(collection) {
        var pmCollection = this;

        if (collection.hasOwnProperty("order")) {
            ordered = true;
        }
        else {
            //forcibly adding a requests array to the collection
            if(!collection.hasOwnProperty("requests") || !(collection.requests instanceof Array)) {
                collection.requests = [];
            }

            ordered = false;
            collection["order"] = [];
            for (var i = 0; i < collection["requests"].length; i++) {
                collection["order"].push(collection.requests[i].id);
            }
        }

        collection.subscribed = false;

        var dbCollection = _.clone(collection);

        // Do not save requests in the same IndexedDB table
        if ("requests" in collection) {
            delete dbCollection['requests'];
            dbCollection.hasRequests = true;
        }

        var terminateTransaction = false;
        //if there are no requests AND no folders
        if((!dbCollection.order || dbCollection.order.length==0) && (!dbCollection.folders || dbCollection.folders.length===0)) {
            terminateTransaction = true;
        }

        pmCollection.addCollectionToDataStore(dbCollection, true, terminateTransaction, function(c) {
            var collectionModel;
            var requests = collection.requests;
            var i;
            var request;

            collectionModel = pmCollection.get(collection.id);

            if (collection.hasOwnProperty("requests")) {
                for (i = 0; i < requests.length; i++) {
                    if(collection.requests[i].dataMode==="raw") {
                        if(collection.requests[i].hasOwnProperty("rawModeData")) {
                            collection.requests[i].data=collection.requests[i].rawModeData;
                        }
                    }
                    if(!collection.requests[i].hasOwnProperty("preRequestScript")) {
                        collection.requests[i]["preRequestScript"] = "";
                    }
                    if(!collection.requests[i].hasOwnProperty("tests")) {
                        collection.requests[i]["tests"] = "";
                    }
                }

                collectionModel.set("requests", collection.requests);

                for (i = 0; i < requests.length; i++) {
                    request = requests[i];

                    var callback=function(r) {
                        if(r.isLastRequest) {
                            pm.syncManager.trigger("singleSyncDone");
                            pm.mediator.trigger("commitTransaction", collection.id);
                        }
                    }
                    if(i==requests.length-1) {
                        request.isLastRequest = true;
                    }

                    pmCollection.setFolderIdForRequest(request, collection);
                    pmCollection.addRequestToDataStore(request, true, false, callback);

                }
            }
            else {
                collectionModel.set("requests", []);
            }

            pmCollection.trigger("updateCollection", collectionModel);

            // Shows successs message
            pmCollection.trigger("importCollection", { type: "collection", name:collection.name, action:"added" });
        });
    },

    setFolderIdForRequest: function(r, c) {
        if(c.order.indexOf(r.id) !== -1) {
            //all is well, the request is in the collection
            return;
        }
        else {
            var folders = c.folders;
            var numFolders = folders.length;
            var i;
            for(i=0;i<numFolders;i++) {
                if(folders[i].order.indexOf(r.id)!=-1) {
                    r.folder = folders[i].id;
                    return;
                }
            }
        }

        //console.log("Warning - This request ID is not present in the collection or any folder");
    },

    // Duplicate collection
    duplicateCollection:function(collection) {
        this.addAsNewCollection(collection);
    },

    // Merge collection
    // Being used in IndexedDB bulk import
    mergeCollection: function(collection) {
        var validationResult = pm.collectionValidator.validateJSON('c', collection, {correctDuplicates: true, validateSchema: false});
        if(validationResult.status == false) {
            noty(
                {
                    type:'warning',
                    text:'Invalid collection file: '+validationResult.message,
                    layout:'topCenter',
                    timeout:5000
                });
            return;
        }
        var pmCollection = this;

        //Update local collection
        var newCollection = {
            id: collection.id,
            name: collection.name,
            timestamp: collection.timestamp
        };

        var targetCollection;
        targetCollection = new PmCollection(newCollection);
        var oldCollection = pmCollection.getJSONFromCollection(targetCollection);
        targetCollection.set("name", collection.name);

        targetCollection.set("requests", collection.requests);

        if ("order" in collection) {
            targetCollection.set("order", collection.order);
        }
        else {
            var order = [];
            var requests = targetCollection.get("requests");
            for(var j = 0; j < requests.length; j++) {
                order.push(requests[j].id);
            }

            targetCollection.set("order", order);
        }

        if ("folders" in collection) {
            targetCollection.set("folders", collection.folders);
        }

        pmCollection.add(targetCollection, {merge: true});
        pm.appWindow.trigger("sendMessageObject", "updatedCollection", targetCollection);

        pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), oldCollection, true, function (c) {
            var driveCollectionRequests = collection.requests;

            pm.indexedDB.getAllRequestsInCollection(collection, function(collection, oldCollectionRequests) {
                var updatedRequests = [];
                var deletedRequests = [];
                var newRequests = [];
                var finalRequests = [];
                var i = 0;
                var driveRequest;
                var existingRequest;
                var sizeOldRequests;
                var loc;
                var j;
                var sizeUpdatedRequests;
                var sizeNewRequests;
                var sizeDeletedRequests;
                var size = driveCollectionRequests.length;

                function existingRequestFinder(r) {
                    return driveRequest.id === r.id;
                }

                for (i = 0; i < size; i++) {
                    driveRequest = driveCollectionRequests[i];

                    existingRequest = _.find(oldCollectionRequests, existingRequestFinder);

                    if (existingRequest) {
                        updatedRequests.push(driveRequest);

                        sizeOldRequests = oldCollectionRequests.length;
                        loc = -1;
                        for (j = 0; j < sizeOldRequests; j++) {
                            if (oldCollectionRequests[j].id === existingRequest.id) {
                                loc = j;
                                break;
                            }
                        }

                        if (loc >= 0) {
                            oldCollectionRequests.splice(loc, 1);
                        }
                    }
                    else {
                        newRequests.push(driveRequest);
                    }
                }

                deletedRequests = oldCollectionRequests;

                sizeUpdatedRequests = updatedRequests.length;
                for(i = 0; i < sizeUpdatedRequests; i++) {
                    pmCollection.updateRequestInDataStore(updatedRequests[i], true);
                }

                sizeNewRequests = newRequests.length;
                for(i = 0; i < sizeNewRequests; i++) {
                    pmCollection.addRequestToDataStore(newRequests[i], true, true, function(){});
                }

                sizeDeletedRequests = deletedRequests.length;
                for(i = 0; i < sizeDeletedRequests; i++) {
                    pmCollection.deleteRequestFromDataStore(deletedRequests[i], true);
                }

                pmCollection.trigger("updateCollection", targetCollection);
            });
        });
    },

    // Merge multiple collections. Used in bulk data import
    mergeCollections: function (collections) {
        var pmCollection = this;

        var size = collections.length;
        for(var i = 0; i < size; i++) {
            var collection = collections[i];
            pmCollection.importCollectionData(collection, true);

            //this method causes update of the new collections :S
            //pmCollection.mergeCollection(collection, true);
        }
    },

    importCollectionData:function (collection, forceAdd) {
        //Fix for legacy collections
        if (!collection.hasOwnProperty("order") && collection.hasOwnProperty("requests")) {
            collection.order = collection.requests.map(function (req) {
                return req.id
            });
        }

        var newOwner = pm.user.id;
        collection.owner = newOwner;
        if (collection.folders) {
            var numFolders = collection.folders.length;
            for (var i = 0; i < numFolders; i++) {
                collection.folders[i].owner = newOwner;
            }
        }
        if (collection.requests) {
            var numRequests = collection.requests.length;
            for (var i = 0; i < numRequests; i++) {
                collection.requests[i].owner = newOwner;
            }
        }

        //this will be your new collection
        collection.sharedWithTeam = false;
        collection.synced = false;
        collection.subscribed = false;


        var validationResult = pm.collectionValidator.validateJSON('c', collection, {correctDuplicates: true, validateSchema: false});
        if(validationResult.status == false) {
            noty(
                {
                    type:'warning',
                    text:'Invalid collection file: '+validationResult.message,
                    layout:'topCenter',
                    timeout:5000
                });
            return;
        }
        if(this.getCollectionById(collection.id)!==null) {
            this.originalCollectionId = collection.id;
            this.toBeImportedCollection = collection;
            this.trigger("overwriteCollectionChoice", collection);
        }
        else {
            this.overwriteCollection(collection);
        }
    },

    setNewCollectionId: function(collection) {
        var newId = guid();
        var numFolders = (collection.folders)?collection.folders.length:0;
        for(var i=0;i<numFolders;i++) {
            collection.folders[i].collection_id = newId;

        }

        var numRequests = (collection.requests)?collection.requests.length:0;
        for(var i=0;i<numRequests;i++) {
            collection.requests[i].collectionId = newId;
        }

        collection.id = newId;
    },

    changeFolderAndRequestIds: function(collection) {
        var numFolders = (collection.folders)?collection.folders.length:0;
        var folderIdMap = {};
        var requestIdMap = {};

        //update request IDs
        var numRequests = (collection.requests)?collection.requests.length:0;
        for(var i=0;i<numRequests;i++) {
            var newId = guid();
            requestIdMap[collection.requests[i].id] = newId;

            if(collection.requests[i].hasOwnProperty("responses")) {
                var numResponses = collection.requests[i].responses.length;
                for(var j=0;j<numResponses;j++) {
                    collection.requests[i].responses[j].id = guid();
                }
            }
            collection.requests[i].id = newId;
        }

        //update folder IDs and folder orders
        for(var i=0;i<numFolders;i++) {
            var newId = guid();
            folderIdMap[collection.folders[i].id]=newId;
            collection.folders[i].id = newId;

            var oldOrder = collection.folders[i].order;
            var newOrder = _.map(oldOrder, function(oldRequestId) {
                return requestIdMap[oldRequestId];
            });
            collection.folders[i].order = newOrder;
        }

        //update root order
        var oldOrder = collection.order;
        var newOrder = _.map(oldOrder, function(oldRequestId) {
            return requestIdMap[oldRequestId];
        });
        collection.order = newOrder;

    },

    onAddDirectoryCollection: function(collection) {
        this.setNewCollectionId(collection);
        this.changeFolderAndRequestIds(collection);
        this.addAsNewCollection(collection);
    },

    guessFileFormat: function(data, alreadyJson) {
        //check if it is JSON:
        var jsonObj;
        try {
            if(alreadyJson===true) {
                jsonObj = data;
            }
            else {
                jsonObj = JSON.parse(data);
            }
            if(jsonObj.hasOwnProperty("swaggerVersion")) return "SWAGGER1.2";
            if(jsonObj.hasOwnProperty("folders") || jsonObj.hasOwnProperty("requests") || jsonObj.hasOwnProperty("order")) return "COLLECTION";

            //Is JSON, but not collection or swagger
            return 0;
        }
        catch(e) {
            if(data instanceof Node) {
                var xs = new XMLSerializer();
                data = xs.serializeToString(data);
            }
            data = data.trim();
            var firstLine = data.split("\n")[0];
            if(firstLine.indexOf("#%RAML")===0) return "RAML";  //check raml = first line is #%RAML
            if(firstLine.toLowerCase().indexOf("curl")===0) return "CURL";
	        if(data.substring(0,5).indexOf("<")!==-1 && data.substring(0,400).indexOf("<application")!==-1) return "WADL";

            //Not JSON, and not raml, curl, wadl
            return 0;
        }
    },

    showImportError: function(type, message) {
        noty({
            type:'error',
            text:'Errow while importing '+type+': '+message,
            layout:'center',
            timeout:2000
        });
    },

    importData: function(data, format, alreadyJson) {
        var pmCollection = this;
        if(format==="SWAGGER1.2") {
            var swaggerJson = alreadyJson?data:JSON.parse(data);
            postmanConverters.swagger1_2Converter.convertJSON(
                swaggerJson,
                {
                    group: true,
                    test: false
                },
                function(collection, env) {
                    pm.collections.importCollectionData(collection);
                }, function(errorMessage) {
                    pm.collections.showImportError("Swagger", errorMessage);
                }
            );
        }
        else if(format === "COLLECTION") {
            var collection = alreadyJson?data:JSON.parse(data);
            // collection.id = guid();
            pmCollection.importCollectionData(collection);
        }
        else if(format==="RAML") {
            postmanConverters.ramlConverter.parseString(data, function(op, env) {
                pm.collections.importCollectionData(op);
            }, function(errorMessage) {
                if(errorMessage.indexOf("cannot fetch")!==-1) {
                    errorMessage = "External references are not supported yet. " + errorMessage;
                }
                pm.collections.showImportError("RAML", errorMessage);
            });
        }
        else if(format==="CURL") {
            try {
                var requestJSON = postmanConverters.curlConverter.convertCurlToRequest(data);
                if (requestJSON.error) {
                    pm.collections.showImportError("Curl", requestJSON.error);
                }
                else {
                    var re = /\\n/gi
                    requestJSON.headers = requestJSON.headers.replace(re, "\n");
                    pm.mediator.trigger("loadRequest", requestJSON, true);
                    pmCollection.trigger("importCollection", {
                        type: "request",
                        name: (requestJSON.name != "" && requestJSON.name != null) ? requestJSON.name : requestJSON.url,
                        action: "added"
                    });
                }
            }
            catch(e) {
                pm.collections.showImportError("Curl", e.message);
            }
        }
        else if(format==="WADL") {
            postmanConverters.wadlConverter.convertXMLString(data,{},function(collection) {
                pm.collections.importCollectionData(collection);
            }, function(error) {
                pm.collections.showImportError("WADL", error);
            });
        }
    },

    importFiles: function(files) {
        var pmCollection = this;
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render thumbnail.
                    var data = e.currentTarget.result;
                    try {
                        data = data.trim();
                        var fileFormat = pmCollection.guessFileFormat(data);
                        if(fileFormat===0) {
                            throw "Could not parse";
                        }
                        pmCollection.importData(data, fileFormat);
                    }
                    catch(e) {
                        pm.mediator.trigger("failedCollectionImport","format not recognized");
                    }
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f);
        }
    },

    // Import multiple collections
    importCollections:function (files) {
        var pmCollection = this;

        // Loop through the FileList
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render thumbnail.
                    var data = e.currentTarget.result;
                    try {
                        data = data.trim();
                        var collection = jsonlint.parse(data);
                        // collection.id = guid();
                        pmCollection.importCollectionData(collection);
                    }
                    catch(e) {
                        pm.mediator.trigger("failedCollectionImport", "could not import collection - " + e.message);
                    }
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f);
        }
    },

    importFileFromUrl:function (url) {
        var pmCollection = this;

        $.ajax({
            type: 'GET',
            url: url,
            success: function(data) {
                try {
                    if(typeof data === "object" && !(data instanceof Node)) {
                        //already Json
                        var fileFormat = pmCollection.guessFileFormat(data, true);
                        if(fileFormat===0) {
                            throw "Could not parse";
                        }
                        pmCollection.importData(data, fileFormat, true);
                    }
                    else if(data instanceof Node) {
                        //it's an xml element. don't trim
                        var fileFormat = pmCollection.guessFileFormat(data, false);
                        if(fileFormat===0) {
                            throw "Could not parse";
                        }

                        var xs = new XMLSerializer();
                        data = xs.serializeToString(data);

                        pmCollection.importData(data, fileFormat, false);
                    }
                    else {
                        data = data.trim();
                        var fileFormat = pmCollection.guessFileFormat(data, false);
                        if(fileFormat===0) {
                            throw "Could not parse";
                        }
                        pmCollection.importData(data, fileFormat, false);
                    }
                }
                catch(e) {
                    pm.mediator.trigger("failedCollectionImport", "format not recognized");
                }
            }
        });
    },

    // Get request by ID
    getRequestById: function(id) {
        function existingRequestFinder(r) {
            return r.id === id;
        }

        for(var i = 0; i < this.models.length; i++) {
            var collection = this.models[i];

            var requests = collection.get("requests");

            var request = _.find(requests, existingRequestFinder);
            if (request) {
                return request;
            }
        }

        return null;
    },

    getRequestLocation: function(id) {
        var i;
        var collection;
        var indexCollection;
        var folders;
        var indexFolder;

        for(var i = 0; i < this.models.length; i++) {
            collection = this.models[i];

            indexCollection = _.indexOf(collection.get("order"), id);

            if (indexCollection >= 0) {
                return {
                    "type": "collection",
                    "collectionId": collection.get("id")
                };
            }
            else {
                folders = collection.get("folders");
                for(j = 0; j < folders.length; j++) {
                    indexFolder = _.indexOf(folders[j].order, id);

                    if (indexFolder >= 0) {
                        return {
                            "type": "folder",
                            "folderId": folders[j].id,
                            "collectionId": collection.get("id")
                        };
                    }
                }
            }
        }

        return {
            "type": "not_found"
        };
    },

    // Load collection request in the editor
    loadCollectionRequest:function (id) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(id, function (request) {
            if(!request) {
                pm.syncLogger.error("Could not find request to load. Id: " + id);
                return;
            }
            request.isFromCollection = true;
            request.collectionRequestId = id;
            pm.mediator.trigger("loadRequest", request, true);
            pmCollection.trigger("selectedCollectionRequest", request);
        });
    },

    // For the TCPReader. Not for the current request
    addRequestToCollectionId: function(collectionRequest, collectionId) {
        var pmCollection = this;

        collectionRequest.collectionId = collectionId;

        var targetCollection = pmCollection.get(collectionId);
        var oldCollection = pmCollection.getJSONFromCollection(targetCollection);
        targetCollection.addRequestIdToOrder(collectionRequest.id);

        pmCollection.addRequestToDataStore(collectionRequest, true, true, function(req) {
            pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), oldCollection, true, function() {
                pmCollection.trigger("addCollectionRequest", req, true);
            });
        });

//        pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), oldCollection, true, function() {
//            pmCollection.addRequestToDataStore(collectionRequest, true, function(req) {
//                pmCollection.trigger("addCollectionRequest", req);
//            });
//        });
    },

    addFullCollectionRequest: function(request, callback) {
        var pmCollection = this;
        var targetCollection;
        try {
            targetCollection = this.getCollectionById(request.collection);
            if(!targetCollection) {
                throw "The parent collection no longer exists.";
            }
            var alreadyInCollection = targetCollection.requestExistsInCollectionRoot(request.id);
            var alreadyInFolderWithId = targetCollection.requestExistsInCollectionFolders(request.id);

            if(!alreadyInCollection && !alreadyInFolderWithId) {
                targetCollection.addRequestIdToOrder(request.id);
            }

            request.write = (targetCollection.get("write")==true || pm.user.id==targetCollection.get("owner"));

            this.addRemoteRequestToDataStore(request, true, function(req) {
                if(req.folder!=null && req.folder.length>0) {
                    pmCollection.moveRequestToFolderWithOptSync(req.id, req.folder, false, callback);
                }
                else {
                    pmCollection.trigger("addCollectionRequest", req, false, false);
                    if (typeof callback === "function") {
                        callback();
                    }
                }
                pm.mediator.trigger('syncOperationDone');
            });
        }
        catch(e) {
            pm.syncLogger.error("Error while adding request: " + (e.stack || e));
            //console.log("Adding remote request failed: "+e);
            if(typeof callback === "function") callback();
            return -1;
        }
        return 0;
    },

    // Add request to collection. For the current request
    addRequestToCollection:function (collectionRequest, collection, noNotif, syncImmediately) {
        if(typeof(noNotif)==='undefined') noNotif = false;

        var pmCollection = this;

        if (collection.name) {
            collection.requests = [];
            collection.order = [collectionRequest.id];
            collection.timestamp = new Date().getTime();

            var finalOrder = [collectionRequest.id];
            //create collection with no order
            //create request
            //update creation with order
            pmCollection.addCollectionToDataStore(collection, true, false, function(newCollection) {
                pmCollection.addRequestToDataStore(collectionRequest, true, false, function(req) {
                    //var updatedCollection = _.clone(newCollection);
                    //updatedCollection.order = finalOrder;
                    //pmCollection.updateCollectionInDataStoreWithoutSync(updatedCollection, newCollection, true, function() {
                    pmCollection.trigger("addCollectionRequest", req, true);
                    pmCollection.loadCollectionRequest(req.id);
                    //});
                    if(syncImmediately) {
                        pm.syncManager.trigger("singleSyncDone");
                        pm.mediator.trigger("commitTransaction", collection.id);
                    }
                });
            });

        }
        else {
            collectionRequest.collectionId = collection.id;
            collectionRequest.collectionOwner = 0;

            var targetCollection = pmCollection.get(collection.id);
            var oldCollection = pmCollection.getJSONFromCollection(targetCollection);
            targetCollection.addRequestIdToOrder(collectionRequest.id);


            pmCollection.addRequestToDataStore(collectionRequest, true, true, function(req) {
                pmCollection.updateCollectionInDataStoreWithoutSync(targetCollection.getAsJSON(), oldCollection, true, function() {
                    pmCollection.trigger("addCollectionRequest", req, true);
                    pmCollection.loadCollectionRequest(req.id);
                });
            });
        }

        this.trigger("updateCollectionRequest", collectionRequest, noNotif);
        pm.mediator.trigger("updateCollectionRequest", collectionRequest);

    },


    // Add request to folder
    addRequestToFolder: function(collectionRequest, collectionId, folderId, noNotif, syncImmediately) {
        if(typeof(noNotif)==='undefined') noNotif = false;

        var pmCollection = this;

        var collection = this.get(collectionId);
        collectionRequest.collectionId = collectionId;
        collectionRequest.folder = folderId;
        collection.addRequestIdToOrder(collectionRequest.id);
        var targetFolder = this.getFolderById(folderId);
        pmCollection.addRequestToDataStore(collectionRequest, true, syncImmediately, function(folderId) {
            return function(req) {
                pmCollection.moveRequestToFolderWithOptSync(req.id, folderId, false);
                //Why is this needed? //pmCollection.loadCollectionRequest(req.id);
            };
        } (folderId));


        if(!noNotif) {
            noty(
                {
                    type:'success',
                    text:'Saved request',
                    layout:'topCenter',
                    timeout:750
                });
        }
    },

    //when the user is adding a response
    addResponseToCollectionRequestWithOptSync: function(collectionRequestId, response, toSync, callback) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(collectionRequestId, function(callback, response, toSync) {
            return function(collectionRequest) {
                if(!collectionRequest) {
                    //console.log("No such request found. Cannot add response to request.");
                    if(typeof callback==="function") {
                        callback();
                    }
                    return;
                }
                var oldRequest = pmCollection.getJSONFromRequest(collectionRequest);
                var responses;

                var collectionModel = pm.collections.getCollectionById(collectionRequest.collectionId);
                response.write = collectionModel.get("write")==true || pm.user.id==collectionModel.get("owner");

                if (collectionRequest.responses instanceof Array) {
                    collectionRequest["responses"].push(response);
                }
                else {
                    collectionRequest["responses"] = [response];
                }


                var responseToAdd = _.clone(response);

                pmCollection.updateRequestInDataStore(collectionRequest, oldRequest, true, function(request) {
                    pmCollection.trigger("updateCollectionRequest", request, true);
                    pm.mediator.trigger("updateCollectionRequest", request);

                    //sync the response
                    if (toSync) {
                        responseToAdd.requestObject = JSON.stringify(responseToAdd.request);
                        responseToAdd.request = request.id;
                        responseToAdd.collection = request.collection;
                        responseToAdd.collectionId = request.collectionId;
                        responseToAdd.owner = request.owner;
                        pm.syncManager.addChangeset("response", "create", responseToAdd, null, true);
                    }

                    if(typeof callback==="function") {
                        callback();
                    }

                }, false);
            }
        } (callback, response, toSync));
        return 0;
    },

    //accepts an array of responses
    //called when remote responses are added to a request
    addResponsesToCollectionRequestWithoutSync: function(collectionRequestId, responses, callback) {
        var pmCollection = this;
        var allResponses = _.cloneDeep(responses);

        pm.indexedDB.getCollectionRequest(collectionRequestId, function (collectionRequest) {
            var oldRequest = pmCollection.getJSONFromRequest(collectionRequest);
            var responses;
            var collectionModel = pm.collections.getCollectionById(collectionRequest.collection);

            _.each(allResponses,function(response){
                response.write = collectionModel.get("write") || pm.user.id==collectionModel.get("owner");
            });

            if (collectionRequest.responses instanceof Array) {
                collectionRequest["responses"] = collectionRequest["responses"].concat(allResponses);
            }
            else {
                collectionRequest["responses"] = allResponses;
            }

            pmCollection.updateRequestInDataStore(collectionRequest, oldRequest, true, function(request) {
                pmCollection.trigger("updateCollectionRequest", request, true);
                pm.mediator.trigger("updateCollectionRequest", request);

                if(callback) callback();

            }, false);
        });
        return 0;
    },


    addResponseToCollectionRequest: function(collectionRequestId, response) {
        this.addResponseToCollectionRequestWithOptSync(collectionRequestId, response, true);
    },

    updateResponsesForCollectionRequestWithOptSync: function(collectionRequestId, responses, toSync) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(collectionRequestId, function (collectionRequest) {
            var oldRequest = pmCollection.getJSONFromRequest(collectionRequest);
            collectionRequest.responses = responses;
            pmCollection.updateRequestInDataStore(collectionRequest, oldRequest, true, function(request) {
                pmCollection.trigger("updateCollectionRequest", request, true);
                pm.mediator.trigger("updateCollectionRequest", request);
            }, toSync);
        });
    },

    updateResponsesForCollectionRequest: function(collectionRequestId, responses) {
        this.updateResponsesForCollectionRequestWithOptSync(collectionRequestId, responses, true);
    },

    // Update collection request
    updateCollectionRequest:function (collectionRequest) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(collectionRequest.id, function (req) {
            var oldRequest = pmCollection.getJSONFromRequest(req);
            collectionRequest.name = req.name;
            collectionRequest.description = req.description;
            collectionRequest.collectionId = req.collectionId;
            collectionRequest.responses = req.responses;

            pmCollection.updateRequestInDataStore(collectionRequest, oldRequest, true, function (request) {
                pmCollection.trigger("updateCollectionRequest", request);
                pm.mediator.trigger("updateCollectionRequest", request);
            }, true);
        });
    },


    updateRemoteCollectionRequest: function(request, callback) {
        try  {
            var pmCollection = this;
            var oldRequest = pm.collections.getRequestById(request.id);
            var newRequest = this.mergeEntitiesForUpdate(request, oldRequest);
            pmCollection.updateRequestInDataStore(newRequest, oldRequest, true, function(request1) {
                pmCollection.trigger("updateCollectionRequest", request1, true);
                pm.mediator.trigger("updateCollectionRequest", request1);
                pm.mediator.trigger('syncOperationDone');
                if(callback) callback();
            }, false);
        }
        catch(e) {
            console.log("Updating collection request failed: "+e);
            callback();
            return -1;
        }
        return 0;
    },

    updateCollectionRequestMeta: function(id, name, description) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(id, function (req) {
            var oldRequest = pmCollection.getJSONFromRequest(req);
            req.name = name;
            req.description = description;

            pmCollection.updateRequestInDataStore(req, oldRequest, true, function(request) {
                pmCollection.trigger("updateCollectionRequest", request);
                pm.mediator.trigger("updateCollectionRequest", request);
            }, true);
        });
    },

    updateCollectionRequestSyncStatus: function(id, status) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(id, function (req) {
            var oldRequest = pmCollection.getJSONFromRequest(req);
            req.synced = status;

            pmCollection.updateRequestInDataStore(req, oldRequest, false, function(request) {
            });
        });
    },

    updateCollectionRequestTests: function(id, tests) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(id, function (req) {
            var oldRequest = pmCollection.getJSONFromRequest(req);
            req.tests = tests;

            pmCollection.updateRequestInDataStore(req, oldRequest, true, function(request) {
                pmCollection.trigger("updateCollectionRequest", request);
                pm.mediator.trigger("updateCollectionRequest", request);
            }, true);
        });
    },

    deleteCollectionRequestWithOptSync: function(id, toSync, callback) {
        var pmCollection = this;

        pmCollection.deleteRequestFromDataStoreWithOptSync(id, true, true, toSync, function() {
            pmCollection.trigger("removeCollectionRequest", id);
            pm.mediator.trigger('syncOperationDone');
            if (callback) {
                callback();
            }
        });

        return 0;
    },

    // Delete collection request
    deleteCollectionRequest:function (id, callback) {
        this.deleteCollectionRequestWithOptSync(id, true, callback);
    },

    //used when request is added to folder
    addRequestToFolder_old: function(requestId, targetFolder, toSync) {
        //Just update the folder
        targetFolder.order.push(requestId);
        if(toSync) {
            pm.syncManager.addChangeset('folder','update',targetFolder, null, true);
        }
    },

    getRemoteRequestIntoCollectionOrFolder: function(requestId, targetFolderId, targetCollectionId, ownerId, callback) {
        var oldThis = this;
        pm.syncManager.getEntityFromId("request", requestId, ownerId, null, function(request) {
            if(request.hasOwnProperty("err")) {
                pm.mediator.trigger('syncOperationFailed', request.err);
                return;
            }

            request["collectionId"] = targetCollectionId;
            if(targetFolderId) {
                request.folder = targetFolderId;
            }
            ////pm.syncStatusManager.addNotification("request",request, "create");
            //hack for rawModeData
            if(request.dataMode==="raw" && request.rawModeData) {
                request.data = request.rawModeData;
                delete request.rawModeData;
            }
            oldThis.addFullCollectionRequest(request, callback);
        });
    },


    moveRequestToFolderWithOptSync: function(requestId, targetFolderId, toSync, callback) {
        //console.log("Request moved to folder");
        pm.requestTransferInProgress = true;
        setTimeout(function() {
            pm.requestTransferInProgress = false;
        },200);

        var pmCollection = this;
        var request = this.getRequestById(requestId); //will return a backbone object

        targetFolderId = targetFolderId.substring(targetFolderId.indexOf("#")+1);

        var folder = this.getFolderById(targetFolderId);

        var targetCollection = this.getCollectionForFolderId(targetFolderId);

        if(request == null && targetCollection!=null) {
            //if request doesn't exist
            var ownerOfCollection = targetCollection.get("owner");
            this.getRemoteRequestIntoCollectionOrFolder(requestId, targetFolderId, targetCollection.get("id"), ownerOfCollection, callback);
        }
        else if(folder==null || targetCollection == null) {
            //destination doesn't exist - delete request
            this.deleteCollectionRequestWithOptSync(requestId, false, callback);
        }
        else {
            //actual transfer action
            var oldLocation = {};
            if(request.folder!=null) {
                oldLocation = {
                    "model": "folder",
                    "model_id": request.folder,
                    "collection_id": request.collectionId,
                    "owner": pm.collections.getOwnerForCollection(request.collectionId)
                };
            }
            else {
                oldLocation = {
                    "model": "collection",
                    "model_id": request.collectionId,
                    "collection_id": request.collectionId,
                    "owner": pm.collections.getOwnerForCollection(request.collectionId)
                };
            }


            var oldCollection = pmCollection.getJSONFromCollection(targetCollection);
            if(targetCollection.id === request.collectionId) {
                //same collection - retain ID
                if(toSync) {
                    pm.tracker.trackEvent("request", "transfer", "same_collection");
                }

                targetCollection.addRequestIdToFolder(folder.id, request.id);

                var oldRequest = _.clone(request);

                request.folder = folder.id;
                targetCollection.removeRequestIdFromOrder(request.id);

                pmCollection.updateRequestInDataStore(request, oldRequest, true, function() {
                    pmCollection.updateCollectionInDataStoreWithoutSync(targetCollection.getAsJSON(), oldCollection, true, function() {
                        pmCollection.trigger("moveRequestToFolder", oldLocation, targetCollection, folder, request, toSync);
                        pm.mediator.trigger('syncOperationDone');
                        if(typeof callback === "function") {
                            callback();
                        }
                    });
                }, false);
            }
            else {
                // Different collection - new request ID
                if(toSync) {
                    pm.tracker.trackEvent("request", "transfer", "different_collection");
                }

                var newRequestId = guid();
                pmCollection.deleteCollectionRequestWithOptSync(requestId, true, function(request, newRequestId, targetCollection, folder, oldCollection, oldLocation, callback) {
                    return function() {
                        var oldRequestId = request.id;
                        request.id = newRequestId;
                        request.collectionId = targetCollection.get("id");
                        request.folder = folder.id;
                        request.owner = targetCollection.get("owner");

                        //targetCollection.addRequestIdToOrder(request.id); - WHY ARE WE DOING THIS?
                        //pmCollection.trigger("removeCollectionRequest", requestId);

                        //to avoid sending PUT /request
                        pmCollection.addRequestToDataStoreWithOptSync(request, true, true, true, function(targetCollection, folder, oldCollection, callback) {
                            return function(req) {
                                targetCollection.addRequestIdToFolder(folder.id, req.id);
                                var collection = targetCollection.getAsJSON();
                                pmCollection.updateCollectionInDataStoreWithoutSync(collection, oldCollection, true, function(oldLocation, targetCollection, folder, request, callback, oldRequestId) {
                                    return function(c) {
                                        //don't sync the transfer request if the request is moved to a different collection - a delete and a create event will be sent
                                        pmCollection.trigger("moveRequestToFolder", oldLocation, targetCollection, folder, request, false, oldRequestId);
                                        //pmCollection.trigger("addCollectionRequest", request, false, false);

                                        pm.mediator.trigger('syncOperationDone');
                                        if(typeof callback === "function") callback();
                                    }
                                } (oldLocation, targetCollection, folder, request, callback, oldRequestId));
                            }
                        } (targetCollection, folder, oldCollection, callback));
                    }
                } (request, newRequestId, targetCollection, folder, oldCollection, oldLocation, callback));

            }
        }
    },

    moveRequestToFolder: function(requestId, targetFolderId) {
        this.moveRequestToFolderWithOptSync(requestId, targetFolderId, true);
    },

    moveRequestToCollection: function(requestId, targetCollectionId) {
        this.moveRequestToCollectionWithOptSync(requestId, targetCollectionId, true);
    },

    moveRequestToCollectionWithOptSync: function(requestId, targetCollectionId, toSync, callback) {
        pm.requestTransferInProgress = true;
        setTimeout(function() {
            pm.requestTransferInProgress = false;
        },200);
        var pmCollection = this;
        var targetCollection = this.get(targetCollectionId);
        var request = _.clone(this.getRequestById(requestId));

        if(request == null && targetCollection!=null) {
            //if request doesn't exist
            var ownerOfCollection = targetCollection.get("owner");
            this.getRemoteRequestIntoCollectionOrFolder(requestId, null, targetCollection.get("id"), ownerOfCollection, callback);
        }
        else if(targetCollection == null) {
            //destination doesn't exist - delete request
            this.deleteCollectionRequestWithOptSync(requestId, false, callback);
        }
        else {
            request.owner = pm.collections.getOwnerForCollection(request.collectionId);

            var oldLocation = {};
            if(request.folder!=null) {
                oldLocation = {
                    "model": "folder",
                    "model_id": request.folder,
                    "collection_id": request.collectionId,
                    "owner": request.owner
                };
            }
            else {
                oldLocation = {
                    "model": "collection",
                    "model_id": request.collectionId,
                    "collection_id": request.collectionId,
                    "owner": request.owner
                };
            }

            var oldCollection = pmCollection.getJSONFromCollection(targetCollection);
            if (targetCollectionId === request.collectionId) {
                //same collection - retain requestId
                if(toSync) {
                    pm.tracker.trackEvent("request", "transfer", "same_collection");
                }
                targetCollection.addRequestIdToOrder(request.id);

                var oldRequest = _.clone(request);
                delete request.folder;
                pmCollection.updateRequestInDataStore(request, oldRequest, true, function(request){ //delete folder.request
                    pmCollection.updateCollectionInDataStoreWithoutSync(targetCollection.getAsJSON(), oldCollection, true, function (c) { //add request to collection order
                        pmCollection.trigger("moveRequestToCollection", oldLocation, targetCollection, request, toSync);
                        pm.mediator.trigger('syncOperationDone');
                        if (callback) callback();
                    });
                });
            }
            else {
                //var oldCollection = pmCollection.get(request.collectionId); - don't know what this is for
                var newRequestId = guid();
                pmCollection.deleteCollectionRequestWithOptSync(requestId, true, function () {
                    request.id = newRequestId;
                    request.collectionId = targetCollectionId;
                    request.owner = targetCollection.get("owner");
                    delete request.folder;
                    if(toSync) {
                        pm.tracker.trackEvent("request", "transfer", "different_collection");
                    }

                    pmCollection.trigger("removeCollectionRequest", requestId);

                    targetCollection.addRequestIdToOrder(request.id);

                    pmCollection.addRequestToDataStoreWithOptSync(request, true, true, true, function (req) {
                        pmCollection.updateCollectionInDataStoreWithoutSync(targetCollection.getAsJSON(), oldCollection, true, function (c) {
                            //don't sync the transfer request if the request is moved to a different collection - a delete and a create event will be sent
                            pmCollection.trigger("addCollectionRequest", request, false, false);
                            //pmCollection.trigger("moveRequestToCollection", oldLocation, targetCollection, request, false);
                            pm.mediator.trigger('syncOperationDone');
                            if (callback) callback();
                        });
                    });
                });
            }
        }
    },

    // Get folder by ID
    getFolderById: function(id) {
        function existingFolderFinder(r) {
            return r.id === id;
        }

        for(var i = 0; i < this.length; i++) {
            var collection = this.models[i];
            var folders = collection.get("folders");
            var folder = _.find(folders, existingFolderFinder);
            if (folder) {
                return folder;
            }
        }

        return null;
    },

    addFolder: function(parentId, folderName, description) {
        var collection = this.get(parentId);
        var oldCollection = this.getJSONFromCollection(collection);

        var newFolder = {
            "id": guid(),
            "name": folderName,
            "description": description,
            "write": (collection.get("write") || pm.user.id == collection.get("owner")),
            "order": []
        };

        collection.addFolder(newFolder);
        this.trigger("addFolder", collection, newFolder);
        this.updateCollectionInDataStoreWithoutSync(collection.getAsJSON(), oldCollection, true);
        newFolder["collection"] = parentId;
        newFolder["owner"] = collection.get("owner");
        pm.syncManager.addChangeset("folder","create",newFolder, null, true);
    },

    addExistingFolder: function(parentId, folder, syncImmediately) {
        var collection = this.get(parentId);
        var oldCollection = this.getJSONFromCollection(collection);
        if(collection.hasFolderId(folder.id)) {
            //console.log("Error - The folderID already exists in the collection. Not re-adding.");
            return;
        }
        collection.addFolder(folder);
        this.trigger("addFolder", collection, folder);
        this.updateCollectionInDataStoreWithoutSync(collection.getAsJSON(), oldCollection,true);
        folder["collection"] = parentId;
        pm.syncManager.addChangeset("folder","create",folder, null, syncImmediately);
    },

    addFolderFromRemote: function(folder, callback) {
        var collection, oldCollection;
        try {
            collection = this.get(folder.collection);
            if(!collection) {
                throw "The parent collection no longer exiloadsts";
            }
            oldCollection = this.getJSONFromCollection(collection);
            folder.write = collection.get("write") || pm.user.id==collection.get("owner");

            if(collection.hasFolderId(folder.id)) {
                throw "The folderID already exists in the collection. Not re-adding.";
            }

            collection.addFolder(folder);
            this.trigger("addFolder", collection, folder);
            this.updateCollectionInDataStoreWithoutSync(collection.getAsJSON(), oldCollection,true, callback);
            pm.mediator.trigger('syncOperationDone');
        }
        catch(e) {
            //console.log("Did not add remote folder: "+e);
            if(typeof callback === "function") {
                callback();
            }
        }
        return 0;
    },

    updateFolderFromRemote: function(folder, callback) {
        var collection, oldCollection;
        try {
            collection = this.get(folder.collection);
            oldCollection = this.getJSONFromCollection(collection);
            collection.editFolder(folder);
            this.trigger("updateFolder", collection, folder);
            this.updateCollectionInDataStoreWithoutSync(collection.getAsJSON(), oldCollection,true, callback);
            pm.mediator.trigger('syncOperationDone');
        }
        catch(e) {
            //console.log("Faced error while adding remote folder");
            callback();
            return -1;
        }
        return 0;
    },

    updateFolderOrder: function(collectionId, folderId, order, sync) {
        var folder = this.getFolderById(folderId);
        folder.order = order;
        var collection = this.get(collectionId);
        var oldCollection = this.getJSONFromCollection(collection);
        collection.editFolder(folder);

        this.updateCollectionInDataStoreWithoutSync(collection.getAsJSON(), oldCollection,true);
        folder["collectionId"] = collectionId;
        pm.syncManager.addChangeset("folder","update",folder, null, true);
    },

    updateFolderMeta: function(id, name, description) {
        var folder = this.getFolderById(id);
        folder.name = name;
        folder.description = description;
        var collection = this.getCollectionForFolderId(id);
        var oldCollection = this.getJSONFromCollection(collection);
        collection.editFolder(folder);
        this.trigger("updateFolder", collection, folder);

        this.updateCollectionInDataStoreWithoutSync(collection.getAsJSON(), oldCollection, true);
        folder["collectionId"] = collection.getAsJSON().id;
        var folderToSend = _.clone(folder);
        delete folderToSend.order;
        pm.syncManager.addChangeset("folder","update",folderToSend, null, true);
    },

    deleteFolderWithOptSync: function(id, toSync, callback) {
        var folder = this.getFolderById(id);
        if(!folder) {
            pm.mediator.trigger('syncOperationDone');
            if(callback) callback();
            return;
        }
        var folderRequestsIds = _.clone(folder.order);
        var i;
        var collection;

        for(i = 0; i < folderRequestsIds.length; i++) {
            //only one delete folder request is sent to the sync server, individual request deletes aren't sent
            this.deleteRequestFromDataStoreWithOptSync(folderRequestsIds[i], true, false, false, null);
        }

        collection = this.getCollectionForFolderId(id);
        var oldCollection = this.getJSONFromCollection(collection);
        collection.deleteFolder(id);

        this.trigger("deleteFolder", collection, id);

        this.updateCollectionInDataStoreWithoutSync(collection.getAsJSON(), oldCollection,true, function() {
            if(toSync) {
                pm.syncManager.addChangeset("folder","destroy",{"id":id, owner: collection.get("owner")}, null, true);
            }
            pm.mediator.trigger('syncOperationDone');
            if(callback) callback();
        });
    },

    deleteFolder: function(id) {
        this.deleteFolderWithOptSync(id, true);
    },

    filter: function(term) {
        term = term.toLowerCase();
        var collections = this.toJSON();
        var collectionCount = collections.length;
        var filteredCollections = [];
        var name;
        var requests;
        var requestsCount;
        var i, j, k, c, r, f;
        var folders;
        var folderOrder;
        var visibleRequestHash = {};

        for(i = 0; i < collectionCount; i++) {
            c = {
                id: collections[i].id,
                name: collections[i].name,
                requests: [],
                folders: [],
                toShow: false
            };

            name = collections[i].name.toLowerCase();

            if (name.search(term) >= 0) {
                c.toShow = true;
            }

            requests = collections[i].requests;

            if (requests) {
                requestsCount = requests.length;

                for(j = 0; j < requestsCount; j++) {
                    r = {
                        id: requests[j].id,
                        name: requests[j].name,
                        toShow: false
                    };

                    name = requests[j].name.toLowerCase();

                    if (name.search(term) >= 0) {
                        r.toShow = true;
                        c.toShow = true;
                        visibleRequestHash[r.id] = true;
                    }
                    else {
                        r.toShow = false;
                        visibleRequestHash[r.id] = false;
                    }

                    c.requests.push(r);
                }
            }

            if("folders" in collections[i]) {
                folders = collections[i].folders;
                for (j = 0; j < folders.length; j++) {
                    f = {
                        id: folders[j].id,
                        name: folders[j].name,
                        toShow: false
                    };

                    name = folders[j].name.toLowerCase();

                    if (name.search(term) >= 0) {
                        f.toShow = true;
                        c.toShow = true;
                    }

                    folderOrder = folders[j].order;

                    // Check if any requests are to be shown
                    for(k = 0; k < folderOrder.length; k++) {
                        if (visibleRequestHash[folderOrder[k]] === true) {
                            f.toShow = true;
                            c.toShow = true;
                            break;
                        }
                    }

                    c.folders.push(f);
                }
            }

            filteredCollections.push(c);
        }

        this.trigger("filter", filteredCollections);
        return filteredCollections;
    },

    revert: function() {
        this.trigger("revertFilter");
    },


    //Sync handlers
    onSyncChangeReceived: function(verb, message, callback) {
        if(!message.model) message.model = message.type;

        var allowedTypes = ["collection", "request", "response", "folder"];
        if(allowedTypes.indexOf(message.model) === -1) {
            return;
        }

        if(verb === "create") {
            this.createRemoteEntity(message, callback);
        }
        else if (verb === "update") {
            this.updateRemoteEntity(message, callback);
        }
        else if (verb === "destroy" || verb === "delete") {
            this.deleteRemoteEntity(message, callback);
        }
        else if (verb === "transfer") {
            this.transferRemoteEntity(message, callback);
        }
        //else if()
    },

    createRemoteEntity: function(message, callback) {
        if(message.model === "collection") {
            message.data["requests"]=[];
            //pm.syncStatusManager.addNotification("collection",message.data, "create");
            var status = this.addFullCollection(message.data, true, callback);
            if(status==-1) {
                pm.mediator.trigger('syncOperationFailed', "Adding full collection failed");
            }
            else {
                //TODO: Where do we put this? :S
                pm.syncManager.updateSinceFromMessage(message);
                if(message.data.order) {
                    this.trigger("sortRequestContainer", "collection", message.data.id, message.data.order);
                }
            }
            pm.syncLogger.log(new Error(),["Collection created: ",message.data]);
        }
        else if (message.model === "request") {
            message.data["collectionId"]=message.data.collection;
            //pm.syncStatusManager.addNotification("request",message.data, "create");
            //hack for rawModeData
            //hack for rawModeData
            if(message.data.dataMode==="raw" && message.data.rawModeData) {
                message.data.data = message.data.rawModeData;
                delete message.data.rawModeData;
            }
            var status = this.addFullCollectionRequest(message.data, callback);
            if(status==-1) {
                pm.mediator.trigger('syncOperationFailed', "Adding full collection request failed");
            }
            else {
                pm.syncManager.updateSinceFromMessage(message);
            }
            pm.syncLogger.log(new Error(),["Request created: ",message.data]);
        }
        else if (message.model === "response") {
            //pm.syncStatusManager.addNotification("response",message.data, "create");
            var requestId = message.data.request;
            var newline = new RegExp("\n",'g');
            if(message.data.requestObject) {
                message.data.requestObject = message.data.requestObject.replace(newline, "");
            }

            try {
                message.data.request = JSON.parse(message.data.requestObject);
            }
            catch(e) {
                //console.log("Could not parse response's request");
                message.data.request = {};
            }
            var status = this.addResponseToCollectionRequestWithOptSync(requestId, message.data, false, callback);
            if(status==-1) {
                pm.mediator.trigger('syncOperationFailed', "Adding response to request failed");
            }
            else {
                pm.syncManager.updateSinceFromMessage(message);
            }
            pm.syncLogger.log(new Error(),["Response added: ",message.data]);
        }
        else if (message.model === "folder") {
            //pm.syncStatusManager.addNotification("folder",message.data, "create");
            var status = pm.collections.addFolderFromRemote(message.data, callback);
            if(status==-1) {
                pm.mediator.trigger('syncOperationFailed', "Add folder from remote failed");
            }
            else {
                pm.syncManager.updateSinceFromMessage(message);
                if(message.data.order) {
                    this.trigger("sortRequestContainer", "folder", message.data.id, message.data.order);
                }
            }
            pm.syncLogger.log(new Error(),["Folder added: ",message.data]);
        }
    },

    updateRemoteEntity: function(message, callback) {
        if(message.model === "collection") {
            //pm.syncStatusManager.addNotification("collection",message.data, "update");
            var status = pm.collections.updateRemoteCollectionInDataStore(message.data,null,true, callback);
            if(status==-1) {
                pm.mediator.trigger('syncOperationFailed', "Updating collection failed");
            }
            else {
                pm.syncManager.updateSinceFromMessage(message);
                if(message.data.order) {
                    this.trigger("sortRequestContainer", "collection", message.data.id, message.data.order);
                }
            }
            pm.syncLogger.log(new Error(),["Collection updated: ",message.data]);
        }
        else if(message.model === "request") {
            message.data["collectionId"]=message.data.collection;

            //hack for rawModeData
            if(message.data.dataMode==="raw" && message.data.rawModeData) {
                message.data.data = message.data.rawModeData;
                delete message.data.rawModeData;
            }

            //pm.syncStatusManager.addNotification("request",message.data, "update");
            var status = pm.collections.updateRemoteCollectionRequest(message.data, callback);
            if(status==-1) {
                pm.mediator.trigger('syncOperationFailed', "Updating collection request failed");
            }
            else {
                pm.syncManager.updateSinceFromMessage(message);
            }
            pm.syncLogger.log(new Error(),["Request updated: ",message.data]);
        }
        else if(message.model === "folder") {
            //pm.syncStatusManager.addNotification("folder",message.data, "update");
            var status = pm.collections.updateFolderFromRemote(message.data, callback);
            if(status==-1) {
                pm.mediator.trigger('syncOperationFailed', "Updating folder failed");
            }
            else {
                pm.syncManager.updateSinceFromMessage(message);
                if(message.data.order) {
                    this.trigger("sortRequestContainer", "folder", message.data.id, message.data.order);
                }
            }
            pm.syncLogger.log(new Error(),["Folder updated: ", message.data]);
        }
    },

    deleteRemoteEntity: function(message, callback) {
        if(message.model === "collection") {
            pm.syncLogger.log(new Error(),["Collection destroyed: ",message.data]);
            //pm.syncStatusManager.addNotification("collection",message.data, "destroy");

            //unsubscribe if subscribed
            if(pm.subscriptionManger.isSubscribedTo(message.data.id)) {
                message.data.model_id = message.data.id;
                pm.mediator.trigger("unsubscribeFromCollection", message, false, function() {
                    //console.log("Unsubscribed");
                });
            }
            var status = pm.collections.deleteCollectionFromDataStoreWithOptSync(message.data.id, true, false, callback);

            if(status==-1) {
                pm.mediator.trigger('syncOperationFailed', "Deleting collection failed");
            }
            else {
                pm.syncManager.updateSinceFromMessage(message);
            }
        }
        else if(message.model === "request") {
            pm.syncLogger.log(new Error(),["Request destroyed: ",message.data]);
            //pm.syncStatusManager.addNotification("request",message.data, "destroy");
            var status = pm.collections.deleteCollectionRequestWithOptSync(message.data.id, false, callback);
            if(status==-1) {
                pm.mediator.trigger('syncOperationFailed', "Deleting collection request failed");
            }
            else {
                pm.syncManager.updateSinceFromMessage(message);
            }
        }
        else if(message.model === "folder") {
            //pm.syncStatusManager.addNotification("folder",message.data, "destroy");
            pm.syncLogger.log(new Error(),["Folder destroyed: ",message.data]);
            var status = pm.collections.deleteFolderWithOptSync(message.data.id, false, callback);
            if(status==-1) {
                pm.mediator.trigger('syncOperationFailed', "Deleting folder failed");
            }
            else {
                pm.syncManager.updateSinceFromMessage(message);
            }
        }
        else if(message.model === "response") {
            pm.syncLogger.log(new Error(),["Response destroyed: ",message.data]);
            //pm.syncStatusManager.addNotification("response",message.data, "destroy");
            pm.request.deleteSampleResponseByIdWithOptSync(message.data.id, false, callback);
            //call callback regardless
            pm.syncManager.updateSinceFromMessage(message);
        }
    },

    transferRemoteEntity: function(message, callback) {
        var destType = message.data.to.model;
        //pm.syncStatusManager.addNotification("request",message.data, "transfer");
        if(destType === "folder") {
            this.moveRequestToFolderWithOptSync(message.data.id, message.data.to.model_id, false, callback);
        }
        else if(destType === "collection") {
            this.moveRequestToCollectionWithOptSync(message.data.id, message.data.to.model_id, false, callback);
        }
    },

    onSyncErrorReceived: function(verb, message) {
        var pmCollection = this;
        //collection ID already shared in team
        if(message.error.name === "collectionIdSharedError") {
            noty(
                {
                    type:'warning',
                    text:'This collection has already been shared in the team. You can share it if you duplicate it',
                    layout:'topCenter',
                    timeout:5000
                });
            //unshare it
            var collection = pm.collections.getCollectionById(message.error.details.model_id);
            collection.set("sharedWithTeam",false);

            pmCollection.updateCollectionInDataStoreWithOptSync(collection.getAsJSON(), collection, true, false, function (c) {
                pmCollection.trigger("updateCollection", collection);
            });
            //this.trigger("updateCollectionMeta", targetCollection);
        }
    },
});