var AppUpdateNotifier = Backbone.Model.extend({
	initialize: function() {
		pm.mediator.on("showVersionNotice", this.showVersionNotice, this);
		pm.mediator.on("notifyVersionUpdate", this.notifyVersionUpdate, this);

		console.log("Checking for update notifications...");

		chrome.storage.local.get("lastKnownVersion", function (results) {
			var currentVersion = chrome.runtime.getManifest()["version"];
			if (!results.lastKnownVersion) {
				results.lastKnownVersion = "blank";
			}
			if (results.lastKnownVersion) {
				var lastVersion = results.lastKnownVersion;
				console.log("Stored version: " + lastVersion+", currentVersion: "+currentVersion);
				if (lastVersion !== currentVersion) {
					setTimeout(function() {
						pm.mediator.trigger("showVersionNotice", currentVersion);
						pm.mediator.trigger("notifyVersionUpdate");
					},2500);

                    //resync if anyone is upgrading from 2.0.7
                    if(lastVersion === "2.0.7") {
                        setTimeout(function() {
                            pm.mediator.trigger("syncAllRequestsFix");
                        },5000);
                    }
				}
			}
			chrome.storage.local.set({"lastKnownVersion": currentVersion});
		});
	},

	notifyVersionUpdate: function() {
		var currentVersion = chrome.runtime.getManifest()["version"];
		pm.api.notifyServerOfVersionChange(currentVersion + "");
	},

	showVersionNotice: function(version) {
		//version should be of the form "1.0.0.1"
		var processedVersion = version.replace(/\./g, "-");
		var templateName = "version_"+processedVersion;
		if(Handlebars.templates.hasOwnProperty(templateName)) {
			console.log("Showing notification for "+templateName);
			$("#modal-update-notif .modal-body").html("").append(Handlebars.templates[templateName]());
			$("#modal-update-notif").modal("show");
		}
	}
});