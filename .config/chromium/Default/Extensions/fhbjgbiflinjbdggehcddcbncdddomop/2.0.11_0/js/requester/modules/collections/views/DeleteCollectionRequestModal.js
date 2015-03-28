var DeleteCollectionRequestModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        model.on("deleteCollectionRequest", this.render, this);

        $('#modal-delete-collection-request-yes').on("click", function () {
            var id = $(this).attr('data-id');
            model.deleteCollectionRequest(id);
            $("#modal-delete-collection-request").modal('hide');
            pm.tracker.trackEvent("request", "delete");
        });

        $("#modal-delete-collection-request").on('keydown', function (event) {
            if (event.keyCode === 13) {
                pm.tracker.trackEvent("interaction", "shortcut", "delete_collection_request");
                var id=$("#modal-delete-collection-request-yes").attr('data-id');
                model.deleteCollectionRequest(id);
                $("#modal-delete-collection-request").modal('hide');
                event.preventDefault();
                pm.tracker.trackEvent("request", "delete");
                return false;
            }
        });
    },

    render: function(request) {
        try {
            $('#modal-delete-collection-request-yes').attr('data-id', request.id);
            $('#modal-delete-collection-request-name').html(request.name);
            $('#modal-delete-collection-request').modal('show');
        }
        catch(e) {
            throw "DeleteCollection Modal shown with null request. Request: " + JSON.stringify(request);
        }
    }
});
