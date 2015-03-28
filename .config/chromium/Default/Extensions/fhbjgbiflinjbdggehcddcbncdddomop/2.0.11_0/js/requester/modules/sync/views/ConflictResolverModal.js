var ConflictResolverModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;
        this.clearTable();

        $("#reSyncConflicts").click(function() {
            var radiosToUse = $("#confictResolverTable input[type='radio']:checked");
            //pm.syncManager.resolveConflicts(radiosToUse);
	        pm.mediator.trigger("conflictsResolved", radiosToUse);
            $("#modal-conflict-resolver").modal('hide');
        });

    },

    clearTable: function() {
        $("#confictResolverTable>tbody").html("");
    },

    addRow: function(conflictRow) {
        //delete all old rows with the same id
        $("tr#conflictRow-"+conflictRow.model+"-"+conflictRow.model_id+"-"+conflictRow.key).remove();

        $("#confictResolverTable>tbody").append(Handlebars.templates.conflict_resolver_row(conflictRow));
        $("#"+conflictRow.model+"-"+conflictRow.model_id+"-"+conflictRow.key+"-server").data("change", _.cloneDeep(conflictRow.remoteChange));
        $("#"+conflictRow.model+"-"+conflictRow.model_id+"-"+conflictRow.key+"-local").data("change", _.cloneDeep(conflictRow.localChange));

        if(conflictRow.showRow === false) {
            $("tr#conflictRow-"+conflictRow.model+"-"+conflictRow.model_id+"-"+conflictRow.key).hide();
        }
    },

    getCount: function() {
        return $("tr.conflictRow").length;
    },

    showModal: function() {
        $("#modal-conflict-resolver").modal();
    },

    initializeEditor: function() {
        if (this.editor) {
            return;
        }
    }
});
