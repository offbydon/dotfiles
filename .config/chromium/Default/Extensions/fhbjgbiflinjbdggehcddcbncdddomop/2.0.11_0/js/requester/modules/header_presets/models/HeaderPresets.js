var HeaderPreset = Backbone.Model.extend({
    defaults: function() {
        return {
            "id": "",
            "name": "",
            "headers": [],
            "timestamp": 0,
            "synced": false
        };
    },

    toSyncableJSON: function() {
        var j = this.toJSON();
        j.synced = true;
        return j;
    }
});

var HeaderPresets = Backbone.Collection.extend({
    model: HeaderPreset,

    isLoaded: false,
    initializedSyncing: false,
    syncFileType: "header_preset",

    comparator: function(a, b) {
        var counter;

        var aName = a.get("name");
        var bName = b.get("name");

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

    presetsForAutoComplete:[],

    initialize:function () {
        this.on("change", this.refreshAutoCompleteList, this);
        this.loadPresets();

        //--Sync listeners---
        pm.mediator.on("syncChangeReceived", this.onSyncChangeReceived, this);
    },

    // Initialize all models
    loadPresets:function () {
        var collection = this;

        this.startListeningForFileSystemSyncEvents();

        pm.indexedDB.headerPresets.getAllHeaderPresets(function (items) {
            collection.add(items, {merge: true});
            collection.refreshAutoCompleteList();

            collection.isLoaded = true;
            collection.trigger("startSync");
        });
    },

    startListeningForFileSystemSyncEvents: function() {
        var collection = this;
        var isLoaded = collection.isLoaded;
        var initializedSyncing = collection.initializedSyncing;

        pm.mediator.on("initializedSyncableFileSystem", function() {
            collection.initializedSyncing = true;
            collection.trigger("startSync");
        });

        this.on("startSync", this.startSyncing, this);
    },

    startSyncing: function() {
        var i = 0;
        var collection = this;
        var headerPreset;
        var synced;
        var syncableFile;

        if (this.isLoaded && this.initializedSyncing) {
            pm.mediator.on("addSyncableFileFromRemote", function(type, data) {
                if (type === collection.syncFileType) {
                    collection.onReceivingSyncableFileData(data);
                }
            });

            pm.mediator.on("updateSyncableFileFromRemote", function(type, data) {
                if (type === collection.syncFileType) {
                    collection.onReceivingSyncableFileData(data);
                }
            });

            pm.mediator.on("deleteSyncableFileFromRemote", function(type, id) {
                if (type === collection.syncFileType) {
                    collection.onRemoveSyncableFile(id);
                }
            });

            // And this
            for(i = 0; i < this.models.length; i++) {
                headerPreset = this.models[i];
                synced = headerPreset.get("synced");

                if (!synced) {
                    this.addToSyncableFilesystem(headerPreset.get("id"));
                }
            }
        }
        else {
        }
    },

    onReceivingSyncableFileData: function(data) {
        this.mergeHeaderPreset(JSON.parse(data), true);
    },

    onRemoveSyncableFile: function(id) {
        this.deleteHeaderPreset(id, true);
    },

    getAsSyncableFile: function(id) {
        var collection = this;
        var headerPreset = this.get(id);
        var name = id + "." + collection.syncFileType;
        var type = collection.syncFileType;
        var data = JSON.stringify(headerPreset.toSyncableJSON());

        return {
            "name": name,
            "type": type,
            "data": data
        };
    },

    addToSyncableFilesystem: function(id) {
        var collection = this;

        var syncableFile = this.getAsSyncableFile(id);
        pm.mediator.trigger("addSyncableFile", syncableFile, function(result) {
            if(result === "success") {
                collection.updateHeaderPresetSyncStatus(id, true);
            }
        });
    },

    removeFromSyncableFilesystem: function(id) {
        var collection = this;

        var name = id + "." + collection.syncFileType;
        pm.mediator.trigger("removeSyncableFile", name, function(result) {
        });
    },

    // Iterate through models
    getHeaderPreset:function (id) {
        var presets = this.models;
        var preset;
        for (var i = 0, count = presets.length; i < count; i++) {
            preset = presets[i];
            if (preset.get("id") === id) {
                break;
            }
        }

        return preset;
    },

    // Add to models
    addHeaderPreset:function (id, name, headers, doNotSync) {
        this.addHeaderPresetWithOptSync(id, name, headers, doNotSync, true);
    },

    addHeaderPresetWithOptSync: function (id, name, headers, doNotSync, toSync) {
        if(toSync) {
            pm.tracker.trackEvent("request", "headers", "new_preset");
        }
        if(id===0) id = guid();

        var headerPreset = {
            "id":id,
            "name":name,
            "headers":headers,
            "timestamp":new Date().getTime()
        };

        var headerPresets = this;

        pm.indexedDB.headerPresets.addHeaderPreset(headerPreset, function () {
            headerPresets.add(headerPreset, {merge: true});
            pm.mediator.trigger("databaseOperationComplete");
            if (!doNotSync) {
                headerPresets.addToSyncableFilesystem(id);
            }
            if(toSync) {
                pm.syncManager.addChangeset("headerpreset","create",headerPreset, null, true);
            }
        });
    },

    // Update local model
    editHeaderPreset:function (id, name, headers, doNotSync) {
       this.editHeaderPresetWithOptSync(id, name, headers, doNotSync, true);
    },

    editHeaderPresetWithOptSync:function (id, name, headers, doNotSync, toSync) {
        var collection = this;

        pm.indexedDB.headerPresets.getHeaderPreset(id, function (preset) {
            var headerPreset = {
                "id":id,
                "name":name,
                "headers":headers,
                "timestamp":preset.timestamp
            };

            pm.indexedDB.headerPresets.updateHeaderPreset(headerPreset, function () {
                collection.add(headerPreset, {merge: true});
                pm.mediator.trigger("databaseOperationComplete");
                if (!doNotSync) {
                    collection.addToSyncableFilesystem(id);
                }
                if(toSync) {
                    pm.syncManager.addChangeset("headerpreset","update",headerPreset, null, true);
                }
            });
        });
    },

    updateHeaderPresetSyncStatus: function(id, status) {
        var collection = this;

        var headerPreset = this.get(id);
        headerPreset.set("synced", status);
        collection.add(headerPreset, {merge: true});

        pm.indexedDB.headerPresets.updateHeaderPreset(headerPreset.toJSON(), function () {
            pm.mediator.trigger("databaseOperationComplete");
        });
    },

    // Remove from local model
    deleteHeaderPreset:function (id, doNotSync) {
        this.deleteHeaderPresetWithOptSync(id, doNotSync, true);
    },

    deleteHeaderPresetWithOptSync:function (id, doNotSync, toSync) {
        var collection = this;

        pm.indexedDB.headerPresets.deleteHeaderPreset(id, function () {
            collection.remove(id);

            if (!doNotSync) {
                collection.removeFromSyncableFilesystem(id);
            }

            if(toSync) {
                pm.syncManager.addChangeset("headerpreset","destroy",null, id, true);
            }
        });
    },

    getPresetsForAutoComplete:function () {
        var list = [];
        var presets = this.toJSON();

        for (var i = 0, count = presets.length; i < count; i++) {
            var preset = presets[i];
            var item = {
                "id":preset.id,
                "type":"preset",
                "label":preset.name,
                "category":"Header presets"
            };

            list.push(item);
        }

        list = _.union(list, allowedChromeHeaders);
        list = _.union(list, restrictedChromeHeaders);

        return list;
    },

    refreshAutoCompleteList:function () {
        var presets = this.getPresetsForAutoComplete();
        this.presetsForAutoComplete = presets;
    },

    mergeHeaderPreset: function(preset, doNotSync) {
        var collection = this;

        pm.indexedDB.headerPresets.addHeaderPreset(preset, function(headerPreset) {
            collection.add(headerPreset, {merge: true});
            pm.mediator.trigger("databaseOperationComplete");
            pm.syncManager.addChangeset("headerpreset","create",headerPreset, null, true);
            if (!doNotSync) {
                collection.addToSyncableFilesystem(headerPreset.id);
            }
        });

    },

    mergeHeaderPresets: function(hp) {
        var size = hp.length;
        var collection = this;
        var headerPreset;

        for(var i = 0; i < size; i++) {
            headerPreset = hp[i];
            collection.mergeHeaderPreset(headerPreset);
        }
    },

    //---Sync----
    onSyncChangeReceived: function(verb, message, callback) {
        if(!message.model) message.model = message.type;

        var allowedTypes = ["headerpreset"];
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
        //else if()
    },

    createRemoteEntity: function(message, callback) {
        if(message.model === "headerpreset") {
            //pm.syncStatusManager.addNotification("HeaderPreset",message.data, "create");
            var status = pm.headerPresets.addHeaderPresetWithOptSync(message.data.id, message.data.name, message.data.headers, true, false);
            if(typeof callback === 'function') callback();
            if(status==-1) {
                pm.mediator.trigger('syncOperationFailed', 'Adding header preset failed');
            }
            else {
                pm.syncManager.updateSinceFromMessage(message);
            }
            pm.syncLogger.log(new Error(),["HeaderPreset created: ",message.data]);
        }
    },

    updateRemoteEntity: function(message, callback) {
        if(message.model === "headerpreset") {
            //pm.syncStatusManager.addNotification("environment",message.data, "update");
            var status = pm.headerPresets.editHeaderPresetWithOptSync(message.data.id, message.data.name, message.data.headers, true, false);

            //as nothing depends on header presets :P
            if(typeof callback === 'function') callback();

            if(status==-1) {
                pm.mediator.trigger('syncOperationFailed', "Editing header preset failed");
            }
            else {
                pm.syncManager.updateSinceFromMessage(message);
            }
            pm.syncLogger.log(new Error(),["HeaderPreset updated: ", message.data]);
        }
    },

    deleteRemoteEntity: function(message, callback) {
        if(message.model === "headerpreset") {
            pm.syncLogger.log(new Error(),["HeaderPreset destroyed: ",message.data]);
            var status = pm.headerPresets.deleteHeaderPresetWithOptSync(message.data.id, true, false);

            if(typeof callback === 'function') callback();

            if(status==-1) {
                pm.mediator.trigger('syncOperationFailed', "Deleting header preset failed");
            }
            else {
                pm.syncManager.updateSinceFromMessage(message);
            }
        }
    }
});