var TeamDirectoryCollectionViewer = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        $("#team-directory-collection-viewer").on("click", ".btn-primary", function() {
        	var link_id = $(this).attr("data-link-id");
        	pm.mediator.trigger("getTeamDirectoryCollection", link_id);
        });
    },

    showCollection: function(collection) {
    	$("#team-directory-collection-viewer-name").html(collection.get("name"));
        $("#team-directory-collection-viewer-user-name").html(collection.get("user_name"));
        if(!collection.get("description")) {
            collection.set("description", "");
        }
    	$("#team-directory-collection-viewer-description").html(markdown.toHTML(collection.get("description")));
    	$("#team-directory-collection-viewer-updated-at").html("Last updated: " + collection.get("updated_at_formatted"));
    	$("#directory-collection-viewer-download").attr("data-id", collection.get("id"));
    	$("#directory-collection-viewer-download").attr("data-link-id", collection.get("link_id"));

    	$("#directory-collection-viewer").modal("show");
    }
});