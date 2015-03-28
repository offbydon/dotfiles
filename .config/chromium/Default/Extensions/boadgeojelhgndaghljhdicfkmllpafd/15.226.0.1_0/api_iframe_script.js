var b, __GCast_isChromeBrowser = window.chrome ? !0 : !1, chrome = window.chrome || {};
chrome.cast = chrome.cast || {};
chrome.cast.media = chrome.cast.media || {};
var l = l || {};
l.global = this;
l.V = function(a) {
  return void 0 !== a;
};
l.Eb = function(a, c, d) {
  a = a.split(".");
  d = d || l.global;
  a[0] in d || !d.execScript || d.execScript("var " + a[0]);
  for (var e;a.length && (e = a.shift());) {
    !a.length && l.V(c) ? d[e] = c : d = d[e] ? d[e] : d[e] = {};
  }
};
l.dk = function(a, c) {
  l.Eb(a, c);
};
l.ba = !0;
l.Hi = "en";
l.tb = !0;
l.qf = !1;
l.ke = !l.ba;
l.yl = function(a) {
  l.Rc(a);
};
l.Rc = function(a, c) {
  l.Eb(a, c);
};
l.Kf = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
l.module = function(a) {
  if (!l.isString(a) || !a || -1 == a.search(l.Kf)) {
    throw Error("Invalid module identifier");
  }
  if (!l.wd()) {
    throw Error("Module " + a + " has been loaded incorrectly.");
  }
  if (l.D.Qb) {
    throw Error("goog.module may only be called once per module.");
  }
  l.D.Qb = a;
};
l.module.get = function(a) {
  return l.module.sg(a);
};
l.module.sg = function() {
};
l.D = null;
l.wd = function() {
  return null != l.D;
};
l.module.Bb = function() {
  if (!l.wd()) {
    throw Error("goog.module.declareTestMethods must be called from within a goog.module");
  }
  l.D.Bb = !0;
};
l.module.Tc = function() {
  l.D.Tc = !0;
};
l.Kl = function(a) {
  if (l.ke) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + (a ? ": " + a : "."));
  }
};
l.mk = function() {
};
l.vk = function(a, c) {
  for (var d = a.split("."), e = c || l.global, f;f = d.shift();) {
    if (l.td(e[f])) {
      e = e[f];
    } else {
      return null;
    }
  }
  return e;
};
l.Ak = function(a, c) {
  var d = c || l.global, e;
  for (e in a) {
    d[e] = a[e];
  }
};
l.jj = function(a, c, d, e) {
  if (l.qc) {
    var f;
    a = a.replace(/\\/g, "/");
    for (var g = l.F, h = 0;f = c[h];h++) {
      g.Fa[f] = a, g.Tb[a] = !!e;
    }
    for (e = 0;c = d[e];e++) {
      a in g.requires || (g.requires[a] = {}), g.requires[a][c] = !0;
    }
  }
};
l.fm = !1;
l.ri = !0;
l.il = function(a) {
  l.global.console && l.global.console.error(a);
};
l.require = function() {
};
l.ea = "";
l.rl = function() {
};
l.Fk = function(a) {
  return a;
};
l.hj = function() {
  throw Error("unimplemented abstract method");
};
l.kj = function(a) {
  a.sk = function() {
    if (a.od) {
      return a.od;
    }
    l.ba && (l.pd[l.pd.length] = a);
    return a.od = new a;
  };
};
l.pd = [];
l.Ge = !0;
l.lf = l.ba;
l.eh = {};
l.qc = !1;
l.qc && (l.Ng = {}, l.F = {Tb:{}, Fa:{}, requires:{}, Yd:{}, Ka:{}, Ua:{}}, l.md = function() {
  var a = l.global.document;
  return "undefined" != typeof a && "write" in a;
}, l.hg = function() {
  if (l.global.fe) {
    l.ea = l.global.fe;
  } else {
    if (l.md()) {
      for (var a = l.global.document.getElementsByTagName("script"), c = a.length - 1;0 <= c;--c) {
        var d = a[c].src, e = d.lastIndexOf("?"), e = -1 == e ? d.length : e;
        if ("base.js" == d.substr(e - 7, 7)) {
          l.ea = d.substr(0, e - 7);
          break;
        }
      }
    }
  }
}, l.Jb = function(a, c) {
  (l.global.ki || l.bi)(a, c) && (l.F.Ka[a] = !0);
}, l.De = !l.global.atob && l.global.document && l.global.document.all, l.Mg = function(a) {
  l.Jb("", 'goog.retrieveAndExecModule_("' + a + '");') && (l.F.Ka[a] = !0);
}, l.Vb = [], l.im = function(a, c) {
  return l.Ge && l.V(l.global.JSON) ? "goog.loadModule(" + l.global.JSON.stringify(c + "\n//# sourceURL=" + a + "\n") + ");" : 'goog.loadModule(function(exports) {"use strict";' + c + "\n;return exports});\n//# sourceURL=" + a + "\n";
}, l.dh = function() {
  var a = l.Vb.length;
  if (0 < a) {
    var c = l.Vb;
    l.Vb = [];
    for (var d = 0;d < a;d++) {
      l.Id(c[d]);
    }
  }
}, l.kl = function(a) {
  l.ud(a) && l.Nf(a) && l.Id(l.ea + l.Hb(a));
}, l.ud = function(a) {
  return(a = l.Hb(a)) && l.F.Tb[a] ? l.ea + a in l.F.Ua : !1;
}, l.Nf = function(a) {
  if ((a = l.Hb(a)) && a in l.F.requires) {
    for (var c in l.F.requires[a]) {
      if (!l.Yg(c) && !l.ud(c)) {
        return!1;
      }
    }
  }
  return!0;
}, l.Id = function(a) {
  if (a in l.F.Ua) {
    var c = l.F.Ua[a];
    delete l.F.Ua[a];
    l.Cg(c);
  }
}, l.fl = function(a) {
  var c = l.D;
  try {
    l.D = {Qb:void 0, Bb:!1};
    var d;
    if (l.isFunction(a)) {
      d = a.call(l.global, {});
    } else {
      if (l.isString(a)) {
        d = l.bh.call(l.global, a);
      } else {
        throw Error("Invalid module definition");
      }
    }
    var e = l.D.Qb;
    if (!l.isString(e) || !e) {
      throw Error('Invalid module name "' + e + '"');
    }
    l.D.Tc ? l.Rc(e, d) : l.lf && Object.seal && Object.seal(d);
    l.eh[e] = d;
    if (l.D.Bb) {
      for (var f in d) {
        if (0 === f.indexOf("test", 0) || "tearDown" == f || "setUp" == f || "setUpPage" == f || "tearDownPage" == f) {
          l.global[f] = d[f];
        }
      }
    }
  } finally {
    l.D = c;
  }
}, l.bh = function(a) {
  eval(a);
  return{};
}, l.bi = function(a, c) {
  if (l.md()) {
    var d = l.global.document;
    if ("complete" == d.readyState) {
      if (/\bdeps.js$/.test(a)) {
        return!1;
      }
      throw Error('Cannot write "' + a + '" after document load');
    }
    var e = l.De;
    void 0 === c ? e ? (e = " onreadystatechange='goog.onScriptLoad_(this, " + ++l.Gd + ")' ", d.write('<script type="text/javascript" src="' + a + '"' + e + ">\x3c/script>")) : d.write('<script type="text/javascript" src="' + a + '">\x3c/script>') : d.write('<script type="text/javascript">' + c + "\x3c/script>");
    return!0;
  }
  return!1;
}, l.Gd = 0, l.ul = function(a, c) {
  "complete" == a.readyState && l.Gd == c && l.dh();
  return!0;
}, l.jm = function() {
  function a(f) {
    if (!(f in e.Ka)) {
      if (!(f in e.Yd) && (e.Yd[f] = !0, f in e.requires)) {
        for (var g in e.requires[f]) {
          if (!l.Yg(g)) {
            if (g in e.Fa) {
              a(e.Fa[g]);
            } else {
              throw Error("Undefined nameToPath for " + g);
            }
          }
        }
      }
      f in d || (d[f] = !0, c.push(f));
    }
  }
  var c = [], d = {}, e = l.F, f;
  for (f in l.Ng) {
    e.Ka[f] || a(f);
  }
  for (var g = 0;g < c.length;g++) {
    f = c[g], l.F.Ka[f] = !0;
  }
  var h = l.D;
  l.D = null;
  for (g = 0;g < c.length;g++) {
    if (f = c[g]) {
      e.Tb[f] ? l.Mg(l.ea + f) : l.Jb(l.ea + f);
    } else {
      throw l.D = h, Error("Undefined script input");
    }
  }
  l.D = h;
}, l.Hb = function(a) {
  return a in l.F.Fa ? l.F.Fa[a] : null;
}, l.hg(), l.global.li || l.Jb(l.ea + "deps.js"));
l.nl = function(a) {
  a = a.split("/");
  for (var c = 0;c < a.length;) {
    "." == a[c] ? a.splice(c, 1) : c && ".." == a[c] && a[c - 1] && ".." != a[c - 1] ? a.splice(--c, 2) : c++;
  }
  return a.join("/");
};
l.Dl = function() {
};
l.I = function(a) {
  var c = typeof a;
  if ("object" == c) {
    if (a) {
      if (a instanceof Array) {
        return "array";
      }
      if (a instanceof Object) {
        return c;
      }
      var d = Object.prototype.toString.call(a);
      if ("[object Window]" == d) {
        return "object";
      }
      if ("[object Array]" == d || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return "array";
      }
      if ("[object Function]" == d || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if ("function" == c && "undefined" == typeof a.call) {
      return "object";
    }
  }
  return c;
};
l.Wk = function(a) {
  return null === a;
};
l.td = function(a) {
  return null != a;
};
l.isArray = function(a) {
  return "array" == l.I(a);
};
l.w = function(a) {
  var c = l.I(a);
  return "array" == c || "object" == c && "number" == typeof a.length;
};
l.Nk = function(a) {
  return l.isObject(a) && "function" == typeof a.getFullYear;
};
l.isString = function(a) {
  return "string" == typeof a;
};
l.Og = function(a) {
  return "boolean" == typeof a;
};
l.isNumber = function(a) {
  return "number" == typeof a;
};
l.isFunction = function(a) {
  return "function" == l.I(a);
};
l.isObject = function(a) {
  var c = typeof a;
  return "object" == c && null != a || "function" == c;
};
l.jd = function(a) {
  return a[l.da] || (a[l.da] = ++l.Yh);
};
l.Dk = function(a) {
  return!!a[l.da];
};
l.Gh = function(a) {
  "removeAttribute" in a && a.removeAttribute(l.da);
  try {
    delete a[l.da];
  } catch (c) {
  }
};
l.da = "closure_uid_" + (1E9 * Math.random() >>> 0);
l.Yh = 0;
l.rk = l.jd;
l.Bl = l.Gh;
l.Xf = function(a) {
  var c = l.I(a);
  if ("object" == c || "array" == c) {
    if (a.clone) {
      return a.clone();
    }
    var c = "array" == c ? [] : {}, d;
    for (d in a) {
      c[d] = l.Xf(a[d]);
    }
    return c;
  }
  return a;
};
l.Tf = function(a, c, d) {
  return a.call.apply(a.bind, arguments);
};
l.Sf = function(a, c, d) {
  if (!a) {
    throw Error();
  }
  if (2 < arguments.length) {
    var e = Array.prototype.slice.call(arguments, 2);
    return function() {
      var d = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(d, e);
      return a.apply(c, d);
    };
  }
  return function() {
    return a.apply(c, arguments);
  };
};
l.bind = function(a, c, d) {
  Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? l.bind = l.Tf : l.bind = l.Sf;
  return l.bind.apply(null, arguments);
};
l.Sb = function(a, c) {
  var d = Array.prototype.slice.call(arguments, 1);
  return function() {
    var c = d.slice();
    c.push.apply(c, arguments);
    return a.apply(this, c);
  };
};
l.Jd = function(a, c) {
  for (var d in c) {
    a[d] = c[d];
  }
};
l.now = l.tb && Date.now || function() {
  return+new Date;
};
l.Cg = function(a) {
  if (l.global.execScript) {
    l.global.execScript(a, "JavaScript");
  } else {
    if (l.global.eval) {
      if (null == l.Va && (l.global.eval("var _et_ = 1;"), "undefined" != typeof l.global._et_ ? (delete l.global._et_, l.Va = !0) : l.Va = !1), l.Va) {
        l.global.eval(a);
      } else {
        var c = l.global.document, d = c.createElement("script");
        d.type = "text/javascript";
        d.defer = !1;
        d.appendChild(c.createTextNode(a));
        c.body.appendChild(d);
        c.body.removeChild(d);
      }
    } else {
      throw Error("goog.globalEval not available");
    }
  }
};
l.Va = null;
l.pk = function(a, c) {
  var d = function(a) {
    return l.Sc[a] || a;
  }, e = function(a) {
    a = a.split("-");
    for (var c = [], e = 0;e < a.length;e++) {
      c.push(d(a[e]));
    }
    return c.join("-");
  }, e = l.Sc ? "BY_WHOLE" == l.ag ? d : e : function(a) {
    return a;
  };
  return c ? a + "-" + e(c) : e(a);
};
l.Gl = function(a, c) {
  l.Sc = a;
  l.ag = c;
};
l.tk = function(a, c) {
  c && (a = a.replace(/\{\$([^}]+)}/g, function(a, e) {
    return e in c ? c[e] : a;
  }));
  return a;
};
l.uk = function(a) {
  return a;
};
l.g = function(a, c, d) {
  l.Eb(a, c, d);
};
l.U = function(a, c, d) {
  a[c] = d;
};
l.sa = function(a, c) {
  function d() {
  }
  d.prototype = c.prototype;
  a.lb = c.prototype;
  a.prototype = new d;
  a.prototype.constructor = a;
  a.Rf = function(a, d, g) {
    for (var h = Array(arguments.length - 2), k = 2;k < arguments.length;k++) {
      h[k - 2] = arguments[k];
    }
    return c.prototype[d].apply(a, h);
  };
};
l.Rf = function(a, c, d) {
  var e = arguments.callee.caller;
  if (l.qf || l.ba && !e) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if (e.lb) {
    for (var f = Array(arguments.length - 1), g = 1;g < arguments.length;g++) {
      f[g - 1] = arguments[g];
    }
    return e.lb.constructor.apply(a, f);
  }
  f = Array(arguments.length - 2);
  for (g = 2;g < arguments.length;g++) {
    f[g - 2] = arguments[g];
  }
  for (var g = !1, h = a.constructor;h;h = h.lb && h.lb.constructor) {
    if (h.prototype[c] === e) {
      g = !0;
    } else {
      if (g) {
        return h.prototype[c].apply(a, f);
      }
    }
  }
  if (a[c] === e) {
    return a.constructor.prototype[c].apply(a, f);
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
l.scope = function(a) {
  a.call(l.global);
};
l.Ne = !0;
l.Ne && (Function.prototype.bind = Function.prototype.bind || function(a, c) {
  if (1 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 1);
    d.unshift(this, a);
    return l.bind.apply(null, d);
  }
  return l.bind(this, a);
}, Function.prototype.Sb = function(a) {
  var c = Array.prototype.slice.call(arguments);
  c.unshift(this, null);
  return l.bind.apply(null, c);
}, Function.prototype.sa = function(a) {
  l.sa(this, a);
}, Function.prototype.Jd = function(a) {
  l.Jd(this.prototype, a);
});
l.O = function(a, c) {
  var d = c.constructor, e = c.Rh;
  d && d != Object.prototype.constructor || (d = function() {
    throw Error("cannot instantiate an interface (no constructor defined).");
  });
  d = l.O.Zf(d, a);
  a && l.sa(d, a);
  delete c.constructor;
  delete c.Rh;
  l.O.Mc(d.prototype, c);
  null != e && (e instanceof Function ? e(d) : l.O.Mc(d, e));
  return d;
};
l.O.kf = l.ba;
l.O.Zf = function(a, c) {
  if (l.O.kf && Object.seal instanceof Function) {
    if (c && c.prototype && c.prototype[l.Gf]) {
      return a;
    }
    var d = function() {
      var c = a.apply(this, arguments) || this;
      c[l.da] = c[l.da];
      this.constructor === d && Object.seal(c);
      return c;
    };
    return d;
  }
  return a;
};
l.O.zc = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
l.O.Mc = function(a, c) {
  for (var d in c) {
    Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d]);
  }
  for (var e = 0;e < l.O.zc.length;e++) {
    d = l.O.zc[e], Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d]);
  }
};
l.Wl = function() {
};
l.Gf = "goog_defineClass_legacy_unsealable";
var m = {X:{Bi:"LAUNCH", Gc:"STOP", pf:"SET_VOLUME", we:"GET_STATUS", Wi:"RECEIVER_STATUS", dj:"CONNECT", ej:"CLOSE", vi:"GET_APP_AVAILABILITY", Je:"LOAD", Li:"PAUSE", Ni:"SEEK", Mi:"PLAY", Le:"STOP_MEDIA", Ie:"MEDIA_GET_STATUS", Ke:"MEDIA_SET_VOLUME", Ki:"EDIT_TRACKS_INFO", wi:"INVALID_PLAYER_STATE", Gi:"LOAD_FAILED", Fi:"LOAD_CANCELLED", xi:"INVALID_REQUEST", Oi:"MEDIA_STATUS", Ci:"LAUNCH_ERROR", PING:"PING", Ti:"PONG"}, rb:{}};
m.rb[m.X.Le] = m.X.Gc;
m.rb[m.X.Ke] = m.X.pf;
m.rb[m.X.Ie] = m.X.we;
m.ei = function(a, c, d) {
  this.sessionId = a;
  this.namespaceName = c;
  this.message = d;
};
m.bj = function(a) {
  this.type = m.X.Gc;
  this.requestId = null;
  this.sessionId = a || null;
};
chrome.cast.oc = {TAB_AND_ORIGIN_SCOPED:"tab_and_origin_scoped", ORIGIN_SCOPED:"origin_scoped", PAGE_SCOPED:"page_scoped"};
l.g("chrome.cast.AutoJoinPolicy", chrome.cast.oc);
chrome.cast.rc = {CREATE_SESSION:"create_session", CAST_THIS_TAB:"cast_this_tab"};
l.g("chrome.cast.DefaultActionPolicy", chrome.cast.rc);
chrome.cast.ob = {VIDEO_OUT:"video_out", AUDIO_OUT:"audio_out", VIDEO_IN:"video_in", AUDIO_IN:"audio_in"};
l.g("chrome.cast.Capability", chrome.cast.ob);
chrome.cast.te = {CANCEL:"cancel", TIMEOUT:"timeout", API_NOT_INITIALIZED:"api_not_initialized", INVALID_PARAMETER:"invalid_parameter", EXTENSION_NOT_COMPATIBLE:"extension_not_compatible", EXTENSION_MISSING:"extension_missing", RECEIVER_UNAVAILABLE:"receiver_unavailable", SESSION_ERROR:"session_error", CHANNEL_ERROR:"channel_error", LOAD_MEDIA_FAILED:"load_media_failed"};
l.g("chrome.cast.ErrorCode", chrome.cast.te);
chrome.cast.gf = {AVAILABLE:"available", UNAVAILABLE:"unavailable"};
l.g("chrome.cast.ReceiverAvailability", chrome.cast.gf);
chrome.cast.tf = {CHROME:"chrome", IOS:"ios", ANDROID:"android"};
l.g("chrome.cast.SenderPlatform", chrome.cast.tf);
chrome.cast.Ec = {CAST:"cast", DIAL:"dial", HANGOUT:"hangout", CUSTOM:"custom"};
l.g("chrome.cast.ReceiverType", chrome.cast.Ec);
chrome.cast.ne = {RUNNING:"running", STOPPED:"stopped", ERROR:"error"};
l.g("chrome.cast.DialAppState", chrome.cast.ne);
chrome.cast.ff = {CAST:"cast", STOP:"stop"};
l.g("chrome.cast.ReceiverAction", chrome.cast.ff);
chrome.cast.Hc = {CONNECTED:"connected", DISCONNECTED:"disconnected", STOPPED:"stopped"};
l.g("chrome.cast.SessionStatus", chrome.cast.Hc);
chrome.cast.VERSION = [1, 2];
l.g("chrome.cast.VERSION", chrome.cast.VERSION);
chrome.cast.Error = function(a, c, d) {
  this.code = a;
  this.description = c || null;
  this.details = d || null;
};
l.g("chrome.cast.Error", chrome.cast.Error);
chrome.cast.sf = function(a) {
  this.platform = a;
  this.packageId = this.url = null;
};
l.g("chrome.cast.SenderApplication", chrome.cast.sf);
chrome.cast.Image = function(a) {
  this.url = a;
  this.width = this.height = null;
};
l.g("chrome.cast.Image", chrome.cast.Image);
chrome.cast.Kc = function(a, c) {
  this.level = l.V(a) ? a : null;
  this.muted = l.V(c) ? c : null;
};
l.g("chrome.cast.Volume", chrome.cast.Kc);
chrome.cast.media.Pe = {PAUSE:"pause", SEEK:"seek", STREAM_VOLUME:"stream_volume", STREAM_MUTE:"stream_mute"};
l.g("chrome.cast.media.MediaCommand", chrome.cast.media.Pe);
chrome.cast.media.K = {GENERIC:0, MOVIE:1, TV_SHOW:2, MUSIC_TRACK:3, PHOTO:4};
l.g("chrome.cast.media.MetadataType", chrome.cast.media.K);
chrome.cast.media.Bc = {IDLE:"IDLE", PLAYING:"PLAYING", PAUSED:"PAUSED", BUFFERING:"BUFFERING"};
l.g("chrome.cast.media.PlayerState", chrome.cast.media.Bc);
chrome.cast.media.jf = {PLAYBACK_START:"PLAYBACK_START", PLAYBACK_PAUSE:"PLAYBACK_PAUSE"};
l.g("chrome.cast.media.ResumeState", chrome.cast.media.jf);
chrome.cast.media.Jc = {BUFFERED:"BUFFERED", LIVE:"LIVE", OTHER:"OTHER"};
l.g("chrome.cast.media.StreamType", chrome.cast.media.Jc);
chrome.cast.media.Ee = {CANCELLED:"CANCELLED", INTERRUPTED:"INTERRUPTED", FINISHED:"FINISHED", ERROR:"ERROR"};
l.g("chrome.cast.media.IdleReason", chrome.cast.media.Ee);
chrome.cast.media.Ef = {TEXT:"TEXT", AUDIO:"AUDIO", VIDEO:"VIDEO"};
l.g("chrome.cast.media.TrackType", chrome.cast.media.Ef);
chrome.cast.media.Bf = {SUBTITLES:"SUBTITLES", CAPTIONS:"CAPTIONS", DESCRIPTIONS:"DESCRIPTIONS", CHAPTERS:"CHAPTERS", METADATA:"METADATA"};
l.g("chrome.cast.media.TextTrackType", chrome.cast.media.Bf);
chrome.cast.media.xf = {NONE:"NONE", OUTLINE:"OUTLINE", DROP_SHADOW:"DROP_SHADOW", RAISED:"RAISED", DEPRESSED:"DEPRESSED"};
l.g("chrome.cast.media.TextTrackEdgeType", chrome.cast.media.xf);
chrome.cast.media.Cf = {NONE:"NONE", NORMAL:"NORMAL", ROUNDED_CORNERS:"ROUNDED_CORNERS"};
l.g("chrome.cast.media.TextTrackWindowType", chrome.cast.media.Cf);
chrome.cast.media.yf = {SANS_SERIF:"SANS_SERIF", MONOSPACED_SANS_SERIF:"MONOSPACED_SANS_SERIF", SERIF:"SERIF", MONOSPACED_SERIF:"MONOSPACED_SERIF", CASUAL:"CASUAL", CURSIVE:"CURSIVE", SMALL_CAPITALS:"SMALL_CAPITALS"};
l.g("chrome.cast.media.TextTrackFontGenericFamily", chrome.cast.media.yf);
chrome.cast.media.zf = {NORMAL:"NORMAL", BOLD:"BOLD", BOLD_ITALIC:"BOLD_ITALIC", ITALIC:"ITALIC"};
l.g("chrome.cast.media.TextTrackFontStyle", chrome.cast.media.zf);
chrome.cast.media.ye = function() {
  this.customData = null;
};
l.g("chrome.cast.media.GetStatusRequest", chrome.cast.media.ye);
chrome.cast.media.Xe = function() {
  this.customData = null;
};
l.g("chrome.cast.media.PauseRequest", chrome.cast.media.Xe);
chrome.cast.media.Ze = function() {
  this.customData = null;
};
l.g("chrome.cast.media.PlayRequest", chrome.cast.media.Ze);
chrome.cast.media.rf = function() {
  this.customData = this.resumeState = this.currentTime = null;
};
l.g("chrome.cast.media.SeekRequest", chrome.cast.media.rf);
chrome.cast.media.vf = function() {
  this.customData = null;
};
l.g("chrome.cast.media.StopRequest", chrome.cast.media.vf);
chrome.cast.media.Lf = function(a) {
  this.volume = a;
  this.customData = null;
};
l.g("chrome.cast.media.VolumeRequest", chrome.cast.media.Lf);
chrome.cast.media.He = function(a) {
  this.type = m.X.Je;
  this.sessionId = this.requestId = null;
  this.media = a;
  this.activeTrackIds = null;
  this.autoplay = !0;
  this.customData = this.currentTime = null;
};
l.g("chrome.cast.media.LoadRequest", chrome.cast.media.He);
chrome.cast.media.se = function(a, c) {
  this.requestId = null;
  this.activeTrackIds = a || null;
  this.textTrackStyle = c || null;
};
l.g("chrome.cast.media.EditTracksInfoRequest", chrome.cast.media.se);
chrome.cast.media.xe = function() {
  this.metadataType = this.type = chrome.cast.media.K.GENERIC;
  this.releaseDate = this.releaseYear = this.images = this.subtitle = this.title = null;
};
l.g("chrome.cast.media.GenericMediaMetadata", chrome.cast.media.xe);
chrome.cast.media.Re = function() {
  this.metadataType = this.type = chrome.cast.media.K.MOVIE;
  this.releaseDate = this.releaseYear = this.images = this.subtitle = this.studio = this.title = null;
};
l.g("chrome.cast.media.MovieMediaMetadata", chrome.cast.media.Re);
chrome.cast.media.Ff = function() {
  this.metadataType = this.type = chrome.cast.media.K.TV_SHOW;
  this.originalAirdate = this.releaseYear = this.images = this.episode = this.episodeNumber = this.season = this.seasonNumber = this.episodeTitle = this.title = this.seriesTitle = null;
};
l.g("chrome.cast.media.TvShowMediaMetadata", chrome.cast.media.Ff);
chrome.cast.media.Se = function() {
  this.metadataType = this.type = chrome.cast.media.K.MUSIC_TRACK;
  this.releaseDate = this.releaseYear = this.images = this.discNumber = this.trackNumber = this.artistName = this.songName = this.composer = this.artist = this.albumArtist = this.title = this.albumName = null;
};
l.g("chrome.cast.media.MusicTrackMediaMetadata", chrome.cast.media.Se);
chrome.cast.media.Ye = function() {
  this.metadataType = this.type = chrome.cast.media.K.PHOTO;
  this.creationDateTime = this.height = this.width = this.longitude = this.latitude = this.images = this.location = this.artist = this.title = null;
};
l.g("chrome.cast.media.PhotoMediaMetadata", chrome.cast.media.Ye);
chrome.cast.media.Qe = function(a, c) {
  this.contentId = a;
  this.streamType = chrome.cast.media.Jc.BUFFERED;
  this.contentType = c;
  this.customData = this.textTrackStyle = this.tracks = this.duration = this.metadata = null;
};
l.g("chrome.cast.media.MediaInfo", chrome.cast.media.Qe);
chrome.cast.media.Oe = function(a, c) {
  this.sessionId = a;
  this.mediaSessionId = c;
  this.media = null;
  this.playbackRate = 1;
  this.playerState = chrome.cast.media.Bc.IDLE;
  this.currentTime = 0;
  this.supportedMediaCommands = [];
  this.volume = new chrome.cast.Kc;
  this.customData = this.activeTrackIds = this.idleReason = null;
};
l.g("chrome.cast.media.Media", chrome.cast.media.Oe);
chrome.cast.media.je = "CC1AD845";
l.g("chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID", chrome.cast.media.je);
chrome.cast.media.timeout = {};
l.g("chrome.cast.media.timeout", chrome.cast.media.timeout);
chrome.cast.media.timeout.load = 0;
l.U(chrome.cast.media.timeout, "load", chrome.cast.media.timeout.load);
chrome.cast.media.timeout.wg = 0;
l.U(chrome.cast.media.timeout, "getStatus", chrome.cast.media.timeout.wg);
chrome.cast.media.timeout.play = 0;
l.U(chrome.cast.media.timeout, "play", chrome.cast.media.timeout.play);
chrome.cast.media.timeout.pause = 0;
l.U(chrome.cast.media.timeout, "pause", chrome.cast.media.timeout.pause);
chrome.cast.media.timeout.seek = 0;
l.U(chrome.cast.media.timeout, "seek", chrome.cast.media.timeout.seek);
chrome.cast.media.timeout.stop = 0;
l.U(chrome.cast.media.timeout, "stop", chrome.cast.media.timeout.stop);
chrome.cast.media.timeout.Oh = 0;
l.U(chrome.cast.media.timeout, "setVolume", chrome.cast.media.timeout.Oh);
chrome.cast.media.timeout.eg = 0;
l.U(chrome.cast.media.timeout, "editTracksInfo", chrome.cast.media.timeout.eg);
chrome.cast.media.Df = function(a, c) {
  this.trackId = a;
  this.trackContentType = this.trackContentId = null;
  this.type = c;
  this.customData = this.subtype = this.language = this.name = null;
};
l.g("chrome.cast.media.Track", chrome.cast.media.Df);
chrome.cast.media.Af = function() {
  this.customData = this.fontStyle = this.fontGenericFamily = this.fontFamily = this.fontScale = this.windowRoundedCornerRadius = this.windowColor = this.windowType = this.edgeColor = this.edgeType = this.backgroundColor = this.foregroundColor = null;
};
l.g("chrome.cast.media.TextTrackStyle", chrome.cast.media.Af);
chrome.cast.de = function(a, c, d, e, f) {
  this.sessionRequest = a;
  this.sessionListener = c;
  this.receiverListener = d;
  this.autoJoinPolicy = e || chrome.cast.oc.TAB_AND_ORIGIN_SCOPED;
  this.defaultActionPolicy = f || chrome.cast.rc.CREATE_SESSION;
  this.customDialLaunchCallback = null;
};
l.g("chrome.cast.ApiConfig", chrome.cast.de);
chrome.cast.qe = function(a, c) {
  this.appName = a;
  this.launchParameter = c || null;
};
l.g("chrome.cast.DialRequest", chrome.cast.qe);
chrome.cast.oe = function(a, c, d) {
  this.receiver = a;
  this.appState = c;
  this.extraData = d || null;
};
l.g("chrome.cast.DialLaunchData", chrome.cast.oe);
chrome.cast.pe = function(a, c) {
  this.doLaunch = a;
  this.launchParameter = c || null;
};
l.g("chrome.cast.DialLaunchResponse", chrome.cast.pe);
chrome.cast.uf = function(a, c, d) {
  this.appId = a;
  this.capabilities = c || [chrome.cast.ob.VIDEO_OUT, chrome.cast.ob.AUDIO_OUT];
  this.dialRequest = null;
  this.requestSessionTimeout = d || chrome.cast.timeout.requestSession;
  this.language = null;
};
l.g("chrome.cast.SessionRequest", chrome.cast.uf);
chrome.cast.ef = function(a, c, d, e) {
  this.label = a;
  this.friendlyName = c;
  this.capabilities = d || [];
  this.volume = e || null;
  this.receiverType = chrome.cast.Ec.CAST;
  this.ipAddress = this.displayStatus = this.isActiveInput = null;
};
l.g("chrome.cast.Receiver", chrome.cast.ef);
chrome.cast.hf = function(a, c) {
  this.statusText = a;
  this.appImages = c;
  this.showStop = null;
};
l.g("chrome.cast.ReceiverDisplayStatus", chrome.cast.hf);
chrome.cast.Pa = function(a, c, d, e, f) {
  this.sessionId = a;
  this.appId = c;
  this.displayName = d;
  this.statusText = null;
  this.appImages = e;
  this.receiver = f;
  this.senderApps = [];
  this.namespaces = [];
  this.media = [];
  this.status = chrome.cast.Hc.CONNECTED;
  this.transportId = "";
};
l.g("chrome.cast.Session", chrome.cast.Pa);
chrome.cast.Pa.he = "custom_receiver_session_id";
l.U(chrome.cast.Pa, "CUSTOM_RECEIVER_SESSION_ID", chrome.cast.Pa.he);
chrome.cast.timeout = {};
l.g("chrome.cast.timeout", chrome.cast.timeout);
chrome.cast.timeout.requestSession = 1E4;
chrome.cast.timeout.leaveSession = 3E3;
chrome.cast.timeout.stopSession = 3E3;
chrome.cast.timeout.setReceiverVolume = 3E3;
chrome.cast.timeout.sendCustomMessage = 3E3;
chrome.cast.Me = "mirror_app_id";
l.g("chrome.cast.MIRROR_APP_ID", chrome.cast.Me);
m.pc = function(a, c, d) {
  l.isNumber(d);
};
m.pc.gi = 432E5;
m.pc.sl = function() {
};
m.Ai = {};
m.wc = function(a, c, d, e, f, g) {
  this.type = a;
  this.message = c;
  this.seqNum = d || null;
  this.clientId = e || null;
  this.appOrigin = null;
  this.timeoutMillis = l.isNumber(f) ? f : 0;
  this.receiverId = g || null;
  this.receiverList = null;
};
m.v = {Ce:"iframe_init_result", uc:"fail_to_connect_to_extension", ji:"client_reconnect", Jf:"v2_message", ae:"app_message", ii:"client_init", Ii:"log_message", Xi:"request_session", Yi:"request_session_by_id", Di:"leave_session", hi:"client_disconnect", $i:"set_custom_receivers", ni:"custom_dial_launch_response", aj:"set_receiver_display_status", Vi:"query_tab_broadcast_status", cf:"receiver_availability", bf:"receiver_action", Ue:"new_session", Hf:"update_session", le:"disconnect_session", df:"remove_session", 
be:"app_message_success", Fe:"leave_session_success", of:"set_receiver_volume_success", mf:"set_custom_receivers_success", ERROR:"error", ge:"custom_dial_launch_request", nf:"set_receiver_display_status_success", wf:"tab_broadcast_status"};
l.debug = {};
l.debug.Error = function(a) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, l.debug.Error);
  } else {
    var c = Error().stack;
    c && (this.stack = c);
  }
  a && (this.message = String(a));
};
l.sa(l.debug.Error, Error);
l.debug.Error.prototype.name = "CustomError";
l.Vc = {};
l.Vc.Ve = {re:1, di:2, TEXT:3, fi:4, ti:5, si:6, Ui:7, mi:8, oi:9, qi:10, pi:11, Qi:12};
l.b = {};
l.b.pb = !1;
l.b.ue = !1;
l.b.If = {Te:"\u00a0"};
l.b.$b = function(a, c) {
  return 0 == a.lastIndexOf(c, 0);
};
l.b.gg = function(a, c) {
  var d = a.length - c.length;
  return 0 <= d && a.indexOf(c, d) == d;
};
l.b.Nj = function(a, c) {
  return 0 == l.b.Qc(c, a.substr(0, c.length));
};
l.b.Lj = function(a, c) {
  return 0 == l.b.Qc(c, a.substr(a.length - c.length, c.length));
};
l.b.Mj = function(a, c) {
  return a.toLowerCase() == c.toLowerCase();
};
l.b.Sh = function(a, c) {
  for (var d = a.split("%s"), e = "", f = Array.prototype.slice.call(arguments, 1);f.length && 1 < d.length;) {
    e += d.shift() + f.shift();
  }
  return e + d.join("%s");
};
l.b.Rj = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
l.b.Kb = function(a) {
  return/^[\s\xa0]*$/.test(a);
};
l.b.Qk = function(a) {
  return 0 == a.length;
};
l.b.L = l.b.Kb;
l.b.Qg = function(a) {
  return l.b.Kb(l.b.fh(a));
};
l.b.Pk = l.b.Qg;
l.b.Lk = function(a) {
  return!/[^\t\n\r ]/.test(a);
};
l.b.Ik = function(a) {
  return!/[^a-zA-Z]/.test(a);
};
l.b.Xk = function(a) {
  return!/[^0-9]/.test(a);
};
l.b.Jk = function(a) {
  return!/[^a-zA-Z0-9]/.test(a);
};
l.b.$k = function(a) {
  return " " == a;
};
l.b.al = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a;
};
l.b.Ul = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ");
};
l.b.Jj = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n");
};
l.b.pl = function(a) {
  return a.replace(/\xa0|\s/g, " ");
};
l.b.ol = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ");
};
l.b.Qj = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
l.b.trim = l.tb && String.prototype.trim ? function(a) {
  return a.trim();
} : function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
l.b.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "");
};
l.b.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "");
};
l.b.Qc = function(a, c) {
  var d = String(a).toLowerCase(), e = String(c).toLowerCase();
  return d < e ? -1 : d == e ? 0 : 1;
};
l.b.Ld = /(\.\d+)|(\d+)|(\D+)/g;
l.b.tl = function(a, c) {
  if (a == c) {
    return 0;
  }
  if (!a) {
    return-1;
  }
  if (!c) {
    return 1;
  }
  for (var d = a.toLowerCase().match(l.b.Ld), e = c.toLowerCase().match(l.b.Ld), f = Math.min(d.length, e.length), g = 0;g < f;g++) {
    var h = d[g], k = e[g];
    if (h != k) {
      return d = parseInt(h, 10), !isNaN(d) && (e = parseInt(k, 10), !isNaN(e) && d - e) ? d - e : h < k ? -1 : 1;
    }
  }
  return d.length != e.length ? d.length - e.length : a < c ? -1 : 1;
};
l.b.Ia = function(a) {
  return encodeURIComponent(String(a));
};
l.b.mb = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "));
};
l.b.mh = function(a, c) {
  return a.replace(/(\r\n|\r|\n)/g, c ? "<br />" : "<br>");
};
l.b.ld = function(a, c) {
  if (c) {
    a = a.replace(l.b.cc, "&amp;").replace(l.b.xc, "&lt;").replace(l.b.vc, "&gt;").replace(l.b.Cc, "&quot;").replace(l.b.Fc, "&#39;").replace(l.b.yc, "&#0;"), l.b.pb && (a = a.replace(l.b.sc, "&#101;"));
  } else {
    if (!l.b.$d.test(a)) {
      return a;
    }
    -1 != a.indexOf("&") && (a = a.replace(l.b.cc, "&amp;"));
    -1 != a.indexOf("<") && (a = a.replace(l.b.xc, "&lt;"));
    -1 != a.indexOf(">") && (a = a.replace(l.b.vc, "&gt;"));
    -1 != a.indexOf('"') && (a = a.replace(l.b.Cc, "&quot;"));
    -1 != a.indexOf("'") && (a = a.replace(l.b.Fc, "&#39;"));
    -1 != a.indexOf("\x00") && (a = a.replace(l.b.yc, "&#0;"));
    l.b.pb && -1 != a.indexOf("e") && (a = a.replace(l.b.sc, "&#101;"));
  }
  return a;
};
l.b.cc = /&/g;
l.b.xc = /</g;
l.b.vc = />/g;
l.b.Cc = /"/g;
l.b.Fc = /'/g;
l.b.yc = /\x00/g;
l.b.sc = /e/g;
l.b.$d = l.b.pb ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
l.b.Vd = function(a) {
  return l.b.contains(a, "&") ? !l.b.ue && "document" in l.global ? l.b.Wd(a) : l.b.Zh(a) : a;
};
l.b.dm = function(a, c) {
  return l.b.contains(a, "&") ? l.b.Wd(a, c) : a;
};
l.b.Wd = function(a, c) {
  var d = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, e;
  e = c ? c.createElement("div") : l.global.document.createElement("div");
  return a.replace(l.b.Be, function(a, c) {
    var h = d[a];
    if (h) {
      return h;
    }
    if ("#" == c.charAt(0)) {
      var k = Number("0" + c.substr(1));
      isNaN(k) || (h = String.fromCharCode(k));
    }
    h || (e.innerHTML = a + " ", h = e.firstChild.nodeValue.slice(0, -1));
    return d[a] = h;
  });
};
l.b.Zh = function(a) {
  return a.replace(/&([^;]+);/g, function(a, d) {
    switch(d) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "quot":
        return'"';
      default:
        if ("#" == d.charAt(0)) {
          var e = Number("0" + d.substr(1));
          if (!isNaN(e)) {
            return String.fromCharCode(e);
          }
        }
        return a;
    }
  });
};
l.b.Be = /&([^;\s<&]+);?/g;
l.b.gm = function(a, c) {
  return l.b.mh(a.replace(/  /g, " &#160;"), c);
};
l.b.xl = function(a) {
  return a.replace(/(^|[\n ]) /g, "$1" + l.b.If.Te);
};
l.b.Vl = function(a, c) {
  for (var d = c.length, e = 0;e < d;e++) {
    var f = 1 == d ? c : c.charAt(e);
    if (a.charAt(0) == f && a.charAt(a.length - 1) == f) {
      return a.substring(1, a.length - 1);
    }
  }
  return a;
};
l.b.truncate = function(a, c, d) {
  d && (a = l.b.Vd(a));
  a.length > c && (a = a.substring(0, c - 3) + "...");
  d && (a = l.b.ld(a));
  return a;
};
l.b.cm = function(a, c, d, e) {
  d && (a = l.b.Vd(a));
  if (e && a.length > c) {
    e > c && (e = c), a = a.substring(0, c - e) + "..." + a.substring(a.length - e);
  } else {
    if (a.length > c) {
      e = Math.floor(c / 2);
      var f = a.length - e;
      a = a.substring(0, e + c % 2) + "..." + a.substring(f);
    }
  }
  d && (a = l.b.ld(a));
  return a;
};
l.b.Yb = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
l.b.cb = {"'":"\\'"};
l.b.quote = function(a) {
  a = String(a);
  if (a.quote) {
    return a.quote();
  }
  for (var c = ['"'], d = 0;d < a.length;d++) {
    var e = a.charAt(d), f = e.charCodeAt(0);
    c[d + 1] = l.b.Yb[e] || (31 < f && 127 > f ? e : l.b.Wc(e));
  }
  c.push('"');
  return c.join("");
};
l.b.ik = function(a) {
  for (var c = [], d = 0;d < a.length;d++) {
    c[d] = l.b.Wc(a.charAt(d));
  }
  return c.join("");
};
l.b.Wc = function(a) {
  if (a in l.b.cb) {
    return l.b.cb[a];
  }
  if (a in l.b.Yb) {
    return l.b.cb[a] = l.b.Yb[a];
  }
  var c = a, d = a.charCodeAt(0);
  if (31 < d && 127 > d) {
    c = a;
  } else {
    if (256 > d) {
      if (c = "\\x", 16 > d || 256 < d) {
        c += "0";
      }
    } else {
      c = "\\u", 4096 > d && (c += "0");
    }
    c += d.toString(16).toUpperCase();
  }
  return l.b.cb[a] = c;
};
l.b.contains = function(a, c) {
  return-1 != a.indexOf(c);
};
l.b.Vf = function(a, c) {
  return l.b.contains(a.toLowerCase(), c.toLowerCase());
};
l.b.Yj = function(a, c) {
  return a && c ? a.split(c).length - 1 : 0;
};
l.b.Ga = function(a, c, d) {
  var e = a;
  0 <= c && c < a.length && 0 < d && (e = a.substr(0, c) + a.substr(c + d, a.length - c - d));
  return e;
};
l.b.remove = function(a, c) {
  var d = new RegExp(l.b.Wb(c), "");
  return a.replace(d, "");
};
l.b.removeAll = function(a, c) {
  var d = new RegExp(l.b.Wb(c), "g");
  return a.replace(d, "");
};
l.b.Wb = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
l.b.repeat = function(a, c) {
  return Array(c + 1).join(a);
};
l.b.wl = function(a, c, d) {
  a = l.V(d) ? a.toFixed(d) : String(a);
  d = a.indexOf(".");
  -1 == d && (d = a.length);
  return l.b.repeat("0", Math.max(0, c - d)) + a;
};
l.b.fh = function(a) {
  return null == a ? "" : String(a);
};
l.b.Uf = function(a) {
  return Array.prototype.join.call(arguments, "");
};
l.b.gd = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ l.now()).toString(36);
};
l.b.Aa = function(a, c) {
  for (var d = 0, e = l.b.trim(String(a)).split("."), f = l.b.trim(String(c)).split("."), g = Math.max(e.length, f.length), h = 0;0 == d && h < g;h++) {
    var k = e[h] || "", n = f[h] || "", p = /(\d*)(\D*)/g, w = /(\d*)(\D*)/g;
    do {
      var q = p.exec(k) || ["", "", ""], r = w.exec(n) || ["", "", ""];
      if (0 == q[0].length && 0 == r[0].length) {
        break;
      }
      d = l.b.Ab(0 == q[1].length ? 0 : parseInt(q[1], 10), 0 == r[1].length ? 0 : parseInt(r[1], 10)) || l.b.Ab(0 == q[2].length, 0 == r[2].length) || l.b.Ab(q[2], r[2]);
    } while (0 == d);
  }
  return d;
};
l.b.Ab = function(a, c) {
  return a < c ? -1 : a > c ? 1 : 0;
};
l.b.Ae = 4294967296;
l.b.Ek = function(a) {
  for (var c = 0, d = 0;d < a.length;++d) {
    c = 31 * c + a.charCodeAt(d), c %= l.b.Ae;
  }
  return c;
};
l.b.$h = 2147483648 * Math.random() | 0;
l.b.bk = function() {
  return "goog_" + l.b.$h++;
};
l.b.$l = function(a) {
  var c = Number(a);
  return 0 == c && l.b.Kb(a) ? NaN : c;
};
l.b.Vk = function(a) {
  return/^[a-z]+([A-Z][a-z]*)*$/.test(a);
};
l.b.bl = function(a) {
  return/^([A-Z][a-z]*)+$/.test(a);
};
l.b.Zl = function(a) {
  return String(a).replace(/\-([a-z])/g, function(a, d) {
    return d.toUpperCase();
  });
};
l.b.am = function(a) {
  return String(a).replace(/([A-Z])/g, "-$1").toLowerCase();
};
l.b.bm = function(a, c) {
  var d = l.isString(c) ? l.b.Wb(c) : "\\s";
  return a.replace(new RegExp("(^" + (d ? "|[" + d + "]+" : "") + ")([a-z])", "g"), function(a, c, d) {
    return c + d.toUpperCase();
  });
};
l.b.Kj = function(a) {
  return String(a.charAt(0)).toUpperCase() + String(a.substr(1)).toLowerCase();
};
l.b.parseInt = function(a) {
  isFinite(a) && (a = String(a));
  return l.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN;
};
l.b.Pl = function(a, c, d) {
  a = a.split(c);
  for (var e = [];0 < d && a.length;) {
    e.push(a.shift()), d--;
  }
  a.length && e.push(a.join(c));
  return e;
};
l.b.fk = function(a, c) {
  var d = [], e = [];
  if (a == c) {
    return 0;
  }
  if (!a.length || !c.length) {
    return Math.max(a.length, c.length);
  }
  for (var f = 0;f < c.length + 1;f++) {
    d[f] = f;
  }
  for (f = 0;f < a.length;f++) {
    e[0] = f + 1;
    for (var g = 0;g < c.length;g++) {
      e[g + 1] = Math.min(e[g] + 1, d[g + 1] + 1, d[g] + (a[f] != c[g]));
    }
    for (g = 0;g < d.length;g++) {
      d[g] = e[g];
    }
  }
  return e[c.length];
};
l.i = {};
l.i.J = l.ba;
l.i.La = function(a, c) {
  c.unshift(a);
  l.debug.Error.call(this, l.b.Sh.apply(null, c));
  c.shift();
};
l.sa(l.i.La, l.debug.Error);
l.i.La.prototype.name = "AssertionError";
l.i.ie = function(a) {
  throw a;
};
l.i.Db = l.i.ie;
l.i.R = function(a, c, d, e) {
  var f = "Assertion failed";
  if (d) {
    var f = f + (": " + d), g = e
  } else {
    a && (f += ": " + a, g = c);
  }
  a = new l.i.La("" + f, g || []);
  l.i.Db(a);
};
l.i.Hl = function(a) {
  l.i.J && (l.i.Db = a);
};
l.i.assert = function(a, c, d) {
  l.i.J && !a && l.i.R("", null, c, Array.prototype.slice.call(arguments, 2));
  return a;
};
l.i.Zc = function(a, c) {
  l.i.J && l.i.Db(new l.i.La("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)));
};
l.i.yj = function(a, c, d) {
  l.i.J && !l.isNumber(a) && l.i.R("Expected number but got %s: %s.", [l.I(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a;
};
l.i.Bj = function(a, c, d) {
  l.i.J && !l.isString(a) && l.i.R("Expected string but got %s: %s.", [l.I(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a;
};
l.i.wj = function(a, c, d) {
  l.i.J && !l.isFunction(a) && l.i.R("Expected function but got %s: %s.", [l.I(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a;
};
l.i.zj = function(a, c, d) {
  l.i.J && !l.isObject(a) && l.i.R("Expected object but got %s: %s.", [l.I(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a;
};
l.i.tj = function(a, c, d) {
  l.i.J && !l.isArray(a) && l.i.R("Expected array but got %s: %s.", [l.I(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a;
};
l.i.uj = function(a, c, d) {
  l.i.J && !l.Og(a) && l.i.R("Expected boolean but got %s: %s.", [l.I(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a;
};
l.i.vj = function(a, c, d) {
  !l.i.J || l.isObject(a) && a.nodeType == l.Vc.Ve.re || l.i.R("Expected Element but got %s: %s.", [l.I(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a;
};
l.i.xj = function(a, c, d, e) {
  !l.i.J || a instanceof c || l.i.R("Expected instanceof %s but got %s.", [l.i.hd(c), l.i.hd(a)], d, Array.prototype.slice.call(arguments, 3));
  return a;
};
l.i.Aj = function() {
  for (var a in Object.prototype) {
    l.i.Zc(a + " should not be enumerable in Object.prototype.");
  }
};
l.i.hd = function(a) {
  return a instanceof Function ? a.displayName || a.name || "unknown type name" : a instanceof Object ? a.constructor.displayName || a.constructor.name || Object.prototype.toString.call(a) : null === a ? "null" : typeof a;
};
l.a = {};
l.Q = l.tb;
l.a.P = !1;
l.a.sh = function(a) {
  return a[a.length - 1];
};
l.a.dl = l.a.sh;
l.a.n = Array.prototype;
l.a.indexOf = l.Q && (l.a.P || l.a.n.indexOf) ? function(a, c, d) {
  return l.a.n.indexOf.call(a, c, d);
} : function(a, c, d) {
  d = null == d ? 0 : 0 > d ? Math.max(0, a.length + d) : d;
  if (l.isString(a)) {
    return l.isString(c) && 1 == c.length ? a.indexOf(c, d) : -1;
  }
  for (;d < a.length;d++) {
    if (d in a && a[d] === c) {
      return d;
    }
  }
  return-1;
};
l.a.lastIndexOf = l.Q && (l.a.P || l.a.n.lastIndexOf) ? function(a, c, d) {
  return l.a.n.lastIndexOf.call(a, c, null == d ? a.length - 1 : d);
} : function(a, c, d) {
  d = null == d ? a.length - 1 : d;
  0 > d && (d = Math.max(0, a.length + d));
  if (l.isString(a)) {
    return l.isString(c) && 1 == c.length ? a.lastIndexOf(c, d) : -1;
  }
  for (;0 <= d;d--) {
    if (d in a && a[d] === c) {
      return d;
    }
  }
  return-1;
};
l.a.forEach = l.Q && (l.a.P || l.a.n.forEach) ? function(a, c, d) {
  l.a.n.forEach.call(a, c, d);
} : function(a, c, d) {
  for (var e = a.length, f = l.isString(a) ? a.split("") : a, g = 0;g < e;g++) {
    g in f && c.call(d, f[g], g, a);
  }
};
l.a.ad = function(a, c, d) {
  for (var e = a.length, f = l.isString(a) ? a.split("") : a, e = e - 1;0 <= e;--e) {
    e in f && c.call(d, f[e], e, a);
  }
};
l.a.filter = l.Q && (l.a.P || l.a.n.filter) ? function(a, c, d) {
  return l.a.n.filter.call(a, c, d);
} : function(a, c, d) {
  for (var e = a.length, f = [], g = 0, h = l.isString(a) ? a.split("") : a, k = 0;k < e;k++) {
    if (k in h) {
      var n = h[k];
      c.call(d, n, k, a) && (f[g++] = n);
    }
  }
  return f;
};
l.a.map = l.Q && (l.a.P || l.a.n.map) ? function(a, c, d) {
  return l.a.n.map.call(a, c, d);
} : function(a, c, d) {
  for (var e = a.length, f = Array(e), g = l.isString(a) ? a.split("") : a, h = 0;h < e;h++) {
    h in g && (f[h] = c.call(d, g[h], h, a));
  }
  return f;
};
l.a.reduce = l.Q && (l.a.P || l.a.n.reduce) ? function(a, c, d, e) {
  e && (c = l.bind(c, e));
  return l.a.n.reduce.call(a, c, d);
} : function(a, c, d, e) {
  var f = d;
  l.a.forEach(a, function(d, h) {
    f = c.call(e, f, d, h, a);
  });
  return f;
};
l.a.reduceRight = l.Q && (l.a.P || l.a.n.reduceRight) ? function(a, c, d, e) {
  e && (c = l.bind(c, e));
  return l.a.n.reduceRight.call(a, c, d);
} : function(a, c, d, e) {
  var f = d;
  l.a.ad(a, function(d, h) {
    f = c.call(e, f, d, h, a);
  });
  return f;
};
l.a.some = l.Q && (l.a.P || l.a.n.some) ? function(a, c, d) {
  return l.a.n.some.call(a, c, d);
} : function(a, c, d) {
  for (var e = a.length, f = l.isString(a) ? a.split("") : a, g = 0;g < e;g++) {
    if (g in f && c.call(d, f[g], g, a)) {
      return!0;
    }
  }
  return!1;
};
l.a.every = l.Q && (l.a.P || l.a.n.every) ? function(a, c, d) {
  return l.a.n.every.call(a, c, d);
} : function(a, c, d) {
  for (var e = a.length, f = l.isString(a) ? a.split("") : a, g = 0;g < e;g++) {
    if (g in f && !c.call(d, f[g], g, a)) {
      return!1;
    }
  }
  return!0;
};
l.a.count = function(a, c, d) {
  var e = 0;
  l.a.forEach(a, function(a, g, h) {
    c.call(d, a, g, h) && ++e;
  }, d);
  return e;
};
l.a.find = function(a, c, d) {
  c = l.a.$c(a, c, d);
  return 0 > c ? null : l.isString(a) ? a.charAt(c) : a[c];
};
l.a.$c = function(a, c, d) {
  for (var e = a.length, f = l.isString(a) ? a.split("") : a, g = 0;g < e;g++) {
    if (g in f && c.call(d, f[g], g, a)) {
      return g;
    }
  }
  return-1;
};
l.a.kk = function(a, c, d) {
  c = l.a.ig(a, c, d);
  return 0 > c ? null : l.isString(a) ? a.charAt(c) : a[c];
};
l.a.ig = function(a, c, d) {
  for (var e = a.length, f = l.isString(a) ? a.split("") : a, e = e - 1;0 <= e;e--) {
    if (e in f && c.call(d, f[e], e, a)) {
      return e;
    }
  }
  return-1;
};
l.a.contains = function(a, c) {
  return 0 <= l.a.indexOf(a, c);
};
l.a.L = function(a) {
  return 0 == a.length;
};
l.a.clear = function(a) {
  if (!l.isArray(a)) {
    for (var c = a.length - 1;0 <= c;c--) {
      delete a[c];
    }
  }
  a.length = 0;
};
l.a.insert = function(a, c) {
  l.a.contains(a, c) || a.push(c);
};
l.a.nd = function(a, c, d) {
  l.a.splice(a, d, 0, c);
};
l.a.Gk = function(a, c, d) {
  l.Sb(l.a.splice, a, d, 0).apply(null, c);
};
l.a.insertBefore = function(a, c, d) {
  var e;
  2 == arguments.length || 0 > (e = l.a.indexOf(a, d)) ? a.push(c) : l.a.nd(a, c, e);
};
l.a.remove = function(a, c) {
  var d = l.a.indexOf(a, c), e;
  (e = 0 <= d) && l.a.Ga(a, d);
  return e;
};
l.a.Ga = function(a, c) {
  return 1 == l.a.n.splice.call(a, c, 1).length;
};
l.a.Cl = function(a, c, d) {
  c = l.a.$c(a, c, d);
  return 0 <= c ? (l.a.Ga(a, c), !0) : !1;
};
l.a.Al = function(a, c, d) {
  var e = 0;
  l.a.ad(a, function(f, g) {
    c.call(d, f, g, a) && l.a.Ga(a, g) && e++;
  });
  return e;
};
l.a.concat = function(a) {
  return l.a.n.concat.apply(l.a.n, arguments);
};
l.a.join = function(a) {
  return l.a.n.concat.apply(l.a.n, arguments);
};
l.a.aa = function(a) {
  var c = a.length;
  if (0 < c) {
    for (var d = Array(c), e = 0;e < c;e++) {
      d[e] = a[e];
    }
    return d;
  }
  return[];
};
l.a.clone = l.a.aa;
l.a.extend = function(a, c) {
  for (var d = 1;d < arguments.length;d++) {
    var e = arguments[d];
    if (l.w(e)) {
      var f = a.length || 0, g = e.length || 0;
      a.length = f + g;
      for (var h = 0;h < g;h++) {
        a[f + h] = e[h];
      }
    } else {
      a.push(e);
    }
  }
};
l.a.splice = function(a, c, d, e) {
  return l.a.n.splice.apply(a, l.a.slice(arguments, 1));
};
l.a.slice = function(a, c, d) {
  return 2 >= arguments.length ? l.a.n.slice.call(a, c) : l.a.n.slice.call(a, c, d);
};
l.a.Dh = function(a, c, d) {
  c = c || a;
  d = d || function() {
    return l.isObject(h) ? "o" + l.jd(h) : (typeof h).charAt(0) + h;
  };
  for (var e = {}, f = 0, g = 0;g < a.length;) {
    var h = a[g++], k = d(h);
    Object.prototype.hasOwnProperty.call(e, k) || (e[k] = !0, c[f++] = h);
  }
  c.length = f;
};
l.a.Nc = function(a, c, d) {
  return l.a.Oc(a, d || l.a.Z, !1, c);
};
l.a.Ej = function(a, c, d) {
  return l.a.Oc(a, c, !0, void 0, d);
};
l.a.Oc = function(a, c, d, e, f) {
  for (var g = 0, h = a.length, k;g < h;) {
    var n = g + h >> 1, p;
    p = d ? c.call(f, a[n], n, a) : c(e, a[n]);
    0 < p ? g = n + 1 : (h = n, k = !p);
  }
  return k ? g : ~g;
};
l.a.sort = function(a, c) {
  a.sort(c || l.a.Z);
};
l.a.Ql = function(a, c) {
  for (var d = 0;d < a.length;d++) {
    a[d] = {index:d, value:a[d]};
  }
  var e = c || l.a.Z;
  l.a.sort(a, function(a, c) {
    return e(a.value, c.value) || a.index - c.index;
  });
  for (d = 0;d < a.length;d++) {
    a[d] = a[d].value;
  }
};
l.a.Ph = function(a, c, d) {
  var e = d || l.a.Z;
  l.a.sort(a, function(a, d) {
    return e(c(a), c(d));
  });
};
l.a.Ol = function(a, c, d) {
  l.a.Ph(a, function(a) {
    return a[c];
  }, d);
};
l.a.Bd = function(a, c, d) {
  c = c || l.a.Z;
  for (var e = 1;e < a.length;e++) {
    var f = c(a[e - 1], a[e]);
    if (0 < f || 0 == f && d) {
      return!1;
    }
  }
  return!0;
};
l.a.equals = function(a, c, d) {
  if (!l.w(a) || !l.w(c) || a.length != c.length) {
    return!1;
  }
  var e = a.length;
  d = d || l.a.Uc;
  for (var f = 0;f < e;f++) {
    if (!d(a[f], c[f])) {
      return!1;
    }
  }
  return!0;
};
l.a.Uj = function(a, c, d) {
  d = d || l.a.Z;
  for (var e = Math.min(a.length, c.length), f = 0;f < e;f++) {
    var g = d(a[f], c[f]);
    if (0 != g) {
      return g;
    }
  }
  return l.a.Z(a.length, c.length);
};
l.a.Z = function(a, c) {
  return a > c ? 1 : a < c ? -1 : 0;
};
l.a.Hk = function(a, c) {
  return-l.a.Z(a, c);
};
l.a.Uc = function(a, c) {
  return a === c;
};
l.a.Cj = function(a, c, d) {
  d = l.a.Nc(a, c, d);
  return 0 > d ? (l.a.nd(a, c, -(d + 1)), !0) : !1;
};
l.a.Dj = function(a, c, d) {
  c = l.a.Nc(a, c, d);
  return 0 <= c ? l.a.Ga(a, c) : !1;
};
l.a.Fj = function(a, c, d) {
  for (var e = {}, f = 0;f < a.length;f++) {
    var g = a[f], h = c.call(d, g, f, a);
    l.V(h) && (e[h] || (e[h] = [])).push(g);
  }
  return e;
};
l.a.Vh = function(a, c, d) {
  var e = {};
  l.a.forEach(a, function(f, g) {
    e[c.call(d, f, g, a)] = f;
  });
  return e;
};
l.a.eb = function(a, c, d) {
  var e = [], f = 0, g = a;
  d = d || 1;
  void 0 !== c && (f = a, g = c);
  if (0 > d * (g - f)) {
    return[];
  }
  if (0 < d) {
    for (a = f;a < g;a += d) {
      e.push(a);
    }
  } else {
    for (a = f;a > g;a += d) {
      e.push(a);
    }
  }
  return e;
};
l.a.repeat = function(a, c) {
  for (var d = [], e = 0;e < c;e++) {
    d[e] = a;
  }
  return d;
};
l.a.kg = function(a) {
  for (var c = [], d = 0;d < arguments.length;d++) {
    var e = arguments[d];
    if (l.isArray(e)) {
      for (var f = 0;f < e.length;f += 8192) {
        for (var g = l.a.slice(e, f, f + 8192), g = l.a.kg.apply(null, g), h = 0;h < g.length;h++) {
          c.push(g[h]);
        }
      }
    } else {
      c.push(e);
    }
  }
  return c;
};
l.a.rotate = function(a, c) {
  a.length && (c %= a.length, 0 < c ? l.a.n.unshift.apply(a, a.splice(-c, c)) : 0 > c && l.a.n.push.apply(a, a.splice(0, -c)));
  return a;
};
l.a.ll = function(a, c, d) {
  c = l.a.n.splice.call(a, c, 1);
  l.a.n.splice.call(a, d, 0, c[0]);
};
l.a.Zd = function(a) {
  if (!arguments.length) {
    return[];
  }
  for (var c = [], d = 0;;d++) {
    for (var e = [], f = 0;f < arguments.length;f++) {
      var g = arguments[f];
      if (d >= g.length) {
        return c;
      }
      e.push(g[d]);
    }
    c.push(e);
  }
};
l.a.Nl = function(a, c) {
  for (var d = c || Math.random, e = a.length - 1;0 < e;e--) {
    var f = Math.floor(d() * (e + 1)), g = a[e];
    a[e] = a[f];
    a[f] = g;
  }
};
l.a.Xj = function(a, c) {
  var d = [];
  l.a.forEach(c, function(c) {
    d.push(a[c]);
  });
  return d;
};
l.o = {};
l.o.constant = function(a) {
  return function() {
    return a;
  };
};
l.o.ui = l.o.constant(!1);
l.o.cj = l.o.constant(!0);
l.o.Ri = l.o.constant(null);
l.o.identity = function(a) {
  return a;
};
l.o.error = function(a) {
  return function() {
    throw Error(a);
  };
};
l.o.Zc = function(a) {
  return function() {
    throw a;
  };
};
l.o.gl = function(a, c) {
  c = c || 0;
  return function() {
    return a.apply(this, Array.prototype.slice.call(arguments, 0, c));
  };
};
l.o.ql = function(a) {
  return function() {
    return arguments[a];
  };
};
l.o.hm = function(a, c) {
  return l.o.Kh(a, l.o.constant(c));
};
l.o.hk = function(a, c) {
  return function(d) {
    return c ? a == d : a === d;
  };
};
l.o.Vj = function(a, c) {
  var d = arguments, e = d.length;
  return function() {
    var a;
    e && (a = d[e - 1].apply(this, arguments));
    for (var c = e - 2;0 <= c;c--) {
      a = d[c].call(this, a);
    }
    return a;
  };
};
l.o.Kh = function(a) {
  var c = arguments, d = c.length;
  return function() {
    for (var a, f = 0;f < d;f++) {
      a = c[f].apply(this, arguments);
    }
    return a;
  };
};
l.o.lj = function(a) {
  var c = arguments, d = c.length;
  return function() {
    for (var a = 0;a < d;a++) {
      if (!c[a].apply(this, arguments)) {
        return!1;
      }
    }
    return!0;
  };
};
l.o.vl = function(a) {
  var c = arguments, d = c.length;
  return function() {
    for (var a = 0;a < d;a++) {
      if (c[a].apply(this, arguments)) {
        return!0;
      }
    }
    return!1;
  };
};
l.o.oh = function(a) {
  return function() {
    return!a.apply(this, arguments);
  };
};
l.o.create = function(a, c) {
  var d = function() {
  };
  d.prototype = a.prototype;
  d = new d;
  a.apply(d, Array.prototype.slice.call(arguments, 1));
  return d;
};
l.o.ee = !0;
l.o.Ij = function(a) {
  var c = !1, d;
  return function() {
    if (!l.o.ee) {
      return a();
    }
    c || (d = a(), c = !0);
    return d;
  };
};
l.k = {};
l.k.zl = function(a) {
  return Math.floor(Math.random() * a);
};
l.k.em = function(a, c) {
  return a + Math.random() * (c - a);
};
l.k.Pj = function(a, c, d) {
  return Math.min(Math.max(a, c), d);
};
l.k.Kd = function(a, c) {
  var d = a % c;
  return 0 > d * c ? d + c : d;
};
l.k.el = function(a, c, d) {
  return a + d * (c - a);
};
l.k.ml = function(a, c, d) {
  return Math.abs(a - c) <= (d || 1E-6);
};
l.k.Zb = function(a) {
  return l.k.Kd(a, 360);
};
l.k.Rl = function(a) {
  return l.k.Kd(a, 2 * Math.PI);
};
l.k.Ud = function(a) {
  return a * Math.PI / 180;
};
l.k.Uh = function(a) {
  return 180 * a / Math.PI;
};
l.k.oj = function(a, c) {
  return c * Math.cos(l.k.Ud(a));
};
l.k.pj = function(a, c) {
  return c * Math.sin(l.k.Ud(a));
};
l.k.mj = function(a, c, d, e) {
  return l.k.Zb(l.k.Uh(Math.atan2(e - c, d - a)));
};
l.k.nj = function(a, c) {
  var d = l.k.Zb(c) - l.k.Zb(a);
  180 < d ? d -= 360 : -180 >= d && (d = 360 + d);
  return d;
};
l.k.sign = function(a) {
  return 0 == a ? 0 : 0 > a ? -1 : 1;
};
l.k.jl = function(a, c, d, e) {
  d = d || function(a, c) {
    return a == c;
  };
  e = e || function(c) {
    return a[c];
  };
  for (var f = a.length, g = c.length, h = [], k = 0;k < f + 1;k++) {
    h[k] = [], h[k][0] = 0;
  }
  for (var n = 0;n < g + 1;n++) {
    h[0][n] = 0;
  }
  for (k = 1;k <= f;k++) {
    for (n = 1;n <= g;n++) {
      d(a[k - 1], c[n - 1]) ? h[k][n] = h[k - 1][n - 1] + 1 : h[k][n] = Math.max(h[k - 1][n], h[k][n - 1]);
    }
  }
  for (var p = [], k = f, n = g;0 < k && 0 < n;) {
    d(a[k - 1], c[n - 1]) ? (p.unshift(e(k - 1, n - 1)), k--, n--) : h[k - 1][n] > h[k][n - 1] ? k-- : n--;
  }
  return p;
};
l.k.Sd = function(a) {
  return l.a.reduce(arguments, function(a, d) {
    return a + d;
  }, 0);
};
l.k.Qf = function(a) {
  return l.k.Sd.apply(null, arguments) / arguments.length;
};
l.k.Hh = function(a) {
  var c = arguments.length;
  if (2 > c) {
    return 0;
  }
  var d = l.k.Qf.apply(null, arguments);
  return l.k.Sd.apply(null, l.a.map(arguments, function(a) {
    return Math.pow(a - d, 2);
  })) / (c - 1);
};
l.k.Sl = function(a) {
  return Math.sqrt(l.k.Hh.apply(null, arguments));
};
l.k.Tk = function(a) {
  return isFinite(a) && 0 == a % 1;
};
l.k.Rk = function(a) {
  return isFinite(a) && !isNaN(a);
};
l.k.hl = function(a) {
  if (0 < a) {
    var c = Math.round(Math.log(a) * Math.LOG10E);
    return c - (parseFloat("1e" + c) > a);
  }
  return 0 == a ? -Infinity : NaN;
};
l.k.Fl = function(a, c) {
  return Math.floor(a + (c || 2E-15));
};
l.k.El = function(a, c) {
  return Math.ceil(a - (c || 2E-15));
};
l.e = {};
l.e.A = "StopIteration" in l.global ? l.global.StopIteration : Error("StopIteration");
l.e.Iterator = function() {
};
l.e.Iterator.prototype.next = function() {
  throw l.e.A;
};
l.e.Iterator.prototype.vb = function() {
  return this;
};
l.e.t = function(a) {
  if (a instanceof l.e.Iterator) {
    return a;
  }
  if ("function" == typeof a.vb) {
    return a.vb(!1);
  }
  if (l.w(a)) {
    var c = 0, d = new l.e.Iterator;
    d.next = function() {
      for (;;) {
        if (c >= a.length) {
          throw l.e.A;
        }
        if (c in a) {
          return a[c++];
        }
        c++;
      }
    };
    return d;
  }
  throw Error("Not implemented");
};
l.e.forEach = function(a, c, d) {
  if (l.w(a)) {
    try {
      l.a.forEach(a, c, d);
    } catch (e) {
      if (e !== l.e.A) {
        throw e;
      }
    }
  } else {
    a = l.e.t(a);
    try {
      for (;;) {
        c.call(d, a.next(), void 0, a);
      }
    } catch (f) {
      if (f !== l.e.A) {
        throw f;
      }
    }
  }
};
l.e.filter = function(a, c, d) {
  var e = l.e.t(a);
  a = new l.e.Iterator;
  a.next = function() {
    for (;;) {
      var a = e.next();
      if (c.call(d, a, void 0, e)) {
        return a;
      }
    }
  };
  return a;
};
l.e.jk = function(a, c, d) {
  return l.e.filter(a, l.o.oh(c), d);
};
l.e.eb = function(a, c, d) {
  var e = 0, f = a, g = d || 1;
  1 < arguments.length && (e = a, f = c);
  if (0 == g) {
    throw Error("Range step argument must not be zero");
  }
  var h = new l.e.Iterator;
  h.next = function() {
    if (0 < g && e >= f || 0 > g && e <= f) {
      throw l.e.A;
    }
    var a = e;
    e += g;
    return a;
  };
  return h;
};
l.e.join = function(a, c) {
  return l.e.aa(a).join(c);
};
l.e.map = function(a, c, d) {
  var e = l.e.t(a);
  a = new l.e.Iterator;
  a.next = function() {
    var a = e.next();
    return c.call(d, a, void 0, e);
  };
  return a;
};
l.e.reduce = function(a, c, d, e) {
  var f = d;
  l.e.forEach(a, function(a) {
    f = c.call(e, f, a);
  });
  return f;
};
l.e.some = function(a, c, d) {
  a = l.e.t(a);
  try {
    for (;;) {
      if (c.call(d, a.next(), void 0, a)) {
        return!0;
      }
    }
  } catch (e) {
    if (e !== l.e.A) {
      throw e;
    }
  }
  return!1;
};
l.e.every = function(a, c, d) {
  a = l.e.t(a);
  try {
    for (;;) {
      if (!c.call(d, a.next(), void 0, a)) {
        return!1;
      }
    }
  } catch (e) {
    if (e !== l.e.A) {
      throw e;
    }
  }
  return!0;
};
l.e.Oj = function(a) {
  return l.e.Wf(arguments);
};
l.e.Wf = function(a) {
  var c = l.e.t(a);
  a = new l.e.Iterator;
  var d = null;
  a.next = function() {
    for (;;) {
      if (null == d) {
        var a = c.next();
        d = l.e.t(a);
      }
      try {
        return d.next();
      } catch (f) {
        if (f !== l.e.A) {
          throw f;
        }
        d = null;
      }
    }
  };
  return a;
};
l.e.ek = function(a, c, d) {
  var e = l.e.t(a);
  a = new l.e.Iterator;
  var f = !0;
  a.next = function() {
    for (;;) {
      var a = e.next();
      if (!f || !c.call(d, a, void 0, e)) {
        return f = !1, a;
      }
    }
  };
  return a;
};
l.e.Xl = function(a, c, d) {
  var e = l.e.t(a);
  a = new l.e.Iterator;
  a.next = function() {
    var a = e.next();
    if (c.call(d, a, void 0, e)) {
      return a;
    }
    throw l.e.A;
  };
  return a;
};
l.e.aa = function(a) {
  if (l.w(a)) {
    return l.a.aa(a);
  }
  a = l.e.t(a);
  var c = [];
  l.e.forEach(a, function(a) {
    c.push(a);
  });
  return c;
};
l.e.equals = function(a, c, d) {
  a = l.e.ci({}, a, c);
  var e = d || l.a.Uc;
  return l.e.every(a, function(a) {
    return e(a[0], a[1]);
  });
};
l.e.nh = function(a, c) {
  try {
    return l.e.t(a).next();
  } catch (d) {
    if (d != l.e.A) {
      throw d;
    }
    return c;
  }
};
l.e.product = function(a) {
  if (l.a.some(arguments, function(a) {
    return!a.length;
  }) || !arguments.length) {
    return new l.e.Iterator;
  }
  var c = new l.e.Iterator, d = arguments, e = l.a.repeat(0, d.length);
  c.next = function() {
    if (e) {
      for (var a = l.a.map(e, function(a, c) {
        return d[c][a];
      }), c = e.length - 1;0 <= c;c--) {
        if (e[c] < d[c].length - 1) {
          e[c]++;
          break;
        }
        if (0 == c) {
          e = null;
          break;
        }
        e[c] = 0;
      }
      return a;
    }
    throw l.e.A;
  };
  return c;
};
l.e.ck = function(a) {
  var c = l.e.t(a), d = [], e = 0;
  a = new l.e.Iterator;
  var f = !1;
  a.next = function() {
    var a = null;
    if (!f) {
      try {
        return a = c.next(), d.push(a), a;
      } catch (h) {
        if (h != l.e.A || l.a.L(d)) {
          throw h;
        }
        f = !0;
      }
    }
    a = d[e];
    e = (e + 1) % d.length;
    return a;
  };
  return a;
};
l.e.count = function(a, c) {
  var d = a || 0, e = l.V(c) ? c : 1, f = new l.e.Iterator;
  f.next = function() {
    var a = d;
    d += e;
    return a;
  };
  return f;
};
l.e.repeat = function(a) {
  var c = new l.e.Iterator;
  c.next = l.o.constant(a);
  return c;
};
l.e.ij = function(a) {
  var c = l.e.t(a), d = 0;
  a = new l.e.Iterator;
  a.next = function() {
    return d += c.next();
  };
  return a;
};
l.e.Zd = function(a) {
  var c = arguments, d = new l.e.Iterator;
  if (0 < c.length) {
    var e = l.a.map(c, l.e.t);
    d.next = function() {
      return l.a.map(e, function(a) {
        return a.next();
      });
    };
  }
  return d;
};
l.e.ci = function(a, c) {
  var d = l.a.slice(arguments, 1), e = new l.e.Iterator;
  if (0 < d.length) {
    var f = l.a.map(d, l.e.t);
    e.next = function() {
      var c = !1, d = l.a.map(f, function(d) {
        var e;
        try {
          e = d.next(), c = !0;
        } catch (f) {
          if (f !== l.e.A) {
            throw f;
          }
          e = a;
        }
        return e;
      });
      if (!c) {
        throw l.e.A;
      }
      return d;
    };
  }
  return e;
};
l.e.Wj = function(a, c) {
  var d = l.e.t(c);
  return l.e.filter(a, function() {
    return!!d.next();
  });
};
l.e.Na = function(a, c) {
  this.iterator = l.e.t(a);
  this.Fd = c || l.o.identity;
};
l.sa(l.e.Na, l.e.Iterator);
l.e.Na.prototype.next = function() {
  for (;this.Ba == this.Td;) {
    this.Sa = this.iterator.next(), this.Ba = this.Fd(this.Sa);
  }
  this.Td = this.Ba;
  return[this.Ba, this.Dg(this.Td)];
};
l.e.Na.prototype.Dg = function(a) {
  for (var c = [];this.Ba == a;) {
    c.push(this.Sa);
    try {
      this.Sa = this.iterator.next();
    } catch (d) {
      if (d !== l.e.A) {
        throw d;
      }
      break;
    }
    this.Ba = this.Fd(this.Sa);
  }
  return c;
};
l.e.Bk = function(a, c) {
  return new l.e.Na(a, c);
};
l.e.Tl = function(a, c, d) {
  var e = l.e.t(a);
  a = new l.e.Iterator;
  a.next = function() {
    var a = l.e.aa(e.next());
    return c.apply(d, l.a.concat(a, void 0, e));
  };
  return a;
};
l.e.Yl = function(a, c) {
  var d = l.e.t(a), e = l.isNumber(c) ? c : 2, f = l.a.map(l.a.eb(e), function() {
    return[];
  }), g = function() {
    var a = d.next();
    l.a.forEach(f, function(c) {
      c.push(a);
    });
  };
  return l.a.map(f, function(a) {
    var c = new l.e.Iterator;
    c.next = function() {
      l.a.L(a) && g();
      return a.shift();
    };
    return c;
  });
};
l.e.gk = function(a, c) {
  return l.e.Zd(l.e.count(c), a);
};
l.e.limit = function(a, c) {
  var d = l.e.t(a), e = new l.e.Iterator, f = c;
  e.next = function() {
    if (0 < f--) {
      return d.next();
    }
    throw l.e.A;
  };
  return e;
};
l.e.Yf = function(a, c) {
  for (var d = l.e.t(a);0 < c--;) {
    l.e.nh(d, null);
  }
  return d;
};
l.e.slice = function(a, c, d) {
  a = l.e.Yf(a, c);
  l.isNumber(d) && (a = l.e.limit(a, d - c));
  return a;
};
l.e.Eg = function(a) {
  var c = [];
  l.a.Dh(a, c);
  return a.length != c.length;
};
l.e.th = function(a, c) {
  var d = l.e.aa(a), e = l.isNumber(c) ? c : d.length, d = l.a.repeat(d, e), d = l.e.product.apply(void 0, d);
  return l.e.filter(d, function(a) {
    return!l.e.Eg(a);
  });
};
l.e.Sj = function(a, c) {
  function d(a) {
    return e[a];
  }
  var e = l.e.aa(a), f = l.e.eb(e.length), f = l.e.th(f, c), g = l.e.filter(f, function(a) {
    return l.a.Bd(a);
  }), f = new l.e.Iterator;
  f.next = function() {
    return l.a.map(g.next(), d);
  };
  return f;
};
l.e.Tj = function(a, c) {
  function d(a) {
    return e[a];
  }
  var e = l.e.aa(a), f = l.a.eb(e.length), f = l.a.repeat(f, c), f = l.e.product.apply(void 0, f), g = l.e.filter(f, function(a) {
    return l.a.Bd(a);
  }), f = new l.e.Iterator;
  f.next = function() {
    return l.a.map(g.next(), d);
  };
  return f;
};
l.object = {};
l.object.forEach = function(a, c, d) {
  for (var e in a) {
    c.call(d, a[e], e, a);
  }
};
l.object.filter = function(a, c, d) {
  var e = {}, f;
  for (f in a) {
    c.call(d, a[f], f, a) && (e[f] = a[f]);
  }
  return e;
};
l.object.map = function(a, c, d) {
  var e = {}, f;
  for (f in a) {
    e[f] = c.call(d, a[f], f, a);
  }
  return e;
};
l.object.some = function(a, c, d) {
  for (var e in a) {
    if (c.call(d, a[e], e, a)) {
      return!0;
    }
  }
  return!1;
};
l.object.every = function(a, c, d) {
  for (var e in a) {
    if (!c.call(d, a[e], e, a)) {
      return!1;
    }
  }
  return!0;
};
l.object.ga = function(a) {
  var c = 0, d;
  for (d in a) {
    c++;
  }
  return c;
};
l.object.nk = function(a) {
  for (var c in a) {
    return c;
  }
};
l.object.ok = function(a) {
  for (var c in a) {
    return a[c];
  }
};
l.object.contains = function(a, c) {
  return l.object.la(a, c);
};
l.object.u = function(a) {
  var c = [], d = 0, e;
  for (e in a) {
    c[d++] = a[e];
  }
  return c;
};
l.object.B = function(a) {
  var c = [], d = 0, e;
  for (e in a) {
    c[d++] = e;
  }
  return c;
};
l.object.zk = function(a, c) {
  for (var d = l.w(c), e = d ? c : arguments, d = d ? 0 : 1;d < e.length && (a = a[e[d]], l.V(a));d++) {
  }
  return a;
};
l.object.fa = function(a, c) {
  return c in a;
};
l.object.la = function(a, c) {
  for (var d in a) {
    if (a[d] == c) {
      return!0;
    }
  }
  return!1;
};
l.object.jg = function(a, c, d) {
  for (var e in a) {
    if (c.call(d, a[e], e, a)) {
      return e;
    }
  }
};
l.object.lk = function(a, c, d) {
  return(c = l.object.jg(a, c, d)) && a[c];
};
l.object.L = function(a) {
  for (var c in a) {
    return!1;
  }
  return!0;
};
l.object.clear = function(a) {
  for (var c in a) {
    delete a[c];
  }
};
l.object.remove = function(a, c) {
  var d;
  (d = c in a) && delete a[c];
  return d;
};
l.object.add = function(a, c, d) {
  if (c in a) {
    throw Error('The object already contains the key "' + c + '"');
  }
  l.object.set(a, c, d);
};
l.object.get = function(a, c, d) {
  return c in a ? a[c] : d;
};
l.object.set = function(a, c, d) {
  a[c] = d;
};
l.object.Jl = function(a, c, d) {
  return c in a ? a[c] : a[c] = d;
};
l.object.Ml = function(a, c, d) {
  if (c in a) {
    return a[c];
  }
  d = d();
  return a[c] = d;
};
l.object.equals = function(a, c) {
  for (var d in a) {
    if (!(d in c) || a[d] !== c[d]) {
      return!1;
    }
  }
  for (d in c) {
    if (!(d in a)) {
      return!1;
    }
  }
  return!0;
};
l.object.clone = function(a) {
  var c = {}, d;
  for (d in a) {
    c[d] = a[d];
  }
  return c;
};
l.object.ai = function(a) {
  var c = l.I(a);
  if ("object" == c || "array" == c) {
    if (a.clone) {
      return a.clone();
    }
    var c = "array" == c ? [] : {}, d;
    for (d in a) {
      c[d] = l.object.ai(a[d]);
    }
    return c;
  }
  return a;
};
l.object.Xh = function(a) {
  var c = {}, d;
  for (d in a) {
    c[a[d]] = d;
  }
  return c;
};
l.object.Ac = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
l.object.extend = function(a, c) {
  for (var d, e, f = 1;f < arguments.length;f++) {
    e = arguments[f];
    for (d in e) {
      a[d] = e[d];
    }
    for (var g = 0;g < l.object.Ac.length;g++) {
      d = l.object.Ac[g], Object.prototype.hasOwnProperty.call(e, d) && (a[d] = e[d]);
    }
  }
};
l.object.create = function(a) {
  var c = arguments.length;
  if (1 == c && l.isArray(arguments[0])) {
    return l.object.create.apply(null, arguments[0]);
  }
  if (c % 2) {
    throw Error("Uneven number of arguments");
  }
  for (var d = {}, e = 0;e < c;e += 2) {
    d[arguments[e]] = arguments[e + 1];
  }
  return d;
};
l.object.$f = function(a) {
  var c = arguments.length;
  if (1 == c && l.isArray(arguments[0])) {
    return l.object.$f.apply(null, arguments[0]);
  }
  for (var d = {}, e = 0;e < c;e++) {
    d[arguments[e]] = !0;
  }
  return d;
};
l.object.ak = function(a) {
  var c = a;
  Object.isFrozen && !Object.isFrozen(a) && (c = Object.create(a), Object.freeze(c));
  return c;
};
l.object.Sk = function(a) {
  return!!Object.isFrozen && Object.isFrozen(a);
};
l.j = {};
l.j.Map = function(a, c) {
  this.C = {};
  this.q = [];
  this.Ja = this.p = 0;
  var d = arguments.length;
  if (1 < d) {
    if (d % 2) {
      throw Error("Uneven number of arguments");
    }
    for (var e = 0;e < d;e += 2) {
      this.set(arguments[e], arguments[e + 1]);
    }
  } else {
    a && this.Mf(a);
  }
};
b = l.j.Map.prototype;
b.ga = function() {
  return this.p;
};
b.u = function() {
  this.ka();
  for (var a = [], c = 0;c < this.q.length;c++) {
    a.push(this.C[this.q[c]]);
  }
  return a;
};
b.B = function() {
  this.ka();
  return this.q.concat();
};
b.fa = function(a) {
  return l.j.Map.ha(this.C, a);
};
b.la = function(a) {
  for (var c = 0;c < this.q.length;c++) {
    var d = this.q[c];
    if (l.j.Map.ha(this.C, d) && this.C[d] == a) {
      return!0;
    }
  }
  return!1;
};
b.equals = function(a, c) {
  if (this === a) {
    return!0;
  }
  if (this.p != a.ga()) {
    return!1;
  }
  var d = c || l.j.Map.bg;
  this.ka();
  for (var e, f = 0;e = this.q[f];f++) {
    if (!d(this.get(e), a.get(e))) {
      return!1;
    }
  }
  return!0;
};
l.j.Map.bg = function(a, c) {
  return a === c;
};
b = l.j.Map.prototype;
b.L = function() {
  return 0 == this.p;
};
b.clear = function() {
  this.C = {};
  this.Ja = this.p = this.q.length = 0;
};
b.remove = function(a) {
  return l.j.Map.ha(this.C, a) ? (delete this.C[a], this.p--, this.Ja++, this.q.length > 2 * this.p && this.ka(), !0) : !1;
};
b.ka = function() {
  if (this.p != this.q.length) {
    for (var a = 0, c = 0;a < this.q.length;) {
      var d = this.q[a];
      l.j.Map.ha(this.C, d) && (this.q[c++] = d);
      a++;
    }
    this.q.length = c;
  }
  if (this.p != this.q.length) {
    for (var e = {}, c = a = 0;a < this.q.length;) {
      d = this.q[a], l.j.Map.ha(e, d) || (this.q[c++] = d, e[d] = 1), a++;
    }
    this.q.length = c;
  }
};
b.get = function(a, c) {
  return l.j.Map.ha(this.C, a) ? this.C[a] : c;
};
b.set = function(a, c) {
  l.j.Map.ha(this.C, a) || (this.p++, this.q.push(a), this.Ja++);
  this.C[a] = c;
};
b.Mf = function(a) {
  var c;
  a instanceof l.j.Map ? (c = a.B(), a = a.u()) : (c = l.object.B(a), a = l.object.u(a));
  for (var d = 0;d < c.length;d++) {
    this.set(c[d], a[d]);
  }
};
b.forEach = function(a, c) {
  for (var d = this.B(), e = 0;e < d.length;e++) {
    var f = d[e], g = this.get(f);
    a.call(c, g, f, this);
  }
};
b.clone = function() {
  return new l.j.Map(this);
};
b.Xh = function() {
  for (var a = new l.j.Map, c = 0;c < this.q.length;c++) {
    var d = this.q[c];
    a.set(this.C[d], d);
  }
  return a;
};
b.Vh = function() {
  this.ka();
  for (var a = {}, c = 0;c < this.q.length;c++) {
    var d = this.q[c];
    a[d] = this.C[d];
  }
  return a;
};
b.vb = function(a) {
  this.ka();
  var c = 0, d = this.q, e = this.C, f = this.Ja, g = this, h = new l.e.Iterator;
  h.next = function() {
    for (;;) {
      if (f != g.Ja) {
        throw Error("The map has changed since the iterator was created");
      }
      if (c >= d.length) {
        throw l.e.A;
      }
      var h = d[c++];
      return a ? h : e[h];
    }
  };
  return h;
};
l.j.Map.ha = function(a, c) {
  return Object.prototype.hasOwnProperty.call(a, c);
};
l.j.ga = function(a) {
  return "function" == typeof a.ga ? a.ga() : l.w(a) || l.isString(a) ? a.length : l.object.ga(a);
};
l.j.u = function(a) {
  if ("function" == typeof a.u) {
    return a.u();
  }
  if (l.isString(a)) {
    return a.split("");
  }
  if (l.w(a)) {
    for (var c = [], d = a.length, e = 0;e < d;e++) {
      c.push(a[e]);
    }
    return c;
  }
  return l.object.u(a);
};
l.j.B = function(a) {
  if ("function" == typeof a.B) {
    return a.B();
  }
  if ("function" != typeof a.u) {
    if (l.w(a) || l.isString(a)) {
      var c = [];
      a = a.length;
      for (var d = 0;d < a;d++) {
        c.push(d);
      }
      return c;
    }
    return l.object.B(a);
  }
};
l.j.contains = function(a, c) {
  return "function" == typeof a.contains ? a.contains(c) : "function" == typeof a.la ? a.la(c) : l.w(a) || l.isString(a) ? l.a.contains(a, c) : l.object.la(a, c);
};
l.j.L = function(a) {
  return "function" == typeof a.L ? a.L() : l.w(a) || l.isString(a) ? l.a.L(a) : l.object.L(a);
};
l.j.clear = function(a) {
  "function" == typeof a.clear ? a.clear() : l.w(a) ? l.a.clear(a) : l.object.clear(a);
};
l.j.forEach = function(a, c, d) {
  if ("function" == typeof a.forEach) {
    a.forEach(c, d);
  } else {
    if (l.w(a) || l.isString(a)) {
      l.a.forEach(a, c, d);
    } else {
      for (var e = l.j.B(a), f = l.j.u(a), g = f.length, h = 0;h < g;h++) {
        c.call(d, f[h], e && e[h], a);
      }
    }
  }
};
l.j.filter = function(a, c, d) {
  if ("function" == typeof a.filter) {
    return a.filter(c, d);
  }
  if (l.w(a) || l.isString(a)) {
    return l.a.filter(a, c, d);
  }
  var e, f = l.j.B(a), g = l.j.u(a), h = g.length;
  if (f) {
    e = {};
    for (var k = 0;k < h;k++) {
      c.call(d, g[k], f[k], a) && (e[f[k]] = g[k]);
    }
  } else {
    for (e = [], k = 0;k < h;k++) {
      c.call(d, g[k], void 0, a) && e.push(g[k]);
    }
  }
  return e;
};
l.j.map = function(a, c, d) {
  if ("function" == typeof a.map) {
    return a.map(c, d);
  }
  if (l.w(a) || l.isString(a)) {
    return l.a.map(a, c, d);
  }
  var e, f = l.j.B(a), g = l.j.u(a), h = g.length;
  if (f) {
    e = {};
    for (var k = 0;k < h;k++) {
      e[f[k]] = c.call(d, g[k], f[k], a);
    }
  } else {
    for (e = [], k = 0;k < h;k++) {
      e[k] = c.call(d, g[k], void 0, a);
    }
  }
  return e;
};
l.j.some = function(a, c, d) {
  if ("function" == typeof a.some) {
    return a.some(c, d);
  }
  if (l.w(a) || l.isString(a)) {
    return l.a.some(a, c, d);
  }
  for (var e = l.j.B(a), f = l.j.u(a), g = f.length, h = 0;h < g;h++) {
    if (c.call(d, f[h], e && e[h], a)) {
      return!0;
    }
  }
  return!1;
};
l.j.every = function(a, c, d) {
  if ("function" == typeof a.every) {
    return a.every(c, d);
  }
  if (l.w(a) || l.isString(a)) {
    return l.a.every(a, c, d);
  }
  for (var e = l.j.B(a), f = l.j.u(a), g = f.length, h = 0;h < g;h++) {
    if (!c.call(d, f[h], e && e[h], a)) {
      return!1;
    }
  }
  return!0;
};
l.c = {};
l.c.userAgent = {};
l.c.userAgent.h = {};
l.c.userAgent.h.dd = function() {
  var a = l.c.userAgent.h.tg();
  return a && (a = a.userAgent) ? a : "";
};
l.c.userAgent.h.tg = function() {
  return l.global.navigator;
};
l.c.userAgent.h.Xd = l.c.userAgent.h.dd();
l.c.userAgent.h.Ll = function(a) {
  l.c.userAgent.h.Xd = a || l.c.userAgent.h.dd();
};
l.c.userAgent.h.ra = function() {
  return l.c.userAgent.h.Xd;
};
l.c.userAgent.h.m = function(a) {
  return l.b.contains(l.c.userAgent.h.ra(), a);
};
l.c.userAgent.h.kh = function(a) {
  return l.b.Vf(l.c.userAgent.h.ra(), a);
};
l.c.userAgent.h.Yc = function(a) {
  for (var c = /(\w[\w ]+)\/([^\s]+)\s*(?:\((.*?)\))?/g, d = [], e;e = c.exec(a);) {
    d.push([e[1], e[2], e[3] || void 0]);
  }
  return d;
};
l.c.userAgent.browser = {};
l.c.userAgent.browser.Pb = function() {
  return l.c.userAgent.h.m("Opera") || l.c.userAgent.h.m("OPR");
};
l.c.userAgent.browser.Ob = function() {
  return l.c.userAgent.h.m("Edge") || l.c.userAgent.h.m("Trident") || l.c.userAgent.h.m("MSIE");
};
l.c.userAgent.browser.ih = function() {
  return l.c.userAgent.h.m("Firefox");
};
l.c.userAgent.browser.Hd = function() {
  return l.c.userAgent.h.m("Safari") && !(l.c.userAgent.browser.Mb() || l.c.userAgent.browser.Nb() || l.c.userAgent.browser.Pb() || l.c.userAgent.browser.Ob() || l.c.userAgent.browser.Ad() || l.c.userAgent.h.m("Android"));
};
l.c.userAgent.browser.Nb = function() {
  return l.c.userAgent.h.m("Coast");
};
l.c.userAgent.browser.jh = function() {
  return(l.c.userAgent.h.m("iPad") || l.c.userAgent.h.m("iPhone")) && !l.c.userAgent.browser.Hd() && !l.c.userAgent.browser.Mb() && !l.c.userAgent.browser.Nb() && l.c.userAgent.h.m("AppleWebKit");
};
l.c.userAgent.browser.Mb = function() {
  return(l.c.userAgent.h.m("Chrome") || l.c.userAgent.h.m("CriOS")) && !l.c.userAgent.browser.Pb() && !l.c.userAgent.browser.Ob();
};
l.c.userAgent.browser.hh = function() {
  return l.c.userAgent.h.m("Android") && !(l.c.userAgent.browser.rd() || l.c.userAgent.browser.Rg() || l.c.userAgent.browser.Lb() || l.c.userAgent.browser.Ad());
};
l.c.userAgent.browser.Lb = l.c.userAgent.browser.Pb;
l.c.userAgent.browser.vd = l.c.userAgent.browser.Ob;
l.c.userAgent.browser.Rg = l.c.userAgent.browser.ih;
l.c.userAgent.browser.Zk = l.c.userAgent.browser.Hd;
l.c.userAgent.browser.Mk = l.c.userAgent.browser.Nb;
l.c.userAgent.browser.Uk = l.c.userAgent.browser.jh;
l.c.userAgent.browser.rd = l.c.userAgent.browser.Mb;
l.c.userAgent.browser.Kk = l.c.userAgent.browser.hh;
l.c.userAgent.browser.Ad = function() {
  return l.c.userAgent.h.m("Silk");
};
l.c.userAgent.browser.Ea = function() {
  function a(a) {
    a = l.a.find(a, e);
    return d[a] || "";
  }
  var c = l.c.userAgent.h.ra();
  if (l.c.userAgent.browser.vd()) {
    return l.c.userAgent.browser.qg(c);
  }
  var c = l.c.userAgent.h.Yc(c), d = {};
  l.a.forEach(c, function(a) {
    d[a[0]] = a[1];
  });
  var e = l.Sb(l.object.fa, d);
  return l.c.userAgent.browser.Lb() ? a(["Version", "Opera", "OPR"]) : l.c.userAgent.browser.rd() ? a(["Chrome", "CriOS"]) : (c = c[2]) && c[1] || "";
};
l.c.userAgent.browser.bb = function(a) {
  return 0 <= l.b.Aa(l.c.userAgent.browser.Ea(), a);
};
l.c.userAgent.browser.qg = function(a) {
  var c = /rv: *([\d\.]*)/.exec(a);
  if (c && c[1] || (c = /Edge\/([\d\.]+)/.exec(a))) {
    return c[1];
  }
  var c = "", d = /MSIE +([\d\.]+)/.exec(a);
  if (d && d[1]) {
    if (a = /Trident\/(\d.\d)/.exec(a), "7.0" == d[1]) {
      if (a && a[1]) {
        switch(a[1]) {
          case "4.0":
            c = "8.0";
            break;
          case "5.0":
            c = "9.0";
            break;
          case "6.0":
            c = "10.0";
            break;
          case "7.0":
            c = "11.0";
        }
      } else {
        c = "7.0";
      }
    } else {
      c = d[1];
    }
  }
  return c;
};
l.c.userAgent.r = {};
l.c.userAgent.r.Yk = function() {
  return l.c.userAgent.h.m("Presto");
};
l.c.userAgent.r.$g = function() {
  return l.c.userAgent.h.m("Trident") || l.c.userAgent.h.m("MSIE");
};
l.c.userAgent.r.ia = function() {
  return l.c.userAgent.h.m("Edge");
};
l.c.userAgent.r.Dd = function() {
  return l.c.userAgent.h.kh("WebKit") && !l.c.userAgent.r.ia();
};
l.c.userAgent.r.Sg = function() {
  return l.c.userAgent.h.m("Gecko") && !l.c.userAgent.r.Dd() && !l.c.userAgent.r.$g() && !l.c.userAgent.r.ia();
};
l.c.userAgent.r.Ea = function() {
  var a = l.c.userAgent.h.ra();
  if (a) {
    var a = l.c.userAgent.h.Yc(a), c = l.c.userAgent.r.og(a);
    if (c) {
      return "Gecko" == c[0] ? l.c.userAgent.r.Ag(a, "Firefox") : c[1];
    }
    var a = a[0], d;
    if (a && (d = a[2]) && (d = /Trident\/([^\s;]+)/.exec(d))) {
      return d[1];
    }
  }
  return "";
};
l.c.userAgent.r.og = function(a) {
  if (!l.c.userAgent.r.ia()) {
    return a[1];
  }
  for (var c = 0;c < a.length;c++) {
    var d = a[c];
    if ("Edge" == d[0]) {
      return d;
    }
  }
};
l.c.userAgent.r.bb = function(a) {
  return 0 <= l.b.Aa(l.c.userAgent.r.Ea(), a);
};
l.c.userAgent.r.Ag = function(a, c) {
  var d = l.a.find(a, function(a) {
    return c == a[0];
  });
  return d && d[1] || "";
};
l.c.userAgent.platform = {};
l.c.userAgent.platform.qd = function() {
  return l.c.userAgent.h.m("Android");
};
l.c.userAgent.platform.Ug = function() {
  return l.c.userAgent.h.m("iPod");
};
l.c.userAgent.platform.yd = function() {
  return l.c.userAgent.h.m("iPhone") && !l.c.userAgent.h.m("iPod") && !l.c.userAgent.h.m("iPad");
};
l.c.userAgent.platform.xd = function() {
  return l.c.userAgent.h.m("iPad");
};
l.c.userAgent.platform.Tg = function() {
  return l.c.userAgent.platform.yd() || l.c.userAgent.platform.xd() || l.c.userAgent.platform.Ug();
};
l.c.userAgent.platform.zd = function() {
  return l.c.userAgent.h.m("Macintosh");
};
l.c.userAgent.platform.Wg = function() {
  return l.c.userAgent.h.m("Linux");
};
l.c.userAgent.platform.Ed = function() {
  return l.c.userAgent.h.m("Windows");
};
l.c.userAgent.platform.sd = function() {
  return l.c.userAgent.h.m("CrOS");
};
l.c.userAgent.platform.Ea = function() {
  var a = l.c.userAgent.h.ra(), c = "";
  l.c.userAgent.platform.Ed() ? (c = /Windows (?:NT|Phone) ([0-9.]+)/, c = (a = c.exec(a)) ? a[1] : "0.0") : l.c.userAgent.platform.Tg() ? (c = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/, c = (a = c.exec(a)) && a[1].replace(/_/g, ".")) : l.c.userAgent.platform.zd() ? (c = /Mac OS X ([0-9_.]+)/, c = (a = c.exec(a)) ? a[1].replace(/_/g, ".") : "10") : l.c.userAgent.platform.qd() ? (c = /Android\s+([^\);]+)(\)|;)/, c = (a = c.exec(a)) && a[1]) : l.c.userAgent.platform.sd() && (c = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/, 
  c = (a = c.exec(a)) && a[1]);
  return c || "";
};
l.c.userAgent.platform.bb = function(a) {
  return 0 <= l.b.Aa(l.c.userAgent.platform.Ea(), a);
};
l.userAgent = {};
l.userAgent.fc = !1;
l.userAgent.ec = !1;
l.userAgent.lc = !1;
l.userAgent.nb = !1;
l.userAgent.kc = !1;
l.userAgent.ce = !1;
l.userAgent.Ma = l.userAgent.fc || l.userAgent.ec || l.userAgent.nb || l.userAgent.lc || l.userAgent.kc;
l.userAgent.yg = function() {
  return l.c.userAgent.h.ra();
};
l.userAgent.ed = function() {
  return l.global.navigator || null;
};
l.userAgent.We = l.userAgent.Ma ? l.userAgent.kc : l.c.userAgent.browser.Lb();
l.userAgent.wa = l.userAgent.Ma ? l.userAgent.fc : l.c.userAgent.browser.vd();
l.userAgent.ve = l.userAgent.Ma ? l.userAgent.ec : l.c.userAgent.r.Sg();
l.userAgent.Ra = l.userAgent.Ma ? l.userAgent.lc || l.userAgent.nb : l.c.userAgent.r.Dd();
l.userAgent.Xg = function() {
  return l.userAgent.Ra && l.c.userAgent.h.m("Mobile");
};
l.userAgent.Pi = l.userAgent.nb || l.userAgent.Xg();
l.userAgent.Zi = l.userAgent.Ra;
l.userAgent.cg = function() {
  var a = l.userAgent.ed();
  return a && a.platform || "";
};
l.userAgent.Si = l.userAgent.cg();
l.userAgent.jc = !1;
l.userAgent.mc = !1;
l.userAgent.ic = !1;
l.userAgent.nc = !1;
l.userAgent.dc = !1;
l.userAgent.hc = !1;
l.userAgent.gc = !1;
l.userAgent.ca = l.userAgent.jc || l.userAgent.mc || l.userAgent.ic || l.userAgent.nc || l.userAgent.dc || l.userAgent.hc || l.userAgent.gc;
l.userAgent.Ji = l.userAgent.ca ? l.userAgent.jc : l.c.userAgent.platform.zd();
l.userAgent.fj = l.userAgent.ca ? l.userAgent.mc : l.c.userAgent.platform.Ed();
l.userAgent.Vg = function() {
  return l.c.userAgent.platform.Wg() || l.c.userAgent.platform.sd();
};
l.userAgent.Ei = l.userAgent.ca ? l.userAgent.ic : l.userAgent.Vg();
l.userAgent.ah = function() {
  var a = l.userAgent.ed();
  return!!a && l.b.contains(a.appVersion || "", "X11");
};
l.userAgent.gj = l.userAgent.ca ? l.userAgent.nc : l.userAgent.ah();
l.userAgent.ANDROID = l.userAgent.ca ? l.userAgent.dc : l.c.userAgent.platform.qd();
l.userAgent.zi = l.userAgent.ca ? l.userAgent.hc : l.c.userAgent.platform.yd();
l.userAgent.yi = l.userAgent.ca ? l.userAgent.gc : l.c.userAgent.platform.xd();
l.userAgent.dg = function() {
  if (l.userAgent.We && l.global.opera) {
    var a = l.global.opera.version;
    return l.isFunction(a) ? a() : a;
  }
  var a = "", c = l.userAgent.Bg();
  c && (a = c ? c[1] : "");
  return l.userAgent.wa && !l.c.userAgent.r.ia() && (c = l.userAgent.bd(), c > parseFloat(a)) ? String(c) : a;
};
l.userAgent.Bg = function() {
  var a = l.userAgent.yg();
  if (l.userAgent.ve) {
    return/rv\:([^\);]+)(\)|;)/.exec(a);
  }
  if (l.userAgent.wa && l.c.userAgent.r.ia()) {
    return/Edge\/([\d\.]+)/.exec(a);
  }
  if (l.userAgent.wa) {
    return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
  }
  if (l.userAgent.Ra) {
    return/WebKit\/(\S+)/.exec(a);
  }
};
l.userAgent.bd = function() {
  var a = l.global.document;
  return a ? a.documentMode : void 0;
};
l.userAgent.VERSION = l.userAgent.dg();
l.userAgent.compare = function(a, c) {
  return l.b.Aa(a, c);
};
l.userAgent.Cd = {};
l.userAgent.bb = function(a) {
  return l.userAgent.ce || l.userAgent.Cd[a] || (l.userAgent.Cd[a] = 0 <= l.b.Aa(l.userAgent.VERSION, a));
};
l.userAgent.cl = l.userAgent.bb;
l.userAgent.Pg = function(a) {
  return l.userAgent.wa && (l.c.userAgent.r.ia() || l.userAgent.me >= a);
};
l.userAgent.Ok = l.userAgent.Pg;
var t = l.userAgent, u, v = l.global.document, x = l.userAgent.bd();
u = !v || !l.userAgent.wa || !x && l.c.userAgent.r.ia() ? void 0 : x || ("CSS1Compat" == v.compatMode ? parseInt(l.userAgent.VERSION, 10) : 5);
t.me = u;
l.uri = {};
l.uri.d = {};
l.uri.d.va = {bc:38, EQUAL:61, ze:35, $e:63};
l.uri.d.yb = function(a, c, d, e, f, g, h) {
  var k = "";
  a && (k += a + ":");
  d && (k += "//", c && (k += c + "@"), k += d, e && (k += ":" + e));
  f && (k += f);
  g && (k += "?" + g);
  h && (k += "#" + h);
  return k;
};
l.uri.d.Qh = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#(.*))?$/;
l.uri.d.l = {ja:1, Qa:2, W:3, Y:4, sb:5, Oa:6, qb:7};
l.uri.d.split = function(a) {
  l.uri.d.uh();
  return a.match(l.uri.d.Qh);
};
l.uri.d.Rb = l.userAgent.Ra;
l.uri.d.uh = function() {
  if (l.uri.d.Rb) {
    l.uri.d.Rb = !1;
    var a = l.global.location;
    if (a) {
      var c = a.href;
      if (c && (c = l.uri.d.Da(c)) && c != a.hostname) {
        throw l.uri.d.Rb = !0, Error();
      }
    }
  }
};
l.uri.d.Ta = function(a, c) {
  return a ? c ? decodeURI(a) : decodeURIComponent(a) : a;
};
l.uri.d.na = function(a, c) {
  return l.uri.d.split(c)[a] || null;
};
l.uri.d.qa = function(a) {
  return l.uri.d.na(l.uri.d.l.ja, a);
};
l.uri.d.qk = function(a) {
  a = l.uri.d.qa(a);
  !a && self.location && (a = self.location.protocol, a = a.substr(0, a.length - 1));
  return a ? a.toLowerCase() : "";
};
l.uri.d.zg = function(a) {
  return l.uri.d.na(l.uri.d.l.Qa, a);
};
l.uri.d.Za = function(a) {
  return l.uri.d.Ta(l.uri.d.zg(a));
};
l.uri.d.mg = function(a) {
  return l.uri.d.na(l.uri.d.l.W, a);
};
l.uri.d.Da = function(a) {
  return l.uri.d.Ta(l.uri.d.mg(a), !0);
};
l.uri.d.Ya = function(a) {
  return Number(l.uri.d.na(l.uri.d.l.Y, a)) || null;
};
l.uri.d.vg = function(a) {
  return l.uri.d.na(l.uri.d.l.sb, a);
};
l.uri.d.pa = function(a) {
  return l.uri.d.Ta(l.uri.d.vg(a), !0);
};
l.uri.d.fd = function(a) {
  return l.uri.d.na(l.uri.d.l.Oa, a);
};
l.uri.d.pg = function(a) {
  var c = a.indexOf("#");
  return 0 > c ? null : a.substr(c + 1);
};
l.uri.d.Il = function(a, c) {
  return l.uri.d.Eh(a) + (c ? "#" + c : "");
};
l.uri.d.Xa = function(a) {
  return l.uri.d.Ta(l.uri.d.pg(a));
};
l.uri.d.cd = function(a) {
  a = l.uri.d.split(a);
  return l.uri.d.yb(a[l.uri.d.l.ja], a[l.uri.d.l.Qa], a[l.uri.d.l.W], a[l.uri.d.l.Y]);
};
l.uri.d.yk = function(a) {
  a = l.uri.d.split(a);
  return l.uri.d.yb(null, null, null, null, a[l.uri.d.l.sb], a[l.uri.d.l.Oa], a[l.uri.d.l.qb]);
};
l.uri.d.Eh = function(a) {
  var c = a.indexOf("#");
  return 0 > c ? a : a.substr(0, c);
};
l.uri.d.Kg = function(a, c) {
  var d = l.uri.d.split(a), e = l.uri.d.split(c);
  return d[l.uri.d.l.W] == e[l.uri.d.l.W] && d[l.uri.d.l.ja] == e[l.uri.d.l.ja] && d[l.uri.d.l.Y] == e[l.uri.d.l.Y];
};
l.uri.d.Pf = function(a) {
  if (l.ba && (0 <= a.indexOf("#") || 0 <= a.indexOf("?"))) {
    throw Error("goog.uri.utils: Fragment or query identifiers are not supported: [" + a + "]");
  }
};
l.uri.d.rh = function(a, c) {
  for (var d = a.split("&"), e = 0;e < d.length;e++) {
    var f = d[e].indexOf("="), g = null, h = null;
    0 <= f ? (g = d[e].substring(0, f), h = d[e].substring(f + 1)) : g = d[e];
    c(g, h ? l.b.mb(h) : "");
  }
};
l.uri.d.xb = function(a) {
  if (a[1]) {
    var c = a[0], d = c.indexOf("#");
    0 <= d && (a.push(c.substr(d)), a[0] = c = c.substr(0, d));
    d = c.indexOf("?");
    0 > d ? a[1] = "?" : d == c.length - 1 && (a[1] = void 0);
  }
  return a.join("");
};
l.uri.d.wb = function(a, c, d) {
  if (l.isArray(c)) {
    for (var e = 0;e < c.length;e++) {
      l.uri.d.wb(a, String(c[e]), d);
    }
  } else {
    null != c && d.push("&", a, "" === c ? "" : "=", l.b.Ia(c));
  }
};
l.uri.d.zb = function(a, c, d) {
  for (d = d || 0;d < c.length;d += 2) {
    l.uri.d.wb(c[d], c[d + 1], a);
  }
  return a;
};
l.uri.d.Gj = function(a, c) {
  var d = l.uri.d.zb([], a, c);
  d[0] = "";
  return d.join("");
};
l.uri.d.Pc = function(a, c) {
  for (var d in c) {
    l.uri.d.wb(d, c[d], a);
  }
  return a;
};
l.uri.d.Hj = function(a) {
  a = l.uri.d.Pc([], a);
  a[0] = "";
  return a.join("");
};
l.uri.d.qj = function(a, c) {
  return l.uri.d.xb(2 == arguments.length ? l.uri.d.zb([a], arguments[1], 0) : l.uri.d.zb([a], arguments, 1));
};
l.uri.d.rj = function(a, c) {
  return l.uri.d.xb(l.uri.d.Pc([a], c));
};
l.uri.d.Of = function(a, c, d) {
  a = [a, "&", c];
  l.td(d) && a.push("=", l.b.Ia(d));
  return l.uri.d.xb(a);
};
l.uri.d.Wa = function(a, c, d, e) {
  for (var f = d.length;0 <= (c = a.indexOf(d, c)) && c < e;) {
    var g = a.charCodeAt(c - 1);
    if (g == l.uri.d.va.bc || g == l.uri.d.va.$e) {
      if (g = a.charCodeAt(c + f), !g || g == l.uri.d.va.EQUAL || g == l.uri.d.va.bc || g == l.uri.d.va.ze) {
        return c;
      }
    }
    c += f + 1;
  }
  return-1;
};
l.uri.d.$a = /#|$/;
l.uri.d.Ck = function(a, c) {
  return 0 <= l.uri.d.Wa(a, 0, c, a.search(l.uri.d.$a));
};
l.uri.d.wk = function(a, c) {
  var d = a.search(l.uri.d.$a), e = l.uri.d.Wa(a, 0, c, d);
  if (0 > e) {
    return null;
  }
  var f = a.indexOf("&", e);
  if (0 > f || f > d) {
    f = d;
  }
  e += c.length + 1;
  return l.b.mb(a.substr(e, f - e));
};
l.uri.d.xk = function(a, c) {
  for (var d = a.search(l.uri.d.$a), e = 0, f, g = [];0 <= (f = l.uri.d.Wa(a, e, c, d));) {
    e = a.indexOf("&", f);
    if (0 > e || e > d) {
      e = d;
    }
    f += c.length + 1;
    g.push(l.b.mb(a.substr(f, e - f)));
  }
  return g;
};
l.uri.d.Wh = /[?&]($|#)/;
l.uri.d.Fh = function(a, c) {
  for (var d = a.search(l.uri.d.$a), e = 0, f, g = [];0 <= (f = l.uri.d.Wa(a, e, c, d));) {
    g.push(a.substring(e, f)), e = Math.min(a.indexOf("&", f) + 1 || d, d);
  }
  g.push(a.substr(e));
  return g.join("").replace(l.uri.d.Wh, "$1");
};
l.uri.d.setParam = function(a, c, d) {
  return l.uri.d.Of(l.uri.d.Fh(a, c), c, d);
};
l.uri.d.sj = function(a, c) {
  l.uri.d.Pf(a);
  l.b.gg(a, "/") && (a = a.substr(0, a.length - 1));
  l.b.$b(c, "/") && (c = c.substr(1));
  return l.b.Uf(a, "/", c);
};
l.uri.d.Ha = function(a, c) {
  l.b.$b(c, "/") || (c = "/" + c);
  var d = l.uri.d.split(a);
  return l.uri.d.yb(d[l.uri.d.l.ja], d[l.uri.d.l.Qa], d[l.uri.d.l.W], d[l.uri.d.l.Y], c, d[l.uri.d.l.Oa], d[l.uri.d.l.qb]);
};
l.uri.d.Ic = {Dc:"zx"};
l.uri.d.gh = function(a) {
  return l.uri.d.setParam(a, l.uri.d.Ic.Dc, l.b.gd());
};
l.f = function(a, c) {
  var d;
  a instanceof l.f ? (this.H = l.V(c) ? c : a.rg(), this.jb(a.qa()), this.kb(a.Za()), this.fb(a.Da()), this.hb(a.Ya()), this.Ha(a.pa()), this.ib(a.fd().clone()), this.gb(a.Xa())) : a && (d = l.uri.d.split(String(a))) ? (this.H = !!c, this.jb(d[l.uri.d.l.ja] || "", !0), this.kb(d[l.uri.d.l.Qa] || "", !0), this.fb(d[l.uri.d.l.W] || "", !0), this.hb(d[l.uri.d.l.Y]), this.Ha(d[l.uri.d.l.sb] || "", !0), this.ib(d[l.uri.d.l.Oa] || "", !0), this.gb(d[l.uri.d.l.qb] || "", !0)) : (this.H = !!c, this.M = new l.f.N(null, 
  null, this.H));
};
l.f.vh = !1;
l.f.af = l.uri.d.Ic.Dc;
b = l.f.prototype;
b.ua = "";
b.ac = "";
b.Cb = "";
b.G = null;
b.Ub = "";
b.Gb = "";
b.Zg = !1;
b.H = !1;
b.toString = function() {
  var a = [], c = this.qa();
  c && a.push(l.f.Ca(c, l.f.Od, !0), ":");
  if (c = this.Da()) {
    a.push("//");
    var d = this.Za();
    d && a.push(l.f.Ca(d, l.f.Od, !0), "@");
    a.push(l.f.Pd(l.b.Ia(c)));
    c = this.Ya();
    null != c && a.push(":", String(c));
  }
  if (c = this.pa()) {
    this.Ib() && "/" != c.charAt(0) && a.push("/"), a.push(l.f.Ca(c, "/" == c.charAt(0) ? l.f.yh : l.f.Bh, !0));
  }
  (c = this.ng()) && a.push("?", c);
  (c = this.Xa()) && a.push("#", l.f.Ca(c, l.f.zh));
  return a.join("");
};
b.resolve = function(a) {
  var c = this.clone(), d = a.Ig();
  d ? c.jb(a.qa()) : d = a.Jg();
  d ? c.kb(a.Za()) : d = a.Ib();
  d ? c.fb(a.Da()) : d = a.Gg();
  var e = a.pa();
  if (d) {
    c.hb(a.Ya());
  } else {
    if (d = a.kd()) {
      if ("/" != e.charAt(0)) {
        if (this.Ib() && !this.kd()) {
          e = "/" + e;
        } else {
          var f = c.pa().lastIndexOf("/");
          -1 != f && (e = c.pa().substr(0, f + 1) + e);
        }
      }
      e = l.f.Ch(e);
    }
  }
  d ? c.Ha(e) : d = a.Hg();
  d ? c.ib(a.lg()) : d = a.Fg();
  d && c.gb(a.Xa());
  return c;
};
b.clone = function() {
  return new l.f(this);
};
b.qa = function() {
  return this.ua;
};
b.jb = function(a, c) {
  this.S();
  if (this.ua = c ? l.f.ma(a, !0) : a) {
    this.ua = this.ua.replace(/:$/, "");
  }
  return this;
};
b.Ig = function() {
  return!!this.ua;
};
b.Za = function() {
  return this.ac;
};
b.kb = function(a, c) {
  this.S();
  this.ac = c ? l.f.ma(a) : a;
  return this;
};
b.Jg = function() {
  return!!this.ac;
};
b.Da = function() {
  return this.Cb;
};
b.fb = function(a, c) {
  this.S();
  this.Cb = c ? l.f.ma(a, !0) : a;
  return this;
};
b.Ib = function() {
  return!!this.Cb;
};
b.Ya = function() {
  return this.G;
};
b.hb = function(a) {
  this.S();
  if (a) {
    a = Number(a);
    if (isNaN(a) || 0 > a) {
      throw Error("Bad port number " + a);
    }
    this.G = a;
  } else {
    this.G = null;
  }
  return this;
};
b.Gg = function() {
  return null != this.G;
};
b.pa = function() {
  return this.Ub;
};
b.Ha = function(a, c) {
  this.S();
  this.Ub = c ? l.f.ma(a, !0) : a;
  return this;
};
b.kd = function() {
  return!!this.Ub;
};
b.Hg = function() {
  return "" !== this.M.toString();
};
b.ib = function(a, c) {
  this.S();
  a instanceof l.f.N ? (this.M = a, this.M.Xb(this.H)) : (c || (a = l.f.Ca(a, l.f.Ah)), this.M = new l.f.N(a, null, this.H));
  return this;
};
b.ng = function() {
  return this.M.toString();
};
b.lg = function() {
  return this.M.Th();
};
b.fd = function() {
  return this.M;
};
b.Nh = function(a, c) {
  this.S();
  this.M.set(a, c);
  return this;
};
b.ug = function(a) {
  return this.M.get(a);
};
b.Xa = function() {
  return this.Gb;
};
b.gb = function(a, c) {
  this.S();
  this.Gb = c ? l.f.ma(a) : a;
  return this;
};
b.Fg = function() {
  return!!this.Gb;
};
b.gh = function() {
  this.S();
  this.Nh(l.f.af, l.b.gd());
  return this;
};
b.S = function() {
  if (this.Zg) {
    throw Error("Tried to modify a read-only Uri");
  }
};
b.Xb = function(a) {
  this.H = a;
  this.M && this.M.Xb(a);
  return this;
};
b.rg = function() {
  return this.H;
};
l.f.parse = function(a, c) {
  return a instanceof l.f ? a.clone() : new l.f(a, c);
};
l.f.create = function(a, c, d, e, f, g, h, k) {
  k = new l.f(null, k);
  a && k.jb(a);
  c && k.kb(c);
  d && k.fb(d);
  e && k.hb(e);
  f && k.Ha(f);
  g && k.ib(g);
  h && k.gb(h);
  return k;
};
l.f.resolve = function(a, c) {
  a instanceof l.f || (a = l.f.parse(a));
  c instanceof l.f || (c = l.f.parse(c));
  return a.resolve(c);
};
l.f.Ch = function(a) {
  if (".." == a || "." == a) {
    return "";
  }
  if (l.b.contains(a, "./") || l.b.contains(a, "/.")) {
    var c = l.b.$b(a, "/");
    a = a.split("/");
    for (var d = [], e = 0;e < a.length;) {
      var f = a[e++];
      "." == f ? c && e == a.length && d.push("") : ".." == f ? ((1 < d.length || 1 == d.length && "" != d[0]) && d.pop(), c && e == a.length && d.push("")) : (d.push(f), c = !0);
    }
    return d.join("/");
  }
  return a;
};
l.f.ma = function(a, c) {
  return a ? c ? decodeURI(a) : decodeURIComponent(a) : "";
};
l.f.Ca = function(a, c, d) {
  return l.isString(a) ? (a = encodeURI(a).replace(c, l.f.fg), d && (a = l.f.Pd(a)), a) : null;
};
l.f.fg = function(a) {
  a = a.charCodeAt(0);
  return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16);
};
l.f.Pd = function(a) {
  return a.replace(/%25([0-9a-fA-F]{2})/g, "%$1");
};
l.f.Od = /[#\/\?@]/g;
l.f.Bh = /[\#\?:]/g;
l.f.yh = /[\#\?]/g;
l.f.Ah = /[\#\?@]/g;
l.f.zh = /#/g;
l.f.Kg = function(a, c) {
  var d = l.uri.d.split(a), e = l.uri.d.split(c);
  return d[l.uri.d.l.W] == e[l.uri.d.l.W] && d[l.uri.d.l.Y] == e[l.uri.d.l.Y];
};
l.f.N = function(a, c, d) {
  this.$ = a || null;
  this.H = !!d;
};
l.f.N.prototype.T = function() {
  if (!this.s && (this.s = new l.j.Map, this.p = 0, this.$)) {
    var a = this;
    l.uri.d.rh(this.$, function(c, d) {
      a.add(l.b.mb(c), d);
    });
  }
};
l.f.N.$j = function(a, c, d) {
  c = l.j.B(a);
  if ("undefined" == typeof c) {
    throw Error("Keys are undefined");
  }
  d = new l.f.N(null, null, d);
  a = l.j.u(a);
  for (var e = 0;e < c.length;e++) {
    var f = c[e], g = a[e];
    l.isArray(g) ? d.Rd(f, g) : d.add(f, g);
  }
  return d;
};
l.f.N.Zj = function(a, c, d, e) {
  if (a.length != c.length) {
    throw Error("Mismatched lengths for keys/values");
  }
  d = new l.f.N(null, null, e);
  for (e = 0;e < a.length;e++) {
    d.add(a[e], c[e]);
  }
  return d;
};
b = l.f.N.prototype;
b.s = null;
b.p = null;
b.ga = function() {
  this.T();
  return this.p;
};
b.add = function(a, c) {
  this.T();
  this.ta();
  a = this.oa(a);
  var d = this.s.get(a);
  d || this.s.set(a, d = []);
  d.push(c);
  this.p++;
  return this;
};
b.remove = function(a) {
  this.T();
  a = this.oa(a);
  return this.s.fa(a) ? (this.ta(), this.p -= this.s.get(a).length, this.s.remove(a)) : !1;
};
b.clear = function() {
  this.ta();
  this.s = null;
  this.p = 0;
};
b.L = function() {
  this.T();
  return 0 == this.p;
};
b.fa = function(a) {
  this.T();
  a = this.oa(a);
  return this.s.fa(a);
};
b.la = function(a) {
  var c = this.u();
  return l.a.contains(c, a);
};
b.B = function() {
  this.T();
  for (var a = this.s.u(), c = this.s.B(), d = [], e = 0;e < c.length;e++) {
    for (var f = a[e], g = 0;g < f.length;g++) {
      d.push(c[e]);
    }
  }
  return d;
};
b.u = function(a) {
  this.T();
  var c = [];
  if (l.isString(a)) {
    this.fa(a) && (c = l.a.concat(c, this.s.get(this.oa(a))));
  } else {
    a = this.s.u();
    for (var d = 0;d < a.length;d++) {
      c = l.a.concat(c, a[d]);
    }
  }
  return c;
};
b.set = function(a, c) {
  this.T();
  this.ta();
  a = this.oa(a);
  this.fa(a) && (this.p -= this.s.get(a).length);
  this.s.set(a, [c]);
  this.p++;
  return this;
};
b.get = function(a, c) {
  var d = a ? this.u(a) : [];
  return l.f.vh ? 0 < d.length ? d[0] : c : 0 < d.length ? String(d[0]) : c;
};
b.Rd = function(a, c) {
  this.remove(a);
  0 < c.length && (this.ta(), this.s.set(this.oa(a), l.a.clone(c)), this.p += c.length);
};
b.toString = function() {
  if (this.$) {
    return this.$;
  }
  if (!this.s) {
    return "";
  }
  for (var a = [], c = this.s.B(), d = 0;d < c.length;d++) {
    for (var e = c[d], f = l.b.Ia(e), e = this.u(e), g = 0;g < e.length;g++) {
      var h = f;
      "" !== e[g] && (h += "=" + l.b.Ia(e[g]));
      a.push(h);
    }
  }
  return this.$ = a.join("&");
};
b.Th = function() {
  return l.f.ma(this.toString());
};
b.ta = function() {
  this.$ = null;
};
b.clone = function() {
  var a = new l.f.N;
  a.$ = this.$;
  this.s && (a.s = this.s.clone(), a.p = this.p);
  return a;
};
b.oa = function(a) {
  a = String(a);
  this.H && (a = a.toLowerCase());
  return a;
};
b.Xb = function(a) {
  a && !this.H && (this.T(), this.ta(), this.s.forEach(function(a, d) {
    var e = d.toLowerCase();
    d != e && (this.remove(d), this.Rd(e, a));
  }, this));
  this.H = a;
};
b.extend = function(a) {
  for (var c = 0;c < arguments.length;c++) {
    l.j.forEach(arguments[c], function(a, c) {
      this.add(c, a);
    }, this);
  }
};
m.ub = {};
m.ub.xg = function(a) {
  return l.f.parse(window.location.href).ug(a) || null;
};
m.ub.getOrigin = function(a) {
  return l.uri.d.qa(a) ? l.uri.d.cd(a) : l.uri.d.cd("http://" + a);
};
m.tc = function(a) {
  this.za = a;
  this.Fb = this.G = null;
};
b = m.tc.prototype;
b.Mh = function(a) {
  this.Fb = a;
};
b.Jh = function(a) {
  a.clientId = this.za;
  if (!this.G && (this.lh(), !this.G)) {
    return;
  }
  this.G.postMessage(a);
};
b.lh = function() {
  !this.G && (this.G = chrome.runtime.connect({name:this.za})) && (this.G.onMessage.addListener(l.bind(this.Md, this)), this.G.onDisconnect.addListener(l.bind(this.qh, this)));
};
b.Md = function(a) {
  this.Fb && this.Fb(a);
};
b.qh = function() {
  this.G = null;
  this.Md(new m.wc(m.v.uc, null));
};
m.ya = function(a) {
  this.Nd = a;
  this.Lc = null;
};
m.ya.prototype.init = function() {
  window.addEventListener("message", this.ph.bind(this), !1);
};
m.ya.prototype.Lh = function(a) {
  this.Lc = a;
};
m.ya.prototype.ph = function(a) {
  if (a.source != window) {
    var c = a.data;
    this.Nd = c.appOrigin = a.origin;
    this.Lc(c);
  }
};
m.ya.prototype.Qd = function(a) {
  a.clientId = null;
  window.parent.postMessage(a, this.Nd);
};
m.xa = function() {
  this.za = "client-" + String(Math.floor(1E5 * Math.random()));
  this.sessionRequest = null;
  this.ab = new m.ya(m.ub.xg("appOrigin"));
  this.Xc = new m.tc(this.za);
};
m.xa.prototype.init = function() {
  this.ab.init();
  this.ab.Lh(this.wh.bind(this));
  this.Xc.Mh(this.xh.bind(this));
  this.Ih(null);
};
m.xa.prototype.Ih = function(a) {
  this.ab.Qd(new m.wc(m.v.Ce, a));
};
m.xa.prototype.wh = function(a) {
  a.clientId = this.za;
  this.Xc.Jh(a);
};
m.xa.prototype.xh = function(a) {
  switch(a.type) {
    case m.v.ae:
    ;
    case m.v.be:
    ;
    case m.v.ERROR:
    ;
    case m.v.Ue:
    ;
    case m.v.Hf:
    ;
    case m.v.le:
    ;
    case m.v.df:
    ;
    case m.v.cf:
    ;
    case m.v.Jf:
    ;
    case m.v.Fe:
    ;
    case m.v.of:
    ;
    case m.v.mf:
    ;
    case m.v.uc:
    ;
    case m.v.ge:
    ;
    case m.v.nf:
    ;
    case m.v.bf:
    ;
    case m.v.wf:
      this.ab.Qd(a);
  }
};
m.Lg = new m.xa;
m.Lg.init();

