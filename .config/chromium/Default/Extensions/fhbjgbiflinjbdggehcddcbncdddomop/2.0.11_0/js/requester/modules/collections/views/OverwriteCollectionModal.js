var OverwriteCollectionModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        model.on("overwriteCollectionChoice", this.render, this);

        $("#modal-overwrite-collection-duplicate").on("click", function() {
            var originalCollectionId = model.originalCollectionId;
            var toBeImportedCollection = model.toBeImportedCollection;
            //toBeImportedCollection.id = guid();
            toBeImportedCollection.name = toBeImportedCollection.name + " copy";
            model.setNewCollectionId(toBeImportedCollection);
            model.changeFolderAndRequestIds(toBeImportedCollection);  //and response IDs
            model.overwriteCollection(toBeImportedCollection);
        });

        $("#modal-overwrite-collection-overwrite").on("click", function() {
            var originalCollectionId = model.originalCollectionId;
            var toBeImportedCollection = model.toBeImportedCollection;

            //NO!delete the old collection from the sync server
            //pm.syncManager.addChangeset("collection","destroy",{id:toBeImportedCollection.id}, null, true);

            //always set a new ID while importing
            //using the same ID will wreak havoc in multi-user environments
            model.setNewCollectionId(toBeImportedCollection);
            model.changeFolderAndRequestIds(toBeImportedCollection); //and response IDs
            model.overwriteCollection(toBeImportedCollection);
        });

    },

    render: function(collection) {
        var originalCollectionId = this.model.originalCollectionId;
        $("#existingCollectionName").html(this.model.getCollectionById(originalCollectionId).get("name"));
        $("#modal-overwrite-collection").modal("show");
    }
});
