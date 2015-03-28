var PostmanAPI = Backbone.Model.extend({
	defaults: function() {
		return {
			"web_url": pm.webUrl
		}
	},

	initialize: function() {
		// console.log("This is going to be the awesome postman API!");
	},

	exchangeRefreshToken: function(successCallback) {
		// console.log("Trying to exchangeRefreshToken");

		var postUrl = pm.webUrl + "/client-oauth2-refresh";
		postUrl += "?user_id=" + pm.user.get("id");

		var parameters = {
			"grant_type": "refresh_token",
			"refresh_token": pm.user.get("refresh_token")
		};

		$.ajax({
			type: 'POST',
			url: postUrl,
			data: parameters,
			success: function(data) {
				// console.log("Received refresh_token", data);

				if (data.hasOwnProperty("result")) {
					var result = data.hasOwnProperty("result");
					if (!result) {
						pm.mediator.trigger("invalidRefreshToken");
					}
				}
				else if (data.hasOwnProperty("access_token")) {
					pm.user.setAccessToken(data);
    				if(data.hasOwnProperty("syncEnabled")) {
    					pm.user.set("syncEnabled", (data.syncEnabled + "") === "1");
    				}
    				if(data.hasOwnProperty("syncInvited")) {
    					pm.user.set("syncInvited", (data.syncInvited + "") === "1");
    				}

					if (successCallback) {
						successCallback();
					}
				}
			}
		})
	},

	logoutUser: function(userId, accessToken, successCallback) {
		var postUrl = pm.webUrl + '/client-logout';
	    postUrl += "?user_id=" + userId;
	    postUrl += "&access_token=" + accessToken;

		$.ajax({
			type: 'POST',
			url: postUrl,
			success: function() {
				if (successCallback) {
					successCallback();
				}
			}
		})
	},

    isTokenValid: function() {
        var expiresIn = pm.user.get("expires_in");
        var loggedInAt = pm.user.get("logged_in_at");

        var now = new Date().getTime();

        if (loggedInAt + expiresIn > now) {
            return true;
        }
        else {
            return false;
        }
    },

	executeAuthenticatedRequest: function(func) {
		var isTokenValid = this.isTokenValid();

		if (isTokenValid) {
			func();
		}
		else {
			this.exchangeRefreshToken(function() {
				func();
			});
		}
	},

	uploadCollection: function(collectionData, isPublic, successCallback) {
		var uploadUrl = pm.webUrl + '/collections?is_public=' + isPublic;

		if (pm.user.isLoggedIn()) {
		    this.executeAuthenticatedRequest(function() {
		    	uploadUrl += "&user_id=" + pm.user.get("id");
		    	uploadUrl += "&access_token=" + pm.user.get("access_token");

		    	$.ajax({
		    	    type:'POST',
		    	    url:uploadUrl,
		    	    data:collectionData,
		    	    success:function (data) {
		    	    	if (successCallback) {
		    	    		successCallback(data);
		    	    	}
		    	    }
		    	});
		    });
		}
		else {
			$.ajax({
			    type:'POST',
			    url:uploadUrl,
			    data:collectionData,
			    success:function (data) {
			    	if (successCallback) {
			    		successCallback(data);
			    	}
			    }
			});
		}
	},

	getDirectoryCollections: function(startId, count, order, successCallback) {
		var getUrl = pm.webUrl + "/collections";
		getUrl += "?user_id=" + pm.user.get("id");
		getUrl += "&access_token=" + pm.user.get("access_token");
		getUrl += "&start_id=" + startId;
		getUrl += "&count=" + count;
		getUrl += "&order=" + order;

		$.ajax({
		    type:'GET',
		    url:getUrl,
		    success:function (collections) {
		    	if (successCallback) {
		    		successCallback(collections);
		    	}
		    }
		});
	},

	getTeamCollections: function(userId, access_token, orgId, successCallback, failCallback) {
		if(!pm.user.isTeamMember()) return;

		var getUrl = pm.webUrl + "/profile/team/collections";
		var newGetUrl = postman_syncserver_url + "/api/team/"+orgId;
		newGetUrl += "?user_id=" + pm.user.get("id") + "&access_token=" + access_token;
		getUrl += "?user_id=" + pm.user.get("id");

		$.ajax({
			url: newGetUrl,
			type: "GET",
			//headers: {"X-Access-Token": access_token},
			success: successCallback,
			error: failCallback
		});
	},

	getTeamUsers: function(userId, access_token, organization_id, successCallback) {
		if(!pm.user.isTeamMember()) return;

		var getUrl = pm.webUrl + "/organizations/" + organization_id+" /users";
		getUrl += "?user_id=" + pm.user.get("id")+"&access_token=" + access_token;

		$.ajax({
			url: getUrl,
			type: "GET",
			success: successCallback
		});
	},

	subscribeToCollection: function(collectionId, userId, ownerId, successCallback) {
		if(!pm.user.isTeamMember()) return;

		var getUrl = postman_syncserver_url + "/api/collection/" + collectionId + "/subscribe";

		$.ajax({
			url: getUrl,
			type: "PUT",
			data: {"user_id": userId, "owner": ownerId},
			success: successCallback
		});
	},

	addCollectionToTeam: function(userId, access_token, collection_id, collection_name, collection_description, collection_owner_name, collection_owner_id, successCallback) {
		if(!pm.user.isTeamMember()) return;

		var getUrl = pm.webUrl + "/profile/team/collection";

		$.ajax({
			url: getUrl,
			type: "POST",
			data: {
				user_id: userId,
				collection_id: collection_id,
				collection_name: collection_name,
				collection_description: collection_description,
				collection_owner_name: collection_owner_name,
				collection_owner_id: collection_owner_id,
			},
			headers: {"X-Access-Token": access_token},
			success: successCallback
		});
	},

	updateCollectionToTeam: function(userId, access_token, collection_id, collection_name, collection_description, collection_owner_id, successCallback) {
		if(!pm.user.isTeamMember()) return;

		var getUrl = pm.webUrl + "/profile/team/collection-update/" + collection_id;

		$.ajax({
			url: getUrl,
			type: "POST",
			data: {
				user_id: userId,
				collection_id: collection_id,
				collection_name: collection_name,
				collection_description: collection_description,
				collection_owner_id: collection_owner_id
			},
			headers: {"X-Access-Token": access_token},
			success: successCallback
		});
	},

	deleteCollectionFromTeam: function(userId, access_token, collection_id, cb, cbf) {
		if(!pm.user.isTeamMember()) return;

		var getUrl = pm.webUrl + "/profile/team/collection/"+collection_id+"/"+userId;
		$.ajax({
			url: getUrl,
			type: "DELETE",
			headers: {"X-Access-Token": access_token},
			success: cb,
			failure: cbf
		});
	},

	downloadDirectoryCollection: function(link_id, successCallback) {
	    var getUrl = pm.webUrl + "/collections/" + link_id;
	    getUrl += "?user_id=" + pm.user.get("id");
	    getUrl += "&access_token=" + pm.user.get("access_token");

	    $.get(getUrl, function (data) {
	    	if (successCallback) {
	    		successCallback(data);
	    	}
	    });
	},

	getUserPurchases: function(successCallback) {
		this.executeAuthenticatedRequest(function() {
			var user = pm.user;

			var getUrl = pm.webUrl + "/users/" + user.get("id") + "/purchases";
			getUrl += "?user_id=" + user.get("id");
			getUrl += "&access_token=" + user.get("access_token");

			$.ajax({
			    type:'GET',
			    url:getUrl,
			    success:function (data) {
			    	if (successCallback) {
			    		successCallback(data);
			    	}
			    }
			});
		});
	},

	getUserCollections: function(successCallback) {
		this.executeAuthenticatedRequest(function() {
			var user = pm.user;

			var getUrl = pm.webUrl + "/users/" + user.get("id") + "/collections";
			getUrl += "?user_id=" + user.get("id");
			getUrl += "&access_token=" + user.get("access_token");

			$.ajax({
			    type:'GET',
			    url:getUrl,
			    success:function (data) {
			    	if (successCallback) {
			    		successCallback(data);
			    	}
			    }
			});
		});
	},

	getUserOrganizations: function(successCallback) {
		//DISABLING ALL TEAM FUNCTIONALITY FOR NOW
		successCallback({});
		return;

		this.executeAuthenticatedRequest(function() {
			var user = pm.user;

			var getUrl = pm.webUrl + "/users/" + user.get("id") + "/organizations";
			getUrl += "?user_id=" + user.get("id");
			getUrl += "&access_token=" + user.get("access_token");

			$.ajax({
				type:'GET',
				url:getUrl,
				success:function (data) {
					if (successCallback) {
						successCallback(data);
					}
				}
			});
		});
	},

	deleteSharedCollection: function(id, successCallback) {
		this.executeAuthenticatedRequest(function() {
			var user = pm.user;

			var deleteUrl = pm.webUrl + "/users/" + user.get("id") + "/collections/" + id;
			deleteUrl += "?user_id=" + user.get("id");
			deleteUrl += "&access_token=" + user.get("access_token");

			$.ajax({
			    type:'DELETE',
			    url:deleteUrl,
			    success:function (data) {
			    	if (successCallback) {
			    		successCallback(data);
			    	}
			    }
			});
		});
	},

	getCollectionFromRemoteId: function(id, successCallback) {
		var getUrl = pm.webUrl + "/collections/" + id;
		getUrl += "?id_type=remote&user_id=" + pm.user.get("id");
		getUrl += "&access_token=" + pm.user.get("access_token");

		$.get(getUrl, function (data) {
			if (successCallback) {
				successCallback(data);
			}
		});
	},

	postErrorToServer: function(msg, url, lineNumber, colNumber, stack, installationId, userId, currTime, version, accessToken) {
		var errorUrl = pm.webUrl + "/app_error";
		$.ajax({
			url: errorUrl,
			type: "POST",
			data: {
				msg: msg,
				url: url || "Custom message",
				line_number: lineNumber,
				col_number: colNumber,
				stack_trace: stack,
				installation_id: installationId,
				user_id: userId,
				timestamp: currTime + "",
				version: version
			},
			headers: {"X-Access-Token": accessToken},
			success: function() {
				console.log("Error message sent to server");
			}
		});
	},

	acceptSyncEula: function(userId, token, successCallback) {
		var getUrl = pm.webUrl + "/sync-eula-accept";
		getUrl += "?user_id=" + userId;
		getUrl += "&access_token=" + token;

		$.post(getUrl, function (data) {
			if (successCallback) {
				successCallback(data);
			}
		});
	},

	//To be used when the base eula is shown
	//acceptBaseEula: function(userId, token, successCallback) {
	//	var getUrl = pm.webUrl + "/base-eula-accept";
	//	getUrl += "?user_id=" + userId;
	//	getUrl += "&access_token=" + token;
	//
	//	$.post(getUrl, function (data) {
	//		if (successCallback) {
	//			successCallback(data);
	//		}
	//	});
	//},

	notifyServerOfVersionChange: function(newVersion) {
		var vUrl = pm.webUrl + "/user_app_version";
		var user = pm.user;
		var id = user.get("id");
		if(id==0) return;
		var token = user.get("access_token");
		$.ajax({
			url: vUrl,
			type: "PUT",
			data: {
				version: newVersion,
				user_id: id
			},
			headers: {"X-Access-Token": token},
			success: function() {
				console.log("Version update sent");
			}
		});
	}

});