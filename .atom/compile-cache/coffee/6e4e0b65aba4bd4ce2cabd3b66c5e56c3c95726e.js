(function() {
  var GrammarUtils, ScriptOptions, ScriptOptionsView, ScriptView;

  ScriptView = require('./script-view');

  ScriptOptionsView = require('./script-options-view');

  ScriptOptions = require('./script-options');

  GrammarUtils = require('./grammar-utils');

  module.exports = {
    config: {
      enableExecTime: {
        title: 'Output the time it took to execute the script',
        type: 'boolean',
        "default": true
      },
      escapeConsoleOutput: {
        title: 'HTML escape console output',
        type: 'boolean',
        "default": true
      },
      scrollWithOutput: {
        title: 'Scroll with output',
        type: 'boolean',
        "default": true
      }
    },
    scriptView: null,
    scriptOptionsView: null,
    scriptOptions: null,
    activate: function(state) {
      this.scriptOptions = new ScriptOptions();
      this.scriptView = new ScriptView(state.scriptViewState, this.scriptOptions);
      this.scriptOptionsView = new ScriptOptionsView(this.scriptOptions);
      return atom.workspaceView.on('core:cancel core:close', (function(_this) {
        return function(event) {
          var _ref, _ref1;
          if ((_ref = _this.scriptView) != null) {
            _ref.close();
          }
          return (_ref1 = _this.scriptOptionsView) != null ? _ref1.close() : void 0;
        };
      })(this));
    },
    deactivate: function() {
      GrammarUtils.deleteTempFiles();
      this.scriptView.close();
      this.scriptOptionsView.close();
      return atom.workspaceView.off('core:cancel core:close');
    },
    serialize: function() {
      return {
        scriptViewState: this.scriptView.serialize(),
        scriptOptionsViewState: this.scriptOptionsView.serialize()
      };
    }
  };

}).call(this);
