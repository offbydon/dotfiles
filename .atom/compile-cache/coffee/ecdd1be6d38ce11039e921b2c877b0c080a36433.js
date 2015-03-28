(function() {
  var EventEmitter, VirtualenvManager, compare, exec, fs, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = (require('events')).EventEmitter;

  exec = (require('child_process')).exec;

  fs = require('fs');

  path = require('path');

  compare = function(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  };

  module.exports = VirtualenvManager = (function(_super) {
    __extends(VirtualenvManager, _super);

    function VirtualenvManager() {
      var wrapper;
      this.path = process.env.VIRTUAL_ENV;
      if (process.env.WORKON_HOME) {
        this.home = process.env.WORKON_HOME;
        this.setup();
      } else {
        wrapper = path.join(process.env.HOME, '.virtualenvs');
        fs.exists(wrapper, (function(_this) {
          return function(exists) {
            _this.home = exists ? wrapper : process.env.PWD;
            return _this.setup();
          };
        })(this));
      }
    }

    VirtualenvManager.prototype.setup = function() {
      var error;
      this.wrapper = Boolean(process.env.WORKON_HOME);
      if (this.path != null) {
        this.env = this.path.replace(this.home + '/', '');
      } else {
        this.env = '<None>';
      }
      try {
        fs.watch(this.home, (function(_this) {
          return function(event, filename) {
            if (event !== "change") {
              return setTimeout(function() {
                return _this.get_options();
              }, 2000);
            }
          };
        })(this));
      } catch (_error) {
        error = _error;
        console.info("Failed to setup file system watch, home = {" + this.home + "}");
        console.error(error);
      }
      this.get_options();
      return atom.packages.once('activated', (function(_this) {
        return function() {
          return _this.on('options', function(options) {
            var option, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = options.length; _i < _len; _i++) {
              option = options[_i];
              _results.push(_this.register(option));
            }
            return _results;
          });
        };
      })(this));
    };

    VirtualenvManager.prototype.register = function(option) {
      return atom.workspaceView.command('select-virtualenv:' + option.name, (function(_this) {
        return function() {
          return _this.change(option);
        };
      })(this));
    };

    VirtualenvManager.prototype.change = function(env) {
      var newPath;
      if (this.path != null) {
        newPath = this.path.replace(this.env, env.name);
        process.env.PATH = process.env.PATH.replace(this.path, newPath);
      } else {
        this.path = this.home + '/' + env.name;
        process.env.PATH = this.path + '/bin:' + process.env.PATH;
      }
      this.path = newPath;
      this.env = env.name;
      return this.emit('virtualenv:changed');
    };

    VirtualenvManager.prototype.deactivate = function() {
      process.env.PATH = process.env.PATH.replace(this.path + '/bin:', '');
      this.path = null;
      this.env = '<None>';
      return this.emit('virtualenv:changed');
    };

    VirtualenvManager.prototype.get_options = function() {
      var cmd;
      cmd = 'find . -maxdepth 3 -name activate';
      this.options = [];
      return exec(cmd, {
        'cwd': this.home
      }, (function(_this) {
        return function(error, stdout, stderr) {
          var opt, _i, _len, _ref;
          _ref = (function() {
            var _j, _len, _ref, _results;
            _ref = stdout.split('\n');
            _results = [];
            for (_j = 0, _len = _ref.length; _j < _len; _j++) {
              path = _ref[_j];
              _results.push(path.trim().split('/')[1]);
            }
            return _results;
          })();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            opt = _ref[_i];
            if (opt) {
              _this.options.push({
                'name': opt
              });
            }
          }
          _this.options.sort(compare);
          if (_this.wrapper || _this.options.length > 1) {
            _this.emit('options', _this.options);
          }
          if (_this.options.length === 1 && !_this.wrapper) {
            _this.change(_this.options[0]);
          }
          return console.log(_this.options);
        };
      })(this));
    };

    VirtualenvManager.prototype.ignore = function(path) {
      var cmd;
      if (this.wrapper) {
        return;
      }
      cmd = "echo " + path + " >> .gitignore";
      return exec(cmd, {
        'cwd': this.home
      }, function(error, stdout, stderr) {
        if (error != null) {
          return console.warn("Error adding " + path + " to ignore list");
        }
      });
    };

    VirtualenvManager.prototype.make = function(path) {
      var cmd;
      cmd = 'virtualenv ' + path;
      return exec(cmd, {
        'cwd': this.home
      }, (function(_this) {
        return function(error, stdout, stderr) {
          var option;
          if (error != null) {
            return _this.emit('error', error, stderr);
          } else {
            option = {
              name: path
            };
            _this.options.push(option);
            _this.options.sort(compare);
            _this.emit('options', _this.options);
            _this.change(option);
            return _this.ignore(path);
          }
        };
      })(this));
    };

    return VirtualenvManager;

  })(EventEmitter);

}).call(this);
