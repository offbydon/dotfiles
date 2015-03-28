var DeleteFolderModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        $('#modal-delete-folder-yes').on("click", function () {
            var id = $(this).attr('data-id');
            model.deleteFolder(id, true);
            pm.tracker.trackEvent("folder", "delete");
        });

        $("#modal-delete-folder").on("shown", function () {
            pm.app.trigger("modalOpen", "#modal-delete-folder");
        });

        $("#modal-delete-folder").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $("#modal-delete-folder").on('keydown', function (event) {
            if (event.keyCode === 13) {
                pm.tracker.trackEvent("interaction", "shortcut", "delete_folder");
                var id=$("#modal-delete-folder-yes").attr('data-id');
                model.deleteFolder(id, true);
                $("#modal-delete-folder").modal('hide');
                event.preventDefault();
                pm.tracker.trackEvent("folder", "delete");
                return false;
            }
        });
    },

    render: function() {

    }
});
