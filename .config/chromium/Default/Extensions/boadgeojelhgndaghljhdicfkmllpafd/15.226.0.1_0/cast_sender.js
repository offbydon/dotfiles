(function() {var b, __GCast_isChromeBrowser = window.chrome ? !0 : !1, chrome = window.chrome || {};
chrome.cast = chrome.cast || {};
chrome.cast.media = chrome.cast.media || {};
var g = g || {};
g.global = this;
g.W = function(a) {
  return void 0 !== a;
};
g.Ce = function(a, c, d) {
  a = a.split(".");
  d = d || g.global;
  a[0] in d || !d.execScript || d.execScript("var " + a[0]);
  for (var e;a.length && (e = a.shift());) {
    !a.length && g.W(c) ? d[e] = c : d = d[e] ? d[e] : d[e] = {};
  }
};
g.Ru = function(a, c) {
  g.Ce(a, c);
};
g.ia = !0;
g.da = "en";
g.ge = !0;
g.de = !1;
g.Hj = !g.ia;
g.Ow = function(a) {
  g.oh(a);
};
g.oh = function(a, c) {
  g.Ce(a, c);
};
g.Yl = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
g.module = function(a) {
  if (!g.isString(a) || !a || -1 == a.search(g.Yl)) {
    throw Error("Invalid module identifier");
  }
  if (!g.di()) {
    throw Error("Module " + a + " has been loaded incorrectly.");
  }
  if (g.ma.gf) {
    throw Error("goog.module may only be called once per module.");
  }
  g.ma.gf = a;
};
g.module.get = function(a) {
  return g.module.vn(a);
};
g.module.vn = function() {
};
g.ma = null;
g.di = function() {
  return null != g.ma;
};
g.module.ve = function() {
  if (!g.di()) {
    throw Error("goog.module.declareTestMethods must be called from within a goog.module");
  }
  g.ma.ve = !0;
};
g.module.vh = function() {
  g.ma.vh = !0;
};
g.gx = function(a) {
  if (g.Hj) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + (a ? ": " + a : "."));
  }
};
g.kv = function() {
};
g.zn = function(a, c) {
  for (var d = a.split("."), e = c || g.global, f;f = d.shift();) {
    if (g.O(e[f])) {
      e = e[f];
    } else {
      return null;
    }
  }
  return e;
};
g.Bv = function(a, c) {
  var d = c || g.global, e;
  for (e in a) {
    d[e] = a[e];
  }
};
g.Rt = function(a, c, d, e) {
  if (g.Xf) {
    var f;
    a = a.replace(/\\/g, "/");
    for (var h = g.ra, l = 0;f = c[l];l++) {
      h.xc[f] = a, h.kf[a] = !!e;
    }
    for (e = 0;c = d[e];e++) {
      a in h.requires || (h.requires[a] = {}), h.requires[a][c] = !0;
    }
  }
};
g.Kx = !1;
g.lr = !0;
g.ww = function(a) {
  g.global.console && g.global.console.error(a);
};
g.require = function() {
};
g.tb = "";
g.wi = function() {
};
g.Lv = function(a) {
  return a;
};
g.Pt = function() {
  throw Error("unimplemented abstract method");
};
g.mm = function(a) {
  a.Ge = function() {
    if (a.tc) {
      return a.tc;
    }
    g.ia && (g.Yh[g.Yh.length] = a);
    return a.tc = new a;
  };
};
g.Yh = [];
g.nk = !0;
g.ul = g.ia;
g.Fo = {};
g.Xf = !1;
g.Xf && (g.Un = {}, g.ra = {kf:{}, xc:{}, requires:{}, dj:{}, Dc:{}, bd:{}}, g.Vh = function() {
  var a = g.global.document;
  return "undefined" != typeof a && "write" in a;
}, g.fn = function() {
  if (g.global.wj) {
    g.tb = g.global.wj;
  } else {
    if (g.Vh()) {
      for (var a = g.global.document.getElementsByTagName("script"), c = a.length - 1;0 <= c;--c) {
        var d = a[c].src, e = d.lastIndexOf("?"), e = -1 == e ? d.length : e;
        if ("base.js" == d.substr(e - 7, 7)) {
          g.tb = d.substr(0, e - 7);
          break;
        }
      }
    }
  }
}, g.Pe = function(a, c) {
  (g.global.Tq || g.yq)(a, c) && (g.ra.Dc[a] = !0);
}, g.jk = !g.global.atob && g.global.document && g.global.document.all, g.Tn = function(a) {
  g.Pe("", 'goog.retrieveAndExecModule_("' + a + '");') && (g.ra.Dc[a] = !0);
}, g.mf = [], g.Ox = function(a, c) {
  return g.nk && g.W(g.global.JSON) ? "goog.loadModule(" + g.global.JSON.stringify(c + "\n//# sourceURL=" + a + "\n") + ");" : 'goog.loadModule(function(exports) {"use strict";' + c + "\n;return exports});\n//# sourceURL=" + a + "\n";
}, g.Eo = function() {
  var a = g.mf.length;
  if (0 < a) {
    var c = g.mf;
    g.mf = [];
    for (var d = 0;d < a;d++) {
      g.ri(c[d]);
    }
  }
}, g.zw = function(a) {
  g.ai(a) && g.om(a) && g.ri(g.tb + g.Je(a));
}, g.ai = function(a) {
  return(a = g.Je(a)) && g.ra.kf[a] ? g.tb + a in g.ra.bd : !1;
}, g.om = function(a) {
  if ((a = g.Je(a)) && a in g.ra.requires) {
    for (var c in g.ra.requires[a]) {
      if (!g.oo(c) && !g.ai(c)) {
        return!1;
      }
    }
  }
  return!0;
}, g.ri = function(a) {
  if (a in g.ra.bd) {
    var c = g.ra.bd[a];
    delete g.ra.bd[a];
    g.Ln(c);
  }
}, g.tw = function(a) {
  var c = g.ma;
  try {
    g.ma = {gf:void 0, ve:!1};
    var d;
    if (g.isFunction(a)) {
      d = a.call(g.global, {});
    } else {
      if (g.isString(a)) {
        d = g.Do.call(g.global, a);
      } else {
        throw Error("Invalid module definition");
      }
    }
    var e = g.ma.gf;
    if (!g.isString(e) || !e) {
      throw Error('Invalid module name "' + e + '"');
    }
    g.ma.vh ? g.oh(e, d) : g.ul && Object.seal && Object.seal(d);
    g.Fo[e] = d;
    if (g.ma.ve) {
      for (var f in d) {
        if (0 === f.indexOf("test", 0) || "tearDown" == f || "setUp" == f || "setUpPage" == f || "tearDownPage" == f) {
          g.global[f] = d[f];
        }
      }
    }
  } finally {
    g.ma = c;
  }
}, g.Do = function(a) {
  eval(a);
  return{};
}, g.yq = function(a, c) {
  if (g.Vh()) {
    var d = g.global.document;
    if ("complete" == d.readyState) {
      if (/\bdeps.js$/.test(a)) {
        return!1;
      }
      throw Error('Cannot write "' + a + '" after document load');
    }
    var e = g.jk;
    void 0 === c ? e ? (e = " onreadystatechange='goog.onScriptLoad_(this, " + ++g.oi + ")' ", d.write('<script type="text/javascript" src="' + a + '"' + e + ">\x3c/script>")) : d.write('<script type="text/javascript" src="' + a + '">\x3c/script>') : d.write('<script type="text/javascript">' + c + "\x3c/script>");
    return!0;
  }
  return!1;
}, g.oi = 0, g.Kw = function(a, c) {
  "complete" == a.readyState && g.oi == c && g.Eo();
  return!0;
}, g.Px = function() {
  function a(f) {
    if (!(f in e.Dc)) {
      if (!(f in e.dj) && (e.dj[f] = !0, f in e.requires)) {
        for (var h in e.requires[f]) {
          if (!g.oo(h)) {
            if (h in e.xc) {
              a(e.xc[h]);
            } else {
              throw Error("Undefined nameToPath for " + h);
            }
          }
        }
      }
      f in d || (d[f] = !0, c.push(f));
    }
  }
  var c = [], d = {}, e = g.ra, f;
  for (f in g.Un) {
    e.Dc[f] || a(f);
  }
  for (var h = 0;h < c.length;h++) {
    f = c[h], g.ra.Dc[f] = !0;
  }
  var l = g.ma;
  g.ma = null;
  for (h = 0;h < c.length;h++) {
    if (f = c[h]) {
      e.kf[f] ? g.Tn(g.tb + f) : g.Pe(g.tb + f);
    } else {
      throw g.ma = l, Error("Undefined script input");
    }
  }
  g.ma = l;
}, g.Je = function(a) {
  return a in g.ra.xc ? g.ra.xc[a] : null;
}, g.fn(), g.global.Uq || g.Pe(g.tb + "deps.js"));
g.Fw = function(a) {
  a = a.split("/");
  for (var c = 0;c < a.length;) {
    "." == a[c] ? a.splice(c, 1) : c && ".." == a[c] && a[c - 1] && ".." != a[c - 1] ? a.splice(--c, 2) : c++;
  }
  return a.join("/");
};
g.Tw = function() {
};
g.sa = function(a) {
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
g.uc = function(a) {
  return null === a;
};
g.O = function(a) {
  return null != a;
};
g.isArray = function(a) {
  return "array" == g.sa(a);
};
g.V = function(a) {
  var c = g.sa(a);
  return "array" == c || "object" == c && "number" == typeof a.length;
};
g.Tv = function(a) {
  return g.isObject(a) && "function" == typeof a.getFullYear;
};
g.isString = function(a) {
  return "string" == typeof a;
};
g.jb = function(a) {
  return "boolean" == typeof a;
};
g.isNumber = function(a) {
  return "number" == typeof a;
};
g.isFunction = function(a) {
  return "function" == g.sa(a);
};
g.isObject = function(a) {
  var c = typeof a;
  return "object" == c && null != a || "function" == c;
};
g.Le = function(a) {
  return a[g.rb] || (a[g.rb] = ++g.qq);
};
g.Hv = function(a) {
  return!!a[g.rb];
};
g.wp = function(a) {
  "removeAttribute" in a && a.removeAttribute(g.rb);
  try {
    delete a[g.rb];
  } catch (c) {
  }
};
g.rb = "closure_uid_" + (1E9 * Math.random() >>> 0);
g.qq = 0;
g.rv = g.Le;
g.Rw = g.wp;
g.Im = function(a) {
  var c = g.sa(a);
  if ("object" == c || "array" == c) {
    if (a.clone) {
      return a.clone();
    }
    var c = "array" == c ? [] : {}, d;
    for (d in a) {
      c[d] = g.Im(a[d]);
    }
    return c;
  }
  return a;
};
g.um = function(a, c, d) {
  return a.call.apply(a.bind, arguments);
};
g.tm = function(a, c, d) {
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
g.bind = function(a, c, d) {
  Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? g.bind = g.um : g.bind = g.tm;
  return g.bind.apply(null, arguments);
};
g.yc = function(a, c) {
  var d = Array.prototype.slice.call(arguments, 1);
  return function() {
    var c = d.slice();
    c.push.apply(c, arguments);
    return a.apply(this, c);
  };
};
g.si = function(a, c) {
  for (var d in c) {
    a[d] = c[d];
  }
};
g.now = g.ge && Date.now || function() {
  return+new Date;
};
g.Ln = function(a) {
  if (g.global.execScript) {
    g.global.execScript(a, "JavaScript");
  } else {
    if (g.global.eval) {
      if (null == g.fd && (g.global.eval("var _et_ = 1;"), "undefined" != typeof g.global._et_ ? (delete g.global._et_, g.fd = !0) : g.fd = !1), g.fd) {
        g.global.eval(a);
      } else {
        var c = g.global.document, d = c.createElement("script");
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
g.fd = null;
g.pv = function(a, c) {
  var d = function(a) {
    return g.sh[a] || a;
  }, e = function(a) {
    a = a.split("-");
    for (var c = [], e = 0;e < a.length;e++) {
      c.push(d(a[e]));
    }
    return c.join("-");
  }, e = g.sh ? "BY_WHOLE" == g.Sm ? d : e : function(a) {
    return a;
  };
  return c ? a + "-" + e(c) : e(a);
};
g.bx = function(a, c) {
  g.sh = a;
  g.Sm = c;
};
g.uv = function(a, c) {
  c && (a = a.replace(/\{\$([^}]+)}/g, function(a, e) {
    return e in c ? c[e] : a;
  }));
  return a;
};
g.vv = function(a) {
  return a;
};
g.j = function(a, c, d) {
  g.Ce(a, c, d);
};
g.A = function(a, c, d) {
  a[c] = d;
};
g.Sa = function(a, c) {
  function d() {
  }
  d.prototype = c.prototype;
  a.Hd = c.prototype;
  a.prototype = new d;
  a.prototype.constructor = a;
  a.sm = function(a, d, h) {
    for (var l = Array(arguments.length - 2), m = 2;m < arguments.length;m++) {
      l[m - 2] = arguments[m];
    }
    return c.prototype[d].apply(a, l);
  };
};
g.sm = function(a, c, d) {
  var e = arguments.callee.caller;
  if (g.de || g.ia && !e) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if (e.Hd) {
    for (var f = Array(arguments.length - 1), h = 1;h < arguments.length;h++) {
      f[h - 1] = arguments[h];
    }
    return e.Hd.constructor.apply(a, f);
  }
  f = Array(arguments.length - 2);
  for (h = 2;h < arguments.length;h++) {
    f[h - 2] = arguments[h];
  }
  for (var h = !1, l = a.constructor;l;l = l.Hd && l.Hd.constructor) {
    if (l.prototype[c] === e) {
      h = !0;
    } else {
      if (h) {
        return l.prototype[c].apply(a, f);
      }
    }
  }
  if (a[c] === e) {
    return a.constructor.prototype[c].apply(a, f);
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
g.scope = function(a) {
  a.call(g.global);
};
g.Kk = !0;
g.Kk && (Function.prototype.bind = Function.prototype.bind || function(a, c) {
  if (1 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 1);
    d.unshift(this, a);
    return g.bind.apply(null, d);
  }
  return g.bind(this, a);
}, Function.prototype.yc = function(a) {
  var c = Array.prototype.slice.call(arguments);
  c.unshift(this, null);
  return g.bind.apply(null, c);
}, Function.prototype.Sa = function(a) {
  g.Sa(this, a);
}, Function.prototype.si = function(a) {
  g.si(this.prototype, a);
});
g.Pa = function(a, c) {
  var d = c.constructor, e = c.hq;
  d && d != Object.prototype.constructor || (d = function() {
    throw Error("cannot instantiate an interface (no constructor defined).");
  });
  d = g.Pa.Om(d, a);
  a && g.Sa(d, a);
  delete c.constructor;
  delete c.hq;
  g.Pa.$g(d.prototype, c);
  null != e && (e instanceof Function ? e(d) : g.Pa.$g(d, e));
  return d;
};
g.Pa.tl = g.ia;
g.Pa.Om = function(a, c) {
  if (g.Pa.tl && Object.seal instanceof Function) {
    if (c && c.prototype && c.prototype[g.Tl]) {
      return a;
    }
    var d = function() {
      var c = a.apply(this, arguments) || this;
      c[g.rb] = c[g.rb];
      this.constructor === d && Object.seal(c);
      return c;
    };
    return d;
  }
  return a;
};
g.Pa.yg = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
g.Pa.$g = function(a, c) {
  for (var d in c) {
    Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d]);
  }
  for (var e = 0;e < g.Pa.yg.length;e++) {
    d = g.Pa.yg[e], Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d]);
  }
};
g.vx = function() {
};
g.Tl = "goog_defineClass_legacy_unsealable";
chrome.cast.Rf = {TAB_AND_ORIGIN_SCOPED:"tab_and_origin_scoped", ORIGIN_SCOPED:"origin_scoped", PAGE_SCOPED:"page_scoped"};
g.j("chrome.cast.AutoJoinPolicy", chrome.cast.Rf);
chrome.cast.Yf = {CREATE_SESSION:"create_session", CAST_THIS_TAB:"cast_this_tab"};
g.j("chrome.cast.DefaultActionPolicy", chrome.cast.Yf);
chrome.cast.ob = {VIDEO_OUT:"video_out", AUDIO_OUT:"audio_out", VIDEO_IN:"video_in", AUDIO_IN:"audio_in"};
g.j("chrome.cast.Capability", chrome.cast.ob);
chrome.cast.La = {CANCEL:"cancel", TIMEOUT:"timeout", API_NOT_INITIALIZED:"api_not_initialized", INVALID_PARAMETER:"invalid_parameter", EXTENSION_NOT_COMPATIBLE:"extension_not_compatible", EXTENSION_MISSING:"extension_missing", RECEIVER_UNAVAILABLE:"receiver_unavailable", SESSION_ERROR:"session_error", CHANNEL_ERROR:"channel_error", LOAD_MEDIA_FAILED:"load_media_failed"};
g.j("chrome.cast.ErrorCode", chrome.cast.La);
chrome.cast.kl = {AVAILABLE:"available", UNAVAILABLE:"unavailable"};
g.j("chrome.cast.ReceiverAvailability", chrome.cast.kl);
chrome.cast.Dl = {CHROME:"chrome", IOS:"ios", ANDROID:"android"};
g.j("chrome.cast.SenderPlatform", chrome.cast.Dl);
chrome.cast.Wa = {CAST:"cast", DIAL:"dial", HANGOUT:"hangout", CUSTOM:"custom"};
g.j("chrome.cast.ReceiverType", chrome.cast.Wa);
chrome.cast.Kj = {RUNNING:"running", STOPPED:"stopped", ERROR:"error"};
g.j("chrome.cast.DialAppState", chrome.cast.Kj);
chrome.cast.jl = {CAST:"cast", STOP:"stop"};
g.j("chrome.cast.ReceiverAction", chrome.cast.jl);
chrome.cast.kc = {CONNECTED:"connected", DISCONNECTED:"disconnected", STOPPED:"stopped"};
g.j("chrome.cast.SessionStatus", chrome.cast.kc);
chrome.cast.VERSION = [1, 2];
g.j("chrome.cast.VERSION", chrome.cast.VERSION);
chrome.cast.Error = function(a, c, d) {
  this.code = a;
  this.description = c || null;
  this.details = d || null;
};
g.j("chrome.cast.Error", chrome.cast.Error);
chrome.cast.Cl = function(a) {
  this.platform = a;
  this.packageId = this.url = null;
};
g.j("chrome.cast.SenderApplication", chrome.cast.Cl);
chrome.cast.Image = function(a) {
  this.url = a;
  this.width = this.height = null;
};
g.j("chrome.cast.Image", chrome.cast.Image);
chrome.cast.Qc = function(a, c) {
  this.level = g.W(a) ? a : null;
  this.muted = g.W(c) ? c : null;
};
g.j("chrome.cast.Volume", chrome.cast.Qc);
var k = {M:{Lr:"LAUNCH", Mg:"STOP", Ig:"SET_VOLUME", cg:"GET_STATUS", dl:"RECEIVER_STATUS", Jt:"CONNECT", Kt:"CLOSE", tr:"GET_APP_AVAILABILITY", rg:"LOAD", yk:"PAUSE", Ak:"SEEK", zk:"PLAY", tg:"STOP_MEDIA", qg:"MEDIA_GET_STATUS", sg:"MEDIA_SET_VOLUME", xk:"EDIT_TRACKS_INFO", Cr:"INVALID_PLAYER_STATE", Rr:"LOAD_FAILED", Qr:"LOAD_CANCELLED", Dr:"INVALID_REQUEST", Wd:"MEDIA_STATUS", Nr:"LAUNCH_ERROR", PING:"PING", ft:"PONG"}, Zd:{}};
k.Zd[k.M.tg] = k.M.Mg;
k.Zd[k.M.sg] = k.M.Ig;
k.Zd[k.M.qg] = k.M.cg;
k.nj = function(a, c, d) {
  this.sessionId = a;
  this.namespaceName = c;
  this.message = d;
};
k.Gl = function(a) {
  this.type = k.M.Mg;
  this.requestId = null;
  this.sessionId = a || null;
};
chrome.cast.media.vg = {PAUSE:"pause", SEEK:"seek", STREAM_VOLUME:"stream_volume", STREAM_MUTE:"stream_mute"};
g.j("chrome.cast.media.MediaCommand", chrome.cast.media.vg);
chrome.cast.media.Ga = {GENERIC:0, MOVIE:1, TV_SHOW:2, MUSIC_TRACK:3, PHOTO:4};
g.j("chrome.cast.media.MetadataType", chrome.cast.media.Ga);
chrome.cast.media.jc = {IDLE:"IDLE", PLAYING:"PLAYING", PAUSED:"PAUSED", BUFFERING:"BUFFERING"};
g.j("chrome.cast.media.PlayerState", chrome.cast.media.jc);
chrome.cast.media.nl = {PLAYBACK_START:"PLAYBACK_START", PLAYBACK_PAUSE:"PLAYBACK_PAUSE"};
g.j("chrome.cast.media.ResumeState", chrome.cast.media.nl);
chrome.cast.media.fe = {BUFFERED:"BUFFERED", LIVE:"LIVE", OTHER:"OTHER"};
g.j("chrome.cast.media.StreamType", chrome.cast.media.fe);
chrome.cast.media.kk = {CANCELLED:"CANCELLED", INTERRUPTED:"INTERRUPTED", FINISHED:"FINISHED", ERROR:"ERROR"};
g.j("chrome.cast.media.IdleReason", chrome.cast.media.kk);
chrome.cast.media.Ql = {TEXT:"TEXT", AUDIO:"AUDIO", VIDEO:"VIDEO"};
g.j("chrome.cast.media.TrackType", chrome.cast.media.Ql);
chrome.cast.media.Nl = {SUBTITLES:"SUBTITLES", CAPTIONS:"CAPTIONS", DESCRIPTIONS:"DESCRIPTIONS", CHAPTERS:"CHAPTERS", METADATA:"METADATA"};
g.j("chrome.cast.media.TextTrackType", chrome.cast.media.Nl);
chrome.cast.media.Jl = {NONE:"NONE", OUTLINE:"OUTLINE", DROP_SHADOW:"DROP_SHADOW", RAISED:"RAISED", DEPRESSED:"DEPRESSED"};
g.j("chrome.cast.media.TextTrackEdgeType", chrome.cast.media.Jl);
chrome.cast.media.Ol = {NONE:"NONE", NORMAL:"NORMAL", ROUNDED_CORNERS:"ROUNDED_CORNERS"};
g.j("chrome.cast.media.TextTrackWindowType", chrome.cast.media.Ol);
chrome.cast.media.Kl = {SANS_SERIF:"SANS_SERIF", MONOSPACED_SANS_SERIF:"MONOSPACED_SANS_SERIF", SERIF:"SERIF", MONOSPACED_SERIF:"MONOSPACED_SERIF", CASUAL:"CASUAL", CURSIVE:"CURSIVE", SMALL_CAPITALS:"SMALL_CAPITALS"};
g.j("chrome.cast.media.TextTrackFontGenericFamily", chrome.cast.media.Kl);
chrome.cast.media.Ll = {NORMAL:"NORMAL", BOLD:"BOLD", BOLD_ITALIC:"BOLD_ITALIC", ITALIC:"ITALIC"};
g.j("chrome.cast.media.TextTrackFontStyle", chrome.cast.media.Ll);
chrome.cast.media.eg = function() {
  this.customData = null;
};
g.j("chrome.cast.media.GetStatusRequest", chrome.cast.media.eg);
chrome.cast.media.Bg = function() {
  this.customData = null;
};
g.j("chrome.cast.media.PauseRequest", chrome.cast.media.Bg);
chrome.cast.media.Cg = function() {
  this.customData = null;
};
g.j("chrome.cast.media.PlayRequest", chrome.cast.media.Cg);
chrome.cast.media.Bl = function() {
  this.customData = this.resumeState = this.currentTime = null;
};
g.j("chrome.cast.media.SeekRequest", chrome.cast.media.Bl);
chrome.cast.media.Qg = function() {
  this.customData = null;
};
g.j("chrome.cast.media.StopRequest", chrome.cast.media.Qg);
chrome.cast.media.bm = function(a) {
  this.volume = a;
  this.customData = null;
};
g.j("chrome.cast.media.VolumeRequest", chrome.cast.media.bm);
chrome.cast.media.sk = function(a) {
  this.type = k.M.rg;
  this.sessionId = this.requestId = null;
  this.media = a;
  this.activeTrackIds = null;
  this.autoplay = !0;
  this.customData = this.currentTime = null;
};
g.j("chrome.cast.media.LoadRequest", chrome.cast.media.sk);
chrome.cast.media.Tj = function(a, c) {
  this.requestId = null;
  this.activeTrackIds = a || null;
  this.textTrackStyle = c || null;
};
g.j("chrome.cast.media.EditTracksInfoRequest", chrome.cast.media.Tj);
chrome.cast.media.ck = function() {
  this.metadataType = this.type = chrome.cast.media.Ga.GENERIC;
  this.releaseDate = this.releaseYear = this.images = this.subtitle = this.title = null;
};
g.j("chrome.cast.media.GenericMediaMetadata", chrome.cast.media.ck);
chrome.cast.media.Qk = function() {
  this.metadataType = this.type = chrome.cast.media.Ga.MOVIE;
  this.releaseDate = this.releaseYear = this.images = this.subtitle = this.studio = this.title = null;
};
g.j("chrome.cast.media.MovieMediaMetadata", chrome.cast.media.Qk);
chrome.cast.media.Rl = function() {
  this.metadataType = this.type = chrome.cast.media.Ga.TV_SHOW;
  this.originalAirdate = this.releaseYear = this.images = this.episode = this.episodeNumber = this.season = this.seasonNumber = this.episodeTitle = this.title = this.seriesTitle = null;
};
g.j("chrome.cast.media.TvShowMediaMetadata", chrome.cast.media.Rl);
chrome.cast.media.Rk = function() {
  this.metadataType = this.type = chrome.cast.media.Ga.MUSIC_TRACK;
  this.releaseDate = this.releaseYear = this.images = this.discNumber = this.trackNumber = this.artistName = this.songName = this.composer = this.artist = this.albumArtist = this.title = this.albumName = null;
};
g.j("chrome.cast.media.MusicTrackMediaMetadata", chrome.cast.media.Rk);
chrome.cast.media.$k = function() {
  this.metadataType = this.type = chrome.cast.media.Ga.PHOTO;
  this.creationDateTime = this.height = this.width = this.longitude = this.latitude = this.images = this.location = this.artist = this.title = null;
};
g.j("chrome.cast.media.PhotoMediaMetadata", chrome.cast.media.$k);
chrome.cast.media.Ok = function(a, c) {
  this.contentId = a;
  this.streamType = chrome.cast.media.fe.BUFFERED;
  this.contentType = c;
  this.customData = this.textTrackStyle = this.tracks = this.duration = this.metadata = null;
};
g.j("chrome.cast.media.MediaInfo", chrome.cast.media.Ok);
chrome.cast.media.u = function(a, c) {
  this.sessionId = a;
  this.mediaSessionId = c;
  this.media = null;
  this.playbackRate = 1;
  this.playerState = chrome.cast.media.jc.IDLE;
  this.currentTime = 0;
  this.Ze = -1;
  this.supportedMediaCommands = [];
  this.volume = new chrome.cast.Qc;
  this.customData = this.activeTrackIds = this.idleReason = null;
  this.kd = this.af = !1;
  this.Cc = [];
};
g.j("chrome.cast.media.Media", chrome.cast.media.u);
chrome.cast.media.Dj = "CC1AD845";
g.j("chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID", chrome.cast.media.Dj);
chrome.cast.media.timeout = {};
g.j("chrome.cast.media.timeout", chrome.cast.media.timeout);
chrome.cast.media.timeout.load = 0;
g.A(chrome.cast.media.timeout, "load", chrome.cast.media.timeout.load);
chrome.cast.media.timeout.gd = 0;
g.A(chrome.cast.media.timeout, "getStatus", chrome.cast.media.timeout.gd);
chrome.cast.media.timeout.play = 0;
g.A(chrome.cast.media.timeout, "play", chrome.cast.media.timeout.play);
chrome.cast.media.timeout.pause = 0;
g.A(chrome.cast.media.timeout, "pause", chrome.cast.media.timeout.pause);
chrome.cast.media.timeout.seek = 0;
g.A(chrome.cast.media.timeout, "seek", chrome.cast.media.timeout.seek);
chrome.cast.media.timeout.stop = 0;
g.A(chrome.cast.media.timeout, "stop", chrome.cast.media.timeout.stop);
chrome.cast.media.timeout.Fd = 0;
g.A(chrome.cast.media.timeout, "setVolume", chrome.cast.media.timeout.Fd);
chrome.cast.media.timeout.dd = 0;
g.A(chrome.cast.media.timeout, "editTracksInfo", chrome.cast.media.timeout.dd);
chrome.cast.media.Pl = function(a, c) {
  this.trackId = a;
  this.trackContentType = this.trackContentId = null;
  this.type = c;
  this.customData = this.subtype = this.language = this.name = null;
};
g.j("chrome.cast.media.Track", chrome.cast.media.Pl);
chrome.cast.media.Ml = function() {
  this.customData = this.fontStyle = this.fontGenericFamily = this.fontFamily = this.fontScale = this.windowRoundedCornerRadius = this.windowColor = this.windowType = this.edgeColor = this.edgeType = this.backgroundColor = this.foregroundColor = null;
};
g.j("chrome.cast.media.TextTrackStyle", chrome.cast.media.Ml);
chrome.cast.lj = function(a, c, d, e, f) {
  this.sessionRequest = a;
  this.sessionListener = c;
  this.receiverListener = d;
  this.autoJoinPolicy = e || chrome.cast.Rf.TAB_AND_ORIGIN_SCOPED;
  this.defaultActionPolicy = f || chrome.cast.Yf.CREATE_SESSION;
  this.customDialLaunchCallback = null;
};
g.j("chrome.cast.ApiConfig", chrome.cast.lj);
chrome.cast.Nj = function(a, c) {
  this.appName = a;
  this.launchParameter = c || null;
};
g.j("chrome.cast.DialRequest", chrome.cast.Nj);
chrome.cast.Lj = function(a, c, d) {
  this.receiver = a;
  this.appState = c;
  this.extraData = d || null;
};
g.j("chrome.cast.DialLaunchData", chrome.cast.Lj);
chrome.cast.Mj = function(a, c) {
  this.doLaunch = a;
  this.launchParameter = c || null;
};
g.j("chrome.cast.DialLaunchResponse", chrome.cast.Mj);
chrome.cast.El = function(a, c, d) {
  this.appId = a;
  this.capabilities = c || [chrome.cast.ob.VIDEO_OUT, chrome.cast.ob.AUDIO_OUT];
  this.dialRequest = null;
  this.requestSessionTimeout = d || chrome.cast.timeout.requestSession;
  this.language = null;
};
g.j("chrome.cast.SessionRequest", chrome.cast.El);
chrome.cast.$ = function(a, c, d, e) {
  this.label = a;
  this.friendlyName = c;
  this.capabilities = d || [];
  this.volume = e || null;
  this.receiverType = chrome.cast.Wa.CAST;
  this.ipAddress = this.displayStatus = this.isActiveInput = null;
};
g.j("chrome.cast.Receiver", chrome.cast.$);
chrome.cast.ll = function(a, c) {
  this.statusText = a;
  this.appImages = c;
  this.showStop = null;
};
g.j("chrome.cast.ReceiverDisplayStatus", chrome.cast.ll);
chrome.cast.q = function(a, c, d, e, f) {
  this.sessionId = a;
  this.appId = c;
  this.displayName = d;
  this.statusText = null;
  this.appImages = e;
  this.receiver = f;
  this.senderApps = [];
  this.namespaces = [];
  this.media = [];
  this.status = chrome.cast.kc.CONNECTED;
  this.transportId = "";
};
g.j("chrome.cast.Session", chrome.cast.q);
chrome.cast.q.Vf = "custom_receiver_session_id";
g.A(chrome.cast.q, "CUSTOM_RECEIVER_SESSION_ID", chrome.cast.q.Vf);
chrome.cast.timeout = {};
g.j("chrome.cast.timeout", chrome.cast.timeout);
chrome.cast.timeout.requestSession = 1E4;
chrome.cast.timeout.leaveSession = 3E3;
chrome.cast.timeout.stopSession = 3E3;
chrome.cast.timeout.setReceiverVolume = 3E3;
chrome.cast.timeout.sendCustomMessage = 3E3;
chrome.cast.ug = "mirror_app_id";
g.j("chrome.cast.MIRROR_APP_ID", chrome.cast.ug);
k.mj = function(a) {
  this.sessionRequest = a.sessionRequest;
  this.autoJoinPolicy = a.autoJoinPolicy;
  this.defaultActionPolicy = a.defaultActionPolicy;
  this.useCustomDialLaunch = !!a.customDialLaunchCallback;
};
k.Jq = function() {
  this.displayName = this.appId = this.sessionId = this.transportId = "";
  this.statusText = null;
  this.appImages = [];
  this.senderApps = [];
  this.namespaces = [];
};
k.mt = function() {
  this.type = k.M.cg;
  this.requestId = null;
};
k.nt = function() {
  this.type = k.M.dl;
  this.status = this.requestId = null;
};
k.lt = function() {
  this.channelUrl = this.volume = this.applications = null;
  this.isActiveInput = void 0;
};
k.Er = function() {
};
g.b = {};
g.b.Sd = !1;
g.b.$j = !1;
g.b.Wl = {Sk:"\u00a0"};
g.b.fq = function(a, c) {
  return 0 == a.lastIndexOf(c, 0);
};
g.b.Wu = function(a, c) {
  var d = a.length - c.length;
  return 0 <= d && a.indexOf(c, d) == d;
};
g.b.qu = function(a, c) {
  return 0 == g.b.ih(c, a.substr(0, c.length));
};
g.b.ou = function(a, c) {
  return 0 == g.b.ih(c, a.substr(a.length - c.length, c.length));
};
g.b.pu = function(a, c) {
  return a.toLowerCase() == c.toLowerCase();
};
g.b.jq = function(a, c) {
  for (var d = a.split("%s"), e = "", f = Array.prototype.slice.call(arguments, 1);f.length && 1 < d.length;) {
    e += d.shift() + f.shift();
  }
  return e + d.join("%s");
};
g.b.zu = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
g.b.Re = function(a) {
  return/^[\s\xa0]*$/.test(a);
};
g.b.Xv = function(a) {
  return 0 == a.length;
};
g.b.wa = g.b.Re;
g.b.bo = function(a) {
  return g.b.Re(g.b.Lo(a));
};
g.b.Wv = g.b.bo;
g.b.Qv = function(a) {
  return!/[^\t\n\r ]/.test(a);
};
g.b.Ov = function(a) {
  return!/[^a-zA-Z]/.test(a);
};
g.b.iw = function(a) {
  return!/[^0-9]/.test(a);
};
g.b.Pv = function(a) {
  return!/[^a-zA-Z0-9]/.test(a);
};
g.b.nw = function(a) {
  return " " == a;
};
g.b.pw = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a;
};
g.b.tx = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ");
};
g.b.mu = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n");
};
g.b.Hw = function(a) {
  return a.replace(/\xa0|\s/g, " ");
};
g.b.Gw = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ");
};
g.b.yu = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
g.b.trim = g.ge && String.prototype.trim ? function(a) {
  return a.trim();
} : function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
g.b.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "");
};
g.b.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "");
};
g.b.ih = function(a, c) {
  var d = String(a).toLowerCase(), e = String(c).toLowerCase();
  return d < e ? -1 : d == e ? 0 : 1;
};
g.b.yi = /(\.\d+)|(\d+)|(\D+)/g;
g.b.Jw = function(a, c) {
  if (a == c) {
    return 0;
  }
  if (!a) {
    return-1;
  }
  if (!c) {
    return 1;
  }
  for (var d = a.toLowerCase().match(g.b.yi), e = c.toLowerCase().match(g.b.yi), f = Math.min(d.length, e.length), h = 0;h < f;h++) {
    var l = d[h], m = e[h];
    if (l != m) {
      return d = parseInt(l, 10), !isNaN(d) && (e = parseInt(m, 10), !isNaN(e) && d - e) ? d - e : l < m ? -1 : 1;
    }
  }
  return d.length != e.length ? d.length - e.length : a < c ? -1 : 1;
};
g.b.Jx = function(a) {
  return encodeURIComponent(String(a));
};
g.b.Ix = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "));
};
g.b.vi = function(a, c) {
  return a.replace(/(\r\n|\r|\n)/g, c ? "<br />" : "<br>");
};
g.b.Ra = function(a, c) {
  if (c) {
    a = a.replace(g.b.Gf, "&amp;").replace(g.b.og, "&lt;").replace(g.b.dg, "&gt;").replace(g.b.Dg, "&quot;").replace(g.b.Kg, "&#39;").replace(g.b.xg, "&#0;"), g.b.Sd && (a = a.replace(g.b.$f, "&#101;"));
  } else {
    if (!g.b.ij.test(a)) {
      return a;
    }
    -1 != a.indexOf("&") && (a = a.replace(g.b.Gf, "&amp;"));
    -1 != a.indexOf("<") && (a = a.replace(g.b.og, "&lt;"));
    -1 != a.indexOf(">") && (a = a.replace(g.b.dg, "&gt;"));
    -1 != a.indexOf('"') && (a = a.replace(g.b.Dg, "&quot;"));
    -1 != a.indexOf("'") && (a = a.replace(g.b.Kg, "&#39;"));
    -1 != a.indexOf("\x00") && (a = a.replace(g.b.xg, "&#0;"));
    g.b.Sd && -1 != a.indexOf("e") && (a = a.replace(g.b.$f, "&#101;"));
  }
  return a;
};
g.b.Gf = /&/g;
g.b.og = /</g;
g.b.dg = />/g;
g.b.Dg = /"/g;
g.b.Kg = /'/g;
g.b.xg = /\x00/g;
g.b.$f = /e/g;
g.b.ij = g.b.Sd ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
g.b.Ff = function(a) {
  return g.b.contains(a, "&") ? !g.b.$j && "document" in g.global ? g.b.Yi(a) : g.b.rq(a) : a;
};
g.b.Ex = function(a, c) {
  return g.b.contains(a, "&") ? g.b.Yi(a, c) : a;
};
g.b.Yi = function(a, c) {
  var d = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, e;
  e = c ? c.createElement("div") : g.global.document.createElement("div");
  return a.replace(g.b.hk, function(a, c) {
    var l = d[a];
    if (l) {
      return l;
    }
    if ("#" == c.charAt(0)) {
      var m = Number("0" + c.substr(1));
      isNaN(m) || (l = String.fromCharCode(m));
    }
    l || (e.innerHTML = a + " ", l = e.firstChild.nodeValue.slice(0, -1));
    return d[a] = l;
  });
};
g.b.rq = function(a) {
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
g.b.hk = /&([^;\s<&]+);?/g;
g.b.wq = function(a, c) {
  return g.b.vi(a.replace(/  /g, " &#160;"), c);
};
g.b.Nw = function(a) {
  return a.replace(/(^|[\n ]) /g, "$1" + g.b.Wl.Sk);
};
g.b.ux = function(a, c) {
  for (var d = c.length, e = 0;e < d;e++) {
    var f = 1 == d ? c : c.charAt(e);
    if (a.charAt(0) == f && a.charAt(a.length - 1) == f) {
      return a.substring(1, a.length - 1);
    }
  }
  return a;
};
g.b.truncate = function(a, c, d) {
  d && (a = g.b.Ff(a));
  a.length > c && (a = a.substring(0, c - 3) + "...");
  d && (a = g.b.Ra(a));
  return a;
};
g.b.Cx = function(a, c, d, e) {
  d && (a = g.b.Ff(a));
  if (e && a.length > c) {
    e > c && (e = c), a = a.substring(0, c - e) + "..." + a.substring(a.length - e);
  } else {
    if (a.length > c) {
      e = Math.floor(c / 2);
      var f = a.length - e;
      a = a.substring(0, e + c % 2) + "..." + a.substring(f);
    }
  }
  d && (a = g.b.Ra(a));
  return a;
};
g.b.Af = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
g.b.qd = {"'":"\\'"};
g.b.quote = function(a) {
  a = String(a);
  if (a.quote) {
    return a.quote();
  }
  for (var c = ['"'], d = 0;d < a.length;d++) {
    var e = a.charAt(d), f = e.charCodeAt(0);
    c[d + 1] = g.b.Af[e] || (31 < f && 127 > f ? e : g.b.zh(e));
  }
  c.push('"');
  return c.join("");
};
g.b.cv = function(a) {
  for (var c = [], d = 0;d < a.length;d++) {
    c[d] = g.b.zh(a.charAt(d));
  }
  return c.join("");
};
g.b.zh = function(a) {
  if (a in g.b.qd) {
    return g.b.qd[a];
  }
  if (a in g.b.Af) {
    return g.b.qd[a] = g.b.Af[a];
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
  return g.b.qd[a] = c;
};
g.b.contains = function(a, c) {
  return-1 != a.indexOf(c);
};
g.b.Bm = function(a, c) {
  return g.b.contains(a.toLowerCase(), c.toLowerCase());
};
g.b.Hu = function(a, c) {
  return a && c ? a.split(c).length - 1 : 0;
};
g.b.zc = function(a, c, d) {
  var e = a;
  0 <= c && c < a.length && 0 < d && (e = a.substr(0, c) + a.substr(c + d, a.length - c - d));
  return e;
};
g.b.remove = function(a, c) {
  var d = new RegExp(g.b.nf(c), "");
  return a.replace(d, "");
};
g.b.removeAll = function(a, c) {
  var d = new RegExp(g.b.nf(c), "g");
  return a.replace(d, "");
};
g.b.nf = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
g.b.repeat = function(a, c) {
  return Array(c + 1).join(a);
};
g.b.Mw = function(a, c, d) {
  a = g.W(d) ? a.toFixed(d) : String(a);
  d = a.indexOf(".");
  -1 == d && (d = a.length);
  return g.b.repeat("0", Math.max(0, c - d)) + a;
};
g.b.Lo = function(a) {
  return null == a ? "" : String(a);
};
g.b.ju = function(a) {
  return Array.prototype.join.call(arguments, "");
};
g.b.An = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ g.now()).toString(36);
};
g.b.Nb = function(a, c) {
  for (var d = 0, e = g.b.trim(String(a)).split("."), f = g.b.trim(String(c)).split("."), h = Math.max(e.length, f.length), l = 0;0 == d && l < h;l++) {
    var m = e[l] || "", n = f[l] || "", p = /(\d*)(\D*)/g, q = /(\d*)(\D*)/g;
    do {
      var r = p.exec(m) || ["", "", ""], t = q.exec(n) || ["", "", ""];
      if (0 == r[0].length && 0 == t[0].length) {
        break;
      }
      d = g.b.re(0 == r[1].length ? 0 : parseInt(r[1], 10), 0 == t[1].length ? 0 : parseInt(t[1], 10)) || g.b.re(0 == r[2].length, 0 == t[2].length) || g.b.re(r[2], t[2]);
    } while (0 == d);
  }
  return d;
};
g.b.re = function(a, c) {
  return a < c ? -1 : a > c ? 1 : 0;
};
g.b.fk = 4294967296;
g.b.Iv = function(a) {
  for (var c = 0, d = 0;d < a.length;++d) {
    c = 31 * c + a.charCodeAt(d), c %= g.b.fk;
  }
  return c;
};
g.b.sq = 2147483648 * Math.random() | 0;
g.b.Mu = function() {
  return "goog_" + g.b.sq++;
};
g.b.zx = function(a) {
  var c = Number(a);
  return 0 == c && g.b.Re(a) ? NaN : c;
};
g.b.cw = function(a) {
  return/^[a-z]+([A-Z][a-z]*)*$/.test(a);
};
g.b.qw = function(a) {
  return/^([A-Z][a-z]*)+$/.test(a);
};
g.b.yx = function(a) {
  return String(a).replace(/\-([a-z])/g, function(a, d) {
    return d.toUpperCase();
  });
};
g.b.Ax = function(a) {
  return String(a).replace(/([A-Z])/g, "-$1").toLowerCase();
};
g.b.Bx = function(a, c) {
  var d = g.isString(c) ? g.b.nf(c) : "\\s";
  return a.replace(new RegExp("(^" + (d ? "|[" + d + "]+" : "") + ")([a-z])", "g"), function(a, c, d) {
    return c + d.toUpperCase();
  });
};
g.b.nu = function(a) {
  return String(a.charAt(0)).toUpperCase() + String(a.substr(1)).toLowerCase();
};
g.b.parseInt = function(a) {
  isFinite(a) && (a = String(a));
  return g.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN;
};
g.b.nx = function(a, c, d) {
  a = a.split(c);
  for (var e = [];0 < d && a.length;) {
    e.push(a.shift()), d--;
  }
  a.length && e.push(a.join(c));
  return e;
};
g.b.Uu = function(a, c) {
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
    for (var h = 0;h < c.length;h++) {
      e[h + 1] = Math.min(e[h] + 1, d[h + 1] + 1, d[h] + (a[f] != c[h]));
    }
    for (h = 0;h < d.length;h++) {
      d[h] = e[h];
    }
  }
  return e[c.length];
};
k.je = {};
k.je.vf = function(a) {
  return a ? g.b.Ra(a) : a;
};
k.je.Hx = function(a) {
  return a ? g.b.Ff(a) : a;
};
g.debug = {};
g.debug.Error = function(a) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, g.debug.Error);
  } else {
    var c = Error().stack;
    c && (this.stack = c);
  }
  a && (this.message = String(a));
};
g.Sa(g.debug.Error, Error);
g.debug.Error.prototype.name = "CustomError";
g.vb = {};
g.vb.Wk = {Oj:1, Dq:2, TEXT:3, Nq:4, or:5, nr:6, gt:7, Wq:8, gr:9, ir:10, hr:11, Zs:12};
g.l = {};
g.l.Da = g.ia;
g.l.Ec = function(a, c) {
  c.unshift(a);
  g.debug.Error.call(this, g.b.jq.apply(null, c));
  c.shift();
};
g.Sa(g.l.Ec, g.debug.Error);
g.l.Ec.prototype.name = "AssertionError";
g.l.Bj = function(a) {
  throw a;
};
g.l.ze = g.l.Bj;
g.l.Ya = function(a, c, d, e) {
  var f = "Assertion failed";
  if (d) {
    var f = f + (": " + d), h = e
  } else {
    a && (f += ": " + a, h = c);
  }
  a = new g.l.Ec("" + f, h || []);
  g.l.ze(a);
};
g.l.dx = function(a) {
  g.l.Da && (g.l.ze = a);
};
g.l.assert = function(a, c, d) {
  g.l.Da && !a && g.l.Ya("", null, c, Array.prototype.slice.call(arguments, 2));
  return a;
};
g.l.Ca = function(a, c) {
  g.l.Da && g.l.ze(new g.l.Ec("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)));
};
g.l.bu = function(a, c, d) {
  g.l.Da && !g.isNumber(a) && g.l.Ya("Expected number but got %s: %s.", [g.sa(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a;
};
g.l.du = function(a, c, d) {
  g.l.Da && !g.isString(a) && g.l.Ya("Expected string but got %s: %s.", [g.sa(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a;
};
g.l.$t = function(a, c, d) {
  g.l.Da && !g.isFunction(a) && g.l.Ya("Expected function but got %s: %s.", [g.sa(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a;
};
g.l.cu = function(a, c, d) {
  g.l.Da && !g.isObject(a) && g.l.Ya("Expected object but got %s: %s.", [g.sa(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a;
};
g.l.Xt = function(a, c, d) {
  g.l.Da && !g.isArray(a) && g.l.Ya("Expected array but got %s: %s.", [g.sa(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a;
};
g.l.Yt = function(a, c, d) {
  g.l.Da && !g.jb(a) && g.l.Ya("Expected boolean but got %s: %s.", [g.sa(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a;
};
g.l.Zt = function(a, c, d) {
  !g.l.Da || g.isObject(a) && a.nodeType == g.vb.Wk.Oj || g.l.Ya("Expected Element but got %s: %s.", [g.sa(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a;
};
g.l.au = function(a, c, d, e) {
  !g.l.Da || a instanceof c || g.l.Ya("Expected instanceof %s but got %s.", [g.l.Rh(c), g.l.Rh(a)], d, Array.prototype.slice.call(arguments, 3));
  return a;
};
g.l.pm = function() {
  for (var a in Object.prototype) {
    g.l.Ca(a + " should not be enumerable in Object.prototype.");
  }
};
g.l.Rh = function(a) {
  return a instanceof Function ? a.displayName || a.name || "unknown type name" : a instanceof Object ? a.constructor.displayName || a.constructor.name || Object.prototype.toString.call(a) : null === a ? "null" : typeof a;
};
g.a = {};
g.Va = g.ge;
g.a.Ua = !1;
g.a.kp = function(a) {
  return a[a.length - 1];
};
g.a.rw = g.a.kp;
g.a.D = Array.prototype;
g.a.indexOf = g.Va && (g.a.Ua || g.a.D.indexOf) ? function(a, c, d) {
  return g.a.D.indexOf.call(a, c, d);
} : function(a, c, d) {
  d = null == d ? 0 : 0 > d ? Math.max(0, a.length + d) : d;
  if (g.isString(a)) {
    return g.isString(c) && 1 == c.length ? a.indexOf(c, d) : -1;
  }
  for (;d < a.length;d++) {
    if (d in a && a[d] === c) {
      return d;
    }
  }
  return-1;
};
g.a.lastIndexOf = g.Va && (g.a.Ua || g.a.D.lastIndexOf) ? function(a, c, d) {
  return g.a.D.lastIndexOf.call(a, c, null == d ? a.length - 1 : d);
} : function(a, c, d) {
  d = null == d ? a.length - 1 : d;
  0 > d && (d = Math.max(0, a.length + d));
  if (g.isString(a)) {
    return g.isString(c) && 1 == c.length ? a.lastIndexOf(c, d) : -1;
  }
  for (;0 <= d;d--) {
    if (d in a && a[d] === c) {
      return d;
    }
  }
  return-1;
};
g.a.forEach = g.Va && (g.a.Ua || g.a.D.forEach) ? function(a, c, d) {
  g.a.D.forEach.call(a, c, d);
} : function(a, c, d) {
  for (var e = a.length, f = g.isString(a) ? a.split("") : a, h = 0;h < e;h++) {
    h in f && c.call(d, f[h], h, a);
  }
};
g.a.Jh = function(a, c, d) {
  for (var e = a.length, f = g.isString(a) ? a.split("") : a, e = e - 1;0 <= e;--e) {
    e in f && c.call(d, f[e], e, a);
  }
};
g.a.filter = g.Va && (g.a.Ua || g.a.D.filter) ? function(a, c, d) {
  return g.a.D.filter.call(a, c, d);
} : function(a, c, d) {
  for (var e = a.length, f = [], h = 0, l = g.isString(a) ? a.split("") : a, m = 0;m < e;m++) {
    if (m in l) {
      var n = l[m];
      c.call(d, n, m, a) && (f[h++] = n);
    }
  }
  return f;
};
g.a.map = g.Va && (g.a.Ua || g.a.D.map) ? function(a, c, d) {
  return g.a.D.map.call(a, c, d);
} : function(a, c, d) {
  for (var e = a.length, f = Array(e), h = g.isString(a) ? a.split("") : a, l = 0;l < e;l++) {
    l in h && (f[l] = c.call(d, h[l], l, a));
  }
  return f;
};
g.a.reduce = g.Va && (g.a.Ua || g.a.D.reduce) ? function(a, c, d, e) {
  e && (c = g.bind(c, e));
  return g.a.D.reduce.call(a, c, d);
} : function(a, c, d, e) {
  var f = d;
  g.a.forEach(a, function(d, l) {
    f = c.call(e, f, d, l, a);
  });
  return f;
};
g.a.reduceRight = g.Va && (g.a.Ua || g.a.D.reduceRight) ? function(a, c, d, e) {
  e && (c = g.bind(c, e));
  return g.a.D.reduceRight.call(a, c, d);
} : function(a, c, d, e) {
  var f = d;
  g.a.Jh(a, function(d, l) {
    f = c.call(e, f, d, l, a);
  });
  return f;
};
g.a.some = g.Va && (g.a.Ua || g.a.D.some) ? function(a, c, d) {
  return g.a.D.some.call(a, c, d);
} : function(a, c, d) {
  for (var e = a.length, f = g.isString(a) ? a.split("") : a, h = 0;h < e;h++) {
    if (h in f && c.call(d, f[h], h, a)) {
      return!0;
    }
  }
  return!1;
};
g.a.every = g.Va && (g.a.Ua || g.a.D.every) ? function(a, c, d) {
  return g.a.D.every.call(a, c, d);
} : function(a, c, d) {
  for (var e = a.length, f = g.isString(a) ? a.split("") : a, h = 0;h < e;h++) {
    if (h in f && !c.call(d, f[h], h, a)) {
      return!1;
    }
  }
  return!0;
};
g.a.count = function(a, c, d) {
  var e = 0;
  g.a.forEach(a, function(a, h, l) {
    c.call(d, a, h, l) && ++e;
  }, d);
  return e;
};
g.a.find = function(a, c, d) {
  c = g.a.Fh(a, c, d);
  return 0 > c ? null : g.isString(a) ? a.charAt(c) : a[c];
};
g.a.Fh = function(a, c, d) {
  for (var e = a.length, f = g.isString(a) ? a.split("") : a, h = 0;h < e;h++) {
    if (h in f && c.call(d, f[h], h, a)) {
      return h;
    }
  }
  return-1;
};
g.a.gv = function(a, c, d) {
  c = g.a.gn(a, c, d);
  return 0 > c ? null : g.isString(a) ? a.charAt(c) : a[c];
};
g.a.gn = function(a, c, d) {
  for (var e = a.length, f = g.isString(a) ? a.split("") : a, e = e - 1;0 <= e;e--) {
    if (e in f && c.call(d, f[e], e, a)) {
      return e;
    }
  }
  return-1;
};
g.a.contains = function(a, c) {
  return 0 <= g.a.indexOf(a, c);
};
g.a.wa = function(a) {
  return 0 == a.length;
};
g.a.clear = function(a) {
  if (!g.isArray(a)) {
    for (var c = a.length - 1;0 <= c;c--) {
      delete a[c];
    }
  }
  a.length = 0;
};
g.a.insert = function(a, c) {
  g.a.contains(a, c) || a.push(c);
};
g.a.Xh = function(a, c, d) {
  g.a.splice(a, d, 0, c);
};
g.a.Mv = function(a, c, d) {
  g.yc(g.a.splice, a, d, 0).apply(null, c);
};
g.a.insertBefore = function(a, c, d) {
  var e;
  2 == arguments.length || 0 > (e = g.a.indexOf(a, d)) ? a.push(c) : g.a.Xh(a, c, e);
};
g.a.remove = function(a, c) {
  var d = g.a.indexOf(a, c), e;
  (e = 0 <= d) && g.a.zc(a, d);
  return e;
};
g.a.zc = function(a, c) {
  return 1 == g.a.D.splice.call(a, c, 1).length;
};
g.a.Sw = function(a, c, d) {
  c = g.a.Fh(a, c, d);
  return 0 <= c ? (g.a.zc(a, c), !0) : !1;
};
g.a.Qw = function(a, c, d) {
  var e = 0;
  g.a.Jh(a, function(f, h) {
    c.call(d, f, h, a) && g.a.zc(a, h) && e++;
  });
  return e;
};
g.a.concat = function(a) {
  return g.a.D.concat.apply(g.a.D, arguments);
};
g.a.join = function(a) {
  return g.a.D.concat.apply(g.a.D, arguments);
};
g.a.nb = function(a) {
  var c = a.length;
  if (0 < c) {
    for (var d = Array(c), e = 0;e < c;e++) {
      d[e] = a[e];
    }
    return d;
  }
  return[];
};
g.a.clone = g.a.nb;
g.a.extend = function(a, c) {
  for (var d = 1;d < arguments.length;d++) {
    var e = arguments[d];
    if (g.V(e)) {
      var f = a.length || 0, h = e.length || 0;
      a.length = f + h;
      for (var l = 0;l < h;l++) {
        a[f + l] = e[l];
      }
    } else {
      a.push(e);
    }
  }
};
g.a.splice = function(a, c, d, e) {
  return g.a.D.splice.apply(a, g.a.slice(arguments, 1));
};
g.a.slice = function(a, c, d) {
  return 2 >= arguments.length ? g.a.D.slice.call(a, c) : g.a.D.slice.call(a, c, d);
};
g.a.qp = function(a, c, d) {
  c = c || a;
  d = d || function() {
    return g.isObject(l) ? "o" + g.Le(l) : (typeof l).charAt(0) + l;
  };
  for (var e = {}, f = 0, h = 0;h < a.length;) {
    var l = a[h++], m = d(l);
    Object.prototype.hasOwnProperty.call(e, m) || (e[m] = !0, c[f++] = l);
  }
  c.length = f;
};
g.a.ah = function(a, c, d) {
  return g.a.bh(a, d || g.a.ib, !1, c);
};
g.a.gu = function(a, c, d) {
  return g.a.bh(a, c, !0, void 0, d);
};
g.a.bh = function(a, c, d, e, f) {
  for (var h = 0, l = a.length, m;h < l;) {
    var n = h + l >> 1, p;
    p = d ? c.call(f, a[n], n, a) : c(e, a[n]);
    0 < p ? h = n + 1 : (l = n, m = !p);
  }
  return m ? h : ~h;
};
g.a.sort = function(a, c) {
  a.sort(c || g.a.ib);
};
g.a.ox = function(a, c) {
  for (var d = 0;d < a.length;d++) {
    a[d] = {index:d, value:a[d]};
  }
  var e = c || g.a.ib;
  g.a.sort(a, function(a, c) {
    return e(a.value, c.value) || a.index - c.index;
  });
  for (d = 0;d < a.length;d++) {
    a[d] = a[d].value;
  }
};
g.a.dq = function(a, c, d) {
  var e = d || g.a.ib;
  g.a.sort(a, function(a, d) {
    return e(c(a), c(d));
  });
};
g.a.mx = function(a, c, d) {
  g.a.dq(a, function(a) {
    return a[c];
  }, d);
};
g.a.ii = function(a, c, d) {
  c = c || g.a.ib;
  for (var e = 1;e < a.length;e++) {
    var f = c(a[e - 1], a[e]);
    if (0 < f || 0 == f && d) {
      return!1;
    }
  }
  return!0;
};
g.a.equals = function(a, c, d) {
  if (!g.V(a) || !g.V(c) || a.length != c.length) {
    return!1;
  }
  var e = a.length;
  d = d || g.a.wh;
  for (var f = 0;f < e;f++) {
    if (!d(a[f], c[f])) {
      return!1;
    }
  }
  return!0;
};
g.a.Cu = function(a, c, d) {
  d = d || g.a.ib;
  for (var e = Math.min(a.length, c.length), f = 0;f < e;f++) {
    var h = d(a[f], c[f]);
    if (0 != h) {
      return h;
    }
  }
  return g.a.ib(a.length, c.length);
};
g.a.ib = function(a, c) {
  return a > c ? 1 : a < c ? -1 : 0;
};
g.a.Nv = function(a, c) {
  return-g.a.ib(a, c);
};
g.a.wh = function(a, c) {
  return a === c;
};
g.a.eu = function(a, c, d) {
  d = g.a.ah(a, c, d);
  return 0 > d ? (g.a.Xh(a, c, -(d + 1)), !0) : !1;
};
g.a.fu = function(a, c, d) {
  c = g.a.ah(a, c, d);
  return 0 <= c ? g.a.zc(a, c) : !1;
};
g.a.iu = function(a, c, d) {
  for (var e = {}, f = 0;f < a.length;f++) {
    var h = a[f], l = c.call(d, h, f, a);
    g.W(l) && (e[l] || (e[l] = [])).push(h);
  }
  return e;
};
g.a.oq = function(a, c, d) {
  var e = {};
  g.a.forEach(a, function(f, h) {
    e[c.call(d, f, h, a)] = f;
  });
  return e;
};
g.a.Bd = function(a, c, d) {
  var e = [], f = 0, h = a;
  d = d || 1;
  void 0 !== c && (f = a, h = c);
  if (0 > d * (h - f)) {
    return[];
  }
  if (0 < d) {
    for (a = f;a < h;a += d) {
      e.push(a);
    }
  } else {
    for (a = f;a > h;a += d) {
      e.push(a);
    }
  }
  return e;
};
g.a.repeat = function(a, c) {
  for (var d = [], e = 0;e < c;e++) {
    d[e] = a;
  }
  return d;
};
g.a.jn = function(a) {
  for (var c = [], d = 0;d < arguments.length;d++) {
    var e = arguments[d];
    if (g.isArray(e)) {
      for (var f = 0;f < e.length;f += 8192) {
        for (var h = g.a.slice(e, f, f + 8192), h = g.a.jn.apply(null, h), l = 0;l < h.length;l++) {
          c.push(h[l]);
        }
      }
    } else {
      c.push(e);
    }
  }
  return c;
};
g.a.rotate = function(a, c) {
  a.length && (c %= a.length, 0 < c ? g.a.D.unshift.apply(a, a.splice(-c, c)) : 0 > c && g.a.D.push.apply(a, a.splice(0, -c)));
  return a;
};
g.a.Cw = function(a, c, d) {
  c = g.a.D.splice.call(a, c, 1);
  g.a.D.splice.call(a, d, 0, c[0]);
};
g.a.gj = function(a) {
  if (!arguments.length) {
    return[];
  }
  for (var c = [], d = 0;;d++) {
    for (var e = [], f = 0;f < arguments.length;f++) {
      var h = arguments[f];
      if (d >= h.length) {
        return c;
      }
      e.push(h[d]);
    }
    c.push(e);
  }
};
g.a.kx = function(a, c) {
  for (var d = c || Math.random, e = a.length - 1;0 < e;e--) {
    var f = Math.floor(d() * (e + 1)), h = a[e];
    a[e] = a[f];
    a[f] = h;
  }
};
g.a.Gu = function(a, c) {
  var d = [];
  g.a.forEach(c, function(c) {
    d.push(a[c]);
  });
  return d;
};
g.object = {};
g.object.forEach = function(a, c, d) {
  for (var e in a) {
    c.call(d, a[e], e, a);
  }
};
g.object.filter = function(a, c, d) {
  var e = {}, f;
  for (f in a) {
    c.call(d, a[f], f, a) && (e[f] = a[f]);
  }
  return e;
};
g.object.map = function(a, c, d) {
  var e = {}, f;
  for (f in a) {
    e[f] = c.call(d, a[f], f, a);
  }
  return e;
};
g.object.some = function(a, c, d) {
  for (var e in a) {
    if (c.call(d, a[e], e, a)) {
      return!0;
    }
  }
  return!1;
};
g.object.every = function(a, c, d) {
  for (var e in a) {
    if (!c.call(d, a[e], e, a)) {
      return!1;
    }
  }
  return!0;
};
g.object.ua = function(a) {
  var c = 0, d;
  for (d in a) {
    c++;
  }
  return c;
};
g.object.nv = function(a) {
  for (var c in a) {
    return c;
  }
};
g.object.ov = function(a) {
  for (var c in a) {
    return a[c];
  }
};
g.object.contains = function(a, c) {
  return g.object.Ob(a, c);
};
g.object.U = function(a) {
  var c = [], d = 0, e;
  for (e in a) {
    c[d++] = a[e];
  }
  return c;
};
g.object.va = function(a) {
  var c = [], d = 0, e;
  for (e in a) {
    c[d++] = e;
  }
  return c;
};
g.object.Av = function(a, c) {
  for (var d = g.V(c), e = d ? c : arguments, d = d ? 0 : 1;d < e.length && (a = a[e[d]], g.W(a));d++) {
  }
  return a;
};
g.object.se = function(a, c) {
  return c in a;
};
g.object.Ob = function(a, c) {
  for (var d in a) {
    if (a[d] == c) {
      return!0;
    }
  }
  return!1;
};
g.object.hn = function(a, c, d) {
  for (var e in a) {
    if (c.call(d, a[e], e, a)) {
      return e;
    }
  }
};
g.object.hv = function(a, c, d) {
  return(c = g.object.hn(a, c, d)) && a[c];
};
g.object.wa = function(a) {
  for (var c in a) {
    return!1;
  }
  return!0;
};
g.object.clear = function(a) {
  for (var c in a) {
    delete a[c];
  }
};
g.object.remove = function(a, c) {
  var d;
  (d = c in a) && delete a[c];
  return d;
};
g.object.add = function(a, c, d) {
  if (c in a) {
    throw Error('The object already contains the key "' + c + '"');
  }
  g.object.set(a, c, d);
};
g.object.get = function(a, c, d) {
  return c in a ? a[c] : d;
};
g.object.set = function(a, c, d) {
  a[c] = d;
};
g.object.fx = function(a, c, d) {
  return c in a ? a[c] : a[c] = d;
};
g.object.jx = function(a, c, d) {
  if (c in a) {
    return a[c];
  }
  d = d();
  return a[c] = d;
};
g.object.equals = function(a, c) {
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
g.object.clone = function(a) {
  var c = {}, d;
  for (d in a) {
    c[d] = a[d];
  }
  return c;
};
g.object.tq = function(a) {
  var c = g.sa(a);
  if ("object" == c || "array" == c) {
    if (a.clone) {
      return a.clone();
    }
    var c = "array" == c ? [] : {}, d;
    for (d in a) {
      c[d] = g.object.tq(a[d]);
    }
    return c;
  }
  return a;
};
g.object.Vi = function(a) {
  var c = {}, d;
  for (d in a) {
    c[a[d]] = d;
  }
  return c;
};
g.object.Ag = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
g.object.extend = function(a, c) {
  for (var d, e, f = 1;f < arguments.length;f++) {
    e = arguments[f];
    for (d in e) {
      a[d] = e[d];
    }
    for (var h = 0;h < g.object.Ag.length;h++) {
      d = g.object.Ag[h], Object.prototype.hasOwnProperty.call(e, d) && (a[d] = e[d]);
    }
  }
};
g.object.create = function(a) {
  var c = arguments.length;
  if (1 == c && g.isArray(arguments[0])) {
    return g.object.create.apply(null, arguments[0]);
  }
  if (c % 2) {
    throw Error("Uneven number of arguments");
  }
  for (var d = {}, e = 0;e < c;e += 2) {
    d[arguments[e]] = arguments[e + 1];
  }
  return d;
};
g.object.$c = function(a) {
  var c = arguments.length;
  if (1 == c && g.isArray(arguments[0])) {
    return g.object.$c.apply(null, arguments[0]);
  }
  for (var d = {}, e = 0;e < c;e++) {
    d[arguments[e]] = !0;
  }
  return d;
};
g.object.Ku = function(a) {
  var c = a;
  Object.isFrozen && !Object.isFrozen(a) && (c = Object.create(a), Object.freeze(c));
  return c;
};
g.object.$v = function(a) {
  return!!Object.isFrozen && Object.isFrozen(a);
};
g.vb.tags = {};
g.vb.tags.$l = g.object.$c("area base br col command embed hr img input keygen link meta param source track wbr".split(" "));
g.vb.tags.wo = function(a) {
  return!0 === g.vb.tags.$l[a];
};
g.i18n = {};
g.i18n.d = {};
g.i18n.d.ak = !1;
g.i18n.d.ng = g.i18n.d.ak || ("ar" == g.da.substring(0, 2).toLowerCase() || "fa" == g.da.substring(0, 2).toLowerCase() || "he" == g.da.substring(0, 2).toLowerCase() || "iw" == g.da.substring(0, 2).toLowerCase() || "ps" == g.da.substring(0, 2).toLowerCase() || "sd" == g.da.substring(0, 2).toLowerCase() || "ug" == g.da.substring(0, 2).toLowerCase() || "ur" == g.da.substring(0, 2).toLowerCase() || "yi" == g.da.substring(0, 2).toLowerCase()) && (2 == g.da.length || "-" == g.da.substring(2, 3) || "_" == 
g.da.substring(2, 3)) || 3 <= g.da.length && "ckb" == g.da.substring(0, 3).toLowerCase() && (3 == g.da.length || "-" == g.da.substring(3, 4) || "_" == g.da.substring(3, 4));
g.i18n.d.Gb = {qk:"\u202a", hl:"\u202b", zg:"\u202c", rk:"\u200e", il:"\u200f"};
g.i18n.d.S = {Ib:1, Kb:-1, eb:0};
g.i18n.d.Oc = "right";
g.i18n.d.Kc = "left";
g.i18n.d.yr = g.i18n.d.ng ? g.i18n.d.Kc : g.i18n.d.Oc;
g.i18n.d.xr = g.i18n.d.ng ? g.i18n.d.Oc : g.i18n.d.Kc;
g.i18n.d.nq = function(a, c) {
  return "number" == typeof a ? 0 < a ? g.i18n.d.S.Ib : 0 > a ? g.i18n.d.S.Kb : c ? null : g.i18n.d.S.eb : null == a ? null : a ? g.i18n.d.S.Kb : g.i18n.d.S.Ib;
};
g.i18n.d.Vb = "A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff\u200e\u2c00-\ufb1c\ufe00-\ufe6f\ufefd-\uffff";
g.i18n.d.Yb = "\u0591-\u07ff\u200f\ufb1d-\ufdff\ufe70-\ufefc";
g.i18n.d.Qn = /<[^>]*>|&[^;]+;/g;
g.i18n.d.lb = function(a, c) {
  return c ? a.replace(g.i18n.d.Qn, "") : a;
};
g.i18n.d.Cp = new RegExp("[" + g.i18n.d.Yb + "]");
g.i18n.d.Ho = new RegExp("[" + g.i18n.d.Vb + "]");
g.i18n.d.jd = function(a, c) {
  return g.i18n.d.Cp.test(g.i18n.d.lb(a, c));
};
g.i18n.d.Gv = g.i18n.d.jd;
g.i18n.d.Uh = function(a, c) {
  return g.i18n.d.Ho.test(g.i18n.d.lb(a, c));
};
g.i18n.d.Ko = new RegExp("^[" + g.i18n.d.Vb + "]");
g.i18n.d.Hp = new RegExp("^[" + g.i18n.d.Yb + "]");
g.i18n.d.qo = function(a) {
  return g.i18n.d.Hp.test(a);
};
g.i18n.d.lo = function(a) {
  return g.i18n.d.Ko.test(a);
};
g.i18n.d.gw = function(a) {
  return!g.i18n.d.lo(a) && !g.i18n.d.qo(a);
};
g.i18n.d.Io = new RegExp("^[^" + g.i18n.d.Yb + "]*[" + g.i18n.d.Vb + "]");
g.i18n.d.Ep = new RegExp("^[^" + g.i18n.d.Vb + "]*[" + g.i18n.d.Yb + "]");
g.i18n.d.Pi = function(a, c) {
  return g.i18n.d.Ep.test(g.i18n.d.lb(a, c));
};
g.i18n.d.lw = g.i18n.d.Pi;
g.i18n.d.gq = function(a, c) {
  return g.i18n.d.Io.test(g.i18n.d.lb(a, c));
};
g.i18n.d.ew = g.i18n.d.gq;
g.i18n.d.gi = /^http:\/\/.*/;
g.i18n.d.hw = function(a, c) {
  a = g.i18n.d.lb(a, c);
  return g.i18n.d.gi.test(a) || !g.i18n.d.Uh(a) && !g.i18n.d.jd(a);
};
g.i18n.d.Jo = new RegExp("[" + g.i18n.d.Vb + "][^" + g.i18n.d.Yb + "]*$");
g.i18n.d.Fp = new RegExp("[" + g.i18n.d.Yb + "][^" + g.i18n.d.Vb + "]*$");
g.i18n.d.$m = function(a, c) {
  return g.i18n.d.Jo.test(g.i18n.d.lb(a, c));
};
g.i18n.d.dw = g.i18n.d.$m;
g.i18n.d.an = function(a, c) {
  return g.i18n.d.Fp.test(g.i18n.d.lb(a, c));
};
g.i18n.d.jw = g.i18n.d.an;
g.i18n.d.Gp = /^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Arab|Hebr|Thaa|Nkoo|Tfng))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;
g.i18n.d.kw = function(a) {
  return g.i18n.d.Gp.test(a);
};
g.i18n.d.dh = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(&lt;.*?(&gt;)+)/g;
g.i18n.d.vm = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(<.*?>+)/g;
g.i18n.d.Dv = function(a, c) {
  return(void 0 === c ? g.i18n.d.jd(a) : c) ? a.replace(g.i18n.d.dh, "<span dir=rtl>$&</span>") : a.replace(g.i18n.d.dh, "<span dir=ltr>$&</span>");
};
g.i18n.d.Ev = function(a, c) {
  var d = (void 0 === c ? g.i18n.d.jd(a) : c) ? g.i18n.d.Gb.il : g.i18n.d.Gb.rk;
  return a.replace(g.i18n.d.vm, d + "$&" + d);
};
g.i18n.d.Zu = function(a) {
  return "<" == a.charAt(0) ? a.replace(/<\w+/, "$& dir=rtl") : "\n<span dir=rtl>" + a + "</span>";
};
g.i18n.d.$u = function(a) {
  return g.i18n.d.Gb.hl + a + g.i18n.d.Gb.zg;
};
g.i18n.d.Xu = function(a) {
  return "<" == a.charAt(0) ? a.replace(/<\w+/, "$& dir=ltr") : "\n<span dir=ltr>" + a + "</span>";
};
g.i18n.d.Yu = function(a) {
  return g.i18n.d.Gb.qk + a + g.i18n.d.Gb.zg;
};
g.i18n.d.Xm = /:\s*([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)/g;
g.i18n.d.zo = /left/gi;
g.i18n.d.Bp = /right/gi;
g.i18n.d.lq = /%%%%/g;
g.i18n.d.Aw = function(a) {
  return a.replace(g.i18n.d.Xm, ":$1 $4 $3 $2").replace(g.i18n.d.zo, "%%%%").replace(g.i18n.d.Bp, g.i18n.d.Kc).replace(g.i18n.d.lq, g.i18n.d.Oc);
};
g.i18n.d.Zm = /([\u0591-\u05f2])"/g;
g.i18n.d.cq = /([\u0591-\u05f2])'/g;
g.i18n.d.Ew = function(a) {
  return a.replace(g.i18n.d.Zm, "$1\u05f4").replace(g.i18n.d.cq, "$1\u05f3");
};
g.i18n.d.xq = /\s+/;
g.i18n.d.Pn = /\d/;
g.i18n.d.Dp = .4;
g.i18n.d.bn = function(a, c) {
  for (var d = 0, e = 0, f = !1, h = g.i18n.d.lb(a, c).split(g.i18n.d.xq), l = 0;l < h.length;l++) {
    var m = h[l];
    g.i18n.d.Pi(m) ? (d++, e++) : g.i18n.d.gi.test(m) ? f = !0 : g.i18n.d.Uh(m) ? e++ : g.i18n.d.Pn.test(m) && (f = !0);
  }
  return 0 == e ? f ? g.i18n.d.S.Ib : g.i18n.d.S.eb : d / e > g.i18n.d.Dp ? g.i18n.d.S.Kb : g.i18n.d.S.Ib;
};
g.i18n.d.Su = function(a, c) {
  return g.i18n.d.bn(a, c) == g.i18n.d.S.Kb;
};
g.i18n.d.cx = function(a, c) {
  a && (c = g.i18n.d.nq(c)) && (a.style.textAlign = c == g.i18n.d.S.Kb ? g.i18n.d.Oc : g.i18n.d.Kc, a.dir = c == g.i18n.d.S.Kb ? "rtl" : "ltr");
};
g.i18n.d.kr = function() {
};
g.b.Dt = function() {
};
g.b.I = function() {
  this.Gd = "";
  this.Al = g.b.I.Rg;
};
g.b.I.prototype.$a = !0;
g.b.I.prototype.Za = function() {
  return this.Gd;
};
g.b.I.prototype.toString = function() {
  return "Const{" + this.Gd + "}";
};
g.b.I.H = function(a) {
  if (a instanceof g.b.I && a.constructor === g.b.I && a.Al === g.b.I.Rg) {
    return a.Gd;
  }
  g.l.Ca("expected object of type Const, got '" + a + "'");
  return "type_error:Const";
};
g.b.I.Ee = function(a) {
  return g.b.I.Rm(a);
};
g.b.I.Rg = {};
g.b.I.Rm = function(a) {
  var c = new g.b.I;
  c.Gd = a;
  return c;
};
g.html = {};
g.html.s = function() {
  this.zd = "";
  this.ql = g.html.s.fa;
};
g.html.s.prototype.$a = !0;
g.html.s.fa = {};
g.html.s.pc = function(a) {
  a = g.b.I.H(a);
  return 0 === a.length ? g.html.s.EMPTY : g.html.s.nc(a);
};
g.html.s.vu = function() {
};
g.html.s.prototype.Za = function() {
  return this.zd;
};
g.ia && (g.html.s.prototype.toString = function() {
  return "SafeStyle{" + this.zd + "}";
});
g.html.s.H = function(a) {
  if (a instanceof g.html.s && a.constructor === g.html.s && a.ql === g.html.s.fa) {
    return a.zd;
  }
  g.l.Ca("expected object of type SafeStyle, got '" + a + "'");
  return "type_error:SafeStyle";
};
g.html.s.nc = function(a) {
  return(new g.html.s).yb(a);
};
g.html.s.prototype.yb = function(a) {
  this.zd = a;
  return this;
};
g.html.s.EMPTY = g.html.s.nc("");
g.html.s.Hb = "zClosurez";
g.html.s.create = function(a) {
  var c = "", d;
  for (d in a) {
    if (!/^[-_a-zA-Z0-9]+$/.test(d)) {
      throw Error("Name allows only [-_a-zA-Z0-9], got: " + d);
    }
    var e = a[d];
    null != e && (e instanceof g.b.I ? e = g.b.I.H(e) : g.html.s.Zl.test(e) ? g.html.s.Nn(e) || (g.l.Ca("String value requires balanced quotes, got: " + e), e = g.html.s.Hb) : (g.l.Ca("String value allows only [-,.\"'%_!# a-zA-Z0-9], got: " + e), e = g.html.s.Hb), c += d + ":" + e + ";");
  }
  return c ? g.html.s.nc(c) : g.html.s.EMPTY;
};
g.html.s.Nn = function(a) {
  for (var c = !0, d = !0, e = 0;e < a.length;e++) {
    var f = a.charAt(e);
    "'" == f && d ? c = !c : '"' == f && c && (d = !d);
  }
  return c && d;
};
g.html.s.Zl = /^[-,."'%_!# a-zA-Z0-9]+$/;
g.html.s.concat = function(a) {
  var c = "", d = function(a) {
    g.isArray(a) ? g.a.forEach(a, d) : c += g.html.s.H(a);
  };
  g.a.forEach(arguments, d);
  return c ? g.html.s.nc(c) : g.html.s.EMPTY;
};
g.html.N = function() {
  this.yd = "";
  this.ce = g.html.N.fa;
};
g.html.N.prototype.$a = !0;
g.html.N.fa = {};
g.html.N.concat = function(a) {
  var c = "", d = function(a) {
    g.isArray(a) ? g.a.forEach(a, d) : c += g.html.N.H(a);
  };
  g.a.forEach(arguments, d);
  return g.html.N.Yc(c);
};
g.html.N.pc = function(a) {
  a = g.b.I.H(a);
  return 0 === a.length ? g.html.N.EMPTY : g.html.N.Yc(a);
};
g.html.N.prototype.Za = function() {
  return this.yd;
};
g.ia && (g.html.N.prototype.toString = function() {
  return "SafeStyleSheet{" + this.yd + "}";
});
g.html.N.H = function(a) {
  if (a instanceof g.html.N && a.constructor === g.html.N && a.ce === g.html.N.fa) {
    return a.yd;
  }
  g.l.Ca("expected object of type SafeStyleSheet, got '" + a + "'");
  return "type_error:SafeStyleSheet";
};
g.html.N.Yc = function(a) {
  return(new g.html.N).yb(a);
};
g.html.N.prototype.yb = function(a) {
  this.yd = a;
  return this;
};
g.html.N.EMPTY = g.html.N.Yc("");
g.Ia = {};
g.Ia.url = {};
g.Ia.url.Km = function(a) {
  return g.Ia.url.Sh().createObjectURL(a);
};
g.Ia.url.Uw = function(a) {
  g.Ia.url.Sh().revokeObjectURL(a);
};
g.Ia.url.Sh = function() {
  var a = g.Ia.url.Gh();
  if (null != a) {
    return a;
  }
  throw Error("This browser doesn't seem to support blob URLs");
};
g.Ia.url.Gh = function() {
  return g.W(g.global.URL) && g.W(g.global.URL.createObjectURL) ? g.global.URL : g.W(g.global.webkitURL) && g.W(g.global.webkitURL.createObjectURL) ? g.global.webkitURL : g.W(g.global.createObjectURL) ? g.global : null;
};
g.Ia.url.hu = function() {
  return null != g.Ia.url.Gh();
};
g.html.t = function() {
  this.ab = "";
  this.sl = g.html.t.fa;
};
g.html.t.Hb = "about:invalid#zClosurez";
g.html.t.prototype.$a = !0;
g.html.t.prototype.Za = function() {
  return this.ab;
};
g.html.t.prototype.Oe = !0;
g.html.t.prototype.wb = function() {
  return g.i18n.d.S.Ib;
};
g.ia && (g.html.t.prototype.toString = function() {
  return "SafeUrl{" + this.ab + "}";
});
g.html.t.H = function(a) {
  if (a instanceof g.html.t && a.constructor === g.html.t && a.sl === g.html.t.fa) {
    return a.ab;
  }
  g.l.Ca("expected object of type SafeUrl, got '" + a + "'");
  return "type_error:SafeUrl";
};
g.html.t.pc = function(a) {
  return g.html.t.Zc(g.b.I.H(a));
};
g.html.ol = /^image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)$/i;
g.html.t.lv = function(a) {
  a = g.html.ol.test(a.type) ? g.Ia.url.Km(a) : g.html.t.Hb;
  return g.html.t.Zc(a);
};
g.html.rl = /^(?:(?:https?|mailto|ftp):|[^&:/?#]*(?:[/?#]|$))/i;
g.html.t.vf = function(a) {
  if (a instanceof g.html.t) {
    return a;
  }
  a = a.$a ? a.Za() : String(a);
  a = g.html.rl.test(a) ? g.html.t.Xo(a) : g.html.t.Hb;
  return g.html.t.Zc(a);
};
g.html.t.Xo = function(a) {
  try {
    var c = encodeURI(a);
  } catch (d) {
    return g.html.t.Hb;
  }
  return c.replace(g.html.t.Tk, function(a) {
    return g.html.t.Uk[a];
  });
};
g.html.t.Tk = /[()']|%5B|%5D|%25/g;
g.html.t.Uk = {"'":"%27", "(":"%28", ")":"%29", "%5B":"[", "%5D":"]", "%25":"%"};
g.html.t.fa = {};
g.html.t.Zc = function(a) {
  var c = new g.html.t;
  c.ab = a;
  return c;
};
g.html.ba = function() {
  this.Ad = "";
  this.Il = g.html.ba.fa;
};
g.html.ba.prototype.$a = !0;
g.html.ba.prototype.Za = function() {
  return this.Ad;
};
g.html.ba.prototype.Oe = !0;
g.html.ba.prototype.wb = function() {
  return g.i18n.d.S.Ib;
};
g.ia && (g.html.ba.prototype.toString = function() {
  return "TrustedResourceUrl{" + this.Ad + "}";
});
g.html.ba.H = function(a) {
  if (a instanceof g.html.ba && a.constructor === g.html.ba && a.Il === g.html.ba.fa) {
    return a.Ad;
  }
  g.l.Ca("expected object of type TrustedResourceUrl, got '" + a + "'");
  return "type_error:TrustedResourceUrl";
};
g.html.ba.pc = function(a) {
  return g.html.ba.rh(g.b.I.H(a));
};
g.html.ba.fa = {};
g.html.ba.rh = function(a) {
  var c = new g.html.ba;
  c.Ad = a;
  return c;
};
g.html.h = function() {
  this.ab = "";
  this.pl = g.html.h.fa;
  this.cd = null;
};
g.html.h.prototype.Oe = !0;
g.html.h.prototype.wb = function() {
  return this.cd;
};
g.html.h.prototype.$a = !0;
g.html.h.prototype.Za = function() {
  return this.ab;
};
g.ia && (g.html.h.prototype.toString = function() {
  return "SafeHtml{" + this.ab + "}";
});
g.html.h.H = function(a) {
  if (a instanceof g.html.h && a.constructor === g.html.h && a.pl === g.html.h.fa) {
    return a.ab;
  }
  g.l.Ca("expected object of type SafeHtml, got '" + a + "'");
  return "type_error:SafeHtml";
};
g.html.h.Ra = function(a) {
  if (a instanceof g.html.h) {
    return a;
  }
  var c = null;
  a.Oe && (c = a.wb());
  return g.html.h.hb(g.b.Ra(a.$a ? a.Za() : String(a)), c);
};
g.html.h.Kv = function(a) {
  if (a instanceof g.html.h) {
    return a;
  }
  a = g.html.h.Ra(a);
  return g.html.h.hb(g.b.vi(g.html.h.H(a)), a.wb());
};
g.html.h.Ne = function(a) {
  if (a instanceof g.html.h) {
    return a;
  }
  a = g.html.h.Ra(a);
  return g.html.h.hb(g.b.wq(g.html.h.H(a)), a.wb());
};
g.html.h.Ee = g.html.h.Ra;
g.html.h.Tg = /^[a-zA-Z0-9-]+$/;
g.html.h.Ul = g.object.$c("action", "cite", "data", "formaction", "href", "manifest", "poster", "src");
g.html.h.Vk = g.object.$c("embed", "iframe", "link", "object", "script", "style", "template");
g.html.h.create = function(a, c, d) {
  if (!g.html.h.Tg.test(a)) {
    throw Error("Invalid tag name <" + a + ">.");
  }
  if (a.toLowerCase() in g.html.h.Vk) {
    throw Error("Tag name <" + a + "> is not allowed for SafeHtml.");
  }
  return g.html.h.te(a, c, d);
};
g.html.h.Ju = function(a, c, d, e) {
  var f = {};
  f.src = a || null;
  f.srcdoc = c || null;
  a = g.html.h.mh(f, {sandbox:""}, d);
  return g.html.h.te("iframe", a, e);
};
g.html.h.Lu = function(a, c) {
  var d = g.html.h.mh({type:"text/css"}, {}, c), e = "";
  a = g.a.concat(a);
  for (var f = 0;f < a.length;f++) {
    e += g.html.N.H(a[f]);
  }
  e = g.html.h.hb(e, g.i18n.d.S.eb);
  return g.html.h.te("style", d, e);
};
g.html.h.nn = function(a, c, d) {
  if (d instanceof g.b.I) {
    d = g.b.I.H(d);
  } else {
    if ("style" == c.toLowerCase()) {
      d = g.html.h.Hn(d);
    } else {
      if (/^on/i.test(c)) {
        throw Error('Attribute "' + c + '" requires goog.string.Const value, "' + d + '" given.');
      }
      if (c.toLowerCase() in g.html.h.Ul) {
        if (d instanceof g.html.ba) {
          d = g.html.ba.H(d);
        } else {
          if (d instanceof g.html.t) {
            d = g.html.t.H(d);
          } else {
            throw Error('Attribute "' + c + '" on tag "' + a + '" requires goog.html.SafeUrl or goog.string.Const value, "' + d + '" given.');
          }
        }
      }
    }
  }
  d.$a && (d = d.Za());
  return c + '="' + g.b.Ra(String(d)) + '"';
};
g.html.h.Hn = function(a) {
  if (!g.isObject(a)) {
    throw Error('The "style" attribute requires goog.html.SafeStyle or map of style properties, ' + typeof a + " given: " + a);
  }
  a instanceof g.html.s || (a = g.html.s.create(a));
  return g.html.s.H(a);
};
g.html.h.Nu = function(a, c, d, e) {
  c = g.html.h.create(c, d, e);
  c.cd = a;
  return c;
};
g.html.h.concat = function(a) {
  var c = g.i18n.d.S.eb, d = "", e = function(a) {
    g.isArray(a) ? g.a.forEach(a, e) : (a = g.html.h.Ra(a), d += g.html.h.H(a), a = a.wb(), c == g.i18n.d.S.eb ? c = a : a != g.i18n.d.S.eb && c != a && (c = null));
  };
  g.a.forEach(arguments, e);
  return g.html.h.hb(d, c);
};
g.html.h.Fu = function(a, c) {
  var d = g.html.h.concat(g.a.slice(arguments, 1));
  d.cd = a;
  return d;
};
g.html.h.fa = {};
g.html.h.hb = function(a, c) {
  return(new g.html.h).yb(a, c);
};
g.html.h.prototype.yb = function(a, c) {
  this.ab = a;
  this.cd = c;
  return this;
};
g.html.h.te = function(a, c, d) {
  var e = null, f = "<" + a;
  if (c) {
    for (var h in c) {
      if (!g.html.h.Tg.test(h)) {
        throw Error('Invalid attribute name "' + h + '".');
      }
      var l = c[h];
      g.O(l) && (f += " " + g.html.h.nn(a, h, l));
    }
  }
  g.W(d) ? g.isArray(d) || (d = [d]) : d = [];
  g.vb.tags.wo(a.toLowerCase()) ? f += ">" : (e = g.html.h.concat(d), f += ">" + g.html.h.H(e) + "</" + a + ">", e = e.wb());
  (a = c && c.dir) && (e = /^(ltr|rtl|auto)$/i.test(a) ? g.i18n.d.S.eb : null);
  return g.html.h.hb(f, e);
};
g.html.h.mh = function(a, c, d) {
  var e = {}, f;
  for (f in a) {
    e[f] = a[f];
  }
  for (f in c) {
    e[f] = c[f];
  }
  for (f in d) {
    var h = f.toLowerCase();
    if (h in a) {
      throw Error('Cannot override "' + h + '" attribute, got "' + f + '" with value "' + d[f] + '"');
    }
    h in c && delete e[h];
    e[f] = d[f];
  }
  return e;
};
g.html.h.EMPTY = g.html.h.hb("", g.i18n.d.S.eb);
g.html.aa = function() {
  this.xd = "";
  this.ce = g.html.aa.fa;
};
g.html.aa.prototype.$a = !0;
g.html.aa.fa = {};
g.html.aa.pc = function(a) {
  a = g.b.I.H(a);
  return 0 === a.length ? g.html.aa.EMPTY : g.html.aa.ue(a);
};
g.html.aa.prototype.Za = function() {
  return this.xd;
};
g.ia && (g.html.aa.prototype.toString = function() {
  return "SafeScript{" + this.xd + "}";
});
g.html.aa.H = function(a) {
  if (a instanceof g.html.aa && a.constructor === g.html.aa && a.ce === g.html.aa.fa) {
    return a.xd;
  }
  g.l.Ca("expected object of type SafeScript, got '" + a + "'");
  return "type_error:SafeScript";
};
g.html.aa.ue = function(a) {
  return(new g.html.aa).yb(a);
};
g.html.aa.prototype.yb = function(a) {
  this.xd = a;
  return this;
};
g.html.aa.EMPTY = g.html.aa.ue("");
g.html.Cb = {};
g.html.Cb.Yw = function(a, c, d) {
  return g.html.h.hb(c, d || null);
};
g.html.Cb.Zw = function(a, c) {
  return g.html.aa.ue(c);
};
g.html.Cb.$w = function(a, c) {
  return g.html.s.nc(c);
};
g.html.Cb.ax = function(a, c) {
  return g.html.N.Yc(c);
};
g.html.Cb.Ip = function(a, c) {
  return g.html.t.Zc(c);
};
g.html.Cb.Dx = function(a, c) {
  return g.html.ba.rh(c);
};
g.g = {};
g.g.br = function() {
};
g.G = {};
g.G.constant = function(a) {
  return function() {
    return a;
  };
};
g.G.rr = g.G.constant(!1);
g.G.Bt = g.G.constant(!0);
g.G.at = g.G.constant(null);
g.G.identity = function(a) {
  return a;
};
g.G.error = function(a) {
  return function() {
    throw Error(a);
  };
};
g.G.Ca = function(a) {
  return function() {
    throw a;
  };
};
g.G.uw = function(a, c) {
  c = c || 0;
  return function() {
    return a.apply(this, Array.prototype.slice.call(arguments, 0, c));
  };
};
g.G.Iw = function(a) {
  return function() {
    return arguments[a];
  };
};
g.G.Nx = function(a, c) {
  return g.G.Np(a, g.G.constant(c));
};
g.G.bv = function(a, c) {
  return function(d) {
    return c ? a == d : a === d;
  };
};
g.G.Du = function(a, c) {
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
g.G.Np = function(a) {
  var c = arguments, d = c.length;
  return function() {
    for (var a, f = 0;f < d;f++) {
      a = c[f].apply(this, arguments);
    }
    return a;
  };
};
g.G.St = function(a) {
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
g.G.Lw = function(a) {
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
g.G.Yo = function(a) {
  return function() {
    return!a.apply(this, arguments);
  };
};
g.G.create = function(a, c) {
  var d = function() {
  };
  d.prototype = a.prototype;
  d = new d;
  a.apply(d, Array.prototype.slice.call(arguments, 1));
  return d;
};
g.G.qj = !0;
g.G.lu = function(a) {
  var c = !1, d;
  return function() {
    if (!g.G.qj) {
      return a();
    }
    c || (d = a(), c = !0);
    return d;
  };
};
g.r = {};
g.r.Pw = function(a) {
  return Math.floor(Math.random() * a);
};
g.r.Fx = function(a, c) {
  return a + Math.random() * (c - a);
};
g.r.wu = function(a, c, d) {
  return Math.min(Math.max(a, c), d);
};
g.r.ti = function(a, c) {
  var d = a % c;
  return 0 > d * c ? d + c : d;
};
g.r.sw = function(a, c, d) {
  return a + d * (c - a);
};
g.r.Dw = function(a, c, d) {
  return Math.abs(a - c) <= (d || 1E-6);
};
g.r.Cf = function(a) {
  return g.r.ti(a, 360);
};
g.r.px = function(a) {
  return g.r.ti(a, 2 * Math.PI);
};
g.r.Ui = function(a) {
  return a * Math.PI / 180;
};
g.r.mq = function(a) {
  return 180 * a / Math.PI;
};
g.r.Vt = function(a, c) {
  return c * Math.cos(g.r.Ui(a));
};
g.r.Wt = function(a, c) {
  return c * Math.sin(g.r.Ui(a));
};
g.r.Tt = function(a, c, d, e) {
  return g.r.Cf(g.r.mq(Math.atan2(e - c, d - a)));
};
g.r.Ut = function(a, c) {
  var d = g.r.Cf(c) - g.r.Cf(a);
  180 < d ? d -= 360 : -180 >= d && (d = 360 + d);
  return d;
};
g.r.sign = function(a) {
  return 0 == a ? 0 : 0 > a ? -1 : 1;
};
g.r.xw = function(a, c, d, e) {
  d = d || function(a, c) {
    return a == c;
  };
  e = e || function(c) {
    return a[c];
  };
  for (var f = a.length, h = c.length, l = [], m = 0;m < f + 1;m++) {
    l[m] = [], l[m][0] = 0;
  }
  for (var n = 0;n < h + 1;n++) {
    l[0][n] = 0;
  }
  for (m = 1;m <= f;m++) {
    for (n = 1;n <= h;n++) {
      d(a[m - 1], c[n - 1]) ? l[m][n] = l[m - 1][n - 1] + 1 : l[m][n] = Math.max(l[m - 1][n], l[m][n - 1]);
    }
  }
  for (var p = [], m = f, n = h;0 < m && 0 < n;) {
    d(a[m - 1], c[n - 1]) ? (p.unshift(e(m - 1, n - 1)), m--, n--) : l[m - 1][n] > l[m][n - 1] ? m-- : n--;
  }
  return p;
};
g.r.Ri = function(a) {
  return g.a.reduce(arguments, function(a, d) {
    return a + d;
  }, 0);
};
g.r.rm = function(a) {
  return g.r.Ri.apply(null, arguments) / arguments.length;
};
g.r.Jp = function(a) {
  var c = arguments.length;
  if (2 > c) {
    return 0;
  }
  var d = g.r.rm.apply(null, arguments);
  return g.r.Ri.apply(null, g.a.map(arguments, function(a) {
    return Math.pow(a - d, 2);
  })) / (c - 1);
};
g.r.qx = function(a) {
  return Math.sqrt(g.r.Jp.apply(null, arguments));
};
g.r.aw = function(a) {
  return isFinite(a) && 0 == a % 1;
};
g.r.Yv = function(a) {
  return isFinite(a) && !isNaN(a);
};
g.r.vw = function(a) {
  if (0 < a) {
    var c = Math.round(Math.log(a) * Math.LOG10E);
    return c - (parseFloat("1e" + c) > a);
  }
  return 0 == a ? -Infinity : NaN;
};
g.r.Xw = function(a, c) {
  return Math.floor(a + (c || 2E-15));
};
g.r.Ww = function(a, c) {
  return Math.ceil(a - (c || 2E-15));
};
g.e = {};
g.e.ea = "StopIteration" in g.global ? g.global.StopIteration : Error("StopIteration");
g.e.Iterator = function() {
};
g.e.Iterator.prototype.next = function() {
  throw g.e.ea;
};
g.e.Iterator.prototype.Lb = function() {
  return this;
};
g.e.P = function(a) {
  if (a instanceof g.e.Iterator) {
    return a;
  }
  if ("function" == typeof a.Lb) {
    return a.Lb(!1);
  }
  if (g.V(a)) {
    var c = 0, d = new g.e.Iterator;
    d.next = function() {
      for (;;) {
        if (c >= a.length) {
          throw g.e.ea;
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
g.e.forEach = function(a, c, d) {
  if (g.V(a)) {
    try {
      g.a.forEach(a, c, d);
    } catch (e) {
      if (e !== g.e.ea) {
        throw e;
      }
    }
  } else {
    a = g.e.P(a);
    try {
      for (;;) {
        c.call(d, a.next(), void 0, a);
      }
    } catch (f) {
      if (f !== g.e.ea) {
        throw f;
      }
    }
  }
};
g.e.filter = function(a, c, d) {
  var e = g.e.P(a);
  a = new g.e.Iterator;
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
g.e.fv = function(a, c, d) {
  return g.e.filter(a, g.G.Yo(c), d);
};
g.e.Bd = function(a, c, d) {
  var e = 0, f = a, h = d || 1;
  1 < arguments.length && (e = a, f = c);
  if (0 == h) {
    throw Error("Range step argument must not be zero");
  }
  var l = new g.e.Iterator;
  l.next = function() {
    if (0 < h && e >= f || 0 > h && e <= f) {
      throw g.e.ea;
    }
    var a = e;
    e += h;
    return a;
  };
  return l;
};
g.e.join = function(a, c) {
  return g.e.nb(a).join(c);
};
g.e.map = function(a, c, d) {
  var e = g.e.P(a);
  a = new g.e.Iterator;
  a.next = function() {
    var a = e.next();
    return c.call(d, a, void 0, e);
  };
  return a;
};
g.e.reduce = function(a, c, d, e) {
  var f = d;
  g.e.forEach(a, function(a) {
    f = c.call(e, f, a);
  });
  return f;
};
g.e.some = function(a, c, d) {
  a = g.e.P(a);
  try {
    for (;;) {
      if (c.call(d, a.next(), void 0, a)) {
        return!0;
      }
    }
  } catch (e) {
    if (e !== g.e.ea) {
      throw e;
    }
  }
  return!1;
};
g.e.every = function(a, c, d) {
  a = g.e.P(a);
  try {
    for (;;) {
      if (!c.call(d, a.next(), void 0, a)) {
        return!1;
      }
    }
  } catch (e) {
    if (e !== g.e.ea) {
      throw e;
    }
  }
  return!0;
};
g.e.su = function(a) {
  return g.e.Cm(arguments);
};
g.e.Cm = function(a) {
  var c = g.e.P(a);
  a = new g.e.Iterator;
  var d = null;
  a.next = function() {
    for (;;) {
      if (null == d) {
        var a = c.next();
        d = g.e.P(a);
      }
      try {
        return d.next();
      } catch (f) {
        if (f !== g.e.ea) {
          throw f;
        }
        d = null;
      }
    }
  };
  return a;
};
g.e.Tu = function(a, c, d) {
  var e = g.e.P(a);
  a = new g.e.Iterator;
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
g.e.wx = function(a, c, d) {
  var e = g.e.P(a);
  a = new g.e.Iterator;
  a.next = function() {
    var a = e.next();
    if (c.call(d, a, void 0, e)) {
      return a;
    }
    throw g.e.ea;
  };
  return a;
};
g.e.nb = function(a) {
  if (g.V(a)) {
    return g.a.nb(a);
  }
  a = g.e.P(a);
  var c = [];
  g.e.forEach(a, function(a) {
    c.push(a);
  });
  return c;
};
g.e.equals = function(a, c, d) {
  a = g.e.zq({}, a, c);
  var e = d || g.a.wh;
  return g.e.every(a, function(a) {
    return e(a[0], a[1]);
  });
};
g.e.To = function(a, c) {
  try {
    return g.e.P(a).next();
  } catch (d) {
    if (d != g.e.ea) {
      throw d;
    }
    return c;
  }
};
g.e.product = function(a) {
  if (g.a.some(arguments, function(a) {
    return!a.length;
  }) || !arguments.length) {
    return new g.e.Iterator;
  }
  var c = new g.e.Iterator, d = arguments, e = g.a.repeat(0, d.length);
  c.next = function() {
    if (e) {
      for (var a = g.a.map(e, function(a, c) {
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
    throw g.e.ea;
  };
  return c;
};
g.e.Ou = function(a) {
  var c = g.e.P(a), d = [], e = 0;
  a = new g.e.Iterator;
  var f = !1;
  a.next = function() {
    var a = null;
    if (!f) {
      try {
        return a = c.next(), d.push(a), a;
      } catch (l) {
        if (l != g.e.ea || g.a.wa(d)) {
          throw l;
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
g.e.count = function(a, c) {
  var d = a || 0, e = g.W(c) ? c : 1, f = new g.e.Iterator;
  f.next = function() {
    var a = d;
    d += e;
    return a;
  };
  return f;
};
g.e.repeat = function(a) {
  var c = new g.e.Iterator;
  c.next = g.G.constant(a);
  return c;
};
g.e.Qt = function(a) {
  var c = g.e.P(a), d = 0;
  a = new g.e.Iterator;
  a.next = function() {
    return d += c.next();
  };
  return a;
};
g.e.gj = function(a) {
  var c = arguments, d = new g.e.Iterator;
  if (0 < c.length) {
    var e = g.a.map(c, g.e.P);
    d.next = function() {
      return g.a.map(e, function(a) {
        return a.next();
      });
    };
  }
  return d;
};
g.e.zq = function(a, c) {
  var d = g.a.slice(arguments, 1), e = new g.e.Iterator;
  if (0 < d.length) {
    var f = g.a.map(d, g.e.P);
    e.next = function() {
      var c = !1, d = g.a.map(f, function(d) {
        var e;
        try {
          e = d.next(), c = !0;
        } catch (f) {
          if (f !== g.e.ea) {
            throw f;
          }
          e = a;
        }
        return e;
      });
      if (!c) {
        throw g.e.ea;
      }
      return d;
    };
  }
  return e;
};
g.e.Eu = function(a, c) {
  var d = g.e.P(c);
  return g.e.filter(a, function() {
    return!!d.next();
  });
};
g.e.Ic = function(a, c) {
  this.iterator = g.e.P(a);
  this.ni = c || g.G.identity;
};
g.Sa(g.e.Ic, g.e.Iterator);
g.e.Ic.prototype.next = function() {
  for (;this.oc == this.Si;) {
    this.ad = this.iterator.next(), this.oc = this.ni(this.ad);
  }
  this.Si = this.oc;
  return[this.oc, this.Mn(this.Si)];
};
g.e.Ic.prototype.Mn = function(a) {
  for (var c = [];this.oc == a;) {
    c.push(this.ad);
    try {
      this.ad = this.iterator.next();
    } catch (d) {
      if (d !== g.e.ea) {
        throw d;
      }
      break;
    }
    this.oc = this.ni(this.ad);
  }
  return c;
};
g.e.Cv = function(a, c) {
  return new g.e.Ic(a, c);
};
g.e.rx = function(a, c, d) {
  var e = g.e.P(a);
  a = new g.e.Iterator;
  a.next = function() {
    var a = g.e.nb(e.next());
    return c.apply(d, g.a.concat(a, void 0, e));
  };
  return a;
};
g.e.xx = function(a, c) {
  var d = g.e.P(a), e = g.isNumber(c) ? c : 2, f = g.a.map(g.a.Bd(e), function() {
    return[];
  }), h = function() {
    var a = d.next();
    g.a.forEach(f, function(c) {
      c.push(a);
    });
  };
  return g.a.map(f, function(a) {
    var c = new g.e.Iterator;
    c.next = function() {
      g.a.wa(a) && h();
      return a.shift();
    };
    return c;
  });
};
g.e.av = function(a, c) {
  return g.e.gj(g.e.count(c), a);
};
g.e.limit = function(a, c) {
  var d = g.e.P(a), e = new g.e.Iterator, f = c;
  e.next = function() {
    if (0 < f--) {
      return d.next();
    }
    throw g.e.ea;
  };
  return e;
};
g.e.Jm = function(a, c) {
  for (var d = g.e.P(a);0 < c--;) {
    g.e.To(d, null);
  }
  return d;
};
g.e.slice = function(a, c, d) {
  a = g.e.Jm(a, c);
  g.isNumber(d) && (a = g.e.limit(a, d - c));
  return a;
};
g.e.On = function(a) {
  var c = [];
  g.a.qp(a, c);
  return a.length != c.length;
};
g.e.lp = function(a, c) {
  var d = g.e.nb(a), e = g.isNumber(c) ? c : d.length, d = g.a.repeat(d, e), d = g.e.product.apply(void 0, d);
  return g.e.filter(d, function(a) {
    return!g.e.On(a);
  });
};
g.e.Au = function(a, c) {
  function d(a) {
    return e[a];
  }
  var e = g.e.nb(a), f = g.e.Bd(e.length), f = g.e.lp(f, c), h = g.e.filter(f, function(a) {
    return g.a.ii(a);
  }), f = new g.e.Iterator;
  f.next = function() {
    return g.a.map(h.next(), d);
  };
  return f;
};
g.e.Bu = function(a, c) {
  function d(a) {
    return e[a];
  }
  var e = g.e.nb(a), f = g.a.Bd(e.length), f = g.a.repeat(f, c), f = g.e.product.apply(void 0, f), h = g.e.filter(f, function(a) {
    return g.a.ii(a);
  }), f = new g.e.Iterator;
  f.next = function() {
    return g.a.map(h.next(), d);
  };
  return f;
};
g.g.Map = function(a, c) {
  this.w = {};
  this.L = [];
  this.Db = this.Xa = 0;
  var d = arguments.length;
  if (1 < d) {
    if (d % 2) {
      throw Error("Uneven number of arguments");
    }
    for (var e = 0;e < d;e += 2) {
      this.set(arguments[e], arguments[e + 1]);
    }
  } else {
    a && this.ke(a);
  }
};
b = g.g.Map.prototype;
b.ua = function() {
  return this.Xa;
};
b.U = function() {
  this.Mb();
  for (var a = [], c = 0;c < this.L.length;c++) {
    a.push(this.w[this.L[c]]);
  }
  return a;
};
b.va = function() {
  this.Mb();
  return this.L.concat();
};
b.se = function(a) {
  return g.g.Map.xb(this.w, a);
};
b.Ob = function(a) {
  for (var c = 0;c < this.L.length;c++) {
    var d = this.L[c];
    if (g.g.Map.xb(this.w, d) && this.w[d] == a) {
      return!0;
    }
  }
  return!1;
};
b.equals = function(a, c) {
  if (this === a) {
    return!0;
  }
  if (this.Xa != a.ua()) {
    return!1;
  }
  var d = c || g.g.Map.Um;
  this.Mb();
  for (var e, f = 0;e = this.L[f];f++) {
    if (!d(this.get(e), a.get(e))) {
      return!1;
    }
  }
  return!0;
};
g.g.Map.Um = function(a, c) {
  return a === c;
};
b = g.g.Map.prototype;
b.wa = function() {
  return 0 == this.Xa;
};
b.clear = function() {
  this.w = {};
  this.Db = this.Xa = this.L.length = 0;
};
b.remove = function(a) {
  return g.g.Map.xb(this.w, a) ? (delete this.w[a], this.Xa--, this.Db++, this.L.length > 2 * this.Xa && this.Mb(), !0) : !1;
};
b.Mb = function() {
  if (this.Xa != this.L.length) {
    for (var a = 0, c = 0;a < this.L.length;) {
      var d = this.L[a];
      g.g.Map.xb(this.w, d) && (this.L[c++] = d);
      a++;
    }
    this.L.length = c;
  }
  if (this.Xa != this.L.length) {
    for (var e = {}, c = a = 0;a < this.L.length;) {
      d = this.L[a], g.g.Map.xb(e, d) || (this.L[c++] = d, e[d] = 1), a++;
    }
    this.L.length = c;
  }
};
b.get = function(a, c) {
  return g.g.Map.xb(this.w, a) ? this.w[a] : c;
};
b.set = function(a, c) {
  g.g.Map.xb(this.w, a) || (this.Xa++, this.L.push(a), this.Db++);
  this.w[a] = c;
};
b.ke = function(a) {
  var c;
  a instanceof g.g.Map ? (c = a.va(), a = a.U()) : (c = g.object.va(a), a = g.object.U(a));
  for (var d = 0;d < c.length;d++) {
    this.set(c[d], a[d]);
  }
};
b.forEach = function(a, c) {
  for (var d = this.va(), e = 0;e < d.length;e++) {
    var f = d[e], h = this.get(f);
    a.call(c, h, f, this);
  }
};
b.clone = function() {
  return new g.g.Map(this);
};
b.Vi = function() {
  for (var a = new g.g.Map, c = 0;c < this.L.length;c++) {
    var d = this.L[c];
    a.set(this.w[d], d);
  }
  return a;
};
b.oq = function() {
  this.Mb();
  for (var a = {}, c = 0;c < this.L.length;c++) {
    var d = this.L[c];
    a[d] = this.w[d];
  }
  return a;
};
b.Lb = function(a) {
  this.Mb();
  var c = 0, d = this.L, e = this.w, f = this.Db, h = this, l = new g.e.Iterator;
  l.next = function() {
    for (;;) {
      if (f != h.Db) {
        throw Error("The map has changed since the iterator was created");
      }
      if (c >= d.length) {
        throw g.e.ea;
      }
      var l = d[c++];
      return a ? l : e[l];
    }
  };
  return l;
};
g.g.Map.xb = function(a, c) {
  return Object.prototype.hasOwnProperty.call(a, c);
};
g.g.ua = function(a) {
  return "function" == typeof a.ua ? a.ua() : g.V(a) || g.isString(a) ? a.length : g.object.ua(a);
};
g.g.U = function(a) {
  if ("function" == typeof a.U) {
    return a.U();
  }
  if (g.isString(a)) {
    return a.split("");
  }
  if (g.V(a)) {
    for (var c = [], d = a.length, e = 0;e < d;e++) {
      c.push(a[e]);
    }
    return c;
  }
  return g.object.U(a);
};
g.g.va = function(a) {
  if ("function" == typeof a.va) {
    return a.va();
  }
  if ("function" != typeof a.U) {
    if (g.V(a) || g.isString(a)) {
      var c = [];
      a = a.length;
      for (var d = 0;d < a;d++) {
        c.push(d);
      }
      return c;
    }
    return g.object.va(a);
  }
};
g.g.contains = function(a, c) {
  return "function" == typeof a.contains ? a.contains(c) : "function" == typeof a.Ob ? a.Ob(c) : g.V(a) || g.isString(a) ? g.a.contains(a, c) : g.object.Ob(a, c);
};
g.g.wa = function(a) {
  return "function" == typeof a.wa ? a.wa() : g.V(a) || g.isString(a) ? g.a.wa(a) : g.object.wa(a);
};
g.g.clear = function(a) {
  "function" == typeof a.clear ? a.clear() : g.V(a) ? g.a.clear(a) : g.object.clear(a);
};
g.g.forEach = function(a, c, d) {
  if ("function" == typeof a.forEach) {
    a.forEach(c, d);
  } else {
    if (g.V(a) || g.isString(a)) {
      g.a.forEach(a, c, d);
    } else {
      for (var e = g.g.va(a), f = g.g.U(a), h = f.length, l = 0;l < h;l++) {
        c.call(d, f[l], e && e[l], a);
      }
    }
  }
};
g.g.filter = function(a, c, d) {
  if ("function" == typeof a.filter) {
    return a.filter(c, d);
  }
  if (g.V(a) || g.isString(a)) {
    return g.a.filter(a, c, d);
  }
  var e, f = g.g.va(a), h = g.g.U(a), l = h.length;
  if (f) {
    e = {};
    for (var m = 0;m < l;m++) {
      c.call(d, h[m], f[m], a) && (e[f[m]] = h[m]);
    }
  } else {
    for (e = [], m = 0;m < l;m++) {
      c.call(d, h[m], void 0, a) && e.push(h[m]);
    }
  }
  return e;
};
g.g.map = function(a, c, d) {
  if ("function" == typeof a.map) {
    return a.map(c, d);
  }
  if (g.V(a) || g.isString(a)) {
    return g.a.map(a, c, d);
  }
  var e, f = g.g.va(a), h = g.g.U(a), l = h.length;
  if (f) {
    e = {};
    for (var m = 0;m < l;m++) {
      e[f[m]] = c.call(d, h[m], f[m], a);
    }
  } else {
    for (e = [], m = 0;m < l;m++) {
      e[m] = c.call(d, h[m], void 0, a);
    }
  }
  return e;
};
g.g.some = function(a, c, d) {
  if ("function" == typeof a.some) {
    return a.some(c, d);
  }
  if (g.V(a) || g.isString(a)) {
    return g.a.some(a, c, d);
  }
  for (var e = g.g.va(a), f = g.g.U(a), h = f.length, l = 0;l < h;l++) {
    if (c.call(d, f[l], e && e[l], a)) {
      return!0;
    }
  }
  return!1;
};
g.g.every = function(a, c, d) {
  if ("function" == typeof a.every) {
    return a.every(c, d);
  }
  if (g.V(a) || g.isString(a)) {
    return g.a.every(a, c, d);
  }
  for (var e = g.g.va(a), f = g.g.U(a), h = f.length, l = 0;l < h;l++) {
    if (!c.call(d, f[l], e && e[l], a)) {
      return!1;
    }
  }
  return!0;
};
g.g.Set = function(a) {
  this.w = new g.g.Map;
  a && this.ke(a);
};
g.g.Set.He = function(a) {
  var c = typeof a;
  return "object" == c && a || "function" == c ? "o" + g.Le(a) : c.substr(0, 1) + a;
};
b = g.g.Set.prototype;
b.ua = function() {
  return this.w.ua();
};
b.add = function(a) {
  this.w.set(g.g.Set.He(a), a);
};
b.ke = function(a) {
  a = g.g.U(a);
  for (var c = a.length, d = 0;d < c;d++) {
    this.add(a[d]);
  }
};
b.removeAll = function(a) {
  a = g.g.U(a);
  for (var c = a.length, d = 0;d < c;d++) {
    this.remove(a[d]);
  }
};
b.remove = function(a) {
  return this.w.remove(g.g.Set.He(a));
};
b.clear = function() {
  this.w.clear();
};
b.wa = function() {
  return this.w.wa();
};
b.contains = function(a) {
  return this.w.se(g.g.Set.He(a));
};
b.U = function() {
  return this.w.U();
};
b.clone = function() {
  return new g.g.Set(this);
};
b.equals = function(a) {
  return this.ua() == g.g.ua(a) && this.pd(a);
};
b.pd = function(a) {
  var c = g.g.ua(a);
  if (this.ua() > c) {
    return!1;
  }
  !(a instanceof g.g.Set) && 5 < c && (a = new g.g.Set(a));
  return g.g.every(this, function(c) {
    return g.g.contains(a, c);
  });
};
b.Lb = function() {
  return this.w.Lb(!1);
};
g.c = {};
g.c.userAgent = {};
g.c.userAgent.n = {};
g.c.userAgent.n.Oh = function() {
  var a = g.c.userAgent.n.xn();
  return a && (a = a.userAgent) ? a : "";
};
g.c.userAgent.n.xn = function() {
  return g.global.navigator;
};
g.c.userAgent.n.bj = g.c.userAgent.n.Oh();
g.c.userAgent.n.ix = function(a) {
  g.c.userAgent.n.bj = a || g.c.userAgent.n.Oh();
};
g.c.userAgent.n.Rb = function() {
  return g.c.userAgent.n.bj;
};
g.c.userAgent.n.C = function(a) {
  return g.b.contains(g.c.userAgent.n.Rb(), a);
};
g.c.userAgent.n.Po = function(a) {
  return g.b.Bm(g.c.userAgent.n.Rb(), a);
};
g.c.userAgent.n.Dh = function(a) {
  for (var c = /(\w[\w ]+)\/([^\s]+)\s*(?:\((.*?)\))?/g, d = [], e;e = c.exec(a);) {
    d.push([e[1], e[2], e[3] || void 0]);
  }
  return d;
};
g.c.userAgent.browser = {};
g.c.userAgent.browser.ff = function() {
  return g.c.userAgent.n.C("Opera") || g.c.userAgent.n.C("OPR");
};
g.c.userAgent.browser.ef = function() {
  return g.c.userAgent.n.C("Edge") || g.c.userAgent.n.C("Trident") || g.c.userAgent.n.C("MSIE");
};
g.c.userAgent.browser.No = function() {
  return g.c.userAgent.n.C("Firefox");
};
g.c.userAgent.browser.qi = function() {
  return g.c.userAgent.n.C("Safari") && !(g.c.userAgent.browser.cf() || g.c.userAgent.browser.df() || g.c.userAgent.browser.ff() || g.c.userAgent.browser.ef() || g.c.userAgent.browser.hi() || g.c.userAgent.n.C("Android"));
};
g.c.userAgent.browser.df = function() {
  return g.c.userAgent.n.C("Coast");
};
g.c.userAgent.browser.Oo = function() {
  return(g.c.userAgent.n.C("iPad") || g.c.userAgent.n.C("iPhone")) && !g.c.userAgent.browser.qi() && !g.c.userAgent.browser.cf() && !g.c.userAgent.browser.df() && g.c.userAgent.n.C("AppleWebKit");
};
g.c.userAgent.browser.cf = function() {
  return(g.c.userAgent.n.C("Chrome") || g.c.userAgent.n.C("CriOS")) && !g.c.userAgent.browser.ff() && !g.c.userAgent.browser.ef();
};
g.c.userAgent.browser.Mo = function() {
  return g.c.userAgent.n.C("Android") && !(g.c.userAgent.browser.Qe() || g.c.userAgent.browser.bi() || g.c.userAgent.browser.Xe() || g.c.userAgent.browser.hi());
};
g.c.userAgent.browser.Xe = g.c.userAgent.browser.ff;
g.c.userAgent.browser.Se = g.c.userAgent.browser.ef;
g.c.userAgent.browser.bi = g.c.userAgent.browser.No;
g.c.userAgent.browser.ro = g.c.userAgent.browser.qi;
g.c.userAgent.browser.Sv = g.c.userAgent.browser.df;
g.c.userAgent.browser.bw = g.c.userAgent.browser.Oo;
g.c.userAgent.browser.Qe = g.c.userAgent.browser.cf;
g.c.userAgent.browser.Yn = g.c.userAgent.browser.Mo;
g.c.userAgent.browser.hi = function() {
  return g.c.userAgent.n.C("Silk");
};
g.c.userAgent.browser.Sb = function() {
  function a(a) {
    a = g.a.find(a, e);
    return d[a] || "";
  }
  var c = g.c.userAgent.n.Rb();
  if (g.c.userAgent.browser.Se()) {
    return g.c.userAgent.browser.un(c);
  }
  var c = g.c.userAgent.n.Dh(c), d = {};
  g.a.forEach(c, function(a) {
    d[a[0]] = a[1];
  });
  var e = g.yc(g.object.se, d);
  return g.c.userAgent.browser.Xe() ? a(["Version", "Opera", "OPR"]) : g.c.userAgent.browser.Qe() ? a(["Chrome", "CriOS"]) : (c = c[2]) && c[1] || "";
};
g.c.userAgent.browser.wc = function(a) {
  return 0 <= g.b.Nb(g.c.userAgent.browser.Sb(), a);
};
g.c.userAgent.browser.un = function(a) {
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
g.c.userAgent.K = {};
g.c.userAgent.K.no = function() {
  return g.c.userAgent.n.C("Presto");
};
g.c.userAgent.K.to = function() {
  return g.c.userAgent.n.C("Trident") || g.c.userAgent.n.C("MSIE");
};
g.c.userAgent.K.Ab = function() {
  return g.c.userAgent.n.C("Edge");
};
g.c.userAgent.K.li = function() {
  return g.c.userAgent.n.Po("WebKit") && !g.c.userAgent.K.Ab();
};
g.c.userAgent.K.co = function() {
  return g.c.userAgent.n.C("Gecko") && !g.c.userAgent.K.li() && !g.c.userAgent.K.to() && !g.c.userAgent.K.Ab();
};
g.c.userAgent.K.Sb = function() {
  var a = g.c.userAgent.n.Rb();
  if (a) {
    var a = g.c.userAgent.n.Dh(a), c = g.c.userAgent.K.qn(a);
    if (c) {
      return "Gecko" == c[0] ? g.c.userAgent.K.Jn(a, "Firefox") : c[1];
    }
    var a = a[0], d;
    if (a && (d = a[2]) && (d = /Trident\/([^\s;]+)/.exec(d))) {
      return d[1];
    }
  }
  return "";
};
g.c.userAgent.K.qn = function(a) {
  if (!g.c.userAgent.K.Ab()) {
    return a[1];
  }
  for (var c = 0;c < a.length;c++) {
    var d = a[c];
    if ("Edge" == d[0]) {
      return d;
    }
  }
};
g.c.userAgent.K.wc = function(a) {
  return 0 <= g.b.Nb(g.c.userAgent.K.Sb(), a);
};
g.c.userAgent.K.Jn = function(a, c) {
  var d = g.a.find(a, function(a) {
    return c == a[0];
  });
  return d && d[1] || "";
};
g.c.userAgent.platform = {};
g.c.userAgent.platform.Zh = function() {
  return g.c.userAgent.n.C("Android");
};
g.c.userAgent.platform.ei = function() {
  return g.c.userAgent.n.C("iPod");
};
g.c.userAgent.platform.We = function() {
  return g.c.userAgent.n.C("iPhone") && !g.c.userAgent.n.C("iPod") && !g.c.userAgent.n.C("iPad");
};
g.c.userAgent.platform.Ve = function() {
  return g.c.userAgent.n.C("iPad");
};
g.c.userAgent.platform.Ue = function() {
  return g.c.userAgent.platform.We() || g.c.userAgent.platform.Ve() || g.c.userAgent.platform.ei();
};
g.c.userAgent.platform.fi = function() {
  return g.c.userAgent.n.C("Macintosh");
};
g.c.userAgent.platform.jo = function() {
  return g.c.userAgent.n.C("Linux");
};
g.c.userAgent.platform.mi = function() {
  return g.c.userAgent.n.C("Windows");
};
g.c.userAgent.platform.zb = function() {
  return g.c.userAgent.n.C("CrOS");
};
g.c.userAgent.platform.Sb = function() {
  var a = g.c.userAgent.n.Rb(), c = "";
  g.c.userAgent.platform.mi() ? (c = /Windows (?:NT|Phone) ([0-9.]+)/, c = (a = c.exec(a)) ? a[1] : "0.0") : g.c.userAgent.platform.Ue() ? (c = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/, c = (a = c.exec(a)) && a[1].replace(/_/g, ".")) : g.c.userAgent.platform.fi() ? (c = /Mac OS X ([0-9_.]+)/, c = (a = c.exec(a)) ? a[1].replace(/_/g, ".") : "10") : g.c.userAgent.platform.Zh() ? (c = /Android\s+([^\);]+)(\)|;)/, c = (a = c.exec(a)) && a[1]) : g.c.userAgent.platform.zb() && (c = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/, 
  c = (a = c.exec(a)) && a[1]);
  return c || "";
};
g.c.userAgent.platform.wc = function(a) {
  return 0 <= g.b.Nb(g.c.userAgent.platform.Sb(), a);
};
g.userAgent = {};
g.userAgent.Od = !1;
g.userAgent.Kf = !1;
g.userAgent.Of = !1;
g.userAgent.Pd = !1;
g.userAgent.Qd = !1;
g.userAgent.kj = !1;
g.userAgent.Fc = g.userAgent.Od || g.userAgent.Kf || g.userAgent.Pd || g.userAgent.Of || g.userAgent.Qd;
g.userAgent.rc = function() {
  return g.c.userAgent.n.Rb();
};
g.userAgent.Ph = function() {
  return g.global.navigator || null;
};
g.userAgent.hc = g.userAgent.Fc ? g.userAgent.Qd : g.c.userAgent.browser.Xe();
g.userAgent.cb = g.userAgent.Fc ? g.userAgent.Od : g.c.userAgent.browser.Se();
g.userAgent.bg = g.userAgent.Fc ? g.userAgent.Kf : g.c.userAgent.K.co();
g.userAgent.lc = g.userAgent.Fc ? g.userAgent.Of || g.userAgent.Pd : g.c.userAgent.K.li();
g.userAgent.mo = function() {
  return g.userAgent.lc && g.c.userAgent.n.C("Mobile");
};
g.userAgent.$r = g.userAgent.Pd || g.userAgent.mo();
g.userAgent.Hg = g.userAgent.lc;
g.userAgent.Vm = function() {
  var a = g.userAgent.Ph();
  return a && a.platform || "";
};
g.userAgent.dt = g.userAgent.Vm();
g.userAgent.Mf = !1;
g.userAgent.Pf = !1;
g.userAgent.Lf = !1;
g.userAgent.Qf = !1;
g.userAgent.ac = !1;
g.userAgent.cc = !1;
g.userAgent.bc = !1;
g.userAgent.pb = g.userAgent.Mf || g.userAgent.Pf || g.userAgent.Lf || g.userAgent.Qf || g.userAgent.ac || g.userAgent.cc || g.userAgent.bc;
g.userAgent.Mc = g.userAgent.pb ? g.userAgent.Mf : g.c.userAgent.platform.fi();
g.userAgent.Rc = g.userAgent.pb ? g.userAgent.Pf : g.c.userAgent.platform.mi();
g.userAgent.io = function() {
  return g.c.userAgent.platform.jo() || g.c.userAgent.platform.zb();
};
g.userAgent.Lc = g.userAgent.pb ? g.userAgent.Lf : g.userAgent.io();
g.userAgent.yo = function() {
  var a = g.userAgent.Ph();
  return!!a && g.b.contains(a.appVersion || "", "X11");
};
g.userAgent.Ot = g.userAgent.pb ? g.userAgent.Qf : g.userAgent.yo();
g.userAgent.ANDROID = g.userAgent.pb ? g.userAgent.ac : g.c.userAgent.platform.Zh();
g.userAgent.mg = g.userAgent.pb ? g.userAgent.cc : g.c.userAgent.platform.We();
g.userAgent.lg = g.userAgent.pb ? g.userAgent.bc : g.c.userAgent.platform.Ve();
g.userAgent.xe = function() {
  if (g.userAgent.hc && g.global.opera) {
    var a = g.global.opera.version;
    return g.isFunction(a) ? a() : a;
  }
  var a = "", c = g.userAgent.Kn();
  c && (a = c ? c[1] : "");
  return g.userAgent.cb && !g.c.userAgent.K.Ab() && (c = g.userAgent.Lh(), c > parseFloat(a)) ? String(c) : a;
};
g.userAgent.Kn = function() {
  var a = g.userAgent.rc();
  if (g.userAgent.bg) {
    return/rv\:([^\);]+)(\)|;)/.exec(a);
  }
  if (g.userAgent.cb && g.c.userAgent.K.Ab()) {
    return/Edge\/([\d\.]+)/.exec(a);
  }
  if (g.userAgent.cb) {
    return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
  }
  if (g.userAgent.lc) {
    return/WebKit\/(\S+)/.exec(a);
  }
};
g.userAgent.Lh = function() {
  var a = g.global.document;
  return a ? a.documentMode : void 0;
};
g.userAgent.VERSION = g.userAgent.xe();
g.userAgent.compare = function(a, c) {
  return g.b.Nb(a, c);
};
g.userAgent.ki = {};
g.userAgent.wc = function(a) {
  return g.userAgent.kj || g.userAgent.ki[a] || (g.userAgent.ki[a] = 0 <= g.b.Nb(g.userAgent.VERSION, a));
};
g.userAgent.vc = g.userAgent.wc;
g.userAgent.ao = function(a) {
  return g.userAgent.cb && (g.c.userAgent.K.Ab() || g.userAgent.Jj >= a);
};
g.userAgent.Vv = g.userAgent.ao;
var u = g.userAgent, v, w = g.global.document, x = g.userAgent.Lh();
v = !w || !g.userAgent.cb || !x && g.c.userAgent.K.Ab() ? void 0 : x || ("CSS1Compat" == w.compatMode ? parseInt(g.userAgent.VERSION, 10) : 5);
u.Jj = v;
g.debug.Ea = g.ia;
g.debug.ru = function(a, c, d) {
  d = d || g.global;
  var e = d.onerror, f = !!c;
  g.userAgent.lc && !g.userAgent.wc("535.3") && (f = !f);
  d.onerror = function(c, d, m, n, p) {
    e && e(c, d, m, n, p);
    a({message:c, fileName:d, Bo:m, xu:n, error:p});
    return f;
  };
};
g.debug.dv = function(a, c) {
  if ("undefined" == typeof a) {
    return "undefined";
  }
  if (null == a) {
    return "NULL";
  }
  var d = [], e;
  for (e in a) {
    if (c || !g.isFunction(a[e])) {
      var f = e + " = ";
      try {
        f += a[e];
      } catch (h) {
        f += "*** " + h + " ***";
      }
      d.push(f);
    }
  }
  return d.join("\n");
};
g.debug.Qu = function(a, c) {
  var d = [], e = function(a, h, l) {
    var m = h + "  ";
    l = new g.g.Set(l);
    try {
      if (g.W(a)) {
        if (g.uc(a)) {
          d.push("NULL");
        } else {
          if (g.isString(a)) {
            d.push('"' + a.replace(/\n/g, "\n" + h) + '"');
          } else {
            if (g.isFunction(a)) {
              d.push(String(a).replace(/\n/g, "\n" + h));
            } else {
              if (g.isObject(a)) {
                if (l.contains(a)) {
                  d.push("*** reference loop detected ***");
                } else {
                  l.add(a);
                  d.push("{");
                  for (var n in a) {
                    if (c || !g.isFunction(a[n])) {
                      d.push("\n"), d.push(m), d.push(n + " = "), e(a[n], m, l);
                    }
                  }
                  d.push("\n" + h + "}");
                }
              } else {
                d.push(a);
              }
            }
          }
        }
      } else {
        d.push("undefined");
      }
    } catch (p) {
      d.push("*** " + p + " ***");
    }
  };
  e(a, "", new g.g.Set);
  return d.join("");
};
g.debug.dn = function(a) {
  for (var c = [], d = 0;d < a.length;d++) {
    g.isArray(a[d]) ? c.push(g.debug.dn(a[d])) : c.push(a[d]);
  }
  return "[ " + c.join(", ") + " ]";
};
g.debug.ev = function(a, c) {
  var d = g.debug.en(a, c);
  return g.html.h.H(d);
};
g.debug.en = function(a, c) {
  try {
    var d = g.debug.Wo(a), e = g.debug.Pm(d.fileName);
    return g.html.h.concat(g.html.h.Ne("Message: " + d.message + "\nUrl: "), g.html.h.create("a", {href:e, target:"_new"}, d.fileName), g.html.h.Ne("\nLine: " + d.lineNumber + "\n\nBrowser stack:\n" + d.stack + "-> [end]\n\nJS stack traversal:\n" + g.debug.Ke(c) + "-> "));
  } catch (f) {
    return g.html.h.Ne("Exception trying to expose exception! You win, we lose. " + f);
  }
};
g.debug.Pm = function(a) {
  g.O(a) || (a = "");
  if (!/^https?:\/\//i.test(a)) {
    return g.html.t.pc(g.b.I.Ee("sanitizedviewsrc"));
  }
  a = g.html.t.vf(a);
  return g.html.Cb.Ip(g.b.I.Ee("view-source scheme plus HTTP/HTTPS URL"), "view-source:" + g.html.t.H(a));
};
g.debug.Wo = function(a) {
  var c = g.zn("window.location.href");
  if (g.isString(a)) {
    return{message:a, name:"Unknown error", lineNumber:"Not available", fileName:c, stack:"Not available"};
  }
  var d, e, f = !1;
  try {
    d = a.lineNumber || a.Bo || "Not available";
  } catch (h) {
    d = "Not available", f = !0;
  }
  try {
    e = a.fileName || a.filename || a.sourceURL || g.global.$googDebugFname || c;
  } catch (l) {
    e = "Not available", f = !0;
  }
  return!f && a.lineNumber && a.fileName && a.stack && a.message && a.name ? a : {message:a.message || "Not available", name:a.name || "UnknownError", lineNumber:d, fileName:e, stack:a.stack || "Not available"};
};
g.debug.yh = function(a, c) {
  var d;
  "string" == typeof a ? (d = Error(a), Error.captureStackTrace && Error.captureStackTrace(d, g.debug.yh)) : d = a;
  d.stack || (d.stack = g.debug.Ke(g.debug.yh));
  if (c) {
    for (var e = 0;d["message" + e];) {
      ++e;
    }
    d["message" + e] = String(c);
  }
  return d;
};
g.debug.Gn = function(a) {
  if (g.de) {
    var c = g.debug.Nh(g.debug.Gn);
    if (c) {
      return c;
    }
  }
  for (var c = [], d = arguments.callee.caller, e = 0;d && (!a || e < a);) {
    c.push(g.debug.getFunctionName(d));
    c.push("()\n");
    try {
      d = d.caller;
    } catch (f) {
      c.push("[exception trying to get caller]\n");
      break;
    }
    e++;
    if (e >= g.debug.pg) {
      c.push("[...long stack...]");
      break;
    }
  }
  a && e >= a ? c.push("[...reached max depth limit...]") : c.push("[end]");
  return c.join("");
};
g.debug.pg = 50;
g.debug.Nh = function(a) {
  var c = Error();
  if (Error.captureStackTrace) {
    return Error.captureStackTrace(c, a), String(c.stack);
  }
  try {
    throw c;
  } catch (d) {
    c = d;
  }
  return(a = c.stack) ? String(a) : null;
};
g.debug.Ke = function(a) {
  var c;
  g.de && (c = g.debug.Nh(a || g.debug.Ke));
  c || (c = g.debug.Qh(a || arguments.callee.caller, []));
  return c;
};
g.debug.Qh = function(a, c) {
  var d = [];
  if (g.a.contains(c, a)) {
    d.push("[...circular reference...]");
  } else {
    if (a && c.length < g.debug.pg) {
      d.push(g.debug.getFunctionName(a) + "(");
      for (var e = a.arguments, f = 0;e && f < e.length;f++) {
        0 < f && d.push(", ");
        var h;
        h = e[f];
        switch(typeof h) {
          case "object":
            h = h ? "object" : "null";
            break;
          case "string":
            break;
          case "number":
            h = String(h);
            break;
          case "boolean":
            h = h ? "true" : "false";
            break;
          case "function":
            h = (h = g.debug.getFunctionName(h)) ? h : "[fn]";
            break;
          default:
            h = typeof h;
        }
        40 < h.length && (h = h.substr(0, 40) + "...");
        d.push(h);
      }
      c.push(a);
      d.push(")\n");
      try {
        d.push(g.debug.Qh(a.caller, c));
      } catch (l) {
        d.push("[exception trying to get caller]\n");
      }
    } else {
      a ? d.push("[...long stack...]") : d.push("[end]");
    }
  }
  return d.join("");
};
g.debug.ex = function(a) {
  g.debug.Ih = a;
};
g.debug.getFunctionName = function(a) {
  if (g.debug.Pb[a]) {
    return g.debug.Pb[a];
  }
  if (g.debug.Ih) {
    var c = g.debug.Ih(a);
    if (c) {
      return g.debug.Pb[a] = c;
    }
  }
  a = String(a);
  g.debug.Pb[a] || (c = /function ([^\(]+)/.exec(a), g.debug.Pb[a] = c ? c[1] : "[Anonymous]");
  return g.debug.Pb[a];
};
g.debug.yw = function(a) {
  return a.replace(/ /g, "[_]").replace(/\f/g, "[f]").replace(/\n/g, "[n]\n").replace(/\r/g, "[r]").replace(/\t/g, "[t]");
};
g.debug.Pb = {};
g.debug.za = function(a, c, d, e, f) {
  this.reset(a, c, d, e, f);
};
g.debug.za.prototype.Ah = null;
g.debug.za.Rj = !0;
g.debug.za.Vo = 0;
g.debug.za.prototype.reset = function(a, c, d, e, f) {
  g.debug.za.Rj && ("number" == typeof f || g.debug.za.Vo++);
  e || g.now();
  this.$e = a;
  this.So = c;
  delete this.Ah;
};
g.debug.za.prototype.Qp = function(a) {
  this.Ah = a;
};
g.debug.za.prototype.getMessage = function() {
  return this.So;
};
g.debug.ja = function() {
  this.clear();
};
g.debug.ja.Ge = function() {
  g.debug.ja.tc || (g.debug.ja.tc = new g.debug.ja);
  return g.debug.ja.tc;
};
g.debug.ja.Gc = 0;
g.debug.ja.prototype.jm = function(a, c, d) {
  var e = (this.th + 1) % g.debug.ja.Gc;
  this.th = e;
  if (this.ci) {
    return e = this.eh[e], e.reset(a, c, d), e;
  }
  this.ci = e == g.debug.ja.Gc - 1;
  return this.eh[e] = new g.debug.za(a, c, d);
};
g.debug.ja.Zn = function() {
  return 0 < g.debug.ja.Gc;
};
g.debug.ja.prototype.clear = function() {
  this.eh = Array(g.debug.ja.Gc);
  this.th = -1;
  this.ci = !1;
};
g.debug.f = function(a) {
  this.jf = a;
  this.Qa = this.qe = this.$e = this.xa = null;
};
g.debug.f.be = "";
g.debug.f.ec = !0;
g.debug.f.ec || (g.debug.f.uf = []);
g.debug.f.m = function(a, c) {
  this.name = a;
  this.value = c;
};
g.debug.f.m.prototype.toString = function() {
  return this.name;
};
g.debug.f.m.Yd = new g.debug.f.m("OFF", Infinity);
g.debug.f.m.yl = new g.debug.f.m("SHOUT", 1200);
g.debug.f.m.Jg = new g.debug.f.m("SEVERE", 1E3);
g.debug.f.m.he = new g.debug.f.m("WARNING", 900);
g.debug.f.m.kg = new g.debug.f.m("INFO", 800);
g.debug.f.m.Tf = new g.debug.f.m("CONFIG", 700);
g.debug.f.m.ag = new g.debug.f.m("FINE", 500);
g.debug.f.m.Wj = new g.debug.f.m("FINER", 400);
g.debug.f.m.Xj = new g.debug.f.m("FINEST", 300);
g.debug.f.m.hj = new g.debug.f.m("ALL", 0);
g.debug.f.m.$d = [g.debug.f.m.Yd, g.debug.f.m.yl, g.debug.f.m.Jg, g.debug.f.m.he, g.debug.f.m.kg, g.debug.f.m.Tf, g.debug.f.m.ag, g.debug.f.m.Wj, g.debug.f.m.Xj, g.debug.f.m.hj];
g.debug.f.m.kb = null;
g.debug.f.m.qh = function() {
  g.debug.f.m.kb = {};
  for (var a = 0, c;c = g.debug.f.m.$d[a];a++) {
    g.debug.f.m.kb[c.value] = c, g.debug.f.m.kb[c.name] = c;
  }
};
g.debug.f.m.wv = function(a) {
  g.debug.f.m.kb || g.debug.f.m.qh();
  return g.debug.f.m.kb[a] || null;
};
g.debug.f.m.xv = function(a) {
  g.debug.f.m.kb || g.debug.f.m.qh();
  if (a in g.debug.f.m.kb) {
    return g.debug.f.m.kb[a];
  }
  for (var c = 0;c < g.debug.f.m.$d.length;++c) {
    var d = g.debug.f.m.$d[c];
    if (d.value <= a) {
      return d;
    }
  }
  return null;
};
g.debug.f.Go = function(a) {
  g.global.console && (g.global.console.timeStamp ? g.global.console.timeStamp(a) : g.global.console.markTimeline && g.global.console.markTimeline(a));
  g.global.msWriteProfilerMark && g.global.msWriteProfilerMark(a);
};
b = g.debug.f.prototype;
b.getName = function() {
  return this.jf;
};
b.Ug = function(a) {
  g.debug.Ea && (g.debug.f.ec ? (this.Qa || (this.Qa = []), this.Qa.push(a)) : g.debug.f.uf.push(a));
};
b.Bi = function(a) {
  if (g.debug.Ea) {
    var c = g.debug.f.ec ? this.Qa : g.debug.f.uf;
    return!!c && g.a.remove(c, a);
  }
  return!1;
};
b.getParent = function() {
  return this.xa;
};
b.getChildren = function() {
  this.qe || (this.qe = {});
  return this.qe;
};
b.Mh = function() {
  if (!g.debug.Ea) {
    return g.debug.f.m.Yd;
  }
  if (!g.debug.f.ec) {
    return g.debug.f.Vw;
  }
  if (this.$e) {
    return this.$e;
  }
  if (this.xa) {
    return this.xa.Mh();
  }
  g.l.Ca("Root logger has no level set.");
  return null;
};
b.ko = function(a) {
  return g.debug.Ea && a.value >= this.Mh().value;
};
b.log = function(a, c, d) {
  g.debug.Ea && this.ko(a) && (g.isFunction(c) && (c = c()), this.Ym(this.wn(a, c, d)));
};
b.wn = function(a, c, d) {
  a = g.debug.ja.Zn() ? g.debug.ja.Ge().jm(a, c, this.jf) : new g.debug.za(a, String(c), this.jf);
  d && a.Qp(d);
  return a;
};
b.bq = function(a, c) {
  g.debug.Ea && this.log(g.debug.f.m.Jg, a, c);
};
b.Kd = function(a, c) {
  g.debug.Ea && this.log(g.debug.f.m.he, a, c);
};
b.info = function(a, c) {
  g.debug.Ea && this.log(g.debug.f.m.kg, a, c);
};
b.config = function(a, c) {
  g.debug.Ea && this.log(g.debug.f.m.Tf, a, c);
};
b.Hh = function(a, c) {
  g.debug.Ea && this.log(g.debug.f.m.ag, a, c);
};
b.Ym = function(a) {
  g.debug.f.Go("log:" + a.getMessage());
  if (g.debug.f.ec) {
    for (var c = this;c;) {
      c.xm(a), c = c.getParent();
    }
  } else {
    for (var c = 0, d;d = g.debug.f.uf[c++];) {
      d(a);
    }
  }
};
b.xm = function(a) {
  if (this.Qa) {
    for (var c = 0, d;d = this.Qa[c];c++) {
      d(a);
    }
  }
};
g.debug.Fa = {};
g.debug.Fa.pi = {};
g.debug.Fa.sc = function() {
  g.debug.Fa.Fi || (g.debug.Fa.pi[g.debug.f.be] = g.debug.Fa.Fi);
};
g.debug.Fa.tv = function() {
  return g.debug.Fa.pi;
};
g.debug.Fa.yv = function() {
  g.debug.Fa.sc();
  return g.debug.Fa.Fi;
};
g.debug.Fa.Iu = function() {
  return function() {
  };
};
g.log = {};
g.log.bb = g.debug.Ea;
g.log.be = g.debug.f.be;
g.log.f = g.debug.f;
g.log.m = g.debug.f.m;
g.log.za = g.debug.za;
g.log.Ug = function(a, c) {
  g.log.bb && a && a.Ug(c);
};
g.log.Bi = function(a, c) {
  return g.log.bb && a ? a.Bi(c) : !1;
};
g.log.log = function(a, c, d, e) {
  g.log.bb && a && a.log(c, d, e);
};
g.log.error = function(a, c, d) {
  g.log.bb && a && a.bq(c, d);
};
g.log.Kd = function(a, c, d) {
  g.log.bb && a && a.Kd(c, d);
};
g.log.info = function(a, c, d) {
  g.log.bb && a && a.info(c, d);
};
g.log.Hh = function(a, c, d) {
  g.log.bb && a && a.Hh(c, d);
};
g.g.la = function(a) {
  this.ha = {};
  if (a) {
    for (var c = 0;c < a.length;c++) {
      this.ha[g.g.la.ed(a[c])] = null;
    }
  }
  g.l.pm();
};
g.g.la.Pj = {};
g.g.la.ed = function(a) {
  return a in g.g.la.Pj || 32 == String(a).charCodeAt(0) ? " " + a : a;
};
g.g.la.we = function(a) {
  return 32 == a.charCodeAt(0) ? a.substr(1) : a;
};
b = g.g.la.prototype;
b.add = function(a) {
  this.ha[g.g.la.ed(a)] = null;
};
b.lm = function(a) {
  for (var c in a.ha) {
    this.ha[c] = null;
  }
};
b.clear = function() {
  this.ha = {};
};
b.clone = function() {
  var a = new g.g.la;
  a.lm(this);
  return a;
};
b.contains = function(a) {
  return g.g.la.ed(a) in this.ha;
};
b.equals = function(a) {
  return this.pd(a) && a.pd(this);
};
b.forEach = function(a, c) {
  for (var d in this.ha) {
    a.call(c, g.g.la.we(d), void 0, this);
  }
};
b.ua = Object.keys ? function() {
  return Object.keys(this.ha).length;
} : function() {
  var a = 0, c;
  for (c in this.ha) {
    a++;
  }
  return a;
};
b.U = Object.keys ? function() {
  return Object.keys(this.ha).map(g.g.la.we, this);
} : function() {
  var a = [], c;
  for (c in this.ha) {
    a.push(g.g.la.we(c));
  }
  return a;
};
b.wa = function() {
  for (var a in this.ha) {
    return!1;
  }
  return!0;
};
b.pd = function(a) {
  for (var c in this.ha) {
    if (!(c in a.ha)) {
      return!1;
    }
  }
  return!0;
};
b.remove = function(a) {
  a = g.g.la.ed(a);
  return a in this.ha ? (delete this.ha[a], !0) : !1;
};
b.Lb = function() {
  return g.e.P(this.U());
};
k.oa = {};
k.oa.zb = function() {
  return null != g.userAgent.rc() && -1 != g.userAgent.rc().indexOf("CrOS");
};
k.oa.xo = function() {
  var a = g.userAgent.rc();
  if (!g.isString(a)) {
    return!1;
  }
  a = a.match(/Windows NT \d+.\d+/);
  if (g.uc(a) || !g.isArray(a)) {
    return!1;
  }
  a = a[0];
  a = a.match(/\d+.\d+/);
  if (g.uc(a) || !g.isArray(a)) {
    return!1;
  }
  a = a[0];
  return 6.2 <= parseFloat(a);
};
k.oa.ic = {tj:"ChromeOS", Rc:"Windows", Mc:"Mac", Lc:"Linux", OTHER:"Other"};
k.oa.qv = function() {
  return k.oa.zb() ? k.oa.ic.tj : g.userAgent.Rc ? k.oa.ic.Rc : g.userAgent.Mc ? k.oa.ic.Mc : g.userAgent.Lc ? k.oa.ic.Lc : k.oa.ic.OTHER;
};
k.o = {};
k.o.gs = "Casting to {{receiverName}}";
k.o.ls = "Cast this tab to...";
k.o.ms = "Cast this tab (audio) to...";
k.o.ks = "Cast screen/window to...";
k.o.hs = "Cast {{v2AppDomain}} to...";
k.o.js = "Cast {{v2AppDomain}}";
k.o.os = "Cast this tab";
k.o.Vs = "Stop casting";
k.o.ns = "Cast {{v2AppDomain}}";
k.o.Fs = "Bug or Error";
k.o.Hs = "Feature Request";
k.o.Js = "Tab/Desktop Projection Quality";
k.o.Gs = "Device Discovery";
k.o.Is = "Other";
k.o.Ls = "Freezes";
k.o.Os = "Jerky";
k.o.Ss = "Occasional Stutter";
k.o.Rs = "Smooth";
k.o.Ps = "Perfect";
k.o.zs = "N/A";
k.o.Ts = "Unwatchable";
k.o.Qs = "Poor";
k.o.Ks = "Acceptable";
k.o.Ms = "Good - DVD";
k.o.Ns = "Great - HD";
k.o.ws = "Unintelligible";
k.o.vs = "Poor";
k.o.ss = "Acceptable - FM";
k.o.ts = "Good";
k.o.us = "Perfect";
k.o.xs = "Do you want to discard the feedback?";
k.o.Cs = "Sending feedback...";
k.o.Ds = "Unable to send feedback. Please try again later.";
k.o.Es = "Thank you for sending feedback.";
k.o.Bs = "Failed to send feedback. Retrying (this is attempt #{{attemptNumber}})...";
k.o.Nk = "Standard (480p)";
k.o.Lk = "High (720p)";
k.o.Mk = "Extreme (720p high bitrate)";
k.o.Us = "Google Cast extension options";
k.o.As = "Google Cast feedback";
k.o.qs = "The Google Cast extension enables you to find and play content on your Chromecast device from your Chrome browser.\nWhen on Cast optimized sites, you'll see new options that let you play video on your TV via Chromecast - using your computer as a remote to browse for videos and to control playback.\nYou can also cast any of your tabs in Chrome to your TV, letting you enjoy sites, photos, or even video from the best screen in your home. Note that this feature is still in beta, and requires a fast computer and Wi-Fi network.\nChromecast hardware is required to use this extension. To find out more, visit http://google.com/chromecast.\nBy installing this item, you agree to the Google Terms of Service and Privacy Policy at https://www.google.com/intl/en/policies/.";
k.o.es = "The Google Cast extension enables you to find and play content on your Chromecast device from your Chrome browser.\nThis is the *BETA* channel of the Google Cast extension.  It is intended for developers and advanced users who want early access to upcoming APIs and features in advance of public release.  Most users should install the stable Google Cast extension (https://chrome.google.com/webstore/detail/google-cast/boadgeojelhgndaghljhdicfkmllpafd). The beta channel will often be less stable and contain more bugs.\nBy installing this item, you agree to the Google Terms of Service and Privacy Policy at https://www.google.com/intl/en/policies/.";
k.o.rs = "Send content to your Chromecast and other devices that support Google Cast.";
k.o.ps = "Enter Hangout name";
k.o.fs = "Casting...";
k.o.ys = "Your Chrome version, operating system version, Cast extension options, mirroring performance stats, and communication channel diagnostic logs will be submitted in addition to any information you choose to include above. This feedback is used to diagnose problems and help improve the extension. Any personal information you submit, whether explicitly or incidentally will be protected in accordance with our privacy policies. By submitting this feedback, you agree that Google may use feedback that you provide to improve any Google product or service.";
k.o.bs = "Casting to Hangouts has been disabled. Only @google.com supported at this time";
k.o.ds = "Casting to Hangouts setup has timed out.  See go/castouts-dogfood#TOC-Known-Issues";
k.o.cs = "Casting to Hangouts has been succesfully initialized!";
g.userAgent.product = {};
g.userAgent.product.Jf = !1;
g.userAgent.product.cc = !1;
g.userAgent.product.bc = !1;
g.userAgent.product.ac = !1;
g.userAgent.product.If = !1;
g.userAgent.product.Nf = !1;
g.userAgent.product.Jb = g.userAgent.Od || g.userAgent.Qd || g.userAgent.product.Jf || g.userAgent.product.cc || g.userAgent.product.bc || g.userAgent.product.ac || g.userAgent.product.If || g.userAgent.product.Nf;
g.userAgent.product.hc = g.userAgent.hc;
g.userAgent.product.cb = g.userAgent.cb;
g.userAgent.product.Yj = g.userAgent.product.Jb ? g.userAgent.product.Jf : g.c.userAgent.browser.bi();
g.userAgent.product.ho = function() {
  return g.c.userAgent.platform.We() || g.c.userAgent.platform.ei();
};
g.userAgent.product.mg = g.userAgent.product.Jb ? g.userAgent.product.cc : g.userAgent.product.ho();
g.userAgent.product.lg = g.userAgent.product.Jb ? g.userAgent.product.bc : g.c.userAgent.platform.Ve();
g.userAgent.product.ANDROID = g.userAgent.product.Jb ? g.userAgent.product.ac : g.c.userAgent.browser.Yn();
g.userAgent.product.CHROME = g.userAgent.product.Jb ? g.userAgent.product.If : g.c.userAgent.browser.Qe();
g.userAgent.product.so = function() {
  return g.c.userAgent.browser.ro() && !g.c.userAgent.platform.Ue();
};
g.userAgent.product.Hg = g.userAgent.product.Jb ? g.userAgent.product.Nf : g.userAgent.product.so();
g.userAgent.product.xe = function() {
  if (g.userAgent.product.Yj) {
    return g.userAgent.product.qc(/Firefox\/([0-9.]+)/);
  }
  if (g.userAgent.product.cb || g.userAgent.product.hc) {
    return g.userAgent.VERSION;
  }
  if (g.userAgent.product.CHROME) {
    return g.userAgent.product.qc(/Chrome\/([0-9.]+)/);
  }
  if (g.userAgent.product.Hg && !g.c.userAgent.platform.Ue()) {
    return g.userAgent.product.qc(/Version\/([0-9.]+)/);
  }
  if (g.userAgent.product.mg || g.userAgent.product.lg) {
    var a = g.userAgent.product.Bh(/Version\/(\S+).*Mobile\/(\S+)/);
    if (a) {
      return a[1] + "." + a[2];
    }
  } else {
    if (g.userAgent.product.ANDROID) {
      return(a = g.userAgent.product.qc(/Android\s+([0-9.]+)/)) ? a : g.userAgent.product.qc(/Version\/([0-9.]+)/);
    }
  }
  return "";
};
g.userAgent.product.qc = function(a) {
  return(a = g.userAgent.product.Bh(a)) ? a[1] : "";
};
g.userAgent.product.Bh = function(a) {
  return a.exec(g.userAgent.rc());
};
g.userAgent.product.VERSION = g.userAgent.product.xe();
g.userAgent.product.vc = function(a) {
  return 0 <= g.b.Nb(g.userAgent.product.VERSION, a);
};
k.i = {};
k.i.Ct = {cm:"webrtc", Lq:"cast_streaming"};
k.i.ar = {xt:"tab", cr:"desktop"};
k.i.am = {Lt:"VP8", rj:"CAST1", ur:"H264", jt:"rtx"};
k.i.v = function() {
  this.audioBitrate = this.minHeight = this.minWidth = this.videoQuality = this.maxVideoBitrate = this.minVideoBitrate = -1;
  this.bufferedMode = k.i.v.pj.Xk;
  this.bufferSizeMillis = k.i.v.Aj;
  this.minCastLatencyMillis = this.maxCastLatencyMillis = k.i.v.Wf;
  this.maxFrameRate = -1;
  this.pacerTargetBatchSize = 10;
  this.pacerMaxBatchSize = 20;
  this.dscpEnabled = g.userAgent.Mc || g.userAgent.Lc || k.oa.zb() || k.oa.xo();
  this.backgroundScanDisabled = this.mediaStreamingModeEnabled = !1;
  this.preferredVideoCodec = k.i.am.rj;
  this.nonBlockingIOEnabled = this.disableTDLS = !1;
  k.i.Z.DEFAULT && this.update(k.i.Z.DEFAULT.settings);
};
k.i.v.Ej = {enablePacing:!0, enableAudioTcp:!0, enableVideoTcp:!0, enableAudioNack:!0, useOpus:!0, videoBitrate:!0, zoomModeEnabled:!0};
k.i.v.mr = !1;
k.i.v.pj = {Yd:"off", Eq:"auto", Xk:"on"};
k.i.v.Fk = 100;
k.i.v.wk = 1E4;
k.i.v.Ek = 56;
k.i.v.vk = 128;
k.i.v.Gk = 100;
k.i.v.Dk = 100;
k.i.v.Ck = 1;
k.i.v.Sr = 1;
k.i.v.dr = 30;
k.i.v.It = {"854x480":[854, 480], "1280x720":[1280, 720], "1920x1080":[1920, 1080]};
k.i.v.prototype.update = function(a) {
  for (var c in this) {
    g.isFunction(this[c]) || g.O(a[c]) && g.sa(this[c]) == g.sa(a[c]) && (this[c] = a[c]);
  }
};
k.i.v.prototype.isEqual = function(a) {
  for (var c in this) {
    if (!g.isFunction(this[c]) && this[c] !== a[c]) {
      return!1;
    }
  }
  return!0;
};
k.i.v.nh = function(a) {
  return Math.min(k.i.v.wk, Math.max(k.i.v.Fk, a));
};
b = k.i.v.prototype;
b.Sp = function(a) {
  g.isString(a) && (a = parseInt(a, 10));
  this.maxVideoBitrate = a = k.i.v.nh(a);
  this.minVideoBitrate = Math.min(this.minVideoBitrate, this.maxVideoBitrate);
};
b.Up = function(a) {
  g.isString(a) && (a = parseInt(a, 10));
  this.minVideoBitrate = a = k.i.v.nh(a);
  this.maxVideoBitrate = Math.max(this.maxVideoBitrate, this.minVideoBitrate);
};
b.Zp = function(a) {
  g.isString(a) && (a = parseInt(a, 10));
  0 < a && (this.videoQuality = a);
};
b.Pp = function(a) {
  g.isString(a) && (a = parseInt(a, 10));
  this.audioBitrate = Math.min(k.i.v.vk, Math.max(k.i.v.Ek, a));
};
b.Vp = function(a) {
  g.isString(a) && (a = parseInt(a, 10));
  this.minWidth = Math.max(k.i.v.Gk, a);
};
b.Tp = function(a) {
  g.isString(a) && (a = parseInt(a, 10));
  this.minHeight = Math.max(k.i.v.Dk, a);
};
b.Rp = function(a) {
  g.isString(a) && (a = Math.round(parseFloat(a)));
  isFinite(a) && (this.maxFrameRate = Math.max(k.i.v.Ck, a));
};
k.i.v.Aj = 500;
k.i.v.Wf = 400;
k.i.Z = function(a, c, d, e, f, h, l, m, n) {
  this.id = a;
  this.name = c;
  this.settings = new k.i.v;
  this.settings.Vp(d);
  this.settings.Tp(e);
  this.settings.Rp(f);
  this.settings.Up(h);
  this.settings.Sp(l);
  this.settings.Zp(m);
  this.settings.Pp(n);
};
k.i.Z.gg = new k.i.Z("high", k.o.Lk, 1280, 720, 30, 2E3, 2500, 56, 128);
k.i.Z.pk = new k.i.Z("low", k.o.Nk, 854, 480, 30, 750, 1500, 56, 128);
k.i.Z.gk = new k.i.Z("highest", k.o.Mk, 1280, 720, 30, 4E3, 5E3, 56, 128);
k.i.Z.DEFAULT = k.i.Z.gg;
k.i.Z.Hk = [k.i.Z.gk, k.i.Z.gg, k.i.Z.pk];
k.i.Z.Yq = "custom";
k.i.Z.sv = function(a) {
  return g.a.find(k.i.Z.Hk, function(c) {
    return c.id == a;
  });
};
k.Ir = {sr:"fatal", he:"warning", $s:"notification"};
k.Jr = {Aq:"activity_error", CHANNEL_ERROR:"channel_error", Or:"launch_failure", er:"device_offline", Kq:"bad_device", rt:"session_quality_network", qt:"session_quality_encoding", Kr:"known_issue_bad_intel_cpu", Qq:"chrome_too_old_for_v2", Et:"unable_to_cast_streaming", Tr:"low_perf_on_current_chrome", Nt:"window_resize_unsupported", wr:"hangout_invalid", vr:"hangout_error"};
k.popup = {};
k.popup.ot = {Bq:"act_on_issue", wt:"stop_activity", et:"play_media", ct:"pause_media", tt:"set_mute", CAST_THIS_TAB:"cast_this_tab", Mq:"cast_this_tab_audio", CREATE_SESSION:"create_session", Mr:"launch_desktop_mirror", INIT:"init", Ft:"update_settings", it:"remove_receiver", Br:"initialize_castouts", Mt:"warn_resize"};
k.popup.qr = {as:"model_update"};
k.popup.Hq = {Gt:"v1_app", Ht:"v2_app", Xq:"custom_app", Zr:"mirror_tab", Yr:"mirror_screen"};
k.popup.Message = function(a, c) {
  this.type = a;
  this.message = c;
};
k.popup.Gq = function(a, c, d, e, f, h, l, m) {
  this.id = a;
  this.receiver = g.object.clone(c);
  this.activityType = d;
  this.iconUrl = e || null;
  this.title = f || "";
  this.mediaPlayerStatus = h || null;
  this.tabId = l || null;
  this.isLocal = m;
  this.allowStop = !0;
};
k.popup.Wa = {CAST:"cast", DIAL:"dial", HANGOUT:"hangout", CUSTOM:"custom"};
k.popup.$ = function(a, c, d, e) {
  this.id = a;
  this.uniqueId = c;
  this.name = d;
  this.receiverType = e;
  this.isInLaunch = this.manuallyAdded = !1;
  this.muted = null;
};
k.popup.Hr = function(a, c, d, e, f, h, l, m) {
  this.id = a;
  this.title = c;
  this.message = d;
  this.defaultActionText = e;
  this.optActionText = f || "";
  this.severity = h;
  this.activityId = l;
  this.isBlocking = m;
};
k.popup.kt = function(a, c) {
  this.receiver = a;
  this.activity = c;
};
k.popup.Fq = function(a, c) {
  this.id = a;
  this.isDefaultAction = c;
};
k.popup.Aa = function(a, c, d, e, f, h, l) {
  this.statsCollectNotificationDismissed = g.jb(d) ? d : !0;
  this.sendUsageEnabled = g.jb(e) ? e : !0;
  this.castAppNotificationDismissed = g.jb(a) ? a : !1;
  this.mirrorQualityId = c || k.i.Z.DEFAULT.id;
  this.hangoutsEnabled = f || !1;
  this.hangoutsInitialized = h || !1;
  this.hangoutsDefaultDomain = l || "";
};
k.popup.Ys = function(a, c, d, e, f, h, l) {
  this.receiverActs = a || [];
  this.issue = c;
  this.isV1AppInTab = h || !1;
  this.isV2AppInTab = !!l;
  this.v2AppDomain = l || null;
  this.currentActivity = d;
  this.desktopActivity = e;
  this.settings = f || new k.popup.Aa;
};
k.popup.Ws = function() {
  this.playerState = chrome.cast.media.jc.IDLE;
  this.muted = null;
  this.supportedCommands = [chrome.cast.media.vg.PAUSE];
};
k.zr = function() {
};
k.i.Nc = function() {
  this.buckets = {};
};
k.i.Nc.prototype.update = function(a) {
  if (g.O(a.buckets)) {
    this.buckets = {};
    a = a.buckets;
    for (var c in a) {
      k.i.Nc.uo(c) && g.isNumber(a[c]) && (this.buckets[c] = a[c]);
    }
  }
};
k.i.Nc.uo = function(a) {
  return/<[0-9]+/.test(a) || /[0-9]+-[0-9]+/.test(a) || />=[0-9]+/.test(a) ? !0 : !1;
};
k.i.Pk = function(a) {
  this.deviceId = a;
  this.avgFrameLatency = this.avgNetworkLatency = null;
  this.frameLatencyHistogram = new k.i.Nc;
};
k.i.Pk.prototype.update = function(a) {
  g.O(a.deviceId) && (this.deviceId = a.deviceId);
  g.O(a.avgNetworkLatency) && (this.avgNetworkLatency = a.avgNetworkLatency);
  g.O(a.avgFrameLatency) && (this.avgFrameLatency = a.avgFrameLatency);
  g.O(a.frameLatencyHistogram) && this.frameLatencyHistogram.update(a.frameLatencyHistogram);
};
k.Config = {};
k.Config.Xr = 39;
k.Config.Fj = "30.0.1584.0";
k.Config.oj = "dliochdbjfkdbacpmhlcpmleaejidimm";
k.Config.Lg = "boadgeojelhgndaghljhdicfkmllpafd";
k.Config.getId = function() {
  return g.W(chrome.runtime) ? chrome.runtime.id : k.Config.Lg;
};
k.Config.Te = !0;
k.Config.aq = function() {
  var a = k.Config.getId() === k.Config.oj, c = k.Config.getId() === k.Config.Lg;
  if (!k.Config.Te && !a && !c) {
    switch(localStorage["test.extChannel"]) {
      case "stable":
        a = !1;
        c = !0;
        break;
      case "beta":
        a = !0;
        c = !1;
        break;
      default:
        c = a = !1;
    }
  }
  k.Config.$h = a;
  k.Config.ji = c;
};
k.Config.aq();
k.Config.Zv = g.userAgent.product.vc(35);
k.Config.ow = "undefined" != typeof chrome && !!chrome.networkingPrivate && !!chrome.networkingPrivate.setWifiTDLSEnabledState && k.oa.zb();
k.Config.Rv = !!chrome.cast && !!chrome.cast.streaming && g.userAgent.product.vc(36);
k.Config.Uv = k.oa.zb() && g.userAgent.product.vc(k.Config.Fj) || g.userAgent.Rc && g.userAgent.product.vc(31);
k.Config.sn = function() {
  return 1 < k.Config.Te + k.Config.$h + k.Config.ji ? null : k.Config.Te ? "internal" : k.Config.$h ? "beta" : k.Config.ji ? "stable" : "staging";
};
g.j("getCastExtensionChannel", k.Config.sn);
k.Fr = function() {
};
k.i.sj = "0F5096E8";
k.i.fw = function(a) {
  return a == k.i.sj || a == chrome.cast.ug;
};
g.debug.ca = {};
g.debug.pr = function() {
};
g.debug.ca.Xb = [];
g.debug.ca.hf = [];
g.debug.ca.ui = !1;
g.debug.ca.register = function(a) {
  g.debug.ca.Xb[g.debug.ca.Xb.length] = a;
  if (g.debug.ca.ui) {
    for (var c = g.debug.ca.hf, d = 0;d < c.length;d++) {
      a(g.bind(c[d].wrap, c[d]));
    }
  }
};
g.debug.ca.Bw = function(a) {
  g.debug.ca.ui = !0;
  for (var c = g.bind(a.wrap, a), d = 0;d < g.debug.ca.Xb.length;d++) {
    g.debug.ca.Xb[d](c);
  }
  g.debug.ca.hf.push(a);
};
g.debug.ca.Gx = function(a) {
  var c = g.debug.ca.hf;
  a = g.bind(a.H, a);
  for (var d = 0;d < g.debug.ca.Xb.length;d++) {
    g.debug.ca.Xb[d](a);
  }
  c.length--;
};
g.async = {};
g.async.Ti = function(a) {
  g.global.setTimeout(function() {
    throw a;
  }, 0);
};
g.async.Ta = function(a, c, d) {
  var e = a;
  c && (e = g.bind(a, c));
  e = g.async.Ta.fj(e);
  !g.isFunction(g.global.setImmediate) || !d && g.global.Window && g.global.Window.prototype && g.global.Window.prototype.setImmediate == g.global.setImmediate ? (g.async.Ta.Li || (g.async.Ta.Li = g.async.Ta.Fn()), g.async.Ta.Li(e)) : g.global.setImmediate(e);
};
g.async.Ta.Fn = function() {
  var a = g.global.MessageChannel;
  "undefined" === typeof a && "undefined" !== typeof window && window.postMessage && window.addEventListener && !g.c.userAgent.K.no() && (a = function() {
    var a = document.createElement("iframe");
    a.style.display = "none";
    a.src = "";
    document.documentElement.appendChild(a);
    var c = a.contentWindow, a = c.document;
    a.open();
    a.write("");
    a.close();
    var d = "callImmediate" + Math.random(), e = "file:" == c.location.protocol ? "*" : c.location.protocol + "//" + c.location.host, a = g.bind(function(a) {
      if (("*" == e || a.origin == e) && a.data == d) {
        this.port1.onmessage();
      }
    }, this);
    c.addEventListener("message", a, !1);
    this.port1 = {};
    this.port2 = {postMessage:function() {
      c.postMessage(d, e);
    }};
  });
  if ("undefined" !== typeof a && !g.c.userAgent.browser.Se()) {
    var c = new a, d = {}, e = d;
    c.port1.onmessage = function() {
      if (g.W(d.next)) {
        d = d.next;
        var a = d.jh;
        d.jh = null;
        a();
      }
    };
    return function(a) {
      e.next = {jh:a};
      e = e.next;
      c.port2.postMessage(0);
    };
  }
  return "undefined" !== typeof document && "onreadystatechange" in document.createElement("script") ? function(a) {
    var c = document.createElement("script");
    c.onreadystatechange = function() {
      c.onreadystatechange = null;
      c.parentNode.removeChild(c);
      c = null;
      a();
      a = null;
    };
    document.documentElement.appendChild(c);
  } : function(a) {
    g.global.setTimeout(a, 0);
  };
};
g.async.Ta.fj = g.G.identity;
g.debug.ca.register(function(a) {
  g.async.Ta.fj = a;
});
g.mb = {};
g.mb.Eb = {};
g.mb.Eb.sf = [];
g.mb.Eb.lx = function() {
  for (var a = g.mb.Eb.sf, c = 0;c < a.length;c++) {
    g.mb.Eb.sf[c]();
  }
};
g.mb.Eb.vq = function(a) {
  g.mb.Eb.sf.push(a);
};
g.async.Vd = function(a, c, d) {
  this.Ao = d;
  this.Qm = a;
  this.zp = c;
  this.vd = 0;
  this.ld = null;
};
g.async.Vd.prototype.get = function() {
  var a;
  0 < this.vd ? (this.vd--, a = this.ld, this.ld = a.next, a.next = null) : a = this.Qm();
  return a;
};
g.async.Vd.prototype.put = function(a) {
  this.zp(a);
  this.vd < this.Ao && (this.vd++, a.next = this.ld, this.ld = a);
};
g.async.Ha = function() {
  this.Nd = this.$b = null;
};
g.async.Ha.Cj = 100;
g.async.Ha.Kh = new g.async.Vd(function() {
  return new g.async.ie;
}, function(a) {
  a.reset();
}, g.async.Ha.Cj);
g.async.Ha.prototype.add = function(a, c) {
  var d = this.In();
  d.set(a, c);
  this.Nd ? this.Nd.next = d : this.$b = d;
  this.Nd = d;
};
g.async.Ha.prototype.remove = function() {
  var a = null;
  this.$b && (a = this.$b, this.$b = this.$b.next, this.$b || (this.Nd = null), a.next = null);
  return a;
};
g.async.Ha.prototype.Ap = function(a) {
  g.async.Ha.Kh.put(a);
};
g.async.Ha.prototype.In = function() {
  return g.async.Ha.Kh.get();
};
g.async.ie = function() {
  this.next = this.scope = this.De = null;
};
g.async.ie.prototype.set = function(a, c) {
  this.De = a;
  this.scope = c;
  this.next = null;
};
g.async.ie.prototype.reset = function() {
  this.next = this.scope = this.De = null;
};
g.async.run = function(a, c) {
  g.async.run.Dd || g.async.run.Wn();
  g.async.run.Ld || (g.async.run.Dd(), g.async.run.Ld = !0);
  g.async.run.Md.add(a, c);
};
g.async.run.Wn = function() {
  if (g.global.Promise && g.global.Promise.resolve) {
    var a = g.global.Promise.resolve();
    g.async.run.Dd = function() {
      a.then(g.async.run.lf);
    };
  } else {
    g.async.run.Dd = function() {
      g.async.Ta(g.async.run.lf);
    };
  }
};
g.async.run.jv = function() {
  g.async.run.Dd = function() {
    g.async.Ta(g.async.run.lf);
  };
};
g.async.run.Ld = !1;
g.async.run.Md = new g.async.Ha;
g.ia && (g.async.run.yp = function() {
  g.async.run.Ld = !1;
  g.async.run.Md = new g.async.Ha;
}, g.mb.Eb.vq(g.async.run.yp));
g.async.run.lf = function() {
  for (var a = null;a = g.async.run.Md.remove();) {
    try {
      a.De.call(a.scope);
    } catch (c) {
      g.async.Ti(c);
    }
    g.async.run.Md.Ap(a);
  }
  g.async.run.Ld = !1;
};
g.promise = {};
g.promise.pt = function() {
};
g.Thenable = function() {
};
g.Thenable.prototype.then = function() {
};
g.Thenable.jg = "$goog_Thenable";
g.Thenable.Vg = function(a) {
  g.A(a.prototype, "then", a.prototype.then);
  a.prototype[g.Thenable.jg] = !0;
};
g.Thenable.fo = function(a) {
  if (!a) {
    return!1;
  }
  try {
    return!!a[g.Thenable.jg];
  } catch (c) {
    return!1;
  }
};
g.Promise = function(a, c) {
  this.X = g.Promise.J.Ma;
  this.tf = void 0;
  this.Ba = this.xa = null;
  this.Be = !1;
  0 < g.Promise.sb ? this.Jd = 0 : 0 == g.Promise.sb && (this.hd = !1);
  g.Promise.gc && (this.Bf = [], this.Wg(Error("created")), this.uh = 0);
  if (a == g.Promise.Fg) {
    this.Ja(g.Promise.J.fc, c);
  } else {
    try {
      var d = this;
      a.call(c, function(a) {
        d.Ja(g.Promise.J.fc, a);
      }, function(a) {
        if (g.ia && !(a instanceof g.Promise.Fb)) {
          try {
            if (a instanceof Error) {
              throw a;
            }
            throw Error("Promise rejected.");
          } catch (c) {
          }
        }
        d.Ja(g.Promise.J.Na, a);
      });
    } catch (e) {
      this.Ja(g.Promise.J.Na, e);
    }
  }
};
g.Promise.gc = !1;
g.Promise.sb = 0;
g.Promise.J = {Ma:0, Sf:1, fc:2, Na:3};
g.Promise.Fg = function() {
};
g.Promise.resolve = function(a) {
  return new g.Promise(g.Promise.Fg, a);
};
g.Promise.reject = function(a) {
  return new g.Promise(function(c, d) {
    d(a);
  });
};
g.Promise.race = function(a) {
  return new g.Promise(function(c, d) {
    a.length || c(void 0);
    for (var e = 0, f;f = a[e];e++) {
      f.then(c, d);
    }
  });
};
g.Promise.all = function(a) {
  return new g.Promise(function(c, d) {
    var e = a.length, f = [];
    if (e) {
      for (var h = function(a, d) {
        e--;
        f[a] = d;
        0 == e && c(f);
      }, l = function(a) {
        d(a);
      }, m = 0, n;n = a[m];m++) {
        n.then(g.yc(h, m), l);
      }
    } else {
      c(f);
    }
  });
};
g.Promise.iv = function(a) {
  return new g.Promise(function(c, d) {
    var e = a.length, f = [];
    if (e) {
      for (var h = function(a) {
        c(a);
      }, l = function(a, c) {
        e--;
        f[a] = c;
        0 == e && d(f);
      }, m = 0, n;n = a[m];m++) {
        n.then(h, g.yc(l, m));
      }
    } else {
      c(void 0);
    }
  });
};
g.Promise.Mx = function() {
  var a, c, d = new g.Promise(function(d, f) {
    a = d;
    c = f;
  });
  return new g.Promise.ml(d, a, c);
};
g.Promise.prototype.then = function(a, c, d) {
  g.Promise.gc && this.Wg(Error("then"));
  return this.gm(g.isFunction(a) ? a : null, g.isFunction(c) ? c : null, d);
};
g.Thenable.Vg(g.Promise);
b = g.Promise.prototype;
b.cancel = function(a) {
  this.X == g.Promise.J.Ma && g.async.run(function() {
    var c = new g.Promise.Fb(a);
    this.hh(c);
  }, this);
};
b.hh = function(a) {
  this.X == g.Promise.J.Ma && (this.xa ? (this.xa.ym(this, a), this.xa = null) : this.Ja(g.Promise.J.Na, a));
};
b.ym = function(a, c) {
  if (this.Ba) {
    for (var d = 0, e = -1, f = 0, h;h = this.Ba[f];f++) {
      if (h = h.ub) {
        if (d++, h == a && (e = f), 0 <= e && 1 < d) {
          break;
        }
      }
    }
    0 <= e && (this.X == g.Promise.J.Ma && 1 == d ? this.hh(c) : (d = this.Ba.splice(e, 1)[0], this.Ch(d, g.Promise.J.Na, c)));
  }
};
b.fm = function(a) {
  this.Ba && this.Ba.length || this.X != g.Promise.J.fc && this.X != g.Promise.J.Na || this.Gi();
  this.Ba || (this.Ba = []);
  this.Ba.push(a);
};
b.gm = function(a, c, d) {
  var e = {ub:null, zi:null, Ai:null};
  e.ub = new g.Promise(function(f, h) {
    e.zi = a ? function(c) {
      try {
        var e = a.call(d, c);
        f(e);
      } catch (n) {
        h(n);
      }
    } : f;
    e.Ai = c ? function(a) {
      try {
        var e = c.call(d, a);
        !g.W(e) && a instanceof g.Promise.Fb ? h(a) : f(e);
      } catch (n) {
        h(n);
      }
    } : h;
  });
  e.ub.xa = this;
  this.fm(e);
  return e.ub;
};
b.Wi = function(a) {
  this.X = g.Promise.J.Ma;
  this.Ja(g.Promise.J.fc, a);
};
b.Xi = function(a) {
  this.X = g.Promise.J.Ma;
  this.Ja(g.Promise.J.Na, a);
};
b.Ja = function(a, c) {
  if (this.X == g.Promise.J.Ma) {
    if (this == c) {
      a = g.Promise.J.Na, c = new TypeError("Promise cannot resolve to itself");
    } else {
      if (g.Thenable.fo(c)) {
        this.X = g.Promise.J.Sf;
        c.then(this.Wi, this.Xi, this);
        return;
      }
      if (g.isObject(c)) {
        try {
          var d = c.then;
          if (g.isFunction(d)) {
            this.pq(c, d);
            return;
          }
        } catch (e) {
          a = g.Promise.J.Na, c = e;
        }
      }
    }
    this.tf = c;
    this.X = a;
    this.xa = null;
    this.Gi();
    a != g.Promise.J.Na || c instanceof g.Promise.Fb || g.Promise.nm(this, c);
  }
};
b.pq = function(a, c) {
  this.X = g.Promise.J.Sf;
  var d = this, e = !1, f = function(a) {
    e || (e = !0, d.Wi(a));
  }, h = function(a) {
    e || (e = !0, d.Xi(a));
  };
  try {
    c.call(a, f, h);
  } catch (l) {
    h(l);
  }
};
b.Gi = function() {
  this.Be || (this.Be = !0, g.async.run(this.cn, this));
};
b.cn = function() {
  for (;this.Ba && this.Ba.length;) {
    var a = this.Ba;
    this.Ba = null;
    for (var c = 0;c < a.length;c++) {
      g.Promise.gc && this.uh++, this.Ch(a[c], this.X, this.tf);
    }
  }
  this.Be = !1;
};
b.Ch = function(a, c, d) {
  a.ub && (a.ub.xa = null);
  c == g.Promise.J.fc ? a.zi(d) : (a.ub && this.xp(), a.Ai(d));
};
b.Wg = function(a) {
  if (g.Promise.gc && g.isString(a.stack)) {
    var c = a.stack.split("\n", 4)[3];
    a = a.message;
    a += Array(11 - a.length).join(" ");
    this.Bf.push(a + c);
  }
};
b.Zg = function(a) {
  if (g.Promise.gc && a && g.isString(a.stack) && this.Bf.length) {
    for (var c = ["Promise trace:"], d = this;d;d = d.xa) {
      for (var e = this.uh;0 <= e;e--) {
        c.push(d.Bf[e]);
      }
      c.push("Value: [" + (d.X == g.Promise.J.Na ? "REJECTED" : "FULFILLED") + "] <" + String(d.tf) + ">");
    }
    a.stack += "\n\n" + c.join("\n");
  }
};
b.xp = function() {
  if (0 < g.Promise.sb) {
    for (var a = this;a && a.Jd;a = a.xa) {
      g.global.clearTimeout(a.Jd), a.Jd = 0;
    }
  } else {
    if (0 == g.Promise.sb) {
      for (a = this;a && a.hd;a = a.xa) {
        a.hd = !1;
      }
    }
  }
};
g.Promise.nm = function(a, c) {
  0 < g.Promise.sb ? a.Jd = g.global.setTimeout(function() {
    a.Zg(c);
    g.Promise.Me.call(null, c);
  }, g.Promise.sb) : 0 == g.Promise.sb && (a.hd = !0, g.async.run(function() {
    a.hd && (a.Zg(c), g.Promise.Me.call(null, c));
  }));
};
g.Promise.Me = g.async.Ti;
g.Promise.hx = function(a) {
  g.Promise.Me = a;
};
g.Promise.Fb = function(a) {
  g.debug.Error.call(this, a);
};
g.Sa(g.Promise.Fb, g.debug.Error);
g.Promise.Fb.prototype.name = "cancel";
g.Promise.ml = function(a, c, d) {
  this.promise = a;
  this.resolve = c;
  this.reject = d;
};
g.result = {};
g.result.pa = function() {
};
g.result.pa.prototype.ej = function() {
};
g.result.pa.qb = {Ng:"success", ERROR:"error", Ma:"pending"};
b = g.result.pa.prototype;
b.getState = function() {
};
b.Th = function() {
};
b.getError = function() {
};
b.cancel = function() {
};
b.md = function() {
};
g.result.pa.Rd = function() {
};
g.Sa(g.result.pa.Rd, Error);
g.result.fb = function() {
  this.X = g.result.pa.qb.Ma;
  this.Qa = [];
  this.Ae = this.cj = void 0;
};
g.Thenable.Vg(g.result.fb);
g.result.fb.ee = function() {
  g.debug.Error.call(this, "Multiple attempts to set the state of this Result");
};
g.Sa(g.result.fb.ee, g.debug.Error);
b = g.result.fb.prototype;
b.getState = function() {
  return this.X;
};
b.Th = function() {
  return this.cj;
};
b.getError = function() {
  return this.Ae;
};
b.ej = function(a, c) {
  this.nd() ? this.Qa.push({callback:a, scope:c || null}) : a.call(c, this);
};
b.Yp = function(a) {
  if (this.nd()) {
    this.cj = a, this.X = g.result.pa.qb.Ng, this.fh();
  } else {
    if (!this.md()) {
      throw new g.result.fb.ee;
    }
  }
};
b.Ki = function(a) {
  if (this.nd()) {
    this.Ae = a, this.X = g.result.pa.qb.ERROR, this.fh();
  } else {
    if (!this.md()) {
      throw new g.result.fb.ee;
    }
  }
};
b.fh = function() {
  var a = this.Qa;
  this.Qa = [];
  for (var c = 0;c < a.length;c++) {
    var d = a[c];
    d.callback.call(d.scope, this);
  }
};
b.nd = function() {
  return this.X == g.result.pa.qb.Ma;
};
b.cancel = function() {
  return this.nd() ? (this.Ki(new g.result.pa.Rd), !0) : !1;
};
b.md = function() {
  return this.X == g.result.pa.qb.ERROR && this.Ae instanceof g.result.pa.Rd;
};
b.then = function(a, c, d) {
  var e, f, h = new g.Promise(function(a, c) {
    e = a;
    f = c;
  });
  this.ej(function(a) {
    a.md() ? h.cancel() : a.getState() == g.result.pa.qb.Ng ? e(a.Th()) : a.getState() == g.result.pa.qb.ERROR && f(a.getError());
  });
  return h.then(a, c, d);
};
g.result.fb.mv = function(a) {
  var c = new g.result.fb;
  a.then(c.Yp, c.Ki, c);
  return c;
};
k.bk = function() {
  this.hasNetworkSoftware = this.networkDescription = this.gpu = this.cpu = this.googleUsername = null;
};
k.ka = {Eg:"receiverIdToken", Ik:"mirrorSettings", Vl:"userNotification", zl:"siteTokens", Vj:"feedback", Zj:"fixedIps", Qj:"enableCloud", xj:"cloudDevice", ek:"hangoutsStatus", dk:"hangoutsDefaultDomain", vl:"sendStatsEnabled", lk:"lastMirrorDataAutoSubmitTimeMillis", Jk:"mirrorPerformanceData", Yk:"oneOffChangeVersion"};
k.bt = function() {
};
k.Zk = function(a) {
  this.Db = a;
};
k.Zk.prototype.Sb = function() {
  return this.Db;
};
k.Fl = {};
k.Fl.Oq = [];
k.Xl = function() {
  this.dismissClicks = this.earliestTimeToShowWarning = this.sessionsBeforeWarning = 0;
  this.enhancedCastingNotificationDismissed = this.statsCollectNotificationDismissed = this.intelBadCpuWarningDismissed = this.castAppNotificationDismissed = !1;
};
k.Aa = function() {
  this.ga = {};
  this.Vn();
  this.Ni = this.uq = this.$p = !1;
};
g.mm(k.Aa);
k.Aa.ik = {Gj:"disabled", bb:"enabled", Ar:"initialized"};
k.Aa.Zq = "ChromeCast";
k.Aa.Ur = 20;
k.Aa.Ej = {useCastStreaming:!0, tabCaptureSettings:!0, appEngineReceiverIds:!0, receiverUrl:!0, flingEnabled:!0, customReceiverVersion:!0, enableCustomReceiverVersion:!0, sendUsageEnabled:!0, mirrorLinkProtection:!0, autoOptedInCastStreaming:!0};
k.Aa.prototype.Vn = function() {
  this.ga[k.ka.Ik] = new k.i.v;
  this.ga[k.ka.Vj] = new k.bk;
  this.ga[k.ka.Vl] = new k.Xl;
  this.ga[k.ka.zl] = {};
  this.ga[k.ka.vl] = !0;
  this.ga[k.ka.Zj] = [];
  this.ga[k.ka.Qj] = !1;
  this.ga[k.ka.xj] = {};
  this.ga[k.ka.ek] = k.Aa.ik.Gj;
  this.ga[k.ka.dk] = "";
  this.ga[k.ka.lk] = 0;
  this.ga[k.ka.Jk] = [];
  this.ga[k.ka.Yk] = 0;
};
k.Aa.prototype.Kp = function() {
  this.$p ? (g.log.info(this.rd, "Saving settings to storage."), this.uq ? (localStorage.settings = JSON.stringify(this.ga), this.Ni && (chrome.storage.local.clear(), this.Ni = !1)) : chrome.storage.local.set(this.ga, g.bind(function() {
    chrome.runtime.lastError ? g.log.Kd(this.rd, "Failed to save settings to chrome.storage.") : g.log.info(this.rd, "Successfully saved settings to storage.");
  }, this))) : g.log.Kd(this.rd, "Aborting saving settings before initialization.");
};
k.Aa.prototype.Cn = function() {
  var a = this.ga[k.ka.Eg];
  a || (a = g.b.An(), this.ga[k.ka.Eg] = a, this.Kp());
  return a;
};
g.k = {};
g.k.iq = function(a) {
  for (var c = [], d = 0, e = 0;e < a.length;e++) {
    for (var f = a.charCodeAt(e);255 < f;) {
      c[d++] = f & 255, f >>= 8;
    }
    c[d++] = f;
  }
  return c;
};
g.k.wm = function(a) {
  if (8192 > a.length) {
    return String.fromCharCode.apply(null, a);
  }
  for (var c = "", d = 0;d < a.length;d += 8192) {
    var e = g.a.slice(a, d, d + 8192), c = c + String.fromCharCode.apply(null, e)
  }
  return c;
};
g.k.ku = function(a) {
  return g.a.map(a, function(a) {
    a = a.toString(16);
    return 1 < a.length ? a : "0" + a;
  }).join("");
};
g.k.Jv = function(a) {
  for (var c = [], d = 0;d < a.length;d += 2) {
    c.push(parseInt(a.substring(d, d + 2), 16));
  }
  return c;
};
g.k.sx = function(a) {
  a = a.replace(/\r\n/g, "\n");
  for (var c = [], d = 0, e = 0;e < a.length;e++) {
    var f = a.charCodeAt(e);
    128 > f ? c[d++] = f : (2048 > f ? c[d++] = f >> 6 | 192 : (c[d++] = f >> 12 | 224, c[d++] = f >> 6 & 63 | 128), c[d++] = f & 63 | 128);
  }
  return c;
};
g.k.Lx = function(a) {
  for (var c = [], d = 0, e = 0;d < a.length;) {
    var f = a[d++];
    if (128 > f) {
      c[e++] = String.fromCharCode(f);
    } else {
      if (191 < f && 224 > f) {
        var h = a[d++];
        c[e++] = String.fromCharCode((f & 31) << 6 | h & 63);
      } else {
        var h = a[d++], l = a[d++];
        c[e++] = String.fromCharCode((f & 15) << 12 | (h & 63) << 6 | l & 63);
      }
    }
  }
  return c.join("");
};
g.k.Qx = function(a, c) {
  for (var d = [], e = 0;e < a.length;e++) {
    d.push(a[e] ^ c[e]);
  }
  return d;
};
g.k.p = {};
g.k.p.mc = null;
g.k.p.Wc = null;
g.k.p.Uc = null;
g.k.p.Vc = null;
g.k.p.Ud = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
g.k.p.Td = g.k.p.Ud + "+/=";
g.k.p.Zf = g.k.p.Ud + "-_.";
g.k.p.fg = g.userAgent.bg || g.userAgent.lc || g.userAgent.hc || "function" == typeof g.global.atob;
g.k.p.xh = function(a, c) {
  if (!g.V(a)) {
    throw Error("encodeByteArray takes an array as a parameter");
  }
  g.k.p.Wh();
  for (var d = c ? g.k.p.Uc : g.k.p.mc, e = [], f = 0;f < a.length;f += 3) {
    var h = a[f], l = f + 1 < a.length, m = l ? a[f + 1] : 0, n = f + 2 < a.length, p = n ? a[f + 2] : 0, q = h >> 2, h = (h & 3) << 4 | m >> 4, m = (m & 15) << 2 | p >> 6, p = p & 63;
    n || (p = 64, l || (m = 64));
    e.push(d[q], d[h], d[m], d[p]);
  }
  return e.join("");
};
g.k.p.Vu = function(a, c) {
  return g.k.p.fg && !c ? g.global.btoa(a) : g.k.p.xh(g.k.iq(a), c);
};
g.k.p.Pu = function(a, c) {
  return g.k.p.fg && !c ? g.global.atob(a) : g.k.wm(g.k.p.Tm(a, c));
};
g.k.p.Tm = function(a, c) {
  g.k.p.Wh();
  for (var d = c ? g.k.p.Vc : g.k.p.Wc, e = [], f = 0;f < a.length;) {
    var h = d[a.charAt(f++)], l = f < a.length ? d[a.charAt(f)] : 0;
    ++f;
    var m = f < a.length ? d[a.charAt(f)] : 64;
    ++f;
    var n = f < a.length ? d[a.charAt(f)] : 64;
    ++f;
    if (null == h || null == l || null == m || null == n) {
      throw Error();
    }
    e.push(h << 2 | l >> 4);
    64 != m && (e.push(l << 4 & 240 | m >> 2), 64 != n && e.push(m << 6 & 192 | n));
  }
  return e;
};
g.k.p.Wh = function() {
  if (!g.k.p.mc) {
    g.k.p.mc = {};
    g.k.p.Wc = {};
    g.k.p.Uc = {};
    g.k.p.Vc = {};
    for (var a = 0;a < g.k.p.Td.length;a++) {
      g.k.p.mc[a] = g.k.p.Td.charAt(a), g.k.p.Wc[g.k.p.mc[a]] = a, g.k.p.Uc[a] = g.k.p.Zf.charAt(a), g.k.p.Vc[g.k.p.Uc[a]] = a, a >= g.k.p.Ud.length && (g.k.p.Wc[g.k.p.Zf.charAt(a)] = a, g.k.p.Vc[g.k.p.Td.charAt(a)] = a);
    }
  }
};
g.k.hg = function() {
  this.gb = -1;
};
g.k.Sha1 = function() {
  g.k.hg.call(this);
  this.gb = 64;
  this.R = [];
  this.pe = [];
  this.dm = [];
  this.wd = [];
  this.wd[0] = 128;
  for (var a = 1;a < this.gb;++a) {
    this.wd[a] = 0;
  }
  this.Id = this.Tb = 0;
  this.reset();
};
g.Sa(g.k.Sha1, g.k.hg);
g.k.Sha1.prototype.reset = function() {
  this.R[0] = 1732584193;
  this.R[1] = 4023233417;
  this.R[2] = 2562383102;
  this.R[3] = 271733878;
  this.R[4] = 3285377520;
  this.Id = this.Tb = 0;
};
g.k.Sha1.prototype.Xc = function(a, c) {
  c || (c = 0);
  var d = this.dm;
  if (g.isString(a)) {
    for (var e = 0;16 > e;e++) {
      d[e] = a.charCodeAt(c) << 24 | a.charCodeAt(c + 1) << 16 | a.charCodeAt(c + 2) << 8 | a.charCodeAt(c + 3), c += 4;
    }
  } else {
    for (e = 0;16 > e;e++) {
      d[e] = a[c] << 24 | a[c + 1] << 16 | a[c + 2] << 8 | a[c + 3], c += 4;
    }
  }
  for (e = 16;80 > e;e++) {
    var f = d[e - 3] ^ d[e - 8] ^ d[e - 14] ^ d[e - 16];
    d[e] = (f << 1 | f >>> 31) & 4294967295;
  }
  for (var h = this.R[0], l = this.R[1], m = this.R[2], n = this.R[3], p = this.R[4], q, e = 0;80 > e;e++) {
    40 > e ? 20 > e ? (f = n ^ l & (m ^ n), q = 1518500249) : (f = l ^ m ^ n, q = 1859775393) : 60 > e ? (f = l & m | n & (l | m), q = 2400959708) : (f = l ^ m ^ n, q = 3395469782), f = (h << 5 | h >>> 27) + f + p + q + d[e] & 4294967295, p = n, n = m, m = (l << 30 | l >>> 2) & 4294967295, l = h, h = f;
  }
  this.R[0] = this.R[0] + h & 4294967295;
  this.R[1] = this.R[1] + l & 4294967295;
  this.R[2] = this.R[2] + m & 4294967295;
  this.R[3] = this.R[3] + n & 4294967295;
  this.R[4] = this.R[4] + p & 4294967295;
};
g.k.Sha1.prototype.update = function(a, c) {
  if (null != a) {
    g.W(c) || (c = a.length);
    for (var d = c - this.gb, e = 0, f = this.pe, h = this.Tb;e < c;) {
      if (0 == h) {
        for (;e <= d;) {
          this.Xc(a, e), e += this.gb;
        }
      }
      if (g.isString(a)) {
        for (;e < c;) {
          if (f[h] = a.charCodeAt(e), ++h, ++e, h == this.gb) {
            this.Xc(f);
            h = 0;
            break;
          }
        }
      } else {
        for (;e < c;) {
          if (f[h] = a[e], ++h, ++e, h == this.gb) {
            this.Xc(f);
            h = 0;
            break;
          }
        }
      }
    }
    this.Tb = h;
    this.Id += c;
  }
};
g.k.Sha1.prototype.Wm = function() {
  var a = [], c = 8 * this.Id;
  56 > this.Tb ? this.update(this.wd, 56 - this.Tb) : this.update(this.wd, this.gb - (this.Tb - 56));
  for (var d = this.gb - 1;56 <= d;d--) {
    this.pe[d] = c & 255, c /= 256;
  }
  this.Xc(this.pe);
  for (d = c = 0;5 > d;d++) {
    for (var e = 24;0 <= e;e -= 8) {
      a[c] = this.R[d] >> e & 255, ++c;
    }
  }
  return a;
};
k.Gg = {};
k.Gg.ln = function(a) {
  var c = k.Aa.Ge().Cn(), d = new g.k.Sha1;
  d.update(a);
  d.update(c);
  return "r" + g.k.p.xh(d.Wm(), !0);
};
k.$ = function(a, c) {
  this.kn = g.b.truncate(a, k.$.uk);
  this.Zi = c;
  this.Am = this.Xn = null;
  this.Rn = k.Gg.ln(c);
  new g.g.Map;
  this.np = new g.g.la;
  this.qm = new g.g.la;
};
k.$.uk = 200;
k.$.ae = {CAST:"cast", DIAL:"dial", Bk:"mesi", Vq:"cloud"};
k.$.Iq = {AVAILABLE:"available", UNAVAILABLE:"unavailable", Sl:"unknown"};
k.$.jr = {Pq:"chromecast", Sl:"unknown"};
k.$.Hc = {NONE:0, VIDEO_OUT:1, VIDEO_IN:2, AUDIO_OUT:4, AUDIO_IN:8, fr:16};
b = k.$.prototype;
b.isLocal = function() {
  return!!this.Xn;
};
b.Df = function(a) {
  return this.np.contains(a);
};
b.tn = function() {
  return k.je.vf(this.kn) || "";
};
b.pn = function() {
  return this.Am;
};
b.getId = function() {
  return this.Rn;
};
b.isAvailable = function(a) {
  return this.qm.contains(a);
};
b.equals = function(a) {
  return this.Zi == a.Zi;
};
k.Q = {};
k.Q.Xd = "urn:x-cast:";
k.Q.tk = 128;
k.Q.vo = function(a) {
  return a.length > k.Q.Xd.length && g.b.fq(a, k.Q.Xd) && a.length <= k.Q.tk;
};
k.Q.Qb = function(a) {
  return k.Q.Xd + "com.google.cast." + a;
};
k.Q.zj = {zt:k.Q.Qb("tp.connection"), At:k.Q.Qb("tp.heartbeat"), ht:k.Q.Qb("receiver"), Vr:k.Q.Qb("media"), Wr:k.Q.Qb("media.universalRemote.optIn"), cm:k.Q.Qb("webrtc")};
k.Q.Hl = g.object.Vi(k.Q.zj);
k.Q.$n = function(a) {
  return k.Q.Hl.hasOwnProperty(a);
};
k.na = {};
k.na.zv = function(a, c) {
  if (!c.applications || 1 != c.applications.length) {
    return null;
  }
  var d = k.na.En(a, c.applications[0]);
  d.receiver.volume = c.volume;
  g.jb(c.isActiveInput) && (d.receiver.isActiveInput = c.isActiveInput);
  return d;
};
k.na.En = function(a, c) {
  var d = k.na.Bn(a), d = new chrome.cast.q(c.sessionId, c.appId, c.displayName, c.appImages, d);
  d.senderApps = c.senderApps;
  d.namespaces = c.namespaces || [];
  d.transportId = c.transportId;
  d.statusText = c.statusText;
  return d;
};
k.na.zm = function(a) {
  var c = [];
  if (!a) {
    return c;
  }
  a & k.$.Hc.VIDEO_OUT && c.push(chrome.cast.ob.VIDEO_OUT);
  a & k.$.Hc.VIDEO_IN && c.push(chrome.cast.ob.VIDEO_IN);
  a & k.$.Hc.AUDIO_OUT && c.push(chrome.cast.ob.AUDIO_OUT);
  a & k.$.Hc.AUDIO_IN && c.push(chrome.cast.ob.AUDIO_IN);
  return c;
};
k.na.Bn = function(a) {
  var c = new chrome.cast.$(a.getId(), a.tn(), k.na.zm(a.pn()));
  c.receiverType = k.na.Dn(a);
  return c;
};
k.na.Dn = function(a) {
  return a.Df(k.$.ae.CAST) ? chrome.cast.Wa.CAST : a.Df(k.$.ae.DIAL) ? chrome.cast.Wa.DIAL : a.Df(k.$.ae.Bk) ? chrome.cast.Wa.HANGOUT : chrome.cast.Wa.CUSTOM;
};
k.na.mw = function(a, c) {
  if (a.statusText != c.statusText) {
    return!0;
  }
  for (var d = a.namespaces || [], e = c.namespaces || [], f = 0;f < d.length;f++) {
    if (!e.some(function(a) {
      return a.name == d[f].name;
    })) {
      return!0;
    }
  }
  return a.receiver.volume.level != c.receiver.volume.level || a.receiver.volume.muted != c.receiver.volume.muted ? !0 : !1;
};
k.na.Di = function(a) {
  g.isArray(a) ? a.forEach(k.na.Di) : g.isObject(a) && Object.keys(a).forEach(function(c) {
    g.uc(a[c]) ? delete a[c] : k.na.Di(a[c]);
  });
};
k.na.Fv = function(a, c) {
  return a.namespaces.some(function(a) {
    return a.name == c;
  });
};
k.Pg = function(a, c) {
  this.type = k.M.Ig;
  this.requestId = null;
  this.volume = a;
  this.expectedVolume = c || null;
};
k.Y = {};
k.Y.uu = function(a) {
  return!a || !g.isString(a.sessionId) || !g.O(a.media) || g.O(a.autoplay) && !g.jb(a.autoplay) || g.O(a.currentTime) && !g.isNumber(a.currentTime) ? !1 : k.Y.Gm(a.media);
};
k.Y.Gm = function(a) {
  return!a || !g.isString(a.contentId) || 1E3 < a.contentId.length || !g.object.Ob(chrome.cast.media.fe, a.streamType) || !g.isString(a.contentType) || g.O(a.duration) && !g.isNumber(a.duration) ? !1 : !0;
};
k.Y.Em = function(a) {
  return!!a && g.O(a.sessionId) && g.isString(a.namespaceName) && k.Q.vo(a.namespaceName) && !k.Q.$n(a.namespaceName);
};
k.Y.Dm = function(a) {
  return a && g.isFunction(a.sessionListener) && g.isFunction(a.receiverListener) ? k.Y.kh(a.sessionRequest) : !1;
};
k.Y.Fm = function(a) {
  return a ? !g.a.find(a, function(a) {
    return!((a.receiverType == chrome.cast.Wa.CUSTOM || a.receiverType == chrome.cast.Wa.DIAL) && g.O(a.friendlyName) && 0 == a.capabilities.length && g.uc(a.volume));
  }) : !1;
};
k.Y.kh = function(a) {
  return!a || !g.O(a.appId) || g.O(a.dialRequest) && (!g.isString(a.dialRequest.appName) || g.O(a.dialRequest.launchParameter) && !g.isString(a.dialRequest.launchParameter)) ? !1 : !0;
};
k.Y.Hm = function(a) {
  return a && g.O(a.volume) && k.Y.lh(a.volume) ? g.O(a.expectedVolume) ? k.Y.lh(a.expectedVolume) : !0 : !1;
};
k.Y.lh = function(a) {
  return a ? g.O(a.level) ? g.isNumber(a.level) && 0 <= a.level && 1 >= a.level : g.jb(a.muted) : !1;
};
k.Y.tu = function(a) {
  return!!a && g.jb(a.doLaunch) && (!g.O(a.launchParameter) || g.isString(a.launchParameter));
};
k.T = function(a, c, d) {
  this.Qi = a;
  this.ye = c;
  this.Ef = g.isNumber(d) ? d : 0;
  this.od = !1;
  this.Bc = null;
};
k.T.uj = 432E5;
k.T.prototype.po = function() {
  return this.od;
};
k.T.prototype.Ja = function() {
  this.od = !0;
  this.ye = this.Qi = null;
  this.Bc && (clearTimeout(this.Bc), this.Bc = null);
};
k.T.xi = function() {
};
k.T.prototype.aj = function() {
  var a = this.Qi;
  this.Ja();
  return a || k.T.xi;
};
k.T.prototype.$i = function() {
  var a = this.ye;
  this.Ja();
  return a || k.T.xi;
};
k.T.prototype.Oi = function(a, c) {
  if (!this.od && !this.Bc) {
    var d = function() {
      if (!this.od) {
        a && a();
        var d = this.ye;
        this.Ja();
        if (0 < this.Ef) {
          var f = new chrome.cast.Error(chrome.cast.La.TIMEOUT);
          c && (f.description = c);
          d(f);
        }
      }
    }.bind(this);
    this.Bc = setTimeout(d, 0 < this.Ef ? this.Ef : k.T.uj);
  }
};
k.Gr = {};
k.ta = function(a, c, d, e, f, h) {
  this.type = a;
  this.message = c;
  this.seqNum = d || null;
  this.clientId = e || null;
  this.appOrigin = null;
  this.timeoutMillis = g.isNumber(f) ? f : 0;
  this.receiverId = h || null;
  this.receiverList = null;
};
k.F = {ig:"iframe_init_result", Uj:"fail_to_connect_to_extension", Sq:"client_reconnect", Pc:"v2_message", Hf:"app_message", vj:"client_init", ok:"log_message", fl:"request_session", gl:"request_session_by_id", mk:"leave_session", Rq:"client_disconnect", wl:"set_custom_receivers", Uf:"custom_dial_launch_response", xl:"set_receiver_display_status", al:"query_tab_broadcast_status", cl:"receiver_availability", bl:"receiver_action", wg:"new_session", Sg:"update_session", Ij:"disconnect_session", el:"remove_session", 
Cq:"app_message_success", Pr:"leave_session_success", vt:"set_receiver_volume_success", st:"set_custom_receivers_success", ERROR:"error", yj:"custom_dial_launch_request", ut:"set_receiver_display_status_success", yt:"tab_broadcast_status"};
k.Jc = function() {
  this.w = {};
};
b = k.Jc.prototype;
b.add = function(a, c) {
  var d = this.w[a];
  if (d) {
    return-1 == d.indexOf(c) && d.push(c), !1;
  }
  this.w[a] = [c];
  return!0;
};
b.remove = function(a, c) {
  var d = this.w[a];
  if (!d) {
    return!1;
  }
  var e = d.indexOf(c);
  if (-1 == e) {
    return!1;
  }
  if (1 == d.length) {
    return delete this.w[a], !0;
  }
  d.splice(e, 1);
  return!1;
};
b.Ci = function(a) {
  if (!(a in this.w)) {
    return!1;
  }
  delete this.w[a];
  return!0;
};
b.pp = function(a) {
  var c = !1;
  Object.keys(this.w).forEach(function(d) {
    0 == d.indexOf(a) && (delete this.w[d], c = !0);
  }, this);
  return c;
};
b.get = function(a) {
  return this.w[a] || [];
};
b.contains = function(a, c) {
  return-1 != this.get(a).indexOf(c);
};
k.Xs = function() {
  this.type = k.M.Wd;
  this.requestId = null;
  this.status = [];
  this.customData = null;
  this.sessionId = "";
};
chrome.cast.dc = function(a, c) {
  this.Sn = a;
  this.Yg = c;
  this.Xg = null;
};
chrome.cast.dc.prototype.init = function() {
  window.addEventListener("message", this.bp.bind(this), !1);
};
chrome.cast.dc.prototype.Op = function(a) {
  this.Xg = a;
};
chrome.cast.dc.prototype.bp = function(a) {
  a.source != window && a.origin == this.Yg && (a = a.data, a.type == k.F.ig && (this.eo = !a.message), this.Xg(a));
};
chrome.cast.dc.prototype.wf = function(a) {
  this.eo && this.Sn.contentWindow.postMessage(a, this.Yg);
};
k.Og = function() {
  this.Zb = {};
  this.td = {};
};
b = k.Og.prototype;
b.up = function(a, c) {
  var d = this.Zb[a];
  return d ? (d.status = c, d.media.forEach(function(a) {
    delete this.td[this.Ie(a)];
  }, this), delete this.Zb[a], !0) : !1;
};
b.rp = function(a) {
  delete this.td[this.Ie(a)];
  var c = this.Zb[a.sessionId];
  c && (a = c.media.indexOf(a), -1 != a && c.media.splice(a, 1));
};
b.Mm = function(a) {
  if (a.sessionId == chrome.cast.q.Vf) {
    return a;
  }
  var c = this.Zb[a.sessionId];
  if (c) {
    return c.statusText = a.statusText, c.namespaces = a.namespaces || [], c.receiver.volume = a.receiver.volume, c;
  }
  var c = new chrome.cast.q(a.sessionId, a.appId, a.displayName, a.appImages, a.receiver), d;
  for (d in a) {
    "media" == d ? c.media = a.media.map(function(a) {
      a = this.ph(a);
      a.af = !1;
      a.kd = !0;
      return a;
    }.bind(this)) : a.hasOwnProperty(d) && (c[d] = a[d]);
  }
  return this.Zb[a.sessionId] = c;
};
b.ph = function(a) {
  var c = this.Ie(a), d = this.td[c];
  d || (d = new chrome.cast.media.u(a.sessionId, a.mediaSessionId), this.td[c] = d, (c = this.Zb[a.sessionId]) && c.media.push(d));
  for (var e in a) {
    a.hasOwnProperty(e) && ("volume" == e ? (d.volume.level = a.volume.level, d.volume.muted = a.volume.muted) : d[e] = a[e]);
  }
  "currentTime" in a && (d.Ze = g.now());
  return d;
};
b.Ie = function(a) {
  return a.sessionId + "#" + a.mediaSessionId;
};
chrome.cast.ya = function(a) {
  this.Uo = 1E3 * Math.floor(1E5 * Math.random());
  this.ud = a;
  this.Wb = {};
  this.Sc = !1;
  this.Ub = this.qa = this.oe = null;
  this.Tc = new k.Jc;
  this.sd = new k.Jc;
  this.Ac = new k.Jc;
  this.Cd = [];
  this.Ed = new k.Og(this.rd);
  this.Eh = !1;
};
b = chrome.cast.ya.prototype;
b.init = function() {
  this.ud.Op(this.mp.bind(this));
};
b.yn = function() {
  return "a" + this.Uo++;
};
b.Qo = function(a) {
  var c = a.seqNum;
  if (!c) {
    return!1;
  }
  var d = this.Wb[c];
  if (d) {
    var e = a.message;
    a.type == k.F.ERROR ? d.$i()(a.message) : d.aj()(e);
    delete this.Wb[c];
  }
  return!!d;
};
b.Ro = function(a) {
  switch(a.type) {
    case k.F.wg:
    ;
    case k.F.Sg:
      a.message = this.Nm(a.message);
      break;
    case k.F.Pc:
      a = a.message, a.type == k.M.Wd && a.status && (a.status = a.status.map(this.Lm.bind(this)));
  }
};
b.Nm = function(a) {
  return this.Ed.Mm(a);
};
b.mp = function(a) {
  this.Ro(a);
  if (!this.Qo(a)) {
    switch(a.type) {
      case k.F.ig:
        this.Zo(a);
        break;
      case k.F.cl:
        this.hp(a);
        break;
      case k.F.bl:
        this.gp(a);
        break;
      case k.F.Uj:
        this.Eh = !0;
        break;
      case k.F.wg:
        this.fp(a);
        break;
      case k.F.Sg:
        this.jp(a);
        break;
      case k.F.Ij:
        this.ap(a);
        break;
      case k.F.el:
        this.ip(a);
        break;
      case k.F.Hf:
        this.cp(a.message);
        break;
      case k.F.Pc:
        this.ep(a);
        break;
      case k.F.yj:
        this.$o(a);
    }
  }
};
b.$o = function(a) {
  var c = a.message;
  this.qa && this.qa.customDialLaunchCallback && this.qa.customDialLaunchCallback(c).then(g.bind(function(c) {
    this.ud.wf(new k.ta(k.F.Uf, c, a.seqNum));
  }, this), g.bind(function() {
    this.ud.wf(new k.ta(k.F.Uf, null, a.seqNum));
  }, this));
};
b.ep = function(a) {
  switch(a.message.type) {
    case k.M.Wd:
      this.dp(a.message);
  }
};
b.dp = function(a) {
  a.status.forEach(this.gh.bind(this));
};
b.fp = function(a) {
  this.qa && this.qa.sessionListener(a.message);
};
b.jp = function(a) {
  (a = a.message) && this.Ac.get(a.sessionId).forEach(function(a) {
    a(!0);
  });
};
b.ap = function(a) {
  this.Ei(a.message, chrome.cast.kc.DISCONNECTED);
};
b.ip = function(a) {
  this.Ei(a.message, chrome.cast.kc.STOPPED);
};
b.Ei = function(a, c) {
  var d = c != chrome.cast.kc.STOPPED;
  this.Ed.up(a, c) && (this.Tc.pp(a + "#"), this.sd.Ci(a), this.Ac.get(a).forEach(function(a) {
    a(d);
  }), this.Ac.Ci(a));
};
b.cp = function(a) {
  this.mn(a.sessionId, a.namespaceName).forEach(function(c) {
    c(a.namespaceName, a.message);
  });
};
b.hp = function(a) {
  if (this.qa) {
    var c = a.message;
    a.receiverList ? this.qa.receiverListener.apply(null, [c, a.receiverList]) : this.qa.receiverListener(c);
  }
};
b.gp = function(a) {
  this.Cd.forEach(function(c) {
    c(a.message.receiver, a.message.receiverAction);
  }, this);
};
b.Zo = function(a) {
  (a = a.message) ? (this.oe = a, this.Ub && this.Ub.$i()(a)) : (this.Sc = !0, this.Ii(), this.Ub && this.Ub.aj()(void 0));
};
b.xf = function(a, c, d) {
  this.Oa(d) && (a = a || [], k.Y.Fm(a) ? this.Ka(new k.ta(k.F.wl, a), new k.T(c, d)) : d && d(new chrome.cast.Error(chrome.cast.La.INVALID_PARAMETER)));
};
chrome.cast.ya.prototype.setReceiverVolume = function(a, c, d, e) {
  this.Oa(e) && (k.Y.Hm(c) ? (c.sessionId = a, this.Ka(new k.ta(k.F.Pc, c, null, null, chrome.cast.timeout.setReceiverVolume), new k.T(d, e, chrome.cast.timeout.setReceiverVolume))) : e && e(new chrome.cast.Error(chrome.cast.La.INVALID_PARAMETER)));
};
chrome.cast.ya.prototype.leaveSession = function(a, c, d) {
  this.Oa(d) && this.Ka(new k.ta(k.F.mk, a, null, null, chrome.cast.timeout.leaveSession), new k.T(c, d, chrome.cast.timeout.leaveSession));
};
b = chrome.cast.ya.prototype;
b.Hi = function(a, c, d, e) {
  this.Oa(d) && this.Ka(new k.ta(k.F.Pc, a, null, null, e), new k.T(c, d, e));
};
b.bf = function(a) {
  this.Oa(g.wi) && this.Ka(new k.ta(k.F.ok, a));
};
b.Ji = function(a, c, d, e, f, h) {
  null != a && (d.mediaSessionId = a.mediaSessionId, d.sessionId = a.sessionId);
  d.requestId = null;
  d.type = c;
  this.Hi(d, function(a) {
    e && a.status && 1 == a.status.length ? e(a.status[0]) : f && f(new chrome.cast.Error(chrome.cast.La.SESSION_ERROR));
  }, f, h);
};
b.Mp = function(a, c, d) {
  this.Ji(null, k.M.rg, a, function(a) {
    a.kd = !0;
    a.af = !0;
    c && c(a);
  }.bind(this), d, chrome.cast.media.timeout.load);
};
b.Bb = function(a, c, d, e, f, h) {
  this.Ji(a, c, d, function(a) {
    this.gh(a);
    e && e();
  }.bind(this), f, h);
};
b.Lp = function(a, c, d) {
  this.Oa(d) && (k.Y.Em(a) ? this.Ka(new k.ta(k.F.Hf, a, null, null, chrome.cast.timeout.sendCustomMessage), new k.T(c, d, chrome.cast.timeout.sendCustomMessage)) : d && d(new chrome.cast.Error(chrome.cast.La.INVALID_PARAMETER)));
};
b.Ii = function() {
  this.qa && this.Sc && this.Ka(new k.ta(k.F.vj, new k.mj(this.qa)));
};
b.Ka = function(a, c) {
  var d = this.yn();
  a.seqNum = d;
  if (this.Wb[d] && !this.Wb[d].po()) {
    throw "Try to send a request with the existing seqNum: " + a.seqNum;
  }
  c && (this.Wb[d] = c, c.Oi(function() {
    delete this.Wb[d];
  }.bind(this)));
  this.ud.wf(a);
};
b.Ye = function(a, c) {
  this.Oa(c) && this.Ka(new k.ta(k.F.al, void 0), new k.T(a, c));
};
b.sc = function(a, c, d) {
  k.Y.Dm(a) ? this.oe ? d && d(this.oe) : this.qa ? c && c() : (this.qa = a, this.Sc ? (this.Ii(), c && c()) : (this.Ub = new k.T(c, d, 5E3), this.Ub.Oi())) : d && d(new chrome.cast.Error(chrome.cast.La.INVALID_PARAMETER));
};
chrome.cast.ya.prototype.requestSession = function(a, c, d, e) {
  this.Oa(c) && (d && !k.Y.kh(d) ? c && c(new chrome.cast.Error(chrome.cast.La.INVALID_PARAMETER)) : (!d && this.qa && (d = this.qa.sessionRequest), this.Ka(new k.ta(k.F.fl, d, null, null, d.requestSessionTimeout, e), new k.T(a, c, 0))));
};
chrome.cast.ya.prototype.rf = function(a) {
  this.Oa(g.wi) && a && this.Ka(new k.ta(k.F.gl, a));
};
chrome.cast.ya.jj = new chrome.cast.Error(chrome.cast.La.API_NOT_INITIALIZED);
chrome.cast.ya.Sj = new chrome.cast.Error(chrome.cast.La.EXTENSION_MISSING);
b = chrome.cast.ya.prototype;
b.Oa = function(a) {
  return this.Sc ? this.Eh ? (a && a(chrome.cast.ya.Sj), !1) : !0 : (a && a(chrome.cast.ya.jj), !1);
};
b.Fe = function(a, c) {
  return a + "#" + c;
};
b.em = function(a, c, d) {
  this.Tc.add(this.Fe(a, c), d);
};
b.op = function(a, c, d) {
  this.Tc.remove(this.Fe(a, c), d);
};
b.mn = function(a, c) {
  return this.Tc.get(this.Fe(a, c));
};
b.le = function(a, c) {
  this.sd.add(a, c);
};
b.of = function(a, c) {
  this.sd.remove(a, c);
};
b.hm = function(a, c) {
  -1 == a.Cc.indexOf(c) && a.Cc.push(c);
};
b.sp = function(a, c) {
  var d = a.Cc.indexOf(c);
  -1 != d && a.Cc.splice(d, 1);
};
b.gh = function(a) {
  if (a.kd) {
    var c = a.playerState != chrome.cast.media.jc.IDLE;
    a.Cc.forEach(function(a) {
      a(c);
    });
    c || this.Ed.rp(a);
  } else {
    a.kd = !0, a.af || this.sd.get(a.sessionId).forEach(function(c) {
      c(a);
    });
  }
};
b.Lm = function(a) {
  return this.Ed.ph(a);
};
b.km = function(a, c) {
  this.Ac.add(a, c);
};
b.vp = function(a, c) {
  this.Ac.remove(a, c);
};
b.me = function(a) {
  this.Cd.push(a);
};
b.pf = function(a) {
  a = this.Cd.indexOf(a);
  0 <= a && this.Cd.splice(a, 1);
};
b.yf = function(a, c, d) {
  this.Oa(d) && this.Ka(new k.ta(k.F.xl, a), new k.T(c, d));
};
chrome.cast.isAvailable = !1;
g.j("chrome.cast.isAvailable", chrome.cast.isAvailable);
chrome.cast.B = null;
chrome.cast.Ye = function(a, c) {
  chrome.cast.B.Ye(a, c);
};
g.j("chrome.cast.isTabBroadcast", chrome.cast.Ye);
chrome.cast.sc = function(a, c, d) {
  chrome.cast.B.sc(a, c, d);
};
g.j("chrome.cast.initialize", chrome.cast.sc);
chrome.cast.requestSession = function(a, c, d, e) {
  chrome.cast.B.requestSession(a, c, d, e);
};
g.j("chrome.cast.requestSession", chrome.cast.requestSession);
chrome.cast.rf = function(a) {
  chrome.cast.B.rf(a);
};
g.j("chrome.cast.requestSessionById", chrome.cast.rf);
chrome.cast.me = function(a) {
  chrome.cast.B.me(a);
};
g.j("chrome.cast.addReceiverActionListener", chrome.cast.me);
chrome.cast.pf = function(a) {
  chrome.cast.B.pf(a);
};
g.j("chrome.cast.removeReceiverActionListener", chrome.cast.pf);
chrome.cast.bf = function(a) {
  chrome.cast.B.bf(a);
};
g.j("chrome.cast.logMessage", chrome.cast.bf);
chrome.cast.xf = function(a, c, d) {
  chrome.cast.B.xf(a, c, d);
};
g.j("chrome.cast.setCustomReceivers", chrome.cast.xf);
chrome.cast.yf = function(a, c, d) {
  chrome.cast.B.yf(a, c, d);
};
g.j("chrome.cast.setReceiverDisplayStatus", chrome.cast.yf);
chrome.cast.q.prototype.Xp = function(a, c, d) {
  chrome.cast.B.setReceiverVolume(this.sessionId, new k.Pg(new chrome.cast.Qc(a, null), this.receiver.volume), c, d);
};
g.A(chrome.cast.q.prototype, "setReceiverVolumeLevel", chrome.cast.q.prototype.Xp);
chrome.cast.q.prototype.Wp = function(a, c, d) {
  chrome.cast.B.setReceiverVolume(this.sessionId, new k.Pg(new chrome.cast.Qc(null, a), this.receiver.volume), c, d);
};
g.A(chrome.cast.q.prototype, "setReceiverMuted", chrome.cast.q.prototype.Wp);
chrome.cast.q.prototype.leave = function(a, c) {
  chrome.cast.B.leaveSession(this.sessionId, a, c);
};
g.A(chrome.cast.q.prototype, "leave", chrome.cast.q.prototype.leave);
chrome.cast.q.prototype.stop = function(a, c) {
  chrome.cast.B.Hi(new k.Gl(this.sessionId), a, c, chrome.cast.timeout.stopSession);
};
g.A(chrome.cast.q.prototype, "stop", chrome.cast.q.prototype.stop);
chrome.cast.q.prototype.sendMessage = function(a, c, d, e) {
  chrome.cast.B.Lp(new k.nj(this.sessionId, a, c), d, e);
};
g.A(chrome.cast.q.prototype, "sendMessage", chrome.cast.q.prototype.sendMessage);
chrome.cast.q.prototype.ne = function(a) {
  chrome.cast.B.km(this.sessionId, a);
};
g.A(chrome.cast.q.prototype, "addUpdateListener", chrome.cast.q.prototype.ne);
chrome.cast.q.prototype.qf = function(a) {
  chrome.cast.B.vp(this.sessionId, a);
};
g.A(chrome.cast.q.prototype, "removeUpdateListener", chrome.cast.q.prototype.qf);
chrome.cast.q.prototype.im = function(a, c) {
  chrome.cast.B.em(this.sessionId, a, c);
};
g.A(chrome.cast.q.prototype, "addMessageListener", chrome.cast.q.prototype.im);
chrome.cast.q.prototype.tp = function(a, c) {
  chrome.cast.B.op(this.sessionId, a, c);
};
g.A(chrome.cast.q.prototype, "removeMessageListener", chrome.cast.q.prototype.tp);
chrome.cast.q.prototype.le = function(a) {
  chrome.cast.B.le(this.sessionId, a);
};
g.A(chrome.cast.q.prototype, "addMediaListener", chrome.cast.q.prototype.le);
chrome.cast.q.prototype.of = function(a) {
  chrome.cast.B.of(this.sessionId, a);
};
g.A(chrome.cast.q.prototype, "removeMediaListener", chrome.cast.q.prototype.of);
chrome.cast.q.prototype.Co = function(a, c, d) {
  a.sessionId = this.sessionId;
  chrome.cast.B.Mp(a, c, d);
};
g.A(chrome.cast.q.prototype, "loadMedia", chrome.cast.q.prototype.Co);
chrome.cast.media.u.prototype.gd = function(a, c, d) {
  a || (a = new chrome.cast.media.eg);
  chrome.cast.B.Bb(this, k.M.qg, a, c, d, chrome.cast.media.timeout.gd);
};
g.A(chrome.cast.media.u.prototype, "getStatus", chrome.cast.media.u.prototype.gd);
chrome.cast.media.u.prototype.play = function(a, c, d) {
  a || (a = new chrome.cast.media.Cg);
  chrome.cast.B.Bb(this, k.M.zk, a, c, d, chrome.cast.media.timeout.play);
};
g.A(chrome.cast.media.u.prototype, "play", chrome.cast.media.u.prototype.play);
chrome.cast.media.u.prototype.pause = function(a, c, d) {
  a || (a = new chrome.cast.media.Bg);
  chrome.cast.B.Bb(this, k.M.yk, a, c, d, chrome.cast.media.timeout.pause);
};
g.A(chrome.cast.media.u.prototype, "pause", chrome.cast.media.u.prototype.pause);
chrome.cast.media.u.prototype.seek = function(a, c, d) {
  chrome.cast.B.Bb(this, k.M.Ak, a, c, d, chrome.cast.media.timeout.seek);
};
g.A(chrome.cast.media.u.prototype, "seek", chrome.cast.media.u.prototype.seek);
chrome.cast.media.u.prototype.stop = function(a, c, d) {
  a || (a = new chrome.cast.media.Qg);
  chrome.cast.B.Bb(this, k.M.tg, a, c, d, chrome.cast.media.timeout.stop);
};
g.A(chrome.cast.media.u.prototype, "stop", chrome.cast.media.u.prototype.stop);
chrome.cast.media.u.prototype.Fd = function(a, c, d) {
  chrome.cast.B.Bb(this, k.M.sg, a, c, d, chrome.cast.media.timeout.Fd);
};
g.A(chrome.cast.media.u.prototype, "setVolume", chrome.cast.media.u.prototype.Fd);
chrome.cast.media.u.prototype.dd = function(a, c, d) {
  chrome.cast.B.Bb(this, k.M.xk, a, c, d, chrome.cast.media.timeout.dd);
};
g.A(chrome.cast.media.u.prototype, "editTracksInfo", chrome.cast.media.u.prototype.dd);
chrome.cast.media.u.prototype.kq = function(a) {
  return-1 < this.supportedMediaCommands.indexOf(a);
};
g.A(chrome.cast.media.u.prototype, "supportsCommand", chrome.cast.media.u.prototype.kq);
chrome.cast.media.u.prototype.rn = function() {
  if (this.playerState == chrome.cast.media.jc.PLAYING && 0 <= this.Ze) {
    var a = (g.now() - this.Ze) / 1E3, a = this.currentTime + this.playbackRate * a;
    this.media && null != this.media.duration && a > this.media.duration && (a = this.media.duration);
    0 > a && (a = 0);
    return a;
  }
  return this.currentTime;
};
g.A(chrome.cast.media.u.prototype, "getEstimatedTime", chrome.cast.media.u.prototype.rn);
chrome.cast.media.u.prototype.ne = function(a) {
  chrome.cast.B.hm(this, a);
};
g.A(chrome.cast.media.u.prototype, "addUpdateListener", chrome.cast.media.u.prototype.ne);
chrome.cast.media.u.prototype.qf = function(a) {
  chrome.cast.B.sp(this, a);
};
g.A(chrome.cast.media.u.prototype, "removeUpdateListener", chrome.cast.media.u.prototype.qf);
chrome.cast.zf = function() {
  if (!chrome.cast.Mi && (chrome.cast.Mi = !0, chrome.cast.extensionId)) {
    var a = "chrome-extension://" + chrome.cast.extensionId, c = document.createElement("iframe");
    c.src = a + "/api_iframe.html?appOrigin=" + window.location.origin;
    c.setAttribute("style", "display:none");
    document.body.appendChild(c);
    a = new chrome.cast.dc(c, a);
    a.init();
    chrome.cast.B = new chrome.cast.ya(a);
    chrome.cast.B.init();
    chrome.cast.isAvailable = !0;
    (a = window.__onGCastApiAvailable) && "function" == typeof a && a(!0);
  }
};
chrome.cast.Mi = !1;
"complete" == document.readyState ? chrome.cast.zf() : (window.addEventListener("load", chrome.cast.zf, !1), window.addEventListener("DOMContentLoaded", chrome.cast.zf, !1));
})();
