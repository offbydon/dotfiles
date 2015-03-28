var UserSyncDataDeleteModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model; 
        
        model.on("logout", this.onLogout, this);

        $('#modal-syncdata-delete-yes').on("click", function () {
            pm.mediator.trigger("deleteSyncedData");
            $("#request-actions-reset").click();
            model.logout();
            $("#modal-syncdata-delete").modal('hide');
        });

        $('#modal-syncdata-delete-no').on("click", function () {
            //do not sign out
            //pm.mediator.trigger("checkForUnsyncedChangesBeforeLogout");
            $("#modal-syncdata-delete").modal('hide');
        });
    },

    onLogout: function(obj) {
        if(!this.model.get("syncEnabled")) {
            //sync is not enabled. do normal logout
            this.model.logout();
        }
        else if(obj.message === "Manual logout") {
            var currentUnsynced = pm.localChanges.get("unsyncedChanges");
            var warning = "";
            if (currentUnsynced && currentUnsynced.length > 0) {
                warning = "You currently have unsynced changes. If you choose to delete your data, these changes will be lost";
            }

            $("#modal-syncdata-warning").html(warning);
            $("#modal-syncdata-delete").modal('show');
        }
    }
});
