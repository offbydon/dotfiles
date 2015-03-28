var Environments = Backbone.Collection.extend({
    model: Environment,

    isLoaded: false,
    initializedSyncing: false,

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

    initialize:function () {
        var collection = this;

        // TODO Events for in-memory updates
        pm.appWindow.trigger("registerInternalEvent", "addedEnvironment", this.onAddedEnvironment, this);
        pm.appWindow.trigger("registerInternalEvent", "updatedEnvironment", this.onUpdatedEnvironment, this);
        pm.appWindow.trigger("registerInternalEvent", "deletedEnvironment", this.onDeletedEnvironment, this);

        this.startListeningForFileSystemSyncEvents();

        pm.indexedDB.environments.getAllEnvironments(function (environments) {        
            environments.sort(sortAlphabetical);
            collection.add(environments, {merge: true});

            collection.isLoaded = true;
            collection.trigger("startSync");
            if(pm.syncManager) pm.syncManager.trigger("itemLoaded","environments");
            collection.trigger("loadedEnvironments");
            pm.mediator.trigger("loadedEnvironments");
        });

	    //--Sync listeners---
	    pm.mediator.on("syncChangeReceived", this.onSyncChangeReceived, this);

        this.set("envUpdateTimeout", null);
    },

    // Functions for internal app window messaging
    onAddedEnvironment: function(environment) {
        this.add(environment, { merge: true });
    },

    onUpdatedEnvironment: function(environment) {
        this.add(environment, { merge: true });
        clearTimeout(this.get("envUpdateTimeout"));
        this.set("envUpdateTimeout", setTimeout(function(environment) {
            return function() {
                pm.indexedDB.environments.updateEnvironment(environment, function () {            
                    pm.mediator.trigger("databaseOperationComplete");
                });
            }
        } (environment), 1000));
    },

    onDeletedEnvironment: function(id) {
        this.remove(id);
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
        var environment;
        var synced;
        var syncableFile;

        if (this.isLoaded && this.initializedSyncing) {
            pm.mediator.on("addSyncableFileFromRemote", function(type, data) {
                if (type === "environment") {
                    collection.onReceivingSyncableFileData(data);
                }
            });

            pm.mediator.on("updateSyncableFileFromRemote", function(type, data) {
                if (type === "environment") {
                    collection.onReceivingSyncableFileData(data);
                }
            });

            pm.mediator.on("deleteSyncableFileFromRemote", function(type, id) {
                if (type === "environment") {
                    collection.onRemoveSyncableFile(id);
                }
            });

            // And this
            for(i = 0; i < this.models.length; i++) {
                environment = this.models[i];
                synced = environment.get("synced");

                if (!synced) {
                    this.addToSyncableFilesystem(environment.get("id"));
                }
            }
        }
        else {
        }
    },

    onReceivingSyncableFileData: function(data) {
        this.importEnvironment(data, true);
    },

    onRemoveSyncableFile: function(id) {
        this.deleteEnvironment(id, true);
    },

    getAsSyncableFile: function(id) {
        var environment = this.get(id);
        var name = id + ".environment";
        var type = "environment";
        var data = JSON.stringify(environment.toSyncableJSON());

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
                collection.updateEnvironmentSyncStatus(id, true);
            }
        });
    },

    removeFromSyncableFilesystem: function(id) {
        var name = id + ".environment";
        pm.mediator.trigger("removeSyncableFile", name, function(result) {
        });
    },

    //this will be called in the syncmanager, when an event is received from the server
    addFullEnvironment: function(env, callback) {
        var name = env.name;
        var values = env.values;
        try {
            this.addEnvironment(env.id, name, values, true, callback);
        }
        catch(e) {
            console.log("Adding environment failed: "+e);
            return -1;
        }
        return 0;
    },

    addEnvironmentWithoutId: function(name, values, doNotSync) {
        var id = guid();
        this.addEnvironment(id, name, values, doNotSync);
    },

    addEnvironment:function (id, name, values, doNotSync, callback) {
        var collection = this;

        var environment = {
            id:id,
            name:name,
            values:values,
            timestamp:new Date().getTime(),
            synced: false
        };

        var envModel = new Environment(environment);
        collection.add(envModel);

        pm.appWindow.trigger("sendMessageObject", "addedEnvironment", environment);

        pm.indexedDB.environments.addEnvironment(environment, function () {
            pm.mediator.trigger("databaseOperationComplete");
	        pm.mediator.trigger('syncOperationDone');
            if (doNotSync) {
                //console.log("Do not sync this change");
            }
            else {
                pm.syncManager.addChangeset("environment","create",environment, null, true);
                collection.addToSyncableFilesystem(environment.id);
            }

	        if(callback) callback();

        });
    },

    updateRemoteEnvironment: function(newEnv, callback) {
        try {
          this.updateEnvironment(newEnv.id, newEnv.name, newEnv.values, true, callback);
        }
        catch(e) {
            console.log("Updating environment failed: "+e);
            return -1;
        }
        return 0;
    },

    updateEnvironment:function (id, name, values, doNotSync, callback) {
        var collection = this;

        var environment = {
            id:id,
            name:name,
            values:values,
            timestamp:new Date().getTime()
        };

        var envModel = new Environment(environment);
        collection.add(envModel, {merge: true});
        
        pm.indexedDB.environments.updateEnvironment(environment, function () {            
            pm.appWindow.trigger("sendMessageObject", "updatedEnvironment", environment);
	        pm.mediator.trigger('syncOperationDone');
            pm.mediator.trigger("databaseOperationComplete");
            if (doNotSync) {
                // console.log("Do not sync this change");
            }
            else {
                pm.syncManager.addChangeset("environment","update",environment, null, true);
                collection.addToSyncableFilesystem(environment.id);
            }

	        if(callback) callback();
        });
    },

    clearEnvironment: function(id, name) {
        var collection = this;
        var environment = {
            id:id,
            name:name,
            values:[],
            timestamp:new Date().getTime()
        };
        var envModel = new Environment(environment);
        collection.add(envModel, {merge: true});

        pm.indexedDB.environments.updateEnvironment(environment, function () {
            pm.appWindow.trigger("sendMessageObject", "clearedEnvironment", environment);
        });
    },

    updateEnvironmentSyncStatus: function(id, status) {
        var collection = this;

        var environment = this.get(id);
        environment.set("synced", status);
        collection.add(environment, {merge: true});
        pm.appWindow.trigger("sendMessageObject", "updatedEnvironment", environment);

        pm.indexedDB.environments.updateEnvironment(environment.toJSON(), function () {
            pm.mediator.trigger("databaseOperationComplete");
        });
    },

    deleteRemoteEnvironment: function(environmentId, callback) {
        try {
            this.deleteEnvironment(environmentId, true, callback);
        }
        catch(e) {
            console.log("Deleting environment failed: "+e);
            return -1;
        }
        return 0;
    },

    deleteEnvironment:function (id, doNotSync, callback) {
        var collection = this;

        pm.indexedDB.environments.deleteEnvironment(id, function () {
            collection.remove(id);
            pm.appWindow.trigger("sendMessageObject", "deletedEnvironment", id);
            pm.mediator.trigger("databaseOperationComplete");
	        pm.mediator.trigger('syncOperationDone');

            if (doNotSync) {
                // console.log("Do not sync this");
            }
            else {
                pm.syncManager.addChangeset("environment","destroy",null, id, true);
                collection.removeFromSyncableFilesystem(id);
            }

	        if(callback) callback();
        });
    },



    downloadEnvironment:function (id) {
        var environment = this.get(id);

        environment.set("synced", false);

        var name = environment.get("name") + ".postman_environment";
        var type = "application/json";
        var filedata = JSON.stringify(environment.toJSON(), null, '\t');
        pm.filesystem.saveAndOpenFile(name, filedata, type, function () {
            noty(
                {
                    type:'success',
                    text:'Saved environment to disk',
                    layout:'topCenter',
                    timeout:750
                });
        });
    },

    duplicateEnvironment:function (id) {
        var oldEnvironment = this.get(id).toJSON();
        var environment = _.clone(oldEnvironment);
        environment.name = environment.name + " " + "copy";
        environment.id = guid();

        var collection = this;

        pm.indexedDB.environments.addEnvironment(environment, function () {
            var envModel = new Environment(environment);
            collection.add(envModel);
            pm.mediator.trigger("databaseOperationComplete");
            pm.syncManager.addChangeset("environment","create",environment, null, true);
            pm.appWindow.trigger("sendMessageObject", "addedEnvironment", environment);
            collection.addToSyncableFilesystem(environment.id);
        });
    },

    importEnvironment: function(data, doNotSync) {
        var collection = this;
		var environment = data;
	    try {
            //could be a parsed object as well
            if(typeof data === "string") {
                environment = JSON.parse(data);
            }
	    }
	    catch(err) {
		    noty(
			    {
				    type:'error',
				    text: 'Error - File is not a valid JSON file',
				    layout:'topCenter',
				    timeout:750
			    });
	    }

        pm.indexedDB.environments.addEnvironment(environment, function () {
            var envModel = new Environment(environment);
            collection.add(envModel, {merge: true});
            pm.appWindow.trigger("sendMessageObject", "updatedEnvironment", environment);
            pm.syncManager.addChangeset("environment","create",environment, null, true);
            pm.mediator.trigger("databaseOperationComplete");
            if (doNotSync) {
                // console.log("Do not sync this");
            }
            else {
                collection.trigger("importedEnvironment", environment);
                collection.addToSyncableFilesystem(environment.id);
            }

        });
    },

    importEnvironments:function (files) {
        var collection = this;

        // Loop through the FileList
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render thumbnail.
                    collection.importEnvironment(e.currentTarget.result);
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f);
        }
    },

    mergeEnvironments: function(environments) {
        var size = environments.length;
        var collection = this;

        function onUpdateEnvironment(environment) {
            var envModel = new Environment(environment);
            collection.add(envModel, {merge: true});
            pm.mediator.trigger("sendMessageObject", "updatedEnvironment", environment);
            pm.syncManager.addChangeset("environment","update",environment, null, true);
            pm.mediator.trigger("databaseOperationComplete");
            collection.addToSyncableFilesystem(environment.id);
        }

        for(var i = 0; i < size; i++) {
            var environment = environments[i];
            collection.importEnvironment(environment);
            //Why is this updating??
            //pm.indexedDB.environments.updateEnvironment(environment, onUpdateEnvironment);
        }
    },



	//---Sync----
	onSyncChangeReceived: function(verb, message, callback) {
		if(!message.model) message.model = message.type;

		var allowedTypes = ["environment"];
		if(allowedTypes.indexOf(message.model) === -1) {
			return;
		}
		if(verb === "create") {
            if(this.get(message.data.id)) {
                this.updateRemoteEntity(message, callback);
            }
            else {
                this.createRemoteEntity(message, callback);
            }
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
		if(message.model === "environment") {
			//pm.syncStatusManager.addNotification("environment",message.data, "create");
			var status = pm.environments.addFullEnvironment(message.data, callback);
			if(status==-1) {
				pm.mediator.trigger('syncOperationFailed', "Adding full environment failed");
			}
			else {
				pm.syncManager.updateSinceFromMessage(message);
			}
			pm.syncLogger.log(new Error(),["Environment created: ",message.data]);
		}
	},

	updateRemoteEntity: function(message, callback) {
		if(message.model === "environment") {
			//pm.syncStatusManager.addNotification("environment",message.data, "update");
			var status = pm.environments.updateRemoteEnvironment(message.data, callback);
			if(status==-1) {
				pm.mediator.trigger('syncOperationFailed', "Updating remote environment failed");
			}
			else {
				pm.syncManager.updateSinceFromMessage(message);
			}
			pm.syncLogger.log(new Error(),["Environment updated: ", message.data]);
		}
	},

	deleteRemoteEntity: function(message, callback) {
		if(message.model === "environment") {
			pm.syncLogger.log(new Error(),["Environment destroyed: ",message.data]);
			var status = pm.environments.deleteRemoteEnvironment(message.data.id, callback);
			if(status==-1) {
				pm.mediator.trigger('syncOperationFailed', "Deleting remote env failed");
			}
			else {
				pm.syncManager.updateSinceFromMessage(message);
			}
		}
	}
});
