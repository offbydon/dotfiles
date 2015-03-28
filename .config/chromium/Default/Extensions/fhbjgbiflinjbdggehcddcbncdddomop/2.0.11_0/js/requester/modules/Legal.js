var Legal = Backbone.Model.extend({
	initialize: function() {
		var eulaUrls = {
			//syncEula: postman_web_url + "/licenses/postman_sync_addendum",
			syncTerms: postman_web_url + "/privacy",
			syncEulas: postman_web_url + "/privacy#using-postman",
			syncDocs:  postman_web_url + "/docs/sync_overview"
			//baseEula: postman_web_url + "/licenses/postman_base_app",
			//jetpacksEula: postman_web_url + "/licenses/postman_jetpacks_addendum"
		};

		pm.mediator.on("showSyncInvitePopup", function() {
			$("#modal-eula-notif .modal-body").html(Handlebars.templates["sync_eula"](eulaUrls));
			$("#modal-eula-notif").modal("show");
			pm.app.trigger("modalOpen", "#modal-eula-notif");
			pm.settings.setSetting("syncInviteShown", true);
		});

		//pm.mediator.on("showBaseEula", function() {
		//	console.log("Showing base eula");
		//	pm.app.trigger("modalOpen", "#modal-eula-notif");
		//	$("#modal-eula-notif .modal-body").html("").append(Handlebars.templates["base_eula"](eulaUrls));
		//	$("#modal-eula-notif").modal('show');
		//});

		$("body").on("click", "#sync-eula-accept", function() {
			pm.settings.setSetting("enableSync", true);
			pm.mediator.trigger("setSync",true);
			pm.user.setSyncEnabled(true);
			pm.mediator.trigger("showEnableSyncButton");

			pm.api.acceptSyncEula(pm.user.get("id"), pm.user.get("access_token"), function() {
				//$("#user-my-collections").hide();
				pm.syncManager.signIn();
			});
			$("#modal-eula-notif .modal-body").html("");
			pm.app.trigger("modalClose");
			$("#modal-eula-notif").modal("hide");
			pm.tracker.forceTrackEvent("sync", "enable");
		});

		$("body").on("click", "#sync-eula-reject", function() {
			//close modal
			//cannot use sync yet
			$("#modal-eula-notif .modal-body").html("");
			$("#modal-eula-notif").modal("hide");
			pm.app.trigger("modalClose");
			pm.user.setSyncEnabled(false);
			pm.settings.setSetting("enableSync", false);
			pm.mediator.trigger("setSync",false);
			pm.mediator.trigger("showEnableSyncButton");
			pm.tracker.forceTrackEvent("sync", "reject");
		});

		$("body").on("click", "#sync-eula-link", function() {
			pm.tracker.forceTrackEvent("sync", "view", "eula");
		});

		$("body").on("click", "#sync-toc-link", function() {
			pm.tracker.forceTrackEvent("sync", "view", "toc");
		});

		$("body").on("click", "#sync-docs-link", function() {
			pm.tracker.forceTrackEvent("sync", "view", "documentation");
		});



		//$("body").on("click", "#base-eula-accept", function() {
		//	pm.settings.setSetting("baseEulaAccepted", true);
		//	pm.user.setBaseEulaAccepted(true);
		//	pm.api.acceptBaseEula(pm.user.get("id"), pm.user.get("access_token"), function() {
		//		console.log("Base eula accepted");
		//	});
		//	$("#modal-eula-notif .modal-body").html("");
		//	pm.app.trigger("modalClose");
		//	$("#modal-eula-notif").modal("hide");
		//});
	}
});
