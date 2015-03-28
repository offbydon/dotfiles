var SyncStatusManager = Backbone.Model.extend({
	defaults: function() {
		return {
			notifs: []
		};
	},

	initialize: function() {
		this.loadOldNotifs();
	},

	loadOldNotifs: function() {
		var oldThis=this;
		pm.indexedDB.getAllSyncNotifs(function(notifs) {
			var toSave =  _.sortBy(notifs.value,function(notification){return notification.timestamp}).reverse();
			oldThis.set("notifs",toSave);
			oldThis.trigger("updateNotifs", toSave);
		});
	},

	clearNotifs: function() {
		this.trigger("removeAllNotifs");
	},

	addNotification: function(entity, data, action) {
        //collection/request/history
        //create/update

		var id=guid();
		var timestamp = new Date();
		var LIMIT = 10;
		var notifs = this.get("notifs");
		if(notifs.length==LIMIT) {
			//remove the last element to make room for this one
			notifs.pop();
			this.trigger("removeOldestNotif");
		}
		entity = this._getProperCasedEntity(entity);
		var entityName = (data.name)?data.name:((data.id)?data.id.substring(0,6):"Unknown");
        var text = entity +" "+entityName;

		var verbs = this._getProperVerb(action);
		var user;

		//Pretty printing notifs
		if(entity==="history") {
			text = "Request";
			verbs.verb = "Sent";
		}

		if(data.lastUpdatedBy && data.lastUpdatedBy.username) {
			text += " by " + data.lastUpdatedBy.username;
			user = data.lastUpdatedBy.username;
		}

		//entity is folder/collection/request
		//entityname is f1/c1/r1
		//method is put/post
		//verb is edited/created

		var newNotif = {'id':id,'text':text,'verb':verbs.verb, 'method':verbs.method, 'entity': entity, 'entityName': entityName, 'user': user, 'timestamp':timestamp.getTime()};
		notifs.unshift(newNotif);
		var oldThis=this;
		pm.indexedDB.updateSyncNotifs(notifs, function(){
			oldThis.set("notifs",notifs);
			oldThis.trigger('notificationAdded', newNotif);
		});
	},

    _getProperCasedEntity: function(entity) {
        switch(entity) {
            case "collection":
                return "Collection";
            case "request":
                return "Request";
            case "history":
                return "History";
			case "environment":
                return "Environment";
			case "response":
				return "Response";
			case "folder":
				return "Folder";
            default:
                return "Entity ["+entity+"]";
        }
    },

	_getProperVerb: function(verb) {
		switch(verb) {
			case "create":
				return {"verb":"Added", "method": "post"};
				break;
			case "update":
				return {"verb":"Edited", "method": "put"};
				break;
			case "destroy":
				return {"verb":"Deleted", "method": "delete"};
				break;
			case "transfer":
				return {"verb":"Moved", "method": "put"};
				break;
			default:
				return {"verb":"unknown", "method": "unknown"};
		}
    }

});