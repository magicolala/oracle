var Ms = Object.defineProperty;
var Es = (h, e, t) => e in h ? Ms(h, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : h[e] = t;
var L = (h, e, t) => Es(h, typeof e != "symbol" ? e + "" : e, t);
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
const Fe = ["a", "b", "c", "d", "e", "f", "g", "h"], tt = ["1", "2", "3", "4", "5", "6", "7", "8"];
function me(h) {
  return h === h.toUpperCase();
}
function Ae(h, e) {
  return Fe[h] + tt[e];
}
function vt(h) {
  return {
    f: Fe.indexOf(h[0]),
    r: tt.indexOf(h[1])
  };
}
function Ce(h) {
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
function De(h, e, t) {
  return Math.max(e, Math.min(t, h));
}
function _t(h, e, t) {
  return h + (e - h) * t;
}
function ks(h) {
  return 1 - Math.pow(1 - h, 3);
}
const kt = {
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
}, qs = "classic", qt = () => kt[qs], Ns = (h) => {
  const e = qt();
  return {
    ...e,
    ...h,
    pieceStroke: h.pieceStroke ?? e.pieceStroke,
    pieceHighlight: h.pieceHighlight ?? e.pieceHighlight
  };
}, wt = (h) => typeof h == "string" ? kt[h] ?? qt() : Ns(h);
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
      const f = e.fillStyle;
      e.fillStyle = "rgba(0,0,0,0.15)", e.beginPath(), e.arc(s * 0.5, s * 0.36, s * 0.02, 0, Math.PI * 2), e.fill(), e.fillStyle = f, l();
    }
    if (r === "b") {
      e.beginPath(), e.ellipse(s * 0.5, s * 0.42, s * 0.12, s * 0.18, 0, 0, Math.PI * 2), e.fill();
      const f = e.globalCompositeOperation;
      e.globalCompositeOperation = "destination-out", e.beginPath(), e.moveTo(s * 0.5, s * 0.28), e.lineTo(s * 0.5, s * 0.52), e.lineWidth = s * 0.04, e.stroke(), e.globalCompositeOperation = f, l();
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
function _e(h, e, t, i) {
  var s = Error.call(this, h);
  return Object.setPrototypeOf && Object.setPrototypeOf(s, _e.prototype), s.expected = e, s.found = t, s.location = i, s.name = "SyntaxError", s;
}
Ls(_e, Error);
function ze(h, e, t) {
  return t = t || " ", h.length > e ? h : (e -= h.length, t += t.repeat(e), h + t.slice(0, e));
}
_e.prototype.format = function(h) {
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
      var n = this.location.end, a = ze("", r.line.toString().length, " "), l = t[s.line - 1], f = s.line === n.line ? n.column : l.length + 1, p = f - s.column || 1;
      e += `
 --> ` + o + `
` + a + ` |
` + r.line + " | " + l + `
` + a + " | " + ze("", s.column - 1, " ") + ze("", p, "^");
    } else
      e += `
 at ` + o;
  }
  return e;
};
_e.buildMessage = function(h, e) {
  var t = {
    literal: function(l) {
      return '"' + s(l.text) + '"';
    },
    class: function(l) {
      var f = l.parts.map(function(p) {
        return Array.isArray(p) ? r(p[0]) + "-" + r(p[1]) : r(p);
      });
      return "[" + (l.inverted ? "^" : "") + f.join("") + "]";
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
    return l.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(f) {
      return "\\x0" + i(f);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(f) {
      return "\\x" + i(f);
    });
  }
  function r(l) {
    return l.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(f) {
      return "\\x0" + i(f);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(f) {
      return "\\x" + i(f);
    });
  }
  function o(l) {
    return t[l.type](l);
  }
  function n(l) {
    var f = l.map(o), p, v;
    if (f.sort(), f.length > 0) {
      for (p = 1, v = 1; p < f.length; p++)
        f[p - 1] !== f[p] && (f[v] = f[p], v++);
      f.length = v;
    }
    switch (f.length) {
      case 1:
        return f[0];
      case 2:
        return f[0] + " or " + f[1];
      default:
        return f.slice(0, -1).join(", ") + ", or " + f[f.length - 1];
    }
  }
  function a(l) {
    return l ? '"' + s(l) + '"' : "end of input";
  }
  return "Expected " + n(h) + " but " + a(e) + " found.";
};
function Hs(h, e) {
  e = e !== void 0 ? e : {};
  var t = {}, i = e.grammarSource, s = { pgn: ut }, r = ut, o = "[", n = '"', a = "]", l = ".", f = "O-O-O", p = "O-O", v = "0-0-0", _ = "0-0", m = "$", k = "{", P = "}", b = ";", I = "(", $ = ")", Y = "1-0", R = "0-1", F = "1/2-1/2", te = "*", Q = /^[a-zA-Z]/, Z = /^[^"]/, re = /^[0-9]/, fe = /^[.]/, ge = /^[a-zA-Z1-8\-=]/, ie = /^[+#]/, Te = /^[!?]/, we = /^[^}]/, y = /^[^\r\n]/, S = /^[ \t\r\n]/, q = V("tag pair"), N = z("[", !1), H = z('"', !1), j = z("]", !1), G = V("tag name"), ne = se([["a", "z"], ["A", "Z"]], !1, !1), be = V("tag value"), Se = se(['"'], !0, !1), It = V("move number"), ke = se([["0", "9"]], !1, !1), Ot = z(".", !1), it = se(["."], !1, !1), $t = V("standard algebraic notation"), Rt = z("O-O-O", !1), Ft = z("O-O", !1), Lt = z("0-0-0", !1), Ht = z("0-0", !1), rt = se([["a", "z"], ["A", "Z"], ["1", "8"], "-", "="], !1, !1), xt = se(["+", "#"], !1, !1), Dt = V("suffix annotation"), nt = se(["!", "?"], !1, !1), zt = V("NAG"), Kt = z("$", !1), Ut = V("brace comment"), Bt = z("{", !1), ot = se(["}"], !0, !1), jt = z("}", !1), Wt = V("rest of line comment"), Yt = z(";", !1), at = se(["\r", `
`], !0, !1), Gt = V("variation"), Xt = z("(", !1), Qt = z(")", !1), Vt = V("game termination marker"), Jt = z("1-0", !1), Zt = z("0-1", !1), es = z("1/2-1/2", !1), ts = z("*", !1), ss = V("whitespace"), lt = se([" ", "	", "\r", `
`], !1, !1), is = function(c, g) {
    return Fs(c, g);
  }, rs = function(c) {
    return Object.fromEntries(c);
  }, ns = function(c, g) {
    return [c, g];
  }, os = function(c, g) {
    return { root: c, marker: g };
  }, as = function(c, g) {
    return Rs(Os(c), ...g.flat());
  }, ls = function(c, g, d, C, M) {
    return $s(c, g, d, C, M);
  }, hs = function(c) {
    return c;
  }, cs = function(c) {
    return c.replace(/[\r\n]+/g, " ");
  }, us = function(c) {
    return c.trim();
  }, fs = function(c) {
    return c;
  }, gs = function(c, g) {
    return { result: c, comment: g };
  }, u = e.peg$currPos | 0, de = [{ line: 1, column: 1 }], ee = u, qe = e.peg$maxFailExpected || [], w = e.peg$silentFails | 0, ye;
  if (e.startRule) {
    if (!(e.startRule in s))
      throw new Error(`Can't start parsing from rule "` + e.startRule + '".');
    r = s[e.startRule];
  }
  function z(c, g) {
    return { type: "literal", text: c, ignoreCase: g };
  }
  function se(c, g, d) {
    return { type: "class", parts: c, inverted: g, ignoreCase: d };
  }
  function ds() {
    return { type: "end" };
  }
  function V(c) {
    return { type: "other", description: c };
  }
  function ht(c) {
    var g = de[c], d;
    if (g)
      return g;
    if (c >= de.length)
      d = de.length - 1;
    else
      for (d = c; !de[--d]; )
        ;
    for (g = de[d], g = {
      line: g.line,
      column: g.column
    }; d < c; )
      h.charCodeAt(d) === 10 ? (g.line++, g.column = 1) : g.column++, d++;
    return de[c] = g, g;
  }
  function ct(c, g, d) {
    var C = ht(c), M = ht(g), O = {
      source: i,
      start: {
        offset: c,
        line: C.line,
        column: C.column
      },
      end: {
        offset: g,
        line: M.line,
        column: M.column
      }
    };
    return O;
  }
  function A(c) {
    u < ee || (u > ee && (ee = u, qe = []), qe.push(c));
  }
  function ms(c, g, d) {
    return new _e(
      _e.buildMessage(c, g),
      c,
      g,
      d
    );
  }
  function ut() {
    var c, g, d;
    return c = u, g = ps(), d = ws(), c = is(g, d), c;
  }
  function ps() {
    var c, g, d;
    for (c = u, g = [], d = ft(); d !== t; )
      g.push(d), d = ft();
    return d = W(), c = rs(g), c;
  }
  function ft() {
    var c, g, d, C, M, O, he;
    return w++, c = u, W(), h.charCodeAt(u) === 91 ? (g = o, u++) : (g = t, w === 0 && A(N)), g !== t ? (W(), d = vs(), d !== t ? (W(), h.charCodeAt(u) === 34 ? (C = n, u++) : (C = t, w === 0 && A(H)), C !== t ? (M = _s(), h.charCodeAt(u) === 34 ? (O = n, u++) : (O = t, w === 0 && A(H)), O !== t ? (W(), h.charCodeAt(u) === 93 ? (he = a, u++) : (he = t, w === 0 && A(j)), he !== t ? c = ns(d, M) : (u = c, c = t)) : (u = c, c = t)) : (u = c, c = t)) : (u = c, c = t)) : (u = c, c = t), w--, c === t && w === 0 && A(q), c;
  }
  function vs() {
    var c, g, d;
    if (w++, c = u, g = [], d = h.charAt(u), Q.test(d) ? u++ : (d = t, w === 0 && A(ne)), d !== t)
      for (; d !== t; )
        g.push(d), d = h.charAt(u), Q.test(d) ? u++ : (d = t, w === 0 && A(ne));
    else
      g = t;
    return g !== t ? c = h.substring(c, u) : c = g, w--, c === t && (g = t, w === 0 && A(G)), c;
  }
  function _s() {
    var c, g, d;
    for (w++, c = u, g = [], d = h.charAt(u), Z.test(d) ? u++ : (d = t, w === 0 && A(Se)); d !== t; )
      g.push(d), d = h.charAt(u), Z.test(d) ? u++ : (d = t, w === 0 && A(Se));
    return c = h.substring(c, u), w--, g = t, w === 0 && A(be), c;
  }
  function ws() {
    var c, g, d;
    return c = u, g = gt(), W(), d = Ps(), d === t && (d = null), W(), c = os(g, d), c;
  }
  function gt() {
    var c, g, d, C;
    for (c = u, g = xe(), g === t && (g = null), d = [], C = dt(); C !== t; )
      d.push(C), C = dt();
    return c = as(g, d), c;
  }
  function dt() {
    var c, g, d, C, M, O, he, Ne;
    if (c = u, W(), bs(), W(), g = Ss(), g !== t) {
      for (d = ys(), d === t && (d = null), C = [], M = mt(); M !== t; )
        C.push(M), M = mt();
      for (M = W(), O = xe(), O === t && (O = null), he = [], Ne = pt(); Ne !== t; )
        he.push(Ne), Ne = pt();
      c = ls(g, d, C, O, he);
    } else
      u = c, c = t;
    return c;
  }
  function bs() {
    var c, g, d, C, M, O;
    for (w++, c = u, g = [], d = h.charAt(u), re.test(d) ? u++ : (d = t, w === 0 && A(ke)); d !== t; )
      g.push(d), d = h.charAt(u), re.test(d) ? u++ : (d = t, w === 0 && A(ke));
    if (h.charCodeAt(u) === 46 ? (d = l, u++) : (d = t, w === 0 && A(Ot)), d !== t) {
      for (C = W(), M = [], O = h.charAt(u), fe.test(O) ? u++ : (O = t, w === 0 && A(it)); O !== t; )
        M.push(O), O = h.charAt(u), fe.test(O) ? u++ : (O = t, w === 0 && A(it));
      g = [g, d, C, M], c = g;
    } else
      u = c, c = t;
    return w--, c === t && (g = t, w === 0 && A(It)), c;
  }
  function Ss() {
    var c, g, d, C, M, O;
    if (w++, c = u, g = u, h.substr(u, 5) === f ? (d = f, u += 5) : (d = t, w === 0 && A(Rt)), d === t && (h.substr(u, 3) === p ? (d = p, u += 3) : (d = t, w === 0 && A(Ft)), d === t && (h.substr(u, 5) === v ? (d = v, u += 5) : (d = t, w === 0 && A(Lt)), d === t && (h.substr(u, 3) === _ ? (d = _, u += 3) : (d = t, w === 0 && A(Ht)), d === t))))
      if (d = u, C = h.charAt(u), Q.test(C) ? u++ : (C = t, w === 0 && A(ne)), C !== t) {
        if (M = [], O = h.charAt(u), ge.test(O) ? u++ : (O = t, w === 0 && A(rt)), O !== t)
          for (; O !== t; )
            M.push(O), O = h.charAt(u), ge.test(O) ? u++ : (O = t, w === 0 && A(rt));
        else
          M = t;
        M !== t ? (C = [C, M], d = C) : (u = d, d = t);
      } else
        u = d, d = t;
    return d !== t ? (C = h.charAt(u), ie.test(C) ? u++ : (C = t, w === 0 && A(xt)), C === t && (C = null), d = [d, C], g = d) : (u = g, g = t), g !== t ? c = h.substring(c, u) : c = g, w--, c === t && (g = t, w === 0 && A($t)), c;
  }
  function ys() {
    var c, g, d;
    for (w++, c = u, g = [], d = h.charAt(u), Te.test(d) ? u++ : (d = t, w === 0 && A(nt)); d !== t; )
      g.push(d), g.length >= 2 ? d = t : (d = h.charAt(u), Te.test(d) ? u++ : (d = t, w === 0 && A(nt)));
    return g.length < 1 ? (u = c, c = t) : c = g, w--, c === t && (g = t, w === 0 && A(Dt)), c;
  }
  function mt() {
    var c, g, d, C, M;
    if (w++, c = u, W(), h.charCodeAt(u) === 36 ? (g = m, u++) : (g = t, w === 0 && A(Kt)), g !== t) {
      if (d = u, C = [], M = h.charAt(u), re.test(M) ? u++ : (M = t, w === 0 && A(ke)), M !== t)
        for (; M !== t; )
          C.push(M), M = h.charAt(u), re.test(M) ? u++ : (M = t, w === 0 && A(ke));
      else
        C = t;
      C !== t ? d = h.substring(d, u) : d = C, d !== t ? c = hs(d) : (u = c, c = t);
    } else
      u = c, c = t;
    return w--, c === t && w === 0 && A(zt), c;
  }
  function xe() {
    var c;
    return c = As(), c === t && (c = Cs()), c;
  }
  function As() {
    var c, g, d, C, M;
    if (w++, c = u, h.charCodeAt(u) === 123 ? (g = k, u++) : (g = t, w === 0 && A(Bt)), g !== t) {
      for (d = u, C = [], M = h.charAt(u), we.test(M) ? u++ : (M = t, w === 0 && A(ot)); M !== t; )
        C.push(M), M = h.charAt(u), we.test(M) ? u++ : (M = t, w === 0 && A(ot));
      d = h.substring(d, u), h.charCodeAt(u) === 125 ? (C = P, u++) : (C = t, w === 0 && A(jt)), C !== t ? c = cs(d) : (u = c, c = t);
    } else
      u = c, c = t;
    return w--, c === t && (g = t, w === 0 && A(Ut)), c;
  }
  function Cs() {
    var c, g, d, C, M;
    if (w++, c = u, h.charCodeAt(u) === 59 ? (g = b, u++) : (g = t, w === 0 && A(Yt)), g !== t) {
      for (d = u, C = [], M = h.charAt(u), y.test(M) ? u++ : (M = t, w === 0 && A(at)); M !== t; )
        C.push(M), M = h.charAt(u), y.test(M) ? u++ : (M = t, w === 0 && A(at));
      d = h.substring(d, u), c = us(d);
    } else
      u = c, c = t;
    return w--, c === t && (g = t, w === 0 && A(Wt)), c;
  }
  function pt() {
    var c, g, d, C;
    return w++, c = u, W(), h.charCodeAt(u) === 40 ? (g = I, u++) : (g = t, w === 0 && A(Xt)), g !== t ? (d = gt(), d !== t ? (W(), h.charCodeAt(u) === 41 ? (C = $, u++) : (C = t, w === 0 && A(Qt)), C !== t ? c = fs(d) : (u = c, c = t)) : (u = c, c = t)) : (u = c, c = t), w--, c === t && w === 0 && A(Gt), c;
  }
  function Ps() {
    var c, g, d;
    return w++, c = u, h.substr(u, 3) === Y ? (g = Y, u += 3) : (g = t, w === 0 && A(Jt)), g === t && (h.substr(u, 3) === R ? (g = R, u += 3) : (g = t, w === 0 && A(Zt)), g === t && (h.substr(u, 7) === F ? (g = F, u += 7) : (g = t, w === 0 && A(es)), g === t && (h.charCodeAt(u) === 42 ? (g = te, u++) : (g = t, w === 0 && A(ts))))), g !== t ? (W(), d = xe(), d === t && (d = null), c = gs(g, d)) : (u = c, c = t), w--, c === t && (g = t, w === 0 && A(Vt)), c;
  }
  function W() {
    var c, g;
    for (w++, c = [], g = h.charAt(u), S.test(g) ? u++ : (g = t, w === 0 && A(lt)); g !== t; )
      c.push(g), g = h.charAt(u), S.test(g) ? u++ : (g = t, w === 0 && A(lt));
    return w--, g = t, w === 0 && A(ss), c;
  }
  if (ye = r(), e.peg$library)
    return (
      /** @type {any} */
      {
        peg$result: ye,
        peg$currPos: u,
        peg$FAILED: t,
        peg$maxFailExpected: qe,
        peg$maxFailPos: ee
      }
    );
  if (ye !== t && u === h.length)
    return ye;
  throw ye !== t && u < h.length && A(ds()), ms(
    qe,
    ee < h.length ? h.charAt(ee) : null,
    ee < h.length ? ct(ee, ee + 1) : ct(ee, ee)
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
const $e = 0xffffffffffffffffn;
function Ke(h, e) {
  return (h << e | h >> 64n - e) & 0xffffffffffffffffn;
}
function bt(h, e) {
  return h * e & $e;
}
function xs(h) {
  return function() {
    let e = BigInt(h & $e), t = BigInt(h >> 64n & $e);
    const i = bt(Ke(bt(e, 5n), 7n), 9n);
    return t ^= e, e = (Ke(e, 24n) ^ t ^ t << 16n) & $e, t = Ke(t, 37n), h = t << 64n | e, i;
  };
}
const Le = xs(0xa187eb39cdcaed8f31c4b365b102e01en), Ds = Array.from({ length: 2 }, () => Array.from({ length: 6 }, () => Array.from({ length: 128 }, () => Le()))), zs = Array.from({ length: 8 }, () => Le()), Ks = Array.from({ length: 16 }, () => Le()), Ue = Le(), B = "w", X = "b", x = "p", Ve = "n", Re = "b", Me = "r", le = "q", D = "k", Be = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
class Ie {
  constructor(e, t) {
    L(this, "color");
    L(this, "from");
    L(this, "to");
    L(this, "piece");
    L(this, "captured");
    L(this, "promotion");
    /**
     * @deprecated This field is deprecated and will be removed in version 2.0.0.
     * Please use move descriptor functions instead: `isCapture`, `isPromotion`,
     * `isEnPassant`, `isKingsideCastle`, `isQueensideCastle`, `isCastle`, and
     * `isBigPawn`
     */
    L(this, "flags");
    L(this, "san");
    L(this, "lan");
    L(this, "before");
    L(this, "after");
    const { color: i, piece: s, from: r, to: o, flags: n, captured: a, promotion: l } = t, f = K(r), p = K(o);
    this.color = i, this.piece = s, this.from = f, this.to = p, this.san = e._moveToSan(t, e._moves({ legal: !0 })), this.lan = f + p, this.before = e.fen(), e._makeMove(t), this.after = e.fen(), e._undoMove(), this.flags = "";
    for (const v in T)
      T[v] & n && (this.flags += ce[v]);
    a && (this.captured = a), l && (this.promotion = l, this.lan += l);
  }
  isCapture() {
    return this.flags.indexOf(ce.CAPTURE) > -1;
  }
  isPromotion() {
    return this.flags.indexOf(ce.PROMOTION) > -1;
  }
  isEnPassant() {
    return this.flags.indexOf(ce.EP_CAPTURE) > -1;
  }
  isKingsideCastle() {
    return this.flags.indexOf(ce.KSIDE_CASTLE) > -1;
  }
  isQueensideCastle() {
    return this.flags.indexOf(ce.QSIDE_CASTLE) > -1;
  }
  isBigPawn() {
    return this.flags.indexOf(ce.BIG_PAWN) > -1;
  }
}
const U = -1, ce = {
  NORMAL: "n",
  CAPTURE: "c",
  BIG_PAWN: "b",
  EP_CAPTURE: "e",
  PROMOTION: "p",
  KSIDE_CASTLE: "k",
  QSIDE_CASTLE: "q",
  NULL_MOVE: "-"
}, St = [
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
], T = {
  NORMAL: 1,
  CAPTURE: 2,
  BIG_PAWN: 4,
  EP_CAPTURE: 8,
  PROMOTION: 16,
  KSIDE_CASTLE: 32,
  QSIDE_CASTLE: 64,
  NULL_MOVE: 128
}, Je = {
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
  ...Je,
  ...Us
}, E = {
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
}, je = {
  b: [16, 32, 17, 15],
  w: [-16, -32, -17, -15]
}, yt = {
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
], Ys = { p: 1, n: 2, b: 4, r: 8, q: 16, k: 32 }, Gs = "pnbrqkPNBRQK", At = [Ve, Re, Me, le], Xs = 7, Qs = 6, Vs = 1, Js = 0, Oe = {
  [D]: T.KSIDE_CASTLE,
  [le]: T.QSIDE_CASTLE
}, oe = {
  w: [
    { square: E.a1, flag: T.QSIDE_CASTLE },
    { square: E.h1, flag: T.KSIDE_CASTLE }
  ],
  b: [
    { square: E.a8, flag: T.QSIDE_CASTLE },
    { square: E.h8, flag: T.KSIDE_CASTLE }
  ]
}, Zs = { b: Vs, w: Qs }, We = "--";
function ue(h) {
  return h >> 4;
}
function Ee(h) {
  return h & 15;
}
function Nt(h) {
  return "0123456789".indexOf(h) !== -1;
}
function K(h) {
  const e = Ee(h), t = ue(h);
  return "abcdefgh".substring(e, e + 1) + "87654321".substring(t, t + 1);
}
function Pe(h) {
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
      if (Nt(s[o][l])) {
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
    const f = e[a].from, p = e[a].to, v = e[a].piece;
    s === v && t !== f && i === p && (r++, ue(t) === ue(f) && o++, Ee(t) === Ee(f) && n++);
  }
  return r > 0 ? o > 0 && n > 0 ? K(t) : n > 0 ? K(t).charAt(1) : K(t).charAt(0) : "";
}
function ae(h, e, t, i, s, r = void 0, o = T.NORMAL) {
  const n = ue(i);
  if (s === x && (n === Xs || n === Js))
    for (let a = 0; a < At.length; a++) {
      const l = At[a];
      h.push({
        color: e,
        from: t,
        to: i,
        piece: s,
        captured: r,
        promotion: l,
        flags: o | T.PROMOTION
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
function Ct(h) {
  let e = h.charAt(0);
  return e >= "a" && e <= "h" ? h.match(/[a-h]\d.*[a-h]\d/) ? void 0 : x : (e = e.toLowerCase(), e === "o" ? D : e);
}
function Ye(h) {
  return h.replace(/=/, "").replace(/[+#]?[?!]*$/, "");
}
class Ge {
  constructor(e = Be, { skipValidation: t = !1 } = {}) {
    L(this, "_board", new Array(128));
    L(this, "_turn", B);
    L(this, "_header", {});
    L(this, "_kings", { w: U, b: U });
    L(this, "_epSquare", -1);
    L(this, "_halfMoves", 0);
    L(this, "_moveNumber", 0);
    L(this, "_history", []);
    L(this, "_comments", {});
    L(this, "_castling", { w: 0, b: 0 });
    L(this, "_hash", 0n);
    // tracks number of times a position has been seen for repetition checking
    L(this, "_positionCount", /* @__PURE__ */ new Map());
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
      else if (Nt(a))
        o += parseInt(a, 10);
      else {
        const l = a < "a" ? B : X;
        this._put({ type: a.toLowerCase(), color: l }, K(o)), o++;
      }
    }
    this._turn = s[1], s[2].indexOf("K") > -1 && (this._castling.w |= T.KSIDE_CASTLE), s[2].indexOf("Q") > -1 && (this._castling.w |= T.QSIDE_CASTLE), s[2].indexOf("k") > -1 && (this._castling.b |= T.KSIDE_CASTLE), s[2].indexOf("q") > -1 && (this._castling.b |= T.QSIDE_CASTLE), this._epSquare = s[3] === "-" ? U : E[s[3]], this._halfMoves = parseInt(s[4], 10), this._moveNumber = parseInt(s[5], 10), this._hash = this._computeHash(), this._updateSetup(e), this._incPositionCount();
  }
  fen({ forceEnpassantSquare: e = !1 } = {}) {
    var o, n;
    let t = 0, i = "";
    for (let a = E.a8; a <= E.h1; a++) {
      if (this._board[a]) {
        t > 0 && (i += t, t = 0);
        const { color: l, type: f } = this._board[a];
        i += l === B ? f.toUpperCase() : f.toLowerCase();
      } else
        t++;
      a + 1 & 136 && (t > 0 && (i += t), a !== E.h1 && (i += "/"), t = 0, a += 8);
    }
    let s = "";
    this._castling[B] & T.KSIDE_CASTLE && (s += "K"), this._castling[B] & T.QSIDE_CASTLE && (s += "Q"), this._castling[X] & T.KSIDE_CASTLE && (s += "k"), this._castling[X] & T.QSIDE_CASTLE && (s += "q"), s = s || "-";
    let r = "-";
    if (this._epSquare !== U)
      if (e)
        r = K(this._epSquare);
      else {
        const a = this._epSquare + (this._turn === B ? 16 : -16), l = [a + 1, a - 1];
        for (const f of l) {
          if (f & 136)
            continue;
          const p = this._turn;
          if (((o = this._board[f]) == null ? void 0 : o.color) === p && ((n = this._board[f]) == null ? void 0 : n.type) === x) {
            this._makeMove({
              color: p,
              from: f,
              to: this._epSquare,
              piece: x,
              captured: x,
              flags: T.EP_CAPTURE
            });
            const v = !this._isKingAttacked(p);
            if (this._undoMove(), v) {
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
    for (let t = E.a8; t <= E.h1; t++) {
      if (t & 136) {
        t += 7;
        continue;
      }
      this._board[t] && (e ^= this._pieceKey(t));
    }
    return e ^= this._epKey(), e ^= this._castlingKey(), this._turn === "b" && (e ^= Ue), e;
  }
  /*
   * Called when the initial board setup is changed with put() or remove().
   * modifies the SetUp and FEN properties of the header object. If the FEN
   * is equal to the default position, the SetUp and FEN are deleted the setup
   * is only updated if history.length is zero, ie moves haven't been made.
   */
  _updateSetup(e) {
    this._history.length > 0 || (e !== Be ? (this._header.SetUp = "1", this._header.FEN = e) : (this._header.SetUp = null, this._header.FEN = null));
  }
  reset() {
    this.load(Be);
  }
  get(e) {
    return this._board[E[e]];
  }
  findPiece(e) {
    var i;
    const t = [];
    for (let s = E.a8; s <= E.h1; s++) {
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
    if (Gs.indexOf(e.toLowerCase()) === -1 || !(i in E))
      return !1;
    const s = E[i];
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
    return this._clear(E[e]), t && t.type === D && (this._kings[t.color] = U), this._updateCastlingRights(), this._updateEnPassantSquare(), this._updateSetup(this.fen()), t;
  }
  _updateCastlingRights() {
    var i, s, r, o, n, a, l, f, p, v, _, m;
    this._hash ^= this._castlingKey();
    const e = ((i = this._board[E.e1]) == null ? void 0 : i.type) === D && ((s = this._board[E.e1]) == null ? void 0 : s.color) === B, t = ((r = this._board[E.e8]) == null ? void 0 : r.type) === D && ((o = this._board[E.e8]) == null ? void 0 : o.color) === X;
    (!e || ((n = this._board[E.a1]) == null ? void 0 : n.type) !== Me || ((a = this._board[E.a1]) == null ? void 0 : a.color) !== B) && (this._castling.w &= -65), (!e || ((l = this._board[E.h1]) == null ? void 0 : l.type) !== Me || ((f = this._board[E.h1]) == null ? void 0 : f.color) !== B) && (this._castling.w &= -33), (!t || ((p = this._board[E.a8]) == null ? void 0 : p.type) !== Me || ((v = this._board[E.a8]) == null ? void 0 : v.color) !== X) && (this._castling.b &= -65), (!t || ((_ = this._board[E.h8]) == null ? void 0 : _.type) !== Me || ((m = this._board[E.h8]) == null ? void 0 : m.color) !== X) && (this._castling.b &= -33), this._hash ^= this._castlingKey();
  }
  _updateEnPassantSquare() {
    var r, o;
    if (this._epSquare === U)
      return;
    const e = this._epSquare + (this._turn === B ? -16 : 16), t = this._epSquare + (this._turn === B ? 16 : -16), i = [t + 1, t - 1];
    if (this._board[e] !== null || this._board[this._epSquare] !== null || ((r = this._board[t]) == null ? void 0 : r.color) !== Pe(this._turn) || ((o = this._board[t]) == null ? void 0 : o.type) !== x) {
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
    for (let r = E.a8; r <= E.h1; r++) {
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
        let f = r + l, p = !1;
        for (; f !== t; ) {
          if (this._board[f] != null) {
            p = !0;
            break;
          }
          f += l;
        }
        if (!p)
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
    return t ? this._attacked(t, E[e], !0) : this._attacked(this._turn, E[e], !0);
  }
  _isKingAttacked(e) {
    const t = this._kings[e];
    return t === -1 ? !1 : this._attacked(Pe(e), t);
  }
  hash() {
    return this._hash.toString(16);
  }
  isAttacked(e, t) {
    return this._attacked(t, E[e]);
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
    for (let r = E.a8; r <= E.h1; r++) {
      if (s = (s + 1) % 2, r & 136) {
        r += 7;
        continue;
      }
      const o = this._board[r];
      o && (e[o.type] = o.type in e ? e[o.type] + 1 : 1, o.type === Re && t.push(s), i++);
    }
    if (i === 2)
      return !0;
    if (
      // k vs. kn .... or .... k vs. kb
      i === 3 && (e[Re] === 1 || e[Ve] === 1)
    )
      return !0;
    if (i === e[Re] + 2) {
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
    return e ? s.map((r) => new Ie(this, r)) : s.map((r) => this._moveToSan(r, s));
  }
  _moves({ legal: e = !0, piece: t = void 0, square: i = void 0 } = {}) {
    var _;
    const s = i ? i.toLowerCase() : void 0, r = t == null ? void 0 : t.toLowerCase(), o = [], n = this._turn, a = Pe(n);
    let l = E.a8, f = E.h1, p = !1;
    if (s)
      if (s in E)
        l = f = E[s], p = !0;
      else
        return [];
    for (let m = l; m <= f; m++) {
      if (m & 136) {
        m += 7;
        continue;
      }
      if (!this._board[m] || this._board[m].color === a)
        continue;
      const { type: k } = this._board[m];
      let P;
      if (k === x) {
        if (r && r !== k)
          continue;
        P = m + je[n][0], this._board[P] || (ae(o, n, m, P, x), P = m + je[n][1], Zs[n] === ue(m) && !this._board[P] && ae(o, n, m, P, x, void 0, T.BIG_PAWN));
        for (let b = 2; b < 4; b++)
          P = m + je[n][b], !(P & 136) && (((_ = this._board[P]) == null ? void 0 : _.color) === a ? ae(o, n, m, P, x, this._board[P].type, T.CAPTURE) : P === this._epSquare && ae(o, n, m, P, x, x, T.EP_CAPTURE));
      } else {
        if (r && r !== k)
          continue;
        for (let b = 0, I = yt[k].length; b < I; b++) {
          const $ = yt[k][b];
          for (P = m; P += $, !(P & 136); ) {
            if (!this._board[P])
              ae(o, n, m, P, k);
            else {
              if (this._board[P].color === n)
                break;
              ae(o, n, m, P, k, this._board[P].type, T.CAPTURE);
              break;
            }
            if (k === Ve || k === D)
              break;
          }
        }
      }
    }
    if ((r === void 0 || r === D) && (!p || f === this._kings[n])) {
      if (this._castling[n] & T.KSIDE_CASTLE) {
        const m = this._kings[n], k = m + 2;
        !this._board[m + 1] && !this._board[k] && !this._attacked(a, this._kings[n]) && !this._attacked(a, m + 1) && !this._attacked(a, k) && ae(o, n, this._kings[n], k, D, void 0, T.KSIDE_CASTLE);
      }
      if (this._castling[n] & T.QSIDE_CASTLE) {
        const m = this._kings[n], k = m - 2;
        !this._board[m - 1] && !this._board[m - 2] && !this._board[m - 3] && !this._attacked(a, this._kings[n]) && !this._attacked(a, m - 1) && !this._attacked(a, k) && ae(o, n, this._kings[n], k, D, void 0, T.QSIDE_CASTLE);
      }
    }
    if (!e || this._kings[n] === -1)
      return o;
    const v = [];
    for (let m = 0, k = o.length; m < k; m++)
      this._makeMove(o[m]), this._isKingAttacked(n) || v.push(o[m]), this._undoMove();
    return v;
  }
  move(e, { strict: t = !1 } = {}) {
    let i = null;
    if (typeof e == "string")
      i = this._moveFromSan(e, t);
    else if (e === null)
      i = this._moveFromSan(We, t);
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
    if (this.isCheck() && i.flags & T.NULL_MOVE)
      throw new Error("Null move not allowed when in check");
    const s = new Ie(this, i);
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
    const t = this._turn, i = Pe(t);
    if (this._push(e), e.flags & T.NULL_MOVE) {
      t === X && this._moveNumber++, this._halfMoves++, this._turn = i, this._epSquare = U;
      return;
    }
    if (this._hash ^= this._epKey(), this._hash ^= this._castlingKey(), e.captured && (this._hash ^= this._pieceKey(e.to)), this._movePiece(e.from, e.to), e.flags & T.EP_CAPTURE && (this._turn === X ? this._clear(e.to - 16) : this._clear(e.to + 16)), e.promotion && (this._clear(e.to), this._set(e.to, { type: e.promotion, color: t })), this._board[e.to].type === D) {
      if (this._kings[t] = e.to, e.flags & T.KSIDE_CASTLE) {
        const a = e.to - 1, l = e.to + 1;
        this._movePiece(l, a);
      } else if (e.flags & T.QSIDE_CASTLE) {
        const a = e.to + 1, l = e.to - 2;
        this._movePiece(l, a);
      }
      this._castling[t] = 0;
    }
    if (this._castling[t]) {
      for (let a = 0, l = oe[t].length; a < l; a++)
        if (e.from === oe[t][a].square && this._castling[t] & oe[t][a].flag) {
          this._castling[t] ^= oe[t][a].flag;
          break;
        }
    }
    if (this._castling[i]) {
      for (let a = 0, l = oe[i].length; a < l; a++)
        if (e.to === oe[i][a].square && this._castling[i] & oe[i][a].flag) {
          this._castling[i] ^= oe[i][a].flag;
          break;
        }
    }
    if (this._hash ^= this._castlingKey(), e.flags & T.BIG_PAWN) {
      let a;
      t === X ? a = e.to - 16 : a = e.to + 16, !(e.to - 1 & 136) && ((s = this._board[e.to - 1]) == null ? void 0 : s.type) === x && ((r = this._board[e.to - 1]) == null ? void 0 : r.color) === i || !(e.to + 1 & 136) && ((o = this._board[e.to + 1]) == null ? void 0 : o.type) === x && ((n = this._board[e.to + 1]) == null ? void 0 : n.color) === i ? (this._epSquare = a, this._hash ^= this._epKey()) : this._epSquare = U;
    } else
      this._epSquare = U;
    e.piece === x ? this._halfMoves = 0 : e.flags & (T.CAPTURE | T.EP_CAPTURE) ? this._halfMoves = 0 : this._halfMoves++, t === X && this._moveNumber++, this._turn = i, this._hash ^= Ue;
  }
  undo() {
    const e = this._hash, t = this._undoMove();
    if (t) {
      const i = new Ie(this, t);
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
    this._kings = e.kings, this._turn = e.turn, this._castling = e.castling, this._epSquare = e.epSquare, this._halfMoves = e.halfMoves, this._moveNumber = e.moveNumber, this._hash ^= this._epKey(), this._hash ^= this._castlingKey(), this._hash ^= Ue;
    const i = this._turn, s = Pe(i);
    if (t.flags & T.NULL_MOVE)
      return t;
    if (this._movePiece(t.to, t.from), t.piece && (this._clear(t.from), this._set(t.from, { type: t.piece, color: i })), t.captured)
      if (t.flags & T.EP_CAPTURE) {
        let r;
        i === X ? r = t.to - 16 : r = t.to + 16, this._set(r, { type: x, color: s });
      } else
        this._set(t.to, { type: t.captured, color: s });
    if (t.flags & (T.KSIDE_CASTLE | T.QSIDE_CASTLE)) {
      let r, o;
      t.flags & T.KSIDE_CASTLE ? (r = t.to + 1, o = t.to - 1) : (r = t.to - 2, o = t.to + 1), this._movePiece(o, r);
    }
    return t;
  }
  pgn({ newline: e = `
`, maxWidth: t = 0 } = {}) {
    const i = [];
    let s = !1;
    for (const v in this._header)
      this._header[v] && i.push(`[${v} "${this._header[v]}"]` + e), s = !0;
    s && this._history.length && i.push(e);
    const r = (v) => {
      const _ = this._comments[this.fen()];
      if (typeof _ < "u") {
        const m = v.length > 0 ? " " : "";
        v = `${v}${m}{${_}}`;
      }
      return v;
    }, o = [];
    for (; this._history.length > 0; )
      o.push(this._undoMove());
    const n = [];
    let a = "";
    for (o.length === 0 && n.push(r("")); o.length > 0; ) {
      a = r(a);
      const v = o.pop();
      if (!v)
        break;
      if (!this._history.length && v.color === "b") {
        const _ = `${this._moveNumber}. ...`;
        a = a ? `${a} ${_}` : _;
      } else v.color === "w" && (a.length && n.push(a), a = this._moveNumber + ".");
      a = a + " " + this._moveToSan(v, this._moves({ legal: !0 })), this._makeMove(v);
    }
    if (a.length && n.push(r(a)), n.push(this._header.Result || "*"), t === 0)
      return i.join("") + n.join(" ");
    const l = function() {
      return i.length > 0 && i[i.length - 1] === " " ? (i.pop(), !0) : !1;
    }, f = function(v, _) {
      for (const m of _.split(" "))
        if (m) {
          if (v + m.length > t) {
            for (; l(); )
              v--;
            i.push(e), v = 0;
          }
          i.push(m), v += m.length, i.push(" "), v++;
        }
      return l() && v--, v;
    };
    let p = 0;
    for (let v = 0; v < n.length; v++) {
      if (p + n[v].length > t && n[v].includes("{")) {
        p = f(p, n[v]);
        continue;
      }
      p + n[v].length > t && v !== 0 ? (i[i.length - 1] === " " && i.pop(), i.push(e), p = 0) : v !== 0 && (i.push(" "), p++), i.push(n[v]), p += n[v].length;
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
    return this._header[e] = t ?? Je[e] ?? null, this.getHeaders();
  }
  removeHeader(e) {
    return e in this._header ? (this._header[e] = Je[e] || null, !0) : !1;
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
    const s = Hs(e);
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
    if (e.flags & T.KSIDE_CASTLE)
      i = "O-O";
    else if (e.flags & T.QSIDE_CASTLE)
      i = "O-O-O";
    else {
      if (e.flags & T.NULL_MOVE)
        return We;
      if (e.piece !== x) {
        const s = ti(e, t);
        i += e.piece.toUpperCase() + s;
      }
      e.flags & (T.CAPTURE | T.EP_CAPTURE) && (e.piece === x && (i += K(e.from)[0]), i += "x"), i += K(e.to), e.promotion && (i += "=" + e.promotion.toUpperCase());
    }
    return this._makeMove(e), this.isCheck() && (this.isCheckmate() ? i += "#" : i += "+"), this._undoMove(), i;
  }
  // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
  _moveFromSan(e, t = !1) {
    let i = Ye(e);
    if (t || (i === "0-0" ? i = "O-O" : i === "0-0-0" && (i = "O-O-O")), i == We)
      return {
        color: this._turn,
        from: 0,
        to: 0,
        piece: "k",
        flags: T.NULL_MOVE
      };
    let s = Ct(i), r = this._moves({ legal: !0, piece: s });
    for (let v = 0, _ = r.length; v < _; v++)
      if (i === Ye(this._moveToSan(r[v], r)))
        return r[v];
    if (t)
      return null;
    let o, n, a, l, f, p = !1;
    if (n = i.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/), n ? (o = n[1], a = n[2], l = n[3], f = n[4], a.length == 1 && (p = !0)) : (n = i.match(/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/), n && (o = n[1], a = n[2], l = n[3], f = n[4], a.length == 1 && (p = !0))), s = Ct(i), r = this._moves({
      legal: !0,
      piece: o || s
    }), !l)
      return null;
    for (let v = 0, _ = r.length; v < _; v++)
      if (a) {
        if ((!o || o.toLowerCase() == r[v].piece) && E[a] == r[v].from && E[l] == r[v].to && (!f || f.toLowerCase() == r[v].promotion))
          return r[v];
        if (p) {
          const m = K(r[v].from);
          if ((!o || o.toLowerCase() == r[v].piece) && E[l] == r[v].to && (a == m[0] || a == m[1]) && (!f || f.toLowerCase() == r[v].promotion))
            return r[v];
        }
      } else if (i === Ye(this._moveToSan(r[v], r)).replace("x", ""))
        return r[v];
    return null;
  }
  ascii() {
    let e = `   +------------------------+
`;
    for (let t = E.a8; t <= E.h1; t++) {
      if (Ee(t) === 0 && (e += " " + "87654321"[ue(t)] + " |"), this._board[t]) {
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
    for (let i = E.a8; i <= E.h1; i++)
      this._board[i] == null ? t.push(null) : t.push({
        square: K(i),
        type: this._board[i].type,
        color: this._board[i].color
      }), i + 1 & 136 && (e.push(t), t = [], i += 8);
    return e;
  }
  squareColor(e) {
    if (e in E) {
      const t = E[e];
      return (ue(t) + Ee(t)) % 2 === 0 ? "light" : "dark";
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
      e ? i.push(new Ie(this, s)) : i.push(this._moveToSan(s, this._moves())), this._makeMove(s);
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
    for (const s of [D, le])
      t[s] !== void 0 && (t[s] ? this._castling[e] |= Oe[s] : this._castling[e] &= ~Oe[s]);
    this._updateCastlingRights();
    const i = this.getCastlingRights(e);
    return (t[D] === void 0 || t[D] === i[D]) && (t[le] === void 0 || t[le] === i[le]);
  }
  getCastlingRights(e) {
    return {
      [D]: (this._castling[e] & Oe[D]) !== 0,
      [le]: (this._castling[e] & Oe[le]) !== 0
    };
  }
  moveNumber() {
    return this._moveNumber;
  }
}
const si = /%cal\s+([^%\s]+)/g, ii = /%csl\s+([^%\s]+)/g, Pt = /%(?:cal|csl)\s+[^%\s]+/, ri = /^[a-h][1-8]$/, Xe = {
  R: "#ff0000",
  // Red
  G: "#00ff00",
  // Green
  Y: "#ffff00",
  // Yellow
  B: "#0000ff"
  // Blue
};
class J {
  /**
   * Check if a comment contains visual annotations
   */
  static hasVisualAnnotations(e) {
    return Pt.test(e);
  }
  /**
   * Parse visual annotations from a PGN comment
   */
  static parseComment(e) {
    let t = e.startsWith("{") && e.endsWith("}") ? e.substring(1, e.length - 1) : e;
    const i = [], s = [], r = [...t.matchAll(si)];
    for (const a of r) {
      const l = a[1].split(",");
      for (const f of l) {
        const p = f.trim();
        if (p.length >= 5) {
          const v = p[0], _ = p.slice(1, 3), m = p.slice(3, 5);
          J.isValidSquare(_) && J.isValidSquare(m) && i.push({
            from: _,
            to: m,
            color: J.colorToHex(v)
          });
        }
      }
      t = t.replace(a[0], " ");
    }
    const o = [...t.matchAll(ii)];
    for (const a of o) {
      const l = a[1].split(",");
      for (const f of l) {
        const p = f.trim();
        if (p.length >= 3) {
          const v = p[0], _ = p.slice(1, 3);
          J.isValidSquare(_) && s.push({
            square: _,
            type: "circle",
            // Cast to avoid type issues
            color: J.colorToHex(v)
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
    return e.replace(new RegExp(Pt.source, "g"), "").replace(/\s+/g, " ").trim();
  }
  /**
   * Create annotation string from arrows and circles
   */
  static fromDrawingObjects(e, t) {
    const i = [];
    if (e.length > 0) {
      const s = e.map((r) => `${J.hexToColor(r.color)}${r.from}${r.to}`).join(",");
      i.push(`%cal ${s}`);
    }
    if (t.length > 0) {
      const s = t.map((r) => `${J.hexToColor(r.color)}${r.square}`).join(",");
      i.push(`%csl ${s}`);
    }
    return i.join(" ");
  }
  /**
   * Convert color code to hex color
   */
  static colorToHex(e) {
    return Xe[e] || Xe.R;
  }
  /**
   * Convert hex color to color code
   */
  static hexToColor(e) {
    for (const [t, i] of Object.entries(Xe))
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
class st {
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
        const f = l && !["1-0", "0-1", "1/2-1/2", "*"].includes(l) ? l : void 0;
        this.addMove(n, a, f);
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
    const i = new st();
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
        const f = J.parseComment(o);
        l.whiteComment = o, l.whiteAnnotations = {
          arrows: f.arrows,
          circles: f.highlights,
          textComment: f.textComment
        };
      }
      if (n && a) {
        const f = J.parseComment(a);
        l.blackComment = a, l.blackAnnotations = {
          arrows: f.arrows,
          circles: f.highlights,
          textComment: f.textComment
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
          const a = J.fromDrawingObjects(
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
          const a = J.fromDrawingObjects(
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
class He {
  getFenParts(e) {
    const i = (e ?? this.chess.fen()).trim().split(/\s+/);
    return i.length < 6 ? i.concat(new Array(6 - i.length).fill("")) : i;
  }
  getChessInstance() {
    return this.chess;
  }
  constructor(e) {
    this.chess = new Ge(e), this.pgnNotation = new st();
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
      return new Ge(this.chess.fen()).move({
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
    return St.filter((t) => this.chess.isAttacked(t, e)).map(
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
    if (!St.includes(i))
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
    return new He(this.chess.fen());
  }
  /**
   * Valider un FEN
   */
  static isValidFEN(e) {
    try {
      return new Ge().load(e), !0;
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
const pe = {
  color: "rgba(34, 197, 94, 0.6)",
  width: 2,
  opacity: 0.8
}, Mt = {
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
}, ve = [
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
}, Et = "rgba(255, 255, 0, 0.5)";
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
  addArrow(e, t, i = pe.color, s = pe.width, r = pe.opacity) {
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
    const t = e.color ?? pe.color, i = e.width ?? pe.width, s = e.opacity ?? pe.opacity, r = e.knightMove ?? this.isKnightMove(e.from, e.to);
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
    const f = "rgba(240, 217, 181, 0.7)", p = "rgba(181, 136, 99, 0.7)", v = e === "white" ? 0 : 7, _ = e === "white" ? 0 : 7;
    s.textAlign = "left", s.textBaseline = "alphabetic";
    for (let m = 0; m < 8; m++) {
      const k = e === "white" ? m : 7 - m, P = String.fromCharCode(97 + k), b = m * r + a, I = o - a, $ = (k + v) % 2 === 0;
      s.fillStyle = $ ? f : p, s.fillText(P, b, I);
    }
    s.textBaseline = "middle";
    for (let m = 0; m < 8; m++) {
      const k = e === "white" ? m : 7 - m, P = (k + 1).toString(), b = l, I = o - (m + 0.5) * r, $ = (_ + k) % 2 === 0;
      s.fillStyle = $ ? f : p, s.fillText(P, b, I);
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
    const [i, s] = this.squareToCoords(t.from), [r, o] = this.squareToCoords(t.to), n = i + this.squareSize / 2, a = s + this.squareSize / 2, l = r + this.squareSize / 2, f = o + this.squareSize / 2, p = l - n, v = f - a, _ = Math.atan2(v, p), m = this.squareSize * 0.25, k = n + Math.cos(_) * m, P = a + Math.sin(_) * m, b = l - Math.cos(_) * m, I = f - Math.sin(_) * m, $ = this.applyArrowStyle(e, t);
    e.beginPath(), e.moveTo(k, P), e.lineTo(b, I), e.stroke();
    const Y = $ * 3, R = Math.PI / 6;
    e.beginPath(), e.moveTo(b, I), e.lineTo(
      b - Y * Math.cos(_ - R),
      I - Y * Math.sin(_ - R)
    ), e.lineTo(
      b - Y * Math.cos(_ + R),
      I - Y * Math.sin(_ + R)
    ), e.closePath(), e.fill();
  }
  drawKnightArrow(e, t) {
    const [i, s] = this.squareToCoords(t.from), [r, o] = this.squareToCoords(t.to), n = i + this.squareSize / 2, a = s + this.squareSize / 2, l = r + this.squareSize / 2, f = o + this.squareSize / 2, p = l - n, v = f - a, _ = Math.abs(p), m = Math.abs(v);
    let k, P;
    _ > m ? (k = l, P = a) : (k = n, P = f);
    const b = this.applyArrowStyle(e, t), I = this.squareSize * 0.2;
    let $ = n, Y = a, R = l, F = f;
    _ > m ? ($ += p > 0 ? I : -I, R += p > 0 ? -I : I) : (Y += v > 0 ? I : -I, F += v > 0 ? -I : I), e.beginPath(), e.moveTo($, Y), e.lineTo(k, P), e.lineTo(R, F), e.stroke();
    const te = b * 3, Q = Math.PI / 6;
    let Z;
    _ > m ? Z = v > 0 ? Math.PI / 2 : -Math.PI / 2 : Z = p > 0 ? 0 : Math.PI, e.beginPath(), e.moveTo(R, F), e.lineTo(
      R - te * Math.cos(Z - Q),
      F - te * Math.sin(Z - Q)
    ), e.lineTo(
      R - te * Math.cos(Z + Q),
      F - te * Math.sin(Z + Q)
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
      return e.color ?? Et;
    const t = e.type;
    return oi[t] ?? e.color ?? Et;
  }
  isInHighlightSequence(e) {
    return ve.includes(e);
  }
  getNextHighlightType(e) {
    if (!this.isInHighlightSequence(e))
      return null;
    const i = (ve.indexOf(e) + 1) % ve.length;
    return i === 0 ? null : ve[i];
  }
  getActiveModifier(e) {
    for (const t of ni)
      if (e[t])
        return t;
    return null;
  }
  resolveArrowColor(e) {
    const t = this.getActiveModifier(e);
    return t ? Mt[t] : Mt.default;
  }
  resolveHighlightTypeFromModifiers(e) {
    const t = this.getActiveModifier(e);
    return t ? ai[t] : ve[0];
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
    this.addHighlight(e, ve[0]);
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
    const [r, o] = this.squareToCoords(i.from), [n, a] = this.squareToCoords(i.to), l = r + this.squareSize / 2, f = o + this.squareSize / 2, p = n + this.squareSize / 2, v = a + this.squareSize / 2, _ = Math.sqrt(
      Math.pow(p - l, 2) + Math.pow(v - f, 2)
    );
    return _ === 0 ? !1 : Math.abs(
      ((v - f) * e - (p - l) * t + p * f - v * l) / _
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
          const n = this.orientation === "white" ? Fe[i] : Fe[7 - i];
          e.textAlign = this.orientation === "white" ? "left" : "right", e.textBaseline = "bottom", e.fillText(
            n,
            r + (this.orientation === "white" ? this.squareSize * 0.06 : this.squareSize - this.squareSize * 0.06),
            o + this.squareSize - this.squareSize * 0.06
          );
        }
        if (i === (this.orientation === "white" ? 0 : 7)) {
          const n = tt[7 - t];
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
    this.theme = wt(i), this.orientation = t.orientation || "white", this.interactive = t.interactive !== !1, this.showCoords = t.showCoordinates || !1, this.highlightLegal = t.highlightLegal !== !1, this.animationMs = t.animationMs || 300, this.allowPremoves = t.allowPremoves !== !1, this.showArrows = t.showArrows !== !1, this.showHighlights = t.showHighlights !== !1, this.rightClickHighlights = t.rightClickHighlights !== !1, this.soundEnabled = t.soundEnabled !== !1, this.showSquareNames = t.showSquareNames || !1, this.autoFlip = t.autoFlip ?? !1, this.soundUrl = t.soundUrl, this.soundUrls = t.soundUrls, this._initializeSound(), this.rules = t.rulesAdapter || new He(), t.fen && this.rules.setFEN(t.fen), this.state = Ce(this.rules.getFEN()), this._syncOrientationFromTurn(!0), this._buildDOM(), this._attachEvents(), this.resize(), t.pieceSet && this.setPieceSet(t.pieceSet);
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
    this.theme = wt(e), this._rasterize(), this.renderAll();
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
    this.rules.setFEN(e), this.state = Ce(this.rules.getFEN()), this._syncOrientationFromTurn(!1), this._lastMove = null;
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
    const { f: t, r: i } = vt(e), s = this.orientation === "white" ? t : 7 - t, r = this.orientation === "white" ? 7 - i : i;
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
        const f = (this.orientation === "white" ? l : 7 - l) * t, p = (this.orientation === "white" ? 7 - a : a) * t;
        e.fillStyle = (a + l) % 2 === 0 ? r : o, e.fillRect(f, p, t, t);
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
      const k = s * (r.scale ?? 1), P = this.square * k, b = t + (this.square - P) / 2 + r.offsetX * this.square, I = i + (this.square - P) / 2 + r.offsetY * this.square;
      this.ctxP.drawImage(r.image, b, I, P, P);
      return;
    }
    const o = { k: 0, q: 1, r: 2, b: 3, n: 4, p: 5 }, n = me(e), a = o[e.toLowerCase()], l = 128, f = a * l, p = n ? l : 0, v = this.square * s, _ = t + (this.square - v) / 2, m = i + (this.square - v) / 2;
    this.ctxP.drawImage(this.sprites.getSheet(), f, p, l, l, _, m, v, v);
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
        const l = Ae(n, o);
        if (s === l) continue;
        const { x: f, y: p } = this._sqToXY(l);
        this._drawPieceSprite(a, f, p, 1);
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
    const l = o / a, f = n / a, p = Math.min(16 * this.dpr, a * 0.25), v = Math.max(6 * this.dpr, this.square * 0.08), _ = this.ctxO;
    _.save(), _.lineCap = "round", _.lineJoin = "round", _.strokeStyle = r, _.fillStyle = r, _.globalAlpha = 0.95, _.beginPath(), _.moveTo(e, t), _.lineTo(i - l * p, s - f * p), _.lineWidth = v, _.stroke(), _.beginPath(), _.moveTo(i, s), _.lineTo(i - l * p - f * p * 0.5, s - f * p + l * p * 0.5), _.lineTo(i - l * p + f * p * 0.5, s - f * p - l * p * 0.5), _.closePath(), _.fill(), _.restore();
  }
  _setSelection(e, t) {
    const i = me(t) ? "w" : "b";
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
    if (s && me(s) === me(i)) {
      this._setSelection(e, s), this.renderAll();
      return;
    }
    this._attemptMove(t, e, i);
  }
  _attemptMove(e, t, i) {
    const s = me(i) ? "w" : "b";
    if (e === t)
      return this.renderAll(), !0;
    if (s !== this.state.turn)
      return this.allowPremoves ? (this.drawingManager && this.drawingManager.setPremove(e, t), this._premove = { from: e, to: t }, this._selected = null, this._legalCached = null, this._hoverSq = null, this.renderAll(), !0) : !1;
    const r = this.rules.move({ from: e, to: t });
    if (r && r.ok) {
      const o = this.rules.getFEN(), n = this.state, a = Ce(o);
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
        const _ = this._evt(a);
        _ && this.drawingManager && this.drawingManager.handleRightMouseDown(_.x, _.y, a.shiftKey, a.ctrlKey, a.altKey) && this.renderAll();
        return;
      }
      if (a.button !== 0) return;
      const l = this._evt(a);
      if (!l) return;
      const f = this._xyToSquare(l.x, l.y), p = this._pieceAt(f);
      !p || (me(p) ? "w" : "b") !== this.state.turn && !this.allowPremoves || (this._setSelection(f, p), this._dragging = { from: f, piece: p, x: l.x, y: l.y }, this._hoverSq = f, this.renderAll());
    }, s = (a) => {
      const l = this._evt(a);
      if (!l) {
        this.interactive && (this.cOverlay.style.cursor = "default");
        return;
      }
      if (this.drawingManager && this.drawingManager.handleMouseMove(l.x, l.y) && this.renderAll(), this._dragging)
        this._dragging.x = l.x, this._dragging.y = l.y, this._hoverSq = this._xyToSquare(l.x, l.y), this._drawPieces(), this._drawOverlay();
      else if (this.interactive) {
        const f = this._xyToSquare(l.x, l.y), p = this._pieceAt(f);
        this.cOverlay.style.cursor = p ? "pointer" : "default";
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
        let _ = !1;
        if (this.drawingManager && l && (_ = this.drawingManager.handleRightMouseUp(l.x, l.y)), !_ && l) {
          if (this.drawingManager && this.drawingManager.getPremove())
            this.drawingManager.clearPremove(), this._premove = null, console.log("Premove cancelled by right-click"), _ = !0;
          else if (this.rightClickHighlights) {
            const m = this._xyToSquare(l.x, l.y);
            this.drawingManager && this.drawingManager.handleHighlightClick(m, a.shiftKey, a.ctrlKey, a.altKey);
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
          const _ = this._xyToSquare(l.x, l.y);
          this._handleClickMove(_);
        }
        return;
      }
      const f = l ? this._xyToSquare(l.x, l.y) : null, p = this._dragging.from, v = this._dragging.piece;
      if (this._dragging = null, this._hoverSq = null, !f) {
        this._selected = null, this._legalCached = null, this.renderAll();
        return;
      }
      if (f === p) {
        this.renderAll();
        return;
      }
      this._attemptMove(p, f, v);
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
    const i = De(Math.floor(e / this.square), 0, 7), s = De(Math.floor(t / this.square), 0, 7), r = this.orientation === "white" ? i : 7 - i, o = this.orientation === "white" ? 7 - s : s;
    return Ae(r, o);
  }
  _pieceAt(e) {
    const { f: t, r: i } = vt(e);
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
        const l = t.board[n][a], f = e.board[n][a];
        if (l && (!f || l !== f)) {
          const p = this.findPiece(e.board, l, n, a, t.board);
          p && r.set(Ae(a, n), Ae(p.f, p.r));
        }
      }
    const o = () => {
      var f;
      const n = De((performance.now() - i) / s, 0, 1), a = ks(n);
      this.ctxP.clearRect(0, 0, this.cPieces.width, this.cPieces.height);
      for (let p = 0; p < 8; p++)
        for (let v = 0; v < 8; v++) {
          const _ = e.board[p][v];
          if (!_) continue;
          const m = Ae(v, p), k = (f = [...r.entries()].find(([P, b]) => b === m)) == null ? void 0 : f[0];
          if (k) {
            const { x: P, y: b } = this._sqToXY(k), { x: I, y: $ } = this._sqToXY(m), Y = _t(P, I, a), R = _t(b, $, a);
            this._drawPieceSprite(_, Y, R, 1);
          } else {
            const { x: P, y: b } = this._sqToXY(m);
            this._drawPieceSprite(_, P, b, 1);
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
      const i = this.rules.getFEN(), s = Ce(i), r = this.state;
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
        return i && (i.loadPgnWithAnnotations(e), this.displayAnnotationsFromPgn(i)), this.state = Ce(this.rules.getFEN()), this._syncOrientationFromTurn(!1), this.renderAll(), !0;
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
const Ze = [];
let et;
function gi(h) {
  if (et) {
    h(et);
    return;
  }
  Ze.push(h);
}
function di(h) {
  for (et = h; Ze.length > 0; ) {
    const e = Ze.shift();
    e == null || e(h);
  }
}
function Qe(h) {
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
  const e = new He(), t = new ui(h, {
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
      } catch (p) {
        console.warn("[oracle-board] Unable to access verbose history.", p);
      }
    return [];
  }, o = () => {
    i.reset(), r().forEach((p) => i.push(Qe(p)));
  };
  let n, a;
  const l = () => {
    a == null || a({ fen: e.getFEN(), pgn: i.getPGN() });
  };
  t.on("move", (p) => {
    const { from: v, to: _, fen: m } = p, k = r(), P = k[k.length - 1];
    P ? (i.push(Qe(P)), n == null || n({ from: v, to: _, fen: m, san: P.san })) : (i.push(Qe({ from: v, to: _ })), n == null || n({ from: v, to: _, fen: m })), l();
  }), t.on("update", () => l());
  const f = {
    loadPgn(p) {
      if (typeof p != "string" || p.trim().length === 0)
        return !1;
      const v = t.loadPgnWithAnnotations(p);
      return v && (o(), l()), v;
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
    onMove(p) {
      n = p;
    },
    onUpdate(p) {
      a = p, l();
    }
  };
  window.oracleBoard = f, document.dispatchEvent(
    new CustomEvent("oracle-board:ready", {
      detail: f
    })
  ), di(f), l();
}
function pi() {
  var we;
  const h = document.querySelector("[data-app-root]");
  if (!h)
    return;
  const e = document.getElementById("pgn"), t = h.querySelector("[data-load-pgn]"), i = h.querySelector("[data-reset-board]"), s = h.querySelectorAll("[data-mode-input]"), r = h.querySelectorAll("[data-mode-panel]"), o = h.querySelector("[data-game-new]"), n = h.querySelector("[data-game-resign]"), a = h.querySelector("[data-game-status]"), l = h.querySelector("[data-game-level]"), f = h.querySelector(".board-panel"), p = document.createElement("div");
  p.id = "board-loader", p.className = "board-loader", p.hidden = !0, p.innerHTML = `
    <div class="spinner-border text-light" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  `, f == null || f.appendChild(p);
  const v = (y) => y && y.trim().length > 0 ? y.trim() : "";
  let _ = h.dataset.activeMode === "play" ? "play" : "analyze", m, k = !1;
  const P = {
    newGame: v(h.dataset.gameNewEndpoint),
    move: v(h.dataset.gameMoveEndpoint),
    resign: v(h.dataset.gameResignEndpoint)
  }, b = {
    inProgress: !1,
    awaitingResponse: !1,
    lastStablePgn: "",
    selectedLevel: ((we = l == null ? void 0 : l.value) == null ? void 0 : we.trim()) ?? ""
  }, I = (y) => {
    k = !0;
    try {
      y();
    } finally {
      k = !1;
    }
  }, $ = (y) => {
    e && (e.value = y);
  }, Y = () => {
    r.forEach((y) => {
      const S = y.dataset.modePanel ?? "analyze";
      y.toggleAttribute("hidden", S !== _);
    }), e && (_ === "play" ? e.setAttribute("readonly", "true") : e.removeAttribute("readonly"));
  }, R = () => {
    const y = _ === "play";
    o && (o.disabled = !y || b.awaitingResponse), n && (n.disabled = !y || !b.inProgress || b.awaitingResponse);
  }, F = (y, S = "info") => {
    if (!a)
      return;
    if (!y) {
      a.textContent = "", a.hidden = !0, a.classList.remove("alert-info", "alert-danger", "alert-success");
      return;
    }
    a.hidden = !1, a.textContent = y, a.classList.remove("alert-info", "alert-danger", "alert-success");
    const q = S === "error" ? "alert-danger" : S === "success" ? "alert-success" : "alert-info";
    a.classList.add(q);
  }, te = () => {
    if (!m || !e)
      return;
    const y = e.value.trim();
    I(() => {
      y.length > 0 && m.loadPgn(y) || m.reset();
    });
    const S = m.getPgn();
    $(S), b.lastStablePgn = S;
  }, Q = (y) => {
    if (!m)
      return;
    const S = (y ?? b.lastStablePgn).trim();
    I(() => {
      S.length > 0 && m.loadPgn(S) || m.reset();
    });
    const q = m.getPgn();
    $(q);
  }, Z = (y, S) => {
    if (!m)
      return;
    const q = typeof y == "string" ? y.trim() : "";
    I(() => {
      q.length > 0 && m.loadPgn(q) || m.reset();
    });
    const N = m.getPgn();
    b.lastStablePgn = N, $(N);
    const H = !!(S != null && S.finished);
    let j;
    typeof (S == null ? void 0 : S.status) == "string" ? j = S.status : typeof (S == null ? void 0 : S.message) == "string" ? j = S.message : H && (j = "Partie terminée."), F(j ?? "Coup joué.", H ? "success" : "info"), H && (b.inProgress = !1), R();
  }, re = async (y, S) => {
    if (!y)
      throw new Error("Endpoint de partie indisponible.");
    const q = await fetch(y, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(S)
    });
    if (!q.ok)
      throw new Error(`Erreur serveur (${q.status}) lors de l'échange avec l'ordinateur.`);
    return (q.headers.get("content-type") ?? "").includes("application/json") ? q.json() : {};
  }, fe = () => {
    const y = b.selectedLevel.trim();
    return y.length > 0 ? y : void 0;
  }, ge = (y, S = {}) => {
    const { force: q = !1 } = S;
    if (!(!q && _ === y)) {
      if (_ = y, Y(), R(), _ === "analyze") {
        F(), m && te();
        return;
      }
      if (b.inProgress = !1, b.awaitingResponse = !1, m) {
        I(() => m.reset());
        const N = m.getPgn();
        b.lastStablePgn = N, $(N);
      } else
        $(""), b.lastStablePgn = "";
      F("Choisissez un niveau puis démarrez une partie.", "info"), R();
    }
  };
  s.forEach((y) => {
    y.addEventListener("change", () => {
      y.checked && ge(y.value === "play" ? "play" : "analyze");
    });
  }), t == null || t.addEventListener("click", () => {
    _ === "analyze" && (te(), e == null || e.focus());
  }), i == null || i.addEventListener("click", () => {
    if (_ !== "analyze" || !m)
      return;
    I(() => m.reset());
    const y = m.getPgn();
    $(y), e == null || e.focus();
  }), l == null || l.addEventListener("change", () => {
    var y;
    b.selectedLevel = ((y = l.value) == null ? void 0 : y.trim()) ?? "";
  });
  const ie = document.querySelector('form[action="/analyze"]');
  ie == null || ie.addEventListener("submit", async (y) => {
    y.preventDefault();
    const S = ie.querySelector('button[type="submit"]');
    if (!S)
      return;
    const q = S.innerHTML;
    S.disabled = !0, S.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Analyse en cours...
    `;
    try {
      const N = new FormData(ie), H = await fetch(ie.action, {
        method: ie.method,
        body: new URLSearchParams(N)
      });
      if (!H.ok)
        throw new Error(`Erreur serveur (${H.status}) lors de l'analyse.`);
      const j = await H.text(), be = new DOMParser().parseFromString(j, "text/html").querySelector(".col-12.col-xl-10.col-xxl-9"), Se = document.querySelector(".col-12.col-xl-10.col-xxl-9");
      be && Se && (Se.innerHTML = be.innerHTML, Te(be));
    } catch (N) {
      const H = N instanceof Error ? N.message : "Une erreur inattendue est survenue.";
      F(H, "error");
    } finally {
      S.disabled = !1, S.innerHTML = q;
    }
  });
  const Te = (y) => {
    Array.from(y.querySelectorAll("script")).forEach((q) => {
      var H;
      const N = document.createElement("script");
      q.src ? (N.src = q.src, N.async = !1) : N.textContent = q.textContent;
      for (const { name: j, value: G } of q.attributes)
        N.setAttribute(j, G);
      (H = q.parentNode) == null || H.replaceChild(N, q);
    });
  };
  o == null || o.addEventListener("click", async () => {
    if (_ !== "play" && ge("play"), !m || b.awaitingResponse) {
      m || F("Plateau en cours de chargement…", "info");
      return;
    }
    b.awaitingResponse = !0, R();
    const y = o.innerHTML;
    o.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Démarrage...
    `, F("Initialisation de la partie…", "info");
    try {
      const S = {}, q = fe();
      q && (S.level = q);
      const N = await re(P.newGame, S);
      I(() => {
        m.reset(), typeof (N == null ? void 0 : N.pgn) == "string" && N.pgn.trim().length > 0 && m.loadPgn(N.pgn);
      });
      const H = m.getPgn();
      b.lastStablePgn = H, b.inProgress = !0, $(H);
      const j = typeof (N == null ? void 0 : N.status) == "string" ? N.status : "La partie a démarré.";
      F(j, "info");
    } catch (S) {
      console.error("[oracle-board] Unable to start game:", S);
      const q = S instanceof Error ? S.message : "Impossible de démarrer la partie.";
      F(q, "error");
    } finally {
      o.innerHTML = y, b.awaitingResponse = !1, R();
    }
  }), n == null || n.addEventListener("click", async () => {
    if (!(_ !== "play" || !m || !b.inProgress || b.awaitingResponse)) {
      b.awaitingResponse = !0, R(), F("Abandon en cours…", "info");
      try {
        const y = { pgn: b.lastStablePgn }, S = fe();
        S && (y.level = S);
        const q = await re(P.resign, y);
        typeof (q == null ? void 0 : q.pgn) == "string" && I(() => {
          q.pgn.trim().length > 0 ? m.loadPgn(q.pgn) : m.reset();
        });
        const N = m.getPgn();
        $(N), b.lastStablePgn = N, b.inProgress = !1;
        const H = typeof (q == null ? void 0 : q.status) == "string" ? q.status : "Vous avez abandonné la partie.";
        F(H, "success");
      } catch (y) {
        console.error("[oracle-board] Unable to resign game:", y);
        const S = y instanceof Error ? y.message : "Impossible d'abandonner la partie.";
        F(S, "error"), b.inProgress = !1;
      } finally {
        b.awaitingResponse = !1, R();
      }
    }
  }), gi((y) => {
    if (m = y, _ === "analyze")
      te();
    else if (m) {
      I(() => m.reset());
      const S = m.getPgn();
      b.lastStablePgn = S, $(S), F("Choisissez un niveau puis démarrez une partie.", "info");
    }
    m == null || m.onMove((S) => {
      if (!m || k)
        return;
      if (_ === "analyze") {
        $(m.getPgn());
        return;
      }
      if (!b.inProgress) {
        F("Lancez une nouvelle partie pour jouer.", "error"), Q();
        return;
      }
      if (b.awaitingResponse) {
        Q();
        return;
      }
      const q = b.lastStablePgn, N = m.getPgn(), H = {
        move: S.san ?? "",
        from: S.from,
        to: S.to,
        fen: S.fen,
        pgn: N
      }, j = fe();
      j && (H.level = j), b.awaitingResponse = !0, R(), p.hidden = !1, F("Coup envoyé, attente de la réponse…", "info"), re(P.move, H).then((G) => {
        const ne = G && typeof G.pgn == "string" ? G.pgn : N;
        Z(ne, G);
      }).catch((G) => {
        console.error("[oracle-board] Unable to send move:", G);
        const ne = G instanceof Error ? G.message : "Impossible d'envoyer le coup.";
        F(ne, "error"), Q(q);
      }).finally(() => {
        p.hidden = !0, b.awaitingResponse = !1, R();
      });
    }), m == null || m.onUpdate(({ pgn: S }) => {
      if (!k) {
        if (_ === "analyze") {
          if (!e || document.activeElement === e)
            return;
          $(S);
          return;
        }
        b.awaitingResponse || (b.lastStablePgn = S), $(S);
      }
    });
  }), ge(_, { force: !0 });
}
function Tt() {
  pi(), mi();
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Tt, { once: !0 }) : Tt();
