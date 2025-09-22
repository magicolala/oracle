var ul = Object.defineProperty;
var dl = (s, t, e) => t in s ? ul(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var P = (s, t, e) => dl(s, typeof t != "symbol" ? t + "" : t, e);
/*!
 * @kurkle/color v0.3.4
 * https://github.com/kurkle/color#readme
 * (c) 2024 Jukka Kurkela
 * Released under the MIT License
 */
function vi(s) {
  return s + 0.5 | 0;
}
const he = (s, t, e) => Math.max(Math.min(s, e), t);
function Ze(s) {
  return he(vi(s * 2.55), 0, 255);
}
function ge(s) {
  return he(vi(s * 255), 0, 255);
}
function te(s) {
  return he(vi(s / 2.55) / 100, 0, 1);
}
function Hn(s) {
  return he(vi(s * 100), 0, 100);
}
const Nt = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15 }, Vs = [..."0123456789ABCDEF"], fl = (s) => Vs[s & 15], gl = (s) => Vs[(s & 240) >> 4] + Vs[s & 15], ki = (s) => (s & 240) >> 4 === (s & 15), pl = (s) => ki(s.r) && ki(s.g) && ki(s.b) && ki(s.a);
function ml(s) {
  var t = s.length, e;
  return s[0] === "#" && (t === 4 || t === 5 ? e = {
    r: 255 & Nt[s[1]] * 17,
    g: 255 & Nt[s[2]] * 17,
    b: 255 & Nt[s[3]] * 17,
    a: t === 5 ? Nt[s[4]] * 17 : 255
  } : (t === 7 || t === 9) && (e = {
    r: Nt[s[1]] << 4 | Nt[s[2]],
    g: Nt[s[3]] << 4 | Nt[s[4]],
    b: Nt[s[5]] << 4 | Nt[s[6]],
    a: t === 9 ? Nt[s[7]] << 4 | Nt[s[8]] : 255
  })), e;
}
const bl = (s, t) => s < 255 ? t(s) : "";
function _l(s) {
  var t = pl(s) ? fl : gl;
  return s ? "#" + t(s.r) + t(s.g) + t(s.b) + bl(s.a, t) : void 0;
}
const yl = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
function kr(s, t, e) {
  const i = t * Math.min(e, 1 - e), n = (o, r = (o + s / 30) % 12) => e - i * Math.max(Math.min(r - 3, 9 - r, 1), -1);
  return [n(0), n(8), n(4)];
}
function xl(s, t, e) {
  const i = (n, o = (n + s / 60) % 6) => e - e * t * Math.max(Math.min(o, 4 - o, 1), 0);
  return [i(5), i(3), i(1)];
}
function vl(s, t, e) {
  const i = kr(s, 1, 0.5);
  let n;
  for (t + e > 1 && (n = 1 / (t + e), t *= n, e *= n), n = 0; n < 3; n++)
    i[n] *= 1 - t - e, i[n] += t;
  return i;
}
function wl(s, t, e, i, n) {
  return s === n ? (t - e) / i + (t < e ? 6 : 0) : t === n ? (e - s) / i + 2 : (s - t) / i + 4;
}
function dn(s) {
  const e = s.r / 255, i = s.g / 255, n = s.b / 255, o = Math.max(e, i, n), r = Math.min(e, i, n), a = (o + r) / 2;
  let l, c, h;
  return o !== r && (h = o - r, c = a > 0.5 ? h / (2 - o - r) : h / (o + r), l = wl(e, i, n, h, o), l = l * 60 + 0.5), [l | 0, c || 0, a];
}
function fn(s, t, e, i) {
  return (Array.isArray(t) ? s(t[0], t[1], t[2]) : s(t, e, i)).map(ge);
}
function gn(s, t, e) {
  return fn(kr, s, t, e);
}
function Sl(s, t, e) {
  return fn(vl, s, t, e);
}
function Ml(s, t, e) {
  return fn(xl, s, t, e);
}
function Pr(s) {
  return (s % 360 + 360) % 360;
}
function kl(s) {
  const t = yl.exec(s);
  let e = 255, i;
  if (!t)
    return;
  t[5] !== i && (e = t[6] ? Ze(+t[5]) : ge(+t[5]));
  const n = Pr(+t[2]), o = +t[3] / 100, r = +t[4] / 100;
  return t[1] === "hwb" ? i = Sl(n, o, r) : t[1] === "hsv" ? i = Ml(n, o, r) : i = gn(n, o, r), {
    r: i[0],
    g: i[1],
    b: i[2],
    a: e
  };
}
function Pl(s, t) {
  var e = dn(s);
  e[0] = Pr(e[0] + t), e = gn(e), s.r = e[0], s.g = e[1], s.b = e[2];
}
function Al(s) {
  if (!s)
    return;
  const t = dn(s), e = t[0], i = Hn(t[1]), n = Hn(t[2]);
  return s.a < 255 ? `hsla(${e}, ${i}%, ${n}%, ${te(s.a)})` : `hsl(${e}, ${i}%, ${n}%)`;
}
const $n = {
  x: "dark",
  Z: "light",
  Y: "re",
  X: "blu",
  W: "gr",
  V: "medium",
  U: "slate",
  A: "ee",
  T: "ol",
  S: "or",
  B: "ra",
  C: "lateg",
  D: "ights",
  R: "in",
  Q: "turquois",
  E: "hi",
  P: "ro",
  O: "al",
  N: "le",
  M: "de",
  L: "yello",
  F: "en",
  K: "ch",
  G: "arks",
  H: "ea",
  I: "ightg",
  J: "wh"
}, qn = {
  OiceXe: "f0f8ff",
  antiquewEte: "faebd7",
  aqua: "ffff",
  aquamarRe: "7fffd4",
  azuY: "f0ffff",
  beige: "f5f5dc",
  bisque: "ffe4c4",
  black: "0",
  blanKedOmond: "ffebcd",
  Xe: "ff",
  XeviTet: "8a2be2",
  bPwn: "a52a2a",
  burlywood: "deb887",
  caMtXe: "5f9ea0",
  KartYuse: "7fff00",
  KocTate: "d2691e",
  cSO: "ff7f50",
  cSnflowerXe: "6495ed",
  cSnsilk: "fff8dc",
  crimson: "dc143c",
  cyan: "ffff",
  xXe: "8b",
  xcyan: "8b8b",
  xgTMnPd: "b8860b",
  xWay: "a9a9a9",
  xgYF: "6400",
  xgYy: "a9a9a9",
  xkhaki: "bdb76b",
  xmagFta: "8b008b",
  xTivegYF: "556b2f",
  xSange: "ff8c00",
  xScEd: "9932cc",
  xYd: "8b0000",
  xsOmon: "e9967a",
  xsHgYF: "8fbc8f",
  xUXe: "483d8b",
  xUWay: "2f4f4f",
  xUgYy: "2f4f4f",
  xQe: "ced1",
  xviTet: "9400d3",
  dAppRk: "ff1493",
  dApskyXe: "bfff",
  dimWay: "696969",
  dimgYy: "696969",
  dodgerXe: "1e90ff",
  fiYbrick: "b22222",
  flSOwEte: "fffaf0",
  foYstWAn: "228b22",
  fuKsia: "ff00ff",
  gaRsbSo: "dcdcdc",
  ghostwEte: "f8f8ff",
  gTd: "ffd700",
  gTMnPd: "daa520",
  Way: "808080",
  gYF: "8000",
  gYFLw: "adff2f",
  gYy: "808080",
  honeyMw: "f0fff0",
  hotpRk: "ff69b4",
  RdianYd: "cd5c5c",
  Rdigo: "4b0082",
  ivSy: "fffff0",
  khaki: "f0e68c",
  lavFMr: "e6e6fa",
  lavFMrXsh: "fff0f5",
  lawngYF: "7cfc00",
  NmoncEffon: "fffacd",
  ZXe: "add8e6",
  ZcSO: "f08080",
  Zcyan: "e0ffff",
  ZgTMnPdLw: "fafad2",
  ZWay: "d3d3d3",
  ZgYF: "90ee90",
  ZgYy: "d3d3d3",
  ZpRk: "ffb6c1",
  ZsOmon: "ffa07a",
  ZsHgYF: "20b2aa",
  ZskyXe: "87cefa",
  ZUWay: "778899",
  ZUgYy: "778899",
  ZstAlXe: "b0c4de",
  ZLw: "ffffe0",
  lime: "ff00",
  limegYF: "32cd32",
  lRF: "faf0e6",
  magFta: "ff00ff",
  maPon: "800000",
  VaquamarRe: "66cdaa",
  VXe: "cd",
  VScEd: "ba55d3",
  VpurpN: "9370db",
  VsHgYF: "3cb371",
  VUXe: "7b68ee",
  VsprRggYF: "fa9a",
  VQe: "48d1cc",
  VviTetYd: "c71585",
  midnightXe: "191970",
  mRtcYam: "f5fffa",
  mistyPse: "ffe4e1",
  moccasR: "ffe4b5",
  navajowEte: "ffdead",
  navy: "80",
  Tdlace: "fdf5e6",
  Tive: "808000",
  TivedBb: "6b8e23",
  Sange: "ffa500",
  SangeYd: "ff4500",
  ScEd: "da70d6",
  pOegTMnPd: "eee8aa",
  pOegYF: "98fb98",
  pOeQe: "afeeee",
  pOeviTetYd: "db7093",
  papayawEp: "ffefd5",
  pHKpuff: "ffdab9",
  peru: "cd853f",
  pRk: "ffc0cb",
  plum: "dda0dd",
  powMrXe: "b0e0e6",
  purpN: "800080",
  YbeccapurpN: "663399",
  Yd: "ff0000",
  Psybrown: "bc8f8f",
  PyOXe: "4169e1",
  saddNbPwn: "8b4513",
  sOmon: "fa8072",
  sandybPwn: "f4a460",
  sHgYF: "2e8b57",
  sHshell: "fff5ee",
  siFna: "a0522d",
  silver: "c0c0c0",
  skyXe: "87ceeb",
  UXe: "6a5acd",
  UWay: "708090",
  UgYy: "708090",
  snow: "fffafa",
  sprRggYF: "ff7f",
  stAlXe: "4682b4",
  tan: "d2b48c",
  teO: "8080",
  tEstN: "d8bfd8",
  tomato: "ff6347",
  Qe: "40e0d0",
  viTet: "ee82ee",
  JHt: "f5deb3",
  wEte: "ffffff",
  wEtesmoke: "f5f5f5",
  Lw: "ffff00",
  LwgYF: "9acd32"
};
function Cl() {
  const s = {}, t = Object.keys(qn), e = Object.keys($n);
  let i, n, o, r, a;
  for (i = 0; i < t.length; i++) {
    for (r = a = t[i], n = 0; n < e.length; n++)
      o = e[n], a = a.replace(o, $n[o]);
    o = parseInt(qn[r], 16), s[a] = [o >> 16 & 255, o >> 8 & 255, o & 255];
  }
  return s;
}
let Pi;
function Tl(s) {
  Pi || (Pi = Cl(), Pi.transparent = [0, 0, 0, 0]);
  const t = Pi[s.toLowerCase()];
  return t && {
    r: t[0],
    g: t[1],
    b: t[2],
    a: t.length === 4 ? t[3] : 255
  };
}
const El = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
function Ol(s) {
  const t = El.exec(s);
  let e = 255, i, n, o;
  if (t) {
    if (t[7] !== i) {
      const r = +t[7];
      e = t[8] ? Ze(r) : he(r * 255, 0, 255);
    }
    return i = +t[1], n = +t[3], o = +t[5], i = 255 & (t[2] ? Ze(i) : he(i, 0, 255)), n = 255 & (t[4] ? Ze(n) : he(n, 0, 255)), o = 255 & (t[6] ? Ze(o) : he(o, 0, 255)), {
      r: i,
      g: n,
      b: o,
      a: e
    };
  }
}
function Dl(s) {
  return s && (s.a < 255 ? `rgba(${s.r}, ${s.g}, ${s.b}, ${te(s.a)})` : `rgb(${s.r}, ${s.g}, ${s.b})`);
}
const ys = (s) => s <= 31308e-7 ? s * 12.92 : Math.pow(s, 1 / 2.4) * 1.055 - 0.055, Re = (s) => s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
function Ll(s, t, e) {
  const i = Re(te(s.r)), n = Re(te(s.g)), o = Re(te(s.b));
  return {
    r: ge(ys(i + e * (Re(te(t.r)) - i))),
    g: ge(ys(n + e * (Re(te(t.g)) - n))),
    b: ge(ys(o + e * (Re(te(t.b)) - o))),
    a: s.a + e * (t.a - s.a)
  };
}
function Ai(s, t, e) {
  if (s) {
    let i = dn(s);
    i[t] = Math.max(0, Math.min(i[t] + i[t] * e, t === 0 ? 360 : 1)), i = gn(i), s.r = i[0], s.g = i[1], s.b = i[2];
  }
}
function Ar(s, t) {
  return s && Object.assign(t || {}, s);
}
function Wn(s) {
  var t = { r: 0, g: 0, b: 0, a: 255 };
  return Array.isArray(s) ? s.length >= 3 && (t = { r: s[0], g: s[1], b: s[2], a: 255 }, s.length > 3 && (t.a = ge(s[3]))) : (t = Ar(s, { r: 0, g: 0, b: 0, a: 1 }), t.a = ge(t.a)), t;
}
function Rl(s) {
  return s.charAt(0) === "r" ? Ol(s) : kl(s);
}
class di {
  constructor(t) {
    if (t instanceof di)
      return t;
    const e = typeof t;
    let i;
    e === "object" ? i = Wn(t) : e === "string" && (i = ml(t) || Tl(t) || Rl(t)), this._rgb = i, this._valid = !!i;
  }
  get valid() {
    return this._valid;
  }
  get rgb() {
    var t = Ar(this._rgb);
    return t && (t.a = te(t.a)), t;
  }
  set rgb(t) {
    this._rgb = Wn(t);
  }
  rgbString() {
    return this._valid ? Dl(this._rgb) : void 0;
  }
  hexString() {
    return this._valid ? _l(this._rgb) : void 0;
  }
  hslString() {
    return this._valid ? Al(this._rgb) : void 0;
  }
  mix(t, e) {
    if (t) {
      const i = this.rgb, n = t.rgb;
      let o;
      const r = e === o ? 0.5 : e, a = 2 * r - 1, l = i.a - n.a, c = ((a * l === -1 ? a : (a + l) / (1 + a * l)) + 1) / 2;
      o = 1 - c, i.r = 255 & c * i.r + o * n.r + 0.5, i.g = 255 & c * i.g + o * n.g + 0.5, i.b = 255 & c * i.b + o * n.b + 0.5, i.a = r * i.a + (1 - r) * n.a, this.rgb = i;
    }
    return this;
  }
  interpolate(t, e) {
    return t && (this._rgb = Ll(this._rgb, t._rgb, e)), this;
  }
  clone() {
    return new di(this.rgb);
  }
  alpha(t) {
    return this._rgb.a = ge(t), this;
  }
  clearer(t) {
    const e = this._rgb;
    return e.a *= 1 - t, this;
  }
  greyscale() {
    const t = this._rgb, e = vi(t.r * 0.3 + t.g * 0.59 + t.b * 0.11);
    return t.r = t.g = t.b = e, this;
  }
  opaquer(t) {
    const e = this._rgb;
    return e.a *= 1 + t, this;
  }
  negate() {
    const t = this._rgb;
    return t.r = 255 - t.r, t.g = 255 - t.g, t.b = 255 - t.b, this;
  }
  lighten(t) {
    return Ai(this._rgb, 2, t), this;
  }
  darken(t) {
    return Ai(this._rgb, 2, -t), this;
  }
  saturate(t) {
    return Ai(this._rgb, 1, t), this;
  }
  desaturate(t) {
    return Ai(this._rgb, 1, -t), this;
  }
  rotate(t) {
    return Pl(this._rgb, t), this;
  }
}
/*!
 * Chart.js v4.5.0
 * https://www.chartjs.org
 * (c) 2025 Chart.js Contributors
 * Released under the MIT License
 */
function Gt() {
}
const Il = /* @__PURE__ */ (() => {
  let s = 0;
  return () => s++;
})();
function j(s) {
  return s == null;
}
function st(s) {
  if (Array.isArray && Array.isArray(s))
    return !0;
  const t = Object.prototype.toString.call(s);
  return t.slice(0, 7) === "[object" && t.slice(-6) === "Array]";
}
function U(s) {
  return s !== null && Object.prototype.toString.call(s) === "[object Object]";
}
function at(s) {
  return (typeof s == "number" || s instanceof Number) && isFinite(+s);
}
function Dt(s, t) {
  return at(s) ? s : t;
}
function W(s, t) {
  return typeof s > "u" ? t : s;
}
const Fl = (s, t) => typeof s == "string" && s.endsWith("%") ? parseFloat(s) / 100 : +s / t, Cr = (s, t) => typeof s == "string" && s.endsWith("%") ? parseFloat(s) / 100 * t : +s;
function et(s, t, e) {
  if (s && typeof s.call == "function")
    return s.apply(e, t);
}
function Z(s, t, e, i) {
  let n, o, r;
  if (st(s))
    for (o = s.length, n = 0; n < o; n++)
      t.call(e, s[n], n);
  else if (U(s))
    for (r = Object.keys(s), o = r.length, n = 0; n < o; n++)
      t.call(e, s[r[n]], r[n]);
}
function Zi(s, t) {
  let e, i, n, o;
  if (!s || !t || s.length !== t.length)
    return !1;
  for (e = 0, i = s.length; e < i; ++e)
    if (n = s[e], o = t[e], n.datasetIndex !== o.datasetIndex || n.index !== o.index)
      return !1;
  return !0;
}
function ts(s) {
  if (st(s))
    return s.map(ts);
  if (U(s)) {
    const t = /* @__PURE__ */ Object.create(null), e = Object.keys(s), i = e.length;
    let n = 0;
    for (; n < i; ++n)
      t[e[n]] = ts(s[e[n]]);
    return t;
  }
  return s;
}
function Tr(s) {
  return [
    "__proto__",
    "prototype",
    "constructor"
  ].indexOf(s) === -1;
}
function Nl(s, t, e, i) {
  if (!Tr(s))
    return;
  const n = t[s], o = e[s];
  U(n) && U(o) ? fi(n, o, i) : t[s] = ts(o);
}
function fi(s, t, e) {
  const i = st(t) ? t : [
    t
  ], n = i.length;
  if (!U(s))
    return s;
  e = e || {};
  const o = e.merger || Nl;
  let r;
  for (let a = 0; a < n; ++a) {
    if (r = i[a], !U(r))
      continue;
    const l = Object.keys(r);
    for (let c = 0, h = l.length; c < h; ++c)
      o(l[c], s, r, e);
  }
  return s;
}
function ri(s, t) {
  return fi(s, t, {
    merger: zl
  });
}
function zl(s, t, e) {
  if (!Tr(s))
    return;
  const i = t[s], n = e[s];
  U(i) && U(n) ? ri(i, n) : Object.prototype.hasOwnProperty.call(t, s) || (t[s] = ts(n));
}
const Vn = {
  // Chart.helpers.core resolveObjectKey should resolve empty key to root object
  "": (s) => s,
  // default resolvers
  x: (s) => s.x,
  y: (s) => s.y
};
function Bl(s) {
  const t = s.split("."), e = [];
  let i = "";
  for (const n of t)
    i += n, i.endsWith("\\") ? i = i.slice(0, -1) + "." : (e.push(i), i = "");
  return e;
}
function Hl(s) {
  const t = Bl(s);
  return (e) => {
    for (const i of t) {
      if (i === "")
        break;
      e = e && e[i];
    }
    return e;
  };
}
function pe(s, t) {
  return (Vn[t] || (Vn[t] = Hl(t)))(s);
}
function pn(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
const gi = (s) => typeof s < "u", me = (s) => typeof s == "function", jn = (s, t) => {
  if (s.size !== t.size)
    return !1;
  for (const e of s)
    if (!t.has(e))
      return !1;
  return !0;
};
function $l(s) {
  return s.type === "mouseup" || s.type === "click" || s.type === "contextmenu";
}
const K = Math.PI, it = 2 * K, ql = it + K, es = Number.POSITIVE_INFINITY, Wl = K / 180, lt = K / 2, ye = K / 4, Un = K * 2 / 3, ue = Math.log10, Kt = Math.sign;
function ai(s, t, e) {
  return Math.abs(s - t) < e;
}
function Yn(s) {
  const t = Math.round(s);
  s = ai(s, t, s / 1e3) ? t : s;
  const e = Math.pow(10, Math.floor(ue(s))), i = s / e;
  return (i <= 1 ? 1 : i <= 2 ? 2 : i <= 5 ? 5 : 10) * e;
}
function Vl(s) {
  const t = [], e = Math.sqrt(s);
  let i;
  for (i = 1; i < e; i++)
    s % i === 0 && (t.push(i), t.push(s / i));
  return e === (e | 0) && t.push(e), t.sort((n, o) => n - o).pop(), t;
}
function jl(s) {
  return typeof s == "symbol" || typeof s == "object" && s !== null && !(Symbol.toPrimitive in s || "toString" in s || "valueOf" in s);
}
function He(s) {
  return !jl(s) && !isNaN(parseFloat(s)) && isFinite(s);
}
function Ul(s, t) {
  const e = Math.round(s);
  return e - t <= s && e + t >= s;
}
function Er(s, t, e) {
  let i, n, o;
  for (i = 0, n = s.length; i < n; i++)
    o = s[i][e], isNaN(o) || (t.min = Math.min(t.min, o), t.max = Math.max(t.max, o));
}
function $t(s) {
  return s * (K / 180);
}
function mn(s) {
  return s * (180 / K);
}
function Kn(s) {
  if (!at(s))
    return;
  let t = 1, e = 0;
  for (; Math.round(s * t) / t !== s; )
    t *= 10, e++;
  return e;
}
function Or(s, t) {
  const e = t.x - s.x, i = t.y - s.y, n = Math.sqrt(e * e + i * i);
  let o = Math.atan2(i, e);
  return o < -0.5 * K && (o += it), {
    angle: o,
    distance: n
  };
}
function js(s, t) {
  return Math.sqrt(Math.pow(t.x - s.x, 2) + Math.pow(t.y - s.y, 2));
}
function Yl(s, t) {
  return (s - t + ql) % it - K;
}
function wt(s) {
  return (s % it + it) % it;
}
function pi(s, t, e, i) {
  const n = wt(s), o = wt(t), r = wt(e), a = wt(o - n), l = wt(r - n), c = wt(n - o), h = wt(n - r);
  return n === o || n === r || i && o === r || a > l && c < h;
}
function bt(s, t, e) {
  return Math.max(t, Math.min(e, s));
}
function Kl(s) {
  return bt(s, -32768, 32767);
}
function ie(s, t, e, i = 1e-6) {
  return s >= Math.min(t, e) - i && s <= Math.max(t, e) + i;
}
function bn(s, t, e) {
  e = e || ((r) => s[r] < t);
  let i = s.length - 1, n = 0, o;
  for (; i - n > 1; )
    o = n + i >> 1, e(o) ? n = o : i = o;
  return {
    lo: n,
    hi: i
  };
}
const se = (s, t, e, i) => bn(s, e, i ? (n) => {
  const o = s[n][t];
  return o < e || o === e && s[n + 1][t] === e;
} : (n) => s[n][t] < e), Xl = (s, t, e) => bn(s, e, (i) => s[i][t] >= e);
function Gl(s, t, e) {
  let i = 0, n = s.length;
  for (; i < n && s[i] < t; )
    i++;
  for (; n > i && s[n - 1] > e; )
    n--;
  return i > 0 || n < s.length ? s.slice(i, n) : s;
}
const Dr = [
  "push",
  "pop",
  "shift",
  "splice",
  "unshift"
];
function Ql(s, t) {
  if (s._chartjs) {
    s._chartjs.listeners.push(t);
    return;
  }
  Object.defineProperty(s, "_chartjs", {
    configurable: !0,
    enumerable: !1,
    value: {
      listeners: [
        t
      ]
    }
  }), Dr.forEach((e) => {
    const i = "_onData" + pn(e), n = s[e];
    Object.defineProperty(s, e, {
      configurable: !0,
      enumerable: !1,
      value(...o) {
        const r = n.apply(this, o);
        return s._chartjs.listeners.forEach((a) => {
          typeof a[i] == "function" && a[i](...o);
        }), r;
      }
    });
  });
}
function Xn(s, t) {
  const e = s._chartjs;
  if (!e)
    return;
  const i = e.listeners, n = i.indexOf(t);
  n !== -1 && i.splice(n, 1), !(i.length > 0) && (Dr.forEach((o) => {
    delete s[o];
  }), delete s._chartjs);
}
function Lr(s) {
  const t = new Set(s);
  return t.size === s.length ? s : Array.from(t);
}
const Rr = function() {
  return typeof window > "u" ? function(s) {
    return s();
  } : window.requestAnimationFrame;
}();
function Ir(s, t) {
  let e = [], i = !1;
  return function(...n) {
    e = n, i || (i = !0, Rr.call(window, () => {
      i = !1, s.apply(t, e);
    }));
  };
}
function Jl(s, t) {
  let e;
  return function(...i) {
    return t ? (clearTimeout(e), e = setTimeout(s, t, i)) : s.apply(this, i), t;
  };
}
const _n = (s) => s === "start" ? "left" : s === "end" ? "right" : "center", vt = (s, t, e) => s === "start" ? t : s === "end" ? e : (t + e) / 2, Zl = (s, t, e, i) => s === (i ? "left" : "right") ? e : s === "center" ? (t + e) / 2 : t;
function Fr(s, t, e) {
  const i = t.length;
  let n = 0, o = i;
  if (s._sorted) {
    const { iScale: r, vScale: a, _parsed: l } = s, c = s.dataset && s.dataset.options ? s.dataset.options.spanGaps : null, h = r.axis, { min: u, max: d, minDefined: f, maxDefined: g } = r.getUserBounds();
    if (f) {
      if (n = Math.min(
        // @ts-expect-error Need to type _parsed
        se(l, h, u).lo,
        // @ts-expect-error Need to fix types on _lookupByKey
        e ? i : se(t, h, r.getPixelForValue(u)).lo
      ), c) {
        const p = l.slice(0, n + 1).reverse().findIndex((m) => !j(m[a.axis]));
        n -= Math.max(0, p);
      }
      n = bt(n, 0, i - 1);
    }
    if (g) {
      let p = Math.max(
        // @ts-expect-error Need to type _parsed
        se(l, r.axis, d, !0).hi + 1,
        // @ts-expect-error Need to fix types on _lookupByKey
        e ? 0 : se(t, h, r.getPixelForValue(d), !0).hi + 1
      );
      if (c) {
        const m = l.slice(p - 1).findIndex((b) => !j(b[a.axis]));
        p += Math.max(0, m);
      }
      o = bt(p, n, i) - n;
    } else
      o = i - n;
  }
  return {
    start: n,
    count: o
  };
}
function Nr(s) {
  const { xScale: t, yScale: e, _scaleRanges: i } = s, n = {
    xmin: t.min,
    xmax: t.max,
    ymin: e.min,
    ymax: e.max
  };
  if (!i)
    return s._scaleRanges = n, !0;
  const o = i.xmin !== t.min || i.xmax !== t.max || i.ymin !== e.min || i.ymax !== e.max;
  return Object.assign(i, n), o;
}
const Ci = (s) => s === 0 || s === 1, Gn = (s, t, e) => -(Math.pow(2, 10 * (s -= 1)) * Math.sin((s - t) * it / e)), Qn = (s, t, e) => Math.pow(2, -10 * s) * Math.sin((s - t) * it / e) + 1, li = {
  linear: (s) => s,
  easeInQuad: (s) => s * s,
  easeOutQuad: (s) => -s * (s - 2),
  easeInOutQuad: (s) => (s /= 0.5) < 1 ? 0.5 * s * s : -0.5 * (--s * (s - 2) - 1),
  easeInCubic: (s) => s * s * s,
  easeOutCubic: (s) => (s -= 1) * s * s + 1,
  easeInOutCubic: (s) => (s /= 0.5) < 1 ? 0.5 * s * s * s : 0.5 * ((s -= 2) * s * s + 2),
  easeInQuart: (s) => s * s * s * s,
  easeOutQuart: (s) => -((s -= 1) * s * s * s - 1),
  easeInOutQuart: (s) => (s /= 0.5) < 1 ? 0.5 * s * s * s * s : -0.5 * ((s -= 2) * s * s * s - 2),
  easeInQuint: (s) => s * s * s * s * s,
  easeOutQuint: (s) => (s -= 1) * s * s * s * s + 1,
  easeInOutQuint: (s) => (s /= 0.5) < 1 ? 0.5 * s * s * s * s * s : 0.5 * ((s -= 2) * s * s * s * s + 2),
  easeInSine: (s) => -Math.cos(s * lt) + 1,
  easeOutSine: (s) => Math.sin(s * lt),
  easeInOutSine: (s) => -0.5 * (Math.cos(K * s) - 1),
  easeInExpo: (s) => s === 0 ? 0 : Math.pow(2, 10 * (s - 1)),
  easeOutExpo: (s) => s === 1 ? 1 : -Math.pow(2, -10 * s) + 1,
  easeInOutExpo: (s) => Ci(s) ? s : s < 0.5 ? 0.5 * Math.pow(2, 10 * (s * 2 - 1)) : 0.5 * (-Math.pow(2, -10 * (s * 2 - 1)) + 2),
  easeInCirc: (s) => s >= 1 ? s : -(Math.sqrt(1 - s * s) - 1),
  easeOutCirc: (s) => Math.sqrt(1 - (s -= 1) * s),
  easeInOutCirc: (s) => (s /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - s * s) - 1) : 0.5 * (Math.sqrt(1 - (s -= 2) * s) + 1),
  easeInElastic: (s) => Ci(s) ? s : Gn(s, 0.075, 0.3),
  easeOutElastic: (s) => Ci(s) ? s : Qn(s, 0.075, 0.3),
  easeInOutElastic(s) {
    return Ci(s) ? s : s < 0.5 ? 0.5 * Gn(s * 2, 0.1125, 0.45) : 0.5 + 0.5 * Qn(s * 2 - 1, 0.1125, 0.45);
  },
  easeInBack(s) {
    return s * s * ((1.70158 + 1) * s - 1.70158);
  },
  easeOutBack(s) {
    return (s -= 1) * s * ((1.70158 + 1) * s + 1.70158) + 1;
  },
  easeInOutBack(s) {
    let t = 1.70158;
    return (s /= 0.5) < 1 ? 0.5 * (s * s * (((t *= 1.525) + 1) * s - t)) : 0.5 * ((s -= 2) * s * (((t *= 1.525) + 1) * s + t) + 2);
  },
  easeInBounce: (s) => 1 - li.easeOutBounce(1 - s),
  easeOutBounce(s) {
    return s < 1 / 2.75 ? 7.5625 * s * s : s < 2 / 2.75 ? 7.5625 * (s -= 1.5 / 2.75) * s + 0.75 : s < 2.5 / 2.75 ? 7.5625 * (s -= 2.25 / 2.75) * s + 0.9375 : 7.5625 * (s -= 2.625 / 2.75) * s + 0.984375;
  },
  easeInOutBounce: (s) => s < 0.5 ? li.easeInBounce(s * 2) * 0.5 : li.easeOutBounce(s * 2 - 1) * 0.5 + 0.5
};
function yn(s) {
  if (s && typeof s == "object") {
    const t = s.toString();
    return t === "[object CanvasPattern]" || t === "[object CanvasGradient]";
  }
  return !1;
}
function Jn(s) {
  return yn(s) ? s : new di(s);
}
function xs(s) {
  return yn(s) ? s : new di(s).saturate(0.5).darken(0.1).hexString();
}
const tc = [
  "x",
  "y",
  "borderWidth",
  "radius",
  "tension"
], ec = [
  "color",
  "borderColor",
  "backgroundColor"
];
function ic(s) {
  s.set("animation", {
    delay: void 0,
    duration: 1e3,
    easing: "easeOutQuart",
    fn: void 0,
    from: void 0,
    loop: void 0,
    to: void 0,
    type: void 0
  }), s.describe("animation", {
    _fallback: !1,
    _indexable: !1,
    _scriptable: (t) => t !== "onProgress" && t !== "onComplete" && t !== "fn"
  }), s.set("animations", {
    colors: {
      type: "color",
      properties: ec
    },
    numbers: {
      type: "number",
      properties: tc
    }
  }), s.describe("animations", {
    _fallback: "animation"
  }), s.set("transitions", {
    active: {
      animation: {
        duration: 400
      }
    },
    resize: {
      animation: {
        duration: 0
      }
    },
    show: {
      animations: {
        colors: {
          from: "transparent"
        },
        visible: {
          type: "boolean",
          duration: 0
        }
      }
    },
    hide: {
      animations: {
        colors: {
          to: "transparent"
        },
        visible: {
          type: "boolean",
          easing: "linear",
          fn: (t) => t | 0
        }
      }
    }
  });
}
function sc(s) {
  s.set("layout", {
    autoPadding: !0,
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  });
}
const Zn = /* @__PURE__ */ new Map();
function nc(s, t) {
  t = t || {};
  const e = s + JSON.stringify(t);
  let i = Zn.get(e);
  return i || (i = new Intl.NumberFormat(s, t), Zn.set(e, i)), i;
}
function wi(s, t, e) {
  return nc(t, e).format(s);
}
const zr = {
  values(s) {
    return st(s) ? s : "" + s;
  },
  numeric(s, t, e) {
    if (s === 0)
      return "0";
    const i = this.chart.options.locale;
    let n, o = s;
    if (e.length > 1) {
      const c = Math.max(Math.abs(e[0].value), Math.abs(e[e.length - 1].value));
      (c < 1e-4 || c > 1e15) && (n = "scientific"), o = oc(s, e);
    }
    const r = ue(Math.abs(o)), a = isNaN(r) ? 1 : Math.max(Math.min(-1 * Math.floor(r), 20), 0), l = {
      notation: n,
      minimumFractionDigits: a,
      maximumFractionDigits: a
    };
    return Object.assign(l, this.options.ticks.format), wi(s, i, l);
  },
  logarithmic(s, t, e) {
    if (s === 0)
      return "0";
    const i = e[t].significand || s / Math.pow(10, Math.floor(ue(s)));
    return [
      1,
      2,
      3,
      5,
      10,
      15
    ].includes(i) || t > 0.8 * e.length ? zr.numeric.call(this, s, t, e) : "";
  }
};
function oc(s, t) {
  let e = t.length > 3 ? t[2].value - t[1].value : t[1].value - t[0].value;
  return Math.abs(e) >= 1 && s !== Math.floor(s) && (e = s - Math.floor(s)), e;
}
var ls = {
  formatters: zr
};
function rc(s) {
  s.set("scale", {
    display: !0,
    offset: !1,
    reverse: !1,
    beginAtZero: !1,
    bounds: "ticks",
    clip: !0,
    grace: 0,
    grid: {
      display: !0,
      lineWidth: 1,
      drawOnChartArea: !0,
      drawTicks: !0,
      tickLength: 8,
      tickWidth: (t, e) => e.lineWidth,
      tickColor: (t, e) => e.color,
      offset: !1
    },
    border: {
      display: !0,
      dash: [],
      dashOffset: 0,
      width: 1
    },
    title: {
      display: !1,
      text: "",
      padding: {
        top: 4,
        bottom: 4
      }
    },
    ticks: {
      minRotation: 0,
      maxRotation: 50,
      mirror: !1,
      textStrokeWidth: 0,
      textStrokeColor: "",
      padding: 3,
      display: !0,
      autoSkip: !0,
      autoSkipPadding: 3,
      labelOffset: 0,
      callback: ls.formatters.values,
      minor: {},
      major: {},
      align: "center",
      crossAlign: "near",
      showLabelBackdrop: !1,
      backdropColor: "rgba(255, 255, 255, 0.75)",
      backdropPadding: 2
    }
  }), s.route("scale.ticks", "color", "", "color"), s.route("scale.grid", "color", "", "borderColor"), s.route("scale.border", "color", "", "borderColor"), s.route("scale.title", "color", "", "color"), s.describe("scale", {
    _fallback: !1,
    _scriptable: (t) => !t.startsWith("before") && !t.startsWith("after") && t !== "callback" && t !== "parser",
    _indexable: (t) => t !== "borderDash" && t !== "tickBorderDash" && t !== "dash"
  }), s.describe("scales", {
    _fallback: "scale"
  }), s.describe("scale.ticks", {
    _scriptable: (t) => t !== "backdropPadding" && t !== "callback",
    _indexable: (t) => t !== "backdropPadding"
  });
}
const Ee = /* @__PURE__ */ Object.create(null), Us = /* @__PURE__ */ Object.create(null);
function ci(s, t) {
  if (!t)
    return s;
  const e = t.split(".");
  for (let i = 0, n = e.length; i < n; ++i) {
    const o = e[i];
    s = s[o] || (s[o] = /* @__PURE__ */ Object.create(null));
  }
  return s;
}
function vs(s, t, e) {
  return typeof t == "string" ? fi(ci(s, t), e) : fi(ci(s, ""), t);
}
class ac {
  constructor(t, e) {
    this.animation = void 0, this.backgroundColor = "rgba(0,0,0,0.1)", this.borderColor = "rgba(0,0,0,0.1)", this.color = "#666", this.datasets = {}, this.devicePixelRatio = (i) => i.chart.platform.getDevicePixelRatio(), this.elements = {}, this.events = [
      "mousemove",
      "mouseout",
      "click",
      "touchstart",
      "touchmove"
    ], this.font = {
      family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      size: 12,
      style: "normal",
      lineHeight: 1.2,
      weight: null
    }, this.hover = {}, this.hoverBackgroundColor = (i, n) => xs(n.backgroundColor), this.hoverBorderColor = (i, n) => xs(n.borderColor), this.hoverColor = (i, n) => xs(n.color), this.indexAxis = "x", this.interaction = {
      mode: "nearest",
      intersect: !0,
      includeInvisible: !1
    }, this.maintainAspectRatio = !0, this.onHover = null, this.onClick = null, this.parsing = !0, this.plugins = {}, this.responsive = !0, this.scale = void 0, this.scales = {}, this.showLine = !0, this.drawActiveElementsOnTop = !0, this.describe(t), this.apply(e);
  }
  set(t, e) {
    return vs(this, t, e);
  }
  get(t) {
    return ci(this, t);
  }
  describe(t, e) {
    return vs(Us, t, e);
  }
  override(t, e) {
    return vs(Ee, t, e);
  }
  route(t, e, i, n) {
    const o = ci(this, t), r = ci(this, i), a = "_" + e;
    Object.defineProperties(o, {
      [a]: {
        value: o[e],
        writable: !0
      },
      [e]: {
        enumerable: !0,
        get() {
          const l = this[a], c = r[n];
          return U(l) ? Object.assign({}, c, l) : W(l, c);
        },
        set(l) {
          this[a] = l;
        }
      }
    });
  }
  apply(t) {
    t.forEach((e) => e(this));
  }
}
var nt = /* @__PURE__ */ new ac({
  _scriptable: (s) => !s.startsWith("on"),
  _indexable: (s) => s !== "events",
  hover: {
    _fallback: "interaction"
  },
  interaction: {
    _scriptable: !1,
    _indexable: !1
  }
}, [
  ic,
  sc,
  rc
]);
function lc(s) {
  return !s || j(s.size) || j(s.family) ? null : (s.style ? s.style + " " : "") + (s.weight ? s.weight + " " : "") + s.size + "px " + s.family;
}
function is(s, t, e, i, n) {
  let o = t[n];
  return o || (o = t[n] = s.measureText(n).width, e.push(n)), o > i && (i = o), i;
}
function cc(s, t, e, i) {
  i = i || {};
  let n = i.data = i.data || {}, o = i.garbageCollect = i.garbageCollect || [];
  i.font !== t && (n = i.data = {}, o = i.garbageCollect = [], i.font = t), s.save(), s.font = t;
  let r = 0;
  const a = e.length;
  let l, c, h, u, d;
  for (l = 0; l < a; l++)
    if (u = e[l], u != null && !st(u))
      r = is(s, n, o, r, u);
    else if (st(u))
      for (c = 0, h = u.length; c < h; c++)
        d = u[c], d != null && !st(d) && (r = is(s, n, o, r, d));
  s.restore();
  const f = o.length / 2;
  if (f > e.length) {
    for (l = 0; l < f; l++)
      delete n[o[l]];
    o.splice(0, f);
  }
  return r;
}
function xe(s, t, e) {
  const i = s.currentDevicePixelRatio, n = e !== 0 ? Math.max(e / 2, 0.5) : 0;
  return Math.round((t - n) * i) / i + n;
}
function to(s, t) {
  !t && !s || (t = t || s.getContext("2d"), t.save(), t.resetTransform(), t.clearRect(0, 0, s.width, s.height), t.restore());
}
function Ys(s, t, e, i) {
  Br(s, t, e, i, null);
}
function Br(s, t, e, i, n) {
  let o, r, a, l, c, h, u, d;
  const f = t.pointStyle, g = t.rotation, p = t.radius;
  let m = (g || 0) * Wl;
  if (f && typeof f == "object" && (o = f.toString(), o === "[object HTMLImageElement]" || o === "[object HTMLCanvasElement]")) {
    s.save(), s.translate(e, i), s.rotate(m), s.drawImage(f, -f.width / 2, -f.height / 2, f.width, f.height), s.restore();
    return;
  }
  if (!(isNaN(p) || p <= 0)) {
    switch (s.beginPath(), f) {
      default:
        n ? s.ellipse(e, i, n / 2, p, 0, 0, it) : s.arc(e, i, p, 0, it), s.closePath();
        break;
      case "triangle":
        h = n ? n / 2 : p, s.moveTo(e + Math.sin(m) * h, i - Math.cos(m) * p), m += Un, s.lineTo(e + Math.sin(m) * h, i - Math.cos(m) * p), m += Un, s.lineTo(e + Math.sin(m) * h, i - Math.cos(m) * p), s.closePath();
        break;
      case "rectRounded":
        c = p * 0.516, l = p - c, r = Math.cos(m + ye) * l, u = Math.cos(m + ye) * (n ? n / 2 - c : l), a = Math.sin(m + ye) * l, d = Math.sin(m + ye) * (n ? n / 2 - c : l), s.arc(e - u, i - a, c, m - K, m - lt), s.arc(e + d, i - r, c, m - lt, m), s.arc(e + u, i + a, c, m, m + lt), s.arc(e - d, i + r, c, m + lt, m + K), s.closePath();
        break;
      case "rect":
        if (!g) {
          l = Math.SQRT1_2 * p, h = n ? n / 2 : l, s.rect(e - h, i - l, 2 * h, 2 * l);
          break;
        }
        m += ye;
      case "rectRot":
        u = Math.cos(m) * (n ? n / 2 : p), r = Math.cos(m) * p, a = Math.sin(m) * p, d = Math.sin(m) * (n ? n / 2 : p), s.moveTo(e - u, i - a), s.lineTo(e + d, i - r), s.lineTo(e + u, i + a), s.lineTo(e - d, i + r), s.closePath();
        break;
      case "crossRot":
        m += ye;
      case "cross":
        u = Math.cos(m) * (n ? n / 2 : p), r = Math.cos(m) * p, a = Math.sin(m) * p, d = Math.sin(m) * (n ? n / 2 : p), s.moveTo(e - u, i - a), s.lineTo(e + u, i + a), s.moveTo(e + d, i - r), s.lineTo(e - d, i + r);
        break;
      case "star":
        u = Math.cos(m) * (n ? n / 2 : p), r = Math.cos(m) * p, a = Math.sin(m) * p, d = Math.sin(m) * (n ? n / 2 : p), s.moveTo(e - u, i - a), s.lineTo(e + u, i + a), s.moveTo(e + d, i - r), s.lineTo(e - d, i + r), m += ye, u = Math.cos(m) * (n ? n / 2 : p), r = Math.cos(m) * p, a = Math.sin(m) * p, d = Math.sin(m) * (n ? n / 2 : p), s.moveTo(e - u, i - a), s.lineTo(e + u, i + a), s.moveTo(e + d, i - r), s.lineTo(e - d, i + r);
        break;
      case "line":
        r = n ? n / 2 : Math.cos(m) * p, a = Math.sin(m) * p, s.moveTo(e - r, i - a), s.lineTo(e + r, i + a);
        break;
      case "dash":
        s.moveTo(e, i), s.lineTo(e + Math.cos(m) * (n ? n / 2 : p), i + Math.sin(m) * p);
        break;
      case !1:
        s.closePath();
        break;
    }
    s.fill(), t.borderWidth > 0 && s.stroke();
  }
}
function ne(s, t, e) {
  return e = e || 0.5, !t || s && s.x > t.left - e && s.x < t.right + e && s.y > t.top - e && s.y < t.bottom + e;
}
function cs(s, t) {
  s.save(), s.beginPath(), s.rect(t.left, t.top, t.right - t.left, t.bottom - t.top), s.clip();
}
function hs(s) {
  s.restore();
}
function hc(s, t, e, i, n) {
  if (!t)
    return s.lineTo(e.x, e.y);
  if (n === "middle") {
    const o = (t.x + e.x) / 2;
    s.lineTo(o, t.y), s.lineTo(o, e.y);
  } else n === "after" != !!i ? s.lineTo(t.x, e.y) : s.lineTo(e.x, t.y);
  s.lineTo(e.x, e.y);
}
function uc(s, t, e, i) {
  if (!t)
    return s.lineTo(e.x, e.y);
  s.bezierCurveTo(i ? t.cp1x : t.cp2x, i ? t.cp1y : t.cp2y, i ? e.cp2x : e.cp1x, i ? e.cp2y : e.cp1y, e.x, e.y);
}
function dc(s, t) {
  t.translation && s.translate(t.translation[0], t.translation[1]), j(t.rotation) || s.rotate(t.rotation), t.color && (s.fillStyle = t.color), t.textAlign && (s.textAlign = t.textAlign), t.textBaseline && (s.textBaseline = t.textBaseline);
}
function fc(s, t, e, i, n) {
  if (n.strikethrough || n.underline) {
    const o = s.measureText(i), r = t - o.actualBoundingBoxLeft, a = t + o.actualBoundingBoxRight, l = e - o.actualBoundingBoxAscent, c = e + o.actualBoundingBoxDescent, h = n.strikethrough ? (l + c) / 2 : c;
    s.strokeStyle = s.fillStyle, s.beginPath(), s.lineWidth = n.decorationWidth || 2, s.moveTo(r, h), s.lineTo(a, h), s.stroke();
  }
}
function gc(s, t) {
  const e = s.fillStyle;
  s.fillStyle = t.color, s.fillRect(t.left, t.top, t.width, t.height), s.fillStyle = e;
}
function Oe(s, t, e, i, n, o = {}) {
  const r = st(t) ? t : [
    t
  ], a = o.strokeWidth > 0 && o.strokeColor !== "";
  let l, c;
  for (s.save(), s.font = n.string, dc(s, o), l = 0; l < r.length; ++l)
    c = r[l], o.backdrop && gc(s, o.backdrop), a && (o.strokeColor && (s.strokeStyle = o.strokeColor), j(o.strokeWidth) || (s.lineWidth = o.strokeWidth), s.strokeText(c, e, i, o.maxWidth)), s.fillText(c, e, i, o.maxWidth), fc(s, e, i, c, o), i += Number(n.lineHeight);
  s.restore();
}
function mi(s, t) {
  const { x: e, y: i, w: n, h: o, radius: r } = t;
  s.arc(e + r.topLeft, i + r.topLeft, r.topLeft, 1.5 * K, K, !0), s.lineTo(e, i + o - r.bottomLeft), s.arc(e + r.bottomLeft, i + o - r.bottomLeft, r.bottomLeft, K, lt, !0), s.lineTo(e + n - r.bottomRight, i + o), s.arc(e + n - r.bottomRight, i + o - r.bottomRight, r.bottomRight, lt, 0, !0), s.lineTo(e + n, i + r.topRight), s.arc(e + n - r.topRight, i + r.topRight, r.topRight, 0, -lt, !0), s.lineTo(e + r.topLeft, i);
}
const pc = /^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/, mc = /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;
function bc(s, t) {
  const e = ("" + s).match(pc);
  if (!e || e[1] === "normal")
    return t * 1.2;
  switch (s = +e[2], e[3]) {
    case "px":
      return s;
    case "%":
      s /= 100;
      break;
  }
  return t * s;
}
const _c = (s) => +s || 0;
function xn(s, t) {
  const e = {}, i = U(t), n = i ? Object.keys(t) : t, o = U(s) ? i ? (r) => W(s[r], s[t[r]]) : (r) => s[r] : () => s;
  for (const r of n)
    e[r] = _c(o(r));
  return e;
}
function Hr(s) {
  return xn(s, {
    top: "y",
    right: "x",
    bottom: "y",
    left: "x"
  });
}
function Ae(s) {
  return xn(s, [
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight"
  ]);
}
function Mt(s) {
  const t = Hr(s);
  return t.width = t.left + t.right, t.height = t.top + t.bottom, t;
}
function ft(s, t) {
  s = s || {}, t = t || nt.font;
  let e = W(s.size, t.size);
  typeof e == "string" && (e = parseInt(e, 10));
  let i = W(s.style, t.style);
  i && !("" + i).match(mc) && (console.warn('Invalid font style specified: "' + i + '"'), i = void 0);
  const n = {
    family: W(s.family, t.family),
    lineHeight: bc(W(s.lineHeight, t.lineHeight), e),
    size: e,
    style: i,
    weight: W(s.weight, t.weight),
    string: ""
  };
  return n.string = lc(n), n;
}
function ti(s, t, e, i) {
  let n, o, r;
  for (n = 0, o = s.length; n < o; ++n)
    if (r = s[n], r !== void 0 && r !== void 0)
      return r;
}
function yc(s, t, e) {
  const { min: i, max: n } = s, o = Cr(t, (n - i) / 2), r = (a, l) => e && a === 0 ? 0 : a + l;
  return {
    min: r(i, -Math.abs(o)),
    max: r(n, o)
  };
}
function be(s, t) {
  return Object.assign(Object.create(s), t);
}
function vn(s, t = [
  ""
], e, i, n = () => s[0]) {
  const o = e || s;
  typeof i > "u" && (i = Vr("_fallback", s));
  const r = {
    [Symbol.toStringTag]: "Object",
    _cacheable: !0,
    _scopes: s,
    _rootScopes: o,
    _fallback: i,
    _getTarget: n,
    override: (a) => vn([
      a,
      ...s
    ], t, o, i)
  };
  return new Proxy(r, {
    /**
    * A trap for the delete operator.
    */
    deleteProperty(a, l) {
      return delete a[l], delete a._keys, delete s[0][l], !0;
    },
    /**
    * A trap for getting property values.
    */
    get(a, l) {
      return qr(a, l, () => Ac(l, t, s, a));
    },
    /**
    * A trap for Object.getOwnPropertyDescriptor.
    * Also used by Object.hasOwnProperty.
    */
    getOwnPropertyDescriptor(a, l) {
      return Reflect.getOwnPropertyDescriptor(a._scopes[0], l);
    },
    /**
    * A trap for Object.getPrototypeOf.
    */
    getPrototypeOf() {
      return Reflect.getPrototypeOf(s[0]);
    },
    /**
    * A trap for the in operator.
    */
    has(a, l) {
      return io(a).includes(l);
    },
    /**
    * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
    */
    ownKeys(a) {
      return io(a);
    },
    /**
    * A trap for setting property values.
    */
    set(a, l, c) {
      const h = a._storage || (a._storage = n());
      return a[l] = h[l] = c, delete a._keys, !0;
    }
  });
}
function $e(s, t, e, i) {
  const n = {
    _cacheable: !1,
    _proxy: s,
    _context: t,
    _subProxy: e,
    _stack: /* @__PURE__ */ new Set(),
    _descriptors: $r(s, i),
    setContext: (o) => $e(s, o, e, i),
    override: (o) => $e(s.override(o), t, e, i)
  };
  return new Proxy(n, {
    /**
    * A trap for the delete operator.
    */
    deleteProperty(o, r) {
      return delete o[r], delete s[r], !0;
    },
    /**
    * A trap for getting property values.
    */
    get(o, r, a) {
      return qr(o, r, () => vc(o, r, a));
    },
    /**
    * A trap for Object.getOwnPropertyDescriptor.
    * Also used by Object.hasOwnProperty.
    */
    getOwnPropertyDescriptor(o, r) {
      return o._descriptors.allKeys ? Reflect.has(s, r) ? {
        enumerable: !0,
        configurable: !0
      } : void 0 : Reflect.getOwnPropertyDescriptor(s, r);
    },
    /**
    * A trap for Object.getPrototypeOf.
    */
    getPrototypeOf() {
      return Reflect.getPrototypeOf(s);
    },
    /**
    * A trap for the in operator.
    */
    has(o, r) {
      return Reflect.has(s, r);
    },
    /**
    * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
    */
    ownKeys() {
      return Reflect.ownKeys(s);
    },
    /**
    * A trap for setting property values.
    */
    set(o, r, a) {
      return s[r] = a, delete o[r], !0;
    }
  });
}
function $r(s, t = {
  scriptable: !0,
  indexable: !0
}) {
  const { _scriptable: e = t.scriptable, _indexable: i = t.indexable, _allKeys: n = t.allKeys } = s;
  return {
    allKeys: n,
    scriptable: e,
    indexable: i,
    isScriptable: me(e) ? e : () => e,
    isIndexable: me(i) ? i : () => i
  };
}
const xc = (s, t) => s ? s + pn(t) : t, wn = (s, t) => U(t) && s !== "adapters" && (Object.getPrototypeOf(t) === null || t.constructor === Object);
function qr(s, t, e) {
  if (Object.prototype.hasOwnProperty.call(s, t) || t === "constructor")
    return s[t];
  const i = e();
  return s[t] = i, i;
}
function vc(s, t, e) {
  const { _proxy: i, _context: n, _subProxy: o, _descriptors: r } = s;
  let a = i[t];
  return me(a) && r.isScriptable(t) && (a = wc(t, a, s, e)), st(a) && a.length && (a = Sc(t, a, s, r.isIndexable)), wn(t, a) && (a = $e(a, n, o && o[t], r)), a;
}
function wc(s, t, e, i) {
  const { _proxy: n, _context: o, _subProxy: r, _stack: a } = e;
  if (a.has(s))
    throw new Error("Recursion detected: " + Array.from(a).join("->") + "->" + s);
  a.add(s);
  let l = t(o, r || i);
  return a.delete(s), wn(s, l) && (l = Sn(n._scopes, n, s, l)), l;
}
function Sc(s, t, e, i) {
  const { _proxy: n, _context: o, _subProxy: r, _descriptors: a } = e;
  if (typeof o.index < "u" && i(s))
    return t[o.index % t.length];
  if (U(t[0])) {
    const l = t, c = n._scopes.filter((h) => h !== l);
    t = [];
    for (const h of l) {
      const u = Sn(c, n, s, h);
      t.push($e(u, o, r && r[s], a));
    }
  }
  return t;
}
function Wr(s, t, e) {
  return me(s) ? s(t, e) : s;
}
const Mc = (s, t) => s === !0 ? t : typeof s == "string" ? pe(t, s) : void 0;
function kc(s, t, e, i, n) {
  for (const o of t) {
    const r = Mc(e, o);
    if (r) {
      s.add(r);
      const a = Wr(r._fallback, e, n);
      if (typeof a < "u" && a !== e && a !== i)
        return a;
    } else if (r === !1 && typeof i < "u" && e !== i)
      return null;
  }
  return !1;
}
function Sn(s, t, e, i) {
  const n = t._rootScopes, o = Wr(t._fallback, e, i), r = [
    ...s,
    ...n
  ], a = /* @__PURE__ */ new Set();
  a.add(i);
  let l = eo(a, r, e, o || e, i);
  return l === null || typeof o < "u" && o !== e && (l = eo(a, r, o, l, i), l === null) ? !1 : vn(Array.from(a), [
    ""
  ], n, o, () => Pc(t, e, i));
}
function eo(s, t, e, i, n) {
  for (; e; )
    e = kc(s, t, e, i, n);
  return e;
}
function Pc(s, t, e) {
  const i = s._getTarget();
  t in i || (i[t] = {});
  const n = i[t];
  return st(n) && U(e) ? e : n || {};
}
function Ac(s, t, e, i) {
  let n;
  for (const o of t)
    if (n = Vr(xc(o, s), e), typeof n < "u")
      return wn(s, n) ? Sn(e, i, s, n) : n;
}
function Vr(s, t) {
  for (const e of t) {
    if (!e)
      continue;
    const i = e[s];
    if (typeof i < "u")
      return i;
  }
}
function io(s) {
  let t = s._keys;
  return t || (t = s._keys = Cc(s._scopes)), t;
}
function Cc(s) {
  const t = /* @__PURE__ */ new Set();
  for (const e of s)
    for (const i of Object.keys(e).filter((n) => !n.startsWith("_")))
      t.add(i);
  return Array.from(t);
}
function jr(s, t, e, i) {
  const { iScale: n } = s, { key: o = "r" } = this._parsing, r = new Array(i);
  let a, l, c, h;
  for (a = 0, l = i; a < l; ++a)
    c = a + e, h = t[c], r[a] = {
      r: n.parse(pe(h, o), c)
    };
  return r;
}
const Tc = Number.EPSILON || 1e-14, qe = (s, t) => t < s.length && !s[t].skip && s[t], Ur = (s) => s === "x" ? "y" : "x";
function Ec(s, t, e, i) {
  const n = s.skip ? t : s, o = t, r = e.skip ? t : e, a = js(o, n), l = js(r, o);
  let c = a / (a + l), h = l / (a + l);
  c = isNaN(c) ? 0 : c, h = isNaN(h) ? 0 : h;
  const u = i * c, d = i * h;
  return {
    previous: {
      x: o.x - u * (r.x - n.x),
      y: o.y - u * (r.y - n.y)
    },
    next: {
      x: o.x + d * (r.x - n.x),
      y: o.y + d * (r.y - n.y)
    }
  };
}
function Oc(s, t, e) {
  const i = s.length;
  let n, o, r, a, l, c = qe(s, 0);
  for (let h = 0; h < i - 1; ++h)
    if (l = c, c = qe(s, h + 1), !(!l || !c)) {
      if (ai(t[h], 0, Tc)) {
        e[h] = e[h + 1] = 0;
        continue;
      }
      n = e[h] / t[h], o = e[h + 1] / t[h], a = Math.pow(n, 2) + Math.pow(o, 2), !(a <= 9) && (r = 3 / Math.sqrt(a), e[h] = n * r * t[h], e[h + 1] = o * r * t[h]);
    }
}
function Dc(s, t, e = "x") {
  const i = Ur(e), n = s.length;
  let o, r, a, l = qe(s, 0);
  for (let c = 0; c < n; ++c) {
    if (r = a, a = l, l = qe(s, c + 1), !a)
      continue;
    const h = a[e], u = a[i];
    r && (o = (h - r[e]) / 3, a[`cp1${e}`] = h - o, a[`cp1${i}`] = u - o * t[c]), l && (o = (l[e] - h) / 3, a[`cp2${e}`] = h + o, a[`cp2${i}`] = u + o * t[c]);
  }
}
function Lc(s, t = "x") {
  const e = Ur(t), i = s.length, n = Array(i).fill(0), o = Array(i);
  let r, a, l, c = qe(s, 0);
  for (r = 0; r < i; ++r)
    if (a = l, l = c, c = qe(s, r + 1), !!l) {
      if (c) {
        const h = c[t] - l[t];
        n[r] = h !== 0 ? (c[e] - l[e]) / h : 0;
      }
      o[r] = a ? c ? Kt(n[r - 1]) !== Kt(n[r]) ? 0 : (n[r - 1] + n[r]) / 2 : n[r - 1] : n[r];
    }
  Oc(s, n, o), Dc(s, o, t);
}
function Ti(s, t, e) {
  return Math.max(Math.min(s, e), t);
}
function Rc(s, t) {
  let e, i, n, o, r, a = ne(s[0], t);
  for (e = 0, i = s.length; e < i; ++e)
    r = o, o = a, a = e < i - 1 && ne(s[e + 1], t), o && (n = s[e], r && (n.cp1x = Ti(n.cp1x, t.left, t.right), n.cp1y = Ti(n.cp1y, t.top, t.bottom)), a && (n.cp2x = Ti(n.cp2x, t.left, t.right), n.cp2y = Ti(n.cp2y, t.top, t.bottom)));
}
function Ic(s, t, e, i, n) {
  let o, r, a, l;
  if (t.spanGaps && (s = s.filter((c) => !c.skip)), t.cubicInterpolationMode === "monotone")
    Lc(s, n);
  else {
    let c = i ? s[s.length - 1] : s[0];
    for (o = 0, r = s.length; o < r; ++o)
      a = s[o], l = Ec(c, a, s[Math.min(o + 1, r - (i ? 0 : 1)) % r], t.tension), a.cp1x = l.previous.x, a.cp1y = l.previous.y, a.cp2x = l.next.x, a.cp2y = l.next.y, c = a;
  }
  t.capBezierPoints && Rc(s, e);
}
function Mn() {
  return typeof window < "u" && typeof document < "u";
}
function kn(s) {
  let t = s.parentNode;
  return t && t.toString() === "[object ShadowRoot]" && (t = t.host), t;
}
function ss(s, t, e) {
  let i;
  return typeof s == "string" ? (i = parseInt(s, 10), s.indexOf("%") !== -1 && (i = i / 100 * t.parentNode[e])) : i = s, i;
}
const us = (s) => s.ownerDocument.defaultView.getComputedStyle(s, null);
function Fc(s, t) {
  return us(s).getPropertyValue(t);
}
const Nc = [
  "top",
  "right",
  "bottom",
  "left"
];
function Ce(s, t, e) {
  const i = {};
  e = e ? "-" + e : "";
  for (let n = 0; n < 4; n++) {
    const o = Nc[n];
    i[o] = parseFloat(s[t + "-" + o + e]) || 0;
  }
  return i.width = i.left + i.right, i.height = i.top + i.bottom, i;
}
const zc = (s, t, e) => (s > 0 || t > 0) && (!e || !e.shadowRoot);
function Bc(s, t) {
  const e = s.touches, i = e && e.length ? e[0] : s, { offsetX: n, offsetY: o } = i;
  let r = !1, a, l;
  if (zc(n, o, s.target))
    a = n, l = o;
  else {
    const c = t.getBoundingClientRect();
    a = i.clientX - c.left, l = i.clientY - c.top, r = !0;
  }
  return {
    x: a,
    y: l,
    box: r
  };
}
function Me(s, t) {
  if ("native" in s)
    return s;
  const { canvas: e, currentDevicePixelRatio: i } = t, n = us(e), o = n.boxSizing === "border-box", r = Ce(n, "padding"), a = Ce(n, "border", "width"), { x: l, y: c, box: h } = Bc(s, e), u = r.left + (h && a.left), d = r.top + (h && a.top);
  let { width: f, height: g } = t;
  return o && (f -= r.width + a.width, g -= r.height + a.height), {
    x: Math.round((l - u) / f * e.width / i),
    y: Math.round((c - d) / g * e.height / i)
  };
}
function Hc(s, t, e) {
  let i, n;
  if (t === void 0 || e === void 0) {
    const o = s && kn(s);
    if (!o)
      t = s.clientWidth, e = s.clientHeight;
    else {
      const r = o.getBoundingClientRect(), a = us(o), l = Ce(a, "border", "width"), c = Ce(a, "padding");
      t = r.width - c.width - l.width, e = r.height - c.height - l.height, i = ss(a.maxWidth, o, "clientWidth"), n = ss(a.maxHeight, o, "clientHeight");
    }
  }
  return {
    width: t,
    height: e,
    maxWidth: i || es,
    maxHeight: n || es
  };
}
const Ei = (s) => Math.round(s * 10) / 10;
function $c(s, t, e, i) {
  const n = us(s), o = Ce(n, "margin"), r = ss(n.maxWidth, s, "clientWidth") || es, a = ss(n.maxHeight, s, "clientHeight") || es, l = Hc(s, t, e);
  let { width: c, height: h } = l;
  if (n.boxSizing === "content-box") {
    const d = Ce(n, "border", "width"), f = Ce(n, "padding");
    c -= f.width + d.width, h -= f.height + d.height;
  }
  return c = Math.max(0, c - o.width), h = Math.max(0, i ? c / i : h - o.height), c = Ei(Math.min(c, r, l.maxWidth)), h = Ei(Math.min(h, a, l.maxHeight)), c && !h && (h = Ei(c / 2)), (t !== void 0 || e !== void 0) && i && l.height && h > l.height && (h = l.height, c = Ei(Math.floor(h * i))), {
    width: c,
    height: h
  };
}
function so(s, t, e) {
  const i = t || 1, n = Math.floor(s.height * i), o = Math.floor(s.width * i);
  s.height = Math.floor(s.height), s.width = Math.floor(s.width);
  const r = s.canvas;
  return r.style && (e || !r.style.height && !r.style.width) && (r.style.height = `${s.height}px`, r.style.width = `${s.width}px`), s.currentDevicePixelRatio !== i || r.height !== n || r.width !== o ? (s.currentDevicePixelRatio = i, r.height = n, r.width = o, s.ctx.setTransform(i, 0, 0, i, 0, 0), !0) : !1;
}
const qc = function() {
  let s = !1;
  try {
    const t = {
      get passive() {
        return s = !0, !1;
      }
    };
    Mn() && (window.addEventListener("test", null, t), window.removeEventListener("test", null, t));
  } catch {
  }
  return s;
}();
function no(s, t) {
  const e = Fc(s, t), i = e && e.match(/^(\d+)(\.\d+)?px$/);
  return i ? +i[1] : void 0;
}
function ke(s, t, e, i) {
  return {
    x: s.x + e * (t.x - s.x),
    y: s.y + e * (t.y - s.y)
  };
}
function Wc(s, t, e, i) {
  return {
    x: s.x + e * (t.x - s.x),
    y: i === "middle" ? e < 0.5 ? s.y : t.y : i === "after" ? e < 1 ? s.y : t.y : e > 0 ? t.y : s.y
  };
}
function Vc(s, t, e, i) {
  const n = {
    x: s.cp2x,
    y: s.cp2y
  }, o = {
    x: t.cp1x,
    y: t.cp1y
  }, r = ke(s, n, e), a = ke(n, o, e), l = ke(o, t, e), c = ke(r, a, e), h = ke(a, l, e);
  return ke(c, h, e);
}
const jc = function(s, t) {
  return {
    x(e) {
      return s + s + t - e;
    },
    setWidth(e) {
      t = e;
    },
    textAlign(e) {
      return e === "center" ? e : e === "right" ? "left" : "right";
    },
    xPlus(e, i) {
      return e - i;
    },
    leftForLtr(e, i) {
      return e - i;
    }
  };
}, Uc = function() {
  return {
    x(s) {
      return s;
    },
    setWidth(s) {
    },
    textAlign(s) {
      return s;
    },
    xPlus(s, t) {
      return s + t;
    },
    leftForLtr(s, t) {
      return s;
    }
  };
};
function Be(s, t, e) {
  return s ? jc(t, e) : Uc();
}
function Yr(s, t) {
  let e, i;
  (t === "ltr" || t === "rtl") && (e = s.canvas.style, i = [
    e.getPropertyValue("direction"),
    e.getPropertyPriority("direction")
  ], e.setProperty("direction", t, "important"), s.prevTextDirection = i);
}
function Kr(s, t) {
  t !== void 0 && (delete s.prevTextDirection, s.canvas.style.setProperty("direction", t[0], t[1]));
}
function Xr(s) {
  return s === "angle" ? {
    between: pi,
    compare: Yl,
    normalize: wt
  } : {
    between: ie,
    compare: (t, e) => t - e,
    normalize: (t) => t
  };
}
function oo({ start: s, end: t, count: e, loop: i, style: n }) {
  return {
    start: s % e,
    end: t % e,
    loop: i && (t - s + 1) % e === 0,
    style: n
  };
}
function Yc(s, t, e) {
  const { property: i, start: n, end: o } = e, { between: r, normalize: a } = Xr(i), l = t.length;
  let { start: c, end: h, loop: u } = s, d, f;
  if (u) {
    for (c += l, h += l, d = 0, f = l; d < f && r(a(t[c % l][i]), n, o); ++d)
      c--, h--;
    c %= l, h %= l;
  }
  return h < c && (h += l), {
    start: c,
    end: h,
    loop: u,
    style: s.style
  };
}
function Gr(s, t, e) {
  if (!e)
    return [
      s
    ];
  const { property: i, start: n, end: o } = e, r = t.length, { compare: a, between: l, normalize: c } = Xr(i), { start: h, end: u, loop: d, style: f } = Yc(s, t, e), g = [];
  let p = !1, m = null, b, _, k;
  const M = () => l(n, k, b) && a(n, k) !== 0, S = () => a(o, b) === 0 || l(o, k, b), O = () => p || M(), C = () => !p || S();
  for (let A = h, L = h; A <= u; ++A)
    _ = t[A % r], !_.skip && (b = c(_[i]), b !== k && (p = l(b, n, o), m === null && O() && (m = a(b, n) === 0 ? A : L), m !== null && C() && (g.push(oo({
      start: m,
      end: A,
      loop: d,
      count: r,
      style: f
    })), m = null), L = A, k = b));
  return m !== null && g.push(oo({
    start: m,
    end: u,
    loop: d,
    count: r,
    style: f
  })), g;
}
function Qr(s, t) {
  const e = [], i = s.segments;
  for (let n = 0; n < i.length; n++) {
    const o = Gr(i[n], s.points, t);
    o.length && e.push(...o);
  }
  return e;
}
function Kc(s, t, e, i) {
  let n = 0, o = t - 1;
  if (e && !i)
    for (; n < t && !s[n].skip; )
      n++;
  for (; n < t && s[n].skip; )
    n++;
  for (n %= t, e && (o += n); o > n && s[o % t].skip; )
    o--;
  return o %= t, {
    start: n,
    end: o
  };
}
function Xc(s, t, e, i) {
  const n = s.length, o = [];
  let r = t, a = s[t], l;
  for (l = t + 1; l <= e; ++l) {
    const c = s[l % n];
    c.skip || c.stop ? a.skip || (i = !1, o.push({
      start: t % n,
      end: (l - 1) % n,
      loop: i
    }), t = r = c.stop ? l : null) : (r = l, a.skip && (t = l)), a = c;
  }
  return r !== null && o.push({
    start: t % n,
    end: r % n,
    loop: i
  }), o;
}
function Gc(s, t) {
  const e = s.points, i = s.options.spanGaps, n = e.length;
  if (!n)
    return [];
  const o = !!s._loop, { start: r, end: a } = Kc(e, n, o, i);
  if (i === !0)
    return ro(s, [
      {
        start: r,
        end: a,
        loop: o
      }
    ], e, t);
  const l = a < r ? a + n : a, c = !!s._fullLoop && r === 0 && a === n - 1;
  return ro(s, Xc(e, r, l, c), e, t);
}
function ro(s, t, e, i) {
  return !i || !i.setContext || !e ? t : Qc(s, t, e, i);
}
function Qc(s, t, e, i) {
  const n = s._chart.getContext(), o = ao(s.options), { _datasetIndex: r, options: { spanGaps: a } } = s, l = e.length, c = [];
  let h = o, u = t[0].start, d = u;
  function f(g, p, m, b) {
    const _ = a ? -1 : 1;
    if (g !== p) {
      for (g += l; e[g % l].skip; )
        g -= _;
      for (; e[p % l].skip; )
        p += _;
      g % l !== p % l && (c.push({
        start: g % l,
        end: p % l,
        loop: m,
        style: b
      }), h = b, u = p % l);
    }
  }
  for (const g of t) {
    u = a ? u : g.start;
    let p = e[u % l], m;
    for (d = u + 1; d <= g.end; d++) {
      const b = e[d % l];
      m = ao(i.setContext(be(n, {
        type: "segment",
        p0: p,
        p1: b,
        p0DataIndex: (d - 1) % l,
        p1DataIndex: d % l,
        datasetIndex: r
      }))), Jc(m, h) && f(u, d - 1, g.loop, h), p = b, h = m;
    }
    u < d - 1 && f(u, d - 1, g.loop, h);
  }
  return c;
}
function ao(s) {
  return {
    backgroundColor: s.backgroundColor,
    borderCapStyle: s.borderCapStyle,
    borderDash: s.borderDash,
    borderDashOffset: s.borderDashOffset,
    borderJoinStyle: s.borderJoinStyle,
    borderWidth: s.borderWidth,
    borderColor: s.borderColor
  };
}
function Jc(s, t) {
  if (!t)
    return !1;
  const e = [], i = function(n, o) {
    return yn(o) ? (e.includes(o) || e.push(o), e.indexOf(o)) : o;
  };
  return JSON.stringify(s, i) !== JSON.stringify(t, i);
}
function Oi(s, t, e) {
  return s.options.clip ? s[e] : t[e];
}
function Zc(s, t) {
  const { xScale: e, yScale: i } = s;
  return e && i ? {
    left: Oi(e, t, "left"),
    right: Oi(e, t, "right"),
    top: Oi(i, t, "top"),
    bottom: Oi(i, t, "bottom")
  } : t;
}
function Jr(s, t) {
  const e = t._clip;
  if (e.disabled)
    return !1;
  const i = Zc(t, s.chartArea);
  return {
    left: e.left === !1 ? 0 : i.left - (e.left === !0 ? 0 : e.left),
    right: e.right === !1 ? s.width : i.right + (e.right === !0 ? 0 : e.right),
    top: e.top === !1 ? 0 : i.top - (e.top === !0 ? 0 : e.top),
    bottom: e.bottom === !1 ? s.height : i.bottom + (e.bottom === !0 ? 0 : e.bottom)
  };
}
/*!
 * Chart.js v4.5.0
 * https://www.chartjs.org
 * (c) 2025 Chart.js Contributors
 * Released under the MIT License
 */
class th {
  constructor() {
    this._request = null, this._charts = /* @__PURE__ */ new Map(), this._running = !1, this._lastDate = void 0;
  }
  _notify(t, e, i, n) {
    const o = e.listeners[n], r = e.duration;
    o.forEach((a) => a({
      chart: t,
      initial: e.initial,
      numSteps: r,
      currentStep: Math.min(i - e.start, r)
    }));
  }
  _refresh() {
    this._request || (this._running = !0, this._request = Rr.call(window, () => {
      this._update(), this._request = null, this._running && this._refresh();
    }));
  }
  _update(t = Date.now()) {
    let e = 0;
    this._charts.forEach((i, n) => {
      if (!i.running || !i.items.length)
        return;
      const o = i.items;
      let r = o.length - 1, a = !1, l;
      for (; r >= 0; --r)
        l = o[r], l._active ? (l._total > i.duration && (i.duration = l._total), l.tick(t), a = !0) : (o[r] = o[o.length - 1], o.pop());
      a && (n.draw(), this._notify(n, i, t, "progress")), o.length || (i.running = !1, this._notify(n, i, t, "complete"), i.initial = !1), e += o.length;
    }), this._lastDate = t, e === 0 && (this._running = !1);
  }
  _getAnims(t) {
    const e = this._charts;
    let i = e.get(t);
    return i || (i = {
      running: !1,
      initial: !0,
      items: [],
      listeners: {
        complete: [],
        progress: []
      }
    }, e.set(t, i)), i;
  }
  listen(t, e, i) {
    this._getAnims(t).listeners[e].push(i);
  }
  add(t, e) {
    !e || !e.length || this._getAnims(t).items.push(...e);
  }
  has(t) {
    return this._getAnims(t).items.length > 0;
  }
  start(t) {
    const e = this._charts.get(t);
    e && (e.running = !0, e.start = Date.now(), e.duration = e.items.reduce((i, n) => Math.max(i, n._duration), 0), this._refresh());
  }
  running(t) {
    if (!this._running)
      return !1;
    const e = this._charts.get(t);
    return !(!e || !e.running || !e.items.length);
  }
  stop(t) {
    const e = this._charts.get(t);
    if (!e || !e.items.length)
      return;
    const i = e.items;
    let n = i.length - 1;
    for (; n >= 0; --n)
      i[n].cancel();
    e.items = [], this._notify(t, e, Date.now(), "complete");
  }
  remove(t) {
    return this._charts.delete(t);
  }
}
var Jt = /* @__PURE__ */ new th();
const lo = "transparent", eh = {
  boolean(s, t, e) {
    return e > 0.5 ? t : s;
  },
  color(s, t, e) {
    const i = Jn(s || lo), n = i.valid && Jn(t || lo);
    return n && n.valid ? n.mix(i, e).hexString() : t;
  },
  number(s, t, e) {
    return s + (t - s) * e;
  }
};
class ih {
  constructor(t, e, i, n) {
    const o = e[i];
    n = ti([
      t.to,
      n,
      o,
      t.from
    ]);
    const r = ti([
      t.from,
      o,
      n
    ]);
    this._active = !0, this._fn = t.fn || eh[t.type || typeof r], this._easing = li[t.easing] || li.linear, this._start = Math.floor(Date.now() + (t.delay || 0)), this._duration = this._total = Math.floor(t.duration), this._loop = !!t.loop, this._target = e, this._prop = i, this._from = r, this._to = n, this._promises = void 0;
  }
  active() {
    return this._active;
  }
  update(t, e, i) {
    if (this._active) {
      this._notify(!1);
      const n = this._target[this._prop], o = i - this._start, r = this._duration - o;
      this._start = i, this._duration = Math.floor(Math.max(r, t.duration)), this._total += o, this._loop = !!t.loop, this._to = ti([
        t.to,
        e,
        n,
        t.from
      ]), this._from = ti([
        t.from,
        n,
        e
      ]);
    }
  }
  cancel() {
    this._active && (this.tick(Date.now()), this._active = !1, this._notify(!1));
  }
  tick(t) {
    const e = t - this._start, i = this._duration, n = this._prop, o = this._from, r = this._loop, a = this._to;
    let l;
    if (this._active = o !== a && (r || e < i), !this._active) {
      this._target[n] = a, this._notify(!0);
      return;
    }
    if (e < 0) {
      this._target[n] = o;
      return;
    }
    l = e / i % 2, l = r && l > 1 ? 2 - l : l, l = this._easing(Math.min(1, Math.max(0, l))), this._target[n] = this._fn(o, a, l);
  }
  wait() {
    const t = this._promises || (this._promises = []);
    return new Promise((e, i) => {
      t.push({
        res: e,
        rej: i
      });
    });
  }
  _notify(t) {
    const e = t ? "res" : "rej", i = this._promises || [];
    for (let n = 0; n < i.length; n++)
      i[n][e]();
  }
}
class Zr {
  constructor(t, e) {
    this._chart = t, this._properties = /* @__PURE__ */ new Map(), this.configure(e);
  }
  configure(t) {
    if (!U(t))
      return;
    const e = Object.keys(nt.animation), i = this._properties;
    Object.getOwnPropertyNames(t).forEach((n) => {
      const o = t[n];
      if (!U(o))
        return;
      const r = {};
      for (const a of e)
        r[a] = o[a];
      (st(o.properties) && o.properties || [
        n
      ]).forEach((a) => {
        (a === n || !i.has(a)) && i.set(a, r);
      });
    });
  }
  _animateOptions(t, e) {
    const i = e.options, n = nh(t, i);
    if (!n)
      return [];
    const o = this._createAnimations(n, i);
    return i.$shared && sh(t.options.$animations, i).then(() => {
      t.options = i;
    }, () => {
    }), o;
  }
  _createAnimations(t, e) {
    const i = this._properties, n = [], o = t.$animations || (t.$animations = {}), r = Object.keys(e), a = Date.now();
    let l;
    for (l = r.length - 1; l >= 0; --l) {
      const c = r[l];
      if (c.charAt(0) === "$")
        continue;
      if (c === "options") {
        n.push(...this._animateOptions(t, e));
        continue;
      }
      const h = e[c];
      let u = o[c];
      const d = i.get(c);
      if (u)
        if (d && u.active()) {
          u.update(d, h, a);
          continue;
        } else
          u.cancel();
      if (!d || !d.duration) {
        t[c] = h;
        continue;
      }
      o[c] = u = new ih(d, t, c, h), n.push(u);
    }
    return n;
  }
  update(t, e) {
    if (this._properties.size === 0) {
      Object.assign(t, e);
      return;
    }
    const i = this._createAnimations(t, e);
    if (i.length)
      return Jt.add(this._chart, i), !0;
  }
}
function sh(s, t) {
  const e = [], i = Object.keys(t);
  for (let n = 0; n < i.length; n++) {
    const o = s[i[n]];
    o && o.active() && e.push(o.wait());
  }
  return Promise.all(e);
}
function nh(s, t) {
  if (!t)
    return;
  let e = s.options;
  if (!e) {
    s.options = t;
    return;
  }
  return e.$shared && (s.options = e = Object.assign({}, e, {
    $shared: !1,
    $animations: {}
  })), e;
}
function co(s, t) {
  const e = s && s.options || {}, i = e.reverse, n = e.min === void 0 ? t : 0, o = e.max === void 0 ? t : 0;
  return {
    start: i ? o : n,
    end: i ? n : o
  };
}
function oh(s, t, e) {
  if (e === !1)
    return !1;
  const i = co(s, e), n = co(t, e);
  return {
    top: n.end,
    right: i.end,
    bottom: n.start,
    left: i.start
  };
}
function rh(s) {
  let t, e, i, n;
  return U(s) ? (t = s.top, e = s.right, i = s.bottom, n = s.left) : t = e = i = n = s, {
    top: t,
    right: e,
    bottom: i,
    left: n,
    disabled: s === !1
  };
}
function ta(s, t) {
  const e = [], i = s._getSortedDatasetMetas(t);
  let n, o;
  for (n = 0, o = i.length; n < o; ++n)
    e.push(i[n].index);
  return e;
}
function ho(s, t, e, i = {}) {
  const n = s.keys, o = i.mode === "single";
  let r, a, l, c;
  if (t === null)
    return;
  let h = !1;
  for (r = 0, a = n.length; r < a; ++r) {
    if (l = +n[r], l === e) {
      if (h = !0, i.all)
        continue;
      break;
    }
    c = s.values[l], at(c) && (o || t === 0 || Kt(t) === Kt(c)) && (t += c);
  }
  return !h && !i.all ? 0 : t;
}
function ah(s, t) {
  const { iScale: e, vScale: i } = t, n = e.axis === "x" ? "x" : "y", o = i.axis === "x" ? "x" : "y", r = Object.keys(s), a = new Array(r.length);
  let l, c, h;
  for (l = 0, c = r.length; l < c; ++l)
    h = r[l], a[l] = {
      [n]: h,
      [o]: s[h]
    };
  return a;
}
function ws(s, t) {
  const e = s && s.options.stacked;
  return e || e === void 0 && t.stack !== void 0;
}
function lh(s, t, e) {
  return `${s.id}.${t.id}.${e.stack || e.type}`;
}
function ch(s) {
  const { min: t, max: e, minDefined: i, maxDefined: n } = s.getUserBounds();
  return {
    min: i ? t : Number.NEGATIVE_INFINITY,
    max: n ? e : Number.POSITIVE_INFINITY
  };
}
function hh(s, t, e) {
  const i = s[t] || (s[t] = {});
  return i[e] || (i[e] = {});
}
function uo(s, t, e, i) {
  for (const n of t.getMatchingVisibleMetas(i).reverse()) {
    const o = s[n.index];
    if (e && o > 0 || !e && o < 0)
      return n.index;
  }
  return null;
}
function fo(s, t) {
  const { chart: e, _cachedMeta: i } = s, n = e._stacks || (e._stacks = {}), { iScale: o, vScale: r, index: a } = i, l = o.axis, c = r.axis, h = lh(o, r, i), u = t.length;
  let d;
  for (let f = 0; f < u; ++f) {
    const g = t[f], { [l]: p, [c]: m } = g, b = g._stacks || (g._stacks = {});
    d = b[c] = hh(n, h, p), d[a] = m, d._top = uo(d, r, !0, i.type), d._bottom = uo(d, r, !1, i.type);
    const _ = d._visualValues || (d._visualValues = {});
    _[a] = m;
  }
}
function Ss(s, t) {
  const e = s.scales;
  return Object.keys(e).filter((i) => e[i].axis === t).shift();
}
function uh(s, t) {
  return be(s, {
    active: !1,
    dataset: void 0,
    datasetIndex: t,
    index: t,
    mode: "default",
    type: "dataset"
  });
}
function dh(s, t, e) {
  return be(s, {
    active: !1,
    dataIndex: t,
    parsed: void 0,
    raw: void 0,
    element: e,
    index: t,
    mode: "default",
    type: "data"
  });
}
function je(s, t) {
  const e = s.controller.index, i = s.vScale && s.vScale.axis;
  if (i) {
    t = t || s._parsed;
    for (const n of t) {
      const o = n._stacks;
      if (!o || o[i] === void 0 || o[i][e] === void 0)
        return;
      delete o[i][e], o[i]._visualValues !== void 0 && o[i]._visualValues[e] !== void 0 && delete o[i]._visualValues[e];
    }
  }
}
const Ms = (s) => s === "reset" || s === "none", go = (s, t) => t ? s : Object.assign({}, s), fh = (s, t, e) => s && !t.hidden && t._stacked && {
  keys: ta(e, !0),
  values: null
};
class qt {
  constructor(t, e) {
    this.chart = t, this._ctx = t.ctx, this.index = e, this._cachedDataOpts = {}, this._cachedMeta = this.getMeta(), this._type = this._cachedMeta.type, this.options = void 0, this._parsing = !1, this._data = void 0, this._objectData = void 0, this._sharedOptions = void 0, this._drawStart = void 0, this._drawCount = void 0, this.enableOptionSharing = !1, this.supportsDecimation = !1, this.$context = void 0, this._syncList = [], this.datasetElementType = new.target.datasetElementType, this.dataElementType = new.target.dataElementType, this.initialize();
  }
  initialize() {
    const t = this._cachedMeta;
    this.configure(), this.linkScales(), t._stacked = ws(t.vScale, t), this.addElements(), this.options.fill && !this.chart.isPluginEnabled("filler") && console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options");
  }
  updateIndex(t) {
    this.index !== t && je(this._cachedMeta), this.index = t;
  }
  linkScales() {
    const t = this.chart, e = this._cachedMeta, i = this.getDataset(), n = (u, d, f, g) => u === "x" ? d : u === "r" ? g : f, o = e.xAxisID = W(i.xAxisID, Ss(t, "x")), r = e.yAxisID = W(i.yAxisID, Ss(t, "y")), a = e.rAxisID = W(i.rAxisID, Ss(t, "r")), l = e.indexAxis, c = e.iAxisID = n(l, o, r, a), h = e.vAxisID = n(l, r, o, a);
    e.xScale = this.getScaleForId(o), e.yScale = this.getScaleForId(r), e.rScale = this.getScaleForId(a), e.iScale = this.getScaleForId(c), e.vScale = this.getScaleForId(h);
  }
  getDataset() {
    return this.chart.data.datasets[this.index];
  }
  getMeta() {
    return this.chart.getDatasetMeta(this.index);
  }
  getScaleForId(t) {
    return this.chart.scales[t];
  }
  _getOtherScale(t) {
    const e = this._cachedMeta;
    return t === e.iScale ? e.vScale : e.iScale;
  }
  reset() {
    this._update("reset");
  }
  _destroy() {
    const t = this._cachedMeta;
    this._data && Xn(this._data, this), t._stacked && je(t);
  }
  _dataCheck() {
    const t = this.getDataset(), e = t.data || (t.data = []), i = this._data;
    if (U(e)) {
      const n = this._cachedMeta;
      this._data = ah(e, n);
    } else if (i !== e) {
      if (i) {
        Xn(i, this);
        const n = this._cachedMeta;
        je(n), n._parsed = [];
      }
      e && Object.isExtensible(e) && Ql(e, this), this._syncList = [], this._data = e;
    }
  }
  addElements() {
    const t = this._cachedMeta;
    this._dataCheck(), this.datasetElementType && (t.dataset = new this.datasetElementType());
  }
  buildOrUpdateElements(t) {
    const e = this._cachedMeta, i = this.getDataset();
    let n = !1;
    this._dataCheck();
    const o = e._stacked;
    e._stacked = ws(e.vScale, e), e.stack !== i.stack && (n = !0, je(e), e.stack = i.stack), this._resyncElements(t), (n || o !== e._stacked) && (fo(this, e._parsed), e._stacked = ws(e.vScale, e));
  }
  configure() {
    const t = this.chart.config, e = t.datasetScopeKeys(this._type), i = t.getOptionScopes(this.getDataset(), e, !0);
    this.options = t.createResolver(i, this.getContext()), this._parsing = this.options.parsing, this._cachedDataOpts = {};
  }
  parse(t, e) {
    const { _cachedMeta: i, _data: n } = this, { iScale: o, _stacked: r } = i, a = o.axis;
    let l = t === 0 && e === n.length ? !0 : i._sorted, c = t > 0 && i._parsed[t - 1], h, u, d;
    if (this._parsing === !1)
      i._parsed = n, i._sorted = !0, d = n;
    else {
      st(n[t]) ? d = this.parseArrayData(i, n, t, e) : U(n[t]) ? d = this.parseObjectData(i, n, t, e) : d = this.parsePrimitiveData(i, n, t, e);
      const f = () => u[a] === null || c && u[a] < c[a];
      for (h = 0; h < e; ++h)
        i._parsed[h + t] = u = d[h], l && (f() && (l = !1), c = u);
      i._sorted = l;
    }
    r && fo(this, d);
  }
  parsePrimitiveData(t, e, i, n) {
    const { iScale: o, vScale: r } = t, a = o.axis, l = r.axis, c = o.getLabels(), h = o === r, u = new Array(n);
    let d, f, g;
    for (d = 0, f = n; d < f; ++d)
      g = d + i, u[d] = {
        [a]: h || o.parse(c[g], g),
        [l]: r.parse(e[g], g)
      };
    return u;
  }
  parseArrayData(t, e, i, n) {
    const { xScale: o, yScale: r } = t, a = new Array(n);
    let l, c, h, u;
    for (l = 0, c = n; l < c; ++l)
      h = l + i, u = e[h], a[l] = {
        x: o.parse(u[0], h),
        y: r.parse(u[1], h)
      };
    return a;
  }
  parseObjectData(t, e, i, n) {
    const { xScale: o, yScale: r } = t, { xAxisKey: a = "x", yAxisKey: l = "y" } = this._parsing, c = new Array(n);
    let h, u, d, f;
    for (h = 0, u = n; h < u; ++h)
      d = h + i, f = e[d], c[h] = {
        x: o.parse(pe(f, a), d),
        y: r.parse(pe(f, l), d)
      };
    return c;
  }
  getParsed(t) {
    return this._cachedMeta._parsed[t];
  }
  getDataElement(t) {
    return this._cachedMeta.data[t];
  }
  applyStack(t, e, i) {
    const n = this.chart, o = this._cachedMeta, r = e[t.axis], a = {
      keys: ta(n, !0),
      values: e._stacks[t.axis]._visualValues
    };
    return ho(a, r, o.index, {
      mode: i
    });
  }
  updateRangeFromParsed(t, e, i, n) {
    const o = i[e.axis];
    let r = o === null ? NaN : o;
    const a = n && i._stacks[e.axis];
    n && a && (n.values = a, r = ho(n, o, this._cachedMeta.index)), t.min = Math.min(t.min, r), t.max = Math.max(t.max, r);
  }
  getMinMax(t, e) {
    const i = this._cachedMeta, n = i._parsed, o = i._sorted && t === i.iScale, r = n.length, a = this._getOtherScale(t), l = fh(e, i, this.chart), c = {
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY
    }, { min: h, max: u } = ch(a);
    let d, f;
    function g() {
      f = n[d];
      const p = f[a.axis];
      return !at(f[t.axis]) || h > p || u < p;
    }
    for (d = 0; d < r && !(!g() && (this.updateRangeFromParsed(c, t, f, l), o)); ++d)
      ;
    if (o) {
      for (d = r - 1; d >= 0; --d)
        if (!g()) {
          this.updateRangeFromParsed(c, t, f, l);
          break;
        }
    }
    return c;
  }
  getAllParsedValues(t) {
    const e = this._cachedMeta._parsed, i = [];
    let n, o, r;
    for (n = 0, o = e.length; n < o; ++n)
      r = e[n][t.axis], at(r) && i.push(r);
    return i;
  }
  getMaxOverflow() {
    return !1;
  }
  getLabelAndValue(t) {
    const e = this._cachedMeta, i = e.iScale, n = e.vScale, o = this.getParsed(t);
    return {
      label: i ? "" + i.getLabelForValue(o[i.axis]) : "",
      value: n ? "" + n.getLabelForValue(o[n.axis]) : ""
    };
  }
  _update(t) {
    const e = this._cachedMeta;
    this.update(t || "default"), e._clip = rh(W(this.options.clip, oh(e.xScale, e.yScale, this.getMaxOverflow())));
  }
  update(t) {
  }
  draw() {
    const t = this._ctx, e = this.chart, i = this._cachedMeta, n = i.data || [], o = e.chartArea, r = [], a = this._drawStart || 0, l = this._drawCount || n.length - a, c = this.options.drawActiveElementsOnTop;
    let h;
    for (i.dataset && i.dataset.draw(t, o, a, l), h = a; h < a + l; ++h) {
      const u = n[h];
      u.hidden || (u.active && c ? r.push(u) : u.draw(t, o));
    }
    for (h = 0; h < r.length; ++h)
      r[h].draw(t, o);
  }
  getStyle(t, e) {
    const i = e ? "active" : "default";
    return t === void 0 && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(i) : this.resolveDataElementOptions(t || 0, i);
  }
  getContext(t, e, i) {
    const n = this.getDataset();
    let o;
    if (t >= 0 && t < this._cachedMeta.data.length) {
      const r = this._cachedMeta.data[t];
      o = r.$context || (r.$context = dh(this.getContext(), t, r)), o.parsed = this.getParsed(t), o.raw = n.data[t], o.index = o.dataIndex = t;
    } else
      o = this.$context || (this.$context = uh(this.chart.getContext(), this.index)), o.dataset = n, o.index = o.datasetIndex = this.index;
    return o.active = !!e, o.mode = i, o;
  }
  resolveDatasetElementOptions(t) {
    return this._resolveElementOptions(this.datasetElementType.id, t);
  }
  resolveDataElementOptions(t, e) {
    return this._resolveElementOptions(this.dataElementType.id, e, t);
  }
  _resolveElementOptions(t, e = "default", i) {
    const n = e === "active", o = this._cachedDataOpts, r = t + "-" + e, a = o[r], l = this.enableOptionSharing && gi(i);
    if (a)
      return go(a, l);
    const c = this.chart.config, h = c.datasetElementScopeKeys(this._type, t), u = n ? [
      `${t}Hover`,
      "hover",
      t,
      ""
    ] : [
      t,
      ""
    ], d = c.getOptionScopes(this.getDataset(), h), f = Object.keys(nt.elements[t]), g = () => this.getContext(i, n, e), p = c.resolveNamedOptions(d, f, g, u);
    return p.$shared && (p.$shared = l, o[r] = Object.freeze(go(p, l))), p;
  }
  _resolveAnimations(t, e, i) {
    const n = this.chart, o = this._cachedDataOpts, r = `animation-${e}`, a = o[r];
    if (a)
      return a;
    let l;
    if (n.options.animation !== !1) {
      const h = this.chart.config, u = h.datasetAnimationScopeKeys(this._type, e), d = h.getOptionScopes(this.getDataset(), u);
      l = h.createResolver(d, this.getContext(t, i, e));
    }
    const c = new Zr(n, l && l.animations);
    return l && l._cacheable && (o[r] = Object.freeze(c)), c;
  }
  getSharedOptions(t) {
    if (t.$shared)
      return this._sharedOptions || (this._sharedOptions = Object.assign({}, t));
  }
  includeOptions(t, e) {
    return !e || Ms(t) || this.chart._animationsDisabled;
  }
  _getSharedOptions(t, e) {
    const i = this.resolveDataElementOptions(t, e), n = this._sharedOptions, o = this.getSharedOptions(i), r = this.includeOptions(e, o) || o !== n;
    return this.updateSharedOptions(o, e, i), {
      sharedOptions: o,
      includeOptions: r
    };
  }
  updateElement(t, e, i, n) {
    Ms(n) ? Object.assign(t, i) : this._resolveAnimations(e, n).update(t, i);
  }
  updateSharedOptions(t, e, i) {
    t && !Ms(e) && this._resolveAnimations(void 0, e).update(t, i);
  }
  _setStyle(t, e, i, n) {
    t.active = n;
    const o = this.getStyle(e, n);
    this._resolveAnimations(e, i, n).update(t, {
      options: !n && this.getSharedOptions(o) || o
    });
  }
  removeHoverStyle(t, e, i) {
    this._setStyle(t, i, "active", !1);
  }
  setHoverStyle(t, e, i) {
    this._setStyle(t, i, "active", !0);
  }
  _removeDatasetHoverStyle() {
    const t = this._cachedMeta.dataset;
    t && this._setStyle(t, void 0, "active", !1);
  }
  _setDatasetHoverStyle() {
    const t = this._cachedMeta.dataset;
    t && this._setStyle(t, void 0, "active", !0);
  }
  _resyncElements(t) {
    const e = this._data, i = this._cachedMeta.data;
    for (const [a, l, c] of this._syncList)
      this[a](l, c);
    this._syncList = [];
    const n = i.length, o = e.length, r = Math.min(o, n);
    r && this.parse(0, r), o > n ? this._insertElements(n, o - n, t) : o < n && this._removeElements(o, n - o);
  }
  _insertElements(t, e, i = !0) {
    const n = this._cachedMeta, o = n.data, r = t + e;
    let a;
    const l = (c) => {
      for (c.length += e, a = c.length - 1; a >= r; a--)
        c[a] = c[a - e];
    };
    for (l(o), a = t; a < r; ++a)
      o[a] = new this.dataElementType();
    this._parsing && l(n._parsed), this.parse(t, e), i && this.updateElements(o, t, e, "reset");
  }
  updateElements(t, e, i, n) {
  }
  _removeElements(t, e) {
    const i = this._cachedMeta;
    if (this._parsing) {
      const n = i._parsed.splice(t, e);
      i._stacked && je(i, n);
    }
    i.data.splice(t, e);
  }
  _sync(t) {
    if (this._parsing)
      this._syncList.push(t);
    else {
      const [e, i, n] = t;
      this[e](i, n);
    }
    this.chart._dataChanges.push([
      this.index,
      ...t
    ]);
  }
  _onDataPush() {
    const t = arguments.length;
    this._sync([
      "_insertElements",
      this.getDataset().data.length - t,
      t
    ]);
  }
  _onDataPop() {
    this._sync([
      "_removeElements",
      this._cachedMeta.data.length - 1,
      1
    ]);
  }
  _onDataShift() {
    this._sync([
      "_removeElements",
      0,
      1
    ]);
  }
  _onDataSplice(t, e) {
    e && this._sync([
      "_removeElements",
      t,
      e
    ]);
    const i = arguments.length - 2;
    i && this._sync([
      "_insertElements",
      t,
      i
    ]);
  }
  _onDataUnshift() {
    this._sync([
      "_insertElements",
      0,
      arguments.length
    ]);
  }
}
P(qt, "defaults", {}), P(qt, "datasetElementType", null), P(qt, "dataElementType", null);
function gh(s, t) {
  if (!s._cache.$bar) {
    const e = s.getMatchingVisibleMetas(t);
    let i = [];
    for (let n = 0, o = e.length; n < o; n++)
      i = i.concat(e[n].controller.getAllParsedValues(s));
    s._cache.$bar = Lr(i.sort((n, o) => n - o));
  }
  return s._cache.$bar;
}
function ph(s) {
  const t = s.iScale, e = gh(t, s.type);
  let i = t._length, n, o, r, a;
  const l = () => {
    r === 32767 || r === -32768 || (gi(a) && (i = Math.min(i, Math.abs(r - a) || i)), a = r);
  };
  for (n = 0, o = e.length; n < o; ++n)
    r = t.getPixelForValue(e[n]), l();
  for (a = void 0, n = 0, o = t.ticks.length; n < o; ++n)
    r = t.getPixelForTick(n), l();
  return i;
}
function mh(s, t, e, i) {
  const n = e.barThickness;
  let o, r;
  return j(n) ? (o = t.min * e.categoryPercentage, r = e.barPercentage) : (o = n * i, r = 1), {
    chunk: o / i,
    ratio: r,
    start: t.pixels[s] - o / 2
  };
}
function bh(s, t, e, i) {
  const n = t.pixels, o = n[s];
  let r = s > 0 ? n[s - 1] : null, a = s < n.length - 1 ? n[s + 1] : null;
  const l = e.categoryPercentage;
  r === null && (r = o - (a === null ? t.end - t.start : a - o)), a === null && (a = o + o - r);
  const c = o - (o - Math.min(r, a)) / 2 * l;
  return {
    chunk: Math.abs(a - r) / 2 * l / i,
    ratio: e.barPercentage,
    start: c
  };
}
function _h(s, t, e, i) {
  const n = e.parse(s[0], i), o = e.parse(s[1], i), r = Math.min(n, o), a = Math.max(n, o);
  let l = r, c = a;
  Math.abs(r) > Math.abs(a) && (l = a, c = r), t[e.axis] = c, t._custom = {
    barStart: l,
    barEnd: c,
    start: n,
    end: o,
    min: r,
    max: a
  };
}
function ea(s, t, e, i) {
  return st(s) ? _h(s, t, e, i) : t[e.axis] = e.parse(s, i), t;
}
function po(s, t, e, i) {
  const n = s.iScale, o = s.vScale, r = n.getLabels(), a = n === o, l = [];
  let c, h, u, d;
  for (c = e, h = e + i; c < h; ++c)
    d = t[c], u = {}, u[n.axis] = a || n.parse(r[c], c), l.push(ea(d, u, o, c));
  return l;
}
function ks(s) {
  return s && s.barStart !== void 0 && s.barEnd !== void 0;
}
function yh(s, t, e) {
  return s !== 0 ? Kt(s) : (t.isHorizontal() ? 1 : -1) * (t.min >= e ? 1 : -1);
}
function xh(s) {
  let t, e, i, n, o;
  return s.horizontal ? (t = s.base > s.x, e = "left", i = "right") : (t = s.base < s.y, e = "bottom", i = "top"), t ? (n = "end", o = "start") : (n = "start", o = "end"), {
    start: e,
    end: i,
    reverse: t,
    top: n,
    bottom: o
  };
}
function vh(s, t, e, i) {
  let n = t.borderSkipped;
  const o = {};
  if (!n) {
    s.borderSkipped = o;
    return;
  }
  if (n === !0) {
    s.borderSkipped = {
      top: !0,
      right: !0,
      bottom: !0,
      left: !0
    };
    return;
  }
  const { start: r, end: a, reverse: l, top: c, bottom: h } = xh(s);
  n === "middle" && e && (s.enableBorderRadius = !0, (e._top || 0) === i ? n = c : (e._bottom || 0) === i ? n = h : (o[mo(h, r, a, l)] = !0, n = c)), o[mo(n, r, a, l)] = !0, s.borderSkipped = o;
}
function mo(s, t, e, i) {
  return i ? (s = wh(s, t, e), s = bo(s, e, t)) : s = bo(s, t, e), s;
}
function wh(s, t, e) {
  return s === t ? e : s === e ? t : s;
}
function bo(s, t, e) {
  return s === "start" ? t : s === "end" ? e : s;
}
function Sh(s, { inflateAmount: t }, e) {
  s.inflateAmount = t === "auto" ? e === 1 ? 0.33 : 0 : t;
}
class qi extends qt {
  parsePrimitiveData(t, e, i, n) {
    return po(t, e, i, n);
  }
  parseArrayData(t, e, i, n) {
    return po(t, e, i, n);
  }
  parseObjectData(t, e, i, n) {
    const { iScale: o, vScale: r } = t, { xAxisKey: a = "x", yAxisKey: l = "y" } = this._parsing, c = o.axis === "x" ? a : l, h = r.axis === "x" ? a : l, u = [];
    let d, f, g, p;
    for (d = i, f = i + n; d < f; ++d)
      p = e[d], g = {}, g[o.axis] = o.parse(pe(p, c), d), u.push(ea(pe(p, h), g, r, d));
    return u;
  }
  updateRangeFromParsed(t, e, i, n) {
    super.updateRangeFromParsed(t, e, i, n);
    const o = i._custom;
    o && e === this._cachedMeta.vScale && (t.min = Math.min(t.min, o.min), t.max = Math.max(t.max, o.max));
  }
  getMaxOverflow() {
    return 0;
  }
  getLabelAndValue(t) {
    const e = this._cachedMeta, { iScale: i, vScale: n } = e, o = this.getParsed(t), r = o._custom, a = ks(r) ? "[" + r.start + ", " + r.end + "]" : "" + n.getLabelForValue(o[n.axis]);
    return {
      label: "" + i.getLabelForValue(o[i.axis]),
      value: a
    };
  }
  initialize() {
    this.enableOptionSharing = !0, super.initialize();
    const t = this._cachedMeta;
    t.stack = this.getDataset().stack;
  }
  update(t) {
    const e = this._cachedMeta;
    this.updateElements(e.data, 0, e.data.length, t);
  }
  updateElements(t, e, i, n) {
    const o = n === "reset", { index: r, _cachedMeta: { vScale: a } } = this, l = a.getBasePixel(), c = a.isHorizontal(), h = this._getRuler(), { sharedOptions: u, includeOptions: d } = this._getSharedOptions(e, n);
    for (let f = e; f < e + i; f++) {
      const g = this.getParsed(f), p = o || j(g[a.axis]) ? {
        base: l,
        head: l
      } : this._calculateBarValuePixels(f), m = this._calculateBarIndexPixels(f, h), b = (g._stacks || {})[a.axis], _ = {
        horizontal: c,
        base: p.base,
        enableBorderRadius: !b || ks(g._custom) || r === b._top || r === b._bottom,
        x: c ? p.head : m.center,
        y: c ? m.center : p.head,
        height: c ? m.size : Math.abs(p.size),
        width: c ? Math.abs(p.size) : m.size
      };
      d && (_.options = u || this.resolveDataElementOptions(f, t[f].active ? "active" : n));
      const k = _.options || t[f].options;
      vh(_, k, b, r), Sh(_, k, h.ratio), this.updateElement(t[f], f, _, n);
    }
  }
  _getStacks(t, e) {
    const { iScale: i } = this._cachedMeta, n = i.getMatchingVisibleMetas(this._type).filter((h) => h.controller.options.grouped), o = i.options.stacked, r = [], a = this._cachedMeta.controller.getParsed(e), l = a && a[i.axis], c = (h) => {
      const u = h._parsed.find((f) => f[i.axis] === l), d = u && u[h.vScale.axis];
      if (j(d) || isNaN(d))
        return !0;
    };
    for (const h of n)
      if (!(e !== void 0 && c(h)) && ((o === !1 || r.indexOf(h.stack) === -1 || o === void 0 && h.stack === void 0) && r.push(h.stack), h.index === t))
        break;
    return r.length || r.push(void 0), r;
  }
  _getStackCount(t) {
    return this._getStacks(void 0, t).length;
  }
  _getAxisCount() {
    return this._getAxis().length;
  }
  getFirstScaleIdForIndexAxis() {
    const t = this.chart.scales, e = this.chart.options.indexAxis;
    return Object.keys(t).filter((i) => t[i].axis === e).shift();
  }
  _getAxis() {
    const t = {}, e = this.getFirstScaleIdForIndexAxis();
    for (const i of this.chart.data.datasets)
      t[W(this.chart.options.indexAxis === "x" ? i.xAxisID : i.yAxisID, e)] = !0;
    return Object.keys(t);
  }
  _getStackIndex(t, e, i) {
    const n = this._getStacks(t, i), o = e !== void 0 ? n.indexOf(e) : -1;
    return o === -1 ? n.length - 1 : o;
  }
  _getRuler() {
    const t = this.options, e = this._cachedMeta, i = e.iScale, n = [];
    let o, r;
    for (o = 0, r = e.data.length; o < r; ++o)
      n.push(i.getPixelForValue(this.getParsed(o)[i.axis], o));
    const a = t.barThickness;
    return {
      min: a || ph(e),
      pixels: n,
      start: i._startPixel,
      end: i._endPixel,
      stackCount: this._getStackCount(),
      scale: i,
      grouped: t.grouped,
      ratio: a ? 1 : t.categoryPercentage * t.barPercentage
    };
  }
  _calculateBarValuePixels(t) {
    const { _cachedMeta: { vScale: e, _stacked: i, index: n }, options: { base: o, minBarLength: r } } = this, a = o || 0, l = this.getParsed(t), c = l._custom, h = ks(c);
    let u = l[e.axis], d = 0, f = i ? this.applyStack(e, l, i) : u, g, p;
    f !== u && (d = f - u, f = u), h && (u = c.barStart, f = c.barEnd - c.barStart, u !== 0 && Kt(u) !== Kt(c.barEnd) && (d = 0), d += u);
    const m = !j(o) && !h ? o : d;
    let b = e.getPixelForValue(m);
    if (this.chart.getDataVisibility(t) ? g = e.getPixelForValue(d + f) : g = b, p = g - b, Math.abs(p) < r) {
      p = yh(p, e, a) * r, u === a && (b -= p / 2);
      const _ = e.getPixelForDecimal(0), k = e.getPixelForDecimal(1), M = Math.min(_, k), S = Math.max(_, k);
      b = Math.max(Math.min(b, S), M), g = b + p, i && !h && (l._stacks[e.axis]._visualValues[n] = e.getValueForPixel(g) - e.getValueForPixel(b));
    }
    if (b === e.getPixelForValue(a)) {
      const _ = Kt(p) * e.getLineWidthForValue(a) / 2;
      b += _, p -= _;
    }
    return {
      size: p,
      base: b,
      head: g,
      center: g + p / 2
    };
  }
  _calculateBarIndexPixels(t, e) {
    const i = e.scale, n = this.options, o = n.skipNull, r = W(n.maxBarThickness, 1 / 0);
    let a, l;
    const c = this._getAxisCount();
    if (e.grouped) {
      const h = o ? this._getStackCount(t) : e.stackCount, u = n.barThickness === "flex" ? bh(t, e, n, h * c) : mh(t, e, n, h * c), d = this.chart.options.indexAxis === "x" ? this.getDataset().xAxisID : this.getDataset().yAxisID, f = this._getAxis().indexOf(W(d, this.getFirstScaleIdForIndexAxis())), g = this._getStackIndex(this.index, this._cachedMeta.stack, o ? t : void 0) + f;
      a = u.start + u.chunk * g + u.chunk / 2, l = Math.min(r, u.chunk * u.ratio);
    } else
      a = i.getPixelForValue(this.getParsed(t)[i.axis], t), l = Math.min(r, e.min * e.ratio);
    return {
      base: a - l / 2,
      head: a + l / 2,
      center: a,
      size: l
    };
  }
  draw() {
    const t = this._cachedMeta, e = t.vScale, i = t.data, n = i.length;
    let o = 0;
    for (; o < n; ++o)
      this.getParsed(o)[e.axis] !== null && !i[o].hidden && i[o].draw(this._ctx);
  }
}
P(qi, "id", "bar"), P(qi, "defaults", {
  datasetElementType: !1,
  dataElementType: "bar",
  categoryPercentage: 0.8,
  barPercentage: 0.9,
  grouped: !0,
  animations: {
    numbers: {
      type: "number",
      properties: [
        "x",
        "y",
        "base",
        "width",
        "height"
      ]
    }
  }
}), P(qi, "overrides", {
  scales: {
    _index_: {
      type: "category",
      offset: !0,
      grid: {
        offset: !0
      }
    },
    _value_: {
      type: "linear",
      beginAtZero: !0
    }
  }
});
class Wi extends qt {
  initialize() {
    this.enableOptionSharing = !0, super.initialize();
  }
  parsePrimitiveData(t, e, i, n) {
    const o = super.parsePrimitiveData(t, e, i, n);
    for (let r = 0; r < o.length; r++)
      o[r]._custom = this.resolveDataElementOptions(r + i).radius;
    return o;
  }
  parseArrayData(t, e, i, n) {
    const o = super.parseArrayData(t, e, i, n);
    for (let r = 0; r < o.length; r++) {
      const a = e[i + r];
      o[r]._custom = W(a[2], this.resolveDataElementOptions(r + i).radius);
    }
    return o;
  }
  parseObjectData(t, e, i, n) {
    const o = super.parseObjectData(t, e, i, n);
    for (let r = 0; r < o.length; r++) {
      const a = e[i + r];
      o[r]._custom = W(a && a.r && +a.r, this.resolveDataElementOptions(r + i).radius);
    }
    return o;
  }
  getMaxOverflow() {
    const t = this._cachedMeta.data;
    let e = 0;
    for (let i = t.length - 1; i >= 0; --i)
      e = Math.max(e, t[i].size(this.resolveDataElementOptions(i)) / 2);
    return e > 0 && e;
  }
  getLabelAndValue(t) {
    const e = this._cachedMeta, i = this.chart.data.labels || [], { xScale: n, yScale: o } = e, r = this.getParsed(t), a = n.getLabelForValue(r.x), l = o.getLabelForValue(r.y), c = r._custom;
    return {
      label: i[t] || "",
      value: "(" + a + ", " + l + (c ? ", " + c : "") + ")"
    };
  }
  update(t) {
    const e = this._cachedMeta.data;
    this.updateElements(e, 0, e.length, t);
  }
  updateElements(t, e, i, n) {
    const o = n === "reset", { iScale: r, vScale: a } = this._cachedMeta, { sharedOptions: l, includeOptions: c } = this._getSharedOptions(e, n), h = r.axis, u = a.axis;
    for (let d = e; d < e + i; d++) {
      const f = t[d], g = !o && this.getParsed(d), p = {}, m = p[h] = o ? r.getPixelForDecimal(0.5) : r.getPixelForValue(g[h]), b = p[u] = o ? a.getBasePixel() : a.getPixelForValue(g[u]);
      p.skip = isNaN(m) || isNaN(b), c && (p.options = l || this.resolveDataElementOptions(d, f.active ? "active" : n), o && (p.options.radius = 0)), this.updateElement(f, d, p, n);
    }
  }
  resolveDataElementOptions(t, e) {
    const i = this.getParsed(t);
    let n = super.resolveDataElementOptions(t, e);
    n.$shared && (n = Object.assign({}, n, {
      $shared: !1
    }));
    const o = n.radius;
    return e !== "active" && (n.radius = 0), n.radius += W(i && i._custom, o), n;
  }
}
P(Wi, "id", "bubble"), P(Wi, "defaults", {
  datasetElementType: !1,
  dataElementType: "point",
  animations: {
    numbers: {
      type: "number",
      properties: [
        "x",
        "y",
        "borderWidth",
        "radius"
      ]
    }
  }
}), P(Wi, "overrides", {
  scales: {
    x: {
      type: "linear"
    },
    y: {
      type: "linear"
    }
  }
});
function Mh(s, t, e) {
  let i = 1, n = 1, o = 0, r = 0;
  if (t < it) {
    const a = s, l = a + t, c = Math.cos(a), h = Math.sin(a), u = Math.cos(l), d = Math.sin(l), f = (k, M, S) => pi(k, a, l, !0) ? 1 : Math.max(M, M * e, S, S * e), g = (k, M, S) => pi(k, a, l, !0) ? -1 : Math.min(M, M * e, S, S * e), p = f(0, c, u), m = f(lt, h, d), b = g(K, c, u), _ = g(K + lt, h, d);
    i = (p - b) / 2, n = (m - _) / 2, o = -(p + b) / 2, r = -(m + _) / 2;
  }
  return {
    ratioX: i,
    ratioY: n,
    offsetX: o,
    offsetY: r
  };
}
class Pe extends qt {
  constructor(t, e) {
    super(t, e), this.enableOptionSharing = !0, this.innerRadius = void 0, this.outerRadius = void 0, this.offsetX = void 0, this.offsetY = void 0;
  }
  linkScales() {
  }
  parse(t, e) {
    const i = this.getDataset().data, n = this._cachedMeta;
    if (this._parsing === !1)
      n._parsed = i;
    else {
      let o = (l) => +i[l];
      if (U(i[t])) {
        const { key: l = "value" } = this._parsing;
        o = (c) => +pe(i[c], l);
      }
      let r, a;
      for (r = t, a = t + e; r < a; ++r)
        n._parsed[r] = o(r);
    }
  }
  _getRotation() {
    return $t(this.options.rotation - 90);
  }
  _getCircumference() {
    return $t(this.options.circumference);
  }
  _getRotationExtents() {
    let t = it, e = -it;
    for (let i = 0; i < this.chart.data.datasets.length; ++i)
      if (this.chart.isDatasetVisible(i) && this.chart.getDatasetMeta(i).type === this._type) {
        const n = this.chart.getDatasetMeta(i).controller, o = n._getRotation(), r = n._getCircumference();
        t = Math.min(t, o), e = Math.max(e, o + r);
      }
    return {
      rotation: t,
      circumference: e - t
    };
  }
  update(t) {
    const e = this.chart, { chartArea: i } = e, n = this._cachedMeta, o = n.data, r = this.getMaxBorderWidth() + this.getMaxOffset(o) + this.options.spacing, a = Math.max((Math.min(i.width, i.height) - r) / 2, 0), l = Math.min(Fl(this.options.cutout, a), 1), c = this._getRingWeight(this.index), { circumference: h, rotation: u } = this._getRotationExtents(), { ratioX: d, ratioY: f, offsetX: g, offsetY: p } = Mh(u, h, l), m = (i.width - r) / d, b = (i.height - r) / f, _ = Math.max(Math.min(m, b) / 2, 0), k = Cr(this.options.radius, _), M = Math.max(k * l, 0), S = (k - M) / this._getVisibleDatasetWeightTotal();
    this.offsetX = g * k, this.offsetY = p * k, n.total = this.calculateTotal(), this.outerRadius = k - S * this._getRingWeightOffset(this.index), this.innerRadius = Math.max(this.outerRadius - S * c, 0), this.updateElements(o, 0, o.length, t);
  }
  _circumference(t, e) {
    const i = this.options, n = this._cachedMeta, o = this._getCircumference();
    return e && i.animation.animateRotate || !this.chart.getDataVisibility(t) || n._parsed[t] === null || n.data[t].hidden ? 0 : this.calculateCircumference(n._parsed[t] * o / it);
  }
  updateElements(t, e, i, n) {
    const o = n === "reset", r = this.chart, a = r.chartArea, c = r.options.animation, h = (a.left + a.right) / 2, u = (a.top + a.bottom) / 2, d = o && c.animateScale, f = d ? 0 : this.innerRadius, g = d ? 0 : this.outerRadius, { sharedOptions: p, includeOptions: m } = this._getSharedOptions(e, n);
    let b = this._getRotation(), _;
    for (_ = 0; _ < e; ++_)
      b += this._circumference(_, o);
    for (_ = e; _ < e + i; ++_) {
      const k = this._circumference(_, o), M = t[_], S = {
        x: h + this.offsetX,
        y: u + this.offsetY,
        startAngle: b,
        endAngle: b + k,
        circumference: k,
        outerRadius: g,
        innerRadius: f
      };
      m && (S.options = p || this.resolveDataElementOptions(_, M.active ? "active" : n)), b += k, this.updateElement(M, _, S, n);
    }
  }
  calculateTotal() {
    const t = this._cachedMeta, e = t.data;
    let i = 0, n;
    for (n = 0; n < e.length; n++) {
      const o = t._parsed[n];
      o !== null && !isNaN(o) && this.chart.getDataVisibility(n) && !e[n].hidden && (i += Math.abs(o));
    }
    return i;
  }
  calculateCircumference(t) {
    const e = this._cachedMeta.total;
    return e > 0 && !isNaN(t) ? it * (Math.abs(t) / e) : 0;
  }
  getLabelAndValue(t) {
    const e = this._cachedMeta, i = this.chart, n = i.data.labels || [], o = wi(e._parsed[t], i.options.locale);
    return {
      label: n[t] || "",
      value: o
    };
  }
  getMaxBorderWidth(t) {
    let e = 0;
    const i = this.chart;
    let n, o, r, a, l;
    if (!t) {
      for (n = 0, o = i.data.datasets.length; n < o; ++n)
        if (i.isDatasetVisible(n)) {
          r = i.getDatasetMeta(n), t = r.data, a = r.controller;
          break;
        }
    }
    if (!t)
      return 0;
    for (n = 0, o = t.length; n < o; ++n)
      l = a.resolveDataElementOptions(n), l.borderAlign !== "inner" && (e = Math.max(e, l.borderWidth || 0, l.hoverBorderWidth || 0));
    return e;
  }
  getMaxOffset(t) {
    let e = 0;
    for (let i = 0, n = t.length; i < n; ++i) {
      const o = this.resolveDataElementOptions(i);
      e = Math.max(e, o.offset || 0, o.hoverOffset || 0);
    }
    return e;
  }
  _getRingWeightOffset(t) {
    let e = 0;
    for (let i = 0; i < t; ++i)
      this.chart.isDatasetVisible(i) && (e += this._getRingWeight(i));
    return e;
  }
  _getRingWeight(t) {
    return Math.max(W(this.chart.data.datasets[t].weight, 1), 0);
  }
  _getVisibleDatasetWeightTotal() {
    return this._getRingWeightOffset(this.chart.data.datasets.length) || 1;
  }
}
P(Pe, "id", "doughnut"), P(Pe, "defaults", {
  datasetElementType: !1,
  dataElementType: "arc",
  animation: {
    animateRotate: !0,
    animateScale: !1
  },
  animations: {
    numbers: {
      type: "number",
      properties: [
        "circumference",
        "endAngle",
        "innerRadius",
        "outerRadius",
        "startAngle",
        "x",
        "y",
        "offset",
        "borderWidth",
        "spacing"
      ]
    }
  },
  cutout: "50%",
  rotation: 0,
  circumference: 360,
  radius: "100%",
  spacing: 0,
  indexAxis: "r"
}), P(Pe, "descriptors", {
  _scriptable: (t) => t !== "spacing",
  _indexable: (t) => t !== "spacing" && !t.startsWith("borderDash") && !t.startsWith("hoverBorderDash")
}), P(Pe, "overrides", {
  aspectRatio: 1,
  plugins: {
    legend: {
      labels: {
        generateLabels(t) {
          const e = t.data;
          if (e.labels.length && e.datasets.length) {
            const { labels: { pointStyle: i, color: n } } = t.legend.options;
            return e.labels.map((o, r) => {
              const l = t.getDatasetMeta(0).controller.getStyle(r);
              return {
                text: o,
                fillStyle: l.backgroundColor,
                strokeStyle: l.borderColor,
                fontColor: n,
                lineWidth: l.borderWidth,
                pointStyle: i,
                hidden: !t.getDataVisibility(r),
                index: r
              };
            });
          }
          return [];
        }
      },
      onClick(t, e, i) {
        i.chart.toggleDataVisibility(e.index), i.chart.update();
      }
    }
  }
});
class Vi extends qt {
  initialize() {
    this.enableOptionSharing = !0, this.supportsDecimation = !0, super.initialize();
  }
  update(t) {
    const e = this._cachedMeta, { dataset: i, data: n = [], _dataset: o } = e, r = this.chart._animationsDisabled;
    let { start: a, count: l } = Fr(e, n, r);
    this._drawStart = a, this._drawCount = l, Nr(e) && (a = 0, l = n.length), i._chart = this.chart, i._datasetIndex = this.index, i._decimated = !!o._decimated, i.points = n;
    const c = this.resolveDatasetElementOptions(t);
    this.options.showLine || (c.borderWidth = 0), c.segment = this.options.segment, this.updateElement(i, void 0, {
      animated: !r,
      options: c
    }, t), this.updateElements(n, a, l, t);
  }
  updateElements(t, e, i, n) {
    const o = n === "reset", { iScale: r, vScale: a, _stacked: l, _dataset: c } = this._cachedMeta, { sharedOptions: h, includeOptions: u } = this._getSharedOptions(e, n), d = r.axis, f = a.axis, { spanGaps: g, segment: p } = this.options, m = He(g) ? g : Number.POSITIVE_INFINITY, b = this.chart._animationsDisabled || o || n === "none", _ = e + i, k = t.length;
    let M = e > 0 && this.getParsed(e - 1);
    for (let S = 0; S < k; ++S) {
      const O = t[S], C = b ? O : {};
      if (S < e || S >= _) {
        C.skip = !0;
        continue;
      }
      const A = this.getParsed(S), L = j(A[f]), H = C[d] = r.getPixelForValue(A[d], S), q = C[f] = o || L ? a.getBasePixel() : a.getPixelForValue(l ? this.applyStack(a, A, l) : A[f], S);
      C.skip = isNaN(H) || isNaN(q) || L, C.stop = S > 0 && Math.abs(A[d] - M[d]) > m, p && (C.parsed = A, C.raw = c.data[S]), u && (C.options = h || this.resolveDataElementOptions(S, O.active ? "active" : n)), b || this.updateElement(O, S, C, n), M = A;
    }
  }
  getMaxOverflow() {
    const t = this._cachedMeta, e = t.dataset, i = e.options && e.options.borderWidth || 0, n = t.data || [];
    if (!n.length)
      return i;
    const o = n[0].size(this.resolveDataElementOptions(0)), r = n[n.length - 1].size(this.resolveDataElementOptions(n.length - 1));
    return Math.max(i, o, r) / 2;
  }
  draw() {
    const t = this._cachedMeta;
    t.dataset.updateControlPoints(this.chart.chartArea, t.iScale.axis), super.draw();
  }
}
P(Vi, "id", "line"), P(Vi, "defaults", {
  datasetElementType: "line",
  dataElementType: "point",
  showLine: !0,
  spanGaps: !1
}), P(Vi, "overrides", {
  scales: {
    _index_: {
      type: "category"
    },
    _value_: {
      type: "linear"
    }
  }
});
class hi extends qt {
  constructor(t, e) {
    super(t, e), this.innerRadius = void 0, this.outerRadius = void 0;
  }
  getLabelAndValue(t) {
    const e = this._cachedMeta, i = this.chart, n = i.data.labels || [], o = wi(e._parsed[t].r, i.options.locale);
    return {
      label: n[t] || "",
      value: o
    };
  }
  parseObjectData(t, e, i, n) {
    return jr.bind(this)(t, e, i, n);
  }
  update(t) {
    const e = this._cachedMeta.data;
    this._updateRadius(), this.updateElements(e, 0, e.length, t);
  }
  getMinMax() {
    const t = this._cachedMeta, e = {
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY
    };
    return t.data.forEach((i, n) => {
      const o = this.getParsed(n).r;
      !isNaN(o) && this.chart.getDataVisibility(n) && (o < e.min && (e.min = o), o > e.max && (e.max = o));
    }), e;
  }
  _updateRadius() {
    const t = this.chart, e = t.chartArea, i = t.options, n = Math.min(e.right - e.left, e.bottom - e.top), o = Math.max(n / 2, 0), r = Math.max(i.cutoutPercentage ? o / 100 * i.cutoutPercentage : 1, 0), a = (o - r) / t.getVisibleDatasetCount();
    this.outerRadius = o - a * this.index, this.innerRadius = this.outerRadius - a;
  }
  updateElements(t, e, i, n) {
    const o = n === "reset", r = this.chart, l = r.options.animation, c = this._cachedMeta.rScale, h = c.xCenter, u = c.yCenter, d = c.getIndexAngle(0) - 0.5 * K;
    let f = d, g;
    const p = 360 / this.countVisibleElements();
    for (g = 0; g < e; ++g)
      f += this._computeAngle(g, n, p);
    for (g = e; g < e + i; g++) {
      const m = t[g];
      let b = f, _ = f + this._computeAngle(g, n, p), k = r.getDataVisibility(g) ? c.getDistanceFromCenterForValue(this.getParsed(g).r) : 0;
      f = _, o && (l.animateScale && (k = 0), l.animateRotate && (b = _ = d));
      const M = {
        x: h,
        y: u,
        innerRadius: 0,
        outerRadius: k,
        startAngle: b,
        endAngle: _,
        options: this.resolveDataElementOptions(g, m.active ? "active" : n)
      };
      this.updateElement(m, g, M, n);
    }
  }
  countVisibleElements() {
    const t = this._cachedMeta;
    let e = 0;
    return t.data.forEach((i, n) => {
      !isNaN(this.getParsed(n).r) && this.chart.getDataVisibility(n) && e++;
    }), e;
  }
  _computeAngle(t, e, i) {
    return this.chart.getDataVisibility(t) ? $t(this.resolveDataElementOptions(t, e).angle || i) : 0;
  }
}
P(hi, "id", "polarArea"), P(hi, "defaults", {
  dataElementType: "arc",
  animation: {
    animateRotate: !0,
    animateScale: !0
  },
  animations: {
    numbers: {
      type: "number",
      properties: [
        "x",
        "y",
        "startAngle",
        "endAngle",
        "innerRadius",
        "outerRadius"
      ]
    }
  },
  indexAxis: "r",
  startAngle: 0
}), P(hi, "overrides", {
  aspectRatio: 1,
  plugins: {
    legend: {
      labels: {
        generateLabels(t) {
          const e = t.data;
          if (e.labels.length && e.datasets.length) {
            const { labels: { pointStyle: i, color: n } } = t.legend.options;
            return e.labels.map((o, r) => {
              const l = t.getDatasetMeta(0).controller.getStyle(r);
              return {
                text: o,
                fillStyle: l.backgroundColor,
                strokeStyle: l.borderColor,
                fontColor: n,
                lineWidth: l.borderWidth,
                pointStyle: i,
                hidden: !t.getDataVisibility(r),
                index: r
              };
            });
          }
          return [];
        }
      },
      onClick(t, e, i) {
        i.chart.toggleDataVisibility(e.index), i.chart.update();
      }
    }
  },
  scales: {
    r: {
      type: "radialLinear",
      angleLines: {
        display: !1
      },
      beginAtZero: !0,
      grid: {
        circular: !0
      },
      pointLabels: {
        display: !1
      },
      startAngle: 0
    }
  }
});
class Ks extends Pe {
}
P(Ks, "id", "pie"), P(Ks, "defaults", {
  cutout: 0,
  rotation: 0,
  circumference: 360,
  radius: "100%"
});
class ji extends qt {
  getLabelAndValue(t) {
    const e = this._cachedMeta.vScale, i = this.getParsed(t);
    return {
      label: e.getLabels()[t],
      value: "" + e.getLabelForValue(i[e.axis])
    };
  }
  parseObjectData(t, e, i, n) {
    return jr.bind(this)(t, e, i, n);
  }
  update(t) {
    const e = this._cachedMeta, i = e.dataset, n = e.data || [], o = e.iScale.getLabels();
    if (i.points = n, t !== "resize") {
      const r = this.resolveDatasetElementOptions(t);
      this.options.showLine || (r.borderWidth = 0);
      const a = {
        _loop: !0,
        _fullLoop: o.length === n.length,
        options: r
      };
      this.updateElement(i, void 0, a, t);
    }
    this.updateElements(n, 0, n.length, t);
  }
  updateElements(t, e, i, n) {
    const o = this._cachedMeta.rScale, r = n === "reset";
    for (let a = e; a < e + i; a++) {
      const l = t[a], c = this.resolveDataElementOptions(a, l.active ? "active" : n), h = o.getPointPositionForValue(a, this.getParsed(a).r), u = r ? o.xCenter : h.x, d = r ? o.yCenter : h.y, f = {
        x: u,
        y: d,
        angle: h.angle,
        skip: isNaN(u) || isNaN(d),
        options: c
      };
      this.updateElement(l, a, f, n);
    }
  }
}
P(ji, "id", "radar"), P(ji, "defaults", {
  datasetElementType: "line",
  dataElementType: "point",
  indexAxis: "r",
  showLine: !0,
  elements: {
    line: {
      fill: "start"
    }
  }
}), P(ji, "overrides", {
  aspectRatio: 1,
  scales: {
    r: {
      type: "radialLinear"
    }
  }
});
class Ui extends qt {
  getLabelAndValue(t) {
    const e = this._cachedMeta, i = this.chart.data.labels || [], { xScale: n, yScale: o } = e, r = this.getParsed(t), a = n.getLabelForValue(r.x), l = o.getLabelForValue(r.y);
    return {
      label: i[t] || "",
      value: "(" + a + ", " + l + ")"
    };
  }
  update(t) {
    const e = this._cachedMeta, { data: i = [] } = e, n = this.chart._animationsDisabled;
    let { start: o, count: r } = Fr(e, i, n);
    if (this._drawStart = o, this._drawCount = r, Nr(e) && (o = 0, r = i.length), this.options.showLine) {
      this.datasetElementType || this.addElements();
      const { dataset: a, _dataset: l } = e;
      a._chart = this.chart, a._datasetIndex = this.index, a._decimated = !!l._decimated, a.points = i;
      const c = this.resolveDatasetElementOptions(t);
      c.segment = this.options.segment, this.updateElement(a, void 0, {
        animated: !n,
        options: c
      }, t);
    } else this.datasetElementType && (delete e.dataset, this.datasetElementType = !1);
    this.updateElements(i, o, r, t);
  }
  addElements() {
    const { showLine: t } = this.options;
    !this.datasetElementType && t && (this.datasetElementType = this.chart.registry.getElement("line")), super.addElements();
  }
  updateElements(t, e, i, n) {
    const o = n === "reset", { iScale: r, vScale: a, _stacked: l, _dataset: c } = this._cachedMeta, h = this.resolveDataElementOptions(e, n), u = this.getSharedOptions(h), d = this.includeOptions(n, u), f = r.axis, g = a.axis, { spanGaps: p, segment: m } = this.options, b = He(p) ? p : Number.POSITIVE_INFINITY, _ = this.chart._animationsDisabled || o || n === "none";
    let k = e > 0 && this.getParsed(e - 1);
    for (let M = e; M < e + i; ++M) {
      const S = t[M], O = this.getParsed(M), C = _ ? S : {}, A = j(O[g]), L = C[f] = r.getPixelForValue(O[f], M), H = C[g] = o || A ? a.getBasePixel() : a.getPixelForValue(l ? this.applyStack(a, O, l) : O[g], M);
      C.skip = isNaN(L) || isNaN(H) || A, C.stop = M > 0 && Math.abs(O[f] - k[f]) > b, m && (C.parsed = O, C.raw = c.data[M]), d && (C.options = u || this.resolveDataElementOptions(M, S.active ? "active" : n)), _ || this.updateElement(S, M, C, n), k = O;
    }
    this.updateSharedOptions(u, n, h);
  }
  getMaxOverflow() {
    const t = this._cachedMeta, e = t.data || [];
    if (!this.options.showLine) {
      let a = 0;
      for (let l = e.length - 1; l >= 0; --l)
        a = Math.max(a, e[l].size(this.resolveDataElementOptions(l)) / 2);
      return a > 0 && a;
    }
    const i = t.dataset, n = i.options && i.options.borderWidth || 0;
    if (!e.length)
      return n;
    const o = e[0].size(this.resolveDataElementOptions(0)), r = e[e.length - 1].size(this.resolveDataElementOptions(e.length - 1));
    return Math.max(n, o, r) / 2;
  }
}
P(Ui, "id", "scatter"), P(Ui, "defaults", {
  datasetElementType: !1,
  dataElementType: "point",
  showLine: !1,
  fill: !1
}), P(Ui, "overrides", {
  interaction: {
    mode: "point"
  },
  scales: {
    x: {
      type: "linear"
    },
    y: {
      type: "linear"
    }
  }
});
var kh = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  BarController: qi,
  BubbleController: Wi,
  DoughnutController: Pe,
  LineController: Vi,
  PieController: Ks,
  PolarAreaController: hi,
  RadarController: ji,
  ScatterController: Ui
});
function ve() {
  throw new Error("This method is not implemented: Check that a complete date adapter is provided.");
}
class Pn {
  constructor(t) {
    P(this, "options");
    this.options = t || {};
  }
  /**
  * Override default date adapter methods.
  * Accepts type parameter to define options type.
  * @example
  * Chart._adapters._date.override<{myAdapterOption: string}>({
  *   init() {
  *     console.log(this.options.myAdapterOption);
  *   }
  * })
  */
  static override(t) {
    Object.assign(Pn.prototype, t);
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init() {
  }
  formats() {
    return ve();
  }
  parse() {
    return ve();
  }
  format() {
    return ve();
  }
  add() {
    return ve();
  }
  diff() {
    return ve();
  }
  startOf() {
    return ve();
  }
  endOf() {
    return ve();
  }
}
var Ph = {
  _date: Pn
};
function Ah(s, t, e, i) {
  const { controller: n, data: o, _sorted: r } = s, a = n._cachedMeta.iScale, l = s.dataset && s.dataset.options ? s.dataset.options.spanGaps : null;
  if (a && t === a.axis && t !== "r" && r && o.length) {
    const c = a._reversePixels ? Xl : se;
    if (i) {
      if (n._sharedOptions) {
        const h = o[0], u = typeof h.getRange == "function" && h.getRange(t);
        if (u) {
          const d = c(o, t, e - u), f = c(o, t, e + u);
          return {
            lo: d.lo,
            hi: f.hi
          };
        }
      }
    } else {
      const h = c(o, t, e);
      if (l) {
        const { vScale: u } = n._cachedMeta, { _parsed: d } = s, f = d.slice(0, h.lo + 1).reverse().findIndex((p) => !j(p[u.axis]));
        h.lo -= Math.max(0, f);
        const g = d.slice(h.hi).findIndex((p) => !j(p[u.axis]));
        h.hi += Math.max(0, g);
      }
      return h;
    }
  }
  return {
    lo: 0,
    hi: o.length - 1
  };
}
function ds(s, t, e, i, n) {
  const o = s.getSortedVisibleDatasetMetas(), r = e[t];
  for (let a = 0, l = o.length; a < l; ++a) {
    const { index: c, data: h } = o[a], { lo: u, hi: d } = Ah(o[a], t, r, n);
    for (let f = u; f <= d; ++f) {
      const g = h[f];
      g.skip || i(g, c, f);
    }
  }
}
function Ch(s) {
  const t = s.indexOf("x") !== -1, e = s.indexOf("y") !== -1;
  return function(i, n) {
    const o = t ? Math.abs(i.x - n.x) : 0, r = e ? Math.abs(i.y - n.y) : 0;
    return Math.sqrt(Math.pow(o, 2) + Math.pow(r, 2));
  };
}
function Ps(s, t, e, i, n) {
  const o = [];
  return !n && !s.isPointInArea(t) || ds(s, e, t, function(a, l, c) {
    !n && !ne(a, s.chartArea, 0) || a.inRange(t.x, t.y, i) && o.push({
      element: a,
      datasetIndex: l,
      index: c
    });
  }, !0), o;
}
function Th(s, t, e, i) {
  let n = [];
  function o(r, a, l) {
    const { startAngle: c, endAngle: h } = r.getProps([
      "startAngle",
      "endAngle"
    ], i), { angle: u } = Or(r, {
      x: t.x,
      y: t.y
    });
    pi(u, c, h) && n.push({
      element: r,
      datasetIndex: a,
      index: l
    });
  }
  return ds(s, e, t, o), n;
}
function Eh(s, t, e, i, n, o) {
  let r = [];
  const a = Ch(e);
  let l = Number.POSITIVE_INFINITY;
  function c(h, u, d) {
    const f = h.inRange(t.x, t.y, n);
    if (i && !f)
      return;
    const g = h.getCenterPoint(n);
    if (!(!!o || s.isPointInArea(g)) && !f)
      return;
    const m = a(t, g);
    m < l ? (r = [
      {
        element: h,
        datasetIndex: u,
        index: d
      }
    ], l = m) : m === l && r.push({
      element: h,
      datasetIndex: u,
      index: d
    });
  }
  return ds(s, e, t, c), r;
}
function As(s, t, e, i, n, o) {
  return !o && !s.isPointInArea(t) ? [] : e === "r" && !i ? Th(s, t, e, n) : Eh(s, t, e, i, n, o);
}
function _o(s, t, e, i, n) {
  const o = [], r = e === "x" ? "inXRange" : "inYRange";
  let a = !1;
  return ds(s, e, t, (l, c, h) => {
    l[r] && l[r](t[e], n) && (o.push({
      element: l,
      datasetIndex: c,
      index: h
    }), a = a || l.inRange(t.x, t.y, n));
  }), i && !a ? [] : o;
}
var Oh = {
  modes: {
    index(s, t, e, i) {
      const n = Me(t, s), o = e.axis || "x", r = e.includeInvisible || !1, a = e.intersect ? Ps(s, n, o, i, r) : As(s, n, o, !1, i, r), l = [];
      return a.length ? (s.getSortedVisibleDatasetMetas().forEach((c) => {
        const h = a[0].index, u = c.data[h];
        u && !u.skip && l.push({
          element: u,
          datasetIndex: c.index,
          index: h
        });
      }), l) : [];
    },
    dataset(s, t, e, i) {
      const n = Me(t, s), o = e.axis || "xy", r = e.includeInvisible || !1;
      let a = e.intersect ? Ps(s, n, o, i, r) : As(s, n, o, !1, i, r);
      if (a.length > 0) {
        const l = a[0].datasetIndex, c = s.getDatasetMeta(l).data;
        a = [];
        for (let h = 0; h < c.length; ++h)
          a.push({
            element: c[h],
            datasetIndex: l,
            index: h
          });
      }
      return a;
    },
    point(s, t, e, i) {
      const n = Me(t, s), o = e.axis || "xy", r = e.includeInvisible || !1;
      return Ps(s, n, o, i, r);
    },
    nearest(s, t, e, i) {
      const n = Me(t, s), o = e.axis || "xy", r = e.includeInvisible || !1;
      return As(s, n, o, e.intersect, i, r);
    },
    x(s, t, e, i) {
      const n = Me(t, s);
      return _o(s, n, "x", e.intersect, i);
    },
    y(s, t, e, i) {
      const n = Me(t, s);
      return _o(s, n, "y", e.intersect, i);
    }
  }
};
const ia = [
  "left",
  "top",
  "right",
  "bottom"
];
function Ue(s, t) {
  return s.filter((e) => e.pos === t);
}
function yo(s, t) {
  return s.filter((e) => ia.indexOf(e.pos) === -1 && e.box.axis === t);
}
function Ye(s, t) {
  return s.sort((e, i) => {
    const n = t ? i : e, o = t ? e : i;
    return n.weight === o.weight ? n.index - o.index : n.weight - o.weight;
  });
}
function Dh(s) {
  const t = [];
  let e, i, n, o, r, a;
  for (e = 0, i = (s || []).length; e < i; ++e)
    n = s[e], { position: o, options: { stack: r, stackWeight: a = 1 } } = n, t.push({
      index: e,
      box: n,
      pos: o,
      horizontal: n.isHorizontal(),
      weight: n.weight,
      stack: r && o + r,
      stackWeight: a
    });
  return t;
}
function Lh(s) {
  const t = {};
  for (const e of s) {
    const { stack: i, pos: n, stackWeight: o } = e;
    if (!i || !ia.includes(n))
      continue;
    const r = t[i] || (t[i] = {
      count: 0,
      placed: 0,
      weight: 0,
      size: 0
    });
    r.count++, r.weight += o;
  }
  return t;
}
function Rh(s, t) {
  const e = Lh(s), { vBoxMaxWidth: i, hBoxMaxHeight: n } = t;
  let o, r, a;
  for (o = 0, r = s.length; o < r; ++o) {
    a = s[o];
    const { fullSize: l } = a.box, c = e[a.stack], h = c && a.stackWeight / c.weight;
    a.horizontal ? (a.width = h ? h * i : l && t.availableWidth, a.height = n) : (a.width = i, a.height = h ? h * n : l && t.availableHeight);
  }
  return e;
}
function Ih(s) {
  const t = Dh(s), e = Ye(t.filter((c) => c.box.fullSize), !0), i = Ye(Ue(t, "left"), !0), n = Ye(Ue(t, "right")), o = Ye(Ue(t, "top"), !0), r = Ye(Ue(t, "bottom")), a = yo(t, "x"), l = yo(t, "y");
  return {
    fullSize: e,
    leftAndTop: i.concat(o),
    rightAndBottom: n.concat(l).concat(r).concat(a),
    chartArea: Ue(t, "chartArea"),
    vertical: i.concat(n).concat(l),
    horizontal: o.concat(r).concat(a)
  };
}
function xo(s, t, e, i) {
  return Math.max(s[e], t[e]) + Math.max(s[i], t[i]);
}
function sa(s, t) {
  s.top = Math.max(s.top, t.top), s.left = Math.max(s.left, t.left), s.bottom = Math.max(s.bottom, t.bottom), s.right = Math.max(s.right, t.right);
}
function Fh(s, t, e, i) {
  const { pos: n, box: o } = e, r = s.maxPadding;
  if (!U(n)) {
    e.size && (s[n] -= e.size);
    const u = i[e.stack] || {
      size: 0,
      count: 1
    };
    u.size = Math.max(u.size, e.horizontal ? o.height : o.width), e.size = u.size / u.count, s[n] += e.size;
  }
  o.getPadding && sa(r, o.getPadding());
  const a = Math.max(0, t.outerWidth - xo(r, s, "left", "right")), l = Math.max(0, t.outerHeight - xo(r, s, "top", "bottom")), c = a !== s.w, h = l !== s.h;
  return s.w = a, s.h = l, e.horizontal ? {
    same: c,
    other: h
  } : {
    same: h,
    other: c
  };
}
function Nh(s) {
  const t = s.maxPadding;
  function e(i) {
    const n = Math.max(t[i] - s[i], 0);
    return s[i] += n, n;
  }
  s.y += e("top"), s.x += e("left"), e("right"), e("bottom");
}
function zh(s, t) {
  const e = t.maxPadding;
  function i(n) {
    const o = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    };
    return n.forEach((r) => {
      o[r] = Math.max(t[r], e[r]);
    }), o;
  }
  return i(s ? [
    "left",
    "right"
  ] : [
    "top",
    "bottom"
  ]);
}
function ei(s, t, e, i) {
  const n = [];
  let o, r, a, l, c, h;
  for (o = 0, r = s.length, c = 0; o < r; ++o) {
    a = s[o], l = a.box, l.update(a.width || t.w, a.height || t.h, zh(a.horizontal, t));
    const { same: u, other: d } = Fh(t, e, a, i);
    c |= u && n.length, h = h || d, l.fullSize || n.push(a);
  }
  return c && ei(n, t, e, i) || h;
}
function Di(s, t, e, i, n) {
  s.top = e, s.left = t, s.right = t + i, s.bottom = e + n, s.width = i, s.height = n;
}
function vo(s, t, e, i) {
  const n = e.padding;
  let { x: o, y: r } = t;
  for (const a of s) {
    const l = a.box, c = i[a.stack] || {
      placed: 0,
      weight: 1
    }, h = a.stackWeight / c.weight || 1;
    if (a.horizontal) {
      const u = t.w * h, d = c.size || l.height;
      gi(c.start) && (r = c.start), l.fullSize ? Di(l, n.left, r, e.outerWidth - n.right - n.left, d) : Di(l, t.left + c.placed, r, u, d), c.start = r, c.placed += u, r = l.bottom;
    } else {
      const u = t.h * h, d = c.size || l.width;
      gi(c.start) && (o = c.start), l.fullSize ? Di(l, o, n.top, d, e.outerHeight - n.bottom - n.top) : Di(l, o, t.top + c.placed, d, u), c.start = o, c.placed += u, o = l.right;
    }
  }
  t.x = o, t.y = r;
}
var St = {
  addBox(s, t) {
    s.boxes || (s.boxes = []), t.fullSize = t.fullSize || !1, t.position = t.position || "top", t.weight = t.weight || 0, t._layers = t._layers || function() {
      return [
        {
          z: 0,
          draw(e) {
            t.draw(e);
          }
        }
      ];
    }, s.boxes.push(t);
  },
  removeBox(s, t) {
    const e = s.boxes ? s.boxes.indexOf(t) : -1;
    e !== -1 && s.boxes.splice(e, 1);
  },
  configure(s, t, e) {
    t.fullSize = e.fullSize, t.position = e.position, t.weight = e.weight;
  },
  update(s, t, e, i) {
    if (!s)
      return;
    const n = Mt(s.options.layout.padding), o = Math.max(t - n.width, 0), r = Math.max(e - n.height, 0), a = Ih(s.boxes), l = a.vertical, c = a.horizontal;
    Z(s.boxes, (p) => {
      typeof p.beforeLayout == "function" && p.beforeLayout();
    });
    const h = l.reduce((p, m) => m.box.options && m.box.options.display === !1 ? p : p + 1, 0) || 1, u = Object.freeze({
      outerWidth: t,
      outerHeight: e,
      padding: n,
      availableWidth: o,
      availableHeight: r,
      vBoxMaxWidth: o / 2 / h,
      hBoxMaxHeight: r / 2
    }), d = Object.assign({}, n);
    sa(d, Mt(i));
    const f = Object.assign({
      maxPadding: d,
      w: o,
      h: r,
      x: n.left,
      y: n.top
    }, n), g = Rh(l.concat(c), u);
    ei(a.fullSize, f, u, g), ei(l, f, u, g), ei(c, f, u, g) && ei(l, f, u, g), Nh(f), vo(a.leftAndTop, f, u, g), f.x += f.w, f.y += f.h, vo(a.rightAndBottom, f, u, g), s.chartArea = {
      left: f.left,
      top: f.top,
      right: f.left + f.w,
      bottom: f.top + f.h,
      height: f.h,
      width: f.w
    }, Z(a.chartArea, (p) => {
      const m = p.box;
      Object.assign(m, s.chartArea), m.update(f.w, f.h, {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      });
    });
  }
};
class na {
  acquireContext(t, e) {
  }
  releaseContext(t) {
    return !1;
  }
  addEventListener(t, e, i) {
  }
  removeEventListener(t, e, i) {
  }
  getDevicePixelRatio() {
    return 1;
  }
  getMaximumSize(t, e, i, n) {
    return e = Math.max(0, e || t.width), i = i || t.height, {
      width: e,
      height: Math.max(0, n ? Math.floor(e / n) : i)
    };
  }
  isAttached(t) {
    return !0;
  }
  updateConfig(t) {
  }
}
class Bh extends na {
  acquireContext(t) {
    return t && t.getContext && t.getContext("2d") || null;
  }
  updateConfig(t) {
    t.options.animation = !1;
  }
}
const Yi = "$chartjs", Hh = {
  touchstart: "mousedown",
  touchmove: "mousemove",
  touchend: "mouseup",
  pointerenter: "mouseenter",
  pointerdown: "mousedown",
  pointermove: "mousemove",
  pointerup: "mouseup",
  pointerleave: "mouseout",
  pointerout: "mouseout"
}, wo = (s) => s === null || s === "";
function $h(s, t) {
  const e = s.style, i = s.getAttribute("height"), n = s.getAttribute("width");
  if (s[Yi] = {
    initial: {
      height: i,
      width: n,
      style: {
        display: e.display,
        height: e.height,
        width: e.width
      }
    }
  }, e.display = e.display || "block", e.boxSizing = e.boxSizing || "border-box", wo(n)) {
    const o = no(s, "width");
    o !== void 0 && (s.width = o);
  }
  if (wo(i))
    if (s.style.height === "")
      s.height = s.width / (t || 2);
    else {
      const o = no(s, "height");
      o !== void 0 && (s.height = o);
    }
  return s;
}
const oa = qc ? {
  passive: !0
} : !1;
function qh(s, t, e) {
  s && s.addEventListener(t, e, oa);
}
function Wh(s, t, e) {
  s && s.canvas && s.canvas.removeEventListener(t, e, oa);
}
function Vh(s, t) {
  const e = Hh[s.type] || s.type, { x: i, y: n } = Me(s, t);
  return {
    type: e,
    chart: t,
    native: s,
    x: i !== void 0 ? i : null,
    y: n !== void 0 ? n : null
  };
}
function ns(s, t) {
  for (const e of s)
    if (e === t || e.contains(t))
      return !0;
}
function jh(s, t, e) {
  const i = s.canvas, n = new MutationObserver((o) => {
    let r = !1;
    for (const a of o)
      r = r || ns(a.addedNodes, i), r = r && !ns(a.removedNodes, i);
    r && e();
  });
  return n.observe(document, {
    childList: !0,
    subtree: !0
  }), n;
}
function Uh(s, t, e) {
  const i = s.canvas, n = new MutationObserver((o) => {
    let r = !1;
    for (const a of o)
      r = r || ns(a.removedNodes, i), r = r && !ns(a.addedNodes, i);
    r && e();
  });
  return n.observe(document, {
    childList: !0,
    subtree: !0
  }), n;
}
const bi = /* @__PURE__ */ new Map();
let So = 0;
function ra() {
  const s = window.devicePixelRatio;
  s !== So && (So = s, bi.forEach((t, e) => {
    e.currentDevicePixelRatio !== s && t();
  }));
}
function Yh(s, t) {
  bi.size || window.addEventListener("resize", ra), bi.set(s, t);
}
function Kh(s) {
  bi.delete(s), bi.size || window.removeEventListener("resize", ra);
}
function Xh(s, t, e) {
  const i = s.canvas, n = i && kn(i);
  if (!n)
    return;
  const o = Ir((a, l) => {
    const c = n.clientWidth;
    e(a, l), c < n.clientWidth && e();
  }, window), r = new ResizeObserver((a) => {
    const l = a[0], c = l.contentRect.width, h = l.contentRect.height;
    c === 0 && h === 0 || o(c, h);
  });
  return r.observe(n), Yh(s, o), r;
}
function Cs(s, t, e) {
  e && e.disconnect(), t === "resize" && Kh(s);
}
function Gh(s, t, e) {
  const i = s.canvas, n = Ir((o) => {
    s.ctx !== null && e(Vh(o, s));
  }, s);
  return qh(i, t, n), n;
}
class Qh extends na {
  acquireContext(t, e) {
    const i = t && t.getContext && t.getContext("2d");
    return i && i.canvas === t ? ($h(t, e), i) : null;
  }
  releaseContext(t) {
    const e = t.canvas;
    if (!e[Yi])
      return !1;
    const i = e[Yi].initial;
    [
      "height",
      "width"
    ].forEach((o) => {
      const r = i[o];
      j(r) ? e.removeAttribute(o) : e.setAttribute(o, r);
    });
    const n = i.style || {};
    return Object.keys(n).forEach((o) => {
      e.style[o] = n[o];
    }), e.width = e.width, delete e[Yi], !0;
  }
  addEventListener(t, e, i) {
    this.removeEventListener(t, e);
    const n = t.$proxies || (t.$proxies = {}), r = {
      attach: jh,
      detach: Uh,
      resize: Xh
    }[e] || Gh;
    n[e] = r(t, e, i);
  }
  removeEventListener(t, e) {
    const i = t.$proxies || (t.$proxies = {}), n = i[e];
    if (!n)
      return;
    ({
      attach: Cs,
      detach: Cs,
      resize: Cs
    }[e] || Wh)(t, e, n), i[e] = void 0;
  }
  getDevicePixelRatio() {
    return window.devicePixelRatio;
  }
  getMaximumSize(t, e, i, n) {
    return $c(t, e, i, n);
  }
  isAttached(t) {
    const e = t && kn(t);
    return !!(e && e.isConnected);
  }
}
function Jh(s) {
  return !Mn() || typeof OffscreenCanvas < "u" && s instanceof OffscreenCanvas ? Bh : Qh;
}
var $i;
let oe = ($i = class {
  constructor() {
    P(this, "x");
    P(this, "y");
    P(this, "active", !1);
    P(this, "options");
    P(this, "$animations");
  }
  tooltipPosition(t) {
    const { x: e, y: i } = this.getProps([
      "x",
      "y"
    ], t);
    return {
      x: e,
      y: i
    };
  }
  hasValue() {
    return He(this.x) && He(this.y);
  }
  getProps(t, e) {
    const i = this.$animations;
    if (!e || !i)
      return this;
    const n = {};
    return t.forEach((o) => {
      n[o] = i[o] && i[o].active() ? i[o]._to : this[o];
    }), n;
  }
}, P($i, "defaults", {}), P($i, "defaultRoutes"), $i);
function Zh(s, t) {
  const e = s.options.ticks, i = tu(s), n = Math.min(e.maxTicksLimit || i, i), o = e.major.enabled ? iu(t) : [], r = o.length, a = o[0], l = o[r - 1], c = [];
  if (r > n)
    return su(t, c, o, r / n), c;
  const h = eu(o, t, n);
  if (r > 0) {
    let u, d;
    const f = r > 1 ? Math.round((l - a) / (r - 1)) : null;
    for (Li(t, c, h, j(f) ? 0 : a - f, a), u = 0, d = r - 1; u < d; u++)
      Li(t, c, h, o[u], o[u + 1]);
    return Li(t, c, h, l, j(f) ? t.length : l + f), c;
  }
  return Li(t, c, h), c;
}
function tu(s) {
  const t = s.options.offset, e = s._tickSize(), i = s._length / e + (t ? 0 : 1), n = s._maxLength / e;
  return Math.floor(Math.min(i, n));
}
function eu(s, t, e) {
  const i = nu(s), n = t.length / e;
  if (!i)
    return Math.max(n, 1);
  const o = Vl(i);
  for (let r = 0, a = o.length - 1; r < a; r++) {
    const l = o[r];
    if (l > n)
      return l;
  }
  return Math.max(n, 1);
}
function iu(s) {
  const t = [];
  let e, i;
  for (e = 0, i = s.length; e < i; e++)
    s[e].major && t.push(e);
  return t;
}
function su(s, t, e, i) {
  let n = 0, o = e[0], r;
  for (i = Math.ceil(i), r = 0; r < s.length; r++)
    r === o && (t.push(s[r]), n++, o = e[n * i]);
}
function Li(s, t, e, i, n) {
  const o = W(i, 0), r = Math.min(W(n, s.length), s.length);
  let a = 0, l, c, h;
  for (e = Math.ceil(e), n && (l = n - i, e = l / Math.floor(l / e)), h = o; h < 0; )
    a++, h = Math.round(o + a * e);
  for (c = Math.max(o, 0); c < r; c++)
    c === h && (t.push(s[c]), a++, h = Math.round(o + a * e));
}
function nu(s) {
  const t = s.length;
  let e, i;
  if (t < 2)
    return !1;
  for (i = s[0], e = 1; e < t; ++e)
    if (s[e] - s[e - 1] !== i)
      return !1;
  return i;
}
const ou = (s) => s === "left" ? "right" : s === "right" ? "left" : s, Mo = (s, t, e) => t === "top" || t === "left" ? s[t] + e : s[t] - e, ko = (s, t) => Math.min(t || s, s);
function Po(s, t) {
  const e = [], i = s.length / t, n = s.length;
  let o = 0;
  for (; o < n; o += i)
    e.push(s[Math.floor(o)]);
  return e;
}
function ru(s, t, e) {
  const i = s.ticks.length, n = Math.min(t, i - 1), o = s._startPixel, r = s._endPixel, a = 1e-6;
  let l = s.getPixelForTick(n), c;
  if (!(e && (i === 1 ? c = Math.max(l - o, r - l) : t === 0 ? c = (s.getPixelForTick(1) - l) / 2 : c = (l - s.getPixelForTick(n - 1)) / 2, l += n < t ? c : -c, l < o - a || l > r + a)))
    return l;
}
function au(s, t) {
  Z(s, (e) => {
    const i = e.gc, n = i.length / 2;
    let o;
    if (n > t) {
      for (o = 0; o < n; ++o)
        delete e.data[i[o]];
      i.splice(0, n);
    }
  });
}
function Ke(s) {
  return s.drawTicks ? s.tickLength : 0;
}
function Ao(s, t) {
  if (!s.display)
    return 0;
  const e = ft(s.font, t), i = Mt(s.padding);
  return (st(s.text) ? s.text.length : 1) * e.lineHeight + i.height;
}
function lu(s, t) {
  return be(s, {
    scale: t,
    type: "scale"
  });
}
function cu(s, t, e) {
  return be(s, {
    tick: e,
    index: t,
    type: "tick"
  });
}
function hu(s, t, e) {
  let i = _n(s);
  return (e && t !== "right" || !e && t === "right") && (i = ou(i)), i;
}
function uu(s, t, e, i) {
  const { top: n, left: o, bottom: r, right: a, chart: l } = s, { chartArea: c, scales: h } = l;
  let u = 0, d, f, g;
  const p = r - n, m = a - o;
  if (s.isHorizontal()) {
    if (f = vt(i, o, a), U(e)) {
      const b = Object.keys(e)[0], _ = e[b];
      g = h[b].getPixelForValue(_) + p - t;
    } else e === "center" ? g = (c.bottom + c.top) / 2 + p - t : g = Mo(s, e, t);
    d = a - o;
  } else {
    if (U(e)) {
      const b = Object.keys(e)[0], _ = e[b];
      f = h[b].getPixelForValue(_) - m + t;
    } else e === "center" ? f = (c.left + c.right) / 2 - m + t : f = Mo(s, e, t);
    g = vt(i, r, n), u = e === "left" ? -lt : lt;
  }
  return {
    titleX: f,
    titleY: g,
    maxWidth: d,
    rotation: u
  };
}
class De extends oe {
  constructor(t) {
    super(), this.id = t.id, this.type = t.type, this.options = void 0, this.ctx = t.ctx, this.chart = t.chart, this.top = void 0, this.bottom = void 0, this.left = void 0, this.right = void 0, this.width = void 0, this.height = void 0, this._margins = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }, this.maxWidth = void 0, this.maxHeight = void 0, this.paddingTop = void 0, this.paddingBottom = void 0, this.paddingLeft = void 0, this.paddingRight = void 0, this.axis = void 0, this.labelRotation = void 0, this.min = void 0, this.max = void 0, this._range = void 0, this.ticks = [], this._gridLineItems = null, this._labelItems = null, this._labelSizes = null, this._length = 0, this._maxLength = 0, this._longestTextCache = {}, this._startPixel = void 0, this._endPixel = void 0, this._reversePixels = !1, this._userMax = void 0, this._userMin = void 0, this._suggestedMax = void 0, this._suggestedMin = void 0, this._ticksLength = 0, this._borderValue = 0, this._cache = {}, this._dataLimitsCached = !1, this.$context = void 0;
  }
  init(t) {
    this.options = t.setContext(this.getContext()), this.axis = t.axis, this._userMin = this.parse(t.min), this._userMax = this.parse(t.max), this._suggestedMin = this.parse(t.suggestedMin), this._suggestedMax = this.parse(t.suggestedMax);
  }
  parse(t, e) {
    return t;
  }
  getUserBounds() {
    let { _userMin: t, _userMax: e, _suggestedMin: i, _suggestedMax: n } = this;
    return t = Dt(t, Number.POSITIVE_INFINITY), e = Dt(e, Number.NEGATIVE_INFINITY), i = Dt(i, Number.POSITIVE_INFINITY), n = Dt(n, Number.NEGATIVE_INFINITY), {
      min: Dt(t, i),
      max: Dt(e, n),
      minDefined: at(t),
      maxDefined: at(e)
    };
  }
  getMinMax(t) {
    let { min: e, max: i, minDefined: n, maxDefined: o } = this.getUserBounds(), r;
    if (n && o)
      return {
        min: e,
        max: i
      };
    const a = this.getMatchingVisibleMetas();
    for (let l = 0, c = a.length; l < c; ++l)
      r = a[l].controller.getMinMax(this, t), n || (e = Math.min(e, r.min)), o || (i = Math.max(i, r.max));
    return e = o && e > i ? i : e, i = n && e > i ? e : i, {
      min: Dt(e, Dt(i, e)),
      max: Dt(i, Dt(e, i))
    };
  }
  getPadding() {
    return {
      left: this.paddingLeft || 0,
      top: this.paddingTop || 0,
      right: this.paddingRight || 0,
      bottom: this.paddingBottom || 0
    };
  }
  getTicks() {
    return this.ticks;
  }
  getLabels() {
    const t = this.chart.data;
    return this.options.labels || (this.isHorizontal() ? t.xLabels : t.yLabels) || t.labels || [];
  }
  getLabelItems(t = this.chart.chartArea) {
    return this._labelItems || (this._labelItems = this._computeLabelItems(t));
  }
  beforeLayout() {
    this._cache = {}, this._dataLimitsCached = !1;
  }
  beforeUpdate() {
    et(this.options.beforeUpdate, [
      this
    ]);
  }
  update(t, e, i) {
    const { beginAtZero: n, grace: o, ticks: r } = this.options, a = r.sampleSize;
    this.beforeUpdate(), this.maxWidth = t, this.maxHeight = e, this._margins = i = Object.assign({
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }, i), this.ticks = null, this._labelSizes = null, this._gridLineItems = null, this._labelItems = null, this.beforeSetDimensions(), this.setDimensions(), this.afterSetDimensions(), this._maxLength = this.isHorizontal() ? this.width + i.left + i.right : this.height + i.top + i.bottom, this._dataLimitsCached || (this.beforeDataLimits(), this.determineDataLimits(), this.afterDataLimits(), this._range = yc(this, o, n), this._dataLimitsCached = !0), this.beforeBuildTicks(), this.ticks = this.buildTicks() || [], this.afterBuildTicks();
    const l = a < this.ticks.length;
    this._convertTicksToLabels(l ? Po(this.ticks, a) : this.ticks), this.configure(), this.beforeCalculateLabelRotation(), this.calculateLabelRotation(), this.afterCalculateLabelRotation(), r.display && (r.autoSkip || r.source === "auto") && (this.ticks = Zh(this, this.ticks), this._labelSizes = null, this.afterAutoSkip()), l && this._convertTicksToLabels(this.ticks), this.beforeFit(), this.fit(), this.afterFit(), this.afterUpdate();
  }
  configure() {
    let t = this.options.reverse, e, i;
    this.isHorizontal() ? (e = this.left, i = this.right) : (e = this.top, i = this.bottom, t = !t), this._startPixel = e, this._endPixel = i, this._reversePixels = t, this._length = i - e, this._alignToPixels = this.options.alignToPixels;
  }
  afterUpdate() {
    et(this.options.afterUpdate, [
      this
    ]);
  }
  beforeSetDimensions() {
    et(this.options.beforeSetDimensions, [
      this
    ]);
  }
  setDimensions() {
    this.isHorizontal() ? (this.width = this.maxWidth, this.left = 0, this.right = this.width) : (this.height = this.maxHeight, this.top = 0, this.bottom = this.height), this.paddingLeft = 0, this.paddingTop = 0, this.paddingRight = 0, this.paddingBottom = 0;
  }
  afterSetDimensions() {
    et(this.options.afterSetDimensions, [
      this
    ]);
  }
  _callHooks(t) {
    this.chart.notifyPlugins(t, this.getContext()), et(this.options[t], [
      this
    ]);
  }
  beforeDataLimits() {
    this._callHooks("beforeDataLimits");
  }
  determineDataLimits() {
  }
  afterDataLimits() {
    this._callHooks("afterDataLimits");
  }
  beforeBuildTicks() {
    this._callHooks("beforeBuildTicks");
  }
  buildTicks() {
    return [];
  }
  afterBuildTicks() {
    this._callHooks("afterBuildTicks");
  }
  beforeTickToLabelConversion() {
    et(this.options.beforeTickToLabelConversion, [
      this
    ]);
  }
  generateTickLabels(t) {
    const e = this.options.ticks;
    let i, n, o;
    for (i = 0, n = t.length; i < n; i++)
      o = t[i], o.label = et(e.callback, [
        o.value,
        i,
        t
      ], this);
  }
  afterTickToLabelConversion() {
    et(this.options.afterTickToLabelConversion, [
      this
    ]);
  }
  beforeCalculateLabelRotation() {
    et(this.options.beforeCalculateLabelRotation, [
      this
    ]);
  }
  calculateLabelRotation() {
    const t = this.options, e = t.ticks, i = ko(this.ticks.length, t.ticks.maxTicksLimit), n = e.minRotation || 0, o = e.maxRotation;
    let r = n, a, l, c;
    if (!this._isVisible() || !e.display || n >= o || i <= 1 || !this.isHorizontal()) {
      this.labelRotation = n;
      return;
    }
    const h = this._getLabelSizes(), u = h.widest.width, d = h.highest.height, f = bt(this.chart.width - u, 0, this.maxWidth);
    a = t.offset ? this.maxWidth / i : f / (i - 1), u + 6 > a && (a = f / (i - (t.offset ? 0.5 : 1)), l = this.maxHeight - Ke(t.grid) - e.padding - Ao(t.title, this.chart.options.font), c = Math.sqrt(u * u + d * d), r = mn(Math.min(Math.asin(bt((h.highest.height + 6) / a, -1, 1)), Math.asin(bt(l / c, -1, 1)) - Math.asin(bt(d / c, -1, 1)))), r = Math.max(n, Math.min(o, r))), this.labelRotation = r;
  }
  afterCalculateLabelRotation() {
    et(this.options.afterCalculateLabelRotation, [
      this
    ]);
  }
  afterAutoSkip() {
  }
  beforeFit() {
    et(this.options.beforeFit, [
      this
    ]);
  }
  fit() {
    const t = {
      width: 0,
      height: 0
    }, { chart: e, options: { ticks: i, title: n, grid: o } } = this, r = this._isVisible(), a = this.isHorizontal();
    if (r) {
      const l = Ao(n, e.options.font);
      if (a ? (t.width = this.maxWidth, t.height = Ke(o) + l) : (t.height = this.maxHeight, t.width = Ke(o) + l), i.display && this.ticks.length) {
        const { first: c, last: h, widest: u, highest: d } = this._getLabelSizes(), f = i.padding * 2, g = $t(this.labelRotation), p = Math.cos(g), m = Math.sin(g);
        if (a) {
          const b = i.mirror ? 0 : m * u.width + p * d.height;
          t.height = Math.min(this.maxHeight, t.height + b + f);
        } else {
          const b = i.mirror ? 0 : p * u.width + m * d.height;
          t.width = Math.min(this.maxWidth, t.width + b + f);
        }
        this._calculatePadding(c, h, m, p);
      }
    }
    this._handleMargins(), a ? (this.width = this._length = e.width - this._margins.left - this._margins.right, this.height = t.height) : (this.width = t.width, this.height = this._length = e.height - this._margins.top - this._margins.bottom);
  }
  _calculatePadding(t, e, i, n) {
    const { ticks: { align: o, padding: r }, position: a } = this.options, l = this.labelRotation !== 0, c = a !== "top" && this.axis === "x";
    if (this.isHorizontal()) {
      const h = this.getPixelForTick(0) - this.left, u = this.right - this.getPixelForTick(this.ticks.length - 1);
      let d = 0, f = 0;
      l ? c ? (d = n * t.width, f = i * e.height) : (d = i * t.height, f = n * e.width) : o === "start" ? f = e.width : o === "end" ? d = t.width : o !== "inner" && (d = t.width / 2, f = e.width / 2), this.paddingLeft = Math.max((d - h + r) * this.width / (this.width - h), 0), this.paddingRight = Math.max((f - u + r) * this.width / (this.width - u), 0);
    } else {
      let h = e.height / 2, u = t.height / 2;
      o === "start" ? (h = 0, u = t.height) : o === "end" && (h = e.height, u = 0), this.paddingTop = h + r, this.paddingBottom = u + r;
    }
  }
  _handleMargins() {
    this._margins && (this._margins.left = Math.max(this.paddingLeft, this._margins.left), this._margins.top = Math.max(this.paddingTop, this._margins.top), this._margins.right = Math.max(this.paddingRight, this._margins.right), this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom));
  }
  afterFit() {
    et(this.options.afterFit, [
      this
    ]);
  }
  isHorizontal() {
    const { axis: t, position: e } = this.options;
    return e === "top" || e === "bottom" || t === "x";
  }
  isFullSize() {
    return this.options.fullSize;
  }
  _convertTicksToLabels(t) {
    this.beforeTickToLabelConversion(), this.generateTickLabels(t);
    let e, i;
    for (e = 0, i = t.length; e < i; e++)
      j(t[e].label) && (t.splice(e, 1), i--, e--);
    this.afterTickToLabelConversion();
  }
  _getLabelSizes() {
    let t = this._labelSizes;
    if (!t) {
      const e = this.options.ticks.sampleSize;
      let i = this.ticks;
      e < i.length && (i = Po(i, e)), this._labelSizes = t = this._computeLabelSizes(i, i.length, this.options.ticks.maxTicksLimit);
    }
    return t;
  }
  _computeLabelSizes(t, e, i) {
    const { ctx: n, _longestTextCache: o } = this, r = [], a = [], l = Math.floor(e / ko(e, i));
    let c = 0, h = 0, u, d, f, g, p, m, b, _, k, M, S;
    for (u = 0; u < e; u += l) {
      if (g = t[u].label, p = this._resolveTickFontOptions(u), n.font = m = p.string, b = o[m] = o[m] || {
        data: {},
        gc: []
      }, _ = p.lineHeight, k = M = 0, !j(g) && !st(g))
        k = is(n, b.data, b.gc, k, g), M = _;
      else if (st(g))
        for (d = 0, f = g.length; d < f; ++d)
          S = g[d], !j(S) && !st(S) && (k = is(n, b.data, b.gc, k, S), M += _);
      r.push(k), a.push(M), c = Math.max(k, c), h = Math.max(M, h);
    }
    au(o, e);
    const O = r.indexOf(c), C = a.indexOf(h), A = (L) => ({
      width: r[L] || 0,
      height: a[L] || 0
    });
    return {
      first: A(0),
      last: A(e - 1),
      widest: A(O),
      highest: A(C),
      widths: r,
      heights: a
    };
  }
  getLabelForValue(t) {
    return t;
  }
  getPixelForValue(t, e) {
    return NaN;
  }
  getValueForPixel(t) {
  }
  getPixelForTick(t) {
    const e = this.ticks;
    return t < 0 || t > e.length - 1 ? null : this.getPixelForValue(e[t].value);
  }
  getPixelForDecimal(t) {
    this._reversePixels && (t = 1 - t);
    const e = this._startPixel + t * this._length;
    return Kl(this._alignToPixels ? xe(this.chart, e, 0) : e);
  }
  getDecimalForPixel(t) {
    const e = (t - this._startPixel) / this._length;
    return this._reversePixels ? 1 - e : e;
  }
  getBasePixel() {
    return this.getPixelForValue(this.getBaseValue());
  }
  getBaseValue() {
    const { min: t, max: e } = this;
    return t < 0 && e < 0 ? e : t > 0 && e > 0 ? t : 0;
  }
  getContext(t) {
    const e = this.ticks || [];
    if (t >= 0 && t < e.length) {
      const i = e[t];
      return i.$context || (i.$context = cu(this.getContext(), t, i));
    }
    return this.$context || (this.$context = lu(this.chart.getContext(), this));
  }
  _tickSize() {
    const t = this.options.ticks, e = $t(this.labelRotation), i = Math.abs(Math.cos(e)), n = Math.abs(Math.sin(e)), o = this._getLabelSizes(), r = t.autoSkipPadding || 0, a = o ? o.widest.width + r : 0, l = o ? o.highest.height + r : 0;
    return this.isHorizontal() ? l * i > a * n ? a / i : l / n : l * n < a * i ? l / i : a / n;
  }
  _isVisible() {
    const t = this.options.display;
    return t !== "auto" ? !!t : this.getMatchingVisibleMetas().length > 0;
  }
  _computeGridLineItems(t) {
    const e = this.axis, i = this.chart, n = this.options, { grid: o, position: r, border: a } = n, l = o.offset, c = this.isHorizontal(), u = this.ticks.length + (l ? 1 : 0), d = Ke(o), f = [], g = a.setContext(this.getContext()), p = g.display ? g.width : 0, m = p / 2, b = function(X) {
      return xe(i, X, p);
    };
    let _, k, M, S, O, C, A, L, H, q, V, ot;
    if (r === "top")
      _ = b(this.bottom), C = this.bottom - d, L = _ - m, q = b(t.top) + m, ot = t.bottom;
    else if (r === "bottom")
      _ = b(this.top), q = t.top, ot = b(t.bottom) - m, C = _ + m, L = this.top + d;
    else if (r === "left")
      _ = b(this.right), O = this.right - d, A = _ - m, H = b(t.left) + m, V = t.right;
    else if (r === "right")
      _ = b(this.left), H = t.left, V = b(t.right) - m, O = _ + m, A = this.left + d;
    else if (e === "x") {
      if (r === "center")
        _ = b((t.top + t.bottom) / 2 + 0.5);
      else if (U(r)) {
        const X = Object.keys(r)[0], tt = r[X];
        _ = b(this.chart.scales[X].getPixelForValue(tt));
      }
      q = t.top, ot = t.bottom, C = _ + m, L = C + d;
    } else if (e === "y") {
      if (r === "center")
        _ = b((t.left + t.right) / 2);
      else if (U(r)) {
        const X = Object.keys(r)[0], tt = r[X];
        _ = b(this.chart.scales[X].getPixelForValue(tt));
      }
      O = _ - m, A = O - d, H = t.left, V = t.right;
    }
    const ct = W(n.ticks.maxTicksLimit, u), Y = Math.max(1, Math.ceil(u / ct));
    for (k = 0; k < u; k += Y) {
      const X = this.getContext(k), tt = o.setContext(X), _t = a.setContext(X), G = tt.lineWidth, Lt = tt.color, re = _t.dash || [], Bt = _t.dashOffset, E = tt.tickWidth, T = tt.tickColor, R = tt.tickBorderDash || [], I = tt.tickBorderDashOffset;
      M = ru(this, k, l), M !== void 0 && (S = xe(i, M, G), c ? O = A = H = V = S : C = L = q = ot = S, f.push({
        tx1: O,
        ty1: C,
        tx2: A,
        ty2: L,
        x1: H,
        y1: q,
        x2: V,
        y2: ot,
        width: G,
        color: Lt,
        borderDash: re,
        borderDashOffset: Bt,
        tickWidth: E,
        tickColor: T,
        tickBorderDash: R,
        tickBorderDashOffset: I
      }));
    }
    return this._ticksLength = u, this._borderValue = _, f;
  }
  _computeLabelItems(t) {
    const e = this.axis, i = this.options, { position: n, ticks: o } = i, r = this.isHorizontal(), a = this.ticks, { align: l, crossAlign: c, padding: h, mirror: u } = o, d = Ke(i.grid), f = d + h, g = u ? -h : f, p = -$t(this.labelRotation), m = [];
    let b, _, k, M, S, O, C, A, L, H, q, V, ot = "middle";
    if (n === "top")
      O = this.bottom - g, C = this._getXAxisLabelAlignment();
    else if (n === "bottom")
      O = this.top + g, C = this._getXAxisLabelAlignment();
    else if (n === "left") {
      const Y = this._getYAxisLabelAlignment(d);
      C = Y.textAlign, S = Y.x;
    } else if (n === "right") {
      const Y = this._getYAxisLabelAlignment(d);
      C = Y.textAlign, S = Y.x;
    } else if (e === "x") {
      if (n === "center")
        O = (t.top + t.bottom) / 2 + f;
      else if (U(n)) {
        const Y = Object.keys(n)[0], X = n[Y];
        O = this.chart.scales[Y].getPixelForValue(X) + f;
      }
      C = this._getXAxisLabelAlignment();
    } else if (e === "y") {
      if (n === "center")
        S = (t.left + t.right) / 2 - f;
      else if (U(n)) {
        const Y = Object.keys(n)[0], X = n[Y];
        S = this.chart.scales[Y].getPixelForValue(X);
      }
      C = this._getYAxisLabelAlignment(d).textAlign;
    }
    e === "y" && (l === "start" ? ot = "top" : l === "end" && (ot = "bottom"));
    const ct = this._getLabelSizes();
    for (b = 0, _ = a.length; b < _; ++b) {
      k = a[b], M = k.label;
      const Y = o.setContext(this.getContext(b));
      A = this.getPixelForTick(b) + o.labelOffset, L = this._resolveTickFontOptions(b), H = L.lineHeight, q = st(M) ? M.length : 1;
      const X = q / 2, tt = Y.color, _t = Y.textStrokeColor, G = Y.textStrokeWidth;
      let Lt = C;
      r ? (S = A, C === "inner" && (b === _ - 1 ? Lt = this.options.reverse ? "left" : "right" : b === 0 ? Lt = this.options.reverse ? "right" : "left" : Lt = "center"), n === "top" ? c === "near" || p !== 0 ? V = -q * H + H / 2 : c === "center" ? V = -ct.highest.height / 2 - X * H + H : V = -ct.highest.height + H / 2 : c === "near" || p !== 0 ? V = H / 2 : c === "center" ? V = ct.highest.height / 2 - X * H : V = ct.highest.height - q * H, u && (V *= -1), p !== 0 && !Y.showLabelBackdrop && (S += H / 2 * Math.sin(p))) : (O = A, V = (1 - q) * H / 2);
      let re;
      if (Y.showLabelBackdrop) {
        const Bt = Mt(Y.backdropPadding), E = ct.heights[b], T = ct.widths[b];
        let R = V - Bt.top, I = 0 - Bt.left;
        switch (ot) {
          case "middle":
            R -= E / 2;
            break;
          case "bottom":
            R -= E;
            break;
        }
        switch (C) {
          case "center":
            I -= T / 2;
            break;
          case "right":
            I -= T;
            break;
          case "inner":
            b === _ - 1 ? I -= T : b > 0 && (I -= T / 2);
            break;
        }
        re = {
          left: I,
          top: R,
          width: T + Bt.width,
          height: E + Bt.height,
          color: Y.backdropColor
        };
      }
      m.push({
        label: M,
        font: L,
        textOffset: V,
        options: {
          rotation: p,
          color: tt,
          strokeColor: _t,
          strokeWidth: G,
          textAlign: Lt,
          textBaseline: ot,
          translation: [
            S,
            O
          ],
          backdrop: re
        }
      });
    }
    return m;
  }
  _getXAxisLabelAlignment() {
    const { position: t, ticks: e } = this.options;
    if (-$t(this.labelRotation))
      return t === "top" ? "left" : "right";
    let n = "center";
    return e.align === "start" ? n = "left" : e.align === "end" ? n = "right" : e.align === "inner" && (n = "inner"), n;
  }
  _getYAxisLabelAlignment(t) {
    const { position: e, ticks: { crossAlign: i, mirror: n, padding: o } } = this.options, r = this._getLabelSizes(), a = t + o, l = r.widest.width;
    let c, h;
    return e === "left" ? n ? (h = this.right + o, i === "near" ? c = "left" : i === "center" ? (c = "center", h += l / 2) : (c = "right", h += l)) : (h = this.right - a, i === "near" ? c = "right" : i === "center" ? (c = "center", h -= l / 2) : (c = "left", h = this.left)) : e === "right" ? n ? (h = this.left + o, i === "near" ? c = "right" : i === "center" ? (c = "center", h -= l / 2) : (c = "left", h -= l)) : (h = this.left + a, i === "near" ? c = "left" : i === "center" ? (c = "center", h += l / 2) : (c = "right", h = this.right)) : c = "right", {
      textAlign: c,
      x: h
    };
  }
  _computeLabelArea() {
    if (this.options.ticks.mirror)
      return;
    const t = this.chart, e = this.options.position;
    if (e === "left" || e === "right")
      return {
        top: 0,
        left: this.left,
        bottom: t.height,
        right: this.right
      };
    if (e === "top" || e === "bottom")
      return {
        top: this.top,
        left: 0,
        bottom: this.bottom,
        right: t.width
      };
  }
  drawBackground() {
    const { ctx: t, options: { backgroundColor: e }, left: i, top: n, width: o, height: r } = this;
    e && (t.save(), t.fillStyle = e, t.fillRect(i, n, o, r), t.restore());
  }
  getLineWidthForValue(t) {
    const e = this.options.grid;
    if (!this._isVisible() || !e.display)
      return 0;
    const n = this.ticks.findIndex((o) => o.value === t);
    return n >= 0 ? e.setContext(this.getContext(n)).lineWidth : 0;
  }
  drawGrid(t) {
    const e = this.options.grid, i = this.ctx, n = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(t));
    let o, r;
    const a = (l, c, h) => {
      !h.width || !h.color || (i.save(), i.lineWidth = h.width, i.strokeStyle = h.color, i.setLineDash(h.borderDash || []), i.lineDashOffset = h.borderDashOffset, i.beginPath(), i.moveTo(l.x, l.y), i.lineTo(c.x, c.y), i.stroke(), i.restore());
    };
    if (e.display)
      for (o = 0, r = n.length; o < r; ++o) {
        const l = n[o];
        e.drawOnChartArea && a({
          x: l.x1,
          y: l.y1
        }, {
          x: l.x2,
          y: l.y2
        }, l), e.drawTicks && a({
          x: l.tx1,
          y: l.ty1
        }, {
          x: l.tx2,
          y: l.ty2
        }, {
          color: l.tickColor,
          width: l.tickWidth,
          borderDash: l.tickBorderDash,
          borderDashOffset: l.tickBorderDashOffset
        });
      }
  }
  drawBorder() {
    const { chart: t, ctx: e, options: { border: i, grid: n } } = this, o = i.setContext(this.getContext()), r = i.display ? o.width : 0;
    if (!r)
      return;
    const a = n.setContext(this.getContext(0)).lineWidth, l = this._borderValue;
    let c, h, u, d;
    this.isHorizontal() ? (c = xe(t, this.left, r) - r / 2, h = xe(t, this.right, a) + a / 2, u = d = l) : (u = xe(t, this.top, r) - r / 2, d = xe(t, this.bottom, a) + a / 2, c = h = l), e.save(), e.lineWidth = o.width, e.strokeStyle = o.color, e.beginPath(), e.moveTo(c, u), e.lineTo(h, d), e.stroke(), e.restore();
  }
  drawLabels(t) {
    if (!this.options.ticks.display)
      return;
    const i = this.ctx, n = this._computeLabelArea();
    n && cs(i, n);
    const o = this.getLabelItems(t);
    for (const r of o) {
      const a = r.options, l = r.font, c = r.label, h = r.textOffset;
      Oe(i, c, 0, h, l, a);
    }
    n && hs(i);
  }
  drawTitle() {
    const { ctx: t, options: { position: e, title: i, reverse: n } } = this;
    if (!i.display)
      return;
    const o = ft(i.font), r = Mt(i.padding), a = i.align;
    let l = o.lineHeight / 2;
    e === "bottom" || e === "center" || U(e) ? (l += r.bottom, st(i.text) && (l += o.lineHeight * (i.text.length - 1))) : l += r.top;
    const { titleX: c, titleY: h, maxWidth: u, rotation: d } = uu(this, l, e, a);
    Oe(t, i.text, 0, 0, o, {
      color: i.color,
      maxWidth: u,
      rotation: d,
      textAlign: hu(a, e, n),
      textBaseline: "middle",
      translation: [
        c,
        h
      ]
    });
  }
  draw(t) {
    this._isVisible() && (this.drawBackground(), this.drawGrid(t), this.drawBorder(), this.drawTitle(), this.drawLabels(t));
  }
  _layers() {
    const t = this.options, e = t.ticks && t.ticks.z || 0, i = W(t.grid && t.grid.z, -1), n = W(t.border && t.border.z, 0);
    return !this._isVisible() || this.draw !== De.prototype.draw ? [
      {
        z: e,
        draw: (o) => {
          this.draw(o);
        }
      }
    ] : [
      {
        z: i,
        draw: (o) => {
          this.drawBackground(), this.drawGrid(o), this.drawTitle();
        }
      },
      {
        z: n,
        draw: () => {
          this.drawBorder();
        }
      },
      {
        z: e,
        draw: (o) => {
          this.drawLabels(o);
        }
      }
    ];
  }
  getMatchingVisibleMetas(t) {
    const e = this.chart.getSortedVisibleDatasetMetas(), i = this.axis + "AxisID", n = [];
    let o, r;
    for (o = 0, r = e.length; o < r; ++o) {
      const a = e[o];
      a[i] === this.id && (!t || a.type === t) && n.push(a);
    }
    return n;
  }
  _resolveTickFontOptions(t) {
    const e = this.options.ticks.setContext(this.getContext(t));
    return ft(e.font);
  }
  _maxDigits() {
    const t = this._resolveTickFontOptions(0).lineHeight;
    return (this.isHorizontal() ? this.width : this.height) / t;
  }
}
class Ri {
  constructor(t, e, i) {
    this.type = t, this.scope = e, this.override = i, this.items = /* @__PURE__ */ Object.create(null);
  }
  isForType(t) {
    return Object.prototype.isPrototypeOf.call(this.type.prototype, t.prototype);
  }
  register(t) {
    const e = Object.getPrototypeOf(t);
    let i;
    gu(e) && (i = this.register(e));
    const n = this.items, o = t.id, r = this.scope + "." + o;
    if (!o)
      throw new Error("class does not have id: " + t);
    return o in n || (n[o] = t, du(t, r, i), this.override && nt.override(t.id, t.overrides)), r;
  }
  get(t) {
    return this.items[t];
  }
  unregister(t) {
    const e = this.items, i = t.id, n = this.scope;
    i in e && delete e[i], n && i in nt[n] && (delete nt[n][i], this.override && delete Ee[i]);
  }
}
function du(s, t, e) {
  const i = fi(/* @__PURE__ */ Object.create(null), [
    e ? nt.get(e) : {},
    nt.get(t),
    s.defaults
  ]);
  nt.set(t, i), s.defaultRoutes && fu(t, s.defaultRoutes), s.descriptors && nt.describe(t, s.descriptors);
}
function fu(s, t) {
  Object.keys(t).forEach((e) => {
    const i = e.split("."), n = i.pop(), o = [
      s
    ].concat(i).join("."), r = t[e].split("."), a = r.pop(), l = r.join(".");
    nt.route(o, n, l, a);
  });
}
function gu(s) {
  return "id" in s && "defaults" in s;
}
class pu {
  constructor() {
    this.controllers = new Ri(qt, "datasets", !0), this.elements = new Ri(oe, "elements"), this.plugins = new Ri(Object, "plugins"), this.scales = new Ri(De, "scales"), this._typedRegistries = [
      this.controllers,
      this.scales,
      this.elements
    ];
  }
  add(...t) {
    this._each("register", t);
  }
  remove(...t) {
    this._each("unregister", t);
  }
  addControllers(...t) {
    this._each("register", t, this.controllers);
  }
  addElements(...t) {
    this._each("register", t, this.elements);
  }
  addPlugins(...t) {
    this._each("register", t, this.plugins);
  }
  addScales(...t) {
    this._each("register", t, this.scales);
  }
  getController(t) {
    return this._get(t, this.controllers, "controller");
  }
  getElement(t) {
    return this._get(t, this.elements, "element");
  }
  getPlugin(t) {
    return this._get(t, this.plugins, "plugin");
  }
  getScale(t) {
    return this._get(t, this.scales, "scale");
  }
  removeControllers(...t) {
    this._each("unregister", t, this.controllers);
  }
  removeElements(...t) {
    this._each("unregister", t, this.elements);
  }
  removePlugins(...t) {
    this._each("unregister", t, this.plugins);
  }
  removeScales(...t) {
    this._each("unregister", t, this.scales);
  }
  _each(t, e, i) {
    [
      ...e
    ].forEach((n) => {
      const o = i || this._getRegistryForType(n);
      i || o.isForType(n) || o === this.plugins && n.id ? this._exec(t, o, n) : Z(n, (r) => {
        const a = i || this._getRegistryForType(r);
        this._exec(t, a, r);
      });
    });
  }
  _exec(t, e, i) {
    const n = pn(t);
    et(i["before" + n], [], i), e[t](i), et(i["after" + n], [], i);
  }
  _getRegistryForType(t) {
    for (let e = 0; e < this._typedRegistries.length; e++) {
      const i = this._typedRegistries[e];
      if (i.isForType(t))
        return i;
    }
    return this.plugins;
  }
  _get(t, e, i) {
    const n = e.get(t);
    if (n === void 0)
      throw new Error('"' + t + '" is not a registered ' + i + ".");
    return n;
  }
}
var Yt = /* @__PURE__ */ new pu();
class mu {
  constructor() {
    this._init = [];
  }
  notify(t, e, i, n) {
    e === "beforeInit" && (this._init = this._createDescriptors(t, !0), this._notify(this._init, t, "install"));
    const o = n ? this._descriptors(t).filter(n) : this._descriptors(t), r = this._notify(o, t, e, i);
    return e === "afterDestroy" && (this._notify(o, t, "stop"), this._notify(this._init, t, "uninstall")), r;
  }
  _notify(t, e, i, n) {
    n = n || {};
    for (const o of t) {
      const r = o.plugin, a = r[i], l = [
        e,
        n,
        o.options
      ];
      if (et(a, l, r) === !1 && n.cancelable)
        return !1;
    }
    return !0;
  }
  invalidate() {
    j(this._cache) || (this._oldCache = this._cache, this._cache = void 0);
  }
  _descriptors(t) {
    if (this._cache)
      return this._cache;
    const e = this._cache = this._createDescriptors(t);
    return this._notifyStateChanges(t), e;
  }
  _createDescriptors(t, e) {
    const i = t && t.config, n = W(i.options && i.options.plugins, {}), o = bu(i);
    return n === !1 && !e ? [] : yu(t, o, n, e);
  }
  _notifyStateChanges(t) {
    const e = this._oldCache || [], i = this._cache, n = (o, r) => o.filter((a) => !r.some((l) => a.plugin.id === l.plugin.id));
    this._notify(n(e, i), t, "stop"), this._notify(n(i, e), t, "start");
  }
}
function bu(s) {
  const t = {}, e = [], i = Object.keys(Yt.plugins.items);
  for (let o = 0; o < i.length; o++)
    e.push(Yt.getPlugin(i[o]));
  const n = s.plugins || [];
  for (let o = 0; o < n.length; o++) {
    const r = n[o];
    e.indexOf(r) === -1 && (e.push(r), t[r.id] = !0);
  }
  return {
    plugins: e,
    localIds: t
  };
}
function _u(s, t) {
  return !t && s === !1 ? null : s === !0 ? {} : s;
}
function yu(s, { plugins: t, localIds: e }, i, n) {
  const o = [], r = s.getContext();
  for (const a of t) {
    const l = a.id, c = _u(i[l], n);
    c !== null && o.push({
      plugin: a,
      options: xu(s.config, {
        plugin: a,
        local: e[l]
      }, c, r)
    });
  }
  return o;
}
function xu(s, { plugin: t, local: e }, i, n) {
  const o = s.pluginScopeKeys(t), r = s.getOptionScopes(i, o);
  return e && t.defaults && r.push(t.defaults), s.createResolver(r, n, [
    ""
  ], {
    scriptable: !1,
    indexable: !1,
    allKeys: !0
  });
}
function Xs(s, t) {
  const e = nt.datasets[s] || {};
  return ((t.datasets || {})[s] || {}).indexAxis || t.indexAxis || e.indexAxis || "x";
}
function vu(s, t) {
  let e = s;
  return s === "_index_" ? e = t : s === "_value_" && (e = t === "x" ? "y" : "x"), e;
}
function wu(s, t) {
  return s === t ? "_index_" : "_value_";
}
function Co(s) {
  if (s === "x" || s === "y" || s === "r")
    return s;
}
function Su(s) {
  if (s === "top" || s === "bottom")
    return "x";
  if (s === "left" || s === "right")
    return "y";
}
function Gs(s, ...t) {
  if (Co(s))
    return s;
  for (const e of t) {
    const i = e.axis || Su(e.position) || s.length > 1 && Co(s[0].toLowerCase());
    if (i)
      return i;
  }
  throw new Error(`Cannot determine type of '${s}' axis. Please provide 'axis' or 'position' option.`);
}
function To(s, t, e) {
  if (e[t + "AxisID"] === s)
    return {
      axis: t
    };
}
function Mu(s, t) {
  if (t.data && t.data.datasets) {
    const e = t.data.datasets.filter((i) => i.xAxisID === s || i.yAxisID === s);
    if (e.length)
      return To(s, "x", e[0]) || To(s, "y", e[0]);
  }
  return {};
}
function ku(s, t) {
  const e = Ee[s.type] || {
    scales: {}
  }, i = t.scales || {}, n = Xs(s.type, t), o = /* @__PURE__ */ Object.create(null);
  return Object.keys(i).forEach((r) => {
    const a = i[r];
    if (!U(a))
      return console.error(`Invalid scale configuration for scale: ${r}`);
    if (a._proxy)
      return console.warn(`Ignoring resolver passed as options for scale: ${r}`);
    const l = Gs(r, a, Mu(r, s), nt.scales[a.type]), c = wu(l, n), h = e.scales || {};
    o[r] = ri(/* @__PURE__ */ Object.create(null), [
      {
        axis: l
      },
      a,
      h[l],
      h[c]
    ]);
  }), s.data.datasets.forEach((r) => {
    const a = r.type || s.type, l = r.indexAxis || Xs(a, t), h = (Ee[a] || {}).scales || {};
    Object.keys(h).forEach((u) => {
      const d = vu(u, l), f = r[d + "AxisID"] || d;
      o[f] = o[f] || /* @__PURE__ */ Object.create(null), ri(o[f], [
        {
          axis: d
        },
        i[f],
        h[u]
      ]);
    });
  }), Object.keys(o).forEach((r) => {
    const a = o[r];
    ri(a, [
      nt.scales[a.type],
      nt.scale
    ]);
  }), o;
}
function aa(s) {
  const t = s.options || (s.options = {});
  t.plugins = W(t.plugins, {}), t.scales = ku(s, t);
}
function la(s) {
  return s = s || {}, s.datasets = s.datasets || [], s.labels = s.labels || [], s;
}
function Pu(s) {
  return s = s || {}, s.data = la(s.data), aa(s), s;
}
const Eo = /* @__PURE__ */ new Map(), ca = /* @__PURE__ */ new Set();
function Ii(s, t) {
  let e = Eo.get(s);
  return e || (e = t(), Eo.set(s, e), ca.add(e)), e;
}
const Xe = (s, t, e) => {
  const i = pe(t, e);
  i !== void 0 && s.add(i);
};
class Au {
  constructor(t) {
    this._config = Pu(t), this._scopeCache = /* @__PURE__ */ new Map(), this._resolverCache = /* @__PURE__ */ new Map();
  }
  get platform() {
    return this._config.platform;
  }
  get type() {
    return this._config.type;
  }
  set type(t) {
    this._config.type = t;
  }
  get data() {
    return this._config.data;
  }
  set data(t) {
    this._config.data = la(t);
  }
  get options() {
    return this._config.options;
  }
  set options(t) {
    this._config.options = t;
  }
  get plugins() {
    return this._config.plugins;
  }
  update() {
    const t = this._config;
    this.clearCache(), aa(t);
  }
  clearCache() {
    this._scopeCache.clear(), this._resolverCache.clear();
  }
  datasetScopeKeys(t) {
    return Ii(t, () => [
      [
        `datasets.${t}`,
        ""
      ]
    ]);
  }
  datasetAnimationScopeKeys(t, e) {
    return Ii(`${t}.transition.${e}`, () => [
      [
        `datasets.${t}.transitions.${e}`,
        `transitions.${e}`
      ],
      [
        `datasets.${t}`,
        ""
      ]
    ]);
  }
  datasetElementScopeKeys(t, e) {
    return Ii(`${t}-${e}`, () => [
      [
        `datasets.${t}.elements.${e}`,
        `datasets.${t}`,
        `elements.${e}`,
        ""
      ]
    ]);
  }
  pluginScopeKeys(t) {
    const e = t.id, i = this.type;
    return Ii(`${i}-plugin-${e}`, () => [
      [
        `plugins.${e}`,
        ...t.additionalOptionScopes || []
      ]
    ]);
  }
  _cachedScopes(t, e) {
    const i = this._scopeCache;
    let n = i.get(t);
    return (!n || e) && (n = /* @__PURE__ */ new Map(), i.set(t, n)), n;
  }
  getOptionScopes(t, e, i) {
    const { options: n, type: o } = this, r = this._cachedScopes(t, i), a = r.get(e);
    if (a)
      return a;
    const l = /* @__PURE__ */ new Set();
    e.forEach((h) => {
      t && (l.add(t), h.forEach((u) => Xe(l, t, u))), h.forEach((u) => Xe(l, n, u)), h.forEach((u) => Xe(l, Ee[o] || {}, u)), h.forEach((u) => Xe(l, nt, u)), h.forEach((u) => Xe(l, Us, u));
    });
    const c = Array.from(l);
    return c.length === 0 && c.push(/* @__PURE__ */ Object.create(null)), ca.has(e) && r.set(e, c), c;
  }
  chartOptionScopes() {
    const { options: t, type: e } = this;
    return [
      t,
      Ee[e] || {},
      nt.datasets[e] || {},
      {
        type: e
      },
      nt,
      Us
    ];
  }
  resolveNamedOptions(t, e, i, n = [
    ""
  ]) {
    const o = {
      $shared: !0
    }, { resolver: r, subPrefixes: a } = Oo(this._resolverCache, t, n);
    let l = r;
    if (Tu(r, e)) {
      o.$shared = !1, i = me(i) ? i() : i;
      const c = this.createResolver(t, i, a);
      l = $e(r, i, c);
    }
    for (const c of e)
      o[c] = l[c];
    return o;
  }
  createResolver(t, e, i = [
    ""
  ], n) {
    const { resolver: o } = Oo(this._resolverCache, t, i);
    return U(e) ? $e(o, e, void 0, n) : o;
  }
}
function Oo(s, t, e) {
  let i = s.get(t);
  i || (i = /* @__PURE__ */ new Map(), s.set(t, i));
  const n = e.join();
  let o = i.get(n);
  return o || (o = {
    resolver: vn(t, e),
    subPrefixes: e.filter((a) => !a.toLowerCase().includes("hover"))
  }, i.set(n, o)), o;
}
const Cu = (s) => U(s) && Object.getOwnPropertyNames(s).some((t) => me(s[t]));
function Tu(s, t) {
  const { isScriptable: e, isIndexable: i } = $r(s);
  for (const n of t) {
    const o = e(n), r = i(n), a = (r || o) && s[n];
    if (o && (me(a) || Cu(a)) || r && st(a))
      return !0;
  }
  return !1;
}
var Eu = "4.5.0";
const Ou = [
  "top",
  "bottom",
  "left",
  "right",
  "chartArea"
];
function Do(s, t) {
  return s === "top" || s === "bottom" || Ou.indexOf(s) === -1 && t === "x";
}
function Lo(s, t) {
  return function(e, i) {
    return e[s] === i[s] ? e[t] - i[t] : e[s] - i[s];
  };
}
function Ro(s) {
  const t = s.chart, e = t.options.animation;
  t.notifyPlugins("afterRender"), et(e && e.onComplete, [
    s
  ], t);
}
function Du(s) {
  const t = s.chart, e = t.options.animation;
  et(e && e.onProgress, [
    s
  ], t);
}
function ha(s) {
  return Mn() && typeof s == "string" ? s = document.getElementById(s) : s && s.length && (s = s[0]), s && s.canvas && (s = s.canvas), s;
}
const Ki = {}, Io = (s) => {
  const t = ha(s);
  return Object.values(Ki).filter((e) => e.canvas === t).pop();
};
function Lu(s, t, e) {
  const i = Object.keys(s);
  for (const n of i) {
    const o = +n;
    if (o >= t) {
      const r = s[n];
      delete s[n], (e > 0 || o > t) && (s[o + e] = r);
    }
  }
}
function Ru(s, t, e, i) {
  return !e || s.type === "mouseout" ? null : i ? t : s;
}
class ee {
  static register(...t) {
    Yt.add(...t), Fo();
  }
  static unregister(...t) {
    Yt.remove(...t), Fo();
  }
  constructor(t, e) {
    const i = this.config = new Au(e), n = ha(t), o = Io(n);
    if (o)
      throw new Error("Canvas is already in use. Chart with ID '" + o.id + "' must be destroyed before the canvas with ID '" + o.canvas.id + "' can be reused.");
    const r = i.createResolver(i.chartOptionScopes(), this.getContext());
    this.platform = new (i.platform || Jh(n))(), this.platform.updateConfig(i);
    const a = this.platform.acquireContext(n, r.aspectRatio), l = a && a.canvas, c = l && l.height, h = l && l.width;
    if (this.id = Il(), this.ctx = a, this.canvas = l, this.width = h, this.height = c, this._options = r, this._aspectRatio = this.aspectRatio, this._layers = [], this._metasets = [], this._stacks = void 0, this.boxes = [], this.currentDevicePixelRatio = void 0, this.chartArea = void 0, this._active = [], this._lastEvent = void 0, this._listeners = {}, this._responsiveListeners = void 0, this._sortedMetasets = [], this.scales = {}, this._plugins = new mu(), this.$proxies = {}, this._hiddenIndices = {}, this.attached = !1, this._animationsDisabled = void 0, this.$context = void 0, this._doResize = Jl((u) => this.update(u), r.resizeDelay || 0), this._dataChanges = [], Ki[this.id] = this, !a || !l) {
      console.error("Failed to create chart: can't acquire context from the given item");
      return;
    }
    Jt.listen(this, "complete", Ro), Jt.listen(this, "progress", Du), this._initialize(), this.attached && this.update();
  }
  get aspectRatio() {
    const { options: { aspectRatio: t, maintainAspectRatio: e }, width: i, height: n, _aspectRatio: o } = this;
    return j(t) ? e && o ? o : n ? i / n : null : t;
  }
  get data() {
    return this.config.data;
  }
  set data(t) {
    this.config.data = t;
  }
  get options() {
    return this._options;
  }
  set options(t) {
    this.config.options = t;
  }
  get registry() {
    return Yt;
  }
  _initialize() {
    return this.notifyPlugins("beforeInit"), this.options.responsive ? this.resize() : so(this, this.options.devicePixelRatio), this.bindEvents(), this.notifyPlugins("afterInit"), this;
  }
  clear() {
    return to(this.canvas, this.ctx), this;
  }
  stop() {
    return Jt.stop(this), this;
  }
  resize(t, e) {
    Jt.running(this) ? this._resizeBeforeDraw = {
      width: t,
      height: e
    } : this._resize(t, e);
  }
  _resize(t, e) {
    const i = this.options, n = this.canvas, o = i.maintainAspectRatio && this.aspectRatio, r = this.platform.getMaximumSize(n, t, e, o), a = i.devicePixelRatio || this.platform.getDevicePixelRatio(), l = this.width ? "resize" : "attach";
    this.width = r.width, this.height = r.height, this._aspectRatio = this.aspectRatio, so(this, a, !0) && (this.notifyPlugins("resize", {
      size: r
    }), et(i.onResize, [
      this,
      r
    ], this), this.attached && this._doResize(l) && this.render());
  }
  ensureScalesHaveIDs() {
    const e = this.options.scales || {};
    Z(e, (i, n) => {
      i.id = n;
    });
  }
  buildOrUpdateScales() {
    const t = this.options, e = t.scales, i = this.scales, n = Object.keys(i).reduce((r, a) => (r[a] = !1, r), {});
    let o = [];
    e && (o = o.concat(Object.keys(e).map((r) => {
      const a = e[r], l = Gs(r, a), c = l === "r", h = l === "x";
      return {
        options: a,
        dposition: c ? "chartArea" : h ? "bottom" : "left",
        dtype: c ? "radialLinear" : h ? "category" : "linear"
      };
    }))), Z(o, (r) => {
      const a = r.options, l = a.id, c = Gs(l, a), h = W(a.type, r.dtype);
      (a.position === void 0 || Do(a.position, c) !== Do(r.dposition)) && (a.position = r.dposition), n[l] = !0;
      let u = null;
      if (l in i && i[l].type === h)
        u = i[l];
      else {
        const d = Yt.getScale(h);
        u = new d({
          id: l,
          type: h,
          ctx: this.ctx,
          chart: this
        }), i[u.id] = u;
      }
      u.init(a, t);
    }), Z(n, (r, a) => {
      r || delete i[a];
    }), Z(i, (r) => {
      St.configure(this, r, r.options), St.addBox(this, r);
    });
  }
  _updateMetasets() {
    const t = this._metasets, e = this.data.datasets.length, i = t.length;
    if (t.sort((n, o) => n.index - o.index), i > e) {
      for (let n = e; n < i; ++n)
        this._destroyDatasetMeta(n);
      t.splice(e, i - e);
    }
    this._sortedMetasets = t.slice(0).sort(Lo("order", "index"));
  }
  _removeUnreferencedMetasets() {
    const { _metasets: t, data: { datasets: e } } = this;
    t.length > e.length && delete this._stacks, t.forEach((i, n) => {
      e.filter((o) => o === i._dataset).length === 0 && this._destroyDatasetMeta(n);
    });
  }
  buildOrUpdateControllers() {
    const t = [], e = this.data.datasets;
    let i, n;
    for (this._removeUnreferencedMetasets(), i = 0, n = e.length; i < n; i++) {
      const o = e[i];
      let r = this.getDatasetMeta(i);
      const a = o.type || this.config.type;
      if (r.type && r.type !== a && (this._destroyDatasetMeta(i), r = this.getDatasetMeta(i)), r.type = a, r.indexAxis = o.indexAxis || Xs(a, this.options), r.order = o.order || 0, r.index = i, r.label = "" + o.label, r.visible = this.isDatasetVisible(i), r.controller)
        r.controller.updateIndex(i), r.controller.linkScales();
      else {
        const l = Yt.getController(a), { datasetElementType: c, dataElementType: h } = nt.datasets[a];
        Object.assign(l, {
          dataElementType: Yt.getElement(h),
          datasetElementType: c && Yt.getElement(c)
        }), r.controller = new l(this, i), t.push(r.controller);
      }
    }
    return this._updateMetasets(), t;
  }
  _resetElements() {
    Z(this.data.datasets, (t, e) => {
      this.getDatasetMeta(e).controller.reset();
    }, this);
  }
  reset() {
    this._resetElements(), this.notifyPlugins("reset");
  }
  update(t) {
    const e = this.config;
    e.update();
    const i = this._options = e.createResolver(e.chartOptionScopes(), this.getContext()), n = this._animationsDisabled = !i.animation;
    if (this._updateScales(), this._checkEventBindings(), this._updateHiddenIndices(), this._plugins.invalidate(), this.notifyPlugins("beforeUpdate", {
      mode: t,
      cancelable: !0
    }) === !1)
      return;
    const o = this.buildOrUpdateControllers();
    this.notifyPlugins("beforeElementsUpdate");
    let r = 0;
    for (let c = 0, h = this.data.datasets.length; c < h; c++) {
      const { controller: u } = this.getDatasetMeta(c), d = !n && o.indexOf(u) === -1;
      u.buildOrUpdateElements(d), r = Math.max(+u.getMaxOverflow(), r);
    }
    r = this._minPadding = i.layout.autoPadding ? r : 0, this._updateLayout(r), n || Z(o, (c) => {
      c.reset();
    }), this._updateDatasets(t), this.notifyPlugins("afterUpdate", {
      mode: t
    }), this._layers.sort(Lo("z", "_idx"));
    const { _active: a, _lastEvent: l } = this;
    l ? this._eventHandler(l, !0) : a.length && this._updateHoverStyles(a, a, !0), this.render();
  }
  _updateScales() {
    Z(this.scales, (t) => {
      St.removeBox(this, t);
    }), this.ensureScalesHaveIDs(), this.buildOrUpdateScales();
  }
  _checkEventBindings() {
    const t = this.options, e = new Set(Object.keys(this._listeners)), i = new Set(t.events);
    (!jn(e, i) || !!this._responsiveListeners !== t.responsive) && (this.unbindEvents(), this.bindEvents());
  }
  _updateHiddenIndices() {
    const { _hiddenIndices: t } = this, e = this._getUniformDataChanges() || [];
    for (const { method: i, start: n, count: o } of e) {
      const r = i === "_removeElements" ? -o : o;
      Lu(t, n, r);
    }
  }
  _getUniformDataChanges() {
    const t = this._dataChanges;
    if (!t || !t.length)
      return;
    this._dataChanges = [];
    const e = this.data.datasets.length, i = (o) => new Set(t.filter((r) => r[0] === o).map((r, a) => a + "," + r.splice(1).join(","))), n = i(0);
    for (let o = 1; o < e; o++)
      if (!jn(n, i(o)))
        return;
    return Array.from(n).map((o) => o.split(",")).map((o) => ({
      method: o[1],
      start: +o[2],
      count: +o[3]
    }));
  }
  _updateLayout(t) {
    if (this.notifyPlugins("beforeLayout", {
      cancelable: !0
    }) === !1)
      return;
    St.update(this, this.width, this.height, t);
    const e = this.chartArea, i = e.width <= 0 || e.height <= 0;
    this._layers = [], Z(this.boxes, (n) => {
      i && n.position === "chartArea" || (n.configure && n.configure(), this._layers.push(...n._layers()));
    }, this), this._layers.forEach((n, o) => {
      n._idx = o;
    }), this.notifyPlugins("afterLayout");
  }
  _updateDatasets(t) {
    if (this.notifyPlugins("beforeDatasetsUpdate", {
      mode: t,
      cancelable: !0
    }) !== !1) {
      for (let e = 0, i = this.data.datasets.length; e < i; ++e)
        this.getDatasetMeta(e).controller.configure();
      for (let e = 0, i = this.data.datasets.length; e < i; ++e)
        this._updateDataset(e, me(t) ? t({
          datasetIndex: e
        }) : t);
      this.notifyPlugins("afterDatasetsUpdate", {
        mode: t
      });
    }
  }
  _updateDataset(t, e) {
    const i = this.getDatasetMeta(t), n = {
      meta: i,
      index: t,
      mode: e,
      cancelable: !0
    };
    this.notifyPlugins("beforeDatasetUpdate", n) !== !1 && (i.controller._update(e), n.cancelable = !1, this.notifyPlugins("afterDatasetUpdate", n));
  }
  render() {
    this.notifyPlugins("beforeRender", {
      cancelable: !0
    }) !== !1 && (Jt.has(this) ? this.attached && !Jt.running(this) && Jt.start(this) : (this.draw(), Ro({
      chart: this
    })));
  }
  draw() {
    let t;
    if (this._resizeBeforeDraw) {
      const { width: i, height: n } = this._resizeBeforeDraw;
      this._resizeBeforeDraw = null, this._resize(i, n);
    }
    if (this.clear(), this.width <= 0 || this.height <= 0 || this.notifyPlugins("beforeDraw", {
      cancelable: !0
    }) === !1)
      return;
    const e = this._layers;
    for (t = 0; t < e.length && e[t].z <= 0; ++t)
      e[t].draw(this.chartArea);
    for (this._drawDatasets(); t < e.length; ++t)
      e[t].draw(this.chartArea);
    this.notifyPlugins("afterDraw");
  }
  _getSortedDatasetMetas(t) {
    const e = this._sortedMetasets, i = [];
    let n, o;
    for (n = 0, o = e.length; n < o; ++n) {
      const r = e[n];
      (!t || r.visible) && i.push(r);
    }
    return i;
  }
  getSortedVisibleDatasetMetas() {
    return this._getSortedDatasetMetas(!0);
  }
  _drawDatasets() {
    if (this.notifyPlugins("beforeDatasetsDraw", {
      cancelable: !0
    }) === !1)
      return;
    const t = this.getSortedVisibleDatasetMetas();
    for (let e = t.length - 1; e >= 0; --e)
      this._drawDataset(t[e]);
    this.notifyPlugins("afterDatasetsDraw");
  }
  _drawDataset(t) {
    const e = this.ctx, i = {
      meta: t,
      index: t.index,
      cancelable: !0
    }, n = Jr(this, t);
    this.notifyPlugins("beforeDatasetDraw", i) !== !1 && (n && cs(e, n), t.controller.draw(), n && hs(e), i.cancelable = !1, this.notifyPlugins("afterDatasetDraw", i));
  }
  isPointInArea(t) {
    return ne(t, this.chartArea, this._minPadding);
  }
  getElementsAtEventForMode(t, e, i, n) {
    const o = Oh.modes[e];
    return typeof o == "function" ? o(this, t, i, n) : [];
  }
  getDatasetMeta(t) {
    const e = this.data.datasets[t], i = this._metasets;
    let n = i.filter((o) => o && o._dataset === e).pop();
    return n || (n = {
      type: null,
      data: [],
      dataset: null,
      controller: null,
      hidden: null,
      xAxisID: null,
      yAxisID: null,
      order: e && e.order || 0,
      index: t,
      _dataset: e,
      _parsed: [],
      _sorted: !1
    }, i.push(n)), n;
  }
  getContext() {
    return this.$context || (this.$context = be(null, {
      chart: this,
      type: "chart"
    }));
  }
  getVisibleDatasetCount() {
    return this.getSortedVisibleDatasetMetas().length;
  }
  isDatasetVisible(t) {
    const e = this.data.datasets[t];
    if (!e)
      return !1;
    const i = this.getDatasetMeta(t);
    return typeof i.hidden == "boolean" ? !i.hidden : !e.hidden;
  }
  setDatasetVisibility(t, e) {
    const i = this.getDatasetMeta(t);
    i.hidden = !e;
  }
  toggleDataVisibility(t) {
    this._hiddenIndices[t] = !this._hiddenIndices[t];
  }
  getDataVisibility(t) {
    return !this._hiddenIndices[t];
  }
  _updateVisibility(t, e, i) {
    const n = i ? "show" : "hide", o = this.getDatasetMeta(t), r = o.controller._resolveAnimations(void 0, n);
    gi(e) ? (o.data[e].hidden = !i, this.update()) : (this.setDatasetVisibility(t, i), r.update(o, {
      visible: i
    }), this.update((a) => a.datasetIndex === t ? n : void 0));
  }
  hide(t, e) {
    this._updateVisibility(t, e, !1);
  }
  show(t, e) {
    this._updateVisibility(t, e, !0);
  }
  _destroyDatasetMeta(t) {
    const e = this._metasets[t];
    e && e.controller && e.controller._destroy(), delete this._metasets[t];
  }
  _stop() {
    let t, e;
    for (this.stop(), Jt.remove(this), t = 0, e = this.data.datasets.length; t < e; ++t)
      this._destroyDatasetMeta(t);
  }
  destroy() {
    this.notifyPlugins("beforeDestroy");
    const { canvas: t, ctx: e } = this;
    this._stop(), this.config.clearCache(), t && (this.unbindEvents(), to(t, e), this.platform.releaseContext(e), this.canvas = null, this.ctx = null), delete Ki[this.id], this.notifyPlugins("afterDestroy");
  }
  toBase64Image(...t) {
    return this.canvas.toDataURL(...t);
  }
  bindEvents() {
    this.bindUserEvents(), this.options.responsive ? this.bindResponsiveEvents() : this.attached = !0;
  }
  bindUserEvents() {
    const t = this._listeners, e = this.platform, i = (o, r) => {
      e.addEventListener(this, o, r), t[o] = r;
    }, n = (o, r, a) => {
      o.offsetX = r, o.offsetY = a, this._eventHandler(o);
    };
    Z(this.options.events, (o) => i(o, n));
  }
  bindResponsiveEvents() {
    this._responsiveListeners || (this._responsiveListeners = {});
    const t = this._responsiveListeners, e = this.platform, i = (l, c) => {
      e.addEventListener(this, l, c), t[l] = c;
    }, n = (l, c) => {
      t[l] && (e.removeEventListener(this, l, c), delete t[l]);
    }, o = (l, c) => {
      this.canvas && this.resize(l, c);
    };
    let r;
    const a = () => {
      n("attach", a), this.attached = !0, this.resize(), i("resize", o), i("detach", r);
    };
    r = () => {
      this.attached = !1, n("resize", o), this._stop(), this._resize(0, 0), i("attach", a);
    }, e.isAttached(this.canvas) ? a() : r();
  }
  unbindEvents() {
    Z(this._listeners, (t, e) => {
      this.platform.removeEventListener(this, e, t);
    }), this._listeners = {}, Z(this._responsiveListeners, (t, e) => {
      this.platform.removeEventListener(this, e, t);
    }), this._responsiveListeners = void 0;
  }
  updateHoverStyle(t, e, i) {
    const n = i ? "set" : "remove";
    let o, r, a, l;
    for (e === "dataset" && (o = this.getDatasetMeta(t[0].datasetIndex), o.controller["_" + n + "DatasetHoverStyle"]()), a = 0, l = t.length; a < l; ++a) {
      r = t[a];
      const c = r && this.getDatasetMeta(r.datasetIndex).controller;
      c && c[n + "HoverStyle"](r.element, r.datasetIndex, r.index);
    }
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(t) {
    const e = this._active || [], i = t.map(({ datasetIndex: o, index: r }) => {
      const a = this.getDatasetMeta(o);
      if (!a)
        throw new Error("No dataset found at index " + o);
      return {
        datasetIndex: o,
        element: a.data[r],
        index: r
      };
    });
    !Zi(i, e) && (this._active = i, this._lastEvent = null, this._updateHoverStyles(i, e));
  }
  notifyPlugins(t, e, i) {
    return this._plugins.notify(this, t, e, i);
  }
  isPluginEnabled(t) {
    return this._plugins._cache.filter((e) => e.plugin.id === t).length === 1;
  }
  _updateHoverStyles(t, e, i) {
    const n = this.options.hover, o = (l, c) => l.filter((h) => !c.some((u) => h.datasetIndex === u.datasetIndex && h.index === u.index)), r = o(e, t), a = i ? t : o(t, e);
    r.length && this.updateHoverStyle(r, n.mode, !1), a.length && n.mode && this.updateHoverStyle(a, n.mode, !0);
  }
  _eventHandler(t, e) {
    const i = {
      event: t,
      replay: e,
      cancelable: !0,
      inChartArea: this.isPointInArea(t)
    }, n = (r) => (r.options.events || this.options.events).includes(t.native.type);
    if (this.notifyPlugins("beforeEvent", i, n) === !1)
      return;
    const o = this._handleEvent(t, e, i.inChartArea);
    return i.cancelable = !1, this.notifyPlugins("afterEvent", i, n), (o || i.changed) && this.render(), this;
  }
  _handleEvent(t, e, i) {
    const { _active: n = [], options: o } = this, r = e, a = this._getActiveElements(t, n, i, r), l = $l(t), c = Ru(t, this._lastEvent, i, l);
    i && (this._lastEvent = null, et(o.onHover, [
      t,
      a,
      this
    ], this), l && et(o.onClick, [
      t,
      a,
      this
    ], this));
    const h = !Zi(a, n);
    return (h || e) && (this._active = a, this._updateHoverStyles(a, n, e)), this._lastEvent = c, h;
  }
  _getActiveElements(t, e, i, n) {
    if (t.type === "mouseout")
      return [];
    if (!i)
      return e;
    const o = this.options.hover;
    return this.getElementsAtEventForMode(t, o.mode, o, n);
  }
}
P(ee, "defaults", nt), P(ee, "instances", Ki), P(ee, "overrides", Ee), P(ee, "registry", Yt), P(ee, "version", Eu), P(ee, "getChart", Io);
function Fo() {
  return Z(ee.instances, (s) => s._plugins.invalidate());
}
function Iu(s, t, e) {
  const { startAngle: i, x: n, y: o, outerRadius: r, innerRadius: a, options: l } = t, { borderWidth: c, borderJoinStyle: h } = l, u = Math.min(c / r, wt(i - e));
  if (s.beginPath(), s.arc(n, o, r - c / 2, i + u / 2, e - u / 2), a > 0) {
    const d = Math.min(c / a, wt(i - e));
    s.arc(n, o, a + c / 2, e - d / 2, i + d / 2, !0);
  } else {
    const d = Math.min(c / 2, r * wt(i - e));
    if (h === "round")
      s.arc(n, o, d, e - K / 2, i + K / 2, !0);
    else if (h === "bevel") {
      const f = 2 * d * d, g = -f * Math.cos(e + K / 2) + n, p = -f * Math.sin(e + K / 2) + o, m = f * Math.cos(i + K / 2) + n, b = f * Math.sin(i + K / 2) + o;
      s.lineTo(g, p), s.lineTo(m, b);
    }
  }
  s.closePath(), s.moveTo(0, 0), s.rect(0, 0, s.canvas.width, s.canvas.height), s.clip("evenodd");
}
function Fu(s, t, e) {
  const { startAngle: i, pixelMargin: n, x: o, y: r, outerRadius: a, innerRadius: l } = t;
  let c = n / a;
  s.beginPath(), s.arc(o, r, a, i - c, e + c), l > n ? (c = n / l, s.arc(o, r, l, e + c, i - c, !0)) : s.arc(o, r, n, e + lt, i - lt), s.closePath(), s.clip();
}
function Nu(s) {
  return xn(s, [
    "outerStart",
    "outerEnd",
    "innerStart",
    "innerEnd"
  ]);
}
function zu(s, t, e, i) {
  const n = Nu(s.options.borderRadius), o = (e - t) / 2, r = Math.min(o, i * t / 2), a = (l) => {
    const c = (e - Math.min(o, l)) * i / 2;
    return bt(l, 0, Math.min(o, c));
  };
  return {
    outerStart: a(n.outerStart),
    outerEnd: a(n.outerEnd),
    innerStart: bt(n.innerStart, 0, r),
    innerEnd: bt(n.innerEnd, 0, r)
  };
}
function Ie(s, t, e, i) {
  return {
    x: e + s * Math.cos(t),
    y: i + s * Math.sin(t)
  };
}
function os(s, t, e, i, n, o) {
  const { x: r, y: a, startAngle: l, pixelMargin: c, innerRadius: h } = t, u = Math.max(t.outerRadius + i + e - c, 0), d = h > 0 ? h + i + e + c : 0;
  let f = 0;
  const g = n - l;
  if (i) {
    const Y = h > 0 ? h - i : 0, X = u > 0 ? u - i : 0, tt = (Y + X) / 2, _t = tt !== 0 ? g * tt / (tt + i) : g;
    f = (g - _t) / 2;
  }
  const p = Math.max(1e-3, g * u - e / K) / u, m = (g - p) / 2, b = l + m + f, _ = n - m - f, { outerStart: k, outerEnd: M, innerStart: S, innerEnd: O } = zu(t, d, u, _ - b), C = u - k, A = u - M, L = b + k / C, H = _ - M / A, q = d + S, V = d + O, ot = b + S / q, ct = _ - O / V;
  if (s.beginPath(), o) {
    const Y = (L + H) / 2;
    if (s.arc(r, a, u, L, Y), s.arc(r, a, u, Y, H), M > 0) {
      const G = Ie(A, H, r, a);
      s.arc(G.x, G.y, M, H, _ + lt);
    }
    const X = Ie(V, _, r, a);
    if (s.lineTo(X.x, X.y), O > 0) {
      const G = Ie(V, ct, r, a);
      s.arc(G.x, G.y, O, _ + lt, ct + Math.PI);
    }
    const tt = (_ - O / d + (b + S / d)) / 2;
    if (s.arc(r, a, d, _ - O / d, tt, !0), s.arc(r, a, d, tt, b + S / d, !0), S > 0) {
      const G = Ie(q, ot, r, a);
      s.arc(G.x, G.y, S, ot + Math.PI, b - lt);
    }
    const _t = Ie(C, b, r, a);
    if (s.lineTo(_t.x, _t.y), k > 0) {
      const G = Ie(C, L, r, a);
      s.arc(G.x, G.y, k, b - lt, L);
    }
  } else {
    s.moveTo(r, a);
    const Y = Math.cos(L) * u + r, X = Math.sin(L) * u + a;
    s.lineTo(Y, X);
    const tt = Math.cos(H) * u + r, _t = Math.sin(H) * u + a;
    s.lineTo(tt, _t);
  }
  s.closePath();
}
function Bu(s, t, e, i, n) {
  const { fullCircles: o, startAngle: r, circumference: a } = t;
  let l = t.endAngle;
  if (o) {
    os(s, t, e, i, l, n);
    for (let c = 0; c < o; ++c)
      s.fill();
    isNaN(a) || (l = r + (a % it || it));
  }
  return os(s, t, e, i, l, n), s.fill(), l;
}
function Hu(s, t, e, i, n) {
  const { fullCircles: o, startAngle: r, circumference: a, options: l } = t, { borderWidth: c, borderJoinStyle: h, borderDash: u, borderDashOffset: d, borderRadius: f } = l, g = l.borderAlign === "inner";
  if (!c)
    return;
  s.setLineDash(u || []), s.lineDashOffset = d, g ? (s.lineWidth = c * 2, s.lineJoin = h || "round") : (s.lineWidth = c, s.lineJoin = h || "bevel");
  let p = t.endAngle;
  if (o) {
    os(s, t, e, i, p, n);
    for (let m = 0; m < o; ++m)
      s.stroke();
    isNaN(a) || (p = r + (a % it || it));
  }
  g && Fu(s, t, p), l.selfJoin && p - r >= K && f === 0 && h !== "miter" && Iu(s, t, p), o || (os(s, t, e, i, p, n), s.stroke());
}
class ii extends oe {
  constructor(e) {
    super();
    P(this, "circumference");
    P(this, "endAngle");
    P(this, "fullCircles");
    P(this, "innerRadius");
    P(this, "outerRadius");
    P(this, "pixelMargin");
    P(this, "startAngle");
    this.options = void 0, this.circumference = void 0, this.startAngle = void 0, this.endAngle = void 0, this.innerRadius = void 0, this.outerRadius = void 0, this.pixelMargin = 0, this.fullCircles = 0, e && Object.assign(this, e);
  }
  inRange(e, i, n) {
    const o = this.getProps([
      "x",
      "y"
    ], n), { angle: r, distance: a } = Or(o, {
      x: e,
      y: i
    }), { startAngle: l, endAngle: c, innerRadius: h, outerRadius: u, circumference: d } = this.getProps([
      "startAngle",
      "endAngle",
      "innerRadius",
      "outerRadius",
      "circumference"
    ], n), f = (this.options.spacing + this.options.borderWidth) / 2, g = W(d, c - l), p = pi(r, l, c) && l !== c, m = g >= it || p, b = ie(a, h + f, u + f);
    return m && b;
  }
  getCenterPoint(e) {
    const { x: i, y: n, startAngle: o, endAngle: r, innerRadius: a, outerRadius: l } = this.getProps([
      "x",
      "y",
      "startAngle",
      "endAngle",
      "innerRadius",
      "outerRadius"
    ], e), { offset: c, spacing: h } = this.options, u = (o + r) / 2, d = (a + l + h + c) / 2;
    return {
      x: i + Math.cos(u) * d,
      y: n + Math.sin(u) * d
    };
  }
  tooltipPosition(e) {
    return this.getCenterPoint(e);
  }
  draw(e) {
    const { options: i, circumference: n } = this, o = (i.offset || 0) / 4, r = (i.spacing || 0) / 2, a = i.circular;
    if (this.pixelMargin = i.borderAlign === "inner" ? 0.33 : 0, this.fullCircles = n > it ? Math.floor(n / it) : 0, n === 0 || this.innerRadius < 0 || this.outerRadius < 0)
      return;
    e.save();
    const l = (this.startAngle + this.endAngle) / 2;
    e.translate(Math.cos(l) * o, Math.sin(l) * o);
    const c = 1 - Math.sin(Math.min(K, n || 0)), h = o * c;
    e.fillStyle = i.backgroundColor, e.strokeStyle = i.borderColor, Bu(e, this, h, r, a), Hu(e, this, h, r, a), e.restore();
  }
}
P(ii, "id", "arc"), P(ii, "defaults", {
  borderAlign: "center",
  borderColor: "#fff",
  borderDash: [],
  borderDashOffset: 0,
  borderJoinStyle: void 0,
  borderRadius: 0,
  borderWidth: 2,
  offset: 0,
  spacing: 0,
  angle: void 0,
  circular: !0,
  selfJoin: !1
}), P(ii, "defaultRoutes", {
  backgroundColor: "backgroundColor"
}), P(ii, "descriptors", {
  _scriptable: !0,
  _indexable: (e) => e !== "borderDash"
});
function ua(s, t, e = t) {
  s.lineCap = W(e.borderCapStyle, t.borderCapStyle), s.setLineDash(W(e.borderDash, t.borderDash)), s.lineDashOffset = W(e.borderDashOffset, t.borderDashOffset), s.lineJoin = W(e.borderJoinStyle, t.borderJoinStyle), s.lineWidth = W(e.borderWidth, t.borderWidth), s.strokeStyle = W(e.borderColor, t.borderColor);
}
function $u(s, t, e) {
  s.lineTo(e.x, e.y);
}
function qu(s) {
  return s.stepped ? hc : s.tension || s.cubicInterpolationMode === "monotone" ? uc : $u;
}
function da(s, t, e = {}) {
  const i = s.length, { start: n = 0, end: o = i - 1 } = e, { start: r, end: a } = t, l = Math.max(n, r), c = Math.min(o, a), h = n < r && o < r || n > a && o > a;
  return {
    count: i,
    start: l,
    loop: t.loop,
    ilen: c < l && !h ? i + c - l : c - l
  };
}
function Wu(s, t, e, i) {
  const { points: n, options: o } = t, { count: r, start: a, loop: l, ilen: c } = da(n, e, i), h = qu(o);
  let { move: u = !0, reverse: d } = i || {}, f, g, p;
  for (f = 0; f <= c; ++f)
    g = n[(a + (d ? c - f : f)) % r], !g.skip && (u ? (s.moveTo(g.x, g.y), u = !1) : h(s, p, g, d, o.stepped), p = g);
  return l && (g = n[(a + (d ? c : 0)) % r], h(s, p, g, d, o.stepped)), !!l;
}
function Vu(s, t, e, i) {
  const n = t.points, { count: o, start: r, ilen: a } = da(n, e, i), { move: l = !0, reverse: c } = i || {};
  let h = 0, u = 0, d, f, g, p, m, b;
  const _ = (M) => (r + (c ? a - M : M)) % o, k = () => {
    p !== m && (s.lineTo(h, m), s.lineTo(h, p), s.lineTo(h, b));
  };
  for (l && (f = n[_(0)], s.moveTo(f.x, f.y)), d = 0; d <= a; ++d) {
    if (f = n[_(d)], f.skip)
      continue;
    const M = f.x, S = f.y, O = M | 0;
    O === g ? (S < p ? p = S : S > m && (m = S), h = (u * h + M) / ++u) : (k(), s.lineTo(M, S), g = O, u = 0, p = m = S), b = S;
  }
  k();
}
function Qs(s) {
  const t = s.options, e = t.borderDash && t.borderDash.length;
  return !s._decimated && !s._loop && !t.tension && t.cubicInterpolationMode !== "monotone" && !t.stepped && !e ? Vu : Wu;
}
function ju(s) {
  return s.stepped ? Wc : s.tension || s.cubicInterpolationMode === "monotone" ? Vc : ke;
}
function Uu(s, t, e, i) {
  let n = t._path;
  n || (n = t._path = new Path2D(), t.path(n, e, i) && n.closePath()), ua(s, t.options), s.stroke(n);
}
function Yu(s, t, e, i) {
  const { segments: n, options: o } = t, r = Qs(t);
  for (const a of n)
    ua(s, o, a.style), s.beginPath(), r(s, t, a, {
      start: e,
      end: e + i - 1
    }) && s.closePath(), s.stroke();
}
const Ku = typeof Path2D == "function";
function Xu(s, t, e, i) {
  Ku && !t.options.segment ? Uu(s, t, e, i) : Yu(s, t, e, i);
}
class de extends oe {
  constructor(t) {
    super(), this.animated = !0, this.options = void 0, this._chart = void 0, this._loop = void 0, this._fullLoop = void 0, this._path = void 0, this._points = void 0, this._segments = void 0, this._decimated = !1, this._pointsUpdated = !1, this._datasetIndex = void 0, t && Object.assign(this, t);
  }
  updateControlPoints(t, e) {
    const i = this.options;
    if ((i.tension || i.cubicInterpolationMode === "monotone") && !i.stepped && !this._pointsUpdated) {
      const n = i.spanGaps ? this._loop : this._fullLoop;
      Ic(this._points, i, t, n, e), this._pointsUpdated = !0;
    }
  }
  set points(t) {
    this._points = t, delete this._segments, delete this._path, this._pointsUpdated = !1;
  }
  get points() {
    return this._points;
  }
  get segments() {
    return this._segments || (this._segments = Gc(this, this.options.segment));
  }
  first() {
    const t = this.segments, e = this.points;
    return t.length && e[t[0].start];
  }
  last() {
    const t = this.segments, e = this.points, i = t.length;
    return i && e[t[i - 1].end];
  }
  interpolate(t, e) {
    const i = this.options, n = t[e], o = this.points, r = Qr(this, {
      property: e,
      start: n,
      end: n
    });
    if (!r.length)
      return;
    const a = [], l = ju(i);
    let c, h;
    for (c = 0, h = r.length; c < h; ++c) {
      const { start: u, end: d } = r[c], f = o[u], g = o[d];
      if (f === g) {
        a.push(f);
        continue;
      }
      const p = Math.abs((n - f[e]) / (g[e] - f[e])), m = l(f, g, p, i.stepped);
      m[e] = t[e], a.push(m);
    }
    return a.length === 1 ? a[0] : a;
  }
  pathSegment(t, e, i) {
    return Qs(this)(t, this, e, i);
  }
  path(t, e, i) {
    const n = this.segments, o = Qs(this);
    let r = this._loop;
    e = e || 0, i = i || this.points.length - e;
    for (const a of n)
      r &= o(t, this, a, {
        start: e,
        end: e + i - 1
      });
    return !!r;
  }
  draw(t, e, i, n) {
    const o = this.options || {};
    (this.points || []).length && o.borderWidth && (t.save(), Xu(t, this, i, n), t.restore()), this.animated && (this._pointsUpdated = !1, this._path = void 0);
  }
}
P(de, "id", "line"), P(de, "defaults", {
  borderCapStyle: "butt",
  borderDash: [],
  borderDashOffset: 0,
  borderJoinStyle: "miter",
  borderWidth: 3,
  capBezierPoints: !0,
  cubicInterpolationMode: "default",
  fill: !1,
  spanGaps: !1,
  stepped: !1,
  tension: 0
}), P(de, "defaultRoutes", {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor"
}), P(de, "descriptors", {
  _scriptable: !0,
  _indexable: (t) => t !== "borderDash" && t !== "fill"
});
function No(s, t, e, i) {
  const n = s.options, { [e]: o } = s.getProps([
    e
  ], i);
  return Math.abs(t - o) < n.radius + n.hitRadius;
}
class Xi extends oe {
  constructor(e) {
    super();
    P(this, "parsed");
    P(this, "skip");
    P(this, "stop");
    this.options = void 0, this.parsed = void 0, this.skip = void 0, this.stop = void 0, e && Object.assign(this, e);
  }
  inRange(e, i, n) {
    const o = this.options, { x: r, y: a } = this.getProps([
      "x",
      "y"
    ], n);
    return Math.pow(e - r, 2) + Math.pow(i - a, 2) < Math.pow(o.hitRadius + o.radius, 2);
  }
  inXRange(e, i) {
    return No(this, e, "x", i);
  }
  inYRange(e, i) {
    return No(this, e, "y", i);
  }
  getCenterPoint(e) {
    const { x: i, y: n } = this.getProps([
      "x",
      "y"
    ], e);
    return {
      x: i,
      y: n
    };
  }
  size(e) {
    e = e || this.options || {};
    let i = e.radius || 0;
    i = Math.max(i, i && e.hoverRadius || 0);
    const n = i && e.borderWidth || 0;
    return (i + n) * 2;
  }
  draw(e, i) {
    const n = this.options;
    this.skip || n.radius < 0.1 || !ne(this, i, this.size(n) / 2) || (e.strokeStyle = n.borderColor, e.lineWidth = n.borderWidth, e.fillStyle = n.backgroundColor, Ys(e, n, this.x, this.y));
  }
  getRange() {
    const e = this.options || {};
    return e.radius + e.hitRadius;
  }
}
P(Xi, "id", "point"), /**
* @type {any}
*/
P(Xi, "defaults", {
  borderWidth: 1,
  hitRadius: 1,
  hoverBorderWidth: 1,
  hoverRadius: 4,
  pointStyle: "circle",
  radius: 3,
  rotation: 0
}), /**
* @type {any}
*/
P(Xi, "defaultRoutes", {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor"
});
function fa(s, t) {
  const { x: e, y: i, base: n, width: o, height: r } = s.getProps([
    "x",
    "y",
    "base",
    "width",
    "height"
  ], t);
  let a, l, c, h, u;
  return s.horizontal ? (u = r / 2, a = Math.min(e, n), l = Math.max(e, n), c = i - u, h = i + u) : (u = o / 2, a = e - u, l = e + u, c = Math.min(i, n), h = Math.max(i, n)), {
    left: a,
    top: c,
    right: l,
    bottom: h
  };
}
function fe(s, t, e, i) {
  return s ? 0 : bt(t, e, i);
}
function Gu(s, t, e) {
  const i = s.options.borderWidth, n = s.borderSkipped, o = Hr(i);
  return {
    t: fe(n.top, o.top, 0, e),
    r: fe(n.right, o.right, 0, t),
    b: fe(n.bottom, o.bottom, 0, e),
    l: fe(n.left, o.left, 0, t)
  };
}
function Qu(s, t, e) {
  const { enableBorderRadius: i } = s.getProps([
    "enableBorderRadius"
  ]), n = s.options.borderRadius, o = Ae(n), r = Math.min(t, e), a = s.borderSkipped, l = i || U(n);
  return {
    topLeft: fe(!l || a.top || a.left, o.topLeft, 0, r),
    topRight: fe(!l || a.top || a.right, o.topRight, 0, r),
    bottomLeft: fe(!l || a.bottom || a.left, o.bottomLeft, 0, r),
    bottomRight: fe(!l || a.bottom || a.right, o.bottomRight, 0, r)
  };
}
function Ju(s) {
  const t = fa(s), e = t.right - t.left, i = t.bottom - t.top, n = Gu(s, e / 2, i / 2), o = Qu(s, e / 2, i / 2);
  return {
    outer: {
      x: t.left,
      y: t.top,
      w: e,
      h: i,
      radius: o
    },
    inner: {
      x: t.left + n.l,
      y: t.top + n.t,
      w: e - n.l - n.r,
      h: i - n.t - n.b,
      radius: {
        topLeft: Math.max(0, o.topLeft - Math.max(n.t, n.l)),
        topRight: Math.max(0, o.topRight - Math.max(n.t, n.r)),
        bottomLeft: Math.max(0, o.bottomLeft - Math.max(n.b, n.l)),
        bottomRight: Math.max(0, o.bottomRight - Math.max(n.b, n.r))
      }
    }
  };
}
function Ts(s, t, e, i) {
  const n = t === null, o = e === null, a = s && !(n && o) && fa(s, i);
  return a && (n || ie(t, a.left, a.right)) && (o || ie(e, a.top, a.bottom));
}
function Zu(s) {
  return s.topLeft || s.topRight || s.bottomLeft || s.bottomRight;
}
function td(s, t) {
  s.rect(t.x, t.y, t.w, t.h);
}
function Es(s, t, e = {}) {
  const i = s.x !== e.x ? -t : 0, n = s.y !== e.y ? -t : 0, o = (s.x + s.w !== e.x + e.w ? t : 0) - i, r = (s.y + s.h !== e.y + e.h ? t : 0) - n;
  return {
    x: s.x + i,
    y: s.y + n,
    w: s.w + o,
    h: s.h + r,
    radius: s.radius
  };
}
class Gi extends oe {
  constructor(t) {
    super(), this.options = void 0, this.horizontal = void 0, this.base = void 0, this.width = void 0, this.height = void 0, this.inflateAmount = void 0, t && Object.assign(this, t);
  }
  draw(t) {
    const { inflateAmount: e, options: { borderColor: i, backgroundColor: n } } = this, { inner: o, outer: r } = Ju(this), a = Zu(r.radius) ? mi : td;
    t.save(), (r.w !== o.w || r.h !== o.h) && (t.beginPath(), a(t, Es(r, e, o)), t.clip(), a(t, Es(o, -e, r)), t.fillStyle = i, t.fill("evenodd")), t.beginPath(), a(t, Es(o, e)), t.fillStyle = n, t.fill(), t.restore();
  }
  inRange(t, e, i) {
    return Ts(this, t, e, i);
  }
  inXRange(t, e) {
    return Ts(this, t, null, e);
  }
  inYRange(t, e) {
    return Ts(this, null, t, e);
  }
  getCenterPoint(t) {
    const { x: e, y: i, base: n, horizontal: o } = this.getProps([
      "x",
      "y",
      "base",
      "horizontal"
    ], t);
    return {
      x: o ? (e + n) / 2 : e,
      y: o ? i : (i + n) / 2
    };
  }
  getRange(t) {
    return t === "x" ? this.width / 2 : this.height / 2;
  }
}
P(Gi, "id", "bar"), P(Gi, "defaults", {
  borderSkipped: "start",
  borderWidth: 0,
  borderRadius: 0,
  inflateAmount: "auto",
  pointStyle: void 0
}), P(Gi, "defaultRoutes", {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor"
});
var ed = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ArcElement: ii,
  BarElement: Gi,
  LineElement: de,
  PointElement: Xi
});
const Js = [
  "rgb(54, 162, 235)",
  "rgb(255, 99, 132)",
  "rgb(255, 159, 64)",
  "rgb(255, 205, 86)",
  "rgb(75, 192, 192)",
  "rgb(153, 102, 255)",
  "rgb(201, 203, 207)"
  // grey
], zo = /* @__PURE__ */ Js.map((s) => s.replace("rgb(", "rgba(").replace(")", ", 0.5)"));
function ga(s) {
  return Js[s % Js.length];
}
function pa(s) {
  return zo[s % zo.length];
}
function id(s, t) {
  return s.borderColor = ga(t), s.backgroundColor = pa(t), ++t;
}
function sd(s, t) {
  return s.backgroundColor = s.data.map(() => ga(t++)), t;
}
function nd(s, t) {
  return s.backgroundColor = s.data.map(() => pa(t++)), t;
}
function od(s) {
  let t = 0;
  return (e, i) => {
    const n = s.getDatasetMeta(i).controller;
    n instanceof Pe ? t = sd(e, t) : n instanceof hi ? t = nd(e, t) : n && (t = id(e, t));
  };
}
function Bo(s) {
  let t;
  for (t in s)
    if (s[t].borderColor || s[t].backgroundColor)
      return !0;
  return !1;
}
function rd(s) {
  return s && (s.borderColor || s.backgroundColor);
}
function ad() {
  return nt.borderColor !== "rgba(0,0,0,0.1)" || nt.backgroundColor !== "rgba(0,0,0,0.1)";
}
var ld = {
  id: "colors",
  defaults: {
    enabled: !0,
    forceOverride: !1
  },
  beforeLayout(s, t, e) {
    if (!e.enabled)
      return;
    const { data: { datasets: i }, options: n } = s.config, { elements: o } = n, r = Bo(i) || rd(n) || o && Bo(o) || ad();
    if (!e.forceOverride && r)
      return;
    const a = od(s);
    i.forEach(a);
  }
};
function cd(s, t, e, i, n) {
  const o = n.samples || i;
  if (o >= e)
    return s.slice(t, t + e);
  const r = [], a = (e - 2) / (o - 2);
  let l = 0;
  const c = t + e - 1;
  let h = t, u, d, f, g, p;
  for (r[l++] = s[h], u = 0; u < o - 2; u++) {
    let m = 0, b = 0, _;
    const k = Math.floor((u + 1) * a) + 1 + t, M = Math.min(Math.floor((u + 2) * a) + 1, e) + t, S = M - k;
    for (_ = k; _ < M; _++)
      m += s[_].x, b += s[_].y;
    m /= S, b /= S;
    const O = Math.floor(u * a) + 1 + t, C = Math.min(Math.floor((u + 1) * a) + 1, e) + t, { x: A, y: L } = s[h];
    for (f = g = -1, _ = O; _ < C; _++)
      g = 0.5 * Math.abs((A - m) * (s[_].y - L) - (A - s[_].x) * (b - L)), g > f && (f = g, d = s[_], p = _);
    r[l++] = d, h = p;
  }
  return r[l++] = s[c], r;
}
function hd(s, t, e, i) {
  let n = 0, o = 0, r, a, l, c, h, u, d, f, g, p;
  const m = [], b = t + e - 1, _ = s[t].x, M = s[b].x - _;
  for (r = t; r < t + e; ++r) {
    a = s[r], l = (a.x - _) / M * i, c = a.y;
    const S = l | 0;
    if (S === h)
      c < g ? (g = c, u = r) : c > p && (p = c, d = r), n = (o * n + a.x) / ++o;
    else {
      const O = r - 1;
      if (!j(u) && !j(d)) {
        const C = Math.min(u, d), A = Math.max(u, d);
        C !== f && C !== O && m.push({
          ...s[C],
          x: n
        }), A !== f && A !== O && m.push({
          ...s[A],
          x: n
        });
      }
      r > 0 && O !== f && m.push(s[O]), m.push(a), h = S, o = 0, g = p = c, u = d = f = r;
    }
  }
  return m;
}
function ma(s) {
  if (s._decimated) {
    const t = s._data;
    delete s._decimated, delete s._data, Object.defineProperty(s, "data", {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: t
    });
  }
}
function Ho(s) {
  s.data.datasets.forEach((t) => {
    ma(t);
  });
}
function ud(s, t) {
  const e = t.length;
  let i = 0, n;
  const { iScale: o } = s, { min: r, max: a, minDefined: l, maxDefined: c } = o.getUserBounds();
  return l && (i = bt(se(t, o.axis, r).lo, 0, e - 1)), c ? n = bt(se(t, o.axis, a).hi + 1, i, e) - i : n = e - i, {
    start: i,
    count: n
  };
}
var dd = {
  id: "decimation",
  defaults: {
    algorithm: "min-max",
    enabled: !1
  },
  beforeElementsUpdate: (s, t, e) => {
    if (!e.enabled) {
      Ho(s);
      return;
    }
    const i = s.width;
    s.data.datasets.forEach((n, o) => {
      const { _data: r, indexAxis: a } = n, l = s.getDatasetMeta(o), c = r || n.data;
      if (ti([
        a,
        s.options.indexAxis
      ]) === "y" || !l.controller.supportsDecimation)
        return;
      const h = s.scales[l.xAxisID];
      if (h.type !== "linear" && h.type !== "time" || s.options.parsing)
        return;
      let { start: u, count: d } = ud(l, c);
      const f = e.threshold || 4 * i;
      if (d <= f) {
        ma(n);
        return;
      }
      j(r) && (n._data = c, delete n.data, Object.defineProperty(n, "data", {
        configurable: !0,
        enumerable: !0,
        get: function() {
          return this._decimated;
        },
        set: function(p) {
          this._data = p;
        }
      }));
      let g;
      switch (e.algorithm) {
        case "lttb":
          g = cd(c, u, d, i, e);
          break;
        case "min-max":
          g = hd(c, u, d, i);
          break;
        default:
          throw new Error(`Unsupported decimation algorithm '${e.algorithm}'`);
      }
      n._decimated = g;
    });
  },
  destroy(s) {
    Ho(s);
  }
};
function fd(s, t, e) {
  const i = s.segments, n = s.points, o = t.points, r = [];
  for (const a of i) {
    let { start: l, end: c } = a;
    c = fs(l, c, n);
    const h = Zs(e, n[l], n[c], a.loop);
    if (!t.segments) {
      r.push({
        source: a,
        target: h,
        start: n[l],
        end: n[c]
      });
      continue;
    }
    const u = Qr(t, h);
    for (const d of u) {
      const f = Zs(e, o[d.start], o[d.end], d.loop), g = Gr(a, n, f);
      for (const p of g)
        r.push({
          source: p,
          target: d,
          start: {
            [e]: $o(h, f, "start", Math.max)
          },
          end: {
            [e]: $o(h, f, "end", Math.min)
          }
        });
    }
  }
  return r;
}
function Zs(s, t, e, i) {
  if (i)
    return;
  let n = t[s], o = e[s];
  return s === "angle" && (n = wt(n), o = wt(o)), {
    property: s,
    start: n,
    end: o
  };
}
function gd(s, t) {
  const { x: e = null, y: i = null } = s || {}, n = t.points, o = [];
  return t.segments.forEach(({ start: r, end: a }) => {
    a = fs(r, a, n);
    const l = n[r], c = n[a];
    i !== null ? (o.push({
      x: l.x,
      y: i
    }), o.push({
      x: c.x,
      y: i
    })) : e !== null && (o.push({
      x: e,
      y: l.y
    }), o.push({
      x: e,
      y: c.y
    }));
  }), o;
}
function fs(s, t, e) {
  for (; t > s; t--) {
    const i = e[t];
    if (!isNaN(i.x) && !isNaN(i.y))
      break;
  }
  return t;
}
function $o(s, t, e, i) {
  return s && t ? i(s[e], t[e]) : s ? s[e] : t ? t[e] : 0;
}
function ba(s, t) {
  let e = [], i = !1;
  return st(s) ? (i = !0, e = s) : e = gd(s, t), e.length ? new de({
    points: e,
    options: {
      tension: 0
    },
    _loop: i,
    _fullLoop: i
  }) : null;
}
function qo(s) {
  return s && s.fill !== !1;
}
function pd(s, t, e) {
  let n = s[t].fill;
  const o = [
    t
  ];
  let r;
  if (!e)
    return n;
  for (; n !== !1 && o.indexOf(n) === -1; ) {
    if (!at(n))
      return n;
    if (r = s[n], !r)
      return !1;
    if (r.visible)
      return n;
    o.push(n), n = r.fill;
  }
  return !1;
}
function md(s, t, e) {
  const i = xd(s);
  if (U(i))
    return isNaN(i.value) ? !1 : i;
  let n = parseFloat(i);
  return at(n) && Math.floor(n) === n ? bd(i[0], t, n, e) : [
    "origin",
    "start",
    "end",
    "stack",
    "shape"
  ].indexOf(i) >= 0 && i;
}
function bd(s, t, e, i) {
  return (s === "-" || s === "+") && (e = t + e), e === t || e < 0 || e >= i ? !1 : e;
}
function _d(s, t) {
  let e = null;
  return s === "start" ? e = t.bottom : s === "end" ? e = t.top : U(s) ? e = t.getPixelForValue(s.value) : t.getBasePixel && (e = t.getBasePixel()), e;
}
function yd(s, t, e) {
  let i;
  return s === "start" ? i = e : s === "end" ? i = t.options.reverse ? t.min : t.max : U(s) ? i = s.value : i = t.getBaseValue(), i;
}
function xd(s) {
  const t = s.options, e = t.fill;
  let i = W(e && e.target, e);
  return i === void 0 && (i = !!t.backgroundColor), i === !1 || i === null ? !1 : i === !0 ? "origin" : i;
}
function vd(s) {
  const { scale: t, index: e, line: i } = s, n = [], o = i.segments, r = i.points, a = wd(t, e);
  a.push(ba({
    x: null,
    y: t.bottom
  }, i));
  for (let l = 0; l < o.length; l++) {
    const c = o[l];
    for (let h = c.start; h <= c.end; h++)
      Sd(n, r[h], a);
  }
  return new de({
    points: n,
    options: {}
  });
}
function wd(s, t) {
  const e = [], i = s.getMatchingVisibleMetas("line");
  for (let n = 0; n < i.length; n++) {
    const o = i[n];
    if (o.index === t)
      break;
    o.hidden || e.unshift(o.dataset);
  }
  return e;
}
function Sd(s, t, e) {
  const i = [];
  for (let n = 0; n < e.length; n++) {
    const o = e[n], { first: r, last: a, point: l } = Md(o, t, "x");
    if (!(!l || r && a)) {
      if (r)
        i.unshift(l);
      else if (s.push(l), !a)
        break;
    }
  }
  s.push(...i);
}
function Md(s, t, e) {
  const i = s.interpolate(t, e);
  if (!i)
    return {};
  const n = i[e], o = s.segments, r = s.points;
  let a = !1, l = !1;
  for (let c = 0; c < o.length; c++) {
    const h = o[c], u = r[h.start][e], d = r[h.end][e];
    if (ie(n, u, d)) {
      a = n === u, l = n === d;
      break;
    }
  }
  return {
    first: a,
    last: l,
    point: i
  };
}
class _a {
  constructor(t) {
    this.x = t.x, this.y = t.y, this.radius = t.radius;
  }
  pathSegment(t, e, i) {
    const { x: n, y: o, radius: r } = this;
    return e = e || {
      start: 0,
      end: it
    }, t.arc(n, o, r, e.end, e.start, !0), !i.bounds;
  }
  interpolate(t) {
    const { x: e, y: i, radius: n } = this, o = t.angle;
    return {
      x: e + Math.cos(o) * n,
      y: i + Math.sin(o) * n,
      angle: o
    };
  }
}
function kd(s) {
  const { chart: t, fill: e, line: i } = s;
  if (at(e))
    return Pd(t, e);
  if (e === "stack")
    return vd(s);
  if (e === "shape")
    return !0;
  const n = Ad(s);
  return n instanceof _a ? n : ba(n, i);
}
function Pd(s, t) {
  const e = s.getDatasetMeta(t);
  return e && s.isDatasetVisible(t) ? e.dataset : null;
}
function Ad(s) {
  return (s.scale || {}).getPointPositionForValue ? Td(s) : Cd(s);
}
function Cd(s) {
  const { scale: t = {}, fill: e } = s, i = _d(e, t);
  if (at(i)) {
    const n = t.isHorizontal();
    return {
      x: n ? i : null,
      y: n ? null : i
    };
  }
  return null;
}
function Td(s) {
  const { scale: t, fill: e } = s, i = t.options, n = t.getLabels().length, o = i.reverse ? t.max : t.min, r = yd(e, t, o), a = [];
  if (i.grid.circular) {
    const l = t.getPointPositionForValue(0, o);
    return new _a({
      x: l.x,
      y: l.y,
      radius: t.getDistanceFromCenterForValue(r)
    });
  }
  for (let l = 0; l < n; ++l)
    a.push(t.getPointPositionForValue(l, r));
  return a;
}
function Os(s, t, e) {
  const i = kd(t), { chart: n, index: o, line: r, scale: a, axis: l } = t, c = r.options, h = c.fill, u = c.backgroundColor, { above: d = u, below: f = u } = h || {}, g = n.getDatasetMeta(o), p = Jr(n, g);
  i && r.points.length && (cs(s, e), Ed(s, {
    line: r,
    target: i,
    above: d,
    below: f,
    area: e,
    scale: a,
    axis: l,
    clip: p
  }), hs(s));
}
function Ed(s, t) {
  const { line: e, target: i, above: n, below: o, area: r, scale: a, clip: l } = t, c = e._loop ? "angle" : t.axis;
  s.save();
  let h = o;
  o !== n && (c === "x" ? (Wo(s, i, r.top), Ds(s, {
    line: e,
    target: i,
    color: n,
    scale: a,
    property: c,
    clip: l
  }), s.restore(), s.save(), Wo(s, i, r.bottom)) : c === "y" && (Vo(s, i, r.left), Ds(s, {
    line: e,
    target: i,
    color: o,
    scale: a,
    property: c,
    clip: l
  }), s.restore(), s.save(), Vo(s, i, r.right), h = n)), Ds(s, {
    line: e,
    target: i,
    color: h,
    scale: a,
    property: c,
    clip: l
  }), s.restore();
}
function Wo(s, t, e) {
  const { segments: i, points: n } = t;
  let o = !0, r = !1;
  s.beginPath();
  for (const a of i) {
    const { start: l, end: c } = a, h = n[l], u = n[fs(l, c, n)];
    o ? (s.moveTo(h.x, h.y), o = !1) : (s.lineTo(h.x, e), s.lineTo(h.x, h.y)), r = !!t.pathSegment(s, a, {
      move: r
    }), r ? s.closePath() : s.lineTo(u.x, e);
  }
  s.lineTo(t.first().x, e), s.closePath(), s.clip();
}
function Vo(s, t, e) {
  const { segments: i, points: n } = t;
  let o = !0, r = !1;
  s.beginPath();
  for (const a of i) {
    const { start: l, end: c } = a, h = n[l], u = n[fs(l, c, n)];
    o ? (s.moveTo(h.x, h.y), o = !1) : (s.lineTo(e, h.y), s.lineTo(h.x, h.y)), r = !!t.pathSegment(s, a, {
      move: r
    }), r ? s.closePath() : s.lineTo(e, u.y);
  }
  s.lineTo(e, t.first().y), s.closePath(), s.clip();
}
function Ds(s, t) {
  const { line: e, target: i, property: n, color: o, scale: r, clip: a } = t, l = fd(e, i, n);
  for (const { source: c, target: h, start: u, end: d } of l) {
    const { style: { backgroundColor: f = o } = {} } = c, g = i !== !0;
    s.save(), s.fillStyle = f, Od(s, r, a, g && Zs(n, u, d)), s.beginPath();
    const p = !!e.pathSegment(s, c);
    let m;
    if (g) {
      p ? s.closePath() : jo(s, i, d, n);
      const b = !!i.pathSegment(s, h, {
        move: p,
        reverse: !0
      });
      m = p && b, m || jo(s, i, u, n);
    }
    s.closePath(), s.fill(m ? "evenodd" : "nonzero"), s.restore();
  }
}
function Od(s, t, e, i) {
  const n = t.chart.chartArea, { property: o, start: r, end: a } = i || {};
  if (o === "x" || o === "y") {
    let l, c, h, u;
    o === "x" ? (l = r, c = n.top, h = a, u = n.bottom) : (l = n.left, c = r, h = n.right, u = a), s.beginPath(), e && (l = Math.max(l, e.left), h = Math.min(h, e.right), c = Math.max(c, e.top), u = Math.min(u, e.bottom)), s.rect(l, c, h - l, u - c), s.clip();
  }
}
function jo(s, t, e, i) {
  const n = t.interpolate(e, i);
  n && s.lineTo(n.x, n.y);
}
var Dd = {
  id: "filler",
  afterDatasetsUpdate(s, t, e) {
    const i = (s.data.datasets || []).length, n = [];
    let o, r, a, l;
    for (r = 0; r < i; ++r)
      o = s.getDatasetMeta(r), a = o.dataset, l = null, a && a.options && a instanceof de && (l = {
        visible: s.isDatasetVisible(r),
        index: r,
        fill: md(a, r, i),
        chart: s,
        axis: o.controller.options.indexAxis,
        scale: o.vScale,
        line: a
      }), o.$filler = l, n.push(l);
    for (r = 0; r < i; ++r)
      l = n[r], !(!l || l.fill === !1) && (l.fill = pd(n, r, e.propagate));
  },
  beforeDraw(s, t, e) {
    const i = e.drawTime === "beforeDraw", n = s.getSortedVisibleDatasetMetas(), o = s.chartArea;
    for (let r = n.length - 1; r >= 0; --r) {
      const a = n[r].$filler;
      a && (a.line.updateControlPoints(o, a.axis), i && a.fill && Os(s.ctx, a, o));
    }
  },
  beforeDatasetsDraw(s, t, e) {
    if (e.drawTime !== "beforeDatasetsDraw")
      return;
    const i = s.getSortedVisibleDatasetMetas();
    for (let n = i.length - 1; n >= 0; --n) {
      const o = i[n].$filler;
      qo(o) && Os(s.ctx, o, s.chartArea);
    }
  },
  beforeDatasetDraw(s, t, e) {
    const i = t.meta.$filler;
    !qo(i) || e.drawTime !== "beforeDatasetDraw" || Os(s.ctx, i, s.chartArea);
  },
  defaults: {
    propagate: !0,
    drawTime: "beforeDatasetDraw"
  }
};
const Uo = (s, t) => {
  let { boxHeight: e = t, boxWidth: i = t } = s;
  return s.usePointStyle && (e = Math.min(e, t), i = s.pointStyleWidth || Math.min(i, t)), {
    boxWidth: i,
    boxHeight: e,
    itemHeight: Math.max(t, e)
  };
}, Ld = (s, t) => s !== null && t !== null && s.datasetIndex === t.datasetIndex && s.index === t.index;
class Yo extends oe {
  constructor(t) {
    super(), this._added = !1, this.legendHitBoxes = [], this._hoveredItem = null, this.doughnutMode = !1, this.chart = t.chart, this.options = t.options, this.ctx = t.ctx, this.legendItems = void 0, this.columnSizes = void 0, this.lineWidths = void 0, this.maxHeight = void 0, this.maxWidth = void 0, this.top = void 0, this.bottom = void 0, this.left = void 0, this.right = void 0, this.height = void 0, this.width = void 0, this._margins = void 0, this.position = void 0, this.weight = void 0, this.fullSize = void 0;
  }
  update(t, e, i) {
    this.maxWidth = t, this.maxHeight = e, this._margins = i, this.setDimensions(), this.buildLabels(), this.fit();
  }
  setDimensions() {
    this.isHorizontal() ? (this.width = this.maxWidth, this.left = this._margins.left, this.right = this.width) : (this.height = this.maxHeight, this.top = this._margins.top, this.bottom = this.height);
  }
  buildLabels() {
    const t = this.options.labels || {};
    let e = et(t.generateLabels, [
      this.chart
    ], this) || [];
    t.filter && (e = e.filter((i) => t.filter(i, this.chart.data))), t.sort && (e = e.sort((i, n) => t.sort(i, n, this.chart.data))), this.options.reverse && e.reverse(), this.legendItems = e;
  }
  fit() {
    const { options: t, ctx: e } = this;
    if (!t.display) {
      this.width = this.height = 0;
      return;
    }
    const i = t.labels, n = ft(i.font), o = n.size, r = this._computeTitleHeight(), { boxWidth: a, itemHeight: l } = Uo(i, o);
    let c, h;
    e.font = n.string, this.isHorizontal() ? (c = this.maxWidth, h = this._fitRows(r, o, a, l) + 10) : (h = this.maxHeight, c = this._fitCols(r, n, a, l) + 10), this.width = Math.min(c, t.maxWidth || this.maxWidth), this.height = Math.min(h, t.maxHeight || this.maxHeight);
  }
  _fitRows(t, e, i, n) {
    const { ctx: o, maxWidth: r, options: { labels: { padding: a } } } = this, l = this.legendHitBoxes = [], c = this.lineWidths = [
      0
    ], h = n + a;
    let u = t;
    o.textAlign = "left", o.textBaseline = "middle";
    let d = -1, f = -h;
    return this.legendItems.forEach((g, p) => {
      const m = i + e / 2 + o.measureText(g.text).width;
      (p === 0 || c[c.length - 1] + m + 2 * a > r) && (u += h, c[c.length - (p > 0 ? 0 : 1)] = 0, f += h, d++), l[p] = {
        left: 0,
        top: f,
        row: d,
        width: m,
        height: n
      }, c[c.length - 1] += m + a;
    }), u;
  }
  _fitCols(t, e, i, n) {
    const { ctx: o, maxHeight: r, options: { labels: { padding: a } } } = this, l = this.legendHitBoxes = [], c = this.columnSizes = [], h = r - t;
    let u = a, d = 0, f = 0, g = 0, p = 0;
    return this.legendItems.forEach((m, b) => {
      const { itemWidth: _, itemHeight: k } = Rd(i, e, o, m, n);
      b > 0 && f + k + 2 * a > h && (u += d + a, c.push({
        width: d,
        height: f
      }), g += d + a, p++, d = f = 0), l[b] = {
        left: g,
        top: f,
        col: p,
        width: _,
        height: k
      }, d = Math.max(d, _), f += k + a;
    }), u += d, c.push({
      width: d,
      height: f
    }), u;
  }
  adjustHitBoxes() {
    if (!this.options.display)
      return;
    const t = this._computeTitleHeight(), { legendHitBoxes: e, options: { align: i, labels: { padding: n }, rtl: o } } = this, r = Be(o, this.left, this.width);
    if (this.isHorizontal()) {
      let a = 0, l = vt(i, this.left + n, this.right - this.lineWidths[a]);
      for (const c of e)
        a !== c.row && (a = c.row, l = vt(i, this.left + n, this.right - this.lineWidths[a])), c.top += this.top + t + n, c.left = r.leftForLtr(r.x(l), c.width), l += c.width + n;
    } else {
      let a = 0, l = vt(i, this.top + t + n, this.bottom - this.columnSizes[a].height);
      for (const c of e)
        c.col !== a && (a = c.col, l = vt(i, this.top + t + n, this.bottom - this.columnSizes[a].height)), c.top = l, c.left += this.left + n, c.left = r.leftForLtr(r.x(c.left), c.width), l += c.height + n;
    }
  }
  isHorizontal() {
    return this.options.position === "top" || this.options.position === "bottom";
  }
  draw() {
    if (this.options.display) {
      const t = this.ctx;
      cs(t, this), this._draw(), hs(t);
    }
  }
  _draw() {
    const { options: t, columnSizes: e, lineWidths: i, ctx: n } = this, { align: o, labels: r } = t, a = nt.color, l = Be(t.rtl, this.left, this.width), c = ft(r.font), { padding: h } = r, u = c.size, d = u / 2;
    let f;
    this.drawTitle(), n.textAlign = l.textAlign("left"), n.textBaseline = "middle", n.lineWidth = 0.5, n.font = c.string;
    const { boxWidth: g, boxHeight: p, itemHeight: m } = Uo(r, u), b = function(O, C, A) {
      if (isNaN(g) || g <= 0 || isNaN(p) || p < 0)
        return;
      n.save();
      const L = W(A.lineWidth, 1);
      if (n.fillStyle = W(A.fillStyle, a), n.lineCap = W(A.lineCap, "butt"), n.lineDashOffset = W(A.lineDashOffset, 0), n.lineJoin = W(A.lineJoin, "miter"), n.lineWidth = L, n.strokeStyle = W(A.strokeStyle, a), n.setLineDash(W(A.lineDash, [])), r.usePointStyle) {
        const H = {
          radius: p * Math.SQRT2 / 2,
          pointStyle: A.pointStyle,
          rotation: A.rotation,
          borderWidth: L
        }, q = l.xPlus(O, g / 2), V = C + d;
        Br(n, H, q, V, r.pointStyleWidth && g);
      } else {
        const H = C + Math.max((u - p) / 2, 0), q = l.leftForLtr(O, g), V = Ae(A.borderRadius);
        n.beginPath(), Object.values(V).some((ot) => ot !== 0) ? mi(n, {
          x: q,
          y: H,
          w: g,
          h: p,
          radius: V
        }) : n.rect(q, H, g, p), n.fill(), L !== 0 && n.stroke();
      }
      n.restore();
    }, _ = function(O, C, A) {
      Oe(n, A.text, O, C + m / 2, c, {
        strikethrough: A.hidden,
        textAlign: l.textAlign(A.textAlign)
      });
    }, k = this.isHorizontal(), M = this._computeTitleHeight();
    k ? f = {
      x: vt(o, this.left + h, this.right - i[0]),
      y: this.top + h + M,
      line: 0
    } : f = {
      x: this.left + h,
      y: vt(o, this.top + M + h, this.bottom - e[0].height),
      line: 0
    }, Yr(this.ctx, t.textDirection);
    const S = m + h;
    this.legendItems.forEach((O, C) => {
      n.strokeStyle = O.fontColor, n.fillStyle = O.fontColor;
      const A = n.measureText(O.text).width, L = l.textAlign(O.textAlign || (O.textAlign = r.textAlign)), H = g + d + A;
      let q = f.x, V = f.y;
      l.setWidth(this.width), k ? C > 0 && q + H + h > this.right && (V = f.y += S, f.line++, q = f.x = vt(o, this.left + h, this.right - i[f.line])) : C > 0 && V + S > this.bottom && (q = f.x = q + e[f.line].width + h, f.line++, V = f.y = vt(o, this.top + M + h, this.bottom - e[f.line].height));
      const ot = l.x(q);
      if (b(ot, V, O), q = Zl(L, q + g + d, k ? q + H : this.right, t.rtl), _(l.x(q), V, O), k)
        f.x += H + h;
      else if (typeof O.text != "string") {
        const ct = c.lineHeight;
        f.y += ya(O, ct) + h;
      } else
        f.y += S;
    }), Kr(this.ctx, t.textDirection);
  }
  drawTitle() {
    const t = this.options, e = t.title, i = ft(e.font), n = Mt(e.padding);
    if (!e.display)
      return;
    const o = Be(t.rtl, this.left, this.width), r = this.ctx, a = e.position, l = i.size / 2, c = n.top + l;
    let h, u = this.left, d = this.width;
    if (this.isHorizontal())
      d = Math.max(...this.lineWidths), h = this.top + c, u = vt(t.align, u, this.right - d);
    else {
      const g = this.columnSizes.reduce((p, m) => Math.max(p, m.height), 0);
      h = c + vt(t.align, this.top, this.bottom - g - t.labels.padding - this._computeTitleHeight());
    }
    const f = vt(a, u, u + d);
    r.textAlign = o.textAlign(_n(a)), r.textBaseline = "middle", r.strokeStyle = e.color, r.fillStyle = e.color, r.font = i.string, Oe(r, e.text, f, h, i);
  }
  _computeTitleHeight() {
    const t = this.options.title, e = ft(t.font), i = Mt(t.padding);
    return t.display ? e.lineHeight + i.height : 0;
  }
  _getLegendItemAt(t, e) {
    let i, n, o;
    if (ie(t, this.left, this.right) && ie(e, this.top, this.bottom)) {
      for (o = this.legendHitBoxes, i = 0; i < o.length; ++i)
        if (n = o[i], ie(t, n.left, n.left + n.width) && ie(e, n.top, n.top + n.height))
          return this.legendItems[i];
    }
    return null;
  }
  handleEvent(t) {
    const e = this.options;
    if (!Nd(t.type, e))
      return;
    const i = this._getLegendItemAt(t.x, t.y);
    if (t.type === "mousemove" || t.type === "mouseout") {
      const n = this._hoveredItem, o = Ld(n, i);
      n && !o && et(e.onLeave, [
        t,
        n,
        this
      ], this), this._hoveredItem = i, i && !o && et(e.onHover, [
        t,
        i,
        this
      ], this);
    } else i && et(e.onClick, [
      t,
      i,
      this
    ], this);
  }
}
function Rd(s, t, e, i, n) {
  const o = Id(i, s, t, e), r = Fd(n, i, t.lineHeight);
  return {
    itemWidth: o,
    itemHeight: r
  };
}
function Id(s, t, e, i) {
  let n = s.text;
  return n && typeof n != "string" && (n = n.reduce((o, r) => o.length > r.length ? o : r)), t + e.size / 2 + i.measureText(n).width;
}
function Fd(s, t, e) {
  let i = s;
  return typeof t.text != "string" && (i = ya(t, e)), i;
}
function ya(s, t) {
  const e = s.text ? s.text.length : 0;
  return t * e;
}
function Nd(s, t) {
  return !!((s === "mousemove" || s === "mouseout") && (t.onHover || t.onLeave) || t.onClick && (s === "click" || s === "mouseup"));
}
var zd = {
  id: "legend",
  _element: Yo,
  start(s, t, e) {
    const i = s.legend = new Yo({
      ctx: s.ctx,
      options: e,
      chart: s
    });
    St.configure(s, i, e), St.addBox(s, i);
  },
  stop(s) {
    St.removeBox(s, s.legend), delete s.legend;
  },
  beforeUpdate(s, t, e) {
    const i = s.legend;
    St.configure(s, i, e), i.options = e;
  },
  afterUpdate(s) {
    const t = s.legend;
    t.buildLabels(), t.adjustHitBoxes();
  },
  afterEvent(s, t) {
    t.replay || s.legend.handleEvent(t.event);
  },
  defaults: {
    display: !0,
    position: "top",
    align: "center",
    fullSize: !0,
    reverse: !1,
    weight: 1e3,
    onClick(s, t, e) {
      const i = t.datasetIndex, n = e.chart;
      n.isDatasetVisible(i) ? (n.hide(i), t.hidden = !0) : (n.show(i), t.hidden = !1);
    },
    onHover: null,
    onLeave: null,
    labels: {
      color: (s) => s.chart.options.color,
      boxWidth: 40,
      padding: 10,
      generateLabels(s) {
        const t = s.data.datasets, { labels: { usePointStyle: e, pointStyle: i, textAlign: n, color: o, useBorderRadius: r, borderRadius: a } } = s.legend.options;
        return s._getSortedDatasetMetas().map((l) => {
          const c = l.controller.getStyle(e ? 0 : void 0), h = Mt(c.borderWidth);
          return {
            text: t[l.index].label,
            fillStyle: c.backgroundColor,
            fontColor: o,
            hidden: !l.visible,
            lineCap: c.borderCapStyle,
            lineDash: c.borderDash,
            lineDashOffset: c.borderDashOffset,
            lineJoin: c.borderJoinStyle,
            lineWidth: (h.width + h.height) / 4,
            strokeStyle: c.borderColor,
            pointStyle: i || c.pointStyle,
            rotation: c.rotation,
            textAlign: n || c.textAlign,
            borderRadius: r && (a || c.borderRadius),
            datasetIndex: l.index
          };
        }, this);
      }
    },
    title: {
      color: (s) => s.chart.options.color,
      display: !1,
      position: "center",
      text: ""
    }
  },
  descriptors: {
    _scriptable: (s) => !s.startsWith("on"),
    labels: {
      _scriptable: (s) => ![
        "generateLabels",
        "filter",
        "sort"
      ].includes(s)
    }
  }
};
class An extends oe {
  constructor(t) {
    super(), this.chart = t.chart, this.options = t.options, this.ctx = t.ctx, this._padding = void 0, this.top = void 0, this.bottom = void 0, this.left = void 0, this.right = void 0, this.width = void 0, this.height = void 0, this.position = void 0, this.weight = void 0, this.fullSize = void 0;
  }
  update(t, e) {
    const i = this.options;
    if (this.left = 0, this.top = 0, !i.display) {
      this.width = this.height = this.right = this.bottom = 0;
      return;
    }
    this.width = this.right = t, this.height = this.bottom = e;
    const n = st(i.text) ? i.text.length : 1;
    this._padding = Mt(i.padding);
    const o = n * ft(i.font).lineHeight + this._padding.height;
    this.isHorizontal() ? this.height = o : this.width = o;
  }
  isHorizontal() {
    const t = this.options.position;
    return t === "top" || t === "bottom";
  }
  _drawArgs(t) {
    const { top: e, left: i, bottom: n, right: o, options: r } = this, a = r.align;
    let l = 0, c, h, u;
    return this.isHorizontal() ? (h = vt(a, i, o), u = e + t, c = o - i) : (r.position === "left" ? (h = i + t, u = vt(a, n, e), l = K * -0.5) : (h = o - t, u = vt(a, e, n), l = K * 0.5), c = n - e), {
      titleX: h,
      titleY: u,
      maxWidth: c,
      rotation: l
    };
  }
  draw() {
    const t = this.ctx, e = this.options;
    if (!e.display)
      return;
    const i = ft(e.font), o = i.lineHeight / 2 + this._padding.top, { titleX: r, titleY: a, maxWidth: l, rotation: c } = this._drawArgs(o);
    Oe(t, e.text, 0, 0, i, {
      color: e.color,
      maxWidth: l,
      rotation: c,
      textAlign: _n(e.align),
      textBaseline: "middle",
      translation: [
        r,
        a
      ]
    });
  }
}
function Bd(s, t) {
  const e = new An({
    ctx: s.ctx,
    options: t,
    chart: s
  });
  St.configure(s, e, t), St.addBox(s, e), s.titleBlock = e;
}
var Hd = {
  id: "title",
  _element: An,
  start(s, t, e) {
    Bd(s, e);
  },
  stop(s) {
    const t = s.titleBlock;
    St.removeBox(s, t), delete s.titleBlock;
  },
  beforeUpdate(s, t, e) {
    const i = s.titleBlock;
    St.configure(s, i, e), i.options = e;
  },
  defaults: {
    align: "center",
    display: !1,
    font: {
      weight: "bold"
    },
    fullSize: !0,
    padding: 10,
    position: "top",
    text: "",
    weight: 2e3
  },
  defaultRoutes: {
    color: "color"
  },
  descriptors: {
    _scriptable: !0,
    _indexable: !1
  }
};
const Fi = /* @__PURE__ */ new WeakMap();
var $d = {
  id: "subtitle",
  start(s, t, e) {
    const i = new An({
      ctx: s.ctx,
      options: e,
      chart: s
    });
    St.configure(s, i, e), St.addBox(s, i), Fi.set(s, i);
  },
  stop(s) {
    St.removeBox(s, Fi.get(s)), Fi.delete(s);
  },
  beforeUpdate(s, t, e) {
    const i = Fi.get(s);
    St.configure(s, i, e), i.options = e;
  },
  defaults: {
    align: "center",
    display: !1,
    font: {
      weight: "normal"
    },
    fullSize: !0,
    padding: 0,
    position: "top",
    text: "",
    weight: 1500
  },
  defaultRoutes: {
    color: "color"
  },
  descriptors: {
    _scriptable: !0,
    _indexable: !1
  }
};
const si = {
  average(s) {
    if (!s.length)
      return !1;
    let t, e, i = /* @__PURE__ */ new Set(), n = 0, o = 0;
    for (t = 0, e = s.length; t < e; ++t) {
      const a = s[t].element;
      if (a && a.hasValue()) {
        const l = a.tooltipPosition();
        i.add(l.x), n += l.y, ++o;
      }
    }
    return o === 0 || i.size === 0 ? !1 : {
      x: [
        ...i
      ].reduce((a, l) => a + l) / i.size,
      y: n / o
    };
  },
  nearest(s, t) {
    if (!s.length)
      return !1;
    let e = t.x, i = t.y, n = Number.POSITIVE_INFINITY, o, r, a;
    for (o = 0, r = s.length; o < r; ++o) {
      const l = s[o].element;
      if (l && l.hasValue()) {
        const c = l.getCenterPoint(), h = js(t, c);
        h < n && (n = h, a = l);
      }
    }
    if (a) {
      const l = a.tooltipPosition();
      e = l.x, i = l.y;
    }
    return {
      x: e,
      y: i
    };
  }
};
function Ut(s, t) {
  return t && (st(t) ? Array.prototype.push.apply(s, t) : s.push(t)), s;
}
function Zt(s) {
  return (typeof s == "string" || s instanceof String) && s.indexOf(`
`) > -1 ? s.split(`
`) : s;
}
function qd(s, t) {
  const { element: e, datasetIndex: i, index: n } = t, o = s.getDatasetMeta(i).controller, { label: r, value: a } = o.getLabelAndValue(n);
  return {
    chart: s,
    label: r,
    parsed: o.getParsed(n),
    raw: s.data.datasets[i].data[n],
    formattedValue: a,
    dataset: o.getDataset(),
    dataIndex: n,
    datasetIndex: i,
    element: e
  };
}
function Ko(s, t) {
  const e = s.chart.ctx, { body: i, footer: n, title: o } = s, { boxWidth: r, boxHeight: a } = t, l = ft(t.bodyFont), c = ft(t.titleFont), h = ft(t.footerFont), u = o.length, d = n.length, f = i.length, g = Mt(t.padding);
  let p = g.height, m = 0, b = i.reduce((M, S) => M + S.before.length + S.lines.length + S.after.length, 0);
  if (b += s.beforeBody.length + s.afterBody.length, u && (p += u * c.lineHeight + (u - 1) * t.titleSpacing + t.titleMarginBottom), b) {
    const M = t.displayColors ? Math.max(a, l.lineHeight) : l.lineHeight;
    p += f * M + (b - f) * l.lineHeight + (b - 1) * t.bodySpacing;
  }
  d && (p += t.footerMarginTop + d * h.lineHeight + (d - 1) * t.footerSpacing);
  let _ = 0;
  const k = function(M) {
    m = Math.max(m, e.measureText(M).width + _);
  };
  return e.save(), e.font = c.string, Z(s.title, k), e.font = l.string, Z(s.beforeBody.concat(s.afterBody), k), _ = t.displayColors ? r + 2 + t.boxPadding : 0, Z(i, (M) => {
    Z(M.before, k), Z(M.lines, k), Z(M.after, k);
  }), _ = 0, e.font = h.string, Z(s.footer, k), e.restore(), m += g.width, {
    width: m,
    height: p
  };
}
function Wd(s, t) {
  const { y: e, height: i } = t;
  return e < i / 2 ? "top" : e > s.height - i / 2 ? "bottom" : "center";
}
function Vd(s, t, e, i) {
  const { x: n, width: o } = i, r = e.caretSize + e.caretPadding;
  if (s === "left" && n + o + r > t.width || s === "right" && n - o - r < 0)
    return !0;
}
function jd(s, t, e, i) {
  const { x: n, width: o } = e, { width: r, chartArea: { left: a, right: l } } = s;
  let c = "center";
  return i === "center" ? c = n <= (a + l) / 2 ? "left" : "right" : n <= o / 2 ? c = "left" : n >= r - o / 2 && (c = "right"), Vd(c, s, t, e) && (c = "center"), c;
}
function Xo(s, t, e) {
  const i = e.yAlign || t.yAlign || Wd(s, e);
  return {
    xAlign: e.xAlign || t.xAlign || jd(s, t, e, i),
    yAlign: i
  };
}
function Ud(s, t) {
  let { x: e, width: i } = s;
  return t === "right" ? e -= i : t === "center" && (e -= i / 2), e;
}
function Yd(s, t, e) {
  let { y: i, height: n } = s;
  return t === "top" ? i += e : t === "bottom" ? i -= n + e : i -= n / 2, i;
}
function Go(s, t, e, i) {
  const { caretSize: n, caretPadding: o, cornerRadius: r } = s, { xAlign: a, yAlign: l } = e, c = n + o, { topLeft: h, topRight: u, bottomLeft: d, bottomRight: f } = Ae(r);
  let g = Ud(t, a);
  const p = Yd(t, l, c);
  return l === "center" ? a === "left" ? g += c : a === "right" && (g -= c) : a === "left" ? g -= Math.max(h, d) + n : a === "right" && (g += Math.max(u, f) + n), {
    x: bt(g, 0, i.width - t.width),
    y: bt(p, 0, i.height - t.height)
  };
}
function Ni(s, t, e) {
  const i = Mt(e.padding);
  return t === "center" ? s.x + s.width / 2 : t === "right" ? s.x + s.width - i.right : s.x + i.left;
}
function Qo(s) {
  return Ut([], Zt(s));
}
function Kd(s, t, e) {
  return be(s, {
    tooltip: t,
    tooltipItems: e,
    type: "tooltip"
  });
}
function Jo(s, t) {
  const e = t && t.dataset && t.dataset.tooltip && t.dataset.tooltip.callbacks;
  return e ? s.override(e) : s;
}
const xa = {
  beforeTitle: Gt,
  title(s) {
    if (s.length > 0) {
      const t = s[0], e = t.chart.data.labels, i = e ? e.length : 0;
      if (this && this.options && this.options.mode === "dataset")
        return t.dataset.label || "";
      if (t.label)
        return t.label;
      if (i > 0 && t.dataIndex < i)
        return e[t.dataIndex];
    }
    return "";
  },
  afterTitle: Gt,
  beforeBody: Gt,
  beforeLabel: Gt,
  label(s) {
    if (this && this.options && this.options.mode === "dataset")
      return s.label + ": " + s.formattedValue || s.formattedValue;
    let t = s.dataset.label || "";
    t && (t += ": ");
    const e = s.formattedValue;
    return j(e) || (t += e), t;
  },
  labelColor(s) {
    const e = s.chart.getDatasetMeta(s.datasetIndex).controller.getStyle(s.dataIndex);
    return {
      borderColor: e.borderColor,
      backgroundColor: e.backgroundColor,
      borderWidth: e.borderWidth,
      borderDash: e.borderDash,
      borderDashOffset: e.borderDashOffset,
      borderRadius: 0
    };
  },
  labelTextColor() {
    return this.options.bodyColor;
  },
  labelPointStyle(s) {
    const e = s.chart.getDatasetMeta(s.datasetIndex).controller.getStyle(s.dataIndex);
    return {
      pointStyle: e.pointStyle,
      rotation: e.rotation
    };
  },
  afterLabel: Gt,
  afterBody: Gt,
  beforeFooter: Gt,
  footer: Gt,
  afterFooter: Gt
};
function Ct(s, t, e, i) {
  const n = s[t].call(e, i);
  return typeof n > "u" ? xa[t].call(e, i) : n;
}
class tn extends oe {
  constructor(t) {
    super(), this.opacity = 0, this._active = [], this._eventPosition = void 0, this._size = void 0, this._cachedAnimations = void 0, this._tooltipItems = [], this.$animations = void 0, this.$context = void 0, this.chart = t.chart, this.options = t.options, this.dataPoints = void 0, this.title = void 0, this.beforeBody = void 0, this.body = void 0, this.afterBody = void 0, this.footer = void 0, this.xAlign = void 0, this.yAlign = void 0, this.x = void 0, this.y = void 0, this.height = void 0, this.width = void 0, this.caretX = void 0, this.caretY = void 0, this.labelColors = void 0, this.labelPointStyles = void 0, this.labelTextColors = void 0;
  }
  initialize(t) {
    this.options = t, this._cachedAnimations = void 0, this.$context = void 0;
  }
  _resolveAnimations() {
    const t = this._cachedAnimations;
    if (t)
      return t;
    const e = this.chart, i = this.options.setContext(this.getContext()), n = i.enabled && e.options.animation && i.animations, o = new Zr(this.chart, n);
    return n._cacheable && (this._cachedAnimations = Object.freeze(o)), o;
  }
  getContext() {
    return this.$context || (this.$context = Kd(this.chart.getContext(), this, this._tooltipItems));
  }
  getTitle(t, e) {
    const { callbacks: i } = e, n = Ct(i, "beforeTitle", this, t), o = Ct(i, "title", this, t), r = Ct(i, "afterTitle", this, t);
    let a = [];
    return a = Ut(a, Zt(n)), a = Ut(a, Zt(o)), a = Ut(a, Zt(r)), a;
  }
  getBeforeBody(t, e) {
    return Qo(Ct(e.callbacks, "beforeBody", this, t));
  }
  getBody(t, e) {
    const { callbacks: i } = e, n = [];
    return Z(t, (o) => {
      const r = {
        before: [],
        lines: [],
        after: []
      }, a = Jo(i, o);
      Ut(r.before, Zt(Ct(a, "beforeLabel", this, o))), Ut(r.lines, Ct(a, "label", this, o)), Ut(r.after, Zt(Ct(a, "afterLabel", this, o))), n.push(r);
    }), n;
  }
  getAfterBody(t, e) {
    return Qo(Ct(e.callbacks, "afterBody", this, t));
  }
  getFooter(t, e) {
    const { callbacks: i } = e, n = Ct(i, "beforeFooter", this, t), o = Ct(i, "footer", this, t), r = Ct(i, "afterFooter", this, t);
    let a = [];
    return a = Ut(a, Zt(n)), a = Ut(a, Zt(o)), a = Ut(a, Zt(r)), a;
  }
  _createItems(t) {
    const e = this._active, i = this.chart.data, n = [], o = [], r = [];
    let a = [], l, c;
    for (l = 0, c = e.length; l < c; ++l)
      a.push(qd(this.chart, e[l]));
    return t.filter && (a = a.filter((h, u, d) => t.filter(h, u, d, i))), t.itemSort && (a = a.sort((h, u) => t.itemSort(h, u, i))), Z(a, (h) => {
      const u = Jo(t.callbacks, h);
      n.push(Ct(u, "labelColor", this, h)), o.push(Ct(u, "labelPointStyle", this, h)), r.push(Ct(u, "labelTextColor", this, h));
    }), this.labelColors = n, this.labelPointStyles = o, this.labelTextColors = r, this.dataPoints = a, a;
  }
  update(t, e) {
    const i = this.options.setContext(this.getContext()), n = this._active;
    let o, r = [];
    if (!n.length)
      this.opacity !== 0 && (o = {
        opacity: 0
      });
    else {
      const a = si[i.position].call(this, n, this._eventPosition);
      r = this._createItems(i), this.title = this.getTitle(r, i), this.beforeBody = this.getBeforeBody(r, i), this.body = this.getBody(r, i), this.afterBody = this.getAfterBody(r, i), this.footer = this.getFooter(r, i);
      const l = this._size = Ko(this, i), c = Object.assign({}, a, l), h = Xo(this.chart, i, c), u = Go(i, c, h, this.chart);
      this.xAlign = h.xAlign, this.yAlign = h.yAlign, o = {
        opacity: 1,
        x: u.x,
        y: u.y,
        width: l.width,
        height: l.height,
        caretX: a.x,
        caretY: a.y
      };
    }
    this._tooltipItems = r, this.$context = void 0, o && this._resolveAnimations().update(this, o), t && i.external && i.external.call(this, {
      chart: this.chart,
      tooltip: this,
      replay: e
    });
  }
  drawCaret(t, e, i, n) {
    const o = this.getCaretPosition(t, i, n);
    e.lineTo(o.x1, o.y1), e.lineTo(o.x2, o.y2), e.lineTo(o.x3, o.y3);
  }
  getCaretPosition(t, e, i) {
    const { xAlign: n, yAlign: o } = this, { caretSize: r, cornerRadius: a } = i, { topLeft: l, topRight: c, bottomLeft: h, bottomRight: u } = Ae(a), { x: d, y: f } = t, { width: g, height: p } = e;
    let m, b, _, k, M, S;
    return o === "center" ? (M = f + p / 2, n === "left" ? (m = d, b = m - r, k = M + r, S = M - r) : (m = d + g, b = m + r, k = M - r, S = M + r), _ = m) : (n === "left" ? b = d + Math.max(l, h) + r : n === "right" ? b = d + g - Math.max(c, u) - r : b = this.caretX, o === "top" ? (k = f, M = k - r, m = b - r, _ = b + r) : (k = f + p, M = k + r, m = b + r, _ = b - r), S = k), {
      x1: m,
      x2: b,
      x3: _,
      y1: k,
      y2: M,
      y3: S
    };
  }
  drawTitle(t, e, i) {
    const n = this.title, o = n.length;
    let r, a, l;
    if (o) {
      const c = Be(i.rtl, this.x, this.width);
      for (t.x = Ni(this, i.titleAlign, i), e.textAlign = c.textAlign(i.titleAlign), e.textBaseline = "middle", r = ft(i.titleFont), a = i.titleSpacing, e.fillStyle = i.titleColor, e.font = r.string, l = 0; l < o; ++l)
        e.fillText(n[l], c.x(t.x), t.y + r.lineHeight / 2), t.y += r.lineHeight + a, l + 1 === o && (t.y += i.titleMarginBottom - a);
    }
  }
  _drawColorBox(t, e, i, n, o) {
    const r = this.labelColors[i], a = this.labelPointStyles[i], { boxHeight: l, boxWidth: c } = o, h = ft(o.bodyFont), u = Ni(this, "left", o), d = n.x(u), f = l < h.lineHeight ? (h.lineHeight - l) / 2 : 0, g = e.y + f;
    if (o.usePointStyle) {
      const p = {
        radius: Math.min(c, l) / 2,
        pointStyle: a.pointStyle,
        rotation: a.rotation,
        borderWidth: 1
      }, m = n.leftForLtr(d, c) + c / 2, b = g + l / 2;
      t.strokeStyle = o.multiKeyBackground, t.fillStyle = o.multiKeyBackground, Ys(t, p, m, b), t.strokeStyle = r.borderColor, t.fillStyle = r.backgroundColor, Ys(t, p, m, b);
    } else {
      t.lineWidth = U(r.borderWidth) ? Math.max(...Object.values(r.borderWidth)) : r.borderWidth || 1, t.strokeStyle = r.borderColor, t.setLineDash(r.borderDash || []), t.lineDashOffset = r.borderDashOffset || 0;
      const p = n.leftForLtr(d, c), m = n.leftForLtr(n.xPlus(d, 1), c - 2), b = Ae(r.borderRadius);
      Object.values(b).some((_) => _ !== 0) ? (t.beginPath(), t.fillStyle = o.multiKeyBackground, mi(t, {
        x: p,
        y: g,
        w: c,
        h: l,
        radius: b
      }), t.fill(), t.stroke(), t.fillStyle = r.backgroundColor, t.beginPath(), mi(t, {
        x: m,
        y: g + 1,
        w: c - 2,
        h: l - 2,
        radius: b
      }), t.fill()) : (t.fillStyle = o.multiKeyBackground, t.fillRect(p, g, c, l), t.strokeRect(p, g, c, l), t.fillStyle = r.backgroundColor, t.fillRect(m, g + 1, c - 2, l - 2));
    }
    t.fillStyle = this.labelTextColors[i];
  }
  drawBody(t, e, i) {
    const { body: n } = this, { bodySpacing: o, bodyAlign: r, displayColors: a, boxHeight: l, boxWidth: c, boxPadding: h } = i, u = ft(i.bodyFont);
    let d = u.lineHeight, f = 0;
    const g = Be(i.rtl, this.x, this.width), p = function(A) {
      e.fillText(A, g.x(t.x + f), t.y + d / 2), t.y += d + o;
    }, m = g.textAlign(r);
    let b, _, k, M, S, O, C;
    for (e.textAlign = r, e.textBaseline = "middle", e.font = u.string, t.x = Ni(this, m, i), e.fillStyle = i.bodyColor, Z(this.beforeBody, p), f = a && m !== "right" ? r === "center" ? c / 2 + h : c + 2 + h : 0, M = 0, O = n.length; M < O; ++M) {
      for (b = n[M], _ = this.labelTextColors[M], e.fillStyle = _, Z(b.before, p), k = b.lines, a && k.length && (this._drawColorBox(e, t, M, g, i), d = Math.max(u.lineHeight, l)), S = 0, C = k.length; S < C; ++S)
        p(k[S]), d = u.lineHeight;
      Z(b.after, p);
    }
    f = 0, d = u.lineHeight, Z(this.afterBody, p), t.y -= o;
  }
  drawFooter(t, e, i) {
    const n = this.footer, o = n.length;
    let r, a;
    if (o) {
      const l = Be(i.rtl, this.x, this.width);
      for (t.x = Ni(this, i.footerAlign, i), t.y += i.footerMarginTop, e.textAlign = l.textAlign(i.footerAlign), e.textBaseline = "middle", r = ft(i.footerFont), e.fillStyle = i.footerColor, e.font = r.string, a = 0; a < o; ++a)
        e.fillText(n[a], l.x(t.x), t.y + r.lineHeight / 2), t.y += r.lineHeight + i.footerSpacing;
    }
  }
  drawBackground(t, e, i, n) {
    const { xAlign: o, yAlign: r } = this, { x: a, y: l } = t, { width: c, height: h } = i, { topLeft: u, topRight: d, bottomLeft: f, bottomRight: g } = Ae(n.cornerRadius);
    e.fillStyle = n.backgroundColor, e.strokeStyle = n.borderColor, e.lineWidth = n.borderWidth, e.beginPath(), e.moveTo(a + u, l), r === "top" && this.drawCaret(t, e, i, n), e.lineTo(a + c - d, l), e.quadraticCurveTo(a + c, l, a + c, l + d), r === "center" && o === "right" && this.drawCaret(t, e, i, n), e.lineTo(a + c, l + h - g), e.quadraticCurveTo(a + c, l + h, a + c - g, l + h), r === "bottom" && this.drawCaret(t, e, i, n), e.lineTo(a + f, l + h), e.quadraticCurveTo(a, l + h, a, l + h - f), r === "center" && o === "left" && this.drawCaret(t, e, i, n), e.lineTo(a, l + u), e.quadraticCurveTo(a, l, a + u, l), e.closePath(), e.fill(), n.borderWidth > 0 && e.stroke();
  }
  _updateAnimationTarget(t) {
    const e = this.chart, i = this.$animations, n = i && i.x, o = i && i.y;
    if (n || o) {
      const r = si[t.position].call(this, this._active, this._eventPosition);
      if (!r)
        return;
      const a = this._size = Ko(this, t), l = Object.assign({}, r, this._size), c = Xo(e, t, l), h = Go(t, l, c, e);
      (n._to !== h.x || o._to !== h.y) && (this.xAlign = c.xAlign, this.yAlign = c.yAlign, this.width = a.width, this.height = a.height, this.caretX = r.x, this.caretY = r.y, this._resolveAnimations().update(this, h));
    }
  }
  _willRender() {
    return !!this.opacity;
  }
  draw(t) {
    const e = this.options.setContext(this.getContext());
    let i = this.opacity;
    if (!i)
      return;
    this._updateAnimationTarget(e);
    const n = {
      width: this.width,
      height: this.height
    }, o = {
      x: this.x,
      y: this.y
    };
    i = Math.abs(i) < 1e-3 ? 0 : i;
    const r = Mt(e.padding), a = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
    e.enabled && a && (t.save(), t.globalAlpha = i, this.drawBackground(o, t, n, e), Yr(t, e.textDirection), o.y += r.top, this.drawTitle(o, t, e), this.drawBody(o, t, e), this.drawFooter(o, t, e), Kr(t, e.textDirection), t.restore());
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(t, e) {
    const i = this._active, n = t.map(({ datasetIndex: a, index: l }) => {
      const c = this.chart.getDatasetMeta(a);
      if (!c)
        throw new Error("Cannot find a dataset at index " + a);
      return {
        datasetIndex: a,
        element: c.data[l],
        index: l
      };
    }), o = !Zi(i, n), r = this._positionChanged(n, e);
    (o || r) && (this._active = n, this._eventPosition = e, this._ignoreReplayEvents = !0, this.update(!0));
  }
  handleEvent(t, e, i = !0) {
    if (e && this._ignoreReplayEvents)
      return !1;
    this._ignoreReplayEvents = !1;
    const n = this.options, o = this._active || [], r = this._getActiveElements(t, o, e, i), a = this._positionChanged(r, t), l = e || !Zi(r, o) || a;
    return l && (this._active = r, (n.enabled || n.external) && (this._eventPosition = {
      x: t.x,
      y: t.y
    }, this.update(!0, e))), l;
  }
  _getActiveElements(t, e, i, n) {
    const o = this.options;
    if (t.type === "mouseout")
      return [];
    if (!n)
      return e.filter((a) => this.chart.data.datasets[a.datasetIndex] && this.chart.getDatasetMeta(a.datasetIndex).controller.getParsed(a.index) !== void 0);
    const r = this.chart.getElementsAtEventForMode(t, o.mode, o, i);
    return o.reverse && r.reverse(), r;
  }
  _positionChanged(t, e) {
    const { caretX: i, caretY: n, options: o } = this, r = si[o.position].call(this, t, e);
    return r !== !1 && (i !== r.x || n !== r.y);
  }
}
P(tn, "positioners", si);
var Xd = {
  id: "tooltip",
  _element: tn,
  positioners: si,
  afterInit(s, t, e) {
    e && (s.tooltip = new tn({
      chart: s,
      options: e
    }));
  },
  beforeUpdate(s, t, e) {
    s.tooltip && s.tooltip.initialize(e);
  },
  reset(s, t, e) {
    s.tooltip && s.tooltip.initialize(e);
  },
  afterDraw(s) {
    const t = s.tooltip;
    if (t && t._willRender()) {
      const e = {
        tooltip: t
      };
      if (s.notifyPlugins("beforeTooltipDraw", {
        ...e,
        cancelable: !0
      }) === !1)
        return;
      t.draw(s.ctx), s.notifyPlugins("afterTooltipDraw", e);
    }
  },
  afterEvent(s, t) {
    if (s.tooltip) {
      const e = t.replay;
      s.tooltip.handleEvent(t.event, e, t.inChartArea) && (t.changed = !0);
    }
  },
  defaults: {
    enabled: !0,
    external: null,
    position: "average",
    backgroundColor: "rgba(0,0,0,0.8)",
    titleColor: "#fff",
    titleFont: {
      weight: "bold"
    },
    titleSpacing: 2,
    titleMarginBottom: 6,
    titleAlign: "left",
    bodyColor: "#fff",
    bodySpacing: 2,
    bodyFont: {},
    bodyAlign: "left",
    footerColor: "#fff",
    footerSpacing: 2,
    footerMarginTop: 6,
    footerFont: {
      weight: "bold"
    },
    footerAlign: "left",
    padding: 6,
    caretPadding: 2,
    caretSize: 5,
    cornerRadius: 6,
    boxHeight: (s, t) => t.bodyFont.size,
    boxWidth: (s, t) => t.bodyFont.size,
    multiKeyBackground: "#fff",
    displayColors: !0,
    boxPadding: 0,
    borderColor: "rgba(0,0,0,0)",
    borderWidth: 0,
    animation: {
      duration: 400,
      easing: "easeOutQuart"
    },
    animations: {
      numbers: {
        type: "number",
        properties: [
          "x",
          "y",
          "width",
          "height",
          "caretX",
          "caretY"
        ]
      },
      opacity: {
        easing: "linear",
        duration: 200
      }
    },
    callbacks: xa
  },
  defaultRoutes: {
    bodyFont: "font",
    footerFont: "font",
    titleFont: "font"
  },
  descriptors: {
    _scriptable: (s) => s !== "filter" && s !== "itemSort" && s !== "external",
    _indexable: !1,
    callbacks: {
      _scriptable: !1,
      _indexable: !1
    },
    animation: {
      _fallback: !1
    },
    animations: {
      _fallback: "animation"
    }
  },
  additionalOptionScopes: [
    "interaction"
  ]
}, Gd = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  Colors: ld,
  Decimation: dd,
  Filler: Dd,
  Legend: zd,
  SubTitle: $d,
  Title: Hd,
  Tooltip: Xd
});
const Qd = (s, t, e, i) => (typeof t == "string" ? (e = s.push(t) - 1, i.unshift({
  index: e,
  label: t
})) : isNaN(t) && (e = null), e);
function Jd(s, t, e, i) {
  const n = s.indexOf(t);
  if (n === -1)
    return Qd(s, t, e, i);
  const o = s.lastIndexOf(t);
  return n !== o ? e : n;
}
const Zd = (s, t) => s === null ? null : bt(Math.round(s), 0, t);
function Zo(s) {
  const t = this.getLabels();
  return s >= 0 && s < t.length ? t[s] : s;
}
class en extends De {
  constructor(t) {
    super(t), this._startValue = void 0, this._valueRange = 0, this._addedLabels = [];
  }
  init(t) {
    const e = this._addedLabels;
    if (e.length) {
      const i = this.getLabels();
      for (const { index: n, label: o } of e)
        i[n] === o && i.splice(n, 1);
      this._addedLabels = [];
    }
    super.init(t);
  }
  parse(t, e) {
    if (j(t))
      return null;
    const i = this.getLabels();
    return e = isFinite(e) && i[e] === t ? e : Jd(i, t, W(e, t), this._addedLabels), Zd(e, i.length - 1);
  }
  determineDataLimits() {
    const { minDefined: t, maxDefined: e } = this.getUserBounds();
    let { min: i, max: n } = this.getMinMax(!0);
    this.options.bounds === "ticks" && (t || (i = 0), e || (n = this.getLabels().length - 1)), this.min = i, this.max = n;
  }
  buildTicks() {
    const t = this.min, e = this.max, i = this.options.offset, n = [];
    let o = this.getLabels();
    o = t === 0 && e === o.length - 1 ? o : o.slice(t, e + 1), this._valueRange = Math.max(o.length - (i ? 0 : 1), 1), this._startValue = this.min - (i ? 0.5 : 0);
    for (let r = t; r <= e; r++)
      n.push({
        value: r
      });
    return n;
  }
  getLabelForValue(t) {
    return Zo.call(this, t);
  }
  configure() {
    super.configure(), this.isHorizontal() || (this._reversePixels = !this._reversePixels);
  }
  getPixelForValue(t) {
    return typeof t != "number" && (t = this.parse(t)), t === null ? NaN : this.getPixelForDecimal((t - this._startValue) / this._valueRange);
  }
  getPixelForTick(t) {
    const e = this.ticks;
    return t < 0 || t > e.length - 1 ? null : this.getPixelForValue(e[t].value);
  }
  getValueForPixel(t) {
    return Math.round(this._startValue + this.getDecimalForPixel(t) * this._valueRange);
  }
  getBasePixel() {
    return this.bottom;
  }
}
P(en, "id", "category"), P(en, "defaults", {
  ticks: {
    callback: Zo
  }
});
function tf(s, t) {
  const e = [], { bounds: n, step: o, min: r, max: a, precision: l, count: c, maxTicks: h, maxDigits: u, includeBounds: d } = s, f = o || 1, g = h - 1, { min: p, max: m } = t, b = !j(r), _ = !j(a), k = !j(c), M = (m - p) / (u + 1);
  let S = Yn((m - p) / g / f) * f, O, C, A, L;
  if (S < 1e-14 && !b && !_)
    return [
      {
        value: p
      },
      {
        value: m
      }
    ];
  L = Math.ceil(m / S) - Math.floor(p / S), L > g && (S = Yn(L * S / g / f) * f), j(l) || (O = Math.pow(10, l), S = Math.ceil(S * O) / O), n === "ticks" ? (C = Math.floor(p / S) * S, A = Math.ceil(m / S) * S) : (C = p, A = m), b && _ && o && Ul((a - r) / o, S / 1e3) ? (L = Math.round(Math.min((a - r) / S, h)), S = (a - r) / L, C = r, A = a) : k ? (C = b ? r : C, A = _ ? a : A, L = c - 1, S = (A - C) / L) : (L = (A - C) / S, ai(L, Math.round(L), S / 1e3) ? L = Math.round(L) : L = Math.ceil(L));
  const H = Math.max(Kn(S), Kn(C));
  O = Math.pow(10, j(l) ? H : l), C = Math.round(C * O) / O, A = Math.round(A * O) / O;
  let q = 0;
  for (b && (d && C !== r ? (e.push({
    value: r
  }), C < r && q++, ai(Math.round((C + q * S) * O) / O, r, tr(r, M, s)) && q++) : C < r && q++); q < L; ++q) {
    const V = Math.round((C + q * S) * O) / O;
    if (_ && V > a)
      break;
    e.push({
      value: V
    });
  }
  return _ && d && A !== a ? e.length && ai(e[e.length - 1].value, a, tr(a, M, s)) ? e[e.length - 1].value = a : e.push({
    value: a
  }) : (!_ || A === a) && e.push({
    value: A
  }), e;
}
function tr(s, t, { horizontal: e, minRotation: i }) {
  const n = $t(i), o = (e ? Math.sin(n) : Math.cos(n)) || 1e-3, r = 0.75 * t * ("" + s).length;
  return Math.min(t / o, r);
}
class rs extends De {
  constructor(t) {
    super(t), this.start = void 0, this.end = void 0, this._startValue = void 0, this._endValue = void 0, this._valueRange = 0;
  }
  parse(t, e) {
    return j(t) || (typeof t == "number" || t instanceof Number) && !isFinite(+t) ? null : +t;
  }
  handleTickRangeOptions() {
    const { beginAtZero: t } = this.options, { minDefined: e, maxDefined: i } = this.getUserBounds();
    let { min: n, max: o } = this;
    const r = (l) => n = e ? n : l, a = (l) => o = i ? o : l;
    if (t) {
      const l = Kt(n), c = Kt(o);
      l < 0 && c < 0 ? a(0) : l > 0 && c > 0 && r(0);
    }
    if (n === o) {
      let l = o === 0 ? 1 : Math.abs(o * 0.05);
      a(o + l), t || r(n - l);
    }
    this.min = n, this.max = o;
  }
  getTickLimit() {
    const t = this.options.ticks;
    let { maxTicksLimit: e, stepSize: i } = t, n;
    return i ? (n = Math.ceil(this.max / i) - Math.floor(this.min / i) + 1, n > 1e3 && (console.warn(`scales.${this.id}.ticks.stepSize: ${i} would result generating up to ${n} ticks. Limiting to 1000.`), n = 1e3)) : (n = this.computeTickLimit(), e = e || 11), e && (n = Math.min(e, n)), n;
  }
  computeTickLimit() {
    return Number.POSITIVE_INFINITY;
  }
  buildTicks() {
    const t = this.options, e = t.ticks;
    let i = this.getTickLimit();
    i = Math.max(2, i);
    const n = {
      maxTicks: i,
      bounds: t.bounds,
      min: t.min,
      max: t.max,
      precision: e.precision,
      step: e.stepSize,
      count: e.count,
      maxDigits: this._maxDigits(),
      horizontal: this.isHorizontal(),
      minRotation: e.minRotation || 0,
      includeBounds: e.includeBounds !== !1
    }, o = this._range || this, r = tf(n, o);
    return t.bounds === "ticks" && Er(r, this, "value"), t.reverse ? (r.reverse(), this.start = this.max, this.end = this.min) : (this.start = this.min, this.end = this.max), r;
  }
  configure() {
    const t = this.ticks;
    let e = this.min, i = this.max;
    if (super.configure(), this.options.offset && t.length) {
      const n = (i - e) / Math.max(t.length - 1, 1) / 2;
      e -= n, i += n;
    }
    this._startValue = e, this._endValue = i, this._valueRange = i - e;
  }
  getLabelForValue(t) {
    return wi(t, this.chart.options.locale, this.options.ticks.format);
  }
}
class sn extends rs {
  determineDataLimits() {
    const { min: t, max: e } = this.getMinMax(!0);
    this.min = at(t) ? t : 0, this.max = at(e) ? e : 1, this.handleTickRangeOptions();
  }
  computeTickLimit() {
    const t = this.isHorizontal(), e = t ? this.width : this.height, i = $t(this.options.ticks.minRotation), n = (t ? Math.sin(i) : Math.cos(i)) || 1e-3, o = this._resolveTickFontOptions(0);
    return Math.ceil(e / Math.min(40, o.lineHeight / n));
  }
  getPixelForValue(t) {
    return t === null ? NaN : this.getPixelForDecimal((t - this._startValue) / this._valueRange);
  }
  getValueForPixel(t) {
    return this._startValue + this.getDecimalForPixel(t) * this._valueRange;
  }
}
P(sn, "id", "linear"), P(sn, "defaults", {
  ticks: {
    callback: ls.formatters.numeric
  }
});
const _i = (s) => Math.floor(ue(s)), we = (s, t) => Math.pow(10, _i(s) + t);
function er(s) {
  return s / Math.pow(10, _i(s)) === 1;
}
function ir(s, t, e) {
  const i = Math.pow(10, e), n = Math.floor(s / i);
  return Math.ceil(t / i) - n;
}
function ef(s, t) {
  const e = t - s;
  let i = _i(e);
  for (; ir(s, t, i) > 10; )
    i++;
  for (; ir(s, t, i) < 10; )
    i--;
  return Math.min(i, _i(s));
}
function sf(s, { min: t, max: e }) {
  t = Dt(s.min, t);
  const i = [], n = _i(t);
  let o = ef(t, e), r = o < 0 ? Math.pow(10, Math.abs(o)) : 1;
  const a = Math.pow(10, o), l = n > o ? Math.pow(10, n) : 0, c = Math.round((t - l) * r) / r, h = Math.floor((t - l) / a / 10) * a * 10;
  let u = Math.floor((c - h) / Math.pow(10, o)), d = Dt(s.min, Math.round((l + h + u * Math.pow(10, o)) * r) / r);
  for (; d < e; )
    i.push({
      value: d,
      major: er(d),
      significand: u
    }), u >= 10 ? u = u < 15 ? 15 : 20 : u++, u >= 20 && (o++, u = 2, r = o >= 0 ? 1 : r), d = Math.round((l + h + u * Math.pow(10, o)) * r) / r;
  const f = Dt(s.max, d);
  return i.push({
    value: f,
    major: er(f),
    significand: u
  }), i;
}
class nn extends De {
  constructor(t) {
    super(t), this.start = void 0, this.end = void 0, this._startValue = void 0, this._valueRange = 0;
  }
  parse(t, e) {
    const i = rs.prototype.parse.apply(this, [
      t,
      e
    ]);
    if (i === 0) {
      this._zero = !0;
      return;
    }
    return at(i) && i > 0 ? i : null;
  }
  determineDataLimits() {
    const { min: t, max: e } = this.getMinMax(!0);
    this.min = at(t) ? Math.max(0, t) : null, this.max = at(e) ? Math.max(0, e) : null, this.options.beginAtZero && (this._zero = !0), this._zero && this.min !== this._suggestedMin && !at(this._userMin) && (this.min = t === we(this.min, 0) ? we(this.min, -1) : we(this.min, 0)), this.handleTickRangeOptions();
  }
  handleTickRangeOptions() {
    const { minDefined: t, maxDefined: e } = this.getUserBounds();
    let i = this.min, n = this.max;
    const o = (a) => i = t ? i : a, r = (a) => n = e ? n : a;
    i === n && (i <= 0 ? (o(1), r(10)) : (o(we(i, -1)), r(we(n, 1)))), i <= 0 && o(we(n, -1)), n <= 0 && r(we(i, 1)), this.min = i, this.max = n;
  }
  buildTicks() {
    const t = this.options, e = {
      min: this._userMin,
      max: this._userMax
    }, i = sf(e, this);
    return t.bounds === "ticks" && Er(i, this, "value"), t.reverse ? (i.reverse(), this.start = this.max, this.end = this.min) : (this.start = this.min, this.end = this.max), i;
  }
  getLabelForValue(t) {
    return t === void 0 ? "0" : wi(t, this.chart.options.locale, this.options.ticks.format);
  }
  configure() {
    const t = this.min;
    super.configure(), this._startValue = ue(t), this._valueRange = ue(this.max) - ue(t);
  }
  getPixelForValue(t) {
    return (t === void 0 || t === 0) && (t = this.min), t === null || isNaN(t) ? NaN : this.getPixelForDecimal(t === this.min ? 0 : (ue(t) - this._startValue) / this._valueRange);
  }
  getValueForPixel(t) {
    const e = this.getDecimalForPixel(t);
    return Math.pow(10, this._startValue + e * this._valueRange);
  }
}
P(nn, "id", "logarithmic"), P(nn, "defaults", {
  ticks: {
    callback: ls.formatters.logarithmic,
    major: {
      enabled: !0
    }
  }
});
function on(s) {
  const t = s.ticks;
  if (t.display && s.display) {
    const e = Mt(t.backdropPadding);
    return W(t.font && t.font.size, nt.font.size) + e.height;
  }
  return 0;
}
function nf(s, t, e) {
  return e = st(e) ? e : [
    e
  ], {
    w: cc(s, t.string, e),
    h: e.length * t.lineHeight
  };
}
function sr(s, t, e, i, n) {
  return s === i || s === n ? {
    start: t - e / 2,
    end: t + e / 2
  } : s < i || s > n ? {
    start: t - e,
    end: t
  } : {
    start: t,
    end: t + e
  };
}
function of(s) {
  const t = {
    l: s.left + s._padding.left,
    r: s.right - s._padding.right,
    t: s.top + s._padding.top,
    b: s.bottom - s._padding.bottom
  }, e = Object.assign({}, t), i = [], n = [], o = s._pointLabels.length, r = s.options.pointLabels, a = r.centerPointLabels ? K / o : 0;
  for (let l = 0; l < o; l++) {
    const c = r.setContext(s.getPointLabelContext(l));
    n[l] = c.padding;
    const h = s.getPointPosition(l, s.drawingArea + n[l], a), u = ft(c.font), d = nf(s.ctx, u, s._pointLabels[l]);
    i[l] = d;
    const f = wt(s.getIndexAngle(l) + a), g = Math.round(mn(f)), p = sr(g, h.x, d.w, 0, 180), m = sr(g, h.y, d.h, 90, 270);
    rf(e, t, f, p, m);
  }
  s.setCenterPoint(t.l - e.l, e.r - t.r, t.t - e.t, e.b - t.b), s._pointLabelItems = cf(s, i, n);
}
function rf(s, t, e, i, n) {
  const o = Math.abs(Math.sin(e)), r = Math.abs(Math.cos(e));
  let a = 0, l = 0;
  i.start < t.l ? (a = (t.l - i.start) / o, s.l = Math.min(s.l, t.l - a)) : i.end > t.r && (a = (i.end - t.r) / o, s.r = Math.max(s.r, t.r + a)), n.start < t.t ? (l = (t.t - n.start) / r, s.t = Math.min(s.t, t.t - l)) : n.end > t.b && (l = (n.end - t.b) / r, s.b = Math.max(s.b, t.b + l));
}
function af(s, t, e) {
  const i = s.drawingArea, { extra: n, additionalAngle: o, padding: r, size: a } = e, l = s.getPointPosition(t, i + n + r, o), c = Math.round(mn(wt(l.angle + lt))), h = df(l.y, a.h, c), u = hf(c), d = uf(l.x, a.w, u);
  return {
    visible: !0,
    x: l.x,
    y: h,
    textAlign: u,
    left: d,
    top: h,
    right: d + a.w,
    bottom: h + a.h
  };
}
function lf(s, t) {
  if (!t)
    return !0;
  const { left: e, top: i, right: n, bottom: o } = s;
  return !(ne({
    x: e,
    y: i
  }, t) || ne({
    x: e,
    y: o
  }, t) || ne({
    x: n,
    y: i
  }, t) || ne({
    x: n,
    y: o
  }, t));
}
function cf(s, t, e) {
  const i = [], n = s._pointLabels.length, o = s.options, { centerPointLabels: r, display: a } = o.pointLabels, l = {
    extra: on(o) / 2,
    additionalAngle: r ? K / n : 0
  };
  let c;
  for (let h = 0; h < n; h++) {
    l.padding = e[h], l.size = t[h];
    const u = af(s, h, l);
    i.push(u), a === "auto" && (u.visible = lf(u, c), u.visible && (c = u));
  }
  return i;
}
function hf(s) {
  return s === 0 || s === 180 ? "center" : s < 180 ? "left" : "right";
}
function uf(s, t, e) {
  return e === "right" ? s -= t : e === "center" && (s -= t / 2), s;
}
function df(s, t, e) {
  return e === 90 || e === 270 ? s -= t / 2 : (e > 270 || e < 90) && (s -= t), s;
}
function ff(s, t, e) {
  const { left: i, top: n, right: o, bottom: r } = e, { backdropColor: a } = t;
  if (!j(a)) {
    const l = Ae(t.borderRadius), c = Mt(t.backdropPadding);
    s.fillStyle = a;
    const h = i - c.left, u = n - c.top, d = o - i + c.width, f = r - n + c.height;
    Object.values(l).some((g) => g !== 0) ? (s.beginPath(), mi(s, {
      x: h,
      y: u,
      w: d,
      h: f,
      radius: l
    }), s.fill()) : s.fillRect(h, u, d, f);
  }
}
function gf(s, t) {
  const { ctx: e, options: { pointLabels: i } } = s;
  for (let n = t - 1; n >= 0; n--) {
    const o = s._pointLabelItems[n];
    if (!o.visible)
      continue;
    const r = i.setContext(s.getPointLabelContext(n));
    ff(e, r, o);
    const a = ft(r.font), { x: l, y: c, textAlign: h } = o;
    Oe(e, s._pointLabels[n], l, c + a.lineHeight / 2, a, {
      color: r.color,
      textAlign: h,
      textBaseline: "middle"
    });
  }
}
function va(s, t, e, i) {
  const { ctx: n } = s;
  if (e)
    n.arc(s.xCenter, s.yCenter, t, 0, it);
  else {
    let o = s.getPointPosition(0, t);
    n.moveTo(o.x, o.y);
    for (let r = 1; r < i; r++)
      o = s.getPointPosition(r, t), n.lineTo(o.x, o.y);
  }
}
function pf(s, t, e, i, n) {
  const o = s.ctx, r = t.circular, { color: a, lineWidth: l } = t;
  !r && !i || !a || !l || e < 0 || (o.save(), o.strokeStyle = a, o.lineWidth = l, o.setLineDash(n.dash || []), o.lineDashOffset = n.dashOffset, o.beginPath(), va(s, e, r, i), o.closePath(), o.stroke(), o.restore());
}
function mf(s, t, e) {
  return be(s, {
    label: e,
    index: t,
    type: "pointLabel"
  });
}
class ni extends rs {
  constructor(t) {
    super(t), this.xCenter = void 0, this.yCenter = void 0, this.drawingArea = void 0, this._pointLabels = [], this._pointLabelItems = [];
  }
  setDimensions() {
    const t = this._padding = Mt(on(this.options) / 2), e = this.width = this.maxWidth - t.width, i = this.height = this.maxHeight - t.height;
    this.xCenter = Math.floor(this.left + e / 2 + t.left), this.yCenter = Math.floor(this.top + i / 2 + t.top), this.drawingArea = Math.floor(Math.min(e, i) / 2);
  }
  determineDataLimits() {
    const { min: t, max: e } = this.getMinMax(!1);
    this.min = at(t) && !isNaN(t) ? t : 0, this.max = at(e) && !isNaN(e) ? e : 0, this.handleTickRangeOptions();
  }
  computeTickLimit() {
    return Math.ceil(this.drawingArea / on(this.options));
  }
  generateTickLabels(t) {
    rs.prototype.generateTickLabels.call(this, t), this._pointLabels = this.getLabels().map((e, i) => {
      const n = et(this.options.pointLabels.callback, [
        e,
        i
      ], this);
      return n || n === 0 ? n : "";
    }).filter((e, i) => this.chart.getDataVisibility(i));
  }
  fit() {
    const t = this.options;
    t.display && t.pointLabels.display ? of(this) : this.setCenterPoint(0, 0, 0, 0);
  }
  setCenterPoint(t, e, i, n) {
    this.xCenter += Math.floor((t - e) / 2), this.yCenter += Math.floor((i - n) / 2), this.drawingArea -= Math.min(this.drawingArea / 2, Math.max(t, e, i, n));
  }
  getIndexAngle(t) {
    const e = it / (this._pointLabels.length || 1), i = this.options.startAngle || 0;
    return wt(t * e + $t(i));
  }
  getDistanceFromCenterForValue(t) {
    if (j(t))
      return NaN;
    const e = this.drawingArea / (this.max - this.min);
    return this.options.reverse ? (this.max - t) * e : (t - this.min) * e;
  }
  getValueForDistanceFromCenter(t) {
    if (j(t))
      return NaN;
    const e = t / (this.drawingArea / (this.max - this.min));
    return this.options.reverse ? this.max - e : this.min + e;
  }
  getPointLabelContext(t) {
    const e = this._pointLabels || [];
    if (t >= 0 && t < e.length) {
      const i = e[t];
      return mf(this.getContext(), t, i);
    }
  }
  getPointPosition(t, e, i = 0) {
    const n = this.getIndexAngle(t) - lt + i;
    return {
      x: Math.cos(n) * e + this.xCenter,
      y: Math.sin(n) * e + this.yCenter,
      angle: n
    };
  }
  getPointPositionForValue(t, e) {
    return this.getPointPosition(t, this.getDistanceFromCenterForValue(e));
  }
  getBasePosition(t) {
    return this.getPointPositionForValue(t || 0, this.getBaseValue());
  }
  getPointLabelPosition(t) {
    const { left: e, top: i, right: n, bottom: o } = this._pointLabelItems[t];
    return {
      left: e,
      top: i,
      right: n,
      bottom: o
    };
  }
  drawBackground() {
    const { backgroundColor: t, grid: { circular: e } } = this.options;
    if (t) {
      const i = this.ctx;
      i.save(), i.beginPath(), va(this, this.getDistanceFromCenterForValue(this._endValue), e, this._pointLabels.length), i.closePath(), i.fillStyle = t, i.fill(), i.restore();
    }
  }
  drawGrid() {
    const t = this.ctx, e = this.options, { angleLines: i, grid: n, border: o } = e, r = this._pointLabels.length;
    let a, l, c;
    if (e.pointLabels.display && gf(this, r), n.display && this.ticks.forEach((h, u) => {
      if (u !== 0 || u === 0 && this.min < 0) {
        l = this.getDistanceFromCenterForValue(h.value);
        const d = this.getContext(u), f = n.setContext(d), g = o.setContext(d);
        pf(this, f, l, r, g);
      }
    }), i.display) {
      for (t.save(), a = r - 1; a >= 0; a--) {
        const h = i.setContext(this.getPointLabelContext(a)), { color: u, lineWidth: d } = h;
        !d || !u || (t.lineWidth = d, t.strokeStyle = u, t.setLineDash(h.borderDash), t.lineDashOffset = h.borderDashOffset, l = this.getDistanceFromCenterForValue(e.reverse ? this.min : this.max), c = this.getPointPosition(a, l), t.beginPath(), t.moveTo(this.xCenter, this.yCenter), t.lineTo(c.x, c.y), t.stroke());
      }
      t.restore();
    }
  }
  drawBorder() {
  }
  drawLabels() {
    const t = this.ctx, e = this.options, i = e.ticks;
    if (!i.display)
      return;
    const n = this.getIndexAngle(0);
    let o, r;
    t.save(), t.translate(this.xCenter, this.yCenter), t.rotate(n), t.textAlign = "center", t.textBaseline = "middle", this.ticks.forEach((a, l) => {
      if (l === 0 && this.min >= 0 && !e.reverse)
        return;
      const c = i.setContext(this.getContext(l)), h = ft(c.font);
      if (o = this.getDistanceFromCenterForValue(this.ticks[l].value), c.showLabelBackdrop) {
        t.font = h.string, r = t.measureText(a.label).width, t.fillStyle = c.backdropColor;
        const u = Mt(c.backdropPadding);
        t.fillRect(-r / 2 - u.left, -o - h.size / 2 - u.top, r + u.width, h.size + u.height);
      }
      Oe(t, a.label, 0, -o, h, {
        color: c.color,
        strokeColor: c.textStrokeColor,
        strokeWidth: c.textStrokeWidth
      });
    }), t.restore();
  }
  drawTitle() {
  }
}
P(ni, "id", "radialLinear"), P(ni, "defaults", {
  display: !0,
  animate: !0,
  position: "chartArea",
  angleLines: {
    display: !0,
    lineWidth: 1,
    borderDash: [],
    borderDashOffset: 0
  },
  grid: {
    circular: !1
  },
  startAngle: 0,
  ticks: {
    showLabelBackdrop: !0,
    callback: ls.formatters.numeric
  },
  pointLabels: {
    backdropColor: void 0,
    backdropPadding: 2,
    display: !0,
    font: {
      size: 10
    },
    callback(t) {
      return t;
    },
    padding: 5,
    centerPointLabels: !1
  }
}), P(ni, "defaultRoutes", {
  "angleLines.color": "borderColor",
  "pointLabels.color": "color",
  "ticks.color": "color"
}), P(ni, "descriptors", {
  angleLines: {
    _fallback: "grid"
  }
});
const gs = {
  millisecond: {
    common: !0,
    size: 1,
    steps: 1e3
  },
  second: {
    common: !0,
    size: 1e3,
    steps: 60
  },
  minute: {
    common: !0,
    size: 6e4,
    steps: 60
  },
  hour: {
    common: !0,
    size: 36e5,
    steps: 24
  },
  day: {
    common: !0,
    size: 864e5,
    steps: 30
  },
  week: {
    common: !1,
    size: 6048e5,
    steps: 4
  },
  month: {
    common: !0,
    size: 2628e6,
    steps: 12
  },
  quarter: {
    common: !1,
    size: 7884e6,
    steps: 4
  },
  year: {
    common: !0,
    size: 3154e7
  }
}, Tt = /* @__PURE__ */ Object.keys(gs);
function nr(s, t) {
  return s - t;
}
function or(s, t) {
  if (j(t))
    return null;
  const e = s._adapter, { parser: i, round: n, isoWeekday: o } = s._parseOpts;
  let r = t;
  return typeof i == "function" && (r = i(r)), at(r) || (r = typeof i == "string" ? e.parse(r, i) : e.parse(r)), r === null ? null : (n && (r = n === "week" && (He(o) || o === !0) ? e.startOf(r, "isoWeek", o) : e.startOf(r, n)), +r);
}
function rr(s, t, e, i) {
  const n = Tt.length;
  for (let o = Tt.indexOf(s); o < n - 1; ++o) {
    const r = gs[Tt[o]], a = r.steps ? r.steps : Number.MAX_SAFE_INTEGER;
    if (r.common && Math.ceil((e - t) / (a * r.size)) <= i)
      return Tt[o];
  }
  return Tt[n - 1];
}
function bf(s, t, e, i, n) {
  for (let o = Tt.length - 1; o >= Tt.indexOf(e); o--) {
    const r = Tt[o];
    if (gs[r].common && s._adapter.diff(n, i, r) >= t - 1)
      return r;
  }
  return Tt[e ? Tt.indexOf(e) : 0];
}
function _f(s) {
  for (let t = Tt.indexOf(s) + 1, e = Tt.length; t < e; ++t)
    if (gs[Tt[t]].common)
      return Tt[t];
}
function ar(s, t, e) {
  if (!e)
    s[t] = !0;
  else if (e.length) {
    const { lo: i, hi: n } = bn(e, t), o = e[i] >= t ? e[i] : e[n];
    s[o] = !0;
  }
}
function yf(s, t, e, i) {
  const n = s._adapter, o = +n.startOf(t[0].value, i), r = t[t.length - 1].value;
  let a, l;
  for (a = o; a <= r; a = +n.add(a, 1, i))
    l = e[a], l >= 0 && (t[l].major = !0);
  return t;
}
function lr(s, t, e) {
  const i = [], n = {}, o = t.length;
  let r, a;
  for (r = 0; r < o; ++r)
    a = t[r], n[a] = r, i.push({
      value: a,
      major: !1
    });
  return o === 0 || !e ? i : yf(s, i, n, e);
}
class yi extends De {
  constructor(t) {
    super(t), this._cache = {
      data: [],
      labels: [],
      all: []
    }, this._unit = "day", this._majorUnit = void 0, this._offsets = {}, this._normalized = !1, this._parseOpts = void 0;
  }
  init(t, e = {}) {
    const i = t.time || (t.time = {}), n = this._adapter = new Ph._date(t.adapters.date);
    n.init(e), ri(i.displayFormats, n.formats()), this._parseOpts = {
      parser: i.parser,
      round: i.round,
      isoWeekday: i.isoWeekday
    }, super.init(t), this._normalized = e.normalized;
  }
  parse(t, e) {
    return t === void 0 ? null : or(this, t);
  }
  beforeLayout() {
    super.beforeLayout(), this._cache = {
      data: [],
      labels: [],
      all: []
    };
  }
  determineDataLimits() {
    const t = this.options, e = this._adapter, i = t.time.unit || "day";
    let { min: n, max: o, minDefined: r, maxDefined: a } = this.getUserBounds();
    function l(c) {
      !r && !isNaN(c.min) && (n = Math.min(n, c.min)), !a && !isNaN(c.max) && (o = Math.max(o, c.max));
    }
    (!r || !a) && (l(this._getLabelBounds()), (t.bounds !== "ticks" || t.ticks.source !== "labels") && l(this.getMinMax(!1))), n = at(n) && !isNaN(n) ? n : +e.startOf(Date.now(), i), o = at(o) && !isNaN(o) ? o : +e.endOf(Date.now(), i) + 1, this.min = Math.min(n, o - 1), this.max = Math.max(n + 1, o);
  }
  _getLabelBounds() {
    const t = this.getLabelTimestamps();
    let e = Number.POSITIVE_INFINITY, i = Number.NEGATIVE_INFINITY;
    return t.length && (e = t[0], i = t[t.length - 1]), {
      min: e,
      max: i
    };
  }
  buildTicks() {
    const t = this.options, e = t.time, i = t.ticks, n = i.source === "labels" ? this.getLabelTimestamps() : this._generate();
    t.bounds === "ticks" && n.length && (this.min = this._userMin || n[0], this.max = this._userMax || n[n.length - 1]);
    const o = this.min, r = this.max, a = Gl(n, o, r);
    return this._unit = e.unit || (i.autoSkip ? rr(e.minUnit, this.min, this.max, this._getLabelCapacity(o)) : bf(this, a.length, e.minUnit, this.min, this.max)), this._majorUnit = !i.major.enabled || this._unit === "year" ? void 0 : _f(this._unit), this.initOffsets(n), t.reverse && a.reverse(), lr(this, a, this._majorUnit);
  }
  afterAutoSkip() {
    this.options.offsetAfterAutoskip && this.initOffsets(this.ticks.map((t) => +t.value));
  }
  initOffsets(t = []) {
    let e = 0, i = 0, n, o;
    this.options.offset && t.length && (n = this.getDecimalForValue(t[0]), t.length === 1 ? e = 1 - n : e = (this.getDecimalForValue(t[1]) - n) / 2, o = this.getDecimalForValue(t[t.length - 1]), t.length === 1 ? i = o : i = (o - this.getDecimalForValue(t[t.length - 2])) / 2);
    const r = t.length < 3 ? 0.5 : 0.25;
    e = bt(e, 0, r), i = bt(i, 0, r), this._offsets = {
      start: e,
      end: i,
      factor: 1 / (e + 1 + i)
    };
  }
  _generate() {
    const t = this._adapter, e = this.min, i = this.max, n = this.options, o = n.time, r = o.unit || rr(o.minUnit, e, i, this._getLabelCapacity(e)), a = W(n.ticks.stepSize, 1), l = r === "week" ? o.isoWeekday : !1, c = He(l) || l === !0, h = {};
    let u = e, d, f;
    if (c && (u = +t.startOf(u, "isoWeek", l)), u = +t.startOf(u, c ? "day" : r), t.diff(i, e, r) > 1e5 * a)
      throw new Error(e + " and " + i + " are too far apart with stepSize of " + a + " " + r);
    const g = n.ticks.source === "data" && this.getDataTimestamps();
    for (d = u, f = 0; d < i; d = +t.add(d, a, r), f++)
      ar(h, d, g);
    return (d === i || n.bounds === "ticks" || f === 1) && ar(h, d, g), Object.keys(h).sort(nr).map((p) => +p);
  }
  getLabelForValue(t) {
    const e = this._adapter, i = this.options.time;
    return i.tooltipFormat ? e.format(t, i.tooltipFormat) : e.format(t, i.displayFormats.datetime);
  }
  format(t, e) {
    const n = this.options.time.displayFormats, o = this._unit, r = e || n[o];
    return this._adapter.format(t, r);
  }
  _tickFormatFunction(t, e, i, n) {
    const o = this.options, r = o.ticks.callback;
    if (r)
      return et(r, [
        t,
        e,
        i
      ], this);
    const a = o.time.displayFormats, l = this._unit, c = this._majorUnit, h = l && a[l], u = c && a[c], d = i[e], f = c && u && d && d.major;
    return this._adapter.format(t, n || (f ? u : h));
  }
  generateTickLabels(t) {
    let e, i, n;
    for (e = 0, i = t.length; e < i; ++e)
      n = t[e], n.label = this._tickFormatFunction(n.value, e, t);
  }
  getDecimalForValue(t) {
    return t === null ? NaN : (t - this.min) / (this.max - this.min);
  }
  getPixelForValue(t) {
    const e = this._offsets, i = this.getDecimalForValue(t);
    return this.getPixelForDecimal((e.start + i) * e.factor);
  }
  getValueForPixel(t) {
    const e = this._offsets, i = this.getDecimalForPixel(t) / e.factor - e.end;
    return this.min + i * (this.max - this.min);
  }
  _getLabelSize(t) {
    const e = this.options.ticks, i = this.ctx.measureText(t).width, n = $t(this.isHorizontal() ? e.maxRotation : e.minRotation), o = Math.cos(n), r = Math.sin(n), a = this._resolveTickFontOptions(0).size;
    return {
      w: i * o + a * r,
      h: i * r + a * o
    };
  }
  _getLabelCapacity(t) {
    const e = this.options.time, i = e.displayFormats, n = i[e.unit] || i.millisecond, o = this._tickFormatFunction(t, 0, lr(this, [
      t
    ], this._majorUnit), n), r = this._getLabelSize(o), a = Math.floor(this.isHorizontal() ? this.width / r.w : this.height / r.h) - 1;
    return a > 0 ? a : 1;
  }
  getDataTimestamps() {
    let t = this._cache.data || [], e, i;
    if (t.length)
      return t;
    const n = this.getMatchingVisibleMetas();
    if (this._normalized && n.length)
      return this._cache.data = n[0].controller.getAllParsedValues(this);
    for (e = 0, i = n.length; e < i; ++e)
      t = t.concat(n[e].controller.getAllParsedValues(this));
    return this._cache.data = this.normalize(t);
  }
  getLabelTimestamps() {
    const t = this._cache.labels || [];
    let e, i;
    if (t.length)
      return t;
    const n = this.getLabels();
    for (e = 0, i = n.length; e < i; ++e)
      t.push(or(this, n[e]));
    return this._cache.labels = this._normalized ? t : this.normalize(t);
  }
  normalize(t) {
    return Lr(t.sort(nr));
  }
}
P(yi, "id", "time"), P(yi, "defaults", {
  bounds: "data",
  adapters: {},
  time: {
    parser: !1,
    unit: !1,
    round: !1,
    isoWeekday: !1,
    minUnit: "millisecond",
    displayFormats: {}
  },
  ticks: {
    source: "auto",
    callback: !1,
    major: {
      enabled: !1
    }
  }
});
function zi(s, t, e) {
  let i = 0, n = s.length - 1, o, r, a, l;
  e ? (t >= s[i].pos && t <= s[n].pos && ({ lo: i, hi: n } = se(s, "pos", t)), { pos: o, time: a } = s[i], { pos: r, time: l } = s[n]) : (t >= s[i].time && t <= s[n].time && ({ lo: i, hi: n } = se(s, "time", t)), { time: o, pos: a } = s[i], { time: r, pos: l } = s[n]);
  const c = r - o;
  return c ? a + (l - a) * (t - o) / c : a;
}
class rn extends yi {
  constructor(t) {
    super(t), this._table = [], this._minPos = void 0, this._tableRange = void 0;
  }
  initOffsets() {
    const t = this._getTimestampsForTable(), e = this._table = this.buildLookupTable(t);
    this._minPos = zi(e, this.min), this._tableRange = zi(e, this.max) - this._minPos, super.initOffsets(t);
  }
  buildLookupTable(t) {
    const { min: e, max: i } = this, n = [], o = [];
    let r, a, l, c, h;
    for (r = 0, a = t.length; r < a; ++r)
      c = t[r], c >= e && c <= i && n.push(c);
    if (n.length < 2)
      return [
        {
          time: e,
          pos: 0
        },
        {
          time: i,
          pos: 1
        }
      ];
    for (r = 0, a = n.length; r < a; ++r)
      h = n[r + 1], l = n[r - 1], c = n[r], Math.round((h + l) / 2) !== c && o.push({
        time: c,
        pos: r / (a - 1)
      });
    return o;
  }
  _generate() {
    const t = this.min, e = this.max;
    let i = super.getDataTimestamps();
    return (!i.includes(t) || !i.length) && i.splice(0, 0, t), (!i.includes(e) || i.length === 1) && i.push(e), i.sort((n, o) => n - o);
  }
  _getTimestampsForTable() {
    let t = this._cache.all || [];
    if (t.length)
      return t;
    const e = this.getDataTimestamps(), i = this.getLabelTimestamps();
    return e.length && i.length ? t = this.normalize(e.concat(i)) : t = e.length ? e : i, t = this._cache.all = t, t;
  }
  getDecimalForValue(t) {
    return (zi(this._table, t) - this._minPos) / this._tableRange;
  }
  getValueForPixel(t) {
    const e = this._offsets, i = this.getDecimalForPixel(t) / e.factor - e.end;
    return zi(this._table, i * this._tableRange + this._minPos, !0);
  }
}
P(rn, "id", "timeseries"), P(rn, "defaults", yi.defaults);
var xf = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  CategoryScale: en,
  LinearScale: sn,
  LogarithmicScale: nn,
  RadialLinearScale: ni,
  TimeScale: yi,
  TimeSeriesScale: rn
});
const vf = [
  kh,
  ed,
  Gd,
  xf
];
ee.register(...vf);
class wf {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  on(t, e) {
    return this.map.has(t) || this.map.set(t, /* @__PURE__ */ new Set()), this.map.get(t).add(e), () => this.off(t, e);
  }
  off(t, e) {
    var i;
    (i = this.map.get(t)) == null || i.delete(e);
  }
  emit(t, e) {
    var i;
    (i = this.map.get(t)) == null || i.forEach((n) => {
      try {
        n(e);
      } catch (o) {
        console.error(o);
      }
    });
  }
}
const as = ["a", "b", "c", "d", "e", "f", "g", "h"], Cn = ["1", "2", "3", "4", "5", "6", "7", "8"];
function Fe(s) {
  return s === s.toUpperCase();
}
function Ge(s, t) {
  return as[s] + Cn[t];
}
function cr(s) {
  return {
    f: as.indexOf(s[0]),
    r: Cn.indexOf(s[1])
  };
}
function Qe(s) {
  const t = s.split(" "), e = Array(8).fill(null).map(() => Array(8).fill(null)), i = t[0].split("/");
  for (let n = 0; n < 8; n++) {
    const o = i[n];
    let r = 0;
    for (const a of o)
      /\d/.test(a) ? r += parseInt(a) : (e[7 - n][r] = a, r++);
  }
  return {
    board: e,
    turn: t[1] || "w",
    castling: t[2] || "KQkq",
    ep: t[3] === "-" ? null : t[3],
    halfmove: parseInt(t[4] || "0"),
    fullmove: parseInt(t[5] || "1")
  };
}
function Ls(s, t, e) {
  return Math.max(t, Math.min(e, s));
}
function hr(s, t, e) {
  return s + (t - s) * e;
}
function Sf(s) {
  return 1 - Math.pow(1 - s, 3);
}
const wa = {
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
}, Mf = "classic", Sa = () => wa[Mf], kf = (s) => {
  const t = Sa();
  return {
    ...t,
    ...s,
    pieceStroke: s.pieceStroke ?? t.pieceStroke,
    pieceHighlight: s.pieceHighlight ?? t.pieceHighlight
  };
}, ur = (s) => typeof s == "string" ? wa[s] ?? Sa() : kf(s);
class Pf {
  constructor(t, e) {
    this.size = t, this.colors = e, this.sheet = this.build(t);
  }
  getSheet() {
    return this.sheet;
  }
  rr(t, e, i, n, o, r) {
    const a = Math.min(r, n / 2, o / 2);
    t.beginPath(), t.moveTo(e + a, i), t.lineTo(e + n - a, i), t.quadraticCurveTo(e + n, i, e + n, i + a), t.lineTo(e + n, i + o - a), t.quadraticCurveTo(e + n, i + o, e + n - a, i + o), t.lineTo(e + a, i + o), t.quadraticCurveTo(e, i + o, e, i + o - a), t.lineTo(e, i + a), t.quadraticCurveTo(e, i, e + a, i), t.closePath();
  }
  build(t) {
    const e = typeof OffscreenCanvas < "u" ? new OffscreenCanvas(t * 6, t * 2) : Object.assign(document.createElement("canvas"), { width: t * 6, height: t * 2 }), i = e.getContext("2d");
    return ["k", "q", "r", "b", "n", "p"].forEach((o, r) => {
      this.draw(i, r * t, 0, t, o, "black"), this.draw(i, r * t, t, t, o, "white");
    }), e;
  }
  draw(t, e, i, n, o, r) {
    const a = r === "white" ? this.colors.whitePiece : this.colors.blackPiece, l = this.colors.pieceShadow;
    t.save(), t.translate(e, i), t.fillStyle = l, t.beginPath(), t.ellipse(n * 0.5, n * 0.68, n * 0.28, n * 0.1, 0, 0, Math.PI * 2), t.fill(), t.fillStyle = a, t.lineJoin = "round", t.lineCap = "round";
    const c = () => {
      t.beginPath(), t.moveTo(n * 0.2, n * 0.7), t.quadraticCurveTo(n * 0.5, n * 0.6, n * 0.8, n * 0.7), t.lineTo(n * 0.8, n * 0.8), t.quadraticCurveTo(n * 0.5, n * 0.85, n * 0.2, n * 0.8), t.closePath(), t.fill();
    };
    if (o === "p" && (t.beginPath(), t.arc(n * 0.5, n * 0.38, n * 0.12, 0, Math.PI * 2), t.fill(), t.beginPath(), t.moveTo(n * 0.38, n * 0.52), t.quadraticCurveTo(n * 0.5, n * 0.42, n * 0.62, n * 0.52), t.quadraticCurveTo(n * 0.64, n * 0.6, n * 0.5, n * 0.62), t.quadraticCurveTo(n * 0.36, n * 0.6, n * 0.38, n * 0.52), t.closePath(), t.fill(), c()), o === "r" && (t.beginPath(), this.rr(t, n * 0.32, n * 0.3, n * 0.36, n * 0.34, n * 0.04), t.fill(), t.beginPath(), this.rr(t, n * 0.3, n * 0.22, n * 0.12, n * 0.1, n * 0.02), t.fill(), t.beginPath(), this.rr(t, n * 0.44, n * 0.2, n * 0.12, n * 0.12, n * 0.02), t.fill(), t.beginPath(), this.rr(t, n * 0.58, n * 0.22, n * 0.12, n * 0.1, n * 0.02), t.fill(), c()), o === "n") {
      t.beginPath(), t.moveTo(n * 0.64, n * 0.6), t.quadraticCurveTo(n * 0.7, n * 0.35, n * 0.54, n * 0.28), t.quadraticCurveTo(n * 0.46, n * 0.24, n * 0.44, n * 0.3), t.quadraticCurveTo(n * 0.42, n * 0.42, n * 0.34, n * 0.44), t.quadraticCurveTo(n * 0.3, n * 0.46, n * 0.28, n * 0.5), t.quadraticCurveTo(n * 0.26, n * 0.6, n * 0.38, n * 0.62), t.closePath(), t.fill();
      const h = t.fillStyle;
      t.fillStyle = "rgba(0,0,0,0.15)", t.beginPath(), t.arc(n * 0.5, n * 0.36, n * 0.02, 0, Math.PI * 2), t.fill(), t.fillStyle = h, c();
    }
    if (o === "b") {
      t.beginPath(), t.ellipse(n * 0.5, n * 0.42, n * 0.12, n * 0.18, 0, 0, Math.PI * 2), t.fill();
      const h = t.globalCompositeOperation;
      t.globalCompositeOperation = "destination-out", t.beginPath(), t.moveTo(n * 0.5, n * 0.28), t.lineTo(n * 0.5, n * 0.52), t.lineWidth = n * 0.04, t.stroke(), t.globalCompositeOperation = h, c();
    }
    o === "q" && (t.beginPath(), t.moveTo(n * 0.3, n * 0.3), t.lineTo(n * 0.4, n * 0.18), t.lineTo(n * 0.5, n * 0.3), t.lineTo(n * 0.6, n * 0.18), t.lineTo(n * 0.7, n * 0.3), t.closePath(), t.fill(), t.beginPath(), t.ellipse(n * 0.5, n * 0.5, n * 0.16, n * 0.16, 0, 0, Math.PI * 2), t.fill(), c()), o === "k" && (t.beginPath(), this.rr(t, n * 0.47, n * 0.16, n * 0.06, n * 0.16, n * 0.02), t.fill(), t.beginPath(), this.rr(t, n * 0.4, n * 0.22, n * 0.2, n * 0.06, n * 0.02), t.fill(), t.beginPath(), this.rr(t, n * 0.36, n * 0.34, n * 0.28, n * 0.26, n * 0.08), t.fill(), c()), t.restore();
  }
}
function Af(s) {
  return s !== null ? { comment: s, variations: [] } : { variations: [] };
}
function Cf(s, t, e, i, n) {
  const o = { move: s, variations: n };
  return t && (o.suffix = t), e && (o.nag = e), i !== null && (o.comment = i), o;
}
function Tf(...s) {
  const [t, ...e] = s;
  let i = t;
  for (const n of e)
    n !== null && (i.variations = [n, ...n.variations], n.variations = [], i = n);
  return t;
}
function Ef(s, t) {
  if (t.marker && t.marker.comment) {
    let e = t.root;
    for (; ; ) {
      const i = e.variations[0];
      if (!i) {
        e.comment = t.marker.comment;
        break;
      }
      e = i;
    }
  }
  return {
    headers: s,
    root: t.root,
    result: (t.marker && t.marker.result) ?? void 0
  };
}
function Of(s, t) {
  function e() {
    this.constructor = s;
  }
  e.prototype = t.prototype, s.prototype = new e();
}
function We(s, t, e, i) {
  var n = Error.call(this, s);
  return Object.setPrototypeOf && Object.setPrototypeOf(n, We.prototype), n.expected = t, n.found = e, n.location = i, n.name = "SyntaxError", n;
}
Of(We, Error);
function Rs(s, t, e) {
  return e = e || " ", s.length > t ? s : (t -= s.length, e += e.repeat(t), s + e.slice(0, t));
}
We.prototype.format = function(s) {
  var t = "Error: " + this.message;
  if (this.location) {
    var e = null, i;
    for (i = 0; i < s.length; i++)
      if (s[i].source === this.location.source) {
        e = s[i].text.split(/\r\n|\n|\r/g);
        break;
      }
    var n = this.location.start, o = this.location.source && typeof this.location.source.offset == "function" ? this.location.source.offset(n) : n, r = this.location.source + ":" + o.line + ":" + o.column;
    if (e) {
      var a = this.location.end, l = Rs("", o.line.toString().length, " "), c = e[n.line - 1], h = n.line === a.line ? a.column : c.length + 1, u = h - n.column || 1;
      t += `
 --> ` + r + `
` + l + ` |
` + o.line + " | " + c + `
` + l + " | " + Rs("", n.column - 1, " ") + Rs("", u, "^");
    } else
      t += `
 at ` + r;
  }
  return t;
};
We.buildMessage = function(s, t) {
  var e = {
    literal: function(c) {
      return '"' + n(c.text) + '"';
    },
    class: function(c) {
      var h = c.parts.map(function(u) {
        return Array.isArray(u) ? o(u[0]) + "-" + o(u[1]) : o(u);
      });
      return "[" + (c.inverted ? "^" : "") + h.join("") + "]";
    },
    any: function() {
      return "any character";
    },
    end: function() {
      return "end of input";
    },
    other: function(c) {
      return c.description;
    }
  };
  function i(c) {
    return c.charCodeAt(0).toString(16).toUpperCase();
  }
  function n(c) {
    return c.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(h) {
      return "\\x0" + i(h);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(h) {
      return "\\x" + i(h);
    });
  }
  function o(c) {
    return c.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(h) {
      return "\\x0" + i(h);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(h) {
      return "\\x" + i(h);
    });
  }
  function r(c) {
    return e[c.type](c);
  }
  function a(c) {
    var h = c.map(r), u, d;
    if (h.sort(), h.length > 0) {
      for (u = 1, d = 1; u < h.length; u++)
        h[u - 1] !== h[u] && (h[d] = h[u], d++);
      h.length = d;
    }
    switch (h.length) {
      case 1:
        return h[0];
      case 2:
        return h[0] + " or " + h[1];
      default:
        return h.slice(0, -1).join(", ") + ", or " + h[h.length - 1];
    }
  }
  function l(c) {
    return c ? '"' + n(c) + '"' : "end of input";
  }
  return "Expected " + a(s) + " but " + l(t) + " found.";
};
function Df(s, t) {
  t = t !== void 0 ? t : {};
  var e = {}, i = t.grammarSource, n = { pgn: Rn }, o = Rn, r = "[", a = '"', l = "]", c = ".", h = "O-O-O", u = "O-O", d = "0-0-0", f = "0-0", g = "$", p = "{", m = "}", b = ";", _ = "(", k = ")", M = "1-0", S = "0-1", O = "1/2-1/2", C = "*", A = /^[a-zA-Z]/, L = /^[^"]/, H = /^[0-9]/, q = /^[.]/, V = /^[a-zA-Z1-8\-=]/, ot = /^[+#]/, ct = /^[!?]/, Y = /^[^}]/, X = /^[^\r\n]/, tt = /^[ \t\r\n]/, _t = Ft("tag pair"), G = pt("[", !1), Lt = pt('"', !1), re = pt("]", !1), Bt = Ft("tag name"), E = jt([["a", "z"], ["A", "Z"]], !1, !1), T = Ft("tag value"), R = jt(['"'], !0, !1), I = Ft("move number"), Q = jt([["0", "9"]], !1, !1), ht = pt(".", !1), rt = jt(["."], !1, !1), At = Ft("standard algebraic notation"), gt = pt("O-O-O", !1), kt = pt("O-O", !1), Wt = pt("0-0-0", !1), Et = pt("0-0", !1), Rt = jt([["a", "z"], ["A", "Z"], ["1", "8"], "-", "="], !1, !1), Xt = jt(["+", "#"], !1, !1), It = Ft("suffix annotation"), Vt = jt(["!", "?"], !1, !1), bs = Ft("NAG"), Aa = pt("$", !1), Ca = Ft("brace comment"), Ta = pt("{", !1), Tn = jt(["}"], !0, !1), Ea = pt("}", !1), Oa = Ft("rest of line comment"), Da = pt(";", !1), En = jt(["\r", `
`], !0, !1), La = Ft("variation"), Ra = pt("(", !1), Ia = pt(")", !1), Fa = Ft("game termination marker"), Na = pt("1-0", !1), za = pt("0-1", !1), Ba = pt("1/2-1/2", !1), Ha = pt("*", !1), $a = Ft("whitespace"), On = jt([" ", "	", "\r", `
`], !1, !1), qa = function(y, v) {
    return Ef(y, v);
  }, Wa = function(y) {
    return Object.fromEntries(y);
  }, Va = function(y, v) {
    return [y, v];
  }, ja = function(y, v) {
    return { root: y, marker: v };
  }, Ua = function(y, v) {
    return Tf(Af(y), ...v.flat());
  }, Ya = function(y, v, w, N, z) {
    return Cf(y, v, w, N, z);
  }, Ka = function(y) {
    return y;
  }, Xa = function(y) {
    return y.replace(/[\r\n]+/g, " ");
  }, Ga = function(y) {
    return y.trim();
  }, Qa = function(y) {
    return y;
  }, Ja = function(y, v) {
    return { result: y, comment: v };
  }, x = t.peg$currPos | 0, Le = [{ line: 1, column: 1 }], Ht = x, Si = t.peg$maxFailExpected || [], D = t.peg$silentFails | 0, Ve;
  if (t.startRule) {
    if (!(t.startRule in n))
      throw new Error(`Can't start parsing from rule "` + t.startRule + '".');
    o = n[t.startRule];
  }
  function pt(y, v) {
    return { type: "literal", text: y, ignoreCase: v };
  }
  function jt(y, v, w) {
    return { type: "class", parts: y, inverted: v, ignoreCase: w };
  }
  function Za() {
    return { type: "end" };
  }
  function Ft(y) {
    return { type: "other", description: y };
  }
  function Dn(y) {
    var v = Le[y], w;
    if (v)
      return v;
    if (y >= Le.length)
      w = Le.length - 1;
    else
      for (w = y; !Le[--w]; )
        ;
    for (v = Le[w], v = {
      line: v.line,
      column: v.column
    }; w < y; )
      s.charCodeAt(w) === 10 ? (v.line++, v.column = 1) : v.column++, w++;
    return Le[y] = v, v;
  }
  function Ln(y, v, w) {
    var N = Dn(y), z = Dn(v), J = {
      source: i,
      start: {
        offset: y,
        line: N.line,
        column: N.column
      },
      end: {
        offset: v,
        line: z.line,
        column: z.column
      }
    };
    return J;
  }
  function F(y) {
    x < Ht || (x > Ht && (Ht = x, Si = []), Si.push(y));
  }
  function tl(y, v, w) {
    return new We(
      We.buildMessage(y, v),
      y,
      v,
      w
    );
  }
  function Rn() {
    var y, v, w;
    return y = x, v = el(), w = nl(), y = qa(v, w), y;
  }
  function el() {
    var y, v, w;
    for (y = x, v = [], w = In(); w !== e; )
      v.push(w), w = In();
    return w = Pt(), y = Wa(v), y;
  }
  function In() {
    var y, v, w, N, z, J, _e;
    return D++, y = x, Pt(), s.charCodeAt(x) === 91 ? (v = r, x++) : (v = e, D === 0 && F(G)), v !== e ? (Pt(), w = il(), w !== e ? (Pt(), s.charCodeAt(x) === 34 ? (N = a, x++) : (N = e, D === 0 && F(Lt)), N !== e ? (z = sl(), s.charCodeAt(x) === 34 ? (J = a, x++) : (J = e, D === 0 && F(Lt)), J !== e ? (Pt(), s.charCodeAt(x) === 93 ? (_e = l, x++) : (_e = e, D === 0 && F(re)), _e !== e ? y = Va(w, z) : (x = y, y = e)) : (x = y, y = e)) : (x = y, y = e)) : (x = y, y = e)) : (x = y, y = e), D--, y === e && D === 0 && F(_t), y;
  }
  function il() {
    var y, v, w;
    if (D++, y = x, v = [], w = s.charAt(x), A.test(w) ? x++ : (w = e, D === 0 && F(E)), w !== e)
      for (; w !== e; )
        v.push(w), w = s.charAt(x), A.test(w) ? x++ : (w = e, D === 0 && F(E));
    else
      v = e;
    return v !== e ? y = s.substring(y, x) : y = v, D--, y === e && (v = e, D === 0 && F(Bt)), y;
  }
  function sl() {
    var y, v, w;
    for (D++, y = x, v = [], w = s.charAt(x), L.test(w) ? x++ : (w = e, D === 0 && F(R)); w !== e; )
      v.push(w), w = s.charAt(x), L.test(w) ? x++ : (w = e, D === 0 && F(R));
    return y = s.substring(y, x), D--, v = e, D === 0 && F(T), y;
  }
  function nl() {
    var y, v, w;
    return y = x, v = Fn(), Pt(), w = hl(), w === e && (w = null), Pt(), y = ja(v, w), y;
  }
  function Fn() {
    var y, v, w, N;
    for (y = x, v = _s(), v === e && (v = null), w = [], N = Nn(); N !== e; )
      w.push(N), N = Nn();
    return y = Ua(v, w), y;
  }
  function Nn() {
    var y, v, w, N, z, J, _e, Mi;
    if (y = x, Pt(), ol(), Pt(), v = rl(), v !== e) {
      for (w = al(), w === e && (w = null), N = [], z = zn(); z !== e; )
        N.push(z), z = zn();
      for (z = Pt(), J = _s(), J === e && (J = null), _e = [], Mi = Bn(); Mi !== e; )
        _e.push(Mi), Mi = Bn();
      y = Ya(v, w, N, J, _e);
    } else
      x = y, y = e;
    return y;
  }
  function ol() {
    var y, v, w, N, z, J;
    for (D++, y = x, v = [], w = s.charAt(x), H.test(w) ? x++ : (w = e, D === 0 && F(Q)); w !== e; )
      v.push(w), w = s.charAt(x), H.test(w) ? x++ : (w = e, D === 0 && F(Q));
    if (s.charCodeAt(x) === 46 ? (w = c, x++) : (w = e, D === 0 && F(ht)), w !== e) {
      for (N = Pt(), z = [], J = s.charAt(x), q.test(J) ? x++ : (J = e, D === 0 && F(rt)); J !== e; )
        z.push(J), J = s.charAt(x), q.test(J) ? x++ : (J = e, D === 0 && F(rt));
      v = [v, w, N, z], y = v;
    } else
      x = y, y = e;
    return D--, y === e && (v = e, D === 0 && F(I)), y;
  }
  function rl() {
    var y, v, w, N, z, J;
    if (D++, y = x, v = x, s.substr(x, 5) === h ? (w = h, x += 5) : (w = e, D === 0 && F(gt)), w === e && (s.substr(x, 3) === u ? (w = u, x += 3) : (w = e, D === 0 && F(kt)), w === e && (s.substr(x, 5) === d ? (w = d, x += 5) : (w = e, D === 0 && F(Wt)), w === e && (s.substr(x, 3) === f ? (w = f, x += 3) : (w = e, D === 0 && F(Et)), w === e))))
      if (w = x, N = s.charAt(x), A.test(N) ? x++ : (N = e, D === 0 && F(E)), N !== e) {
        if (z = [], J = s.charAt(x), V.test(J) ? x++ : (J = e, D === 0 && F(Rt)), J !== e)
          for (; J !== e; )
            z.push(J), J = s.charAt(x), V.test(J) ? x++ : (J = e, D === 0 && F(Rt));
        else
          z = e;
        z !== e ? (N = [N, z], w = N) : (x = w, w = e);
      } else
        x = w, w = e;
    return w !== e ? (N = s.charAt(x), ot.test(N) ? x++ : (N = e, D === 0 && F(Xt)), N === e && (N = null), w = [w, N], v = w) : (x = v, v = e), v !== e ? y = s.substring(y, x) : y = v, D--, y === e && (v = e, D === 0 && F(At)), y;
  }
  function al() {
    var y, v, w;
    for (D++, y = x, v = [], w = s.charAt(x), ct.test(w) ? x++ : (w = e, D === 0 && F(Vt)); w !== e; )
      v.push(w), v.length >= 2 ? w = e : (w = s.charAt(x), ct.test(w) ? x++ : (w = e, D === 0 && F(Vt)));
    return v.length < 1 ? (x = y, y = e) : y = v, D--, y === e && (v = e, D === 0 && F(It)), y;
  }
  function zn() {
    var y, v, w, N, z;
    if (D++, y = x, Pt(), s.charCodeAt(x) === 36 ? (v = g, x++) : (v = e, D === 0 && F(Aa)), v !== e) {
      if (w = x, N = [], z = s.charAt(x), H.test(z) ? x++ : (z = e, D === 0 && F(Q)), z !== e)
        for (; z !== e; )
          N.push(z), z = s.charAt(x), H.test(z) ? x++ : (z = e, D === 0 && F(Q));
      else
        N = e;
      N !== e ? w = s.substring(w, x) : w = N, w !== e ? y = Ka(w) : (x = y, y = e);
    } else
      x = y, y = e;
    return D--, y === e && D === 0 && F(bs), y;
  }
  function _s() {
    var y;
    return y = ll(), y === e && (y = cl()), y;
  }
  function ll() {
    var y, v, w, N, z;
    if (D++, y = x, s.charCodeAt(x) === 123 ? (v = p, x++) : (v = e, D === 0 && F(Ta)), v !== e) {
      for (w = x, N = [], z = s.charAt(x), Y.test(z) ? x++ : (z = e, D === 0 && F(Tn)); z !== e; )
        N.push(z), z = s.charAt(x), Y.test(z) ? x++ : (z = e, D === 0 && F(Tn));
      w = s.substring(w, x), s.charCodeAt(x) === 125 ? (N = m, x++) : (N = e, D === 0 && F(Ea)), N !== e ? y = Xa(w) : (x = y, y = e);
    } else
      x = y, y = e;
    return D--, y === e && (v = e, D === 0 && F(Ca)), y;
  }
  function cl() {
    var y, v, w, N, z;
    if (D++, y = x, s.charCodeAt(x) === 59 ? (v = b, x++) : (v = e, D === 0 && F(Da)), v !== e) {
      for (w = x, N = [], z = s.charAt(x), X.test(z) ? x++ : (z = e, D === 0 && F(En)); z !== e; )
        N.push(z), z = s.charAt(x), X.test(z) ? x++ : (z = e, D === 0 && F(En));
      w = s.substring(w, x), y = Ga(w);
    } else
      x = y, y = e;
    return D--, y === e && (v = e, D === 0 && F(Oa)), y;
  }
  function Bn() {
    var y, v, w, N;
    return D++, y = x, Pt(), s.charCodeAt(x) === 40 ? (v = _, x++) : (v = e, D === 0 && F(Ra)), v !== e ? (w = Fn(), w !== e ? (Pt(), s.charCodeAt(x) === 41 ? (N = k, x++) : (N = e, D === 0 && F(Ia)), N !== e ? y = Qa(w) : (x = y, y = e)) : (x = y, y = e)) : (x = y, y = e), D--, y === e && D === 0 && F(La), y;
  }
  function hl() {
    var y, v, w;
    return D++, y = x, s.substr(x, 3) === M ? (v = M, x += 3) : (v = e, D === 0 && F(Na)), v === e && (s.substr(x, 3) === S ? (v = S, x += 3) : (v = e, D === 0 && F(za)), v === e && (s.substr(x, 7) === O ? (v = O, x += 7) : (v = e, D === 0 && F(Ba)), v === e && (s.charCodeAt(x) === 42 ? (v = C, x++) : (v = e, D === 0 && F(Ha))))), v !== e ? (Pt(), w = _s(), w === e && (w = null), y = Ja(v, w)) : (x = y, y = e), D--, y === e && (v = e, D === 0 && F(Fa)), y;
  }
  function Pt() {
    var y, v;
    for (D++, y = [], v = s.charAt(x), tt.test(v) ? x++ : (v = e, D === 0 && F(On)); v !== e; )
      y.push(v), v = s.charAt(x), tt.test(v) ? x++ : (v = e, D === 0 && F(On));
    return D--, v = e, D === 0 && F($a), y;
  }
  if (Ve = o(), t.peg$library)
    return (
      /** @type {any} */
      {
        peg$result: Ve,
        peg$currPos: x,
        peg$FAILED: e,
        peg$maxFailExpected: Si,
        peg$maxFailPos: Ht
      }
    );
  if (Ve !== e && x === s.length)
    return Ve;
  throw Ve !== e && x < s.length && F(Za()), tl(
    Si,
    Ht < s.length ? s.charAt(Ht) : null,
    Ht < s.length ? Ln(Ht, Ht + 1) : Ln(Ht, Ht)
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
const Qi = 0xffffffffffffffffn;
function Is(s, t) {
  return (s << t | s >> 64n - t) & 0xffffffffffffffffn;
}
function dr(s, t) {
  return s * t & Qi;
}
function Lf(s) {
  return function() {
    let t = BigInt(s & Qi), e = BigInt(s >> 64n & Qi);
    const i = dr(Is(dr(t, 5n), 7n), 9n);
    return e ^= t, t = (Is(t, 24n) ^ e ^ e << 16n) & Qi, e = Is(e, 37n), s = e << 64n | t, i;
  };
}
const ps = Lf(0xa187eb39cdcaed8f31c4b365b102e01en), Rf = Array.from({ length: 2 }, () => Array.from({ length: 6 }, () => Array.from({ length: 128 }, () => ps()))), If = Array.from({ length: 8 }, () => ps()), Ff = Array.from({ length: 16 }, () => ps()), Fs = ps(), xt = "w", Ot = "b", ut = "p", an = "n", Ji = "b", oi = "r", ce = "q", dt = "k", Ns = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
class Bi {
  constructor(t, e) {
    P(this, "color");
    P(this, "from");
    P(this, "to");
    P(this, "piece");
    P(this, "captured");
    P(this, "promotion");
    /**
     * @deprecated This field is deprecated and will be removed in version 2.0.0.
     * Please use move descriptor functions instead: `isCapture`, `isPromotion`,
     * `isEnPassant`, `isKingsideCastle`, `isQueensideCastle`, `isCastle`, and
     * `isBigPawn`
     */
    P(this, "flags");
    P(this, "san");
    P(this, "lan");
    P(this, "before");
    P(this, "after");
    const { color: i, piece: n, from: o, to: r, flags: a, captured: l, promotion: c } = e, h = mt(o), u = mt(r);
    this.color = i, this.piece = n, this.from = h, this.to = u, this.san = t._moveToSan(e, t._moves({ legal: !0 })), this.lan = h + u, this.before = t.fen(), t._makeMove(e), this.after = t.fen(), t._undoMove(), this.flags = "";
    for (const d in $)
      $[d] & a && (this.flags += Se[d]);
    l && (this.captured = l), c && (this.promotion = c, this.lan += c);
  }
  isCapture() {
    return this.flags.indexOf(Se.CAPTURE) > -1;
  }
  isPromotion() {
    return this.flags.indexOf(Se.PROMOTION) > -1;
  }
  isEnPassant() {
    return this.flags.indexOf(Se.EP_CAPTURE) > -1;
  }
  isKingsideCastle() {
    return this.flags.indexOf(Se.KSIDE_CASTLE) > -1;
  }
  isQueensideCastle() {
    return this.flags.indexOf(Se.QSIDE_CASTLE) > -1;
  }
  isBigPawn() {
    return this.flags.indexOf(Se.BIG_PAWN) > -1;
  }
}
const yt = -1, Se = {
  NORMAL: "n",
  CAPTURE: "c",
  BIG_PAWN: "b",
  EP_CAPTURE: "e",
  PROMOTION: "p",
  KSIDE_CASTLE: "k",
  QSIDE_CASTLE: "q",
  NULL_MOVE: "-"
}, fr = [
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
], $ = {
  NORMAL: 1,
  CAPTURE: 2,
  BIG_PAWN: 4,
  EP_CAPTURE: 8,
  PROMOTION: 16,
  KSIDE_CASTLE: 32,
  QSIDE_CASTLE: 64,
  NULL_MOVE: 128
}, ln = {
  Event: "?",
  Site: "?",
  Date: "????.??.??",
  Round: "?",
  White: "?",
  Black: "?",
  Result: "*"
}, Nf = {
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
}, zf = {
  ...ln,
  ...Nf
}, B = {
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
}, zs = {
  b: [16, 32, 17, 15],
  w: [-16, -32, -17, -15]
}, gr = {
  n: [-18, -33, -31, -14, 18, 33, 31, 14],
  b: [-17, -15, 17, 15],
  r: [-16, 1, 16, -1],
  q: [-17, -16, -15, 1, 17, 16, 15, -1],
  k: [-17, -16, -15, 1, 17, 16, 15, -1]
}, Bf = [
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
], Hf = [
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
], $f = { p: 1, n: 2, b: 4, r: 8, q: 16, k: 32 }, qf = "pnbrqkPNBRQK", pr = [an, Ji, oi, ce], Wf = 7, Vf = 6, jf = 1, Uf = 0, Hi = {
  [dt]: $.KSIDE_CASTLE,
  [ce]: $.QSIDE_CASTLE
}, ae = {
  w: [
    { square: B.a1, flag: $.QSIDE_CASTLE },
    { square: B.h1, flag: $.KSIDE_CASTLE }
  ],
  b: [
    { square: B.a8, flag: $.QSIDE_CASTLE },
    { square: B.h8, flag: $.KSIDE_CASTLE }
  ]
}, Yf = { b: jf, w: Vf }, Bs = "--";
function Te(s) {
  return s >> 4;
}
function xi(s) {
  return s & 15;
}
function Ma(s) {
  return "0123456789".indexOf(s) !== -1;
}
function mt(s) {
  const t = xi(s), e = Te(s);
  return "abcdefgh".substring(t, t + 1) + "87654321".substring(e, e + 1);
}
function Je(s) {
  return s === xt ? Ot : xt;
}
function Kf(s) {
  const t = s.split(/\s+/);
  if (t.length !== 6)
    return {
      ok: !1,
      error: "Invalid FEN: must contain six space-delimited fields"
    };
  const e = parseInt(t[5], 10);
  if (isNaN(e) || e <= 0)
    return {
      ok: !1,
      error: "Invalid FEN: move number must be a positive integer"
    };
  const i = parseInt(t[4], 10);
  if (isNaN(i) || i < 0)
    return {
      ok: !1,
      error: "Invalid FEN: half move counter number must be a non-negative integer"
    };
  if (!/^(-|[abcdefgh][36])$/.test(t[3]))
    return { ok: !1, error: "Invalid FEN: en-passant square is invalid" };
  if (/[^kKqQ-]/.test(t[2]))
    return { ok: !1, error: "Invalid FEN: castling availability is invalid" };
  if (!/^(w|b)$/.test(t[1]))
    return { ok: !1, error: "Invalid FEN: side-to-move is invalid" };
  const n = t[0].split("/");
  if (n.length !== 8)
    return {
      ok: !1,
      error: "Invalid FEN: piece data does not contain 8 '/'-delimited rows"
    };
  for (let r = 0; r < n.length; r++) {
    let a = 0, l = !1;
    for (let c = 0; c < n[r].length; c++)
      if (Ma(n[r][c])) {
        if (l)
          return {
            ok: !1,
            error: "Invalid FEN: piece data is invalid (consecutive number)"
          };
        a += parseInt(n[r][c], 10), l = !0;
      } else {
        if (!/^[prnbqkPRNBQK]$/.test(n[r][c]))
          return {
            ok: !1,
            error: "Invalid FEN: piece data is invalid (invalid piece)"
          };
        a += 1, l = !1;
      }
    if (a !== 8)
      return {
        ok: !1,
        error: "Invalid FEN: piece data is invalid (too many squares in rank)"
      };
  }
  if (t[3][1] == "3" && t[1] == "w" || t[3][1] == "6" && t[1] == "b")
    return { ok: !1, error: "Invalid FEN: illegal en-passant square" };
  const o = [
    { color: "white", regex: /K/g },
    { color: "black", regex: /k/g }
  ];
  for (const { color: r, regex: a } of o) {
    if (!a.test(t[0]))
      return { ok: !1, error: `Invalid FEN: missing ${r} king` };
    if ((t[0].match(a) || []).length > 1)
      return { ok: !1, error: `Invalid FEN: too many ${r} kings` };
  }
  return Array.from(n[0] + n[7]).some((r) => r.toUpperCase() === "P") ? {
    ok: !1,
    error: "Invalid FEN: some pawns are on the edge rows"
  } : { ok: !0 };
}
function Xf(s, t) {
  const e = s.from, i = s.to, n = s.piece;
  let o = 0, r = 0, a = 0;
  for (let l = 0, c = t.length; l < c; l++) {
    const h = t[l].from, u = t[l].to, d = t[l].piece;
    n === d && e !== h && i === u && (o++, Te(e) === Te(h) && r++, xi(e) === xi(h) && a++);
  }
  return o > 0 ? r > 0 && a > 0 ? mt(e) : a > 0 ? mt(e).charAt(1) : mt(e).charAt(0) : "";
}
function le(s, t, e, i, n, o = void 0, r = $.NORMAL) {
  const a = Te(i);
  if (n === ut && (a === Wf || a === Uf))
    for (let l = 0; l < pr.length; l++) {
      const c = pr[l];
      s.push({
        color: t,
        from: e,
        to: i,
        piece: n,
        captured: o,
        promotion: c,
        flags: r | $.PROMOTION
      });
    }
  else
    s.push({
      color: t,
      from: e,
      to: i,
      piece: n,
      captured: o,
      flags: r
    });
}
function mr(s) {
  let t = s.charAt(0);
  return t >= "a" && t <= "h" ? s.match(/[a-h]\d.*[a-h]\d/) ? void 0 : ut : (t = t.toLowerCase(), t === "o" ? dt : t);
}
function Hs(s) {
  return s.replace(/=/, "").replace(/[+#]?[?!]*$/, "");
}
class $s {
  constructor(t = Ns, { skipValidation: e = !1 } = {}) {
    P(this, "_board", new Array(128));
    P(this, "_turn", xt);
    P(this, "_header", {});
    P(this, "_kings", { w: yt, b: yt });
    P(this, "_epSquare", -1);
    P(this, "_halfMoves", 0);
    P(this, "_moveNumber", 0);
    P(this, "_history", []);
    P(this, "_comments", {});
    P(this, "_castling", { w: 0, b: 0 });
    P(this, "_hash", 0n);
    // tracks number of times a position has been seen for repetition checking
    P(this, "_positionCount", /* @__PURE__ */ new Map());
    this.load(t, { skipValidation: e });
  }
  clear({ preserveHeaders: t = !1 } = {}) {
    this._board = new Array(128), this._kings = { w: yt, b: yt }, this._turn = xt, this._castling = { w: 0, b: 0 }, this._epSquare = yt, this._halfMoves = 0, this._moveNumber = 1, this._history = [], this._comments = {}, this._header = t ? this._header : { ...zf }, this._hash = this._computeHash(), this._positionCount = /* @__PURE__ */ new Map(), this._header.SetUp = null, this._header.FEN = null;
  }
  load(t, { skipValidation: e = !1, preserveHeaders: i = !1 } = {}) {
    let n = t.split(/\s+/);
    if (n.length >= 2 && n.length < 6) {
      const a = ["-", "-", "0", "1"];
      t = n.concat(a.slice(-(6 - n.length))).join(" ");
    }
    if (n = t.split(/\s+/), !e) {
      const { ok: a, error: l } = Kf(t);
      if (!a)
        throw new Error(l);
    }
    const o = n[0];
    let r = 0;
    this.clear({ preserveHeaders: i });
    for (let a = 0; a < o.length; a++) {
      const l = o.charAt(a);
      if (l === "/")
        r += 8;
      else if (Ma(l))
        r += parseInt(l, 10);
      else {
        const c = l < "a" ? xt : Ot;
        this._put({ type: l.toLowerCase(), color: c }, mt(r)), r++;
      }
    }
    this._turn = n[1], n[2].indexOf("K") > -1 && (this._castling.w |= $.KSIDE_CASTLE), n[2].indexOf("Q") > -1 && (this._castling.w |= $.QSIDE_CASTLE), n[2].indexOf("k") > -1 && (this._castling.b |= $.KSIDE_CASTLE), n[2].indexOf("q") > -1 && (this._castling.b |= $.QSIDE_CASTLE), this._epSquare = n[3] === "-" ? yt : B[n[3]], this._halfMoves = parseInt(n[4], 10), this._moveNumber = parseInt(n[5], 10), this._hash = this._computeHash(), this._updateSetup(t), this._incPositionCount();
  }
  fen({ forceEnpassantSquare: t = !1 } = {}) {
    var r, a;
    let e = 0, i = "";
    for (let l = B.a8; l <= B.h1; l++) {
      if (this._board[l]) {
        e > 0 && (i += e, e = 0);
        const { color: c, type: h } = this._board[l];
        i += c === xt ? h.toUpperCase() : h.toLowerCase();
      } else
        e++;
      l + 1 & 136 && (e > 0 && (i += e), l !== B.h1 && (i += "/"), e = 0, l += 8);
    }
    let n = "";
    this._castling[xt] & $.KSIDE_CASTLE && (n += "K"), this._castling[xt] & $.QSIDE_CASTLE && (n += "Q"), this._castling[Ot] & $.KSIDE_CASTLE && (n += "k"), this._castling[Ot] & $.QSIDE_CASTLE && (n += "q"), n = n || "-";
    let o = "-";
    if (this._epSquare !== yt)
      if (t)
        o = mt(this._epSquare);
      else {
        const l = this._epSquare + (this._turn === xt ? 16 : -16), c = [l + 1, l - 1];
        for (const h of c) {
          if (h & 136)
            continue;
          const u = this._turn;
          if (((r = this._board[h]) == null ? void 0 : r.color) === u && ((a = this._board[h]) == null ? void 0 : a.type) === ut) {
            this._makeMove({
              color: u,
              from: h,
              to: this._epSquare,
              piece: ut,
              captured: ut,
              flags: $.EP_CAPTURE
            });
            const d = !this._isKingAttacked(u);
            if (this._undoMove(), d) {
              o = mt(this._epSquare);
              break;
            }
          }
        }
      }
    return [
      i,
      this._turn,
      n,
      o,
      this._halfMoves,
      this._moveNumber
    ].join(" ");
  }
  _pieceKey(t) {
    if (!this._board[t])
      return 0n;
    const { color: e, type: i } = this._board[t], n = {
      w: 0,
      b: 1
    }[e], o = {
      p: 0,
      n: 1,
      b: 2,
      r: 3,
      q: 4,
      k: 5
    }[i];
    return Rf[n][o][t];
  }
  _epKey() {
    return this._epSquare === yt ? 0n : If[this._epSquare & 7];
  }
  _castlingKey() {
    const t = this._castling.w >> 5 | this._castling.b >> 3;
    return Ff[t];
  }
  _computeHash() {
    let t = 0n;
    for (let e = B.a8; e <= B.h1; e++) {
      if (e & 136) {
        e += 7;
        continue;
      }
      this._board[e] && (t ^= this._pieceKey(e));
    }
    return t ^= this._epKey(), t ^= this._castlingKey(), this._turn === "b" && (t ^= Fs), t;
  }
  /*
   * Called when the initial board setup is changed with put() or remove().
   * modifies the SetUp and FEN properties of the header object. If the FEN
   * is equal to the default position, the SetUp and FEN are deleted the setup
   * is only updated if history.length is zero, ie moves haven't been made.
   */
  _updateSetup(t) {
    this._history.length > 0 || (t !== Ns ? (this._header.SetUp = "1", this._header.FEN = t) : (this._header.SetUp = null, this._header.FEN = null));
  }
  reset() {
    this.load(Ns);
  }
  get(t) {
    return this._board[B[t]];
  }
  findPiece(t) {
    var i;
    const e = [];
    for (let n = B.a8; n <= B.h1; n++) {
      if (n & 136) {
        n += 7;
        continue;
      }
      !this._board[n] || ((i = this._board[n]) == null ? void 0 : i.color) !== t.color || this._board[n].color === t.color && this._board[n].type === t.type && e.push(mt(n));
    }
    return e;
  }
  put({ type: t, color: e }, i) {
    return this._put({ type: t, color: e }, i) ? (this._updateCastlingRights(), this._updateEnPassantSquare(), this._updateSetup(this.fen()), !0) : !1;
  }
  _set(t, e) {
    this._hash ^= this._pieceKey(t), this._board[t] = e, this._hash ^= this._pieceKey(t);
  }
  _put({ type: t, color: e }, i) {
    if (qf.indexOf(t.toLowerCase()) === -1 || !(i in B))
      return !1;
    const n = B[i];
    if (t == dt && !(this._kings[e] == yt || this._kings[e] == n))
      return !1;
    const o = this._board[n];
    return o && o.type === dt && (this._kings[o.color] = yt), this._set(n, { type: t, color: e }), t === dt && (this._kings[e] = n), !0;
  }
  _clear(t) {
    this._hash ^= this._pieceKey(t), delete this._board[t];
  }
  remove(t) {
    const e = this.get(t);
    return this._clear(B[t]), e && e.type === dt && (this._kings[e.color] = yt), this._updateCastlingRights(), this._updateEnPassantSquare(), this._updateSetup(this.fen()), e;
  }
  _updateCastlingRights() {
    var i, n, o, r, a, l, c, h, u, d, f, g;
    this._hash ^= this._castlingKey();
    const t = ((i = this._board[B.e1]) == null ? void 0 : i.type) === dt && ((n = this._board[B.e1]) == null ? void 0 : n.color) === xt, e = ((o = this._board[B.e8]) == null ? void 0 : o.type) === dt && ((r = this._board[B.e8]) == null ? void 0 : r.color) === Ot;
    (!t || ((a = this._board[B.a1]) == null ? void 0 : a.type) !== oi || ((l = this._board[B.a1]) == null ? void 0 : l.color) !== xt) && (this._castling.w &= -65), (!t || ((c = this._board[B.h1]) == null ? void 0 : c.type) !== oi || ((h = this._board[B.h1]) == null ? void 0 : h.color) !== xt) && (this._castling.w &= -33), (!e || ((u = this._board[B.a8]) == null ? void 0 : u.type) !== oi || ((d = this._board[B.a8]) == null ? void 0 : d.color) !== Ot) && (this._castling.b &= -65), (!e || ((f = this._board[B.h8]) == null ? void 0 : f.type) !== oi || ((g = this._board[B.h8]) == null ? void 0 : g.color) !== Ot) && (this._castling.b &= -33), this._hash ^= this._castlingKey();
  }
  _updateEnPassantSquare() {
    var o, r;
    if (this._epSquare === yt)
      return;
    const t = this._epSquare + (this._turn === xt ? -16 : 16), e = this._epSquare + (this._turn === xt ? 16 : -16), i = [e + 1, e - 1];
    if (this._board[t] !== null || this._board[this._epSquare] !== null || ((o = this._board[e]) == null ? void 0 : o.color) !== Je(this._turn) || ((r = this._board[e]) == null ? void 0 : r.type) !== ut) {
      this._hash ^= this._epKey(), this._epSquare = yt;
      return;
    }
    const n = (a) => {
      var l, c;
      return !(a & 136) && ((l = this._board[a]) == null ? void 0 : l.color) === this._turn && ((c = this._board[a]) == null ? void 0 : c.type) === ut;
    };
    i.some(n) || (this._hash ^= this._epKey(), this._epSquare = yt);
  }
  _attacked(t, e, i) {
    const n = [];
    for (let o = B.a8; o <= B.h1; o++) {
      if (o & 136) {
        o += 7;
        continue;
      }
      if (this._board[o] === void 0 || this._board[o].color !== t)
        continue;
      const r = this._board[o], a = o - e;
      if (a === 0)
        continue;
      const l = a + 119;
      if (Bf[l] & $f[r.type]) {
        if (r.type === ut) {
          if (a > 0 && r.color === xt || a <= 0 && r.color === Ot)
            if (i)
              n.push(mt(o));
            else
              return !0;
          continue;
        }
        if (r.type === "n" || r.type === "k")
          if (i) {
            n.push(mt(o));
            continue;
          } else
            return !0;
        const c = Hf[l];
        let h = o + c, u = !1;
        for (; h !== e; ) {
          if (this._board[h] != null) {
            u = !0;
            break;
          }
          h += c;
        }
        if (!u)
          if (i) {
            n.push(mt(o));
            continue;
          } else
            return !0;
      }
    }
    return i ? n : !1;
  }
  attackers(t, e) {
    return e ? this._attacked(e, B[t], !0) : this._attacked(this._turn, B[t], !0);
  }
  _isKingAttacked(t) {
    const e = this._kings[t];
    return e === -1 ? !1 : this._attacked(Je(t), e);
  }
  hash() {
    return this._hash.toString(16);
  }
  isAttacked(t, e) {
    return this._attacked(e, B[t]);
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
    const t = {
      b: 0,
      n: 0,
      r: 0,
      q: 0,
      k: 0,
      p: 0
    }, e = [];
    let i = 0, n = 0;
    for (let o = B.a8; o <= B.h1; o++) {
      if (n = (n + 1) % 2, o & 136) {
        o += 7;
        continue;
      }
      const r = this._board[o];
      r && (t[r.type] = r.type in t ? t[r.type] + 1 : 1, r.type === Ji && e.push(n), i++);
    }
    if (i === 2)
      return !0;
    if (
      // k vs. kn .... or .... k vs. kb
      i === 3 && (t[Ji] === 1 || t[an] === 1)
    )
      return !0;
    if (i === t[Ji] + 2) {
      let o = 0;
      const r = e.length;
      for (let a = 0; a < r; a++)
        o += e[a];
      if (o === 0 || o === r)
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
  moves({ verbose: t = !1, square: e = void 0, piece: i = void 0 } = {}) {
    const n = this._moves({ square: e, piece: i });
    return t ? n.map((o) => new Bi(this, o)) : n.map((o) => this._moveToSan(o, n));
  }
  _moves({ legal: t = !0, piece: e = void 0, square: i = void 0 } = {}) {
    var f;
    const n = i ? i.toLowerCase() : void 0, o = e == null ? void 0 : e.toLowerCase(), r = [], a = this._turn, l = Je(a);
    let c = B.a8, h = B.h1, u = !1;
    if (n)
      if (n in B)
        c = h = B[n], u = !0;
      else
        return [];
    for (let g = c; g <= h; g++) {
      if (g & 136) {
        g += 7;
        continue;
      }
      if (!this._board[g] || this._board[g].color === l)
        continue;
      const { type: p } = this._board[g];
      let m;
      if (p === ut) {
        if (o && o !== p)
          continue;
        m = g + zs[a][0], this._board[m] || (le(r, a, g, m, ut), m = g + zs[a][1], Yf[a] === Te(g) && !this._board[m] && le(r, a, g, m, ut, void 0, $.BIG_PAWN));
        for (let b = 2; b < 4; b++)
          m = g + zs[a][b], !(m & 136) && (((f = this._board[m]) == null ? void 0 : f.color) === l ? le(r, a, g, m, ut, this._board[m].type, $.CAPTURE) : m === this._epSquare && le(r, a, g, m, ut, ut, $.EP_CAPTURE));
      } else {
        if (o && o !== p)
          continue;
        for (let b = 0, _ = gr[p].length; b < _; b++) {
          const k = gr[p][b];
          for (m = g; m += k, !(m & 136); ) {
            if (!this._board[m])
              le(r, a, g, m, p);
            else {
              if (this._board[m].color === a)
                break;
              le(r, a, g, m, p, this._board[m].type, $.CAPTURE);
              break;
            }
            if (p === an || p === dt)
              break;
          }
        }
      }
    }
    if ((o === void 0 || o === dt) && (!u || h === this._kings[a])) {
      if (this._castling[a] & $.KSIDE_CASTLE) {
        const g = this._kings[a], p = g + 2;
        !this._board[g + 1] && !this._board[p] && !this._attacked(l, this._kings[a]) && !this._attacked(l, g + 1) && !this._attacked(l, p) && le(r, a, this._kings[a], p, dt, void 0, $.KSIDE_CASTLE);
      }
      if (this._castling[a] & $.QSIDE_CASTLE) {
        const g = this._kings[a], p = g - 2;
        !this._board[g - 1] && !this._board[g - 2] && !this._board[g - 3] && !this._attacked(l, this._kings[a]) && !this._attacked(l, g - 1) && !this._attacked(l, p) && le(r, a, this._kings[a], p, dt, void 0, $.QSIDE_CASTLE);
      }
    }
    if (!t || this._kings[a] === -1)
      return r;
    const d = [];
    for (let g = 0, p = r.length; g < p; g++)
      this._makeMove(r[g]), this._isKingAttacked(a) || d.push(r[g]), this._undoMove();
    return d;
  }
  move(t, { strict: e = !1 } = {}) {
    let i = null;
    if (typeof t == "string")
      i = this._moveFromSan(t, e);
    else if (t === null)
      i = this._moveFromSan(Bs, e);
    else if (typeof t == "object") {
      const o = this._moves();
      for (let r = 0, a = o.length; r < a; r++)
        if (t.from === mt(o[r].from) && t.to === mt(o[r].to) && (!("promotion" in o[r]) || t.promotion === o[r].promotion)) {
          i = o[r];
          break;
        }
    }
    if (!i)
      throw typeof t == "string" ? new Error(`Invalid move: ${t}`) : new Error(`Invalid move: ${JSON.stringify(t)}`);
    if (this.isCheck() && i.flags & $.NULL_MOVE)
      throw new Error("Null move not allowed when in check");
    const n = new Bi(this, i);
    return this._makeMove(i), this._incPositionCount(), n;
  }
  _push(t) {
    this._history.push({
      move: t,
      kings: { b: this._kings.b, w: this._kings.w },
      turn: this._turn,
      castling: { b: this._castling.b, w: this._castling.w },
      epSquare: this._epSquare,
      halfMoves: this._halfMoves,
      moveNumber: this._moveNumber
    });
  }
  _movePiece(t, e) {
    this._hash ^= this._pieceKey(t), this._board[e] = this._board[t], delete this._board[t], this._hash ^= this._pieceKey(e);
  }
  _makeMove(t) {
    var n, o, r, a;
    const e = this._turn, i = Je(e);
    if (this._push(t), t.flags & $.NULL_MOVE) {
      e === Ot && this._moveNumber++, this._halfMoves++, this._turn = i, this._epSquare = yt;
      return;
    }
    if (this._hash ^= this._epKey(), this._hash ^= this._castlingKey(), t.captured && (this._hash ^= this._pieceKey(t.to)), this._movePiece(t.from, t.to), t.flags & $.EP_CAPTURE && (this._turn === Ot ? this._clear(t.to - 16) : this._clear(t.to + 16)), t.promotion && (this._clear(t.to), this._set(t.to, { type: t.promotion, color: e })), this._board[t.to].type === dt) {
      if (this._kings[e] = t.to, t.flags & $.KSIDE_CASTLE) {
        const l = t.to - 1, c = t.to + 1;
        this._movePiece(c, l);
      } else if (t.flags & $.QSIDE_CASTLE) {
        const l = t.to + 1, c = t.to - 2;
        this._movePiece(c, l);
      }
      this._castling[e] = 0;
    }
    if (this._castling[e]) {
      for (let l = 0, c = ae[e].length; l < c; l++)
        if (t.from === ae[e][l].square && this._castling[e] & ae[e][l].flag) {
          this._castling[e] ^= ae[e][l].flag;
          break;
        }
    }
    if (this._castling[i]) {
      for (let l = 0, c = ae[i].length; l < c; l++)
        if (t.to === ae[i][l].square && this._castling[i] & ae[i][l].flag) {
          this._castling[i] ^= ae[i][l].flag;
          break;
        }
    }
    if (this._hash ^= this._castlingKey(), t.flags & $.BIG_PAWN) {
      let l;
      e === Ot ? l = t.to - 16 : l = t.to + 16, !(t.to - 1 & 136) && ((n = this._board[t.to - 1]) == null ? void 0 : n.type) === ut && ((o = this._board[t.to - 1]) == null ? void 0 : o.color) === i || !(t.to + 1 & 136) && ((r = this._board[t.to + 1]) == null ? void 0 : r.type) === ut && ((a = this._board[t.to + 1]) == null ? void 0 : a.color) === i ? (this._epSquare = l, this._hash ^= this._epKey()) : this._epSquare = yt;
    } else
      this._epSquare = yt;
    t.piece === ut ? this._halfMoves = 0 : t.flags & ($.CAPTURE | $.EP_CAPTURE) ? this._halfMoves = 0 : this._halfMoves++, e === Ot && this._moveNumber++, this._turn = i, this._hash ^= Fs;
  }
  undo() {
    const t = this._hash, e = this._undoMove();
    if (e) {
      const i = new Bi(this, e);
      return this._decPositionCount(t), i;
    }
    return null;
  }
  _undoMove() {
    const t = this._history.pop();
    if (t === void 0)
      return null;
    this._hash ^= this._epKey(), this._hash ^= this._castlingKey();
    const e = t.move;
    this._kings = t.kings, this._turn = t.turn, this._castling = t.castling, this._epSquare = t.epSquare, this._halfMoves = t.halfMoves, this._moveNumber = t.moveNumber, this._hash ^= this._epKey(), this._hash ^= this._castlingKey(), this._hash ^= Fs;
    const i = this._turn, n = Je(i);
    if (e.flags & $.NULL_MOVE)
      return e;
    if (this._movePiece(e.to, e.from), e.piece && (this._clear(e.from), this._set(e.from, { type: e.piece, color: i })), e.captured)
      if (e.flags & $.EP_CAPTURE) {
        let o;
        i === Ot ? o = e.to - 16 : o = e.to + 16, this._set(o, { type: ut, color: n });
      } else
        this._set(e.to, { type: e.captured, color: n });
    if (e.flags & ($.KSIDE_CASTLE | $.QSIDE_CASTLE)) {
      let o, r;
      e.flags & $.KSIDE_CASTLE ? (o = e.to + 1, r = e.to - 1) : (o = e.to - 2, r = e.to + 1), this._movePiece(r, o);
    }
    return e;
  }
  pgn({ newline: t = `
`, maxWidth: e = 0 } = {}) {
    const i = [];
    let n = !1;
    for (const d in this._header)
      this._header[d] && i.push(`[${d} "${this._header[d]}"]` + t), n = !0;
    n && this._history.length && i.push(t);
    const o = (d) => {
      const f = this._comments[this.fen()];
      if (typeof f < "u") {
        const g = d.length > 0 ? " " : "";
        d = `${d}${g}{${f}}`;
      }
      return d;
    }, r = [];
    for (; this._history.length > 0; )
      r.push(this._undoMove());
    const a = [];
    let l = "";
    for (r.length === 0 && a.push(o("")); r.length > 0; ) {
      l = o(l);
      const d = r.pop();
      if (!d)
        break;
      if (!this._history.length && d.color === "b") {
        const f = `${this._moveNumber}. ...`;
        l = l ? `${l} ${f}` : f;
      } else d.color === "w" && (l.length && a.push(l), l = this._moveNumber + ".");
      l = l + " " + this._moveToSan(d, this._moves({ legal: !0 })), this._makeMove(d);
    }
    if (l.length && a.push(o(l)), a.push(this._header.Result || "*"), e === 0)
      return i.join("") + a.join(" ");
    const c = function() {
      return i.length > 0 && i[i.length - 1] === " " ? (i.pop(), !0) : !1;
    }, h = function(d, f) {
      for (const g of f.split(" "))
        if (g) {
          if (d + g.length > e) {
            for (; c(); )
              d--;
            i.push(t), d = 0;
          }
          i.push(g), d += g.length, i.push(" "), d++;
        }
      return c() && d--, d;
    };
    let u = 0;
    for (let d = 0; d < a.length; d++) {
      if (u + a[d].length > e && a[d].includes("{")) {
        u = h(u, a[d]);
        continue;
      }
      u + a[d].length > e && d !== 0 ? (i[i.length - 1] === " " && i.pop(), i.push(t), u = 0) : d !== 0 && (i.push(" "), u++), i.push(a[d]), u += a[d].length;
    }
    return i.join("");
  }
  /**
   * @deprecated Use `setHeader` and `getHeaders` instead. This method will return null header tags (which is not what you want)
   */
  header(...t) {
    for (let e = 0; e < t.length; e += 2)
      typeof t[e] == "string" && typeof t[e + 1] == "string" && (this._header[t[e]] = t[e + 1]);
    return this._header;
  }
  // TODO: value validation per spec
  setHeader(t, e) {
    return this._header[t] = e ?? ln[t] ?? null, this.getHeaders();
  }
  removeHeader(t) {
    return t in this._header ? (this._header[t] = ln[t] || null, !0) : !1;
  }
  // return only non-null headers (omit placemarker nulls)
  getHeaders() {
    const t = {};
    for (const [e, i] of Object.entries(this._header))
      i !== null && (t[e] = i);
    return t;
  }
  loadPgn(t, { strict: e = !1, newlineChar: i = `\r?
` } = {}) {
    i !== `\r?
` && (t = t.replace(new RegExp(i, "g"), `
`));
    const n = Df(t);
    this.reset();
    const o = n.headers;
    let r = "";
    for (const c in o)
      c.toLowerCase() === "fen" && (r = o[c]), this.header(c, o[c]);
    if (!e)
      r && this.load(r, { preserveHeaders: !0 });
    else if (o.SetUp === "1") {
      if (!("FEN" in o))
        throw new Error("Invalid PGN: FEN tag must be supplied with SetUp tag");
      this.load(o.FEN, { preserveHeaders: !0 });
    }
    let a = n.root;
    for (; a; ) {
      if (a.move) {
        const c = this._moveFromSan(a.move, e);
        if (c == null)
          throw new Error(`Invalid move in PGN: ${a.move}`);
        this._makeMove(c), this._incPositionCount();
      }
      a.comment !== void 0 && (this._comments[this.fen()] = a.comment), a = a.variations[0];
    }
    const l = n.result;
    l && Object.keys(this._header).length && this._header.Result !== l && this.setHeader("Result", l);
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
  _moveToSan(t, e) {
    let i = "";
    if (t.flags & $.KSIDE_CASTLE)
      i = "O-O";
    else if (t.flags & $.QSIDE_CASTLE)
      i = "O-O-O";
    else {
      if (t.flags & $.NULL_MOVE)
        return Bs;
      if (t.piece !== ut) {
        const n = Xf(t, e);
        i += t.piece.toUpperCase() + n;
      }
      t.flags & ($.CAPTURE | $.EP_CAPTURE) && (t.piece === ut && (i += mt(t.from)[0]), i += "x"), i += mt(t.to), t.promotion && (i += "=" + t.promotion.toUpperCase());
    }
    return this._makeMove(t), this.isCheck() && (this.isCheckmate() ? i += "#" : i += "+"), this._undoMove(), i;
  }
  // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
  _moveFromSan(t, e = !1) {
    let i = Hs(t);
    if (e || (i === "0-0" ? i = "O-O" : i === "0-0-0" && (i = "O-O-O")), i == Bs)
      return {
        color: this._turn,
        from: 0,
        to: 0,
        piece: "k",
        flags: $.NULL_MOVE
      };
    let n = mr(i), o = this._moves({ legal: !0, piece: n });
    for (let d = 0, f = o.length; d < f; d++)
      if (i === Hs(this._moveToSan(o[d], o)))
        return o[d];
    if (e)
      return null;
    let r, a, l, c, h, u = !1;
    if (a = i.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/), a ? (r = a[1], l = a[2], c = a[3], h = a[4], l.length == 1 && (u = !0)) : (a = i.match(/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/), a && (r = a[1], l = a[2], c = a[3], h = a[4], l.length == 1 && (u = !0))), n = mr(i), o = this._moves({
      legal: !0,
      piece: r || n
    }), !c)
      return null;
    for (let d = 0, f = o.length; d < f; d++)
      if (l) {
        if ((!r || r.toLowerCase() == o[d].piece) && B[l] == o[d].from && B[c] == o[d].to && (!h || h.toLowerCase() == o[d].promotion))
          return o[d];
        if (u) {
          const g = mt(o[d].from);
          if ((!r || r.toLowerCase() == o[d].piece) && B[c] == o[d].to && (l == g[0] || l == g[1]) && (!h || h.toLowerCase() == o[d].promotion))
            return o[d];
        }
      } else if (i === Hs(this._moveToSan(o[d], o)).replace("x", ""))
        return o[d];
    return null;
  }
  ascii() {
    let t = `   +------------------------+
`;
    for (let e = B.a8; e <= B.h1; e++) {
      if (xi(e) === 0 && (t += " " + "87654321"[Te(e)] + " |"), this._board[e]) {
        const i = this._board[e].type, o = this._board[e].color === xt ? i.toUpperCase() : i.toLowerCase();
        t += " " + o + " ";
      } else
        t += " . ";
      e + 1 & 136 && (t += `|
`, e += 8);
    }
    return t += `   +------------------------+
`, t += "     a  b  c  d  e  f  g  h", t;
  }
  perft(t) {
    const e = this._moves({ legal: !1 });
    let i = 0;
    const n = this._turn;
    for (let o = 0, r = e.length; o < r; o++)
      this._makeMove(e[o]), this._isKingAttacked(n) || (t - 1 > 0 ? i += this.perft(t - 1) : i++), this._undoMove();
    return i;
  }
  setTurn(t) {
    return this._turn == t ? !1 : (this.move("--"), !0);
  }
  turn() {
    return this._turn;
  }
  board() {
    const t = [];
    let e = [];
    for (let i = B.a8; i <= B.h1; i++)
      this._board[i] == null ? e.push(null) : e.push({
        square: mt(i),
        type: this._board[i].type,
        color: this._board[i].color
      }), i + 1 & 136 && (t.push(e), e = [], i += 8);
    return t;
  }
  squareColor(t) {
    if (t in B) {
      const e = B[t];
      return (Te(e) + xi(e)) % 2 === 0 ? "light" : "dark";
    }
    return null;
  }
  history({ verbose: t = !1 } = {}) {
    const e = [], i = [];
    for (; this._history.length > 0; )
      e.push(this._undoMove());
    for (; ; ) {
      const n = e.pop();
      if (!n)
        break;
      t ? i.push(new Bi(this, n)) : i.push(this._moveToSan(n, this._moves())), this._makeMove(n);
    }
    return i;
  }
  /*
   * Keeps track of position occurrence counts for the purpose of repetition
   * checking. Old positions are removed from the map if their counts are reduced to 0.
   */
  _getPositionCount(t) {
    return this._positionCount.get(t) ?? 0;
  }
  _incPositionCount() {
    this._positionCount.set(this._hash, (this._positionCount.get(this._hash) ?? 0) + 1);
  }
  _decPositionCount(t) {
    const e = this._positionCount.get(t) ?? 0;
    e === 1 ? this._positionCount.delete(t) : this._positionCount.set(t, e - 1);
  }
  _pruneComments() {
    const t = [], e = {}, i = (n) => {
      n in this._comments && (e[n] = this._comments[n]);
    };
    for (; this._history.length > 0; )
      t.push(this._undoMove());
    for (i(this.fen()); ; ) {
      const n = t.pop();
      if (!n)
        break;
      this._makeMove(n), i(this.fen());
    }
    this._comments = e;
  }
  getComment() {
    return this._comments[this.fen()];
  }
  setComment(t) {
    this._comments[this.fen()] = t.replace("{", "[").replace("}", "]");
  }
  /**
   * @deprecated Renamed to `removeComment` for consistency
   */
  deleteComment() {
    return this.removeComment();
  }
  removeComment() {
    const t = this._comments[this.fen()];
    return delete this._comments[this.fen()], t;
  }
  getComments() {
    return this._pruneComments(), Object.keys(this._comments).map((t) => ({ fen: t, comment: this._comments[t] }));
  }
  /**
   * @deprecated Renamed to `removeComments` for consistency
   */
  deleteComments() {
    return this.removeComments();
  }
  removeComments() {
    return this._pruneComments(), Object.keys(this._comments).map((t) => {
      const e = this._comments[t];
      return delete this._comments[t], { fen: t, comment: e };
    });
  }
  setCastlingRights(t, e) {
    for (const n of [dt, ce])
      e[n] !== void 0 && (e[n] ? this._castling[t] |= Hi[n] : this._castling[t] &= ~Hi[n]);
    this._updateCastlingRights();
    const i = this.getCastlingRights(t);
    return (e[dt] === void 0 || e[dt] === i[dt]) && (e[ce] === void 0 || e[ce] === i[ce]);
  }
  getCastlingRights(t) {
    return {
      [dt]: (this._castling[t] & Hi[dt]) !== 0,
      [ce]: (this._castling[t] & Hi[ce]) !== 0
    };
  }
  moveNumber() {
    return this._moveNumber;
  }
}
const Gf = /%cal\s+([^%\s]+)/g, Qf = /%csl\s+([^%\s]+)/g, br = /%(?:cal|csl)\s+[^%\s]+/, Jf = /^[a-h][1-8]$/, Zf = /(?:\[\s*)?%eval\s+([^\]\s}]+)(?:\s*\])?/gi, tg = /^[-+]?((\d+(?:\.\d+)?)|(?:\.\d+))$/, eg = (s) => {
  const t = s.trim();
  if (tg.test(t)) {
    const e = Number(t);
    if (!Number.isNaN(e))
      return e;
  }
  return t;
}, qs = {
  R: "#ff0000",
  // Red
  G: "#00ff00",
  // Green
  Y: "#ffff00",
  // Yellow
  B: "#0000ff"
  // Blue
};
class zt {
  /**
   * Check if a comment contains visual annotations
   */
  static hasVisualAnnotations(t) {
    return br.test(t);
  }
  /**
   * Parse visual annotations from a PGN comment
   */
  static parseComment(t) {
    let e = t.startsWith("{") && t.endsWith("}") ? t.substring(1, t.length - 1) : t;
    const i = [], n = [];
    let o;
    const r = [...e.matchAll(Gf)];
    for (const c of r) {
      const h = c[1].split(",");
      for (const u of h) {
        const d = u.trim();
        if (d.length >= 5) {
          const f = d[0], g = d.slice(1, 3), p = d.slice(3, 5);
          zt.isValidSquare(g) && zt.isValidSquare(p) && i.push({
            from: g,
            to: p,
            color: zt.colorToHex(f)
          });
        }
      }
      e = e.replace(c[0], " ");
    }
    const a = [...e.matchAll(Qf)];
    for (const c of a) {
      const h = c[1].split(",");
      for (const u of h) {
        const d = u.trim();
        if (d.length >= 3) {
          const f = d[0], g = d.slice(1, 3);
          zt.isValidSquare(g) && n.push({
            square: g,
            type: "circle",
            // Cast to avoid type issues
            color: zt.colorToHex(f)
          });
        }
      }
      e = e.replace(c[0], " ");
    }
    e = e.replace(Zf, (c, h) => (o = eg(h), " "));
    let l = e.replace(/\s+/g, " ").trim();
    return {
      arrows: i,
      highlights: n,
      textComment: l || "",
      evaluation: o
    };
  }
  /**
   * Returns drawing objects from parsed annotations
   */
  static toDrawingObjects(t) {
    return {
      arrows: t.arrows,
      highlights: t.highlights
    };
  }
  /**
   * Remove visual annotations from a comment, keeping only text
   */
  static stripAnnotations(t) {
    return t.replace(new RegExp(br.source, "g"), "").replace(/\s+/g, " ").trim();
  }
  /**
   * Create annotation string from arrows and circles
   */
  static fromDrawingObjects(t, e) {
    const i = [];
    if (t.length > 0) {
      const n = t.map((o) => `${zt.hexToColor(o.color)}${o.from}${o.to}`).join(",");
      i.push(`%cal ${n}`);
    }
    if (e.length > 0) {
      const n = e.map((o) => `${zt.hexToColor(o.color)}${o.square}`).join(",");
      i.push(`%csl ${n}`);
    }
    return i.join(" ");
  }
  /**
   * Convert color code to hex color
   */
  static colorToHex(t) {
    return qs[t] || qs.R;
  }
  /**
   * Convert hex color to color code
   */
  static hexToColor(t) {
    for (const [e, i] of Object.entries(qs))
      if (i === t)
        return e;
    return "R";
  }
  /**
   * Check if a string is a valid chess square notation
   */
  static isValidSquare(t) {
    return Jf.test(t);
  }
}
class ui {
  constructor(t) {
    this.rulesAdapter = t, this.metadata = {
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
  setMetadata(t) {
    this.metadata = { ...this.metadata, ...t }, this.metadata.Event || (this.metadata.Event = "Casual Game"), this.metadata.Site || (this.metadata.Site = "Neo Chess Board"), this.metadata.Date || (this.metadata.Date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0].replace(/-/g, ".")), this.metadata.Round || (this.metadata.Round = "1"), this.metadata.White || (this.metadata.White = "Player 1"), this.metadata.Black || (this.metadata.Black = "Player 2"), this.metadata.Result || (this.metadata.Result = this.result);
  }
  getMetadata() {
    return { ...this.metadata };
  }
  /**
   * Add a move to the game
   */
  addMove(t, e, i, n, o) {
    const r = this.moves.findIndex((a) => a.moveNumber === t);
    if (r >= 0) {
      const a = this.moves[r];
      e && (a.white = e), i && (a.black = i), n && (a.whiteComment = n), o && (a.blackComment = o), a.whiteAnnotations || (a.whiteAnnotations = { arrows: [], circles: [], textComment: "" }), a.blackAnnotations || (a.blackAnnotations = { arrows: [], circles: [], textComment: "" });
    } else
      this.moves.push({
        moveNumber: t,
        white: e,
        black: i,
        whiteComment: n,
        blackComment: o,
        whiteAnnotations: { arrows: [], circles: [], textComment: "" },
        blackAnnotations: { arrows: [], circles: [], textComment: "" }
      });
  }
  /**
   * Set the game result
   */
  setResult(t) {
    this.result = t, this.metadata.Result = t;
  }
  /**
   * Import moves from a chess.js game
   */
  importFromChessJs(t) {
    try {
      if (this.rulesAdapter && typeof this.rulesAdapter.getPGN == "function") {
        const e = this.rulesAdapter.getPGN();
        this.parsePgnMoves(e);
      } else if (typeof t.pgn == "function") {
        const e = t.pgn();
        this.parsePgnMoves(e);
      } else {
        const e = t.history({ verbose: !0 });
        this.moves = [];
        for (let i = 0; i < e.length; i++) {
          const n = e[i], o = Math.floor(i / 2) + 1;
          if (i % 2 === 0)
            this.addMove(o, n.san);
          else {
            const a = this.moves.find((l) => l.moveNumber === o);
            a ? a.black = n.san : this.addMove(o, void 0, n.san);
          }
        }
      }
    } catch (e) {
      console.warn("Failed to import proper PGN notation, using fallback:", e);
      const i = t.history();
      this.moves = [];
      for (let n = 0; n < i.length; n += 2) {
        const o = Math.floor(n / 2) + 1, r = i[n], a = i[n + 1];
        this.addMove(o, r, a);
      }
    }
    t.isCheckmate() ? this.setResult(t.turn() === "w" ? "0-1" : "1-0") : t.isStalemate() || t.isThreefoldRepetition() || t.isInsufficientMaterial() ? this.setResult("1/2-1/2") : this.setResult("*");
  }
  /**
   * Parse PGN move text to extract individual moves
   */
  parsePgnMoves(t) {
    this.moves = [];
    let e = t.replace(/\{[^}]*\}/g, "").replace(/\([^)]*\)/g, "");
    const i = /\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, n = e.match(i);
    n && (this.setResult(n[1]), e = e.replace(i, ""));
    const o = /(\d+)\.\s*([^\s]+)(?:\s+([^\s]+))?/g;
    let r;
    for (; (r = o.exec(e)) !== null; ) {
      const a = parseInt(r[1]), l = r[2], c = r[3];
      if (l && !["1-0", "0-1", "1/2-1/2", "*"].includes(l)) {
        const h = c && !["1-0", "0-1", "1/2-1/2", "*"].includes(c) ? c : void 0;
        this.addMove(a, l, h);
      }
    }
  }
  /**
   * Generate the complete PGN string
   */
  toPgn(t = !0) {
    let e = "";
    if (t) {
      const o = ["Event", "Site", "Date", "Round", "White", "Black", "Result"];
      for (const r of o)
        this.metadata[r] && (e += `[${r} "${this.metadata[r]}"]
`);
      for (const [r, a] of Object.entries(this.metadata))
        !o.includes(r) && a && (e += `[${r} "${a}"]
`);
      e += `
`;
    }
    if (this.moves.length === 0 && !t)
      return this.result;
    let i = 0;
    const n = 80;
    for (const o of this.moves) {
      let r = `${o.moveNumber}.`;
      o.white && (r += ` ${o.white}`, o.whiteComment && (r += ` {${o.whiteComment}}`)), o.black && (r += ` ${o.black}`, o.blackComment && (r += ` {${o.blackComment}}`)), i + r.length + 1 > n && (e += `
`, i = 0), i > 0 && (e += " ", i++), e += r, i += r.length;
    }
    return this.result !== "*" && (i > 0 && this.moves.length > 0 && (e += " "), e += this.result), e.trim();
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
  static fromMoveList(t, e) {
    const i = new ui();
    i.setMetadata(e || {});
    for (let n = 0; n < t.length; n += 2) {
      const o = Math.floor(n / 2) + 1, r = t[n], a = t[n + 1];
      i.addMove(o, r, a);
    }
    return i.toPgn();
  }
  /**
   * Download PGN as file (browser only)
   */
  downloadPgn(t = "game.pgn") {
    if (typeof window < "u" && window.document) {
      const e = new Blob([this.toPgnWithAnnotations()], { type: "application/x-chess-pgn" }), i = URL.createObjectURL(e), n = document.createElement("a");
      n.href = i, n.download = t, document.body.appendChild(n), n.click(), document.body.removeChild(n), URL.revokeObjectURL(i);
    }
  }
  /**
   * Add visual annotations to a move
   */
  addMoveAnnotations(t, e, i) {
    const n = this.moves.findIndex((o) => o.moveNumber === t);
    if (n >= 0) {
      const o = this.moves[n];
      e ? (o.whiteAnnotations = i, this.updateMoveEvaluation(o, "white", i.evaluation)) : (o.blackAnnotations = i, this.updateMoveEvaluation(o, "black", i.evaluation));
    }
  }
  /**
   * Parse a PGN string with comments containing visual annotations
   */
  loadPgnWithAnnotations(t) {
    const e = t.split(`
`);
    let i = !1, n = "";
    for (const o of e)
      if (o.startsWith("[")) {
        const r = o.match(/\[(\w+)\s+\"([^\"]*)\"\]/);
        r && (this.metadata[r[1]] = r[2]);
      } else o.trim() && !o.startsWith("[") && (i = !0, n += o + " ");
    i && this.parseMovesWithAnnotations(n);
  }
  /**
   * Parse moves string with embedded annotations
   */
  parseMovesWithAnnotations(t) {
    this.moves = [];
    const e = /(\d+)\.(?!\d)(\.{2})?/g, i = (o) => {
      let r = o;
      const a = [], l = t.length, c = () => {
        for (; r < l && /\s/.test(t[r]); )
          r++;
      }, h = () => {
        for (; c(), !(r >= l || t[r] !== "{"); ) {
          const g = t.indexOf("}", r + 1);
          if (g === -1) {
            const m = t.slice(r + 1).trim();
            m && a.push(m), r = l;
            break;
          }
          const p = t.slice(r + 1, g).trim();
          p && a.push(p), r = g + 1;
        }
      };
      if (h(), c(), r >= l)
        return { san: void 0, comments: a, nextIndex: r };
      const u = t.slice(r);
      if (/^(\d+)\.(?!\d)(\.{2})?/.test(u) || /^(1-0|0-1|1\/2-1\/2|\*)/.test(u))
        return { san: void 0, comments: a, nextIndex: r };
      const d = u.match(/^([^\s{]+)/);
      if (!d)
        return { san: void 0, comments: a, nextIndex: r };
      const f = d[1];
      return r += f.length, h(), { san: f, comments: a, nextIndex: r };
    };
    let n;
    for (; (n = e.exec(t)) !== null; ) {
      const o = parseInt(n[1], 10), r = !!n[2];
      let a = e.lastIndex, l = this.moves.find((h) => h.moveNumber === o);
      if (l ? (l.whiteAnnotations || (l.whiteAnnotations = { arrows: [], circles: [], textComment: "" }), l.blackAnnotations || (l.blackAnnotations = { arrows: [], circles: [], textComment: "" })) : (l = {
        moveNumber: o,
        whiteAnnotations: { arrows: [], circles: [], textComment: "" },
        blackAnnotations: { arrows: [], circles: [], textComment: "" }
      }, this.moves.push(l)), !r) {
        const h = i(a);
        if (a = h.nextIndex, h.san && (l.white = h.san, h.comments.length > 0)) {
          const u = this.normalizeCommentParts(h.comments);
          if (u) {
            const d = zt.parseComment(u);
            l.whiteComment = u, l.whiteAnnotations = {
              arrows: d.arrows,
              circles: d.highlights,
              textComment: d.textComment,
              evaluation: d.evaluation
            }, this.updateMoveEvaluation(l, "white", d.evaluation);
          }
        }
      }
      const c = i(a);
      if (c.san && (l.black = c.san, c.comments.length > 0)) {
        const h = this.normalizeCommentParts(c.comments);
        if (h) {
          const u = zt.parseComment(h);
          l.blackComment = h, l.blackAnnotations = {
            arrows: u.arrows,
            circles: u.highlights,
            textComment: u.textComment,
            evaluation: u.evaluation
          }, this.updateMoveEvaluation(l, "black", u.evaluation);
        }
      }
    }
  }
  static formatEvaluation(t) {
    return `[%eval ${String(t).trim()}]`;
  }
  updateMoveEvaluation(t, e, i) {
    if (typeof i < "u") {
      t.evaluation = { ...t.evaluation || {}, [e]: i };
      return;
    }
    t.evaluation && (e === "white" ? delete t.evaluation.white : delete t.evaluation.black, typeof t.evaluation.white > "u" && typeof t.evaluation.black > "u" && (t.evaluation = void 0));
  }
  normalizeCommentParts(t) {
    const e = t.map((n) => n.trim()).filter((n) => n.length > 0);
    if (e.length === 0)
      return;
    const i = e.join(" ").replace(/\s+/g, " ").trim();
    if (i)
      return `{${i}}`;
  }
  /**
   * Generate PGN with visual annotations embedded in comments
   */
  toPgnWithAnnotations() {
    var o, r;
    let t = "";
    const e = ["Event", "Site", "Date", "Round", "White", "Black", "Result"];
    for (const a of e)
      this.metadata[a] && (t += `[${a} "${this.metadata[a]}"]
`);
    for (const [a, l] of Object.entries(this.metadata))
      !e.includes(a) && l && (t += `[${a} "${l}"]
`);
    t += `
`;
    let i = 0;
    const n = 80;
    for (const a of this.moves) {
      let l = `${a.moveNumber}.`;
      if (a.white) {
        l += ` ${a.white}`;
        let c = "";
        if (a.whiteAnnotations) {
          const h = [], u = zt.fromDrawingObjects(
            a.whiteAnnotations.arrows || [],
            a.whiteAnnotations.circles || []
          );
          u && h.push(u), typeof a.whiteAnnotations.evaluation < "u" && h.push(ui.formatEvaluation(a.whiteAnnotations.evaluation));
          const d = (o = a.whiteAnnotations.textComment) == null ? void 0 : o.trim();
          d && h.push(d), c = h.join(" ").trim();
        } else a.whiteComment && (c = a.whiteComment);
        c && (l += ` {${c}}`);
      }
      if (a.black) {
        l += ` ${a.black}`;
        let c = "";
        if (a.blackAnnotations) {
          const h = [], u = zt.fromDrawingObjects(
            a.blackAnnotations.arrows || [],
            a.blackAnnotations.circles || []
          );
          u && h.push(u), typeof a.blackAnnotations.evaluation < "u" && h.push(ui.formatEvaluation(a.blackAnnotations.evaluation));
          const d = (r = a.blackAnnotations.textComment) == null ? void 0 : r.trim();
          d && h.push(d), c = h.join(" ").trim();
        } else a.blackComment && (c = a.blackComment);
        c && (l += ` {${c}}`);
      }
      i + l.length + 1 > n && (t += `
`, i = 0), i > 0 && (t += " ", i++), t += l, i += l.length;
    }
    return this.result !== "*" && (i > 0 && (t += " "), t += this.result), t.trim();
  }
  /**
   * Get annotations for a specific move
   */
  getMoveAnnotations(t, e) {
    const i = this.moves.find((n) => n.moveNumber === t);
    if (i)
      return e ? i.whiteAnnotations : i.blackAnnotations;
  }
  /**
   * Get all moves with their annotations
   */
  getMovesWithAnnotations() {
    return [...this.moves];
  }
}
class ms {
  getFenParts(t) {
    const i = (t ?? this.chess.fen()).trim().split(/\s+/);
    return i.length < 6 ? i.concat(new Array(6 - i.length).fill("")) : i;
  }
  getChessInstance() {
    return this.chess;
  }
  constructor(t) {
    this.chess = new $s(t), this.pgnNotation = new ui();
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
  setFEN(t) {
    try {
      console.log("Attempting to load FEN:", t);
      const e = t.split(" ");
      e.length === 4 ? t += " - 0 1" : e.length === 5 && (t += " 1"), this.chess.load(t);
    } catch (e) {
      throw console.error("Invalid FEN:", t, e), new Error(`Invalid FEN: ${t}`);
    }
  }
  /**
   * Jouer un coup
   */
  move(t) {
    try {
      return this.chess.move({
        from: t.from,
        to: t.to,
        promotion: t.promotion
      }) ? { ok: !0 } : { ok: !1, reason: "Invalid move" };
    } catch (e) {
      return { ok: !1, reason: e.message || "Invalid move" };
    }
  }
  /**
   * Obtenir tous les coups légaux depuis une case
   */
  movesFrom(t) {
    return this.chess.moves({ square: t, verbose: !0 }).map((i) => ({
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
    return this.chess.moves({ verbose: !0 }).map((e) => ({
      from: e.from,
      to: e.to,
      promotion: e.promotion === "k" ? void 0 : e.promotion,
      piece: e.piece,
      captured: e.captured,
      flags: e.flags
    }));
  }
  /**
   * Vérifier si un coup est légal
   */
  isLegalMove(t, e, i) {
    try {
      return new $s(this.chess.fen()).move({
        from: t,
        to: e,
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
  get(t) {
    return this.chess.get(t) || null;
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
    const t = this.chess.turn();
    return fr.filter((e) => this.chess.isAttacked(e, t)).map(
      (e) => e
    );
  }
  /**
   * Vérifier si une case est attaquée
   *
   * @param square Case à vérifier (notation algébrique, insensible à la casse)
   * @param by Couleur optionnelle pour vérifier une couleur spécifique
   * @throws {Error} si la case ou la couleur fournie est invalide
   */
  isSquareAttacked(t, e) {
    if (typeof t != "string")
      throw new Error(`Invalid square: ${t}`);
    const i = t.toLowerCase();
    if (!fr.includes(i))
      throw new Error(`Invalid square: ${t}`);
    let n;
    if (e === void 0)
      n = this.chess.turn();
    else if (e === "w" || e === "b")
      n = e;
    else
      throw new Error(`Invalid color: ${e}`);
    return this.chess.isAttacked(i, n);
  }
  /**
   * Obtenir les cases du roi en échec (pour le surlignage)
   */
  getCheckSquares() {
    if (!this.chess.inCheck()) return [];
    const t = this.getKingSquare(this.chess.turn());
    return t ? [t] : [];
  }
  /**
   * Obtenir la position du roi d'une couleur
   */
  getKingSquare(t) {
    const e = ["a", "b", "c", "d", "e", "f", "g", "h"], i = ["1", "2", "3", "4", "5", "6", "7", "8"];
    for (const n of e)
      for (const o of i) {
        const r = `${n}${o}`, a = this.chess.get(r);
        if (a && a.type === "k" && a.color === t)
          return r;
      }
    return null;
  }
  /**
   * Vérifier si le roque est possible
   */
  canCastle(t, e) {
    const i = e || this.chess.turn(), n = this.chess.getCastlingRights(i);
    return t === "k" ? n.k : n.q;
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
    const e = this.getFenParts()[4] ?? "0", i = Number.parseInt(e, 10);
    return Number.isNaN(i) ? 0 : i;
  }
  /**
   * Créer une copie de l'état actuel
   */
  clone() {
    return new ms(this.chess.fen());
  }
  /**
   * Valider un FEN
   */
  static isValidFEN(t) {
    try {
      return new $s().load(t), !0;
    } catch {
      return !1;
    }
  }
  /**
   * Obtenir des informations sur le dernier coup joué
   */
  getLastMove() {
    const t = this.chess.history({ verbose: !0 });
    return t.length > 0 ? t[t.length - 1] : null;
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
  setPgnMetadata(t) {
    this.pgnNotation.setMetadata(t);
  }
  /**
   * Exporter la partie actuelle au format PGN
   */
  toPgn(t = !0) {
    return this.pgnNotation.importFromChessJs(this.chess), this.pgnNotation.toPgn(t);
  }
  /**
   * Télécharger la partie actuelle sous forme de fichier PGN (navigateur uniquement)
   */
  downloadPgn(t) {
    this.pgnNotation.importFromChessJs(this.chess), this.pgnNotation.downloadPgn(t);
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
  loadPgn(t) {
    try {
      return this.chess.loadPgn(t), this.pgnNotation.importFromChessJs(this.chess), !0;
    } catch {
      return !1;
    }
  }
  /**
   * Obtenir la notation PGN du dernier coup joué
   */
  getLastMoveNotation() {
    const t = this.chess.history();
    return t.length > 0 ? t[t.length - 1] : null;
  }
  /**
   * Obtenir toute l'historique des coups en notation PGN
   */
  getPgnMoves() {
    return this.chess.history();
  }
}
const Ne = {
  color: "rgba(34, 197, 94, 0.6)",
  width: 2,
  opacity: 0.8
}, _r = {
  default: "#ffeb3b",
  shiftKey: "#22c55e",
  ctrlKey: "#ef4444",
  altKey: "#f59e0b"
}, ig = ["shiftKey", "ctrlKey", "altKey"], sg = {
  green: "rgba(34, 197, 94, 0.6)",
  red: "rgba(239, 68, 68, 0.6)",
  blue: "rgba(59, 130, 246, 0.6)",
  yellow: "rgba(245, 158, 11, 0.6)",
  orange: "rgba(249, 115, 22, 0.6)",
  purple: "rgba(168, 85, 247, 0.6)"
}, ze = [
  "green",
  "red",
  "blue",
  "yellow",
  "orange",
  "purple"
], ng = {
  shiftKey: "green",
  ctrlKey: "red",
  altKey: "yellow"
}, og = 0.3, rg = {
  selected: 0.5,
  lastMove: 0.6
}, yr = "rgba(255, 255, 0, 0.5)";
class ag {
  constructor(t) {
    this.state = {
      arrows: [],
      highlights: [],
      premove: void 0
    }, this.squareSize = 60, this.orientation = "white", this.showSquareNames = !1, this.currentAction = { type: "none" }, this.clearAll = this.clearAllDrawings, this.canvas = t, this.updateDimensions();
  }
  updateDimensions() {
    const t = Math.min(this.canvas.width, this.canvas.height);
    this.squareSize = t / 8;
  }
  setOrientation(t) {
    this.orientation = t;
  }
  setShowSquareNames(t) {
    this.showSquareNames = t;
  }
  // Arrow management
  addArrow(t, e, i = Ne.color, n = Ne.width, o = Ne.opacity) {
    const r = typeof t == "object" ? this.normalizeArrow(t) : this.normalizeArrow({
      from: t,
      to: e,
      color: i,
      width: n,
      opacity: o
    }), a = this.findArrowIndex(r.from, r.to);
    if (a >= 0) {
      this.state.arrows[a] = {
        ...this.state.arrows[a],
        ...r
      };
      return;
    }
    this.state.arrows.push(r);
  }
  normalizeArrow(t) {
    const e = t.color ?? Ne.color, i = t.width ?? Ne.width, n = t.opacity ?? Ne.opacity, o = t.knightMove ?? this.isKnightMove(t.from, t.to);
    return {
      from: t.from,
      to: t.to,
      color: e,
      width: i,
      opacity: n,
      knightMove: o
    };
  }
  findArrowIndex(t, e) {
    return this.state.arrows.findIndex(
      (i) => i.from === t && i.to === e
    );
  }
  removeArrow(t, e) {
    const i = this.findArrowIndex(t, e);
    i >= 0 && this.state.arrows.splice(i, 1);
  }
  clearArrows() {
    this.state.arrows = [];
  }
  getArrows() {
    return this.state.arrows.map((t) => ({ ...t }));
  }
  // Highlight management
  addHighlight(t, e = "green", i) {
    const n = i ?? this.getDefaultHighlightOpacity(e), o = this.findHighlightIndex(t);
    if (o >= 0) {
      this.state.highlights[o] = {
        ...this.state.highlights[o],
        type: e,
        opacity: n
      };
      return;
    }
    this.state.highlights.push({
      square: t,
      type: e,
      opacity: n
    });
  }
  getDefaultHighlightOpacity(t) {
    return rg[t] ?? og;
  }
  findHighlightIndex(t) {
    return this.state.highlights.findIndex((e) => e.square === t);
  }
  removeHighlight(t) {
    const e = this.findHighlightIndex(t);
    e >= 0 && this.state.highlights.splice(e, 1);
  }
  clearHighlights() {
    this.state.highlights = [];
  }
  /**
   * Get the pixel coordinates of the top-left corner of a square
   * @param square The square in algebraic notation (e.g., 'a1', 'h8')
   * @returns An object with x and y coordinates
   */
  getSquareCoordinates(t) {
    const e = t[0].toLowerCase(), i = parseInt(t[1], 10);
    let n = e.charCodeAt(0) - 97, o = 8 - i;
    return this.orientation === "black" && (n = 7 - n, o = 7 - o), {
      x: n * this.squareSize,
      y: o * this.squareSize
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
  getSquareCenter(t) {
    const { x: e, y: i } = this.getSquareCoordinates(t), n = this.squareSize / 2;
    return {
      x: e + n,
      y: i + n
    };
  }
  getHighlights() {
    return this.state.highlights.map((t) => ({ ...t }));
  }
  // Premove management
  setPremove(t, e, i) {
    this.state.premove = { from: t, to: e, promotion: i };
  }
  clearPremove() {
    this.state.premove = void 0;
  }
  getPremove() {
    return this.state.premove;
  }
  // Coordinate utilities
  squareToCoords(t) {
    const e = t.charCodeAt(0) - 97, i = parseInt(t[1]) - 1;
    return this.orientation === "white" ? [e * this.squareSize, (7 - i) * this.squareSize] : [(7 - e) * this.squareSize, i * this.squareSize];
  }
  coordsToSquare(t, e) {
    const i = Math.floor(t / this.squareSize), n = Math.floor(e / this.squareSize);
    let o, r;
    this.orientation === "white" ? (o = i, r = 7 - n) : (o = 7 - i, r = n);
    const a = String.fromCharCode(97 + o), l = (r + 1).toString();
    return `${a}${l}`;
  }
  // Knight move detection
  isKnightMove(t, e) {
    const i = t.charCodeAt(0) - 97, n = parseInt(t[1]) - 1, o = e.charCodeAt(0) - 97, r = parseInt(e[1]) - 1, a = Math.abs(o - i), l = Math.abs(r - n);
    return a === 1 && l === 2 || a === 2 && l === 1;
  }
  // Square names rendering
  renderSquareNames(t, e, i = 1) {
    const n = this.canvas.getContext("2d");
    if (!n) return;
    n.save(), n.scale(i, i);
    const o = this.squareSize / i, r = this.canvas.height / i, a = Math.max(10, o * 0.18), l = o * 0.12, c = o * 0.12;
    n.font = `500 ${a}px 'Segoe UI', Arial, sans-serif`;
    const h = "rgba(240, 217, 181, 0.7)", u = "rgba(181, 136, 99, 0.7)", d = t === "white" ? 0 : 7, f = t === "white" ? 0 : 7;
    n.textAlign = "left", n.textBaseline = "alphabetic";
    for (let g = 0; g < 8; g++) {
      const p = t === "white" ? g : 7 - g, m = String.fromCharCode(97 + p), b = g * o + l, _ = r - l, k = (p + d) % 2 === 0;
      n.fillStyle = k ? h : u, n.fillText(m, b, _);
    }
    n.textBaseline = "middle";
    for (let g = 0; g < 8; g++) {
      const p = t === "white" ? g : 7 - g, m = (p + 1).toString(), b = c, _ = r - (g + 0.5) * o, k = (f + p) % 2 === 0;
      n.fillStyle = k ? h : u, n.fillText(m, b, _);
    }
    n.restore();
  }
  drawArrows(t) {
    t.save();
    for (const e of this.state.arrows)
      this.drawArrow(t, e);
    t.restore();
  }
  drawArrow(t, e) {
    e.knightMove ? this.drawKnightArrow(t, e) : this.drawStraightArrow(t, e);
  }
  applyArrowStyle(t, e) {
    const i = e.width;
    return t.globalAlpha = e.opacity, t.strokeStyle = e.color, t.fillStyle = e.color, t.lineWidth = i, t.lineCap = "round", t.lineJoin = "round", i;
  }
  drawStraightArrow(t, e) {
    const [i, n] = this.squareToCoords(e.from), [o, r] = this.squareToCoords(e.to), a = i + this.squareSize / 2, l = n + this.squareSize / 2, c = o + this.squareSize / 2, h = r + this.squareSize / 2, u = c - a, d = h - l, f = Math.atan2(d, u), g = this.squareSize * 0.25, p = a + Math.cos(f) * g, m = l + Math.sin(f) * g, b = c - Math.cos(f) * g, _ = h - Math.sin(f) * g, k = this.applyArrowStyle(t, e);
    t.beginPath(), t.moveTo(p, m), t.lineTo(b, _), t.stroke();
    const M = k * 3, S = Math.PI / 6;
    t.beginPath(), t.moveTo(b, _), t.lineTo(
      b - M * Math.cos(f - S),
      _ - M * Math.sin(f - S)
    ), t.lineTo(
      b - M * Math.cos(f + S),
      _ - M * Math.sin(f + S)
    ), t.closePath(), t.fill();
  }
  drawKnightArrow(t, e) {
    const [i, n] = this.squareToCoords(e.from), [o, r] = this.squareToCoords(e.to), a = i + this.squareSize / 2, l = n + this.squareSize / 2, c = o + this.squareSize / 2, h = r + this.squareSize / 2, u = c - a, d = h - l, f = Math.abs(u), g = Math.abs(d);
    let p, m;
    f > g ? (p = c, m = l) : (p = a, m = h);
    const b = this.applyArrowStyle(t, e), _ = this.squareSize * 0.2;
    let k = a, M = l, S = c, O = h;
    f > g ? (k += u > 0 ? _ : -_, S += u > 0 ? -_ : _) : (M += d > 0 ? _ : -_, O += d > 0 ? -_ : _), t.beginPath(), t.moveTo(k, M), t.lineTo(p, m), t.lineTo(S, O), t.stroke();
    const C = b * 3, A = Math.PI / 6;
    let L;
    f > g ? L = d > 0 ? Math.PI / 2 : -Math.PI / 2 : L = u > 0 ? 0 : Math.PI, t.beginPath(), t.moveTo(S, O), t.lineTo(
      S - C * Math.cos(L - A),
      O - C * Math.sin(L - A)
    ), t.lineTo(
      S - C * Math.cos(L + A),
      O - C * Math.sin(L + A)
    ), t.closePath(), t.fill();
  }
  // Highlight rendering
  drawHighlights(t) {
    t.save();
    for (const e of this.state.highlights)
      this.drawHighlight(t, e);
    t.restore();
  }
  drawHighlight(t, e) {
    const [i, n] = this.squareToCoords(e.square), o = this.resolveHighlightColor(e), r = e.opacity ?? 0.6;
    t.globalAlpha = r, t.fillStyle = o;
    const a = i + this.squareSize / 2, l = n + this.squareSize / 2, c = this.squareSize * 0.15;
    t.beginPath(), t.arc(a, l, c, 0, 2 * Math.PI), t.fill(), t.globalAlpha = r * 1.5, t.strokeStyle = o, t.lineWidth = 3, t.stroke();
  }
  resolveHighlightColor(t) {
    if (t.type === "circle")
      return t.color ?? yr;
    const e = t.type;
    return sg[e] ?? t.color ?? yr;
  }
  isInHighlightSequence(t) {
    return ze.includes(t);
  }
  getNextHighlightType(t) {
    if (!this.isInHighlightSequence(t))
      return null;
    const i = (ze.indexOf(t) + 1) % ze.length;
    return i === 0 ? null : ze[i];
  }
  getActiveModifier(t) {
    for (const e of ig)
      if (t[e])
        return e;
    return null;
  }
  resolveArrowColor(t) {
    const e = this.getActiveModifier(t);
    return e ? _r[e] : _r.default;
  }
  resolveHighlightTypeFromModifiers(t) {
    const e = this.getActiveModifier(t);
    return e ? ng[e] : ze[0];
  }
  withContext(t) {
    const e = this.canvas.getContext("2d");
    e && t(e);
  }
  // Premove rendering
  drawPremove(t) {
    if (!this.state.premove) return;
    t.save();
    const [e, i] = this.squareToCoords(this.state.premove.from), [n, o] = this.squareToCoords(this.state.premove.to);
    t.globalAlpha = 0.7, t.strokeStyle = "#ff9800", t.lineWidth = 3, t.setLineDash && t.setLineDash([8, 4]), t.lineCap = "round";
    const r = e + this.squareSize / 2, a = i + this.squareSize / 2, l = n + this.squareSize / 2, c = o + this.squareSize / 2;
    t.beginPath(), t.moveTo(r, a), t.lineTo(l, c), t.stroke(), t.setLineDash && t.setLineDash([]), t.fillStyle = "rgba(255, 152, 0, 0.3)", t.fillRect(e, i, this.squareSize, this.squareSize), t.fillRect(n, o, this.squareSize, this.squareSize), t.restore();
  }
  // Methods to get the complete state
  getDrawingState() {
    return {
      arrows: this.getArrows(),
      highlights: this.getHighlights(),
      premove: this.state.premove ? { ...this.state.premove } : void 0
    };
  }
  setDrawingState(t) {
    t.arrows !== void 0 && (this.state.arrows = t.arrows.map((e) => this.normalizeArrow(e))), t.highlights !== void 0 && (this.state.highlights = t.highlights.map((e) => ({ ...e }))), t.premove !== void 0 && (this.state.premove = t.premove ? { ...t.premove } : void 0);
  }
  // Utilities for interactions
  getSquareFromMousePosition(t, e) {
    const i = this.canvas.getBoundingClientRect(), n = (t - i.left) * (this.canvas.width / i.width), o = (e - i.top) * (this.canvas.height / i.height);
    return n < 0 || o < 0 || n >= this.canvas.width || o >= this.canvas.height ? null : this.coordsToSquare(n, o);
  }
  // Cycle highlight colors on right-click
  cycleHighlight(t) {
    const e = this.findHighlightIndex(t);
    if (e >= 0) {
      const i = this.state.highlights[e], n = this.getNextHighlightType(i.type);
      if (!n) {
        this.removeHighlight(t);
        return;
      }
      this.state.highlights[e].type = n;
      return;
    }
    this.addHighlight(t, ze[0]);
  }
  // Complete rendering of all elements
  draw(t) {
    this.drawHighlights(t), this.drawPremove(t), this.drawArrows(t), this.showSquareNames && this._drawSquareNames(t);
  }
  // Check if a point is near an arrow (for deletion)
  getArrowAt(t, e, i = 10) {
    const n = this.canvas.getBoundingClientRect(), o = t - n.left, r = e - n.top;
    for (const a of this.state.arrows)
      if (this.isPointNearArrow(o, r, a, i))
        return { ...a };
    return null;
  }
  isPointNearArrow(t, e, i, n) {
    const [o, r] = this.squareToCoords(i.from), [a, l] = this.squareToCoords(i.to), c = o + this.squareSize / 2, h = r + this.squareSize / 2, u = a + this.squareSize / 2, d = l + this.squareSize / 2, f = Math.sqrt(
      Math.pow(u - c, 2) + Math.pow(d - h, 2)
    );
    return f === 0 ? !1 : Math.abs(
      ((d - h) * t - (u - c) * e + u * h - d * c) / f
    ) <= n;
  }
  // Export/Import for persistence
  exportState() {
    return JSON.stringify(this.getDrawingState());
  }
  importState(t) {
    try {
      const e = JSON.parse(t);
      this.setDrawingState(e);
    } catch (e) {
      console.warn("Failed to import drawing state:", e);
    }
  }
  // Interaction methods for NeoChessBoard
  handleMouseDown(t, e, i, n) {
    return !1;
  }
  handleRightMouseDown(t, e, i = !1, n = !1, o = !1) {
    const r = this.coordsToSquare(t, e);
    return this.currentAction = { type: "drawing_arrow", startSquare: r, shiftKey: i, ctrlKey: n, altKey: o }, !0;
  }
  handleMouseMove(t, e) {
    return !1;
  }
  handleMouseUp(t, e) {
    return this.cancelCurrentAction(), !1;
  }
  handleRightMouseUp(t, e) {
    if (this.currentAction.type !== "drawing_arrow")
      return this.cancelCurrentAction(), !1;
    const i = this.currentAction, n = this.coordsToSquare(t, e);
    if (n === i.startSquare)
      return this.cancelCurrentAction(), !1;
    const o = this.resolveArrowColor(i);
    return this.state.arrows.find(
      (a) => a.from === i.startSquare && a.to === n && a.color === o
    ) ? this.removeArrow(i.startSquare, n) : this.addArrow(i.startSquare, n, o), this.cancelCurrentAction(), !0;
  }
  handleHighlightClick(t, e = !1, i = !1, n = !1) {
    if (!e && !i && !n) {
      this.cycleHighlight(t);
      return;
    }
    const o = { shiftKey: e, ctrlKey: i, altKey: n }, r = this.resolveHighlightTypeFromModifiers(o);
    if (this.state.highlights.findIndex(
      (l) => l.square === t && l.type === r
    ) >= 0) {
      this.removeHighlight(t);
      return;
    }
    this.addHighlight(t, r);
  }
  renderPremove() {
    this.withContext((t) => this.drawPremove(t));
  }
  renderHighlights() {
    this.withContext((t) => this.drawHighlights(t));
  }
  // Methods with signatures adapted for NeoChessBoard
  addArrowFromObject(t) {
    this.addArrow(t.from, t.to, t.color, t.width, t.opacity);
  }
  addHighlightFromObject(t) {
    this.addHighlight(t.square, t.type, t.opacity);
  }
  setPremoveFromObject(t) {
    this.setPremove(t.from, t.to, t.promotion);
  }
  _drawSquareNames(t) {
    t.save(), t.font = `${Math.floor(this.squareSize * 0.18)}px ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto`, t.fillStyle = "rgba(0,0,0,0.35)";
    for (let e = 0; e < 8; e++)
      for (let i = 0; i < 8; i++) {
        const n = this.coordsToSquare(i * this.squareSize, e * this.squareSize), [o, r] = this.squareToCoords(n);
        if (e === (this.orientation === "white" ? 7 : 0)) {
          const a = this.orientation === "white" ? as[i] : as[7 - i];
          t.textAlign = this.orientation === "white" ? "left" : "right", t.textBaseline = "bottom", t.fillText(
            a,
            o + (this.orientation === "white" ? this.squareSize * 0.06 : this.squareSize - this.squareSize * 0.06),
            r + this.squareSize - this.squareSize * 0.06
          );
        }
        if (i === (this.orientation === "white" ? 0 : 7)) {
          const a = Cn[7 - e];
          t.textAlign = this.orientation === "white" ? "left" : "right", t.textBaseline = this.orientation === "white" ? "top" : "bottom", t.fillText(
            a,
            o + (this.orientation === "white" ? this.squareSize * 0.06 : this.squareSize - this.squareSize * 0.06),
            r + (this.orientation === "white" ? this.squareSize * 0.06 : this.squareSize - this.squareSize * 0.06)
          );
        }
      }
    t.restore();
  }
  // Additional helper methods for integration with NeoChessBoard
  /**
   * Render arrows on the canvas
   */
  renderArrows() {
    this.withContext((t) => this.drawArrows(t));
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
class lg {
  /**
   * Creates an instance of NeoChessBoard.
   * @param root The HTMLElement to which the board will be appended.
   * @param options Optional configuration options for the board.
   */
  constructor(t, e = {}) {
    this.bus = new wf(), this.sizePx = 480, this.square = 60, this.dpr = 1, this.customPieceSprites = {}, this._pieceSetToken = 0, this.moveSound = null, this.moveSounds = {}, this._lastMove = null, this._premove = null, this._selected = null, this._legalCached = null, this._dragging = null, this._hoverSq = null, this._arrows = [], this._customHighlights = null, this._raf = 0, this._drawingArrow = null, this.root = t;
    const i = e.theme ?? "classic";
    this.theme = ur(i), this.orientation = e.orientation || "white", this.interactive = e.interactive !== !1, this.showCoords = e.showCoordinates || !1, this.highlightLegal = e.highlightLegal !== !1, this.animationMs = e.animationMs || 300, this.allowPremoves = e.allowPremoves !== !1, this.showArrows = e.showArrows !== !1, this.showHighlights = e.showHighlights !== !1, this.rightClickHighlights = e.rightClickHighlights !== !1, this.soundEnabled = e.soundEnabled !== !1, this.showSquareNames = e.showSquareNames || !1, this.autoFlip = e.autoFlip ?? !1, this.soundUrl = e.soundUrl, this.soundUrls = e.soundUrls, this._initializeSound(), this.rules = e.rulesAdapter || new ms(), e.fen && this.rules.setFEN(e.fen), this.state = Qe(this.rules.getFEN()), this._syncOrientationFromTurn(!0), this._buildDOM(), this._attachEvents(), this.resize(), e.pieceSet && this.setPieceSet(e.pieceSet);
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
  setPosition(t, e = !1) {
    this.setFEN(t, e);
  }
  /**
   * Registers an event handler for a specific board event.
   * @param event The name of the event to listen for.
   * @param handler The callback function to execute when the event is emitted.
   * @returns A function to unsubscribe the event handler.
   */
  on(t, e) {
    return this.bus.on(t, e);
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
  setTheme(t) {
    this.applyTheme(t);
  }
  /**
   * Applies a theme object directly, normalizing it and re-rendering the board.
   * @param theme Theme name or object to apply.
   */
  applyTheme(t) {
    this.theme = ur(t), this._rasterize(), this.renderAll();
  }
  /**
   * Applies a custom piece set, allowing users to provide their own sprites.
   * Passing `undefined` or an empty configuration reverts to the default flat sprites.
   * @param pieceSet Custom piece configuration to apply.
   */
  async setPieceSet(t) {
    if (!t || !t.pieces || Object.keys(t.pieces).length === 0) {
      if (!this._pieceSetRaw && Object.keys(this.customPieceSprites).length === 0)
        return;
      this._pieceSetRaw = void 0, this.customPieceSprites = {}, this._pieceSetToken++, this.renderAll();
      return;
    }
    if (t === this._pieceSetRaw)
      return;
    this._pieceSetRaw = t;
    const e = ++this._pieceSetToken, i = t.defaultScale ?? 1, n = {}, o = Object.entries(t.pieces);
    await Promise.all(
      o.map(async ([r, a]) => {
        if (a)
          try {
            const l = await this._resolvePieceSprite(a, i);
            l && (n[r] = l);
          } catch (l) {
            console.warn(`[NeoChessBoard] Failed to load sprite for piece "${r}".`, l);
          }
      })
    ), e === this._pieceSetToken && (this.customPieceSprites = n, this.renderAll());
  }
  /**
   * Sets the board position using a FEN string.
   * @param fen The FEN string representing the board state.
   * @param immediate If true, the board updates instantly without animation.
   */
  setFEN(t, e = !1) {
    const i = this.state, n = this.state.turn;
    this.rules.setFEN(t), this.state = Qe(this.rules.getFEN()), this._syncOrientationFromTurn(!1), this._lastMove = null;
    const o = this.state.turn;
    n !== o && this._executePremoveIfValid(), this._premove = null, e ? (this._clearAnim(), this.renderAll()) : this._animateTo(this.state, i), this.bus.emit("update", { fen: this.getPosition() });
  }
  // ---- DOM & render ----
  _buildDOM() {
    this.root.classList.add("ncb-root"), this.root.style.position = "relative", this.root.style.userSelect = "none", this.cBoard = document.createElement("canvas"), this.cPieces = document.createElement("canvas"), this.cOverlay = document.createElement("canvas");
    for (const e of [this.cBoard, this.cPieces, this.cOverlay])
      Object.assign(e.style, {
        position: "absolute",
        left: "0",
        top: "0",
        width: "100%",
        height: "100%",
        aspectRatio: "606 / 606"
      }), this.root.appendChild(e);
    this.ctxB = this.cBoard.getContext("2d"), this.ctxP = this.cPieces.getContext("2d"), this.ctxO = this.cOverlay.getContext("2d"), this.drawingManager = new ag(this.cOverlay), this.drawingManager.setOrientation(this.orientation), this.drawingManager.setShowSquareNames(this.showSquareNames), this._rasterize();
    const t = new ResizeObserver(() => this.resize());
    if (t.observe(this.root), this._ro = t, typeof document < "u") {
      const e = document.createElement("style");
      e.textContent = ".ncb-root{display:block;max-width:100%;aspect-ratio:auto 606/606;border-radius:14px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.10);} canvas{image-rendering:optimizeQuality;aspect-ratio:auto 606/606;}", document.head.appendChild(e);
    }
  }
  /**
   * Resizes the board canvases based on the root element's dimensions and device pixel ratio.
   * This method is typically called when the board's container changes size.
   */
  resize() {
    const t = this.root.getBoundingClientRect(), e = Math.min(t.width, t.height) || 480, i = globalThis.devicePixelRatio || 1;
    for (const n of [this.cBoard, this.cPieces, this.cOverlay])
      n.width = Math.round(e * i), n.height = Math.round(e * i);
    this.sizePx = e, this.square = e * i / 8, this.dpr = i, this.drawingManager && this.drawingManager.updateDimensions(), this.renderAll();
  }
  /**
   * Initializes or re-initializes the sprite sheet for pieces based on the current theme.
   * This is called when the theme changes or on initial setup.
   */
  _rasterize() {
    this.sprites = new Pf(128, this.theme);
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
  _sqToXY(t) {
    const { f: e, r: i } = cr(t), n = this.orientation === "white" ? e : 7 - e, o = this.orientation === "white" ? 7 - i : i;
    return { x: n * this.square, y: o * this.square };
  }
  /**
   * Draws the chess board squares onto the board canvas.
   * Uses the current theme's light and dark square colors.
   */
  _drawBoard() {
    const t = this.ctxB, e = this.square, i = this.cBoard.width, n = this.cBoard.height, { light: o, dark: r, boardBorder: a } = this.theme;
    t.clearRect(0, 0, i, n), t.fillStyle = a, t.fillRect(0, 0, i, n);
    for (let l = 0; l < 8; l++)
      for (let c = 0; c < 8; c++) {
        const h = (this.orientation === "white" ? c : 7 - c) * e, u = (this.orientation === "white" ? 7 - l : l) * e;
        t.fillStyle = (l + c) % 2 === 0 ? o : r, t.fillRect(h, u, e, e);
      }
  }
  async _resolvePieceSprite(t, e) {
    const i = typeof t == "object" && t !== null && "image" in t ? t : { image: t };
    let n = null;
    return typeof i.image == "string" ? n = await this._loadImage(i.image) : i.image && (n = i.image), n ? {
      image: n,
      scale: i.scale ?? e ?? 1,
      offsetX: i.offsetX ?? 0,
      offsetY: i.offsetY ?? 0
    } : null;
  }
  _loadImage(t) {
    return new Promise((e, i) => {
      var r;
      const n = ((r = this.root) == null ? void 0 : r.ownerDocument) ?? (typeof document < "u" ? document : null), o = typeof Image < "u" ? new Image() : n ? n.createElement("img") : null;
      if (!o) {
        i(new Error("Image loading is not supported in the current environment."));
        return;
      }
      t.startsWith("data:") || (o.crossOrigin = "anonymous");
      try {
        o.decoding = "async";
      } catch {
      }
      o.onload = () => e(o), o.onerror = (a) => i(a instanceof Error ? a : new Error(String(a))), o.src = t;
    });
  }
  /**
   * Draws a single piece sprite onto the pieces canvas.
   * @param piece The FEN notation of the piece (e.g., 'p', 'K').
   * @param x The x-coordinate for the top-left corner of the piece.
   * @param y The y-coordinate for the top-left corner of the piece.
   * @param scale Optional scale factor for the piece (default is 1).
   */
  _drawPieceSprite(t, e, i, n = 1) {
    const o = this.customPieceSprites[t];
    if (o) {
      const p = n * (o.scale ?? 1), m = this.square * p, b = e + (this.square - m) / 2 + o.offsetX * this.square, _ = i + (this.square - m) / 2 + o.offsetY * this.square;
      this.ctxP.drawImage(o.image, b, _, m, m);
      return;
    }
    const r = { k: 0, q: 1, r: 2, b: 3, n: 4, p: 5 }, a = Fe(t), l = r[t.toLowerCase()], c = 128, h = l * c, u = a ? c : 0, d = this.square * n, f = e + (this.square - d) / 2, g = i + (this.square - d) / 2;
    this.ctxP.drawImage(this.sprites.getSheet(), h, u, c, c, f, g, d, d);
  }
  /**
   * Draws all pieces onto the pieces canvas, handling dragging pieces separately.
   */
  _drawPieces() {
    var o;
    const t = this.ctxP, e = this.cPieces.width, i = this.cPieces.height;
    t.clearRect(0, 0, e, i);
    const n = (o = this._dragging) == null ? void 0 : o.from;
    for (let r = 0; r < 8; r++)
      for (let a = 0; a < 8; a++) {
        const l = this.state.board[r][a];
        if (!l) continue;
        const c = Ge(a, r);
        if (n === c) continue;
        const { x: h, y: u } = this._sqToXY(c);
        this._drawPieceSprite(l, h, u, 1);
      }
    if (this._dragging) {
      const { piece: r, x: a, y: l } = this._dragging;
      this._drawPieceSprite(r, a - this.square / 2, l - this.square / 2, 1.05);
    }
  }
  /**
   * Draws the overlay elements such as last move highlights, selected square, legal moves, premoves, and arrows.
   * Delegates to DrawingManager for modern drawing features.
   */
  _drawOverlay() {
    var o;
    const t = this.ctxO, e = this.cOverlay.width, i = this.cOverlay.height;
    t.clearRect(0, 0, e, i);
    const n = this.square;
    if (this._lastMove) {
      const { from: r, to: a } = this._lastMove, l = this._sqToXY(r), c = this._sqToXY(a);
      t.fillStyle = this.theme.lastMove, t.fillRect(l.x, l.y, n, n), t.fillRect(c.x, c.y, n, n);
    }
    if ((o = this._customHighlights) != null && o.squares) {
      t.fillStyle = this.theme.moveTo;
      for (const r of this._customHighlights.squares) {
        const a = this._sqToXY(r);
        t.fillRect(a.x, a.y, n, n);
      }
    }
    if (this._selected) {
      const r = this._sqToXY(this._selected);
      if (t.fillStyle = this.theme.moveFrom, t.fillRect(r.x, r.y, n, n), this.highlightLegal && this._legalCached) {
        t.fillStyle = this.theme.dot;
        for (const a of this._legalCached) {
          const l = this._sqToXY(a.to);
          t.beginPath(), t.arc(l.x + n / 2, l.y + n / 2, n * 0.12, 0, Math.PI * 2), t.fill();
        }
      }
    }
    for (const r of this._arrows)
      this._drawArrow(r.from, r.to, r.color || this.theme.arrow);
    if (this._premove) {
      const r = this._sqToXY(this._premove.from), a = this._sqToXY(this._premove.to);
      t.fillStyle = this.theme.premove, t.fillRect(r.x, r.y, n, n), t.fillRect(a.x, a.y, n, n);
    }
    if (this._hoverSq && this._dragging) {
      const r = this._sqToXY(this._hoverSq);
      t.fillStyle = this.theme.moveTo, t.fillRect(r.x, r.y, n, n);
    }
    this.drawingManager && (this.showArrows && this.drawingManager.renderArrows(), this.showHighlights && this.drawingManager.renderHighlights(), this.allowPremoves && this.drawingManager.renderPremove(), this.showSquareNames && this.drawingManager.renderSquareNames(this.orientation, this.square, this.dpr));
  }
  /**
   * Draws an arrow between the center of two squares.
   * @param from The starting square of the arrow.
   * @param to The ending square of the arrow.
   * @param color The color of the arrow.
   */
  _drawArrow(t, e, i) {
    const n = this.square, o = this._sqToXY(t), r = this._sqToXY(e);
    this._drawArrowBetween(o.x + n / 2, o.y + n / 2, r.x + n / 2, r.y + n / 2, i);
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
  _drawArrowBetween(t, e, i, n, o) {
    const r = i - t, a = n - e, l = Math.hypot(r, a);
    if (l < 1) return;
    const c = r / l, h = a / l, u = Math.min(16 * this.dpr, l * 0.25), d = Math.max(6 * this.dpr, this.square * 0.08), f = this.ctxO;
    f.save(), f.lineCap = "round", f.lineJoin = "round", f.strokeStyle = o, f.fillStyle = o, f.globalAlpha = 0.95, f.beginPath(), f.moveTo(t, e), f.lineTo(i - c * u, n - h * u), f.lineWidth = d, f.stroke(), f.beginPath(), f.moveTo(i, n), f.lineTo(i - c * u - h * u * 0.5, n - h * u + c * u * 0.5), f.lineTo(i - c * u + h * u * 0.5, n - h * u - c * u * 0.5), f.closePath(), f.fill(), f.restore();
  }
  _setSelection(t, e) {
    const i = Fe(e) ? "w" : "b";
    this._selected = t, i === this.state.turn ? this._legalCached = this.rules.movesFrom(t) : this.allowPremoves ? this._legalCached = [] : this._legalCached = null;
  }
  _handleClickMove(t) {
    const e = this._selected;
    if (!e || e === t) {
      e === t && this.renderAll();
      return;
    }
    const i = this._pieceAt(e);
    if (!i) {
      this._selected = null, this._legalCached = null, this.renderAll();
      return;
    }
    const n = this._pieceAt(t);
    if (n && Fe(n) === Fe(i)) {
      this._setSelection(t, n), this.renderAll();
      return;
    }
    this._attemptMove(e, t, i);
  }
  _attemptMove(t, e, i) {
    const n = Fe(i) ? "w" : "b";
    if (t === e)
      return this.renderAll(), !0;
    if (n !== this.state.turn)
      return this.allowPremoves ? (this.drawingManager && this.drawingManager.setPremove(t, e), this._premove = { from: t, to: e }, this._selected = null, this._legalCached = null, this._hoverSq = null, this.renderAll(), !0) : !1;
    const o = this.rules.move({ from: t, to: e });
    if (o && o.ok) {
      const r = this.rules.getFEN(), a = this.state, l = Qe(r);
      return this.state = l, this._syncOrientationFromTurn(!1), this._selected = null, this._legalCached = null, this._hoverSq = null, this._lastMove = { from: t, to: e }, this.drawingManager && this.drawingManager.clearArrows(), this._playMoveSound(), this._animateTo(l, a), this.bus.emit("move", { from: t, to: e, fen: r }), setTimeout(() => {
        this._executePremoveIfValid();
      }, this.animationMs + 50), !0;
    }
    return this._selected = null, this._legalCached = null, this._hoverSq = null, this.renderAll(), this.bus.emit("illegal", { from: t, to: e, reason: (o == null ? void 0 : o.reason) || "illegal" }), !0;
  }
  // ---- interaction ----
  _attachEvents() {
    let t = !1;
    const e = () => this._dragging ? (this._dragging = null, this._selected = null, this._legalCached = null, this._hoverSq = null, this.renderAll(), !0) : !1, i = (l) => {
      if (!this.interactive) {
        l.button === 2 && (l.preventDefault(), e() && (t = !0));
        return;
      }
      if (l.button === 2) {
        if (l.preventDefault(), e()) {
          t = !0;
          return;
        }
        t = !1;
        const f = this._evt(l);
        f && this.drawingManager && this.drawingManager.handleRightMouseDown(f.x, f.y, l.shiftKey, l.ctrlKey, l.altKey) && this.renderAll();
        return;
      }
      if (l.button !== 0) return;
      const c = this._evt(l);
      if (!c) return;
      const h = this._xyToSquare(c.x, c.y), u = this._pieceAt(h);
      !u || (Fe(u) ? "w" : "b") !== this.state.turn && !this.allowPremoves || (this._setSelection(h, u), this._dragging = { from: h, piece: u, x: c.x, y: c.y }, this._hoverSq = h, this.renderAll());
    }, n = (l) => {
      const c = this._evt(l);
      if (!c) {
        this.interactive && (this.cOverlay.style.cursor = "default");
        return;
      }
      if (this.drawingManager && this.drawingManager.handleMouseMove(c.x, c.y) && this.renderAll(), this._dragging)
        this._dragging.x = c.x, this._dragging.y = c.y, this._hoverSq = this._xyToSquare(c.x, c.y), this._drawPieces(), this._drawOverlay();
      else if (this.interactive) {
        const h = this._xyToSquare(c.x, c.y), u = this._pieceAt(h);
        this.cOverlay.style.cursor = u ? "pointer" : "default";
      }
    }, o = (l) => {
      if (l.button === 2) {
        if (e()) {
          t = !1;
          return;
        }
        if (t) {
          t = !1;
          return;
        }
      }
      const c = this._evt(l);
      if (l.button === 2) {
        let f = !1;
        if (this.drawingManager && c && (f = this.drawingManager.handleRightMouseUp(c.x, c.y)), !f && c) {
          if (this.drawingManager && this.drawingManager.getPremove())
            this.drawingManager.clearPremove(), this._premove = null, console.log("Premove cancelled by right-click"), f = !0;
          else if (this.rightClickHighlights) {
            const g = this._xyToSquare(c.x, c.y);
            this.drawingManager && this.drawingManager.handleHighlightClick(g, l.shiftKey, l.ctrlKey, l.altKey);
          }
        }
        this.renderAll();
        return;
      }
      if (this.drawingManager && this.drawingManager.handleMouseUp((c == null ? void 0 : c.x) || 0, (c == null ? void 0 : c.y) || 0)) {
        this.renderAll();
        return;
      }
      if (!this._dragging) {
        if (this.interactive && l.button === 0 && c) {
          const f = this._xyToSquare(c.x, c.y);
          this._handleClickMove(f);
        }
        return;
      }
      const h = c ? this._xyToSquare(c.x, c.y) : null, u = this._dragging.from, d = this._dragging.piece;
      if (this._dragging = null, this._hoverSq = null, !h) {
        this._selected = null, this._legalCached = null, this.renderAll();
        return;
      }
      if (h === u) {
        this.renderAll();
        return;
      }
      this._attemptMove(u, h, d);
    }, r = (l) => {
      l.key === "Escape" && (this._selected = null, this._legalCached = null, this._dragging = null, this._hoverSq = null, this.drawingManager && this.drawingManager.cancelCurrentAction(), this.renderAll());
    }, a = (l) => {
      this.rightClickHighlights && l.preventDefault();
    };
    this.cOverlay.addEventListener("pointerdown", i), this.cOverlay.addEventListener("contextmenu", a), this._onPointerDown = i, this._onContextMenu = a, globalThis.addEventListener("pointermove", n), this._onPointerMove = n, globalThis.addEventListener("pointerup", o), this._onPointerUp = o, globalThis.addEventListener("keydown", r), this._onKeyDown = r;
  }
  _removeEvents() {
    var t;
    this.cOverlay.removeEventListener("pointerdown", this._onPointerDown), this.cOverlay.removeEventListener("contextmenu", this._onContextMenu), globalThis.removeEventListener("pointermove", this._onPointerMove), globalThis.removeEventListener("pointerup", this._onPointerUp), globalThis.removeEventListener("keydown", this._onKeyDown), (t = this._ro) == null || t.disconnect();
  }
  _evt(t) {
    const e = this.cOverlay.getBoundingClientRect(), i = (t.clientX - e.left) * (this.cOverlay.width / e.width), n = (t.clientY - e.top) * (this.cOverlay.height / e.height);
    return i < 0 || n < 0 || i > this.cOverlay.width || n > this.cOverlay.height ? null : { x: i, y: n };
  }
  _xyToSquare(t, e) {
    const i = Ls(Math.floor(t / this.square), 0, 7), n = Ls(Math.floor(e / this.square), 0, 7), o = this.orientation === "white" ? i : 7 - i, r = this.orientation === "white" ? 7 - n : n;
    return Ge(o, r);
  }
  _pieceAt(t) {
    const { f: e, r: i } = cr(t);
    return this.state.board[i][e];
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
  _animateTo(t, e) {
    this._clearAnim();
    const i = performance.now(), n = this.animationMs, o = /* @__PURE__ */ new Map();
    for (let a = 0; a < 8; a++)
      for (let l = 0; l < 8; l++) {
        const c = e.board[a][l], h = t.board[a][l];
        if (c && (!h || c !== h)) {
          const u = this.findPiece(t.board, c, a, l, e.board);
          u && o.set(Ge(l, a), Ge(u.f, u.r));
        }
      }
    const r = () => {
      var h;
      const a = Ls((performance.now() - i) / n, 0, 1), l = Sf(a);
      this.ctxP.clearRect(0, 0, this.cPieces.width, this.cPieces.height);
      for (let u = 0; u < 8; u++)
        for (let d = 0; d < 8; d++) {
          const f = t.board[u][d];
          if (!f) continue;
          const g = Ge(d, u), p = (h = [...o.entries()].find(([m, b]) => b === g)) == null ? void 0 : h[0];
          if (p) {
            const { x: m, y: b } = this._sqToXY(p), { x: _, y: k } = this._sqToXY(g), M = hr(m, _, l), S = hr(b, k, l);
            this._drawPieceSprite(f, M, S, 1);
          } else {
            const { x: m, y: b } = this._sqToXY(g);
            this._drawPieceSprite(f, m, b, 1);
          }
        }
      this._drawOverlay(), a < 1 ? this._raf = requestAnimationFrame(r) : (this._raf = 0, this.renderAll());
    };
    this._raf = requestAnimationFrame(r);
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
  findPiece(t, e, i, n, o) {
    for (let r = 0; r < 8; r++)
      for (let a = 0; a < 8; a++)
        if (t[r][a] === e && o[r][a] !== e) return { r, f: a };
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
    const t = this.ctxP || this.cPieces.getContext("2d");
    t && (t.clearRect(0, 0, this.cPieces.width, this.cPieces.height), this.drawingManager.draw(t), "renderArrows" in this.drawingManager && this.drawingManager.renderArrows(), "renderHighlights" in this.drawingManager && this.drawingManager.renderHighlights());
  }
  // ---- Sound methods ----
  /**
   * Initializes the audio element for move sounds if sound is enabled and a sound URL is provided.
   * Handles potential loading errors silently.
   */
  _initializeSound() {
    var o, r;
    if (this.moveSound = null, this.moveSounds = {}, !this.soundEnabled || typeof Audio > "u") return;
    const t = this.soundUrl, e = (o = this.soundUrls) == null ? void 0 : o.white, i = (r = this.soundUrls) == null ? void 0 : r.black;
    if (!t && !e && !i)
      return;
    const n = (a) => {
      try {
        const l = new Audio(a);
        return l.volume = 0.3, l.preload = "auto", l.addEventListener("error", () => {
          console.debug("Sound not available");
        }), l;
      } catch (l) {
        return console.warn("Unable to load move sound:", l), null;
      }
    };
    if (e) {
      const a = n(e);
      a && (this.moveSounds.white = a);
    }
    if (i) {
      const a = n(i);
      a && (this.moveSounds.black = a);
    }
    if (t) {
      const a = n(t);
      a && (this.moveSound = a);
    }
  }
  /**
   * Plays the move sound if sound is enabled and the audio element is initialized.
   * Catches and ignores playback errors (e.g., due to user interaction policies).
   */
  _playMoveSound() {
    if (!this.soundEnabled) return;
    const t = this.state.turn === "w" ? "black" : "white", e = this.moveSounds[t] ?? this.moveSound;
    if (e)
      try {
        e.currentTime = 0, e.play().catch((i) => {
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
  _syncOrientationFromTurn(t = !1) {
    if (!this.autoFlip)
      return;
    const e = this.state.turn === "w" ? "white" : "black";
    if (t || !this.drawingManager) {
      this.orientation = e, this.drawingManager && !t && this.drawingManager.setOrientation(e);
      return;
    }
    this.orientation !== e && this.setOrientation(e);
  }
  /**
   * Enables or disables sound effects for moves.
   * If enabling and sound is not yet initialized, it will attempt to initialize it.
   * @param enabled True to enable sounds, false to disable.
   */
  setSoundEnabled(t) {
    this.soundEnabled = t, t ? this._initializeSound() : (this.moveSound = null, this.moveSounds = {});
  }
  /**
   * Updates the URLs used for move sounds and reinitializes audio elements if needed.
   * @param soundUrls Move sound URLs keyed by the color that just played.
   */
  setSoundUrls(t) {
    this.soundUrls = t, this.soundEnabled ? this._initializeSound() : (this.moveSound = null, this.moveSounds = {});
  }
  /**
   * Enables or disables automatic board flipping based on the side to move.
   * @param autoFlip True to enable auto-flip, false to disable it.
   */
  setAutoFlip(t) {
    this.autoFlip = t, t && this._syncOrientationFromTurn(!this.drawingManager);
  }
  /**
   * Sets the board orientation.
   * @param orientation The desired orientation ('white' or 'black').
   */
  setOrientation(t) {
    this.orientation = t, this.drawingManager && this.drawingManager.setOrientation(t), this.renderAll();
  }
  /**
   * Shows or hides arrows drawn on the board.
   * @param show True to show arrows, false to hide them.
   */
  setShowArrows(t) {
    this.showArrows = t, this.renderAll();
  }
  /**
   * Shows or hides highlights on the board.
   * @param show True to show highlights, false to hide them.
   */
  setShowHighlights(t) {
    this.showHighlights = t, this.renderAll();
  }
  /**
   * Enables or disables premoves.
   * If premoves are disabled, any existing premove will be cleared.
   * @param allow True to allow premoves, false to disallow.
   */
  setAllowPremoves(t) {
    this.allowPremoves = t, t || this.clearPremove(), this.renderAll();
  }
  /**
   * Enables or disables highlighting of legal moves for the selected piece.
   * @param highlight True to highlight legal moves, false to disable.
   */
  setHighlightLegal(t) {
    this.highlightLegal = t, this.renderAll();
  }
  /**
   * Shows or hides square names (coordinates) on the board.
   * @param show True to show square names, false to hide them.
   */
  setShowSquareNames(t) {
    this.showSquareNames = t, this.drawingManager && this.drawingManager.setShowSquareNames(t), this.renderAll();
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
    const t = this.drawingManager.getPremove();
    if (!t) return;
    const e = this.rules.move({
      from: t.from,
      to: t.to,
      promotion: t.promotion
    });
    e && e.ok ? setTimeout(() => {
      var r, a;
      const i = this.rules.getFEN(), n = Qe(i), o = this.state;
      this.state = n, this._syncOrientationFromTurn(!1), this._lastMove = { from: t.from, to: t.to }, (r = this.drawingManager) == null || r.clearPremove(), (a = this.drawingManager) == null || a.clearArrows(), this._premove = null, this._animateTo(n, o), this.bus.emit("move", { from: t.from, to: t.to, fen: i });
    }, 150) : (this.drawingManager.clearPremove(), this._premove = null, this.renderAll());
  }
  // ---- New feature methods ----
  /**
   * Add an arrow on the board
   * @param arrow The arrow to add (can be an object with from/to or an Arrow object)
   */
  addArrow(t) {
    this.drawingManager && "from" in t && "to" in t && ("knightMove" in t ? this.drawingManager.addArrowFromObject(t) : this.drawingManager.addArrow(t), this.renderAll());
  }
  /**
   * Remove an arrow from the board
   */
  removeArrow(t, e) {
    this.drawingManager && (this.drawingManager.removeArrow(t, e), this.renderAll());
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
  addHighlight(t, e) {
    this.drawingManager && (typeof t == "string" && e ? (this.drawingManager.addHighlight(t, e), this.renderAll()) : typeof t == "object" && "square" in t && (this.drawingManager.addHighlightFromObject(t), this.renderAll()));
  }
  /**
   * Remove a highlight from a square
   */
  removeHighlight(t) {
    this.drawingManager && (this.drawingManager.removeHighlight(t), this.renderAll());
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
  setPremove(t) {
    this.drawingManager && this.allowPremoves && (this.drawingManager.setPremoveFromObject(t), this.renderAll());
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
  importDrawings(t) {
    this.drawingManager && (this.drawingManager.importState(t), this.renderAll());
  }
  /**
   * Load a PGN with visual annotations
   */
  loadPgnWithAnnotations(t) {
    try {
      if (this.rules.loadPgn ? this.rules.loadPgn(t) : !1) {
        const i = this.rules.getPgnNotation ? this.rules.getPgnNotation() : null;
        return i && (i.loadPgnWithAnnotations(t), this.displayAnnotationsFromPgn(i)), this.state = Qe(this.rules.getFEN()), this._syncOrientationFromTurn(!1), this.renderAll(), !0;
      }
      return !1;
    } catch (e) {
      return console.error("Error loading PGN with annotations:", e), !1;
    }
  }
  /**
   * Display annotations from the last move played
   */
  displayAnnotationsFromPgn(t) {
    if (!this.drawingManager) return;
    this.drawingManager.clearArrows(), this.drawingManager.clearHighlights();
    const e = t.getMovesWithAnnotations();
    if (e.length === 0) return;
    const i = e[e.length - 1];
    (i.white ? 1 : 0) + (i.black ? 1 : 0);
    const n = e.reduce(
      (r, a) => r + (a.white ? 1 : 0) + (a.black ? 1 : 0),
      0
    );
    let o = null;
    if (n % 2 === 0 && i.blackAnnotations ? o = i.blackAnnotations : n % 2 === 1 && i.whiteAnnotations && (o = i.whiteAnnotations), o) {
      if (o.arrows)
        for (const r of o.arrows)
          this.drawingManager.addArrowFromObject(r);
      if (o.circles)
        for (const r of o.circles)
          this.drawingManager.addHighlightFromObject(r);
    }
  }
  /**
   * Add visual annotations to the current move and save them in the PGN
   */
  addAnnotationsToCurrentMove(t = [], e = [], i = "") {
    if (!this.drawingManager) return;
    const n = this.rules.getPgnNotation ? this.rules.getPgnNotation() : null;
    if (n) {
      const r = (this.rules.history ? this.rules.history() : []).length, a = Math.floor(r / 2) + 1, l = r % 2 === 0;
      n.addMoveAnnotations(a, l, {
        arrows: t,
        circles: e,
        textComment: i
      });
    }
    for (const o of t)
      this.drawingManager.addArrowFromObject(o);
    for (const o of e)
      this.drawingManager.addHighlightFromObject(o);
    this.renderAll();
  }
  /**
   * Export the PGN with all visual annotations
   */
  exportPgnWithAnnotations() {
    const t = this.rules.getPgnNotation ? this.rules.getPgnNotation() : null;
    return t && typeof t.toPgnWithAnnotations == "function" ? t.toPgnWithAnnotations() : this.rules.toPgn ? this.rules.toPgn() : "";
  }
}
class cg {
  constructor(t) {
    this.adapter = t, this.moves = [], this.headers = {
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
  push(t) {
    this.moves.push(t);
  }
  setHeaders(t) {
    var e;
    Object.assign(this.headers, t), (e = this.adapter) != null && e.header && this.adapter.header(this.headers);
  }
  setResult(t) {
    this.headers.Result = t;
  }
  getPGN() {
    var i;
    if ((i = this.adapter) != null && i.getPGN)
      return this.adapter.getPGN();
    const t = Object.entries(this.headers).map(([n, o]) => `[${n} "${o}"]`).join(`
`);
    let e = "";
    for (let n = 0; n < this.moves.length; n += 2) {
      const o = n / 2 + 1, r = this.fmt(this.moves[n]), a = this.moves[n + 1] ? this.fmt(this.moves[n + 1]) : "";
      e += `${o}. ${r}${a ? " " + a : ""} `;
    }
    return t + `

` + e.trim() + (this.headers.Result ? " " + this.headers.Result : "");
  }
  toBlob() {
    const t = this.getPGN();
    return new Blob([t], { type: "application/x-chess-pgn" });
  }
  suggestFilename() {
    const t = (i) => i.replace(/[^a-z0-9_\-]+/gi, "_"), e = (this.headers.Date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)).replace(/\./g, "-");
    return `${t(this.headers.White || "White")}_vs_${t(this.headers.Black || "Black")}_${e}.pgn`;
  }
  download(t = this.suggestFilename()) {
    if (typeof document > "u")
      return;
    const e = URL.createObjectURL(this.toBlob()), i = document.createElement("a");
    i.href = e, i.download = t, document.body.appendChild(i), i.click(), setTimeout(() => {
      document.body.removeChild(i), URL.revokeObjectURL(e);
    }, 0);
  }
  fmt(t) {
    const e = t.promotion ? `=${t.promotion.toUpperCase()}` : "";
    return `${t.from}${t.captured ? "x" : ""}${t.to}${e}`;
  }
}
const hg = ["analyze", "prediction"], Qt = (s) => hg.includes(s), cn = [];
let hn;
function ug(s) {
  if (hn) {
    s(hn);
    return;
  }
  cn.push(s);
}
function dg(s) {
  for (hn = s; cn.length > 0; ) {
    const t = cn.shift();
    t == null || t(s);
  }
}
const xr = /* @__PURE__ */ new WeakMap();
let vr = !1;
const ka = "[data-prediction-chart]";
function wr(s) {
  return Number.isNaN(s) ? 0 : Math.min(100, Math.max(0, s));
}
function Sr(s) {
  if (typeof s == "number" && Number.isFinite(s))
    return wr(s);
  if (typeof s == "string") {
    const t = Number.parseFloat(s);
    if (Number.isFinite(t))
      return wr(t);
  }
  return null;
}
function fg(s) {
  const t = s.dataset.chartSeries;
  if (!t)
    return [];
  try {
    const e = JSON.parse(t);
    return Array.isArray(e) ? e.map((i) => {
      if (!i || typeof i != "object")
        return null;
      const n = i, o = n.label ?? n.move, r = typeof o == "string" ? o.trim() : "";
      if (!r)
        return null;
      const a = Sr(n.likelihood), l = Sr(n.win_percentage ?? n.winPercentage);
      if (a === null || l === null)
        return null;
      const c = !!(n.is_best_move ?? n.isBestMove);
      return {
        label: r,
        likelihood: a,
        winPercentage: l,
        isBestMove: c
      };
    }).filter((i) => i !== null) : [];
  } catch (e) {
    return console.warn("[oracle-board] Unable to parse chart payload.", e), [];
  }
}
function gg(s) {
  const t = s.parsed;
  if (typeof t == "number" && Number.isFinite(t))
    return t;
  if (t && typeof t == "object" && "y" in t) {
    const e = t.y;
    if (typeof e == "number" && Number.isFinite(e))
      return e;
  }
  return null;
}
function pg(s) {
  const t = s.map((r) => r.label), e = s.map((r) => r.likelihood), i = s.map((r) => r.winPercentage), n = s.map(
    (r) => r.isBestMove ? "rgba(25, 135, 84, 0.7)" : "rgba(13, 110, 253, 0.65)"
  ), o = s.map(
    (r) => r.isBestMove ? "rgba(25, 135, 84, 1)" : "rgba(13, 110, 253, 1)"
  );
  return {
    type: "bar",
    data: {
      labels: t,
      datasets: [
        {
          type: "bar",
          label: "Probabilité (%)",
          data: e,
          backgroundColor: n,
          borderColor: o,
          borderWidth: 1,
          yAxisID: "likelihood"
        },
        {
          type: "line",
          label: "Score attendu (%)",
          data: i,
          borderColor: "rgba(220, 53, 69, 0.85)",
          backgroundColor: "rgba(220, 53, 69, 0.85)",
          yAxisID: "evaluation",
          tension: 0.25,
          fill: !1,
          pointRadius: 4,
          pointHoverRadius: 5
        }
      ]
    },
    options: {
      responsive: !0,
      maintainAspectRatio: !1,
      interaction: {
        mode: "index",
        intersect: !1
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 0
          }
        },
        likelihood: {
          beginAtZero: !0,
          min: 0,
          max: 100,
          position: "left",
          title: {
            display: !0,
            text: "Probabilité (%)"
          },
          ticks: {
            callback(r) {
              return `${r}%`;
            }
          }
        },
        evaluation: {
          beginAtZero: !0,
          min: 0,
          max: 100,
          position: "right",
          grid: {
            drawOnChartArea: !1
          },
          title: {
            display: !0,
            text: "Score attendu (%)"
          },
          ticks: {
            callback(r) {
              return `${r}%`;
            }
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            usePointStyle: !0
          }
        },
        tooltip: {
          callbacks: {
            label(r) {
              const a = r.dataset.label ?? "", l = gg(r);
              if (!Number.isFinite(l ?? Number.NaN))
                return a;
              const c = l.toFixed(2);
              return a ? `${a}: ${c}%` : `${c}%`;
            }
          }
        }
      }
    }
  };
}
function un(s) {
  if (xr.has(s))
    return;
  const t = s.getContext("2d");
  if (!t) {
    console.warn("[oracle-board] Chart canvas is missing a 2D context.");
    return;
  }
  const e = fg(s);
  if (e.length === 0)
    return;
  const i = pg(e), n = new ee(t, i);
  xr.set(s, n);
}
function mg(s) {
  s.querySelectorAll(ka).forEach((e) => un(e));
}
function bg(s) {
  const t = s.target;
  if (!(t instanceof HTMLElement))
    return;
  const e = t.getAttribute("data-bs-target");
  if (!e)
    return;
  const i = document.querySelector(e);
  i instanceof Element && mg(i);
}
function Pa(s = document) {
  const t = s.querySelectorAll(ka);
  if (t.length !== 0) {
    if (!vr) {
      const e = (i) => bg(i);
      document.addEventListener("shown.bs.tab", e), vr = !0;
    }
    t.forEach((e) => {
      const i = e.closest(".tab-pane");
      if (!i) {
        un(e);
        return;
      }
      i.classList.contains("active") && i.classList.contains("show") && un(e);
    });
  }
}
window.oracleCharts = {
  refreshCharts(s) {
    Pa(s ?? document);
  }
};
function Ws(s) {
  return {
    from: s.from,
    to: s.to,
    promotion: s.promotion,
    captured: s.captured ?? void 0,
    san: s.san
  };
}
function _g() {
  const s = document.getElementById("oracle-board");
  if (!s) {
    console.warn("[oracle-board] Missing container #oracle-board.");
    return;
  }
  const t = new ms(), e = new lg(s, {
    rulesAdapter: t,
    interactive: !0,
    highlightLegal: !0,
    showCoordinates: !0,
    showHighlights: !0,
    showArrows: !0,
    allowPremoves: !1,
    animationMs: 200,
    soundEnabled: !1
  }), i = new cg(t), n = t, o = () => {
    if (typeof n.getHistory == "function")
      return n.getHistory();
    if (typeof n.history == "function")
      try {
        return n.history({ verbose: !0 }) ?? [];
      } catch (u) {
        console.warn("[oracle-board] Unable to access verbose history.", u);
      }
    return [];
  }, r = () => {
    i.reset(), o().forEach((u) => i.push(Ws(u)));
  };
  let a, l;
  const c = () => {
    l == null || l({ fen: t.getFEN(), pgn: i.getPGN() });
  };
  e.on("move", (u) => {
    const { from: d, to: f, fen: g } = u, p = o(), m = p[p.length - 1];
    m ? (i.push(Ws(m)), a == null || a({ from: d, to: f, fen: g, san: m.san })) : (i.push(Ws({ from: d, to: f })), a == null || a({ from: d, to: f, fen: g })), c();
  }), e.on("update", () => c());
  const h = {
    loadPgn(u) {
      if (typeof u != "string" || u.trim().length === 0)
        return !1;
      const d = e.loadPgnWithAnnotations(u);
      return d && (r(), c()), d;
    },
    reset() {
      typeof t.reset == "function" ? t.reset() : t.setFEN("start"), i.reset(), e.setFEN(t.getFEN(), !0), c();
    },
    getFen() {
      return t.getFEN();
    },
    getPgn() {
      return i.getPGN();
    },
    onMove(u) {
      a = u;
    },
    onUpdate(u) {
      l = u, c();
    }
  };
  window.oracleBoard = h, document.dispatchEvent(
    new CustomEvent("oracle-board:ready", {
      detail: h
    })
  ), dg(h), c();
}
function yg() {
  var Bt;
  const s = document.querySelector("[data-app-root]");
  if (!s)
    return;
  const t = document.getElementById("pgn"), e = s.querySelector("[data-load-pgn]"), i = s.querySelector("[data-reset-board]"), n = document.querySelectorAll("[data-mode-input]"), o = s.querySelectorAll("[data-mode-panel]"), r = s.querySelector("[data-game-new]"), a = s.querySelector("[data-game-resign]"), l = s.querySelector("[data-game-status]"), c = s.querySelector("[data-game-level]"), h = s.querySelector(".board-panel"), u = document.createElement("div");
  u.id = "board-loader", u.className = "board-loader", u.hidden = !0, u.innerHTML = `
    <div class="spinner-border text-light" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  `, h == null || h.appendChild(u);
  const d = (E) => E && E.trim().length > 0 ? E.trim() : "";
  let g = ((E) => E === "play" ? "play" : E === "prediction" ? "prediction" : "analyze")(s.dataset.activeMode), p, m = !1;
  const b = {
    newGame: d(s.dataset.gameNewEndpoint),
    move: d(s.dataset.gameMoveEndpoint),
    resign: d(s.dataset.gameResignEndpoint)
  }, _ = {
    inProgress: !1,
    awaitingResponse: !1,
    lastStablePgn: "",
    selectedLevel: ((Bt = c == null ? void 0 : c.value) == null ? void 0 : Bt.trim()) ?? ""
  }, k = (E) => {
    m = !0;
    try {
      E();
    } finally {
      m = !1;
    }
  }, M = (E) => {
    t && (t.value = E);
  }, S = (E) => E ? E.split(",").map((T) => T.trim()).filter((T) => T.length > 0) : [], O = () => {
    o.forEach((E) => {
      const T = S(E.dataset.modePanel), R = T.length === 0 ? Qt(g) : T.some((I) => I === "analysis" ? Qt(g) : I === g);
      E.toggleAttribute("hidden", !R);
    }), t && (g === "play" ? t.setAttribute("readonly", "true") : t.removeAttribute("readonly"));
  }, C = () => {
    const E = g === "play";
    r && (r.disabled = !E || _.awaitingResponse), a && (a.disabled = !E || !_.inProgress || _.awaitingResponse);
  }, A = (E, T = "info") => {
    if (!l)
      return;
    if (!E) {
      l.textContent = "", l.hidden = !0, l.classList.remove("alert-info", "alert-danger", "alert-success");
      return;
    }
    l.hidden = !1, l.textContent = E, l.classList.remove("alert-info", "alert-danger", "alert-success");
    const R = T === "error" ? "alert-danger" : T === "success" ? "alert-success" : "alert-info";
    l.classList.add(R);
  }, L = (E, T = 1) => {
    if (typeof E == "number" && Number.isFinite(E))
      return E.toFixed(T);
    if (typeof E == "string") {
      const R = Number.parseFloat(E);
      if (Number.isFinite(R))
        return R.toFixed(T);
    }
    return null;
  }, H = {
    "!!": "coup brillant",
    "!": "bon coup",
    "?!": "coup douteux",
    "?": "erreur",
    "??": "bourde"
  }, q = (E) => {
    if (typeof E != "string")
      return null;
    const T = E.trim();
    if (!T)
      return null;
    const R = H[T];
    return R ? `${T} - ${R}` : T;
  }, V = (E) => {
    let T;
    if (E && typeof E == "object" && "move" in E && (T = E.move), !T || typeof T != "object")
      return;
    const R = T, I = [], Q = typeof R.san == "string" ? R.san.trim() : "", ht = q(R.notation);
    if (Q) {
      let kt = `Oracle joue ${Q}`;
      ht && (kt += ` (${ht})`), I.push(kt);
    }
    const rt = L(R.likelihood, 1);
    rt && I.push(`Probabilite estimee: ${rt}%`);
    const At = L(R.win_percentage, 1);
    At && I.push(`Score attendu: ${At}%`);
    const gt = R.win_percentage_by_rating;
    if (gt && typeof gt == "object") {
      const kt = Object.entries(gt).map(([Wt, Et]) => {
        const Rt = Number.parseInt(Wt, 10), Xt = typeof Et == "number" ? Et : typeof Et == "string" ? Number.parseFloat(Et) : Number.NaN;
        return Number.isInteger(Rt) && Number.isFinite(Xt) ? [Rt, Xt] : null;
      }).filter((Wt) => Wt !== null).sort((Wt, Et) => Wt[0] - Et[0]);
      if (kt.length > 0) {
        const Wt = Number.parseInt(_.selectedLevel, 10);
        let Et = !1;
        if (Number.isFinite(Wt)) {
          const It = kt.find(([Vt]) => Vt === Wt);
          if (It) {
            const Vt = L(It[1], 1);
            Vt && (I.push(`Score Elo ${It[0]}: ${Vt}%`), Et = !0);
          }
        }
        const [Rt] = kt, [Xt] = kt.slice(-1);
        if (Rt) {
          const It = L(Rt[1], 1);
          if (Xt && Xt[0] !== Rt[0]) {
            const Vt = L(Xt[1], 1);
            if (It && Vt) {
              const bs = Et ? "Amplitude Elo" : "Echelle Elo";
              I.push(
                `${bs}: ${Rt[0]} -> ${It}% | ${Xt[0]} -> ${Vt}%`
              );
            } else !Et && It && I.push(`Score Elo ${Rt[0]}: ${It}%`);
          } else !Et && It && I.push(`Score Elo ${Rt[0]}: ${It}%`);
        }
      }
    }
    return I.length > 0 ? I.join(" - ") : void 0;
  }, ot = () => {
    if (!p || !t)
      return;
    const E = t.value.trim();
    k(() => {
      E.length > 0 && p.loadPgn(E) || p.reset();
    });
    const T = p.getPgn();
    M(T), _.lastStablePgn = T;
  }, ct = (E) => {
    if (!p)
      return;
    const T = (E ?? _.lastStablePgn).trim();
    k(() => {
      T.length > 0 && p.loadPgn(T) || p.reset();
    });
    const R = p.getPgn();
    M(R);
  }, Y = (E, T) => {
    if (console.log("[DEBUG] Applying server update with PGN:", E, "data:", T), !p)
      return;
    const R = typeof E == "string" ? E.trim() : "";
    console.log("[DEBUG] Loading PGN into board, trimmed length:", R.length), k(() => {
      if (R.length > 0) {
        const kt = p.loadPgn(R);
        console.log("[DEBUG] board.loadPgn result:", kt), kt || (console.log("[DEBUG] board.loadPgn failed, resetting board"), p.reset());
      } else
        console.log("[DEBUG] No PGN to load, resetting board"), p.reset();
    });
    const I = p.getPgn();
    console.log("[DEBUG] Normalized PGN after load:", I), _.lastStablePgn = I, M(I);
    const Q = !!(T != null && T.finished), ht = V(T), rt = typeof (T == null ? void 0 : T.status) == "string" ? T.status : void 0, At = typeof (T == null ? void 0 : T.message) == "string" ? T.message : void 0;
    let gt;
    ht && rt ? gt = `${ht}
${rt}` : ht && At ? gt = `${ht}
${At}` : ht ? gt = ht : rt ? gt = rt : At ? gt = At : Q && (gt = "Partie terminee."), console.log("[DEBUG] Setting status message:", gt), A(gt ?? "Coup joue.", Q ? "success" : "info"), Q && (_.inProgress = !1), C();
  }, X = async (E, T) => {
    if (!E)
      throw new Error("Endpoint de partie indisponible.");
    const R = await fetch(E, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(T)
    });
    if (!R.ok)
      throw new Error(`Erreur serveur (${R.status}) lors de l'échange avec l'ordinateur.`);
    return (R.headers.get("content-type") ?? "").includes("application/json") ? R.json() : {};
  }, tt = () => {
    const E = _.selectedLevel.trim();
    return E.length > 0 ? E : void 0;
  }, _t = (E, T = {}) => {
    const { force: R = !1 } = T;
    if (!(!R && g === E)) {
      if (g = E, O(), C(), Lt && (Lt.value = Qt(g) ? g : "analyze"), Qt(g)) {
        A(), p && ot();
        return;
      }
      if (_.inProgress = !1, _.awaitingResponse = !1, p) {
        k(() => p.reset());
        const I = p.getPgn();
        _.lastStablePgn = I, M(I);
      } else
        M(""), _.lastStablePgn = "";
      A("Choisissez un niveau puis démarrez une partie.", "info"), C();
    }
  };
  n.forEach((E) => {
    E.addEventListener("change", () => {
      if (!E.checked)
        return;
      const T = E.value === "play" ? "play" : E.value === "prediction" ? "prediction" : "analyze";
      _t(T);
    });
  }), e == null || e.addEventListener("click", () => {
    Qt(g) && (ot(), t == null || t.focus());
  }), i == null || i.addEventListener("click", () => {
    if (!Qt(g) || !p)
      return;
    k(() => p.reset());
    const E = p.getPgn();
    M(E), t == null || t.focus();
  }), c == null || c.addEventListener("change", () => {
    var E;
    _.selectedLevel = ((E = c.value) == null ? void 0 : E.trim()) ?? "";
  });
  const G = document.querySelector('form[action="/analyze"]'), Lt = G == null ? void 0 : G.querySelector("[data-analysis-mode-input]");
  G == null || G.addEventListener("submit", async (E) => {
    E.preventDefault();
    const T = G.querySelector('button[type="submit"]');
    if (!T)
      return;
    const R = T.innerHTML;
    T.disabled = !0, T.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Analyse en cours...
    `;
    try {
      const I = new FormData(G), Q = await fetch(G.action, {
        method: G.method,
        body: new URLSearchParams(I)
      });
      if (!Q.ok)
        throw new Error(`Erreur serveur (${Q.status}) lors de l'analyse.`);
      const ht = await Q.text(), gt = new DOMParser().parseFromString(ht, "text/html").querySelector(".col-12.col-xl-10.col-xxl-9"), kt = document.querySelector(".col-12.col-xl-10.col-xxl-9");
      gt && kt && (kt.innerHTML = gt.innerHTML, re(gt));
    } catch (I) {
      const Q = I instanceof Error ? I.message : "Une erreur inattendue est survenue.";
      A(Q, "error");
    } finally {
      T.disabled = !1, T.innerHTML = R;
    }
  });
  const re = (E) => {
    Array.from(E.querySelectorAll("script")).forEach((R) => {
      var Q;
      const I = document.createElement("script");
      R.src ? (I.src = R.src, I.async = !1) : I.textContent = R.textContent;
      for (const { name: ht, value: rt } of R.attributes)
        I.setAttribute(ht, rt);
      (Q = R.parentNode) == null || Q.replaceChild(I, R);
    });
  };
  r == null || r.addEventListener("click", async () => {
    if (g !== "play" && _t("play"), !p || _.awaitingResponse) {
      p || A("Plateau en cours de chargement…", "info");
      return;
    }
    _.awaitingResponse = !0, C();
    const E = r.innerHTML;
    r.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Démarrage...
    `, A("Initialisation de la partie…", "info");
    try {
      const T = {}, R = tt();
      R && (T.level = R);
      const I = await X(b.newGame, T);
      k(() => {
        p.reset(), typeof (I == null ? void 0 : I.pgn) == "string" && I.pgn.trim().length > 0 && p.loadPgn(I.pgn);
      });
      const Q = p.getPgn();
      _.lastStablePgn = Q, _.inProgress = !0, M(Q);
      const ht = typeof (I == null ? void 0 : I.status) == "string" ? I.status : "La partie a démarré.";
      A(ht, "info");
    } catch (T) {
      console.error("[oracle-board] Unable to start game:", T);
      const R = T instanceof Error ? T.message : "Impossible de démarrer la partie.";
      A(R, "error");
    } finally {
      r.innerHTML = E, _.awaitingResponse = !1, C();
    }
  }), a == null || a.addEventListener("click", async () => {
    if (!(g !== "play" || !p || !_.inProgress || _.awaitingResponse)) {
      _.awaitingResponse = !0, C(), A("Abandon en cours…", "info");
      try {
        const E = { pgn: _.lastStablePgn }, T = tt();
        T && (E.level = T);
        const R = await X(b.resign, E);
        typeof (R == null ? void 0 : R.pgn) == "string" && k(() => {
          R.pgn.trim().length > 0 ? p.loadPgn(R.pgn) : p.reset();
        });
        const I = p.getPgn();
        M(I), _.lastStablePgn = I, _.inProgress = !1;
        const Q = typeof (R == null ? void 0 : R.status) == "string" ? R.status : "Vous avez abandonné la partie.";
        A(Q, "success");
      } catch (E) {
        console.error("[oracle-board] Unable to resign game:", E);
        const T = E instanceof Error ? E.message : "Impossible d'abandonner la partie.";
        A(T, "error"), _.inProgress = !1;
      } finally {
        _.awaitingResponse = !1, C();
      }
    }
  }), ug((E) => {
    if (p = E, Qt(g))
      ot();
    else if (p) {
      k(() => p.reset());
      const T = p.getPgn();
      _.lastStablePgn = T, M(T), A("Choisissez un niveau puis démarrez une partie.", "info");
    }
    p == null || p.onMove((T) => {
      if (console.log("[DEBUG] Move made in play mode:", T), !p || m)
        return;
      if (Qt(g)) {
        M(p.getPgn());
        return;
      }
      if (!_.inProgress) {
        A("Lancez une nouvelle partie pour jouer.", "error"), ct();
        return;
      }
      if (_.awaitingResponse) {
        ct();
        return;
      }
      const R = _.lastStablePgn, I = p.getPgn(), Q = {
        move: T.san ?? "",
        from: T.from,
        to: T.to,
        fen: T.fen,
        pgn: I
      }, ht = tt();
      ht && (Q.level = ht), console.log("[DEBUG] Sending move request:", Q), _.awaitingResponse = !0, C(), u.hidden = !1, A("Coup envoyé, attente de la réponse…", "info"), X(b.move, Q).then((rt) => {
        console.log("[DEBUG] Received response:", rt);
        const At = rt && typeof rt.pgn == "string" ? rt.pgn : I;
        Y(At, rt);
      }).catch((rt) => {
        console.error("[oracle-board] Unable to send move:", rt);
        const At = rt instanceof Error ? rt.message : "Impossible d'envoyer le coup.";
        A(At, "error"), ct(R);
      }).finally(() => {
        u.hidden = !0, _.awaitingResponse = !1, C();
      });
    }), p == null || p.onUpdate(({ pgn: T }) => {
      if (!m) {
        if (Qt(g)) {
          if (!t || document.activeElement === t)
            return;
          M(T);
          return;
        }
        _.awaitingResponse || (_.lastStablePgn = T), M(T);
      }
    });
  }), _t(g, { force: !0 });
}
function Mr() {
  yg(), _g(), Pa();
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Mr, { once: !0 }) : Mr();
