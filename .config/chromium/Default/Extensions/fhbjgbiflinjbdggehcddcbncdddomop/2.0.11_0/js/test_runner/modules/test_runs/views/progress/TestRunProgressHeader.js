var TestRunProgressHeader = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		var view = this;

		pm.mediator.on("startedTestRun", this.onStartedTestRun, this);
		pm.mediator.on("finishedTestRun", this.onFinishedTestRun, this);

		$("#view-stats").on("click", function() {
			var id = $(this).attr("data-id");
			view.showStats(id);
			pm.tracker.trackEvent("collection_runner", "stats", "post_run");
		});

		$("#stats_navbar").click(function() {
			pm.tracker.trackEvent("collection_runner", "stats", "nav_bar");
		});

		$("#new-test-run").on("click", function() {
			model.trigger("showView", "default");
			pm.tracker.trackEvent("collection_runner", "new_run");
		});
	},

	onStartedTestRun: function(testRun) {
		// console.log("Run tests, activate onStartedTestRun");
		$("#test-run-progress-content-loader").css("display", "block");
		$("#view-stats").attr("data-id", testRun.get("id"));
		$("#test-run-target").html(Handlebars.templates.test_run_target(testRun.getAsJSON()));
	},

	onFinishedTestRun: function() {
		// console.log("Run tests, activate onFinishedTestRun");
		$("#test-run-progress-content-loader").css("display", "none");
	},

	showStats: function(id) {
		pm.mediator.trigger("loadTestRunFromId", id);
	}
});