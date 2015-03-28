var DeleteCollectionModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        $('#modal-delete-collection-yes').on("click", function () {
            var id = $(this).attr('data-id');
            var shared = $(this).attr('data-shared');
            if(shared==="true" && pm.user.id!=="0") {
                model.unshareCollection(id);
            }
            model.deleteCollection(id);
            $("#modal-delete-collection").modal('hide');
            pm.tracker.trackEvent("collection", "delete");
        });

        $("#modal-delete-collection").on("shown", function () {
            pm.app.trigger("modalOpen", "#modal-delete-collection");
        });

        $("#modal-delete-collection").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $("#modal-delete-collection").on('keydown', function (event) {
            if (event.keyCode === 13) {
                pm.tracker.trackEvent("interaction", "shortcut", "delete_collection");
                var id=$("#modal-delete-collection-yes").attr('data-id');
                var shared = $(this).attr('data-shared');
                if(shared===true) {
                    model.unshareCollection(id);
                }
                model.deleteCollection(id);
                $("#modal-delete-collection").modal('hide');
                pm.tracker.trackEvent("collection", "delete");
                event.preventDefault();
                return false;
            }
        });
    },

    render: function() {

    }
});
