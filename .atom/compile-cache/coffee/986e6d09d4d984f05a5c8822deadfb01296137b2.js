(function() {
  var MakeDialog, VirtualenvListView, VirtualenvManger, VirtualenvView;

  VirtualenvView = require('./virtualenv-view');

  VirtualenvListView = require('./virtualenv-list-view');

  VirtualenvManger = require('./virtualenv-manager');

  MakeDialog = require('./virtualenv-dialog');

  module.exports = {
    manager: new VirtualenvManger(),
    activate: function(state) {
      var cmd;
      cmd = 'select-virtualenv:';
      this.manager.on('options', function(options) {
        var i, items;
        items = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = options.length; _i < _len; _i++) {
            i = options[_i];
            _results.push({
              label: i.name,
              command: cmd + i.name
            });
          }
          return _results;
        })();
        items = [
          {
            type: 'separator'
          }
        ].concat(items);
        return atom.menu.add([
          {
            label: 'Packages',
            submenu: [
              {
                label: 'Virtualenv',
                submenu: items
              }
            ]
          }
        ]);
      });
      return atom.packages.once('activated', (function(_this) {
        return function() {
          var statusBar;
          atom.workspaceView.command('virtualenv:make', function() {
            return (new MakeDialog(_this.manager)).attach();
          });
          atom.workspaceView.command('virtualenv:select', function() {
            return _this.manager.emit('selector:show');
          });
          atom.workspaceView.command('virtualenv:deactivate', function() {
            return _this.manager.deactivate();
          });
          statusBar = atom.workspaceView.statusBar;
          if (statusBar != null) {
            _this.virtualenv = new VirtualenvView(statusBar, _this.manager);
            statusBar.prependLeft(_this.virtualenv);
          }
          _this.manager.on('selector:show', function() {
            var view;
            view = new VirtualenvListView(_this.manager);
            return view.attach();
          });
          return console.log("virtualenv activated");
        };
      })(this));
    }
  };

}).call(this);
