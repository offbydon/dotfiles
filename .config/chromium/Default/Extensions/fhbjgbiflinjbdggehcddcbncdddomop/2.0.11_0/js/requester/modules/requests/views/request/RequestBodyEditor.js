var RequestBodyEditor = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;
        var body = model.get("body");

        model.on("change:method", this.onChangeMethod, this);

        body.on("change:dataMode", this.onChangeDataMode, this);
        body.on("change:data", this.onChangeData, this);

        this.bodyFormDataEditor = new RequestBodyFormDataEditor({model: this.model});
        this.bodyURLEncodedEditor = new RequestBodyURLEncodedEditor({model: this.model});
        this.bodyRawEditor = new RequestBodyRawEditor({model: this.model});
        this.bodyBinaryEditor = new RequestBodyBinaryEditor({model: this.model});

        $('#data-mode-selector').on("click", "a", function () {
            pm.tracker.trackEvent("request", "body", "data_modes");

            var mode = $(this).attr("data-mode");
            view.setDataMode(mode);
        });

        $('#body-editor-mode-selector .dropdown-menu').on("click", "a", function (event) {
            var editorMode = $(event.target).attr("data-editor-mode");
            var language = $(event.target).attr("data-language");
            view.bodyRawEditor.setEditorMode(editorMode, language, true);
        });

        // 'Format code' button listener.
        $('#body-editor-mode-selector-format').on('click.postman', function(evt) {
            var editorMode = $(event.target).attr("data-editor-mode");

            if ($(evt.currentTarget).hasClass('disabled')) {
                return;
            }
        });

        var type = pm.settings.getSetting("requestBodyEditorContainerType");
        $('#request-body-editor-container-type a').removeClass('active');
        $('#request-body-editor-container-type a[data-container-type="' + type + '"]').addClass('active');

        $('#request-body-editor-container-type').on('click', 'a', function(evt) {
            var type = $(this).attr('data-container-type');
            pm.settings.setSetting("requestBodyEditorContainerType", type);
        });


        $(document).bind('keydown', 'p', function () {
            pm.tracker.trackEvent("interaction", "shortcut", "add_formdata_row");

            if(pm.app.isModalOpen()) {
                return;
            }

            if (model.isMethodWithBody(model.get("method"))) {
                $('#formdata-keyvaleditor div:first-child input:first-child').focus();
                return false;
            }
        });

        this.setDataMode("params");
    },

    onChangeData: function() {
    },

    resetBody: function() {
        this.bodyRawEditor.resetBody();
    },

    getRequestBodyPreview: function() {
        var body = this.model.get("body");
        var dataMode = body.get("dataMode");

        if (dataMode === 'raw') {
            var rawBodyData = body.get("data");
            rawBodyData = htmlEncode(rawBodyData);
            rawBodyData = pm.envManager.getCurrentValue(rawBodyData);
            return rawBodyData;
        }
        else if (dataMode === 'params') {
            var formDataBody = this.bodyFormDataEditor.getFormDataPreview(false);
            if(formDataBody !== false) {
                return formDataBody;
            }
            else {
                return false;
            }
        }
        else if (dataMode === 'urlencoded') {
            var urlEncodedBodyData = this.bodyURLEncodedEditor.getUrlEncodedBody(false);
            if(urlEncodedBodyData !== false) {
                return urlEncodedBodyData;
            }
            else {
                return false;
            }
        }
    },

    // TODO
    // Set transformedData here?
    getRequestBodyToBeSent: function(getDisabled) {
        var model = this.model;
        var body = model.get("body");

        var dataMode = body.get("dataMode");

        if (dataMode === 'raw') {
            var rawBodyData = _.clone(this.getData(true));
            rawBodyData = pm.envManager.getCurrentValue(rawBodyData);

            body.set("transformedData", rawBodyData);

            return rawBodyData;
        }
        else if (dataMode === 'params') {
            var formDataBody = this.bodyFormDataEditor.getFormDataBody(getDisabled);

            if(formDataBody !== false) {
                return formDataBody;
            }
            else {
                return false;
            }
        }
        else if (dataMode === 'urlencoded') {
            var urlEncodedBodyData = this.bodyURLEncodedEditor.getUrlEncodedBody(getDisabled);
            if(urlEncodedBodyData !== false) {
                return urlEncodedBodyData;
            }
            else {
                return false;
            }
        }
        else if (dataMode === 'binary') {
            var binaryBody = this.bodyBinaryEditor.getBinaryBody();
            return binaryBody;
        }
    },

    // TODO
    // URGENT
    // Refactor this. Figure out why it's needed when the value
    // is being obtained from editors in another place
    // Gets data from the key value editors
    getData:function (asObjects, getDisabled) {
        var model = this.model;
        var body = this.model.get("body");
        var mode = body.get("dataMode");

        var data;
        var params;
        var newParams;
        var param;
        var i;

        if (mode === "params") {
            params = $('#formdata-keyvaleditor').keyvalueeditor('getValues');
            newParams = [];
            for (i = 0; i < params.length; i++) {
                if(getDisabled==false && params[i].enabled==false) {
                    continue;
                }
                param = {
                    key:params[i].key,
                    value:params[i].value,
                    type:params[i].type,
                    enabled: params[i].enabled
                };

                newParams.push(param);
            }

            if(asObjects === true) {
                return newParams;
            }
            else {
                data = model.getBodyParamString(newParams);
            }
        }
        else if (mode === "raw") {
            data = this.bodyRawEditor.getRawData();
        }
        else if (mode === "urlencoded") {
            params = $('#urlencoded-keyvaleditor').keyvalueeditor('getValues');
            newParams = [];
            for (i = 0; i < params.length; i++) {
                if(getDisabled==false && params[i].enabled==false) {
                    continue;
                }
                param = {
                    key:params[i].key,
                    value:params[i].value,
                    type:params[i].type,
                    enabled: params[i].enabled
                };

                newParams.push(param);
            }

            if(asObjects === true) {
                return newParams;
            }
            else {
                data = model.getBodyParamString(newParams);
            }
        }

        return data;
    },

    // TODO Needs to be in this order for updating the data property
    updateModel: function(getDisabled) {
        var body = this.model.get("body");
        var dataMode = body.get("dataMode");
        var data = this.getRequestBodyToBeSent(getDisabled);

        body.set("data", this.getData(true, getDisabled));

        // TODO
        // Transform data first and then set dataToBeSent
        body.set("dataToBeSent", this.getRequestBodyToBeSent(getDisabled));

        if (dataMode === "urlencoded") {
            body.set("transformedData", getBodyVars(body.get("dataToBeSent")));
        }

        var dataAsObjects = this.getData(true, getDisabled);

        // TODO
        // Triggers change in dataAsObjects which causes form-data to refresh and lose files
        body.set("dataAsObjects", dataAsObjects, { silent: true });

        var dataAsPreview = this.getRequestBodyPreview();
        body.set("dataAsPreview", dataAsPreview);

        // TODO
        // Only needed for form-data. What about params?
        var useInterceptor = pm.settings.getSetting("useInterceptor");

        if (useInterceptor) {
            if (dataMode === "params") {
                var serializedFormData = this.bodyFormDataEditor.getSerializedFormDataBody();
                body.set("serializedData", serializedFormData);
            }
        }
    },

    openFormDataEditor:function () {
        var containerId = "#formdata-keyvaleditor-container";
        $(containerId).css("display", "block");

        var editorId = "#formdata-keyvaleditor";
        var params = $(editorId).keyvalueeditor('getValues');
        var newParams = [];
        for (var i = 0; i < params.length; i++) {
            var param = {
                key:params[i].key,
                value:params[i].value
            };

            newParams.push(param);
        }
    },

    closeFormDataEditor:function () {
        var containerId = "#formdata-keyvaleditor-container";
        $(containerId).css("display", "none");
    },

    openUrlEncodedEditor:function () {
        var containerId = "#urlencoded-keyvaleditor-container";
        $(containerId).css("display", "block");

        var editorId = "#urlencoded-keyvaleditor";
        var params = $(editorId).keyvalueeditor('getValues');
        var newParams = [];
        for (var i = 0; i < params.length; i++) {
            var param = {
                key:params[i].key,
                value:params[i].value
            };

            newParams.push(param);
        }
    },

    closeUrlEncodedEditor:function () {
        var containerId = "#urlencoded-keyvaleditor-container";
        $(containerId).css("display", "none");
    },

    onChangeMethod: function(event) {
        var method = this.model.get("method");

        if (this.model.isMethodWithBody(method)) {
            $("#data").css("display", "block");
        } else {
            $("#data").css("display", "none");
        }
    },

    onChangeDataMode: function(event) {
        var body = this.model.get("body");
        var dataMode = body.get("dataMode");
        this.setDataMode(dataMode);
    },

    setDataMode:function (mode) {
        var model = this.model;
        var view = this;
        var body = this.model.get("body");

        body.set("dataMode", mode);

        $('#data-mode-selector a').removeClass("active");
        $('#data-mode-selector a[data-mode="' + mode + '"]').addClass("active");

        $("#body-editor-mode-selector").css("display", "none");
        if (mode === "params") {
            view.openFormDataEditor();
            view.closeUrlEncodedEditor();
            $('#body-data-container').css("display", "none");
            $('#body-data-binary-container').css("display", "none");
        }
        else if (mode === "raw") {
            view.closeUrlEncodedEditor();
            view.closeFormDataEditor();
            $('#body-data-container').css("display", "block");

            var isEditorInitialized = body.get("isEditorInitialized");
            var codeMirror = body.get("codeMirror");
            if (isEditorInitialized === false) {
                view.bodyRawEditor.initCodeMirrorEditor();
            }
            else {
                //codeMirror.refresh();
            }

            $("#body-editor-mode-selector").css("display", "block");
            $('#body-data-binary-container').css("display", "none");
        }
        else if (mode === "urlencoded") {
            view.closeFormDataEditor();
            view.openUrlEncodedEditor();
            $('#body-data-container').css("display", "none");
            $('#body-data-binary-container').css("display", "none");
        }
        else if (mode === "binary") {
            view.closeFormDataEditor();
            view.closeUrlEncodedEditor();
            $('#body-data-container').css("display", "none");
            $('#body-data-binary-container').css("display", "block");
        }
    },
});