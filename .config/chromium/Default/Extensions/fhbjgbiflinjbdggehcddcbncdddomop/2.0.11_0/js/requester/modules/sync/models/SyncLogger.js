var SyncLogger = Backbone.Model.extend({
    log: function(err, logString) {
        if(!this.logging) {
            return;
        }
        var currTime =  this.getLogDate();
        if(logString instanceof Array) {
            var len = logString.length;
            console.groupCollapsed(currTime + " - " + logString.join(" - "));
            console.dir(currTime + " - " + err.stack);
            for(var i=0;i<len;i++) {
                console.log(currTime + " - " + logString[i]);
            }
            console.groupEnd();

        }
        else {
            console.groupCollapsed(currTime + " - " + logString);
            console.dir(currTime + " - " + err.stack);
            console.groupEnd();
        }
    },

    //error
    error: function(msg, url, linenumber, colNumber, stack, errorObject) {
        var installationId = pm.settings.getSetting("installation_id");
        var userId = pm.user.id;
        var accessToken = pm.user.get("access_token");
        var currTime = new Date();
        var version = chrome.runtime.getManifest().version;
        //Custom errors are send only if sync is enabled
        if(pm.syncManager.syncEnabled) {
            pm.api.postErrorToServer(msg || "", url, linenumber+"", colNumber+"", stack | "", installationId, userId, currTime, version, accessToken);
        }
        console.error(this.getLogDate()+" - " +msg);
    },

    //This sends uncaught errors - irrespective of sync
    errorForce: function(msg, url, linenumber, colNumber, stack, errorObject) {
        var installationId = pm.settings.getSetting("installation_id");
        var userId = pm.user.id;
        var accessToken = pm.user.get("access_token");
        var currTime = new Date();
        var version = chrome.runtime.getManifest().version;
        pm.api.postErrorToServer(("Uncaught - " + msg) || "Uncaught - ", url, linenumber+"", colNumber+"", stack | "", installationId, userId, currTime, version, accessToken);
        console.error(this.getLogDate()+" - " +msg);
    },

    initialize: function() {
        //global errors are sent to the server irrespective of sync
        window.onerror = function(msg, url, linenumber, colnumber, stackTrace) {
            pm.syncLogger.errorForce(msg, url, linenumber, colnumber, stackTrace.stack);
            return false;
        };

        //turn this on?
        this.logging = false;
    },

    getLogDate: function() {
        var a = new Date();
        return a.getHours()+":"+a.getMinutes()+":"+a.getMinutes()+"."+a.getMilliseconds();
    }
});
