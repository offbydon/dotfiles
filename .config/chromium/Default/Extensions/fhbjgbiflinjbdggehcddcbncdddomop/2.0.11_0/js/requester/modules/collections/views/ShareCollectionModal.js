var ShareCollectionModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        if (pm.features.isFeatureEnabled(FEATURES.DIRECTORY)) {
            $("share-collection-directory-features").css("display", "block");
        }

        $("#share-collection-readonly").on("change", function() {
            var isWriteable = !($("#share-collection-readonly").is(":checked"));
            var id = $(this).attr('data-collection-id');
            model.updateCollectionWrite(id,isWriteable);
        });

        $('#share-collection-get-link').on("click", function () {
            var id = $(this).attr('data-collection-id');
            var isChecked = $("#share-collection-is-public").is(":checked");


            //var isTeamShareChecked = $("#share-collection-team").is(":checked");
            var collection = model.get(id);

            var isTeamShareChecked = !(collection.get("sharedWithTeam")===true);

            model.uploadCollection(id, isChecked, isTeamShareChecked, true, function (link) {
                //$('#share-collection-link').css("display", "block");
                //$('#share-collection-link').html(link);
                //$('#copy-collection-url').show();
                //don't do anything with the URLs
            });

            //only team-sharing allowed
            if(isTeamShareChecked) {
                $("#share-collection-get-link").html("Unshare");
            }
            else {
                $("#share-collection-get-link").html("Share");
            }
        });

        $('#upload-collection-get-link').on("click", function () {
            var id = $(this).attr('data-collection-id');
            var isChecked = $("#share-collection-is-public").is(":checked");

            //var isTeamShareChecked = $("#share-collection-team").is(":checked");
            var collection = model.get(id);


            model.uploadAndGetLinkForCollection(id, false, function (link) {
                $('#upload-collection-link').css("display", "block");
                $('#upload-collection-link').html(link);
                $('#copy-collection-url').show();
            });
        });

        $('#share-collection-download').on("click", function () {
            var id = $(this).attr('data-collection-id');
            model.saveCollection(id);
        });

        $("#modal-share-collection").on("shown", function () {
            pm.app.trigger("modalOpen", "#modal-share-collection");
        });

        $("#modal-share-collection").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $("#copy-collection-url").click(function() {
            copyToClipboard($('#upload-collection-link').html());
        });

        $("#share-collection-unsubscribe").click(function() {
            var id = $(this).attr('data-collection-id');
            var owner = $(this).attr('data-owner-id');

            var collectionMeta = {
                owner: owner,
                model_id: id
            };

            pm.syncManager.addChangeset("collection", "unsubscribe", {owner: collectionMeta.owner}, collectionMeta.model_id, true);
            var status = pm.collections.deleteCollectionFromDataStoreWithOptSync(collectionMeta.model_id, true, false, function() {});
        });

        model.on("shareCollectionModal", this.show, this);
    },

    show: function(id) {
        var collection = this.model.get(id);

        $("#modal-share-collection").modal("show");

        $('#share-collection-get-link').attr("data-collection-id", id);
        $('#upload-collection-get-link').attr("data-collection-id", id);
        $('#share-collection-download').attr("data-collection-id", id);
        $('#copy-collection-url').hide();
        $('#share-collection-link').css("display", "none");

        if (pm.user.isLoggedIn()) {
            if(collection.get("subscribed") === true) {
                //someone elses collection
                //Can only Unsubscribe
                $("#share-collection-unsubscribe").attr("data-collection-id", id);
                $("#share-collection-unsubscribe").attr("data-owner-id", collection.get("owner"));
                $("#shareOwnCollection").hide();
                $("#shareSubscribedCollection").show();
            }
            else {
                //my own collection
                //if (collection.get("remote_id") !== 0) {
                    //already uploaded - may or may not be publicly shared
                    //$('#share-collection-get-link').html("Update");
                if(collection.get("sharedWithTeam") === true) {
                    $("#share-collection-get-link").html("Unshare");
                }
                else {
                    $("#share-collection-get-link").html("Share");
                }
                $('#upload-collection-link').html(collection.get("remoteLink")).show();
                $('#copy-collection-url').show();
                //}
                //else {
                //    $('#share-collection-get-link').html("Share");
                //    $('#share-collection-link').hide();
                //}
                //only show this if the user belongs to a team
                var orgs = pm.user.get("organizations");
                if(orgs.length > 0) {
                    $("#share-collection-is-public").prop('checked', collection.get("public") === true);
                    $("#share-collection-team").prop('checked', collection.get("sharedWithTeam") === true);
                    $("#share-collection-readonly").prop('checked', collection.get("write") != true)
                        .attr("data-collection-id", id);
                    $("#shareOwnCollection").hide(); //HIDE TEAM SHARING FOR NOW!!
                }
                else {
                    $("#shareOwnCollection").hide();
                }
                $("#shareSubscribedCollection").hide();
            }
        }
        else {
            $('#share-collection-directory-features').css("display", "none");
            $('#share-collection-get-link').html("Upload");
            $("#shareOwnCollection").hide(); //HIDE TEAM SHARING FOR NOW!!
            $("#uploadOwnCollection").show();
            $("#shareSubscribedCollection").hide();
        }

        //set public link
        if (collection.get("remote_id") !== 0 && collection.get("remoteLink")) {
            $('#upload-collection-get-link').html("Update");
            $('#upload-collection-link').html(collection.get("remoteLink")).show();
            $('#copy-collection-url').show();
        }
        else {
            $('#upload-collection-get-link').html("Upload and get link");
            $('#upload-collection-link').hide();
            $('#copy-collection-url').show();
        }

        $("#shareOwnCollection").hide(); //HIDE TEAM SHARE LINK FOR NOW!
    },

    render: function() {

    }
});
