// src/shim.ts
var _stateCallback = null;
var _blobCache = new Map;
window.notebook = {
  _browserShim: true,
  getConfig: async () => ({ deviceId: "browser", notebookPath: "notebook.json" }),
  onStateChanged: (cb) => {
    _stateCallback = cb;
  },
  onOpenFailed: () => {},
  onCanvasZoom: () => {},
  offStateChanged: () => {},
  offCanvasZoom: () => {},
  getBlob: async (hash) => {
    if (_blobCache.has(hash))
      return _blobCache.get(hash);
    try {
      const resp = await fetch("blobs/" + hash);
      if (!resp.ok)
        return null;
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      _blobCache.set(hash, url);
      return url;
    } catch {
      return null;
    }
  },
  applyOp: () => {},
  applyOps: () => {},
  flush: () => {},
  saveBlob: async () => null,
  saveConfig: () => {},
  saveUiState: () => {},
  savePageView: () => {},
  savePageCaret: () => {},
  open: async () => null,
  getState: async () => null,
  getPath: async () => null,
  pickDirectory: async () => null,
  pickSavePath: async () => null,
  fetchImage: async (_url) => {
    throw new Error("fetchImage not available in browser");
  },
  openExternal: (url) => {
    if (typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))) {
      window.open(url, "_blank");
    }
  }
};
fetch("notebook.json?v=" + Date.now()).then((r) => {
  if (!r.ok)
    throw new Error("Failed to load notebook.json: " + r.status);
  return r.json();
}).then((state) => {
  function migrateBlocks(pages) {
    for (const pg of pages) {
      for (const b of pg.blocks || []) {
        if (b.type === "text" && b.y === 0 && (b.x === 28 || b.x === 16))
          b.x = 0;
      }
      if (pg.children?.length)
        migrateBlocks(pg.children);
    }
  }
  for (const nb of state.notebooks || []) {
    for (const sec of nb.sections || [])
      migrateBlocks(sec.pages || []);
  }
  let sParam = null;
  let pParam = null;
  let pHint = null;
  const hash = window.location.hash;
  if (hash.startsWith("#!/")) {
    const parts = hash.slice(3).split("?");
    const segments = parts[0].split("/").filter(Boolean).map(decodeURIComponent);
    if (segments.length >= 1)
      sParam = segments[0];
    if (segments.length >= 2)
      pParam = segments[1];
    if (parts[1]) {
      const hp = new URLSearchParams(parts[1]);
      if (hp.has("p"))
        pHint = hp.get("p");
    }
  } else {
    const params = new URLSearchParams(window.location.search);
    sParam = params.get("section");
    pParam = params.get("page");
  }
  if (sParam || pParam) {
    const nb = state.notebooks?.[0];
    if (nb) {
      const sec = sParam ? nb.sections.find((s) => s.id === sParam || s.title === sParam) : nb.sections.find((s) => s.id === state.ui?.sectionId) || nb.sections[0];
      if (sec) {
        state.ui = state.ui || { notebookId: null, sectionId: null, pageId: null };
        state.ui.sectionId = sec.id;
        if (pParam || pHint) {
          let findPage = function(pages) {
            for (const p of pages) {
              if (pHint && p.id.startsWith(pHint))
                return p;
              if (pParam && (p.id === pParam || p.title === pParam))
                return p;
              if (p.children?.length) {
                const f = findPage(p.children);
                if (f)
                  return f;
              }
            }
            return null;
          };
          const pg = findPage(sec.pages);
          if (pg) {
            state.ui.pageId = pg.id;
          }
        } else if (sec.pages?.length) {
          state.ui.pageId = sec.pages[0].id;
        }
      }
    }
  }
  if (_stateCallback)
    _stateCallback(state);
}).catch((err) => {
  console.error("[notebound-web] Failed to load notebook:", err);
});

// ../core/node_modules/preact/dist/preact.module.js
var n;
var l;
var u;
var t;
var i;
var r;
var o;
var e;
var f;
var c;
var s;
var a;
var h;
var p = {};
var v = [];
var y = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var d = Array.isArray;
function w(n2, l2) {
  for (var u2 in l2)
    n2[u2] = l2[u2];
  return n2;
}
function g(n2) {
  n2 && n2.parentNode && n2.parentNode.removeChild(n2);
}
function _(l2, u2, t2) {
  var i2, r2, o2, e2 = {};
  for (o2 in u2)
    o2 == "key" ? i2 = u2[o2] : o2 == "ref" ? r2 = u2[o2] : e2[o2] = u2[o2];
  if (arguments.length > 2 && (e2.children = arguments.length > 3 ? n.call(arguments, 2) : t2), typeof l2 == "function" && l2.defaultProps != null)
    for (o2 in l2.defaultProps)
      e2[o2] === undefined && (e2[o2] = l2.defaultProps[o2]);
  return m(l2, e2, i2, r2, null);
}
function m(n2, t2, i2, r2, o2) {
  var e2 = { type: n2, props: t2, key: i2, ref: r2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: undefined, __v: o2 == null ? ++u : o2, __i: -1, __u: 0 };
  return o2 == null && l.vnode != null && l.vnode(e2), e2;
}
function k(n2) {
  return n2.children;
}
function x(n2, l2) {
  this.props = n2, this.context = l2;
}
function S(n2, l2) {
  if (l2 == null)
    return n2.__ ? S(n2.__, n2.__i + 1) : null;
  for (var u2;l2 < n2.__k.length; l2++)
    if ((u2 = n2.__k[l2]) != null && u2.__e != null)
      return u2.__e;
  return typeof n2.type == "function" ? S(n2) : null;
}
function C(n2) {
  if (n2.__P && n2.__d) {
    var u2 = n2.__v, t2 = u2.__e, i2 = [], r2 = [], o2 = w({}, u2);
    o2.__v = u2.__v + 1, l.vnode && l.vnode(o2), z(n2.__P, o2, u2, n2.__n, n2.__P.namespaceURI, 32 & u2.__u ? [t2] : null, i2, t2 == null ? S(u2) : t2, !!(32 & u2.__u), r2), o2.__v = u2.__v, o2.__.__k[o2.__i] = o2, V(i2, o2, r2), u2.__e = u2.__ = null, o2.__e != t2 && M(o2);
  }
}
function M(n2) {
  if ((n2 = n2.__) != null && n2.__c != null)
    return n2.__e = n2.__c.base = null, n2.__k.some(function(l2) {
      if (l2 != null && l2.__e != null)
        return n2.__e = n2.__c.base = l2.__e;
    }), M(n2);
}
function $(n2) {
  (!n2.__d && (n2.__d = true) && i.push(n2) && !I.__r++ || r != l.debounceRendering) && ((r = l.debounceRendering) || o)(I);
}
function I() {
  for (var n2, l2 = 1;i.length; )
    i.length > l2 && i.sort(e), n2 = i.shift(), l2 = i.length, C(n2);
  I.__r = 0;
}
function P(n2, l2, u2, t2, i2, r2, o2, e2, f2, c2, s2) {
  var a2, h2, y2, d2, w2, g2, _2, m2 = t2 && t2.__k || v, b = l2.length;
  for (f2 = A(u2, l2, m2, f2, b), a2 = 0;a2 < b; a2++)
    (y2 = u2.__k[a2]) != null && (h2 = y2.__i != -1 && m2[y2.__i] || p, y2.__i = a2, g2 = z(n2, y2, h2, i2, r2, o2, e2, f2, c2, s2), d2 = y2.__e, y2.ref && h2.ref != y2.ref && (h2.ref && D(h2.ref, null, y2), s2.push(y2.ref, y2.__c || d2, y2)), w2 == null && d2 != null && (w2 = d2), (_2 = !!(4 & y2.__u)) || h2.__k === y2.__k ? f2 = H(y2, f2, n2, _2) : typeof y2.type == "function" && g2 !== undefined ? f2 = g2 : d2 && (f2 = d2.nextSibling), y2.__u &= -7);
  return u2.__e = w2, f2;
}
function A(n2, l2, u2, t2, i2) {
  var r2, o2, e2, f2, c2, s2 = u2.length, a2 = s2, h2 = 0;
  for (n2.__k = new Array(i2), r2 = 0;r2 < i2; r2++)
    (o2 = l2[r2]) != null && typeof o2 != "boolean" && typeof o2 != "function" ? (typeof o2 == "string" || typeof o2 == "number" || typeof o2 == "bigint" || o2.constructor == String ? o2 = n2.__k[r2] = m(null, o2, null, null, null) : d(o2) ? o2 = n2.__k[r2] = m(k, { children: o2 }, null, null, null) : o2.constructor === undefined && o2.__b > 0 ? o2 = n2.__k[r2] = m(o2.type, o2.props, o2.key, o2.ref ? o2.ref : null, o2.__v) : n2.__k[r2] = o2, f2 = r2 + h2, o2.__ = n2, o2.__b = n2.__b + 1, e2 = null, (c2 = o2.__i = T(o2, u2, f2, a2)) != -1 && (a2--, (e2 = u2[c2]) && (e2.__u |= 2)), e2 == null || e2.__v == null ? (c2 == -1 && (i2 > s2 ? h2-- : i2 < s2 && h2++), typeof o2.type != "function" && (o2.__u |= 4)) : c2 != f2 && (c2 == f2 - 1 ? h2-- : c2 == f2 + 1 ? h2++ : (c2 > f2 ? h2-- : h2++, o2.__u |= 4))) : n2.__k[r2] = null;
  if (a2)
    for (r2 = 0;r2 < s2; r2++)
      (e2 = u2[r2]) != null && (2 & e2.__u) == 0 && (e2.__e == t2 && (t2 = S(e2)), E(e2, e2));
  return t2;
}
function H(n2, l2, u2, t2) {
  var i2, r2;
  if (typeof n2.type == "function") {
    for (i2 = n2.__k, r2 = 0;i2 && r2 < i2.length; r2++)
      i2[r2] && (i2[r2].__ = n2, l2 = H(i2[r2], l2, u2, t2));
    return l2;
  }
  n2.__e != l2 && (t2 && (l2 && n2.type && !l2.parentNode && (l2 = S(n2)), u2.insertBefore(n2.__e, l2 || null)), l2 = n2.__e);
  do {
    l2 = l2 && l2.nextSibling;
  } while (l2 != null && l2.nodeType == 8);
  return l2;
}
function T(n2, l2, u2, t2) {
  var i2, r2, o2, e2 = n2.key, f2 = n2.type, c2 = l2[u2], s2 = c2 != null && (2 & c2.__u) == 0;
  if (c2 === null && e2 == null || s2 && e2 == c2.key && f2 == c2.type)
    return u2;
  if (t2 > (s2 ? 1 : 0)) {
    for (i2 = u2 - 1, r2 = u2 + 1;i2 >= 0 || r2 < l2.length; )
      if ((c2 = l2[o2 = i2 >= 0 ? i2-- : r2++]) != null && (2 & c2.__u) == 0 && e2 == c2.key && f2 == c2.type)
        return o2;
  }
  return -1;
}
function j(n2, l2, u2) {
  l2[0] == "-" ? n2.setProperty(l2, u2 == null ? "" : u2) : n2[l2] = u2 == null ? "" : typeof u2 != "number" || y.test(l2) ? u2 : u2 + "px";
}
function F(n2, l2, u2, t2, i2) {
  var r2, o2;
  n:
    if (l2 == "style")
      if (typeof u2 == "string")
        n2.style.cssText = u2;
      else {
        if (typeof t2 == "string" && (n2.style.cssText = t2 = ""), t2)
          for (l2 in t2)
            u2 && l2 in u2 || j(n2.style, l2, "");
        if (u2)
          for (l2 in u2)
            t2 && u2[l2] == t2[l2] || j(n2.style, l2, u2[l2]);
      }
    else if (l2[0] == "o" && l2[1] == "n")
      r2 = l2 != (l2 = l2.replace(f, "$1")), o2 = l2.toLowerCase(), l2 = o2 in n2 || l2 == "onFocusOut" || l2 == "onFocusIn" ? o2.slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + r2] = u2, u2 ? t2 ? u2.u = t2.u : (u2.u = c, n2.addEventListener(l2, r2 ? a : s, r2)) : n2.removeEventListener(l2, r2 ? a : s, r2);
    else {
      if (i2 == "http://www.w3.org/2000/svg")
        l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if (l2 != "width" && l2 != "height" && l2 != "href" && l2 != "list" && l2 != "form" && l2 != "tabIndex" && l2 != "download" && l2 != "rowSpan" && l2 != "colSpan" && l2 != "role" && l2 != "popover" && l2 in n2)
        try {
          n2[l2] = u2 == null ? "" : u2;
          break n;
        } catch (n3) {}
      typeof u2 == "function" || (u2 == null || u2 === false && l2[4] != "-" ? n2.removeAttribute(l2) : n2.setAttribute(l2, l2 == "popover" && u2 == 1 ? "" : u2));
    }
}
function O(n2) {
  return function(u2) {
    if (this.l) {
      var t2 = this.l[u2.type + n2];
      if (u2.t == null)
        u2.t = c++;
      else if (u2.t < t2.u)
        return;
      return t2(l.event ? l.event(u2) : u2);
    }
  };
}
function z(n2, u2, t2, i2, r2, o2, e2, f2, c2, s2) {
  var a2, h2, p2, y2, _2, m2, b, S2, C2, M2, $2, I2, A2, H2, L, T2 = u2.type;
  if (u2.constructor !== undefined)
    return null;
  128 & t2.__u && (c2 = !!(32 & t2.__u), o2 = [f2 = u2.__e = t2.__e]), (a2 = l.__b) && a2(u2);
  n:
    if (typeof T2 == "function")
      try {
        if (S2 = u2.props, C2 = "prototype" in T2 && T2.prototype.render, M2 = (a2 = T2.contextType) && i2[a2.__c], $2 = a2 ? M2 ? M2.props.value : a2.__ : i2, t2.__c ? b = (h2 = u2.__c = t2.__c).__ = h2.__E : (C2 ? u2.__c = h2 = new T2(S2, $2) : (u2.__c = h2 = new x(S2, $2), h2.constructor = T2, h2.render = G), M2 && M2.sub(h2), h2.state || (h2.state = {}), h2.__n = i2, p2 = h2.__d = true, h2.__h = [], h2._sb = []), C2 && h2.__s == null && (h2.__s = h2.state), C2 && T2.getDerivedStateFromProps != null && (h2.__s == h2.state && (h2.__s = w({}, h2.__s)), w(h2.__s, T2.getDerivedStateFromProps(S2, h2.__s))), y2 = h2.props, _2 = h2.state, h2.__v = u2, p2)
          C2 && T2.getDerivedStateFromProps == null && h2.componentWillMount != null && h2.componentWillMount(), C2 && h2.componentDidMount != null && h2.__h.push(h2.componentDidMount);
        else {
          if (C2 && T2.getDerivedStateFromProps == null && S2 !== y2 && h2.componentWillReceiveProps != null && h2.componentWillReceiveProps(S2, $2), u2.__v == t2.__v || !h2.__e && h2.shouldComponentUpdate != null && h2.shouldComponentUpdate(S2, h2.__s, $2) === false) {
            u2.__v != t2.__v && (h2.props = S2, h2.state = h2.__s, h2.__d = false), u2.__e = t2.__e, u2.__k = t2.__k, u2.__k.some(function(n3) {
              n3 && (n3.__ = u2);
            }), v.push.apply(h2.__h, h2._sb), h2._sb = [], h2.__h.length && e2.push(h2);
            break n;
          }
          h2.componentWillUpdate != null && h2.componentWillUpdate(S2, h2.__s, $2), C2 && h2.componentDidUpdate != null && h2.__h.push(function() {
            h2.componentDidUpdate(y2, _2, m2);
          });
        }
        if (h2.context = $2, h2.props = S2, h2.__P = n2, h2.__e = false, I2 = l.__r, A2 = 0, C2)
          h2.state = h2.__s, h2.__d = false, I2 && I2(u2), a2 = h2.render(h2.props, h2.state, h2.context), v.push.apply(h2.__h, h2._sb), h2._sb = [];
        else
          do {
            h2.__d = false, I2 && I2(u2), a2 = h2.render(h2.props, h2.state, h2.context), h2.state = h2.__s;
          } while (h2.__d && ++A2 < 25);
        h2.state = h2.__s, h2.getChildContext != null && (i2 = w(w({}, i2), h2.getChildContext())), C2 && !p2 && h2.getSnapshotBeforeUpdate != null && (m2 = h2.getSnapshotBeforeUpdate(y2, _2)), H2 = a2 != null && a2.type === k && a2.key == null ? q(a2.props.children) : a2, f2 = P(n2, d(H2) ? H2 : [H2], u2, t2, i2, r2, o2, e2, f2, c2, s2), h2.base = u2.__e, u2.__u &= -161, h2.__h.length && e2.push(h2), b && (h2.__E = h2.__ = null);
      } catch (n3) {
        if (u2.__v = null, c2 || o2 != null)
          if (n3.then) {
            for (u2.__u |= c2 ? 160 : 128;f2 && f2.nodeType == 8 && f2.nextSibling; )
              f2 = f2.nextSibling;
            o2[o2.indexOf(f2)] = null, u2.__e = f2;
          } else {
            for (L = o2.length;L--; )
              g(o2[L]);
            N(u2);
          }
        else
          u2.__e = t2.__e, u2.__k = t2.__k, n3.then || N(u2);
        l.__e(n3, u2, t2);
      }
    else
      o2 == null && u2.__v == t2.__v ? (u2.__k = t2.__k, u2.__e = t2.__e) : f2 = u2.__e = B(t2.__e, u2, t2, i2, r2, o2, e2, c2, s2);
  return (a2 = l.diffed) && a2(u2), 128 & u2.__u ? undefined : f2;
}
function N(n2) {
  n2 && (n2.__c && (n2.__c.__e = true), n2.__k && n2.__k.some(N));
}
function V(n2, u2, t2) {
  for (var i2 = 0;i2 < t2.length; i2++)
    D(t2[i2], t2[++i2], t2[++i2]);
  l.__c && l.__c(u2, n2), n2.some(function(u3) {
    try {
      n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
        n3.call(u3);
      });
    } catch (n3) {
      l.__e(n3, u3.__v);
    }
  });
}
function q(n2) {
  return typeof n2 != "object" || n2 == null || n2.__b > 0 ? n2 : d(n2) ? n2.map(q) : w({}, n2);
}
function B(u2, t2, i2, r2, o2, e2, f2, c2, s2) {
  var a2, h2, v2, y2, w2, _2, m2, b = i2.props || p, k2 = t2.props, x2 = t2.type;
  if (x2 == "svg" ? o2 = "http://www.w3.org/2000/svg" : x2 == "math" ? o2 = "http://www.w3.org/1998/Math/MathML" : o2 || (o2 = "http://www.w3.org/1999/xhtml"), e2 != null) {
    for (a2 = 0;a2 < e2.length; a2++)
      if ((w2 = e2[a2]) && "setAttribute" in w2 == !!x2 && (x2 ? w2.localName == x2 : w2.nodeType == 3)) {
        u2 = w2, e2[a2] = null;
        break;
      }
  }
  if (u2 == null) {
    if (x2 == null)
      return document.createTextNode(k2);
    u2 = document.createElementNS(o2, x2, k2.is && k2), c2 && (l.__m && l.__m(t2, e2), c2 = false), e2 = null;
  }
  if (x2 == null)
    b === k2 || c2 && u2.data == k2 || (u2.data = k2);
  else {
    if (e2 = e2 && n.call(u2.childNodes), !c2 && e2 != null)
      for (b = {}, a2 = 0;a2 < u2.attributes.length; a2++)
        b[(w2 = u2.attributes[a2]).name] = w2.value;
    for (a2 in b)
      w2 = b[a2], a2 == "dangerouslySetInnerHTML" ? v2 = w2 : a2 == "children" || (a2 in k2) || a2 == "value" && ("defaultValue" in k2) || a2 == "checked" && ("defaultChecked" in k2) || F(u2, a2, null, w2, o2);
    for (a2 in k2)
      w2 = k2[a2], a2 == "children" ? y2 = w2 : a2 == "dangerouslySetInnerHTML" ? h2 = w2 : a2 == "value" ? _2 = w2 : a2 == "checked" ? m2 = w2 : c2 && typeof w2 != "function" || b[a2] === w2 || F(u2, a2, w2, b[a2], o2);
    if (h2)
      c2 || v2 && (h2.__html == v2.__html || h2.__html == u2.innerHTML) || (u2.innerHTML = h2.__html), t2.__k = [];
    else if (v2 && (u2.innerHTML = ""), P(t2.type == "template" ? u2.content : u2, d(y2) ? y2 : [y2], t2, i2, r2, x2 == "foreignObject" ? "http://www.w3.org/1999/xhtml" : o2, e2, f2, e2 ? e2[0] : i2.__k && S(i2, 0), c2, s2), e2 != null)
      for (a2 = e2.length;a2--; )
        g(e2[a2]);
    c2 || (a2 = "value", x2 == "progress" && _2 == null ? u2.removeAttribute("value") : _2 != null && (_2 !== u2[a2] || x2 == "progress" && !_2 || x2 == "option" && _2 != b[a2]) && F(u2, a2, _2, b[a2], o2), a2 = "checked", m2 != null && m2 != u2[a2] && F(u2, a2, m2, b[a2], o2));
  }
  return u2;
}
function D(n2, u2, t2) {
  try {
    if (typeof n2 == "function") {
      var i2 = typeof n2.__u == "function";
      i2 && n2.__u(), i2 && u2 == null || (n2.__u = n2(u2));
    } else
      n2.current = u2;
  } catch (n3) {
    l.__e(n3, t2);
  }
}
function E(n2, u2, t2) {
  var i2, r2;
  if (l.unmount && l.unmount(n2), (i2 = n2.ref) && (i2.current && i2.current != n2.__e || D(i2, null, u2)), (i2 = n2.__c) != null) {
    if (i2.componentWillUnmount)
      try {
        i2.componentWillUnmount();
      } catch (n3) {
        l.__e(n3, u2);
      }
    i2.base = i2.__P = null;
  }
  if (i2 = n2.__k)
    for (r2 = 0;r2 < i2.length; r2++)
      i2[r2] && E(i2[r2], u2, t2 || typeof n2.type != "function");
  t2 || g(n2.__e), n2.__c = n2.__ = n2.__e = undefined;
}
function G(n2, l2, u2) {
  return this.constructor(n2, u2);
}
function J(u2, t2, i2) {
  var r2, o2, e2, f2;
  t2 == document && (t2 = document.documentElement), l.__ && l.__(u2, t2), o2 = (r2 = typeof i2 == "function") ? null : i2 && i2.__k || t2.__k, e2 = [], f2 = [], z(t2, u2 = (!r2 && i2 || t2).__k = _(k, null, [u2]), o2 || p, p, t2.namespaceURI, !r2 && i2 ? [i2] : o2 ? null : t2.firstChild ? n.call(t2.childNodes) : null, e2, !r2 && i2 ? i2 : o2 ? o2.__e : t2.firstChild, r2, f2), V(e2, u2, f2);
}
function R(n2) {
  function l2(n3) {
    var u2, t2;
    return this.getChildContext || (u2 = new Set, (t2 = {})[l2.__c] = this, this.getChildContext = function() {
      return t2;
    }, this.componentWillUnmount = function() {
      u2 = null;
    }, this.shouldComponentUpdate = function(n4) {
      this.props.value != n4.value && u2.forEach(function(n5) {
        n5.__e = true, $(n5);
      });
    }, this.sub = function(n4) {
      u2.add(n4);
      var l3 = n4.componentWillUnmount;
      n4.componentWillUnmount = function() {
        u2 && u2.delete(n4), l3 && l3.call(n4);
      };
    }), n3.children;
  }
  return l2.__c = "__cC" + h++, l2.__ = n2, l2.Provider = l2.__l = (l2.Consumer = function(n3, l3) {
    return n3.children(l3);
  }).contextType = l2, l2;
}
n = v.slice, l = { __e: function(n2, l2, u2, t2) {
  for (var i2, r2, o2;l2 = l2.__; )
    if ((i2 = l2.__c) && !i2.__)
      try {
        if ((r2 = i2.constructor) && r2.getDerivedStateFromError != null && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), i2.componentDidCatch != null && (i2.componentDidCatch(n2, t2 || {}), o2 = i2.__d), o2)
          return i2.__E = i2;
      } catch (l3) {
        n2 = l3;
      }
  throw n2;
} }, u = 0, t = function(n2) {
  return n2 != null && n2.constructor === undefined;
}, x.prototype.setState = function(n2, l2) {
  var u2;
  u2 = this.__s != null && this.__s != this.state ? this.__s : this.__s = w({}, this.state), typeof n2 == "function" && (n2 = n2(w({}, u2), this.props)), n2 && w(u2, n2), n2 != null && this.__v && (l2 && this._sb.push(l2), $(this));
}, x.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), $(this));
}, x.prototype.render = k, i = [], o = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n2, l2) {
  return n2.__v.__b - l2.__v.__b;
}, I.__r = 0, f = /(PointerCapture)$|Capture$/i, c = 0, s = O(false), a = O(true), h = 0;

// ../core/node_modules/preact/hooks/dist/hooks.module.js
var t2;
var r2;
var u2;
var i2;
var o2 = 0;
var f2 = [];
var c2 = l;
var e2 = c2.__b;
var a2 = c2.__r;
var v2 = c2.diffed;
var l2 = c2.__c;
var m2 = c2.unmount;
var s2 = c2.__;
function p2(n2, t3) {
  c2.__h && c2.__h(r2, n2, o2 || t3), o2 = 0;
  var u3 = r2.__H || (r2.__H = { __: [], __h: [] });
  return n2 >= u3.__.length && u3.__.push({}), u3.__[n2];
}
function d2(n2) {
  return o2 = 1, h2(D2, n2);
}
function h2(n2, u3, i3) {
  var o3 = p2(t2++, 2);
  if (o3.t = n2, !o3.__c && (o3.__ = [i3 ? i3(u3) : D2(undefined, u3), function(n3) {
    var t3 = o3.__N ? o3.__N[0] : o3.__[0], r3 = o3.t(t3, n3);
    t3 !== r3 && (o3.__N = [r3, o3.__[1]], o3.__c.setState({}));
  }], o3.__c = r2, !r2.__f)) {
    var f3 = function(n3, t3, r3) {
      if (!o3.__c.__H)
        return true;
      var u4 = o3.__c.__H.__.filter(function(n4) {
        return n4.__c;
      });
      if (u4.every(function(n4) {
        return !n4.__N;
      }))
        return !c3 || c3.call(this, n3, t3, r3);
      var i4 = o3.__c.props !== n3;
      return u4.some(function(n4) {
        if (n4.__N) {
          var t4 = n4.__[0];
          n4.__ = n4.__N, n4.__N = undefined, t4 !== n4.__[0] && (i4 = true);
        }
      }), c3 && c3.call(this, n3, t3, r3) || i4;
    };
    r2.__f = true;
    var { shouldComponentUpdate: c3, componentWillUpdate: e3 } = r2;
    r2.componentWillUpdate = function(n3, t3, r3) {
      if (this.__e) {
        var u4 = c3;
        c3 = undefined, f3(n3, t3, r3), c3 = u4;
      }
      e3 && e3.call(this, n3, t3, r3);
    }, r2.shouldComponentUpdate = f3;
  }
  return o3.__N || o3.__;
}
function y2(n2, u3) {
  var i3 = p2(t2++, 3);
  !c2.__s && C2(i3.__H, u3) && (i3.__ = n2, i3.u = u3, r2.__H.__h.push(i3));
}
function _2(n2, u3) {
  var i3 = p2(t2++, 4);
  !c2.__s && C2(i3.__H, u3) && (i3.__ = n2, i3.u = u3, r2.__h.push(i3));
}
function A2(n2) {
  return o2 = 5, T2(function() {
    return { current: n2 };
  }, []);
}
function T2(n2, r3) {
  var u3 = p2(t2++, 7);
  return C2(u3.__H, r3) && (u3.__ = n2(), u3.__H = r3, u3.__h = n2), u3.__;
}
function q2(n2, t3) {
  return o2 = 8, T2(function() {
    return n2;
  }, t3);
}
function x2(n2) {
  var u3 = r2.context[n2.__c], i3 = p2(t2++, 9);
  return i3.c = n2, u3 ? (i3.__ == null && (i3.__ = true, u3.sub(r2)), u3.props.value) : n2.__;
}
function j2() {
  for (var n2;n2 = f2.shift(); ) {
    var t3 = n2.__H;
    if (n2.__P && t3)
      try {
        t3.__h.some(z2), t3.__h.some(B2), t3.__h = [];
      } catch (r3) {
        t3.__h = [], c2.__e(r3, n2.__v);
      }
  }
}
c2.__b = function(n2) {
  r2 = null, e2 && e2(n2);
}, c2.__ = function(n2, t3) {
  n2 && t3.__k && t3.__k.__m && (n2.__m = t3.__k.__m), s2 && s2(n2, t3);
}, c2.__r = function(n2) {
  a2 && a2(n2), t2 = 0;
  var i3 = (r2 = n2.__c).__H;
  i3 && (u2 === r2 ? (i3.__h = [], r2.__h = [], i3.__.some(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = undefined;
  })) : (i3.__h.some(z2), i3.__h.some(B2), i3.__h = [], t2 = 0)), u2 = r2;
}, c2.diffed = function(n2) {
  v2 && v2(n2);
  var t3 = n2.__c;
  t3 && t3.__H && (t3.__H.__h.length && (f2.push(t3) !== 1 && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t3.__H.__.some(function(n3) {
    n3.u && (n3.__H = n3.u), n3.u = undefined;
  })), u2 = r2 = null;
}, c2.__c = function(n2, t3) {
  t3.some(function(n3) {
    try {
      n3.__h.some(z2), n3.__h = n3.__h.filter(function(n4) {
        return !n4.__ || B2(n4);
      });
    } catch (r3) {
      t3.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t3 = [], c2.__e(r3, n3.__v);
    }
  }), l2 && l2(n2, t3);
}, c2.unmount = function(n2) {
  m2 && m2(n2);
  var t3, r3 = n2.__c;
  r3 && r3.__H && (r3.__H.__.some(function(n3) {
    try {
      z2(n3);
    } catch (n4) {
      t3 = n4;
    }
  }), r3.__H = undefined, t3 && c2.__e(t3, r3.__v));
};
var k2 = typeof requestAnimationFrame == "function";
function w2(n2) {
  var t3, r3 = function() {
    clearTimeout(u3), k2 && cancelAnimationFrame(t3), setTimeout(n2);
  }, u3 = setTimeout(r3, 35);
  k2 && (t3 = requestAnimationFrame(r3));
}
function z2(n2) {
  var t3 = r2, u3 = n2.__c;
  typeof u3 == "function" && (n2.__c = undefined, u3()), r2 = t3;
}
function B2(n2) {
  var t3 = r2;
  n2.__c = n2.__(), r2 = t3;
}
function C2(n2, t3) {
  return !n2 || n2.length !== t3.length || t3.some(function(t4, r3) {
    return t4 !== n2[r3];
  });
}
function D2(n2, t3) {
  return typeof t3 == "function" ? t3(n2) : t3;
}

// ../core/node_modules/@preact/signals-core/dist/signals-core.module.js
var i3 = Symbol.for("preact-signals");
function t3() {
  if (!(s3 > 1)) {
    var i4, t4 = false;
    while (h3 !== undefined) {
      var n2 = h3;
      h3 = undefined;
      v3++;
      while (n2 !== undefined) {
        var r3 = n2.o;
        n2.o = undefined;
        n2.f &= -3;
        if (!(8 & n2.f) && a3(n2))
          try {
            n2.c();
          } catch (n3) {
            if (!t4) {
              i4 = n3;
              t4 = true;
            }
          }
        n2 = r3;
      }
    }
    v3 = 0;
    s3--;
    if (t4)
      throw i4;
  } else
    s3--;
}
var r3 = undefined;
function o3(i4) {
  var t4 = r3;
  r3 = undefined;
  try {
    return i4();
  } finally {
    r3 = t4;
  }
}
var f3;
var h3 = undefined;
var s3 = 0;
var v3 = 0;
var u3 = 0;
function e3(i4) {
  if (r3 !== undefined) {
    var t4 = i4.n;
    if (t4 === undefined || t4.t !== r3) {
      t4 = { i: 0, S: i4, p: r3.s, n: undefined, t: r3, e: undefined, x: undefined, r: t4 };
      if (r3.s !== undefined)
        r3.s.n = t4;
      r3.s = t4;
      i4.n = t4;
      if (32 & r3.f)
        i4.S(t4);
      return t4;
    } else if (t4.i === -1) {
      t4.i = 0;
      if (t4.n !== undefined) {
        t4.n.p = t4.p;
        if (t4.p !== undefined)
          t4.p.n = t4.n;
        t4.p = r3.s;
        t4.n = undefined;
        r3.s.n = t4;
        r3.s = t4;
      }
      return t4;
    }
  }
}
function d3(i4, t4) {
  this.v = i4;
  this.i = 0;
  this.n = undefined;
  this.t = undefined;
  this.W = t4 == null ? undefined : t4.watched;
  this.Z = t4 == null ? undefined : t4.unwatched;
  this.name = t4 == null ? undefined : t4.name;
}
d3.prototype.brand = i3;
d3.prototype.h = function() {
  return true;
};
d3.prototype.S = function(i4) {
  var t4 = this, n2 = this.t;
  if (n2 !== i4 && i4.e === undefined) {
    i4.x = n2;
    this.t = i4;
    if (n2 !== undefined)
      n2.e = i4;
    else
      o3(function() {
        var i5;
        (i5 = t4.W) == null || i5.call(t4);
      });
  }
};
d3.prototype.U = function(i4) {
  var t4 = this;
  if (this.t !== undefined) {
    var { e: n2, x: r4 } = i4;
    if (n2 !== undefined) {
      n2.x = r4;
      i4.e = undefined;
    }
    if (r4 !== undefined) {
      r4.e = n2;
      i4.x = undefined;
    }
    if (i4 === this.t) {
      this.t = r4;
      if (r4 === undefined)
        o3(function() {
          var i5;
          (i5 = t4.Z) == null || i5.call(t4);
        });
    }
  }
};
d3.prototype.subscribe = function(i4) {
  var t4 = this;
  return m3(function() {
    var n2 = t4.value, o4 = r3;
    r3 = undefined;
    try {
      i4(n2);
    } finally {
      r3 = o4;
    }
  }, { name: "sub" });
};
d3.prototype.valueOf = function() {
  return this.value;
};
d3.prototype.toString = function() {
  return this.value + "";
};
d3.prototype.toJSON = function() {
  return this.value;
};
d3.prototype.peek = function() {
  var i4 = r3;
  r3 = undefined;
  try {
    return this.value;
  } finally {
    r3 = i4;
  }
};
Object.defineProperty(d3.prototype, "value", { get: function() {
  var i4 = e3(this);
  if (i4 !== undefined)
    i4.i = this.i;
  return this.v;
}, set: function(i4) {
  if (i4 !== this.v) {
    if (v3 > 100)
      throw new Error("Cycle detected");
    this.v = i4;
    this.i++;
    u3++;
    s3++;
    try {
      for (var n2 = this.t;n2 !== undefined; n2 = n2.x)
        n2.t.N();
    } finally {
      t3();
    }
  }
} });
function c3(i4, t4) {
  return new d3(i4, t4);
}
function a3(i4) {
  for (var t4 = i4.s;t4 !== undefined; t4 = t4.n)
    if (t4.S.i !== t4.i || !t4.S.h() || t4.S.i !== t4.i)
      return true;
  return false;
}
function l3(i4) {
  for (var t4 = i4.s;t4 !== undefined; t4 = t4.n) {
    var n2 = t4.S.n;
    if (n2 !== undefined)
      t4.r = n2;
    t4.S.n = t4;
    t4.i = -1;
    if (t4.n === undefined) {
      i4.s = t4;
      break;
    }
  }
}
function y3(i4) {
  var t4 = i4.s, n2 = undefined;
  while (t4 !== undefined) {
    var r4 = t4.p;
    if (t4.i === -1) {
      t4.S.U(t4);
      if (r4 !== undefined)
        r4.n = t4.n;
      if (t4.n !== undefined)
        t4.n.p = r4;
    } else
      n2 = t4;
    t4.S.n = t4.r;
    if (t4.r !== undefined)
      t4.r = undefined;
    t4 = r4;
  }
  i4.s = n2;
}
function w3(i4, t4) {
  d3.call(this, undefined);
  this.x = i4;
  this.s = undefined;
  this.g = u3 - 1;
  this.f = 4;
  this.W = t4 == null ? undefined : t4.watched;
  this.Z = t4 == null ? undefined : t4.unwatched;
  this.name = t4 == null ? undefined : t4.name;
}
w3.prototype = new d3;
w3.prototype.h = function() {
  this.f &= -3;
  if (1 & this.f)
    return false;
  if ((36 & this.f) == 32)
    return true;
  this.f &= -5;
  if (this.g === u3)
    return true;
  this.g = u3;
  this.f |= 1;
  if (this.i > 0 && !a3(this)) {
    this.f &= -2;
    return true;
  }
  var i4 = r3;
  try {
    l3(this);
    r3 = this;
    var t4 = this.x();
    if (16 & this.f || this.v !== t4 || this.i === 0) {
      this.v = t4;
      this.f &= -17;
      this.i++;
    }
  } catch (i5) {
    this.v = i5;
    this.f |= 16;
    this.i++;
  }
  r3 = i4;
  y3(this);
  this.f &= -2;
  return true;
};
w3.prototype.S = function(i4) {
  if (this.t === undefined) {
    this.f |= 36;
    for (var t4 = this.s;t4 !== undefined; t4 = t4.n)
      t4.S.S(t4);
  }
  d3.prototype.S.call(this, i4);
};
w3.prototype.U = function(i4) {
  if (this.t !== undefined) {
    d3.prototype.U.call(this, i4);
    if (this.t === undefined) {
      this.f &= -33;
      for (var t4 = this.s;t4 !== undefined; t4 = t4.n)
        t4.S.U(t4);
    }
  }
};
w3.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 6;
    for (var i4 = this.t;i4 !== undefined; i4 = i4.x)
      i4.t.N();
  }
};
Object.defineProperty(w3.prototype, "value", { get: function() {
  if (1 & this.f)
    throw new Error("Cycle detected");
  var i4 = e3(this);
  this.h();
  if (i4 !== undefined)
    i4.i = this.i;
  if (16 & this.f)
    throw this.v;
  return this.v;
} });
function b(i4, t4) {
  return new w3(i4, t4);
}
function _3(i4) {
  var n2 = i4.u;
  i4.u = undefined;
  if (typeof n2 == "function") {
    s3++;
    var o4 = r3;
    r3 = undefined;
    try {
      n2();
    } catch (t4) {
      i4.f &= -2;
      i4.f |= 8;
      p3(i4);
      throw t4;
    } finally {
      r3 = o4;
      t3();
    }
  }
}
function p3(i4) {
  for (var t4 = i4.s;t4 !== undefined; t4 = t4.n)
    t4.S.U(t4);
  i4.x = undefined;
  i4.s = undefined;
  _3(i4);
}
function g2(i4) {
  if (r3 !== this)
    throw new Error("Out-of-order effect");
  y3(this);
  r3 = i4;
  this.f &= -2;
  if (8 & this.f)
    p3(this);
  t3();
}
function S2(i4, t4) {
  this.x = i4;
  this.u = undefined;
  this.s = undefined;
  this.o = undefined;
  this.f = 32;
  this.name = t4 == null ? undefined : t4.name;
  if (f3)
    f3.push(this);
}
S2.prototype.c = function() {
  var i4 = this.S();
  try {
    if (8 & this.f)
      return;
    if (this.x === undefined)
      return;
    var t4 = this.x();
    if (typeof t4 == "function")
      this.u = t4;
  } finally {
    i4();
  }
};
S2.prototype.S = function() {
  if (1 & this.f)
    throw new Error("Cycle detected");
  this.f |= 1;
  this.f &= -9;
  _3(this);
  l3(this);
  s3++;
  var i4 = r3;
  r3 = this;
  return g2.bind(this, i4);
};
S2.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 2;
    this.o = h3;
    h3 = this;
  }
};
S2.prototype.d = function() {
  this.f |= 8;
  if (!(1 & this.f))
    p3(this);
};
S2.prototype.dispose = function() {
  this.d();
};
function m3(i4, t4) {
  var n2 = new S2(i4, t4);
  try {
    n2.c();
  } catch (i5) {
    n2.d();
    throw i5;
  }
  var r4 = n2.d.bind(n2);
  r4[Symbol.dispose] = r4;
  return r4;
}

// ../core/node_modules/@preact/signals/dist/signals.module.js
var v4;
var s4;
function l4(i4, n3) {
  l[i4] = n3.bind(null, l[i4] || function() {});
}
function d4(i4) {
  if (s4) {
    var r4 = s4;
    s4 = undefined;
    r4();
  }
  s4 = i4 && i4.S();
}
function h4(i4) {
  var r4 = this, f4 = i4.data, o4 = useSignal(f4);
  o4.value = f4;
  var e4 = T2(function() {
    var i5 = r4.__v;
    while (i5 = i5.__)
      if (i5.__c) {
        i5.__c.__$f |= 4;
        break;
      }
    r4.__$u.c = function() {
      var i6, t4 = r4.__$u.S(), f5 = e4.value;
      t4();
      if (t(f5) || ((i6 = r4.base) == null ? undefined : i6.nodeType) !== 3) {
        r4.__$f |= 1;
        r4.setState({});
      } else
        r4.base.data = f5;
    };
    return b(function() {
      var i6 = o4.value.value;
      return i6 === 0 ? 0 : i6 === true ? "" : i6 || "";
    });
  }, []);
  return e4.value;
}
h4.displayName = "_st";
Object.defineProperties(d3.prototype, { constructor: { configurable: true, value: undefined }, type: { configurable: true, value: h4 }, props: { configurable: true, get: function() {
  return { data: this };
} }, __b: { configurable: true, value: 1 } });
l4("__b", function(i4, r4) {
  if (typeof r4.type == "string") {
    var n3, t4 = r4.props;
    for (var f4 in t4)
      if (f4 !== "children") {
        var o4 = t4[f4];
        if (o4 instanceof d3) {
          if (!n3)
            r4.__np = n3 = {};
          n3[f4] = o4;
          t4[f4] = o4.peek();
        }
      }
  }
  i4(r4);
});
l4("__r", function(i4, r4) {
  i4(r4);
  d4();
  var n3, t4 = r4.__c;
  if (t4) {
    t4.__$f &= -2;
    if ((n3 = t4.__$u) === undefined)
      t4.__$u = n3 = function(i5) {
        var r5;
        m3(function() {
          r5 = this;
        });
        r5.c = function() {
          t4.__$f |= 1;
          t4.setState({});
        };
        return r5;
      }();
  }
  v4 = t4;
  d4(n3);
});
l4("__e", function(i4, r4, n3, t4) {
  d4();
  v4 = undefined;
  i4(r4, n3, t4);
});
l4("diffed", function(i4, r4) {
  d4();
  v4 = undefined;
  var n3;
  if (typeof r4.type == "string" && (n3 = r4.__e)) {
    var { __np: t4, props: f4 } = r4;
    if (t4) {
      var o4 = n3.U;
      if (o4)
        for (var e4 in o4) {
          var u4 = o4[e4];
          if (u4 !== undefined && !(e4 in t4)) {
            u4.d();
            o4[e4] = undefined;
          }
        }
      else
        n3.U = o4 = {};
      for (var a4 in t4) {
        var c4 = o4[a4], s5 = t4[a4];
        if (c4 === undefined) {
          c4 = p4(n3, a4, s5, f4);
          o4[a4] = c4;
        } else
          c4.o(s5, f4);
      }
    }
  }
  i4(r4);
});
function p4(i4, r4, n3, t4) {
  var f4 = r4 in i4 && i4.ownerSVGElement === undefined, o4 = c3(n3);
  return { o: function(i5, r5) {
    o4.value = i5;
    t4 = r5;
  }, d: m3(function() {
    var n4 = o4.value.value;
    if (t4[r4] !== n4) {
      t4[r4] = n4;
      if (f4)
        i4[r4] = n4;
      else if (n4)
        i4.setAttribute(r4, n4);
      else
        i4.removeAttribute(r4);
    }
  }) };
}
l4("unmount", function(i4, r4) {
  if (typeof r4.type == "string") {
    var n3 = r4.__e;
    if (n3) {
      var t4 = n3.U;
      if (t4) {
        n3.U = undefined;
        for (var f4 in t4) {
          var o4 = t4[f4];
          if (o4)
            o4.d();
        }
      }
    }
  } else {
    var e4 = r4.__c;
    if (e4) {
      var u4 = e4.__$u;
      if (u4) {
        e4.__$u = undefined;
        u4.d();
      }
    }
  }
  i4(r4);
});
l4("__h", function(i4, r4, n3, t4) {
  if (t4 < 3 || t4 === 9)
    r4.__$f |= 2;
  i4(r4, n3, t4);
});
x.prototype.shouldComponentUpdate = function(i4, r4) {
  if (this.__R)
    return true;
  var n3 = this.__$u, t4 = n3 && n3.s !== undefined;
  for (var f4 in r4)
    return true;
  if (this.__f || typeof this.u == "boolean" && this.u === true) {
    if (!(t4 || 2 & this.__$f || 4 & this.__$f))
      return true;
    if (1 & this.__$f)
      return true;
  } else {
    if (!(t4 || 4 & this.__$f))
      return true;
    if (3 & this.__$f)
      return true;
  }
  for (var o4 in i4)
    if (o4 !== "__source" && i4[o4] !== this.props[o4])
      return true;
  for (var e4 in this.props)
    if (!(e4 in i4))
      return true;
  return false;
};
function useSignal(i4) {
  return T2(function() {
    return c3(i4);
  }, []);
}

// ../core/src/store.ts
var uid = () => crypto.randomUUID();
function mkPage(title = "Untitled Page") {
  return { id: uid(), title, children: [], blocks: [], panX: 0, panY: 0, zoom: 1, createdAt: Date.now() };
}
function mkSection(title = "New Section") {
  return { id: uid(), title, pages: [mkPage()] };
}
function mkNotebook(title = "My Notebook") {
  const sec = mkSection();
  return { id: uid(), title, sections: [sec] };
}
var hasIPC = typeof window !== "undefined" && !!window.notebook;
function sendOp(op) {
  if (hasIPC)
    window.notebook.applyOp(op);
}
function sendOps(ops) {
  if (hasIPC && ops.length)
    window.notebook.applyOps(ops);
}
function defaultState() {
  const nb = mkNotebook();
  return { notebooks: [nb], ui: { notebookId: nb.id, sectionId: nb.sections[0].id, pageId: nb.sections[0].pages[0].id } };
}
var appState = c3(defaultState());
var connected = c3(false);
var initializing = c3(true);
var showSwitcher = c3(false);
var recentNotebooks = c3([]);
var isDesktop = hasIPC && !window.notebook._browserShim;
function checkEditParam() {
  if (typeof window === "undefined")
    return false;
  if (new URLSearchParams(window.location.search).get("edit") === "on")
    return true;
  const hash = window.location.hash;
  if (hash.includes("?")) {
    if (new URLSearchParams(hash.slice(hash.indexOf("?") + 1)).get("edit") === "on")
      return true;
  }
  return false;
}
var editingEnabled = c3(isDesktop ? true : checkEditParam());
var preloadCache = c3(new Map);
function syncHashUrl() {
  if (isDesktop)
    return;
  const { ui, notebooks } = appState.value;
  const nb = notebooks.find((n3) => n3.id === ui.notebookId);
  if (!nb)
    return;
  const sec = nb.sections.find((s5) => s5.id === ui.sectionId);
  const page = sec ? findInTree(sec.pages, ui.pageId) : null;
  const parts = ["#!/"];
  if (sec)
    parts.push(encodeURIComponent(sec.title), "/");
  if (page)
    parts.push(encodeURIComponent(page.title), "/");
  history.replaceState(null, "", parts.join(""));
}
function preloadPage(page) {
  if (!page || preloadCache.value.has(page.id))
    return;
  const m4 = new Map(preloadCache.value);
  m4.set(page.id, page);
  preloadCache.value = m4;
}
function preloadPages(pages) {
  const m4 = new Map(preloadCache.value);
  let changed = false;
  for (const page of pages) {
    if (page && !m4.has(page.id)) {
      m4.set(page.id, page);
      changed = true;
    }
  }
  if (changed)
    preloadCache.value = m4;
}
function getPreloadCandidates() {
  const { ui, notebooks } = appState.value;
  const nb = notebooks.find((n3) => n3.id === ui.notebookId);
  if (!nb)
    return [];
  const results = [];
  function addTree(pages) {
    for (const p5 of pages) {
      if (p5.id !== ui.pageId)
        results.push(p5);
      if (p5.children?.length)
        addTree(p5.children);
    }
  }
  for (const sec of nb.sections) {
    if (sec.id === ui.sectionId) {
      addTree(sec.pages);
    } else {
      const lastId = lastPagePerSection.get(sec.id);
      const pg = lastId ? findInTree(sec.pages, lastId) : sec.pages[0];
      if (pg)
        results.push(pg);
    }
  }
  return results;
}
function closeSwitcher() {
  showSwitcher.value = false;
}
var _log = (...args) => {
  console.log("[store]", ...args);
  if (window.log)
    window.log("[store]", ...args);
};
if (hasIPC) {
  window.notebook.getConfig().then((cfg) => {
    _log("init getConfig result — notebookPath:", cfg.notebookPath, "recents:", cfg.recentNotebooks?.length ?? 0);
    if (Array.isArray(cfg.recentNotebooks))
      recentNotebooks.value = cfg.recentNotebooks;
    if (!cfg.notebookPath) {
      _log("no notebookPath — setting initializing=false (welcome screen)");
      initializing.value = false;
    }
  });
  window.notebook.onOpenFailed(() => {
    _log("onOpenFailed fired — setting initializing=false");
    initializing.value = false;
  });
} else {
  initializing.value = false;
}
function update(fn) {
  const draft = { ...appState.value };
  fn(draft);
  appState.value = draft;
}
function silent(fn) {
  fn(appState.value);
}
function findInTree(pages, id) {
  for (const p5 of pages) {
    if (p5.id === id)
      return p5;
    if (p5.children?.length) {
      const f4 = findInTree(p5.children, id);
      if (f4)
        return f4;
    }
  }
  return null;
}
function removeFromTree(pages, id) {
  return pages.filter((p5) => p5.id !== id).map((p5) => ({ ...p5, children: removeFromTree(p5.children ?? [], id) }));
}
function getActivePage(s5 = appState.value) {
  const { ui, notebooks } = s5;
  const nb = notebooks.find((n3) => n3.id === ui.notebookId);
  const sec = nb?.sections.find((sec2) => sec2.id === ui.sectionId);
  return sec ? findInTree(sec.pages, ui.pageId) : null;
}
var _notebookPath = null;
var _uiSaveTimer = null;
function setNotebookPath(p5) {
  _notebookPath = p5;
  const name = p5 ? p5.replace(/\\/g, "/").split("/").pop() : null;
  document.title = name ? `Notebound - ${name}` : "Notebound";
}
function persistUiState() {
  if (!hasIPC || !_notebookPath)
    return;
  if (_uiSaveTimer)
    clearTimeout(_uiSaveTimer);
  _uiSaveTimer = setTimeout(() => {
    const { ui } = appState.value;
    window.notebook.saveUiState(_notebookPath, {
      sectionId: ui.sectionId,
      pageId: ui.pageId,
      lastPagePerSection: Object.fromEntries(lastPagePerSection)
    });
  }, 500);
}
var lastPagePerSection = new Map;
function setActiveSection(id) {
  update((s5) => {
    s5.ui.sectionId = id;
    const nb = s5.notebooks.find((n3) => n3.id === s5.ui.notebookId);
    const sec = nb?.sections.find((sec2) => sec2.id === id);
    const lastId = lastPagePerSection.get(id);
    const lastPage = lastId && sec ? findInTree(sec.pages, lastId) : null;
    s5.ui.pageId = lastPage?.id ?? sec?.pages[0]?.id ?? null;
  });
  persistUiState();
  syncHashUrl();
}
function setActivePage(id) {
  const { sectionId } = appState.value.ui;
  if (sectionId)
    lastPagePerSection.set(sectionId, id);
  update((s5) => {
    s5.ui.pageId = id;
  });
  persistUiState();
  syncHashUrl();
}
function addSection(nbId) {
  const sec = mkSection("New Section");
  const page = sec.pages[0];
  update((s5) => {
    const nb = s5.notebooks.find((n3) => n3.id === nbId);
    if (!nb)
      return;
    nb.sections.push(sec);
    s5.ui.sectionId = sec.id;
    s5.ui.pageId = page.id;
  });
  sendOps([
    { type: "section-add", notebookId: nbId, sectionId: sec.id, title: sec.title, pages: [] },
    { type: "page-add", sectionId: sec.id, pageId: page.id, title: page.title, blocks: page.blocks }
  ]);
}
function renameSection(nbId, secId, title) {
  update((s5) => {
    const sec = s5.notebooks.find((n3) => n3.id === nbId)?.sections.find((s6) => s6.id === secId);
    if (sec)
      sec.title = title;
  });
  sendOp({ type: "section-rename", sectionId: secId, title });
}
function deleteSection(nbId, secId) {
  update((s5) => {
    const nb = s5.notebooks.find((n3) => n3.id === nbId);
    if (!nb)
      return;
    nb.sections = nb.sections.filter((sec) => sec.id !== secId);
    if (s5.ui.sectionId === secId) {
      const first = nb.sections[0];
      s5.ui.sectionId = first?.id ?? null;
      s5.ui.pageId = first?.pages[0]?.id ?? null;
    }
  });
  sendOp({ type: "section-delete", notebookId: nbId, sectionId: secId });
}
function reorderSections(nbId, ids) {
  update((s5) => {
    const nb = s5.notebooks.find((n3) => n3.id === nbId);
    if (nb)
      nb.sections.sort((a4, b2) => ids.indexOf(a4.id) - ids.indexOf(b2.id));
  });
  sendOp({ type: "section-reorder", notebookId: nbId, sectionIds: ids });
}
function addPage(parentPageId = null) {
  const pg = mkPage("Untitled Page");
  const secId = appState.value.ui.sectionId;
  update((s5) => {
    const nb = s5.notebooks.find((n3) => n3.id === s5.ui.notebookId);
    const sec = nb?.sections.find((sec2) => sec2.id === s5.ui.sectionId);
    if (!sec)
      return;
    if (parentPageId) {
      const parent = findInTree(sec.pages, parentPageId);
      if (parent) {
        parent.children = parent.children ?? [];
        parent.children.push(pg);
      }
    } else {
      sec.pages.push(pg);
    }
    s5.ui.pageId = pg.id;
  });
  sendOp({ type: "page-add", sectionId: secId, pageId: pg.id, title: pg.title, parentPageId, blocks: pg.blocks });
}
function renamePage(pageId, title) {
  update((s5) => {
    const nb = s5.notebooks.find((n3) => n3.id === s5.ui.notebookId);
    const sec = nb?.sections.find((sec2) => sec2.id === s5.ui.sectionId);
    if (!sec)
      return;
    const pg = findInTree(sec.pages, pageId);
    if (pg)
      pg.title = title;
  });
  sendOp({ type: "page-rename", pageId, title });
}
function deletePage(pageId) {
  update((s5) => {
    const nb = s5.notebooks.find((n3) => n3.id === s5.ui.notebookId);
    const sec = nb?.sections.find((sec2) => sec2.id === s5.ui.sectionId);
    if (!sec)
      return;
    sec.pages = removeFromTree(sec.pages, pageId);
    if (s5.ui.pageId === pageId)
      s5.ui.pageId = sec.pages[0]?.id ?? null;
  });
  sendOp({ type: "page-delete", pageId });
}
function movePage(pageId, targetSecId) {
  update((s5) => {
    const nb = s5.notebooks.find((n3) => n3.id === s5.ui.notebookId);
    if (!nb)
      return;
    let pg = null;
    for (const sec of nb.sections) {
      const found = findInTree(sec.pages, pageId);
      if (found) {
        pg = structuredClone(found);
        sec.pages = removeFromTree(sec.pages, pageId);
        break;
      }
    }
    if (!pg)
      return;
    const target = nb.sections.find((sec) => sec.id === targetSecId);
    if (target)
      target.pages.push(pg);
  });
  sendOp({ type: "page-move", pageId, targetSectionId: targetSecId });
}
var DEFAULT_WIDTH_REF = "Yes. The real leverage of a local-first, log-replicated object model is not technical elegance — it's power realignment.";
var _defaultBlockWidth = 580;
if (typeof document !== "undefined") {
  const _m = document.createElement("span");
  _m.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:14px "Helvetica Neue",Arial,-apple-system,sans-serif;padding:0 8px';
  _m.textContent = DEFAULT_WIDTH_REF;
  document.body.appendChild(_m);
  _defaultBlockWidth = Math.ceil(_m.offsetWidth + 16);
  document.body.removeChild(_m);
}
var DEFAULT_BLOCK_WIDTH = _defaultBlockWidth;
function addBlock(x3, y4, w4 = DEFAULT_BLOCK_WIDTH, type = "text", extra = {}) {
  const blk = { id: uid(), x: x3, y: y4, w: w4, html: "", type, ...extra };
  const pageId = appState.value.ui.pageId;
  update((s5) => {
    const pg = getActivePage(s5);
    if (pg)
      pg.blocks.push(blk);
  });
  sendOp({ type: "block-add", pageId, block: blk });
  return blk;
}
function deleteBlock(blockId) {
  const pageId = appState.value.ui.pageId;
  update((s5) => {
    const pg = getActivePage(s5);
    if (pg)
      pg.blocks = pg.blocks.filter((b2) => b2.id !== blockId);
  });
  sendOp({ type: "block-delete", pageId, blockId });
}
function updateBlockHtmlLocal(blockId, html) {
  silent((s5) => {
    const pg = getActivePage(s5);
    const blk = pg?.blocks.find((b2) => b2.id === blockId);
    if (blk)
      blk.html = html;
  });
}
function updateBlockTextDiff(blockId, diffs) {
  const pageId = appState.value.ui.pageId;
  if (hasIPC && diffs.length > 0) {
    window.notebook.applyOp({ type: "block-text-diff", pageId, blockId, diffs });
  }
}
function updateBlockHtml(blockId, html) {
  const pageId = appState.value.ui.pageId;
  silent((s5) => {
    const pg = getActivePage(s5);
    const blk = pg?.blocks.find((b2) => b2.id === blockId);
    if (blk)
      blk.html = html;
  });
  sendOp({ type: "block-update-html", pageId, blockId, html });
}
function updateBlockPos(blockId, x3, y4) {
  const pageId = appState.value.ui.pageId;
  silent((s5) => {
    const pg = getActivePage(s5);
    const blk = pg?.blocks.find((b2) => b2.id === blockId);
    if (blk) {
      blk.x = x3;
      blk.y = y4;
    }
  });
  sendOp({ type: "block-move", pageId, blockId, x: x3, y: y4 });
}
function updateBlockType(blockId, type) {
  const pageId = appState.value.ui.pageId;
  silent((s5) => {
    const pg = getActivePage(s5);
    const blk = pg?.blocks.find((b2) => b2.id === blockId);
    if (blk)
      blk.type = type;
  });
  sendOp({ type: "block-update-type", pageId, blockId, blockType: type });
}
function updateBlockWidth(blockId, w4) {
  const pageId = appState.value.ui.pageId;
  silent((s5) => {
    const pg = getActivePage(s5);
    const blk = pg?.blocks.find((b2) => b2.id === blockId);
    if (blk)
      blk.w = w4;
  });
  sendOp({ type: "block-resize", pageId, blockId, w: w4 });
}
function updateBlockSrc(blockId, src) {
  const pageId = appState.value.ui.pageId;
  update((s5) => {
    const pg = getActivePage(s5);
    const blk = pg?.blocks.find((b2) => b2.id === blockId);
    if (blk)
      blk.src = src;
  });
  sendOp({ type: "block-update-src", pageId, blockId, src });
}
function updateBlockCrop(blockId, crop) {
  const pageId = appState.value.ui.pageId;
  update((s5) => {
    const pg = getActivePage(s5);
    const blk = pg?.blocks.find((b2) => b2.id === blockId);
    if (blk)
      blk.crop = crop;
  });
  sendOp({ type: "block-update-crop", pageId, blockId, crop });
}
function updateBlockBorder(blockId, border) {
  const pageId = appState.value.ui.pageId;
  update((s5) => {
    const pg = getActivePage(s5);
    const blk = pg?.blocks.find((b2) => b2.id === blockId);
    if (blk)
      blk.border = border || undefined;
  });
  sendOp({ type: "block-update-border", pageId, blockId, border });
}
function updateChecklistItems(blockId, items) {
  const pageId = appState.value.ui.pageId;
  update((s5) => {
    const pg = getActivePage(s5);
    const blk = pg?.blocks.find((b2) => b2.id === blockId);
    if (blk)
      blk.items = items;
  });
  sendOp({ type: "block-checklist-update", pageId, blockId, items });
}
function updateChecklistItemsSilent(blockId, items) {
  const pageId = appState.value.ui.pageId;
  silent((s5) => {
    const pg = getActivePage(s5);
    const blk = pg?.blocks.find((b2) => b2.id === blockId);
    if (blk)
      blk.items = items;
  });
  sendOp({ type: "block-checklist-update", pageId, blockId, items });
}
function updateBlockCaption(blockId, caption) {
  const pageId = appState.value.ui.pageId;
  update((s5) => {
    const pg = getActivePage(s5);
    const blk = pg?.blocks.find((b2) => b2.id === blockId);
    if (blk)
      blk.caption = caption ?? undefined;
  });
  sendOp({ type: "block-update-caption", pageId, blockId, caption });
}
function addImageFromFile(file, x3, y4) {
  const objectUrl = URL.createObjectURL(file);
  const blk = addBlock(x3, y4, 300, "image", { src: objectUrl });
  if (window.notebook) {
    file.arrayBuffer().then((buffer) => {
      const meta = {
        filename: file.name || undefined,
        mimeType: file.type || undefined,
        size: file.size || undefined,
        lastModified: file.lastModified || undefined
      };
      return window.notebook.saveBlob(buffer, meta);
    }).then((hash) => {
      if (hash)
        updateBlockSrc(blk.id, "blob:" + hash);
      URL.revokeObjectURL(objectUrl);
    });
  }
}
async function addImageFromUrl(url, x3, y4) {
  const placeholder = addBlock(x3, y4, 300, "loading");
  try {
    const { buffer, contentType, size } = await window.notebook.fetchImage(url);
    const filename = url.split("/").pop().split("?")[0];
    const meta = { filename, mimeType: contentType, size, lastModified: null };
    deleteBlock(placeholder.id);
    const hash = await window.notebook.saveBlob(buffer, meta);
    if (hash) {
      addBlock(x3, y4, 300, "image", { src: "blob:" + hash });
      return;
    }
  } catch (err) {
    deleteBlock(placeholder.id);
    (window.log || console.log)("[addImageFromUrl] error:", err.message);
  }
}
function updateBlockZ(blockId, z3) {
  const pageId = appState.value.ui.pageId;
  update((s5) => {
    const pg = getActivePage(s5);
    const blk = pg?.blocks.find((b2) => b2.id === blockId);
    if (blk)
      blk.z = z3;
  });
  sendOp({ type: "block-z", pageId, blockId, z: z3 });
}
function updatePageTree(sectionId, pages) {
  function toStructure(ps) {
    return ps.map((p5) => ({ id: p5.id, children: toStructure(p5.children ?? []) }));
  }
  sendOp({ type: "page-tree-update", sectionId, pages: toStructure(pages) });
}
function jumpToPage(sectionId, pageId) {
  lastPagePerSection.set(sectionId, pageId);
  update((s5) => {
    s5.ui.sectionId = sectionId;
    s5.ui.pageId = pageId;
  });
  persistUiState();
}
function updatePageView(panX, panY, zoom) {
  const pageId = appState.value.ui.pageId;
  silent((s5) => {
    const pg = getActivePage(s5);
    if (pg) {
      pg.panX = panX;
      pg.panY = panY;
      pg.zoom = zoom;
    }
  });
  if (hasIPC && _notebookPath && pageId) {
    window.notebook.savePageView(_notebookPath, pageId, panX, panY, zoom);
  }
}
var lastCaretPerPage = new Map;
function savePageCaret(pageId, blockId, offset) {
  if (hasIPC && _notebookPath && pageId) {
    window.notebook.savePageCaret(_notebookPath, pageId, blockId, offset);
  }
}
function updatePageTitle(pageId, title) {
  silent((s5) => {
    const nb = s5.notebooks.find((n3) => n3.id === s5.ui.notebookId);
    const sec = nb?.sections.find((sec2) => sec2.id === s5.ui.sectionId);
    const pg = sec ? findInTree(sec.pages, pageId) : null;
    if (pg)
      pg.title = title;
  });
}
function updatePageTitleAndRefresh(pageId, title) {
  update((s5) => {
    const nb = s5.notebooks.find((n3) => n3.id === s5.ui.notebookId);
    const sec = nb?.sections.find((sec2) => sec2.id === s5.ui.sectionId);
    const pg = sec ? findInTree(sec.pages, pageId) : null;
    if (pg)
      pg.title = title;
  });
  sendOp({ type: "page-rename", pageId, title });
}
async function openNotebook(notebookPath) {
  if (!hasIPC)
    return;
  _log("openNotebook called, path:", notebookPath);
  const state = await window.notebook.open(notebookPath);
  _log("openNotebook IPC returned — notebooks:", state?.notebooks?.length, "sections:", state?.notebooks?.[0]?.sections?.length);
  if (state) {
    setNotebookPath(notebookPath);
    const cfg = await window.notebook.getConfig();
    const saved = cfg.uiPositions?.[notebookPath];
    const nb = state.notebooks[0];
    if (saved && nb) {
      const sec = nb.sections.find((s5) => s5.id === saved.sectionId);
      const page = sec ? findInTree(sec.pages, saved.pageId) : null;
      state.ui = {
        notebookId: nb.id,
        sectionId: sec?.id ?? nb.sections[0]?.id ?? null,
        pageId: page?.id ?? sec?.pages[0]?.id ?? null
      };
      if (saved.lastPagePerSection) {
        for (const [secId, pgId] of Object.entries(saved.lastPagePerSection)) {
          lastPagePerSection.set(secId, pgId);
        }
      }
    } else {
      state.ui = {
        notebookId: nb?.id ?? null,
        sectionId: nb?.sections[0]?.id ?? null,
        pageId: nb?.sections[0]?.pages[0]?.id ?? null
      };
    }
    _log("openNotebook setting appState — ui:", JSON.stringify(state.ui));
    appState.value = state;
    connected.value = true;
    closeSwitcher();
    const title = nb?.title || "Untitled";
    _log("openNotebook saving config — path:", notebookPath, "title:", title);
    window.notebook.saveConfig({ path: notebookPath, name: title });
    if (Array.isArray(cfg.recentNotebooks))
      recentNotebooks.value = cfg.recentNotebooks;
  }
}
async function pickAndOpenNotebook() {
  if (!hasIPC)
    return;
  const dir = await window.notebook.pickDirectory();
  if (dir)
    await openNotebook(dir);
}
async function createAndOpenNotebook() {
  if (!hasIPC)
    return;
  const dir = await window.notebook.pickSavePath();
  if (dir)
    await openNotebook(dir);
}
var hasClaude = typeof window !== "undefined" && !!window.claude;
var claudeChat = c3({
  active: false,
  messages: [],
  streaming: false,
  position: { x: 100, y: 100 },
  error: null
});
function updateChat(fn) {
  const draft = structuredClone(claudeChat.value);
  fn(draft);
  claudeChat.value = draft;
}
async function startClaudeChat(x3, y4) {
  if (!hasClaude)
    return;
  if (claudeChat.value.active) {
    try {
      await window.claude.stop();
    } catch {}
    window.claude.offStream();
  }
  try {
    const pageId = appState.value.ui?.pageId;
    await window.claude.start(pageId);
  } catch (err) {
    console.error("[claude] start failed:", err);
    return;
  }
  window.claude.onStream((data) => {
    if (data.type === "text") {
      updateChat((c4) => {
        const last = c4.messages[c4.messages.length - 1];
        if (last && last.role === "assistant") {
          last.content = data.content;
        }
      });
    } else if (data.type === "tool_use") {
      updateChat((c4) => {
        const last = c4.messages[c4.messages.length - 1];
        if (last && last.role === "assistant" && !last.content) {
          last.content = `*Using ${data.tool}...*`;
        }
      });
    } else if (data.type === "done") {
      updateChat((c4) => {
        c4.streaming = false;
        const last = c4.messages[c4.messages.length - 1];
        if (last && last.role === "assistant" && data.result) {
          last.content = data.result;
        }
      });
    } else if (data.type === "error") {
      updateChat((c4) => {
        c4.streaming = false;
        c4.error = data.message;
      });
    }
  });
  claudeChat.value = {
    active: true,
    messages: [],
    streaming: false,
    position: { x: x3 ?? 100, y: y4 ?? 100 },
    error: null
  };
}
function sendClaudeMessage(text) {
  if (!hasClaude || !claudeChat.value.active)
    return;
  if (claudeChat.value.streaming) {
    window.claude.interrupt().catch(() => {});
  }
  updateChat((c4) => {
    c4.messages.push({ role: "user", content: text });
    c4.messages.push({ role: "assistant", content: "" });
    c4.streaming = true;
    c4.error = null;
  });
  window.claude.message(text).catch((err) => {
    updateChat((c4) => {
      c4.streaming = false;
      c4.error = err.message;
    });
  });
}
function closeClaudeChat() {
  if (hasClaude) {
    window.claude.stop().catch(() => {});
    window.claude.offStream();
  }
  claudeChat.value = {
    active: false,
    messages: [],
    streaming: false,
    position: { x: 100, y: 100 },
    error: null
  };
}
function updateClaudeChatPosition(x3, y4) {
  const c4 = claudeChat.value;
  claudeChat.value = { ...c4, position: { x: x3, y: y4 } };
}
var displayPanel = c3({
  active: false,
  uri: null,
  position: { x: 480, y: 80 }
});
function updateDisplayPanelPosition(x3, y4) {
  const d5 = displayPanel.value;
  displayPanel.value = { ...d5, position: { x: x3, y: y4 } };
}
function closeDisplayPanel() {
  displayPanel.value = { ...displayPanel.value, active: false, uri: null };
}
if (typeof window !== "undefined" && window.display) {
  window.display.onCommand((cmd) => {
    console.log("[display] command:", cmd);
    if (cmd.action === "open") {
      displayPanel.value = { ...displayPanel.value, active: true, uri: cmd.uri };
    } else if (cmd.action === "refresh") {
      const d5 = displayPanel.value;
      if (d5.active && d5.uri) {
        displayPanel.value = { ...d5, uri: d5.uri + (d5.uri.includes("?") ? "&" : "?") + "_r=" + Date.now() };
      }
    } else if (cmd.action === "close") {
      displayPanel.value = { ...displayPanel.value, active: false, uri: null };
    }
  });
}
if (hasIPC) {
  window.notebook.onStateChanged(async (state) => {
    _log("onStateChanged fired — notebooks:", state?.notebooks?.length, "sections:", state?.notebooks?.[0]?.sections?.length, "nb[0].title:", state?.notebooks?.[0]?.title);
    if (!state || !state.notebooks) {
      _log("onStateChanged: no state/notebooks, ignoring");
      return;
    }
    const ui = appState.value.ui;
    const nbExists = state.notebooks.find((n3) => n3.id === ui.notebookId);
    if (nbExists) {
      state.ui = ui;
    } else {
      const nb = state.notebooks[0];
      let restored = false;
      if (state.ui?.sectionId && nb) {
        const sec = nb.sections.find((s5) => s5.id === state.ui.sectionId);
        if (sec) {
          state.ui.notebookId = nb.id;
          restored = true;
        }
      }
      if (!restored && !_notebookPath) {
        try {
          const cfg = await window.notebook.getConfig();
          if (cfg.notebookPath) {
            setNotebookPath(cfg.notebookPath);
            const saved = cfg.uiPositions?.[cfg.notebookPath];
            if (saved && nb) {
              const sec = nb.sections.find((s5) => s5.id === saved.sectionId);
              const page = sec ? findInTree(sec.pages, saved.pageId) : null;
              state.ui = {
                notebookId: nb.id,
                sectionId: sec?.id ?? nb.sections[0]?.id ?? null,
                pageId: page?.id ?? sec?.pages[0]?.id ?? null
              };
              if (saved.lastPagePerSection) {
                for (const [secId, pgId] of Object.entries(saved.lastPagePerSection)) {
                  lastPagePerSection.set(secId, pgId);
                }
              }
              restored = true;
            }
          }
        } catch {}
      }
      if (!restored) {
        state.ui = {
          notebookId: nb?.id ?? null,
          sectionId: nb?.sections[0]?.id ?? null,
          pageId: nb?.sections[0]?.pages[0]?.id ?? null
        };
      }
    }
    if (_notebookPath) {
      try {
        const cfg = await window.notebook.getConfig();
        const views = cfg.pageViews?.[_notebookPath];
        if (views) {
          let applyViews = function(pages) {
            for (const pg of pages) {
              if (views[pg.id]) {
                const { panX, panY, zoom } = views[pg.id];
                if (panX != null)
                  pg.panX = panX;
                if (panY != null)
                  pg.panY = panY;
                if (zoom != null)
                  pg.zoom = zoom;
              }
              if (pg.children?.length)
                applyViews(pg.children);
            }
          };
          for (const nb of state.notebooks) {
            for (const sec of nb.sections)
              applyViews(sec.pages);
          }
          for (const [pageId, v5] of Object.entries(views)) {
            if (v5.caretBlockId) {
              lastCaretPerPage.set(pageId, { blockId: v5.caretBlockId, offset: v5.caretOffset ?? 0 });
            }
          }
        }
      } catch {}
    }
    _log("onStateChanged applied — ui:", JSON.stringify(state.ui), "_notebookPath:", _notebookPath);
    appState.value = { ...state };
    connected.value = true;
    initializing.value = false;
  });
}
// ../core/node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
var f4 = 0;
function u4(e4, t4, n3, o4, i4, u5) {
  t4 || (t4 = {});
  var a4, c4, p5 = t4;
  if ("ref" in p5)
    for (c4 in p5 = {}, t4)
      c4 == "ref" ? a4 = t4[c4] : p5[c4] = t4[c4];
  var l5 = { type: e4, props: p5, key: n3, ref: a4, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: undefined, __v: --f4, __i: -1, __u: 0, __source: i4, __self: u5 };
  if (typeof e4 == "function" && (a4 = e4.defaultProps))
    for (c4 in a4)
      p5[c4] === undefined && (p5[c4] = a4[c4]);
  return l.vnode && l.vnode(l5), l5;
}

// ../core/src/ContextMenu.tsx
var contextMenu = c3(null);
function openContextMenu(x3, y4, items) {
  contextMenu.value = { x: x3, y: y4, items };
}
function closeContextMenu() {
  contextMenu.value = null;
}
function openRenameMenu(x3, y4, currentName, onRename) {
  contextMenu.value = {
    x: x3,
    y: y4,
    items: [{ type: "rename", value: currentName, action: onRename }]
  };
}
function ContextMenu() {
  const menu = contextMenu.value;
  const ref = A2(null);
  const [confirmId, setConfirmId] = d2(null);
  const [renameVal, setRenameVal] = d2("");
  const renameRef = A2(null);
  y2(() => {
    setConfirmId(null);
    if (menu) {
      const renameItem = menu.items.find((i4) => i4.type === "rename");
      if (renameItem)
        setRenameVal(renameItem.value || "");
    }
  }, [menu]);
  y2(() => {
    if (menu && renameRef.current) {
      renameRef.current.focus();
      renameRef.current.select();
    }
  }, [menu]);
  y2(() => {
    if (!menu)
      return;
    function onDown(e4) {
      if (ref.current && !ref.current.contains(e4.target))
        closeContextMenu();
    }
    function onKey(e4) {
      if (e4.key === "Escape")
        closeContextMenu();
    }
    function onScroll() {
      closeContextMenu();
    }
    document.addEventListener("mousedown", onDown, true);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onDown, true);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [menu]);
  if (!menu)
    return null;
  const menuW = 200, menuH = menu.items.length * 32 + 8;
  const x3 = Math.min(menu.x, window.innerWidth - menuW - 4);
  const y4 = Math.min(menu.y, window.innerHeight - menuH - 4);
  function handleRenameSubmit(item) {
    const v5 = renameVal.trim();
    if (v5 && v5 !== item.value)
      item.action(v5);
    closeContextMenu();
  }
  return /* @__PURE__ */ u4("div", {
    class: "context-menu",
    ref,
    style: { left: x3 + "px", top: y4 + "px" },
    onMouseDown: (e4) => e4.preventDefault(),
    children: menu.items.map((item, i4) => {
      if (item.type === "separator") {
        return /* @__PURE__ */ u4("div", {
          class: "context-menu-separator"
        }, i4, false, undefined, this);
      }
      if (item.type === "rename") {
        return /* @__PURE__ */ u4("div", {
          class: "context-menu-rename",
          children: [
            /* @__PURE__ */ u4("input", {
              ref: renameRef,
              class: "context-menu-input",
              value: renameVal,
              onInput: (e4) => setRenameVal(e4.target.value),
              onKeyDown: (e4) => {
                if (e4.key === "Enter")
                  handleRenameSubmit(item);
                if (e4.key === "Escape")
                  closeContextMenu();
              }
            }, undefined, false, undefined, this),
            /* @__PURE__ */ u4("button", {
              class: "context-menu-rename-ok",
              onClick: () => handleRenameSubmit(item),
              children: "✓"
            }, undefined, false, undefined, this)
          ]
        }, i4, true, undefined, this);
      }
      if (item.type === "confirm") {
        const confirmItem = item;
        const isConfirming = confirmId === i4;
        return /* @__PURE__ */ u4("div", {
          class: `context-menu-item ${isConfirming ? "context-menu-item--danger" : ""}`,
          onClick: () => {
            if (isConfirming) {
              confirmItem.action();
              closeContextMenu();
            } else
              setConfirmId(i4);
          },
          children: isConfirming ? confirmItem.confirmLabel || "Confirm delete?" : confirmItem.label
        }, i4, false, undefined, this);
      }
      if (item.type === "submenu") {
        const submenuItem = item;
        return /* @__PURE__ */ u4("div", {
          class: "context-menu-item context-menu-submenu",
          children: [
            /* @__PURE__ */ u4("span", {
              children: submenuItem.label
            }, undefined, false, undefined, this),
            /* @__PURE__ */ u4("span", {
              class: "context-menu-arrow",
              children: "▸"
            }, undefined, false, undefined, this),
            /* @__PURE__ */ u4("div", {
              class: "context-menu-sub",
              children: submenuItem.children.map((child, j3) => /* @__PURE__ */ u4("div", {
                class: "context-menu-item",
                onClick: () => {
                  child.action();
                  closeContextMenu();
                },
                children: child.label
              }, j3, false, undefined, this))
            }, undefined, false, undefined, this)
          ]
        }, i4, true, undefined, this);
      }
      if (item.disabled) {
        return /* @__PURE__ */ u4("div", {
          class: "context-menu-item context-menu-item--disabled",
          children: item.label
        }, i4, false, undefined, this);
      }
      return /* @__PURE__ */ u4("div", {
        class: "context-menu-item",
        onClick: () => {
          item.action();
          closeContextMenu();
        },
        children: item.label
      }, i4, false, undefined, this);
    })
  }, undefined, false, undefined, this);
}

// ../core/src/SectionPanel.tsx
function SectionPanel() {
  const { notebooks, ui } = appState.value;
  const nb = notebooks.find((n3) => n3.id === ui.notebookId);
  const sections = nb?.sections ?? [];
  const dragId = A2(null);
  return /* @__PURE__ */ u4("div", {
    id: "section-tabs",
    children: [
      sections.map((sec, i4) => /* @__PURE__ */ u4("div", {
        class: ["sec-tab", sec.id === ui.sectionId && "sec-tab--active"].filter(Boolean).join(" "),
        onClick: () => setActiveSection(sec.id),
        onDblClick: (e4) => {
          openRenameMenu(e4.clientX, e4.clientY, sec.title, (t4) => renameSection(nb.id, sec.id, t4));
        },
        onContextMenu: (e4) => {
          e4.preventDefault();
          openContextMenu(e4.clientX, e4.clientY, [
            { label: "Rename", action: () => openRenameMenu(e4.clientX, e4.clientY, sec.title, (t4) => renameSection(nb.id, sec.id, t4)) },
            { type: "separator" },
            {
              type: "confirm",
              label: "Delete",
              confirmLabel: sections.length <= 1 ? "Cannot delete last section" : `Delete "${sec.title}"?`,
              action: () => {
                if (sections.length > 1)
                  deleteSection(nb.id, sec.id);
              }
            }
          ]);
        },
        draggable: true,
        onDragStart: () => {
          dragId.current = sec.id;
        },
        onDragOver: (e4) => e4.preventDefault(),
        onDrop: (e4) => {
          e4.preventDefault();
          if (!dragId.current || dragId.current === sec.id)
            return;
          const ids = sections.map((s5) => s5.id);
          const from = ids.indexOf(dragId.current), to = ids.indexOf(sec.id);
          const next = [...ids];
          next.splice(from, 1);
          next.splice(to, 0, dragId.current);
          reorderSections(nb.id, next);
          dragId.current = null;
        },
        children: [
          i4 > 0 && /* @__PURE__ */ u4("span", {
            class: "sec-tab-left-corner"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ u4("div", {
            class: "sec-tab-body",
            children: sec.title
          }, undefined, false, undefined, this),
          /* @__PURE__ */ u4("span", {
            class: "sec-tab-right-corner"
          }, undefined, false, undefined, this)
        ]
      }, sec.id, true, undefined, this)),
      /* @__PURE__ */ u4("button", {
        class: "sec-add",
        onClick: () => nb && addSection(nb.id),
        title: "New section",
        children: "+"
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// ../core/src/PagesPanel.tsx
function flattenPageIds(pages) {
  const ids = [];
  for (const p5 of pages) {
    ids.push(p5.id);
    if (p5.children?.length)
      ids.push(...flattenPageIds(p5.children));
  }
  return ids;
}
function isDescendantOf(pages, ancestorId, targetId) {
  const ancestor = findInTree(pages, ancestorId);
  if (!ancestor || !ancestor.children?.length)
    return false;
  return !!findInTree(ancestor.children, targetId);
}
function getPageRange(pages, idA, idB) {
  const flat = flattenPageIds(pages);
  const a4 = flat.indexOf(idA), b2 = flat.indexOf(idB);
  if (a4 === -1 || b2 === -1)
    return [idB];
  const lo = Math.min(a4, b2), hi = Math.max(a4, b2);
  return flat.slice(lo, hi + 1);
}
var drag = { pageId: null, over: null, mode: null };
function deletePageWithChildren(page) {
  if (!page.children?.length) {
    deletePage(page.id);
    return;
  }
  const s5 = appState.value;
  const nb = s5.notebooks.find((n3) => n3.id === s5.ui.notebookId);
  const sec = nb?.sections.find((sec2) => sec2.id === s5.ui.sectionId);
  if (!sec)
    return;
  function promoteChildren(pages) {
    for (let i4 = 0;i4 < pages.length; i4++) {
      if (pages[i4].id === page.id) {
        const children = pages[i4].children ?? [];
        pages.splice(i4, 1, ...children);
        return true;
      }
      if (promoteChildren(pages[i4].children ?? []))
        return true;
    }
    return false;
  }
  promoteChildren(sec.pages);
  appState.value = { ...appState.value };
  updatePageTree(sec.id, sec.pages);
}
function PageItem({ page, activeId, depth = 0, dragState, onDragChange, editingId, onStartEditing, selected, onSelect, onBulkDelete }) {
  const [open, setOpen] = d2(true);
  const hasKids = (page.children?.length ?? 0) > 0;
  const isOver = dragState.over === page.id;
  const dropMode = isOver ? dragState.mode : null;
  const isEditing = editingId === page.id;
  const editRef = A2(null);
  const [editVal, setEditVal] = d2(page.title);
  const isSelected = selected?.has(page.id);
  y2(() => {
    if (isEditing) {
      setEditVal(page.title);
      if (editRef.current) {
        editRef.current.focus();
        editRef.current.select();
      }
    }
  }, [isEditing]);
  function commitEdit() {
    const v5 = editVal.trim() || "Untitled Page";
    if (v5 !== page.title)
      renamePage(page.id, v5);
    onStartEditing(null);
  }
  function onDragStart(e4) {
    e4.stopPropagation();
    drag.pageId = page.id;
    e4.dataTransfer.effectAllowed = "move";
  }
  function onDragEnd() {
    drag.pageId = null;
    onDragChange(null, null);
  }
  function onDragOver(e4) {
    e4.preventDefault();
    e4.stopPropagation();
    if (drag.pageId === page.id)
      return;
    const rect = e4.currentTarget.getBoundingClientRect();
    const rel = (e4.clientY - rect.top) / rect.height;
    const mode = rel < 0.3 ? "before" : rel > 0.7 ? "after" : "child";
    if (dragState.over !== page.id || dragState.mode !== mode) {
      onDragChange(page.id, mode);
    }
  }
  function onDragLeave(e4) {
    if (!e4.currentTarget.contains(e4.relatedTarget))
      onDragChange(null, null);
  }
  function onDrop(e4) {
    e4.preventDefault();
    e4.stopPropagation();
    const fromId = drag.pageId;
    const mode = dragState.mode;
    drag.pageId = null;
    onDragChange(null, null);
    if (!fromId || fromId === page.id)
      return;
    const s5 = appState.value;
    const nb = s5.notebooks.find((n3) => n3.id === s5.ui.notebookId);
    const sec = nb?.sections.find((sec2) => sec2.id === s5.ui.sectionId);
    if (!sec)
      return;
    if (isDescendantOf(sec.pages, fromId, page.id))
      return;
    let extracted = null;
    function extract(pages) {
      for (let i4 = 0;i4 < pages.length; i4++) {
        if (pages[i4].id === fromId) {
          [extracted] = pages.splice(i4, 1);
          return true;
        }
        if (extract(pages[i4].children ?? []))
          return true;
      }
      return false;
    }
    extract(sec.pages);
    if (!extracted)
      return;
    if (mode === "child") {
      const target = findInTree(sec.pages, page.id);
      if (target) {
        target.children = target.children ?? [];
        target.children.push(extracted);
      }
    } else if (mode === "before") {
      let insertBefore = function(pages) {
        for (let i4 = 0;i4 < pages.length; i4++) {
          if (pages[i4].id === page.id) {
            pages.splice(i4, 0, extracted);
            return true;
          }
          if (insertBefore(pages[i4].children ?? []))
            return true;
        }
        return false;
      };
      insertBefore(sec.pages);
    } else {
      let insertAfter = function(pages) {
        for (let i4 = 0;i4 < pages.length; i4++) {
          if (pages[i4].id === page.id) {
            pages.splice(i4 + 1, 0, extracted);
            return true;
          }
          if (insertAfter(pages[i4].children ?? []))
            return true;
        }
        return false;
      };
      insertAfter(sec.pages);
    }
    appState.value = { ...appState.value };
    updatePageTree(sec.id, sec.pages);
  }
  function openPageContextMenu(e4) {
    e4.preventDefault();
    if (selected?.size > 1 && selected.has(page.id)) {
      openContextMenu(e4.clientX, e4.clientY, [
        {
          type: "confirm",
          label: `Delete ${selected.size} pages`,
          confirmLabel: `Delete ${selected.size} pages?`,
          action: onBulkDelete
        }
      ]);
      return;
    }
    const nb = appState.value.notebooks.find((n3) => n3.id === appState.value.ui.notebookId);
    const sections = nb?.sections ?? [];
    const moveChildren = sections.filter((s5) => s5.id !== appState.value.ui.sectionId).map((s5) => ({ label: s5.title, action: () => movePage(page.id, s5.id) }));
    const items = [
      { label: "Rename", action: () => onStartEditing(page.id) },
      { label: "Add Subpage", action: () => addPage(page.id) }
    ];
    if (moveChildren.length > 0) {
      items.push({ type: "submenu", label: "Move to Section", children: moveChildren });
    }
    items.push({ type: "separator" });
    if (page.children?.length) {
      items.push({
        type: "confirm",
        label: "Delete (promote subpages)",
        confirmLabel: `Delete "${page.title}"?`,
        action: () => deletePageWithChildren(page)
      });
    } else {
      items.push({
        type: "confirm",
        label: "Delete",
        confirmLabel: `Delete "${page.title}"?`,
        action: () => deletePage(page.id)
      });
    }
    openContextMenu(e4.clientX, e4.clientY, items);
  }
  return /* @__PURE__ */ u4("div", {
    class: "page-item-wrap",
    children: [
      /* @__PURE__ */ u4("div", {
        class: [
          "panel-item page-item",
          page.id === activeId && !selected?.size && "panel-item--active",
          isSelected && "panel-item--selected",
          dropMode === "before" && "page-item--drop-before",
          dropMode === "child" && "page-item--drop-child",
          dropMode === "after" && "page-item--drop-after"
        ].filter(Boolean).join(" "),
        style: { paddingLeft: depth * 12 + "px" },
        draggable: true,
        onMouseEnter: () => preloadPage(page),
        onDragStart,
        onDragEnd,
        onDragOver,
        onDragLeave,
        onDrop,
        onClick: (e4) => {
          if (e4.ctrlKey || e4.metaKey || e4.shiftKey) {
            e4.preventDefault();
            onSelect(page.id, e4);
          } else {
            if (selected?.size)
              onSelect(null);
            setActivePage(page.id);
          }
        },
        onDblClick: (e4) => {
          e4.stopPropagation();
          onStartEditing(page.id);
        },
        onContextMenu: openPageContextMenu,
        children: [
          /* @__PURE__ */ u4("span", {
            class: "page-expand",
            style: { visibility: hasKids ? "visible" : "hidden" },
            onClick: (e4) => {
              e4.stopPropagation();
              setOpen((o4) => !o4);
            },
            children: open ? "▾" : "▸"
          }, undefined, false, undefined, this),
          isEditing ? /* @__PURE__ */ u4("input", {
            ref: editRef,
            class: "page-title-edit",
            value: editVal,
            onInput: (e4) => setEditVal(e4.target.value),
            onBlur: commitEdit,
            onKeyDown: (e4) => {
              if (e4.key === "Enter") {
                e4.preventDefault();
                commitEdit();
              }
              if (e4.key === "Escape") {
                e4.preventDefault();
                onStartEditing(null);
              }
            },
            onClick: (e4) => e4.stopPropagation()
          }, undefined, false, undefined, this) : /* @__PURE__ */ u4("span", {
            class: "page-title-text",
            children: page.title
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      hasKids && open && /* @__PURE__ */ u4("div", {
        class: "subpages",
        style: { "--depth": depth },
        children: page.children.map((c4) => /* @__PURE__ */ u4(PageItem, {
          page: c4,
          activeId,
          depth: depth + 1,
          dragState,
          onDragChange,
          editingId,
          onStartEditing,
          selected,
          onSelect,
          onBulkDelete
        }, c4.id, false, undefined, this))
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
function PagesPanel() {
  const { notebooks, ui } = appState.value;
  const nb = notebooks.find((n3) => n3.id === ui.notebookId);
  const sec = nb?.sections.find((s5) => s5.id === ui.sectionId);
  const pages = sec?.pages ?? [];
  const [dragOver, setDragOver] = d2({ id: null, mode: null });
  const [editingId, setEditingId] = d2(null);
  const [selected, setSelected] = d2(new Set);
  const [confirmDelete, setConfirmDelete] = d2(false);
  const lastSelectedRef = A2(null);
  y2(() => {
    setSelected(new Set);
    lastSelectedRef.current = null;
  }, [ui.sectionId]);
  function onDragChange(id, mode) {
    setDragOver({ id, mode });
  }
  const onSelect = q2((pageId, e4) => {
    if (pageId === null) {
      setSelected(new Set);
      lastSelectedRef.current = null;
      return;
    }
    setSelected((prev) => {
      const next = new Set(prev);
      if (e4?.shiftKey && lastSelectedRef.current) {
        const range = getPageRange(pages, lastSelectedRef.current, pageId);
        for (const id of range)
          next.add(id);
      } else if (e4?.ctrlKey || e4?.metaKey) {
        if (next.has(pageId))
          next.delete(pageId);
        else
          next.add(pageId);
      } else {
        next.clear();
        next.add(pageId);
      }
      lastSelectedRef.current = pageId;
      return next;
    });
  }, [pages]);
  function doBulkDelete() {
    for (const id of selected) {
      const pg = findInTree(pages, id);
      if (pg)
        deletePageWithChildren(pg);
      else
        deletePage(id);
    }
    setSelected(new Set);
    setConfirmDelete(false);
  }
  y2(() => {
    function onKey(e4) {
      if (selected.size && (e4.key === "Delete" || e4.key === "Backspace") && !editingId) {
        e4.preventDefault();
        setConfirmDelete(true);
      }
      if (e4.key === "Escape") {
        if (confirmDelete)
          setConfirmDelete(false);
        else if (selected.size)
          setSelected(new Set);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, editingId, confirmDelete]);
  const dragState = { over: dragOver.id, mode: dragOver.mode };
  return /* @__PURE__ */ u4("div", {
    id: "pages-panel",
    children: [
      /* @__PURE__ */ u4("div", {
        class: "panel-header",
        children: /* @__PURE__ */ u4("button", {
          class: "add-btn",
          onClick: () => addPage(),
          children: "+ New Page"
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ u4("div", {
        class: "panel-list",
        children: pages.map((pg) => /* @__PURE__ */ u4(PageItem, {
          page: pg,
          activeId: ui.pageId,
          dragState,
          onDragChange,
          editingId,
          onStartEditing: setEditingId,
          selected,
          onSelect,
          onBulkDelete: doBulkDelete
        }, pg.id, false, undefined, this))
      }, undefined, false, undefined, this),
      confirmDelete && /* @__PURE__ */ u4("div", {
        class: "confirm-overlay",
        onClick: () => setConfirmDelete(false),
        children: /* @__PURE__ */ u4("div", {
          class: "confirm-dialog",
          onClick: (e4) => e4.stopPropagation(),
          children: [
            /* @__PURE__ */ u4("p", {
              children: [
                "Delete ",
                selected.size,
                " page",
                selected.size > 1 ? "s" : "",
                "?"
              ]
            }, undefined, true, undefined, this),
            /* @__PURE__ */ u4("p", {
              class: "confirm-sub",
              children: "This cannot be undone. Subpages will be promoted."
            }, undefined, false, undefined, this),
            /* @__PURE__ */ u4("div", {
              class: "confirm-buttons",
              children: [
                /* @__PURE__ */ u4("button", {
                  class: "confirm-cancel",
                  onClick: () => setConfirmDelete(false),
                  children: "Cancel"
                }, undefined, false, undefined, this),
                /* @__PURE__ */ u4("button", {
                  class: "confirm-delete",
                  onClick: doBulkDelete,
                  children: "Delete"
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// ../core/src/editor.ts
function getSelectionInfo() {
  const sel = window.getSelection();
  if (!sel?.rangeCount)
    return null;
  const range = sel.getRangeAt(0);
  const node = range.startContainer;
  if (node.nodeType !== Node.TEXT_NODE)
    return null;
  return { sel, range, node, text: node.textContent, offset: range.startOffset };
}
function eatText(sel, node, start, end) {
  const r4 = document.createRange();
  r4.setStart(node, start);
  r4.setEnd(node, end);
  sel.removeAllRanges();
  sel.addRange(r4);
  document.execCommand("delete");
}
function wrapMatch(sel, node, match, tag) {
  const idx = match.index;
  const full = match[0];
  const inner = match[1];
  const before = node.textContent.slice(0, idx);
  const after = node.textContent.slice(idx + full.length);
  node.textContent = before;
  const el = document.createElement(tag);
  el.textContent = inner;
  node.parentNode.insertBefore(el, node.nextSibling);
  const afterNode = document.createTextNode(after);
  el.after(afterNode);
  const r4 = document.createRange();
  r4.setStart(afterNode, 0);
  r4.collapse(true);
  sel.removeAllRanges();
  sel.addRange(r4);
}
function execFmt(cmd) {
  const map = {
    bold: () => document.execCommand("bold"),
    italic: () => document.execCommand("italic"),
    underline: () => document.execCommand("underline"),
    strikethrough: () => document.execCommand("strikeThrough"),
    h1: () => document.execCommand("formatBlock", false, "H1"),
    h2: () => document.execCommand("formatBlock", false, "H2"),
    h3: () => document.execCommand("formatBlock", false, "H3"),
    h4: () => document.execCommand("formatBlock", false, "H4"),
    p: () => document.execCommand("formatBlock", false, "P"),
    ul: () => document.execCommand("insertUnorderedList"),
    ol: () => document.execCommand("insertOrderedList"),
    link: () => {
      const u5 = prompt("URL:");
      if (u5)
        document.execCommand("createLink", false, u5);
    }
  };
  map[cmd]?.();
}
function handleMarkdownInput(el) {
  const info = getSelectionInfo();
  if (!info)
    return null;
  const { sel, range, node, text, offset } = info;
  const before = text.slice(0, offset);
  const hMatch = before.match(/^(#{1,4}) $/);
  if (hMatch) {
    eatText(sel, node, 0, offset);
    document.execCommand("formatBlock", false, `H${hMatch[1].length}`);
    return null;
  }
  if (before === "- " || before === "* ") {
    eatText(sel, node, 0, offset);
    document.execCommand("insertUnorderedList");
    return null;
  }
  if (/^\d+\. $/.test(before)) {
    eatText(sel, node, 0, offset);
    document.execCommand("insertOrderedList");
    return null;
  }
  if (before === "> ") {
    eatText(sel, node, 0, offset);
    document.execCommand("formatBlock", false, "BLOCKQUOTE");
    return null;
  }
  if (before === "``` ") {
    eatText(sel, node, 0, offset);
    el.setAttribute("data-code", "1");
    el.classList.add("code-block");
    return "code";
  }
  const boldM = before.match(/\*\*(.+?)\*\*$/) || before.match(/__(.+?)__$/);
  if (boldM) {
    wrapMatch(sel, node, boldM, "strong");
    return null;
  }
  const italicM = before.match(/(?<!\*)\*([^*\n]+)\*$/) || before.match(/(?<!_)_([^_\n]+)_$/);
  if (italicM) {
    wrapMatch(sel, node, italicM, "em");
    return null;
  }
  return null;
}
function handleInlineCode(el) {
  const info = getSelectionInfo();
  if (!info)
    return false;
  const { sel, range, node, offset } = info;
  const before = node.textContent.slice(0, offset);
  const m4 = before.match(/`([^`\n]+)`$/);
  if (!m4)
    return false;
  const idx = m4.index;
  const inner = m4[1];
  const before2 = node.textContent.slice(0, idx);
  const after = node.textContent.slice(idx + m4[0].length);
  node.textContent = before2;
  const code = document.createElement("code");
  code.textContent = inner;
  node.parentNode.insertBefore(code, node.nextSibling);
  const afterNode = document.createTextNode(after || "​");
  code.after(afterNode);
  const r4 = document.createRange();
  r4.setStart(afterNode, 0);
  r4.collapse(true);
  sel.removeAllRanges();
  sel.addRange(r4);
  return true;
}
function handleListKey(e4) {
  const container = window.getSelection()?.getRangeAt(0)?.startContainer;
  const li = container && (container.nodeType === Node.ELEMENT_NODE ? container.closest("li") : container.parentElement?.closest("li"));
  if (!li)
    return false;
  if (e4.key === "Tab") {
    e4.preventDefault();
    document.execCommand(e4.shiftKey ? "outdent" : "indent");
    return true;
  }
  if (e4.key === "Enter" && li.textContent.trim() === "") {
    const listEl = li.parentElement;
    const isTopLevel = listEl && (listEl.tagName === "UL" || listEl.tagName === "OL") && listEl.parentElement?.tagName !== "LI";
    if (isTopLevel) {
      e4.preventDefault();
      document.execCommand("outdent");
      document.execCommand("formatBlock", false, "P");
      return true;
    }
    if (!isTopLevel) {
      e4.preventDefault();
      document.execCommand("outdent");
      return true;
    }
  }
  if (e4.key === "Backspace" && li.textContent.trim() === "") {
    e4.preventDefault();
    document.execCommand("outdent");
    return true;
  }
  return false;
}
function handleCodeTab(e4, el) {
  if (!el.getAttribute("data-code"))
    return false;
  if (e4.key !== "Tab")
    return false;
  e4.preventDefault();
  document.execCommand("insertText", false, "  ");
  return true;
}
function onBlockKeyDown(e4, el) {
  const mod = e4.ctrlKey || e4.metaKey;
  if (mod && !e4.shiftKey && !e4.altKey) {
    if (e4.key === "b") {
      e4.preventDefault();
      document.execCommand("bold");
      return true;
    }
    if (e4.key === "i") {
      e4.preventDefault();
      document.execCommand("italic");
      return true;
    }
    if (e4.key === "u") {
      e4.preventDefault();
      document.execCommand("underline");
      return true;
    }
  }
  if (handleCodeTab(e4, el))
    return true;
  if (handleListKey(e4))
    return true;
  if (e4.key === "Tab") {
    e4.preventDefault();
    return true;
  }
  if (e4.key === "`") {
    setTimeout(() => handleInlineCode(el), 0);
  }
  return false;
}

// ../core/src/undo.ts
var stacks = new Map;
function get(pageId) {
  if (!stacks.has(pageId))
    stacks.set(pageId, { past: [], future: [] });
  return stacks.get(pageId);
}
function pushUndo(pageId, delta) {
  const s5 = get(pageId);
  s5.past.push(delta);
  s5.future = [];
  if (s5.past.length > 200)
    s5.past.shift();
}
function applyUndo(pageId, page) {
  const s5 = get(pageId);
  if (!s5.past.length)
    return false;
  const delta = s5.past.pop();
  const reverse = apply(page, delta);
  if (reverse)
    s5.future.push(reverse);
  return true;
}
function applyRedo(pageId, page) {
  const s5 = get(pageId);
  if (!s5.future.length)
    return false;
  const delta = s5.future.pop();
  const reverse = apply(page, delta);
  if (reverse)
    s5.past.push(reverse);
  return true;
}
function apply(page, delta) {
  const blocks = page.blocks;
  if (delta.type === "move") {
    const rev = [];
    for (const m4 of delta.moves) {
      const b2 = blocks.find((b3) => b3.id === m4.id);
      if (b2) {
        rev.push({ id: b2.id, x: b2.x, y: b2.y });
        b2.x = m4.x;
        b2.y = m4.y;
      }
    }
    return { type: "move", moves: rev };
  }
  if (delta.type === "resize") {
    const b2 = blocks.find((b3) => b3.id === delta.id);
    if (!b2)
      return null;
    const rev = { type: "resize", id: b2.id, w: b2.w };
    if (delta.x != null) {
      rev.x = b2.x;
      rev.y = b2.y;
      b2.x = delta.x;
      b2.y = delta.y;
    }
    b2.w = delta.w;
    return rev;
  }
  if (delta.type === "html") {
    const b2 = blocks.find((b3) => b3.id === delta.id);
    if (!b2)
      return null;
    const rev = { type: "html", id: b2.id, html: b2.html };
    b2.html = delta.html;
    return rev;
  }
  if (delta.type === "add") {
    const rev = { type: "delete", blocks: [blocks.find((b2) => b2.id === delta.id)].filter(Boolean) };
    page.blocks = blocks.filter((b2) => b2.id !== delta.id);
    return rev.blocks.length ? rev : null;
  }
  if (delta.type === "delete") {
    const ids = delta.blocks.map((b2) => b2.id);
    page.blocks = [...blocks, ...delta.blocks];
    return { type: "deleteForward", ids };
  }
  if (delta.type === "deleteForward") {
    const removed = blocks.filter((b2) => delta.ids.includes(b2.id));
    page.blocks = blocks.filter((b2) => !delta.ids.includes(b2.id));
    return { type: "delete", blocks: removed };
  }
  if (delta.type === "checklist") {
    const b2 = blocks.find((b3) => b3.id === delta.id);
    if (!b2)
      return null;
    const rev = { type: "checklist", id: b2.id, items: (b2.items || []).map((i4) => ({ ...i4 })) };
    b2.items = delta.items;
    return rev;
  }
  if (delta.type === "crop") {
    const b2 = blocks.find((b3) => b3.id === delta.id);
    if (!b2)
      return null;
    const rev = { type: "crop", id: b2.id, crop: b2.crop ?? null };
    b2.crop = delta.crop ?? undefined;
    return rev;
  }
  return null;
}

// ../core/src/clipboard.ts
function canvasCenter(container, view) {
  const { zoom } = view;
  const rect = container?.getBoundingClientRect();
  return {
    x: rect ? (rect.width / 2 + container.scrollLeft) / zoom : 100,
    y: rect ? (rect.height / 2 + container.scrollTop) / zoom : 100
  };
}
function pasteInsertPoint(container, view) {
  const { zoom } = view;
  if (!container)
    return { x: 40, y: 40, w: 600 };
  const margin = 40;
  return {
    x: container.scrollLeft / zoom + margin,
    y: container.scrollTop / zoom + margin,
    w: Math.round(container.clientWidth * (2 / 3) / zoom)
  };
}
function toHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
}
function _liToMd(li, indent) {
  let text = "";
  let nested = "";
  for (const c4 of li.childNodes) {
    if (c4.nodeType === Node.ELEMENT_NODE && (c4.tagName === "UL" || c4.tagName === "OL"))
      nested += `
` + _nodeToMd(c4, indent + "    ");
    else
      text += _nodeToMd(c4, indent);
  }
  return text.trim() + nested.trimEnd();
}
function _nodeToMd(node, indent = "") {
  if (node.nodeType === Node.TEXT_NODE)
    return node.textContent;
  if (node.nodeType !== Node.ELEMENT_NODE)
    return "";
  const el = node;
  const tag = el.tagName.toLowerCase();
  const inner = () => [...el.childNodes].map((c4) => _nodeToMd(c4, indent)).join("");
  switch (tag) {
    case "strong":
    case "b":
      return `**${inner()}**`;
    case "em":
    case "i":
      return `*${inner()}*`;
    case "s":
    case "strike":
    case "del":
      return `~~${inner()}~~`;
    case "code":
      return `\`${inner()}\``;
    case "a": {
      const href = el.getAttribute("href") || "";
      const t4 = inner();
      return href ? `[${t4}](${href})` : t4;
    }
    case "br":
      return `
`;
    case "h1":
      return `# ${inner()}

`;
    case "h2":
      return `## ${inner()}

`;
    case "h3":
      return `### ${inner()}

`;
    case "h4":
      return `#### ${inner()}

`;
    case "h5":
      return `##### ${inner()}

`;
    case "h6":
      return `###### ${inner()}

`;
    case "ul": {
      let r4 = "";
      for (const c4 of el.childNodes) {
        if (c4.nodeType !== Node.ELEMENT_NODE)
          continue;
        const ce = c4;
        if (ce.tagName === "LI")
          r4 += `${indent}- ${_liToMd(ce, indent)}
`;
        else if (ce.tagName === "UL" || ce.tagName === "OL")
          r4 += _nodeToMd(ce, indent + "    ");
      }
      return r4 + (indent ? "" : `
`);
    }
    case "ol": {
      let r4 = "";
      let i4 = 1;
      for (const c4 of el.childNodes) {
        if (c4.nodeType !== Node.ELEMENT_NODE)
          continue;
        const ce = c4;
        if (ce.tagName === "LI")
          r4 += `${indent}${i4++}. ${_liToMd(ce, indent)}
`;
        else if (ce.tagName === "UL" || ce.tagName === "OL")
          r4 += _nodeToMd(ce, indent + "    ");
      }
      return r4 + (indent ? "" : `
`);
    }
    case "li":
      return `${indent}- ${_liToMd(el, indent)}
`;
    case "p":
      return `${inner()}

`;
    case "div": {
      if (el.childNodes.length === 1 && el.firstChild?.nodeName === "BR")
        return `
`;
      const c4 = inner();
      return c4 ? `${c4}
` : "";
    }
    default:
      return inner();
  }
}
function htmlToMarkdown(html) {
  const wrap = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html").body.firstChild;
  return _nodeToMd(wrap).replace(/\n{3,}/g, `

`).trim();
}
function initPasteHandler({ getContainer, getView }) {
  function onPaste(e4) {
    const items = [...e4.clipboardData?.items || []];
    const pastedFiles = [...e4.clipboardData?.files || []].filter((f5) => f5.type.startsWith("image/"));
    if (pastedFiles.length) {
      e4.preventDefault();
      const { x: x4, y: y5 } = canvasCenter(getContainer(), getView());
      pastedFiles.forEach((file, i4) => addImageFromFile(file, x4 + i4 * 20, y5 + i4 * 20));
      return;
    }
    const imageItem = items.find((i4) => i4.type.startsWith("image/"));
    if (imageItem) {
      e4.preventDefault();
      const file = imageItem.getAsFile();
      if (!file)
        return;
      const { x: x4, y: y5 } = canvasCenter(getContainer(), getView());
      addImageFromFile(file, x4, y5);
      return;
    }
    const html = e4.clipboardData?.getData("text/html") || "";
    if (html && addImageFromUrl) {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const srcs = [...doc.querySelectorAll("img")].map((img) => img.src).filter((src) => src && !src.startsWith("data:"));
      if (srcs.length) {
        e4.preventDefault();
        const { x: x4, y: y5 } = canvasCenter(getContainer(), getView());
        srcs.forEach((src, i4) => addImageFromUrl(src, x4 + i4 * 20, y5 + i4 * 20));
        return;
      }
    }
    if (document.activeElement?.closest("[contenteditable]"))
      return;
    const text = e4.clipboardData?.getData("text/plain") || "";
    if (!text.trim())
      return;
    e4.preventDefault();
    const { x: x3, y: y4, w: w4 } = pasteInsertPoint(getContainer(), getView());
    addBlock(x3, y4, w4, "text", { html: toHtml(text) });
  }
  document.addEventListener("paste", onPaste);
  return () => document.removeEventListener("paste", onPaste);
}
var _copiedBlocks = null;
if (typeof document !== "undefined") {
  document.addEventListener("copy", () => {
    _copiedBlocks = null;
  });
  document.addEventListener("cut", () => {
    _copiedBlocks = null;
  });
}
function copyBlocks(blocks) {
  _copiedBlocks = structuredClone(blocks);
  const text = blocks.filter((b2) => b2.type === "text" || b2.type === "code").map((b2) => {
    const d5 = document.createElement("div");
    d5.innerHTML = b2.html;
    return d5.textContent || "";
  }).filter(Boolean).join(`

`);
  if (text)
    navigator.clipboard.writeText(text).catch(() => {});
}
function getCopiedBlocks() {
  return _copiedBlocks;
}

// ../core/src/Block.tsx
function computeTextDiff(oldText, newText) {
  let p5 = 0;
  const minLen = Math.min(oldText.length, newText.length);
  while (p5 < minLen && oldText[p5] === newText[p5])
    p5++;
  let oldEnd = oldText.length;
  let newEnd = newText.length;
  while (oldEnd > p5 && newEnd > p5 && oldText[oldEnd - 1] === newText[newEnd - 1]) {
    oldEnd--;
    newEnd--;
  }
  const diffs = [];
  if (oldEnd > p5)
    diffs.push({ type: "delete", pos: p5, count: oldEnd - p5 });
  const ins = newText.slice(p5, newEnd);
  if (ins)
    diffs.push({ type: "insert", pos: p5, text: ins });
  return diffs;
}
var linkMenu = c3(null);
function LinkContextMenu() {
  const m4 = linkMenu.value;
  if (!m4)
    return null;
  const close = () => {
    linkMenu.value = null;
  };
  const openLink = () => {
    if (window.notebook?.openExternal)
      window.notebook.openExternal(m4.href);
    close();
  };
  const editLink = () => {
    const url = prompt("Edit URL:", m4.href);
    if (url != null) {
      m4.anchorEl.href = url;
      const blockEl = m4.anchorEl.closest(".block-content");
      if (blockEl) {
        updateBlockHtml(m4.blockId, blockEl.innerHTML);
      }
    }
    close();
  };
  const removeLink = () => {
    const parent = m4.anchorEl.parentNode;
    while (m4.anchorEl.firstChild)
      parent.insertBefore(m4.anchorEl.firstChild, m4.anchorEl);
    parent.removeChild(m4.anchorEl);
    const blockEl = parent.closest(".block-content");
    if (blockEl) {
      updateBlockHtml(m4.blockId, blockEl.innerHTML);
    }
    close();
  };
  return /* @__PURE__ */ u4("div", {
    class: "link-menu",
    style: { left: m4.x + "px", top: m4.y + "px" },
    onMouseDown: (e4) => e4.stopPropagation(),
    children: [
      /* @__PURE__ */ u4("div", {
        class: "link-menu-url",
        title: m4.href,
        children: m4.href.length > 40 ? m4.href.slice(0, 37) + "..." : m4.href
      }, undefined, false, undefined, this),
      /* @__PURE__ */ u4("div", {
        class: "link-menu-actions",
        children: [
          /* @__PURE__ */ u4("button", {
            class: "link-menu-btn",
            onClick: openLink,
            children: "Open"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ u4("button", {
            class: "link-menu-btn",
            onClick: editLink,
            children: "Edit"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ u4("button", {
            class: "link-menu-btn link-menu-btn--danger",
            onClick: removeLink,
            children: "Remove"
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
if (typeof document !== "undefined") {
  document.addEventListener("mousedown", () => {
    linkMenu.value = null;
  });
}
var LINK_URL_RE = /https?:\/\/[^\s<>"{}|\\^`[\]]+(?<![.,;:!?])/g;
function linkifyText(text) {
  let hasUrl = false;
  const segments = [];
  let last = 0;
  LINK_URL_RE.lastIndex = 0;
  let m4;
  while ((m4 = LINK_URL_RE.exec(text)) !== null) {
    hasUrl = true;
    const before = text.slice(last, m4.index).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
    segments.push(before);
    const url = m4[0];
    const esc = url.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    segments.push(`<a href="${esc}">${esc}</a>`);
    last = m4.index + url.length;
  }
  if (!hasUrl)
    return null;
  const trailing = text.slice(last).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
  segments.push(trailing);
  return segments.join("");
}
var PASTE_ALLOWED = new Set([
  "p",
  "br",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "b",
  "strong",
  "i",
  "em",
  "u",
  "s",
  "del",
  "strike",
  "code",
  "pre",
  "blockquote",
  "a"
]);
function sanitizePastedHtml(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE)
      return document.createTextNode(node.textContent || "");
    if (node.nodeType !== Node.ELEMENT_NODE)
      return null;
    const el = node;
    const tag = el.tagName.toLowerCase();
    const children = document.createDocumentFragment();
    for (const child of [...el.childNodes]) {
      const r4 = walk(child);
      if (r4)
        children.appendChild(r4);
    }
    if (!PASTE_ALLOWED.has(tag))
      return children;
    const out = document.createElement(tag === "strong" ? "b" : tag === "em" ? "i" : tag === "strike" ? "s" : tag);
    if (tag === "a") {
      const href = el.getAttribute("href");
      if (href)
        out.setAttribute("href", href);
    }
    out.appendChild(children);
    return out;
  }
  const frag = document.createDocumentFragment();
  for (const child of [...doc.body.childNodes]) {
    const r4 = walk(child);
    if (r4)
      frag.appendChild(r4);
  }
  const div = document.createElement("div");
  div.appendChild(frag);
  return div.innerHTML;
}
function Block({ block, page }) {
  const ctx = x2(CanvasCtx);
  const contentRef = A2(null);
  const isImage = block.type === "image";
  const isLoading = block.type === "loading";
  const isChecklist = block.type === "checklist";
  const isSelected = ctx.selectedIds.has(block.id);
  const isNotebookBlob = (s5) => s5.startsWith("blob:") && !s5.includes("/");
  const rawSrc = block.src || "";
  const [resolvedSrc, setResolvedSrc] = d2(isNotebookBlob(rawSrc) ? null : rawSrc);
  const [naturalSize, setNaturalSize] = d2(null);
  const [cropping, setCropping] = d2(false);
  const [pendingCrop, setPendingCrop] = d2(null);
  const pendingCropRef = A2(null);
  const [borderOn, setBorderOn] = d2(!!block.border);
  y2(() => {
    setBorderOn(!!block.border);
  }, [block.border]);
  const itemRefs = A2({});
  const toggleBorder = () => {
    const next = !borderOn;
    setBorderOn(next);
    updateBlockBorder(block.id, next);
  };
  const getItemsWithDOMText = () => (block.items || []).map((i4) => ({ ...i4, text: itemRefs.current[i4.id]?.textContent ?? i4.text }));
  const toggleCheckItem = (itemId) => {
    const items = getItemsWithDOMText().map((i4) => i4.id === itemId ? { ...i4, checked: !i4.checked } : i4);
    updateChecklistItems(block.id, items);
  };
  const handleItemKeyDown = (e4, itemId) => {
    const mod = e4.ctrlKey || e4.metaKey;
    if (mod && e4.key === "z") {
      e4.preventDefault();
      e4.shiftKey ? ctx.redo() : ctx.undo();
      return;
    }
    const items = block.items || [];
    const idx = items.findIndex((i4) => i4.id === itemId);
    if (e4.key === "Enter") {
      e4.preventDefault();
      const newItem = { id: uid(), text: "", checked: false };
      const current = getItemsWithDOMText();
      const newItems = [...current.slice(0, idx + 1), newItem, ...current.slice(idx + 1)];
      updateChecklistItems(block.id, newItems);
      requestAnimationFrame(() => itemRefs.current[newItem.id]?.focus());
      return;
    }
    if (e4.key === "Backspace" && e4.target.textContent === "") {
      e4.preventDefault();
      if (items.length <= 1) {
        deleteBlock(block.id);
        return;
      }
      const prevItem = items[Math.max(0, idx - 1)];
      const newItems = getItemsWithDOMText().filter((i4) => i4.id !== itemId);
      updateChecklistItems(block.id, newItems);
      requestAnimationFrame(() => {
        const el = itemRefs.current[prevItem.id];
        if (el) {
          el.focus();
          const r4 = document.createRange();
          r4.selectNodeContents(el);
          r4.collapse(false);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(r4);
        }
      });
      return;
    }
  };
  const handleItemBlur = () => {
    updateChecklistItemsSilent(block.id, getItemsWithDOMText());
  };
  const captionRef = A2(null);
  const [captionEditing, setLegendEditing] = d2(false);
  const nw = naturalSize?.w ?? block.crop?.nw ?? null;
  const nh = naturalSize?.h ?? block.crop?.nh ?? null;
  y2(() => {
    if (!isImage)
      return;
    if (isNotebookBlob(rawSrc)) {
      const hash = rawSrc.slice(5);
      window.notebook.getBlob(hash).then((dataUrl) => {
        if (dataUrl)
          setResolvedSrc(dataUrl);
      });
    } else {
      setResolvedSrc(rawSrc);
    }
  }, [rawSrc, isImage]);
  _2(() => {
    const el = contentRef.current;
    if (el && el.innerHTML !== block.html) {
      el.innerHTML = block.html;
      prevTextRef.current = el.innerText || "";
    }
  }, [block.html]);
  const undoTimer = A2(null);
  const htmlAtFocus = A2(null);
  const prevTextRef = A2(null);
  const handleInput = () => {
    const el = contentRef.current;
    if (!el)
      return;
    const result = handleMarkdownInput(el);
    if (result === "code")
      updateBlockType(block.id, "code");
    const newText = el.innerText || "";
    const oldText = prevTextRef.current ?? "";
    const diffs = computeTextDiff(oldText, newText);
    prevTextRef.current = newText;
    updateBlockHtmlLocal(block.id, el.innerHTML);
    updateBlockTextDiff(block.id, diffs);
    if (undoTimer.current !== null)
      clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => {
      if (htmlAtFocus.current != null && htmlAtFocus.current !== el.innerHTML) {
        pushUndo(page.id, { type: "html", id: block.id, html: htmlAtFocus.current });
        htmlAtFocus.current = el.innerHTML;
      }
    }, 1500);
  };
  const handleKeyDown = (e4) => {
    const mod = e4.ctrlKey || e4.metaKey;
    if (mod && e4.key === "z") {
      e4.preventDefault();
      e4.shiftKey ? ctx.redo() : ctx.undo();
      return;
    }
    onBlockKeyDown(e4, contentRef.current);
  };
  const handleFocus = () => {
    htmlAtFocus.current = block.html;
    prevTextRef.current = contentRef.current?.innerText || "";
    ctx.onBlockFocus?.(block.id);
  };
  const handleContentClick = (e4) => {
    const anchor = e4.target.closest("a[href]");
    if (!anchor)
      return;
    e4.preventDefault();
    if (window.notebook?.openExternal)
      window.notebook.openExternal(anchor.href);
  };
  const handleContentContextMenu = (e4) => {
    const anchor = e4.target.closest("a[href]");
    if (anchor) {
      e4.preventDefault();
      e4.stopPropagation();
      linkMenu.value = { x: e4.clientX, y: e4.clientY, href: anchor.href, anchorEl: anchor, blockId: block.id };
      return;
    }
    e4.preventDefault();
    e4.stopPropagation();
    const selText = window.getSelection()?.toString() || "";
    const items = [];
    if (selText) {
      items.push({ label: "Copy", action: () => document.execCommand("copy") });
      const sel = window.getSelection();
      const range = sel?.rangeCount ? sel.getRangeAt(0) : null;
      const div = document.createElement("div");
      if (range)
        div.appendChild(range.cloneContents());
      const md = htmlToMarkdown(div.innerHTML);
      items.push({ label: "Copy as Markdown", action: () => navigator.clipboard.writeText(md) });
    } else {
      items.push({ label: "Copy", disabled: true, action: () => {} });
      items.push({ label: "Copy as Markdown", disabled: true, action: () => {} });
    }
    items.push({ label: "Paste", action: () => {
      const el = contentRef.current;
      const sel = window.getSelection();
      const savedRange = sel?.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
      navigator.clipboard.readText().then((text) => {
        if (!text || !el)
          return;
        el.focus();
        if (savedRange) {
          const s5 = window.getSelection();
          s5.removeAllRanges();
          s5.addRange(savedRange);
        }
        document.execCommand("insertText", false, text);
      });
    } });
    if (selText) {
      items.push({ type: "separator" });
      const q3 = encodeURIComponent(selText);
      items.push({ label: "Search with Google", action: () => {
        window.notebook?.openExternal("https://www.google.com/search?q=" + q3);
      } });
      items.push({ label: "Ask ChatGPT", action: () => {
        window.notebook?.openExternal("https://chatgpt.com/?q=" + q3);
      } });
    }
    openContextMenu(e4.clientX, e4.clientY, items);
  };
  const handleImageContextMenu = (e4) => {
    e4.preventDefault();
    e4.stopPropagation();
    const items = [
      { label: "Copy Image", action: () => {
        const img = e4.target.closest(".img-frame")?.querySelector("img");
        if (!img)
          return;
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          canvas.getContext("2d").drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob)
              navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]).catch(() => {});
          });
        } catch {}
      } }
    ];
    openContextMenu(e4.clientX, e4.clientY, items);
  };
  const handleCopy = (e4) => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed)
      return;
    const range = sel.getRangeAt(0);
    const div = document.createElement("div");
    div.appendChild(range.cloneContents());
    const selectedHtml = div.innerHTML;
    const markdown = htmlToMarkdown(selectedHtml);
    if (!markdown)
      return;
    e4.preventDefault();
    e4.clipboardData.setData("text/plain", sel.toString());
    e4.clipboardData.setData("text/html", selectedHtml);
    e4.clipboardData.setData("text/markdown", markdown);
  };
  const handlePaste = (e4) => {
    if ([...e4.clipboardData?.items || []].some((i4) => i4.type.startsWith("image/")))
      return;
    e4.preventDefault();
    const text = e4.clipboardData?.getData("text/plain") || "";
    const trimmed = text.trim();
    const isPureUrl = /^https?:\/\/\S+$/.test(trimmed);
    if (isPureUrl) {
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed) {
        document.execCommand("createLink", false, trimmed);
      } else {
        const esc = trimmed.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        document.execCommand("insertHTML", false, `<a href="${esc}">${esc}</a>`);
      }
      return;
    }
    const html = e4.clipboardData?.getData("text/html");
    if (html) {
      document.execCommand("insertHTML", false, sanitizePastedHtml(html));
      return;
    }
    if (!text)
      return;
    const linked = linkifyText(text);
    if (linked) {
      document.execCommand("insertHTML", false, linked);
    } else {
      document.execCommand("insertText", false, text);
    }
  };
  const handleBlur = () => {
    if (undoTimer.current !== null)
      clearTimeout(undoTimer.current);
    const el = contentRef.current;
    if (!el)
      return;
    const html = el.innerHTML;
    const isEmpty = !html || html === "<br>" || html.trim() === "";
    if (htmlAtFocus.current != null && htmlAtFocus.current !== html) {
      pushUndo(page.id, { type: "html", id: block.id, html: htmlAtFocus.current });
    }
    htmlAtFocus.current = null;
    if (isEmpty) {
      deleteBlock(block.id);
    } else {
      updateBlockHtml(block.id, html);
    }
    ctx.onBlockBlur?.(block.id);
  };
  const handleImgLoad = (e4) => {
    const img = e4.target;
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
  };
  const handleImgDoubleClick = (e4) => {
    if (!nw || !nh)
      return;
    e4.stopPropagation();
    const initCrop = block.crop ? { x: block.crop.x, y: block.crop.y, w: block.crop.w, h: block.crop.h } : { x: 0, y: 0, w: nw, h: nh };
    pendingCropRef.current = initCrop;
    setPendingCrop(initCrop);
    setCropping(true);
  };
  y2(() => {
    if (!cropping)
      return;
    const onKey = (e4) => {
      if (e4.key === "Escape") {
        setCropping(false);
        setPendingCrop(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [cropping]);
  _2(() => {
    const el = captionRef.current;
    if (el && el.innerText !== (block.caption || "")) {
      el.innerText = block.caption || "";
    }
  }, [block.caption]);
  y2(() => {
    if (!captionEditing || !captionRef.current)
      return;
    const el = captionRef.current;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }, [captionEditing]);
  y2(() => {
    if (!isSelected)
      setLegendEditing(false);
  }, [isSelected]);
  y2(() => {
    if (!isSelected || !isImage)
      return;
    const onKey = (e4) => {
      if (e4.key === "Enter" && !captionEditing && !cropping && !document.activeElement?.isContentEditable) {
        e4.preventDefault();
        setLegendEditing(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isSelected, isImage, captionEditing, cropping]);
  const handleLegendKeyDown = (e4) => {
    if (e4.key === "Enter") {
      e4.preventDefault();
      captionRef.current?.blur();
    }
    if (e4.key === "Escape") {
      if (captionRef.current)
        captionRef.current.innerText = block.caption || "";
      captionRef.current?.blur();
    }
  };
  const handleLegendBlur = () => {
    const text = captionRef.current?.innerText?.trim() || "";
    setLegendEditing(false);
    updateBlockCaption(block.id, text || undefined);
  };
  _2(() => {
    if (!isChecklist)
      return;
    for (const item of block.items || []) {
      const el = itemRefs.current[item.id];
      if (el && el.textContent !== item.text)
        el.textContent = item.text;
    }
  }, [block.items]);
  const startCropDrag = (e4, dir) => {
    e4.preventDefault();
    e4.stopPropagation();
    const zoom = ctx.getZoom();
    const imgScale = block.w / nw;
    const { clientX: startX, clientY: startY } = e4;
    const origCrop = { ...pendingCropRef.current };
    function onMove(e22) {
      const dx = (e22.clientX - startX) / zoom / imgScale;
      const dy = (e22.clientY - startY) / zoom / imgScale;
      let { x: x3, y: y4, w: w4, h: h5 } = origCrop;
      if (dir.includes("e"))
        w4 = Math.max(20, Math.min(nw - x3, w4 + dx));
      if (dir.includes("w")) {
        const d5 = Math.max(-x3, Math.min(w4 - 20, dx));
        x3 += d5;
        w4 -= d5;
      }
      if (dir.includes("s"))
        h5 = Math.max(20, Math.min(nh - y4, h5 + dy));
      if (dir.includes("n")) {
        const d5 = Math.max(-y4, Math.min(h5 - 20, dy));
        y4 += d5;
        h5 -= d5;
      }
      const nc = { x: x3, y: y4, w: w4, h: h5 };
      pendingCropRef.current = nc;
      setPendingCrop(nc);
    }
    function onUp() {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      const fc = pendingCropRef.current;
      const isFullImage = fc.x <= 2 && fc.y <= 2 && fc.w >= nw - 2 && fc.h >= nh - 2;
      const cropToSave = isFullImage ? undefined : { ...fc, nw, nh };
      const pg = getActivePage();
      if (pg)
        pushUndo(pg.id, { type: "crop", id: block.id, crop: block.crop ?? null });
      updateBlockCrop(block.id, cropToSave);
      setCropping(false);
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  };
  const handleBlockPointerDown = (e4) => {
    e4.stopPropagation();
    if (cropping)
      return;
    const onContent = e4.target.closest(".block-content, .block-handle, .block-resize, .img-resize, .block-drag-overlay, .img-border-btn, .block-checklist");
    if (!onContent) {
      ctx.onBlockDragStart(e4, block.id);
    }
  };
  return /* @__PURE__ */ u4("div", {
    class: ["block", isImage && "block--image", isLoading && "block--loading", isSelected && "block--selected"].filter(Boolean).join(" "),
    "data-block-id": block.id,
    style: { left: block.x + "px", top: block.y + "px", width: block.w + "px", zIndex: block.z ?? 0 },
    onPointerDown: handleBlockPointerDown,
    children: [
      !isImage && /* @__PURE__ */ u4("div", {
        class: "block-handle",
        onPointerDown: (e4) => {
          e4.stopPropagation();
          ctx.onBlockDragStart(e4, block.id);
        }
      }, undefined, false, undefined, this),
      !isImage && /* @__PURE__ */ u4("div", {
        class: "block-resize",
        onPointerDown: (e4) => {
          e4.stopPropagation();
          ctx.onBlockResizeStart(e4, block.id);
        }
      }, undefined, false, undefined, this),
      isLoading ? /* @__PURE__ */ u4("div", {
        class: "block-loading",
        children: /* @__PURE__ */ u4("div", {
          class: "block-loading-spinner"
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this) : isImage ? /* @__PURE__ */ u4(k, {
        children: [
          /* @__PURE__ */ u4("div", {
            class: "img-media-area",
            children: [
              isSelected && !cropping && /* @__PURE__ */ u4("button", {
                class: `img-border-btn${borderOn ? " img-border-btn--active" : ""}`,
                title: "Toggle border",
                onPointerDown: (e4) => e4.stopPropagation(),
                onClick: (e4) => {
                  e4.stopPropagation();
                  toggleBorder();
                },
                children: /* @__PURE__ */ u4("svg", {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 16 16",
                  fill: "none",
                  children: /* @__PURE__ */ u4("rect", {
                    x: "1.5",
                    y: "1.5",
                    width: "13",
                    height: "13",
                    rx: "1",
                    stroke: borderOn ? "#8a4f00" : "#888",
                    "stroke-width": block.border ? "2" : "1.5",
                    fill: "none"
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this),
              /* @__PURE__ */ u4("div", {
                class: "img-frame",
                style: !cropping && block.crop && nw ? {
                  position: "relative",
                  overflow: "hidden",
                  height: `${block.crop.h * block.w / block.crop.w}px`,
                  outline: borderOn ? "1px solid #000" : undefined
                } : { position: "relative", overflow: cropping ? "hidden" : undefined, outline: borderOn ? "1px solid #000" : undefined },
                children: [
                  /* @__PURE__ */ u4("img", {
                    src: resolvedSrc || "",
                    draggable: false,
                    onLoad: handleImgLoad,
                    style: !cropping && block.crop && nw ? {
                      position: "absolute",
                      width: `${nw * block.w / block.crop.w}px`,
                      maxWidth: "none",
                      left: `${-block.crop.x * block.w / block.crop.w}px`,
                      top: `${-block.crop.y * block.w / block.crop.w}px`
                    } : { width: "100%", display: "block" }
                  }, undefined, false, undefined, this),
                  cropping && pendingCrop && nw && nh && /* @__PURE__ */ u4("div", {
                    class: "crop-overlay",
                    children: /* @__PURE__ */ u4("div", {
                      class: "crop-box",
                      style: {
                        left: `${pendingCrop.x * (block.w / nw)}px`,
                        top: `${pendingCrop.y * (block.w / nw)}px`,
                        width: `${pendingCrop.w * (block.w / nw)}px`,
                        height: `${pendingCrop.h * (block.w / nw)}px`
                      },
                      children: ["n", "s", "e", "w", "ne", "nw", "se", "sw"].map((dir) => /* @__PURE__ */ u4("div", {
                        class: `crop-handle crop-handle--${dir}`,
                        onPointerDown: (e4) => startCropDrag(e4, dir)
                      }, dir, false, undefined, this))
                    }, undefined, false, undefined, this)
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              !cropping && ["nw", "ne", "sw", "se"].map((dir) => /* @__PURE__ */ u4("div", {
                class: `img-resize img-resize--${dir}`,
                onPointerDown: (e4) => {
                  e4.stopPropagation();
                  ctx.onImgResizeStart(e4, block.id, dir);
                }
              }, dir, false, undefined, this)),
              !cropping && /* @__PURE__ */ u4("div", {
                class: "block-drag-overlay",
                onPointerDown: (e4) => {
                  e4.stopPropagation();
                  ctx.onBlockDragStart(e4, block.id);
                },
                onDblClick: handleImgDoubleClick,
                onContextMenu: handleImageContextMenu
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          block.caption || captionEditing ? /* @__PURE__ */ u4("div", {
            ref: captionRef,
            class: "img-caption",
            contentEditable: "true",
            "data-placeholder": "Add a caption…",
            onKeyDown: handleLegendKeyDown,
            onBlur: handleLegendBlur,
            onPointerDown: (e4) => e4.stopPropagation()
          }, undefined, false, undefined, this) : isSelected && !cropping && /* @__PURE__ */ u4("div", {
            class: "img-caption-hint",
            children: "Press [Enter] to add caption"
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this) : isChecklist ? /* @__PURE__ */ u4("div", {
        class: "block-checklist",
        children: (block.items || []).map((item) => /* @__PURE__ */ u4("div", {
          class: `cb-row${item.checked ? " cb-row--checked" : ""}`,
          children: [
            /* @__PURE__ */ u4("button", {
              class: `cb-check${item.checked ? " cb-check--checked" : ""}`,
              onPointerDown: (e4) => e4.stopPropagation(),
              onClick: (e4) => {
                e4.stopPropagation();
                toggleCheckItem(item.id);
              }
            }, undefined, false, undefined, this),
            /* @__PURE__ */ u4("span", {
              ref: (el) => {
                if (el)
                  itemRefs.current[item.id] = el;
                else
                  delete itemRefs.current[item.id];
              },
              class: "cb-text",
              contentEditable: "true",
              "data-placeholder": "List item",
              "data-item-id": item.id,
              onKeyDown: (e4) => handleItemKeyDown(e4, item.id),
              onBlur: handleItemBlur,
              onPointerDown: (e4) => e4.stopPropagation()
            }, undefined, false, undefined, this)
          ]
        }, item.id, true, undefined, this))
      }, undefined, false, undefined, this) : /* @__PURE__ */ u4("div", {
        ref: contentRef,
        class: ["block-content", block.type === "code" && "code-block"].filter(Boolean).join(" "),
        contentEditable: "true",
        "data-placeholder": "Start typing…",
        "data-code": block.type === "code" ? "1" : undefined,
        onKeyDown: handleKeyDown,
        onInput: handleInput,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onClick: handleContentClick,
        onCopy: handleCopy,
        onPaste: handlePaste,
        onContextMenu: handleContentContextMenu,
        onPointerDown: (e4) => e4.stopPropagation()
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// ../core/src/Canvas.tsx
var CanvasCtx = R(null);
async function buildShareUrl() {
  const { ui, notebooks } = appState.value;
  const nb = notebooks.find((n3) => n3.id === ui.notebookId);
  const sec = nb?.sections.find((s5) => s5.id === ui.sectionId);
  const page = sec ? findInTree(sec.pages, ui.pageId) : null;
  if (!sec || !page)
    return null;
  const hash = `#!/${encodeURIComponent(sec.title)}/${encodeURIComponent(page.title)}/`;
  const qs = `?p=${page.id.slice(0, 6)}`;
  const base = window.__ghPagesUrl || (window.notebook?.getPublishUrl ? await window.notebook.getPublishUrl() : null) || (window.location ? window.location.origin + window.location.pathname : "");
  return base + hash + qs;
}
function ShareButton() {
  const handleShare = async (e4) => {
    e4.preventDefault();
    const url = await buildShareUrl();
    if (!url)
      return;
    navigator.clipboard.writeText(url).then(() => {
      const btn = e4.currentTarget;
      const orig = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => {
        btn.textContent = orig;
      }, 1500);
    });
  };
  return /* @__PURE__ */ u4("button", {
    class: "fmt-btn",
    title: "Copy link to this page",
    onMouseDown: handleShare,
    children: "\uD83D\uDD17 Share"
  }, undefined, false, undefined, this);
}
function FormatToolbar() {
  const btns = [
    { cmd: "bold", node: /* @__PURE__ */ u4("b", {
      children: "B"
    }, undefined, false, undefined, this), title: "Bold" },
    { cmd: "italic", node: /* @__PURE__ */ u4("i", {
      children: "I"
    }, undefined, false, undefined, this), title: "Italic" },
    { cmd: "underline", node: /* @__PURE__ */ u4("u", {
      children: "U"
    }, undefined, false, undefined, this), title: "Underline" },
    { cmd: "strikethrough", node: /* @__PURE__ */ u4("s", {
      children: "S"
    }, undefined, false, undefined, this), title: "Strikethrough" },
    null,
    { cmd: "h1", node: "H1", title: "Heading 1" },
    { cmd: "h2", node: "H2", title: "Heading 2" },
    { cmd: "h3", node: "H3", title: "Heading 3" },
    { cmd: "h4", node: "H4", title: "Heading 4" },
    { cmd: "p", node: "P", title: "Paragraph" },
    null,
    { cmd: "ul", node: "• List", title: "Bullet list" },
    { cmd: "ol", node: "1. List", title: "Numbered list" },
    { cmd: "link", node: "⌘K", title: "Insert link" }
  ];
  return /* @__PURE__ */ u4(k, {
    children: [
      /* @__PURE__ */ u4("div", {
        id: "titlebar",
        children: [
          /* @__PURE__ */ u4("span", {
            class: "toolbar-title",
            children: "Notebound"
          }, undefined, false, undefined, this),
          !/Mac/.test(navigator.platform) && /* @__PURE__ */ u4("div", {
            class: "window-controls",
            children: [
              /* @__PURE__ */ u4("button", {
                class: "wc-btn wc-minimize",
                onClick: () => window.windowControls.minimize(),
                title: "Minimize",
                children: /* @__PURE__ */ u4("svg", {
                  width: "10",
                  height: "1",
                  viewBox: "0 0 10 1",
                  children: /* @__PURE__ */ u4("rect", {
                    width: "10",
                    height: "1",
                    fill: "currentColor"
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this),
              /* @__PURE__ */ u4("button", {
                class: "wc-btn wc-maximize",
                onClick: () => window.windowControls.maximize(),
                title: "Maximize",
                children: /* @__PURE__ */ u4("svg", {
                  width: "10",
                  height: "10",
                  viewBox: "0 0 10 10",
                  children: /* @__PURE__ */ u4("rect", {
                    x: "0.5",
                    y: "0.5",
                    width: "9",
                    height: "9",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "1"
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this),
              /* @__PURE__ */ u4("button", {
                class: "wc-btn wc-close",
                onClick: () => window.windowControls.close(),
                title: "Close",
                children: /* @__PURE__ */ u4("svg", {
                  width: "10",
                  height: "10",
                  viewBox: "0 0 10 10",
                  children: [
                    /* @__PURE__ */ u4("line", {
                      x1: "0",
                      y1: "0",
                      x2: "10",
                      y2: "10",
                      stroke: "currentColor",
                      "stroke-width": "1.2"
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ u4("line", {
                      x1: "10",
                      y1: "0",
                      x2: "0",
                      y2: "10",
                      stroke: "currentColor",
                      "stroke-width": "1.2"
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ u4("div", {
        id: "format-toolbar",
        children: [
          btns.map((b2, i4) => b2 === null ? /* @__PURE__ */ u4("span", {
            class: "fmt-sep"
          }, i4, false, undefined, this) : /* @__PURE__ */ u4("button", {
            class: "fmt-btn",
            title: b2.title,
            onMouseDown: (e4) => {
              e4.preventDefault();
              execFmt(b2.cmd);
            },
            children: b2.node
          }, b2.cmd, false, undefined, this)),
          /* @__PURE__ */ u4("span", {
            class: "fmt-sep"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ u4("button", {
            class: "fmt-btn",
            title: "Add checklist",
            onMouseDown: (e4) => {
              e4.preventDefault();
              const pg = getActivePage();
              let y4 = 60;
              if (pg?.blocks?.length) {
                y4 = Math.max(...pg.blocks.map((b2) => b2.y + 100)) + 40;
              }
              const itemId = uid();
              addBlock(0, y4, DEFAULT_BLOCK_WIDTH, "checklist", { items: [{ id: itemId, text: "", checked: false }] });
              requestAnimationFrame(() => {
                const el = document.querySelector(`[data-item-id="${itemId}"]`);
                el?.focus();
              });
            },
            children: "☑ List"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ u4("span", {
            class: "fmt-sep"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ u4("button", {
            class: "fmt-btn fmt-btn--wand",
            title: "Drag onto canvas to chat with Claude",
            draggable: true,
            onDragStart: (e4) => {
              e4.dataTransfer.setData("application/x-notebound-claude", "1");
            },
            children: "✨"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ u4("span", {
            class: "canvas-hint",
            children: "Click to add block · Space+drag to pan · Ctrl+scroll zoom"
          }, undefined, false, undefined, this),
          window.notebook?.webPublish && /* @__PURE__ */ u4(k, {
            children: [
              /* @__PURE__ */ u4("span", {
                class: "fmt-sep"
              }, undefined, false, undefined, this),
              /* @__PURE__ */ u4("button", {
                class: "fmt-btn fmt-btn--publish",
                title: "Publish to web",
                onMouseDown: async (e4) => {
                  e4.preventDefault();
                  const btn = e4.currentTarget;
                  btn.classList.add("publishing");
                  try {
                    await window.notebook.webPublish();
                  } catch (err) {
                    console.error("Publish failed:", err);
                  }
                  btn.classList.remove("publishing");
                },
                children: "\uD83C\uDF10 Publish"
              }, undefined, false, undefined, this),
              /* @__PURE__ */ u4("button", {
                class: "fmt-btn",
                title: "Open published site",
                onMouseDown: async (e4) => {
                  e4.preventDefault();
                  const url = await buildShareUrl();
                  if (url)
                    window.notebook.openExternal(url);
                },
                children: "↗ Open"
              }, undefined, false, undefined, this),
              /* @__PURE__ */ u4("button", {
                class: "fmt-btn",
                title: "Open export folder on disk",
                onMouseDown: (e4) => {
                  e4.preventDefault();
                  window.notebook.webOpenDir();
                },
                children: "\uD83D\uDCC2 Folder"
              }, undefined, false, undefined, this),
              /* @__PURE__ */ u4(ShareButton, {}, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
function getCaretOffset(el) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount || !el.contains(sel.anchorNode))
    return 0;
  const range = document.createRange();
  range.selectNodeContents(el);
  range.setEnd(sel.anchorNode, sel.anchorOffset);
  return range.toString().length;
}
function setCaretOffset(el, offset) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let pos = 0;
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const len = node.textContent.length;
    if (pos + len >= offset) {
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(node, Math.min(offset - pos, len));
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      return;
    }
    pos += len;
  }
}
function hasNonEmptyBlocks(page) {
  return page.blocks.some((b2) => b2.type === "image" || b2.html && b2.html !== "<br>" && b2.html.trim() !== "");
}
function PageTitle({ page, onEnter }) {
  const ref = A2(null);
  const titleEditing = A2(false);
  _2(() => {
    if (ref.current && !titleEditing.current)
      ref.current.textContent = page?.title ?? "";
  }, [page?.id, page?.title]);
  y2(() => {
    if (!page)
      return;
    if (hasNonEmptyBlocks(page)) {
      const saved = lastCaretPerPage.get(page.id);
      if (saved) {
        requestAnimationFrame(() => {
          const el2 = document.querySelector(`[data-block-id="${saved.blockId}"] .block-content`);
          if (el2) {
            el2.focus();
            setCaretOffset(el2, saved.offset);
          }
        });
        return;
      }
    }
    const el = ref.current;
    if (el) {
      el.focus();
      const sel = window.getSelection();
      sel.selectAllChildren(el);
      sel.collapseToEnd();
    }
  }, [page?.id]);
  if (!page)
    return /* @__PURE__ */ u4("div", {
      id: "page-title-bar"
    }, undefined, false, undefined, this);
  const editing = editingEnabled.value;
  const dateStr = page.createdAt ? new Date(page.createdAt).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : null;
  return /* @__PURE__ */ u4("div", {
    id: "page-title-bar",
    onClick: () => editing && ref.current?.focus(),
    children: [
      /* @__PURE__ */ u4("div", {
        ref,
        id: "page-title",
        contentEditable: true,
        onFocus: () => {
          titleEditing.current = true;
        },
        onBlur: (e4) => {
          titleEditing.current = false;
          const title = e4.target.textContent.trim() || "Untitled Page";
          updatePageTitleAndRefresh(page.id, title);
        },
        onKeyDown: (e4) => {
          if (e4.key === "Enter") {
            e4.preventDefault();
            onEnter?.();
          }
        },
        onInput: (e4) => {
          updatePageTitle(page.id, e4.target.textContent);
        },
        onContextMenu: (e4) => {
          e4.preventDefault();
          e4.stopPropagation();
          const selText = window.getSelection()?.toString() || "";
          const items = [];
          if (selText) {
            items.push({ label: "Copy", action: () => document.execCommand("copy") });
          } else {
            items.push({ label: "Copy", disabled: true, action: () => {} });
          }
          items.push({ label: "Paste", action: () => {
            const el = ref.current;
            const s5 = window.getSelection();
            const savedRange = s5?.rangeCount ? s5.getRangeAt(0).cloneRange() : null;
            navigator.clipboard.readText().then((text) => {
              if (!text || !el)
                return;
              el.focus();
              if (savedRange) {
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(savedRange);
              }
              document.execCommand("insertText", false, text);
            });
          } });
          if (selText) {
            items.push({ type: "separator" });
            const q3 = encodeURIComponent(selText);
            items.push({ label: "Search with Google", action: () => {
              window.notebook?.openExternal("https://www.google.com/search?q=" + q3);
            } });
            items.push({ label: "Ask ChatGPT", action: () => {
              window.notebook?.openExternal("https://chatgpt.com/?q=" + q3);
            } });
          }
          openContextMenu(e4.clientX, e4.clientY, items);
        }
      }, undefined, false, undefined, this),
      dateStr && /* @__PURE__ */ u4("div", {
        class: "page-date",
        children: dateStr
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
function Canvas({ page }) {
  const containerRef = A2(null);
  const sizerRef = A2(null);
  const innerRef = A2(null);
  const marqueeRef = A2(null);
  const viewRef = A2({ zoom: 1 });
  const pageRef = A2(page);
  const spaceHeld = A2(false);
  const scrollSaveTimer = A2(null);
  const [transition, setTransition] = d2(null);
  const prevPageIdRef = A2(page?.id);
  const transitionTimers = A2({});
  y2(() => {
    const newId = page?.id;
    const oldId = prevPageIdRef.current;
    if (!newId || !oldId || newId === oldId) {
      prevPageIdRef.current = newId;
      return;
    }
    prevPageIdRef.current = newId;
    clearTimeout(transitionTimers.current.t1);
    clearTimeout(transitionTimers.current.t2);
    setTransition({ outId: oldId, inId: newId, phase: "out" });
    transitionTimers.current.t1 = setTimeout(() => {
      setTransition({ outId: oldId, inId: newId, phase: "in" });
      transitionTimers.current.t2 = setTimeout(() => setTransition(null), 125);
    }, 125);
  }, [page?.id]);
  const pageCacheRef = A2(new Map);
  if (page)
    pageCacheRef.current.set(page.id, page);
  const cachedPages = [...new Map([...preloadCache.value, ...pageCacheRef.current]).values()];
  const [selectedIds, setSelectedIds] = d2(new Set);
  const selectedRef = A2(selectedIds);
  y2(() => {
    pageRef.current = page;
  });
  function setSelected(ids) {
    selectedRef.current = ids;
    setSelectedIds(new Set(ids));
  }
  function updateSizer(targetScrollLeft, targetScrollTop) {
    if (!sizerRef.current || !containerRef.current)
      return;
    const pg = pageRef.current;
    const { zoom } = viewRef.current;
    let maxX = 0, maxY = 0;
    if (pg?.blocks?.length) {
      for (const b2 of pg.blocks) {
        maxX = Math.max(maxX, b2.x + (b2.w || DEFAULT_BLOCK_WIDTH));
        maxY = Math.max(maxY, b2.y + 300);
      }
    }
    const rect = containerRef.current.getBoundingClientRect();
    const sl = targetScrollLeft ?? containerRef.current.scrollLeft;
    const st = targetScrollTop ?? containerRef.current.scrollTop;
    const totalW = Math.max(maxX + 200, (sl + rect.width) / zoom + 200);
    const totalH = Math.max(maxY + 200, (st + rect.height) / zoom + 200);
    sizerRef.current.style.width = totalW * zoom + "px";
    sizerRef.current.style.height = totalH * zoom + "px";
  }
  const ZOOM_LEVELS = [0.5, 0.6, 0.75, 0.8, 1, 1.25, 1.5, 2];
  function applyZoom(nz) {
    const el = containerRef.current;
    if (!el || !innerRef.current)
      return;
    const { zoom } = viewRef.current;
    const mx = el.clientWidth / 2;
    const my = el.clientHeight / 2;
    const cx = (mx + el.scrollLeft) / zoom;
    const cy = (my + el.scrollTop) / zoom;
    const newScrollLeft = Math.max(0, cx * nz - mx);
    const newScrollTop = Math.max(0, cy * nz - my);
    viewRef.current = { zoom: nz };
    innerRef.current.style.transform = `scale(${nz})`;
    updateSizer(newScrollLeft, newScrollTop);
    el.scrollLeft = newScrollLeft;
    el.scrollTop = newScrollTop;
    updatePageView(newScrollLeft / nz, newScrollTop / nz, nz);
  }
  y2(() => {
    function onZoom(dir) {
      const cur = viewRef.current.zoom;
      let nz;
      if (dir === "reset") {
        nz = 1;
      } else if (dir === "in") {
        nz = ZOOM_LEVELS.find((l5) => l5 > cur + 0.01) ?? ZOOM_LEVELS[ZOOM_LEVELS.length - 1];
      } else {
        nz = [...ZOOM_LEVELS].reverse().find((l5) => l5 < cur - 0.01) ?? ZOOM_LEVELS[0];
      }
      applyZoom(nz);
    }
    window.notebook?.onCanvasZoom(onZoom);
    return () => window.notebook?.offCanvasZoom();
  }, []);
  _2(() => {
    if (!page || !containerRef.current || !innerRef.current)
      return;
    const zoom = page.zoom ?? 1;
    viewRef.current = { zoom };
    innerRef.current.style.transform = `scale(${zoom})`;
    const targetLeft = (page.panX ?? 0) * zoom;
    const targetTop = (page.panY ?? 0) * zoom;
    updateSizer(targetLeft, targetTop);
    containerRef.current.scrollLeft = targetLeft;
    containerRef.current.scrollTop = targetTop;
    setSelected(new Set);
  }, [page?.id]);
  y2(() => {
    updateSizer();
  }, [page?.blocks]);
  function toCanvas(clientX, clientY) {
    const rect = containerRef.current.getBoundingClientRect();
    const { zoom } = viewRef.current;
    return {
      x: (clientX - rect.left + containerRef.current.scrollLeft) / zoom,
      y: (clientY - rect.top + containerRef.current.scrollTop) / zoom
    };
  }
  function toScreen(clientX, clientY) {
    const rect = containerRef.current.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }
  const onBlockDragStart = q2((e4, blockId) => {
    e4.preventDefault();
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
    const pg = getActivePage();
    if (!pg)
      return;
    if (!selectedRef.current.has(blockId)) {
      if (!e4.shiftKey)
        setSelected(new Set([blockId]));
      else
        setSelected(new Set([...selectedRef.current, blockId]));
    }
    const ids = selectedRef.current.has(blockId) ? [...selectedRef.current] : [blockId];
    const origPos = new Map;
    for (const id of ids) {
      const el = innerRef.current?.querySelector(`[data-block-id="${id}"]`);
      if (el)
        origPos.set(id, { x: parseInt(el.style.left), y: parseInt(el.style.top) });
    }
    const { clientX: startX, clientY: startY } = e4;
    const { zoom } = viewRef.current;
    function onMove(e22) {
      const dx = (e22.clientX - startX) / zoom;
      const dy = (e22.clientY - startY) / zoom;
      for (const [id, orig] of origPos) {
        const el = innerRef.current?.querySelector(`[data-block-id="${id}"]`);
        if (!el)
          continue;
        el.style.left = Math.max(0, orig.x + dx) + "px";
        el.style.top = Math.max(0, orig.y + dy) + "px";
      }
    }
    function onUp() {
      let hasMoved = false;
      const moves = [];
      for (const [id, orig] of origPos) {
        const el = innerRef.current?.querySelector(`[data-block-id="${id}"]`);
        if (!el)
          continue;
        const nx = parseInt(el.style.left), ny = parseInt(el.style.top);
        if (nx !== orig.x || ny !== orig.y) {
          hasMoved = true;
          moves.push({ id, x: orig.x, y: orig.y });
          updateBlockPos(id, nx, ny);
        }
      }
      if (hasMoved && pg)
        pushUndo(pg.id, { type: "move", moves });
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }, []);
  const onBlockResizeStart = q2((e4, blockId) => {
    e4.preventDefault();
    const el = innerRef.current?.querySelector(`[data-block-id="${blockId}"]`);
    if (!el)
      return;
    const origW = parseInt(el.style.width) || DEFAULT_BLOCK_WIDTH;
    const startX = e4.clientX;
    const pg = getActivePage();
    function onMove(e22) {
      const dx = (e22.clientX - startX) / viewRef.current.zoom;
      el.style.width = Math.max(120, origW + dx) + "px";
    }
    function onUp() {
      if (pg)
        pushUndo(pg.id, { type: "resize", id: blockId, w: origW });
      updateBlockWidth(blockId, parseInt(el.style.width));
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }, []);
  const onImgResizeStart = q2((e4, blockId, dir) => {
    e4.preventDefault();
    const el = innerRef.current?.querySelector(`[data-block-id="${blockId}"]`);
    if (!el)
      return;
    const origW = el.offsetWidth;
    const origX = parseInt(el.style.left);
    const origY = parseInt(el.style.top);
    const startX = e4.clientX;
    const pg = getActivePage();
    function onMove(e22) {
      const dx = (e22.clientX - startX) / viewRef.current.zoom;
      const newW = Math.max(40, origW + (dir.includes("e") ? dx : -dx));
      el.style.width = newW + "px";
      if (dir.includes("w"))
        el.style.left = origX - (newW - origW) + "px";
    }
    function onUp() {
      if (pg)
        pushUndo(pg.id, { type: "resize", id: blockId, w: origW, x: origX, y: origY });
      updateBlockWidth(blockId, parseInt(el.style.width));
      updateBlockPos(blockId, parseInt(el.style.left), parseInt(el.style.top));
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }, []);
  function startPan(startClientX, startClientY) {
    const origLeft = containerRef.current.scrollLeft;
    const origTop = containerRef.current.scrollTop;
    function onMove(e4) {
      const dx = e4.clientX - startClientX;
      const dy = e4.clientY - startClientY;
      containerRef.current.scrollLeft = Math.max(0, origLeft - dx);
      containerRef.current.scrollTop = Math.max(0, origTop - dy);
    }
    function onUp() {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }
  function startMarquee(startClientX, startClientY) {
    const startScreen = toScreen(startClientX, startClientY);
    const startCanvas = toCanvas(startClientX, startClientY);
    const mq = marqueeRef.current;
    if (mq) {
      mq.style.display = "block";
      mq.style.left = "0";
      mq.style.top = "0";
      mq.style.width = "0";
      mq.style.height = "0";
    }
    function onMove(e4) {
      const cur = toScreen(e4.clientX, e4.clientY);
      const x3 = Math.min(startScreen.x, cur.x);
      const y4 = Math.min(startScreen.y, cur.y);
      const w4 = Math.abs(cur.x - startScreen.x);
      const h5 = Math.abs(cur.y - startScreen.y);
      if (mq) {
        mq.style.left = x3 + "px";
        mq.style.top = y4 + "px";
        mq.style.width = w4 + "px";
        mq.style.height = h5 + "px";
      }
    }
    function onUp(e4) {
      if (mq)
        mq.style.display = "none";
      const endCanvas = toCanvas(e4.clientX, e4.clientY);
      const rx = Math.min(startCanvas.x, endCanvas.x);
      const ry = Math.min(startCanvas.y, endCanvas.y);
      const rw = Math.abs(endCanvas.x - startCanvas.x);
      const rh = Math.abs(endCanvas.y - startCanvas.y);
      if (rw > 4 || rh > 4) {
        const hits = new Set;
        innerRef.current?.querySelectorAll(".block").forEach((el) => {
          const blockEl = el;
          const bx = parseInt(blockEl.style.left), by = parseInt(blockEl.style.top);
          const { offsetWidth: bw, offsetHeight: bh } = blockEl;
          if (bx < rx + rw && bx + bw > rx && by < ry + rh && by + bh > ry)
            hits.add(blockEl.dataset.blockId);
        });
        setSelected(hits);
      } else {
        setSelected(new Set);
      }
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }
  function handlePointerDown(e4) {
    if (e4.button === 1 || e4.button === 0 && spaceHeld.current) {
      e4.preventDefault();
      startPan(e4.clientX, e4.clientY);
      return;
    }
    if (e4.button !== 0)
      return;
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
    e4.preventDefault();
    const { clientX: startX, clientY: startY } = e4;
    let moved = false;
    let marqueeActive = false;
    function onMove(e22) {
      const dx = e22.clientX - startX, dy = e22.clientY - startY;
      if (!moved && Math.sqrt(dx * dx + dy * dy) > 4) {
        moved = true;
        if (editingEnabled.value) {
          marqueeActive = true;
          startMarquee(startX, startY);
        } else {
          startPan(startX, startY);
        }
      }
    }
    function onUp(e22) {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      if (!marqueeActive && editingEnabled.value) {
        setSelected(new Set);
        const pos = toCanvas(startX, startY);
        addBlock(pos.x, pos.y);
        requestAnimationFrame(() => {
          const pg = getActivePage();
          if (!pg)
            return;
          const lastBlock = pg.blocks[pg.blocks.length - 1];
          if (!lastBlock)
            return;
          const el = innerRef.current?.querySelector(`[data-block-id="${lastBlock.id}"] .block-content`);
          el?.focus();
        });
      }
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }
  function handleScroll() {
    updateSizer();
    const { zoom } = viewRef.current;
    const panX = containerRef.current.scrollLeft / zoom;
    const panY = containerRef.current.scrollTop / zoom;
    if (scrollSaveTimer.current !== null)
      clearTimeout(scrollSaveTimer.current);
    scrollSaveTimer.current = setTimeout(() => {
      updatePageView(panX, panY, zoom);
    }, 150);
  }
  y2(() => {
    const el = containerRef.current;
    if (!el)
      return;
    function onWheel(e4) {
      if (!e4.ctrlKey && !e4.metaKey)
        return;
      e4.preventDefault();
      const { zoom } = viewRef.current;
      const rect = el.getBoundingClientRect();
      const mx = e4.clientX - rect.left;
      const my = e4.clientY - rect.top;
      const factor = e4.deltaY < 0 ? 1.1 : 0.9;
      const nz = Math.max(0.2, Math.min(4, zoom * factor));
      const cx = (mx + el.scrollLeft) / zoom;
      const cy = (my + el.scrollTop) / zoom;
      const newScrollLeft = Math.max(0, cx * nz - mx);
      const newScrollTop = Math.max(0, cy * nz - my);
      viewRef.current = { zoom: nz };
      innerRef.current.style.transform = `scale(${nz})`;
      updateSizer(newScrollLeft, newScrollTop);
      el.scrollLeft = newScrollLeft;
      el.scrollTop = newScrollTop;
      updatePageView(newScrollLeft / nz, newScrollTop / nz, nz);
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);
  y2(() => {
    function onKeyDown(e4) {
      const target = e4.target;
      if (e4.code === "Space" && !target.isContentEditable && target.tagName !== "INPUT") {
        spaceHeld.current = true;
        if (containerRef.current)
          containerRef.current.style.cursor = "grab";
      }
      if ((e4.key === "Delete" || e4.key === "Backspace") && selectedRef.current.size && !target.isContentEditable) {
        e4.preventDefault();
        const pg = getActivePage();
        if (!pg)
          return;
        const toDelete = [...selectedRef.current];
        if (!toDelete.length)
          return;
        const deleted = toDelete.map((id) => pg.blocks.find((b2) => b2.id === id)).filter((b2) => !!b2).map((b2) => ({ ...b2 }));
        pushUndo(pg.id, { type: "delete", blocks: deleted });
        for (const id of toDelete)
          deleteBlock(id);
        setSelected(new Set);
      }
      const mod = e4.ctrlKey || e4.metaKey;
      if (mod && e4.key === "z" && !target.isContentEditable) {
        e4.preventDefault();
        e4.shiftKey ? doRedo() : doUndo();
      }
      if ((e4.key === "[" || e4.key === "]") && selectedRef.current.size && !target.isContentEditable) {
        e4.preventDefault();
        const pg = getActivePage();
        if (!pg)
          return;
        for (const id of selectedRef.current) {
          const blk = pg.blocks.find((b2) => b2.id === id);
          if (!blk)
            continue;
          updateBlockZ(id, (blk.z ?? 0) + (e4.key === "]" ? 1 : -1));
        }
      }
      if (mod && e4.key === "a" && !target.isContentEditable && target.tagName !== "INPUT") {
        e4.preventDefault();
        const pg = getActivePage();
        if (pg)
          setSelected(new Set(pg.blocks.map((b2) => b2.id)));
      }
      if (e4.key === "Escape" && !target.isContentEditable) {
        if (selectedRef.current.size)
          setSelected(new Set);
      }
      if (mod && e4.key === "c" && !target.isContentEditable && selectedRef.current.size) {
        e4.preventDefault();
        const pg = getActivePage();
        if (!pg)
          return;
        const blocks = [...selectedRef.current].map((id) => pg.blocks.find((b2) => b2.id === id)).filter((b2) => !!b2);
        copyBlocks(blocks);
        if (blocks.length === 1 && blocks[0].type === "image") {
          const imgEl = innerRef.current?.querySelector(`[data-block-id="${blocks[0].id}"] img`);
          if (imgEl) {
            try {
              const c4 = document.createElement("canvas");
              c4.width = imgEl.naturalWidth;
              c4.height = imgEl.naturalHeight;
              c4.getContext("2d").drawImage(imgEl, 0, 0);
              c4.toBlob((blob) => {
                if (blob)
                  navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]).catch(() => {});
              });
            } catch {}
          }
        }
      }
      if (mod && e4.key === "x" && !target.isContentEditable && selectedRef.current.size) {
        e4.preventDefault();
        const pg = getActivePage();
        if (!pg)
          return;
        const toDelete = [...selectedRef.current];
        const blocks = toDelete.map((id) => pg.blocks.find((b2) => b2.id === id)).filter((b2) => !!b2).map((b2) => ({ ...b2 }));
        copyBlocks(blocks);
        pushUndo(pg.id, { type: "delete", blocks });
        for (const id of toDelete)
          deleteBlock(id);
        setSelected(new Set);
      }
      if (mod && e4.key === "v" && !target.isContentEditable) {
        const blocks = getCopiedBlocks();
        if (blocks?.length) {
          e4.preventDefault();
          const pg = getActivePage();
          if (!pg)
            return;
          const newIds = new Set;
          for (const b2 of blocks) {
            const nb = addBlock(b2.x + 30, b2.y + 30, b2.w, b2.type, {
              html: b2.html,
              src: b2.src,
              crop: b2.crop ? { ...b2.crop } : undefined,
              caption: b2.caption,
              border: b2.border,
              items: b2.items?.map((i4) => ({ ...i4, id: uid() })),
              z: b2.z
            });
            newIds.add(nb.id);
          }
          pushUndo(pg.id, { type: "deleteForward", ids: [...newIds] });
          setSelected(newIds);
        }
      }
      if (mod && e4.key === "d" && !target.isContentEditable && selectedRef.current.size) {
        e4.preventDefault();
        const pg = getActivePage();
        if (!pg)
          return;
        const blocks = [...selectedRef.current].map((id) => pg.blocks.find((b2) => b2.id === id)).filter((b2) => !!b2);
        const newIds = new Set;
        for (const b2 of blocks) {
          const nb = addBlock(b2.x + 30, b2.y + 30, b2.w, b2.type, {
            html: b2.html,
            src: b2.src,
            crop: b2.crop ? { ...b2.crop } : undefined,
            caption: b2.caption,
            border: b2.border,
            items: b2.items?.map((i4) => ({ ...i4, id: uid() })),
            z: b2.z
          });
          newIds.add(nb.id);
        }
        pushUndo(pg.id, { type: "deleteForward", ids: [...newIds] });
        setSelected(newIds);
      }
    }
    function onKeyUp(e4) {
      if (e4.code === "Space") {
        spaceHeld.current = false;
        if (containerRef.current)
          containerRef.current.style.cursor = "";
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    const cleanupPaste = initPasteHandler({
      getContainer: () => containerRef.current,
      getView: () => viewRef.current
    });
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      cleanupPaste();
    };
  }, []);
  function doUndo() {
    const pg = getActivePage();
    if (!pg)
      return;
    if (!applyUndo(pg.id, pg))
      return;
    appState.value = { ...appState.value };
  }
  function doRedo() {
    const pg = getActivePage();
    if (!pg)
      return;
    if (!applyRedo(pg.id, pg))
      return;
    appState.value = { ...appState.value };
  }
  const IMAGE_URL_RE = /\.(png|jpe?g|gif|webp|svg|bmp|ico|avif)(\?|$)/i;
  function handleDrop(e4) {
    e4.preventDefault();
    if (e4.dataTransfer.types.includes("application/x-notebound-claude")) {
      startClaudeChat(e4.clientX - 180, e4.clientY - 20);
      return;
    }
    const pos = toCanvas(e4.clientX, e4.clientY);
    const uri = (e4.dataTransfer.getData("text/uri-list") || "").trim();
    if (uri && !uri.startsWith("#") && IMAGE_URL_RE.test(uri)) {
      addImageFromUrl(uri, pos.x, pos.y);
      return;
    }
    const files = [...e4.dataTransfer.files].filter((f5) => f5.type.startsWith("image/"));
    if (!files.length)
      return;
    files.forEach((file, i4) => {
      addImageFromFile(file, pos.x + i4 * 20, pos.y + i4 * 20);
    });
  }
  function focusFirstBlock() {
    const pg = getActivePage();
    if (!pg)
      return;
    let blk = pg.blocks.find((b2) => b2.type === "text" && b2.x === 0 && b2.y === 0);
    if (!blk) {
      blk = addBlock(0, 0);
    }
    const id = blk.id;
    setSelected(new Set);
    requestAnimationFrame(() => {
      const el = innerRef.current?.querySelector(`[data-block-id="${id}"] .block-content`);
      if (el)
        el.focus();
    });
  }
  const ctx = {
    selectedIds,
    onBlockDragStart,
    onBlockResizeStart,
    onImgResizeStart,
    onBlockFocus: (id) => {},
    onBlockBlur: (id) => {
      if (!page)
        return;
      const el = innerRef.current?.querySelector(`[data-block-id="${id}"] .block-content`);
      const offset = el ? getCaretOffset(el) : 0;
      lastCaretPerPage.set(page.id, { blockId: id, offset });
      savePageCaret(page.id, id, offset);
    },
    undo: doUndo,
    redo: doRedo,
    getZoom: () => viewRef.current.zoom
  };
  return /* @__PURE__ */ u4(k, {
    children: [
      /* @__PURE__ */ u4(PageTitle, {
        page,
        onEnter: focusFirstBlock
      }, undefined, false, undefined, this),
      /* @__PURE__ */ u4(CanvasCtx.Provider, {
        value: ctx,
        children: /* @__PURE__ */ u4("div", {
          id: "canvas-wrapper",
          children: [
            /* @__PURE__ */ u4("div", {
              ref: containerRef,
              id: "canvas-container",
              onPointerDown: handlePointerDown,
              onScroll: handleScroll,
              onDragOver: (e4) => {
                if (e4.dataTransfer.types.includes("Files") || e4.dataTransfer.types.includes("application/x-notebound-claude"))
                  e4.preventDefault();
              },
              onDrop: handleDrop,
              children: /* @__PURE__ */ u4("div", {
                ref: sizerRef,
                id: "canvas-sizer",
                children: /* @__PURE__ */ u4("div", {
                  ref: innerRef,
                  id: "canvas-inner",
                  style: { transformOrigin: "0 0" },
                  children: cachedPages.map((p5) => {
                    let style;
                    if (transition) {
                      const showing = p5.id === transition.inId && transition.phase === "in";
                      style = showing ? undefined : { opacity: 0, pointerEvents: "none" };
                    } else {
                      style = p5.id !== page?.id ? { opacity: 0, pointerEvents: "none" } : undefined;
                    }
                    return /* @__PURE__ */ u4("div", {
                      class: "page-layer",
                      style,
                      children: p5.blocks.map((b2) => /* @__PURE__ */ u4(Block, {
                        block: b2,
                        page: p5
                      }, b2.id, false, undefined, this))
                    }, p5.id, false, undefined, this);
                  })
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this)
            }, undefined, false, undefined, this),
            /* @__PURE__ */ u4("div", {
              ref: marqueeRef,
              id: "marquee-rect"
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// ../core/src/WelcomeScreen.tsx
var truncPath = (p5) => {
  const home = p5.replace(/^\/Users\/[^/]+/, "~").replace(/^\/home\/[^/]+/, "~");
  return home.length > 48 ? "..." + home.slice(-45) : home;
};
function WelcomeScreen() {
  const recents = recentNotebooks.value;
  return /* @__PURE__ */ u4("div", {
    class: "welcome-overlay",
    children: /* @__PURE__ */ u4("div", {
      class: "welcome-card",
      children: [
        /* @__PURE__ */ u4("h1", {
          class: "welcome-title",
          children: "Notebound"
        }, undefined, false, undefined, this),
        /* @__PURE__ */ u4("p", {
          class: "welcome-subtitle",
          children: recents.length > 0 ? "Open a notebook to get started" : "Choose how to get started"
        }, undefined, false, undefined, this),
        /* @__PURE__ */ u4("div", {
          class: "welcome-list",
          children: [
            recents.map((r4) => /* @__PURE__ */ u4("div", {
              class: "welcome-list-item welcome-list-item--notebook",
              onClick: () => openNotebook(r4.path),
              children: [
                /* @__PURE__ */ u4("div", {
                  class: "welcome-list-item-icon",
                  children: /* @__PURE__ */ u4("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 16 16",
                    fill: "none",
                    children: [
                      /* @__PURE__ */ u4("rect", {
                        x: "2",
                        y: "2",
                        width: "12",
                        height: "12",
                        rx: "2",
                        fill: "var(--active-color)",
                        opacity: "0.15"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ u4("rect", {
                        x: "2",
                        y: "2",
                        width: "12",
                        height: "12",
                        rx: "2",
                        stroke: "var(--active-color)",
                        "stroke-width": "1.2"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ u4("line", {
                        x1: "5",
                        y1: "5.5",
                        x2: "11",
                        y2: "5.5",
                        stroke: "var(--active-color)",
                        "stroke-width": "1",
                        "stroke-linecap": "round"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ u4("line", {
                        x1: "5",
                        y1: "8",
                        x2: "11",
                        y2: "8",
                        stroke: "var(--active-color)",
                        "stroke-width": "1",
                        "stroke-linecap": "round"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ u4("line", {
                        x1: "5",
                        y1: "10.5",
                        x2: "9",
                        y2: "10.5",
                        stroke: "var(--active-color)",
                        "stroke-width": "1",
                        "stroke-linecap": "round"
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this)
                }, undefined, false, undefined, this),
                /* @__PURE__ */ u4("div", {
                  class: "welcome-list-item-text",
                  children: [
                    /* @__PURE__ */ u4("div", {
                      class: "welcome-list-item-name",
                      children: r4.name
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ u4("div", {
                      class: "welcome-list-item-path",
                      children: truncPath(r4.path)
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, r4.path, true, undefined, this)),
            recents.length > 0 && /* @__PURE__ */ u4("div", {
              class: "welcome-list-sep"
            }, undefined, false, undefined, this),
            /* @__PURE__ */ u4("div", {
              class: "welcome-list-item welcome-list-item--action",
              onClick: pickAndOpenNotebook,
              children: "Open Existing Notebook..."
            }, undefined, false, undefined, this),
            /* @__PURE__ */ u4("div", {
              class: "welcome-list-item welcome-list-item--action",
              onClick: createAndOpenNotebook,
              children: "Create New Notebook..."
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      ]
    }, undefined, true, undefined, this)
  }, undefined, false, undefined, this);
}

// ../core/src/NotebookSwitcher.tsx
function NotebookSwitcher() {
  if (!showSwitcher.value)
    return null;
  const ref = A2(null);
  y2(() => {
    const onClick = (e4) => {
      if (ref.current && !ref.current.contains(e4.target))
        closeSwitcher();
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  const recents = recentNotebooks.value;
  const truncPath2 = (p5) => {
    const home = p5.replace(/^\/home\/[^/]+/, "~");
    return home.length > 50 ? "..." + home.slice(-47) : home;
  };
  return /* @__PURE__ */ u4("div", {
    class: "notebook-switcher",
    ref,
    children: [
      recents.length > 0 && /* @__PURE__ */ u4(k, {
        children: [
          /* @__PURE__ */ u4("div", {
            class: "notebook-switcher-header",
            children: "Recent Notebooks"
          }, undefined, false, undefined, this),
          recents.map((r4) => /* @__PURE__ */ u4("div", {
            class: "notebook-switcher-item",
            onClick: () => openNotebook(r4.path),
            children: [
              /* @__PURE__ */ u4("div", {
                class: "notebook-switcher-item-name",
                children: r4.name
              }, undefined, false, undefined, this),
              /* @__PURE__ */ u4("div", {
                class: "notebook-switcher-item-path",
                children: truncPath2(r4.path)
              }, undefined, false, undefined, this)
            ]
          }, r4.path, true, undefined, this)),
          /* @__PURE__ */ u4("div", {
            class: "notebook-switcher-sep"
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ u4("div", {
        class: "notebook-switcher-item",
        onClick: () => {
          closeSwitcher();
          pickAndOpenNotebook();
        },
        children: "Open Existing Notebook..."
      }, undefined, false, undefined, this),
      /* @__PURE__ */ u4("div", {
        class: "notebook-switcher-item",
        onClick: () => {
          closeSwitcher();
          createAndOpenNotebook();
        },
        children: "Create New Notebook..."
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// ../core/src/ClaudeChat.tsx
function renderMarkdown(text) {
  let html = text.replace(/```(\w*)\n([\s\S]*?)```/g, (_4, lang, code) => {
    return `<pre class="cc-code-block"><code>${escHtml(code.trimEnd())}</code></pre>`;
  });
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/^[•\-\*] (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (m4) => `<ul>${m4}</ul>`);
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");
  html = html.replace(/\n/g, "<br/>");
  return html;
}
function escHtml(s5) {
  return s5.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function ClaudeChat() {
  const chat = claudeChat.value;
  if (!chat.active)
    return null;
  const inputRef = A2(null);
  const messagesRef = A2(null);
  const dragRef = A2(null);
  _2(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [chat.messages.length, chat.messages[chat.messages.length - 1]?.content]);
  const onDragStart = q2((e4) => {
    e4.preventDefault();
    const { clientX: startX, clientY: startY } = e4;
    const origX = chat.position.x, origY = chat.position.y;
    function onMove(e22) {
      updateClaudeChatPosition(origX + (e22.clientX - startX), origY + (e22.clientY - startY));
    }
    function onUp() {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }, [chat.position.x, chat.position.y]);
  function handleSend() {
    const text = inputRef.current?.value?.trim();
    if (!text)
      return;
    inputRef.current.value = "";
    sendClaudeMessage(text);
  }
  function handleKeyDown(e4) {
    if (e4.key === "Enter" && !e4.shiftKey) {
      e4.preventDefault();
      handleSend();
    }
  }
  return /* @__PURE__ */ u4("div", {
    class: "claude-chat",
    style: { left: chat.position.x + "px", top: chat.position.y + "px" },
    children: [
      /* @__PURE__ */ u4("div", {
        class: "cc-titlebar",
        onPointerDown: onDragStart,
        ref: dragRef,
        children: [
          /* @__PURE__ */ u4("span", {
            class: "cc-title",
            children: "Claude"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ u4("div", {
            style: { display: "flex", gap: "4px", alignItems: "center" },
            children: [
              /* @__PURE__ */ u4("button", {
                class: "cc-test",
                onClick: () => {
                  if (!chat.streaming)
                    sendClaudeMessage("Write a tiny, self-contained HTML page (with inline CSS, make it look nice) and display it using the display_webpage tool. Keep it under 2 seconds.");
                },
                disabled: chat.streaming,
                title: "Test display panel",
                children: "test"
              }, undefined, false, undefined, this),
              /* @__PURE__ */ u4("button", {
                class: "cc-test",
                onClick: () => {
                  displayPanel.value = { ...displayPanel.value, active: true, uri: "file:///tmp/notebound-img-test.html" };
                },
                title: "Test iframe with local file + images",
                children: "iframe"
              }, undefined, false, undefined, this),
              /* @__PURE__ */ u4("button", {
                class: "cc-close",
                onClick: closeClaudeChat,
                children: "x"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ u4("div", {
        class: "cc-messages",
        ref: messagesRef,
        children: [
          chat.messages.map((msg, i4) => /* @__PURE__ */ u4("div", {
            class: `cc-msg cc-msg--${msg.role}`,
            children: msg.role === "assistant" ? /* @__PURE__ */ u4("div", {
              class: "cc-bubble cc-bubble--assistant",
              dangerouslySetInnerHTML: { __html: renderMarkdown(msg.content || "") }
            }, undefined, false, undefined, this) : /* @__PURE__ */ u4("div", {
              class: "cc-bubble cc-bubble--user",
              children: msg.content
            }, undefined, false, undefined, this)
          }, i4, false, undefined, this)),
          chat.streaming && /* @__PURE__ */ u4("div", {
            class: "cc-typing",
            children: [
              /* @__PURE__ */ u4("span", {
                class: "cc-typing-dot"
              }, undefined, false, undefined, this),
              /* @__PURE__ */ u4("span", {
                class: "cc-typing-dot"
              }, undefined, false, undefined, this),
              /* @__PURE__ */ u4("span", {
                class: "cc-typing-dot"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          chat.error && /* @__PURE__ */ u4("div", {
            class: "cc-error",
            children: chat.error
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ u4("div", {
        class: "cc-input-bar",
        children: [
          /* @__PURE__ */ u4("textarea", {
            ref: inputRef,
            class: "cc-input",
            placeholder: "Ask about your notebook...",
            onKeyDown: handleKeyDown,
            rows: 1,
            onInput: (e4) => {
              const target = e4.target;
              target.style.height = "auto";
              target.style.height = Math.min(target.scrollHeight, 80) + "px";
            }
          }, undefined, false, undefined, this),
          /* @__PURE__ */ u4("button", {
            class: "cc-send",
            onClick: handleSend,
            children: "Send"
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// ../core/src/DisplayPanel.tsx
function DisplayPanel() {
  const panel = displayPanel.value;
  if (!panel.active || !panel.uri)
    return null;
  const onDragStart = q2((e4) => {
    e4.preventDefault();
    const { clientX: startX, clientY: startY } = e4;
    const origX = panel.position.x, origY = panel.position.y;
    function onMove(e22) {
      updateDisplayPanelPosition(origX + (e22.clientX - startX), origY + (e22.clientY - startY));
    }
    function onUp() {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }, [panel.position.x, panel.position.y]);
  return /* @__PURE__ */ u4("div", {
    class: "display-panel",
    style: { left: panel.position.x + "px", top: panel.position.y + "px" },
    children: [
      /* @__PURE__ */ u4("div", {
        class: "dp-titlebar",
        onPointerDown: onDragStart,
        children: [
          /* @__PURE__ */ u4("span", {
            class: "dp-title",
            children: "Display"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ u4("button", {
            class: "dp-close",
            onClick: closeDisplayPanel,
            children: "x"
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ u4("iframe", {
        class: "dp-iframe",
        src: panel.uri
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// ../core/src/QuickJump.tsx
function flattenPages(pages, sectionId, sectionTitle) {
  const out = [];
  for (const p5 of pages) {
    out.push({ pageId: p5.id, pageTitle: p5.title, sectionId, sectionTitle });
    if (p5.children?.length)
      out.push(...flattenPages(p5.children, sectionId, sectionTitle));
  }
  return out;
}
function QuickJump({ onClose }) {
  const { notebooks, ui } = appState.value;
  const nb = notebooks.find((n3) => n3.id === ui.notebookId);
  const allPages = [];
  if (nb) {
    for (const sec of nb.sections) {
      allPages.push(...flattenPages(sec.pages, sec.id, sec.title));
    }
  }
  const [query, setQuery] = d2("");
  const inputRef = A2(null);
  const listRef = A2(null);
  const q3 = query.trim().toLowerCase();
  const results = q3 ? allPages.filter((r4) => r4.pageTitle.toLowerCase().includes(q3) || r4.sectionTitle.toLowerCase().includes(q3)) : allPages;
  const initIdx = allPages.findIndex((r4) => r4.pageId === ui.pageId);
  const [activeIdx, setActiveIdx] = d2(Math.max(0, initIdx));
  const clampedIdx = Math.min(activeIdx, results.length - 1);
  y2(() => {
    inputRef.current?.focus();
  }, []);
  y2(() => {
    setActiveIdx(0);
  }, [query]);
  _2(() => {
    listRef.current?.children[clampedIdx]?.scrollIntoView({ block: "nearest" });
  }, [clampedIdx]);
  _2(() => {
    if (!q3)
      listRef.current?.children[clampedIdx]?.scrollIntoView({ block: "center" });
  }, []);
  function select(result) {
    jumpToPage(result.sectionId, result.pageId);
    onClose();
  }
  function handleKeyDown(e4) {
    if (e4.key === "Escape") {
      e4.preventDefault();
      onClose();
      return;
    }
    if (e4.key === "ArrowDown") {
      e4.preventDefault();
      setActiveIdx((i4) => Math.min(i4 + 1, results.length - 1));
      return;
    }
    if (e4.key === "ArrowUp") {
      e4.preventDefault();
      setActiveIdx((i4) => Math.max(i4 - 1, 0));
      return;
    }
    if (e4.key === "Enter" && results[clampedIdx]) {
      e4.preventDefault();
      select(results[clampedIdx]);
      return;
    }
  }
  return /* @__PURE__ */ u4("div", {
    class: "qj-overlay",
    onMouseDown: (e4) => {
      if (e4.target === e4.currentTarget)
        onClose();
    },
    children: /* @__PURE__ */ u4("div", {
      class: "qj-modal",
      children: [
        /* @__PURE__ */ u4("input", {
          ref: inputRef,
          class: "qj-input",
          placeholder: "Jump to page…",
          value: query,
          onInput: (e4) => setQuery(e4.target.value),
          onKeyDown: handleKeyDown
        }, undefined, false, undefined, this),
        /* @__PURE__ */ u4("div", {
          ref: listRef,
          class: "qj-list",
          children: [
            results.map((r4, i4) => /* @__PURE__ */ u4("div", {
              class: ["qj-item", i4 === clampedIdx && "qj-item--active"].filter(Boolean).join(" "),
              onMouseDown: () => select(r4),
              onMouseEnter: () => setActiveIdx(i4),
              children: [
                /* @__PURE__ */ u4("span", {
                  class: "qj-section",
                  children: r4.sectionTitle
                }, undefined, false, undefined, this),
                /* @__PURE__ */ u4("span", {
                  class: "qj-sep",
                  children: "›"
                }, undefined, false, undefined, this),
                /* @__PURE__ */ u4("span", {
                  class: "qj-title",
                  children: r4.pageTitle
                }, undefined, false, undefined, this)
              ]
            }, r4.pageId, true, undefined, this)),
            results.length === 0 && /* @__PURE__ */ u4("div", {
              class: "qj-empty",
              children: "No pages found"
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      ]
    }, undefined, true, undefined, this)
  }, undefined, false, undefined, this);
}

// ../core/src/App.tsx
var isMac = typeof navigator !== "undefined" && /Mac/.test(navigator.platform);
function isNavMod(e4) {
  if (isMac)
    return e4.metaKey && !e4.ctrlKey && !e4.altKey && !e4.shiftKey;
  return e4.ctrlKey && e4.shiftKey && !e4.metaKey && !e4.altKey;
}
function flatPages(pages) {
  const out = [];
  for (const p5 of pages) {
    out.push(p5);
    if (p5.children?.length)
      out.push(...flatPages(p5.children));
  }
  return out;
}
function App() {
  const [showJump, setShowJump] = d2(false);
  y2(() => {
    const id = requestIdleCallback(() => preloadPages(getPreloadCandidates()), { timeout: 2000 });
    return () => cancelIdleCallback(id);
  }, [connected.value]);
  y2(() => {
    function onKey(e4) {
      const target = e4.target;
      const editing2 = target.isContentEditable || target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if (!editing2 && isNavMod(e4) && (e4.key === "k" || e4.key === "K")) {
        e4.preventDefault();
        setShowJump((v5) => !v5);
        return;
      }
      if (editing2)
        return;
      if (!isNavMod(e4))
        return;
      const { ui: ui2, notebooks: notebooks2 } = appState.value;
      const nb2 = notebooks2.find((n3) => n3.id === ui2.notebookId);
      if (!nb2)
        return;
      if (e4.key === "ArrowLeft" || e4.key === "ArrowRight") {
        e4.preventDefault();
        const dir = e4.key === "ArrowLeft" ? -1 : 1;
        const idx = nb2.sections.findIndex((s5) => s5.id === ui2.sectionId);
        const next = nb2.sections[idx + dir];
        if (next)
          setActiveSection(next.id);
        return;
      }
      if (e4.key === "ArrowUp" || e4.key === "ArrowDown") {
        e4.preventDefault();
        const sec2 = nb2.sections.find((s5) => s5.id === ui2.sectionId);
        if (!sec2)
          return;
        const flat = flatPages(sec2.pages);
        const idx = flat.findIndex((p5) => p5.id === ui2.pageId);
        const dir = e4.key === "ArrowUp" ? -1 : 1;
        const next = flat[idx + dir];
        if (next)
          setActivePage(next.id);
        return;
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  if (initializing.value)
    return null;
  if (!connected.value)
    return /* @__PURE__ */ u4(WelcomeScreen, {}, undefined, false, undefined, this);
  const state = appState.value;
  const { notebooks, ui } = state;
  const nb = notebooks.find((n3) => n3.id === ui.notebookId);
  const sec = nb?.sections.find((s5) => s5.id === ui.sectionId);
  const page = sec ? findInTree(sec.pages, ui.pageId) : null;
  const SECTION_COLORS = [
    "#fce4b8",
    "#b8d4f0",
    "#c8e6c0",
    "#f0c0c0",
    "#d8c8f0",
    "#f0d8b0",
    "#b8e0e0",
    "#f0c8e0"
  ];
  const secIdx = nb?.sections.findIndex((s5) => s5.id === ui.sectionId) ?? 0;
  const sectionColor = nb ? SECTION_COLORS[secIdx % SECTION_COLORS.length] : "#e8e8e8";
  const editing = editingEnabled.value;
  return /* @__PURE__ */ u4(k, {
    children: [
      editing && /* @__PURE__ */ u4(FormatToolbar, {}, undefined, false, undefined, this),
      /* @__PURE__ */ u4(SectionPanel, {}, undefined, false, undefined, this),
      /* @__PURE__ */ u4("div", {
        id: "body-row",
        children: /* @__PURE__ */ u4("div", {
          id: "section-desk",
          style: { background: sectionColor },
          children: [
            /* @__PURE__ */ u4("div", {
              id: "canvas-area",
              children: /* @__PURE__ */ u4(Canvas, {
                page
              }, undefined, false, undefined, this)
            }, undefined, false, undefined, this),
            /* @__PURE__ */ u4(PagesPanel, {}, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ u4(ContextMenu, {}, undefined, false, undefined, this),
      editing && /* @__PURE__ */ u4(NotebookSwitcher, {}, undefined, false, undefined, this),
      /* @__PURE__ */ u4(LinkContextMenu, {}, undefined, false, undefined, this),
      editing && /* @__PURE__ */ u4(ClaudeChat, {}, undefined, false, undefined, this),
      editing && /* @__PURE__ */ u4(DisplayPanel, {}, undefined, false, undefined, this),
      showJump && /* @__PURE__ */ u4(QuickJump, {
        onClose: () => setShowJump(false)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}

// ../core/src/main.tsx
document.getElementById("app").addEventListener("contextmenu", (e4) => {
  e4.preventDefault();
});
document.addEventListener("mousedown", (e4) => {
  if (e4.button === 1)
    e4.preventDefault();
});
J(/* @__PURE__ */ u4(App, {}, undefined, false, undefined, this), document.getElementById("app"));

//# debugId=4B9CDDCBA7053BAE64756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL3NoaW0udHMiLCAiLi4vY29yZS9ub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0Lm1vZHVsZS5qcyIsICIuLi9jb3JlL25vZGVfbW9kdWxlcy9wcmVhY3QvaG9va3MvZGlzdC9ob29rcy5tb2R1bGUuanMiLCAiLi4vY29yZS9ub2RlX21vZHVsZXMvQHByZWFjdC9zaWduYWxzLWNvcmUvZGlzdC9zaWduYWxzLWNvcmUubW9kdWxlLmpzIiwgIi4uL2NvcmUvbm9kZV9tb2R1bGVzL0BwcmVhY3Qvc2lnbmFscy9kaXN0L3NpZ25hbHMubW9kdWxlLmpzIiwgIi4uL2NvcmUvc3JjL3N0b3JlLnRzIiwgIi4uL2NvcmUvbm9kZV9tb2R1bGVzL3ByZWFjdC9qc3gtcnVudGltZS9kaXN0L2pzeFJ1bnRpbWUubW9kdWxlLmpzIiwgIi4uL2NvcmUvc3JjL0NvbnRleHRNZW51LnRzeCIsICIuLi9jb3JlL3NyYy9TZWN0aW9uUGFuZWwudHN4IiwgIi4uL2NvcmUvc3JjL1BhZ2VzUGFuZWwudHN4IiwgIi4uL2NvcmUvc3JjL2VkaXRvci50cyIsICIuLi9jb3JlL3NyYy91bmRvLnRzIiwgIi4uL2NvcmUvc3JjL2NsaXBib2FyZC50cyIsICIuLi9jb3JlL3NyYy9CbG9jay50c3giLCAiLi4vY29yZS9zcmMvQ2FudmFzLnRzeCIsICIuLi9jb3JlL3NyYy9XZWxjb21lU2NyZWVuLnRzeCIsICIuLi9jb3JlL3NyYy9Ob3RlYm9va1N3aXRjaGVyLnRzeCIsICIuLi9jb3JlL3NyYy9DbGF1ZGVDaGF0LnRzeCIsICIuLi9jb3JlL3NyYy9EaXNwbGF5UGFuZWwudHN4IiwgIi4uL2NvcmUvc3JjL1F1aWNrSnVtcC50c3giLCAiLi4vY29yZS9zcmMvQXBwLnRzeCIsICIuLi9jb3JlL3NyYy9tYWluLnRzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsKICAgICIvLyBCcm93c2VyIHNoaW0g4oCUIGltcGxlbWVudHMgd2luZG93Lm5vdGVib29rIEFQSSBmb3Igc3RhdGljL3JlYWQtb25seSB3ZWIgYXBwLlxuLy8gTG9hZHMgbm90ZWJvb2sgc3RhdGUgZnJvbSBub3RlYm9vay5qc29uIGFuZCByZXNvbHZlcyBibG9icyB2aWEgZmV0Y2guXG5cbmltcG9ydCB0eXBlIHsgQXBwU3RhdGUsIE5vdGVib29rQVBJLCBQYWdlLCBCbG9jaywgU2VjdGlvbiwgTm90ZWJvb2sgfSBmcm9tICcuLi8uLi9jb3JlL3NyYy90eXBlcy50cyc7XG5cbmxldCBfc3RhdGVDYWxsYmFjazogKChzdGF0ZTogQXBwU3RhdGUpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XG5sZXQgX2Jsb2JDYWNoZTogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxud2luZG93Lm5vdGVib29rID0ge1xuICBfYnJvd3NlclNoaW06IHRydWUsXG5cbiAgLy8gQ29uZmlnOiB0ZWxsIHN0b3JlLmpzIGEgbm90ZWJvb2sgd2lsbCBsb2FkXG4gIGdldENvbmZpZzogYXN5bmMgKCkgPT4gKHsgZGV2aWNlSWQ6ICdicm93c2VyJywgbm90ZWJvb2tQYXRoOiAnbm90ZWJvb2suanNvbicgfSksXG5cbiAgLy8gU3RhdGUgY2hhbmdlIGxpc3RlbmVyIOKAlCBzdG9yZS5qcyByZWdpc3RlcnMgdGhpcyBhdCBzdGFydHVwXG4gIG9uU3RhdGVDaGFuZ2VkOiAoY2I6IChzdGF0ZTogQXBwU3RhdGUpID0+IHZvaWQpID0+IHsgX3N0YXRlQ2FsbGJhY2sgPSBjYjsgfSxcbiAgb25PcGVuRmFpbGVkOiAoKSA9PiB7fSxcbiAgb25DYW52YXNab29tOiAoKSA9PiB7fSxcbiAgb2ZmU3RhdGVDaGFuZ2VkOiAoKSA9PiB7fSxcbiAgb2ZmQ2FudmFzWm9vbTogKCkgPT4ge30sXG5cbiAgLy8gQmxvYiByZXNvbHV0aW9uOiBmZXRjaCBmcm9tIGJsb2JzLzxoYXNoPiwgcmV0dXJuIG9iamVjdCBVUkxcbiAgZ2V0QmxvYjogYXN5bmMgKGhhc2g6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4gPT4ge1xuICAgIGlmIChfYmxvYkNhY2hlLmhhcyhoYXNoKSkgcmV0dXJuIF9ibG9iQ2FjaGUuZ2V0KGhhc2gpITtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IGZldGNoKCdibG9icy8nICsgaGFzaCk7XG4gICAgICBpZiAoIXJlc3Aub2spIHJldHVybiBudWxsO1xuICAgICAgY29uc3QgYmxvYiA9IGF3YWl0IHJlc3AuYmxvYigpO1xuICAgICAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICAgIF9ibG9iQ2FjaGUuc2V0KGhhc2gsIHVybCk7XG4gICAgICByZXR1cm4gdXJsO1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9LFxuXG4gIC8vIFdyaXRlIG9wZXJhdGlvbnMg4oCUIG5vLW9wIGZvciByZWFkLW9ubHlcbiAgYXBwbHlPcDogKCkgPT4ge30sXG4gIGFwcGx5T3BzOiAoKSA9PiB7fSxcbiAgZmx1c2g6ICgpID0+IHt9LFxuICBzYXZlQmxvYjogYXN5bmMgKCkgPT4gbnVsbCxcbiAgc2F2ZUNvbmZpZzogKCkgPT4ge30sXG4gIHNhdmVVaVN0YXRlOiAoKSA9PiB7fSxcbiAgc2F2ZVBhZ2VWaWV3OiAoKSA9PiB7fSxcbiAgc2F2ZVBhZ2VDYXJldDogKCkgPT4ge30sXG5cbiAgLy8gTmF2aWdhdGlvbiDigJQgbm90IGF2YWlsYWJsZSBpbiBicm93c2VyXG4gIG9wZW46IGFzeW5jICgpID0+IG51bGwsXG4gIGdldFN0YXRlOiBhc3luYyAoKSA9PiBudWxsLFxuICBnZXRQYXRoOiBhc3luYyAoKSA9PiBudWxsLFxuICBwaWNrRGlyZWN0b3J5OiBhc3luYyAoKSA9PiBudWxsLFxuICBwaWNrU2F2ZVBhdGg6IGFzeW5jICgpID0+IG51bGwsXG4gIGZldGNoSW1hZ2U6IGFzeW5jIChfdXJsOiBzdHJpbmcpID0+IHsgdGhyb3cgbmV3IEVycm9yKCdmZXRjaEltYWdlIG5vdCBhdmFpbGFibGUgaW4gYnJvd3NlcicpOyB9LFxuXG4gIC8vIE9wZW4gbGlua3MgaW4gbmV3IHRhYlxuICBvcGVuRXh0ZXJuYWw6ICh1cmw6IHN0cmluZykgPT4ge1xuICAgIGlmICh0eXBlb2YgdXJsID09PSAnc3RyaW5nJyAmJiAodXJsLnN0YXJ0c1dpdGgoJ2h0dHA6Ly8nKSB8fCB1cmwuc3RhcnRzV2l0aCgnaHR0cHM6Ly8nKSkpIHtcbiAgICAgIHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycpO1xuICAgIH1cbiAgfSxcbn0gc2F0aXNmaWVzIE5vdGVib29rQVBJO1xuXG4vLyBCb290OiBmZXRjaCBub3RlYm9vay5qc29uIGFuZCBwdXNoIHN0YXRlIHRvIHN0b3JlXG5mZXRjaCgnbm90ZWJvb2suanNvbj92PScgKyBEYXRlLm5vdygpKVxuICAudGhlbigocjogUmVzcG9uc2UpID0+IHtcbiAgICBpZiAoIXIub2spIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGxvYWQgbm90ZWJvb2suanNvbjogJyArIHIuc3RhdHVzKTtcbiAgICByZXR1cm4gci5qc29uKCk7XG4gIH0pXG4gIC50aGVuKChzdGF0ZTogQXBwU3RhdGUpID0+IHtcbiAgICAvLyBNaWdyYXRpb246IG5vcm1hbGl6ZSBkZWZhdWx0IHRleHQgYmxvY2tzIHRvIHg9MFxuICAgIGZ1bmN0aW9uIG1pZ3JhdGVCbG9ja3MocGFnZXM6IFBhZ2VbXSk6IHZvaWQge1xuICAgICAgZm9yIChjb25zdCBwZyBvZiBwYWdlcykge1xuICAgICAgICBmb3IgKGNvbnN0IGIgb2YgcGcuYmxvY2tzIHx8IFtdKSB7XG4gICAgICAgICAgaWYgKGIudHlwZSA9PT0gJ3RleHQnICYmIGIueSA9PT0gMCAmJiAoYi54ID09PSAyOCB8fCBiLnggPT09IDE2KSkgYi54ID0gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGcuY2hpbGRyZW4/Lmxlbmd0aCkgbWlncmF0ZUJsb2NrcyhwZy5jaGlsZHJlbik7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgbmIgb2Ygc3RhdGUubm90ZWJvb2tzIHx8IFtdKSB7XG4gICAgICBmb3IgKGNvbnN0IHNlYyBvZiBuYi5zZWN0aW9ucyB8fCBbXSkgbWlncmF0ZUJsb2NrcyhzZWMucGFnZXMgfHwgW10pO1xuICAgIH1cblxuICAgIC8vIEFwcGx5IFVSTCBuYXZpZ2F0aW9uIOKAlCBoYXNoIGZvcm1hdDogIyEvU2VjdGlvbi9QYWdlLz94PS4uLiZ5PS4uLlxuICAgIC8vIEFsc28gc3VwcG9ydHMgbGVnYWN5IHF1ZXJ5IHBhcmFtczogP3NlY3Rpb249Li4uJnBhZ2U9Li4uXG4gICAgbGV0IHNQYXJhbTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IHBQYXJhbTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IHBIaW50OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICBjb25zdCBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2g7XG4gICAgaWYgKGhhc2guc3RhcnRzV2l0aCgnIyEvJykpIHtcbiAgICAgIGNvbnN0IHBhcnRzID0gaGFzaC5zbGljZSgzKS5zcGxpdCgnPycpO1xuICAgICAgY29uc3Qgc2VnbWVudHMgPSBwYXJ0c1swXS5zcGxpdCgnLycpLmZpbHRlcihCb29sZWFuKS5tYXAoZGVjb2RlVVJJQ29tcG9uZW50KTtcbiAgICAgIGlmIChzZWdtZW50cy5sZW5ndGggPj0gMSkgc1BhcmFtID0gc2VnbWVudHNbMF07XG4gICAgICBpZiAoc2VnbWVudHMubGVuZ3RoID49IDIpIHBQYXJhbSA9IHNlZ21lbnRzWzFdO1xuICAgICAgaWYgKHBhcnRzWzFdKSB7XG4gICAgICAgIGNvbnN0IGhwID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhwYXJ0c1sxXSk7XG4gICAgICAgIGlmIChocC5oYXMoJ3AnKSkgcEhpbnQgPSBocC5nZXQoJ3AnKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbiAgICAgIHNQYXJhbSA9IHBhcmFtcy5nZXQoJ3NlY3Rpb24nKTtcbiAgICAgIHBQYXJhbSA9IHBhcmFtcy5nZXQoJ3BhZ2UnKTtcbiAgICB9XG4gICAgaWYgKHNQYXJhbSB8fCBwUGFyYW0pIHtcbiAgICAgIGNvbnN0IG5iID0gc3RhdGUubm90ZWJvb2tzPy5bMF07XG4gICAgICBpZiAobmIpIHtcbiAgICAgICAgY29uc3Qgc2VjID0gc1BhcmFtXG4gICAgICAgICAgPyBuYi5zZWN0aW9ucy5maW5kKChzOiBTZWN0aW9uKSA9PiBzLmlkID09PSBzUGFyYW0gfHwgcy50aXRsZSA9PT0gc1BhcmFtKVxuICAgICAgICAgIDogbmIuc2VjdGlvbnMuZmluZCgoczogU2VjdGlvbikgPT4gcy5pZCA9PT0gc3RhdGUudWk/LnNlY3Rpb25JZCkgfHwgbmIuc2VjdGlvbnNbMF07XG4gICAgICAgIGlmIChzZWMpIHtcbiAgICAgICAgICBzdGF0ZS51aSA9IHN0YXRlLnVpIHx8IHsgbm90ZWJvb2tJZDogbnVsbCwgc2VjdGlvbklkOiBudWxsLCBwYWdlSWQ6IG51bGwgfTtcbiAgICAgICAgICBzdGF0ZS51aS5zZWN0aW9uSWQgPSBzZWMuaWQ7XG4gICAgICAgICAgaWYgKHBQYXJhbSB8fCBwSGludCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gZmluZFBhZ2UocGFnZXM6IFBhZ2VbXSk6IFBhZ2UgfCBudWxsIHtcbiAgICAgICAgICAgICAgZm9yIChjb25zdCBwIG9mIHBhZ2VzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBIaW50ICYmIHAuaWQuc3RhcnRzV2l0aChwSGludCkpIHJldHVybiBwO1xuICAgICAgICAgICAgICAgIGlmIChwUGFyYW0gJiYgKHAuaWQgPT09IHBQYXJhbSB8fCBwLnRpdGxlID09PSBwUGFyYW0pKSByZXR1cm4gcDtcbiAgICAgICAgICAgICAgICBpZiAocC5jaGlsZHJlbj8ubGVuZ3RoKSB7IGNvbnN0IGYgPSBmaW5kUGFnZShwLmNoaWxkcmVuKTsgaWYgKGYpIHJldHVybiBmOyB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwZyA9IGZpbmRQYWdlKHNlYy5wYWdlcyk7XG4gICAgICAgICAgICBpZiAocGcpIHtcbiAgICAgICAgICAgICAgc3RhdGUudWkucGFnZUlkID0gcGcuaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChzZWMucGFnZXM/Lmxlbmd0aCkge1xuICAgICAgICAgICAgc3RhdGUudWkucGFnZUlkID0gc2VjLnBhZ2VzWzBdLmlkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoX3N0YXRlQ2FsbGJhY2spIF9zdGF0ZUNhbGxiYWNrKHN0YXRlKTtcbiAgfSlcbiAgLmNhdGNoKChlcnI6IEVycm9yKSA9PiB7XG4gICAgY29uc29sZS5lcnJvcignW25vdGVib3VuZC13ZWJdIEZhaWxlZCB0byBsb2FkIG5vdGVib29rOicsIGVycik7XG4gIH0pO1xuIiwKICAgICJ2YXIgbixsLHUsdCxpLHIsbyxlLGYsYyxzLGEsaCxwPXt9LHY9W10seT0vYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofGdyaWR8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZHxpdGVyYS9pLGQ9QXJyYXkuaXNBcnJheTtmdW5jdGlvbiB3KG4sbCl7Zm9yKHZhciB1IGluIGwpblt1XT1sW3VdO3JldHVybiBufWZ1bmN0aW9uIGcobil7biYmbi5wYXJlbnROb2RlJiZuLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobil9ZnVuY3Rpb24gXyhsLHUsdCl7dmFyIGkscixvLGU9e307Zm9yKG8gaW4gdSlcImtleVwiPT1vP2k9dVtvXTpcInJlZlwiPT1vP3I9dVtvXTplW29dPXVbb107aWYoYXJndW1lbnRzLmxlbmd0aD4yJiYoZS5jaGlsZHJlbj1hcmd1bWVudHMubGVuZ3RoPjM/bi5jYWxsKGFyZ3VtZW50cywyKTp0KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsJiZudWxsIT1sLmRlZmF1bHRQcm9wcylmb3IobyBpbiBsLmRlZmF1bHRQcm9wcyl2b2lkIDA9PT1lW29dJiYoZVtvXT1sLmRlZmF1bHRQcm9wc1tvXSk7cmV0dXJuIG0obCxlLGkscixudWxsKX1mdW5jdGlvbiBtKG4sdCxpLHIsbyl7dmFyIGU9e3R5cGU6bixwcm9wczp0LGtleTppLHJlZjpyLF9fazpudWxsLF9fOm51bGwsX19iOjAsX19lOm51bGwsX19jOm51bGwsY29uc3RydWN0b3I6dm9pZCAwLF9fdjpudWxsPT1vPysrdTpvLF9faTotMSxfX3U6MH07cmV0dXJuIG51bGw9PW8mJm51bGwhPWwudm5vZGUmJmwudm5vZGUoZSksZX1mdW5jdGlvbiBiKCl7cmV0dXJue2N1cnJlbnQ6bnVsbH19ZnVuY3Rpb24gayhuKXtyZXR1cm4gbi5jaGlsZHJlbn1mdW5jdGlvbiB4KG4sbCl7dGhpcy5wcm9wcz1uLHRoaXMuY29udGV4dD1sfWZ1bmN0aW9uIFMobixsKXtpZihudWxsPT1sKXJldHVybiBuLl9fP1Mobi5fXyxuLl9faSsxKTpudWxsO2Zvcih2YXIgdTtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSlyZXR1cm4gdS5fX2U7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2Ygbi50eXBlP1Mobik6bnVsbH1mdW5jdGlvbiBDKG4pe2lmKG4uX19QJiZuLl9fZCl7dmFyIHU9bi5fX3YsdD11Ll9fZSxpPVtdLHI9W10sbz13KHt9LHUpO28uX192PXUuX192KzEsbC52bm9kZSYmbC52bm9kZShvKSx6KG4uX19QLG8sdSxuLl9fbixuLl9fUC5uYW1lc3BhY2VVUkksMzImdS5fX3U/W3RdOm51bGwsaSxudWxsPT10P1ModSk6dCwhISgzMiZ1Ll9fdSksciksby5fX3Y9dS5fX3Ysby5fXy5fX2tbby5fX2ldPW8sVihpLG8sciksdS5fX2U9dS5fXz1udWxsLG8uX19lIT10JiZNKG8pfX1mdW5jdGlvbiBNKG4pe2lmKG51bGwhPShuPW4uX18pJiZudWxsIT1uLl9fYylyZXR1cm4gbi5fX2U9bi5fX2MuYmFzZT1udWxsLG4uX19rLnNvbWUoZnVuY3Rpb24obCl7aWYobnVsbCE9bCYmbnVsbCE9bC5fX2UpcmV0dXJuIG4uX19lPW4uX19jLmJhc2U9bC5fX2V9KSxNKG4pfWZ1bmN0aW9uICQobil7KCFuLl9fZCYmKG4uX19kPSEwKSYmaS5wdXNoKG4pJiYhSS5fX3IrK3x8ciE9bC5kZWJvdW5jZVJlbmRlcmluZykmJigocj1sLmRlYm91bmNlUmVuZGVyaW5nKXx8bykoSSl9ZnVuY3Rpb24gSSgpe2Zvcih2YXIgbixsPTE7aS5sZW5ndGg7KWkubGVuZ3RoPmwmJmkuc29ydChlKSxuPWkuc2hpZnQoKSxsPWkubGVuZ3RoLEMobik7SS5fX3I9MH1mdW5jdGlvbiBQKG4sbCx1LHQsaSxyLG8sZSxmLGMscyl7dmFyIGEsaCx5LGQsdyxnLF8sbT10JiZ0Ll9fa3x8dixiPWwubGVuZ3RoO2ZvcihmPUEodSxsLG0sZixiKSxhPTA7YTxiO2ErKyludWxsIT0oeT11Ll9fa1thXSkmJihoPS0xIT15Ll9faSYmbVt5Ll9faV18fHAseS5fX2k9YSxnPXoobix5LGgsaSxyLG8sZSxmLGMscyksZD15Ll9fZSx5LnJlZiYmaC5yZWYhPXkucmVmJiYoaC5yZWYmJkQoaC5yZWYsbnVsbCx5KSxzLnB1c2goeS5yZWYseS5fX2N8fGQseSkpLG51bGw9PXcmJm51bGwhPWQmJih3PWQpLChfPSEhKDQmeS5fX3UpKXx8aC5fX2s9PT15Ll9faz9mPUgoeSxmLG4sXyk6XCJmdW5jdGlvblwiPT10eXBlb2YgeS50eXBlJiZ2b2lkIDAhPT1nP2Y9ZzpkJiYoZj1kLm5leHRTaWJsaW5nKSx5Ll9fdSY9LTcpO3JldHVybiB1Ll9fZT13LGZ9ZnVuY3Rpb24gQShuLGwsdSx0LGkpe3ZhciByLG8sZSxmLGMscz11Lmxlbmd0aCxhPXMsaD0wO2ZvcihuLl9faz1uZXcgQXJyYXkoaSkscj0wO3I8aTtyKyspbnVsbCE9KG89bFtyXSkmJlwiYm9vbGVhblwiIT10eXBlb2YgbyYmXCJmdW5jdGlvblwiIT10eXBlb2Ygbz8oXCJzdHJpbmdcIj09dHlwZW9mIG98fFwibnVtYmVyXCI9PXR5cGVvZiBvfHxcImJpZ2ludFwiPT10eXBlb2Ygb3x8by5jb25zdHJ1Y3Rvcj09U3RyaW5nP289bi5fX2tbcl09bShudWxsLG8sbnVsbCxudWxsLG51bGwpOmQobyk/bz1uLl9fa1tyXT1tKGsse2NoaWxkcmVuOm99LG51bGwsbnVsbCxudWxsKTp2b2lkIDA9PT1vLmNvbnN0cnVjdG9yJiZvLl9fYj4wP289bi5fX2tbcl09bShvLnR5cGUsby5wcm9wcyxvLmtleSxvLnJlZj9vLnJlZjpudWxsLG8uX192KTpuLl9fa1tyXT1vLGY9citoLG8uX189bixvLl9fYj1uLl9fYisxLGU9bnVsbCwtMSE9KGM9by5fX2k9VChvLHUsZixhKSkmJihhLS0sKGU9dVtjXSkmJihlLl9fdXw9MikpLG51bGw9PWV8fG51bGw9PWUuX192PygtMT09YyYmKGk+cz9oLS06aTxzJiZoKyspLFwiZnVuY3Rpb25cIiE9dHlwZW9mIG8udHlwZSYmKG8uX191fD00KSk6YyE9ZiYmKGM9PWYtMT9oLS06Yz09ZisxP2grKzooYz5mP2gtLTpoKyssby5fX3V8PTQpKSk6bi5fX2tbcl09bnVsbDtpZihhKWZvcihyPTA7cjxzO3IrKyludWxsIT0oZT11W3JdKSYmMD09KDImZS5fX3UpJiYoZS5fX2U9PXQmJih0PVMoZSkpLEUoZSxlKSk7cmV0dXJuIHR9ZnVuY3Rpb24gSChuLGwsdSx0KXt2YXIgaSxyO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIG4udHlwZSl7Zm9yKGk9bi5fX2sscj0wO2kmJnI8aS5sZW5ndGg7cisrKWlbcl0mJihpW3JdLl9fPW4sbD1IKGlbcl0sbCx1LHQpKTtyZXR1cm4gbH1uLl9fZSE9bCYmKHQmJihsJiZuLnR5cGUmJiFsLnBhcmVudE5vZGUmJihsPVMobikpLHUuaW5zZXJ0QmVmb3JlKG4uX19lLGx8fG51bGwpKSxsPW4uX19lKTtkb3tsPWwmJmwubmV4dFNpYmxpbmd9d2hpbGUobnVsbCE9bCYmOD09bC5ub2RlVHlwZSk7cmV0dXJuIGx9ZnVuY3Rpb24gTChuLGwpe3JldHVybiBsPWx8fFtdLG51bGw9PW58fFwiYm9vbGVhblwiPT10eXBlb2Ygbnx8KGQobik/bi5zb21lKGZ1bmN0aW9uKG4pe0wobixsKX0pOmwucHVzaChuKSksbH1mdW5jdGlvbiBUKG4sbCx1LHQpe3ZhciBpLHIsbyxlPW4ua2V5LGY9bi50eXBlLGM9bFt1XSxzPW51bGwhPWMmJjA9PSgyJmMuX191KTtpZihudWxsPT09YyYmbnVsbD09ZXx8cyYmZT09Yy5rZXkmJmY9PWMudHlwZSlyZXR1cm4gdTtpZih0PihzPzE6MCkpZm9yKGk9dS0xLHI9dSsxO2k+PTB8fHI8bC5sZW5ndGg7KWlmKG51bGwhPShjPWxbbz1pPj0wP2ktLTpyKytdKSYmMD09KDImYy5fX3UpJiZlPT1jLmtleSYmZj09Yy50eXBlKXJldHVybiBvO3JldHVybi0xfWZ1bmN0aW9uIGoobixsLHUpe1wiLVwiPT1sWzBdP24uc2V0UHJvcGVydHkobCxudWxsPT11P1wiXCI6dSk6bltsXT1udWxsPT11P1wiXCI6XCJudW1iZXJcIiE9dHlwZW9mIHV8fHkudGVzdChsKT91OnUrXCJweFwifWZ1bmN0aW9uIEYobixsLHUsdCxpKXt2YXIgcixvO246aWYoXCJzdHlsZVwiPT1sKWlmKFwic3RyaW5nXCI9PXR5cGVvZiB1KW4uc3R5bGUuY3NzVGV4dD11O2Vsc2V7aWYoXCJzdHJpbmdcIj09dHlwZW9mIHQmJihuLnN0eWxlLmNzc1RleHQ9dD1cIlwiKSx0KWZvcihsIGluIHQpdSYmbCBpbiB1fHxqKG4uc3R5bGUsbCxcIlwiKTtpZih1KWZvcihsIGluIHUpdCYmdVtsXT09dFtsXXx8aihuLnN0eWxlLGwsdVtsXSl9ZWxzZSBpZihcIm9cIj09bFswXSYmXCJuXCI9PWxbMV0pcj1sIT0obD1sLnJlcGxhY2UoZixcIiQxXCIpKSxvPWwudG9Mb3dlckNhc2UoKSxsPW8gaW4gbnx8XCJvbkZvY3VzT3V0XCI9PWx8fFwib25Gb2N1c0luXCI9PWw/by5zbGljZSgyKTpsLnNsaWNlKDIpLG4ubHx8KG4ubD17fSksbi5sW2wrcl09dSx1P3Q/dS51PXQudToodS51PWMsbi5hZGRFdmVudExpc3RlbmVyKGwscj9hOnMscikpOm4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihsLHI/YTpzLHIpO2Vsc2V7aWYoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPT1pKWw9bC5yZXBsYWNlKC94bGluayhIfDpoKS8sXCJoXCIpLnJlcGxhY2UoL3NOYW1lJC8sXCJzXCIpO2Vsc2UgaWYoXCJ3aWR0aFwiIT1sJiZcImhlaWdodFwiIT1sJiZcImhyZWZcIiE9bCYmXCJsaXN0XCIhPWwmJlwiZm9ybVwiIT1sJiZcInRhYkluZGV4XCIhPWwmJlwiZG93bmxvYWRcIiE9bCYmXCJyb3dTcGFuXCIhPWwmJlwiY29sU3BhblwiIT1sJiZcInJvbGVcIiE9bCYmXCJwb3BvdmVyXCIhPWwmJmwgaW4gbil0cnl7bltsXT1udWxsPT11P1wiXCI6dTticmVhayBufWNhdGNoKG4pe31cImZ1bmN0aW9uXCI9PXR5cGVvZiB1fHwobnVsbD09dXx8ITE9PT11JiZcIi1cIiE9bFs0XT9uLnJlbW92ZUF0dHJpYnV0ZShsKTpuLnNldEF0dHJpYnV0ZShsLFwicG9wb3ZlclwiPT1sJiYxPT11P1wiXCI6dSkpfX1mdW5jdGlvbiBPKG4pe3JldHVybiBmdW5jdGlvbih1KXtpZih0aGlzLmwpe3ZhciB0PXRoaXMubFt1LnR5cGUrbl07aWYobnVsbD09dS50KXUudD1jKys7ZWxzZSBpZih1LnQ8dC51KXJldHVybjtyZXR1cm4gdChsLmV2ZW50P2wuZXZlbnQodSk6dSl9fX1mdW5jdGlvbiB6KG4sdSx0LGkscixvLGUsZixjLHMpe3ZhciBhLGgscCx5LF8sbSxiLFMsQyxNLCQsSSxBLEgsTCxUPXUudHlwZTtpZih2b2lkIDAhPT11LmNvbnN0cnVjdG9yKXJldHVybiBudWxsOzEyOCZ0Ll9fdSYmKGM9ISEoMzImdC5fX3UpLG89W2Y9dS5fX2U9dC5fX2VdKSwoYT1sLl9fYikmJmEodSk7bjppZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBUKXRyeXtpZihTPXUucHJvcHMsQz1cInByb3RvdHlwZVwiaW4gVCYmVC5wcm90b3R5cGUucmVuZGVyLE09KGE9VC5jb250ZXh0VHlwZSkmJmlbYS5fX2NdLCQ9YT9NP00ucHJvcHMudmFsdWU6YS5fXzppLHQuX19jP2I9KGg9dS5fX2M9dC5fX2MpLl9fPWguX19FOihDP3UuX19jPWg9bmV3IFQoUywkKToodS5fX2M9aD1uZXcgeChTLCQpLGguY29uc3RydWN0b3I9VCxoLnJlbmRlcj1HKSxNJiZNLnN1YihoKSxoLnN0YXRlfHwoaC5zdGF0ZT17fSksaC5fX249aSxwPWguX19kPSEwLGguX19oPVtdLGguX3NiPVtdKSxDJiZudWxsPT1oLl9fcyYmKGguX19zPWguc3RhdGUpLEMmJm51bGwhPVQuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiYoaC5fX3M9PWguc3RhdGUmJihoLl9fcz13KHt9LGguX19zKSksdyhoLl9fcyxULmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhTLGguX19zKSkpLHk9aC5wcm9wcyxfPWguc3RhdGUsaC5fX3Y9dSxwKUMmJm51bGw9PVQuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZudWxsIT1oLmNvbXBvbmVudFdpbGxNb3VudCYmaC5jb21wb25lbnRXaWxsTW91bnQoKSxDJiZudWxsIT1oLmNvbXBvbmVudERpZE1vdW50JiZoLl9faC5wdXNoKGguY29tcG9uZW50RGlkTW91bnQpO2Vsc2V7aWYoQyYmbnVsbD09VC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJlMhPT15JiZudWxsIT1oLmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMmJmguY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhTLCQpLHUuX192PT10Ll9fdnx8IWguX19lJiZudWxsIT1oLnNob3VsZENvbXBvbmVudFVwZGF0ZSYmITE9PT1oLnNob3VsZENvbXBvbmVudFVwZGF0ZShTLGguX19zLCQpKXt1Ll9fdiE9dC5fX3YmJihoLnByb3BzPVMsaC5zdGF0ZT1oLl9fcyxoLl9fZD0hMSksdS5fX2U9dC5fX2UsdS5fX2s9dC5fX2ssdS5fX2suc29tZShmdW5jdGlvbihuKXtuJiYobi5fXz11KX0pLHYucHVzaC5hcHBseShoLl9faCxoLl9zYiksaC5fc2I9W10saC5fX2gubGVuZ3RoJiZlLnB1c2goaCk7YnJlYWsgbn1udWxsIT1oLmNvbXBvbmVudFdpbGxVcGRhdGUmJmguY29tcG9uZW50V2lsbFVwZGF0ZShTLGguX19zLCQpLEMmJm51bGwhPWguY29tcG9uZW50RGlkVXBkYXRlJiZoLl9faC5wdXNoKGZ1bmN0aW9uKCl7aC5jb21wb25lbnREaWRVcGRhdGUoeSxfLG0pfSl9aWYoaC5jb250ZXh0PSQsaC5wcm9wcz1TLGguX19QPW4saC5fX2U9ITEsST1sLl9fcixBPTAsQyloLnN0YXRlPWguX19zLGguX19kPSExLEkmJkkodSksYT1oLnJlbmRlcihoLnByb3BzLGguc3RhdGUsaC5jb250ZXh0KSx2LnB1c2guYXBwbHkoaC5fX2gsaC5fc2IpLGguX3NiPVtdO2Vsc2UgZG97aC5fX2Q9ITEsSSYmSSh1KSxhPWgucmVuZGVyKGgucHJvcHMsaC5zdGF0ZSxoLmNvbnRleHQpLGguc3RhdGU9aC5fX3N9d2hpbGUoaC5fX2QmJisrQTwyNSk7aC5zdGF0ZT1oLl9fcyxudWxsIT1oLmdldENoaWxkQ29udGV4dCYmKGk9dyh3KHt9LGkpLGguZ2V0Q2hpbGRDb250ZXh0KCkpKSxDJiYhcCYmbnVsbCE9aC5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZSYmKG09aC5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZSh5LF8pKSxIPW51bGwhPWEmJmEudHlwZT09PWsmJm51bGw9PWEua2V5P3EoYS5wcm9wcy5jaGlsZHJlbik6YSxmPVAobixkKEgpP0g6W0hdLHUsdCxpLHIsbyxlLGYsYyxzKSxoLmJhc2U9dS5fX2UsdS5fX3UmPS0xNjEsaC5fX2gubGVuZ3RoJiZlLnB1c2goaCksYiYmKGguX19FPWguX189bnVsbCl9Y2F0Y2gobil7aWYodS5fX3Y9bnVsbCxjfHxudWxsIT1vKWlmKG4udGhlbil7Zm9yKHUuX191fD1jPzE2MDoxMjg7ZiYmOD09Zi5ub2RlVHlwZSYmZi5uZXh0U2libGluZzspZj1mLm5leHRTaWJsaW5nO29bby5pbmRleE9mKGYpXT1udWxsLHUuX19lPWZ9ZWxzZXtmb3IoTD1vLmxlbmd0aDtMLS07KWcob1tMXSk7Tih1KX1lbHNlIHUuX19lPXQuX19lLHUuX19rPXQuX19rLG4udGhlbnx8Tih1KTtsLl9fZShuLHUsdCl9ZWxzZSBudWxsPT1vJiZ1Ll9fdj09dC5fX3Y/KHUuX19rPXQuX19rLHUuX19lPXQuX19lKTpmPXUuX19lPUIodC5fX2UsdSx0LGkscixvLGUsYyxzKTtyZXR1cm4oYT1sLmRpZmZlZCkmJmEodSksMTI4JnUuX191P3ZvaWQgMDpmfWZ1bmN0aW9uIE4obil7biYmKG4uX19jJiYobi5fX2MuX19lPSEwKSxuLl9fayYmbi5fX2suc29tZShOKSl9ZnVuY3Rpb24gVihuLHUsdCl7Zm9yKHZhciBpPTA7aTx0Lmxlbmd0aDtpKyspRCh0W2ldLHRbKytpXSx0WysraV0pO2wuX19jJiZsLl9fYyh1LG4pLG4uc29tZShmdW5jdGlvbih1KXt0cnl7bj11Ll9faCx1Ll9faD1bXSxuLnNvbWUoZnVuY3Rpb24obil7bi5jYWxsKHUpfSl9Y2F0Y2gobil7bC5fX2Uobix1Ll9fdil9fSl9ZnVuY3Rpb24gcShuKXtyZXR1cm5cIm9iamVjdFwiIT10eXBlb2Ygbnx8bnVsbD09bnx8bi5fX2I+MD9uOmQobik/bi5tYXAocSk6dyh7fSxuKX1mdW5jdGlvbiBCKHUsdCxpLHIsbyxlLGYsYyxzKXt2YXIgYSxoLHYseSx3LF8sbSxiPWkucHJvcHN8fHAsaz10LnByb3BzLHg9dC50eXBlO2lmKFwic3ZnXCI9PXg/bz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI6XCJtYXRoXCI9PXg/bz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTgvTWF0aC9NYXRoTUxcIjpvfHwobz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIiksbnVsbCE9ZSlmb3IoYT0wO2E8ZS5sZW5ndGg7YSsrKWlmKCh3PWVbYV0pJiZcInNldEF0dHJpYnV0ZVwiaW4gdz09ISF4JiYoeD93LmxvY2FsTmFtZT09eDozPT13Lm5vZGVUeXBlKSl7dT13LGVbYV09bnVsbDticmVha31pZihudWxsPT11KXtpZihudWxsPT14KXJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShrKTt1PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhvLHgsay5pcyYmayksYyYmKGwuX19tJiZsLl9fbSh0LGUpLGM9ITEpLGU9bnVsbH1pZihudWxsPT14KWI9PT1rfHxjJiZ1LmRhdGE9PWt8fCh1LmRhdGE9ayk7ZWxzZXtpZihlPWUmJm4uY2FsbCh1LmNoaWxkTm9kZXMpLCFjJiZudWxsIT1lKWZvcihiPXt9LGE9MDthPHUuYXR0cmlidXRlcy5sZW5ndGg7YSsrKWJbKHc9dS5hdHRyaWJ1dGVzW2FdKS5uYW1lXT13LnZhbHVlO2ZvcihhIGluIGIpdz1iW2FdLFwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUxcIj09YT92PXc6XCJjaGlsZHJlblwiPT1hfHxhIGluIGt8fFwidmFsdWVcIj09YSYmXCJkZWZhdWx0VmFsdWVcImluIGt8fFwiY2hlY2tlZFwiPT1hJiZcImRlZmF1bHRDaGVja2VkXCJpbiBrfHxGKHUsYSxudWxsLHcsbyk7Zm9yKGEgaW4gayl3PWtbYV0sXCJjaGlsZHJlblwiPT1hP3k9dzpcImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MXCI9PWE/aD13OlwidmFsdWVcIj09YT9fPXc6XCJjaGVja2VkXCI9PWE/bT13OmMmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHd8fGJbYV09PT13fHxGKHUsYSx3LGJbYV0sbyk7aWYoaCljfHx2JiYoaC5fX2h0bWw9PXYuX19odG1sfHxoLl9faHRtbD09dS5pbm5lckhUTUwpfHwodS5pbm5lckhUTUw9aC5fX2h0bWwpLHQuX19rPVtdO2Vsc2UgaWYodiYmKHUuaW5uZXJIVE1MPVwiXCIpLFAoXCJ0ZW1wbGF0ZVwiPT10LnR5cGU/dS5jb250ZW50OnUsZCh5KT95Olt5XSx0LGkscixcImZvcmVpZ25PYmplY3RcIj09eD9cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIjpvLGUsZixlP2VbMF06aS5fX2smJlMoaSwwKSxjLHMpLG51bGwhPWUpZm9yKGE9ZS5sZW5ndGg7YS0tOylnKGVbYV0pO2N8fChhPVwidmFsdWVcIixcInByb2dyZXNzXCI9PXgmJm51bGw9PV8/dS5yZW1vdmVBdHRyaWJ1dGUoXCJ2YWx1ZVwiKTpudWxsIT1fJiYoXyE9PXVbYV18fFwicHJvZ3Jlc3NcIj09eCYmIV98fFwib3B0aW9uXCI9PXgmJl8hPWJbYV0pJiZGKHUsYSxfLGJbYV0sbyksYT1cImNoZWNrZWRcIixudWxsIT1tJiZtIT11W2FdJiZGKHUsYSxtLGJbYV0sbykpfXJldHVybiB1fWZ1bmN0aW9uIEQobix1LHQpe3RyeXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBuKXt2YXIgaT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBuLl9fdTtpJiZuLl9fdSgpLGkmJm51bGw9PXV8fChuLl9fdT1uKHUpKX1lbHNlIG4uY3VycmVudD11fWNhdGNoKG4pe2wuX19lKG4sdCl9fWZ1bmN0aW9uIEUobix1LHQpe3ZhciBpLHI7aWYobC51bm1vdW50JiZsLnVubW91bnQobiksKGk9bi5yZWYpJiYoaS5jdXJyZW50JiZpLmN1cnJlbnQhPW4uX19lfHxEKGksbnVsbCx1KSksbnVsbCE9KGk9bi5fX2MpKXtpZihpLmNvbXBvbmVudFdpbGxVbm1vdW50KXRyeXtpLmNvbXBvbmVudFdpbGxVbm1vdW50KCl9Y2F0Y2gobil7bC5fX2Uobix1KX1pLmJhc2U9aS5fX1A9bnVsbH1pZihpPW4uX19rKWZvcihyPTA7cjxpLmxlbmd0aDtyKyspaVtyXSYmRShpW3JdLHUsdHx8XCJmdW5jdGlvblwiIT10eXBlb2Ygbi50eXBlKTt0fHxnKG4uX19lKSxuLl9fYz1uLl9fPW4uX19lPXZvaWQgMH1mdW5jdGlvbiBHKG4sbCx1KXtyZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihuLHUpfWZ1bmN0aW9uIEoodSx0LGkpe3ZhciByLG8sZSxmO3Q9PWRvY3VtZW50JiYodD1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLGwuX18mJmwuX18odSx0KSxvPShyPVwiZnVuY3Rpb25cIj09dHlwZW9mIGkpP251bGw6aSYmaS5fX2t8fHQuX19rLGU9W10sZj1bXSx6KHQsdT0oIXImJml8fHQpLl9faz1fKGssbnVsbCxbdV0pLG98fHAscCx0Lm5hbWVzcGFjZVVSSSwhciYmaT9baV06bz9udWxsOnQuZmlyc3RDaGlsZD9uLmNhbGwodC5jaGlsZE5vZGVzKTpudWxsLGUsIXImJmk/aTpvP28uX19lOnQuZmlyc3RDaGlsZCxyLGYpLFYoZSx1LGYpfWZ1bmN0aW9uIEsobixsKXtKKG4sbCxLKX1mdW5jdGlvbiBRKGwsdSx0KXt2YXIgaSxyLG8sZSxmPXcoe30sbC5wcm9wcyk7Zm9yKG8gaW4gbC50eXBlJiZsLnR5cGUuZGVmYXVsdFByb3BzJiYoZT1sLnR5cGUuZGVmYXVsdFByb3BzKSx1KVwia2V5XCI9PW8/aT11W29dOlwicmVmXCI9PW8/cj11W29dOmZbb109dm9pZCAwPT09dVtvXSYmbnVsbCE9ZT9lW29dOnVbb107cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg+MiYmKGYuY2hpbGRyZW49YXJndW1lbnRzLmxlbmd0aD4zP24uY2FsbChhcmd1bWVudHMsMik6dCksbShsLnR5cGUsZixpfHxsLmtleSxyfHxsLnJlZixudWxsKX1mdW5jdGlvbiBSKG4pe2Z1bmN0aW9uIGwobil7dmFyIHUsdDtyZXR1cm4gdGhpcy5nZXRDaGlsZENvbnRleHR8fCh1PW5ldyBTZXQsKHQ9e30pW2wuX19jXT10aGlzLHRoaXMuZ2V0Q2hpbGRDb250ZXh0PWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHRoaXMuY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXt1PW51bGx9LHRoaXMuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKG4pe3RoaXMucHJvcHMudmFsdWUhPW4udmFsdWUmJnUuZm9yRWFjaChmdW5jdGlvbihuKXtuLl9fZT0hMCwkKG4pfSl9LHRoaXMuc3ViPWZ1bmN0aW9uKG4pe3UuYWRkKG4pO3ZhciBsPW4uY29tcG9uZW50V2lsbFVubW91bnQ7bi5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe3UmJnUuZGVsZXRlKG4pLGwmJmwuY2FsbChuKX19KSxuLmNoaWxkcmVufXJldHVybiBsLl9fYz1cIl9fY0NcIitoKyssbC5fXz1uLGwuUHJvdmlkZXI9bC5fX2w9KGwuQ29uc3VtZXI9ZnVuY3Rpb24obixsKXtyZXR1cm4gbi5jaGlsZHJlbihsKX0pLmNvbnRleHRUeXBlPWwsbH1uPXYuc2xpY2UsbD17X19lOmZ1bmN0aW9uKG4sbCx1LHQpe2Zvcih2YXIgaSxyLG87bD1sLl9fOylpZigoaT1sLl9fYykmJiFpLl9fKXRyeXtpZigocj1pLmNvbnN0cnVjdG9yKSYmbnVsbCE9ci5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3ImJihpLnNldFN0YXRlKHIuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yKG4pKSxvPWkuX19kKSxudWxsIT1pLmNvbXBvbmVudERpZENhdGNoJiYoaS5jb21wb25lbnREaWRDYXRjaChuLHR8fHt9KSxvPWkuX19kKSxvKXJldHVybiBpLl9fRT1pfWNhdGNoKGwpe249bH10aHJvdyBufX0sdT0wLHQ9ZnVuY3Rpb24obil7cmV0dXJuIG51bGwhPW4mJnZvaWQgMD09PW4uY29uc3RydWN0b3J9LHgucHJvdG90eXBlLnNldFN0YXRlPWZ1bmN0aW9uKG4sbCl7dmFyIHU7dT1udWxsIT10aGlzLl9fcyYmdGhpcy5fX3MhPXRoaXMuc3RhdGU/dGhpcy5fX3M6dGhpcy5fX3M9dyh7fSx0aGlzLnN0YXRlKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYobj1uKHcoe30sdSksdGhpcy5wcm9wcykpLG4mJncodSxuKSxudWxsIT1uJiZ0aGlzLl9fdiYmKGwmJnRoaXMuX3NiLnB1c2gobCksJCh0aGlzKSl9LHgucHJvdG90eXBlLmZvcmNlVXBkYXRlPWZ1bmN0aW9uKG4pe3RoaXMuX192JiYodGhpcy5fX2U9ITAsbiYmdGhpcy5fX2gucHVzaChuKSwkKHRoaXMpKX0seC5wcm90b3R5cGUucmVuZGVyPWssaT1bXSxvPVwiZnVuY3Rpb25cIj09dHlwZW9mIFByb21pc2U/UHJvbWlzZS5wcm90b3R5cGUudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKTpzZXRUaW1lb3V0LGU9ZnVuY3Rpb24obixsKXtyZXR1cm4gbi5fX3YuX19iLWwuX192Ll9fYn0sSS5fX3I9MCxmPS8oUG9pbnRlckNhcHR1cmUpJHxDYXB0dXJlJC9pLGM9MCxzPU8oITEpLGE9TyghMCksaD0wO2V4cG9ydHt4IGFzIENvbXBvbmVudCxrIGFzIEZyYWdtZW50LFEgYXMgY2xvbmVFbGVtZW50LFIgYXMgY3JlYXRlQ29udGV4dCxfIGFzIGNyZWF0ZUVsZW1lbnQsYiBhcyBjcmVhdGVSZWYsXyBhcyBoLEsgYXMgaHlkcmF0ZSx0IGFzIGlzVmFsaWRFbGVtZW50LGwgYXMgb3B0aW9ucyxKIGFzIHJlbmRlcixMIGFzIHRvQ2hpbGRBcnJheX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3QubW9kdWxlLmpzLm1hcFxuIiwKICAgICJpbXBvcnR7b3B0aW9ucyBhcyBufWZyb21cInByZWFjdFwiO3ZhciB0LHIsdSxpLG89MCxmPVtdLGM9bixlPWMuX19iLGE9Yy5fX3Isdj1jLmRpZmZlZCxsPWMuX19jLG09Yy51bm1vdW50LHM9Yy5fXztmdW5jdGlvbiBwKG4sdCl7Yy5fX2gmJmMuX19oKHIsbixvfHx0KSxvPTA7dmFyIHU9ci5fX0h8fChyLl9fSD17X186W10sX19oOltdfSk7cmV0dXJuIG4+PXUuX18ubGVuZ3RoJiZ1Ll9fLnB1c2goe30pLHUuX19bbl19ZnVuY3Rpb24gZChuKXtyZXR1cm4gbz0xLGgoRCxuKX1mdW5jdGlvbiBoKG4sdSxpKXt2YXIgbz1wKHQrKywyKTtpZihvLnQ9biwhby5fX2MmJihvLl9fPVtpP2kodSk6RCh2b2lkIDAsdSksZnVuY3Rpb24obil7dmFyIHQ9by5fX04/by5fX05bMF06by5fX1swXSxyPW8udCh0LG4pO3QhPT1yJiYoby5fX049W3Isby5fX1sxXV0sby5fX2Muc2V0U3RhdGUoe30pKX1dLG8uX19jPXIsIXIuX19mKSl7dmFyIGY9ZnVuY3Rpb24obix0LHIpe2lmKCFvLl9fYy5fX0gpcmV0dXJuITA7dmFyIHU9by5fX2MuX19ILl9fLmZpbHRlcihmdW5jdGlvbihuKXtyZXR1cm4gbi5fX2N9KTtpZih1LmV2ZXJ5KGZ1bmN0aW9uKG4pe3JldHVybiFuLl9fTn0pKXJldHVybiFjfHxjLmNhbGwodGhpcyxuLHQscik7dmFyIGk9by5fX2MucHJvcHMhPT1uO3JldHVybiB1LnNvbWUoZnVuY3Rpb24obil7aWYobi5fX04pe3ZhciB0PW4uX19bMF07bi5fXz1uLl9fTixuLl9fTj12b2lkIDAsdCE9PW4uX19bMF0mJihpPSEwKX19KSxjJiZjLmNhbGwodGhpcyxuLHQscil8fGl9O3IuX19mPSEwO3ZhciBjPXIuc2hvdWxkQ29tcG9uZW50VXBkYXRlLGU9ci5jb21wb25lbnRXaWxsVXBkYXRlO3IuY29tcG9uZW50V2lsbFVwZGF0ZT1mdW5jdGlvbihuLHQscil7aWYodGhpcy5fX2Upe3ZhciB1PWM7Yz12b2lkIDAsZihuLHQsciksYz11fWUmJmUuY2FsbCh0aGlzLG4sdCxyKX0sci5zaG91bGRDb21wb25lbnRVcGRhdGU9Zn1yZXR1cm4gby5fX058fG8uX199ZnVuY3Rpb24geShuLHUpe3ZhciBpPXAodCsrLDMpOyFjLl9fcyYmQyhpLl9fSCx1KSYmKGkuX189bixpLnU9dSxyLl9fSC5fX2gucHVzaChpKSl9ZnVuY3Rpb24gXyhuLHUpe3ZhciBpPXAodCsrLDQpOyFjLl9fcyYmQyhpLl9fSCx1KSYmKGkuX189bixpLnU9dSxyLl9faC5wdXNoKGkpKX1mdW5jdGlvbiBBKG4pe3JldHVybiBvPTUsVChmdW5jdGlvbigpe3JldHVybntjdXJyZW50Om59fSxbXSl9ZnVuY3Rpb24gRihuLHQscil7bz02LF8oZnVuY3Rpb24oKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBuKXt2YXIgcj1uKHQoKSk7cmV0dXJuIGZ1bmN0aW9uKCl7bihudWxsKSxyJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiByJiZyKCl9fWlmKG4pcmV0dXJuIG4uY3VycmVudD10KCksZnVuY3Rpb24oKXtyZXR1cm4gbi5jdXJyZW50PW51bGx9fSxudWxsPT1yP3I6ci5jb25jYXQobikpfWZ1bmN0aW9uIFQobixyKXt2YXIgdT1wKHQrKyw3KTtyZXR1cm4gQyh1Ll9fSCxyKSYmKHUuX189bigpLHUuX19IPXIsdS5fX2g9biksdS5fX31mdW5jdGlvbiBxKG4sdCl7cmV0dXJuIG89OCxUKGZ1bmN0aW9uKCl7cmV0dXJuIG59LHQpfWZ1bmN0aW9uIHgobil7dmFyIHU9ci5jb250ZXh0W24uX19jXSxpPXAodCsrLDkpO3JldHVybiBpLmM9bix1PyhudWxsPT1pLl9fJiYoaS5fXz0hMCx1LnN1YihyKSksdS5wcm9wcy52YWx1ZSk6bi5fX31mdW5jdGlvbiBQKG4sdCl7Yy51c2VEZWJ1Z1ZhbHVlJiZjLnVzZURlYnVnVmFsdWUodD90KG4pOm4pfWZ1bmN0aW9uIGIobil7dmFyIHU9cCh0KyssMTApLGk9ZCgpO3JldHVybiB1Ll9fPW4sci5jb21wb25lbnREaWRDYXRjaHx8KHIuY29tcG9uZW50RGlkQ2F0Y2g9ZnVuY3Rpb24obix0KXt1Ll9fJiZ1Ll9fKG4sdCksaVsxXShuKX0pLFtpWzBdLGZ1bmN0aW9uKCl7aVsxXSh2b2lkIDApfV19ZnVuY3Rpb24gZygpe3ZhciBuPXAodCsrLDExKTtpZighbi5fXyl7Zm9yKHZhciB1PXIuX192O251bGwhPT11JiYhdS5fX20mJm51bGwhPT11Ll9fOyl1PXUuX187dmFyIGk9dS5fX218fCh1Ll9fbT1bMCwwXSk7bi5fXz1cIlBcIitpWzBdK1wiLVwiK2lbMV0rK31yZXR1cm4gbi5fX31mdW5jdGlvbiBqKCl7Zm9yKHZhciBuO249Zi5zaGlmdCgpOyl7dmFyIHQ9bi5fX0g7aWYobi5fX1AmJnQpdHJ5e3QuX19oLnNvbWUoeiksdC5fX2guc29tZShCKSx0Ll9faD1bXX1jYXRjaChyKXt0Ll9faD1bXSxjLl9fZShyLG4uX192KX19fWMuX19iPWZ1bmN0aW9uKG4pe3I9bnVsbCxlJiZlKG4pfSxjLl9fPWZ1bmN0aW9uKG4sdCl7biYmdC5fX2smJnQuX19rLl9fbSYmKG4uX19tPXQuX19rLl9fbSkscyYmcyhuLHQpfSxjLl9fcj1mdW5jdGlvbihuKXthJiZhKG4pLHQ9MDt2YXIgaT0ocj1uLl9fYykuX19IO2kmJih1PT09cj8oaS5fX2g9W10sci5fX2g9W10saS5fXy5zb21lKGZ1bmN0aW9uKG4pe24uX19OJiYobi5fXz1uLl9fTiksbi51PW4uX19OPXZvaWQgMH0pKTooaS5fX2guc29tZSh6KSxpLl9faC5zb21lKEIpLGkuX19oPVtdLHQ9MCkpLHU9cn0sYy5kaWZmZWQ9ZnVuY3Rpb24obil7diYmdihuKTt2YXIgdD1uLl9fYzt0JiZ0Ll9fSCYmKHQuX19ILl9faC5sZW5ndGgmJigxIT09Zi5wdXNoKHQpJiZpPT09Yy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fCgoaT1jLnJlcXVlc3RBbmltYXRpb25GcmFtZSl8fHcpKGopKSx0Ll9fSC5fXy5zb21lKGZ1bmN0aW9uKG4pe24udSYmKG4uX19IPW4udSksbi51PXZvaWQgMH0pKSx1PXI9bnVsbH0sYy5fX2M9ZnVuY3Rpb24obix0KXt0LnNvbWUoZnVuY3Rpb24obil7dHJ5e24uX19oLnNvbWUoeiksbi5fX2g9bi5fX2guZmlsdGVyKGZ1bmN0aW9uKG4pe3JldHVybiFuLl9ffHxCKG4pfSl9Y2F0Y2gocil7dC5zb21lKGZ1bmN0aW9uKG4pe24uX19oJiYobi5fX2g9W10pfSksdD1bXSxjLl9fZShyLG4uX192KX19KSxsJiZsKG4sdCl9LGMudW5tb3VudD1mdW5jdGlvbihuKXttJiZtKG4pO3ZhciB0LHI9bi5fX2M7ciYmci5fX0gmJihyLl9fSC5fXy5zb21lKGZ1bmN0aW9uKG4pe3RyeXt6KG4pfWNhdGNoKG4pe3Q9bn19KSxyLl9fSD12b2lkIDAsdCYmYy5fX2UodCxyLl9fdikpfTt2YXIgaz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ZnVuY3Rpb24gdyhuKXt2YXIgdCxyPWZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHUpLGsmJmNhbmNlbEFuaW1hdGlvbkZyYW1lKHQpLHNldFRpbWVvdXQobil9LHU9c2V0VGltZW91dChyLDM1KTtrJiYodD1yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocikpfWZ1bmN0aW9uIHoobil7dmFyIHQ9cix1PW4uX19jO1wiZnVuY3Rpb25cIj09dHlwZW9mIHUmJihuLl9fYz12b2lkIDAsdSgpKSxyPXR9ZnVuY3Rpb24gQihuKXt2YXIgdD1yO24uX19jPW4uX18oKSxyPXR9ZnVuY3Rpb24gQyhuLHQpe3JldHVybiFufHxuLmxlbmd0aCE9PXQubGVuZ3RofHx0LnNvbWUoZnVuY3Rpb24odCxyKXtyZXR1cm4gdCE9PW5bcl19KX1mdW5jdGlvbiBEKG4sdCl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgdD90KG4pOnR9ZXhwb3J0e3EgYXMgdXNlQ2FsbGJhY2sseCBhcyB1c2VDb250ZXh0LFAgYXMgdXNlRGVidWdWYWx1ZSx5IGFzIHVzZUVmZmVjdCxiIGFzIHVzZUVycm9yQm91bmRhcnksZyBhcyB1c2VJZCxGIGFzIHVzZUltcGVyYXRpdmVIYW5kbGUsXyBhcyB1c2VMYXlvdXRFZmZlY3QsVCBhcyB1c2VNZW1vLGggYXMgdXNlUmVkdWNlcixBIGFzIHVzZVJlZixkIGFzIHVzZVN0YXRlfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhvb2tzLm1vZHVsZS5qcy5tYXBcbiIsCiAgICAidmFyIGk9U3ltYm9sLmZvcihcInByZWFjdC1zaWduYWxzXCIpO2Z1bmN0aW9uIHQoKXtpZighKHM+MSkpe3ZhciBpLHQ9ITE7d2hpbGUodm9pZCAwIT09aCl7dmFyIG49aDtoPXZvaWQgMDt2Kys7d2hpbGUodm9pZCAwIT09bil7dmFyIHI9bi5vO24ubz12b2lkIDA7bi5mJj0tMztpZighKDgmbi5mKSYmYShuKSl0cnl7bi5jKCl9Y2F0Y2gobil7aWYoIXQpe2k9bjt0PSEwfX1uPXJ9fXY9MDtzLS07aWYodCl0aHJvdyBpfWVsc2Ugcy0tfWZ1bmN0aW9uIG4oaSl7aWYocz4wKXJldHVybiBpKCk7cysrO3RyeXtyZXR1cm4gaSgpfWZpbmFsbHl7dCgpfX12YXIgcj12b2lkIDA7ZnVuY3Rpb24gbyhpKXt2YXIgdD1yO3I9dm9pZCAwO3RyeXtyZXR1cm4gaSgpfWZpbmFsbHl7cj10fX12YXIgZixoPXZvaWQgMCxzPTAsdj0wLHU9MDtmdW5jdGlvbiBlKGkpe2lmKHZvaWQgMCE9PXIpe3ZhciB0PWkubjtpZih2b2lkIDA9PT10fHx0LnQhPT1yKXt0PXtpOjAsUzppLHA6ci5zLG46dm9pZCAwLHQ6cixlOnZvaWQgMCx4OnZvaWQgMCxyOnR9O2lmKHZvaWQgMCE9PXIucylyLnMubj10O3Iucz10O2kubj10O2lmKDMyJnIuZilpLlModCk7cmV0dXJuIHR9ZWxzZSBpZigtMT09PXQuaSl7dC5pPTA7aWYodm9pZCAwIT09dC5uKXt0Lm4ucD10LnA7aWYodm9pZCAwIT09dC5wKXQucC5uPXQubjt0LnA9ci5zO3Qubj12b2lkIDA7ci5zLm49dDtyLnM9dH1yZXR1cm4gdH19fWZ1bmN0aW9uIGQoaSx0KXt0aGlzLnY9aTt0aGlzLmk9MDt0aGlzLm49dm9pZCAwO3RoaXMudD12b2lkIDA7dGhpcy5XPW51bGw9PXQ/dm9pZCAwOnQud2F0Y2hlZDt0aGlzLlo9bnVsbD09dD92b2lkIDA6dC51bndhdGNoZWQ7dGhpcy5uYW1lPW51bGw9PXQ/dm9pZCAwOnQubmFtZX1kLnByb3RvdHlwZS5icmFuZD1pO2QucHJvdG90eXBlLmg9ZnVuY3Rpb24oKXtyZXR1cm4hMH07ZC5wcm90b3R5cGUuUz1mdW5jdGlvbihpKXt2YXIgdD10aGlzLG49dGhpcy50O2lmKG4hPT1pJiZ2b2lkIDA9PT1pLmUpe2kueD1uO3RoaXMudD1pO2lmKHZvaWQgMCE9PW4pbi5lPWk7ZWxzZSBvKGZ1bmN0aW9uKCl7dmFyIGk7bnVsbD09KGk9dC5XKXx8aS5jYWxsKHQpfSl9fTtkLnByb3RvdHlwZS5VPWZ1bmN0aW9uKGkpe3ZhciB0PXRoaXM7aWYodm9pZCAwIT09dGhpcy50KXt2YXIgbj1pLmUscj1pLng7aWYodm9pZCAwIT09bil7bi54PXI7aS5lPXZvaWQgMH1pZih2b2lkIDAhPT1yKXtyLmU9bjtpLng9dm9pZCAwfWlmKGk9PT10aGlzLnQpe3RoaXMudD1yO2lmKHZvaWQgMD09PXIpbyhmdW5jdGlvbigpe3ZhciBpO251bGw9PShpPXQuWil8fGkuY2FsbCh0KX0pfX19O2QucHJvdG90eXBlLnN1YnNjcmliZT1mdW5jdGlvbihpKXt2YXIgdD10aGlzO3JldHVybiBtKGZ1bmN0aW9uKCl7dmFyIG49dC52YWx1ZSxvPXI7cj12b2lkIDA7dHJ5e2kobil9ZmluYWxseXtyPW99fSx7bmFtZTpcInN1YlwifSl9O2QucHJvdG90eXBlLnZhbHVlT2Y9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy52YWx1ZX07ZC5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy52YWx1ZStcIlwifTtkLnByb3RvdHlwZS50b0pTT049ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy52YWx1ZX07ZC5wcm90b3R5cGUucGVlaz1mdW5jdGlvbigpe3ZhciBpPXI7cj12b2lkIDA7dHJ5e3JldHVybiB0aGlzLnZhbHVlfWZpbmFsbHl7cj1pfX07T2JqZWN0LmRlZmluZVByb3BlcnR5KGQucHJvdG90eXBlLFwidmFsdWVcIix7Z2V0OmZ1bmN0aW9uKCl7dmFyIGk9ZSh0aGlzKTtpZih2b2lkIDAhPT1pKWkuaT10aGlzLmk7cmV0dXJuIHRoaXMudn0sc2V0OmZ1bmN0aW9uKGkpe2lmKGkhPT10aGlzLnYpe2lmKHY+MTAwKXRocm93IG5ldyBFcnJvcihcIkN5Y2xlIGRldGVjdGVkXCIpO3RoaXMudj1pO3RoaXMuaSsrO3UrKztzKys7dHJ5e2Zvcih2YXIgbj10aGlzLnQ7dm9pZCAwIT09bjtuPW4ueCluLnQuTigpfWZpbmFsbHl7dCgpfX19fSk7ZnVuY3Rpb24gYyhpLHQpe3JldHVybiBuZXcgZChpLHQpfWZ1bmN0aW9uIGEoaSl7Zm9yKHZhciB0PWkuczt2b2lkIDAhPT10O3Q9dC5uKWlmKHQuUy5pIT09dC5pfHwhdC5TLmgoKXx8dC5TLmkhPT10LmkpcmV0dXJuITA7cmV0dXJuITF9ZnVuY3Rpb24gbChpKXtmb3IodmFyIHQ9aS5zO3ZvaWQgMCE9PXQ7dD10Lm4pe3ZhciBuPXQuUy5uO2lmKHZvaWQgMCE9PW4pdC5yPW47dC5TLm49dDt0Lmk9LTE7aWYodm9pZCAwPT09dC5uKXtpLnM9dDticmVha319fWZ1bmN0aW9uIHkoaSl7dmFyIHQ9aS5zLG49dm9pZCAwO3doaWxlKHZvaWQgMCE9PXQpe3ZhciByPXQucDtpZigtMT09PXQuaSl7dC5TLlUodCk7aWYodm9pZCAwIT09cilyLm49dC5uO2lmKHZvaWQgMCE9PXQubil0Lm4ucD1yfWVsc2Ugbj10O3QuUy5uPXQucjtpZih2b2lkIDAhPT10LnIpdC5yPXZvaWQgMDt0PXJ9aS5zPW59ZnVuY3Rpb24gdyhpLHQpe2QuY2FsbCh0aGlzLHZvaWQgMCk7dGhpcy54PWk7dGhpcy5zPXZvaWQgMDt0aGlzLmc9dS0xO3RoaXMuZj00O3RoaXMuVz1udWxsPT10P3ZvaWQgMDp0LndhdGNoZWQ7dGhpcy5aPW51bGw9PXQ/dm9pZCAwOnQudW53YXRjaGVkO3RoaXMubmFtZT1udWxsPT10P3ZvaWQgMDp0Lm5hbWV9dy5wcm90b3R5cGU9bmV3IGQ7dy5wcm90b3R5cGUuaD1mdW5jdGlvbigpe3RoaXMuZiY9LTM7aWYoMSZ0aGlzLmYpcmV0dXJuITE7aWYoMzI9PSgzNiZ0aGlzLmYpKXJldHVybiEwO3RoaXMuZiY9LTU7aWYodGhpcy5nPT09dSlyZXR1cm4hMDt0aGlzLmc9dTt0aGlzLmZ8PTE7aWYodGhpcy5pPjAmJiFhKHRoaXMpKXt0aGlzLmYmPS0yO3JldHVybiEwfXZhciBpPXI7dHJ5e2wodGhpcyk7cj10aGlzO3ZhciB0PXRoaXMueCgpO2lmKDE2JnRoaXMuZnx8dGhpcy52IT09dHx8MD09PXRoaXMuaSl7dGhpcy52PXQ7dGhpcy5mJj0tMTc7dGhpcy5pKyt9fWNhdGNoKGkpe3RoaXMudj1pO3RoaXMuZnw9MTY7dGhpcy5pKyt9cj1pO3kodGhpcyk7dGhpcy5mJj0tMjtyZXR1cm4hMH07dy5wcm90b3R5cGUuUz1mdW5jdGlvbihpKXtpZih2b2lkIDA9PT10aGlzLnQpe3RoaXMuZnw9MzY7Zm9yKHZhciB0PXRoaXMuczt2b2lkIDAhPT10O3Q9dC5uKXQuUy5TKHQpfWQucHJvdG90eXBlLlMuY2FsbCh0aGlzLGkpfTt3LnByb3RvdHlwZS5VPWZ1bmN0aW9uKGkpe2lmKHZvaWQgMCE9PXRoaXMudCl7ZC5wcm90b3R5cGUuVS5jYWxsKHRoaXMsaSk7aWYodm9pZCAwPT09dGhpcy50KXt0aGlzLmYmPS0zMztmb3IodmFyIHQ9dGhpcy5zO3ZvaWQgMCE9PXQ7dD10Lm4pdC5TLlUodCl9fX07dy5wcm90b3R5cGUuTj1mdW5jdGlvbigpe2lmKCEoMiZ0aGlzLmYpKXt0aGlzLmZ8PTY7Zm9yKHZhciBpPXRoaXMudDt2b2lkIDAhPT1pO2k9aS54KWkudC5OKCl9fTtPYmplY3QuZGVmaW5lUHJvcGVydHkody5wcm90b3R5cGUsXCJ2YWx1ZVwiLHtnZXQ6ZnVuY3Rpb24oKXtpZigxJnRoaXMuZil0aHJvdyBuZXcgRXJyb3IoXCJDeWNsZSBkZXRlY3RlZFwiKTt2YXIgaT1lKHRoaXMpO3RoaXMuaCgpO2lmKHZvaWQgMCE9PWkpaS5pPXRoaXMuaTtpZigxNiZ0aGlzLmYpdGhyb3cgdGhpcy52O3JldHVybiB0aGlzLnZ9fSk7ZnVuY3Rpb24gYihpLHQpe3JldHVybiBuZXcgdyhpLHQpfWZ1bmN0aW9uIF8oaSl7dmFyIG49aS51O2kudT12b2lkIDA7aWYoXCJmdW5jdGlvblwiPT10eXBlb2Ygbil7cysrO3ZhciBvPXI7cj12b2lkIDA7dHJ5e24oKX1jYXRjaCh0KXtpLmYmPS0yO2kuZnw9ODtwKGkpO3Rocm93IHR9ZmluYWxseXtyPW87dCgpfX19ZnVuY3Rpb24gcChpKXtmb3IodmFyIHQ9aS5zO3ZvaWQgMCE9PXQ7dD10Lm4pdC5TLlUodCk7aS54PXZvaWQgMDtpLnM9dm9pZCAwO18oaSl9ZnVuY3Rpb24gZyhpKXtpZihyIT09dGhpcyl0aHJvdyBuZXcgRXJyb3IoXCJPdXQtb2Ytb3JkZXIgZWZmZWN0XCIpO3kodGhpcyk7cj1pO3RoaXMuZiY9LTI7aWYoOCZ0aGlzLmYpcCh0aGlzKTt0KCl9ZnVuY3Rpb24gUyhpLHQpe3RoaXMueD1pO3RoaXMudT12b2lkIDA7dGhpcy5zPXZvaWQgMDt0aGlzLm89dm9pZCAwO3RoaXMuZj0zMjt0aGlzLm5hbWU9bnVsbD09dD92b2lkIDA6dC5uYW1lO2lmKGYpZi5wdXNoKHRoaXMpfVMucHJvdG90eXBlLmM9ZnVuY3Rpb24oKXt2YXIgaT10aGlzLlMoKTt0cnl7aWYoOCZ0aGlzLmYpcmV0dXJuO2lmKHZvaWQgMD09PXRoaXMueClyZXR1cm47dmFyIHQ9dGhpcy54KCk7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgdCl0aGlzLnU9dH1maW5hbGx5e2koKX19O1MucHJvdG90eXBlLlM9ZnVuY3Rpb24oKXtpZigxJnRoaXMuZil0aHJvdyBuZXcgRXJyb3IoXCJDeWNsZSBkZXRlY3RlZFwiKTt0aGlzLmZ8PTE7dGhpcy5mJj0tOTtfKHRoaXMpO2wodGhpcyk7cysrO3ZhciBpPXI7cj10aGlzO3JldHVybiBnLmJpbmQodGhpcyxpKX07Uy5wcm90b3R5cGUuTj1mdW5jdGlvbigpe2lmKCEoMiZ0aGlzLmYpKXt0aGlzLmZ8PTI7dGhpcy5vPWg7aD10aGlzfX07Uy5wcm90b3R5cGUuZD1mdW5jdGlvbigpe3RoaXMuZnw9ODtpZighKDEmdGhpcy5mKSlwKHRoaXMpfTtTLnByb3RvdHlwZS5kaXNwb3NlPWZ1bmN0aW9uKCl7dGhpcy5kKCl9O2Z1bmN0aW9uIG0oaSx0KXt2YXIgbj1uZXcgUyhpLHQpO3RyeXtuLmMoKX1jYXRjaChpKXtuLmQoKTt0aHJvdyBpfXZhciByPW4uZC5iaW5kKG4pO3JbU3ltYm9sLmRpc3Bvc2VdPXI7cmV0dXJuIHJ9ZnVuY3Rpb24gRShpKXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgdD1hcmd1bWVudHMscj10aGlzO3JldHVybiBuKGZ1bmN0aW9uKCl7cmV0dXJuIG8oZnVuY3Rpb24oKXtyZXR1cm4gaS5hcHBseShyLFtdLnNsaWNlLmNhbGwodCkpfSl9KX19ZnVuY3Rpb24geCgpe3ZhciBpPWY7Zj1bXTtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgdD1mO2lmKGYmJmkpaT1pLmNvbmNhdChmKTtmPWk7cmV0dXJuIHR9fWZ1bmN0aW9uIEMoaSl7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIHQsbixyPXgoKTt0cnl7bj1pLmFwcGx5KHZvaWQgMCxbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykpfWNhdGNoKGkpe2Y9dm9pZCAwO3Rocm93IGl9ZmluYWxseXt0PXIoKX1mb3IodmFyIG8gaW4gbilpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBuW29dKW5bb109RShuW29dKTtuW1N5bWJvbC5kaXNwb3NlXT1FKGZ1bmN0aW9uKCl7aWYodClmb3IodmFyIGk9MDtpPHQubGVuZ3RoO2krKyl0W2ldLmRpc3Bvc2UoKTt0PXZvaWQgMH0pO3JldHVybiBufX1leHBvcnR7dyBhcyBDb21wdXRlZCxTIGFzIEVmZmVjdCxkIGFzIFNpZ25hbCxFIGFzIGFjdGlvbixuIGFzIGJhdGNoLGIgYXMgY29tcHV0ZWQsQyBhcyBjcmVhdGVNb2RlbCxtIGFzIGVmZmVjdCxjIGFzIHNpZ25hbCxvIGFzIHVudHJhY2tlZH07Ly8jIHNvdXJjZU1hcHBpbmdVUkw9c2lnbmFscy1jb3JlLm1vZHVsZS5qcy5tYXBcbiIsCiAgICAiaW1wb3J0e0NvbXBvbmVudCBhcyBpLG9wdGlvbnMgYXMgcixpc1ZhbGlkRWxlbWVudCBhcyBufWZyb21cInByZWFjdFwiO2ltcG9ydHt1c2VNZW1vIGFzIHQsdXNlUmVmIGFzIGYsdXNlRWZmZWN0IGFzIG99ZnJvbVwicHJlYWN0L2hvb2tzXCI7aW1wb3J0e1NpZ25hbCBhcyBlLGNvbXB1dGVkIGFzIHUsc2lnbmFsIGFzIGEsZWZmZWN0IGFzIGN9ZnJvbVwiQHByZWFjdC9zaWduYWxzLWNvcmVcIjtleHBvcnR7U2lnbmFsLGJhdGNoLGNvbXB1dGVkLGVmZmVjdCxzaWduYWwsdW50cmFja2VkfWZyb21cIkBwcmVhY3Qvc2lnbmFscy1jb3JlXCI7dmFyIHYscztmdW5jdGlvbiBsKGksbil7cltpXT1uLmJpbmQobnVsbCxyW2ldfHxmdW5jdGlvbigpe30pfWZ1bmN0aW9uIGQoaSl7aWYocyl7dmFyIHI9cztzPXZvaWQgMDtyKCl9cz1pJiZpLlMoKX1mdW5jdGlvbiBoKGkpe3ZhciByPXRoaXMsZj1pLmRhdGEsbz11c2VTaWduYWwoZik7by52YWx1ZT1mO3ZhciBlPXQoZnVuY3Rpb24oKXt2YXIgaT1yLl9fdjt3aGlsZShpPWkuX18paWYoaS5fX2Mpe2kuX19jLl9fJGZ8PTQ7YnJlYWt9ci5fXyR1LmM9ZnVuY3Rpb24oKXt2YXIgaSx0PXIuX18kdS5TKCksZj1lLnZhbHVlO3QoKTtpZihuKGYpfHwzIT09KG51bGw9PShpPXIuYmFzZSk/dm9pZCAwOmkubm9kZVR5cGUpKXtyLl9fJGZ8PTE7ci5zZXRTdGF0ZSh7fSl9ZWxzZSByLmJhc2UuZGF0YT1mfTtyZXR1cm4gdShmdW5jdGlvbigpe3ZhciBpPW8udmFsdWUudmFsdWU7cmV0dXJuIDA9PT1pPzA6ITA9PT1pP1wiXCI6aXx8XCJcIn0pfSxbXSk7cmV0dXJuIGUudmFsdWV9aC5kaXNwbGF5TmFtZT1cIl9zdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGUucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7Y29uZmlndXJhYmxlOiEwLHZhbHVlOnZvaWQgMH0sdHlwZTp7Y29uZmlndXJhYmxlOiEwLHZhbHVlOmh9LHByb3BzOntjb25maWd1cmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJue2RhdGE6dGhpc319fSxfX2I6e2NvbmZpZ3VyYWJsZTohMCx2YWx1ZToxfX0pO2woXCJfX2JcIixmdW5jdGlvbihpLHIpe2lmKFwic3RyaW5nXCI9PXR5cGVvZiByLnR5cGUpe3ZhciBuLHQ9ci5wcm9wcztmb3IodmFyIGYgaW4gdClpZihcImNoaWxkcmVuXCIhPT1mKXt2YXIgbz10W2ZdO2lmKG8gaW5zdGFuY2VvZiBlKXtpZighbilyLl9fbnA9bj17fTtuW2ZdPW87dFtmXT1vLnBlZWsoKX19fWkocil9KTtsKFwiX19yXCIsZnVuY3Rpb24oaSxyKXtpKHIpO2QoKTt2YXIgbix0PXIuX19jO2lmKHQpe3QuX18kZiY9LTI7aWYodm9pZCAwPT09KG49dC5fXyR1KSl0Ll9fJHU9bj1mdW5jdGlvbihpKXt2YXIgcjtjKGZ1bmN0aW9uKCl7cj10aGlzfSk7ci5jPWZ1bmN0aW9uKCl7dC5fXyRmfD0xO3Quc2V0U3RhdGUoe30pfTtyZXR1cm4gcn0oKX12PXQ7ZChuKX0pO2woXCJfX2VcIixmdW5jdGlvbihpLHIsbix0KXtkKCk7dj12b2lkIDA7aShyLG4sdCl9KTtsKFwiZGlmZmVkXCIsZnVuY3Rpb24oaSxyKXtkKCk7dj12b2lkIDA7dmFyIG47aWYoXCJzdHJpbmdcIj09dHlwZW9mIHIudHlwZSYmKG49ci5fX2UpKXt2YXIgdD1yLl9fbnAsZj1yLnByb3BzO2lmKHQpe3ZhciBvPW4uVTtpZihvKWZvcih2YXIgZSBpbiBvKXt2YXIgdT1vW2VdO2lmKHZvaWQgMCE9PXUmJiEoZSBpbiB0KSl7dS5kKCk7b1tlXT12b2lkIDB9fWVsc2Ugbi5VPW89e307Zm9yKHZhciBhIGluIHQpe3ZhciBjPW9bYV0scz10W2FdO2lmKHZvaWQgMD09PWMpe2M9cChuLGEscyxmKTtvW2FdPWN9ZWxzZSBjLm8ocyxmKX19fWkocil9KTtmdW5jdGlvbiBwKGkscixuLHQpe3ZhciBmPXIgaW4gaSYmdm9pZCAwPT09aS5vd25lclNWR0VsZW1lbnQsbz1hKG4pO3JldHVybntvOmZ1bmN0aW9uKGkscil7by52YWx1ZT1pO3Q9cn0sZDpjKGZ1bmN0aW9uKCl7dmFyIG49by52YWx1ZS52YWx1ZTtpZih0W3JdIT09bil7dFtyXT1uO2lmKGYpaVtyXT1uO2Vsc2UgaWYobilpLnNldEF0dHJpYnV0ZShyLG4pO2Vsc2UgaS5yZW1vdmVBdHRyaWJ1dGUocil9fSl9fWwoXCJ1bm1vdW50XCIsZnVuY3Rpb24oaSxyKXtpZihcInN0cmluZ1wiPT10eXBlb2Ygci50eXBlKXt2YXIgbj1yLl9fZTtpZihuKXt2YXIgdD1uLlU7aWYodCl7bi5VPXZvaWQgMDtmb3IodmFyIGYgaW4gdCl7dmFyIG89dFtmXTtpZihvKW8uZCgpfX19fWVsc2V7dmFyIGU9ci5fX2M7aWYoZSl7dmFyIHU9ZS5fXyR1O2lmKHUpe2UuX18kdT12b2lkIDA7dS5kKCl9fX1pKHIpfSk7bChcIl9faFwiLGZ1bmN0aW9uKGkscixuLHQpe2lmKHQ8M3x8OT09PXQpci5fXyRmfD0yO2kocixuLHQpfSk7aS5wcm90b3R5cGUuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ1bmN0aW9uKGkscil7aWYodGhpcy5fX1IpcmV0dXJuITA7dmFyIG49dGhpcy5fXyR1LHQ9biYmdm9pZCAwIT09bi5zO2Zvcih2YXIgZiBpbiByKXJldHVybiEwO2lmKHRoaXMuX19mfHxcImJvb2xlYW5cIj09dHlwZW9mIHRoaXMudSYmITA9PT10aGlzLnUpe2lmKCEodHx8MiZ0aGlzLl9fJGZ8fDQmdGhpcy5fXyRmKSlyZXR1cm4hMDtpZigxJnRoaXMuX18kZilyZXR1cm4hMH1lbHNle2lmKCEodHx8NCZ0aGlzLl9fJGYpKXJldHVybiEwO2lmKDMmdGhpcy5fXyRmKXJldHVybiEwfWZvcih2YXIgbyBpbiBpKWlmKFwiX19zb3VyY2VcIiE9PW8mJmlbb10hPT10aGlzLnByb3BzW29dKXJldHVybiEwO2Zvcih2YXIgZSBpbiB0aGlzLnByb3BzKWlmKCEoZSBpbiBpKSlyZXR1cm4hMDtyZXR1cm4hMX07ZnVuY3Rpb24gdXNlU2lnbmFsKGkpe3JldHVybiB0KGZ1bmN0aW9uKCl7cmV0dXJuIGEoaSl9LFtdKX1mdW5jdGlvbiB1c2VDb21wdXRlZChpKXt2YXIgcj1mKGkpO3IuY3VycmVudD1pO3YuX18kZnw9NDtyZXR1cm4gdChmdW5jdGlvbigpe3JldHVybiB1KGZ1bmN0aW9uKCl7cmV0dXJuIHIuY3VycmVudCgpfSl9LFtdKX1mdW5jdGlvbiB1c2VTaWduYWxFZmZlY3QoaSl7dmFyIHI9ZihpKTtyLmN1cnJlbnQ9aTtvKGZ1bmN0aW9uKCl7cmV0dXJuIGMoZnVuY3Rpb24oKXtyZXR1cm4gci5jdXJyZW50KCl9KX0sW10pfWV4cG9ydHt1c2VDb21wdXRlZCx1c2VTaWduYWwsdXNlU2lnbmFsRWZmZWN0fTsvLyMgc291cmNlTWFwcGluZ1VSTD1zaWduYWxzLm1vZHVsZS5qcy5tYXBcbiIsCiAgICAiaW1wb3J0IHsgc2lnbmFsIH0gZnJvbSAnQHByZWFjdC9zaWduYWxzJztcbmltcG9ydCB0eXBlIHtcbiAgQXBwU3RhdGUsIEJsb2NrLCBOb3RlYm9vaywgU2VjdGlvbiwgUGFnZSwgT3AsIFJlY2VudE5vdGVib29rLFxuICBDbGF1ZGVDaGF0U3RhdGUsIERpc3BsYXlQYW5lbFN0YXRlLCBDaGF0TWVzc2FnZSwgQ2hlY2tsaXN0SXRlbSxcbiAgUGFnZVZpZXdDb25maWcsIFVpUG9zaXRpb24sIEFwcENvbmZpZywgQ2xhdWRlU3RyZWFtRGF0YSwgRGlzcGxheUNvbW1hbmQsXG4gIFBhZ2VUcmVlTm9kZSwgTm90ZWJvb2tBUEksIEJsb2JNZXRhLFxufSBmcm9tICcuL3R5cGVzLnRzJztcblxuZXhwb3J0IGNvbnN0IHVpZCA9ICgpOiBzdHJpbmcgPT4gY3J5cHRvLnJhbmRvbVVVSUQoKTtcblxuLy8g4pSA4pSA4pSAIERlZmF1bHQgY29uc3RydWN0b3JzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5mdW5jdGlvbiBta0Jsb2NrKHggPSAwLCB5ID0gMCwgdyA9IDQ4MCk6IEJsb2NrIHtcbiAgcmV0dXJuIHsgaWQ6IHVpZCgpLCB4LCB5LCB3LCBodG1sOiAnJywgdHlwZTogJ3RleHQnIH07XG59XG5cbmZ1bmN0aW9uIG1rUGFnZSh0aXRsZSA9ICdVbnRpdGxlZCBQYWdlJyk6IFBhZ2Uge1xuICByZXR1cm4geyBpZDogdWlkKCksIHRpdGxlLCBjaGlsZHJlbjogW10sIGJsb2NrczogW10sIHBhblg6IDAsIHBhblk6IDAsIHpvb206IDEsIGNyZWF0ZWRBdDogRGF0ZS5ub3coKSB9O1xufVxuXG5mdW5jdGlvbiBta1NlY3Rpb24odGl0bGUgPSAnTmV3IFNlY3Rpb24nKTogU2VjdGlvbiB7XG4gIHJldHVybiB7IGlkOiB1aWQoKSwgdGl0bGUsIHBhZ2VzOiBbbWtQYWdlKCldIH07XG59XG5cbmZ1bmN0aW9uIG1rTm90ZWJvb2sodGl0bGUgPSAnTXkgTm90ZWJvb2snKTogTm90ZWJvb2sge1xuICBjb25zdCBzZWMgPSBta1NlY3Rpb24oKTtcbiAgcmV0dXJuIHsgaWQ6IHVpZCgpLCB0aXRsZSwgc2VjdGlvbnM6IFtzZWNdIH07XG59XG5cbi8vIOKUgOKUgOKUgCBJUEMgbGF5ZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbmNvbnN0IGhhc0lQQzogYm9vbGVhbiA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmICEhd2luZG93Lm5vdGVib29rO1xuXG5mdW5jdGlvbiBzZW5kT3Aob3A6IE9wKTogdm9pZCB7XG4gIGlmIChoYXNJUEMpIHdpbmRvdy5ub3RlYm9vay5hcHBseU9wKG9wKTtcbn1cblxuZnVuY3Rpb24gc2VuZE9wcyhvcHM6IE9wW10pOiB2b2lkIHtcbiAgaWYgKGhhc0lQQyAmJiBvcHMubGVuZ3RoKSB3aW5kb3cubm90ZWJvb2suYXBwbHlPcHMob3BzKTtcbn1cblxuLy8g4pSA4pSA4pSAIFN0YXRlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5mdW5jdGlvbiBkZWZhdWx0U3RhdGUoKTogQXBwU3RhdGUge1xuICBjb25zdCBuYiA9IG1rTm90ZWJvb2soKTtcbiAgcmV0dXJuIHsgbm90ZWJvb2tzOiBbbmJdLCB1aTogeyBub3RlYm9va0lkOiBuYi5pZCwgc2VjdGlvbklkOiBuYi5zZWN0aW9uc1swXS5pZCwgcGFnZUlkOiBuYi5zZWN0aW9uc1swXS5wYWdlc1swXS5pZCB9IH07XG59XG5cbmV4cG9ydCBjb25zdCBhcHBTdGF0ZSA9IHNpZ25hbDxBcHBTdGF0ZT4oZGVmYXVsdFN0YXRlKCkpO1xuZXhwb3J0IGNvbnN0IGNvbm5lY3RlZCA9IHNpZ25hbDxib29sZWFuPihmYWxzZSk7XG5leHBvcnQgY29uc3QgaW5pdGlhbGl6aW5nID0gc2lnbmFsPGJvb2xlYW4+KHRydWUpOyAvLyB0cnVlIHVudGlsIHdlIGtub3cgd2hldGhlciBhIG5vdGVib29rIHdpbGwgbG9hZFxuZXhwb3J0IGNvbnN0IHNob3dTd2l0Y2hlciA9IHNpZ25hbDxib29sZWFuPihmYWxzZSk7XG5leHBvcnQgY29uc3QgcmVjZW50Tm90ZWJvb2tzID0gc2lnbmFsPFJlY2VudE5vdGVib29rW10+KFtdKTtcbmNvbnN0IGlzRGVza3RvcDogYm9vbGVhbiA9IGhhc0lQQyAmJiAhd2luZG93Lm5vdGVib29rLl9icm93c2VyU2hpbTtcbmZ1bmN0aW9uIGNoZWNrRWRpdFBhcmFtKCk6IGJvb2xlYW4ge1xuICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiBmYWxzZTtcbiAgaWYgKG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCkuZ2V0KCdlZGl0JykgPT09ICdvbicpIHJldHVybiB0cnVlO1xuICBjb25zdCBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2g7XG4gIGlmIChoYXNoLmluY2x1ZGVzKCc/JykpIHtcbiAgICBpZiAobmV3IFVSTFNlYXJjaFBhcmFtcyhoYXNoLnNsaWNlKGhhc2guaW5kZXhPZignPycpICsgMSkpLmdldCgnZWRpdCcpID09PSAnb24nKSByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5leHBvcnQgY29uc3QgZWRpdGluZ0VuYWJsZWQgPSBzaWduYWw8Ym9vbGVhbj4oXG4gIGlzRGVza3RvcCA/IHRydWUgOiBjaGVja0VkaXRQYXJhbSgpXG4pO1xuZXhwb3J0IGNvbnN0IHByZWxvYWRDYWNoZSA9IHNpZ25hbDxNYXA8c3RyaW5nLCBQYWdlPj4obmV3IE1hcCgpKTsgLy8gcGFnZUlkIOKGkiBwYWdlLCBmb3Iga2VlcC1hbGl2ZSBwcmUtcmVuZGVyaW5nXG5cbi8vIFN5bmMgaGFzaCBVUkwgaW4gYnJvd3NlciBtb2RlOiAjIS9TZWN0aW9uVGl0bGUvUGFnZVRpdGxlL1xuZnVuY3Rpb24gc3luY0hhc2hVcmwoKTogdm9pZCB7XG4gIGlmIChpc0Rlc2t0b3ApIHJldHVybjtcbiAgY29uc3QgeyB1aSwgbm90ZWJvb2tzIH0gPSBhcHBTdGF0ZS52YWx1ZTtcbiAgY29uc3QgbmIgPSBub3RlYm9va3MuZmluZChuID0+IG4uaWQgPT09IHVpLm5vdGVib29rSWQpO1xuICBpZiAoIW5iKSByZXR1cm47XG4gIGNvbnN0IHNlYyA9IG5iLnNlY3Rpb25zLmZpbmQocyA9PiBzLmlkID09PSB1aS5zZWN0aW9uSWQpO1xuICBjb25zdCBwYWdlID0gc2VjID8gZmluZEluVHJlZShzZWMucGFnZXMsIHVpLnBhZ2VJZCkgOiBudWxsO1xuICBjb25zdCBwYXJ0cyA9IFsnIyEvJ107XG4gIGlmIChzZWMpIHBhcnRzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KHNlYy50aXRsZSksICcvJyk7XG4gIGlmIChwYWdlKSBwYXJ0cy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChwYWdlLnRpdGxlKSwgJy8nKTtcbiAgaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgJycsIHBhcnRzLmpvaW4oJycpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByZWxvYWRQYWdlKHBhZ2U6IFBhZ2UgfCBudWxsIHwgdW5kZWZpbmVkKTogdm9pZCB7XG4gIGlmICghcGFnZSB8fCBwcmVsb2FkQ2FjaGUudmFsdWUuaGFzKHBhZ2UuaWQpKSByZXR1cm47XG4gIGNvbnN0IG0gPSBuZXcgTWFwKHByZWxvYWRDYWNoZS52YWx1ZSk7XG4gIG0uc2V0KHBhZ2UuaWQsIHBhZ2UpO1xuICBwcmVsb2FkQ2FjaGUudmFsdWUgPSBtO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJlbG9hZFBhZ2VzKHBhZ2VzOiAoUGFnZSB8IG51bGwgfCB1bmRlZmluZWQpW10pOiB2b2lkIHtcbiAgY29uc3QgbSA9IG5ldyBNYXAocHJlbG9hZENhY2hlLnZhbHVlKTtcbiAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcbiAgZm9yIChjb25zdCBwYWdlIG9mIHBhZ2VzKSB7XG4gICAgaWYgKHBhZ2UgJiYgIW0uaGFzKHBhZ2UuaWQpKSB7IG0uc2V0KHBhZ2UuaWQsIHBhZ2UpOyBjaGFuZ2VkID0gdHJ1ZTsgfVxuICB9XG4gIGlmIChjaGFuZ2VkKSBwcmVsb2FkQ2FjaGUudmFsdWUgPSBtO1xufVxuXG4vLyBSZXR1cm5zIHBhZ2VzIHdvcnRoIHByZWxvYWRpbmcgYXQgc3RhcnR1cDogY3VycmVudCBzZWN0aW9uIChhbGwpICsgbGFzdCB2aXNpdGVkIGluIGVhY2ggb3RoZXIgc2VjdGlvblxuZXhwb3J0IGZ1bmN0aW9uIGdldFByZWxvYWRDYW5kaWRhdGVzKCk6IFBhZ2VbXSB7XG4gIGNvbnN0IHsgdWksIG5vdGVib29rcyB9ID0gYXBwU3RhdGUudmFsdWU7XG4gIGNvbnN0IG5iID0gbm90ZWJvb2tzLmZpbmQobiA9PiBuLmlkID09PSB1aS5ub3RlYm9va0lkKTtcbiAgaWYgKCFuYikgcmV0dXJuIFtdO1xuICBjb25zdCByZXN1bHRzOiBQYWdlW10gPSBbXTtcbiAgZnVuY3Rpb24gYWRkVHJlZShwYWdlczogUGFnZVtdKTogdm9pZCB7XG4gICAgZm9yIChjb25zdCBwIG9mIHBhZ2VzKSB7XG4gICAgICBpZiAocC5pZCAhPT0gdWkucGFnZUlkKSByZXN1bHRzLnB1c2gocCk7XG4gICAgICBpZiAocC5jaGlsZHJlbj8ubGVuZ3RoKSBhZGRUcmVlKHAuY2hpbGRyZW4pO1xuICAgIH1cbiAgfVxuICBmb3IgKGNvbnN0IHNlYyBvZiBuYi5zZWN0aW9ucykge1xuICAgIGlmIChzZWMuaWQgPT09IHVpLnNlY3Rpb25JZCkge1xuICAgICAgYWRkVHJlZShzZWMucGFnZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBsYXN0SWQgPSBsYXN0UGFnZVBlclNlY3Rpb24uZ2V0KHNlYy5pZCk7XG4gICAgICBjb25zdCBwZyA9IGxhc3RJZCA/IGZpbmRJblRyZWUoc2VjLnBhZ2VzLCBsYXN0SWQpIDogc2VjLnBhZ2VzWzBdO1xuICAgICAgaWYgKHBnKSByZXN1bHRzLnB1c2gocGcpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZVN3aXRjaGVyKCk6IHZvaWQgeyBzaG93U3dpdGNoZXIudmFsdWUgPSAhc2hvd1N3aXRjaGVyLnZhbHVlOyB9XG5leHBvcnQgZnVuY3Rpb24gY2xvc2VTd2l0Y2hlcigpOiB2b2lkIHsgc2hvd1N3aXRjaGVyLnZhbHVlID0gZmFsc2U7IH1cblxuLy8gTG9hZCByZWNlbnRzIGZyb20gY29uZmlnIG9uIGluaXQ7IGFsc28gZGV0ZXJtaW5lIGlmIGEgbm90ZWJvb2sgd2lsbCBiZSBvcGVuZWRcbmNvbnN0IF9sb2cgPSAoLi4uYXJnczogdW5rbm93bltdKTogdm9pZCA9PiB7IGNvbnNvbGUubG9nKCdbc3RvcmVdJywgLi4uYXJncyk7IGlmICh3aW5kb3cubG9nKSB3aW5kb3cubG9nKCdbc3RvcmVdJywgLi4uYXJncyk7IH07XG5pZiAoaGFzSVBDKSB7XG4gIHdpbmRvdy5ub3RlYm9vay5nZXRDb25maWcoKS50aGVuKChjZmc6IEFwcENvbmZpZykgPT4ge1xuICAgIF9sb2coJ2luaXQgZ2V0Q29uZmlnIHJlc3VsdCDigJQgbm90ZWJvb2tQYXRoOicsIGNmZy5ub3RlYm9va1BhdGgsICdyZWNlbnRzOicsIGNmZy5yZWNlbnROb3RlYm9va3M/Lmxlbmd0aCA/PyAwKTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjZmcucmVjZW50Tm90ZWJvb2tzKSkgcmVjZW50Tm90ZWJvb2tzLnZhbHVlID0gY2ZnLnJlY2VudE5vdGVib29rcztcbiAgICAvLyBJZiB0aGVyZSdzIG5vIHNhdmVkIG5vdGVib29rIHBhdGgsIG5vdGhpbmcgd2lsbCBsb2FkIOKAlCBzdG9wIGluaXRpYWxpemluZyBub3dcbiAgICBpZiAoIWNmZy5ub3RlYm9va1BhdGgpIHtcbiAgICAgIF9sb2coJ25vIG5vdGVib29rUGF0aCDigJQgc2V0dGluZyBpbml0aWFsaXppbmc9ZmFsc2UgKHdlbGNvbWUgc2NyZWVuKScpO1xuICAgICAgaW5pdGlhbGl6aW5nLnZhbHVlID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIElmIHRoZXJlIGlzIGEgcGF0aCwgaW5pdGlhbGl6aW5nIHN0YXlzIHRydWUgdW50aWwgb25TdGF0ZUNoYW5nZWQgZmlyZXNcbiAgfSk7XG4gIC8vIElmIHRoZSBkZWZhdWx0IG5vdGVib29rIGZhaWxzIHRvIG9wZW4sIHNob3cgd2VsY29tZSBzY3JlZW5cbiAgd2luZG93Lm5vdGVib29rLm9uT3BlbkZhaWxlZCgoKSA9PiB7XG4gICAgX2xvZygnb25PcGVuRmFpbGVkIGZpcmVkIOKAlCBzZXR0aW5nIGluaXRpYWxpemluZz1mYWxzZScpO1xuICAgIGluaXRpYWxpemluZy52YWx1ZSA9IGZhbHNlO1xuICB9KTtcbn0gZWxzZSB7XG4gIGluaXRpYWxpemluZy52YWx1ZSA9IGZhbHNlO1xufVxuXG4vLyBTaGFsbG93IGNsb25lIOKAlCBuZXcgdG9wLWxldmVsIHJlZmVyZW5jZSB0cmlnZ2VycyBQcmVhY3Qgc2lnbmFsLCBmbiBtdXRhdGVzIG5lc3RlZCBvYmplY3RzIGluIHBsYWNlXG5mdW5jdGlvbiB1cGRhdGUoZm46IChkcmFmdDogQXBwU3RhdGUpID0+IHZvaWQpOiB2b2lkIHtcbiAgY29uc3QgZHJhZnQ6IEFwcFN0YXRlID0geyAuLi5hcHBTdGF0ZS52YWx1ZSB9O1xuICBmbihkcmFmdCk7XG4gIGFwcFN0YXRlLnZhbHVlID0gZHJhZnQ7XG59XG5cbi8vIFNpbGVudCB1cGRhdGUg4oCUIG11dGF0ZSBpbi1wbGFjZSAobm8gcmUtcmVuZGVyKVxuZnVuY3Rpb24gc2lsZW50KGZuOiAoc3RhdGU6IEFwcFN0YXRlKSA9PiB2b2lkKTogdm9pZCB7XG4gIGZuKGFwcFN0YXRlLnZhbHVlKTtcbn1cblxuLy8g4pSA4pSA4pSAIEhlbHBlcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbmZ1bmN0aW9uIGZpbmRJblRyZWUocGFnZXM6IFBhZ2VbXSwgaWQ6IHN0cmluZyB8IG51bGwpOiBQYWdlIHwgbnVsbCB7XG4gIGZvciAoY29uc3QgcCBvZiBwYWdlcykge1xuICAgIGlmIChwLmlkID09PSBpZCkgcmV0dXJuIHA7XG4gICAgaWYgKHAuY2hpbGRyZW4/Lmxlbmd0aCkgeyBjb25zdCBmID0gZmluZEluVHJlZShwLmNoaWxkcmVuLCBpZCk7IGlmIChmKSByZXR1cm4gZjsgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiByZW1vdmVGcm9tVHJlZShwYWdlczogUGFnZVtdLCBpZDogc3RyaW5nKTogUGFnZVtdIHtcbiAgcmV0dXJuIHBhZ2VzLmZpbHRlcihwID0+IHAuaWQgIT09IGlkKS5tYXAocCA9PiAoeyAuLi5wLCBjaGlsZHJlbjogcmVtb3ZlRnJvbVRyZWUocC5jaGlsZHJlbiA/PyBbXSwgaWQpIH0pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdGl2ZVBhZ2UoczogQXBwU3RhdGUgPSBhcHBTdGF0ZS52YWx1ZSk6IFBhZ2UgfCBudWxsIHtcbiAgY29uc3QgeyB1aSwgbm90ZWJvb2tzIH0gPSBzO1xuICBjb25zdCBuYiA9IG5vdGVib29rcy5maW5kKG4gPT4gbi5pZCA9PT0gdWkubm90ZWJvb2tJZCk7XG4gIGNvbnN0IHNlYyA9IG5iPy5zZWN0aW9ucy5maW5kKHNlYyA9PiBzZWMuaWQgPT09IHVpLnNlY3Rpb25JZCk7XG4gIHJldHVybiBzZWMgPyBmaW5kSW5UcmVlKHNlYy5wYWdlcywgdWkucGFnZUlkKSA6IG51bGw7XG59XG5cbmV4cG9ydCB7IGZpbmRJblRyZWUsIHJlbW92ZUZyb21UcmVlIH07XG5cbi8vIOKUgOKUgOKUgCBVSSBzdGF0ZSBwZXJzaXN0ZW5jZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxubGV0IF9ub3RlYm9va1BhdGg6IHN0cmluZyB8IG51bGwgPSBudWxsO1xubGV0IF91aVNhdmVUaW1lcjogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCBudWxsID0gbnVsbDtcblxuZnVuY3Rpb24gc2V0Tm90ZWJvb2tQYXRoKHA6IHN0cmluZyB8IG51bGwpOiB2b2lkIHtcbiAgX25vdGVib29rUGF0aCA9IHA7XG4gIGNvbnN0IG5hbWUgPSBwID8gcC5yZXBsYWNlKC9cXFxcL2csICcvJykuc3BsaXQoJy8nKS5wb3AoKSA6IG51bGw7XG4gIGRvY3VtZW50LnRpdGxlID0gbmFtZSA/IGBOb3RlYm91bmQgLSAke25hbWV9YCA6ICdOb3RlYm91bmQnO1xufVxuXG5mdW5jdGlvbiBwZXJzaXN0VWlTdGF0ZSgpOiB2b2lkIHtcbiAgaWYgKCFoYXNJUEMgfHwgIV9ub3RlYm9va1BhdGgpIHJldHVybjtcbiAgaWYgKF91aVNhdmVUaW1lcikgY2xlYXJUaW1lb3V0KF91aVNhdmVUaW1lcik7XG4gIF91aVNhdmVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGNvbnN0IHsgdWkgfSA9IGFwcFN0YXRlLnZhbHVlO1xuICAgIHdpbmRvdy5ub3RlYm9vay5zYXZlVWlTdGF0ZShfbm90ZWJvb2tQYXRoISwge1xuICAgICAgc2VjdGlvbklkOiB1aS5zZWN0aW9uSWQhLFxuICAgICAgcGFnZUlkOiB1aS5wYWdlSWQhLFxuICAgICAgbGFzdFBhZ2VQZXJTZWN0aW9uOiBPYmplY3QuZnJvbUVudHJpZXMobGFzdFBhZ2VQZXJTZWN0aW9uKSxcbiAgICB9KTtcbiAgfSwgNTAwKTtcbn1cblxuLy8g4pSA4pSA4pSAIE5hdmlnYXRpb24g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbi8vIFJlbWVtYmVyIGxhc3QgdmlzaXRlZCBwYWdlIHBlciBzZWN0aW9uIChpbi1tZW1vcnksIHNlc3Npb24tb25seSlcbmNvbnN0IGxhc3RQYWdlUGVyU2VjdGlvbiA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRBY3RpdmVOb3RlYm9vayhpZDogc3RyaW5nKTogdm9pZCB7XG4gIHVwZGF0ZShzID0+IHtcbiAgICBzLnVpLm5vdGVib29rSWQgPSBpZDtcbiAgICBjb25zdCBuYiA9IHMubm90ZWJvb2tzLmZpbmQobiA9PiBuLmlkID09PSBpZCk7XG4gICAgcy51aS5zZWN0aW9uSWQgPSBuYj8uc2VjdGlvbnNbMF0/LmlkID8/IG51bGw7XG4gICAgcy51aS5wYWdlSWQgPSBuYj8uc2VjdGlvbnNbMF0/LnBhZ2VzWzBdPy5pZCA/PyBudWxsO1xuICB9KTtcbiAgcGVyc2lzdFVpU3RhdGUoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEFjdGl2ZVNlY3Rpb24oaWQ6IHN0cmluZyk6IHZvaWQge1xuICB1cGRhdGUocyA9PiB7XG4gICAgcy51aS5zZWN0aW9uSWQgPSBpZDtcbiAgICBjb25zdCBuYiA9IHMubm90ZWJvb2tzLmZpbmQobiA9PiBuLmlkID09PSBzLnVpLm5vdGVib29rSWQpO1xuICAgIGNvbnN0IHNlYyA9IG5iPy5zZWN0aW9ucy5maW5kKHNlYyA9PiBzZWMuaWQgPT09IGlkKTtcbiAgICAvLyBSZXN0b3JlIGxhc3QgdmlzaXRlZCBwYWdlIGluIHRoaXMgc2VjdGlvbiwgZmFsbCBiYWNrIHRvIGZpcnN0IHBhZ2VcbiAgICBjb25zdCBsYXN0SWQgPSBsYXN0UGFnZVBlclNlY3Rpb24uZ2V0KGlkKTtcbiAgICBjb25zdCBsYXN0UGFnZSA9IGxhc3RJZCAmJiBzZWMgPyBmaW5kSW5UcmVlKHNlYy5wYWdlcywgbGFzdElkKSA6IG51bGw7XG4gICAgcy51aS5wYWdlSWQgPSBsYXN0UGFnZT8uaWQgPz8gc2VjPy5wYWdlc1swXT8uaWQgPz8gbnVsbDtcbiAgfSk7XG4gIHBlcnNpc3RVaVN0YXRlKCk7XG4gIHN5bmNIYXNoVXJsKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRBY3RpdmVQYWdlKGlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgY29uc3QgeyBzZWN0aW9uSWQgfSA9IGFwcFN0YXRlLnZhbHVlLnVpO1xuICBpZiAoc2VjdGlvbklkKSBsYXN0UGFnZVBlclNlY3Rpb24uc2V0KHNlY3Rpb25JZCwgaWQpO1xuICB1cGRhdGUocyA9PiB7IHMudWkucGFnZUlkID0gaWQ7IH0pO1xuICBwZXJzaXN0VWlTdGF0ZSgpO1xuICBzeW5jSGFzaFVybCgpO1xufVxuXG4vLyDilIDilIDilIAgTm90ZWJvb2sgQ1JVRCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZE5vdGVib29rKCk6IHZvaWQge1xuICBjb25zdCBuYiA9IG1rTm90ZWJvb2soJ05ldyBOb3RlYm9vaycpO1xuICB1cGRhdGUocyA9PiB7XG4gICAgcy5ub3RlYm9va3MucHVzaChuYik7XG4gICAgcy51aS5ub3RlYm9va0lkID0gbmIuaWQ7XG4gICAgcy51aS5zZWN0aW9uSWQgPSBuYi5zZWN0aW9uc1swXS5pZDtcbiAgICBzLnVpLnBhZ2VJZCA9IG5iLnNlY3Rpb25zWzBdLnBhZ2VzWzBdLmlkO1xuICB9KTtcbiAgY29uc3Qgc2VjID0gbmIuc2VjdGlvbnNbMF07XG4gIGNvbnN0IHBhZ2UgPSBzZWMucGFnZXNbMF07XG4gIHNlbmRPcHMoW1xuICAgIHsgdHlwZTogJ25vdGVib29rLWFkZCcsIG5vdGVib29rSWQ6IG5iLmlkLCB0aXRsZTogbmIudGl0bGUsIHNlY3Rpb25zOiBbXSB9LFxuICAgIHsgdHlwZTogJ3NlY3Rpb24tYWRkJywgbm90ZWJvb2tJZDogbmIuaWQsIHNlY3Rpb25JZDogc2VjLmlkLCB0aXRsZTogc2VjLnRpdGxlLCBwYWdlczogW10gfSxcbiAgICB7IHR5cGU6ICdwYWdlLWFkZCcsIHNlY3Rpb25JZDogc2VjLmlkLCBwYWdlSWQ6IHBhZ2UuaWQsIHRpdGxlOiBwYWdlLnRpdGxlLCBibG9ja3M6IHBhZ2UuYmxvY2tzIH0sXG4gIF0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuYW1lTm90ZWJvb2soaWQ6IHN0cmluZywgdGl0bGU6IHN0cmluZyk6IHZvaWQge1xuICB1cGRhdGUocyA9PiB7IGNvbnN0IG5iID0gcy5ub3RlYm9va3MuZmluZChuID0+IG4uaWQgPT09IGlkKTsgaWYgKG5iKSBuYi50aXRsZSA9IHRpdGxlOyB9KTtcbiAgc2VuZE9wKHsgdHlwZTogJ25vdGVib29rLXJlbmFtZScsIG5vdGVib29rSWQ6IGlkLCB0aXRsZSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZU5vdGVib29rKGlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgdXBkYXRlKHMgPT4ge1xuICAgIHMubm90ZWJvb2tzID0gcy5ub3RlYm9va3MuZmlsdGVyKG4gPT4gbi5pZCAhPT0gaWQpO1xuICAgIGlmIChzLnVpLm5vdGVib29rSWQgPT09IGlkKSB7XG4gICAgICBjb25zdCBuYiA9IHMubm90ZWJvb2tzWzBdO1xuICAgICAgcy51aS5ub3RlYm9va0lkID0gbmI/LmlkID8/IG51bGw7XG4gICAgICBzLnVpLnNlY3Rpb25JZCA9IG5iPy5zZWN0aW9uc1swXT8uaWQgPz8gbnVsbDtcbiAgICAgIHMudWkucGFnZUlkID0gbmI/LnNlY3Rpb25zWzBdPy5wYWdlc1swXT8uaWQgPz8gbnVsbDtcbiAgICB9XG4gIH0pO1xuICBzZW5kT3AoeyB0eXBlOiAnbm90ZWJvb2stZGVsZXRlJywgbm90ZWJvb2tJZDogaWQgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW9yZGVyTm90ZWJvb2tzKGlkczogc3RyaW5nW10pOiB2b2lkIHtcbiAgdXBkYXRlKHMgPT4geyBzLm5vdGVib29rcy5zb3J0KChhLCBiKSA9PiBpZHMuaW5kZXhPZihhLmlkKSAtIGlkcy5pbmRleE9mKGIuaWQpKTsgfSk7XG4gIHNlbmRPcCh7IHR5cGU6ICdub3RlYm9vay1yZW9yZGVyJywgbm90ZWJvb2tJZHM6IGlkcyB9KTtcbn1cblxuLy8g4pSA4pSA4pSAIFNlY3Rpb24gQ1JVRCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFNlY3Rpb24obmJJZDogc3RyaW5nKTogdm9pZCB7XG4gIGNvbnN0IHNlYyA9IG1rU2VjdGlvbignTmV3IFNlY3Rpb24nKTtcbiAgY29uc3QgcGFnZSA9IHNlYy5wYWdlc1swXTtcbiAgdXBkYXRlKHMgPT4ge1xuICAgIGNvbnN0IG5iID0gcy5ub3RlYm9va3MuZmluZChuID0+IG4uaWQgPT09IG5iSWQpO1xuICAgIGlmICghbmIpIHJldHVybjtcbiAgICBuYi5zZWN0aW9ucy5wdXNoKHNlYyk7XG4gICAgcy51aS5zZWN0aW9uSWQgPSBzZWMuaWQ7XG4gICAgcy51aS5wYWdlSWQgPSBwYWdlLmlkO1xuICB9KTtcbiAgc2VuZE9wcyhbXG4gICAgeyB0eXBlOiAnc2VjdGlvbi1hZGQnLCBub3RlYm9va0lkOiBuYklkLCBzZWN0aW9uSWQ6IHNlYy5pZCwgdGl0bGU6IHNlYy50aXRsZSwgcGFnZXM6IFtdIH0sXG4gICAgeyB0eXBlOiAncGFnZS1hZGQnLCBzZWN0aW9uSWQ6IHNlYy5pZCwgcGFnZUlkOiBwYWdlLmlkLCB0aXRsZTogcGFnZS50aXRsZSwgYmxvY2tzOiBwYWdlLmJsb2NrcyB9LFxuICBdKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmFtZVNlY3Rpb24obmJJZDogc3RyaW5nLCBzZWNJZDogc3RyaW5nLCB0aXRsZTogc3RyaW5nKTogdm9pZCB7XG4gIHVwZGF0ZShzID0+IHtcbiAgICBjb25zdCBzZWMgPSBzLm5vdGVib29rcy5maW5kKG4gPT4gbi5pZCA9PT0gbmJJZCk/LnNlY3Rpb25zLmZpbmQocyA9PiBzLmlkID09PSBzZWNJZCk7XG4gICAgaWYgKHNlYykgc2VjLnRpdGxlID0gdGl0bGU7XG4gIH0pO1xuICBzZW5kT3AoeyB0eXBlOiAnc2VjdGlvbi1yZW5hbWUnLCBzZWN0aW9uSWQ6IHNlY0lkLCB0aXRsZSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZVNlY3Rpb24obmJJZDogc3RyaW5nLCBzZWNJZDogc3RyaW5nKTogdm9pZCB7XG4gIHVwZGF0ZShzID0+IHtcbiAgICBjb25zdCBuYiA9IHMubm90ZWJvb2tzLmZpbmQobiA9PiBuLmlkID09PSBuYklkKTtcbiAgICBpZiAoIW5iKSByZXR1cm47XG4gICAgbmIuc2VjdGlvbnMgPSBuYi5zZWN0aW9ucy5maWx0ZXIoc2VjID0+IHNlYy5pZCAhPT0gc2VjSWQpO1xuICAgIGlmIChzLnVpLnNlY3Rpb25JZCA9PT0gc2VjSWQpIHtcbiAgICAgIGNvbnN0IGZpcnN0ID0gbmIuc2VjdGlvbnNbMF07XG4gICAgICBzLnVpLnNlY3Rpb25JZCA9IGZpcnN0Py5pZCA/PyBudWxsO1xuICAgICAgcy51aS5wYWdlSWQgPSBmaXJzdD8ucGFnZXNbMF0/LmlkID8/IG51bGw7XG4gICAgfVxuICB9KTtcbiAgc2VuZE9wKHsgdHlwZTogJ3NlY3Rpb24tZGVsZXRlJywgbm90ZWJvb2tJZDogbmJJZCwgc2VjdGlvbklkOiBzZWNJZCB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlb3JkZXJTZWN0aW9ucyhuYklkOiBzdHJpbmcsIGlkczogc3RyaW5nW10pOiB2b2lkIHtcbiAgdXBkYXRlKHMgPT4ge1xuICAgIGNvbnN0IG5iID0gcy5ub3RlYm9va3MuZmluZChuID0+IG4uaWQgPT09IG5iSWQpO1xuICAgIGlmIChuYikgbmIuc2VjdGlvbnMuc29ydCgoYSwgYikgPT4gaWRzLmluZGV4T2YoYS5pZCkgLSBpZHMuaW5kZXhPZihiLmlkKSk7XG4gIH0pO1xuICBzZW5kT3AoeyB0eXBlOiAnc2VjdGlvbi1yZW9yZGVyJywgbm90ZWJvb2tJZDogbmJJZCwgc2VjdGlvbklkczogaWRzIH0pO1xufVxuXG4vLyDilIDilIDilIAgUGFnZSBDUlVEIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5leHBvcnQgZnVuY3Rpb24gYWRkUGFnZShwYXJlbnRQYWdlSWQ6IHN0cmluZyB8IG51bGwgPSBudWxsKTogdm9pZCB7XG4gIGNvbnN0IHBnID0gbWtQYWdlKCdVbnRpdGxlZCBQYWdlJyk7XG4gIGNvbnN0IHNlY0lkID0gYXBwU3RhdGUudmFsdWUudWkuc2VjdGlvbklkO1xuICB1cGRhdGUocyA9PiB7XG4gICAgY29uc3QgbmIgPSBzLm5vdGVib29rcy5maW5kKG4gPT4gbi5pZCA9PT0gcy51aS5ub3RlYm9va0lkKTtcbiAgICBjb25zdCBzZWMgPSBuYj8uc2VjdGlvbnMuZmluZChzZWMgPT4gc2VjLmlkID09PSBzLnVpLnNlY3Rpb25JZCk7XG4gICAgaWYgKCFzZWMpIHJldHVybjtcbiAgICBpZiAocGFyZW50UGFnZUlkKSB7XG4gICAgICBjb25zdCBwYXJlbnQgPSBmaW5kSW5UcmVlKHNlYy5wYWdlcywgcGFyZW50UGFnZUlkKTtcbiAgICAgIGlmIChwYXJlbnQpIHsgcGFyZW50LmNoaWxkcmVuID0gcGFyZW50LmNoaWxkcmVuID8/IFtdOyBwYXJlbnQuY2hpbGRyZW4ucHVzaChwZyk7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgc2VjLnBhZ2VzLnB1c2gocGcpO1xuICAgIH1cbiAgICBzLnVpLnBhZ2VJZCA9IHBnLmlkO1xuICB9KTtcbiAgc2VuZE9wKHsgdHlwZTogJ3BhZ2UtYWRkJywgc2VjdGlvbklkOiBzZWNJZCwgcGFnZUlkOiBwZy5pZCwgdGl0bGU6IHBnLnRpdGxlLCBwYXJlbnRQYWdlSWQsIGJsb2NrczogcGcuYmxvY2tzIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuYW1lUGFnZShwYWdlSWQ6IHN0cmluZywgdGl0bGU6IHN0cmluZyk6IHZvaWQge1xuICB1cGRhdGUocyA9PiB7XG4gICAgY29uc3QgbmIgPSBzLm5vdGVib29rcy5maW5kKG4gPT4gbi5pZCA9PT0gcy51aS5ub3RlYm9va0lkKTtcbiAgICBjb25zdCBzZWMgPSBuYj8uc2VjdGlvbnMuZmluZChzZWMgPT4gc2VjLmlkID09PSBzLnVpLnNlY3Rpb25JZCk7XG4gICAgaWYgKCFzZWMpIHJldHVybjtcbiAgICBjb25zdCBwZyA9IGZpbmRJblRyZWUoc2VjLnBhZ2VzLCBwYWdlSWQpO1xuICAgIGlmIChwZykgcGcudGl0bGUgPSB0aXRsZTtcbiAgfSk7XG4gIHNlbmRPcCh7IHR5cGU6ICdwYWdlLXJlbmFtZScsIHBhZ2VJZCwgdGl0bGUgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVQYWdlKHBhZ2VJZDogc3RyaW5nKTogdm9pZCB7XG4gIHVwZGF0ZShzID0+IHtcbiAgICBjb25zdCBuYiA9IHMubm90ZWJvb2tzLmZpbmQobiA9PiBuLmlkID09PSBzLnVpLm5vdGVib29rSWQpO1xuICAgIGNvbnN0IHNlYyA9IG5iPy5zZWN0aW9ucy5maW5kKHNlYyA9PiBzZWMuaWQgPT09IHMudWkuc2VjdGlvbklkKTtcbiAgICBpZiAoIXNlYykgcmV0dXJuO1xuICAgIHNlYy5wYWdlcyA9IHJlbW92ZUZyb21UcmVlKHNlYy5wYWdlcywgcGFnZUlkKTtcbiAgICBpZiAocy51aS5wYWdlSWQgPT09IHBhZ2VJZCkgcy51aS5wYWdlSWQgPSBzZWMucGFnZXNbMF0/LmlkID8/IG51bGw7XG4gIH0pO1xuICBzZW5kT3AoeyB0eXBlOiAncGFnZS1kZWxldGUnLCBwYWdlSWQgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtb3ZlUGFnZShwYWdlSWQ6IHN0cmluZywgdGFyZ2V0U2VjSWQ6IHN0cmluZyk6IHZvaWQge1xuICB1cGRhdGUocyA9PiB7XG4gICAgY29uc3QgbmIgPSBzLm5vdGVib29rcy5maW5kKG4gPT4gbi5pZCA9PT0gcy51aS5ub3RlYm9va0lkKTtcbiAgICBpZiAoIW5iKSByZXR1cm47XG4gICAgbGV0IHBnOiBQYWdlIHwgbnVsbCA9IG51bGw7XG4gICAgZm9yIChjb25zdCBzZWMgb2YgbmIuc2VjdGlvbnMpIHtcbiAgICAgIGNvbnN0IGZvdW5kID0gZmluZEluVHJlZShzZWMucGFnZXMsIHBhZ2VJZCk7XG4gICAgICBpZiAoZm91bmQpIHsgcGcgPSBzdHJ1Y3R1cmVkQ2xvbmUoZm91bmQpOyBzZWMucGFnZXMgPSByZW1vdmVGcm9tVHJlZShzZWMucGFnZXMsIHBhZ2VJZCk7IGJyZWFrOyB9XG4gICAgfVxuICAgIGlmICghcGcpIHJldHVybjtcbiAgICBjb25zdCB0YXJnZXQgPSBuYi5zZWN0aW9ucy5maW5kKHNlYyA9PiBzZWMuaWQgPT09IHRhcmdldFNlY0lkKTtcbiAgICBpZiAodGFyZ2V0KSB0YXJnZXQucGFnZXMucHVzaChwZyk7XG4gIH0pO1xuICBzZW5kT3AoeyB0eXBlOiAncGFnZS1tb3ZlJywgcGFnZUlkLCB0YXJnZXRTZWN0aW9uSWQ6IHRhcmdldFNlY0lkIH0pO1xufVxuXG4vLyDilIDilIDilIAgRGVmYXVsdCBibG9jayB3aWR0aCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIFdpZHRoIGlzIGNhbGlicmF0ZWQgc28gdGhpcyByZWZlcmVuY2Ugc3RyaW5nIGZpdHMgb24gb25lIGxpbmUgYXQgdGhlIGRlZmF1bHQgZm9udC5cbmNvbnN0IERFRkFVTFRfV0lEVEhfUkVGID0gXCJZZXMuIFRoZSByZWFsIGxldmVyYWdlIG9mIGEgbG9jYWwtZmlyc3QsIGxvZy1yZXBsaWNhdGVkIG9iamVjdCBtb2RlbCBpcyBub3QgdGVjaG5pY2FsIGVsZWdhbmNlIOKAlCBpdCdzIHBvd2VyIHJlYWxpZ25tZW50LlwiO1xuXG5sZXQgX2RlZmF1bHRCbG9ja1dpZHRoID0gNTgwOyAvLyBmYWxsYmFja1xuaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgY29uc3QgX20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIF9tLnN0eWxlLmNzc1RleHQgPSAncG9zaXRpb246YWJzb2x1dGU7dmlzaWJpbGl0eTpoaWRkZW47d2hpdGUtc3BhY2U6bm93cmFwO2ZvbnQ6MTRweCBcIkhlbHZldGljYSBOZXVlXCIsQXJpYWwsLWFwcGxlLXN5c3RlbSxzYW5zLXNlcmlmO3BhZGRpbmc6MCA4cHgnO1xuICBfbS50ZXh0Q29udGVudCA9IERFRkFVTFRfV0lEVEhfUkVGO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKF9tKTtcbiAgX2RlZmF1bHRCbG9ja1dpZHRoID0gTWF0aC5jZWlsKF9tLm9mZnNldFdpZHRoICsgMTYpOyAvLyArMTYgZm9yIGJsb2NrIHBhZGRpbmcgKDhweCBlYWNoIHNpZGUpXG4gIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoX20pO1xufVxuZXhwb3J0IGNvbnN0IERFRkFVTFRfQkxPQ0tfV0lEVEg6IG51bWJlciA9IF9kZWZhdWx0QmxvY2tXaWR0aDtcblxuLy8g4pSA4pSA4pSAIEJsb2NrIENSVUQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRCbG9jayh4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyID0gREVGQVVMVF9CTE9DS19XSURUSCwgdHlwZTogQmxvY2tbJ3R5cGUnXSA9ICd0ZXh0JywgZXh0cmE6IFBhcnRpYWw8QmxvY2s+ID0ge30pOiBCbG9jayB7XG4gIGNvbnN0IGJsazogQmxvY2sgPSB7IGlkOiB1aWQoKSwgeCwgeSwgdywgaHRtbDogJycsIHR5cGUsIC4uLmV4dHJhIH07XG4gIGNvbnN0IHBhZ2VJZCA9IGFwcFN0YXRlLnZhbHVlLnVpLnBhZ2VJZDtcbiAgdXBkYXRlKHMgPT4ge1xuICAgIGNvbnN0IHBnID0gZ2V0QWN0aXZlUGFnZShzKTtcbiAgICBpZiAocGcpIHBnLmJsb2Nrcy5wdXNoKGJsayk7XG4gIH0pO1xuICBzZW5kT3AoeyB0eXBlOiAnYmxvY2stYWRkJywgcGFnZUlkLCBibG9jazogYmxrIH0pO1xuICByZXR1cm4gYmxrO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlQmxvY2soYmxvY2tJZDogc3RyaW5nKTogdm9pZCB7XG4gIGNvbnN0IHBhZ2VJZCA9IGFwcFN0YXRlLnZhbHVlLnVpLnBhZ2VJZDtcbiAgdXBkYXRlKHMgPT4ge1xuICAgIGNvbnN0IHBnID0gZ2V0QWN0aXZlUGFnZShzKTtcbiAgICBpZiAocGcpIHBnLmJsb2NrcyA9IHBnLmJsb2Nrcy5maWx0ZXIoYiA9PiBiLmlkICE9PSBibG9ja0lkKTtcbiAgfSk7XG4gIHNlbmRPcCh7IHR5cGU6ICdibG9jay1kZWxldGUnLCBwYWdlSWQsIGJsb2NrSWQgfSk7XG59XG5cbi8vIFNpbGVudCB1cGRhdGVzIOKAlCBibG9jayBjb250ZW50L3Bvc2l0aW9uIGNoYW5nZXMgZG9uJ3QgcmUtcmVuZGVyIHRoZSBzaWRlYmFyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQmxvY2tIdG1sTG9jYWwoYmxvY2tJZDogc3RyaW5nLCBodG1sOiBzdHJpbmcpOiB2b2lkIHtcbiAgc2lsZW50KHMgPT4ge1xuICAgIGNvbnN0IHBnID0gZ2V0QWN0aXZlUGFnZShzKTtcbiAgICBjb25zdCBibGsgPSBwZz8uYmxvY2tzLmZpbmQoYiA9PiBiLmlkID09PSBibG9ja0lkKTtcbiAgICBpZiAoYmxrKSBibGsuaHRtbCA9IGh0bWw7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQmxvY2tUZXh0RGlmZihibG9ja0lkOiBzdHJpbmcsIGRpZmZzOiB7IHR5cGU6IHN0cmluZzsgcG9zOiBudW1iZXI7IHRleHQ/OiBzdHJpbmc7IGNvdW50PzogbnVtYmVyIH1bXSk6IHZvaWQge1xuICBjb25zdCBwYWdlSWQgPSBhcHBTdGF0ZS52YWx1ZS51aS5wYWdlSWQ7XG4gIGlmIChoYXNJUEMgJiYgZGlmZnMubGVuZ3RoID4gMCkge1xuICAgIHdpbmRvdy5ub3RlYm9vay5hcHBseU9wKHsgdHlwZTogJ2Jsb2NrLXRleHQtZGlmZicsIHBhZ2VJZCwgYmxvY2tJZCwgZGlmZnMgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUJsb2NrSHRtbChibG9ja0lkOiBzdHJpbmcsIGh0bWw6IHN0cmluZyk6IHZvaWQge1xuICBjb25zdCBwYWdlSWQgPSBhcHBTdGF0ZS52YWx1ZS51aS5wYWdlSWQ7XG4gIHNpbGVudChzID0+IHtcbiAgICBjb25zdCBwZyA9IGdldEFjdGl2ZVBhZ2Uocyk7XG4gICAgY29uc3QgYmxrID0gcGc/LmJsb2Nrcy5maW5kKGIgPT4gYi5pZCA9PT0gYmxvY2tJZCk7XG4gICAgaWYgKGJsaykgYmxrLmh0bWwgPSBodG1sO1xuICB9KTtcbiAgc2VuZE9wKHsgdHlwZTogJ2Jsb2NrLXVwZGF0ZS1odG1sJywgcGFnZUlkLCBibG9ja0lkLCBodG1sIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQmxvY2tQb3MoYmxvY2tJZDogc3RyaW5nLCB4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuICBjb25zdCBwYWdlSWQgPSBhcHBTdGF0ZS52YWx1ZS51aS5wYWdlSWQ7XG4gIHNpbGVudChzID0+IHtcbiAgICBjb25zdCBwZyA9IGdldEFjdGl2ZVBhZ2Uocyk7XG4gICAgY29uc3QgYmxrID0gcGc/LmJsb2Nrcy5maW5kKGIgPT4gYi5pZCA9PT0gYmxvY2tJZCk7XG4gICAgaWYgKGJsaykgeyBibGsueCA9IHg7IGJsay55ID0geTsgfVxuICB9KTtcbiAgc2VuZE9wKHsgdHlwZTogJ2Jsb2NrLW1vdmUnLCBwYWdlSWQsIGJsb2NrSWQsIHgsIHkgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVCbG9ja1R5cGUoYmxvY2tJZDogc3RyaW5nLCB0eXBlOiBCbG9ja1sndHlwZSddKTogdm9pZCB7XG4gIGNvbnN0IHBhZ2VJZCA9IGFwcFN0YXRlLnZhbHVlLnVpLnBhZ2VJZDtcbiAgc2lsZW50KHMgPT4ge1xuICAgIGNvbnN0IHBnID0gZ2V0QWN0aXZlUGFnZShzKTtcbiAgICBjb25zdCBibGsgPSBwZz8uYmxvY2tzLmZpbmQoYiA9PiBiLmlkID09PSBibG9ja0lkKTtcbiAgICBpZiAoYmxrKSBibGsudHlwZSA9IHR5cGU7XG4gIH0pO1xuICBzZW5kT3AoeyB0eXBlOiAnYmxvY2stdXBkYXRlLXR5cGUnLCBwYWdlSWQsIGJsb2NrSWQsIGJsb2NrVHlwZTogdHlwZSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUJsb2NrV2lkdGgoYmxvY2tJZDogc3RyaW5nLCB3OiBudW1iZXIpOiB2b2lkIHtcbiAgY29uc3QgcGFnZUlkID0gYXBwU3RhdGUudmFsdWUudWkucGFnZUlkO1xuICBzaWxlbnQocyA9PiB7XG4gICAgY29uc3QgcGcgPSBnZXRBY3RpdmVQYWdlKHMpO1xuICAgIGNvbnN0IGJsayA9IHBnPy5ibG9ja3MuZmluZChiID0+IGIuaWQgPT09IGJsb2NrSWQpO1xuICAgIGlmIChibGspIGJsay53ID0gdztcbiAgfSk7XG4gIHNlbmRPcCh7IHR5cGU6ICdibG9jay1yZXNpemUnLCBwYWdlSWQsIGJsb2NrSWQsIHcgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVCbG9ja1NyYyhibG9ja0lkOiBzdHJpbmcsIHNyYzogc3RyaW5nKTogdm9pZCB7XG4gIGNvbnN0IHBhZ2VJZCA9IGFwcFN0YXRlLnZhbHVlLnVpLnBhZ2VJZDtcbiAgdXBkYXRlKHMgPT4ge1xuICAgIGNvbnN0IHBnID0gZ2V0QWN0aXZlUGFnZShzKTtcbiAgICBjb25zdCBibGsgPSBwZz8uYmxvY2tzLmZpbmQoYiA9PiBiLmlkID09PSBibG9ja0lkKTtcbiAgICBpZiAoYmxrKSBibGsuc3JjID0gc3JjO1xuICB9KTtcbiAgc2VuZE9wKHsgdHlwZTogJ2Jsb2NrLXVwZGF0ZS1zcmMnLCBwYWdlSWQsIGJsb2NrSWQsIHNyYyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUJsb2NrQ3JvcChibG9ja0lkOiBzdHJpbmcsIGNyb3A6IEJsb2NrWydjcm9wJ10pOiB2b2lkIHtcbiAgY29uc3QgcGFnZUlkID0gYXBwU3RhdGUudmFsdWUudWkucGFnZUlkO1xuICB1cGRhdGUocyA9PiB7XG4gICAgY29uc3QgcGcgPSBnZXRBY3RpdmVQYWdlKHMpO1xuICAgIGNvbnN0IGJsayA9IHBnPy5ibG9ja3MuZmluZChiID0+IGIuaWQgPT09IGJsb2NrSWQpO1xuICAgIGlmIChibGspIGJsay5jcm9wID0gY3JvcDtcbiAgfSk7XG4gIHNlbmRPcCh7IHR5cGU6ICdibG9jay11cGRhdGUtY3JvcCcsIHBhZ2VJZCwgYmxvY2tJZCwgY3JvcCB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUJsb2NrQm9yZGVyKGJsb2NrSWQ6IHN0cmluZywgYm9yZGVyOiBzdHJpbmcgfCBib29sZWFuIHwgdW5kZWZpbmVkKTogdm9pZCB7XG4gIGNvbnN0IHBhZ2VJZCA9IGFwcFN0YXRlLnZhbHVlLnVpLnBhZ2VJZDtcbiAgdXBkYXRlKHMgPT4ge1xuICAgIGNvbnN0IHBnID0gZ2V0QWN0aXZlUGFnZShzKTtcbiAgICBjb25zdCBibGsgPSBwZz8uYmxvY2tzLmZpbmQoYiA9PiBiLmlkID09PSBibG9ja0lkKTtcbiAgICBpZiAoYmxrKSBibGsuYm9yZGVyID0gYm9yZGVyIHx8IHVuZGVmaW5lZDtcbiAgfSk7XG4gIHNlbmRPcCh7IHR5cGU6ICdibG9jay11cGRhdGUtYm9yZGVyJywgcGFnZUlkLCBibG9ja0lkLCBib3JkZXIgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVDaGVja2xpc3RJdGVtcyhibG9ja0lkOiBzdHJpbmcsIGl0ZW1zOiBDaGVja2xpc3RJdGVtW10pOiB2b2lkIHtcbiAgY29uc3QgcGFnZUlkID0gYXBwU3RhdGUudmFsdWUudWkucGFnZUlkO1xuICB1cGRhdGUocyA9PiB7XG4gICAgY29uc3QgcGcgPSBnZXRBY3RpdmVQYWdlKHMpO1xuICAgIGNvbnN0IGJsayA9IHBnPy5ibG9ja3MuZmluZChiID0+IGIuaWQgPT09IGJsb2NrSWQpO1xuICAgIGlmIChibGspIGJsay5pdGVtcyA9IGl0ZW1zO1xuICB9KTtcbiAgc2VuZE9wKHsgdHlwZTogJ2Jsb2NrLWNoZWNrbGlzdC11cGRhdGUnLCBwYWdlSWQsIGJsb2NrSWQsIGl0ZW1zIH0pO1xufVxuXG4vLyBTaWxlbnQgdmFyaWFudCDigJQga2VlcHMgYmxvY2suaXRlbXMgaW4gc3luYyB3aXRob3V0IHRyaWdnZXJpbmcgYSByZS1yZW5kZXIuXG4vLyBVc2UgZm9yIHRleHQtb25seSBzYXZlcyAoYmx1cikgdG8gYXZvaWQgcmUtcmVuZGVyIGR1cmluZyBmb2N1cyBzd2l0Y2hlcy5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVDaGVja2xpc3RJdGVtc1NpbGVudChibG9ja0lkOiBzdHJpbmcsIGl0ZW1zOiBDaGVja2xpc3RJdGVtW10pOiB2b2lkIHtcbiAgY29uc3QgcGFnZUlkID0gYXBwU3RhdGUudmFsdWUudWkucGFnZUlkO1xuICBzaWxlbnQocyA9PiB7XG4gICAgY29uc3QgcGcgPSBnZXRBY3RpdmVQYWdlKHMpO1xuICAgIGNvbnN0IGJsayA9IHBnPy5ibG9ja3MuZmluZChiID0+IGIuaWQgPT09IGJsb2NrSWQpO1xuICAgIGlmIChibGspIGJsay5pdGVtcyA9IGl0ZW1zO1xuICB9KTtcbiAgc2VuZE9wKHsgdHlwZTogJ2Jsb2NrLWNoZWNrbGlzdC11cGRhdGUnLCBwYWdlSWQsIGJsb2NrSWQsIGl0ZW1zIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQmxvY2tDYXB0aW9uKGJsb2NrSWQ6IHN0cmluZywgY2FwdGlvbjogc3RyaW5nIHwgdW5kZWZpbmVkKTogdm9pZCB7XG4gIGNvbnN0IHBhZ2VJZCA9IGFwcFN0YXRlLnZhbHVlLnVpLnBhZ2VJZDtcbiAgdXBkYXRlKHMgPT4ge1xuICAgIGNvbnN0IHBnID0gZ2V0QWN0aXZlUGFnZShzKTtcbiAgICBjb25zdCBibGsgPSBwZz8uYmxvY2tzLmZpbmQoYiA9PiBiLmlkID09PSBibG9ja0lkKTtcbiAgICBpZiAoYmxrKSBibGsuY2FwdGlvbiA9IGNhcHRpb24gPz8gdW5kZWZpbmVkO1xuICB9KTtcbiAgc2VuZE9wKHsgdHlwZTogJ2Jsb2NrLXVwZGF0ZS1jYXB0aW9uJywgcGFnZUlkLCBibG9ja0lkLCBjYXB0aW9uIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkSW1hZ2VGcm9tRmlsZShmaWxlOiBGaWxlLCB4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuICBjb25zdCBvYmplY3RVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xuICBjb25zdCBibGsgPSBhZGRCbG9jayh4LCB5LCAzMDAsICdpbWFnZScsIHsgc3JjOiBvYmplY3RVcmwgfSk7XG4gIGlmICh3aW5kb3cubm90ZWJvb2spIHtcbiAgICBmaWxlLmFycmF5QnVmZmVyKCkudGhlbihidWZmZXIgPT4ge1xuICAgICAgY29uc3QgbWV0YTogQmxvYk1ldGEgPSB7XG4gICAgICAgIGZpbGVuYW1lOiBmaWxlLm5hbWUgfHwgdW5kZWZpbmVkLFxuICAgICAgICBtaW1lVHlwZTogZmlsZS50eXBlIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgc2l6ZTogZmlsZS5zaXplIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgbGFzdE1vZGlmaWVkOiBmaWxlLmxhc3RNb2RpZmllZCB8fCB1bmRlZmluZWQsXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHdpbmRvdy5ub3RlYm9vay5zYXZlQmxvYihidWZmZXIsIG1ldGEpO1xuICAgIH0pLnRoZW4oaGFzaCA9PiB7XG4gICAgICBpZiAoaGFzaCkgdXBkYXRlQmxvY2tTcmMoYmxrLmlkLCAnYmxvYjonICsgaGFzaCk7XG4gICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKG9iamVjdFVybCk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZEltYWdlRnJvbVVybCh1cmw6IHN0cmluZywgeDogbnVtYmVyLCB5OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgcGxhY2Vob2xkZXIgPSBhZGRCbG9jayh4LCB5LCAzMDAsICdsb2FkaW5nJyk7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBidWZmZXIsIGNvbnRlbnRUeXBlLCBzaXplIH0gPSBhd2FpdCB3aW5kb3cubm90ZWJvb2suZmV0Y2hJbWFnZSh1cmwpO1xuICAgIGNvbnN0IGZpbGVuYW1lID0gdXJsLnNwbGl0KCcvJykucG9wKCkhLnNwbGl0KCc/JylbMF07XG4gICAgY29uc3QgbWV0YTogQmxvYk1ldGEgPSB7IGZpbGVuYW1lLCBtaW1lVHlwZTogY29udGVudFR5cGUsIHNpemUsIGxhc3RNb2RpZmllZDogbnVsbCB9O1xuICAgIGRlbGV0ZUJsb2NrKHBsYWNlaG9sZGVyLmlkKTtcbiAgICBjb25zdCBoYXNoID0gYXdhaXQgd2luZG93Lm5vdGVib29rLnNhdmVCbG9iKGJ1ZmZlciwgbWV0YSk7XG4gICAgaWYgKGhhc2gpIHsgYWRkQmxvY2soeCwgeSwgMzAwLCAnaW1hZ2UnLCB7IHNyYzogJ2Jsb2I6JyArIGhhc2ggfSk7IHJldHVybjsgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBkZWxldGVCbG9jayhwbGFjZWhvbGRlci5pZCk7XG4gICAgKHdpbmRvdy5sb2cgfHwgY29uc29sZS5sb2cpKCdbYWRkSW1hZ2VGcm9tVXJsXSBlcnJvcjonLCAoZXJyIGFzIEVycm9yKS5tZXNzYWdlKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQmxvY2taKGJsb2NrSWQ6IHN0cmluZywgejogbnVtYmVyKTogdm9pZCB7XG4gIGNvbnN0IHBhZ2VJZCA9IGFwcFN0YXRlLnZhbHVlLnVpLnBhZ2VJZDtcbiAgdXBkYXRlKHMgPT4ge1xuICAgIGNvbnN0IHBnID0gZ2V0QWN0aXZlUGFnZShzKTtcbiAgICBjb25zdCBibGsgPSBwZz8uYmxvY2tzLmZpbmQoYiA9PiBiLmlkID09PSBibG9ja0lkKTtcbiAgICBpZiAoYmxrKSBibGsueiA9IHo7XG4gIH0pO1xuICBzZW5kT3AoeyB0eXBlOiAnYmxvY2steicsIHBhZ2VJZCwgYmxvY2tJZCwgeiB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVBhZ2VUcmVlKHNlY3Rpb25JZDogc3RyaW5nLCBwYWdlczogUGFnZVtdKTogdm9pZCB7XG4gIGZ1bmN0aW9uIHRvU3RydWN0dXJlKHBzOiBQYWdlW10pOiBQYWdlVHJlZU5vZGVbXSB7XG4gICAgcmV0dXJuIHBzLm1hcChwID0+ICh7IGlkOiBwLmlkLCBjaGlsZHJlbjogdG9TdHJ1Y3R1cmUocC5jaGlsZHJlbiA/PyBbXSkgfSkpO1xuICB9XG4gIHNlbmRPcCh7IHR5cGU6ICdwYWdlLXRyZWUtdXBkYXRlJywgc2VjdGlvbklkLCBwYWdlczogdG9TdHJ1Y3R1cmUocGFnZXMpIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9nZ2xlUGFnZVZpc2liaWxpdHkocGFnZUlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgdXBkYXRlKHMgPT4ge1xuICAgIGNvbnN0IG5iID0gcy5ub3RlYm9va3MuZmluZChuID0+IG4uaWQgPT09IHMudWkubm90ZWJvb2tJZCk7XG4gICAgaWYgKCFuYikgcmV0dXJuO1xuICAgIGZvciAoY29uc3Qgc2VjIG9mIG5iLnNlY3Rpb25zKSB7XG4gICAgICBjb25zdCBwZyA9IGZpbmRJblRyZWUoc2VjLnBhZ2VzLCBwYWdlSWQpO1xuICAgICAgaWYgKHBnKSB7IHBnLmhpZGRlbiA9ICFwZy5oaWRkZW47IGJyZWFrOyB9XG4gICAgfVxuICB9KTtcbiAgc2VuZE9wKHsgdHlwZTogJ3BhZ2Utc2V0LWhpZGRlbicsIHBhZ2VJZCwgaGlkZGVuOiAoKCkgPT4ge1xuICAgIGNvbnN0IG5iID0gYXBwU3RhdGUudmFsdWUubm90ZWJvb2tzLmZpbmQobiA9PiBuLmlkID09PSBhcHBTdGF0ZS52YWx1ZS51aS5ub3RlYm9va0lkKTtcbiAgICBpZiAoIW5iKSByZXR1cm4gZmFsc2U7XG4gICAgZm9yIChjb25zdCBzZWMgb2YgbmIuc2VjdGlvbnMpIHtcbiAgICAgIGNvbnN0IHBnID0gZmluZEluVHJlZShzZWMucGFnZXMsIHBhZ2VJZCk7XG4gICAgICBpZiAocGcpIHJldHVybiAhIXBnLmhpZGRlbjtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KSgpIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24ganVtcFRvUGFnZShzZWN0aW9uSWQ6IHN0cmluZywgcGFnZUlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgbGFzdFBhZ2VQZXJTZWN0aW9uLnNldChzZWN0aW9uSWQsIHBhZ2VJZCk7XG4gIHVwZGF0ZShzID0+IHsgcy51aS5zZWN0aW9uSWQgPSBzZWN0aW9uSWQ7IHMudWkucGFnZUlkID0gcGFnZUlkOyB9KTtcbiAgcGVyc2lzdFVpU3RhdGUoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVBhZ2VWaWV3KHBhblg6IG51bWJlciwgcGFuWTogbnVtYmVyLCB6b29tOiBudW1iZXIpOiB2b2lkIHtcbiAgY29uc3QgcGFnZUlkID0gYXBwU3RhdGUudmFsdWUudWkucGFnZUlkO1xuICBzaWxlbnQocyA9PiB7XG4gICAgY29uc3QgcGcgPSBnZXRBY3RpdmVQYWdlKHMpO1xuICAgIGlmIChwZykgeyBwZy5wYW5YID0gcGFuWDsgcGcucGFuWSA9IHBhblk7IHBnLnpvb20gPSB6b29tOyB9XG4gIH0pO1xuICAvLyBQZXJzaXN0IHRvIGxvY2FsIGNvbmZpZyAoZGV2aWNlLWxvY2FsLCBuZXZlciBzeW5jZWQpXG4gIGlmIChoYXNJUEMgJiYgX25vdGVib29rUGF0aCAmJiBwYWdlSWQpIHtcbiAgICB3aW5kb3cubm90ZWJvb2suc2F2ZVBhZ2VWaWV3KF9ub3RlYm9va1BhdGgsIHBhZ2VJZCwgcGFuWCwgcGFuWSwgem9vbSk7XG4gIH1cbn1cblxuLy8gQ2FyZXQgcG9zaXRpb24gbWVtb3J5OiBwYWdlSWQg4oaSIHsgYmxvY2tJZCwgb2Zmc2V0IH1cbmV4cG9ydCBjb25zdCBsYXN0Q2FyZXRQZXJQYWdlID0gbmV3IE1hcDxzdHJpbmcsIHsgYmxvY2tJZDogc3RyaW5nOyBvZmZzZXQ6IG51bWJlciB9PigpO1xuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVBhZ2VDYXJldChwYWdlSWQ6IHN0cmluZywgYmxvY2tJZDogc3RyaW5nLCBvZmZzZXQ6IG51bWJlcik6IHZvaWQge1xuICBpZiAoaGFzSVBDICYmIF9ub3RlYm9va1BhdGggJiYgcGFnZUlkKSB7XG4gICAgd2luZG93Lm5vdGVib29rLnNhdmVQYWdlQ2FyZXQoX25vdGVib29rUGF0aCwgcGFnZUlkLCBibG9ja0lkLCBvZmZzZXQpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROb3RlYm9va1BhdGgoKTogc3RyaW5nIHwgbnVsbCB7IHJldHVybiBfbm90ZWJvb2tQYXRoOyB9XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVQYWdlVGl0bGUocGFnZUlkOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcpOiB2b2lkIHtcbiAgLy8gU2lsZW50OiBzaWRlYmFyIHRpdGxlIHVwZGF0ZXMgb24gYmx1ciBvbmx5XG4gIHNpbGVudChzID0+IHtcbiAgICBjb25zdCBuYiA9IHMubm90ZWJvb2tzLmZpbmQobiA9PiBuLmlkID09PSBzLnVpLm5vdGVib29rSWQpO1xuICAgIGNvbnN0IHNlYyA9IG5iPy5zZWN0aW9ucy5maW5kKHNlYyA9PiBzZWMuaWQgPT09IHMudWkuc2VjdGlvbklkKTtcbiAgICBjb25zdCBwZyA9IHNlYyA/IGZpbmRJblRyZWUoc2VjLnBhZ2VzLCBwYWdlSWQpIDogbnVsbDtcbiAgICBpZiAocGcpIHBnLnRpdGxlID0gdGl0bGU7XG4gIH0pO1xuICAvLyBEb24ndCBzZW5kIG9wIOKAlCB3YWl0IGZvciBibHVyICh1cGRhdGVQYWdlVGl0bGVBbmRSZWZyZXNoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlUGFnZVRpdGxlQW5kUmVmcmVzaChwYWdlSWQ6IHN0cmluZywgdGl0bGU6IHN0cmluZyk6IHZvaWQge1xuICB1cGRhdGUocyA9PiB7XG4gICAgY29uc3QgbmIgPSBzLm5vdGVib29rcy5maW5kKG4gPT4gbi5pZCA9PT0gcy51aS5ub3RlYm9va0lkKTtcbiAgICBjb25zdCBzZWMgPSBuYj8uc2VjdGlvbnMuZmluZChzZWMgPT4gc2VjLmlkID09PSBzLnVpLnNlY3Rpb25JZCk7XG4gICAgY29uc3QgcGcgPSBzZWMgPyBmaW5kSW5UcmVlKHNlYy5wYWdlcywgcGFnZUlkKSA6IG51bGw7XG4gICAgaWYgKHBnKSBwZy50aXRsZSA9IHRpdGxlO1xuICB9KTtcbiAgc2VuZE9wKHsgdHlwZTogJ3BhZ2UtcmVuYW1lJywgcGFnZUlkLCB0aXRsZSB9KTtcbn1cblxuLy8g4pSA4pSA4pSAIE5vdGVib29rIG9wZW4vY3JlYXRlIHZpYSBJUEMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBvcGVuTm90ZWJvb2sobm90ZWJvb2tQYXRoOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgaWYgKCFoYXNJUEMpIHJldHVybjtcbiAgX2xvZygnb3Blbk5vdGVib29rIGNhbGxlZCwgcGF0aDonLCBub3RlYm9va1BhdGgpO1xuICBjb25zdCBzdGF0ZSA9IGF3YWl0IHdpbmRvdy5ub3RlYm9vay5vcGVuKG5vdGVib29rUGF0aCk7XG4gIF9sb2coJ29wZW5Ob3RlYm9vayBJUEMgcmV0dXJuZWQg4oCUIG5vdGVib29rczonLCBzdGF0ZT8ubm90ZWJvb2tzPy5sZW5ndGgsXG4gICAgJ3NlY3Rpb25zOicsIHN0YXRlPy5ub3RlYm9va3M/LlswXT8uc2VjdGlvbnM/Lmxlbmd0aCk7XG4gIGlmIChzdGF0ZSkge1xuICAgIHNldE5vdGVib29rUGF0aChub3RlYm9va1BhdGgpO1xuXG4gICAgLy8gVHJ5IHRvIHJlc3RvcmUgc2F2ZWQgVUkgcG9zaXRpb25cbiAgICBjb25zdCBjZmcgPSBhd2FpdCB3aW5kb3cubm90ZWJvb2suZ2V0Q29uZmlnKCk7XG4gICAgY29uc3Qgc2F2ZWQgPSBjZmcudWlQb3NpdGlvbnM/Lltub3RlYm9va1BhdGhdO1xuICAgIGNvbnN0IG5iID0gc3RhdGUubm90ZWJvb2tzWzBdO1xuXG4gICAgaWYgKHNhdmVkICYmIG5iKSB7XG4gICAgICAvLyBWYWxpZGF0ZSBzYXZlZCBJRHMgc3RpbGwgZXhpc3QgaW4gdGhlIHN0YXRlXG4gICAgICBjb25zdCBzZWMgPSBuYi5zZWN0aW9ucy5maW5kKHMgPT4gcy5pZCA9PT0gc2F2ZWQuc2VjdGlvbklkKTtcbiAgICAgIGNvbnN0IHBhZ2UgPSBzZWMgPyBmaW5kSW5UcmVlKHNlYy5wYWdlcywgc2F2ZWQucGFnZUlkKSA6IG51bGw7XG4gICAgICBzdGF0ZS51aSA9IHtcbiAgICAgICAgbm90ZWJvb2tJZDogbmIuaWQsXG4gICAgICAgIHNlY3Rpb25JZDogc2VjPy5pZCA/PyBuYi5zZWN0aW9uc1swXT8uaWQgPz8gbnVsbCxcbiAgICAgICAgcGFnZUlkOiBwYWdlPy5pZCA/PyBzZWM/LnBhZ2VzWzBdPy5pZCA/PyBudWxsLFxuICAgICAgfTtcbiAgICAgIC8vIFJlc3RvcmUgbGFzdC1wYWdlLXBlci1zZWN0aW9uIG1hcFxuICAgICAgaWYgKHNhdmVkLmxhc3RQYWdlUGVyU2VjdGlvbikge1xuICAgICAgICBmb3IgKGNvbnN0IFtzZWNJZCwgcGdJZF0gb2YgT2JqZWN0LmVudHJpZXMoc2F2ZWQubGFzdFBhZ2VQZXJTZWN0aW9uKSkge1xuICAgICAgICAgIGxhc3RQYWdlUGVyU2VjdGlvbi5zZXQoc2VjSWQsIHBnSWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLnVpID0ge1xuICAgICAgICBub3RlYm9va0lkOiBuYj8uaWQgPz8gbnVsbCxcbiAgICAgICAgc2VjdGlvbklkOiBuYj8uc2VjdGlvbnNbMF0/LmlkID8/IG51bGwsXG4gICAgICAgIHBhZ2VJZDogbmI/LnNlY3Rpb25zWzBdPy5wYWdlc1swXT8uaWQgPz8gbnVsbCxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgX2xvZygnb3Blbk5vdGVib29rIHNldHRpbmcgYXBwU3RhdGUg4oCUIHVpOicsIEpTT04uc3RyaW5naWZ5KHN0YXRlLnVpKSk7XG4gICAgYXBwU3RhdGUudmFsdWUgPSBzdGF0ZTtcbiAgICBjb25uZWN0ZWQudmFsdWUgPSB0cnVlO1xuICAgIGNsb3NlU3dpdGNoZXIoKTtcbiAgICAvLyBQZXJzaXN0IHdpdGggbm90ZWJvb2sgdGl0bGUgZm9yIHJlY2VudHNcbiAgICBjb25zdCB0aXRsZSA9IG5iPy50aXRsZSB8fCAnVW50aXRsZWQnO1xuICAgIF9sb2coJ29wZW5Ob3RlYm9vayBzYXZpbmcgY29uZmlnIOKAlCBwYXRoOicsIG5vdGVib29rUGF0aCwgJ3RpdGxlOicsIHRpdGxlKTtcbiAgICB3aW5kb3cubm90ZWJvb2suc2F2ZUNvbmZpZyh7IHBhdGg6IG5vdGVib29rUGF0aCwgbmFtZTogdGl0bGUgfSk7XG4gICAgLy8gUmVmcmVzaCByZWNlbnRzXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY2ZnLnJlY2VudE5vdGVib29rcykpIHJlY2VudE5vdGVib29rcy52YWx1ZSA9IGNmZy5yZWNlbnROb3RlYm9va3M7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBpY2tBbmRPcGVuTm90ZWJvb2soKTogUHJvbWlzZTx2b2lkPiB7XG4gIGlmICghaGFzSVBDKSByZXR1cm47XG4gIGNvbnN0IGRpciA9IGF3YWl0IHdpbmRvdy5ub3RlYm9vay5waWNrRGlyZWN0b3J5KCk7XG4gIGlmIChkaXIpIGF3YWl0IG9wZW5Ob3RlYm9vayhkaXIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlQW5kT3Blbk5vdGVib29rKCk6IFByb21pc2U8dm9pZD4ge1xuICBpZiAoIWhhc0lQQykgcmV0dXJuO1xuICBjb25zdCBkaXIgPSBhd2FpdCB3aW5kb3cubm90ZWJvb2sucGlja1NhdmVQYXRoKCk7XG4gIGlmIChkaXIpIGF3YWl0IG9wZW5Ob3RlYm9vayhkaXIpO1xufVxuXG4vLyDilIDilIDilIAgQ2xhdWRlIENoYXQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbmNvbnN0IGhhc0NsYXVkZTogYm9vbGVhbiA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmICEhd2luZG93LmNsYXVkZTtcblxuZXhwb3J0IGNvbnN0IGNsYXVkZUNoYXQgPSBzaWduYWw8Q2xhdWRlQ2hhdFN0YXRlPih7XG4gIGFjdGl2ZTogZmFsc2UsXG4gIG1lc3NhZ2VzOiBbXSxcbiAgc3RyZWFtaW5nOiBmYWxzZSxcbiAgcG9zaXRpb246IHsgeDogMTAwLCB5OiAxMDAgfSxcbiAgZXJyb3I6IG51bGwsXG59KTtcblxuZnVuY3Rpb24gdXBkYXRlQ2hhdChmbjogKGRyYWZ0OiBDbGF1ZGVDaGF0U3RhdGUpID0+IHZvaWQpOiB2b2lkIHtcbiAgY29uc3QgZHJhZnQgPSBzdHJ1Y3R1cmVkQ2xvbmUoY2xhdWRlQ2hhdC52YWx1ZSk7XG4gIGZuKGRyYWZ0KTtcbiAgY2xhdWRlQ2hhdC52YWx1ZSA9IGRyYWZ0O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3RhcnRDbGF1ZGVDaGF0KHg/OiBudW1iZXIsIHk/OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgaWYgKCFoYXNDbGF1ZGUpIHJldHVybjtcbiAgLy8gQ2xvc2UgYW55IGV4aXN0aW5nIHNlc3Npb24gZmlyc3RcbiAgaWYgKGNsYXVkZUNoYXQudmFsdWUuYWN0aXZlKSB7XG4gICAgdHJ5IHsgYXdhaXQgd2luZG93LmNsYXVkZSEuc3RvcCgpOyB9IGNhdGNoIHt9XG4gICAgd2luZG93LmNsYXVkZSEub2ZmU3RyZWFtKCk7XG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IHBhZ2VJZCA9IGFwcFN0YXRlLnZhbHVlLnVpPy5wYWdlSWQ7XG4gICAgYXdhaXQgd2luZG93LmNsYXVkZSEuc3RhcnQocGFnZUlkISk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1tjbGF1ZGVdIHN0YXJ0IGZhaWxlZDonLCBlcnIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFNldCB1cCBzdHJlYW0gbGlzdGVuZXJcbiAgd2luZG93LmNsYXVkZSEub25TdHJlYW0oKGRhdGE6IENsYXVkZVN0cmVhbURhdGEpID0+IHtcbiAgICBpZiAoZGF0YS50eXBlID09PSAndGV4dCcpIHtcbiAgICAgIHVwZGF0ZUNoYXQoYyA9PiB7XG4gICAgICAgIGNvbnN0IGxhc3QgPSBjLm1lc3NhZ2VzW2MubWVzc2FnZXMubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmIChsYXN0ICYmIGxhc3Qucm9sZSA9PT0gJ2Fzc2lzdGFudCcpIHtcbiAgICAgICAgICBsYXN0LmNvbnRlbnQgPSBkYXRhLmNvbnRlbnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoZGF0YS50eXBlID09PSAndG9vbF91c2UnKSB7XG4gICAgICB1cGRhdGVDaGF0KGMgPT4ge1xuICAgICAgICBjb25zdCBsYXN0ID0gYy5tZXNzYWdlc1tjLm1lc3NhZ2VzLmxlbmd0aCAtIDFdO1xuICAgICAgICBpZiAobGFzdCAmJiBsYXN0LnJvbGUgPT09ICdhc3Npc3RhbnQnICYmICFsYXN0LmNvbnRlbnQpIHtcbiAgICAgICAgICBsYXN0LmNvbnRlbnQgPSBgKlVzaW5nICR7ZGF0YS50b29sfS4uLipgO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGRhdGEudHlwZSA9PT0gJ2RvbmUnKSB7XG4gICAgICB1cGRhdGVDaGF0KGMgPT4ge1xuICAgICAgICBjLnN0cmVhbWluZyA9IGZhbHNlO1xuICAgICAgICBjb25zdCBsYXN0ID0gYy5tZXNzYWdlc1tjLm1lc3NhZ2VzLmxlbmd0aCAtIDFdO1xuICAgICAgICBpZiAobGFzdCAmJiBsYXN0LnJvbGUgPT09ICdhc3Npc3RhbnQnICYmIGRhdGEucmVzdWx0KSB7XG4gICAgICAgICAgbGFzdC5jb250ZW50ID0gZGF0YS5yZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoZGF0YS50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICB1cGRhdGVDaGF0KGMgPT4ge1xuICAgICAgICBjLnN0cmVhbWluZyA9IGZhbHNlO1xuICAgICAgICBjLmVycm9yID0gZGF0YS5tZXNzYWdlO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBjbGF1ZGVDaGF0LnZhbHVlID0ge1xuICAgIGFjdGl2ZTogdHJ1ZSxcbiAgICBtZXNzYWdlczogW10sXG4gICAgc3RyZWFtaW5nOiBmYWxzZSxcbiAgICBwb3NpdGlvbjogeyB4OiB4ID8/IDEwMCwgeTogeSA/PyAxMDAgfSxcbiAgICBlcnJvcjogbnVsbCxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludGVycnVwdENsYXVkZSgpOiB2b2lkIHtcbiAgaWYgKCFoYXNDbGF1ZGUpIHJldHVybjtcbiAgd2luZG93LmNsYXVkZSEuaW50ZXJydXB0KCkuY2F0Y2goKCkgPT4ge30pO1xuICB1cGRhdGVDaGF0KGMgPT4geyBjLnN0cmVhbWluZyA9IGZhbHNlOyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbmRDbGF1ZGVNZXNzYWdlKHRleHQ6IHN0cmluZyk6IHZvaWQge1xuICBpZiAoIWhhc0NsYXVkZSB8fCAhY2xhdWRlQ2hhdC52YWx1ZS5hY3RpdmUpIHJldHVybjtcblxuICAvLyBJZiBzdHJlYW1pbmcsIGludGVycnVwdCBjdXJyZW50IHJlc3BvbnNlIGZpcnN0XG4gIGlmIChjbGF1ZGVDaGF0LnZhbHVlLnN0cmVhbWluZykge1xuICAgIHdpbmRvdy5jbGF1ZGUhLmludGVycnVwdCgpLmNhdGNoKCgpID0+IHt9KTtcbiAgfVxuXG4gIHVwZGF0ZUNoYXQoYyA9PiB7XG4gICAgYy5tZXNzYWdlcy5wdXNoKHsgcm9sZTogJ3VzZXInLCBjb250ZW50OiB0ZXh0IH0pO1xuICAgIGMubWVzc2FnZXMucHVzaCh7IHJvbGU6ICdhc3Npc3RhbnQnLCBjb250ZW50OiAnJyB9KTtcbiAgICBjLnN0cmVhbWluZyA9IHRydWU7XG4gICAgYy5lcnJvciA9IG51bGw7XG4gIH0pO1xuXG4gIHdpbmRvdy5jbGF1ZGUhLm1lc3NhZ2UodGV4dCkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICB1cGRhdGVDaGF0KGMgPT4ge1xuICAgICAgYy5zdHJlYW1pbmcgPSBmYWxzZTtcbiAgICAgIGMuZXJyb3IgPSBlcnIubWVzc2FnZTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9zZUNsYXVkZUNoYXQoKTogdm9pZCB7XG4gIGlmIChoYXNDbGF1ZGUpIHtcbiAgICB3aW5kb3cuY2xhdWRlIS5zdG9wKCkuY2F0Y2goKCkgPT4ge30pO1xuICAgIHdpbmRvdy5jbGF1ZGUhLm9mZlN0cmVhbSgpO1xuICB9XG4gIGNsYXVkZUNoYXQudmFsdWUgPSB7XG4gICAgYWN0aXZlOiBmYWxzZSxcbiAgICBtZXNzYWdlczogW10sXG4gICAgc3RyZWFtaW5nOiBmYWxzZSxcbiAgICBwb3NpdGlvbjogeyB4OiAxMDAsIHk6IDEwMCB9LFxuICAgIGVycm9yOiBudWxsLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQ2xhdWRlQ2hhdFBvc2l0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gIGNvbnN0IGMgPSBjbGF1ZGVDaGF0LnZhbHVlO1xuICBjbGF1ZGVDaGF0LnZhbHVlID0geyAuLi5jLCBwb3NpdGlvbjogeyB4LCB5IH0gfTtcbn1cblxuLy8g4pSA4pSA4pSAIERpc3BsYXkgUGFuZWwgKE1DUC1jb250cm9sbGVkIGlmcmFtZSkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbmV4cG9ydCBjb25zdCBkaXNwbGF5UGFuZWwgPSBzaWduYWw8RGlzcGxheVBhbmVsU3RhdGU+KHtcbiAgYWN0aXZlOiBmYWxzZSxcbiAgdXJpOiBudWxsLFxuICBwb3NpdGlvbjogeyB4OiA0ODAsIHk6IDgwIH0sXG59KTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZURpc3BsYXlQYW5lbFBvc2l0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gIGNvbnN0IGQgPSBkaXNwbGF5UGFuZWwudmFsdWU7XG4gIGRpc3BsYXlQYW5lbC52YWx1ZSA9IHsgLi4uZCwgcG9zaXRpb246IHsgeCwgeSB9IH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9zZURpc3BsYXlQYW5lbCgpOiB2b2lkIHtcbiAgZGlzcGxheVBhbmVsLnZhbHVlID0geyAuLi5kaXNwbGF5UGFuZWwudmFsdWUsIGFjdGl2ZTogZmFsc2UsIHVyaTogbnVsbCB9O1xufVxuXG4vLyBMaXN0ZW4gZm9yIGRpc3BsYXkgY29tbWFuZHMgZnJvbSBNQ1Agc2VydmVyIHZpYSBtYWluIHByb2Nlc3NcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuZGlzcGxheSkge1xuICB3aW5kb3cuZGlzcGxheS5vbkNvbW1hbmQoKGNtZDogRGlzcGxheUNvbW1hbmQpID0+IHtcbiAgICBjb25zb2xlLmxvZygnW2Rpc3BsYXldIGNvbW1hbmQ6JywgY21kKTtcbiAgICBpZiAoY21kLmFjdGlvbiA9PT0gJ29wZW4nKSB7XG4gICAgICBkaXNwbGF5UGFuZWwudmFsdWUgPSB7IC4uLmRpc3BsYXlQYW5lbC52YWx1ZSwgYWN0aXZlOiB0cnVlLCB1cmk6IGNtZC51cmkgfTtcbiAgICB9IGVsc2UgaWYgKGNtZC5hY3Rpb24gPT09ICdyZWZyZXNoJykge1xuICAgICAgLy8gVG9nZ2xlIHVyaSB0byBmb3JjZSBpZnJhbWUgcmVsb2FkXG4gICAgICBjb25zdCBkID0gZGlzcGxheVBhbmVsLnZhbHVlO1xuICAgICAgaWYgKGQuYWN0aXZlICYmIGQudXJpKSB7XG4gICAgICAgIGRpc3BsYXlQYW5lbC52YWx1ZSA9IHsgLi4uZCwgdXJpOiBkLnVyaSArIChkLnVyaS5pbmNsdWRlcygnPycpID8gJyYnIDogJz8nKSArICdfcj0nICsgRGF0ZS5ub3coKSB9O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY21kLmFjdGlvbiA9PT0gJ2Nsb3NlJykge1xuICAgICAgZGlzcGxheVBhbmVsLnZhbHVlID0geyAuLi5kaXNwbGF5UGFuZWwudmFsdWUsIGFjdGl2ZTogZmFsc2UsIHVyaTogbnVsbCB9O1xuICAgIH1cbiAgfSk7XG59XG5cbi8vIOKUgOKUgOKUgCBMaXN0ZW4gZm9yIHN0YXRlIGNoYW5nZXMgKGluaXRpYWwgcHVzaCArIHJlbW90ZSBzeW5jKSDilIDilIBcblxuaWYgKGhhc0lQQykge1xuICB3aW5kb3cubm90ZWJvb2sub25TdGF0ZUNoYW5nZWQoYXN5bmMgKHN0YXRlOiBBcHBTdGF0ZSkgPT4ge1xuICAgIF9sb2coJ29uU3RhdGVDaGFuZ2VkIGZpcmVkIOKAlCBub3RlYm9va3M6Jywgc3RhdGU/Lm5vdGVib29rcz8ubGVuZ3RoLFxuICAgICAgJ3NlY3Rpb25zOicsIHN0YXRlPy5ub3RlYm9va3M/LlswXT8uc2VjdGlvbnM/Lmxlbmd0aCxcbiAgICAgICduYlswXS50aXRsZTonLCBzdGF0ZT8ubm90ZWJvb2tzPy5bMF0/LnRpdGxlKTtcbiAgICBpZiAoIXN0YXRlIHx8ICFzdGF0ZS5ub3RlYm9va3MpIHsgX2xvZygnb25TdGF0ZUNoYW5nZWQ6IG5vIHN0YXRlL25vdGVib29rcywgaWdub3JpbmcnKTsgcmV0dXJuOyB9XG5cbiAgICAvLyBDaGVjayBpZiBjdXJyZW50IFVJIElEcyBhcmUgdmFsaWQgaW4gdGhlIGluY29taW5nIHN0YXRlXG4gICAgY29uc3QgdWkgPSBhcHBTdGF0ZS52YWx1ZS51aTtcbiAgICBjb25zdCBuYkV4aXN0cyA9IHN0YXRlLm5vdGVib29rcy5maW5kKG4gPT4gbi5pZCA9PT0gdWkubm90ZWJvb2tJZCk7XG4gICAgaWYgKG5iRXhpc3RzKSB7XG4gICAgICAvLyBVSSBJRHMgYXJlIHN0aWxsIHZhbGlkIOKAlCBwcmVzZXJ2ZSBuYXZpZ2F0aW9uXG4gICAgICBzdGF0ZS51aSA9IHVpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGaXJzdCBsb2FkIOKAlCB0cnkgdG8gcmVzdG9yZSBzYXZlZCBVSSBwb3NpdGlvblxuICAgICAgY29uc3QgbmIgPSBzdGF0ZS5ub3RlYm9va3NbMF07XG4gICAgICBsZXQgcmVzdG9yZWQgPSBmYWxzZTtcblxuICAgICAgLy8gSWYgdGhlIGluY29taW5nIHN0YXRlIGFscmVhZHkgaGFzIHZhbGlkIFVJIChlLmcuIHNldCBieSBicm93c2VyIHNoaW0gZnJvbSBVUkwgaGFzaCksIGtlZXAgaXRcbiAgICAgIGlmIChzdGF0ZS51aT8uc2VjdGlvbklkICYmIG5iKSB7XG4gICAgICAgIGNvbnN0IHNlYyA9IG5iLnNlY3Rpb25zLmZpbmQocyA9PiBzLmlkID09PSBzdGF0ZS51aS5zZWN0aW9uSWQpO1xuICAgICAgICBpZiAoc2VjKSB7XG4gICAgICAgICAgc3RhdGUudWkubm90ZWJvb2tJZCA9IG5iLmlkO1xuICAgICAgICAgIHJlc3RvcmVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIXJlc3RvcmVkICYmICFfbm90ZWJvb2tQYXRoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgY2ZnID0gYXdhaXQgd2luZG93Lm5vdGVib29rLmdldENvbmZpZygpO1xuICAgICAgICAgIGlmIChjZmcubm90ZWJvb2tQYXRoKSB7XG4gICAgICAgICAgICBzZXROb3RlYm9va1BhdGgoY2ZnLm5vdGVib29rUGF0aCk7XG4gICAgICAgICAgICBjb25zdCBzYXZlZCA9IGNmZy51aVBvc2l0aW9ucz8uW2NmZy5ub3RlYm9va1BhdGhdO1xuICAgICAgICAgICAgaWYgKHNhdmVkICYmIG5iKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHNlYyA9IG5iLnNlY3Rpb25zLmZpbmQocyA9PiBzLmlkID09PSBzYXZlZC5zZWN0aW9uSWQpO1xuICAgICAgICAgICAgICBjb25zdCBwYWdlID0gc2VjID8gZmluZEluVHJlZShzZWMucGFnZXMsIHNhdmVkLnBhZ2VJZCkgOiBudWxsO1xuICAgICAgICAgICAgICBzdGF0ZS51aSA9IHtcbiAgICAgICAgICAgICAgICBub3RlYm9va0lkOiBuYi5pZCxcbiAgICAgICAgICAgICAgICBzZWN0aW9uSWQ6IHNlYz8uaWQgPz8gbmIuc2VjdGlvbnNbMF0/LmlkID8/IG51bGwsXG4gICAgICAgICAgICAgICAgcGFnZUlkOiBwYWdlPy5pZCA/PyBzZWM/LnBhZ2VzWzBdPy5pZCA/PyBudWxsLFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAvLyBSZXN0b3JlIGxhc3QtcGFnZS1wZXItc2VjdGlvbiBtYXBcbiAgICAgICAgICAgICAgaWYgKHNhdmVkLmxhc3RQYWdlUGVyU2VjdGlvbikge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW3NlY0lkLCBwZ0lkXSBvZiBPYmplY3QuZW50cmllcyhzYXZlZC5sYXN0UGFnZVBlclNlY3Rpb24pKSB7XG4gICAgICAgICAgICAgICAgICBsYXN0UGFnZVBlclNlY3Rpb24uc2V0KHNlY0lkLCBwZ0lkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVzdG9yZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCB7fVxuICAgICAgfVxuICAgICAgaWYgKCFyZXN0b3JlZCkge1xuICAgICAgICBzdGF0ZS51aSA9IHtcbiAgICAgICAgICBub3RlYm9va0lkOiBuYj8uaWQgPz8gbnVsbCxcbiAgICAgICAgICBzZWN0aW9uSWQ6IG5iPy5zZWN0aW9uc1swXT8uaWQgPz8gbnVsbCxcbiAgICAgICAgICBwYWdlSWQ6IG5iPy5zZWN0aW9uc1swXT8ucGFnZXNbMF0/LmlkID8/IG51bGwsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFJlc3RvcmUgcGVyLXBhZ2UgcGFuL3pvb20gZnJvbSBsb2NhbCBjb25maWcgaW50byB0aGUgc3RhdGVcbiAgICBpZiAoX25vdGVib29rUGF0aCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY2ZnID0gYXdhaXQgd2luZG93Lm5vdGVib29rLmdldENvbmZpZygpO1xuICAgICAgICBjb25zdCB2aWV3cyA9IGNmZy5wYWdlVmlld3M/Lltfbm90ZWJvb2tQYXRoXTtcbiAgICAgICAgaWYgKHZpZXdzKSB7XG4gICAgICAgICAgZnVuY3Rpb24gYXBwbHlWaWV3cyhwYWdlczogUGFnZVtdKTogdm9pZCB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBnIG9mIHBhZ2VzKSB7XG4gICAgICAgICAgICAgIGlmICh2aWV3cyFbcGcuaWRdKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBwYW5YLCBwYW5ZLCB6b29tIH0gPSB2aWV3cyFbcGcuaWRdO1xuICAgICAgICAgICAgICAgIGlmIChwYW5YICE9IG51bGwpIHBnLnBhblggPSBwYW5YO1xuICAgICAgICAgICAgICAgIGlmIChwYW5ZICE9IG51bGwpIHBnLnBhblkgPSBwYW5ZO1xuICAgICAgICAgICAgICAgIGlmICh6b29tICE9IG51bGwpIHBnLnpvb20gPSB6b29tO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChwZy5jaGlsZHJlbj8ubGVuZ3RoKSBhcHBseVZpZXdzKHBnLmNoaWxkcmVuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yIChjb25zdCBuYiBvZiBzdGF0ZS5ub3RlYm9va3MpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgc2VjIG9mIG5iLnNlY3Rpb25zKSBhcHBseVZpZXdzKHNlYy5wYWdlcyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFJlc3RvcmUgY2FyZXQgcG9zaXRpb25zIGZyb20gdGhlIHNhbWUgcGFnZVZpZXdzIGRhdGFcbiAgICAgICAgICBmb3IgKGNvbnN0IFtwYWdlSWQsIHZdIG9mIE9iamVjdC5lbnRyaWVzKHZpZXdzKSkge1xuICAgICAgICAgICAgaWYgKHYuY2FyZXRCbG9ja0lkKSB7XG4gICAgICAgICAgICAgIGxhc3RDYXJldFBlclBhZ2Uuc2V0KHBhZ2VJZCwgeyBibG9ja0lkOiB2LmNhcmV0QmxvY2tJZCwgb2Zmc2V0OiB2LmNhcmV0T2Zmc2V0ID8/IDAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIHt9XG4gICAgfVxuXG4gICAgX2xvZygnb25TdGF0ZUNoYW5nZWQgYXBwbGllZCDigJQgdWk6JywgSlNPTi5zdHJpbmdpZnkoc3RhdGUudWkpLCAnX25vdGVib29rUGF0aDonLCBfbm90ZWJvb2tQYXRoKTtcbiAgICBhcHBTdGF0ZS52YWx1ZSA9IHsgLi4uc3RhdGUgfTtcbiAgICBjb25uZWN0ZWQudmFsdWUgPSB0cnVlO1xuICAgIGluaXRpYWxpemluZy52YWx1ZSA9IGZhbHNlO1xuICB9KTtcbn1cbiIsCiAgICAiaW1wb3J0e29wdGlvbnMgYXMgcixGcmFnbWVudCBhcyBlfWZyb21cInByZWFjdFwiO2V4cG9ydHtGcmFnbWVudH1mcm9tXCJwcmVhY3RcIjt2YXIgdD0vW1wiJjxdLztmdW5jdGlvbiBuKHIpe2lmKDA9PT1yLmxlbmd0aHx8ITE9PT10LnRlc3QocikpcmV0dXJuIHI7Zm9yKHZhciBlPTAsbj0wLG89XCJcIixmPVwiXCI7bjxyLmxlbmd0aDtuKyspe3N3aXRjaChyLmNoYXJDb2RlQXQobikpe2Nhc2UgMzQ6Zj1cIiZxdW90O1wiO2JyZWFrO2Nhc2UgMzg6Zj1cIiZhbXA7XCI7YnJlYWs7Y2FzZSA2MDpmPVwiJmx0O1wiO2JyZWFrO2RlZmF1bHQ6Y29udGludWV9biE9PWUmJihvKz1yLnNsaWNlKGUsbikpLG8rPWYsZT1uKzF9cmV0dXJuIG4hPT1lJiYobys9ci5zbGljZShlLG4pKSxvfXZhciBvPS9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8Z3JpZHxvd3N8bW5jfG50d3xpbmVbY2hdfHpvb3xeb3JkfGl0ZXJhL2ksZj0wLGk9QXJyYXkuaXNBcnJheTtmdW5jdGlvbiB1KGUsdCxuLG8saSx1KXt0fHwodD17fSk7dmFyIGEsYyxwPXQ7aWYoXCJyZWZcImluIHApZm9yKGMgaW4gcD17fSx0KVwicmVmXCI9PWM/YT10W2NdOnBbY109dFtjXTt2YXIgbD17dHlwZTplLHByb3BzOnAsa2V5Om4scmVmOmEsX19rOm51bGwsX186bnVsbCxfX2I6MCxfX2U6bnVsbCxfX2M6bnVsbCxjb25zdHJ1Y3Rvcjp2b2lkIDAsX192Oi0tZixfX2k6LTEsX191OjAsX19zb3VyY2U6aSxfX3NlbGY6dX07aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZSYmKGE9ZS5kZWZhdWx0UHJvcHMpKWZvcihjIGluIGEpdm9pZCAwPT09cFtjXSYmKHBbY109YVtjXSk7cmV0dXJuIHIudm5vZGUmJnIudm5vZGUobCksbH1mdW5jdGlvbiBhKHIpe3ZhciB0PXUoZSx7dHBsOnIsZXhwcnM6W10uc2xpY2UuY2FsbChhcmd1bWVudHMsMSl9KTtyZXR1cm4gdC5rZXk9dC5fX3YsdH12YXIgYz17fSxwPS9bQS1aXS9nO2Z1bmN0aW9uIGwoZSx0KXtpZihyLmF0dHIpe3ZhciBmPXIuYXR0cihlLHQpO2lmKFwic3RyaW5nXCI9PXR5cGVvZiBmKXJldHVybiBmfWlmKHQ9ZnVuY3Rpb24ocil7cmV0dXJuIG51bGwhPT1yJiZcIm9iamVjdFwiPT10eXBlb2YgciYmXCJmdW5jdGlvblwiPT10eXBlb2Ygci52YWx1ZU9mP3IudmFsdWVPZigpOnJ9KHQpLFwicmVmXCI9PT1lfHxcImtleVwiPT09ZSlyZXR1cm5cIlwiO2lmKFwic3R5bGVcIj09PWUmJlwib2JqZWN0XCI9PXR5cGVvZiB0KXt2YXIgaT1cIlwiO2Zvcih2YXIgdSBpbiB0KXt2YXIgYT10W3VdO2lmKG51bGwhPWEmJlwiXCIhPT1hKXt2YXIgbD1cIi1cIj09dVswXT91OmNbdV18fChjW3VdPXUucmVwbGFjZShwLFwiLSQmXCIpLnRvTG93ZXJDYXNlKCkpLHM9XCI7XCI7XCJudW1iZXJcIiE9dHlwZW9mIGF8fGwuc3RhcnRzV2l0aChcIi0tXCIpfHxvLnRlc3QobCl8fChzPVwicHg7XCIpLGk9aStsK1wiOlwiK2Erc319cmV0dXJuIGUrJz1cIicrbihpKSsnXCInfXJldHVybiBudWxsPT10fHwhMT09PXR8fFwiZnVuY3Rpb25cIj09dHlwZW9mIHR8fFwib2JqZWN0XCI9PXR5cGVvZiB0P1wiXCI6ITA9PT10P2U6ZSsnPVwiJytuKFwiXCIrdCkrJ1wiJ31mdW5jdGlvbiBzKHIpe2lmKG51bGw9PXJ8fFwiYm9vbGVhblwiPT10eXBlb2Ygcnx8XCJmdW5jdGlvblwiPT10eXBlb2YgcilyZXR1cm4gbnVsbDtpZihcIm9iamVjdFwiPT10eXBlb2Ygcil7aWYodm9pZCAwPT09ci5jb25zdHJ1Y3RvcilyZXR1cm4gcjtpZihpKHIpKXtmb3IodmFyIGU9MDtlPHIubGVuZ3RoO2UrKylyW2VdPXMocltlXSk7cmV0dXJuIHJ9fXJldHVybiBuKFwiXCIrcil9ZXhwb3J0e3UgYXMganN4LGwgYXMganN4QXR0cix1IGFzIGpzeERFVixzIGFzIGpzeEVzY2FwZSxhIGFzIGpzeFRlbXBsYXRlLHUgYXMganN4c307XG4vLyMgc291cmNlTWFwcGluZ1VSTD1qc3hSdW50aW1lLm1vZHVsZS5qcy5tYXBcbiIsCiAgICAiaW1wb3J0IHsgc2lnbmFsIH0gZnJvbSAnQHByZWFjdC9zaWduYWxzJztcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgdHlwZSB7IEpTWCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgdHlwZSB7IE1lbnVJdGVtLCBNZW51SXRlbVJlbmFtZSwgTWVudUl0ZW1Db25maXJtLCBNZW51SXRlbVN1Ym1lbnUsIENvbnRleHRNZW51U3RhdGUgfSBmcm9tICcuL3R5cGVzLnRzJztcblxuLy8g4pSA4pSAIEdsb2JhbCBjb250ZXh0IG1lbnUgc3RhdGUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5leHBvcnQgY29uc3QgY29udGV4dE1lbnUgPSBzaWduYWw8Q29udGV4dE1lbnVTdGF0ZSB8IG51bGw+KG51bGwpO1xuXG5leHBvcnQgZnVuY3Rpb24gb3BlbkNvbnRleHRNZW51KHg6IG51bWJlciwgeTogbnVtYmVyLCBpdGVtczogTWVudUl0ZW1bXSk6IHZvaWQge1xuICBjb250ZXh0TWVudS52YWx1ZSA9IHsgeCwgeSwgaXRlbXMgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsb3NlQ29udGV4dE1lbnUoKTogdm9pZCB7XG4gIGNvbnRleHRNZW51LnZhbHVlID0gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5SZW5hbWVNZW51KHg6IG51bWJlciwgeTogbnVtYmVyLCBjdXJyZW50TmFtZTogc3RyaW5nLCBvblJlbmFtZTogKG5ld05hbWU6IHN0cmluZykgPT4gdm9pZCk6IHZvaWQge1xuICBjb250ZXh0TWVudS52YWx1ZSA9IHtcbiAgICB4LCB5LFxuICAgIGl0ZW1zOiBbeyB0eXBlOiAncmVuYW1lJywgdmFsdWU6IGN1cnJlbnROYW1lLCBhY3Rpb246IG9uUmVuYW1lIH1dLFxuICB9O1xufVxuXG4vLyDilIDilIAgQ29tcG9uZW50IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuZXhwb3J0IGZ1bmN0aW9uIENvbnRleHRNZW51KCk6IEpTWC5FbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IG1lbnUgPSBjb250ZXh0TWVudS52YWx1ZTtcbiAgY29uc3QgcmVmID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PihudWxsKTtcbiAgY29uc3QgW2NvbmZpcm1JZCwgc2V0Q29uZmlybUlkXSA9IHVzZVN0YXRlPG51bWJlciB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbcmVuYW1lVmFsLCBzZXRSZW5hbWVWYWxdID0gdXNlU3RhdGU8c3RyaW5nPignJyk7XG4gIGNvbnN0IHJlbmFtZVJlZiA9IHVzZVJlZjxIVE1MSW5wdXRFbGVtZW50PihudWxsKTtcblxuICAvLyBSZXNldCBjb25maXJtIHN0YXRlIHdoZW4gbWVudSBjaGFuZ2VzXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0Q29uZmlybUlkKG51bGwpO1xuICAgIGlmIChtZW51KSB7XG4gICAgICBjb25zdCByZW5hbWVJdGVtID0gbWVudS5pdGVtcy5maW5kKGkgPT4gaS50eXBlID09PSAncmVuYW1lJykgYXMgTWVudUl0ZW1SZW5hbWUgfCB1bmRlZmluZWQ7XG4gICAgICBpZiAocmVuYW1lSXRlbSkgc2V0UmVuYW1lVmFsKHJlbmFtZUl0ZW0udmFsdWUgfHwgJycpO1xuICAgIH1cbiAgfSwgW21lbnVdKTtcblxuICAvLyBGb2N1cyByZW5hbWUgaW5wdXRcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAobWVudSAmJiByZW5hbWVSZWYuY3VycmVudCkge1xuICAgICAgcmVuYW1lUmVmLmN1cnJlbnQuZm9jdXMoKTtcbiAgICAgIHJlbmFtZVJlZi5jdXJyZW50LnNlbGVjdCgpO1xuICAgIH1cbiAgfSwgW21lbnVdKTtcblxuICAvLyBDbG9zZSBvbiBvdXRzaWRlIGNsaWNrLCBlc2NhcGUsIHNjcm9sbFxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghbWVudSkgcmV0dXJuO1xuICAgIGZ1bmN0aW9uIG9uRG93bihlOiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgICBpZiAocmVmLmN1cnJlbnQgJiYgIXJlZi5jdXJyZW50LmNvbnRhaW5zKGUudGFyZ2V0IGFzIE5vZGUpKSBjbG9zZUNvbnRleHRNZW51KCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uS2V5KGU6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIGNsb3NlQ29udGV4dE1lbnUoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25TY3JvbGwoKTogdm9pZCB7IGNsb3NlQ29udGV4dE1lbnUoKTsgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG93biwgdHJ1ZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgb25TY3JvbGwsIHRydWUpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvd24sIHRydWUpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5KTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBvblNjcm9sbCwgdHJ1ZSk7XG4gICAgfTtcbiAgfSwgW21lbnVdKTtcblxuICBpZiAoIW1lbnUpIHJldHVybiBudWxsO1xuXG4gIC8vIENsYW1wIHBvc2l0aW9uIHRvIHZpZXdwb3J0XG4gIGNvbnN0IG1lbnVXID0gMjAwLCBtZW51SCA9IG1lbnUuaXRlbXMubGVuZ3RoICogMzIgKyA4O1xuICBjb25zdCB4ID0gTWF0aC5taW4obWVudS54LCB3aW5kb3cuaW5uZXJXaWR0aCAtIG1lbnVXIC0gNCk7XG4gIGNvbnN0IHkgPSBNYXRoLm1pbihtZW51LnksIHdpbmRvdy5pbm5lckhlaWdodCAtIG1lbnVIIC0gNCk7XG5cbiAgZnVuY3Rpb24gaGFuZGxlUmVuYW1lU3VibWl0KGl0ZW06IE1lbnVJdGVtUmVuYW1lKTogdm9pZCB7XG4gICAgY29uc3QgdiA9IHJlbmFtZVZhbC50cmltKCk7XG4gICAgaWYgKHYgJiYgdiAhPT0gaXRlbS52YWx1ZSkgaXRlbS5hY3Rpb24odik7XG4gICAgY2xvc2VDb250ZXh0TWVudSgpO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzPVwiY29udGV4dC1tZW51XCIgcmVmPXtyZWZ9IHN0eWxlPXt7IGxlZnQ6IHggKyAncHgnLCB0b3A6IHkgKyAncHgnIH19IG9uTW91c2VEb3duPXsoZTogTW91c2VFdmVudCkgPT4gZS5wcmV2ZW50RGVmYXVsdCgpfT5cbiAgICAgIHttZW51Lml0ZW1zLm1hcCgoaXRlbSwgaSkgPT4ge1xuICAgICAgICBpZiAoaXRlbS50eXBlID09PSAnc2VwYXJhdG9yJykge1xuICAgICAgICAgIHJldHVybiA8ZGl2IGtleT17aX0gY2xhc3M9XCJjb250ZXh0LW1lbnUtc2VwYXJhdG9yXCIgLz47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlbS50eXBlID09PSAncmVuYW1lJykge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGtleT17aX0gY2xhc3M9XCJjb250ZXh0LW1lbnUtcmVuYW1lXCI+XG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIHJlZj17cmVuYW1lUmVmfVxuICAgICAgICAgICAgICAgIGNsYXNzPVwiY29udGV4dC1tZW51LWlucHV0XCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cmVuYW1lVmFsfVxuICAgICAgICAgICAgICAgIG9uSW5wdXQ9eyhlOiBFdmVudCkgPT4gc2V0UmVuYW1lVmFsKChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSl9XG4gICAgICAgICAgICAgICAgb25LZXlEb3duPXsoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSBoYW5kbGVSZW5hbWVTdWJtaXQoaXRlbSk7XG4gICAgICAgICAgICAgICAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSBjbG9zZUNvbnRleHRNZW51KCk7XG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNvbnRleHQtbWVudS1yZW5hbWUtb2tcIiBvbkNsaWNrPXsoKSA9PiBoYW5kbGVSZW5hbWVTdWJtaXQoaXRlbSl9PuKckzwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpdGVtLnR5cGUgPT09ICdjb25maXJtJykge1xuICAgICAgICAgIGNvbnN0IGNvbmZpcm1JdGVtID0gaXRlbSBhcyBNZW51SXRlbUNvbmZpcm07XG4gICAgICAgICAgY29uc3QgaXNDb25maXJtaW5nID0gY29uZmlybUlkID09PSBpO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGtleT17aX1cbiAgICAgICAgICAgICAgY2xhc3M9e2Bjb250ZXh0LW1lbnUtaXRlbSAke2lzQ29uZmlybWluZyA/ICdjb250ZXh0LW1lbnUtaXRlbS0tZGFuZ2VyJyA6ICcnfWB9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaXNDb25maXJtaW5nKSB7IGNvbmZpcm1JdGVtLmFjdGlvbigpOyBjbG9zZUNvbnRleHRNZW51KCk7IH1cbiAgICAgICAgICAgICAgICBlbHNlIHNldENvbmZpcm1JZChpKTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2lzQ29uZmlybWluZyA/IChjb25maXJtSXRlbS5jb25maXJtTGFiZWwgfHwgJ0NvbmZpcm0gZGVsZXRlPycpIDogY29uZmlybUl0ZW0ubGFiZWx9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gJ3N1Ym1lbnUnKSB7XG4gICAgICAgICAgY29uc3Qgc3VibWVudUl0ZW0gPSBpdGVtIGFzIE1lbnVJdGVtU3VibWVudTtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBrZXk9e2l9IGNsYXNzPVwiY29udGV4dC1tZW51LWl0ZW0gY29udGV4dC1tZW51LXN1Ym1lbnVcIj5cbiAgICAgICAgICAgICAgPHNwYW4+e3N1Ym1lbnVJdGVtLmxhYmVsfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjb250ZXh0LW1lbnUtYXJyb3dcIj7ilrg8L3NwYW4+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZXh0LW1lbnUtc3ViXCI+XG4gICAgICAgICAgICAgICAge3N1Ym1lbnVJdGVtLmNoaWxkcmVuLm1hcCgoY2hpbGQsIGopID0+IChcbiAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtqfSBjbGFzcz1cImNvbnRleHQtbWVudS1pdGVtXCIgb25DbGljaz17KCkgPT4geyBjaGlsZC5hY3Rpb24oKTsgY2xvc2VDb250ZXh0TWVudSgpOyB9fT5cbiAgICAgICAgICAgICAgICAgICAge2NoaWxkLmxhYmVsfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vcm1hbCBpdGVtIChwb3NzaWJseSBkaXNhYmxlZClcbiAgICAgICAgaWYgKGl0ZW0uZGlzYWJsZWQpIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBrZXk9e2l9IGNsYXNzPVwiY29udGV4dC1tZW51LWl0ZW0gY29udGV4dC1tZW51LWl0ZW0tLWRpc2FibGVkXCI+XG4gICAgICAgICAgICAgIHtpdGVtLmxhYmVsfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxkaXYga2V5PXtpfSBjbGFzcz1cImNvbnRleHQtbWVudS1pdGVtXCIgb25DbGljaz17KCkgPT4geyBpdGVtLmFjdGlvbigpOyBjbG9zZUNvbnRleHRNZW51KCk7IH19PlxuICAgICAgICAgICAge2l0ZW0ubGFiZWx9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgICB9KX1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsCiAgICAiaW1wb3J0IHsgdXNlUmVmIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IGFwcFN0YXRlLCBzZXRBY3RpdmVTZWN0aW9uLCBhZGRTZWN0aW9uLCByZW5hbWVTZWN0aW9uLCBkZWxldGVTZWN0aW9uLCByZW9yZGVyU2VjdGlvbnMgfSBmcm9tICcuL3N0b3JlLnRzJztcblxuY29uc3QgU0VDVElPTl9DT0xPUlMgPSBbXG4gICcjZmNlNGI4JywgJyNiOGQ0ZjAnLCAnI2M4ZTZjMCcsICcjZjBjMGMwJyxcbiAgJyNkOGM4ZjAnLCAnI2YwZDhiMCcsICcjYjhlMGUwJywgJyNmMGM4ZTAnLFxuXTtcbmltcG9ydCB7IG9wZW5Db250ZXh0TWVudSwgb3BlblJlbmFtZU1lbnUgfSBmcm9tICcuL0NvbnRleHRNZW51LnRzeCc7XG5pbXBvcnQgdHlwZSB7IEpTWCB9IGZyb20gJ3ByZWFjdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBTZWN0aW9uUGFuZWwoKTogSlNYLkVsZW1lbnQge1xuICBjb25zdCB7IG5vdGVib29rcywgdWkgfSA9IGFwcFN0YXRlLnZhbHVlO1xuICBjb25zdCBuYiA9IG5vdGVib29rcy5maW5kKG4gPT4gbi5pZCA9PT0gdWkubm90ZWJvb2tJZCk7XG4gIGNvbnN0IHNlY3Rpb25zID0gbmI/LnNlY3Rpb25zID8/IFtdO1xuICBjb25zdCBkcmFnSWQgPSB1c2VSZWY8c3RyaW5nIHwgbnVsbD4obnVsbCk7XG4gIHJldHVybiAoXG4gICAgPGRpdiBpZD1cInNlY3Rpb24tdGFic1wiPlxuICAgICAge3NlY3Rpb25zLm1hcCgoc2VjLCBpKSA9PiAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBrZXk9e3NlYy5pZH1cbiAgICAgICAgICBjbGFzcz17WydzZWMtdGFiJywgc2VjLmlkID09PSB1aS5zZWN0aW9uSWQgJiYgJ3NlYy10YWItLWFjdGl2ZSddLmZpbHRlcihCb29sZWFuKS5qb2luKCcgJyl9XG4gICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlU2VjdGlvbihzZWMuaWQpfVxuICAgICAgICAgIG9uRGJsQ2xpY2s9eyhlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBvcGVuUmVuYW1lTWVudShlLmNsaWVudFgsIGUuY2xpZW50WSwgc2VjLnRpdGxlLCB0ID0+IHJlbmFtZVNlY3Rpb24obmIhLmlkLCBzZWMuaWQsIHQpKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQ29udGV4dE1lbnU9eyhlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBvcGVuQ29udGV4dE1lbnUoZS5jbGllbnRYLCBlLmNsaWVudFksIFtcbiAgICAgICAgICAgICAgeyBsYWJlbDogJ1JlbmFtZScsIGFjdGlvbjogKCkgPT4gb3BlblJlbmFtZU1lbnUoZS5jbGllbnRYLCBlLmNsaWVudFksIHNlYy50aXRsZSwgdCA9PiByZW5hbWVTZWN0aW9uKG5iIS5pZCwgc2VjLmlkLCB0KSkgfSxcbiAgICAgICAgICAgICAgeyB0eXBlOiAnc2VwYXJhdG9yJyB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2NvbmZpcm0nLCBsYWJlbDogJ0RlbGV0ZScsXG4gICAgICAgICAgICAgICAgY29uZmlybUxhYmVsOiBzZWN0aW9ucy5sZW5ndGggPD0gMSA/ICdDYW5ub3QgZGVsZXRlIGxhc3Qgc2VjdGlvbicgOiBgRGVsZXRlIFwiJHtzZWMudGl0bGV9XCI/YCxcbiAgICAgICAgICAgICAgICBhY3Rpb246ICgpID0+IHsgaWYgKHNlY3Rpb25zLmxlbmd0aCA+IDEpIGRlbGV0ZVNlY3Rpb24obmIhLmlkLCBzZWMuaWQpOyB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBkcmFnZ2FibGVcbiAgICAgICAgICBvbkRyYWdTdGFydD17KCkgPT4geyBkcmFnSWQuY3VycmVudCA9IHNlYy5pZDsgfX1cbiAgICAgICAgICBvbkRyYWdPdmVyPXsoZTogRHJhZ0V2ZW50KSA9PiBlLnByZXZlbnREZWZhdWx0KCl9XG4gICAgICAgICAgb25Ecm9wPXsoZTogRHJhZ0V2ZW50KSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAoIWRyYWdJZC5jdXJyZW50IHx8IGRyYWdJZC5jdXJyZW50ID09PSBzZWMuaWQpIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IGlkcyA9IHNlY3Rpb25zLm1hcChzID0+IHMuaWQpO1xuICAgICAgICAgICAgY29uc3QgZnJvbSA9IGlkcy5pbmRleE9mKGRyYWdJZC5jdXJyZW50KSwgdG8gPSBpZHMuaW5kZXhPZihzZWMuaWQpO1xuICAgICAgICAgICAgY29uc3QgbmV4dCA9IFsuLi5pZHNdOyBuZXh0LnNwbGljZShmcm9tLCAxKTsgbmV4dC5zcGxpY2UodG8sIDAsIGRyYWdJZC5jdXJyZW50KTtcbiAgICAgICAgICAgIHJlb3JkZXJTZWN0aW9ucyhuYiEuaWQsIG5leHQpO1xuICAgICAgICAgICAgZHJhZ0lkLmN1cnJlbnQgPSBudWxsO1xuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7aSA+IDAgJiYgPHNwYW4gY2xhc3M9XCJzZWMtdGFiLWxlZnQtY29ybmVyXCIgLz59XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInNlYy10YWItYm9keVwiPntzZWMudGl0bGV9PC9kaXY+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJzZWMtdGFiLXJpZ2h0LWNvcm5lclwiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSl9XG4gICAgICA8YnV0dG9uIGNsYXNzPVwic2VjLWFkZFwiIG9uQ2xpY2s9eygpID0+IG5iICYmIGFkZFNlY3Rpb24obmIuaWQpfSB0aXRsZT1cIk5ldyBzZWN0aW9uXCI+KzwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwKICAgICJpbXBvcnQgeyB1c2VTdGF0ZSwgdXNlUmVmLCB1c2VFZmZlY3QsIHVzZUNhbGxiYWNrIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IGFwcFN0YXRlLCBlZGl0aW5nRW5hYmxlZCwgc2V0QWN0aXZlUGFnZSwgYWRkUGFnZSwgcmVuYW1lUGFnZSwgZGVsZXRlUGFnZSwgbW92ZVBhZ2UsIGZpbmRJblRyZWUsIHVwZGF0ZVBhZ2VUcmVlLCBwcmVsb2FkUGFnZSwgdG9nZ2xlUGFnZVZpc2liaWxpdHkgfSBmcm9tICcuL3N0b3JlLnRzJztcbmltcG9ydCB0eXBlIHsgUGFnZSwgTWVudUl0ZW0sIE1lbnVJdGVtTm9ybWFsIH0gZnJvbSAnLi90eXBlcy50cyc7XG5pbXBvcnQgdHlwZSB7IEpTWCB9IGZyb20gJ3ByZWFjdCc7XG5cbmNvbnN0IFNFQ1RJT05fQ09MT1JTID0gW1xuICAnI2ZjZTRiOCcsICcjYjhkNGYwJywgJyNjOGU2YzAnLCAnI2YwYzBjMCcsXG4gICcjZDhjOGYwJywgJyNmMGQ4YjAnLCAnI2I4ZTBlMCcsICcjZjBjOGUwJyxcbl07XG5pbXBvcnQgeyBvcGVuQ29udGV4dE1lbnUgfSBmcm9tICcuL0NvbnRleHRNZW51LnRzeCc7XG5cbi8vIOKUgOKUgCBIZWxwZXJzIGZvciBjb2xsZWN0aW5nIHBhZ2UgSURzIGZyb20gdHJlZSDilIDilIDilIDilIDilIDilIBcbmZ1bmN0aW9uIGZsYXR0ZW5QYWdlSWRzKHBhZ2VzOiBQYWdlW10pOiBzdHJpbmdbXSB7XG4gIGNvbnN0IGlkczogc3RyaW5nW10gPSBbXTtcbiAgZm9yIChjb25zdCBwIG9mIHBhZ2VzKSB7XG4gICAgaWRzLnB1c2gocC5pZCk7XG4gICAgaWYgKHAuY2hpbGRyZW4/Lmxlbmd0aCkgaWRzLnB1c2goLi4uZmxhdHRlblBhZ2VJZHMocC5jaGlsZHJlbikpO1xuICB9XG4gIHJldHVybiBpZHM7XG59XG5cbmZ1bmN0aW9uIGlzRGVzY2VuZGFudE9mKHBhZ2VzOiBQYWdlW10sIGFuY2VzdG9ySWQ6IHN0cmluZywgdGFyZ2V0SWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBhbmNlc3RvciA9IGZpbmRJblRyZWUocGFnZXMsIGFuY2VzdG9ySWQpO1xuICBpZiAoIWFuY2VzdG9yIHx8ICFhbmNlc3Rvci5jaGlsZHJlbj8ubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiAhIWZpbmRJblRyZWUoYW5jZXN0b3IuY2hpbGRyZW4sIHRhcmdldElkKTtcbn1cblxuZnVuY3Rpb24gZ2V0UGFnZVJhbmdlKHBhZ2VzOiBQYWdlW10sIGlkQTogc3RyaW5nLCBpZEI6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgZmxhdCA9IGZsYXR0ZW5QYWdlSWRzKHBhZ2VzKTtcbiAgY29uc3QgYSA9IGZsYXQuaW5kZXhPZihpZEEpLCBiID0gZmxhdC5pbmRleE9mKGlkQik7XG4gIGlmIChhID09PSAtMSB8fCBiID09PSAtMSkgcmV0dXJuIFtpZEJdO1xuICBjb25zdCBsbyA9IE1hdGgubWluKGEsIGIpLCBoaSA9IE1hdGgubWF4KGEsIGIpO1xuICByZXR1cm4gZmxhdC5zbGljZShsbywgaGkgKyAxKTtcbn1cblxuLy8g4pSA4pSAIERyYWcgc3RhdGUgKG1vZHVsZS1sZXZlbCBzbyBzaWJsaW5ncyBjYW4gc2hhcmUpIOKUgOKUgOKUgOKUgOKUgOKUgFxuY29uc3QgZHJhZzogeyBwYWdlSWQ6IHN0cmluZyB8IG51bGw7IG92ZXI6IHN0cmluZyB8IG51bGw7IG1vZGU6IHN0cmluZyB8IG51bGwgfSA9IHsgcGFnZUlkOiBudWxsLCBvdmVyOiBudWxsLCBtb2RlOiBudWxsIH07XG5cbmZ1bmN0aW9uIGRlbGV0ZVBhZ2VXaXRoQ2hpbGRyZW4ocGFnZTogUGFnZSk6IHZvaWQge1xuICBpZiAoIXBhZ2UuY2hpbGRyZW4/Lmxlbmd0aCkge1xuICAgIGRlbGV0ZVBhZ2UocGFnZS5pZCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIElmIHBhZ2UgaGFzIGNoaWxkcmVuLCBwcm9tb3RlIHRoZW0gdG8gc2libGluZ3MgdGhlbiBkZWxldGUgcGFyZW50XG4gIGNvbnN0IHMgPSBhcHBTdGF0ZS52YWx1ZTtcbiAgY29uc3QgbmIgPSBzLm5vdGVib29rcy5maW5kKG4gPT4gbi5pZCA9PT0gcy51aS5ub3RlYm9va0lkKTtcbiAgY29uc3Qgc2VjID0gbmI/LnNlY3Rpb25zLmZpbmQoc2VjID0+IHNlYy5pZCA9PT0gcy51aS5zZWN0aW9uSWQpO1xuICBpZiAoIXNlYykgcmV0dXJuO1xuICBmdW5jdGlvbiBwcm9tb3RlQ2hpbGRyZW4ocGFnZXM6IFBhZ2VbXSk6IGJvb2xlYW4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChwYWdlc1tpXS5pZCA9PT0gcGFnZS5pZCkge1xuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHBhZ2VzW2ldLmNoaWxkcmVuID8/IFtdO1xuICAgICAgICBwYWdlcy5zcGxpY2UoaSwgMSwgLi4uY2hpbGRyZW4pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChwcm9tb3RlQ2hpbGRyZW4ocGFnZXNbaV0uY2hpbGRyZW4gPz8gW10pKSByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHByb21vdGVDaGlsZHJlbihzZWMucGFnZXMpO1xuICBhcHBTdGF0ZS52YWx1ZSA9IHsgLi4uYXBwU3RhdGUudmFsdWUgfTtcbiAgdXBkYXRlUGFnZVRyZWUoc2VjLmlkLCBzZWMucGFnZXMpO1xufVxuXG5pbnRlcmZhY2UgRHJhZ1N0YXRlIHtcbiAgb3Zlcjogc3RyaW5nIHwgbnVsbDtcbiAgbW9kZTogc3RyaW5nIHwgbnVsbDtcbn1cblxuaW50ZXJmYWNlIFBhZ2VJdGVtUHJvcHMge1xuICBwYWdlOiBQYWdlO1xuICBhY3RpdmVJZDogc3RyaW5nIHwgbnVsbDtcbiAgZGVwdGg/OiBudW1iZXI7XG4gIGRyYWdTdGF0ZTogRHJhZ1N0YXRlO1xuICBvbkRyYWdDaGFuZ2U6IChpZDogc3RyaW5nIHwgbnVsbCwgbW9kZTogc3RyaW5nIHwgbnVsbCkgPT4gdm9pZDtcbiAgZWRpdGluZ0lkOiBzdHJpbmcgfCBudWxsO1xuICBvblN0YXJ0RWRpdGluZzogKGlkOiBzdHJpbmcgfCBudWxsKSA9PiB2b2lkO1xuICBzZWxlY3RlZDogU2V0PHN0cmluZz47XG4gIG9uU2VsZWN0OiAocGFnZUlkOiBzdHJpbmcgfCBudWxsLCBlPzogTW91c2VFdmVudCkgPT4gdm9pZDtcbiAgb25CdWxrRGVsZXRlOiAoKSA9PiB2b2lkO1xufVxuXG5mdW5jdGlvbiBQYWdlSXRlbSh7IHBhZ2UsIGFjdGl2ZUlkLCBkZXB0aCA9IDAsIGRyYWdTdGF0ZSwgb25EcmFnQ2hhbmdlLCBlZGl0aW5nSWQsIG9uU3RhcnRFZGl0aW5nLCBzZWxlY3RlZCwgb25TZWxlY3QsIG9uQnVsa0RlbGV0ZSB9OiBQYWdlSXRlbVByb3BzKTogSlNYLkVsZW1lbnQge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZTxib29sZWFuPih0cnVlKTtcbiAgY29uc3QgaGFzS2lkcyA9IChwYWdlLmNoaWxkcmVuPy5sZW5ndGggPz8gMCkgPiAwO1xuICBjb25zdCBpc092ZXIgPSBkcmFnU3RhdGUub3ZlciA9PT0gcGFnZS5pZDtcbiAgY29uc3QgZHJvcE1vZGUgPSBpc092ZXIgPyBkcmFnU3RhdGUubW9kZSA6IG51bGw7XG4gIGNvbnN0IGlzRWRpdGluZyA9IGVkaXRpbmdJZCA9PT0gcGFnZS5pZDtcbiAgY29uc3QgZWRpdFJlZiA9IHVzZVJlZjxIVE1MSW5wdXRFbGVtZW50PihudWxsKTtcbiAgY29uc3QgW2VkaXRWYWwsIHNldEVkaXRWYWxdID0gdXNlU3RhdGU8c3RyaW5nPihwYWdlLnRpdGxlKTtcbiAgY29uc3QgaXNTZWxlY3RlZCA9IHNlbGVjdGVkPy5oYXMocGFnZS5pZCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaXNFZGl0aW5nKSB7XG4gICAgICBzZXRFZGl0VmFsKHBhZ2UudGl0bGUpO1xuICAgICAgaWYgKGVkaXRSZWYuY3VycmVudCkge1xuICAgICAgICBlZGl0UmVmLmN1cnJlbnQuZm9jdXMoKTtcbiAgICAgICAgZWRpdFJlZi5jdXJyZW50LnNlbGVjdCgpO1xuICAgICAgfVxuICAgIH1cbiAgfSwgW2lzRWRpdGluZ10pO1xuXG4gIGZ1bmN0aW9uIGNvbW1pdEVkaXQoKTogdm9pZCB7XG4gICAgY29uc3QgdiA9IGVkaXRWYWwudHJpbSgpIHx8ICdVbnRpdGxlZCBQYWdlJztcbiAgICBpZiAodiAhPT0gcGFnZS50aXRsZSkgcmVuYW1lUGFnZShwYWdlLmlkLCB2KTtcbiAgICBvblN0YXJ0RWRpdGluZyhudWxsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uRHJhZ1N0YXJ0KGU6IERyYWdFdmVudCk6IHZvaWQge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZHJhZy5wYWdlSWQgPSBwYWdlLmlkO1xuICAgIGUuZGF0YVRyYW5zZmVyIS5lZmZlY3RBbGxvd2VkID0gJ21vdmUnO1xuICB9XG5cbiAgZnVuY3Rpb24gb25EcmFnRW5kKCk6IHZvaWQge1xuICAgIGRyYWcucGFnZUlkID0gbnVsbDtcbiAgICBvbkRyYWdDaGFuZ2UobnVsbCwgbnVsbCk7XG4gIH1cblxuICBmdW5jdGlvbiBvbkRyYWdPdmVyKGU6IERyYWdFdmVudCk6IHZvaWQge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmIChkcmFnLnBhZ2VJZCA9PT0gcGFnZS5pZCkgcmV0dXJuO1xuICAgIGNvbnN0IHJlY3QgPSAoZS5jdXJyZW50VGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCByZWwgPSAoZS5jbGllbnRZIC0gcmVjdC50b3ApIC8gcmVjdC5oZWlnaHQ7XG4gICAgY29uc3QgbW9kZSA9IHJlbCA8IDAuMyA/ICdiZWZvcmUnIDogcmVsID4gMC43ID8gJ2FmdGVyJyA6ICdjaGlsZCc7XG4gICAgaWYgKGRyYWdTdGF0ZS5vdmVyICE9PSBwYWdlLmlkIHx8IGRyYWdTdGF0ZS5tb2RlICE9PSBtb2RlKSB7XG4gICAgICBvbkRyYWdDaGFuZ2UocGFnZS5pZCwgbW9kZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25EcmFnTGVhdmUoZTogRHJhZ0V2ZW50KTogdm9pZCB7XG4gICAgaWYgKCEoZS5jdXJyZW50VGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jb250YWlucyhlLnJlbGF0ZWRUYXJnZXQgYXMgTm9kZSkpIG9uRHJhZ0NoYW5nZShudWxsLCBudWxsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uRHJvcChlOiBEcmFnRXZlbnQpOiB2b2lkIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCBmcm9tSWQgPSBkcmFnLnBhZ2VJZDtcbiAgICBjb25zdCBtb2RlID0gZHJhZ1N0YXRlLm1vZGU7XG4gICAgZHJhZy5wYWdlSWQgPSBudWxsO1xuICAgIG9uRHJhZ0NoYW5nZShudWxsLCBudWxsKTtcbiAgICBpZiAoIWZyb21JZCB8fCBmcm9tSWQgPT09IHBhZ2UuaWQpIHJldHVybjtcblxuICAgIGNvbnN0IHMgPSBhcHBTdGF0ZS52YWx1ZTtcbiAgICBjb25zdCBuYiA9IHMubm90ZWJvb2tzLmZpbmQobiA9PiBuLmlkID09PSBzLnVpLm5vdGVib29rSWQpO1xuICAgIGNvbnN0IHNlYyA9IG5iPy5zZWN0aW9ucy5maW5kKHNlYyA9PiBzZWMuaWQgPT09IHMudWkuc2VjdGlvbklkKTtcbiAgICBpZiAoIXNlYykgcmV0dXJuO1xuICAgIGlmIChpc0Rlc2NlbmRhbnRPZihzZWMucGFnZXMsIGZyb21JZCwgcGFnZS5pZCkpIHJldHVybjtcblxuICAgIGxldCBleHRyYWN0ZWQ6IFBhZ2UgfCBudWxsID0gbnVsbDtcbiAgICBmdW5jdGlvbiBleHRyYWN0KHBhZ2VzOiBQYWdlW10pOiBib29sZWFuIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHBhZ2VzW2ldLmlkID09PSBmcm9tSWQpIHsgW2V4dHJhY3RlZF0gPSBwYWdlcy5zcGxpY2UoaSwgMSk7IHJldHVybiB0cnVlOyB9XG4gICAgICAgIGlmIChleHRyYWN0KHBhZ2VzW2ldLmNoaWxkcmVuID8/IFtdKSkgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGV4dHJhY3Qoc2VjLnBhZ2VzKTtcbiAgICBpZiAoIWV4dHJhY3RlZCkgcmV0dXJuO1xuXG4gICAgaWYgKG1vZGUgPT09ICdjaGlsZCcpIHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IGZpbmRJblRyZWUoc2VjLnBhZ2VzLCBwYWdlLmlkKTtcbiAgICAgIGlmICh0YXJnZXQpIHsgdGFyZ2V0LmNoaWxkcmVuID0gdGFyZ2V0LmNoaWxkcmVuID8/IFtdOyB0YXJnZXQuY2hpbGRyZW4ucHVzaChleHRyYWN0ZWQpOyB9XG4gICAgfSBlbHNlIGlmIChtb2RlID09PSAnYmVmb3JlJykge1xuICAgICAgZnVuY3Rpb24gaW5zZXJ0QmVmb3JlKHBhZ2VzOiBQYWdlW10pOiBib29sZWFuIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChwYWdlc1tpXS5pZCA9PT0gcGFnZS5pZCkgeyBwYWdlcy5zcGxpY2UoaSwgMCwgZXh0cmFjdGVkISk7IHJldHVybiB0cnVlOyB9XG4gICAgICAgICAgaWYgKGluc2VydEJlZm9yZShwYWdlc1tpXS5jaGlsZHJlbiA/PyBbXSkpIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGluc2VydEJlZm9yZShzZWMucGFnZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyAnYWZ0ZXInIOKAlCBpbnNlcnQgYWZ0ZXIgdGFyZ2V0IGF0IHNhbWUgbGV2ZWxcbiAgICAgIGZ1bmN0aW9uIGluc2VydEFmdGVyKHBhZ2VzOiBQYWdlW10pOiBib29sZWFuIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChwYWdlc1tpXS5pZCA9PT0gcGFnZS5pZCkgeyBwYWdlcy5zcGxpY2UoaSArIDEsIDAsIGV4dHJhY3RlZCEpOyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICAgIGlmIChpbnNlcnRBZnRlcihwYWdlc1tpXS5jaGlsZHJlbiA/PyBbXSkpIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGluc2VydEFmdGVyKHNlYy5wYWdlcyk7XG4gICAgfVxuXG4gICAgYXBwU3RhdGUudmFsdWUgPSB7IC4uLmFwcFN0YXRlLnZhbHVlIH07XG4gICAgdXBkYXRlUGFnZVRyZWUoc2VjLmlkLCBzZWMucGFnZXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gb3BlblBhZ2VDb250ZXh0TWVudShlOiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgLy8gSWYgdGhpcyBwYWdlIGlzIHBhcnQgb2YgYSBidWxrIHNlbGVjdGlvbiwgc2hvdyBidWxrIG1lbnVcbiAgICBpZiAoc2VsZWN0ZWQ/LnNpemUgPiAxICYmIHNlbGVjdGVkLmhhcyhwYWdlLmlkKSkge1xuICAgICAgb3BlbkNvbnRleHRNZW51KGUuY2xpZW50WCwgZS5jbGllbnRZLCBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnY29uZmlybScsIGxhYmVsOiBgRGVsZXRlICR7c2VsZWN0ZWQuc2l6ZX0gcGFnZXNgLFxuICAgICAgICAgIGNvbmZpcm1MYWJlbDogYERlbGV0ZSAke3NlbGVjdGVkLnNpemV9IHBhZ2VzP2AsXG4gICAgICAgICAgYWN0aW9uOiBvbkJ1bGtEZWxldGUsXG4gICAgICAgIH0sXG4gICAgICBdKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuYiA9IGFwcFN0YXRlLnZhbHVlLm5vdGVib29rcy5maW5kKG4gPT4gbi5pZCA9PT0gYXBwU3RhdGUudmFsdWUudWkubm90ZWJvb2tJZCk7XG4gICAgY29uc3Qgc2VjdGlvbnMgPSBuYj8uc2VjdGlvbnMgPz8gW107XG5cbiAgICBjb25zdCBtb3ZlQ2hpbGRyZW46IE1lbnVJdGVtTm9ybWFsW10gPSBzZWN0aW9uc1xuICAgICAgLmZpbHRlcihzID0+IHMuaWQgIT09IGFwcFN0YXRlLnZhbHVlLnVpLnNlY3Rpb25JZClcbiAgICAgIC5tYXAocyA9PiAoeyBsYWJlbDogcy50aXRsZSwgYWN0aW9uOiAoKSA9PiBtb3ZlUGFnZShwYWdlLmlkLCBzLmlkKSB9KSk7XG5cbiAgICBjb25zdCBpdGVtczogTWVudUl0ZW1bXSA9IFtcbiAgICAgIHsgbGFiZWw6ICdSZW5hbWUnLCBhY3Rpb246ICgpID0+IG9uU3RhcnRFZGl0aW5nKHBhZ2UuaWQpIH0sXG4gICAgICB7IGxhYmVsOiAnQWRkIFN1YnBhZ2UnLCBhY3Rpb246ICgpID0+IGFkZFBhZ2UocGFnZS5pZCkgfSxcbiAgICBdO1xuXG4gICAgaWYgKG1vdmVDaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICBpdGVtcy5wdXNoKHsgdHlwZTogJ3N1Ym1lbnUnLCBsYWJlbDogJ01vdmUgdG8gU2VjdGlvbicsIGNoaWxkcmVuOiBtb3ZlQ2hpbGRyZW4gfSk7XG4gICAgfVxuXG4gICAgaXRlbXMucHVzaCh7IHR5cGU6ICdzZXBhcmF0b3InIH0pO1xuXG4gICAgaWYgKHBhZ2UuY2hpbGRyZW4/Lmxlbmd0aCkge1xuICAgICAgaXRlbXMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdjb25maXJtJywgbGFiZWw6ICdEZWxldGUgKHByb21vdGUgc3VicGFnZXMpJyxcbiAgICAgICAgY29uZmlybUxhYmVsOiBgRGVsZXRlIFwiJHtwYWdlLnRpdGxlfVwiP2AsXG4gICAgICAgIGFjdGlvbjogKCkgPT4gZGVsZXRlUGFnZVdpdGhDaGlsZHJlbihwYWdlKSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBpdGVtcy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2NvbmZpcm0nLCBsYWJlbDogJ0RlbGV0ZScsXG4gICAgICAgIGNvbmZpcm1MYWJlbDogYERlbGV0ZSBcIiR7cGFnZS50aXRsZX1cIj9gLFxuICAgICAgICBhY3Rpb246ICgpID0+IGRlbGV0ZVBhZ2UocGFnZS5pZCksXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBvcGVuQ29udGV4dE1lbnUoZS5jbGllbnRYLCBlLmNsaWVudFksIGl0ZW1zKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzcz1cInBhZ2UtaXRlbS13cmFwXCI+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPXtbXG4gICAgICAgICAgJ3BhbmVsLWl0ZW0gcGFnZS1pdGVtJyxcbiAgICAgICAgICBwYWdlLmlkID09PSBhY3RpdmVJZCAmJiAhc2VsZWN0ZWQ/LnNpemUgJiYgJ3BhbmVsLWl0ZW0tLWFjdGl2ZScsXG4gICAgICAgICAgaXNTZWxlY3RlZCAmJiAncGFuZWwtaXRlbS0tc2VsZWN0ZWQnLFxuICAgICAgICAgIGRyb3BNb2RlID09PSAnYmVmb3JlJyAmJiAncGFnZS1pdGVtLS1kcm9wLWJlZm9yZScsXG4gICAgICAgICAgZHJvcE1vZGUgPT09ICdjaGlsZCcgJiYgJ3BhZ2UtaXRlbS0tZHJvcC1jaGlsZCcsXG4gICAgICAgICAgZHJvcE1vZGUgPT09ICdhZnRlcicgJiYgJ3BhZ2UtaXRlbS0tZHJvcC1hZnRlcicsXG4gICAgICAgIF0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oJyAnKX1cbiAgICAgICAgc3R5bGU9e3sgcGFkZGluZ0xlZnQ6IChkZXB0aCAqIDEyKSArICdweCcgfX1cbiAgICAgICAgZHJhZ2dhYmxlXG4gICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gcHJlbG9hZFBhZ2UocGFnZSl9XG4gICAgICAgIG9uRHJhZ1N0YXJ0PXtvbkRyYWdTdGFydH1cbiAgICAgICAgb25EcmFnRW5kPXtvbkRyYWdFbmR9XG4gICAgICAgIG9uRHJhZ092ZXI9e29uRHJhZ092ZXJ9XG4gICAgICAgIG9uRHJhZ0xlYXZlPXtvbkRyYWdMZWF2ZX1cbiAgICAgICAgb25Ecm9wPXtvbkRyb3B9XG4gICAgICAgIG9uQ2xpY2s9eyhlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGUuY3RybEtleSB8fCBlLm1ldGFLZXkgfHwgZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgb25TZWxlY3QocGFnZS5pZCwgZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZD8uc2l6ZSkgb25TZWxlY3QobnVsbCk7IC8vIGNsZWFyIHNlbGVjdGlvbiBvbiBwbGFpbiBjbGlja1xuICAgICAgICAgICAgc2V0QWN0aXZlUGFnZShwYWdlLmlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH19XG4gICAgICAgIG9uRGJsQ2xpY2s9eyhlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICBvblN0YXJ0RWRpdGluZyhwYWdlLmlkKTtcbiAgICAgICAgfX1cbiAgICAgICAgb25Db250ZXh0TWVudT17b3BlblBhZ2VDb250ZXh0TWVudX1cbiAgICAgID5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBjbGFzcz1cInBhZ2UtZXhwYW5kXCJcbiAgICAgICAgICBzdHlsZT17eyB2aXNpYmlsaXR5OiBoYXNLaWRzID8gJ3Zpc2libGUnIDogJ2hpZGRlbicgfX1cbiAgICAgICAgICBvbkNsaWNrPXsoZTogTW91c2VFdmVudCkgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyBzZXRPcGVuKG8gPT4gIW8pOyB9fVxuICAgICAgICA+e29wZW4gPyAn4pa+JyA6ICfilrgnfTwvc3Bhbj5cbiAgICAgICAge2lzRWRpdGluZyA/IChcbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHJlZj17ZWRpdFJlZn1cbiAgICAgICAgICAgIGNsYXNzPVwicGFnZS10aXRsZS1lZGl0XCJcbiAgICAgICAgICAgIHZhbHVlPXtlZGl0VmFsfVxuICAgICAgICAgICAgb25JbnB1dD17KGU6IEV2ZW50KSA9PiBzZXRFZGl0VmFsKChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSl9XG4gICAgICAgICAgICBvbkJsdXI9e2NvbW1pdEVkaXR9XG4gICAgICAgICAgICBvbktleURvd249eyhlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IGNvbW1pdEVkaXQoKTsgfVxuICAgICAgICAgICAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7IGUucHJldmVudERlZmF1bHQoKTsgb25TdGFydEVkaXRpbmcobnVsbCk7IH1cbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbkNsaWNrPXsoZTogTW91c2VFdmVudCkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICAgICAgICAvPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGFnZS10aXRsZS10ZXh0XCI+e3BhZ2UudGl0bGV9PC9zcGFuPlxuICAgICAgICApfVxuICAgICAgICB7LyogRXllIHRvZ2dsZSBkaXNhYmxlZCBmb3Igbm93IOKAlCBhbGwgcGFnZXMgcHVibGljICovfVxuICAgICAgPC9kaXY+XG4gICAgICB7aGFzS2lkcyAmJiBvcGVuICYmIChcbiAgICAgICAgPGRpdiBjbGFzcz1cInN1YnBhZ2VzXCIgc3R5bGU9e3sgJy0tZGVwdGgnOiBkZXB0aCB9IGFzIGFueX0+XG4gICAgICAgICAge3BhZ2UuY2hpbGRyZW4ubWFwKGMgPT4gKFxuICAgICAgICAgICAgPFBhZ2VJdGVtIGtleT17Yy5pZH0gcGFnZT17Y30gYWN0aXZlSWQ9e2FjdGl2ZUlkfSBkZXB0aD17ZGVwdGggKyAxfSBkcmFnU3RhdGU9e2RyYWdTdGF0ZX0gb25EcmFnQ2hhbmdlPXtvbkRyYWdDaGFuZ2V9IGVkaXRpbmdJZD17ZWRpdGluZ0lkfSBvblN0YXJ0RWRpdGluZz17b25TdGFydEVkaXRpbmd9IHNlbGVjdGVkPXtzZWxlY3RlZH0gb25TZWxlY3Q9e29uU2VsZWN0fSBvbkJ1bGtEZWxldGU9e29uQnVsa0RlbGV0ZX0gLz5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUGFnZXNQYW5lbCgpOiBKU1guRWxlbWVudCB7XG4gIGNvbnN0IHsgbm90ZWJvb2tzLCB1aSB9ID0gYXBwU3RhdGUudmFsdWU7XG4gIGNvbnN0IG5iICA9IG5vdGVib29rcy5maW5kKG4gPT4gbi5pZCA9PT0gdWkubm90ZWJvb2tJZCk7XG4gIGNvbnN0IHNlYyA9IG5iPy5zZWN0aW9ucy5maW5kKHMgPT4gcy5pZCA9PT0gdWkuc2VjdGlvbklkKTtcbiAgY29uc3QgcGFnZXMgPSBzZWM/LnBhZ2VzID8/IFtdO1xuXG4gIGNvbnN0IFtkcmFnT3Zlciwgc2V0RHJhZ092ZXJdID0gdXNlU3RhdGU8eyBpZDogc3RyaW5nIHwgbnVsbDsgbW9kZTogc3RyaW5nIHwgbnVsbCB9Pih7IGlkOiBudWxsLCBtb2RlOiBudWxsIH0pO1xuICBjb25zdCBbZWRpdGluZ0lkLCBzZXRFZGl0aW5nSWRdID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFtzZWxlY3RlZCwgc2V0U2VsZWN0ZWRdID0gdXNlU3RhdGU8U2V0PHN0cmluZz4+KG5ldyBTZXQoKSk7XG4gIGNvbnN0IFtjb25maXJtRGVsZXRlLCBzZXRDb25maXJtRGVsZXRlXSA9IHVzZVN0YXRlPGJvb2xlYW4+KGZhbHNlKTtcbiAgY29uc3QgbGFzdFNlbGVjdGVkUmVmID0gdXNlUmVmPHN0cmluZyB8IG51bGw+KG51bGwpO1xuXG4gIC8vIENsZWFyIHNlbGVjdGlvbiB3aGVuIHNlY3Rpb24gY2hhbmdlc1xuICB1c2VFZmZlY3QoKCkgPT4geyBzZXRTZWxlY3RlZChuZXcgU2V0KCkpOyBsYXN0U2VsZWN0ZWRSZWYuY3VycmVudCA9IG51bGw7IH0sIFt1aS5zZWN0aW9uSWRdKTtcblxuICBmdW5jdGlvbiBvbkRyYWdDaGFuZ2UoaWQ6IHN0cmluZyB8IG51bGwsIG1vZGU6IHN0cmluZyB8IG51bGwpOiB2b2lkIHsgc2V0RHJhZ092ZXIoeyBpZCwgbW9kZSB9KTsgfVxuXG4gIGNvbnN0IG9uU2VsZWN0ID0gdXNlQ2FsbGJhY2soKHBhZ2VJZDogc3RyaW5nIHwgbnVsbCwgZT86IE1vdXNlRXZlbnQpID0+IHtcbiAgICBpZiAocGFnZUlkID09PSBudWxsKSB7IHNldFNlbGVjdGVkKG5ldyBTZXQoKSk7IGxhc3RTZWxlY3RlZFJlZi5jdXJyZW50ID0gbnVsbDsgcmV0dXJuOyB9XG4gICAgc2V0U2VsZWN0ZWQocHJldiA9PiB7XG4gICAgICBjb25zdCBuZXh0ID0gbmV3IFNldChwcmV2KTtcbiAgICAgIGlmIChlPy5zaGlmdEtleSAmJiBsYXN0U2VsZWN0ZWRSZWYuY3VycmVudCkge1xuICAgICAgICBjb25zdCByYW5nZSA9IGdldFBhZ2VSYW5nZShwYWdlcywgbGFzdFNlbGVjdGVkUmVmLmN1cnJlbnQsIHBhZ2VJZCk7XG4gICAgICAgIGZvciAoY29uc3QgaWQgb2YgcmFuZ2UpIG5leHQuYWRkKGlkKTtcbiAgICAgIH0gZWxzZSBpZiAoZT8uY3RybEtleSB8fCBlPy5tZXRhS2V5KSB7XG4gICAgICAgIGlmIChuZXh0LmhhcyhwYWdlSWQpKSBuZXh0LmRlbGV0ZShwYWdlSWQpOyBlbHNlIG5leHQuYWRkKHBhZ2VJZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXh0LmNsZWFyKCk7XG4gICAgICAgIG5leHQuYWRkKHBhZ2VJZCk7XG4gICAgICB9XG4gICAgICBsYXN0U2VsZWN0ZWRSZWYuY3VycmVudCA9IHBhZ2VJZDtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH0pO1xuICB9LCBbcGFnZXNdKTtcblxuICBmdW5jdGlvbiBkb0J1bGtEZWxldGUoKTogdm9pZCB7XG4gICAgZm9yIChjb25zdCBpZCBvZiBzZWxlY3RlZCkge1xuICAgICAgY29uc3QgcGcgPSBmaW5kSW5UcmVlKHBhZ2VzLCBpZCk7XG4gICAgICBpZiAocGcpIGRlbGV0ZVBhZ2VXaXRoQ2hpbGRyZW4ocGcpO1xuICAgICAgZWxzZSBkZWxldGVQYWdlKGlkKTtcbiAgICB9XG4gICAgc2V0U2VsZWN0ZWQobmV3IFNldCgpKTtcbiAgICBzZXRDb25maXJtRGVsZXRlKGZhbHNlKTtcbiAgfVxuXG4gIC8vIEtleWJvYXJkOiBEZWxldGUvQmFja3NwYWNlIHRvIGNvbmZpcm0sIEVzY2FwZSB0byBjbGVhclxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGZ1bmN0aW9uIG9uS2V5KGU6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAgIGlmIChzZWxlY3RlZC5zaXplICYmIChlLmtleSA9PT0gJ0RlbGV0ZScgfHwgZS5rZXkgPT09ICdCYWNrc3BhY2UnKSAmJiAhZWRpdGluZ0lkKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgc2V0Q29uZmlybURlbGV0ZSh0cnVlKTtcbiAgICAgIH1cbiAgICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgICAgaWYgKGNvbmZpcm1EZWxldGUpIHNldENvbmZpcm1EZWxldGUoZmFsc2UpO1xuICAgICAgICBlbHNlIGlmIChzZWxlY3RlZC5zaXplKSBzZXRTZWxlY3RlZChuZXcgU2V0KCkpO1xuICAgICAgfVxuICAgIH1cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5KTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleSk7XG4gIH0sIFtzZWxlY3RlZCwgZWRpdGluZ0lkLCBjb25maXJtRGVsZXRlXSk7XG5cbiAgY29uc3QgZHJhZ1N0YXRlOiBEcmFnU3RhdGUgPSB7IG92ZXI6IGRyYWdPdmVyLmlkLCBtb2RlOiBkcmFnT3Zlci5tb2RlIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPVwicGFnZXMtcGFuZWxcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkZXJcIj5cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImFkZC1idG5cIiBvbkNsaWNrPXsoKSA9PiBhZGRQYWdlKCl9PisgTmV3IFBhZ2U8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWxpc3RcIj5cbiAgICAgICAge3BhZ2VzLm1hcChwZyA9PiAoXG4gICAgICAgICAgPFBhZ2VJdGVtIGtleT17cGcuaWR9IHBhZ2U9e3BnfSBhY3RpdmVJZD17dWkucGFnZUlkfSBkcmFnU3RhdGU9e2RyYWdTdGF0ZX0gb25EcmFnQ2hhbmdlPXtvbkRyYWdDaGFuZ2V9IGVkaXRpbmdJZD17ZWRpdGluZ0lkfSBvblN0YXJ0RWRpdGluZz17c2V0RWRpdGluZ0lkfSBzZWxlY3RlZD17c2VsZWN0ZWR9IG9uU2VsZWN0PXtvblNlbGVjdH0gb25CdWxrRGVsZXRlPXtkb0J1bGtEZWxldGV9IC8+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgICB7Y29uZmlybURlbGV0ZSAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb25maXJtLW92ZXJsYXlcIiBvbkNsaWNrPXsoKSA9PiBzZXRDb25maXJtRGVsZXRlKGZhbHNlKX0+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbmZpcm0tZGlhbG9nXCIgb25DbGljaz17KGU6IE1vdXNlRXZlbnQpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9PlxuICAgICAgICAgICAgPHA+RGVsZXRlIHtzZWxlY3RlZC5zaXplfSBwYWdle3NlbGVjdGVkLnNpemUgPiAxID8gJ3MnIDogJyd9PzwvcD5cbiAgICAgICAgICAgIDxwIGNsYXNzPVwiY29uZmlybS1zdWJcIj5UaGlzIGNhbm5vdCBiZSB1bmRvbmUuIFN1YnBhZ2VzIHdpbGwgYmUgcHJvbW90ZWQuPC9wPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbmZpcm0tYnV0dG9uc1wiPlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiY29uZmlybS1jYW5jZWxcIiBvbkNsaWNrPXsoKSA9PiBzZXRDb25maXJtRGVsZXRlKGZhbHNlKX0+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJjb25maXJtLWRlbGV0ZVwiIG9uQ2xpY2s9e2RvQnVsa0RlbGV0ZX0+RGVsZXRlPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufVxuIiwKICAgICIvLyDilIDilIAgSGVscGVycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuaW50ZXJmYWNlIFNlbGVjdGlvbkluZm8ge1xuICBzZWw6IFNlbGVjdGlvbjtcbiAgcmFuZ2U6IFJhbmdlO1xuICBub2RlOiBUZXh0O1xuICB0ZXh0OiBzdHJpbmc7XG4gIG9mZnNldDogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBnZXRTZWxlY3Rpb25JbmZvKCk6IFNlbGVjdGlvbkluZm8gfCBudWxsIHtcbiAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICBpZiAoIXNlbD8ucmFuZ2VDb3VudCkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHJhbmdlID0gc2VsLmdldFJhbmdlQXQoMCk7XG4gIGNvbnN0IG5vZGUgPSByYW5nZS5zdGFydENvbnRhaW5lcjtcbiAgaWYgKG5vZGUubm9kZVR5cGUgIT09IE5vZGUuVEVYVF9OT0RFKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHsgc2VsLCByYW5nZSwgbm9kZTogbm9kZSBhcyBUZXh0LCB0ZXh0OiBub2RlLnRleHRDb250ZW50ISwgb2Zmc2V0OiByYW5nZS5zdGFydE9mZnNldCB9O1xufVxuXG4vLyBTZWxlY3QgdGV4dCBmcm9tIGBzdGFydGAgdG8gYGVuZGAgaW4gYSB0ZXh0IG5vZGUsIHRoZW4gZGVsZXRlIGl0XG5mdW5jdGlvbiBlYXRUZXh0KHNlbDogU2VsZWN0aW9uLCBub2RlOiBUZXh0LCBzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlcik6IHZvaWQge1xuICBjb25zdCByID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgci5zZXRTdGFydChub2RlLCBzdGFydCk7XG4gIHIuc2V0RW5kKG5vZGUsIGVuZCk7XG4gIHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgc2VsLmFkZFJhbmdlKHIpO1xuICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZGVsZXRlJyk7XG59XG5cbi8vIFJlcGxhY2UgYSByZWdleCBtYXRjaCBpbiBhIHRleHQgbm9kZSB3aXRoIGEgZm9ybWF0dGVkIGVsZW1lbnRcbmZ1bmN0aW9uIHdyYXBNYXRjaChzZWw6IFNlbGVjdGlvbiwgbm9kZTogVGV4dCwgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXksIHRhZzogc3RyaW5nKTogdm9pZCB7XG4gIGNvbnN0IGlkeCA9IG1hdGNoLmluZGV4ITtcbiAgY29uc3QgZnVsbCA9IG1hdGNoWzBdO1xuICBjb25zdCBpbm5lciA9IG1hdGNoWzFdO1xuXG4gIC8vIFNwbGl0IG5vZGU6IGJlZm9yZSB8IDx0YWc+aW5uZXI8L3RhZz4gfCBhZnRlclxuICBjb25zdCBiZWZvcmUgPSBub2RlLnRleHRDb250ZW50IS5zbGljZSgwLCBpZHgpO1xuICBjb25zdCBhZnRlciAgPSBub2RlLnRleHRDb250ZW50IS5zbGljZShpZHggKyBmdWxsLmxlbmd0aCk7XG5cbiAgbm9kZS50ZXh0Q29udGVudCA9IGJlZm9yZTtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gIGVsLnRleHRDb250ZW50ID0gaW5uZXI7XG4gIG5vZGUucGFyZW50Tm9kZSEuaW5zZXJ0QmVmb3JlKGVsLCBub2RlLm5leHRTaWJsaW5nKTtcbiAgY29uc3QgYWZ0ZXJOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYWZ0ZXIpO1xuICBlbC5hZnRlcihhZnRlck5vZGUpO1xuXG4gIC8vIFBsYWNlIGN1cnNvciBhdCBzdGFydCBvZiBhZnRlciB0ZXh0XG4gIGNvbnN0IHIgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xuICByLnNldFN0YXJ0KGFmdGVyTm9kZSwgMCk7XG4gIHIuY29sbGFwc2UodHJ1ZSk7XG4gIHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgc2VsLmFkZFJhbmdlKHIpO1xufVxuXG4vLyDilIDilIAgUmljaCB0ZXh0IGNvbW1hbmRzICh0b29sYmFyKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuZXhwb3J0IGZ1bmN0aW9uIGV4ZWNGbXQoY21kOiBzdHJpbmcpOiB2b2lkIHtcbiAgY29uc3QgbWFwOiBSZWNvcmQ8c3RyaW5nLCAoKSA9PiBib29sZWFuIHwgdm9pZD4gPSB7XG4gICAgYm9sZDogICAgICAgICAgKCkgPT4gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2JvbGQnKSxcbiAgICBpdGFsaWM6ICAgICAgICAoKSA9PiBkb2N1bWVudC5leGVjQ29tbWFuZCgnaXRhbGljJyksXG4gICAgdW5kZXJsaW5lOiAgICAgKCkgPT4gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ3VuZGVybGluZScpLFxuICAgIHN0cmlrZXRocm91Z2g6ICgpID0+IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdzdHJpa2VUaHJvdWdoJyksXG4gICAgaDE6ICgpID0+IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdmb3JtYXRCbG9jaycsIGZhbHNlLCAnSDEnKSxcbiAgICBoMjogKCkgPT4gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2Zvcm1hdEJsb2NrJywgZmFsc2UsICdIMicpLFxuICAgIGgzOiAoKSA9PiBkb2N1bWVudC5leGVjQ29tbWFuZCgnZm9ybWF0QmxvY2snLCBmYWxzZSwgJ0gzJyksXG4gICAgaDQ6ICgpID0+IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdmb3JtYXRCbG9jaycsIGZhbHNlLCAnSDQnKSxcbiAgICBwOiAgKCkgPT4gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2Zvcm1hdEJsb2NrJywgZmFsc2UsICdQJyksXG4gICAgdWw6ICgpID0+IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRVbm9yZGVyZWRMaXN0JyksXG4gICAgb2w6ICgpID0+IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRPcmRlcmVkTGlzdCcpLFxuICAgIGxpbms6ICgpID0+IHsgY29uc3QgdSA9IHByb21wdCgnVVJMOicpOyBpZiAodSkgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NyZWF0ZUxpbmsnLCBmYWxzZSwgdSk7IH0sXG4gIH07XG4gIG1hcFtjbWRdPy4oKTtcbn1cblxuLy8g4pSA4pSAIE1hcmtkb3duIHNob3J0Y3V0cyDigJQgY2FsbGVkIG9uIGBpbnB1dGAgZXZlbnQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBSZXR1cm5zICdjb2RlJyBpZiBibG9jayB3YXMgY29udmVydGVkIHRvIGEgY29kZSBibG9jaywgbnVsbCBvdGhlcndpc2UuXG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVNYXJrZG93bklucHV0KGVsOiBIVE1MRWxlbWVudCk6ICdjb2RlJyB8IG51bGwge1xuICBjb25zdCBpbmZvID0gZ2V0U2VsZWN0aW9uSW5mbygpO1xuICBpZiAoIWluZm8pIHJldHVybiBudWxsO1xuICBjb25zdCB7IHNlbCwgcmFuZ2UsIG5vZGUsIHRleHQsIG9mZnNldCB9ID0gaW5mbztcbiAgY29uc3QgYmVmb3JlID0gdGV4dC5zbGljZSgwLCBvZmZzZXQpO1xuXG4gIC8vIOKUgOKUgCBCbG9jay1sZXZlbCB0cmlnZ2VycyAoYXQgc3RhcnQgb2YgbGluZSkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbiAgLy8gSGVhZGluZ3M6ICMgIyMgIyMjICMjIyMgKyBzcGFjZVxuICBjb25zdCBoTWF0Y2ggPSBiZWZvcmUubWF0Y2goL14oI3sxLDR9KSAkLyk7XG4gIGlmIChoTWF0Y2gpIHtcbiAgICBlYXRUZXh0KHNlbCwgbm9kZSwgMCwgb2Zmc2V0KTtcbiAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZm9ybWF0QmxvY2snLCBmYWxzZSwgYEgke2hNYXRjaFsxXS5sZW5ndGh9YCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBVbm9yZGVyZWQgbGlzdDogXCItIFwiIG9yIFwiKiBcIlxuICBpZiAoYmVmb3JlID09PSAnLSAnIHx8IGJlZm9yZSA9PT0gJyogJykge1xuICAgIGVhdFRleHQoc2VsLCBub2RlLCAwLCBvZmZzZXQpO1xuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRVbm9yZGVyZWRMaXN0Jyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBPcmRlcmVkIGxpc3Q6IFwiMS4gXCIgZXRjLlxuICBpZiAoL15cXGQrXFwuICQvLnRlc3QoYmVmb3JlKSkge1xuICAgIGVhdFRleHQoc2VsLCBub2RlLCAwLCBvZmZzZXQpO1xuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRPcmRlcmVkTGlzdCcpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gQmxvY2txdW90ZTogXCI+IFwiXG4gIGlmIChiZWZvcmUgPT09ICc+ICcpIHtcbiAgICBlYXRUZXh0KHNlbCwgbm9kZSwgMCwgb2Zmc2V0KTtcbiAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZm9ybWF0QmxvY2snLCBmYWxzZSwgJ0JMT0NLUVVPVEUnKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIENvZGUgYmxvY2s6IFwiYGBgIFwiXG4gIGlmIChiZWZvcmUgPT09ICdgYGAgJykge1xuICAgIGVhdFRleHQoc2VsLCBub2RlLCAwLCBvZmZzZXQpO1xuICAgIGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1jb2RlJywgJzEnKTtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdjb2RlLWJsb2NrJyk7XG4gICAgcmV0dXJuICdjb2RlJzsgLy8gY2FsbGVyIHNob3VsZCBwZXJzaXN0IGJsb2NrLnR5cGVcbiAgfVxuXG4gIC8vIOKUgOKUgCBJbmxpbmUgdHJpZ2dlcnMgKHBhdHRlcm4gY29tcGxldGVkIHdpdGggc3BhY2UpIOKUgOKUgOKUgOKUgFxuXG4gIC8vICoqYm9sZCoqIG9yIF9fYm9sZF9fIOKAlCBlbmRlZCBqdXN0IGJlZm9yZSBjdXJzb3JcbiAgY29uc3QgYm9sZE0gPSBiZWZvcmUubWF0Y2goL1xcKlxcKiguKz8pXFwqXFwqJC8pIHx8IGJlZm9yZS5tYXRjaCgvX18oLis/KV9fJC8pO1xuICBpZiAoYm9sZE0pIHtcbiAgICB3cmFwTWF0Y2goc2VsLCBub2RlLCBib2xkTSwgJ3N0cm9uZycpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gKml0YWxpYyogb3IgX2l0YWxpY18gKHNpbmdsZSwgbm90IGRvdWJsZSlcbiAgY29uc3QgaXRhbGljTSA9IGJlZm9yZS5tYXRjaCgvKD88IVxcKilcXCooW14qXFxuXSspXFwqJC8pIHx8IGJlZm9yZS5tYXRjaCgvKD88IV8pXyhbXl9cXG5dKylfJC8pO1xuICBpZiAoaXRhbGljTSkge1xuICAgIHdyYXBNYXRjaChzZWwsIG5vZGUsIGl0YWxpY00sICdlbScpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8vIOKUgOKUgCBJbmxpbmUgY29kZSDigJQgY2FsbGVkIGFmdGVyIGJhY2t0aWNrIGlucHV0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlSW5saW5lQ29kZShlbDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcbiAgY29uc3QgaW5mbyA9IGdldFNlbGVjdGlvbkluZm8oKTtcbiAgaWYgKCFpbmZvKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHsgc2VsLCByYW5nZSwgbm9kZSwgb2Zmc2V0IH0gPSBpbmZvO1xuICBjb25zdCBiZWZvcmUgPSBub2RlLnRleHRDb250ZW50IS5zbGljZSgwLCBvZmZzZXQpO1xuICAvLyBEZXRlY3QgYHRleHRgIHBhdHRlcm4gZW5kaW5nIGF0IGN1cnNvclxuICBjb25zdCBtID0gYmVmb3JlLm1hdGNoKC9gKFteYFxcbl0rKWAkLyk7XG4gIGlmICghbSkgcmV0dXJuIGZhbHNlO1xuXG4gIGNvbnN0IGlkeCA9IG0uaW5kZXghO1xuICBjb25zdCBpbm5lciA9IG1bMV07XG4gIGNvbnN0IGJlZm9yZTIgPSBub2RlLnRleHRDb250ZW50IS5zbGljZSgwLCBpZHgpO1xuICBjb25zdCBhZnRlciA9IG5vZGUudGV4dENvbnRlbnQhLnNsaWNlKGlkeCArIG1bMF0ubGVuZ3RoKTtcblxuICBub2RlLnRleHRDb250ZW50ID0gYmVmb3JlMjtcbiAgY29uc3QgY29kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NvZGUnKTtcbiAgY29kZS50ZXh0Q29udGVudCA9IGlubmVyO1xuICBub2RlLnBhcmVudE5vZGUhLmluc2VydEJlZm9yZShjb2RlLCBub2RlLm5leHRTaWJsaW5nKTtcbiAgY29uc3QgYWZ0ZXJOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYWZ0ZXIgfHwgJ1xcdTIwMEInKTtcbiAgY29kZS5hZnRlcihhZnRlck5vZGUpO1xuXG4gIGNvbnN0IHIgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xuICByLnNldFN0YXJ0KGFmdGVyTm9kZSwgMCk7XG4gIHIuY29sbGFwc2UodHJ1ZSk7XG4gIHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgc2VsLmFkZFJhbmdlKHIpO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8g4pSA4pSAIExpc3Qga2V5IGhhbmRsaW5nIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlTGlzdEtleShlOiBLZXlib2FyZEV2ZW50KTogYm9vbGVhbiB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKT8uZ2V0UmFuZ2VBdCgwKT8uc3RhcnRDb250YWluZXI7XG4gIGNvbnN0IGxpID0gY29udGFpbmVyICYmIChcbiAgICBjb250YWluZXIubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFXG4gICAgICA/IChjb250YWluZXIgYXMgRWxlbWVudCkuY2xvc2VzdCgnbGknKVxuICAgICAgOiAoY29udGFpbmVyIGFzIE5vZGUpLnBhcmVudEVsZW1lbnQ/LmNsb3Nlc3QoJ2xpJylcbiAgKTtcbiAgaWYgKCFsaSkgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChlLmtleSA9PT0gJ1RhYicpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoZS5zaGlmdEtleSA/ICdvdXRkZW50JyA6ICdpbmRlbnQnKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiBsaS50ZXh0Q29udGVudCEudHJpbSgpID09PSAnJykge1xuICAgIC8vIENoZWNrIGlmIHRydWx5IGF0IHRvcCBsZXZlbDogcGFyZW50IGlzIFVML09MIHdob3NlIHBhcmVudCBpcyBOT1QgYW4gTElcbiAgICBjb25zdCBsaXN0RWwgPSBsaS5wYXJlbnRFbGVtZW50O1xuICAgIGNvbnN0IGlzVG9wTGV2ZWwgPSBsaXN0RWwgJiYgKGxpc3RFbC50YWdOYW1lID09PSAnVUwnIHx8IGxpc3RFbC50YWdOYW1lID09PSAnT0wnKVxuICAgICAgJiYgbGlzdEVsLnBhcmVudEVsZW1lbnQ/LnRhZ05hbWUgIT09ICdMSSc7XG4gICAgaWYgKGlzVG9wTGV2ZWwpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdvdXRkZW50Jyk7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZm9ybWF0QmxvY2snLCBmYWxzZSwgJ1AnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoIWlzVG9wTGV2ZWwpIHtcbiAgICAgIC8vIE5lc3RlZCBlbXB0eSBpdGVtIOKAlCBqdXN0IGRlaW5kZW50XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnb3V0ZGVudCcpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKGUua2V5ID09PSAnQmFja3NwYWNlJyAmJiBsaS50ZXh0Q29udGVudCEudHJpbSgpID09PSAnJykge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnb3V0ZGVudCcpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyDilIDilIAgQ29kZSBibG9jayB0YWIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbmZ1bmN0aW9uIGhhbmRsZUNvZGVUYWIoZTogS2V5Ym9hcmRFdmVudCwgZWw6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG4gIGlmICghZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWNvZGUnKSkgcmV0dXJuIGZhbHNlO1xuICBpZiAoZS5rZXkgIT09ICdUYWInKSByZXR1cm4gZmFsc2U7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydFRleHQnLCBmYWxzZSwgJyAgJyk7XG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyDilIDilIAgTWFpbiBrZXlkb3duIGRpc3BhdGNoZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBDYWxsIGZyb20gYmxvY2sncyBvbktleURvd24uIFJldHVybnMgdHJ1ZSBpZiBoYW5kbGVkLlxuXG5leHBvcnQgZnVuY3Rpb24gb25CbG9ja0tleURvd24oZTogS2V5Ym9hcmRFdmVudCwgZWw6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG4gIGNvbnN0IG1vZCA9IGUuY3RybEtleSB8fCBlLm1ldGFLZXk7XG5cbiAgLy8gRXhwbGljaXQgZm9ybWF0IHNob3J0Y3V0cyAoYmVsdC1hbmQtc3VzcGVuZGVycyBhbG9uZ3NpZGUgbmF0aXZlIGhhbmRsaW5nKVxuICBpZiAobW9kICYmICFlLnNoaWZ0S2V5ICYmICFlLmFsdEtleSkge1xuICAgIGlmIChlLmtleSA9PT0gJ2InKSB7IGUucHJldmVudERlZmF1bHQoKTsgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2JvbGQnKTsgcmV0dXJuIHRydWU7IH1cbiAgICBpZiAoZS5rZXkgPT09ICdpJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpdGFsaWMnKTsgcmV0dXJuIHRydWU7IH1cbiAgICBpZiAoZS5rZXkgPT09ICd1JykgeyBlLnByZXZlbnREZWZhdWx0KCk7IGRvY3VtZW50LmV4ZWNDb21tYW5kKCd1bmRlcmxpbmUnKTsgcmV0dXJuIHRydWU7IH1cbiAgfVxuXG4gIGlmIChoYW5kbGVDb2RlVGFiKGUsIGVsKSkgcmV0dXJuIHRydWU7XG4gIGlmIChoYW5kbGVMaXN0S2V5KGUpKSByZXR1cm4gdHJ1ZTtcblxuICAvLyBQcmV2ZW50IFRhYiBmcm9tIGVzY2FwaW5nIHRoZSBibG9jayAoc2Nyb2xsYWJsZSBjb250YWluZXJzIGFyZSBpbXBsaWNpdGx5IGZvY3VzYWJsZSlcbiAgaWYgKGUua2V5ID09PSAnVGFiJykgeyBlLnByZXZlbnREZWZhdWx0KCk7IHJldHVybiB0cnVlOyB9XG5cbiAgLy8gQmFja3RpY2sg4oaSIGlubGluZSBjb2RlIChjaGVjayBhZnRlciBjaGFyIGlzIGluc2VydGVkKVxuICBpZiAoZS5rZXkgPT09ICdgJykge1xuICAgIHNldFRpbWVvdXQoKCkgPT4gaGFuZGxlSW5saW5lQ29kZShlbCksIDApO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuIiwKICAgICJpbXBvcnQgdHlwZSB7XG4gIFBhZ2UsIEJsb2NrLCBVbmRvRGVsdGEsIE1vdmVEZWx0YSwgUmVzaXplRGVsdGEsIEh0bWxEZWx0YSxcbiAgQWRkRGVsdGEsIERlbGV0ZURlbHRhLCBEZWxldGVGb3J3YXJkRGVsdGEsIENoZWNrbGlzdERlbHRhLCBDcm9wRGVsdGEsXG59IGZyb20gJy4vdHlwZXMudHMnO1xuXG4vLyBEZWx0YS1iYXNlZCB1bmRvL3JlZG8g4oCUIHN0b3JlcyBvbmx5IHdoYXQgY2hhbmdlZFxuXG5pbnRlcmZhY2UgVW5kb1N0YWNrIHtcbiAgcGFzdDogVW5kb0RlbHRhW107XG4gIGZ1dHVyZTogVW5kb0RlbHRhW107XG59XG5cbmNvbnN0IHN0YWNrcyA9IG5ldyBNYXA8c3RyaW5nLCBVbmRvU3RhY2s+KCk7XG5cbmZ1bmN0aW9uIGdldChwYWdlSWQ6IHN0cmluZyk6IFVuZG9TdGFjayB7XG4gIGlmICghc3RhY2tzLmhhcyhwYWdlSWQpKSBzdGFja3Muc2V0KHBhZ2VJZCwgeyBwYXN0OiBbXSwgZnV0dXJlOiBbXSB9KTtcbiAgcmV0dXJuIHN0YWNrcy5nZXQocGFnZUlkKSE7XG59XG5cbi8vIFB1c2ggYSBkZWx0YSBvbnRvIHRoZSB1bmRvIHN0YWNrLlxuLy8gRGVsdGFzOiB7IHR5cGU6ICdtb3ZlJywgbW92ZXM6IFt7IGlkLCB4LCB5IH1dIH1cbi8vICAgICAgICAgeyB0eXBlOiAncmVzaXplJywgaWQsIHcsICh4LCB5KT8gfVxuLy8gICAgICAgICB7IHR5cGU6ICdodG1sJywgaWQsIGh0bWwgfVxuLy8gICAgICAgICB7IHR5cGU6ICdhZGQnLCBibG9jayB9ICAgICAgICDigJQgYSBibG9jayB3YXMgYWRkZWQgKHVuZG8gPSByZW1vdmUgaXQpXG4vLyAgICAgICAgIHsgdHlwZTogJ2RlbGV0ZScsIGJsb2NrcyB9ICAgIOKAlCBibG9ja3Mgd2VyZSBkZWxldGVkICh1bmRvID0gcmUtYWRkIHRoZW0pXG5leHBvcnQgZnVuY3Rpb24gcHVzaFVuZG8ocGFnZUlkOiBzdHJpbmcsIGRlbHRhOiBVbmRvRGVsdGEpOiB2b2lkIHtcbiAgY29uc3QgcyA9IGdldChwYWdlSWQpO1xuICBzLnBhc3QucHVzaChkZWx0YSk7XG4gIHMuZnV0dXJlID0gW107XG4gIGlmIChzLnBhc3QubGVuZ3RoID4gMjAwKSBzLnBhc3Quc2hpZnQoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5VW5kbyhwYWdlSWQ6IHN0cmluZywgcGFnZTogUGFnZSk6IGJvb2xlYW4ge1xuICBjb25zdCBzID0gZ2V0KHBhZ2VJZCk7XG4gIGlmICghcy5wYXN0Lmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICBjb25zdCBkZWx0YSA9IHMucGFzdC5wb3AoKSE7XG4gIGNvbnN0IHJldmVyc2UgPSBhcHBseShwYWdlLCBkZWx0YSk7XG4gIGlmIChyZXZlcnNlKSBzLmZ1dHVyZS5wdXNoKHJldmVyc2UpO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5UmVkbyhwYWdlSWQ6IHN0cmluZywgcGFnZTogUGFnZSk6IGJvb2xlYW4ge1xuICBjb25zdCBzID0gZ2V0KHBhZ2VJZCk7XG4gIGlmICghcy5mdXR1cmUubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IGRlbHRhID0gcy5mdXR1cmUucG9wKCkhO1xuICBjb25zdCByZXZlcnNlID0gYXBwbHkocGFnZSwgZGVsdGEpO1xuICBpZiAocmV2ZXJzZSkgcy5wYXN0LnB1c2gocmV2ZXJzZSk7XG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBBcHBseSBhIGRlbHRhIHRvIHBhZ2UuYmxvY2tzLCByZXR1cm4gdGhlIHJldmVyc2UgZGVsdGFcbmZ1bmN0aW9uIGFwcGx5KHBhZ2U6IFBhZ2UsIGRlbHRhOiBVbmRvRGVsdGEpOiBVbmRvRGVsdGEgfCBudWxsIHtcbiAgY29uc3QgYmxvY2tzID0gcGFnZS5ibG9ja3M7XG5cbiAgaWYgKGRlbHRhLnR5cGUgPT09ICdtb3ZlJykge1xuICAgIGNvbnN0IHJldjogeyBpZDogc3RyaW5nOyB4OiBudW1iZXI7IHk6IG51bWJlciB9W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IG0gb2YgZGVsdGEubW92ZXMpIHtcbiAgICAgIGNvbnN0IGIgPSBibG9ja3MuZmluZChiID0+IGIuaWQgPT09IG0uaWQpO1xuICAgICAgaWYgKGIpIHtcbiAgICAgICAgcmV2LnB1c2goeyBpZDogYi5pZCwgeDogYi54LCB5OiBiLnkgfSk7XG4gICAgICAgIGIueCA9IG0ueDtcbiAgICAgICAgYi55ID0gbS55O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyB0eXBlOiAnbW92ZScsIG1vdmVzOiByZXYgfTtcbiAgfVxuXG4gIGlmIChkZWx0YS50eXBlID09PSAncmVzaXplJykge1xuICAgIGNvbnN0IGIgPSBibG9ja3MuZmluZChiID0+IGIuaWQgPT09IGRlbHRhLmlkKTtcbiAgICBpZiAoIWIpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHJldjogUmVzaXplRGVsdGEgPSB7IHR5cGU6ICdyZXNpemUnLCBpZDogYi5pZCwgdzogYi53IH07XG4gICAgaWYgKGRlbHRhLnggIT0gbnVsbCkgeyByZXYueCA9IGIueDsgcmV2LnkgPSBiLnk7IGIueCA9IGRlbHRhLng7IGIueSA9IGRlbHRhLnkhOyB9XG4gICAgYi53ID0gZGVsdGEudztcbiAgICByZXR1cm4gcmV2O1xuICB9XG5cbiAgaWYgKGRlbHRhLnR5cGUgPT09ICdodG1sJykge1xuICAgIGNvbnN0IGIgPSBibG9ja3MuZmluZChiID0+IGIuaWQgPT09IGRlbHRhLmlkKTtcbiAgICBpZiAoIWIpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHJldjogSHRtbERlbHRhID0geyB0eXBlOiAnaHRtbCcsIGlkOiBiLmlkLCBodG1sOiBiLmh0bWwgfTtcbiAgICBiLmh0bWwgPSBkZWx0YS5odG1sO1xuICAgIHJldHVybiByZXY7XG4gIH1cblxuICBpZiAoZGVsdGEudHlwZSA9PT0gJ2FkZCcpIHtcbiAgICAvLyBBIGJsb2NrIHdhcyBhZGRlZCDigJQgdW5kbyBieSByZW1vdmluZyBpdFxuICAgIGNvbnN0IHJldjogRGVsZXRlRGVsdGEgPSB7IHR5cGU6ICdkZWxldGUnLCBibG9ja3M6IFtibG9ja3MuZmluZChiID0+IGIuaWQgPT09IGRlbHRhLmlkKV0uZmlsdGVyKEJvb2xlYW4pIGFzIEJsb2NrW10gfTtcbiAgICBwYWdlLmJsb2NrcyA9IGJsb2Nrcy5maWx0ZXIoYiA9PiBiLmlkICE9PSBkZWx0YS5pZCk7XG4gICAgcmV0dXJuIHJldi5ibG9ja3MubGVuZ3RoID8gcmV2IDogbnVsbDtcbiAgfVxuXG4gIGlmIChkZWx0YS50eXBlID09PSAnZGVsZXRlJykge1xuICAgIC8vIEJsb2NrcyB3ZXJlIGRlbGV0ZWQg4oCUIHVuZG8gYnkgcmUtYWRkaW5nIHRoZW1cbiAgICBjb25zdCBpZHMgPSBkZWx0YS5ibG9ja3MubWFwKGIgPT4gYi5pZCk7XG4gICAgcGFnZS5ibG9ja3MgPSBbLi4uYmxvY2tzLCAuLi5kZWx0YS5ibG9ja3NdO1xuICAgIHJldHVybiB7IHR5cGU6ICdkZWxldGVGb3J3YXJkJywgaWRzIH0gYXMgRGVsZXRlRm9yd2FyZERlbHRhO1xuICB9XG5cbiAgaWYgKGRlbHRhLnR5cGUgPT09ICdkZWxldGVGb3J3YXJkJykge1xuICAgIC8vIFJlZG8gb2YgZGVsZXRlXG4gICAgY29uc3QgcmVtb3ZlZCA9IGJsb2Nrcy5maWx0ZXIoYiA9PiBkZWx0YS5pZHMuaW5jbHVkZXMoYi5pZCkpO1xuICAgIHBhZ2UuYmxvY2tzID0gYmxvY2tzLmZpbHRlcihiID0+ICFkZWx0YS5pZHMuaW5jbHVkZXMoYi5pZCkpO1xuICAgIHJldHVybiB7IHR5cGU6ICdkZWxldGUnLCBibG9ja3M6IHJlbW92ZWQgfSBhcyBEZWxldGVEZWx0YTtcbiAgfVxuXG4gIGlmIChkZWx0YS50eXBlID09PSAnY2hlY2tsaXN0Jykge1xuICAgIGNvbnN0IGIgPSBibG9ja3MuZmluZChiID0+IGIuaWQgPT09IGRlbHRhLmlkKTtcbiAgICBpZiAoIWIpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHJldjogQ2hlY2tsaXN0RGVsdGEgPSB7IHR5cGU6ICdjaGVja2xpc3QnLCBpZDogYi5pZCwgaXRlbXM6IChiLml0ZW1zIHx8IFtdKS5tYXAoaSA9PiAoeyAuLi5pIH0pKSB9O1xuICAgIGIuaXRlbXMgPSBkZWx0YS5pdGVtcztcbiAgICByZXR1cm4gcmV2O1xuICB9XG5cbiAgaWYgKGRlbHRhLnR5cGUgPT09ICdjcm9wJykge1xuICAgIGNvbnN0IGIgPSBibG9ja3MuZmluZChiID0+IGIuaWQgPT09IGRlbHRhLmlkKTtcbiAgICBpZiAoIWIpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHJldjogQ3JvcERlbHRhID0geyB0eXBlOiAnY3JvcCcsIGlkOiBiLmlkLCBjcm9wOiBiLmNyb3AgPz8gbnVsbCB9O1xuICAgIGIuY3JvcCA9IGRlbHRhLmNyb3AgPz8gdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXY7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiIsCiAgICAiaW1wb3J0IHsgYWRkQmxvY2ssIGFkZEltYWdlRnJvbUZpbGUsIGFkZEltYWdlRnJvbVVybCB9IGZyb20gJy4vc3RvcmUudHMnO1xuaW1wb3J0IHR5cGUgeyBCbG9jayB9IGZyb20gJy4vdHlwZXMudHMnO1xuXG5pbnRlcmZhY2UgQ2FudmFzUG9pbnQge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIFBhc3RlUG9pbnQge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbiAgdzogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgVmlld0luZm8ge1xuICB6b29tOiBudW1iZXI7XG59XG5cbmZ1bmN0aW9uIGNhbnZhc0NlbnRlcihjb250YWluZXI6IEhUTUxFbGVtZW50IHwgbnVsbCwgdmlldzogVmlld0luZm8pOiBDYW52YXNQb2ludCB7XG4gIGNvbnN0IHsgem9vbSB9ID0gdmlldztcbiAgY29uc3QgcmVjdCA9IGNvbnRhaW5lcj8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHJldHVybiB7XG4gICAgeDogcmVjdCA/IChyZWN0LndpZHRoICAvIDIgKyBjb250YWluZXIhLnNjcm9sbExlZnQpIC8gem9vbSA6IDEwMCxcbiAgICB5OiByZWN0ID8gKHJlY3QuaGVpZ2h0IC8gMiArIGNvbnRhaW5lciEuc2Nyb2xsVG9wKSAgLyB6b29tIDogMTAwLFxuICB9O1xufVxuXG5mdW5jdGlvbiBwYXN0ZUluc2VydFBvaW50KGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBudWxsLCB2aWV3OiBWaWV3SW5mbyk6IFBhc3RlUG9pbnQge1xuICBjb25zdCB7IHpvb20gfSA9IHZpZXc7XG4gIGlmICghY29udGFpbmVyKSByZXR1cm4geyB4OiA0MCwgeTogNDAsIHc6IDYwMCB9O1xuICBjb25zdCBtYXJnaW4gPSA0MDtcbiAgcmV0dXJuIHtcbiAgICB4OiAoY29udGFpbmVyLnNjcm9sbExlZnQgLyB6b29tKSArIG1hcmdpbixcbiAgICB5OiAoY29udGFpbmVyLnNjcm9sbFRvcCAgLyB6b29tKSArIG1hcmdpbixcbiAgICB3OiBNYXRoLnJvdW5kKGNvbnRhaW5lci5jbGllbnRXaWR0aCAqICgyIC8gMykgLyB6b29tKSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gdG9IdG1sKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiB0ZXh0XG4gICAgLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcbiAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKVxuICAgIC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKTtcbn1cblxuLy8g4pSA4pSAIEhUTUwg4oaSIE1hcmtkb3duIGNvbnZlcnNpb24g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbi8vIFNwbGl0cyBhIDxsaT4ncyBjaGlsZHJlbiBpbnRvIGlubGluZSB0ZXh0IHZzIG5lc3RlZCBsaXN0LCByZXR1cm5pbmcgXCJ0ZXh0XFxuICAtIHN1Yml0ZW1cIiBmb3JtXG5mdW5jdGlvbiBfbGlUb01kKGxpOiBFbGVtZW50LCBpbmRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIGxldCB0ZXh0ID0gJyc7XG4gIGxldCBuZXN0ZWQgPSAnJztcbiAgZm9yIChjb25zdCBjIG9mIGxpLmNoaWxkTm9kZXMpIHtcbiAgICBpZiAoYy5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiYgKChjIGFzIEVsZW1lbnQpLnRhZ05hbWUgPT09ICdVTCcgfHwgKGMgYXMgRWxlbWVudCkudGFnTmFtZSA9PT0gJ09MJykpXG4gICAgICBuZXN0ZWQgKz0gJ1xcbicgKyBfbm9kZVRvTWQoYywgaW5kZW50ICsgJyAgICAnKTtcbiAgICBlbHNlXG4gICAgICB0ZXh0ICs9IF9ub2RlVG9NZChjLCBpbmRlbnQpO1xuICB9XG4gIHJldHVybiB0ZXh0LnRyaW0oKSArIG5lc3RlZC50cmltRW5kKCk7XG59XG5cbmZ1bmN0aW9uIF9ub2RlVG9NZChub2RlOiBOb2RlLCBpbmRlbnQ6IHN0cmluZyA9ICcnKTogc3RyaW5nIHtcbiAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSByZXR1cm4gbm9kZS50ZXh0Q29udGVudCE7XG4gIGlmIChub2RlLm5vZGVUeXBlICE9PSBOb2RlLkVMRU1FTlRfTk9ERSkgcmV0dXJuICcnO1xuICBjb25zdCBlbCA9IG5vZGUgYXMgRWxlbWVudDtcbiAgY29uc3QgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBpbm5lciA9ICgpOiBzdHJpbmcgPT4gWy4uLmVsLmNoaWxkTm9kZXNdLm1hcChjID0+IF9ub2RlVG9NZChjLCBpbmRlbnQpKS5qb2luKCcnKTtcbiAgc3dpdGNoICh0YWcpIHtcbiAgICBjYXNlICdzdHJvbmcnOiBjYXNlICdiJzogICAgICAgICAgICAgIHJldHVybiBgKioke2lubmVyKCl9KipgO1xuICAgIGNhc2UgJ2VtJzogICAgIGNhc2UgJ2knOiAgICAgICAgICAgICAgcmV0dXJuIGAqJHtpbm5lcigpfSpgO1xuICAgIGNhc2UgJ3MnOiAgICAgIGNhc2UgJ3N0cmlrZSc6IGNhc2UgJ2RlbCc6IHJldHVybiBgfn4ke2lubmVyKCl9fn5gO1xuICAgIGNhc2UgJ2NvZGUnOiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGBcXGAke2lubmVyKCl9XFxgYDtcbiAgICBjYXNlICdhJzogeyBjb25zdCBocmVmID0gZWwuZ2V0QXR0cmlidXRlKCdocmVmJykgfHwgJyc7IGNvbnN0IHQgPSBpbm5lcigpOyByZXR1cm4gaHJlZiA/IGBbJHt0fV0oJHtocmVmfSlgIDogdDsgfVxuICAgIGNhc2UgJ2JyJzogIHJldHVybiAnXFxuJztcbiAgICBjYXNlICdoMSc6ICByZXR1cm4gYCMgJHtpbm5lcigpfVxcblxcbmA7XG4gICAgY2FzZSAnaDInOiAgcmV0dXJuIGAjIyAke2lubmVyKCl9XFxuXFxuYDtcbiAgICBjYXNlICdoMyc6ICByZXR1cm4gYCMjIyAke2lubmVyKCl9XFxuXFxuYDtcbiAgICBjYXNlICdoNCc6ICByZXR1cm4gYCMjIyMgJHtpbm5lcigpfVxcblxcbmA7XG4gICAgY2FzZSAnaDUnOiAgcmV0dXJuIGAjIyMjIyAke2lubmVyKCl9XFxuXFxuYDtcbiAgICBjYXNlICdoNic6ICByZXR1cm4gYCMjIyMjIyAke2lubmVyKCl9XFxuXFxuYDtcbiAgICBjYXNlICd1bCc6IHtcbiAgICAgIGxldCByID0gJyc7XG4gICAgICBmb3IgKGNvbnN0IGMgb2YgZWwuY2hpbGROb2Rlcykge1xuICAgICAgICBpZiAoYy5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBjZSA9IGMgYXMgRWxlbWVudDtcbiAgICAgICAgaWYgKGNlLnRhZ05hbWUgPT09ICdMSScpIHIgKz0gYCR7aW5kZW50fS0gJHtfbGlUb01kKGNlLCBpbmRlbnQpfVxcbmA7XG4gICAgICAgIGVsc2UgaWYgKGNlLnRhZ05hbWUgPT09ICdVTCcgfHwgY2UudGFnTmFtZSA9PT0gJ09MJykgciArPSBfbm9kZVRvTWQoY2UsIGluZGVudCArICcgICAgJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gciArIChpbmRlbnQgPyAnJyA6ICdcXG4nKTtcbiAgICB9XG4gICAgY2FzZSAnb2wnOiB7XG4gICAgICBsZXQgciA9ICcnOyBsZXQgaSA9IDE7XG4gICAgICBmb3IgKGNvbnN0IGMgb2YgZWwuY2hpbGROb2Rlcykge1xuICAgICAgICBpZiAoYy5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBjZSA9IGMgYXMgRWxlbWVudDtcbiAgICAgICAgaWYgKGNlLnRhZ05hbWUgPT09ICdMSScpIHIgKz0gYCR7aW5kZW50fSR7aSsrfS4gJHtfbGlUb01kKGNlLCBpbmRlbnQpfVxcbmA7XG4gICAgICAgIGVsc2UgaWYgKGNlLnRhZ05hbWUgPT09ICdVTCcgfHwgY2UudGFnTmFtZSA9PT0gJ09MJykgciArPSBfbm9kZVRvTWQoY2UsIGluZGVudCArICcgICAgJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gciArIChpbmRlbnQgPyAnJyA6ICdcXG4nKTtcbiAgICB9XG4gICAgY2FzZSAnbGknOiAgcmV0dXJuIGAke2luZGVudH0tICR7X2xpVG9NZChlbCwgaW5kZW50KX1cXG5gO1xuICAgIGNhc2UgJ3AnOiAgIHJldHVybiBgJHtpbm5lcigpfVxcblxcbmA7XG4gICAgY2FzZSAnZGl2Jzoge1xuICAgICAgaWYgKGVsLmNoaWxkTm9kZXMubGVuZ3RoID09PSAxICYmIGVsLmZpcnN0Q2hpbGQ/Lm5vZGVOYW1lID09PSAnQlInKSByZXR1cm4gJ1xcbic7XG4gICAgICBjb25zdCBjID0gaW5uZXIoKTsgcmV0dXJuIGMgPyBgJHtjfVxcbmAgOiAnJztcbiAgICB9XG4gICAgZGVmYXVsdDogICAgcmV0dXJuIGlubmVyKCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGh0bWxUb01hcmtkb3duKGh0bWw6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHdyYXAgPSBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKGA8ZGl2PiR7aHRtbH08L2Rpdj5gLCAndGV4dC9odG1sJykuYm9keS5maXJzdENoaWxkITtcbiAgcmV0dXJuIF9ub2RlVG9NZCh3cmFwKS5yZXBsYWNlKC9cXG57Myx9L2csICdcXG5cXG4nKS50cmltKCk7XG59XG5cbi8vIFJlZ2lzdGVyIGEgZG9jdW1lbnQtbGV2ZWwgcGFzdGUgaGFuZGxlci5cbi8vIEhhbmRsZXMgaW1hZ2VzICjihpIgaW1hZ2UgYmxvY2spIGFuZCBwbGFpbiB0ZXh0IHdpdGggbm8gZm9jdXNlZCBibG9jayAo4oaSIHRleHQgYmxvY2spLlxuLy8gUmV0dXJucyBhIGNsZWFudXAgZnVuY3Rpb24uXG5leHBvcnQgZnVuY3Rpb24gaW5pdFBhc3RlSGFuZGxlcih7IGdldENvbnRhaW5lciwgZ2V0VmlldyB9OiB7IGdldENvbnRhaW5lcjogKCkgPT4gSFRNTEVsZW1lbnQgfCBudWxsOyBnZXRWaWV3OiAoKSA9PiBWaWV3SW5mbyB9KTogKCkgPT4gdm9pZCB7XG4gIGZ1bmN0aW9uIG9uUGFzdGUoZTogQ2xpcGJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBpdGVtcyA9IFsuLi4oZS5jbGlwYm9hcmREYXRhPy5pdGVtcyB8fCBbXSldO1xuXG4gICAgLy8gQWN0dWFsIGZpbGVzIChlLmcuIGNvcGllZCBmcm9tIEZpbmRlcikg4oCUIHNhbWUgcGF0aCBhcyBkcmFnL2Ryb3AsIHByZXNlcnZlcyBHSUYvV2ViUC9ldGMuXG4gICAgY29uc3QgcGFzdGVkRmlsZXMgPSBbLi4uKGUuY2xpcGJvYXJkRGF0YT8uZmlsZXMgfHwgW10pXS5maWx0ZXIoZiA9PiBmLnR5cGUuc3RhcnRzV2l0aCgnaW1hZ2UvJykpO1xuICAgIGlmIChwYXN0ZWRGaWxlcy5sZW5ndGgpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IHsgeCwgeSB9ID0gY2FudmFzQ2VudGVyKGdldENvbnRhaW5lcigpLCBnZXRWaWV3KCkpO1xuICAgICAgcGFzdGVkRmlsZXMuZm9yRWFjaCgoZmlsZSwgaSkgPT4gYWRkSW1hZ2VGcm9tRmlsZShmaWxlLCB4ICsgaSAqIDIwLCB5ICsgaSAqIDIwKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2xpcGJvYXJkIGltYWdlIGRhdGEgKHNjcmVlbnNob3RzLCBjb3BpZWQgaW1hZ2VzIGZyb20gYnJvd3NlcnMpIOKAlCBmYWxsYmFjayB0byBpdGVtc1xuICAgIGNvbnN0IGltYWdlSXRlbSA9IGl0ZW1zLmZpbmQoaSA9PiBpLnR5cGUuc3RhcnRzV2l0aCgnaW1hZ2UvJykpO1xuICAgIGlmIChpbWFnZUl0ZW0pIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IGZpbGUgPSBpbWFnZUl0ZW0uZ2V0QXNGaWxlKCk7XG4gICAgICBpZiAoIWZpbGUpIHJldHVybjtcbiAgICAgIGNvbnN0IHsgeCwgeSB9ID0gY2FudmFzQ2VudGVyKGdldENvbnRhaW5lcigpLCBnZXRWaWV3KCkpO1xuICAgICAgYWRkSW1hZ2VGcm9tRmlsZShmaWxlLCB4LCB5KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBFeHRyYWN0IDxpbWc+IHRhZ3MgZnJvbSBIVE1MIOKGkiBpbWFnZSBibG9ja3NcbiAgICBjb25zdCBodG1sID0gZS5jbGlwYm9hcmREYXRhPy5nZXREYXRhKCd0ZXh0L2h0bWwnKSB8fCAnJztcbiAgICBpZiAoaHRtbCAmJiBhZGRJbWFnZUZyb21VcmwpIHtcbiAgICAgIGNvbnN0IGRvYyA9IG5ldyBET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcoaHRtbCwgJ3RleHQvaHRtbCcpO1xuICAgICAgY29uc3Qgc3JjcyA9IFsuLi5kb2MucXVlcnlTZWxlY3RvckFsbCgnaW1nJyldXG4gICAgICAgIC5tYXAoaW1nID0+IGltZy5zcmMpXG4gICAgICAgIC5maWx0ZXIoc3JjID0+IHNyYyAmJiAhc3JjLnN0YXJ0c1dpdGgoJ2RhdGE6JykpO1xuICAgICAgaWYgKHNyY3MubGVuZ3RoKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgeyB4LCB5IH0gPSBjYW52YXNDZW50ZXIoZ2V0Q29udGFpbmVyKCksIGdldFZpZXcoKSk7XG4gICAgICAgIHNyY3MuZm9yRWFjaCgoc3JjLCBpKSA9PiBhZGRJbWFnZUZyb21Vcmwoc3JjLCB4ICsgaSAqIDIwLCB5ICsgaSAqIDIwKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUZXh0OiBvbmx5IHdoZW4gbm8gY29udGVudGVkaXRhYmxlIGJsb2NrIGlzIGZvY3VzZWQgKEJsb2NrLmpzeCBoYW5kbGVzIHRoYXQgY2FzZSlcbiAgICBpZiAoKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgYXMgRWxlbWVudCk/LmNsb3Nlc3QoJ1tjb250ZW50ZWRpdGFibGVdJykpIHJldHVybjtcbiAgICBjb25zdCB0ZXh0ID0gZS5jbGlwYm9hcmREYXRhPy5nZXREYXRhKCd0ZXh0L3BsYWluJykgfHwgJyc7XG4gICAgaWYgKCF0ZXh0LnRyaW0oKSkgcmV0dXJuO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCB7IHgsIHksIHcgfSA9IHBhc3RlSW5zZXJ0UG9pbnQoZ2V0Q29udGFpbmVyKCksIGdldFZpZXcoKSk7XG4gICAgYWRkQmxvY2soeCwgeSwgdywgJ3RleHQnLCB7IGh0bWw6IHRvSHRtbCh0ZXh0KSB9KTtcbiAgfVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgb25QYXN0ZSk7XG4gIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwYXN0ZScsIG9uUGFzdGUpO1xufVxuXG4vLyDilIDilIAgQmxvY2stbGV2ZWwgY2xpcGJvYXJkIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5sZXQgX2NvcGllZEJsb2NrczogQmxvY2tbXSB8IG51bGwgPSBudWxsO1xuXG4vLyBDbGVhciBibG9jayBjbGlwYm9hcmQgd2hlbiB1c2VyIGNvcGllcy9jdXRzIHRleHQgd2l0aGluIGEgYmxvY2tcbmlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NvcHknLCAoKSA9PiB7IF9jb3BpZWRCbG9ja3MgPSBudWxsOyB9KTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY3V0JywgKCkgPT4geyBfY29waWVkQmxvY2tzID0gbnVsbDsgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3B5QmxvY2tzKGJsb2NrczogQmxvY2tbXSk6IHZvaWQge1xuICBfY29waWVkQmxvY2tzID0gc3RydWN0dXJlZENsb25lKGJsb2Nrcyk7XG4gIC8vIFB1dCB0ZXh0IHJlcHJlc2VudGF0aW9uIG9uIHN5c3RlbSBjbGlwYm9hcmQgZm9yIGNyb3NzLWFwcCBwYXN0ZVxuICBjb25zdCB0ZXh0ID0gYmxvY2tzXG4gICAgLmZpbHRlcihiID0+IGIudHlwZSA9PT0gJ3RleHQnIHx8IGIudHlwZSA9PT0gJ2NvZGUnKVxuICAgIC5tYXAoYiA9PiB7IGNvbnN0IGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTsgZC5pbm5lckhUTUwgPSBiLmh0bWw7IHJldHVybiBkLnRleHRDb250ZW50IHx8ICcnOyB9KVxuICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAuam9pbignXFxuXFxuJyk7XG4gIGlmICh0ZXh0KSBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCh0ZXh0KS5jYXRjaCgoKSA9PiB7fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb3BpZWRCbG9ja3MoKTogQmxvY2tbXSB8IG51bGwge1xuICByZXR1cm4gX2NvcGllZEJsb2Nrcztcbn1cbiIsCiAgICAiaW1wb3J0IHsgdXNlUmVmLCB1c2VFZmZlY3QsIHVzZUxheW91dEVmZmVjdCwgdXNlQ29udGV4dCwgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgc2lnbmFsIH0gZnJvbSAnQHByZWFjdC9zaWduYWxzJztcbmltcG9ydCB7IENhbnZhc0N0eCB9IGZyb20gJy4vQ2FudmFzLnRzeCc7XG5pbXBvcnQgeyBvcGVuQ29udGV4dE1lbnUgfSBmcm9tICcuL0NvbnRleHRNZW51LnRzeCc7XG5pbXBvcnQgeyBlZGl0aW5nRW5hYmxlZCwgdXBkYXRlQmxvY2tIdG1sLCB1cGRhdGVCbG9ja0h0bWxMb2NhbCwgdXBkYXRlQmxvY2tUZXh0RGlmZiwgdXBkYXRlQmxvY2tUeXBlLCBkZWxldGVCbG9jaywgZ2V0QWN0aXZlUGFnZSwgdXBkYXRlQmxvY2tDcm9wLCB1cGRhdGVCbG9ja0NhcHRpb24sIHVwZGF0ZUJsb2NrQm9yZGVyLCB1cGRhdGVDaGVja2xpc3RJdGVtcywgdXBkYXRlQ2hlY2tsaXN0SXRlbXNTaWxlbnQsIHVpZCB9IGZyb20gJy4vc3RvcmUudHMnO1xuaW1wb3J0IHsgb25CbG9ja0tleURvd24sIGhhbmRsZU1hcmtkb3duSW5wdXQgfSBmcm9tICcuL2VkaXRvci50cyc7XG5pbXBvcnQgeyBwdXNoVW5kbyB9IGZyb20gJy4vdW5kby50cyc7XG5pbXBvcnQgeyBodG1sVG9NYXJrZG93biB9IGZyb20gJy4vY2xpcGJvYXJkLnRzJztcbmltcG9ydCB0eXBlIHsgQmxvY2sgYXMgQmxvY2tUeXBlLCBQYWdlLCBDaGVja2xpc3RJdGVtLCBDcm9wRGF0YSwgVGV4dERpZmYsIE1lbnVJdGVtLCBDYW52YXNDb250ZXh0IH0gZnJvbSAnLi90eXBlcy50cyc7XG5pbXBvcnQgdHlwZSB7IEpTWCB9IGZyb20gJ3ByZWFjdCc7XG5cbmZ1bmN0aW9uIGNvbXB1dGVUZXh0RGlmZihvbGRUZXh0OiBzdHJpbmcsIG5ld1RleHQ6IHN0cmluZyk6IFRleHREaWZmW10ge1xuICBsZXQgcCA9IDA7XG4gIGNvbnN0IG1pbkxlbiA9IE1hdGgubWluKG9sZFRleHQubGVuZ3RoLCBuZXdUZXh0Lmxlbmd0aCk7XG4gIHdoaWxlIChwIDwgbWluTGVuICYmIG9sZFRleHRbcF0gPT09IG5ld1RleHRbcF0pIHArKztcbiAgbGV0IG9sZEVuZCA9IG9sZFRleHQubGVuZ3RoO1xuICBsZXQgbmV3RW5kID0gbmV3VGV4dC5sZW5ndGg7XG4gIHdoaWxlIChvbGRFbmQgPiBwICYmIG5ld0VuZCA+IHAgJiYgb2xkVGV4dFtvbGRFbmQgLSAxXSA9PT0gbmV3VGV4dFtuZXdFbmQgLSAxXSkge1xuICAgIG9sZEVuZC0tOyBuZXdFbmQtLTtcbiAgfVxuICBjb25zdCBkaWZmczogVGV4dERpZmZbXSA9IFtdO1xuICBpZiAob2xkRW5kID4gcCkgZGlmZnMucHVzaCh7IHR5cGU6ICdkZWxldGUnLCBwb3M6IHAsIGNvdW50OiBvbGRFbmQgLSBwIH0pO1xuICBjb25zdCBpbnMgPSBuZXdUZXh0LnNsaWNlKHAsIG5ld0VuZCk7XG4gIGlmIChpbnMpIGRpZmZzLnB1c2goeyB0eXBlOiAnaW5zZXJ0JywgcG9zOiBwLCB0ZXh0OiBpbnMgfSk7XG4gIHJldHVybiBkaWZmcztcbn1cblxuXG4vLyDilIDilIDilIAgTGluayBjb250ZXh0IG1lbnUgc3RhdGUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5pbnRlcmZhY2UgTGlua01lbnVTdGF0ZSB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICBocmVmOiBzdHJpbmc7XG4gIGFuY2hvckVsOiBIVE1MQW5jaG9yRWxlbWVudDtcbiAgYmxvY2tJZDogc3RyaW5nO1xufVxuXG5jb25zdCBsaW5rTWVudSA9IHNpZ25hbDxMaW5rTWVudVN0YXRlIHwgbnVsbD4obnVsbCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBMaW5rQ29udGV4dE1lbnUoKTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgbSA9IGxpbmtNZW51LnZhbHVlO1xuICBpZiAoIW0pIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IGNsb3NlID0gKCk6IHZvaWQgPT4geyBsaW5rTWVudS52YWx1ZSA9IG51bGw7IH07XG5cbiAgY29uc3Qgb3BlbkxpbmsgPSAoKTogdm9pZCA9PiB7XG4gICAgaWYgKHdpbmRvdy5ub3RlYm9vaz8ub3BlbkV4dGVybmFsKSB3aW5kb3cubm90ZWJvb2sub3BlbkV4dGVybmFsKG0uaHJlZik7XG4gICAgY2xvc2UoKTtcbiAgfTtcblxuICBjb25zdCBlZGl0TGluayA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB1cmwgPSBwcm9tcHQoJ0VkaXQgVVJMOicsIG0uaHJlZik7XG4gICAgaWYgKHVybCAhPSBudWxsKSB7XG4gICAgICBtLmFuY2hvckVsLmhyZWYgPSB1cmw7XG4gICAgICAvLyBwZXJzaXN0IGh0bWwgY2hhbmdlXG4gICAgICBjb25zdCBibG9ja0VsID0gbS5hbmNob3JFbC5jbG9zZXN0KCcuYmxvY2stY29udGVudCcpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICAgIGlmIChibG9ja0VsKSB7XG4gICAgICAgIHVwZGF0ZUJsb2NrSHRtbChtLmJsb2NrSWQsIGJsb2NrRWwuaW5uZXJIVE1MKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY2xvc2UoKTtcbiAgfTtcblxuICBjb25zdCByZW1vdmVMaW5rID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHBhcmVudCA9IG0uYW5jaG9yRWwucGFyZW50Tm9kZSE7XG4gICAgd2hpbGUgKG0uYW5jaG9yRWwuZmlyc3RDaGlsZCkgcGFyZW50Lmluc2VydEJlZm9yZShtLmFuY2hvckVsLmZpcnN0Q2hpbGQsIG0uYW5jaG9yRWwpO1xuICAgIHBhcmVudC5yZW1vdmVDaGlsZChtLmFuY2hvckVsKTtcbiAgICBjb25zdCBibG9ja0VsID0gKHBhcmVudCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnLmJsb2NrLWNvbnRlbnQnKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgaWYgKGJsb2NrRWwpIHtcbiAgICAgIHVwZGF0ZUJsb2NrSHRtbChtLmJsb2NrSWQsIGJsb2NrRWwuaW5uZXJIVE1MKTtcbiAgICB9XG4gICAgY2xvc2UoKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3M9XCJsaW5rLW1lbnVcIiBzdHlsZT17eyBsZWZ0OiBtLnggKyAncHgnLCB0b3A6IG0ueSArICdweCcgfX0gb25Nb3VzZURvd249eyhlOiBNb3VzZUV2ZW50KSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpfT5cbiAgICAgIDxkaXYgY2xhc3M9XCJsaW5rLW1lbnUtdXJsXCIgdGl0bGU9e20uaHJlZn0+e20uaHJlZi5sZW5ndGggPiA0MCA/IG0uaHJlZi5zbGljZSgwLCAzNykgKyAnLi4uJyA6IG0uaHJlZn08L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJsaW5rLW1lbnUtYWN0aW9uc1wiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwibGluay1tZW51LWJ0blwiIG9uQ2xpY2s9e29wZW5MaW5rfT5PcGVuPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJsaW5rLW1lbnUtYnRuXCIgb25DbGljaz17ZWRpdExpbmt9PkVkaXQ8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImxpbmstbWVudS1idG4gbGluay1tZW51LWJ0bi0tZGFuZ2VyXCIgb25DbGljaz17cmVtb3ZlTGlua30+UmVtb3ZlPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuLy8gQ2xvc2UgbGluayBtZW51IG9uIGFueSBjbGljayBvdXRzaWRlXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoKSA9PiB7IGxpbmtNZW51LnZhbHVlID0gbnVsbDsgfSk7XG59XG5cbi8vIOKUgOKUgOKUgCBVUkwgbGlua2lmaWVyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuY29uc3QgTElOS19VUkxfUkUgPSAvaHR0cHM/OlxcL1xcL1teXFxzPD5cInt9fFxcXFxeYFtcXF1dKyg/PCFbLiw7OiE/XSkvZztcblxuZnVuY3Rpb24gbGlua2lmeVRleHQodGV4dDogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIGxldCBoYXNVcmwgPSBmYWxzZTtcbiAgY29uc3Qgc2VnbWVudHM6IHN0cmluZ1tdID0gW107XG4gIGxldCBsYXN0ID0gMDtcbiAgTElOS19VUkxfUkUubGFzdEluZGV4ID0gMDtcbiAgbGV0IG06IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGw7XG4gIHdoaWxlICgobSA9IExJTktfVVJMX1JFLmV4ZWModGV4dCkpICE9PSBudWxsKSB7XG4gICAgaGFzVXJsID0gdHJ1ZTtcbiAgICBjb25zdCBiZWZvcmUgPSB0ZXh0LnNsaWNlKGxhc3QsIG0uaW5kZXgpXG4gICAgICAucmVwbGFjZSgvJi9nLCAnJmFtcDsnKS5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvPi9nLCAnJmd0OycpXG4gICAgICAucmVwbGFjZSgvXFxuL2csICc8YnI+Jyk7XG4gICAgc2VnbWVudHMucHVzaChiZWZvcmUpO1xuICAgIGNvbnN0IHVybCA9IG1bMF07XG4gICAgY29uc3QgZXNjID0gdXJsLnJlcGxhY2UoLyYvZywgJyZhbXA7JykucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcbiAgICBzZWdtZW50cy5wdXNoKGA8YSBocmVmPVwiJHtlc2N9XCI+JHtlc2N9PC9hPmApO1xuICAgIGxhc3QgPSBtLmluZGV4ICsgdXJsLmxlbmd0aDtcbiAgfVxuICBpZiAoIWhhc1VybCkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHRyYWlsaW5nID0gdGV4dC5zbGljZShsYXN0KVxuICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpLnJlcGxhY2UoLzwvZywgJyZsdDsnKS5yZXBsYWNlKC8+L2csICcmZ3Q7JylcbiAgICAucmVwbGFjZSgvXFxuL2csICc8YnI+Jyk7XG4gIHNlZ21lbnRzLnB1c2godHJhaWxpbmcpO1xuICByZXR1cm4gc2VnbWVudHMuam9pbignJyk7XG59XG5cbi8vIOKUgOKUgOKUgCBIVE1MIHBhc3RlIHNhbml0aXplciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmNvbnN0IFBBU1RFX0FMTE9XRUQgPSBuZXcgU2V0KFtcbiAgJ3AnLCdicicsJ2gxJywnaDInLCdoMycsJ2g0JywnaDUnLCdoNicsXG4gICd1bCcsJ29sJywnbGknLFxuICAnYicsJ3N0cm9uZycsJ2knLCdlbScsJ3UnLCdzJywnZGVsJywnc3RyaWtlJyxcbiAgJ2NvZGUnLCdwcmUnLCdibG9ja3F1b3RlJyxcbiAgJ2EnLFxuXSk7XG5cbmZ1bmN0aW9uIHNhbml0aXplUGFzdGVkSHRtbChodG1sOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBkb2MgPSBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKGh0bWwsICd0ZXh0L2h0bWwnKTtcblxuICBmdW5jdGlvbiB3YWxrKG5vZGU6IE5vZGUpOiBOb2RlIHwgbnVsbCB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobm9kZS50ZXh0Q29udGVudCB8fCAnJyk7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgIT09IE5vZGUuRUxFTUVOVF9OT0RFKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGVsID0gbm9kZSBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCB0YWcgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBbLi4uZWwuY2hpbGROb2Rlc10pIHtcbiAgICAgIGNvbnN0IHIgPSB3YWxrKGNoaWxkKTtcbiAgICAgIGlmIChyKSBjaGlsZHJlbi5hcHBlbmRDaGlsZChyKTtcbiAgICB9XG5cbiAgICBpZiAoIVBBU1RFX0FMTE9XRUQuaGFzKHRhZykpIHJldHVybiBjaGlsZHJlbjsgLy8gdW53cmFwIHVua25vd24gdGFnc1xuXG4gICAgY29uc3Qgb3V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcbiAgICAgIHRhZyA9PT0gJ3N0cm9uZycgPyAnYicgOiB0YWcgPT09ICdlbScgPyAnaScgOiB0YWcgPT09ICdzdHJpa2UnID8gJ3MnIDogdGFnXG4gICAgKTtcbiAgICBpZiAodGFnID09PSAnYScpIHtcbiAgICAgIGNvbnN0IGhyZWYgPSBlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgICAgIGlmIChocmVmKSBvdXQuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG4gICAgfVxuICAgIG91dC5hcHBlbmRDaGlsZChjaGlsZHJlbik7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIGNvbnN0IGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gIGZvciAoY29uc3QgY2hpbGQgb2YgWy4uLmRvYy5ib2R5LmNoaWxkTm9kZXNdKSB7XG4gICAgY29uc3QgciA9IHdhbGsoY2hpbGQpO1xuICAgIGlmIChyKSBmcmFnLmFwcGVuZENoaWxkKHIpO1xuICB9XG4gIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuYXBwZW5kQ2hpbGQoZnJhZyk7XG4gIHJldHVybiBkaXYuaW5uZXJIVE1MO1xufVxuXG5pbnRlcmZhY2UgQmxvY2tQcm9wcyB7XG4gIGJsb2NrOiBCbG9ja1R5cGU7XG4gIHBhZ2U6IFBhZ2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBCbG9jayh7IGJsb2NrLCBwYWdlIH06IEJsb2NrUHJvcHMpOiBKU1guRWxlbWVudCB7XG4gIGNvbnN0IGN0eCA9IHVzZUNvbnRleHQoQ2FudmFzQ3R4KSE7XG4gIGNvbnN0IGNvbnRlbnRSZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpO1xuICBjb25zdCBpc0ltYWdlICAgICA9IGJsb2NrLnR5cGUgPT09ICdpbWFnZSc7XG4gIGNvbnN0IGlzTG9hZGluZyAgID0gYmxvY2sudHlwZSA9PT0gJ2xvYWRpbmcnO1xuICBjb25zdCBpc0NoZWNrbGlzdCA9IGJsb2NrLnR5cGUgPT09ICdjaGVja2xpc3QnO1xuICBjb25zdCBpc1NlbGVjdGVkID0gY3R4LnNlbGVjdGVkSWRzLmhhcyhibG9jay5pZCk7XG5cbiAgLy8gUmVzb2x2ZSBub3RlYm9vayBibG9iIHJlZnMgKFwiYmxvYjo8c2hhMjU2PlwiKSB0byBkYXRhIFVSTHMuXG4gIC8vIE9iamVjdCBVUkxzIChcImJsb2I6bnVsbC8uLi5cIikgYW5kIG90aGVyIHNyY3MgYXJlIHVzZWQgZGlyZWN0bHkuXG4gIGNvbnN0IGlzTm90ZWJvb2tCbG9iID0gKHM6IHN0cmluZyk6IGJvb2xlYW4gPT4gcy5zdGFydHNXaXRoKCdibG9iOicpICYmICFzLmluY2x1ZGVzKCcvJyk7XG4gIGNvbnN0IHJhd1NyYyA9IGJsb2NrLnNyYyB8fCAnJztcbiAgY29uc3QgW3Jlc29sdmVkU3JjLCBzZXRSZXNvbHZlZFNyY10gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihpc05vdGVib29rQmxvYihyYXdTcmMpID8gbnVsbCA6IHJhd1NyYyk7XG5cbiAgLy8gSW1hZ2UgY3JvcCBzdGF0ZVxuICBjb25zdCBbbmF0dXJhbFNpemUsIHNldE5hdHVyYWxTaXplXSA9IHVzZVN0YXRlPHsgdzogbnVtYmVyOyBoOiBudW1iZXIgfSB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbY3JvcHBpbmcsIHNldENyb3BwaW5nXSA9IHVzZVN0YXRlPGJvb2xlYW4+KGZhbHNlKTtcbiAgY29uc3QgW3BlbmRpbmdDcm9wLCBzZXRQZW5kaW5nQ3JvcF0gPSB1c2VTdGF0ZTx7IHg6IG51bWJlcjsgeTogbnVtYmVyOyB3OiBudW1iZXI7IGg6IG51bWJlciB9IHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IHBlbmRpbmdDcm9wUmVmID0gdXNlUmVmPHsgeDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaDogbnVtYmVyIH0gfCBudWxsPihudWxsKTtcblxuICAvLyBCb3JkZXIgbG9jYWwgc3RhdGUg4oCUIGRyaXZlcyBpbW1lZGlhdGUgdmlzdWFsIGZlZWRiYWNrOyBzdG9yZSBpcyBzb3VyY2Ugb2YgdHJ1dGggb24gbW91bnQvdW5kb1xuICBjb25zdCBbYm9yZGVyT24sIHNldEJvcmRlck9uXSA9IHVzZVN0YXRlPGJvb2xlYW4+KCEhYmxvY2suYm9yZGVyKTtcbiAgdXNlRWZmZWN0KCgpID0+IHsgc2V0Qm9yZGVyT24oISFibG9jay5ib3JkZXIpOyB9LCBbYmxvY2suYm9yZGVyXSk7XG5cbiAgLy8gQ2hlY2tsaXN0IGl0ZW0gRE9NIHJlZnMgKGl0ZW1JZCDihpIgc3BhbiBlbGVtZW50KVxuICBjb25zdCBpdGVtUmVmcyA9IHVzZVJlZjxSZWNvcmQ8c3RyaW5nLCBIVE1MU3BhbkVsZW1lbnQ+Pih7fSk7XG5cbiAgY29uc3QgdG9nZ2xlQm9yZGVyID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG5leHQgPSAhYm9yZGVyT247XG4gICAgc2V0Qm9yZGVyT24obmV4dCk7XG4gICAgdXBkYXRlQmxvY2tCb3JkZXIoYmxvY2suaWQsIG5leHQpO1xuICB9O1xuXG4gIC8vIOKUgOKUgCBDaGVja2xpc3QgaGFuZGxlcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbiAgLy8gUmVhZCBjdXJyZW50IHRleHQgZnJvbSBET00gcmVmcyAobWF5IGJlIGFoZWFkIG9mIGJsb2NrLml0ZW1zIGR1cmluZyB0eXBpbmcpXG4gIGNvbnN0IGdldEl0ZW1zV2l0aERPTVRleHQgPSAoKTogQ2hlY2tsaXN0SXRlbVtdID0+XG4gICAgKGJsb2NrLml0ZW1zIHx8IFtdKS5tYXAoaSA9PiAoeyAuLi5pLCB0ZXh0OiBpdGVtUmVmcy5jdXJyZW50W2kuaWRdPy50ZXh0Q29udGVudCA/PyBpLnRleHQgfSkpO1xuXG4gIGNvbnN0IHRvZ2dsZUNoZWNrSXRlbSA9IChpdGVtSWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGl0ZW1zID0gZ2V0SXRlbXNXaXRoRE9NVGV4dCgpLm1hcChpID0+XG4gICAgICBpLmlkID09PSBpdGVtSWQgPyB7IC4uLmksIGNoZWNrZWQ6ICFpLmNoZWNrZWQgfSA6IGlcbiAgICApO1xuICAgIHVwZGF0ZUNoZWNrbGlzdEl0ZW1zKGJsb2NrLmlkLCBpdGVtcyk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlSXRlbUtleURvd24gPSAoZTogS2V5Ym9hcmRFdmVudCwgaXRlbUlkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBjb25zdCBtb2QgPSBlLmN0cmxLZXkgfHwgZS5tZXRhS2V5O1xuICAgIGlmIChtb2QgJiYgZS5rZXkgPT09ICd6JykgeyBlLnByZXZlbnREZWZhdWx0KCk7IGUuc2hpZnRLZXkgPyBjdHgucmVkbygpIDogY3R4LnVuZG8oKTsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBpdGVtcyA9IGJsb2NrLml0ZW1zIHx8IFtdO1xuICAgIGNvbnN0IGlkeCA9IGl0ZW1zLmZpbmRJbmRleChpID0+IGkuaWQgPT09IGl0ZW1JZCk7XG5cbiAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IG5ld0l0ZW06IENoZWNrbGlzdEl0ZW0gPSB7IGlkOiB1aWQoKSwgdGV4dDogJycsIGNoZWNrZWQ6IGZhbHNlIH07XG4gICAgICBjb25zdCBjdXJyZW50ID0gZ2V0SXRlbXNXaXRoRE9NVGV4dCgpO1xuICAgICAgY29uc3QgbmV3SXRlbXMgPSBbLi4uY3VycmVudC5zbGljZSgwLCBpZHggKyAxKSwgbmV3SXRlbSwgLi4uY3VycmVudC5zbGljZShpZHggKyAxKV07XG4gICAgICB1cGRhdGVDaGVja2xpc3RJdGVtcyhibG9jay5pZCwgbmV3SXRlbXMpO1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IGl0ZW1SZWZzLmN1cnJlbnRbbmV3SXRlbS5pZF0/LmZvY3VzKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChlLmtleSA9PT0gJ0JhY2tzcGFjZScgJiYgKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS50ZXh0Q29udGVudCA9PT0gJycpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChpdGVtcy5sZW5ndGggPD0gMSkgeyBkZWxldGVCbG9jayhibG9jay5pZCk7IHJldHVybjsgfVxuICAgICAgY29uc3QgcHJldkl0ZW0gPSBpdGVtc1tNYXRoLm1heCgwLCBpZHggLSAxKV07XG4gICAgICBjb25zdCBuZXdJdGVtcyA9IGdldEl0ZW1zV2l0aERPTVRleHQoKS5maWx0ZXIoaSA9PiBpLmlkICE9PSBpdGVtSWQpO1xuICAgICAgdXBkYXRlQ2hlY2tsaXN0SXRlbXMoYmxvY2suaWQsIG5ld0l0ZW1zKTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGVsID0gaXRlbVJlZnMuY3VycmVudFtwcmV2SXRlbS5pZF07XG4gICAgICAgIGlmIChlbCkge1xuICAgICAgICAgIGVsLmZvY3VzKCk7XG4gICAgICAgICAgY29uc3QgciA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgICAgci5zZWxlY3ROb2RlQ29udGVudHMoZWwpO1xuICAgICAgICAgIHIuY29sbGFwc2UoZmFsc2UpO1xuICAgICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKSEucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICAgICAgd2luZG93LmdldFNlbGVjdGlvbigpIS5hZGRSYW5nZShyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUl0ZW1CbHVyID0gKCk6IHZvaWQgPT4ge1xuICAgIC8vIFNhdmUgdGV4dCBzaWxlbnRseSAobm8gcmUtcmVuZGVyKSB0byBrZWVwIHN0b3JlIGluIHN5bmNcbiAgICB1cGRhdGVDaGVja2xpc3RJdGVtc1NpbGVudChibG9jay5pZCwgZ2V0SXRlbXNXaXRoRE9NVGV4dCgpKTtcbiAgfTtcblxuICAvLyBMZWdlbmQgc3RhdGVcbiAgY29uc3QgY2FwdGlvblJlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4obnVsbCk7XG4gIGNvbnN0IFtjYXB0aW9uRWRpdGluZywgc2V0TGVnZW5kRWRpdGluZ10gPSB1c2VTdGF0ZTxib29sZWFuPihmYWxzZSk7XG4gIC8vIEVmZmVjdGl2ZSBuYXR1cmFsIHNpemU6IHByZWZlciBmcmVzaGx5IGxvYWRlZCwgZmFsbCBiYWNrIHRvIHN0b3JlZCBkaW1zIGluIGNyb3AgZGF0YVxuICBjb25zdCBudyA9IG5hdHVyYWxTaXplPy53ID8/IGJsb2NrLmNyb3A/Lm53ID8/IG51bGw7XG4gIGNvbnN0IG5oID0gbmF0dXJhbFNpemU/LmggPz8gYmxvY2suY3JvcD8ubmggPz8gbnVsbDtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWlzSW1hZ2UpIHJldHVybjtcbiAgICBpZiAoaXNOb3RlYm9va0Jsb2IocmF3U3JjKSkge1xuICAgICAgY29uc3QgaGFzaCA9IHJhd1NyYy5zbGljZSg1KTtcbiAgICAgIHdpbmRvdy5ub3RlYm9vay5nZXRCbG9iKGhhc2gpLnRoZW4oZGF0YVVybCA9PiB7XG4gICAgICAgIGlmIChkYXRhVXJsKSBzZXRSZXNvbHZlZFNyYyhkYXRhVXJsKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRSZXNvbHZlZFNyYyhyYXdTcmMpO1xuICAgIH1cbiAgfSwgW3Jhd1NyYywgaXNJbWFnZV0pO1xuXG4gIC8vIFN5bmMgY29udGVudCB3aGVuIGJsb2NrLmh0bWwgY2hhbmdlcyBleHRlcm5hbGx5ICh1bmRvL3BhZ2Utc3dpdGNoKVxuICB1c2VMYXlvdXRFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGVsID0gY29udGVudFJlZi5jdXJyZW50O1xuICAgIGlmIChlbCAmJiBlbC5pbm5lckhUTUwgIT09IGJsb2NrLmh0bWwpIHtcbiAgICAgIGVsLmlubmVySFRNTCA9IGJsb2NrLmh0bWw7XG4gICAgICBwcmV2VGV4dFJlZi5jdXJyZW50ID0gZWwuaW5uZXJUZXh0IHx8ICcnO1xuICAgIH1cbiAgfSwgW2Jsb2NrLmh0bWxdKTtcblxuICAvLyBUcmFjayBIVE1MIGF0IGZvY3VzIHRpbWUgZm9yIHVuZG8gZGVsdGFzXG4gIGNvbnN0IHVuZG9UaW1lciA9IHVzZVJlZjxSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGw+KG51bGwpO1xuICBjb25zdCBodG1sQXRGb2N1cyA9IHVzZVJlZjxzdHJpbmcgfCBudWxsPihudWxsKTtcbiAgY29uc3QgcHJldlRleHRSZWYgPSB1c2VSZWY8c3RyaW5nIHwgbnVsbD4obnVsbCk7XG5cbiAgY29uc3QgaGFuZGxlSW5wdXQgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZWwgPSBjb250ZW50UmVmLmN1cnJlbnQ7XG4gICAgaWYgKCFlbCkgcmV0dXJuO1xuXG4gICAgLy8gVHJ5IG1hcmtkb3duIHNob3J0Y3V0cyDigJQgcmV0dXJucyAnY29kZScgaWYgYmxvY2sgY29udmVydGVkXG4gICAgY29uc3QgcmVzdWx0ID0gaGFuZGxlTWFya2Rvd25JbnB1dChlbCk7XG4gICAgaWYgKHJlc3VsdCA9PT0gJ2NvZGUnKSB1cGRhdGVCbG9ja1R5cGUoYmxvY2suaWQsICdjb2RlJyk7XG5cbiAgICAvLyBDb21wdXRlIGNoYXJhY3Rlci1sZXZlbCBkaWZmIGZvciBDUkRUIHN5bmNcbiAgICBjb25zdCBuZXdUZXh0ID0gZWwuaW5uZXJUZXh0IHx8ICcnO1xuICAgIGNvbnN0IG9sZFRleHQgPSBwcmV2VGV4dFJlZi5jdXJyZW50ID8/ICcnO1xuICAgIGNvbnN0IGRpZmZzID0gY29tcHV0ZVRleHREaWZmKG9sZFRleHQsIG5ld1RleHQpO1xuICAgIHByZXZUZXh0UmVmLmN1cnJlbnQgPSBuZXdUZXh0O1xuICAgIHVwZGF0ZUJsb2NrSHRtbExvY2FsKGJsb2NrLmlkLCBlbC5pbm5lckhUTUwpO1xuICAgIHVwZGF0ZUJsb2NrVGV4dERpZmYoYmxvY2suaWQsIGRpZmZzKTtcblxuICAgIC8vIERlYm91bmNlZCB1bmRvIHNuYXBzaG90IHdoaWxlIHR5cGluZyAoZXZlcnkgfjEuNSBzIG9mIGluYWN0aXZpdHkpXG4gICAgaWYgKHVuZG9UaW1lci5jdXJyZW50ICE9PSBudWxsKSBjbGVhclRpbWVvdXQodW5kb1RpbWVyLmN1cnJlbnQpO1xuICAgIHVuZG9UaW1lci5jdXJyZW50ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoaHRtbEF0Rm9jdXMuY3VycmVudCAhPSBudWxsICYmIGh0bWxBdEZvY3VzLmN1cnJlbnQgIT09IGVsLmlubmVySFRNTCkge1xuICAgICAgICBwdXNoVW5kbyhwYWdlLmlkLCB7IHR5cGU6ICdodG1sJywgaWQ6IGJsb2NrLmlkLCBodG1sOiBodG1sQXRGb2N1cy5jdXJyZW50IH0pO1xuICAgICAgICBodG1sQXRGb2N1cy5jdXJyZW50ID0gZWwuaW5uZXJIVE1MO1xuICAgICAgfVxuICAgIH0sIDE1MDApO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUtleURvd24gPSAoZTogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG1vZCA9IGUuY3RybEtleSB8fCBlLm1ldGFLZXk7XG5cbiAgICAvLyBVbmRvIC8gcmVkb1xuICAgIGlmIChtb2QgJiYgZS5rZXkgPT09ICd6Jykge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zaGlmdEtleSA/IGN0eC5yZWRvKCkgOiBjdHgudW5kbygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9uQmxvY2tLZXlEb3duKGUsIGNvbnRlbnRSZWYuY3VycmVudCEpO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUZvY3VzID0gKCk6IHZvaWQgPT4ge1xuICAgIGh0bWxBdEZvY3VzLmN1cnJlbnQgPSBibG9jay5odG1sO1xuICAgIHByZXZUZXh0UmVmLmN1cnJlbnQgPSBjb250ZW50UmVmLmN1cnJlbnQ/LmlubmVyVGV4dCB8fCAnJztcbiAgICBjdHgub25CbG9ja0ZvY3VzPy4oYmxvY2suaWQpO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUNvbnRlbnRDbGljayA9IChlOiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3QgYW5jaG9yID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCdhW2hyZWZdJykgYXMgSFRNTEFuY2hvckVsZW1lbnQgfCBudWxsO1xuICAgIGlmICghYW5jaG9yKSByZXR1cm47XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICh3aW5kb3cubm90ZWJvb2s/Lm9wZW5FeHRlcm5hbCkgd2luZG93Lm5vdGVib29rLm9wZW5FeHRlcm5hbChhbmNob3IuaHJlZik7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlQ29udGVudENvbnRleHRNZW51ID0gKGU6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCBhbmNob3IgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJ2FbaHJlZl0nKSBhcyBIVE1MQW5jaG9yRWxlbWVudCB8IG51bGw7XG4gICAgaWYgKGFuY2hvcikge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGxpbmtNZW51LnZhbHVlID0geyB4OiBlLmNsaWVudFgsIHk6IGUuY2xpZW50WSwgaHJlZjogYW5jaG9yLmhyZWYsIGFuY2hvckVsOiBhbmNob3IsIGJsb2NrSWQ6IGJsb2NrLmlkIH07XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGNvbnN0IHNlbFRleHQgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk/LnRvU3RyaW5nKCkgfHwgJyc7XG4gICAgY29uc3QgaXRlbXM6IE1lbnVJdGVtW10gPSBbXTtcbiAgICBpZiAoc2VsVGV4dCkge1xuICAgICAgaXRlbXMucHVzaCh7IGxhYmVsOiAnQ29weScsIGFjdGlvbjogKCkgPT4gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKSB9KTtcbiAgICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICAgIGNvbnN0IHJhbmdlID0gc2VsPy5yYW5nZUNvdW50ID8gc2VsLmdldFJhbmdlQXQoMCkgOiBudWxsO1xuICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBpZiAocmFuZ2UpIGRpdi5hcHBlbmRDaGlsZChyYW5nZS5jbG9uZUNvbnRlbnRzKCkpO1xuICAgICAgY29uc3QgbWQgPSBodG1sVG9NYXJrZG93bihkaXYuaW5uZXJIVE1MKTtcbiAgICAgIGl0ZW1zLnB1c2goeyBsYWJlbDogJ0NvcHkgYXMgTWFya2Rvd24nLCBhY3Rpb246ICgpID0+IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KG1kKSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaXRlbXMucHVzaCh7IGxhYmVsOiAnQ29weScsIGRpc2FibGVkOiB0cnVlLCBhY3Rpb246ICgpID0+IHt9IH0pO1xuICAgICAgaXRlbXMucHVzaCh7IGxhYmVsOiAnQ29weSBhcyBNYXJrZG93bicsIGRpc2FibGVkOiB0cnVlLCBhY3Rpb246ICgpID0+IHt9IH0pO1xuICAgIH1cbiAgICBpdGVtcy5wdXNoKHsgbGFiZWw6ICdQYXN0ZScsIGFjdGlvbjogKCkgPT4ge1xuICAgICAgY29uc3QgZWwgPSBjb250ZW50UmVmLmN1cnJlbnQ7XG4gICAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICBjb25zdCBzYXZlZFJhbmdlID0gc2VsPy5yYW5nZUNvdW50ID8gc2VsLmdldFJhbmdlQXQoMCkuY2xvbmVSYW5nZSgpIDogbnVsbDtcbiAgICAgIG5hdmlnYXRvci5jbGlwYm9hcmQucmVhZFRleHQoKS50aGVuKHRleHQgPT4ge1xuICAgICAgICBpZiAoIXRleHQgfHwgIWVsKSByZXR1cm47XG4gICAgICAgIGVsLmZvY3VzKCk7XG4gICAgICAgIGlmIChzYXZlZFJhbmdlKSB7XG4gICAgICAgICAgY29uc3QgcyA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKSE7XG4gICAgICAgICAgcy5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgICAgICBzLmFkZFJhbmdlKHNhdmVkUmFuZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRUZXh0JywgZmFsc2UsIHRleHQpO1xuICAgICAgfSk7XG4gICAgfX0pO1xuICAgIGlmIChzZWxUZXh0KSB7XG4gICAgICBpdGVtcy5wdXNoKHsgdHlwZTogJ3NlcGFyYXRvcicgfSk7XG4gICAgICBjb25zdCBxID0gZW5jb2RlVVJJQ29tcG9uZW50KHNlbFRleHQpO1xuICAgICAgaXRlbXMucHVzaCh7IGxhYmVsOiAnU2VhcmNoIHdpdGggR29vZ2xlJywgYWN0aW9uOiAoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5ub3RlYm9vaz8ub3BlbkV4dGVybmFsKCdodHRwczovL3d3dy5nb29nbGUuY29tL3NlYXJjaD9xPScgKyBxKTtcbiAgICAgIH19KTtcbiAgICAgIGl0ZW1zLnB1c2goeyBsYWJlbDogJ0FzayBDaGF0R1BUJywgYWN0aW9uOiAoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5ub3RlYm9vaz8ub3BlbkV4dGVybmFsKCdodHRwczovL2NoYXRncHQuY29tLz9xPScgKyBxKTtcbiAgICAgIH19KTtcbiAgICB9XG4gICAgb3BlbkNvbnRleHRNZW51KGUuY2xpZW50WCwgZS5jbGllbnRZLCBpdGVtcyk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlSW1hZ2VDb250ZXh0TWVudSA9IChlOiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY29uc3QgaXRlbXM6IE1lbnVJdGVtW10gPSBbXG4gICAgICB7IGxhYmVsOiAnQ29weSBJbWFnZScsIGFjdGlvbjogKCkgPT4ge1xuICAgICAgICBjb25zdCBpbWcgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJy5pbWctZnJhbWUnKT8ucXVlcnlTZWxlY3RvcignaW1nJyk7XG4gICAgICAgIGlmICghaW1nKSByZXR1cm47XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gaW1nLm5hdHVyYWxXaWR0aDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaW1nLm5hdHVyYWxIZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmdldENvbnRleHQoJzJkJykhLmRyYXdJbWFnZShpbWcsIDAsIDApO1xuICAgICAgICAgIGNhbnZhcy50b0Jsb2IoYmxvYiA9PiB7XG4gICAgICAgICAgICBpZiAoYmxvYikgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZShbbmV3IENsaXBib2FyZEl0ZW0oeyBbYmxvYi50eXBlXTogYmxvYiB9KV0pLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCB7fVxuICAgICAgfX0sXG4gICAgXTtcbiAgICBvcGVuQ29udGV4dE1lbnUoZS5jbGllbnRYLCBlLmNsaWVudFksIGl0ZW1zKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVDb3B5ID0gKGU6IENsaXBib2FyZEV2ZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgIGlmICghc2VsIHx8IHNlbC5pc0NvbGxhcHNlZCkgcmV0dXJuO1xuICAgIGNvbnN0IHJhbmdlID0gc2VsLmdldFJhbmdlQXQoMCk7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmFwcGVuZENoaWxkKHJhbmdlLmNsb25lQ29udGVudHMoKSk7XG4gICAgY29uc3Qgc2VsZWN0ZWRIdG1sID0gZGl2LmlubmVySFRNTDtcbiAgICBjb25zdCBtYXJrZG93biA9IGh0bWxUb01hcmtkb3duKHNlbGVjdGVkSHRtbCk7XG4gICAgaWYgKCFtYXJrZG93bikgcmV0dXJuO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLmNsaXBib2FyZERhdGEhLnNldERhdGEoJ3RleHQvcGxhaW4nLCBzZWwudG9TdHJpbmcoKSk7XG4gICAgZS5jbGlwYm9hcmREYXRhIS5zZXREYXRhKCd0ZXh0L2h0bWwnLCBzZWxlY3RlZEh0bWwpO1xuICAgIGUuY2xpcGJvYXJkRGF0YSEuc2V0RGF0YSgndGV4dC9tYXJrZG93bicsIG1hcmtkb3duKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVQYXN0ZSA9IChlOiBDbGlwYm9hcmRFdmVudCk6IHZvaWQgPT4ge1xuICAgIGlmIChbLi4uKGUuY2xpcGJvYXJkRGF0YT8uaXRlbXMgfHwgW10pXS5zb21lKGkgPT4gaS50eXBlLnN0YXJ0c1dpdGgoJ2ltYWdlLycpKSkgcmV0dXJuO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCB0ZXh0ID0gZS5jbGlwYm9hcmREYXRhPy5nZXREYXRhKCd0ZXh0L3BsYWluJykgfHwgJyc7XG4gICAgY29uc3QgdHJpbW1lZCA9IHRleHQudHJpbSgpO1xuICAgIGNvbnN0IGlzUHVyZVVybCA9IC9eaHR0cHM/OlxcL1xcL1xcUyskLy50ZXN0KHRyaW1tZWQpO1xuXG4gICAgLy8gUHVyZSBVUkw6IGNoZWNrIGJlZm9yZSBIVE1MIHNvIGNsaXBib2FyZCBIVE1MIGZyb20gdGhlIHNvdXJjZSBkb2Vzbid0IGJ5cGFzcyBsaW5raWZpY2F0aW9uXG4gICAgaWYgKGlzUHVyZVVybCkge1xuICAgICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgaWYgKHNlbCAmJiAhc2VsLmlzQ29sbGFwc2VkKSB7XG4gICAgICAgIC8vIFdyYXAgZXhpc3Rpbmcgc2VsZWN0aW9uIGFzIGEgbGlua1xuICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY3JlYXRlTGluaycsIGZhbHNlLCB0cmltbWVkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGVzYyA9IHRyaW1tZWQucmVwbGFjZSgvJi9nLCAnJmFtcDsnKS5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvPi9nLCAnJmd0OycpO1xuICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnaW5zZXJ0SFRNTCcsIGZhbHNlLCBgPGEgaHJlZj1cIiR7ZXNjfVwiPiR7ZXNjfTwvYT5gKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBodG1sID0gZS5jbGlwYm9hcmREYXRhPy5nZXREYXRhKCd0ZXh0L2h0bWwnKTtcbiAgICBpZiAoaHRtbCkge1xuICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydEhUTUwnLCBmYWxzZSwgc2FuaXRpemVQYXN0ZWRIdG1sKGh0bWwpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRleHQpIHJldHVybjtcbiAgICAvLyBMaW5raWZ5IGFueSBVUkxzIGluIHBsYWluIHRleHQsIG90aGVyd2lzZSBpbnNlcnQgYXMtaXNcbiAgICBjb25zdCBsaW5rZWQgPSBsaW5raWZ5VGV4dCh0ZXh0KTtcbiAgICBpZiAobGlua2VkKSB7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnaW5zZXJ0SFRNTCcsIGZhbHNlLCBsaW5rZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnaW5zZXJ0VGV4dCcsIGZhbHNlLCB0ZXh0KTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlQmx1ciA9ICgpOiB2b2lkID0+IHtcbiAgICBpZiAodW5kb1RpbWVyLmN1cnJlbnQgIT09IG51bGwpIGNsZWFyVGltZW91dCh1bmRvVGltZXIuY3VycmVudCk7XG4gICAgY29uc3QgZWwgPSBjb250ZW50UmVmLmN1cnJlbnQ7XG4gICAgaWYgKCFlbCkgcmV0dXJuO1xuXG4gICAgY29uc3QgaHRtbCA9IGVsLmlubmVySFRNTDtcbiAgICBjb25zdCBpc0VtcHR5ID0gIWh0bWwgfHwgaHRtbCA9PT0gJzxicj4nIHx8IGh0bWwudHJpbSgpID09PSAnJztcblxuICAgIC8vIFB1c2ggdW5kbyBkZWx0YSBpZiBjb250ZW50IGNoYW5nZWQgZHVyaW5nIHRoaXMgZWRpdCBzZXNzaW9uXG4gICAgaWYgKGh0bWxBdEZvY3VzLmN1cnJlbnQgIT0gbnVsbCAmJiBodG1sQXRGb2N1cy5jdXJyZW50ICE9PSBodG1sKSB7XG4gICAgICBwdXNoVW5kbyhwYWdlLmlkLCB7IHR5cGU6ICdodG1sJywgaWQ6IGJsb2NrLmlkLCBodG1sOiBodG1sQXRGb2N1cy5jdXJyZW50IH0pO1xuICAgIH1cbiAgICBodG1sQXRGb2N1cy5jdXJyZW50ID0gbnVsbDtcblxuICAgIGlmIChpc0VtcHR5KSB7XG4gICAgICBkZWxldGVCbG9jayhibG9jay5pZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVwZGF0ZUJsb2NrSHRtbChibG9jay5pZCwgaHRtbCk7XG4gICAgfVxuICAgIGN0eC5vbkJsb2NrQmx1cj8uKGJsb2NrLmlkKTtcbiAgfTtcblxuICAvLyDilIDilIAgSW1hZ2UgY3JvcCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICBjb25zdCBoYW5kbGVJbWdMb2FkID0gKGU6IEV2ZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3QgaW1nID0gZS50YXJnZXQgYXMgSFRNTEltYWdlRWxlbWVudDtcbiAgICBzZXROYXR1cmFsU2l6ZSh7IHc6IGltZy5uYXR1cmFsV2lkdGgsIGg6IGltZy5uYXR1cmFsSGVpZ2h0IH0pO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUltZ0RvdWJsZUNsaWNrID0gKGU6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcbiAgICBpZiAoIW53IHx8ICFuaCkgcmV0dXJuO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY29uc3QgaW5pdENyb3AgPSBibG9jay5jcm9wXG4gICAgICA/IHsgeDogYmxvY2suY3JvcC54LCB5OiBibG9jay5jcm9wLnksIHc6IGJsb2NrLmNyb3AudywgaDogYmxvY2suY3JvcC5oIH1cbiAgICAgIDogeyB4OiAwLCB5OiAwLCB3OiBudywgaDogbmggfTtcbiAgICBwZW5kaW5nQ3JvcFJlZi5jdXJyZW50ID0gaW5pdENyb3A7XG4gICAgc2V0UGVuZGluZ0Nyb3AoaW5pdENyb3ApO1xuICAgIHNldENyb3BwaW5nKHRydWUpO1xuICB9O1xuXG4gIC8vIEVzY2FwZSBjYW5jZWxzIGNyb3AgbW9kZVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghY3JvcHBpbmcpIHJldHVybjtcbiAgICBjb25zdCBvbktleSA9IChlOiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XG4gICAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7IHNldENyb3BwaW5nKGZhbHNlKTsgc2V0UGVuZGluZ0Nyb3AobnVsbCk7IH1cbiAgICB9O1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleSk7XG4gICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleSk7XG4gIH0sIFtjcm9wcGluZ10pO1xuXG4gIC8vIExlZ2VuZDogc3luYyBjb250ZW50IGZyb20gc3RvcmUgKHVuZG8vcGFnZS1zd2l0Y2gpXG4gIHVzZUxheW91dEVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgZWwgPSBjYXB0aW9uUmVmLmN1cnJlbnQ7XG4gICAgaWYgKGVsICYmIGVsLmlubmVyVGV4dCAhPT0gKGJsb2NrLmNhcHRpb24gfHwgJycpKSB7XG4gICAgICBlbC5pbm5lclRleHQgPSBibG9jay5jYXB0aW9uIHx8ICcnO1xuICAgIH1cbiAgfSwgW2Jsb2NrLmNhcHRpb25dKTtcblxuICAvLyBMZWdlbmQ6IGZvY3VzIHdoZW4gZWRpdGluZyBzdGFydHNcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWNhcHRpb25FZGl0aW5nIHx8ICFjYXB0aW9uUmVmLmN1cnJlbnQpIHJldHVybjtcbiAgICBjb25zdCBlbCA9IGNhcHRpb25SZWYuY3VycmVudDtcbiAgICBlbC5mb2N1cygpO1xuICAgIGNvbnN0IHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgICByYW5nZS5zZWxlY3ROb2RlQ29udGVudHMoZWwpO1xuICAgIHJhbmdlLmNvbGxhcHNlKGZhbHNlKTtcbiAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkhO1xuICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpO1xuICB9LCBbY2FwdGlvbkVkaXRpbmddKTtcblxuICAvLyBMZWdlbmQ6IHN0b3AgZWRpdGluZyB3aGVuIGJsb2NrIGlzIGRlc2VsZWN0ZWRcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWlzU2VsZWN0ZWQpIHNldExlZ2VuZEVkaXRpbmcoZmFsc2UpO1xuICB9LCBbaXNTZWxlY3RlZF0pO1xuXG4gIC8vIExlZ2VuZDogRW50ZXIga2V5IG9uIHNlbGVjdGVkIGltYWdlIHN0YXJ0cyBjYXB0aW9uIGVkaXRpbmdcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWlzU2VsZWN0ZWQgfHwgIWlzSW1hZ2UpIHJldHVybjtcbiAgICBjb25zdCBvbktleSA9IChlOiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XG4gICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgJiYgIWNhcHRpb25FZGl0aW5nICYmICFjcm9wcGluZyAmJiAhKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpPy5pc0NvbnRlbnRFZGl0YWJsZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHNldExlZ2VuZEVkaXRpbmcodHJ1ZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXkpO1xuICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXkpO1xuICB9LCBbaXNTZWxlY3RlZCwgaXNJbWFnZSwgY2FwdGlvbkVkaXRpbmcsIGNyb3BwaW5nXSk7XG5cbiAgY29uc3QgaGFuZGxlTGVnZW5kS2V5RG93biA9IChlOiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB7IGUucHJldmVudERlZmF1bHQoKTsgY2FwdGlvblJlZi5jdXJyZW50Py5ibHVyKCk7IH1cbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICBpZiAoY2FwdGlvblJlZi5jdXJyZW50KSBjYXB0aW9uUmVmLmN1cnJlbnQuaW5uZXJUZXh0ID0gYmxvY2suY2FwdGlvbiB8fCAnJztcbiAgICAgIGNhcHRpb25SZWYuY3VycmVudD8uYmx1cigpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVMZWdlbmRCbHVyID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHRleHQgPSBjYXB0aW9uUmVmLmN1cnJlbnQ/LmlubmVyVGV4dD8udHJpbSgpIHx8ICcnO1xuICAgIHNldExlZ2VuZEVkaXRpbmcoZmFsc2UpO1xuICAgIHVwZGF0ZUJsb2NrQ2FwdGlvbihibG9jay5pZCwgdGV4dCB8fCB1bmRlZmluZWQpO1xuICB9O1xuXG4gIC8vIENoZWNrbGlzdDogc3luYyB0ZXh0IGZyb20gc3RvcmUgd2hlbiBpdGVtcyBjaGFuZ2UgZXh0ZXJuYWxseSAodW5kby9yZW1vdGUgc3luYylcbiAgdXNlTGF5b3V0RWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWlzQ2hlY2tsaXN0KSByZXR1cm47XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIChibG9jay5pdGVtcyB8fCBbXSkpIHtcbiAgICAgIGNvbnN0IGVsID0gaXRlbVJlZnMuY3VycmVudFtpdGVtLmlkXTtcbiAgICAgIGlmIChlbCAmJiBlbC50ZXh0Q29udGVudCAhPT0gaXRlbS50ZXh0KSBlbC50ZXh0Q29udGVudCA9IGl0ZW0udGV4dDtcbiAgICB9XG4gIH0sIFtibG9jay5pdGVtc10pO1xuXG4gIGNvbnN0IHN0YXJ0Q3JvcERyYWcgPSAoZTogUG9pbnRlckV2ZW50LCBkaXI6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGNvbnN0IHpvb20gPSBjdHguZ2V0Wm9vbSgpO1xuICAgIGNvbnN0IGltZ1NjYWxlID0gYmxvY2sudyAvIG53ITsgLy8gY2FudmFzIHB4IHBlciBuYXR1cmFsIHB4XG4gICAgY29uc3Qgc3RhcnRYID0gZS5jbGllbnRYLCBzdGFydFkgPSBlLmNsaWVudFk7XG4gICAgY29uc3Qgb3JpZ0Nyb3AgPSB7IC4uLnBlbmRpbmdDcm9wUmVmLmN1cnJlbnQhIH07XG5cbiAgICBmdW5jdGlvbiBvbk1vdmUoZTI6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgICAgY29uc3QgZHggPSAoZTIuY2xpZW50WCAtIHN0YXJ0WCkgLyB6b29tIC8gaW1nU2NhbGU7XG4gICAgICBjb25zdCBkeSA9IChlMi5jbGllbnRZIC0gc3RhcnRZKSAvIHpvb20gLyBpbWdTY2FsZTtcbiAgICAgIGxldCB7IHgsIHksIHcsIGggfSA9IG9yaWdDcm9wO1xuICAgICAgaWYgKGRpci5pbmNsdWRlcygnZScpKSB3ID0gTWF0aC5tYXgoMjAsIE1hdGgubWluKG53ISAtIHgsIHcgKyBkeCkpO1xuICAgICAgaWYgKGRpci5pbmNsdWRlcygndycpKSB7XG4gICAgICAgIGNvbnN0IGQgPSBNYXRoLm1heCgteCwgTWF0aC5taW4odyAtIDIwLCBkeCkpO1xuICAgICAgICB4ICs9IGQ7IHcgLT0gZDtcbiAgICAgIH1cbiAgICAgIGlmIChkaXIuaW5jbHVkZXMoJ3MnKSkgaCA9IE1hdGgubWF4KDIwLCBNYXRoLm1pbihuaCEgLSB5LCBoICsgZHkpKTtcbiAgICAgIGlmIChkaXIuaW5jbHVkZXMoJ24nKSkge1xuICAgICAgICBjb25zdCBkID0gTWF0aC5tYXgoLXksIE1hdGgubWluKGggLSAyMCwgZHkpKTtcbiAgICAgICAgeSArPSBkOyBoIC09IGQ7XG4gICAgICB9XG4gICAgICBjb25zdCBuYyA9IHsgeCwgeSwgdywgaCB9O1xuICAgICAgcGVuZGluZ0Nyb3BSZWYuY3VycmVudCA9IG5jO1xuICAgICAgc2V0UGVuZGluZ0Nyb3AobmMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uVXAoKTogdm9pZCB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG9uTW92ZSk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCBvblVwKTtcbiAgICAgIGNvbnN0IGZjID0gcGVuZGluZ0Nyb3BSZWYuY3VycmVudCE7XG4gICAgICBjb25zdCBpc0Z1bGxJbWFnZSA9IGZjLnggPD0gMiAmJiBmYy55IDw9IDIgJiYgZmMudyA+PSBudyEgLSAyICYmIGZjLmggPj0gbmghIC0gMjtcbiAgICAgIGNvbnN0IGNyb3BUb1NhdmUgPSBpc0Z1bGxJbWFnZSA/IHVuZGVmaW5lZCA6IHsgLi4uZmMsIG53OiBudyEsIG5oOiBuaCEgfTtcbiAgICAgIGNvbnN0IHBnID0gZ2V0QWN0aXZlUGFnZSgpO1xuICAgICAgaWYgKHBnKSBwdXNoVW5kbyhwZy5pZCwgeyB0eXBlOiAnY3JvcCcsIGlkOiBibG9jay5pZCwgY3JvcDogYmxvY2suY3JvcCA/PyBudWxsIH0pO1xuICAgICAgdXBkYXRlQmxvY2tDcm9wKGJsb2NrLmlkLCBjcm9wVG9TYXZlKTtcbiAgICAgIHNldENyb3BwaW5nKGZhbHNlKTtcbiAgICB9XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG9uTW92ZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgb25VcCk7XG4gIH07XG5cbiAgLy8gQ2xpY2tpbmcgYW55d2hlcmUgb24gdGhlIGJsb2NrIChvdXRzaWRlIGNvbnRlbnQpIHN0YXJ0cyBhIGRyYWcvc2VsZWN0XG4gIC8vIGFuZCBjcnVjaWFsbHkgU1RPUFMgcHJvcGFnYXRpb24gc28gY2FudmFzIGRvZXNuJ3QgY3JlYXRlIGEgbmV3IGJsb2NrXG4gIGNvbnN0IGhhbmRsZUJsb2NrUG9pbnRlckRvd24gPSAoZTogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XG4gICAgLy8gQWx3YXlzIHN0b3AgcHJvcGFnYXRpb24g4oCUIG5vIGNhbnZhcyBhY3Rpb25zIHNob3VsZCBmaXJlIGZyb20gYmxvY2sgaW50ZXJhY3Rpb25zXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoY3JvcHBpbmcpIHJldHVybjtcblxuICAgIC8vIElmIGNsaWNrIGxhbmRzIG91dHNpZGUgY29udGVudC9oYW5kbGVzLCBpbml0aWF0ZSBkcmFnK3NlbGVjdFxuICAgIGNvbnN0IG9uQ29udGVudCA9IChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnLmJsb2NrLWNvbnRlbnQsIC5ibG9jay1oYW5kbGUsIC5ibG9jay1yZXNpemUsIC5pbWctcmVzaXplLCAuYmxvY2stZHJhZy1vdmVybGF5LCAuaW1nLWJvcmRlci1idG4sIC5ibG9jay1jaGVja2xpc3QnKTtcbiAgICBpZiAoIW9uQ29udGVudCkge1xuICAgICAgY3R4Lm9uQmxvY2tEcmFnU3RhcnQoZSwgYmxvY2suaWQpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzPXtbJ2Jsb2NrJywgaXNJbWFnZSAmJiAnYmxvY2stLWltYWdlJywgaXNMb2FkaW5nICYmICdibG9jay0tbG9hZGluZycsIGlzU2VsZWN0ZWQgJiYgJ2Jsb2NrLS1zZWxlY3RlZCddLmZpbHRlcihCb29sZWFuKS5qb2luKCcgJyl9XG4gICAgICBkYXRhLWJsb2NrLWlkPXtibG9jay5pZH1cbiAgICAgIHN0eWxlPXt7IGxlZnQ6IGJsb2NrLnggKyAncHgnLCB0b3A6IGJsb2NrLnkgKyAncHgnLCB3aWR0aDogYmxvY2sudyArICdweCcsIHpJbmRleDogYmxvY2sueiA/PyAwIH19XG4gICAgICBvblBvaW50ZXJEb3duPXtoYW5kbGVCbG9ja1BvaW50ZXJEb3dufVxuICAgID5cbiAgICAgIHsvKiBEcmFnIGhhbmRsZSDigJQgaGlkZGVuIGZvciBpbWFnZSBibG9ja3MgKi99XG4gICAgICB7IWlzSW1hZ2UgJiYgKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3M9XCJibG9jay1oYW5kbGVcIlxuICAgICAgICAgIG9uUG9pbnRlckRvd249eyhlOiBQb2ludGVyRXZlbnQpID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgY3R4Lm9uQmxvY2tEcmFnU3RhcnQoZSwgYmxvY2suaWQpOyB9fVxuICAgICAgICAvPlxuICAgICAgKX1cblxuICAgICAgey8qIFJlc2l6ZSBoYW5kbGUg4oCUIHRvcC1yaWdodCwgd2lkdGggb25seSwgaGlkZGVuIGZvciBpbWFnZSBibG9ja3MgKi99XG4gICAgICB7IWlzSW1hZ2UgJiYgKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3M9XCJibG9jay1yZXNpemVcIlxuICAgICAgICAgIG9uUG9pbnRlckRvd249eyhlOiBQb2ludGVyRXZlbnQpID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgY3R4Lm9uQmxvY2tSZXNpemVTdGFydChlLCBibG9jay5pZCk7IH19XG4gICAgICAgIC8+XG4gICAgICApfVxuXG4gICAgICB7aXNMb2FkaW5nID8gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiYmxvY2stbG9hZGluZ1wiPjxkaXYgY2xhc3M9XCJibG9jay1sb2FkaW5nLXNwaW5uZXJcIiAvPjwvZGl2PlxuICAgICAgKSA6IGlzSW1hZ2UgPyAoXG4gICAgICAgIDw+XG4gICAgICAgICAgey8qIEltYWdlIGFyZWEg4oCUIGNvbnRhaW5zIGZyYW1lLCByZXNpemUgaGFuZGxlcywgYW5kIGRyYWcgb3ZlcmxheSAqL31cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW1nLW1lZGlhLWFyZWFcIj5cbiAgICAgICAgICAgIHsvKiBCb3JkZXIgdG9nZ2xlIGJ1dHRvbiDigJQgdmlzaWJsZSB3aGVuIHNlbGVjdGVkICovfVxuICAgICAgICAgICAge2lzU2VsZWN0ZWQgJiYgIWNyb3BwaW5nICYmIChcbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIGNsYXNzPXtgaW1nLWJvcmRlci1idG4ke2JvcmRlck9uID8gJyBpbWctYm9yZGVyLWJ0bi0tYWN0aXZlJyA6ICcnfWB9XG4gICAgICAgICAgICAgICAgdGl0bGU9XCJUb2dnbGUgYm9yZGVyXCJcbiAgICAgICAgICAgICAgICBvblBvaW50ZXJEb3duPXsoZTogUG9pbnRlckV2ZW50KSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlOiBNb3VzZUV2ZW50KSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRvZ2dsZUJvcmRlcigpOyB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDE2IDE2XCIgZmlsbD1cIm5vbmVcIj5cbiAgICAgICAgICAgICAgICAgIDxyZWN0IHg9XCIxLjVcIiB5PVwiMS41XCIgd2lkdGg9XCIxM1wiIGhlaWdodD1cIjEzXCIgcng9XCIxXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPXtib3JkZXJPbiA/ICcjOGE0ZjAwJyA6ICcjODg4J31cbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlLXdpZHRoPXtibG9jay5ib3JkZXIgPyAnMicgOiAnMS41J31cbiAgICAgICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICApfVxuXG4gICAgICAgICAgICB7LyogSW1hZ2UgZnJhbWUg4oCUIGhhbmRsZXMgY3JvcCByZW5kZXJpbmcgKi99XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGNsYXNzPVwiaW1nLWZyYW1lXCJcbiAgICAgICAgICAgICAgc3R5bGU9eyghY3JvcHBpbmcgJiYgYmxvY2suY3JvcCAmJiBudykgPyB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGAke2Jsb2NrLmNyb3AuaCAqIGJsb2NrLncgLyBibG9jay5jcm9wLnd9cHhgLFxuICAgICAgICAgICAgICAgIG91dGxpbmU6IGJvcmRlck9uID8gJzFweCBzb2xpZCAjMDAwJyA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgfSA6IHsgcG9zaXRpb246ICdyZWxhdGl2ZScsIG92ZXJmbG93OiBjcm9wcGluZyA/ICdoaWRkZW4nIDogdW5kZWZpbmVkLCBvdXRsaW5lOiBib3JkZXJPbiA/ICcxcHggc29saWQgIzAwMCcgOiB1bmRlZmluZWQgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgIHNyYz17cmVzb2x2ZWRTcmMgfHwgJyd9XG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlPXtmYWxzZX1cbiAgICAgICAgICAgICAgICBvbkxvYWQ9e2hhbmRsZUltZ0xvYWR9XG4gICAgICAgICAgICAgICAgc3R5bGU9eyghY3JvcHBpbmcgJiYgYmxvY2suY3JvcCAmJiBudykgPyB7XG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiBgJHtudyAqIGJsb2NrLncgLyBibG9jay5jcm9wLnd9cHhgLFxuICAgICAgICAgICAgICAgICAgbWF4V2lkdGg6ICdub25lJyxcbiAgICAgICAgICAgICAgICAgIGxlZnQ6IGAkey1ibG9jay5jcm9wLnggKiBibG9jay53IC8gYmxvY2suY3JvcC53fXB4YCxcbiAgICAgICAgICAgICAgICAgIHRvcDogYCR7LWJsb2NrLmNyb3AueSAqIGJsb2NrLncgLyBibG9jay5jcm9wLnd9cHhgLFxuICAgICAgICAgICAgICAgIH0gOiB7IHdpZHRoOiAnMTAwJScsIGRpc3BsYXk6ICdibG9jaycgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgey8qIENyb3Agb3ZlcmxheSDigJQgc2hvd24gd2hpbGUgaW4gY3JvcCBtb2RlICovfVxuICAgICAgICAgICAgICB7Y3JvcHBpbmcgJiYgcGVuZGluZ0Nyb3AgJiYgbncgJiYgbmggJiYgKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjcm9wLW92ZXJsYXlcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJjcm9wLWJveFwiXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgbGVmdDogICBgJHtwZW5kaW5nQ3JvcC54ICogKGJsb2NrLncgLyBudyl9cHhgLFxuICAgICAgICAgICAgICAgICAgICAgIHRvcDogICAgYCR7cGVuZGluZ0Nyb3AueSAqIChibG9jay53IC8gbncpfXB4YCxcbiAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogIGAke3BlbmRpbmdDcm9wLncgKiAoYmxvY2sudyAvIG53KX1weGAsXG4gICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBgJHtwZW5kaW5nQ3JvcC5oICogKGJsb2NrLncgLyBudyl9cHhgLFxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7WyduJywncycsJ2UnLCd3JywnbmUnLCdudycsJ3NlJywnc3cnXS5tYXAoZGlyID0+IChcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2Rpcn1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPXtgY3JvcC1oYW5kbGUgY3JvcC1oYW5kbGUtLSR7ZGlyfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICBvblBvaW50ZXJEb3duPXsoZTogUG9pbnRlckV2ZW50KSA9PiBzdGFydENyb3BEcmFnKGUsIGRpcil9XG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogQ29ybmVyIHJlc2l6ZSBoYW5kbGVzIOKAlCBoaWRkZW4gZHVyaW5nIGNyb3AgKi99XG4gICAgICAgICAgICB7IWNyb3BwaW5nICYmIFsnbncnLCAnbmUnLCAnc3cnLCAnc2UnXS5tYXAoZGlyID0+IChcbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGtleT17ZGlyfVxuICAgICAgICAgICAgICAgIGNsYXNzPXtgaW1nLXJlc2l6ZSBpbWctcmVzaXplLS0ke2Rpcn1gfVxuICAgICAgICAgICAgICAgIG9uUG9pbnRlckRvd249eyhlOiBQb2ludGVyRXZlbnQpID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgY3R4Lm9uSW1nUmVzaXplU3RhcnQoZSwgYmxvY2suaWQsIGRpcik7IH19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApKX1cblxuICAgICAgICAgICAgey8qIERyYWcgb3ZlcmxheSDigJQgaGlkZGVuIGR1cmluZyBjcm9wOyBkYmxjbGljayBlbnRlcnMgY3JvcCBtb2RlICovfVxuICAgICAgICAgICAgeyFjcm9wcGluZyAmJiAoXG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBjbGFzcz1cImJsb2NrLWRyYWctb3ZlcmxheVwiXG4gICAgICAgICAgICAgICAgb25Qb2ludGVyRG93bj17KGU6IFBvaW50ZXJFdmVudCkgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyBjdHgub25CbG9ja0RyYWdTdGFydChlLCBibG9jay5pZCk7IH19XG4gICAgICAgICAgICAgICAgb25EYmxDbGljaz17aGFuZGxlSW1nRG91YmxlQ2xpY2t9XG4gICAgICAgICAgICAgICAgb25Db250ZXh0TWVudT17aGFuZGxlSW1hZ2VDb250ZXh0TWVudX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogTGVnZW5kIOKAlCBiZWxvdyBpbWFnZSAqL31cbiAgICAgICAgICB7KGJsb2NrLmNhcHRpb24gfHwgY2FwdGlvbkVkaXRpbmcpID8gKFxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICByZWY9e2NhcHRpb25SZWZ9XG4gICAgICAgICAgICAgIGNsYXNzPVwiaW1nLWNhcHRpb25cIlxuICAgICAgICAgICAgICBjb250ZW50RWRpdGFibGU9XCJ0cnVlXCJcbiAgICAgICAgICAgICAgZGF0YS1wbGFjZWhvbGRlcj1cIkFkZCBhIGNhcHRpb27igKZcIlxuICAgICAgICAgICAgICBvbktleURvd249e2hhbmRsZUxlZ2VuZEtleURvd259XG4gICAgICAgICAgICAgIG9uQmx1cj17aGFuZGxlTGVnZW5kQmx1cn1cbiAgICAgICAgICAgICAgb25Qb2ludGVyRG93bj17KGU6IFBvaW50ZXJFdmVudCkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IGlzU2VsZWN0ZWQgJiYgIWNyb3BwaW5nICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbWctY2FwdGlvbi1oaW50XCI+UHJlc3MgW0VudGVyXSB0byBhZGQgY2FwdGlvbjwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvPlxuICAgICAgKSA6IGlzQ2hlY2tsaXN0ID8gKFxuICAgICAgICA8ZGl2IGNsYXNzPVwiYmxvY2stY2hlY2tsaXN0XCI+XG4gICAgICAgICAgeyhibG9jay5pdGVtcyB8fCBbXSkubWFwKGl0ZW0gPT4gKFxuICAgICAgICAgICAgPGRpdiBrZXk9e2l0ZW0uaWR9IGNsYXNzPXtgY2Itcm93JHtpdGVtLmNoZWNrZWQgPyAnIGNiLXJvdy0tY2hlY2tlZCcgOiAnJ31gfT5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIGNsYXNzPXtgY2ItY2hlY2ske2l0ZW0uY2hlY2tlZCA/ICcgY2ItY2hlY2stLWNoZWNrZWQnIDogJyd9YH1cbiAgICAgICAgICAgICAgICBvblBvaW50ZXJEb3duPXsoZTogUG9pbnRlckV2ZW50KSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlOiBNb3VzZUV2ZW50KSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHRvZ2dsZUNoZWNrSXRlbShpdGVtLmlkKTsgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICByZWY9eyhlbDogSFRNTFNwYW5FbGVtZW50IHwgbnVsbCkgPT4geyBpZiAoZWwpIGl0ZW1SZWZzLmN1cnJlbnRbaXRlbS5pZF0gPSBlbDsgZWxzZSBkZWxldGUgaXRlbVJlZnMuY3VycmVudFtpdGVtLmlkXTsgfX1cbiAgICAgICAgICAgICAgICBjbGFzcz1cImNiLXRleHRcIlxuICAgICAgICAgICAgICAgIGNvbnRlbnRFZGl0YWJsZT1cInRydWVcIlxuICAgICAgICAgICAgICAgIGRhdGEtcGxhY2Vob2xkZXI9XCJMaXN0IGl0ZW1cIlxuICAgICAgICAgICAgICAgIGRhdGEtaXRlbS1pZD17aXRlbS5pZH1cbiAgICAgICAgICAgICAgICBvbktleURvd249eyhlOiBLZXlib2FyZEV2ZW50KSA9PiBoYW5kbGVJdGVtS2V5RG93bihlLCBpdGVtLmlkKX1cbiAgICAgICAgICAgICAgICBvbkJsdXI9e2hhbmRsZUl0ZW1CbHVyfVxuICAgICAgICAgICAgICAgIG9uUG9pbnRlckRvd249eyhlOiBQb2ludGVyRXZlbnQpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgcmVmPXtjb250ZW50UmVmfVxuICAgICAgICAgIGNsYXNzPXtbJ2Jsb2NrLWNvbnRlbnQnLCBibG9jay50eXBlID09PSAnY29kZScgJiYgJ2NvZGUtYmxvY2snXS5maWx0ZXIoQm9vbGVhbikuam9pbignICcpfVxuICAgICAgICAgIGNvbnRlbnRFZGl0YWJsZT1cInRydWVcIlxuICAgICAgICAgIGRhdGEtcGxhY2Vob2xkZXI9XCJTdGFydCB0eXBpbmfigKZcIlxuICAgICAgICAgIGRhdGEtY29kZT17YmxvY2sudHlwZSA9PT0gJ2NvZGUnID8gJzEnIDogdW5kZWZpbmVkfVxuICAgICAgICAgIG9uS2V5RG93bj17aGFuZGxlS2V5RG93bn1cbiAgICAgICAgICBvbklucHV0PXtoYW5kbGVJbnB1dH1cbiAgICAgICAgICBvbkZvY3VzPXtoYW5kbGVGb2N1c31cbiAgICAgICAgICBvbkJsdXI9e2hhbmRsZUJsdXJ9XG4gICAgICAgICAgb25DbGljaz17aGFuZGxlQ29udGVudENsaWNrfVxuICAgICAgICAgIG9uQ29weT17aGFuZGxlQ29weX1cbiAgICAgICAgICBvblBhc3RlPXtoYW5kbGVQYXN0ZX1cbiAgICAgICAgICBvbkNvbnRleHRNZW51PXtoYW5kbGVDb250ZW50Q29udGV4dE1lbnV9XG4gICAgICAgICAgb25Qb2ludGVyRG93bj17KGU6IFBvaW50ZXJFdmVudCkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLAogICAgImltcG9ydCB7IGNyZWF0ZUNvbnRleHQgfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlUmVmLCB1c2VFZmZlY3QsIHVzZUxheW91dEVmZmVjdCwgdXNlU3RhdGUsIHVzZUNhbGxiYWNrIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IEJsb2NrIH0gZnJvbSAnLi9CbG9jay50c3gnO1xuaW1wb3J0IHsgYXBwU3RhdGUsIGVkaXRpbmdFbmFibGVkLCBhZGRCbG9jaywgZGVsZXRlQmxvY2ssIHVwZGF0ZUJsb2NrUG9zLCB1cGRhdGVCbG9ja1dpZHRoLCB1cGRhdGVCbG9ja1NyYywgdXBkYXRlQmxvY2taLCBhZGRJbWFnZUZyb21GaWxlLCBhZGRJbWFnZUZyb21VcmwsIHVwZGF0ZVBhZ2VWaWV3LCB1cGRhdGVQYWdlVGl0bGUsIHVwZGF0ZVBhZ2VUaXRsZUFuZFJlZnJlc2gsIGdldEFjdGl2ZVBhZ2UsIGZpbmRJblRyZWUsIHN0YXJ0Q2xhdWRlQ2hhdCwgcHJlbG9hZENhY2hlLCBzYXZlUGFnZUNhcmV0LCBsYXN0Q2FyZXRQZXJQYWdlLCBERUZBVUxUX0JMT0NLX1dJRFRILCB1aWQgfSBmcm9tICcuL3N0b3JlLnRzJztcbmltcG9ydCB7IG9wZW5Db250ZXh0TWVudSB9IGZyb20gJy4vQ29udGV4dE1lbnUudHN4JztcbmltcG9ydCB7IHB1c2hVbmRvLCBhcHBseVVuZG8sIGFwcGx5UmVkbyB9IGZyb20gJy4vdW5kby50cyc7XG5pbXBvcnQgeyBleGVjRm10IH0gZnJvbSAnLi9lZGl0b3IudHMnO1xuaW1wb3J0IHsgaW5pdFBhc3RlSGFuZGxlciwgY29weUJsb2NrcywgZ2V0Q29waWVkQmxvY2tzIH0gZnJvbSAnLi9jbGlwYm9hcmQudHMnO1xuaW1wb3J0IHR5cGUgeyBQYWdlLCBCbG9jayBhcyBCbG9ja1R5cGUsIENhbnZhc0NvbnRleHQsIE1lbnVJdGVtIH0gZnJvbSAnLi90eXBlcy50cyc7XG5pbXBvcnQgdHlwZSB7IEpTWCB9IGZyb20gJ3ByZWFjdCc7XG5cbmV4cG9ydCBjb25zdCBDYW52YXNDdHggPSBjcmVhdGVDb250ZXh0PENhbnZhc0NvbnRleHQgfCBudWxsPihudWxsKTtcblxuLy8g4pSA4pSA4pSAIEZvcm1hdFRvb2xiYXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkU2hhcmVVcmwoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gIGNvbnN0IHsgdWksIG5vdGVib29rcyB9ID0gYXBwU3RhdGUudmFsdWU7XG4gIGNvbnN0IG5iID0gbm90ZWJvb2tzLmZpbmQobiA9PiBuLmlkID09PSB1aS5ub3RlYm9va0lkKTtcbiAgY29uc3Qgc2VjID0gbmI/LnNlY3Rpb25zLmZpbmQocyA9PiBzLmlkID09PSB1aS5zZWN0aW9uSWQpO1xuICBjb25zdCBwYWdlID0gc2VjID8gZmluZEluVHJlZShzZWMucGFnZXMsIHVpLnBhZ2VJZCkgOiBudWxsO1xuICBpZiAoIXNlYyB8fCAhcGFnZSkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgaGFzaCA9IGAjIS8ke2VuY29kZVVSSUNvbXBvbmVudChzZWMudGl0bGUpfS8ke2VuY29kZVVSSUNvbXBvbmVudChwYWdlLnRpdGxlKX0vYDtcbiAgY29uc3QgcXMgPSBgP3A9JHtwYWdlLmlkLnNsaWNlKDAsIDYpfWA7XG5cbiAgY29uc3QgYmFzZSA9IHdpbmRvdy5fX2doUGFnZXNVcmxcbiAgICB8fCAod2luZG93Lm5vdGVib29rPy5nZXRQdWJsaXNoVXJsID8gYXdhaXQgd2luZG93Lm5vdGVib29rLmdldFB1Ymxpc2hVcmwoKSA6IG51bGwpXG4gICAgfHwgKHdpbmRvdy5sb2NhdGlvbiA/IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgOiAnJyk7XG4gIHJldHVybiBiYXNlICsgaGFzaCArIHFzO1xufVxuXG5pbnRlcmZhY2UgRm10QnRuIHtcbiAgY21kOiBzdHJpbmc7XG4gIG5vZGU6IEpTWC5FbGVtZW50IHwgc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBTaGFyZUJ1dHRvbigpOiBKU1guRWxlbWVudCB7XG4gIGNvbnN0IGhhbmRsZVNoYXJlID0gYXN5bmMgKGU6IE1vdXNlRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgdXJsID0gYXdhaXQgYnVpbGRTaGFyZVVybCgpO1xuICAgIGlmICghdXJsKSByZXR1cm47XG4gICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodXJsKS50aGVuKCgpID0+IHtcbiAgICAgIGNvbnN0IGJ0biA9IGUuY3VycmVudFRhcmdldCBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgIGNvbnN0IG9yaWcgPSBidG4udGV4dENvbnRlbnQ7XG4gICAgICBidG4udGV4dENvbnRlbnQgPSAnQ29waWVkISc7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHsgYnRuLnRleHRDb250ZW50ID0gb3JpZzsgfSwgMTUwMCk7XG4gICAgfSk7XG4gIH07XG4gIHJldHVybiA8YnV0dG9uIGNsYXNzPVwiZm10LWJ0blwiIHRpdGxlPVwiQ29weSBsaW5rIHRvIHRoaXMgcGFnZVwiIG9uTW91c2VEb3duPXtoYW5kbGVTaGFyZX0+8J+UlyBTaGFyZTwvYnV0dG9uPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEZvcm1hdFRvb2xiYXIoKTogSlNYLkVsZW1lbnQge1xuICBjb25zdCBidG5zOiAoRm10QnRuIHwgbnVsbClbXSA9IFtcbiAgICB7IGNtZDogJ2JvbGQnLCAgICAgICAgICBub2RlOiA8Yj5CPC9iPiwgICB0aXRsZTogJ0JvbGQnIH0sXG4gICAgeyBjbWQ6ICdpdGFsaWMnLCAgICAgICAgbm9kZTogPGk+STwvaT4sICAgdGl0bGU6ICdJdGFsaWMnIH0sXG4gICAgeyBjbWQ6ICd1bmRlcmxpbmUnLCAgICAgbm9kZTogPHU+VTwvdT4sICAgdGl0bGU6ICdVbmRlcmxpbmUnIH0sXG4gICAgeyBjbWQ6ICdzdHJpa2V0aHJvdWdoJywgbm9kZTogPHM+Uzwvcz4sICAgdGl0bGU6ICdTdHJpa2V0aHJvdWdoJyB9LFxuICAgIG51bGwsXG4gICAgeyBjbWQ6ICdoMScsIG5vZGU6ICdIMScsIHRpdGxlOiAnSGVhZGluZyAxJyB9LFxuICAgIHsgY21kOiAnaDInLCBub2RlOiAnSDInLCB0aXRsZTogJ0hlYWRpbmcgMicgfSxcbiAgICB7IGNtZDogJ2gzJywgbm9kZTogJ0gzJywgdGl0bGU6ICdIZWFkaW5nIDMnIH0sXG4gICAgeyBjbWQ6ICdoNCcsIG5vZGU6ICdINCcsIHRpdGxlOiAnSGVhZGluZyA0JyB9LFxuICAgIHsgY21kOiAncCcsICBub2RlOiAnUCcsICB0aXRsZTogJ1BhcmFncmFwaCcgfSxcbiAgICBudWxsLFxuICAgIHsgY21kOiAndWwnLCBub2RlOiAn4oCiIExpc3QnLCB0aXRsZTogJ0J1bGxldCBsaXN0JyB9LFxuICAgIHsgY21kOiAnb2wnLCBub2RlOiAnMS4gTGlzdCcsIHRpdGxlOiAnTnVtYmVyZWQgbGlzdCcgfSxcbiAgICB7IGNtZDogJ2xpbmsnLCBub2RlOiAn4oyYSycsIHRpdGxlOiAnSW5zZXJ0IGxpbmsnIH0sXG4gIF07XG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxkaXYgaWQ9XCJ0aXRsZWJhclwiPlxuICAgICAgICA8c3BhbiBjbGFzcz1cInRvb2xiYXItdGl0bGVcIj5Ob3RlYm91bmQ8L3NwYW4+XG4gICAgICAgIHshL01hYy8udGVzdChuYXZpZ2F0b3IucGxhdGZvcm0pICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwid2luZG93LWNvbnRyb2xzXCI+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwid2MtYnRuIHdjLW1pbmltaXplXCIgb25DbGljaz17KCkgPT4gd2luZG93LndpbmRvd0NvbnRyb2xzIS5taW5pbWl6ZSgpfSB0aXRsZT1cIk1pbmltaXplXCI+XG4gICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxMFwiIGhlaWdodD1cIjFcIiB2aWV3Qm94PVwiMCAwIDEwIDFcIj48cmVjdCB3aWR0aD1cIjEwXCIgaGVpZ2h0PVwiMVwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+PC9zdmc+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJ3Yy1idG4gd2MtbWF4aW1pemVcIiBvbkNsaWNrPXsoKSA9PiB3aW5kb3cud2luZG93Q29udHJvbHMhLm1heGltaXplKCl9IHRpdGxlPVwiTWF4aW1pemVcIj5cbiAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjEwXCIgaGVpZ2h0PVwiMTBcIiB2aWV3Qm94PVwiMCAwIDEwIDEwXCI+PHJlY3QgeD1cIjAuNVwiIHk9XCIwLjVcIiB3aWR0aD1cIjlcIiBoZWlnaHQ9XCI5XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIxXCIvPjwvc3ZnPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwid2MtYnRuIHdjLWNsb3NlXCIgb25DbGljaz17KCkgPT4gd2luZG93LndpbmRvd0NvbnRyb2xzIS5jbG9zZSgpfSB0aXRsZT1cIkNsb3NlXCI+XG4gICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxMFwiIGhlaWdodD1cIjEwXCIgdmlld0JveD1cIjAgMCAxMCAxMFwiPjxsaW5lIHgxPVwiMFwiIHkxPVwiMFwiIHgyPVwiMTBcIiB5Mj1cIjEwXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMS4yXCIvPjxsaW5lIHgxPVwiMTBcIiB5MT1cIjBcIiB4Mj1cIjBcIiB5Mj1cIjEwXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMS4yXCIvPjwvc3ZnPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgaWQ9XCJmb3JtYXQtdG9vbGJhclwiPlxuICAgICAgICB7YnRucy5tYXAoKGIsIGkpID0+IGIgPT09IG51bGxcbiAgICAgICAgICA/IDxzcGFuIGtleT17aX0gY2xhc3M9XCJmbXQtc2VwXCIgLz5cbiAgICAgICAgICA6IDxidXR0b24ga2V5PXtiLmNtZH0gY2xhc3M9XCJmbXQtYnRuXCIgdGl0bGU9e2IudGl0bGV9IG9uTW91c2VEb3duPXsoZTogTW91c2VFdmVudCkgPT4geyBlLnByZXZlbnREZWZhdWx0KCk7IGV4ZWNGbXQoYi5jbWQpOyB9fT57Yi5ub2RlfTwvYnV0dG9uPlxuICAgICAgICApfVxuICAgICAgICA8c3BhbiBjbGFzcz1cImZtdC1zZXBcIiAvPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3M9XCJmbXQtYnRuXCJcbiAgICAgICAgICB0aXRsZT1cIkFkZCBjaGVja2xpc3RcIlxuICAgICAgICAgIG9uTW91c2VEb3duPXsoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uc3QgcGcgPSBnZXRBY3RpdmVQYWdlKCk7XG4gICAgICAgICAgICBsZXQgeSA9IDYwO1xuICAgICAgICAgICAgaWYgKHBnPy5ibG9ja3M/Lmxlbmd0aCkge1xuICAgICAgICAgICAgICB5ID0gTWF0aC5tYXgoLi4ucGcuYmxvY2tzLm1hcChiID0+IGIueSArIDEwMCkpICsgNDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpdGVtSWQgPSB1aWQoKTtcbiAgICAgICAgICAgIGFkZEJsb2NrKDAsIHksIERFRkFVTFRfQkxPQ0tfV0lEVEgsICdjaGVja2xpc3QnLCB7IGl0ZW1zOiBbeyBpZDogaXRlbUlkLCB0ZXh0OiAnJywgY2hlY2tlZDogZmFsc2UgfV0gfSk7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWl0ZW0taWQ9XCIke2l0ZW1JZH1cIl1gKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgICAgICAgICAgIGVsPy5mb2N1cygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgPuKYkSBMaXN0PC9idXR0b24+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiZm10LXNlcFwiIC8+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbGFzcz1cImZtdC1idG4gZm10LWJ0bi0td2FuZFwiXG4gICAgICAgICAgdGl0bGU9XCJEcmFnIG9udG8gY2FudmFzIHRvIGNoYXQgd2l0aCBDbGF1ZGVcIlxuICAgICAgICAgIGRyYWdnYWJsZVxuICAgICAgICAgIG9uRHJhZ1N0YXJ0PXsoZTogRHJhZ0V2ZW50KSA9PiB7IGUuZGF0YVRyYW5zZmVyIS5zZXREYXRhKCdhcHBsaWNhdGlvbi94LW5vdGVib3VuZC1jbGF1ZGUnLCAnMScpOyB9fVxuICAgICAgICA+4pyoPC9idXR0b24+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiY2FudmFzLWhpbnRcIj5DbGljayB0byBhZGQgYmxvY2sgwrcgU3BhY2UrZHJhZyB0byBwYW4gwrcgQ3RybCtzY3JvbGwgem9vbTwvc3Bhbj5cbiAgICAgICAge3dpbmRvdy5ub3RlYm9vaz8ud2ViUHVibGlzaCAmJiAoXG4gICAgICAgICAgPD5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZm10LXNlcFwiIC8+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiZm10LWJ0biBmbXQtYnRuLS1wdWJsaXNoXCIgdGl0bGU9XCJQdWJsaXNoIHRvIHdlYlwiIG9uTW91c2VEb3duPXthc3luYyAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIGNvbnN0IGJ0biA9IGUuY3VycmVudFRhcmdldCBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgICAgICAgYnRuLmNsYXNzTGlzdC5hZGQoJ3B1Ymxpc2hpbmcnKTtcbiAgICAgICAgICAgICAgdHJ5IHsgYXdhaXQgd2luZG93Lm5vdGVib29rLndlYlB1Ymxpc2ghKCk7IH1cbiAgICAgICAgICAgICAgY2F0Y2ggKGVycikgeyBjb25zb2xlLmVycm9yKCdQdWJsaXNoIGZhaWxlZDonLCBlcnIpOyB9XG4gICAgICAgICAgICAgIGJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdwdWJsaXNoaW5nJyk7XG4gICAgICAgICAgICB9fT7wn4yQIFB1Ymxpc2g8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJmbXQtYnRuXCIgdGl0bGU9XCJPcGVuIHB1Ymxpc2hlZCBzaXRlXCIgb25Nb3VzZURvd249e2FzeW5jIChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgY29uc3QgdXJsID0gYXdhaXQgYnVpbGRTaGFyZVVybCgpO1xuICAgICAgICAgICAgICBpZiAodXJsKSB3aW5kb3cubm90ZWJvb2sub3BlbkV4dGVybmFsKHVybCk7XG4gICAgICAgICAgICB9fT7ihpcgT3BlbjwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImZtdC1idG5cIiB0aXRsZT1cIk9wZW4gZXhwb3J0IGZvbGRlciBvbiBkaXNrXCIgb25Nb3VzZURvd249eyhlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgd2luZG93Lm5vdGVib29rLndlYk9wZW5EaXIhKCk7XG4gICAgICAgICAgICB9fT7wn5OCIEZvbGRlcjwvYnV0dG9uPlxuICAgICAgICAgICAgPFNoYXJlQnV0dG9uIC8+XG4gICAgICAgICAgPC8+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICA8Lz5cbiAgKTtcbn1cblxuLy8g4pSA4pSA4pSAIFBhZ2VUaXRsZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuZnVuY3Rpb24gZ2V0Q2FyZXRPZmZzZXQoZWw6IEhUTUxFbGVtZW50KTogbnVtYmVyIHtcbiAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICBpZiAoIXNlbCB8fCAhc2VsLnJhbmdlQ291bnQgfHwgIWVsLmNvbnRhaW5zKHNlbC5hbmNob3JOb2RlKSkgcmV0dXJuIDA7XG4gIGNvbnN0IHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgcmFuZ2Uuc2VsZWN0Tm9kZUNvbnRlbnRzKGVsKTtcbiAgcmFuZ2Uuc2V0RW5kKHNlbC5hbmNob3JOb2RlISwgc2VsLmFuY2hvck9mZnNldCk7XG4gIHJldHVybiByYW5nZS50b1N0cmluZygpLmxlbmd0aDtcbn1cblxuZnVuY3Rpb24gc2V0Q2FyZXRPZmZzZXQoZWw6IEhUTUxFbGVtZW50LCBvZmZzZXQ6IG51bWJlcik6IHZvaWQge1xuICBjb25zdCB3YWxrZXIgPSBkb2N1bWVudC5jcmVhdGVUcmVlV2Fsa2VyKGVsLCBOb2RlRmlsdGVyLlNIT1dfVEVYVCk7XG4gIGxldCBwb3MgPSAwO1xuICB3aGlsZSAod2Fsa2VyLm5leHROb2RlKCkpIHtcbiAgICBjb25zdCBub2RlID0gd2Fsa2VyLmN1cnJlbnROb2RlIGFzIFRleHQ7XG4gICAgY29uc3QgbGVuID0gbm9kZS50ZXh0Q29udGVudCEubGVuZ3RoO1xuICAgIGlmIChwb3MgKyBsZW4gPj0gb2Zmc2V0KSB7XG4gICAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkhO1xuICAgICAgY29uc3QgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xuICAgICAgcmFuZ2Uuc2V0U3RhcnQobm9kZSwgTWF0aC5taW4ob2Zmc2V0IC0gcG9zLCBsZW4pKTtcbiAgICAgIHJhbmdlLmNvbGxhcHNlKHRydWUpO1xuICAgICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgc2VsLmFkZFJhbmdlKHJhbmdlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcG9zICs9IGxlbjtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYXNOb25FbXB0eUJsb2NrcyhwYWdlOiBQYWdlKTogYm9vbGVhbiB7XG4gIHJldHVybiBwYWdlLmJsb2Nrcy5zb21lKGIgPT4gYi50eXBlID09PSAnaW1hZ2UnIHx8IChiLmh0bWwgJiYgYi5odG1sICE9PSAnPGJyPicgJiYgYi5odG1sLnRyaW0oKSAhPT0gJycpKTtcbn1cblxuaW50ZXJmYWNlIFBhZ2VUaXRsZVByb3BzIHtcbiAgcGFnZTogUGFnZSB8IG51bGw7XG4gIG9uRW50ZXI6ICgpID0+IHZvaWQ7XG59XG5cbmZ1bmN0aW9uIFBhZ2VUaXRsZSh7IHBhZ2UsIG9uRW50ZXIgfTogUGFnZVRpdGxlUHJvcHMpOiBKU1guRWxlbWVudCB7XG4gIGNvbnN0IHJlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4obnVsbCk7XG4gIGNvbnN0IHRpdGxlRWRpdGluZyA9IHVzZVJlZjxib29sZWFuPihmYWxzZSk7XG5cbiAgdXNlTGF5b3V0RWZmZWN0KCgpID0+IHtcbiAgICBpZiAocmVmLmN1cnJlbnQgJiYgIXRpdGxlRWRpdGluZy5jdXJyZW50KSByZWYuY3VycmVudC50ZXh0Q29udGVudCA9IHBhZ2U/LnRpdGxlID8/ICcnO1xuICB9LCBbcGFnZT8uaWQsIHBhZ2U/LnRpdGxlXSk7XG5cbiAgLy8gT24gcGFnZSBzd2l0Y2g6IHJlc3RvcmUgbGFzdCBjYXJldCBwb3NpdGlvbiwgb3IgZm9jdXMgdGl0bGUgaWYgZW1wdHkgcGFnZVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghcGFnZSkgcmV0dXJuO1xuICAgIGlmIChoYXNOb25FbXB0eUJsb2NrcyhwYWdlKSkge1xuICAgICAgY29uc3Qgc2F2ZWQgPSBsYXN0Q2FyZXRQZXJQYWdlLmdldChwYWdlLmlkKTtcbiAgICAgIGlmIChzYXZlZCkge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtYmxvY2staWQ9XCIke3NhdmVkLmJsb2NrSWR9XCJdIC5ibG9jay1jb250ZW50YCkgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgICAgICAgIGlmIChlbCkge1xuICAgICAgICAgICAgZWwuZm9jdXMoKTtcbiAgICAgICAgICAgIHNldENhcmV0T2Zmc2V0KGVsLCBzYXZlZC5vZmZzZXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRW1wdHkgcGFnZSDigJQgZm9jdXMgdGl0bGUgYXQgZW5kXG4gICAgY29uc3QgZWwgPSByZWYuY3VycmVudDtcbiAgICBpZiAoZWwpIHtcbiAgICAgIGVsLmZvY3VzKCk7XG4gICAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkhO1xuICAgICAgc2VsLnNlbGVjdEFsbENoaWxkcmVuKGVsKTtcbiAgICAgIHNlbC5jb2xsYXBzZVRvRW5kKCk7XG4gICAgfVxuICB9LCBbcGFnZT8uaWRdKTtcblxuICBpZiAoIXBhZ2UpIHJldHVybiA8ZGl2IGlkPVwicGFnZS10aXRsZS1iYXJcIiAvPjtcblxuICBjb25zdCBlZGl0aW5nID0gZWRpdGluZ0VuYWJsZWQudmFsdWU7XG4gIGNvbnN0IGRhdGVTdHIgPSBwYWdlLmNyZWF0ZWRBdFxuICAgID8gbmV3IERhdGUocGFnZS5jcmVhdGVkQXQpLnRvTG9jYWxlRGF0ZVN0cmluZyh1bmRlZmluZWQsIHsgd2Vla2RheTogJ2xvbmcnLCB5ZWFyOiAnbnVtZXJpYycsIG1vbnRoOiAnbG9uZycsIGRheTogJ251bWVyaWMnIH0pXG4gICAgOiBudWxsO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBpZD1cInBhZ2UtdGl0bGUtYmFyXCIgb25DbGljaz17KCkgPT4gZWRpdGluZyAmJiByZWYuY3VycmVudD8uZm9jdXMoKX0+XG4gICAgICA8ZGl2XG4gICAgICAgIHJlZj17cmVmfVxuICAgICAgICBpZD1cInBhZ2UtdGl0bGVcIlxuICAgICAgICBjb250ZW50RWRpdGFibGVcbiAgICAgICAgb25Gb2N1cz17KCkgPT4geyB0aXRsZUVkaXRpbmcuY3VycmVudCA9IHRydWU7IH19XG4gICAgICAgIG9uQmx1cj17KGU6IEZvY3VzRXZlbnQpID0+IHtcbiAgICAgICAgICB0aXRsZUVkaXRpbmcuY3VycmVudCA9IGZhbHNlO1xuICAgICAgICAgIGNvbnN0IHRpdGxlID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS50ZXh0Q29udGVudCEudHJpbSgpIHx8ICdVbnRpdGxlZCBQYWdlJztcbiAgICAgICAgICB1cGRhdGVQYWdlVGl0bGVBbmRSZWZyZXNoKHBhZ2UuaWQsIHRpdGxlKTtcbiAgICAgICAgfX1cbiAgICAgICAgb25LZXlEb3duPXsoZTogS2V5Ym9hcmRFdmVudCkgPT4geyBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBvbkVudGVyPy4oKTsgfSB9fVxuICAgICAgICBvbklucHV0PXsoZTogRXZlbnQpID0+IHsgdXBkYXRlUGFnZVRpdGxlKHBhZ2UuaWQsIChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkudGV4dENvbnRlbnQhKTsgfX1cbiAgICAgICAgb25Db250ZXh0TWVudT17KGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICBjb25zdCBzZWxUZXh0ID0gd2luZG93LmdldFNlbGVjdGlvbigpPy50b1N0cmluZygpIHx8ICcnO1xuICAgICAgICAgIGNvbnN0IGl0ZW1zOiBNZW51SXRlbVtdID0gW107XG4gICAgICAgICAgaWYgKHNlbFRleHQpIHtcbiAgICAgICAgICAgIGl0ZW1zLnB1c2goeyBsYWJlbDogJ0NvcHknLCBhY3Rpb246ICgpID0+IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5JykgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl0ZW1zLnB1c2goeyBsYWJlbDogJ0NvcHknLCBkaXNhYmxlZDogdHJ1ZSwgYWN0aW9uOiAoKSA9PiB7fSB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaXRlbXMucHVzaCh7IGxhYmVsOiAnUGFzdGUnLCBhY3Rpb246ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsID0gcmVmLmN1cnJlbnQ7XG4gICAgICAgICAgICBjb25zdCBzID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgICAgICAgY29uc3Qgc2F2ZWRSYW5nZSA9IHM/LnJhbmdlQ291bnQgPyBzLmdldFJhbmdlQXQoMCkuY2xvbmVSYW5nZSgpIDogbnVsbDtcbiAgICAgICAgICAgIG5hdmlnYXRvci5jbGlwYm9hcmQucmVhZFRleHQoKS50aGVuKHRleHQgPT4ge1xuICAgICAgICAgICAgICBpZiAoIXRleHQgfHwgIWVsKSByZXR1cm47XG4gICAgICAgICAgICAgIGVsLmZvY3VzKCk7XG4gICAgICAgICAgICAgIGlmIChzYXZlZFJhbmdlKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpITtcbiAgICAgICAgICAgICAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICAgICAgICAgICAgc2VsLmFkZFJhbmdlKHNhdmVkUmFuZ2UpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRUZXh0JywgZmFsc2UsIHRleHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfX0pO1xuICAgICAgICAgIGlmIChzZWxUZXh0KSB7XG4gICAgICAgICAgICBpdGVtcy5wdXNoKHsgdHlwZTogJ3NlcGFyYXRvcicgfSk7XG4gICAgICAgICAgICBjb25zdCBxID0gZW5jb2RlVVJJQ29tcG9uZW50KHNlbFRleHQpO1xuICAgICAgICAgICAgaXRlbXMucHVzaCh7IGxhYmVsOiAnU2VhcmNoIHdpdGggR29vZ2xlJywgYWN0aW9uOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHdpbmRvdy5ub3RlYm9vaz8ub3BlbkV4dGVybmFsKCdodHRwczovL3d3dy5nb29nbGUuY29tL3NlYXJjaD9xPScgKyBxKTtcbiAgICAgICAgICAgIH19KTtcbiAgICAgICAgICAgIGl0ZW1zLnB1c2goeyBsYWJlbDogJ0FzayBDaGF0R1BUJywgYWN0aW9uOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHdpbmRvdy5ub3RlYm9vaz8ub3BlbkV4dGVybmFsKCdodHRwczovL2NoYXRncHQuY29tLz9xPScgKyBxKTtcbiAgICAgICAgICAgIH19KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgb3BlbkNvbnRleHRNZW51KGUuY2xpZW50WCwgZS5jbGllbnRZLCBpdGVtcyk7XG4gICAgICAgIH19XG4gICAgICAvPlxuICAgICAge2RhdGVTdHIgJiYgPGRpdiBjbGFzcz1cInBhZ2UtZGF0ZVwiPntkYXRlU3RyfTwvZGl2Pn1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuLy8g4pSA4pSA4pSAIENhbnZhcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuaW50ZXJmYWNlIENhbnZhc1Byb3BzIHtcbiAgcGFnZTogUGFnZSB8IG51bGw7XG59XG5cbmludGVyZmFjZSBUcmFuc2l0aW9uU3RhdGUge1xuICBvdXRJZDogc3RyaW5nO1xuICBpbklkOiBzdHJpbmc7XG4gIHBoYXNlOiAnb3V0JyB8ICdpbic7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDYW52YXMoeyBwYWdlIH06IENhbnZhc1Byb3BzKTogSlNYLkVsZW1lbnQge1xuICBjb25zdCBjb250YWluZXJSZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpOyAgIC8vIHNjcm9sbCBjb250YWluZXJcbiAgY29uc3Qgc2l6ZXJSZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpOyAgICAgICAvLyBzZXRzIHNjcm9sbGFibGUgZXh0ZW50XG4gIGNvbnN0IGlubmVyUmVmID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PihudWxsKTsgICAgICAgLy8gc2NhbGVkIGNvbnRlbnQgZGl2XG4gIGNvbnN0IG1hcnF1ZWVSZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpO1xuICBjb25zdCB2aWV3UmVmID0gdXNlUmVmPHsgem9vbTogbnVtYmVyIH0+KHsgem9vbTogMSB9KTsgLy8gb25seSB6b29tOyBwYW4gbGl2ZXMgaW4gc2Nyb2xsTGVmdC9zY3JvbGxUb3BcbiAgY29uc3QgcGFnZVJlZiA9IHVzZVJlZjxQYWdlIHwgbnVsbD4ocGFnZSk7XG4gIGNvbnN0IHNwYWNlSGVsZCA9IHVzZVJlZjxib29sZWFuPihmYWxzZSk7XG4gIGNvbnN0IHNjcm9sbFNhdmVUaW1lciA9IHVzZVJlZjxSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGw+KG51bGwpO1xuXG4gIC8vIFBhZ2UgdHJhbnNpdGlvbjogZmFkZSBvdXQgb2xkLCB0aGVuIGZhZGUgaW4gbmV3XG4gIGNvbnN0IFt0cmFuc2l0aW9uLCBzZXRUcmFuc2l0aW9uXSA9IHVzZVN0YXRlPFRyYW5zaXRpb25TdGF0ZSB8IG51bGw+KG51bGwpO1xuICBjb25zdCBwcmV2UGFnZUlkUmVmID0gdXNlUmVmPHN0cmluZyB8IHVuZGVmaW5lZD4ocGFnZT8uaWQpO1xuICBjb25zdCB0cmFuc2l0aW9uVGltZXJzID0gdXNlUmVmPHsgdDE/OiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PjsgdDI/OiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB9Pih7fSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBuZXdJZCA9IHBhZ2U/LmlkO1xuICAgIGNvbnN0IG9sZElkID0gcHJldlBhZ2VJZFJlZi5jdXJyZW50O1xuICAgIGlmICghbmV3SWQgfHwgIW9sZElkIHx8IG5ld0lkID09PSBvbGRJZCkgeyBwcmV2UGFnZUlkUmVmLmN1cnJlbnQgPSBuZXdJZDsgcmV0dXJuOyB9XG4gICAgcHJldlBhZ2VJZFJlZi5jdXJyZW50ID0gbmV3SWQ7XG4gICAgY2xlYXJUaW1lb3V0KHRyYW5zaXRpb25UaW1lcnMuY3VycmVudC50MSk7XG4gICAgY2xlYXJUaW1lb3V0KHRyYW5zaXRpb25UaW1lcnMuY3VycmVudC50Mik7XG4gICAgc2V0VHJhbnNpdGlvbih7IG91dElkOiBvbGRJZCwgaW5JZDogbmV3SWQsIHBoYXNlOiAnb3V0JyB9KTtcbiAgICB0cmFuc2l0aW9uVGltZXJzLmN1cnJlbnQudDEgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHNldFRyYW5zaXRpb24oeyBvdXRJZDogb2xkSWQsIGluSWQ6IG5ld0lkLCBwaGFzZTogJ2luJyB9KTtcbiAgICAgIHRyYW5zaXRpb25UaW1lcnMuY3VycmVudC50MiA9IHNldFRpbWVvdXQoKCkgPT4gc2V0VHJhbnNpdGlvbihudWxsKSwgMTI1KTtcbiAgICB9LCAxMjUpO1xuICB9LCBbcGFnZT8uaWRdKTtcblxuICAvLyBLZWVwLWFsaXZlIGNhY2hlOiBwYWdlSWQg4oaSIHBhZ2Ugb2JqZWN0LiBHcm93cyBhcyBwYWdlcyBhcmUgdmlzaXRlZC5cbiAgLy8gQmxvY2tzIGFyZSBuZXZlciB1bm1vdW50ZWQg4oCUIGluYWN0aXZlIHBhZ2VzIGFyZSBoaWRkZW4gd2l0aCBkaXNwbGF5Om5vbmUuXG4gIC8vIHByZWxvYWRDYWNoZSAoc2lnbmFsKSBob2xkcyBwYWdlcyBwcmUtcmVuZGVyZWQgYmVmb3JlIHRoZSB1c2VyIHZpc2l0cyB0aGVtLlxuICAvLyBwYWdlQ2FjaGVSZWYgaG9sZHMgdmlzaXRlZCBwYWdlczsgaXQgb3ZlcnJpZGVzIHByZWxvYWRDYWNoZSBmb3IgdGhlIHNhbWUgcGFnZUlkLlxuICBjb25zdCBwYWdlQ2FjaGVSZWYgPSB1c2VSZWY8TWFwPHN0cmluZywgUGFnZT4+KG5ldyBNYXAoKSk7XG4gIGlmIChwYWdlKSBwYWdlQ2FjaGVSZWYuY3VycmVudC5zZXQocGFnZS5pZCwgcGFnZSk7XG4gIGNvbnN0IGNhY2hlZFBhZ2VzID0gWy4uLm5ldyBNYXAoWy4uLnByZWxvYWRDYWNoZS52YWx1ZSwgLi4ucGFnZUNhY2hlUmVmLmN1cnJlbnRdKS52YWx1ZXMoKV07XG5cbiAgLy8gU2VsZWN0ZWQgYmxvY2sgSURzXG4gIGNvbnN0IFtzZWxlY3RlZElkcywgc2V0U2VsZWN0ZWRJZHNdID0gdXNlU3RhdGU8U2V0PHN0cmluZz4+KG5ldyBTZXQoKSk7XG4gIGNvbnN0IHNlbGVjdGVkUmVmID0gdXNlUmVmPFNldDxzdHJpbmc+PihzZWxlY3RlZElkcyk7XG5cbiAgLy8gS2VlcCBwYWdlUmVmIGN1cnJlbnQgb24gZXZlcnkgcmVuZGVyXG4gIHVzZUVmZmVjdCgoKSA9PiB7IHBhZ2VSZWYuY3VycmVudCA9IHBhZ2U7IH0pO1xuXG4gIGZ1bmN0aW9uIHNldFNlbGVjdGVkKGlkczogU2V0PHN0cmluZz4pOiB2b2lkIHtcbiAgICBzZWxlY3RlZFJlZi5jdXJyZW50ID0gaWRzO1xuICAgIHNldFNlbGVjdGVkSWRzKG5ldyBTZXQoaWRzKSk7XG4gIH1cblxuICAvLyDilIDilIAgU2l6ZXI6IHNldHMgc2Nyb2xsYWJsZSBhcmVhIHRvIG1hdGNoIHNjYWxlZCBjb250ZW50IOKUgOKUgFxuXG4gIGZ1bmN0aW9uIHVwZGF0ZVNpemVyKHRhcmdldFNjcm9sbExlZnQ/OiBudW1iZXIsIHRhcmdldFNjcm9sbFRvcD86IG51bWJlcik6IHZvaWQge1xuICAgIGlmICghc2l6ZXJSZWYuY3VycmVudCB8fCAhY29udGFpbmVyUmVmLmN1cnJlbnQpIHJldHVybjtcbiAgICBjb25zdCBwZyA9IHBhZ2VSZWYuY3VycmVudDtcbiAgICBjb25zdCB7IHpvb20gfSA9IHZpZXdSZWYuY3VycmVudDtcbiAgICBsZXQgbWF4WCA9IDAsIG1heFkgPSAwO1xuICAgIGlmIChwZz8uYmxvY2tzPy5sZW5ndGgpIHtcbiAgICAgIGZvciAoY29uc3QgYiBvZiBwZy5ibG9ja3MpIHtcbiAgICAgICAgbWF4WCA9IE1hdGgubWF4KG1heFgsIGIueCArIChiLncgfHwgREVGQVVMVF9CTE9DS19XSURUSCkpO1xuICAgICAgICBtYXhZID0gTWF0aC5tYXgobWF4WSwgYi55ICsgMzAwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVjdCA9IGNvbnRhaW5lclJlZi5jdXJyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHNsID0gdGFyZ2V0U2Nyb2xsTGVmdCA/PyBjb250YWluZXJSZWYuY3VycmVudC5zY3JvbGxMZWZ0O1xuICAgIGNvbnN0IHN0ID0gdGFyZ2V0U2Nyb2xsVG9wICA/PyBjb250YWluZXJSZWYuY3VycmVudC5zY3JvbGxUb3A7XG4gICAgLy8gVG90YWwgd29ybGQgc2l6ZSBtdXN0IGFjY29tbW9kYXRlOiBhbGwgYmxvY2tzICsgZW5vdWdoIHRvIHNjcm9sbCB0byB0YXJnZXQgcG9zaXRpb25cbiAgICBjb25zdCB0b3RhbFcgPSBNYXRoLm1heChtYXhYICsgMjAwLCAoc2wgKyByZWN0LndpZHRoKSAgLyB6b29tICsgMjAwKTtcbiAgICBjb25zdCB0b3RhbEggPSBNYXRoLm1heChtYXhZICsgMjAwLCAoc3QgKyByZWN0LmhlaWdodCkgLyB6b29tICsgMjAwKTtcbiAgICBzaXplclJlZi5jdXJyZW50LnN0eWxlLndpZHRoICA9ICh0b3RhbFcgKiB6b29tKSArICdweCc7XG4gICAgc2l6ZXJSZWYuY3VycmVudC5zdHlsZS5oZWlnaHQgPSAodG90YWxIICogem9vbSkgKyAncHgnO1xuICB9XG5cbiAgLy8g4pSA4pSAIEZpeGVkIHpvb20gbGV2ZWxzIChtZW51IHpvb20gaW4vb3V0L3Jlc2V0KSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICBjb25zdCBaT09NX0xFVkVMUyA9IFswLjUsIDAuNiwgMC43NSwgMC44LCAxLjAsIDEuMjUsIDEuNSwgMi4wXTtcblxuICBmdW5jdGlvbiBhcHBseVpvb20obno6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGVsID0gY29udGFpbmVyUmVmLmN1cnJlbnQ7XG4gICAgaWYgKCFlbCB8fCAhaW5uZXJSZWYuY3VycmVudCkgcmV0dXJuO1xuICAgIGNvbnN0IHsgem9vbSB9ID0gdmlld1JlZi5jdXJyZW50O1xuICAgIGNvbnN0IG14ID0gZWwuY2xpZW50V2lkdGggLyAyO1xuICAgIGNvbnN0IG15ID0gZWwuY2xpZW50SGVpZ2h0IC8gMjtcbiAgICBjb25zdCBjeCA9IChteCArIGVsLnNjcm9sbExlZnQpIC8gem9vbTtcbiAgICBjb25zdCBjeSA9IChteSArIGVsLnNjcm9sbFRvcCkgLyB6b29tO1xuICAgIGNvbnN0IG5ld1Njcm9sbExlZnQgPSBNYXRoLm1heCgwLCBjeCAqIG56IC0gbXgpO1xuICAgIGNvbnN0IG5ld1Njcm9sbFRvcCAgPSBNYXRoLm1heCgwLCBjeSAqIG56IC0gbXkpO1xuICAgIHZpZXdSZWYuY3VycmVudCA9IHsgem9vbTogbnogfTtcbiAgICBpbm5lclJlZi5jdXJyZW50LnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgke256fSlgO1xuICAgIHVwZGF0ZVNpemVyKG5ld1Njcm9sbExlZnQsIG5ld1Njcm9sbFRvcCk7XG4gICAgZWwuc2Nyb2xsTGVmdCA9IG5ld1Njcm9sbExlZnQ7XG4gICAgZWwuc2Nyb2xsVG9wICA9IG5ld1Njcm9sbFRvcDtcbiAgICB1cGRhdGVQYWdlVmlldyhuZXdTY3JvbGxMZWZ0IC8gbnosIG5ld1Njcm9sbFRvcCAvIG56LCBueik7XG4gIH1cblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGZ1bmN0aW9uIG9uWm9vbShkaXI6ICdpbicgfCAnb3V0JyB8ICdyZXNldCcpOiB2b2lkIHtcbiAgICAgIGNvbnN0IGN1ciA9IHZpZXdSZWYuY3VycmVudC56b29tO1xuICAgICAgbGV0IG56OiBudW1iZXI7XG4gICAgICBpZiAoZGlyID09PSAncmVzZXQnKSB7XG4gICAgICAgIG56ID0gMS4wO1xuICAgICAgfSBlbHNlIGlmIChkaXIgPT09ICdpbicpIHtcbiAgICAgICAgbnogPSBaT09NX0xFVkVMUy5maW5kKGwgPT4gbCA+IGN1ciArIDAuMDEpID8/IFpPT01fTEVWRUxTW1pPT01fTEVWRUxTLmxlbmd0aCAtIDFdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbnogPSBbLi4uWk9PTV9MRVZFTFNdLnJldmVyc2UoKS5maW5kKGwgPT4gbCA8IGN1ciAtIDAuMDEpID8/IFpPT01fTEVWRUxTWzBdO1xuICAgICAgfVxuICAgICAgYXBwbHlab29tKG56KTtcbiAgICB9XG4gICAgd2luZG93Lm5vdGVib29rPy5vbkNhbnZhc1pvb20ob25ab29tKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93Lm5vdGVib29rPy5vZmZDYW52YXNab29tKCk7XG4gIH0sIFtdKTtcblxuICAvLyDilIDilIAgU3luYyB2aWV3IHdoZW4gcGFnZSBjaGFuZ2VzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gIHVzZUxheW91dEVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFwYWdlIHx8ICFjb250YWluZXJSZWYuY3VycmVudCB8fCAhaW5uZXJSZWYuY3VycmVudCkgcmV0dXJuO1xuICAgIGNvbnN0IHpvb20gPSBwYWdlLnpvb20gPz8gMTtcbiAgICB2aWV3UmVmLmN1cnJlbnQgPSB7IHpvb20gfTtcbiAgICBpbm5lclJlZi5jdXJyZW50LnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgke3pvb219KWA7XG4gICAgY29uc3QgdGFyZ2V0TGVmdCA9IChwYWdlLnBhblggPz8gMCkgKiB6b29tO1xuICAgIGNvbnN0IHRhcmdldFRvcCAgPSAocGFnZS5wYW5ZID8/IDApICogem9vbTtcbiAgICAvLyBTaXplIHNpemVyIHdpdGggdGFyZ2V0IHNjcm9sbCBiZWZvcmUgYXBwbHlpbmcgc2Nyb2xsIChwcmV2ZW50cyBicm93c2VyIGNsYW1waW5nKVxuICAgIHVwZGF0ZVNpemVyKHRhcmdldExlZnQsIHRhcmdldFRvcCk7XG4gICAgY29udGFpbmVyUmVmLmN1cnJlbnQuc2Nyb2xsTGVmdCA9IHRhcmdldExlZnQ7XG4gICAgY29udGFpbmVyUmVmLmN1cnJlbnQuc2Nyb2xsVG9wICA9IHRhcmdldFRvcDtcbiAgICBzZXRTZWxlY3RlZChuZXcgU2V0KCkpO1xuICB9LCBbcGFnZT8uaWRdKTtcblxuICAvLyBSZWNvbXB1dGUgc2l6ZXIgd2hlbmV2ZXIgYmxvY2tzIGNoYW5nZSAoYWRkL3Jlc2l6ZS9tb3ZlKVxuICB1c2VFZmZlY3QoKCkgPT4geyB1cGRhdGVTaXplcigpOyB9LCBbcGFnZT8uYmxvY2tzXSk7XG5cbiAgLy8g4pSA4pSAIENvb3JkaW5hdGUgaGVscGVycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICBmdW5jdGlvbiB0b0NhbnZhcyhjbGllbnRYOiBudW1iZXIsIGNsaWVudFk6IG51bWJlcik6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSB7XG4gICAgY29uc3QgcmVjdCA9IGNvbnRhaW5lclJlZi5jdXJyZW50IS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB7IHpvb20gfSA9IHZpZXdSZWYuY3VycmVudDtcbiAgICByZXR1cm4ge1xuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQgKyBjb250YWluZXJSZWYuY3VycmVudCEuc2Nyb2xsTGVmdCkgLyB6b29tLFxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCAgKyBjb250YWluZXJSZWYuY3VycmVudCEuc2Nyb2xsVG9wKSAgLyB6b29tLFxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiB0b1NjcmVlbihjbGllbnRYOiBudW1iZXIsIGNsaWVudFk6IG51bWJlcik6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSB7XG4gICAgY29uc3QgcmVjdCA9IGNvbnRhaW5lclJlZi5jdXJyZW50IS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4geyB4OiBjbGllbnRYIC0gcmVjdC5sZWZ0LCB5OiBjbGllbnRZIC0gcmVjdC50b3AgfTtcbiAgfVxuXG4gIC8vIOKUgOKUgCBCbG9jayBkcmFnIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gIGNvbnN0IG9uQmxvY2tEcmFnU3RhcnQgPSB1c2VDYWxsYmFjaygoZTogUG9pbnRlckV2ZW50LCBibG9ja0lkOiBzdHJpbmcpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLmJsdXIoKTtcbiAgICB9XG4gICAgY29uc3QgcGcgPSBnZXRBY3RpdmVQYWdlKCk7XG4gICAgaWYgKCFwZykgcmV0dXJuO1xuXG4gICAgaWYgKCFzZWxlY3RlZFJlZi5jdXJyZW50LmhhcyhibG9ja0lkKSkge1xuICAgICAgaWYgKCFlLnNoaWZ0S2V5KSBzZXRTZWxlY3RlZChuZXcgU2V0KFtibG9ja0lkXSkpO1xuICAgICAgZWxzZSBzZXRTZWxlY3RlZChuZXcgU2V0KFsuLi5zZWxlY3RlZFJlZi5jdXJyZW50LCBibG9ja0lkXSkpO1xuICAgIH1cblxuICAgIGNvbnN0IGlkcyA9IHNlbGVjdGVkUmVmLmN1cnJlbnQuaGFzKGJsb2NrSWQpXG4gICAgICA/IFsuLi5zZWxlY3RlZFJlZi5jdXJyZW50XVxuICAgICAgOiBbYmxvY2tJZF07XG5cbiAgICBjb25zdCBvcmlnUG9zID0gbmV3IE1hcDxzdHJpbmcsIHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfT4oKTtcbiAgICBmb3IgKGNvbnN0IGlkIG9mIGlkcykge1xuICAgICAgY29uc3QgZWwgPSBpbm5lclJlZi5jdXJyZW50Py5xdWVyeVNlbGVjdG9yKGBbZGF0YS1ibG9jay1pZD1cIiR7aWR9XCJdYCkgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgICAgaWYgKGVsKSBvcmlnUG9zLnNldChpZCwgeyB4OiBwYXJzZUludChlbC5zdHlsZS5sZWZ0KSwgeTogcGFyc2VJbnQoZWwuc3R5bGUudG9wKSB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGFydFggPSBlLmNsaWVudFgsIHN0YXJ0WSA9IGUuY2xpZW50WTtcbiAgICBjb25zdCB7IHpvb20gfSA9IHZpZXdSZWYuY3VycmVudDtcblxuICAgIGZ1bmN0aW9uIG9uTW92ZShlMjogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgICBjb25zdCBkeCA9IChlMi5jbGllbnRYIC0gc3RhcnRYKSAvIHpvb207XG4gICAgICBjb25zdCBkeSA9IChlMi5jbGllbnRZIC0gc3RhcnRZKSAvIHpvb207XG4gICAgICBmb3IgKGNvbnN0IFtpZCwgb3JpZ10gb2Ygb3JpZ1Bvcykge1xuICAgICAgICBjb25zdCBlbCA9IGlubmVyUmVmLmN1cnJlbnQ/LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWJsb2NrLWlkPVwiJHtpZH1cIl1gKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgICAgIGlmICghZWwpIGNvbnRpbnVlO1xuICAgICAgICBlbC5zdHlsZS5sZWZ0ID0gTWF0aC5tYXgoMCwgb3JpZy54ICsgZHgpICsgJ3B4JztcbiAgICAgICAgZWwuc3R5bGUudG9wICA9IE1hdGgubWF4KDAsIG9yaWcueSArIGR5KSArICdweCc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25VcCgpOiB2b2lkIHtcbiAgICAgIGxldCBoYXNNb3ZlZCA9IGZhbHNlO1xuICAgICAgY29uc3QgbW92ZXM6IHsgaWQ6IHN0cmluZzsgeDogbnVtYmVyOyB5OiBudW1iZXIgfVtdID0gW107XG4gICAgICBmb3IgKGNvbnN0IFtpZCwgb3JpZ10gb2Ygb3JpZ1Bvcykge1xuICAgICAgICBjb25zdCBlbCA9IGlubmVyUmVmLmN1cnJlbnQ/LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWJsb2NrLWlkPVwiJHtpZH1cIl1gKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgICAgIGlmICghZWwpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBueCA9IHBhcnNlSW50KGVsLnN0eWxlLmxlZnQpLCBueSA9IHBhcnNlSW50KGVsLnN0eWxlLnRvcCk7XG4gICAgICAgIGlmIChueCAhPT0gb3JpZy54IHx8IG55ICE9PSBvcmlnLnkpIHtcbiAgICAgICAgICBoYXNNb3ZlZCA9IHRydWU7XG4gICAgICAgICAgbW92ZXMucHVzaCh7IGlkLCB4OiBvcmlnLngsIHk6IG9yaWcueSB9KTtcbiAgICAgICAgICB1cGRhdGVCbG9ja1BvcyhpZCwgbngsIG55KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGhhc01vdmVkICYmIHBnKSBwdXNoVW5kbyhwZy5pZCwgeyB0eXBlOiAnbW92ZScsIG1vdmVzIH0pO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCBvbk1vdmUpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgb25VcCk7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCBvbk1vdmUpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIG9uVXApO1xuICB9LCBbXSk7XG5cbiAgLy8g4pSA4pSAIEJsb2NrIHJlc2l6ZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICBjb25zdCBvbkJsb2NrUmVzaXplU3RhcnQgPSB1c2VDYWxsYmFjaygoZTogUG9pbnRlckV2ZW50LCBibG9ja0lkOiBzdHJpbmcpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgZWwgPSBpbm5lclJlZi5jdXJyZW50Py5xdWVyeVNlbGVjdG9yKGBbZGF0YS1ibG9jay1pZD1cIiR7YmxvY2tJZH1cIl1gKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgaWYgKCFlbCkgcmV0dXJuO1xuICAgIGNvbnN0IG9yaWdXID0gcGFyc2VJbnQoZWwuc3R5bGUud2lkdGgpIHx8IERFRkFVTFRfQkxPQ0tfV0lEVEg7XG4gICAgY29uc3Qgc3RhcnRYID0gZS5jbGllbnRYO1xuICAgIGNvbnN0IHBnID0gZ2V0QWN0aXZlUGFnZSgpO1xuXG4gICAgZnVuY3Rpb24gb25Nb3ZlKGUyOiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcbiAgICAgIGNvbnN0IGR4ID0gKGUyLmNsaWVudFggLSBzdGFydFgpIC8gdmlld1JlZi5jdXJyZW50Lnpvb207XG4gICAgICBlbCEuc3R5bGUud2lkdGggPSBNYXRoLm1heCgxMjAsIG9yaWdXICsgZHgpICsgJ3B4JztcbiAgICB9XG4gICAgZnVuY3Rpb24gb25VcCgpOiB2b2lkIHtcbiAgICAgIGlmIChwZykgcHVzaFVuZG8ocGcuaWQsIHsgdHlwZTogJ3Jlc2l6ZScsIGlkOiBibG9ja0lkLCB3OiBvcmlnVyB9KTtcbiAgICAgIHVwZGF0ZUJsb2NrV2lkdGgoYmxvY2tJZCwgcGFyc2VJbnQoZWwhLnN0eWxlLndpZHRoKSk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG9uTW92ZSk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCBvblVwKTtcbiAgICB9XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCBvbk1vdmUpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIG9uVXApO1xuICB9LCBbXSk7XG5cbiAgLy8g4pSA4pSAIEltYWdlIHJlc2l6ZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICBjb25zdCBvbkltZ1Jlc2l6ZVN0YXJ0ID0gdXNlQ2FsbGJhY2soKGU6IFBvaW50ZXJFdmVudCwgYmxvY2tJZDogc3RyaW5nLCBkaXI6IHN0cmluZykgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBlbCA9IGlubmVyUmVmLmN1cnJlbnQ/LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWJsb2NrLWlkPVwiJHtibG9ja0lkfVwiXWApIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAoIWVsKSByZXR1cm47XG4gICAgY29uc3Qgb3JpZ1cgPSBlbC5vZmZzZXRXaWR0aDtcbiAgICBjb25zdCBvcmlnWCA9IHBhcnNlSW50KGVsLnN0eWxlLmxlZnQpO1xuICAgIGNvbnN0IG9yaWdZID0gcGFyc2VJbnQoZWwuc3R5bGUudG9wKTtcbiAgICBjb25zdCBzdGFydFggPSBlLmNsaWVudFg7XG4gICAgY29uc3QgcGcgPSBnZXRBY3RpdmVQYWdlKCk7XG5cbiAgICBmdW5jdGlvbiBvbk1vdmUoZTI6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgICAgY29uc3QgZHggPSAoZTIuY2xpZW50WCAtIHN0YXJ0WCkgLyB2aWV3UmVmLmN1cnJlbnQuem9vbTtcbiAgICAgIGNvbnN0IG5ld1cgPSBNYXRoLm1heCg0MCwgb3JpZ1cgKyAoZGlyLmluY2x1ZGVzKCdlJykgPyBkeCA6IC1keCkpO1xuICAgICAgZWwhLnN0eWxlLndpZHRoID0gbmV3VyArICdweCc7XG4gICAgICBpZiAoZGlyLmluY2x1ZGVzKCd3JykpIGVsIS5zdHlsZS5sZWZ0ID0gKG9yaWdYIC0gKG5ld1cgLSBvcmlnVykpICsgJ3B4JztcbiAgICB9XG4gICAgZnVuY3Rpb24gb25VcCgpOiB2b2lkIHtcbiAgICAgIGlmIChwZykgcHVzaFVuZG8ocGcuaWQsIHsgdHlwZTogJ3Jlc2l6ZScsIGlkOiBibG9ja0lkLCB3OiBvcmlnVywgeDogb3JpZ1gsIHk6IG9yaWdZIH0pO1xuICAgICAgdXBkYXRlQmxvY2tXaWR0aChibG9ja0lkLCBwYXJzZUludChlbCEuc3R5bGUud2lkdGgpKTtcbiAgICAgIHVwZGF0ZUJsb2NrUG9zKGJsb2NrSWQsIHBhcnNlSW50KGVsIS5zdHlsZS5sZWZ0KSwgcGFyc2VJbnQoZWwhLnN0eWxlLnRvcCkpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCBvbk1vdmUpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgb25VcCk7XG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgb25Nb3ZlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCBvblVwKTtcbiAgfSwgW10pO1xuXG4gIC8vIOKUgOKUgCBQYW4gKHNwYWNlK2RyYWcgLyBtaWRkbGUtY2xpY2spIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gIGZ1bmN0aW9uIHN0YXJ0UGFuKHN0YXJ0Q2xpZW50WDogbnVtYmVyLCBzdGFydENsaWVudFk6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IG9yaWdMZWZ0ID0gY29udGFpbmVyUmVmLmN1cnJlbnQhLnNjcm9sbExlZnQ7XG4gICAgY29uc3Qgb3JpZ1RvcCAgPSBjb250YWluZXJSZWYuY3VycmVudCEuc2Nyb2xsVG9wO1xuICAgIGZ1bmN0aW9uIG9uTW92ZShlOiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcbiAgICAgIGNvbnN0IGR4ID0gZS5jbGllbnRYIC0gc3RhcnRDbGllbnRYO1xuICAgICAgY29uc3QgZHkgPSBlLmNsaWVudFkgLSBzdGFydENsaWVudFk7XG4gICAgICBjb250YWluZXJSZWYuY3VycmVudCEuc2Nyb2xsTGVmdCA9IE1hdGgubWF4KDAsIG9yaWdMZWZ0IC0gZHgpO1xuICAgICAgY29udGFpbmVyUmVmLmN1cnJlbnQhLnNjcm9sbFRvcCAgPSBNYXRoLm1heCgwLCBvcmlnVG9wICAtIGR5KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25VcCgpOiB2b2lkIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgb25Nb3ZlKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIG9uVXApO1xuICAgIH1cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG9uTW92ZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgb25VcCk7XG4gIH1cblxuICAvLyDilIDilIAgTWFycXVlZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICBmdW5jdGlvbiBzdGFydE1hcnF1ZWUoc3RhcnRDbGllbnRYOiBudW1iZXIsIHN0YXJ0Q2xpZW50WTogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3Qgc3RhcnRTY3JlZW4gID0gdG9TY3JlZW4oc3RhcnRDbGllbnRYLCBzdGFydENsaWVudFkpO1xuICAgIGNvbnN0IHN0YXJ0Q2FudmFzICA9IHRvQ2FudmFzKHN0YXJ0Q2xpZW50WCwgc3RhcnRDbGllbnRZKTtcblxuICAgIGNvbnN0IG1xID0gbWFycXVlZVJlZi5jdXJyZW50O1xuICAgIGlmIChtcSkgeyBtcS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJzsgbXEuc3R5bGUubGVmdCA9ICcwJzsgbXEuc3R5bGUudG9wID0gJzAnOyBtcS5zdHlsZS53aWR0aCA9ICcwJzsgbXEuc3R5bGUuaGVpZ2h0ID0gJzAnOyB9XG5cbiAgICBmdW5jdGlvbiBvbk1vdmUoZTogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgICBjb25zdCBjdXIgPSB0b1NjcmVlbihlLmNsaWVudFgsIGUuY2xpZW50WSk7XG4gICAgICBjb25zdCB4ID0gTWF0aC5taW4oc3RhcnRTY3JlZW4ueCwgY3VyLngpO1xuICAgICAgY29uc3QgeSA9IE1hdGgubWluKHN0YXJ0U2NyZWVuLnksIGN1ci55KTtcbiAgICAgIGNvbnN0IHcgPSBNYXRoLmFicyhjdXIueCAtIHN0YXJ0U2NyZWVuLngpO1xuICAgICAgY29uc3QgaCA9IE1hdGguYWJzKGN1ci55IC0gc3RhcnRTY3JlZW4ueSk7XG4gICAgICBpZiAobXEpIHsgbXEuc3R5bGUubGVmdCA9IHgrJ3B4JzsgbXEuc3R5bGUudG9wID0geSsncHgnOyBtcS5zdHlsZS53aWR0aCA9IHcrJ3B4JzsgbXEuc3R5bGUuaGVpZ2h0ID0gaCsncHgnOyB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25VcChlOiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcbiAgICAgIGlmIChtcSkgbXEuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIGNvbnN0IGVuZENhbnZhcyA9IHRvQ2FudmFzKGUuY2xpZW50WCwgZS5jbGllbnRZKTtcbiAgICAgIGNvbnN0IHJ4ID0gTWF0aC5taW4oc3RhcnRDYW52YXMueCwgZW5kQ2FudmFzLngpO1xuICAgICAgY29uc3QgcnkgPSBNYXRoLm1pbihzdGFydENhbnZhcy55LCBlbmRDYW52YXMueSk7XG4gICAgICBjb25zdCBydyA9IE1hdGguYWJzKGVuZENhbnZhcy54IC0gc3RhcnRDYW52YXMueCk7XG4gICAgICBjb25zdCByaCA9IE1hdGguYWJzKGVuZENhbnZhcy55IC0gc3RhcnRDYW52YXMueSk7XG5cbiAgICAgIGlmIChydyA+IDQgfHwgcmggPiA0KSB7XG4gICAgICAgIGNvbnN0IGhpdHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICAgICAgaW5uZXJSZWYuY3VycmVudD8ucXVlcnlTZWxlY3RvckFsbCgnLmJsb2NrJykuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICBjb25zdCBibG9ja0VsID0gZWwgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgY29uc3QgYnggPSBwYXJzZUludChibG9ja0VsLnN0eWxlLmxlZnQpLCBieSA9IHBhcnNlSW50KGJsb2NrRWwuc3R5bGUudG9wKTtcbiAgICAgICAgICBjb25zdCBidyA9IGJsb2NrRWwub2Zmc2V0V2lkdGgsIGJoID0gYmxvY2tFbC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgaWYgKGJ4IDwgcngrcncgJiYgYngrYncgPiByeCAmJiBieSA8IHJ5K3JoICYmIGJ5K2JoID4gcnkpIGhpdHMuYWRkKGJsb2NrRWwuZGF0YXNldC5ibG9ja0lkISk7XG4gICAgICAgIH0pO1xuICAgICAgICBzZXRTZWxlY3RlZChoaXRzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldFNlbGVjdGVkKG5ldyBTZXQoKSk7XG4gICAgICB9XG5cbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgb25Nb3ZlKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIG9uVXApO1xuICAgIH1cblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgb25Nb3ZlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCBvblVwKTtcbiAgfVxuXG4gIC8vIOKUgOKUgCBDYW52YXMgcG9pbnRlciBkb3duIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gIGZ1bmN0aW9uIGhhbmRsZVBvaW50ZXJEb3duKGU6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgIGlmIChlLmJ1dHRvbiA9PT0gMSB8fCAoZS5idXR0b24gPT09IDAgJiYgc3BhY2VIZWxkLmN1cnJlbnQpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBzdGFydFBhbihlLmNsaWVudFgsIGUuY2xpZW50WSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChlLmJ1dHRvbiAhPT0gMCkgcmV0dXJuO1xuXG4gICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLmJsdXIoKTtcbiAgICB9XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3Qgc3RhcnRYID0gZS5jbGllbnRYLCBzdGFydFkgPSBlLmNsaWVudFk7XG4gICAgbGV0IG1vdmVkID0gZmFsc2U7XG4gICAgbGV0IG1hcnF1ZWVBY3RpdmUgPSBmYWxzZTtcblxuICAgIGZ1bmN0aW9uIG9uTW92ZShlMjogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgICBjb25zdCBkeCA9IGUyLmNsaWVudFggLSBzdGFydFgsIGR5ID0gZTIuY2xpZW50WSAtIHN0YXJ0WTtcbiAgICAgIGlmICghbW92ZWQgJiYgTWF0aC5zcXJ0KGR4KmR4ICsgZHkqZHkpID4gNCkge1xuICAgICAgICBtb3ZlZCA9IHRydWU7XG4gICAgICAgIGlmIChlZGl0aW5nRW5hYmxlZC52YWx1ZSkge1xuICAgICAgICAgIG1hcnF1ZWVBY3RpdmUgPSB0cnVlO1xuICAgICAgICAgIHN0YXJ0TWFycXVlZShzdGFydFgsIHN0YXJ0WSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RhcnRQYW4oc3RhcnRYLCBzdGFydFkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25VcChlMjogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG9uTW92ZSk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCBvblVwKTtcbiAgICAgIGlmICghbWFycXVlZUFjdGl2ZSAmJiBlZGl0aW5nRW5hYmxlZC52YWx1ZSkge1xuICAgICAgICBzZXRTZWxlY3RlZChuZXcgU2V0KCkpO1xuICAgICAgICBjb25zdCBwb3MgPSB0b0NhbnZhcyhzdGFydFgsIHN0YXJ0WSk7XG4gICAgICAgIGFkZEJsb2NrKHBvcy54LCBwb3MueSk7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgcGcgPSBnZXRBY3RpdmVQYWdlKCk7XG4gICAgICAgICAgaWYgKCFwZykgcmV0dXJuO1xuICAgICAgICAgIGNvbnN0IGxhc3RCbG9jayA9IHBnLmJsb2Nrc1twZy5ibG9ja3MubGVuZ3RoIC0gMV07XG4gICAgICAgICAgaWYgKCFsYXN0QmxvY2spIHJldHVybjtcbiAgICAgICAgICBjb25zdCBlbCA9IGlubmVyUmVmLmN1cnJlbnQ/LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWJsb2NrLWlkPVwiJHtsYXN0QmxvY2suaWR9XCJdIC5ibG9jay1jb250ZW50YCkgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgICAgICAgIGVsPy5mb2N1cygpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG9uTW92ZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgb25VcCk7XG4gIH1cblxuICAvLyDilIDilIAgU2Nyb2xsOiBzYXZlIHBhbiBzdGF0ZSAoZGVib3VuY2VkKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICBmdW5jdGlvbiBoYW5kbGVTY3JvbGwoKTogdm9pZCB7XG4gICAgdXBkYXRlU2l6ZXIoKTtcbiAgICBjb25zdCB7IHpvb20gfSA9IHZpZXdSZWYuY3VycmVudDtcbiAgICBjb25zdCBwYW5YID0gY29udGFpbmVyUmVmLmN1cnJlbnQhLnNjcm9sbExlZnQgLyB6b29tO1xuICAgIGNvbnN0IHBhblkgPSBjb250YWluZXJSZWYuY3VycmVudCEuc2Nyb2xsVG9wICAvIHpvb207XG4gICAgaWYgKHNjcm9sbFNhdmVUaW1lci5jdXJyZW50ICE9PSBudWxsKSBjbGVhclRpbWVvdXQoc2Nyb2xsU2F2ZVRpbWVyLmN1cnJlbnQpO1xuICAgIHNjcm9sbFNhdmVUaW1lci5jdXJyZW50ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB1cGRhdGVQYWdlVmlldyhwYW5YLCBwYW5ZLCB6b29tKTtcbiAgICB9LCAxNTApO1xuICB9XG5cbiAgLy8g4pSA4pSAIFdoZWVsOiB6b29tIG9ubHkgKHBhbiBpcyBuYXRpdmUpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgZWwgPSBjb250YWluZXJSZWYuY3VycmVudDtcbiAgICBpZiAoIWVsKSByZXR1cm47XG5cbiAgICBmdW5jdGlvbiBvbldoZWVsKGU6IFdoZWVsRXZlbnQpOiB2b2lkIHtcbiAgICAgIGlmICghZS5jdHJsS2V5ICYmICFlLm1ldGFLZXkpIHJldHVybjsgLy8gbmF0aXZlIHNjcm9sbCBoYW5kbGVzIHBhblxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBjb25zdCB7IHpvb20gfSA9IHZpZXdSZWYuY3VycmVudDtcbiAgICAgIGNvbnN0IHJlY3QgPSBlbCEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCBteCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICAgIGNvbnN0IG15ID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG4gICAgICBjb25zdCBmYWN0b3IgPSBlLmRlbHRhWSA8IDAgPyAxLjEgOiAwLjk7XG4gICAgICBjb25zdCBueiA9IE1hdGgubWF4KDAuMiwgTWF0aC5taW4oNCwgem9vbSAqIGZhY3RvcikpO1xuXG4gICAgICAvLyBDYW52YXMgcG9pbnQgdW5kZXIgbW91c2Ug4oCUIGtlZXAgdGhpcyBmaXhlZCBhZnRlciB6b29tXG4gICAgICBjb25zdCBjeCA9IChteCArIGVsIS5zY3JvbGxMZWZ0KSAvIHpvb207XG4gICAgICBjb25zdCBjeSA9IChteSArIGVsIS5zY3JvbGxUb3ApICAvIHpvb207XG4gICAgICBjb25zdCBuZXdTY3JvbGxMZWZ0ID0gTWF0aC5tYXgoMCwgY3ggKiBueiAtIG14KTtcbiAgICAgIGNvbnN0IG5ld1Njcm9sbFRvcCAgPSBNYXRoLm1heCgwLCBjeSAqIG56IC0gbXkpO1xuXG4gICAgICB2aWV3UmVmLmN1cnJlbnQgPSB7IHpvb206IG56IH07XG4gICAgICBpbm5lclJlZi5jdXJyZW50IS5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoJHtuen0pYDtcblxuICAgICAgLy8gUmVzaXplIHNpemVyIEJFRk9SRSBzZXR0aW5nIHNjcm9sbCBzbyBicm93c2VyIGRvZXNuJ3QgY2xhbXAgdGhlIHBvc2l0aW9uXG4gICAgICB1cGRhdGVTaXplcihuZXdTY3JvbGxMZWZ0LCBuZXdTY3JvbGxUb3ApO1xuICAgICAgZWwhLnNjcm9sbExlZnQgPSBuZXdTY3JvbGxMZWZ0O1xuICAgICAgZWwhLnNjcm9sbFRvcCAgPSBuZXdTY3JvbGxUb3A7XG5cbiAgICAgIHVwZGF0ZVBhZ2VWaWV3KG5ld1Njcm9sbExlZnQgLyBueiwgbmV3U2Nyb2xsVG9wIC8gbnosIG56KTtcbiAgICB9XG5cbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIG9uV2hlZWwsIHsgcGFzc2l2ZTogZmFsc2UgfSk7XG4gICAgcmV0dXJuICgpID0+IGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3doZWVsJywgb25XaGVlbCk7XG4gIH0sIFtdKTtcblxuICAvLyDilIDilIAgU3BhY2Uga2V5IC8gRGVsZXRlIC8gVW5kbyAvIFBhc3RlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgZnVuY3Rpb24gb25LZXlEb3duKGU6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgICAgaWYgKGUuY29kZSA9PT0gJ1NwYWNlJyAmJiAhdGFyZ2V0LmlzQ29udGVudEVkaXRhYmxlICYmIHRhcmdldC50YWdOYW1lICE9PSAnSU5QVVQnKSB7XG4gICAgICAgIHNwYWNlSGVsZC5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgaWYgKGNvbnRhaW5lclJlZi5jdXJyZW50KSBjb250YWluZXJSZWYuY3VycmVudC5zdHlsZS5jdXJzb3IgPSAnZ3JhYic7XG4gICAgICB9XG4gICAgICBpZiAoKGUua2V5ID09PSAnRGVsZXRlJyB8fCBlLmtleSA9PT0gJ0JhY2tzcGFjZScpICYmIHNlbGVjdGVkUmVmLmN1cnJlbnQuc2l6ZSAmJiAhdGFyZ2V0LmlzQ29udGVudEVkaXRhYmxlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgcGcgPSBnZXRBY3RpdmVQYWdlKCk7XG4gICAgICAgIGlmICghcGcpIHJldHVybjtcbiAgICAgICAgY29uc3QgdG9EZWxldGUgPSBbLi4uc2VsZWN0ZWRSZWYuY3VycmVudF07XG4gICAgICAgIGlmICghdG9EZWxldGUubGVuZ3RoKSByZXR1cm47XG4gICAgICAgIGNvbnN0IGRlbGV0ZWQgPSB0b0RlbGV0ZS5tYXAoaWQgPT4gcGcuYmxvY2tzLmZpbmQoYiA9PiBiLmlkID09PSBpZCkpLmZpbHRlcigoYik6IGIgaXMgQmxvY2tUeXBlID0+ICEhYikubWFwKGIgPT4gKHsgLi4uYiB9KSk7XG4gICAgICAgIHB1c2hVbmRvKHBnLmlkLCB7IHR5cGU6ICdkZWxldGUnLCBibG9ja3M6IGRlbGV0ZWQgfSk7XG4gICAgICAgIGZvciAoY29uc3QgaWQgb2YgdG9EZWxldGUpIGRlbGV0ZUJsb2NrKGlkKTtcbiAgICAgICAgc2V0U2VsZWN0ZWQobmV3IFNldCgpKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1vZCA9IGUuY3RybEtleSB8fCBlLm1ldGFLZXk7XG4gICAgICBpZiAobW9kICYmIGUua2V5ID09PSAneicgJiYgIXRhcmdldC5pc0NvbnRlbnRFZGl0YWJsZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc2hpZnRLZXkgPyBkb1JlZG8oKSA6IGRvVW5kbygpO1xuICAgICAgfVxuICAgICAgaWYgKChlLmtleSA9PT0gJ1snIHx8IGUua2V5ID09PSAnXScpICYmIHNlbGVjdGVkUmVmLmN1cnJlbnQuc2l6ZSAmJiAhdGFyZ2V0LmlzQ29udGVudEVkaXRhYmxlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgcGcgPSBnZXRBY3RpdmVQYWdlKCk7XG4gICAgICAgIGlmICghcGcpIHJldHVybjtcbiAgICAgICAgZm9yIChjb25zdCBpZCBvZiBzZWxlY3RlZFJlZi5jdXJyZW50KSB7XG4gICAgICAgICAgY29uc3QgYmxrID0gcGcuYmxvY2tzLmZpbmQoYiA9PiBiLmlkID09PSBpZCk7XG4gICAgICAgICAgaWYgKCFibGspIGNvbnRpbnVlO1xuICAgICAgICAgIHVwZGF0ZUJsb2NrWihpZCwgKGJsay56ID8/IDApICsgKGUua2V5ID09PSAnXScgPyAxIDogLTEpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gQ3RybCtBIOKAlCBzZWxlY3QgYWxsIGJsb2Nrc1xuICAgICAgaWYgKG1vZCAmJiBlLmtleSA9PT0gJ2EnICYmICF0YXJnZXQuaXNDb250ZW50RWRpdGFibGUgJiYgdGFyZ2V0LnRhZ05hbWUgIT09ICdJTlBVVCcpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBwZyA9IGdldEFjdGl2ZVBhZ2UoKTtcbiAgICAgICAgaWYgKHBnKSBzZXRTZWxlY3RlZChuZXcgU2V0KHBnLmJsb2Nrcy5tYXAoYiA9PiBiLmlkKSkpO1xuICAgICAgfVxuICAgICAgLy8gRXNjYXBlIOKAlCBkZXNlbGVjdFxuICAgICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJyAmJiAhdGFyZ2V0LmlzQ29udGVudEVkaXRhYmxlKSB7XG4gICAgICAgIGlmIChzZWxlY3RlZFJlZi5jdXJyZW50LnNpemUpIHNldFNlbGVjdGVkKG5ldyBTZXQoKSk7XG4gICAgICB9XG4gICAgICAvLyBDdHJsK0Mg4oCUIGNvcHkgc2VsZWN0ZWQgYmxvY2tzXG4gICAgICBpZiAobW9kICYmIGUua2V5ID09PSAnYycgJiYgIXRhcmdldC5pc0NvbnRlbnRFZGl0YWJsZSAmJiBzZWxlY3RlZFJlZi5jdXJyZW50LnNpemUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBwZyA9IGdldEFjdGl2ZVBhZ2UoKTtcbiAgICAgICAgaWYgKCFwZykgcmV0dXJuO1xuICAgICAgICBjb25zdCBibG9ja3MgPSBbLi4uc2VsZWN0ZWRSZWYuY3VycmVudF0ubWFwKGlkID0+IHBnLmJsb2Nrcy5maW5kKGIgPT4gYi5pZCA9PT0gaWQpKS5maWx0ZXIoKGIpOiBiIGlzIEJsb2NrVHlwZSA9PiAhIWIpO1xuICAgICAgICBjb3B5QmxvY2tzKGJsb2Nrcyk7XG4gICAgICAgIC8vIFNpbmdsZSBpbWFnZSBibG9jazogYWxzbyBjb3B5IGltYWdlIHRvIHN5c3RlbSBjbGlwYm9hcmRcbiAgICAgICAgaWYgKGJsb2Nrcy5sZW5ndGggPT09IDEgJiYgYmxvY2tzWzBdLnR5cGUgPT09ICdpbWFnZScpIHtcbiAgICAgICAgICBjb25zdCBpbWdFbCA9IGlubmVyUmVmLmN1cnJlbnQ/LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWJsb2NrLWlkPVwiJHtibG9ja3NbMF0uaWR9XCJdIGltZ2ApIGFzIEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsO1xuICAgICAgICAgIGlmIChpbWdFbCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgY29uc3QgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgICBjLndpZHRoID0gaW1nRWwubmF0dXJhbFdpZHRoO1xuICAgICAgICAgICAgICBjLmhlaWdodCA9IGltZ0VsLm5hdHVyYWxIZWlnaHQ7XG4gICAgICAgICAgICAgIGMuZ2V0Q29udGV4dCgnMmQnKSEuZHJhd0ltYWdlKGltZ0VsLCAwLCAwKTtcbiAgICAgICAgICAgICAgYy50b0Jsb2IoYmxvYiA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGJsb2IpIG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGUoW25ldyBDbGlwYm9hcmRJdGVtKHsgW2Jsb2IudHlwZV06IGJsb2IgfSldKS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gQ3RybCtYIOKAlCBjdXQgc2VsZWN0ZWQgYmxvY2tzXG4gICAgICBpZiAobW9kICYmIGUua2V5ID09PSAneCcgJiYgIXRhcmdldC5pc0NvbnRlbnRFZGl0YWJsZSAmJiBzZWxlY3RlZFJlZi5jdXJyZW50LnNpemUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBwZyA9IGdldEFjdGl2ZVBhZ2UoKTtcbiAgICAgICAgaWYgKCFwZykgcmV0dXJuO1xuICAgICAgICBjb25zdCB0b0RlbGV0ZSA9IFsuLi5zZWxlY3RlZFJlZi5jdXJyZW50XTtcbiAgICAgICAgY29uc3QgYmxvY2tzID0gdG9EZWxldGUubWFwKGlkID0+IHBnLmJsb2Nrcy5maW5kKGIgPT4gYi5pZCA9PT0gaWQpKS5maWx0ZXIoKGIpOiBiIGlzIEJsb2NrVHlwZSA9PiAhIWIpLm1hcChiID0+ICh7IC4uLmIgfSkpO1xuICAgICAgICBjb3B5QmxvY2tzKGJsb2Nrcyk7XG4gICAgICAgIHB1c2hVbmRvKHBnLmlkLCB7IHR5cGU6ICdkZWxldGUnLCBibG9ja3MgfSk7XG4gICAgICAgIGZvciAoY29uc3QgaWQgb2YgdG9EZWxldGUpIGRlbGV0ZUJsb2NrKGlkKTtcbiAgICAgICAgc2V0U2VsZWN0ZWQobmV3IFNldCgpKTtcbiAgICAgIH1cbiAgICAgIC8vIEN0cmwrViDigJQgcGFzdGUgY29waWVkIGJsb2NrcyAod2hlbiBub3QgaW4gYSB0ZXh0IGVkaXRvcilcbiAgICAgIGlmIChtb2QgJiYgZS5rZXkgPT09ICd2JyAmJiAhdGFyZ2V0LmlzQ29udGVudEVkaXRhYmxlKSB7XG4gICAgICAgIGNvbnN0IGJsb2NrcyA9IGdldENvcGllZEJsb2NrcygpO1xuICAgICAgICBpZiAoYmxvY2tzPy5sZW5ndGgpIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgY29uc3QgcGcgPSBnZXRBY3RpdmVQYWdlKCk7XG4gICAgICAgICAgaWYgKCFwZykgcmV0dXJuO1xuICAgICAgICAgIGNvbnN0IG5ld0lkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgICAgICAgIGZvciAoY29uc3QgYiBvZiBibG9ja3MpIHtcbiAgICAgICAgICAgIGNvbnN0IG5iID0gYWRkQmxvY2soYi54ICsgMzAsIGIueSArIDMwLCBiLncsIGIudHlwZSwge1xuICAgICAgICAgICAgICBodG1sOiBiLmh0bWwsIHNyYzogYi5zcmMsXG4gICAgICAgICAgICAgIGNyb3A6IGIuY3JvcCA/IHsgLi4uYi5jcm9wIH0gOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIGNhcHRpb246IGIuY2FwdGlvbiwgYm9yZGVyOiBiLmJvcmRlcixcbiAgICAgICAgICAgICAgaXRlbXM6IGIuaXRlbXM/Lm1hcChpID0+ICh7IC4uLmksIGlkOiB1aWQoKSB9KSksXG4gICAgICAgICAgICAgIHo6IGIueixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbmV3SWRzLmFkZChuYi5pZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHB1c2hVbmRvKHBnLmlkLCB7IHR5cGU6ICdkZWxldGVGb3J3YXJkJywgaWRzOiBbLi4ubmV3SWRzXSB9KTtcbiAgICAgICAgICBzZXRTZWxlY3RlZChuZXdJZHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBDdHJsK0Qg4oCUIGR1cGxpY2F0ZSBzZWxlY3RlZCBibG9ja3NcbiAgICAgIGlmIChtb2QgJiYgZS5rZXkgPT09ICdkJyAmJiAhdGFyZ2V0LmlzQ29udGVudEVkaXRhYmxlICYmIHNlbGVjdGVkUmVmLmN1cnJlbnQuc2l6ZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IHBnID0gZ2V0QWN0aXZlUGFnZSgpO1xuICAgICAgICBpZiAoIXBnKSByZXR1cm47XG4gICAgICAgIGNvbnN0IGJsb2NrcyA9IFsuLi5zZWxlY3RlZFJlZi5jdXJyZW50XS5tYXAoaWQgPT4gcGcuYmxvY2tzLmZpbmQoYiA9PiBiLmlkID09PSBpZCkpLmZpbHRlcigoYik6IGIgaXMgQmxvY2tUeXBlID0+ICEhYik7XG4gICAgICAgIGNvbnN0IG5ld0lkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgICAgICBmb3IgKGNvbnN0IGIgb2YgYmxvY2tzKSB7XG4gICAgICAgICAgY29uc3QgbmIgPSBhZGRCbG9jayhiLnggKyAzMCwgYi55ICsgMzAsIGIudywgYi50eXBlLCB7XG4gICAgICAgICAgICBodG1sOiBiLmh0bWwsIHNyYzogYi5zcmMsXG4gICAgICAgICAgICBjcm9wOiBiLmNyb3AgPyB7IC4uLmIuY3JvcCB9IDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgY2FwdGlvbjogYi5jYXB0aW9uLCBib3JkZXI6IGIuYm9yZGVyLFxuICAgICAgICAgICAgaXRlbXM6IGIuaXRlbXM/Lm1hcChpID0+ICh7IC4uLmksIGlkOiB1aWQoKSB9KSksXG4gICAgICAgICAgICB6OiBiLnosXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbmV3SWRzLmFkZChuYi5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgcHVzaFVuZG8ocGcuaWQsIHsgdHlwZTogJ2RlbGV0ZUZvcndhcmQnLCBpZHM6IFsuLi5uZXdJZHNdIH0pO1xuICAgICAgICBzZXRTZWxlY3RlZChuZXdJZHMpO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBvbktleVVwKGU6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAgIGlmIChlLmNvZGUgPT09ICdTcGFjZScpIHtcbiAgICAgICAgc3BhY2VIZWxkLmN1cnJlbnQgPSBmYWxzZTtcbiAgICAgICAgaWYgKGNvbnRhaW5lclJlZi5jdXJyZW50KSBjb250YWluZXJSZWYuY3VycmVudC5zdHlsZS5jdXJzb3IgPSAnJztcbiAgICAgIH1cbiAgICB9XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5RG93bik7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBvbktleVVwKTtcbiAgICBjb25zdCBjbGVhbnVwUGFzdGUgPSBpbml0UGFzdGVIYW5kbGVyKHtcbiAgICAgIGdldENvbnRhaW5lcjogKCkgPT4gY29udGFpbmVyUmVmLmN1cnJlbnQsXG4gICAgICBnZXRWaWV3OiAoKSA9PiB2aWV3UmVmLmN1cnJlbnQsXG4gICAgfSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleURvd24pO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBvbktleVVwKTtcbiAgICAgIGNsZWFudXBQYXN0ZSgpO1xuICAgIH07XG4gIH0sIFtdKTtcblxuICAvLyDilIDilIAgVW5kby9SZWRvIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gIGZ1bmN0aW9uIGRvVW5kbygpOiB2b2lkIHtcbiAgICBjb25zdCBwZyA9IGdldEFjdGl2ZVBhZ2UoKTtcbiAgICBpZiAoIXBnKSByZXR1cm47XG4gICAgaWYgKCFhcHBseVVuZG8ocGcuaWQsIHBnKSkgcmV0dXJuO1xuICAgIGFwcFN0YXRlLnZhbHVlID0geyAuLi5hcHBTdGF0ZS52YWx1ZSB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZG9SZWRvKCk6IHZvaWQge1xuICAgIGNvbnN0IHBnID0gZ2V0QWN0aXZlUGFnZSgpO1xuICAgIGlmICghcGcpIHJldHVybjtcbiAgICBpZiAoIWFwcGx5UmVkbyhwZy5pZCwgcGcpKSByZXR1cm47XG4gICAgYXBwU3RhdGUudmFsdWUgPSB7IC4uLmFwcFN0YXRlLnZhbHVlIH07XG4gIH1cblxuICBjb25zdCBJTUFHRV9VUkxfUkUgPSAvXFwuKHBuZ3xqcGU/Z3xnaWZ8d2VicHxzdmd8Ym1wfGljb3xhdmlmKShcXD98JCkvaTtcblxuICBmdW5jdGlvbiBoYW5kbGVEcm9wKGU6IERyYWdFdmVudCk6IHZvaWQge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmIChlLmRhdGFUcmFuc2ZlciEudHlwZXMuaW5jbHVkZXMoJ2FwcGxpY2F0aW9uL3gtbm90ZWJvdW5kLWNsYXVkZScpKSB7XG4gICAgICBzdGFydENsYXVkZUNoYXQoZS5jbGllbnRYIC0gMTgwLCBlLmNsaWVudFkgLSAyMCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcG9zID0gdG9DYW52YXMoZS5jbGllbnRYLCBlLmNsaWVudFkpO1xuXG4gICAgY29uc3QgdXJpID0gKGUuZGF0YVRyYW5zZmVyIS5nZXREYXRhKCd0ZXh0L3VyaS1saXN0JykgfHwgJycpLnRyaW0oKTtcbiAgICBpZiAodXJpICYmICF1cmkuc3RhcnRzV2l0aCgnIycpICYmIElNQUdFX1VSTF9SRS50ZXN0KHVyaSkpIHtcbiAgICAgIGFkZEltYWdlRnJvbVVybCh1cmksIHBvcy54LCBwb3MueSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZmlsZXMgPSBbLi4uZS5kYXRhVHJhbnNmZXIhLmZpbGVzXS5maWx0ZXIoZiA9PiBmLnR5cGUuc3RhcnRzV2l0aCgnaW1hZ2UvJykpO1xuICAgIGlmICghZmlsZXMubGVuZ3RoKSByZXR1cm47XG4gICAgZmlsZXMuZm9yRWFjaCgoZmlsZSwgaSkgPT4ge1xuICAgICAgYWRkSW1hZ2VGcm9tRmlsZShmaWxlLCBwb3MueCArIGkgKiAyMCwgcG9zLnkgKyBpICogMjApO1xuICAgIH0pO1xuICB9XG5cbiAgLy8g4pSA4pSAIENvbnRleHQgZm9yIGJsb2NrcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICBmdW5jdGlvbiBmb2N1c0ZpcnN0QmxvY2soKTogdm9pZCB7XG4gICAgY29uc3QgcGcgPSBnZXRBY3RpdmVQYWdlKCk7XG4gICAgaWYgKCFwZykgcmV0dXJuO1xuICAgIGxldCBibGsgPSBwZy5ibG9ja3MuZmluZChiID0+IGIudHlwZSA9PT0gJ3RleHQnICYmIGIueCA9PT0gMCAmJiBiLnkgPT09IDApO1xuICAgIGlmICghYmxrKSB7XG4gICAgICBibGsgPSBhZGRCbG9jaygwLCAwKTtcbiAgICB9XG4gICAgY29uc3QgaWQgPSBibGshLmlkO1xuICAgIC8vIEZvcmNlIENhbnZhcyByZS1yZW5kZXIgc28gdGhlIGJsb2NrIGFwcGVhcnMgaW4gdGhlIERPTVxuICAgIHNldFNlbGVjdGVkKG5ldyBTZXQoKSk7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGNvbnN0IGVsID0gaW5uZXJSZWYuY3VycmVudD8ucXVlcnlTZWxlY3RvcihgW2RhdGEtYmxvY2staWQ9XCIke2lkfVwiXSAuYmxvY2stY29udGVudGApIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICAgIGlmIChlbCkgZWwuZm9jdXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IGN0eDogQ2FudmFzQ29udGV4dCA9IHtcbiAgICBzZWxlY3RlZElkcyxcbiAgICBvbkJsb2NrRHJhZ1N0YXJ0LFxuICAgIG9uQmxvY2tSZXNpemVTdGFydCxcbiAgICBvbkltZ1Jlc2l6ZVN0YXJ0LFxuICAgIG9uQmxvY2tGb2N1czogKGlkOiBzdHJpbmcpID0+IHt9LFxuICAgIG9uQmxvY2tCbHVyOiAoaWQ6IHN0cmluZykgPT4ge1xuICAgICAgaWYgKCFwYWdlKSByZXR1cm47XG4gICAgICBjb25zdCBlbCA9IGlubmVyUmVmLmN1cnJlbnQ/LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWJsb2NrLWlkPVwiJHtpZH1cIl0gLmJsb2NrLWNvbnRlbnRgKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgICBjb25zdCBvZmZzZXQgPSBlbCA/IGdldENhcmV0T2Zmc2V0KGVsKSA6IDA7XG4gICAgICBsYXN0Q2FyZXRQZXJQYWdlLnNldChwYWdlLmlkLCB7IGJsb2NrSWQ6IGlkLCBvZmZzZXQgfSk7XG4gICAgICBzYXZlUGFnZUNhcmV0KHBhZ2UuaWQsIGlkLCBvZmZzZXQpO1xuICAgIH0sXG4gICAgdW5kbzogZG9VbmRvLFxuICAgIHJlZG86IGRvUmVkbyxcbiAgICBnZXRab29tOiAoKSA9PiB2aWV3UmVmLmN1cnJlbnQuem9vbSxcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8UGFnZVRpdGxlIHBhZ2U9e3BhZ2V9IG9uRW50ZXI9e2ZvY3VzRmlyc3RCbG9ja30gLz5cbiAgICAgIDxDYW52YXNDdHguUHJvdmlkZXIgdmFsdWU9e2N0eH0+XG4gICAgICAgIDxkaXYgaWQ9XCJjYW52YXMtd3JhcHBlclwiPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHJlZj17Y29udGFpbmVyUmVmfVxuICAgICAgICAgICAgaWQ9XCJjYW52YXMtY29udGFpbmVyXCJcbiAgICAgICAgICAgIG9uUG9pbnRlckRvd249e2hhbmRsZVBvaW50ZXJEb3dufVxuICAgICAgICAgICAgb25TY3JvbGw9e2hhbmRsZVNjcm9sbH1cbiAgICAgICAgICAgIG9uRHJhZ092ZXI9eyhlOiBEcmFnRXZlbnQpID0+IHsgaWYgKGUuZGF0YVRyYW5zZmVyIS50eXBlcy5pbmNsdWRlcygnRmlsZXMnKSB8fCBlLmRhdGFUcmFuc2ZlciEudHlwZXMuaW5jbHVkZXMoJ2FwcGxpY2F0aW9uL3gtbm90ZWJvdW5kLWNsYXVkZScpKSBlLnByZXZlbnREZWZhdWx0KCk7IH19XG4gICAgICAgICAgICBvbkRyb3A9e2hhbmRsZURyb3B9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGRpdiByZWY9e3NpemVyUmVmfSBpZD1cImNhbnZhcy1zaXplclwiPlxuICAgICAgICAgICAgICA8ZGl2IHJlZj17aW5uZXJSZWZ9IGlkPVwiY2FudmFzLWlubmVyXCIgc3R5bGU9e3sgdHJhbnNmb3JtT3JpZ2luOiAnMCAwJyB9fT5cbiAgICAgICAgICAgICAgICB7Y2FjaGVkUGFnZXMubWFwKHAgPT4ge1xuICAgICAgICAgICAgICAgICAgbGV0IHN0eWxlOiB7IG9wYWNpdHk6IG51bWJlcjsgcG9pbnRlckV2ZW50czogc3RyaW5nIH0gfCB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICBpZiAodHJhbnNpdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IHRoZSBpbmNvbWluZyBwYWdlIGF0IHBoYXNlPSdpbicgaXMgdmlzaWJsZSAob3BhY2l0eToxLCB0cmFuc2l0aW9ucyBmcm9tIDApXG4gICAgICAgICAgICAgICAgICAgIC8vIEV2ZXJ5dGhpbmcgZWxzZTogb3BhY2l0eTowIChvdXRnb2luZyB0cmFuc2l0aW9ucyAx4oaSMCwgb3RoZXJzIHN0YXkgaGlkZGVuKVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzaG93aW5nID0gcC5pZCA9PT0gdHJhbnNpdGlvbi5pbklkICYmIHRyYW5zaXRpb24ucGhhc2UgPT09ICdpbic7XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlID0gc2hvd2luZyA/IHVuZGVmaW5lZCA6IHsgb3BhY2l0eTogMCwgcG9pbnRlckV2ZW50czogJ25vbmUnIH07XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdHlsZSA9IHAuaWQgIT09IHBhZ2U/LmlkID8geyBvcGFjaXR5OiAwLCBwb2ludGVyRXZlbnRzOiAnbm9uZScgfSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtwLmlkfSBjbGFzcz1cInBhZ2UtbGF5ZXJcIiBzdHlsZT17c3R5bGV9PlxuICAgICAgICAgICAgICAgICAgICAgIHtwLmJsb2Nrcy5tYXAoYiA9PiA8QmxvY2sga2V5PXtiLmlkfSBibG9jaz17Yn0gcGFnZT17cH0gLz4pfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiByZWY9e21hcnF1ZWVSZWZ9IGlkPVwibWFycXVlZS1yZWN0XCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0NhbnZhc0N0eC5Qcm92aWRlcj5cbiAgICA8Lz5cbiAgKTtcbn1cbiIsCiAgICAiaW1wb3J0IHsgY3JlYXRlQW5kT3Blbk5vdGVib29rLCBwaWNrQW5kT3Blbk5vdGVib29rLCBvcGVuTm90ZWJvb2ssIHJlY2VudE5vdGVib29rcyB9IGZyb20gJy4vc3RvcmUudHMnO1xuaW1wb3J0IHR5cGUgeyBKU1ggfSBmcm9tICdwcmVhY3QnO1xuXG5jb25zdCB0cnVuY1BhdGggPSAocDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgY29uc3QgaG9tZSA9IHAucmVwbGFjZSgvXlxcL1VzZXJzXFwvW14vXSsvLCAnficpLnJlcGxhY2UoL15cXC9ob21lXFwvW14vXSsvLCAnficpO1xuICByZXR1cm4gaG9tZS5sZW5ndGggPiA0OCA/ICcuLi4nICsgaG9tZS5zbGljZSgtNDUpIDogaG9tZTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBXZWxjb21lU2NyZWVuKCk6IEpTWC5FbGVtZW50IHtcbiAgY29uc3QgcmVjZW50cyA9IHJlY2VudE5vdGVib29rcy52YWx1ZTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lLW92ZXJsYXlcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lLWNhcmRcIj5cbiAgICAgICAgPGgxIGNsYXNzPVwid2VsY29tZS10aXRsZVwiPk5vdGVib3VuZDwvaDE+XG4gICAgICAgIDxwIGNsYXNzPVwid2VsY29tZS1zdWJ0aXRsZVwiPntyZWNlbnRzLmxlbmd0aCA+IDAgPyAnT3BlbiBhIG5vdGVib29rIHRvIGdldCBzdGFydGVkJyA6ICdDaG9vc2UgaG93IHRvIGdldCBzdGFydGVkJ308L3A+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lLWxpc3RcIj5cbiAgICAgICAgICB7cmVjZW50cy5tYXAociA9PiAoXG4gICAgICAgICAgICA8ZGl2IGtleT17ci5wYXRofSBjbGFzcz1cIndlbGNvbWUtbGlzdC1pdGVtIHdlbGNvbWUtbGlzdC1pdGVtLS1ub3RlYm9va1wiIG9uQ2xpY2s9eygpID0+IG9wZW5Ob3RlYm9vayhyLnBhdGgpfT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWUtbGlzdC1pdGVtLWljb25cIj5cbiAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMTYgMTZcIiBmaWxsPVwibm9uZVwiPlxuICAgICAgICAgICAgICAgICAgPHJlY3QgeD1cIjJcIiB5PVwiMlwiIHdpZHRoPVwiMTJcIiBoZWlnaHQ9XCIxMlwiIHJ4PVwiMlwiIGZpbGw9XCJ2YXIoLS1hY3RpdmUtY29sb3IpXCIgb3BhY2l0eT1cIjAuMTVcIi8+XG4gICAgICAgICAgICAgICAgICA8cmVjdCB4PVwiMlwiIHk9XCIyXCIgd2lkdGg9XCIxMlwiIGhlaWdodD1cIjEyXCIgcng9XCIyXCIgc3Ryb2tlPVwidmFyKC0tYWN0aXZlLWNvbG9yKVwiIHN0cm9rZS13aWR0aD1cIjEuMlwiLz5cbiAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPVwiNVwiIHkxPVwiNS41XCIgeDI9XCIxMVwiIHkyPVwiNS41XCIgc3Ryb2tlPVwidmFyKC0tYWN0aXZlLWNvbG9yKVwiIHN0cm9rZS13aWR0aD1cIjFcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIvPlxuICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9XCI1XCIgeTE9XCI4XCIgeDI9XCIxMVwiIHkyPVwiOFwiIHN0cm9rZT1cInZhcigtLWFjdGl2ZS1jb2xvcilcIiBzdHJva2Utd2lkdGg9XCIxXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiLz5cbiAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPVwiNVwiIHkxPVwiMTAuNVwiIHgyPVwiOVwiIHkyPVwiMTAuNVwiIHN0cm9rZT1cInZhcigtLWFjdGl2ZS1jb2xvcilcIiBzdHJva2Utd2lkdGg9XCIxXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiLz5cbiAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lLWxpc3QtaXRlbS10ZXh0XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWUtbGlzdC1pdGVtLW5hbWVcIj57ci5uYW1lfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lLWxpc3QtaXRlbS1wYXRoXCI+e3RydW5jUGF0aChyLnBhdGgpfTwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkpfVxuICAgICAgICAgIHtyZWNlbnRzLmxlbmd0aCA+IDAgJiYgPGRpdiBjbGFzcz1cIndlbGNvbWUtbGlzdC1zZXBcIiAvPn1cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZS1saXN0LWl0ZW0gd2VsY29tZS1saXN0LWl0ZW0tLWFjdGlvblwiIG9uQ2xpY2s9e3BpY2tBbmRPcGVuTm90ZWJvb2t9PlxuICAgICAgICAgICAgT3BlbiBFeGlzdGluZyBOb3RlYm9vay4uLlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lLWxpc3QtaXRlbSB3ZWxjb21lLWxpc3QtaXRlbS0tYWN0aW9uXCIgb25DbGljaz17Y3JlYXRlQW5kT3Blbk5vdGVib29rfT5cbiAgICAgICAgICAgIENyZWF0ZSBOZXcgTm90ZWJvb2suLi5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiIsCiAgICAiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VSZWYgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0IHsgc2hvd1N3aXRjaGVyLCBjbG9zZVN3aXRjaGVyLCByZWNlbnROb3RlYm9va3MsIG9wZW5Ob3RlYm9vaywgcGlja0FuZE9wZW5Ob3RlYm9vaywgY3JlYXRlQW5kT3Blbk5vdGVib29rIH0gZnJvbSAnLi9zdG9yZS50cyc7XG5pbXBvcnQgdHlwZSB7IEpTWCB9IGZyb20gJ3ByZWFjdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBOb3RlYm9va1N3aXRjaGVyKCk6IEpTWC5FbGVtZW50IHwgbnVsbCB7XG4gIGlmICghc2hvd1N3aXRjaGVyLnZhbHVlKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCByZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25DbGljayA9IChlOiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgICBpZiAocmVmLmN1cnJlbnQgJiYgIXJlZi5jdXJyZW50LmNvbnRhaW5zKGUudGFyZ2V0IGFzIE5vZGUpKSBjbG9zZVN3aXRjaGVyKCk7XG4gICAgfTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkNsaWNrKTtcbiAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25DbGljayk7XG4gIH0sIFtdKTtcblxuICBjb25zdCByZWNlbnRzID0gcmVjZW50Tm90ZWJvb2tzLnZhbHVlO1xuXG4gIGNvbnN0IHRydW5jUGF0aCA9IChwOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGhvbWUgPSBwLnJlcGxhY2UoL15cXC9ob21lXFwvW14vXSsvLCAnficpO1xuICAgIHJldHVybiBob21lLmxlbmd0aCA+IDUwID8gJy4uLicgKyBob21lLnNsaWNlKC00NykgOiBob21lO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzcz1cIm5vdGVib29rLXN3aXRjaGVyXCIgcmVmPXtyZWZ9PlxuICAgICAge3JlY2VudHMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgIDw+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm5vdGVib29rLXN3aXRjaGVyLWhlYWRlclwiPlJlY2VudCBOb3RlYm9va3M8L2Rpdj5cbiAgICAgICAgICB7cmVjZW50cy5tYXAociA9PiAoXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGtleT17ci5wYXRofVxuICAgICAgICAgICAgICBjbGFzcz1cIm5vdGVib29rLXN3aXRjaGVyLWl0ZW1cIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvcGVuTm90ZWJvb2soci5wYXRoKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5vdGVib29rLXN3aXRjaGVyLWl0ZW0tbmFtZVwiPntyLm5hbWV9PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJub3RlYm9vay1zd2l0Y2hlci1pdGVtLXBhdGhcIj57dHJ1bmNQYXRoKHIucGF0aCl9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApKX1cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90ZWJvb2stc3dpdGNoZXItc2VwXCIgLz5cbiAgICAgICAgPC8+XG4gICAgICApfVxuICAgICAgPGRpdiBjbGFzcz1cIm5vdGVib29rLXN3aXRjaGVyLWl0ZW1cIiBvbkNsaWNrPXsoKSA9PiB7IGNsb3NlU3dpdGNoZXIoKTsgcGlja0FuZE9wZW5Ob3RlYm9vaygpOyB9fT5cbiAgICAgICAgT3BlbiBFeGlzdGluZyBOb3RlYm9vay4uLlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwibm90ZWJvb2stc3dpdGNoZXItaXRlbVwiIG9uQ2xpY2s9eygpID0+IHsgY2xvc2VTd2l0Y2hlcigpOyBjcmVhdGVBbmRPcGVuTm90ZWJvb2soKTsgfX0+XG4gICAgICAgIENyZWF0ZSBOZXcgTm90ZWJvb2suLi5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwKICAgICJpbXBvcnQgeyB1c2VSZWYsIHVzZUVmZmVjdCwgdXNlTGF5b3V0RWZmZWN0LCB1c2VDYWxsYmFjayB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBjbGF1ZGVDaGF0LCBzZW5kQ2xhdWRlTWVzc2FnZSwgY2xvc2VDbGF1ZGVDaGF0LCB1cGRhdGVDbGF1ZGVDaGF0UG9zaXRpb24sIGRpc3BsYXlQYW5lbCB9IGZyb20gJy4vc3RvcmUudHMnO1xuaW1wb3J0IHR5cGUgeyBKU1ggfSBmcm9tICdwcmVhY3QnO1xuXG5mdW5jdGlvbiByZW5kZXJNYXJrZG93bih0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBDb2RlIGJsb2Nrc1xuICBsZXQgaHRtbCA9IHRleHQucmVwbGFjZSgvYGBgKFxcdyopXFxuKFtcXHNcXFNdKj8pYGBgL2csIChfOiBzdHJpbmcsIGxhbmc6IHN0cmluZywgY29kZTogc3RyaW5nKSA9PiB7XG4gICAgcmV0dXJuIGA8cHJlIGNsYXNzPVwiY2MtY29kZS1ibG9ja1wiPjxjb2RlPiR7ZXNjSHRtbChjb2RlLnRyaW1FbmQoKSl9PC9jb2RlPjwvcHJlPmA7XG4gIH0pO1xuICAvLyBJbmxpbmUgY29kZVxuICBodG1sID0gaHRtbC5yZXBsYWNlKC9gKFteYF0rKWAvZywgJzxjb2RlPiQxPC9jb2RlPicpO1xuICAvLyBCb2xkXG4gIGh0bWwgPSBodG1sLnJlcGxhY2UoL1xcKlxcKiguKz8pXFwqXFwqL2csICc8c3Ryb25nPiQxPC9zdHJvbmc+Jyk7XG4gIC8vIEl0YWxpY1xuICBodG1sID0gaHRtbC5yZXBsYWNlKC9cXCooLis/KVxcKi9nLCAnPGVtPiQxPC9lbT4nKTtcbiAgLy8gVW5vcmRlcmVkIGxpc3RzXG4gIGh0bWwgPSBodG1sLnJlcGxhY2UoL15b4oCiXFwtXFwqXSAoLispJC9nbSwgJzxsaT4kMTwvbGk+Jyk7XG4gIGh0bWwgPSBodG1sLnJlcGxhY2UoLyg8bGk+Lio8XFwvbGk+XFxuPykrL2csIChtOiBzdHJpbmcpID0+IGA8dWw+JHttfTwvdWw+YCk7XG4gIC8vIE9yZGVyZWQgbGlzdHNcbiAgaHRtbCA9IGh0bWwucmVwbGFjZSgvXlxcZCtcXC4gKC4rKSQvZ20sICc8bGk+JDE8L2xpPicpO1xuICAvLyBMaW5lIGJyZWFrc1xuICBodG1sID0gaHRtbC5yZXBsYWNlKC9cXG4vZywgJzxici8+Jyk7XG4gIHJldHVybiBodG1sO1xufVxuXG5mdW5jdGlvbiBlc2NIdG1sKHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzLnJlcGxhY2UoLyYvZywgJyZhbXA7JykucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENsYXVkZUNoYXQoKTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgY2hhdCA9IGNsYXVkZUNoYXQudmFsdWU7XG4gIGlmICghY2hhdC5hY3RpdmUpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IGlucHV0UmVmID0gdXNlUmVmPEhUTUxUZXh0QXJlYUVsZW1lbnQ+KG51bGwpO1xuICBjb25zdCBtZXNzYWdlc1JlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4obnVsbCk7XG4gIGNvbnN0IGRyYWdSZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpO1xuXG4gIC8vIEF1dG8tc2Nyb2xsIG9uIG5ldyBtZXNzYWdlc1xuICB1c2VMYXlvdXRFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChtZXNzYWdlc1JlZi5jdXJyZW50KSB7XG4gICAgICBtZXNzYWdlc1JlZi5jdXJyZW50LnNjcm9sbFRvcCA9IG1lc3NhZ2VzUmVmLmN1cnJlbnQuc2Nyb2xsSGVpZ2h0O1xuICAgIH1cbiAgfSwgW2NoYXQubWVzc2FnZXMubGVuZ3RoLCBjaGF0Lm1lc3NhZ2VzW2NoYXQubWVzc2FnZXMubGVuZ3RoIC0gMV0/LmNvbnRlbnRdKTtcblxuICAvLyBEcmFnIGhhbmRsaW5nXG4gIGNvbnN0IG9uRHJhZ1N0YXJ0ID0gdXNlQ2FsbGJhY2soKGU6IFBvaW50ZXJFdmVudCkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBzdGFydFggPSBlLmNsaWVudFgsIHN0YXJ0WSA9IGUuY2xpZW50WTtcbiAgICBjb25zdCBvcmlnWCA9IGNoYXQucG9zaXRpb24ueCwgb3JpZ1kgPSBjaGF0LnBvc2l0aW9uLnk7XG5cbiAgICBmdW5jdGlvbiBvbk1vdmUoZTI6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgICAgdXBkYXRlQ2xhdWRlQ2hhdFBvc2l0aW9uKFxuICAgICAgICBvcmlnWCArIChlMi5jbGllbnRYIC0gc3RhcnRYKSxcbiAgICAgICAgb3JpZ1kgKyAoZTIuY2xpZW50WSAtIHN0YXJ0WSlcbiAgICAgICk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uVXAoKTogdm9pZCB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG9uTW92ZSk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCBvblVwKTtcbiAgICB9XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCBvbk1vdmUpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIG9uVXApO1xuICB9LCBbY2hhdC5wb3NpdGlvbi54LCBjaGF0LnBvc2l0aW9uLnldKTtcblxuICBmdW5jdGlvbiBoYW5kbGVTZW5kKCk6IHZvaWQge1xuICAgIGNvbnN0IHRleHQgPSBpbnB1dFJlZi5jdXJyZW50Py52YWx1ZT8udHJpbSgpO1xuICAgIGlmICghdGV4dCkgcmV0dXJuO1xuICAgIGlucHV0UmVmLmN1cnJlbnQhLnZhbHVlID0gJyc7XG4gICAgc2VuZENsYXVkZU1lc3NhZ2UodGV4dCk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVLZXlEb3duKGU6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgJiYgIWUuc2hpZnRLZXkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGhhbmRsZVNlbmQoKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzPVwiY2xhdWRlLWNoYXRcIlxuICAgICAgc3R5bGU9e3sgbGVmdDogY2hhdC5wb3NpdGlvbi54ICsgJ3B4JywgdG9wOiBjaGF0LnBvc2l0aW9uLnkgKyAncHgnIH19XG4gICAgPlxuICAgICAgPGRpdiBjbGFzcz1cImNjLXRpdGxlYmFyXCIgb25Qb2ludGVyRG93bj17b25EcmFnU3RhcnR9IHJlZj17ZHJhZ1JlZn0+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiY2MtdGl0bGVcIj5DbGF1ZGU8L3NwYW4+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBnYXA6ICc0cHgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBjbGFzcz1cImNjLXRlc3RcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyBpZiAoIWNoYXQuc3RyZWFtaW5nKSBzZW5kQ2xhdWRlTWVzc2FnZSgnV3JpdGUgYSB0aW55LCBzZWxmLWNvbnRhaW5lZCBIVE1MIHBhZ2UgKHdpdGggaW5saW5lIENTUywgbWFrZSBpdCBsb29rIG5pY2UpIGFuZCBkaXNwbGF5IGl0IHVzaW5nIHRoZSBkaXNwbGF5X3dlYnBhZ2UgdG9vbC4gS2VlcCBpdCB1bmRlciAyIHNlY29uZHMuJyk7IH19XG4gICAgICAgICAgICBkaXNhYmxlZD17Y2hhdC5zdHJlYW1pbmd9XG4gICAgICAgICAgICB0aXRsZT1cIlRlc3QgZGlzcGxheSBwYW5lbFwiXG4gICAgICAgICAgPnRlc3Q8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBjbGFzcz1cImNjLXRlc3RcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBkaXNwbGF5UGFuZWwudmFsdWUgPSB7IC4uLmRpc3BsYXlQYW5lbC52YWx1ZSwgYWN0aXZlOiB0cnVlLCB1cmk6ICdmaWxlOi8vL3RtcC9ub3RlYm91bmQtaW1nLXRlc3QuaHRtbCcgfTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICB0aXRsZT1cIlRlc3QgaWZyYW1lIHdpdGggbG9jYWwgZmlsZSArIGltYWdlc1wiXG4gICAgICAgICAgPmlmcmFtZTwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJjYy1jbG9zZVwiIG9uQ2xpY2s9e2Nsb3NlQ2xhdWRlQ2hhdH0+eDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImNjLW1lc3NhZ2VzXCIgcmVmPXttZXNzYWdlc1JlZn0+XG4gICAgICAgIHtjaGF0Lm1lc3NhZ2VzLm1hcCgobXNnLCBpKSA9PiAoXG4gICAgICAgICAgPGRpdiBrZXk9e2l9IGNsYXNzPXtgY2MtbXNnIGNjLW1zZy0tJHttc2cucm9sZX1gfT5cbiAgICAgICAgICAgIHttc2cucm9sZSA9PT0gJ2Fzc2lzdGFudCdcbiAgICAgICAgICAgICAgPyA8ZGl2IGNsYXNzPVwiY2MtYnViYmxlIGNjLWJ1YmJsZS0tYXNzaXN0YW50XCIgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiByZW5kZXJNYXJrZG93bihtc2cuY29udGVudCB8fCAnJykgfX0gLz5cbiAgICAgICAgICAgICAgOiA8ZGl2IGNsYXNzPVwiY2MtYnViYmxlIGNjLWJ1YmJsZS0tdXNlclwiPnttc2cuY29udGVudH08L2Rpdj5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSl9XG4gICAgICAgIHtjaGF0LnN0cmVhbWluZyAmJiAoXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNjLXR5cGluZ1wiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjYy10eXBpbmctZG90XCIgLz48c3BhbiBjbGFzcz1cImNjLXR5cGluZy1kb3RcIiAvPjxzcGFuIGNsYXNzPVwiY2MtdHlwaW5nLWRvdFwiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAgIHtjaGF0LmVycm9yICYmIDxkaXYgY2xhc3M9XCJjYy1lcnJvclwiPntjaGF0LmVycm9yfTwvZGl2Pn1cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImNjLWlucHV0LWJhclwiPlxuICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICByZWY9e2lucHV0UmVmfVxuICAgICAgICAgIGNsYXNzPVwiY2MtaW5wdXRcIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQXNrIGFib3V0IHlvdXIgbm90ZWJvb2suLi5cIlxuICAgICAgICAgIG9uS2V5RG93bj17aGFuZGxlS2V5RG93bn1cbiAgICAgICAgICByb3dzPXsxfVxuICAgICAgICAgIG9uSW5wdXQ9eyhlOiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcbiAgICAgICAgICAgIHRhcmdldC5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XG4gICAgICAgICAgICB0YXJnZXQuc3R5bGUuaGVpZ2h0ID0gTWF0aC5taW4odGFyZ2V0LnNjcm9sbEhlaWdodCwgODApICsgJ3B4JztcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiY2Mtc2VuZFwiIG9uQ2xpY2s9e2hhbmRsZVNlbmR9PlNlbmQ8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwKICAgICJpbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3ByZWFjdC9ob29rcyc7XG5pbXBvcnQgeyBkaXNwbGF5UGFuZWwsIHVwZGF0ZURpc3BsYXlQYW5lbFBvc2l0aW9uLCBjbG9zZURpc3BsYXlQYW5lbCB9IGZyb20gJy4vc3RvcmUudHMnO1xuaW1wb3J0IHR5cGUgeyBKU1ggfSBmcm9tICdwcmVhY3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gRGlzcGxheVBhbmVsKCk6IEpTWC5FbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IHBhbmVsID0gZGlzcGxheVBhbmVsLnZhbHVlO1xuICBpZiAoIXBhbmVsLmFjdGl2ZSB8fCAhcGFuZWwudXJpKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBvbkRyYWdTdGFydCA9IHVzZUNhbGxiYWNrKChlOiBQb2ludGVyRXZlbnQpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3Qgc3RhcnRYID0gZS5jbGllbnRYLCBzdGFydFkgPSBlLmNsaWVudFk7XG4gICAgY29uc3Qgb3JpZ1ggPSBwYW5lbC5wb3NpdGlvbi54LCBvcmlnWSA9IHBhbmVsLnBvc2l0aW9uLnk7XG5cbiAgICBmdW5jdGlvbiBvbk1vdmUoZTI6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xuICAgICAgdXBkYXRlRGlzcGxheVBhbmVsUG9zaXRpb24oXG4gICAgICAgIG9yaWdYICsgKGUyLmNsaWVudFggLSBzdGFydFgpLFxuICAgICAgICBvcmlnWSArIChlMi5jbGllbnRZIC0gc3RhcnRZKVxuICAgICAgKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25VcCgpOiB2b2lkIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgb25Nb3ZlKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIG9uVXApO1xuICAgIH1cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG9uTW92ZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgb25VcCk7XG4gIH0sIFtwYW5lbC5wb3NpdGlvbi54LCBwYW5lbC5wb3NpdGlvbi55XSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzcz1cImRpc3BsYXktcGFuZWxcIlxuICAgICAgc3R5bGU9e3sgbGVmdDogcGFuZWwucG9zaXRpb24ueCArICdweCcsIHRvcDogcGFuZWwucG9zaXRpb24ueSArICdweCcgfX1cbiAgICA+XG4gICAgICA8ZGl2IGNsYXNzPVwiZHAtdGl0bGViYXJcIiBvblBvaW50ZXJEb3duPXtvbkRyYWdTdGFydH0+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiZHAtdGl0bGVcIj5EaXNwbGF5PC9zcGFuPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiZHAtY2xvc2VcIiBvbkNsaWNrPXtjbG9zZURpc3BsYXlQYW5lbH0+eDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8aWZyYW1lIGNsYXNzPVwiZHAtaWZyYW1lXCIgc3JjPXtwYW5lbC51cml9IC8+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLAogICAgImltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZUxheW91dEVmZmVjdCwgdXNlUmVmIH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IGFwcFN0YXRlLCBqdW1wVG9QYWdlIH0gZnJvbSAnLi9zdG9yZS50cyc7XG5pbXBvcnQgdHlwZSB7IEpTWCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgdHlwZSB7IFBhZ2UgfSBmcm9tICcuL3R5cGVzLnRzJztcblxuaW50ZXJmYWNlIEZsYXRQYWdlIHtcbiAgcGFnZUlkOiBzdHJpbmc7XG4gIHBhZ2VUaXRsZTogc3RyaW5nO1xuICBzZWN0aW9uSWQ6IHN0cmluZztcbiAgc2VjdGlvblRpdGxlOiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGZsYXR0ZW5QYWdlcyhwYWdlczogUGFnZVtdLCBzZWN0aW9uSWQ6IHN0cmluZywgc2VjdGlvblRpdGxlOiBzdHJpbmcpOiBGbGF0UGFnZVtdIHtcbiAgY29uc3Qgb3V0OiBGbGF0UGFnZVtdID0gW107XG4gIGZvciAoY29uc3QgcCBvZiBwYWdlcykge1xuICAgIG91dC5wdXNoKHsgcGFnZUlkOiBwLmlkLCBwYWdlVGl0bGU6IHAudGl0bGUsIHNlY3Rpb25JZCwgc2VjdGlvblRpdGxlIH0pO1xuICAgIGlmIChwLmNoaWxkcmVuPy5sZW5ndGgpIG91dC5wdXNoKC4uLmZsYXR0ZW5QYWdlcyhwLmNoaWxkcmVuLCBzZWN0aW9uSWQsIHNlY3Rpb25UaXRsZSkpO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbmludGVyZmFjZSBRdWlja0p1bXBQcm9wcyB7XG4gIG9uQ2xvc2U6ICgpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBRdWlja0p1bXAoeyBvbkNsb3NlIH06IFF1aWNrSnVtcFByb3BzKTogSlNYLkVsZW1lbnQge1xuICBjb25zdCB7IG5vdGVib29rcywgdWkgfSA9IGFwcFN0YXRlLnZhbHVlO1xuICBjb25zdCBuYiA9IG5vdGVib29rcy5maW5kKG4gPT4gbi5pZCA9PT0gdWkubm90ZWJvb2tJZCk7XG5cbiAgY29uc3QgYWxsUGFnZXM6IEZsYXRQYWdlW10gPSBbXTtcbiAgaWYgKG5iKSB7XG4gICAgZm9yIChjb25zdCBzZWMgb2YgbmIuc2VjdGlvbnMpIHtcbiAgICAgIGFsbFBhZ2VzLnB1c2goLi4uZmxhdHRlblBhZ2VzKHNlYy5wYWdlcywgc2VjLmlkLCBzZWMudGl0bGUpKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBbcXVlcnksIHNldFF1ZXJ5XSA9IHVzZVN0YXRlPHN0cmluZz4oJycpO1xuICBjb25zdCBpbnB1dFJlZiA9IHVzZVJlZjxIVE1MSW5wdXRFbGVtZW50PihudWxsKTtcbiAgY29uc3QgbGlzdFJlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4obnVsbCk7XG5cbiAgY29uc3QgcSA9IHF1ZXJ5LnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCByZXN1bHRzID0gcVxuICAgID8gYWxsUGFnZXMuZmlsdGVyKHIgPT5cbiAgICAgICAgci5wYWdlVGl0bGUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxKSB8fFxuICAgICAgICByLnNlY3Rpb25UaXRsZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHEpXG4gICAgICApXG4gICAgOiBhbGxQYWdlcztcblxuICAvLyBEZWZhdWx0IGhpZ2hsaWdodDogY3VycmVudCBwYWdlIChvciAwKVxuICBjb25zdCBpbml0SWR4ID0gYWxsUGFnZXMuZmluZEluZGV4KHIgPT4gci5wYWdlSWQgPT09IHVpLnBhZ2VJZCk7XG4gIGNvbnN0IFthY3RpdmVJZHgsIHNldEFjdGl2ZUlkeF0gPSB1c2VTdGF0ZTxudW1iZXI+KE1hdGgubWF4KDAsIGluaXRJZHgpKTtcbiAgY29uc3QgY2xhbXBlZElkeCA9IE1hdGgubWluKGFjdGl2ZUlkeCwgcmVzdWx0cy5sZW5ndGggLSAxKTtcblxuICB1c2VFZmZlY3QoKCkgPT4geyBpbnB1dFJlZi5jdXJyZW50Py5mb2N1cygpOyB9LCBbXSk7XG4gIHVzZUVmZmVjdCgoKSA9PiB7IHNldEFjdGl2ZUlkeCgwKTsgfSwgW3F1ZXJ5XSk7XG5cbiAgLy8gU2Nyb2xsIGFjdGl2ZSByZXN1bHQgaW50byB2aWV3XG4gIHVzZUxheW91dEVmZmVjdCgoKSA9PiB7XG4gICAgbGlzdFJlZi5jdXJyZW50Py5jaGlsZHJlbltjbGFtcGVkSWR4XT8uc2Nyb2xsSW50b1ZpZXcoeyBibG9jazogJ25lYXJlc3QnIH0pO1xuICB9LCBbY2xhbXBlZElkeF0pO1xuXG4gIC8vIFNjcm9sbCB0byBjdXJyZW50IHBhZ2Ugb24gb3BlbiAoYmVmb3JlIGFueSBxdWVyeSlcbiAgdXNlTGF5b3V0RWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIXEpIGxpc3RSZWYuY3VycmVudD8uY2hpbGRyZW5bY2xhbXBlZElkeF0/LnNjcm9sbEludG9WaWV3KHsgYmxvY2s6ICdjZW50ZXInIH0pO1xuICB9LCBbXSk7XG5cbiAgZnVuY3Rpb24gc2VsZWN0KHJlc3VsdDogRmxhdFBhZ2UpOiB2b2lkIHtcbiAgICBqdW1wVG9QYWdlKHJlc3VsdC5zZWN0aW9uSWQsIHJlc3VsdC5wYWdlSWQpO1xuICAgIG9uQ2xvc2UoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUtleURvd24oZTogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBvbkNsb3NlKCk7IHJldHVybjsgfVxuICAgIGlmIChlLmtleSA9PT0gJ0Fycm93RG93bicpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBzZXRBY3RpdmVJZHgoaSA9PiBNYXRoLm1pbihpICsgMSwgcmVzdWx0cy5sZW5ndGggLSAxKSk7IHJldHVybjsgfVxuICAgIGlmIChlLmtleSA9PT0gJ0Fycm93VXAnKSAgIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBzZXRBY3RpdmVJZHgoaSA9PiBNYXRoLm1heChpIC0gMSwgMCkpOyByZXR1cm47IH1cbiAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgJiYgcmVzdWx0c1tjbGFtcGVkSWR4XSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IHNlbGVjdChyZXN1bHRzW2NsYW1wZWRJZHhdKTsgcmV0dXJuOyB9XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3M9XCJxai1vdmVybGF5XCIgb25Nb3VzZURvd249eyhlOiBNb3VzZUV2ZW50KSA9PiB7IGlmIChlLnRhcmdldCA9PT0gZS5jdXJyZW50VGFyZ2V0KSBvbkNsb3NlKCk7IH19PlxuICAgICAgPGRpdiBjbGFzcz1cInFqLW1vZGFsXCI+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHJlZj17aW5wdXRSZWZ9XG4gICAgICAgICAgY2xhc3M9XCJxai1pbnB1dFwiXG4gICAgICAgICAgcGxhY2Vob2xkZXI9XCJKdW1wIHRvIHBhZ2XigKZcIlxuICAgICAgICAgIHZhbHVlPXtxdWVyeX1cbiAgICAgICAgICBvbklucHV0PXsoZTogRXZlbnQpID0+IHNldFF1ZXJ5KChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSl9XG4gICAgICAgICAgb25LZXlEb3duPXtoYW5kbGVLZXlEb3dufVxuICAgICAgICAvPlxuICAgICAgICA8ZGl2IHJlZj17bGlzdFJlZn0gY2xhc3M9XCJxai1saXN0XCI+XG4gICAgICAgICAge3Jlc3VsdHMubWFwKChyLCBpKSA9PiAoXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGtleT17ci5wYWdlSWR9XG4gICAgICAgICAgICAgIGNsYXNzPXtbJ3FqLWl0ZW0nLCBpID09PSBjbGFtcGVkSWR4ICYmICdxai1pdGVtLS1hY3RpdmUnXS5maWx0ZXIoQm9vbGVhbikuam9pbignICcpfVxuICAgICAgICAgICAgICBvbk1vdXNlRG93bj17KCkgPT4gc2VsZWN0KHIpfVxuICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHNldEFjdGl2ZUlkeChpKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJxai1zZWN0aW9uXCI+e3Iuc2VjdGlvblRpdGxlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJxai1zZXBcIj7igLo8L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicWotdGl0bGVcIj57ci5wYWdlVGl0bGV9PC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgICAge3Jlc3VsdHMubGVuZ3RoID09PSAwICYmIDxkaXYgY2xhc3M9XCJxai1lbXB0eVwiPk5vIHBhZ2VzIGZvdW5kPC9kaXY+fVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwKICAgICJpbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCB7IGFwcFN0YXRlLCBjb25uZWN0ZWQsIGluaXRpYWxpemluZywgZWRpdGluZ0VuYWJsZWQsIGdldEFjdGl2ZVBhZ2UsIGZpbmRJblRyZWUsIHNldEFjdGl2ZVNlY3Rpb24sIHNldEFjdGl2ZVBhZ2UsIHByZWxvYWRQYWdlcywgZ2V0UHJlbG9hZENhbmRpZGF0ZXMgfSBmcm9tICcuL3N0b3JlLnRzJztcbmltcG9ydCB7IE5vdGVib29rQmFyIH0gZnJvbSAnLi9Ob3RlYm9va0Jhci50c3gnO1xuaW1wb3J0IHsgU2VjdGlvblBhbmVsIH0gZnJvbSAnLi9TZWN0aW9uUGFuZWwudHN4JztcbmltcG9ydCB7IFBhZ2VzUGFuZWwgfSBmcm9tICcuL1BhZ2VzUGFuZWwudHN4JztcbmltcG9ydCB7IENhbnZhcywgRm9ybWF0VG9vbGJhciB9IGZyb20gJy4vQ2FudmFzLnRzeCc7XG5pbXBvcnQgeyBDb250ZXh0TWVudSB9IGZyb20gJy4vQ29udGV4dE1lbnUudHN4JztcbmltcG9ydCB7IFdlbGNvbWVTY3JlZW4gfSBmcm9tICcuL1dlbGNvbWVTY3JlZW4udHN4JztcbmltcG9ydCB7IE5vdGVib29rU3dpdGNoZXIgfSBmcm9tICcuL05vdGVib29rU3dpdGNoZXIudHN4JztcbmltcG9ydCB7IExpbmtDb250ZXh0TWVudSB9IGZyb20gJy4vQmxvY2sudHN4JztcbmltcG9ydCB7IENsYXVkZUNoYXQgfSBmcm9tICcuL0NsYXVkZUNoYXQudHN4JztcbmltcG9ydCB7IERpc3BsYXlQYW5lbCB9IGZyb20gJy4vRGlzcGxheVBhbmVsLnRzeCc7XG5pbXBvcnQgeyBRdWlja0p1bXAgfSBmcm9tICcuL1F1aWNrSnVtcC50c3gnO1xuaW1wb3J0IHR5cGUgeyBQYWdlIH0gZnJvbSAnLi90eXBlcy50cyc7XG5pbXBvcnQgdHlwZSB7IEpTWCB9IGZyb20gJ3ByZWFjdCc7XG5cbi8vIG1hY09TIHVzZXMgQ21kIGFsb25lOyBMaW51eC9XaW5kb3dzIHVzZXMgQ3RybCtTaGlmdFxuY29uc3QgaXNNYWMgPSB0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiAvTWFjLy50ZXN0KG5hdmlnYXRvci5wbGF0Zm9ybSk7XG5mdW5jdGlvbiBpc05hdk1vZChlOiBLZXlib2FyZEV2ZW50KTogYm9vbGVhbiB7XG4gIGlmIChpc01hYykgcmV0dXJuIGUubWV0YUtleSAmJiAhZS5jdHJsS2V5ICYmICFlLmFsdEtleSAmJiAhZS5zaGlmdEtleTtcbiAgcmV0dXJuIGUuY3RybEtleSAmJiBlLnNoaWZ0S2V5ICYmICFlLm1ldGFLZXkgJiYgIWUuYWx0S2V5O1xufVxuXG5mdW5jdGlvbiBmbGF0UGFnZXMocGFnZXM6IFBhZ2VbXSk6IFBhZ2VbXSB7XG4gIGNvbnN0IG91dDogUGFnZVtdID0gW107XG4gIGZvciAoY29uc3QgcCBvZiBwYWdlcykge1xuICAgIG91dC5wdXNoKHApO1xuICAgIGlmIChwLmNoaWxkcmVuPy5sZW5ndGgpIG91dC5wdXNoKC4uLmZsYXRQYWdlcyhwLmNoaWxkcmVuKSk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gQnJhbmRIZWFkZXIoKTogSlNYLkVsZW1lbnQge1xuICByZXR1cm4gKFxuICAgIDxkaXYgaWQ9XCJicmFuZC1oZWFkZXJcIj5cbiAgICAgIDxpbWcgY2xhc3M9XCJicmFuZC1pY29uXCIgc3JjPVwiaWNvbi5zdmdcIiBhbHQ9XCJcIiAvPlxuICAgICAgPHNwYW4gY2xhc3M9XCJicmFuZC1uYW1lXCI+Tm90ZWJvdW5kPC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJicmFuZC1zZXBcIj7igJQ8L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImJyYW5kLXRhZ2xpbmVcIj5lbmpveSBjb2xvdXIgYWdhaW48L3NwYW4+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBBcHAoKTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgW3Nob3dKdW1wLCBzZXRTaG93SnVtcF0gPSB1c2VTdGF0ZTxib29sZWFuPihmYWxzZSk7XG5cbiAgLy8gUHJlbG9hZCBuZWlnaGJvdXJpbmcgcGFnZXMgb25jZSB0aGUgYXBwIGlzIGlkbGUgYWZ0ZXIgaW5pdGlhbCByZW5kZXJcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBpZCA9IHJlcXVlc3RJZGxlQ2FsbGJhY2soKCkgPT4gcHJlbG9hZFBhZ2VzKGdldFByZWxvYWRDYW5kaWRhdGVzKCkpLCB7IHRpbWVvdXQ6IDIwMDAgfSk7XG4gICAgcmV0dXJuICgpID0+IGNhbmNlbElkbGVDYWxsYmFjayhpZCk7XG4gIH0sIFtjb25uZWN0ZWQudmFsdWVdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGZ1bmN0aW9uIG9uS2V5KGU6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgICAgY29uc3QgZWRpdGluZyA9IHRhcmdldC5pc0NvbnRlbnRFZGl0YWJsZVxuICAgICAgICB8fCB0YXJnZXQudGFnTmFtZSA9PT0gJ0lOUFVUJ1xuICAgICAgICB8fCB0YXJnZXQudGFnTmFtZSA9PT0gJ1RFWFRBUkVBJztcblxuICAgICAgLy8gQ21kK0sgLyBDdHJsK1NoaWZ0K0s6IHF1aWNrIGp1bXAgKHdvcmtzIGV2ZW4gd2hlbiBlZGl0aW5nIGlzIGZhbHNlKVxuICAgICAgaWYgKCFlZGl0aW5nICYmIGlzTmF2TW9kKGUpICYmIChlLmtleSA9PT0gJ2snIHx8IGUua2V5ID09PSAnSycpKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgc2V0U2hvd0p1bXAodiA9PiAhdik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gUmVtYWluaW5nIG5hdiBzaG9ydGN1dHMgb25seSBmaXJlIHdoZW4gbm90IGVkaXRpbmcgdGV4dFxuICAgICAgaWYgKGVkaXRpbmcpIHJldHVybjtcbiAgICAgIGlmICghaXNOYXZNb2QoZSkpIHJldHVybjtcblxuICAgICAgY29uc3QgeyB1aSwgbm90ZWJvb2tzIH0gPSBhcHBTdGF0ZS52YWx1ZTtcbiAgICAgIGNvbnN0IG5iID0gbm90ZWJvb2tzLmZpbmQobiA9PiBuLmlkID09PSB1aS5ub3RlYm9va0lkKTtcbiAgICAgIGlmICghbmIpIHJldHVybjtcblxuICAgICAgLy8gQ21kK0xlZnQgLyBDbWQrUmlnaHQ6IHByZXZpb3VzIC8gbmV4dCBzZWN0aW9uXG4gICAgICBpZiAoZS5rZXkgPT09ICdBcnJvd0xlZnQnIHx8IGUua2V5ID09PSAnQXJyb3dSaWdodCcpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBkaXIgPSBlLmtleSA9PT0gJ0Fycm93TGVmdCcgPyAtMSA6IDE7XG4gICAgICAgIGNvbnN0IGlkeCA9IG5iLnNlY3Rpb25zLmZpbmRJbmRleChzID0+IHMuaWQgPT09IHVpLnNlY3Rpb25JZCk7XG4gICAgICAgIGNvbnN0IG5leHQgPSBuYi5zZWN0aW9uc1tpZHggKyBkaXJdO1xuICAgICAgICBpZiAobmV4dCkgc2V0QWN0aXZlU2VjdGlvbihuZXh0LmlkKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBDbWQrVXAgLyBDbWQrRG93bjogcHJldmlvdXMgLyBuZXh0IHBhZ2UgKGZsYXQgb3JkZXIsIHJlc3BlY3RzIHRyZWUpXG4gICAgICBpZiAoZS5rZXkgPT09ICdBcnJvd1VwJyB8fCBlLmtleSA9PT0gJ0Fycm93RG93bicpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBzZWMgPSBuYi5zZWN0aW9ucy5maW5kKHMgPT4gcy5pZCA9PT0gdWkuc2VjdGlvbklkKTtcbiAgICAgICAgaWYgKCFzZWMpIHJldHVybjtcbiAgICAgICAgY29uc3QgZmxhdCA9IGZsYXRQYWdlcyhzZWMucGFnZXMpO1xuICAgICAgICBjb25zdCBpZHggPSBmbGF0LmZpbmRJbmRleChwID0+IHAuaWQgPT09IHVpLnBhZ2VJZCk7XG4gICAgICAgIGNvbnN0IGRpciA9IGUua2V5ID09PSAnQXJyb3dVcCcgPyAtMSA6IDE7XG4gICAgICAgIGNvbnN0IG5leHQgPSBmbGF0W2lkeCArIGRpcl07XG4gICAgICAgIGlmIChuZXh0KSBzZXRBY3RpdmVQYWdlKG5leHQuaWQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5KTtcbiAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5KTtcbiAgfSwgW10pO1xuXG4gIGlmIChpbml0aWFsaXppbmcudmFsdWUpIHJldHVybiBudWxsO1xuICBpZiAoIWNvbm5lY3RlZC52YWx1ZSkgcmV0dXJuIDxXZWxjb21lU2NyZWVuIC8+O1xuXG4gIGNvbnN0IHN0YXRlID0gYXBwU3RhdGUudmFsdWU7XG4gIGNvbnN0IHsgbm90ZWJvb2tzLCB1aSB9ID0gc3RhdGU7XG4gIGNvbnN0IG5iID0gbm90ZWJvb2tzLmZpbmQobiA9PiBuLmlkID09PSB1aS5ub3RlYm9va0lkKTtcbiAgY29uc3Qgc2VjID0gbmI/LnNlY3Rpb25zLmZpbmQocyA9PiBzLmlkID09PSB1aS5zZWN0aW9uSWQpO1xuICBjb25zdCBwYWdlID0gc2VjID8gZmluZEluVHJlZShzZWMucGFnZXMsIHVpLnBhZ2VJZCkgOiBudWxsO1xuXG4gIGNvbnN0IFNFQ1RJT05fQ09MT1JTID0gW1xuICAgICcjZmNlNGI4JywgJyNiOGQ0ZjAnLCAnI2M4ZTZjMCcsICcjZjBjMGMwJyxcbiAgICAnI2Q4YzhmMCcsICcjZjBkOGIwJywgJyNiOGUwZTAnLCAnI2YwYzhlMCcsXG4gIF07XG4gIGNvbnN0IHNlY0lkeCA9IG5iPy5zZWN0aW9ucy5maW5kSW5kZXgocyA9PiBzLmlkID09PSB1aS5zZWN0aW9uSWQpID8/IDA7XG4gIGNvbnN0IHNlY3Rpb25Db2xvciA9IG5iID8gU0VDVElPTl9DT0xPUlNbc2VjSWR4ICUgU0VDVElPTl9DT0xPUlMubGVuZ3RoXSA6ICcjZThlOGU4JztcblxuICBjb25zdCBlZGl0aW5nID0gZWRpdGluZ0VuYWJsZWQudmFsdWU7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAge2VkaXRpbmcgJiYgPEZvcm1hdFRvb2xiYXIgLz59XG4gICAgICA8U2VjdGlvblBhbmVsIC8+XG4gICAgICA8ZGl2IGlkPVwiYm9keS1yb3dcIj5cbiAgICAgICAgey8qIHtlZGl0aW5nICYmIDxOb3RlYm9va0JhciAvPn0gKi99XG4gICAgICAgIDxkaXYgaWQ9XCJzZWN0aW9uLWRlc2tcIiBzdHlsZT17eyBiYWNrZ3JvdW5kOiBzZWN0aW9uQ29sb3IgfX0+XG4gICAgICAgICAgPGRpdiBpZD1cImNhbnZhcy1hcmVhXCI+XG4gICAgICAgICAgICA8Q2FudmFzIHBhZ2U9e3BhZ2V9IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPFBhZ2VzUGFuZWwgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxDb250ZXh0TWVudSAvPlxuICAgICAge2VkaXRpbmcgJiYgPE5vdGVib29rU3dpdGNoZXIgLz59XG4gICAgICA8TGlua0NvbnRleHRNZW51IC8+XG4gICAgICB7ZWRpdGluZyAmJiA8Q2xhdWRlQ2hhdCAvPn1cbiAgICAgIHtlZGl0aW5nICYmIDxEaXNwbGF5UGFuZWwgLz59XG4gICAgICB7c2hvd0p1bXAgJiYgPFF1aWNrSnVtcCBvbkNsb3NlPXsoKSA9PiBzZXRTaG93SnVtcChmYWxzZSl9IC8+fVxuICAgIDwvPlxuICApO1xufVxuIiwKICAgICJpbXBvcnQgeyByZW5kZXIgfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgQXBwIH0gZnJvbSAnLi9BcHAudHN4JztcblxuLy8gU3VwcHJlc3MgZGVmYXVsdCBicm93c2VyIGNvbnRleHQgbWVudSBvbiB0aGUgZW50aXJlIGFwcFxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpIS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIChlOiBFdmVudCkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG59KTtcblxuLy8gRGlzYWJsZSBtaWRkbGUtY2xpY2sgcGFzdGVcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChlOiBNb3VzZUV2ZW50KSA9PiB7IGlmIChlLmJ1dHRvbiA9PT0gMSkgZS5wcmV2ZW50RGVmYXVsdCgpOyB9KTtcblxucmVuZGVyKDxBcHAgLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKSEpO1xuIgogIF0sCiAgIm1hcHBpbmdzIjogIjtBQUtBLElBQUksaUJBQXFEO0FBQ3pELElBQUksYUFBa0MsSUFBSTtBQUUxQyxPQUFPLFdBQVc7QUFBQSxFQUNoQixjQUFjO0FBQUEsRUFHZCxXQUFXLGFBQWEsRUFBRSxVQUFVLFdBQVcsY0FBYyxnQkFBZ0I7QUFBQSxFQUc3RSxnQkFBZ0IsQ0FBQyxPQUFrQztBQUFBLElBQUUsaUJBQWlCO0FBQUE7QUFBQSxFQUN0RSxjQUFjLE1BQU07QUFBQSxFQUNwQixjQUFjLE1BQU07QUFBQSxFQUNwQixpQkFBaUIsTUFBTTtBQUFBLEVBQ3ZCLGVBQWUsTUFBTTtBQUFBLEVBR3JCLFNBQVMsT0FBTyxTQUF5QztBQUFBLElBQ3ZELElBQUksV0FBVyxJQUFJLElBQUk7QUFBQSxNQUFHLE9BQU8sV0FBVyxJQUFJLElBQUk7QUFBQSxJQUNwRCxJQUFJO0FBQUEsTUFDRixNQUFNLE9BQU8sTUFBTSxNQUFNLFdBQVcsSUFBSTtBQUFBLE1BQ3hDLElB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QUUsS0FBRSxFQUFFLENBQUMsR0FBRSxFQUFDO0FBQUEsSUFBRSxHQUFFLE1BQUksR0FBRSxNQUFJLEdBQUUsRUFBRSxTQUFPLEVBQUUsTUFBTSxFQUFDLEdBQUUsRUFBRSxHQUFFLEtBQUksSUFBRSxJQUFFLEdBQUUsS0FBSSxHQUFFLElBQUksY0FBYSxLQUFHLEdBQUUsTUFBSSxDQUFDLEVBQUMsSUFBRSxNQUFLLElBQVEsTUFBTixPQUFRLEVBQUUsRUFBQyxJQUFFLElBQUUsQ0FBQyxFQUFFLEtBQUcsR0FBRSxNQUFLLEVBQUMsR0FBRSxHQUFFLE1BQUksR0FBRSxLQUFJLEdBQUUsR0FBRyxJQUFJLEdBQUUsT0FBSyxJQUFFLEVBQUUsSUFBRSxJQUFFLEVBQUMsR0FBRSxHQUFFLE1BQUksR0FBRSxLQUFHLE1BQUssR0FBRSxPQUFLLE1BQUcsRUFBRSxFQUFDO0FBQUEsRUFBQztBQUFBO0FBQUUsU0FBUyxDQUFDLENBQUMsSUFBRTtBQUFBLEVBQUMsS0FBVSxLQUFFLEdBQUUsT0FBWCxRQUFzQixHQUFFLE9BQVI7QUFBQSxJQUFZLE9BQU8sR0FBRSxNQUFJLEdBQUUsSUFBSSxPQUFLLE1BQUssR0FBRSxJQUFJLEtBQUssUUFBUSxDQUFDLElBQUU7QUFBQSxNQUFDLElBQVMsTUFBTixRQUFlLEdBQUUsT0FBUjtBQUFBLFFBQVksT0FBTyxHQUFFLE1BQUksR0FBRSxJQUFJLE9BQUssR0FBRTtBQUFBLEtBQUksR0FBRSxFQUFFLEVBQUM7QUFBQTtBQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUU7QUFBQSxHQUFFLENBQUMsR0FBRSxRQUFNLEdBQUUsTUFBSSxTQUFLLEVBQUUsS0FBSyxFQUFDLEtBQUcsQ0FBQyxFQUFFLFNBQU8sS0FBRyxFQUFFLHdCQUFzQixJQUFFLEVBQUUsc0JBQW9CLEdBQUcsQ0FBQztBQUFBO0FBQUUsU0FBUyxDQUFDLEdBQUU7QUFBQSxFQUFDLFNBQVEsSUFBRSxLQUFFLEVBQUUsRUFBRTtBQUFBLElBQVEsRUFBRSxTQUFPLE1BQUcsRUFBRSxLQUFLLENBQUMsR0FBRSxLQUFFLEVBQUUsTUFBTSxHQUFFLEtBQUUsRUFBRSxRQUFPLEVBQUUsRUFBQztBQUFBLEVBQUUsRUFBRSxNQUFJO0FBQUE7QUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFFLElBQUUsSUFBRSxJQUFFLElBQUUsSUFBRSxJQUFFLElBQUUsSUFBRSxJQUFFLElBQUU7QUFBQSxFQUFDLElBQUksSUFBRSxJQUFFLElBQUUsSUFBRSxJQUFFLElBQUUsSUFBRSxLQUFFLE1BQUcsR0FBRSxPQUFLLEdBQUUsSUFBRSxHQUFFO0FBQUEsRUFBTyxLQUFJLEtBQUUsRUFBRSxJQUFFLElBQUUsSUFBRSxJQUFFLENBQUMsR0FBRSxLQUFFLEVBQUUsS0FBRSxHQUFFO0FBQUEsS0FBVyxLQUFFLEdBQUUsSUFBSSxRQUFmLFNBQXFCLEtBQU0sR0FBRSxPQUFOLE1BQVcsR0FBRSxHQUFFLFFBQU0sR0FBRSxHQUFFLE1BQUksSUFBRSxLQUFFLEVBQUUsSUFBRSxJQUFFLElBQUUsSUFBRSxJQUFFLElBQUUsSUFBRSxJQUFFLElBQUUsRUFBQyxHQUFFLEtBQUUsR0FBRSxLQUFJLEdBQUUsT0FBSyxHQUFFLE9BQUssR0FBRSxRQUFNLEdBQUUsT0FBSyxFQUFFLEdBQUUsS0FBSSxNQUFLLEVBQUMsR0FBRSxHQUFFLEtBQUssR0FBRSxLQUFJLEdBQUUsT0FBSyxJQUFFLEVBQUMsSUFBUyxNQUFOLFFBQWUsTUFBTixTQUFVLEtBQUUsTUFBSSxLQUFFLENBQUMsRUFBRSxJQUFFLEdBQUUsU0FBTyxHQUFFLFFBQU0sR0FBRSxNQUFJLEtBQUUsRUFBRSxJQUFFLElBQUUsSUFBRSxFQUFDLElBQWMsT0FBTyxHQUFFLFFBQXJCLGNBQW9DLE9BQUosWUFBTSxLQUFFLEtBQUUsT0FBSSxLQUFFLEdBQUUsY0FBYSxHQUFFLE9BQUs7QUFBQSxFQUFJLE9BQU8sR0FBRSxNQUFJLElBQUU7QUFBQTtBQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUUsSUFBRSxJQUFFLElBQUUsSUFBRTtBQUFBLEVBQUMsSUFBSSxJQUFFLElBQUUsSUFBRSxJQUFFLElBQUUsS0FBRSxHQUFF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LE1BQUksR0FBRSxNQUFJLEdBQUUsS0FBRztBQUFBLFFBQU0sT0FBTSxJQUFFO0FBQUEsUUFBQyxJQUFHLEdBQUUsTUFBSSxNQUFLLE1BQVMsTUFBTjtBQUFBLFVBQVEsSUFBRyxHQUFFLE1BQUs7QUFBQSxZQUFDLEtBQUksR0FBRSxPQUFLLEtBQUUsTUFBSSxJQUFJLE1BQU0sR0FBRSxZQUFMLEtBQWUsR0FBRTtBQUFBLGNBQWEsS0FBRSxHQUFFO0FBQUEsWUFBWSxHQUFFLEdBQUUsUUFBUSxFQUFDLEtBQUcsTUFBSyxHQUFFLE1BQUk7QUFBQSxVQUFDLEVBQUs7QUFBQSxZQUFDLEtBQUksSUFBRSxHQUFFLE9BQU87QUFBQSxjQUFLLEVBQUUsR0FBRSxFQUFFO0FBQUEsWUFBRSxFQUFFLEVBQUM7QUFBQTtBQUFBLFFBQU87QUFBQSxhQUFFLE1BQUksR0FBRSxLQUFJLEdBQUUsTUFBSSxHQUFFLEtBQUksR0FBRSxRQUFNLEVBQUUsRUFBQztBQUFBLFFBQUUsRUFBRSxJQUFJLElBQUUsSUFBRSxFQUFDO0FBQUE7QUFBQSxJQUFPO0FBQUEsTUFBTSxNQUFOLFFBQVMsR0FBRSxPQUFLLEdBQUUsT0FBSyxHQUFFLE1BQUksR0FBRSxLQUFJLEdBQUUsTUFBSSxHQUFFLE9BQUssS0FBRSxHQUFFLE1BQUksRUFBRSxHQUFFLEtBQUksSUFBRSxJQUFFLElBQUUsSUFBRSxJQUFFLElBQUUsSUFBRSxFQUFDO0FBQUEsRUFBRSxRQUFPLEtBQUUsRUFBRSxXQUFTLEdBQUUsRUFBQyxHQUFFLE1BQUksR0FBRSxNQUFTLFlBQUU7QUFBQTtBQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUU7QUFBQSxFQUFDLE9BQUksR0FBRSxRQUFNLEdBQUUsSUFBSSxNQUFJLE9BQUksR0FBRSxPQUFLLEdBQUUsSUFBSSxLQUFLLENBQUM7QUFBQTtBQUFHLFNBQVMsQ0FBQyxDQUFDLElBQUUsSUFBRSxJQUFFO0FBQUEsRUFBQyxTQUFRLEtBQUUsRUFBRSxLQUFFLEdBQUUsUUFBTztBQUFBLElBQUksRUFBRSxHQUFFLEtBQUcsR0FBRSxFQUFF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LEdBQUUsS0FBRyxDQUFDLEtBQUUsR0FBRSxFQUFDLElBQUUsR0FBTyxXQUFFLEVBQUMsR0FBRSxRQUFRLENBQUMsSUFBRTtBQUFBLElBQUMsSUFBSSxLQUFFLEdBQUUsTUFBSSxHQUFFLElBQUksS0FBRyxHQUFFLEdBQUcsSUFBRyxLQUFFLEdBQUUsRUFBRSxJQUFFLEVBQUM7QUFBQSxJQUFFLE9BQUksT0FBSSxHQUFFLE1BQUksQ0FBQyxJQUFFLEdBQUUsR0FBRyxFQUFFLEdBQUUsR0FBRSxJQUFJLFNBQVMsQ0FBQyxDQUFDO0FBQUEsR0FBRyxHQUFFLEdBQUUsTUFBSSxJQUFFLENBQUMsR0FBRSxNQUFLO0FBQUEsSUFBQyxJQUFJLEtBQUUsUUFBUSxDQUFDLElBQUUsSUFBRSxJQUFFO0FBQUEsTUFBQyxJQUFHLENBQUMsR0FBRSxJQUFJO0FBQUEsUUFBSSxPQUFNO0FBQUEsTUFBRyxJQUFJLEtBQUUsR0FBRSxJQUFJLElBQUksR0FBRyxPQUFPLFFBQVEsQ0FBQyxJQUFFO0FBQUEsUUFBQyxPQUFPLEdBQUU7QUFBQSxPQUFJO0FBQUEsTUFBRSxJQUFHLEdBQUUsTUFBTSxRQUFRLENBQUMsSUFBRTtBQUFBLFFBQUMsT0FBTSxDQUFDLEdBQUU7QUFBQSxPQUFJO0FBQUEsUUFBRSxPQUFNLENBQUMsTUFBRyxHQUFFLEtBQUssTUFBSyxJQUFFLElBQUUsRUFBQztBQUFBLE1BQUUsSUFBSSxLQUFFLEdBQUUsSUFBSSxVQUFRO0FBQUEsTUFBRSxPQUFPLEdBQUUsS0FBSyxRQUFRLENBQUMsSUFBRTtBQUFBLFFBQUMsSUFBRyxHQUFFLEtBQUk7QUFBQSxVQUFDLElBQUksS0FBRSxHQUFFLEdBQUc7QUFBQSxVQUFHLEdBQUUsS0FBRyxHQUFFLEtBQUksR0FBRSxNQUFTLFdBQUUsT0FBSSxHQUFFLEdBQUcsT0FBSyxLQUFFO0FBQUEsUUFBRztBQUFBLE9BQUUsR0FBRSxNQUFHLEdBQUUsS0FBSyxNQUFLLElBQUUsSUFBRSxFQUFDLEtBQUc7QUFBQTtBQUFBLElBQUcsR0FBRSxNQUFJO0FBQUEsSUFBRyxNQUFRLHVCQUFKLElBQThCLHFCQUFKLE9BQUU7QUFBQSxJQUFzQixHQUFFLHNCQUFvQixRQUFRLENBQUMsSUFBRSxJQUFFLElBQUU7QUFBQSxNQUFDLElBQUcsS0FBSyxLQUFJO0FBQUEsUUFBQyxJQUFJLEtBQUU7QUFBQSxRQUFFLEtBQU8sV0FBRSxHQUFFLElBQUUsSUFBRSxFQUFDLEdBQUUsS0FBRTtBQUFBLE1BQUM7QUFBQSxNQUFDLE1BQUcsR0FBRSxLQUFLLE1BQUssSUFBRSxJQUFFLEVBQUM7QUFBQSxPQUFHLEdBQUUsd0JBQXNCO0FBQUEsRUFBQztBQUFBLEVBQUMsT0FBTyxHQUFFLE9BQUssR0FBRTtBQUFBO0FBQUcsU0FBUyxFQUFDLENBQUMsSUFBRSxJQUFFO0FBQUEsRUFBQyxJQUFJLEtBQUUsR0FBRSxNQUFJLENBQUM7QUFBQSxFQUFFLENBQUMsR0FBRSxPQUFLLEdBQUUsR0FBRSxLQUFJLEVBQUMsTUFBSSxHQUFFLEtBQUcsSUFBRSxHQUFFLElBQUUsSUFBRSxHQUFFLElBQUksSUFBSSxLQUFLLEVBQUM7QUFBQTtBQUFHLFNBQVMsRUFBQyxDQUFDLElBQUUsSUFBRTtBQUFBLEVBQUMsSUFBSSxLQUFFLEdBQUUsTUFBSSxDQUFDO0FBQUEsRUFBRSxDQUFDLEdBQUUsT0FBSyxHQUFFLEdBQUUsS0FBSSxFQUFDLE1BQUksR0FBRSxLQUFHLElBQUUsR0FBRSxJQUFFLElBQUUsR0FBRSxJQUFJLEtBQUssRUFBQztBQUFBO0FBQUcsU0FBUyxFQUFDLENBQUMsSUFBRTtBQUFBLEVBQUMsT0FBTyxLQUFFLEdBQUUsR0FBRSxRQUFRLEdBQUU7QUFBQSxJQUFDLE9BQU0sRUFBQyxTQUFRLEdBQUM7QUFBQSxLQUFHLENBQUMsQ0FBQztBQUFBO0FBQXVOLFNBQVMsRUFBQyxDQUFDLElBQUUsSUFBRTtBQUFBLEVBQUMsSUFBSSxLQUFFLEdBQUUsTUFBSSxDQUFDO0FBQUEsRUFBRSxPQUFPLEdBQUUsR0FBRSxLQUFJLEVBQUMsTUFBSSxHQUFFLEtBQUcsR0FBRSxHQUFFLEdBQUUsTUFBSSxJQUFFLEdBQUUsTUFBSSxLQUFHLEdBQUU7QUFBQTtBQUFHLFNBQVMsRUFBQyxDQUFDLElBQUUsSUFBRTtBQUFBLEVBQUMsT0FBTyxLQUFFLEdBQUUsR0FBRSxRQUFRLEdBQUU7QUFBQSxJQUFDLE9BQU87QUFBQSxLQUFHLEVBQUM7QUFBQTtBQUFFLFNBQVMsRUFBQyxDQUFDLElBQUU7QUFBQSxFQUFDLElBQUksS0FBRSxHQUFFLFFBQVEsR0FBRSxNQUFLLEtBQUUsR0FBRSxNQUFJLENBQUM7QUFBQSxFQUFFLE9BQU8sR0FBRSxJQUFFLElBQUUsTUFBUyxHQUFFLE1BQVIsU0FBYSxHQUFFLEtBQUcsTUFBRyxHQUFFLElBQUksRUFBQyxJQUFHLEdBQUUsTUFBTSxTQUFPLEdBQUU7QUFBQTtBQUErWCxTQUFTLEVBQUMsR0FBRTtBQUFBLEVBQUMsU0FBUSxHQUFFLEtBQUUsR0FBRSxNQUFNLEtBQUc7QUFBQSxJQUFDLElBQUksS0FBRSxHQUFFO0FBQUEsSUFBSSxJQUFHLEdBQUUsT0FBSztBQUFBLE1BQUUsSUFBRztBQUFBLFFBQUMsR0FBRSxJQUFJLEtBQUssRUFBQyxHQUFFLEdBQUUsSUFBSSxLQUFLLEVBQUMsR0FBRSxHQUFFLE1BQUksQ0FBQztBQUFBLFFBQUUsT0FBTSxJQUFFO0FBQUEsUUFBQyxHQUFFLE1BQUksQ0FBQyxHQUFFLEdBQUUsSUFBSSxJQUFFLEdBQUUsR0FBRztBQUFBO0FBQUEsRUFBRTtBQUFBO0FBQUUsR0FBRSxNQUFJLFFBQVEsQ0FBQyxJQUFFO0FBQUEsRUFBQyxLQUFFLE1BQUssTUFBRyxHQUFFLEVBQUM7QUFBQSxHQUFHLEdBQUUsS0FBRyxRQUFRLENBQUMsSUFBRSxJQUFFO0FBQUEsRUFBQyxNQUFHLEdBQUUsT0FBSyxHQUFFLElBQUksUUFBTSxHQUFFLE1BQUksR0FBRSxJQUFJLE1BQUssTUFBRyxHQUFFLElBQUUsRUFBQztBQUFBLEdBQUcsR0FBRSxNQUFJLFFBQVEsQ0FBQyxJQUFFO0FBQUEsRUFBQyxNQUFHLEdBQUUsRUFBQyxHQUFFLEtBQUU7QUFBQSxFQUFFLElBQUksTUFBRyxLQUFFLEdBQUUsS0FBSztBQUFBLEVBQUksT0FBSSxPQUFJLE1BQUcsR0FBRSxNQUFJLENBQUMsR0FBRSxHQUFFLE1BQUksQ0FBQyxHQUFFLEdBQUUsR0FBRyxLQUFLLFFBQVEsQ0FBQyxJQUFFO0FBQUEsSUFBQyxHQUFFLFFBQU0sR0FBRSxLQUFHLEdBQUUsTUFBSyxHQUFFLElBQUUsR0FBRSxNQUFTO0FBQUEsR0FBRSxNQUFJLEdBQUUsSUFBSSxLQUFLLEVBQUMsR0FBRSxHQUFFLElBQUksS0FBSyxFQUFDLEdBQUUsR0FBRSxNQUFJLENBQUMsR0FBRSxLQUFFLEtBQUksS0FBRTtBQUFBLEdBQUcsR0FBRSxTQUFPLFFBQVEsQ0FBQyxJQUFFO0FBQUEsRUFBQyxNQUFHLEdBQUUsRUFBQztBQUFBLEVBQUUsSUFBSSxLQUFFLEdBQUU7QUFBQSxFQUFJLE1BQUcsR0FBRSxRQUFNLEdBQUUsSUFBSSxJQUFJLFdBQWEsR0FBRSxLQUFLLEVBQUMsTUFBWixLQUFlLE9BQUksR0FBRSwyQkFBeUIsS0FBRSxHQUFFLDBCQUF3QixJQUFHLEVBQUMsSUFBRyxHQUFFLElBQUksR0FBRyxLQUFLLFFBQVEsQ0FBQyxJQUFFO0FBQUEsSUFBQyxHQUFFLE1BQUksR0FBRSxNQUFJLEdBQUUsSUFBRyxHQUFFLElBQU87QUFBQSxHQUFFLElBQUcsS0FBRSxLQUFFO0FBQUEsR0FBTSxHQUFFLE1BQUksUUFBUSxDQUFDLElBQUUsSUFBRTtBQUFBLEVBQUMsR0FBRSxLQUFLLFFBQVEsQ0FBQyxJQUFFO0FBQUEsSUFBQyxJQUFHO0FBQUEsTUFBQyxHQUFFLElBQUksS0FBSyxFQUFDLEdBQUUsR0FBRSxNQUFJLEdBQUUsSUFBSSxPQUFPLFFBQVEsQ0FBQyxJQUFFO0FBQUEsUUFBQyxPQUFNLENBQUMsR0FBRSxNQUFJLEdBQUUsRUFBQztBQUFBLE9BQUU7QUFBQSxNQUFFLE9BQU0sSUFBRTtBQUFBLE1BQUMsR0FBRSxLQUFLLFFBQVEsQ0FBQyxJQUFFO0FBQUEsUUFBQyxHQUFFLFFBQU0sR0FBRSxNQUFJLENBQUM7QUFBQSxPQUFHLEdBQUUs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QUFJLEtBQUU7QUFBQSxFQUFLLE9BQU8sR0FBRSxRQUFRLEdBQUU7QUFBQSxJQUFDLElBQUksS0FBRSxHQUFFLE9BQU0sS0FBRTtBQUFBLElBQUUsS0FBTztBQUFBLElBQUUsSUFBRztBQUFBLE1BQUMsR0FBRSxFQUFDO0FBQUEsY0FBRTtBQUFBLE1BQVEsS0FBRTtBQUFBO0FBQUEsS0FBSSxFQUFDLE1BQUssTUFBSyxDQUFDO0FBQUE7QUFBRyxHQUFFLFVBQVUsVUFBUSxRQUFRLEdBQUU7QUFBQSxFQUFDLE9BQU8sS0FBSztBQUFBO0FBQU8sR0FBRSxVQUFVLFdBQVMsUUFBUSxHQUFFO0FBQUEsRUFBQyxPQUFPLEtBQUssUUFBTTtBQUFBO0FBQUksR0FBRSxVQUFVLFNBQU8sUUFBUSxHQUFFO0FBQUEsRUFBQyxPQUFPLEtBQUs7QUFBQTtBQUFPLEdBQUUsVUFBVSxPQUFLLFFBQVEsR0FBRTtBQUFBLEVBQUMsSUFBSSxLQUFFO0FBQUEsRUFBRSxLQUFPO0FBQUEsRUFBRSxJQUFHO0FBQUEsSUFBQyxPQUFPLEtBQUs7QUFBQSxZQUFNO0FBQUEsSUFBUSxLQUFFO0FBQUE7QUFBQTtBQUFJLE9BQU8sZUFBZSxHQUFFLFdBQVUsU0FBUSxFQUFDLEtBQUksUUFBUSxHQUFFO0FBQUEsRUFBQyxJQUFJLEtBQUUsR0FBRSxJQUFJO0FBQUEsRUFBRSxJQUFZLE9BQUo7QUFBQSxJQUFNLEdBQUUsSUFBRSxLQUFLO0FBQUEsRUFBRSxPQUFPLEtBQUs7QUFBQSxHQUFHLEtBQUksUUFBUSxDQUFDLElBQUU7QUFBQSxFQUFDLElBQUcsT0FBSSxLQUFLLEdBQUU7QUFBQSxJQUFDLElBQUcsS0FBRTtBQUFBLE1BQUksTUFBTSxJQUFJLE1BQU0sZ0JBQWdCO0FBQUEsSUFBRSxLQUFLLElBQUU7QUFBQSxJQUFFLEtBQUs7QUFBQSxJQUFJO0FBQUEsSUFBSTtBQUFBLElBQUksSUFBRztBQUFBLE1BQUMsU0FBUSxLQUFFLEtBQUssRUFBVyxPQUFKLFdBQU0sS0FBRSxHQUFFO0FBQUEsUUFBRSxHQUFFLEVBQUUsRUFBRTtBQUFBLGNBQUU7QUFBQSxNQUFRLEdBQUU7QUFBQTtBQUFBLEVBQUU7QUFBQSxFQUFFLENBQUM7QUFBRSxTQUFTLEVBQUMsQ0FBQyxJQUFFLElBQUU7QUFBQSxFQUFDLE9BQU8sSUFBSSxHQUFFLElBQUUsRUFBQztBQUFBO0FBQUUsU0FBUyxFQUFDLENBQUMsSUFBRTtBQUFBLEVBQUMsU0FBUSxLQUFFLEdBQUUsRUFBVyxPQUFKLFdBQU0sS0FBRSxHQUFFO0FBQUEsSUFBRSxJQUFHLEdBQUUsRUFBRSxNQUFJLEdBQUUsS0FBRyxDQUFDLEdBQUUsRUFBRSxFQUFFLEtBQUcsR0FBRSxFQUFFLE1BQUksR0FBRTtBQUFBLE1BQUUsT0FBTTtBQUFBLEVBQUcsT0FBTTtBQUFBO0FBQUcsU0FBUyxFQUFDLENBQUMsSUFBRTtBQUFBLEVBQUMsU0FBUSxLQUFFLEdBQUUsRUFBVyxPQUFKLFdBQU0sS0FBRSxHQUFFLEdBQUU7QUFBQSxJQUFDLElBQUksS0FBRSxHQUFFLEVBQUU7QUFBQSxJQUFFLElBQVksT0FBSjtBQUFBLE1BQU0sR0FBRSxJQUFFO0FBQUEsSUFBRSxHQUFFLEVBQUUsSUFBRTtBQUFBLElBQUUsR0FBRSxJQUFFO0FBQUEsSUFBRyxJQUFZLEdBQUUsTUFBTixXQUFRO0FBQUEsTUFBQyxHQUFFLElBQUU7QUFBQSxNQUFFO0FBQUEsSUFBSztBQUFBLEVBQUM7QUFBQTtBQUFFLFNBQVMsRUFBQyxDQUFDLElBQUU7QUFBQSxFQUFDLElBQUksS0FBRSxHQUFFLEdBQUUsS0FBTztBQUFBLEVBQUUsT0FBZSxPQUFKLFdBQU07QUFBQSxJQUFDLElBQUksS0FBRSxHQUFFO0FBQUEsSUFBRSxJQUFRLEdBQUUsTUFBUCxJQUFTO0FBQUEsTUFBQyxHQUFFLEVBQUUsRUFBRSxFQUFDO0FBQUEsTUFBRSxJQUFZLE9BQUo7QUFBQSxRQUFNLEdBQUUsSUFBRSxHQUFFO0FBQUEsTUFBRSxJQUFZLEdBQUUsTUFBTjtBQUFBLFFBQVEsR0FBRSxFQUFFLElBQUU7QUFBQSxJQUFDLEVBQU07QUFBQSxXQUFFO0FBQUEsSUFBRSxHQUFFLEVBQUUsSUFBRSxHQUFFO0FBQUEsSUFBRSxJQUFZLEdBQUUsTUFBTjtBQUFBLE1BQVEsR0FBRSxJQUFPO0FBQUEsSUFBRSxLQUFFO0FBQUEsRUFBQztBQUFBLEVBQUMsR0FBRSxJQUFFO0FBQUE7QUFBRSxTQUFTLEVBQUMsQ0FBQyxJQUFFLElBQUU7QUFBQSxFQUFDLEdBQUUsS0FBSyxNQUFVLFNBQUM7QUFBQSxFQUFFLEtBQUssSUFBRTtBQUFBLEVBQUUsS0FBSyxJQUFPO0FBQUEsRUFBRSxLQUFLLElBQUUsS0FBRTtBQUFBLEVBQUUsS0FBSyxJQUFFO0FBQUEsRUFBRSxLQUFLLElBQVEsTUFBTixPQUFhLFlBQUUsR0FBRTtBQUFBLEVBQVEsS0FBSyxJQUFRLE1BQU4sT0FBYSxZQUFFLEdBQUU7QUFBQSxFQUFVLEtBQUssT0FBVyxNQUFOLE9BQWEsWUFBRSxHQUFFO0FBQUE7QUFBSyxHQUFFLFlBQVUsSUFBSTtBQUFFLEdBQUUsVUFBVSxJQUFFLFFBQVEsR0FBRTtBQUFBLEVBQUMsS0FBSyxLQUFHO0FBQUEsRUFBRyxJQUFHLElBQUUsS0FBSztBQUFBLElBQUUsT0FBTTtBQUFBLEVBQUcsS0FBUSxLQUFHLEtBQUssTUFBYjtBQUFBLElBQWdCLE9BQU07QUFBQSxFQUFHLEtBQUssS0FBRztBQUFBLEVBQUcsSUFBRyxLQUFLLE1BQUk7QUFBQSxJQUFFLE9BQU07QUFBQSxFQUFHLEtBQUssSUFBRTtBQUFBLEVBQUUsS0FBSyxLQUFHO0FBQUEsRUFBRSxJQUFHLEtBQUssSUFBRSxLQUFHLENBQUMsR0FBRSxJQUFJLEdBQUU7QUFBQSxJQUFDLEtBQUssS0FBRztBQUFBLElBQUcsT0FBTTtBQUFBLEVBQUU7QUFBQSxFQUFDLElBQUksS0FBRTtBQUFBLEVBQUUsSUFBRztBQUFBLElBQUMsR0FBRSxJQUFJO0FBQUEsSUFBRSxLQUFFO0FBQUEsSUFBSyxJQUFJLEtBQUUsS0FBSyxFQUFFO0FBQUEsSUFBRSxJQUFHLEtBQUcsS0FBSyxLQUFHLEtBQUssTUFBSSxNQUFPLEtBQUssTUFBVCxHQUFXO0FBQUEsTUFBQyxLQUFLLElBQUU7QUFBQSxNQUFFLEtBQUssS0FBRztBQUFBLE1BQUksS0FBSztBQUFBLElBQUc7QUFBQSxJQUFFLE9BQU0sSUFBRTtBQUFBLElBQUMsS0FBSyxJQUFFO0FBQUEsSUFBRSxLQUFLLEtBQUc7QUFBQSxJQUFHLEtBQUs7QUFBQTtBQUFBLEVBQUksS0FBRTtBQUFBLEVBQUUsR0FBRSxJQUFJO0FBQUEsRUFBRSxLQUFLLEtBQUc7QUFBQSxFQUFHLE9BQU07QUFBQTtBQUFJLEdBQUUsVUFBVSxJQUFFLFFBQVEsQ0FBQyxJQUFFO0FBQUEsRUFBQyxJQUFZLEtBQUssTUFBVCxXQUFXO0FBQUEsSUFBQyxLQUFLLEtBQUc7QUFBQSxJQUFHLFNBQVEsS0FBRSxLQUFLLEVBQVcsT0FBSixXQUFNLEtBQUUsR0FBRTtBQUFBLE1BQUUsR0FBRSxFQUFFLEVBQUUsRUFBQztBQUFBLEVBQUM7QUFBQSxFQUFDLEdBQUUsVUFBVSxFQUFFLEtBQUssTUFBSyxFQUFDO0FBQUE7QUFBRyxHQUFFLFVBQVUsSUFBRSxRQUFRLENBQUMsSUFBRTtBQUFBLEVBQUMsSUFBWSxLQUFLLE1BQVQsV0FBVztBQUFBLElBQUMsR0FBRSxVQUFVLEVBQUUsS0FBSyxNQUFLLEVBQUM7QUFBQSxJQUFFLElBQVksS0FBSyxNQUFULFdBQVc7QUFBQSxNQUFDLEtBQUssS0FBRztBQUFBLE1BQUksU0FBUSxLQUFFLEtBQUssRUFBVyxPQUFKLFdBQU0sS0FBRSxHQUFFO0FBQUEsUUFBRSxHQUFFLEVBQUUsRUFBRSxFQUFDO0FBQUEsSUFBQztBQUFBLEVBQUM7QUFBQTtBQUFHLEdBQUUsVUFBVSxJQUFFLFFBQVEsR0FBRTtBQUFBLEVBQUMsSUFBRyxFQUFFLElBQUUsS0FBSyxJQUFHO0FBQUEsSUFBQyxLQUFLLEtBQUc7QUFBQSxJQUFFLFNBQVEsS0FBRSxLQUFLLEVBQVcsT0FBSixXQUFNLEtBQUUsR0FBRTtBQUFBLE1BQUUsR0FBRSxFQUFFLEVBQUU7QUFBQSxFQUFDO0FBQUE7QUFBRyxPQUFPLGVBQWUsR0FBRSxXQUFVLFNBQVEsRUFB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SyxJQUFHO0FBQUEsSUFBQyxLQUFLLEtBQUc7QUFBQSxJQUFFLEtBQUssSUFBRTtBQUFBLElBQUUsS0FBRTtBQUFBLEVBQUk7QUFBQTtBQUFHLEdBQUUsVUFBVSxJQUFFLFFBQVEsR0FBRTtBQUFBLEVBQUMsS0FBSyxLQUFHO0FBQUEsRUFBRSxJQUFHLEVBQUUsSUFBRSxLQUFLO0FBQUEsSUFBRyxHQUFFLElBQUk7QUFBQTtBQUFHLEdBQUUsVUFBVSxVQUFRLFFBQVEsR0FBRTtBQUFBLEVBQUMsS0FBSyxFQUFFO0FBQUE7QUFBRyxTQUFTLEVBQUMsQ0FBQyxJQUFFLElBQUU7QUFBQSxFQUFDLElBQUksS0FBRSxJQUFJLEdBQUUsSUFBRSxFQUFDO0FBQUEsRUFBRSxJQUFHO0FBQUEsSUFBQyxHQUFFLEVBQUU7QUFBQSxJQUFFLE9BQU0sSUFBRTtBQUFBLElBQUMsR0FBRSxFQUFFO0FBQUEsSUFBRSxNQUFNO0FBQUE7QUFBQSxFQUFFLElBQUksS0FBRSxHQUFFLEVBQUUsS0FBSyxFQUFDO0FBQUEsRUFBRSxHQUFFLE9BQU8sV0FBUztBQUFBLEVBQUUsT0FBTztBQUFBOzs7QUNBdnNJLElBQUk7QUFBSixJQUFNO0FBQUUsU0FBUyxFQUFDLENBQUMsSUFBRSxJQUFFO0FBQUEsRUFBQyxFQUFFLE1BQUcsR0FBRSxLQUFLLE1BQUssRUFBRSxPQUFJLFFBQVEsR0FBRSxFQUFFO0FBQUE7QUFBRSxTQUFTLEVBQUMsQ0FBQyxJQUFFO0FBQUEsRUFBQyxJQUFHLElBQUU7QUFBQSxJQUFDLElBQUksS0FBRTtBQUFBLElBQUUsS0FBTztBQUFBLElBQUUsR0FBRTtBQUFBLEVBQUM7QUFBQSxFQUFDLEtBQUUsTUFBRyxHQUFFLEVBQUU7QUFBQTtBQUFFLFNBQVMsRUFBQyxDQUFDLElBQUU7QUFBQSxFQUFDLElBQUksS0FBRSxNQUFLLEtBQUUsR0FBRSxNQUFLLEtBQUUsVUFBVSxFQUFDO0FBQUEsRUFBRSxHQUFFLFFBQU07QUFBQSxFQUFFLElBQUksS0FBRSxHQUFFLFFBQVEsR0FBRTtBQUFBLElBQUMsSUFBSSxLQUFF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QUssR0FBRSxPQUFPLEdBQUcsU0FBUztBQUFBLEVBQ3hELE1BQU0sT0FBTyxNQUFNLFdBQVcsSUFBSSxPQUFPLEdBQUcsTUFBTSxJQUFJO0FBQUEsRUFFdEQsTUFBTSxpQkFBaUI7QUFBQSxJQUNyQjtBQUFBLElBQVc7QUFBQSxJQUFXO0FBQUEsSUFBVztBQUFBLElBQ2pDO0FBQUEsSUFBVztBQUFBLElBQVc7QUFBQSxJQUFXO0FBQUEsRUFDbkM7QUFBQSxFQUNBLE1BQU0sU0FBUyxJQUFJLFNBQVMsVUFBVSxRQUFLLEdBQUUsT0FBTyxHQUFHLFNBQVMsS0FBSztBQUFBLEVBQ3JFLE1BQU0sZUFBZSxLQUFLLGVBQWUsU0FBUyxlQUFlLFVBQVU7QUFBQSxFQUUzRSxNQUFNLFVBQVUsZUFBZTtBQUFBLEVBRS9CLHVCQUNFO0FBQUEsY0FrQkU7QUFBQSxNQWpCQywyQkFBVyxHQUFDLGVBQUQscUNBQWU7QUFBQSxzQkFDM0IsR0FBQyxjQUFELHFDQUFjO0FBQUEsc0JBQ2QsR0FRRSxPQVJGO0FBQUEsUUFBSyxJQUFHO0FBQUEsUUFBUiwwQkFFRSxHQUtFLE9BTEY7QUFBQSxVQUFLLElBQUc7QUFBQSxVQUFlLE9BQU8sRUFBRSxZQUFZLGFBQWE7QUFBQSxVQUF6RCxVQUtFO0FBQUEsNEJBSkEsR0FFRSxPQUZGO0FBQUEsY0FBSyxJQUFHO0FBQUEsY0FBUiwwQkFDRSxHQUFDLFFBQUQ7QUFBQSxnQkFBUTtBQUFBLGlCQUFSLGlDQUFvQjtBQUFBLGVBRHRCLGlDQUVFO0FBQUEsNEJBQ0YsR0FBQyxZQUFELHFDQUFZO0FBQUE7QUFBQSxXQUpkLGdDQUtFO0FBQUEsU0FQSixpQ0FRRTtBQUFBLHNCQUNGLEdBQUMsYUFBRCxxQ0FBYTtBQUFBLE1BQ1osMkJBQVcsR0FBQyxrQkFBRCxxQ0FBa0I7QUFBQSxzQkFDOUIsR0FBQyxpQkFBRCxxQ0FBaUI7QUFBQSxNQUNoQiwyQkFBVyxHQUFDLFlBQUQscUNBQVk7QUFBQSxNQUN2QiwyQkFBVyxHQUFDLGNBQUQscUNBQWM7QUFBQSxNQUN6Qiw0QkFBWSxHQUFDLFdBQUQ7QUFBQSxRQUFXLFNBQVMsTUFBTSxZQUFZLEtBQUs7QUFBQSxTQUEzQyxpQ0FBOEM7QUFBQTtBQUFBLEtBakI3RCxnQ0FrQkU7QUFBQTs7O0FDdklOLFNBQVMsZUFBZSxLQUFLLEVBQUcsaUJBQWlCLGVBQWUsQ0FBQyxPQUFhO0FBQUEsRUFDNUUsR0FBRSxlQUFlO0FBQUEsQ0FDbEI7QUFHRCxTQUFTLGlCQUFpQixhQUFhLENBQUMsT0FBa0I7QUFBQSxFQUFFLElBQUksR0FBRSxXQUFXO0FBQUEsSUFBRyxHQUFFLGVBQWU7QUFBQSxDQUFJO0FBRXJHLGtCQUFPLEdBQUMsS0FBRCxxQ0FBSyxHQUFJLFNBQVMsZUFBZSxLQUFLLENBQUU7IiwKICAiZGVidWdJZCI6ICI0QjlDRERDQkE3MDUzQkFFNjQ3NTZFMjE2NDc1NkUyMSIsCiAgIm5hbWVzIjogW10KfQ==
