
var Globals = Backbone.Model.extend({
    isLoaded: false,
    initializedSyncing: false,

    defaults: function() {
        return {
            "globals": [],
            "syncFileID": "postman_globals",
            "synced": false
        };
    },

    initialize:function () {
        this.set({"globals": []});

        var model = this;

        pm.appWindow.trigger("registerInternalEvent", "updatedGlobals", this.onUpdatedGlobals, this);

        pm.mediator.on("downloadGlobals", this.downloadGlobals, this);

        this.startListeningForFileSystemSyncEvents();

        pm.storage.getValue('globals', function(s) {
            if (s) {
                model.set({"globals": JSON.parse(s)});
            }
            else {
                model.set({"globals": []});
            }

            model.isLoaded = true;
            model.trigger("startSync");
            if(pm.syncManager) pm.syncManager.trigger("itemLoaded","globals");
        });

	    //--Sync listeners---
	    pm.mediator.on("syncChangeReceived", this.onSyncChangeReceived, this);

        this.set("glbUpdateTimeout", null);
    },

    getEnabledValues: function() {
        var retVal = [];
        var values = this.get("globals");
        if(!values) {
            values = [];
        }
        for(i=0;i<values.length;i++) {
            if(!values[i].hasOwnProperty("enabled") || values[i].enabled==true) {
                retVal.push(values[i]);
            }
        }
        return retVal;
    },

    startListeningForFileSystemSyncEvents: function() {
        var model = this;
        var isLoaded = model.isLoaded;
        var initializedSyncing = model.initializedSyncing;

        pm.mediator.on("initializedSyncableFileSystem", function() {
            model.initializedSyncing = true;
            model.trigger("startSync");
        });

        this.on("startSync", this.startSyncing, this);
    },

    startSyncing: function() {
        var i = 0;
        var model = this;
        var globals;
        var synced;
        var syncableFile;

        if (this.isLoaded && this.initializedSyncing) {
            pm.mediator.on("addSyncableFileFromRemote", function(type, data) {
                if (type === "globals") {
                    model.onReceivingSyncableFileData(data);
                }
            });

            pm.mediator.on("updateSyncableFileFromRemote", function(type, data) {
                if (type === "globals") {
                    model.onReceivingSyncableFileData(data);
                }
            });

            pm.mediator.on("deleteSyncableFileFromRemote", function(type, id) {
                if (type === "globals") {
                    model.onRemoveSyncableFile(id);
                }
            });

            synced = pm.settings.getSetting("syncedGlobals");

            if (!synced) {
                this.addToSyncableFilesystem(this.get("syncFileID"));
            }
        }
        else {
        }
    },

    onReceivingSyncableFileData: function(data) {
        var globals = JSON.parse(data);
        this.mergeGlobals(globals, false);
    },

    onRemoveSyncableFile: function(id) {
        // console.log("Do nothing");
        // this.deleteEnvironment(id, true);
    },

    getAsSyncableFile: function(id) {
        var name = id + ".globals";
        var type = "globals";
        var data = JSON.stringify(this.get("globals"));

        return {
            "name": name,
            "type": type,
            "data": data
        };
    },

    addToSyncableFilesystem: function(id) {
        var model = this;

        var syncableFile = this.getAsSyncableFile(id);

        pm.mediator.trigger("addSyncableFile", syncableFile, function(result) {
            if(result === "success") {
                model.updateGlobalSyncStatus(id, true);
            }
        });
    },

    removeFromSyncableFilesystem: function(id) {
        var name = id + ".globals";
        pm.mediator.trigger("removeSyncableFile", name, function(result) {
            model.saveGlobals([], false);
        });
    },

    updateGlobalSyncStatus: function(id, status) {
        pm.settings.setSetting("syncedGlobals", status);
    },

    onUpdatedGlobals: function(globals) {
        // console.log("Globals: This is ", this);
        // console.log("Globals are now", globals);
        this.set({"globals": globals});
        var model = this;

        clearTimeout(this.get("glbUpdateTimeout"));
        this.set("glbUpdateTimeout", setTimeout(function(globals) {
            return function() {
                var o = {'globals': JSON.stringify(globals)};
                pm.storage.setValue(o, function() {
                    model.addToSyncableFilesystem(model.get("syncFileID"));
                });
            }
        } (globals),1000));
    },

    downloadGlobals: function() {
        var name = "globals.postman_globals";
        var type = "application/json";

        globalsJSON = this.get("globals");

        var filedata = JSON.stringify(globalsJSON, null, '\t');

        pm.filesystem.saveAndOpenFile(name, filedata, type, function () {
            noty(
                {
                    type:'success',
                    text:'Saved globals to disk',
                    layout:'topCenter',
                    timeout:750
                });
        });
    },

    mergeGlobals:function (globals, syncToRemote, callback) {
        if(!globals) {
            globals = [];
        }

        var model = this;

        var currentGlobals = this.get("globals");
        var globalsToSave = [];
        //this will be an array of kv pairs
        var numGlobals = currentGlobals.length;
        for(var i=0;i<numGlobals;i++) {
            var thisKey = currentGlobals[i].key;
            //if the same key exists in the current globals array, use this one
            var elem = _.find(globals, function(globalVar){globalVar.key === thisKey});
            if(elem) {
                globalsToSave.push(elem);
            }
            else {
                globalsToSave.push(currentGlobals[i]);
            }
        }

        //add the remaining new globals
        var numNewGlobals = globals.length;
        for(i=0;i<numNewGlobals;i++) {
            var elem = _.find(globalsToSave, function(globalVar){globalVar.key === globals[i].key});
            if(!elem) {
                globalsToSave.push(globals[i]);
            }
        }

        this.set({"globals": globalsToSave});

        var o = {'globals': JSON.stringify(globalsToSave)};

        if(syncToRemote) {
            var objectToUpdate = {"globals":globalsToSave};
            pm.syncManager.addChangeset("user","update",objectToUpdate, null, true);
        }

        pm.storage.setValue(o, function() {
            pm.appWindow.trigger("sendMessageObject", "updatedGlobals", globalsToSave);
            model.addToSyncableFilesystem(model.get("syncFileID"));
	        if(callback) callback();
        });
    },

    clearGlobals: function () {
        var model = this;

        this.set({"globals": []});

        var o = {'globals': JSON.stringify([])};

        pm.storage.setValue(o, function() {
            pm.appWindow.trigger("sendMessageObject", "clearedGlobals", []);
            model.addToSyncableFilesystem(model.get("syncFileID"));
        });
    },

    saveGlobals: function(globals, syncToRemote) {
        this.set({"globals": globals});
        var o = {'globals': JSON.stringify(globals)};

        if(syncToRemote) {
            var objectToUpdate = {"globals":globals};
            pm.syncManager.addChangeset("user","update",objectToUpdate, null, true);
        }


        pm.storage.setValue(o, function() {
            pm.appWindow.trigger("sendMessageObject", "updatedGlobals", globals);
        });
    },


	//Sync
	onSyncChangeReceived: function(verb, message, callback) {
		var allowedTypes = ["user"];
		if(!message.model) message.model = message.type;
		if(allowedTypes.indexOf(message.model) === -1) {
			return;
		}
		if(verb === "update") {
			if(message.data.hasOwnProperty("globals")) {
				this.mergeGlobals(message.data.globals, false, callback);
			}
			pm.syncLogger.log(new Error(),["User updated: (name=updated) ",message.data]);
		}
	}
});