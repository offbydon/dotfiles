var RequestURLEditor = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        var editorId;
        editorId = "#url-keyvaleditor";

        this.editorId = editorId;

        model.on("change:url", this.onChangeUrl, this);
        model.on("updateURLInputText", this.onUpdateURLInputText, this);
        model.on("startNew", this.onStartNew, this);
        model.on("customURLParamUpdate", this.onCustomUrlParamUpdate, this);

	    var params = {
		    placeHolderKey:"URL Parameter Key",
		    placeHolderValue:"Value",
		    deleteButton:'<span class="icon-delete"/>',
		    encodeValues: false,
		    disableOption: false,
		    onDeleteRow:function () {
			    var params = view.getUrlEditorParams();
			    // TODO Simplify this
			    model.set("url", $("#url").val());
			    model.setUrlParams(params);
			    model.setUrlParamString(params, true);
		    },

		    onBlurElement:function () {
			    var params = view.getUrlEditorParams();
			    var url = $("#url").val();
			    model.setUrlParams(params);
			    model.setUrlParamString(params, true, url);
		    }
	    };

        $(editorId).keyvalueeditor('init', params);

        $('#url').keyup(function () {
            var newRows = getUrlVars($('#url').val(), false);
            $('#url-keyvaleditor').keyvalueeditor('reset', newRows);
        });

        $("#url-keyvaleditor .icon-bulk-edit").on("click", function() {
            pm.tracker.trackEvent("request", "bulk_edit", "url_params");
        });

        var urlFocusHandler = function () {
            pm.tracker.trackEvent("interaction", "shortcut", "url_input_focus");

            if(pm.app.isModalOpen()) {
                return;
            }

            $('#url').focus();
            return false;
        };

        try {
            $("#url").autocomplete({
                source: pm.urlCache.getUrls(),
                delay: 50,
                select: function(event, ui) {
                    $("#url").attr("data-cancel-enter", "true");
                    return false;
                }
            });
        }
        catch(e) {

        }

        $(document).bind('keydown', 'backspace', urlFocusHandler);
    },

    onCustomUrlParamUpdate: function() {
        this.openUrlEditor();
    },

    onUpdateURLInputText: function() {
        var url = this.model.get("url");
        $("#url").val(url);
    },

    onChangeUrl: function() {
        var url = this.model.get("url");
        $("#url").val(url);

        var newRows = getUrlVars(url, false);
        $('#url-keyvaleditor').keyvalueeditor('reset', newRows);
    },

    onStartNew: function(model) {
        $("#url").val("");
        var newRows = [];
        $(this.editorId).keyvalueeditor('reset', newRows);
        $('#url').focus();
    },

    updateModel: function() {
        this.model.set("url", $("#url").val());
        this.model.setUrlParamString(this.getUrlEditorParams(), true);
    },

    openAndInitUrlEditor: function() {
        var newRows = getUrlVars($('#url').val(), false);
        $("#url-keyvaleditor").keyvalueeditor('reset', newRows);
        this.openUrlEditor();
    },

    openUrlEditor:function () {
        $('#url-keyvaleditor-actions-open').addClass("active");
        var containerId = "#url-keyvaleditor-container";
        $(containerId).css("display", "block");
    },

    closeUrlEditor:function () {
        $('#url-keyvaleditor-actions-open').removeClass("active");
        var containerId = "#url-keyvaleditor-container";
        $(containerId).css("display", "none");
    },

    getUrlEditorParams:function () {
        var editorId = "#url-keyvaleditor";
        var params = $(editorId).keyvalueeditor('getValues');
        var newParams = [];
        for (var i = 0; i < params.length; i++) {
            var param = {
                //key:encodeURIComponent(params[i].key).replace(/%7B%7B/,"{{").replace(/%7D%7D/,"}}"),
                //value:encodeURIComponent(params[i].value).replace(/%7B%7B/,"{{").replace(/%7D%7D/,"}}").replace(/%3B/,";")
                key:params[i].key,
                value:params[i].value
            };

            newParams.push(param);
        }

        return newParams;
    }
});