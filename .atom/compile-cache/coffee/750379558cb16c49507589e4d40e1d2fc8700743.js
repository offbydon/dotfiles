(function() {
  var View, VirtualenvView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  module.exports = VirtualenvView = (function(_super) {
    __extends(VirtualenvView, _super);

    function VirtualenvView() {
      this.update = __bind(this.update, this);
      return VirtualenvView.__super__.constructor.apply(this, arguments);
    }

    VirtualenvView.content = function() {
      return this.a({
        href: '#',
        "class": 'inline-block virtualenv'
      });
    };

    VirtualenvView.prototype.initialize = function(statusBar, manager) {
      this.statusBar = statusBar;
      this.manager = manager;
      this.subscribe(this.statusBar, 'active-buffer-changed', this.update);
      this.subscribe(atom.workspace.eachEditor((function(_this) {
        return function(editor) {
          return _this.subscribe(editor, 'grammar-changed', function() {
            if (editor === atom.workspace.getActiveEditor()) {
              return _this.update();
            }
          });
        };
      })(this)));
      this.subscribe(this, 'click', (function(_this) {
        return function() {
          _this.manager.emit('selector:show');
          return false;
        };
      })(this));
      return this.manager.on('virtualenv:changed', this.update);
    };

    VirtualenvView.prototype.afterAttach = function() {
      return this.update();
    };

    VirtualenvView.prototype.update = function() {
      var grammar, _ref;
      grammar = (_ref = atom.workspace.getActiveEditor()) != null ? typeof _ref.getGrammar === "function" ? _ref.getGrammar() : void 0 : void 0;
      if ((grammar != null) && grammar.name === 'Python') {
        return this.text(this.manager.env).show();
      } else {
        return this.hide();
      }
    };

    VirtualenvView.prototype.serialize = function() {};

    VirtualenvView.prototype.destroy = function() {
      return this.detach();
    };

    return VirtualenvView;

  })(View);

}).call(this);
