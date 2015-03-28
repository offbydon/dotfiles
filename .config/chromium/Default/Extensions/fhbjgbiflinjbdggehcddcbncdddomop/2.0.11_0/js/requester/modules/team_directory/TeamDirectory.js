var TeamDirectoryCollection = Backbone.Model.extend({
    defaults: function() {
        return {
            "id": "",
            "collection_name": "",
            "collection_id": "",
            "collection_description": "",
            "collection_owner_id": 0,
            "collection_owner_name": "",
            "timestamp": 0,
            "updated_at": "",
            "updated_at_formatted": ""
        };
    }
});

var TeamDirectory = Backbone.Collection.extend({
    model: TeamDirectoryCollection,

    startId: 0,
    endId: 0,
    fetchCount: 44,
    lastCount: 0,
    totalCount: 0,
    order: "descending",

    isInitialized: false,

    reload: function() {
        this.startId = 0;
        this.fetchCount = 44;
        this.lastCount = 0;
        this.totalCount = 0;
        this.getTeamCollections();
    },

    comparator: function(a, b) {
        var aName = a.get("timestamp");
        var bName = b.get("timestamp");

        return aName > bName;
    },

    initialize: function() {
    	pm.mediator.on("initializeTeamDirectory", this.onInitializeTeamDirectory, this);
        pm.mediator.on("getDirectoryCollection", this.onGetDirectoryCollection, this);

        pm.mediator.on("successfulSubscribe", this.onSuccessfulSubscribe, this);
        pm.mediator.on("successfulUnsubscribe", this.onSuccessfulUnsubscribe, this);
    },

    subscribeToCollection: function(collectionId, ownerId) {
        var collectionToSubscibe = this.where({collectionId: collectionId});
        pm.syncManager.addChangeset("collection","subscribe",{collectionId: collectionId, owner: ownerId}, collectionId, true);
    },

    unsubscribeFromCollection: function(collectionId, ownerId) {
        pm.syncManager.addChangeset("collection","unsubscribe",{collectionId: collectionId, owner: ownerId}, collectionId, true);
        var status = pm.collections.deleteCollectionFromDataStoreWithOptSync(collectionId, true, false, function() {});
    },

    onSuccessfulSubscribe: function(res) {
        if (res.data && res.data.model_id) {
            var collection = this.get(res.data.model_id);
            collection.set("canSubscribeTo", false);
            this.set(collection, {remove: false});
            this.trigger("subscribedTo", res.data.model_id);
        }
    },

    onSuccessfulUnsubscribe: function(res) {
        if (res.data && res.data.model_id) {
            var collection = this.get(res.data.model_id);
            if(collection) {
                //this means the User clicked unsubscribe in the team directry
                collection.set("canSubscribeTo", true);
                this.set(collection, {remove: false});
                this.trigger("unsubscribedFrom", res.data.model_id);
            }
            else {
                //the user deleted the collection from the sidebar. no need to update the team directory
            }
        }
    },

    onInitializeTeamDirectory: function() {
    	if (!this.isInitialized) {
    		this.isInitialized = true;
    	}

        this.getTeamCollections();
        this.getTeamMembers();
    },

    onGetDirectoryCollection: function(link_id) {
        this.downloadCollection(link_id);
    },

    loadNext: function() {
        this.getCollections(this.endId, this.fetchCount, "descending");
    },

    loadPrevious: function() {
        this.getCollections(this.startId, this.fetchCount, "ascending");
    },

    getTeamCollections: function() {
    	var collection = this;
        collection.trigger("loading");
        // console.log("Getting collections", startId, "Count", count, "Order", order);
        var orgs = pm.user.get("organizations");
        if(orgs.length <= 0) {
            //error
            console.log("You are not a member of a team");
            collection.reset();
            return;
        }
        var orgId = orgs[0].id;
        pm.api.getTeamCollections(pm.user.id, pm.user.get("access_token"), orgId, function(team) {
            if(team.collections) {
                $("#team-dir-loading").remove();

                var collections = team.collections;
                if(collections.error) {
                    console.log("Collections could not be added. Reason: " + collections.result);
                    return;
                }
                //console.log("Received collections: ", collections);


                collection.reset();
                var collectionsToAdd = _.map(collections, function(collection) {
                    if(collection.id.indexOf("#")!==-1) {
                        collection.id = collection.id.substring(collection.id.indexOf("#")+1); //TEMPORARY
                    }
                    if(pm.subscriptionManger.isSubscribedTo(collection.id)) {
                        collection.canSubscribeTo=false;
                    }
                    else {
                        collection.canSubscribeTo=true;
                    }

                    collection.isOwn=false;
                    if(pm.user.id===collection.owner.id) {
                        collection.canSubscribeTo=false;
                        collection.isOwn=true;
                    }
                    return collection;
                });
                collection.add(collectionsToAdd, {merge: true});
            }
        },
        function() {
            //console.log("Could not get team collections");
            $("#team-dir-loading").remove();
        });
    },

    getTeamMembers: function() {

    },

    downloadCollection: function(linkId) {
        // TODO Check if the collection is uploaded by the user
        // TODO Download using remote ID
        var remoteId = pm.user.getRemoteIdForLinkId(linkId);

        // console.log("Found remoteId", remoteId);
        if (remoteId) {
            pm.user.downloadSharedCollection(remoteId, function() {

                pm.mediator.trigger("notifySuccess", "Downloaded collection");
            });
        }
        else {
            pm.api.downloadDirectoryCollection(linkId, function (data) {
                try {
                    var collection = data;
                    pm.mediator.trigger("notifySuccess", "Downloaded collection");

                    pm.mediator.trigger("addDirectoryCollection", collection);
                }
                catch(e) {
                    pm.mediator.trigger("notifyError", "Failed to download collection");
                    pm.mediator.trigger("failedCollectionImport");
                }
            });
        }
    }

});