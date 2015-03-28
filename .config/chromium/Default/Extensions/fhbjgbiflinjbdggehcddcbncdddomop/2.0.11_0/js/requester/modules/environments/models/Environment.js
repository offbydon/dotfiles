var Environment = Backbone.Model.extend({
    defaults: function() {
        return {
            "id": "",
            "name": "",
            "values": [],
            "timestamp": 0,
            "synced": false,
            "syncedFilename": ""
        };
    },

    toSyncableJSON: function() {
        var j = this.toJSON();
        j.synced = true;
        return j;
    },

    getEnabledValues: function() {
        var retVal = [];
        var values = this.get("values");
        for(i=0;i<values.length;i++) {
            if(!values[i].hasOwnProperty("enabled") || values[i].enabled==true) {
                retVal.push(values[i]);
            }
        }
        return retVal;
    }
});
