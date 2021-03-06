"use strict";

var View = require("atom-space-pen-views").View;
var cscompatability = require("./cscompatability");

module.exports = (function () {
  function SaveConfirmView() {
    View.apply(this, arguments);
  }

  cscompatability["extends"](SaveConfirmView, View);

  SaveConfirmView.content = function () {
    SaveConfirmView.div({ "class": "build-confirm overlay from-top" }, function () {
      SaveConfirmView.h3("You have unsaved changes");
      SaveConfirmView.div({ "class": "btn-container pull-right" }, function () {
        SaveConfirmView.button({ "class": "btn btn-success", outlet: "saveBuildButton", title: "Save and Build", click: "saveAndConfirm" }, "Save and build");
        SaveConfirmView.button({ "class": "btn btn-info", title: "Build Without Saving", click: "confirmWithoutSave" }, "Build Without Saving");
      });
      SaveConfirmView.div({ "class": "btn-container pull-left" }, function () {
        SaveConfirmView.button({ "class": "btn btn-info", title: "Cancel", click: "cancel" }, "Cancel");
      });
    });
  };

  SaveConfirmView.prototype.destroy = function () {
    this.confirmcb = undefined;
    this.cancelcb = undefined;
    if (this.panel) {
      this.panel.destroy();
      this.panel = null;
    }
  };

  SaveConfirmView.prototype.show = function (confirmcb, cancelcb) {
    this.confirmcb = confirmcb;
    this.cancelcb = cancelcb;

    this.panel = atom.workspace.addTopPanel({
      item: this
    });
    this.saveBuildButton.focus();
  };

  SaveConfirmView.prototype.cancel = function () {
    this.destroy();
    if (this.cancelcb) {
      this.cancelcb();
    }
  };

  SaveConfirmView.prototype.saveAndConfirm = function () {
    if (this.confirmcb) {
      this.confirmcb(true);
    }
    this.destroy();
  };

  SaveConfirmView.prototype.confirmWithoutSave = function () {
    if (this.confirmcb) {
      this.confirmcb(false);
    }
    this.destroy();
  };

  return SaveConfirmView;
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL29wcy8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvc2F2ZS1jb25maXJtLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUViLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNoRCxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7QUFFbkQsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLFlBQVc7QUFDM0IsV0FBUyxlQUFlLEdBQUc7QUFDekIsUUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7R0FDN0I7O0FBRUQsaUJBQWUsV0FBUSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFL0MsaUJBQWUsQ0FBQyxPQUFPLEdBQUcsWUFBVztBQUNuQyxtQkFBZSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFNBQU8sZ0NBQWdDLEVBQUUsRUFBRSxZQUFXO0FBQzFFLHFCQUFlLENBQUMsRUFBRSxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDL0MscUJBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxTQUFPLDBCQUEwQixFQUFFLEVBQUUsWUFBVztBQUNwRSx1QkFBZSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFNBQU8saUJBQWlCLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3BKLHVCQUFlLENBQUMsTUFBTSxDQUFDLEVBQUUsU0FBTyxjQUFjLEVBQUUsS0FBSyxFQUFFLHNCQUFzQixFQUFFLEtBQUssRUFBRSxvQkFBb0IsRUFBRSxFQUFFLHNCQUFzQixDQUFDLENBQUM7T0FDdkksQ0FBQyxDQUFDO0FBQ0gscUJBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxTQUFPLHlCQUF5QixFQUFFLEVBQUUsWUFBVztBQUNuRSx1QkFBZSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFNBQU8sY0FBYyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO09BQy9GLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKLENBQUM7O0FBRUYsaUJBQWUsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFlBQVc7QUFDN0MsUUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDM0IsUUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7QUFDMUIsUUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2QsVUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNyQixVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztLQUNuQjtHQUNGLENBQUM7O0FBRUYsaUJBQWUsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFVBQVMsU0FBUyxFQUFFLFFBQVEsRUFBRTtBQUM3RCxRQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMzQixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFekIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztBQUN0QyxVQUFJLEVBQUUsSUFBSTtLQUNYLENBQUMsQ0FBQztBQUNILFFBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDOUIsQ0FBQzs7QUFFRixpQkFBZSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsWUFBVztBQUM1QyxRQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDZixRQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakIsVUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ2pCO0dBQ0YsQ0FBQzs7QUFFRixpQkFBZSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEdBQUcsWUFBVztBQUNwRCxRQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDbEIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN0QjtBQUNELFFBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUNoQixDQUFDOztBQUVGLGlCQUFlLENBQUMsU0FBUyxDQUFDLGtCQUFrQixHQUFJLFlBQVc7QUFDekQsUUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2xCLFVBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDdkI7QUFDRCxRQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7R0FDaEIsQ0FBQzs7QUFFRixTQUFPLGVBQWUsQ0FBQztDQUN4QixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiIvaG9tZS9vcHMvLmF0b20vcGFja2FnZXMvYnVpbGQvbGliL3NhdmUtY29uZmlybS12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVmlldyA9IHJlcXVpcmUoJ2F0b20tc3BhY2UtcGVuLXZpZXdzJykuVmlldztcbnZhciBjc2NvbXBhdGFiaWxpdHkgPSByZXF1aXJlKCcuL2NzY29tcGF0YWJpbGl0eScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gU2F2ZUNvbmZpcm1WaWV3KCkge1xuICAgIFZpZXcuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIGNzY29tcGF0YWJpbGl0eS5leHRlbmRzKFNhdmVDb25maXJtVmlldywgVmlldyk7XG5cbiAgU2F2ZUNvbmZpcm1WaWV3LmNvbnRlbnQgPSBmdW5jdGlvbigpIHtcbiAgICBTYXZlQ29uZmlybVZpZXcuZGl2KHsgY2xhc3M6ICdidWlsZC1jb25maXJtIG92ZXJsYXkgZnJvbS10b3AnIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgU2F2ZUNvbmZpcm1WaWV3LmgzKCdZb3UgaGF2ZSB1bnNhdmVkIGNoYW5nZXMnKTtcbiAgICAgIFNhdmVDb25maXJtVmlldy5kaXYoeyBjbGFzczogJ2J0bi1jb250YWluZXIgcHVsbC1yaWdodCcgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIFNhdmVDb25maXJtVmlldy5idXR0b24oe8KgY2xhc3M6ICdidG4gYnRuLXN1Y2Nlc3MnLCBvdXRsZXQ6ICdzYXZlQnVpbGRCdXR0b24nLCB0aXRsZTogJ1NhdmUgYW5kIEJ1aWxkJywgY2xpY2s6ICdzYXZlQW5kQ29uZmlybScgfSwgJ1NhdmUgYW5kIGJ1aWxkJyk7XG4gICAgICAgIFNhdmVDb25maXJtVmlldy5idXR0b24oe8KgY2xhc3M6ICdidG4gYnRuLWluZm8nLCB0aXRsZTogJ0J1aWxkIFdpdGhvdXQgU2F2aW5nJywgY2xpY2s6ICdjb25maXJtV2l0aG91dFNhdmUnIH0sICdCdWlsZCBXaXRob3V0IFNhdmluZycpO1xuICAgICAgfSk7XG4gICAgICBTYXZlQ29uZmlybVZpZXcuZGl2KHsgY2xhc3M6ICdidG4tY29udGFpbmVyIHB1bGwtbGVmdCcgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIFNhdmVDb25maXJtVmlldy5idXR0b24oe8KgY2xhc3M6ICdidG4gYnRuLWluZm8nLCB0aXRsZTogJ0NhbmNlbCcsIGNsaWNrOiAnY2FuY2VsJyB9LCAnQ2FuY2VsJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICBTYXZlQ29uZmlybVZpZXcucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNvbmZpcm1jYiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmNhbmNlbGNiID0gdW5kZWZpbmVkO1xuICAgIGlmICh0aGlzLnBhbmVsKSB7XG4gICAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMucGFuZWwgPSBudWxsO1xuICAgIH1cbiAgfTtcblxuICBTYXZlQ29uZmlybVZpZXcucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbihjb25maXJtY2IsIGNhbmNlbGNiKSB7XG4gICAgdGhpcy5jb25maXJtY2IgPSBjb25maXJtY2I7XG4gICAgdGhpcy5jYW5jZWxjYiA9IGNhbmNlbGNiO1xuXG4gICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZFRvcFBhbmVsKHtcbiAgICAgIGl0ZW06IHRoaXNcbiAgICB9KTtcbiAgICB0aGlzLnNhdmVCdWlsZEJ1dHRvbi5mb2N1cygpO1xuICB9O1xuXG4gIFNhdmVDb25maXJtVmlldy5wcm90b3R5cGUuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5kZXN0cm95KCk7XG4gICAgaWYgKHRoaXMuY2FuY2VsY2IpIHtcbiAgICAgIHRoaXMuY2FuY2VsY2IoKTtcbiAgICB9XG4gIH07XG5cbiAgU2F2ZUNvbmZpcm1WaWV3LnByb3RvdHlwZS5zYXZlQW5kQ29uZmlybSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmNvbmZpcm1jYikge1xuICAgICAgdGhpcy5jb25maXJtY2IodHJ1ZSk7XG4gICAgfVxuICAgIHRoaXMuZGVzdHJveSgpO1xuICB9O1xuXG4gIFNhdmVDb25maXJtVmlldy5wcm90b3R5cGUuY29uZmlybVdpdGhvdXRTYXZlID0gIGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmNvbmZpcm1jYikge1xuICAgICAgdGhpcy5jb25maXJtY2IoZmFsc2UpO1xuICAgIH1cbiAgICB0aGlzLmRlc3Ryb3koKTtcbiAgfTtcblxuICByZXR1cm4gU2F2ZUNvbmZpcm1WaWV3O1xufSkoKTtcbiJdfQ==