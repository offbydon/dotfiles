/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */
"use strict";

var pm = {};

pm.targets = {
    CHROME_LEGACY_APP: 0,
    CHROME_PACKAGED_APP: 1
};

pm.target = pm.targets.CHROME_PACKAGED_APP;

// Flags are set inside config.js
pm.isTesting = postman_flag_is_testing;
pm.databaseName = postman_database_name;
pm.webUrl = postman_web_url;

pm.features = new Features();

pm.debug = false;

pm.arePurchasesInBeta = "false";

pm.syncSocket = null;
pm.syncManager = null;
pm.syncQueue = [];

pm.environments = null;
pm.globals = null;

pm.indexedDB = {};
pm.indexedDB.db = null;
pm.indexedDB.modes = {
    readwrite:"readwrite",
    readonly:"readonly"
};

pm.globalPrScriptNotif = null;

pm.fs = {};
pm.gaClientId = "";
pm.hasPostmanInitialized = false;

// TODO Check if still being used
pm.bannedHeaders = [
    'accept-charset',
    'accept-encoding',
    'access-control-request-headers',
    'access-control-request-method',
    'connection',
    'content-length',
    'cookie',
    'cookie2',
    'content-transfer-encoding',
    'date',
    'expect',
    'host',
    'keep-alive',
    'origin',
    'referer',
    'te',
    'trailer',
    'transfer-encoding',
    'upgrade',
    'user-agent',
    'via'
];

// IndexedDB implementations still use API prefixes
var indexedDB = window.indexedDB || // Use the standard DB API
    window.mozIndexedDB || // Or Firefox's early version of it
    window.webkitIndexedDB;            // Or Chrome's early version
// Firefox does not prefix these two:
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
var IDBCursor = window.IDBCursor || window.webkitIDBCursor;

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

pm.init = function () {
    Handlebars.partials = Handlebars.templates;

    Handlebars.registerHelper('ifEditable', function(editable, options) {
        return (editable!==false)?options.fn(this):options.inverse(this);
    });

    Handlebars.registerHelper('ifEditableItem', function(write, owner, options) {
        return (write!==false || pm.user.id==owner)?options.fn(this):options.inverse(this);
    });

    function initializePurchases() {
        var testPurchaser = new TestPurchaser({model: {}});
        pm.purchases = new Purchases();
    }

    function initializeTester() {
        var tester = new Tester();
        var prScripter = new PreRequestScripter();
        // pm.tester = tester;
    }


    function initializeTCPReader() {
        var tcpReader = new TCPReader();
        var tcpReaderStatus = new TCPReaderStatus({model: tcpReader});
        var tcpManager = new TCPManager({model: tcpReader});

        pm.tcpReader = tcpReader;
    }

    function initializePostmanAPI() {
        pm.api = new PostmanAPI();
    }

    function initializeInterceptor() {
        console.log("Initialize interceptor");
        var interceptorIntro = new InterceptorIntro({model: {}});        
        var interceptorCapture = new InterceptorCapture();
        var curlCapture = new CurlCapture();
    }

    function initializeCollections() {
        pm.collectionValidator = postmanvalidator;

        var pmCollections = new PmCollections();

        var addCollectionModal = new AddCollectionModal({model: pmCollections});
        var addFolderModal = new AddFolderModal({model: pmCollections});
        var editFolderModal = new EditFolderModal({model: pmCollections});
        var deleteFolderModal = new DeleteFolderModal({model: pmCollections});
        var editCollectionModal = new EditCollectionModal({model: pmCollections});
        var deleteCollectionModal = new DeleteCollectionModal({model: pmCollections});
        var importModal = new ImportModal({model: pmCollections});
        var shareCollectionModal = new ShareCollectionModal({model: pmCollections});
        var overwriteCollectionModal = new OverwriteCollectionModal({model: pmCollections});

        var addCollectionRequestModal = new AddCollectionRequestModal({model: pmCollections});
        var editCollectionRequestModal = new EditCollectionRequestModal({model: pmCollections});
        var deleteCollectionRequestModal = new DeleteCollectionRequestModal({model: pmCollections});
        pm.collections = pmCollections;
    }

	function initializeSync() {
        //Disabling Sync News section
		//pm.syncStatusManager = new SyncStatusManager();
		//var syncStatusSidebar = new SyncStatusSidebar({model: pm.syncStatusManager});
		pm.syncLogger = new SyncLogger();
		var localChanges = new LocalChanges();
		pm.syncManager = new SyncManagerNew();
        pm.localChanges = localChanges;

        pm.subscriptionManger = new SubscriptionHandler();

		var syncStatusNotif = new SyncStatusNotif({model: pm.syncManager});

        pm.conflictResolverModal = new ConflictResolverModal();
	}

    function initializeHistory() {
        var history = new History();
        pm.history = history;
    }

    function initializeEnvironments() {
        var globals = new Globals();
        var environments = new Environments();

        var variableProcessor = new VariableProcessor({
            "environments": environments,
            "globals": globals
        });

        var environmentSelector = new EnvironmentSelector({
            "environments": environments,
            "variableProcessor": variableProcessor
        });

        var environmentManagerModal = new EnvironmentManagerModal({
            "environments": environments,
            "globals": globals
        });

        var quicklookPopOver = new QuickLookPopOver({
            "environments": environments,
            "globals": globals,
            "variableProcessor": variableProcessor
        });

        pm.envManager = variableProcessor;
        pm.environments = environments;
        pm.globals = globals;

        var appState = new AppState({
            "globals": globals,
            "environments": environments,
            "variableProcessor": variableProcessor
        });

        var appView = new App({model: appState});
        pm.app = appView;
    }

    function initializeHeaderPresets() {
        pm.headerPresets = new HeaderPresets();

        var headerPresetsModal = new HeaderPresetsModal({model: pm.headerPresets});
        var headerPresetsRequestEditor = new HeaderPresetsRequestEditor({model: pm.headerPresets});
    }

    function initializeRequester() {
        var urlCache = new URLCache();
        pm.urlCache = urlCache;

        var request = new Request();
        var requestEditor = new RequestEditor({model: request});
        var responseViewer = new ResponseViewer({model: request});

        var basicAuthProcessor = new BasicAuthProcessor({request: request});
        var digestAuthProcessor = new DigestAuthProcessor({request: request});
        var oAuth1Processor = new OAuth1Processor({request: request});
        var oAuth2TokenFetcher = new OAuth2TokenFetcher({request: request});

        var helpers = new Helpers({
            "basicAuth": basicAuthProcessor,
            "digestAuth": digestAuthProcessor,
            "oAuth1": oAuth1Processor,
            "oAuth2": oAuth2TokenFetcher,
            "request": request
        });

        var oAuth2Tokens = new OAuth2Tokens();
        var oAuth2TokenList = new OAuth2TokenList({model: oAuth2Tokens});

        var helperManager = new HelperManager({model: helpers});
        pm.helpers = helperManager;

        pm.request = request;
        initializeExtensionListener();
        initializeUpdateNotifier();
    }

    function initializeExtensionListener() {
        chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {            
            pm.mediator.trigger("onMessageExternal", request, sender, sendResponse);
        });
    }

    function initializeUpdateNotifier() {
        var UpdateNotifier = new AppUpdateNotifier();
    }

    function initializeStorage() {
        var storage = new Storage();
        pm.storage = storage;
    }

    function initializeRequestMethods() {
        var requestMethods = new RequestMethods();
        pm.methods = requestMethods;
    }

    function initializeSidebar() {
        var sidebarState = new SidebarState({history: pm.history, collections: pm.collections});
        var sidebar = new Sidebar({ model: sidebarState });
    }

    function initializeDriveSync() {
        if (pm.features.isFeatureEnabled(FEATURES.DRIVE_SYNC)) {
            var driveSyncLog = new DriveSyncLog();
            var driveSyncLogger = new DriveSyncLogger({model: driveSyncLog});
            var driveSync = new DriveSync({log: driveSyncLog});
            var driveSyncIntroduction = new DriveSyncIntroduction({model: driveSync});
        }
        else {
            // console.log("Drive sync is disabled");
        }
    }

    function initializeDirectory() {
        var directory = new Directory();
        var directoryBrowser = new DirectoryBrowser({model: directory});
    }

    function initializeTeamDirectory() {
        var directory = new TeamDirectory();
        var directoryBrowser = new TeamDirectoryBrowser({model: directory});
    }

    function initializeTracker() {
        pm.tracker = new Tracker();
    }

    function initializeUser() {
        var header = new Header();

        var user = new User();
        pm.user = user;
        
        var SyncDataDeleteModal = new UserSyncDataDeleteModal({model: user});
        var UnsyncedDataDeleteModal = new UserUnsyncedDataDeleteModal({model:user});

        var userStatus = new UserStatus({model: user});
        var userCollections = new UserCollections({model: user});
    }

    pm.mediator = new Mediator();

    // Local storage or chrome.storage
    initializeStorage();
    initializePurchases();

    // Current app window
    pm.appWindow = new AppWindow();
    pm.settings = new Settings();
    var legal = new Legal();

    // RequestMethods is not being used right now
	var oldThis = this;
    pm.methods = new RequestMethods(function() {
        pm.settings.init(function() {
            //set a unique ID for this INSTALLATION of the app
            if(!pm.settings.getSetting("installation_id")) {
                pm.settings.setSetting("installation_id", guid());
            }

            var settingsModal = new SettingsModal({model: pm.settings});

            // TODO
            // Initialize theme here
            pm.themeManager = new ThemeManager();

            pm.filesystem.init();
            pm.indexedDB.open(function() {

	            initializeSync();
                initializePostmanAPI();
                initializeRequester();
                initializeInterceptor();
                initializeHistory();
                initializeCollections();
                initializeTester();

                initializeEnvironments();
                initializeHeaderPresets();

                initializeSidebar();

                pm.broadcasts.init();

                initializeDriveSync();
                initializeUser();
                initializeDirectory();
                initializeTeamDirectory();

                initializeTracker();

                initializeTCPReader();

                pm.hasPostmanInitialized = true;

                pm.mediator.trigger("postmanInitialized");

                // This is actually used somewhere
                try {
                    pm.gaClientId = window.fu;                    
                }
                catch(e) {
                    // console.log("Could not find client id for GA");
                }                
            });
        });
    });
};

var GruntLiveReload = GruntLiveReload || {};
GruntLiveReload.init = function() {
  var ws = new WebSocket("ws://localhost:35729/livereload");
  ws.onopen = function() {
    console.log("LiveReload WebSocket initialized and ready.");
  };
  ws.onmessage = function(evt) {
    var wsData = JSON.parse(evt.data);
    if (wsData.command == "reload") {
      chrome.runtime.reload();
    } else {
      console.log("LiveReload Message", evt.data);
    }
  };
  ws.onerror = function(evt) {
    console.error("LiveReload WebSocket Error", evt);
  };
};

// GruntLiveReload.init();

$(document).ready(function () {
    pm.init();
});