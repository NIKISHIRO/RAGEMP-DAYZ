"use strict";
!function () { return function e(t, r, n) { function i(a, o) { if (!r[a]) {
    if (!t[a]) {
        var f = "function" == typeof require && require;
        if (!o && f)
            return f(a, !0);
        if (s)
            return s(a, !0);
        var c = new Error("Cannot find module '" + a + "'");
        throw c.code = "MODULE_NOT_FOUND", c;
    }
    var h = r[a] = { exports: {} };
    t[a][0].call(h.exports, function (e) { var r = t[a][1][e]; return i(r || e); }, h, h.exports, e, t, r, n);
} return r[a].exports; } for (var s = "function" == typeof require && require, a = 0; a < n.length; a++)
    i(n[a]); return i; }; }()({ 1: [function (e, t, r) { var n = r; n.bignum = e("bn.js"), n.define = e("./asn1/api").define, n.base = e("./asn1/base"), n.constants = e("./asn1/constants"), n.decoders = e("./asn1/decoders"), n.encoders = e("./asn1/encoders"); }, { "./asn1/api": 2, "./asn1/base": 4, "./asn1/constants": 8, "./asn1/decoders": 10, "./asn1/encoders": 13, "bn.js": 17 }], 2: [function (e, t, r) { var n = e("../asn1"), i = e("inherits"); function s(e, t) { this.name = e, this.body = t, this.decoders = {}, this.encoders = {}; } r.define = function (e, t) { return new s(e, t); }, s.prototype._createNamed = function (t) { var r; try {
            r = e("vm").runInThisContext("(function " + this.name + "(entity) {\n  this._initNamed(entity);\n})");
        }
        catch (e) {
            r = function (e) { this._initNamed(e); };
        } return i(r, t), r.prototype._initNamed = function (e) { t.call(this, e); }, new r(this); }, s.prototype._getDecoder = function (e) { return e = e || "der", this.decoders.hasOwnProperty(e) || (this.decoders[e] = this._createNamed(n.decoders[e])), this.decoders[e]; }, s.prototype.decode = function (e, t, r) { return this._getDecoder(t).decode(e, r); }, s.prototype._getEncoder = function (e) { return e = e || "der", this.encoders.hasOwnProperty(e) || (this.encoders[e] = this._createNamed(n.encoders[e])), this.encoders[e]; }, s.prototype.encode = function (e, t, r) { return this._getEncoder(t).encode(e, r); }; }, { "../asn1": 1, inherits: 108, vm: 191 }], 3: [function (e, t, r) { var n = e("inherits"), i = e("../base").Reporter, s = e("buffer").Buffer; function a(e, t) { i.call(this, t), s.isBuffer(e) ? (this.base = e, this.offset = 0, this.length = e.length) : this.error("Input not Buffer"); } function o(e, t) { if (Array.isArray(e))
            this.length = 0, this.value = e.map(function (e) { return e instanceof o || (e = new o(e, t)), this.length += e.length, e; }, this);
        else if ("number" == typeof e) {
            if (!(0 <= e && e <= 255))
                return t.error("non-byte EncoderBuffer value");
            this.value = e, this.length = 1;
        }
        else if ("string" == typeof e)
            this.value = e, this.length = s.byteLength(e);
        else {
            if (!s.isBuffer(e))
                return t.error("Unsupported type: " + typeof e);
            this.value = e, this.length = e.length;
        } } n(a, i), r.DecoderBuffer = a, a.prototype.save = function () { return { offset: this.offset, reporter: i.prototype.save.call(this) }; }, a.prototype.restore = function (e) { var t = new a(this.base); return t.offset = e.offset, t.length = this.offset, this.offset = e.offset, i.prototype.restore.call(this, e.reporter), t; }, a.prototype.isEmpty = function () { return this.offset === this.length; }, a.prototype.readUInt8 = function (e) { return this.offset + 1 <= this.length ? this.base.readUInt8(this.offset++, !0) : this.error(e || "DecoderBuffer overrun"); }, a.prototype.skip = function (e, t) { if (!(this.offset + e <= this.length))
            return this.error(t || "DecoderBuffer overrun"); var r = new a(this.base); return r._reporterState = this._reporterState, r.offset = this.offset, r.length = this.offset + e, this.offset += e, r; }, a.prototype.raw = function (e) { return this.base.slice(e ? e.offset : this.offset, this.length); }, r.EncoderBuffer = o, o.prototype.join = function (e, t) { return e || (e = new s(this.length)), t || (t = 0), 0 === this.length ? e : (Array.isArray(this.value) ? this.value.forEach(function (r) { r.join(e, t), t += r.length; }) : ("number" == typeof this.value ? e[t] = this.value : "string" == typeof this.value ? e.write(this.value, t) : s.isBuffer(this.value) && this.value.copy(e, t), t += this.length), e); }; }, { "../base": 4, buffer: 51, inherits: 108 }], 4: [function (e, t, r) { var n = r; n.Reporter = e("./reporter").Reporter, n.DecoderBuffer = e("./buffer").DecoderBuffer, n.EncoderBuffer = e("./buffer").EncoderBuffer, n.Node = e("./node"); }, { "./buffer": 3, "./node": 5, "./reporter": 6 }], 5: [function (e, t, r) { var n = e("../base").Reporter, i = e("../base").EncoderBuffer, s = e("../base").DecoderBuffer, a = e("minimalistic-assert"), o = ["seq", "seqof", "set", "setof", "objid", "bool", "gentime", "utctime", "null_", "enum", "int", "objDesc", "bitstr", "bmpstr", "charstr", "genstr", "graphstr", "ia5str", "iso646str", "numstr", "octstr", "printstr", "t61str", "unistr", "utf8str", "videostr"], f = ["key", "obj", "use", "optional", "explicit", "implicit", "def", "choice", "any", "contains"].concat(o); function c(e, t) { var r = {}; this._baseState = r, r.enc = e, r.parent = t || null, r.children = null, r.tag = null, r.args = null, r.reverseArgs = null, r.choice = null, r.optional = !1, r.any = !1, r.obj = !1, r.use = null, r.useDecoder = null, r.key = null, r.default = null, r.explicit = null, r.implicit = null, r.contains = null, r.parent || (r.children = [], this._wrap()); } t.exports = c; var h = ["enc", "parent", "children", "tag", "args", "reverseArgs", "choice", "optional", "any", "obj", "use", "alteredUse", "key", "default", "explicit", "implicit", "contains"]; c.prototype.clone = function () { var e = this._baseState, t = {}; h.forEach(function (r) { t[r] = e[r]; }); var r = new this.constructor(t.parent); return r._baseState = t, r; }, c.prototype._wrap = function () { var e = this._baseState; f.forEach(function (t) { this[t] = function () { var r = new this.constructor(this); return e.children.push(r), r[t].apply(r, arguments); }; }, this); }, c.prototype._init = function (e) { var t = this._baseState; a(null === t.parent), e.call(this), t.children = t.children.filter(function (e) { return e._baseState.parent === this; }, this), a.equal(t.children.length, 1, "Root node can have only one child"); }, c.prototype._useArgs = function (e) { var t = this._baseState, r = e.filter(function (e) { return e instanceof this.constructor; }, this); e = e.filter(function (e) { return !(e instanceof this.constructor); }, this), 0 !== r.length && (a(null === t.children), t.children = r, r.forEach(function (e) { e._baseState.parent = this; }, this)), 0 !== e.length && (a(null === t.args), t.args = e, t.reverseArgs = e.map(function (e) { if ("object" != typeof e || e.constructor !== Object)
            return e; var t = {}; return Object.keys(e).forEach(function (r) { r == (0 | r) && (r |= 0); var n = e[r]; t[n] = r; }), t; })); }, ["_peekTag", "_decodeTag", "_use", "_decodeStr", "_decodeObjid", "_decodeTime", "_decodeNull", "_decodeInt", "_decodeBool", "_decodeList", "_encodeComposite", "_encodeStr", "_encodeObjid", "_encodeTime", "_encodeNull", "_encodeInt", "_encodeBool"].forEach(function (e) { c.prototype[e] = function () { var t = this._baseState; throw new Error(e + " not implemented for encoding: " + t.enc); }; }), o.forEach(function (e) { c.prototype[e] = function () { var t = this._baseState, r = Array.prototype.slice.call(arguments); return a(null === t.tag), t.tag = e, this._useArgs(r), this; }; }), c.prototype.use = function (e) { a(e); var t = this._baseState; return a(null === t.use), t.use = e, this; }, c.prototype.optional = function () { return this._baseState.optional = !0, this; }, c.prototype.def = function (e) { var t = this._baseState; return a(null === t.default), t.default = e, t.optional = !0, this; }, c.prototype.explicit = function (e) { var t = this._baseState; return a(null === t.explicit && null === t.implicit), t.explicit = e, this; }, c.prototype.implicit = function (e) { var t = this._baseState; return a(null === t.explicit && null === t.implicit), t.implicit = e, this; }, c.prototype.obj = function () { var e = this._baseState, t = Array.prototype.slice.call(arguments); return e.obj = !0, 0 !== t.length && this._useArgs(t), this; }, c.prototype.key = function (e) { var t = this._baseState; return a(null === t.key), t.key = e, this; }, c.prototype.any = function () { return this._baseState.any = !0, this; }, c.prototype.choice = function (e) { var t = this._baseState; return a(null === t.choice), t.choice = e, this._useArgs(Object.keys(e).map(function (t) { return e[t]; })), this; }, c.prototype.contains = function (e) { var t = this._baseState; return a(null === t.use), t.contains = e, this; }, c.prototype._decode = function (e, t) { var r = this._baseState; if (null === r.parent)
            return e.wrapResult(r.children[0]._decode(e, t)); var n, i = r.default, a = !0, o = null; if (null !== r.key && (o = e.enterKey(r.key)), r.optional) {
            var f = null;
            if (null !== r.explicit ? f = r.explicit : null !== r.implicit ? f = r.implicit : null !== r.tag && (f = r.tag), null !== f || r.any) {
                if (a = this._peekTag(e, f, r.any), e.isError(a))
                    return a;
            }
            else {
                var c = e.save();
                try {
                    null === r.choice ? this._decodeGeneric(r.tag, e, t) : this._decodeChoice(e, t), a = !0;
                }
                catch (e) {
                    a = !1;
                }
                e.restore(c);
            }
        } if (r.obj && a && (n = e.enterObject()), a) {
            if (null !== r.explicit) {
                var h = this._decodeTag(e, r.explicit);
                if (e.isError(h))
                    return h;
                e = h;
            }
            var u = e.offset;
            if (null === r.use && null === r.choice) {
                if (r.any)
                    c = e.save();
                var d = this._decodeTag(e, null !== r.implicit ? r.implicit : r.tag, r.any);
                if (e.isError(d))
                    return d;
                r.any ? i = e.raw(c) : e = d;
            }
            if (t && t.track && null !== r.tag && t.track(e.path(), u, e.length, "tagged"), t && t.track && null !== r.tag && t.track(e.path(), e.offset, e.length, "content"), i = r.any ? i : null === r.choice ? this._decodeGeneric(r.tag, e, t) : this._decodeChoice(e, t), e.isError(i))
                return i;
            if (r.any || null !== r.choice || null === r.children || r.children.forEach(function (r) { r._decode(e, t); }), r.contains && ("octstr" === r.tag || "bitstr" === r.tag)) {
                var l = new s(i);
                i = this._getUse(r.contains, e._reporterState.obj)._decode(l, t);
            }
        } return r.obj && a && (i = e.leaveObject(n)), null === r.key || null === i && !0 !== a ? null !== o && e.exitKey(o) : e.leaveKey(o, r.key, i), i; }, c.prototype._decodeGeneric = function (e, t, r) { var n = this._baseState; return "seq" === e || "set" === e ? null : "seqof" === e || "setof" === e ? this._decodeList(t, e, n.args[0], r) : /str$/.test(e) ? this._decodeStr(t, e, r) : "objid" === e && n.args ? this._decodeObjid(t, n.args[0], n.args[1], r) : "objid" === e ? this._decodeObjid(t, null, null, r) : "gentime" === e || "utctime" === e ? this._decodeTime(t, e, r) : "null_" === e ? this._decodeNull(t, r) : "bool" === e ? this._decodeBool(t, r) : "objDesc" === e ? this._decodeStr(t, e, r) : "int" === e || "enum" === e ? this._decodeInt(t, n.args && n.args[0], r) : null !== n.use ? this._getUse(n.use, t._reporterState.obj)._decode(t, r) : t.error("unknown tag: " + e); }, c.prototype._getUse = function (e, t) { var r = this._baseState; return r.useDecoder = this._use(e, t), a(null === r.useDecoder._baseState.parent), r.useDecoder = r.useDecoder._baseState.children[0], r.implicit !== r.useDecoder._baseState.implicit && (r.useDecoder = r.useDecoder.clone(), r.useDecoder._baseState.implicit = r.implicit), r.useDecoder; }, c.prototype._decodeChoice = function (e, t) { var r = this._baseState, n = null, i = !1; return Object.keys(r.choice).some(function (s) { var a = e.save(), o = r.choice[s]; try {
            var f = o._decode(e, t);
            if (e.isError(f))
                return !1;
            n = { type: s, value: f }, i = !0;
        }
        catch (t) {
            return e.restore(a), !1;
        } return !0; }, this), i ? n : e.error("Choice not matched"); }, c.prototype._createEncoderBuffer = function (e) { return new i(e, this.reporter); }, c.prototype._encode = function (e, t, r) { var n = this._baseState; if (null === n.default || n.default !== e) {
            var i = this._encodeValue(e, t, r);
            if (void 0 !== i && !this._skipDefault(i, t, r))
                return i;
        } }, c.prototype._encodeValue = function (e, t, r) { var i = this._baseState; if (null === i.parent)
            return i.children[0]._encode(e, t || new n); var s = null; if (this.reporter = t, i.optional && void 0 === e) {
            if (null === i.default)
                return;
            e = i.default;
        } var a = null, o = !1; if (i.any)
            s = this._createEncoderBuffer(e);
        else if (i.choice)
            s = this._encodeChoice(e, t);
        else if (i.contains)
            a = this._getUse(i.contains, r)._encode(e, t), o = !0;
        else if (i.children)
            a = i.children.map(function (r) { if ("null_" === r._baseState.tag)
                return r._encode(null, t, e); if (null === r._baseState.key)
                return t.error("Child should have a key"); var n = t.enterKey(r._baseState.key); if ("object" != typeof e)
                return t.error("Child expected, but input is not object"); var i = r._encode(e[r._baseState.key], t, e); return t.leaveKey(n), i; }, this).filter(function (e) { return e; }), a = this._createEncoderBuffer(a);
        else if ("seqof" === i.tag || "setof" === i.tag) {
            if (!i.args || 1 !== i.args.length)
                return t.error("Too many args for : " + i.tag);
            if (!Array.isArray(e))
                return t.error("seqof/setof, but data is not Array");
            var f = this.clone();
            f._baseState.implicit = null, a = this._createEncoderBuffer(e.map(function (r) { var n = this._baseState; return this._getUse(n.args[0], e)._encode(r, t); }, f));
        }
        else
            null !== i.use ? s = this._getUse(i.use, r)._encode(e, t) : (a = this._encodePrimitive(i.tag, e), o = !0); if (!i.any && null === i.choice) {
            var c = null !== i.implicit ? i.implicit : i.tag, h = null === i.implicit ? "universal" : "context";
            null === c ? null === i.use && t.error("Tag could be omitted only for .use()") : null === i.use && (s = this._encodeComposite(c, o, h, a));
        } return null !== i.explicit && (s = this._encodeComposite(i.explicit, !1, "context", s)), s; }, c.prototype._encodeChoice = function (e, t) { var r = this._baseState, n = r.choice[e.type]; return n || a(!1, e.type + " not found in " + JSON.stringify(Object.keys(r.choice))), n._encode(e.value, t); }, c.prototype._encodePrimitive = function (e, t) { var r = this._baseState; if (/str$/.test(e))
            return this._encodeStr(t, e); if ("objid" === e && r.args)
            return this._encodeObjid(t, r.reverseArgs[0], r.args[1]); if ("objid" === e)
            return this._encodeObjid(t, null, null); if ("gentime" === e || "utctime" === e)
            return this._encodeTime(t, e); if ("null_" === e)
            return this._encodeNull(); if ("int" === e || "enum" === e)
            return this._encodeInt(t, r.args && r.reverseArgs[0]); if ("bool" === e)
            return this._encodeBool(t); if ("objDesc" === e)
            return this._encodeStr(t, e); throw new Error("Unsupported tag: " + e); }, c.prototype._isNumstr = function (e) { return /^[0-9 ]*$/.test(e); }, c.prototype._isPrintstr = function (e) { return /^[A-Za-z0-9 '\(\)\+,\-\.\/:=\?]*$/.test(e); }; }, { "../base": 4, "minimalistic-assert": 115 }], 6: [function (e, t, r) { var n = e("inherits"); function i(e) { this._reporterState = { obj: null, path: [], options: e || {}, errors: [] }; } function s(e, t) { this.path = e, this.rethrow(t); } r.Reporter = i, i.prototype.isError = function (e) { return e instanceof s; }, i.prototype.save = function () { var e = this._reporterState; return { obj: e.obj, pathLen: e.path.length }; }, i.prototype.restore = function (e) { var t = this._reporterState; t.obj = e.obj, t.path = t.path.slice(0, e.pathLen); }, i.prototype.enterKey = function (e) { return this._reporterState.path.push(e); }, i.prototype.exitKey = function (e) { var t = this._reporterState; t.path = t.path.slice(0, e - 1); }, i.prototype.leaveKey = function (e, t, r) { var n = this._reporterState; this.exitKey(e), null !== n.obj && (n.obj[t] = r); }, i.prototype.path = function () { return this._reporterState.path.join("/"); }, i.prototype.enterObject = function () { var e = this._reporterState, t = e.obj; return e.obj = {}, t; }, i.prototype.leaveObject = function (e) { var t = this._reporterState, r = t.obj; return t.obj = e, r; }, i.prototype.error = function (e) { var t, r = this._reporterState, n = e instanceof s; if (t = n ? e : new s(r.path.map(function (e) { return "[" + JSON.stringify(e) + "]"; }).join(""), e.message || e, e.stack), !r.options.partial)
            throw t; return n || r.errors.push(t), t; }, i.prototype.wrapResult = function (e) { var t = this._reporterState; return t.options.partial ? { result: this.isError(e) ? null : e, errors: t.errors } : e; }, n(s, Error), s.prototype.rethrow = function (e) { if (this.message = e + " at: " + (this.path || "(shallow)"), Error.captureStackTrace && Error.captureStackTrace(this, s), !this.stack)
            try {
                throw new Error(this.message);
            }
            catch (e) {
                this.stack = e.stack;
            } return this; }; }, { inherits: 108 }], 7: [function (e, t, r) { var n = e("../constants"); r.tagClass = { 0: "universal", 1: "application", 2: "context", 3: "private" }, r.tagClassByName = n._reverse(r.tagClass), r.tag = { 0: "end", 1: "bool", 2: "int", 3: "bitstr", 4: "octstr", 5: "null_", 6: "objid", 7: "objDesc", 8: "external", 9: "real", 10: "enum", 11: "embed", 12: "utf8str", 13: "relativeOid", 16: "seq", 17: "set", 18: "numstr", 19: "printstr", 20: "t61str", 21: "videostr", 22: "ia5str", 23: "utctime", 24: "gentime", 25: "graphstr", 26: "iso646str", 27: "genstr", 28: "unistr", 29: "charstr", 30: "bmpstr" }, r.tagByName = n._reverse(r.tag); }, { "../constants": 8 }], 8: [function (e, t, r) { var n = r; n._reverse = function (e) { var t = {}; return Object.keys(e).forEach(function (r) { (0 | r) == r && (r |= 0); var n = e[r]; t[n] = r; }), t; }, n.der = e("./der"); }, { "./der": 7 }], 9: [function (e, t, r) { var n = e("inherits"), i = e("../../asn1"), s = i.base, a = i.bignum, o = i.constants.der; function f(e) { this.enc = "der", this.name = e.name, this.entity = e, this.tree = new c, this.tree._init(e.body); } function c(e) { s.Node.call(this, "der", e); } function h(e, t) { var r = e.readUInt8(t); if (e.isError(r))
            return r; var n = o.tagClass[r >> 6], i = 0 == (32 & r); if (31 == (31 & r)) {
            var s = r;
            for (r = 0; 128 == (128 & s);) {
                if (s = e.readUInt8(t), e.isError(s))
                    return s;
                r <<= 7, r |= 127 & s;
            }
        }
        else
            r &= 31; return { cls: n, primitive: i, tag: r, tagStr: o.tag[r] }; } function u(e, t, r) { var n = e.readUInt8(r); if (e.isError(n))
            return n; if (!t && 128 === n)
            return null; if (0 == (128 & n))
            return n; var i = 127 & n; if (i > 4)
            return e.error("length octect is too long"); n = 0; for (var s = 0; s < i; s++) {
            n <<= 8;
            var a = e.readUInt8(r);
            if (e.isError(a))
                return a;
            n |= a;
        } return n; } t.exports = f, f.prototype.decode = function (e, t) { return e instanceof s.DecoderBuffer || (e = new s.DecoderBuffer(e, t)), this.tree._decode(e, t); }, n(c, s.Node), c.prototype._peekTag = function (e, t, r) { if (e.isEmpty())
            return !1; var n = e.save(), i = h(e, 'Failed to peek tag: "' + t + '"'); return e.isError(i) ? i : (e.restore(n), i.tag === t || i.tagStr === t || i.tagStr + "of" === t || r); }, c.prototype._decodeTag = function (e, t, r) { var n = h(e, 'Failed to decode tag of "' + t + '"'); if (e.isError(n))
            return n; var i = u(e, n.primitive, 'Failed to get length of "' + t + '"'); if (e.isError(i))
            return i; if (!r && n.tag !== t && n.tagStr !== t && n.tagStr + "of" !== t)
            return e.error('Failed to match tag: "' + t + '"'); if (n.primitive || null !== i)
            return e.skip(i, 'Failed to match body of: "' + t + '"'); var s = e.save(), a = this._skipUntilEnd(e, 'Failed to skip indefinite length body: "' + this.tag + '"'); return e.isError(a) ? a : (i = e.offset - s.offset, e.restore(s), e.skip(i, 'Failed to match body of: "' + t + '"')); }, c.prototype._skipUntilEnd = function (e, t) { for (;;) {
            var r = h(e, t);
            if (e.isError(r))
                return r;
            var n, i = u(e, r.primitive, t);
            if (e.isError(i))
                return i;
            if (n = r.primitive || null !== i ? e.skip(i) : this._skipUntilEnd(e, t), e.isError(n))
                return n;
            if ("end" === r.tagStr)
                break;
        } }, c.prototype._decodeList = function (e, t, r, n) { for (var i = []; !e.isEmpty();) {
            var s = this._peekTag(e, "end");
            if (e.isError(s))
                return s;
            var a = r.decode(e, "der", n);
            if (e.isError(a) && s)
                break;
            i.push(a);
        } return i; }, c.prototype._decodeStr = function (e, t) { if ("bitstr" === t) {
            var r = e.readUInt8();
            return e.isError(r) ? r : { unused: r, data: e.raw() };
        } if ("bmpstr" === t) {
            var n = e.raw();
            if (n.length % 2 == 1)
                return e.error("Decoding of string type: bmpstr length mismatch");
            for (var i = "", s = 0; s < n.length / 2; s++)
                i += String.fromCharCode(n.readUInt16BE(2 * s));
            return i;
        } if ("numstr" === t) {
            var a = e.raw().toString("ascii");
            return this._isNumstr(a) ? a : e.error("Decoding of string type: numstr unsupported characters");
        } if ("octstr" === t)
            return e.raw(); if ("objDesc" === t)
            return e.raw(); if ("printstr" === t) {
            var o = e.raw().toString("ascii");
            return this._isPrintstr(o) ? o : e.error("Decoding of string type: printstr unsupported characters");
        } return /str$/.test(t) ? e.raw().toString() : e.error("Decoding of string type: " + t + " unsupported"); }, c.prototype._decodeObjid = function (e, t, r) { for (var n, i = [], s = 0; !e.isEmpty();) {
            var a = e.readUInt8();
            s <<= 7, s |= 127 & a, 0 == (128 & a) && (i.push(s), s = 0);
        } 128 & a && i.push(s); var o = i[0] / 40 | 0, f = i[0] % 40; if (n = r ? i : [o, f].concat(i.slice(1)), t) {
            var c = t[n.join(" ")];
            void 0 === c && (c = t[n.join(".")]), void 0 !== c && (n = c);
        } return n; }, c.prototype._decodeTime = function (e, t) { var r = e.raw().toString(); if ("gentime" === t)
            var n = 0 | r.slice(0, 4), i = 0 | r.slice(4, 6), s = 0 | r.slice(6, 8), a = 0 | r.slice(8, 10), o = 0 | r.slice(10, 12), f = 0 | r.slice(12, 14);
        else {
            if ("utctime" !== t)
                return e.error("Decoding " + t + " time is not supported yet");
            n = 0 | r.slice(0, 2), i = 0 | r.slice(2, 4), s = 0 | r.slice(4, 6), a = 0 | r.slice(6, 8), o = 0 | r.slice(8, 10), f = 0 | r.slice(10, 12);
            n = n < 70 ? 2e3 + n : 1900 + n;
        } return Date.UTC(n, i - 1, s, a, o, f, 0); }, c.prototype._decodeNull = function (e) { return null; }, c.prototype._decodeBool = function (e) { var t = e.readUInt8(); return e.isError(t) ? t : 0 !== t; }, c.prototype._decodeInt = function (e, t) { var r = e.raw(), n = new a(r); return t && (n = t[n.toString(10)] || n), n; }, c.prototype._use = function (e, t) { return "function" == typeof e && (e = e(t)), e._getDecoder("der").tree; }; }, { "../../asn1": 1, inherits: 108 }], 10: [function (e, t, r) { var n = r; n.der = e("./der"), n.pem = e("./pem"); }, { "./der": 9, "./pem": 11 }], 11: [function (e, t, r) { var n = e("inherits"), i = e("buffer").Buffer, s = e("./der"); function a(e) { s.call(this, e), this.enc = "pem"; } n(a, s), t.exports = a, a.prototype.decode = function (e, t) { for (var r = e.toString().split(/[\r\n]+/g), n = t.label.toUpperCase(), a = /^-----(BEGIN|END) ([^-]+)-----$/, o = -1, f = -1, c = 0; c < r.length; c++) {
            var h = r[c].match(a);
            if (null !== h && h[2] === n) {
                if (-1 !== o) {
                    if ("END" !== h[1])
                        break;
                    f = c;
                    break;
                }
                if ("BEGIN" !== h[1])
                    break;
                o = c;
            }
        } if (-1 === o || -1 === f)
            throw new Error("PEM section not found for: " + n); var u = r.slice(o + 1, f).join(""); u.replace(/[^a-z0-9\+\/=]+/gi, ""); var d = new i(u, "base64"); return s.prototype.decode.call(this, d, t); }; }, { "./der": 9, buffer: 51, inherits: 108 }], 12: [function (e, t, r) { var n = e("inherits"), i = e("buffer").Buffer, s = e("../../asn1"), a = s.base, o = s.constants.der; function f(e) { this.enc = "der", this.name = e.name, this.entity = e, this.tree = new c, this.tree._init(e.body); } function c(e) { a.Node.call(this, "der", e); } function h(e) { return e < 10 ? "0" + e : e; } t.exports = f, f.prototype.encode = function (e, t) { return this.tree._encode(e, t).join(); }, n(c, a.Node), c.prototype._encodeComposite = function (e, t, r, n) { var s, a = function (e, t, r, n) { var i; "seqof" === e ? e = "seq" : "setof" === e && (e = "set"); if (o.tagByName.hasOwnProperty(e))
            i = o.tagByName[e];
        else {
            if ("number" != typeof e || (0 | e) !== e)
                return n.error("Unknown tag: " + e);
            i = e;
        } if (i >= 31)
            return n.error("Multi-octet tag encoding unsupported"); t || (i |= 32); return i |= o.tagClassByName[r || "universal"] << 6; }(e, t, r, this.reporter); if (n.length < 128)
            return (s = new i(2))[0] = a, s[1] = n.length, this._createEncoderBuffer([s, n]); for (var f = 1, c = n.length; c >= 256; c >>= 8)
            f++; (s = new i(2 + f))[0] = a, s[1] = 128 | f; c = 1 + f; for (var h = n.length; h > 0; c--, h >>= 8)
            s[c] = 255 & h; return this._createEncoderBuffer([s, n]); }, c.prototype._encodeStr = function (e, t) { if ("bitstr" === t)
            return this._createEncoderBuffer([0 | e.unused, e.data]); if ("bmpstr" === t) {
            for (var r = new i(2 * e.length), n = 0; n < e.length; n++)
                r.writeUInt16BE(e.charCodeAt(n), 2 * n);
            return this._createEncoderBuffer(r);
        } return "numstr" === t ? this._isNumstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: numstr supports only digits and space") : "printstr" === t ? this._isPrintstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark") : /str$/.test(t) ? this._createEncoderBuffer(e) : "objDesc" === t ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: " + t + " unsupported"); }, c.prototype._encodeObjid = function (e, t, r) { if ("string" == typeof e) {
            if (!t)
                return this.reporter.error("string objid given, but no values map found");
            if (!t.hasOwnProperty(e))
                return this.reporter.error("objid not found in values map");
            e = t[e].split(/[\s\.]+/g);
            for (var n = 0; n < e.length; n++)
                e[n] |= 0;
        }
        else if (Array.isArray(e)) {
            e = e.slice();
            for (n = 0; n < e.length; n++)
                e[n] |= 0;
        } if (!Array.isArray(e))
            return this.reporter.error("objid() should be either array or string, got: " + JSON.stringify(e)); if (!r) {
            if (e[1] >= 40)
                return this.reporter.error("Second objid identifier OOB");
            e.splice(0, 2, 40 * e[0] + e[1]);
        } var s = 0; for (n = 0; n < e.length; n++) {
            var a = e[n];
            for (s++; a >= 128; a >>= 7)
                s++;
        } var o = new i(s), f = o.length - 1; for (n = e.length - 1; n >= 0; n--) {
            a = e[n];
            for (o[f--] = 127 & a; (a >>= 7) > 0;)
                o[f--] = 128 | 127 & a;
        } return this._createEncoderBuffer(o); }, c.prototype._encodeTime = function (e, t) { var r, n = new Date(e); return "gentime" === t ? r = [h(n.getFullYear()), h(n.getUTCMonth() + 1), h(n.getUTCDate()), h(n.getUTCHours()), h(n.getUTCMinutes()), h(n.getUTCSeconds()), "Z"].join("") : "utctime" === t ? r = [h(n.getFullYear() % 100), h(n.getUTCMonth() + 1), h(n.getUTCDate()), h(n.getUTCHours()), h(n.getUTCMinutes()), h(n.getUTCSeconds()), "Z"].join("") : this.reporter.error("Encoding " + t + " time is not supported yet"), this._encodeStr(r, "octstr"); }, c.prototype._encodeNull = function () { return this._createEncoderBuffer(""); }, c.prototype._encodeInt = function (e, t) { if ("string" == typeof e) {
            if (!t)
                return this.reporter.error("String int or enum given, but no values map");
            if (!t.hasOwnProperty(e))
                return this.reporter.error("Values map doesn't contain: " + JSON.stringify(e));
            e = t[e];
        } if ("number" != typeof e && !i.isBuffer(e)) {
            var r = e.toArray();
            !e.sign && 128 & r[0] && r.unshift(0), e = new i(r);
        } if (i.isBuffer(e)) {
            var n = e.length;
            0 === e.length && n++;
            var s = new i(n);
            return e.copy(s), 0 === e.length && (s[0] = 0), this._createEncoderBuffer(s);
        } if (e < 128)
            return this._createEncoderBuffer(e); if (e < 256)
            return this._createEncoderBuffer([0, e]); n = 1; for (var a = e; a >= 256; a >>= 8)
            n++; for (a = (s = new Array(n)).length - 1; a >= 0; a--)
            s[a] = 255 & e, e >>= 8; return 128 & s[0] && s.unshift(0), this._createEncoderBuffer(new i(s)); }, c.prototype._encodeBool = function (e) { return this._createEncoderBuffer(e ? 255 : 0); }, c.prototype._use = function (e, t) { return "function" == typeof e && (e = e(t)), e._getEncoder("der").tree; }, c.prototype._skipDefault = function (e, t, r) { var n, i = this._baseState; if (null === i.default)
            return !1; var s = e.join(); if (void 0 === i.defaultBuffer && (i.defaultBuffer = this._encodeValue(i.default, t, r).join()), s.length !== i.defaultBuffer.length)
            return !1; for (n = 0; n < s.length; n++)
            if (s[n] !== i.defaultBuffer[n])
                return !1; return !0; }; }, { "../../asn1": 1, buffer: 51, inherits: 108 }], 13: [function (e, t, r) { var n = r; n.der = e("./der"), n.pem = e("./pem"); }, { "./der": 12, "./pem": 14 }], 14: [function (e, t, r) { var n = e("inherits"), i = e("./der"); function s(e) { i.call(this, e), this.enc = "pem"; } n(s, i), t.exports = s, s.prototype.encode = function (e, t) { for (var r = i.prototype.encode.call(this, e).toString("base64"), n = ["-----BEGIN " + t.label + "-----"], s = 0; s < r.length; s += 64)
            n.push(r.slice(s, s + 64)); return n.push("-----END " + t.label + "-----"), n.join("\n"); }; }, { "./der": 12, inherits: 108 }], 15: [function (e, t, r) { (function (r) {
            "use strict";
            function n(e, t) { if (e === t)
                return 0; for (var r = e.length, n = t.length, i = 0, s = Math.min(r, n); i < s; ++i)
                if (e[i] !== t[i]) {
                    r = e[i], n = t[i];
                    break;
                } return r < n ? -1 : n < r ? 1 : 0; }
            function i(e) { return r.Buffer && "function" == typeof r.Buffer.isBuffer ? r.Buffer.isBuffer(e) : !(null == e || !e._isBuffer); }
            var s = e("util/"), a = Object.prototype.hasOwnProperty, o = Array.prototype.slice, f = "foo" === function () { }.name;
            function c(e) { return Object.prototype.toString.call(e); }
            function h(e) { return !i(e) && ("function" == typeof r.ArrayBuffer && ("function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(e) : !!e && (e instanceof DataView || !!(e.buffer && e.buffer instanceof ArrayBuffer)))); }
            var u = t.exports = g, d = /\s*function\s+([^\(\s]*)\s*/;
            function l(e) { if (s.isFunction(e)) {
                if (f)
                    return e.name;
                var t = e.toString().match(d);
                return t && t[1];
            } }
            function p(e, t) { return "string" == typeof e ? e.length < t ? e : e.slice(0, t) : e; }
            function b(e) { if (f || !s.isFunction(e))
                return s.inspect(e); var t = l(e); return "[Function" + (t ? ": " + t : "") + "]"; }
            function m(e, t, r, n, i) { throw new u.AssertionError({ message: r, actual: e, expected: t, operator: n, stackStartFunction: i }); }
            function g(e, t) { e || m(e, !0, t, "==", u.ok); }
            function y(e, t, r, a) { if (e === t)
                return !0; if (i(e) && i(t))
                return 0 === n(e, t); if (s.isDate(e) && s.isDate(t))
                return e.getTime() === t.getTime(); if (s.isRegExp(e) && s.isRegExp(t))
                return e.source === t.source && e.global === t.global && e.multiline === t.multiline && e.lastIndex === t.lastIndex && e.ignoreCase === t.ignoreCase; if (null !== e && "object" == typeof e || null !== t && "object" == typeof t) {
                if (h(e) && h(t) && c(e) === c(t) && !(e instanceof Float32Array || e instanceof Float64Array))
                    return 0 === n(new Uint8Array(e.buffer), new Uint8Array(t.buffer));
                if (i(e) !== i(t))
                    return !1;
                var f = (a = a || { actual: [], expected: [] }).actual.indexOf(e);
                return -1 !== f && f === a.expected.indexOf(t) || (a.actual.push(e), a.expected.push(t), function (e, t, r, n) { if (null === e || void 0 === e || null === t || void 0 === t)
                    return !1; if (s.isPrimitive(e) || s.isPrimitive(t))
                    return e === t; if (r && Object.getPrototypeOf(e) !== Object.getPrototypeOf(t))
                    return !1; var i = v(e), a = v(t); if (i && !a || !i && a)
                    return !1; if (i)
                    return e = o.call(e), t = o.call(t), y(e, t, r); var f, c, h = E(e), u = E(t); if (h.length !== u.length)
                    return !1; for (h.sort(), u.sort(), c = h.length - 1; c >= 0; c--)
                    if (h[c] !== u[c])
                        return !1; for (c = h.length - 1; c >= 0; c--)
                    if (f = h[c], !y(e[f], t[f], r, n))
                        return !1; return !0; }(e, t, r, a));
            } return r ? e === t : e == t; }
            function v(e) { return "[object Arguments]" == Object.prototype.toString.call(e); }
            function _(e, t) { if (!e || !t)
                return !1; if ("[object RegExp]" == Object.prototype.toString.call(t))
                return t.test(e); try {
                if (e instanceof t)
                    return !0;
            }
            catch (e) { } return !Error.isPrototypeOf(t) && !0 === t.call({}, e); }
            function w(e, t, r, n) { var i; if ("function" != typeof t)
                throw new TypeError('"block" argument must be a function'); "string" == typeof r && (n = r, r = null), i = function (e) { var t; try {
                e();
            }
            catch (e) {
                t = e;
            } return t; }(t), n = (r && r.name ? " (" + r.name + ")." : ".") + (n ? " " + n : "."), e && !i && m(i, r, "Missing expected exception" + n); var a = "string" == typeof n, o = !e && s.isError(i), f = !e && i && !r; if ((o && a && _(i, r) || f) && m(i, r, "Got unwanted exception" + n), e && i && r && !_(i, r) || !e && i)
                throw i; }
            u.AssertionError = function (e) { var t; this.name = "AssertionError", this.actual = e.actual, this.expected = e.expected, this.operator = e.operator, e.message ? (this.message = e.message, this.generatedMessage = !1) : (this.message = p(b((t = this).actual), 128) + " " + t.operator + " " + p(b(t.expected), 128), this.generatedMessage = !0); var r = e.stackStartFunction || m; if (Error.captureStackTrace)
                Error.captureStackTrace(this, r);
            else {
                var n = new Error;
                if (n.stack) {
                    var i = n.stack, s = l(r), a = i.indexOf("\n" + s);
                    if (a >= 0) {
                        var o = i.indexOf("\n", a + 1);
                        i = i.substring(o + 1);
                    }
                    this.stack = i;
                }
            } }, s.inherits(u.AssertionError, Error), u.fail = m, u.ok = g, u.equal = function (e, t, r) { e != t && m(e, t, r, "==", u.equal); }, u.notEqual = function (e, t, r) { e == t && m(e, t, r, "!=", u.notEqual); }, u.deepEqual = function (e, t, r) { y(e, t, !1) || m(e, t, r, "deepEqual", u.deepEqual); }, u.deepStrictEqual = function (e, t, r) { y(e, t, !0) || m(e, t, r, "deepStrictEqual", u.deepStrictEqual); }, u.notDeepEqual = function (e, t, r) { y(e, t, !1) && m(e, t, r, "notDeepEqual", u.notDeepEqual); }, u.notDeepStrictEqual = function e(t, r, n) { y(t, r, !0) && m(t, r, n, "notDeepStrictEqual", e); }, u.strictEqual = function (e, t, r) { e !== t && m(e, t, r, "===", u.strictEqual); }, u.notStrictEqual = function (e, t, r) { e === t && m(e, t, r, "!==", u.notStrictEqual); }, u.throws = function (e, t, r) { w(!0, e, t, r); }, u.doesNotThrow = function (e, t, r) { w(!1, e, t, r); }, u.ifError = function (e) { if (e)
                throw e; };
            var E = Object.keys || function (e) { var t = []; for (var r in e)
                a.call(e, r) && t.push(r); return t; };
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}); }, { "util/": 190 }], 16: [function (e, t, r) {
            "use strict";
            r.byteLength = function (e) { return 3 * e.length / 4 - c(e); }, r.toByteArray = function (e) { var t, r, n, a, o, f = e.length; a = c(e), o = new s(3 * f / 4 - a), r = a > 0 ? f - 4 : f; var h = 0; for (t = 0; t < r; t += 4)
                n = i[e.charCodeAt(t)] << 18 | i[e.charCodeAt(t + 1)] << 12 | i[e.charCodeAt(t + 2)] << 6 | i[e.charCodeAt(t + 3)], o[h++] = n >> 16 & 255, o[h++] = n >> 8 & 255, o[h++] = 255 & n; 2 === a ? (n = i[e.charCodeAt(t)] << 2 | i[e.charCodeAt(t + 1)] >> 4, o[h++] = 255 & n) : 1 === a && (n = i[e.charCodeAt(t)] << 10 | i[e.charCodeAt(t + 1)] << 4 | i[e.charCodeAt(t + 2)] >> 2, o[h++] = n >> 8 & 255, o[h++] = 255 & n); return o; }, r.fromByteArray = function (e) { for (var t, r = e.length, i = r % 3, s = "", a = [], o = 0, f = r - i; o < f; o += 16383)
                a.push(h(e, o, o + 16383 > f ? f : o + 16383)); 1 === i ? (t = e[r - 1], s += n[t >> 2], s += n[t << 4 & 63], s += "==") : 2 === i && (t = (e[r - 2] << 8) + e[r - 1], s += n[t >> 10], s += n[t >> 4 & 63], s += n[t << 2 & 63], s += "="); return a.push(s), a.join(""); };
            for (var n = [], i = [], s = "undefined" != typeof Uint8Array ? Uint8Array : Array, a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", o = 0, f = a.length; o < f; ++o)
                n[o] = a[o], i[a.charCodeAt(o)] = o;
            function c(e) { var t = e.length; if (t % 4 > 0)
                throw new Error("Invalid string. Length must be a multiple of 4"); return "=" === e[t - 2] ? 2 : "=" === e[t - 1] ? 1 : 0; }
            function h(e, t, r) { for (var i, s, a = [], o = t; o < r; o += 3)
                i = (e[o] << 16 & 16711680) + (e[o + 1] << 8 & 65280) + (255 & e[o + 2]), a.push(n[(s = i) >> 18 & 63] + n[s >> 12 & 63] + n[s >> 6 & 63] + n[63 & s]); return a.join(""); }
            i["-".charCodeAt(0)] = 62, i["_".charCodeAt(0)] = 63;
        }, {}], 17: [function (e, t, r) { !function (t, r) {
            "use strict";
            function n(e, t) { if (!e)
                throw new Error(t || "Assertion failed"); }
            function i(e, t) { e.super_ = t; var r = function () { }; r.prototype = t.prototype, e.prototype = new r, e.prototype.constructor = e; }
            function s(e, t, r) { if (s.isBN(e))
                return e; this.negative = 0, this.words = null, this.length = 0, this.red = null, null !== e && ("le" !== t && "be" !== t || (r = t, t = 10), this._init(e || 0, t || 10, r || "be")); }
            var a;
            "object" == typeof t ? t.exports = s : r.BN = s, s.BN = s, s.wordSize = 26;
            try {
                a = e("buffer").Buffer;
            }
            catch (e) { }
            function o(e, t, r) { for (var n = 0, i = Math.min(e.length, r), s = t; s < i; s++) {
                var a = e.charCodeAt(s) - 48;
                n <<= 4, n |= a >= 49 && a <= 54 ? a - 49 + 10 : a >= 17 && a <= 22 ? a - 17 + 10 : 15 & a;
            } return n; }
            function f(e, t, r, n) { for (var i = 0, s = Math.min(e.length, r), a = t; a < s; a++) {
                var o = e.charCodeAt(a) - 48;
                i *= n, i += o >= 49 ? o - 49 + 10 : o >= 17 ? o - 17 + 10 : o;
            } return i; }
            s.isBN = function (e) { return e instanceof s || null !== e && "object" == typeof e && e.constructor.wordSize === s.wordSize && Array.isArray(e.words); }, s.max = function (e, t) { return e.cmp(t) > 0 ? e : t; }, s.min = function (e, t) { return e.cmp(t) < 0 ? e : t; }, s.prototype._init = function (e, t, r) { if ("number" == typeof e)
                return this._initNumber(e, t, r); if ("object" == typeof e)
                return this._initArray(e, t, r); "hex" === t && (t = 16), n(t === (0 | t) && t >= 2 && t <= 36); var i = 0; "-" === (e = e.toString().replace(/\s+/g, ""))[0] && i++, 16 === t ? this._parseHex(e, i) : this._parseBase(e, t, i), "-" === e[0] && (this.negative = 1), this.strip(), "le" === r && this._initArray(this.toArray(), t, r); }, s.prototype._initNumber = function (e, t, r) { e < 0 && (this.negative = 1, e = -e), e < 67108864 ? (this.words = [67108863 & e], this.length = 1) : e < 4503599627370496 ? (this.words = [67108863 & e, e / 67108864 & 67108863], this.length = 2) : (n(e < 9007199254740992), this.words = [67108863 & e, e / 67108864 & 67108863, 1], this.length = 3), "le" === r && this._initArray(this.toArray(), t, r); }, s.prototype._initArray = function (e, t, r) { if (n("number" == typeof e.length), e.length <= 0)
                return this.words = [0], this.length = 1, this; this.length = Math.ceil(e.length / 3), this.words = new Array(this.length); for (var i = 0; i < this.length; i++)
                this.words[i] = 0; var s, a, o = 0; if ("be" === r)
                for (i = e.length - 1, s = 0; i >= 0; i -= 3)
                    a = e[i] | e[i - 1] << 8 | e[i - 2] << 16, this.words[s] |= a << o & 67108863, this.words[s + 1] = a >>> 26 - o & 67108863, (o += 24) >= 26 && (o -= 26, s++);
            else if ("le" === r)
                for (i = 0, s = 0; i < e.length; i += 3)
                    a = e[i] | e[i + 1] << 8 | e[i + 2] << 16, this.words[s] |= a << o & 67108863, this.words[s + 1] = a >>> 26 - o & 67108863, (o += 24) >= 26 && (o -= 26, s++); return this.strip(); }, s.prototype._parseHex = function (e, t) { this.length = Math.ceil((e.length - t) / 6), this.words = new Array(this.length); for (var r = 0; r < this.length; r++)
                this.words[r] = 0; var n, i, s = 0; for (r = e.length - 6, n = 0; r >= t; r -= 6)
                i = o(e, r, r + 6), this.words[n] |= i << s & 67108863, this.words[n + 1] |= i >>> 26 - s & 4194303, (s += 24) >= 26 && (s -= 26, n++); r + 6 !== t && (i = o(e, t, r + 6), this.words[n] |= i << s & 67108863, this.words[n + 1] |= i >>> 26 - s & 4194303), this.strip(); }, s.prototype._parseBase = function (e, t, r) { this.words = [0], this.length = 1; for (var n = 0, i = 1; i <= 67108863; i *= t)
                n++; n--, i = i / t | 0; for (var s = e.length - r, a = s % n, o = Math.min(s, s - a) + r, c = 0, h = r; h < o; h += n)
                c = f(e, h, h + n, t), this.imuln(i), this.words[0] + c < 67108864 ? this.words[0] += c : this._iaddn(c); if (0 !== a) {
                var u = 1;
                for (c = f(e, h, e.length, t), h = 0; h < a; h++)
                    u *= t;
                this.imuln(u), this.words[0] + c < 67108864 ? this.words[0] += c : this._iaddn(c);
            } }, s.prototype.copy = function (e) { e.words = new Array(this.length); for (var t = 0; t < this.length; t++)
                e.words[t] = this.words[t]; e.length = this.length, e.negative = this.negative, e.red = this.red; }, s.prototype.clone = function () { var e = new s(null); return this.copy(e), e; }, s.prototype._expand = function (e) { for (; this.length < e;)
                this.words[this.length++] = 0; return this; }, s.prototype.strip = function () { for (; this.length > 1 && 0 === this.words[this.length - 1];)
                this.length--; return this._normSign(); }, s.prototype._normSign = function () { return 1 === this.length && 0 === this.words[0] && (this.negative = 0), this; }, s.prototype.inspect = function () { return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">"; };
            var c = ["", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000"], h = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5], u = [0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176];
            function d(e, t, r) { r.negative = t.negative ^ e.negative; var n = e.length + t.length | 0; r.length = n, n = n - 1 | 0; var i = 0 | e.words[0], s = 0 | t.words[0], a = i * s, o = 67108863 & a, f = a / 67108864 | 0; r.words[0] = o; for (var c = 1; c < n; c++) {
                for (var h = f >>> 26, u = 67108863 & f, d = Math.min(c, t.length - 1), l = Math.max(0, c - e.length + 1); l <= d; l++) {
                    var p = c - l | 0;
                    h += (a = (i = 0 | e.words[p]) * (s = 0 | t.words[l]) + u) / 67108864 | 0, u = 67108863 & a;
                }
                r.words[c] = 0 | u, f = 0 | h;
            } return 0 !== f ? r.words[c] = 0 | f : r.length--, r.strip(); }
            s.prototype.toString = function (e, t) { var r; if (e = e || 10, t = 0 | t || 1, 16 === e || "hex" === e) {
                r = "";
                for (var i = 0, s = 0, a = 0; a < this.length; a++) {
                    var o = this.words[a], f = (16777215 & (o << i | s)).toString(16);
                    r = 0 !== (s = o >>> 24 - i & 16777215) || a !== this.length - 1 ? c[6 - f.length] + f + r : f + r, (i += 2) >= 26 && (i -= 26, a--);
                }
                for (0 !== s && (r = s.toString(16) + r); r.length % t != 0;)
                    r = "0" + r;
                return 0 !== this.negative && (r = "-" + r), r;
            } if (e === (0 | e) && e >= 2 && e <= 36) {
                var d = h[e], l = u[e];
                r = "";
                var p = this.clone();
                for (p.negative = 0; !p.isZero();) {
                    var b = p.modn(l).toString(e);
                    r = (p = p.idivn(l)).isZero() ? b + r : c[d - b.length] + b + r;
                }
                for (this.isZero() && (r = "0" + r); r.length % t != 0;)
                    r = "0" + r;
                return 0 !== this.negative && (r = "-" + r), r;
            } n(!1, "Base should be between 2 and 36"); }, s.prototype.toNumber = function () { var e = this.words[0]; return 2 === this.length ? e += 67108864 * this.words[1] : 3 === this.length && 1 === this.words[2] ? e += 4503599627370496 + 67108864 * this.words[1] : this.length > 2 && n(!1, "Number can only safely store up to 53 bits"), 0 !== this.negative ? -e : e; }, s.prototype.toJSON = function () { return this.toString(16); }, s.prototype.toBuffer = function (e, t) { return n(void 0 !== a), this.toArrayLike(a, e, t); }, s.prototype.toArray = function (e, t) { return this.toArrayLike(Array, e, t); }, s.prototype.toArrayLike = function (e, t, r) { var i = this.byteLength(), s = r || Math.max(1, i); n(i <= s, "byte array longer than desired length"), n(s > 0, "Requested array length <= 0"), this.strip(); var a, o, f = "le" === t, c = new e(s), h = this.clone(); if (f) {
                for (o = 0; !h.isZero(); o++)
                    a = h.andln(255), h.iushrn(8), c[o] = a;
                for (; o < s; o++)
                    c[o] = 0;
            }
            else {
                for (o = 0; o < s - i; o++)
                    c[o] = 0;
                for (o = 0; !h.isZero(); o++)
                    a = h.andln(255), h.iushrn(8), c[s - o - 1] = a;
            } return c; }, Math.clz32 ? s.prototype._countBits = function (e) { return 32 - Math.clz32(e); } : s.prototype._countBits = function (e) { var t = e, r = 0; return t >= 4096 && (r += 13, t >>>= 13), t >= 64 && (r += 7, t >>>= 7), t >= 8 && (r += 4, t >>>= 4), t >= 2 && (r += 2, t >>>= 2), r + t; }, s.prototype._zeroBits = function (e) { if (0 === e)
                return 26; var t = e, r = 0; return 0 == (8191 & t) && (r += 13, t >>>= 13), 0 == (127 & t) && (r += 7, t >>>= 7), 0 == (15 & t) && (r += 4, t >>>= 4), 0 == (3 & t) && (r += 2, t >>>= 2), 0 == (1 & t) && r++, r; }, s.prototype.bitLength = function () { var e = this.words[this.length - 1], t = this._countBits(e); return 26 * (this.length - 1) + t; }, s.prototype.zeroBits = function () { if (this.isZero())
                return 0; for (var e = 0, t = 0; t < this.length; t++) {
                var r = this._zeroBits(this.words[t]);
                if (e += r, 26 !== r)
                    break;
            } return e; }, s.prototype.byteLength = function () { return Math.ceil(this.bitLength() / 8); }, s.prototype.toTwos = function (e) { return 0 !== this.negative ? this.abs().inotn(e).iaddn(1) : this.clone(); }, s.prototype.fromTwos = function (e) { return this.testn(e - 1) ? this.notn(e).iaddn(1).ineg() : this.clone(); }, s.prototype.isNeg = function () { return 0 !== this.negative; }, s.prototype.neg = function () { return this.clone().ineg(); }, s.prototype.ineg = function () { return this.isZero() || (this.negative ^= 1), this; }, s.prototype.iuor = function (e) { for (; this.length < e.length;)
                this.words[this.length++] = 0; for (var t = 0; t < e.length; t++)
                this.words[t] = this.words[t] | e.words[t]; return this.strip(); }, s.prototype.ior = function (e) { return n(0 == (this.negative | e.negative)), this.iuor(e); }, s.prototype.or = function (e) { return this.length > e.length ? this.clone().ior(e) : e.clone().ior(this); }, s.prototype.uor = function (e) { return this.length > e.length ? this.clone().iuor(e) : e.clone().iuor(this); }, s.prototype.iuand = function (e) { var t; t = this.length > e.length ? e : this; for (var r = 0; r < t.length; r++)
                this.words[r] = this.words[r] & e.words[r]; return this.length = t.length, this.strip(); }, s.prototype.iand = function (e) { return n(0 == (this.negative | e.negative)), this.iuand(e); }, s.prototype.and = function (e) { return this.length > e.length ? this.clone().iand(e) : e.clone().iand(this); }, s.prototype.uand = function (e) { return this.length > e.length ? this.clone().iuand(e) : e.clone().iuand(this); }, s.prototype.iuxor = function (e) { var t, r; this.length > e.length ? (t = this, r = e) : (t = e, r = this); for (var n = 0; n < r.length; n++)
                this.words[n] = t.words[n] ^ r.words[n]; if (this !== t)
                for (; n < t.length; n++)
                    this.words[n] = t.words[n]; return this.length = t.length, this.strip(); }, s.prototype.ixor = function (e) { return n(0 == (this.negative | e.negative)), this.iuxor(e); }, s.prototype.xor = function (e) { return this.length > e.length ? this.clone().ixor(e) : e.clone().ixor(this); }, s.prototype.uxor = function (e) { return this.length > e.length ? this.clone().iuxor(e) : e.clone().iuxor(this); }, s.prototype.inotn = function (e) { n("number" == typeof e && e >= 0); var t = 0 | Math.ceil(e / 26), r = e % 26; this._expand(t), r > 0 && t--; for (var i = 0; i < t; i++)
                this.words[i] = 67108863 & ~this.words[i]; return r > 0 && (this.words[i] = ~this.words[i] & 67108863 >> 26 - r), this.strip(); }, s.prototype.notn = function (e) { return this.clone().inotn(e); }, s.prototype.setn = function (e, t) { n("number" == typeof e && e >= 0); var r = e / 26 | 0, i = e % 26; return this._expand(r + 1), this.words[r] = t ? this.words[r] | 1 << i : this.words[r] & ~(1 << i), this.strip(); }, s.prototype.iadd = function (e) { var t, r, n; if (0 !== this.negative && 0 === e.negative)
                return this.negative = 0, t = this.isub(e), this.negative ^= 1, this._normSign(); if (0 === this.negative && 0 !== e.negative)
                return e.negative = 0, t = this.isub(e), e.negative = 1, t._normSign(); this.length > e.length ? (r = this, n = e) : (r = e, n = this); for (var i = 0, s = 0; s < n.length; s++)
                t = (0 | r.words[s]) + (0 | n.words[s]) + i, this.words[s] = 67108863 & t, i = t >>> 26; for (; 0 !== i && s < r.length; s++)
                t = (0 | r.words[s]) + i, this.words[s] = 67108863 & t, i = t >>> 26; if (this.length = r.length, 0 !== i)
                this.words[this.length] = i, this.length++;
            else if (r !== this)
                for (; s < r.length; s++)
                    this.words[s] = r.words[s]; return this; }, s.prototype.add = function (e) { var t; return 0 !== e.negative && 0 === this.negative ? (e.negative = 0, t = this.sub(e), e.negative ^= 1, t) : 0 === e.negative && 0 !== this.negative ? (this.negative = 0, t = e.sub(this), this.negative = 1, t) : this.length > e.length ? this.clone().iadd(e) : e.clone().iadd(this); }, s.prototype.isub = function (e) { if (0 !== e.negative) {
                e.negative = 0;
                var t = this.iadd(e);
                return e.negative = 1, t._normSign();
            } if (0 !== this.negative)
                return this.negative = 0, this.iadd(e), this.negative = 1, this._normSign(); var r, n, i = this.cmp(e); if (0 === i)
                return this.negative = 0, this.length = 1, this.words[0] = 0, this; i > 0 ? (r = this, n = e) : (r = e, n = this); for (var s = 0, a = 0; a < n.length; a++)
                s = (t = (0 | r.words[a]) - (0 | n.words[a]) + s) >> 26, this.words[a] = 67108863 & t; for (; 0 !== s && a < r.length; a++)
                s = (t = (0 | r.words[a]) + s) >> 26, this.words[a] = 67108863 & t; if (0 === s && a < r.length && r !== this)
                for (; a < r.length; a++)
                    this.words[a] = r.words[a]; return this.length = Math.max(this.length, a), r !== this && (this.negative = 1), this.strip(); }, s.prototype.sub = function (e) { return this.clone().isub(e); };
            var l = function (e, t, r) { var n, i, s, a = e.words, o = t.words, f = r.words, c = 0, h = 0 | a[0], u = 8191 & h, d = h >>> 13, l = 0 | a[1], p = 8191 & l, b = l >>> 13, m = 0 | a[2], g = 8191 & m, y = m >>> 13, v = 0 | a[3], _ = 8191 & v, w = v >>> 13, E = 0 | a[4], k = 8191 & E, S = E >>> 13, x = 0 | a[5], A = 8191 & x, M = x >>> 13, I = 0 | a[6], B = 8191 & I, j = I >>> 13, R = 0 | a[7], T = 8191 & R, C = R >>> 13, O = 0 | a[8], z = 8191 & O, L = O >>> 13, N = 0 | a[9], P = 8191 & N, D = N >>> 13, U = 0 | o[0], q = 8191 & U, F = U >>> 13, H = 0 | o[1], Z = 8191 & H, K = H >>> 13, W = 0 | o[2], G = 8191 & W, V = W >>> 13, X = 0 | o[3], Y = 8191 & X, J = X >>> 13, $ = 0 | o[4], Q = 8191 & $, ee = $ >>> 13, te = 0 | o[5], re = 8191 & te, ne = te >>> 13, ie = 0 | o[6], se = 8191 & ie, ae = ie >>> 13, oe = 0 | o[7], fe = 8191 & oe, ce = oe >>> 13, he = 0 | o[8], ue = 8191 & he, de = he >>> 13, le = 0 | o[9], pe = 8191 & le, be = le >>> 13; r.negative = e.negative ^ t.negative, r.length = 19; var me = (c + (n = Math.imul(u, q)) | 0) + ((8191 & (i = (i = Math.imul(u, F)) + Math.imul(d, q) | 0)) << 13) | 0; c = ((s = Math.imul(d, F)) + (i >>> 13) | 0) + (me >>> 26) | 0, me &= 67108863, n = Math.imul(p, q), i = (i = Math.imul(p, F)) + Math.imul(b, q) | 0, s = Math.imul(b, F); var ge = (c + (n = n + Math.imul(u, Z) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(u, K) | 0) + Math.imul(d, Z) | 0)) << 13) | 0; c = ((s = s + Math.imul(d, K) | 0) + (i >>> 13) | 0) + (ge >>> 26) | 0, ge &= 67108863, n = Math.imul(g, q), i = (i = Math.imul(g, F)) + Math.imul(y, q) | 0, s = Math.imul(y, F), n = n + Math.imul(p, Z) | 0, i = (i = i + Math.imul(p, K) | 0) + Math.imul(b, Z) | 0, s = s + Math.imul(b, K) | 0; var ye = (c + (n = n + Math.imul(u, G) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(u, V) | 0) + Math.imul(d, G) | 0)) << 13) | 0; c = ((s = s + Math.imul(d, V) | 0) + (i >>> 13) | 0) + (ye >>> 26) | 0, ye &= 67108863, n = Math.imul(_, q), i = (i = Math.imul(_, F)) + Math.imul(w, q) | 0, s = Math.imul(w, F), n = n + Math.imul(g, Z) | 0, i = (i = i + Math.imul(g, K) | 0) + Math.imul(y, Z) | 0, s = s + Math.imul(y, K) | 0, n = n + Math.imul(p, G) | 0, i = (i = i + Math.imul(p, V) | 0) + Math.imul(b, G) | 0, s = s + Math.imul(b, V) | 0; var ve = (c + (n = n + Math.imul(u, Y) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(u, J) | 0) + Math.imul(d, Y) | 0)) << 13) | 0; c = ((s = s + Math.imul(d, J) | 0) + (i >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, n = Math.imul(k, q), i = (i = Math.imul(k, F)) + Math.imul(S, q) | 0, s = Math.imul(S, F), n = n + Math.imul(_, Z) | 0, i = (i = i + Math.imul(_, K) | 0) + Math.imul(w, Z) | 0, s = s + Math.imul(w, K) | 0, n = n + Math.imul(g, G) | 0, i = (i = i + Math.imul(g, V) | 0) + Math.imul(y, G) | 0, s = s + Math.imul(y, V) | 0, n = n + Math.imul(p, Y) | 0, i = (i = i + Math.imul(p, J) | 0) + Math.imul(b, Y) | 0, s = s + Math.imul(b, J) | 0; var _e = (c + (n = n + Math.imul(u, Q) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(u, ee) | 0) + Math.imul(d, Q) | 0)) << 13) | 0; c = ((s = s + Math.imul(d, ee) | 0) + (i >>> 13) | 0) + (_e >>> 26) | 0, _e &= 67108863, n = Math.imul(A, q), i = (i = Math.imul(A, F)) + Math.imul(M, q) | 0, s = Math.imul(M, F), n = n + Math.imul(k, Z) | 0, i = (i = i + Math.imul(k, K) | 0) + Math.imul(S, Z) | 0, s = s + Math.imul(S, K) | 0, n = n + Math.imul(_, G) | 0, i = (i = i + Math.imul(_, V) | 0) + Math.imul(w, G) | 0, s = s + Math.imul(w, V) | 0, n = n + Math.imul(g, Y) | 0, i = (i = i + Math.imul(g, J) | 0) + Math.imul(y, Y) | 0, s = s + Math.imul(y, J) | 0, n = n + Math.imul(p, Q) | 0, i = (i = i + Math.imul(p, ee) | 0) + Math.imul(b, Q) | 0, s = s + Math.imul(b, ee) | 0; var we = (c + (n = n + Math.imul(u, re) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(u, ne) | 0) + Math.imul(d, re) | 0)) << 13) | 0; c = ((s = s + Math.imul(d, ne) | 0) + (i >>> 13) | 0) + (we >>> 26) | 0, we &= 67108863, n = Math.imul(B, q), i = (i = Math.imul(B, F)) + Math.imul(j, q) | 0, s = Math.imul(j, F), n = n + Math.imul(A, Z) | 0, i = (i = i + Math.imul(A, K) | 0) + Math.imul(M, Z) | 0, s = s + Math.imul(M, K) | 0, n = n + Math.imul(k, G) | 0, i = (i = i + Math.imul(k, V) | 0) + Math.imul(S, G) | 0, s = s + Math.imul(S, V) | 0, n = n + Math.imul(_, Y) | 0, i = (i = i + Math.imul(_, J) | 0) + Math.imul(w, Y) | 0, s = s + Math.imul(w, J) | 0, n = n + Math.imul(g, Q) | 0, i = (i = i + Math.imul(g, ee) | 0) + Math.imul(y, Q) | 0, s = s + Math.imul(y, ee) | 0, n = n + Math.imul(p, re) | 0, i = (i = i + Math.imul(p, ne) | 0) + Math.imul(b, re) | 0, s = s + Math.imul(b, ne) | 0; var Ee = (c + (n = n + Math.imul(u, se) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(u, ae) | 0) + Math.imul(d, se) | 0)) << 13) | 0; c = ((s = s + Math.imul(d, ae) | 0) + (i >>> 13) | 0) + (Ee >>> 26) | 0, Ee &= 67108863, n = Math.imul(T, q), i = (i = Math.imul(T, F)) + Math.imul(C, q) | 0, s = Math.imul(C, F), n = n + Math.imul(B, Z) | 0, i = (i = i + Math.imul(B, K) | 0) + Math.imul(j, Z) | 0, s = s + Math.imul(j, K) | 0, n = n + Math.imul(A, G) | 0, i = (i = i + Math.imul(A, V) | 0) + Math.imul(M, G) | 0, s = s + Math.imul(M, V) | 0, n = n + Math.imul(k, Y) | 0, i = (i = i + Math.imul(k, J) | 0) + Math.imul(S, Y) | 0, s = s + Math.imul(S, J) | 0, n = n + Math.imul(_, Q) | 0, i = (i = i + Math.imul(_, ee) | 0) + Math.imul(w, Q) | 0, s = s + Math.imul(w, ee) | 0, n = n + Math.imul(g, re) | 0, i = (i = i + Math.imul(g, ne) | 0) + Math.imul(y, re) | 0, s = s + Math.imul(y, ne) | 0, n = n + Math.imul(p, se) | 0, i = (i = i + Math.imul(p, ae) | 0) + Math.imul(b, se) | 0, s = s + Math.imul(b, ae) | 0; var ke = (c + (n = n + Math.imul(u, fe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(u, ce) | 0) + Math.imul(d, fe) | 0)) << 13) | 0; c = ((s = s + Math.imul(d, ce) | 0) + (i >>> 13) | 0) + (ke >>> 26) | 0, ke &= 67108863, n = Math.imul(z, q), i = (i = Math.imul(z, F)) + Math.imul(L, q) | 0, s = Math.imul(L, F), n = n + Math.imul(T, Z) | 0, i = (i = i + Math.imul(T, K) | 0) + Math.imul(C, Z) | 0, s = s + Math.imul(C, K) | 0, n = n + Math.imul(B, G) | 0, i = (i = i + Math.imul(B, V) | 0) + Math.imul(j, G) | 0, s = s + Math.imul(j, V) | 0, n = n + Math.imul(A, Y) | 0, i = (i = i + Math.imul(A, J) | 0) + Math.imul(M, Y) | 0, s = s + Math.imul(M, J) | 0, n = n + Math.imul(k, Q) | 0, i = (i = i + Math.imul(k, ee) | 0) + Math.imul(S, Q) | 0, s = s + Math.imul(S, ee) | 0, n = n + Math.imul(_, re) | 0, i = (i = i + Math.imul(_, ne) | 0) + Math.imul(w, re) | 0, s = s + Math.imul(w, ne) | 0, n = n + Math.imul(g, se) | 0, i = (i = i + Math.imul(g, ae) | 0) + Math.imul(y, se) | 0, s = s + Math.imul(y, ae) | 0, n = n + Math.imul(p, fe) | 0, i = (i = i + Math.imul(p, ce) | 0) + Math.imul(b, fe) | 0, s = s + Math.imul(b, ce) | 0; var Se = (c + (n = n + Math.imul(u, ue) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(u, de) | 0) + Math.imul(d, ue) | 0)) << 13) | 0; c = ((s = s + Math.imul(d, de) | 0) + (i >>> 13) | 0) + (Se >>> 26) | 0, Se &= 67108863, n = Math.imul(P, q), i = (i = Math.imul(P, F)) + Math.imul(D, q) | 0, s = Math.imul(D, F), n = n + Math.imul(z, Z) | 0, i = (i = i + Math.imul(z, K) | 0) + Math.imul(L, Z) | 0, s = s + Math.imul(L, K) | 0, n = n + Math.imul(T, G) | 0, i = (i = i + Math.imul(T, V) | 0) + Math.imul(C, G) | 0, s = s + Math.imul(C, V) | 0, n = n + Math.imul(B, Y) | 0, i = (i = i + Math.imul(B, J) | 0) + Math.imul(j, Y) | 0, s = s + Math.imul(j, J) | 0, n = n + Math.imul(A, Q) | 0, i = (i = i + Math.imul(A, ee) | 0) + Math.imul(M, Q) | 0, s = s + Math.imul(M, ee) | 0, n = n + Math.imul(k, re) | 0, i = (i = i + Math.imul(k, ne) | 0) + Math.imul(S, re) | 0, s = s + Math.imul(S, ne) | 0, n = n + Math.imul(_, se) | 0, i = (i = i + Math.imul(_, ae) | 0) + Math.imul(w, se) | 0, s = s + Math.imul(w, ae) | 0, n = n + Math.imul(g, fe) | 0, i = (i = i + Math.imul(g, ce) | 0) + Math.imul(y, fe) | 0, s = s + Math.imul(y, ce) | 0, n = n + Math.imul(p, ue) | 0, i = (i = i + Math.imul(p, de) | 0) + Math.imul(b, ue) | 0, s = s + Math.imul(b, de) | 0; var xe = (c + (n = n + Math.imul(u, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(u, be) | 0) + Math.imul(d, pe) | 0)) << 13) | 0; c = ((s = s + Math.imul(d, be) | 0) + (i >>> 13) | 0) + (xe >>> 26) | 0, xe &= 67108863, n = Math.imul(P, Z), i = (i = Math.imul(P, K)) + Math.imul(D, Z) | 0, s = Math.imul(D, K), n = n + Math.imul(z, G) | 0, i = (i = i + Math.imul(z, V) | 0) + Math.imul(L, G) | 0, s = s + Math.imul(L, V) | 0, n = n + Math.imul(T, Y) | 0, i = (i = i + Math.imul(T, J) | 0) + Math.imul(C, Y) | 0, s = s + Math.imul(C, J) | 0, n = n + Math.imul(B, Q) | 0, i = (i = i + Math.imul(B, ee) | 0) + Math.imul(j, Q) | 0, s = s + Math.imul(j, ee) | 0, n = n + Math.imul(A, re) | 0, i = (i = i + Math.imul(A, ne) | 0) + Math.imul(M, re) | 0, s = s + Math.imul(M, ne) | 0, n = n + Math.imul(k, se) | 0, i = (i = i + Math.imul(k, ae) | 0) + Math.imul(S, se) | 0, s = s + Math.imul(S, ae) | 0, n = n + Math.imul(_, fe) | 0, i = (i = i + Math.imul(_, ce) | 0) + Math.imul(w, fe) | 0, s = s + Math.imul(w, ce) | 0, n = n + Math.imul(g, ue) | 0, i = (i = i + Math.imul(g, de) | 0) + Math.imul(y, ue) | 0, s = s + Math.imul(y, de) | 0; var Ae = (c + (n = n + Math.imul(p, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(p, be) | 0) + Math.imul(b, pe) | 0)) << 13) | 0; c = ((s = s + Math.imul(b, be) | 0) + (i >>> 13) | 0) + (Ae >>> 26) | 0, Ae &= 67108863, n = Math.imul(P, G), i = (i = Math.imul(P, V)) + Math.imul(D, G) | 0, s = Math.imul(D, V), n = n + Math.imul(z, Y) | 0, i = (i = i + Math.imul(z, J) | 0) + Math.imul(L, Y) | 0, s = s + Math.imul(L, J) | 0, n = n + Math.imul(T, Q) | 0, i = (i = i + Math.imul(T, ee) | 0) + Math.imul(C, Q) | 0, s = s + Math.imul(C, ee) | 0, n = n + Math.imul(B, re) | 0, i = (i = i + Math.imul(B, ne) | 0) + Math.imul(j, re) | 0, s = s + Math.imul(j, ne) | 0, n = n + Math.imul(A, se) | 0, i = (i = i + Math.imul(A, ae) | 0) + Math.imul(M, se) | 0, s = s + Math.imul(M, ae) | 0, n = n + Math.imul(k, fe) | 0, i = (i = i + Math.imul(k, ce) | 0) + Math.imul(S, fe) | 0, s = s + Math.imul(S, ce) | 0, n = n + Math.imul(_, ue) | 0, i = (i = i + Math.imul(_, de) | 0) + Math.imul(w, ue) | 0, s = s + Math.imul(w, de) | 0; var Me = (c + (n = n + Math.imul(g, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(g, be) | 0) + Math.imul(y, pe) | 0)) << 13) | 0; c = ((s = s + Math.imul(y, be) | 0) + (i >>> 13) | 0) + (Me >>> 26) | 0, Me &= 67108863, n = Math.imul(P, Y), i = (i = Math.imul(P, J)) + Math.imul(D, Y) | 0, s = Math.imul(D, J), n = n + Math.imul(z, Q) | 0, i = (i = i + Math.imul(z, ee) | 0) + Math.imul(L, Q) | 0, s = s + Math.imul(L, ee) | 0, n = n + Math.imul(T, re) | 0, i = (i = i + Math.imul(T, ne) | 0) + Math.imul(C, re) | 0, s = s + Math.imul(C, ne) | 0, n = n + Math.imul(B, se) | 0, i = (i = i + Math.imul(B, ae) | 0) + Math.imul(j, se) | 0, s = s + Math.imul(j, ae) | 0, n = n + Math.imul(A, fe) | 0, i = (i = i + Math.imul(A, ce) | 0) + Math.imul(M, fe) | 0, s = s + Math.imul(M, ce) | 0, n = n + Math.imul(k, ue) | 0, i = (i = i + Math.imul(k, de) | 0) + Math.imul(S, ue) | 0, s = s + Math.imul(S, de) | 0; var Ie = (c + (n = n + Math.imul(_, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(_, be) | 0) + Math.imul(w, pe) | 0)) << 13) | 0; c = ((s = s + Math.imul(w, be) | 0) + (i >>> 13) | 0) + (Ie >>> 26) | 0, Ie &= 67108863, n = Math.imul(P, Q), i = (i = Math.imul(P, ee)) + Math.imul(D, Q) | 0, s = Math.imul(D, ee), n = n + Math.imul(z, re) | 0, i = (i = i + Math.imul(z, ne) | 0) + Math.imul(L, re) | 0, s = s + Math.imul(L, ne) | 0, n = n + Math.imul(T, se) | 0, i = (i = i + Math.imul(T, ae) | 0) + Math.imul(C, se) | 0, s = s + Math.imul(C, ae) | 0, n = n + Math.imul(B, fe) | 0, i = (i = i + Math.imul(B, ce) | 0) + Math.imul(j, fe) | 0, s = s + Math.imul(j, ce) | 0, n = n + Math.imul(A, ue) | 0, i = (i = i + Math.imul(A, de) | 0) + Math.imul(M, ue) | 0, s = s + Math.imul(M, de) | 0; var Be = (c + (n = n + Math.imul(k, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(k, be) | 0) + Math.imul(S, pe) | 0)) << 13) | 0; c = ((s = s + Math.imul(S, be) | 0) + (i >>> 13) | 0) + (Be >>> 26) | 0, Be &= 67108863, n = Math.imul(P, re), i = (i = Math.imul(P, ne)) + Math.imul(D, re) | 0, s = Math.imul(D, ne), n = n + Math.imul(z, se) | 0, i = (i = i + Math.imul(z, ae) | 0) + Math.imul(L, se) | 0, s = s + Math.imul(L, ae) | 0, n = n + Math.imul(T, fe) | 0, i = (i = i + Math.imul(T, ce) | 0) + Math.imul(C, fe) | 0, s = s + Math.imul(C, ce) | 0, n = n + Math.imul(B, ue) | 0, i = (i = i + Math.imul(B, de) | 0) + Math.imul(j, ue) | 0, s = s + Math.imul(j, de) | 0; var je = (c + (n = n + Math.imul(A, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(A, be) | 0) + Math.imul(M, pe) | 0)) << 13) | 0; c = ((s = s + Math.imul(M, be) | 0) + (i >>> 13) | 0) + (je >>> 26) | 0, je &= 67108863, n = Math.imul(P, se), i = (i = Math.imul(P, ae)) + Math.imul(D, se) | 0, s = Math.imul(D, ae), n = n + Math.imul(z, fe) | 0, i = (i = i + Math.imul(z, ce) | 0) + Math.imul(L, fe) | 0, s = s + Math.imul(L, ce) | 0, n = n + Math.imul(T, ue) | 0, i = (i = i + Math.imul(T, de) | 0) + Math.imul(C, ue) | 0, s = s + Math.imul(C, de) | 0; var Re = (c + (n = n + Math.imul(B, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(B, be) | 0) + Math.imul(j, pe) | 0)) << 13) | 0; c = ((s = s + Math.imul(j, be) | 0) + (i >>> 13) | 0) + (Re >>> 26) | 0, Re &= 67108863, n = Math.imul(P, fe), i = (i = Math.imul(P, ce)) + Math.imul(D, fe) | 0, s = Math.imul(D, ce), n = n + Math.imul(z, ue) | 0, i = (i = i + Math.imul(z, de) | 0) + Math.imul(L, ue) | 0, s = s + Math.imul(L, de) | 0; var Te = (c + (n = n + Math.imul(T, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(T, be) | 0) + Math.imul(C, pe) | 0)) << 13) | 0; c = ((s = s + Math.imul(C, be) | 0) + (i >>> 13) | 0) + (Te >>> 26) | 0, Te &= 67108863, n = Math.imul(P, ue), i = (i = Math.imul(P, de)) + Math.imul(D, ue) | 0, s = Math.imul(D, de); var Ce = (c + (n = n + Math.imul(z, pe) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(z, be) | 0) + Math.imul(L, pe) | 0)) << 13) | 0; c = ((s = s + Math.imul(L, be) | 0) + (i >>> 13) | 0) + (Ce >>> 26) | 0, Ce &= 67108863; var Oe = (c + (n = Math.imul(P, pe)) | 0) + ((8191 & (i = (i = Math.imul(P, be)) + Math.imul(D, pe) | 0)) << 13) | 0; return c = ((s = Math.imul(D, be)) + (i >>> 13) | 0) + (Oe >>> 26) | 0, Oe &= 67108863, f[0] = me, f[1] = ge, f[2] = ye, f[3] = ve, f[4] = _e, f[5] = we, f[6] = Ee, f[7] = ke, f[8] = Se, f[9] = xe, f[10] = Ae, f[11] = Me, f[12] = Ie, f[13] = Be, f[14] = je, f[15] = Re, f[16] = Te, f[17] = Ce, f[18] = Oe, 0 !== c && (f[19] = c, r.length++), r; };
            function p(e, t, r) { return (new b).mulp(e, t, r); }
            function b(e, t) { this.x = e, this.y = t; }
            Math.imul || (l = d), s.prototype.mulTo = function (e, t) { var r = this.length + e.length; return 10 === this.length && 10 === e.length ? l(this, e, t) : r < 63 ? d(this, e, t) : r < 1024 ? function (e, t, r) { r.negative = t.negative ^ e.negative, r.length = e.length + t.length; for (var n = 0, i = 0, s = 0; s < r.length - 1; s++) {
                var a = i;
                i = 0;
                for (var o = 67108863 & n, f = Math.min(s, t.length - 1), c = Math.max(0, s - e.length + 1); c <= f; c++) {
                    var h = s - c, u = (0 | e.words[h]) * (0 | t.words[c]), d = 67108863 & u;
                    o = 67108863 & (d = d + o | 0), i += (a = (a = a + (u / 67108864 | 0) | 0) + (d >>> 26) | 0) >>> 26, a &= 67108863;
                }
                r.words[s] = o, n = a, a = i;
            } return 0 !== n ? r.words[s] = n : r.length--, r.strip(); }(this, e, t) : p(this, e, t); }, b.prototype.makeRBT = function (e) { for (var t = new Array(e), r = s.prototype._countBits(e) - 1, n = 0; n < e; n++)
                t[n] = this.revBin(n, r, e); return t; }, b.prototype.revBin = function (e, t, r) { if (0 === e || e === r - 1)
                return e; for (var n = 0, i = 0; i < t; i++)
                n |= (1 & e) << t - i - 1, e >>= 1; return n; }, b.prototype.permute = function (e, t, r, n, i, s) { for (var a = 0; a < s; a++)
                n[a] = t[e[a]], i[a] = r[e[a]]; }, b.prototype.transform = function (e, t, r, n, i, s) { this.permute(s, e, t, r, n, i); for (var a = 1; a < i; a <<= 1)
                for (var o = a << 1, f = Math.cos(2 * Math.PI / o), c = Math.sin(2 * Math.PI / o), h = 0; h < i; h += o)
                    for (var u = f, d = c, l = 0; l < a; l++) {
                        var p = r[h + l], b = n[h + l], m = r[h + l + a], g = n[h + l + a], y = u * m - d * g;
                        g = u * g + d * m, m = y, r[h + l] = p + m, n[h + l] = b + g, r[h + l + a] = p - m, n[h + l + a] = b - g, l !== o && (y = f * u - c * d, d = f * d + c * u, u = y);
                    } }, b.prototype.guessLen13b = function (e, t) { var r = 1 | Math.max(t, e), n = 1 & r, i = 0; for (r = r / 2 | 0; r; r >>>= 1)
                i++; return 1 << i + 1 + n; }, b.prototype.conjugate = function (e, t, r) { if (!(r <= 1))
                for (var n = 0; n < r / 2; n++) {
                    var i = e[n];
                    e[n] = e[r - n - 1], e[r - n - 1] = i, i = t[n], t[n] = -t[r - n - 1], t[r - n - 1] = -i;
                } }, b.prototype.normalize13b = function (e, t) { for (var r = 0, n = 0; n < t / 2; n++) {
                var i = 8192 * Math.round(e[2 * n + 1] / t) + Math.round(e[2 * n] / t) + r;
                e[n] = 67108863 & i, r = i < 67108864 ? 0 : i / 67108864 | 0;
            } return e; }, b.prototype.convert13b = function (e, t, r, i) { for (var s = 0, a = 0; a < t; a++)
                s += 0 | e[a], r[2 * a] = 8191 & s, s >>>= 13, r[2 * a + 1] = 8191 & s, s >>>= 13; for (a = 2 * t; a < i; ++a)
                r[a] = 0; n(0 === s), n(0 == (-8192 & s)); }, b.prototype.stub = function (e) { for (var t = new Array(e), r = 0; r < e; r++)
                t[r] = 0; return t; }, b.prototype.mulp = function (e, t, r) { var n = 2 * this.guessLen13b(e.length, t.length), i = this.makeRBT(n), s = this.stub(n), a = new Array(n), o = new Array(n), f = new Array(n), c = new Array(n), h = new Array(n), u = new Array(n), d = r.words; d.length = n, this.convert13b(e.words, e.length, a, n), this.convert13b(t.words, t.length, c, n), this.transform(a, s, o, f, n, i), this.transform(c, s, h, u, n, i); for (var l = 0; l < n; l++) {
                var p = o[l] * h[l] - f[l] * u[l];
                f[l] = o[l] * u[l] + f[l] * h[l], o[l] = p;
            } return this.conjugate(o, f, n), this.transform(o, f, d, s, n, i), this.conjugate(d, s, n), this.normalize13b(d, n), r.negative = e.negative ^ t.negative, r.length = e.length + t.length, r.strip(); }, s.prototype.mul = function (e) { var t = new s(null); return t.words = new Array(this.length + e.length), this.mulTo(e, t); }, s.prototype.mulf = function (e) { var t = new s(null); return t.words = new Array(this.length + e.length), p(this, e, t); }, s.prototype.imul = function (e) { return this.clone().mulTo(e, this); }, s.prototype.imuln = function (e) { n("number" == typeof e), n(e < 67108864); for (var t = 0, r = 0; r < this.length; r++) {
                var i = (0 | this.words[r]) * e, s = (67108863 & i) + (67108863 & t);
                t >>= 26, t += i / 67108864 | 0, t += s >>> 26, this.words[r] = 67108863 & s;
            } return 0 !== t && (this.words[r] = t, this.length++), this; }, s.prototype.muln = function (e) { return this.clone().imuln(e); }, s.prototype.sqr = function () { return this.mul(this); }, s.prototype.isqr = function () { return this.imul(this.clone()); }, s.prototype.pow = function (e) { var t = function (e) { for (var t = new Array(e.bitLength()), r = 0; r < t.length; r++) {
                var n = r / 26 | 0, i = r % 26;
                t[r] = (e.words[n] & 1 << i) >>> i;
            } return t; }(e); if (0 === t.length)
                return new s(1); for (var r = this, n = 0; n < t.length && 0 === t[n]; n++, r = r.sqr())
                ; if (++n < t.length)
                for (var i = r.sqr(); n < t.length; n++, i = i.sqr())
                    0 !== t[n] && (r = r.mul(i)); return r; }, s.prototype.iushln = function (e) { n("number" == typeof e && e >= 0); var t, r = e % 26, i = (e - r) / 26, s = 67108863 >>> 26 - r << 26 - r; if (0 !== r) {
                var a = 0;
                for (t = 0; t < this.length; t++) {
                    var o = this.words[t] & s, f = (0 | this.words[t]) - o << r;
                    this.words[t] = f | a, a = o >>> 26 - r;
                }
                a && (this.words[t] = a, this.length++);
            } if (0 !== i) {
                for (t = this.length - 1; t >= 0; t--)
                    this.words[t + i] = this.words[t];
                for (t = 0; t < i; t++)
                    this.words[t] = 0;
                this.length += i;
            } return this.strip(); }, s.prototype.ishln = function (e) { return n(0 === this.negative), this.iushln(e); }, s.prototype.iushrn = function (e, t, r) { var i; n("number" == typeof e && e >= 0), i = t ? (t - t % 26) / 26 : 0; var s = e % 26, a = Math.min((e - s) / 26, this.length), o = 67108863 ^ 67108863 >>> s << s, f = r; if (i -= a, i = Math.max(0, i), f) {
                for (var c = 0; c < a; c++)
                    f.words[c] = this.words[c];
                f.length = a;
            } if (0 === a)
                ;
            else if (this.length > a)
                for (this.length -= a, c = 0; c < this.length; c++)
                    this.words[c] = this.words[c + a];
            else
                this.words[0] = 0, this.length = 1; var h = 0; for (c = this.length - 1; c >= 0 && (0 !== h || c >= i); c--) {
                var u = 0 | this.words[c];
                this.words[c] = h << 26 - s | u >>> s, h = u & o;
            } return f && 0 !== h && (f.words[f.length++] = h), 0 === this.length && (this.words[0] = 0, this.length = 1), this.strip(); }, s.prototype.ishrn = function (e, t, r) { return n(0 === this.negative), this.iushrn(e, t, r); }, s.prototype.shln = function (e) { return this.clone().ishln(e); }, s.prototype.ushln = function (e) { return this.clone().iushln(e); }, s.prototype.shrn = function (e) { return this.clone().ishrn(e); }, s.prototype.ushrn = function (e) { return this.clone().iushrn(e); }, s.prototype.testn = function (e) { n("number" == typeof e && e >= 0); var t = e % 26, r = (e - t) / 26, i = 1 << t; return !(this.length <= r) && !!(this.words[r] & i); }, s.prototype.imaskn = function (e) { n("number" == typeof e && e >= 0); var t = e % 26, r = (e - t) / 26; if (n(0 === this.negative, "imaskn works only with positive numbers"), this.length <= r)
                return this; if (0 !== t && r++, this.length = Math.min(r, this.length), 0 !== t) {
                var i = 67108863 ^ 67108863 >>> t << t;
                this.words[this.length - 1] &= i;
            } return this.strip(); }, s.prototype.maskn = function (e) { return this.clone().imaskn(e); }, s.prototype.iaddn = function (e) { return n("number" == typeof e), n(e < 67108864), e < 0 ? this.isubn(-e) : 0 !== this.negative ? 1 === this.length && (0 | this.words[0]) < e ? (this.words[0] = e - (0 | this.words[0]), this.negative = 0, this) : (this.negative = 0, this.isubn(e), this.negative = 1, this) : this._iaddn(e); }, s.prototype._iaddn = function (e) { this.words[0] += e; for (var t = 0; t < this.length && this.words[t] >= 67108864; t++)
                this.words[t] -= 67108864, t === this.length - 1 ? this.words[t + 1] = 1 : this.words[t + 1]++; return this.length = Math.max(this.length, t + 1), this; }, s.prototype.isubn = function (e) { if (n("number" == typeof e), n(e < 67108864), e < 0)
                return this.iaddn(-e); if (0 !== this.negative)
                return this.negative = 0, this.iaddn(e), this.negative = 1, this; if (this.words[0] -= e, 1 === this.length && this.words[0] < 0)
                this.words[0] = -this.words[0], this.negative = 1;
            else
                for (var t = 0; t < this.length && this.words[t] < 0; t++)
                    this.words[t] += 67108864, this.words[t + 1] -= 1; return this.strip(); }, s.prototype.addn = function (e) { return this.clone().iaddn(e); }, s.prototype.subn = function (e) { return this.clone().isubn(e); }, s.prototype.iabs = function () { return this.negative = 0, this; }, s.prototype.abs = function () { return this.clone().iabs(); }, s.prototype._ishlnsubmul = function (e, t, r) { var i, s, a = e.length + r; this._expand(a); var o = 0; for (i = 0; i < e.length; i++) {
                s = (0 | this.words[i + r]) + o;
                var f = (0 | e.words[i]) * t;
                o = ((s -= 67108863 & f) >> 26) - (f / 67108864 | 0), this.words[i + r] = 67108863 & s;
            } for (; i < this.length - r; i++)
                o = (s = (0 | this.words[i + r]) + o) >> 26, this.words[i + r] = 67108863 & s; if (0 === o)
                return this.strip(); for (n(-1 === o), o = 0, i = 0; i < this.length; i++)
                o = (s = -(0 | this.words[i]) + o) >> 26, this.words[i] = 67108863 & s; return this.negative = 1, this.strip(); }, s.prototype._wordDiv = function (e, t) { var r = (this.length, e.length), n = this.clone(), i = e, a = 0 | i.words[i.length - 1]; 0 !== (r = 26 - this._countBits(a)) && (i = i.ushln(r), n.iushln(r), a = 0 | i.words[i.length - 1]); var o, f = n.length - i.length; if ("mod" !== t) {
                (o = new s(null)).length = f + 1, o.words = new Array(o.length);
                for (var c = 0; c < o.length; c++)
                    o.words[c] = 0;
            } var h = n.clone()._ishlnsubmul(i, 1, f); 0 === h.negative && (n = h, o && (o.words[f] = 1)); for (var u = f - 1; u >= 0; u--) {
                var d = 67108864 * (0 | n.words[i.length + u]) + (0 | n.words[i.length + u - 1]);
                for (d = Math.min(d / a | 0, 67108863), n._ishlnsubmul(i, d, u); 0 !== n.negative;)
                    d--, n.negative = 0, n._ishlnsubmul(i, 1, u), n.isZero() || (n.negative ^= 1);
                o && (o.words[u] = d);
            } return o && o.strip(), n.strip(), "div" !== t && 0 !== r && n.iushrn(r), { div: o || null, mod: n }; }, s.prototype.divmod = function (e, t, r) { return n(!e.isZero()), this.isZero() ? { div: new s(0), mod: new s(0) } : 0 !== this.negative && 0 === e.negative ? (o = this.neg().divmod(e, t), "mod" !== t && (i = o.div.neg()), "div" !== t && (a = o.mod.neg(), r && 0 !== a.negative && a.iadd(e)), { div: i, mod: a }) : 0 === this.negative && 0 !== e.negative ? (o = this.divmod(e.neg(), t), "mod" !== t && (i = o.div.neg()), { div: i, mod: o.mod }) : 0 != (this.negative & e.negative) ? (o = this.neg().divmod(e.neg(), t), "div" !== t && (a = o.mod.neg(), r && 0 !== a.negative && a.isub(e)), { div: o.div, mod: a }) : e.length > this.length || this.cmp(e) < 0 ? { div: new s(0), mod: this } : 1 === e.length ? "div" === t ? { div: this.divn(e.words[0]), mod: null } : "mod" === t ? { div: null, mod: new s(this.modn(e.words[0])) } : { div: this.divn(e.words[0]), mod: new s(this.modn(e.words[0])) } : this._wordDiv(e, t); var i, a, o; }, s.prototype.div = function (e) { return this.divmod(e, "div", !1).div; }, s.prototype.mod = function (e) { return this.divmod(e, "mod", !1).mod; }, s.prototype.umod = function (e) { return this.divmod(e, "mod", !0).mod; }, s.prototype.divRound = function (e) { var t = this.divmod(e); if (t.mod.isZero())
                return t.div; var r = 0 !== t.div.negative ? t.mod.isub(e) : t.mod, n = e.ushrn(1), i = e.andln(1), s = r.cmp(n); return s < 0 || 1 === i && 0 === s ? t.div : 0 !== t.div.negative ? t.div.isubn(1) : t.div.iaddn(1); }, s.prototype.modn = function (e) { n(e <= 67108863); for (var t = (1 << 26) % e, r = 0, i = this.length - 1; i >= 0; i--)
                r = (t * r + (0 | this.words[i])) % e; return r; }, s.prototype.idivn = function (e) { n(e <= 67108863); for (var t = 0, r = this.length - 1; r >= 0; r--) {
                var i = (0 | this.words[r]) + 67108864 * t;
                this.words[r] = i / e | 0, t = i % e;
            } return this.strip(); }, s.prototype.divn = function (e) { return this.clone().idivn(e); }, s.prototype.egcd = function (e) { n(0 === e.negative), n(!e.isZero()); var t = this, r = e.clone(); t = 0 !== t.negative ? t.umod(e) : t.clone(); for (var i = new s(1), a = new s(0), o = new s(0), f = new s(1), c = 0; t.isEven() && r.isEven();)
                t.iushrn(1), r.iushrn(1), ++c; for (var h = r.clone(), u = t.clone(); !t.isZero();) {
                for (var d = 0, l = 1; 0 == (t.words[0] & l) && d < 26; ++d, l <<= 1)
                    ;
                if (d > 0)
                    for (t.iushrn(d); d-- > 0;)
                        (i.isOdd() || a.isOdd()) && (i.iadd(h), a.isub(u)), i.iushrn(1), a.iushrn(1);
                for (var p = 0, b = 1; 0 == (r.words[0] & b) && p < 26; ++p, b <<= 1)
                    ;
                if (p > 0)
                    for (r.iushrn(p); p-- > 0;)
                        (o.isOdd() || f.isOdd()) && (o.iadd(h), f.isub(u)), o.iushrn(1), f.iushrn(1);
                t.cmp(r) >= 0 ? (t.isub(r), i.isub(o), a.isub(f)) : (r.isub(t), o.isub(i), f.isub(a));
            } return { a: o, b: f, gcd: r.iushln(c) }; }, s.prototype._invmp = function (e) { n(0 === e.negative), n(!e.isZero()); var t = this, r = e.clone(); t = 0 !== t.negative ? t.umod(e) : t.clone(); for (var i, a = new s(1), o = new s(0), f = r.clone(); t.cmpn(1) > 0 && r.cmpn(1) > 0;) {
                for (var c = 0, h = 1; 0 == (t.words[0] & h) && c < 26; ++c, h <<= 1)
                    ;
                if (c > 0)
                    for (t.iushrn(c); c-- > 0;)
                        a.isOdd() && a.iadd(f), a.iushrn(1);
                for (var u = 0, d = 1; 0 == (r.words[0] & d) && u < 26; ++u, d <<= 1)
                    ;
                if (u > 0)
                    for (r.iushrn(u); u-- > 0;)
                        o.isOdd() && o.iadd(f), o.iushrn(1);
                t.cmp(r) >= 0 ? (t.isub(r), a.isub(o)) : (r.isub(t), o.isub(a));
            } return (i = 0 === t.cmpn(1) ? a : o).cmpn(0) < 0 && i.iadd(e), i; }, s.prototype.gcd = function (e) { if (this.isZero())
                return e.abs(); if (e.isZero())
                return this.abs(); var t = this.clone(), r = e.clone(); t.negative = 0, r.negative = 0; for (var n = 0; t.isEven() && r.isEven(); n++)
                t.iushrn(1), r.iushrn(1); for (;;) {
                for (; t.isEven();)
                    t.iushrn(1);
                for (; r.isEven();)
                    r.iushrn(1);
                var i = t.cmp(r);
                if (i < 0) {
                    var s = t;
                    t = r, r = s;
                }
                else if (0 === i || 0 === r.cmpn(1))
                    break;
                t.isub(r);
            } return r.iushln(n); }, s.prototype.invm = function (e) { return this.egcd(e).a.umod(e); }, s.prototype.isEven = function () { return 0 == (1 & this.words[0]); }, s.prototype.isOdd = function () { return 1 == (1 & this.words[0]); }, s.prototype.andln = function (e) { return this.words[0] & e; }, s.prototype.bincn = function (e) { n("number" == typeof e); var t = e % 26, r = (e - t) / 26, i = 1 << t; if (this.length <= r)
                return this._expand(r + 1), this.words[r] |= i, this; for (var s = i, a = r; 0 !== s && a < this.length; a++) {
                var o = 0 | this.words[a];
                s = (o += s) >>> 26, o &= 67108863, this.words[a] = o;
            } return 0 !== s && (this.words[a] = s, this.length++), this; }, s.prototype.isZero = function () { return 1 === this.length && 0 === this.words[0]; }, s.prototype.cmpn = function (e) { var t, r = e < 0; if (0 !== this.negative && !r)
                return -1; if (0 === this.negative && r)
                return 1; if (this.strip(), this.length > 1)
                t = 1;
            else {
                r && (e = -e), n(e <= 67108863, "Number is too big");
                var i = 0 | this.words[0];
                t = i === e ? 0 : i < e ? -1 : 1;
            } return 0 !== this.negative ? 0 | -t : t; }, s.prototype.cmp = function (e) { if (0 !== this.negative && 0 === e.negative)
                return -1; if (0 === this.negative && 0 !== e.negative)
                return 1; var t = this.ucmp(e); return 0 !== this.negative ? 0 | -t : t; }, s.prototype.ucmp = function (e) { if (this.length > e.length)
                return 1; if (this.length < e.length)
                return -1; for (var t = 0, r = this.length - 1; r >= 0; r--) {
                var n = 0 | this.words[r], i = 0 | e.words[r];
                if (n !== i) {
                    n < i ? t = -1 : n > i && (t = 1);
                    break;
                }
            } return t; }, s.prototype.gtn = function (e) { return 1 === this.cmpn(e); }, s.prototype.gt = function (e) { return 1 === this.cmp(e); }, s.prototype.gten = function (e) { return this.cmpn(e) >= 0; }, s.prototype.gte = function (e) { return this.cmp(e) >= 0; }, s.prototype.ltn = function (e) { return -1 === this.cmpn(e); }, s.prototype.lt = function (e) { return -1 === this.cmp(e); }, s.prototype.lten = function (e) { return this.cmpn(e) <= 0; }, s.prototype.lte = function (e) { return this.cmp(e) <= 0; }, s.prototype.eqn = function (e) { return 0 === this.cmpn(e); }, s.prototype.eq = function (e) { return 0 === this.cmp(e); }, s.red = function (e) { return new E(e); }, s.prototype.toRed = function (e) { return n(!this.red, "Already a number in reduction context"), n(0 === this.negative, "red works only with positives"), e.convertTo(this)._forceRed(e); }, s.prototype.fromRed = function () { return n(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this); }, s.prototype._forceRed = function (e) { return this.red = e, this; }, s.prototype.forceRed = function (e) { return n(!this.red, "Already a number in reduction context"), this._forceRed(e); }, s.prototype.redAdd = function (e) { return n(this.red, "redAdd works only with red numbers"), this.red.add(this, e); }, s.prototype.redIAdd = function (e) { return n(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, e); }, s.prototype.redSub = function (e) { return n(this.red, "redSub works only with red numbers"), this.red.sub(this, e); }, s.prototype.redISub = function (e) { return n(this.red, "redISub works only with red numbers"), this.red.isub(this, e); }, s.prototype.redShl = function (e) { return n(this.red, "redShl works only with red numbers"), this.red.shl(this, e); }, s.prototype.redMul = function (e) { return n(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), this.red.mul(this, e); }, s.prototype.redIMul = function (e) { return n(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), this.red.imul(this, e); }, s.prototype.redSqr = function () { return n(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this); }, s.prototype.redISqr = function () { return n(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this); }, s.prototype.redSqrt = function () { return n(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this); }, s.prototype.redInvm = function () { return n(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this); }, s.prototype.redNeg = function () { return n(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this); }, s.prototype.redPow = function (e) { return n(this.red && !e.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, e); };
            var m = { k256: null, p224: null, p192: null, p25519: null };
            function g(e, t) { this.name = e, this.p = new s(t, 16), this.n = this.p.bitLength(), this.k = new s(1).iushln(this.n).isub(this.p), this.tmp = this._tmp(); }
            function y() { g.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"); }
            function v() { g.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"); }
            function _() { g.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"); }
            function w() { g.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"); }
            function E(e) { if ("string" == typeof e) {
                var t = s._prime(e);
                this.m = t.p, this.prime = t;
            }
            else
                n(e.gtn(1), "modulus must be greater than 1"), this.m = e, this.prime = null; }
            function k(e) { E.call(this, e), this.shift = this.m.bitLength(), this.shift % 26 != 0 && (this.shift += 26 - this.shift % 26), this.r = new s(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv); }
            g.prototype._tmp = function () { var e = new s(null); return e.words = new Array(Math.ceil(this.n / 13)), e; }, g.prototype.ireduce = function (e) { var t, r = e; do {
                this.split(r, this.tmp), t = (r = (r = this.imulK(r)).iadd(this.tmp)).bitLength();
            } while (t > this.n); var n = t < this.n ? -1 : r.ucmp(this.p); return 0 === n ? (r.words[0] = 0, r.length = 1) : n > 0 ? r.isub(this.p) : r.strip(), r; }, g.prototype.split = function (e, t) { e.iushrn(this.n, 0, t); }, g.prototype.imulK = function (e) { return e.imul(this.k); }, i(y, g), y.prototype.split = function (e, t) { for (var r = Math.min(e.length, 9), n = 0; n < r; n++)
                t.words[n] = e.words[n]; if (t.length = r, e.length <= 9)
                return e.words[0] = 0, void (e.length = 1); var i = e.words[9]; for (t.words[t.length++] = 4194303 & i, n = 10; n < e.length; n++) {
                var s = 0 | e.words[n];
                e.words[n - 10] = (4194303 & s) << 4 | i >>> 22, i = s;
            } i >>>= 22, e.words[n - 10] = i, 0 === i && e.length > 10 ? e.length -= 10 : e.length -= 9; }, y.prototype.imulK = function (e) { e.words[e.length] = 0, e.words[e.length + 1] = 0, e.length += 2; for (var t = 0, r = 0; r < e.length; r++) {
                var n = 0 | e.words[r];
                t += 977 * n, e.words[r] = 67108863 & t, t = 64 * n + (t / 67108864 | 0);
            } return 0 === e.words[e.length - 1] && (e.length--, 0 === e.words[e.length - 1] && e.length--), e; }, i(v, g), i(_, g), i(w, g), w.prototype.imulK = function (e) { for (var t = 0, r = 0; r < e.length; r++) {
                var n = 19 * (0 | e.words[r]) + t, i = 67108863 & n;
                n >>>= 26, e.words[r] = i, t = n;
            } return 0 !== t && (e.words[e.length++] = t), e; }, s._prime = function (e) { if (m[e])
                return m[e]; var t; if ("k256" === e)
                t = new y;
            else if ("p224" === e)
                t = new v;
            else if ("p192" === e)
                t = new _;
            else {
                if ("p25519" !== e)
                    throw new Error("Unknown prime " + e);
                t = new w;
            } return m[e] = t, t; }, E.prototype._verify1 = function (e) { n(0 === e.negative, "red works only with positives"), n(e.red, "red works only with red numbers"); }, E.prototype._verify2 = function (e, t) { n(0 == (e.negative | t.negative), "red works only with positives"), n(e.red && e.red === t.red, "red works only with red numbers"); }, E.prototype.imod = function (e) { return this.prime ? this.prime.ireduce(e)._forceRed(this) : e.umod(this.m)._forceRed(this); }, E.prototype.neg = function (e) { return e.isZero() ? e.clone() : this.m.sub(e)._forceRed(this); }, E.prototype.add = function (e, t) { this._verify2(e, t); var r = e.add(t); return r.cmp(this.m) >= 0 && r.isub(this.m), r._forceRed(this); }, E.prototype.iadd = function (e, t) { this._verify2(e, t); var r = e.iadd(t); return r.cmp(this.m) >= 0 && r.isub(this.m), r; }, E.prototype.sub = function (e, t) { this._verify2(e, t); var r = e.sub(t); return r.cmpn(0) < 0 && r.iadd(this.m), r._forceRed(this); }, E.prototype.isub = function (e, t) { this._verify2(e, t); var r = e.isub(t); return r.cmpn(0) < 0 && r.iadd(this.m), r; }, E.prototype.shl = function (e, t) { return this._verify1(e), this.imod(e.ushln(t)); }, E.prototype.imul = function (e, t) { return this._verify2(e, t), this.imod(e.imul(t)); }, E.prototype.mul = function (e, t) { return this._verify2(e, t), this.imod(e.mul(t)); }, E.prototype.isqr = function (e) { return this.imul(e, e.clone()); }, E.prototype.sqr = function (e) { return this.mul(e, e); }, E.prototype.sqrt = function (e) { if (e.isZero())
                return e.clone(); var t = this.m.andln(3); if (n(t % 2 == 1), 3 === t) {
                var r = this.m.add(new s(1)).iushrn(2);
                return this.pow(e, r);
            } for (var i = this.m.subn(1), a = 0; !i.isZero() && 0 === i.andln(1);)
                a++, i.iushrn(1); n(!i.isZero()); var o = new s(1).toRed(this), f = o.redNeg(), c = this.m.subn(1).iushrn(1), h = this.m.bitLength(); for (h = new s(2 * h * h).toRed(this); 0 !== this.pow(h, c).cmp(f);)
                h.redIAdd(f); for (var u = this.pow(h, i), d = this.pow(e, i.addn(1).iushrn(1)), l = this.pow(e, i), p = a; 0 !== l.cmp(o);) {
                for (var b = l, m = 0; 0 !== b.cmp(o); m++)
                    b = b.redSqr();
                n(m < p);
                var g = this.pow(u, new s(1).iushln(p - m - 1));
                d = d.redMul(g), u = g.redSqr(), l = l.redMul(u), p = m;
            } return d; }, E.prototype.invm = function (e) { var t = e._invmp(this.m); return 0 !== t.negative ? (t.negative = 0, this.imod(t).redNeg()) : this.imod(t); }, E.prototype.pow = function (e, t) { if (t.isZero())
                return new s(1).toRed(this); if (0 === t.cmpn(1))
                return e.clone(); var r = new Array(16); r[0] = new s(1).toRed(this), r[1] = e; for (var n = 2; n < r.length; n++)
                r[n] = this.mul(r[n - 1], e); var i = r[0], a = 0, o = 0, f = t.bitLength() % 26; for (0 === f && (f = 26), n = t.length - 1; n >= 0; n--) {
                for (var c = t.words[n], h = f - 1; h >= 0; h--) {
                    var u = c >> h & 1;
                    i !== r[0] && (i = this.sqr(i)), 0 !== u || 0 !== a ? (a <<= 1, a |= u, (4 === ++o || 0 === n && 0 === h) && (i = this.mul(i, r[a]), o = 0, a = 0)) : o = 0;
                }
                f = 26;
            } return i; }, E.prototype.convertTo = function (e) { var t = e.umod(this.m); return t === e ? t.clone() : t; }, E.prototype.convertFrom = function (e) { var t = e.clone(); return t.red = null, t; }, s.mont = function (e) { return new k(e); }, i(k, E), k.prototype.convertTo = function (e) { return this.imod(e.ushln(this.shift)); }, k.prototype.convertFrom = function (e) { var t = this.imod(e.mul(this.rinv)); return t.red = null, t; }, k.prototype.imul = function (e, t) { if (e.isZero() || t.isZero())
                return e.words[0] = 0, e.length = 1, e; var r = e.imul(t), n = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), i = r.isub(n).iushrn(this.shift), s = i; return i.cmp(this.m) >= 0 ? s = i.isub(this.m) : i.cmpn(0) < 0 && (s = i.iadd(this.m)), s._forceRed(this); }, k.prototype.mul = function (e, t) { if (e.isZero() || t.isZero())
                return new s(0)._forceRed(this); var r = e.mul(t), n = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), i = r.isub(n).iushrn(this.shift), a = i; return i.cmp(this.m) >= 0 ? a = i.isub(this.m) : i.cmpn(0) < 0 && (a = i.iadd(this.m)), a._forceRed(this); }, k.prototype.invm = function (e) { return this.imod(e._invmp(this.m).mul(this.r2))._forceRed(this); };
        }(void 0 === t || t, this); }, { buffer: 19 }], 18: [function (e, t, r) { var n; function i(e) { this.rand = e; } if (t.exports = function (e) { return n || (n = new i(null)), n.generate(e); }, t.exports.Rand = i, i.prototype.generate = function (e) { return this._rand(e); }, i.prototype._rand = function (e) { if (this.rand.getBytes)
            return this.rand.getBytes(e); for (var t = new Uint8Array(e), r = 0; r < t.length; r++)
            t[r] = this.rand.getByte(); return t; }, "object" == typeof self)
            self.crypto && self.crypto.getRandomValues ? i.prototype._rand = function (e) { var t = new Uint8Array(e); return self.crypto.getRandomValues(t), t; } : self.msCrypto && self.msCrypto.getRandomValues ? i.prototype._rand = function (e) { var t = new Uint8Array(e); return self.msCrypto.getRandomValues(t), t; } : "object" == typeof window && (i.prototype._rand = function () { throw new Error("Not implemented yet"); });
        else
            try {
                var s = e("crypto");
                if ("function" != typeof s.randomBytes)
                    throw new Error("Not supported");
                i.prototype._rand = function (e) { return s.randomBytes(e); };
            }
            catch (e) { } }, { crypto: 19 }], 19: [function (e, t, r) { }, {}], 20: [function (e, t, r) { var n = e("safe-buffer").Buffer; function i(e) { n.isBuffer(e) || (e = n.from(e)); for (var t = e.length / 4 | 0, r = new Array(t), i = 0; i < t; i++)
            r[i] = e.readUInt32BE(4 * i); return r; } function s(e) { for (; 0 < e.length; e++)
            e[0] = 0; } function a(e, t, r, n, i) { for (var s, a, o, f, c = r[0], h = r[1], u = r[2], d = r[3], l = e[0] ^ t[0], p = e[1] ^ t[1], b = e[2] ^ t[2], m = e[3] ^ t[3], g = 4, y = 1; y < i; y++)
            s = c[l >>> 24] ^ h[p >>> 16 & 255] ^ u[b >>> 8 & 255] ^ d[255 & m] ^ t[g++], a = c[p >>> 24] ^ h[b >>> 16 & 255] ^ u[m >>> 8 & 255] ^ d[255 & l] ^ t[g++], o = c[b >>> 24] ^ h[m >>> 16 & 255] ^ u[l >>> 8 & 255] ^ d[255 & p] ^ t[g++], f = c[m >>> 24] ^ h[l >>> 16 & 255] ^ u[p >>> 8 & 255] ^ d[255 & b] ^ t[g++], l = s, p = a, b = o, m = f; return s = (n[l >>> 24] << 24 | n[p >>> 16 & 255] << 16 | n[b >>> 8 & 255] << 8 | n[255 & m]) ^ t[g++], a = (n[p >>> 24] << 24 | n[b >>> 16 & 255] << 16 | n[m >>> 8 & 255] << 8 | n[255 & l]) ^ t[g++], o = (n[b >>> 24] << 24 | n[m >>> 16 & 255] << 16 | n[l >>> 8 & 255] << 8 | n[255 & p]) ^ t[g++], f = (n[m >>> 24] << 24 | n[l >>> 16 & 255] << 16 | n[p >>> 8 & 255] << 8 | n[255 & b]) ^ t[g++], [s >>>= 0, a >>>= 0, o >>>= 0, f >>>= 0]; } var o = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], f = function () { for (var e = new Array(256), t = 0; t < 256; t++)
            e[t] = t < 128 ? t << 1 : t << 1 ^ 283; for (var r = [], n = [], i = [[], [], [], []], s = [[], [], [], []], a = 0, o = 0, f = 0; f < 256; ++f) {
            var c = o ^ o << 1 ^ o << 2 ^ o << 3 ^ o << 4;
            c = c >>> 8 ^ 255 & c ^ 99, r[a] = c, n[c] = a;
            var h = e[a], u = e[h], d = e[u], l = 257 * e[c] ^ 16843008 * c;
            i[0][a] = l << 24 | l >>> 8, i[1][a] = l << 16 | l >>> 16, i[2][a] = l << 8 | l >>> 24, i[3][a] = l, l = 16843009 * d ^ 65537 * u ^ 257 * h ^ 16843008 * a, s[0][c] = l << 24 | l >>> 8, s[1][c] = l << 16 | l >>> 16, s[2][c] = l << 8 | l >>> 24, s[3][c] = l, 0 === a ? a = o = 1 : (a = h ^ e[e[e[d ^ h]]], o ^= e[e[o]]);
        } return { SBOX: r, INV_SBOX: n, SUB_MIX: i, INV_SUB_MIX: s }; }(); function c(e) { this._key = i(e), this._reset(); } c.blockSize = 16, c.keySize = 32, c.prototype.blockSize = c.blockSize, c.prototype.keySize = c.keySize, c.prototype._reset = function () { for (var e = this._key, t = e.length, r = t + 6, n = 4 * (r + 1), i = [], s = 0; s < t; s++)
            i[s] = e[s]; for (s = t; s < n; s++) {
            var a = i[s - 1];
            s % t == 0 ? (a = a << 8 | a >>> 24, a = f.SBOX[a >>> 24] << 24 | f.SBOX[a >>> 16 & 255] << 16 | f.SBOX[a >>> 8 & 255] << 8 | f.SBOX[255 & a], a ^= o[s / t | 0] << 24) : t > 6 && s % t == 4 && (a = f.SBOX[a >>> 24] << 24 | f.SBOX[a >>> 16 & 255] << 16 | f.SBOX[a >>> 8 & 255] << 8 | f.SBOX[255 & a]), i[s] = i[s - t] ^ a;
        } for (var c = [], h = 0; h < n; h++) {
            var u = n - h, d = i[u - (h % 4 ? 0 : 4)];
            c[h] = h < 4 || u <= 4 ? d : f.INV_SUB_MIX[0][f.SBOX[d >>> 24]] ^ f.INV_SUB_MIX[1][f.SBOX[d >>> 16 & 255]] ^ f.INV_SUB_MIX[2][f.SBOX[d >>> 8 & 255]] ^ f.INV_SUB_MIX[3][f.SBOX[255 & d]];
        } this._nRounds = r, this._keySchedule = i, this._invKeySchedule = c; }, c.prototype.encryptBlockRaw = function (e) { return a(e = i(e), this._keySchedule, f.SUB_MIX, f.SBOX, this._nRounds); }, c.prototype.encryptBlock = function (e) { var t = this.encryptBlockRaw(e), r = n.allocUnsafe(16); return r.writeUInt32BE(t[0], 0), r.writeUInt32BE(t[1], 4), r.writeUInt32BE(t[2], 8), r.writeUInt32BE(t[3], 12), r; }, c.prototype.decryptBlock = function (e) { var t = (e = i(e))[1]; e[1] = e[3], e[3] = t; var r = a(e, this._invKeySchedule, f.INV_SUB_MIX, f.INV_SBOX, this._nRounds), s = n.allocUnsafe(16); return s.writeUInt32BE(r[0], 0), s.writeUInt32BE(r[3], 4), s.writeUInt32BE(r[2], 8), s.writeUInt32BE(r[1], 12), s; }, c.prototype.scrub = function () { s(this._keySchedule), s(this._invKeySchedule), s(this._key); }, t.exports.AES = c; }, { "safe-buffer": 168 }], 21: [function (e, t, r) { var n = e("./aes"), i = e("safe-buffer").Buffer, s = e("cipher-base"), a = e("inherits"), o = e("./ghash"), f = e("buffer-xor"), c = e("./incr32"); function h(e, t, r, a) { s.call(this); var f = i.alloc(4, 0); this._cipher = new n.AES(t); var h = this._cipher.encryptBlock(f); this._ghash = new o(h), r = function (e, t, r) { if (12 === t.length)
            return e._finID = i.concat([t, i.from([0, 0, 0, 1])]), i.concat([t, i.from([0, 0, 0, 2])]); var n = new o(r), s = t.length, a = s % 16; n.update(t), a && (a = 16 - a, n.update(i.alloc(a, 0))), n.update(i.alloc(8, 0)); var f = 8 * s, h = i.alloc(8); h.writeUIntBE(f, 0, 8), n.update(h), e._finID = n.state; var u = i.from(e._finID); return c(u), u; }(this, r, h), this._prev = i.from(r), this._cache = i.allocUnsafe(0), this._secCache = i.allocUnsafe(0), this._decrypt = a, this._alen = 0, this._len = 0, this._mode = e, this._authTag = null, this._called = !1; } a(h, s), h.prototype._update = function (e) { if (!this._called && this._alen) {
            var t = 16 - this._alen % 16;
            t < 16 && (t = i.alloc(t, 0), this._ghash.update(t));
        } this._called = !0; var r = this._mode.encrypt(this, e); return this._decrypt ? this._ghash.update(e) : this._ghash.update(r), this._len += e.length, r; }, h.prototype._final = function () { if (this._decrypt && !this._authTag)
            throw new Error("Unsupported state or unable to authenticate data"); var e = f(this._ghash.final(8 * this._alen, 8 * this._len), this._cipher.encryptBlock(this._finID)); if (this._decrypt && function (e, t) { var r = 0; e.length !== t.length && r++; for (var n = Math.min(e.length, t.length), i = 0; i < n; ++i)
            r += e[i] ^ t[i]; return r; }(e, this._authTag))
            throw new Error("Unsupported state or unable to authenticate data"); this._authTag = e, this._cipher.scrub(); }, h.prototype.getAuthTag = function () { if (this._decrypt || !i.isBuffer(this._authTag))
            throw new Error("Attempting to get auth tag in unsupported state"); return this._authTag; }, h.prototype.setAuthTag = function (e) { if (!this._decrypt)
            throw new Error("Attempting to set auth tag in unsupported state"); this._authTag = e; }, h.prototype.setAAD = function (e) { if (this._called)
            throw new Error("Attempting to set AAD in unsupported state"); this._ghash.update(e), this._alen += e.length; }, t.exports = h; }, { "./aes": 20, "./ghash": 25, "./incr32": 26, "buffer-xor": 50, "cipher-base": 53, inherits: 108, "safe-buffer": 168 }], 22: [function (e, t, r) { var n = e("./encrypter"), i = e("./decrypter"), s = e("./modes/list.json"); r.createCipher = r.Cipher = n.createCipher, r.createCipheriv = r.Cipheriv = n.createCipheriv, r.createDecipher = r.Decipher = i.createDecipher, r.createDecipheriv = r.Decipheriv = i.createDecipheriv, r.listCiphers = r.getCiphers = function () { return Object.keys(s); }; }, { "./decrypter": 23, "./encrypter": 24, "./modes/list.json": 34 }], 23: [function (e, t, r) { var n = e("./authCipher"), i = e("safe-buffer").Buffer, s = e("./modes"), a = e("./streamCipher"), o = e("cipher-base"), f = e("./aes"), c = e("evp_bytestokey"); function h(e, t, r) { o.call(this), this._cache = new u, this._last = void 0, this._cipher = new f.AES(t), this._prev = i.from(r), this._mode = e, this._autopadding = !0; } function u() { this.cache = i.allocUnsafe(0); } function d(e, t, r) { var o = s[e.toLowerCase()]; if (!o)
            throw new TypeError("invalid suite type"); if ("string" == typeof r && (r = i.from(r)), "GCM" !== o.mode && r.length !== o.iv)
            throw new TypeError("invalid iv length " + r.length); if ("string" == typeof t && (t = i.from(t)), t.length !== o.key / 8)
            throw new TypeError("invalid key length " + t.length); return "stream" === o.type ? new a(o.module, t, r, !0) : "auth" === o.type ? new n(o.module, t, r, !0) : new h(o.module, t, r); } e("inherits")(h, o), h.prototype._update = function (e) { var t, r; this._cache.add(e); for (var n = []; t = this._cache.get(this._autopadding);)
            r = this._mode.decrypt(this, t), n.push(r); return i.concat(n); }, h.prototype._final = function () { var e = this._cache.flush(); if (this._autopadding)
            return function (e) { var t = e[15], r = -1; for (; ++r < t;)
                if (e[r + (16 - t)] !== t)
                    throw new Error("unable to decrypt data"); if (16 === t)
                return; return e.slice(0, 16 - t); }(this._mode.decrypt(this, e)); if (e)
            throw new Error("data not multiple of block length"); }, h.prototype.setAutoPadding = function (e) { return this._autopadding = !!e, this; }, u.prototype.add = function (e) { this.cache = i.concat([this.cache, e]); }, u.prototype.get = function (e) { var t; if (e) {
            if (this.cache.length > 16)
                return t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), t;
        }
        else if (this.cache.length >= 16)
            return t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), t; return null; }, u.prototype.flush = function () { if (this.cache.length)
            return this.cache; }, r.createDecipher = function (e, t) { var r = s[e.toLowerCase()]; if (!r)
            throw new TypeError("invalid suite type"); var n = c(t, !1, r.key, r.iv); return d(e, n.key, n.iv); }, r.createDecipheriv = d; }, { "./aes": 20, "./authCipher": 21, "./modes": 33, "./streamCipher": 36, "cipher-base": 53, evp_bytestokey: 90, inherits: 108, "safe-buffer": 168 }], 24: [function (e, t, r) { var n = e("./modes"), i = e("./authCipher"), s = e("safe-buffer").Buffer, a = e("./streamCipher"), o = e("cipher-base"), f = e("./aes"), c = e("evp_bytestokey"); function h(e, t, r) { o.call(this), this._cache = new d, this._cipher = new f.AES(t), this._prev = s.from(r), this._mode = e, this._autopadding = !0; } e("inherits")(h, o), h.prototype._update = function (e) { var t, r; this._cache.add(e); for (var n = []; t = this._cache.get();)
            r = this._mode.encrypt(this, t), n.push(r); return s.concat(n); }; var u = s.alloc(16, 16); function d() { this.cache = s.allocUnsafe(0); } function l(e, t, r) { var o = n[e.toLowerCase()]; if (!o)
            throw new TypeError("invalid suite type"); if ("string" == typeof t && (t = s.from(t)), t.length !== o.key / 8)
            throw new TypeError("invalid key length " + t.length); if ("string" == typeof r && (r = s.from(r)), "GCM" !== o.mode && r.length !== o.iv)
            throw new TypeError("invalid iv length " + r.length); return "stream" === o.type ? new a(o.module, t, r) : "auth" === o.type ? new i(o.module, t, r) : new h(o.module, t, r); } h.prototype._final = function () { var e = this._cache.flush(); if (this._autopadding)
            return e = this._mode.encrypt(this, e), this._cipher.scrub(), e; if (!e.equals(u))
            throw this._cipher.scrub(), new Error("data not multiple of block length"); }, h.prototype.setAutoPadding = function (e) { return this._autopadding = !!e, this; }, d.prototype.add = function (e) { this.cache = s.concat([this.cache, e]); }, d.prototype.get = function () { if (this.cache.length > 15) {
            var e = this.cache.slice(0, 16);
            return this.cache = this.cache.slice(16), e;
        } return null; }, d.prototype.flush = function () { for (var e = 16 - this.cache.length, t = s.allocUnsafe(e), r = -1; ++r < e;)
            t.writeUInt8(e, r); return s.concat([this.cache, t]); }, r.createCipheriv = l, r.createCipher = function (e, t) { var r = n[e.toLowerCase()]; if (!r)
            throw new TypeError("invalid suite type"); var i = c(t, !1, r.key, r.iv); return l(e, i.key, i.iv); }; }, { "./aes": 20, "./authCipher": 21, "./modes": 33, "./streamCipher": 36, "cipher-base": 53, evp_bytestokey: 90, inherits: 108, "safe-buffer": 168 }], 25: [function (e, t, r) { var n = e("safe-buffer").Buffer, i = n.alloc(16, 0); function s(e) { var t = n.allocUnsafe(16); return t.writeUInt32BE(e[0] >>> 0, 0), t.writeUInt32BE(e[1] >>> 0, 4), t.writeUInt32BE(e[2] >>> 0, 8), t.writeUInt32BE(e[3] >>> 0, 12), t; } function a(e) { this.h = e, this.state = n.alloc(16, 0), this.cache = n.allocUnsafe(0); } a.prototype.ghash = function (e) { for (var t = -1; ++t < e.length;)
            this.state[t] ^= e[t]; this._multiply(); }, a.prototype._multiply = function () { for (var e, t, r, n = [(e = this.h).readUInt32BE(0), e.readUInt32BE(4), e.readUInt32BE(8), e.readUInt32BE(12)], i = [0, 0, 0, 0], a = -1; ++a < 128;) {
            for (0 != (this.state[~~(a / 8)] & 1 << 7 - a % 8) && (i[0] ^= n[0], i[1] ^= n[1], i[2] ^= n[2], i[3] ^= n[3]), r = 0 != (1 & n[3]), t = 3; t > 0; t--)
                n[t] = n[t] >>> 1 | (1 & n[t - 1]) << 31;
            n[0] = n[0] >>> 1, r && (n[0] = n[0] ^ 225 << 24);
        } this.state = s(i); }, a.prototype.update = function (e) { var t; for (this.cache = n.concat([this.cache, e]); this.cache.length >= 16;)
            t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), this.ghash(t); }, a.prototype.final = function (e, t) { return this.cache.length && this.ghash(n.concat([this.cache, i], 16)), this.ghash(s([0, e, 0, t])), this.state; }, t.exports = a; }, { "safe-buffer": 168 }], 26: [function (e, t, r) { t.exports = function (e) { for (var t, r = e.length; r--;) {
            if (255 !== (t = e.readUInt8(r))) {
                t++, e.writeUInt8(t, r);
                break;
            }
            e.writeUInt8(0, r);
        } }; }, {}], 27: [function (e, t, r) { var n = e("buffer-xor"); r.encrypt = function (e, t) { var r = n(t, e._prev); return e._prev = e._cipher.encryptBlock(r), e._prev; }, r.decrypt = function (e, t) { var r = e._prev; e._prev = t; var i = e._cipher.decryptBlock(t); return n(i, r); }; }, { "buffer-xor": 50 }], 28: [function (e, t, r) { var n = e("safe-buffer").Buffer, i = e("buffer-xor"); function s(e, t, r) { var s = t.length, a = i(t, e._cache); return e._cache = e._cache.slice(s), e._prev = n.concat([e._prev, r ? t : a]), a; } r.encrypt = function (e, t, r) { for (var i, a = n.allocUnsafe(0); t.length;) {
            if (0 === e._cache.length && (e._cache = e._cipher.encryptBlock(e._prev), e._prev = n.allocUnsafe(0)), !(e._cache.length <= t.length)) {
                a = n.concat([a, s(e, t, r)]);
                break;
            }
            i = e._cache.length, a = n.concat([a, s(e, t.slice(0, i), r)]), t = t.slice(i);
        } return a; }; }, { "buffer-xor": 50, "safe-buffer": 168 }], 29: [function (e, t, r) { var n = e("safe-buffer").Buffer; function i(e, t, r) { for (var n, i, a, o = -1, f = 0; ++o < 8;)
            n = e._cipher.encryptBlock(e._prev), i = t & 1 << 7 - o ? 128 : 0, f += (128 & (a = n[0] ^ i)) >> o % 8, e._prev = s(e._prev, r ? i : a); return f; } function s(e, t) { var r = e.length, i = -1, s = n.allocUnsafe(e.length); for (e = n.concat([e, n.from([t])]); ++i < r;)
            s[i] = e[i] << 1 | e[i + 1] >> 7; return s; } r.encrypt = function (e, t, r) { for (var s = t.length, a = n.allocUnsafe(s), o = -1; ++o < s;)
            a[o] = i(e, t[o], r); return a; }; }, { "safe-buffer": 168 }], 30: [function (e, t, r) { var n = e("safe-buffer").Buffer; function i(e, t, r) { var i = e._cipher.encryptBlock(e._prev)[0] ^ t; return e._prev = n.concat([e._prev.slice(1), n.from([r ? t : i])]), i; } r.encrypt = function (e, t, r) { for (var s = t.length, a = n.allocUnsafe(s), o = -1; ++o < s;)
            a[o] = i(e, t[o], r); return a; }; }, { "safe-buffer": 168 }], 31: [function (e, t, r) { var n = e("buffer-xor"), i = e("safe-buffer").Buffer, s = e("../incr32"); function a(e) { var t = e._cipher.encryptBlockRaw(e._prev); return s(e._prev), t; } r.encrypt = function (e, t) { var r = Math.ceil(t.length / 16), s = e._cache.length; e._cache = i.concat([e._cache, i.allocUnsafe(16 * r)]); for (var o = 0; o < r; o++) {
            var f = a(e), c = s + 16 * o;
            e._cache.writeUInt32BE(f[0], c + 0), e._cache.writeUInt32BE(f[1], c + 4), e._cache.writeUInt32BE(f[2], c + 8), e._cache.writeUInt32BE(f[3], c + 12);
        } var h = e._cache.slice(0, t.length); return e._cache = e._cache.slice(t.length), n(t, h); }; }, { "../incr32": 26, "buffer-xor": 50, "safe-buffer": 168 }], 32: [function (e, t, r) { r.encrypt = function (e, t) { return e._cipher.encryptBlock(t); }, r.decrypt = function (e, t) { return e._cipher.decryptBlock(t); }; }, {}], 33: [function (e, t, r) { var n = { ECB: e("./ecb"), CBC: e("./cbc"), CFB: e("./cfb"), CFB8: e("./cfb8"), CFB1: e("./cfb1"), OFB: e("./ofb"), CTR: e("./ctr"), GCM: e("./ctr") }, i = e("./list.json"); for (var s in i)
            i[s].module = n[i[s].mode]; t.exports = i; }, { "./cbc": 27, "./cfb": 28, "./cfb1": 29, "./cfb8": 30, "./ctr": 31, "./ecb": 32, "./list.json": 34, "./ofb": 35 }], 34: [function (e, t, r) { t.exports = { "aes-128-ecb": { cipher: "AES", key: 128, iv: 0, mode: "ECB", type: "block" }, "aes-192-ecb": { cipher: "AES", key: 192, iv: 0, mode: "ECB", type: "block" }, "aes-256-ecb": { cipher: "AES", key: 256, iv: 0, mode: "ECB", type: "block" }, "aes-128-cbc": { cipher: "AES", key: 128, iv: 16, mode: "CBC", type: "block" }, "aes-192-cbc": { cipher: "AES", key: 192, iv: 16, mode: "CBC", type: "block" }, "aes-256-cbc": { cipher: "AES", key: 256, iv: 16, mode: "CBC", type: "block" }, aes128: { cipher: "AES", key: 128, iv: 16, mode: "CBC", type: "block" }, aes192: { cipher: "AES", key: 192, iv: 16, mode: "CBC", type: "block" }, aes256: { cipher: "AES", key: 256, iv: 16, mode: "CBC", type: "block" }, "aes-128-cfb": { cipher: "AES", key: 128, iv: 16, mode: "CFB", type: "stream" }, "aes-192-cfb": { cipher: "AES", key: 192, iv: 16, mode: "CFB", type: "stream" }, "aes-256-cfb": { cipher: "AES", key: 256, iv: 16, mode: "CFB", type: "stream" }, "aes-128-cfb8": { cipher: "AES", key: 128, iv: 16, mode: "CFB8", type: "stream" }, "aes-192-cfb8": { cipher: "AES", key: 192, iv: 16, mode: "CFB8", type: "stream" }, "aes-256-cfb8": { cipher: "AES", key: 256, iv: 16, mode: "CFB8", type: "stream" }, "aes-128-cfb1": { cipher: "AES", key: 128, iv: 16, mode: "CFB1", type: "stream" }, "aes-192-cfb1": { cipher: "AES", key: 192, iv: 16, mode: "CFB1", type: "stream" }, "aes-256-cfb1": { cipher: "AES", key: 256, iv: 16, mode: "CFB1", type: "stream" }, "aes-128-ofb": { cipher: "AES", key: 128, iv: 16, mode: "OFB", type: "stream" }, "aes-192-ofb": { cipher: "AES", key: 192, iv: 16, mode: "OFB", type: "stream" }, "aes-256-ofb": { cipher: "AES", key: 256, iv: 16, mode: "OFB", type: "stream" }, "aes-128-ctr": { cipher: "AES", key: 128, iv: 16, mode: "CTR", type: "stream" }, "aes-192-ctr": { cipher: "AES", key: 192, iv: 16, mode: "CTR", type: "stream" }, "aes-256-ctr": { cipher: "AES", key: 256, iv: 16, mode: "CTR", type: "stream" }, "aes-128-gcm": { cipher: "AES", key: 128, iv: 12, mode: "GCM", type: "auth" }, "aes-192-gcm": { cipher: "AES", key: 192, iv: 12, mode: "GCM", type: "auth" }, "aes-256-gcm": { cipher: "AES", key: 256, iv: 12, mode: "GCM", type: "auth" } }; }, {}], 35: [function (e, t, r) { (function (t) { var n = e("buffer-xor"); function i(e) { return e._prev = e._cipher.encryptBlock(e._prev), e._prev; } r.encrypt = function (e, r) { for (; e._cache.length < r.length;)
            e._cache = t.concat([e._cache, i(e)]); var s = e._cache.slice(0, r.length); return e._cache = e._cache.slice(r.length), n(r, s); }; }).call(this, e("buffer").Buffer); }, { buffer: 51, "buffer-xor": 50 }], 36: [function (e, t, r) { var n = e("./aes"), i = e("safe-buffer").Buffer, s = e("cipher-base"); function a(e, t, r, a) { s.call(this), this._cipher = new n.AES(t), this._prev = i.from(r), this._cache = i.allocUnsafe(0), this._secCache = i.allocUnsafe(0), this._decrypt = a, this._mode = e; } e("inherits")(a, s), a.prototype._update = function (e) { return this._mode.encrypt(this, e, this._decrypt); }, a.prototype._final = function () { this._cipher.scrub(); }, t.exports = a; }, { "./aes": 20, "cipher-base": 53, inherits: 108, "safe-buffer": 168 }], 37: [function (e, t, r) { var n = e("evp_bytestokey"), i = e("browserify-aes/browser"), s = e("browserify-des"), a = e("browserify-des/modes"), o = e("browserify-aes/modes"); function f(e, t, r) { if (e = e.toLowerCase(), o[e])
            return i.createCipheriv(e, t, r); if (a[e])
            return new s({ key: t, iv: r, mode: e }); throw new TypeError("invalid suite type"); } function c(e, t, r) { if (e = e.toLowerCase(), o[e])
            return i.createDecipheriv(e, t, r); if (a[e])
            return new s({ key: t, iv: r, mode: e, decrypt: !0 }); throw new TypeError("invalid suite type"); } r.createCipher = r.Cipher = function (e, t) { var r, i; if (e = e.toLowerCase(), o[e])
            r = o[e].key, i = o[e].iv;
        else {
            if (!a[e])
                throw new TypeError("invalid suite type");
            r = 8 * a[e].key, i = a[e].iv;
        } var s = n(t, !1, r, i); return f(e, s.key, s.iv); }, r.createCipheriv = r.Cipheriv = f, r.createDecipher = r.Decipher = function (e, t) { var r, i; if (e = e.toLowerCase(), o[e])
            r = o[e].key, i = o[e].iv;
        else {
            if (!a[e])
                throw new TypeError("invalid suite type");
            r = 8 * a[e].key, i = a[e].iv;
        } var s = n(t, !1, r, i); return c(e, s.key, s.iv); }, r.createDecipheriv = r.Decipheriv = c, r.listCiphers = r.getCiphers = function () { return Object.keys(a).concat(i.getCiphers()); }; }, { "browserify-aes/browser": 22, "browserify-aes/modes": 33, "browserify-des": 38, "browserify-des/modes": 39, evp_bytestokey: 90 }], 38: [function (e, t, r) { (function (r) { var n = e("cipher-base"), i = e("des.js"), s = e("inherits"), a = { "des-ede3-cbc": i.CBC.instantiate(i.EDE), "des-ede3": i.EDE, "des-ede-cbc": i.CBC.instantiate(i.EDE), "des-ede": i.EDE, "des-cbc": i.CBC.instantiate(i.DES), "des-ecb": i.DES }; function o(e) { n.call(this); var t, i = e.mode.toLowerCase(), s = a[i]; t = e.decrypt ? "decrypt" : "encrypt"; var o = e.key; "des-ede" !== i && "des-ede-cbc" !== i || (o = r.concat([o, o.slice(0, 8)])); var f = e.iv; this._des = s.create({ key: o, iv: f, type: t }); } a.des = a["des-cbc"], a.des3 = a["des-ede3-cbc"], t.exports = o, s(o, n), o.prototype._update = function (e) { return new r(this._des.update(e)); }, o.prototype._final = function () { return new r(this._des.final()); }; }).call(this, e("buffer").Buffer); }, { buffer: 51, "cipher-base": 53, "des.js": 63, inherits: 108 }], 39: [function (e, t, r) { r["des-ecb"] = { key: 8, iv: 0 }, r["des-cbc"] = r.des = { key: 8, iv: 8 }, r["des-ede3-cbc"] = r.des3 = { key: 24, iv: 8 }, r["des-ede3"] = { key: 24, iv: 0 }, r["des-ede-cbc"] = { key: 16, iv: 8 }, r["des-ede"] = { key: 16, iv: 0 }; }, {}], 40: [function (e, t, r) { (function (r) { var n = e("bn.js"), i = e("randombytes"); function s(e, t) { var i = function (e) { var t = a(e); return { blinder: t.toRed(n.mont(e.modulus)).redPow(new n(e.publicExponent)).fromRed(), unblinder: t.invm(e.modulus) }; }(t), s = t.modulus.byteLength(), o = (n.mont(t.modulus), new n(e).mul(i.blinder).umod(t.modulus)), f = o.toRed(n.mont(t.prime1)), c = o.toRed(n.mont(t.prime2)), h = t.coefficient, u = t.prime1, d = t.prime2, l = f.redPow(t.exponent1), p = c.redPow(t.exponent2); l = l.fromRed(), p = p.fromRed(); var b = l.isub(p).imul(h).umod(u); return b.imul(d), p.iadd(b), new r(p.imul(i.unblinder).umod(t.modulus).toArray(!1, s)); } function a(e) { for (var t = e.modulus.byteLength(), r = new n(i(t)); r.cmp(e.modulus) >= 0 || !r.umod(e.prime1) || !r.umod(e.prime2);)
            r = new n(i(t)); return r; } t.exports = s, s.getr = a; }).call(this, e("buffer").Buffer); }, { "bn.js": 17, buffer: 51, randombytes: 152 }], 41: [function (e, t, r) { t.exports = e("./browser/algorithms.json"); }, { "./browser/algorithms.json": 42 }], 42: [function (e, t, r) { t.exports = { sha224WithRSAEncryption: { sign: "rsa", hash: "sha224", id: "302d300d06096086480165030402040500041c" }, "RSA-SHA224": { sign: "ecdsa/rsa", hash: "sha224", id: "302d300d06096086480165030402040500041c" }, sha256WithRSAEncryption: { sign: "rsa", hash: "sha256", id: "3031300d060960864801650304020105000420" }, "RSA-SHA256": { sign: "ecdsa/rsa", hash: "sha256", id: "3031300d060960864801650304020105000420" }, sha384WithRSAEncryption: { sign: "rsa", hash: "sha384", id: "3041300d060960864801650304020205000430" }, "RSA-SHA384": { sign: "ecdsa/rsa", hash: "sha384", id: "3041300d060960864801650304020205000430" }, sha512WithRSAEncryption: { sign: "rsa", hash: "sha512", id: "3051300d060960864801650304020305000440" }, "RSA-SHA512": { sign: "ecdsa/rsa", hash: "sha512", id: "3051300d060960864801650304020305000440" }, "RSA-SHA1": { sign: "rsa", hash: "sha1", id: "3021300906052b0e03021a05000414" }, "ecdsa-with-SHA1": { sign: "ecdsa", hash: "sha1", id: "" }, sha256: { sign: "ecdsa", hash: "sha256", id: "" }, sha224: { sign: "ecdsa", hash: "sha224", id: "" }, sha384: { sign: "ecdsa", hash: "sha384", id: "" }, sha512: { sign: "ecdsa", hash: "sha512", id: "" }, "DSA-SHA": { sign: "dsa", hash: "sha1", id: "" }, "DSA-SHA1": { sign: "dsa", hash: "sha1", id: "" }, DSA: { sign: "dsa", hash: "sha1", id: "" }, "DSA-WITH-SHA224": { sign: "dsa", hash: "sha224", id: "" }, "DSA-SHA224": { sign: "dsa", hash: "sha224", id: "" }, "DSA-WITH-SHA256": { sign: "dsa", hash: "sha256", id: "" }, "DSA-SHA256": { sign: "dsa", hash: "sha256", id: "" }, "DSA-WITH-SHA384": { sign: "dsa", hash: "sha384", id: "" }, "DSA-SHA384": { sign: "dsa", hash: "sha384", id: "" }, "DSA-WITH-SHA512": { sign: "dsa", hash: "sha512", id: "" }, "DSA-SHA512": { sign: "dsa", hash: "sha512", id: "" }, "DSA-RIPEMD160": { sign: "dsa", hash: "rmd160", id: "" }, ripemd160WithRSA: { sign: "rsa", hash: "rmd160", id: "3021300906052b2403020105000414" }, "RSA-RIPEMD160": { sign: "rsa", hash: "rmd160", id: "3021300906052b2403020105000414" }, md5WithRSAEncryption: { sign: "rsa", hash: "md5", id: "3020300c06082a864886f70d020505000410" }, "RSA-MD5": { sign: "rsa", hash: "md5", id: "3020300c06082a864886f70d020505000410" } }; }, {}], 43: [function (e, t, r) { t.exports = { "1.3.132.0.10": "secp256k1", "1.3.132.0.33": "p224", "1.2.840.10045.3.1.1": "p192", "1.2.840.10045.3.1.7": "p256", "1.3.132.0.34": "p384", "1.3.132.0.35": "p521" }; }, {}], 44: [function (e, t, r) { (function (r) { var n = e("create-hash"), i = e("stream"), s = e("inherits"), a = e("./sign"), o = e("./verify"), f = e("./algorithms.json"); function c(e) { i.Writable.call(this); var t = f[e]; if (!t)
            throw new Error("Unknown message digest"); this._hashType = t.hash, this._hash = n(t.hash), this._tag = t.id, this._signType = t.sign; } function h(e) { i.Writable.call(this); var t = f[e]; if (!t)
            throw new Error("Unknown message digest"); this._hash = n(t.hash), this._tag = t.id, this._signType = t.sign; } function u(e) { return new c(e); } function d(e) { return new h(e); } Object.keys(f).forEach(function (e) { f[e].id = new r(f[e].id, "hex"), f[e.toLowerCase()] = f[e]; }), s(c, i.Writable), c.prototype._write = function (e, t, r) { this._hash.update(e), r(); }, c.prototype.update = function (e, t) { return "string" == typeof e && (e = new r(e, t)), this._hash.update(e), this; }, c.prototype.sign = function (e, t) { this.end(); var r = this._hash.digest(), n = a(r, e, this._hashType, this._signType, this._tag); return t ? n.toString(t) : n; }, s(h, i.Writable), h.prototype._write = function (e, t, r) { this._hash.update(e), r(); }, h.prototype.update = function (e, t) { return "string" == typeof e && (e = new r(e, t)), this._hash.update(e), this; }, h.prototype.verify = function (e, t, n) { "string" == typeof t && (t = new r(t, n)), this.end(); var i = this._hash.digest(); return o(t, i, e, this._signType, this._tag); }, t.exports = { Sign: u, Verify: d, createSign: u, createVerify: d }; }).call(this, e("buffer").Buffer); }, { "./algorithms.json": 42, "./sign": 45, "./verify": 46, buffer: 51, "create-hash": 56, inherits: 108, stream: 178 }], 45: [function (e, t, r) { (function (r) { var n = e("create-hmac"), i = e("browserify-rsa"), s = e("elliptic").ec, a = e("bn.js"), o = e("parse-asn1"), f = e("./curves.json"); function c(e, t, i, s) { if ((e = new r(e.toArray())).length < t.byteLength()) {
            var a = new r(t.byteLength() - e.length);
            a.fill(0), e = r.concat([a, e]);
        } var o = i.length, f = function (e, t) { e = (e = h(e, t)).mod(t); var n = new r(e.toArray()); if (n.length < t.byteLength()) {
            var i = new r(t.byteLength() - n.length);
            i.fill(0), n = r.concat([i, n]);
        } return n; }(i, t), c = new r(o); c.fill(1); var u = new r(o); return u.fill(0), u = n(s, u).update(c).update(new r([0])).update(e).update(f).digest(), c = n(s, u).update(c).digest(), { k: u = n(s, u).update(c).update(new r([1])).update(e).update(f).digest(), v: c = n(s, u).update(c).digest() }; } function h(e, t) { var r = new a(e), n = (e.length << 3) - t.bitLength(); return n > 0 && r.ishrn(n), r; } function u(e, t, i) { var s, a; do {
            for (s = new r(0); 8 * s.length < e.bitLength();)
                t.v = n(i, t.k).update(t.v).digest(), s = r.concat([s, t.v]);
            a = h(s, e), t.k = n(i, t.k).update(t.v).update(new r([0])).digest(), t.v = n(i, t.k).update(t.v).digest();
        } while (-1 !== a.cmp(e)); return a; } function d(e, t, r, n) { return e.toRed(a.mont(r)).redPow(t).fromRed().mod(n); } t.exports = function (e, t, n, l, p) { var b = o(t); if (b.curve) {
            if ("ecdsa" !== l && "ecdsa/rsa" !== l)
                throw new Error("wrong private key type");
            return function (e, t) { var n = f[t.curve.join(".")]; if (!n)
                throw new Error("unknown curve " + t.curve.join(".")); var i = new s(n).keyFromPrivate(t.privateKey).sign(e); return new r(i.toDER()); }(e, b);
        } if ("dsa" === b.type) {
            if ("dsa" !== l)
                throw new Error("wrong private key type");
            return function (e, t, n) { for (var i, s = t.params.priv_key, o = t.params.p, f = t.params.q, l = t.params.g, p = new a(0), b = h(e, f).mod(f), m = !1, g = c(s, f, e, n); !1 === m;)
                i = u(f, g, n), p = d(l, i, o, f), 0 === (m = i.invm(f).imul(b.add(s.mul(p))).mod(f)).cmpn(0) && (m = !1, p = new a(0)); return function (e, t) { e = e.toArray(), t = t.toArray(), 128 & e[0] && (e = [0].concat(e)), 128 & t[0] && (t = [0].concat(t)); var n = [48, e.length + t.length + 4, 2, e.length]; return n = n.concat(e, [2, t.length], t), new r(n); }(p, m); }(e, b, n);
        } if ("rsa" !== l && "ecdsa/rsa" !== l)
            throw new Error("wrong private key type"); e = r.concat([p, e]); for (var m = b.modulus.byteLength(), g = [0, 1]; e.length + g.length + 1 < m;)
            g.push(255); g.push(0); for (var y = -1; ++y < e.length;)
            g.push(e[y]); return i(g, b); }, t.exports.getKey = c, t.exports.makeKey = u; }).call(this, e("buffer").Buffer); }, { "./curves.json": 43, "bn.js": 17, "browserify-rsa": 40, buffer: 51, "create-hmac": 59, elliptic: 73, "parse-asn1": 133 }], 46: [function (e, t, r) { (function (r) { var n = e("bn.js"), i = e("elliptic").ec, s = e("parse-asn1"), a = e("./curves.json"); function o(e, t) { if (e.cmpn(0) <= 0)
            throw new Error("invalid sig"); if (e.cmp(t) >= t)
            throw new Error("invalid sig"); } t.exports = function (e, t, f, c, h) { var u = s(f); if ("ec" === u.type) {
            if ("ecdsa" !== c && "ecdsa/rsa" !== c)
                throw new Error("wrong public key type");
            return function (e, t, r) { var n = a[r.data.algorithm.curve.join(".")]; if (!n)
                throw new Error("unknown curve " + r.data.algorithm.curve.join(".")); var s = new i(n), o = r.data.subjectPrivateKey.data; return s.verify(t, e, o); }(e, t, u);
        } if ("dsa" === u.type) {
            if ("dsa" !== c)
                throw new Error("wrong public key type");
            return function (e, t, r) { var i = r.data.p, a = r.data.q, f = r.data.g, c = r.data.pub_key, h = s.signature.decode(e, "der"), u = h.s, d = h.r; o(u, a), o(d, a); var l = n.mont(i), p = u.invm(a); return 0 === f.toRed(l).redPow(new n(t).mul(p).mod(a)).fromRed().mul(c.toRed(l).redPow(d.mul(p).mod(a)).fromRed()).mod(i).mod(a).cmp(d); }(e, t, u);
        } if ("rsa" !== c && "ecdsa/rsa" !== c)
            throw new Error("wrong public key type"); t = r.concat([h, t]); for (var d = u.modulus.byteLength(), l = [1], p = 0; t.length + l.length + 2 < d;)
            l.push(255), p++; l.push(0); for (var b = -1; ++b < t.length;)
            l.push(t[b]); l = new r(l); var m = n.mont(u.modulus); e = (e = new n(e).toRed(m)).redPow(new n(u.publicExponent)), e = new r(e.fromRed().toArray()); var g = p < 8 ? 1 : 0; for (d = Math.min(e.length, l.length), e.length !== l.length && (g = 1), b = -1; ++b < d;)
            g |= e[b] ^ l[b]; return 0 === g; }; }).call(this, e("buffer").Buffer); }, { "./curves.json": 43, "bn.js": 17, buffer: 51, elliptic: 73, "parse-asn1": 133 }], 47: [function (e, t, r) { (function (t, n) {
            "use strict";
            var i = e("assert"), s = e("pako/lib/zlib/zstream"), a = e("pako/lib/zlib/deflate.js"), o = e("pako/lib/zlib/inflate.js"), f = e("pako/lib/zlib/constants");
            for (var c in f)
                r[c] = f[c];
            r.NONE = 0, r.DEFLATE = 1, r.INFLATE = 2, r.GZIP = 3, r.GUNZIP = 4, r.DEFLATERAW = 5, r.INFLATERAW = 6, r.UNZIP = 7;
            function h(e) { if ("number" != typeof e || e < r.DEFLATE || e > r.UNZIP)
                throw new TypeError("Bad argument"); this.dictionary = null, this.err = 0, this.flush = 0, this.init_done = !1, this.level = 0, this.memLevel = 0, this.mode = e, this.strategy = 0, this.windowBits = 0, this.write_in_progress = !1, this.pending_close = !1, this.gzip_id_bytes_read = 0; }
            h.prototype.close = function () { this.write_in_progress ? this.pending_close = !0 : (this.pending_close = !1, i(this.init_done, "close before init"), i(this.mode <= r.UNZIP), this.mode === r.DEFLATE || this.mode === r.GZIP || this.mode === r.DEFLATERAW ? a.deflateEnd(this.strm) : this.mode !== r.INFLATE && this.mode !== r.GUNZIP && this.mode !== r.INFLATERAW && this.mode !== r.UNZIP || o.inflateEnd(this.strm), this.mode = r.NONE, this.dictionary = null); }, h.prototype.write = function (e, t, r, n, i, s, a) { return this._write(!0, e, t, r, n, i, s, a); }, h.prototype.writeSync = function (e, t, r, n, i, s, a) { return this._write(!1, e, t, r, n, i, s, a); }, h.prototype._write = function (e, s, a, o, f, c, h, u) { if (i.equal(arguments.length, 8), i(this.init_done, "write before init"), i(this.mode !== r.NONE, "already finalized"), i.equal(!1, this.write_in_progress, "write already in progress"), i.equal(!1, this.pending_close, "close is pending"), this.write_in_progress = !0, i.equal(!1, void 0 === s, "must provide flush value"), this.write_in_progress = !0, s !== r.Z_NO_FLUSH && s !== r.Z_PARTIAL_FLUSH && s !== r.Z_SYNC_FLUSH && s !== r.Z_FULL_FLUSH && s !== r.Z_FINISH && s !== r.Z_BLOCK)
                throw new Error("Invalid flush value"); if (null == a && (a = n.alloc(0), f = 0, o = 0), this.strm.avail_in = f, this.strm.input = a, this.strm.next_in = o, this.strm.avail_out = u, this.strm.output = c, this.strm.next_out = h, this.flush = s, !e)
                return this._process(), this._checkError() ? this._afterSync() : void 0; var d = this; return t.nextTick(function () { d._process(), d._after(); }), this; }, h.prototype._afterSync = function () { var e = this.strm.avail_out, t = this.strm.avail_in; return this.write_in_progress = !1, [t, e]; }, h.prototype._process = function () { var e = null; switch (this.mode) {
                case r.DEFLATE:
                case r.GZIP:
                case r.DEFLATERAW:
                    this.err = a.deflate(this.strm, this.flush);
                    break;
                case r.UNZIP: switch (this.strm.avail_in > 0 && (e = this.strm.next_in), this.gzip_id_bytes_read) {
                    case 0:
                        if (null === e)
                            break;
                        if (31 !== this.strm.input[e]) {
                            this.mode = r.INFLATE;
                            break;
                        }
                        if (this.gzip_id_bytes_read = 1, e++, 1 === this.strm.avail_in)
                            break;
                    case 1:
                        if (null === e)
                            break;
                        139 === this.strm.input[e] ? (this.gzip_id_bytes_read = 2, this.mode = r.GUNZIP) : this.mode = r.INFLATE;
                        break;
                    default: throw new Error("invalid number of gzip magic number bytes read");
                }
                case r.INFLATE:
                case r.GUNZIP:
                case r.INFLATERAW:
                    for (this.err = o.inflate(this.strm, this.flush), this.err === r.Z_NEED_DICT && this.dictionary && (this.err = o.inflateSetDictionary(this.strm, this.dictionary), this.err === r.Z_OK ? this.err = o.inflate(this.strm, this.flush) : this.err === r.Z_DATA_ERROR && (this.err = r.Z_NEED_DICT)); this.strm.avail_in > 0 && this.mode === r.GUNZIP && this.err === r.Z_STREAM_END && 0 !== this.strm.next_in[0];)
                        this.reset(), this.err = o.inflate(this.strm, this.flush);
                    break;
                default: throw new Error("Unknown mode " + this.mode);
            } }, h.prototype._checkError = function () { switch (this.err) {
                case r.Z_OK:
                case r.Z_BUF_ERROR:
                    if (0 !== this.strm.avail_out && this.flush === r.Z_FINISH)
                        return this._error("unexpected end of file"), !1;
                    break;
                case r.Z_STREAM_END: break;
                case r.Z_NEED_DICT: return null == this.dictionary ? this._error("Missing dictionary") : this._error("Bad dictionary"), !1;
                default: return this._error("Zlib error"), !1;
            } return !0; }, h.prototype._after = function () { if (this._checkError()) {
                var e = this.strm.avail_out, t = this.strm.avail_in;
                this.write_in_progress = !1, this.callback(t, e), this.pending_close && this.close();
            } }, h.prototype._error = function (e) { this.strm.msg && (e = this.strm.msg), this.onerror(e, this.err), this.write_in_progress = !1, this.pending_close && this.close(); }, h.prototype.init = function (e, t, n, s, a) { i(4 === arguments.length || 5 === arguments.length, "init(windowBits, level, memLevel, strategy, [dictionary])"), i(e >= 8 && e <= 15, "invalid windowBits"), i(t >= -1 && t <= 9, "invalid compression level"), i(n >= 1 && n <= 9, "invalid memlevel"), i(s === r.Z_FILTERED || s === r.Z_HUFFMAN_ONLY || s === r.Z_RLE || s === r.Z_FIXED || s === r.Z_DEFAULT_STRATEGY, "invalid strategy"), this._init(t, e, n, s, a), this._setDictionary(); }, h.prototype.params = function () { throw new Error("deflateParams Not supported"); }, h.prototype.reset = function () { this._reset(), this._setDictionary(); }, h.prototype._init = function (e, t, n, i, f) { switch (this.level = e, this.windowBits = t, this.memLevel = n, this.strategy = i, this.flush = r.Z_NO_FLUSH, this.err = r.Z_OK, this.mode !== r.GZIP && this.mode !== r.GUNZIP || (this.windowBits += 16), this.mode === r.UNZIP && (this.windowBits += 32), this.mode !== r.DEFLATERAW && this.mode !== r.INFLATERAW || (this.windowBits = -1 * this.windowBits), this.strm = new s, this.mode) {
                case r.DEFLATE:
                case r.GZIP:
                case r.DEFLATERAW:
                    this.err = a.deflateInit2(this.strm, this.level, r.Z_DEFLATED, this.windowBits, this.memLevel, this.strategy);
                    break;
                case r.INFLATE:
                case r.GUNZIP:
                case r.INFLATERAW:
                case r.UNZIP:
                    this.err = o.inflateInit2(this.strm, this.windowBits);
                    break;
                default: throw new Error("Unknown mode " + this.mode);
            } this.err !== r.Z_OK && this._error("Init error"), this.dictionary = f, this.write_in_progress = !1, this.init_done = !0; }, h.prototype._setDictionary = function () { if (null != this.dictionary) {
                switch (this.err = r.Z_OK, this.mode) {
                    case r.DEFLATE:
                    case r.DEFLATERAW: this.err = a.deflateSetDictionary(this.strm, this.dictionary);
                }
                this.err !== r.Z_OK && this._error("Failed to set dictionary");
            } }, h.prototype._reset = function () { switch (this.err = r.Z_OK, this.mode) {
                case r.DEFLATE:
                case r.DEFLATERAW:
                case r.GZIP:
                    this.err = a.deflateReset(this.strm);
                    break;
                case r.INFLATE:
                case r.INFLATERAW:
                case r.GUNZIP: this.err = o.inflateReset(this.strm);
            } this.err !== r.Z_OK && this._error("Failed to reset stream"); }, r.Zlib = h;
        }).call(this, e("_process"), e("buffer").Buffer); }, { _process: 141, assert: 15, buffer: 51, "pako/lib/zlib/constants": 120, "pako/lib/zlib/deflate.js": 122, "pako/lib/zlib/inflate.js": 124, "pako/lib/zlib/zstream": 128 }], 48: [function (e, t, r) { (function (t) {
            "use strict";
            var n = e("buffer").Buffer, i = e("stream").Transform, s = e("./binding"), a = e("util"), o = e("assert").ok, f = e("buffer").kMaxLength, c = "Cannot create final Buffer. It would be larger than 0x" + f.toString(16) + " bytes";
            s.Z_MIN_WINDOWBITS = 8, s.Z_MAX_WINDOWBITS = 15, s.Z_DEFAULT_WINDOWBITS = 15, s.Z_MIN_CHUNK = 64, s.Z_MAX_CHUNK = 1 / 0, s.Z_DEFAULT_CHUNK = 16384, s.Z_MIN_MEMLEVEL = 1, s.Z_MAX_MEMLEVEL = 9, s.Z_DEFAULT_MEMLEVEL = 8, s.Z_MIN_LEVEL = -1, s.Z_MAX_LEVEL = 9, s.Z_DEFAULT_LEVEL = s.Z_DEFAULT_COMPRESSION;
            for (var h = Object.keys(s), u = 0; u < h.length; u++) {
                var d = h[u];
                d.match(/^Z/) && Object.defineProperty(r, d, { enumerable: !0, value: s[d], writable: !1 });
            }
            for (var l = { Z_OK: s.Z_OK, Z_STREAM_END: s.Z_STREAM_END, Z_NEED_DICT: s.Z_NEED_DICT, Z_ERRNO: s.Z_ERRNO, Z_STREAM_ERROR: s.Z_STREAM_ERROR, Z_DATA_ERROR: s.Z_DATA_ERROR, Z_MEM_ERROR: s.Z_MEM_ERROR, Z_BUF_ERROR: s.Z_BUF_ERROR, Z_VERSION_ERROR: s.Z_VERSION_ERROR }, p = Object.keys(l), b = 0; b < p.length; b++) {
                var m = p[b];
                l[l[m]] = m;
            }
            function g(e, t, r) { var i = [], s = 0; function a() { for (var t; null !== (t = e.read());)
                i.push(t), s += t.length; e.once("readable", a); } function o() { var t, a = null; s >= f ? a = new RangeError(c) : t = n.concat(i, s), i = [], e.close(), r(a, t); } e.on("error", function (t) { e.removeListener("end", o), e.removeListener("readable", a), r(t); }), e.on("end", o), e.end(t), a(); }
            function y(e, t) { if ("string" == typeof t && (t = n.from(t)), !n.isBuffer(t))
                throw new TypeError("Not a string or buffer"); var r = e._finishFlushFlag; return e._processChunk(t, r); }
            function v(e) { if (!(this instanceof v))
                return new v(e); M.call(this, e, s.DEFLATE); }
            function _(e) { if (!(this instanceof _))
                return new _(e); M.call(this, e, s.INFLATE); }
            function w(e) { if (!(this instanceof w))
                return new w(e); M.call(this, e, s.GZIP); }
            function E(e) { if (!(this instanceof E))
                return new E(e); M.call(this, e, s.GUNZIP); }
            function k(e) { if (!(this instanceof k))
                return new k(e); M.call(this, e, s.DEFLATERAW); }
            function S(e) { if (!(this instanceof S))
                return new S(e); M.call(this, e, s.INFLATERAW); }
            function x(e) { if (!(this instanceof x))
                return new x(e); M.call(this, e, s.UNZIP); }
            function A(e) { return e === s.Z_NO_FLUSH || e === s.Z_PARTIAL_FLUSH || e === s.Z_SYNC_FLUSH || e === s.Z_FULL_FLUSH || e === s.Z_FINISH || e === s.Z_BLOCK; }
            function M(e, t) { var a = this; if (this._opts = e = e || {}, this._chunkSize = e.chunkSize || r.Z_DEFAULT_CHUNK, i.call(this, e), e.flush && !A(e.flush))
                throw new Error("Invalid flush flag: " + e.flush); if (e.finishFlush && !A(e.finishFlush))
                throw new Error("Invalid flush flag: " + e.finishFlush); if (this._flushFlag = e.flush || s.Z_NO_FLUSH, this._finishFlushFlag = void 0 !== e.finishFlush ? e.finishFlush : s.Z_FINISH, e.chunkSize && (e.chunkSize < r.Z_MIN_CHUNK || e.chunkSize > r.Z_MAX_CHUNK))
                throw new Error("Invalid chunk size: " + e.chunkSize); if (e.windowBits && (e.windowBits < r.Z_MIN_WINDOWBITS || e.windowBits > r.Z_MAX_WINDOWBITS))
                throw new Error("Invalid windowBits: " + e.windowBits); if (e.level && (e.level < r.Z_MIN_LEVEL || e.level > r.Z_MAX_LEVEL))
                throw new Error("Invalid compression level: " + e.level); if (e.memLevel && (e.memLevel < r.Z_MIN_MEMLEVEL || e.memLevel > r.Z_MAX_MEMLEVEL))
                throw new Error("Invalid memLevel: " + e.memLevel); if (e.strategy && e.strategy != r.Z_FILTERED && e.strategy != r.Z_HUFFMAN_ONLY && e.strategy != r.Z_RLE && e.strategy != r.Z_FIXED && e.strategy != r.Z_DEFAULT_STRATEGY)
                throw new Error("Invalid strategy: " + e.strategy); if (e.dictionary && !n.isBuffer(e.dictionary))
                throw new Error("Invalid dictionary: it should be a Buffer instance"); this._handle = new s.Zlib(t); var o = this; this._hadError = !1, this._handle.onerror = function (e, t) { I(o), o._hadError = !0; var n = new Error(e); n.errno = t, n.code = r.codes[t], o.emit("error", n); }; var f = r.Z_DEFAULT_COMPRESSION; "number" == typeof e.level && (f = e.level); var c = r.Z_DEFAULT_STRATEGY; "number" == typeof e.strategy && (c = e.strategy), this._handle.init(e.windowBits || r.Z_DEFAULT_WINDOWBITS, f, e.memLevel || r.Z_DEFAULT_MEMLEVEL, c, e.dictionary), this._buffer = n.allocUnsafe(this._chunkSize), this._offset = 0, this._level = f, this._strategy = c, this.once("end", this.close), Object.defineProperty(this, "_closed", { get: function () { return !a._handle; }, configurable: !0, enumerable: !0 }); }
            function I(e, r) { r && t.nextTick(r), e._handle && (e._handle.close(), e._handle = null); }
            function B(e) { e.emit("close"); }
            Object.defineProperty(r, "codes", { enumerable: !0, value: Object.freeze(l), writable: !1 }), r.Deflate = v, r.Inflate = _, r.Gzip = w, r.Gunzip = E, r.DeflateRaw = k, r.InflateRaw = S, r.Unzip = x, r.createDeflate = function (e) { return new v(e); }, r.createInflate = function (e) { return new _(e); }, r.createDeflateRaw = function (e) { return new k(e); }, r.createInflateRaw = function (e) { return new S(e); }, r.createGzip = function (e) { return new w(e); }, r.createGunzip = function (e) { return new E(e); }, r.createUnzip = function (e) { return new x(e); }, r.deflate = function (e, t, r) { return "function" == typeof t && (r = t, t = {}), g(new v(t), e, r); }, r.deflateSync = function (e, t) { return y(new v(t), e); }, r.gzip = function (e, t, r) { return "function" == typeof t && (r = t, t = {}), g(new w(t), e, r); }, r.gzipSync = function (e, t) { return y(new w(t), e); }, r.deflateRaw = function (e, t, r) { return "function" == typeof t && (r = t, t = {}), g(new k(t), e, r); }, r.deflateRawSync = function (e, t) { return y(new k(t), e); }, r.unzip = function (e, t, r) { return "function" == typeof t && (r = t, t = {}), g(new x(t), e, r); }, r.unzipSync = function (e, t) { return y(new x(t), e); }, r.inflate = function (e, t, r) { return "function" == typeof t && (r = t, t = {}), g(new _(t), e, r); }, r.inflateSync = function (e, t) { return y(new _(t), e); }, r.gunzip = function (e, t, r) { return "function" == typeof t && (r = t, t = {}), g(new E(t), e, r); }, r.gunzipSync = function (e, t) { return y(new E(t), e); }, r.inflateRaw = function (e, t, r) { return "function" == typeof t && (r = t, t = {}), g(new S(t), e, r); }, r.inflateRawSync = function (e, t) { return y(new S(t), e); }, a.inherits(M, i), M.prototype.params = function (e, n, i) { if (e < r.Z_MIN_LEVEL || e > r.Z_MAX_LEVEL)
                throw new RangeError("Invalid compression level: " + e); if (n != r.Z_FILTERED && n != r.Z_HUFFMAN_ONLY && n != r.Z_RLE && n != r.Z_FIXED && n != r.Z_DEFAULT_STRATEGY)
                throw new TypeError("Invalid strategy: " + n); if (this._level !== e || this._strategy !== n) {
                var a = this;
                this.flush(s.Z_SYNC_FLUSH, function () { o(a._handle, "zlib binding closed"), a._handle.params(e, n), a._hadError || (a._level = e, a._strategy = n, i && i()); });
            }
            else
                t.nextTick(i); }, M.prototype.reset = function () { return o(this._handle, "zlib binding closed"), this._handle.reset(); }, M.prototype._flush = function (e) { this._transform(n.alloc(0), "", e); }, M.prototype.flush = function (e, r) { var i = this, a = this._writableState; ("function" == typeof e || void 0 === e && !r) && (r = e, e = s.Z_FULL_FLUSH), a.ended ? r && t.nextTick(r) : a.ending ? r && this.once("end", r) : a.needDrain ? r && this.once("drain", function () { return i.flush(e, r); }) : (this._flushFlag = e, this.write(n.alloc(0), "", r)); }, M.prototype.close = function (e) { I(this, e), t.nextTick(B, this); }, M.prototype._transform = function (e, t, r) { var i, a = this._writableState, o = (a.ending || a.ended) && (!e || a.length === e.length); return null === e || n.isBuffer(e) ? this._handle ? (o ? i = this._finishFlushFlag : (i = this._flushFlag, e.length >= a.length && (this._flushFlag = this._opts.flush || s.Z_NO_FLUSH)), void this._processChunk(e, i, r)) : r(new Error("zlib binding closed")) : r(new Error("invalid input")); }, M.prototype._processChunk = function (e, t, r) { var i = e && e.length, s = this._chunkSize - this._offset, a = 0, h = this, u = "function" == typeof r; if (!u) {
                var d, l = [], p = 0;
                this.on("error", function (e) { d = e; }), o(this._handle, "zlib binding closed");
                do {
                    var b = this._handle.writeSync(t, e, a, i, this._buffer, this._offset, s);
                } while (!this._hadError && y(b[0], b[1]));
                if (this._hadError)
                    throw d;
                if (p >= f)
                    throw I(this), new RangeError(c);
                var m = n.concat(l, p);
                return I(this), m;
            } o(this._handle, "zlib binding closed"); var g = this._handle.write(t, e, a, i, this._buffer, this._offset, s); function y(f, c) { if (this && (this.buffer = null, this.callback = null), !h._hadError) {
                var d = s - c;
                if (o(d >= 0, "have should not go down"), d > 0) {
                    var b = h._buffer.slice(h._offset, h._offset + d);
                    h._offset += d, u ? h.push(b) : (l.push(b), p += b.length);
                }
                if ((0 === c || h._offset >= h._chunkSize) && (s = h._chunkSize, h._offset = 0, h._buffer = n.allocUnsafe(h._chunkSize)), 0 === c) {
                    if (a += i - f, i = f, !u)
                        return !0;
                    var m = h._handle.write(t, e, a, i, h._buffer, h._offset, h._chunkSize);
                    return m.callback = y, void (m.buffer = e);
                }
                if (!u)
                    return !1;
                r();
            } } g.buffer = e, g.callback = y; }, a.inherits(v, M), a.inherits(_, M), a.inherits(w, M), a.inherits(E, M), a.inherits(k, M), a.inherits(S, M), a.inherits(x, M);
        }).call(this, e("_process")); }, { "./binding": 47, _process: 141, assert: 15, buffer: 51, stream: 178, util: 190 }], 49: [function (e, t, r) { arguments[4][19][0].apply(r, arguments); }, { dup: 19 }], 50: [function (e, t, r) { (function (e) { t.exports = function (t, r) { for (var n = Math.min(t.length, r.length), i = new e(n), s = 0; s < n; ++s)
            i[s] = t[s] ^ r[s]; return i; }; }).call(this, e("buffer").Buffer); }, { buffer: 51 }], 51: [function (e, t, r) {
            "use strict";
            var n = e("base64-js"), i = e("ieee754");
            r.Buffer = o, r.SlowBuffer = function (e) { +e != e && (e = 0); return o.alloc(+e); }, r.INSPECT_MAX_BYTES = 50;
            var s = 2147483647;
            function a(e) { if (e > s)
                throw new RangeError("Invalid typed array length"); var t = new Uint8Array(e); return t.__proto__ = o.prototype, t; }
            function o(e, t, r) { if ("number" == typeof e) {
                if ("string" == typeof t)
                    throw new Error("If encoding is specified then the first argument must be a string");
                return h(e);
            } return f(e, t, r); }
            function f(e, t, r) { if ("number" == typeof e)
                throw new TypeError('"value" argument must not be a number'); return U(e) || e && U(e.buffer) ? function (e, t, r) { if (t < 0 || e.byteLength < t)
                throw new RangeError('"offset" is outside of buffer bounds'); if (e.byteLength < t + (r || 0))
                throw new RangeError('"length" is outside of buffer bounds'); var n; n = void 0 === t && void 0 === r ? new Uint8Array(e) : void 0 === r ? new Uint8Array(e, t) : new Uint8Array(e, t, r); return n.__proto__ = o.prototype, n; }(e, t, r) : "string" == typeof e ? function (e, t) { "string" == typeof t && "" !== t || (t = "utf8"); if (!o.isEncoding(t))
                throw new TypeError("Unknown encoding: " + t); var r = 0 | l(e, t), n = a(r), i = n.write(e, t); i !== r && (n = n.slice(0, i)); return n; }(e, t) : function (e) { if (o.isBuffer(e)) {
                var t = 0 | d(e.length), r = a(t);
                return 0 === r.length ? r : (e.copy(r, 0, 0, t), r);
            } if (e) {
                if (ArrayBuffer.isView(e) || "length" in e)
                    return "number" != typeof e.length || q(e.length) ? a(0) : u(e);
                if ("Buffer" === e.type && Array.isArray(e.data))
                    return u(e.data);
            } throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object."); }(e); }
            function c(e) { if ("number" != typeof e)
                throw new TypeError('"size" argument must be of type number'); if (e < 0)
                throw new RangeError('"size" argument must not be negative'); }
            function h(e) { return c(e), a(e < 0 ? 0 : 0 | d(e)); }
            function u(e) { for (var t = e.length < 0 ? 0 : 0 | d(e.length), r = a(t), n = 0; n < t; n += 1)
                r[n] = 255 & e[n]; return r; }
            function d(e) { if (e >= s)
                throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + s.toString(16) + " bytes"); return 0 | e; }
            function l(e, t) { if (o.isBuffer(e))
                return e.length; if (ArrayBuffer.isView(e) || U(e))
                return e.byteLength; "string" != typeof e && (e = "" + e); var r = e.length; if (0 === r)
                return 0; for (var n = !1;;)
                switch (t) {
                    case "ascii":
                    case "latin1":
                    case "binary": return r;
                    case "utf8":
                    case "utf-8":
                    case void 0: return N(e).length;
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le": return 2 * r;
                    case "hex": return r >>> 1;
                    case "base64": return P(e).length;
                    default:
                        if (n)
                            return N(e).length;
                        t = ("" + t).toLowerCase(), n = !0;
                } }
            function p(e, t, r) { var n = e[t]; e[t] = e[r], e[r] = n; }
            function b(e, t, r, n, i) { if (0 === e.length)
                return -1; if ("string" == typeof r ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), q(r = +r) && (r = i ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {
                if (i)
                    return -1;
                r = e.length - 1;
            }
            else if (r < 0) {
                if (!i)
                    return -1;
                r = 0;
            } if ("string" == typeof t && (t = o.from(t, n)), o.isBuffer(t))
                return 0 === t.length ? -1 : m(e, t, r, n, i); if ("number" == typeof t)
                return t &= 255, "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : m(e, [t], r, n, i); throw new TypeError("val must be string, number or Buffer"); }
            function m(e, t, r, n, i) { var s, a = 1, o = e.length, f = t.length; if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
                if (e.length < 2 || t.length < 2)
                    return -1;
                a = 2, o /= 2, f /= 2, r /= 2;
            } function c(e, t) { return 1 === a ? e[t] : e.readUInt16BE(t * a); } if (i) {
                var h = -1;
                for (s = r; s < o; s++)
                    if (c(e, s) === c(t, -1 === h ? 0 : s - h)) {
                        if (-1 === h && (h = s), s - h + 1 === f)
                            return h * a;
                    }
                    else
                        -1 !== h && (s -= s - h), h = -1;
            }
            else
                for (r + f > o && (r = o - f), s = r; s >= 0; s--) {
                    for (var u = !0, d = 0; d < f; d++)
                        if (c(e, s + d) !== c(t, d)) {
                            u = !1;
                            break;
                        }
                    if (u)
                        return s;
                } return -1; }
            function g(e, t, r, n) { r = Number(r) || 0; var i = e.length - r; n ? (n = Number(n)) > i && (n = i) : n = i; var s = t.length; n > s / 2 && (n = s / 2); for (var a = 0; a < n; ++a) {
                var o = parseInt(t.substr(2 * a, 2), 16);
                if (q(o))
                    return a;
                e[r + a] = o;
            } return a; }
            function y(e, t, r, n) { return D(N(t, e.length - r), e, r, n); }
            function v(e, t, r, n) { return D(function (e) { for (var t = [], r = 0; r < e.length; ++r)
                t.push(255 & e.charCodeAt(r)); return t; }(t), e, r, n); }
            function _(e, t, r, n) { return v(e, t, r, n); }
            function w(e, t, r, n) { return D(P(t), e, r, n); }
            function E(e, t, r, n) { return D(function (e, t) { for (var r, n, i, s = [], a = 0; a < e.length && !((t -= 2) < 0); ++a)
                r = e.charCodeAt(a), n = r >> 8, i = r % 256, s.push(i), s.push(n); return s; }(t, e.length - r), e, r, n); }
            function k(e, t, r) { return 0 === t && r === e.length ? n.fromByteArray(e) : n.fromByteArray(e.slice(t, r)); }
            function S(e, t, r) { r = Math.min(e.length, r); for (var n = [], i = t; i < r;) {
                var s, a, o, f, c = e[i], h = null, u = c > 239 ? 4 : c > 223 ? 3 : c > 191 ? 2 : 1;
                if (i + u <= r)
                    switch (u) {
                        case 1:
                            c < 128 && (h = c);
                            break;
                        case 2:
                            128 == (192 & (s = e[i + 1])) && (f = (31 & c) << 6 | 63 & s) > 127 && (h = f);
                            break;
                        case 3:
                            s = e[i + 1], a = e[i + 2], 128 == (192 & s) && 128 == (192 & a) && (f = (15 & c) << 12 | (63 & s) << 6 | 63 & a) > 2047 && (f < 55296 || f > 57343) && (h = f);
                            break;
                        case 4: s = e[i + 1], a = e[i + 2], o = e[i + 3], 128 == (192 & s) && 128 == (192 & a) && 128 == (192 & o) && (f = (15 & c) << 18 | (63 & s) << 12 | (63 & a) << 6 | 63 & o) > 65535 && f < 1114112 && (h = f);
                    }
                null === h ? (h = 65533, u = 1) : h > 65535 && (h -= 65536, n.push(h >>> 10 & 1023 | 55296), h = 56320 | 1023 & h), n.push(h), i += u;
            } return function (e) { var t = e.length; if (t <= x)
                return String.fromCharCode.apply(String, e); var r = "", n = 0; for (; n < t;)
                r += String.fromCharCode.apply(String, e.slice(n, n += x)); return r; }(n); }
            r.kMaxLength = s, o.TYPED_ARRAY_SUPPORT = function () { try {
                var e = new Uint8Array(1);
                return e.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42; } }, 42 === e.foo();
            }
            catch (e) {
                return !1;
            } }(), o.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(o.prototype, "parent", { get: function () { if (this instanceof o)
                    return this.buffer; } }), Object.defineProperty(o.prototype, "offset", { get: function () { if (this instanceof o)
                    return this.byteOffset; } }), "undefined" != typeof Symbol && Symbol.species && o[Symbol.species] === o && Object.defineProperty(o, Symbol.species, { value: null, configurable: !0, enumerable: !1, writable: !1 }), o.poolSize = 8192, o.from = function (e, t, r) { return f(e, t, r); }, o.prototype.__proto__ = Uint8Array.prototype, o.__proto__ = Uint8Array, o.alloc = function (e, t, r) { return function (e, t, r) { return c(e), e <= 0 ? a(e) : void 0 !== t ? "string" == typeof r ? a(e).fill(t, r) : a(e).fill(t) : a(e); }(e, t, r); }, o.allocUnsafe = function (e) { return h(e); }, o.allocUnsafeSlow = function (e) { return h(e); }, o.isBuffer = function (e) { return null != e && !0 === e._isBuffer; }, o.compare = function (e, t) { if (!o.isBuffer(e) || !o.isBuffer(t))
                throw new TypeError("Arguments must be Buffers"); if (e === t)
                return 0; for (var r = e.length, n = t.length, i = 0, s = Math.min(r, n); i < s; ++i)
                if (e[i] !== t[i]) {
                    r = e[i], n = t[i];
                    break;
                } return r < n ? -1 : n < r ? 1 : 0; }, o.isEncoding = function (e) { switch (String(e).toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "latin1":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le": return !0;
                default: return !1;
            } }, o.concat = function (e, t) { if (!Array.isArray(e))
                throw new TypeError('"list" argument must be an Array of Buffers'); if (0 === e.length)
                return o.alloc(0); var r; if (void 0 === t)
                for (t = 0, r = 0; r < e.length; ++r)
                    t += e[r].length; var n = o.allocUnsafe(t), i = 0; for (r = 0; r < e.length; ++r) {
                var s = e[r];
                if (ArrayBuffer.isView(s) && (s = o.from(s)), !o.isBuffer(s))
                    throw new TypeError('"list" argument must be an Array of Buffers');
                s.copy(n, i), i += s.length;
            } return n; }, o.byteLength = l, o.prototype._isBuffer = !0, o.prototype.swap16 = function () { var e = this.length; if (e % 2 != 0)
                throw new RangeError("Buffer size must be a multiple of 16-bits"); for (var t = 0; t < e; t += 2)
                p(this, t, t + 1); return this; }, o.prototype.swap32 = function () { var e = this.length; if (e % 4 != 0)
                throw new RangeError("Buffer size must be a multiple of 32-bits"); for (var t = 0; t < e; t += 4)
                p(this, t, t + 3), p(this, t + 1, t + 2); return this; }, o.prototype.swap64 = function () { var e = this.length; if (e % 8 != 0)
                throw new RangeError("Buffer size must be a multiple of 64-bits"); for (var t = 0; t < e; t += 8)
                p(this, t, t + 7), p(this, t + 1, t + 6), p(this, t + 2, t + 5), p(this, t + 3, t + 4); return this; }, o.prototype.toString = function () { var e = this.length; return 0 === e ? "" : 0 === arguments.length ? S(this, 0, e) : function (e, t, r) { var n = !1; if ((void 0 === t || t < 0) && (t = 0), t > this.length)
                return ""; if ((void 0 === r || r > this.length) && (r = this.length), r <= 0)
                return ""; if ((r >>>= 0) <= (t >>>= 0))
                return ""; for (e || (e = "utf8");;)
                switch (e) {
                    case "hex": return I(this, t, r);
                    case "utf8":
                    case "utf-8": return S(this, t, r);
                    case "ascii": return A(this, t, r);
                    case "latin1":
                    case "binary": return M(this, t, r);
                    case "base64": return k(this, t, r);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le": return B(this, t, r);
                    default:
                        if (n)
                            throw new TypeError("Unknown encoding: " + e);
                        e = (e + "").toLowerCase(), n = !0;
                } }.apply(this, arguments); }, o.prototype.toLocaleString = o.prototype.toString, o.prototype.equals = function (e) { if (!o.isBuffer(e))
                throw new TypeError("Argument must be a Buffer"); return this === e || 0 === o.compare(this, e); }, o.prototype.inspect = function () { var e = "", t = r.INSPECT_MAX_BYTES; return this.length > 0 && (e = this.toString("hex", 0, t).match(/.{2}/g).join(" "), this.length > t && (e += " ... ")), "<Buffer " + e + ">"; }, o.prototype.compare = function (e, t, r, n, i) { if (!o.isBuffer(e))
                throw new TypeError("Argument must be a Buffer"); if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0), void 0 === n && (n = 0), void 0 === i && (i = this.length), t < 0 || r > e.length || n < 0 || i > this.length)
                throw new RangeError("out of range index"); if (n >= i && t >= r)
                return 0; if (n >= i)
                return -1; if (t >= r)
                return 1; if (t >>>= 0, r >>>= 0, n >>>= 0, i >>>= 0, this === e)
                return 0; for (var s = i - n, a = r - t, f = Math.min(s, a), c = this.slice(n, i), h = e.slice(t, r), u = 0; u < f; ++u)
                if (c[u] !== h[u]) {
                    s = c[u], a = h[u];
                    break;
                } return s < a ? -1 : a < s ? 1 : 0; }, o.prototype.includes = function (e, t, r) { return -1 !== this.indexOf(e, t, r); }, o.prototype.indexOf = function (e, t, r) { return b(this, e, t, r, !0); }, o.prototype.lastIndexOf = function (e, t, r) { return b(this, e, t, r, !1); }, o.prototype.write = function (e, t, r, n) { if (void 0 === t)
                n = "utf8", r = this.length, t = 0;
            else if (void 0 === r && "string" == typeof t)
                n = t, r = this.length, t = 0;
            else {
                if (!isFinite(t))
                    throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                t >>>= 0, isFinite(r) ? (r >>>= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0);
            } var i = this.length - t; if ((void 0 === r || r > i) && (r = i), e.length > 0 && (r < 0 || t < 0) || t > this.length)
                throw new RangeError("Attempt to write outside buffer bounds"); n || (n = "utf8"); for (var s = !1;;)
                switch (n) {
                    case "hex": return g(this, e, t, r);
                    case "utf8":
                    case "utf-8": return y(this, e, t, r);
                    case "ascii": return v(this, e, t, r);
                    case "latin1":
                    case "binary": return _(this, e, t, r);
                    case "base64": return w(this, e, t, r);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le": return E(this, e, t, r);
                    default:
                        if (s)
                            throw new TypeError("Unknown encoding: " + n);
                        n = ("" + n).toLowerCase(), s = !0;
                } }, o.prototype.toJSON = function () { return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) }; };
            var x = 4096;
            function A(e, t, r) { var n = ""; r = Math.min(e.length, r); for (var i = t; i < r; ++i)
                n += String.fromCharCode(127 & e[i]); return n; }
            function M(e, t, r) { var n = ""; r = Math.min(e.length, r); for (var i = t; i < r; ++i)
                n += String.fromCharCode(e[i]); return n; }
            function I(e, t, r) { var n = e.length; (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n); for (var i = "", s = t; s < r; ++s)
                i += L(e[s]); return i; }
            function B(e, t, r) { for (var n = e.slice(t, r), i = "", s = 0; s < n.length; s += 2)
                i += String.fromCharCode(n[s] + 256 * n[s + 1]); return i; }
            function j(e, t, r) { if (e % 1 != 0 || e < 0)
                throw new RangeError("offset is not uint"); if (e + t > r)
                throw new RangeError("Trying to access beyond buffer length"); }
            function R(e, t, r, n, i, s) { if (!o.isBuffer(e))
                throw new TypeError('"buffer" argument must be a Buffer instance'); if (t > i || t < s)
                throw new RangeError('"value" argument is out of bounds'); if (r + n > e.length)
                throw new RangeError("Index out of range"); }
            function T(e, t, r, n, i, s) { if (r + n > e.length)
                throw new RangeError("Index out of range"); if (r < 0)
                throw new RangeError("Index out of range"); }
            function C(e, t, r, n, s) { return t = +t, r >>>= 0, s || T(e, 0, r, 4), i.write(e, t, r, n, 23, 4), r + 4; }
            function O(e, t, r, n, s) { return t = +t, r >>>= 0, s || T(e, 0, r, 8), i.write(e, t, r, n, 52, 8), r + 8; }
            o.prototype.slice = function (e, t) { var r = this.length; e = ~~e, t = void 0 === t ? r : ~~t, e < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r), t < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r), t < e && (t = e); var n = this.subarray(e, t); return n.__proto__ = o.prototype, n; }, o.prototype.readUIntLE = function (e, t, r) { e >>>= 0, t >>>= 0, r || j(e, t, this.length); for (var n = this[e], i = 1, s = 0; ++s < t && (i *= 256);)
                n += this[e + s] * i; return n; }, o.prototype.readUIntBE = function (e, t, r) { e >>>= 0, t >>>= 0, r || j(e, t, this.length); for (var n = this[e + --t], i = 1; t > 0 && (i *= 256);)
                n += this[e + --t] * i; return n; }, o.prototype.readUInt8 = function (e, t) { return e >>>= 0, t || j(e, 1, this.length), this[e]; }, o.prototype.readUInt16LE = function (e, t) { return e >>>= 0, t || j(e, 2, this.length), this[e] | this[e + 1] << 8; }, o.prototype.readUInt16BE = function (e, t) { return e >>>= 0, t || j(e, 2, this.length), this[e] << 8 | this[e + 1]; }, o.prototype.readUInt32LE = function (e, t) { return e >>>= 0, t || j(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]; }, o.prototype.readUInt32BE = function (e, t) { return e >>>= 0, t || j(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]); }, o.prototype.readIntLE = function (e, t, r) { e >>>= 0, t >>>= 0, r || j(e, t, this.length); for (var n = this[e], i = 1, s = 0; ++s < t && (i *= 256);)
                n += this[e + s] * i; return n >= (i *= 128) && (n -= Math.pow(2, 8 * t)), n; }, o.prototype.readIntBE = function (e, t, r) { e >>>= 0, t >>>= 0, r || j(e, t, this.length); for (var n = t, i = 1, s = this[e + --n]; n > 0 && (i *= 256);)
                s += this[e + --n] * i; return s >= (i *= 128) && (s -= Math.pow(2, 8 * t)), s; }, o.prototype.readInt8 = function (e, t) { return e >>>= 0, t || j(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]; }, o.prototype.readInt16LE = function (e, t) { e >>>= 0, t || j(e, 2, this.length); var r = this[e] | this[e + 1] << 8; return 32768 & r ? 4294901760 | r : r; }, o.prototype.readInt16BE = function (e, t) { e >>>= 0, t || j(e, 2, this.length); var r = this[e + 1] | this[e] << 8; return 32768 & r ? 4294901760 | r : r; }, o.prototype.readInt32LE = function (e, t) { return e >>>= 0, t || j(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24; }, o.prototype.readInt32BE = function (e, t) { return e >>>= 0, t || j(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]; }, o.prototype.readFloatLE = function (e, t) { return e >>>= 0, t || j(e, 4, this.length), i.read(this, e, !0, 23, 4); }, o.prototype.readFloatBE = function (e, t) { return e >>>= 0, t || j(e, 4, this.length), i.read(this, e, !1, 23, 4); }, o.prototype.readDoubleLE = function (e, t) { return e >>>= 0, t || j(e, 8, this.length), i.read(this, e, !0, 52, 8); }, o.prototype.readDoubleBE = function (e, t) { return e >>>= 0, t || j(e, 8, this.length), i.read(this, e, !1, 52, 8); }, o.prototype.writeUIntLE = function (e, t, r, n) { (e = +e, t >>>= 0, r >>>= 0, n) || R(this, e, t, r, Math.pow(2, 8 * r) - 1, 0); var i = 1, s = 0; for (this[t] = 255 & e; ++s < r && (i *= 256);)
                this[t + s] = e / i & 255; return t + r; }, o.prototype.writeUIntBE = function (e, t, r, n) { (e = +e, t >>>= 0, r >>>= 0, n) || R(this, e, t, r, Math.pow(2, 8 * r) - 1, 0); var i = r - 1, s = 1; for (this[t + i] = 255 & e; --i >= 0 && (s *= 256);)
                this[t + i] = e / s & 255; return t + r; }, o.prototype.writeUInt8 = function (e, t, r) { return e = +e, t >>>= 0, r || R(this, e, t, 1, 255, 0), this[t] = 255 & e, t + 1; }, o.prototype.writeUInt16LE = function (e, t, r) { return e = +e, t >>>= 0, r || R(this, e, t, 2, 65535, 0), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2; }, o.prototype.writeUInt16BE = function (e, t, r) { return e = +e, t >>>= 0, r || R(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2; }, o.prototype.writeUInt32LE = function (e, t, r) { return e = +e, t >>>= 0, r || R(this, e, t, 4, 4294967295, 0), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e, t + 4; }, o.prototype.writeUInt32BE = function (e, t, r) { return e = +e, t >>>= 0, r || R(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4; }, o.prototype.writeIntLE = function (e, t, r, n) { if (e = +e, t >>>= 0, !n) {
                var i = Math.pow(2, 8 * r - 1);
                R(this, e, t, r, i - 1, -i);
            } var s = 0, a = 1, o = 0; for (this[t] = 255 & e; ++s < r && (a *= 256);)
                e < 0 && 0 === o && 0 !== this[t + s - 1] && (o = 1), this[t + s] = (e / a >> 0) - o & 255; return t + r; }, o.prototype.writeIntBE = function (e, t, r, n) { if (e = +e, t >>>= 0, !n) {
                var i = Math.pow(2, 8 * r - 1);
                R(this, e, t, r, i - 1, -i);
            } var s = r - 1, a = 1, o = 0; for (this[t + s] = 255 & e; --s >= 0 && (a *= 256);)
                e < 0 && 0 === o && 0 !== this[t + s + 1] && (o = 1), this[t + s] = (e / a >> 0) - o & 255; return t + r; }, o.prototype.writeInt8 = function (e, t, r) { return e = +e, t >>>= 0, r || R(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1; }, o.prototype.writeInt16LE = function (e, t, r) { return e = +e, t >>>= 0, r || R(this, e, t, 2, 32767, -32768), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2; }, o.prototype.writeInt16BE = function (e, t, r) { return e = +e, t >>>= 0, r || R(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2; }, o.prototype.writeInt32LE = function (e, t, r) { return e = +e, t >>>= 0, r || R(this, e, t, 4, 2147483647, -2147483648), this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4; }, o.prototype.writeInt32BE = function (e, t, r) { return e = +e, t >>>= 0, r || R(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4; }, o.prototype.writeFloatLE = function (e, t, r) { return C(this, e, t, !0, r); }, o.prototype.writeFloatBE = function (e, t, r) { return C(this, e, t, !1, r); }, o.prototype.writeDoubleLE = function (e, t, r) { return O(this, e, t, !0, r); }, o.prototype.writeDoubleBE = function (e, t, r) { return O(this, e, t, !1, r); }, o.prototype.copy = function (e, t, r, n) { if (!o.isBuffer(e))
                throw new TypeError("argument should be a Buffer"); if (r || (r = 0), n || 0 === n || (n = this.length), t >= e.length && (t = e.length), t || (t = 0), n > 0 && n < r && (n = r), n === r)
                return 0; if (0 === e.length || 0 === this.length)
                return 0; if (t < 0)
                throw new RangeError("targetStart out of bounds"); if (r < 0 || r >= this.length)
                throw new RangeError("Index out of range"); if (n < 0)
                throw new RangeError("sourceEnd out of bounds"); n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r); var i = n - r; if (this === e && "function" == typeof Uint8Array.prototype.copyWithin)
                this.copyWithin(t, r, n);
            else if (this === e && r < t && t < n)
                for (var s = i - 1; s >= 0; --s)
                    e[s + t] = this[s + r];
            else
                Uint8Array.prototype.set.call(e, this.subarray(r, n), t); return i; }, o.prototype.fill = function (e, t, r, n) { if ("string" == typeof e) {
                if ("string" == typeof t ? (n = t, t = 0, r = this.length) : "string" == typeof r && (n = r, r = this.length), void 0 !== n && "string" != typeof n)
                    throw new TypeError("encoding must be a string");
                if ("string" == typeof n && !o.isEncoding(n))
                    throw new TypeError("Unknown encoding: " + n);
                if (1 === e.length) {
                    var i = e.charCodeAt(0);
                    ("utf8" === n && i < 128 || "latin1" === n) && (e = i);
                }
            }
            else
                "number" == typeof e && (e &= 255); if (t < 0 || this.length < t || this.length < r)
                throw new RangeError("Out of range index"); if (r <= t)
                return this; var s; if (t >>>= 0, r = void 0 === r ? this.length : r >>> 0, e || (e = 0), "number" == typeof e)
                for (s = t; s < r; ++s)
                    this[s] = e;
            else {
                var a = o.isBuffer(e) ? e : new o(e, n), f = a.length;
                if (0 === f)
                    throw new TypeError('The value "' + e + '" is invalid for argument "value"');
                for (s = 0; s < r - t; ++s)
                    this[s + t] = a[s % f];
            } return this; };
            var z = /[^+/0-9A-Za-z-_]/g;
            function L(e) { return e < 16 ? "0" + e.toString(16) : e.toString(16); }
            function N(e, t) { var r; t = t || 1 / 0; for (var n = e.length, i = null, s = [], a = 0; a < n; ++a) {
                if ((r = e.charCodeAt(a)) > 55295 && r < 57344) {
                    if (!i) {
                        if (r > 56319) {
                            (t -= 3) > -1 && s.push(239, 191, 189);
                            continue;
                        }
                        if (a + 1 === n) {
                            (t -= 3) > -1 && s.push(239, 191, 189);
                            continue;
                        }
                        i = r;
                        continue;
                    }
                    if (r < 56320) {
                        (t -= 3) > -1 && s.push(239, 191, 189), i = r;
                        continue;
                    }
                    r = 65536 + (i - 55296 << 10 | r - 56320);
                }
                else
                    i && (t -= 3) > -1 && s.push(239, 191, 189);
                if (i = null, r < 128) {
                    if ((t -= 1) < 0)
                        break;
                    s.push(r);
                }
                else if (r < 2048) {
                    if ((t -= 2) < 0)
                        break;
                    s.push(r >> 6 | 192, 63 & r | 128);
                }
                else if (r < 65536) {
                    if ((t -= 3) < 0)
                        break;
                    s.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128);
                }
                else {
                    if (!(r < 1114112))
                        throw new Error("Invalid code point");
                    if ((t -= 4) < 0)
                        break;
                    s.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128);
                }
            } return s; }
            function P(e) { return n.toByteArray(function (e) { if ((e = (e = e.split("=")[0]).trim().replace(z, "")).length < 2)
                return ""; for (; e.length % 4 != 0;)
                e += "="; return e; }(e)); }
            function D(e, t, r, n) { for (var i = 0; i < n && !(i + r >= t.length || i >= e.length); ++i)
                t[i + r] = e[i]; return i; }
            function U(e) { return e instanceof ArrayBuffer || null != e && null != e.constructor && "ArrayBuffer" === e.constructor.name && "number" == typeof e.byteLength; }
            function q(e) { return e != e; }
        }, { "base64-js": 16, ieee754: 106 }], 52: [function (e, t, r) { t.exports = { 100: "Continue", 101: "Switching Protocols", 102: "Processing", 200: "OK", 201: "Created", 202: "Accepted", 203: "Non-Authoritative Information", 204: "No Content", 205: "Reset Content", 206: "Partial Content", 207: "Multi-Status", 208: "Already Reported", 226: "IM Used", 300: "Multiple Choices", 301: "Moved Permanently", 302: "Found", 303: "See Other", 304: "Not Modified", 305: "Use Proxy", 307: "Temporary Redirect", 308: "Permanent Redirect", 400: "Bad Request", 401: "Unauthorized", 402: "Payment Required", 403: "Forbidden", 404: "Not Found", 405: "Method Not Allowed", 406: "Not Acceptable", 407: "Proxy Authentication Required", 408: "Request Timeout", 409: "Conflict", 410: "Gone", 411: "Length Required", 412: "Precondition Failed", 413: "Payload Too Large", 414: "URI Too Long", 415: "Unsupported Media Type", 416: "Range Not Satisfiable", 417: "Expectation Failed", 418: "I'm a teapot", 421: "Misdirected Request", 422: "Unprocessable Entity", 423: "Locked", 424: "Failed Dependency", 425: "Unordered Collection", 426: "Upgrade Required", 428: "Precondition Required", 429: "Too Many Requests", 431: "Request Header Fields Too Large", 451: "Unavailable For Legal Reasons", 500: "Internal Server Error", 501: "Not Implemented", 502: "Bad Gateway", 503: "Service Unavailable", 504: "Gateway Timeout", 505: "HTTP Version Not Supported", 506: "Variant Also Negotiates", 507: "Insufficient Storage", 508: "Loop Detected", 509: "Bandwidth Limit Exceeded", 510: "Not Extended", 511: "Network Authentication Required" }; }, {}], 53: [function (e, t, r) { var n = e("safe-buffer").Buffer, i = e("stream").Transform, s = e("string_decoder").StringDecoder; function a(e) { i.call(this), this.hashMode = "string" == typeof e, this.hashMode ? this[e] = this._finalOrDigest : this.final = this._finalOrDigest, this._final && (this.__final = this._final, this._final = null), this._decoder = null, this._encoding = null; } e("inherits")(a, i), a.prototype.update = function (e, t, r) { "string" == typeof e && (e = n.from(e, t)); var i = this._update(e); return this.hashMode ? this : (r && (i = this._toString(i, r)), i); }, a.prototype.setAutoPadding = function () { }, a.prototype.getAuthTag = function () { throw new Error("trying to get auth tag in unsupported state"); }, a.prototype.setAuthTag = function () { throw new Error("trying to set auth tag in unsupported state"); }, a.prototype.setAAD = function () { throw new Error("trying to set aad in unsupported state"); }, a.prototype._transform = function (e, t, r) { var n; try {
            this.hashMode ? this._update(e) : this.push(this._update(e));
        }
        catch (e) {
            n = e;
        }
        finally {
            r(n);
        } }, a.prototype._flush = function (e) { var t; try {
            this.push(this.__final());
        }
        catch (e) {
            t = e;
        } e(t); }, a.prototype._finalOrDigest = function (e) { var t = this.__final() || n.alloc(0); return e && (t = this._toString(t, e, !0)), t; }, a.prototype._toString = function (e, t, r) { if (this._decoder || (this._decoder = new s(t), this._encoding = t), this._encoding !== t)
            throw new Error("can't switch encodings"); var n = this._decoder.write(e); return r && (n += this._decoder.end()), n; }, t.exports = a; }, { inherits: 108, "safe-buffer": 168, stream: 178, string_decoder: 183 }], 54: [function (e, t, r) { (function (e) { function t(e) { return Object.prototype.toString.call(e); } r.isArray = function (e) { return Array.isArray ? Array.isArray(e) : "[object Array]" === t(e); }, r.isBoolean = function (e) { return "boolean" == typeof e; }, r.isNull = function (e) { return null === e; }, r.isNullOrUndefined = function (e) { return null == e; }, r.isNumber = function (e) { return "number" == typeof e; }, r.isString = function (e) { return "string" == typeof e; }, r.isSymbol = function (e) { return "symbol" == typeof e; }, r.isUndefined = function (e) { return void 0 === e; }, r.isRegExp = function (e) { return "[object RegExp]" === t(e); }, r.isObject = function (e) { return "object" == typeof e && null !== e; }, r.isDate = function (e) { return "[object Date]" === t(e); }, r.isError = function (e) { return "[object Error]" === t(e) || e instanceof Error; }, r.isFunction = function (e) { return "function" == typeof e; }, r.isPrimitive = function (e) { return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || void 0 === e; }, r.isBuffer = e.isBuffer; }).call(this, { isBuffer: e("../../is-buffer/index.js") }); }, { "../../is-buffer/index.js": 109 }], 55: [function (e, t, r) { (function (r) { var n = e("elliptic"), i = e("bn.js"); t.exports = function (e) { return new a(e); }; var s = { secp256k1: { name: "secp256k1", byteLength: 32 }, secp224r1: { name: "p224", byteLength: 28 }, prime256v1: { name: "p256", byteLength: 32 }, prime192v1: { name: "p192", byteLength: 24 }, ed25519: { name: "ed25519", byteLength: 32 }, secp384r1: { name: "p384", byteLength: 48 }, secp521r1: { name: "p521", byteLength: 66 } }; function a(e) { this.curveType = s[e], this.curveType || (this.curveType = { name: e }), this.curve = new n.ec(this.curveType.name), this.keys = void 0; } function o(e, t, n) { Array.isArray(e) || (e = e.toArray()); var i = new r(e); if (n && i.length < n) {
            var s = new r(n - i.length);
            s.fill(0), i = r.concat([s, i]);
        } return t ? i.toString(t) : i; } s.p224 = s.secp224r1, s.p256 = s.secp256r1 = s.prime256v1, s.p192 = s.secp192r1 = s.prime192v1, s.p384 = s.secp384r1, s.p521 = s.secp521r1, a.prototype.generateKeys = function (e, t) { return this.keys = this.curve.genKeyPair(), this.getPublicKey(e, t); }, a.prototype.computeSecret = function (e, t, n) { return t = t || "utf8", r.isBuffer(e) || (e = new r(e, t)), o(this.curve.keyFromPublic(e).getPublic().mul(this.keys.getPrivate()).getX(), n, this.curveType.byteLength); }, a.prototype.getPublicKey = function (e, t) { var r = this.keys.getPublic("compressed" === t, !0); return "hybrid" === t && (r[r.length - 1] % 2 ? r[0] = 7 : r[0] = 6), o(r, e); }, a.prototype.getPrivateKey = function (e) { return o(this.keys.getPrivate(), e); }, a.prototype.setPublicKey = function (e, t) { return t = t || "utf8", r.isBuffer(e) || (e = new r(e, t)), this.keys._importPublic(e), this; }, a.prototype.setPrivateKey = function (e, t) { t = t || "utf8", r.isBuffer(e) || (e = new r(e, t)); var n = new i(e); return n = n.toString(16), this.keys._importPrivate(n), this; }; }).call(this, e("buffer").Buffer); }, { "bn.js": 17, buffer: 51, elliptic: 73 }], 56: [function (e, t, r) { (function (r) {
            "use strict";
            var n = e("inherits"), i = e("./md5"), s = e("ripemd160"), a = e("sha.js"), o = e("cipher-base");
            function f(e) { o.call(this, "digest"), this._hash = e, this.buffers = []; }
            function c(e) { o.call(this, "digest"), this._hash = e; }
            n(f, o), f.prototype._update = function (e) { this.buffers.push(e); }, f.prototype._final = function () { var e = r.concat(this.buffers), t = this._hash(e); return this.buffers = null, t; }, n(c, o), c.prototype._update = function (e) { this._hash.update(e); }, c.prototype._final = function () { return this._hash.digest(); }, t.exports = function (e) { return "md5" === (e = e.toLowerCase()) ? new f(i) : new c("rmd160" === e || "ripemd160" === e ? new s : a(e)); };
        }).call(this, e("buffer").Buffer); }, { "./md5": 58, buffer: 51, "cipher-base": 53, inherits: 108, ripemd160: 167, "sha.js": 170 }], 57: [function (e, t, r) { (function (e) {
            "use strict";
            var r = 4, n = new e(r);
            n.fill(0);
            t.exports = function (t, i) { var s = i(function (t) { if (t.length % r != 0) {
                var i = t.length + (r - t.length % r);
                t = e.concat([t, n], i);
            } for (var s = new Array(t.length >>> 2), a = 0, o = 0; a < t.length; a += r, o++)
                s[o] = t.readInt32LE(a); return s; }(t), 8 * t.length); t = new e(16); for (var a = 0; a < s.length; a++)
                t.writeInt32LE(s[a], a << 2, !0); return t; };
        }).call(this, e("buffer").Buffer); }, { buffer: 51 }], 58: [function (e, t, r) {
            "use strict";
            var n = e("./make-hash");
            function i(e, t) { e[t >> 5] |= 128 << t % 32, e[14 + (t + 64 >>> 9 << 4)] = t; for (var r = 1732584193, n = -271733879, i = -1732584194, s = 271733878, u = 0; u < e.length; u += 16) {
                var d = r, l = n, p = i, b = s;
                n = c(n = c(n = c(n = c(n = f(n = f(n = f(n = f(n = o(n = o(n = o(n = o(n = a(n = a(n = a(n = a(n, i = a(i, s = a(s, r = a(r, n, i, s, e[u + 0], 7, -680876936), n, i, e[u + 1], 12, -389564586), r, n, e[u + 2], 17, 606105819), s, r, e[u + 3], 22, -1044525330), i = a(i, s = a(s, r = a(r, n, i, s, e[u + 4], 7, -176418897), n, i, e[u + 5], 12, 1200080426), r, n, e[u + 6], 17, -1473231341), s, r, e[u + 7], 22, -45705983), i = a(i, s = a(s, r = a(r, n, i, s, e[u + 8], 7, 1770035416), n, i, e[u + 9], 12, -1958414417), r, n, e[u + 10], 17, -42063), s, r, e[u + 11], 22, -1990404162), i = a(i, s = a(s, r = a(r, n, i, s, e[u + 12], 7, 1804603682), n, i, e[u + 13], 12, -40341101), r, n, e[u + 14], 17, -1502002290), s, r, e[u + 15], 22, 1236535329), i = o(i, s = o(s, r = o(r, n, i, s, e[u + 1], 5, -165796510), n, i, e[u + 6], 9, -1069501632), r, n, e[u + 11], 14, 643717713), s, r, e[u + 0], 20, -373897302), i = o(i, s = o(s, r = o(r, n, i, s, e[u + 5], 5, -701558691), n, i, e[u + 10], 9, 38016083), r, n, e[u + 15], 14, -660478335), s, r, e[u + 4], 20, -405537848), i = o(i, s = o(s, r = o(r, n, i, s, e[u + 9], 5, 568446438), n, i, e[u + 14], 9, -1019803690), r, n, e[u + 3], 14, -187363961), s, r, e[u + 8], 20, 1163531501), i = o(i, s = o(s, r = o(r, n, i, s, e[u + 13], 5, -1444681467), n, i, e[u + 2], 9, -51403784), r, n, e[u + 7], 14, 1735328473), s, r, e[u + 12], 20, -1926607734), i = f(i, s = f(s, r = f(r, n, i, s, e[u + 5], 4, -378558), n, i, e[u + 8], 11, -2022574463), r, n, e[u + 11], 16, 1839030562), s, r, e[u + 14], 23, -35309556), i = f(i, s = f(s, r = f(r, n, i, s, e[u + 1], 4, -1530992060), n, i, e[u + 4], 11, 1272893353), r, n, e[u + 7], 16, -155497632), s, r, e[u + 10], 23, -1094730640), i = f(i, s = f(s, r = f(r, n, i, s, e[u + 13], 4, 681279174), n, i, e[u + 0], 11, -358537222), r, n, e[u + 3], 16, -722521979), s, r, e[u + 6], 23, 76029189), i = f(i, s = f(s, r = f(r, n, i, s, e[u + 9], 4, -640364487), n, i, e[u + 12], 11, -421815835), r, n, e[u + 15], 16, 530742520), s, r, e[u + 2], 23, -995338651), i = c(i, s = c(s, r = c(r, n, i, s, e[u + 0], 6, -198630844), n, i, e[u + 7], 10, 1126891415), r, n, e[u + 14], 15, -1416354905), s, r, e[u + 5], 21, -57434055), i = c(i, s = c(s, r = c(r, n, i, s, e[u + 12], 6, 1700485571), n, i, e[u + 3], 10, -1894986606), r, n, e[u + 10], 15, -1051523), s, r, e[u + 1], 21, -2054922799), i = c(i, s = c(s, r = c(r, n, i, s, e[u + 8], 6, 1873313359), n, i, e[u + 15], 10, -30611744), r, n, e[u + 6], 15, -1560198380), s, r, e[u + 13], 21, 1309151649), i = c(i, s = c(s, r = c(r, n, i, s, e[u + 4], 6, -145523070), n, i, e[u + 11], 10, -1120210379), r, n, e[u + 2], 15, 718787259), s, r, e[u + 9], 21, -343485551), r = h(r, d), n = h(n, l), i = h(i, p), s = h(s, b);
            } return [r, n, i, s]; }
            function s(e, t, r, n, i, s) { return h((a = h(h(t, e), h(n, s))) << (o = i) | a >>> 32 - o, r); var a, o; }
            function a(e, t, r, n, i, a, o) { return s(t & r | ~t & n, e, t, i, a, o); }
            function o(e, t, r, n, i, a, o) { return s(t & n | r & ~n, e, t, i, a, o); }
            function f(e, t, r, n, i, a, o) { return s(t ^ r ^ n, e, t, i, a, o); }
            function c(e, t, r, n, i, a, o) { return s(r ^ (t | ~n), e, t, i, a, o); }
            function h(e, t) { var r = (65535 & e) + (65535 & t); return (e >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r; }
            t.exports = function (e) { return n(e, i); };
        }, { "./make-hash": 57 }], 59: [function (e, t, r) {
            "use strict";
            var n = e("inherits"), i = e("./legacy"), s = e("cipher-base"), a = e("safe-buffer").Buffer, o = e("create-hash/md5"), f = e("ripemd160"), c = e("sha.js"), h = a.alloc(128);
            function u(e, t) { s.call(this, "digest"), "string" == typeof t && (t = a.from(t)); var r = "sha512" === e || "sha384" === e ? 128 : 64; (this._alg = e, this._key = t, t.length > r) ? t = ("rmd160" === e ? new f : c(e)).update(t).digest() : t.length < r && (t = a.concat([t, h], r)); for (var n = this._ipad = a.allocUnsafe(r), i = this._opad = a.allocUnsafe(r), o = 0; o < r; o++)
                n[o] = 54 ^ t[o], i[o] = 92 ^ t[o]; this._hash = "rmd160" === e ? new f : c(e), this._hash.update(n); }
            n(u, s), u.prototype._update = function (e) { this._hash.update(e); }, u.prototype._final = function () { var e = this._hash.digest(); return ("rmd160" === this._alg ? new f : c(this._alg)).update(this._opad).update(e).digest(); }, t.exports = function (e, t) { return "rmd160" === (e = e.toLowerCase()) || "ripemd160" === e ? new u("rmd160", t) : "md5" === e ? new i(o, t) : new u(e, t); };
        }, { "./legacy": 60, "cipher-base": 53, "create-hash/md5": 58, inherits: 108, ripemd160: 167, "safe-buffer": 168, "sha.js": 170 }], 60: [function (e, t, r) {
            "use strict";
            var n = e("inherits"), i = e("safe-buffer").Buffer, s = e("cipher-base"), a = i.alloc(128), o = 64;
            function f(e, t) { s.call(this, "digest"), "string" == typeof t && (t = i.from(t)), this._alg = e, this._key = t, t.length > o ? t = e(t) : t.length < o && (t = i.concat([t, a], o)); for (var r = this._ipad = i.allocUnsafe(o), n = this._opad = i.allocUnsafe(o), f = 0; f < o; f++)
                r[f] = 54 ^ t[f], n[f] = 92 ^ t[f]; this._hash = [r]; }
            n(f, s), f.prototype._update = function (e) { this._hash.push(e); }, f.prototype._final = function () { var e = this._alg(i.concat(this._hash)); return this._alg(i.concat([this._opad, e])); }, t.exports = f;
        }, { "cipher-base": 53, inherits: 108, "safe-buffer": 168 }], 61: [function (e, t, r) {
            "use strict";
            r.randomBytes = r.rng = r.pseudoRandomBytes = r.prng = e("randombytes"), r.createHash = r.Hash = e("create-hash"), r.createHmac = r.Hmac = e("create-hmac");
            var n = e("browserify-sign/algos"), i = Object.keys(n), s = ["sha1", "sha224", "sha256", "sha384", "sha512", "md5", "rmd160"].concat(i);
            r.getHashes = function () { return s; };
            var a = e("pbkdf2");
            r.pbkdf2 = a.pbkdf2, r.pbkdf2Sync = a.pbkdf2Sync;
            var o = e("browserify-cipher");
            r.Cipher = o.Cipher, r.createCipher = o.createCipher, r.Cipheriv = o.Cipheriv, r.createCipheriv = o.createCipheriv, r.Decipher = o.Decipher, r.createDecipher = o.createDecipher, r.Decipheriv = o.Decipheriv, r.createDecipheriv = o.createDecipheriv, r.getCiphers = o.getCiphers, r.listCiphers = o.listCiphers;
            var f = e("diffie-hellman");
            r.DiffieHellmanGroup = f.DiffieHellmanGroup, r.createDiffieHellmanGroup = f.createDiffieHellmanGroup, r.getDiffieHellman = f.getDiffieHellman, r.createDiffieHellman = f.createDiffieHellman, r.DiffieHellman = f.DiffieHellman;
            var c = e("browserify-sign");
            r.createSign = c.createSign, r.Sign = c.Sign, r.createVerify = c.createVerify, r.Verify = c.Verify, r.createECDH = e("create-ecdh");
            var h = e("public-encrypt");
            r.publicEncrypt = h.publicEncrypt, r.privateEncrypt = h.privateEncrypt, r.publicDecrypt = h.publicDecrypt, r.privateDecrypt = h.privateDecrypt;
            var u = e("randomfill");
            r.randomFill = u.randomFill, r.randomFillSync = u.randomFillSync, r.createCredentials = function () { throw new Error(["sorry, createCredentials is not implemented yet", "we accept pull requests", "https://github.com/crypto-browserify/crypto-browserify"].join("\n")); }, r.constants = { DH_CHECK_P_NOT_SAFE_PRIME: 2, DH_CHECK_P_NOT_PRIME: 1, DH_UNABLE_TO_CHECK_GENERATOR: 4, DH_NOT_SUITABLE_GENERATOR: 8, NPN_ENABLED: 1, ALPN_ENABLED: 1, RSA_PKCS1_PADDING: 1, RSA_SSLV23_PADDING: 2, RSA_NO_PADDING: 3, RSA_PKCS1_OAEP_PADDING: 4, RSA_X931_PADDING: 5, RSA_PKCS1_PSS_PADDING: 6, POINT_CONVERSION_COMPRESSED: 2, POINT_CONVERSION_UNCOMPRESSED: 4, POINT_CONVERSION_HYBRID: 6 };
        }, { "browserify-cipher": 37, "browserify-sign": 44, "browserify-sign/algos": 41, "create-ecdh": 55, "create-hash": 56, "create-hmac": 59, "diffie-hellman": 69, pbkdf2: 135, "public-encrypt": 142, randombytes: 152, randomfill: 153 }], 62: [function (require, module, exports) { var cycle = exports; cycle.decycle = function (e) {
            "use strict";
            var t = [], r = [];
            return function e(n, i) { var s, a, o; if (!("object" != typeof n || null === n || n instanceof Boolean || n instanceof Date || n instanceof Number || n instanceof RegExp || n instanceof String)) {
                for (s = 0; s < t.length; s += 1)
                    if (t[s] === n)
                        return { $ref: r[s] };
                if (t.push(n), r.push(i), "[object Array]" === Object.prototype.toString.apply(n))
                    for (o = [], s = 0; s < n.length; s += 1)
                        o[s] = e(n[s], i + "[" + s + "]");
                else
                    for (a in o = {}, n)
                        Object.prototype.hasOwnProperty.call(n, a) && (o[a] = e(n[a], i + "[" + JSON.stringify(a) + "]"));
                return o;
            } return n; }(e, "$");
        }, cycle.retrocycle = function retrocycle($) {
            "use strict";
            var px = /^\$(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/;
            return function rez(value) { var i, item, name, path; if (value && "object" == typeof value)
                if ("[object Array]" === Object.prototype.toString.apply(value))
                    for (i = 0; i < value.length; i += 1)
                        item = value[i], item && "object" == typeof item && (path = item.$ref, "string" == typeof path && px.test(path) ? value[i] = eval(path) : rez(item));
                else
                    for (name in value)
                        "object" == typeof value[name] && (item = value[name], item && (path = item.$ref, "string" == typeof path && px.test(path) ? value[name] = eval(path) : rez(item))); }($), $;
        }; }, {}], 63: [function (e, t, r) {
            "use strict";
            r.utils = e("./des/utils"), r.Cipher = e("./des/cipher"), r.DES = e("./des/des"), r.CBC = e("./des/cbc"), r.EDE = e("./des/ede");
        }, { "./des/cbc": 64, "./des/cipher": 65, "./des/des": 66, "./des/ede": 67, "./des/utils": 68 }], 64: [function (e, t, r) {
            "use strict";
            var n = e("minimalistic-assert"), i = e("inherits"), s = {};
            r.instantiate = function (e) { function t(t) { e.call(this, t), this._cbcInit(); } i(t, e); for (var r = Object.keys(s), n = 0; n < r.length; n++) {
                var a = r[n];
                t.prototype[a] = s[a];
            } return t.create = function (e) { return new t(e); }, t; }, s._cbcInit = function () { var e = new function (e) { n.equal(e.length, 8, "Invalid IV length"), this.iv = new Array(8); for (var t = 0; t < this.iv.length; t++)
                this.iv[t] = e[t]; }(this.options.iv); this._cbcState = e; }, s._update = function (e, t, r, n) { var i = this._cbcState, s = this.constructor.super_.prototype, a = i.iv; if ("encrypt" === this.type) {
                for (var o = 0; o < this.blockSize; o++)
                    a[o] ^= e[t + o];
                s._update.call(this, a, 0, r, n);
                for (o = 0; o < this.blockSize; o++)
                    a[o] = r[n + o];
            }
            else {
                s._update.call(this, e, t, r, n);
                for (o = 0; o < this.blockSize; o++)
                    r[n + o] ^= a[o];
                for (o = 0; o < this.blockSize; o++)
                    a[o] = e[t + o];
            } };
        }, { inherits: 108, "minimalistic-assert": 115 }], 65: [function (e, t, r) {
            "use strict";
            var n = e("minimalistic-assert");
            function i(e) { this.options = e, this.type = this.options.type, this.blockSize = 8, this._init(), this.buffer = new Array(this.blockSize), this.bufferOff = 0; }
            t.exports = i, i.prototype._init = function () { }, i.prototype.update = function (e) { return 0 === e.length ? [] : "decrypt" === this.type ? this._updateDecrypt(e) : this._updateEncrypt(e); }, i.prototype._buffer = function (e, t) { for (var r = Math.min(this.buffer.length - this.bufferOff, e.length - t), n = 0; n < r; n++)
                this.buffer[this.bufferOff + n] = e[t + n]; return this.bufferOff += r, r; }, i.prototype._flushBuffer = function (e, t) { return this._update(this.buffer, 0, e, t), this.bufferOff = 0, this.blockSize; }, i.prototype._updateEncrypt = function (e) { var t = 0, r = 0, n = (this.bufferOff + e.length) / this.blockSize | 0, i = new Array(n * this.blockSize); 0 !== this.bufferOff && (t += this._buffer(e, t), this.bufferOff === this.buffer.length && (r += this._flushBuffer(i, r))); for (var s = e.length - (e.length - t) % this.blockSize; t < s; t += this.blockSize)
                this._update(e, t, i, r), r += this.blockSize; for (; t < e.length; t++, this.bufferOff++)
                this.buffer[this.bufferOff] = e[t]; return i; }, i.prototype._updateDecrypt = function (e) { for (var t = 0, r = 0, n = Math.ceil((this.bufferOff + e.length) / this.blockSize) - 1, i = new Array(n * this.blockSize); n > 0; n--)
                t += this._buffer(e, t), r += this._flushBuffer(i, r); return t += this._buffer(e, t), i; }, i.prototype.final = function (e) { var t, r; return e && (t = this.update(e)), r = "encrypt" === this.type ? this._finalEncrypt() : this._finalDecrypt(), t ? t.concat(r) : r; }, i.prototype._pad = function (e, t) { if (0 === t)
                return !1; for (; t < e.length;)
                e[t++] = 0; return !0; }, i.prototype._finalEncrypt = function () { if (!this._pad(this.buffer, this.bufferOff))
                return []; var e = new Array(this.blockSize); return this._update(this.buffer, 0, e, 0), e; }, i.prototype._unpad = function (e) { return e; }, i.prototype._finalDecrypt = function () { n.equal(this.bufferOff, this.blockSize, "Not enough data to decrypt"); var e = new Array(this.blockSize); return this._flushBuffer(e, 0), this._unpad(e); };
        }, { "minimalistic-assert": 115 }], 66: [function (e, t, r) {
            "use strict";
            var n = e("minimalistic-assert"), i = e("inherits"), s = e("../des"), a = s.utils, o = s.Cipher;
            function f(e) { o.call(this, e); var t = new function () { this.tmp = new Array(2), this.keys = null; }; this._desState = t, this.deriveKeys(t, e.key); }
            i(f, o), t.exports = f, f.create = function (e) { return new f(e); };
            var c = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
            f.prototype.deriveKeys = function (e, t) { e.keys = new Array(32), n.equal(t.length, this.blockSize, "Invalid key length"); var r = a.readUInt32BE(t, 0), i = a.readUInt32BE(t, 4); a.pc1(r, i, e.tmp, 0), r = e.tmp[0], i = e.tmp[1]; for (var s = 0; s < e.keys.length; s += 2) {
                var o = c[s >>> 1];
                r = a.r28shl(r, o), i = a.r28shl(i, o), a.pc2(r, i, e.keys, s);
            } }, f.prototype._update = function (e, t, r, n) { var i = this._desState, s = a.readUInt32BE(e, t), o = a.readUInt32BE(e, t + 4); a.ip(s, o, i.tmp, 0), s = i.tmp[0], o = i.tmp[1], "encrypt" === this.type ? this._encrypt(i, s, o, i.tmp, 0) : this._decrypt(i, s, o, i.tmp, 0), s = i.tmp[0], o = i.tmp[1], a.writeUInt32BE(r, s, n), a.writeUInt32BE(r, o, n + 4); }, f.prototype._pad = function (e, t) { for (var r = e.length - t, n = t; n < e.length; n++)
                e[n] = r; return !0; }, f.prototype._unpad = function (e) { for (var t = e[e.length - 1], r = e.length - t; r < e.length; r++)
                n.equal(e[r], t); return e.slice(0, e.length - t); }, f.prototype._encrypt = function (e, t, r, n, i) { for (var s = t, o = r, f = 0; f < e.keys.length; f += 2) {
                var c = e.keys[f], h = e.keys[f + 1];
                a.expand(o, e.tmp, 0), c ^= e.tmp[0], h ^= e.tmp[1];
                var u = a.substitute(c, h), d = o;
                o = (s ^ a.permute(u)) >>> 0, s = d;
            } a.rip(o, s, n, i); }, f.prototype._decrypt = function (e, t, r, n, i) { for (var s = r, o = t, f = e.keys.length - 2; f >= 0; f -= 2) {
                var c = e.keys[f], h = e.keys[f + 1];
                a.expand(s, e.tmp, 0), c ^= e.tmp[0], h ^= e.tmp[1];
                var u = a.substitute(c, h), d = s;
                s = (o ^ a.permute(u)) >>> 0, o = d;
            } a.rip(s, o, n, i); };
        }, { "../des": 63, inherits: 108, "minimalistic-assert": 115 }], 67: [function (e, t, r) {
            "use strict";
            var n = e("minimalistic-assert"), i = e("inherits"), s = e("../des"), a = s.Cipher, o = s.DES;
            function f(e) { a.call(this, e); var t = new function (e, t) { n.equal(t.length, 24, "Invalid key length"); var r = t.slice(0, 8), i = t.slice(8, 16), s = t.slice(16, 24); this.ciphers = "encrypt" === e ? [o.create({ type: "encrypt", key: r }), o.create({ type: "decrypt", key: i }), o.create({ type: "encrypt", key: s })] : [o.create({ type: "decrypt", key: s }), o.create({ type: "encrypt", key: i }), o.create({ type: "decrypt", key: r })]; }(this.type, this.options.key); this._edeState = t; }
            i(f, a), t.exports = f, f.create = function (e) { return new f(e); }, f.prototype._update = function (e, t, r, n) { var i = this._edeState; i.ciphers[0]._update(e, t, r, n), i.ciphers[1]._update(r, n, r, n), i.ciphers[2]._update(r, n, r, n); }, f.prototype._pad = o.prototype._pad, f.prototype._unpad = o.prototype._unpad;
        }, { "../des": 63, inherits: 108, "minimalistic-assert": 115 }], 68: [function (e, t, r) {
            "use strict";
            r.readUInt32BE = function (e, t) { return (e[0 + t] << 24 | e[1 + t] << 16 | e[2 + t] << 8 | e[3 + t]) >>> 0; }, r.writeUInt32BE = function (e, t, r) { e[0 + r] = t >>> 24, e[1 + r] = t >>> 16 & 255, e[2 + r] = t >>> 8 & 255, e[3 + r] = 255 & t; }, r.ip = function (e, t, r, n) { for (var i = 0, s = 0, a = 6; a >= 0; a -= 2) {
                for (var o = 0; o <= 24; o += 8)
                    i <<= 1, i |= t >>> o + a & 1;
                for (o = 0; o <= 24; o += 8)
                    i <<= 1, i |= e >>> o + a & 1;
            } for (a = 6; a >= 0; a -= 2) {
                for (o = 1; o <= 25; o += 8)
                    s <<= 1, s |= t >>> o + a & 1;
                for (o = 1; o <= 25; o += 8)
                    s <<= 1, s |= e >>> o + a & 1;
            } r[n + 0] = i >>> 0, r[n + 1] = s >>> 0; }, r.rip = function (e, t, r, n) { for (var i = 0, s = 0, a = 0; a < 4; a++)
                for (var o = 24; o >= 0; o -= 8)
                    i <<= 1, i |= t >>> o + a & 1, i <<= 1, i |= e >>> o + a & 1; for (a = 4; a < 8; a++)
                for (o = 24; o >= 0; o -= 8)
                    s <<= 1, s |= t >>> o + a & 1, s <<= 1, s |= e >>> o + a & 1; r[n + 0] = i >>> 0, r[n + 1] = s >>> 0; }, r.pc1 = function (e, t, r, n) { for (var i = 0, s = 0, a = 7; a >= 5; a--) {
                for (var o = 0; o <= 24; o += 8)
                    i <<= 1, i |= t >> o + a & 1;
                for (o = 0; o <= 24; o += 8)
                    i <<= 1, i |= e >> o + a & 1;
            } for (o = 0; o <= 24; o += 8)
                i <<= 1, i |= t >> o + a & 1; for (a = 1; a <= 3; a++) {
                for (o = 0; o <= 24; o += 8)
                    s <<= 1, s |= t >> o + a & 1;
                for (o = 0; o <= 24; o += 8)
                    s <<= 1, s |= e >> o + a & 1;
            } for (o = 0; o <= 24; o += 8)
                s <<= 1, s |= e >> o + a & 1; r[n + 0] = i >>> 0, r[n + 1] = s >>> 0; }, r.r28shl = function (e, t) { return e << t & 268435455 | e >>> 28 - t; };
            var n = [14, 11, 17, 4, 27, 23, 25, 0, 13, 22, 7, 18, 5, 9, 16, 24, 2, 20, 12, 21, 1, 8, 15, 26, 15, 4, 25, 19, 9, 1, 26, 16, 5, 11, 23, 8, 12, 7, 17, 0, 22, 3, 10, 14, 6, 20, 27, 24];
            r.pc2 = function (e, t, r, i) { for (var s = 0, a = 0, o = n.length >>> 1, f = 0; f < o; f++)
                s <<= 1, s |= e >>> n[f] & 1; for (f = o; f < n.length; f++)
                a <<= 1, a |= t >>> n[f] & 1; r[i + 0] = s >>> 0, r[i + 1] = a >>> 0; }, r.expand = function (e, t, r) { var n = 0, i = 0; n = (1 & e) << 5 | e >>> 27; for (var s = 23; s >= 15; s -= 4)
                n <<= 6, n |= e >>> s & 63; for (s = 11; s >= 3; s -= 4)
                i |= e >>> s & 63, i <<= 6; i |= (31 & e) << 1 | e >>> 31, t[r + 0] = n >>> 0, t[r + 1] = i >>> 0; };
            var i = [14, 0, 4, 15, 13, 7, 1, 4, 2, 14, 15, 2, 11, 13, 8, 1, 3, 10, 10, 6, 6, 12, 12, 11, 5, 9, 9, 5, 0, 3, 7, 8, 4, 15, 1, 12, 14, 8, 8, 2, 13, 4, 6, 9, 2, 1, 11, 7, 15, 5, 12, 11, 9, 3, 7, 14, 3, 10, 10, 0, 5, 6, 0, 13, 15, 3, 1, 13, 8, 4, 14, 7, 6, 15, 11, 2, 3, 8, 4, 14, 9, 12, 7, 0, 2, 1, 13, 10, 12, 6, 0, 9, 5, 11, 10, 5, 0, 13, 14, 8, 7, 10, 11, 1, 10, 3, 4, 15, 13, 4, 1, 2, 5, 11, 8, 6, 12, 7, 6, 12, 9, 0, 3, 5, 2, 14, 15, 9, 10, 13, 0, 7, 9, 0, 14, 9, 6, 3, 3, 4, 15, 6, 5, 10, 1, 2, 13, 8, 12, 5, 7, 14, 11, 12, 4, 11, 2, 15, 8, 1, 13, 1, 6, 10, 4, 13, 9, 0, 8, 6, 15, 9, 3, 8, 0, 7, 11, 4, 1, 15, 2, 14, 12, 3, 5, 11, 10, 5, 14, 2, 7, 12, 7, 13, 13, 8, 14, 11, 3, 5, 0, 6, 6, 15, 9, 0, 10, 3, 1, 4, 2, 7, 8, 2, 5, 12, 11, 1, 12, 10, 4, 14, 15, 9, 10, 3, 6, 15, 9, 0, 0, 6, 12, 10, 11, 1, 7, 13, 13, 8, 15, 9, 1, 4, 3, 5, 14, 11, 5, 12, 2, 7, 8, 2, 4, 14, 2, 14, 12, 11, 4, 2, 1, 12, 7, 4, 10, 7, 11, 13, 6, 1, 8, 5, 5, 0, 3, 15, 15, 10, 13, 3, 0, 9, 14, 8, 9, 6, 4, 11, 2, 8, 1, 12, 11, 7, 10, 1, 13, 14, 7, 2, 8, 13, 15, 6, 9, 15, 12, 0, 5, 9, 6, 10, 3, 4, 0, 5, 14, 3, 12, 10, 1, 15, 10, 4, 15, 2, 9, 7, 2, 12, 6, 9, 8, 5, 0, 6, 13, 1, 3, 13, 4, 14, 14, 0, 7, 11, 5, 3, 11, 8, 9, 4, 14, 3, 15, 2, 5, 12, 2, 9, 8, 5, 12, 15, 3, 10, 7, 11, 0, 14, 4, 1, 10, 7, 1, 6, 13, 0, 11, 8, 6, 13, 4, 13, 11, 0, 2, 11, 14, 7, 15, 4, 0, 9, 8, 1, 13, 10, 3, 14, 12, 3, 9, 5, 7, 12, 5, 2, 10, 15, 6, 8, 1, 6, 1, 6, 4, 11, 11, 13, 13, 8, 12, 1, 3, 4, 7, 10, 14, 7, 10, 9, 15, 5, 6, 0, 8, 15, 0, 14, 5, 2, 9, 3, 2, 12, 13, 1, 2, 15, 8, 13, 4, 8, 6, 10, 15, 3, 11, 7, 1, 4, 10, 12, 9, 5, 3, 6, 14, 11, 5, 0, 0, 14, 12, 9, 7, 2, 7, 2, 11, 1, 4, 14, 1, 7, 9, 4, 12, 10, 14, 8, 2, 13, 0, 15, 6, 12, 10, 9, 13, 0, 15, 3, 3, 5, 5, 6, 8, 11];
            r.substitute = function (e, t) { for (var r = 0, n = 0; n < 4; n++) {
                r <<= 4, r |= i[64 * n + (e >>> 18 - 6 * n & 63)];
            } for (n = 0; n < 4; n++) {
                r <<= 4, r |= i[256 + 64 * n + (t >>> 18 - 6 * n & 63)];
            } return r >>> 0; };
            var s = [16, 25, 12, 11, 3, 20, 4, 15, 31, 17, 9, 6, 27, 14, 1, 22, 30, 24, 8, 18, 0, 5, 29, 23, 13, 19, 2, 26, 10, 21, 28, 7];
            r.permute = function (e) { for (var t = 0, r = 0; r < s.length; r++)
                t <<= 1, t |= e >>> s[r] & 1; return t >>> 0; }, r.padSplit = function (e, t, r) { for (var n = e.toString(2); n.length < t;)
                n = "0" + n; for (var i = [], s = 0; s < t; s += r)
                i.push(n.slice(s, s + r)); return i.join(" "); };
        }, {}], 69: [function (e, t, r) { (function (t) { var n = e("./lib/generatePrime"), i = e("./lib/primes.json"), s = e("./lib/dh"); var a = { binary: !0, hex: !0, base64: !0 }; r.DiffieHellmanGroup = r.createDiffieHellmanGroup = r.getDiffieHellman = function (e) { var r = new t(i[e].prime, "hex"), n = new t(i[e].gen, "hex"); return new s(r, n); }, r.createDiffieHellman = r.DiffieHellman = function e(r, i, o, f) { return t.isBuffer(i) || void 0 === a[i] ? e(r, "binary", i, o) : (i = i || "binary", f = f || "binary", o = o || new t([2]), t.isBuffer(o) || (o = new t(o, f)), "number" == typeof r ? new s(n(r, o), o, !0) : (t.isBuffer(r) || (r = new t(r, i)), new s(r, o, !0))); }; }).call(this, e("buffer").Buffer); }, { "./lib/dh": 70, "./lib/generatePrime": 71, "./lib/primes.json": 72, buffer: 51 }], 70: [function (e, t, r) { (function (r) { var n = e("bn.js"), i = new (e("miller-rabin")), s = new n(24), a = new n(11), o = new n(10), f = new n(3), c = new n(7), h = e("./generatePrime"), u = e("randombytes"); function d(e, t) { return t = t || "utf8", r.isBuffer(e) || (e = new r(e, t)), this._pub = new n(e), this; } function l(e, t) { return t = t || "utf8", r.isBuffer(e) || (e = new r(e, t)), this._priv = new n(e), this; } t.exports = b; var p = {}; function b(e, t, r) { this.setGenerator(t), this.__prime = new n(e), this._prime = n.mont(this.__prime), this._primeLen = e.length, this._pub = void 0, this._priv = void 0, this._primeCode = void 0, r ? (this.setPublicKey = d, this.setPrivateKey = l) : this._primeCode = 8; } function m(e, t) { var n = new r(e.toArray()); return t ? n.toString(t) : n; } Object.defineProperty(b.prototype, "verifyError", { enumerable: !0, get: function () { return "number" != typeof this._primeCode && (this._primeCode = function (e, t) { var r = t.toString("hex"), n = [r, e.toString(16)].join("_"); if (n in p)
                return p[n]; var u, d = 0; if (e.isEven() || !h.simpleSieve || !h.fermatTest(e) || !i.test(e))
                return d += 1, d += "02" === r || "05" === r ? 8 : 4, p[n] = d, d; switch (i.test(e.shrn(1)) || (d += 2), r) {
                case "02":
                    e.mod(s).cmp(a) && (d += 8);
                    break;
                case "05":
                    (u = e.mod(o)).cmp(f) && u.cmp(c) && (d += 8);
                    break;
                default: d += 4;
            } return p[n] = d, d; }(this.__prime, this.__gen)), this._primeCode; } }), b.prototype.generateKeys = function () { return this._priv || (this._priv = new n(u(this._primeLen))), this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed(), this.getPublicKey(); }, b.prototype.computeSecret = function (e) { var t = (e = (e = new n(e)).toRed(this._prime)).redPow(this._priv).fromRed(), i = new r(t.toArray()), s = this.getPrime(); if (i.length < s.length) {
            var a = new r(s.length - i.length);
            a.fill(0), i = r.concat([a, i]);
        } return i; }, b.prototype.getPublicKey = function (e) { return m(this._pub, e); }, b.prototype.getPrivateKey = function (e) { return m(this._priv, e); }, b.prototype.getPrime = function (e) { return m(this.__prime, e); }, b.prototype.getGenerator = function (e) { return m(this._gen, e); }, b.prototype.setGenerator = function (e, t) { return t = t || "utf8", r.isBuffer(e) || (e = new r(e, t)), this.__gen = e, this._gen = new n(e), this; }; }).call(this, e("buffer").Buffer); }, { "./generatePrime": 71, "bn.js": 17, buffer: 51, "miller-rabin": 114, randombytes: 152 }], 71: [function (e, t, r) { var n = e("randombytes"); t.exports = y, y.simpleSieve = m, y.fermatTest = g; var i = e("bn.js"), s = new i(24), a = new (e("miller-rabin")), o = new i(1), f = new i(2), c = new i(5), h = (new i(16), new i(8), new i(10)), u = new i(3), d = (new i(7), new i(11)), l = new i(4), p = (new i(12), null); function b() { if (null !== p)
            return p; var e = []; e[0] = 2; for (var t = 1, r = 3; r < 1048576; r += 2) {
            for (var n = Math.ceil(Math.sqrt(r)), i = 0; i < t && e[i] <= n && r % e[i] != 0; i++)
                ;
            t !== i && e[i] <= n || (e[t++] = r);
        } return p = e, e; } function m(e) { for (var t = b(), r = 0; r < t.length; r++)
            if (0 === e.modn(t[r]))
                return 0 === e.cmpn(t[r]); return !0; } function g(e) { var t = i.mont(e); return 0 === f.toRed(t).redPow(e.subn(1)).fromRed().cmpn(1); } function y(e, t) { if (e < 16)
            return new i(2 === t || 5 === t ? [140, 123] : [140, 39]); var r, p; for (t = new i(t);;) {
            for (r = new i(n(Math.ceil(e / 8))); r.bitLength() > e;)
                r.ishrn(1);
            if (r.isEven() && r.iadd(o), r.testn(1) || r.iadd(f), t.cmp(f)) {
                if (!t.cmp(c))
                    for (; r.mod(h).cmp(u);)
                        r.iadd(l);
            }
            else
                for (; r.mod(s).cmp(d);)
                    r.iadd(l);
            if (m(p = r.shrn(1)) && m(r) && g(p) && g(r) && a.test(p) && a.test(r))
                return r;
        } } }, { "bn.js": 17, "miller-rabin": 114, randombytes: 152 }], 72: [function (e, t, r) { t.exports = { modp1: { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff" }, modp2: { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff" }, modp5: { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff" }, modp14: { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff" }, modp15: { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff" }, modp16: { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff" }, modp17: { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff" }, modp18: { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff" } }; }, {}], 73: [function (e, t, r) {
            "use strict";
            var n = r;
            n.version = e("../package.json").version, n.utils = e("./elliptic/utils"), n.rand = e("brorand"), n.curve = e("./elliptic/curve"), n.curves = e("./elliptic/curves"), n.ec = e("./elliptic/ec"), n.eddsa = e("./elliptic/eddsa");
        }, { "../package.json": 88, "./elliptic/curve": 76, "./elliptic/curves": 79, "./elliptic/ec": 80, "./elliptic/eddsa": 83, "./elliptic/utils": 87, brorand: 18 }], 74: [function (e, t, r) {
            "use strict";
            var n = e("bn.js"), i = e("../../elliptic").utils, s = i.getNAF, a = i.getJSF, o = i.assert;
            function f(e, t) { this.type = e, this.p = new n(t.p, 16), this.red = t.prime ? n.red(t.prime) : n.mont(this.p), this.zero = new n(0).toRed(this.red), this.one = new n(1).toRed(this.red), this.two = new n(2).toRed(this.red), this.n = t.n && new n(t.n, 16), this.g = t.g && this.pointFromJSON(t.g, t.gRed), this._wnafT1 = new Array(4), this._wnafT2 = new Array(4), this._wnafT3 = new Array(4), this._wnafT4 = new Array(4); var r = this.n && this.p.div(this.n); !r || r.cmpn(100) > 0 ? this.redN = null : (this._maxwellTrick = !0, this.redN = this.n.toRed(this.red)); }
            function c(e, t) { this.curve = e, this.type = t, this.precomputed = null; }
            t.exports = f, f.prototype.point = function () { throw new Error("Not implemented"); }, f.prototype.validate = function () { throw new Error("Not implemented"); }, f.prototype._fixedNafMul = function (e, t) { o(e.precomputed); var r = e._getDoubles(), n = s(t, 1), i = (1 << r.step + 1) - (r.step % 2 == 0 ? 2 : 1); i /= 3; for (var a = [], f = 0; f < n.length; f += r.step) {
                var c = 0;
                for (t = f + r.step - 1; t >= f; t--)
                    c = (c << 1) + n[t];
                a.push(c);
            } for (var h = this.jpoint(null, null, null), u = this.jpoint(null, null, null), d = i; d > 0; d--) {
                for (f = 0; f < a.length; f++) {
                    (c = a[f]) === d ? u = u.mixedAdd(r.points[f]) : c === -d && (u = u.mixedAdd(r.points[f].neg()));
                }
                h = h.add(u);
            } return h.toP(); }, f.prototype._wnafMul = function (e, t) { var r = 4, n = e._getNAFPoints(r); r = n.wnd; for (var i = n.points, a = s(t, r), f = this.jpoint(null, null, null), c = a.length - 1; c >= 0; c--) {
                for (t = 0; c >= 0 && 0 === a[c]; c--)
                    t++;
                if (c >= 0 && t++, f = f.dblp(t), c < 0)
                    break;
                var h = a[c];
                o(0 !== h), f = "affine" === e.type ? h > 0 ? f.mixedAdd(i[h - 1 >> 1]) : f.mixedAdd(i[-h - 1 >> 1].neg()) : h > 0 ? f.add(i[h - 1 >> 1]) : f.add(i[-h - 1 >> 1].neg());
            } return "affine" === e.type ? f.toP() : f; }, f.prototype._wnafMulAdd = function (e, t, r, n, i) { for (var o = this._wnafT1, f = this._wnafT2, c = this._wnafT3, h = 0, u = 0; u < n; u++) {
                var d = (x = t[u])._getNAFPoints(e);
                o[u] = d.wnd, f[u] = d.points;
            } for (u = n - 1; u >= 1; u -= 2) {
                var l = u - 1, p = u;
                if (1 === o[l] && 1 === o[p]) {
                    var b = [t[l], null, null, t[p]];
                    0 === t[l].y.cmp(t[p].y) ? (b[1] = t[l].add(t[p]), b[2] = t[l].toJ().mixedAdd(t[p].neg())) : 0 === t[l].y.cmp(t[p].y.redNeg()) ? (b[1] = t[l].toJ().mixedAdd(t[p]), b[2] = t[l].add(t[p].neg())) : (b[1] = t[l].toJ().mixedAdd(t[p]), b[2] = t[l].toJ().mixedAdd(t[p].neg()));
                    var m = [-3, -1, -5, -7, 0, 7, 5, 1, 3], g = a(r[l], r[p]);
                    h = Math.max(g[0].length, h), c[l] = new Array(h), c[p] = new Array(h);
                    for (var y = 0; y < h; y++) {
                        var v = 0 | g[0][y], _ = 0 | g[1][y];
                        c[l][y] = m[3 * (v + 1) + (_ + 1)], c[p][y] = 0, f[l] = b;
                    }
                }
                else
                    c[l] = s(r[l], o[l]), c[p] = s(r[p], o[p]), h = Math.max(c[l].length, h), h = Math.max(c[p].length, h);
            } var w = this.jpoint(null, null, null), E = this._wnafT4; for (u = h; u >= 0; u--) {
                for (var k = 0; u >= 0;) {
                    var S = !0;
                    for (y = 0; y < n; y++)
                        E[y] = 0 | c[y][u], 0 !== E[y] && (S = !1);
                    if (!S)
                        break;
                    k++, u--;
                }
                if (u >= 0 && k++, w = w.dblp(k), u < 0)
                    break;
                for (y = 0; y < n; y++) {
                    var x, A = E[y];
                    0 !== A && (A > 0 ? x = f[y][A - 1 >> 1] : A < 0 && (x = f[y][-A - 1 >> 1].neg()), w = "affine" === x.type ? w.mixedAdd(x) : w.add(x));
                }
            } for (u = 0; u < n; u++)
                f[u] = null; return i ? w : w.toP(); }, f.BasePoint = c, c.prototype.eq = function () { throw new Error("Not implemented"); }, c.prototype.validate = function () { return this.curve.validate(this); }, f.prototype.decodePoint = function (e, t) { e = i.toArray(e, t); var r = this.p.byteLength(); if ((4 === e[0] || 6 === e[0] || 7 === e[0]) && e.length - 1 == 2 * r)
                return 6 === e[0] ? o(e[e.length - 1] % 2 == 0) : 7 === e[0] && o(e[e.length - 1] % 2 == 1), this.point(e.slice(1, 1 + r), e.slice(1 + r, 1 + 2 * r)); if ((2 === e[0] || 3 === e[0]) && e.length - 1 === r)
                return this.pointFromX(e.slice(1, 1 + r), 3 === e[0]); throw new Error("Unknown point format"); }, c.prototype.encodeCompressed = function (e) { return this.encode(e, !0); }, c.prototype._encode = function (e) { var t = this.curve.p.byteLength(), r = this.getX().toArray("be", t); return e ? [this.getY().isEven() ? 2 : 3].concat(r) : [4].concat(r, this.getY().toArray("be", t)); }, c.prototype.encode = function (e, t) { return i.encode(this._encode(t), e); }, c.prototype.precompute = function (e) { if (this.precomputed)
                return this; var t = { doubles: null, naf: null, beta: null }; return t.naf = this._getNAFPoints(8), t.doubles = this._getDoubles(4, e), t.beta = this._getBeta(), this.precomputed = t, this; }, c.prototype._hasDoubles = function (e) { if (!this.precomputed)
                return !1; var t = this.precomputed.doubles; return !!t && t.points.length >= Math.ceil((e.bitLength() + 1) / t.step); }, c.prototype._getDoubles = function (e, t) { if (this.precomputed && this.precomputed.doubles)
                return this.precomputed.doubles; for (var r = [this], n = this, i = 0; i < t; i += e) {
                for (var s = 0; s < e; s++)
                    n = n.dbl();
                r.push(n);
            } return { step: e, points: r }; }, c.prototype._getNAFPoints = function (e) { if (this.precomputed && this.precomputed.naf)
                return this.precomputed.naf; for (var t = [this], r = (1 << e) - 1, n = 1 === r ? null : this.dbl(), i = 1; i < r; i++)
                t[i] = t[i - 1].add(n); return { wnd: e, points: t }; }, c.prototype._getBeta = function () { return null; }, c.prototype.dblp = function (e) { for (var t = this, r = 0; r < e; r++)
                t = t.dbl(); return t; };
        }, { "../../elliptic": 73, "bn.js": 17 }], 75: [function (e, t, r) {
            "use strict";
            var n = e("../curve"), i = e("../../elliptic"), s = e("bn.js"), a = e("inherits"), o = n.base, f = i.utils.assert;
            function c(e) { this.twisted = 1 != (0 | e.a), this.mOneA = this.twisted && -1 == (0 | e.a), this.extended = this.mOneA, o.call(this, "edwards", e), this.a = new s(e.a, 16).umod(this.red.m), this.a = this.a.toRed(this.red), this.c = new s(e.c, 16).toRed(this.red), this.c2 = this.c.redSqr(), this.d = new s(e.d, 16).toRed(this.red), this.dd = this.d.redAdd(this.d), f(!this.twisted || 0 === this.c.fromRed().cmpn(1)), this.oneC = 1 == (0 | e.c); }
            function h(e, t, r, n, i) { o.BasePoint.call(this, e, "projective"), null === t && null === r && null === n ? (this.x = this.curve.zero, this.y = this.curve.one, this.z = this.curve.one, this.t = this.curve.zero, this.zOne = !0) : (this.x = new s(t, 16), this.y = new s(r, 16), this.z = n ? new s(n, 16) : this.curve.one, this.t = i && new s(i, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red)), this.zOne = this.z === this.curve.one, this.curve.extended && !this.t && (this.t = this.x.redMul(this.y), this.zOne || (this.t = this.t.redMul(this.z.redInvm())))); }
            a(c, o), t.exports = c, c.prototype._mulA = function (e) { return this.mOneA ? e.redNeg() : this.a.redMul(e); }, c.prototype._mulC = function (e) { return this.oneC ? e : this.c.redMul(e); }, c.prototype.jpoint = function (e, t, r, n) { return this.point(e, t, r, n); }, c.prototype.pointFromX = function (e, t) { (e = new s(e, 16)).red || (e = e.toRed(this.red)); var r = e.redSqr(), n = this.c2.redSub(this.a.redMul(r)), i = this.one.redSub(this.c2.redMul(this.d).redMul(r)), a = n.redMul(i.redInvm()), o = a.redSqrt(); if (0 !== o.redSqr().redSub(a).cmp(this.zero))
                throw new Error("invalid point"); var f = o.fromRed().isOdd(); return (t && !f || !t && f) && (o = o.redNeg()), this.point(e, o); }, c.prototype.pointFromY = function (e, t) { (e = new s(e, 16)).red || (e = e.toRed(this.red)); var r = e.redSqr(), n = r.redSub(this.one), i = r.redMul(this.d).redAdd(this.one), a = n.redMul(i.redInvm()); if (0 === a.cmp(this.zero)) {
                if (t)
                    throw new Error("invalid point");
                return this.point(this.zero, e);
            } var o = a.redSqrt(); if (0 !== o.redSqr().redSub(a).cmp(this.zero))
                throw new Error("invalid point"); return o.isOdd() !== t && (o = o.redNeg()), this.point(o, e); }, c.prototype.validate = function (e) { if (e.isInfinity())
                return !0; e.normalize(); var t = e.x.redSqr(), r = e.y.redSqr(), n = t.redMul(this.a).redAdd(r), i = this.c2.redMul(this.one.redAdd(this.d.redMul(t).redMul(r))); return 0 === n.cmp(i); }, a(h, o.BasePoint), c.prototype.pointFromJSON = function (e) { return h.fromJSON(this, e); }, c.prototype.point = function (e, t, r, n) { return new h(this, e, t, r, n); }, h.fromJSON = function (e, t) { return new h(e, t[0], t[1], t[2]); }, h.prototype.inspect = function () { return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">"; }, h.prototype.isInfinity = function () { return 0 === this.x.cmpn(0) && 0 === this.y.cmp(this.z); }, h.prototype._extDbl = function () { var e = this.x.redSqr(), t = this.y.redSqr(), r = this.z.redSqr(); r = r.redIAdd(r); var n = this.curve._mulA(e), i = this.x.redAdd(this.y).redSqr().redISub(e).redISub(t), s = n.redAdd(t), a = s.redSub(r), o = n.redSub(t), f = i.redMul(a), c = s.redMul(o), h = i.redMul(o), u = a.redMul(s); return this.curve.point(f, c, u, h); }, h.prototype._projDbl = function () { var e, t, r, n = this.x.redAdd(this.y).redSqr(), i = this.x.redSqr(), s = this.y.redSqr(); if (this.curve.twisted) {
                var a = (c = this.curve._mulA(i)).redAdd(s);
                if (this.zOne)
                    e = n.redSub(i).redSub(s).redMul(a.redSub(this.curve.two)), t = a.redMul(c.redSub(s)), r = a.redSqr().redSub(a).redSub(a);
                else {
                    var o = this.z.redSqr(), f = a.redSub(o).redISub(o);
                    e = n.redSub(i).redISub(s).redMul(f), t = a.redMul(c.redSub(s)), r = a.redMul(f);
                }
            }
            else {
                var c = i.redAdd(s);
                o = this.curve._mulC(this.c.redMul(this.z)).redSqr(), f = c.redSub(o).redSub(o);
                e = this.curve._mulC(n.redISub(c)).redMul(f), t = this.curve._mulC(c).redMul(i.redISub(s)), r = c.redMul(f);
            } return this.curve.point(e, t, r); }, h.prototype.dbl = function () { return this.isInfinity() ? this : this.curve.extended ? this._extDbl() : this._projDbl(); }, h.prototype._extAdd = function (e) { var t = this.y.redSub(this.x).redMul(e.y.redSub(e.x)), r = this.y.redAdd(this.x).redMul(e.y.redAdd(e.x)), n = this.t.redMul(this.curve.dd).redMul(e.t), i = this.z.redMul(e.z.redAdd(e.z)), s = r.redSub(t), a = i.redSub(n), o = i.redAdd(n), f = r.redAdd(t), c = s.redMul(a), h = o.redMul(f), u = s.redMul(f), d = a.redMul(o); return this.curve.point(c, h, d, u); }, h.prototype._projAdd = function (e) { var t, r, n = this.z.redMul(e.z), i = n.redSqr(), s = this.x.redMul(e.x), a = this.y.redMul(e.y), o = this.curve.d.redMul(s).redMul(a), f = i.redSub(o), c = i.redAdd(o), h = this.x.redAdd(this.y).redMul(e.x.redAdd(e.y)).redISub(s).redISub(a), u = n.redMul(f).redMul(h); return this.curve.twisted ? (t = n.redMul(c).redMul(a.redSub(this.curve._mulA(s))), r = f.redMul(c)) : (t = n.redMul(c).redMul(a.redSub(s)), r = this.curve._mulC(f).redMul(c)), this.curve.point(u, t, r); }, h.prototype.add = function (e) { return this.isInfinity() ? e : e.isInfinity() ? this : this.curve.extended ? this._extAdd(e) : this._projAdd(e); }, h.prototype.mul = function (e) { return this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve._wnafMul(this, e); }, h.prototype.mulAdd = function (e, t, r) { return this.curve._wnafMulAdd(1, [this, t], [e, r], 2, !1); }, h.prototype.jmulAdd = function (e, t, r) { return this.curve._wnafMulAdd(1, [this, t], [e, r], 2, !0); }, h.prototype.normalize = function () { if (this.zOne)
                return this; var e = this.z.redInvm(); return this.x = this.x.redMul(e), this.y = this.y.redMul(e), this.t && (this.t = this.t.redMul(e)), this.z = this.curve.one, this.zOne = !0, this; }, h.prototype.neg = function () { return this.curve.point(this.x.redNeg(), this.y, this.z, this.t && this.t.redNeg()); }, h.prototype.getX = function () { return this.normalize(), this.x.fromRed(); }, h.prototype.getY = function () { return this.normalize(), this.y.fromRed(); }, h.prototype.eq = function (e) { return this === e || 0 === this.getX().cmp(e.getX()) && 0 === this.getY().cmp(e.getY()); }, h.prototype.eqXToP = function (e) { var t = e.toRed(this.curve.red).redMul(this.z); if (0 === this.x.cmp(t))
                return !0; for (var r = e.clone(), n = this.curve.redN.redMul(this.z);;) {
                if (r.iadd(this.curve.n), r.cmp(this.curve.p) >= 0)
                    return !1;
                if (t.redIAdd(n), 0 === this.x.cmp(t))
                    return !0;
            } return !1; }, h.prototype.toP = h.prototype.normalize, h.prototype.mixedAdd = h.prototype.add;
        }, { "../../elliptic": 73, "../curve": 76, "bn.js": 17, inherits: 108 }], 76: [function (e, t, r) {
            "use strict";
            var n = r;
            n.base = e("./base"), n.short = e("./short"), n.mont = e("./mont"), n.edwards = e("./edwards");
        }, { "./base": 74, "./edwards": 75, "./mont": 77, "./short": 78 }], 77: [function (e, t, r) {
            "use strict";
            var n = e("../curve"), i = e("bn.js"), s = e("inherits"), a = n.base, o = e("../../elliptic").utils;
            function f(e) { a.call(this, "mont", e), this.a = new i(e.a, 16).toRed(this.red), this.b = new i(e.b, 16).toRed(this.red), this.i4 = new i(4).toRed(this.red).redInvm(), this.two = new i(2).toRed(this.red), this.a24 = this.i4.redMul(this.a.redAdd(this.two)); }
            function c(e, t, r) { a.BasePoint.call(this, e, "projective"), null === t && null === r ? (this.x = this.curve.one, this.z = this.curve.zero) : (this.x = new i(t, 16), this.z = new i(r, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red))); }
            s(f, a), t.exports = f, f.prototype.validate = function (e) { var t = e.normalize().x, r = t.redSqr(), n = r.redMul(t).redAdd(r.redMul(this.a)).redAdd(t); return 0 === n.redSqrt().redSqr().cmp(n); }, s(c, a.BasePoint), f.prototype.decodePoint = function (e, t) { return this.point(o.toArray(e, t), 1); }, f.prototype.point = function (e, t) { return new c(this, e, t); }, f.prototype.pointFromJSON = function (e) { return c.fromJSON(this, e); }, c.prototype.precompute = function () { }, c.prototype._encode = function () { return this.getX().toArray("be", this.curve.p.byteLength()); }, c.fromJSON = function (e, t) { return new c(e, t[0], t[1] || e.one); }, c.prototype.inspect = function () { return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">"; }, c.prototype.isInfinity = function () { return 0 === this.z.cmpn(0); }, c.prototype.dbl = function () { var e = this.x.redAdd(this.z).redSqr(), t = this.x.redSub(this.z).redSqr(), r = e.redSub(t), n = e.redMul(t), i = r.redMul(t.redAdd(this.curve.a24.redMul(r))); return this.curve.point(n, i); }, c.prototype.add = function () { throw new Error("Not supported on Montgomery curve"); }, c.prototype.diffAdd = function (e, t) { var r = this.x.redAdd(this.z), n = this.x.redSub(this.z), i = e.x.redAdd(e.z), s = e.x.redSub(e.z).redMul(r), a = i.redMul(n), o = t.z.redMul(s.redAdd(a).redSqr()), f = t.x.redMul(s.redISub(a).redSqr()); return this.curve.point(o, f); }, c.prototype.mul = function (e) { for (var t = e.clone(), r = this, n = this.curve.point(null, null), i = []; 0 !== t.cmpn(0); t.iushrn(1))
                i.push(t.andln(1)); for (var s = i.length - 1; s >= 0; s--)
                0 === i[s] ? (r = r.diffAdd(n, this), n = n.dbl()) : (n = r.diffAdd(n, this), r = r.dbl()); return n; }, c.prototype.mulAdd = function () { throw new Error("Not supported on Montgomery curve"); }, c.prototype.jumlAdd = function () { throw new Error("Not supported on Montgomery curve"); }, c.prototype.eq = function (e) { return 0 === this.getX().cmp(e.getX()); }, c.prototype.normalize = function () { return this.x = this.x.redMul(this.z.redInvm()), this.z = this.curve.one, this; }, c.prototype.getX = function () { return this.normalize(), this.x.fromRed(); };
        }, { "../../elliptic": 73, "../curve": 76, "bn.js": 17, inherits: 108 }], 78: [function (e, t, r) {
            "use strict";
            var n = e("../curve"), i = e("../../elliptic"), s = e("bn.js"), a = e("inherits"), o = n.base, f = i.utils.assert;
            function c(e) { o.call(this, "short", e), this.a = new s(e.a, 16).toRed(this.red), this.b = new s(e.b, 16).toRed(this.red), this.tinv = this.two.redInvm(), this.zeroA = 0 === this.a.fromRed().cmpn(0), this.threeA = 0 === this.a.fromRed().sub(this.p).cmpn(-3), this.endo = this._getEndomorphism(e), this._endoWnafT1 = new Array(4), this._endoWnafT2 = new Array(4); }
            function h(e, t, r, n) { o.BasePoint.call(this, e, "affine"), null === t && null === r ? (this.x = null, this.y = null, this.inf = !0) : (this.x = new s(t, 16), this.y = new s(r, 16), n && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.inf = !1); }
            function u(e, t, r, n) { o.BasePoint.call(this, e, "jacobian"), null === t && null === r && null === n ? (this.x = this.curve.one, this.y = this.curve.one, this.z = new s(0)) : (this.x = new s(t, 16), this.y = new s(r, 16), this.z = new s(n, 16)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.zOne = this.z === this.curve.one; }
            a(c, o), t.exports = c, c.prototype._getEndomorphism = function (e) { if (this.zeroA && this.g && this.n && 1 === this.p.modn(3)) {
                var t, r;
                if (e.beta)
                    t = new s(e.beta, 16).toRed(this.red);
                else {
                    var n = this._getEndoRoots(this.p);
                    t = (t = n[0].cmp(n[1]) < 0 ? n[0] : n[1]).toRed(this.red);
                }
                if (e.lambda)
                    r = new s(e.lambda, 16);
                else {
                    var i = this._getEndoRoots(this.n);
                    0 === this.g.mul(i[0]).x.cmp(this.g.x.redMul(t)) ? r = i[0] : (r = i[1], f(0 === this.g.mul(r).x.cmp(this.g.x.redMul(t))));
                }
                return { beta: t, lambda: r, basis: e.basis ? e.basis.map(function (e) { return { a: new s(e.a, 16), b: new s(e.b, 16) }; }) : this._getEndoBasis(r) };
            } }, c.prototype._getEndoRoots = function (e) { var t = e === this.p ? this.red : s.mont(e), r = new s(2).toRed(t).redInvm(), n = r.redNeg(), i = new s(3).toRed(t).redNeg().redSqrt().redMul(r); return [n.redAdd(i).fromRed(), n.redSub(i).fromRed()]; }, c.prototype._getEndoBasis = function (e) { for (var t, r, n, i, a, o, f, c, h, u = this.n.ushrn(Math.floor(this.n.bitLength() / 2)), d = e, l = this.n.clone(), p = new s(1), b = new s(0), m = new s(0), g = new s(1), y = 0; 0 !== d.cmpn(0);) {
                var v = l.div(d);
                c = l.sub(v.mul(d)), h = m.sub(v.mul(p));
                var _ = g.sub(v.mul(b));
                if (!n && c.cmp(u) < 0)
                    t = f.neg(), r = p, n = c.neg(), i = h;
                else if (n && 2 == ++y)
                    break;
                f = c, l = d, d = c, m = p, p = h, g = b, b = _;
            } a = c.neg(), o = h; var w = n.sqr().add(i.sqr()); return a.sqr().add(o.sqr()).cmp(w) >= 0 && (a = t, o = r), n.negative && (n = n.neg(), i = i.neg()), a.negative && (a = a.neg(), o = o.neg()), [{ a: n, b: i }, { a: a, b: o }]; }, c.prototype._endoSplit = function (e) { var t = this.endo.basis, r = t[0], n = t[1], i = n.b.mul(e).divRound(this.n), s = r.b.neg().mul(e).divRound(this.n), a = i.mul(r.a), o = s.mul(n.a), f = i.mul(r.b), c = s.mul(n.b); return { k1: e.sub(a).sub(o), k2: f.add(c).neg() }; }, c.prototype.pointFromX = function (e, t) { (e = new s(e, 16)).red || (e = e.toRed(this.red)); var r = e.redSqr().redMul(e).redIAdd(e.redMul(this.a)).redIAdd(this.b), n = r.redSqrt(); if (0 !== n.redSqr().redSub(r).cmp(this.zero))
                throw new Error("invalid point"); var i = n.fromRed().isOdd(); return (t && !i || !t && i) && (n = n.redNeg()), this.point(e, n); }, c.prototype.validate = function (e) { if (e.inf)
                return !0; var t = e.x, r = e.y, n = this.a.redMul(t), i = t.redSqr().redMul(t).redIAdd(n).redIAdd(this.b); return 0 === r.redSqr().redISub(i).cmpn(0); }, c.prototype._endoWnafMulAdd = function (e, t, r) { for (var n = this._endoWnafT1, i = this._endoWnafT2, s = 0; s < e.length; s++) {
                var a = this._endoSplit(t[s]), o = e[s], f = o._getBeta();
                a.k1.negative && (a.k1.ineg(), o = o.neg(!0)), a.k2.negative && (a.k2.ineg(), f = f.neg(!0)), n[2 * s] = o, n[2 * s + 1] = f, i[2 * s] = a.k1, i[2 * s + 1] = a.k2;
            } for (var c = this._wnafMulAdd(1, n, i, 2 * s, r), h = 0; h < 2 * s; h++)
                n[h] = null, i[h] = null; return c; }, a(h, o.BasePoint), c.prototype.point = function (e, t, r) { return new h(this, e, t, r); }, c.prototype.pointFromJSON = function (e, t) { return h.fromJSON(this, e, t); }, h.prototype._getBeta = function () { if (this.curve.endo) {
                var e = this.precomputed;
                if (e && e.beta)
                    return e.beta;
                var t = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
                if (e) {
                    var r = this.curve, n = function (e) { return r.point(e.x.redMul(r.endo.beta), e.y); };
                    e.beta = t, t.precomputed = { beta: null, naf: e.naf && { wnd: e.naf.wnd, points: e.naf.points.map(n) }, doubles: e.doubles && { step: e.doubles.step, points: e.doubles.points.map(n) } };
                }
                return t;
            } }, h.prototype.toJSON = function () { return this.precomputed ? [this.x, this.y, this.precomputed && { doubles: this.precomputed.doubles && { step: this.precomputed.doubles.step, points: this.precomputed.doubles.points.slice(1) }, naf: this.precomputed.naf && { wnd: this.precomputed.naf.wnd, points: this.precomputed.naf.points.slice(1) } }] : [this.x, this.y]; }, h.fromJSON = function (e, t, r) { "string" == typeof t && (t = JSON.parse(t)); var n = e.point(t[0], t[1], r); if (!t[2])
                return n; function i(t) { return e.point(t[0], t[1], r); } var s = t[2]; return n.precomputed = { beta: null, doubles: s.doubles && { step: s.doubles.step, points: [n].concat(s.doubles.points.map(i)) }, naf: s.naf && { wnd: s.naf.wnd, points: [n].concat(s.naf.points.map(i)) } }, n; }, h.prototype.inspect = function () { return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">"; }, h.prototype.isInfinity = function () { return this.inf; }, h.prototype.add = function (e) { if (this.inf)
                return e; if (e.inf)
                return this; if (this.eq(e))
                return this.dbl(); if (this.neg().eq(e))
                return this.curve.point(null, null); if (0 === this.x.cmp(e.x))
                return this.curve.point(null, null); var t = this.y.redSub(e.y); 0 !== t.cmpn(0) && (t = t.redMul(this.x.redSub(e.x).redInvm())); var r = t.redSqr().redISub(this.x).redISub(e.x), n = t.redMul(this.x.redSub(r)).redISub(this.y); return this.curve.point(r, n); }, h.prototype.dbl = function () { if (this.inf)
                return this; var e = this.y.redAdd(this.y); if (0 === e.cmpn(0))
                return this.curve.point(null, null); var t = this.curve.a, r = this.x.redSqr(), n = e.redInvm(), i = r.redAdd(r).redIAdd(r).redIAdd(t).redMul(n), s = i.redSqr().redISub(this.x.redAdd(this.x)), a = i.redMul(this.x.redSub(s)).redISub(this.y); return this.curve.point(s, a); }, h.prototype.getX = function () { return this.x.fromRed(); }, h.prototype.getY = function () { return this.y.fromRed(); }, h.prototype.mul = function (e) { return e = new s(e, 16), this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve.endo ? this.curve._endoWnafMulAdd([this], [e]) : this.curve._wnafMul(this, e); }, h.prototype.mulAdd = function (e, t, r) { var n = [this, t], i = [e, r]; return this.curve.endo ? this.curve._endoWnafMulAdd(n, i) : this.curve._wnafMulAdd(1, n, i, 2); }, h.prototype.jmulAdd = function (e, t, r) { var n = [this, t], i = [e, r]; return this.curve.endo ? this.curve._endoWnafMulAdd(n, i, !0) : this.curve._wnafMulAdd(1, n, i, 2, !0); }, h.prototype.eq = function (e) { return this === e || this.inf === e.inf && (this.inf || 0 === this.x.cmp(e.x) && 0 === this.y.cmp(e.y)); }, h.prototype.neg = function (e) { if (this.inf)
                return this; var t = this.curve.point(this.x, this.y.redNeg()); if (e && this.precomputed) {
                var r = this.precomputed, n = function (e) { return e.neg(); };
                t.precomputed = { naf: r.naf && { wnd: r.naf.wnd, points: r.naf.points.map(n) }, doubles: r.doubles && { step: r.doubles.step, points: r.doubles.points.map(n) } };
            } return t; }, h.prototype.toJ = function () { return this.inf ? this.curve.jpoint(null, null, null) : this.curve.jpoint(this.x, this.y, this.curve.one); }, a(u, o.BasePoint), c.prototype.jpoint = function (e, t, r) { return new u(this, e, t, r); }, u.prototype.toP = function () { if (this.isInfinity())
                return this.curve.point(null, null); var e = this.z.redInvm(), t = e.redSqr(), r = this.x.redMul(t), n = this.y.redMul(t).redMul(e); return this.curve.point(r, n); }, u.prototype.neg = function () { return this.curve.jpoint(this.x, this.y.redNeg(), this.z); }, u.prototype.add = function (e) { if (this.isInfinity())
                return e; if (e.isInfinity())
                return this; var t = e.z.redSqr(), r = this.z.redSqr(), n = this.x.redMul(t), i = e.x.redMul(r), s = this.y.redMul(t.redMul(e.z)), a = e.y.redMul(r.redMul(this.z)), o = n.redSub(i), f = s.redSub(a); if (0 === o.cmpn(0))
                return 0 !== f.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl(); var c = o.redSqr(), h = c.redMul(o), u = n.redMul(c), d = f.redSqr().redIAdd(h).redISub(u).redISub(u), l = f.redMul(u.redISub(d)).redISub(s.redMul(h)), p = this.z.redMul(e.z).redMul(o); return this.curve.jpoint(d, l, p); }, u.prototype.mixedAdd = function (e) { if (this.isInfinity())
                return e.toJ(); if (e.isInfinity())
                return this; var t = this.z.redSqr(), r = this.x, n = e.x.redMul(t), i = this.y, s = e.y.redMul(t).redMul(this.z), a = r.redSub(n), o = i.redSub(s); if (0 === a.cmpn(0))
                return 0 !== o.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl(); var f = a.redSqr(), c = f.redMul(a), h = r.redMul(f), u = o.redSqr().redIAdd(c).redISub(h).redISub(h), d = o.redMul(h.redISub(u)).redISub(i.redMul(c)), l = this.z.redMul(a); return this.curve.jpoint(u, d, l); }, u.prototype.dblp = function (e) { if (0 === e)
                return this; if (this.isInfinity())
                return this; if (!e)
                return this.dbl(); if (this.curve.zeroA || this.curve.threeA) {
                for (var t = this, r = 0; r < e; r++)
                    t = t.dbl();
                return t;
            } var n = this.curve.a, i = this.curve.tinv, s = this.x, a = this.y, o = this.z, f = o.redSqr().redSqr(), c = a.redAdd(a); for (r = 0; r < e; r++) {
                var h = s.redSqr(), u = c.redSqr(), d = u.redSqr(), l = h.redAdd(h).redIAdd(h).redIAdd(n.redMul(f)), p = s.redMul(u), b = l.redSqr().redISub(p.redAdd(p)), m = p.redISub(b), g = l.redMul(m);
                g = g.redIAdd(g).redISub(d);
                var y = c.redMul(o);
                r + 1 < e && (f = f.redMul(d)), s = b, o = y, c = g;
            } return this.curve.jpoint(s, c.redMul(i), o); }, u.prototype.dbl = function () { return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl(); }, u.prototype._zeroDbl = function () { var e, t, r; if (this.zOne) {
                var n = this.x.redSqr(), i = this.y.redSqr(), s = i.redSqr(), a = this.x.redAdd(i).redSqr().redISub(n).redISub(s);
                a = a.redIAdd(a);
                var o = n.redAdd(n).redIAdd(n), f = o.redSqr().redISub(a).redISub(a), c = s.redIAdd(s);
                c = (c = c.redIAdd(c)).redIAdd(c), e = f, t = o.redMul(a.redISub(f)).redISub(c), r = this.y.redAdd(this.y);
            }
            else {
                var h = this.x.redSqr(), u = this.y.redSqr(), d = u.redSqr(), l = this.x.redAdd(u).redSqr().redISub(h).redISub(d);
                l = l.redIAdd(l);
                var p = h.redAdd(h).redIAdd(h), b = p.redSqr(), m = d.redIAdd(d);
                m = (m = m.redIAdd(m)).redIAdd(m), e = b.redISub(l).redISub(l), t = p.redMul(l.redISub(e)).redISub(m), r = (r = this.y.redMul(this.z)).redIAdd(r);
            } return this.curve.jpoint(e, t, r); }, u.prototype._threeDbl = function () { var e, t, r; if (this.zOne) {
                var n = this.x.redSqr(), i = this.y.redSqr(), s = i.redSqr(), a = this.x.redAdd(i).redSqr().redISub(n).redISub(s);
                a = a.redIAdd(a);
                var o = n.redAdd(n).redIAdd(n).redIAdd(this.curve.a), f = o.redSqr().redISub(a).redISub(a);
                e = f;
                var c = s.redIAdd(s);
                c = (c = c.redIAdd(c)).redIAdd(c), t = o.redMul(a.redISub(f)).redISub(c), r = this.y.redAdd(this.y);
            }
            else {
                var h = this.z.redSqr(), u = this.y.redSqr(), d = this.x.redMul(u), l = this.x.redSub(h).redMul(this.x.redAdd(h));
                l = l.redAdd(l).redIAdd(l);
                var p = d.redIAdd(d), b = (p = p.redIAdd(p)).redAdd(p);
                e = l.redSqr().redISub(b), r = this.y.redAdd(this.z).redSqr().redISub(u).redISub(h);
                var m = u.redSqr();
                m = (m = (m = m.redIAdd(m)).redIAdd(m)).redIAdd(m), t = l.redMul(p.redISub(e)).redISub(m);
            } return this.curve.jpoint(e, t, r); }, u.prototype._dbl = function () { var e = this.curve.a, t = this.x, r = this.y, n = this.z, i = n.redSqr().redSqr(), s = t.redSqr(), a = r.redSqr(), o = s.redAdd(s).redIAdd(s).redIAdd(e.redMul(i)), f = t.redAdd(t), c = (f = f.redIAdd(f)).redMul(a), h = o.redSqr().redISub(c.redAdd(c)), u = c.redISub(h), d = a.redSqr(); d = (d = (d = d.redIAdd(d)).redIAdd(d)).redIAdd(d); var l = o.redMul(u).redISub(d), p = r.redAdd(r).redMul(n); return this.curve.jpoint(h, l, p); }, u.prototype.trpl = function () { if (!this.curve.zeroA)
                return this.dbl().add(this); var e = this.x.redSqr(), t = this.y.redSqr(), r = this.z.redSqr(), n = t.redSqr(), i = e.redAdd(e).redIAdd(e), s = i.redSqr(), a = this.x.redAdd(t).redSqr().redISub(e).redISub(n), o = (a = (a = (a = a.redIAdd(a)).redAdd(a).redIAdd(a)).redISub(s)).redSqr(), f = n.redIAdd(n); f = (f = (f = f.redIAdd(f)).redIAdd(f)).redIAdd(f); var c = i.redIAdd(a).redSqr().redISub(s).redISub(o).redISub(f), h = t.redMul(c); h = (h = h.redIAdd(h)).redIAdd(h); var u = this.x.redMul(o).redISub(h); u = (u = u.redIAdd(u)).redIAdd(u); var d = this.y.redMul(c.redMul(f.redISub(c)).redISub(a.redMul(o))); d = (d = (d = d.redIAdd(d)).redIAdd(d)).redIAdd(d); var l = this.z.redAdd(a).redSqr().redISub(r).redISub(o); return this.curve.jpoint(u, d, l); }, u.prototype.mul = function (e, t) { return e = new s(e, t), this.curve._wnafMul(this, e); }, u.prototype.eq = function (e) { if ("affine" === e.type)
                return this.eq(e.toJ()); if (this === e)
                return !0; var t = this.z.redSqr(), r = e.z.redSqr(); if (0 !== this.x.redMul(r).redISub(e.x.redMul(t)).cmpn(0))
                return !1; var n = t.redMul(this.z), i = r.redMul(e.z); return 0 === this.y.redMul(i).redISub(e.y.redMul(n)).cmpn(0); }, u.prototype.eqXToP = function (e) { var t = this.z.redSqr(), r = e.toRed(this.curve.red).redMul(t); if (0 === this.x.cmp(r))
                return !0; for (var n = e.clone(), i = this.curve.redN.redMul(t);;) {
                if (n.iadd(this.curve.n), n.cmp(this.curve.p) >= 0)
                    return !1;
                if (r.redIAdd(i), 0 === this.x.cmp(r))
                    return !0;
            } return !1; }, u.prototype.inspect = function () { return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">"; }, u.prototype.isInfinity = function () { return 0 === this.z.cmpn(0); };
        }, { "../../elliptic": 73, "../curve": 76, "bn.js": 17, inherits: 108 }], 79: [function (e, t, r) {
            "use strict";
            var n, i = r, s = e("hash.js"), a = e("../elliptic"), o = a.utils.assert;
            function f(e) { "short" === e.type ? this.curve = new a.curve.short(e) : "edwards" === e.type ? this.curve = new a.curve.edwards(e) : this.curve = new a.curve.mont(e), this.g = this.curve.g, this.n = this.curve.n, this.hash = e.hash, o(this.g.validate(), "Invalid curve"), o(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O"); }
            function c(e, t) { Object.defineProperty(i, e, { configurable: !0, enumerable: !0, get: function () { var r = new f(t); return Object.defineProperty(i, e, { configurable: !0, enumerable: !0, value: r }), r; } }); }
            i.PresetCurve = f, c("p192", { type: "short", prime: "p192", p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff", a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc", b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1", n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831", hash: s.sha256, gRed: !1, g: ["188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012", "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"] }), c("p224", { type: "short", prime: "p224", p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001", a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe", b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4", n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d", hash: s.sha256, gRed: !1, g: ["b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21", "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"] }), c("p256", { type: "short", prime: null, p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff", a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc", b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b", n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551", hash: s.sha256, gRed: !1, g: ["6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296", "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"] }), c("p384", { type: "short", prime: null, p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff", a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc", b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef", n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973", hash: s.sha384, gRed: !1, g: ["aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7", "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"] }), c("p521", { type: "short", prime: null, p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff", a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc", b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00", n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409", hash: s.sha512, gRed: !1, g: ["000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66", "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"] }), c("curve25519", { type: "mont", prime: "p25519", p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed", a: "76d06", b: "1", n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed", hash: s.sha256, gRed: !1, g: ["9"] }), c("ed25519", { type: "edwards", prime: "p25519", p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed", a: "-1", c: "1", d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3", n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed", hash: s.sha256, gRed: !1, g: ["216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a", "6666666666666666666666666666666666666666666666666666666666666658"] });
            try {
                n = e("./precomputed/secp256k1");
            }
            catch (e) {
                n = void 0;
            }
            c("secp256k1", { type: "short", prime: "k256", p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f", a: "0", b: "7", n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141", h: "1", hash: s.sha256, beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee", lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72", basis: [{ a: "3086d221a7d46bcde86c90e49284eb15", b: "-e4437ed6010e88286f547fa90abfe4c3" }, { a: "114ca50f7a8e2f3f657c1108d9d44cfd8", b: "3086d221a7d46bcde86c90e49284eb15" }], gRed: !1, g: ["79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", n] });
        }, { "../elliptic": 73, "./precomputed/secp256k1": 86, "hash.js": 92 }], 80: [function (e, t, r) {
            "use strict";
            var n = e("bn.js"), i = e("hmac-drbg"), s = e("../../elliptic"), a = s.utils.assert, o = e("./key"), f = e("./signature");
            function c(e) { if (!(this instanceof c))
                return new c(e); "string" == typeof e && (a(s.curves.hasOwnProperty(e), "Unknown curve " + e), e = s.curves[e]), e instanceof s.curves.PresetCurve && (e = { curve: e }), this.curve = e.curve.curve, this.n = this.curve.n, this.nh = this.n.ushrn(1), this.g = this.curve.g, this.g = e.curve.g, this.g.precompute(e.curve.n.bitLength() + 1), this.hash = e.hash || e.curve.hash; }
            t.exports = c, c.prototype.keyPair = function (e) { return new o(this, e); }, c.prototype.keyFromPrivate = function (e, t) { return o.fromPrivate(this, e, t); }, c.prototype.keyFromPublic = function (e, t) { return o.fromPublic(this, e, t); }, c.prototype.genKeyPair = function (e) { e || (e = {}); for (var t = new i({ hash: this.hash, pers: e.pers, persEnc: e.persEnc || "utf8", entropy: e.entropy || s.rand(this.hash.hmacStrength), entropyEnc: e.entropy && e.entropyEnc || "utf8", nonce: this.n.toArray() }), r = this.n.byteLength(), a = this.n.sub(new n(2));;) {
                var o = new n(t.generate(r));
                if (!(o.cmp(a) > 0))
                    return o.iaddn(1), this.keyFromPrivate(o);
            } }, c.prototype._truncateToN = function (e, t) { var r = 8 * e.byteLength() - this.n.bitLength(); return r > 0 && (e = e.ushrn(r)), !t && e.cmp(this.n) >= 0 ? e.sub(this.n) : e; }, c.prototype.sign = function (e, t, r, s) { "object" == typeof r && (s = r, r = null), s || (s = {}), t = this.keyFromPrivate(t, r), e = this._truncateToN(new n(e, 16)); for (var a = this.n.byteLength(), o = t.getPrivate().toArray("be", a), c = e.toArray("be", a), h = new i({ hash: this.hash, entropy: o, nonce: c, pers: s.pers, persEnc: s.persEnc || "utf8" }), u = this.n.sub(new n(1)), d = 0;; d++) {
                var l = s.k ? s.k(d) : new n(h.generate(this.n.byteLength()));
                if (!((l = this._truncateToN(l, !0)).cmpn(1) <= 0 || l.cmp(u) >= 0)) {
                    var p = this.g.mul(l);
                    if (!p.isInfinity()) {
                        var b = p.getX(), m = b.umod(this.n);
                        if (0 !== m.cmpn(0)) {
                            var g = l.invm(this.n).mul(m.mul(t.getPrivate()).iadd(e));
                            if (0 !== (g = g.umod(this.n)).cmpn(0)) {
                                var y = (p.getY().isOdd() ? 1 : 0) | (0 !== b.cmp(m) ? 2 : 0);
                                return s.canonical && g.cmp(this.nh) > 0 && (g = this.n.sub(g), y ^= 1), new f({ r: m, s: g, recoveryParam: y });
                            }
                        }
                    }
                }
            } }, c.prototype.verify = function (e, t, r, i) { e = this._truncateToN(new n(e, 16)), r = this.keyFromPublic(r, i); var s = (t = new f(t, "hex")).r, a = t.s; if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0)
                return !1; if (a.cmpn(1) < 0 || a.cmp(this.n) >= 0)
                return !1; var o, c = a.invm(this.n), h = c.mul(e).umod(this.n), u = c.mul(s).umod(this.n); return this.curve._maxwellTrick ? !(o = this.g.jmulAdd(h, r.getPublic(), u)).isInfinity() && o.eqXToP(s) : !(o = this.g.mulAdd(h, r.getPublic(), u)).isInfinity() && 0 === o.getX().umod(this.n).cmp(s); }, c.prototype.recoverPubKey = function (e, t, r, i) { a((3 & r) === r, "The recovery param is more than two bits"), t = new f(t, i); var s = this.n, o = new n(e), c = t.r, h = t.s, u = 1 & r, d = r >> 1; if (c.cmp(this.curve.p.umod(this.curve.n)) >= 0 && d)
                throw new Error("Unable to find sencond key candinate"); c = d ? this.curve.pointFromX(c.add(this.curve.n), u) : this.curve.pointFromX(c, u); var l = t.r.invm(s), p = s.sub(o).mul(l).umod(s), b = h.mul(l).umod(s); return this.g.mulAdd(p, c, b); }, c.prototype.getKeyRecoveryParam = function (e, t, r, n) { if (null !== (t = new f(t, n)).recoveryParam)
                return t.recoveryParam; for (var i = 0; i < 4; i++) {
                var s;
                try {
                    s = this.recoverPubKey(e, t, i);
                }
                catch (e) {
                    continue;
                }
                if (s.eq(r))
                    return i;
            } throw new Error("Unable to find valid recovery factor"); };
        }, { "../../elliptic": 73, "./key": 81, "./signature": 82, "bn.js": 17, "hmac-drbg": 104 }], 81: [function (e, t, r) {
            "use strict";
            var n = e("bn.js"), i = e("../../elliptic").utils.assert;
            function s(e, t) { this.ec = e, this.priv = null, this.pub = null, t.priv && this._importPrivate(t.priv, t.privEnc), t.pub && this._importPublic(t.pub, t.pubEnc); }
            t.exports = s, s.fromPublic = function (e, t, r) { return t instanceof s ? t : new s(e, { pub: t, pubEnc: r }); }, s.fromPrivate = function (e, t, r) { return t instanceof s ? t : new s(e, { priv: t, privEnc: r }); }, s.prototype.validate = function () { var e = this.getPublic(); return e.isInfinity() ? { result: !1, reason: "Invalid public key" } : e.validate() ? e.mul(this.ec.curve.n).isInfinity() ? { result: !0, reason: null } : { result: !1, reason: "Public key * N != O" } : { result: !1, reason: "Public key is not a point" }; }, s.prototype.getPublic = function (e, t) { return "string" == typeof e && (t = e, e = null), this.pub || (this.pub = this.ec.g.mul(this.priv)), t ? this.pub.encode(t, e) : this.pub; }, s.prototype.getPrivate = function (e) { return "hex" === e ? this.priv.toString(16, 2) : this.priv; }, s.prototype._importPrivate = function (e, t) { this.priv = new n(e, t || 16), this.priv = this.priv.umod(this.ec.curve.n); }, s.prototype._importPublic = function (e, t) { if (e.x || e.y)
                return "mont" === this.ec.curve.type ? i(e.x, "Need x coordinate") : "short" !== this.ec.curve.type && "edwards" !== this.ec.curve.type || i(e.x && e.y, "Need both x and y coordinate"), void (this.pub = this.ec.curve.point(e.x, e.y)); this.pub = this.ec.curve.decodePoint(e, t); }, s.prototype.derive = function (e) { return e.mul(this.priv).getX(); }, s.prototype.sign = function (e, t, r) { return this.ec.sign(e, this, t, r); }, s.prototype.verify = function (e, t) { return this.ec.verify(e, t, this); }, s.prototype.inspect = function () { return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >"; };
        }, { "../../elliptic": 73, "bn.js": 17 }], 82: [function (e, t, r) {
            "use strict";
            var n = e("bn.js"), i = e("../../elliptic").utils, s = i.assert;
            function a(e, t) { if (e instanceof a)
                return e; this._importDER(e, t) || (s(e.r && e.s, "Signature without r or s"), this.r = new n(e.r, 16), this.s = new n(e.s, 16), void 0 === e.recoveryParam ? this.recoveryParam = null : this.recoveryParam = e.recoveryParam); }
            function o(e, t) { var r = e[t.place++]; if (!(128 & r))
                return r; for (var n = 15 & r, i = 0, s = 0, a = t.place; s < n; s++, a++)
                i <<= 8, i |= e[a]; return t.place = a, i; }
            function f(e) { for (var t = 0, r = e.length - 1; !e[t] && !(128 & e[t + 1]) && t < r;)
                t++; return 0 === t ? e : e.slice(t); }
            function c(e, t) { if (t < 128)
                e.push(t);
            else {
                var r = 1 + (Math.log(t) / Math.LN2 >>> 3);
                for (e.push(128 | r); --r;)
                    e.push(t >>> (r << 3) & 255);
                e.push(t);
            } }
            t.exports = a, a.prototype._importDER = function (e, t) { e = i.toArray(e, t); var r = new function () { this.place = 0; }; if (48 !== e[r.place++])
                return !1; if (o(e, r) + r.place !== e.length)
                return !1; if (2 !== e[r.place++])
                return !1; var s = o(e, r), a = e.slice(r.place, s + r.place); if (r.place += s, 2 !== e[r.place++])
                return !1; var f = o(e, r); if (e.length !== f + r.place)
                return !1; var c = e.slice(r.place, f + r.place); return 0 === a[0] && 128 & a[1] && (a = a.slice(1)), 0 === c[0] && 128 & c[1] && (c = c.slice(1)), this.r = new n(a), this.s = new n(c), this.recoveryParam = null, !0; }, a.prototype.toDER = function (e) { var t = this.r.toArray(), r = this.s.toArray(); for (128 & t[0] && (t = [0].concat(t)), 128 & r[0] && (r = [0].concat(r)), t = f(t), r = f(r); !(r[0] || 128 & r[1]);)
                r = r.slice(1); var n = [2]; c(n, t.length), (n = n.concat(t)).push(2), c(n, r.length); var s = n.concat(r), a = [48]; return c(a, s.length), a = a.concat(s), i.encode(a, e); };
        }, { "../../elliptic": 73, "bn.js": 17 }], 83: [function (e, t, r) {
            "use strict";
            var n = e("hash.js"), i = e("../../elliptic"), s = i.utils, a = s.assert, o = s.parseBytes, f = e("./key"), c = e("./signature");
            function h(e) { if (a("ed25519" === e, "only tested with ed25519 so far"), !(this instanceof h))
                return new h(e); e = i.curves[e].curve; this.curve = e, this.g = e.g, this.g.precompute(e.n.bitLength() + 1), this.pointClass = e.point().constructor, this.encodingLength = Math.ceil(e.n.bitLength() / 8), this.hash = n.sha512; }
            t.exports = h, h.prototype.sign = function (e, t) { e = o(e); var r = this.keyFromSecret(t), n = this.hashInt(r.messagePrefix(), e), i = this.g.mul(n), s = this.encodePoint(i), a = this.hashInt(s, r.pubBytes(), e).mul(r.priv()), f = n.add(a).umod(this.curve.n); return this.makeSignature({ R: i, S: f, Rencoded: s }); }, h.prototype.verify = function (e, t, r) { e = o(e), t = this.makeSignature(t); var n = this.keyFromPublic(r), i = this.hashInt(t.Rencoded(), n.pubBytes(), e), s = this.g.mul(t.S()); return t.R().add(n.pub().mul(i)).eq(s); }, h.prototype.hashInt = function () { for (var e = this.hash(), t = 0; t < arguments.length; t++)
                e.update(arguments[t]); return s.intFromLE(e.digest()).umod(this.curve.n); }, h.prototype.keyFromPublic = function (e) { return f.fromPublic(this, e); }, h.prototype.keyFromSecret = function (e) { return f.fromSecret(this, e); }, h.prototype.makeSignature = function (e) { return e instanceof c ? e : new c(this, e); }, h.prototype.encodePoint = function (e) { var t = e.getY().toArray("le", this.encodingLength); return t[this.encodingLength - 1] |= e.getX().isOdd() ? 128 : 0, t; }, h.prototype.decodePoint = function (e) { var t = (e = s.parseBytes(e)).length - 1, r = e.slice(0, t).concat(-129 & e[t]), n = 0 != (128 & e[t]), i = s.intFromLE(r); return this.curve.pointFromY(i, n); }, h.prototype.encodeInt = function (e) { return e.toArray("le", this.encodingLength); }, h.prototype.decodeInt = function (e) { return s.intFromLE(e); }, h.prototype.isPoint = function (e) { return e instanceof this.pointClass; };
        }, { "../../elliptic": 73, "./key": 84, "./signature": 85, "hash.js": 92 }], 84: [function (e, t, r) {
            "use strict";
            var n = e("../../elliptic").utils, i = n.assert, s = n.parseBytes, a = n.cachedProperty;
            function o(e, t) { this.eddsa = e, this._secret = s(t.secret), e.isPoint(t.pub) ? this._pub = t.pub : this._pubBytes = s(t.pub); }
            o.fromPublic = function (e, t) { return t instanceof o ? t : new o(e, { pub: t }); }, o.fromSecret = function (e, t) { return t instanceof o ? t : new o(e, { secret: t }); }, o.prototype.secret = function () { return this._secret; }, a(o, "pubBytes", function () { return this.eddsa.encodePoint(this.pub()); }), a(o, "pub", function () { return this._pubBytes ? this.eddsa.decodePoint(this._pubBytes) : this.eddsa.g.mul(this.priv()); }), a(o, "privBytes", function () { var e = this.eddsa, t = this.hash(), r = e.encodingLength - 1, n = t.slice(0, e.encodingLength); return n[0] &= 248, n[r] &= 127, n[r] |= 64, n; }), a(o, "priv", function () { return this.eddsa.decodeInt(this.privBytes()); }), a(o, "hash", function () { return this.eddsa.hash().update(this.secret()).digest(); }), a(o, "messagePrefix", function () { return this.hash().slice(this.eddsa.encodingLength); }), o.prototype.sign = function (e) { return i(this._secret, "KeyPair can only verify"), this.eddsa.sign(e, this); }, o.prototype.verify = function (e, t) { return this.eddsa.verify(e, t, this); }, o.prototype.getSecret = function (e) { return i(this._secret, "KeyPair is public only"), n.encode(this.secret(), e); }, o.prototype.getPublic = function (e) { return n.encode(this.pubBytes(), e); }, t.exports = o;
        }, { "../../elliptic": 73 }], 85: [function (e, t, r) {
            "use strict";
            var n = e("bn.js"), i = e("../../elliptic").utils, s = i.assert, a = i.cachedProperty, o = i.parseBytes;
            function f(e, t) { this.eddsa = e, "object" != typeof t && (t = o(t)), Array.isArray(t) && (t = { R: t.slice(0, e.encodingLength), S: t.slice(e.encodingLength) }), s(t.R && t.S, "Signature without R or S"), e.isPoint(t.R) && (this._R = t.R), t.S instanceof n && (this._S = t.S), this._Rencoded = Array.isArray(t.R) ? t.R : t.Rencoded, this._Sencoded = Array.isArray(t.S) ? t.S : t.Sencoded; }
            a(f, "S", function () { return this.eddsa.decodeInt(this.Sencoded()); }), a(f, "R", function () { return this.eddsa.decodePoint(this.Rencoded()); }), a(f, "Rencoded", function () { return this.eddsa.encodePoint(this.R()); }), a(f, "Sencoded", function () { return this.eddsa.encodeInt(this.S()); }), f.prototype.toBytes = function () { return this.Rencoded().concat(this.Sencoded()); }, f.prototype.toHex = function () { return i.encode(this.toBytes(), "hex").toUpperCase(); }, t.exports = f;
        }, { "../../elliptic": 73, "bn.js": 17 }], 86: [function (e, t, r) { t.exports = { doubles: { step: 4, points: [["e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a", "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821"], ["8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508", "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf"], ["175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739", "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695"], ["363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640", "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9"], ["8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c", "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36"], ["723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda", "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f"], ["eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa", "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999"], ["100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0", "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09"], ["e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d", "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d"], ["feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d", "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088"], ["da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1", "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d"], ["53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0", "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8"], ["8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047", "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a"], ["385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862", "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453"], ["6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7", "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160"], ["3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd", "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0"], ["85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83", "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6"], ["948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a", "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589"], ["6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8", "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17"], ["e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d", "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda"], ["e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725", "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd"], ["213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754", "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2"], ["4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c", "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6"], ["fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6", "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f"], ["76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39", "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01"], ["c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891", "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3"], ["d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b", "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f"], ["b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03", "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7"], ["e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d", "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78"], ["a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070", "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1"], ["90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4", "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150"], ["8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da", "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82"], ["e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11", "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc"], ["8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e", "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b"], ["e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41", "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51"], ["b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef", "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45"], ["d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8", "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120"], ["324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d", "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84"], ["4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96", "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d"], ["9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd", "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d"], ["6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5", "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8"], ["a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266", "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8"], ["7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71", "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac"], ["928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac", "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f"], ["85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751", "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962"], ["ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e", "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907"], ["827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241", "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec"], ["eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3", "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d"], ["e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f", "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414"], ["1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19", "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd"], ["146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be", "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0"], ["fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9", "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811"], ["da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2", "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1"], ["a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13", "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c"], ["174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c", "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73"], ["959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba", "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd"], ["d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151", "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405"], ["64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073", "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589"], ["8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458", "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e"], ["13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b", "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27"], ["bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366", "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1"], ["8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa", "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482"], ["8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0", "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945"], ["dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787", "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573"], ["f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e", "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82"]] }, naf: { wnd: 7, points: [["f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9", "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672"], ["2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4", "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6"], ["5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc", "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da"], ["acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe", "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37"], ["774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb", "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b"], ["f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8", "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81"], ["d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e", "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58"], ["defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34", "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77"], ["2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c", "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a"], ["352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5", "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c"], ["2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f", "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67"], ["9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714", "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402"], ["daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729", "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55"], ["c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db", "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482"], ["6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4", "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82"], ["1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5", "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396"], ["605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479", "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49"], ["62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d", "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf"], ["80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f", "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a"], ["7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb", "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7"], ["d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9", "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933"], ["49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963", "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a"], ["77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74", "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6"], ["f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530", "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37"], ["463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b", "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e"], ["f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247", "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6"], ["caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1", "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476"], ["2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120", "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40"], ["7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435", "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61"], ["754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18", "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683"], ["e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8", "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5"], ["186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb", "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b"], ["df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f", "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417"], ["5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143", "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868"], ["290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba", "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a"], ["af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45", "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6"], ["766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a", "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996"], ["59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e", "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e"], ["f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8", "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d"], ["7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c", "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2"], ["948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519", "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e"], ["7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab", "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437"], ["3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca", "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311"], ["d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf", "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4"], ["1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610", "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575"], ["733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4", "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d"], ["15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c", "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d"], ["a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940", "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629"], ["e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980", "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06"], ["311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3", "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374"], ["34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf", "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee"], ["f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63", "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1"], ["d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448", "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b"], ["32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf", "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661"], ["7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5", "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6"], ["ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6", "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e"], ["16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5", "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d"], ["eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99", "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc"], ["78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51", "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4"], ["494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5", "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c"], ["a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5", "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b"], ["c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997", "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913"], ["841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881", "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154"], ["5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5", "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865"], ["36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66", "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc"], ["336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726", "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224"], ["8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede", "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e"], ["1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94", "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6"], ["85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31", "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511"], ["29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51", "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b"], ["a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252", "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2"], ["4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5", "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c"], ["d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b", "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3"], ["ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4", "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d"], ["af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f", "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700"], ["e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889", "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4"], ["591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246", "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196"], ["11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984", "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4"], ["3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a", "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257"], ["cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030", "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13"], ["c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197", "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096"], ["c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593", "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38"], ["a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef", "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f"], ["347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38", "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448"], ["da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a", "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a"], ["c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111", "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4"], ["4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502", "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437"], ["3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea", "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7"], ["cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26", "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d"], ["b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986", "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a"], ["d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e", "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54"], ["48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4", "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77"], ["dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda", "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517"], ["6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859", "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10"], ["e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f", "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125"], ["eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c", "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e"], ["13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942", "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1"], ["ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a", "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2"], ["b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80", "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423"], ["ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d", "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8"], ["8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1", "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758"], ["52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63", "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375"], ["e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352", "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d"], ["7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193", "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec"], ["5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00", "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0"], ["32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58", "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c"], ["e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7", "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4"], ["8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8", "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f"], ["4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e", "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649"], ["3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d", "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826"], ["674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b", "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5"], ["d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f", "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87"], ["30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6", "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b"], ["be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297", "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc"], ["93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a", "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c"], ["b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c", "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f"], ["d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52", "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a"], ["d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb", "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46"], ["463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065", "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f"], ["7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917", "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03"], ["74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9", "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08"], ["30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3", "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8"], ["9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57", "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373"], ["176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66", "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3"], ["75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8", "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8"], ["809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721", "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1"], ["1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180", "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9"]] } }; }, {}], 87: [function (e, t, r) {
            "use strict";
            var n = r, i = e("bn.js"), s = e("minimalistic-assert"), a = e("minimalistic-crypto-utils");
            n.assert = s, n.toArray = a.toArray, n.zero2 = a.zero2, n.toHex = a.toHex, n.encode = a.encode, n.getNAF = function (e, t) { for (var r = [], n = 1 << t + 1, i = e.clone(); i.cmpn(1) >= 0;) {
                var s;
                if (i.isOdd()) {
                    var a = i.andln(n - 1);
                    s = a > (n >> 1) - 1 ? (n >> 1) - a : a, i.isubn(s);
                }
                else
                    s = 0;
                r.push(s);
                for (var o = 0 !== i.cmpn(0) && 0 === i.andln(n - 1) ? t + 1 : 1, f = 1; f < o; f++)
                    r.push(0);
                i.iushrn(o);
            } return r; }, n.getJSF = function (e, t) { var r = [[], []]; e = e.clone(), t = t.clone(); for (var n = 0, i = 0; e.cmpn(-n) > 0 || t.cmpn(-i) > 0;) {
                var s, a, o, f = e.andln(3) + n & 3, c = t.andln(3) + i & 3;
                3 === f && (f = -1), 3 === c && (c = -1), s = 0 == (1 & f) ? 0 : 3 != (o = e.andln(7) + n & 7) && 5 !== o || 2 !== c ? f : -f, r[0].push(s), a = 0 == (1 & c) ? 0 : 3 != (o = t.andln(7) + i & 7) && 5 !== o || 2 !== f ? c : -c, r[1].push(a), 2 * n === s + 1 && (n = 1 - n), 2 * i === a + 1 && (i = 1 - i), e.iushrn(1), t.iushrn(1);
            } return r; }, n.cachedProperty = function (e, t, r) { var n = "_" + t; e.prototype[t] = function () { return void 0 !== this[n] ? this[n] : this[n] = r.call(this); }; }, n.parseBytes = function (e) { return "string" == typeof e ? n.toArray(e, "hex") : e; }, n.intFromLE = function (e) { return new i(e, "hex", "le"); };
        }, { "bn.js": 17, "minimalistic-assert": 115, "minimalistic-crypto-utils": 116 }], 88: [function (e, t, r) { t.exports = { _from: "elliptic@^6.0.0", _id: "elliptic@6.4.0", _inBundle: !1, _integrity: "sha1-ysmvh2LIWDYYcAPI3+GT5eLq5d8=", _location: "/elliptic", _phantomChildren: {}, _requested: { type: "range", registry: !0, raw: "elliptic@^6.0.0", name: "elliptic", escapedName: "elliptic", rawSpec: "^6.0.0", saveSpec: null, fetchSpec: "^6.0.0" }, _requiredBy: ["/browserify-sign", "/create-ecdh"], _resolved: "https://registry.npmjs.org/elliptic/-/elliptic-6.4.0.tgz", _shasum: "cac9af8762c85836187003c8dfe193e5e2eae5df", _spec: "elliptic@^6.0.0", _where: "/Users/Kasimir/Dropbox/RageMp/rage-console/node_modules/browserify-sign", author: { name: "Fedor Indutny", email: "fedor@indutny.com" }, bugs: { url: "https://github.com/indutny/elliptic/issues" }, bundleDependencies: !1, dependencies: { "bn.js": "^4.4.0", brorand: "^1.0.1", "hash.js": "^1.0.0", "hmac-drbg": "^1.0.0", inherits: "^2.0.1", "minimalistic-assert": "^1.0.0", "minimalistic-crypto-utils": "^1.0.0" }, deprecated: !1, description: "EC cryptography", devDependencies: { brfs: "^1.4.3", coveralls: "^2.11.3", grunt: "^0.4.5", "grunt-browserify": "^5.0.0", "grunt-cli": "^1.2.0", "grunt-contrib-connect": "^1.0.0", "grunt-contrib-copy": "^1.0.0", "grunt-contrib-uglify": "^1.0.1", "grunt-mocha-istanbul": "^3.0.1", "grunt-saucelabs": "^8.6.2", istanbul: "^0.4.2", jscs: "^2.9.0", jshint: "^2.6.0", mocha: "^2.1.0" }, files: ["lib"], homepage: "https://github.com/indutny/elliptic", keywords: ["EC", "Elliptic", "curve", "Cryptography"], license: "MIT", main: "lib/elliptic.js", name: "elliptic", repository: { type: "git", url: "git+ssh://git@github.com/indutny/elliptic.git" }, scripts: { jscs: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js", jshint: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js", lint: "npm run jscs && npm run jshint", test: "npm run lint && npm run unit", unit: "istanbul test _mocha --reporter=spec test/index.js", version: "grunt dist && git add dist/" }, version: "6.4.0" }; }, {}], 89: [function (e, t, r) { function n() { this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0; } function i(e) { return "function" == typeof e; } function s(e) { return "object" == typeof e && null !== e; } function a(e) { return void 0 === e; } t.exports = n, n.EventEmitter = n, n.prototype._events = void 0, n.prototype._maxListeners = void 0, n.defaultMaxListeners = 10, n.prototype.setMaxListeners = function (e) { if ("number" != typeof e || e < 0 || isNaN(e))
            throw TypeError("n must be a positive number"); return this._maxListeners = e, this; }, n.prototype.emit = function (e) { var t, r, n, o, f, c; if (this._events || (this._events = {}), "error" === e && (!this._events.error || s(this._events.error) && !this._events.error.length)) {
            if ((t = arguments[1]) instanceof Error)
                throw t;
            var h = new Error('Uncaught, unspecified "error" event. (' + t + ")");
            throw h.context = t, h;
        } if (a(r = this._events[e]))
            return !1; if (i(r))
            switch (arguments.length) {
                case 1:
                    r.call(this);
                    break;
                case 2:
                    r.call(this, arguments[1]);
                    break;
                case 3:
                    r.call(this, arguments[1], arguments[2]);
                    break;
                default: o = Array.prototype.slice.call(arguments, 1), r.apply(this, o);
            }
        else if (s(r))
            for (o = Array.prototype.slice.call(arguments, 1), n = (c = r.slice()).length, f = 0; f < n; f++)
                c[f].apply(this, o); return !0; }, n.prototype.addListener = function (e, t) { var r; if (!i(t))
            throw TypeError("listener must be a function"); return this._events || (this._events = {}), this._events.newListener && this.emit("newListener", e, i(t.listener) ? t.listener : t), this._events[e] ? s(this._events[e]) ? this._events[e].push(t) : this._events[e] = [this._events[e], t] : this._events[e] = t, s(this._events[e]) && !this._events[e].warned && (r = a(this._maxListeners) ? n.defaultMaxListeners : this._maxListeners) && r > 0 && this._events[e].length > r && (this._events[e].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length), "function" == typeof console.trace && console.trace()), this; }, n.prototype.on = n.prototype.addListener, n.prototype.once = function (e, t) { if (!i(t))
            throw TypeError("listener must be a function"); var r = !1; function n() { this.removeListener(e, n), r || (r = !0, t.apply(this, arguments)); } return n.listener = t, this.on(e, n), this; }, n.prototype.removeListener = function (e, t) { var r, n, a, o; if (!i(t))
            throw TypeError("listener must be a function"); if (!this._events || !this._events[e])
            return this; if (a = (r = this._events[e]).length, n = -1, r === t || i(r.listener) && r.listener === t)
            delete this._events[e], this._events.removeListener && this.emit("removeListener", e, t);
        else if (s(r)) {
            for (o = a; o-- > 0;)
                if (r[o] === t || r[o].listener && r[o].listener === t) {
                    n = o;
                    break;
                }
            if (n < 0)
                return this;
            1 === r.length ? (r.length = 0, delete this._events[e]) : r.splice(n, 1), this._events.removeListener && this.emit("removeListener", e, t);
        } return this; }, n.prototype.removeAllListeners = function (e) { var t, r; if (!this._events)
            return this; if (!this._events.removeListener)
            return 0 === arguments.length ? this._events = {} : this._events[e] && delete this._events[e], this; if (0 === arguments.length) {
            for (t in this._events)
                "removeListener" !== t && this.removeAllListeners(t);
            return this.removeAllListeners("removeListener"), this._events = {}, this;
        } if (i(r = this._events[e]))
            this.removeListener(e, r);
        else if (r)
            for (; r.length;)
                this.removeListener(e, r[r.length - 1]); return delete this._events[e], this; }, n.prototype.listeners = function (e) { return this._events && this._events[e] ? i(this._events[e]) ? [this._events[e]] : this._events[e].slice() : []; }, n.prototype.listenerCount = function (e) { if (this._events) {
            var t = this._events[e];
            if (i(t))
                return 1;
            if (t)
                return t.length;
        } return 0; }, n.listenerCount = function (e, t) { return e.listenerCount(t); }; }, {}], 90: [function (e, t, r) { var n = e("safe-buffer").Buffer, i = e("md5.js"); t.exports = function (e, t, r, s) { if (n.isBuffer(e) || (e = n.from(e, "binary")), t && (n.isBuffer(t) || (t = n.from(t, "binary")), 8 !== t.length))
            throw new RangeError("salt should be Buffer with 8 byte length"); for (var a = r / 8, o = n.alloc(a), f = n.alloc(s || 0), c = n.alloc(0); a > 0 || s > 0;) {
            var h = new i;
            h.update(c), h.update(e), t && h.update(t), c = h.digest();
            var u = 0;
            if (a > 0) {
                var d = o.length - a;
                u = Math.min(a, c.length), c.copy(o, d, 0, u), a -= u;
            }
            if (u < c.length && s > 0) {
                var l = f.length - s, p = Math.min(s, c.length - u);
                c.copy(f, l, u, u + p), s -= p;
            }
        } return c.fill(0), { key: o, iv: f }; }; }, { "md5.js": 112, "safe-buffer": 168 }], 91: [function (e, t, r) { (function (r) {
            "use strict";
            var n = e("stream").Transform;
            function i(e) { n.call(this), this._block = new r(e), this._blockSize = e, this._blockOffset = 0, this._length = [0, 0, 0, 0], this._finalized = !1; }
            e("inherits")(i, n), i.prototype._transform = function (e, t, n) { var i = null; try {
                "buffer" !== t && (e = new r(e, t)), this.update(e);
            }
            catch (e) {
                i = e;
            } n(i); }, i.prototype._flush = function (e) { var t = null; try {
                this.push(this._digest());
            }
            catch (e) {
                t = e;
            } e(t); }, i.prototype.update = function (e, t) { if (!r.isBuffer(e) && "string" != typeof e)
                throw new TypeError("Data must be a string or a buffer"); if (this._finalized)
                throw new Error("Digest already called"); r.isBuffer(e) || (e = new r(e, t || "binary")); for (var n = this._block, i = 0; this._blockOffset + e.length - i >= this._blockSize;) {
                for (var s = this._blockOffset; s < this._blockSize;)
                    n[s++] = e[i++];
                this._update(), this._blockOffset = 0;
            } for (; i < e.length;)
                n[this._blockOffset++] = e[i++]; for (var a = 0, o = 8 * e.length; o > 0; ++a)
                this._length[a] += o, (o = this._length[a] / 4294967296 | 0) > 0 && (this._length[a] -= 4294967296 * o); return this; }, i.prototype._update = function (e) { throw new Error("_update is not implemented"); }, i.prototype.digest = function (e) { if (this._finalized)
                throw new Error("Digest already called"); this._finalized = !0; var t = this._digest(); return void 0 !== e && (t = t.toString(e)), t; }, i.prototype._digest = function () { throw new Error("_digest is not implemented"); }, t.exports = i;
        }).call(this, e("buffer").Buffer); }, { buffer: 51, inherits: 108, stream: 178 }], 92: [function (e, t, r) { var n = r; n.utils = e("./hash/utils"), n.common = e("./hash/common"), n.sha = e("./hash/sha"), n.ripemd = e("./hash/ripemd"), n.hmac = e("./hash/hmac"), n.sha1 = n.sha.sha1, n.sha256 = n.sha.sha256, n.sha224 = n.sha.sha224, n.sha384 = n.sha.sha384, n.sha512 = n.sha.sha512, n.ripemd160 = n.ripemd.ripemd160; }, { "./hash/common": 93, "./hash/hmac": 94, "./hash/ripemd": 95, "./hash/sha": 96, "./hash/utils": 103 }], 93: [function (e, t, r) {
            "use strict";
            var n = e("./utils"), i = e("minimalistic-assert");
            function s() { this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32; }
            r.BlockHash = s, s.prototype.update = function (e, t) { if (e = n.toArray(e, t), this.pending ? this.pending = this.pending.concat(e) : this.pending = e, this.pendingTotal += e.length, this.pending.length >= this._delta8) {
                var r = (e = this.pending).length % this._delta8;
                this.pending = e.slice(e.length - r, e.length), 0 === this.pending.length && (this.pending = null), e = n.join32(e, 0, e.length - r, this.endian);
                for (var i = 0; i < e.length; i += this._delta32)
                    this._update(e, i, i + this._delta32);
            } return this; }, s.prototype.digest = function (e) { return this.update(this._pad()), i(null === this.pending), this._digest(e); }, s.prototype._pad = function () { var e = this.pendingTotal, t = this._delta8, r = t - (e + this.padLength) % t, n = new Array(r + this.padLength); n[0] = 128; for (var i = 1; i < r; i++)
                n[i] = 0; if (e <<= 3, "big" === this.endian) {
                for (var s = 8; s < this.padLength; s++)
                    n[i++] = 0;
                n[i++] = 0, n[i++] = 0, n[i++] = 0, n[i++] = 0, n[i++] = e >>> 24 & 255, n[i++] = e >>> 16 & 255, n[i++] = e >>> 8 & 255, n[i++] = 255 & e;
            }
            else
                for (n[i++] = 255 & e, n[i++] = e >>> 8 & 255, n[i++] = e >>> 16 & 255, n[i++] = e >>> 24 & 255, n[i++] = 0, n[i++] = 0, n[i++] = 0, n[i++] = 0, s = 8; s < this.padLength; s++)
                    n[i++] = 0; return n; };
        }, { "./utils": 103, "minimalistic-assert": 115 }], 94: [function (e, t, r) {
            "use strict";
            var n = e("./utils"), i = e("minimalistic-assert");
            function s(e, t, r) { if (!(this instanceof s))
                return new s(e, t, r); this.Hash = e, this.blockSize = e.blockSize / 8, this.outSize = e.outSize / 8, this.inner = null, this.outer = null, this._init(n.toArray(t, r)); }
            t.exports = s, s.prototype._init = function (e) { e.length > this.blockSize && (e = (new this.Hash).update(e).digest()), i(e.length <= this.blockSize); for (var t = e.length; t < this.blockSize; t++)
                e.push(0); for (t = 0; t < e.length; t++)
                e[t] ^= 54; for (this.inner = (new this.Hash).update(e), t = 0; t < e.length; t++)
                e[t] ^= 106; this.outer = (new this.Hash).update(e); }, s.prototype.update = function (e, t) { return this.inner.update(e, t), this; }, s.prototype.digest = function (e) { return this.outer.update(this.inner.digest()), this.outer.digest(e); };
        }, { "./utils": 103, "minimalistic-assert": 115 }], 95: [function (e, t, r) {
            "use strict";
            var n = e("./utils"), i = e("./common"), s = n.rotl32, a = n.sum32, o = n.sum32_3, f = n.sum32_4, c = i.BlockHash;
            function h() { if (!(this instanceof h))
                return new h; c.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.endian = "little"; }
            function u(e, t, r, n) { return e <= 15 ? t ^ r ^ n : e <= 31 ? t & r | ~t & n : e <= 47 ? (t | ~r) ^ n : e <= 63 ? t & n | r & ~n : t ^ (r | ~n); }
            function d(e) { return e <= 15 ? 0 : e <= 31 ? 1518500249 : e <= 47 ? 1859775393 : e <= 63 ? 2400959708 : 2840853838; }
            function l(e) { return e <= 15 ? 1352829926 : e <= 31 ? 1548603684 : e <= 47 ? 1836072691 : e <= 63 ? 2053994217 : 0; }
            n.inherits(h, c), r.ripemd160 = h, h.blockSize = 512, h.outSize = 160, h.hmacStrength = 192, h.padLength = 64, h.prototype._update = function (e, t) { for (var r = this.h[0], n = this.h[1], i = this.h[2], c = this.h[3], h = this.h[4], y = r, v = n, _ = i, w = c, E = h, k = 0; k < 80; k++) {
                var S = a(s(f(r, u(k, n, i, c), e[p[k] + t], d(k)), m[k]), h);
                r = h, h = c, c = s(i, 10), i = n, n = S, S = a(s(f(y, u(79 - k, v, _, w), e[b[k] + t], l(k)), g[k]), E), y = E, E = w, w = s(_, 10), _ = v, v = S;
            } S = o(this.h[1], i, w), this.h[1] = o(this.h[2], c, E), this.h[2] = o(this.h[3], h, y), this.h[3] = o(this.h[4], r, v), this.h[4] = o(this.h[0], n, _), this.h[0] = S; }, h.prototype._digest = function (e) { return "hex" === e ? n.toHex32(this.h, "little") : n.split32(this.h, "little"); };
            var p = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13], b = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11], m = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6], g = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11];
        }, { "./common": 93, "./utils": 103 }], 96: [function (e, t, r) {
            "use strict";
            r.sha1 = e("./sha/1"), r.sha224 = e("./sha/224"), r.sha256 = e("./sha/256"), r.sha384 = e("./sha/384"), r.sha512 = e("./sha/512");
        }, { "./sha/1": 97, "./sha/224": 98, "./sha/256": 99, "./sha/384": 100, "./sha/512": 101 }], 97: [function (e, t, r) {
            "use strict";
            var n = e("../utils"), i = e("../common"), s = e("./common"), a = n.rotl32, o = n.sum32, f = n.sum32_5, c = s.ft_1, h = i.BlockHash, u = [1518500249, 1859775393, 2400959708, 3395469782];
            function d() { if (!(this instanceof d))
                return new d; h.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.W = new Array(80); }
            n.inherits(d, h), t.exports = d, d.blockSize = 512, d.outSize = 160, d.hmacStrength = 80, d.padLength = 64, d.prototype._update = function (e, t) { for (var r = this.W, n = 0; n < 16; n++)
                r[n] = e[t + n]; for (; n < r.length; n++)
                r[n] = a(r[n - 3] ^ r[n - 8] ^ r[n - 14] ^ r[n - 16], 1); var i = this.h[0], s = this.h[1], h = this.h[2], d = this.h[3], l = this.h[4]; for (n = 0; n < r.length; n++) {
                var p = ~~(n / 20), b = f(a(i, 5), c(p, s, h, d), l, r[n], u[p]);
                l = d, d = h, h = a(s, 30), s = i, i = b;
            } this.h[0] = o(this.h[0], i), this.h[1] = o(this.h[1], s), this.h[2] = o(this.h[2], h), this.h[3] = o(this.h[3], d), this.h[4] = o(this.h[4], l); }, d.prototype._digest = function (e) { return "hex" === e ? n.toHex32(this.h, "big") : n.split32(this.h, "big"); };
        }, { "../common": 93, "../utils": 103, "./common": 102 }], 98: [function (e, t, r) {
            "use strict";
            var n = e("../utils"), i = e("./256");
            function s() { if (!(this instanceof s))
                return new s; i.call(this), this.h = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428]; }
            n.inherits(s, i), t.exports = s, s.blockSize = 512, s.outSize = 224, s.hmacStrength = 192, s.padLength = 64, s.prototype._digest = function (e) { return "hex" === e ? n.toHex32(this.h.slice(0, 7), "big") : n.split32(this.h.slice(0, 7), "big"); };
        }, { "../utils": 103, "./256": 99 }], 99: [function (e, t, r) {
            "use strict";
            var n = e("../utils"), i = e("../common"), s = e("./common"), a = e("minimalistic-assert"), o = n.sum32, f = n.sum32_4, c = n.sum32_5, h = s.ch32, u = s.maj32, d = s.s0_256, l = s.s1_256, p = s.g0_256, b = s.g1_256, m = i.BlockHash, g = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
            function y() { if (!(this instanceof y))
                return new y; m.call(this), this.h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], this.k = g, this.W = new Array(64); }
            n.inherits(y, m), t.exports = y, y.blockSize = 512, y.outSize = 256, y.hmacStrength = 192, y.padLength = 64, y.prototype._update = function (e, t) { for (var r = this.W, n = 0; n < 16; n++)
                r[n] = e[t + n]; for (; n < r.length; n++)
                r[n] = f(b(r[n - 2]), r[n - 7], p(r[n - 15]), r[n - 16]); var i = this.h[0], s = this.h[1], m = this.h[2], g = this.h[3], y = this.h[4], v = this.h[5], _ = this.h[6], w = this.h[7]; for (a(this.k.length === r.length), n = 0; n < r.length; n++) {
                var E = c(w, l(y), h(y, v, _), this.k[n], r[n]), k = o(d(i), u(i, s, m));
                w = _, _ = v, v = y, y = o(g, E), g = m, m = s, s = i, i = o(E, k);
            } this.h[0] = o(this.h[0], i), this.h[1] = o(this.h[1], s), this.h[2] = o(this.h[2], m), this.h[3] = o(this.h[3], g), this.h[4] = o(this.h[4], y), this.h[5] = o(this.h[5], v), this.h[6] = o(this.h[6], _), this.h[7] = o(this.h[7], w); }, y.prototype._digest = function (e) { return "hex" === e ? n.toHex32(this.h, "big") : n.split32(this.h, "big"); };
        }, { "../common": 93, "../utils": 103, "./common": 102, "minimalistic-assert": 115 }], 100: [function (e, t, r) {
            "use strict";
            var n = e("../utils"), i = e("./512");
            function s() { if (!(this instanceof s))
                return new s; i.call(this), this.h = [3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025, 3675008525, 1694076839, 1203062813, 3204075428]; }
            n.inherits(s, i), t.exports = s, s.blockSize = 1024, s.outSize = 384, s.hmacStrength = 192, s.padLength = 128, s.prototype._digest = function (e) { return "hex" === e ? n.toHex32(this.h.slice(0, 12), "big") : n.split32(this.h.slice(0, 12), "big"); };
        }, { "../utils": 103, "./512": 101 }], 101: [function (e, t, r) {
            "use strict";
            var n = e("../utils"), i = e("../common"), s = e("minimalistic-assert"), a = n.rotr64_hi, o = n.rotr64_lo, f = n.shr64_hi, c = n.shr64_lo, h = n.sum64, u = n.sum64_hi, d = n.sum64_lo, l = n.sum64_4_hi, p = n.sum64_4_lo, b = n.sum64_5_hi, m = n.sum64_5_lo, g = i.BlockHash, y = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591];
            function v() { if (!(this instanceof v))
                return new v; g.call(this), this.h = [1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209], this.k = y, this.W = new Array(160); }
            function _(e, t, r, n, i) { var s = e & r ^ ~e & i; return s < 0 && (s += 4294967296), s; }
            function w(e, t, r, n, i, s) { var a = t & n ^ ~t & s; return a < 0 && (a += 4294967296), a; }
            function E(e, t, r, n, i) { var s = e & r ^ e & i ^ r & i; return s < 0 && (s += 4294967296), s; }
            function k(e, t, r, n, i, s) { var a = t & n ^ t & s ^ n & s; return a < 0 && (a += 4294967296), a; }
            function S(e, t) { var r = a(e, t, 28) ^ a(t, e, 2) ^ a(t, e, 7); return r < 0 && (r += 4294967296), r; }
            function x(e, t) { var r = o(e, t, 28) ^ o(t, e, 2) ^ o(t, e, 7); return r < 0 && (r += 4294967296), r; }
            function A(e, t) { var r = a(e, t, 14) ^ a(e, t, 18) ^ a(t, e, 9); return r < 0 && (r += 4294967296), r; }
            function M(e, t) { var r = o(e, t, 14) ^ o(e, t, 18) ^ o(t, e, 9); return r < 0 && (r += 4294967296), r; }
            function I(e, t) { var r = a(e, t, 1) ^ a(e, t, 8) ^ f(e, t, 7); return r < 0 && (r += 4294967296), r; }
            function B(e, t) { var r = o(e, t, 1) ^ o(e, t, 8) ^ c(e, t, 7); return r < 0 && (r += 4294967296), r; }
            function j(e, t) { var r = a(e, t, 19) ^ a(t, e, 29) ^ f(e, t, 6); return r < 0 && (r += 4294967296), r; }
            function R(e, t) { var r = o(e, t, 19) ^ o(t, e, 29) ^ c(e, t, 6); return r < 0 && (r += 4294967296), r; }
            n.inherits(v, g), t.exports = v, v.blockSize = 1024, v.outSize = 512, v.hmacStrength = 192, v.padLength = 128, v.prototype._prepareBlock = function (e, t) { for (var r = this.W, n = 0; n < 32; n++)
                r[n] = e[t + n]; for (; n < r.length; n += 2) {
                var i = j(r[n - 4], r[n - 3]), s = R(r[n - 4], r[n - 3]), a = r[n - 14], o = r[n - 13], f = I(r[n - 30], r[n - 29]), c = B(r[n - 30], r[n - 29]), h = r[n - 32], u = r[n - 31];
                r[n] = l(i, s, a, o, f, c, h, u), r[n + 1] = p(i, s, a, o, f, c, h, u);
            } }, v.prototype._update = function (e, t) { this._prepareBlock(e, t); var r = this.W, n = this.h[0], i = this.h[1], a = this.h[2], o = this.h[3], f = this.h[4], c = this.h[5], l = this.h[6], p = this.h[7], g = this.h[8], y = this.h[9], v = this.h[10], I = this.h[11], B = this.h[12], j = this.h[13], R = this.h[14], T = this.h[15]; s(this.k.length === r.length); for (var C = 0; C < r.length; C += 2) {
                var O = R, z = T, L = A(g, y), N = M(g, y), P = _(g, y, v, I, B), D = w(g, y, v, I, B, j), U = this.k[C], q = this.k[C + 1], F = r[C], H = r[C + 1], Z = b(O, z, L, N, P, D, U, q, F, H), K = m(O, z, L, N, P, D, U, q, F, H);
                O = S(n, i), z = x(n, i), L = E(n, i, a, o, f), N = k(n, i, a, o, f, c);
                var W = u(O, z, L, N), G = d(O, z, L, N);
                R = B, T = j, B = v, j = I, v = g, I = y, g = u(l, p, Z, K), y = d(p, p, Z, K), l = f, p = c, f = a, c = o, a = n, o = i, n = u(Z, K, W, G), i = d(Z, K, W, G);
            } h(this.h, 0, n, i), h(this.h, 2, a, o), h(this.h, 4, f, c), h(this.h, 6, l, p), h(this.h, 8, g, y), h(this.h, 10, v, I), h(this.h, 12, B, j), h(this.h, 14, R, T); }, v.prototype._digest = function (e) { return "hex" === e ? n.toHex32(this.h, "big") : n.split32(this.h, "big"); };
        }, { "../common": 93, "../utils": 103, "minimalistic-assert": 115 }], 102: [function (e, t, r) {
            "use strict";
            var n = e("../utils").rotr32;
            function i(e, t, r) { return e & t ^ ~e & r; }
            function s(e, t, r) { return e & t ^ e & r ^ t & r; }
            function a(e, t, r) { return e ^ t ^ r; }
            r.ft_1 = function (e, t, r, n) { return 0 === e ? i(t, r, n) : 1 === e || 3 === e ? a(t, r, n) : 2 === e ? s(t, r, n) : void 0; }, r.ch32 = i, r.maj32 = s, r.p32 = a, r.s0_256 = function (e) { return n(e, 2) ^ n(e, 13) ^ n(e, 22); }, r.s1_256 = function (e) { return n(e, 6) ^ n(e, 11) ^ n(e, 25); }, r.g0_256 = function (e) { return n(e, 7) ^ n(e, 18) ^ e >>> 3; }, r.g1_256 = function (e) { return n(e, 17) ^ n(e, 19) ^ e >>> 10; };
        }, { "../utils": 103 }], 103: [function (e, t, r) {
            "use strict";
            var n = e("minimalistic-assert"), i = e("inherits");
            function s(e) { return (e >>> 24 | e >>> 8 & 65280 | e << 8 & 16711680 | (255 & e) << 24) >>> 0; }
            function a(e) { return 1 === e.length ? "0" + e : e; }
            function o(e) { return 7 === e.length ? "0" + e : 6 === e.length ? "00" + e : 5 === e.length ? "000" + e : 4 === e.length ? "0000" + e : 3 === e.length ? "00000" + e : 2 === e.length ? "000000" + e : 1 === e.length ? "0000000" + e : e; }
            r.inherits = i, r.toArray = function (e, t) { if (Array.isArray(e))
                return e.slice(); if (!e)
                return []; var r = []; if ("string" == typeof e)
                if (t) {
                    if ("hex" === t)
                        for ((e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e), n = 0; n < e.length; n += 2)
                            r.push(parseInt(e[n] + e[n + 1], 16));
                }
                else
                    for (var n = 0; n < e.length; n++) {
                        var i = e.charCodeAt(n), s = i >> 8, a = 255 & i;
                        s ? r.push(s, a) : r.push(a);
                    }
            else
                for (n = 0; n < e.length; n++)
                    r[n] = 0 | e[n]; return r; }, r.toHex = function (e) { for (var t = "", r = 0; r < e.length; r++)
                t += a(e[r].toString(16)); return t; }, r.htonl = s, r.toHex32 = function (e, t) { for (var r = "", n = 0; n < e.length; n++) {
                var i = e[n];
                "little" === t && (i = s(i)), r += o(i.toString(16));
            } return r; }, r.zero2 = a, r.zero8 = o, r.join32 = function (e, t, r, i) { var s = r - t; n(s % 4 == 0); for (var a = new Array(s / 4), o = 0, f = t; o < a.length; o++, f += 4) {
                var c;
                c = "big" === i ? e[f] << 24 | e[f + 1] << 16 | e[f + 2] << 8 | e[f + 3] : e[f + 3] << 24 | e[f + 2] << 16 | e[f + 1] << 8 | e[f], a[o] = c >>> 0;
            } return a; }, r.split32 = function (e, t) { for (var r = new Array(4 * e.length), n = 0, i = 0; n < e.length; n++, i += 4) {
                var s = e[n];
                "big" === t ? (r[i] = s >>> 24, r[i + 1] = s >>> 16 & 255, r[i + 2] = s >>> 8 & 255, r[i + 3] = 255 & s) : (r[i + 3] = s >>> 24, r[i + 2] = s >>> 16 & 255, r[i + 1] = s >>> 8 & 255, r[i] = 255 & s);
            } return r; }, r.rotr32 = function (e, t) { return e >>> t | e << 32 - t; }, r.rotl32 = function (e, t) { return e << t | e >>> 32 - t; }, r.sum32 = function (e, t) { return e + t >>> 0; }, r.sum32_3 = function (e, t, r) { return e + t + r >>> 0; }, r.sum32_4 = function (e, t, r, n) { return e + t + r + n >>> 0; }, r.sum32_5 = function (e, t, r, n, i) { return e + t + r + n + i >>> 0; }, r.sum64 = function (e, t, r, n) { var i = e[t], s = n + e[t + 1] >>> 0, a = (s < n ? 1 : 0) + r + i; e[t] = a >>> 0, e[t + 1] = s; }, r.sum64_hi = function (e, t, r, n) { return (t + n >>> 0 < t ? 1 : 0) + e + r >>> 0; }, r.sum64_lo = function (e, t, r, n) { return t + n >>> 0; }, r.sum64_4_hi = function (e, t, r, n, i, s, a, o) { var f = 0, c = t; return f += (c = c + n >>> 0) < t ? 1 : 0, f += (c = c + s >>> 0) < s ? 1 : 0, e + r + i + a + (f += (c = c + o >>> 0) < o ? 1 : 0) >>> 0; }, r.sum64_4_lo = function (e, t, r, n, i, s, a, o) { return t + n + s + o >>> 0; }, r.sum64_5_hi = function (e, t, r, n, i, s, a, o, f, c) { var h = 0, u = t; return h += (u = u + n >>> 0) < t ? 1 : 0, h += (u = u + s >>> 0) < s ? 1 : 0, h += (u = u + o >>> 0) < o ? 1 : 0, e + r + i + a + f + (h += (u = u + c >>> 0) < c ? 1 : 0) >>> 0; }, r.sum64_5_lo = function (e, t, r, n, i, s, a, o, f, c) { return t + n + s + o + c >>> 0; }, r.rotr64_hi = function (e, t, r) { return (t << 32 - r | e >>> r) >>> 0; }, r.rotr64_lo = function (e, t, r) { return (e << 32 - r | t >>> r) >>> 0; }, r.shr64_hi = function (e, t, r) { return e >>> r; }, r.shr64_lo = function (e, t, r) { return (e << 32 - r | t >>> r) >>> 0; };
        }, { inherits: 108, "minimalistic-assert": 115 }], 104: [function (e, t, r) {
            "use strict";
            var n = e("hash.js"), i = e("minimalistic-crypto-utils"), s = e("minimalistic-assert");
            function a(e) { if (!(this instanceof a))
                return new a(e); this.hash = e.hash, this.predResist = !!e.predResist, this.outLen = this.hash.outSize, this.minEntropy = e.minEntropy || this.hash.hmacStrength, this._reseed = null, this.reseedInterval = null, this.K = null, this.V = null; var t = i.toArray(e.entropy, e.entropyEnc || "hex"), r = i.toArray(e.nonce, e.nonceEnc || "hex"), n = i.toArray(e.pers, e.persEnc || "hex"); s(t.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._init(t, r, n); }
            t.exports = a, a.prototype._init = function (e, t, r) { var n = e.concat(t).concat(r); this.K = new Array(this.outLen / 8), this.V = new Array(this.outLen / 8); for (var i = 0; i < this.V.length; i++)
                this.K[i] = 0, this.V[i] = 1; this._update(n), this._reseed = 1, this.reseedInterval = 281474976710656; }, a.prototype._hmac = function () { return new n.hmac(this.hash, this.K); }, a.prototype._update = function (e) { var t = this._hmac().update(this.V).update([0]); e && (t = t.update(e)), this.K = t.digest(), this.V = this._hmac().update(this.V).digest(), e && (this.K = this._hmac().update(this.V).update([1]).update(e).digest(), this.V = this._hmac().update(this.V).digest()); }, a.prototype.reseed = function (e, t, r, n) { "string" != typeof t && (n = r, r = t, t = null), e = i.toArray(e, t), r = i.toArray(r, n), s(e.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._update(e.concat(r || [])), this._reseed = 1; }, a.prototype.generate = function (e, t, r, n) { if (this._reseed > this.reseedInterval)
                throw new Error("Reseed is required"); "string" != typeof t && (n = r, r = t, t = null), r && (r = i.toArray(r, n || "hex"), this._update(r)); for (var s = []; s.length < e;)
                this.V = this._hmac().update(this.V).digest(), s = s.concat(this.V); var a = s.slice(0, e); return this._update(r), this._reseed++, i.encode(a, t); };
        }, { "hash.js": 92, "minimalistic-assert": 115, "minimalistic-crypto-utils": 116 }], 105: [function (e, t, r) { var n = e("http"), i = e("url"), s = t.exports; for (var a in n)
            n.hasOwnProperty(a) && (s[a] = n[a]); function o(e) { if ("string" == typeof e && (e = i.parse(e)), e.protocol || (e.protocol = "https:"), "https:" !== e.protocol)
            throw new Error('Protocol "' + e.protocol + '" not supported. Expected "https:"'); return e; } s.request = function (e, t) { return e = o(e), n.request.call(this, e, t); }, s.get = function (e, t) { return e = o(e), n.get.call(this, e, t); }; }, { http: 179, url: 185 }], 106: [function (e, t, r) { r.read = function (e, t, r, n, i) { var s, a, o = 8 * i - n - 1, f = (1 << o) - 1, c = f >> 1, h = -7, u = r ? i - 1 : 0, d = r ? -1 : 1, l = e[t + u]; for (u += d, s = l & (1 << -h) - 1, l >>= -h, h += o; h > 0; s = 256 * s + e[t + u], u += d, h -= 8)
            ; for (a = s & (1 << -h) - 1, s >>= -h, h += n; h > 0; a = 256 * a + e[t + u], u += d, h -= 8)
            ; if (0 === s)
            s = 1 - c;
        else {
            if (s === f)
                return a ? NaN : 1 / 0 * (l ? -1 : 1);
            a += Math.pow(2, n), s -= c;
        } return (l ? -1 : 1) * a * Math.pow(2, s - n); }, r.write = function (e, t, r, n, i, s) { var a, o, f, c = 8 * s - i - 1, h = (1 << c) - 1, u = h >> 1, d = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0, l = n ? 0 : s - 1, p = n ? 1 : -1, b = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0; for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (o = isNaN(t) ? 1 : 0, a = h) : (a = Math.floor(Math.log(t) / Math.LN2), t * (f = Math.pow(2, -a)) < 1 && (a--, f *= 2), (t += a + u >= 1 ? d / f : d * Math.pow(2, 1 - u)) * f >= 2 && (a++, f /= 2), a + u >= h ? (o = 0, a = h) : a + u >= 1 ? (o = (t * f - 1) * Math.pow(2, i), a += u) : (o = t * Math.pow(2, u - 1) * Math.pow(2, i), a = 0)); i >= 8; e[r + l] = 255 & o, l += p, o /= 256, i -= 8)
            ; for (a = a << i | o, c += i; c > 0; e[r + l] = 255 & a, l += p, a /= 256, c -= 8)
            ; e[r + l - p] |= 128 * b; }; }, {}], 107: [function (e, t, r) { var n = [].indexOf; t.exports = function (e, t) { if (n)
            return e.indexOf(t); for (var r = 0; r < e.length; ++r)
            if (e[r] === t)
                return r; return -1; }; }, {}], 108: [function (e, t, r) { "function" == typeof Object.create ? t.exports = function (e, t) { e.super_ = t, e.prototype = Object.create(t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } }); } : t.exports = function (e, t) { e.super_ = t; var r = function () { }; r.prototype = t.prototype, e.prototype = new r, e.prototype.constructor = e; }; }, {}], 109: [function (e, t, r) { function n(e) { return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e); } t.exports = function (e) { return null != e && (n(e) || function (e) { return "function" == typeof e.readFloatLE && "function" == typeof e.slice && n(e.slice(0, 0)); }(e) || !!e._isBuffer); }; }, {}], 110: [function (e, t, r) { var n = {}.toString; t.exports = Array.isArray || function (e) { return "[object Array]" == n.call(e); }; }, {}], 111: [function (e, t, r) { var n = e("stream"); function i(e) { return e instanceof n.Stream; } function s(e) { return i(e) && "function" == typeof e._read && "object" == typeof e._readableState; } function a(e) { return i(e) && "function" == typeof e._write && "object" == typeof e._writableState; } t.exports = i, t.exports.isReadable = s, t.exports.isWritable = a, t.exports.isDuplex = function (e) { return s(e) && a(e); }; }, { stream: 178 }], 112: [function (e, t, r) { (function (r) {
            "use strict";
            var n = e("inherits"), i = e("hash-base"), s = new Array(16);
            function a() { i.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878; }
            function o(e, t) { return e << t | e >>> 32 - t; }
            function f(e, t, r, n, i, s, a) { return o(e + (t & r | ~t & n) + i + s | 0, a) + t | 0; }
            function c(e, t, r, n, i, s, a) { return o(e + (t & n | r & ~n) + i + s | 0, a) + t | 0; }
            function h(e, t, r, n, i, s, a) { return o(e + (t ^ r ^ n) + i + s | 0, a) + t | 0; }
            function u(e, t, r, n, i, s, a) { return o(e + (r ^ (t | ~n)) + i + s | 0, a) + t | 0; }
            n(a, i), a.prototype._update = function () { for (var e = s, t = 0; t < 16; ++t)
                e[t] = this._block.readInt32LE(4 * t); var r = this._a, n = this._b, i = this._c, a = this._d; n = u(n = u(n = u(n = u(n = h(n = h(n = h(n = h(n = c(n = c(n = c(n = c(n = f(n = f(n = f(n = f(n, i = f(i, a = f(a, r = f(r, n, i, a, e[0], 3614090360, 7), n, i, e[1], 3905402710, 12), r, n, e[2], 606105819, 17), a, r, e[3], 3250441966, 22), i = f(i, a = f(a, r = f(r, n, i, a, e[4], 4118548399, 7), n, i, e[5], 1200080426, 12), r, n, e[6], 2821735955, 17), a, r, e[7], 4249261313, 22), i = f(i, a = f(a, r = f(r, n, i, a, e[8], 1770035416, 7), n, i, e[9], 2336552879, 12), r, n, e[10], 4294925233, 17), a, r, e[11], 2304563134, 22), i = f(i, a = f(a, r = f(r, n, i, a, e[12], 1804603682, 7), n, i, e[13], 4254626195, 12), r, n, e[14], 2792965006, 17), a, r, e[15], 1236535329, 22), i = c(i, a = c(a, r = c(r, n, i, a, e[1], 4129170786, 5), n, i, e[6], 3225465664, 9), r, n, e[11], 643717713, 14), a, r, e[0], 3921069994, 20), i = c(i, a = c(a, r = c(r, n, i, a, e[5], 3593408605, 5), n, i, e[10], 38016083, 9), r, n, e[15], 3634488961, 14), a, r, e[4], 3889429448, 20), i = c(i, a = c(a, r = c(r, n, i, a, e[9], 568446438, 5), n, i, e[14], 3275163606, 9), r, n, e[3], 4107603335, 14), a, r, e[8], 1163531501, 20), i = c(i, a = c(a, r = c(r, n, i, a, e[13], 2850285829, 5), n, i, e[2], 4243563512, 9), r, n, e[7], 1735328473, 14), a, r, e[12], 2368359562, 20), i = h(i, a = h(a, r = h(r, n, i, a, e[5], 4294588738, 4), n, i, e[8], 2272392833, 11), r, n, e[11], 1839030562, 16), a, r, e[14], 4259657740, 23), i = h(i, a = h(a, r = h(r, n, i, a, e[1], 2763975236, 4), n, i, e[4], 1272893353, 11), r, n, e[7], 4139469664, 16), a, r, e[10], 3200236656, 23), i = h(i, a = h(a, r = h(r, n, i, a, e[13], 681279174, 4), n, i, e[0], 3936430074, 11), r, n, e[3], 3572445317, 16), a, r, e[6], 76029189, 23), i = h(i, a = h(a, r = h(r, n, i, a, e[9], 3654602809, 4), n, i, e[12], 3873151461, 11), r, n, e[15], 530742520, 16), a, r, e[2], 3299628645, 23), i = u(i, a = u(a, r = u(r, n, i, a, e[0], 4096336452, 6), n, i, e[7], 1126891415, 10), r, n, e[14], 2878612391, 15), a, r, e[5], 4237533241, 21), i = u(i, a = u(a, r = u(r, n, i, a, e[12], 1700485571, 6), n, i, e[3], 2399980690, 10), r, n, e[10], 4293915773, 15), a, r, e[1], 2240044497, 21), i = u(i, a = u(a, r = u(r, n, i, a, e[8], 1873313359, 6), n, i, e[15], 4264355552, 10), r, n, e[6], 2734768916, 15), a, r, e[13], 1309151649, 21), i = u(i, a = u(a, r = u(r, n, i, a, e[4], 4149444226, 6), n, i, e[11], 3174756917, 10), r, n, e[2], 718787259, 15), a, r, e[9], 3951481745, 21), this._a = this._a + r | 0, this._b = this._b + n | 0, this._c = this._c + i | 0, this._d = this._d + a | 0; }, a.prototype._digest = function () { this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update(); var e = new r(16); return e.writeInt32LE(this._a, 0), e.writeInt32LE(this._b, 4), e.writeInt32LE(this._c, 8), e.writeInt32LE(this._d, 12), e; }, t.exports = a;
        }).call(this, e("buffer").Buffer); }, { buffer: 51, "hash-base": 113, inherits: 108 }], 113: [function (e, t, r) {
            "use strict";
            var n = e("safe-buffer").Buffer, i = e("stream").Transform;
            function s(e) { i.call(this), this._block = n.allocUnsafe(e), this._blockSize = e, this._blockOffset = 0, this._length = [0, 0, 0, 0], this._finalized = !1; }
            e("inherits")(s, i), s.prototype._transform = function (e, t, r) { var n = null; try {
                this.update(e, t);
            }
            catch (e) {
                n = e;
            } r(n); }, s.prototype._flush = function (e) { var t = null; try {
                this.push(this.digest());
            }
            catch (e) {
                t = e;
            } e(t); }, s.prototype.update = function (e, t) { if (function (e, t) { if (!n.isBuffer(e) && "string" != typeof e)
                throw new TypeError(t + " must be a string or a buffer"); }(e, "Data"), this._finalized)
                throw new Error("Digest already called"); n.isBuffer(e) || (e = n.from(e, t)); for (var r = this._block, i = 0; this._blockOffset + e.length - i >= this._blockSize;) {
                for (var s = this._blockOffset; s < this._blockSize;)
                    r[s++] = e[i++];
                this._update(), this._blockOffset = 0;
            } for (; i < e.length;)
                r[this._blockOffset++] = e[i++]; for (var a = 0, o = 8 * e.length; o > 0; ++a)
                this._length[a] += o, (o = this._length[a] / 4294967296 | 0) > 0 && (this._length[a] -= 4294967296 * o); return this; }, s.prototype._update = function () { throw new Error("_update is not implemented"); }, s.prototype.digest = function (e) { if (this._finalized)
                throw new Error("Digest already called"); this._finalized = !0; var t = this._digest(); void 0 !== e && (t = t.toString(e)), this._block.fill(0), this._blockOffset = 0; for (var r = 0; r < 4; ++r)
                this._length[r] = 0; return t; }, s.prototype._digest = function () { throw new Error("_digest is not implemented"); }, t.exports = s;
        }, { inherits: 108, "safe-buffer": 168, stream: 178 }], 114: [function (e, t, r) { var n = e("bn.js"), i = e("brorand"); function s(e) { this.rand = e || new i.Rand; } t.exports = s, s.create = function (e) { return new s(e); }, s.prototype._randbelow = function (e) { var t = e.bitLength(), r = Math.ceil(t / 8); do {
            var i = new n(this.rand.generate(r));
        } while (i.cmp(e) >= 0); return i; }, s.prototype._randrange = function (e, t) { var r = t.sub(e); return e.add(this._randbelow(r)); }, s.prototype.test = function (e, t, r) { var i = e.bitLength(), s = n.mont(e), a = new n(1).toRed(s); t || (t = Math.max(1, i / 48 | 0)); for (var o = e.subn(1), f = 0; !o.testn(f); f++)
            ; for (var c = e.shrn(f), h = o.toRed(s); t > 0; t--) {
            var u = this._randrange(new n(2), o);
            r && r(u);
            var d = u.toRed(s).redPow(c);
            if (0 !== d.cmp(a) && 0 !== d.cmp(h)) {
                for (var l = 1; l < f; l++) {
                    if (0 === (d = d.redSqr()).cmp(a))
                        return !1;
                    if (0 === d.cmp(h))
                        break;
                }
                if (l === f)
                    return !1;
            }
        } return !0; }, s.prototype.getDivisor = function (e, t) { var r = e.bitLength(), i = n.mont(e), s = new n(1).toRed(i); t || (t = Math.max(1, r / 48 | 0)); for (var a = e.subn(1), o = 0; !a.testn(o); o++)
            ; for (var f = e.shrn(o), c = a.toRed(i); t > 0; t--) {
            var h = this._randrange(new n(2), a), u = e.gcd(h);
            if (0 !== u.cmpn(1))
                return u;
            var d = h.toRed(i).redPow(f);
            if (0 !== d.cmp(s) && 0 !== d.cmp(c)) {
                for (var l = 1; l < o; l++) {
                    if (0 === (d = d.redSqr()).cmp(s))
                        return d.fromRed().subn(1).gcd(e);
                    if (0 === d.cmp(c))
                        break;
                }
                if (l === o)
                    return (d = d.redSqr()).fromRed().subn(1).gcd(e);
            }
        } return !1; }; }, { "bn.js": 17, brorand: 18 }], 115: [function (e, t, r) { function n(e, t) { if (!e)
            throw new Error(t || "Assertion failed"); } t.exports = n, n.equal = function (e, t, r) { if (e != t)
            throw new Error(r || "Assertion failed: " + e + " != " + t); }; }, {}], 116: [function (e, t, r) {
            "use strict";
            var n = r;
            function i(e) { return 1 === e.length ? "0" + e : e; }
            function s(e) { for (var t = "", r = 0; r < e.length; r++)
                t += i(e[r].toString(16)); return t; }
            n.toArray = function (e, t) { if (Array.isArray(e))
                return e.slice(); if (!e)
                return []; var r = []; if ("string" != typeof e) {
                for (var n = 0; n < e.length; n++)
                    r[n] = 0 | e[n];
                return r;
            } if ("hex" === t)
                for ((e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e), n = 0; n < e.length; n += 2)
                    r.push(parseInt(e[n] + e[n + 1], 16));
            else
                for (n = 0; n < e.length; n++) {
                    var i = e.charCodeAt(n), s = i >> 8, a = 255 & i;
                    s ? r.push(s, a) : r.push(a);
                } return r; }, n.zero2 = i, n.toHex = s, n.encode = function (e, t) { return "hex" === t ? s(e) : e; };
        }, {}], 117: [function (e, t, r) { r.endianness = function () { return "LE"; }, r.hostname = function () { return "undefined" != typeof location ? location.hostname : ""; }, r.loadavg = function () { return []; }, r.uptime = function () { return 0; }, r.freemem = function () { return Number.MAX_VALUE; }, r.totalmem = function () { return Number.MAX_VALUE; }, r.cpus = function () { return []; }, r.type = function () { return "Browser"; }, r.release = function () { return "undefined" != typeof navigator ? navigator.appVersion : ""; }, r.networkInterfaces = r.getNetworkInterfaces = function () { return {}; }, r.arch = function () { return "javascript"; }, r.platform = function () { return "browser"; }, r.tmpdir = r.tmpDir = function () { return "/tmp"; }, r.EOL = "\n", r.homedir = function () { return "/"; }; }, {}], 118: [function (e, t, r) {
            "use strict";
            var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
            function i(e, t) { return Object.prototype.hasOwnProperty.call(e, t); }
            r.assign = function (e) { for (var t = Array.prototype.slice.call(arguments, 1); t.length;) {
                var r = t.shift();
                if (r) {
                    if ("object" != typeof r)
                        throw new TypeError(r + "must be non-object");
                    for (var n in r)
                        i(r, n) && (e[n] = r[n]);
                }
            } return e; }, r.shrinkBuf = function (e, t) { return e.length === t ? e : e.subarray ? e.subarray(0, t) : (e.length = t, e); };
            var s = { arraySet: function (e, t, r, n, i) { if (t.subarray && e.subarray)
                    e.set(t.subarray(r, r + n), i);
                else
                    for (var s = 0; s < n; s++)
                        e[i + s] = t[r + s]; }, flattenChunks: function (e) { var t, r, n, i, s, a; for (n = 0, t = 0, r = e.length; t < r; t++)
                    n += e[t].length; for (a = new Uint8Array(n), i = 0, t = 0, r = e.length; t < r; t++)
                    s = e[t], a.set(s, i), i += s.length; return a; } }, a = { arraySet: function (e, t, r, n, i) { for (var s = 0; s < n; s++)
                    e[i + s] = t[r + s]; }, flattenChunks: function (e) { return [].concat.apply([], e); } };
            r.setTyped = function (e) { e ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, s)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, a)); }, r.setTyped(n);
        }, {}], 119: [function (e, t, r) {
            "use strict";
            t.exports = function (e, t, r, n) { for (var i = 65535 & e | 0, s = e >>> 16 & 65535 | 0, a = 0; 0 !== r;) {
                r -= a = r > 2e3 ? 2e3 : r;
                do {
                    s = s + (i = i + t[n++] | 0) | 0;
                } while (--a);
                i %= 65521, s %= 65521;
            } return i | s << 16 | 0; };
        }, {}], 120: [function (e, t, r) {
            "use strict";
            t.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
        }, {}], 121: [function (e, t, r) {
            "use strict";
            var n = function () { for (var e, t = [], r = 0; r < 256; r++) {
                e = r;
                for (var n = 0; n < 8; n++)
                    e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;
                t[r] = e;
            } return t; }();
            t.exports = function (e, t, r, i) { var s = n, a = i + r; e ^= -1; for (var o = i; o < a; o++)
                e = e >>> 8 ^ s[255 & (e ^ t[o])]; return -1 ^ e; };
        }, {}], 122: [function (e, t, r) {
            "use strict";
            var n, i = e("../utils/common"), s = e("./trees"), a = e("./adler32"), o = e("./crc32"), f = e("./messages"), c = 0, h = 1, u = 3, d = 4, l = 5, p = 0, b = 1, m = -2, g = -3, y = -5, v = -1, _ = 1, w = 2, E = 3, k = 4, S = 0, x = 2, A = 8, M = 9, I = 15, B = 8, j = 286, R = 30, T = 19, C = 2 * j + 1, O = 15, z = 3, L = 258, N = L + z + 1, P = 32, D = 42, U = 69, q = 73, F = 91, H = 103, Z = 113, K = 666, W = 1, G = 2, V = 3, X = 4, Y = 3;
            function J(e, t) { return e.msg = f[t], t; }
            function $(e) { return (e << 1) - (e > 4 ? 9 : 0); }
            function Q(e) { for (var t = e.length; --t >= 0;)
                e[t] = 0; }
            function ee(e) { var t = e.state, r = t.pending; r > e.avail_out && (r = e.avail_out), 0 !== r && (i.arraySet(e.output, t.pending_buf, t.pending_out, r, e.next_out), e.next_out += r, t.pending_out += r, e.total_out += r, e.avail_out -= r, t.pending -= r, 0 === t.pending && (t.pending_out = 0)); }
            function te(e, t) { s._tr_flush_block(e, e.block_start >= 0 ? e.block_start : -1, e.strstart - e.block_start, t), e.block_start = e.strstart, ee(e.strm); }
            function re(e, t) { e.pending_buf[e.pending++] = t; }
            function ne(e, t) { e.pending_buf[e.pending++] = t >>> 8 & 255, e.pending_buf[e.pending++] = 255 & t; }
            function ie(e, t) { var r, n, i = e.max_chain_length, s = e.strstart, a = e.prev_length, o = e.nice_match, f = e.strstart > e.w_size - N ? e.strstart - (e.w_size - N) : 0, c = e.window, h = e.w_mask, u = e.prev, d = e.strstart + L, l = c[s + a - 1], p = c[s + a]; e.prev_length >= e.good_match && (i >>= 2), o > e.lookahead && (o = e.lookahead); do {
                if (c[(r = t) + a] === p && c[r + a - 1] === l && c[r] === c[s] && c[++r] === c[s + 1]) {
                    s += 2, r++;
                    do { } while (c[++s] === c[++r] && c[++s] === c[++r] && c[++s] === c[++r] && c[++s] === c[++r] && c[++s] === c[++r] && c[++s] === c[++r] && c[++s] === c[++r] && c[++s] === c[++r] && s < d);
                    if (n = L - (d - s), s = d - L, n > a) {
                        if (e.match_start = t, a = n, n >= o)
                            break;
                        l = c[s + a - 1], p = c[s + a];
                    }
                }
            } while ((t = u[t & h]) > f && 0 != --i); return a <= e.lookahead ? a : e.lookahead; }
            function se(e) { var t, r, n, s, f, c, h, u, d, l, p = e.w_size; do {
                if (s = e.window_size - e.lookahead - e.strstart, e.strstart >= p + (p - N)) {
                    i.arraySet(e.window, e.window, p, p, 0), e.match_start -= p, e.strstart -= p, e.block_start -= p, t = r = e.hash_size;
                    do {
                        n = e.head[--t], e.head[t] = n >= p ? n - p : 0;
                    } while (--r);
                    t = r = p;
                    do {
                        n = e.prev[--t], e.prev[t] = n >= p ? n - p : 0;
                    } while (--r);
                    s += p;
                }
                if (0 === e.strm.avail_in)
                    break;
                if (c = e.strm, h = e.window, u = e.strstart + e.lookahead, d = s, l = void 0, (l = c.avail_in) > d && (l = d), r = 0 === l ? 0 : (c.avail_in -= l, i.arraySet(h, c.input, c.next_in, l, u), 1 === c.state.wrap ? c.adler = a(c.adler, h, l, u) : 2 === c.state.wrap && (c.adler = o(c.adler, h, l, u)), c.next_in += l, c.total_in += l, l), e.lookahead += r, e.lookahead + e.insert >= z)
                    for (f = e.strstart - e.insert, e.ins_h = e.window[f], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[f + 1]) & e.hash_mask; e.insert && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[f + z - 1]) & e.hash_mask, e.prev[f & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = f, f++, e.insert--, !(e.lookahead + e.insert < z));)
                        ;
            } while (e.lookahead < N && 0 !== e.strm.avail_in); }
            function ae(e, t) { for (var r, n;;) {
                if (e.lookahead < N) {
                    if (se(e), e.lookahead < N && t === c)
                        return W;
                    if (0 === e.lookahead)
                        break;
                }
                if (r = 0, e.lookahead >= z && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + z - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), 0 !== r && e.strstart - r <= e.w_size - N && (e.match_length = ie(e, r)), e.match_length >= z)
                    if (n = s._tr_tally(e, e.strstart - e.match_start, e.match_length - z), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= z) {
                        e.match_length--;
                        do {
                            e.strstart++, e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + z - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart;
                        } while (0 != --e.match_length);
                        e.strstart++;
                    }
                    else
                        e.strstart += e.match_length, e.match_length = 0, e.ins_h = e.window[e.strstart], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 1]) & e.hash_mask;
                else
                    n = s._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;
                if (n && (te(e, !1), 0 === e.strm.avail_out))
                    return W;
            } return e.insert = e.strstart < z - 1 ? e.strstart : z - 1, t === d ? (te(e, !0), 0 === e.strm.avail_out ? V : X) : e.last_lit && (te(e, !1), 0 === e.strm.avail_out) ? W : G; }
            function oe(e, t) { for (var r, n, i;;) {
                if (e.lookahead < N) {
                    if (se(e), e.lookahead < N && t === c)
                        return W;
                    if (0 === e.lookahead)
                        break;
                }
                if (r = 0, e.lookahead >= z && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + z - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = z - 1, 0 !== r && e.prev_length < e.max_lazy_match && e.strstart - r <= e.w_size - N && (e.match_length = ie(e, r), e.match_length <= 5 && (e.strategy === _ || e.match_length === z && e.strstart - e.match_start > 4096) && (e.match_length = z - 1)), e.prev_length >= z && e.match_length <= e.prev_length) {
                    i = e.strstart + e.lookahead - z, n = s._tr_tally(e, e.strstart - 1 - e.prev_match, e.prev_length - z), e.lookahead -= e.prev_length - 1, e.prev_length -= 2;
                    do {
                        ++e.strstart <= i && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + z - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart);
                    } while (0 != --e.prev_length);
                    if (e.match_available = 0, e.match_length = z - 1, e.strstart++, n && (te(e, !1), 0 === e.strm.avail_out))
                        return W;
                }
                else if (e.match_available) {
                    if ((n = s._tr_tally(e, 0, e.window[e.strstart - 1])) && te(e, !1), e.strstart++, e.lookahead--, 0 === e.strm.avail_out)
                        return W;
                }
                else
                    e.match_available = 1, e.strstart++, e.lookahead--;
            } return e.match_available && (n = s._tr_tally(e, 0, e.window[e.strstart - 1]), e.match_available = 0), e.insert = e.strstart < z - 1 ? e.strstart : z - 1, t === d ? (te(e, !0), 0 === e.strm.avail_out ? V : X) : e.last_lit && (te(e, !1), 0 === e.strm.avail_out) ? W : G; }
            function fe(e, t, r, n, i) { this.good_length = e, this.max_lazy = t, this.nice_length = r, this.max_chain = n, this.func = i; }
            function ce(e) { var t; return e && e.state ? (e.total_in = e.total_out = 0, e.data_type = x, (t = e.state).pending = 0, t.pending_out = 0, t.wrap < 0 && (t.wrap = -t.wrap), t.status = t.wrap ? D : Z, e.adler = 2 === t.wrap ? 0 : 1, t.last_flush = c, s._tr_init(t), p) : J(e, m); }
            function he(e) { var t, r = ce(e); return r === p && ((t = e.state).window_size = 2 * t.w_size, Q(t.head), t.max_lazy_match = n[t.level].max_lazy, t.good_match = n[t.level].good_length, t.nice_match = n[t.level].nice_length, t.max_chain_length = n[t.level].max_chain, t.strstart = 0, t.block_start = 0, t.lookahead = 0, t.insert = 0, t.match_length = t.prev_length = z - 1, t.match_available = 0, t.ins_h = 0), r; }
            function ue(e, t, r, n, s, a) { if (!e)
                return m; var o = 1; if (t === v && (t = 6), n < 0 ? (o = 0, n = -n) : n > 15 && (o = 2, n -= 16), s < 1 || s > M || r !== A || n < 8 || n > 15 || t < 0 || t > 9 || a < 0 || a > k)
                return J(e, m); 8 === n && (n = 9); var f = new function () { this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = A, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new i.Buf16(2 * C), this.dyn_dtree = new i.Buf16(2 * (2 * R + 1)), this.bl_tree = new i.Buf16(2 * (2 * T + 1)), Q(this.dyn_ltree), Q(this.dyn_dtree), Q(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new i.Buf16(O + 1), this.heap = new i.Buf16(2 * j + 1), Q(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new i.Buf16(2 * j + 1), Q(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0; }; return e.state = f, f.strm = e, f.wrap = o, f.gzhead = null, f.w_bits = n, f.w_size = 1 << f.w_bits, f.w_mask = f.w_size - 1, f.hash_bits = s + 7, f.hash_size = 1 << f.hash_bits, f.hash_mask = f.hash_size - 1, f.hash_shift = ~~((f.hash_bits + z - 1) / z), f.window = new i.Buf8(2 * f.w_size), f.head = new i.Buf16(f.hash_size), f.prev = new i.Buf16(f.w_size), f.lit_bufsize = 1 << s + 6, f.pending_buf_size = 4 * f.lit_bufsize, f.pending_buf = new i.Buf8(f.pending_buf_size), f.d_buf = 1 * f.lit_bufsize, f.l_buf = 3 * f.lit_bufsize, f.level = t, f.strategy = a, f.method = r, he(e); }
            n = [new fe(0, 0, 0, 0, function (e, t) { var r = 65535; for (r > e.pending_buf_size - 5 && (r = e.pending_buf_size - 5);;) {
                    if (e.lookahead <= 1) {
                        if (se(e), 0 === e.lookahead && t === c)
                            return W;
                        if (0 === e.lookahead)
                            break;
                    }
                    e.strstart += e.lookahead, e.lookahead = 0;
                    var n = e.block_start + r;
                    if ((0 === e.strstart || e.strstart >= n) && (e.lookahead = e.strstart - n, e.strstart = n, te(e, !1), 0 === e.strm.avail_out))
                        return W;
                    if (e.strstart - e.block_start >= e.w_size - N && (te(e, !1), 0 === e.strm.avail_out))
                        return W;
                } return e.insert = 0, t === d ? (te(e, !0), 0 === e.strm.avail_out ? V : X) : (e.strstart > e.block_start && (te(e, !1), e.strm.avail_out), W); }), new fe(4, 4, 8, 4, ae), new fe(4, 5, 16, 8, ae), new fe(4, 6, 32, 32, ae), new fe(4, 4, 16, 16, oe), new fe(8, 16, 32, 32, oe), new fe(8, 16, 128, 128, oe), new fe(8, 32, 128, 256, oe), new fe(32, 128, 258, 1024, oe), new fe(32, 258, 258, 4096, oe)], r.deflateInit = function (e, t) { return ue(e, t, A, I, B, S); }, r.deflateInit2 = ue, r.deflateReset = he, r.deflateResetKeep = ce, r.deflateSetHeader = function (e, t) { return e && e.state ? 2 !== e.state.wrap ? m : (e.state.gzhead = t, p) : m; }, r.deflate = function (e, t) { var r, i, a, f; if (!e || !e.state || t > l || t < 0)
                return e ? J(e, m) : m; if (i = e.state, !e.output || !e.input && 0 !== e.avail_in || i.status === K && t !== d)
                return J(e, 0 === e.avail_out ? y : m); if (i.strm = e, r = i.last_flush, i.last_flush = t, i.status === D)
                if (2 === i.wrap)
                    e.adler = 0, re(i, 31), re(i, 139), re(i, 8), i.gzhead ? (re(i, (i.gzhead.text ? 1 : 0) + (i.gzhead.hcrc ? 2 : 0) + (i.gzhead.extra ? 4 : 0) + (i.gzhead.name ? 8 : 0) + (i.gzhead.comment ? 16 : 0)), re(i, 255 & i.gzhead.time), re(i, i.gzhead.time >> 8 & 255), re(i, i.gzhead.time >> 16 & 255), re(i, i.gzhead.time >> 24 & 255), re(i, 9 === i.level ? 2 : i.strategy >= w || i.level < 2 ? 4 : 0), re(i, 255 & i.gzhead.os), i.gzhead.extra && i.gzhead.extra.length && (re(i, 255 & i.gzhead.extra.length), re(i, i.gzhead.extra.length >> 8 & 255)), i.gzhead.hcrc && (e.adler = o(e.adler, i.pending_buf, i.pending, 0)), i.gzindex = 0, i.status = U) : (re(i, 0), re(i, 0), re(i, 0), re(i, 0), re(i, 0), re(i, 9 === i.level ? 2 : i.strategy >= w || i.level < 2 ? 4 : 0), re(i, Y), i.status = Z);
                else {
                    var g = A + (i.w_bits - 8 << 4) << 8;
                    g |= (i.strategy >= w || i.level < 2 ? 0 : i.level < 6 ? 1 : 6 === i.level ? 2 : 3) << 6, 0 !== i.strstart && (g |= P), g += 31 - g % 31, i.status = Z, ne(i, g), 0 !== i.strstart && (ne(i, e.adler >>> 16), ne(i, 65535 & e.adler)), e.adler = 1;
                } if (i.status === U)
                if (i.gzhead.extra) {
                    for (a = i.pending; i.gzindex < (65535 & i.gzhead.extra.length) && (i.pending !== i.pending_buf_size || (i.gzhead.hcrc && i.pending > a && (e.adler = o(e.adler, i.pending_buf, i.pending - a, a)), ee(e), a = i.pending, i.pending !== i.pending_buf_size));)
                        re(i, 255 & i.gzhead.extra[i.gzindex]), i.gzindex++;
                    i.gzhead.hcrc && i.pending > a && (e.adler = o(e.adler, i.pending_buf, i.pending - a, a)), i.gzindex === i.gzhead.extra.length && (i.gzindex = 0, i.status = q);
                }
                else
                    i.status = q; if (i.status === q)
                if (i.gzhead.name) {
                    a = i.pending;
                    do {
                        if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > a && (e.adler = o(e.adler, i.pending_buf, i.pending - a, a)), ee(e), a = i.pending, i.pending === i.pending_buf_size)) {
                            f = 1;
                            break;
                        }
                        f = i.gzindex < i.gzhead.name.length ? 255 & i.gzhead.name.charCodeAt(i.gzindex++) : 0, re(i, f);
                    } while (0 !== f);
                    i.gzhead.hcrc && i.pending > a && (e.adler = o(e.adler, i.pending_buf, i.pending - a, a)), 0 === f && (i.gzindex = 0, i.status = F);
                }
                else
                    i.status = F; if (i.status === F)
                if (i.gzhead.comment) {
                    a = i.pending;
                    do {
                        if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > a && (e.adler = o(e.adler, i.pending_buf, i.pending - a, a)), ee(e), a = i.pending, i.pending === i.pending_buf_size)) {
                            f = 1;
                            break;
                        }
                        f = i.gzindex < i.gzhead.comment.length ? 255 & i.gzhead.comment.charCodeAt(i.gzindex++) : 0, re(i, f);
                    } while (0 !== f);
                    i.gzhead.hcrc && i.pending > a && (e.adler = o(e.adler, i.pending_buf, i.pending - a, a)), 0 === f && (i.status = H);
                }
                else
                    i.status = H; if (i.status === H && (i.gzhead.hcrc ? (i.pending + 2 > i.pending_buf_size && ee(e), i.pending + 2 <= i.pending_buf_size && (re(i, 255 & e.adler), re(i, e.adler >> 8 & 255), e.adler = 0, i.status = Z)) : i.status = Z), 0 !== i.pending) {
                if (ee(e), 0 === e.avail_out)
                    return i.last_flush = -1, p;
            }
            else if (0 === e.avail_in && $(t) <= $(r) && t !== d)
                return J(e, y); if (i.status === K && 0 !== e.avail_in)
                return J(e, y); if (0 !== e.avail_in || 0 !== i.lookahead || t !== c && i.status !== K) {
                var v = i.strategy === w ? function (e, t) { for (var r;;) {
                    if (0 === e.lookahead && (se(e), 0 === e.lookahead)) {
                        if (t === c)
                            return W;
                        break;
                    }
                    if (e.match_length = 0, r = s._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++, r && (te(e, !1), 0 === e.strm.avail_out))
                        return W;
                } return e.insert = 0, t === d ? (te(e, !0), 0 === e.strm.avail_out ? V : X) : e.last_lit && (te(e, !1), 0 === e.strm.avail_out) ? W : G; }(i, t) : i.strategy === E ? function (e, t) { for (var r, n, i, a, o = e.window;;) {
                    if (e.lookahead <= L) {
                        if (se(e), e.lookahead <= L && t === c)
                            return W;
                        if (0 === e.lookahead)
                            break;
                    }
                    if (e.match_length = 0, e.lookahead >= z && e.strstart > 0 && (n = o[i = e.strstart - 1]) === o[++i] && n === o[++i] && n === o[++i]) {
                        a = e.strstart + L;
                        do { } while (n === o[++i] && n === o[++i] && n === o[++i] && n === o[++i] && n === o[++i] && n === o[++i] && n === o[++i] && n === o[++i] && i < a);
                        e.match_length = L - (a - i), e.match_length > e.lookahead && (e.match_length = e.lookahead);
                    }
                    if (e.match_length >= z ? (r = s._tr_tally(e, 1, e.match_length - z), e.lookahead -= e.match_length, e.strstart += e.match_length, e.match_length = 0) : (r = s._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++), r && (te(e, !1), 0 === e.strm.avail_out))
                        return W;
                } return e.insert = 0, t === d ? (te(e, !0), 0 === e.strm.avail_out ? V : X) : e.last_lit && (te(e, !1), 0 === e.strm.avail_out) ? W : G; }(i, t) : n[i.level].func(i, t);
                if (v !== V && v !== X || (i.status = K), v === W || v === V)
                    return 0 === e.avail_out && (i.last_flush = -1), p;
                if (v === G && (t === h ? s._tr_align(i) : t !== l && (s._tr_stored_block(i, 0, 0, !1), t === u && (Q(i.head), 0 === i.lookahead && (i.strstart = 0, i.block_start = 0, i.insert = 0))), ee(e), 0 === e.avail_out))
                    return i.last_flush = -1, p;
            } return t !== d ? p : i.wrap <= 0 ? b : (2 === i.wrap ? (re(i, 255 & e.adler), re(i, e.adler >> 8 & 255), re(i, e.adler >> 16 & 255), re(i, e.adler >> 24 & 255), re(i, 255 & e.total_in), re(i, e.total_in >> 8 & 255), re(i, e.total_in >> 16 & 255), re(i, e.total_in >> 24 & 255)) : (ne(i, e.adler >>> 16), ne(i, 65535 & e.adler)), ee(e), i.wrap > 0 && (i.wrap = -i.wrap), 0 !== i.pending ? p : b); }, r.deflateEnd = function (e) { var t; return e && e.state ? (t = e.state.status) !== D && t !== U && t !== q && t !== F && t !== H && t !== Z && t !== K ? J(e, m) : (e.state = null, t === Z ? J(e, g) : p) : m; }, r.deflateSetDictionary = function (e, t) { var r, n, s, o, f, c, h, u, d = t.length; if (!e || !e.state)
                return m; if (2 === (o = (r = e.state).wrap) || 1 === o && r.status !== D || r.lookahead)
                return m; for (1 === o && (e.adler = a(e.adler, t, d, 0)), r.wrap = 0, d >= r.w_size && (0 === o && (Q(r.head), r.strstart = 0, r.block_start = 0, r.insert = 0), u = new i.Buf8(r.w_size), i.arraySet(u, t, d - r.w_size, r.w_size, 0), t = u, d = r.w_size), f = e.avail_in, c = e.next_in, h = e.input, e.avail_in = d, e.next_in = 0, e.input = t, se(r); r.lookahead >= z;) {
                n = r.strstart, s = r.lookahead - (z - 1);
                do {
                    r.ins_h = (r.ins_h << r.hash_shift ^ r.window[n + z - 1]) & r.hash_mask, r.prev[n & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = n, n++;
                } while (--s);
                r.strstart = n, r.lookahead = z - 1, se(r);
            } return r.strstart += r.lookahead, r.block_start = r.strstart, r.insert = r.lookahead, r.lookahead = 0, r.match_length = r.prev_length = z - 1, r.match_available = 0, e.next_in = c, e.input = h, e.avail_in = f, r.wrap = o, p; }, r.deflateInfo = "pako deflate (from Nodeca project)";
        }, { "../utils/common": 118, "./adler32": 119, "./crc32": 121, "./messages": 126, "./trees": 127 }], 123: [function (e, t, r) {
            "use strict";
            t.exports = function (e, t) { var r, n, i, s, a, o, f, c, h, u, d, l, p, b, m, g, y, v, _, w, E, k, S, x, A; r = e.state, n = e.next_in, x = e.input, i = n + (e.avail_in - 5), s = e.next_out, A = e.output, a = s - (t - e.avail_out), o = s + (e.avail_out - 257), f = r.dmax, c = r.wsize, h = r.whave, u = r.wnext, d = r.window, l = r.hold, p = r.bits, b = r.lencode, m = r.distcode, g = (1 << r.lenbits) - 1, y = (1 << r.distbits) - 1; e: do {
                p < 15 && (l += x[n++] << p, p += 8, l += x[n++] << p, p += 8), v = b[l & g];
                t: for (;;) {
                    if (l >>>= _ = v >>> 24, p -= _, 0 === (_ = v >>> 16 & 255))
                        A[s++] = 65535 & v;
                    else {
                        if (!(16 & _)) {
                            if (0 == (64 & _)) {
                                v = b[(65535 & v) + (l & (1 << _) - 1)];
                                continue t;
                            }
                            if (32 & _) {
                                r.mode = 12;
                                break e;
                            }
                            e.msg = "invalid literal/length code", r.mode = 30;
                            break e;
                        }
                        w = 65535 & v, (_ &= 15) && (p < _ && (l += x[n++] << p, p += 8), w += l & (1 << _) - 1, l >>>= _, p -= _), p < 15 && (l += x[n++] << p, p += 8, l += x[n++] << p, p += 8), v = m[l & y];
                        r: for (;;) {
                            if (l >>>= _ = v >>> 24, p -= _, !(16 & (_ = v >>> 16 & 255))) {
                                if (0 == (64 & _)) {
                                    v = m[(65535 & v) + (l & (1 << _) - 1)];
                                    continue r;
                                }
                                e.msg = "invalid distance code", r.mode = 30;
                                break e;
                            }
                            if (E = 65535 & v, p < (_ &= 15) && (l += x[n++] << p, (p += 8) < _ && (l += x[n++] << p, p += 8)), (E += l & (1 << _) - 1) > f) {
                                e.msg = "invalid distance too far back", r.mode = 30;
                                break e;
                            }
                            if (l >>>= _, p -= _, E > (_ = s - a)) {
                                if ((_ = E - _) > h && r.sane) {
                                    e.msg = "invalid distance too far back", r.mode = 30;
                                    break e;
                                }
                                if (k = 0, S = d, 0 === u) {
                                    if (k += c - _, _ < w) {
                                        w -= _;
                                        do {
                                            A[s++] = d[k++];
                                        } while (--_);
                                        k = s - E, S = A;
                                    }
                                }
                                else if (u < _) {
                                    if (k += c + u - _, (_ -= u) < w) {
                                        w -= _;
                                        do {
                                            A[s++] = d[k++];
                                        } while (--_);
                                        if (k = 0, u < w) {
                                            w -= _ = u;
                                            do {
                                                A[s++] = d[k++];
                                            } while (--_);
                                            k = s - E, S = A;
                                        }
                                    }
                                }
                                else if (k += u - _, _ < w) {
                                    w -= _;
                                    do {
                                        A[s++] = d[k++];
                                    } while (--_);
                                    k = s - E, S = A;
                                }
                                for (; w > 2;)
                                    A[s++] = S[k++], A[s++] = S[k++], A[s++] = S[k++], w -= 3;
                                w && (A[s++] = S[k++], w > 1 && (A[s++] = S[k++]));
                            }
                            else {
                                k = s - E;
                                do {
                                    A[s++] = A[k++], A[s++] = A[k++], A[s++] = A[k++], w -= 3;
                                } while (w > 2);
                                w && (A[s++] = A[k++], w > 1 && (A[s++] = A[k++]));
                            }
                            break;
                        }
                    }
                    break;
                }
            } while (n < i && s < o); n -= w = p >> 3, l &= (1 << (p -= w << 3)) - 1, e.next_in = n, e.next_out = s, e.avail_in = n < i ? i - n + 5 : 5 - (n - i), e.avail_out = s < o ? o - s + 257 : 257 - (s - o), r.hold = l, r.bits = p; };
        }, {}], 124: [function (e, t, r) {
            "use strict";
            var n = e("../utils/common"), i = e("./adler32"), s = e("./crc32"), a = e("./inffast"), o = e("./inftrees"), f = 0, c = 1, h = 2, u = 4, d = 5, l = 6, p = 0, b = 1, m = 2, g = -2, y = -3, v = -4, _ = -5, w = 8, E = 1, k = 2, S = 3, x = 4, A = 5, M = 6, I = 7, B = 8, j = 9, R = 10, T = 11, C = 12, O = 13, z = 14, L = 15, N = 16, P = 17, D = 18, U = 19, q = 20, F = 21, H = 22, Z = 23, K = 24, W = 25, G = 26, V = 27, X = 28, Y = 29, J = 30, $ = 31, Q = 32, ee = 852, te = 592, re = 15;
            function ne(e) { return (e >>> 24 & 255) + (e >>> 8 & 65280) + ((65280 & e) << 8) + ((255 & e) << 24); }
            function ie(e) { var t; return e && e.state ? (t = e.state, e.total_in = e.total_out = t.total = 0, e.msg = "", t.wrap && (e.adler = 1 & t.wrap), t.mode = E, t.last = 0, t.havedict = 0, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new n.Buf32(ee), t.distcode = t.distdyn = new n.Buf32(te), t.sane = 1, t.back = -1, p) : g; }
            function se(e) { var t; return e && e.state ? ((t = e.state).wsize = 0, t.whave = 0, t.wnext = 0, ie(e)) : g; }
            function ae(e, t) { var r, n; return e && e.state ? (n = e.state, t < 0 ? (r = 0, t = -t) : (r = 1 + (t >> 4), t < 48 && (t &= 15)), t && (t < 8 || t > 15) ? g : (null !== n.window && n.wbits !== t && (n.window = null), n.wrap = r, n.wbits = t, se(e))) : g; }
            function oe(e, t) { var r, i; return e ? (i = new function () { this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new n.Buf16(320), this.work = new n.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0; }, e.state = i, i.window = null, (r = ae(e, t)) !== p && (e.state = null), r) : g; }
            var fe, ce, he = !0;
            function ue(e) { if (he) {
                var t;
                for (fe = new n.Buf32(512), ce = new n.Buf32(32), t = 0; t < 144;)
                    e.lens[t++] = 8;
                for (; t < 256;)
                    e.lens[t++] = 9;
                for (; t < 280;)
                    e.lens[t++] = 7;
                for (; t < 288;)
                    e.lens[t++] = 8;
                for (o(c, e.lens, 0, 288, fe, 0, e.work, { bits: 9 }), t = 0; t < 32;)
                    e.lens[t++] = 5;
                o(h, e.lens, 0, 32, ce, 0, e.work, { bits: 5 }), he = !1;
            } e.lencode = fe, e.lenbits = 9, e.distcode = ce, e.distbits = 5; }
            function de(e, t, r, i) { var s, a = e.state; return null === a.window && (a.wsize = 1 << a.wbits, a.wnext = 0, a.whave = 0, a.window = new n.Buf8(a.wsize)), i >= a.wsize ? (n.arraySet(a.window, t, r - a.wsize, a.wsize, 0), a.wnext = 0, a.whave = a.wsize) : ((s = a.wsize - a.wnext) > i && (s = i), n.arraySet(a.window, t, r - i, s, a.wnext), (i -= s) ? (n.arraySet(a.window, t, r - i, i, 0), a.wnext = i, a.whave = a.wsize) : (a.wnext += s, a.wnext === a.wsize && (a.wnext = 0), a.whave < a.wsize && (a.whave += s))), 0; }
            r.inflateReset = se, r.inflateReset2 = ae, r.inflateResetKeep = ie, r.inflateInit = function (e) { return oe(e, re); }, r.inflateInit2 = oe, r.inflate = function (e, t) { var r, ee, te, re, ie, se, ae, oe, fe, ce, he, le, pe, be, me, ge, ye, ve, _e, we, Ee, ke, Se, xe, Ae = 0, Me = new n.Buf8(4), Ie = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]; if (!e || !e.state || !e.output || !e.input && 0 !== e.avail_in)
                return g; (r = e.state).mode === C && (r.mode = O), ie = e.next_out, te = e.output, ae = e.avail_out, re = e.next_in, ee = e.input, se = e.avail_in, oe = r.hold, fe = r.bits, ce = se, he = ae, ke = p; e: for (;;)
                switch (r.mode) {
                    case E:
                        if (0 === r.wrap) {
                            r.mode = O;
                            break;
                        }
                        for (; fe < 16;) {
                            if (0 === se)
                                break e;
                            se--, oe += ee[re++] << fe, fe += 8;
                        }
                        if (2 & r.wrap && 35615 === oe) {
                            r.check = 0, Me[0] = 255 & oe, Me[1] = oe >>> 8 & 255, r.check = s(r.check, Me, 2, 0), oe = 0, fe = 0, r.mode = k;
                            break;
                        }
                        if (r.flags = 0, r.head && (r.head.done = !1), !(1 & r.wrap) || (((255 & oe) << 8) + (oe >> 8)) % 31) {
                            e.msg = "incorrect header check", r.mode = J;
                            break;
                        }
                        if ((15 & oe) !== w) {
                            e.msg = "unknown compression method", r.mode = J;
                            break;
                        }
                        if (fe -= 4, Ee = 8 + (15 & (oe >>>= 4)), 0 === r.wbits)
                            r.wbits = Ee;
                        else if (Ee > r.wbits) {
                            e.msg = "invalid window size", r.mode = J;
                            break;
                        }
                        r.dmax = 1 << Ee, e.adler = r.check = 1, r.mode = 512 & oe ? R : C, oe = 0, fe = 0;
                        break;
                    case k:
                        for (; fe < 16;) {
                            if (0 === se)
                                break e;
                            se--, oe += ee[re++] << fe, fe += 8;
                        }
                        if (r.flags = oe, (255 & r.flags) !== w) {
                            e.msg = "unknown compression method", r.mode = J;
                            break;
                        }
                        if (57344 & r.flags) {
                            e.msg = "unknown header flags set", r.mode = J;
                            break;
                        }
                        r.head && (r.head.text = oe >> 8 & 1), 512 & r.flags && (Me[0] = 255 & oe, Me[1] = oe >>> 8 & 255, r.check = s(r.check, Me, 2, 0)), oe = 0, fe = 0, r.mode = S;
                    case S:
                        for (; fe < 32;) {
                            if (0 === se)
                                break e;
                            se--, oe += ee[re++] << fe, fe += 8;
                        }
                        r.head && (r.head.time = oe), 512 & r.flags && (Me[0] = 255 & oe, Me[1] = oe >>> 8 & 255, Me[2] = oe >>> 16 & 255, Me[3] = oe >>> 24 & 255, r.check = s(r.check, Me, 4, 0)), oe = 0, fe = 0, r.mode = x;
                    case x:
                        for (; fe < 16;) {
                            if (0 === se)
                                break e;
                            se--, oe += ee[re++] << fe, fe += 8;
                        }
                        r.head && (r.head.xflags = 255 & oe, r.head.os = oe >> 8), 512 & r.flags && (Me[0] = 255 & oe, Me[1] = oe >>> 8 & 255, r.check = s(r.check, Me, 2, 0)), oe = 0, fe = 0, r.mode = A;
                    case A:
                        if (1024 & r.flags) {
                            for (; fe < 16;) {
                                if (0 === se)
                                    break e;
                                se--, oe += ee[re++] << fe, fe += 8;
                            }
                            r.length = oe, r.head && (r.head.extra_len = oe), 512 & r.flags && (Me[0] = 255 & oe, Me[1] = oe >>> 8 & 255, r.check = s(r.check, Me, 2, 0)), oe = 0, fe = 0;
                        }
                        else
                            r.head && (r.head.extra = null);
                        r.mode = M;
                    case M:
                        if (1024 & r.flags && ((le = r.length) > se && (le = se), le && (r.head && (Ee = r.head.extra_len - r.length, r.head.extra || (r.head.extra = new Array(r.head.extra_len)), n.arraySet(r.head.extra, ee, re, le, Ee)), 512 & r.flags && (r.check = s(r.check, ee, le, re)), se -= le, re += le, r.length -= le), r.length))
                            break e;
                        r.length = 0, r.mode = I;
                    case I:
                        if (2048 & r.flags) {
                            if (0 === se)
                                break e;
                            le = 0;
                            do {
                                Ee = ee[re + le++], r.head && Ee && r.length < 65536 && (r.head.name += String.fromCharCode(Ee));
                            } while (Ee && le < se);
                            if (512 & r.flags && (r.check = s(r.check, ee, le, re)), se -= le, re += le, Ee)
                                break e;
                        }
                        else
                            r.head && (r.head.name = null);
                        r.length = 0, r.mode = B;
                    case B:
                        if (4096 & r.flags) {
                            if (0 === se)
                                break e;
                            le = 0;
                            do {
                                Ee = ee[re + le++], r.head && Ee && r.length < 65536 && (r.head.comment += String.fromCharCode(Ee));
                            } while (Ee && le < se);
                            if (512 & r.flags && (r.check = s(r.check, ee, le, re)), se -= le, re += le, Ee)
                                break e;
                        }
                        else
                            r.head && (r.head.comment = null);
                        r.mode = j;
                    case j:
                        if (512 & r.flags) {
                            for (; fe < 16;) {
                                if (0 === se)
                                    break e;
                                se--, oe += ee[re++] << fe, fe += 8;
                            }
                            if (oe !== (65535 & r.check)) {
                                e.msg = "header crc mismatch", r.mode = J;
                                break;
                            }
                            oe = 0, fe = 0;
                        }
                        r.head && (r.head.hcrc = r.flags >> 9 & 1, r.head.done = !0), e.adler = r.check = 0, r.mode = C;
                        break;
                    case R:
                        for (; fe < 32;) {
                            if (0 === se)
                                break e;
                            se--, oe += ee[re++] << fe, fe += 8;
                        }
                        e.adler = r.check = ne(oe), oe = 0, fe = 0, r.mode = T;
                    case T:
                        if (0 === r.havedict)
                            return e.next_out = ie, e.avail_out = ae, e.next_in = re, e.avail_in = se, r.hold = oe, r.bits = fe, m;
                        e.adler = r.check = 1, r.mode = C;
                    case C: if (t === d || t === l)
                        break e;
                    case O:
                        if (r.last) {
                            oe >>>= 7 & fe, fe -= 7 & fe, r.mode = V;
                            break;
                        }
                        for (; fe < 3;) {
                            if (0 === se)
                                break e;
                            se--, oe += ee[re++] << fe, fe += 8;
                        }
                        switch (r.last = 1 & oe, fe -= 1, 3 & (oe >>>= 1)) {
                            case 0:
                                r.mode = z;
                                break;
                            case 1:
                                if (ue(r), r.mode = q, t === l) {
                                    oe >>>= 2, fe -= 2;
                                    break e;
                                }
                                break;
                            case 2:
                                r.mode = P;
                                break;
                            case 3: e.msg = "invalid block type", r.mode = J;
                        }
                        oe >>>= 2, fe -= 2;
                        break;
                    case z:
                        for (oe >>>= 7 & fe, fe -= 7 & fe; fe < 32;) {
                            if (0 === se)
                                break e;
                            se--, oe += ee[re++] << fe, fe += 8;
                        }
                        if ((65535 & oe) != (oe >>> 16 ^ 65535)) {
                            e.msg = "invalid stored block lengths", r.mode = J;
                            break;
                        }
                        if (r.length = 65535 & oe, oe = 0, fe = 0, r.mode = L, t === l)
                            break e;
                    case L: r.mode = N;
                    case N:
                        if (le = r.length) {
                            if (le > se && (le = se), le > ae && (le = ae), 0 === le)
                                break e;
                            n.arraySet(te, ee, re, le, ie), se -= le, re += le, ae -= le, ie += le, r.length -= le;
                            break;
                        }
                        r.mode = C;
                        break;
                    case P:
                        for (; fe < 14;) {
                            if (0 === se)
                                break e;
                            se--, oe += ee[re++] << fe, fe += 8;
                        }
                        if (r.nlen = 257 + (31 & oe), oe >>>= 5, fe -= 5, r.ndist = 1 + (31 & oe), oe >>>= 5, fe -= 5, r.ncode = 4 + (15 & oe), oe >>>= 4, fe -= 4, r.nlen > 286 || r.ndist > 30) {
                            e.msg = "too many length or distance symbols", r.mode = J;
                            break;
                        }
                        r.have = 0, r.mode = D;
                    case D:
                        for (; r.have < r.ncode;) {
                            for (; fe < 3;) {
                                if (0 === se)
                                    break e;
                                se--, oe += ee[re++] << fe, fe += 8;
                            }
                            r.lens[Ie[r.have++]] = 7 & oe, oe >>>= 3, fe -= 3;
                        }
                        for (; r.have < 19;)
                            r.lens[Ie[r.have++]] = 0;
                        if (r.lencode = r.lendyn, r.lenbits = 7, Se = { bits: r.lenbits }, ke = o(f, r.lens, 0, 19, r.lencode, 0, r.work, Se), r.lenbits = Se.bits, ke) {
                            e.msg = "invalid code lengths set", r.mode = J;
                            break;
                        }
                        r.have = 0, r.mode = U;
                    case U:
                        for (; r.have < r.nlen + r.ndist;) {
                            for (; ge = (Ae = r.lencode[oe & (1 << r.lenbits) - 1]) >>> 16 & 255, ye = 65535 & Ae, !((me = Ae >>> 24) <= fe);) {
                                if (0 === se)
                                    break e;
                                se--, oe += ee[re++] << fe, fe += 8;
                            }
                            if (ye < 16)
                                oe >>>= me, fe -= me, r.lens[r.have++] = ye;
                            else {
                                if (16 === ye) {
                                    for (xe = me + 2; fe < xe;) {
                                        if (0 === se)
                                            break e;
                                        se--, oe += ee[re++] << fe, fe += 8;
                                    }
                                    if (oe >>>= me, fe -= me, 0 === r.have) {
                                        e.msg = "invalid bit length repeat", r.mode = J;
                                        break;
                                    }
                                    Ee = r.lens[r.have - 1], le = 3 + (3 & oe), oe >>>= 2, fe -= 2;
                                }
                                else if (17 === ye) {
                                    for (xe = me + 3; fe < xe;) {
                                        if (0 === se)
                                            break e;
                                        se--, oe += ee[re++] << fe, fe += 8;
                                    }
                                    fe -= me, Ee = 0, le = 3 + (7 & (oe >>>= me)), oe >>>= 3, fe -= 3;
                                }
                                else {
                                    for (xe = me + 7; fe < xe;) {
                                        if (0 === se)
                                            break e;
                                        se--, oe += ee[re++] << fe, fe += 8;
                                    }
                                    fe -= me, Ee = 0, le = 11 + (127 & (oe >>>= me)), oe >>>= 7, fe -= 7;
                                }
                                if (r.have + le > r.nlen + r.ndist) {
                                    e.msg = "invalid bit length repeat", r.mode = J;
                                    break;
                                }
                                for (; le--;)
                                    r.lens[r.have++] = Ee;
                            }
                        }
                        if (r.mode === J)
                            break;
                        if (0 === r.lens[256]) {
                            e.msg = "invalid code -- missing end-of-block", r.mode = J;
                            break;
                        }
                        if (r.lenbits = 9, Se = { bits: r.lenbits }, ke = o(c, r.lens, 0, r.nlen, r.lencode, 0, r.work, Se), r.lenbits = Se.bits, ke) {
                            e.msg = "invalid literal/lengths set", r.mode = J;
                            break;
                        }
                        if (r.distbits = 6, r.distcode = r.distdyn, Se = { bits: r.distbits }, ke = o(h, r.lens, r.nlen, r.ndist, r.distcode, 0, r.work, Se), r.distbits = Se.bits, ke) {
                            e.msg = "invalid distances set", r.mode = J;
                            break;
                        }
                        if (r.mode = q, t === l)
                            break e;
                    case q: r.mode = F;
                    case F:
                        if (se >= 6 && ae >= 258) {
                            e.next_out = ie, e.avail_out = ae, e.next_in = re, e.avail_in = se, r.hold = oe, r.bits = fe, a(e, he), ie = e.next_out, te = e.output, ae = e.avail_out, re = e.next_in, ee = e.input, se = e.avail_in, oe = r.hold, fe = r.bits, r.mode === C && (r.back = -1);
                            break;
                        }
                        for (r.back = 0; ge = (Ae = r.lencode[oe & (1 << r.lenbits) - 1]) >>> 16 & 255, ye = 65535 & Ae, !((me = Ae >>> 24) <= fe);) {
                            if (0 === se)
                                break e;
                            se--, oe += ee[re++] << fe, fe += 8;
                        }
                        if (ge && 0 == (240 & ge)) {
                            for (ve = me, _e = ge, we = ye; ge = (Ae = r.lencode[we + ((oe & (1 << ve + _e) - 1) >> ve)]) >>> 16 & 255, ye = 65535 & Ae, !(ve + (me = Ae >>> 24) <= fe);) {
                                if (0 === se)
                                    break e;
                                se--, oe += ee[re++] << fe, fe += 8;
                            }
                            oe >>>= ve, fe -= ve, r.back += ve;
                        }
                        if (oe >>>= me, fe -= me, r.back += me, r.length = ye, 0 === ge) {
                            r.mode = G;
                            break;
                        }
                        if (32 & ge) {
                            r.back = -1, r.mode = C;
                            break;
                        }
                        if (64 & ge) {
                            e.msg = "invalid literal/length code", r.mode = J;
                            break;
                        }
                        r.extra = 15 & ge, r.mode = H;
                    case H:
                        if (r.extra) {
                            for (xe = r.extra; fe < xe;) {
                                if (0 === se)
                                    break e;
                                se--, oe += ee[re++] << fe, fe += 8;
                            }
                            r.length += oe & (1 << r.extra) - 1, oe >>>= r.extra, fe -= r.extra, r.back += r.extra;
                        }
                        r.was = r.length, r.mode = Z;
                    case Z:
                        for (; ge = (Ae = r.distcode[oe & (1 << r.distbits) - 1]) >>> 16 & 255, ye = 65535 & Ae, !((me = Ae >>> 24) <= fe);) {
                            if (0 === se)
                                break e;
                            se--, oe += ee[re++] << fe, fe += 8;
                        }
                        if (0 == (240 & ge)) {
                            for (ve = me, _e = ge, we = ye; ge = (Ae = r.distcode[we + ((oe & (1 << ve + _e) - 1) >> ve)]) >>> 16 & 255, ye = 65535 & Ae, !(ve + (me = Ae >>> 24) <= fe);) {
                                if (0 === se)
                                    break e;
                                se--, oe += ee[re++] << fe, fe += 8;
                            }
                            oe >>>= ve, fe -= ve, r.back += ve;
                        }
                        if (oe >>>= me, fe -= me, r.back += me, 64 & ge) {
                            e.msg = "invalid distance code", r.mode = J;
                            break;
                        }
                        r.offset = ye, r.extra = 15 & ge, r.mode = K;
                    case K:
                        if (r.extra) {
                            for (xe = r.extra; fe < xe;) {
                                if (0 === se)
                                    break e;
                                se--, oe += ee[re++] << fe, fe += 8;
                            }
                            r.offset += oe & (1 << r.extra) - 1, oe >>>= r.extra, fe -= r.extra, r.back += r.extra;
                        }
                        if (r.offset > r.dmax) {
                            e.msg = "invalid distance too far back", r.mode = J;
                            break;
                        }
                        r.mode = W;
                    case W:
                        if (0 === ae)
                            break e;
                        if (le = he - ae, r.offset > le) {
                            if ((le = r.offset - le) > r.whave && r.sane) {
                                e.msg = "invalid distance too far back", r.mode = J;
                                break;
                            }
                            le > r.wnext ? (le -= r.wnext, pe = r.wsize - le) : pe = r.wnext - le, le > r.length && (le = r.length), be = r.window;
                        }
                        else
                            be = te, pe = ie - r.offset, le = r.length;
                        le > ae && (le = ae), ae -= le, r.length -= le;
                        do {
                            te[ie++] = be[pe++];
                        } while (--le);
                        0 === r.length && (r.mode = F);
                        break;
                    case G:
                        if (0 === ae)
                            break e;
                        te[ie++] = r.length, ae--, r.mode = F;
                        break;
                    case V:
                        if (r.wrap) {
                            for (; fe < 32;) {
                                if (0 === se)
                                    break e;
                                se--, oe |= ee[re++] << fe, fe += 8;
                            }
                            if (he -= ae, e.total_out += he, r.total += he, he && (e.adler = r.check = r.flags ? s(r.check, te, he, ie - he) : i(r.check, te, he, ie - he)), he = ae, (r.flags ? oe : ne(oe)) !== r.check) {
                                e.msg = "incorrect data check", r.mode = J;
                                break;
                            }
                            oe = 0, fe = 0;
                        }
                        r.mode = X;
                    case X:
                        if (r.wrap && r.flags) {
                            for (; fe < 32;) {
                                if (0 === se)
                                    break e;
                                se--, oe += ee[re++] << fe, fe += 8;
                            }
                            if (oe !== (4294967295 & r.total)) {
                                e.msg = "incorrect length check", r.mode = J;
                                break;
                            }
                            oe = 0, fe = 0;
                        }
                        r.mode = Y;
                    case Y:
                        ke = b;
                        break e;
                    case J:
                        ke = y;
                        break e;
                    case $: return v;
                    case Q:
                    default: return g;
                } return e.next_out = ie, e.avail_out = ae, e.next_in = re, e.avail_in = se, r.hold = oe, r.bits = fe, (r.wsize || he !== e.avail_out && r.mode < J && (r.mode < V || t !== u)) && de(e, e.output, e.next_out, he - e.avail_out) ? (r.mode = $, v) : (ce -= e.avail_in, he -= e.avail_out, e.total_in += ce, e.total_out += he, r.total += he, r.wrap && he && (e.adler = r.check = r.flags ? s(r.check, te, he, e.next_out - he) : i(r.check, te, he, e.next_out - he)), e.data_type = r.bits + (r.last ? 64 : 0) + (r.mode === C ? 128 : 0) + (r.mode === q || r.mode === L ? 256 : 0), (0 === ce && 0 === he || t === u) && ke === p && (ke = _), ke); }, r.inflateEnd = function (e) { if (!e || !e.state)
                return g; var t = e.state; return t.window && (t.window = null), e.state = null, p; }, r.inflateGetHeader = function (e, t) { var r; return e && e.state ? 0 == (2 & (r = e.state).wrap) ? g : (r.head = t, t.done = !1, p) : g; }, r.inflateSetDictionary = function (e, t) { var r, n = t.length; return e && e.state ? 0 !== (r = e.state).wrap && r.mode !== T ? g : r.mode === T && i(1, t, n, 0) !== r.check ? y : de(e, t, n, n) ? (r.mode = $, v) : (r.havedict = 1, p) : g; }, r.inflateInfo = "pako inflate (from Nodeca project)";
        }, { "../utils/common": 118, "./adler32": 119, "./crc32": 121, "./inffast": 123, "./inftrees": 125 }], 125: [function (e, t, r) {
            "use strict";
            var n = e("../utils/common"), i = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], s = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], a = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], o = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
            t.exports = function (e, t, r, f, c, h, u, d) { var l, p, b, m, g, y, v, _, w, E = d.bits, k = 0, S = 0, x = 0, A = 0, M = 0, I = 0, B = 0, j = 0, R = 0, T = 0, C = null, O = 0, z = new n.Buf16(16), L = new n.Buf16(16), N = null, P = 0; for (k = 0; k <= 15; k++)
                z[k] = 0; for (S = 0; S < f; S++)
                z[t[r + S]]++; for (M = E, A = 15; A >= 1 && 0 === z[A]; A--)
                ; if (M > A && (M = A), 0 === A)
                return c[h++] = 20971520, c[h++] = 20971520, d.bits = 1, 0; for (x = 1; x < A && 0 === z[x]; x++)
                ; for (M < x && (M = x), j = 1, k = 1; k <= 15; k++)
                if (j <<= 1, (j -= z[k]) < 0)
                    return -1; if (j > 0 && (0 === e || 1 !== A))
                return -1; for (L[1] = 0, k = 1; k < 15; k++)
                L[k + 1] = L[k] + z[k]; for (S = 0; S < f; S++)
                0 !== t[r + S] && (u[L[t[r + S]]++] = S); if (0 === e ? (C = N = u, y = 19) : 1 === e ? (C = i, O -= 257, N = s, P -= 257, y = 256) : (C = a, N = o, y = -1), T = 0, S = 0, k = x, g = h, I = M, B = 0, b = -1, m = (R = 1 << M) - 1, 1 === e && R > 852 || 2 === e && R > 592)
                return 1; for (;;) {
                v = k - B, u[S] < y ? (_ = 0, w = u[S]) : u[S] > y ? (_ = N[P + u[S]], w = C[O + u[S]]) : (_ = 96, w = 0), l = 1 << k - B, x = p = 1 << I;
                do {
                    c[g + (T >> B) + (p -= l)] = v << 24 | _ << 16 | w | 0;
                } while (0 !== p);
                for (l = 1 << k - 1; T & l;)
                    l >>= 1;
                if (0 !== l ? (T &= l - 1, T += l) : T = 0, S++, 0 == --z[k]) {
                    if (k === A)
                        break;
                    k = t[r + u[S]];
                }
                if (k > M && (T & m) !== b) {
                    for (0 === B && (B = M), g += x, j = 1 << (I = k - B); I + B < A && !((j -= z[I + B]) <= 0);)
                        I++, j <<= 1;
                    if (R += 1 << I, 1 === e && R > 852 || 2 === e && R > 592)
                        return 1;
                    c[b = T & m] = M << 24 | I << 16 | g - h | 0;
                }
            } return 0 !== T && (c[g + T] = k - B << 24 | 64 << 16 | 0), d.bits = M, 0; };
        }, { "../utils/common": 118 }], 126: [function (e, t, r) {
            "use strict";
            t.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
        }, {}], 127: [function (e, t, r) {
            "use strict";
            var n = e("../utils/common"), i = 4, s = 0, a = 1, o = 2;
            function f(e) { for (var t = e.length; --t >= 0;)
                e[t] = 0; }
            var c = 0, h = 1, u = 2, d = 29, l = 256, p = l + 1 + d, b = 30, m = 19, g = 2 * p + 1, y = 15, v = 16, _ = 7, w = 256, E = 16, k = 17, S = 18, x = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], A = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], M = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], I = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], B = new Array(2 * (p + 2));
            f(B);
            var j = new Array(2 * b);
            f(j);
            var R = new Array(512);
            f(R);
            var T = new Array(256);
            f(T);
            var C = new Array(d);
            f(C);
            var O, z, L, N = new Array(b);
            function P(e, t, r, n, i) { this.static_tree = e, this.extra_bits = t, this.extra_base = r, this.elems = n, this.max_length = i, this.has_stree = e && e.length; }
            function D(e, t) { this.dyn_tree = e, this.max_code = 0, this.stat_desc = t; }
            function U(e) { return e < 256 ? R[e] : R[256 + (e >>> 7)]; }
            function q(e, t) { e.pending_buf[e.pending++] = 255 & t, e.pending_buf[e.pending++] = t >>> 8 & 255; }
            function F(e, t, r) { e.bi_valid > v - r ? (e.bi_buf |= t << e.bi_valid & 65535, q(e, e.bi_buf), e.bi_buf = t >> v - e.bi_valid, e.bi_valid += r - v) : (e.bi_buf |= t << e.bi_valid & 65535, e.bi_valid += r); }
            function H(e, t, r) { F(e, r[2 * t], r[2 * t + 1]); }
            function Z(e, t) { var r = 0; do {
                r |= 1 & e, e >>>= 1, r <<= 1;
            } while (--t > 0); return r >>> 1; }
            function K(e, t, r) { var n, i, s = new Array(y + 1), a = 0; for (n = 1; n <= y; n++)
                s[n] = a = a + r[n - 1] << 1; for (i = 0; i <= t; i++) {
                var o = e[2 * i + 1];
                0 !== o && (e[2 * i] = Z(s[o]++, o));
            } }
            function W(e) { var t; for (t = 0; t < p; t++)
                e.dyn_ltree[2 * t] = 0; for (t = 0; t < b; t++)
                e.dyn_dtree[2 * t] = 0; for (t = 0; t < m; t++)
                e.bl_tree[2 * t] = 0; e.dyn_ltree[2 * w] = 1, e.opt_len = e.static_len = 0, e.last_lit = e.matches = 0; }
            function G(e) { e.bi_valid > 8 ? q(e, e.bi_buf) : e.bi_valid > 0 && (e.pending_buf[e.pending++] = e.bi_buf), e.bi_buf = 0, e.bi_valid = 0; }
            function V(e, t, r, n) { var i = 2 * t, s = 2 * r; return e[i] < e[s] || e[i] === e[s] && n[t] <= n[r]; }
            function X(e, t, r) { for (var n = e.heap[r], i = r << 1; i <= e.heap_len && (i < e.heap_len && V(t, e.heap[i + 1], e.heap[i], e.depth) && i++, !V(t, n, e.heap[i], e.depth));)
                e.heap[r] = e.heap[i], r = i, i <<= 1; e.heap[r] = n; }
            function Y(e, t, r) { var n, i, s, a, o = 0; if (0 !== e.last_lit)
                do {
                    n = e.pending_buf[e.d_buf + 2 * o] << 8 | e.pending_buf[e.d_buf + 2 * o + 1], i = e.pending_buf[e.l_buf + o], o++, 0 === n ? H(e, i, t) : (H(e, (s = T[i]) + l + 1, t), 0 !== (a = x[s]) && F(e, i -= C[s], a), H(e, s = U(--n), r), 0 !== (a = A[s]) && F(e, n -= N[s], a));
                } while (o < e.last_lit); H(e, w, t); }
            function J(e, t) { var r, n, i, s = t.dyn_tree, a = t.stat_desc.static_tree, o = t.stat_desc.has_stree, f = t.stat_desc.elems, c = -1; for (e.heap_len = 0, e.heap_max = g, r = 0; r < f; r++)
                0 !== s[2 * r] ? (e.heap[++e.heap_len] = c = r, e.depth[r] = 0) : s[2 * r + 1] = 0; for (; e.heap_len < 2;)
                s[2 * (i = e.heap[++e.heap_len] = c < 2 ? ++c : 0)] = 1, e.depth[i] = 0, e.opt_len--, o && (e.static_len -= a[2 * i + 1]); for (t.max_code = c, r = e.heap_len >> 1; r >= 1; r--)
                X(e, s, r); i = f; do {
                r = e.heap[1], e.heap[1] = e.heap[e.heap_len--], X(e, s, 1), n = e.heap[1], e.heap[--e.heap_max] = r, e.heap[--e.heap_max] = n, s[2 * i] = s[2 * r] + s[2 * n], e.depth[i] = (e.depth[r] >= e.depth[n] ? e.depth[r] : e.depth[n]) + 1, s[2 * r + 1] = s[2 * n + 1] = i, e.heap[1] = i++, X(e, s, 1);
            } while (e.heap_len >= 2); e.heap[--e.heap_max] = e.heap[1], function (e, t) { var r, n, i, s, a, o, f = t.dyn_tree, c = t.max_code, h = t.stat_desc.static_tree, u = t.stat_desc.has_stree, d = t.stat_desc.extra_bits, l = t.stat_desc.extra_base, p = t.stat_desc.max_length, b = 0; for (s = 0; s <= y; s++)
                e.bl_count[s] = 0; for (f[2 * e.heap[e.heap_max] + 1] = 0, r = e.heap_max + 1; r < g; r++)
                (s = f[2 * f[2 * (n = e.heap[r]) + 1] + 1] + 1) > p && (s = p, b++), f[2 * n + 1] = s, n > c || (e.bl_count[s]++, a = 0, n >= l && (a = d[n - l]), o = f[2 * n], e.opt_len += o * (s + a), u && (e.static_len += o * (h[2 * n + 1] + a))); if (0 !== b) {
                do {
                    for (s = p - 1; 0 === e.bl_count[s];)
                        s--;
                    e.bl_count[s]--, e.bl_count[s + 1] += 2, e.bl_count[p]--, b -= 2;
                } while (b > 0);
                for (s = p; 0 !== s; s--)
                    for (n = e.bl_count[s]; 0 !== n;)
                        (i = e.heap[--r]) > c || (f[2 * i + 1] !== s && (e.opt_len += (s - f[2 * i + 1]) * f[2 * i], f[2 * i + 1] = s), n--);
            } }(e, t), K(s, c, e.bl_count); }
            function $(e, t, r) { var n, i, s = -1, a = t[1], o = 0, f = 7, c = 4; for (0 === a && (f = 138, c = 3), t[2 * (r + 1) + 1] = 65535, n = 0; n <= r; n++)
                i = a, a = t[2 * (n + 1) + 1], ++o < f && i === a || (o < c ? e.bl_tree[2 * i] += o : 0 !== i ? (i !== s && e.bl_tree[2 * i]++, e.bl_tree[2 * E]++) : o <= 10 ? e.bl_tree[2 * k]++ : e.bl_tree[2 * S]++, o = 0, s = i, 0 === a ? (f = 138, c = 3) : i === a ? (f = 6, c = 3) : (f = 7, c = 4)); }
            function Q(e, t, r) { var n, i, s = -1, a = t[1], o = 0, f = 7, c = 4; for (0 === a && (f = 138, c = 3), n = 0; n <= r; n++)
                if (i = a, a = t[2 * (n + 1) + 1], !(++o < f && i === a)) {
                    if (o < c)
                        do {
                            H(e, i, e.bl_tree);
                        } while (0 != --o);
                    else
                        0 !== i ? (i !== s && (H(e, i, e.bl_tree), o--), H(e, E, e.bl_tree), F(e, o - 3, 2)) : o <= 10 ? (H(e, k, e.bl_tree), F(e, o - 3, 3)) : (H(e, S, e.bl_tree), F(e, o - 11, 7));
                    o = 0, s = i, 0 === a ? (f = 138, c = 3) : i === a ? (f = 6, c = 3) : (f = 7, c = 4);
                } }
            f(N);
            var ee = !1;
            function te(e, t, r, i) { F(e, (c << 1) + (i ? 1 : 0), 3), function (e, t, r, i) { G(e), i && (q(e, r), q(e, ~r)), n.arraySet(e.pending_buf, e.window, t, r, e.pending), e.pending += r; }(e, t, r, !0); }
            r._tr_init = function (e) { ee || (function () { var e, t, r, n, i, s = new Array(y + 1); for (r = 0, n = 0; n < d - 1; n++)
                for (C[n] = r, e = 0; e < 1 << x[n]; e++)
                    T[r++] = n; for (T[r - 1] = n, i = 0, n = 0; n < 16; n++)
                for (N[n] = i, e = 0; e < 1 << A[n]; e++)
                    R[i++] = n; for (i >>= 7; n < b; n++)
                for (N[n] = i << 7, e = 0; e < 1 << A[n] - 7; e++)
                    R[256 + i++] = n; for (t = 0; t <= y; t++)
                s[t] = 0; for (e = 0; e <= 143;)
                B[2 * e + 1] = 8, e++, s[8]++; for (; e <= 255;)
                B[2 * e + 1] = 9, e++, s[9]++; for (; e <= 279;)
                B[2 * e + 1] = 7, e++, s[7]++; for (; e <= 287;)
                B[2 * e + 1] = 8, e++, s[8]++; for (K(B, p + 1, s), e = 0; e < b; e++)
                j[2 * e + 1] = 5, j[2 * e] = Z(e, 5); O = new P(B, x, l + 1, p, y), z = new P(j, A, 0, b, y), L = new P(new Array(0), M, 0, m, _); }(), ee = !0), e.l_desc = new D(e.dyn_ltree, O), e.d_desc = new D(e.dyn_dtree, z), e.bl_desc = new D(e.bl_tree, L), e.bi_buf = 0, e.bi_valid = 0, W(e); }, r._tr_stored_block = te, r._tr_flush_block = function (e, t, r, n) { var f, c, d = 0; e.level > 0 ? (e.strm.data_type === o && (e.strm.data_type = function (e) { var t, r = 4093624447; for (t = 0; t <= 31; t++, r >>>= 1)
                if (1 & r && 0 !== e.dyn_ltree[2 * t])
                    return s; if (0 !== e.dyn_ltree[18] || 0 !== e.dyn_ltree[20] || 0 !== e.dyn_ltree[26])
                return a; for (t = 32; t < l; t++)
                if (0 !== e.dyn_ltree[2 * t])
                    return a; return s; }(e)), J(e, e.l_desc), J(e, e.d_desc), d = function (e) { var t; for ($(e, e.dyn_ltree, e.l_desc.max_code), $(e, e.dyn_dtree, e.d_desc.max_code), J(e, e.bl_desc), t = m - 1; t >= 3 && 0 === e.bl_tree[2 * I[t] + 1]; t--)
                ; return e.opt_len += 3 * (t + 1) + 5 + 5 + 4, t; }(e), f = e.opt_len + 3 + 7 >>> 3, (c = e.static_len + 3 + 7 >>> 3) <= f && (f = c)) : f = c = r + 5, r + 4 <= f && -1 !== t ? te(e, t, r, n) : e.strategy === i || c === f ? (F(e, (h << 1) + (n ? 1 : 0), 3), Y(e, B, j)) : (F(e, (u << 1) + (n ? 1 : 0), 3), function (e, t, r, n) { var i; for (F(e, t - 257, 5), F(e, r - 1, 5), F(e, n - 4, 4), i = 0; i < n; i++)
                F(e, e.bl_tree[2 * I[i] + 1], 3); Q(e, e.dyn_ltree, t - 1), Q(e, e.dyn_dtree, r - 1); }(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, d + 1), Y(e, e.dyn_ltree, e.dyn_dtree)), W(e), n && G(e); }, r._tr_tally = function (e, t, r) { return e.pending_buf[e.d_buf + 2 * e.last_lit] = t >>> 8 & 255, e.pending_buf[e.d_buf + 2 * e.last_lit + 1] = 255 & t, e.pending_buf[e.l_buf + e.last_lit] = 255 & r, e.last_lit++, 0 === t ? e.dyn_ltree[2 * r]++ : (e.matches++, t--, e.dyn_ltree[2 * (T[r] + l + 1)]++, e.dyn_dtree[2 * U(t)]++), e.last_lit === e.lit_bufsize - 1; }, r._tr_align = function (e) { F(e, h << 1, 3), H(e, w, B), function (e) { 16 === e.bi_valid ? (q(e, e.bi_buf), e.bi_buf = 0, e.bi_valid = 0) : e.bi_valid >= 8 && (e.pending_buf[e.pending++] = 255 & e.bi_buf, e.bi_buf >>= 8, e.bi_valid -= 8); }(e); };
        }, { "../utils/common": 118 }], 128: [function (e, t, r) {
            "use strict";
            t.exports = function () { this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0; };
        }, {}], 129: [function (e, t, r) { t.exports = { "2.16.840.1.101.3.4.1.1": "aes-128-ecb", "2.16.840.1.101.3.4.1.2": "aes-128-cbc", "2.16.840.1.101.3.4.1.3": "aes-128-ofb", "2.16.840.1.101.3.4.1.4": "aes-128-cfb", "2.16.840.1.101.3.4.1.21": "aes-192-ecb", "2.16.840.1.101.3.4.1.22": "aes-192-cbc", "2.16.840.1.101.3.4.1.23": "aes-192-ofb", "2.16.840.1.101.3.4.1.24": "aes-192-cfb", "2.16.840.1.101.3.4.1.41": "aes-256-ecb", "2.16.840.1.101.3.4.1.42": "aes-256-cbc", "2.16.840.1.101.3.4.1.43": "aes-256-ofb", "2.16.840.1.101.3.4.1.44": "aes-256-cfb" }; }, {}], 130: [function (e, t, r) {
            "use strict";
            var n = e("asn1.js");
            r.certificate = e("./certificate");
            var i = n.define("RSAPrivateKey", function () { this.seq().obj(this.key("version").int(), this.key("modulus").int(), this.key("publicExponent").int(), this.key("privateExponent").int(), this.key("prime1").int(), this.key("prime2").int(), this.key("exponent1").int(), this.key("exponent2").int(), this.key("coefficient").int()); });
            r.RSAPrivateKey = i;
            var s = n.define("RSAPublicKey", function () { this.seq().obj(this.key("modulus").int(), this.key("publicExponent").int()); });
            r.RSAPublicKey = s;
            var a = n.define("SubjectPublicKeyInfo", function () { this.seq().obj(this.key("algorithm").use(o), this.key("subjectPublicKey").bitstr()); });
            r.PublicKey = a;
            var o = n.define("AlgorithmIdentifier", function () { this.seq().obj(this.key("algorithm").objid(), this.key("none").null_().optional(), this.key("curve").objid().optional(), this.key("params").seq().obj(this.key("p").int(), this.key("q").int(), this.key("g").int()).optional()); }), f = n.define("PrivateKeyInfo", function () { this.seq().obj(this.key("version").int(), this.key("algorithm").use(o), this.key("subjectPrivateKey").octstr()); });
            r.PrivateKey = f;
            var c = n.define("EncryptedPrivateKeyInfo", function () { this.seq().obj(this.key("algorithm").seq().obj(this.key("id").objid(), this.key("decrypt").seq().obj(this.key("kde").seq().obj(this.key("id").objid(), this.key("kdeparams").seq().obj(this.key("salt").octstr(), this.key("iters").int())), this.key("cipher").seq().obj(this.key("algo").objid(), this.key("iv").octstr()))), this.key("subjectPrivateKey").octstr()); });
            r.EncryptedPrivateKey = c;
            var h = n.define("DSAPrivateKey", function () { this.seq().obj(this.key("version").int(), this.key("p").int(), this.key("q").int(), this.key("g").int(), this.key("pub_key").int(), this.key("priv_key").int()); });
            r.DSAPrivateKey = h, r.DSAparam = n.define("DSAparam", function () { this.int(); });
            var u = n.define("ECPrivateKey", function () { this.seq().obj(this.key("version").int(), this.key("privateKey").octstr(), this.key("parameters").optional().explicit(0).use(d), this.key("publicKey").optional().explicit(1).bitstr()); });
            r.ECPrivateKey = u;
            var d = n.define("ECParameters", function () { this.choice({ namedCurve: this.objid() }); });
            r.signature = n.define("signature", function () { this.seq().obj(this.key("r").int(), this.key("s").int()); });
        }, { "./certificate": 131, "asn1.js": 1 }], 131: [function (e, t, r) {
            "use strict";
            var n = e("asn1.js"), i = n.define("Time", function () { this.choice({ utcTime: this.utctime(), generalTime: this.gentime() }); }), s = n.define("AttributeTypeValue", function () { this.seq().obj(this.key("type").objid(), this.key("value").any()); }), a = n.define("AlgorithmIdentifier", function () { this.seq().obj(this.key("algorithm").objid(), this.key("parameters").optional()); }), o = n.define("SubjectPublicKeyInfo", function () { this.seq().obj(this.key("algorithm").use(a), this.key("subjectPublicKey").bitstr()); }), f = n.define("RelativeDistinguishedName", function () { this.setof(s); }), c = n.define("RDNSequence", function () { this.seqof(f); }), h = n.define("Name", function () { this.choice({ rdnSequence: this.use(c) }); }), u = n.define("Validity", function () { this.seq().obj(this.key("notBefore").use(i), this.key("notAfter").use(i)); }), d = n.define("Extension", function () { this.seq().obj(this.key("extnID").objid(), this.key("critical").bool().def(!1), this.key("extnValue").octstr()); }), l = n.define("TBSCertificate", function () { this.seq().obj(this.key("version").explicit(0).int(), this.key("serialNumber").int(), this.key("signature").use(a), this.key("issuer").use(h), this.key("validity").use(u), this.key("subject").use(h), this.key("subjectPublicKeyInfo").use(o), this.key("issuerUniqueID").implicit(1).bitstr().optional(), this.key("subjectUniqueID").implicit(2).bitstr().optional(), this.key("extensions").explicit(3).seqof(d).optional()); }), p = n.define("X509Certificate", function () { this.seq().obj(this.key("tbsCertificate").use(l), this.key("signatureAlgorithm").use(a), this.key("signatureValue").bitstr()); });
            t.exports = p;
        }, { "asn1.js": 1 }], 132: [function (e, t, r) { (function (r) { var n = /Proc-Type: 4,ENCRYPTED\n\r?DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)\n\r?\n\r?([0-9A-z\n\r\+\/\=]+)\n\r?/m, i = /^-----BEGIN ((?:.* KEY)|CERTIFICATE)-----\n/m, s = /^-----BEGIN ((?:.* KEY)|CERTIFICATE)-----\n\r?([0-9A-z\n\r\+\/\=]+)\n\r?-----END \1-----$/m, a = e("evp_bytestokey"), o = e("browserify-aes"); t.exports = function (e, t) { var f, c = e.toString(), h = c.match(n); if (h) {
            var u = "aes" + h[1], d = new r(h[2], "hex"), l = new r(h[3].replace(/\r?\n/g, ""), "base64"), p = a(t, d.slice(0, 8), parseInt(h[1], 10)).key, b = [], m = o.createDecipheriv(u, p, d);
            b.push(m.update(l)), b.push(m.final()), f = r.concat(b);
        }
        else {
            var g = c.match(s);
            f = new r(g[2].replace(/\r?\n/g, ""), "base64");
        } return { tag: c.match(i)[1], data: f }; }; }).call(this, e("buffer").Buffer); }, { "browserify-aes": 22, buffer: 51, evp_bytestokey: 90 }], 133: [function (e, t, r) { (function (r) { var n = e("./asn1"), i = e("./aesid.json"), s = e("./fixProc"), a = e("browserify-aes"), o = e("pbkdf2"); function f(e) { var t; "object" != typeof e || r.isBuffer(e) || (t = e.passphrase, e = e.key), "string" == typeof e && (e = new r(e)); var f, c, h = s(e, t), u = h.tag, d = h.data; switch (u) {
            case "CERTIFICATE": c = n.certificate.decode(d, "der").tbsCertificate.subjectPublicKeyInfo;
            case "PUBLIC KEY":
                switch (c || (c = n.PublicKey.decode(d, "der")), f = c.algorithm.algorithm.join(".")) {
                    case "1.2.840.113549.1.1.1": return n.RSAPublicKey.decode(c.subjectPublicKey.data, "der");
                    case "1.2.840.10045.2.1": return c.subjectPrivateKey = c.subjectPublicKey, { type: "ec", data: c };
                    case "1.2.840.10040.4.1": return c.algorithm.params.pub_key = n.DSAparam.decode(c.subjectPublicKey.data, "der"), { type: "dsa", data: c.algorithm.params };
                    default: throw new Error("unknown key id " + f);
                }
                throw new Error("unknown key type " + u);
            case "ENCRYPTED PRIVATE KEY": d = function (e, t) { var n = e.algorithm.decrypt.kde.kdeparams.salt, s = parseInt(e.algorithm.decrypt.kde.kdeparams.iters.toString(), 10), f = i[e.algorithm.decrypt.cipher.algo.join(".")], c = e.algorithm.decrypt.cipher.iv, h = e.subjectPrivateKey, u = parseInt(f.split("-")[1], 10) / 8, d = o.pbkdf2Sync(t, n, s, u), l = a.createDecipheriv(f, d, c), p = []; return p.push(l.update(h)), p.push(l.final()), r.concat(p); }(d = n.EncryptedPrivateKey.decode(d, "der"), t);
            case "PRIVATE KEY":
                switch (f = (c = n.PrivateKey.decode(d, "der")).algorithm.algorithm.join(".")) {
                    case "1.2.840.113549.1.1.1": return n.RSAPrivateKey.decode(c.subjectPrivateKey, "der");
                    case "1.2.840.10045.2.1": return { curve: c.algorithm.curve, privateKey: n.ECPrivateKey.decode(c.subjectPrivateKey, "der").privateKey };
                    case "1.2.840.10040.4.1": return c.algorithm.params.priv_key = n.DSAparam.decode(c.subjectPrivateKey, "der"), { type: "dsa", params: c.algorithm.params };
                    default: throw new Error("unknown key id " + f);
                }
                throw new Error("unknown key type " + u);
            case "RSA PUBLIC KEY": return n.RSAPublicKey.decode(d, "der");
            case "RSA PRIVATE KEY": return n.RSAPrivateKey.decode(d, "der");
            case "DSA PRIVATE KEY": return { type: "dsa", params: n.DSAPrivateKey.decode(d, "der") };
            case "EC PRIVATE KEY": return { curve: (d = n.ECPrivateKey.decode(d, "der")).parameters.value, privateKey: d.privateKey };
            default: throw new Error("unknown key type " + u);
        } } t.exports = f, f.signature = n.signature; }).call(this, e("buffer").Buffer); }, { "./aesid.json": 129, "./asn1": 130, "./fixProc": 132, "browserify-aes": 22, buffer: 51, pbkdf2: 135 }], 134: [function (e, t, r) { (function (e) { function t(e, t) { for (var r = 0, n = e.length - 1; n >= 0; n--) {
            var i = e[n];
            "." === i ? e.splice(n, 1) : ".." === i ? (e.splice(n, 1), r++) : r && (e.splice(n, 1), r--);
        } if (t)
            for (; r--; r)
                e.unshift(".."); return e; } var n = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/, i = function (e) { return n.exec(e).slice(1); }; function s(e, t) { if (e.filter)
            return e.filter(t); for (var r = [], n = 0; n < e.length; n++)
            t(e[n], n, e) && r.push(e[n]); return r; } r.resolve = function () { for (var r = "", n = !1, i = arguments.length - 1; i >= -1 && !n; i--) {
            var a = i >= 0 ? arguments[i] : e.cwd();
            if ("string" != typeof a)
                throw new TypeError("Arguments to path.resolve must be strings");
            a && (r = a + "/" + r, n = "/" === a.charAt(0));
        } return r = t(s(r.split("/"), function (e) { return !!e; }), !n).join("/"), (n ? "/" : "") + r || "."; }, r.normalize = function (e) { var n = r.isAbsolute(e), i = "/" === a(e, -1); return (e = t(s(e.split("/"), function (e) { return !!e; }), !n).join("/")) || n || (e = "."), e && i && (e += "/"), (n ? "/" : "") + e; }, r.isAbsolute = function (e) { return "/" === e.charAt(0); }, r.join = function () { var e = Array.prototype.slice.call(arguments, 0); return r.normalize(s(e, function (e, t) { if ("string" != typeof e)
            throw new TypeError("Arguments to path.join must be strings"); return e; }).join("/")); }, r.relative = function (e, t) { function n(e) { for (var t = 0; t < e.length && "" === e[t]; t++)
            ; for (var r = e.length - 1; r >= 0 && "" === e[r]; r--)
            ; return t > r ? [] : e.slice(t, r - t + 1); } e = r.resolve(e).substr(1), t = r.resolve(t).substr(1); for (var i = n(e.split("/")), s = n(t.split("/")), a = Math.min(i.length, s.length), o = a, f = 0; f < a; f++)
            if (i[f] !== s[f]) {
                o = f;
                break;
            } var c = []; for (f = o; f < i.length; f++)
            c.push(".."); return (c = c.concat(s.slice(o))).join("/"); }, r.sep = "/", r.delimiter = ":", r.dirname = function (e) { var t = i(e), r = t[0], n = t[1]; return r || n ? (n && (n = n.substr(0, n.length - 1)), r + n) : "."; }, r.basename = function (e, t) { var r = i(e)[2]; return t && r.substr(-1 * t.length) === t && (r = r.substr(0, r.length - t.length)), r; }, r.extname = function (e) { return i(e)[3]; }; var a = "b" === "ab".substr(-1) ? function (e, t, r) { return e.substr(t, r); } : function (e, t, r) { return t < 0 && (t = e.length + t), e.substr(t, r); }; }).call(this, e("_process")); }, { _process: 141 }], 135: [function (e, t, r) { r.pbkdf2 = e("./lib/async"), r.pbkdf2Sync = e("./lib/sync"); }, { "./lib/async": 136, "./lib/sync": 139 }], 136: [function (e, t, r) { (function (r, n) { var i, s = e("./precondition"), a = e("./default-encoding"), o = e("./sync"), f = e("safe-buffer").Buffer, c = n.crypto && n.crypto.subtle, h = { sha: "SHA-1", "sha-1": "SHA-1", sha1: "SHA-1", sha256: "SHA-256", "sha-256": "SHA-256", sha384: "SHA-384", "sha-384": "SHA-384", "sha-512": "SHA-512", sha512: "SHA-512" }, u = []; function d(e, t, r, n, i) { return c.importKey("raw", e, { name: "PBKDF2" }, !1, ["deriveBits"]).then(function (e) { return c.deriveBits({ name: "PBKDF2", salt: t, iterations: r, hash: { name: i } }, e, n << 3); }).then(function (e) { return f.from(e); }); } t.exports = function (e, t, l, p, b, m) { if (f.isBuffer(e) || (e = f.from(e, a)), f.isBuffer(t) || (t = f.from(t, a)), s(l, p), "function" == typeof b && (m = b, b = void 0), "function" != typeof m)
            throw new Error("No callback provided to pbkdf2"); var g = h[(b = b || "sha1").toLowerCase()]; if (!g || "function" != typeof n.Promise)
            return r.nextTick(function () { var r; try {
                r = o(e, t, l, p, b);
            }
            catch (e) {
                return m(e);
            } m(null, r); }); !function (e, t) { e.then(function (e) { r.nextTick(function () { t(null, e); }); }, function (e) { r.nextTick(function () { t(e); }); }); }(function (e) { if (n.process && !n.process.browser)
            return Promise.resolve(!1); if (!c || !c.importKey || !c.deriveBits)
            return Promise.resolve(!1); if (void 0 !== u[e])
            return u[e]; var t = d(i = i || f.alloc(8), i, 10, 128, e).then(function () { return !0; }).catch(function () { return !1; }); return u[e] = t, t; }(g).then(function (r) { return r ? d(e, t, l, p, g) : o(e, t, l, p, b); }), m); }; }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}); }, { "./default-encoding": 137, "./precondition": 138, "./sync": 139, _process: 141, "safe-buffer": 168 }], 137: [function (e, t, r) { (function (e) { var r; e.browser ? r = "utf-8" : r = parseInt(e.version.split(".")[0].slice(1), 10) >= 6 ? "utf-8" : "binary"; t.exports = r; }).call(this, e("_process")); }, { _process: 141 }], 138: [function (e, t, r) { var n = Math.pow(2, 30) - 1; t.exports = function (e, t) { if ("number" != typeof e)
            throw new TypeError("Iterations not a number"); if (e < 0)
            throw new TypeError("Bad iterations"); if ("number" != typeof t)
            throw new TypeError("Key length not a number"); if (t < 0 || t > n || t != t)
            throw new TypeError("Bad key length"); }; }, {}], 139: [function (e, t, r) { var n = e("create-hash/md5"), i = e("ripemd160"), s = e("sha.js"), a = e("./precondition"), o = e("./default-encoding"), f = e("safe-buffer").Buffer, c = f.alloc(128), h = { md5: 16, sha1: 20, sha224: 28, sha256: 32, sha384: 48, sha512: 64, rmd160: 20, ripemd160: 20 }; function u(e, t, r) { var a = function (e) { return "rmd160" === e || "ripemd160" === e ? i : "md5" === e ? n : function (t) { return s(e).update(t).digest(); }; }(e), o = "sha512" === e || "sha384" === e ? 128 : 64; t.length > o ? t = a(t) : t.length < o && (t = f.concat([t, c], o)); for (var u = f.allocUnsafe(o + h[e]), d = f.allocUnsafe(o + h[e]), l = 0; l < o; l++)
            u[l] = 54 ^ t[l], d[l] = 92 ^ t[l]; var p = f.allocUnsafe(o + r + 4); u.copy(p, 0, 0, o), this.ipad1 = p, this.ipad2 = u, this.opad = d, this.alg = e, this.blocksize = o, this.hash = a, this.size = h[e]; } u.prototype.run = function (e, t) { return e.copy(t, this.blocksize), this.hash(t).copy(this.opad, this.blocksize), this.hash(this.opad); }, t.exports = function (e, t, r, n, i) { f.isBuffer(e) || (e = f.from(e, o)), f.isBuffer(t) || (t = f.from(t, o)), a(r, n); var s = new u(i = i || "sha1", e, t.length), c = f.allocUnsafe(n), d = f.allocUnsafe(t.length + 4); t.copy(d, 0, 0, t.length); for (var l = 0, p = h[i], b = Math.ceil(n / p), m = 1; m <= b; m++) {
            d.writeUInt32BE(m, t.length);
            for (var g = s.run(d, s.ipad1), y = g, v = 1; v < r; v++) {
                y = s.run(y, s.ipad2);
                for (var _ = 0; _ < p; _++)
                    g[_] ^= y[_];
            }
            g.copy(c, l), l += p;
        } return c; }; }, { "./default-encoding": 137, "./precondition": 138, "create-hash/md5": 58, ripemd160: 167, "safe-buffer": 168, "sha.js": 170 }], 140: [function (e, t, r) { (function (e) {
            "use strict";
            !e.version || 0 === e.version.indexOf("v0.") || 0 === e.version.indexOf("v1.") && 0 !== e.version.indexOf("v1.8.") ? t.exports = { nextTick: function (t, r, n, i) { if ("function" != typeof t)
                    throw new TypeError('"callback" argument must be a function'); var s, a, o = arguments.length; switch (o) {
                    case 0:
                    case 1: return e.nextTick(t);
                    case 2: return e.nextTick(function () { t.call(null, r); });
                    case 3: return e.nextTick(function () { t.call(null, r, n); });
                    case 4: return e.nextTick(function () { t.call(null, r, n, i); });
                    default:
                        for (s = new Array(o - 1), a = 0; a < s.length;)
                            s[a++] = arguments[a];
                        return e.nextTick(function () { t.apply(null, s); });
                } } } : t.exports = e;
        }).call(this, e("_process")); }, { _process: 141 }], 141: [function (e, t, r) { var n, i, s = t.exports = {}; function a() { throw new Error("setTimeout has not been defined"); } function o() { throw new Error("clearTimeout has not been defined"); } function f(e) { if (n === setTimeout)
            return setTimeout(e, 0); if ((n === a || !n) && setTimeout)
            return n = setTimeout, setTimeout(e, 0); try {
            return n(e, 0);
        }
        catch (t) {
            try {
                return n.call(null, e, 0);
            }
            catch (t) {
                return n.call(this, e, 0);
            }
        } } !function () { try {
            n = "function" == typeof setTimeout ? setTimeout : a;
        }
        catch (e) {
            n = a;
        } try {
            i = "function" == typeof clearTimeout ? clearTimeout : o;
        }
        catch (e) {
            i = o;
        } }(); var c, h = [], u = !1, d = -1; function l() { u && c && (u = !1, c.length ? h = c.concat(h) : d = -1, h.length && p()); } function p() { if (!u) {
            var e = f(l);
            u = !0;
            for (var t = h.length; t;) {
                for (c = h, h = []; ++d < t;)
                    c && c[d].run();
                d = -1, t = h.length;
            }
            c = null, u = !1, function (e) { if (i === clearTimeout)
                return clearTimeout(e); if ((i === o || !i) && clearTimeout)
                return i = clearTimeout, clearTimeout(e); try {
                i(e);
            }
            catch (t) {
                try {
                    return i.call(null, e);
                }
                catch (t) {
                    return i.call(this, e);
                }
            } }(e);
        } } function b(e, t) { this.fun = e, this.array = t; } function m() { } s.nextTick = function (e) { var t = new Array(arguments.length - 1); if (arguments.length > 1)
            for (var r = 1; r < arguments.length; r++)
                t[r - 1] = arguments[r]; h.push(new b(e, t)), 1 !== h.length || u || f(p); }, b.prototype.run = function () { this.fun.apply(null, this.array); }, s.title = "browser", s.browser = !0, s.env = {}, s.argv = [], s.version = "", s.versions = {}, s.on = m, s.addListener = m, s.once = m, s.off = m, s.removeListener = m, s.removeAllListeners = m, s.emit = m, s.prependListener = m, s.prependOnceListener = m, s.listeners = function (e) { return []; }, s.binding = function (e) { throw new Error("process.binding is not supported"); }, s.cwd = function () { return "/"; }, s.chdir = function (e) { throw new Error("process.chdir is not supported"); }, s.umask = function () { return 0; }; }, {}], 142: [function (e, t, r) { r.publicEncrypt = e("./publicEncrypt"), r.privateDecrypt = e("./privateDecrypt"), r.privateEncrypt = function (e, t) { return r.publicEncrypt(e, t, !0); }, r.publicDecrypt = function (e, t) { return r.privateDecrypt(e, t, !0); }; }, { "./privateDecrypt": 144, "./publicEncrypt": 145 }], 143: [function (e, t, r) { (function (r) { var n = e("create-hash"); function i(e) { var t = new r(4); return t.writeUInt32BE(e, 0), t; } t.exports = function (e, t) { for (var s, a = new r(""), o = 0; a.length < t;)
            s = i(o++), a = r.concat([a, n("sha1").update(e).update(s).digest()]); return a.slice(0, t); }; }).call(this, e("buffer").Buffer); }, { buffer: 51, "create-hash": 56 }], 144: [function (e, t, r) { (function (r) { var n = e("parse-asn1"), i = e("./mgf"), s = e("./xor"), a = e("bn.js"), o = e("browserify-rsa"), f = e("create-hash"), c = e("./withPublic"); t.exports = function (e, t, h) { var u; u = e.padding ? e.padding : h ? 1 : 4; var d, l = n(e), p = l.modulus.byteLength(); if (t.length > p || new a(t).cmp(l.modulus) >= 0)
            throw new Error("decryption error"); d = h ? c(new a(t), l) : o(t, l); var b = new r(p - d.length); if (b.fill(0), d = r.concat([b, d], p), 4 === u)
            return function (e, t) { e.modulus; var n = e.modulus.byteLength(), a = (t.length, f("sha1").update(new r("")).digest()), o = a.length; if (0 !== t[0])
                throw new Error("decryption error"); var c = t.slice(1, o + 1), h = t.slice(o + 1), u = s(c, i(h, o)), d = s(h, i(u, n - o - 1)); if (function (e, t) { e = new r(e), t = new r(t); var n = 0, i = e.length; e.length !== t.length && (n++, i = Math.min(e.length, t.length)); var s = -1; for (; ++s < i;)
                n += e[s] ^ t[s]; return n; }(a, d.slice(0, o)))
                throw new Error("decryption error"); var l = o; for (; 0 === d[l];)
                l++; if (1 !== d[l++])
                throw new Error("decryption error"); return d.slice(l); }(l, d); if (1 === u)
            return function (e, t, r) { var n = t.slice(0, 2), i = 2, s = 0; for (; 0 !== t[i++];)
                if (i >= t.length) {
                    s++;
                    break;
                } var a = t.slice(2, i - 1); t.slice(i - 1, i); ("0002" !== n.toString("hex") && !r || "0001" !== n.toString("hex") && r) && s++; a.length < 8 && s++; if (s)
                throw new Error("decryption error"); return t.slice(i); }(0, d, h); if (3 === u)
            return d; throw new Error("unknown padding"); }; }).call(this, e("buffer").Buffer); }, { "./mgf": 143, "./withPublic": 146, "./xor": 147, "bn.js": 17, "browserify-rsa": 40, buffer: 51, "create-hash": 56, "parse-asn1": 133 }], 145: [function (e, t, r) { (function (r) { var n = e("parse-asn1"), i = e("randombytes"), s = e("create-hash"), a = e("./mgf"), o = e("./xor"), f = e("bn.js"), c = e("./withPublic"), h = e("browserify-rsa"); t.exports = function (e, t, u) { var d; d = e.padding ? e.padding : u ? 1 : 4; var l, p = n(e); if (4 === d)
            l = function (e, t) { var n = e.modulus.byteLength(), c = t.length, h = s("sha1").update(new r("")).digest(), u = h.length, d = 2 * u; if (c > n - d - 2)
                throw new Error("message too long"); var l = new r(n - c - d - 2); l.fill(0); var p = n - u - 1, b = i(u), m = o(r.concat([h, l, new r([1]), t], p), a(b, p)), g = o(b, a(m, u)); return new f(r.concat([new r([0]), g, m], n)); }(p, t);
        else if (1 === d)
            l = function (e, t, n) { var s, a = t.length, o = e.modulus.byteLength(); if (a > o - 11)
                throw new Error("message too long"); n ? (s = new r(o - a - 3)).fill(255) : s = function (e, t) { var n, s = new r(e), a = 0, o = i(2 * e), f = 0; for (; a < e;)
                f === o.length && (o = i(2 * e), f = 0), (n = o[f++]) && (s[a++] = n); return s; }(o - a - 3); return new f(r.concat([new r([0, n ? 1 : 2]), s, new r([0]), t], o)); }(p, t, u);
        else {
            if (3 !== d)
                throw new Error("unknown padding");
            if ((l = new f(t)).cmp(p.modulus) >= 0)
                throw new Error("data too long for modulus");
        } return u ? h(l, p) : c(l, p); }; }).call(this, e("buffer").Buffer); }, { "./mgf": 143, "./withPublic": 146, "./xor": 147, "bn.js": 17, "browserify-rsa": 40, buffer: 51, "create-hash": 56, "parse-asn1": 133, randombytes: 152 }], 146: [function (e, t, r) { (function (r) { var n = e("bn.js"); t.exports = function (e, t) { return new r(e.toRed(n.mont(t.modulus)).redPow(new n(t.publicExponent)).fromRed().toArray()); }; }).call(this, e("buffer").Buffer); }, { "bn.js": 17, buffer: 51 }], 147: [function (e, t, r) { t.exports = function (e, t) { for (var r = e.length, n = -1; ++n < r;)
            e[n] ^= t[n]; return e; }; }, {}], 148: [function (e, t, r) { (function (e) { !function (n) { var i = "object" == typeof r && r && !r.nodeType && r, s = "object" == typeof t && t && !t.nodeType && t, a = "object" == typeof e && e; a.global !== a && a.window !== a && a.self !== a || (n = a); var o, f, c = 2147483647, h = 36, u = 1, d = 26, l = 38, p = 700, b = 72, m = 128, g = "-", y = /^xn--/, v = /[^\x20-\x7E]/, _ = /[\x2E\u3002\uFF0E\uFF61]/g, w = { overflow: "Overflow: input needs wider integers to process", "not-basic": "Illegal input >= 0x80 (not a basic code point)", "invalid-input": "Invalid input" }, E = h - u, k = Math.floor, S = String.fromCharCode; function x(e) { throw new RangeError(w[e]); } function A(e, t) { for (var r = e.length, n = []; r--;)
            n[r] = t(e[r]); return n; } function M(e, t) { var r = e.split("@"), n = ""; return r.length > 1 && (n = r[0] + "@", e = r[1]), n + A((e = e.replace(_, ".")).split("."), t).join("."); } function I(e) { for (var t, r, n = [], i = 0, s = e.length; i < s;)
            (t = e.charCodeAt(i++)) >= 55296 && t <= 56319 && i < s ? 56320 == (64512 & (r = e.charCodeAt(i++))) ? n.push(((1023 & t) << 10) + (1023 & r) + 65536) : (n.push(t), i--) : n.push(t); return n; } function B(e) { return A(e, function (e) { var t = ""; return e > 65535 && (t += S((e -= 65536) >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), t += S(e); }).join(""); } function j(e, t) { return e + 22 + 75 * (e < 26) - ((0 != t) << 5); } function R(e, t, r) { var n = 0; for (e = r ? k(e / p) : e >> 1, e += k(e / t); e > E * d >> 1; n += h)
            e = k(e / E); return k(n + (E + 1) * e / (e + l)); } function T(e) { var t, r, n, i, s, a, o, f, l, p, y, v = [], _ = e.length, w = 0, E = m, S = b; for ((r = e.lastIndexOf(g)) < 0 && (r = 0), n = 0; n < r; ++n)
            e.charCodeAt(n) >= 128 && x("not-basic"), v.push(e.charCodeAt(n)); for (i = r > 0 ? r + 1 : 0; i < _;) {
            for (s = w, a = 1, o = h; i >= _ && x("invalid-input"), ((f = (y = e.charCodeAt(i++)) - 48 < 10 ? y - 22 : y - 65 < 26 ? y - 65 : y - 97 < 26 ? y - 97 : h) >= h || f > k((c - w) / a)) && x("overflow"), w += f * a, !(f < (l = o <= S ? u : o >= S + d ? d : o - S)); o += h)
                a > k(c / (p = h - l)) && x("overflow"), a *= p;
            S = R(w - s, t = v.length + 1, 0 == s), k(w / t) > c - E && x("overflow"), E += k(w / t), w %= t, v.splice(w++, 0, E);
        } return B(v); } function C(e) { var t, r, n, i, s, a, o, f, l, p, y, v, _, w, E, A = []; for (v = (e = I(e)).length, t = m, r = 0, s = b, a = 0; a < v; ++a)
            (y = e[a]) < 128 && A.push(S(y)); for (n = i = A.length, i && A.push(g); n < v;) {
            for (o = c, a = 0; a < v; ++a)
                (y = e[a]) >= t && y < o && (o = y);
            for (o - t > k((c - r) / (_ = n + 1)) && x("overflow"), r += (o - t) * _, t = o, a = 0; a < v; ++a)
                if ((y = e[a]) < t && ++r > c && x("overflow"), y == t) {
                    for (f = r, l = h; !(f < (p = l <= s ? u : l >= s + d ? d : l - s)); l += h)
                        E = f - p, w = h - p, A.push(S(j(p + E % w, 0))), f = k(E / w);
                    A.push(S(j(f, 0))), s = R(r, _, n == i), r = 0, ++n;
                }
            ++r, ++t;
        } return A.join(""); } if (o = { version: "1.4.1", ucs2: { decode: I, encode: B }, decode: T, encode: C, toASCII: function (e) { return M(e, function (e) { return v.test(e) ? "xn--" + C(e) : e; }); }, toUnicode: function (e) { return M(e, function (e) { return y.test(e) ? T(e.slice(4).toLowerCase()) : e; }); } }, "function" == typeof define && "object" == typeof define.amd && define.amd)
            define("punycode", function () { return o; });
        else if (i && s)
            if (t.exports == i)
                s.exports = o;
            else
                for (f in o)
                    o.hasOwnProperty(f) && (i[f] = o[f]);
        else
            n.punycode = o; }(this); }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}); }, {}], 149: [function (e, t, r) {
            "use strict";
            function n(e, t) { return Object.prototype.hasOwnProperty.call(e, t); }
            t.exports = function (e, t, r, s) { t = t || "&", r = r || "="; var a = {}; if ("string" != typeof e || 0 === e.length)
                return a; var o = /\+/g; e = e.split(t); var f = 1e3; s && "number" == typeof s.maxKeys && (f = s.maxKeys); var c = e.length; f > 0 && c > f && (c = f); for (var h = 0; h < c; ++h) {
                var u, d, l, p, b = e[h].replace(o, "%20"), m = b.indexOf(r);
                m >= 0 ? (u = b.substr(0, m), d = b.substr(m + 1)) : (u = b, d = ""), l = decodeURIComponent(u), p = decodeURIComponent(d), n(a, l) ? i(a[l]) ? a[l].push(p) : a[l] = [a[l], p] : a[l] = p;
            } return a; };
            var i = Array.isArray || function (e) { return "[object Array]" === Object.prototype.toString.call(e); };
        }, {}], 150: [function (e, t, r) {
            "use strict";
            var n = function (e) { switch (typeof e) {
                case "string": return e;
                case "boolean": return e ? "true" : "false";
                case "number": return isFinite(e) ? e : "";
                default: return "";
            } };
            t.exports = function (e, t, r, o) { return t = t || "&", r = r || "=", null === e && (e = void 0), "object" == typeof e ? s(a(e), function (a) { var o = encodeURIComponent(n(a)) + r; return i(e[a]) ? s(e[a], function (e) { return o + encodeURIComponent(n(e)); }).join(t) : o + encodeURIComponent(n(e[a])); }).join(t) : o ? encodeURIComponent(n(o)) + r + encodeURIComponent(n(e)) : ""; };
            var i = Array.isArray || function (e) { return "[object Array]" === Object.prototype.toString.call(e); };
            function s(e, t) { if (e.map)
                return e.map(t); for (var r = [], n = 0; n < e.length; n++)
                r.push(t(e[n], n)); return r; }
            var a = Object.keys || function (e) { var t = []; for (var r in e)
                Object.prototype.hasOwnProperty.call(e, r) && t.push(r); return t; };
        }, {}], 151: [function (e, t, r) {
            "use strict";
            r.decode = r.parse = e("./decode"), r.encode = r.stringify = e("./encode");
        }, { "./decode": 149, "./encode": 150 }], 152: [function (e, t, r) { (function (r, n) {
            "use strict";
            var i = e("safe-buffer").Buffer, s = n.crypto || n.msCrypto;
            s && s.getRandomValues ? t.exports = function (e, t) { if (e > 65536)
                throw new Error("requested too many random bytes"); var a = new n.Uint8Array(e); e > 0 && s.getRandomValues(a); var o = i.from(a.buffer); if ("function" == typeof t)
                return r.nextTick(function () { t(null, o); }); return o; } : t.exports = function () { throw new Error("Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11"); };
        }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}); }, { _process: 141, "safe-buffer": 168 }], 153: [function (e, t, r) { (function (t, n) {
            "use strict";
            function i() { throw new Error("secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11"); }
            var s = e("safe-buffer"), a = e("randombytes"), o = s.Buffer, f = s.kMaxLength, c = n.crypto || n.msCrypto, h = Math.pow(2, 32) - 1;
            function u(e, t) { if ("number" != typeof e || e != e)
                throw new TypeError("offset must be a number"); if (e > h || e < 0)
                throw new TypeError("offset must be a uint32"); if (e > f || e > t)
                throw new RangeError("offset out of range"); }
            function d(e, t, r) { if ("number" != typeof e || e != e)
                throw new TypeError("size must be a number"); if (e > h || e < 0)
                throw new TypeError("size must be a uint32"); if (e + t > r || e > f)
                throw new RangeError("buffer too small"); }
            function l(e, r, n, i) { if (t.browser) {
                var s = e.buffer, o = new Uint8Array(s, r, n);
                return c.getRandomValues(o), i ? void t.nextTick(function () { i(null, e); }) : e;
            } if (!i)
                return a(n).copy(e, r), e; a(n, function (t, n) { if (t)
                return i(t); n.copy(e, r), i(null, e); }); }
            c && c.getRandomValues || !t.browser ? (r.randomFill = function (e, t, r, i) { if (!(o.isBuffer(e) || e instanceof n.Uint8Array))
                throw new TypeError('"buf" argument must be a Buffer or Uint8Array'); if ("function" == typeof t)
                i = t, t = 0, r = e.length;
            else if ("function" == typeof r)
                i = r, r = e.length - t;
            else if ("function" != typeof i)
                throw new TypeError('"cb" argument must be a function'); return u(t, e.length), d(r, t, e.length), l(e, t, r, i); }, r.randomFillSync = function (e, t, r) { void 0 === t && (t = 0); if (!(o.isBuffer(e) || e instanceof n.Uint8Array))
                throw new TypeError('"buf" argument must be a Buffer or Uint8Array'); u(t, e.length), void 0 === r && (r = e.length - t); return d(r, t, e.length), l(e, t, r); }) : (r.randomFill = i, r.randomFillSync = i);
        }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}); }, { _process: 141, randombytes: 152, "safe-buffer": 168 }], 154: [function (e, t, r) { t.exports = e("./lib/_stream_duplex.js"); }, { "./lib/_stream_duplex.js": 155 }], 155: [function (e, t, r) {
            "use strict";
            var n = e("process-nextick-args"), i = Object.keys || function (e) { var t = []; for (var r in e)
                t.push(r); return t; };
            t.exports = u;
            var s = e("core-util-is");
            s.inherits = e("inherits");
            var a = e("./_stream_readable"), o = e("./_stream_writable");
            s.inherits(u, a);
            for (var f = i(o.prototype), c = 0; c < f.length; c++) {
                var h = f[c];
                u.prototype[h] || (u.prototype[h] = o.prototype[h]);
            }
            function u(e) { if (!(this instanceof u))
                return new u(e); a.call(this, e), o.call(this, e), e && !1 === e.readable && (this.readable = !1), e && !1 === e.writable && (this.writable = !1), this.allowHalfOpen = !0, e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1), this.once("end", d); }
            function d() { this.allowHalfOpen || this._writableState.ended || n.nextTick(l, this); }
            function l(e) { e.end(); }
            Object.defineProperty(u.prototype, "destroyed", { get: function () { return void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed && this._writableState.destroyed); }, set: function (e) { void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e, this._writableState.destroyed = e); } }), u.prototype._destroy = function (e, t) { this.push(null), this.end(), n.nextTick(t, e); };
        }, { "./_stream_readable": 157, "./_stream_writable": 159, "core-util-is": 54, inherits: 108, "process-nextick-args": 140 }], 156: [function (e, t, r) {
            "use strict";
            t.exports = s;
            var n = e("./_stream_transform"), i = e("core-util-is");
            function s(e) { if (!(this instanceof s))
                return new s(e); n.call(this, e); }
            i.inherits = e("inherits"), i.inherits(s, n), s.prototype._transform = function (e, t, r) { r(null, e); };
        }, { "./_stream_transform": 158, "core-util-is": 54, inherits: 108 }], 157: [function (e, t, r) { (function (r, n) {
            "use strict";
            var i = e("process-nextick-args");
            t.exports = v;
            var s, a = e("isarray");
            v.ReadableState = y;
            e("events").EventEmitter;
            var o = function (e, t) { return e.listeners(t).length; }, f = e("./internal/streams/stream"), c = e("safe-buffer").Buffer, h = n.Uint8Array || function () { };
            var u = e("core-util-is");
            u.inherits = e("inherits");
            var d = e("util"), l = void 0;
            l = d && d.debuglog ? d.debuglog("stream") : function () { };
            var p, b = e("./internal/streams/BufferList"), m = e("./internal/streams/destroy");
            u.inherits(v, f);
            var g = ["error", "close", "destroy", "pause", "resume"];
            function y(t, r) { s = s || e("./_stream_duplex"), t = t || {}; var n = r instanceof s; this.objectMode = !!t.objectMode, n && (this.objectMode = this.objectMode || !!t.readableObjectMode); var i = t.highWaterMark, a = t.readableHighWaterMark, o = this.objectMode ? 16 : 16384; this.highWaterMark = i || 0 === i ? i : n && (a || 0 === a) ? a : o, this.highWaterMark = Math.floor(this.highWaterMark), this.buffer = new b, this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = t.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, t.encoding && (p || (p = e("string_decoder/").StringDecoder), this.decoder = new p(t.encoding), this.encoding = t.encoding); }
            function v(t) { if (s = s || e("./_stream_duplex"), !(this instanceof v))
                return new v(t); this._readableState = new y(t, this), this.readable = !0, t && ("function" == typeof t.read && (this._read = t.read), "function" == typeof t.destroy && (this._destroy = t.destroy)), f.call(this); }
            function _(e, t, r, n, i) { var s, a = e._readableState; null === t ? (a.reading = !1, function (e, t) { if (t.ended)
                return; if (t.decoder) {
                var r = t.decoder.end();
                r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length);
            } t.ended = !0, S(e); }(e, a)) : (i || (s = function (e, t) { var r; n = t, c.isBuffer(n) || n instanceof h || "string" == typeof t || void 0 === t || e.objectMode || (r = new TypeError("Invalid non-string/buffer chunk")); var n; return r; }(a, t)), s ? e.emit("error", s) : a.objectMode || t && t.length > 0 ? ("string" == typeof t || a.objectMode || Object.getPrototypeOf(t) === c.prototype || (t = function (e) { return c.from(e); }(t)), n ? a.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : w(e, a, t, !0) : a.ended ? e.emit("error", new Error("stream.push() after EOF")) : (a.reading = !1, a.decoder && !r ? (t = a.decoder.write(t), a.objectMode || 0 !== t.length ? w(e, a, t, !1) : A(e, a)) : w(e, a, t, !1))) : n || (a.reading = !1)); return function (e) { return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length); }(a); }
            function w(e, t, r, n) { t.flowing && 0 === t.length && !t.sync ? (e.emit("data", r), e.read(0)) : (t.length += t.objectMode ? 1 : r.length, n ? t.buffer.unshift(r) : t.buffer.push(r), t.needReadable && S(e)), A(e, t); }
            Object.defineProperty(v.prototype, "destroyed", { get: function () { return void 0 !== this._readableState && this._readableState.destroyed; }, set: function (e) { this._readableState && (this._readableState.destroyed = e); } }), v.prototype.destroy = m.destroy, v.prototype._undestroy = m.undestroy, v.prototype._destroy = function (e, t) { this.push(null), t(e); }, v.prototype.push = function (e, t) { var r, n = this._readableState; return n.objectMode ? r = !0 : "string" == typeof e && ((t = t || n.defaultEncoding) !== n.encoding && (e = c.from(e, t), t = ""), r = !0), _(this, e, t, !1, r); }, v.prototype.unshift = function (e) { return _(this, e, null, !0, !1); }, v.prototype.isPaused = function () { return !1 === this._readableState.flowing; }, v.prototype.setEncoding = function (t) { return p || (p = e("string_decoder/").StringDecoder), this._readableState.decoder = new p(t), this._readableState.encoding = t, this; };
            var E = 8388608;
            function k(e, t) { return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = function (e) { return e >= E ? e = E : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e; }(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0)); }
            function S(e) { var t = e._readableState; t.needReadable = !1, t.emittedReadable || (l("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? i.nextTick(x, e) : x(e)); }
            function x(e) { l("emit readable"), e.emit("readable"), j(e); }
            function A(e, t) { t.readingMore || (t.readingMore = !0, i.nextTick(M, e, t)); }
            function M(e, t) { for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (l("maybeReadMore read 0"), e.read(0), r !== t.length);)
                r = t.length; t.readingMore = !1; }
            function I(e) { l("readable nexttick read 0"), e.read(0); }
            function B(e, t) { t.reading || (l("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, e.emit("resume"), j(e), t.flowing && !t.reading && e.read(0); }
            function j(e) { var t = e._readableState; for (l("flow", t.flowing); t.flowing && null !== e.read();)
                ; }
            function R(e, t) { return 0 === t.length ? null : (t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length), t.buffer.clear()) : r = function (e, t, r) { var n; e < t.head.data.length ? (n = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : n = e === t.head.data.length ? t.shift() : r ? function (e, t) { var r = t.head, n = 1, i = r.data; e -= i.length; for (; r = r.next;) {
                var s = r.data, a = e > s.length ? s.length : e;
                if (a === s.length ? i += s : i += s.slice(0, e), 0 === (e -= a)) {
                    a === s.length ? (++n, r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r, r.data = s.slice(a));
                    break;
                }
                ++n;
            } return t.length -= n, i; }(e, t) : function (e, t) { var r = c.allocUnsafe(e), n = t.head, i = 1; n.data.copy(r), e -= n.data.length; for (; n = n.next;) {
                var s = n.data, a = e > s.length ? s.length : e;
                if (s.copy(r, r.length - e, 0, a), 0 === (e -= a)) {
                    a === s.length ? (++i, n.next ? t.head = n.next : t.head = t.tail = null) : (t.head = n, n.data = s.slice(a));
                    break;
                }
                ++i;
            } return t.length -= i, r; }(e, t); return n; }(e, t.buffer, t.decoder), r); var r; }
            function T(e) { var t = e._readableState; if (t.length > 0)
                throw new Error('"endReadable()" called on non-empty stream'); t.endEmitted || (t.ended = !0, i.nextTick(C, t, e)); }
            function C(e, t) { e.endEmitted || 0 !== e.length || (e.endEmitted = !0, t.readable = !1, t.emit("end")); }
            function O(e, t) { for (var r = 0, n = e.length; r < n; r++)
                if (e[r] === t)
                    return r; return -1; }
            v.prototype.read = function (e) { l("read", e), e = parseInt(e, 10); var t = this._readableState, r = e; if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended))
                return l("read: emitReadable", t.length, t.ended), 0 === t.length && t.ended ? T(this) : S(this), null; if (0 === (e = k(e, t)) && t.ended)
                return 0 === t.length && T(this), null; var n, i = t.needReadable; return l("need readable", i), (0 === t.length || t.length - e < t.highWaterMark) && l("length less than watermark", i = !0), t.ended || t.reading ? l("reading or ended", i = !1) : i && (l("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = k(r, t))), null === (n = e > 0 ? R(e, t) : null) ? (t.needReadable = !0, e = 0) : t.length -= e, 0 === t.length && (t.ended || (t.needReadable = !0), r !== e && t.ended && T(this)), null !== n && this.emit("data", n), n; }, v.prototype._read = function (e) { this.emit("error", new Error("_read() is not implemented")); }, v.prototype.pipe = function (e, t) { var n = this, s = this._readableState; switch (s.pipesCount) {
                case 0:
                    s.pipes = e;
                    break;
                case 1:
                    s.pipes = [s.pipes, e];
                    break;
                default: s.pipes.push(e);
            } s.pipesCount += 1, l("pipe count=%d opts=%j", s.pipesCount, t); var f = (!t || !1 !== t.end) && e !== r.stdout && e !== r.stderr ? h : v; function c(t, r) { l("onunpipe"), t === n && r && !1 === r.hasUnpiped && (r.hasUnpiped = !0, l("cleanup"), e.removeListener("close", g), e.removeListener("finish", y), e.removeListener("drain", u), e.removeListener("error", m), e.removeListener("unpipe", c), n.removeListener("end", h), n.removeListener("end", v), n.removeListener("data", b), d = !0, !s.awaitDrain || e._writableState && !e._writableState.needDrain || u()); } function h() { l("onend"), e.end(); } s.endEmitted ? i.nextTick(f) : n.once("end", f), e.on("unpipe", c); var u = function (e) { return function () { var t = e._readableState; l("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && o(e, "data") && (t.flowing = !0, j(e)); }; }(n); e.on("drain", u); var d = !1; var p = !1; function b(t) { l("ondata"), p = !1, !1 !== e.write(t) || p || ((1 === s.pipesCount && s.pipes === e || s.pipesCount > 1 && -1 !== O(s.pipes, e)) && !d && (l("false write response, pause", n._readableState.awaitDrain), n._readableState.awaitDrain++, p = !0), n.pause()); } function m(t) { l("onerror", t), v(), e.removeListener("error", m), 0 === o(e, "error") && e.emit("error", t); } function g() { e.removeListener("finish", y), v(); } function y() { l("onfinish"), e.removeListener("close", g), v(); } function v() { l("unpipe"), n.unpipe(e); } return n.on("data", b), function (e, t, r) { if ("function" == typeof e.prependListener)
                return e.prependListener(t, r); e._events && e._events[t] ? a(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]] : e.on(t, r); }(e, "error", m), e.once("close", g), e.once("finish", y), e.emit("pipe", n), s.flowing || (l("pipe resume"), n.resume()), e; }, v.prototype.unpipe = function (e) { var t = this._readableState, r = { hasUnpiped: !1 }; if (0 === t.pipesCount)
                return this; if (1 === t.pipesCount)
                return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, r), this); if (!e) {
                var n = t.pipes, i = t.pipesCount;
                t.pipes = null, t.pipesCount = 0, t.flowing = !1;
                for (var s = 0; s < i; s++)
                    n[s].emit("unpipe", this, r);
                return this;
            } var a = O(t.pipes, e); return -1 === a ? this : (t.pipes.splice(a, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this, r), this); }, v.prototype.on = function (e, t) { var r = f.prototype.on.call(this, e, t); if ("data" === e)
                !1 !== this._readableState.flowing && this.resume();
            else if ("readable" === e) {
                var n = this._readableState;
                n.endEmitted || n.readableListening || (n.readableListening = n.needReadable = !0, n.emittedReadable = !1, n.reading ? n.length && S(this) : i.nextTick(I, this));
            } return r; }, v.prototype.addListener = v.prototype.on, v.prototype.resume = function () { var e = this._readableState; return e.flowing || (l("resume"), e.flowing = !0, function (e, t) { t.resumeScheduled || (t.resumeScheduled = !0, i.nextTick(B, e, t)); }(this, e)), this; }, v.prototype.pause = function () { return l("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (l("pause"), this._readableState.flowing = !1, this.emit("pause")), this; }, v.prototype.wrap = function (e) { var t = this, r = this._readableState, n = !1; for (var i in e.on("end", function () { if (l("wrapped end"), r.decoder && !r.ended) {
                var e = r.decoder.end();
                e && e.length && t.push(e);
            } t.push(null); }), e.on("data", function (i) { (l("wrapped data"), r.decoder && (i = r.decoder.write(i)), !r.objectMode || null !== i && void 0 !== i) && ((r.objectMode || i && i.length) && (t.push(i) || (n = !0, e.pause()))); }), e)
                void 0 === this[i] && "function" == typeof e[i] && (this[i] = function (t) { return function () { return e[t].apply(e, arguments); }; }(i)); for (var s = 0; s < g.length; s++)
                e.on(g[s], this.emit.bind(this, g[s])); return this._read = function (t) { l("wrapped _read", t), n && (n = !1, e.resume()); }, this; }, v._fromList = R;
        }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}); }, { "./_stream_duplex": 155, "./internal/streams/BufferList": 160, "./internal/streams/destroy": 161, "./internal/streams/stream": 162, _process: 141, "core-util-is": 54, events: 89, inherits: 108, isarray: 110, "process-nextick-args": 140, "safe-buffer": 168, "string_decoder/": 183, util: 19 }], 158: [function (e, t, r) {
            "use strict";
            t.exports = s;
            var n = e("./_stream_duplex"), i = e("core-util-is");
            function s(e) { if (!(this instanceof s))
                return new s(e); n.call(this, e), this._transformState = { afterTransform: function (e, t) { var r = this._transformState; r.transforming = !1; var n = r.writecb; if (!n)
                    return this.emit("error", new Error("write callback called multiple times")); r.writechunk = null, r.writecb = null, null != t && this.push(t), n(e); var i = this._readableState; i.reading = !1, (i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark); }.bind(this), needTransform: !1, transforming: !1, writecb: null, writechunk: null, writeencoding: null }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && ("function" == typeof e.transform && (this._transform = e.transform), "function" == typeof e.flush && (this._flush = e.flush)), this.on("prefinish", a); }
            function a() { var e = this; "function" == typeof this._flush ? this._flush(function (t, r) { o(e, t, r); }) : o(this, null, null); }
            function o(e, t, r) { if (t)
                return e.emit("error", t); if (null != r && e.push(r), e._writableState.length)
                throw new Error("Calling transform done when ws.length != 0"); if (e._transformState.transforming)
                throw new Error("Calling transform done when still transforming"); return e.push(null); }
            i.inherits = e("inherits"), i.inherits(s, n), s.prototype.push = function (e, t) { return this._transformState.needTransform = !1, n.prototype.push.call(this, e, t); }, s.prototype._transform = function (e, t, r) { throw new Error("_transform() is not implemented"); }, s.prototype._write = function (e, t, r) { var n = this._transformState; if (n.writecb = r, n.writechunk = e, n.writeencoding = t, !n.transforming) {
                var i = this._readableState;
                (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
            } }, s.prototype._read = function (e) { var t = this._transformState; null !== t.writechunk && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : t.needTransform = !0; }, s.prototype._destroy = function (e, t) { var r = this; n.prototype._destroy.call(this, e, function (e) { t(e), r.emit("close"); }); };
        }, { "./_stream_duplex": 155, "core-util-is": 54, inherits: 108 }], 159: [function (e, t, r) { (function (r, n) {
            "use strict";
            var i = e("process-nextick-args");
            function s(e) { var t = this; this.next = null, this.entry = null, this.finish = function () { !function (e, t, r) { var n = e.entry; e.entry = null; for (; n;) {
                var i = n.callback;
                t.pendingcb--, i(r), n = n.next;
            } t.corkedRequestsFree ? t.corkedRequestsFree.next = e : t.corkedRequestsFree = e; }(t, e); }; }
            t.exports = g;
            var a, o = !r.browser && ["v0.10", "v0.9."].indexOf(r.version.slice(0, 5)) > -1 ? setImmediate : i.nextTick;
            g.WritableState = m;
            var f = e("core-util-is");
            f.inherits = e("inherits");
            var c = { deprecate: e("util-deprecate") }, h = e("./internal/streams/stream"), u = e("safe-buffer").Buffer, d = n.Uint8Array || function () { };
            var l, p = e("./internal/streams/destroy");
            function b() { }
            function m(t, r) { a = a || e("./_stream_duplex"), t = t || {}; var n = r instanceof a; this.objectMode = !!t.objectMode, n && (this.objectMode = this.objectMode || !!t.writableObjectMode); var f = t.highWaterMark, c = t.writableHighWaterMark, h = this.objectMode ? 16 : 16384; this.highWaterMark = f || 0 === f ? f : n && (c || 0 === c) ? c : h, this.highWaterMark = Math.floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1; var u = !1 === t.decodeStrings; this.decodeStrings = !u, this.defaultEncoding = t.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (e) { !function (e, t) { var r = e._writableState, n = r.sync, s = r.writecb; if (function (e) { e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0; }(r), t)
                !function (e, t, r, n, s) { --t.pendingcb, r ? (i.nextTick(s, n), i.nextTick(k, e, t), e._writableState.errorEmitted = !0, e.emit("error", n)) : (s(n), e._writableState.errorEmitted = !0, e.emit("error", n), k(e, t)); }(e, r, n, t, s);
            else {
                var a = w(r);
                a || r.corked || r.bufferProcessing || !r.bufferedRequest || _(e, r), n ? o(v, e, r, a, s) : v(e, r, a, s);
            } }(r, e); }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new s(this); }
            function g(t) { if (a = a || e("./_stream_duplex"), !(l.call(g, this) || this instanceof a))
                return new g(t); this._writableState = new m(t, this), this.writable = !0, t && ("function" == typeof t.write && (this._write = t.write), "function" == typeof t.writev && (this._writev = t.writev), "function" == typeof t.destroy && (this._destroy = t.destroy), "function" == typeof t.final && (this._final = t.final)), h.call(this); }
            function y(e, t, r, n, i, s, a) { t.writelen = n, t.writecb = a, t.writing = !0, t.sync = !0, r ? e._writev(i, t.onwrite) : e._write(i, s, t.onwrite), t.sync = !1; }
            function v(e, t, r, n) { r || function (e, t) { 0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain")); }(e, t), t.pendingcb--, n(), k(e, t); }
            function _(e, t) { t.bufferProcessing = !0; var r = t.bufferedRequest; if (e._writev && r && r.next) {
                var n = t.bufferedRequestCount, i = new Array(n), a = t.corkedRequestsFree;
                a.entry = r;
                for (var o = 0, f = !0; r;)
                    i[o] = r, r.isBuf || (f = !1), r = r.next, o += 1;
                i.allBuffers = f, y(e, t, !0, t.length, i, "", a.finish), t.pendingcb++, t.lastBufferedRequest = null, a.next ? (t.corkedRequestsFree = a.next, a.next = null) : t.corkedRequestsFree = new s(t), t.bufferedRequestCount = 0;
            }
            else {
                for (; r;) {
                    var c = r.chunk, h = r.encoding, u = r.callback;
                    if (y(e, t, !1, t.objectMode ? 1 : c.length, c, h, u), r = r.next, t.bufferedRequestCount--, t.writing)
                        break;
                }
                null === r && (t.lastBufferedRequest = null);
            } t.bufferedRequest = r, t.bufferProcessing = !1; }
            function w(e) { return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing; }
            function E(e, t) { e._final(function (r) { t.pendingcb--, r && e.emit("error", r), t.prefinished = !0, e.emit("prefinish"), k(e, t); }); }
            function k(e, t) { var r = w(t); return r && (!function (e, t) { t.prefinished || t.finalCalled || ("function" == typeof e._final ? (t.pendingcb++, t.finalCalled = !0, i.nextTick(E, e, t)) : (t.prefinished = !0, e.emit("prefinish"))); }(e, t), 0 === t.pendingcb && (t.finished = !0, e.emit("finish"))), r; }
            f.inherits(g, h), m.prototype.getBuffer = function () { for (var e = this.bufferedRequest, t = []; e;)
                t.push(e), e = e.next; return t; }, function () { try {
                Object.defineProperty(m.prototype, "buffer", { get: c.deprecate(function () { return this.getBuffer(); }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003") });
            }
            catch (e) { } }(), "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (l = Function.prototype[Symbol.hasInstance], Object.defineProperty(g, Symbol.hasInstance, { value: function (e) { return !!l.call(this, e) || this === g && (e && e._writableState instanceof m); } })) : l = function (e) { return e instanceof this; }, g.prototype.pipe = function () { this.emit("error", new Error("Cannot pipe, not readable")); }, g.prototype.write = function (e, t, r) { var n, s = this._writableState, a = !1, o = !s.objectMode && (n = e, u.isBuffer(n) || n instanceof d); return o && !u.isBuffer(e) && (e = function (e) { return u.from(e); }(e)), "function" == typeof t && (r = t, t = null), o ? t = "buffer" : t || (t = s.defaultEncoding), "function" != typeof r && (r = b), s.ended ? function (e, t) { var r = new Error("write after end"); e.emit("error", r), i.nextTick(t, r); }(this, r) : (o || function (e, t, r, n) { var s = !0, a = !1; return null === r ? a = new TypeError("May not write null values to stream") : "string" == typeof r || void 0 === r || t.objectMode || (a = new TypeError("Invalid non-string/buffer chunk")), a && (e.emit("error", a), i.nextTick(n, a), s = !1), s; }(this, s, e, r)) && (s.pendingcb++, a = function (e, t, r, n, i, s) { if (!r) {
                var a = function (e, t, r) { e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = u.from(t, r)); return t; }(t, n, i);
                n !== a && (r = !0, i = "buffer", n = a);
            } var o = t.objectMode ? 1 : n.length; t.length += o; var f = t.length < t.highWaterMark; f || (t.needDrain = !0); if (t.writing || t.corked) {
                var c = t.lastBufferedRequest;
                t.lastBufferedRequest = { chunk: n, encoding: i, isBuf: r, callback: s, next: null }, c ? c.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1;
            }
            else
                y(e, t, !1, o, n, i, s); return f; }(this, s, o, e, t, r)), a; }, g.prototype.cork = function () { this._writableState.corked++; }, g.prototype.uncork = function () { var e = this._writableState; e.corked && (e.corked--, e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || _(this, e)); }, g.prototype.setDefaultEncoding = function (e) { if ("string" == typeof e && (e = e.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1))
                throw new TypeError("Unknown encoding: " + e); return this._writableState.defaultEncoding = e, this; }, g.prototype._write = function (e, t, r) { r(new Error("_write() is not implemented")); }, g.prototype._writev = null, g.prototype.end = function (e, t, r) { var n = this._writableState; "function" == typeof e ? (r = e, e = null, t = null) : "function" == typeof t && (r = t, t = null), null !== e && void 0 !== e && this.write(e, t), n.corked && (n.corked = 1, this.uncork()), n.ending || n.finished || function (e, t, r) { t.ending = !0, k(e, t), r && (t.finished ? i.nextTick(r) : e.once("finish", r)); t.ended = !0, e.writable = !1; }(this, n, r); }, Object.defineProperty(g.prototype, "destroyed", { get: function () { return void 0 !== this._writableState && this._writableState.destroyed; }, set: function (e) { this._writableState && (this._writableState.destroyed = e); } }), g.prototype.destroy = p.destroy, g.prototype._undestroy = p.undestroy, g.prototype._destroy = function (e, t) { this.end(), t(e); };
        }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}); }, { "./_stream_duplex": 155, "./internal/streams/destroy": 161, "./internal/streams/stream": 162, _process: 141, "core-util-is": 54, inherits: 108, "process-nextick-args": 140, "safe-buffer": 168, "util-deprecate": 187 }], 160: [function (e, t, r) {
            "use strict";
            var n = e("safe-buffer").Buffer, i = e("util");
            t.exports = function () { function e() { !function (e, t) { if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function"); }(this, e), this.head = null, this.tail = null, this.length = 0; } return e.prototype.push = function (e) { var t = { data: e, next: null }; this.length > 0 ? this.tail.next = t : this.head = t, this.tail = t, ++this.length; }, e.prototype.unshift = function (e) { var t = { data: e, next: this.head }; 0 === this.length && (this.tail = t), this.head = t, ++this.length; }, e.prototype.shift = function () { if (0 !== this.length) {
                var e = this.head.data;
                return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, e;
            } }, e.prototype.clear = function () { this.head = this.tail = null, this.length = 0; }, e.prototype.join = function (e) { if (0 === this.length)
                return ""; for (var t = this.head, r = "" + t.data; t = t.next;)
                r += e + t.data; return r; }, e.prototype.concat = function (e) { if (0 === this.length)
                return n.alloc(0); if (1 === this.length)
                return this.head.data; for (var t, r, i, s = n.allocUnsafe(e >>> 0), a = this.head, o = 0; a;)
                t = a.data, r = s, i = o, t.copy(r, i), o += a.data.length, a = a.next; return s; }, e; }(), i && i.inspect && i.inspect.custom && (t.exports.prototype[i.inspect.custom] = function () { var e = i.inspect({ length: this.length }); return this.constructor.name + " " + e; });
        }, { "safe-buffer": 168, util: 19 }], 161: [function (e, t, r) {
            "use strict";
            var n = e("process-nextick-args");
            function i(e, t) { e.emit("error", t); }
            t.exports = { destroy: function (e, t) { var r = this, s = this._readableState && this._readableState.destroyed, a = this._writableState && this._writableState.destroyed; return s || a ? (t ? t(e) : !e || this._writableState && this._writableState.errorEmitted || n.nextTick(i, this, e), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(e || null, function (e) { !t && e ? (n.nextTick(i, r, e), r._writableState && (r._writableState.errorEmitted = !0)) : t && t(e); }), this); }, undestroy: function () { this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1); } };
        }, { "process-nextick-args": 140 }], 162: [function (e, t, r) { t.exports = e("events").EventEmitter; }, { events: 89 }], 163: [function (e, t, r) { t.exports = e("./readable").PassThrough; }, { "./readable": 164 }], 164: [function (e, t, r) { (r = t.exports = e("./lib/_stream_readable.js")).Stream = r, r.Readable = r, r.Writable = e("./lib/_stream_writable.js"), r.Duplex = e("./lib/_stream_duplex.js"), r.Transform = e("./lib/_stream_transform.js"), r.PassThrough = e("./lib/_stream_passthrough.js"); }, { "./lib/_stream_duplex.js": 155, "./lib/_stream_passthrough.js": 156, "./lib/_stream_readable.js": 157, "./lib/_stream_transform.js": 158, "./lib/_stream_writable.js": 159 }], 165: [function (e, t, r) { t.exports = e("./readable").Transform; }, { "./readable": 164 }], 166: [function (e, t, r) { t.exports = e("./lib/_stream_writable.js"); }, { "./lib/_stream_writable.js": 159 }], 167: [function (e, t, r) { (function (r) {
            "use strict";
            var n = e("inherits"), i = e("hash-base");
            function s() { i.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520; }
            function a(e, t) { return e << t | e >>> 32 - t; }
            function o(e, t, r, n, i, s, o, f) { return a(e + (t ^ r ^ n) + s + o | 0, f) + i | 0; }
            function f(e, t, r, n, i, s, o, f) { return a(e + (t & r | ~t & n) + s + o | 0, f) + i | 0; }
            function c(e, t, r, n, i, s, o, f) { return a(e + ((t | ~r) ^ n) + s + o | 0, f) + i | 0; }
            function h(e, t, r, n, i, s, o, f) { return a(e + (t & n | r & ~n) + s + o | 0, f) + i | 0; }
            function u(e, t, r, n, i, s, o, f) { return a(e + (t ^ (r | ~n)) + s + o | 0, f) + i | 0; }
            n(s, i), s.prototype._update = function () { for (var e = new Array(16), t = 0; t < 16; ++t)
                e[t] = this._block.readInt32LE(4 * t); var r = this._a, n = this._b, i = this._c, s = this._d, d = this._e; d = o(d, r = o(r, n, i, s, d, e[0], 0, 11), n, i = a(i, 10), s, e[1], 0, 14), n = o(n = a(n, 10), i = o(i, s = o(s, d, r, n, i, e[2], 0, 15), d, r = a(r, 10), n, e[3], 0, 12), s, d = a(d, 10), r, e[4], 0, 5), s = o(s = a(s, 10), d = o(d, r = o(r, n, i, s, d, e[5], 0, 8), n, i = a(i, 10), s, e[6], 0, 7), r, n = a(n, 10), i, e[7], 0, 9), r = o(r = a(r, 10), n = o(n, i = o(i, s, d, r, n, e[8], 0, 11), s, d = a(d, 10), r, e[9], 0, 13), i, s = a(s, 10), d, e[10], 0, 14), i = o(i = a(i, 10), s = o(s, d = o(d, r, n, i, s, e[11], 0, 15), r, n = a(n, 10), i, e[12], 0, 6), d, r = a(r, 10), n, e[13], 0, 7), d = f(d = a(d, 10), r = o(r, n = o(n, i, s, d, r, e[14], 0, 9), i, s = a(s, 10), d, e[15], 0, 8), n, i = a(i, 10), s, e[7], 1518500249, 7), n = f(n = a(n, 10), i = f(i, s = f(s, d, r, n, i, e[4], 1518500249, 6), d, r = a(r, 10), n, e[13], 1518500249, 8), s, d = a(d, 10), r, e[1], 1518500249, 13), s = f(s = a(s, 10), d = f(d, r = f(r, n, i, s, d, e[10], 1518500249, 11), n, i = a(i, 10), s, e[6], 1518500249, 9), r, n = a(n, 10), i, e[15], 1518500249, 7), r = f(r = a(r, 10), n = f(n, i = f(i, s, d, r, n, e[3], 1518500249, 15), s, d = a(d, 10), r, e[12], 1518500249, 7), i, s = a(s, 10), d, e[0], 1518500249, 12), i = f(i = a(i, 10), s = f(s, d = f(d, r, n, i, s, e[9], 1518500249, 15), r, n = a(n, 10), i, e[5], 1518500249, 9), d, r = a(r, 10), n, e[2], 1518500249, 11), d = f(d = a(d, 10), r = f(r, n = f(n, i, s, d, r, e[14], 1518500249, 7), i, s = a(s, 10), d, e[11], 1518500249, 13), n, i = a(i, 10), s, e[8], 1518500249, 12), n = c(n = a(n, 10), i = c(i, s = c(s, d, r, n, i, e[3], 1859775393, 11), d, r = a(r, 10), n, e[10], 1859775393, 13), s, d = a(d, 10), r, e[14], 1859775393, 6), s = c(s = a(s, 10), d = c(d, r = c(r, n, i, s, d, e[4], 1859775393, 7), n, i = a(i, 10), s, e[9], 1859775393, 14), r, n = a(n, 10), i, e[15], 1859775393, 9), r = c(r = a(r, 10), n = c(n, i = c(i, s, d, r, n, e[8], 1859775393, 13), s, d = a(d, 10), r, e[1], 1859775393, 15), i, s = a(s, 10), d, e[2], 1859775393, 14), i = c(i = a(i, 10), s = c(s, d = c(d, r, n, i, s, e[7], 1859775393, 8), r, n = a(n, 10), i, e[0], 1859775393, 13), d, r = a(r, 10), n, e[6], 1859775393, 6), d = c(d = a(d, 10), r = c(r, n = c(n, i, s, d, r, e[13], 1859775393, 5), i, s = a(s, 10), d, e[11], 1859775393, 12), n, i = a(i, 10), s, e[5], 1859775393, 7), n = h(n = a(n, 10), i = h(i, s = c(s, d, r, n, i, e[12], 1859775393, 5), d, r = a(r, 10), n, e[1], 2400959708, 11), s, d = a(d, 10), r, e[9], 2400959708, 12), s = h(s = a(s, 10), d = h(d, r = h(r, n, i, s, d, e[11], 2400959708, 14), n, i = a(i, 10), s, e[10], 2400959708, 15), r, n = a(n, 10), i, e[0], 2400959708, 14), r = h(r = a(r, 10), n = h(n, i = h(i, s, d, r, n, e[8], 2400959708, 15), s, d = a(d, 10), r, e[12], 2400959708, 9), i, s = a(s, 10), d, e[4], 2400959708, 8), i = h(i = a(i, 10), s = h(s, d = h(d, r, n, i, s, e[13], 2400959708, 9), r, n = a(n, 10), i, e[3], 2400959708, 14), d, r = a(r, 10), n, e[7], 2400959708, 5), d = h(d = a(d, 10), r = h(r, n = h(n, i, s, d, r, e[15], 2400959708, 6), i, s = a(s, 10), d, e[14], 2400959708, 8), n, i = a(i, 10), s, e[5], 2400959708, 6), n = u(n = a(n, 10), i = h(i, s = h(s, d, r, n, i, e[6], 2400959708, 5), d, r = a(r, 10), n, e[2], 2400959708, 12), s, d = a(d, 10), r, e[4], 2840853838, 9), s = u(s = a(s, 10), d = u(d, r = u(r, n, i, s, d, e[0], 2840853838, 15), n, i = a(i, 10), s, e[5], 2840853838, 5), r, n = a(n, 10), i, e[9], 2840853838, 11), r = u(r = a(r, 10), n = u(n, i = u(i, s, d, r, n, e[7], 2840853838, 6), s, d = a(d, 10), r, e[12], 2840853838, 8), i, s = a(s, 10), d, e[2], 2840853838, 13), i = u(i = a(i, 10), s = u(s, d = u(d, r, n, i, s, e[10], 2840853838, 12), r, n = a(n, 10), i, e[14], 2840853838, 5), d, r = a(r, 10), n, e[1], 2840853838, 12), d = u(d = a(d, 10), r = u(r, n = u(n, i, s, d, r, e[3], 2840853838, 13), i, s = a(s, 10), d, e[8], 2840853838, 14), n, i = a(i, 10), s, e[11], 2840853838, 11), n = u(n = a(n, 10), i = u(i, s = u(s, d, r, n, i, e[6], 2840853838, 8), d, r = a(r, 10), n, e[15], 2840853838, 5), s, d = a(d, 10), r, e[13], 2840853838, 6), s = a(s, 10); var l = this._a, p = this._b, b = this._c, m = this._d, g = this._e; g = u(g, l = u(l, p, b, m, g, e[5], 1352829926, 8), p, b = a(b, 10), m, e[14], 1352829926, 9), p = u(p = a(p, 10), b = u(b, m = u(m, g, l, p, b, e[7], 1352829926, 9), g, l = a(l, 10), p, e[0], 1352829926, 11), m, g = a(g, 10), l, e[9], 1352829926, 13), m = u(m = a(m, 10), g = u(g, l = u(l, p, b, m, g, e[2], 1352829926, 15), p, b = a(b, 10), m, e[11], 1352829926, 15), l, p = a(p, 10), b, e[4], 1352829926, 5), l = u(l = a(l, 10), p = u(p, b = u(b, m, g, l, p, e[13], 1352829926, 7), m, g = a(g, 10), l, e[6], 1352829926, 7), b, m = a(m, 10), g, e[15], 1352829926, 8), b = u(b = a(b, 10), m = u(m, g = u(g, l, p, b, m, e[8], 1352829926, 11), l, p = a(p, 10), b, e[1], 1352829926, 14), g, l = a(l, 10), p, e[10], 1352829926, 14), g = h(g = a(g, 10), l = u(l, p = u(p, b, m, g, l, e[3], 1352829926, 12), b, m = a(m, 10), g, e[12], 1352829926, 6), p, b = a(b, 10), m, e[6], 1548603684, 9), p = h(p = a(p, 10), b = h(b, m = h(m, g, l, p, b, e[11], 1548603684, 13), g, l = a(l, 10), p, e[3], 1548603684, 15), m, g = a(g, 10), l, e[7], 1548603684, 7), m = h(m = a(m, 10), g = h(g, l = h(l, p, b, m, g, e[0], 1548603684, 12), p, b = a(b, 10), m, e[13], 1548603684, 8), l, p = a(p, 10), b, e[5], 1548603684, 9), l = h(l = a(l, 10), p = h(p, b = h(b, m, g, l, p, e[10], 1548603684, 11), m, g = a(g, 10), l, e[14], 1548603684, 7), b, m = a(m, 10), g, e[15], 1548603684, 7), b = h(b = a(b, 10), m = h(m, g = h(g, l, p, b, m, e[8], 1548603684, 12), l, p = a(p, 10), b, e[12], 1548603684, 7), g, l = a(l, 10), p, e[4], 1548603684, 6), g = h(g = a(g, 10), l = h(l, p = h(p, b, m, g, l, e[9], 1548603684, 15), b, m = a(m, 10), g, e[1], 1548603684, 13), p, b = a(b, 10), m, e[2], 1548603684, 11), p = c(p = a(p, 10), b = c(b, m = c(m, g, l, p, b, e[15], 1836072691, 9), g, l = a(l, 10), p, e[5], 1836072691, 7), m, g = a(g, 10), l, e[1], 1836072691, 15), m = c(m = a(m, 10), g = c(g, l = c(l, p, b, m, g, e[3], 1836072691, 11), p, b = a(b, 10), m, e[7], 1836072691, 8), l, p = a(p, 10), b, e[14], 1836072691, 6), l = c(l = a(l, 10), p = c(p, b = c(b, m, g, l, p, e[6], 1836072691, 6), m, g = a(g, 10), l, e[9], 1836072691, 14), b, m = a(m, 10), g, e[11], 1836072691, 12), b = c(b = a(b, 10), m = c(m, g = c(g, l, p, b, m, e[8], 1836072691, 13), l, p = a(p, 10), b, e[12], 1836072691, 5), g, l = a(l, 10), p, e[2], 1836072691, 14), g = c(g = a(g, 10), l = c(l, p = c(p, b, m, g, l, e[10], 1836072691, 13), b, m = a(m, 10), g, e[0], 1836072691, 13), p, b = a(b, 10), m, e[4], 1836072691, 7), p = f(p = a(p, 10), b = f(b, m = c(m, g, l, p, b, e[13], 1836072691, 5), g, l = a(l, 10), p, e[8], 2053994217, 15), m, g = a(g, 10), l, e[6], 2053994217, 5), m = f(m = a(m, 10), g = f(g, l = f(l, p, b, m, g, e[4], 2053994217, 8), p, b = a(b, 10), m, e[1], 2053994217, 11), l, p = a(p, 10), b, e[3], 2053994217, 14), l = f(l = a(l, 10), p = f(p, b = f(b, m, g, l, p, e[11], 2053994217, 14), m, g = a(g, 10), l, e[15], 2053994217, 6), b, m = a(m, 10), g, e[0], 2053994217, 14), b = f(b = a(b, 10), m = f(m, g = f(g, l, p, b, m, e[5], 2053994217, 6), l, p = a(p, 10), b, e[12], 2053994217, 9), g, l = a(l, 10), p, e[2], 2053994217, 12), g = f(g = a(g, 10), l = f(l, p = f(p, b, m, g, l, e[13], 2053994217, 9), b, m = a(m, 10), g, e[9], 2053994217, 12), p, b = a(b, 10), m, e[7], 2053994217, 5), p = o(p = a(p, 10), b = f(b, m = f(m, g, l, p, b, e[10], 2053994217, 15), g, l = a(l, 10), p, e[14], 2053994217, 8), m, g = a(g, 10), l, e[12], 0, 8), m = o(m = a(m, 10), g = o(g, l = o(l, p, b, m, g, e[15], 0, 5), p, b = a(b, 10), m, e[10], 0, 12), l, p = a(p, 10), b, e[4], 0, 9), l = o(l = a(l, 10), p = o(p, b = o(b, m, g, l, p, e[1], 0, 12), m, g = a(g, 10), l, e[5], 0, 5), b, m = a(m, 10), g, e[8], 0, 14), b = o(b = a(b, 10), m = o(m, g = o(g, l, p, b, m, e[7], 0, 6), l, p = a(p, 10), b, e[6], 0, 8), g, l = a(l, 10), p, e[2], 0, 13), g = o(g = a(g, 10), l = o(l, p = o(p, b, m, g, l, e[13], 0, 6), b, m = a(m, 10), g, e[14], 0, 5), p, b = a(b, 10), m, e[0], 0, 15), p = o(p = a(p, 10), b = o(b, m = o(m, g, l, p, b, e[3], 0, 13), g, l = a(l, 10), p, e[9], 0, 11), m, g = a(g, 10), l, e[11], 0, 11), m = a(m, 10); var y = this._b + i + m | 0; this._b = this._c + s + g | 0, this._c = this._d + d + l | 0, this._d = this._e + r + p | 0, this._e = this._a + n + b | 0, this._a = y; }, s.prototype._digest = function () { this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update(); var e = new r(20); return e.writeInt32LE(this._a, 0), e.writeInt32LE(this._b, 4), e.writeInt32LE(this._c, 8), e.writeInt32LE(this._d, 12), e.writeInt32LE(this._e, 16), e; }, t.exports = s;
        }).call(this, e("buffer").Buffer); }, { buffer: 51, "hash-base": 91, inherits: 108 }], 168: [function (e, t, r) { var n = e("buffer"), i = n.Buffer; function s(e, t) { for (var r in e)
            t[r] = e[r]; } function a(e, t, r) { return i(e, t, r); } i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow ? t.exports = n : (s(n, r), r.Buffer = a), s(i, a), a.from = function (e, t, r) { if ("number" == typeof e)
            throw new TypeError("Argument must not be a number"); return i(e, t, r); }, a.alloc = function (e, t, r) { if ("number" != typeof e)
            throw new TypeError("Argument must be a number"); var n = i(e); return void 0 !== t ? "string" == typeof r ? n.fill(t, r) : n.fill(t) : n.fill(0), n; }, a.allocUnsafe = function (e) { if ("number" != typeof e)
            throw new TypeError("Argument must be a number"); return i(e); }, a.allocUnsafeSlow = function (e) { if ("number" != typeof e)
            throw new TypeError("Argument must be a number"); return n.SlowBuffer(e); }; }, { buffer: 51 }], 169: [function (e, t, r) { var n = e("safe-buffer").Buffer; function i(e, t) { this._block = n.alloc(e), this._finalSize = t, this._blockSize = e, this._len = 0; } i.prototype.update = function (e, t) { "string" == typeof e && (t = t || "utf8", e = n.from(e, t)); for (var r = this._block, i = this._blockSize, s = e.length, a = this._len, o = 0; o < s;) {
            for (var f = a % i, c = Math.min(s - o, i - f), h = 0; h < c; h++)
                r[f + h] = e[o + h];
            o += c, (a += c) % i == 0 && this._update(r);
        } return this._len += s, this; }, i.prototype.digest = function (e) { var t = this._len % this._blockSize; this._block[t] = 128, this._block.fill(0, t + 1), t >= this._finalSize && (this._update(this._block), this._block.fill(0)); var r = 8 * this._len; if (r <= 4294967295)
            this._block.writeUInt32BE(r, this._blockSize - 4);
        else {
            var n = (4294967295 & r) >>> 0, i = (r - n) / 4294967296;
            this._block.writeUInt32BE(i, this._blockSize - 8), this._block.writeUInt32BE(n, this._blockSize - 4);
        } this._update(this._block); var s = this._hash(); return e ? s.toString(e) : s; }, i.prototype._update = function () { throw new Error("_update must be implemented by subclass"); }, t.exports = i; }, { "safe-buffer": 168 }], 170: [function (e, t, r) { (r = t.exports = function (e) { e = e.toLowerCase(); var t = r[e]; if (!t)
            throw new Error(e + " is not supported (we accept pull requests)"); return new t; }).sha = e("./sha"), r.sha1 = e("./sha1"), r.sha224 = e("./sha224"), r.sha256 = e("./sha256"), r.sha384 = e("./sha384"), r.sha512 = e("./sha512"); }, { "./sha": 171, "./sha1": 172, "./sha224": 173, "./sha256": 174, "./sha384": 175, "./sha512": 176 }], 171: [function (e, t, r) { var n = e("inherits"), i = e("./hash"), s = e("safe-buffer").Buffer, a = [1518500249, 1859775393, -1894007588, -899497514], o = new Array(80); function f() { this.init(), this._w = o, i.call(this, 64, 56); } function c(e) { return e << 30 | e >>> 2; } function h(e, t, r, n) { return 0 === e ? t & r | ~t & n : 2 === e ? t & r | t & n | r & n : t ^ r ^ n; } n(f, i), f.prototype.init = function () { return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this; }, f.prototype._update = function (e) { for (var t, r = this._w, n = 0 | this._a, i = 0 | this._b, s = 0 | this._c, o = 0 | this._d, f = 0 | this._e, u = 0; u < 16; ++u)
            r[u] = e.readInt32BE(4 * u); for (; u < 80; ++u)
            r[u] = r[u - 3] ^ r[u - 8] ^ r[u - 14] ^ r[u - 16]; for (var d = 0; d < 80; ++d) {
            var l = ~~(d / 20), p = 0 | ((t = n) << 5 | t >>> 27) + h(l, i, s, o) + f + r[d] + a[l];
            f = o, o = s, s = c(i), i = n, n = p;
        } this._a = n + this._a | 0, this._b = i + this._b | 0, this._c = s + this._c | 0, this._d = o + this._d | 0, this._e = f + this._e | 0; }, f.prototype._hash = function () { var e = s.allocUnsafe(20); return e.writeInt32BE(0 | this._a, 0), e.writeInt32BE(0 | this._b, 4), e.writeInt32BE(0 | this._c, 8), e.writeInt32BE(0 | this._d, 12), e.writeInt32BE(0 | this._e, 16), e; }, t.exports = f; }, { "./hash": 169, inherits: 108, "safe-buffer": 168 }], 172: [function (e, t, r) { var n = e("inherits"), i = e("./hash"), s = e("safe-buffer").Buffer, a = [1518500249, 1859775393, -1894007588, -899497514], o = new Array(80); function f() { this.init(), this._w = o, i.call(this, 64, 56); } function c(e) { return e << 5 | e >>> 27; } function h(e) { return e << 30 | e >>> 2; } function u(e, t, r, n) { return 0 === e ? t & r | ~t & n : 2 === e ? t & r | t & n | r & n : t ^ r ^ n; } n(f, i), f.prototype.init = function () { return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this; }, f.prototype._update = function (e) { for (var t, r = this._w, n = 0 | this._a, i = 0 | this._b, s = 0 | this._c, o = 0 | this._d, f = 0 | this._e, d = 0; d < 16; ++d)
            r[d] = e.readInt32BE(4 * d); for (; d < 80; ++d)
            r[d] = (t = r[d - 3] ^ r[d - 8] ^ r[d - 14] ^ r[d - 16]) << 1 | t >>> 31; for (var l = 0; l < 80; ++l) {
            var p = ~~(l / 20), b = c(n) + u(p, i, s, o) + f + r[l] + a[p] | 0;
            f = o, o = s, s = h(i), i = n, n = b;
        } this._a = n + this._a | 0, this._b = i + this._b | 0, this._c = s + this._c | 0, this._d = o + this._d | 0, this._e = f + this._e | 0; }, f.prototype._hash = function () { var e = s.allocUnsafe(20); return e.writeInt32BE(0 | this._a, 0), e.writeInt32BE(0 | this._b, 4), e.writeInt32BE(0 | this._c, 8), e.writeInt32BE(0 | this._d, 12), e.writeInt32BE(0 | this._e, 16), e; }, t.exports = f; }, { "./hash": 169, inherits: 108, "safe-buffer": 168 }], 173: [function (e, t, r) { var n = e("inherits"), i = e("./sha256"), s = e("./hash"), a = e("safe-buffer").Buffer, o = new Array(64); function f() { this.init(), this._w = o, s.call(this, 64, 56); } n(f, i), f.prototype.init = function () { return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this; }, f.prototype._hash = function () { var e = a.allocUnsafe(28); return e.writeInt32BE(this._a, 0), e.writeInt32BE(this._b, 4), e.writeInt32BE(this._c, 8), e.writeInt32BE(this._d, 12), e.writeInt32BE(this._e, 16), e.writeInt32BE(this._f, 20), e.writeInt32BE(this._g, 24), e; }, t.exports = f; }, { "./hash": 169, "./sha256": 174, inherits: 108, "safe-buffer": 168 }], 174: [function (e, t, r) { var n = e("inherits"), i = e("./hash"), s = e("safe-buffer").Buffer, a = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298], o = new Array(64); function f() { this.init(), this._w = o, i.call(this, 64, 56); } function c(e, t, r) { return r ^ e & (t ^ r); } function h(e, t, r) { return e & t | r & (e | t); } function u(e) { return (e >>> 2 | e << 30) ^ (e >>> 13 | e << 19) ^ (e >>> 22 | e << 10); } function d(e) { return (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7); } function l(e) { return (e >>> 7 | e << 25) ^ (e >>> 18 | e << 14) ^ e >>> 3; } n(f, i), f.prototype.init = function () { return this._a = 1779033703, this._b = 3144134277, this._c = 1013904242, this._d = 2773480762, this._e = 1359893119, this._f = 2600822924, this._g = 528734635, this._h = 1541459225, this; }, f.prototype._update = function (e) { for (var t, r = this._w, n = 0 | this._a, i = 0 | this._b, s = 0 | this._c, o = 0 | this._d, f = 0 | this._e, p = 0 | this._f, b = 0 | this._g, m = 0 | this._h, g = 0; g < 16; ++g)
            r[g] = e.readInt32BE(4 * g); for (; g < 64; ++g)
            r[g] = 0 | (((t = r[g - 2]) >>> 17 | t << 15) ^ (t >>> 19 | t << 13) ^ t >>> 10) + r[g - 7] + l(r[g - 15]) + r[g - 16]; for (var y = 0; y < 64; ++y) {
            var v = m + d(f) + c(f, p, b) + a[y] + r[y] | 0, _ = u(n) + h(n, i, s) | 0;
            m = b, b = p, p = f, f = o + v | 0, o = s, s = i, i = n, n = v + _ | 0;
        } this._a = n + this._a | 0, this._b = i + this._b | 0, this._c = s + this._c | 0, this._d = o + this._d | 0, this._e = f + this._e | 0, this._f = p + this._f | 0, this._g = b + this._g | 0, this._h = m + this._h | 0; }, f.prototype._hash = function () { var e = s.allocUnsafe(32); return e.writeInt32BE(this._a, 0), e.writeInt32BE(this._b, 4), e.writeInt32BE(this._c, 8), e.writeInt32BE(this._d, 12), e.writeInt32BE(this._e, 16), e.writeInt32BE(this._f, 20), e.writeInt32BE(this._g, 24), e.writeInt32BE(this._h, 28), e; }, t.exports = f; }, { "./hash": 169, inherits: 108, "safe-buffer": 168 }], 175: [function (e, t, r) { var n = e("inherits"), i = e("./sha512"), s = e("./hash"), a = e("safe-buffer").Buffer, o = new Array(160); function f() { this.init(), this._w = o, s.call(this, 128, 112); } n(f, i), f.prototype.init = function () { return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this; }, f.prototype._hash = function () { var e = a.allocUnsafe(48); function t(t, r, n) { e.writeInt32BE(t, n), e.writeInt32BE(r, n + 4); } return t(this._ah, this._al, 0), t(this._bh, this._bl, 8), t(this._ch, this._cl, 16), t(this._dh, this._dl, 24), t(this._eh, this._el, 32), t(this._fh, this._fl, 40), e; }, t.exports = f; }, { "./hash": 169, "./sha512": 176, inherits: 108, "safe-buffer": 168 }], 176: [function (e, t, r) { var n = e("inherits"), i = e("./hash"), s = e("safe-buffer").Buffer, a = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591], o = new Array(160); function f() { this.init(), this._w = o, i.call(this, 128, 112); } function c(e, t, r) { return r ^ e & (t ^ r); } function h(e, t, r) { return e & t | r & (e | t); } function u(e, t) { return (e >>> 28 | t << 4) ^ (t >>> 2 | e << 30) ^ (t >>> 7 | e << 25); } function d(e, t) { return (e >>> 14 | t << 18) ^ (e >>> 18 | t << 14) ^ (t >>> 9 | e << 23); } function l(e, t) { return (e >>> 1 | t << 31) ^ (e >>> 8 | t << 24) ^ e >>> 7; } function p(e, t) { return (e >>> 1 | t << 31) ^ (e >>> 8 | t << 24) ^ (e >>> 7 | t << 25); } function b(e, t) { return (e >>> 19 | t << 13) ^ (t >>> 29 | e << 3) ^ e >>> 6; } function m(e, t) { return (e >>> 19 | t << 13) ^ (t >>> 29 | e << 3) ^ (e >>> 6 | t << 26); } function g(e, t) { return e >>> 0 < t >>> 0 ? 1 : 0; } n(f, i), f.prototype.init = function () { return this._ah = 1779033703, this._bh = 3144134277, this._ch = 1013904242, this._dh = 2773480762, this._eh = 1359893119, this._fh = 2600822924, this._gh = 528734635, this._hh = 1541459225, this._al = 4089235720, this._bl = 2227873595, this._cl = 4271175723, this._dl = 1595750129, this._el = 2917565137, this._fl = 725511199, this._gl = 4215389547, this._hl = 327033209, this; }, f.prototype._update = function (e) { for (var t = this._w, r = 0 | this._ah, n = 0 | this._bh, i = 0 | this._ch, s = 0 | this._dh, o = 0 | this._eh, f = 0 | this._fh, y = 0 | this._gh, v = 0 | this._hh, _ = 0 | this._al, w = 0 | this._bl, E = 0 | this._cl, k = 0 | this._dl, S = 0 | this._el, x = 0 | this._fl, A = 0 | this._gl, M = 0 | this._hl, I = 0; I < 32; I += 2)
            t[I] = e.readInt32BE(4 * I), t[I + 1] = e.readInt32BE(4 * I + 4); for (; I < 160; I += 2) {
            var B = t[I - 30], j = t[I - 30 + 1], R = l(B, j), T = p(j, B), C = b(B = t[I - 4], j = t[I - 4 + 1]), O = m(j, B), z = t[I - 14], L = t[I - 14 + 1], N = t[I - 32], P = t[I - 32 + 1], D = T + L | 0, U = R + z + g(D, T) | 0;
            U = (U = U + C + g(D = D + O | 0, O) | 0) + N + g(D = D + P | 0, P) | 0, t[I] = U, t[I + 1] = D;
        } for (var q = 0; q < 160; q += 2) {
            U = t[q], D = t[q + 1];
            var F = h(r, n, i), H = h(_, w, E), Z = u(r, _), K = u(_, r), W = d(o, S), G = d(S, o), V = a[q], X = a[q + 1], Y = c(o, f, y), J = c(S, x, A), $ = M + G | 0, Q = v + W + g($, M) | 0;
            Q = (Q = (Q = Q + Y + g($ = $ + J | 0, J) | 0) + V + g($ = $ + X | 0, X) | 0) + U + g($ = $ + D | 0, D) | 0;
            var ee = K + H | 0, te = Z + F + g(ee, K) | 0;
            v = y, M = A, y = f, A = x, f = o, x = S, o = s + Q + g(S = k + $ | 0, k) | 0, s = i, k = E, i = n, E = w, n = r, w = _, r = Q + te + g(_ = $ + ee | 0, $) | 0;
        } this._al = this._al + _ | 0, this._bl = this._bl + w | 0, this._cl = this._cl + E | 0, this._dl = this._dl + k | 0, this._el = this._el + S | 0, this._fl = this._fl + x | 0, this._gl = this._gl + A | 0, this._hl = this._hl + M | 0, this._ah = this._ah + r + g(this._al, _) | 0, this._bh = this._bh + n + g(this._bl, w) | 0, this._ch = this._ch + i + g(this._cl, E) | 0, this._dh = this._dh + s + g(this._dl, k) | 0, this._eh = this._eh + o + g(this._el, S) | 0, this._fh = this._fh + f + g(this._fl, x) | 0, this._gh = this._gh + y + g(this._gl, A) | 0, this._hh = this._hh + v + g(this._hl, M) | 0; }, f.prototype._hash = function () { var e = s.allocUnsafe(64); function t(t, r, n) { e.writeInt32BE(t, n), e.writeInt32BE(r, n + 4); } return t(this._ah, this._al, 0), t(this._bh, this._bl, 8), t(this._ch, this._cl, 16), t(this._dh, this._dl, 24), t(this._eh, this._el, 32), t(this._fh, this._fl, 40), t(this._gh, this._gl, 48), t(this._hh, this._hl, 56), e; }, t.exports = f; }, { "./hash": 169, inherits: 108, "safe-buffer": 168 }], 177: [function (e, t, r) { function n(e) { for (var t in e)
            this[t] = e[t]; } r.get = function (e) { var t = Error.stackTraceLimit; Error.stackTraceLimit = 1 / 0; var n = {}, i = Error.prepareStackTrace; Error.prepareStackTrace = function (e, t) { return t; }, Error.captureStackTrace(n, e || r.get); var s = n.stack; return Error.prepareStackTrace = i, Error.stackTraceLimit = t, s; }, r.parse = function (e) { if (!e.stack)
            return []; var t = this; return e.stack.split("\n").slice(1).map(function (e) { if (e.match(/^\s*[-]{4,}$/))
            return t._createParsedCallSite({ fileName: e, lineNumber: null, functionName: null, typeName: null, methodName: null, columnNumber: null, native: null }); var r = e.match(/at (?:(.+)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/); if (r) {
            var n = null, i = null, s = null, a = null, o = null, f = "native" === r[5];
            if (r[1]) {
                var c = (s = r[1]).lastIndexOf(".");
                if ("." == s[c - 1] && c--, c > 0) {
                    n = s.substr(0, c), i = s.substr(c + 1);
                    var h = n.indexOf(".Module");
                    h > 0 && (s = s.substr(h + 1), n = n.substr(0, h));
                }
                a = null;
            }
            i && (a = n, o = i), "<anonymous>" === i && (o = null, s = null);
            var u = { fileName: r[2] || null, lineNumber: parseInt(r[3], 10) || null, functionName: s, typeName: a, methodName: o, columnNumber: parseInt(r[4], 10) || null, native: f };
            return t._createParsedCallSite(u);
        } }).filter(function (e) { return !!e; }); }; ["this", "typeName", "functionName", "methodName", "fileName", "lineNumber", "columnNumber", "function", "evalOrigin"].forEach(function (e) { n.prototype[e] = null, n.prototype["get" + e[0].toUpperCase() + e.substr(1)] = function () { return this[e]; }; }), ["topLevel", "eval", "native", "constructor"].forEach(function (e) { n.prototype[e] = !1, n.prototype["is" + e[0].toUpperCase() + e.substr(1)] = function () { return this[e]; }; }), r._createParsedCallSite = function (e) { return new n(e); }; }, {}], 178: [function (e, t, r) { t.exports = i; var n = e("events").EventEmitter; function i() { n.call(this); } e("inherits")(i, n), i.Readable = e("readable-stream/readable.js"), i.Writable = e("readable-stream/writable.js"), i.Duplex = e("readable-stream/duplex.js"), i.Transform = e("readable-stream/transform.js"), i.PassThrough = e("readable-stream/passthrough.js"), i.Stream = i, i.prototype.pipe = function (e, t) { var r = this; function i(t) { e.writable && !1 === e.write(t) && r.pause && r.pause(); } function s() { r.readable && r.resume && r.resume(); } r.on("data", i), e.on("drain", s), e._isStdio || t && !1 === t.end || (r.on("end", o), r.on("close", f)); var a = !1; function o() { a || (a = !0, e.end()); } function f() { a || (a = !0, "function" == typeof e.destroy && e.destroy()); } function c(e) { if (h(), 0 === n.listenerCount(this, "error"))
            throw e; } function h() { r.removeListener("data", i), e.removeListener("drain", s), r.removeListener("end", o), r.removeListener("close", f), r.removeListener("error", c), e.removeListener("error", c), r.removeListener("end", h), r.removeListener("close", h), e.removeListener("close", h); } return r.on("error", c), e.on("error", c), r.on("end", h), r.on("close", h), e.on("close", h), e.emit("pipe", r), e; }; }, { events: 89, inherits: 108, "readable-stream/duplex.js": 154, "readable-stream/passthrough.js": 163, "readable-stream/readable.js": 164, "readable-stream/transform.js": 165, "readable-stream/writable.js": 166 }], 179: [function (e, t, r) { (function (t) { var n = e("./lib/request"), i = e("./lib/response"), s = e("xtend"), a = e("builtin-status-codes"), o = e("url"), f = r; f.request = function (e, r) { e = "string" == typeof e ? o.parse(e) : s(e); var i = -1 === t.location.protocol.search(/^https?:$/) ? "http:" : "", a = e.protocol || i, f = e.hostname || e.host, c = e.port, h = e.path || "/"; f && -1 !== f.indexOf(":") && (f = "[" + f + "]"), e.url = (f ? a + "//" + f : "") + (c ? ":" + c : "") + h, e.method = (e.method || "GET").toUpperCase(), e.headers = e.headers || {}; var u = new n(e); return r && u.on("response", r), u; }, f.get = function (e, t) { var r = f.request(e, t); return r.end(), r; }, f.ClientRequest = n, f.IncomingMessage = i.IncomingMessage, f.Agent = function () { }, f.Agent.defaultMaxSockets = 4, f.globalAgent = new f.Agent, f.STATUS_CODES = a, f.METHODS = ["CHECKOUT", "CONNECT", "COPY", "DELETE", "GET", "HEAD", "LOCK", "M-SEARCH", "MERGE", "MKACTIVITY", "MKCOL", "MOVE", "NOTIFY", "OPTIONS", "PATCH", "POST", "PROPFIND", "PROPPATCH", "PURGE", "PUT", "REPORT", "SEARCH", "SUBSCRIBE", "TRACE", "UNLOCK", "UNSUBSCRIBE"]; }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}); }, { "./lib/request": 181, "./lib/response": 182, "builtin-status-codes": 52, url: 185, xtend: 220 }], 180: [function (e, t, r) { (function (e) { r.fetch = o(e.fetch) && o(e.ReadableStream), r.writableStream = o(e.WritableStream), r.abortController = o(e.AbortController), r.blobConstructor = !1; try {
            new Blob([new ArrayBuffer(1)]), r.blobConstructor = !0;
        }
        catch (e) { } var t; function n() { if (void 0 !== t)
            return t; if (e.XMLHttpRequest) {
            t = new e.XMLHttpRequest;
            try {
                t.open("GET", e.XDomainRequest ? "/" : "https://example.com");
            }
            catch (e) {
                t = null;
            }
        }
        else
            t = null; return t; } function i(e) { var t = n(); if (!t)
            return !1; try {
            return t.responseType = e, t.responseType === e;
        }
        catch (e) { } return !1; } var s = void 0 !== e.ArrayBuffer, a = s && o(e.ArrayBuffer.prototype.slice); function o(e) { return "function" == typeof e; } r.arraybuffer = r.fetch || s && i("arraybuffer"), r.msstream = !r.fetch && a && i("ms-stream"), r.mozchunkedarraybuffer = !r.fetch && s && i("moz-chunked-arraybuffer"), r.overrideMimeType = r.fetch || !!n() && o(n().overrideMimeType), r.vbArray = o(e.VBArray), t = null; }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}); }, {}], 181: [function (e, t, r) { (function (r, n, i) { var s = e("./capability"), a = e("inherits"), o = e("./response"), f = e("readable-stream"), c = e("to-arraybuffer"), h = o.IncomingMessage, u = o.readyStates; var d = t.exports = function (e) { var t, r = this; f.Writable.call(r), r._opts = e, r._body = [], r._headers = {}, e.auth && r.setHeader("Authorization", "Basic " + new i(e.auth).toString("base64")), Object.keys(e.headers).forEach(function (t) { r.setHeader(t, e.headers[t]); }); var n = !0; if ("disable-fetch" === e.mode || "requestTimeout" in e && !s.abortController)
            n = !1, t = !0;
        else if ("prefer-streaming" === e.mode)
            t = !1;
        else if ("allow-wrong-content-type" === e.mode)
            t = !s.overrideMimeType;
        else {
            if (e.mode && "default" !== e.mode && "prefer-fast" !== e.mode)
                throw new Error("Invalid value for opts.mode");
            t = !0;
        } r._mode = function (e, t) { return s.fetch && t ? "fetch" : s.mozchunkedarraybuffer ? "moz-chunked-arraybuffer" : s.msstream ? "ms-stream" : s.arraybuffer && e ? "arraybuffer" : s.vbArray && e ? "text:vbarray" : "text"; }(t, n), r.on("finish", function () { r._onFinish(); }); }; a(d, f.Writable), d.prototype.setHeader = function (e, t) { var r = e.toLowerCase(); -1 === l.indexOf(r) && (this._headers[r] = { name: e, value: t }); }, d.prototype.getHeader = function (e) { var t = this._headers[e.toLowerCase()]; return t ? t.value : null; }, d.prototype.removeHeader = function (e) { delete this._headers[e.toLowerCase()]; }, d.prototype._onFinish = function () { var e = this; if (!e._destroyed) {
            var t = e._opts, a = e._headers, o = null;
            "GET" !== t.method && "HEAD" !== t.method && (o = s.arraybuffer ? c(i.concat(e._body)) : s.blobConstructor ? new n.Blob(e._body.map(function (e) { return c(e); }), { type: (a["content-type"] || {}).value || "" }) : i.concat(e._body).toString());
            var f = [];
            if (Object.keys(a).forEach(function (e) { var t = a[e].name, r = a[e].value; Array.isArray(r) ? r.forEach(function (e) { f.push([t, e]); }) : f.push([t, r]); }), "fetch" === e._mode) {
                var h = null;
                if (s.abortController) {
                    var d = new AbortController;
                    h = d.signal, e._fetchAbortController = d, "requestTimeout" in t && 0 !== t.requestTimeout && n.setTimeout(function () { e.emit("requestTimeout"), e._fetchAbortController && e._fetchAbortController.abort(); }, t.requestTimeout);
                }
                n.fetch(e._opts.url, { method: e._opts.method, headers: f, body: o || void 0, mode: "cors", credentials: t.withCredentials ? "include" : "same-origin", signal: h }).then(function (t) { e._fetchResponse = t, e._connect(); }, function (t) { e.emit("error", t); });
            }
            else {
                var l = e._xhr = new n.XMLHttpRequest;
                try {
                    l.open(e._opts.method, e._opts.url, !0);
                }
                catch (t) {
                    return void r.nextTick(function () { e.emit("error", t); });
                }
                "responseType" in l && (l.responseType = e._mode.split(":")[0]), "withCredentials" in l && (l.withCredentials = !!t.withCredentials), "text" === e._mode && "overrideMimeType" in l && l.overrideMimeType("text/plain; charset=x-user-defined"), "requestTimeout" in t && (l.timeout = t.requestTimeout, l.ontimeout = function () { e.emit("requestTimeout"); }), f.forEach(function (e) { l.setRequestHeader(e[0], e[1]); }), e._response = null, l.onreadystatechange = function () { switch (l.readyState) {
                    case u.LOADING:
                    case u.DONE: e._onXHRProgress();
                } }, "moz-chunked-arraybuffer" === e._mode && (l.onprogress = function () { e._onXHRProgress(); }), l.onerror = function () { e._destroyed || e.emit("error", new Error("XHR error")); };
                try {
                    l.send(o);
                }
                catch (t) {
                    return void r.nextTick(function () { e.emit("error", t); });
                }
            }
        } }, d.prototype._onXHRProgress = function () { (function (e) { try {
            var t = e.status;
            return null !== t && 0 !== t;
        }
        catch (e) {
            return !1;
        } })(this._xhr) && !this._destroyed && (this._response || this._connect(), this._response._onXHRProgress()); }, d.prototype._connect = function () { var e = this; e._destroyed || (e._response = new h(e._xhr, e._fetchResponse, e._mode), e._response.on("error", function (t) { e.emit("error", t); }), e.emit("response", e._response)); }, d.prototype._write = function (e, t, r) { this._body.push(e), r(); }, d.prototype.abort = d.prototype.destroy = function () { this._destroyed = !0, this._response && (this._response._destroyed = !0), this._xhr ? this._xhr.abort() : this._fetchAbortController && this._fetchAbortController.abort(); }, d.prototype.end = function (e, t, r) { "function" == typeof e && (r = e, e = void 0), f.Writable.prototype.end.call(this, e, t, r); }, d.prototype.flushHeaders = function () { }, d.prototype.setTimeout = function () { }, d.prototype.setNoDelay = function () { }, d.prototype.setSocketKeepAlive = function () { }; var l = ["accept-charset", "accept-encoding", "access-control-request-headers", "access-control-request-method", "connection", "content-length", "cookie", "cookie2", "date", "dnt", "expect", "host", "keep-alive", "origin", "referer", "te", "trailer", "transfer-encoding", "upgrade", "user-agent", "via"]; }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer); }, { "./capability": 180, "./response": 182, _process: 141, buffer: 51, inherits: 108, "readable-stream": 164, "to-arraybuffer": 184 }], 182: [function (e, t, r) { (function (t, n, i) { var s = e("./capability"), a = e("inherits"), o = e("readable-stream"), f = r.readyStates = { UNSENT: 0, OPENED: 1, HEADERS_RECEIVED: 2, LOADING: 3, DONE: 4 }, c = r.IncomingMessage = function (e, r, n) { var a = this; if (o.Readable.call(a), a._mode = n, a.headers = {}, a.rawHeaders = [], a.trailers = {}, a.rawTrailers = [], a.on("end", function () { t.nextTick(function () { a.emit("close"); }); }), "fetch" === n) {
            if (a._fetchResponse = r, a.url = r.url, a.statusCode = r.status, a.statusMessage = r.statusText, r.headers.forEach(function (e, t) { a.headers[t.toLowerCase()] = e, a.rawHeaders.push(t, e); }), s.writableStream) {
                var f = new WritableStream({ write: function (e) { return new Promise(function (t, r) { a._destroyed || (a.push(new i(e)) ? t() : a._resumeFetch = t); }); }, close: function () { a._destroyed || a.push(null); }, abort: function (e) { a._destroyed || a.emit("error", e); } });
                try {
                    return void r.body.pipeTo(f);
                }
                catch (e) { }
            }
            var c = r.body.getReader();
            !function e() { c.read().then(function (t) { a._destroyed || (t.done ? a.push(null) : (a.push(new i(t.value)), e())); }).catch(function (e) { a._destroyed || a.emit("error", e); }); }();
        }
        else {
            if (a._xhr = e, a._pos = 0, a.url = e.responseURL, a.statusCode = e.status, a.statusMessage = e.statusText, e.getAllResponseHeaders().split(/\r?\n/).forEach(function (e) { var t = e.match(/^([^:]+):\s*(.*)/); if (t) {
                var r = t[1].toLowerCase();
                "set-cookie" === r ? (void 0 === a.headers[r] && (a.headers[r] = []), a.headers[r].push(t[2])) : void 0 !== a.headers[r] ? a.headers[r] += ", " + t[2] : a.headers[r] = t[2], a.rawHeaders.push(t[1], t[2]);
            } }), a._charset = "x-user-defined", !s.overrideMimeType) {
                var h = a.rawHeaders["mime-type"];
                if (h) {
                    var u = h.match(/;\s*charset=([^;])(;|$)/);
                    u && (a._charset = u[1].toLowerCase());
                }
                a._charset || (a._charset = "utf-8");
            }
        } }; a(c, o.Readable), c.prototype._read = function () { var e = this._resumeFetch; e && (this._resumeFetch = null, e()); }, c.prototype._onXHRProgress = function () { var e = this, t = e._xhr, r = null; switch (e._mode) {
            case "text:vbarray":
                if (t.readyState !== f.DONE)
                    break;
                try {
                    r = new n.VBArray(t.responseBody).toArray();
                }
                catch (e) { }
                if (null !== r) {
                    e.push(new i(r));
                    break;
                }
            case "text":
                try {
                    r = t.responseText;
                }
                catch (t) {
                    e._mode = "text:vbarray";
                    break;
                }
                if (r.length > e._pos) {
                    var s = r.substr(e._pos);
                    if ("x-user-defined" === e._charset) {
                        for (var a = new i(s.length), o = 0; o < s.length; o++)
                            a[o] = 255 & s.charCodeAt(o);
                        e.push(a);
                    }
                    else
                        e.push(s, e._charset);
                    e._pos = r.length;
                }
                break;
            case "arraybuffer":
                if (t.readyState !== f.DONE || !t.response)
                    break;
                r = t.response, e.push(new i(new Uint8Array(r)));
                break;
            case "moz-chunked-arraybuffer":
                if (r = t.response, t.readyState !== f.LOADING || !r)
                    break;
                e.push(new i(new Uint8Array(r)));
                break;
            case "ms-stream":
                if (r = t.response, t.readyState !== f.LOADING)
                    break;
                var c = new n.MSStreamReader;
                c.onprogress = function () { c.result.byteLength > e._pos && (e.push(new i(new Uint8Array(c.result.slice(e._pos)))), e._pos = c.result.byteLength); }, c.onload = function () { e.push(null); }, c.readAsArrayBuffer(r);
        } e._xhr.readyState === f.DONE && "ms-stream" !== e._mode && e.push(null); }; }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer); }, { "./capability": 180, _process: 141, buffer: 51, inherits: 108, "readable-stream": 164 }], 183: [function (e, t, r) {
            "use strict";
            var n = e("safe-buffer").Buffer, i = n.isEncoding || function (e) { switch ((e = "" + e) && e.toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                case "raw": return !0;
                default: return !1;
            } };
            function s(e) { var t; switch (this.encoding = function (e) { var t = function (e) { if (!e)
                return "utf8"; for (var t;;)
                switch (e) {
                    case "utf8":
                    case "utf-8": return "utf8";
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le": return "utf16le";
                    case "latin1":
                    case "binary": return "latin1";
                    case "base64":
                    case "ascii":
                    case "hex": return e;
                    default:
                        if (t)
                            return;
                        e = ("" + e).toLowerCase(), t = !0;
                } }(e); if ("string" != typeof t && (n.isEncoding === i || !i(e)))
                throw new Error("Unknown encoding: " + e); return t || e; }(e), this.encoding) {
                case "utf16le":
                    this.text = f, this.end = c, t = 4;
                    break;
                case "utf8":
                    this.fillLast = o, t = 4;
                    break;
                case "base64":
                    this.text = h, this.end = u, t = 3;
                    break;
                default: return this.write = d, void (this.end = l);
            } this.lastNeed = 0, this.lastTotal = 0, this.lastChar = n.allocUnsafe(t); }
            function a(e) { return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : -1; }
            function o(e) { var t = this.lastTotal - this.lastNeed, r = function (e, t, r) { if (128 != (192 & t[0]))
                return e.lastNeed = 0, "�".repeat(r); if (e.lastNeed > 1 && t.length > 1) {
                if (128 != (192 & t[1]))
                    return e.lastNeed = 1, "�".repeat(r + 1);
                if (e.lastNeed > 2 && t.length > 2 && 128 != (192 & t[2]))
                    return e.lastNeed = 2, "�".repeat(r + 2);
            } }(this, e, t); return void 0 !== r ? r : this.lastNeed <= e.length ? (e.copy(this.lastChar, t, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (e.copy(this.lastChar, t, 0, e.length), void (this.lastNeed -= e.length)); }
            function f(e, t) { if ((e.length - t) % 2 == 0) {
                var r = e.toString("utf16le", t);
                if (r) {
                    var n = r.charCodeAt(r.length - 1);
                    if (n >= 55296 && n <= 56319)
                        return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1], r.slice(0, -1);
                }
                return r;
            } return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = e[e.length - 1], e.toString("utf16le", t, e.length - 1); }
            function c(e) { var t = e && e.length ? this.write(e) : ""; if (this.lastNeed) {
                var r = this.lastTotal - this.lastNeed;
                return t + this.lastChar.toString("utf16le", 0, r);
            } return t; }
            function h(e, t) { var r = (e.length - t) % 3; return 0 === r ? e.toString("base64", t) : (this.lastNeed = 3 - r, this.lastTotal = 3, 1 === r ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1]), e.toString("base64", t, e.length - r)); }
            function u(e) { var t = e && e.length ? this.write(e) : ""; return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t; }
            function d(e) { return e.toString(this.encoding); }
            function l(e) { return e && e.length ? this.write(e) : ""; }
            r.StringDecoder = s, s.prototype.write = function (e) { if (0 === e.length)
                return ""; var t, r; if (this.lastNeed) {
                if (void 0 === (t = this.fillLast(e)))
                    return "";
                r = this.lastNeed, this.lastNeed = 0;
            }
            else
                r = 0; return r < e.length ? t ? t + this.text(e, r) : this.text(e, r) : t || ""; }, s.prototype.end = function (e) { var t = e && e.length ? this.write(e) : ""; return this.lastNeed ? t + "�".repeat(this.lastTotal - this.lastNeed) : t; }, s.prototype.text = function (e, t) { var r = function (e, t, r) { var n = t.length - 1; if (n < r)
                return 0; var i = a(t[n]); if (i >= 0)
                return i > 0 && (e.lastNeed = i - 1), i; if (--n < r)
                return 0; if ((i = a(t[n])) >= 0)
                return i > 0 && (e.lastNeed = i - 2), i; if (--n < r)
                return 0; if ((i = a(t[n])) >= 0)
                return i > 0 && (2 === i ? i = 0 : e.lastNeed = i - 3), i; return 0; }(this, e, t); if (!this.lastNeed)
                return e.toString("utf8", t); this.lastTotal = r; var n = e.length - (r - this.lastNeed); return e.copy(this.lastChar, 0, n), e.toString("utf8", t, n); }, s.prototype.fillLast = function (e) { if (this.lastNeed <= e.length)
                return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal); e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length), this.lastNeed -= e.length; };
        }, { "safe-buffer": 168 }], 184: [function (e, t, r) { var n = e("buffer").Buffer; t.exports = function (e) { if (e instanceof Uint8Array) {
            if (0 === e.byteOffset && e.byteLength === e.buffer.byteLength)
                return e.buffer;
            if ("function" == typeof e.buffer.slice)
                return e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
        } if (n.isBuffer(e)) {
            for (var t = new Uint8Array(e.length), r = e.length, i = 0; i < r; i++)
                t[i] = e[i];
            return t.buffer;
        } throw new Error("Argument must be a Buffer"); }; }, { buffer: 51 }], 185: [function (e, t, r) {
            "use strict";
            var n = e("punycode"), i = e("./util");
            function s() { this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null; }
            r.parse = v, r.resolve = function (e, t) { return v(e, !1, !0).resolve(t); }, r.resolveObject = function (e, t) { return e ? v(e, !1, !0).resolveObject(t) : t; }, r.format = function (e) { i.isString(e) && (e = v(e)); return e instanceof s ? e.format() : s.prototype.format.call(e); }, r.Url = s;
            var a = /^([a-z0-9.+-]+:)/i, o = /:[0-9]*$/, f = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, c = ["{", "}", "|", "\\", "^", "`"].concat(["<", ">", '"', "`", " ", "\r", "\n", "\t"]), h = ["'"].concat(c), u = ["%", "/", "?", ";", "#"].concat(h), d = ["/", "?", "#"], l = /^[+a-z0-9A-Z_-]{0,63}$/, p = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, b = { javascript: !0, "javascript:": !0 }, m = { javascript: !0, "javascript:": !0 }, g = { http: !0, https: !0, ftp: !0, gopher: !0, file: !0, "http:": !0, "https:": !0, "ftp:": !0, "gopher:": !0, "file:": !0 }, y = e("querystring");
            function v(e, t, r) { if (e && i.isObject(e) && e instanceof s)
                return e; var n = new s; return n.parse(e, t, r), n; }
            s.prototype.parse = function (e, t, r) { if (!i.isString(e))
                throw new TypeError("Parameter 'url' must be a string, not " + typeof e); var s = e.indexOf("?"), o = -1 !== s && s < e.indexOf("#") ? "?" : "#", c = e.split(o); c[0] = c[0].replace(/\\/g, "/"); var v = e = c.join(o); if (v = v.trim(), !r && 1 === e.split("#").length) {
                var _ = f.exec(v);
                if (_)
                    return this.path = v, this.href = v, this.pathname = _[1], _[2] ? (this.search = _[2], this.query = t ? y.parse(this.search.substr(1)) : this.search.substr(1)) : t && (this.search = "", this.query = {}), this;
            } var w = a.exec(v); if (w) {
                var E = (w = w[0]).toLowerCase();
                this.protocol = E, v = v.substr(w.length);
            } if (r || w || v.match(/^\/\/[^@\/]+@[^@\/]+/)) {
                var k = "//" === v.substr(0, 2);
                !k || w && m[w] || (v = v.substr(2), this.slashes = !0);
            } if (!m[w] && (k || w && !g[w])) {
                for (var S, x, A = -1, M = 0; M < d.length; M++) {
                    -1 !== (I = v.indexOf(d[M])) && (-1 === A || I < A) && (A = I);
                }
                -1 !== (x = -1 === A ? v.lastIndexOf("@") : v.lastIndexOf("@", A)) && (S = v.slice(0, x), v = v.slice(x + 1), this.auth = decodeURIComponent(S)), A = -1;
                for (M = 0; M < u.length; M++) {
                    var I;
                    -1 !== (I = v.indexOf(u[M])) && (-1 === A || I < A) && (A = I);
                }
                -1 === A && (A = v.length), this.host = v.slice(0, A), v = v.slice(A), this.parseHost(), this.hostname = this.hostname || "";
                var B = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
                if (!B)
                    for (var j = this.hostname.split(/\./), R = (M = 0, j.length); M < R; M++) {
                        var T = j[M];
                        if (T && !T.match(l)) {
                            for (var C = "", O = 0, z = T.length; O < z; O++)
                                T.charCodeAt(O) > 127 ? C += "x" : C += T[O];
                            if (!C.match(l)) {
                                var L = j.slice(0, M), N = j.slice(M + 1), P = T.match(p);
                                P && (L.push(P[1]), N.unshift(P[2])), N.length && (v = "/" + N.join(".") + v), this.hostname = L.join(".");
                                break;
                            }
                        }
                    }
                this.hostname.length > 255 ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), B || (this.hostname = n.toASCII(this.hostname));
                var D = this.port ? ":" + this.port : "", U = this.hostname || "";
                this.host = U + D, this.href += this.host, B && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), "/" !== v[0] && (v = "/" + v));
            } if (!b[E])
                for (M = 0, R = h.length; M < R; M++) {
                    var q = h[M];
                    if (-1 !== v.indexOf(q)) {
                        var F = encodeURIComponent(q);
                        F === q && (F = escape(q)), v = v.split(q).join(F);
                    }
                } var H = v.indexOf("#"); -1 !== H && (this.hash = v.substr(H), v = v.slice(0, H)); var Z = v.indexOf("?"); if (-1 !== Z ? (this.search = v.substr(Z), this.query = v.substr(Z + 1), t && (this.query = y.parse(this.query)), v = v.slice(0, Z)) : t && (this.search = "", this.query = {}), v && (this.pathname = v), g[E] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
                D = this.pathname || "";
                var K = this.search || "";
                this.path = D + K;
            } return this.href = this.format(), this; }, s.prototype.format = function () { var e = this.auth || ""; e && (e = (e = encodeURIComponent(e)).replace(/%3A/i, ":"), e += "@"); var t = this.protocol || "", r = this.pathname || "", n = this.hash || "", s = !1, a = ""; this.host ? s = e + this.host : this.hostname && (s = e + (-1 === this.hostname.indexOf(":") ? this.hostname : "[" + this.hostname + "]"), this.port && (s += ":" + this.port)), this.query && i.isObject(this.query) && Object.keys(this.query).length && (a = y.stringify(this.query)); var o = this.search || a && "?" + a || ""; return t && ":" !== t.substr(-1) && (t += ":"), this.slashes || (!t || g[t]) && !1 !== s ? (s = "//" + (s || ""), r && "/" !== r.charAt(0) && (r = "/" + r)) : s || (s = ""), n && "#" !== n.charAt(0) && (n = "#" + n), o && "?" !== o.charAt(0) && (o = "?" + o), t + s + (r = r.replace(/[?#]/g, function (e) { return encodeURIComponent(e); })) + (o = o.replace("#", "%23")) + n; }, s.prototype.resolve = function (e) { return this.resolveObject(v(e, !1, !0)).format(); }, s.prototype.resolveObject = function (e) { if (i.isString(e)) {
                var t = new s;
                t.parse(e, !1, !0), e = t;
            } for (var r = new s, n = Object.keys(this), a = 0; a < n.length; a++) {
                var o = n[a];
                r[o] = this[o];
            } if (r.hash = e.hash, "" === e.href)
                return r.href = r.format(), r; if (e.slashes && !e.protocol) {
                for (var f = Object.keys(e), c = 0; c < f.length; c++) {
                    var h = f[c];
                    "protocol" !== h && (r[h] = e[h]);
                }
                return g[r.protocol] && r.hostname && !r.pathname && (r.path = r.pathname = "/"), r.href = r.format(), r;
            } if (e.protocol && e.protocol !== r.protocol) {
                if (!g[e.protocol]) {
                    for (var u = Object.keys(e), d = 0; d < u.length; d++) {
                        var l = u[d];
                        r[l] = e[l];
                    }
                    return r.href = r.format(), r;
                }
                if (r.protocol = e.protocol, e.host || m[e.protocol])
                    r.pathname = e.pathname;
                else {
                    for (var p = (e.pathname || "").split("/"); p.length && !(e.host = p.shift());)
                        ;
                    e.host || (e.host = ""), e.hostname || (e.hostname = ""), "" !== p[0] && p.unshift(""), p.length < 2 && p.unshift(""), r.pathname = p.join("/");
                }
                if (r.search = e.search, r.query = e.query, r.host = e.host || "", r.auth = e.auth, r.hostname = e.hostname || e.host, r.port = e.port, r.pathname || r.search) {
                    var b = r.pathname || "", y = r.search || "";
                    r.path = b + y;
                }
                return r.slashes = r.slashes || e.slashes, r.href = r.format(), r;
            } var v = r.pathname && "/" === r.pathname.charAt(0), _ = e.host || e.pathname && "/" === e.pathname.charAt(0), w = _ || v || r.host && e.pathname, E = w, k = r.pathname && r.pathname.split("/") || [], S = (p = e.pathname && e.pathname.split("/") || [], r.protocol && !g[r.protocol]); if (S && (r.hostname = "", r.port = null, r.host && ("" === k[0] ? k[0] = r.host : k.unshift(r.host)), r.host = "", e.protocol && (e.hostname = null, e.port = null, e.host && ("" === p[0] ? p[0] = e.host : p.unshift(e.host)), e.host = null), w = w && ("" === p[0] || "" === k[0])), _)
                r.host = e.host || "" === e.host ? e.host : r.host, r.hostname = e.hostname || "" === e.hostname ? e.hostname : r.hostname, r.search = e.search, r.query = e.query, k = p;
            else if (p.length)
                k || (k = []), k.pop(), k = k.concat(p), r.search = e.search, r.query = e.query;
            else if (!i.isNullOrUndefined(e.search)) {
                if (S)
                    r.hostname = r.host = k.shift(), (B = !!(r.host && r.host.indexOf("@") > 0) && r.host.split("@")) && (r.auth = B.shift(), r.host = r.hostname = B.shift());
                return r.search = e.search, r.query = e.query, i.isNull(r.pathname) && i.isNull(r.search) || (r.path = (r.pathname ? r.pathname : "") + (r.search ? r.search : "")), r.href = r.format(), r;
            } if (!k.length)
                return r.pathname = null, r.search ? r.path = "/" + r.search : r.path = null, r.href = r.format(), r; for (var x = k.slice(-1)[0], A = (r.host || e.host || k.length > 1) && ("." === x || ".." === x) || "" === x, M = 0, I = k.length; I >= 0; I--)
                "." === (x = k[I]) ? k.splice(I, 1) : ".." === x ? (k.splice(I, 1), M++) : M && (k.splice(I, 1), M--); if (!w && !E)
                for (; M--; M)
                    k.unshift(".."); !w || "" === k[0] || k[0] && "/" === k[0].charAt(0) || k.unshift(""), A && "/" !== k.join("/").substr(-1) && k.push(""); var B, j = "" === k[0] || k[0] && "/" === k[0].charAt(0); S && (r.hostname = r.host = j ? "" : k.length ? k.shift() : "", (B = !!(r.host && r.host.indexOf("@") > 0) && r.host.split("@")) && (r.auth = B.shift(), r.host = r.hostname = B.shift())); return (w = w || r.host && k.length) && !j && k.unshift(""), k.length ? r.pathname = k.join("/") : (r.pathname = null, r.path = null), i.isNull(r.pathname) && i.isNull(r.search) || (r.path = (r.pathname ? r.pathname : "") + (r.search ? r.search : "")), r.auth = e.auth || r.auth, r.slashes = r.slashes || e.slashes, r.href = r.format(), r; }, s.prototype.parseHost = function () { var e = this.host, t = o.exec(e); t && (":" !== (t = t[0]) && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e); };
        }, { "./util": 186, punycode: 148, querystring: 151 }], 186: [function (e, t, r) {
            "use strict";
            t.exports = { isString: function (e) { return "string" == typeof e; }, isObject: function (e) { return "object" == typeof e && null !== e; }, isNull: function (e) { return null === e; }, isNullOrUndefined: function (e) { return null == e; } };
        }, {}], 187: [function (e, t, r) { (function (e) { function r(t) { try {
            if (!e.localStorage)
                return !1;
        }
        catch (e) {
            return !1;
        } var r = e.localStorage[t]; return null != r && "true" === String(r).toLowerCase(); } t.exports = function (e, t) { if (r("noDeprecation"))
            return e; var n = !1; return function () { if (!n) {
            if (r("throwDeprecation"))
                throw new Error(t);
            r("traceDeprecation") ? console.trace(t) : console.warn(t), n = !0;
        } return e.apply(this, arguments); }; }; }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}); }, {}], 188: [function (e, t, r) { arguments[4][108][0].apply(r, arguments); }, { dup: 108 }], 189: [function (e, t, r) { t.exports = function (e) { return e && "object" == typeof e && "function" == typeof e.copy && "function" == typeof e.fill && "function" == typeof e.readUInt8; }; }, {}], 190: [function (e, t, r) { (function (t, n) { var i = /%[sdj%]/g; r.format = function (e) { if (!g(e)) {
            for (var t = [], r = 0; r < arguments.length; r++)
                t.push(o(arguments[r]));
            return t.join(" ");
        } r = 1; for (var n = arguments, s = n.length, a = String(e).replace(i, function (e) { if ("%%" === e)
            return "%"; if (r >= s)
            return e; switch (e) {
            case "%s": return String(n[r++]);
            case "%d": return Number(n[r++]);
            case "%j": try {
                return JSON.stringify(n[r++]);
            }
            catch (e) {
                return "[Circular]";
            }
            default: return e;
        } }), f = n[r]; r < s; f = n[++r])
            b(f) || !_(f) ? a += " " + f : a += " " + o(f); return a; }, r.deprecate = function (e, i) { if (y(n.process))
            return function () { return r.deprecate(e, i).apply(this, arguments); }; if (!0 === t.noDeprecation)
            return e; var s = !1; return function () { if (!s) {
            if (t.throwDeprecation)
                throw new Error(i);
            t.traceDeprecation ? console.trace(i) : console.error(i), s = !0;
        } return e.apply(this, arguments); }; }; var s, a = {}; function o(e, t) { var n = { seen: [], stylize: c }; return arguments.length >= 3 && (n.depth = arguments[2]), arguments.length >= 4 && (n.colors = arguments[3]), p(t) ? n.showHidden = t : t && r._extend(n, t), y(n.showHidden) && (n.showHidden = !1), y(n.depth) && (n.depth = 2), y(n.colors) && (n.colors = !1), y(n.customInspect) && (n.customInspect = !0), n.colors && (n.stylize = f), h(n, e, n.depth); } function f(e, t) { var r = o.styles[t]; return r ? "[" + o.colors[r][0] + "m" + e + "[" + o.colors[r][1] + "m" : e; } function c(e, t) { return e; } function h(e, t, n) { if (e.customInspect && t && k(t.inspect) && t.inspect !== r.inspect && (!t.constructor || t.constructor.prototype !== t)) {
            var i = t.inspect(n, e);
            return g(i) || (i = h(e, i, n)), i;
        } var s = function (e, t) { if (y(t))
            return e.stylize("undefined", "undefined"); if (g(t)) {
            var r = "'" + JSON.stringify(t).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
            return e.stylize(r, "string");
        } if (m(t))
            return e.stylize("" + t, "number"); if (p(t))
            return e.stylize("" + t, "boolean"); if (b(t))
            return e.stylize("null", "null"); }(e, t); if (s)
            return s; var a = Object.keys(t), o = function (e) { var t = {}; return e.forEach(function (e, r) { t[e] = !0; }), t; }(a); if (e.showHidden && (a = Object.getOwnPropertyNames(t)), E(t) && (a.indexOf("message") >= 0 || a.indexOf("description") >= 0))
            return u(t); if (0 === a.length) {
            if (k(t)) {
                var f = t.name ? ": " + t.name : "";
                return e.stylize("[Function" + f + "]", "special");
            }
            if (v(t))
                return e.stylize(RegExp.prototype.toString.call(t), "regexp");
            if (w(t))
                return e.stylize(Date.prototype.toString.call(t), "date");
            if (E(t))
                return u(t);
        } var c, _ = "", S = !1, x = ["{", "}"]; (l(t) && (S = !0, x = ["[", "]"]), k(t)) && (_ = " [Function" + (t.name ? ": " + t.name : "") + "]"); return v(t) && (_ = " " + RegExp.prototype.toString.call(t)), w(t) && (_ = " " + Date.prototype.toUTCString.call(t)), E(t) && (_ = " " + u(t)), 0 !== a.length || S && 0 != t.length ? n < 0 ? v(t) ? e.stylize(RegExp.prototype.toString.call(t), "regexp") : e.stylize("[Object]", "special") : (e.seen.push(t), c = S ? function (e, t, r, n, i) { for (var s = [], a = 0, o = t.length; a < o; ++a)
            M(t, String(a)) ? s.push(d(e, t, r, n, String(a), !0)) : s.push(""); return i.forEach(function (i) { i.match(/^\d+$/) || s.push(d(e, t, r, n, i, !0)); }), s; }(e, t, n, o, a) : a.map(function (r) { return d(e, t, n, o, r, S); }), e.seen.pop(), function (e, t, r) { if (e.reduce(function (e, t) { return 0, t.indexOf("\n") >= 0 && 0, e + t.replace(/\u001b\[\d\d?m/g, "").length + 1; }, 0) > 60)
            return r[0] + ("" === t ? "" : t + "\n ") + " " + e.join(",\n  ") + " " + r[1]; return r[0] + t + " " + e.join(", ") + " " + r[1]; }(c, _, x)) : x[0] + _ + x[1]; } function u(e) { return "[" + Error.prototype.toString.call(e) + "]"; } function d(e, t, r, n, i, s) { var a, o, f; if ((f = Object.getOwnPropertyDescriptor(t, i) || { value: t[i] }).get ? o = f.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : f.set && (o = e.stylize("[Setter]", "special")), M(n, i) || (a = "[" + i + "]"), o || (e.seen.indexOf(f.value) < 0 ? (o = b(r) ? h(e, f.value, null) : h(e, f.value, r - 1)).indexOf("\n") > -1 && (o = s ? o.split("\n").map(function (e) { return "  " + e; }).join("\n").substr(2) : "\n" + o.split("\n").map(function (e) { return "   " + e; }).join("\n")) : o = e.stylize("[Circular]", "special")), y(a)) {
            if (s && i.match(/^\d+$/))
                return o;
            (a = JSON.stringify("" + i)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (a = a.substr(1, a.length - 2), a = e.stylize(a, "name")) : (a = a.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), a = e.stylize(a, "string"));
        } return a + ": " + o; } function l(e) { return Array.isArray(e); } function p(e) { return "boolean" == typeof e; } function b(e) { return null === e; } function m(e) { return "number" == typeof e; } function g(e) { return "string" == typeof e; } function y(e) { return void 0 === e; } function v(e) { return _(e) && "[object RegExp]" === S(e); } function _(e) { return "object" == typeof e && null !== e; } function w(e) { return _(e) && "[object Date]" === S(e); } function E(e) { return _(e) && ("[object Error]" === S(e) || e instanceof Error); } function k(e) { return "function" == typeof e; } function S(e) { return Object.prototype.toString.call(e); } function x(e) { return e < 10 ? "0" + e.toString(10) : e.toString(10); } r.debuglog = function (e) { if (y(s) && (s = t.env.NODE_DEBUG || ""), e = e.toUpperCase(), !a[e])
            if (new RegExp("\\b" + e + "\\b", "i").test(s)) {
                var n = t.pid;
                a[e] = function () { var t = r.format.apply(r, arguments); console.error("%s %d: %s", e, n, t); };
            }
            else
                a[e] = function () { }; return a[e]; }, r.inspect = o, o.colors = { bold: [1, 22], italic: [3, 23], underline: [4, 24], inverse: [7, 27], white: [37, 39], grey: [90, 39], black: [30, 39], blue: [34, 39], cyan: [36, 39], green: [32, 39], magenta: [35, 39], red: [31, 39], yellow: [33, 39] }, o.styles = { special: "cyan", number: "yellow", boolean: "yellow", undefined: "grey", null: "bold", string: "green", date: "magenta", regexp: "red" }, r.isArray = l, r.isBoolean = p, r.isNull = b, r.isNullOrUndefined = function (e) { return null == e; }, r.isNumber = m, r.isString = g, r.isSymbol = function (e) { return "symbol" == typeof e; }, r.isUndefined = y, r.isRegExp = v, r.isObject = _, r.isDate = w, r.isError = E, r.isFunction = k, r.isPrimitive = function (e) { return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || void 0 === e; }, r.isBuffer = e("./support/isBuffer"); var A = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; function M(e, t) { return Object.prototype.hasOwnProperty.call(e, t); } r.log = function () { var e, t; console.log("%s - %s", (e = new Date, t = [x(e.getHours()), x(e.getMinutes()), x(e.getSeconds())].join(":"), [e.getDate(), A[e.getMonth()], t].join(" ")), r.format.apply(r, arguments)); }, r.inherits = e("inherits"), r._extend = function (e, t) { if (!t || !_(t))
            return e; for (var r = Object.keys(t), n = r.length; n--;)
            e[r[n]] = t[r[n]]; return e; }; }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}); }, { "./support/isBuffer": 189, _process: 141, inherits: 188 }], 191: [function (require, module, exports) { var indexOf = require("indexof"), Object_keys = function (e) { if (Object.keys)
            return Object.keys(e); var t = []; for (var r in e)
            t.push(r); return t; }, forEach = function (e, t) { if (e.forEach)
            return e.forEach(t); for (var r = 0; r < e.length; r++)
            t(e[r], r, e); }, defineProp = function () { try {
            return Object.defineProperty({}, "_", {}), function (e, t, r) { Object.defineProperty(e, t, { writable: !0, enumerable: !1, configurable: !0, value: r }); };
        }
        catch (e) {
            return function (e, t, r) { e[t] = r; };
        } }(), globals = ["Array", "Boolean", "Date", "Error", "EvalError", "Function", "Infinity", "JSON", "Math", "NaN", "Number", "Object", "RangeError", "ReferenceError", "RegExp", "String", "SyntaxError", "TypeError", "URIError", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "undefined", "unescape"]; function Context() { } Context.prototype = {}; var Script = exports.Script = function (e) { if (!(this instanceof Script))
            return new Script(e); this.code = e; }; Script.prototype.runInContext = function (e) { if (!(e instanceof Context))
            throw new TypeError("needs a 'context' argument."); var t = document.createElement("iframe"); t.style || (t.style = {}), t.style.display = "none", document.body.appendChild(t); var r = t.contentWindow, n = r.eval, i = r.execScript; !n && i && (i.call(r, "null"), n = r.eval), forEach(Object_keys(e), function (t) { r[t] = e[t]; }), forEach(globals, function (t) { e[t] && (r[t] = e[t]); }); var s = Object_keys(r), a = n.call(r, this.code); return forEach(Object_keys(r), function (t) { (t in e || -1 === indexOf(s, t)) && (e[t] = r[t]); }), forEach(globals, function (t) { t in e || defineProp(e, t, r[t]); }), document.body.removeChild(t), a; }, Script.prototype.runInThisContext = function () { return eval(this.code); }, Script.prototype.runInNewContext = function (e) { var t = Script.createContext(e), r = this.runInContext(t); return forEach(Object_keys(t), function (r) { e[r] = t[r]; }), r; }, forEach(Object_keys(Script.prototype), function (e) { exports[e] = Script[e] = function (t) { var r = Script(t); return r[e].apply(r, [].slice.call(arguments, 1)); }; }), exports.createScript = function (e) { return exports.Script(e); }, exports.createContext = Script.createContext = function (e) { var t = new Context; return "object" == typeof e && forEach(Object_keys(e), function (r) { t[r] = e[r]; }), t; }; }, { indexof: 107 }], 192: [function (e, t, r) {
            "use strict";
            const n = e("stream"), i = e("util"), s = Symbol.for("level");
            var a = t.exports = function (e) { n.Writable.call(this, { objectMode: !0 }), e = e || {}, this.format = e.format, this.level = e.level, this.handleExceptions = e.handleExceptions, e.log && (this.log = e.log), e.logv && (this.logv = e.logv), e.close && (this.close = e.close); var t = this; this.once("pipe", function (e) { t.levels = e.levels, t.level = t.level || e.level, t.parent = e; }), this.once("unpipe", function (e) { e === t.parent && (this.parent = null, t.close && t.close()); }); };
            i.inherits(a, n.Writable), a.prototype._write = function (e, t, r) { return (!0 !== e.exception || this.handleExceptions) && (!this.level || this.levels[this.level] >= this.levels[e[s]]) ? this.format ? this.log(this.format.transform(Object.assign({}, e), this.format.options), r) : this.log(e, r) : r(null); }, a.prototype._writev = function (e, t) { const r = e.filter(this._accept, this); if (this.logv)
                return this.logv(r, t); for (var n = 0; n < r.length; n++)
                this.log(r[n].chunk, r[n].callback); return t(null); }, a.prototype._accept = function (e) { const t = e.chunk; return !(!0 !== t.exception && this.level && !(this.levels[this.level] >= this.levels[t[s]]) || !this.handleExceptions && !0 === t.exception); }, a.prototype._nop = function () { };
        }, { stream: 178, util: 190 }], 193: [function (e, t, r) { var n = r; n.version = e("../package.json").version, n.transports = e("./winston/transports"); var i = e("./winston/common"); n.hash = i.hash, n.clone = i.clone, n.longestElement = i.longestElement, n.exception = e("./winston/exception"), n.config = e("./winston/config"), n.addColors = n.config.addColors, n.Container = e("./winston/container").Container, n.Logger = e("./winston/logger").Logger, n.Transport = e("./winston/transports/transport").Transport, n.loggers = new n.Container; var s = new n.Logger({ transports: [new n.transports.Console] }); i.setLevels(n, null, s.levels), ["log", "query", "stream", "add", "remove", "clear", "profile", "startTimer", "extend", "cli", "handleExceptions", "unhandleExceptions", "configure"].forEach(function (e) { n[e] = function () { return s[e].apply(s, arguments); }; }), n.cli = function () { return n.padLevels = !0, i.setLevels(n, s.levels, n.config.cli.levels), s.setLevels(n.config.cli.levels), n.config.addColors(n.config.cli.colors), s.transports.console && (s.transports.console.colorize = !0, s.transports.console.timestamp = !1), n; }, n.setLevels = function (e) { i.setLevels(n, s.levels, e), s.setLevels(e); }, Object.defineProperty(n, "level", { get: function () { return s.level; }, set: function (e) { s.level = e, Object.keys(s.transports).forEach(function (t) { s.transports[t].level = e; }); } }), ["emitErrs", "exitOnError", "padLevels", "levelLength", "stripColors"].forEach(function (e) { Object.defineProperty(n, e, { get: function () { return s[e]; }, set: function (t) { s[e] = t; } }); }), Object.defineProperty(n, "default", { get: function () { return { transports: s.transports, exceptionHandlers: s.exceptionHandlers }; } }); }, { "../package.json": 219, "./winston/common": 194, "./winston/config": 195, "./winston/container": 199, "./winston/exception": 200, "./winston/logger": 201, "./winston/transports": 202, "./winston/transports/transport": 207 }], 194: [function (e, t, r) { (function (t) { var n = e("util"), i = e("crypto"), s = e("cycle"), a = e("fs"), o = e("string_decoder").StringDecoder, f = e("stream").Stream, c = e("./config"); function h() { } r.setLevels = function (e, t, n, i) { return t && Object.keys(t).forEach(function (t) { delete e[t]; }), e.levels = n || c.npm.levels, e.padLevels && (e.levelLength = r.longestElement(Object.keys(e.levels))), Object.keys(e.levels).forEach(function (t) { "log" !== t ? e[t] = function (r) { var n = [t].concat(Array.prototype.slice.call(arguments)); e.log.apply(e, n); } : console.warn('Log level named "log" will clash with the method "log". Consider using a different name.'); }), e; }, r.longestElement = function (e) { return Math.max.apply(null, e.map(function (e) { return e.length; })); }, r.clone = function (e) { if (e instanceof Error) {
            var n = { message: e.message };
            return Object.getOwnPropertyNames(e).forEach(function (t) { n[t] = e[t]; }), n;
        } return e instanceof Object ? e instanceof Date ? new Date(e.getTime()) : function (e) { var n = Array.isArray(e) ? [] : {}; for (var i in e)
            Array.isArray(e[i]) ? n[i] = e[i].slice(0) : e[i] instanceof t ? n[i] = e[i].slice(0) : "function" != typeof e[i] ? n[i] = e[i] instanceof Object ? r.clone(e[i]) : e[i] : "function" == typeof e[i] && (n[i] = e[i]); return n; }(s.decycle(e)) : e; }, r.log = function (e) { var i, s = "function" == typeof e.timestamp ? e.timestamp : r.timestamp, a = e.timestamp ? s() : null, o = void 0 === e.showLevel || e.showLevel, f = null === e.meta || void 0 === e.meta || e.meta instanceof Error ? e.meta || null : r.clone(e.meta); if (e.raw)
            return "object" != typeof f && null != f && (f = { meta: f }), (i = r.clone(f) || {}).level = e.level, i.message = e.message.stripColors ? e.message.stripColors : e.message, JSON.stringify(i); if (e.json || !0 === e.logstash) {
            if ("object" != typeof f && null != f && (f = { meta: f }), (i = r.clone(f) || {}).level = e.level, i.message = i.message || "", e.label && (i.label = e.label), e.message && (i.message = e.message), a && (i.timestamp = a), !0 === e.logstash) {
                var h = {};
                void 0 !== i.message && (h["@message"] = i.message, delete i.message), void 0 !== i.timestamp && (h["@timestamp"] = i.timestamp, delete i.timestamp), h["@fields"] = r.clone(i), i = h;
            }
            return "function" == typeof e.stringify ? e.stringify(i) : JSON.stringify(i, function (e, r) { return r instanceof t ? r.toString("base64") : r; });
        } if ("function" == typeof e.formatter)
            return e.meta = f || e.meta, String(e.formatter(r.clone(e))); if (i = a ? a + " - " : "", o && (i += "all" === e.colorize || "level" === e.colorize || !0 === e.colorize ? c.colorize(e.level) : e.level), i += e.align ? "\t" : "", i += a || o ? ": " : "", i += e.label ? "[" + e.label + "] " : "", i += "all" === e.colorize || "message" === e.colorize ? c.colorize(e.level, e.message) : e.message, null !== f && void 0 !== f)
            if (f && f instanceof Error && f.stack && (f = f.stack), "object" != typeof f)
                i += " " + f;
            else if (Object.keys(f).length > 0)
                if ("function" == typeof e.prettyPrint)
                    i += " " + e.prettyPrint(f);
                else if (e.prettyPrint)
                    i += " \n" + n.inspect(f, !1, e.depth || null, e.colorize);
                else if (e.humanReadableUnhandledException && Object.keys(f).length >= 5 && f.hasOwnProperty("date") && f.hasOwnProperty("process") && f.hasOwnProperty("os") && f.hasOwnProperty("trace") && f.hasOwnProperty("stack")) {
                    var u = f.stack;
                    delete f.stack, delete f.trace, i += " " + r.serialize(f), u && (i += "\n" + u.join("\n"));
                }
                else
                    i += " " + r.serialize(f); return i; }, r.capitalize = function (e) { return e && e[0].toUpperCase() + e.slice(1); }, r.hash = function (e) { return i.createHash("sha1").update(e).digest("hex"); }, r.pad = function (e) { return e < 10 ? "0" + e.toString(10) : e.toString(10); }, r.timestamp = function () { return (new Date).toISOString(); }, r.serialize = function (e, n) { if ("symbol" == typeof n && (n = n.toString()), "symbol" == typeof e && (e = e.toString()), null === e ? e = "null" : void 0 === e ? e = "undefined" : !1 === e && (e = "false"), "object" != typeof e)
            return n ? n + "=" + e : e; if (e instanceof t)
            return n ? n + "=" + e.toString("base64") : e.toString("base64"); for (var i = "", s = Object.keys(e), a = s.length, o = 0; o < a; o++) {
            if (Array.isArray(e[s[o]])) {
                i += s[o] + "=[";
                for (var f = 0, c = e[s[o]].length; f < c; f++)
                    i += r.serialize(e[s[o]][f]), f < c - 1 && (i += ", ");
                i += "]";
            }
            else
                e[s[o]] instanceof Date ? i += s[o] + "=" + e[s[o]] : i += r.serialize(e[s[o]], s[o]);
            o < a - 1 && (i += ", ");
        } return i; }, r.tailFile = function (e, r) { var n = new t(65536), i = new o("utf8"), s = new f, c = "", u = 0, d = 0; return -1 === e.start && delete e.start, s.readable = !0, s.destroy = function () { s.destroyed = !0, s.emit("end"), s.emit("close"); }, a.open(e.file, "a+", "0644", function (t, o) { if (t)
            return r ? r(t) : s.emit("error", t), void s.destroy(); !function t() { if (!s.destroyed)
            return a.read(o, n, 0, n.length, u, function (a, o) { if (a)
                return r ? r(a) : s.emit("error", a), void s.destroy(); if (!o)
                return c && ((null == e.start || d > e.start) && (r ? r(null, c) : s.emit("line", c)), d++, c = ""), setTimeout(t, 1e3); var f = i.write(n.slice(0, o)); r || s.emit("data", f); for (var h = (f = (c + f).split(/\n+/)).length - 1, l = 0; l < h; l++)
                (null == e.start || d > e.start) && (r ? r(null, f[l]) : s.emit("line", f[l])), d++; return c = f[h], u += o, t(); }); a.close(o, h); }(); }), r ? s.destroy : s; }, r.stringArrayToSet = function (e, t) { return void 0 === t && (t = "Cannot make set from Array with non-string elements"), e.reduce(function (e, r) { if (!("string" == typeof r || r instanceof String))
            throw new Error(t); return e[r] = !0, e; }, Object.create(null)); }; }).call(this, e("buffer").Buffer); }, { "./config": 195, buffer: 51, crypto: 61, cycle: 62, fs: 49, stream: 178, string_decoder: 183, util: 190 }], 195: [function (e, t, r) { var n = e("colors/safe"); n.enabled = !0; var i = r, s = r.allColors = {}; i.addColors = function (e) { !function (e) { Array.prototype.slice.call(arguments, 1).forEach(function (t) { for (var r = Object.keys(t), n = 0; n < r.length; n++)
            e[r[n]] = t[r[n]]; }); }(s, e); }, i.colorize = function (e, t) { void 0 === t && (t = e); var r = t; if (s[e] instanceof Array)
            for (var i = 0, a = s[e].length; i < a; ++i)
                r = n[s[e][i]](r);
        else if (s[e].match(/\s/)) {
            var o = s[e].split(/\s+/);
            for (i = 0; i < o.length; ++i)
                r = n[o[i]](r);
            s[e] = o;
        }
        else
            r = n[s[e]](r); return r; }, i.cli = e("./config/cli-config"), i.npm = e("./config/npm-config"), i.syslog = e("./config/syslog-config"), i.addColors(i.cli.colors), i.addColors(i.npm.colors), i.addColors(i.syslog.colors); }, { "./config/cli-config": 196, "./config/npm-config": 197, "./config/syslog-config": 198, "colors/safe": 218 }], 196: [function (e, t, r) { var n = r; n.levels = { error: 0, warn: 1, help: 2, data: 3, info: 4, debug: 5, prompt: 6, verbose: 7, input: 8, silly: 9 }, n.colors = { error: "red", warn: "yellow", help: "cyan", data: "grey", info: "green", debug: "blue", prompt: "grey", verbose: "cyan", input: "grey", silly: "magenta" }; }, {}], 197: [function (e, t, r) { var n = r; n.levels = { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }, n.colors = { error: "red", warn: "yellow", info: "green", verbose: "cyan", debug: "blue", silly: "magenta" }; }, {}], 198: [function (e, t, r) { var n = r; n.levels = { emerg: 0, alert: 1, crit: 2, error: 3, warning: 4, notice: 5, info: 6, debug: 7 }, n.colors = { emerg: "red", alert: "yellow", crit: "red", error: "red", warning: "red", notice: "yellow", info: "green", debug: "blue" }; }, {}], 199: [function (e, t, r) { var n = e("./common"), i = e("../winston"), s = e("util")._extend, a = r.Container = function (e) { this.loggers = {}, this.options = e || {}, this.default = { transports: [new i.transports.Console({ level: "silly", colorize: !1 })] }; }; a.prototype.get = a.prototype.add = function (e, t) { var r, a = this; return this.loggers[e] || (r = (t = s({}, t || this.options || this.default)).transports || this.options.transports, t.transports = r ? r.slice() : [], 0 !== t.transports.length || t && t.console || t.transports.push(this.default.transports[0]), Object.keys(t).forEach(function (r) { if ("transports" !== r && "filters" !== r && "rewriters" !== r) {
            var s = n.capitalize(r);
            if (!i.transports[s])
                throw new Error("Cannot add unknown transport: " + s);
            var a = t[r];
            a.id = e, t.transports.push(new i.transports[s](a));
        } }), t.id = e, this.loggers[e] = new i.Logger(t), this.loggers[e].on("close", function () { a._delete(e); })), this.loggers[e]; }, a.prototype.has = function (e) { return !!this.loggers[e]; }, a.prototype.close = function (e) { var t = this; function r(e) { t.loggers[e] && (t.loggers[e].close(), t._delete(e)); } return e ? r(e) : Object.keys(this.loggers).forEach(function (e) { r(e); }); }, a.prototype._delete = function (e) { delete this.loggers[e]; }; }, { "../winston": 193, "./common": 194, util: 190 }], 200: [function (e, t, r) { (function (t) { var n = e("os"), i = e("stack-trace"), s = r; s.getAllInfo = function (e) { return { date: (new Date).toString(), process: s.getProcessInfo(), os: s.getOsInfo(), trace: s.getTrace(e), stack: e.stack && e.stack.split("\n") }; }, s.getProcessInfo = function () { return { pid: t.pid, uid: t.getuid ? t.getuid() : null, gid: t.getgid ? t.getgid() : null, cwd: t.cwd(), execPath: t.execPath, version: t.version, argv: t.argv, memoryUsage: t.memoryUsage() }; }, s.getOsInfo = function () { return { loadavg: n.loadavg(), uptime: n.uptime() }; }, s.getTrace = function (e) { return (e ? i.parse(e) : i.get()).map(function (e) { return { column: e.getColumnNumber(), file: e.getFileName(), function: e.getFunctionName(), line: e.getLineNumber(), method: e.getMethodName(), native: e.isNative() }; }); }; }).call(this, e("_process")); }, { _process: 141, os: 117, "stack-trace": 177 }], 201: [function (e, t, r) { (function (t) { var n = e("events"), i = e("util"), s = e("async"), a = e("./config"), o = e("./common"), f = e("./exception"), c = e("stream").Stream, h = /%[sdj%]/g, u = r.Logger = function (e) { n.EventEmitter.call(this), this.configure(e); }; function d(e) { this.logger = e, this.start = Date.now(); } i.inherits(u, n.EventEmitter), u.prototype.configure = function (e) { var t = this; Array.isArray(this._names) && this._names.length && this.clear(), e = e || {}, this.transports = {}, this._names = [], e.transports && e.transports.forEach(function (e) { t.add(e, null, !0); }), this.padLevels = e.padLevels || !1, this.setLevels(e.levels), e.colors && a.addColors(e.colors), this.id = e.id || null, this.level = e.level || "info", this.emitErrs = e.emitErrs || !1, this.stripColors = e.stripColors || !1, this.exitOnError = void 0 === e.exitOnError || e.exitOnError, this.exceptionHandlers = {}, this.profilers = {}, ["rewriters", "filters"].forEach(function (r) { t[r] = Array.isArray(e[r]) ? e[r] : []; }), e.exceptionHandlers && this.handleExceptions(e.exceptionHandlers); }, u.prototype.log = function (e) { for (var t = Array.prototype.slice.call(arguments, 1), r = this; null === t[t.length - 1];)
            t.pop(); var n = "function" == typeof t[t.length - 1] ? t.pop() : null; function a(e) { n ? n(e) : r.emitErrs && r.emit("error", e); } if (0 === this._names.length)
            return a(new Error("Cannot log with no transports.")); if (void 0 === r.levels[e])
            return a(new Error("Unknown log level: " + e)); var o = this._names.filter(function (t) { var n = r.transports[t]; return n.level && r.levels[n.level] >= r.levels[e] || !n.level && r.levels[r.level] >= r.levels[e]; }); if (o.length) {
            var f, c = {}, u = t && t[0] && t[0].match && null !== t[0].match(h) ? t[0].match(h) : [], d = u.filter(function (e) { return "%%" === e; });
            if (t.length - 1 - (u.length - d.length) > 0 || 1 === t.length) {
                c = t[t.length - 1] || t;
                var l = Object.prototype.toString.call(c);
                c = "[object Object]" === l || "[object Error]" === l || "[object Array]" === l ? t.pop() : {};
            }
            if (f = i.format.apply(null, t), this.padLevels && (f = new Array(this.levelLength - e.length + 1).join(" ") + f), this.rewriters.forEach(function (t) { c = t(e, f, c, r); }), this.filters.forEach(function (t) { var n = t(e, f, c, r); "string" == typeof n ? f = n : (f = n.msg, c = n.meta); }), this.stripColors) {
                f = ("" + f).replace(/\u001b\[(\d+(;\d+)*)?m/g, "");
            }
            return s.forEach(o, function (t, n) { var i = r.transports[t]; i.log(e, f, c, function (t) { if (t)
                return t.transport = i, p(t), n(); r.emit("logging", i, e, f, c), n(); }); }, p), this;
        } function p(t) { if (n) {
            if (t)
                return n(t);
            n(null, e, f, c);
        } n = null, t || r.emit("logged", e, f, c); } n && n(); }, u.prototype.query = function (e, t) { "function" == typeof e && (t = e, e = {}); var r, n = this, i = (e = e || {}, {}), a = o.clone(e.query) || {}; function f(t, r) { e.query && (e.query = t.formatQuery(a)), t.query(e, function (n, i) { if (n)
            return r(n); r(null, t.formatResults(i, e.format)); }); } if (e.transport)
            return e.transport = e.transport.toLowerCase(), f(this.transports[e.transport], t); r = this._names.map(function (e) { return n.transports[e]; }).filter(function (e) { return !!e.query; }), s.forEach(r, function (e, t) { f(e, function (r, n) { t && ((n = r || n) && (i[e.name] = n), t()), t = null; }); }, function () { t(null, i); }); }, u.prototype.stream = function (e) { var t = this, r = (e = e || {}, new c), n = []; if (e.transport) {
            var i = this.transports[e.transport];
            if (delete e.transport, i && i.stream)
                return i.stream(e);
        } return r._streams = n, r.destroy = function () { for (var e = n.length; e--;)
            n[e].destroy(); }, this._names.map(function (e) { return t.transports[e]; }).filter(function (e) { return !!e.stream; }).forEach(function (t) { var i = t.stream(e); i && (n.push(i), i.on("log", function (e) { e.transport = e.transport || [], e.transport.push(t.name), r.emit("log", e); }), i.on("error", function (e) { e.transport = e.transport || [], e.transport.push(t.name), r.emit("error", e); })); }), r; }, u.prototype.close = function () { var e = this; this._names.forEach(function (t) { var r = e.transports[t]; r && r.close && r.close(); }), this.emit("close"); }, u.prototype.handleExceptions = function () { var e = [], r = this; Array.prototype.slice.call(arguments).forEach(function (t) { Array.isArray(t) ? e = e.concat(t) : e.push(t); }), this.exceptionHandlers = this.exceptionHandlers || {}, e.forEach(function (e) { r.exceptionHandlers[e.name] = e; }), this._hnames = Object.keys(r.exceptionHandlers), this.catchExceptions || (this.catchExceptions = this._uncaughtException.bind(this), t.on("uncaughtException", this.catchExceptions)); }, u.prototype.unhandleExceptions = function () { var e = this; this.catchExceptions && (Object.keys(this.exceptionHandlers).forEach(function (t) { var r = e.exceptionHandlers[t]; r.close && r.close(); }), this.exceptionHandlers = {}, Object.keys(this.transports).forEach(function (t) { var r = e.transports[t]; r.handleExceptions && (r.handleExceptions = !1); }), t.removeListener("uncaughtException", this.catchExceptions), this.catchExceptions = !1); }, u.prototype.add = function (e, t, r) { var n = r ? e : new e(t); if (!n.name && !n.log)
            throw new Error("Unknown transport with no log() method"); if (this.transports[n.name])
            throw new Error("Transport already attached: " + n.name + ", assign a different name"); return this.transports[n.name] = n, this._names = Object.keys(this.transports), n._onError = this._onError.bind(this, n), r || n.on("error", n._onError), n.handleExceptions && !this.catchExceptions && this.handleExceptions(), this; }, u.prototype.clear = function () { Object.keys(this.transports).forEach(function (e) { this.remove({ name: e }); }, this); }, u.prototype.remove = function (e) { var t = "string" != typeof e ? e.name || e.prototype.name : e; if (!this.transports[t])
            throw new Error("Transport " + t + " not attached to this instance"); var r = this.transports[t]; return delete this.transports[t], this._names = Object.keys(this.transports), r.close && r.close(), r._onError && r.removeListener("error", r._onError), this; }, u.prototype.startTimer = function () { return new d(this); }, u.prototype.profile = function (e) { var t, r, n, i, s, a = Date.now(); return this.profilers[e] ? (t = this.profilers[e], delete this.profilers[e], s = "function" == typeof (r = Array.prototype.slice.call(arguments))[r.length - 1] ? r.pop() : null, i = "object" == typeof r[r.length - 1] ? r.pop() : {}, n = 2 === r.length ? r[1] : e, i.durationMs = a - t, this.info(n, i, s)) : (this.profilers[e] = a, this); }, u.prototype.setLevels = function (e) { return o.setLevels(this, this.levels, e); }, u.prototype.cli = function () { return this.padLevels = !0, this.setLevels(a.cli.levels), a.addColors(a.cli.colors), this.transports.console && (this.transports.console.colorize = this.transports.console.colorize || !0, this.transports.console.timestamp = this.transports.console.timestamp || !1), this; }, u.prototype._uncaughtException = function (e) { var r, n, i = !1, a = f.getAllInfo(e), o = this._getExceptionHandlers(); function c() { n && !i && (clearTimeout(r), i = !0, t.exit(1)); } if (n = "function" == typeof this.exitOnError ? this.exitOnError(e) : this.exitOnError, !o || 0 === o.length)
            return c(); s.forEach(o, function (t, r) { t.logException("uncaughtException: " + (e.message || e), a, r, e); }, c), n && (r = setTimeout(c, 3e3)); }, u.prototype._getExceptionHandlers = function () { var e = this; return this._hnames.map(function (t) { return e.exceptionHandlers[t]; }).concat(this._names.map(function (t) { return e.transports[t].handleExceptions && e.transports[t]; })).filter(Boolean); }, u.prototype._onError = function (e, t) { this.emitErrs && this.emit("error", t, e); }, d.prototype.done = function (e) { var t = Array.prototype.slice.call(arguments), r = "function" == typeof t[t.length - 1] ? t.pop() : null, n = "object" == typeof t[t.length - 1] ? t.pop() : {}; return n.duration = Date.now() - this.start + "ms", this.logger.info(e, n, r); }; }).call(this, e("_process")); }, { "./common": 194, "./config": 195, "./exception": 200, _process: 141, async: 208, events: 89, stream: 178, util: 190 }], 202: [function (e, t, r) { Object.defineProperty(r, "Console", { configurable: !0, enumerable: !0, get: function () { return e("./transports/console").Console; } }), Object.defineProperty(r, "File", { configurable: !0, enumerable: !0, get: function () { return e("./transports/file").File; } }), Object.defineProperty(r, "Http", { configurable: !0, enumerable: !0, get: function () { return e("./transports/http").Http; } }), Object.defineProperty(r, "Memory", { configurable: !0, enumerable: !0, get: function () { return e("./transports/memory").Memory; } }); }, { "./transports/console": 203, "./transports/file": 204, "./transports/http": 205, "./transports/memory": 206 }], 203: [function (e, t, r) { (function (t) { e("events"); var n = e("os"), i = e("util"), s = e("../common"), a = e("./transport").Transport, o = r.Console = function (e) { a.call(this, e), e = e || {}, this.json = e.json || !1, this.colorize = e.colorize || !1, this.prettyPrint = e.prettyPrint || !1, this.timestamp = void 0 !== e.timestamp && e.timestamp, this.showLevel = void 0 === e.showLevel || e.showLevel, this.label = e.label || null, this.logstash = e.logstash || !1, this.depth = e.depth || null, this.align = e.align || !1, this.stderrLevels = function (e, t) { var r = "Cannot have non-string elements in stderrLevels Array"; if (t) {
            if (e)
                throw new Error("Cannot set debugStdout and stderrLevels together");
            return s.stringArrayToSet(["error"], r);
        } if (!e)
            return s.stringArrayToSet(["error", "debug"], r); if (!Array.isArray(e))
            throw new Error("Cannot set stderrLevels to type other than Array"); return s.stringArrayToSet(e, r); }(e.stderrLevels, e.debugStdout), this.eol = e.eol || n.EOL, this.json && (this.stringify = e.stringify || function (e) { return JSON.stringify(e, null, 2); }); }; i.inherits(o, a), o.prototype.name = "console", o.prototype.log = function (e, r, n, i) { if (this.silent)
            return i(null, !0); var a; a = s.log({ colorize: this.colorize, json: this.json, level: e, message: r, meta: n, stringify: this.stringify, timestamp: this.timestamp, showLevel: this.showLevel, prettyPrint: this.prettyPrint, raw: this.raw, label: this.label, logstash: this.logstash, depth: this.depth, formatter: this.formatter, align: this.align, humanReadableUnhandledException: this.humanReadableUnhandledException }), this.stderrLevels[e] ? t.stderr.write(a + this.eol) : t.stdout.write(a + this.eol), this.emit("logged"), i(null, !0); }; }).call(this, e("_process")); }, { "../common": 194, "./transport": 207, _process: 141, events: 89, os: 117, util: 190 }], 204: [function (e, t, r) { (function (t) { e("events"); var n = e("fs"), i = e("path"), s = e("util"), a = e("async"), o = e("zlib"), f = e("../common"), c = e("./transport").Transport, h = e("isstream").isWritable, u = e("stream").Stream, d = e("os"), l = r.File = function (e) { var t = this; function r(t) { Array.prototype.slice.call(arguments, 1).forEach(function (r) { if (e[r])
            throw new Error("Cannot set " + r + " and " + t + "together"); }); } if (c.call(this, e), e.filename || e.dirname)
            r("filename or dirname", "stream"), this._basename = this.filename = e.filename ? i.basename(e.filename) : "winston.log", this.dirname = e.dirname || i.dirname(e.filename), this.options = e.options || { flags: "a" }, this.options.highWaterMark = this.options.highWaterMark || 24;
        else {
            if (!e.stream)
                throw new Error("Cannot log to file without filename or stream.");
            r("stream", "filename", "maxsize"), this._stream = e.stream, this._isStreams2 = h(this._stream), this._stream.on("error", function (e) { t.emit("error", e); }), this._stream.setMaxListeners(1 / 0);
        } this.json = !1 !== e.json, this.logstash = e.logstash || !1, this.colorize = e.colorize || !1, this.maxsize = e.maxsize || null, this.rotationFormat = e.rotationFormat || !1, this.zippedArchive = e.zippedArchive || !1, this.maxFiles = e.maxFiles || null, this.prettyPrint = e.prettyPrint || !1, this.label = e.label || null, this.timestamp = null == e.timestamp || e.timestamp, this.eol = e.eol || d.EOL, this.tailable = e.tailable || !1, this.depth = e.depth || null, this.showLevel = void 0 === e.showLevel || e.showLevel, this.maxRetries = e.maxRetries || 2, this.json && (this.stringify = e.stringify), this._size = 0, this._created = 0, this._buffer = [], this._draining = !1, this._opening = !1, this._failures = 0, this._archive = null; }; s.inherits(l, c), l.prototype.name = "file", l.prototype.log = function (e, t, r, n) { if (this.silent)
            return n(null, !0); if (this._failures >= this.maxRetries)
            return n(new Error("Transport is in a failed state.")); var i = this; "string" != typeof t && (t = "" + t); var s = f.log({ level: e, message: t, meta: r, json: this.json, logstash: this.logstash, colorize: this.colorize, prettyPrint: this.prettyPrint, timestamp: this.timestamp, showLevel: this.showLevel, stringify: this.stringify, label: this.label, depth: this.depth, formatter: this.formatter, humanReadableUnhandledException: this.humanReadableUnhandledException }); "string" == typeof s && (s += this.eol), this.filename ? this.open(function (e) { if (e)
            return i._buffer.push([s, n]); i._write(s, n), i._size += s.length, i._lazyDrain(); }) : (this._write(s, n), this._size += s.length, this._lazyDrain()); }, l.prototype._write = function (e, r) { if (this._isStreams2)
            return this._stream.write(e), r && t.nextTick(function () { r(null, !0); }); var n = this._stream.write(e); return r ? !1 === n ? this._stream.once("drain", function () { r(null, !0); }) : void t.nextTick(function () { r(null, !0); }) : void 0; }, l.prototype.query = function (e, t) { "function" == typeof e && (t = e, e = {}); var r = i.join(this.dirname, this.filename), s = (e = this.normalizeQuery(e), ""), a = [], o = 0, f = n.createReadStream(r, { encoding: "utf8" }); function c(t, r) { try {
            var n = JSON.parse(t);
            (function (t) { if (!t)
                return; if ("object" != typeof t)
                return; var r = new Date(t.timestamp); if (e.from && r < e.from || e.until && r > e.until || e.level && e.level !== t.level)
                return; return !0; })(n) && function (t) { if (e.rows && a.length >= e.rows && "desc" != e.order)
                return void (f.readable && f.destroy()); if (e.fields) {
                var r = {};
                e.fields.forEach(function (e) { r[e] = t[e]; }), t = r;
            } "desc" === e.order && a.length >= e.rows && a.shift(); a.push(t); }(n);
        }
        catch (e) {
            r || f.emit("error", e);
        } } f.on("error", function (e) { if (f.readable && f.destroy(), t)
            return "ENOENT" !== e.code ? t(e) : t(null, a); }), f.on("data", function (t) { for (var r = (t = (s + t).split(/\n+/)).length - 1, n = 0; n < r; n++)
            (!e.start || o >= e.start) && c(t[n]), o++; s = t[r]; }), f.on("close", function () { s && c(s, !0), "desc" === e.order && (a = a.reverse()), t && t(null, a); }); }, l.prototype.stream = function (e) { var t = i.join(this.dirname, this.filename), r = (e = e || {}, new u), n = { file: t, start: e.start }; return r.destroy = f.tailFile(n, function (e, t) { if (e)
            return r.emit("error", e); try {
            r.emit("data", t), t = JSON.parse(t), r.emit("log", t);
        }
        catch (e) {
            r.emit("error", e);
        } }), r; }, l.prototype.open = function (e) { return this.opening ? e(!0) : !this._stream || this.maxsize && this._size >= this.maxsize ? (e(!0), this._createStream()) : (this._archive = this.zippedArchive ? this._stream.path : null, void e()); }, l.prototype.close = function () { var e = this; this._stream && (this._stream.end(), this._stream.destroySoon(), this._stream.once("finish", function () { e.emit("flush"), e.emit("closed"); })); }, l.prototype.flush = function () { var e = this; if (!this._buffer.length)
            return e.emit("flush"); this._buffer.forEach(function (r) { var n = r[0], i = r[1]; t.nextTick(function () { e._write(n, i), e._size += n.length; }); }), e._buffer.length = 0, e._stream.once("drain", function () { e.emit("flush"), e.emit("logged"); }); }, l.prototype._createStream = function () { var e = this; this.opening = !0, function t(r) { var s = i.join(e.dirname, r); function a(t) { e._stream && (e._stream.end(), e._stream.destroySoon()), e._size = t, e.filename = r, e._stream = n.createWriteStream(s, e.options), e._isStreams2 = h(e._stream), e._stream.on("error", function (t) { e._failures < e.maxRetries ? (e._createStream(), e._failures++) : e.emit("error", t); }), e._stream.setMaxListeners(1 / 0), e.once("flush", function () { e.flush(), e.opening = !1, e.emit("open", s); }), e.flush(), function () { if (e._archive) {
            var t = o.createGzip(), r = n.createReadStream(String(e._archive)), i = n.createWriteStream(e._archive + ".gz");
            r.pipe(t).pipe(i), n.unlink(String(e._archive), function () { }), e._archive = "";
        } }(); } n.stat(s, function (r, n) { return r ? "ENOENT" !== r.code ? e.emit("error", r) : a(0) : !n || e.maxsize && n.size >= e.maxsize ? e._incFile(function () { t(e._getFile()); }) : void a(n.size); }); }(this._getFile()); }, l.prototype._incFile = function (e) { var t = i.extname(this._basename), r = i.basename(this._basename, t); this.tailable ? this._checkMaxFilesTailable(t, r, e) : (this._created += 1, this._checkMaxFilesIncrementing(t, r, e)); }, l.prototype._getFile = function () { var e = i.extname(this._basename), t = i.basename(this._basename, e); return !this.tailable && this._created ? t + (this.rotationFormat ? this.rotationFormat() : this._created) + e : t + e; }, l.prototype._checkMaxFilesIncrementing = function (e, t, r) { var s, a; if (this.zippedArchive && (this._archive = i.join(this.dirname, t + (1 === this._created ? "" : this._created - 1) + e)), !this.maxFiles || this._created < this.maxFiles)
            return r(); s = this._created - this.maxFiles, a = i.join(this.dirname, t + (0 !== s ? s : "") + e + (this.zippedArchive ? ".gz" : "")), n.unlink(a, r); }, l.prototype._checkMaxFilesTailable = function (e, t, r) { var s = [], o = this; if (this.maxFiles) {
            for (var f = this.maxFiles - 1; f > 0; f--)
                s.push(function (r) { return function (s) { var a = i.join(o.dirname, t + (r - 1) + e + (o.zippedArchive ? ".gz" : "")); n.exists(a, function (f) { if (!f)
                    return s(null); n.rename(a, i.join(o.dirname, t + r + e + (o.zippedArchive ? ".gz" : "")), s); }); }; }(f));
            o.zippedArchive && (o._archive = i.join(o.dirname, t + 1 + e)), a.series(s, function (s) { n.rename(i.join(o.dirname, t + e), i.join(o.dirname, t + 1 + e), r); });
        } }, l.prototype._lazyDrain = function () { var e = this; !this._draining && this._stream && (this._draining = !0, this._stream.once("drain", function () { e._draining = !1, e.emit("logged"); })); }; }).call(this, e("_process")); }, { "../common": 194, "./transport": 207, _process: 141, async: 208, events: 89, fs: 49, isstream: 111, os: 117, path: 134, stream: 178, util: 190, zlib: 48 }], 205: [function (e, t, r) { (function (t) { var n = e("util"), i = e("../../winston"), s = e("http"), a = e("https"), o = e("stream").Stream, f = e("./transport").Transport, c = r.Http = function (e) { f.call(this, e), e = e || {}, this.name = "http", this.ssl = !!e.ssl, this.host = e.host || "localhost", this.port = e.port, this.auth = e.auth, this.path = e.path || "", this.agent = e.agent, this.port || (this.port = this.ssl ? 443 : 80); }; n.inherits(c, i.Transport), c.prototype.name = "http", c.prototype._request = function (e, r) { var n, i = (e = e || {}).auth || this.auth, o = e.path || this.path || ""; delete e.auth, delete e.path, (n = (this.ssl ? a : s).request({ host: this.host, port: this.port, path: "/" + o.replace(/^\//, ""), method: "POST", headers: { "Content-Type": "application/json" }, agent: this.agent, auth: i ? i.username + ":" + i.password : "" })).on("error", r), n.on("response", function (e) { var t = ""; e.on("data", function (e) { t += e; }), e.on("end", function () { r(null, e, t); }), e.resume(); }), n.end(new t(JSON.stringify(e), "utf8")); }, c.prototype.log = function (e, t, r, n) { var i = this; "function" == typeof r && (n = r, r = {}); var s = { method: "collect", params: { level: e, message: t, meta: r } }; r && (r.path && (s.path = r.path, delete r.path), r.auth && (s.auth = r.auth, delete r.auth)), this._request(s, function (e, t) { if (t && 200 !== t.statusCode && (e = new Error("HTTP Status Code: " + t.statusCode)), e)
            return n(e); i.emit("logged"), n && n(null, !0); }); }, c.prototype.query = function (e, t) { "function" == typeof e && (t = e, e = {}); (e = { method: "query", params: e = this.normalizeQuery(e) }).params.path && (e.path = e.params.path, delete e.params.path), e.params.auth && (e.auth = e.params.auth, delete e.params.auth), this._request(e, function (e, r, n) { if (r && 200 !== r.statusCode && (e = new Error("HTTP Status Code: " + r.statusCode)), e)
            return t(e); if ("string" == typeof n)
            try {
                n = JSON.parse(n);
            }
            catch (e) {
                return t(e);
            } t(null, n); }); }, c.prototype.stream = function (e) { e = e || {}; var t, r, n = new o; return n.destroy = function () { t.destroy(); }, (e = { method: "stream", params: e }).params.path && (e.path = e.params.path, delete e.params.path), e.params.auth && (e.auth = e.params.auth, delete e.params.auth), t = this._request(e), r = "", t.on("data", function (e) { for (var t = (e = (r + e).split(/\n+/)).length - 1, i = 0; i < t; i++)
            try {
                n.emit("log", JSON.parse(e[i]));
            }
            catch (e) {
                n.emit("error", e);
            } r = e[t]; }), t.on("error", function (e) { n.emit("error", e); }), n; }; }).call(this, e("buffer").Buffer); }, { "../../winston": 193, "./transport": 207, buffer: 51, http: 179, https: 105, stream: 178, util: 190 }], 206: [function (e, t, r) { e("events"); var n = e("util"), i = e("../common"), s = e("./transport").Transport, a = r.Memory = function (e) { s.call(this, e), e = e || {}, this.errorOutput = [], this.writeOutput = [], this.json = e.json || !1, this.colorize = e.colorize || !1, this.prettyPrint = e.prettyPrint || !1, this.timestamp = void 0 !== e.timestamp && e.timestamp, this.showLevel = void 0 === e.showLevel || e.showLevel, this.label = e.label || null, this.depth = e.depth || null, this.json && (this.stringify = e.stringify || function (e) { return JSON.stringify(e, null, 2); }); }; n.inherits(a, s), a.prototype.name = "memory", a.prototype.log = function (e, t, r, n) { if (this.silent)
            return n(null, !0); var s; s = i.log({ colorize: this.colorize, json: this.json, level: e, message: t, meta: r, stringify: this.stringify, timestamp: this.timestamp, prettyPrint: this.prettyPrint, raw: this.raw, label: this.label, depth: this.depth, formatter: this.formatter, humanReadableUnhandledException: this.humanReadableUnhandledException }), "error" === e || "debug" === e ? this.errorOutput.push(s) : this.writeOutput.push(s), this.emit("logged"), n(null, !0); }, a.prototype.clearLogs = function () { this.errorOutput = [], this.writeOutput = []; }; }, { "../common": 194, "./transport": 207, events: 89, util: 190 }], 207: [function (e, t, r) { var n = e("events"), i = e("util"), s = r.Transport = function (e) { n.EventEmitter.call(this), e = e || {}, this.silent = e.silent || !1, this.raw = e.raw || !1, this.name = e.name || this.name, this.formatter = e.formatter, this.level = e.level, this.handleExceptions = e.handleExceptions || !1, this.exceptionsLevel = e.exceptionsLevel || "error", this.humanReadableUnhandledException = e.humanReadableUnhandledException || !1; }; i.inherits(s, n.EventEmitter), s.prototype.formatQuery = function (e) { return e; }, s.prototype.normalizeQuery = function (e) { return (e = e || {}).rows = e.rows || e.limit || 10, e.start = e.start || 0, e.until = e.until || new Date, "object" != typeof e.until && (e.until = new Date(e.until)), e.from = e.from || e.until - 864e5, "object" != typeof e.from && (e.from = new Date(e.from)), e.order = e.order || "desc", e.fields = e.fields, e; }, s.prototype.formatResults = function (e, t) { return e; }, s.prototype.logException = function (e, t, r) { var n, i = this; if (this.silent)
            return r(); function s() { n || (n = !0, i.removeListener("logged", s), i.removeListener("error", s), r()); } this.once("logged", s), this.once("error", s), this.log(i.exceptionsLevel, e, t, function () { }); }; }, { events: 89, util: 190 }], 208: [function (e, t, r) { (function (e, r) { !function () { var n, i, s = {}, a = function () { }; function o(e) { var t = !1; return function () { if (t)
            throw new Error("Callback was already called."); t = !0, e.apply(n, arguments); }; } null != (n = "object" == typeof window && this === window ? window : "object" == typeof r && this === r ? r : this) && (i = n.async), s.noConflict = function () { return n.async = i, s; }; var f, c = Object.prototype.toString, h = Array.isArray || function (e) { return "[object Array]" === c.call(e); }, u = function (e, t) { for (var r = -1, n = e.length; ++r < n;)
            t(e[r], r, e); }, d = function (e, t) { for (var r = -1, n = e.length, i = Array(n); ++r < n;)
            i[r] = t(e[r], r, e); return i; }, l = Object.keys || function (e) { var t = []; for (var r in e)
            e.hasOwnProperty(r) && t.push(r); return t; }, p = function (e, t) { t = t || 0; var r = -1, n = e.length; t && (n = (n -= t) < 0 ? 0 : n); for (var i = Array(n); ++r < n;)
            i[r] = e[r + t]; return i; }; "function" == typeof setImmediate && (f = setImmediate), void 0 !== e && e.nextTick ? (s.nextTick = e.nextTick, s.setImmediate = f ? function (e) { f(e); } : s.nextTick) : f ? (s.nextTick = function (e) { f(e); }, s.setImmediate = s.nextTick) : (s.nextTick = function (e) { setTimeout(e, 0); }, s.setImmediate = s.nextTick), s.each = function (e, t, r) { if (r = r || a, !e.length)
            return r(); var n = 0; function i(t) { t ? (r(t), r = a) : (n += 1) >= e.length && r(); } u(e, function (e) { t(e, o(i)); }); }, s.forEach = s.each, s.eachSeries = function (e, t, r) { if (r = r || a, !e.length)
            return r(); var n = 0, i = function () { t(e[n], function (t) { t ? (r(t), r = a) : (n += 1) >= e.length ? r() : i(); }); }; i(); }, s.forEachSeries = s.eachSeries, s.eachLimit = function (e, t, r, n) { b(t).apply(null, [e, r, n]); }, s.forEachLimit = s.eachLimit; var b = function (e) { return function (t, r, n) { if (n = n || a, !t.length || e <= 0)
            return n(); var i = 0, s = 0, o = 0; !function f() { if (i >= t.length)
            return n(); for (; o < e && s < t.length;)
            o += 1, r(t[(s += 1) - 1], function (e) { e ? (n(e), n = a) : (o -= 1, (i += 1) >= t.length ? n() : f()); }); }(); }; }; s.forEachOf = s.eachOf = function (e, t, r) { r = r || function () { }; var n = e.length || l(e).length, i = 0; if (!n)
            return r(); !function (e, t) { u(l(e), function (r) { t(e[r], r); }); }(e, function (s, a) { t(e[a], a, function (e) { e ? (r(e), r = function () { }) : (i += 1) === n && r(null); }); }); }, s.forEachOfSeries = s.eachOfSeries = function (e, t, r) { r = r || function () { }; var n = l(e), i = n.length; if (!i)
            return r(); var a = 0, o = function () { var f = !0, c = n[a]; t(e[c], c, function (e) { e ? (r(e), r = function () { }) : (a += 1) >= i ? r(null) : f ? s.nextTick(o) : o(); }), f = !1; }; o(); }, s.forEachOfLimit = s.eachOfLimit = function (e, t, r, n) { m(t)(e, r, n); }; var m = function (e) { return function (t, r, n) { n = n || function () { }; var i = l(t), s = i.length; if (!s || e <= 0)
            return n(); var a = 0, o = 0, f = 0; !function c() { if (a >= s)
            return n(); for (; f < e && o < s;) {
            f += 1;
            var h = i[(o += 1) - 1];
            r(t[h], h, function (e) { e ? (n(e), n = function () { }) : (f -= 1, (a += 1) >= s ? n() : c()); });
        } }(); }; }, g = function (e) { return function () { var t = p(arguments); return e.apply(null, [s.each].concat(t)); }; }, y = function (e) { return function () { var t = p(arguments); return e.apply(null, [s.eachSeries].concat(t)); }; }, v = function (e, t, r, n) { if (t = d(t, function (e, t) { return { index: t, value: e }; }), n) {
            var i = [];
            e(t, function (e, t) { r(e.value, function (r, n) { i[e.index] = n, t(r); }); }, function (e) { n(e, i); });
        }
        else
            e(t, function (e, t) { r(e.value, function (e) { t(e); }); }); }; s.map = g(v), s.mapSeries = y(v), s.mapLimit = function (e, t, r, n) { return _(t)(e, r, n); }; var _ = function (e) { return function (e, t) { return function () { var r = p(arguments); return t.apply(null, [b(e)].concat(r)); }; }(e, v); }; s.reduce = function (e, t, r, n) { s.eachSeries(e, function (e, n) { r(t, e, function (e, r) { t = r, n(e); }); }, function (e) { n(e, t); }); }, s.inject = s.reduce, s.foldl = s.reduce, s.reduceRight = function (e, t, r, n) { var i = d(e, function (e) { return e; }).reverse(); s.reduce(i, t, r, n); }, s.foldr = s.reduceRight; var w = function (e, t, r, n) { var i = []; e(t = d(t, function (e, t) { return { index: t, value: e }; }), function (e, t) { r(e.value, function (r) { r && i.push(e), t(); }); }, function (e) { n(d(i.sort(function (e, t) { return e.index - t.index; }), function (e) { return e.value; })); }); }; s.filter = g(w), s.filterSeries = y(w), s.select = s.filter, s.selectSeries = s.filterSeries; var E = function (e, t, r, n) { var i = []; e(t = d(t, function (e, t) { return { index: t, value: e }; }), function (e, t) { r(e.value, function (r) { r || i.push(e), t(); }); }, function (e) { n(d(i.sort(function (e, t) { return e.index - t.index; }), function (e) { return e.value; })); }); }; s.reject = g(E), s.rejectSeries = y(E); var k = function (e, t, r, n) { e(t, function (e, t) { r(e, function (r) { r ? (n(e), n = a) : t(); }); }, function (e) { n(); }); }; s.detect = g(k), s.detectSeries = y(k), s.some = function (e, t, r) { s.each(e, function (e, n) { t(e, function (e) { e && (r(!0), r = a), n(); }); }, function (e) { r(!1); }); }, s.any = s.some, s.every = function (e, t, r) { s.each(e, function (e, n) { t(e, function (e) { e || (r(!1), r = a), n(); }); }, function (e) { r(!0); }); }, s.all = s.every, s.sortBy = function (e, t, r) { s.map(e, function (e, r) { t(e, function (t, n) { t ? r(t) : r(null, { value: e, criteria: n }); }); }, function (e, t) { if (e)
            return r(e); r(null, d(t.sort(function (e, t) { var r = e.criteria, n = t.criteria; return r < n ? -1 : r > n ? 1 : 0; }), function (e) { return e.value; })); }); }, s.auto = function (e, t) { t = t || a; var r = l(e), n = r.length; if (!n)
            return t(); var i = {}, o = [], f = function (e) { o.unshift(e); }, c = function () { n--, u(o.slice(0), function (e) { e(); }); }; f(function () { if (!n) {
            var e = t;
            t = a, e(null, i);
        } }), u(r, function (r) { for (var n, d = h(e[r]) ? e[r] : [e[r]], b = function (e) { var n = p(arguments, 1); if (n.length <= 1 && (n = n[0]), e) {
            var o = {};
            u(l(i), function (e) { o[e] = i[e]; }), o[r] = n, t(e, o), t = a;
        }
        else
            i[r] = n, s.setImmediate(c); }, m = d.slice(0, Math.abs(d.length - 1)) || [], g = m.length; g--;) {
            if (!(n = e[m[g]]))
                throw new Error("Has inexistant dependency");
            if (h(n) && ~n.indexOf(r))
                throw new Error("Has cyclic dependencies");
        } var y = function () { return e = function (e, t) { return e && i.hasOwnProperty(t); }, t = !0, u(m, function (r, n, i) { t = e(t, r, n, i); }), t && !i.hasOwnProperty(r); var e, t; }; if (y())
            d[d.length - 1](b, i);
        else {
            var v = function () { y() && (!function (e) { for (var t = 0; t < o.length; t += 1)
                if (o[t] === e)
                    return void o.splice(t, 1); }(v), d[d.length - 1](b, i)); };
            f(v);
        } }); }, s.retry = function (e, t, r) { var n = []; "function" == typeof e && (r = t, t = e, e = 5), e = parseInt(e, 10) || 5; var i = function (i, a) { for (var o = function (e, t) { return function (r) { e(function (e, n) { r(!e || t, { err: e, result: n }); }, a); }; }; e;)
            n.push(o(t, !(e -= 1))); s.series(n, function (e, t) { t = t[t.length - 1], (i || r)(t.err, t.result); }); }; return r ? i() : i; }, s.waterfall = function (e, t) { if (t = t || a, !h(e)) {
            var r = new Error("First argument to waterfall must be an array of functions");
            return t(r);
        } if (!e.length)
            return t(); var n = function (e) { return function (r) { if (r)
            t.apply(null, arguments), t = a;
        else {
            var i = p(arguments, 1), o = e.next();
            o ? i.push(n(o)) : i.push(t), s.setImmediate(function () { e.apply(null, i); });
        } }; }; n(s.iterator(e))(); }; var S = function (e, t, r) { if (r = r || a, h(t))
            e.map(t, function (e, t) { e && e(function (e) { var r = p(arguments, 1); r.length <= 1 && (r = r[0]), t.call(null, e, r); }); }, r);
        else {
            var n = {};
            e.each(l(t), function (e, r) { t[e](function (t) { var i = p(arguments, 1); i.length <= 1 && (i = i[0]), n[e] = i, r(t); }); }, function (e) { r(e, n); });
        } }; s.parallel = function (e, t) { S({ map: s.map, each: s.each }, e, t); }, s.parallelLimit = function (e, t, r) { S({ map: _(t), each: b(t) }, e, r); }, s.series = function (e, t) { if (t = t || a, h(e))
            s.mapSeries(e, function (e, t) { e && e(function (e) { var r = p(arguments, 1); r.length <= 1 && (r = r[0]), t.call(null, e, r); }); }, t);
        else {
            var r = {};
            s.eachSeries(l(e), function (t, n) { e[t](function (e) { var i = p(arguments, 1); i.length <= 1 && (i = i[0]), r[t] = i, n(e); }); }, function (e) { t(e, r); });
        } }, s.iterator = function (e) { var t = function (r) { var n = function () { return e.length && e[r].apply(null, arguments), n.next(); }; return n.next = function () { return r < e.length - 1 ? t(r + 1) : null; }, n; }; return t(0); }, s.apply = function (e) { var t = p(arguments, 1); return function () { return e.apply(null, t.concat(p(arguments))); }; }; var x = function (e, t, r, n) { var i = []; e(t, function (e, t) { r(e, function (e, r) { i = i.concat(r || []), t(e); }); }, function (e) { n(e, i); }); }; s.concat = g(x), s.concatSeries = y(x), s.whilst = function (e, t, r) { e() ? t(function (n) { if (n)
            return r(n); s.whilst(e, t, r); }) : r(); }, s.doWhilst = function (e, t, r) { e(function (n) { if (n)
            return r(n); var i = p(arguments, 1); t.apply(null, i) ? s.doWhilst(e, t, r) : r(); }); }, s.until = function (e, t, r) { e() ? r() : t(function (n) { if (n)
            return r(n); s.until(e, t, r); }); }, s.doUntil = function (e, t, r) { e(function (n) { if (n)
            return r(n); var i = p(arguments, 1); t.apply(null, i) ? r() : s.doUntil(e, t, r); }); }, s.queue = function (e, t) { if (void 0 === t)
            t = 1;
        else if (0 === t)
            throw new Error("Concurrency must not be zero"); function r(e, t, r, n) { if (e.started || (e.started = !0), h(t) || (t = [t]), 0 === t.length)
            return s.setImmediate(function () { e.drain && e.drain(); }); u(t, function (t) { var i = { data: t, callback: "function" == typeof n ? n : null }; r ? e.tasks.unshift(i) : e.tasks.push(i), e.saturated && e.tasks.length === e.concurrency && e.saturated(), s.setImmediate(e.process); }); } var n = 0, i = { tasks: [], concurrency: t, saturated: null, empty: null, drain: null, started: !1, paused: !1, push: function (e, t) { r(i, e, !1, t); }, kill: function () { i.drain = null, i.tasks = []; }, unshift: function (e, t) { r(i, e, !0, t); }, process: function () { if (!i.paused && n < i.concurrency && i.tasks.length) {
                var t = i.tasks.shift();
                i.empty && 0 === i.tasks.length && i.empty(), n += 1;
                var r = o(function () { n -= 1, t.callback && t.callback.apply(t, arguments), i.drain && i.tasks.length + n === 0 && i.drain(), i.process(); });
                e(t.data, r);
            } }, length: function () { return i.tasks.length; }, running: function () { return n; }, idle: function () { return i.tasks.length + n === 0; }, pause: function () { !0 !== i.paused && (i.paused = !0); }, resume: function () { if (!1 !== i.paused) {
                i.paused = !1;
                for (var e = Math.min(i.concurrency, i.tasks.length), t = 1; t <= e; t++)
                    s.setImmediate(i.process);
            } } }; return i; }, s.priorityQueue = function (e, t) { function r(e, t) { return e.priority - t.priority; } var n = s.queue(e, t); return n.push = function (e, t, i) { !function (e, t, n, i) { if (e.started || (e.started = !0), h(t) || (t = [t]), 0 === t.length)
            return s.setImmediate(function () { e.drain && e.drain(); }); u(t, function (t) { var a = { data: t, priority: n, callback: "function" == typeof i ? i : null }; e.tasks.splice(function (e, t, r) { for (var n = -1, i = e.length - 1; n < i;) {
            var s = n + (i - n + 1 >>> 1);
            r(t, e[s]) >= 0 ? n = s : i = s - 1;
        } return n; }(e.tasks, a, r) + 1, 0, a), e.saturated && e.tasks.length === e.concurrency && e.saturated(), s.setImmediate(e.process); }); }(n, e, t, i); }, delete n.unshift, n; }, s.cargo = function (e, t) { var r = !1, n = [], i = { tasks: n, payload: t, saturated: null, empty: null, drain: null, drained: !0, push: function (e, r) { h(e) || (e = [e]), u(e, function (e) { n.push({ data: e, callback: "function" == typeof r ? r : null }), i.drained = !1, i.saturated && n.length === t && i.saturated(); }), s.setImmediate(i.process); }, process: function s() { if (!r) {
                if (0 === n.length)
                    return i.drain && !i.drained && i.drain(), void (i.drained = !0);
                var a = "number" == typeof t ? n.splice(0, t) : n.splice(0, n.length), o = d(a, function (e) { return e.data; });
                i.empty && i.empty(), r = !0, e(o, function () { r = !1; var e = arguments; u(a, function (t) { t.callback && t.callback.apply(null, e); }), s(); });
            } }, length: function () { return n.length; }, running: function () { return r; } }; return i; }; var A = function (e) { return function (t) { var r = p(arguments, 1); t.apply(null, r.concat([function (t) { var r = p(arguments, 1); "undefined" != typeof console && (t ? console.error && console.error(t) : console[e] && u(r, function (t) { console[e](t); })); }])); }; }; s.log = A("log"), s.dir = A("dir"), s.memoize = function (e, t) { var r = {}, n = {}; t = t || function (e) { return e; }; var i = function () { var i = p(arguments), a = i.pop(), o = t.apply(null, i); o in r ? s.nextTick(function () { a.apply(null, r[o]); }) : o in n ? n[o].push(a) : (n[o] = [a], e.apply(null, i.concat([function () { r[o] = p(arguments); var e = n[o]; delete n[o]; for (var t = 0, i = e.length; t < i; t++)
                e[t].apply(null, arguments); }]))); }; return i.memo = r, i.unmemoized = e, i; }, s.unmemoize = function (e) { return function () { return (e.unmemoized || e).apply(null, arguments); }; }, s.times = function (e, t, r) { for (var n = [], i = 0; i < e; i++)
            n.push(i); return s.map(n, t, r); }, s.timesSeries = function (e, t, r) { for (var n = [], i = 0; i < e; i++)
            n.push(i); return s.mapSeries(n, t, r); }, s.seq = function () { var e = arguments; return function () { var t = this, r = p(arguments), n = r.pop(); s.reduce(e, r, function (e, r, n) { r.apply(t, e.concat([function () { var e = arguments[0], t = p(arguments, 1); n(e, t); }])); }, function (e, r) { n.apply(t, [e].concat(r)); }); }; }, s.compose = function () { return s.seq.apply(null, Array.prototype.reverse.call(arguments)); }; var M = function (e, t) { var r = function () { var r = this, n = p(arguments), i = n.pop(); return e(t, function (e, t) { e.apply(r, n.concat([t])); }, i); }; if (arguments.length > 2) {
            var n = p(arguments, 2);
            return r.apply(this, n);
        } return r; }; s.applyEach = g(M), s.applyEachSeries = y(M), s.forever = function (e, t) { !function r(n) { if (n) {
            if (t)
                return t(n);
            throw n;
        } e(r); }(); }, void 0 !== t && t.exports ? t.exports = s : "undefined" != typeof define && define.amd ? define([], function () { return s; }) : n.async = s; }(); }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}); }, { _process: 141 }], 209: [function (e, t, r) { var n = {}; t.exports = n, n.themes = {}; var i = n.styles = e("./styles"), s = Object.defineProperties; n.supportsColor = e("./system/supports-colors"), void 0 === n.enabled && (n.enabled = n.supportsColor), n.stripColors = n.strip = function (e) { return ("" + e).replace(/\x1B\[\d+m/g, ""); }; n.stylize = function (e, t) { return i[t].open + e + i[t].close; }; var a = /[|\\{}()[\]^$+*?.]/g; function o(e) { var t = function e() { return function () { var e = arguments, t = e.length, r = 0 !== t && String(arguments[0]); if (t > 1)
            for (var s = 1; s < t; s++)
                r += " " + e[s]; if (!n.enabled || !r)
            return r; var a = this._styles, o = a.length; for (; o--;) {
            var f = i[a[o]];
            r = f.open + r.replace(f.closeRe, f.open) + f.close;
        } return r; }.apply(e, arguments); }; return t._styles = e, t.__proto__ = h, t; } var f, c = (f = {}, i.grey = i.gray, Object.keys(i).forEach(function (e) { i[e].closeRe = new RegExp(function (e) { if ("string" != typeof e)
            throw new TypeError("Expected a string"); return e.replace(a, "\\$&"); }(i[e].close), "g"), f[e] = { get: function () { return o(this._styles.concat(e)); } }; }), f), h = s(function () { }, c); function u(e) { for (var t in e)
            !function (t) { n[t] = function (r) { return n[e[t]](r); }; }(t); } n.setTheme = function (t) { if ("string" == typeof t)
            try {
                return n.themes[t] = e(t), u(n.themes[t]), n.themes[t];
            }
            catch (e) {
                return console.log(e), e;
            }
        else
            u(t); }; var d = function (e, t) { var r = t.split(""); return (r = r.map(e)).join(""); }; for (var l in n.trap = e("./custom/trap"), n.zalgo = e("./custom/zalgo"), n.maps = {}, n.maps.america = e("./maps/america"), n.maps.zebra = e("./maps/zebra"), n.maps.rainbow = e("./maps/rainbow"), n.maps.random = e("./maps/random"), n.maps)
            !function (e) { n[e] = function (t) { return d(n.maps[e], t); }; }(l); s(n, function () { var e = {}; return Object.keys(c).forEach(function (t) { e[t] = { get: function () { return o([t]); } }; }), e; }()); }, { "./custom/trap": 210, "./custom/zalgo": 211, "./maps/america": 212, "./maps/rainbow": 213, "./maps/random": 214, "./maps/zebra": 215, "./styles": 216, "./system/supports-colors": 217 }], 210: [function (e, t, r) { t.exports = function (e, t) { var r = "", n = { a: ["@", "Ą", "Ⱥ", "Ʌ", "Δ", "Λ", "Д"], b: ["ß", "Ɓ", "Ƀ", "ɮ", "β", "฿"], c: ["©", "Ȼ", "Ͼ"], d: ["Ð", "Ɗ", "Ԁ", "ԁ", "Ԃ", "ԃ"], e: ["Ë", "ĕ", "Ǝ", "ɘ", "Σ", "ξ", "Ҽ", "੬"], f: ["Ӻ"], g: ["ɢ"], h: ["Ħ", "ƕ", "Ң", "Һ", "Ӈ", "Ԋ"], i: ["༏"], j: ["Ĵ"], k: ["ĸ", "Ҡ", "Ӄ", "Ԟ"], l: ["Ĺ"], m: ["ʍ", "Ӎ", "ӎ", "Ԡ", "ԡ", "൩"], n: ["Ñ", "ŋ", "Ɲ", "Ͷ", "Π", "Ҋ"], o: ["Ø", "õ", "ø", "Ǿ", "ʘ", "Ѻ", "ם", "۝", "๏"], p: ["Ƿ", "Ҏ"], q: ["্"], r: ["®", "Ʀ", "Ȑ", "Ɍ", "ʀ", "Я"], s: ["§", "Ϟ", "ϟ", "Ϩ"], t: ["Ł", "Ŧ", "ͳ"], u: ["Ʊ", "Ս"], v: ["ט"], w: ["Ш", "Ѡ", "Ѽ", "൰"], x: ["Ҳ", "Ӿ", "Ӽ", "ӽ"], y: ["¥", "Ұ", "Ӌ"], z: ["Ƶ", "ɀ"] }; return (e = (e = e || "Run the trap, drop the bass").split("")).forEach(function (e) { e = e.toLowerCase(); var t = n[e] || [" "], i = Math.floor(Math.random() * t.length); r += void 0 !== n[e] ? n[e][i] : e; }), r; }; }, {}], 211: [function (e, t, r) { t.exports = function (e, t) { e = e || "   he is here   "; var r = { up: ["̍", "̎", "̄", "̅", "̿", "̑", "̆", "̐", "͒", "͗", "͑", "̇", "̈", "̊", "͂", "̓", "̈", "͊", "͋", "͌", "̃", "̂", "̌", "͐", "̀", "́", "̋", "̏", "̒", "̓", "̔", "̽", "̉", "ͣ", "ͤ", "ͥ", "ͦ", "ͧ", "ͨ", "ͩ", "ͪ", "ͫ", "ͬ", "ͭ", "ͮ", "ͯ", "̾", "͛", "͆", "̚"], down: ["̖", "̗", "̘", "̙", "̜", "̝", "̞", "̟", "̠", "̤", "̥", "̦", "̩", "̪", "̫", "̬", "̭", "̮", "̯", "̰", "̱", "̲", "̳", "̹", "̺", "̻", "̼", "ͅ", "͇", "͈", "͉", "͍", "͎", "͓", "͔", "͕", "͖", "͙", "͚", "̣"], mid: ["̕", "̛", "̀", "́", "͘", "̡", "̢", "̧", "̨", "̴", "̵", "̶", "͜", "͝", "͞", "͟", "͠", "͢", "̸", "̷", "͡", " ҉"] }, n = [].concat(r.up, r.down, r.mid); function i(e) { return Math.floor(Math.random() * e); } function s(e) { var t = !1; return n.filter(function (r) { t = r === e; }), t; } return function (e, t) { var n, a, o = ""; for (a in (t = t || {}).up = t.up || !0, t.mid = t.mid || !0, t.down = t.down || !0, t.size = t.size || "maxi", e = e.split(""))
            if (!s(a)) {
                switch (o += e[a], n = { up: 0, down: 0, mid: 0 }, t.size) {
                    case "mini":
                        n.up = i(8), n.min = i(2), n.down = i(8);
                        break;
                    case "maxi":
                        n.up = i(16) + 3, n.min = i(4) + 1, n.down = i(64) + 3;
                        break;
                    default: n.up = i(8) + 1, n.mid = i(6) / 2, n.down = i(8) + 1;
                }
                var f = ["up", "mid", "down"];
                for (var c in f)
                    for (var h = f[c], u = 0; u <= n[h]; u++)
                        t[h] && (o += r[h][i(r[h].length)]);
            } return o; }(e); }; }, {}], 212: [function (e, t, r) { var n = e("../colors"); t.exports = function (e, t, r) { if (" " === e)
            return e; switch (t % 3) {
            case 0: return n.red(e);
            case 1: return n.white(e);
            case 2: return n.blue(e);
        } }; }, { "../colors": 209 }], 213: [function (e, t, r) { var n, i = e("../colors"); t.exports = (n = ["red", "yellow", "green", "blue", "magenta"], function (e, t, r) { return " " === e ? e : i[n[t++ % n.length]](e); }); }, { "../colors": 209 }], 214: [function (e, t, r) { var n, i = e("../colors"); t.exports = (n = ["underline", "inverse", "grey", "yellow", "red", "green", "blue", "white", "cyan", "magenta"], function (e, t, r) { return " " === e ? e : i[n[Math.round(Math.random() * (n.length - 1))]](e); }); }, { "../colors": 209 }], 215: [function (e, t, r) { var n = e("../colors"); t.exports = function (e, t, r) { return t % 2 == 0 ? e : n.inverse(e); }; }, { "../colors": 209 }], 216: [function (e, t, r) { var n = {}; t.exports = n; var i = { reset: [0, 0], bold: [1, 22], dim: [2, 22], italic: [3, 23], underline: [4, 24], inverse: [7, 27], hidden: [8, 28], strikethrough: [9, 29], black: [30, 39], red: [31, 39], green: [32, 39], yellow: [33, 39], blue: [34, 39], magenta: [35, 39], cyan: [36, 39], white: [37, 39], gray: [90, 39], grey: [90, 39], bgBlack: [40, 49], bgRed: [41, 49], bgGreen: [42, 49], bgYellow: [43, 49], bgBlue: [44, 49], bgMagenta: [45, 49], bgCyan: [46, 49], bgWhite: [47, 49], blackBG: [40, 49], redBG: [41, 49], greenBG: [42, 49], yellowBG: [43, 49], blueBG: [44, 49], magentaBG: [45, 49], cyanBG: [46, 49], whiteBG: [47, 49] }; Object.keys(i).forEach(function (e) { var t = i[e], r = n[e] = []; r.open = "[" + t[0] + "m", r.close = "[" + t[1] + "m"; }); }, {}], 217: [function (e, t, r) { (function (e) { var r = e.argv; t.exports = !(-1 !== r.indexOf("--no-color") || -1 !== r.indexOf("--color=false") || -1 === r.indexOf("--color") && -1 === r.indexOf("--color=true") && -1 === r.indexOf("--color=always") && (e.stdout && !e.stdout.isTTY || "win32" !== e.platform && !("COLORTERM" in e.env || "dumb" !== e.env.TERM && /^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(e.env.TERM)))); }).call(this, e("_process")); }, { _process: 141 }], 218: [function (e, t, r) { var n = e("./lib/colors"); t.exports = n; }, { "./lib/colors": 209 }], 219: [function (e, t, r) { t.exports = { _from: "winston", _id: "winston@2.4.1", _inBundle: !1, _integrity: "sha512-k/+Dkzd39ZdyJHYkuaYmf4ff+7j+sCIy73UCOWHYA67/WXU+FF/Y6PF28j+Vy7qNRPHWO+dR+/+zkoQWPimPqg==", _location: "/winston", _phantomChildren: {}, _requested: { type: "tag", registry: !0, raw: "winston", name: "winston", escapedName: "winston", rawSpec: "", saveSpec: null, fetchSpec: "latest" }, _requiredBy: ["#DEV:/", "#USER"], _resolved: "https://registry.npmjs.org/winston/-/winston-2.4.1.tgz", _shasum: "a3a9265105564263c6785b4583b8c8aca26fded6", _spec: "winston", _where: "/Users/Kasimir/Dropbox/RageMp/rage-console", author: { name: "Charlie Robbins", email: "charlie.robbins@gmail.com" }, bugs: { url: "https://github.com/winstonjs/winston/issues" }, bundleDependencies: !1, dependencies: { async: "~1.0.0", colors: "1.0.x", cycle: "1.0.x", eyes: "0.1.x", isstream: "0.1.x", "stack-trace": "0.0.x" }, deprecated: !1, description: "A multi-transport async logging library for Node.js", devDependencies: { "cross-spawn-async": "^2.0.0", hock: "1.x.x", "std-mocks": "~1.0.0", vows: "0.7.x" }, engines: { node: ">= 0.10.0" }, homepage: "https://github.com/winstonjs/winston#readme", keywords: ["winston", "logging", "sysadmin", "tools"], license: "MIT", main: "./lib/winston", maintainers: [{ name: "Jarrett Cruger", email: "jcrugzz@gmail.com" }, { name: "Alberto Pose", email: "albertopose@gmail.com" }], name: "winston", repository: { type: "git", url: "git+https://github.com/winstonjs/winston.git" }, scripts: { test: "vows --spec --isolate" }, version: "2.4.1" }; }, {}], 220: [function (e, t, r) { t.exports = function () { for (var e = {}, t = 0; t < arguments.length; t++) {
            var r = arguments[t];
            for (var i in r)
                n.call(r, i) && (e[i] = r[i]);
        } return e; }; var n = Object.prototype.hasOwnProperty; }, {}], 221: [function (e, t, r) { t.exports = class {
            constructor() { this.commands = []; }
            get(e) { return e ? this.commands[e] : this.commands; }
            help(e, t) { if (t) {
                var r = `Usage: ${e}\t[options]\n`;
                return this.commands[e].options && this.commands[e].options.length > 0 && (r += "\nOptions:\n\n"), r;
            } return `${e}\t\t\t\t${this.commands[e].options.description}\n`; }
            run(e, ...t) { return this.commands[e].function(t); }
            add(e, t, r) { e = e.toLowerCase(), r = "function" == typeof (t = "function" == typeof t ? {} : t) ? t : r, this.commands[e] = { function: r, options: t }; }
            destroy(e) { this.commands.name = !1; }
        }; }, {}], 222: [function (e, t, r) { (function (t) { e("./util/Util"); const r = new (e("./terminal/TerminalManager")); t.console.log = function () { r.winston.info.apply(r, r._formatArgs(arguments)); }, t.console.info = function () { r.winston.info.apply(r, r._formatArgs(arguments)); }, t.console.warn = function () { r.winston.warn.apply(r, r._formatArgs(arguments)); }, t.console.error = function () { r.winston.error.apply(r, r._formatArgs(arguments)); }; }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}); }, { "./terminal/TerminalManager": 224, "./util/Util": 225 }], 223: [function (e, t, r) { const n = e("winston-transport"); t.exports = class extends n {
            constructor(e) { super(e), this.console = e.console; }
            log(e, t, r, n) { this.console._log({ level: e, env: "client", message: t, timestamp: (new Date).toISOString() }), n(null, e, t, r); }
        }; }, { "winston-transport": 192 }], 224: [function (e, t, r) { const n = e("util"), i = e("winston"), s = e("../commands/Commands"), a = e("./StaticTransport"); t.exports = class {
            constructor() { this.CONFIG = {}, this.logs = [], this.commands = new s, this.console = mp.browsers.new("package://_rage-console/view/index.html"), this.console.execute(`App.setName("${mp.players.local.name}");`), this.active = !0, this.winston = new i.Logger({ transports: [new a({ console: this })] }), mp.events.callRemote("console:player:ready", mp.players.local), mp.events.add("console:config", this._config.bind(this)), mp.events.add("console:cursor", this._cursor.bind(this)), mp.events.add("console:server:add", this._syncLog.bind(this)), mp.events.add("console:server:stream", this._syncStream.bind(this)), mp.events.add("console:command", this._consoleCommand.bind(this)), mp.events.add("console:chrome", this._chrome.bind(this)); }
            get active() { return this.active; }
            set active(e) { this.console.active = e; }
            _config(e) { this.CONFIG = e; }
            _chrome(e) { this.console.execute(`App.console(${e});`); }
            _cursor(e) { mp.gui.cursor.visible = e; }
            _log(e) { this.console.execute(`App.console(${JSON.stringify(e)});`); }
            _consoleHelp() { const e = this.commands.get(), t = Object.keys(e); var r = `RAGE console\nVersion ${this.CONFIG.version}\n\nType 'help name' to find out more about the function 'name'\n\n`; if (r += "Commands:\n", r += "clear\t\t\tClears the logs\n", t.length > 0)
                for (var n in e)
                    r += this.commands.help(n); this._log({ message: r, level: "log" }); }
            _commandHelp(e) { const t = this.commands.help(e, !0); this._log({ message: t, level: "log" }); }
            _consoleCommand(e) { const t = e.trim().split(/ +/g), r = t.shift().toLowerCase().replace(/\s/g, ""); if ("" !== r)
                if ("clear" !== r) {
                    if ("help" !== r) {
                        if (!this.commands.get(r))
                            return this._log({ message: `${r}: command not found`, level: "error" });
                        var n = this.commands.run(r, t);
                        return n ? this._log({ message: `${n}`, level: "log" }) : void 0;
                    }
                    t.length > 0 ? this._commandHelp(t[0]) : this._consoleHelp();
                }
                else
                    this.console.execute("App.clear();"); }
            _formatArgs(e) { return [n.format.apply(n.format, Array.prototype.slice.call(e))]; }
            _syncStream(e) { for (var t in e)
                this._log(e[t]); this.streamSynced = !0; }
            _syncLog(e) { this.streamSynced && this._log(e); }
        }; }, { "../commands/Commands": 221, "./StaticTransport": 223, util: 190, winston: 193 }], 225: [function (e, t, r) { const n = e("util"); t.exports = class {
            constructor() { throw new Error(`The ${this.constructor.name} class may not be instantiated.`); }
            _formatArgs(e) { return [n.format.apply(n.format, Array.prototype.slice.call(e))]; }
        }; }, { util: 190 }] }, {}, [222]);