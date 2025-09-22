var Ms = Object.defineProperty;
var Es = (h, e, t) => e in h ? Ms(h, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : h[e] = t;
var F = (h, e, t) => Es(h, typeof e != "symbol" ? e + "" : e, t);
class Ts {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  on(e, t) {
    return this.map.has(e) || this.map.set(e, /* @__PURE__ */ new Set()), this.map.get(e).add(t), () => this.off(e, t);
  }
  off(e, t) {
    var i;
    (i = this.map.get(e)) == null || i.delete(t);
  }
  emit(e, t) {
    var i;
    (i = this.map.get(e)) == null || i.forEach((s) => {
      try {
        s(t);
      } catch (r) {
        console.error(r);
      }
    });
  }
}
const $e = ["a", "b", "c", "d", "e", "f", "g", "h"], Ze = ["1", "2", "3", "4", "5", "6", "7", "8"];
function de(h) {
  return h === h.toUpperCase();
}
function be(h, e) {
  return $e[h] + Ze[e];
}
function pt(h) {
  return {
    f: $e.indexOf(h[0]),
    r: Ze.indexOf(h[1])
  };
}
function Se(h) {
  const e = h.split(" "), t = Array(8).fill(null).map(() => Array(8).fill(null)), i = e[0].split("/");
  for (let s = 0; s < 8; s++) {
    const r = i[s];
    let o = 0;
    for (const n of r)
      /\d/.test(n) ? o += parseInt(n) : (t[7 - s][o] = n, o++);
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
function xe(h, e, t) {
  return Math.max(e, Math.min(t, h));
}
function vt(h, e, t) {
  return h + (e - h) * t;
}
function ks(h) {
  return 1 - Math.pow(1 - h, 3);
}
const Tt = {
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
}, qs = "classic", kt = () => Tt[qs], Ns = (h) => {
  const e = kt();
  return {
    ...e,
    ...h,
    pieceStroke: h.pieceStroke ?? e.pieceStroke,
    pieceHighlight: h.pieceHighlight ?? e.pieceHighlight
  };
}, _t = (h) => typeof h == "string" ? Tt[h] ?? kt() : Ns(h);
class Is {
  constructor(e, t) {
    this.size = e, this.colors = t, this.sheet = this.build(e);
  }
  getSheet() {
    return this.sheet;
  }
  rr(e, t, i, s, r, o) {
    const n = Math.min(o, s / 2, r / 2);
    e.beginPath(), e.moveTo(t + n, i), e.lineTo(t + s - n, i), e.quadraticCurveTo(t + s, i, t + s, i + n), e.lineTo(t + s, i + r - n), e.quadraticCurveTo(t + s, i + r, t + s - n, i + r), e.lineTo(t + n, i + r), e.quadraticCurveTo(t, i + r, t, i + r - n), e.lineTo(t, i + n), e.quadraticCurveTo(t, i, t + n, i), e.closePath();
  }
  build(e) {
    const t = typeof OffscreenCanvas < "u" ? new OffscreenCanvas(e * 6, e * 2) : Object.assign(document.createElement("canvas"), { width: e * 6, height: e * 2 }), i = t.getContext("2d");
    return ["k", "q", "r", "b", "n", "p"].forEach((r, o) => {
      this.draw(i, o * e, 0, e, r, "black"), this.draw(i, o * e, e, e, r, "white");
    }), t;
  }
  draw(e, t, i, s, r, o) {
    const n = o === "white" ? this.colors.whitePiece : this.colors.blackPiece, a = this.colors.pieceShadow;
    e.save(), e.translate(t, i), e.fillStyle = a, e.beginPath(), e.ellipse(s * 0.5, s * 0.68, s * 0.28, s * 0.1, 0, 0, Math.PI * 2), e.fill(), e.fillStyle = n, e.lineJoin = "round", e.lineCap = "round";
    const l = () => {
      e.beginPath(), e.moveTo(s * 0.2, s * 0.7), e.quadraticCurveTo(s * 0.5, s * 0.6, s * 0.8, s * 0.7), e.lineTo(s * 0.8, s * 0.8), e.quadraticCurveTo(s * 0.5, s * 0.85, s * 0.2, s * 0.8), e.closePath(), e.fill();
    };
    if (r === "p" && (e.beginPath(), e.arc(s * 0.5, s * 0.38, s * 0.12, 0, Math.PI * 2), e.fill(), e.beginPath(), e.moveTo(s * 0.38, s * 0.52), e.quadraticCurveTo(s * 0.5, s * 0.42, s * 0.62, s * 0.52), e.quadraticCurveTo(s * 0.64, s * 0.6, s * 0.5, s * 0.62), e.quadraticCurveTo(s * 0.36, s * 0.6, s * 0.38, s * 0.52), e.closePath(), e.fill(), l()), r === "r" && (e.beginPath(), this.rr(e, s * 0.32, s * 0.3, s * 0.36, s * 0.34, s * 0.04), e.fill(), e.beginPath(), this.rr(e, s * 0.3, s * 0.22, s * 0.12, s * 0.1, s * 0.02), e.fill(), e.beginPath(), this.rr(e, s * 0.44, s * 0.2, s * 0.12, s * 0.12, s * 0.02), e.fill(), e.beginPath(), this.rr(e, s * 0.58, s * 0.22, s * 0.12, s * 0.1, s * 0.02), e.fill(), l()), r === "n") {
      e.beginPath(), e.moveTo(s * 0.64, s * 0.6), e.quadraticCurveTo(s * 0.7, s * 0.35, s * 0.54, s * 0.28), e.quadraticCurveTo(s * 0.46, s * 0.24, s * 0.44, s * 0.3), e.quadraticCurveTo(s * 0.42, s * 0.42, s * 0.34, s * 0.44), e.quadraticCurveTo(s * 0.3, s * 0.46, s * 0.28, s * 0.5), e.quadraticCurveTo(s * 0.26, s * 0.6, s * 0.38, s * 0.62), e.closePath(), e.fill();
      const g = e.fillStyle;
      e.fillStyle = "rgba(0,0,0,0.15)", e.beginPath(), e.arc(s * 0.5, s * 0.36, s * 0.02, 0, Math.PI * 2), e.fill(), e.fillStyle = g, l();
    }
    if (r === "b") {
      e.beginPath(), e.ellipse(s * 0.5, s * 0.42, s * 0.12, s * 0.18, 0, 0, Math.PI * 2), e.fill();
      const g = e.globalCompositeOperation;
      e.globalCompositeOperation = "destination-out", e.beginPath(), e.moveTo(s * 0.5, s * 0.28), e.lineTo(s * 0.5, s * 0.52), e.lineWidth = s * 0.04, e.stroke(), e.globalCompositeOperation = g, l();
    }
    r === "q" && (e.beginPath(), e.moveTo(s * 0.3, s * 0.3), e.lineTo(s * 0.4, s * 0.18), e.lineTo(s * 0.5, s * 0.3), e.lineTo(s * 0.6, s * 0.18), e.lineTo(s * 0.7, s * 0.3), e.closePath(), e.fill(), e.beginPath(), e.ellipse(s * 0.5, s * 0.5, s * 0.16, s * 0.16, 0, 0, Math.PI * 2), e.fill(), l()), r === "k" && (e.beginPath(), this.rr(e, s * 0.47, s * 0.16, s * 0.06, s * 0.16, s * 0.02), e.fill(), e.beginPath(), this.rr(e, s * 0.4, s * 0.22, s * 0.2, s * 0.06, s * 0.02), e.fill(), e.beginPath(), this.rr(e, s * 0.36, s * 0.34, s * 0.28, s * 0.26, s * 0.08), e.fill(), l()), e.restore();
  }
}
function Os(h) {
  return h !== null ? { comment: h, variations: [] } : { variations: [] };
}
function $s(h, e, t, i, s) {
  const r = { move: h, variations: s };
  return e && (r.suffix = e), t && (r.nag = t), i !== null && (r.comment = i), r;
}
function Rs(...h) {
  const [e, ...t] = h;
  let i = e;
  for (const s of t)
    s !== null && (i.variations = [s, ...s.variations], s.variations = [], i = s);
  return e;
}
function Fs(h, e) {
  if (e.marker && e.marker.comment) {
    let t = e.root;
    for (; ; ) {
      const i = t.variations[0];
      if (!i) {
        t.comment = e.marker.comment;
        break;
      }
      t = i;
    }
  }
  return {
    headers: h,
    root: e.root,
    result: (e.marker && e.marker.result) ?? void 0
  };
}
function Ls(h, e) {
  function t() {
    this.constructor = h;
  }
  t.prototype = e.prototype, h.prototype = new t();
}
function ve(h, e, t, i) {
  var s = Error.call(this, h);
  return Object.setPrototypeOf && Object.setPrototypeOf(s, ve.prototype), s.expected = e, s.found = t, s.location = i, s.name = "SyntaxError", s;
}
Ls(ve, Error);
function He(h, e, t) {
  return t = t || " ", h.length > e ? h : (e -= h.length, t += t.repeat(e), h + t.slice(0, e));
}
ve.prototype.format = function(h) {
  var e = "Error: " + this.message;
  if (this.location) {
    var t = null, i;
    for (i = 0; i < h.length; i++)
      if (h[i].source === this.location.source) {
        t = h[i].text.split(/\r\n|\n|\r/g);
        break;
      }
    var s = this.location.start, r = this.location.source && typeof this.location.source.offset == "function" ? this.location.source.offset(s) : s, o = this.location.source + ":" + r.line + ":" + r.column;
    if (t) {
      var n = this.location.end, a = He("", r.line.toString().length, " "), l = t[s.line - 1], g = s.line === n.line ? n.column : l.length + 1, d = g - s.column || 1;
      e += `
 --> ` + o + `
` + a + ` |
` + r.line + " | " + l + `
` + a + " | " + He("", s.column - 1, " ") + He("", d, "^");
    } else
      e += `
 at ` + o;
  }
  return e;
};
ve.buildMessage = function(h, e) {
  var t = {
    literal: function(l) {
      return '"' + s(l.text) + '"';
    },
    class: function(l) {
      var g = l.parts.map(function(d) {
        return Array.isArray(d) ? r(d[0]) + "-" + r(d[1]) : r(d);
      });
      return "[" + (l.inverted ? "^" : "") + g.join("") + "]";
    },
    any: function() {
      return "any character";
    },
    end: function() {
      return "end of input";
    },
    other: function(l) {
      return l.description;
    }
  };
  function i(l) {
    return l.charCodeAt(0).toString(16).toUpperCase();
  }
  function s(l) {
    return l.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(g) {
      return "\\x0" + i(g);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(g) {
      return "\\x" + i(g);
    });
  }
  function r(l) {
    return l.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(g) {
      return "\\x0" + i(g);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(g) {
      return "\\x" + i(g);
    });
  }
  function o(l) {
    return t[l.type](l);
  }
  function n(l) {
    var g = l.map(o), d, u;
    if (g.sort(), g.length > 0) {
      for (d = 1, u = 1; d < g.length; d++)
        g[d - 1] !== g[d] && (g[u] = g[d], u++);
      g.length = u;
    }
    switch (g.length) {
      case 1:
        return g[0];
      case 2:
        return g[0] + " or " + g[1];
      default:
        return g.slice(0, -1).join(", ") + ", or " + g[g.length - 1];
    }
  }
  function a(l) {
    return l ? '"' + s(l) + '"' : "end of input";
  }
  return "Expected " + n(h) + " but " + a(e) + " found.";
};
function xs(h, e) {
  e = e !== void 0 ? e : {};
  var t = {}, i = e.grammarSource, s = { pgn: ct }, r = ct, o = "[", n = '"', a = "]", l = ".", g = "O-O-O", d = "O-O", u = "0-0-0", v = "0-0", _ = "$", b = "{", A = "}", q = ";", $ = "(", R = ")", O = "1-0", H = "0-1", Q = "1/2-1/2", ie = "*", V = /^[a-zA-Z]/, Y = /^[^"]/, re = /^[0-9]/, te = /^[.]/, Pe = /^[a-zA-Z1-8\-=]/, Me = /^[+#]/, S = /^[!?]/, y = /^[^}]/, E = /^[^\r\n]/, N = /^[ \t\r\n]/, L = J("tag pair"), G = z("[", !1), j = z('"', !1), ue = z("]", !1), _e = J("tag name"), fe = se([["a", "z"], ["A", "Z"]], !1, !1), Nt = J("tag value"), tt = se(['"'], !0, !1), It = J("move number"), Ee = se([["0", "9"]], !1, !1), Ot = z(".", !1), st = se(["."], !1, !1), $t = J("standard algebraic notation"), Rt = z("O-O-O", !1), Ft = z("O-O", !1), Lt = z("0-0-0", !1), xt = z("0-0", !1), it = se([["a", "z"], ["A", "Z"], ["1", "8"], "-", "="], !1, !1), Ht = se(["+", "#"], !1, !1), Dt = J("suffix annotation"), rt = se(["!", "?"], !1, !1), zt = J("NAG"), Kt = z("$", !1), Ut = J("brace comment"), Bt = z("{", !1), nt = se(["}"], !0, !1), jt = z("}", !1), Wt = J("rest of line comment"), Yt = z(";", !1), ot = se(["\r", `
`], !0, !1), Gt = J("variation"), Xt = z("(", !1), Qt = z(")", !1), Vt = J("game termination marker"), Jt = z("1-0", !1), Zt = z("0-1", !1), es = z("1/2-1/2", !1), ts = z("*", !1), ss = J("whitespace"), at = se([" ", "	", "\r", `
`], !1, !1), is = function(c, m) {
    return Fs(c, m);
  }, rs = function(c) {
    return Object.fromEntries(c);
  }, ns = function(c, m) {
    return [c, m];
  }, os = function(c, m) {
    return { root: c, marker: m };
  }, as = function(c, m) {
    return Rs(Os(c), ...m.flat());
  }, ls = function(c, m, p, P, M) {
    return $s(c, m, p, P, M);
  }, hs = function(c) {
    return c;
  }, cs = function(c) {
    return c.replace(/[\r\n]+/g, " ");
  }, us = function(c) {
    return c.trim();
  }, fs = function(c) {
    return c;
  }, gs = function(c, m) {
    return { result: c, comment: m };
  }, f = e.peg$currPos | 0, ge = [{ line: 1, column: 1 }], ee = f, Te = e.peg$maxFailExpected || [], w = e.peg$silentFails | 0, we;
  if (e.startRule) {
    if (!(e.startRule in s))
      throw new Error(`Can't start parsing from rule "` + e.startRule + '".');
    r = s[e.startRule];
  }
  function z(c, m) {
    return { type: "literal", text: c, ignoreCase: m };
  }
  function se(c, m, p) {
    return { type: "class", parts: c, inverted: m, ignoreCase: p };
  }
  function ds() {
    return { type: "end" };
  }
  function J(c) {
    return { type: "other", description: c };
  }
  function lt(c) {
    var m = ge[c], p;
    if (m)
      return m;
    if (c >= ge.length)
      p = ge.length - 1;
    else
      for (p = c; !ge[--p]; )
        ;
    for (m = ge[p], m = {
      line: m.line,
      column: m.column
    }; p < c; )
      h.charCodeAt(p) === 10 ? (m.line++, m.column = 1) : m.column++, p++;
    return ge[c] = m, m;
  }
  function ht(c, m, p) {
    var P = lt(c), M = lt(m), I = {
      source: i,
      start: {
        offset: c,
        line: P.line,
        column: P.column
      },
      end: {
        offset: m,
        line: M.line,
        column: M.column
      }
    };
    return I;
  }
  function C(c) {
    f < ee || (f > ee && (ee = f, Te = []), Te.push(c));
  }
  function ms(c, m, p) {
    return new ve(
      ve.buildMessage(c, m),
      c,
      m,
      p
    );
  }
  function ct() {
    var c, m, p;
    return c = f, m = ps(), p = ws(), c = is(m, p), c;
  }
  function ps() {
    var c, m, p;
    for (c = f, m = [], p = ut(); p !== t; )
      m.push(p), p = ut();
    return p = W(), c = rs(m), c;
  }
  function ut() {
    var c, m, p, P, M, I, le;
    return w++, c = f, W(), h.charCodeAt(f) === 91 ? (m = o, f++) : (m = t, w === 0 && C(G)), m !== t ? (W(), p = vs(), p !== t ? (W(), h.charCodeAt(f) === 34 ? (P = n, f++) : (P = t, w === 0 && C(j)), P !== t ? (M = _s(), h.charCodeAt(f) === 34 ? (I = n, f++) : (I = t, w === 0 && C(j)), I !== t ? (W(), h.charCodeAt(f) === 93 ? (le = a, f++) : (le = t, w === 0 && C(ue)), le !== t ? c = ns(p, M) : (f = c, c = t)) : (f = c, c = t)) : (f = c, c = t)) : (f = c, c = t)) : (f = c, c = t), w--, c === t && w === 0 && C(L), c;
  }
  function vs() {
    var c, m, p;
    if (w++, c = f, m = [], p = h.charAt(f), V.test(p) ? f++ : (p = t, w === 0 && C(fe)), p !== t)
      for (; p !== t; )
        m.push(p), p = h.charAt(f), V.test(p) ? f++ : (p = t, w === 0 && C(fe));
    else
      m = t;
    return m !== t ? c = h.substring(c, f) : c = m, w--, c === t && (m = t, w === 0 && C(_e)), c;
  }
  function _s() {
    var c, m, p;
    for (w++, c = f, m = [], p = h.charAt(f), Y.test(p) ? f++ : (p = t, w === 0 && C(tt)); p !== t; )
      m.push(p), p = h.charAt(f), Y.test(p) ? f++ : (p = t, w === 0 && C(tt));
    return c = h.substring(c, f), w--, m = t, w === 0 && C(Nt), c;
  }
  function ws() {
    var c, m, p;
    return c = f, m = ft(), W(), p = Ps(), p === t && (p = null), W(), c = os(m, p), c;
  }
  function ft() {
    var c, m, p, P;
    for (c = f, m = Le(), m === t && (m = null), p = [], P = gt(); P !== t; )
      p.push(P), P = gt();
    return c = as(m, p), c;
  }
  function gt() {
    var c, m, p, P, M, I, le, ke;
    if (c = f, W(), bs(), W(), m = Ss(), m !== t) {
      for (p = ys(), p === t && (p = null), P = [], M = dt(); M !== t; )
        P.push(M), M = dt();
      for (M = W(), I = Le(), I === t && (I = null), le = [], ke = mt(); ke !== t; )
        le.push(ke), ke = mt();
      c = ls(m, p, P, I, le);
    } else
      f = c, c = t;
    return c;
  }
  function bs() {
    var c, m, p, P, M, I;
    for (w++, c = f, m = [], p = h.charAt(f), re.test(p) ? f++ : (p = t, w === 0 && C(Ee)); p !== t; )
      m.push(p), p = h.charAt(f), re.test(p) ? f++ : (p = t, w === 0 && C(Ee));
    if (h.charCodeAt(f) === 46 ? (p = l, f++) : (p = t, w === 0 && C(Ot)), p !== t) {
      for (P = W(), M = [], I = h.charAt(f), te.test(I) ? f++ : (I = t, w === 0 && C(st)); I !== t; )
        M.push(I), I = h.charAt(f), te.test(I) ? f++ : (I = t, w === 0 && C(st));
      m = [m, p, P, M], c = m;
    } else
      f = c, c = t;
    return w--, c === t && (m = t, w === 0 && C(It)), c;
  }
  function Ss() {
    var c, m, p, P, M, I;
    if (w++, c = f, m = f, h.substr(f, 5) === g ? (p = g, f += 5) : (p = t, w === 0 && C(Rt)), p === t && (h.substr(f, 3) === d ? (p = d, f += 3) : (p = t, w === 0 && C(Ft)), p === t && (h.substr(f, 5) === u ? (p = u, f += 5) : (p = t, w === 0 && C(Lt)), p === t && (h.substr(f, 3) === v ? (p = v, f += 3) : (p = t, w === 0 && C(xt)), p === t))))
      if (p = f, P = h.charAt(f), V.test(P) ? f++ : (P = t, w === 0 && C(fe)), P !== t) {
        if (M = [], I = h.charAt(f), Pe.test(I) ? f++ : (I = t, w === 0 && C(it)), I !== t)
          for (; I !== t; )
            M.push(I), I = h.charAt(f), Pe.test(I) ? f++ : (I = t, w === 0 && C(it));
        else
          M = t;
        M !== t ? (P = [P, M], p = P) : (f = p, p = t);
      } else
        f = p, p = t;
    return p !== t ? (P = h.charAt(f), Me.test(P) ? f++ : (P = t, w === 0 && C(Ht)), P === t && (P = null), p = [p, P], m = p) : (f = m, m = t), m !== t ? c = h.substring(c, f) : c = m, w--, c === t && (m = t, w === 0 && C($t)), c;
  }
  function ys() {
    var c, m, p;
    for (w++, c = f, m = [], p = h.charAt(f), S.test(p) ? f++ : (p = t, w === 0 && C(rt)); p !== t; )
      m.push(p), m.length >= 2 ? p = t : (p = h.charAt(f), S.test(p) ? f++ : (p = t, w === 0 && C(rt)));
    return m.length < 1 ? (f = c, c = t) : c = m, w--, c === t && (m = t, w === 0 && C(Dt)), c;
  }
  function dt() {
    var c, m, p, P, M;
    if (w++, c = f, W(), h.charCodeAt(f) === 36 ? (m = _, f++) : (m = t, w === 0 && C(Kt)), m !== t) {
      if (p = f, P = [], M = h.charAt(f), re.test(M) ? f++ : (M = t, w === 0 && C(Ee)), M !== t)
        for (; M !== t; )
          P.push(M), M = h.charAt(f), re.test(M) ? f++ : (M = t, w === 0 && C(Ee));
      else
        P = t;
      P !== t ? p = h.substring(p, f) : p = P, p !== t ? c = hs(p) : (f = c, c = t);
    } else
      f = c, c = t;
    return w--, c === t && w === 0 && C(zt), c;
  }
  function Le() {
    var c;
    return c = As(), c === t && (c = Cs()), c;
  }
  function As() {
    var c, m, p, P, M;
    if (w++, c = f, h.charCodeAt(f) === 123 ? (m = b, f++) : (m = t, w === 0 && C(Bt)), m !== t) {
      for (p = f, P = [], M = h.charAt(f), y.test(M) ? f++ : (M = t, w === 0 && C(nt)); M !== t; )
        P.push(M), M = h.charAt(f), y.test(M) ? f++ : (M = t, w === 0 && C(nt));
      p = h.substring(p, f), h.charCodeAt(f) === 125 ? (P = A, f++) : (P = t, w === 0 && C(jt)), P !== t ? c = cs(p) : (f = c, c = t);
    } else
      f = c, c = t;
    return w--, c === t && (m = t, w === 0 && C(Ut)), c;
  }
  function Cs() {
    var c, m, p, P, M;
    if (w++, c = f, h.charCodeAt(f) === 59 ? (m = q, f++) : (m = t, w === 0 && C(Yt)), m !== t) {
      for (p = f, P = [], M = h.charAt(f), E.test(M) ? f++ : (M = t, w === 0 && C(ot)); M !== t; )
        P.push(M), M = h.charAt(f), E.test(M) ? f++ : (M = t, w === 0 && C(ot));
      p = h.substring(p, f), c = us(p);
    } else
      f = c, c = t;
    return w--, c === t && (m = t, w === 0 && C(Wt)), c;
  }
  function mt() {
    var c, m, p, P;
    return w++, c = f, W(), h.charCodeAt(f) === 40 ? (m = $, f++) : (m = t, w === 0 && C(Xt)), m !== t ? (p = ft(), p !== t ? (W(), h.charCodeAt(f) === 41 ? (P = R, f++) : (P = t, w === 0 && C(Qt)), P !== t ? c = fs(p) : (f = c, c = t)) : (f = c, c = t)) : (f = c, c = t), w--, c === t && w === 0 && C(Gt), c;
  }
  function Ps() {
    var c, m, p;
    return w++, c = f, h.substr(f, 3) === O ? (m = O, f += 3) : (m = t, w === 0 && C(Jt)), m === t && (h.substr(f, 3) === H ? (m = H, f += 3) : (m = t, w === 0 && C(Zt)), m === t && (h.substr(f, 7) === Q ? (m = Q, f += 7) : (m = t, w === 0 && C(es)), m === t && (h.charCodeAt(f) === 42 ? (m = ie, f++) : (m = t, w === 0 && C(ts))))), m !== t ? (W(), p = Le(), p === t && (p = null), c = gs(m, p)) : (f = c, c = t), w--, c === t && (m = t, w === 0 && C(Vt)), c;
  }
  function W() {
    var c, m;
    for (w++, c = [], m = h.charAt(f), N.test(m) ? f++ : (m = t, w === 0 && C(at)); m !== t; )
      c.push(m), m = h.charAt(f), N.test(m) ? f++ : (m = t, w === 0 && C(at));
    return w--, m = t, w === 0 && C(ss), c;
  }
  if (we = r(), e.peg$library)
    return (
      /** @type {any} */
      {
        peg$result: we,
        peg$currPos: f,
        peg$FAILED: t,
        peg$maxFailExpected: Te,
        peg$maxFailPos: ee
      }
    );
  if (we !== t && f === h.length)
    return we;
  throw we !== t && f < h.length && C(ds()), ms(
    Te,
    ee < h.length ? h.charAt(ee) : null,
    ee < h.length ? ht(ee, ee + 1) : ht(ee, ee)
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
const Ie = 0xffffffffffffffffn;
function De(h, e) {
  return (h << e | h >> 64n - e) & 0xffffffffffffffffn;
}
function wt(h, e) {
  return h * e & Ie;
}
function Hs(h) {
  return function() {
    let e = BigInt(h & Ie), t = BigInt(h >> 64n & Ie);
    const i = wt(De(wt(e, 5n), 7n), 9n);
    return t ^= e, e = (De(e, 24n) ^ t ^ t << 16n) & Ie, t = De(t, 37n), h = t << 64n | e, i;
  };
}
const Re = Hs(0xa187eb39cdcaed8f31c4b365b102e01en), Ds = Array.from({ length: 2 }, () => Array.from({ length: 6 }, () => Array.from({ length: 128 }, () => Re()))), zs = Array.from({ length: 8 }, () => Re()), Ks = Array.from({ length: 16 }, () => Re()), ze = Re(), B = "w", X = "b", x = "p", Xe = "n", Oe = "b", Ae = "r", ae = "q", D = "k", Ke = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
class qe {
  constructor(e, t) {
    F(this, "color");
    F(this, "from");
    F(this, "to");
    F(this, "piece");
    F(this, "captured");
    F(this, "promotion");
    /**
     * @deprecated This field is deprecated and will be removed in version 2.0.0.
     * Please use move descriptor functions instead: `isCapture`, `isPromotion`,
     * `isEnPassant`, `isKingsideCastle`, `isQueensideCastle`, `isCastle`, and
     * `isBigPawn`
     */
    F(this, "flags");
    F(this, "san");
    F(this, "lan");
    F(this, "before");
    F(this, "after");
    const { color: i, piece: s, from: r, to: o, flags: n, captured: a, promotion: l } = t, g = K(r), d = K(o);
    this.color = i, this.piece = s, this.from = g, this.to = d, this.san = e._moveToSan(t, e._moves({ legal: !0 })), this.lan = g + d, this.before = e.fen(), e._makeMove(t), this.after = e.fen(), e._undoMove(), this.flags = "";
    for (const u in k)
      k[u] & n && (this.flags += he[u]);
    a && (this.captured = a), l && (this.promotion = l, this.lan += l);
  }
  isCapture() {
    return this.flags.indexOf(he.CAPTURE) > -1;
  }
  isPromotion() {
    return this.flags.indexOf(he.PROMOTION) > -1;
  }
  isEnPassant() {
    return this.flags.indexOf(he.EP_CAPTURE) > -1;
  }
  isKingsideCastle() {
    return this.flags.indexOf(he.KSIDE_CASTLE) > -1;
  }
  isQueensideCastle() {
    return this.flags.indexOf(he.QSIDE_CASTLE) > -1;
  }
  isBigPawn() {
    return this.flags.indexOf(he.BIG_PAWN) > -1;
  }
}
const U = -1, he = {
  NORMAL: "n",
  CAPTURE: "c",
  BIG_PAWN: "b",
  EP_CAPTURE: "e",
  PROMOTION: "p",
  KSIDE_CASTLE: "k",
  QSIDE_CASTLE: "q",
  NULL_MOVE: "-"
}, bt = [
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
], k = {
  NORMAL: 1,
  CAPTURE: 2,
  BIG_PAWN: 4,
  EP_CAPTURE: 8,
  PROMOTION: 16,
  KSIDE_CASTLE: 32,
  QSIDE_CASTLE: 64,
  NULL_MOVE: 128
}, Qe = {
  Event: "?",
  Site: "?",
  Date: "????.??.??",
  Round: "?",
  White: "?",
  Black: "?",
  Result: "*"
}, Us = {
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
}, Bs = {
  ...Qe,
  ...Us
}, T = {
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
}, Ue = {
  b: [16, 32, 17, 15],
  w: [-16, -32, -17, -15]
}, St = {
  n: [-18, -33, -31, -14, 18, 33, 31, 14],
  b: [-17, -15, 17, 15],
  r: [-16, 1, 16, -1],
  q: [-17, -16, -15, 1, 17, 16, 15, -1],
  k: [-17, -16, -15, 1, 17, 16, 15, -1]
}, js = [
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
], Ws = [
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
], Ys = { p: 1, n: 2, b: 4, r: 8, q: 16, k: 32 }, Gs = "pnbrqkPNBRQK", yt = [Xe, Oe, Ae, ae], Xs = 7, Qs = 6, Vs = 1, Js = 0, Ne = {
  [D]: k.KSIDE_CASTLE,
  [ae]: k.QSIDE_CASTLE
}, ne = {
  w: [
    { square: T.a1, flag: k.QSIDE_CASTLE },
    { square: T.h1, flag: k.KSIDE_CASTLE }
  ],
  b: [
    { square: T.a8, flag: k.QSIDE_CASTLE },
    { square: T.h8, flag: k.KSIDE_CASTLE }
  ]
}, Zs = { b: Vs, w: Qs }, Be = "--";
function ce(h) {
  return h >> 4;
}
function Ce(h) {
  return h & 15;
}
function qt(h) {
  return "0123456789".indexOf(h) !== -1;
}
function K(h) {
  const e = Ce(h), t = ce(h);
  return "abcdefgh".substring(e, e + 1) + "87654321".substring(t, t + 1);
}
function ye(h) {
  return h === B ? X : B;
}
function ei(h) {
  const e = h.split(/\s+/);
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
  const i = parseInt(e[4], 10);
  if (isNaN(i) || i < 0)
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
  const s = e[0].split("/");
  if (s.length !== 8)
    return {
      ok: !1,
      error: "Invalid FEN: piece data does not contain 8 '/'-delimited rows"
    };
  for (let o = 0; o < s.length; o++) {
    let n = 0, a = !1;
    for (let l = 0; l < s[o].length; l++)
      if (qt(s[o][l])) {
        if (a)
          return {
            ok: !1,
            error: "Invalid FEN: piece data is invalid (consecutive number)"
          };
        n += parseInt(s[o][l], 10), a = !0;
      } else {
        if (!/^[prnbqkPRNBQK]$/.test(s[o][l]))
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
  return Array.from(s[0] + s[7]).some((o) => o.toUpperCase() === "P") ? {
    ok: !1,
    error: "Invalid FEN: some pawns are on the edge rows"
  } : { ok: !0 };
}
function ti(h, e) {
  const t = h.from, i = h.to, s = h.piece;
  let r = 0, o = 0, n = 0;
  for (let a = 0, l = e.length; a < l; a++) {
    const g = e[a].from, d = e[a].to, u = e[a].piece;
    s === u && t !== g && i === d && (r++, ce(t) === ce(g) && o++, Ce(t) === Ce(g) && n++);
  }
  return r > 0 ? o > 0 && n > 0 ? K(t) : n > 0 ? K(t).charAt(1) : K(t).charAt(0) : "";
}
function oe(h, e, t, i, s, r = void 0, o = k.NORMAL) {
  const n = ce(i);
  if (s === x && (n === Xs || n === Js))
    for (let a = 0; a < yt.length; a++) {
      const l = yt[a];
      h.push({
        color: e,
        from: t,
        to: i,
        piece: s,
        captured: r,
        promotion: l,
        flags: o | k.PROMOTION
      });
    }
  else
    h.push({
      color: e,
      from: t,
      to: i,
      piece: s,
      captured: r,
      flags: o
    });
}
function At(h) {
  let e = h.charAt(0);
  return e >= "a" && e <= "h" ? h.match(/[a-h]\d.*[a-h]\d/) ? void 0 : x : (e = e.toLowerCase(), e === "o" ? D : e);
}
function je(h) {
  return h.replace(/=/, "").replace(/[+#]?[?!]*$/, "");
}
class We {
  constructor(e = Ke, { skipValidation: t = !1 } = {}) {
    F(this, "_board", new Array(128));
    F(this, "_turn", B);
    F(this, "_header", {});
    F(this, "_kings", { w: U, b: U });
    F(this, "_epSquare", -1);
    F(this, "_halfMoves", 0);
    F(this, "_moveNumber", 0);
    F(this, "_history", []);
    F(this, "_comments", {});
    F(this, "_castling", { w: 0, b: 0 });
    F(this, "_hash", 0n);
    // tracks number of times a position has been seen for repetition checking
    F(this, "_positionCount", /* @__PURE__ */ new Map());
    this.load(e, { skipValidation: t });
  }
  clear({ preserveHeaders: e = !1 } = {}) {
    this._board = new Array(128), this._kings = { w: U, b: U }, this._turn = B, this._castling = { w: 0, b: 0 }, this._epSquare = U, this._halfMoves = 0, this._moveNumber = 1, this._history = [], this._comments = {}, this._header = e ? this._header : { ...Bs }, this._hash = this._computeHash(), this._positionCount = /* @__PURE__ */ new Map(), this._header.SetUp = null, this._header.FEN = null;
  }
  load(e, { skipValidation: t = !1, preserveHeaders: i = !1 } = {}) {
    let s = e.split(/\s+/);
    if (s.length >= 2 && s.length < 6) {
      const n = ["-", "-", "0", "1"];
      e = s.concat(n.slice(-(6 - s.length))).join(" ");
    }
    if (s = e.split(/\s+/), !t) {
      const { ok: n, error: a } = ei(e);
      if (!n)
        throw new Error(a);
    }
    const r = s[0];
    let o = 0;
    this.clear({ preserveHeaders: i });
    for (let n = 0; n < r.length; n++) {
      const a = r.charAt(n);
      if (a === "/")
        o += 8;
      else if (qt(a))
        o += parseInt(a, 10);
      else {
        const l = a < "a" ? B : X;
        this._put({ type: a.toLowerCase(), color: l }, K(o)), o++;
      }
    }
    this._turn = s[1], s[2].indexOf("K") > -1 && (this._castling.w |= k.KSIDE_CASTLE), s[2].indexOf("Q") > -1 && (this._castling.w |= k.QSIDE_CASTLE), s[2].indexOf("k") > -1 && (this._castling.b |= k.KSIDE_CASTLE), s[2].indexOf("q") > -1 && (this._castling.b |= k.QSIDE_CASTLE), this._epSquare = s[3] === "-" ? U : T[s[3]], this._halfMoves = parseInt(s[4], 10), this._moveNumber = parseInt(s[5], 10), this._hash = this._computeHash(), this._updateSetup(e), this._incPositionCount();
  }
  fen({ forceEnpassantSquare: e = !1 } = {}) {
    var o, n;
    let t = 0, i = "";
    for (let a = T.a8; a <= T.h1; a++) {
      if (this._board[a]) {
        t > 0 && (i += t, t = 0);
        const { color: l, type: g } = this._board[a];
        i += l === B ? g.toUpperCase() : g.toLowerCase();
      } else
        t++;
      a + 1 & 136 && (t > 0 && (i += t), a !== T.h1 && (i += "/"), t = 0, a += 8);
    }
    let s = "";
    this._castling[B] & k.KSIDE_CASTLE && (s += "K"), this._castling[B] & k.QSIDE_CASTLE && (s += "Q"), this._castling[X] & k.KSIDE_CASTLE && (s += "k"), this._castling[X] & k.QSIDE_CASTLE && (s += "q"), s = s || "-";
    let r = "-";
    if (this._epSquare !== U)
      if (e)
        r = K(this._epSquare);
      else {
        const a = this._epSquare + (this._turn === B ? 16 : -16), l = [a + 1, a - 1];
        for (const g of l) {
          if (g & 136)
            continue;
          const d = this._turn;
          if (((o = this._board[g]) == null ? void 0 : o.color) === d && ((n = this._board[g]) == null ? void 0 : n.type) === x) {
            this._makeMove({
              color: d,
              from: g,
              to: this._epSquare,
              piece: x,
              captured: x,
              flags: k.EP_CAPTURE
            });
            const u = !this._isKingAttacked(d);
            if (this._undoMove(), u) {
              r = K(this._epSquare);
              break;
            }
          }
        }
      }
    return [
      i,
      this._turn,
      s,
      r,
      this._halfMoves,
      this._moveNumber
    ].join(" ");
  }
  _pieceKey(e) {
    if (!this._board[e])
      return 0n;
    const { color: t, type: i } = this._board[e], s = {
      w: 0,
      b: 1
    }[t], r = {
      p: 0,
      n: 1,
      b: 2,
      r: 3,
      q: 4,
      k: 5
    }[i];
    return Ds[s][r][e];
  }
  _epKey() {
    return this._epSquare === U ? 0n : zs[this._epSquare & 7];
  }
  _castlingKey() {
    const e = this._castling.w >> 5 | this._castling.b >> 3;
    return Ks[e];
  }
  _computeHash() {
    let e = 0n;
    for (let t = T.a8; t <= T.h1; t++) {
      if (t & 136) {
        t += 7;
        continue;
      }
      this._board[t] && (e ^= this._pieceKey(t));
    }
    return e ^= this._epKey(), e ^= this._castlingKey(), this._turn === "b" && (e ^= ze), e;
  }
  /*
   * Called when the initial board setup is changed with put() or remove().
   * modifies the SetUp and FEN properties of the header object. If the FEN
   * is equal to the default position, the SetUp and FEN are deleted the setup
   * is only updated if history.length is zero, ie moves haven't been made.
   */
  _updateSetup(e) {
    this._history.length > 0 || (e !== Ke ? (this._header.SetUp = "1", this._header.FEN = e) : (this._header.SetUp = null, this._header.FEN = null));
  }
  reset() {
    this.load(Ke);
  }
  get(e) {
    return this._board[T[e]];
  }
  findPiece(e) {
    var i;
    const t = [];
    for (let s = T.a8; s <= T.h1; s++) {
      if (s & 136) {
        s += 7;
        continue;
      }
      !this._board[s] || ((i = this._board[s]) == null ? void 0 : i.color) !== e.color || this._board[s].color === e.color && this._board[s].type === e.type && t.push(K(s));
    }
    return t;
  }
  put({ type: e, color: t }, i) {
    return this._put({ type: e, color: t }, i) ? (this._updateCastlingRights(), this._updateEnPassantSquare(), this._updateSetup(this.fen()), !0) : !1;
  }
  _set(e, t) {
    this._hash ^= this._pieceKey(e), this._board[e] = t, this._hash ^= this._pieceKey(e);
  }
  _put({ type: e, color: t }, i) {
    if (Gs.indexOf(e.toLowerCase()) === -1 || !(i in T))
      return !1;
    const s = T[i];
    if (e == D && !(this._kings[t] == U || this._kings[t] == s))
      return !1;
    const r = this._board[s];
    return r && r.type === D && (this._kings[r.color] = U), this._set(s, { type: e, color: t }), e === D && (this._kings[t] = s), !0;
  }
  _clear(e) {
    this._hash ^= this._pieceKey(e), delete this._board[e];
  }
  remove(e) {
    const t = this.get(e);
    return this._clear(T[e]), t && t.type === D && (this._kings[t.color] = U), this._updateCastlingRights(), this._updateEnPassantSquare(), this._updateSetup(this.fen()), t;
  }
  _updateCastlingRights() {
    var i, s, r, o, n, a, l, g, d, u, v, _;
    this._hash ^= this._castlingKey();
    const e = ((i = this._board[T.e1]) == null ? void 0 : i.type) === D && ((s = this._board[T.e1]) == null ? void 0 : s.color) === B, t = ((r = this._board[T.e8]) == null ? void 0 : r.type) === D && ((o = this._board[T.e8]) == null ? void 0 : o.color) === X;
    (!e || ((n = this._board[T.a1]) == null ? void 0 : n.type) !== Ae || ((a = this._board[T.a1]) == null ? void 0 : a.color) !== B) && (this._castling.w &= -65), (!e || ((l = this._board[T.h1]) == null ? void 0 : l.type) !== Ae || ((g = this._board[T.h1]) == null ? void 0 : g.color) !== B) && (this._castling.w &= -33), (!t || ((d = this._board[T.a8]) == null ? void 0 : d.type) !== Ae || ((u = this._board[T.a8]) == null ? void 0 : u.color) !== X) && (this._castling.b &= -65), (!t || ((v = this._board[T.h8]) == null ? void 0 : v.type) !== Ae || ((_ = this._board[T.h8]) == null ? void 0 : _.color) !== X) && (this._castling.b &= -33), this._hash ^= this._castlingKey();
  }
  _updateEnPassantSquare() {
    var r, o;
    if (this._epSquare === U)
      return;
    const e = this._epSquare + (this._turn === B ? -16 : 16), t = this._epSquare + (this._turn === B ? 16 : -16), i = [t + 1, t - 1];
    if (this._board[e] !== null || this._board[this._epSquare] !== null || ((r = this._board[t]) == null ? void 0 : r.color) !== ye(this._turn) || ((o = this._board[t]) == null ? void 0 : o.type) !== x) {
      this._hash ^= this._epKey(), this._epSquare = U;
      return;
    }
    const s = (n) => {
      var a, l;
      return !(n & 136) && ((a = this._board[n]) == null ? void 0 : a.color) === this._turn && ((l = this._board[n]) == null ? void 0 : l.type) === x;
    };
    i.some(s) || (this._hash ^= this._epKey(), this._epSquare = U);
  }
  _attacked(e, t, i) {
    const s = [];
    for (let r = T.a8; r <= T.h1; r++) {
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
      if (js[a] & Ys[o.type]) {
        if (o.type === x) {
          if (n > 0 && o.color === B || n <= 0 && o.color === X)
            if (i)
              s.push(K(r));
            else
              return !0;
          continue;
        }
        if (o.type === "n" || o.type === "k")
          if (i) {
            s.push(K(r));
            continue;
          } else
            return !0;
        const l = Ws[a];
        let g = r + l, d = !1;
        for (; g !== t; ) {
          if (this._board[g] != null) {
            d = !0;
            break;
          }
          g += l;
        }
        if (!d)
          if (i) {
            s.push(K(r));
            continue;
          } else
            return !0;
      }
    }
    return i ? s : !1;
  }
  attackers(e, t) {
    return t ? this._attacked(t, T[e], !0) : this._attacked(this._turn, T[e], !0);
  }
  _isKingAttacked(e) {
    const t = this._kings[e];
    return t === -1 ? !1 : this._attacked(ye(e), t);
  }
  hash() {
    return this._hash.toString(16);
  }
  isAttacked(e, t) {
    return this._attacked(t, T[e]);
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
    let i = 0, s = 0;
    for (let r = T.a8; r <= T.h1; r++) {
      if (s = (s + 1) % 2, r & 136) {
        r += 7;
        continue;
      }
      const o = this._board[r];
      o && (e[o.type] = o.type in e ? e[o.type] + 1 : 1, o.type === Oe && t.push(s), i++);
    }
    if (i === 2)
      return !0;
    if (
      // k vs. kn .... or .... k vs. kb
      i === 3 && (e[Oe] === 1 || e[Xe] === 1)
    )
      return !0;
    if (i === e[Oe] + 2) {
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
  moves({ verbose: e = !1, square: t = void 0, piece: i = void 0 } = {}) {
    const s = this._moves({ square: t, piece: i });
    return e ? s.map((r) => new qe(this, r)) : s.map((r) => this._moveToSan(r, s));
  }
  _moves({ legal: e = !0, piece: t = void 0, square: i = void 0 } = {}) {
    var v;
    const s = i ? i.toLowerCase() : void 0, r = t == null ? void 0 : t.toLowerCase(), o = [], n = this._turn, a = ye(n);
    let l = T.a8, g = T.h1, d = !1;
    if (s)
      if (s in T)
        l = g = T[s], d = !0;
      else
        return [];
    for (let _ = l; _ <= g; _++) {
      if (_ & 136) {
        _ += 7;
        continue;
      }
      if (!this._board[_] || this._board[_].color === a)
        continue;
      const { type: b } = this._board[_];
      let A;
      if (b === x) {
        if (r && r !== b)
          continue;
        A = _ + Ue[n][0], this._board[A] || (oe(o, n, _, A, x), A = _ + Ue[n][1], Zs[n] === ce(_) && !this._board[A] && oe(o, n, _, A, x, void 0, k.BIG_PAWN));
        for (let q = 2; q < 4; q++)
          A = _ + Ue[n][q], !(A & 136) && (((v = this._board[A]) == null ? void 0 : v.color) === a ? oe(o, n, _, A, x, this._board[A].type, k.CAPTURE) : A === this._epSquare && oe(o, n, _, A, x, x, k.EP_CAPTURE));
      } else {
        if (r && r !== b)
          continue;
        for (let q = 0, $ = St[b].length; q < $; q++) {
          const R = St[b][q];
          for (A = _; A += R, !(A & 136); ) {
            if (!this._board[A])
              oe(o, n, _, A, b);
            else {
              if (this._board[A].color === n)
                break;
              oe(o, n, _, A, b, this._board[A].type, k.CAPTURE);
              break;
            }
            if (b === Xe || b === D)
              break;
          }
        }
      }
    }
    if ((r === void 0 || r === D) && (!d || g === this._kings[n])) {
      if (this._castling[n] & k.KSIDE_CASTLE) {
        const _ = this._kings[n], b = _ + 2;
        !this._board[_ + 1] && !this._board[b] && !this._attacked(a, this._kings[n]) && !this._attacked(a, _ + 1) && !this._attacked(a, b) && oe(o, n, this._kings[n], b, D, void 0, k.KSIDE_CASTLE);
      }
      if (this._castling[n] & k.QSIDE_CASTLE) {
        const _ = this._kings[n], b = _ - 2;
        !this._board[_ - 1] && !this._board[_ - 2] && !this._board[_ - 3] && !this._attacked(a, this._kings[n]) && !this._attacked(a, _ - 1) && !this._attacked(a, b) && oe(o, n, this._kings[n], b, D, void 0, k.QSIDE_CASTLE);
      }
    }
    if (!e || this._kings[n] === -1)
      return o;
    const u = [];
    for (let _ = 0, b = o.length; _ < b; _++)
      this._makeMove(o[_]), this._isKingAttacked(n) || u.push(o[_]), this._undoMove();
    return u;
  }
  move(e, { strict: t = !1 } = {}) {
    let i = null;
    if (typeof e == "string")
      i = this._moveFromSan(e, t);
    else if (e === null)
      i = this._moveFromSan(Be, t);
    else if (typeof e == "object") {
      const r = this._moves();
      for (let o = 0, n = r.length; o < n; o++)
        if (e.from === K(r[o].from) && e.to === K(r[o].to) && (!("promotion" in r[o]) || e.promotion === r[o].promotion)) {
          i = r[o];
          break;
        }
    }
    if (!i)
      throw typeof e == "string" ? new Error(`Invalid move: ${e}`) : new Error(`Invalid move: ${JSON.stringify(e)}`);
    if (this.isCheck() && i.flags & k.NULL_MOVE)
      throw new Error("Null move not allowed when in check");
    const s = new qe(this, i);
    return this._makeMove(i), this._incPositionCount(), s;
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
    var s, r, o, n;
    const t = this._turn, i = ye(t);
    if (this._push(e), e.flags & k.NULL_MOVE) {
      t === X && this._moveNumber++, this._halfMoves++, this._turn = i, this._epSquare = U;
      return;
    }
    if (this._hash ^= this._epKey(), this._hash ^= this._castlingKey(), e.captured && (this._hash ^= this._pieceKey(e.to)), this._movePiece(e.from, e.to), e.flags & k.EP_CAPTURE && (this._turn === X ? this._clear(e.to - 16) : this._clear(e.to + 16)), e.promotion && (this._clear(e.to), this._set(e.to, { type: e.promotion, color: t })), this._board[e.to].type === D) {
      if (this._kings[t] = e.to, e.flags & k.KSIDE_CASTLE) {
        const a = e.to - 1, l = e.to + 1;
        this._movePiece(l, a);
      } else if (e.flags & k.QSIDE_CASTLE) {
        const a = e.to + 1, l = e.to - 2;
        this._movePiece(l, a);
      }
      this._castling[t] = 0;
    }
    if (this._castling[t]) {
      for (let a = 0, l = ne[t].length; a < l; a++)
        if (e.from === ne[t][a].square && this._castling[t] & ne[t][a].flag) {
          this._castling[t] ^= ne[t][a].flag;
          break;
        }
    }
    if (this._castling[i]) {
      for (let a = 0, l = ne[i].length; a < l; a++)
        if (e.to === ne[i][a].square && this._castling[i] & ne[i][a].flag) {
          this._castling[i] ^= ne[i][a].flag;
          break;
        }
    }
    if (this._hash ^= this._castlingKey(), e.flags & k.BIG_PAWN) {
      let a;
      t === X ? a = e.to - 16 : a = e.to + 16, !(e.to - 1 & 136) && ((s = this._board[e.to - 1]) == null ? void 0 : s.type) === x && ((r = this._board[e.to - 1]) == null ? void 0 : r.color) === i || !(e.to + 1 & 136) && ((o = this._board[e.to + 1]) == null ? void 0 : o.type) === x && ((n = this._board[e.to + 1]) == null ? void 0 : n.color) === i ? (this._epSquare = a, this._hash ^= this._epKey()) : this._epSquare = U;
    } else
      this._epSquare = U;
    e.piece === x ? this._halfMoves = 0 : e.flags & (k.CAPTURE | k.EP_CAPTURE) ? this._halfMoves = 0 : this._halfMoves++, t === X && this._moveNumber++, this._turn = i, this._hash ^= ze;
  }
  undo() {
    const e = this._hash, t = this._undoMove();
    if (t) {
      const i = new qe(this, t);
      return this._decPositionCount(e), i;
    }
    return null;
  }
  _undoMove() {
    const e = this._history.pop();
    if (e === void 0)
      return null;
    this._hash ^= this._epKey(), this._hash ^= this._castlingKey();
    const t = e.move;
    this._kings = e.kings, this._turn = e.turn, this._castling = e.castling, this._epSquare = e.epSquare, this._halfMoves = e.halfMoves, this._moveNumber = e.moveNumber, this._hash ^= this._epKey(), this._hash ^= this._castlingKey(), this._hash ^= ze;
    const i = this._turn, s = ye(i);
    if (t.flags & k.NULL_MOVE)
      return t;
    if (this._movePiece(t.to, t.from), t.piece && (this._clear(t.from), this._set(t.from, { type: t.piece, color: i })), t.captured)
      if (t.flags & k.EP_CAPTURE) {
        let r;
        i === X ? r = t.to - 16 : r = t.to + 16, this._set(r, { type: x, color: s });
      } else
        this._set(t.to, { type: t.captured, color: s });
    if (t.flags & (k.KSIDE_CASTLE | k.QSIDE_CASTLE)) {
      let r, o;
      t.flags & k.KSIDE_CASTLE ? (r = t.to + 1, o = t.to - 1) : (r = t.to - 2, o = t.to + 1), this._movePiece(o, r);
    }
    return t;
  }
  pgn({ newline: e = `
`, maxWidth: t = 0 } = {}) {
    const i = [];
    let s = !1;
    for (const u in this._header)
      this._header[u] && i.push(`[${u} "${this._header[u]}"]` + e), s = !0;
    s && this._history.length && i.push(e);
    const r = (u) => {
      const v = this._comments[this.fen()];
      if (typeof v < "u") {
        const _ = u.length > 0 ? " " : "";
        u = `${u}${_}{${v}}`;
      }
      return u;
    }, o = [];
    for (; this._history.length > 0; )
      o.push(this._undoMove());
    const n = [];
    let a = "";
    for (o.length === 0 && n.push(r("")); o.length > 0; ) {
      a = r(a);
      const u = o.pop();
      if (!u)
        break;
      if (!this._history.length && u.color === "b") {
        const v = `${this._moveNumber}. ...`;
        a = a ? `${a} ${v}` : v;
      } else u.color === "w" && (a.length && n.push(a), a = this._moveNumber + ".");
      a = a + " " + this._moveToSan(u, this._moves({ legal: !0 })), this._makeMove(u);
    }
    if (a.length && n.push(r(a)), n.push(this._header.Result || "*"), t === 0)
      return i.join("") + n.join(" ");
    const l = function() {
      return i.length > 0 && i[i.length - 1] === " " ? (i.pop(), !0) : !1;
    }, g = function(u, v) {
      for (const _ of v.split(" "))
        if (_) {
          if (u + _.length > t) {
            for (; l(); )
              u--;
            i.push(e), u = 0;
          }
          i.push(_), u += _.length, i.push(" "), u++;
        }
      return l() && u--, u;
    };
    let d = 0;
    for (let u = 0; u < n.length; u++) {
      if (d + n[u].length > t && n[u].includes("{")) {
        d = g(d, n[u]);
        continue;
      }
      d + n[u].length > t && u !== 0 ? (i[i.length - 1] === " " && i.pop(), i.push(e), d = 0) : u !== 0 && (i.push(" "), d++), i.push(n[u]), d += n[u].length;
    }
    return i.join("");
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
    return this._header[e] = t ?? Qe[e] ?? null, this.getHeaders();
  }
  removeHeader(e) {
    return e in this._header ? (this._header[e] = Qe[e] || null, !0) : !1;
  }
  // return only non-null headers (omit placemarker nulls)
  getHeaders() {
    const e = {};
    for (const [t, i] of Object.entries(this._header))
      i !== null && (e[t] = i);
    return e;
  }
  loadPgn(e, { strict: t = !1, newlineChar: i = `\r?
` } = {}) {
    i !== `\r?
` && (e = e.replace(new RegExp(i, "g"), `
`));
    const s = xs(e);
    this.reset();
    const r = s.headers;
    let o = "";
    for (const l in r)
      l.toLowerCase() === "fen" && (o = r[l]), this.header(l, r[l]);
    if (!t)
      o && this.load(o, { preserveHeaders: !0 });
    else if (r.SetUp === "1") {
      if (!("FEN" in r))
        throw new Error("Invalid PGN: FEN tag must be supplied with SetUp tag");
      this.load(r.FEN, { preserveHeaders: !0 });
    }
    let n = s.root;
    for (; n; ) {
      if (n.move) {
        const l = this._moveFromSan(n.move, t);
        if (l == null)
          throw new Error(`Invalid move in PGN: ${n.move}`);
        this._makeMove(l), this._incPositionCount();
      }
      n.comment !== void 0 && (this._comments[this.fen()] = n.comment), n = n.variations[0];
    }
    const a = s.result;
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
    let i = "";
    if (e.flags & k.KSIDE_CASTLE)
      i = "O-O";
    else if (e.flags & k.QSIDE_CASTLE)
      i = "O-O-O";
    else {
      if (e.flags & k.NULL_MOVE)
        return Be;
      if (e.piece !== x) {
        const s = ti(e, t);
        i += e.piece.toUpperCase() + s;
      }
      e.flags & (k.CAPTURE | k.EP_CAPTURE) && (e.piece === x && (i += K(e.from)[0]), i += "x"), i += K(e.to), e.promotion && (i += "=" + e.promotion.toUpperCase());
    }
    return this._makeMove(e), this.isCheck() && (this.isCheckmate() ? i += "#" : i += "+"), this._undoMove(), i;
  }
  // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
  _moveFromSan(e, t = !1) {
    let i = je(e);
    if (t || (i === "0-0" ? i = "O-O" : i === "0-0-0" && (i = "O-O-O")), i == Be)
      return {
        color: this._turn,
        from: 0,
        to: 0,
        piece: "k",
        flags: k.NULL_MOVE
      };
    let s = At(i), r = this._moves({ legal: !0, piece: s });
    for (let u = 0, v = r.length; u < v; u++)
      if (i === je(this._moveToSan(r[u], r)))
        return r[u];
    if (t)
      return null;
    let o, n, a, l, g, d = !1;
    if (n = i.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/), n ? (o = n[1], a = n[2], l = n[3], g = n[4], a.length == 1 && (d = !0)) : (n = i.match(/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/), n && (o = n[1], a = n[2], l = n[3], g = n[4], a.length == 1 && (d = !0))), s = At(i), r = this._moves({
      legal: !0,
      piece: o || s
    }), !l)
      return null;
    for (let u = 0, v = r.length; u < v; u++)
      if (a) {
        if ((!o || o.toLowerCase() == r[u].piece) && T[a] == r[u].from && T[l] == r[u].to && (!g || g.toLowerCase() == r[u].promotion))
          return r[u];
        if (d) {
          const _ = K(r[u].from);
          if ((!o || o.toLowerCase() == r[u].piece) && T[l] == r[u].to && (a == _[0] || a == _[1]) && (!g || g.toLowerCase() == r[u].promotion))
            return r[u];
        }
      } else if (i === je(this._moveToSan(r[u], r)).replace("x", ""))
        return r[u];
    return null;
  }
  ascii() {
    let e = `   +------------------------+
`;
    for (let t = T.a8; t <= T.h1; t++) {
      if (Ce(t) === 0 && (e += " " + "87654321"[ce(t)] + " |"), this._board[t]) {
        const i = this._board[t].type, r = this._board[t].color === B ? i.toUpperCase() : i.toLowerCase();
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
    let i = 0;
    const s = this._turn;
    for (let r = 0, o = t.length; r < o; r++)
      this._makeMove(t[r]), this._isKingAttacked(s) || (e - 1 > 0 ? i += this.perft(e - 1) : i++), this._undoMove();
    return i;
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
    for (let i = T.a8; i <= T.h1; i++)
      this._board[i] == null ? t.push(null) : t.push({
        square: K(i),
        type: this._board[i].type,
        color: this._board[i].color
      }), i + 1 & 136 && (e.push(t), t = [], i += 8);
    return e;
  }
  squareColor(e) {
    if (e in T) {
      const t = T[e];
      return (ce(t) + Ce(t)) % 2 === 0 ? "light" : "dark";
    }
    return null;
  }
  history({ verbose: e = !1 } = {}) {
    const t = [], i = [];
    for (; this._history.length > 0; )
      t.push(this._undoMove());
    for (; ; ) {
      const s = t.pop();
      if (!s)
        break;
      e ? i.push(new qe(this, s)) : i.push(this._moveToSan(s, this._moves())), this._makeMove(s);
    }
    return i;
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
    const e = [], t = {}, i = (s) => {
      s in this._comments && (t[s] = this._comments[s]);
    };
    for (; this._history.length > 0; )
      e.push(this._undoMove());
    for (i(this.fen()); ; ) {
      const s = e.pop();
      if (!s)
        break;
      this._makeMove(s), i(this.fen());
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
    for (const s of [D, ae])
      t[s] !== void 0 && (t[s] ? this._castling[e] |= Ne[s] : this._castling[e] &= ~Ne[s]);
    this._updateCastlingRights();
    const i = this.getCastlingRights(e);
    return (t[D] === void 0 || t[D] === i[D]) && (t[ae] === void 0 || t[ae] === i[ae]);
  }
  getCastlingRights(e) {
    return {
      [D]: (this._castling[e] & Ne[D]) !== 0,
      [ae]: (this._castling[e] & Ne[ae]) !== 0
    };
  }
  moveNumber() {
    return this._moveNumber;
  }
}
const si = /%cal\s+([^%\s]+)/g, ii = /%csl\s+([^%\s]+)/g, Ct = /%(?:cal|csl)\s+[^%\s]+/, ri = /^[a-h][1-8]$/, Ye = {
  R: "#ff0000",
  // Red
  G: "#00ff00",
  // Green
  Y: "#ffff00",
  // Yellow
  B: "#0000ff"
  // Blue
};
class Z {
  /**
   * Check if a comment contains visual annotations
   */
  static hasVisualAnnotations(e) {
    return Ct.test(e);
  }
  /**
   * Parse visual annotations from a PGN comment
   */
  static parseComment(e) {
    let t = e.startsWith("{") && e.endsWith("}") ? e.substring(1, e.length - 1) : e;
    const i = [], s = [], r = [...t.matchAll(si)];
    for (const a of r) {
      const l = a[1].split(",");
      for (const g of l) {
        const d = g.trim();
        if (d.length >= 5) {
          const u = d[0], v = d.slice(1, 3), _ = d.slice(3, 5);
          Z.isValidSquare(v) && Z.isValidSquare(_) && i.push({
            from: v,
            to: _,
            color: Z.colorToHex(u)
          });
        }
      }
      t = t.replace(a[0], " ");
    }
    const o = [...t.matchAll(ii)];
    for (const a of o) {
      const l = a[1].split(",");
      for (const g of l) {
        const d = g.trim();
        if (d.length >= 3) {
          const u = d[0], v = d.slice(1, 3);
          Z.isValidSquare(v) && s.push({
            square: v,
            type: "circle",
            // Cast to avoid type issues
            color: Z.colorToHex(u)
          });
        }
      }
      t = t.replace(a[0], " ");
    }
    let n = t.replace(/\s+/g, " ").trim();
    return {
      arrows: i,
      highlights: s,
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
    return e.replace(new RegExp(Ct.source, "g"), "").replace(/\s+/g, " ").trim();
  }
  /**
   * Create annotation string from arrows and circles
   */
  static fromDrawingObjects(e, t) {
    const i = [];
    if (e.length > 0) {
      const s = e.map((r) => `${Z.hexToColor(r.color)}${r.from}${r.to}`).join(",");
      i.push(`%cal ${s}`);
    }
    if (t.length > 0) {
      const s = t.map((r) => `${Z.hexToColor(r.color)}${r.square}`).join(",");
      i.push(`%csl ${s}`);
    }
    return i.join(" ");
  }
  /**
   * Convert color code to hex color
   */
  static colorToHex(e) {
    return Ye[e] || Ye.R;
  }
  /**
   * Convert hex color to color code
   */
  static hexToColor(e) {
    for (const [t, i] of Object.entries(Ye))
      if (i === e)
        return t;
    return "R";
  }
  /**
   * Check if a string is a valid chess square notation
   */
  static isValidSquare(e) {
    return ri.test(e);
  }
}
class et {
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
  addMove(e, t, i, s, r) {
    const o = this.moves.findIndex((n) => n.moveNumber === e);
    if (o >= 0) {
      const n = this.moves[o];
      t && (n.white = t), i && (n.black = i), s && (n.whiteComment = s), r && (n.blackComment = r), n.whiteAnnotations || (n.whiteAnnotations = { arrows: [], circles: [], textComment: "" }), n.blackAnnotations || (n.blackAnnotations = { arrows: [], circles: [], textComment: "" });
    } else
      this.moves.push({
        moveNumber: e,
        white: t,
        black: i,
        whiteComment: s,
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
        for (let i = 0; i < t.length; i++) {
          const s = t[i], r = Math.floor(i / 2) + 1;
          if (i % 2 === 0)
            this.addMove(r, s.san);
          else {
            const n = this.moves.find((a) => a.moveNumber === r);
            n ? n.black = s.san : this.addMove(r, void 0, s.san);
          }
        }
      }
    } catch (t) {
      console.warn("Failed to import proper PGN notation, using fallback:", t);
      const i = e.history();
      this.moves = [];
      for (let s = 0; s < i.length; s += 2) {
        const r = Math.floor(s / 2) + 1, o = i[s], n = i[s + 1];
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
    const i = /\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, s = t.match(i);
    s && (this.setResult(s[1]), t = t.replace(i, ""));
    const r = /(\d+)\.\s*([^\s]+)(?:\s+([^\s]+))?/g;
    let o;
    for (; (o = r.exec(t)) !== null; ) {
      const n = parseInt(o[1]), a = o[2], l = o[3];
      if (a && !["1-0", "0-1", "1/2-1/2", "*"].includes(a)) {
        const g = l && !["1-0", "0-1", "1/2-1/2", "*"].includes(l) ? l : void 0;
        this.addMove(n, a, g);
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
    let i = 0;
    const s = 80;
    for (const r of this.moves) {
      let o = `${r.moveNumber}.`;
      r.white && (o += ` ${r.white}`, r.whiteComment && (o += ` {${r.whiteComment}}`)), r.black && (o += ` ${r.black}`, r.blackComment && (o += ` {${r.blackComment}}`)), i + o.length + 1 > s && (t += `
`, i = 0), i > 0 && (t += " ", i++), t += o, i += o.length;
    }
    return this.result !== "*" && (i > 0 && this.moves.length > 0 && (t += " "), t += this.result), t.trim();
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
    const i = new et();
    i.setMetadata(t || {});
    for (let s = 0; s < e.length; s += 2) {
      const r = Math.floor(s / 2) + 1, o = e[s], n = e[s + 1];
      i.addMove(r, o, n);
    }
    return i.toPgn();
  }
  /**
   * Download PGN as file (browser only)
   */
  downloadPgn(e = "game.pgn") {
    if (typeof window < "u" && window.document) {
      const t = new Blob([this.toPgnWithAnnotations()], { type: "application/x-chess-pgn" }), i = URL.createObjectURL(t), s = document.createElement("a");
      s.href = i, s.download = e, document.body.appendChild(s), s.click(), document.body.removeChild(s), URL.revokeObjectURL(i);
    }
  }
  /**
   * Add visual annotations to a move
   */
  addMoveAnnotations(e, t, i) {
    const s = this.moves.findIndex((r) => r.moveNumber === e);
    s >= 0 && (t ? this.moves[s].whiteAnnotations = i : this.moves[s].blackAnnotations = i);
  }
  /**
   * Parse a PGN string with comments containing visual annotations
   */
  loadPgnWithAnnotations(e) {
    const t = e.split(`
`);
    let i = !1, s = "";
    for (const r of t)
      if (r.startsWith("[")) {
        const o = r.match(/\[(\w+)\s+\"([^\"]*)\"\]/);
        o && (this.metadata[o[1]] = o[2]);
      } else r.trim() && !r.startsWith("[") && (i = !0, s += r + " ");
    i && this.parseMovesWithAnnotations(s);
  }
  /**
   * Parse moves string with embedded annotations
   */
  parseMovesWithAnnotations(e) {
    this.moves = [];
    const t = /(\d+)\.\s*([^\s{]+)(?:\s*(\{[^}]+\}))?(?:\s+([^\s{]+)(?:\s*(\{[^}]+\}))?)?/g;
    let i;
    for (; (i = t.exec(e)) !== null; ) {
      const s = parseInt(i[1]), r = i[2], o = i[3], n = i[4], a = i[5], l = {
        moveNumber: s,
        white: r,
        black: n,
        whiteAnnotations: { arrows: [], circles: [], textComment: "" },
        // Initialize
        blackAnnotations: { arrows: [], circles: [], textComment: "" }
        // Initialize
      };
      if (o) {
        const g = Z.parseComment(o);
        l.whiteComment = o, l.whiteAnnotations = {
          arrows: g.arrows,
          circles: g.highlights,
          textComment: g.textComment
        };
      }
      if (n && a) {
        const g = Z.parseComment(a);
        l.blackComment = a, l.blackAnnotations = {
          arrows: g.arrows,
          circles: g.highlights,
          textComment: g.textComment
        };
      }
      this.moves.push(l);
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
    let i = 0;
    const s = 80;
    for (const r of this.moves) {
      let o = `${r.moveNumber}.`;
      if (r.white) {
        o += ` ${r.white}`;
        let n = "";
        if (r.whiteAnnotations) {
          const a = Z.fromDrawingObjects(
            r.whiteAnnotations.arrows || [],
            r.whiteAnnotations.circles || []
          ), l = r.whiteAnnotations.textComment || "";
          n = [a, l].filter(Boolean).join(" ").trim();
        } else r.whiteComment && (n = r.whiteComment);
        n && (o += ` {${n}}`);
      }
      if (r.black) {
        o += ` ${r.black}`;
        let n = "";
        if (r.blackAnnotations) {
          const a = Z.fromDrawingObjects(
            r.blackAnnotations.arrows || [],
            r.blackAnnotations.circles || []
          ), l = r.blackAnnotations.textComment || "";
          n = [a, l].filter(Boolean).join(" ").trim();
        } else r.blackComment && (n = r.blackComment);
        n && (o += ` {${n}}`);
      }
      i + o.length + 1 > s && (e += `
`, i = 0), i > 0 && (e += " ", i++), e += o, i += o.length;
    }
    return this.result !== "*" && (i > 0 && (e += " "), e += this.result), e.trim();
  }
  /**
   * Get annotations for a specific move
   */
  getMoveAnnotations(e, t) {
    const i = this.moves.find((s) => s.moveNumber === e);
    if (i)
      return t ? i.whiteAnnotations : i.blackAnnotations;
  }
  /**
   * Get all moves with their annotations
   */
  getMovesWithAnnotations() {
    return [...this.moves];
  }
}
class Fe {
  getFenParts(e) {
    const i = (e ?? this.chess.fen()).trim().split(/\s+/);
    return i.length < 6 ? i.concat(new Array(6 - i.length).fill("")) : i;
  }
  getChessInstance() {
    return this.chess;
  }
  constructor(e) {
    this.chess = new We(e), this.pgnNotation = new et();
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
    return this.chess.moves({ square: e, verbose: !0 }).map((i) => ({
      from: i.from,
      to: i.to,
      promotion: i.promotion === "k" ? void 0 : i.promotion,
      piece: i.piece,
      captured: i.captured,
      flags: i.flags
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
  isLegalMove(e, t, i) {
    try {
      return new We(this.chess.fen()).move({
        from: e,
        to: t,
        promotion: i
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
    return bt.filter((t) => this.chess.isAttacked(t, e)).map(
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
    const i = e.toLowerCase();
    if (!bt.includes(i))
      throw new Error(`Invalid square: ${e}`);
    let s;
    if (t === void 0)
      s = this.chess.turn();
    else if (t === "w" || t === "b")
      s = t;
    else
      throw new Error(`Invalid color: ${t}`);
    return this.chess.isAttacked(i, s);
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
    const t = ["a", "b", "c", "d", "e", "f", "g", "h"], i = ["1", "2", "3", "4", "5", "6", "7", "8"];
    for (const s of t)
      for (const r of i) {
        const o = `${s}${r}`, n = this.chess.get(o);
        if (n && n.type === "k" && n.color === e)
          return o;
      }
    return null;
  }
  /**
   * Vérifier si le roque est possible
   */
  canCastle(e, t) {
    const i = t || this.chess.turn(), s = this.chess.getCastlingRights(i);
    return e === "k" ? s.k : s.q;
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
    const t = this.getFenParts()[4] ?? "0", i = Number.parseInt(t, 10);
    return Number.isNaN(i) ? 0 : i;
  }
  /**
   * Créer une copie de l'état actuel
   */
  clone() {
    return new Fe(this.chess.fen());
  }
  /**
   * Valider un FEN
   */
  static isValidFEN(e) {
    try {
      return new We().load(e), !0;
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
const me = {
  color: "rgba(34, 197, 94, 0.6)",
  width: 2,
  opacity: 0.8
}, Pt = {
  default: "#ffeb3b",
  shiftKey: "#22c55e",
  ctrlKey: "#ef4444",
  altKey: "#f59e0b"
}, ni = ["shiftKey", "ctrlKey", "altKey"], oi = {
  green: "rgba(34, 197, 94, 0.6)",
  red: "rgba(239, 68, 68, 0.6)",
  blue: "rgba(59, 130, 246, 0.6)",
  yellow: "rgba(245, 158, 11, 0.6)",
  orange: "rgba(249, 115, 22, 0.6)",
  purple: "rgba(168, 85, 247, 0.6)"
}, pe = [
  "green",
  "red",
  "blue",
  "yellow",
  "orange",
  "purple"
], ai = {
  shiftKey: "green",
  ctrlKey: "red",
  altKey: "yellow"
}, li = 0.3, hi = {
  selected: 0.5,
  lastMove: 0.6
}, Mt = "rgba(255, 255, 0, 0.5)";
class ci {
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
  addArrow(e, t, i = me.color, s = me.width, r = me.opacity) {
    const o = typeof e == "object" ? this.normalizeArrow(e) : this.normalizeArrow({
      from: e,
      to: t,
      color: i,
      width: s,
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
    const t = e.color ?? me.color, i = e.width ?? me.width, s = e.opacity ?? me.opacity, r = e.knightMove ?? this.isKnightMove(e.from, e.to);
    return {
      from: e.from,
      to: e.to,
      color: t,
      width: i,
      opacity: s,
      knightMove: r
    };
  }
  findArrowIndex(e, t) {
    return this.state.arrows.findIndex(
      (i) => i.from === e && i.to === t
    );
  }
  removeArrow(e, t) {
    const i = this.findArrowIndex(e, t);
    i >= 0 && this.state.arrows.splice(i, 1);
  }
  clearArrows() {
    this.state.arrows = [];
  }
  getArrows() {
    return this.state.arrows.map((e) => ({ ...e }));
  }
  // Highlight management
  addHighlight(e, t = "green", i) {
    const s = i ?? this.getDefaultHighlightOpacity(t), r = this.findHighlightIndex(e);
    if (r >= 0) {
      this.state.highlights[r] = {
        ...this.state.highlights[r],
        type: t,
        opacity: s
      };
      return;
    }
    this.state.highlights.push({
      square: e,
      type: t,
      opacity: s
    });
  }
  getDefaultHighlightOpacity(e) {
    return hi[e] ?? li;
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
    const t = e[0].toLowerCase(), i = parseInt(e[1], 10);
    let s = t.charCodeAt(0) - 97, r = 8 - i;
    return this.orientation === "black" && (s = 7 - s, r = 7 - r), {
      x: s * this.squareSize,
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
    const { x: t, y: i } = this.getSquareCoordinates(e), s = this.squareSize / 2;
    return {
      x: t + s,
      y: i + s
    };
  }
  getHighlights() {
    return this.state.highlights.map((e) => ({ ...e }));
  }
  // Premove management
  setPremove(e, t, i) {
    this.state.premove = { from: e, to: t, promotion: i };
  }
  clearPremove() {
    this.state.premove = void 0;
  }
  getPremove() {
    return this.state.premove;
  }
  // Coordinate utilities
  squareToCoords(e) {
    const t = e.charCodeAt(0) - 97, i = parseInt(e[1]) - 1;
    return this.orientation === "white" ? [t * this.squareSize, (7 - i) * this.squareSize] : [(7 - t) * this.squareSize, i * this.squareSize];
  }
  coordsToSquare(e, t) {
    const i = Math.floor(e / this.squareSize), s = Math.floor(t / this.squareSize);
    let r, o;
    this.orientation === "white" ? (r = i, o = 7 - s) : (r = 7 - i, o = s);
    const n = String.fromCharCode(97 + r), a = (o + 1).toString();
    return `${n}${a}`;
  }
  // Knight move detection
  isKnightMove(e, t) {
    const i = e.charCodeAt(0) - 97, s = parseInt(e[1]) - 1, r = t.charCodeAt(0) - 97, o = parseInt(t[1]) - 1, n = Math.abs(r - i), a = Math.abs(o - s);
    return n === 1 && a === 2 || n === 2 && a === 1;
  }
  // Square names rendering
  renderSquareNames(e, t, i = 1) {
    const s = this.canvas.getContext("2d");
    if (!s) return;
    s.save(), s.scale(i, i);
    const r = this.squareSize / i, o = this.canvas.height / i, n = Math.max(10, r * 0.18), a = r * 0.12, l = r * 0.12;
    s.font = `500 ${n}px 'Segoe UI', Arial, sans-serif`;
    const g = "rgba(240, 217, 181, 0.7)", d = "rgba(181, 136, 99, 0.7)", u = e === "white" ? 0 : 7, v = e === "white" ? 0 : 7;
    s.textAlign = "left", s.textBaseline = "alphabetic";
    for (let _ = 0; _ < 8; _++) {
      const b = e === "white" ? _ : 7 - _, A = String.fromCharCode(97 + b), q = _ * r + a, $ = o - a, R = (b + u) % 2 === 0;
      s.fillStyle = R ? g : d, s.fillText(A, q, $);
    }
    s.textBaseline = "middle";
    for (let _ = 0; _ < 8; _++) {
      const b = e === "white" ? _ : 7 - _, A = (b + 1).toString(), q = l, $ = o - (_ + 0.5) * r, R = (v + b) % 2 === 0;
      s.fillStyle = R ? g : d, s.fillText(A, q, $);
    }
    s.restore();
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
    const i = t.width;
    return e.globalAlpha = t.opacity, e.strokeStyle = t.color, e.fillStyle = t.color, e.lineWidth = i, e.lineCap = "round", e.lineJoin = "round", i;
  }
  drawStraightArrow(e, t) {
    const [i, s] = this.squareToCoords(t.from), [r, o] = this.squareToCoords(t.to), n = i + this.squareSize / 2, a = s + this.squareSize / 2, l = r + this.squareSize / 2, g = o + this.squareSize / 2, d = l - n, u = g - a, v = Math.atan2(u, d), _ = this.squareSize * 0.25, b = n + Math.cos(v) * _, A = a + Math.sin(v) * _, q = l - Math.cos(v) * _, $ = g - Math.sin(v) * _, R = this.applyArrowStyle(e, t);
    e.beginPath(), e.moveTo(b, A), e.lineTo(q, $), e.stroke();
    const O = R * 3, H = Math.PI / 6;
    e.beginPath(), e.moveTo(q, $), e.lineTo(
      q - O * Math.cos(v - H),
      $ - O * Math.sin(v - H)
    ), e.lineTo(
      q - O * Math.cos(v + H),
      $ - O * Math.sin(v + H)
    ), e.closePath(), e.fill();
  }
  drawKnightArrow(e, t) {
    const [i, s] = this.squareToCoords(t.from), [r, o] = this.squareToCoords(t.to), n = i + this.squareSize / 2, a = s + this.squareSize / 2, l = r + this.squareSize / 2, g = o + this.squareSize / 2, d = l - n, u = g - a, v = Math.abs(d), _ = Math.abs(u);
    let b, A;
    v > _ ? (b = l, A = a) : (b = n, A = g);
    const q = this.applyArrowStyle(e, t), $ = this.squareSize * 0.2;
    let R = n, O = a, H = l, Q = g;
    v > _ ? (R += d > 0 ? $ : -$, H += d > 0 ? -$ : $) : (O += u > 0 ? $ : -$, Q += u > 0 ? -$ : $), e.beginPath(), e.moveTo(R, O), e.lineTo(b, A), e.lineTo(H, Q), e.stroke();
    const ie = q * 3, V = Math.PI / 6;
    let Y;
    v > _ ? Y = u > 0 ? Math.PI / 2 : -Math.PI / 2 : Y = d > 0 ? 0 : Math.PI, e.beginPath(), e.moveTo(H, Q), e.lineTo(
      H - ie * Math.cos(Y - V),
      Q - ie * Math.sin(Y - V)
    ), e.lineTo(
      H - ie * Math.cos(Y + V),
      Q - ie * Math.sin(Y + V)
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
    const [i, s] = this.squareToCoords(t.square), r = this.resolveHighlightColor(t), o = t.opacity ?? 0.6;
    e.globalAlpha = o, e.fillStyle = r;
    const n = i + this.squareSize / 2, a = s + this.squareSize / 2, l = this.squareSize * 0.15;
    e.beginPath(), e.arc(n, a, l, 0, 2 * Math.PI), e.fill(), e.globalAlpha = o * 1.5, e.strokeStyle = r, e.lineWidth = 3, e.stroke();
  }
  resolveHighlightColor(e) {
    if (e.type === "circle")
      return e.color ?? Mt;
    const t = e.type;
    return oi[t] ?? e.color ?? Mt;
  }
  isInHighlightSequence(e) {
    return pe.includes(e);
  }
  getNextHighlightType(e) {
    if (!this.isInHighlightSequence(e))
      return null;
    const i = (pe.indexOf(e) + 1) % pe.length;
    return i === 0 ? null : pe[i];
  }
  getActiveModifier(e) {
    for (const t of ni)
      if (e[t])
        return t;
    return null;
  }
  resolveArrowColor(e) {
    const t = this.getActiveModifier(e);
    return t ? Pt[t] : Pt.default;
  }
  resolveHighlightTypeFromModifiers(e) {
    const t = this.getActiveModifier(e);
    return t ? ai[t] : pe[0];
  }
  withContext(e) {
    const t = this.canvas.getContext("2d");
    t && e(t);
  }
  // Premove rendering
  drawPremove(e) {
    if (!this.state.premove) return;
    e.save();
    const [t, i] = this.squareToCoords(this.state.premove.from), [s, r] = this.squareToCoords(this.state.premove.to);
    e.globalAlpha = 0.7, e.strokeStyle = "#ff9800", e.lineWidth = 3, e.setLineDash && e.setLineDash([8, 4]), e.lineCap = "round";
    const o = t + this.squareSize / 2, n = i + this.squareSize / 2, a = s + this.squareSize / 2, l = r + this.squareSize / 2;
    e.beginPath(), e.moveTo(o, n), e.lineTo(a, l), e.stroke(), e.setLineDash && e.setLineDash([]), e.fillStyle = "rgba(255, 152, 0, 0.3)", e.fillRect(t, i, this.squareSize, this.squareSize), e.fillRect(s, r, this.squareSize, this.squareSize), e.restore();
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
    const i = this.canvas.getBoundingClientRect(), s = (e - i.left) * (this.canvas.width / i.width), r = (t - i.top) * (this.canvas.height / i.height);
    return s < 0 || r < 0 || s >= this.canvas.width || r >= this.canvas.height ? null : this.coordsToSquare(s, r);
  }
  // Cycle highlight colors on right-click
  cycleHighlight(e) {
    const t = this.findHighlightIndex(e);
    if (t >= 0) {
      const i = this.state.highlights[t], s = this.getNextHighlightType(i.type);
      if (!s) {
        this.removeHighlight(e);
        return;
      }
      this.state.highlights[t].type = s;
      return;
    }
    this.addHighlight(e, pe[0]);
  }
  // Complete rendering of all elements
  draw(e) {
    this.drawHighlights(e), this.drawPremove(e), this.drawArrows(e), this.showSquareNames && this._drawSquareNames(e);
  }
  // Check if a point is near an arrow (for deletion)
  getArrowAt(e, t, i = 10) {
    const s = this.canvas.getBoundingClientRect(), r = e - s.left, o = t - s.top;
    for (const n of this.state.arrows)
      if (this.isPointNearArrow(r, o, n, i))
        return { ...n };
    return null;
  }
  isPointNearArrow(e, t, i, s) {
    const [r, o] = this.squareToCoords(i.from), [n, a] = this.squareToCoords(i.to), l = r + this.squareSize / 2, g = o + this.squareSize / 2, d = n + this.squareSize / 2, u = a + this.squareSize / 2, v = Math.sqrt(
      Math.pow(d - l, 2) + Math.pow(u - g, 2)
    );
    return v === 0 ? !1 : Math.abs(
      ((u - g) * e - (d - l) * t + d * g - u * l) / v
    ) <= s;
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
  handleMouseDown(e, t, i, s) {
    return !1;
  }
  handleRightMouseDown(e, t, i = !1, s = !1, r = !1) {
    const o = this.coordsToSquare(e, t);
    return this.currentAction = { type: "drawing_arrow", startSquare: o, shiftKey: i, ctrlKey: s, altKey: r }, !0;
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
    const i = this.currentAction, s = this.coordsToSquare(e, t);
    if (s === i.startSquare)
      return this.cancelCurrentAction(), !1;
    const r = this.resolveArrowColor(i);
    return this.state.arrows.find(
      (n) => n.from === i.startSquare && n.to === s && n.color === r
    ) ? this.removeArrow(i.startSquare, s) : this.addArrow(i.startSquare, s, r), this.cancelCurrentAction(), !0;
  }
  handleHighlightClick(e, t = !1, i = !1, s = !1) {
    if (!t && !i && !s) {
      this.cycleHighlight(e);
      return;
    }
    const r = { shiftKey: t, ctrlKey: i, altKey: s }, o = this.resolveHighlightTypeFromModifiers(r);
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
      for (let i = 0; i < 8; i++) {
        const s = this.coordsToSquare(i * this.squareSize, t * this.squareSize), [r, o] = this.squareToCoords(s);
        if (t === (this.orientation === "white" ? 7 : 0)) {
          const n = this.orientation === "white" ? $e[i] : $e[7 - i];
          e.textAlign = this.orientation === "white" ? "left" : "right", e.textBaseline = "bottom", e.fillText(
            n,
            r + (this.orientation === "white" ? this.squareSize * 0.06 : this.squareSize - this.squareSize * 0.06),
            o + this.squareSize - this.squareSize * 0.06
          );
        }
        if (i === (this.orientation === "white" ? 0 : 7)) {
          const n = Ze[7 - t];
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
class ui {
  /**
   * Creates an instance of NeoChessBoard.
   * @param root The HTMLElement to which the board will be appended.
   * @param options Optional configuration options for the board.
   */
  constructor(e, t = {}) {
    this.bus = new Ts(), this.sizePx = 480, this.square = 60, this.dpr = 1, this.customPieceSprites = {}, this._pieceSetToken = 0, this.moveSound = null, this.moveSounds = {}, this._lastMove = null, this._premove = null, this._selected = null, this._legalCached = null, this._dragging = null, this._hoverSq = null, this._arrows = [], this._customHighlights = null, this._raf = 0, this._drawingArrow = null, this.root = e;
    const i = t.theme ?? "classic";
    this.theme = _t(i), this.orientation = t.orientation || "white", this.interactive = t.interactive !== !1, this.showCoords = t.showCoordinates || !1, this.highlightLegal = t.highlightLegal !== !1, this.animationMs = t.animationMs || 300, this.allowPremoves = t.allowPremoves !== !1, this.showArrows = t.showArrows !== !1, this.showHighlights = t.showHighlights !== !1, this.rightClickHighlights = t.rightClickHighlights !== !1, this.soundEnabled = t.soundEnabled !== !1, this.showSquareNames = t.showSquareNames || !1, this.autoFlip = t.autoFlip ?? !1, this.soundUrl = t.soundUrl, this.soundUrls = t.soundUrls, this._initializeSound(), this.rules = t.rulesAdapter || new Fe(), t.fen && this.rules.setFEN(t.fen), this.state = Se(this.rules.getFEN()), this._syncOrientationFromTurn(!0), this._buildDOM(), this._attachEvents(), this.resize(), t.pieceSet && this.setPieceSet(t.pieceSet);
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
    this.theme = _t(e), this._rasterize(), this.renderAll();
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
    const t = ++this._pieceSetToken, i = e.defaultScale ?? 1, s = {}, r = Object.entries(e.pieces);
    await Promise.all(
      r.map(async ([o, n]) => {
        if (n)
          try {
            const a = await this._resolvePieceSprite(n, i);
            a && (s[o] = a);
          } catch (a) {
            console.warn(`[NeoChessBoard] Failed to load sprite for piece "${o}".`, a);
          }
      })
    ), t === this._pieceSetToken && (this.customPieceSprites = s, this.renderAll());
  }
  /**
   * Sets the board position using a FEN string.
   * @param fen The FEN string representing the board state.
   * @param immediate If true, the board updates instantly without animation.
   */
  setFEN(e, t = !1) {
    const i = this.state, s = this.state.turn;
    this.rules.setFEN(e), this.state = Se(this.rules.getFEN()), this._syncOrientationFromTurn(!1), this._lastMove = null;
    const r = this.state.turn;
    s !== r && this._executePremoveIfValid(), this._premove = null, t ? (this._clearAnim(), this.renderAll()) : this._animateTo(this.state, i), this.bus.emit("update", { fen: this.getPosition() });
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
    this.ctxB = this.cBoard.getContext("2d"), this.ctxP = this.cPieces.getContext("2d"), this.ctxO = this.cOverlay.getContext("2d"), this.drawingManager = new ci(this.cOverlay), this.drawingManager.setOrientation(this.orientation), this.drawingManager.setShowSquareNames(this.showSquareNames), this._rasterize();
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
    const e = this.root.getBoundingClientRect(), t = Math.min(e.width, e.height) || 480, i = globalThis.devicePixelRatio || 1;
    for (const s of [this.cBoard, this.cPieces, this.cOverlay])
      s.width = Math.round(t * i), s.height = Math.round(t * i);
    this.sizePx = t, this.square = t * i / 8, this.dpr = i, this.drawingManager && this.drawingManager.updateDimensions(), this.renderAll();
  }
  /**
   * Initializes or re-initializes the sprite sheet for pieces based on the current theme.
   * This is called when the theme changes or on initial setup.
   */
  _rasterize() {
    this.sprites = new Is(128, this.theme);
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
    const { f: t, r: i } = pt(e), s = this.orientation === "white" ? t : 7 - t, r = this.orientation === "white" ? 7 - i : i;
    return { x: s * this.square, y: r * this.square };
  }
  /**
   * Draws the chess board squares onto the board canvas.
   * Uses the current theme's light and dark square colors.
   */
  _drawBoard() {
    const e = this.ctxB, t = this.square, i = this.cBoard.width, s = this.cBoard.height, { light: r, dark: o, boardBorder: n } = this.theme;
    e.clearRect(0, 0, i, s), e.fillStyle = n, e.fillRect(0, 0, i, s);
    for (let a = 0; a < 8; a++)
      for (let l = 0; l < 8; l++) {
        const g = (this.orientation === "white" ? l : 7 - l) * t, d = (this.orientation === "white" ? 7 - a : a) * t;
        e.fillStyle = (a + l) % 2 === 0 ? r : o, e.fillRect(g, d, t, t);
      }
  }
  async _resolvePieceSprite(e, t) {
    const i = typeof e == "object" && e !== null && "image" in e ? e : { image: e };
    let s = null;
    return typeof i.image == "string" ? s = await this._loadImage(i.image) : i.image && (s = i.image), s ? {
      image: s,
      scale: i.scale ?? t ?? 1,
      offsetX: i.offsetX ?? 0,
      offsetY: i.offsetY ?? 0
    } : null;
  }
  _loadImage(e) {
    return new Promise((t, i) => {
      var o;
      const s = ((o = this.root) == null ? void 0 : o.ownerDocument) ?? (typeof document < "u" ? document : null), r = typeof Image < "u" ? new Image() : s ? s.createElement("img") : null;
      if (!r) {
        i(new Error("Image loading is not supported in the current environment."));
        return;
      }
      e.startsWith("data:") || (r.crossOrigin = "anonymous");
      try {
        r.decoding = "async";
      } catch {
      }
      r.onload = () => t(r), r.onerror = (n) => i(n instanceof Error ? n : new Error(String(n))), r.src = e;
    });
  }
  /**
   * Draws a single piece sprite onto the pieces canvas.
   * @param piece The FEN notation of the piece (e.g., 'p', 'K').
   * @param x The x-coordinate for the top-left corner of the piece.
   * @param y The y-coordinate for the top-left corner of the piece.
   * @param scale Optional scale factor for the piece (default is 1).
   */
  _drawPieceSprite(e, t, i, s = 1) {
    const r = this.customPieceSprites[e];
    if (r) {
      const b = s * (r.scale ?? 1), A = this.square * b, q = t + (this.square - A) / 2 + r.offsetX * this.square, $ = i + (this.square - A) / 2 + r.offsetY * this.square;
      this.ctxP.drawImage(r.image, q, $, A, A);
      return;
    }
    const o = { k: 0, q: 1, r: 2, b: 3, n: 4, p: 5 }, n = de(e), a = o[e.toLowerCase()], l = 128, g = a * l, d = n ? l : 0, u = this.square * s, v = t + (this.square - u) / 2, _ = i + (this.square - u) / 2;
    this.ctxP.drawImage(this.sprites.getSheet(), g, d, l, l, v, _, u, u);
  }
  /**
   * Draws all pieces onto the pieces canvas, handling dragging pieces separately.
   */
  _drawPieces() {
    var r;
    const e = this.ctxP, t = this.cPieces.width, i = this.cPieces.height;
    e.clearRect(0, 0, t, i);
    const s = (r = this._dragging) == null ? void 0 : r.from;
    for (let o = 0; o < 8; o++)
      for (let n = 0; n < 8; n++) {
        const a = this.state.board[o][n];
        if (!a) continue;
        const l = be(n, o);
        if (s === l) continue;
        const { x: g, y: d } = this._sqToXY(l);
        this._drawPieceSprite(a, g, d, 1);
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
    const e = this.ctxO, t = this.cOverlay.width, i = this.cOverlay.height;
    e.clearRect(0, 0, t, i);
    const s = this.square;
    if (this._lastMove) {
      const { from: o, to: n } = this._lastMove, a = this._sqToXY(o), l = this._sqToXY(n);
      e.fillStyle = this.theme.lastMove, e.fillRect(a.x, a.y, s, s), e.fillRect(l.x, l.y, s, s);
    }
    if ((r = this._customHighlights) != null && r.squares) {
      e.fillStyle = this.theme.moveTo;
      for (const o of this._customHighlights.squares) {
        const n = this._sqToXY(o);
        e.fillRect(n.x, n.y, s, s);
      }
    }
    if (this._selected) {
      const o = this._sqToXY(this._selected);
      if (e.fillStyle = this.theme.moveFrom, e.fillRect(o.x, o.y, s, s), this.highlightLegal && this._legalCached) {
        e.fillStyle = this.theme.dot;
        for (const n of this._legalCached) {
          const a = this._sqToXY(n.to);
          e.beginPath(), e.arc(a.x + s / 2, a.y + s / 2, s * 0.12, 0, Math.PI * 2), e.fill();
        }
      }
    }
    for (const o of this._arrows)
      this._drawArrow(o.from, o.to, o.color || this.theme.arrow);
    if (this._premove) {
      const o = this._sqToXY(this._premove.from), n = this._sqToXY(this._premove.to);
      e.fillStyle = this.theme.premove, e.fillRect(o.x, o.y, s, s), e.fillRect(n.x, n.y, s, s);
    }
    if (this._hoverSq && this._dragging) {
      const o = this._sqToXY(this._hoverSq);
      e.fillStyle = this.theme.moveTo, e.fillRect(o.x, o.y, s, s);
    }
    this.drawingManager && (this.showArrows && this.drawingManager.renderArrows(), this.showHighlights && this.drawingManager.renderHighlights(), this.allowPremoves && this.drawingManager.renderPremove(), this.showSquareNames && this.drawingManager.renderSquareNames(this.orientation, this.square, this.dpr));
  }
  /**
   * Draws an arrow between the center of two squares.
   * @param from The starting square of the arrow.
   * @param to The ending square of the arrow.
   * @param color The color of the arrow.
   */
  _drawArrow(e, t, i) {
    const s = this.square, r = this._sqToXY(e), o = this._sqToXY(t);
    this._drawArrowBetween(r.x + s / 2, r.y + s / 2, o.x + s / 2, o.y + s / 2, i);
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
  _drawArrowBetween(e, t, i, s, r) {
    const o = i - e, n = s - t, a = Math.hypot(o, n);
    if (a < 1) return;
    const l = o / a, g = n / a, d = Math.min(16 * this.dpr, a * 0.25), u = Math.max(6 * this.dpr, this.square * 0.08), v = this.ctxO;
    v.save(), v.lineCap = "round", v.lineJoin = "round", v.strokeStyle = r, v.fillStyle = r, v.globalAlpha = 0.95, v.beginPath(), v.moveTo(e, t), v.lineTo(i - l * d, s - g * d), v.lineWidth = u, v.stroke(), v.beginPath(), v.moveTo(i, s), v.lineTo(i - l * d - g * d * 0.5, s - g * d + l * d * 0.5), v.lineTo(i - l * d + g * d * 0.5, s - g * d - l * d * 0.5), v.closePath(), v.fill(), v.restore();
  }
  _setSelection(e, t) {
    const i = de(t) ? "w" : "b";
    this._selected = e, i === this.state.turn ? this._legalCached = this.rules.movesFrom(e) : this.allowPremoves ? this._legalCached = [] : this._legalCached = null;
  }
  _handleClickMove(e) {
    const t = this._selected;
    if (!t || t === e) {
      t === e && this.renderAll();
      return;
    }
    const i = this._pieceAt(t);
    if (!i) {
      this._selected = null, this._legalCached = null, this.renderAll();
      return;
    }
    const s = this._pieceAt(e);
    if (s && de(s) === de(i)) {
      this._setSelection(e, s), this.renderAll();
      return;
    }
    this._attemptMove(t, e, i);
  }
  _attemptMove(e, t, i) {
    const s = de(i) ? "w" : "b";
    if (e === t)
      return this.renderAll(), !0;
    if (s !== this.state.turn)
      return this.allowPremoves ? (this.drawingManager && this.drawingManager.setPremove(e, t), this._premove = { from: e, to: t }, this._selected = null, this._legalCached = null, this._hoverSq = null, this.renderAll(), !0) : !1;
    const r = this.rules.move({ from: e, to: t });
    if (r && r.ok) {
      const o = this.rules.getFEN(), n = this.state, a = Se(o);
      return this.state = a, this._syncOrientationFromTurn(!1), this._selected = null, this._legalCached = null, this._hoverSq = null, this._lastMove = { from: e, to: t }, this.drawingManager && this.drawingManager.clearArrows(), this._playMoveSound(), this._animateTo(a, n), this.bus.emit("move", { from: e, to: t, fen: o }), setTimeout(() => {
        this._executePremoveIfValid();
      }, this.animationMs + 50), !0;
    }
    return this._selected = null, this._legalCached = null, this._hoverSq = null, this.renderAll(), this.bus.emit("illegal", { from: e, to: t, reason: (r == null ? void 0 : r.reason) || "illegal" }), !0;
  }
  // ---- interaction ----
  _attachEvents() {
    let e = !1;
    const t = () => this._dragging ? (this._dragging = null, this._selected = null, this._legalCached = null, this._hoverSq = null, this.renderAll(), !0) : !1, i = (a) => {
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
        const v = this._evt(a);
        v && this.drawingManager && this.drawingManager.handleRightMouseDown(v.x, v.y, a.shiftKey, a.ctrlKey, a.altKey) && this.renderAll();
        return;
      }
      if (a.button !== 0) return;
      const l = this._evt(a);
      if (!l) return;
      const g = this._xyToSquare(l.x, l.y), d = this._pieceAt(g);
      !d || (de(d) ? "w" : "b") !== this.state.turn && !this.allowPremoves || (this._setSelection(g, d), this._dragging = { from: g, piece: d, x: l.x, y: l.y }, this._hoverSq = g, this.renderAll());
    }, s = (a) => {
      const l = this._evt(a);
      if (!l) {
        this.interactive && (this.cOverlay.style.cursor = "default");
        return;
      }
      if (this.drawingManager && this.drawingManager.handleMouseMove(l.x, l.y) && this.renderAll(), this._dragging)
        this._dragging.x = l.x, this._dragging.y = l.y, this._hoverSq = this._xyToSquare(l.x, l.y), this._drawPieces(), this._drawOverlay();
      else if (this.interactive) {
        const g = this._xyToSquare(l.x, l.y), d = this._pieceAt(g);
        this.cOverlay.style.cursor = d ? "pointer" : "default";
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
      const l = this._evt(a);
      if (a.button === 2) {
        let v = !1;
        if (this.drawingManager && l && (v = this.drawingManager.handleRightMouseUp(l.x, l.y)), !v && l) {
          if (this.drawingManager && this.drawingManager.getPremove())
            this.drawingManager.clearPremove(), this._premove = null, console.log("Premove cancelled by right-click"), v = !0;
          else if (this.rightClickHighlights) {
            const _ = this._xyToSquare(l.x, l.y);
            this.drawingManager && this.drawingManager.handleHighlightClick(_, a.shiftKey, a.ctrlKey, a.altKey);
          }
        }
        this.renderAll();
        return;
      }
      if (this.drawingManager && this.drawingManager.handleMouseUp((l == null ? void 0 : l.x) || 0, (l == null ? void 0 : l.y) || 0)) {
        this.renderAll();
        return;
      }
      if (!this._dragging) {
        if (this.interactive && a.button === 0 && l) {
          const v = this._xyToSquare(l.x, l.y);
          this._handleClickMove(v);
        }
        return;
      }
      const g = l ? this._xyToSquare(l.x, l.y) : null, d = this._dragging.from, u = this._dragging.piece;
      if (this._dragging = null, this._hoverSq = null, !g) {
        this._selected = null, this._legalCached = null, this.renderAll();
        return;
      }
      if (g === d) {
        this.renderAll();
        return;
      }
      this._attemptMove(d, g, u);
    }, o = (a) => {
      a.key === "Escape" && (this._selected = null, this._legalCached = null, this._dragging = null, this._hoverSq = null, this.drawingManager && this.drawingManager.cancelCurrentAction(), this.renderAll());
    }, n = (a) => {
      this.rightClickHighlights && a.preventDefault();
    };
    this.cOverlay.addEventListener("pointerdown", i), this.cOverlay.addEventListener("contextmenu", n), this._onPointerDown = i, this._onContextMenu = n, globalThis.addEventListener("pointermove", s), this._onPointerMove = s, globalThis.addEventListener("pointerup", r), this._onPointerUp = r, globalThis.addEventListener("keydown", o), this._onKeyDown = o;
  }
  _removeEvents() {
    var e;
    this.cOverlay.removeEventListener("pointerdown", this._onPointerDown), this.cOverlay.removeEventListener("contextmenu", this._onContextMenu), globalThis.removeEventListener("pointermove", this._onPointerMove), globalThis.removeEventListener("pointerup", this._onPointerUp), globalThis.removeEventListener("keydown", this._onKeyDown), (e = this._ro) == null || e.disconnect();
  }
  _evt(e) {
    const t = this.cOverlay.getBoundingClientRect(), i = (e.clientX - t.left) * (this.cOverlay.width / t.width), s = (e.clientY - t.top) * (this.cOverlay.height / t.height);
    return i < 0 || s < 0 || i > this.cOverlay.width || s > this.cOverlay.height ? null : { x: i, y: s };
  }
  _xyToSquare(e, t) {
    const i = xe(Math.floor(e / this.square), 0, 7), s = xe(Math.floor(t / this.square), 0, 7), r = this.orientation === "white" ? i : 7 - i, o = this.orientation === "white" ? 7 - s : s;
    return be(r, o);
  }
  _pieceAt(e) {
    const { f: t, r: i } = pt(e);
    return this.state.board[i][t];
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
    const i = performance.now(), s = this.animationMs, r = /* @__PURE__ */ new Map();
    for (let n = 0; n < 8; n++)
      for (let a = 0; a < 8; a++) {
        const l = t.board[n][a], g = e.board[n][a];
        if (l && (!g || l !== g)) {
          const d = this.findPiece(e.board, l, n, a, t.board);
          d && r.set(be(a, n), be(d.f, d.r));
        }
      }
    const o = () => {
      var g;
      const n = xe((performance.now() - i) / s, 0, 1), a = ks(n);
      this.ctxP.clearRect(0, 0, this.cPieces.width, this.cPieces.height);
      for (let d = 0; d < 8; d++)
        for (let u = 0; u < 8; u++) {
          const v = e.board[d][u];
          if (!v) continue;
          const _ = be(u, d), b = (g = [...r.entries()].find(([A, q]) => q === _)) == null ? void 0 : g[0];
          if (b) {
            const { x: A, y: q } = this._sqToXY(b), { x: $, y: R } = this._sqToXY(_), O = vt(A, $, a), H = vt(q, R, a);
            this._drawPieceSprite(v, O, H, 1);
          } else {
            const { x: A, y: q } = this._sqToXY(_);
            this._drawPieceSprite(v, A, q, 1);
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
  findPiece(e, t, i, s, r) {
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
    const e = this.soundUrl, t = (r = this.soundUrls) == null ? void 0 : r.white, i = (o = this.soundUrls) == null ? void 0 : o.black;
    if (!e && !t && !i)
      return;
    const s = (n) => {
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
      const n = s(t);
      n && (this.moveSounds.white = n);
    }
    if (i) {
      const n = s(i);
      n && (this.moveSounds.black = n);
    }
    if (e) {
      const n = s(e);
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
        t.currentTime = 0, t.play().catch((i) => {
          console.debug("Sound not played:", i.message);
        });
      } catch (i) {
        console.debug("Error playing sound:", i);
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
      const i = this.rules.getFEN(), s = Se(i), r = this.state;
      this.state = s, this._syncOrientationFromTurn(!1), this._lastMove = { from: e.from, to: e.to }, (o = this.drawingManager) == null || o.clearPremove(), (n = this.drawingManager) == null || n.clearArrows(), this._premove = null, this._animateTo(s, r), this.bus.emit("move", { from: e.from, to: e.to, fen: i });
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
        const i = this.rules.getPgnNotation ? this.rules.getPgnNotation() : null;
        return i && (i.loadPgnWithAnnotations(e), this.displayAnnotationsFromPgn(i)), this.state = Se(this.rules.getFEN()), this._syncOrientationFromTurn(!1), this.renderAll(), !0;
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
    const i = t[t.length - 1];
    (i.white ? 1 : 0) + (i.black ? 1 : 0);
    const s = t.reduce(
      (o, n) => o + (n.white ? 1 : 0) + (n.black ? 1 : 0),
      0
    );
    let r = null;
    if (s % 2 === 0 && i.blackAnnotations ? r = i.blackAnnotations : s % 2 === 1 && i.whiteAnnotations && (r = i.whiteAnnotations), r) {
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
  addAnnotationsToCurrentMove(e = [], t = [], i = "") {
    if (!this.drawingManager) return;
    const s = this.rules.getPgnNotation ? this.rules.getPgnNotation() : null;
    if (s) {
      const o = (this.rules.history ? this.rules.history() : []).length, n = Math.floor(o / 2) + 1, a = o % 2 === 0;
      s.addMoveAnnotations(n, a, {
        arrows: e,
        circles: t,
        textComment: i
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
class fi {
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
    var i;
    if ((i = this.adapter) != null && i.getPGN)
      return this.adapter.getPGN();
    const e = Object.entries(this.headers).map(([s, r]) => `[${s} "${r}"]`).join(`
`);
    let t = "";
    for (let s = 0; s < this.moves.length; s += 2) {
      const r = s / 2 + 1, o = this.fmt(this.moves[s]), n = this.moves[s + 1] ? this.fmt(this.moves[s + 1]) : "";
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
    const e = (i) => i.replace(/[^a-z0-9_\-]+/gi, "_"), t = (this.headers.Date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)).replace(/\./g, "-");
    return `${e(this.headers.White || "White")}_vs_${e(this.headers.Black || "Black")}_${t}.pgn`;
  }
  download(e = this.suggestFilename()) {
    if (typeof document > "u")
      return;
    const t = URL.createObjectURL(this.toBlob()), i = document.createElement("a");
    i.href = t, i.download = e, document.body.appendChild(i), i.click(), setTimeout(() => {
      document.body.removeChild(i), URL.revokeObjectURL(t);
    }, 0);
  }
  fmt(e) {
    const t = e.promotion ? `=${e.promotion.toUpperCase()}` : "";
    return `${e.from}${e.captured ? "x" : ""}${e.to}${t}`;
  }
}
const Ve = [];
let Je;
function gi(h) {
  if (Je) {
    h(Je);
    return;
  }
  Ve.push(h);
}
function di(h) {
  for (Je = h; Ve.length > 0; ) {
    const e = Ve.shift();
    e == null || e(h);
  }
}
function Ge(h) {
  return {
    from: h.from,
    to: h.to,
    promotion: h.promotion,
    captured: h.captured ?? void 0,
    san: h.san
  };
}
function mi() {
  const h = document.getElementById("oracle-board");
  if (!h) {
    console.warn("[oracle-board] Missing container #oracle-board.");
    return;
  }
  const e = new Fe(), t = new ui(h, {
    rulesAdapter: e,
    interactive: !0,
    highlightLegal: !0,
    showCoordinates: !0,
    showHighlights: !0,
    showArrows: !0,
    allowPremoves: !1,
    animationMs: 200,
    soundEnabled: !1
  }), i = new fi(e), s = e, r = () => {
    if (typeof s.getHistory == "function")
      return s.getHistory();
    if (typeof s.history == "function")
      try {
        return s.history({ verbose: !0 }) ?? [];
      } catch (d) {
        console.warn("[oracle-board] Unable to access verbose history.", d);
      }
    return [];
  }, o = () => {
    i.reset(), r().forEach((d) => i.push(Ge(d)));
  };
  let n, a;
  const l = () => {
    a == null || a({ fen: e.getFEN(), pgn: i.getPGN() });
  };
  t.on("move", (d) => {
    const { from: u, to: v, fen: _ } = d, b = r(), A = b[b.length - 1];
    A ? (i.push(Ge(A)), n == null || n({ from: u, to: v, fen: _, san: A.san })) : (i.push(Ge({ from: u, to: v })), n == null || n({ from: u, to: v, fen: _ })), l();
  }), t.on("update", () => l());
  const g = {
    loadPgn(d) {
      if (typeof d != "string" || d.trim().length === 0)
        return !1;
      const u = t.loadPgnWithAnnotations(d);
      return u && (o(), l()), u;
    },
    reset() {
      typeof e.reset == "function" ? e.reset() : e.setFEN("start"), i.reset(), t.setFEN(e.getFEN(), !0), l();
    },
    getFen() {
      return e.getFEN();
    },
    getPgn() {
      return i.getPGN();
    },
    onMove(d) {
      n = d;
    },
    onUpdate(d) {
      a = d, l();
    }
  };
  window.oracleBoard = g, document.dispatchEvent(
    new CustomEvent("oracle-board:ready", {
      detail: g
    })
  ), di(g), l();
}
function pi() {
  var Me;
  const h = document.querySelector("[data-app-root]");
  if (!h)
    return;
  const e = document.getElementById("pgn"), t = h.querySelector("[data-load-pgn]"), i = h.querySelector("[data-reset-board]"), s = h.querySelectorAll("[data-mode-input]"), r = h.querySelectorAll("[data-mode-panel]"), o = h.querySelector("[data-game-new]"), n = h.querySelector("[data-game-resign]"), a = h.querySelector("[data-game-status]"), l = h.querySelector("[data-game-level]"), g = (S) => S && S.trim().length > 0 ? S.trim() : "";
  let d = h.dataset.activeMode === "play" ? "play" : "analyze", u, v = !1;
  const _ = {
    newGame: g(h.dataset.gameNewEndpoint),
    move: g(h.dataset.gameMoveEndpoint),
    resign: g(h.dataset.gameResignEndpoint)
  }, b = {
    inProgress: !1,
    awaitingResponse: !1,
    lastStablePgn: "",
    selectedLevel: ((Me = l == null ? void 0 : l.value) == null ? void 0 : Me.trim()) ?? ""
  }, A = (S) => {
    v = !0;
    try {
      S();
    } finally {
      v = !1;
    }
  }, q = (S) => {
    e && (e.value = S);
  }, $ = () => {
    r.forEach((S) => {
      const y = S.dataset.modePanel ?? "analyze";
      S.toggleAttribute("hidden", y !== d);
    }), e && (d === "play" ? e.setAttribute("readonly", "true") : e.removeAttribute("readonly"));
  }, R = () => {
    const S = d === "play";
    o && (o.disabled = !S || b.awaitingResponse), n && (n.disabled = !S || !b.inProgress || b.awaitingResponse);
  }, O = (S, y = "info") => {
    if (!a)
      return;
    if (!S) {
      a.textContent = "", a.hidden = !0, a.classList.remove("alert-info", "alert-danger", "alert-success");
      return;
    }
    a.hidden = !1, a.textContent = S, a.classList.remove("alert-info", "alert-danger", "alert-success");
    const E = y === "error" ? "alert-danger" : y === "success" ? "alert-success" : "alert-info";
    a.classList.add(E);
  }, H = () => {
    if (!u || !e)
      return;
    const S = e.value.trim();
    A(() => {
      S.length > 0 && u.loadPgn(S) || u.reset();
    });
    const y = u.getPgn();
    q(y), b.lastStablePgn = y;
  }, Q = (S) => {
    if (!u)
      return;
    const y = (S ?? b.lastStablePgn).trim();
    A(() => {
      y.length > 0 && u.loadPgn(y) || u.reset();
    });
    const E = u.getPgn();
    q(E);
  }, ie = (S, y) => {
    if (!u)
      return;
    const E = typeof S == "string" ? S.trim() : "";
    A(() => {
      E.length > 0 && u.loadPgn(E) || u.reset();
    });
    const N = u.getPgn();
    b.lastStablePgn = N, q(N);
    const L = !!(y != null && y.finished);
    let G;
    typeof (y == null ? void 0 : y.status) == "string" ? G = y.status : typeof (y == null ? void 0 : y.message) == "string" ? G = y.message : L && (G = "Partie terminée."), O(G ?? "Coup joué.", L ? "success" : "info"), L && (b.inProgress = !1), R();
  }, V = async (S, y) => {
    if (!S)
      throw new Error("Endpoint de partie indisponible.");
    const E = await fetch(S, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(y)
    });
    if (!E.ok)
      throw new Error(`Erreur serveur (${E.status}) lors de l'échange avec l'ordinateur.`);
    return (E.headers.get("content-type") ?? "").includes("application/json") ? E.json() : {};
  }, Y = () => {
    const S = b.selectedLevel.trim();
    return S.length > 0 ? S : void 0;
  }, re = (S, y = {}) => {
    const { force: E = !1 } = y;
    if (!(!E && d === S)) {
      if (d = S, $(), R(), d === "analyze") {
        O(), u && H();
        return;
      }
      if (b.inProgress = !1, b.awaitingResponse = !1, u) {
        A(() => u.reset());
        const N = u.getPgn();
        b.lastStablePgn = N, q(N);
      } else
        q(""), b.lastStablePgn = "";
      O("Choisissez un niveau puis démarrez une partie.", "info"), R();
    }
  };
  s.forEach((S) => {
    S.addEventListener("change", () => {
      S.checked && re(S.value === "play" ? "play" : "analyze");
    });
  }), t == null || t.addEventListener("click", () => {
    d === "analyze" && (H(), e == null || e.focus());
  }), i == null || i.addEventListener("click", () => {
    if (d !== "analyze" || !u)
      return;
    A(() => u.reset());
    const S = u.getPgn();
    q(S), e == null || e.focus();
  }), l == null || l.addEventListener("change", () => {
    var S;
    b.selectedLevel = ((S = l.value) == null ? void 0 : S.trim()) ?? "";
  });
  const te = document.querySelector('form[action="/analyze"]');
  te == null || te.addEventListener("submit", async (S) => {
    S.preventDefault();
    const y = te.querySelector('button[type="submit"]');
    if (!y)
      return;
    const E = y.innerHTML;
    y.disabled = !0, y.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Analyse en cours...
    `;
    try {
      const N = new FormData(te), L = await fetch(te.action, {
        method: te.method,
        body: new URLSearchParams(N)
      });
      if (!L.ok)
        throw new Error(`Erreur serveur (${L.status}) lors de l'analyse.`);
      const G = await L.text(), _e = new DOMParser().parseFromString(G, "text/html").querySelector(".col-12.col-xl-10.col-xxl-9"), fe = document.querySelector(".col-12.col-xl-10.col-xxl-9");
      _e && fe && (fe.innerHTML = _e.innerHTML, Pe(_e));
    } catch (N) {
      const L = N instanceof Error ? N.message : "Une erreur inattendue est survenue.";
      O(L, "error");
    } finally {
      y.disabled = !1, y.innerHTML = E;
    }
  });
  const Pe = (S) => {
    Array.from(S.querySelectorAll("script")).forEach((E) => {
      var L;
      const N = document.createElement("script");
      E.src ? (N.src = E.src, N.async = !1) : N.textContent = E.textContent;
      for (const { name: G, value: j } of E.attributes)
        N.setAttribute(G, j);
      (L = E.parentNode) == null || L.replaceChild(N, E);
    });
  };
  o == null || o.addEventListener("click", async () => {
    if (d !== "play" && re("play"), !u || b.awaitingResponse) {
      u || O("Plateau en cours de chargement…", "info");
      return;
    }
    b.awaitingResponse = !0, R(), O("Initialisation de la partie…", "info");
    try {
      const S = {}, y = Y();
      y && (S.level = y);
      const E = await V(_.newGame, S);
      A(() => {
        u.reset(), typeof (E == null ? void 0 : E.pgn) == "string" && E.pgn.trim().length > 0 && u.loadPgn(E.pgn);
      });
      const N = u.getPgn();
      b.lastStablePgn = N, b.inProgress = !0, q(N);
      const L = typeof (E == null ? void 0 : E.status) == "string" ? E.status : "La partie a démarré.";
      O(L, "info");
    } catch (S) {
      console.error("[oracle-board] Unable to start game:", S);
      const y = S instanceof Error ? S.message : "Impossible de démarrer la partie.";
      O(y, "error");
    } finally {
      b.awaitingResponse = !1, R();
    }
  }), n == null || n.addEventListener("click", async () => {
    if (!(d !== "play" || !u || !b.inProgress || b.awaitingResponse)) {
      b.awaitingResponse = !0, R(), O("Abandon en cours…", "info");
      try {
        const S = { pgn: b.lastStablePgn }, y = Y();
        y && (S.level = y);
        const E = await V(_.resign, S);
        typeof (E == null ? void 0 : E.pgn) == "string" && A(() => {
          E.pgn.trim().length > 0 ? u.loadPgn(E.pgn) : u.reset();
        });
        const N = u.getPgn();
        q(N), b.lastStablePgn = N, b.inProgress = !1;
        const L = typeof (E == null ? void 0 : E.status) == "string" ? E.status : "Vous avez abandonné la partie.";
        O(L, "success");
      } catch (S) {
        console.error("[oracle-board] Unable to resign game:", S);
        const y = S instanceof Error ? S.message : "Impossible d'abandonner la partie.";
        O(y, "error"), b.inProgress = !1;
      } finally {
        b.awaitingResponse = !1, R();
      }
    }
  }), gi((S) => {
    if (u = S, d === "analyze")
      H();
    else if (u) {
      A(() => u.reset());
      const y = u.getPgn();
      b.lastStablePgn = y, q(y), O("Choisissez un niveau puis démarrez une partie.", "info");
    }
    u == null || u.onMove((y) => {
      if (!u || v)
        return;
      if (d === "analyze") {
        q(u.getPgn());
        return;
      }
      if (!b.inProgress) {
        O("Lancez une nouvelle partie pour jouer.", "error"), Q();
        return;
      }
      if (b.awaitingResponse) {
        Q();
        return;
      }
      const E = b.lastStablePgn, N = u.getPgn(), L = {
        move: y.san ?? "",
        from: y.from,
        to: y.to,
        fen: y.fen,
        pgn: N
      }, G = Y();
      G && (L.level = G), b.awaitingResponse = !0, R(), O("Coup envoyé, attente de la réponse…", "info"), V(_.move, L).then((j) => {
        const ue = j && typeof j.pgn == "string" ? j.pgn : N;
        ie(ue, j);
      }).catch((j) => {
        console.error("[oracle-board] Unable to send move:", j);
        const ue = j instanceof Error ? j.message : "Impossible d'envoyer le coup.";
        O(ue, "error"), Q(E);
      }).finally(() => {
        b.awaitingResponse = !1, R();
      });
    }), u == null || u.onUpdate(({ pgn: y }) => {
      if (!v) {
        if (d === "analyze") {
          if (!e || document.activeElement === e)
            return;
          q(y);
          return;
        }
        b.awaitingResponse || (b.lastStablePgn = y), q(y);
      }
    });
  }), re(d, { force: !0 });
}
function Et() {
  pi(), mi();
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Et, { once: !0 }) : Et();
