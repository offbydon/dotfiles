var CollectionSidebar = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        model.on("add", this.renderOneCollection, this);
        model.on("remove", this.removeOneCollection, this);

        model.on("reset", this.removeAllCollections, this);

        model.on("updateCollection", this.renderOneCollection, this);
        //why this HTML nonsense di - check updateCollectionMeta()
        //model.on("updateCollectionMeta", this.updateCollectionMeta, this);
        model.on("updateCollectionMeta", this.renderOneCollection, this);

        model.on("addCollectionRequest", this.addCollectionRequest, this);
        model.on("selectedCollectionRequest", this.selectedCollectionRequest, this);
        model.on("removeCollectionRequest", this.removeCollectionRequest, this);
        model.on("updateCollectionRequest", this.updateCollectionRequest, this);
        model.on("moveRequestToCollection", this.onMoveRequestToCollection, this);
        model.on("moveRequestToFolder", this.onMoveRequestToFolder, this);

        model.on("sortRequestContainer", this.onSortRequestContainer, this);

        model.on("duplicateCollection", this.duplicateCollection, this);
        model.on("duplicateCollectionRequest", this.duplicateCollectionRequest, this);
        model.on("duplicateFolder", this.duplicateFolder, this);

        model.on("addFolder", this.onAddFolder, this);
        model.on("updateFolder", this.onUpdateFolder, this);
        model.on("deleteFolder", this.onDeleteFolder, this);

        model.on("filter", this.onFilter, this);
        model.on("revertFilter", this.onRevertFilter, this);

        $('#collection-items').html("");
        $('#collection-items').append(Handlebars.templates.message_no_collection({}));

        var $collection_items = $('#collection-items');

        $collection_items.on("mouseover", ".sidebar-collection .sidebar-collection-head", function () {
	        jQuery(".folder-head-actions,.collection-head-actions,.request-actions").hide();
            var actionsEl = jQuery('.collection-head-actions', this);
            actionsEl.css('display', 'block');
        });

        $collection_items.on("mouseleave", ".sidebar-collection .sidebar-collection-head", function () {
            var actionsEl = jQuery('.collection-head-actions', this);
            actionsEl.css('display', 'none');
        });


	    //$collection_items.on("mouseover", ".collection-head-actions>.tooltip", function () {
		 //   var actionsEl = jQuery(this);
	    //});


        $collection_items.on("mouseover", ".folder .folder-head", function () {
	        jQuery(".folder-head-actions,.collection-head-actions,.request-actions").hide();
            var actionsEl = jQuery('.folder-head-actions', this);
            actionsEl.css('display', 'block');
        });

        $collection_items.on("mouseleave", ".folder .folder-head", function () {
            var actionsEl = jQuery('.folder-head-actions', this);
            actionsEl.css('display', 'none');
        });

	    //$collection_items.on("mouseenter", ".folder-head-actions>.tooltip", function () {
		 //   var actionsEl = jQuery(this);
	    //});

        $collection_items.on("click", ".sidebar-collection-head-name", function () {
            var id = $(this).attr('data-id');
            $(this).removeClass("just-subscribed");
            view.toggleRequestList(id);
        });

        $collection_items.on("click", ".folder-head-name", function () {
            var id = $(this).attr('data-id');
            view.toggleSubRequestList(id);
        });

        $collection_items.on("click", ".collection-action-duplicate", function () {
            var id = $(this).attr('data-id');
            var c = model.get(id);
            model.trigger("duplicateCollection", c);
            pm.tracker.trackEvent("collection", "duplicate");
        });

        $collection_items.on("click", ".collection-head-actions .label", function () {
            var id = $(this).parent().parent().parent().attr('data-id');
            view.toggleRequestList(id);
        });

        $collection_items.on("click", ".collection-actions-add-folder", function () {
            var id = $(this).attr('data-id');
            var c = model.get(id);
            model.trigger("showAddFolderModal", c);
        });

        $collection_items.on("click", ".collection-actions-edit", function () {
            var id = $(this).attr('data-id');
            var c = model.get(id);
            model.trigger("showEditModal", c);
        });

        $collection_items.on("click", ".collection-actions-delete", function () {
            var id = $(this).attr('data-id');
            var name = $(this).attr('data-name');
            var shared = $(this).attr('data-shared');
            $('#modal-delete-collection-yes').attr('data-id', id);
            $('#modal-delete-collection-yes').attr('data-shared', shared);
            var sharedWithTeam = $(this).attr('data-shared');
            //TODO - change when teams are enabled!!
            //TODO
            //TODO!
            if(sharedWithTeam === "true" && pm.user.id && false) {
                $('#collection-share-warning').
                    html("This collection has been shared with your team. If you delete this collection, all users who have subscribed to the collection will automatically be unsubscribed");
            }
            else {
                $('#collection-share-warning').html("");
            }

            $("#modal-delete-collection-name").html(name);

        });

        $collection_items.on("click", ".collection-actions-unsubscribe", function () {
            var id = $(this).attr('data-id');
            var owner = $(this).attr('data-owner');

            var collectionMeta = {
                owner: owner,
                model_id: id
            };

            pm.syncManager.addChangeset("collection", "unsubscribe", {owner: collectionMeta.owner}, collectionMeta.model_id, true);
            var status = pm.collections.deleteCollectionFromDataStoreWithOptSync(collectionMeta.model_id, true, false, function() {});
        });

        $collection_items.on("click", ".folder-actions-edit", function () {
            var id = $(this).attr('data-id');
            var folder = model.getFolderById(id);
            model.trigger("showEditFolderModal", folder);
        });

        $collection_items.on("click", ".folder-actions-delete", function () {
            var id = $(this).attr('data-id');
            var name = $(this).attr('data-name');

            $('#modal-delete-folder-yes').attr('data-id', id);
            $('#modal-delete-folder-name').html(name);
        });

        $collection_items.on("click", ".collection-actions-download", function () {
            var id = $(this).attr('data-id');
            model.trigger("shareCollectionModal", id);
        });

        $('#collection-items').on("mouseover", ".sidebar-request", function () {
	        jQuery(".folder-head-actions,.collection-head-actions,.request-actions").hide();
            var actionsEl = jQuery('.request-actions', this);
            actionsEl.css('display', 'block');
        });

        $('#collection-items').on("mouseleave", ".sidebar-request", function () {
            var actionsEl = jQuery('.request-actions', this);
            actionsEl.css('display', 'none');
        });

        $('#collection-items').on("mouseenter", ".sidebar-collection-request",function() {
            $(this).addClass('hover');
        });

        $('#collection-items').on("mouseleave", ".sidebar-collection-request",function() {
            $(this).removeClass('hover');
        });


        $collection_items.on("click", ".request-actions-load", function () {
            var id = $(this).attr('data-id');
            model.loadCollectionRequest(id);
            $('.sidebar-history-request').removeClass('sidebar-history-request-active');
        });

        $collection_items.on("click", ".request-actions-delete", function () {
            var id = $(this).attr('data-id');
            var request = model.getRequestById(id);            
            model.trigger("deleteCollectionRequest", request);
        });

        $collection_items.on("click", ".request-actions-edit", function () {
            var id = $(this).attr('data-id');
            var request = model.getRequestById(id);

            model.trigger("editCollectionRequest", request);
        });

        $collection_items.on("click", ".request-actions-duplicate", function () {
            var id = $(this).attr('data-id');
            var request = model.getRequestById(id);
            model.trigger("duplicateCollectionRequest", request);
            pm.tracker.trackEvent("request", "duplicate");
        });

        $collection_items.on("click", ".folder-actions-duplicate", function () {
            var id = $(this).attr('data-id');
            var request = model.getFolderById(id);
            model.trigger("duplicateFolder", request);
        });

        this.collectionSortTimers = {};
    },

    _updateSidebar: function() {
        clearTimeout(pm.globals.updateSidebarTooltips);
        pm.globals.updateSidebarTooltips = setTimeout(function() {
            $("#sidebar-section-collections [rel='tooltip']").tooltip();
        },500);
    },

    duplicateCollectionRequest: function(oldRequest) {
        if(!oldRequest) {
            return;
        }
        var collection = this.model.getCollectionById(oldRequest.collectionId);
        if(!collection) {
            return;
        }
        var oldId = oldRequest.id;

        var newRequest = _.clone(oldRequest);
        this.setNewIdsForResponses(newRequest);
        newRequest.name = oldRequest.name + " copy";
        newRequest.id = guid();

        var orderRequests = collection.get("order");
        var folders = collection.get("folders");

        if(orderRequests.indexOf(oldId)>=0) {
            this.model.addRequestToCollection(newRequest,collection, true, true);
            return;
        }
        else {
            var sidebar = this;
            _.each(folders,function(folder) {
                if(folder.order.indexOf(oldId)>=0) {
                    sidebar.model.addRequestToFolder(newRequest, collection.id, folder.id, true, true);
                    return;
                }
            });
        }
    },

    setNewIdsForResponses: function(request) {
        if(!request.responses) return;
        var numResponses = request.responses.length;
        for(var i=0;i<numResponses;i++) {
            request.responses[i].id = guid();
        }
    },

    duplicateFolder: function(oldFolder) {
        var collection = this.model.getCollectionById(oldFolder.collection_id);
        if(!collection) {
            //error condition
            return;
        }

        var newFolder = this.cloneFolder(oldFolder);
        newFolder.name = oldFolder.name + " copy";

        this.model.addExistingFolder(collection.id, newFolder, true);

        //clone and add all requests of the folder
        var sidebar = this;
        var numOrder = oldFolder.order.length;
        for(var i=0;i<numOrder;i++) {
            var requestId = oldFolder.order[i];
            var oldRequest = sidebar.model.getRequestById(requestId);
	        if(!oldRequest) {
		        //if there's no request with this id, the order is corrupted
		        //you should still be able to duplicate the rest
		        continue;
	        }
            var newRequest = _.clone(oldRequest);
            newRequest.folder=newFolder.id;
            newRequest.id = guid();
            sidebar.model.addRequestToFolder(newRequest,collection.id, newFolder.id, true, false);
        }
        pm.tracker.trackEvent("folder", "duplicate");
        setTimeout(function(){
            pm.syncManager.trigger("singleSyncDone");
            pm.mediator.trigger("commitTransaction", collection.id);
        },1000);
    },

    duplicateCollection: function(collection) {
        if(!collection) {
            return;
        }
        var newCollection = {};
        newCollection.id = guid();
        newCollection.name = collection.get("name") + " copy";
        newCollection.description = collection.get("description");
        newCollection.order = [];
        newCollection.timestamp = new Date().getTime();
        newCollection.owner = pm.user.id;

        var sidebar = this;
        this.model.addCollectionToDataStore(newCollection, true, true, function() {
            var newCollection1 = sidebar.model.getCollectionById(newCollection.id);

            //Add all the folders
            var folderIdMap = {};
            _.each(collection.get("folders"),function(folder) {
                var newFolder = sidebar.cloneFolder(folder);
                newFolder.write = true; //All duplicated collections will be owned by this user
                newFolder.owner = pm.user.id;
                folderIdMap[folder.id] = newFolder.id;
                sidebar.model.addExistingFolder(newCollection1.id, newFolder, false);
            });

            //Add add all requests
            var orderRequests = collection.get("order");
            var folders = collection.get("folders");
            var collectionRequests = collection.get("requests");

            //add root collection requests (those not in folders)
            _.each(orderRequests, function(requestId) {
                //find request with Id=requestId
                var thisRequest = _.find(collectionRequests, function(request){
                    return request.id==requestId
                });
                var newRequest = _.clone(thisRequest);
                newRequest.owner = pm.user.id;
                newRequest.write = true;
                delete newRequest.folder;
                _.each(newRequest.responses, function(response) {
                    response.write=true;
                    response.id = guid();
                });
                newRequest.id = guid();
                newRequest.collectionId = newCollection1.id;
                sidebar.model.addRequestToCollection(newRequest,newCollection1, true, false);
            });

            //add requests in folders
            _.each(folders, function(folder) {
                _.each(folder.order, function(requestId) {
                    var thisRequest = _.find(collectionRequests, function(request){
                        return request.id==requestId
                    });
                    var newRequest = _.clone(thisRequest);
                    if(newRequest) {
                        newRequest.id = guid();
                        newRequest.write = true;
                        _.each(newRequest.responses, function(response) {
                            response.write=true;
                            response.id = guid();
                        });
                        newRequest.owner = pm.user.id;
                        newRequest.collectionId = newCollection1.id;
                        sidebar.model.addRequestToFolder(newRequest, newCollection1.id, folderIdMap[folder.id], true, false);
                    }
                });

                //folder re-ordering is not required as the folder requests aren't sent in realtime
            });

            setTimeout(function() {
                pm.syncManager.trigger("singleSyncDone");
                //update order field for collection, so the requests arent messed up
                var collectionObject = newCollection1.toJSON();
                var jsonToSend = {
                    id: collectionObject.id,
                    order: collectionObject.order,
                    owner: collectionObject.owner
                };
                //db update isn't required
                pm.syncManager.addChangeset("collection","update",jsonToSend, null, false);
                pm.mediator.trigger("commitTransaction", newCollection1.id);
            },Math.min(5000,100+(300*newCollection1.toJSON().order.length)));
            //so that the delay is non-zero, proportional to the number of requests, and <5s
        });


    },

    cloneFolder: function(oldFolder) {
        var newFolder = _.clone(oldFolder);
        newFolder.id = guid();
        newFolder.order = [];
        return newFolder;
    },

    selectedCollectionRequest: function(request) {
        var id = request.id;
        $('.sidebar-collection-request').removeClass('sidebar-collection-request-active');
        $('#sidebar-request-' + id).addClass('sidebar-collection-request-active');
    },

    addRequestListeners:function () {
        $('#sidebar-sections').on("mouseenter", ".sidebar-request", function () {
            var actionsEl = jQuery('.request-actions', this);
            actionsEl.css('display', 'block');
        });

        $('#sidebar-sections').on("mouseleave", ".sidebar-request", function () {
            var actionsEl = jQuery('.request-actions', this);
            actionsEl.css('display', 'none');
        });
    },

    emptyCollectionInSidebar:function (id) {
        $('#collection-requests-' + id).html("");
    },

    removeOneCollection:function (model, pmCollection) {
        var collection = model.toJSON();
        $('#collection-' + collection.id).remove();

        if(pmCollection.length === 0) {
            $('#sidebar-section-collections .empty-message').css("display", "block");
        }
    },

    removeAllCollections: function() {
        $("li.sidebar-collection").remove();
        $('#sidebar-section-collections .empty-message').css("display", "block");
    },

    /**
     * This also sets the write field correctly
     * @param collection
     * @returns {*}
     */
    organizeRequestsInFolders: function(collection) {
        if(!("folders" in collection)) {
            return collection;
        }

        if(!("requests" in collection)) {
            return collection;
        }

        var isWriteable = (collection.write || pm.user.id==collection.owner);

        var folders = _.clone(collection["folders"]);
        var requests = _.clone(collection["requests"]);

        var folderCount = folders.length;
        var requestCount = requests.length;
        var folder;
        var folderOrder;
        var id;
        var i,j;
        var existsInOrder;
        var folderRequests;

        var newFolders = [];

        for(i = 0; i < folderCount; i++) {
            collection["folders"][i].write = isWriteable;

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

        for (i=0;i<requestCount;i++) {
            collection["requests"][i].write = isWriteable;

            var responses = collection["requests"][i].responses || [];
            for(j=0;j<responses.length;j++) {
                responses[j].write = isWriteable;
            }
        }

        collection.folders = newFolders;
        collection.requests = requests;

        collection.requests = this.orderRequests(collection.requests, collection.order);

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
                else {
                    element = pm.collections.getRequestById(order[j]);
                    if(element) {
                        orderedRequests.push(element);
                    }
                }
            }

            requests = orderedRequests;
        }

        return requests;
    },

    renderOneCollection:function (model, pmCollection) {
        var folders = [];
        var wasOpen = false;
        if(!model) {
            //console.log("Sidebar was not sent a proper collection");
            return;
        };

        var collection = _.clone(model.toJSON());

        collection = this.organizeRequestsInFolders(collection);

        $('#sidebar-section-collections .empty-message').css("display", "none");

        var currentEl = $("#collection-" + collection.id + " .sidebar-collection-head-dt");
        if (currentEl.length) {
            var currentClass = currentEl.attr("class");
            wasOpen = currentClass.search("open") >= 0;
        }

        this.renderCollectionContainerInSidebar(collection);
        this.renderFoldersInSidebar(collection);

        var requests = collection.requests;
        var targetElement = "#collection-requests-" + collection.id;

        this.renderRequestsInSidebar(targetElement, requests);

        if (wasOpen) {
            this.openCollection(collection.id, false);
        }
    },

    renderCollectionContainerInSidebar: function(collection) {
        var currentEl = $('#collection-' + collection.id);

        var collectionSidebarListPosition = -1;
        var insertionType;
        var insertTarget;

        var model = this.model;
        var view = this;
        var collections = this.model.toJSON();

        collectionSidebarListPosition = arrayObjectIndexOf(collections, collection.id, "id");

        if (currentEl.length) {
            if (collectionSidebarListPosition === 0) {
                if(collections[collectionSidebarListPosition + 1]) {
                    insertionType = "before";
                    insertTarget = $('#collection-' + collections[collectionSidebarListPosition + 1].id);
                }
                else {
                    insertionType = "none";
                }
            }
            else {
                insertionType = "after";
                insertTarget = $('#collection-' + collections[collectionSidebarListPosition - 1].id);
            }

            currentEl.remove();
        }
        else {
            //New element
            if (collectionSidebarListPosition === collections.length - 1) {
                insertionType = "append";
            }
            else {
                var nextCollectionId = collections[collectionSidebarListPosition + 1].id;
                insertTarget = $("#collection-" + nextCollectionId);

                if (insertTarget.length > 0) {
                    insertionType = "before";
                }
                else {
                    insertionType = "append";
                }
            }
        }

        if (insertionType) {
            if (insertionType === "after") {
                $(insertTarget).after(Handlebars.templates.item_collection_sidebar_head(collection));
            }
            else if (insertionType === "before") {
                $(insertTarget).before(Handlebars.templates.item_collection_sidebar_head(collection));
            }
            else {
                $("#collection-items").append(Handlebars.templates.item_collection_sidebar_head(collection));
            }
        } else {
            $("#collection-items").append(Handlebars.templates.item_collection_sidebar_head(collection));
        }

        if(collection.justSubscribed===true) {
            $("li#collection-"+collection.id+" .sidebar-collection-head-name").addClass("just-subscribed");
        }

        // TODO Need a better way to initialize these tooltips
        setTimeout(function() {
            $('#collection-items [rel="tooltip"]').tooltip();
        },500);

        if(collection.write!==false || collection.owner===pm.user.id) {
            $('#collection-' + collection.id + " .sidebar-collection-head").droppable({
                accept: ".sidebar-collection-request",
                hoverClass: "ui-state-hover",
                drop: _.bind(this.handleRequestDropOnCollection, this)
            });
        }
    },

    renderFoldersInSidebar: function(collection) {
        var folders;
        var targetElement;
        var folderContainer;
        var i;

        if("folders" in collection) {
            folders = collection["folders"];
            folders.sort(sortAlphabetical);
            var numFolders = folders.length;
            var fRequests,numFreuqest,j;
            for(var i=0;i<numFolders;i++) {
                fRequests = folders[i].requests;
                numFreuqest = fRequests.length;
            }

            folderContainer = "#folders-" + collection.id;
            $(folderContainer).append(Handlebars.templates.collection_sidebar_folders({"folders": folders}));

            if(collection.write!==false || collection.owner===pm.user.id) {
                $('#collection-' + collection.id + " .folder-head").droppable({
                    accept: ".sidebar-collection-request",
                    hoverClass: "ui-state-hover",
                    drop: _.bind(this.handleRequestDropOnFolder, this)
                });
            }

            for(i = 0; i < folders.length; i++) {
                targetElement = "#folder-requests-" + folders[i].id;
                this.renderRequestsInSidebar(targetElement, folders[i].requests);
            }
        }
    },

    renderRequestsInSidebar: function(targetElement, requests) {
        if (!requests) return;

        var view = this;

        var count = requests.length;
        var requestTargetElement;

        if (count > 0) {
            for (var i = 0; i < count; i++) {
                if (typeof requests[i].name === "undefined") {
                    requests[i].name = requests[i].url;
                }
                //requests[i].name = limitStringLineWidth(requests[i].name, 40);
                requestTargetElement = "#sidebar-request-" + requests[i].id;
                $(requestTargetElement).draggable({});
            }

            $(targetElement).html("");

            $(targetElement).append(Handlebars.templates.collection_sidebar_requests({"items":requests}));
            $(targetElement).sortable({
                axis: "y",
                delay: 150,
                update: _.bind(view.onUpdateSortableCollectionRequestList, view)
            });
        }
    },

    onUpdateSortableCollectionRequestList: function(event, ui) {
        //called only when REORDERING requests in a folder or a collection.
        //no trans collection/folder moves call his function

        //Hack to prevent sortable being called during a move
        console.error("Sortable called at : " + Date.now());
        if(pm.requestTransferInProgress) {
            return;
        }

        var pmCollection = this.model;
        var oldThis = this;
        var isInFolder = $(event.target).attr("class").search("folder-requests") >= 0;

        if(isInFolder) {
            var folder_id = $(event.target).attr("data-id");
            var target_parent = $(event.target).parent(".folder-requests");
            var target_parent_collection = $(event.target).parents(".sidebar-collection");
            var collection_id = $(target_parent_collection).attr("data-id");
            var ul_id = $(target_parent.context).attr("id");
            var collection_requests = $(target_parent.context).children("li");
            var count = collection_requests.length;
            var order = [];

            var existingRequests = pm.collections.getFolderById(folder_id).order;

            for (var i = 0; i < count; i++) {
                var thisRequestDiv = $(collection_requests[i]);
                if (!thisRequestDiv.hasClass("ui-sortable-placeholder")) {
                    var li_id = thisRequestDiv.attr("id");
                    var request_id = $("#" + li_id + " .request").attr("data-id");
                    //so that no new requests are added
                    if(existingRequests.indexOf(request_id)!==-1) {
                        order.push(request_id);
                    }
                }
            }
            //if there's anything in existing requests that's not there in order, add those too
            //offerings to jqueryUI
            order = order.concat(_.difference(existingRequests,order))

            pmCollection.updateFolderOrder(collection_id, folder_id, order, true);
        }
        else {
            var target_parent = $(event.target).parents(".sidebar-collection-requests");
            var target_parent_collection = $(event.target).parents(".sidebar-collection");
            var collection_id = $(target_parent_collection).attr("data-id");
            var ul_id = $(target_parent.context).attr("id");
            var collection_requests = $(target_parent.context).children("li");
            var count = collection_requests.length;
            var order = [];

            var existingRequests = pm.collections.getCollectionById(collection_id).get("order");

            for (var i = 0; i < count; i++) {
                var li_id = $(collection_requests[i]).attr("id");
                var request_id = $("#" + li_id + " .request").attr("data-id");
                //so that no new requests are added
                if(existingRequests.indexOf(request_id)!==-1) {
                    order.push(request_id);
                }
            }

            //if there's anything in existing requests that's not there in order, add those too
            //offerings to jqueryUI
            order = order.concat(_.difference(existingRequests,order));

            pmCollection.updateCollectionOrder(collection_id, order);
        }
        oldThis._updateSidebar();
    },

    updateCollectionMeta: function(collection) {
        var id = collection.get("id");

        var currentClass = $("#collection-" + id + " .sidebar-collection-head-dt").attr("class");
        var collectionHeadHtml = '<span class="sidebar-collection-head-dt"><span class="icon-dt"></span></span>';
        collectionHeadHtml += '\n<span class="sidebar-collection-head-cname">\n' + collection.get("name") + '\n</span>\n';

        //this else shouldn't be needed
        //you cannot be subscribed to a collection and have it shared
        if(collection.get("subscribed")===true) {
            collectionHeadHtml += '<span class="label label-info" rel="tooltip" data-original-title="You have subscribed to this collection" data-placement="bottom">Sub</span>';
            if(collection.get("sharedWithTeam")===true) {
                //fatal
                //inconsistent data
                //this probably means that sharedWithTeam is true for some odd reason. The collection is subscribed to by this use
                //pm.syncLogger.error("Collection " + id +" is both subscribed to and shared by this user. How?");
            }
        }
        else if(collection.get("sharedWithTeam")===true) {
            collectionHeadHtml += '<span class="label label-success" rel="tooltip" data-original-title="You have shared this collection" data-placement="bottom">Shared</span>';
        }

        $('#collection-' + collection.id + " .sidebar-collection-head-name").html(collectionHeadHtml);
        $('#select-collection option[value="' + collection.get("id") + '"]').html(collection.get("name"));

        if(currentClass.indexOf("open") >= 0) {
            $("#collection-" + id + " .sidebar-collection-head-dt").addClass("disclosure-triangle-open");
        }
        else {
            $("#collection-" + id + " .sidebar-collection-head-dt").addClass("disclosure-triangle-close");
        }
    },

    onAddFolder: function(collection, folder) {
        var folderContainer = $("#folders-" + collection.id);
        if(folderContainer.children("#folder-"+folder.id).length!=0) {
            //console.log("Folder with id: "+folder.id+" already exists. Not adding it to the UI again.");
            return;
        }

        folderContainer.append(Handlebars.templates.item_collection_folder(folder));
        if(collection.write!==false || collection.owner===pm.user.id) {
            $('#collection-' + collection.id + " .folder-head").droppable({
                accept: ".sidebar-collection-request",
                hoverClass: "ui-state-hover",
                drop: _.bind(this.handleRequestDropOnFolder, this)
            });
        }
        this._updateSidebar();
    },

    onUpdateFolder: function(collection, folder) {
        $("#folder-" + folder.id + " .folder-head-name .name").html(folder.name);
    },

    onDeleteFolder: function(collection, id) {
        $("#folder-" + id).remove();
    },

    onMoveRequestToFolder: function(oldLocation, targetCollection, folder, request, toSync, oldRequestId) {
        //console.log("Request being moved from a collection to a folder in the same OR different collection");
        //console.log("Transfer API call will be made here, if toSync is true. toSync="+toSync);
        if(!oldRequestId) {
            oldRequestId = request.id;
        }

        var toNewCollection = false;
        if(oldLocation.collection_id !== targetCollection.id) {
            toNewCollection = true;
        }
        if(toSync===true) {
            if(toNewCollection) {
                pm.syncManager.addChangeset("request","destroy",{id:oldRequestId, owner: oldLocation.owner}, null, true);
                pm.syncManager.addChangeset("request","create",request, null, true);
            }
            else {
                request.id = oldRequestId;
                pm.syncManager.addChangeset("request","transfer",
                    {
                        "to":
                        {
                            model:"folder",
                            model_id:folder.id,
                            owner: targetCollection.get("owner")
                        },
                        "from": oldLocation,
                        "owner": oldLocation.owner
                    }
                    , request.id, true);
            }
        }
        this.removeCollectionRequest(oldRequestId);
        var targetElement = $("#folder-requests-" + folder.id);
        this.addRequestToFolder(folder, request);
        this._updateSidebar();
    },

    onMoveRequestToCollection: function(oldLocation, targetCollection, request, toSync) {
        //console.log("Request being moved to a collection. Transfer API called if toSync is true. toSync="+toSync);
        var newRequestId = guid(); //only used if moved to a new collection
        var toNewCollection = false;
        if(oldLocation.collection_id !== targetCollection.id) {
            toNewCollection = true;
            request.id = guid();
        }

        if(toSync===true) {
            if(toNewCollection) {
                pm.syncLogger.error("Fatal - Moving to a new collection should not sync through this method");
            }
            else {
                pm.syncManager.addChangeset("request", "transfer", {
                        "to": {
                            model: "collection", model_id: targetCollection.id, owner: targetCollection.get("owner")
                        }, "from": oldLocation, "owner": oldLocation.owner
                    },
                    request.id, true);
            }
        }
        this.removeCollectionRequest(request.id);
        var targetElement = "#collection-requests-" + request.collectionId;
        this.addRequestToList(targetElement, request, targetCollection.order);
        this._updateSidebar();
    },

    onSortRequestContainer: function(type, containerId, orderArray) {
        var parentElem = $("#"+type+"-requests-"+containerId);
        this.sortRequestList(parentElem, orderArray);
    },

    /**
     * targetElement must be a <ul> containing <li id=sidebar-request-rid>
     * @param targetElement
     * @param orderArray
     */
    sortRequestList: function(targetElement, orderArray) {
        var li = targetElement.children("li");

        li.detach().sort(function(a,b) {
            var id_a = $(a).attr('id').split("request-")[1];
            var id_b = $(b).attr('id').split("request-")[1];
            return orderArray.indexOf(id_a)-orderArray.indexOf(id_b);
        });

        targetElement.append(li);
    },

    addRequestToList: function(targetElement, request, order) {
        var view = this;

        //Why is this here? The element isn't created till the Handlebars template is added
        //$('#sidebar-request-' + request.id).draggable({});

        if($('#sidebar-request-' + request.id).length!==0) {
            //console.log("Request with ID: "+request.id+" already exists. Not re-adding to the sidebar.")
            return;
        }

        if (typeof request.name === "undefined") {
            request.name = request.url;
        }

        $(targetElement).append(Handlebars.templates.item_collection_sidebar_request(request));

        request.isFromCollection = true;
        request.collectionRequestId = request.id;

        if(request.write!==false) {
            $(targetElement).sortable({
                axis: "y",
                delay: 150,
                update: _.bind(view.onUpdateSortableCollectionRequestList, view)
            });

            $('#collection-' + request.collectionId + " .sidebar-collection-heaad").droppable({
                accept: ".sidebar-collection-request",
                hoverClass: "ui-state-hover",
                drop: _.bind(this.handleRequestDropOnCollection, this)
            });
        }

        if(order instanceof Array && (order.indexOf(request.id)!==-1)) {
            this.sortRequestList($(targetElement), order);
        }
    },

    addRequestToFolder: function(folder, request) {
        var targetElement = "#folder-requests-" + folder.id;
        this.addRequestToList(targetElement, request, folder.order);
    },

    addCollectionRequest: function(request, openCollection, openRequest) {
        var targetElement = "#collection-requests-" + request.collectionId;

        $('.sidebar-collection-request').removeClass('sidebar-collection-request-active');
        $('#sidebar-request-' + request.id).addClass('sidebar-collection-request-active');

        this.addRequestToList(targetElement, request, []);

        clearTimeout(this.collectionSortTimers[request.collectionId]);
        this.collectionSortTimers[request.collectionId] = setTimeout(function(collectionId, sidebar) {
            return function() {
                clearTimeout(sidebar.collectionSortTimers[collectionId]);
                var order = pm.collections.getCollectionById(collectionId).get("order");
                //console.log("Ordering Collection " + collectionId + " with order: " + JSON.stringify(order));
                sidebar.onSortRequestContainer("collection", collectionId, order);
            }
        } (request.collectionId, this), 300);

        if(openCollection===true) {
            this.openCollection(request.collectionId);
        }
        if(openRequest !== false) {
            pm.mediator.trigger("loadRequest", request);
	    }
    },

    removeCollectionRequest: function(id) {
        $('#sidebar-request-' + id).remove();
    },

    updateCollectionRequest: function(request, noNotif) {
        if(typeof(noNotif)==='undefined') noNotif = false;

        var requestName;
        //requestName = limitStringLineWidth(request.name, 43);
        requestName = request.name;
        $('#sidebar-request-' + request.id + " .request .request-name").html(requestName);
        $('#sidebar-request-' + request.id + " .request .label").html(request.method);
            
        var labelClasses = ['GET', 'PUT', 'POST', 'DELETE'];

        for(var i = 0; i < labelClasses.length; i++) {
            $('#sidebar-request-' + request.id + " .request .label").removeClass('label-method-' + labelClasses[i]);    
        }        

        $('#sidebar-request-' + request.id + " .request .label").addClass('label-method-' + request.method);

        if(!noNotif) {
            noty({
            type:'success',
            text:'Saved request',
            layout:'topCenter',
            timeout:750
            });
        }
    },

    openCollection:function (id, toAnimate) {
        var target = "#collection-children-" + id;
        $("#collection-" + id + " .sidebar-collection-head-dt").removeClass("disclosure-triangle-close");
        $("#collection-" + id + " .sidebar-collection-head-dt").addClass("disclosure-triangle-open");

        if ($(target).css("display") === "none") {
            if(toAnimate === false) {
                $(target).css("display", "block");
            }
            else {
                $(target).slideDown(100, function () {
                });
            }
        }
    },

    toggleRequestList:function (id) {
        var target = "#collection-children-" + id;
        if ($(target).css("display") === "none") {
            $("#collection-" + id + " .sidebar-collection-head-dt").removeClass("disclosure-triangle-close");
            $("#collection-" + id + " .sidebar-collection-head-dt").addClass("disclosure-triangle-open");

            $(target).slideDown(100, function () {
            });
        }
        else {
            $("#collection-" + id + " .sidebar-collection-head-dt").removeClass("disclosure-triangle-open");
            $("#collection-" + id + " .sidebar-collection-head-dt").addClass("disclosure-triangle-close");
            $(target).slideUp(100, function () {
            });
        }
    },

    toggleSubRequestList: function(id) {
        var target = "#folder-requests-" + id;

        if ($(target).css("display") === "none") {
            $("#folder-" + id + " .folder-head-dt").removeClass("disclosure-triangle-close");
            $("#folder-" + id + " .folder-head-dt").addClass("disclosure-triangle-open");

            $(target).slideDown(100, function () {
            });
        }
        else {
            $("#folder-" + id + " .folder-head-dt").removeClass("disclosure-triangle-open");
            $("#folder-" + id + " .folder-head-dt").addClass("disclosure-triangle-close");
            $(target).slideUp(100, function () {
            });
        }
    },

    handleRequestDropOnCollection: function(event, ui) {
        var id = ui.draggable.context.id;
        var requestId = $('#' + id + ' .request').attr("data-id");
        var targetCollectionId = $($(event.target).find('.sidebar-collection-head-name')[0]).attr('data-id');
        this.model.moveRequestToCollection(requestId, targetCollectionId);
    },

    handleRequestDropOnFolder: function(event, ui) {
        var id = ui.draggable.context.id;
        var requestId = $('#' + id + ' .request').attr("data-id");
        var targetFolderId = $($(event.target).find('.folder-head-name')[0]).attr('data-id');        
        this.model.moveRequestToFolder(requestId, targetFolderId);
    },

    onFilter: function(filteredCollectionItems) {
        var collectionsCount = filteredCollectionItems.length;        

        for(var i = 0; i < collectionsCount; i++) {
            var c = filteredCollectionItems[i];
            var collectionDomId = "#collection-" + c.id;
            var collectionFoldersDomId = "#folders-" + c.id;
            var collectionChildrenDomId = "#collection-children-" + c.id;
            var dtDomId = "#collection-" + c.id + " .sidebar-collection-head-dt";

            if(c.toShow) {
                $(collectionDomId).css("display", "block");
                $(collectionChildrenDomId).css("display", "block");

                $(dtDomId).removeClass("disclosure-triangle-close");
                $(dtDomId).addClass("disclosure-triangle-open");

                var requests = c.requests;

                if(requests) {
                    var requestsCount = requests.length;
                    for(var j = 0; j < requestsCount; j++) {
                        var r = requests[j];
                        var requestDomId = "#sidebar-request-" + r.id;
                        if(r.toShow) {
                            $(requestDomId).css("display", "block");
                        }
                        else {
                            $(requestDomId).css("display", "none");
                        }
                    }
                }

                if("folders" in c) {
                    var folders = c["folders"];
                    for(var k = 0; k < folders.length; k++) {
                        var folderDomId = "#folder-" + folders[k].id;
                        var folderRequestsDomId = folderDomId + " .folder-requests";
                        var dtFolderDomId = folderDomId + " .folder-head .folder-head-dt";

                        if(folders[k].toShow) {
                            $(folderDomId).css("display", "block");
                            $(folderRequestsDomId).css("display", "block");
                            $(dtFolderDomId).removeClass("disclosure-triangle-close");
                            $(dtFolderDomId).addClass("disclosure-triangle-open");
                        }
                        else {
                            $(folderDomId).css("display", "none");
                            $(folderRequestsDomId).css("display", "none");
                            $(dtFolderDomId).addClass("disclosure-triangle-close");
                            $(dtFolderDomId).removeClass("disclosure-triangle-open");
                        }
                    }
                }
            }
            else {
                $(collectionDomId).css("display", "none");
                $(collectionChildrenDomId).css("display", "none");
                $(dtDomId).removeClass("disclosure-triangle-open");
                $(dtDomId).addClass("disclosure-triangle-close");
            }
        }
    },

    onRevertFilter: function() {
        $(".sidebar-collection").css("display", "block");
        $(".folder").css("display", "block");
        $(".sidebar-collection-request").css("display", "block");
    }
});