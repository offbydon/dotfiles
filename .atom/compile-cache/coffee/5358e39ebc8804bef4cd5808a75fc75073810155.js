(function() {
  var SelectListView, VirtualenvListView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SelectListView = require('atom').SelectListView;

  module.exports = VirtualenvListView = (function(_super) {
    __extends(VirtualenvListView, _super);

    function VirtualenvListView() {
      return VirtualenvListView.__super__.constructor.apply(this, arguments);
    }

    VirtualenvListView.prototype.initialize = function(manager) {
      this.manager = manager;
      VirtualenvListView.__super__.initialize.apply(this, arguments);
      this.addClass('virtualenv-selector from-top overlay');
      this.list.addClass('mark-active');
      this.subscribe(this, 'virtualenv:select', (function(_this) {
        return function() {
          _this.cancel();
          return false;
        };
      })(this));
      return this.setItems(this.manager.options);
    };

    VirtualenvListView.prototype.getFilterKey = function() {
      return 'name';
    };

    VirtualenvListView.prototype.viewForItem = function(env) {
      var element;
      element = document.createElement('li');
      if (env.name === this.manager.env) {
        element.classList.add('active');
      }
      element.textContent = env.name;
      return element;
    };

    VirtualenvListView.prototype.confirmed = function(env) {
      this.manager.change(env);
      return this.cancel();
    };

    VirtualenvListView.prototype.attach = function() {
      this.storeFocusedElement();
      atom.workspaceView.append(this);
      return this.focusFilterEditor();
    };

    return VirtualenvListView;

  })(SelectListView);

}).call(this);
