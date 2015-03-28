var UserUnsyncedDataDeleteModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model; 
        
        pm.mediator.on("showUnsyncedDeletetionModal", this.showModal, this);

        $('#modal-unsynced-delete-yes').on("click", function () {
            pm.mediator.trigger("deleteUnsyncedData");
            $("#modal-unsynced-delete").modal('hide');
        });
    },

    showModal: function() {
        $("#modal-unsynced-delete").modal('show');
    }
});
