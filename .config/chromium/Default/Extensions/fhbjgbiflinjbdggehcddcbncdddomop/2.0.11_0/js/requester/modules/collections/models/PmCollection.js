/****

collectionRequest = {
    id: guid(),
    headers: request.getPackedHeaders(),
    url: url,
    method: request.get("method"),
    preRequestScript: request.get("preRequestScript"),
    data: body.get("dataAsObjects"),
    dataMode: body.get("dataMode"),
    name: newRequestName,
    description: newRequestDescription,
    descriptionFormat: "html",
    time: new Date().getTime(),
    version: 2,
    responses: []
};

*****/
var PmCollection = Backbone.Model.extend({
    defaults: function() {
        return {
            "id": "",
            "name": "",
            "description": "",
            "order": [],
            "folders": [],
            "requests": [],
            "timestamp": 0,
            "synced": false,
            "syncedFilename": "",
            "remote_id": 0,
            "remoteLink": "",
            "public": false,
            "owner": "",
            "subscribed": false,
            "write": true
        };
    },

    toSyncableJSON: function() {
        var j = this.getAsJSON();
        j.synced = true;
        return j;
    },

    setRequests: function(requests) {
        this.set("requests", requests);
    },

    getRequestIndex: function(newRequest) {
    	var requests = this.get("requests");
    	var count = requests.length;
    	var request;
    	var found;
    	var location;

    	for(var i = 0; i < count; i++) {
    		request = requests[i];
    		if(request.id === newRequest.id) {
    			found = true;
    			location = i;
    			break;
    		}
    	}

    	if (found) {
    		return location;
    	}
    	else {
    		return -1;
    	}
    },

    addRequest: function(newRequest) {
        var location = this.getRequestIndex(newRequest);
        var requests = this.get("requests");
        if (location !== -1) {
            //console.log("Request being added already exists. Not re-adding");
            //requests.splice(location, 1, newRequest);
        }
        else {
            requests.push(newRequest);
        }
    },

    deleteRequest: function(requestId) {
        var requests = _.clone(this.get("requests"));
    	var location = arrayObjectIndexOf(requests, requestId, "id");
    	if (location !== -1) {
            this.removeRequestIdFromOrderOrFolder(requestId);
    		requests.splice(location, 1);
            this.set("requests", requests);
    	}
    },

    updateRequest: function(newRequest) {
    	var location = this.getRequestIndex(newRequest);
    	var requests = this.get("requests");
    	if (location !== -1) {
    		requests.splice(location, 1, newRequest);
    	}
    },

    getFolderById: function(folderId) {
        var folders = _.clone(this.get("folders"));
        var location = arrayObjectIndexOf(folders, folderId, "id");
        return folders[location];
    },

    getFolders: function() {
        var folders = _.clone(this.get("folders"));
        return folders;
    },


    getRequestsInCollection: function() {
        var requests = _.clone(this.get("requests"));
        var order = _.clone(this.get("order"));
        var orderedRequests = [];

        var folders = this.get("folders");
        var folderCount = folders.length;

        if (folderCount > 0) {
            for(var i = 0; i < folderCount; i++) {
                folder = _.clone(folders[i]);
                folderOrder = folder.order;
                folderRequests = [];

                for(var j = 0; j < folderOrder.length; j++) {
                    id = folderOrder[j];

                    var index = arrayObjectIndexOf(requests, id, "id");

                    if(index >= 0) {
                        folderRequests.push(requests[index]);
                        requests.splice(index, 1);
                    }
                }

                folderRequests = this.orderRequests(folderRequests, folderOrder);
                orderedRequests = _.union(orderedRequests, folderRequests);
            }

            orderedRequests = _.union(orderedRequests, this.orderRequests(requests, order));
        }
        else {
            orderedRequests = this.orderRequests(requests, order)
        }

        return orderedRequests;
    },

    getRequestsInFolder: function(folder) {
        var folderOrder = folder.order;
        var requests = _.clone(this.get("requests"));
        var count = folderOrder.length;
        var index;
        var folderRequests = [];

        for(var i = 0; i < count; i++) {
            index = arrayObjectIndexOf(requests, folderOrder[i], "id");
            if (index >= 0) {
                folderRequests.push(requests[index]);
            }
        }

        var orderedRequests = this.orderRequests(folderRequests, folder.order);

        return orderedRequests;
    },

    addFolder: function(folder) {
        var folders = _.clone(this.get("folders"));
        folders.push(folder);
        this.set("folders", folders);
    },

    hasFolderId: function(folderId) {
        var folders = _.clone(this.get("folders"));
        var index = arrayObjectIndexOf(folders, folderId, "id");
        if(index===-1) return false;
        return true;
    },

    editFolder: function(folder) {
        function existingFolderFinder(f) {
            return f.id === id;
        }

        var id = folder.id;
        var folders = _.clone(this.get("folders"));
        var index = arrayObjectIndexOf(folders, id, "id");

        if (index !== -1) {
            folders.splice(index, 1, folder);
            this.set("folders", folders);
        }
    },

    deleteFolder: function(id) {
        var folders = _.clone(this.get("folders"));
        var index = arrayObjectIndexOf(folders, id, "id");
        folders.splice(index, 1);
        this.set("folders", folders);
    },

    getAsJSON: function() {
        return {
            "id": this.get("id"),
            "name": this.get("name"),
            "description": this.get("description"),
            "order": this.get("order"),
            "folders": this.get("folders"),
            "timestamp": this.get("timestamp"),
            "synced": this.get("synced"),
            "remote_id": this.get("remote_id"),
            "owner": this.get("owner"),
            "sharedWithTeam": this.get("sharedWithTeam"),
            "subscribed": this.get("subscribed"),
            "remoteLink": this.get("remoteLink"),
            "public": this.get("public"),
            "write": this.get("write")
        }
    },

    addRequestIdToFolder: function(id, requestId) {
        //this.removeRequestIdFromOrderOrFolder(requestId);

        var folders = _.clone(this.get("folders"));
        var index = arrayObjectIndexOf(folders, id, "id");

        var numFolders = folders.length;
        for(var i=0;i<numFolders;i++) {
            var requestIdInOrder = folders[i].order.indexOf(requestId);
            if(folders[i].id===id) {
                if(requestIdInOrder===-1) {
                    folders[i].order.push(requestId);
                }
                //else the request already exists in the folder
            }
            //for all other folders, remove this request
            else {
                //same id exists in another folder
                if(requestIdInOrder>=0) {
                    folders[i].order.splice(requestIdInOrder, 1);
                }
            }
        }

        this.set("folders", folders);
    },

    removeRequestIdFromOrder: function(requestId) {
        var order = this.get("order");
        var idx = order.indexOf(requestId);
        if(idx === -1) return -1;

        order.splice(idx,1);
        this.set("order", order);
        return requestId;
    },

    requestExistsInCollectionRoot: function(requestId) {
        var collectionOrder = this.get("requests");
        //only checks for root requests
        if(collectionOrder.indexOf(requestId)) {
            return true;
        }
        return false;
    },

    requestExistsInCollectionFolders: function(requestId) {
        var folders= this.get("folders");
        //only checks for requests in folders
        var numFolders = folders.length;

        for(var i = 0; i < numFolders; i++) {
            var indexInFolder = folders[i].order.indexOf(requestId);
            if(indexInFolder >= 0) {
                return folders[i].id;
            }
        }
        return false;
    },


    addRequestIdToOrder: function(requestId) {
        this.removeRequestIdFromOrderOrFolder(requestId);

        var order = _.clone(this.get("order"));
        var requestIdInOrder = order.indexOf(requestId);
        if(requestIdInOrder!==-1) {
            throw "Request already exists in collectionOrder. Not re-adding.";
            return;
        }
        order.push(requestId);
        this.set("order", order);
    },

    removeRequestIdFromOrderOrFolder: function(requestId) {
        var order = _.clone(this.get("order"));
        var indexInFolder;
        var folders = _.clone(this.get("folders"));

        var indexInOrder = order.indexOf(requestId);

        if (indexInOrder >= 0) {
            order.splice(indexInOrder, 1);
            this.set("order", order);
        }

        for(var i = 0; i < folders.length; i++) {
            indexInFolder = folders[i].order.indexOf(requestId);
            if(indexInFolder >= 0) {
                break;
            }
        }

        if(indexInFolder >= 0) {
            folders[i].order.splice(indexInFolder, 1);
            this.set("folders", folders);
        }
    },

    isUploaded: function() {
        return this.get("remote_id") !== 0;
    },

    // Uses arrays
    orderRequests: function() {

        var folders = this.get("folders");
        var requests = this.get("requests");

        var folderCount = folders.length;
        var folder;
        var folderOrder;
        var id;
        var existsInOrder;
        var folderRequests;

        var newFolders = [];

        for(var i = 0; i < folderCount; i++) {
            folder = _.clone(folders[i]);
            folderOrder = folder.order;
            folderRequests = [];

            for(var j = 0; j < folderOrder.length; j++) {
                id = folderOrder[j];

                var index = arrayObjectIndexOf(requests, id, "id");

                if(index >= 0) {
                    folderRequests.push(requests[index]);
                    requests.splice(index, 1);
                }
            }

            folder["requests"] = this.orderRequests(folderRequests, folderOrder);
            newFolders.push(folder);
        }

        this.set("folders", newFolders);
        this.set("requests", this.orderRequests(requests, this.get("order")));

        return collection;
    },

    orderRequests: function(inRequests, order) {
        var requests = _.clone(inRequests);

        function requestFinder(request) {
            return request.id === order[j];
        }

        if (order.length === 0) {
            requests.sort(sortAlphabetical);
        }
        else {
            var orderedRequests = [];
            for (var j = 0, len = order.length; j < len; j++) {
                var element = _.find(requests, requestFinder);
                if(element) {
                    orderedRequests.push(element);
                }
            }

            requests = orderedRequests;
        }

        return requests;
    }
});