var Settings = Backbone.Model.extend({
    defaults: function() {
        return {
            lastRequest:"",
            autoSaveRequest:true,
            selectedEnvironmentId:"",
            type: "chromeStorageArea",
            items: {}
        };
    },

    resetSettings: function() {
        this.setSetting("historyCount", 100);
        this.setSetting("autoSaveRequest", true);
        this.setSetting("selectedEnvironmentId", true);
        this.setSetting("lineWrapping", true);
        this.setSetting("previewType", "parsed");
        this.setSetting("trimKeysAndValues", false);
        this.setSetting("retainLinkHeaders", false);
        this.setSetting("sendNoCacheHeader", true);
        this.setSetting("sendPostmanTokenHeader", true);
        this.setSetting("usePostmanProxy", false);
        this.setSetting("useInterceptor", false);
        this.setSetting("proxyURL", "");
        this.setSetting("lastRequest", "");
        this.setSetting("launcherNotificationCount", 0);
        this.setSetting("xhrTimeout", 0);
        this.setSetting("variableDelimiter", "{{...}}");
        this.setSetting("languageDetection", "auto");
        this.setSetting("haveDonated", false);
        this.setSetting("instantModals",true);
        this.setSetting("responseFontSize",13);

        //Sync Settings
        this.setSetting("enableSync", false);
        this.setSetting("syncInviteEnabled", false);
        this.setSetting("syncInviteShown", false);
        this.setSetting("baseEulaAccepted", false);
        //---Sync Settings

        this.setSetting("postmanTheme", "light");
        this.setSetting("postmanCodeMirrorTheme", "eclipse");


        this.setSetting("responsePreviewDataSection", "body");
        this.setSetting("requestBodyEditorContainerType", "editor");

        //Google Drive related
        this.setSetting("driveSyncPermissionStatus", "disabled"); //notconnected, connected, disabled
        this.setSetting("driveSyncEnabled", false);
        this.setSetting("driveStartChangeId", 0);
        this.setSetting("driveAppDataFolderId", 0);
        this.setSetting("lastDriveChangeTime", "");
        this.setSetting("syncedGlobals", false);

        this.setSetting("hideSnippets", false);
        this.setSetting("hidePrscriptSnippets", false);

        this.setSetting("interceptorRedirect", true);
    },

    initValues: function(callback) {
        this.set({"items": {}});

        var func = function(settingsJson) {
            if (settingsJson !== null) {
                this.set({"items": JSON.parse(settingsJson)});
            }

            this.create("historyCount", 100);
            this.create("autoSaveRequest", true);
            this.create("selectedEnvironmentId", true);
            this.create("lineWrapping", true);
            this.create("previewType", "parsed");
            this.create("trimKeysAndValues", false);
            this.create("retainLinkHeaders", false);
            this.create("sendNoCacheHeader", true);
            this.create("sendPostmanTokenHeader", true);
            this.create("usePostmanProxy", false);
            this.create("useInterceptor", false);
            this.create("proxyURL", "");
            this.create("lastRequest", "");
            this.create("xhrTimeout", 0);
            this.create("launcherNotificationCount", 0);
            this.create("variableDelimiter", "{{...}}");
            this.create("languageDetection", "auto");
            this.create("haveDonated", false);
            this.create("instantModals",true);

            this.create("postmanTheme", "light");
            this.create("postmanCodeMirrorTheme", "eclipse");

            this.create("responsePreviewDataSection", "body");
            this.create("requestBodyEditorContainerType", "editor");

            this.create("responseFontSize", 13);

            //Google Drive related
            this.create("driveSyncPermissionStatus", "not_asked"); //not_asked, asked, disabled
            this.create("driveSyncEnabled", false);
            this.create("driveStartChangeId", 0);
            this.create("driveAppDataFolderId", 0);
            this.create("lastDriveChangeTime", "");

            this.create("syncedGlobals", false);
            this.create("syncedHeaderPresets", false);

            this.create("hideSnippets", false);
            this.create("hidePrscriptSnippets", false);

            //Sync Settings
            this.create("enableSync", false);
            this.create("syncInviteEnabled", false);
            this.create("syncInviteShown", false);
            this.create("baseEulaAccepted", false);

            this.create("interceptorRedirect", true);

            if (pm.isTesting) {
                this.resetSettings();
            }

            callback();
        };

        func = _.bind(func, this);
        pm.storage.getValue("settings", func);
    },

    //This moves to the view initialize script?
    initListeners: function() {
    },

    test: function() {
        // console.log("Testing the function");
    },

    init:function (callback) {
        this.initValues(callback);
    },

    create:function (key, defaultVal) {
        if (!(key in this.get("items"))) {
            if (defaultVal !== "undefined") {
                this.setSetting(key, defaultVal);
            }
        }
    },

    setSetting:function (key, value) {
        //Need to clone otherwise Backbone will not fire the correct event
        var newItems = _.clone(this.get("items"));
        newItems[key] = value;
        this.set({items: newItems});

        var o = {'settings': JSON.stringify(this.get("items"))};
        pm.storage.setValue(o, function() {
        });
    },

    getSetting:function (key) {
        var val = this.get("items")[key];

        if (val === "true") {
            return true;
        }
        else if (val === "false") {
            return false;
        }
        else {
            return val;
        }
    },

    update: function(settings) {
        this.setSetting("historyCount", settings.historyCount, false);
        this.setSetting("autoSaveRequest", settings.autoSaveRequest, false);
        this.setSetting("retainLinkHeaders", settings.retainLinkHeaders, false);
        this.setSetting("sendNoCacheHeader", settings.sendNoCacheHeader, false);
        this.setSetting("variableDelimiter", settings.variableDelimiter, false);
        this.setSetting("languageDetection", settings.languageDetection, false);
        this.setSetting("haveDonated", settings.haveDonated, false);
        this.setSetting("instantModals",settings.instantModals, false);

        this.setSetting("enableSync", settings.enableSync, false);
        this.setSetting("baseEulaAccepted", settings.baseEulaAccepted, false);

        this.setSetting("responseFontSize", settings.responseFontSize, false);
        this.setSetting("interceptorRedirect", settings.interceptorRedirect, true);

        this.initValues();
        this.initListeners();
    },

    getAsJson: function() {
        var settings = {
            historyCount: this.getSetting("historyCount"),
            autoSaveRequest: this.getSetting("autoSaveRequest"),
            retainLinkHeaders: this.getSetting("retainLinkHeaders"),
            sendNoCacheHeader: this.getSetting("sendNoCacheHeader"),
            variableDelimiter: this.getSetting("variableDelimiter"),
            languageDetection: this.getSetting("languageDetection"),
            haveDonated: this.getSetting("haveDonated"),
            instantModals: this.getSetting("instantModals"),
            responseFontSize: this.getSetting("responseFontSize"),
            enableSync: this.getSetting("enableSync"),
            baseEulaAccepted: this.getSetting("baseEulaAccepted"),

            interceptorRedirect: this.getSetting("interceptorRedirect")
        };

        return settings;
    }
});