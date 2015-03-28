var SyncStatusSidebar = Backbone.View.extend({

    initialize: function() {
        var model = this.model;
        var view = this;

        model.on("notificationAdded", this.addNewNotif, this);
	    model.on("removeOldestNotif", this.removeOldestNotif, this);
	    model.on("updateNotifs", this.updateNotifs, this);
	    model.on("removeAllNotifs", this.removeAllNotifs, this);

	    var $shownNotifs = $('#syncstatus-items');

	    $shownNotifs.html("");
    },

	addNewNotif: function(notif) {
		var sidebar = $('#syncstatus-items');
		sidebar.prepend(Handlebars.templates.syncstatus_item(notif));
	},

	updateNotifs: function(notifs) {
		var sidebar = $('#syncstatus-items');
		sidebar.html("");
		var len = notifs.length;
		for(var i=0;i<len;i++) {
			sidebar.prepend(Handlebars.templates.syncstatus_item(notifs[i]));
		}
	},

	removeOldestNotif: function() {
		var sidebar = $('#syncstatus-items');
		sidebar.children().last().remove();
	},

	removeAllNotifs: function() {
		var sidebar = $('#syncstatus-items');
		sidebar.children().remove();
	}
});