var User = Backbone.Model.extend({
	defaults: function() {
		return {
			"id": 0,
			"name": "",
			"access_token": "",
			"refresh_token": "",
			"expires_in": 0,
			"logged_in_at": 0,
			"link": "",
			"expiredToken": true,
			"collections": [],
			"organizations": [],

			"syncEnabled": false,
			"syncInvited": false,
			"baseEulaAccepted": false
		};
	},

	setDefaults: function() {
		this.set("id", 0);
		this.set("name", "");
		this.set("access_token", "");
		this.set("refresh_token", "");
		this.set("expires_in", 0);
		this.set("link", "");

		this.set("baseEulaAccepted", false);
		this.set("syncEnabled", false);
		this.set("syncInvited", false);

		if (pm.features.isFeatureEnabled(FEATURES.USER)) {
			pm.storage.setValue({"user": this.toJSON()}, function() {
			});
		}
	},

	initialize: function() {
		var model = this;

		pm.storage.getValue("user", function(u) {
			if (u) {
				model.set("id", u.id);
				model.set("name", u.name);
				model.set("access_token", u.access_token);
				model.set("refresh_token", u.refresh_token);
				model.set("syncInvited", u.syncInvited);
				model.set("syncEnabled", u.syncEnabled);
				model.set("baseEulaAccepted", u.baseEulaAccepted);

				var expires_in = parseInt(u.expires_in, 10);

				model.set("expires_in", expires_in);
				model.set("logged_in_at", u.logged_in_at);

				var isTokenValid = model.isTokenValid();

				if(!isTokenValid) {
					model.set("expiredToken",true);
				}
				else {
					model.set("expiredToken",false);
				}

				//model.set("syncEnabled", pm.settings.getSetting("enableSync"));
				//pm.mediator.trigger("setSync",model.get("syncEnabled"));

				if (pm.features.isFeatureEnabled(FEATURES.USER)) {
					if (u.id !== 0) {
						//always refresh token on login (to check for sync)
						isTokenValid = false;
						
						if(!isTokenValid) {
							pm.api.exchangeRefreshToken(function() {
								model.set("expiredToken",false);
								model.getCollections(function(){
									model.getPurchases();
									model.getOrganizations();
									model.setupSync();
									model.checkBaseEula();
								});
								model.trigger("login", model);
							});
						}
						else {
							model.getCollections(function(){
								model.getPurchases();
								model.getOrganizations();
								model.setupSync();
								model.checkBaseEula();
							});
							model.trigger("login", model);
						}
					}
				}
			}
		});

		pm.mediator.on("receiveTokenFromPurchaseFlow", this.receiveTokenFromPurchaseFlow, this);
		pm.mediator.on("refreshSharedCollections", this.getCollections, this);
		pm.mediator.on("downloadSharedCollection", this.onDownloadSharedCollection, this);
		pm.mediator.on("deleteSharedCollection", this.onDeleteSharedCollection, this);
		pm.mediator.on("invalidAccessToken", this.onTokenNotValid, this);
		pm.mediator.on("downloadAllSharedCollections", this.onDownloadAllSharedCollections, this);

		pm.mediator.on("onMessageExternal", function(request, sender, sendResponse) {
			if (request) {
				if (request.postmanMessage) {
					if (request.postmanMessage.type === "token") {
						pm.mediator.trigger("receiveTokenFromPurchaseFlow", request.postmanMessage.token);
						sendResponse({"result":"success"});
					}
				}
			}
		});
	},

	isTokenValid: function() {
		var expiresIn = this.get("expires_in");
		var loggedInAt = this.get("logged_in_at");

		var now = new Date().getTime();

		if (loggedInAt + expiresIn > now) {
			return true;
		}
		else {
			return false;
		}
	},

	onTokenNotValid: function() {
		// Indicate error
	},

	isLoggedIn: function() {
		return (this.get("id") !== 0 && this.get("expiredToken") !== true);
	},

	setAccessToken: function(data) {
		var model = this;

		var expires_in = parseInt(data.expires_in, 10);

		model.set("access_token", data.access_token);
		model.set("refresh_token", data.refresh_token);
		model.set("expires_in", expires_in);
		model.set("logged_in_at", new Date().getTime());
		model.set("expiredToken",false);

		model.set("syncInvited", data.syncInvited==1);
		model.set("syncEnabled", data.syncEnabled==1);
		pm.mediator.trigger("setSync",model.get("syncEnabled"));

		model.set("baseEulaAccepted", data.baseEulaAccepted==1);

		pm.storage.setValue({"user": model.toJSON()}, function() {
		});
	},

	setSyncEnabled: function(syncEnabled) {
		var model = this;
		model.set("syncEnabled", syncEnabled);
		pm.storage.setValue({"user": model.toJSON()}, function() {
		});
	},

	setBaseEulaAccepted: function(bea) {
		var model = this;
		model.set("baseEulaAccepted", bea);
		pm.storage.setValue({"user": model.toJSON()}, function() {
		});
	},

	getRemoteIdForCollection: function(id) {
		var collections = this.get("collections");
		var index = arrayObjectIndexOf(collections, id, "id");

		if (index >= 0) {
			return collections[index].remote_id;
		}
		else {
			return 0;
		}
	},

	login: function() {
		var model = this;
		var appId = chrome.runtime.id;
		chrome.identity.launchWebAuthFlow({'url': pm.webUrl + '/signup?appId=' + appId, 'interactive': true},
			function(redirect_url) {
				if (chrome.runtime.lastError) {
					model.trigger("logout", model);
					pm.mediator.trigger("notifyError", "Could not initiate login flow. Please ensure network connectivity.");
				}
				else {
					var params = getUrlVars(redirect_url, true);

					model.set("syncEnabled", pm.settings.getSetting("enableSync"));
					pm.mediator.trigger("setSync",model.get("syncEnabled"));

					model.set("id", params.user_id);
					model.set("name", decodeURIComponent(params.name));
					model.set("access_token", decodeURIComponent(params.access_token));
					model.set("refresh_token", decodeURIComponent(params.refresh_token));
					model.set("expires_in", parseInt(params.expires_in, 10));
					model.set("logged_in_at", new Date().getTime());
					model.set("expiredToken", false);
					model.set("syncInvited", params.sync_invited=="1");
					model.set("syncEnabled", params.sync_enabled=="1");
					model.set("baseEulaAccepted", params.base_eula_accepted=="1");

					pm.mediator.trigger("setSync",model.get("syncEnabled"));

					pm.storage.setValue({"user": model.toJSON()}, function() {
					});

					model.getCollections();
					model.getPurchases();
					model.getOrganizations();
					model.setupSync();
					model.checkBaseEula();

					tracker.sendEvent('user', 'login', 'header');

					model.trigger("login", model);
					/* Extract token from redirect_url */
				}

			}
		);
	},

	receiveTokenFromPurchaseFlow: function(params) {
		var model = this;

		model.set("id", params.user_id);
		model.set("name", params.name);
		model.set("access_token", params.access_token);
		model.set("refresh_token", params.refresh_token);
		model.set("syncInvited", params.syncInvited==1);
		model.set("syncEnabled", params.syncEnabled==1);
		pm.mediator.trigger("setSync",model.get("syncEnabled"));

		model.set("expires_in", parseInt(params.expires_in, 10));
		model.set("logged_in_at", new Date().getTime());
		model.set("baseEulaAccepted", params.baseEulaAccepted=="1");

		pm.storage.setValue({"user": model.toJSON()}, function() {
		});

		model.getCollections();
		model.getPurchases();
		model.getOrganizations();
		model.setupSync();
		model.checkBaseEula();

		model.trigger("login", model);
	},

	logout: function() {
		var model = this;

		//Need to check if there are unsynced changes
		pm.api.logoutUser(this.get("id"), this.get("access_token"), function() {
			model.setDefaults();

			//Delete all sync-settings
			pm.settings.setSetting("syncInviteEnabled", false);
			pm.settings.setSetting("syncInviteShown", false);
			pm.settings.setSetting("enableSync", false);
			pm.settings.setSetting("syncedOnce", false);

			pm.mediator.trigger("showEnableSyncButton");

			//model.trigger("logout", {message: "Manual logout"});
			$("#user-status-not-logged-in").html("Log in");
			$("#sync-status").hide();
			model.trigger("onLogout");
			pm.syncManager.signOut();
			pm.mediator.trigger("isTeamMember", false);
			//pm.mediator.trigger("setSync",model.get("syncEnabled"));
		});

		pm.tracker.trackEvent("account", "sign_out");

	},

	getCollections: function(callback) {
		var model = this;

		if (this.isLoggedIn()) {
			pm.api.getUserCollections(function(data) {
				if (data.hasOwnProperty("collections")) {
					for(var i = 0; i < data.collections.length; i++) {
						c = data.collections[i];
						c.is_public = c.is_public === "1" ? true : false;
						c.updated_at_formatted = new Date(c.updated_at).toDateString();
					}

					model.set("collections", data.collections);
					model.trigger("change:collections");
					if (typeof(callback) == "function") {
						callback();
					}
				}
			});
		}
	},

	getPurchases: function() {
		var model = this;

		if (this.isLoggedIn()) {
			pm.api.getUserPurchases(function(data) {
				if (data.hasOwnProperty("purchases")) {
					pm.mediator.trigger("loadedPurchasesFromServer", data);
				}
			});
		}
	},

	getOrganizations: function() {
		var model = this;

		if (this.isLoggedIn()) {
			pm.api.getUserOrganizations(function(data) {
				if (data.hasOwnProperty("organizations") && data.organizations.length>0) {
					model.set("organizations", data.organizations);
					if(model.get("syncEnabled")) {
						pm.mediator.trigger("isTeamMember", true);
					}
					else {
						pm.mediator.trigger("isTeamMember", false);
					}
				}
				else {
					model.set("organizations", []);
					pm.mediator.trigger("isTeamMember", false);
				}
			});
		}
	},

	isTeamMember: function() {
		var orgs = this.get("organizations");
		if(orgs.length === 0) {
			return false;
		}
		else {
			return true;
		}
	},

	onDeleteSharedCollection: function(id) {
		var model = this;
		pm.api.deleteSharedCollection(id, function(data) {
			var collections = model.get("collections");
			var index = arrayObjectIndexOf(collections, id, "id");
			var collection = _.clone(collections[index]);

			if (index >= 0) {
				collections.splice(index, 1);
			}

			pm.mediator.trigger("deletedSharedCollection", collection);

			model.trigger("change:collections");
		});
	},

	downloadSharedCollection: function(id, callback) {
		pm.api.getCollectionFromRemoteId(id, function(data) {
			pm.mediator.trigger("overwriteCollection", data);
			pm.mediator.trigger("notifySuccess", "Downloaded collection: " + data.name);

			if (callback) {
				callback();
			}
		});
	},

	onDownloadSharedCollection: function(id) {
		this.downloadSharedCollection(id);
		pm.tracker.trackEvent("collection", "import", "download");
	},

	onDownloadAllSharedCollections: function() {
		var collections = this.get("collections");

		for(var i = 0; i < collections.length; i++) {
			this.downloadSharedCollection(collections[i].remote_id);
		}

		pm.tracker.trackEvent("collection", "import", "download_all", collections.length);
	},

	getRemoteIdForLinkId: function(linkId) {
		var link = pm.webUrl + "/collections/" + linkId;

		var collections = this.get("collections");
		var index = arrayObjectIndexOf(collections, link, "link");

		if (index >= 0) {
			return collections[index].remote_id;
		}
		else {
			return 0;
		}
	},

	setupSync: function() {
		var model = this;
		
		pm.mediator.trigger("notifyVersionUpdate");

		//if syncEnabled is true
		if(model.get("syncEnabled")) {
			pm.settings.setSetting("enableSync", true);
			pm.mediator.trigger("setSync", true);
			//$("#user-my-collections").hide();
			return;
		}

		//if syncInvited is true and syncInviteShown is false, show sync invite
		if(model.get("syncInvited") && !model.get("syncEnabled") && !pm.settings.getSetting("syncInviteShown")) {
			pm.mediator.trigger("showSyncInvitePopup");
			pm.settings.setSetting("syncInviteShown", true);
			pm.tracker.forceTrackEvent("sync", "view", "launch_modal");
			//transfer control to Legal
			//end of story
			//if he accepts, enableSync will be set to true, and an API call will be made to set eulaAccepted to true
			return;
		}

		else if(model.get("syncInvited") && pm.settings.getSetting("syncInviteEnabled") && !pm.settings.getSetting("enableSync")) {
			//dont do anything. The "Enable Sync" button will show in the navbar
			pm.mediator.trigger("showEnableSyncButton");
			return;
		}
	},

	checkBaseEula: function() {
		//no base eula-ing
		return;
		var model = this;
		if(model.get("baseEulaAccepted")!==true) {
			//Either the user as
			//pm.mediator.trigger("showBaseEula");
			return;
		}
		else {
			//pm.settings.setSetting("baseEulaAccepted", true);
		}
	}
});