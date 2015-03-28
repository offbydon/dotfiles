var SyncStatusNotif = Backbone.View.extend({

	initialize: function() {
		var model = this.model;
		var view = this;

		model.on("change:loggedIn", this.onChangeStatus, this);
        model.on("syncFinished", this.makeInSync, this);
        model.on("syncStarting", this.makeSyncing, this);
		pm.mediator.on("setSync", this.setSync, this);

		this.$icon = $("#sync-status-icon");
		this.$text = $("#sync-status-text");
	},

	setSync: function(syncEnabled) {
		if(syncEnabled) {
			$("#sync-status").show();
		}
		else {
			$("#sync-status").hide();
		}
	},

	onChangeStatus: function() {
		if(this.model.get("loggedIn")===true) {
            if(this.model.get("syncFinished")===true) {
			    this.makeInSync();
            }
            else {
                this.makeSyncing();
            }
		}
		else {
			this.makeNotInSync();
		}
	},

	makeInSync: function() {
		this.$icon.removeClass("notInSync").removeClass("syncing").addClass("inSync");
		this.$text.html("In Sync");
	},

    makeNotInSync: function() {
        this.$icon.removeClass("inSync").removeClass("syncing").addClass("notInSync");
        this.$text.html("Not in sync");
    },

    makeSyncing: function() {
        this.$icon.removeClass("inSync").addClass("syncing").removeClass("notInSync");
        this.$text.html("Syncing...");
    }
});