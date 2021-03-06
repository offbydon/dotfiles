"use strict";

/* jshint newcap:false */
var __hasProp = ({}).hasOwnProperty;

module.exports["extends"] = function (child, parent) {
  for (var key in parent) {
    if (__hasProp.call(parent, key)) {
      child[key] = parent[key];
    }
  }
  function ctor() {
    /* jshint validthis:true */
    this.constructor = child;
  }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  child.__super__ = parent.prototype;
  return child;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL29wcy8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvY3Njb21wYXRhYmlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7O0FBR2IsSUFBSSxTQUFTLEdBQUcsQ0FBQSxHQUFFLENBQUMsY0FBYyxDQUFDOztBQUVsQyxNQUFNLENBQUMsT0FBTyxXQUFRLEdBQUcsVUFBUyxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQy9DLE9BQUssSUFBSSxHQUFHLElBQUksTUFBTSxFQUFFO0FBQ3RCLFFBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUU7QUFDL0IsV0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMxQjtHQUNGO0FBQ0QsV0FBUyxJQUFJLEdBQUc7O0FBRWQsUUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7R0FDMUI7QUFDRCxNQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbEMsT0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQzdCLE9BQUssQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNuQyxTQUFPLEtBQUssQ0FBQztDQUNkLENBQUMiLCJmaWxlIjoiL2hvbWUvb3BzLy5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi9jc2NvbXBhdGFiaWxpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbi8qIGpzaGludCBuZXdjYXA6ZmFsc2UgKi9cbnZhciBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxubW9kdWxlLmV4cG9ydHMuZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHtcbiAgZm9yICh2YXIga2V5IGluIHBhcmVudCkge1xuICAgIGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIHtcbiAgICAgIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gY3RvcigpIHtcbiAgICAvKiBqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7XG4gIH1cbiAgY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlO1xuICBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpO1xuICBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlO1xuICByZXR1cm4gY2hpbGQ7XG59O1xuIl19