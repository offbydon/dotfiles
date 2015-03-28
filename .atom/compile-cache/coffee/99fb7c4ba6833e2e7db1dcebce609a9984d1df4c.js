(function() {
  var $, EditorView, MakeDialog, View, exec, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), $ = _ref.$, EditorView = _ref.EditorView, View = _ref.View;

  path = require('path');

  exec = (require('child_process')).exec;

  module.exports = MakeDialog = (function(_super) {
    __extends(MakeDialog, _super);

    function MakeDialog() {
      return MakeDialog.__super__.constructor.apply(this, arguments);
    }

    MakeDialog.content = function() {
      return this.div({
        "class": 'tree-view-dialog overlay from-top'
      }, (function(_this) {
        return function() {
          _this.label('Virtualenv name', {
            outlet: 'promptText'
          });
          _this.subview('miniEditor', new EditorView({
            mini: true
          }));
          return _this.div({
            "class": 'error-message',
            outlet: 'errorMessage'
          });
        };
      })(this));
    };

    MakeDialog.prototype.initialize = function(manager) {
      this.manager = manager;
      this.on('core:confirm', (function(_this) {
        return function() {
          return _this.onConfirm(_this.miniEditor.getText());
        };
      })(this));
      this.on('core:cancel', (function(_this) {
        return function() {
          return _this.cancel();
        };
      })(this));
      this.miniEditor.hiddenInput.on('focusout', (function(_this) {
        return function() {
          return _this.remove();
        };
      })(this));
      return this.miniEditor.getEditor().getBuffer().on('changed', (function(_this) {
        return function() {
          return _this.showError();
        };
      })(this));
    };

    MakeDialog.prototype.onConfirm = function(path) {
      this.manager.make(path);
      return this.close();
    };

    MakeDialog.prototype.attach = function() {
      atom.workspaceView.append(this);
      this.miniEditor.focus();
      return this.miniEditor.scrollToCursorPosition();
    };

    MakeDialog.prototype.close = function() {
      this.remove();
      return atom.workspaceView.focus();
    };

    MakeDialog.prototype.cancel = function() {
      this.remove();
      return $('.tree-view').focus();
    };

    MakeDialog.prototype.showError = function(message) {
      if (message == null) {
        message = '';
      }
      this.errorMessage.text(message);
      if (message) {
        return this.flashError();
      }
    };

    return MakeDialog;

  })(View);

}).call(this);
