var Ci = Object.defineProperty;
var Mi = (c, e, t) => e in c ? Ci(c, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : c[e] = t;
var q = (c, e, t) => Mi(c, typeof e != "symbol" ? e + "" : e, t);
class Pi {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  on(e, t) {
    return this.map.has(e) || this.map.set(e, /* @__PURE__ */ new Set()), this.map.get(e).add(t), () => this.off(e, t);
  }
  off(e, t) {
    var s;
    (s = this.map.get(e)) == null || s.delete(t);
  }
  emit(e, t) {
    var s;
    (s = this.map.get(e)) == null || s.forEach((i) => {
      try {
        i(t);
      } catch (r) {
        console.error(r);
      }
    });
  }
}
const Se = ["a", "b", "c", "d", "e", "f", "g", "h"], xe = ["1", "2", "3", "4", "5", "6", "7", "8"];
function se(c) {
  return c === c.toUpperCase();
}
function he(c, e) {
  return Se[c] + xe[e];
}
function lt(c) {
  return {
    f: Se.indexOf(c[0]),
    r: xe.indexOf(c[1])
  };
}
function le(c) {
  const e = c.split(" "), t = Array(8).fill(null).map(() => Array(8).fill(null)), s = e[0].split("/");
  for (let i = 0; i < 8; i++) {
    const r = s[i];
    let o = 0;
    for (const n of r)
      /\d/.test(n) ? o += parseInt(n) : (t[7 - i][o] = n, o++);
  }
  return {
    board: t,
    turn: e[1] || "w",
    castling: e[2] || "KQkq",
    ep: e[3] === "-" ? null : e[3],
    halfmove: parseInt(e[4] || "0"),
    fullmove: parseInt(e[5] || "1")
  };
}
function Pe(c, e, t) {
  return Math.max(e, Math.min(t, c));
}
function ct(c, e, t) {
  return c + (e - c) * t;
}
function Ei(c) {
  return 1 - Math.pow(1 - c, 3);
}
const St = {
  classic: {
    light: "#2a3547",
    dark: "#57728e",
    boardBorder: "#0F172A0F",
    whitePiece: "#e2d4cb",
    blackPiece: "#171616",
    pieceShadow: "rgba(0,0,0,0.15)",
    pieceStroke: "rgba(15,23,42,0.6)",
    pieceHighlight: "rgba(255,255,255,0.55)",
    moveFrom: "rgba(250,204,21,0.55)",
    moveTo: "rgba(34,197,94,0.45)",
    lastMove: "rgba(59,130,246,0.35)",
    premove: "rgba(147,51,234,0.35)",
    dot: "rgba(2,6,23,0.35)",
    arrow: "rgba(34,197,94,0.9)",
    squareNameColor: "#0F172A"
  },
  midnight: {
    light: "#2A2F3A",
    dark: "#1F242E",
    boardBorder: "#00000026",
    whitePiece: "#E6E8EC",
    blackPiece: "#111418",
    pieceShadow: "rgba(0,0,0,0.25)",
    pieceStroke: "rgba(0,0,0,0.65)",
    pieceHighlight: "rgba(255,255,255,0.4)",
    moveFrom: "rgba(250,204,21,0.4)",
    moveTo: "rgba(34,197,94,0.35)",
    lastMove: "rgba(59,130,246,0.3)",
    premove: "rgba(147,51,234,0.30)",
    dot: "rgba(255,255,255,0.35)",
    arrow: "rgba(59,130,246,0.9)",
    squareNameColor: "#E6E8EC"
  }
}, Ti = "classic", yt = () => St[Ti], ki = (c) => {
  const e = yt();
  return {
    ...e,
    ...c,
    pieceStroke: c.pieceStroke ?? e.pieceStroke,
    pieceHighlight: c.pieceHighlight ?? e.pieceHighlight
  };
}, ut = (c) => typeof c == "string" ? St[c] ?? yt() : ki(c);
class qi {
  constructor(e, t) {
    this.size = e, this.colors = t, this.sheet = this.build(e);
  }
  getSheet() {
    return this.sheet;
  }
  rr(e, t, s, i, r, o) {
    const n = Math.min(o, i / 2, r / 2);
    e.beginPath(), e.moveTo(t + n, s), e.lineTo(t + i - n, s), e.quadraticCurveTo(t + i, s, t + i, s + n), e.lineTo(t + i, s + r - n), e.quadraticCurveTo(t + i, s + r, t + i - n, s + r), e.lineTo(t + n, s + r), e.quadraticCurveTo(t, s + r, t, s + r - n), e.lineTo(t, s + n), e.quadraticCurveTo(t, s, t + n, s), e.closePath();
  }
  build(e) {
    const t = typeof OffscreenCanvas < "u" ? new OffscreenCanvas(e * 6, e * 2) : Object.assign(document.createElement("canvas"), { width: e * 6, height: e * 2 }), s = t.getContext("2d");
    return ["k", "q", "r", "b", "n", "p"].forEach((r, o) => {
      this.draw(s, o * e, 0, e, r, "black"), this.draw(s, o * e, e, e, r, "white");
    }), t;
  }
  draw(e, t, s, i, r, o) {
    const n = o === "white" ? this.colors.whitePiece : this.colors.blackPiece, a = this.colors.pieceShadow;
    e.save(), e.translate(t, s), e.fillStyle = a, e.beginPath(), e.ellipse(i * 0.5, i * 0.68, i * 0.28, i * 0.1, 0, 0, Math.PI * 2), e.fill(), e.fillStyle = n, e.lineJoin = "round", e.lineCap = "round";
    const h = () => {
      e.beginPath(), e.moveTo(i * 0.2, i * 0.7), e.quadraticCurveTo(i * 0.5, i * 0.6, i * 0.8, i * 0.7), e.lineTo(i * 0.8, i * 0.8), e.quadraticCurveTo(i * 0.5, i * 0.85, i * 0.2, i * 0.8), e.closePath(), e.fill();
    };
    if (r === "p" && (e.beginPath(), e.arc(i * 0.5, i * 0.38, i * 0.12, 0, Math.PI * 2), e.fill(), e.beginPath(), e.moveTo(i * 0.38, i * 0.52), e.quadraticCurveTo(i * 0.5, i * 0.42, i * 0.62, i * 0.52), e.quadraticCurveTo(i * 0.64, i * 0.6, i * 0.5, i * 0.62), e.quadraticCurveTo(i * 0.36, i * 0.6, i * 0.38, i * 0.52), e.closePath(), e.fill(), h()), r === "r" && (e.beginPath(), this.rr(e, i * 0.32, i * 0.3, i * 0.36, i * 0.34, i * 0.04), e.fill(), e.beginPath(), this.rr(e, i * 0.3, i * 0.22, i * 0.12, i * 0.1, i * 0.02), e.fill(), e.beginPath(), this.rr(e, i * 0.44, i * 0.2, i * 0.12, i * 0.12, i * 0.02), e.fill(), e.beginPath(), this.rr(e, i * 0.58, i * 0.22, i * 0.12, i * 0.1, i * 0.02), e.fill(), h()), r === "n") {
      e.beginPath(), e.moveTo(i * 0.64, i * 0.6), e.quadraticCurveTo(i * 0.7, i * 0.35, i * 0.54, i * 0.28), e.quadraticCurveTo(i * 0.46, i * 0.24, i * 0.44, i * 0.3), e.quadraticCurveTo(i * 0.42, i * 0.42, i * 0.34, i * 0.44), e.quadraticCurveTo(i * 0.3, i * 0.46, i * 0.28, i * 0.5), e.quadraticCurveTo(i * 0.26, i * 0.6, i * 0.38, i * 0.62), e.closePath(), e.fill();
      const d = e.fillStyle;
      e.fillStyle = "rgba(0,0,0,0.15)", e.beginPath(), e.arc(i * 0.5, i * 0.36, i * 0.02, 0, Math.PI * 2), e.fill(), e.fillStyle = d, h();
    }
    if (r === "b") {
      e.beginPath(), e.ellipse(i * 0.5, i * 0.42, i * 0.12, i * 0.18, 0, 0, Math.PI * 2), e.fill();
      const d = e.globalCompositeOperation;
      e.globalCompositeOperation = "destination-out", e.beginPath(), e.moveTo(i * 0.5, i * 0.28), e.lineTo(i * 0.5, i * 0.52), e.lineWidth = i * 0.04, e.stroke(), e.globalCompositeOperation = d, h();
    }
    r === "q" && (e.beginPath(), e.moveTo(i * 0.3, i * 0.3), e.lineTo(i * 0.4, i * 0.18), e.lineTo(i * 0.5, i * 0.3), e.lineTo(i * 0.6, i * 0.18), e.lineTo(i * 0.7, i * 0.3), e.closePath(), e.fill(), e.beginPath(), e.ellipse(i * 0.5, i * 0.5, i * 0.16, i * 0.16, 0, 0, Math.PI * 2), e.fill(), h()), r === "k" && (e.beginPath(), this.rr(e, i * 0.47, i * 0.16, i * 0.06, i * 0.16, i * 0.02), e.fill(), e.beginPath(), this.rr(e, i * 0.4, i * 0.22, i * 0.2, i * 0.06, i * 0.02), e.fill(), e.beginPath(), this.rr(e, i * 0.36, i * 0.34, i * 0.28, i * 0.26, i * 0.08), e.fill(), h()), e.restore();
  }
}
function Ni(c) {
  return c !== null ? { comment: c, variations: [] } : { variations: [] };
}
function Oi(c, e, t, s, i) {
  const r = { move: c, variations: i };
  return e && (r.suffix = e), t && (r.nag = t), s !== null && (r.comment = s), r;
}
function Ii(...c) {
  const [e, ...t] = c;
  let s = e;
  for (const i of t)
    i !== null && (s.variations = [i, ...i.variations], i.variations = [], s = i);
  return e;
}
function $i(c, e) {
  if (e.marker && e.marker.comment) {
    let t = e.root;
    for (; ; ) {
      const s = t.variations[0];
      if (!s) {
        t.comment = e.marker.comment;
        break;
      }
      t = s;
    }
  }
  return {
    headers: c,
    root: e.root,
    result: (e.marker && e.marker.result) ?? void 0
  };
}
function Ri(c, e) {
  function t() {
    this.constructor = c;
  }
  t.prototype = e.prototype, c.prototype = new t();
}
function oe(c, e, t, s) {
  var i = Error.call(this, c);
  return Object.setPrototypeOf && Object.setPrototypeOf(i, oe.prototype), i.expected = e, i.found = t, i.location = s, i.name = "SyntaxError", i;
}
Ri(oe, Error);
function Ee(c, e, t) {
  return t = t || " ", c.length > e ? c : (e -= c.length, t += t.repeat(e), c + t.slice(0, e));
}
oe.prototype.format = function(c) {
  var e = "Error: " + this.message;
  if (this.location) {
    var t = null, s;
    for (s = 0; s < c.length; s++)
      if (c[s].source === this.location.source) {
        t = c[s].text.split(/\r\n|\n|\r/g);
        break;
      }
    var i = this.location.start, r = this.location.source && typeof this.location.source.offset == "function" ? this.location.source.offset(i) : i, o = this.location.source + ":" + r.line + ":" + r.column;
    if (t) {
      var n = this.location.end, a = Ee("", r.line.toString().length, " "), h = t[i.line - 1], d = i.line === n.line ? n.column : h.length + 1, m = d - i.column || 1;
      e += `
 --> ` + o + `
` + a + ` |
` + r.line + " | " + h + `
` + a + " | " + Ee("", i.column - 1, " ") + Ee("", m, "^");
    } else
      e += `
 at ` + o;
  }
  return e;
};
oe.buildMessage = function(c, e) {
  var t = {
    literal: function(h) {
      return '"' + i(h.text) + '"';
    },
    class: function(h) {
      var d = h.parts.map(function(m) {
        return Array.isArray(m) ? r(m[0]) + "-" + r(m[1]) : r(m);
      });
      return "[" + (h.inverted ? "^" : "") + d.join("") + "]";
    },
    any: function() {
      return "any character";
    },
    end: function() {
      return "end of input";
    },
    other: function(h) {
      return h.description;
    }
  };
  function s(h) {
    return h.charCodeAt(0).toString(16).toUpperCase();
  }
  function i(h) {
    return h.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(d) {
      return "\\x0" + s(d);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(d) {
      return "\\x" + s(d);
    });
  }
  function r(h) {
    return h.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(d) {
      return "\\x0" + s(d);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(d) {
      return "\\x" + s(d);
    });
  }
  function o(h) {
    return t[h.type](h);
  }
  function n(h) {
    var d = h.map(o), m, p;
    if (d.sort(), d.length > 0) {
      for (m = 1, p = 1; m < d.length; m++)
        d[m - 1] !== d[m] && (d[p] = d[m], p++);
      d.length = p;
    }
    switch (d.length) {
      case 1:
        return d[0];
      case 2:
        return d[0] + " or " + d[1];
      default:
        return d.slice(0, -1).join(", ") + ", or " + d[d.length - 1];
    }
  }
  function a(h) {
    return h ? '"' + i(h) + '"' : "end of input";
  }
  return "Expected " + n(c) + " but " + a(e) + " found.";
};
function Fi(c, e) {
  e = e !== void 0 ? e : {};
  var t = {}, s = e.grammarSource, i = { pgn: st }, r = st, o = "[", n = '"', a = "]", h = ".", d = "O-O-O", m = "O-O", p = "0-0-0", _ = "0-0", v = "$", P = "{", C = "}", T = ";", k = "(", x = ")", K = "1-0", L = "0-1", Y = "1/2-1/2", te = "*", G = /^[a-zA-Z]/, j = /^[^"]/, ge = /^[0-9]/, Ke = /^[.]/, ze = /^[a-zA-Z1-8\-=]/, Ct = /^[+#]/, Be = /^[!?]/, Ue = /^[^}]/, We = /^[^\r\n]/, je = /^[ \t\r\n]/, Mt = z("tag pair"), Pt = I("[", !1), Ye = I('"', !1), Et = I("]", !1), Tt = z("tag name"), Ce = W([["a", "z"], ["A", "Z"]], !1, !1), kt = z("tag value"), Ge = W(['"'], !0, !1), qt = z("move number"), de = W([["0", "9"]], !1, !1), Nt = I(".", !1), Xe = W(["."], !1, !1), Ot = z("standard algebraic notation"), It = I("O-O-O", !1), $t = I("O-O", !1), Rt = I("0-0-0", !1), Ft = I("0-0", !1), Qe = W([["a", "z"], ["A", "Z"], ["1", "8"], "-", "="], !1, !1), Lt = W(["+", "#"], !1, !1), Ht = z("suffix annotation"), Ve = W(["!", "?"], !1, !1), xt = z("NAG"), Dt = I("$", !1), Kt = z("brace comment"), zt = I("{", !1), Je = W(["}"], !0, !1), Bt = I("}", !1), Ut = z("rest of line comment"), Wt = I(";", !1), Ze = W(["\r", `
`], !0, !1), jt = z("variation"), Yt = I("(", !1), Gt = I(")", !1), Xt = z("game termination marker"), Qt = I("1-0", !1), Vt = I("0-1", !1), Jt = I("1/2-1/2", !1), Zt = I("*", !1), ei = z("whitespace"), et = W([" ", "	", "\r", `
`], !1, !1), ti = function(l, f) {
    return $i(l, f);
  }, ii = function(l) {
    return Object.fromEntries(l);
  }, si = function(l, f) {
    return [l, f];
  }, ri = function(l, f) {
    return { root: l, marker: f };
  }, ni = function(l, f) {
    return Ii(Ni(l), ...f.flat());
  }, oi = function(l, f, g, S, y) {
    return Oi(l, f, g, S, y);
  }, ai = function(l) {
    return l;
  }, hi = function(l) {
    return l.replace(/[\r\n]+/g, " ");
  }, li = function(l) {
    return l.trim();
  }, ci = function(l) {
    return l;
  }, ui = function(l, f) {
    return { result: l, comment: f };
  }, u = e.peg$currPos | 0, ie = [{ line: 1, column: 1 }], U = u, me = e.peg$maxFailExpected || [], w = e.peg$silentFails | 0, ae;
  if (e.startRule) {
    if (!(e.startRule in i))
      throw new Error(`Can't start parsing from rule "` + e.startRule + '".');
    r = i[e.startRule];
  }
  function I(l, f) {
    return { type: "literal", text: l, ignoreCase: f };
  }
  function W(l, f, g) {
    return { type: "class", parts: l, inverted: f, ignoreCase: g };
  }
  function fi() {
    return { type: "end" };
  }
  function z(l) {
    return { type: "other", description: l };
  }
  function tt(l) {
    var f = ie[l], g;
    if (f)
      return f;
    if (l >= ie.length)
      g = ie.length - 1;
    else
      for (g = l; !ie[--g]; )
        ;
    for (f = ie[g], f = {
      line: f.line,
      column: f.column
    }; g < l; )
      c.charCodeAt(g) === 10 ? (f.line++, f.column = 1) : f.column++, g++;
    return ie[l] = f, f;
  }
  function it(l, f, g) {
    var S = tt(l), y = tt(f), E = {
      source: s,
      start: {
        offset: l,
        line: S.line,
        column: S.column
      },
      end: {
        offset: f,
        line: y.line,
        column: y.column
      }
    };
    return E;
  }
  function b(l) {
    u < U || (u > U && (U = u, me = []), me.push(l));
  }
  function gi(l, f, g) {
    return new oe(
      oe.buildMessage(l, f),
      l,
      f,
      g
    );
  }
  function st() {
    var l, f, g;
    return l = u, f = di(), g = _i(), l = ti(f, g), l;
  }
  function di() {
    var l, f, g;
    for (l = u, f = [], g = rt(); g !== t; )
      f.push(g), g = rt();
    return g = H(), l = ii(f), l;
  }
  function rt() {
    var l, f, g, S, y, E, J;
    return w++, l = u, H(), c.charCodeAt(u) === 91 ? (f = o, u++) : (f = t, w === 0 && b(Pt)), f !== t ? (H(), g = mi(), g !== t ? (H(), c.charCodeAt(u) === 34 ? (S = n, u++) : (S = t, w === 0 && b(Ye)), S !== t ? (y = pi(), c.charCodeAt(u) === 34 ? (E = n, u++) : (E = t, w === 0 && b(Ye)), E !== t ? (H(), c.charCodeAt(u) === 93 ? (J = a, u++) : (J = t, w === 0 && b(Et)), J !== t ? l = si(g, y) : (u = l, l = t)) : (u = l, l = t)) : (u = l, l = t)) : (u = l, l = t)) : (u = l, l = t), w--, l === t && w === 0 && b(Mt), l;
  }
  function mi() {
    var l, f, g;
    if (w++, l = u, f = [], g = c.charAt(u), G.test(g) ? u++ : (g = t, w === 0 && b(Ce)), g !== t)
      for (; g !== t; )
        f.push(g), g = c.charAt(u), G.test(g) ? u++ : (g = t, w === 0 && b(Ce));
    else
      f = t;
    return f !== t ? l = c.substring(l, u) : l = f, w--, l === t && (f = t, w === 0 && b(Tt)), l;
  }
  function pi() {
    var l, f, g;
    for (w++, l = u, f = [], g = c.charAt(u), j.test(g) ? u++ : (g = t, w === 0 && b(Ge)); g !== t; )
      f.push(g), g = c.charAt(u), j.test(g) ? u++ : (g = t, w === 0 && b(Ge));
    return l = c.substring(l, u), w--, f = t, w === 0 && b(kt), l;
  }
  function _i() {
    var l, f, g;
    return l = u, f = nt(), H(), g = Ai(), g === t && (g = null), H(), l = ri(f, g), l;
  }
  function nt() {
    var l, f, g, S;
    for (l = u, f = Me(), f === t && (f = null), g = [], S = ot(); S !== t; )
      g.push(S), S = ot();
    return l = ni(f, g), l;
  }
  function ot() {
    var l, f, g, S, y, E, J, pe;
    if (l = u, H(), vi(), H(), f = wi(), f !== t) {
      for (g = bi(), g === t && (g = null), S = [], y = at(); y !== t; )
        S.push(y), y = at();
      for (y = H(), E = Me(), E === t && (E = null), J = [], pe = ht(); pe !== t; )
        J.push(pe), pe = ht();
      l = oi(f, g, S, E, J);
    } else
      u = l, l = t;
    return l;
  }
  function vi() {
    var l, f, g, S, y, E;
    for (w++, l = u, f = [], g = c.charAt(u), ge.test(g) ? u++ : (g = t, w === 0 && b(de)); g !== t; )
      f.push(g), g = c.charAt(u), ge.test(g) ? u++ : (g = t, w === 0 && b(de));
    if (c.charCodeAt(u) === 46 ? (g = h, u++) : (g = t, w === 0 && b(Nt)), g !== t) {
      for (S = H(), y = [], E = c.charAt(u), Ke.test(E) ? u++ : (E = t, w === 0 && b(Xe)); E !== t; )
        y.push(E), E = c.charAt(u), Ke.test(E) ? u++ : (E = t, w === 0 && b(Xe));
      f = [f, g, S, y], l = f;
    } else
      u = l, l = t;
    return w--, l === t && (f = t, w === 0 && b(qt)), l;
  }
  function wi() {
    var l, f, g, S, y, E;
    if (w++, l = u, f = u, c.substr(u, 5) === d ? (g = d, u += 5) : (g = t, w === 0 && b(It)), g === t && (c.substr(u, 3) === m ? (g = m, u += 3) : (g = t, w === 0 && b($t)), g === t && (c.substr(u, 5) === p ? (g = p, u += 5) : (g = t, w === 0 && b(Rt)), g === t && (c.substr(u, 3) === _ ? (g = _, u += 3) : (g = t, w === 0 && b(Ft)), g === t))))
      if (g = u, S = c.charAt(u), G.test(S) ? u++ : (S = t, w === 0 && b(Ce)), S !== t) {
        if (y = [], E = c.charAt(u), ze.test(E) ? u++ : (E = t, w === 0 && b(Qe)), E !== t)
          for (; E !== t; )
            y.push(E), E = c.charAt(u), ze.test(E) ? u++ : (E = t, w === 0 && b(Qe));
        else
          y = t;
        y !== t ? (S = [S, y], g = S) : (u = g, g = t);
      } else
        u = g, g = t;
    return g !== t ? (S = c.charAt(u), Ct.test(S) ? u++ : (S = t, w === 0 && b(Lt)), S === t && (S = null), g = [g, S], f = g) : (u = f, f = t), f !== t ? l = c.substring(l, u) : l = f, w--, l === t && (f = t, w === 0 && b(Ot)), l;
  }
  function bi() {
    var l, f, g;
    for (w++, l = u, f = [], g = c.charAt(u), Be.test(g) ? u++ : (g = t, w === 0 && b(Ve)); g !== t; )
      f.push(g), f.length >= 2 ? g = t : (g = c.charAt(u), Be.test(g) ? u++ : (g = t, w === 0 && b(Ve)));
    return f.length < 1 ? (u = l, l = t) : l = f, w--, l === t && (f = t, w === 0 && b(Ht)), l;
  }
  function at() {
    var l, f, g, S, y;
    if (w++, l = u, H(), c.charCodeAt(u) === 36 ? (f = v, u++) : (f = t, w === 0 && b(Dt)), f !== t) {
      if (g = u, S = [], y = c.charAt(u), ge.test(y) ? u++ : (y = t, w === 0 && b(de)), y !== t)
        for (; y !== t; )
          S.push(y), y = c.charAt(u), ge.test(y) ? u++ : (y = t, w === 0 && b(de));
      else
        S = t;
      S !== t ? g = c.substring(g, u) : g = S, g !== t ? l = ai(g) : (u = l, l = t);
    } else
      u = l, l = t;
    return w--, l === t && w === 0 && b(xt), l;
  }
  function Me() {
    var l;
    return l = Si(), l === t && (l = yi()), l;
  }
  function Si() {
    var l, f, g, S, y;
    if (w++, l = u, c.charCodeAt(u) === 123 ? (f = P, u++) : (f = t, w === 0 && b(zt)), f !== t) {
      for (g = u, S = [], y = c.charAt(u), Ue.test(y) ? u++ : (y = t, w === 0 && b(Je)); y !== t; )
        S.push(y), y = c.charAt(u), Ue.test(y) ? u++ : (y = t, w === 0 && b(Je));
      g = c.substring(g, u), c.charCodeAt(u) === 125 ? (S = C, u++) : (S = t, w === 0 && b(Bt)), S !== t ? l = hi(g) : (u = l, l = t);
    } else
      u = l, l = t;
    return w--, l === t && (f = t, w === 0 && b(Kt)), l;
  }
  function yi() {
    var l, f, g, S, y;
    if (w++, l = u, c.charCodeAt(u) === 59 ? (f = T, u++) : (f = t, w === 0 && b(Wt)), f !== t) {
      for (g = u, S = [], y = c.charAt(u), We.test(y) ? u++ : (y = t, w === 0 && b(Ze)); y !== t; )
        S.push(y), y = c.charAt(u), We.test(y) ? u++ : (y = t, w === 0 && b(Ze));
      g = c.substring(g, u), l = li(g);
    } else
      u = l, l = t;
    return w--, l === t && (f = t, w === 0 && b(Ut)), l;
  }
  function ht() {
    var l, f, g, S;
    return w++, l = u, H(), c.charCodeAt(u) === 40 ? (f = k, u++) : (f = t, w === 0 && b(Yt)), f !== t ? (g = nt(), g !== t ? (H(), c.charCodeAt(u) === 41 ? (S = x, u++) : (S = t, w === 0 && b(Gt)), S !== t ? l = ci(g) : (u = l, l = t)) : (u = l, l = t)) : (u = l, l = t), w--, l === t && w === 0 && b(jt), l;
  }
  function Ai() {
    var l, f, g;
    return w++, l = u, c.substr(u, 3) === K ? (f = K, u += 3) : (f = t, w === 0 && b(Qt)), f === t && (c.substr(u, 3) === L ? (f = L, u += 3) : (f = t, w === 0 && b(Vt)), f === t && (c.substr(u, 7) === Y ? (f = Y, u += 7) : (f = t, w === 0 && b(Jt)), f === t && (c.charCodeAt(u) === 42 ? (f = te, u++) : (f = t, w === 0 && b(Zt))))), f !== t ? (H(), g = Me(), g === t && (g = null), l = ui(f, g)) : (u = l, l = t), w--, l === t && (f = t, w === 0 && b(Xt)), l;
  }
  function H() {
    var l, f;
    for (w++, l = [], f = c.charAt(u), je.test(f) ? u++ : (f = t, w === 0 && b(et)); f !== t; )
      l.push(f), f = c.charAt(u), je.test(f) ? u++ : (f = t, w === 0 && b(et));
    return w--, f = t, w === 0 && b(ei), l;
  }
  if (ae = r(), e.peg$library)
    return (
      /** @type {any} */
      {
        peg$result: ae,
        peg$currPos: u,
        peg$FAILED: t,
        peg$maxFailExpected: me,
        peg$maxFailPos: U
      }
    );
  if (ae !== t && u === c.length)
    return ae;
  throw ae !== t && u < c.length && b(fi()), gi(
    me,
    U < c.length ? c.charAt(U) : null,
    U < c.length ? it(U, U + 1) : it(U, U)
  );
}
/**
 * @license
 * Copyright (c) 2025, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
const we = 0xffffffffffffffffn;
function Te(c, e) {
  return (c << e | c >> 64n - e) & 0xffffffffffffffffn;
}
function ft(c, e) {
  return c * e & we;
}
function Li(c) {
  return function() {
    let e = BigInt(c & we), t = BigInt(c >> 64n & we);
    const s = ft(Te(ft(e, 5n), 7n), 9n);
    return t ^= e, e = (Te(e, 24n) ^ t ^ t << 16n) & we, t = Te(t, 37n), c = t << 64n | e, s;
  };
}
const ye = Li(0xa187eb39cdcaed8f31c4b365b102e01en), Hi = Array.from({ length: 2 }, () => Array.from({ length: 6 }, () => Array.from({ length: 128 }, () => ye()))), xi = Array.from({ length: 8 }, () => ye()), Di = Array.from({ length: 16 }, () => ye()), ke = ye(), F = "w", D = "b", N = "p", Le = "n", be = "b", ue = "r", V = "q", O = "k", qe = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
class _e {
  constructor(e, t) {
    q(this, "color");
    q(this, "from");
    q(this, "to");
    q(this, "piece");
    q(this, "captured");
    q(this, "promotion");
    /**
     * @deprecated This field is deprecated and will be removed in version 2.0.0.
     * Please use move descriptor functions instead: `isCapture`, `isPromotion`,
     * `isEnPassant`, `isKingsideCastle`, `isQueensideCastle`, `isCastle`, and
     * `isBigPawn`
     */
    q(this, "flags");
    q(this, "san");
    q(this, "lan");
    q(this, "before");
    q(this, "after");
    const { color: s, piece: i, from: r, to: o, flags: n, captured: a, promotion: h } = t, d = $(r), m = $(o);
    this.color = s, this.piece = i, this.from = d, this.to = m, this.san = e._moveToSan(t, e._moves({ legal: !0 })), this.lan = d + m, this.before = e.fen(), e._makeMove(t), this.after = e.fen(), e._undoMove(), this.flags = "";
    for (const p in M)
      M[p] & n && (this.flags += Z[p]);
    a && (this.captured = a), h && (this.promotion = h, this.lan += h);
  }
  isCapture() {
    return this.flags.indexOf(Z.CAPTURE) > -1;
  }
  isPromotion() {
    return this.flags.indexOf(Z.PROMOTION) > -1;
  }
  isEnPassant() {
    return this.flags.indexOf(Z.EP_CAPTURE) > -1;
  }
  isKingsideCastle() {
    return this.flags.indexOf(Z.KSIDE_CASTLE) > -1;
  }
  isQueensideCastle() {
    return this.flags.indexOf(Z.QSIDE_CASTLE) > -1;
  }
  isBigPawn() {
    return this.flags.indexOf(Z.BIG_PAWN) > -1;
  }
}
const R = -1, Z = {
  NORMAL: "n",
  CAPTURE: "c",
  BIG_PAWN: "b",
  EP_CAPTURE: "e",
  PROMOTION: "p",
  KSIDE_CASTLE: "k",
  QSIDE_CASTLE: "q",
  NULL_MOVE: "-"
}, gt = [
  "a8",
  "b8",
  "c8",
  "d8",
  "e8",
  "f8",
  "g8",
  "h8",
  "a7",
  "b7",
  "c7",
  "d7",
  "e7",
  "f7",
  "g7",
  "h7",
  "a6",
  "b6",
  "c6",
  "d6",
  "e6",
  "f6",
  "g6",
  "h6",
  "a5",
  "b5",
  "c5",
  "d5",
  "e5",
  "f5",
  "g5",
  "h5",
  "a4",
  "b4",
  "c4",
  "d4",
  "e4",
  "f4",
  "g4",
  "h4",
  "a3",
  "b3",
  "c3",
  "d3",
  "e3",
  "f3",
  "g3",
  "h3",
  "a2",
  "b2",
  "c2",
  "d2",
  "e2",
  "f2",
  "g2",
  "h2",
  "a1",
  "b1",
  "c1",
  "d1",
  "e1",
  "f1",
  "g1",
  "h1"
], M = {
  NORMAL: 1,
  CAPTURE: 2,
  BIG_PAWN: 4,
  EP_CAPTURE: 8,
  PROMOTION: 16,
  KSIDE_CASTLE: 32,
  QSIDE_CASTLE: 64,
  NULL_MOVE: 128
}, He = {
  Event: "?",
  Site: "?",
  Date: "????.??.??",
  Round: "?",
  White: "?",
  Black: "?",
  Result: "*"
}, Ki = {
  WhiteTitle: null,
  BlackTitle: null,
  WhiteElo: null,
  BlackElo: null,
  WhiteUSCF: null,
  BlackUSCF: null,
  WhiteNA: null,
  BlackNA: null,
  WhiteType: null,
  BlackType: null,
  EventDate: null,
  EventSponsor: null,
  Section: null,
  Stage: null,
  Board: null,
  Opening: null,
  Variation: null,
  SubVariation: null,
  ECO: null,
  NIC: null,
  Time: null,
  UTCTime: null,
  UTCDate: null,
  TimeControl: null,
  SetUp: null,
  FEN: null,
  Termination: null,
  Annotator: null,
  Mode: null,
  PlyCount: null
}, zi = {
  ...He,
  ...Ki
}, A = {
  a8: 0,
  b8: 1,
  c8: 2,
  d8: 3,
  e8: 4,
  f8: 5,
  g8: 6,
  h8: 7,
  a7: 16,
  b7: 17,
  c7: 18,
  d7: 19,
  e7: 20,
  f7: 21,
  g7: 22,
  h7: 23,
  a6: 32,
  b6: 33,
  c6: 34,
  d6: 35,
  e6: 36,
  f6: 37,
  g6: 38,
  h6: 39,
  a5: 48,
  b5: 49,
  c5: 50,
  d5: 51,
  e5: 52,
  f5: 53,
  g5: 54,
  h5: 55,
  a4: 64,
  b4: 65,
  c4: 66,
  d4: 67,
  e4: 68,
  f4: 69,
  g4: 70,
  h4: 71,
  a3: 80,
  b3: 81,
  c3: 82,
  d3: 83,
  e3: 84,
  f3: 85,
  g3: 86,
  h3: 87,
  a2: 96,
  b2: 97,
  c2: 98,
  d2: 99,
  e2: 100,
  f2: 101,
  g2: 102,
  h2: 103,
  a1: 112,
  b1: 113,
  c1: 114,
  d1: 115,
  e1: 116,
  f1: 117,
  g1: 118,
  h1: 119
}, Ne = {
  b: [16, 32, 17, 15],
  w: [-16, -32, -17, -15]
}, dt = {
  n: [-18, -33, -31, -14, 18, 33, 31, 14],
  b: [-17, -15, 17, 15],
  r: [-16, 1, 16, -1],
  q: [-17, -16, -15, 1, 17, 16, 15, -1],
  k: [-17, -16, -15, 1, 17, 16, 15, -1]
}, Bi = [
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  24,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  2,
  24,
  2,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  2,
  53,
  56,
  53,
  2,
  0,
  0,
  0,
  0,
  0,
  0,
  24,
  24,
  24,
  24,
  24,
  24,
  56,
  0,
  56,
  24,
  24,
  24,
  24,
  24,
  24,
  0,
  0,
  0,
  0,
  0,
  0,
  2,
  53,
  56,
  53,
  2,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  2,
  24,
  2,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  24,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  0,
  0,
  20
], Ui = [
  17,
  0,
  0,
  0,
  0,
  0,
  0,
  16,
  0,
  0,
  0,
  0,
  0,
  0,
  15,
  0,
  0,
  17,
  0,
  0,
  0,
  0,
  0,
  16,
  0,
  0,
  0,
  0,
  0,
  15,
  0,
  0,
  0,
  0,
  17,
  0,
  0,
  0,
  0,
  16,
  0,
  0,
  0,
  0,
  15,
  0,
  0,
  0,
  0,
  0,
  0,
  17,
  0,
  0,
  0,
  16,
  0,
  0,
  0,
  15,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  17,
  0,
  0,
  16,
  0,
  0,
  15,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  17,
  0,
  16,
  0,
  15,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  17,
  16,
  15,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  -15,
  -16,
  -17,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  -15,
  0,
  -16,
  0,
  -17,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  -15,
  0,
  0,
  -16,
  0,
  0,
  -17,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  -15,
  0,
  0,
  0,
  -16,
  0,
  0,
  0,
  -17,
  0,
  0,
  0,
  0,
  0,
  0,
  -15,
  0,
  0,
  0,
  0,
  -16,
  0,
  0,
  0,
  0,
  -17,
  0,
  0,
  0,
  0,
  -15,
  0,
  0,
  0,
  0,
  0,
  -16,
  0,
  0,
  0,
  0,
  0,
  -17,
  0,
  0,
  -15,
  0,
  0,
  0,
  0,
  0,
  0,
  -16,
  0,
  0,
  0,
  0,
  0,
  0,
  -17
], Wi = { p: 1, n: 2, b: 4, r: 8, q: 16, k: 32 }, ji = "pnbrqkPNBRQK", mt = [Le, be, ue, V], Yi = 7, Gi = 6, Xi = 1, Qi = 0, ve = {
  [O]: M.KSIDE_CASTLE,
  [V]: M.QSIDE_CASTLE
}, X = {
  w: [
    { square: A.a1, flag: M.QSIDE_CASTLE },
    { square: A.h1, flag: M.KSIDE_CASTLE }
  ],
  b: [
    { square: A.a8, flag: M.QSIDE_CASTLE },
    { square: A.h8, flag: M.KSIDE_CASTLE }
  ]
}, Vi = { b: Xi, w: Gi }, Oe = "--";
function ee(c) {
  return c >> 4;
}
function fe(c) {
  return c & 15;
}
function At(c) {
  return "0123456789".indexOf(c) !== -1;
}
function $(c) {
  const e = fe(c), t = ee(c);
  return "abcdefgh".substring(e, e + 1) + "87654321".substring(t, t + 1);
}
function ce(c) {
  return c === F ? D : F;
}
function Ji(c) {
  const e = c.split(/\s+/);
  if (e.length !== 6)
    return {
      ok: !1,
      error: "Invalid FEN: must contain six space-delimited fields"
    };
  const t = parseInt(e[5], 10);
  if (isNaN(t) || t <= 0)
    return {
      ok: !1,
      error: "Invalid FEN: move number must be a positive integer"
    };
  const s = parseInt(e[4], 10);
  if (isNaN(s) || s < 0)
    return {
      ok: !1,
      error: "Invalid FEN: half move counter number must be a non-negative integer"
    };
  if (!/^(-|[abcdefgh][36])$/.test(e[3]))
    return { ok: !1, error: "Invalid FEN: en-passant square is invalid" };
  if (/[^kKqQ-]/.test(e[2]))
    return { ok: !1, error: "Invalid FEN: castling availability is invalid" };
  if (!/^(w|b)$/.test(e[1]))
    return { ok: !1, error: "Invalid FEN: side-to-move is invalid" };
  const i = e[0].split("/");
  if (i.length !== 8)
    return {
      ok: !1,
      error: "Invalid FEN: piece data does not contain 8 '/'-delimited rows"
    };
  for (let o = 0; o < i.length; o++) {
    let n = 0, a = !1;
    for (let h = 0; h < i[o].length; h++)
      if (At(i[o][h])) {
        if (a)
          return {
            ok: !1,
            error: "Invalid FEN: piece data is invalid (consecutive number)"
          };
        n += parseInt(i[o][h], 10), a = !0;
      } else {
        if (!/^[prnbqkPRNBQK]$/.test(i[o][h]))
          return {
            ok: !1,
            error: "Invalid FEN: piece data is invalid (invalid piece)"
          };
        n += 1, a = !1;
      }
    if (n !== 8)
      return {
        ok: !1,
        error: "Invalid FEN: piece data is invalid (too many squares in rank)"
      };
  }
  if (e[3][1] == "3" && e[1] == "w" || e[3][1] == "6" && e[1] == "b")
    return { ok: !1, error: "Invalid FEN: illegal en-passant square" };
  const r = [
    { color: "white", regex: /K/g },
    { color: "black", regex: /k/g }
  ];
  for (const { color: o, regex: n } of r) {
    if (!n.test(e[0]))
      return { ok: !1, error: `Invalid FEN: missing ${o} king` };
    if ((e[0].match(n) || []).length > 1)
      return { ok: !1, error: `Invalid FEN: too many ${o} kings` };
  }
  return Array.from(i[0] + i[7]).some((o) => o.toUpperCase() === "P") ? {
    ok: !1,
    error: "Invalid FEN: some pawns are on the edge rows"
  } : { ok: !0 };
}
function Zi(c, e) {
  const t = c.from, s = c.to, i = c.piece;
  let r = 0, o = 0, n = 0;
  for (let a = 0, h = e.length; a < h; a++) {
    const d = e[a].from, m = e[a].to, p = e[a].piece;
    i === p && t !== d && s === m && (r++, ee(t) === ee(d) && o++, fe(t) === fe(d) && n++);
  }
  return r > 0 ? o > 0 && n > 0 ? $(t) : n > 0 ? $(t).charAt(1) : $(t).charAt(0) : "";
}
function Q(c, e, t, s, i, r = void 0, o = M.NORMAL) {
  const n = ee(s);
  if (i === N && (n === Yi || n === Qi))
    for (let a = 0; a < mt.length; a++) {
      const h = mt[a];
      c.push({
        color: e,
        from: t,
        to: s,
        piece: i,
        captured: r,
        promotion: h,
        flags: o | M.PROMOTION
      });
    }
  else
    c.push({
      color: e,
      from: t,
      to: s,
      piece: i,
      captured: r,
      flags: o
    });
}
function pt(c) {
  let e = c.charAt(0);
  return e >= "a" && e <= "h" ? c.match(/[a-h]\d.*[a-h]\d/) ? void 0 : N : (e = e.toLowerCase(), e === "o" ? O : e);
}
function Ie(c) {
  return c.replace(/=/, "").replace(/[+#]?[?!]*$/, "");
}
class $e {
  constructor(e = qe, { skipValidation: t = !1 } = {}) {
    q(this, "_board", new Array(128));
    q(this, "_turn", F);
    q(this, "_header", {});
    q(this, "_kings", { w: R, b: R });
    q(this, "_epSquare", -1);
    q(this, "_halfMoves", 0);
    q(this, "_moveNumber", 0);
    q(this, "_history", []);
    q(this, "_comments", {});
    q(this, "_castling", { w: 0, b: 0 });
    q(this, "_hash", 0n);
    // tracks number of times a position has been seen for repetition checking
    q(this, "_positionCount", /* @__PURE__ */ new Map());
    this.load(e, { skipValidation: t });
  }
  clear({ preserveHeaders: e = !1 } = {}) {
    this._board = new Array(128), this._kings = { w: R, b: R }, this._turn = F, this._castling = { w: 0, b: 0 }, this._epSquare = R, this._halfMoves = 0, this._moveNumber = 1, this._history = [], this._comments = {}, this._header = e ? this._header : { ...zi }, this._hash = this._computeHash(), this._positionCount = /* @__PURE__ */ new Map(), this._header.SetUp = null, this._header.FEN = null;
  }
  load(e, { skipValidation: t = !1, preserveHeaders: s = !1 } = {}) {
    let i = e.split(/\s+/);
    if (i.length >= 2 && i.length < 6) {
      const n = ["-", "-", "0", "1"];
      e = i.concat(n.slice(-(6 - i.length))).join(" ");
    }
    if (i = e.split(/\s+/), !t) {
      const { ok: n, error: a } = Ji(e);
      if (!n)
        throw new Error(a);
    }
    const r = i[0];
    let o = 0;
    this.clear({ preserveHeaders: s });
    for (let n = 0; n < r.length; n++) {
      const a = r.charAt(n);
      if (a === "/")
        o += 8;
      else if (At(a))
        o += parseInt(a, 10);
      else {
        const h = a < "a" ? F : D;
        this._put({ type: a.toLowerCase(), color: h }, $(o)), o++;
      }
    }
    this._turn = i[1], i[2].indexOf("K") > -1 && (this._castling.w |= M.KSIDE_CASTLE), i[2].indexOf("Q") > -1 && (this._castling.w |= M.QSIDE_CASTLE), i[2].indexOf("k") > -1 && (this._castling.b |= M.KSIDE_CASTLE), i[2].indexOf("q") > -1 && (this._castling.b |= M.QSIDE_CASTLE), this._epSquare = i[3] === "-" ? R : A[i[3]], this._halfMoves = parseInt(i[4], 10), this._moveNumber = parseInt(i[5], 10), this._hash = this._computeHash(), this._updateSetup(e), this._incPositionCount();
  }
  fen({ forceEnpassantSquare: e = !1 } = {}) {
    var o, n;
    let t = 0, s = "";
    for (let a = A.a8; a <= A.h1; a++) {
      if (this._board[a]) {
        t > 0 && (s += t, t = 0);
        const { color: h, type: d } = this._board[a];
        s += h === F ? d.toUpperCase() : d.toLowerCase();
      } else
        t++;
      a + 1 & 136 && (t > 0 && (s += t), a !== A.h1 && (s += "/"), t = 0, a += 8);
    }
    let i = "";
    this._castling[F] & M.KSIDE_CASTLE && (i += "K"), this._castling[F] & M.QSIDE_CASTLE && (i += "Q"), this._castling[D] & M.KSIDE_CASTLE && (i += "k"), this._castling[D] & M.QSIDE_CASTLE && (i += "q"), i = i || "-";
    let r = "-";
    if (this._epSquare !== R)
      if (e)
        r = $(this._epSquare);
      else {
        const a = this._epSquare + (this._turn === F ? 16 : -16), h = [a + 1, a - 1];
        for (const d of h) {
          if (d & 136)
            continue;
          const m = this._turn;
          if (((o = this._board[d]) == null ? void 0 : o.color) === m && ((n = this._board[d]) == null ? void 0 : n.type) === N) {
            this._makeMove({
              color: m,
              from: d,
              to: this._epSquare,
              piece: N,
              captured: N,
              flags: M.EP_CAPTURE
            });
            const p = !this._isKingAttacked(m);
            if (this._undoMove(), p) {
              r = $(this._epSquare);
              break;
            }
          }
        }
      }
    return [
      s,
      this._turn,
      i,
      r,
      this._halfMoves,
      this._moveNumber
    ].join(" ");
  }
  _pieceKey(e) {
    if (!this._board[e])
      return 0n;
    const { color: t, type: s } = this._board[e], i = {
      w: 0,
      b: 1
    }[t], r = {
      p: 0,
      n: 1,
      b: 2,
      r: 3,
      q: 4,
      k: 5
    }[s];
    return Hi[i][r][e];
  }
  _epKey() {
    return this._epSquare === R ? 0n : xi[this._epSquare & 7];
  }
  _castlingKey() {
    const e = this._castling.w >> 5 | this._castling.b >> 3;
    return Di[e];
  }
  _computeHash() {
    let e = 0n;
    for (let t = A.a8; t <= A.h1; t++) {
      if (t & 136) {
        t += 7;
        continue;
      }
      this._board[t] && (e ^= this._pieceKey(t));
    }
    return e ^= this._epKey(), e ^= this._castlingKey(), this._turn === "b" && (e ^= ke), e;
  }
  /*
   * Called when the initial board setup is changed with put() or remove().
   * modifies the SetUp and FEN properties of the header object. If the FEN
   * is equal to the default position, the SetUp and FEN are deleted the setup
   * is only updated if history.length is zero, ie moves haven't been made.
   */
  _updateSetup(e) {
    this._history.length > 0 || (e !== qe ? (this._header.SetUp = "1", this._header.FEN = e) : (this._header.SetUp = null, this._header.FEN = null));
  }
  reset() {
    this.load(qe);
  }
  get(e) {
    return this._board[A[e]];
  }
  findPiece(e) {
    var s;
    const t = [];
    for (let i = A.a8; i <= A.h1; i++) {
      if (i & 136) {
        i += 7;
        continue;
      }
      !this._board[i] || ((s = this._board[i]) == null ? void 0 : s.color) !== e.color || this._board[i].color === e.color && this._board[i].type === e.type && t.push($(i));
    }
    return t;
  }
  put({ type: e, color: t }, s) {
    return this._put({ type: e, color: t }, s) ? (this._updateCastlingRights(), this._updateEnPassantSquare(), this._updateSetup(this.fen()), !0) : !1;
  }
  _set(e, t) {
    this._hash ^= this._pieceKey(e), this._board[e] = t, this._hash ^= this._pieceKey(e);
  }
  _put({ type: e, color: t }, s) {
    if (ji.indexOf(e.toLowerCase()) === -1 || !(s in A))
      return !1;
    const i = A[s];
    if (e == O && !(this._kings[t] == R || this._kings[t] == i))
      return !1;
    const r = this._board[i];
    return r && r.type === O && (this._kings[r.color] = R), this._set(i, { type: e, color: t }), e === O && (this._kings[t] = i), !0;
  }
  _clear(e) {
    this._hash ^= this._pieceKey(e), delete this._board[e];
  }
  remove(e) {
    const t = this.get(e);
    return this._clear(A[e]), t && t.type === O && (this._kings[t.color] = R), this._updateCastlingRights(), this._updateEnPassantSquare(), this._updateSetup(this.fen()), t;
  }
  _updateCastlingRights() {
    var s, i, r, o, n, a, h, d, m, p, _, v;
    this._hash ^= this._castlingKey();
    const e = ((s = this._board[A.e1]) == null ? void 0 : s.type) === O && ((i = this._board[A.e1]) == null ? void 0 : i.color) === F, t = ((r = this._board[A.e8]) == null ? void 0 : r.type) === O && ((o = this._board[A.e8]) == null ? void 0 : o.color) === D;
    (!e || ((n = this._board[A.a1]) == null ? void 0 : n.type) !== ue || ((a = this._board[A.a1]) == null ? void 0 : a.color) !== F) && (this._castling.w &= -65), (!e || ((h = this._board[A.h1]) == null ? void 0 : h.type) !== ue || ((d = this._board[A.h1]) == null ? void 0 : d.color) !== F) && (this._castling.w &= -33), (!t || ((m = this._board[A.a8]) == null ? void 0 : m.type) !== ue || ((p = this._board[A.a8]) == null ? void 0 : p.color) !== D) && (this._castling.b &= -65), (!t || ((_ = this._board[A.h8]) == null ? void 0 : _.type) !== ue || ((v = this._board[A.h8]) == null ? void 0 : v.color) !== D) && (this._castling.b &= -33), this._hash ^= this._castlingKey();
  }
  _updateEnPassantSquare() {
    var r, o;
    if (this._epSquare === R)
      return;
    const e = this._epSquare + (this._turn === F ? -16 : 16), t = this._epSquare + (this._turn === F ? 16 : -16), s = [t + 1, t - 1];
    if (this._board[e] !== null || this._board[this._epSquare] !== null || ((r = this._board[t]) == null ? void 0 : r.color) !== ce(this._turn) || ((o = this._board[t]) == null ? void 0 : o.type) !== N) {
      this._hash ^= this._epKey(), this._epSquare = R;
      return;
    }
    const i = (n) => {
      var a, h;
      return !(n & 136) && ((a = this._board[n]) == null ? void 0 : a.color) === this._turn && ((h = this._board[n]) == null ? void 0 : h.type) === N;
    };
    s.some(i) || (this._hash ^= this._epKey(), this._epSquare = R);
  }
  _attacked(e, t, s) {
    const i = [];
    for (let r = A.a8; r <= A.h1; r++) {
      if (r & 136) {
        r += 7;
        continue;
      }
      if (this._board[r] === void 0 || this._board[r].color !== e)
        continue;
      const o = this._board[r], n = r - t;
      if (n === 0)
        continue;
      const a = n + 119;
      if (Bi[a] & Wi[o.type]) {
        if (o.type === N) {
          if (n > 0 && o.color === F || n <= 0 && o.color === D)
            if (s)
              i.push($(r));
            else
              return !0;
          continue;
        }
        if (o.type === "n" || o.type === "k")
          if (s) {
            i.push($(r));
            continue;
          } else
            return !0;
        const h = Ui[a];
        let d = r + h, m = !1;
        for (; d !== t; ) {
          if (this._board[d] != null) {
            m = !0;
            break;
          }
          d += h;
        }
        if (!m)
          if (s) {
            i.push($(r));
            continue;
          } else
            return !0;
      }
    }
    return s ? i : !1;
  }
  attackers(e, t) {
    return t ? this._attacked(t, A[e], !0) : this._attacked(this._turn, A[e], !0);
  }
  _isKingAttacked(e) {
    const t = this._kings[e];
    return t === -1 ? !1 : this._attacked(ce(e), t);
  }
  hash() {
    return this._hash.toString(16);
  }
  isAttacked(e, t) {
    return this._attacked(t, A[e]);
  }
  isCheck() {
    return this._isKingAttacked(this._turn);
  }
  inCheck() {
    return this.isCheck();
  }
  isCheckmate() {
    return this.isCheck() && this._moves().length === 0;
  }
  isStalemate() {
    return !this.isCheck() && this._moves().length === 0;
  }
  isInsufficientMaterial() {
    const e = {
      b: 0,
      n: 0,
      r: 0,
      q: 0,
      k: 0,
      p: 0
    }, t = [];
    let s = 0, i = 0;
    for (let r = A.a8; r <= A.h1; r++) {
      if (i = (i + 1) % 2, r & 136) {
        r += 7;
        continue;
      }
      const o = this._board[r];
      o && (e[o.type] = o.type in e ? e[o.type] + 1 : 1, o.type === be && t.push(i), s++);
    }
    if (s === 2)
      return !0;
    if (
      // k vs. kn .... or .... k vs. kb
      s === 3 && (e[be] === 1 || e[Le] === 1)
    )
      return !0;
    if (s === e[be] + 2) {
      let r = 0;
      const o = t.length;
      for (let n = 0; n < o; n++)
        r += t[n];
      if (r === 0 || r === o)
        return !0;
    }
    return !1;
  }
  isThreefoldRepetition() {
    return this._getPositionCount(this._hash) >= 3;
  }
  isDrawByFiftyMoves() {
    return this._halfMoves >= 100;
  }
  isDraw() {
    return this.isDrawByFiftyMoves() || this.isStalemate() || this.isInsufficientMaterial() || this.isThreefoldRepetition();
  }
  isGameOver() {
    return this.isCheckmate() || this.isDraw();
  }
  moves({ verbose: e = !1, square: t = void 0, piece: s = void 0 } = {}) {
    const i = this._moves({ square: t, piece: s });
    return e ? i.map((r) => new _e(this, r)) : i.map((r) => this._moveToSan(r, i));
  }
  _moves({ legal: e = !0, piece: t = void 0, square: s = void 0 } = {}) {
    var _;
    const i = s ? s.toLowerCase() : void 0, r = t == null ? void 0 : t.toLowerCase(), o = [], n = this._turn, a = ce(n);
    let h = A.a8, d = A.h1, m = !1;
    if (i)
      if (i in A)
        h = d = A[i], m = !0;
      else
        return [];
    for (let v = h; v <= d; v++) {
      if (v & 136) {
        v += 7;
        continue;
      }
      if (!this._board[v] || this._board[v].color === a)
        continue;
      const { type: P } = this._board[v];
      let C;
      if (P === N) {
        if (r && r !== P)
          continue;
        C = v + Ne[n][0], this._board[C] || (Q(o, n, v, C, N), C = v + Ne[n][1], Vi[n] === ee(v) && !this._board[C] && Q(o, n, v, C, N, void 0, M.BIG_PAWN));
        for (let T = 2; T < 4; T++)
          C = v + Ne[n][T], !(C & 136) && (((_ = this._board[C]) == null ? void 0 : _.color) === a ? Q(o, n, v, C, N, this._board[C].type, M.CAPTURE) : C === this._epSquare && Q(o, n, v, C, N, N, M.EP_CAPTURE));
      } else {
        if (r && r !== P)
          continue;
        for (let T = 0, k = dt[P].length; T < k; T++) {
          const x = dt[P][T];
          for (C = v; C += x, !(C & 136); ) {
            if (!this._board[C])
              Q(o, n, v, C, P);
            else {
              if (this._board[C].color === n)
                break;
              Q(o, n, v, C, P, this._board[C].type, M.CAPTURE);
              break;
            }
            if (P === Le || P === O)
              break;
          }
        }
      }
    }
    if ((r === void 0 || r === O) && (!m || d === this._kings[n])) {
      if (this._castling[n] & M.KSIDE_CASTLE) {
        const v = this._kings[n], P = v + 2;
        !this._board[v + 1] && !this._board[P] && !this._attacked(a, this._kings[n]) && !this._attacked(a, v + 1) && !this._attacked(a, P) && Q(o, n, this._kings[n], P, O, void 0, M.KSIDE_CASTLE);
      }
      if (this._castling[n] & M.QSIDE_CASTLE) {
        const v = this._kings[n], P = v - 2;
        !this._board[v - 1] && !this._board[v - 2] && !this._board[v - 3] && !this._attacked(a, this._kings[n]) && !this._attacked(a, v - 1) && !this._attacked(a, P) && Q(o, n, this._kings[n], P, O, void 0, M.QSIDE_CASTLE);
      }
    }
    if (!e || this._kings[n] === -1)
      return o;
    const p = [];
    for (let v = 0, P = o.length; v < P; v++)
      this._makeMove(o[v]), this._isKingAttacked(n) || p.push(o[v]), this._undoMove();
    return p;
  }
  move(e, { strict: t = !1 } = {}) {
    let s = null;
    if (typeof e == "string")
      s = this._moveFromSan(e, t);
    else if (e === null)
      s = this._moveFromSan(Oe, t);
    else if (typeof e == "object") {
      const r = this._moves();
      for (let o = 0, n = r.length; o < n; o++)
        if (e.from === $(r[o].from) && e.to === $(r[o].to) && (!("promotion" in r[o]) || e.promotion === r[o].promotion)) {
          s = r[o];
          break;
        }
    }
    if (!s)
      throw typeof e == "string" ? new Error(`Invalid move: ${e}`) : new Error(`Invalid move: ${JSON.stringify(e)}`);
    if (this.isCheck() && s.flags & M.NULL_MOVE)
      throw new Error("Null move not allowed when in check");
    const i = new _e(this, s);
    return this._makeMove(s), this._incPositionCount(), i;
  }
  _push(e) {
    this._history.push({
      move: e,
      kings: { b: this._kings.b, w: this._kings.w },
      turn: this._turn,
      castling: { b: this._castling.b, w: this._castling.w },
      epSquare: this._epSquare,
      halfMoves: this._halfMoves,
      moveNumber: this._moveNumber
    });
  }
  _movePiece(e, t) {
    this._hash ^= this._pieceKey(e), this._board[t] = this._board[e], delete this._board[e], this._hash ^= this._pieceKey(t);
  }
  _makeMove(e) {
    var i, r, o, n;
    const t = this._turn, s = ce(t);
    if (this._push(e), e.flags & M.NULL_MOVE) {
      t === D && this._moveNumber++, this._halfMoves++, this._turn = s, this._epSquare = R;
      return;
    }
    if (this._hash ^= this._epKey(), this._hash ^= this._castlingKey(), e.captured && (this._hash ^= this._pieceKey(e.to)), this._movePiece(e.from, e.to), e.flags & M.EP_CAPTURE && (this._turn === D ? this._clear(e.to - 16) : this._clear(e.to + 16)), e.promotion && (this._clear(e.to), this._set(e.to, { type: e.promotion, color: t })), this._board[e.to].type === O) {
      if (this._kings[t] = e.to, e.flags & M.KSIDE_CASTLE) {
        const a = e.to - 1, h = e.to + 1;
        this._movePiece(h, a);
      } else if (e.flags & M.QSIDE_CASTLE) {
        const a = e.to + 1, h = e.to - 2;
        this._movePiece(h, a);
      }
      this._castling[t] = 0;
    }
    if (this._castling[t]) {
      for (let a = 0, h = X[t].length; a < h; a++)
        if (e.from === X[t][a].square && this._castling[t] & X[t][a].flag) {
          this._castling[t] ^= X[t][a].flag;
          break;
        }
    }
    if (this._castling[s]) {
      for (let a = 0, h = X[s].length; a < h; a++)
        if (e.to === X[s][a].square && this._castling[s] & X[s][a].flag) {
          this._castling[s] ^= X[s][a].flag;
          break;
        }
    }
    if (this._hash ^= this._castlingKey(), e.flags & M.BIG_PAWN) {
      let a;
      t === D ? a = e.to - 16 : a = e.to + 16, !(e.to - 1 & 136) && ((i = this._board[e.to - 1]) == null ? void 0 : i.type) === N && ((r = this._board[e.to - 1]) == null ? void 0 : r.color) === s || !(e.to + 1 & 136) && ((o = this._board[e.to + 1]) == null ? void 0 : o.type) === N && ((n = this._board[e.to + 1]) == null ? void 0 : n.color) === s ? (this._epSquare = a, this._hash ^= this._epKey()) : this._epSquare = R;
    } else
      this._epSquare = R;
    e.piece === N ? this._halfMoves = 0 : e.flags & (M.CAPTURE | M.EP_CAPTURE) ? this._halfMoves = 0 : this._halfMoves++, t === D && this._moveNumber++, this._turn = s, this._hash ^= ke;
  }
  undo() {
    const e = this._hash, t = this._undoMove();
    if (t) {
      const s = new _e(this, t);
      return this._decPositionCount(e), s;
    }
    return null;
  }
  _undoMove() {
    const e = this._history.pop();
    if (e === void 0)
      return null;
    this._hash ^= this._epKey(), this._hash ^= this._castlingKey();
    const t = e.move;
    this._kings = e.kings, this._turn = e.turn, this._castling = e.castling, this._epSquare = e.epSquare, this._halfMoves = e.halfMoves, this._moveNumber = e.moveNumber, this._hash ^= this._epKey(), this._hash ^= this._castlingKey(), this._hash ^= ke;
    const s = this._turn, i = ce(s);
    if (t.flags & M.NULL_MOVE)
      return t;
    if (this._movePiece(t.to, t.from), t.piece && (this._clear(t.from), this._set(t.from, { type: t.piece, color: s })), t.captured)
      if (t.flags & M.EP_CAPTURE) {
        let r;
        s === D ? r = t.to - 16 : r = t.to + 16, this._set(r, { type: N, color: i });
      } else
        this._set(t.to, { type: t.captured, color: i });
    if (t.flags & (M.KSIDE_CASTLE | M.QSIDE_CASTLE)) {
      let r, o;
      t.flags & M.KSIDE_CASTLE ? (r = t.to + 1, o = t.to - 1) : (r = t.to - 2, o = t.to + 1), this._movePiece(o, r);
    }
    return t;
  }
  pgn({ newline: e = `
`, maxWidth: t = 0 } = {}) {
    const s = [];
    let i = !1;
    for (const p in this._header)
      this._header[p] && s.push(`[${p} "${this._header[p]}"]` + e), i = !0;
    i && this._history.length && s.push(e);
    const r = (p) => {
      const _ = this._comments[this.fen()];
      if (typeof _ < "u") {
        const v = p.length > 0 ? " " : "";
        p = `${p}${v}{${_}}`;
      }
      return p;
    }, o = [];
    for (; this._history.length > 0; )
      o.push(this._undoMove());
    const n = [];
    let a = "";
    for (o.length === 0 && n.push(r("")); o.length > 0; ) {
      a = r(a);
      const p = o.pop();
      if (!p)
        break;
      if (!this._history.length && p.color === "b") {
        const _ = `${this._moveNumber}. ...`;
        a = a ? `${a} ${_}` : _;
      } else p.color === "w" && (a.length && n.push(a), a = this._moveNumber + ".");
      a = a + " " + this._moveToSan(p, this._moves({ legal: !0 })), this._makeMove(p);
    }
    if (a.length && n.push(r(a)), n.push(this._header.Result || "*"), t === 0)
      return s.join("") + n.join(" ");
    const h = function() {
      return s.length > 0 && s[s.length - 1] === " " ? (s.pop(), !0) : !1;
    }, d = function(p, _) {
      for (const v of _.split(" "))
        if (v) {
          if (p + v.length > t) {
            for (; h(); )
              p--;
            s.push(e), p = 0;
          }
          s.push(v), p += v.length, s.push(" "), p++;
        }
      return h() && p--, p;
    };
    let m = 0;
    for (let p = 0; p < n.length; p++) {
      if (m + n[p].length > t && n[p].includes("{")) {
        m = d(m, n[p]);
        continue;
      }
      m + n[p].length > t && p !== 0 ? (s[s.length - 1] === " " && s.pop(), s.push(e), m = 0) : p !== 0 && (s.push(" "), m++), s.push(n[p]), m += n[p].length;
    }
    return s.join("");
  }
  /**
   * @deprecated Use `setHeader` and `getHeaders` instead. This method will return null header tags (which is not what you want)
   */
  header(...e) {
    for (let t = 0; t < e.length; t += 2)
      typeof e[t] == "string" && typeof e[t + 1] == "string" && (this._header[e[t]] = e[t + 1]);
    return this._header;
  }
  // TODO: value validation per spec
  setHeader(e, t) {
    return this._header[e] = t ?? He[e] ?? null, this.getHeaders();
  }
  removeHeader(e) {
    return e in this._header ? (this._header[e] = He[e] || null, !0) : !1;
  }
  // return only non-null headers (omit placemarker nulls)
  getHeaders() {
    const e = {};
    for (const [t, s] of Object.entries(this._header))
      s !== null && (e[t] = s);
    return e;
  }
  loadPgn(e, { strict: t = !1, newlineChar: s = `\r?
` } = {}) {
    s !== `\r?
` && (e = e.replace(new RegExp(s, "g"), `
`));
    const i = Fi(e);
    this.reset();
    const r = i.headers;
    let o = "";
    for (const h in r)
      h.toLowerCase() === "fen" && (o = r[h]), this.header(h, r[h]);
    if (!t)
      o && this.load(o, { preserveHeaders: !0 });
    else if (r.SetUp === "1") {
      if (!("FEN" in r))
        throw new Error("Invalid PGN: FEN tag must be supplied with SetUp tag");
      this.load(r.FEN, { preserveHeaders: !0 });
    }
    let n = i.root;
    for (; n; ) {
      if (n.move) {
        const h = this._moveFromSan(n.move, t);
        if (h == null)
          throw new Error(`Invalid move in PGN: ${n.move}`);
        this._makeMove(h), this._incPositionCount();
      }
      n.comment !== void 0 && (this._comments[this.fen()] = n.comment), n = n.variations[0];
    }
    const a = i.result;
    a && Object.keys(this._header).length && this._header.Result !== a && this.setHeader("Result", a);
  }
  /*
   * Convert a move from 0x88 coordinates to Standard Algebraic Notation
   * (SAN)
   *
   * @param {boolean} strict Use the strict SAN parser. It will throw errors
   * on overly disambiguated moves (see below):
   *
   * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
   * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
   * 4. ... Ne7 is technically the valid SAN
   */
  _moveToSan(e, t) {
    let s = "";
    if (e.flags & M.KSIDE_CASTLE)
      s = "O-O";
    else if (e.flags & M.QSIDE_CASTLE)
      s = "O-O-O";
    else {
      if (e.flags & M.NULL_MOVE)
        return Oe;
      if (e.piece !== N) {
        const i = Zi(e, t);
        s += e.piece.toUpperCase() + i;
      }
      e.flags & (M.CAPTURE | M.EP_CAPTURE) && (e.piece === N && (s += $(e.from)[0]), s += "x"), s += $(e.to), e.promotion && (s += "=" + e.promotion.toUpperCase());
    }
    return this._makeMove(e), this.isCheck() && (this.isCheckmate() ? s += "#" : s += "+"), this._undoMove(), s;
  }
  // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
  _moveFromSan(e, t = !1) {
    let s = Ie(e);
    if (t || (s === "0-0" ? s = "O-O" : s === "0-0-0" && (s = "O-O-O")), s == Oe)
      return {
        color: this._turn,
        from: 0,
        to: 0,
        piece: "k",
        flags: M.NULL_MOVE
      };
    let i = pt(s), r = this._moves({ legal: !0, piece: i });
    for (let p = 0, _ = r.length; p < _; p++)
      if (s === Ie(this._moveToSan(r[p], r)))
        return r[p];
    if (t)
      return null;
    let o, n, a, h, d, m = !1;
    if (n = s.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/), n ? (o = n[1], a = n[2], h = n[3], d = n[4], a.length == 1 && (m = !0)) : (n = s.match(/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/), n && (o = n[1], a = n[2], h = n[3], d = n[4], a.length == 1 && (m = !0))), i = pt(s), r = this._moves({
      legal: !0,
      piece: o || i
    }), !h)
      return null;
    for (let p = 0, _ = r.length; p < _; p++)
      if (a) {
        if ((!o || o.toLowerCase() == r[p].piece) && A[a] == r[p].from && A[h] == r[p].to && (!d || d.toLowerCase() == r[p].promotion))
          return r[p];
        if (m) {
          const v = $(r[p].from);
          if ((!o || o.toLowerCase() == r[p].piece) && A[h] == r[p].to && (a == v[0] || a == v[1]) && (!d || d.toLowerCase() == r[p].promotion))
            return r[p];
        }
      } else if (s === Ie(this._moveToSan(r[p], r)).replace("x", ""))
        return r[p];
    return null;
  }
  ascii() {
    let e = `   +------------------------+
`;
    for (let t = A.a8; t <= A.h1; t++) {
      if (fe(t) === 0 && (e += " " + "87654321"[ee(t)] + " |"), this._board[t]) {
        const s = this._board[t].type, r = this._board[t].color === F ? s.toUpperCase() : s.toLowerCase();
        e += " " + r + " ";
      } else
        e += " . ";
      t + 1 & 136 && (e += `|
`, t += 8);
    }
    return e += `   +------------------------+
`, e += "     a  b  c  d  e  f  g  h", e;
  }
  perft(e) {
    const t = this._moves({ legal: !1 });
    let s = 0;
    const i = this._turn;
    for (let r = 0, o = t.length; r < o; r++)
      this._makeMove(t[r]), this._isKingAttacked(i) || (e - 1 > 0 ? s += this.perft(e - 1) : s++), this._undoMove();
    return s;
  }
  setTurn(e) {
    return this._turn == e ? !1 : (this.move("--"), !0);
  }
  turn() {
    return this._turn;
  }
  board() {
    const e = [];
    let t = [];
    for (let s = A.a8; s <= A.h1; s++)
      this._board[s] == null ? t.push(null) : t.push({
        square: $(s),
        type: this._board[s].type,
        color: this._board[s].color
      }), s + 1 & 136 && (e.push(t), t = [], s += 8);
    return e;
  }
  squareColor(e) {
    if (e in A) {
      const t = A[e];
      return (ee(t) + fe(t)) % 2 === 0 ? "light" : "dark";
    }
    return null;
  }
  history({ verbose: e = !1 } = {}) {
    const t = [], s = [];
    for (; this._history.length > 0; )
      t.push(this._undoMove());
    for (; ; ) {
      const i = t.pop();
      if (!i)
        break;
      e ? s.push(new _e(this, i)) : s.push(this._moveToSan(i, this._moves())), this._makeMove(i);
    }
    return s;
  }
  /*
   * Keeps track of position occurrence counts for the purpose of repetition
   * checking. Old positions are removed from the map if their counts are reduced to 0.
   */
  _getPositionCount(e) {
    return this._positionCount.get(e) ?? 0;
  }
  _incPositionCount() {
    this._positionCount.set(this._hash, (this._positionCount.get(this._hash) ?? 0) + 1);
  }
  _decPositionCount(e) {
    const t = this._positionCount.get(e) ?? 0;
    t === 1 ? this._positionCount.delete(e) : this._positionCount.set(e, t - 1);
  }
  _pruneComments() {
    const e = [], t = {}, s = (i) => {
      i in this._comments && (t[i] = this._comments[i]);
    };
    for (; this._history.length > 0; )
      e.push(this._undoMove());
    for (s(this.fen()); ; ) {
      const i = e.pop();
      if (!i)
        break;
      this._makeMove(i), s(this.fen());
    }
    this._comments = t;
  }
  getComment() {
    return this._comments[this.fen()];
  }
  setComment(e) {
    this._comments[this.fen()] = e.replace("{", "[").replace("}", "]");
  }
  /**
   * @deprecated Renamed to `removeComment` for consistency
   */
  deleteComment() {
    return this.removeComment();
  }
  removeComment() {
    const e = this._comments[this.fen()];
    return delete this._comments[this.fen()], e;
  }
  getComments() {
    return this._pruneComments(), Object.keys(this._comments).map((e) => ({ fen: e, comment: this._comments[e] }));
  }
  /**
   * @deprecated Renamed to `removeComments` for consistency
   */
  deleteComments() {
    return this.removeComments();
  }
  removeComments() {
    return this._pruneComments(), Object.keys(this._comments).map((e) => {
      const t = this._comments[e];
      return delete this._comments[e], { fen: e, comment: t };
    });
  }
  setCastlingRights(e, t) {
    for (const i of [O, V])
      t[i] !== void 0 && (t[i] ? this._castling[e] |= ve[i] : this._castling[e] &= ~ve[i]);
    this._updateCastlingRights();
    const s = this.getCastlingRights(e);
    return (t[O] === void 0 || t[O] === s[O]) && (t[V] === void 0 || t[V] === s[V]);
  }
  getCastlingRights(e) {
    return {
      [O]: (this._castling[e] & ve[O]) !== 0,
      [V]: (this._castling[e] & ve[V]) !== 0
    };
  }
  moveNumber() {
    return this._moveNumber;
  }
}
const es = /%cal\s+([^%\s]+)/g, ts = /%csl\s+([^%\s]+)/g, _t = /%(?:cal|csl)\s+[^%\s]+/, is = /^[a-h][1-8]$/, Re = {
  R: "#ff0000",
  // Red
  G: "#00ff00",
  // Green
  Y: "#ffff00",
  // Yellow
  B: "#0000ff"
  // Blue
};
class B {
  /**
   * Check if a comment contains visual annotations
   */
  static hasVisualAnnotations(e) {
    return _t.test(e);
  }
  /**
   * Parse visual annotations from a PGN comment
   */
  static parseComment(e) {
    let t = e.startsWith("{") && e.endsWith("}") ? e.substring(1, e.length - 1) : e;
    const s = [], i = [], r = [...t.matchAll(es)];
    for (const a of r) {
      const h = a[1].split(",");
      for (const d of h) {
        const m = d.trim();
        if (m.length >= 5) {
          const p = m[0], _ = m.slice(1, 3), v = m.slice(3, 5);
          B.isValidSquare(_) && B.isValidSquare(v) && s.push({
            from: _,
            to: v,
            color: B.colorToHex(p)
          });
        }
      }
      t = t.replace(a[0], " ");
    }
    const o = [...t.matchAll(ts)];
    for (const a of o) {
      const h = a[1].split(",");
      for (const d of h) {
        const m = d.trim();
        if (m.length >= 3) {
          const p = m[0], _ = m.slice(1, 3);
          B.isValidSquare(_) && i.push({
            square: _,
            type: "circle",
            // Cast to avoid type issues
            color: B.colorToHex(p)
          });
        }
      }
      t = t.replace(a[0], " ");
    }
    let n = t.replace(/\s+/g, " ").trim();
    return {
      arrows: s,
      highlights: i,
      textComment: n || ""
    };
  }
  /**
   * Returns drawing objects from parsed annotations
   */
  static toDrawingObjects(e) {
    return {
      arrows: e.arrows,
      highlights: e.highlights
    };
  }
  /**
   * Remove visual annotations from a comment, keeping only text
   */
  static stripAnnotations(e) {
    return e.replace(new RegExp(_t.source, "g"), "").replace(/\s+/g, " ").trim();
  }
  /**
   * Create annotation string from arrows and circles
   */
  static fromDrawingObjects(e, t) {
    const s = [];
    if (e.length > 0) {
      const i = e.map((r) => `${B.hexToColor(r.color)}${r.from}${r.to}`).join(",");
      s.push(`%cal ${i}`);
    }
    if (t.length > 0) {
      const i = t.map((r) => `${B.hexToColor(r.color)}${r.square}`).join(",");
      s.push(`%csl ${i}`);
    }
    return s.join(" ");
  }
  /**
   * Convert color code to hex color
   */
  static colorToHex(e) {
    return Re[e] || Re.R;
  }
  /**
   * Convert hex color to color code
   */
  static hexToColor(e) {
    for (const [t, s] of Object.entries(Re))
      if (s === e)
        return t;
    return "R";
  }
  /**
   * Check if a string is a valid chess square notation
   */
  static isValidSquare(e) {
    return is.test(e);
  }
}
class De {
  constructor(e) {
    this.rulesAdapter = e, this.metadata = {
      Event: "Casual Game",
      Site: "Neo Chess Board",
      Date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0].replace(/-/g, "."),
      Round: "1",
      White: "Player 1",
      Black: "Player 2",
      Result: "*"
    }, this.moves = [], this.result = "*";
  }
  /**
   * Set the game metadata (headers)
   */
  setMetadata(e) {
    this.metadata = { ...this.metadata, ...e }, this.metadata.Event || (this.metadata.Event = "Casual Game"), this.metadata.Site || (this.metadata.Site = "Neo Chess Board"), this.metadata.Date || (this.metadata.Date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0].replace(/-/g, ".")), this.metadata.Round || (this.metadata.Round = "1"), this.metadata.White || (this.metadata.White = "Player 1"), this.metadata.Black || (this.metadata.Black = "Player 2"), this.metadata.Result || (this.metadata.Result = this.result);
  }
  /**
   * Add a move to the game
   */
  addMove(e, t, s, i, r) {
    const o = this.moves.findIndex((n) => n.moveNumber === e);
    if (o >= 0) {
      const n = this.moves[o];
      t && (n.white = t), s && (n.black = s), i && (n.whiteComment = i), r && (n.blackComment = r), n.whiteAnnotations || (n.whiteAnnotations = { arrows: [], circles: [], textComment: "" }), n.blackAnnotations || (n.blackAnnotations = { arrows: [], circles: [], textComment: "" });
    } else
      this.moves.push({
        moveNumber: e,
        white: t,
        black: s,
        whiteComment: i,
        blackComment: r,
        whiteAnnotations: { arrows: [], circles: [], textComment: "" },
        blackAnnotations: { arrows: [], circles: [], textComment: "" }
      });
  }
  /**
   * Set the game result
   */
  setResult(e) {
    this.result = e, this.metadata.Result = e;
  }
  /**
   * Import moves from a chess.js game
   */
  importFromChessJs(e) {
    try {
      if (this.rulesAdapter && typeof this.rulesAdapter.getPGN == "function") {
        const t = this.rulesAdapter.getPGN();
        this.parsePgnMoves(t);
      } else if (typeof e.pgn == "function") {
        const t = e.pgn();
        this.parsePgnMoves(t);
      } else {
        const t = e.history({ verbose: !0 });
        this.moves = [];
        for (let s = 0; s < t.length; s++) {
          const i = t[s], r = Math.floor(s / 2) + 1;
          if (s % 2 === 0)
            this.addMove(r, i.san);
          else {
            const n = this.moves.find((a) => a.moveNumber === r);
            n ? n.black = i.san : this.addMove(r, void 0, i.san);
          }
        }
      }
    } catch (t) {
      console.warn("Failed to import proper PGN notation, using fallback:", t);
      const s = e.history();
      this.moves = [];
      for (let i = 0; i < s.length; i += 2) {
        const r = Math.floor(i / 2) + 1, o = s[i], n = s[i + 1];
        this.addMove(r, o, n);
      }
    }
    e.isCheckmate() ? this.setResult(e.turn() === "w" ? "0-1" : "1-0") : e.isStalemate() || e.isThreefoldRepetition() || e.isInsufficientMaterial() ? this.setResult("1/2-1/2") : this.setResult("*");
  }
  /**
   * Parse PGN move text to extract individual moves
   */
  parsePgnMoves(e) {
    this.moves = [];
    let t = e.replace(/\{[^}]*\}/g, "").replace(/\([^)]*\)/g, "");
    const s = /\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, i = t.match(s);
    i && (this.setResult(i[1]), t = t.replace(s, ""));
    const r = /(\d+)\.\s*([^\s]+)(?:\s+([^\s]+))?/g;
    let o;
    for (; (o = r.exec(t)) !== null; ) {
      const n = parseInt(o[1]), a = o[2], h = o[3];
      if (a && !["1-0", "0-1", "1/2-1/2", "*"].includes(a)) {
        const d = h && !["1-0", "0-1", "1/2-1/2", "*"].includes(h) ? h : void 0;
        this.addMove(n, a, d);
      }
    }
  }
  /**
   * Generate the complete PGN string
   */
  toPgn(e = !0) {
    let t = "";
    if (e) {
      const r = ["Event", "Site", "Date", "Round", "White", "Black", "Result"];
      for (const o of r)
        this.metadata[o] && (t += `[${o} "${this.metadata[o]}"]
`);
      for (const [o, n] of Object.entries(this.metadata))
        !r.includes(o) && n && (t += `[${o} "${n}"]
`);
      t += `
`;
    }
    if (this.moves.length === 0 && !e)
      return this.result;
    let s = 0;
    const i = 80;
    for (const r of this.moves) {
      let o = `${r.moveNumber}.`;
      r.white && (o += ` ${r.white}`, r.whiteComment && (o += ` {${r.whiteComment}}`)), r.black && (o += ` ${r.black}`, r.blackComment && (o += ` {${r.blackComment}}`)), s + o.length + 1 > i && (t += `
`, s = 0), s > 0 && (t += " ", s++), t += o, s += o.length;
    }
    return this.result !== "*" && (s > 0 && this.moves.length > 0 && (t += " "), t += this.result), t.trim();
  }
  /**
   * Clear all moves and reset
   */
  clear() {
    this.moves = [], this.result = "*", this.metadata.Result = "*";
  }
  /**
   * Get move count
   */
  getMoveCount() {
    return this.moves.length;
  }
  /**
   * Get current result
   */
  getResult() {
    return this.result;
  }
  /**
   * Create a PGN from a simple move list
   */
  static fromMoveList(e, t) {
    const s = new De();
    s.setMetadata(t || {});
    for (let i = 0; i < e.length; i += 2) {
      const r = Math.floor(i / 2) + 1, o = e[i], n = e[i + 1];
      s.addMove(r, o, n);
    }
    return s.toPgn();
  }
  /**
   * Download PGN as file (browser only)
   */
  downloadPgn(e = "game.pgn") {
    if (typeof window < "u" && window.document) {
      const t = new Blob([this.toPgnWithAnnotations()], { type: "application/x-chess-pgn" }), s = URL.createObjectURL(t), i = document.createElement("a");
      i.href = s, i.download = e, document.body.appendChild(i), i.click(), document.body.removeChild(i), URL.revokeObjectURL(s);
    }
  }
  /**
   * Add visual annotations to a move
   */
  addMoveAnnotations(e, t, s) {
    const i = this.moves.findIndex((r) => r.moveNumber === e);
    i >= 0 && (t ? this.moves[i].whiteAnnotations = s : this.moves[i].blackAnnotations = s);
  }
  /**
   * Parse a PGN string with comments containing visual annotations
   */
  loadPgnWithAnnotations(e) {
    const t = e.split(`
`);
    let s = !1, i = "";
    for (const r of t)
      if (r.startsWith("[")) {
        const o = r.match(/\[(\w+)\s+\"([^\"]*)\"\]/);
        o && (this.metadata[o[1]] = o[2]);
      } else r.trim() && !r.startsWith("[") && (s = !0, i += r + " ");
    s && this.parseMovesWithAnnotations(i);
  }
  /**
   * Parse moves string with embedded annotations
   */
  parseMovesWithAnnotations(e) {
    this.moves = [];
    const t = /(\d+)\.\s*([^\s{]+)(?:\s*(\{[^}]+\}))?(?:\s+([^\s{]+)(?:\s*(\{[^}]+\}))?)?/g;
    let s;
    for (; (s = t.exec(e)) !== null; ) {
      const i = parseInt(s[1]), r = s[2], o = s[3], n = s[4], a = s[5], h = {
        moveNumber: i,
        white: r,
        black: n,
        whiteAnnotations: { arrows: [], circles: [], textComment: "" },
        // Initialize
        blackAnnotations: { arrows: [], circles: [], textComment: "" }
        // Initialize
      };
      if (o) {
        const d = B.parseComment(o);
        h.whiteComment = o, h.whiteAnnotations = {
          arrows: d.arrows,
          circles: d.highlights,
          textComment: d.textComment
        };
      }
      if (n && a) {
        const d = B.parseComment(a);
        h.blackComment = a, h.blackAnnotations = {
          arrows: d.arrows,
          circles: d.highlights,
          textComment: d.textComment
        };
      }
      this.moves.push(h);
    }
  }
  /**
   * Generate PGN with visual annotations embedded in comments
   */
  toPgnWithAnnotations() {
    let e = "";
    const t = ["Event", "Site", "Date", "Round", "White", "Black", "Result"];
    for (const r of t)
      this.metadata[r] && (e += `[${r} "${this.metadata[r]}"]
`);
    for (const [r, o] of Object.entries(this.metadata))
      !t.includes(r) && o && (e += `[${r} "${o}"]
`);
    e += `
`;
    let s = 0;
    const i = 80;
    for (const r of this.moves) {
      let o = `${r.moveNumber}.`;
      if (r.white) {
        o += ` ${r.white}`;
        let n = "";
        if (r.whiteAnnotations) {
          const a = B.fromDrawingObjects(
            r.whiteAnnotations.arrows || [],
            r.whiteAnnotations.circles || []
          ), h = r.whiteAnnotations.textComment || "";
          n = [a, h].filter(Boolean).join(" ").trim();
        } else r.whiteComment && (n = r.whiteComment);
        n && (o += ` {${n}}`);
      }
      if (r.black) {
        o += ` ${r.black}`;
        let n = "";
        if (r.blackAnnotations) {
          const a = B.fromDrawingObjects(
            r.blackAnnotations.arrows || [],
            r.blackAnnotations.circles || []
          ), h = r.blackAnnotations.textComment || "";
          n = [a, h].filter(Boolean).join(" ").trim();
        } else r.blackComment && (n = r.blackComment);
        n && (o += ` {${n}}`);
      }
      s + o.length + 1 > i && (e += `
`, s = 0), s > 0 && (e += " ", s++), e += o, s += o.length;
    }
    return this.result !== "*" && (s > 0 && (e += " "), e += this.result), e.trim();
  }
  /**
   * Get annotations for a specific move
   */
  getMoveAnnotations(e, t) {
    const s = this.moves.find((i) => i.moveNumber === e);
    if (s)
      return t ? s.whiteAnnotations : s.blackAnnotations;
  }
  /**
   * Get all moves with their annotations
   */
  getMovesWithAnnotations() {
    return [...this.moves];
  }
}
class Ae {
  getFenParts(e) {
    const s = (e ?? this.chess.fen()).trim().split(/\s+/);
    return s.length < 6 ? s.concat(new Array(6 - s.length).fill("")) : s;
  }
  getChessInstance() {
    return this.chess;
  }
  constructor(e) {
    this.chess = new $e(e), this.pgnNotation = new De();
  }
  /**
   * Obtenir la position actuelle au format FEN
   */
  getFEN() {
    return this.chess.fen();
  }
  /**
   * Définir une position FEN
   */
  setFEN(e) {
    try {
      console.log("Attempting to load FEN:", e);
      const t = e.split(" ");
      t.length === 4 ? e += " - 0 1" : t.length === 5 && (e += " 1"), this.chess.load(e);
    } catch (t) {
      throw console.error("Invalid FEN:", e, t), new Error(`Invalid FEN: ${e}`);
    }
  }
  /**
   * Jouer un coup
   */
  move(e) {
    try {
      return this.chess.move({
        from: e.from,
        to: e.to,
        promotion: e.promotion
      }) ? { ok: !0 } : { ok: !1, reason: "Invalid move" };
    } catch (t) {
      return { ok: !1, reason: t.message || "Invalid move" };
    }
  }
  /**
   * Obtenir tous les coups légaux depuis une case
   */
  movesFrom(e) {
    return this.chess.moves({ square: e, verbose: !0 }).map((s) => ({
      from: s.from,
      to: s.to,
      promotion: s.promotion === "k" ? void 0 : s.promotion,
      piece: s.piece,
      captured: s.captured,
      flags: s.flags
    }));
  }
  /**
   * Obtenir tous les coups légaux
   */
  getAllMoves() {
    return this.chess.moves({ verbose: !0 }).map((t) => ({
      from: t.from,
      to: t.to,
      promotion: t.promotion === "k" ? void 0 : t.promotion,
      piece: t.piece,
      captured: t.captured,
      flags: t.flags
    }));
  }
  /**
   * Vérifier si un coup est légal
   */
  isLegalMove(e, t, s) {
    try {
      return new $e(this.chess.fen()).move({
        from: e,
        to: t,
        promotion: s
      }) !== null;
    } catch {
      return !1;
    }
  }
  /**
   * Vérifier si le roi est en échec
   */
  inCheck() {
    return this.chess.inCheck();
  }
  /**
   * Vérifier si c'est échec et mat
   */
  isCheckmate() {
    return this.chess.isCheckmate();
  }
  /**
   * Vérifier si c'est pat (stalemate)
   */
  isStalemate() {
    return this.chess.isStalemate();
  }
  /**
   * Vérifier si la partie est terminée
   */
  isGameOver() {
    return this.chess.isGameOver();
  }
  /**
   * Obtenir le résultat de la partie
   */
  getGameResult() {
    return this.chess.isCheckmate() ? this.chess.turn() === "w" ? "0-1" : "1-0" : this.chess.isStalemate() || this.chess.isDraw() ? "1/2-1/2" : "*";
  }
  /**
   * Obtenir le joueur au trait
   */
  turn() {
    return this.chess.turn();
  }
  /**
   * Obtenir la pièce sur une case
   */
  get(e) {
    return this.chess.get(e) || null;
  }
  /**
   * Annuler le dernier coup
   */
  undo() {
    return this.chess.undo() !== null;
  }
  /**
   * Obtenir l'historique des coups
   */
  history() {
    return this.chess.history();
  }
  /**
   * Obtenir l'historique détaillé des coups
   */
  getHistory() {
    return this.chess.history({ verbose: !0 });
  }
  /**
   * Remettre à la position initiale
   */
  reset() {
    this.chess.reset();
  }
  /**
   * Obtenir les cases attaquées par le joueur actuel
   *
   * Utilise la détection native de chess.js pour identifier toutes les cases
   * actuellement contrôlées par le joueur au trait.
   */
  getAttackedSquares() {
    const e = this.chess.turn();
    return gt.filter((t) => this.chess.isAttacked(t, e)).map(
      (t) => t
    );
  }
  /**
   * Vérifier si une case est attaquée
   *
   * @param square Case à vérifier (notation algébrique, insensible à la casse)
   * @param by Couleur optionnelle pour vérifier une couleur spécifique
   * @throws {Error} si la case ou la couleur fournie est invalide
   */
  isSquareAttacked(e, t) {
    if (typeof e != "string")
      throw new Error(`Invalid square: ${e}`);
    const s = e.toLowerCase();
    if (!gt.includes(s))
      throw new Error(`Invalid square: ${e}`);
    let i;
    if (t === void 0)
      i = this.chess.turn();
    else if (t === "w" || t === "b")
      i = t;
    else
      throw new Error(`Invalid color: ${t}`);
    return this.chess.isAttacked(s, i);
  }
  /**
   * Obtenir les cases du roi en échec (pour le surlignage)
   */
  getCheckSquares() {
    if (!this.chess.inCheck()) return [];
    const e = this.getKingSquare(this.chess.turn());
    return e ? [e] : [];
  }
  /**
   * Obtenir la position du roi d'une couleur
   */
  getKingSquare(e) {
    const t = ["a", "b", "c", "d", "e", "f", "g", "h"], s = ["1", "2", "3", "4", "5", "6", "7", "8"];
    for (const i of t)
      for (const r of s) {
        const o = `${i}${r}`, n = this.chess.get(o);
        if (n && n.type === "k" && n.color === e)
          return o;
      }
    return null;
  }
  /**
   * Vérifier si le roque est possible
   */
  canCastle(e, t) {
    const s = t || this.chess.turn(), i = this.chess.getCastlingRights(s);
    return e === "k" ? i.k : i.q;
  }
  /**
   * Obtenir le nombre de coups depuis le début
   */
  moveNumber() {
    return this.chess.moveNumber();
  }
  /**
   * Obtenir le nombre de demi-coups depuis la dernière prise ou mouvement de pion
   */
  halfMoves() {
    const t = this.getFenParts()[4] ?? "0", s = Number.parseInt(t, 10);
    return Number.isNaN(s) ? 0 : s;
  }
  /**
   * Créer une copie de l'état actuel
   */
  clone() {
    return new Ae(this.chess.fen());
  }
  /**
   * Valider un FEN
   */
  static isValidFEN(e) {
    try {
      return new $e().load(e), !0;
    } catch {
      return !1;
    }
  }
  /**
   * Obtenir des informations sur le dernier coup joué
   */
  getLastMove() {
    const e = this.chess.history({ verbose: !0 });
    return e.length > 0 ? e[e.length - 1] : null;
  }
  /**
   * Générer le FEN à partir d'une position donnée
   */
  generateFEN() {
    return this.chess.fen();
  }
  /**
   * Définir les métadonnées PGN pour la partie actuelle
   */
  setPgnMetadata(e) {
    this.pgnNotation.setMetadata(e);
  }
  /**
   * Exporter la partie actuelle au format PGN
   */
  toPgn(e = !0) {
    return this.pgnNotation.importFromChessJs(this.chess), this.pgnNotation.toPgn(e);
  }
  /**
   * Télécharger la partie actuelle sous forme de fichier PGN (navigateur uniquement)
   */
  downloadPgn(e) {
    this.pgnNotation.importFromChessJs(this.chess), this.pgnNotation.downloadPgn(e);
  }
  /**
   * Obtenir l'instance PgnNotation pour une manipulation avancée
   */
  getPgnNotation() {
    return this.pgnNotation;
  }
  /**
   * Charger une partie à partir d'une chaîne PGN
   */
  loadPgn(e) {
    try {
      return this.chess.loadPgn(e), this.pgnNotation.importFromChessJs(this.chess), !0;
    } catch {
      return !1;
    }
  }
  /**
   * Obtenir la notation PGN du dernier coup joué
   */
  getLastMoveNotation() {
    const e = this.chess.history();
    return e.length > 0 ? e[e.length - 1] : null;
  }
  /**
   * Obtenir toute l'historique des coups en notation PGN
   */
  getPgnMoves() {
    return this.chess.history();
  }
}
const re = {
  color: "rgba(34, 197, 94, 0.6)",
  width: 2,
  opacity: 0.8
}, vt = {
  default: "#ffeb3b",
  shiftKey: "#22c55e",
  ctrlKey: "#ef4444",
  altKey: "#f59e0b"
}, ss = ["shiftKey", "ctrlKey", "altKey"], rs = {
  green: "rgba(34, 197, 94, 0.6)",
  red: "rgba(239, 68, 68, 0.6)",
  blue: "rgba(59, 130, 246, 0.6)",
  yellow: "rgba(245, 158, 11, 0.6)",
  orange: "rgba(249, 115, 22, 0.6)",
  purple: "rgba(168, 85, 247, 0.6)"
}, ne = [
  "green",
  "red",
  "blue",
  "yellow",
  "orange",
  "purple"
], ns = {
  shiftKey: "green",
  ctrlKey: "red",
  altKey: "yellow"
}, os = 0.3, as = {
  selected: 0.5,
  lastMove: 0.6
}, wt = "rgba(255, 255, 0, 0.5)";
class hs {
  constructor(e) {
    this.state = {
      arrows: [],
      highlights: [],
      premove: void 0
    }, this.squareSize = 60, this.orientation = "white", this.showSquareNames = !1, this.currentAction = { type: "none" }, this.clearAll = this.clearAllDrawings, this.canvas = e, this.updateDimensions();
  }
  updateDimensions() {
    const e = Math.min(this.canvas.width, this.canvas.height);
    this.squareSize = e / 8;
  }
  setOrientation(e) {
    this.orientation = e;
  }
  setShowSquareNames(e) {
    this.showSquareNames = e;
  }
  // Arrow management
  addArrow(e, t, s = re.color, i = re.width, r = re.opacity) {
    const o = typeof e == "object" ? this.normalizeArrow(e) : this.normalizeArrow({
      from: e,
      to: t,
      color: s,
      width: i,
      opacity: r
    }), n = this.findArrowIndex(o.from, o.to);
    if (n >= 0) {
      this.state.arrows[n] = {
        ...this.state.arrows[n],
        ...o
      };
      return;
    }
    this.state.arrows.push(o);
  }
  normalizeArrow(e) {
    const t = e.color ?? re.color, s = e.width ?? re.width, i = e.opacity ?? re.opacity, r = e.knightMove ?? this.isKnightMove(e.from, e.to);
    return {
      from: e.from,
      to: e.to,
      color: t,
      width: s,
      opacity: i,
      knightMove: r
    };
  }
  findArrowIndex(e, t) {
    return this.state.arrows.findIndex(
      (s) => s.from === e && s.to === t
    );
  }
  removeArrow(e, t) {
    const s = this.findArrowIndex(e, t);
    s >= 0 && this.state.arrows.splice(s, 1);
  }
  clearArrows() {
    this.state.arrows = [];
  }
  getArrows() {
    return this.state.arrows.map((e) => ({ ...e }));
  }
  // Highlight management
  addHighlight(e, t = "green", s) {
    const i = s ?? this.getDefaultHighlightOpacity(t), r = this.findHighlightIndex(e);
    if (r >= 0) {
      this.state.highlights[r] = {
        ...this.state.highlights[r],
        type: t,
        opacity: i
      };
      return;
    }
    this.state.highlights.push({
      square: e,
      type: t,
      opacity: i
    });
  }
  getDefaultHighlightOpacity(e) {
    return as[e] ?? os;
  }
  findHighlightIndex(e) {
    return this.state.highlights.findIndex((t) => t.square === e);
  }
  removeHighlight(e) {
    const t = this.findHighlightIndex(e);
    t >= 0 && this.state.highlights.splice(t, 1);
  }
  clearHighlights() {
    this.state.highlights = [];
  }
  /**
   * Get the pixel coordinates of the top-left corner of a square
   * @param square The square in algebraic notation (e.g., 'a1', 'h8')
   * @returns An object with x and y coordinates
   */
  getSquareCoordinates(e) {
    const t = e[0].toLowerCase(), s = parseInt(e[1], 10);
    let i = t.charCodeAt(0) - 97, r = 8 - s;
    return this.orientation === "black" && (i = 7 - i, r = 7 - r), {
      x: i * this.squareSize,
      y: r * this.squareSize
    };
  }
  /**
   * Get the size of a square in pixels
   */
  getSquareSize() {
    return this.squareSize;
  }
  /**
   * Get the center point of a square in pixels
   */
  getSquareCenter(e) {
    const { x: t, y: s } = this.getSquareCoordinates(e), i = this.squareSize / 2;
    return {
      x: t + i,
      y: s + i
    };
  }
  getHighlights() {
    return this.state.highlights.map((e) => ({ ...e }));
  }
  // Premove management
  setPremove(e, t, s) {
    this.state.premove = { from: e, to: t, promotion: s };
  }
  clearPremove() {
    this.state.premove = void 0;
  }
  getPremove() {
    return this.state.premove;
  }
  // Coordinate utilities
  squareToCoords(e) {
    const t = e.charCodeAt(0) - 97, s = parseInt(e[1]) - 1;
    return this.orientation === "white" ? [t * this.squareSize, (7 - s) * this.squareSize] : [(7 - t) * this.squareSize, s * this.squareSize];
  }
  coordsToSquare(e, t) {
    const s = Math.floor(e / this.squareSize), i = Math.floor(t / this.squareSize);
    let r, o;
    this.orientation === "white" ? (r = s, o = 7 - i) : (r = 7 - s, o = i);
    const n = String.fromCharCode(97 + r), a = (o + 1).toString();
    return `${n}${a}`;
  }
  // Knight move detection
  isKnightMove(e, t) {
    const s = e.charCodeAt(0) - 97, i = parseInt(e[1]) - 1, r = t.charCodeAt(0) - 97, o = parseInt(t[1]) - 1, n = Math.abs(r - s), a = Math.abs(o - i);
    return n === 1 && a === 2 || n === 2 && a === 1;
  }
  // Square names rendering
  renderSquareNames(e, t, s = 1) {
    const i = this.canvas.getContext("2d");
    if (!i) return;
    i.save(), i.scale(s, s);
    const r = this.squareSize / s, o = this.canvas.height / s, n = Math.max(10, r * 0.18), a = r * 0.12, h = r * 0.12;
    i.font = `500 ${n}px 'Segoe UI', Arial, sans-serif`;
    const d = "rgba(240, 217, 181, 0.7)", m = "rgba(181, 136, 99, 0.7)", p = e === "white" ? 0 : 7, _ = e === "white" ? 0 : 7;
    i.textAlign = "left", i.textBaseline = "alphabetic";
    for (let v = 0; v < 8; v++) {
      const P = e === "white" ? v : 7 - v, C = String.fromCharCode(97 + P), T = v * r + a, k = o - a, x = (P + p) % 2 === 0;
      i.fillStyle = x ? d : m, i.fillText(C, T, k);
    }
    i.textBaseline = "middle";
    for (let v = 0; v < 8; v++) {
      const P = e === "white" ? v : 7 - v, C = (P + 1).toString(), T = h, k = o - (v + 0.5) * r, x = (_ + P) % 2 === 0;
      i.fillStyle = x ? d : m, i.fillText(C, T, k);
    }
    i.restore();
  }
  drawArrows(e) {
    e.save();
    for (const t of this.state.arrows)
      this.drawArrow(e, t);
    e.restore();
  }
  drawArrow(e, t) {
    t.knightMove ? this.drawKnightArrow(e, t) : this.drawStraightArrow(e, t);
  }
  applyArrowStyle(e, t) {
    const s = t.width;
    return e.globalAlpha = t.opacity, e.strokeStyle = t.color, e.fillStyle = t.color, e.lineWidth = s, e.lineCap = "round", e.lineJoin = "round", s;
  }
  drawStraightArrow(e, t) {
    const [s, i] = this.squareToCoords(t.from), [r, o] = this.squareToCoords(t.to), n = s + this.squareSize / 2, a = i + this.squareSize / 2, h = r + this.squareSize / 2, d = o + this.squareSize / 2, m = h - n, p = d - a, _ = Math.atan2(p, m), v = this.squareSize * 0.25, P = n + Math.cos(_) * v, C = a + Math.sin(_) * v, T = h - Math.cos(_) * v, k = d - Math.sin(_) * v, x = this.applyArrowStyle(e, t);
    e.beginPath(), e.moveTo(P, C), e.lineTo(T, k), e.stroke();
    const K = x * 3, L = Math.PI / 6;
    e.beginPath(), e.moveTo(T, k), e.lineTo(
      T - K * Math.cos(_ - L),
      k - K * Math.sin(_ - L)
    ), e.lineTo(
      T - K * Math.cos(_ + L),
      k - K * Math.sin(_ + L)
    ), e.closePath(), e.fill();
  }
  drawKnightArrow(e, t) {
    const [s, i] = this.squareToCoords(t.from), [r, o] = this.squareToCoords(t.to), n = s + this.squareSize / 2, a = i + this.squareSize / 2, h = r + this.squareSize / 2, d = o + this.squareSize / 2, m = h - n, p = d - a, _ = Math.abs(m), v = Math.abs(p);
    let P, C;
    _ > v ? (P = h, C = a) : (P = n, C = d);
    const T = this.applyArrowStyle(e, t), k = this.squareSize * 0.2;
    let x = n, K = a, L = h, Y = d;
    _ > v ? (x += m > 0 ? k : -k, L += m > 0 ? -k : k) : (K += p > 0 ? k : -k, Y += p > 0 ? -k : k), e.beginPath(), e.moveTo(x, K), e.lineTo(P, C), e.lineTo(L, Y), e.stroke();
    const te = T * 3, G = Math.PI / 6;
    let j;
    _ > v ? j = p > 0 ? Math.PI / 2 : -Math.PI / 2 : j = m > 0 ? 0 : Math.PI, e.beginPath(), e.moveTo(L, Y), e.lineTo(
      L - te * Math.cos(j - G),
      Y - te * Math.sin(j - G)
    ), e.lineTo(
      L - te * Math.cos(j + G),
      Y - te * Math.sin(j + G)
    ), e.closePath(), e.fill();
  }
  // Highlight rendering
  drawHighlights(e) {
    e.save();
    for (const t of this.state.highlights)
      this.drawHighlight(e, t);
    e.restore();
  }
  drawHighlight(e, t) {
    const [s, i] = this.squareToCoords(t.square), r = this.resolveHighlightColor(t), o = t.opacity ?? 0.6;
    e.globalAlpha = o, e.fillStyle = r;
    const n = s + this.squareSize / 2, a = i + this.squareSize / 2, h = this.squareSize * 0.15;
    e.beginPath(), e.arc(n, a, h, 0, 2 * Math.PI), e.fill(), e.globalAlpha = o * 1.5, e.strokeStyle = r, e.lineWidth = 3, e.stroke();
  }
  resolveHighlightColor(e) {
    if (e.type === "circle")
      return e.color ?? wt;
    const t = e.type;
    return rs[t] ?? e.color ?? wt;
  }
  isInHighlightSequence(e) {
    return ne.includes(e);
  }
  getNextHighlightType(e) {
    if (!this.isInHighlightSequence(e))
      return null;
    const s = (ne.indexOf(e) + 1) % ne.length;
    return s === 0 ? null : ne[s];
  }
  getActiveModifier(e) {
    for (const t of ss)
      if (e[t])
        return t;
    return null;
  }
  resolveArrowColor(e) {
    const t = this.getActiveModifier(e);
    return t ? vt[t] : vt.default;
  }
  resolveHighlightTypeFromModifiers(e) {
    const t = this.getActiveModifier(e);
    return t ? ns[t] : ne[0];
  }
  withContext(e) {
    const t = this.canvas.getContext("2d");
    t && e(t);
  }
  // Premove rendering
  drawPremove(e) {
    if (!this.state.premove) return;
    e.save();
    const [t, s] = this.squareToCoords(this.state.premove.from), [i, r] = this.squareToCoords(this.state.premove.to);
    e.globalAlpha = 0.7, e.strokeStyle = "#ff9800", e.lineWidth = 3, e.setLineDash && e.setLineDash([8, 4]), e.lineCap = "round";
    const o = t + this.squareSize / 2, n = s + this.squareSize / 2, a = i + this.squareSize / 2, h = r + this.squareSize / 2;
    e.beginPath(), e.moveTo(o, n), e.lineTo(a, h), e.stroke(), e.setLineDash && e.setLineDash([]), e.fillStyle = "rgba(255, 152, 0, 0.3)", e.fillRect(t, s, this.squareSize, this.squareSize), e.fillRect(i, r, this.squareSize, this.squareSize), e.restore();
  }
  // Methods to get the complete state
  getDrawingState() {
    return {
      arrows: this.getArrows(),
      highlights: this.getHighlights(),
      premove: this.state.premove ? { ...this.state.premove } : void 0
    };
  }
  setDrawingState(e) {
    e.arrows !== void 0 && (this.state.arrows = e.arrows.map((t) => this.normalizeArrow(t))), e.highlights !== void 0 && (this.state.highlights = e.highlights.map((t) => ({ ...t }))), e.premove !== void 0 && (this.state.premove = e.premove ? { ...e.premove } : void 0);
  }
  // Utilities for interactions
  getSquareFromMousePosition(e, t) {
    const s = this.canvas.getBoundingClientRect(), i = (e - s.left) * (this.canvas.width / s.width), r = (t - s.top) * (this.canvas.height / s.height);
    return i < 0 || r < 0 || i >= this.canvas.width || r >= this.canvas.height ? null : this.coordsToSquare(i, r);
  }
  // Cycle highlight colors on right-click
  cycleHighlight(e) {
    const t = this.findHighlightIndex(e);
    if (t >= 0) {
      const s = this.state.highlights[t], i = this.getNextHighlightType(s.type);
      if (!i) {
        this.removeHighlight(e);
        return;
      }
      this.state.highlights[t].type = i;
      return;
    }
    this.addHighlight(e, ne[0]);
  }
  // Complete rendering of all elements
  draw(e) {
    this.drawHighlights(e), this.drawPremove(e), this.drawArrows(e), this.showSquareNames && this._drawSquareNames(e);
  }
  // Check if a point is near an arrow (for deletion)
  getArrowAt(e, t, s = 10) {
    const i = this.canvas.getBoundingClientRect(), r = e - i.left, o = t - i.top;
    for (const n of this.state.arrows)
      if (this.isPointNearArrow(r, o, n, s))
        return { ...n };
    return null;
  }
  isPointNearArrow(e, t, s, i) {
    const [r, o] = this.squareToCoords(s.from), [n, a] = this.squareToCoords(s.to), h = r + this.squareSize / 2, d = o + this.squareSize / 2, m = n + this.squareSize / 2, p = a + this.squareSize / 2, _ = Math.sqrt(
      Math.pow(m - h, 2) + Math.pow(p - d, 2)
    );
    return _ === 0 ? !1 : Math.abs(
      ((p - d) * e - (m - h) * t + m * d - p * h) / _
    ) <= i;
  }
  // Export/Import for persistence
  exportState() {
    return JSON.stringify(this.getDrawingState());
  }
  importState(e) {
    try {
      const t = JSON.parse(e);
      this.setDrawingState(t);
    } catch (t) {
      console.warn("Failed to import drawing state:", t);
    }
  }
  // Interaction methods for NeoChessBoard
  handleMouseDown(e, t, s, i) {
    return !1;
  }
  handleRightMouseDown(e, t, s = !1, i = !1, r = !1) {
    const o = this.coordsToSquare(e, t);
    return this.currentAction = { type: "drawing_arrow", startSquare: o, shiftKey: s, ctrlKey: i, altKey: r }, !0;
  }
  handleMouseMove(e, t) {
    return !1;
  }
  handleMouseUp(e, t) {
    return this.cancelCurrentAction(), !1;
  }
  handleRightMouseUp(e, t) {
    if (this.currentAction.type !== "drawing_arrow")
      return this.cancelCurrentAction(), !1;
    const s = this.currentAction, i = this.coordsToSquare(e, t);
    if (i === s.startSquare)
      return this.cancelCurrentAction(), !1;
    const r = this.resolveArrowColor(s);
    return this.state.arrows.find(
      (n) => n.from === s.startSquare && n.to === i && n.color === r
    ) ? this.removeArrow(s.startSquare, i) : this.addArrow(s.startSquare, i, r), this.cancelCurrentAction(), !0;
  }
  handleHighlightClick(e, t = !1, s = !1, i = !1) {
    if (!t && !s && !i) {
      this.cycleHighlight(e);
      return;
    }
    const r = { shiftKey: t, ctrlKey: s, altKey: i }, o = this.resolveHighlightTypeFromModifiers(r);
    if (this.state.highlights.findIndex(
      (a) => a.square === e && a.type === o
    ) >= 0) {
      this.removeHighlight(e);
      return;
    }
    this.addHighlight(e, o);
  }
  renderPremove() {
    this.withContext((e) => this.drawPremove(e));
  }
  renderHighlights() {
    this.withContext((e) => this.drawHighlights(e));
  }
  // Methods with signatures adapted for NeoChessBoard
  addArrowFromObject(e) {
    this.addArrow(e.from, e.to, e.color, e.width, e.opacity);
  }
  addHighlightFromObject(e) {
    this.addHighlight(e.square, e.type, e.opacity);
  }
  setPremoveFromObject(e) {
    this.setPremove(e.from, e.to, e.promotion);
  }
  _drawSquareNames(e) {
    e.save(), e.font = `${Math.floor(this.squareSize * 0.18)}px ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto`, e.fillStyle = "rgba(0,0,0,0.35)";
    for (let t = 0; t < 8; t++)
      for (let s = 0; s < 8; s++) {
        const i = this.coordsToSquare(s * this.squareSize, t * this.squareSize), [r, o] = this.squareToCoords(i);
        if (t === (this.orientation === "white" ? 7 : 0)) {
          const n = this.orientation === "white" ? Se[s] : Se[7 - s];
          e.textAlign = this.orientation === "white" ? "left" : "right", e.textBaseline = "bottom", e.fillText(
            n,
            r + (this.orientation === "white" ? this.squareSize * 0.06 : this.squareSize - this.squareSize * 0.06),
            o + this.squareSize - this.squareSize * 0.06
          );
        }
        if (s === (this.orientation === "white" ? 0 : 7)) {
          const n = xe[7 - t];
          e.textAlign = this.orientation === "white" ? "left" : "right", e.textBaseline = this.orientation === "white" ? "top" : "bottom", e.fillText(
            n,
            r + (this.orientation === "white" ? this.squareSize * 0.06 : this.squareSize - this.squareSize * 0.06),
            o + (this.orientation === "white" ? this.squareSize * 0.06 : this.squareSize - this.squareSize * 0.06)
          );
        }
      }
    e.restore();
  }
  // Additional helper methods for integration with NeoChessBoard
  /**
   * Render arrows on the canvas
   */
  renderArrows() {
    this.withContext((e) => this.drawArrows(e));
  }
  /**
   * Cancel the current drawing action
   */
  cancelCurrentAction() {
    this.currentAction = { type: "none" };
  }
  /**
   * Clear all drawings (arrows, highlights, premoves)
   */
  clearAllDrawings() {
    this.state.arrows = [], this.state.highlights = [], this.state.premove = void 0;
  }
}
class ls {
  /**
   * Creates an instance of NeoChessBoard.
   * @param root The HTMLElement to which the board will be appended.
   * @param options Optional configuration options for the board.
   */
  constructor(e, t = {}) {
    this.bus = new Pi(), this.sizePx = 480, this.square = 60, this.dpr = 1, this.customPieceSprites = {}, this._pieceSetToken = 0, this.moveSound = null, this.moveSounds = {}, this._lastMove = null, this._premove = null, this._selected = null, this._legalCached = null, this._dragging = null, this._hoverSq = null, this._arrows = [], this._customHighlights = null, this._raf = 0, this._drawingArrow = null, this.root = e;
    const s = t.theme ?? "classic";
    this.theme = ut(s), this.orientation = t.orientation || "white", this.interactive = t.interactive !== !1, this.showCoords = t.showCoordinates || !1, this.highlightLegal = t.highlightLegal !== !1, this.animationMs = t.animationMs || 300, this.allowPremoves = t.allowPremoves !== !1, this.showArrows = t.showArrows !== !1, this.showHighlights = t.showHighlights !== !1, this.rightClickHighlights = t.rightClickHighlights !== !1, this.soundEnabled = t.soundEnabled !== !1, this.showSquareNames = t.showSquareNames || !1, this.autoFlip = t.autoFlip ?? !1, this.soundUrl = t.soundUrl, this.soundUrls = t.soundUrls, this._initializeSound(), this.rules = t.rulesAdapter || new Ae(), t.fen && this.rules.setFEN(t.fen), this.state = le(this.rules.getFEN()), this._syncOrientationFromTurn(!0), this._buildDOM(), this._attachEvents(), this.resize(), t.pieceSet && this.setPieceSet(t.pieceSet);
  }
  // Public API methods
  /**
   * Gets the current position of the board in FEN format.
   * @returns The current FEN string.
   */
  getPosition() {
    return this.rules.getFEN();
  }
  /**
   * Sets the position of the board using a FEN string.
   * @param fen The FEN string to set the board to.
   * @param immediate If true, the board will update immediately without animation.
   */
  setPosition(e, t = !1) {
    this.setFEN(e, t);
  }
  /**
   * Registers an event handler for a specific board event.
   * @param event The name of the event to listen for.
   * @param handler The callback function to execute when the event is emitted.
   * @returns A function to unsubscribe the event handler.
   */
  on(e, t) {
    return this.bus.on(e, t);
  }
  /**
   * Destroys the board instance, removing all event listeners and clearing the DOM.
   */
  destroy() {
    this._removeEvents(), this.root.innerHTML = "";
  }
  /**
   * Sets the visual theme of the board.
   * @param theme Theme name or object to apply.
   */
  setTheme(e) {
    this.applyTheme(e);
  }
  /**
   * Applies a theme object directly, normalizing it and re-rendering the board.
   * @param theme Theme name or object to apply.
   */
  applyTheme(e) {
    this.theme = ut(e), this._rasterize(), this.renderAll();
  }
  /**
   * Applies a custom piece set, allowing users to provide their own sprites.
   * Passing `undefined` or an empty configuration reverts to the default flat sprites.
   * @param pieceSet Custom piece configuration to apply.
   */
  async setPieceSet(e) {
    if (!e || !e.pieces || Object.keys(e.pieces).length === 0) {
      if (!this._pieceSetRaw && Object.keys(this.customPieceSprites).length === 0)
        return;
      this._pieceSetRaw = void 0, this.customPieceSprites = {}, this._pieceSetToken++, this.renderAll();
      return;
    }
    if (e === this._pieceSetRaw)
      return;
    this._pieceSetRaw = e;
    const t = ++this._pieceSetToken, s = e.defaultScale ?? 1, i = {}, r = Object.entries(e.pieces);
    await Promise.all(
      r.map(async ([o, n]) => {
        if (n)
          try {
            const a = await this._resolvePieceSprite(n, s);
            a && (i[o] = a);
          } catch (a) {
            console.warn(`[NeoChessBoard] Failed to load sprite for piece "${o}".`, a);
          }
      })
    ), t === this._pieceSetToken && (this.customPieceSprites = i, this.renderAll());
  }
  /**
   * Sets the board position using a FEN string.
   * @param fen The FEN string representing the board state.
   * @param immediate If true, the board updates instantly without animation.
   */
  setFEN(e, t = !1) {
    const s = this.state, i = this.state.turn;
    this.rules.setFEN(e), this.state = le(this.rules.getFEN()), this._syncOrientationFromTurn(!1), this._lastMove = null;
    const r = this.state.turn;
    i !== r && this._executePremoveIfValid(), this._premove = null, t ? (this._clearAnim(), this.renderAll()) : this._animateTo(this.state, s), this.bus.emit("update", { fen: this.getPosition() });
  }
  // ---- DOM & render ----
  _buildDOM() {
    this.root.classList.add("ncb-root"), this.root.style.position = "relative", this.root.style.userSelect = "none", this.cBoard = document.createElement("canvas"), this.cPieces = document.createElement("canvas"), this.cOverlay = document.createElement("canvas");
    for (const t of [this.cBoard, this.cPieces, this.cOverlay])
      Object.assign(t.style, {
        position: "absolute",
        left: "0",
        top: "0",
        width: "100%",
        height: "100%",
        aspectRatio: "606 / 606"
      }), this.root.appendChild(t);
    this.ctxB = this.cBoard.getContext("2d"), this.ctxP = this.cPieces.getContext("2d"), this.ctxO = this.cOverlay.getContext("2d"), this.drawingManager = new hs(this.cOverlay), this.drawingManager.setOrientation(this.orientation), this.drawingManager.setShowSquareNames(this.showSquareNames), this._rasterize();
    const e = new ResizeObserver(() => this.resize());
    if (e.observe(this.root), this._ro = e, typeof document < "u") {
      const t = document.createElement("style");
      t.textContent = ".ncb-root{display:block;max-width:100%;aspect-ratio:auto 606/606;border-radius:14px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.10);} canvas{image-rendering:optimizeQuality;aspect-ratio:auto 606/606;}", document.head.appendChild(t);
    }
  }
  /**
   * Resizes the board canvases based on the root element's dimensions and device pixel ratio.
   * This method is typically called when the board's container changes size.
   */
  resize() {
    const e = this.root.getBoundingClientRect(), t = Math.min(e.width, e.height) || 480, s = globalThis.devicePixelRatio || 1;
    for (const i of [this.cBoard, this.cPieces, this.cOverlay])
      i.width = Math.round(t * s), i.height = Math.round(t * s);
    this.sizePx = t, this.square = t * s / 8, this.dpr = s, this.drawingManager && this.drawingManager.updateDimensions(), this.renderAll();
  }
  /**
   * Initializes or re-initializes the sprite sheet for pieces based on the current theme.
   * This is called when the theme changes or on initial setup.
   */
  _rasterize() {
    this.sprites = new qi(128, this.theme);
  }
  /**
   * Renders all layers of the chess board (board, pieces, overlay).
   * This method should be called whenever the board state or visual settings change.
   */
  renderAll() {
    this._drawBoard(), this._drawPieces(), this._drawOverlay();
  }
  /**
   * Converts a square (e.g., 'e4') to its pixel coordinates on the canvas.
   * Adjusts for board orientation.
   * @param square The algebraic notation of the square.
   * @returns An object with x and y pixel coordinates.
   */
  _sqToXY(e) {
    const { f: t, r: s } = lt(e), i = this.orientation === "white" ? t : 7 - t, r = this.orientation === "white" ? 7 - s : s;
    return { x: i * this.square, y: r * this.square };
  }
  /**
   * Draws the chess board squares onto the board canvas.
   * Uses the current theme's light and dark square colors.
   */
  _drawBoard() {
    const e = this.ctxB, t = this.square, s = this.cBoard.width, i = this.cBoard.height, { light: r, dark: o, boardBorder: n } = this.theme;
    e.clearRect(0, 0, s, i), e.fillStyle = n, e.fillRect(0, 0, s, i);
    for (let a = 0; a < 8; a++)
      for (let h = 0; h < 8; h++) {
        const d = (this.orientation === "white" ? h : 7 - h) * t, m = (this.orientation === "white" ? 7 - a : a) * t;
        e.fillStyle = (a + h) % 2 === 0 ? r : o, e.fillRect(d, m, t, t);
      }
  }
  async _resolvePieceSprite(e, t) {
    const s = typeof e == "object" && e !== null && "image" in e ? e : { image: e };
    let i = null;
    return typeof s.image == "string" ? i = await this._loadImage(s.image) : s.image && (i = s.image), i ? {
      image: i,
      scale: s.scale ?? t ?? 1,
      offsetX: s.offsetX ?? 0,
      offsetY: s.offsetY ?? 0
    } : null;
  }
  _loadImage(e) {
    return new Promise((t, s) => {
      var o;
      const i = ((o = this.root) == null ? void 0 : o.ownerDocument) ?? (typeof document < "u" ? document : null), r = typeof Image < "u" ? new Image() : i ? i.createElement("img") : null;
      if (!r) {
        s(new Error("Image loading is not supported in the current environment."));
        return;
      }
      e.startsWith("data:") || (r.crossOrigin = "anonymous");
      try {
        r.decoding = "async";
      } catch {
      }
      r.onload = () => t(r), r.onerror = (n) => s(n instanceof Error ? n : new Error(String(n))), r.src = e;
    });
  }
  /**
   * Draws a single piece sprite onto the pieces canvas.
   * @param piece The FEN notation of the piece (e.g., 'p', 'K').
   * @param x The x-coordinate for the top-left corner of the piece.
   * @param y The y-coordinate for the top-left corner of the piece.
   * @param scale Optional scale factor for the piece (default is 1).
   */
  _drawPieceSprite(e, t, s, i = 1) {
    const r = this.customPieceSprites[e];
    if (r) {
      const P = i * (r.scale ?? 1), C = this.square * P, T = t + (this.square - C) / 2 + r.offsetX * this.square, k = s + (this.square - C) / 2 + r.offsetY * this.square;
      this.ctxP.drawImage(r.image, T, k, C, C);
      return;
    }
    const o = { k: 0, q: 1, r: 2, b: 3, n: 4, p: 5 }, n = se(e), a = o[e.toLowerCase()], h = 128, d = a * h, m = n ? h : 0, p = this.square * i, _ = t + (this.square - p) / 2, v = s + (this.square - p) / 2;
    this.ctxP.drawImage(this.sprites.getSheet(), d, m, h, h, _, v, p, p);
  }
  /**
   * Draws all pieces onto the pieces canvas, handling dragging pieces separately.
   */
  _drawPieces() {
    var r;
    const e = this.ctxP, t = this.cPieces.width, s = this.cPieces.height;
    e.clearRect(0, 0, t, s);
    const i = (r = this._dragging) == null ? void 0 : r.from;
    for (let o = 0; o < 8; o++)
      for (let n = 0; n < 8; n++) {
        const a = this.state.board[o][n];
        if (!a) continue;
        const h = he(n, o);
        if (i === h) continue;
        const { x: d, y: m } = this._sqToXY(h);
        this._drawPieceSprite(a, d, m, 1);
      }
    if (this._dragging) {
      const { piece: o, x: n, y: a } = this._dragging;
      this._drawPieceSprite(o, n - this.square / 2, a - this.square / 2, 1.05);
    }
  }
  /**
   * Draws the overlay elements such as last move highlights, selected square, legal moves, premoves, and arrows.
   * Delegates to DrawingManager for modern drawing features.
   */
  _drawOverlay() {
    var r;
    const e = this.ctxO, t = this.cOverlay.width, s = this.cOverlay.height;
    e.clearRect(0, 0, t, s);
    const i = this.square;
    if (this._lastMove) {
      const { from: o, to: n } = this._lastMove, a = this._sqToXY(o), h = this._sqToXY(n);
      e.fillStyle = this.theme.lastMove, e.fillRect(a.x, a.y, i, i), e.fillRect(h.x, h.y, i, i);
    }
    if ((r = this._customHighlights) != null && r.squares) {
      e.fillStyle = this.theme.moveTo;
      for (const o of this._customHighlights.squares) {
        const n = this._sqToXY(o);
        e.fillRect(n.x, n.y, i, i);
      }
    }
    if (this._selected) {
      const o = this._sqToXY(this._selected);
      if (e.fillStyle = this.theme.moveFrom, e.fillRect(o.x, o.y, i, i), this.highlightLegal && this._legalCached) {
        e.fillStyle = this.theme.dot;
        for (const n of this._legalCached) {
          const a = this._sqToXY(n.to);
          e.beginPath(), e.arc(a.x + i / 2, a.y + i / 2, i * 0.12, 0, Math.PI * 2), e.fill();
        }
      }
    }
    for (const o of this._arrows)
      this._drawArrow(o.from, o.to, o.color || this.theme.arrow);
    if (this._premove) {
      const o = this._sqToXY(this._premove.from), n = this._sqToXY(this._premove.to);
      e.fillStyle = this.theme.premove, e.fillRect(o.x, o.y, i, i), e.fillRect(n.x, n.y, i, i);
    }
    if (this._hoverSq && this._dragging) {
      const o = this._sqToXY(this._hoverSq);
      e.fillStyle = this.theme.moveTo, e.fillRect(o.x, o.y, i, i);
    }
    this.drawingManager && (this.showArrows && this.drawingManager.renderArrows(), this.showHighlights && this.drawingManager.renderHighlights(), this.allowPremoves && this.drawingManager.renderPremove(), this.showSquareNames && this.drawingManager.renderSquareNames(this.orientation, this.square, this.dpr));
  }
  /**
   * Draws an arrow between the center of two squares.
   * @param from The starting square of the arrow.
   * @param to The ending square of the arrow.
   * @param color The color of the arrow.
   */
  _drawArrow(e, t, s) {
    const i = this.square, r = this._sqToXY(e), o = this._sqToXY(t);
    this._drawArrowBetween(r.x + i / 2, r.y + i / 2, o.x + i / 2, o.y + i / 2, s);
  }
  /**
   * Draws an arrow between two pixel coordinates on the overlay canvas.
   * This is a helper for `_drawArrow`.
   * @param fromX Starting x-coordinate.
   * @param fromY Starting y-coordinate.
   * @param toX Ending x-coordinate.
   * @param toY Ending y-coordinate.
   * @param color The color of the arrow.
   */
  _drawArrowBetween(e, t, s, i, r) {
    const o = s - e, n = i - t, a = Math.hypot(o, n);
    if (a < 1) return;
    const h = o / a, d = n / a, m = Math.min(16 * this.dpr, a * 0.25), p = Math.max(6 * this.dpr, this.square * 0.08), _ = this.ctxO;
    _.save(), _.lineCap = "round", _.lineJoin = "round", _.strokeStyle = r, _.fillStyle = r, _.globalAlpha = 0.95, _.beginPath(), _.moveTo(e, t), _.lineTo(s - h * m, i - d * m), _.lineWidth = p, _.stroke(), _.beginPath(), _.moveTo(s, i), _.lineTo(s - h * m - d * m * 0.5, i - d * m + h * m * 0.5), _.lineTo(s - h * m + d * m * 0.5, i - d * m - h * m * 0.5), _.closePath(), _.fill(), _.restore();
  }
  _setSelection(e, t) {
    const s = se(t) ? "w" : "b";
    this._selected = e, s === this.state.turn ? this._legalCached = this.rules.movesFrom(e) : this.allowPremoves ? this._legalCached = [] : this._legalCached = null;
  }
  _handleClickMove(e) {
    const t = this._selected;
    if (!t || t === e) {
      t === e && this.renderAll();
      return;
    }
    const s = this._pieceAt(t);
    if (!s) {
      this._selected = null, this._legalCached = null, this.renderAll();
      return;
    }
    const i = this._pieceAt(e);
    if (i && se(i) === se(s)) {
      this._setSelection(e, i), this.renderAll();
      return;
    }
    this._attemptMove(t, e, s);
  }
  _attemptMove(e, t, s) {
    const i = se(s) ? "w" : "b";
    if (e === t)
      return this.renderAll(), !0;
    if (i !== this.state.turn)
      return this.allowPremoves ? (this.drawingManager && this.drawingManager.setPremove(e, t), this._premove = { from: e, to: t }, this._selected = null, this._legalCached = null, this._hoverSq = null, this.renderAll(), !0) : !1;
    const r = this.rules.move({ from: e, to: t });
    if (r && r.ok) {
      const o = this.rules.getFEN(), n = this.state, a = le(o);
      return this.state = a, this._syncOrientationFromTurn(!1), this._selected = null, this._legalCached = null, this._hoverSq = null, this._lastMove = { from: e, to: t }, this.drawingManager && this.drawingManager.clearArrows(), this._playMoveSound(), this._animateTo(a, n), this.bus.emit("move", { from: e, to: t, fen: o }), setTimeout(() => {
        this._executePremoveIfValid();
      }, this.animationMs + 50), !0;
    }
    return this._selected = null, this._legalCached = null, this._hoverSq = null, this.renderAll(), this.bus.emit("illegal", { from: e, to: t, reason: (r == null ? void 0 : r.reason) || "illegal" }), !0;
  }
  // ---- interaction ----
  _attachEvents() {
    let e = !1;
    const t = () => this._dragging ? (this._dragging = null, this._selected = null, this._legalCached = null, this._hoverSq = null, this.renderAll(), !0) : !1, s = (a) => {
      if (!this.interactive) {
        a.button === 2 && (a.preventDefault(), t() && (e = !0));
        return;
      }
      if (a.button === 2) {
        if (a.preventDefault(), t()) {
          e = !0;
          return;
        }
        e = !1;
        const _ = this._evt(a);
        _ && this.drawingManager && this.drawingManager.handleRightMouseDown(_.x, _.y, a.shiftKey, a.ctrlKey, a.altKey) && this.renderAll();
        return;
      }
      if (a.button !== 0) return;
      const h = this._evt(a);
      if (!h) return;
      const d = this._xyToSquare(h.x, h.y), m = this._pieceAt(d);
      !m || (se(m) ? "w" : "b") !== this.state.turn && !this.allowPremoves || (this._setSelection(d, m), this._dragging = { from: d, piece: m, x: h.x, y: h.y }, this._hoverSq = d, this.renderAll());
    }, i = (a) => {
      const h = this._evt(a);
      if (!h) {
        this.interactive && (this.cOverlay.style.cursor = "default");
        return;
      }
      if (this.drawingManager && this.drawingManager.handleMouseMove(h.x, h.y) && this.renderAll(), this._dragging)
        this._dragging.x = h.x, this._dragging.y = h.y, this._hoverSq = this._xyToSquare(h.x, h.y), this._drawPieces(), this._drawOverlay();
      else if (this.interactive) {
        const d = this._xyToSquare(h.x, h.y), m = this._pieceAt(d);
        this.cOverlay.style.cursor = m ? "pointer" : "default";
      }
    }, r = (a) => {
      if (a.button === 2) {
        if (t()) {
          e = !1;
          return;
        }
        if (e) {
          e = !1;
          return;
        }
      }
      const h = this._evt(a);
      if (a.button === 2) {
        let _ = !1;
        if (this.drawingManager && h && (_ = this.drawingManager.handleRightMouseUp(h.x, h.y)), !_ && h) {
          if (this.drawingManager && this.drawingManager.getPremove())
            this.drawingManager.clearPremove(), this._premove = null, console.log("Premove cancelled by right-click"), _ = !0;
          else if (this.rightClickHighlights) {
            const v = this._xyToSquare(h.x, h.y);
            this.drawingManager && this.drawingManager.handleHighlightClick(v, a.shiftKey, a.ctrlKey, a.altKey);
          }
        }
        this.renderAll();
        return;
      }
      if (this.drawingManager && this.drawingManager.handleMouseUp((h == null ? void 0 : h.x) || 0, (h == null ? void 0 : h.y) || 0)) {
        this.renderAll();
        return;
      }
      if (!this._dragging) {
        if (this.interactive && a.button === 0 && h) {
          const _ = this._xyToSquare(h.x, h.y);
          this._handleClickMove(_);
        }
        return;
      }
      const d = h ? this._xyToSquare(h.x, h.y) : null, m = this._dragging.from, p = this._dragging.piece;
      if (this._dragging = null, this._hoverSq = null, !d) {
        this._selected = null, this._legalCached = null, this.renderAll();
        return;
      }
      if (d === m) {
        this.renderAll();
        return;
      }
      this._attemptMove(m, d, p);
    }, o = (a) => {
      a.key === "Escape" && (this._selected = null, this._legalCached = null, this._dragging = null, this._hoverSq = null, this.drawingManager && this.drawingManager.cancelCurrentAction(), this.renderAll());
    }, n = (a) => {
      this.rightClickHighlights && a.preventDefault();
    };
    this.cOverlay.addEventListener("pointerdown", s), this.cOverlay.addEventListener("contextmenu", n), this._onPointerDown = s, this._onContextMenu = n, globalThis.addEventListener("pointermove", i), this._onPointerMove = i, globalThis.addEventListener("pointerup", r), this._onPointerUp = r, globalThis.addEventListener("keydown", o), this._onKeyDown = o;
  }
  _removeEvents() {
    var e;
    this.cOverlay.removeEventListener("pointerdown", this._onPointerDown), this.cOverlay.removeEventListener("contextmenu", this._onContextMenu), globalThis.removeEventListener("pointermove", this._onPointerMove), globalThis.removeEventListener("pointerup", this._onPointerUp), globalThis.removeEventListener("keydown", this._onKeyDown), (e = this._ro) == null || e.disconnect();
  }
  _evt(e) {
    const t = this.cOverlay.getBoundingClientRect(), s = (e.clientX - t.left) * (this.cOverlay.width / t.width), i = (e.clientY - t.top) * (this.cOverlay.height / t.height);
    return s < 0 || i < 0 || s > this.cOverlay.width || i > this.cOverlay.height ? null : { x: s, y: i };
  }
  _xyToSquare(e, t) {
    const s = Pe(Math.floor(e / this.square), 0, 7), i = Pe(Math.floor(t / this.square), 0, 7), r = this.orientation === "white" ? s : 7 - s, o = this.orientation === "white" ? 7 - i : i;
    return he(r, o);
  }
  _pieceAt(e) {
    const { f: t, r: s } = lt(e);
    return this.state.board[s][t];
  }
  // ---- animation ----
  /**
   * Clears any ongoing animation frame request.
   */
  _clearAnim() {
    cancelAnimationFrame(this._raf), this._raf = 0;
  }
  /**
   * Animates piece movements from a starting board state to a target board state.
   * @param target The target BoardState after the move.
   * @param start The starting BoardState before the move.
   */
  _animateTo(e, t) {
    this._clearAnim();
    const s = performance.now(), i = this.animationMs, r = /* @__PURE__ */ new Map();
    for (let n = 0; n < 8; n++)
      for (let a = 0; a < 8; a++) {
        const h = t.board[n][a], d = e.board[n][a];
        if (h && (!d || h !== d)) {
          const m = this.findPiece(e.board, h, n, a, t.board);
          m && r.set(he(a, n), he(m.f, m.r));
        }
      }
    const o = () => {
      var d;
      const n = Pe((performance.now() - s) / i, 0, 1), a = Ei(n);
      this.ctxP.clearRect(0, 0, this.cPieces.width, this.cPieces.height);
      for (let m = 0; m < 8; m++)
        for (let p = 0; p < 8; p++) {
          const _ = e.board[m][p];
          if (!_) continue;
          const v = he(p, m), P = (d = [...r.entries()].find(([C, T]) => T === v)) == null ? void 0 : d[0];
          if (P) {
            const { x: C, y: T } = this._sqToXY(P), { x: k, y: x } = this._sqToXY(v), K = ct(C, k, a), L = ct(T, x, a);
            this._drawPieceSprite(_, K, L, 1);
          } else {
            const { x: C, y: T } = this._sqToXY(v);
            this._drawPieceSprite(_, C, T, 1);
          }
        }
      this._drawOverlay(), n < 1 ? this._raf = requestAnimationFrame(o) : (this._raf = 0, this.renderAll());
    };
    this._raf = requestAnimationFrame(o);
  }
  /**
   * Finds the new position of a piece after a move.
   * This is a helper function for `_animateTo` to track piece movements.
   * @param board The target board state.
   * @param piece The piece to find.
   * @param r0 Original row of the piece.
   * @param f0 Original file of the piece.
   * @param start The starting board state.
   * @returns The new row and file of the piece, or null if not found.
   */
  findPiece(e, t, s, i, r) {
    for (let o = 0; o < 8; o++)
      for (let n = 0; n < 8; n++)
        if (e[o][n] === t && r[o][n] !== t) return { r: o, f: n };
    return null;
  }
  // ---- Drawing methods ----
  /**
   * This method appears to be a remnant or is currently unused.
   * It attempts to draw the board and pieces using the DrawingManager.
   * @deprecated This method might be removed or refactored in future versions.
   */
  _draw() {
    if (!this.drawingManager) return;
    const e = this.ctxP || this.cPieces.getContext("2d");
    e && (e.clearRect(0, 0, this.cPieces.width, this.cPieces.height), this.drawingManager.draw(e), "renderArrows" in this.drawingManager && this.drawingManager.renderArrows(), "renderHighlights" in this.drawingManager && this.drawingManager.renderHighlights());
  }
  // ---- Sound methods ----
  /**
   * Initializes the audio element for move sounds if sound is enabled and a sound URL is provided.
   * Handles potential loading errors silently.
   */
  _initializeSound() {
    var r, o;
    if (this.moveSound = null, this.moveSounds = {}, !this.soundEnabled || typeof Audio > "u") return;
    const e = this.soundUrl, t = (r = this.soundUrls) == null ? void 0 : r.white, s = (o = this.soundUrls) == null ? void 0 : o.black;
    if (!e && !t && !s)
      return;
    const i = (n) => {
      try {
        const a = new Audio(n);
        return a.volume = 0.3, a.preload = "auto", a.addEventListener("error", () => {
          console.debug("Sound not available");
        }), a;
      } catch (a) {
        return console.warn("Unable to load move sound:", a), null;
      }
    };
    if (t) {
      const n = i(t);
      n && (this.moveSounds.white = n);
    }
    if (s) {
      const n = i(s);
      n && (this.moveSounds.black = n);
    }
    if (e) {
      const n = i(e);
      n && (this.moveSound = n);
    }
  }
  /**
   * Plays the move sound if sound is enabled and the audio element is initialized.
   * Catches and ignores playback errors (e.g., due to user interaction policies).
   */
  _playMoveSound() {
    if (!this.soundEnabled) return;
    const e = this.state.turn === "w" ? "black" : "white", t = this.moveSounds[e] ?? this.moveSound;
    if (t)
      try {
        t.currentTime = 0, t.play().catch((s) => {
          console.debug("Sound not played:", s.message);
        });
      } catch (s) {
        console.debug("Error playing sound:", s);
      }
  }
  /**
   * Synchronizes the board orientation with the side to move when auto-flip is enabled.
   * @param initial When true, only the internal orientation state is updated without rendering.
   */
  _syncOrientationFromTurn(e = !1) {
    if (!this.autoFlip)
      return;
    const t = this.state.turn === "w" ? "white" : "black";
    if (e || !this.drawingManager) {
      this.orientation = t, this.drawingManager && !e && this.drawingManager.setOrientation(t);
      return;
    }
    this.orientation !== t && this.setOrientation(t);
  }
  /**
   * Enables or disables sound effects for moves.
   * If enabling and sound is not yet initialized, it will attempt to initialize it.
   * @param enabled True to enable sounds, false to disable.
   */
  setSoundEnabled(e) {
    this.soundEnabled = e, e ? this._initializeSound() : (this.moveSound = null, this.moveSounds = {});
  }
  /**
   * Updates the URLs used for move sounds and reinitializes audio elements if needed.
   * @param soundUrls Move sound URLs keyed by the color that just played.
   */
  setSoundUrls(e) {
    this.soundUrls = e, this.soundEnabled ? this._initializeSound() : (this.moveSound = null, this.moveSounds = {});
  }
  /**
   * Enables or disables automatic board flipping based on the side to move.
   * @param autoFlip True to enable auto-flip, false to disable it.
   */
  setAutoFlip(e) {
    this.autoFlip = e, e && this._syncOrientationFromTurn(!this.drawingManager);
  }
  /**
   * Sets the board orientation.
   * @param orientation The desired orientation ('white' or 'black').
   */
  setOrientation(e) {
    this.orientation = e, this.drawingManager && this.drawingManager.setOrientation(e), this.renderAll();
  }
  /**
   * Shows or hides arrows drawn on the board.
   * @param show True to show arrows, false to hide them.
   */
  setShowArrows(e) {
    this.showArrows = e, this.renderAll();
  }
  /**
   * Shows or hides highlights on the board.
   * @param show True to show highlights, false to hide them.
   */
  setShowHighlights(e) {
    this.showHighlights = e, this.renderAll();
  }
  /**
   * Enables or disables premoves.
   * If premoves are disabled, any existing premove will be cleared.
   * @param allow True to allow premoves, false to disallow.
   */
  setAllowPremoves(e) {
    this.allowPremoves = e, e || this.clearPremove(), this.renderAll();
  }
  /**
   * Enables or disables highlighting of legal moves for the selected piece.
   * @param highlight True to highlight legal moves, false to disable.
   */
  setHighlightLegal(e) {
    this.highlightLegal = e, this.renderAll();
  }
  /**
   * Shows or hides square names (coordinates) on the board.
   * @param show True to show square names, false to hide them.
   */
  setShowSquareNames(e) {
    this.showSquareNames = e, this.drawingManager && this.drawingManager.setShowSquareNames(e), this.renderAll();
  }
  // ---- Private methods for premove execution ----
  /**
   * Attempts to execute a stored premove if it is valid in the current board position.
   * This method is typically called after an opponent's move has been processed.
   * If the premove is legal, it is executed after a short delay to allow for animation.
   * If illegal, the premove is silently cleared.
   */
  _executePremoveIfValid() {
    if (!this.allowPremoves || !this.drawingManager) return;
    const e = this.drawingManager.getPremove();
    if (!e) return;
    const t = this.rules.move({
      from: e.from,
      to: e.to,
      promotion: e.promotion
    });
    t && t.ok ? setTimeout(() => {
      var o, n;
      const s = this.rules.getFEN(), i = le(s), r = this.state;
      this.state = i, this._syncOrientationFromTurn(!1), this._lastMove = { from: e.from, to: e.to }, (o = this.drawingManager) == null || o.clearPremove(), (n = this.drawingManager) == null || n.clearArrows(), this._premove = null, this._animateTo(i, r), this.bus.emit("move", { from: e.from, to: e.to, fen: s });
    }, 150) : (this.drawingManager.clearPremove(), this._premove = null, this.renderAll());
  }
  // ---- New feature methods ----
  /**
   * Add an arrow on the board
   * @param arrow The arrow to add (can be an object with from/to or an Arrow object)
   */
  addArrow(e) {
    this.drawingManager && "from" in e && "to" in e && ("knightMove" in e ? this.drawingManager.addArrowFromObject(e) : this.drawingManager.addArrow(e), this.renderAll());
  }
  /**
   * Remove an arrow from the board
   */
  removeArrow(e, t) {
    this.drawingManager && (this.drawingManager.removeArrow(e, t), this.renderAll());
  }
  /**
   * Clear all arrows
   */
  clearArrows() {
    this.drawingManager && (this.drawingManager.clearArrows(), this.renderAll());
  }
  /**
   * Add a highlight to a square
   * @param square The square to highlight (e.g., 'e4')
   * @param type The type of highlight (e.g., 'selected', 'lastMove', 'check')
   */
  addHighlight(e, t) {
    this.drawingManager && (typeof e == "string" && t ? (this.drawingManager.addHighlight(e, t), this.renderAll()) : typeof e == "object" && "square" in e && (this.drawingManager.addHighlightFromObject(e), this.renderAll()));
  }
  /**
   * Remove a highlight from a square
   */
  removeHighlight(e) {
    this.drawingManager && (this.drawingManager.removeHighlight(e), this.renderAll());
  }
  /**
   * Clear all highlights
   */
  clearHighlights() {
    this.drawingManager && (this.drawingManager.clearHighlights(), this.renderAll());
  }
  /**
   * Set a premove
   */
  setPremove(e) {
    this.drawingManager && this.allowPremoves && (this.drawingManager.setPremoveFromObject(e), this.renderAll());
  }
  /**
   * Clear the current premove
   */
  clearPremove() {
    this.drawingManager && (this.drawingManager.clearPremove(), this.renderAll());
  }
  /**
   * Get the current premove
   */
  getPremove() {
    return this.drawingManager && this.drawingManager.getPremove() || null;
  }
  /**
   * Clear all drawings (arrows, highlights, premoves)
   */
  clearAllDrawings() {
    this.drawingManager && (this.drawingManager.clearAll(), this.renderAll());
  }
  /**
   * Export the drawings state
   */
  exportDrawings() {
    return this.drawingManager ? this.drawingManager.exportState() : null;
  }
  /**
   * Import the drawings state
   */
  importDrawings(e) {
    this.drawingManager && (this.drawingManager.importState(e), this.renderAll());
  }
  /**
   * Load a PGN with visual annotations
   */
  loadPgnWithAnnotations(e) {
    try {
      if (this.rules.loadPgn ? this.rules.loadPgn(e) : !1) {
        const s = this.rules.getPgnNotation ? this.rules.getPgnNotation() : null;
        return s && (s.loadPgnWithAnnotations(e), this.displayAnnotationsFromPgn(s)), this.state = le(this.rules.getFEN()), this._syncOrientationFromTurn(!1), this.renderAll(), !0;
      }
      return !1;
    } catch (t) {
      return console.error("Error loading PGN with annotations:", t), !1;
    }
  }
  /**
   * Display annotations from the last move played
   */
  displayAnnotationsFromPgn(e) {
    if (!this.drawingManager) return;
    this.drawingManager.clearArrows(), this.drawingManager.clearHighlights();
    const t = e.getMovesWithAnnotations();
    if (t.length === 0) return;
    const s = t[t.length - 1];
    (s.white ? 1 : 0) + (s.black ? 1 : 0);
    const i = t.reduce(
      (o, n) => o + (n.white ? 1 : 0) + (n.black ? 1 : 0),
      0
    );
    let r = null;
    if (i % 2 === 0 && s.blackAnnotations ? r = s.blackAnnotations : i % 2 === 1 && s.whiteAnnotations && (r = s.whiteAnnotations), r) {
      if (r.arrows)
        for (const o of r.arrows)
          this.drawingManager.addArrowFromObject(o);
      if (r.circles)
        for (const o of r.circles)
          this.drawingManager.addHighlightFromObject(o);
    }
  }
  /**
   * Add visual annotations to the current move and save them in the PGN
   */
  addAnnotationsToCurrentMove(e = [], t = [], s = "") {
    if (!this.drawingManager) return;
    const i = this.rules.getPgnNotation ? this.rules.getPgnNotation() : null;
    if (i) {
      const o = (this.rules.history ? this.rules.history() : []).length, n = Math.floor(o / 2) + 1, a = o % 2 === 0;
      i.addMoveAnnotations(n, a, {
        arrows: e,
        circles: t,
        textComment: s
      });
    }
    for (const r of e)
      this.drawingManager.addArrowFromObject(r);
    for (const r of t)
      this.drawingManager.addHighlightFromObject(r);
    this.renderAll();
  }
  /**
   * Export the PGN with all visual annotations
   */
  exportPgnWithAnnotations() {
    const e = this.rules.getPgnNotation ? this.rules.getPgnNotation() : null;
    return e && typeof e.toPgnWithAnnotations == "function" ? e.toPgnWithAnnotations() : this.rules.toPgn ? this.rules.toPgn() : "";
  }
}
class cs {
  constructor(e) {
    this.adapter = e, this.moves = [], this.headers = {
      Event: "Casual Game",
      Site: "Local",
      Date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "."),
      Round: "1",
      White: "White",
      Black: "Black",
      Result: "*"
    };
  }
  reset() {
    this.moves = [];
  }
  push(e) {
    this.moves.push(e);
  }
  setHeaders(e) {
    var t;
    Object.assign(this.headers, e), (t = this.adapter) != null && t.header && this.adapter.header(this.headers);
  }
  setResult(e) {
    this.headers.Result = e;
  }
  getPGN() {
    var s;
    if ((s = this.adapter) != null && s.getPGN)
      return this.adapter.getPGN();
    const e = Object.entries(this.headers).map(([i, r]) => `[${i} "${r}"]`).join(`
`);
    let t = "";
    for (let i = 0; i < this.moves.length; i += 2) {
      const r = i / 2 + 1, o = this.fmt(this.moves[i]), n = this.moves[i + 1] ? this.fmt(this.moves[i + 1]) : "";
      t += `${r}. ${o}${n ? " " + n : ""} `;
    }
    return e + `

` + t.trim() + (this.headers.Result ? " " + this.headers.Result : "");
  }
  toBlob() {
    const e = this.getPGN();
    return new Blob([e], { type: "application/x-chess-pgn" });
  }
  suggestFilename() {
    const e = (s) => s.replace(/[^a-z0-9_\-]+/gi, "_"), t = (this.headers.Date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)).replace(/\./g, "-");
    return `${e(this.headers.White || "White")}_vs_${e(this.headers.Black || "Black")}_${t}.pgn`;
  }
  download(e = this.suggestFilename()) {
    if (typeof document > "u")
      return;
    const t = URL.createObjectURL(this.toBlob()), s = document.createElement("a");
    s.href = t, s.download = e, document.body.appendChild(s), s.click(), setTimeout(() => {
      document.body.removeChild(s), URL.revokeObjectURL(t);
    }, 0);
  }
  fmt(e) {
    const t = e.promotion ? `=${e.promotion.toUpperCase()}` : "";
    return `${e.from}${e.captured ? "x" : ""}${e.to}${t}`;
  }
}
function Fe(c) {
  return {
    from: c.from,
    to: c.to,
    promotion: c.promotion,
    captured: c.captured ?? void 0,
    san: c.san
  };
}
function bt() {
  const c = document.getElementById("oracle-board");
  if (!c) {
    console.warn("[oracle-board] Missing container #oracle-board.");
    return;
  }
  const e = new Ae(), t = new ls(c, {
    rulesAdapter: e,
    interactive: !0,
    highlightLegal: !0,
    showCoordinates: !0,
    showHighlights: !0,
    showArrows: !0,
    allowPremoves: !1,
    animationMs: 200,
    soundEnabled: !1
  }), s = new cs(e), i = e, r = () => {
    if (typeof i.getHistory == "function")
      return i.getHistory();
    if (typeof i.history == "function")
      try {
        return i.history({ verbose: !0 }) ?? [];
      } catch (m) {
        console.warn("[oracle-board] Unable to access verbose history.", m);
      }
    return [];
  }, o = () => {
    s.reset(), r().forEach((m) => s.push(Fe(m)));
  };
  let n, a;
  const h = () => {
    a == null || a({ fen: e.getFEN(), pgn: s.getPGN() });
  };
  t.on("move", (m) => {
    const { from: p, to: _, fen: v } = m, P = r(), C = P[P.length - 1];
    C ? (s.push(Fe(C)), n == null || n({ from: p, to: _, fen: v, san: C.san })) : (s.push(Fe({ from: p, to: _ })), n == null || n({ from: p, to: _, fen: v })), h();
  }), t.on("update", () => h());
  const d = {
    loadPgn(m) {
      if (typeof m != "string" || m.trim().length === 0)
        return !1;
      const p = t.loadPgnWithAnnotations(m);
      return p && (o(), h()), p;
    },
    reset() {
      typeof e.reset == "function" ? e.reset() : e.setFEN("start"), s.reset(), t.setFEN(e.getFEN(), !0), h();
    },
    getFen() {
      return e.getFEN();
    },
    getPgn() {
      return s.getPGN();
    },
    onMove(m) {
      n = m;
    },
    onUpdate(m) {
      a = m, h();
    }
  };
  window.oracleBoard = d, document.dispatchEvent(
    new CustomEvent("oracle-board:ready", {
      detail: d
    })
  ), h();
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", bt, { once: !0 }) : bt();
