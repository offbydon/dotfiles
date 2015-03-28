pm.indexedDB = {
    TABLE_HEADER_PRESETS: "header_presets",
    TABLE_HELPERS: "helpers",
    TABLE_DRIVE_FILES: "drive_files",
    TABLE_DRIVE_CHANGES: "drive_changes",
    TABLE_OAUTH2_ACCESS_TOKENS: "oauth2_access_tokens",
    TABLE_TEST_RUNS: "test_runs",

    onTransactionComplete: function(callback) {
        if (pm.isTesting) {
            pm.indexedDB.clearAllObjectStores(function() {
                callback();
            });
        }
        else {
            callback();
        }
    },

    onerror:function (event, callback) {
        console.log("Could not load DB", event);
        pm.mediator.trigger("error");
    },

    open_v21:function (callback) {
        var request = indexedDB.open(pm.databaseName, "POSTman request history");
        request.onsuccess = function (e) {
            var v = "0.7.10";
            pm.indexedDB.db = e.target.result;
            var db = pm.indexedDB.db;

            //We can only create Object stores in a setVersion transaction
            if (v !== db.version) {
                var setVrequest = db.setVersion(v);

                setVrequest.onfailure = function (e) {
                    console.log(e);
                };

                setVrequest.onsuccess = function (event) {
                    //Only create if does not already exist
	                if (!db.objectStoreNames.contains("requests")) {
		                var requestStore = db.createObjectStore("requests", {keyPath:"id"});
		                requestStore.createIndex("timestamp", "timestamp", { unique:false});
	                }

	                if (!db.objectStoreNames.contains("systemValues")) {
		                var requestStore = db.createObjectStore("systemValues", {keyPath:"name"});
		                requestStore.createIndex("name", "name", { unique:true});
	                }

                    if (!db.objectStoreNames.contains("collections")) {
                        var collectionsStore = db.createObjectStore("collections", {keyPath:"id"});
                        collectionsStore.createIndex("timestamp", "timestamp", { unique:false});
                    }

                    if (!db.objectStoreNames.contains("collection_requests")) {
                        var collectionRequestsStore = db.createObjectStore("collection_requests", {keyPath:"id"});
                        collectionRequestsStore.createIndex("timestamp", "timestamp", { unique:false});
                        collectionRequestsStore.createIndex("collectionId", "collectionId", { unique:false});
                    }

	                if (!db.objectStoreNames.contains("unsynced_changes")) {
		                var unsyncedChanges = db.createObjectStore("unsynced_changes", {keyPath:"id"});
		                unsyncedChanges.createIndex("timestamp", "timestamp", { unique:false});
	                }


	                if (db.objectStoreNames.contains("collection_responses")) {
                        db.deleteObjectStore("collection_responses");
                    }

                    if (!db.objectStoreNames.contains("environments")) {
                        var environmentsStore = db.createObjectStore("environments", {keyPath:"id"});
                        environmentsStore.createIndex("timestamp", "timestamp", { unique:false});
                        environmentsStore.createIndex("id", "id", { unique:false});
                    }

                    if (!db.objectStoreNames.contains("header_presets")) {
                        var headerPresetsStore = db.createObjectStore("header_presets", {keyPath:"id"});
                        headerPresetsStore.createIndex("timestamp", "timestamp", { unique:false});
                    }

                    if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_HELPERS)) {
                        var helpersStore = db.createObjectStore(pm.indexedDB.TABLE_HELPERS, {keyPath:"id"});
                        helpersStore.createIndex("timestamp", "timestamp", { unique:false});
                    }

                    if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_DRIVE_FILES)) {
                        var driveFilesStore = db.createObjectStore(pm.indexedDB.TABLE_DRIVE_FILES, {keyPath:"id"});
                        driveFilesStore.createIndex("timestamp", "timestamp", { unique:false});
                        driveFilesStore.createIndex("fileId", "fileId", { unique:false});
                    }
                    else {
                        var driveFilesStoreForIndex = request.transaction.objectStore(pm.indexedDB.TABLE_DRIVE_FILES);
                        driveFilesStoreForIndex.createIndex("fileId", "fileId", { unique:false});
                    }

                    if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_DRIVE_CHANGES)) {
                        var driveChangesStore = db.createObjectStore(pm.indexedDB.TABLE_DRIVE_CHANGES, {keyPath:"id"});
                        driveChangesStore.createIndex("timestamp", "timestamp", { unique:false});
                    }

                    if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS)) {
                        var accessTokenStore = db.createObjectStore(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS, {keyPath:"id"});
                        accessTokenStore.createIndex("timestamp", "timestamp", { unique:false});
                    }

                    if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_TEST_RUNS)) {
                        var environmentsStore = db.createObjectStore(pm.indexedDB.TABLE_TEST_RUNS, {keyPath:"id"});
                        environmentsStore.createIndex("timestamp", "timestamp", { unique:false});
                    }

                    var transaction = event.target.result;
                    transaction.oncomplete = pm.indexedDB.onTransactionComplete;
                };

                setVrequest.onupgradeneeded = function (evt) {
                };
            }
        };

        request.onfailure = pm.indexedDB.onerror;
    },

    open_latest:function (callback) {
        var v = 39;
        var request = indexedDB.open(pm.databaseName, v);
        request.onupgradeneeded = function (e) {
            console.log("Upgrade DB");
            var db = e.target.result;
            pm.indexedDB.db = db;

            if (!db.objectStoreNames.contains("requests")) {
                var requestStore = db.createObjectStore("requests", {keyPath:"id"});
                requestStore.createIndex("timestamp", "timestamp", { unique:false});
            }

            if (!db.objectStoreNames.contains("systemValues")) {
                var requestStore = db.createObjectStore("systemValues", {keyPath:"name"});
                requestStore.createIndex("name", "name", { unique:true});
            }

            if (!db.objectStoreNames.contains("sinceIds")) {
                var requestStore = db.createObjectStore("sinceIds", {keyPath:"id"});
                requestStore.createIndex("id", "id", { unique:true});
            }

            //this table will have userId:collectionId values. That's it
            if (!db.objectStoreNames.contains("subscriptions")) {
                var requestStore = db.createObjectStore("subscriptions", {keyPath:"id"});
                requestStore.createIndex("id", "id", { unique:true});
            }

            if (!db.objectStoreNames.contains("collections")) {
                var collectionsStore = db.createObjectStore("collections", {keyPath:"id"});
                collectionsStore.createIndex("timestamp", "timestamp", { unique:false});
            }

			if (!db.objectStoreNames.contains("unsynced_changes")) {
				var unsyncedChanges = db.createObjectStore("unsynced_changes", {keyPath:"id"});
				unsyncedChanges.createIndex("timestamp", "timestamp", { unique:false});
			}

            if (!db.objectStoreNames.contains("sync_conflicts")) {
                //here, id will be request:<request_id>[:transfer]
                var unsyncedChanges = db.createObjectStore("sync_conflicts", {keyPath:"id"});
                unsyncedChanges.createIndex("id", "id", { unique:true});
            }

            if (!db.objectStoreNames.contains("collection_requests")) {
                var collectionRequestsStore = db.createObjectStore("collection_requests", {keyPath:"id"});
                collectionRequestsStore.createIndex("timestamp", "timestamp", { unique:false});
                collectionRequestsStore.createIndex("collectionId", "collectionId", { unique:false});
				collectionRequestsStore.createIndex("folderId", "folderId", { unique:false});
            }

            if (!db.objectStoreNames.contains("environments")) {
                var environmentsStore = db.createObjectStore("environments", {keyPath:"id"});
                environmentsStore.createIndex("timestamp", "timestamp", { unique:false});
                environmentsStore.createIndex("id", "id", { unique:false});
            }

            if (!db.objectStoreNames.contains("header_presets")) {
                var headerPresetsStore = db.createObjectStore("header_presets", {keyPath:"id"});
                headerPresetsStore.createIndex("timestamp", "timestamp", { unique:false});
            }

            if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_HELPERS)) {
                var helpersStore = db.createObjectStore(pm.indexedDB.TABLE_HELPERS, {keyPath:"id"});
                helpersStore.createIndex("timestamp", "timestamp", { unique:false});
            }

            if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_DRIVE_FILES)) {
                var driveFilesStore = db.createObjectStore(pm.indexedDB.TABLE_DRIVE_FILES, {keyPath:"id"});
                driveFilesStore.createIndex("timestamp", "timestamp", { unique:false});
                driveFilesStore.createIndex("fileId", "fileId", { unique:false});
            }

            if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_DRIVE_CHANGES)) {
                var driveChangesStore = db.createObjectStore(pm.indexedDB.TABLE_DRIVE_CHANGES, {keyPath:"id"});
                driveChangesStore.createIndex("timestamp", "timestamp", { unique:false});
            }

            if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS)) {
                var accessTokenStore = db.createObjectStore(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS, {keyPath:"id"});
                accessTokenStore.createIndex("timestamp", "timestamp", { unique:false});
            }

            if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_TEST_RUNS)) {
                var environmentsStore = db.createObjectStore(pm.indexedDB.TABLE_TEST_RUNS, {keyPath:"id"});
                environmentsStore.createIndex("timestamp", "timestamp", { unique:false});
            }
        };

        request.onsuccess = function (e) {
            pm.indexedDB.db = e.target.result;
            pm.indexedDB.onTransactionComplete(callback);
        };

        request.onerror = pm.indexedDB.onerror;
    },

    open:function (callback) {
        if (parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]) < 23) {
            pm.indexedDB.open_v21(callback);
        }
        else {
            console.log("Open latest DB");
            pm.indexedDB.open_latest(callback);
        }

        pm.mediator.on("initiateBackup", pm.indexedDB.downloadAllData);
    },



	getSince: function(callback) {
        //will return an array
        //[{own:0},{"u1:c1":2}...]
		var db = pm.indexedDB.db;
		var trans = db.transaction(["sinceIds"], "readwrite");
		var store = trans.objectStore("sinceIds");


        var keyRange = IDBKeyRange.lowerBound(0);
        var index = store.index("id");
        var cursorRequest = index.openCursor(keyRange);
        var sinces = [];

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            if (!result) {
                if(sinces.length === 0) {
                    console.log("Since not found...resetting to 0");
                    var request2 = store.put({"id": "own", "value": 0});
                    sinces = [{"id": "own", "value": 0}];
                }
                if (callback) {
                    callback(sinces);
                }

                return;
            }

            var change = result.value;
            sinces.push(change);

            //This wil call onsuccess again and again until no more request is left
            result['continue']();
        };

        cursorRequest.onerror = pm.indexedDB.onerror;

	},

    updateSince: function(value, timestamp, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["sinceIds"], "readwrite");
        var store = trans.objectStore("sinceIds");

        var boundKeyRange = IDBKeyRange.only("own");
        var request = store.put({id:"own", value:value});

        request.onsuccess = function (e) {
            callback(value);
        };

        request.onerror = function (e) {
            callback(value);
        };
    },

    deleteAllSince: function(callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["sinceIds"], "readwrite");
        var store = trans.objectStore("sinceIds");
        var request = store.clear();
    },

    updateLocalSince: function(value, timestamp, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["sinceIds"], "readwrite");
        var store = trans.objectStore("sinceIds");

        var boundKeyRange = IDBKeyRange.only("own");
        var request = store.put({id:"own", value:value});

        request.onsuccess = function (e) {
            callback(value);
        };

        request.onerror = function (e) {
            console.log(e.value);
        };
    },

    updateSubscribedSince: function(subscriptionId, value, timestamp, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["sinceIds"], "readwrite");
        var store = trans.objectStore("sinceIds");

        var boundKeyRange = IDBKeyRange.only(subscriptionId);
        var request = store.put({"id":"subscriptionId",value: value});

        request.onsuccess = function (e) {
            callback(value);
        };

        request.onerror = function (e) {
            console.log(e.value);
        };
    },

    deleteAllSyncValues: function(callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["systemValues"], "readwrite");
        var store = trans.objectStore("systemValues");
        var request = store.clear();
        request.onsuccess = function () {
            callback();

        };
    },

    addSyncConflict: function(conflict, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["sync_conflicts"], "readwrite");
        var store = trans.objectStore("sync_conflicts");

        var request;

        request = store.put(conflict);

        request.onsuccess = function () {
            callback(conflict);

        };

        request.onerror = function (e) {
            console.log(e.value);
        };
    },

    getAllConflicts: function(callback) {
        var db = pm.indexedDB.db;
        if (db === null) {
            return;
        }

        var trans = db.transaction(["sync_conflicts"], "readwrite");
        var store = trans.objectStore("sync_conflicts");

        //Get everything in the store
        var keyRange = IDBKeyRange.lowerBound(0);
        var index = store.index("id");
        var cursorRequest = index.openCursor(keyRange);
        var changes = [];

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            if (!result) {
                if (callback) {
                    callback(changes);
                }

                return;
            }

            var change = result.value;
            changes.push(change);

            //This wil call onsuccess again and again until no more request is left
            result['continue']();
        };

        cursorRequest.onerror = pm.indexedDB.onerror;
    },

    updateSyncConflict:function (conflict, callback) {
        try {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["sync_conflicts"], "readwrite");
            var store = trans.objectStore(["sync_conflicts"]);

            var boundKeyRange = IDBKeyRange.only(conflict.id);
            var request = store.put(conflict);

            request.onsuccess = function () {
                callback(changeset);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        }
        catch (e) {
            console.log(e);
        }
    },

    clearSyncConflicts: function() {
        var db = pm.indexedDB.db;
        if (db === null) {
            return;
        }

        var trans = db.transaction(["sync_conflicts"], "readwrite");
        var store = trans.objectStore("sync_conflicts");

        store.clear();
    },

	addUnsyncedChange: function(unsyncedChange, callback) {
		var db = pm.indexedDB.db;
		var trans = db.transaction(["unsynced_changes"], "readwrite");
		var store = trans.objectStore("unsynced_changes");

		var request;

		request = store.put(unsyncedChange);

		request.onsuccess = function () {
			callback(unsyncedChange);

		};

		request.onerror = function (e) {
			console.log(e.value);
		};
	},

	getUnsyncedChanges:function (callback) {
		var db = pm.indexedDB.db;
		if (db === null) {
			return;
		}

		var trans = db.transaction(["unsynced_changes"], "readwrite");
		var store = trans.objectStore("unsynced_changes");

		//Get everything in the store
		var keyRange = IDBKeyRange.lowerBound(0);
		var index = store.index("timestamp");
		var cursorRequest = index.openCursor(keyRange);
		var changes = [];

		cursorRequest.onsuccess = function (e) {
			var result = e.target.result;

			if (!result) {
				if (callback) {
					callback(changes);
				}

				return;
			}

			var change = result.value;
			changes.push(change);

			//This wil call onsuccess again and again until no more request is left
			result['continue']();
		};

		cursorRequest.onerror = pm.indexedDB.onerror;
	},

	updateUnsyncedChange:function (changeset, callback) {
		try {
			var db = pm.indexedDB.db;
			var trans = db.transaction(["unsynced_changes"], "readwrite");
			var store = trans.objectStore(["unsynced_changes"]);

			var boundKeyRange = IDBKeyRange.only(changeset.id);
			var request = store.put(changeset);

			request.onsuccess = function () {
                if(callback) {
                    callback(changeset);
                }
			};

			request.onerror = function (e) {
				console.log(e);
			};
		}
		catch (e) {
			console.log(e);
		}
	},

    deleteUnsyncedChange:function (id, callback) {
        try {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["unsynced_changes"], "readwrite");
            var store = trans.objectStore(["unsynced_changes"]);

            var request = store['delete'](id);

            request.onsuccess = function () {
                if(typeof callback === "function") {
                    callback(id);
                }
            };

            request.onerror = function (e) {
                console.log(e);
            };
        }
        catch (e) {
            console.log(e);
        }
    },

	clearUnsyncedChanges: function() {
		var db = pm.indexedDB.db;
		if (db === null) {
			return;
		}

		var trans = db.transaction(["unsynced_changes"], "readwrite");
		var store = trans.objectStore("unsynced_changes");

		store.clear();
	},

	getAllSyncNotifs:function (callback) {
		var db = pm.indexedDB.db;
		if (db === null) {
			return;
		}

		var trans = db.transaction(["systemValues"], "readwrite");
		var store = trans.objectStore("systemValues");

		var cursorRequest = store.get("syncNotifs");

		cursorRequest.onsuccess = function (e) {
			if(e===undefined || e.target.result===undefined) {
				console.log("No notifs found");
				var boundKeyRange = IDBKeyRange.only("syncNotifs");
				var request2 = store.put({"name":"syncNotifs",value: []});
				callback({name: "syncNotifs", value: []});
			}
			else {
				var result = e.target.result;
				callback(result);
			}
		};
	},

    updateSyncNotifs: function(syncNotifs, callback) {

        var db = pm.indexedDB.db;
        var trans = db.transaction(["systemValues"], "readwrite");
        var store = trans.objectStore("systemValues");

        var boundKeyRange = IDBKeyRange.only("syncNotifs");
        var objToStore = {
            "name": "syncNotifs",
            "value": syncNotifs
        };
        var request = store.put(objToStore);

        request.onsuccess = function (e) {
            callback(syncNotifs);
        };

        request.onerror = function (e) {
            console.log(e.value);
        };
    },

    addCollection:function (collection, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collections"], "readwrite");
        var store = trans.objectStore("collections");

        var request;

        try {
            request = store.put(collection);
        }
        catch(e) {
            pm.syncLogger.error("Error adding collection to DB - " + e.value + ". CollectionJSON: " + JSON.stringify(collection));
            console.error("Error adding collection to DB: " + e.value);
        }

        request.onsuccess = function () {
            callback(collection);
        };

        request.onerror = function (e) {
            pm.syncLogger.error("Error adding collection to DB - " + e.value + ". CollectionJSON: " + JSON.stringify(collection));
            console.error("Error adding collection to DB: " + e.value);
        };
    },

    updateCollection:function (collection, oldCollection, toSync, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collections"], "readwrite");
        var store = trans.objectStore("collections");

        var boundKeyRange = IDBKeyRange.only(collection.id);
        var request = store.put(collection);
        request.onsuccess = function (e) {
            callback(collection);

        };

        request.onerror = function (e) {
            console.error("Error: ", e.value);
            callback(collection);
        };
    },

    addCollectionRequest:function (req, toSync, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collection_requests"], "readwrite");
        var store = trans.objectStore("collection_requests");


        var collectionRequest = store.put(req);
	    var oldThis=this;
        collectionRequest.onsuccess = function () {
            callback(req);
        };

        collectionRequest.onerror = function (e) {
            console.error(e.value);
        };
    },

    updateCollectionRequest:function (req, oldRequest, toSync, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collection_requests"], "readwrite");
        var store = trans.objectStore("collection_requests");

        var boundKeyRange = IDBKeyRange.only(req.id);
        var request = store.put(req);
        request.onsuccess = function (e) {
            callback(req);
        };

        request.onerror = function (e) {
            console.log("Error: ", e.value);
            callback(req);
        };
    },

    getCollection:function (id, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collections"], "readwrite");
        var store = trans.objectStore("collections");

        //Get everything in the store
        var cursorRequest = store.get(id);

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;
            callback(result);
        };
        cursorRequest.onerror = pm.indexedDB.onerror;
    },

    getCollections:function (callback) {
        var db = pm.indexedDB.db;

        if (db === null) {
            return;
        }

        var trans = db.transaction(["collections"], "readwrite");
        var store = trans.objectStore("collections");

        //Get everything in the store
        var keyRange = IDBKeyRange.lowerBound(0);
        var cursorRequest = store.openCursor(keyRange);
        var numCollections = 0;
        var items = [];
        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;
            if (!result) {
                callback(items);
                return;
            }

            var collection = result.value;
            numCollections++;

            items.push(collection);

            result['continue']();
        };

        cursorRequest.onerror = function (e) {
            console.log(e);
        };
    },

    deleteAllCollections: function(cb) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collections"], "readwrite");
        var store = trans.objectStore("collections");
        var request = store.clear();
        request.onsuccess = function() {
            cb();
        }
    },

    getAllCollectionRequests:function (callback) {
        var db = pm.indexedDB.db;
        if (db === null) {
            return;
        }

        var trans = db.transaction(["collection_requests"], "readwrite");
        var store = trans.objectStore("collection_requests");

        //Get everything in the store
        var keyRange = IDBKeyRange.lowerBound(0);
        var index = store.index("timestamp");
        var cursorRequest = index.openCursor(keyRange);
        var collectionRequests = [];

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            if (!result) {
                if (callback) {
                    callback(collectionRequests);
                }

                return;
            }

            var request = result.val
            collectionRequests.push(request);

            //This wil call onsuccess again and again until no more request is left
            result['continue']();
        };

        cursorRequest.onerror = pm.indexedDB.onerror;
    },

    getAllRequestsForCollectionId:function (id, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collection_requests"], "readwrite");

        //Get everything in the store
        var keyRange = IDBKeyRange.only(id);
        var store = trans.objectStore("collection_requests");

        var index = store.index("collectionId");
        var cursorRequest = index.openCursor(keyRange);

        var requests = [];

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            if (!result) {
                callback(requests);
                return;
            }

            var request = result.value;
            requests.push(request);

            //This wil call onsuccess again and again until no more request is left
            result['continue']();
        };
        cursorRequest.onerror = pm.indexedDB.onerror;
    },

    getAllRequestsInCollection:function (collection, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collection_requests"], "readwrite");

        //Get everything in the store
        var keyRange = IDBKeyRange.only(collection.id);
        var store = trans.objectStore("collection_requests");

        var index = store.index("collectionId");
        var cursorRequest = index.openCursor(keyRange);

        var requests = [];

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            if (!result) {
                callback(collection, requests);
                return;
            }

            var request = result.value;
            requests.push(request);

            //This wil call onsuccess again and again until no more request is left
            result['continue']();
        };
        cursorRequest.onerror = pm.indexedDB.onerror;
    },

    addRequest:function (historyRequest, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["requests"], "readwrite");
        var store = trans.objectStore("requests");
        var request = store.put(historyRequest);

        request.onsuccess = function (e) {
            callback(historyRequest);
        };

        request.onerror = function (e) {
            console.log(e.value);
        };
    },

    getRequest:function (id, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["requests"], "readwrite");
        var store = trans.objectStore("requests");

        //Get everything in the store
        var cursorRequest = store.get(id);

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;
            if (!result) {
                return;
            }

            callback(result);
        };
        cursorRequest.onerror = pm.indexedDB.onerror;
    },

    deleteAllHistoryRequests: function(cb) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["requests"], "readwrite");
        var store = trans.objectStore("requests");
        var request = store.clear();
        request.onsuccess = cb;
    },

    getCollectionRequest:function (id, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collection_requests"], "readwrite");
        var store = trans.objectStore("collection_requests");

        if(typeof id !== "string") {
            //incorrect input passed
            var error = new Error();
            pm.syncLogger.error("Bad request id passed. Stack: " + error.stack);
            callback(null);
            return null;
        }

        //Get everything in the store
        var cursorRequest = store.get(id);

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;
            if (!result) {
                pm.syncLogger.error("Could not find a request with this ID: " + id);
                callback(null);
                return;
            }

            callback(result);
            return result;
        };
        cursorRequest.onerror = function(e) {
            pm.syncLogger.error("Could not find a request with this ID: " + id);
            callback(null);
        }
    },


    getAllRequestItems:function (callback) {
        var db = pm.indexedDB.db;
        if (db === null) {
            return;
        }

        var trans = db.transaction(["requests"], "readwrite");
        var store = trans.objectStore("requests");

        //Get everything in the store
        var keyRange = IDBKeyRange.lowerBound(0);
        var index = store.index("timestamp");
        var cursorRequest = index.openCursor(keyRange);
        var historyRequests = [];

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            if (!result) {
                callback(historyRequests);
                return;
            }

            var request = result.value;
            historyRequests.push(request);

            //This wil call onsuccess again and again until no more request is left
            result['continue']();
        };

        cursorRequest.onerror = pm.indexedDB.onerror;
    },

	deleteRequest:function (id, callback) {
		try {
			var db = pm.indexedDB.db;
			var trans = db.transaction(["requests"], "readwrite");
			var store = trans.objectStore(["requests"]);

			var request = store['delete'](id);

			request.onsuccess = function () {
				callback(id);
			};

			request.onerror = function (e) {
				console.log(e);
			};
		}
		catch (e) {
			console.log(e);
		}
	},

    deleteHistory:function (callback) {
        var db = pm.indexedDB.db;
        var clearTransaction = db.transaction(["requests"], "readwrite");
        var clearRequest = clearTransaction.objectStore(["requests"]).clear();
        clearRequest.onsuccess = function (event) {
            callback();
        };
    },

    deleteCollectionRequestWithOptSync: function(id, toSync, callback) {
        //pm.indexedDB.getCollectionRequest(id, function(collectionRequest) {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["collection_requests"], "readwrite");
            var store = trans.objectStore(["collection_requests"]);

            var request = store['delete'](id);

            request.onsuccess = function (e) {
                callback(id);
            };

            request.onerror = function (e) {
                console.log("Error: ",e);
                callback(id);
            };
        //});
    },

    deleteCollectionRequest:function (id, callback) {
        this.deleteCollectionRequestWithOptSync(id,true,callback);
    },

    //in a collection
    deleteAllCollectionRequests:function (id) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collection_requests"], "readwrite");

        //Get everything in the store
        var keyRange = IDBKeyRange.only(id);
        var store = trans.objectStore("collection_requests");

        var index = store.index("collectionId");
        var cursorRequest = index.openCursor(keyRange);

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            if (!result) {
                return;
            }

            var request = result.value;
            pm.indexedDB.deleteCollectionRequest(request.id, function() {
            });
            result['continue']();
        };
        cursorRequest.onerror = pm.indexedDB.onerror;
    },

    deleteEachCollectionRequest: function() {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collection_requests"], "readwrite");
        var store = trans.objectStore("collection_requests");
        var request = store.clear();
    },

    deleteCollectionWithOptSync:function (id, toSync, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collections"], "readwrite");
        var store = trans.objectStore(["collections"]);

        var request = store['delete'](id);


        request.onsuccess = function () {
            // pm.indexedDB.deleteAllCollectionRequests(id);
            callback(id);
        };

        request.onerror = function (e) {
            console.log("Error: ", e);
            callback(id);
        };
    },

    subscriptions: {
        addSubscription: function(subscription, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["subscriptions"], "readwrite");
            var store = trans.objectStore("subscriptions");
            var request = store.put(subscription);

            request.onsuccess = function (e) {
                callback(subscription);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        deleteSubscription:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["subscriptions"], "readwrite");
            var store = trans.objectStore(["subscriptions"]);

            var request = store['delete'](id);

            request.onsuccess = function () {
                callback(id);
            };

            request.onerror = function (e) {
                console.log("Error: ", e);
                callback(id);
            };
        },

        deleteAllSubscriptions: function(cb) {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["subscriptions"], "readwrite");
            var store = trans.objectStore("subscriptions");
            var request = store.clear();
            request.onsuccess = function () {
                cb();
            };
        },

        getAllSubscriptions: function(cb) {
            var db = pm.indexedDB.db;
            if (db === null) {
                return;
            }

            var trans = db.transaction(["subscriptions"], "readwrite");
            var store = trans.objectStore("subscriptions");

            //Get everything in the store
            var keyRange = IDBKeyRange.lowerBound(0);
            var index = store.index("id");
            var cursorRequest = index.openCursor(keyRange);
            var subscriptions = [];

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;

                if (!result) {
                    cb(subscriptions);
                    return;
                }

                var request = result.value;
                subscriptions.push(request);

                //This wil call onsuccess again and again until no more request is left
                result['continue']();
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        isSubscribedTo: function(subscriptionId) {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["subscriptions"], "readwrite");
            var store = trans.objectStore("subscriptions");

            //Get everything in the store
            var cursorRequest = store.get(subscriptionId);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                if (!result) {
                    return;
                }

                callback(result);
                return result;
            };
            cursorRequest.onerror = pm.indexedDB.onerror;
        }
    },

    environments:{
        addEnvironment:function (environment, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["environments"], "readwrite");
            var store = trans.objectStore("environments");
            var request = store.put(environment);

            request.onsuccess = function (e) {
                callback(environment);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getEnvironment:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["environments"], "readwrite");
            var store = trans.objectStore("environments");

            //Get everything in the store
            var cursorRequest = store.get(id);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                callback(result);
            };
            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        deleteEnvironment:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["environments"], "readwrite");
            var store = trans.objectStore(["environments"]);

            var request = store['delete'](id);

            request.onsuccess = function () {
                callback(id);
            };

            request.onerror = function (e) {
                console.log("Error: ", e);
                callback(id);
            };
        },

        getAllEnvironments:function (callback) {
            var db = pm.indexedDB.db;
            if (db === null) {
                return;
            }

            var trans = db.transaction(["environments"], "readwrite");
            var store = trans.objectStore("environments");

            //Get everything in the store
            var keyRange = IDBKeyRange.lowerBound(0);
            var index = store.index("timestamp");
            var cursorRequest = index.openCursor(keyRange);
            var environments = [];

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;

                if (!result) {
                    callback(environments);
                    return;
                }

                var request = result.value;
                environments.push(request);

                //This wil call onsuccess again and again until no more request is left
                result['continue']();
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        updateEnvironment:function (environment, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["environments"], "readwrite");
            var store = trans.objectStore("environments");

            var boundKeyRange = IDBKeyRange.only(environment.id);
            var request = store.put(environment);

            request.onsuccess = function (e) {
                callback(environment);
            };

            request.onerror = function (e) {
                console.log("Error: ", e.value);
                callback(environment);
            };
        },

        deleteAllEnvironments: function(cb) {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["environments"], "readwrite");
            var store = trans.objectStore("environments");
            var request = store.clear();
            request.onsuccess = function () {
                cb();
            };
        },
    },

    helpers:{
        addHelper:function (helper, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_HELPERS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_HELPERS);
            var request = store.put(helper);

            request.onsuccess = function (e) {
                callback(helper);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getHelper:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_HELPERS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_HELPERS);

            //Get everything in the store
            var cursorRequest = store.get(id);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                callback(result);
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        }
    },

    headerPresets:{
        addHeaderPreset:function (headerPreset, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_HEADER_PRESETS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_HEADER_PRESETS);
            var request = store.put(headerPreset);

            request.onsuccess = function (e) {
                callback(headerPreset);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getHeaderPreset:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_HEADER_PRESETS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_HEADER_PRESETS);

            //Get everything in the store
            var cursorRequest = store.get(id);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                callback(result);
            };
            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        deleteHeaderPreset:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_HEADER_PRESETS], "readwrite");
            var store = trans.objectStore([pm.indexedDB.TABLE_HEADER_PRESETS]);

            var request = store['delete'](id);

            request.onsuccess = function () {
                callback(id);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        deleteAllHeaderPresets: function(cb) {
            var db = pm.indexedDB.db;

            var trans = db.transaction([pm.indexedDB.TABLE_HEADER_PRESETS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_HEADER_PRESETS);
            var request = store.clear();
            request.onsuccess = function() {
                cb();
            }
            request.onerror = function (e) {
                console.log(e);
            };
        },

        getAllHeaderPresets:function (callback) {
            var db = pm.indexedDB.db;
            if (db === null) {
                return;
            }

            var trans = db.transaction([pm.indexedDB.TABLE_HEADER_PRESETS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_HEADER_PRESETS);

            //Get everything in the store
            var keyRange = IDBKeyRange.lowerBound(0);
            var index = store.index("timestamp");
            var cursorRequest = index.openCursor(keyRange);
            var headerPresets = [];

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;

                if (!result) {
                    callback(headerPresets);
                    return;
                }

                var request = result.value;
                headerPresets.push(request);

                //This wil call onsuccess again and again until no more request is left
                result['continue']();
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        updateHeaderPreset:function (headerPreset, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_HEADER_PRESETS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_HEADER_PRESETS);

            var boundKeyRange = IDBKeyRange.only(headerPreset.id);
            var request = store.put(headerPreset);

            request.onsuccess = function (e) {
                callback(headerPreset);
            };

            request.onerror = function (e) {
                console.log(e.value);
            };
        }
    },

    driveFiles: {
        addDriveFile:function (driveFile, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_FILES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_FILES);
            var request = store.put(driveFile);

            request.onsuccess = function (e) {                
                callback(driveFile);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getDriveFile:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_FILES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_FILES);

            //Get everything in the store
            var cursorRequest = store.get(id);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                callback(result);
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        getDriveFileByFileId:function (fileId, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_FILES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_FILES);

            //Get everything in the store
            var keyRange = IDBKeyRange.only(fileId);
            var index = store.index("fileId");
            var cursorRequest = index.openCursor(keyRange);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;                
                if(result) {
                    callback(result.value);
                }
                else {
                    callback(null);
                }

            };

            cursorRequest.onerror = function(e) {
                callback(null);
            };
        },

        deleteDriveFile:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_FILES], "readwrite");
            var store = trans.objectStore([pm.indexedDB.TABLE_DRIVE_FILES]);

            var request = store['delete'](id);

            request.onsuccess = function () {
                callback(id);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getAllDriveFiles:function (callback) {
            var db = pm.indexedDB.db;
            if (db === null) {
                return;
            }

            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_FILES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_FILES);

            //Get everything in the store
            var keyRange = IDBKeyRange.lowerBound(0);
            var index = store.index("timestamp");
            var cursorRequest = index.openCursor(keyRange);
            var driveFiles = [];

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;

                if (!result) {
                    callback(driveFiles);
                    return;
                }

                var request = result.value;
                driveFiles.push(request);

                //This wil call onsuccess again and again until no more request is left
                result['continue']();
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        updateDriveFile:function (driveFile, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_FILES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_FILES);

            var boundKeyRange = IDBKeyRange.only(driveFile.id);
            var request = store.put(driveFile);

            request.onsuccess = function (e) {
                callback(driveFile);
            };

            request.onerror = function (e) {
                console.log(e.value);
            };
        }
    },


    driveChanges: {
        addDriveChange:function (driveChange, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_CHANGES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_CHANGES);
            var request = store.put(driveChange);

            request.onsuccess = function (e) {
                callback(driveChange);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getDriveChange:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_CHANGES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_CHANGES);

            //Get everything in the store
            var cursorRequest = store.get(id);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                callback(result);
            };
            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        deleteDriveChange:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_CHANGES], "readwrite");
            var store = trans.objectStore([pm.indexedDB.TABLE_DRIVE_CHANGES]);

            var request = store['delete'](id);

            request.onsuccess = function () {
                callback(id);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getAllDriveChanges:function (callback) {
            var db = pm.indexedDB.db;
            if (db === null) {
                return;
            }

            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_CHANGES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_CHANGES);

            //Get everything in the store
            var keyRange = IDBKeyRange.lowerBound(0);
            var index = store.index("timestamp");
            var cursorRequest = index.openCursor(keyRange);
            var driveChanges = [];

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;

                if (!result) {
                    driveChanges.sort(sortAscending);
                    callback(driveChanges);
                    return;
                }

                var request = result.value;
                driveChanges.push(request);

                //This wil call onsuccess again and again until no more request is left
                result['continue']();
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        updateDriveChange:function (driveChange, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_CHANGES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_CHANGES);

            var boundKeyRange = IDBKeyRange.only(driveChange.id);
            var request = store.put(driveChange);

            request.onsuccess = function (e) {
                callback(driveChange);
            };

            request.onerror = function (e) {
                console.log(e.value);
            };
        }
    },

    oAuth2AccessTokens: {
        addAccessToken: function(token, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS);
            var request = store.put(token);

            request.onsuccess = function (e) {
                callback(token);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        deleteAccessToken: function(id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS);

            //Get everything in the store
            var request = store['delete'](id);

            request.onsuccess = function (e) {
                callback(id);
            };
            request.onerror = pm.indexedDB.onerror;
        },

        getAllAccessTokens: function(callback) {
            var db = pm.indexedDB.db;
            if (db === null) {
                return;
            }

            var trans = db.transaction([pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS);

            //Get everything in the store
            var keyRange = IDBKeyRange.lowerBound(0);
            var index = store.index("timestamp");
            var cursorRequest = index.openCursor(keyRange);
            var accessTokens = [];

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;

                if (!result) {
                    callback(accessTokens);
                    return;
                }

                var request = result.value;
                accessTokens.push(request);

                //This wil call onsuccess again and again until no more request is left
                result['continue']();
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        updateAccessToken:function (accessToken, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS);

            var boundKeyRange = IDBKeyRange.only(accessToken.id);
            var request = store.put(accessToken);

            request.onsuccess = function (e) {
                callback(accessToken);
            };

            request.onerror = function (e) {
                console.log(e.value);
            };
        },

        getAccessToken: function(id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS);

            //Get everything in the store
            var cursorRequest = store.get(id);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                callback(result);
            };
            cursorRequest.onerror = pm.indexedDB.onerror;
        }
    },

    testRuns: {
        addTestRun: function(testRun, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_TEST_RUNS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_TEST_RUNS);
            var request = store.put(testRun);

            request.onsuccess = function (e) {
                callback(testRun);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        deleteTestRun: function(id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_TEST_RUNS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_TEST_RUNS);

            //Get everything in the store
            var request = store['delete'](id);

            request.onsuccess = function (e) {
                callback(id);
            };
            request.onerror = pm.indexedDB.onerror;
        },

        getAllTestRuns: function(callback) {
            var db = pm.indexedDB.db;
            if (db === null) {
                return;
            }

            var trans = db.transaction([pm.indexedDB.TABLE_TEST_RUNS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_TEST_RUNS);

            //Get everything in the store
            var keyRange = IDBKeyRange.lowerBound(0);
            var index = store.index("timestamp");
            var cursorRequest = index.openCursor(keyRange);
            var testRuns = [];

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;

                if (!result) {
                    callback(testRuns);
                    return;
                }

                var request = result.value;
                testRuns.push(request);

                //This wil call onsuccess again and again until no more request is left
                result['continue']();
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        updateTestRun:function (testRun, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_TEST_RUNS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_TEST_RUNS);

            var boundKeyRange = IDBKeyRange.only(testRun.id);
            var request = store.put(testRun);

            request.onsuccess = function (e) {
                callback(testRun);
            };

            request.onerror = function (e) {
                console.log(e.value);
            };
        },

        getTestRun: function(id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_TEST_RUNS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_TEST_RUNS);

            //Get everything in the store
            var cursorRequest = store.get(id);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                callback(result);
            };
            cursorRequest.onerror = pm.indexedDB.onerror;
        }
    },

    // TODO Refactor this. Needs to reduce dependencies
    downloadAllData: function(callback) {
        console.log("Starting to download all data");

        //Get globals
        var totalCount = 0;
        var currentCount = 0;
        var collections = [];
        var globals = [];
        var environments = [];
        var headerPresets = [];

        var onFinishGettingCollectionRequests = function(collection) {
            collections.push(collection);

            currentCount++;

            if (currentCount === totalCount) {
                onFinishExportingCollections(collections);
            }
        }

        var onFinishExportingCollections = function(c) {
            console.log(pm.envManager);

            globals = pm.envManager.get("globals").get("globals");

            //Get environments
            pm.indexedDB.environments.getAllEnvironments(function (e) {
                environments = e;
                pm.indexedDB.headerPresets.getAllHeaderPresets(function (hp) {
                    headerPresets = hp;
                    onFinishExporttingAllData(callback);
                });
            });
        }

        var onFinishExporttingAllData = function() {
            console.log("collections", collections);
            console.log("environments", environments);
            console.log("headerPresets", headerPresets);
            console.log("globals", globals);

            var dump = {
                version: 1,
                collections: collections,
                environments: environments,
                headerPresets: headerPresets,
                globals: globals
            };

            var name = "Backup.postman_dump";
            var filedata = JSON.stringify(dump, null, '\t');
            var type = "application/json";
            pm.filesystem.saveAndOpenFile(name, filedata, type, function () {
                if (callback) {
                    callback();
                }
            });
        }

        //Get collections
        //Get header presets
        pm.indexedDB.getCollections(function (items) {
            totalCount = items.length;
            pm.collections.items = items;
            var itemsLength = items.length;

            function onGetAllRequestsInCollection(collection, requests) {
                collection.requests = requests;
                onFinishGettingCollectionRequests(collection);
            }

            if (itemsLength !== 0) {
                for (var i = 0; i < itemsLength; i++) {
                    var collection = items[i];
                    pm.indexedDB.getAllRequestsInCollection(collection, onGetAllRequestsInCollection);
                }
            }
            else {
                globals = pm.envManager.get("globals").get("globals");

                pm.indexedDB.environments.getAllEnvironments(function (e) {
                    environments = e;
                    pm.indexedDB.headerPresets.getAllHeaderPresets(function (hp) {
                        headerPresets = hp;
                        onFinishExporttingAllData(callback);
                    });
                });
            }
        });
    },

    importAllData: function(files, callback, failCallback) {
        if (files.length !== 1) {
            return;
        }

        var f = files[0];
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                // Render thumbnail.
                var data = e.currentTarget.result;
                var j = "";
                try {
                    j = JSON.parse(data);
                }
                catch(e) {
                    failCallback(e.message);
                    return;
                }
                var version = j.version;
                pm.indexedDB.importDataForVersion(version, j, callback);
            };
        })(files[0]);

        // Read in the image file as a data URL.
        reader.readAsText(files[0]);
    },

    importDataForVersion: function(version, data, callback) {
        if (version === 1) {
            var environments = pm.envManager.get("environments");
            var globals = pm.envManager.get("globals");

            if ("collections" in data) {
                console.log("Import collections");
                pm.collections.mergeCollections(data.collections);
            }

            if ("environments" in data) {
                console.log("Import environments");
                environments.mergeEnvironments(data.environments);
            }

            if ("globals" in data) {
                console.log("Import globals");
                globals.mergeGlobals(data.globals, true);
            }

            if ("headerPresets" in data) {
                console.log("Import headerPresets");
                pm.headerPresets.mergeHeaderPresets(data.headerPresets);
            }
        }

        callback();
    }
};