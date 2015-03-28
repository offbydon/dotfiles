var SyncNotif = Backbone.Model.extend({
    defaults: function() {
        return {
            "id": "",
            "text": "",
            "timestamp": 0
        };
    },

    getAsJSON: function() {
        return {
            "id": this.get("id"),
            "text": this.get("text"),
            "timestamp": this.get("timestamp")
        }
    }
});