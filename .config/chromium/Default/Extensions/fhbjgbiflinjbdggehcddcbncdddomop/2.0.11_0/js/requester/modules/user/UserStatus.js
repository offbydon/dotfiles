var UserStatus = Backbone.View.extend({
	initialize: function() {
		var view = this;
		var model = this.model;

		model.on("login", this.render, this);
		model.on("onLogout", this.render, this);

		$("#user-status-shared-collections").on("click", function() {
			$("#modal-user-collections").modal("show");
			pm.tracker.trackEvent("account", "my_collections");
			return false;
		});

		$("#user-status-not-logged-in").on("click", function() {
			$("#user-status-not-logged-in").html("Loading...");
			model.login();
			return false;
		});

		$("#user-status-manage-profile").on("click", function() {
			view.openProfile();
			pm.tracker.trackEvent("account", "manage_profile");
			return false;
		});


		$("#user-status-logout").on("click", function() {
			//$("#user-status-not-logged-in").html("Log in");
			//model.logout();
			model.trigger("logout", {message: "Manual logout"});
			return false;
		});

		this.render();

	},

	openProfile: function() {
		var url = pm.webUrl + '/signin-client';		
		url += "?user_id=" + pm.user.get("id");
    	url += "&access_token=" + pm.user.get("access_token");
    	window.open(url);
	},

	render: function() {
		// console.log("UserStatus change triggered", this.model.get("id"));

		if (pm.features.isFeatureEnabled(FEATURES.USER)) {
			$("#user-status").css("display", "block");
		}

		var id = this.model.get("id");
		var name = this.model.get("name");
        var expiredToken = this.model.get("expiredToken");

		$("#user-status-not-logged-in").tooltip();

		if (id !== 0 && expiredToken === false) {
			$("#user-status-false").css("display", "none");
			$("#user-status-true").css("display", "block");
			$("#user-status-username").html(name);

			//$("#team-directory-opener").show();
			$("#share-collection-team-directory-features").show();

		}
		else {
			$("#user-status-not-logged-in").html("Sign in");
			$("#user-status-false").css("display", "block");
			$("#user-status-true").css("display", "none");
			$("#user-status-username").html("");

			//$("#team-directory-opener").hide();
			$("#share-collection-team-directory-features").hide();

		}
	}
});