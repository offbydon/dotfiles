"use strict";

var fs = require("fs");

module.exports.isEligable = function (path) {
  return fs.existsSync(path + "/Cargo.toml");
};

module.exports.settings = function (path) {
  return {
    exec: "cargo",
    args: ["build"],
    sh: false,
    errorMatch: "^(?<file>[^\\.]+.rs):(?<line>\\d+):(?<col>\\d+):"
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL29wcy8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvdG9vbHMvQ2FyZ28uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUViLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFdkIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsVUFBVSxJQUFJLEVBQUU7QUFDMUMsU0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsQ0FBQztDQUM1QyxDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxHQUFHLFVBQVUsSUFBSSxFQUFFO0FBQ3hDLFNBQU87QUFDTCxRQUFJLEVBQUUsT0FBTztBQUNiLFFBQUksRUFBRSxDQUFFLE9BQU8sQ0FBRTtBQUNqQixNQUFFLEVBQUUsS0FBSztBQUNULGNBQVUsRUFBRSxrREFBa0Q7R0FDL0QsQ0FBQztDQUNILENBQUMiLCJmaWxlIjoiL2hvbWUvb3BzLy5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi90b29scy9DYXJnby5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcblxubW9kdWxlLmV4cG9ydHMuaXNFbGlnYWJsZSA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gIHJldHVybiBmcy5leGlzdHNTeW5jKHBhdGggKyAnL0NhcmdvLnRvbWwnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLnNldHRpbmdzID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgcmV0dXJuIHtcbiAgICBleGVjOiAnY2FyZ28nLFxuICAgIGFyZ3M6IFsgJ2J1aWxkJyBdLFxuICAgIHNoOiBmYWxzZSxcbiAgICBlcnJvck1hdGNoOiAnXig/PGZpbGU+W15cXFxcLl0rLnJzKTooPzxsaW5lPlxcXFxkKyk6KD88Y29sPlxcXFxkKyk6J1xuICB9O1xufTtcbiJdfQ==