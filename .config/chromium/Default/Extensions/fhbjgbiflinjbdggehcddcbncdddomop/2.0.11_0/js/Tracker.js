var Tracker = Backbone.Model.extend({
	defaults: function() {
		return {
		}
	},

	initialize: function() {
		pm.mediator.once("onTrialStart", this.onTrialStart, this);
		pm.mediator.once("onTrialEnd", this.onTrialEnd, this);
		pm.mediator.on("onStartPurchase", this.onStartPurchase, this);

		//for collection_runner events
		pm.appWindow.trigger("registerInternalEvent", "test_runner_event", this.onAddTestRunnerEvent, this);
	},

	onAddTestRunnerEvent: function(event) {
		this.trackEvent(event.category, event.action, event.label, event.value);
	},

	onStartPurchase: function() {
		if (tracker) {
			tracker.sendEvent('test_runner', 'collection_runner', 'buy');
		}		
	},

	onTrialStart: function() {
		if (tracker) {
			tracker.sendEvent('test_runner', 'collection_runner', 'trial_start');
		}		
	},

	onTrialEnd: function() {
		if (tracker) {
			console.log("trial_end event fired");
			tracker.sendEvent('test_runner', 'collection_runner', 'trial_end');
		}		
	},

	trackEvent: function(category, action, label, value) {
		//if this is the collection runner
		if(!pm["syncManager"]) {
			chrome.runtime.sendMessage({
				id: pm.appWindow.get("id"),
				event: "test_runner_event",
				object: {
					category: category,
					action: action,
					label: label,
					value: value
				}
			});
			return;
		}

		//Only send tracking events if Sync is enabled
		if(!pm.syncManager.syncEnabled) {
			return;
		}

		this.forceTrackEvent(category, action, label, value);
	},

	forceTrackEvent: function(category, action, label, value) {
		if (tracker) {
			if(value) {
				tracker.sendEvent(category, action, label, value);
			}
			else if(label) {
				tracker.sendEvent(category, action, label);
			}
			else {
				tracker.sendEvent(category, action);
			}
		}
	}
});