var PreRequestScripter = Backbone.Model.extend({
	defaults: function() {
		return {
			"sandbox": null
		};
	},

	runPreRequestScript: function(request, data, iteration, callback) {
		$("#prscript-error").hide();

		var prCode = request.get("preRequestScript");

		// Wrapper function
		var baseCode = "(function(){";
		baseCode += prCode;
		baseCode += "\n})()";

		if(prCode && prCode.length>1) {
			pm.tracker.trackEvent("request", "pre_request_script", "execute");
		}

		var selectedEnv = pm.envManager.get("selectedEnv");
		var selectedEnvJson = {};
		var globals = getKeyValPairsAsAssociativeArray(pm.envManager.get("globals").get("globals"));

		if (selectedEnv) {
			selectedEnvJson = getKeyValPairsAsAssociativeArray(selectedEnv.toJSON().values);
		}

		var environment = {
			"request": request.getForPrscript(), // Get separately
			"environment": selectedEnvJson,
			"globals": globals
		};

		this.postCode(baseCode, environment);

		this.listenToOnce(pm.mediator, "resultReceivedPrscript", function(data) {
			if (callback) {
				callback(data, "result");
			}
		});

		this.listenToOnce(pm.mediator, "resultErrorPrscript", function(data) {
			this.showPreRequestScriptError(data);
		});
	},

	postCode: function(code, environment) {
		var sandbox = this.get("sandbox");
		var message = {
			command: "runprscript",
			code: code,
			environment: environment,
			scriptType: "prscript"
		};

		sandbox.contentWindow.postMessage(message, '*');
	},

	initialize: function() {
		var model = this;
		
		var sandbox = document.getElementById("tester_sandbox");
		this.set("sandbox", sandbox);

		window.addEventListener('message', function(event) {			
			var type = event.data.type;

			if (event.data.type === "resultReceivedPrscript") {
				pm.mediator.trigger("resultReceivedPrscript", event.data.result);
			}

			if (event.data.type === "resultErrorPrscript") {
				pm.mediator.trigger("resultErrorPrscript", event.data.errorMessage);
			}
			//All other events are handled in Tester.js
		});

		pm.mediator.on("runPreRequestScript", this.runPreRequestScript, this);

		pm.mediator.on("resultErrorPrscript", this.showPreRequestScriptError, this);
	},

	showPreRequestScriptError: function(msg) {
		//for collection runner
		if(window.hasOwnProperty("TestRun")) {
			clearTimeout(pm.globalPrScriptNotif);
			pm.globalPrScriptNotif = setTimeout(function() {
				pm.mediator.trigger("notifyError", "Something is wrong with your Pre-request scripts. Please fix them in the editor first. Message: " + msg);
				//hit new run directly :S
				$("a#new-test-run").click();
			}, 500);
		}
		else {
			$("#prscript-error").show().html("There was an error evaluating the Pre-request script. " + msg).css('display','inline-block');	
		}
	}
});