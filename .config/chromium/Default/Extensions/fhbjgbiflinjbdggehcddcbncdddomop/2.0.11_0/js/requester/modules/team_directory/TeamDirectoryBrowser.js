var TeamDirectoryBrowser = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        this.directoryCollectionViewer = new TeamDirectoryCollectionViewer({model: this.model});

        model.on("add", this.addDirectoryCollection, this);
        model.on("loading", this.showLoadingText, this);
        model.on("remove", this.removeDirectoryCollection, this);
        model.on("reset", this.render, this);

        model.on("subscribedTo", this.onSubscribedTo, this);
        model.on("unsubscribedFrom", this.onUnsubscribedFrom, this);

        pm.mediator.on("isTeamMember", this.showTeamLink, this);

        $(".team-directory-browser-header").on("click", function() {
            //model.reload();
        });

        $("#team-directory-collections").on("click", ".directory-collection-action-view", function() {
            var id = $(this).attr("data-id");
            var collection = model.get(id);
            view.directoryCollectionViewer.showCollection(collection);
        });

        $("#team-directory-collections").on("click", ".team-directory-collection-action-subscribe", function() {
            var collectionId = $(this).attr("data-id");
            var ownerId = $(this).attr("data-owner-id");
            var thisElem = $(this);
            model.subscribeToCollection(collectionId, ownerId);
            $(this).html("Subscribing...").attr('disabled','disabled');
        });

        $("#team-directory-collections").on("click", ".team-directory-collection-action-unsubscribe", function() {
            var collectionId = $(this).attr("data-id");
            var ownerId = $(this).attr("data-owner-id");
            $(this).html("Unubscribing...").attr('disabled','disabled');
            model.unsubscribeFromCollection(collectionId, ownerId);
        });

        $(".team-directory-browser-navigator-next").on("click", function() {
            if(!$(this).hasClass("disabled")) {
                model.loadNext();
            }
        });

        $(".team-directory-browser-navigator-previous").on("click", function() {
            if(!$(this).hasClass("disabled")) {
                model.loadPrevious();
            }
        });


        window.onresize=function(){
            $("#team-directory-browser").css('max-height',(window.innerHeight-80)+"px");
        };
        $("#team-directory-browser").css('max-height',(window.innerHeight-80)+"px");

    },

    render: function() {
        $("#team-directory-collections tbody").html("");
    },

    renderNavigator: function() {
        var model = this.model;
        var startId = model.startId;
        var length = model.length;

        if (model.lastCount < model.fetchCount) {
            // Disable next
            $(".directory-browser-navigator-next").removeClass("enabled");
            $(".directory-browser-navigator-next").addClass("disabled");
        }
        else {
            $(".directory-browser-navigator-next").removeClass("disabled");
            $(".directory-browser-navigator-next").addClass("enabled");
        }

        if (model.totalCount <= model.fetchCount) {
            $(".directory-browser-navigator-previous").removeClass("enabled");
            $(".directory-browser-navigator-previous").addClass("disabled");
        }
        else {
            $(".directory-browser-navigator-previous").removeClass("disabled");
            $(".directory-browser-navigator-previous").addClass("enabled");
        }

        var start = model.totalCount - model.lastCount + 1;

        if (start < 0) {
            start = 1;
        }

        var end = model.totalCount;

        $(".directory-browser-navigator-status .start").html(start);
        $(".directory-browser-navigator-status .end").html(end);
    },

    showTeamLink: function(isMember) {
        if(isMember) {
            $("#team-directory-opener").show();
        }
        else {
            $("#team-directory-opener").hide();
        }
    },

    showLoadingText: function() {
        $("#team-dir-loading").remove();
        $("#team-directory-collections").before('<h4 style="text-align: center" id="team-dir-loading"><span class="label label-important">Loading team collections...</span></h4>');
    },

    addDirectoryCollection: function(collection) {
        this.renderNavigator();
        var c = _.clone(collection.toJSON());
        if(!c.description) {
            c.description = "";
        }

        $("#team-dir-loading").remove();
        c.updated_at_formatted = $.timeago(c.updatedAt);
        $("#team-directory-collections tbody").append(Handlebars.templates.item_team_directory_collection(c));
    },

    removeDirectoryCollection: function(collection) {
        this.renderNavigator();
    },

    onSubscribedTo: function(collectionId) {
        var parentContainer = $("#team-directory-collection-"+collectionId);
        parentContainer.find(".team-directory-collection-action-subscribe")
            .removeClass("team-directory-collection-action-subscribe").removeClass("btn-primary")
            .addClass("team-directory-collection-action-unsubscribe").addClass("btn-danger")
            .html("Unsubscribe").removeAttr('disabled');
    },

    onUnsubscribedFrom: function(collectionId) {
        var parentContainer = $("#team-directory-collection-"+collectionId);
        parentContainer.find(".team-directory-collection-action-unsubscribe")
            .removeClass("team-directory-collection-action-unsubscribe").removeClass("btn-danger")
            .addClass("team-directory-collection-action-subscribe").addClass("btn-primary")
            .html("Subscribe").removeAttr('disabled');
    }
});