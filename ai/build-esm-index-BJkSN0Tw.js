!function() {
    try {
        var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : {}
          , n = (new e.Error).stack;
        n && (e._sentryDebugIds = e._sentryDebugIds || {},
        e._sentryDebugIds[n] = "1296a824-f154-5e6c-b083-8940e7f9cbbe")
    } catch (e) {}
}();
import {r as Ie, C as vp} from "./vendor-H7vi_DPa.js";
function wp(e, t) {
    for (var n = 0; n < t.length; n++) {
        const r = t[n];
        if (typeof r != "string" && !Array.isArray(r)) {
            for (const s in r)
                if (s !== "default" && !(s in e)) {
                    const o = Object.getOwnPropertyDescriptor(r, s);
                    o && Object.defineProperty(e, s, o.get ? o : {
                        enumerable: !0,
                        get: () => r[s]
                    })
                }
        }
    }
    return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, {
        value: "Module"
    }))
}
const x = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__
  , P = globalThis
  , Mt = "9.34.0";
function vt() {
    return mr(P),
    P
}
function mr(e) {
    const t = e.__SENTRY__ = e.__SENTRY__ || {};
    return t.version = t.version || Mt,
    t[Mt] = t[Mt] || {}
}
function Gs(e, t, n=P) {
    const r = n.__SENTRY__ = n.__SENTRY__ || {}
      , s = r[Mt] = r[Mt] || {};
    return s[e] || (s[e] = t())
}
const Tp = "Sentry Logger "
  , ir = ["debug", "info", "warn", "error", "log", "assert", "trace"]
  , bs = {};
function nn(e) {
    if (!("console"in P))
        return e();
    const t = P.console
      , n = {}
      , r = Object.keys(bs);
    r.forEach(s => {
        const o = bs[s];
        n[s] = t[s],
        t[s] = o
    }
    );
    try {
        return e()
    } finally {
        r.forEach(s => {
            t[s] = n[s]
        }
        )
    }
}
function Ip() {
    let e = !1;
    const t = {
        enable: () => {
            e = !0
        }
        ,
        disable: () => {
            e = !1
        }
        ,
        isEnabled: () => e
    };
    return x ? ir.forEach(n => {
        t[n] = (...r) => {
            e && nn( () => {
                P.console[n](`${Tp}[${n}]:`, ...r)
            }
            )
        }
    }
    ) : ir.forEach(n => {
        t[n] = () => {}
    }
    ),
    t
}
const y = Gs("logger", Ip)
  , Yu = 50
  , st = "?"
  , Na = /\(error: (.*)\)/
  , Oa = /captureMessage|captureException/;
function Xu(...e) {
    const t = e.sort( (n, r) => n[0] - r[0]).map(n => n[1]);
    return (n, r=0, s=0) => {
        const o = []
          , i = n.split(`
`);
        for (let a = r; a < i.length; a++) {
            const c = i[a];
            if (c.length > 1024)
                continue;
            const u = Na.test(c) ? c.replace(Na, "$1") : c;
            if (!u.match(/\S*Error: /)) {
                for (const d of t) {
                    const l = d(u);
                    if (l) {
                        o.push(l);
                        break
                    }
                }
                if (o.length >= Yu + s)
                    break
            }
        }
        return Cp(o.slice(s))
    }
}
function kp(e) {
    return Array.isArray(e) ? Xu(...e) : e
}
function Cp(e) {
    if (!e.length)
        return [];
    const t = Array.from(e);
    return /sentryWrapped/.test(Fr(t).function || "") && t.pop(),
    t.reverse(),
    Oa.test(Fr(t).function || "") && (t.pop(),
    Oa.test(Fr(t).function || "") && t.pop()),
    t.slice(0, Yu).map(n => ({
        ...n,
        filename: n.filename || Fr(t).filename,
        function: n.function || st
    }))
}
function Fr(e) {
    return e[e.length - 1] || {}
}
const So = "<anonymous>";
function mt(e) {
    try {
        return !e || typeof e != "function" ? So : e.name || So
    } catch {
        return So
    }
}
function Xo(e) {
    const t = e.exception;
    if (t) {
        const n = [];
        try {
            return t.values.forEach(r => {
                r.stacktrace.frames && n.push(...r.stacktrace.frames)
            }
            ),
            n
        } catch {
            return
        }
    }
}
const ns = {}
  , La = {};
function $t(e, t) {
    ns[e] = ns[e] || [],
    ns[e].push(t)
}
function Bt(e, t) {
    if (!La[e]) {
        La[e] = !0;
        try {
            t()
        } catch (n) {
            x && y.error(`Error while instrumenting ${e}`, n)
        }
    }
}
function je(e, t) {
    const n = e && ns[e];
    if (n)
        for (const r of n)
            try {
                r(t)
            } catch (s) {
                x && y.error(`Error while triggering instrumentation handler.
Type: ${e}
Name: ${mt(r)}
Error:`, s)
            }
}
let bo = null;
function Ku(e) {
    const t = "error";
    $t(t, e),
    Bt(t, Rp)
}
function Rp() {
    bo = P.onerror,
    P.onerror = function(e, t, n, r, s) {
        return je("error", {
            column: r,
            error: s,
            line: n,
            msg: e,
            url: t
        }),
        bo ? bo.apply(this, arguments) : !1
    }
    ,
    P.onerror.__SENTRY_INSTRUMENTED__ = !0
}
let Eo = null;
function Ju(e) {
    const t = "unhandledrejection";
    $t(t, e),
    Bt(t, xp)
}
function xp() {
    Eo = P.onunhandledrejection,
    P.onunhandledrejection = function(e) {
        return je("unhandledrejection", e),
        Eo ? Eo.apply(this, arguments) : !0
    }
    ,
    P.onunhandledrejection.__SENTRY_INSTRUMENTED__ = !0
}
const Zu = Object.prototype.toString;
function pt(e) {
    switch (Zu.call(e)) {
    case "[object Error]":
    case "[object Exception]":
    case "[object DOMException]":
    case "[object WebAssembly.Exception]":
        return !0;
    default:
        return gt(e, Error)
    }
}
function qn(e, t) {
    return Zu.call(e) === `[object ${t}]`
}
function Qu(e) {
    return qn(e, "ErrorEvent")
}
function Pa(e) {
    return qn(e, "DOMError")
}
function Mp(e) {
    return qn(e, "DOMException")
}
function Ke(e) {
    return qn(e, "String")
}
function Vs(e) {
    return typeof e == "object" && e !== null && "__sentry_template_string__"in e && "__sentry_template_values__"in e
}
function kn(e) {
    return e === null || Vs(e) || typeof e != "object" && typeof e != "function"
}
function Jt(e) {
    return qn(e, "Object")
}
function Ys(e) {
    return typeof Event < "u" && gt(e, Event)
}
function Ap(e) {
    return typeof Element < "u" && gt(e, Element)
}
function Np(e) {
    return qn(e, "RegExp")
}
function gr(e) {
    return !!(e != null && e.then && typeof e.then == "function")
}
function Op(e) {
    return Jt(e) && "nativeEvent"in e && "preventDefault"in e && "stopPropagation"in e
}
function gt(e, t) {
    try {
        return e instanceof t
    } catch {
        return !1
    }
}
function el(e) {
    return !!(typeof e == "object" && e !== null && (e.__isVue || e._isVue))
}
function tl(e) {
    return typeof Request < "u" && gt(e, Request)
}
const Li = P
  , Lp = 80;
function qe(e, t={}) {
    if (!e)
        return "<unknown>";
    try {
        let n = e;
        const r = 5
          , s = [];
        let o = 0
          , i = 0;
        const a = " > "
          , c = a.length;
        let u;
        const d = Array.isArray(t) ? t : t.keyAttrs
          , l = !Array.isArray(t) && t.maxStringLength || Lp;
        for (; n && o++ < r && (u = Pp(n, d),
        !(u === "html" || o > 1 && i + s.length * c + u.length >= l)); )
            s.push(u),
            i += u.length,
            n = n.parentNode;
        return s.reverse().join(a)
    } catch {
        return "<unknown>"
    }
}
function Pp(e, t) {
    const n = e
      , r = [];
    if (!(n != null && n.tagName))
        return "";
    if (Li.HTMLElement && n instanceof HTMLElement && n.dataset) {
        if (n.dataset.sentryComponent)
            return n.dataset.sentryComponent;
        if (n.dataset.sentryElement)
            return n.dataset.sentryElement
    }
    r.push(n.tagName.toLowerCase());
    const s = t != null && t.length ? t.filter(i => n.getAttribute(i)).map(i => [i, n.getAttribute(i)]) : null;
    if (s != null && s.length)
        s.forEach(i => {
            r.push(`[${i[0]}="${i[1]}"]`)
        }
        );
    else {
        n.id && r.push(`#${n.id}`);
        const i = n.className;
        if (i && Ke(i)) {
            const a = i.split(/\s+/);
            for (const c of a)
                r.push(`.${c}`)
        }
    }
    const o = ["aria-label", "type", "name", "title", "alt"];
    for (const i of o) {
        const a = n.getAttribute(i);
        a && r.push(`[${i}="${a}"]`)
    }
    return r.join("")
}
function rn() {
    try {
        return Li.document.location.href
    } catch {
        return ""
    }
}
function nl(e) {
    if (!Li.HTMLElement)
        return null;
    let t = e;
    const n = 5;
    for (let r = 0; r < n; r++) {
        if (!t)
            return null;
        if (t instanceof HTMLElement) {
            if (t.dataset.sentryComponent)
                return t.dataset.sentryComponent;
            if (t.dataset.sentryElement)
                return t.dataset.sentryElement
        }
        t = t.parentNode
    }
    return null
}
function Cn(e, t=0) {
    return typeof e != "string" || t === 0 || e.length <= t ? e : `${e.slice(0, t)}...`
}
function vo(e, t) {
    let n = e;
    const r = n.length;
    if (r <= 150)
        return n;
    t > r && (t = r);
    let s = Math.max(t - 60, 0);
    s < 5 && (s = 0);
    let o = Math.min(s + 140, r);
    return o > r - 5 && (o = r),
    o === r && (s = Math.max(o - 140, 0)),
    n = n.slice(s, o),
    s > 0 && (n = `'{snip} ${n}`),
    o < r && (n += " {snip}"),
    n
}
function Es(e, t) {
    if (!Array.isArray(e))
        return "";
    const n = [];
    for (let r = 0; r < e.length; r++) {
        const s = e[r];
        try {
            el(s) ? n.push("[VueViewModel]") : n.push(String(s))
        } catch {
            n.push("[value cannot be serialized]")
        }
    }
    return n.join(t)
}
function Dp(e, t, n=!1) {
    return Ke(e) ? Np(t) ? t.test(e) : Ke(t) ? n ? e === t : e.includes(t) : !1 : !1
}
function Je(e, t=[], n=!1) {
    return t.some(r => Dp(e, r, n))
}
function Me(e, t, n) {
    if (!(t in e))
        return;
    const r = e[t];
    if (typeof r != "function")
        return;
    const s = n(r);
    typeof s == "function" && rl(s, r);
    try {
        e[t] = s
    } catch {
        x && y.log(`Failed to replace method "${t}" in object`, e)
    }
}
function Ne(e, t, n) {
    try {
        Object.defineProperty(e, t, {
            value: n,
            writable: !0,
            configurable: !0
        })
    } catch {
        x && y.log(`Failed to add non-enumerable property "${t}" to object`, e)
    }
}
function rl(e, t) {
    try {
        const n = t.prototype || {};
        e.prototype = t.prototype = n,
        Ne(e, "__sentry_original__", t)
    } catch {}
}
function Pi(e) {
    return e.__sentry_original__
}
function sl(e) {
    if (pt(e))
        return {
            message: e.message,
            name: e.name,
            stack: e.stack,
            ...Fa(e)
        };
    if (Ys(e)) {
        const t = {
            type: e.type,
            target: Da(e.target),
            currentTarget: Da(e.currentTarget),
            ...Fa(e)
        };
        return typeof CustomEvent < "u" && gt(e, CustomEvent) && (t.detail = e.detail),
        t
    } else
        return e
}
function Da(e) {
    try {
        return Ap(e) ? qe(e) : Object.prototype.toString.call(e)
    } catch {
        return "<unknown>"
    }
}
function Fa(e) {
    if (typeof e == "object" && e !== null) {
        const t = {};
        for (const n in e)
            Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
        return t
    } else
        return {}
}
function Fp(e, t=40) {
    const n = Object.keys(sl(e));
    n.sort();
    const r = n[0];
    if (!r)
        return "[object has no keys]";
    if (r.length >= t)
        return Cn(r, t);
    for (let s = n.length; s > 0; s--) {
        const o = n.slice(0, s).join(", ");
        if (!(o.length > t))
            return s === n.length ? o : Cn(o, t)
    }
    return ""
}
function $p() {
    const e = P;
    return e.crypto || e.msCrypto
}
function Ae(e=$p()) {
    let t = () => Math.random() * 16;
    try {
        if (e != null && e.randomUUID)
            return e.randomUUID().replace(/-/g, "");
        e != null && e.getRandomValues && (t = () => {
            const n = new Uint8Array(1);
            return e.getRandomValues(n),
            n[0]
        }
        )
    } catch {}
    return ("10000000100040008000" + 1e11).replace(/[018]/g, n => (n ^ (t() & 15) >> n / 4).toString(16))
}
function ol(e) {
    var t, n;
    return (n = (t = e.exception) == null ? void 0 : t.values) == null ? void 0 : n[0]
}
function zt(e) {
    const {message: t, event_id: n} = e;
    if (t)
        return t;
    const r = ol(e);
    return r ? r.type && r.value ? `${r.type}: ${r.value}` : r.type || r.value || n || "<unknown>" : n || "<unknown>"
}
function Ko(e, t, n) {
    const r = e.exception = e.exception || {}
      , s = r.values = r.values || []
      , o = s[0] = s[0] || {};
    o.value || (o.value = t || ""),
    o.type || (o.type = "Error")
}
function Pt(e, t) {
    const n = ol(e);
    if (!n)
        return;
    const r = {
        type: "generic",
        handled: !0
    }
      , s = n.mechanism;
    if (n.mechanism = {
        ...r,
        ...s,
        ...t
    },
    t && "data"in t) {
        const o = {
            ...s == null ? void 0 : s.data,
            ...t.data
        };
        n.mechanism.data = o
    }
}
function Bp(e, t, n=5) {
    if (t.lineno === void 0)
        return;
    const r = e.length
      , s = Math.max(Math.min(r - 1, t.lineno - 1), 0);
    t.pre_context = e.slice(Math.max(0, s - n), s).map(i => vo(i, 0));
    const o = Math.min(r - 1, s);
    t.context_line = vo(e[o], t.colno || 0),
    t.post_context = e.slice(Math.min(s + 1, r), s + 1 + n).map(i => vo(i, 0))
}
function $a(e) {
    if (Up(e))
        return !0;
    try {
        Ne(e, "__sentry_captured__", !0)
    } catch {}
    return !1
}
function Up(e) {
    try {
        return e.__sentry_captured__
    } catch {}
}
const il = 1e3;
function _r() {
    return Date.now() / il
}
function Hp() {
    const {performance: e} = P;
    if (!(e != null && e.now))
        return _r;
    const t = Date.now() - e.now()
      , n = e.timeOrigin == null ? t : e.timeOrigin;
    return () => (n + e.now()) / il
}
const me = Hp();
let wo;
function Wp() {
    var d;
    const {performance: e} = P;
    if (!(e != null && e.now))
        return [void 0, "none"];
    const t = 3600 * 1e3
      , n = e.now()
      , r = Date.now()
      , s = e.timeOrigin ? Math.abs(e.timeOrigin + n - r) : t
      , o = s < t
      , i = (d = e.timing) == null ? void 0 : d.navigationStart
      , c = typeof i == "number" ? Math.abs(i + n - r) : t
      , u = c < t;
    return o || u ? s <= c ? [e.timeOrigin, "timeOrigin"] : [i, "navigationStart"] : [r, "dateNow"]
}
function Oe() {
    return wo || (wo = Wp()),
    wo[0]
}
function zp(e) {
    const t = me()
      , n = {
        sid: Ae(),
        init: !0,
        timestamp: t,
        started: t,
        duration: 0,
        status: "ok",
        errors: 0,
        ignoreDuration: !1,
        toJSON: () => qp(n)
    };
    return e && Rn(n, e),
    n
}
function Rn(e, t={}) {
    if (t.user && (!e.ipAddress && t.user.ip_address && (e.ipAddress = t.user.ip_address),
    !e.did && !t.did && (e.did = t.user.id || t.user.email || t.user.username)),
    e.timestamp = t.timestamp || me(),
    t.abnormal_mechanism && (e.abnormal_mechanism = t.abnormal_mechanism),
    t.ignoreDuration && (e.ignoreDuration = t.ignoreDuration),
    t.sid && (e.sid = t.sid.length === 32 ? t.sid : Ae()),
    t.init !== void 0 && (e.init = t.init),
    !e.did && t.did && (e.did = `${t.did}`),
    typeof t.started == "number" && (e.started = t.started),
    e.ignoreDuration)
        e.duration = void 0;
    else if (typeof t.duration == "number")
        e.duration = t.duration;
    else {
        const n = e.timestamp - e.started;
        e.duration = n >= 0 ? n : 0
    }
    t.release && (e.release = t.release),
    t.environment && (e.environment = t.environment),
    !e.ipAddress && t.ipAddress && (e.ipAddress = t.ipAddress),
    !e.userAgent && t.userAgent && (e.userAgent = t.userAgent),
    typeof t.errors == "number" && (e.errors = t.errors),
    t.status && (e.status = t.status)
}
function jp(e, t) {
    let n = {};
    e.status === "ok" && (n = {
        status: "exited"
    }),
    Rn(e, n)
}
function qp(e) {
    return {
        sid: `${e.sid}`,
        init: e.init,
        started: new Date(e.started * 1e3).toISOString(),
        timestamp: new Date(e.timestamp * 1e3).toISOString(),
        status: e.status,
        errors: e.errors,
        did: typeof e.did == "number" || typeof e.did == "string" ? `${e.did}` : void 0,
        duration: e.duration,
        abnormal_mechanism: e.abnormal_mechanism,
        attrs: {
            release: e.release,
            environment: e.environment,
            ip_address: e.ipAddress,
            user_agent: e.userAgent
        }
    }
}
function yr(e, t, n=2) {
    if (!t || typeof t != "object" || n <= 0)
        return t;
    if (e && Object.keys(t).length === 0)
        return e;
    const r = {
        ...e
    };
    for (const s in t)
        Object.prototype.hasOwnProperty.call(t, s) && (r[s] = yr(r[s], t[s], n - 1));
    return r
}
function _t() {
    return Ae()
}
function Sr() {
    return Ae().substring(16)
}
const Jo = "_sentrySpan";
function Zt(e, t) {
    t ? Ne(e, Jo, t) : delete e[Jo]
}
function ar(e) {
    return e[Jo]
}
const Gp = 100;
class ot {
    constructor() {
        this._notifyingListeners = !1,
        this._scopeListeners = [],
        this._eventProcessors = [],
        this._breadcrumbs = [],
        this._attachments = [],
        this._user = {},
        this._tags = {},
        this._extra = {},
        this._contexts = {},
        this._sdkProcessingMetadata = {},
        this._propagationContext = {
            traceId: _t(),
            sampleRand: Math.random()
        }
    }
    clone() {
        const t = new ot;
        return t._breadcrumbs = [...this._breadcrumbs],
        t._tags = {
            ...this._tags
        },
        t._extra = {
            ...this._extra
        },
        t._contexts = {
            ...this._contexts
        },
        this._contexts.flags && (t._contexts.flags = {
            values: [...this._contexts.flags.values]
        }),
        t._user = this._user,
        t._level = this._level,
        t._session = this._session,
        t._transactionName = this._transactionName,
        t._fingerprint = this._fingerprint,
        t._eventProcessors = [...this._eventProcessors],
        t._attachments = [...this._attachments],
        t._sdkProcessingMetadata = {
            ...this._sdkProcessingMetadata
        },
        t._propagationContext = {
            ...this._propagationContext
        },
        t._client = this._client,
        t._lastEventId = this._lastEventId,
        Zt(t, ar(this)),
        t
    }
    setClient(t) {
        this._client = t
    }
    setLastEventId(t) {
        this._lastEventId = t
    }
    getClient() {
        return this._client
    }
    lastEventId() {
        return this._lastEventId
    }
    addScopeListener(t) {
        this._scopeListeners.push(t)
    }
    addEventProcessor(t) {
        return this._eventProcessors.push(t),
        this
    }
    setUser(t) {
        return this._user = t || {
            email: void 0,
            id: void 0,
            ip_address: void 0,
            username: void 0
        },
        this._session && Rn(this._session, {
            user: t
        }),
        this._notifyScopeListeners(),
        this
    }
    getUser() {
        return this._user
    }
    setTags(t) {
        return this._tags = {
            ...this._tags,
            ...t
        },
        this._notifyScopeListeners(),
        this
    }
    setTag(t, n) {
        return this._tags = {
            ...this._tags,
            [t]: n
        },
        this._notifyScopeListeners(),
        this
    }
    setExtras(t) {
        return this._extra = {
            ...this._extra,
            ...t
        },
        this._notifyScopeListeners(),
        this
    }
    setExtra(t, n) {
        return this._extra = {
            ...this._extra,
            [t]: n
        },
        this._notifyScopeListeners(),
        this
    }
    setFingerprint(t) {
        return this._fingerprint = t,
        this._notifyScopeListeners(),
        this
    }
    setLevel(t) {
        return this._level = t,
        this._notifyScopeListeners(),
        this
    }
    setTransactionName(t) {
        return this._transactionName = t,
        this._notifyScopeListeners(),
        this
    }
    setContext(t, n) {
        return n === null ? delete this._contexts[t] : this._contexts[t] = n,
        this._notifyScopeListeners(),
        this
    }
    setSession(t) {
        return t ? this._session = t : delete this._session,
        this._notifyScopeListeners(),
        this
    }
    getSession() {
        return this._session
    }
    update(t) {
        if (!t)
            return this;
        const n = typeof t == "function" ? t(this) : t
          , r = n instanceof ot ? n.getScopeData() : Jt(n) ? t : void 0
          , {tags: s, extra: o, user: i, contexts: a, level: c, fingerprint: u=[], propagationContext: d} = r || {};
        return this._tags = {
            ...this._tags,
            ...s
        },
        this._extra = {
            ...this._extra,
            ...o
        },
        this._contexts = {
            ...this._contexts,
            ...a
        },
        i && Object.keys(i).length && (this._user = i),
        c && (this._level = c),
        u.length && (this._fingerprint = u),
        d && (this._propagationContext = d),
        this
    }
    clear() {
        return this._breadcrumbs = [],
        this._tags = {},
        this._extra = {},
        this._user = {},
        this._contexts = {},
        this._level = void 0,
        this._transactionName = void 0,
        this._fingerprint = void 0,
        this._session = void 0,
        Zt(this, void 0),
        this._attachments = [],
        this.setPropagationContext({
            traceId: _t(),
            sampleRand: Math.random()
        }),
        this._notifyScopeListeners(),
        this
    }
    addBreadcrumb(t, n) {
        var o;
        const r = typeof n == "number" ? n : Gp;
        if (r <= 0)
            return this;
        const s = {
            timestamp: _r(),
            ...t,
            message: t.message ? Cn(t.message, 2048) : t.message
        };
        return this._breadcrumbs.push(s),
        this._breadcrumbs.length > r && (this._breadcrumbs = this._breadcrumbs.slice(-r),
        (o = this._client) == null || o.recordDroppedEvent("buffer_overflow", "log_item")),
        this._notifyScopeListeners(),
        this
    }
    getLastBreadcrumb() {
        return this._breadcrumbs[this._breadcrumbs.length - 1]
    }
    clearBreadcrumbs() {
        return this._breadcrumbs = [],
        this._notifyScopeListeners(),
        this
    }
    addAttachment(t) {
        return this._attachments.push(t),
        this
    }
    clearAttachments() {
        return this._attachments = [],
        this
    }
    getScopeData() {
        return {
            breadcrumbs: this._breadcrumbs,
            attachments: this._attachments,
            contexts: this._contexts,
            tags: this._tags,
            extra: this._extra,
            user: this._user,
            level: this._level,
            fingerprint: this._fingerprint || [],
            eventProcessors: this._eventProcessors,
            propagationContext: this._propagationContext,
            sdkProcessingMetadata: this._sdkProcessingMetadata,
            transactionName: this._transactionName,
            span: ar(this)
        }
    }
    setSDKProcessingMetadata(t) {
        return this._sdkProcessingMetadata = yr(this._sdkProcessingMetadata, t, 2),
        this
    }
    setPropagationContext(t) {
        return this._propagationContext = t,
        this
    }
    getPropagationContext() {
        return this._propagationContext
    }
    captureException(t, n) {
        const r = (n == null ? void 0 : n.event_id) || Ae();
        if (!this._client)
            return y.warn("No client configured on scope - will not capture exception!"),
            r;
        const s = new Error("Sentry syntheticException");
        return this._client.captureException(t, {
            originalException: t,
            syntheticException: s,
            ...n,
            event_id: r
        }, this),
        r
    }
    captureMessage(t, n, r) {
        const s = (r == null ? void 0 : r.event_id) || Ae();
        if (!this._client)
            return y.warn("No client configured on scope - will not capture message!"),
            s;
        const o = new Error(t);
        return this._client.captureMessage(t, n, {
            originalException: t,
            syntheticException: o,
            ...r,
            event_id: s
        }, this),
        s
    }
    captureEvent(t, n) {
        const r = (n == null ? void 0 : n.event_id) || Ae();
        return this._client ? (this._client.captureEvent(t, {
            ...n,
            event_id: r
        }, this),
        r) : (y.warn("No client configured on scope - will not capture event!"),
        r)
    }
    _notifyScopeListeners() {
        this._notifyingListeners || (this._notifyingListeners = !0,
        this._scopeListeners.forEach(t => {
            t(this)
        }
        ),
        this._notifyingListeners = !1)
    }
}
function Vp() {
    return Gs("defaultCurrentScope", () => new ot)
}
function Yp() {
    return Gs("defaultIsolationScope", () => new ot)
}
class Xp {
    constructor(t, n) {
        let r;
        t ? r = t : r = new ot;
        let s;
        n ? s = n : s = new ot,
        this._stack = [{
            scope: r
        }],
        this._isolationScope = s
    }
    withScope(t) {
        const n = this._pushScope();
        let r;
        try {
            r = t(n)
        } catch (s) {
            throw this._popScope(),
            s
        }
        return gr(r) ? r.then(s => (this._popScope(),
        s), s => {
            throw this._popScope(),
            s
        }
        ) : (this._popScope(),
        r)
    }
    getClient() {
        return this.getStackTop().client
    }
    getScope() {
        return this.getStackTop().scope
    }
    getIsolationScope() {
        return this._isolationScope
    }
    getStackTop() {
        return this._stack[this._stack.length - 1]
    }
    _pushScope() {
        const t = this.getScope().clone();
        return this._stack.push({
            client: this.getClient(),
            scope: t
        }),
        t
    }
    _popScope() {
        return this._stack.length <= 1 ? !1 : !!this._stack.pop()
    }
}
function xn() {
    const e = vt()
      , t = mr(e);
    return t.stack = t.stack || new Xp(Vp(),Yp())
}
function Kp(e) {
    return xn().withScope(e)
}
function Jp(e, t) {
    const n = xn();
    return n.withScope( () => (n.getStackTop().scope = e,
    t(e)))
}
function Ba(e) {
    return xn().withScope( () => e(xn().getIsolationScope()))
}
function Zp() {
    return {
        withIsolationScope: Ba,
        withScope: Kp,
        withSetScope: Jp,
        withSetIsolationScope: (e, t) => Ba(t),
        getCurrentScope: () => xn().getScope(),
        getIsolationScope: () => xn().getIsolationScope()
    }
}
function Ut(e) {
    const t = mr(e);
    return t.acs ? t.acs : Zp()
}
function j() {
    const e = vt();
    return Ut(e).getCurrentScope()
}
function we() {
    const e = vt();
    return Ut(e).getIsolationScope()
}
function Xs() {
    return Gs("globalScope", () => new ot)
}
function Be(...e) {
    const t = vt()
      , n = Ut(t);
    if (e.length === 2) {
        const [r,s] = e;
        return r ? n.withSetScope(r, s) : n.withScope(s)
    }
    return n.withScope(e[0])
}
function T1(...e) {
    const t = vt()
      , n = Ut(t);
    if (e.length === 2) {
        const [r,s] = e;
        return r ? n.withSetIsolationScope(r, s) : n.withIsolationScope(s)
    }
    return n.withIsolationScope(e[0])
}
function M() {
    return j().getClient()
}
function al(e) {
    const t = e.getPropagationContext()
      , {traceId: n, parentSpanId: r, propagationSpanId: s} = t
      , o = {
        trace_id: n,
        span_id: s || Sr()
    };
    return r && (o.parent_span_id = r),
    o
}
const de = "sentry.source"
  , Di = "sentry.sample_rate"
  , cl = "sentry.previous_trace_sample_rate"
  , be = "sentry.op"
  , Y = "sentry.origin"
  , vs = "sentry.idle_span_finish_reason"
  , br = "sentry.measurement_unit"
  , Er = "sentry.measurement_value"
  , Zo = "sentry.custom_span_name"
  , Fi = "sentry.profile_id"
  , Gn = "sentry.exclusive_time"
  , Qp = "http.request.method"
  , eh = "url.full"
  , th = "sentry.link.type"
  , nh = 0
  , $i = 1
  , pe = 2;
function rh(e) {
    if (e < 400 && e >= 100)
        return {
            code: $i
        };
    if (e >= 400 && e < 500)
        switch (e) {
        case 401:
            return {
                code: pe,
                message: "unauthenticated"
            };
        case 403:
            return {
                code: pe,
                message: "permission_denied"
            };
        case 404:
            return {
                code: pe,
                message: "not_found"
            };
        case 409:
            return {
                code: pe,
                message: "already_exists"
            };
        case 413:
            return {
                code: pe,
                message: "failed_precondition"
            };
        case 429:
            return {
                code: pe,
                message: "resource_exhausted"
            };
        case 499:
            return {
                code: pe,
                message: "cancelled"
            };
        default:
            return {
                code: pe,
                message: "invalid_argument"
            }
        }
    if (e >= 500 && e < 600)
        switch (e) {
        case 501:
            return {
                code: pe,
                message: "unimplemented"
            };
        case 503:
            return {
                code: pe,
                message: "unavailable"
            };
        case 504:
            return {
                code: pe,
                message: "deadline_exceeded"
            };
        default:
            return {
                code: pe,
                message: "internal_error"
            }
        }
    return {
        code: pe,
        message: "unknown_error"
    }
}
function ws(e, t) {
    e.setAttribute("http.response.status_code", t);
    const n = rh(t);
    n.message !== "unknown_error" && e.setStatus(n)
}
const ul = "_sentryScope"
  , ll = "_sentryIsolationScope";
function sh(e, t, n) {
    e && (Ne(e, ll, n),
    Ne(e, ul, t))
}
function Ts(e) {
    return {
        scope: e[ul],
        isolationScope: e[ll]
    }
}
const Bi = "sentry-"
  , oh = /^sentry-/
  , ih = 8192;
function dl(e) {
    const t = ah(e);
    if (!t)
        return;
    const n = Object.entries(t).reduce( (r, [s,o]) => {
        if (s.match(oh)) {
            const i = s.slice(Bi.length);
            r[i] = o
        }
        return r
    }
    , {});
    if (Object.keys(n).length > 0)
        return n
}
function fl(e) {
    if (!e)
        return;
    const t = Object.entries(e).reduce( (n, [r,s]) => (s && (n[`${Bi}${r}`] = s),
    n), {});
    return ch(t)
}
function ah(e) {
    if (!(!e || !Ke(e) && !Array.isArray(e)))
        return Array.isArray(e) ? e.reduce( (t, n) => {
            const r = Ua(n);
            return Object.entries(r).forEach( ([s,o]) => {
                t[s] = o
            }
            ),
            t
        }
        , {}) : Ua(e)
}
function Ua(e) {
    return e.split(",").map(t => t.split("=").map(n => {
        try {
            return decodeURIComponent(n.trim())
        } catch {
            return
        }
    }
    )).reduce( (t, [n,r]) => (n && r && (t[n] = r),
    t), {})
}
function ch(e) {
    if (Object.keys(e).length !== 0)
        return Object.entries(e).reduce( (t, [n,r], s) => {
            const o = `${encodeURIComponent(n)}=${encodeURIComponent(r)}`
              , i = s === 0 ? o : `${t},${o}`;
            return i.length > ih ? (x && y.warn(`Not adding key: ${n} with val: ${r} to baggage header due to exceeding baggage size limits.`),
            t) : i
        }
        , "")
}
function Qt(e) {
    if (typeof e == "boolean")
        return Number(e);
    const t = typeof e == "string" ? parseFloat(e) : e;
    if (!(typeof t != "number" || isNaN(t) || t < 0 || t > 1))
        return t
}
const pl = new RegExp("^[ \\t]*([0-9a-f]{32})?-?([0-9a-f]{16})?-?([01])?[ \\t]*$");
function uh(e) {
    if (!e)
        return;
    const t = e.match(pl);
    if (!t)
        return;
    let n;
    return t[3] === "1" ? n = !0 : t[3] === "0" && (n = !1),
    {
        traceId: t[1],
        parentSampled: n,
        parentSpanId: t[2]
    }
}
function hl(e, t) {
    const n = uh(e)
      , r = dl(t);
    if (!(n != null && n.traceId))
        return {
            traceId: _t(),
            sampleRand: Math.random()
        };
    const s = lh(n, r);
    r && (r.sample_rand = s.toString());
    const {traceId: o, parentSpanId: i, parentSampled: a} = n;
    return {
        traceId: o,
        parentSpanId: i,
        sampled: a,
        dsc: r || {},
        sampleRand: s
    }
}
function ml(e=_t(), t=Sr(), n) {
    let r = "";
    return n !== void 0 && (r = n ? "-1" : "-0"),
    `${e}-${t}${r}`
}
function lh(e, t) {
    const n = Qt(t == null ? void 0 : t.sample_rand);
    if (n !== void 0)
        return n;
    const r = Qt(t == null ? void 0 : t.sample_rate);
    return r && (e == null ? void 0 : e.parentSampled) !== void 0 ? e.parentSampled ? Math.random() * r : r + Math.random() * (1 - r) : Math.random()
}
const gl = 0
  , Ui = 1;
let Ha = !1;
function dh(e) {
    const {spanId: t, traceId: n} = e.spanContext()
      , {data: r, op: s, parent_span_id: o, status: i, origin: a, links: c} = z(e);
    return {
        parent_span_id: o,
        span_id: t,
        trace_id: n,
        data: r,
        op: s,
        status: i,
        origin: a,
        links: c
    }
}
function _l(e) {
    const {spanId: t, traceId: n, isRemote: r} = e.spanContext()
      , s = r ? t : z(e).parent_span_id
      , o = Ts(e).scope
      , i = r ? (o == null ? void 0 : o.getPropagationContext().propagationSpanId) || Sr() : t;
    return {
        parent_span_id: s,
        span_id: i,
        trace_id: n
    }
}
function fh(e) {
    const {traceId: t, spanId: n} = e.spanContext()
      , r = sn(e);
    return ml(t, n, r)
}
function yl(e) {
    if (e && e.length > 0)
        return e.map( ({context: {spanId: t, traceId: n, traceFlags: r, ...s}, attributes: o}) => ({
            span_id: t,
            trace_id: n,
            sampled: r === Ui,
            attributes: o,
            ...s
        }))
}
function Yt(e) {
    return typeof e == "number" ? Wa(e) : Array.isArray(e) ? e[0] + e[1] / 1e9 : e instanceof Date ? Wa(e.getTime()) : me()
}
function Wa(e) {
    return e > 9999999999 ? e / 1e3 : e
}
function z(e) {
    var r;
    if (hh(e))
        return e.getSpanJSON();
    const {spanId: t, traceId: n} = e.spanContext();
    if (ph(e)) {
        const {attributes: s, startTime: o, name: i, endTime: a, status: c, links: u} = e
          , d = "parentSpanId"in e ? e.parentSpanId : "parentSpanContext"in e ? (r = e.parentSpanContext) == null ? void 0 : r.spanId : void 0;
        return {
            span_id: t,
            trace_id: n,
            data: s,
            description: i,
            parent_span_id: d,
            start_timestamp: Yt(o),
            timestamp: Yt(a) || void 0,
            status: Sl(c),
            op: s[be],
            origin: s[Y],
            links: yl(u)
        }
    }
    return {
        span_id: t,
        trace_id: n,
        start_timestamp: 0,
        data: {}
    }
}
function ph(e) {
    const t = e;
    return !!t.attributes && !!t.startTime && !!t.name && !!t.endTime && !!t.status
}
function hh(e) {
    return typeof e.getSpanJSON == "function"
}
function sn(e) {
    const {traceFlags: t} = e.spanContext();
    return t === Ui
}
function Sl(e) {
    if (!(!e || e.code === nh))
        return e.code === $i ? "ok" : e.message || "unknown_error"
}
const Xt = "_sentryChildSpans"
  , Qo = "_sentryRootSpan";
function bl(e, t) {
    const n = e[Qo] || e;
    Ne(t, Qo, n),
    e[Xt] ? e[Xt].add(t) : Ne(e, Xt, new Set([t]))
}
function mh(e, t) {
    e[Xt] && e[Xt].delete(t)
}
function rs(e) {
    const t = new Set;
    function n(r) {
        if (!t.has(r) && sn(r)) {
            t.add(r);
            const s = r[Xt] ? Array.from(r[Xt]) : [];
            for (const o of s)
                n(o)
        }
    }
    return n(e),
    Array.from(t)
}
function ye(e) {
    return e[Qo] || e
}
function ge() {
    const e = vt()
      , t = Ut(e);
    return t.getActiveSpan ? t.getActiveSpan() : ar(j())
}
function ei() {
    Ha || (nn( () => {
        console.warn("[Sentry] Returning null from `beforeSendSpan` is disallowed. To drop certain spans, configure the respective integrations directly.")
    }
    ),
    Ha = !0)
}
function I1(e, t) {
    e.updateName(t),
    e.setAttributes({
        [de]: "custom",
        [Zo]: t
    })
}
let za = !1;
function gh() {
    za || (za = !0,
    Ku(ti),
    Ju(ti))
}
function ti() {
    const e = ge()
      , t = e && ye(e);
    if (t) {
        const n = "internal_error";
        x && y.log(`[Tracing] Root span: ${n} -> Global error occurred`),
        t.setStatus({
            code: pe,
            message: n
        })
    }
}
ti.tag = "sentry_tracingErrorCallback";
function Dt(e) {
    var n;
    if (typeof __SENTRY_TRACING__ == "boolean" && !__SENTRY_TRACING__)
        return !1;
    const t = e || ((n = M()) == null ? void 0 : n.getOptions());
    return !!t && (t.tracesSampleRate != null || !!t.tracesSampler)
}
const Ks = "production"
  , _h = /^o(\d+)\./
  , yh = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)([\w.-]+)(?::(\d+))?\/(.+)/;
function Sh(e) {
    return e === "http" || e === "https"
}
function on(e, t=!1) {
    const {host: n, path: r, pass: s, port: o, projectId: i, protocol: a, publicKey: c} = e;
    return `${a}://${c}${t && s ? `:${s}` : ""}@${n}${o ? `:${o}` : ""}/${r && `${r}/`}${i}`
}
function El(e) {
    const t = yh.exec(e);
    if (!t) {
        nn( () => {
            console.error(`Invalid Sentry Dsn: ${e}`)
        }
        );
        return
    }
    const [n,r,s="",o="",i="",a=""] = t.slice(1);
    let c = ""
      , u = a;
    const d = u.split("/");
    if (d.length > 1 && (c = d.slice(0, -1).join("/"),
    u = d.pop()),
    u) {
        const l = u.match(/^\d+/);
        l && (u = l[0])
    }
    return vl({
        host: o,
        pass: s,
        path: c,
        projectId: u,
        port: i,
        protocol: n,
        publicKey: r
    })
}
function vl(e) {
    return {
        protocol: e.protocol,
        publicKey: e.publicKey || "",
        pass: e.pass || "",
        host: e.host,
        port: e.port || "",
        path: e.path || "",
        projectId: e.projectId
    }
}
function bh(e) {
    if (!x)
        return !0;
    const {port: t, projectId: n, protocol: r} = e;
    return ["protocol", "publicKey", "host", "projectId"].find(i => e[i] ? !1 : (y.error(`Invalid Sentry Dsn: ${i} missing`),
    !0)) ? !1 : n.match(/^\d+$/) ? Sh(r) ? t && isNaN(parseInt(t, 10)) ? (y.error(`Invalid Sentry Dsn: Invalid port ${t}`),
    !1) : !0 : (y.error(`Invalid Sentry Dsn: Invalid protocol ${r}`),
    !1) : (y.error(`Invalid Sentry Dsn: Invalid projectId ${n}`),
    !1)
}
function Eh(e) {
    const t = e.match(_h);
    return t == null ? void 0 : t[1]
}
function wl(e) {
    const t = typeof e == "string" ? El(e) : vl(e);
    if (!(!t || !bh(t)))
        return t
}
const Tl = "_frozenDsc";
function ss(e, t) {
    Ne(e, Tl, t)
}
function Il(e, t) {
    const n = t.getOptions()
      , {publicKey: r, host: s} = t.getDsn() || {};
    let o;
    n.orgId ? o = String(n.orgId) : s && (o = Eh(s));
    const i = {
        environment: n.environment || Ks,
        release: n.release,
        public_key: r,
        trace_id: e,
        org_id: o
    };
    return t.emit("createDsc", i),
    i
}
function Hi(e, t) {
    const n = t.getPropagationContext();
    return n.dsc || Il(n.traceId, e)
}
function Ze(e) {
    var h;
    const t = M();
    if (!t)
        return {};
    const n = ye(e)
      , r = z(n)
      , s = r.data
      , o = n.spanContext().traceState
      , i = (o == null ? void 0 : o.get("sentry.sample_rate")) ?? s[Di] ?? s[cl];
    function a(m) {
        return (typeof i == "number" || typeof i == "string") && (m.sample_rate = `${i}`),
        m
    }
    const c = n[Tl];
    if (c)
        return a(c);
    const u = o == null ? void 0 : o.get("sentry.dsc")
      , d = u && dl(u);
    if (d)
        return a(d);
    const l = Il(e.spanContext().traceId, t)
      , f = s[de]
      , p = r.description;
    return f !== "url" && p && (l.transaction = p),
    Dt() && (l.sampled = String(sn(n)),
    l.sample_rand = (o == null ? void 0 : o.get("sentry.sample_rand")) ?? ((h = Ts(n).scope) == null ? void 0 : h.getPropagationContext().sampleRand.toString())),
    a(l),
    t.emit("createDsc", l, n),
    l
}
function k1(e) {
    const t = Ze(e);
    return fl(t)
}
class yt {
    constructor(t={}) {
        this._traceId = t.traceId || _t(),
        this._spanId = t.spanId || Sr()
    }
    spanContext() {
        return {
            spanId: this._spanId,
            traceId: this._traceId,
            traceFlags: gl
        }
    }
    end(t) {}
    setAttribute(t, n) {
        return this
    }
    setAttributes(t) {
        return this
    }
    setStatus(t) {
        return this
    }
    updateName(t) {
        return this
    }
    isRecording() {
        return !1
    }
    addEvent(t, n, r) {
        return this
    }
    addLink(t) {
        return this
    }
    addLinks(t) {
        return this
    }
    recordException(t, n) {}
}
function kl(e, t, n= () => {}
) {
    let r;
    try {
        r = e()
    } catch (s) {
        throw t(s),
        n(),
        s
    }
    return vh(r, t, n)
}
function vh(e, t, n) {
    return gr(e) ? e.then(r => (n(),
    r), r => {
        throw t(r),
        n(),
        r
    }
    ) : (n(),
    e)
}
function wh(e) {
    if (!x)
        return;
    const {description: t="< unknown name >", op: n="< unknown op >", parent_span_id: r} = z(e)
      , {spanId: s} = e.spanContext()
      , o = sn(e)
      , i = ye(e)
      , a = i === e
      , c = `[Tracing] Starting ${o ? "sampled" : "unsampled"} ${a ? "root " : ""}span`
      , u = [`op: ${n}`, `name: ${t}`, `ID: ${s}`];
    if (r && u.push(`parent ID: ${r}`),
    !a) {
        const {op: d, description: l} = z(i);
        u.push(`root ID: ${i.spanContext().spanId}`),
        d && u.push(`root op: ${d}`),
        l && u.push(`root description: ${l}`)
    }
    y.log(`${c}
  ${u.join(`
  `)}`)
}
function Th(e) {
    if (!x)
        return;
    const {description: t="< unknown name >", op: n="< unknown op >"} = z(e)
      , {spanId: r} = e.spanContext()
      , o = ye(e) === e
      , i = `[Tracing] Finishing "${n}" ${o ? "root " : ""}span "${t}" with ID ${r}`;
    y.log(i)
}
function Ih(e, t, n) {
    if (!Dt(e))
        return [!1];
    let r, s;
    typeof e.tracesSampler == "function" ? (s = e.tracesSampler({
        ...t,
        inheritOrSampleWith: a => typeof t.parentSampleRate == "number" ? t.parentSampleRate : typeof t.parentSampled == "boolean" ? Number(t.parentSampled) : a
    }),
    r = !0) : t.parentSampled !== void 0 ? s = t.parentSampled : typeof e.tracesSampleRate < "u" && (s = e.tracesSampleRate,
    r = !0);
    const o = Qt(s);
    if (o === void 0)
        return x && y.warn(`[Tracing] Discarding root span because of invalid sample rate. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(s)} of type ${JSON.stringify(typeof s)}.`),
        [!1];
    if (!o)
        return x && y.log(`[Tracing] Discarding transaction because ${typeof e.tracesSampler == "function" ? "tracesSampler returned 0 or false" : "a negative sampling decision was inherited or tracesSampleRate is set to 0"}`),
        [!1, o, r];
    const i = n < o;
    return i || x && y.log(`[Tracing] Discarding transaction because it's not included in the random sample (sampling rate = ${Number(s)})`),
    [i, o, r]
}
function De(e, t=100, n=1 / 0) {
    try {
        return ni("", e, t, n)
    } catch (r) {
        return {
            ERROR: `**non-serializable** (${r})`
        }
    }
}
function Cl(e, t=3, n=100 * 1024) {
    const r = De(e, t);
    return xh(r) > n ? Cl(e, t - 1, n) : r
}
function ni(e, t, n=1 / 0, r=1 / 0, s=Mh()) {
    const [o,i] = s;
    if (t == null || ["boolean", "string"].includes(typeof t) || typeof t == "number" && Number.isFinite(t))
        return t;
    const a = kh(e, t);
    if (!a.startsWith("[object "))
        return a;
    if (t.__sentry_skip_normalization__)
        return t;
    const c = typeof t.__sentry_override_normalization_depth__ == "number" ? t.__sentry_override_normalization_depth__ : n;
    if (c === 0)
        return a.replace("object ", "");
    if (o(t))
        return "[Circular ~]";
    const u = t;
    if (u && typeof u.toJSON == "function")
        try {
            const p = u.toJSON();
            return ni("", p, c - 1, r, s)
        } catch {}
    const d = Array.isArray(t) ? [] : {};
    let l = 0;
    const f = sl(t);
    for (const p in f) {
        if (!Object.prototype.hasOwnProperty.call(f, p))
            continue;
        if (l >= r) {
            d[p] = "[MaxProperties ~]";
            break
        }
        const h = f[p];
        d[p] = ni(p, h, c - 1, r, s),
        l++
    }
    return i(t),
    d
}
function kh(e, t) {
    try {
        if (e === "domain" && t && typeof t == "object" && t._events)
            return "[Domain]";
        if (e === "domainEmitter")
            return "[DomainEmitter]";
        if (typeof global < "u" && t === global)
            return "[Global]";
        if (typeof window < "u" && t === window)
            return "[Window]";
        if (typeof document < "u" && t === document)
            return "[Document]";
        if (el(t))
            return "[VueViewModel]";
        if (Op(t))
            return "[SyntheticEvent]";
        if (typeof t == "number" && !Number.isFinite(t))
            return `[${t}]`;
        if (typeof t == "function")
            return `[Function: ${mt(t)}]`;
        if (typeof t == "symbol")
            return `[${String(t)}]`;
        if (typeof t == "bigint")
            return `[BigInt: ${String(t)}]`;
        const n = Ch(t);
        return /^HTML(\w*)Element$/.test(n) ? `[HTMLElement: ${n}]` : `[object ${n}]`
    } catch (n) {
        return `**non-serializable** (${n})`
    }
}
function Ch(e) {
    const t = Object.getPrototypeOf(e);
    return t != null && t.constructor ? t.constructor.name : "null prototype"
}
function Rh(e) {
    return ~-encodeURI(e).split(/%..|./).length
}
function xh(e) {
    return Rh(JSON.stringify(e))
}
function Mh() {
    const e = new WeakSet;
    function t(r) {
        return e.has(r) ? !0 : (e.add(r),
        !1)
    }
    function n(r) {
        e.delete(r)
    }
    return [t, n]
}
function wt(e, t=[]) {
    return [e, t]
}
function Ah(e, t) {
    const [n,r] = e;
    return [n, [...r, t]]
}
function en(e, t) {
    const n = e[1];
    for (const r of n) {
        const s = r[0].type;
        if (t(r, s))
            return !0
    }
    return !1
}
function ja(e, t) {
    return en(e, (n, r) => t.includes(r))
}
function Is(e) {
    const t = mr(P);
    return t.encodePolyfill ? t.encodePolyfill(e) : new TextEncoder().encode(e)
}
function Nh(e) {
    const t = mr(P);
    return t.decodePolyfill ? t.decodePolyfill(e) : new TextDecoder().decode(e)
}
function ks(e) {
    const [t,n] = e;
    let r = JSON.stringify(t);
    function s(o) {
        typeof r == "string" ? r = typeof o == "string" ? r + o : [Is(r), o] : r.push(typeof o == "string" ? Is(o) : o)
    }
    for (const o of n) {
        const [i,a] = o;
        if (s(`
${JSON.stringify(i)}
`),
        typeof a == "string" || a instanceof Uint8Array)
            s(a);
        else {
            let c;
            try {
                c = JSON.stringify(a)
            } catch {
                c = JSON.stringify(De(a))
            }
            s(c)
        }
    }
    return typeof r == "string" ? r : Oh(r)
}
function Oh(e) {
    const t = e.reduce( (s, o) => s + o.length, 0)
      , n = new Uint8Array(t);
    let r = 0;
    for (const s of e)
        n.set(s, r),
        r += s.length;
    return n
}
function Lh(e) {
    let t = typeof e == "string" ? Is(e) : e;
    function n(i) {
        const a = t.subarray(0, i);
        return t = t.subarray(i + 1),
        a
    }
    function r() {
        let i = t.indexOf(10);
        return i < 0 && (i = t.length),
        JSON.parse(Nh(n(i)))
    }
    const s = r()
      , o = [];
    for (; t.length; ) {
        const i = r()
          , a = typeof i.length == "number" ? i.length : void 0;
        o.push([i, a ? n(a) : r()])
    }
    return [s, o]
}
function Ph(e) {
    return [{
        type: "span"
    }, e]
}
function Dh(e) {
    const t = typeof e.data == "string" ? Is(e.data) : e.data;
    return [{
        type: "attachment",
        length: t.length,
        filename: e.filename,
        content_type: e.contentType,
        attachment_type: e.attachmentType
    }, t]
}
const Fh = {
    session: "session",
    sessions: "session",
    attachment: "attachment",
    transaction: "transaction",
    event: "error",
    client_report: "internal",
    user_report: "default",
    profile: "profile",
    profile_chunk: "profile",
    replay_event: "replay",
    replay_recording: "replay",
    check_in: "monitor",
    feedback: "feedback",
    span: "span",
    raw_security: "security",
    log: "log_item"
};
function qa(e) {
    return Fh[e]
}
function Wi(e) {
    if (!(e != null && e.sdk))
        return;
    const {name: t, version: n} = e.sdk;
    return {
        name: t,
        version: n
    }
}
function Rl(e, t, n, r) {
    var o;
    const s = (o = e.sdkProcessingMetadata) == null ? void 0 : o.dynamicSamplingContext;
    return {
        event_id: e.event_id,
        sent_at: new Date().toISOString(),
        ...t && {
            sdk: t
        },
        ...!!n && r && {
            dsn: on(r)
        },
        ...s && {
            trace: s
        }
    }
}
function $h(e, t) {
    return t && (e.sdk = e.sdk || {},
    e.sdk.name = e.sdk.name || t.name,
    e.sdk.version = e.sdk.version || t.version,
    e.sdk.integrations = [...e.sdk.integrations || [], ...t.integrations || []],
    e.sdk.packages = [...e.sdk.packages || [], ...t.packages || []]),
    e
}
function Bh(e, t, n, r) {
    const s = Wi(n)
      , o = {
        sent_at: new Date().toISOString(),
        ...s && {
            sdk: s
        },
        ...!!r && t && {
            dsn: on(t)
        }
    }
      , i = "aggregates"in e ? [{
        type: "sessions"
    }, e] : [{
        type: "session"
    }, e.toJSON()];
    return wt(o, [i])
}
function Uh(e, t, n, r) {
    const s = Wi(n)
      , o = e.type && e.type !== "replay_event" ? e.type : "event";
    $h(e, n == null ? void 0 : n.sdk);
    const i = Rl(e, s, r, t);
    return delete e.sdkProcessingMetadata,
    wt(i, [[{
        type: o
    }, e]])
}
function Hh(e, t) {
    function n(d) {
        return !!d.trace_id && !!d.public_key
    }
    const r = Ze(e[0])
      , s = t == null ? void 0 : t.getDsn()
      , o = t == null ? void 0 : t.getOptions().tunnel
      , i = {
        sent_at: new Date().toISOString(),
        ...n(r) && {
            trace: r
        },
        ...!!o && s && {
            dsn: on(s)
        }
    }
      , a = t == null ? void 0 : t.getOptions().beforeSendSpan
      , c = a ? d => {
        const l = z(d)
          , f = a(l);
        return f || (ei(),
        l)
    }
    : z
      , u = [];
    for (const d of e) {
        const l = c(d);
        l && u.push(Ph(l))
    }
    return wt(i, u)
}
function Wh(e, t, n, r=ge()) {
    const s = r && ye(r);
    s && (x && y.log(`[Measurement] Setting measurement on root span: ${e} = ${t} ${n}`),
    s.addEvent(e, {
        [Er]: t,
        [br]: n
    }))
}
function Ga(e) {
    if (!e || e.length === 0)
        return;
    const t = {};
    return e.forEach(n => {
        const r = n.attributes || {}
          , s = r[br]
          , o = r[Er];
        typeof s == "string" && typeof o == "number" && (t[n.name] = {
            value: o,
            unit: s
        })
    }
    ),
    t
}
const Va = 1e3;
class zi {
    constructor(t={}) {
        this._traceId = t.traceId || _t(),
        this._spanId = t.spanId || Sr(),
        this._startTime = t.startTimestamp || me(),
        this._links = t.links,
        this._attributes = {},
        this.setAttributes({
            [Y]: "manual",
            [be]: t.op,
            ...t.attributes
        }),
        this._name = t.name,
        t.parentSpanId && (this._parentSpanId = t.parentSpanId),
        "sampled"in t && (this._sampled = t.sampled),
        t.endTimestamp && (this._endTime = t.endTimestamp),
        this._events = [],
        this._isStandaloneSpan = t.isStandalone,
        this._endTime && this._onSpanEnded()
    }
    addLink(t) {
        return this._links ? this._links.push(t) : this._links = [t],
        this
    }
    addLinks(t) {
        return this._links ? this._links.push(...t) : this._links = t,
        this
    }
    recordException(t, n) {}
    spanContext() {
        const {_spanId: t, _traceId: n, _sampled: r} = this;
        return {
            spanId: t,
            traceId: n,
            traceFlags: r ? Ui : gl
        }
    }
    setAttribute(t, n) {
        return n === void 0 ? delete this._attributes[t] : this._attributes[t] = n,
        this
    }
    setAttributes(t) {
        return Object.keys(t).forEach(n => this.setAttribute(n, t[n])),
        this
    }
    updateStartTime(t) {
        this._startTime = Yt(t)
    }
    setStatus(t) {
        return this._status = t,
        this
    }
    updateName(t) {
        return this._name = t,
        this.setAttribute(de, "custom"),
        this
    }
    end(t) {
        this._endTime || (this._endTime = Yt(t),
        Th(this),
        this._onSpanEnded())
    }
    getSpanJSON() {
        return {
            data: this._attributes,
            description: this._name,
            op: this._attributes[be],
            parent_span_id: this._parentSpanId,
            span_id: this._spanId,
            start_timestamp: this._startTime,
            status: Sl(this._status),
            timestamp: this._endTime,
            trace_id: this._traceId,
            origin: this._attributes[Y],
            profile_id: this._attributes[Fi],
            exclusive_time: this._attributes[Gn],
            measurements: Ga(this._events),
            is_segment: this._isStandaloneSpan && ye(this) === this || void 0,
            segment_id: this._isStandaloneSpan ? ye(this).spanContext().spanId : void 0,
            links: yl(this._links)
        }
    }
    isRecording() {
        return !this._endTime && !!this._sampled
    }
    addEvent(t, n, r) {
        x && y.log("[Tracing] Adding an event to span:", t);
        const s = Ya(n) ? n : r || me()
          , o = Ya(n) ? {} : n || {}
          , i = {
            name: t,
            time: Yt(s),
            attributes: o
        };
        return this._events.push(i),
        this
    }
    isStandaloneSpan() {
        return !!this._isStandaloneSpan
    }
    _onSpanEnded() {
        const t = M();
        if (t && t.emit("spanEnd", this),
        !(this._isStandaloneSpan || this === ye(this)))
            return;
        if (this._isStandaloneSpan) {
            this._sampled ? jh(Hh([this], t)) : (x && y.log("[Tracing] Discarding standalone span because its trace was not chosen to be sampled."),
            t && t.recordDroppedEvent("sample_rate", "span"));
            return
        }
        const r = this._convertSpanToTransaction();
        r && (Ts(this).scope || j()).captureEvent(r)
    }
    _convertSpanToTransaction() {
        var d;
        if (!Xa(z(this)))
            return;
        this._name || (x && y.warn("Transaction has no name, falling back to `<unlabeled transaction>`."),
        this._name = "<unlabeled transaction>");
        const {scope: t, isolationScope: n} = Ts(this)
          , r = (d = t == null ? void 0 : t.getScopeData().sdkProcessingMetadata) == null ? void 0 : d.normalizedRequest;
        if (this._sampled !== !0)
            return;
        const o = rs(this).filter(l => l !== this && !zh(l)).map(l => z(l)).filter(Xa)
          , i = this._attributes[de];
        delete this._attributes[Zo],
        o.forEach(l => {
            delete l.data[Zo]
        }
        );
        const a = {
            contexts: {
                trace: dh(this)
            },
            spans: o.length > Va ? o.sort( (l, f) => l.start_timestamp - f.start_timestamp).slice(0, Va) : o,
            start_timestamp: this._startTime,
            timestamp: this._endTime,
            transaction: this._name,
            type: "transaction",
            sdkProcessingMetadata: {
                capturedSpanScope: t,
                capturedSpanIsolationScope: n,
                dynamicSamplingContext: Ze(this)
            },
            request: r,
            ...i && {
                transaction_info: {
                    source: i
                }
            }
        }
          , c = Ga(this._events);
        return c && Object.keys(c).length && (x && y.log("[Measurements] Adding measurements to transaction event", JSON.stringify(c, void 0, 2)),
        a.measurements = c),
        a
    }
}
function Ya(e) {
    return e && typeof e == "number" || e instanceof Date || Array.isArray(e)
}
function Xa(e) {
    return !!e.start_timestamp && !!e.timestamp && !!e.span_id && !!e.trace_id
}
function zh(e) {
    return e instanceof zi && e.isStandaloneSpan()
}
function jh(e) {
    const t = M();
    if (!t)
        return;
    const n = e[1];
    if (!n || n.length === 0) {
        t.recordDroppedEvent("before_send", "span");
        return
    }
    t.sendEnvelope(e)
}
const Cs = "__SENTRY_SUPPRESS_TRACING__";
function xl(e, t) {
    const n = vr();
    if (n.startSpan)
        return n.startSpan(e, t);
    const r = qi(e)
      , {forceTransaction: s, parentSpan: o, scope: i} = e
      , a = i == null ? void 0 : i.clone();
    return Be(a, () => Ml(o)( () => {
        const u = j()
          , d = Gi(u)
          , f = e.onlyIfParent && !d ? new yt : ji({
            parentSpan: d,
            spanArguments: r,
            forceTransaction: s,
            scope: u
        });
        return Zt(u, f),
        kl( () => t(f), () => {
            const {status: p} = z(f);
            f.isRecording() && (!p || p === "ok") && f.setStatus({
                code: pe,
                message: "internal_error"
            })
        }
        , () => {
            f.end()
        }
        )
    }
    ))
}
function C1(e, t) {
    const n = vr();
    if (n.startSpanManual)
        return n.startSpanManual(e, t);
    const r = qi(e)
      , {forceTransaction: s, parentSpan: o, scope: i} = e
      , a = i == null ? void 0 : i.clone();
    return Be(a, () => Ml(o)( () => {
        const u = j()
          , d = Gi(u)
          , f = e.onlyIfParent && !d ? new yt : ji({
            parentSpan: d,
            spanArguments: r,
            forceTransaction: s,
            scope: u
        });
        return Zt(u, f),
        kl( () => t(f, () => f.end()), () => {
            const {status: p} = z(f);
            f.isRecording() && (!p || p === "ok") && f.setStatus({
                code: pe,
                message: "internal_error"
            })
        }
        )
    }
    ))
}
function nt(e) {
    const t = vr();
    if (t.startInactiveSpan)
        return t.startInactiveSpan(e);
    const n = qi(e)
      , {forceTransaction: r, parentSpan: s} = e;
    return (e.scope ? i => Be(e.scope, i) : s !== void 0 ? i => Mn(s, i) : i => i())( () => {
        const i = j()
          , a = Gi(i);
        return e.onlyIfParent && !a ? new yt : ji({
            parentSpan: a,
            spanArguments: n,
            forceTransaction: r,
            scope: i
        })
    }
    )
}
const R1 = (e, t) => {
    const n = vt()
      , r = Ut(n);
    if (r.continueTrace)
        return r.continueTrace(e, t);
    const {sentryTrace: s, baggage: o} = e;
    return Be(i => {
        const a = hl(s, o);
        return i.setPropagationContext(a),
        t()
    }
    )
}
;
function Mn(e, t) {
    const n = vr();
    return n.withActiveSpan ? n.withActiveSpan(e, t) : Be(r => (Zt(r, e || void 0),
    t(r)))
}
function x1(e) {
    const t = vr();
    return t.suppressTracing ? t.suppressTracing(e) : Be(n => {
        n.setSDKProcessingMetadata({
            [Cs]: !0
        });
        const r = e();
        return n.setSDKProcessingMetadata({
            [Cs]: void 0
        }),
        r
    }
    )
}
function M1(e) {
    return Be(t => (t.setPropagationContext({
        traceId: _t(),
        sampleRand: Math.random()
    }),
    x && y.info(`Starting a new trace with id ${t.getPropagationContext().traceId}`),
    Mn(null, e)))
}
function ji({parentSpan: e, spanArguments: t, forceTransaction: n, scope: r}) {
    if (!Dt()) {
        const i = new yt;
        if (n || !e) {
            const a = {
                sampled: "false",
                sample_rate: "0",
                transaction: t.name,
                ...Ze(i)
            };
            ss(i, a)
        }
        return i
    }
    const s = we();
    let o;
    if (e && !n)
        o = qh(e, r, t),
        bl(e, o);
    else if (e) {
        const i = Ze(e)
          , {traceId: a, spanId: c} = e.spanContext()
          , u = sn(e);
        o = Ka({
            traceId: a,
            parentSpanId: c,
            ...t
        }, r, u),
        ss(o, i)
    } else {
        const {traceId: i, dsc: a, parentSpanId: c, sampled: u} = {
            ...s.getPropagationContext(),
            ...r.getPropagationContext()
        };
        o = Ka({
            traceId: i,
            parentSpanId: c,
            ...t
        }, r, u),
        a && ss(o, a)
    }
    return wh(o),
    sh(o, r, s),
    o
}
function qi(e) {
    const n = {
        isStandalone: (e.experimental || {}).standalone,
        ...e
    };
    if (e.startTime) {
        const r = {
            ...n
        };
        return r.startTimestamp = Yt(e.startTime),
        delete r.startTime,
        r
    }
    return n
}
function vr() {
    const e = vt();
    return Ut(e)
}
function Ka(e, t, n) {
    var h;
    const r = M()
      , s = (r == null ? void 0 : r.getOptions()) || {}
      , {name: o=""} = e
      , i = {
        spanAttributes: {
            ...e.attributes
        },
        spanName: o,
        parentSampled: n
    };
    r == null || r.emit("beforeSampling", i, {
        decision: !1
    });
    const a = i.parentSampled ?? n
      , c = i.spanAttributes
      , u = t.getPropagationContext()
      , [d,l,f] = t.getScopeData().sdkProcessingMetadata[Cs] ? [!1] : Ih(s, {
        name: o,
        parentSampled: a,
        attributes: c,
        parentSampleRate: Qt((h = u.dsc) == null ? void 0 : h.sample_rate)
    }, u.sampleRand)
      , p = new zi({
        ...e,
        attributes: {
            [de]: "custom",
            [Di]: l !== void 0 && f ? l : void 0,
            ...c
        },
        sampled: d
    });
    return !d && r && (x && y.log("[Tracing] Discarding root span because its trace was not chosen to be sampled."),
    r.recordDroppedEvent("sample_rate", "transaction")),
    r && r.emit("spanStart", p),
    p
}
function qh(e, t, n) {
    const {spanId: r, traceId: s} = e.spanContext()
      , o = t.getScopeData().sdkProcessingMetadata[Cs] ? !1 : sn(e)
      , i = o ? new zi({
        ...n,
        parentSpanId: r,
        traceId: s,
        sampled: o
    }) : new yt({
        traceId: s
    });
    bl(e, i);
    const a = M();
    return a && (a.emit("spanStart", i),
    n.endTimestamp && a.emit("spanEnd", i)),
    i
}
function Gi(e) {
    const t = ar(e);
    if (!t)
        return;
    const n = M();
    return (n ? n.getOptions() : {}).parentSpanIsAlwaysRootSpan ? ye(t) : t
}
function Ml(e) {
    return e !== void 0 ? t => Mn(e, t) : t => t()
}
const os = {
    idleTimeout: 1e3,
    finalTimeout: 3e4,
    childSpanTimeout: 15e3
}
  , Gh = "heartbeatFailed"
  , Vh = "idleTimeout"
  , Yh = "finalTimeout"
  , Xh = "externalFinish";
function Al(e, t={}) {
    const n = new Map;
    let r = !1, s, o = Xh, i = !t.disableAutoFinish;
    const a = []
      , {idleTimeout: c=os.idleTimeout, finalTimeout: u=os.finalTimeout, childSpanTimeout: d=os.childSpanTimeout, beforeSpanEnd: l} = t
      , f = M();
    if (!f || !Dt()) {
        const E = new yt
          , k = {
            sample_rate: "0",
            sampled: "false",
            ...Ze(E)
        };
        return ss(E, k),
        E
    }
    const p = j()
      , h = ge()
      , m = Kh(e);
    m.end = new Proxy(m.end,{
        apply(E, k, N) {
            if (l && l(m),
            k instanceof yt)
                return;
            const [w,...I] = N
              , F = w || me()
              , v = Yt(F)
              , R = rs(m).filter(D => D !== m);
            if (!R.length)
                return S(v),
                Reflect.apply(E, k, [v, ...I]);
            const A = R.map(D => z(D).timestamp).filter(D => !!D)
              , U = A.length ? Math.max(...A) : void 0
              , O = z(m).start_timestamp
              , X = Math.min(O ? O + u / 1e3 : 1 / 0, Math.max(O || -1 / 0, Math.min(v, U || 1 / 0)));
            return S(X),
            Reflect.apply(E, k, [X, ...I])
        }
    });
    function _() {
        s && (clearTimeout(s),
        s = void 0)
    }
    function g(E) {
        _(),
        s = setTimeout( () => {
            !r && n.size === 0 && i && (o = Vh,
            m.end(E))
        }
        , c)
    }
    function b(E) {
        s = setTimeout( () => {
            !r && i && (o = Gh,
            m.end(E))
        }
        , d)
    }
    function T(E) {
        _(),
        n.set(E, !0);
        const k = me();
        b(k + d / 1e3)
    }
    function C(E) {
        if (n.has(E) && n.delete(E),
        n.size === 0) {
            const k = me();
            g(k + c / 1e3)
        }
    }
    function S(E) {
        r = !0,
        n.clear(),
        a.forEach(v => v()),
        Zt(p, h);
        const k = z(m)
          , {start_timestamp: N} = k;
        if (!N)
            return;
        k.data[vs] || m.setAttribute(vs, o),
        y.log(`[Tracing] Idle span "${k.op}" finished`);
        const I = rs(m).filter(v => v !== m);
        let F = 0;
        I.forEach(v => {
            v.isRecording() && (v.setStatus({
                code: pe,
                message: "cancelled"
            }),
            v.end(E),
            x && y.log("[Tracing] Cancelling span since span ended early", JSON.stringify(v, void 0, 2)));
            const R = z(v)
              , {timestamp: A=0, start_timestamp: U=0} = R
              , O = U <= E
              , X = (u + c) / 1e3
              , D = A - U <= X;
            if (x) {
                const K = JSON.stringify(v, void 0, 2);
                O ? D || y.log("[Tracing] Discarding span since it finished after idle span final timeout", K) : y.log("[Tracing] Discarding span since it happened after idle span was finished", K)
            }
            (!D || !O) && (mh(m, v),
            F++)
        }
        ),
        F > 0 && m.setAttribute("sentry.idle_span_discarded_spans", F)
    }
    return a.push(f.on("spanStart", E => {
        if (r || E === m || z(E).timestamp)
            return;
        rs(m).includes(E) && T(E.spanContext().spanId)
    }
    )),
    a.push(f.on("spanEnd", E => {
        r || C(E.spanContext().spanId)
    }
    )),
    a.push(f.on("idleSpanEnableAutoFinish", E => {
        E === m && (i = !0,
        g(),
        n.size && b())
    }
    )),
    t.disableAutoFinish || g(),
    setTimeout( () => {
        r || (m.setStatus({
            code: pe,
            message: "deadline_exceeded"
        }),
        o = Yh,
        m.end())
    }
    , u),
    m
}
function Kh(e) {
    const t = nt(e);
    return Zt(j(), t),
    x && y.log("[Tracing] Started span is an idle span"),
    t
}
var dt;
(function(e) {
    e[e.PENDING = 0] = "PENDING";
    const n = 1;
    e[e.RESOLVED = n] = "RESOLVED";
    const r = 2;
    e[e.REJECTED = r] = "REJECTED"
}
)(dt || (dt = {}));
function St(e) {
    return new Ft(t => {
        t(e)
    }
    )
}
function Rs(e) {
    return new Ft( (t, n) => {
        n(e)
    }
    )
}
class Ft {
    constructor(t) {
        this._state = dt.PENDING,
        this._handlers = [],
        this._runExecutor(t)
    }
    then(t, n) {
        return new Ft( (r, s) => {
            this._handlers.push([!1, o => {
                if (!t)
                    r(o);
                else
                    try {
                        r(t(o))
                    } catch (i) {
                        s(i)
                    }
            }
            , o => {
                if (!n)
                    s(o);
                else
                    try {
                        r(n(o))
                    } catch (i) {
                        s(i)
                    }
            }
            ]),
            this._executeHandlers()
        }
        )
    }
    catch(t) {
        return this.then(n => n, t)
    }
    finally(t) {
        return new Ft( (n, r) => {
            let s, o;
            return this.then(i => {
                o = !1,
                s = i,
                t && t()
            }
            , i => {
                o = !0,
                s = i,
                t && t()
            }
            ).then( () => {
                if (o) {
                    r(s);
                    return
                }
                n(s)
            }
            )
        }
        )
    }
    _executeHandlers() {
        if (this._state === dt.PENDING)
            return;
        const t = this._handlers.slice();
        this._handlers = [],
        t.forEach(n => {
            n[0] || (this._state === dt.RESOLVED && n[1](this._value),
            this._state === dt.REJECTED && n[2](this._value),
            n[0] = !0)
        }
        )
    }
    _runExecutor(t) {
        const n = (o, i) => {
            if (this._state === dt.PENDING) {
                if (gr(i)) {
                    i.then(r, s);
                    return
                }
                this._state = o,
                this._value = i,
                this._executeHandlers()
            }
        }
          , r = o => {
            n(dt.RESOLVED, o)
        }
          , s = o => {
            n(dt.REJECTED, o)
        }
        ;
        try {
            t(r, s)
        } catch (o) {
            s(o)
        }
    }
}
function ri(e, t, n, r=0) {
    return new Ft( (s, o) => {
        const i = e[r];
        if (t === null || typeof i != "function")
            s(t);
        else {
            const a = i({
                ...t
            }, n);
            x && i.id && a === null && y.log(`Event processor "${i.id}" dropped event`),
            gr(a) ? a.then(c => ri(e, c, n, r + 1).then(s)).then(null, o) : ri(e, a, n, r + 1).then(s).then(null, o)
        }
    }
    )
}
function Jh(e, t) {
    const {fingerprint: n, span: r, breadcrumbs: s, sdkProcessingMetadata: o} = t;
    Zh(e, t),
    r && tm(e, r),
    nm(e, n),
    Qh(e, s),
    em(e, o)
}
function xs(e, t) {
    const {extra: n, tags: r, user: s, contexts: o, level: i, sdkProcessingMetadata: a, breadcrumbs: c, fingerprint: u, eventProcessors: d, attachments: l, propagationContext: f, transactionName: p, span: h} = t;
    $r(e, "extra", n),
    $r(e, "tags", r),
    $r(e, "user", s),
    $r(e, "contexts", o),
    e.sdkProcessingMetadata = yr(e.sdkProcessingMetadata, a, 2),
    i && (e.level = i),
    p && (e.transactionName = p),
    h && (e.span = h),
    c.length && (e.breadcrumbs = [...e.breadcrumbs, ...c]),
    u.length && (e.fingerprint = [...e.fingerprint, ...u]),
    d.length && (e.eventProcessors = [...e.eventProcessors, ...d]),
    l.length && (e.attachments = [...e.attachments, ...l]),
    e.propagationContext = {
        ...e.propagationContext,
        ...f
    }
}
function $r(e, t, n) {
    e[t] = yr(e[t], n, 1)
}
function Zh(e, t) {
    const {extra: n, tags: r, user: s, contexts: o, level: i, transactionName: a} = t;
    Object.keys(n).length && (e.extra = {
        ...n,
        ...e.extra
    }),
    Object.keys(r).length && (e.tags = {
        ...r,
        ...e.tags
    }),
    Object.keys(s).length && (e.user = {
        ...s,
        ...e.user
    }),
    Object.keys(o).length && (e.contexts = {
        ...o,
        ...e.contexts
    }),
    i && (e.level = i),
    a && e.type !== "transaction" && (e.transaction = a)
}
function Qh(e, t) {
    const n = [...e.breadcrumbs || [], ...t];
    e.breadcrumbs = n.length ? n : void 0
}
function em(e, t) {
    e.sdkProcessingMetadata = {
        ...e.sdkProcessingMetadata,
        ...t
    }
}
function tm(e, t) {
    e.contexts = {
        trace: _l(t),
        ...e.contexts
    },
    e.sdkProcessingMetadata = {
        dynamicSamplingContext: Ze(t),
        ...e.sdkProcessingMetadata
    };
    const n = ye(t)
      , r = z(n).description;
    r && !e.transaction && e.type === "transaction" && (e.transaction = r)
}
function nm(e, t) {
    e.fingerprint = e.fingerprint ? Array.isArray(e.fingerprint) ? e.fingerprint : [e.fingerprint] : [],
    t && (e.fingerprint = e.fingerprint.concat(t)),
    e.fingerprint.length || delete e.fingerprint
}
let Br, Ja, Ur;
function Nl(e) {
    const t = P._sentryDebugIds;
    if (!t)
        return {};
    const n = Object.keys(t);
    return Ur && n.length === Ja || (Ja = n.length,
    Ur = n.reduce( (r, s) => {
        Br || (Br = {});
        const o = Br[s];
        if (o)
            r[o[0]] = o[1];
        else {
            const i = e(s);
            for (let a = i.length - 1; a >= 0; a--) {
                const c = i[a]
                  , u = c == null ? void 0 : c.filename
                  , d = t[s];
                if (u && d) {
                    r[u] = d,
                    Br[s] = [u, d];
                    break
                }
            }
        }
        return r
    }
    , {})),
    Ur
}
function rm(e, t) {
    const n = Nl(e);
    if (!n)
        return [];
    const r = [];
    for (const s of t)
        s && n[s] && r.push({
            type: "sourcemap",
            code_file: s,
            debug_id: n[s]
        });
    return r
}
function Ol(e, t, n, r, s, o) {
    const {normalizeDepth: i=3, normalizeMaxBreadth: a=1e3} = e
      , c = {
        ...t,
        event_id: t.event_id || n.event_id || Ae(),
        timestamp: t.timestamp || _r()
    }
      , u = n.integrations || e.integrations.map(_ => _.name);
    sm(c, e),
    am(c, u),
    s && s.emit("applyFrameMetadata", t),
    t.type === void 0 && om(c, e.stackParser);
    const d = um(r, n.captureContext);
    n.mechanism && Pt(c, n.mechanism);
    const l = s ? s.getEventProcessors() : []
      , f = Xs().getScopeData();
    if (o) {
        const _ = o.getScopeData();
        xs(f, _)
    }
    if (d) {
        const _ = d.getScopeData();
        xs(f, _)
    }
    const p = [...n.attachments || [], ...f.attachments];
    p.length && (n.attachments = p),
    Jh(c, f);
    const h = [...l, ...f.eventProcessors];
    return ri(h, c, n).then(_ => (_ && im(_),
    typeof i == "number" && i > 0 ? cm(_, i, a) : _))
}
function sm(e, t) {
    const {environment: n, release: r, dist: s, maxValueLength: o=250} = t;
    e.environment = e.environment || n || Ks,
    !e.release && r && (e.release = r),
    !e.dist && s && (e.dist = s);
    const i = e.request;
    i != null && i.url && (i.url = Cn(i.url, o))
}
function om(e, t) {
    var r, s;
    const n = Nl(t);
    (s = (r = e.exception) == null ? void 0 : r.values) == null || s.forEach(o => {
        var i, a;
        (a = (i = o.stacktrace) == null ? void 0 : i.frames) == null || a.forEach(c => {
            c.filename && (c.debug_id = n[c.filename])
        }
        )
    }
    )
}
function im(e) {
    var r, s;
    const t = {};
    if ((s = (r = e.exception) == null ? void 0 : r.values) == null || s.forEach(o => {
        var i, a;
        (a = (i = o.stacktrace) == null ? void 0 : i.frames) == null || a.forEach(c => {
            c.debug_id && (c.abs_path ? t[c.abs_path] = c.debug_id : c.filename && (t[c.filename] = c.debug_id),
            delete c.debug_id)
        }
        )
    }
    ),
    Object.keys(t).length === 0)
        return;
    e.debug_meta = e.debug_meta || {},
    e.debug_meta.images = e.debug_meta.images || [];
    const n = e.debug_meta.images;
    Object.entries(t).forEach( ([o,i]) => {
        n.push({
            type: "sourcemap",
            code_file: o,
            debug_id: i
        })
    }
    )
}
function am(e, t) {
    t.length > 0 && (e.sdk = e.sdk || {},
    e.sdk.integrations = [...e.sdk.integrations || [], ...t])
}
function cm(e, t, n) {
    var s, o;
    if (!e)
        return null;
    const r = {
        ...e,
        ...e.breadcrumbs && {
            breadcrumbs: e.breadcrumbs.map(i => ({
                ...i,
                ...i.data && {
                    data: De(i.data, t, n)
                }
            }))
        },
        ...e.user && {
            user: De(e.user, t, n)
        },
        ...e.contexts && {
            contexts: De(e.contexts, t, n)
        },
        ...e.extra && {
            extra: De(e.extra, t, n)
        }
    };
    return (s = e.contexts) != null && s.trace && r.contexts && (r.contexts.trace = e.contexts.trace,
    e.contexts.trace.data && (r.contexts.trace.data = De(e.contexts.trace.data, t, n))),
    e.spans && (r.spans = e.spans.map(i => ({
        ...i,
        ...i.data && {
            data: De(i.data, t, n)
        }
    }))),
    (o = e.contexts) != null && o.flags && r.contexts && (r.contexts.flags = De(e.contexts.flags, 3, n)),
    r
}
function um(e, t) {
    if (!t)
        return e;
    const n = e ? e.clone() : new ot;
    return n.update(t),
    n
}
function lm(e) {
    if (e)
        return dm(e) ? {
            captureContext: e
        } : pm(e) ? {
            captureContext: e
        } : e
}
function dm(e) {
    return e instanceof ot || typeof e == "function"
}
const fm = ["user", "level", "extra", "contexts", "tags", "fingerprint", "propagationContext"];
function pm(e) {
    return Object.keys(e).some(t => fm.includes(t))
}
function tn(e, t) {
    return j().captureException(e, lm(t))
}
function si(e, t) {
    const n = typeof t == "string" ? t : void 0
      , r = typeof t != "string" ? {
        captureContext: t
    } : void 0;
    return j().captureMessage(e, n, r)
}
function Js(e, t) {
    return j().captureEvent(e, t)
}
function Ll(e, t) {
    we().setContext(e, t)
}
function A1(e) {
    we().setExtras(e)
}
function N1(e, t) {
    we().setExtra(e, t)
}
function O1(e) {
    we().setTags(e)
}
function L1(e, t) {
    we().setTag(e, t)
}
function P1(e) {
    we().setUser(e)
}
function hm() {
    return we().lastEventId()
}
async function D1(e) {
    const t = M();
    return t ? t.flush(e) : (x && y.warn("Cannot flush events. No client defined."),
    Promise.resolve(!1))
}
async function F1(e) {
    const t = M();
    return t ? t.close(e) : (x && y.warn("Cannot flush events and disable SDK. No client defined."),
    Promise.resolve(!1))
}
function $1() {
    return !!M()
}
function mm() {
    const e = M();
    return (e == null ? void 0 : e.getOptions().enabled) !== !1 && !!(e != null && e.getTransport())
}
function gm(e) {
    we().addEventProcessor(e)
}
function Za(e) {
    const t = we()
      , n = j()
      , {userAgent: r} = P.navigator || {}
      , s = zp({
        user: n.getUser() || t.getUser(),
        ...r && {
            userAgent: r
        },
        ...e
    })
      , o = t.getSession();
    return (o == null ? void 0 : o.status) === "ok" && Rn(o, {
        status: "exited"
    }),
    Pl(),
    t.setSession(s),
    s
}
function Pl() {
    const e = we()
      , n = j().getSession() || e.getSession();
    n && jp(n),
    Dl(),
    e.setSession()
}
function Dl() {
    const e = we()
      , t = M()
      , n = e.getSession();
    n && t && t.captureSession(n)
}
function Qa(e=!1) {
    if (e) {
        Pl();
        return
    }
    Dl()
}
const _m = "7";
function Fl(e) {
    const t = e.protocol ? `${e.protocol}:` : ""
      , n = e.port ? `:${e.port}` : "";
    return `${t}//${e.host}${n}${e.path ? `/${e.path}` : ""}/api/`
}
function ym(e) {
    return `${Fl(e)}${e.projectId}/envelope/`
}
function Sm(e, t) {
    const n = {
        sentry_version: _m
    };
    return e.publicKey && (n.sentry_key = e.publicKey),
    t && (n.sentry_client = `${t.name}/${t.version}`),
    new URLSearchParams(n).toString()
}
function $l(e, t, n) {
    return t || `${ym(e)}?${Sm(e, n)}`
}
function bm(e, t) {
    const n = wl(e);
    if (!n)
        return "";
    const r = `${Fl(n)}embed/error-page/`;
    let s = `dsn=${on(n)}`;
    for (const o in t)
        if (o !== "dsn" && o !== "onClose")
            if (o === "user") {
                const i = t.user;
                if (!i)
                    continue;
                i.name && (s += `&name=${encodeURIComponent(i.name)}`),
                i.email && (s += `&email=${encodeURIComponent(i.email)}`)
            } else
                s += `&${encodeURIComponent(o)}=${encodeURIComponent(t[o])}`;
    return `${r}?${s}`
}
const ec = [];
function Em(e) {
    const t = {};
    return e.forEach(n => {
        const {name: r} = n
          , s = t[r];
        s && !s.isDefaultInstance && n.isDefaultInstance || (t[r] = n)
    }
    ),
    Object.values(t)
}
function vm(e) {
    const t = e.defaultIntegrations || []
      , n = e.integrations;
    t.forEach(s => {
        s.isDefaultInstance = !0
    }
    );
    let r;
    if (Array.isArray(n))
        r = [...t, ...n];
    else if (typeof n == "function") {
        const s = n(t);
        r = Array.isArray(s) ? s : [s]
    } else
        r = t;
    return Em(r)
}
function wm(e, t) {
    const n = {};
    return t.forEach(r => {
        r && Bl(e, r, n)
    }
    ),
    n
}
function tc(e, t) {
    for (const n of t)
        n != null && n.afterAllSetup && n.afterAllSetup(e)
}
function Bl(e, t, n) {
    if (n[t.name]) {
        x && y.log(`Integration skipped because it was already installed: ${t.name}`);
        return
    }
    if (n[t.name] = t,
    ec.indexOf(t.name) === -1 && typeof t.setupOnce == "function" && (t.setupOnce(),
    ec.push(t.name)),
    t.setup && typeof t.setup == "function" && t.setup(e),
    typeof t.preprocessEvent == "function") {
        const r = t.preprocessEvent.bind(t);
        e.on("preprocessEvent", (s, o) => r(s, o, e))
    }
    if (typeof t.processEvent == "function") {
        const r = t.processEvent.bind(t)
          , s = Object.assign( (o, i) => r(o, i, e), {
            id: t.name
        });
        e.addEventProcessor(s)
    }
    x && y.log(`Integration installed: ${t.name}`)
}
function nc(e) {
    const t = M();
    if (!t) {
        x && y.warn(`Cannot add integration "${e.name}" because no SDK Client is available.`);
        return
    }
    t.addIntegration(e)
}
function Tm(e, t, n) {
    const r = [{
        type: "client_report"
    }, {
        timestamp: _r(),
        discarded_events: e
    }];
    return wt(t ? {
        dsn: t
    } : {}, [r])
}
function Ul(e) {
    const t = [];
    e.message && t.push(e.message);
    try {
        const n = e.exception.values[e.exception.values.length - 1];
        n != null && n.value && (t.push(n.value),
        n.type && t.push(`${n.type}: ${n.value}`))
    } catch {}
    return t
}
function Im(e) {
    var c;
    const {trace_id: t, parent_span_id: n, span_id: r, status: s, origin: o, data: i, op: a} = ((c = e.contexts) == null ? void 0 : c.trace) ?? {};
    return {
        data: i ?? {},
        description: e.transaction,
        op: a,
        parent_span_id: n,
        span_id: r ?? "",
        start_timestamp: e.start_timestamp ?? 0,
        status: s,
        timestamp: e.timestamp,
        trace_id: t ?? "",
        origin: o,
        profile_id: i == null ? void 0 : i[Fi],
        exclusive_time: i == null ? void 0 : i[Gn],
        measurements: e.measurements,
        is_segment: !0
    }
}
function km(e) {
    return {
        type: "transaction",
        timestamp: e.timestamp,
        start_timestamp: e.start_timestamp,
        transaction: e.description,
        contexts: {
            trace: {
                trace_id: e.trace_id,
                span_id: e.span_id,
                parent_span_id: e.parent_span_id,
                op: e.op,
                status: e.status,
                origin: e.origin,
                data: {
                    ...e.data,
                    ...e.profile_id && {
                        [Fi]: e.profile_id
                    },
                    ...e.exclusive_time && {
                        [Gn]: e.exclusive_time
                    }
                }
            }
        },
        measurements: e.measurements
    }
}
const rc = "Not capturing exception because it's already been captured."
  , sc = "Discarded session because of missing or non-string release"
  , Hl = Symbol.for("SentryInternalError")
  , Wl = Symbol.for("SentryDoNotSendEventError");
function is(e) {
    return {
        message: e,
        [Hl]: !0
    }
}
function To(e) {
    return {
        message: e,
        [Wl]: !0
    }
}
function oc(e) {
    return !!e && typeof e == "object" && Hl in e
}
function ic(e) {
    return !!e && typeof e == "object" && Wl in e
}
class Cm {
    constructor(t) {
        if (this._options = t,
        this._integrations = {},
        this._numProcessing = 0,
        this._outcomes = {},
        this._hooks = {},
        this._eventProcessors = [],
        t.dsn ? this._dsn = wl(t.dsn) : x && y.warn("No DSN provided, client will not send events."),
        this._dsn) {
            const n = $l(this._dsn, t.tunnel, t._metadata ? t._metadata.sdk : void 0);
            this._transport = t.transport({
                tunnel: this._options.tunnel,
                recordDroppedEvent: this.recordDroppedEvent.bind(this),
                ...t.transportOptions,
                url: n
            })
        }
    }
    captureException(t, n, r) {
        const s = Ae();
        if ($a(t))
            return x && y.log(rc),
            s;
        const o = {
            event_id: s,
            ...n
        };
        return this._process(this.eventFromException(t, o).then(i => this._captureEvent(i, o, r))),
        o.event_id
    }
    captureMessage(t, n, r, s) {
        const o = {
            event_id: Ae(),
            ...r
        }
          , i = Vs(t) ? t : String(t)
          , a = kn(t) ? this.eventFromMessage(i, n, o) : this.eventFromException(t, o);
        return this._process(a.then(c => this._captureEvent(c, o, s))),
        o.event_id
    }
    captureEvent(t, n, r) {
        const s = Ae();
        if (n != null && n.originalException && $a(n.originalException))
            return x && y.log(rc),
            s;
        const o = {
            event_id: s,
            ...n
        }
          , i = t.sdkProcessingMetadata || {}
          , a = i.capturedSpanScope
          , c = i.capturedSpanIsolationScope;
        return this._process(this._captureEvent(t, o, a || r, c)),
        o.event_id
    }
    captureSession(t) {
        this.sendSession(t),
        Rn(t, {
            init: !1
        })
    }
    getDsn() {
        return this._dsn
    }
    getOptions() {
        return this._options
    }
    getSdkMetadata() {
        return this._options._metadata
    }
    getTransport() {
        return this._transport
    }
    flush(t) {
        const n = this._transport;
        return n ? (this.emit("flush"),
        this._isClientDoneProcessing(t).then(r => n.flush(t).then(s => r && s))) : St(!0)
    }
    close(t) {
        return this.flush(t).then(n => (this.getOptions().enabled = !1,
        this.emit("close"),
        n))
    }
    getEventProcessors() {
        return this._eventProcessors
    }
    addEventProcessor(t) {
        this._eventProcessors.push(t)
    }
    init() {
        (this._isEnabled() || this._options.integrations.some( ({name: t}) => t.startsWith("Spotlight"))) && this._setupIntegrations()
    }
    getIntegrationByName(t) {
        return this._integrations[t]
    }
    addIntegration(t) {
        const n = this._integrations[t.name];
        Bl(this, t, this._integrations),
        n || tc(this, [t])
    }
    sendEvent(t, n={}) {
        this.emit("beforeSendEvent", t, n);
        let r = Uh(t, this._dsn, this._options._metadata, this._options.tunnel);
        for (const o of n.attachments || [])
            r = Ah(r, Dh(o));
        const s = this.sendEnvelope(r);
        s && s.then(o => this.emit("afterSendEvent", t, o), null)
    }
    sendSession(t) {
        const {release: n, environment: r=Ks} = this._options;
        if ("aggregates"in t) {
            const o = t.attrs || {};
            if (!o.release && !n) {
                x && y.warn(sc);
                return
            }
            o.release = o.release || n,
            o.environment = o.environment || r,
            t.attrs = o
        } else {
            if (!t.release && !n) {
                x && y.warn(sc);
                return
            }
            t.release = t.release || n,
            t.environment = t.environment || r
        }
        this.emit("beforeSendSession", t);
        const s = Bh(t, this._dsn, this._options._metadata, this._options.tunnel);
        this.sendEnvelope(s)
    }
    recordDroppedEvent(t, n, r=1) {
        if (this._options.sendClientReports) {
            const s = `${t}:${n}`;
            x && y.log(`Recording outcome: "${s}"${r > 1 ? ` (${r} times)` : ""}`),
            this._outcomes[s] = (this._outcomes[s] || 0) + r
        }
    }
    on(t, n) {
        const r = this._hooks[t] = this._hooks[t] || [];
        return r.push(n),
        () => {
            const s = r.indexOf(n);
            s > -1 && r.splice(s, 1)
        }
    }
    emit(t, ...n) {
        const r = this._hooks[t];
        r && r.forEach(s => s(...n))
    }
    sendEnvelope(t) {
        return this.emit("beforeEnvelope", t),
        this._isEnabled() && this._transport ? this._transport.send(t).then(null, n => (x && y.error("Error while sending envelope:", n),
        n)) : (x && y.error("Transport disabled"),
        St({}))
    }
    _setupIntegrations() {
        const {integrations: t} = this._options;
        this._integrations = wm(this, t),
        tc(this, t)
    }
    _updateSessionFromEvent(t, n) {
        var c;
        let r = n.level === "fatal"
          , s = !1;
        const o = (c = n.exception) == null ? void 0 : c.values;
        if (o) {
            s = !0;
            for (const u of o) {
                const d = u.mechanism;
                if ((d == null ? void 0 : d.handled) === !1) {
                    r = !0;
                    break
                }
            }
        }
        const i = t.status === "ok";
        (i && t.errors === 0 || i && r) && (Rn(t, {
            ...r && {
                status: "crashed"
            },
            errors: t.errors || Number(s || r)
        }),
        this.captureSession(t))
    }
    _isClientDoneProcessing(t) {
        return new Ft(n => {
            let r = 0;
            const s = 1
              , o = setInterval( () => {
                this._numProcessing == 0 ? (clearInterval(o),
                n(!0)) : (r += s,
                t && r >= t && (clearInterval(o),
                n(!1)))
            }
            , s)
        }
        )
    }
    _isEnabled() {
        return this.getOptions().enabled !== !1 && this._transport !== void 0
    }
    _prepareEvent(t, n, r, s) {
        const o = this.getOptions()
          , i = Object.keys(this._integrations);
        return !n.integrations && (i != null && i.length) && (n.integrations = i),
        this.emit("preprocessEvent", t, n),
        t.type || s.setLastEventId(t.event_id || n.event_id),
        Ol(o, t, n, r, this, s).then(a => {
            if (a === null)
                return a;
            this.emit("postprocessEvent", a, n),
            a.contexts = {
                trace: al(r),
                ...a.contexts
            };
            const c = Hi(this, r);
            return a.sdkProcessingMetadata = {
                dynamicSamplingContext: c,
                ...a.sdkProcessingMetadata
            },
            a
        }
        )
    }
    _captureEvent(t, n={}, r=j(), s=we()) {
        return x && oi(t) && y.log(`Captured error event \`${Ul(t)[0] || "<unknown>"}\``),
        this._processEvent(t, n, r, s).then(o => o.event_id, o => {
            x && (ic(o) ? y.log(o.message) : oc(o) ? y.warn(o.message) : y.warn(o))
        }
        )
    }
    _processEvent(t, n, r, s) {
        const o = this.getOptions()
          , {sampleRate: i} = o
          , a = zl(t)
          , c = oi(t)
          , u = t.type || "error"
          , d = `before send for type \`${u}\``
          , l = typeof i > "u" ? void 0 : Qt(i);
        if (c && typeof l == "number" && Math.random() > l)
            return this.recordDroppedEvent("sample_rate", "error"),
            Rs(To(`Discarding event because it's not included in the random sample (sampling rate = ${i})`));
        const f = u === "replay_event" ? "replay" : u;
        return this._prepareEvent(t, n, r, s).then(p => {
            if (p === null)
                throw this.recordDroppedEvent("event_processor", f),
                To("An event processor returned `null`, will not send event.");
            if (n.data && n.data.__sentry__ === !0)
                return p;
            const m = xm(this, o, p, n);
            return Rm(m, d)
        }
        ).then(p => {
            var _;
            if (p === null) {
                if (this.recordDroppedEvent("before_send", f),
                a) {
                    const b = 1 + (t.spans || []).length;
                    this.recordDroppedEvent("before_send", "span", b)
                }
                throw To(`${d} returned \`null\`, will not send event.`)
            }
            const h = r.getSession() || s.getSession();
            if (c && h && this._updateSessionFromEvent(h, p),
            a) {
                const g = ((_ = p.sdkProcessingMetadata) == null ? void 0 : _.spanCountBeforeProcessing) || 0
                  , b = p.spans ? p.spans.length : 0
                  , T = g - b;
                T > 0 && this.recordDroppedEvent("before_send", "span", T)
            }
            const m = p.transaction_info;
            if (a && m && p.transaction !== t.transaction) {
                const g = "custom";
                p.transaction_info = {
                    ...m,
                    source: g
                }
            }
            return this.sendEvent(p, n),
            p
        }
        ).then(null, p => {
            throw ic(p) || oc(p) ? p : (this.captureException(p, {
                data: {
                    __sentry__: !0
                },
                originalException: p
            }),
            is(`Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ${p}`))
        }
        )
    }
    _process(t) {
        this._numProcessing++,
        t.then(n => (this._numProcessing--,
        n), n => (this._numProcessing--,
        n))
    }
    _clearOutcomes() {
        const t = this._outcomes;
        return this._outcomes = {},
        Object.entries(t).map( ([n,r]) => {
            const [s,o] = n.split(":");
            return {
                reason: s,
                category: o,
                quantity: r
            }
        }
        )
    }
    _flushOutcomes() {
        x && y.log("Flushing outcomes...");
        const t = this._clearOutcomes();
        if (t.length === 0) {
            x && y.log("No outcomes to send");
            return
        }
        if (!this._dsn) {
            x && y.log("No dsn provided, will not send outcomes");
            return
        }
        x && y.log("Sending outcomes:", t);
        const n = Tm(t, this._options.tunnel && on(this._dsn));
        this.sendEnvelope(n)
    }
}
function Rm(e, t) {
    const n = `${t} must return \`null\` or a valid event.`;
    if (gr(e))
        return e.then(r => {
            if (!Jt(r) && r !== null)
                throw is(n);
            return r
        }
        , r => {
            throw is(`${t} rejected with ${r}`)
        }
        );
    if (!Jt(e) && e !== null)
        throw is(n);
    return e
}
function xm(e, t, n, r) {
    const {beforeSend: s, beforeSendTransaction: o, beforeSendSpan: i} = t;
    let a = n;
    if (oi(a) && s)
        return s(a, r);
    if (zl(a)) {
        if (i) {
            const c = i(Im(a));
            if (c ? a = yr(n, km(c)) : ei(),
            a.spans) {
                const u = [];
                for (const d of a.spans) {
                    const l = i(d);
                    l ? u.push(l) : (ei(),
                    u.push(d))
                }
                a.spans = u
            }
        }
        if (o) {
            if (a.spans) {
                const c = a.spans.length;
                a.sdkProcessingMetadata = {
                    ...n.sdkProcessingMetadata,
                    spanCountBeforeProcessing: c
                }
            }
            return o(a, r)
        }
    }
    return a
}
function oi(e) {
    return e.type === void 0
}
function zl(e) {
    return e.type === "transaction"
}
function Mm(e, t) {
    return t ? Be(t, () => {
        const n = ge()
          , r = n ? _l(n) : al(t);
        return [n ? Ze(n) : Hi(e, t), r]
    }
    ) : [void 0, void 0]
}
const Am = {
    trace: 1,
    debug: 5,
    info: 9,
    warn: 13,
    error: 17,
    fatal: 21
};
function Nm(e) {
    return [{
        type: "log",
        item_count: e.length,
        content_type: "application/vnd.sentry.items.log+json"
    }, {
        items: e
    }]
}
function Om(e, t, n, r) {
    const s = {};
    return t != null && t.sdk && (s.sdk = {
        name: t.sdk.name,
        version: t.sdk.version
    }),
    n && r && (s.dsn = on(r)),
    wt(s, [Nm(e)])
}
const Lm = 100;
P._sentryClientToLogBufferMap = new WeakMap;
function Pm(e) {
    switch (typeof e) {
    case "number":
        return Number.isInteger(e) ? {
            value: e,
            type: "integer"
        } : {
            value: e,
            type: "double"
        };
    case "boolean":
        return {
            value: e,
            type: "boolean"
        };
    case "string":
        return {
            value: e,
            type: "string"
        };
    default:
        {
            let t = "";
            try {
                t = JSON.stringify(e) ?? ""
            } catch {}
            return {
                value: t,
                type: "string"
            }
        }
    }
}
function It(e, t, n, r=!0) {
    n && (!e[t] || r) && (e[t] = n)
}
function Dm(e, t) {
    var r, s;
    const n = jl(e);
    n === void 0 ? (r = P._sentryClientToLogBufferMap) == null || r.set(e, [t]) : ((s = P._sentryClientToLogBufferMap) == null || s.set(e, [...n, t]),
    n.length >= Lm && as(e, n))
}
function ii(e, t=M(), n=j(), r=Dm) {
    var w;
    if (!t) {
        x && y.warn("No client available to capture log.");
        return
    }
    const {_experiments: s, release: o, environment: i} = t.getOptions()
      , {enableLogs: a=!1, beforeSendLog: c} = s ?? {};
    if (!a) {
        x && y.warn("logging option not enabled, log will not be captured.");
        return
    }
    const [,u] = Mm(t, n)
      , d = {
        ...e.attributes
    }
      , {user: {id: l, email: f, username: p}} = Fm(n);
    It(d, "user.id", l, !1),
    It(d, "user.email", f, !1),
    It(d, "user.name", p, !1),
    It(d, "sentry.release", o),
    It(d, "sentry.environment", i);
    const {name: h, version: m} = ((w = t.getSdkMetadata()) == null ? void 0 : w.sdk) ?? {};
    It(d, "sentry.sdk.name", h),
    It(d, "sentry.sdk.version", m);
    const _ = e.message;
    if (Vs(_)) {
        const {__sentry_template_string__: I, __sentry_template_values__: F=[]} = _;
        d["sentry.message.template"] = I,
        F.forEach( (v, R) => {
            d[`sentry.message.parameter.${R}`] = v
        }
        )
    }
    const g = ar(n);
    It(d, "sentry.trace.parent_span_id", g == null ? void 0 : g.spanContext().spanId);
    const b = {
        ...e,
        attributes: d
    };
    t.emit("beforeCaptureLog", b);
    const T = c ? c(b) : b;
    if (!T) {
        t.recordDroppedEvent("before_send", "log_item", 1),
        x && y.warn("beforeSendLog returned null, log will not be captured.");
        return
    }
    const {level: C, message: S, attributes: E={}, severityNumber: k} = T
      , N = {
        timestamp: me(),
        level: C,
        body: S,
        trace_id: u == null ? void 0 : u.trace_id,
        severity_number: k ?? Am[C],
        attributes: Object.keys(E).reduce( (I, F) => (I[F] = Pm(E[F]),
        I), {})
    };
    r(t, N),
    t.emit("afterCaptureLog", T)
}
function as(e, t) {
    var o;
    const n = t ?? jl(e) ?? [];
    if (n.length === 0)
        return;
    const r = e.getOptions()
      , s = Om(n, r._metadata, r.tunnel, e.getDsn());
    (o = P._sentryClientToLogBufferMap) == null || o.set(e, []),
    e.emit("flushLogs"),
    e.sendEnvelope(s)
}
function jl(e) {
    var t;
    return (t = P._sentryClientToLogBufferMap) == null ? void 0 : t.get(e)
}
function Fm(e) {
    const t = Xs().getScopeData();
    return xs(t, we().getScopeData()),
    xs(t, e.getScopeData()),
    t
}
function $m(e, t) {
    t.debug === !0 && (x ? y.enable() : nn( () => {
        console.warn("[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.")
    }
    )),
    j().update(t.initialScope);
    const r = new e(t);
    return Bm(r),
    r.init(),
    r
}
function Bm(e) {
    j().setClient(e)
}
const ql = Symbol.for("SentryBufferFullError");
function Um(e) {
    const t = [];
    function n() {
        return e === void 0 || t.length < e
    }
    function r(i) {
        return t.splice(t.indexOf(i), 1)[0] || Promise.resolve(void 0)
    }
    function s(i) {
        if (!n())
            return Rs(ql);
        const a = i();
        return t.indexOf(a) === -1 && t.push(a),
        a.then( () => r(a)).then(null, () => r(a).then(null, () => {}
        )),
        a
    }
    function o(i) {
        return new Ft( (a, c) => {
            let u = t.length;
            if (!u)
                return a(!0);
            const d = setTimeout( () => {
                i && i > 0 && a(!1)
            }
            , i);
            t.forEach(l => {
                St(l).then( () => {
                    --u || (clearTimeout(d),
                    a(!0))
                }
                , c)
            }
            )
        }
        )
    }
    return {
        $: t,
        add: s,
        drain: o
    }
}
const Hm = 60 * 1e3;
function Gl(e, t=Date.now()) {
    const n = parseInt(`${e}`, 10);
    if (!isNaN(n))
        return n * 1e3;
    const r = Date.parse(`${e}`);
    return isNaN(r) ? Hm : r - t
}
function Wm(e, t) {
    return e[t] || e.all || 0
}
function Vl(e, t, n=Date.now()) {
    return Wm(e, t) > n
}
function Yl(e, {statusCode: t, headers: n}, r=Date.now()) {
    const s = {
        ...e
    }
      , o = n == null ? void 0 : n["x-sentry-rate-limits"]
      , i = n == null ? void 0 : n["retry-after"];
    if (o)
        for (const a of o.trim().split(",")) {
            const [c,u,,,d] = a.split(":", 5)
              , l = parseInt(c, 10)
              , f = (isNaN(l) ? 60 : l) * 1e3;
            if (!u)
                s.all = r + f;
            else
                for (const p of u.split(";"))
                    p === "metric_bucket" ? (!d || d.split(";").includes("custom")) && (s[p] = r + f) : s[p] = r + f
        }
    else
        i ? s.all = r + Gl(i, r) : t === 429 && (s.all = r + 60 * 1e3);
    return s
}
const zm = 64;
function jm(e, t, n=Um(e.bufferSize || zm)) {
    let r = {};
    const s = i => n.drain(i);
    function o(i) {
        const a = [];
        if (en(i, (l, f) => {
            const p = qa(f);
            Vl(r, p) ? e.recordDroppedEvent("ratelimit_backoff", p) : a.push(l)
        }
        ),
        a.length === 0)
            return St({});
        const c = wt(i[0], a)
          , u = l => {
            en(c, (f, p) => {
                e.recordDroppedEvent(l, qa(p))
            }
            )
        }
          , d = () => t({
            body: ks(c)
        }).then(l => (l.statusCode !== void 0 && (l.statusCode < 200 || l.statusCode >= 300) && x && y.warn(`Sentry responded with status code ${l.statusCode} to sent event.`),
        r = Yl(r, l),
        l), l => {
            throw u("network_error"),
            x && y.error("Encountered error running transport request:", l),
            l
        }
        );
        return n.add(d).then(l => l, l => {
            if (l === ql)
                return x && y.error("Skipped sending event because buffer is full."),
                u("queue_overflow"),
                St({});
            throw l
        }
        )
    }
    return {
        send: o,
        flush: s
    }
}
const Io = 100
  , ko = 5e3
  , qm = 36e5;
function Gm(e) {
    function t(...n) {
        x && y.info("[Offline]:", ...n)
    }
    return n => {
        const r = e(n);
        if (!n.createStore)
            throw new Error("No `createStore` function was provided");
        const s = n.createStore(n);
        let o = ko, i;
        function a(l, f, p) {
            return ja(l, ["client_report"]) ? !1 : n.shouldStore ? n.shouldStore(l, f, p) : !0
        }
        function c(l) {
            i && clearTimeout(i),
            i = setTimeout(async () => {
                i = void 0;
                const f = await s.shift();
                f && (t("Attempting to send previously queued event"),
                f[0].sent_at = new Date().toISOString(),
                d(f, !0).catch(p => {
                    t("Failed to retry sending", p)
                }
                ))
            }
            , l),
            typeof i != "number" && i.unref && i.unref()
        }
        function u() {
            i || (c(o),
            o = Math.min(o * 2, qm))
        }
        async function d(l, f=!1) {
            var p, h;
            if (!f && ja(l, ["replay_event", "replay_recording"]))
                return await s.push(l),
                c(Io),
                {};
            try {
                if (n.shouldSend && await n.shouldSend(l) === !1)
                    throw new Error("Envelope not sent because `shouldSend` callback returned false");
                const m = await r.send(l);
                let _ = Io;
                if (m) {
                    if ((p = m.headers) != null && p["retry-after"])
                        _ = Gl(m.headers["retry-after"]);
                    else if ((h = m.headers) != null && h["x-sentry-rate-limits"])
                        _ = 6e4;
                    else if ((m.statusCode || 0) >= 400)
                        return m
                }
                return c(_),
                o = ko,
                m
            } catch (m) {
                if (await a(l, m, o))
                    return f ? await s.unshift(l) : await s.push(l),
                    u(),
                    t("Error sending. Event queued.", m),
                    {};
                throw m
            }
        }
        return n.flushAtStartup && u(),
        {
            send: d,
            flush: l => (l === void 0 && (o = ko,
            c(Io)),
            r.flush(l))
        }
    }
}
function Xl(e, t) {
    let n;
    return en(e, (r, s) => (t.includes(s) && (n = Array.isArray(r) ? r[1] : void 0),
    !!n)),
    n
}
function Vm(e, t) {
    return n => {
        const r = e(n);
        return {
            ...r,
            send: async s => {
                const o = Xl(s, ["event", "transaction", "profile", "replay_event"]);
                return o && (o.release = t),
                r.send(s)
            }
        }
    }
}
function Ym(e, t) {
    return wt(t ? {
        ...e[0],
        dsn: t
    } : e[0], e[1])
}
function B1(e, t) {
    return n => {
        const r = e(n)
          , s = new Map;
        function o(c, u) {
            const d = u ? `${c}:${u}` : c;
            let l = s.get(d);
            if (!l) {
                const f = El(c);
                if (!f)
                    return;
                const p = $l(f, n.tunnel);
                l = u ? Vm(e, u)({
                    ...n,
                    url: p
                }) : e({
                    ...n,
                    url: p
                }),
                s.set(d, l)
            }
            return [c, l]
        }
        async function i(c) {
            function u(p) {
                const h = p != null && p.length ? p : ["event"];
                return Xl(c, h)
            }
            const d = t({
                envelope: c,
                getEvent: u
            }).map(p => typeof p == "string" ? o(p, void 0) : o(p.dsn, p.release)).filter(p => !!p)
              , l = d.length ? d : [["", r]];
            return (await Promise.all(l.map( ([p,h]) => h.send(Ym(c, p)))))[0]
        }
        async function a(c) {
            const u = [...s.values(), r];
            return (await Promise.all(u.map(l => l.flush(c)))).every(l => l)
        }
        return {
            send: i,
            flush: a
        }
    }
}
function Kl(e, t) {
    const n = t == null ? void 0 : t.getDsn()
      , r = t == null ? void 0 : t.getOptions().tunnel;
    return Km(e, n) || Xm(e, r)
}
function Xm(e, t) {
    return t ? ac(e) === ac(t) : !1
}
function Km(e, t) {
    return t ? e.includes(t.host) : !1
}
function ac(e) {
    return e[e.length - 1] === "/" ? e.slice(0, -1) : e
}
function Jm(e, ...t) {
    const n = new String(String.raw(e, ...t));
    return n.__sentry_template_string__ = e.join("\0").replace(/%/g, "%%").replace(/\0/g, "%s"),
    n.__sentry_template_values__ = t,
    n
}
const Zm = Jm;
function Qm(e) {
    var t;
    ((t = e.user) == null ? void 0 : t.ip_address) === void 0 && (e.user = {
        ...e.user,
        ip_address: "{{auto}}"
    })
}
function eg(e) {
    var t;
    "aggregates"in e ? ((t = e.attrs) == null ? void 0 : t.ip_address) === void 0 && (e.attrs = {
        ...e.attrs,
        ip_address: "{{auto}}"
    }) : e.ipAddress === void 0 && (e.ipAddress = "{{auto}}")
}
function Jl(e, t, n=[t], r="npm") {
    const s = e._metadata || {};
    s.sdk || (s.sdk = {
        name: `sentry.javascript.${t}`,
        packages: n.map(o => ({
            name: `${r}:@sentry/${o}`,
            version: Mt
        })),
        version: Mt
    }),
    e._metadata = s
}
function Zl(e={}) {
    const t = e.client || M();
    if (!mm() || !t)
        return {};
    const n = vt()
      , r = Ut(n);
    if (r.getTraceData)
        return r.getTraceData(e);
    const s = e.scope || j()
      , o = e.span || ge()
      , i = o ? fh(o) : tg(s)
      , a = o ? Ze(o) : Hi(t, s)
      , c = fl(a);
    return pl.test(i) ? {
        "sentry-trace": i,
        baggage: c
    } : (y.warn("Invalid sentry-trace data. Cannot generate trace data"),
    {})
}
function tg(e) {
    const {traceId: t, sampled: n, propagationSpanId: r} = e.getPropagationContext();
    return ml(t, r, n)
}
function ng(e, t, n) {
    let r, s, o;
    const i = n != null && n.maxWait ? Math.max(n.maxWait, t) : 0
      , a = (n == null ? void 0 : n.setTimeoutImpl) || setTimeout;
    function c() {
        return u(),
        r = e(),
        r
    }
    function u() {
        s !== void 0 && clearTimeout(s),
        o !== void 0 && clearTimeout(o),
        s = o = void 0
    }
    function d() {
        return s !== void 0 || o !== void 0 ? c() : r
    }
    function l() {
        return s && clearTimeout(s),
        s = a(c, t),
        i && o === void 0 && (o = a(c, i)),
        r
    }
    return l.cancel = u,
    l.flush = d,
    l
}
const rg = 100;
function it(e, t) {
    const n = M()
      , r = we();
    if (!n)
        return;
    const {beforeBreadcrumb: s=null, maxBreadcrumbs: o=rg} = n.getOptions();
    if (o <= 0)
        return;
    const a = {
        timestamp: _r(),
        ...e
    }
      , c = s ? nn( () => s(a, t)) : a;
    c !== null && (n.emit && n.emit("beforeAddBreadcrumb", c, t),
    r.addBreadcrumb(c, o))
}
let cc;
const sg = "FunctionToString"
  , uc = new WeakMap
  , og = () => ({
    name: sg,
    setupOnce() {
        cc = Function.prototype.toString;
        try {
            Function.prototype.toString = function(...e) {
                const t = Pi(this)
                  , n = uc.has(M()) && t !== void 0 ? t : this;
                return cc.apply(n, e)
            }
        } catch {}
    },
    setup(e) {
        uc.set(e, !0)
    }
})
  , ig = og
  , ag = [/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/, /^ResizeObserver loop completed with undelivered notifications.$/, /^Cannot redefine property: googletag$/, /^Can't find variable: gmo$/, /^undefined is not an object \(evaluating 'a\.[A-Z]'\)$/, `can't redefine non-configurable property "solana"`, "vv().getRestrictions is not a function. (In 'vv().getRestrictions(1,a)', 'vv().getRestrictions' is undefined)", "Can't find variable: _AutofillCallbackHandler", /^Non-Error promise rejection captured with value: Object Not Found Matching Id:\d+, MethodName:simulateEvent, ParamCount:\d+$/, /^Java exception was raised during method invocation$/]
  , cg = "EventFilters"
  , ug = (e={}) => {
    let t;
    return {
        name: cg,
        setup(n) {
            const r = n.getOptions();
            t = lc(e, r)
        },
        processEvent(n, r, s) {
            if (!t) {
                const o = s.getOptions();
                t = lc(e, o)
            }
            return dg(n, t) ? null : n
        }
    }
}
  , lg = (e={}) => ({
    ...ug(e),
    name: "InboundFilters"
});
function lc(e={}, t={}) {
    return {
        allowUrls: [...e.allowUrls || [], ...t.allowUrls || []],
        denyUrls: [...e.denyUrls || [], ...t.denyUrls || []],
        ignoreErrors: [...e.ignoreErrors || [], ...t.ignoreErrors || [], ...e.disableErrorDefaults ? [] : ag],
        ignoreTransactions: [...e.ignoreTransactions || [], ...t.ignoreTransactions || []]
    }
}
function dg(e, t) {
    if (e.type) {
        if (e.type === "transaction" && pg(e, t.ignoreTransactions))
            return x && y.warn(`Event dropped due to being matched by \`ignoreTransactions\` option.
Event: ${zt(e)}`),
            !0
    } else {
        if (fg(e, t.ignoreErrors))
            return x && y.warn(`Event dropped due to being matched by \`ignoreErrors\` option.
Event: ${zt(e)}`),
            !0;
        if (_g(e))
            return x && y.warn(`Event dropped due to not having an error message, error type or stacktrace.
Event: ${zt(e)}`),
            !0;
        if (hg(e, t.denyUrls))
            return x && y.warn(`Event dropped due to being matched by \`denyUrls\` option.
Event: ${zt(e)}.
Url: ${Ms(e)}`),
            !0;
        if (!mg(e, t.allowUrls))
            return x && y.warn(`Event dropped due to not being matched by \`allowUrls\` option.
Event: ${zt(e)}.
Url: ${Ms(e)}`),
            !0
    }
    return !1
}
function fg(e, t) {
    return t != null && t.length ? Ul(e).some(n => Je(n, t)) : !1
}
function pg(e, t) {
    if (!(t != null && t.length))
        return !1;
    const n = e.transaction;
    return n ? Je(n, t) : !1
}
function hg(e, t) {
    if (!(t != null && t.length))
        return !1;
    const n = Ms(e);
    return n ? Je(n, t) : !1
}
function mg(e, t) {
    if (!(t != null && t.length))
        return !0;
    const n = Ms(e);
    return n ? Je(n, t) : !0
}
function gg(e=[]) {
    for (let t = e.length - 1; t >= 0; t--) {
        const n = e[t];
        if (n && n.filename !== "<anonymous>" && n.filename !== "[native code]")
            return n.filename || null
    }
    return null
}
function Ms(e) {
    var t, n;
    try {
        const r = [...((t = e.exception) == null ? void 0 : t.values) ?? []].reverse().find(o => {
            var i, a, c;
            return ((i = o.mechanism) == null ? void 0 : i.parent_id) === void 0 && ((c = (a = o.stacktrace) == null ? void 0 : a.frames) == null ? void 0 : c.length)
        }
        )
          , s = (n = r == null ? void 0 : r.stacktrace) == null ? void 0 : n.frames;
        return s ? gg(s) : null
    } catch {
        return x && y.error(`Cannot extract url for event ${zt(e)}`),
        null
    }
}
function _g(e) {
    var t, n;
    return (n = (t = e.exception) == null ? void 0 : t.values) != null && n.length ? !e.message && !e.exception.values.some(r => r.stacktrace || r.type && r.type !== "Error" || r.value) : !1
}
function yg(e, t, n, r, s, o) {
    var a;
    if (!((a = s.exception) != null && a.values) || !o || !gt(o.originalException, Error))
        return;
    const i = s.exception.values.length > 0 ? s.exception.values[s.exception.values.length - 1] : void 0;
    i && (s.exception.values = ai(e, t, r, o.originalException, n, s.exception.values, i, 0))
}
function ai(e, t, n, r, s, o, i, a) {
    if (o.length >= n + 1)
        return o;
    let c = [...o];
    if (gt(r[s], Error)) {
        dc(i, a);
        const u = e(t, r[s])
          , d = c.length;
        fc(u, s, d, a),
        c = ai(e, t, n, r[s], s, [u, ...c], u, d)
    }
    return Array.isArray(r.errors) && r.errors.forEach( (u, d) => {
        if (gt(u, Error)) {
            dc(i, a);
            const l = e(t, u)
              , f = c.length;
            fc(l, `errors[${d}]`, f, a),
            c = ai(e, t, n, u, s, [l, ...c], l, f)
        }
    }
    ),
    c
}
function dc(e, t) {
    e.mechanism = e.mechanism || {
        type: "generic",
        handled: !0
    },
    e.mechanism = {
        ...e.mechanism,
        ...e.type === "AggregateError" && {
            is_exception_group: !0
        },
        exception_id: t
    }
}
function fc(e, t, n, r) {
    e.mechanism = e.mechanism || {
        type: "generic",
        handled: !0
    },
    e.mechanism = {
        ...e.mechanism,
        type: "chained",
        source: t,
        exception_id: n,
        parent_id: r
    }
}
const Ql = new Map
  , pc = new Set;
function Sg(e) {
    if (P._sentryModuleMetadata)
        for (const t of Object.keys(P._sentryModuleMetadata)) {
            const n = P._sentryModuleMetadata[t];
            if (pc.has(t))
                continue;
            pc.add(t);
            const r = e(t);
            for (const s of r.reverse())
                if (s.filename) {
                    Ql.set(s.filename, n);
                    break
                }
        }
}
function bg(e, t) {
    return Sg(e),
    Ql.get(t)
}
function ed(e, t) {
    try {
        t.exception.values.forEach(n => {
            if (n.stacktrace)
                for (const r of n.stacktrace.frames || []) {
                    if (!r.filename || r.module_metadata)
                        continue;
                    const s = bg(e, r.filename);
                    s && (r.module_metadata = s)
                }
        }
        )
    } catch {}
}
function td(e) {
    try {
        e.exception.values.forEach(t => {
            if (t.stacktrace)
                for (const n of t.stacktrace.frames || [])
                    delete n.module_metadata
        }
        )
    } catch {}
}
const U1 = () => ({
    name: "ModuleMetadata",
    setup(e) {
        e.on("beforeEnvelope", t => {
            en(t, (n, r) => {
                if (r === "event") {
                    const s = Array.isArray(n) ? n[1] : void 0;
                    s && (td(s),
                    n[1] = s)
                }
            }
            )
        }
        ),
        e.on("applyFrameMetadata", t => {
            if (t.type)
                return;
            const n = e.getOptions().stackParser;
            ed(n, t)
        }
        )
    }
});
function Vi(e) {
    const t = "console";
    $t(t, e),
    Bt(t, Eg)
}
function Eg() {
    
}
function Yi(e) {
    return e === "warn" ? "warning" : ["fatal", "error", "warning", "log", "info", "debug"].includes(e) ? e : "log"
}
const vg = "CaptureConsole"
  , wg = (e={}) => {
    const t = e.levels || ir
      , n = e.handled ?? !0;
    return {
        name: vg,
        setup(r) {
            "console"in P && Vi( ({args: s, level: o}) => {
                M() !== r || !t.includes(o) || Tg(s, o, n)
            }
            )
        }
    }
}
  , H1 = wg;
function Tg(e, t, n) {
    const r = {
        level: Yi(t),
        extra: {
            arguments: e
        }
    };
    Be(s => {
        if (s.addEventProcessor(a => (a.logger = "console",
        Pt(a, {
            handled: n,
            type: "console"
        }),
        a)),
        t === "assert") {
            if (!e[0]) {
                const a = `Assertion failed: ${Es(e.slice(1), " ") || "console.assert"}`;
                s.setExtra("arguments", e.slice(1)),
                si(a, r)
            }
            return
        }
        const o = e.find(a => a instanceof Error);
        if (o) {
            tn(o, r);
            return
        }
        const i = Es(e, " ");
        si(i, r)
    }
    )
}
const Ig = "Dedupe"
  , kg = () => {
    let e;
    return {
        name: Ig,
        processEvent(t) {
            if (t.type)
                return t;
            try {
                if (Rg(t, e))
                    return x && y.warn("Event dropped due to being a duplicate of previously captured event."),
                    null
            } catch {}
            return e = t
        }
    }
}
  , Cg = kg;
function Rg(e, t) {
    return t ? !!(xg(e, t) || Mg(e, t)) : !1
}
function xg(e, t) {
    const n = e.message
      , r = t.message;
    return !(!n && !r || n && !r || !n && r || n !== r || !rd(e, t) || !nd(e, t))
}
function Mg(e, t) {
    const n = hc(t)
      , r = hc(e);
    return !(!n || !r || n.type !== r.type || n.value !== r.value || !rd(e, t) || !nd(e, t))
}
function nd(e, t) {
    let n = Xo(e)
      , r = Xo(t);
    if (!n && !r)
        return !0;
    if (n && !r || !n && r || (n = n,
    r = r,
    r.length !== n.length))
        return !1;
    for (let s = 0; s < r.length; s++) {
        const o = r[s]
          , i = n[s];
        if (o.filename !== i.filename || o.lineno !== i.lineno || o.colno !== i.colno || o.function !== i.function)
            return !1
    }
    return !0
}
function rd(e, t) {
    let n = e.fingerprint
      , r = t.fingerprint;
    if (!n && !r)
        return !0;
    if (n && !r || !n && r)
        return !1;
    n = n,
    r = r;
    try {
        return n.join("") === r.join("")
    } catch {
        return !1
    }
}
function hc(e) {
    var t;
    return ((t = e.exception) == null ? void 0 : t.values) && e.exception.values[0]
}
const Ag = "ExtraErrorData"
  , Ng = (e={}) => {
    const {depth: t=3, captureErrorCause: n=!0} = e;
    return {
        name: Ag,
        processEvent(r, s, o) {
            const {maxValueLength: i=250} = o.getOptions();
            return Og(r, s, t, n, i)
        }
    }
}
  , W1 = Ng;
function Og(e, t={}, n, r, s) {
    if (!t.originalException || !pt(t.originalException))
        return e;
    const o = t.originalException.name || t.originalException.constructor.name
      , i = Lg(t.originalException, r, s);
    if (i) {
        const a = {
            ...e.contexts
        }
          , c = De(i, n);
        return Jt(c) && (Ne(c, "__sentry_skip_normalization__", !0),
        a[o] = c),
        {
            ...e,
            contexts: a
        }
    }
    return e
}
function Lg(e, t, n) {
    try {
        const r = ["name", "message", "stack", "line", "column", "fileName", "lineNumber", "columnNumber", "toJSON"]
          , s = {};
        for (const o of Object.keys(e)) {
            if (r.indexOf(o) !== -1)
                continue;
            const i = e[o];
            s[o] = pt(i) || typeof i == "string" ? Cn(`${i}`, n) : i
        }
        if (t && e.cause !== void 0 && (s.cause = pt(e.cause) ? e.cause.toString() : e.cause),
        typeof e.toJSON == "function") {
            const o = e.toJSON();
            for (const i of Object.keys(o)) {
                const a = o[i];
                s[i] = pt(a) ? a.toString() : a
            }
        }
        return s
    } catch (r) {
        x && y.error("Unable to extract extra data from the Error object:", r)
    }
    return null
}
function Pg(e, t) {
    let n = 0;
    for (let r = e.length - 1; r >= 0; r--) {
        const s = e[r];
        s === "." ? e.splice(r, 1) : s === ".." ? (e.splice(r, 1),
        n++) : n && (e.splice(r, 1),
        n--)
    }
    if (t)
        for (; n--; n)
            e.unshift("..");
    return e
}
const Dg = /^(\S+:\\|\/?)([\s\S]*?)((?:\.{1,2}|[^/\\]+?|)(\.[^./\\]*|))(?:[/\\]*)$/;
function Fg(e) {
    const t = e.length > 1024 ? `<truncated>${e.slice(-1024)}` : e
      , n = Dg.exec(t);
    return n ? n.slice(1) : []
}
function mc(...e) {
    let t = ""
      , n = !1;
    for (let r = e.length - 1; r >= -1 && !n; r--) {
        const s = r >= 0 ? e[r] : "/";
        s && (t = `${s}/${t}`,
        n = s.charAt(0) === "/")
    }
    return t = Pg(t.split("/").filter(r => !!r), !n).join("/"),
    (n ? "/" : "") + t || "."
}
function gc(e) {
    let t = 0;
    for (; t < e.length && e[t] === ""; t++)
        ;
    let n = e.length - 1;
    for (; n >= 0 && e[n] === ""; n--)
        ;
    return t > n ? [] : e.slice(t, n - t + 1)
}
function $g(e, t) {
    e = mc(e).slice(1),
    t = mc(t).slice(1);
    const n = gc(e.split("/"))
      , r = gc(t.split("/"))
      , s = Math.min(n.length, r.length);
    let o = s;
    for (let a = 0; a < s; a++)
        if (n[a] !== r[a]) {
            o = a;
            break
        }
    let i = [];
    for (let a = o; a < n.length; a++)
        i.push("..");
    return i = i.concat(r.slice(o)),
    i.join("/")
}
function Bg(e, t) {
    return Fg(e)[2] || ""
}
const Ug = "RewriteFrames"
  , z1 = (e={}) => {
    const t = e.root
      , n = e.prefix || "app:///"
      , r = "window"in P && !!P.window
      , s = e.iteratee || Hg({
        isBrowser: r,
        root: t,
        prefix: n
    });
    function o(a) {
        try {
            return {
                ...a,
                exception: {
                    ...a.exception,
                    values: a.exception.values.map(c => ({
                        ...c,
                        ...c.stacktrace && {
                            stacktrace: i(c.stacktrace)
                        }
                    }))
                }
            }
        } catch {
            return a
        }
    }
    function i(a) {
        return {
            ...a,
            frames: (a == null ? void 0 : a.frames) && a.frames.map(c => s(c))
        }
    }
    return {
        name: Ug,
        processEvent(a) {
            let c = a;
            return a.exception && Array.isArray(a.exception.values) && (c = o(c)),
            c
        }
    }
}
;
function Hg({isBrowser: e, root: t, prefix: n}) {
    return r => {
        if (!r.filename)
            return r;
        const s = /^[a-zA-Z]:\\/.test(r.filename) || r.filename.includes("\\") && !r.filename.includes("/")
          , o = /^\//.test(r.filename);
        if (e) {
            if (t) {
                const i = r.filename;
                i.indexOf(t) === 0 && (r.filename = i.replace(t, n))
            }
        } else if (s || o) {
            const i = s ? r.filename.replace(/^[a-zA-Z]:/, "").replace(/\\/g, "/") : r.filename
              , a = t ? $g(t, i) : Bg(i);
            r.filename = `${n}${a}`
        }
        return r
    }
}
const Wg = ["reauthenticate", "signInAnonymously", "signInWithOAuth", "signInWithIdToken", "signInWithOtp", "signInWithPassword", "signInWithSSO", "signOut", "signUp", "verifyOtp"]
  , zg = ["createUser", "deleteUser", "listUsers", "getUserById", "updateUserById", "inviteUserByEmail"]
  , jg = {
    eq: "eq",
    neq: "neq",
    gt: "gt",
    gte: "gte",
    lt: "lt",
    lte: "lte",
    like: "like",
    "like(all)": "likeAllOf",
    "like(any)": "likeAnyOf",
    ilike: "ilike",
    "ilike(all)": "ilikeAllOf",
    "ilike(any)": "ilikeAnyOf",
    is: "is",
    in: "in",
    cs: "contains",
    cd: "containedBy",
    sr: "rangeGt",
    nxl: "rangeGte",
    sl: "rangeLt",
    nxr: "rangeLte",
    adj: "rangeAdjacent",
    ov: "overlaps",
    fts: "",
    plfts: "plain",
    phfts: "phrase",
    wfts: "websearch",
    not: "not"
}
  , sd = ["select", "insert", "upsert", "update", "delete"];
function Zs(e) {
    try {
        e.__SENTRY_INSTRUMENTED__ = !0
    } catch {}
}
function Qs(e) {
    try {
        return e.__SENTRY_INSTRUMENTED__
    } catch {
        return !1
    }
}
function qg(e, t={}) {
    var n;
    switch (e) {
    case "GET":
        return "select";
    case "POST":
        return (n = t.Prefer) != null && n.includes("resolution=") ? "upsert" : "insert";
    case "PATCH":
        return "update";
    case "DELETE":
        return "delete";
    default:
        return "<unknown-op>"
    }
}
function Gg(e, t) {
    if (t === "" || t === "*")
        return "select(*)";
    if (e === "select")
        return `select(${t})`;
    if (e === "or" || e.endsWith(".or"))
        return `${e}${t}`;
    const [n,...r] = t.split(".");
    let s;
    return n != null && n.startsWith("fts") ? s = "textSearch" : n != null && n.startsWith("plfts") ? s = "textSearch[plain]" : n != null && n.startsWith("phfts") ? s = "textSearch[phrase]" : n != null && n.startsWith("wfts") ? s = "textSearch[websearch]" : s = n && jg[n] || "filter",
    `${s}(${e}, ${r.join(".")})`
}
function _c(e, t=!1) {
    return new Proxy(e,{
        apply(n, r, s) {
            return xl({
                name: `auth ${t ? "(admin) " : ""}${e.name}`,
                attributes: {
                    [Y]: "auto.db.supabase",
                    [be]: "db",
                    "db.system": "postgresql",
                    "db.operation": `auth.${t ? "admin." : ""}${e.name}`
                }
            }, o => Reflect.apply(n, r, s).then(i => (i && typeof i == "object" && "error"in i && i.error ? (o.setStatus({
                code: pe
            }),
            tn(i.error, {
                mechanism: {
                    handled: !1
                }
            })) : o.setStatus({
                code: $i
            }),
            o.end(),
            i)).catch(i => {
                throw o.setStatus({
                    code: pe
                }),
                o.end(),
                tn(i, {
                    mechanism: {
                        handled: !1
                    }
                }),
                i
            }
            ).then(...s))
        }
    })
}
function Vg(e) {
    const t = e.auth;
    if (!(!t || Qs(e.auth))) {
        for (const n of Wg) {
            const r = t[n];
            r && typeof e.auth[n] == "function" && (e.auth[n] = _c(r))
        }
        for (const n of zg) {
            const r = t.admin[n];
            r && typeof e.auth.admin[n] == "function" && (e.auth.admin[n] = _c(r, !0))
        }
        Zs(e.auth)
    }
}
function Yg(e) {
    Qs(e.prototype.from) || (e.prototype.from = new Proxy(e.prototype.from,{
        apply(t, n, r) {
            const s = Reflect.apply(t, n, r)
              , o = s.constructor;
            return Kg(o),
            s
        }
    }),
    Zs(e.prototype.from))
}
function Xg(e) {
    Qs(e.prototype.then) || (e.prototype.then = new Proxy(e.prototype.then,{
        apply(t, n, r) {
            var p;
            const s = sd
              , o = n
              , i = qg(o.method, o.headers);
            if (!s.includes(i) || !((p = o == null ? void 0 : o.url) != null && p.pathname) || typeof o.url.pathname != "string")
                return Reflect.apply(t, n, r);
            const a = o.url.pathname.split("/")
              , c = a.length > 0 ? a[a.length - 1] : ""
              , u = [];
            for (const [h,m] of o.url.searchParams.entries())
                u.push(Gg(h, m));
            const d = Object.create(null);
            if (Jt(o.body))
                for (const [h,m] of Object.entries(o.body))
                    d[h] = m;
            const l = `${i === "select" ? "" : `${i}${d ? "(...) " : ""}`}${u.join(" ")} from(${c})`
              , f = {
                "db.table": c,
                "db.schema": o.schema,
                "db.url": o.url.origin,
                "db.sdk": o.headers["X-Client-Info"],
                "db.system": "postgresql",
                "db.operation": i,
                [Y]: "auto.db.supabase",
                [be]: "db"
            };
            return u.length && (f["db.query"] = u),
            Object.keys(d).length && (f["db.body"] = d),
            xl({
                name: l,
                attributes: f
            }, h => Reflect.apply(t, n, []).then(m => {
                if (h && (m && typeof m == "object" && "status"in m && ws(h, m.status || 500),
                h.end()),
                m.error) {
                    const b = new Error(m.error.message);
                    m.error.code && (b.code = m.error.code),
                    m.error.details && (b.details = m.error.details);
                    const T = {};
                    u.length && (T.query = u),
                    Object.keys(d).length && (T.body = d),
                    tn(b, {
                        contexts: {
                            supabase: T
                        }
                    })
                }
                const _ = {
                    type: "supabase",
                    category: `db.${i}`,
                    message: l
                }
                  , g = {};
                return u.length && (g.query = u),
                Object.keys(d).length && (g.body = d),
                Object.keys(g).length && (_.data = g),
                it(_),
                m
            }
            , m => {
                throw h && (ws(h, 500),
                h.end()),
                m
            }
            ).then(...r))
        }
    }),
    Zs(e.prototype.then))
}
function Kg(e) {
    for (const t of sd)
        Qs(e.prototype[t]) || (e.prototype[t] = new Proxy(e.prototype[t],{
            apply(n, r, s) {
                const o = Reflect.apply(n, r, s)
                  , i = o.constructor;
                return x && y.log(`Instrumenting ${t} operation's PostgRESTFilterBuilder`),
                Xg(i),
                o
            }
        }),
        Zs(e.prototype[t]))
}
const Jg = e => {
    if (!e) {
        x && y.warn("Supabase integration was not installed because no Supabase client was provided.");
        return
    }
    const t = e.constructor === Function ? e : e.constructor;
    Yg(t),
    Vg(e)
}
  , Zg = "Supabase"
  , Qg = e => ({
    setupOnce() {
        Jg(e)
    },
    name: Zg
})
  , j1 = e => Qg(e.supabaseClient)
  , e_ = 10
  , t_ = "ZodErrors";
function n_(e) {
    return pt(e) && e.name === "ZodError" && Array.isArray(e.issues)
}
function r_(e) {
    return {
        ...e,
        path: "path"in e && Array.isArray(e.path) ? e.path.join(".") : void 0,
        keys: "keys"in e ? JSON.stringify(e.keys) : void 0,
        unionErrors: "unionErrors"in e ? JSON.stringify(e.unionErrors) : void 0
    }
}
function s_(e) {
    return e.map(t => typeof t == "number" ? "<array>" : t).join(".")
}
function o_(e) {
    const t = new Set;
    for (const r of e.issues) {
        const s = s_(r.path);
        s.length > 0 && t.add(s)
    }
    const n = Array.from(t);
    if (n.length === 0) {
        let r = "variable";
        if (e.issues.length > 0) {
            const s = e.issues[0];
            s !== void 0 && "expected"in s && typeof s.expected == "string" && (r = s.expected)
        }
        return `Failed to validate ${r}`
    }
    return `Failed to validate keys: ${Cn(n.join(", "), 100)}`
}
function i_(e, t=!1, n, r) {
    var s;
    if (!((s = n.exception) != null && s.values) || !r.originalException || !n_(r.originalException) || r.originalException.issues.length === 0)
        return n;
    try {
        const i = (t ? r.originalException.issues : r.originalException.issues.slice(0, e)).map(r_);
        return t && (Array.isArray(r.attachments) || (r.attachments = []),
        r.attachments.push({
            filename: "zod_issues.json",
            data: JSON.stringify({
                issues: i
            })
        })),
        {
            ...n,
            exception: {
                ...n.exception,
                values: [{
                    ...n.exception.values[0],
                    value: o_(r.originalException)
                }, ...n.exception.values.slice(1)]
            },
            extra: {
                ...n.extra,
                "zoderror.issues": i.slice(0, e)
            }
        }
    } catch (o) {
        return {
            ...n,
            extra: {
                ...n.extra,
                "zoderrors sentry integration parse error": {
                    message: "an exception was thrown while processing ZodError within applyZodErrorsToEvent()",
                    error: o instanceof Error ? `${o.name}: ${o.message}
${o.stack}` : "unknown"
                }
            }
        }
    }
}
const a_ = (e={}) => {
    const t = e.limit ?? e_;
    return {
        name: t_,
        processEvent(n, r) {
            return i_(t, e.saveZodIssuesAsAttachment, n, r)
        }
    }
}
  , q1 = a_
  , G1 = e => ({
    name: "ThirdPartyErrorsFilter",
    setup(t) {
        t.on("beforeEnvelope", n => {
            en(n, (r, s) => {
                if (s === "event") {
                    const o = Array.isArray(r) ? r[1] : void 0;
                    o && (td(o),
                    r[1] = o)
                }
            }
            )
        }
        ),
        t.on("applyFrameMetadata", n => {
            if (n.type)
                return;
            const r = t.getOptions().stackParser;
            ed(r, n)
        }
        )
    },
    processEvent(t) {
        const n = c_(t);
        if (n) {
            const r = e.behaviour === "drop-error-if-contains-third-party-frames" || e.behaviour === "apply-tag-if-contains-third-party-frames" ? "some" : "every";
            if (n[r](o => !o.some(i => e.filterKeys.includes(i)))) {
                if (e.behaviour === "drop-error-if-contains-third-party-frames" || e.behaviour === "drop-error-if-exclusively-contains-third-party-frames")
                    return null;
                t.tags = {
                    ...t.tags,
                    third_party_code: !0
                }
            }
        }
        return t
    }
});
function c_(e) {
    const t = Xo(e);
    if (t)
        return t.filter(n => !!n.filename).map(n => n.module_metadata ? Object.keys(n.module_metadata).filter(r => r.startsWith(yc)).map(r => r.slice(yc.length)) : [])
}
const yc = "_sentryBundlerPluginAppKey:"
  , u_ = 100
  , l_ = 10;
P._spanToFlagBufferMap = new WeakMap;
const Sc = "flag.evaluation.";
function wr(e) {
    const n = j().getScopeData().contexts.flags
      , r = n ? n.values : [];
    return r.length && (e.contexts === void 0 && (e.contexts = {}),
    e.contexts.flags = {
        values: [...r]
    }),
    e
}
function An(e, t, n=u_) {
    const r = j().getScopeData().contexts;
    r.flags || (r.flags = {
        values: []
    });
    const s = r.flags.values;
    d_(s, e, t, n)
}
function d_(e, t, n, r) {
    if (typeof n != "boolean")
        return;
    if (e.length > r) {
        x && y.error(`[Feature Flags] insertToFlagBuffer called on a buffer larger than maxSize=${r}`);
        return
    }
    const s = e.findIndex(o => o.flag === t);
    s !== -1 && e.splice(s, 1),
    e.length === r && e.shift(),
    e.push({
        flag: t,
        result: n
    })
}
function Nn(e, t, n=l_) {
    const r = P._spanToFlagBufferMap;
    if (!r || typeof t != "boolean")
        return;
    const s = ge();
    if (s) {
        const o = r.get(s) || new Set;
        o.has(e) ? s.setAttribute(`${Sc}${e}`, t) : o.size < n && (o.add(e),
        s.setAttribute(`${Sc}${e}`, t)),
        r.set(s, o)
    }
}
const V1 = () => ({
    name: "FeatureFlags",
    processEvent(e, t, n) {
        return wr(e)
    },
    addFeatureFlag(e, t) {
        An(e, t),
        Nn(e, t)
    }
})
  , f_ = "thismessage:/";
function od(e) {
    return "isRelative"in e
}
function id(e, t) {
    const n = e.indexOf("://") <= 0 && e.indexOf("//") !== 0
      , r = n ? f_ : void 0;
    try {
        if ("canParse"in URL && !URL.canParse(e, r))
            return;
        const s = new URL(e,r);
        return n ? {
            isRelative: n,
            pathname: s.pathname,
            search: s.search,
            hash: s.hash
        } : s
    } catch {}
}
function p_(e) {
    if (od(e))
        return e.pathname;
    const t = new URL(e);
    return t.search = "",
    t.hash = "",
    ["80", "443"].includes(t.port) && (t.port = ""),
    t.password && (t.password = "%filtered%"),
    t.username && (t.username = "%filtered%"),
    t.toString()
}
function Kt(e) {
    if (!e)
        return {};
    const t = e.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
    if (!t)
        return {};
    const n = t[6] || ""
      , r = t[8] || "";
    return {
        host: t[4],
        path: t[5],
        protocol: t[2],
        search: n,
        hash: r,
        relative: t[5] + n + r
    }
}
function ad(e) {
    return e.split(/[?#]/, 1)[0]
}
function h_(e, t, n, r, s="auto.http.browser") {
    if (!e.fetchData)
        return;
    const {method: o, url: i} = e.fetchData
      , a = Dt() && t(i);
    if (e.endTimestamp && a) {
        const l = e.fetchData.__span;
        if (!l)
            return;
        const f = r[l];
        f && (g_(f, e),
        delete r[l]);
        return
    }
    const c = !!ge()
      , u = a && c ? nt(y_(i, o, s)) : new yt;
    if (e.fetchData.__span = u.spanContext().spanId,
    r[u.spanContext().spanId] = u,
    n(e.fetchData.url)) {
        const l = e.args[0]
          , f = e.args[1] || {}
          , p = m_(l, f, Dt() && c ? u : void 0);
        p && (e.args[1] = f,
        f.headers = p)
    }
    const d = M();
    if (d) {
        const l = {
            input: e.args,
            response: e.response,
            startTimestamp: e.startTimestamp,
            endTimestamp: e.endTimestamp
        };
        d.emit("beforeOutgoingRequestSpan", u, l)
    }
    return u
}
function m_(e, t, n) {
    const r = Zl({
        span: n
    })
      , s = r["sentry-trace"]
      , o = r.baggage;
    if (!s)
        return;
    const i = t.headers || (tl(e) ? e.headers : void 0);
    if (i)
        if (__(i)) {
            const a = new Headers(i);
            if (a.get("sentry-trace") || a.set("sentry-trace", s),
            o) {
                const c = a.get("baggage");
                c ? Hr(c) || a.set("baggage", `${c},${o}`) : a.set("baggage", o)
            }
            return a
        } else if (Array.isArray(i)) {
            const a = [...i];
            i.find(u => u[0] === "sentry-trace") || a.push(["sentry-trace", s]);
            const c = i.find(u => u[0] === "baggage" && Hr(u[1]));
            return o && !c && a.push(["baggage", o]),
            a
        } else {
            const a = "sentry-trace"in i ? i["sentry-trace"] : void 0
              , c = "baggage"in i ? i.baggage : void 0
              , u = c ? Array.isArray(c) ? [...c] : [c] : []
              , d = c && (Array.isArray(c) ? c.find(l => Hr(l)) : Hr(c));
            return o && !d && u.push(o),
            {
                ...i,
                "sentry-trace": a ?? s,
                baggage: u.length > 0 ? u.join(",") : void 0
            }
        }
    else
        return {
            ...r
        }
}
function g_(e, t) {
    var n;
    if (t.response) {
        ws(e, t.response.status);
        const r = ((n = t.response) == null ? void 0 : n.headers) && t.response.headers.get("content-length");
        if (r) {
            const s = parseInt(r);
            s > 0 && e.setAttribute("http.response_content_length", s)
        }
    } else
        t.error && e.setStatus({
            code: pe,
            message: "internal_error"
        });
    e.end()
}
function Hr(e) {
    return e.split(",").some(t => t.trim().startsWith(Bi))
}
function __(e) {
    return typeof Headers < "u" && gt(e, Headers)
}
function y_(e, t, n) {
    const r = id(e);
    return {
        name: r ? `${t} ${p_(r)}` : t,
        attributes: S_(e, r, t, n)
    }
}
function S_(e, t, n, r) {
    const s = {
        url: e,
        type: "fetch",
        "http.method": n,
        [Y]: r,
        [be]: "http.client"
    };
    return t && (od(t) || (s["http.url"] = t.href,
    s["server.address"] = t.host),
    t.search && (s["http.query"] = t.search),
    t.hash && (s["http.fragment"] = t.hash)),
    s
}
function b_(e, t={}, n=j()) {
    const {message: r, name: s, email: o, url: i, source: a, associatedEventId: c, tags: u} = e
      , d = {
        contexts: {
            feedback: {
                contact_email: o,
                name: s,
                message: r,
                url: i,
                source: a,
                associated_event_id: c
            }
        },
        type: "feedback",
        level: "info",
        tags: u
    }
      , l = (n == null ? void 0 : n.getClient()) || M();
    return l && l.emit("beforeSendFeedback", d, t),
    n.captureEvent(d, t)
}
const E_ = "ConsoleLogs"
  , bc = {
    [Y]: "auto.console.logging"
}
  , v_ = (e={}) => {
    const t = e.levels || ir;
    return {
        name: E_,
        setup(n) {
            const {_experiments: r, normalizeDepth: s=3, normalizeMaxBreadth: o=1e3} = n.getOptions();
            if (!(r != null && r.enableLogs)) {
                x && y.warn("`_experiments.enableLogs` is not enabled, ConsoleLogs integration disabled");
                return
            }
            Vi( ({args: i, level: a}) => {
                if (M() !== n || !t.includes(a))
                    return;
                if (a === "assert") {
                    if (!i[0]) {
                        const u = i.slice(1)
                          , d = u.length > 0 ? `Assertion failed: ${Ec(u, s, o)}` : "Assertion failed";
                        ii({
                            level: "error",
                            message: d,
                            attributes: bc
                        })
                    }
                    return
                }
                const c = a === "log";
                ii({
                    level: c ? "info" : a,
                    message: Ec(i, s, o),
                    severityNumber: c ? 10 : void 0,
                    attributes: bc
                })
            }
            )
        }
    }
}
  , Y1 = v_;
function Ec(e, t, n) {
    return "util"in P && typeof P.util.format == "function" ? P.util.format(...e) : w_(e, t, n)
}
function w_(e, t, n) {
    return e.map(r => kn(r) ? String(r) : JSON.stringify(De(r, t, n))).join(" ")
}
function cd(e) {
    if (e !== void 0)
        return e >= 400 && e < 500 ? "warning" : e >= 500 ? "error" : void 0
}
const On = P;
function T_() {
    return "history"in On && !!On.history
}
function I_() {
    if (!("fetch"in On))
        return !1;
    try {
        return new Headers,
        new Request("http://www.example.com"),
        new Response,
        !0
    } catch {
        return !1
    }
}
function ci(e) {
    return e && /^function\s+\w+\(\)\s+\{\s+\[native code\]\s+\}$/.test(e.toString())
}
function ud() {
    var n;
    if (typeof EdgeRuntime == "string")
        return !0;
    if (!I_())
        return !1;
    if (ci(On.fetch))
        return !0;
    let e = !1;
    const t = On.document;
    if (t && typeof t.createElement == "function")
        try {
            const r = t.createElement("iframe");
            r.hidden = !0,
            t.head.appendChild(r),
            (n = r.contentWindow) != null && n.fetch && (e = ci(r.contentWindow.fetch)),
            t.head.removeChild(r)
        } catch (r) {
            x && y.warn("Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ", r)
        }
    return e
}
function k_() {
    return "ReportingObserver"in On
}
function Xi(e, t) {
    const n = "fetch";
    $t(n, e),
    Bt(n, () => ld(void 0, t))
}
function C_(e) {
    const t = "fetch-body-resolved";
    $t(t, e),
    Bt(t, () => ld(x_))
}
function ld(e, t=!1) {
    t && !ud() || Me(P, "fetch", function(n) {
        return function(...r) {
            const s = new Error
              , {method: o, url: i} = M_(r)
              , a = {
                args: r,
                fetchData: {
                    method: o,
                    url: i
                },
                startTimestamp: me() * 1e3,
                virtualError: s,
                headers: A_(r)
            };
            return e || je("fetch", {
                ...a
            }),
            n.apply(P, r).then(async c => (e ? e(c) : je("fetch", {
                ...a,
                endTimestamp: me() * 1e3,
                response: c
            }),
            c), c => {
                if (je("fetch", {
                    ...a,
                    endTimestamp: me() * 1e3,
                    error: c
                }),
                pt(c) && c.stack === void 0 && (c.stack = s.stack,
                Ne(c, "framesToPop", 1)),
                c instanceof TypeError && (c.message === "Failed to fetch" || c.message === "Load failed" || c.message === "NetworkError when attempting to fetch resource."))
                    try {
                        const u = new URL(a.fetchData.url);
                        c.message = `${c.message} (${u.host})`
                    } catch {}
                throw c
            }
            )
        }
    })
}
async function R_(e, t) {
    if (e != null && e.body) {
        const n = e.body
          , r = n.getReader()
          , s = setTimeout( () => {
            n.cancel().then(null, () => {}
            )
        }
        , 90 * 1e3);
        let o = !0;
        for (; o; ) {
            let i;
            try {
                i = setTimeout( () => {
                    n.cancel().then(null, () => {}
                    )
                }
                , 5e3);
                const {done: a} = await r.read();
                clearTimeout(i),
                a && (t(),
                o = !1)
            } catch {
                o = !1
            } finally {
                clearTimeout(i)
            }
        }
        clearTimeout(s),
        r.releaseLock(),
        n.cancel().then(null, () => {}
        )
    }
}
function x_(e) {
    let t;
    try {
        t = e.clone()
    } catch {
        return
    }
    R_(t, () => {
        je("fetch-body-resolved", {
            endTimestamp: me() * 1e3,
            response: e
        })
    }
    )
}
function ui(e, t) {
    return !!e && typeof e == "object" && !!e[t]
}
function vc(e) {
    return typeof e == "string" ? e : e ? ui(e, "url") ? e.url : e.toString ? e.toString() : "" : ""
}
function M_(e) {
    if (e.length === 0)
        return {
            method: "GET",
            url: ""
        };
    if (e.length === 2) {
        const [n,r] = e;
        return {
            url: vc(n),
            method: ui(r, "method") ? String(r.method).toUpperCase() : "GET"
        }
    }
    const t = e[0];
    return {
        url: vc(t),
        method: ui(t, "method") ? String(t.method).toUpperCase() : "GET"
    }
}
function A_(e) {
    const [t,n] = e;
    try {
        if (typeof n == "object" && n !== null && "headers"in n && n.headers)
            return new Headers(n.headers);
        if (tl(t))
            return new Headers(t.headers)
    } catch {}
}
function N_() {
    return typeof __SENTRY_BROWSER_BUNDLE__ < "u" && !!__SENTRY_BROWSER_BUNDLE__
}
function O_() {
    return "npm"
}
function L_() {
    return !N_() && Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]"
}
function li() {
    return typeof window < "u" && (!L_() || P_())
}
function P_() {
    const e = P.process;
    return (e == null ? void 0 : e.type) === "renderer"
}
const Xe = P
  , oe = Xe.document
  , er = Xe.navigator
  , dd = "Report a Bug"
  , D_ = "Cancel"
  , F_ = "Send Bug Report"
  , $_ = "Confirm"
  , B_ = "Report a Bug"
  , U_ = "your.email@example.org"
  , H_ = "Email"
  , W_ = "What's the bug? What did you expect?"
  , z_ = "Description"
  , j_ = "Your Name"
  , q_ = "Name"
  , G_ = "Thank you for your report!"
  , V_ = "(required)"
  , Y_ = "Add a screenshot"
  , X_ = "Remove screenshot"
  , K_ = "widget"
  , J_ = "api"
  , Z_ = 5e3
  , Q_ = (e, t={
    includeReplay: !0
}) => {
    if (!e.message)
        throw new Error("Unable to submit feedback with empty message");
    const n = M();
    if (!n)
        throw new Error("No client setup, cannot send feedback.");
    e.tags && Object.keys(e.tags).length && j().setTags(e.tags);
    const r = b_({
        source: J_,
        url: rn(),
        ...e
    }, t);
    return new Promise( (s, o) => {
        const i = setTimeout( () => o("Unable to determine if Feedback was correctly sent."), 5e3)
          , a = n.on("afterSendEvent", (c, u) => {
            if (c.event_id === r)
                return clearTimeout(i),
                a(),
                u && typeof u.statusCode == "number" && u.statusCode >= 200 && u.statusCode < 300 ? s(r) : u && typeof u.statusCode == "number" && u.statusCode === 0 ? o("Unable to send Feedback. This is because of network issues, or because you are using an ad-blocker.") : u && typeof u.statusCode == "number" && u.statusCode === 403 ? o("Unable to send Feedback. This could be because this domain is not in your list of allowed domains.") : o("Unable to send Feedback. This could be because of network issues, or because you are using an ad-blocker")
        }
        )
    }
    )
}
  , cs = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
function ey() {
    return !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(er.userAgent) || /Macintosh/i.test(er.userAgent) && er.maxTouchPoints && er.maxTouchPoints > 1 || !isSecureContext)
}
function Wr(e, t) {
    return {
        ...e,
        ...t,
        tags: {
            ...e.tags,
            ...t.tags
        },
        onFormOpen: () => {
            var n, r;
            (n = t.onFormOpen) == null || n.call(t),
            (r = e.onFormOpen) == null || r.call(e)
        }
        ,
        onFormClose: () => {
            var n, r;
            (n = t.onFormClose) == null || n.call(t),
            (r = e.onFormClose) == null || r.call(e)
        }
        ,
        onSubmitSuccess: n => {
            var r, s;
            (r = t.onSubmitSuccess) == null || r.call(t, n),
            (s = e.onSubmitSuccess) == null || s.call(e, n)
        }
        ,
        onSubmitError: n => {
            var r, s;
            (r = t.onSubmitError) == null || r.call(t, n),
            (s = e.onSubmitError) == null || s.call(e, n)
        }
        ,
        onFormSubmitted: () => {
            var n, r;
            (n = t.onFormSubmitted) == null || n.call(t),
            (r = e.onFormSubmitted) == null || r.call(e)
        }
        ,
        themeDark: {
            ...e.themeDark,
            ...t.themeDark
        },
        themeLight: {
            ...e.themeLight,
            ...t.themeLight
        }
    }
}
function ty(e) {
    const t = oe.createElement("style");
    return t.textContent = `
.widget__actor {
  position: fixed;
  z-index: var(--z-index);
  margin: var(--page-margin);
  inset: var(--actor-inset);

  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;

  font-family: inherit;
  font-size: var(--font-size);
  font-weight: 600;
  line-height: 1.14em;
  text-decoration: none;

  background: var(--actor-background, var(--background));
  border-radius: var(--actor-border-radius, 1.7em/50%);
  border: var(--actor-border, var(--border));
  box-shadow: var(--actor-box-shadow, var(--box-shadow));
  color: var(--actor-color, var(--foreground));
  fill: var(--actor-color, var(--foreground));
  cursor: pointer;
  opacity: 1;
  transition: transform 0.2s ease-in-out;
  transform: translate(0, 0) scale(1);
}
.widget__actor[aria-hidden="true"] {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transform: translate(0, 16px) scale(0.98);
}

.widget__actor:hover {
  background: var(--actor-hover-background, var(--background));
  filter: var(--interactive-filter);
}

.widget__actor svg {
  width: 1.14em;
  height: 1.14em;
}

@media (max-width: 600px) {
  .widget__actor span {
    display: none;
  }
}
`,
    e && t.setAttribute("nonce", e),
    t
}
function $e(e, t) {
    return Object.entries(t).forEach( ([n,r]) => {
        e.setAttributeNS(null, n, r)
    }
    ),
    e
}
const fn = 20
  , ny = "http://www.w3.org/2000/svg";
function ry() {
    const e = a => Xe.document.createElementNS(ny, a)
      , t = $e(e("svg"), {
        width: `${fn}`,
        height: `${fn}`,
        viewBox: `0 0 ${fn} ${fn}`,
        fill: "var(--actor-color, var(--foreground))"
    })
      , n = $e(e("g"), {
        clipPath: "url(#clip0_57_80)"
    })
      , r = $e(e("path"), {
        "fill-rule": "evenodd",
        "clip-rule": "evenodd",
        d: "M15.6622 15H12.3997C12.2129 14.9959 12.031 14.9396 11.8747 14.8375L8.04965 12.2H7.49956V19.1C7.4875 19.3348 7.3888 19.5568 7.22256 19.723C7.05632 19.8892 6.83435 19.9879 6.59956 20H2.04956C1.80193 19.9968 1.56535 19.8969 1.39023 19.7218C1.21511 19.5467 1.1153 19.3101 1.11206 19.0625V12.2H0.949652C0.824431 12.2017 0.700142 12.1783 0.584123 12.1311C0.468104 12.084 0.362708 12.014 0.274155 11.9255C0.185602 11.8369 0.115689 11.7315 0.0685419 11.6155C0.0213952 11.4995 -0.00202913 11.3752 -0.00034808 11.25V3.75C-0.00900498 3.62067 0.0092504 3.49095 0.0532651 3.36904C0.0972798 3.24712 0.166097 3.13566 0.255372 3.04168C0.344646 2.94771 0.452437 2.87327 0.571937 2.82307C0.691437 2.77286 0.82005 2.74798 0.949652 2.75H8.04965L11.8747 0.1625C12.031 0.0603649 12.2129 0.00407221 12.3997 0H15.6622C15.9098 0.00323746 16.1464 0.103049 16.3215 0.278167C16.4966 0.453286 16.5964 0.689866 16.5997 0.9375V3.25269C17.3969 3.42959 18.1345 3.83026 18.7211 4.41679C19.5322 5.22788 19.9878 6.32796 19.9878 7.47502C19.9878 8.62209 19.5322 9.72217 18.7211 10.5333C18.1345 11.1198 17.3969 11.5205 16.5997 11.6974V14.0125C16.6047 14.1393 16.5842 14.2659 16.5395 14.3847C16.4948 14.5035 16.4268 14.6121 16.3394 14.7042C16.252 14.7962 16.147 14.8698 16.0307 14.9206C15.9144 14.9714 15.7891 14.9984 15.6622 15ZM1.89695 10.325H1.88715V4.625H8.33715C8.52423 4.62301 8.70666 4.56654 8.86215 4.4625L12.6872 1.875H14.7247V13.125H12.6872L8.86215 10.4875C8.70666 10.3835 8.52423 10.327 8.33715 10.325H2.20217C2.15205 10.3167 2.10102 10.3125 2.04956 10.3125C1.9981 10.3125 1.94708 10.3167 1.89695 10.325ZM2.98706 12.2V18.1625H5.66206V12.2H2.98706ZM16.5997 9.93612V5.01393C16.6536 5.02355 16.7072 5.03495 16.7605 5.04814C17.1202 5.13709 17.4556 5.30487 17.7425 5.53934C18.0293 5.77381 18.2605 6.06912 18.4192 6.40389C18.578 6.73866 18.6603 7.10452 18.6603 7.47502C18.6603 7.84552 18.578 8.21139 18.4192 8.54616C18.2605 8.88093 18.0293 9.17624 17.7425 9.41071C17.4556 9.64518 17.1202 9.81296 16.7605 9.90191C16.7072 9.91509 16.6536 9.9265 16.5997 9.93612Z"
    });
    t.appendChild(n).appendChild(r);
    const s = e("defs")
      , o = $e(e("clipPath"), {
        id: "clip0_57_80"
    })
      , i = $e(e("rect"), {
        width: `${fn}`,
        height: `${fn}`,
        fill: "white"
    });
    return o.appendChild(i),
    s.appendChild(o),
    t.appendChild(s).appendChild(o).appendChild(i),
    t
}
function sy({triggerLabel: e, triggerAriaLabel: t, shadow: n, styleNonce: r}) {
    const s = oe.createElement("button");
    if (s.type = "button",
    s.className = "widget__actor",
    s.ariaHidden = "false",
    s.ariaLabel = t || e || dd,
    s.appendChild(ry()),
    e) {
        const i = oe.createElement("span");
        i.appendChild(oe.createTextNode(e)),
        s.appendChild(i)
    }
    const o = ty(r);
    return {
        el: s,
        appendToDom() {
            n.appendChild(o),
            n.appendChild(s)
        },
        removeFromDom() {
            s.remove(),
            o.remove()
        },
        show() {
            s.ariaHidden = "false"
        },
        hide() {
            s.ariaHidden = "true"
        }
    }
}
const fd = "rgba(88, 74, 192, 1)"
  , oy = {
    foreground: "#2b2233",
    background: "#ffffff",
    accentForeground: "white",
    accentBackground: fd,
    successColor: "#268d75",
    errorColor: "#df3338",
    border: "1.5px solid rgba(41, 35, 47, 0.13)",
    boxShadow: "0px 4px 24px 0px rgba(43, 34, 51, 0.12)",
    outline: "1px auto var(--accent-background)",
    interactiveFilter: "brightness(95%)"
}
  , wc = {
    foreground: "#ebe6ef",
    background: "#29232f",
    accentForeground: "white",
    accentBackground: fd,
    successColor: "#2da98c",
    errorColor: "#f55459",
    border: "1.5px solid rgba(235, 230, 239, 0.15)",
    boxShadow: "0px 4px 24px 0px rgba(43, 34, 51, 0.12)",
    outline: "1px auto var(--accent-background)",
    interactiveFilter: "brightness(150%)"
};
function Tc(e) {
    return `
  --foreground: ${e.foreground};
  --background: ${e.background};
  --accent-foreground: ${e.accentForeground};
  --accent-background: ${e.accentBackground};
  --success-color: ${e.successColor};
  --error-color: ${e.errorColor};
  --border: ${e.border};
  --box-shadow: ${e.boxShadow};
  --outline: ${e.outline};
  --interactive-filter: ${e.interactiveFilter};
  `
}
function iy({colorScheme: e, themeDark: t, themeLight: n, styleNonce: r}) {
    const s = oe.createElement("style");
    return s.textContent = `
:host {
  --font-family: system-ui, 'Helvetica Neue', Arial, sans-serif;
  --font-size: 14px;
  --z-index: 100000;

  --page-margin: 16px;
  --inset: auto 0 0 auto;
  --actor-inset: var(--inset);

  font-family: var(--font-family);
  font-size: var(--font-size);

  ${e !== "system" ? "color-scheme: only light;" : ""}

  ${Tc(e === "dark" ? {
        ...wc,
        ...t
    } : {
        ...oy,
        ...n
    })}
}

${e === "system" ? `
@media (prefers-color-scheme: dark) {
  :host {
    ${Tc({
        ...wc,
        ...t
    })}
  }
}` : ""}
}
`,
    r && s.setAttribute("nonce", r),
    s
}
const pd = ({lazyLoadIntegration: e, getModalIntegration: t, getScreenshotIntegration: n}) => ({id: s="sentry-feedback", autoInject: o=!0, showBranding: i=!0, isEmailRequired: a=!1, isNameRequired: c=!1, showEmail: u=!0, showName: d=!0, enableScreenshot: l=!0, useSentryUser: f={
    email: "email",
    name: "username"
}, tags: p, styleNonce: h, scriptNonce: m, colorScheme: _="system", themeLight: g={}, themeDark: b={}, addScreenshotButtonLabel: T=Y_, cancelButtonLabel: C=D_, confirmButtonLabel: S=$_, emailLabel: E=H_, emailPlaceholder: k=U_, formTitle: N=B_, isRequiredLabel: w=V_, messageLabel: I=z_, messagePlaceholder: F=W_, nameLabel: v=q_, namePlaceholder: R=j_, removeScreenshotButtonLabel: A=X_, submitButtonLabel: U=F_, successMessageText: O=G_, triggerLabel: X=dd, triggerAriaLabel: D="", onFormOpen: K, onFormClose: Q, onSubmitSuccess: Te, onSubmitError: un, onFormSubmitted: Pe}={}) => {
    const Ce = {
        id: s,
        autoInject: o,
        showBranding: i,
        isEmailRequired: a,
        isNameRequired: c,
        showEmail: u,
        showName: d,
        enableScreenshot: l,
        useSentryUser: f,
        tags: p,
        styleNonce: h,
        scriptNonce: m,
        colorScheme: _,
        themeDark: b,
        themeLight: g,
        triggerLabel: X,
        triggerAriaLabel: D,
        cancelButtonLabel: C,
        submitButtonLabel: U,
        confirmButtonLabel: S,
        formTitle: N,
        emailLabel: E,
        emailPlaceholder: k,
        messageLabel: I,
        messagePlaceholder: F,
        nameLabel: v,
        namePlaceholder: R,
        successMessageText: O,
        isRequiredLabel: w,
        addScreenshotButtonLabel: T,
        removeScreenshotButtonLabel: A,
        onFormClose: Q,
        onFormOpen: K,
        onSubmitError: un,
        onSubmitSuccess: Te,
        onFormSubmitted: Pe
    };
    let Ge = null
      , ct = [];
    const ln = ne => {
        if (!Ge) {
            const Se = oe.createElement("div");
            Se.id = String(ne.id),
            oe.body.appendChild(Se),
            Ge = Se.attachShadow({
                mode: "open"
            }),
            Ge.appendChild(iy(ne))
        }
        return Ge
    }
      , dn = async ne => {
        const Se = ne.enableScreenshot && ey();
        let Ue, _e;
        try {
            Ue = (t ? t() : await e("feedbackModalIntegration", m))(),
            nc(Ue)
        } catch {
            throw cs && y.error("[Feedback] Error when trying to load feedback integrations. Try using `feedbackSyncIntegration` in your `Sentry.init`."),
            new Error("[Feedback] Missing feedback modal integration!")
        }
        try {
            const ke = Se ? n ? n() : await e("feedbackScreenshotIntegration", m) : void 0;
            ke && (_e = ke(),
            nc(_e))
        } catch {
            cs && y.error("[Feedback] Missing feedback screenshot integration. Proceeding without screenshots.")
        }
        const re = Ue.createDialog({
            options: {
                ...ne,
                onFormClose: () => {
                    var ke;
                    re == null || re.close(),
                    (ke = ne.onFormClose) == null || ke.call(ne)
                }
                ,
                onFormSubmitted: () => {
                    var ke;
                    re == null || re.close(),
                    (ke = ne.onFormSubmitted) == null || ke.call(ne)
                }
            },
            screenshotIntegration: _e,
            sendFeedback: Q_,
            shadow: ln(ne)
        });
        return re
    }
      , Zn = (ne, Se={}) => {
        const Ue = Wr(Ce, Se)
          , _e = typeof ne == "string" ? oe.querySelector(ne) : typeof ne.addEventListener == "function" ? ne : null;
        if (!_e)
            throw cs && y.error("[Feedback] Unable to attach to target element"),
            new Error("Unable to attach to target element");
        let re = null;
        const ke = async () => {
            re || (re = await dn({
                ...Ue,
                onFormSubmitted: () => {
                    var ut;
                    re == null || re.removeFromDom(),
                    (ut = Ue.onFormSubmitted) == null || ut.call(Ue)
                }
            })),
            re.appendToDom(),
            re.open()
        }
        ;
        _e.addEventListener("click", ke);
        const Ht = () => {
            ct = ct.filter(ut => ut !== Ht),
            re == null || re.removeFromDom(),
            re = null,
            _e.removeEventListener("click", ke)
        }
        ;
        return ct.push(Ht),
        Ht
    }
      , Tt = (ne={}) => {
        const Se = Wr(Ce, ne)
          , Ue = ln(Se)
          , _e = sy({
            triggerLabel: Se.triggerLabel,
            triggerAriaLabel: Se.triggerAriaLabel,
            shadow: Ue,
            styleNonce: h
        });
        return Zn(_e.el, {
            ...Se,
            onFormOpen() {
                _e.hide()
            },
            onFormClose() {
                _e.show()
            },
            onFormSubmitted() {
                _e.show()
            }
        }),
        _e
    }
    ;
    return {
        name: "Feedback",
        setupOnce() {
            !li() || !Ce.autoInject || (oe.readyState === "loading" ? oe.addEventListener("DOMContentLoaded", () => Tt().appendToDom()) : Tt().appendToDom())
        },
        attachTo: Zn,
        createWidget(ne={}) {
            const Se = Tt(Wr(Ce, ne));
            return Se.appendToDom(),
            Se
        },
        async createForm(ne={}) {
            return dn(Wr(Ce, ne))
        },
        remove() {
            var ne;
            Ge && ((ne = Ge.parentElement) == null || ne.remove(),
            Ge = null),
            ct.forEach(Se => Se()),
            ct = []
        }
    }
}
;
function X1() {
    const e = M();
    return e == null ? void 0 : e.getIntegrationByName("Feedback")
}
var eo, ae, hd, jt, Ic, md, di, cr = {}, Ki = [], ay = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, Ji = Array.isArray;
function xt(e, t) {
    for (var n in t)
        e[n] = t[n];
    return e
}
function gd(e) {
    var t = e.parentNode;
    t && t.removeChild(e)
}
function G(e, t, n) {
    var r, s, o, i = {};
    for (o in t)
        o == "key" ? r = t[o] : o == "ref" ? s = t[o] : i[o] = t[o];
    if (arguments.length > 2 && (i.children = arguments.length > 3 ? eo.call(arguments, 2) : n),
    typeof e == "function" && e.defaultProps != null)
        for (o in e.defaultProps)
            i[o] === void 0 && (i[o] = e.defaultProps[o]);
    return us(e, i, r, s, null)
}
function us(e, t, n, r, s) {
    var o = {
        type: e,
        props: t,
        key: n,
        ref: r,
        __k: null,
        __: null,
        __b: 0,
        __e: null,
        __d: void 0,
        __c: null,
        constructor: void 0,
        __v: s ?? ++hd,
        __i: -1,
        __u: 0
    };
    return s == null && ae.vnode != null && ae.vnode(o),
    o
}
function Tr(e) {
    return e.children
}
function ls(e, t) {
    this.props = e,
    this.context = t
}
function Ln(e, t) {
    if (t == null)
        return e.__ ? Ln(e.__, e.__i + 1) : null;
    for (var n; t < e.__k.length; t++)
        if ((n = e.__k[t]) != null && n.__e != null)
            return n.__e;
    return typeof e.type == "function" ? Ln(e) : null
}
function cy(e, t, n) {
    var r, s = e.__v, o = s.__e, i = e.__P;
    if (i)
        return (r = xt({}, s)).__v = s.__v + 1,
        ae.vnode && ae.vnode(r),
        Zi(i, r, s, e.__n, i.ownerSVGElement !== void 0, 32 & s.__u ? [o] : null, t, o ?? Ln(s), !!(32 & s.__u), n),
        r.__.__k[r.__i] = r,
        r.__d = void 0,
        r.__e != o && _d(r),
        r
}
function _d(e) {
    var t, n;
    if ((e = e.__) != null && e.__c != null) {
        for (e.__e = e.__c.base = null,
        t = 0; t < e.__k.length; t++)
            if ((n = e.__k[t]) != null && n.__e != null) {
                e.__e = e.__c.base = n.__e;
                break
            }
        return _d(e)
    }
}
function kc(e) {
    (!e.__d && (e.__d = !0) && jt.push(e) && !As.__r++ || Ic !== ae.debounceRendering) && ((Ic = ae.debounceRendering) || md)(As)
}
function As() {
    var e, t, n, r = [], s = [];
    for (jt.sort(di); e = jt.shift(); )
        e.__d && (n = jt.length,
        t = cy(e, r, s) || t,
        n === 0 || jt.length > n ? (fi(r, t, s),
        s.length = r.length = 0,
        t = void 0,
        jt.sort(di)) : t && ae.__c && ae.__c(t, Ki));
    t && fi(r, t, s),
    As.__r = 0
}
function yd(e, t, n, r, s, o, i, a, c, u, d) {
    var l, f, p, h, m, _ = r && r.__k || Ki, g = t.length;
    for (n.__d = c,
    uy(n, t, _),
    c = n.__d,
    l = 0; l < g; l++)
        (p = n.__k[l]) != null && typeof p != "boolean" && typeof p != "function" && (f = p.__i === -1 ? cr : _[p.__i] || cr,
        p.__i = l,
        Zi(e, p, f, s, o, i, a, c, u, d),
        h = p.__e,
        p.ref && f.ref != p.ref && (f.ref && Qi(f.ref, null, p),
        d.push(p.ref, p.__c || h, p)),
        m == null && h != null && (m = h),
        65536 & p.__u || f.__k === p.__k ? c = Sd(p, c, e) : typeof p.type == "function" && p.__d !== void 0 ? c = p.__d : h && (c = h.nextSibling),
        p.__d = void 0,
        p.__u &= -196609);
    n.__d = c,
    n.__e = m
}
function uy(e, t, n) {
    var r, s, o, i, a, c = t.length, u = n.length, d = u, l = 0;
    for (e.__k = [],
    r = 0; r < c; r++)
        (s = e.__k[r] = (s = t[r]) == null || typeof s == "boolean" || typeof s == "function" ? null : typeof s == "string" || typeof s == "number" || typeof s == "bigint" || s.constructor == String ? us(null, s, null, null, s) : Ji(s) ? us(Tr, {
            children: s
        }, null, null, null) : s.constructor === void 0 && s.__b > 0 ? us(s.type, s.props, s.key, s.ref ? s.ref : null, s.__v) : s) != null ? (s.__ = e,
        s.__b = e.__b + 1,
        a = ly(s, n, i = r + l, d),
        s.__i = a,
        o = null,
        a !== -1 && (d--,
        (o = n[a]) && (o.__u |= 131072)),
        o == null || o.__v === null ? (a == -1 && l--,
        typeof s.type != "function" && (s.__u |= 65536)) : a !== i && (a === i + 1 ? l++ : a > i ? d > c - i ? l += a - i : l-- : l = a < i && a == i - 1 ? a - i : 0,
        a !== r + l && (s.__u |= 65536))) : (o = n[r]) && o.key == null && o.__e && (o.__e == e.__d && (e.__d = Ln(o)),
        pi(o, o, !1),
        n[r] = null,
        d--);
    if (d)
        for (r = 0; r < u; r++)
            (o = n[r]) != null && (131072 & o.__u) == 0 && (o.__e == e.__d && (e.__d = Ln(o)),
            pi(o, o))
}
function Sd(e, t, n) {
    var r, s;
    if (typeof e.type == "function") {
        for (r = e.__k,
        s = 0; r && s < r.length; s++)
            r[s] && (r[s].__ = e,
            t = Sd(r[s], t, n));
        return t
    }
    e.__e != t && (n.insertBefore(e.__e, t || null),
    t = e.__e);
    do
        t = t && t.nextSibling;
    while (t != null && t.nodeType === 8);
    return t
}
function ly(e, t, n, r) {
    var s = e.key
      , o = e.type
      , i = n - 1
      , a = n + 1
      , c = t[n];
    if (c === null || c && s == c.key && o === c.type)
        return n;
    if (r > (c != null && (131072 & c.__u) == 0 ? 1 : 0))
        for (; i >= 0 || a < t.length; ) {
            if (i >= 0) {
                if ((c = t[i]) && (131072 & c.__u) == 0 && s == c.key && o === c.type)
                    return i;
                i--
            }
            if (a < t.length) {
                if ((c = t[a]) && (131072 & c.__u) == 0 && s == c.key && o === c.type)
                    return a;
                a++
            }
        }
    return -1
}
function Cc(e, t, n) {
    t[0] === "-" ? e.setProperty(t, n ?? "") : e[t] = n == null ? "" : typeof n != "number" || ay.test(t) ? n : n + "px"
}
function zr(e, t, n, r, s) {
    var o;
    e: if (t === "style")
        if (typeof n == "string")
            e.style.cssText = n;
        else {
            if (typeof r == "string" && (e.style.cssText = r = ""),
            r)
                for (t in r)
                    n && t in n || Cc(e.style, t, "");
            if (n)
                for (t in n)
                    r && n[t] === r[t] || Cc(e.style, t, n[t])
        }
    else if (t[0] === "o" && t[1] === "n")
        o = t !== (t = t.replace(/(PointerCapture)$|Capture$/i, "$1")),
        t = t.toLowerCase()in e ? t.toLowerCase().slice(2) : t.slice(2),
        e.l || (e.l = {}),
        e.l[t + o] = n,
        n ? r ? n.u = r.u : (n.u = Date.now(),
        e.addEventListener(t, o ? xc : Rc, o)) : e.removeEventListener(t, o ? xc : Rc, o);
    else {
        if (s)
            t = t.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
        else if (t !== "width" && t !== "height" && t !== "href" && t !== "list" && t !== "form" && t !== "tabIndex" && t !== "download" && t !== "rowSpan" && t !== "colSpan" && t !== "role" && t in e)
            try {
                e[t] = n ?? "";
                break e
            } catch {}
        typeof n == "function" || (n == null || n === !1 && t[4] !== "-" ? e.removeAttribute(t) : e.setAttribute(t, n))
    }
}
function Rc(e) {
    if (this.l) {
        var t = this.l[e.type + !1];
        if (e.t) {
            if (e.t <= t.u)
                return
        } else
            e.t = Date.now();
        return t(ae.event ? ae.event(e) : e)
    }
}
function xc(e) {
    if (this.l)
        return this.l[e.type + !0](ae.event ? ae.event(e) : e)
}
function Zi(e, t, n, r, s, o, i, a, c, u) {
    var d, l, f, p, h, m, _, g, b, T, C, S, E, k, N, w = t.type;
    if (t.constructor !== void 0)
        return null;
    128 & n.__u && (c = !!(32 & n.__u),
    o = [a = t.__e = n.__e]),
    (d = ae.__b) && d(t);
    e: if (typeof w == "function")
        try {
            if (g = t.props,
            b = (d = w.contextType) && r[d.__c],
            T = d ? b ? b.props.value : d.__ : r,
            n.__c ? _ = (l = t.__c = n.__c).__ = l.__E : ("prototype"in w && w.prototype.render ? t.__c = l = new w(g,T) : (t.__c = l = new ls(g,T),
            l.constructor = w,
            l.render = fy),
            b && b.sub(l),
            l.props = g,
            l.state || (l.state = {}),
            l.context = T,
            l.__n = r,
            f = l.__d = !0,
            l.__h = [],
            l._sb = []),
            l.__s == null && (l.__s = l.state),
            w.getDerivedStateFromProps != null && (l.__s == l.state && (l.__s = xt({}, l.__s)),
            xt(l.__s, w.getDerivedStateFromProps(g, l.__s))),
            p = l.props,
            h = l.state,
            l.__v = t,
            f)
                w.getDerivedStateFromProps == null && l.componentWillMount != null && l.componentWillMount(),
                l.componentDidMount != null && l.__h.push(l.componentDidMount);
            else {
                if (w.getDerivedStateFromProps == null && g !== p && l.componentWillReceiveProps != null && l.componentWillReceiveProps(g, T),
                !l.__e && (l.shouldComponentUpdate != null && l.shouldComponentUpdate(g, l.__s, T) === !1 || t.__v === n.__v)) {
                    for (t.__v !== n.__v && (l.props = g,
                    l.state = l.__s,
                    l.__d = !1),
                    t.__e = n.__e,
                    t.__k = n.__k,
                    t.__k.forEach(function(I) {
                        I && (I.__ = t)
                    }),
                    C = 0; C < l._sb.length; C++)
                        l.__h.push(l._sb[C]);
                    l._sb = [],
                    l.__h.length && i.push(l);
                    break e
                }
                l.componentWillUpdate != null && l.componentWillUpdate(g, l.__s, T),
                l.componentDidUpdate != null && l.__h.push(function() {
                    l.componentDidUpdate(p, h, m)
                })
            }
            if (l.context = T,
            l.props = g,
            l.__P = e,
            l.__e = !1,
            S = ae.__r,
            E = 0,
            "prototype"in w && w.prototype.render) {
                for (l.state = l.__s,
                l.__d = !1,
                S && S(t),
                d = l.render(l.props, l.state, l.context),
                k = 0; k < l._sb.length; k++)
                    l.__h.push(l._sb[k]);
                l._sb = []
            } else
                do
                    l.__d = !1,
                    S && S(t),
                    d = l.render(l.props, l.state, l.context),
                    l.state = l.__s;
                while (l.__d && ++E < 25);
            l.state = l.__s,
            l.getChildContext != null && (r = xt(xt({}, r), l.getChildContext())),
            f || l.getSnapshotBeforeUpdate == null || (m = l.getSnapshotBeforeUpdate(p, h)),
            yd(e, Ji(N = d != null && d.type === Tr && d.key == null ? d.props.children : d) ? N : [N], t, n, r, s, o, i, a, c, u),
            l.base = t.__e,
            t.__u &= -161,
            l.__h.length && i.push(l),
            _ && (l.__E = l.__ = null)
        } catch (I) {
            t.__v = null,
            c || o != null ? (t.__e = a,
            t.__u |= c ? 160 : 32,
            o[o.indexOf(a)] = null) : (t.__e = n.__e,
            t.__k = n.__k),
            ae.__e(I, t, n)
        }
    else
        o == null && t.__v === n.__v ? (t.__k = n.__k,
        t.__e = n.__e) : t.__e = dy(n.__e, t, n, r, s, o, i, c, u);
    (d = ae.diffed) && d(t)
}
function fi(e, t, n) {
    for (var r = 0; r < n.length; r++)
        Qi(n[r], n[++r], n[++r]);
    ae.__c && ae.__c(t, e),
    e.some(function(s) {
        try {
            e = s.__h,
            s.__h = [],
            e.some(function(o) {
                o.call(s)
            })
        } catch (o) {
            ae.__e(o, s.__v)
        }
    })
}
function dy(e, t, n, r, s, o, i, a, c) {
    var u, d, l, f, p, h, m, _ = n.props, g = t.props, b = t.type;
    if (b === "svg" && (s = !0),
    o != null) {
        for (u = 0; u < o.length; u++)
            if ((p = o[u]) && "setAttribute"in p == !!b && (b ? p.localName === b : p.nodeType === 3)) {
                e = p,
                o[u] = null;
                break
            }
    }
    if (e == null) {
        if (b === null)
            return document.createTextNode(g);
        e = s ? document.createElementNS("http://www.w3.org/2000/svg", b) : document.createElement(b, g.is && g),
        o = null,
        a = !1
    }
    if (b === null)
        _ === g || a && e.data === g || (e.data = g);
    else {
        if (o = o && eo.call(e.childNodes),
        _ = n.props || cr,
        !a && o != null)
            for (_ = {},
            u = 0; u < e.attributes.length; u++)
                _[(p = e.attributes[u]).name] = p.value;
        for (u in _)
            p = _[u],
            u == "children" || (u == "dangerouslySetInnerHTML" ? l = p : u === "key" || u in g || zr(e, u, null, p, s));
        for (u in g)
            p = g[u],
            u == "children" ? f = p : u == "dangerouslySetInnerHTML" ? d = p : u == "value" ? h = p : u == "checked" ? m = p : u === "key" || a && typeof p != "function" || _[u] === p || zr(e, u, p, _[u], s);
        if (d)
            a || l && (d.__html === l.__html || d.__html === e.innerHTML) || (e.innerHTML = d.__html),
            t.__k = [];
        else if (l && (e.innerHTML = ""),
        yd(e, Ji(f) ? f : [f], t, n, r, s && b !== "foreignObject", o, i, o ? o[0] : n.__k && Ln(n, 0), a, c),
        o != null)
            for (u = o.length; u--; )
                o[u] != null && gd(o[u]);
        a || (u = "value",
        h !== void 0 && (h !== e[u] || b === "progress" && !h || b === "option" && h !== _[u]) && zr(e, u, h, _[u], !1),
        u = "checked",
        m !== void 0 && m !== e[u] && zr(e, u, m, _[u], !1))
    }
    return e
}
function Qi(e, t, n) {
    try {
        typeof e == "function" ? e(t) : e.current = t
    } catch (r) {
        ae.__e(r, n)
    }
}
function pi(e, t, n) {
    var r, s;
    if (ae.unmount && ae.unmount(e),
    (r = e.ref) && (r.current && r.current !== e.__e || Qi(r, null, t)),
    (r = e.__c) != null) {
        if (r.componentWillUnmount)
            try {
                r.componentWillUnmount()
            } catch (o) {
                ae.__e(o, t)
            }
        r.base = r.__P = null,
        e.__c = void 0
    }
    if (r = e.__k)
        for (s = 0; s < r.length; s++)
            r[s] && pi(r[s], t, n || typeof e.type != "function");
    n || e.__e == null || gd(e.__e),
    e.__ = e.__e = e.__d = void 0
}
function fy(e, t, n) {
    return this.constructor(e, n)
}
function py(e, t, n) {
    var r, s, o, i;
    ae.__ && ae.__(e, t),
    s = (r = !1) ? null : t.__k,
    o = [],
    i = [],
    Zi(t, e = t.__k = G(Tr, null, [e]), s || cr, cr, t.ownerSVGElement !== void 0, s ? null : t.firstChild ? eo.call(t.childNodes) : null, o, s ? s.__e : t.firstChild, r, i),
    e.__d = void 0,
    fi(o, e, i)
}
eo = Ki.slice,
ae = {
    __e: function(e, t, n, r) {
        for (var s, o, i; t = t.__; )
            if ((s = t.__c) && !s.__)
                try {
                    if ((o = s.constructor) && o.getDerivedStateFromError != null && (s.setState(o.getDerivedStateFromError(e)),
                    i = s.__d),
                    s.componentDidCatch != null && (s.componentDidCatch(e, r || {}),
                    i = s.__d),
                    i)
                        return s.__E = s
                } catch (a) {
                    e = a
                }
        throw e
    }
},
hd = 0,
ls.prototype.setState = function(e, t) {
    var n;
    n = this.__s != null && this.__s !== this.state ? this.__s : this.__s = xt({}, this.state),
    typeof e == "function" && (e = e(xt({}, n), this.props)),
    e && xt(n, e),
    e != null && this.__v && (t && this._sb.push(t),
    kc(this))
}
,
ls.prototype.forceUpdate = function(e) {
    this.__v && (this.__e = !0,
    e && this.__h.push(e),
    kc(this))
}
,
ls.prototype.render = Tr,
jt = [],
md = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout,
di = function(e, t) {
    return e.__v.__b - t.__v.__b
}
,
As.__r = 0;
var bt, ie, Co, Mc, Pn = 0, bd = [], ds = [], le = ae, Ac = le.__b, Nc = le.__r, Oc = le.diffed, Lc = le.__c, Pc = le.unmount, Dc = le.__;
function an(e, t) {
    le.__h && le.__h(ie, e, Pn || t),
    Pn = 0;
    var n = ie.__H || (ie.__H = {
        __: [],
        __h: []
    });
    return e >= n.__.length && n.__.push({
        __V: ds
    }),
    n.__[e]
}
function qt(e) {
    return Pn = 1,
    Ed(wd, e)
}
function Ed(e, t, n) {
    var r = an(bt++, 2);
    if (r.t = e,
    !r.__c && (r.__ = [n ? n(t) : wd(void 0, t), function(a) {
        var c = r.__N ? r.__N[0] : r.__[0]
          , u = r.t(c, a);
        c !== u && (r.__N = [u, r.__[1]],
        r.__c.setState({}))
    }
    ],
    r.__c = ie,
    !ie.u)) {
        var s = function(a, c, u) {
            if (!r.__c.__H)
                return !0;
            var d = r.__c.__H.__.filter(function(f) {
                return !!f.__c
            });
            if (d.every(function(f) {
                return !f.__N
            }))
                return !o || o.call(this, a, c, u);
            var l = !1;
            return d.forEach(function(f) {
                if (f.__N) {
                    var p = f.__[0];
                    f.__ = f.__N,
                    f.__N = void 0,
                    p !== f.__[0] && (l = !0)
                }
            }),
            !(!l && r.__c.props === a) && (!o || o.call(this, a, c, u))
        };
        ie.u = !0;
        var o = ie.shouldComponentUpdate
          , i = ie.componentWillUpdate;
        ie.componentWillUpdate = function(a, c, u) {
            if (this.__e) {
                var d = o;
                o = void 0,
                s(a, c, u),
                o = d
            }
            i && i.call(this, a, c, u)
        }
        ,
        ie.shouldComponentUpdate = s
    }
    return r.__N || r.__
}
function hy(e, t) {
    var n = an(bt++, 3);
    !le.__s && ea(n.__H, t) && (n.__ = e,
    n.i = t,
    ie.__H.__h.push(n))
}
function vd(e, t) {
    var n = an(bt++, 4);
    !le.__s && ea(n.__H, t) && (n.__ = e,
    n.i = t,
    ie.__h.push(n))
}
function my(e) {
    return Pn = 5,
    Ir(function() {
        return {
            current: e
        }
    }, [])
}
function gy(e, t, n) {
    Pn = 6,
    vd(function() {
        return typeof e == "function" ? (e(t()),
        function() {
            return e(null)
        }
        ) : e ? (e.current = t(),
        function() {
            return e.current = null
        }
        ) : void 0
    }, n == null ? n : n.concat(e))
}
function Ir(e, t) {
    var n = an(bt++, 7);
    return ea(n.__H, t) ? (n.__V = e(),
    n.i = t,
    n.__h = e,
    n.__V) : n.__
}
function Tn(e, t) {
    return Pn = 8,
    Ir(function() {
        return e
    }, t)
}
function _y(e) {
    var t = ie.context[e.__c]
      , n = an(bt++, 9);
    return n.c = e,
    t ? (n.__ == null && (n.__ = !0,
    t.sub(ie)),
    t.props.value) : e.__
}
function yy(e, t) {
    le.useDebugValue && le.useDebugValue(t ? t(e) : e)
}
function Sy(e) {
    var t = an(bt++, 10)
      , n = qt();
    return t.__ = e,
    ie.componentDidCatch || (ie.componentDidCatch = function(r, s) {
        t.__ && t.__(r, s),
        n[1](r)
    }
    ),
    [n[0], function() {
        n[1](void 0)
    }
    ]
}
function by() {
    var e = an(bt++, 11);
    if (!e.__) {
        for (var t = ie.__v; t !== null && !t.__m && t.__ !== null; )
            t = t.__;
        var n = t.__m || (t.__m = [0, 0]);
        e.__ = "P" + n[0] + "-" + n[1]++
    }
    return e.__
}
function Ey() {
    for (var e; e = bd.shift(); )
        if (e.__P && e.__H)
            try {
                e.__H.__h.forEach(fs),
                e.__H.__h.forEach(hi),
                e.__H.__h = []
            } catch (t) {
                e.__H.__h = [],
                le.__e(t, e.__v)
            }
}
le.__b = function(e) {
    ie = null,
    Ac && Ac(e)
}
,
le.__ = function(e, t) {
    t.__k && t.__k.__m && (e.__m = t.__k.__m),
    Dc && Dc(e, t)
}
,
le.__r = function(e) {
    Nc && Nc(e),
    bt = 0;
    var t = (ie = e.__c).__H;
    t && (Co === ie ? (t.__h = [],
    ie.__h = [],
    t.__.forEach(function(n) {
        n.__N && (n.__ = n.__N),
        n.__V = ds,
        n.__N = n.i = void 0
    })) : (t.__h.forEach(fs),
    t.__h.forEach(hi),
    t.__h = [],
    bt = 0)),
    Co = ie
}
,
le.diffed = function(e) {
    Oc && Oc(e);
    var t = e.__c;
    t && t.__H && (t.__H.__h.length && (bd.push(t) !== 1 && Mc === le.requestAnimationFrame || ((Mc = le.requestAnimationFrame) || vy)(Ey)),
    t.__H.__.forEach(function(n) {
        n.i && (n.__H = n.i),
        n.__V !== ds && (n.__ = n.__V),
        n.i = void 0,
        n.__V = ds
    })),
    Co = ie = null
}
,
le.__c = function(e, t) {
    t.some(function(n) {
        try {
            n.__h.forEach(fs),
            n.__h = n.__h.filter(function(r) {
                return !r.__ || hi(r)
            })
        } catch (r) {
            t.some(function(s) {
                s.__h && (s.__h = [])
            }),
            t = [],
            le.__e(r, n.__v)
        }
    }),
    Lc && Lc(e, t)
}
,
le.unmount = function(e) {
    Pc && Pc(e);
    var t, n = e.__c;
    n && n.__H && (n.__H.__.forEach(function(r) {
        try {
            fs(r)
        } catch (s) {
            t = s
        }
    }),
    n.__H = void 0,
    t && le.__e(t, n.__v))
}
;
var Fc = typeof requestAnimationFrame == "function";
function vy(e) {
    var t, n = function() {
        clearTimeout(r),
        Fc && cancelAnimationFrame(t),
        setTimeout(e)
    }, r = setTimeout(n, 100);
    Fc && (t = requestAnimationFrame(n))
}
function fs(e) {
    var t = ie
      , n = e.__c;
    typeof n == "function" && (e.__c = void 0,
    n()),
    ie = t
}
function hi(e) {
    var t = ie;
    e.__c = e.__(),
    ie = t
}
function ea(e, t) {
    return !e || e.length !== t.length || t.some(function(n, r) {
        return n !== e[r]
    })
}
function wd(e, t) {
    return typeof t == "function" ? t(e) : t
}
const wy = Object.defineProperty({
    __proto__: null,
    useCallback: Tn,
    useContext: _y,
    useDebugValue: yy,
    useEffect: hy,
    useErrorBoundary: Sy,
    useId: by,
    useImperativeHandle: gy,
    useLayoutEffect: vd,
    useMemo: Ir,
    useReducer: Ed,
    useRef: my,
    useState: qt
}, Symbol.toStringTag, {
    value: "Module"
})
  , Ty = "http://www.w3.org/2000/svg";
function Iy() {
    const e = r => oe.createElementNS(Ty, r)
      , t = $e(e("svg"), {
        width: "32",
        height: "30",
        viewBox: "0 0 72 66",
        fill: "inherit"
    })
      , n = $e(e("path"), {
        transform: "translate(11, 11)",
        d: "M29,2.26a4.67,4.67,0,0,0-8,0L14.42,13.53A32.21,32.21,0,0,1,32.17,40.19H27.55A27.68,27.68,0,0,0,12.09,17.47L6,28a15.92,15.92,0,0,1,9.23,12.17H4.62A.76.76,0,0,1,4,39.06l2.94-5a10.74,10.74,0,0,0-3.36-1.9l-2.91,5a4.54,4.54,0,0,0,1.69,6.24A4.66,4.66,0,0,0,4.62,44H19.15a19.4,19.4,0,0,0-8-17.31l2.31-4A23.87,23.87,0,0,1,23.76,44H36.07a35.88,35.88,0,0,0-16.41-31.8l4.67-8a.77.77,0,0,1,1.05-.27c.53.29,20.29,34.77,20.66,35.17a.76.76,0,0,1-.68,1.13H40.6q.09,1.91,0,3.81h4.78A4.59,4.59,0,0,0,50,39.43a4.49,4.49,0,0,0-.62-2.28Z"
    });
    return t.appendChild(n),
    t
}
function ky({options: e}) {
    const t = Ir( () => ({
        __html: Iy().outerHTML
    }), []);
    return G("h2", {
        class: "dialog__header"
    }, G("span", {
        class: "dialog__title"
    }, e.formTitle), e.showBranding ? G("a", {
        class: "brand-link",
        target: "_blank",
        href: "https://sentry.io/welcome/",
        title: "Powered by Sentry",
        rel: "noopener noreferrer",
        dangerouslySetInnerHTML: t
    }) : null)
}
function Cy(e, t) {
    const n = [];
    return t.isNameRequired && !e.name && n.push(t.nameLabel),
    t.isEmailRequired && !e.email && n.push(t.emailLabel),
    e.message || n.push(t.messageLabel),
    n
}
function Ro(e, t) {
    const n = e.get(t);
    return typeof n == "string" ? n.trim() : ""
}
function Ry({options: e, defaultEmail: t, defaultName: n, onFormClose: r, onSubmit: s, onSubmitSuccess: o, onSubmitError: i, showEmail: a, showName: c, screenshotInput: u}) {
    const {tags: d, addScreenshotButtonLabel: l, removeScreenshotButtonLabel: f, cancelButtonLabel: p, emailLabel: h, emailPlaceholder: m, isEmailRequired: _, isNameRequired: g, messageLabel: b, messagePlaceholder: T, nameLabel: C, namePlaceholder: S, submitButtonLabel: E, isRequiredLabel: k} = e
      , [N,w] = qt(!1)
      , [I,F] = qt(null)
      , [v,R] = qt(!1)
      , A = u == null ? void 0 : u.input
      , [U,O] = qt(null)
      , X = Tn(Q => {
        O(Q),
        R(!1)
    }
    , [])
      , D = Tn(Q => {
        const Te = Cy(Q, {
            emailLabel: h,
            isEmailRequired: _,
            isNameRequired: g,
            messageLabel: b,
            nameLabel: C
        });
        return Te.length > 0 ? F(`Please enter in the following required fields: ${Te.join(", ")}`) : F(null),
        Te.length === 0
    }
    , [h, _, g, b, C])
      , K = Tn(async Q => {
        w(!0);
        try {
            if (Q.preventDefault(),
            !(Q.target instanceof HTMLFormElement))
                return;
            const Te = new FormData(Q.target)
              , un = await (u && v ? u.value() : void 0)
              , Pe = {
                name: Ro(Te, "name"),
                email: Ro(Te, "email"),
                message: Ro(Te, "message"),
                attachments: un ? [un] : void 0
            };
            if (!D(Pe))
                return;
            try {
                await s({
                    name: Pe.name,
                    email: Pe.email,
                    message: Pe.message,
                    source: K_,
                    tags: d
                }, {
                    attachments: Pe.attachments
                }),
                o(Pe)
            } catch (Ce) {
                cs && y.error(Ce),
                F(Ce),
                i(Ce)
            }
        } finally {
            w(!1)
        }
    }
    , [u && v, o, i]);
    return G("form", {
        class: "form",
        onSubmit: K
    }, A && v ? G(A, {
        onError: X
    }) : null, G("fieldset", {
        class: "form__right",
        "data-sentry-feedback": !0,
        disabled: N
    }, G("div", {
        class: "form__top"
    }, I ? G("div", {
        class: "form__error-container"
    }, I) : null, c ? G("label", {
        for: "name",
        class: "form__label"
    }, G(xo, {
        label: C,
        isRequiredLabel: k,
        isRequired: g
    }), G("input", {
        class: "form__input",
        defaultValue: n,
        id: "name",
        name: "name",
        placeholder: S,
        required: g,
        type: "text"
    })) : G("input", {
        "aria-hidden": !0,
        value: n,
        name: "name",
        type: "hidden"
    }), a ? G("label", {
        for: "email",
        class: "form__label"
    }, G(xo, {
        label: h,
        isRequiredLabel: k,
        isRequired: _
    }), G("input", {
        class: "form__input",
        defaultValue: t,
        id: "email",
        name: "email",
        placeholder: m,
        required: _,
        type: "email"
    })) : G("input", {
        "aria-hidden": !0,
        value: t,
        name: "email",
        type: "hidden"
    }), G("label", {
        for: "message",
        class: "form__label"
    }, G(xo, {
        label: b,
        isRequiredLabel: k,
        isRequired: !0
    }), G("textarea", {
        autoFocus: !0,
        class: "form__input form__input--textarea",
        id: "message",
        name: "message",
        placeholder: T,
        required: !0,
        rows: 5
    })), A ? G("label", {
        for: "screenshot",
        class: "form__label"
    }, G("button", {
        class: "btn btn--default",
        disabled: N,
        type: "button",
        onClick: () => {
            O(null),
            R(Q => !Q)
        }
    }, v ? f : l), U ? G("div", {
        class: "form__error-container"
    }, U.message) : null) : null), G("div", {
        class: "btn-group"
    }, G("button", {
        class: "btn btn--primary",
        disabled: N,
        type: "submit"
    }, E), G("button", {
        class: "btn btn--default",
        disabled: N,
        type: "button",
        onClick: r
    }, p))))
}
function xo({label: e, isRequired: t, isRequiredLabel: n}) {
    return G("span", {
        class: "form__label__text"
    }, e, t && G("span", {
        class: "form__label__text--required"
    }, n))
}
const jr = 16
  , $c = 17
  , xy = "http://www.w3.org/2000/svg";
function My() {
    const e = c => Xe.document.createElementNS(xy, c)
      , t = $e(e("svg"), {
        width: `${jr}`,
        height: `${$c}`,
        viewBox: `0 0 ${jr} ${$c}`,
        fill: "inherit"
    })
      , n = $e(e("g"), {
        clipPath: "url(#clip0_57_156)"
    })
      , r = $e(e("path"), {
        "fill-rule": "evenodd",
        "clip-rule": "evenodd",
        d: "M3.55544 15.1518C4.87103 16.0308 6.41775 16.5 8 16.5C10.1217 16.5 12.1566 15.6571 13.6569 14.1569C15.1571 12.6566 16 10.6217 16 8.5C16 6.91775 15.5308 5.37103 14.6518 4.05544C13.7727 2.73985 12.5233 1.71447 11.0615 1.10897C9.59966 0.503466 7.99113 0.34504 6.43928 0.653721C4.88743 0.962403 3.46197 1.72433 2.34315 2.84315C1.22433 3.96197 0.462403 5.38743 0.153721 6.93928C-0.15496 8.49113 0.00346625 10.0997 0.608967 11.5615C1.21447 13.0233 2.23985 14.2727 3.55544 15.1518ZM4.40546 3.1204C5.46945 2.40946 6.72036 2.03 8 2.03C9.71595 2.03 11.3616 2.71166 12.575 3.92502C13.7883 5.13838 14.47 6.78405 14.47 8.5C14.47 9.77965 14.0905 11.0306 13.3796 12.0945C12.6687 13.1585 11.6582 13.9878 10.476 14.4775C9.29373 14.9672 7.99283 15.0953 6.73777 14.8457C5.48271 14.596 4.32987 13.9798 3.42502 13.075C2.52018 12.1701 1.90397 11.0173 1.65432 9.76224C1.40468 8.50718 1.5328 7.20628 2.0225 6.02404C2.5122 4.8418 3.34148 3.83133 4.40546 3.1204Z"
    })
      , s = $e(e("path"), {
        d: "M6.68775 12.4297C6.78586 12.4745 6.89218 12.4984 7 12.5C7.11275 12.4955 7.22315 12.4664 7.32337 12.4145C7.4236 12.3627 7.51121 12.2894 7.58 12.2L12 5.63999C12.0848 5.47724 12.1071 5.28902 12.0625 5.11098C12.0178 4.93294 11.9095 4.77744 11.7579 4.67392C11.6064 4.57041 11.4221 4.52608 11.24 4.54931C11.0579 4.57254 10.8907 4.66173 10.77 4.79999L6.88 10.57L5.13 8.56999C5.06508 8.49566 4.98613 8.43488 4.89768 8.39111C4.80922 8.34735 4.713 8.32148 4.61453 8.31498C4.51605 8.30847 4.41727 8.32147 4.32382 8.35322C4.23038 8.38497 4.14413 8.43484 4.07 8.49999C3.92511 8.63217 3.83692 8.81523 3.82387 9.01092C3.81083 9.2066 3.87393 9.39976 4 9.54999L6.43 12.24C6.50187 12.3204 6.58964 12.385 6.68775 12.4297Z"
    });
    t.appendChild(n).append(s, r);
    const o = e("defs")
      , i = $e(e("clipPath"), {
        id: "clip0_57_156"
    })
      , a = $e(e("rect"), {
        width: `${jr}`,
        height: `${jr}`,
        fill: "white",
        transform: "translate(0 0.5)"
    });
    return i.appendChild(a),
    o.appendChild(i),
    t.appendChild(o).appendChild(i).appendChild(a),
    t
}
function Ay({open: e, onFormSubmitted: t, ...n}) {
    const r = n.options
      , s = Ir( () => ({
        __html: My().outerHTML
    }), [])
      , [o,i] = qt(null)
      , a = Tn( () => {
        o && (clearTimeout(o),
        i(null)),
        t()
    }
    , [o])
      , c = Tn(u => {
        n.onSubmitSuccess(u),
        i(setTimeout( () => {
            t(),
            i(null)
        }
        , Z_))
    }
    , [t]);
    return G(Tr, null, o ? G("div", {
        class: "success__position",
        onClick: a
    }, G("div", {
        class: "success__content"
    }, r.successMessageText, G("span", {
        class: "success__icon",
        dangerouslySetInnerHTML: s
    }))) : G("dialog", {
        class: "dialog",
        onClick: r.onFormClose,
        open: e
    }, G("div", {
        class: "dialog__position"
    }, G("div", {
        class: "dialog__content",
        onClick: u => {
            u.stopPropagation()
        }
    }, G(ky, {
        options: r
    }), G(Ry, {
        ...n,
        onSubmitSuccess: c
    })))))
}
const Ny = `
.dialog {
  position: fixed;
  z-index: var(--z-index);
  margin: 0;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  height: 100vh;
  width: 100vw;

  color: var(--dialog-color, var(--foreground));
  fill: var(--dialog-color, var(--foreground));
  line-height: 1.75em;

  background-color: rgba(0, 0, 0, 0.05);
  border: none;
  inset: 0;
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}

.dialog__position {
  position: fixed;
  z-index: var(--z-index);
  inset: var(--dialog-inset);
  padding: var(--page-margin);
  display: flex;
  max-height: calc(100vh - (2 * var(--page-margin)));
}
@media (max-width: 600px) {
  .dialog__position {
    inset: var(--page-margin);
    padding: 0;
  }
}

.dialog__position:has(.editor) {
  inset: var(--page-margin);
  padding: 0;
}

.dialog:not([open]) {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
}
.dialog:not([open]) .dialog__content {
  transform: translate(0, -16px) scale(0.98);
}

.dialog__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: var(--dialog-padding, 24px);
  max-width: 100%;
  width: 100%;
  max-height: 100%;
  overflow: auto;

  background: var(--dialog-background, var(--background));
  border-radius: var(--dialog-border-radius, 20px);
  border: var(--dialog-border, var(--border));
  box-shadow: var(--dialog-box-shadow, var(--box-shadow));
  transform: translate(0, 0) scale(1);
  transition: transform 0.2s ease-in-out;
}

`
  , Oy = `
.dialog__header {
  display: flex;
  gap: 4px;
  justify-content: space-between;
  font-weight: var(--dialog-header-weight, 600);
  margin: 0;
}
.dialog__title {
  align-self: center;
  width: var(--form-width, 272px);
}

@media (max-width: 600px) {
  .dialog__title {
    width: auto;
  }
}

.dialog__position:has(.editor) .dialog__title {
  width: auto;
}


.brand-link {
  display: inline-flex;
}
.brand-link:focus-visible {
  outline: var(--outline);
}
`
  , Ly = `
.form {
  display: flex;
  overflow: auto;
  flex-direction: row;
  gap: 16px;
  flex: 1 0;
}

.form fieldset {
  border: none;
  margin: 0;
  padding: 0;
}

.form__right {
  flex: 0 0 auto;
  display: flex;
  overflow: auto;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  width: var(--form-width, 100%);
}

.dialog__position:has(.editor) .form__right {
  width: var(--form-width, 272px);
}

.form__top {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form__error-container {
  color: var(--error-color);
  fill: var(--error-color);
}

.form__label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0px;
}

.form__label__text {
  display: flex;
  gap: 4px;
  align-items: center;
}

.form__label__text--required {
  font-size: 0.85em;
}

.form__input {
  font-family: inherit;
  line-height: inherit;
  background: transparent;
  box-sizing: border-box;
  border: var(--input-border, var(--border));
  border-radius: var(--input-border-radius, 6px);
  color: var(--input-color, inherit);
  fill: var(--input-color, inherit);
  font-size: var(--input-font-size, inherit);
  font-weight: var(--input-font-weight, 500);
  padding: 6px 12px;
}

.form__input::placeholder {
  opacity: 0.65;
  color: var(--input-placeholder-color, inherit);
  filter: var(--interactive-filter);
}

.form__input:focus-visible {
  outline: var(--input-focus-outline, var(--outline));
}

.form__input--textarea {
  font-family: inherit;
  resize: vertical;
}

.error {
  color: var(--error-color);
  fill: var(--error-color);
}
`
  , Py = `
.btn-group {
  display: grid;
  gap: 8px;
}

.btn {
  line-height: inherit;
  border: var(--button-border, var(--border));
  border-radius: var(--button-border-radius, 6px);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--button-font-size, inherit);
  font-weight: var(--button-font-weight, 600);
  padding: var(--button-padding, 6px 16px);
}
.btn[disabled] {
  opacity: 0.6;
  pointer-events: none;
}

.btn--primary {
  color: var(--button-primary-color, var(--accent-foreground));
  fill: var(--button-primary-color, var(--accent-foreground));
  background: var(--button-primary-background, var(--accent-background));
  border: var(--button-primary-border, var(--border));
  border-radius: var(--button-primary-border-radius, 6px);
  font-weight: var(--button-primary-font-weight, 500);
}
.btn--primary:hover {
  color: var(--button-primary-hover-color, var(--accent-foreground));
  fill: var(--button-primary-hover-color, var(--accent-foreground));
  background: var(--button-primary-hover-background, var(--accent-background));
  filter: var(--interactive-filter);
}
.btn--primary:focus-visible {
  background: var(--button-primary-hover-background, var(--accent-background));
  filter: var(--interactive-filter);
  outline: var(--button-primary-focus-outline, var(--outline));
}

.btn--default {
  color: var(--button-color, var(--foreground));
  fill: var(--button-color, var(--foreground));
  background: var(--button-background, var(--background));
  border: var(--button-border, var(--border));
  border-radius: var(--button-border-radius, 6px);
  font-weight: var(--button-font-weight, 500);
}
.btn--default:hover {
  color: var(--button-color, var(--foreground));
  fill: var(--button-color, var(--foreground));
  background: var(--button-hover-background, var(--background));
  filter: var(--interactive-filter);
}
.btn--default:focus-visible {
  background: var(--button-hover-background, var(--background));
  filter: var(--interactive-filter);
  outline: var(--button-focus-outline, var(--outline));
}
`
  , Dy = `
.success__position {
  position: fixed;
  inset: var(--dialog-inset);
  padding: var(--page-margin);
  z-index: var(--z-index);
}
.success__content {
  background: var(--success-background, var(--background));
  border: var(--success-border, var(--border));
  border-radius: var(--success-border-radius, 1.7em/50%);
  box-shadow: var(--success-box-shadow, var(--box-shadow));
  font-weight: var(--success-font-weight, 600);
  color: var(--success-color);
  fill: var(--success-color);
  padding: 12px 24px;
  line-height: 1.75em;

  display: grid;
  align-items: center;
  grid-auto-flow: column;
  gap: 6px;
  cursor: default;
}

.success__icon {
  display: flex;
}
`;
function Fy(e) {
    const t = oe.createElement("style");
    return t.textContent = `
:host {
  --dialog-inset: var(--inset);
}

${Ny}
${Oy}
${Ly}
${Py}
${Dy}
`,
    e && t.setAttribute("nonce", e),
    t
}
function $y() {
    const e = j().getUser()
      , t = we().getUser()
      , n = Xs().getUser();
    return e && Object.keys(e).length ? e : t && Object.keys(t).length ? t : n
}
const By = () => ({
    name: "FeedbackModal",
    setupOnce() {},
    createDialog: ({options: e, screenshotIntegration: t, sendFeedback: n, shadow: r}) => {
        const s = r
          , o = e.useSentryUser
          , i = $y()
          , a = oe.createElement("div")
          , c = Fy(e.styleNonce);
        let u = "";
        const d = {
            get el() {
                return a
            },
            appendToDom() {
                !s.contains(c) && !s.contains(a) && (s.appendChild(c),
                s.appendChild(a))
            },
            removeFromDom() {
                a.remove(),
                c.remove(),
                oe.body.style.overflow = u
            },
            open() {
                var p, h;
                f(!0),
                (p = e.onFormOpen) == null || p.call(e),
                (h = M()) == null || h.emit("openFeedbackWidget"),
                u = oe.body.style.overflow,
                oe.body.style.overflow = "hidden"
            },
            close() {
                f(!1),
                oe.body.style.overflow = u
            }
        }
          , l = t == null ? void 0 : t.createInput({
            h: G,
            hooks: wy,
            dialog: d,
            options: e
        })
          , f = p => {
            py(G(Ay, {
                options: e,
                screenshotInput: l,
                showName: e.showName || e.isNameRequired,
                showEmail: e.showEmail || e.isEmailRequired,
                defaultName: o && i && i[o.name] || "",
                defaultEmail: o && i && i[o.email] || "",
                onFormClose: () => {
                    var h;
                    f(!1),
                    (h = e.onFormClose) == null || h.call(e)
                }
                ,
                onSubmit: n,
                onSubmitSuccess: h => {
                    var m;
                    f(!1),
                    (m = e.onSubmitSuccess) == null || m.call(e, h)
                }
                ,
                onSubmitError: h => {
                    var m;
                    (m = e.onSubmitError) == null || m.call(e, h)
                }
                ,
                onFormSubmitted: () => {
                    var h;
                    (h = e.onFormSubmitted) == null || h.call(e)
                }
                ,
                open: p
            }), a)
        }
        ;
        return d
    }
});
function Uy({h: e}) {
    return function() {
        return e("svg", {
            "data-test-id": "icon-close",
            viewBox: "0 0 16 16",
            fill: "#2B2233",
            height: "25px",
            width: "25px"
        }, e("circle", {
            r: "7",
            cx: "8",
            cy: "8",
            fill: "white"
        }), e("path", {
            strokeWidth: "1.5",
            d: "M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM8,1.53A6.47,6.47,0,1,0,14.47,8,6.47,6.47,0,0,0,8,1.53Z"
        }), e("path", {
            strokeWidth: "1.5",
            d: "M5.34,11.41a.71.71,0,0,1-.53-.22.74.74,0,0,1,0-1.06l5.32-5.32a.75.75,0,0,1,1.06,1.06L5.87,11.19A.74.74,0,0,1,5.34,11.41Z"
        }), e("path", {
            strokeWidth: "1.5",
            d: "M10.66,11.41a.74.74,0,0,1-.53-.22L4.81,5.87A.75.75,0,0,1,5.87,4.81l5.32,5.32a.74.74,0,0,1,0,1.06A.71.71,0,0,1,10.66,11.41Z"
        }))
    }
}
function Hy(e) {
    const t = oe.createElement("style")
      , n = "#1A141F"
      , r = "#302735";
    return t.textContent = `
.editor {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
}

.editor__image-container {
  justify-items: center;
  padding: 15px;
  position: relative;
  height: 100%;
  border-radius: var(--menu-border-radius, 6px);

  background-color: ${n};
  background-image: repeating-linear-gradient(
      -145deg,
      transparent,
      transparent 8px,
      ${n} 8px,
      ${n} 11px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 15px,
      ${r} 15px,
      ${r} 16px
    );
}

.editor__canvas-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor__canvas-container > * {
  object-fit: contain;
  position: absolute;
}

.editor__tool-container {
  padding-top: 8px;
  display: flex;
  justify-content: center;
}

.editor__tool-bar {
  display: flex;
  gap: 8px;
}

.editor__tool {
  display: flex;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  border: var(--button-border, var(--border));
  border-radius: var(--button-border-radius, 6px);
  background: var(--button-background, var(--background));
  color: var(--button-color, var(--foreground));
}

.editor__tool--active {
  background: var(--button-primary-background, var(--accent-background));
  color: var(--button-primary-color, var(--accent-foreground));
}

.editor__rect {
  position: absolute;
  z-index: 2;
}

.editor__rect button {
  opacity: 0;
  position: absolute;
  top: -12px;
  right: -12px;
  cursor: pointer;
  padding: 0;
  z-index: 3;
  border: none;
  background: none;
}

.editor__rect:hover button {
  opacity: 1;
}
`,
    e && t.setAttribute("nonce", e),
    t
}
function Wy({h: e}) {
    return function({action: n, setAction: r}) {
        return e("div", {
            class: "editor__tool-container"
        }, e("div", {
            class: "editor__tool-bar"
        }, e("button", {
            type: "button",
            class: `editor__tool ${n === "highlight" ? "editor__tool--active" : ""}`,
            onClick: () => {
                r(n === "highlight" ? "" : "highlight")
            }
        }, "Highlight"), e("button", {
            type: "button",
            class: `editor__tool ${n === "hide" ? "editor__tool--active" : ""}`,
            onClick: () => {
                r(n === "hide" ? "" : "hide")
            }
        }, "Hide")))
    }
}
function zy({hooks: e}) {
    function t() {
        const [n,r] = e.useState(Xe.devicePixelRatio ?? 1);
        return e.useEffect( () => {
            const s = () => {
                r(Xe.devicePixelRatio)
            }
              , o = matchMedia(`(resolution: ${Xe.devicePixelRatio}dppx)`);
            return o.addEventListener("change", s),
            () => {
                o.removeEventListener("change", s)
            }
        }
        , []),
        n
    }
    return function({onBeforeScreenshot: r, onScreenshot: s, onAfterScreenshot: o, onError: i}) {
        const a = t();
        e.useEffect( () => {
            (async () => {
                r();
                const u = await er.mediaDevices.getDisplayMedia({
                    video: {
                        width: Xe.innerWidth * a,
                        height: Xe.innerHeight * a
                    },
                    audio: !1,
                    monitorTypeSurfaces: "exclude",
                    preferCurrentTab: !0,
                    selfBrowserSurface: "include",
                    surfaceSwitching: "exclude"
                })
                  , d = oe.createElement("video");
                await new Promise( (l, f) => {
                    d.srcObject = u,
                    d.onloadedmetadata = () => {
                        s(d, a),
                        u.getTracks().forEach(p => p.stop()),
                        l()
                    }
                    ,
                    d.play().catch(f)
                }
                ),
                o()
            }
            )().catch(i)
        }
        , [])
    }
}
function jy(e, t, n) {
    switch (e.type) {
    case "highlight":
        {
            t.shadowColor = "rgba(0, 0, 0, 0.7)",
            t.shadowBlur = 50,
            t.fillStyle = n,
            t.fillRect(e.x - 1, e.y - 1, e.w + 2, e.h + 2),
            t.clearRect(e.x, e.y, e.w, e.h);
            break
        }
    case "hide":
        t.fillStyle = "rgb(0, 0, 0)",
        t.fillRect(e.x, e.y, e.w, e.h);
        break
    }
}
function kt(e, t, n) {
    if (!e)
        return;
    const r = e.getContext("2d", t);
    r && n(e, r)
}
function Mo(e, t) {
    kt(e, {
        alpha: !0
    }, (n, r) => {
        r.drawImage(t, 0, 0, t.width, t.height, 0, 0, n.width, n.height)
    }
    )
}
function Ao(e, t, n) {
    kt(e, {
        alpha: !0
    }, (r, s) => {
        n.length && (s.fillStyle = "rgba(0, 0, 0, 0.25)",
        s.fillRect(0, 0, r.width, r.height)),
        n.forEach(o => {
            jy(o, s, t)
        }
        )
    }
    )
}
function qy({h: e, hooks: t, outputBuffer: n, dialog: r, options: s}) {
    const o = zy({
        hooks: t
    })
      , i = Wy({
        h: e
    })
      , a = Uy({
        h: e
    })
      , c = {
        __html: Hy(s.styleNonce).innerText
    }
      , u = r.el.style
      , d = ({screenshot: l}) => {
        const [f,p] = t.useState("highlight")
          , [h,m] = t.useState([])
          , _ = t.useRef(null)
          , g = t.useRef(null)
          , b = t.useRef(null)
          , T = t.useRef(null)
          , [C,S] = t.useState(1)
          , E = t.useMemo( () => {
            const v = oe.getElementById(s.id);
            if (!v)
                return "white";
            const R = getComputedStyle(v);
            return R.getPropertyValue("--button-primary-background") || R.getPropertyValue("--accent-background")
        }
        , [s.id]);
        t.useLayoutEffect( () => {
            const v = () => {
                const R = _.current;
                R && (kt(l.canvas, {
                    alpha: !1
                }, A => {
                    const U = Math.min(R.clientWidth / A.width, R.clientHeight / A.height);
                    S(U)
                }
                ),
                (R.clientHeight === 0 || R.clientWidth === 0) && setTimeout(v, 0))
            }
            ;
            return v(),
            Xe.addEventListener("resize", v),
            () => {
                Xe.removeEventListener("resize", v)
            }
        }
        , [l]);
        const k = t.useCallback( (v, R) => {
            kt(v, {
                alpha: !0
            }, (A, U) => {
                U.scale(R, R),
                A.width = l.canvas.width,
                A.height = l.canvas.height
            }
            )
        }
        , [l]);
        t.useEffect( () => {
            k(g.current, l.dpi),
            Mo(g.current, l.canvas)
        }
        , [l]),
        t.useEffect( () => {
            k(b.current, l.dpi),
            kt(b.current, {
                alpha: !0
            }, (v, R) => {
                R.clearRect(0, 0, v.width, v.height)
            }
            ),
            Ao(b.current, E, h)
        }
        , [h, E]),
        t.useEffect( () => {
            k(n, l.dpi),
            Mo(n, l.canvas),
            kt(oe.createElement("canvas"), {
                alpha: !0
            }, (v, R) => {
                R.scale(l.dpi, l.dpi),
                v.width = l.canvas.width,
                v.height = l.canvas.height,
                Ao(v, E, h),
                Mo(n, v)
            }
            )
        }
        , [h, l, E]);
        const N = v => {
            if (!f || !T.current)
                return;
            const R = T.current.getBoundingClientRect()
              , A = {
                type: f,
                x: v.offsetX / C,
                y: v.offsetY / C
            }
              , U = (D, K) => {
                const Q = (K.clientX - R.x) / C
                  , Te = (K.clientY - R.y) / C;
                return {
                    type: D.type,
                    x: Math.min(D.x, Q),
                    y: Math.min(D.y, Te),
                    w: Math.abs(Q - D.x),
                    h: Math.abs(Te - D.y)
                }
            }
              , O = D => {
                kt(b.current, {
                    alpha: !0
                }, (K, Q) => {
                    Q.clearRect(0, 0, K.width, K.height)
                }
                ),
                Ao(b.current, E, [...h, U(A, D)])
            }
              , X = D => {
                const K = U(A, D);
                K.w * C >= 1 && K.h * C >= 1 && m(Q => [...Q, K]),
                oe.removeEventListener("mousemove", O),
                oe.removeEventListener("mouseup", X)
            }
            ;
            oe.addEventListener("mousemove", O),
            oe.addEventListener("mouseup", X)
        }
          , w = t.useCallback(v => R => {
            R.preventDefault(),
            R.stopPropagation(),
            m(A => {
                const U = [...A];
                return U.splice(v, 1),
                U
            }
            )
        }
        , [])
          , I = {
            width: `${l.canvas.width * C}px`,
            height: `${l.canvas.height * C}px`
        }
          , F = v => {
            v.stopPropagation()
        }
        ;
        return e("div", {
            class: "editor"
        }, e("style", {
            nonce: s.styleNonce,
            dangerouslySetInnerHTML: c
        }), e("div", {
            class: "editor__image-container"
        }, e("div", {
            class: "editor__canvas-container",
            ref: _
        }, e("canvas", {
            ref: g,
            id: "background",
            style: I
        }), e("canvas", {
            ref: b,
            id: "foreground",
            style: I
        }), e("div", {
            ref: T,
            onMouseDown: N,
            style: I
        }, h.map( (v, R) => e("div", {
            key: R,
            class: "editor__rect",
            style: {
                top: `${v.y * C}px`,
                left: `${v.x * C}px`,
                width: `${v.w * C}px`,
                height: `${v.h * C}px`
            }
        }, e("button", {
            "aria-label": "Remove",
            onClick: w(R),
            onMouseDown: F,
            onMouseUp: F,
            type: "button"
        }, e(a, null))))))), e(i, {
            action: f,
            setAction: p
        }))
    }
    ;
    return function({onError: f}) {
        const [p,h] = t.useState();
        return o({
            onBeforeScreenshot: t.useCallback( () => {
                u.display = "none"
            }
            , []),
            onScreenshot: t.useCallback( (m, _) => {
                kt(oe.createElement("canvas"), {
                    alpha: !1
                }, (g, b) => {
                    b.scale(_, _),
                    g.width = m.videoWidth,
                    g.height = m.videoHeight,
                    b.drawImage(m, 0, 0, g.width, g.height),
                    h({
                        canvas: g,
                        dpi: _
                    })
                }
                ),
                n.width = m.videoWidth,
                n.height = m.videoHeight
            }
            , []),
            onAfterScreenshot: t.useCallback( () => {
                u.display = "block"
            }
            , []),
            onError: t.useCallback(m => {
                u.display = "block",
                f(m)
            }
            , [])
        }),
        p ? e(d, {
            screenshot: p
        }) : e("div", null)
    }
}
const Gy = () => ({
    name: "FeedbackScreenshot",
    setupOnce() {},
    createInput: ({h: e, hooks: t, dialog: n, options: r}) => {
        const s = oe.createElement("canvas");
        return {
            input: qy({
                h: e,
                hooks: t,
                outputBuffer: s,
                dialog: n,
                options: r
            }),
            value: async () => {
                const o = await new Promise(i => {
                    s.toBlob(i, "image/png")
                }
                );
                if (o)
                    return {
                        data: new Uint8Array(await o.arrayBuffer()),
                        filename: "screenshot.png",
                        contentType: "application/png"
                    }
            }
        }
    }
})
  , L = P;
let mi = 0;
function Td() {
    return mi > 0
}
function Vy() {
    mi++,
    setTimeout( () => {
        mi--
    }
    )
}
function Dn(e, t={}) {
    function n(s) {
        return typeof s == "function"
    }
    if (!n(e))
        return e;
    try {
        const s = e.__sentry_wrapped__;
        if (s)
            return typeof s == "function" ? s : e;
        if (Pi(e))
            return e
    } catch {
        return e
    }
    const r = function(...s) {
        try {
            const o = s.map(i => Dn(i, t));
            return e.apply(this, o)
        } catch (o) {
            throw Vy(),
            Be(i => {
                i.addEventProcessor(a => (t.mechanism && (Ko(a, void 0),
                Pt(a, t.mechanism)),
                a.extra = {
                    ...a.extra,
                    arguments: s
                },
                a)),
                tn(o)
            }
            ),
            o
        }
    };
    try {
        for (const s in e)
            Object.prototype.hasOwnProperty.call(e, s) && (r[s] = e[s])
    } catch {}
    rl(r, e),
    Ne(e, "__sentry_wrapped__", r);
    try {
        Object.getOwnPropertyDescriptor(r, "name").configurable && Object.defineProperty(r, "name", {
            get() {
                return e.name
            }
        })
    } catch {}
    return r
}
function gi() {
    const e = rn()
      , {referrer: t} = L.document || {}
      , {userAgent: n} = L.navigator || {}
      , r = {
        ...t && {
            Referer: t
        },
        ...n && {
            "User-Agent": n
        }
    };
    return {
        url: e,
        headers: r
    }
}
const Yy = {
    replayIntegration: "replay",
    replayCanvasIntegration: "replay-canvas",
    feedbackIntegration: "feedback",
    feedbackModalIntegration: "feedback-modal",
    feedbackScreenshotIntegration: "feedback-screenshot",
    captureConsoleIntegration: "captureconsole",
    contextLinesIntegration: "contextlines",
    linkedErrorsIntegration: "linkederrors",
    dedupeIntegration: "dedupe",
    extraErrorDataIntegration: "extraerrordata",
    graphqlClientIntegration: "graphqlclient",
    httpClientIntegration: "httpclient",
    reportingObserverIntegration: "reportingobserver",
    rewriteFramesIntegration: "rewriteframes",
    browserProfilingIntegration: "browserprofiling",
    moduleMetadataIntegration: "modulemetadata"
}
  , Bc = L;
async function Xy(e, t) {
    const n = Yy[e]
      , r = Bc.Sentry = Bc.Sentry || {};
    if (!n)
        throw new Error(`Cannot lazy load integration: ${e}`);
    const s = r[e];
    if (typeof s == "function" && !("_isShim"in s))
        return s;
    const o = Ky(n)
      , i = L.document.createElement("script");
    i.src = o,
    i.crossOrigin = "anonymous",
    i.referrerPolicy = "strict-origin",
    t && i.setAttribute("nonce", t);
    const a = new Promise( (l, f) => {
        i.addEventListener("load", () => l()),
        i.addEventListener("error", f)
    }
    )
      , c = L.document.currentScript
      , u = L.document.body || L.document.head || (c == null ? void 0 : c.parentElement);
    if (u)
        u.appendChild(i);
    else
        throw new Error(`Could not find parent element to insert lazy-loaded ${e} script`);
    try {
        await a
    } catch {
        throw new Error(`Error when loading integration: ${e}`)
    }
    const d = r[e];
    if (typeof d != "function")
        throw new Error(`Could not load integration: ${e}`);
    return d
}
function Ky(e) {
    var r;
    const t = M()
      , n = ((r = t == null ? void 0 : t.getOptions()) == null ? void 0 : r.cdnBaseUrl) || "https://browser.sentry-cdn.com";
    return new URL(`/${Mt}/${e}.min.js`,n).toString()
}
const K1 = pd({
    lazyLoadIntegration: Xy
})
  , J1 = pd({
    getModalIntegration: () => By,
    getScreenshotIntegration: () => Gy
});
function Vn(e, t, n, r) {
    ii({
        level: e,
        message: t,
        attributes: n,
        severityNumber: r
    })
}
function Jy(e, t) {
    Vn("trace", e, t)
}
function Zy(e, t) {
    Vn("debug", e, t)
}
function Qy(e, t) {
    Vn("info", e, t)
}
function eS(e, t) {
    Vn("warn", e, t)
}
function tS(e, t) {
    Vn("error", e, t)
}
function nS(e, t) {
    Vn("fatal", e, t)
}
const Z1 = Object.freeze(Object.defineProperty({
    __proto__: null,
    debug: Zy,
    error: tS,
    fatal: nS,
    fmt: Zm,
    info: Qy,
    trace: Jy,
    warn: eS
}, Symbol.toStringTag, {
    value: "Module"
}));
function ta(e, t) {
    const n = na(e, t)
      , r = {
        type: aS(t),
        value: cS(t)
    };
    return n.length && (r.stacktrace = {
        frames: n
    }),
    r.type === void 0 && r.value === "" && (r.value = "Unrecoverable error caught"),
    r
}
function rS(e, t, n, r) {
    const s = M()
      , o = s == null ? void 0 : s.getOptions().normalizeDepth
      , i = pS(t)
      , a = {
        __serialized__: Cl(t, o)
    };
    if (i)
        return {
            exception: {
                values: [ta(e, i)]
            },
            extra: a
        };
    const c = {
        exception: {
            values: [{
                type: Ys(t) ? t.constructor.name : r ? "UnhandledRejection" : "Error",
                value: dS(t, {
                    isUnhandledRejection: r
                })
            }]
        },
        extra: a
    };
    if (n) {
        const u = na(e, n);
        u.length && (c.exception.values[0].stacktrace = {
            frames: u
        })
    }
    return c
}
function No(e, t) {
    return {
        exception: {
            values: [ta(e, t)]
        }
    }
}
function na(e, t) {
    const n = t.stacktrace || t.stack || ""
      , r = oS(t)
      , s = iS(t);
    try {
        return e(n, r, s)
    } catch {}
    return []
}
const sS = /Minified React error #\d+;/i;
function oS(e) {
    return e && sS.test(e.message) ? 1 : 0
}
function iS(e) {
    return typeof e.framesToPop == "number" ? e.framesToPop : 0
}
function Id(e) {
    return typeof WebAssembly < "u" && typeof WebAssembly.Exception < "u" ? e instanceof WebAssembly.Exception : !1
}
function aS(e) {
    const t = e == null ? void 0 : e.name;
    return !t && Id(e) ? e.message && Array.isArray(e.message) && e.message.length == 2 ? e.message[0] : "WebAssembly.Exception" : t
}
function cS(e) {
    const t = e == null ? void 0 : e.message;
    return Id(e) ? Array.isArray(e.message) && e.message.length == 2 ? e.message[1] : "wasm exception" : t ? t.error && typeof t.error.message == "string" ? t.error.message : t : "No error message"
}
function uS(e, t, n, r) {
    const s = (n == null ? void 0 : n.syntheticException) || void 0
      , o = ra(e, t, s, r);
    return Pt(o),
    o.level = "error",
    n != null && n.event_id && (o.event_id = n.event_id),
    St(o)
}
function lS(e, t, n="info", r, s) {
    const o = (r == null ? void 0 : r.syntheticException) || void 0
      , i = _i(e, t, o, s);
    return i.level = n,
    r != null && r.event_id && (i.event_id = r.event_id),
    St(i)
}
function ra(e, t, n, r, s) {
    let o;
    if (Qu(t) && t.error)
        return No(e, t.error);
    if (Pa(t) || Mp(t)) {
        const i = t;
        if ("stack"in t)
            o = No(e, t);
        else {
            const a = i.name || (Pa(i) ? "DOMError" : "DOMException")
              , c = i.message ? `${a}: ${i.message}` : a;
            o = _i(e, c, n, r),
            Ko(o, c)
        }
        return "code"in i && (o.tags = {
            ...o.tags,
            "DOMException.code": `${i.code}`
        }),
        o
    }
    return pt(t) ? No(e, t) : Jt(t) || Ys(t) ? (o = rS(e, t, n, s),
    Pt(o, {
        synthetic: !0
    }),
    o) : (o = _i(e, t, n, r),
    Ko(o, `${t}`),
    Pt(o, {
        synthetic: !0
    }),
    o)
}
function _i(e, t, n, r) {
    const s = {};
    if (r && n) {
        const o = na(e, n);
        o.length && (s.exception = {
            values: [{
                value: t,
                stacktrace: {
                    frames: o
                }
            }]
        }),
        Pt(s, {
            synthetic: !0
        })
    }
    if (Vs(t)) {
        const {__sentry_template_string__: o, __sentry_template_values__: i} = t;
        return s.logentry = {
            message: o,
            params: i
        },
        s
    }
    return s.message = t,
    s
}
function dS(e, {isUnhandledRejection: t}) {
    const n = Fp(e)
      , r = t ? "promise rejection" : "exception";
    return Qu(e) ? `Event \`ErrorEvent\` captured as ${r} with message \`${e.message}\`` : Ys(e) ? `Event \`${fS(e)}\` (type=${e.type}) captured as ${r}` : `Object captured as ${r} with keys: ${n}`
}
function fS(e) {
    try {
        const t = Object.getPrototypeOf(e);
        return t ? t.constructor.name : void 0
    } catch {}
}
function pS(e) {
    for (const t in e)
        if (Object.prototype.hasOwnProperty.call(e, t)) {
            const n = e[t];
            if (n instanceof Error)
                return n
        }
}
const hS = 5e3;
class mS extends Cm {
    constructor(t) {
        const n = gS(t)
          , r = L.SENTRY_SDK_SOURCE || O_();
        Jl(n, "browser", ["browser"], r),
        super(n);
        const {sendDefaultPii: s, sendClientReports: o, _experiments: i} = this._options
          , a = i == null ? void 0 : i.enableLogs;
        L.document && (o || a) && L.document.addEventListener("visibilitychange", () => {
            L.document.visibilityState === "hidden" && (o && this._flushOutcomes(),
            a && as(this))
        }
        ),
        a && (this.on("flush", () => {
            as(this)
        }
        ),
        this.on("afterCaptureLog", () => {
            this._logFlushIdleTimeout && clearTimeout(this._logFlushIdleTimeout),
            this._logFlushIdleTimeout = setTimeout( () => {
                as(this)
            }
            , hS)
        }
        )),
        s && (this.on("postprocessEvent", Qm),
        this.on("beforeSendSession", eg))
    }
    eventFromException(t, n) {
        return uS(this._options.stackParser, t, n, this._options.attachStacktrace)
    }
    eventFromMessage(t, n="info", r) {
        return lS(this._options.stackParser, t, n, r, this._options.attachStacktrace)
    }
    _prepareEvent(t, n, r, s) {
        return t.platform = t.platform || "javascript",
        super._prepareEvent(t, n, r, s)
    }
}
function gS(e) {
    var t;
    return {
        release: typeof __SENTRY_RELEASE__ == "string" ? __SENTRY_RELEASE__ : (t = L.SENTRY_RELEASE) == null ? void 0 : t.id,
        sendClientReports: !0,
        parentSpanIsAlwaysRootSpan: !0,
        ...e
    }
}
const Fn = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__
  , H = P
  , _S = (e, t) => e > t[1] ? "poor" : e > t[0] ? "needs-improvement" : "good"
  , Yn = (e, t, n, r) => {
    let s, o;
    return i => {
        t.value >= 0 && (i || r) && (o = t.value - (s ?? 0),
        (o || s === void 0) && (s = t.value,
        t.delta = o,
        t.rating = _S(t.value, n),
        e(t)))
    }
}
  , yS = () => `v5-${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`
  , kr = (e=!0) => {
    var n, r;
    const t = (r = (n = H.performance) == null ? void 0 : n.getEntriesByType) == null ? void 0 : r.call(n, "navigation")[0];
    if (!e || t && t.responseStart > 0 && t.responseStart < performance.now())
        return t
}
  , Xn = () => {
    const e = kr();
    return (e == null ? void 0 : e.activationStart) ?? 0
}
  , Kn = (e, t=-1) => {
    var o, i;
    const n = kr();
    let r = "navigate";
    return n && ((o = H.document) != null && o.prerendering || Xn() > 0 ? r = "prerender" : (i = H.document) != null && i.wasDiscarded ? r = "restore" : n.type && (r = n.type.replace(/_/g, "-"))),
    {
        name: e,
        value: t,
        rating: "good",
        delta: 0,
        entries: [],
        id: yS(),
        navigationType: r
    }
}
  , Oo = new WeakMap;
function sa(e, t) {
    return Oo.get(e) || Oo.set(e, new t),
    Oo.get(e)
}
class Ns {
    constructor() {
        Ns.prototype.__init.call(this),
        Ns.prototype.__init2.call(this)
    }
    __init() {
        this._sessionValue = 0
    }
    __init2() {
        this._sessionEntries = []
    }
    _processEntry(t) {
        var s;
        if (t.hadRecentInput)
            return;
        const n = this._sessionEntries[0]
          , r = this._sessionEntries[this._sessionEntries.length - 1];
        this._sessionValue && n && r && t.startTime - r.startTime < 1e3 && t.startTime - n.startTime < 5e3 ? (this._sessionValue += t.value,
        this._sessionEntries.push(t)) : (this._sessionValue = t.value,
        this._sessionEntries = [t]),
        (s = this._onAfterProcessingUnexpectedShift) == null || s.call(this, t)
    }
}
const cn = (e, t, n={}) => {
    try {
        if (PerformanceObserver.supportedEntryTypes.includes(e)) {
            const r = new PerformanceObserver(s => {
                Promise.resolve().then( () => {
                    t(s.getEntries())
                }
                )
            }
            );
            return r.observe({
                type: e,
                buffered: !0,
                ...n
            }),
            r
        }
    } catch {}
}
  , to = e => {
    let t = !1;
    return () => {
        t || (e(),
        t = !0)
    }
}
;
let tr = -1;
const SS = () => {
    var e, t;
    return ((e = H.document) == null ? void 0 : e.visibilityState) === "hidden" && !((t = H.document) != null && t.prerendering) ? 0 : 1 / 0
}
  , Os = e => {
    H.document.visibilityState === "hidden" && tr > -1 && (tr = e.type === "visibilitychange" ? e.timeStamp : 0,
    ES())
}
  , bS = () => {
    addEventListener("visibilitychange", Os, !0),
    addEventListener("prerenderingchange", Os, !0)
}
  , ES = () => {
    removeEventListener("visibilitychange", Os, !0),
    removeEventListener("prerenderingchange", Os, !0)
}
  , no = () => {
    var e;
    if (H.document && tr < 0) {
        const t = Xn();
        tr = (H.document.prerendering || (e = globalThis.performance.getEntriesByType("visibility-state").filter(r => r.name === "hidden" && r.startTime > t)[0]) == null ? void 0 : e.startTime) ?? SS(),
        bS()
    }
    return {
        get firstHiddenTime() {
            return tr
        }
    }
}
  , Cr = e => {
    var t;
    (t = H.document) != null && t.prerendering ? addEventListener("prerenderingchange", () => e(), !0) : e()
}
  , vS = [1800, 3e3]
  , wS = (e, t={}) => {
    Cr( () => {
        const n = no()
          , r = Kn("FCP");
        let s;
        const i = cn("paint", a => {
            for (const c of a)
                c.name === "first-contentful-paint" && (i.disconnect(),
                c.startTime < n.firstHiddenTime && (r.value = Math.max(c.startTime - Xn(), 0),
                r.entries.push(c),
                s(!0)))
        }
        );
        i && (s = Yn(e, r, vS, t.reportAllChanges))
    }
    )
}
  , TS = [.1, .25]
  , IS = (e, t={}) => {
    wS(to( () => {
        var a, c;
        const n = Kn("CLS", 0);
        let r;
        const s = sa(t, Ns)
          , o = u => {
            for (const d of u)
                s._processEntry(d);
            s._sessionValue > n.value && (n.value = s._sessionValue,
            n.entries = s._sessionEntries,
            r())
        }
          , i = cn("layout-shift", o);
        i && (r = Yn(e, n, TS, t.reportAllChanges),
        (a = H.document) == null || a.addEventListener("visibilitychange", () => {
            var u;
            ((u = H.document) == null ? void 0 : u.visibilityState) === "hidden" && (o(i.takeRecords()),
            r(!0))
        }
        ),
        (c = H == null ? void 0 : H.setTimeout) == null || c.call(H, r))
    }
    ))
}
  , Rr = e => {
    const t = n => {
        var r;
        (n.type === "pagehide" || ((r = H.document) == null ? void 0 : r.visibilityState) === "hidden") && e(n)
    }
    ;
    H.document && (addEventListener("visibilitychange", t, !0),
    addEventListener("pagehide", t, !0))
}
  , kS = [100, 300]
  , CS = (e, t={}) => {
    Cr( () => {
        const n = no()
          , r = Kn("FID");
        let s;
        const o = c => {
            c.startTime < n.firstHiddenTime && (r.value = c.processingStart - c.startTime,
            r.entries.push(c),
            s(!0))
        }
          , i = c => {
            c.forEach(o)
        }
          , a = cn("first-input", i);
        s = Yn(e, r, kS, t.reportAllChanges),
        a && Rr(to( () => {
            i(a.takeRecords()),
            a.disconnect()
        }
        ))
    }
    )
}
;
let kd = 0
  , Lo = 1 / 0
  , qr = 0;
const RS = e => {
    e.forEach(t => {
        t.interactionId && (Lo = Math.min(Lo, t.interactionId),
        qr = Math.max(qr, t.interactionId),
        kd = qr ? (qr - Lo) / 7 + 1 : 0)
    }
    )
}
;
let yi;
const Cd = () => yi ? kd : performance.interactionCount || 0
  , xS = () => {
    "interactionCount"in performance || yi || (yi = cn("event", RS, {
        type: "event",
        buffered: !0,
        durationThreshold: 0
    }))
}
  , Po = 10;
let Rd = 0;
const MS = () => Cd() - Rd;
class Ls {
    constructor() {
        Ls.prototype.__init.call(this),
        Ls.prototype.__init2.call(this)
    }
    __init() {
        this._longestInteractionList = []
    }
    __init2() {
        this._longestInteractionMap = new Map
    }
    _resetInteractions() {
        Rd = Cd(),
        this._longestInteractionList.length = 0,
        this._longestInteractionMap.clear()
    }
    _estimateP98LongestInteraction() {
        const t = Math.min(this._longestInteractionList.length - 1, Math.floor(MS() / 50));
        return this._longestInteractionList[t]
    }
    _processEntry(t) {
        var s, o;
        if ((s = this._onBeforeProcessingEntry) == null || s.call(this, t),
        !(t.interactionId || t.entryType === "first-input"))
            return;
        const n = this._longestInteractionList.at(-1);
        let r = this._longestInteractionMap.get(t.interactionId);
        if (r || this._longestInteractionList.length < Po || t.duration > n._latency) {
            if (r ? t.duration > r._latency ? (r.entries = [t],
            r._latency = t.duration) : t.duration === r._latency && t.startTime === r.entries[0].startTime && r.entries.push(t) : (r = {
                id: t.interactionId,
                entries: [t],
                _latency: t.duration
            },
            this._longestInteractionMap.set(r.id, r),
            this._longestInteractionList.push(r)),
            this._longestInteractionList.sort( (i, a) => a._latency - i._latency),
            this._longestInteractionList.length > Po) {
                const i = this._longestInteractionList.splice(Po);
                for (const a of i)
                    this._longestInteractionMap.delete(a.id)
            }
            (o = this._onAfterProcessingINPCandidate) == null || o.call(this, r)
        }
    }
}
const xd = e => {
    var n;
    const t = H.requestIdleCallback || H.setTimeout;
    ((n = H.document) == null ? void 0 : n.visibilityState) === "hidden" ? e() : (e = to(e),
    t(e),
    Rr(e))
}
  , AS = [200, 500]
  , NS = 40
  , OS = (e, t={}) => {
    globalThis.PerformanceEventTiming && "interactionId"in PerformanceEventTiming.prototype && Cr( () => {
        xS();
        const n = Kn("INP");
        let r;
        const s = sa(t, Ls)
          , o = a => {
            xd( () => {
                for (const u of a)
                    s._processEntry(u);
                const c = s._estimateP98LongestInteraction();
                c && c._latency !== n.value && (n.value = c._latency,
                n.entries = c.entries,
                r())
            }
            )
        }
          , i = cn("event", o, {
            durationThreshold: t.durationThreshold ?? NS
        });
        r = Yn(e, n, AS, t.reportAllChanges),
        i && (i.observe({
            type: "first-input",
            buffered: !0
        }),
        Rr( () => {
            o(i.takeRecords()),
            r(!0)
        }
        ))
    }
    )
}
;
class LS {
    _processEntry(t) {
        var n;
        (n = this._onBeforeProcessingEntry) == null || n.call(this, t)
    }
}
const PS = [2500, 4e3]
  , DS = (e, t={}) => {
    Cr( () => {
        const n = no()
          , r = Kn("LCP");
        let s;
        const o = sa(t, LS)
          , i = c => {
            t.reportAllChanges || (c = c.slice(-1));
            for (const u of c)
                o._processEntry(u),
                u.startTime < n.firstHiddenTime && (r.value = Math.max(u.startTime - Xn(), 0),
                r.entries = [u],
                s())
        }
          , a = cn("largest-contentful-paint", i);
        if (a) {
            s = Yn(e, r, PS, t.reportAllChanges);
            const c = to( () => {
                i(a.takeRecords()),
                a.disconnect(),
                s(!0)
            }
            );
            for (const u of ["keydown", "click", "visibilitychange"])
                H.document && addEventListener(u, () => xd(c), {
                    capture: !0,
                    once: !0
                })
        }
    }
    )
}
  , FS = [800, 1800]
  , Si = e => {
    var t, n;
    (t = H.document) != null && t.prerendering ? Cr( () => Si(e)) : ((n = H.document) == null ? void 0 : n.readyState) !== "complete" ? addEventListener("load", () => Si(e), !0) : setTimeout(e)
}
  , $S = (e, t={}) => {
    const n = Kn("TTFB")
      , r = Yn(e, n, FS, t.reportAllChanges);
    Si( () => {
        const s = kr();
        s && (n.value = Math.max(s.responseStart - Xn(), 0),
        n.entries = [s],
        r(!0))
    }
    )
}
  , nr = {}
  , Ps = {};
let Md, Ad, Nd, Od, Ld;
function oa(e, t=!1) {
    return xr("cls", e, US, Md, t)
}
function ia(e, t=!1) {
    return xr("lcp", e, WS, Nd, t)
}
function Pd(e) {
    return xr("fid", e, HS, Ad)
}
function BS(e) {
    return xr("ttfb", e, zS, Od)
}
function Dd(e) {
    return xr("inp", e, jS, Ld)
}
function $n(e, t) {
    return Fd(e, t),
    Ps[e] || (qS(e),
    Ps[e] = !0),
    $d(e, t)
}
function Jn(e, t) {
    const n = nr[e];
    if (n != null && n.length)
        for (const r of n)
            try {
                r(t)
            } catch (s) {
                Fn && y.error(`Error while triggering instrumentation handler.
Type: ${e}
Name: ${mt(r)}
Error:`, s)
            }
}
function US() {
    return IS(e => {
        Jn("cls", {
            metric: e
        }),
        Md = e
    }
    , {
        reportAllChanges: !0
    })
}
function HS() {
    return CS(e => {
        Jn("fid", {
            metric: e
        }),
        Ad = e
    }
    )
}
function WS() {
    return DS(e => {
        Jn("lcp", {
            metric: e
        }),
        Nd = e
    }
    , {
        reportAllChanges: !0
    })
}
function zS() {
    return $S(e => {
        Jn("ttfb", {
            metric: e
        }),
        Od = e
    }
    )
}
function jS() {
    return OS(e => {
        Jn("inp", {
            metric: e
        }),
        Ld = e
    }
    )
}
function xr(e, t, n, r, s=!1) {
    Fd(e, t);
    let o;
    return Ps[e] || (o = n(),
    Ps[e] = !0),
    r && t({
        metric: r
    }),
    $d(e, t, s ? o : void 0)
}
function qS(e) {
    const t = {};
    e === "event" && (t.durationThreshold = 0),
    cn(e, n => {
        Jn(e, {
            entries: n
        })
    }
    , t)
}
function Fd(e, t) {
    nr[e] = nr[e] || [],
    nr[e].push(t)
}
function $d(e, t, n) {
    return () => {
        n && n();
        const r = nr[e];
        if (!r)
            return;
        const s = r.indexOf(t);
        s !== -1 && r.splice(s, 1)
    }
}
function GS(e) {
    return "duration"in e
}
function Do(e) {
    return typeof e == "number" && isFinite(e)
}
function Et(e, t, n, {...r}) {
    const s = z(e).start_timestamp;
    return s && s > t && typeof e.updateStartTime == "function" && e.updateStartTime(t),
    Mn(e, () => {
        const o = nt({
            startTime: t,
            ...r
        });
        return o && o.end(n),
        o
    }
    )
}
function aa(e) {
    var _;
    const t = M();
    if (!t)
        return;
    const {name: n, transaction: r, attributes: s, startTime: o} = e
      , {release: i, environment: a, sendDefaultPii: c} = t.getOptions()
      , u = t.getIntegrationByName("Replay")
      , d = u == null ? void 0 : u.getReplayId()
      , l = j()
      , f = l.getUser()
      , p = f !== void 0 ? f.email || f.id || f.ip_address : void 0;
    let h;
    try {
        h = l.getScopeData().contexts.profile.profile_id
    } catch {}
    const m = {
        release: i,
        environment: a,
        user: p || void 0,
        profile_id: h || void 0,
        replay_id: d || void 0,
        transaction: r,
        "user_agent.original": (_ = H.navigator) == null ? void 0 : _.userAgent,
        "client.address": c ? "{{auto}}" : void 0,
        ...s
    };
    return nt({
        name: n,
        attributes: m,
        startTime: o,
        experimental: {
            standalone: !0
        }
    })
}
function ca() {
    return H.addEventListener && H.performance
}
function he(e) {
    return e / 1e3
}
function Bd(e) {
    let t = "unknown"
      , n = "unknown"
      , r = "";
    for (const s of e) {
        if (s === "/") {
            [t,n] = e.split("/");
            break
        }
        if (!isNaN(Number(s))) {
            t = r === "h" ? "http" : r,
            n = e.split(r)[1];
            break
        }
        r += s
    }
    return r === e && (t = r),
    {
        name: t,
        version: n
    }
}
function VS() {
    let e = 0, t, n;
    if (!XS())
        return;
    let r = !1;
    function s() {
        r || (r = !0,
        n && YS(e, t, n),
        o())
    }
    const o = oa( ({metric: i}) => {
        const a = i.entries[i.entries.length - 1];
        a && (e = i.value,
        t = a)
    }
    , !0);
    Rr( () => {
        s()
    }
    ),
    setTimeout( () => {
        const i = M();
        if (!i)
            return;
        const a = i.on("startNavigationSpan", () => {
            s(),
            a == null || a()
        }
        )
          , c = ge();
        if (c) {
            const u = ye(c);
            z(u).op === "pageload" && (n = u.spanContext().spanId)
        }
    }
    , 0)
}
function YS(e, t, n) {
    var c;
    Fn && y.log(`Sending CLS span (${e})`);
    const r = he((Oe() || 0) + ((t == null ? void 0 : t.startTime) || 0))
      , s = j().getScopeData().transactionName
      , o = t ? qe((c = t.sources[0]) == null ? void 0 : c.node) : "Layout shift"
      , i = {
        [Y]: "auto.http.browser.cls",
        [be]: "ui.webvital.cls",
        [Gn]: (t == null ? void 0 : t.duration) || 0,
        "sentry.pageload.span_id": n
    };
    t != null && t.sources && t.sources.forEach( (u, d) => {
        i[`cls.source.${d + 1}`] = qe(u.node)
    }
    );
    const a = aa({
        name: o,
        transaction: s,
        attributes: i,
        startTime: r
    });
    a && (a.addEvent("cls", {
        [br]: "",
        [Er]: e
    }),
    a.end(r))
}
function XS() {
    try {
        return PerformanceObserver.supportedEntryTypes.includes("layout-shift")
    } catch {
        return !1
    }
}
function KS() {
    let e = 0, t, n;
    if (!ZS())
        return;
    let r = !1;
    function s() {
        r || (r = !0,
        n && JS(e, t, n),
        o())
    }
    const o = ia( ({metric: i}) => {
        const a = i.entries[i.entries.length - 1];
        a && (e = i.value,
        t = a)
    }
    , !0);
    Rr( () => {
        s()
    }
    ),
    setTimeout( () => {
        const i = M();
        if (!i)
            return;
        const a = i.on("startNavigationSpan", () => {
            s(),
            a == null || a()
        }
        )
          , c = ge();
        if (c) {
            const u = ye(c);
            z(u).op === "pageload" && (n = u.spanContext().spanId)
        }
    }
    , 0)
}
function JS(e, t, n) {
    Fn && y.log(`Sending LCP span (${e})`);
    const r = he((Oe() || 0) + ((t == null ? void 0 : t.startTime) || 0))
      , s = j().getScopeData().transactionName
      , o = t ? qe(t.element) : "Largest contentful paint"
      , i = {
        [Y]: "auto.http.browser.lcp",
        [be]: "ui.webvital.lcp",
        [Gn]: 0,
        "sentry.pageload.span_id": n
    };
    t && (i["lcp.element"] = qe(t.element),
    i["lcp.id"] = t.id,
    i["lcp.url"] = t.url,
    i["lcp.loadTime"] = t.loadTime,
    i["lcp.renderTime"] = t.renderTime,
    i["lcp.size"] = t.size);
    const a = aa({
        name: o,
        transaction: s,
        attributes: i,
        startTime: r
    });
    a && (a.addEvent("lcp", {
        [br]: "millisecond",
        [Er]: e
    }),
    a.end(r))
}
function ZS() {
    try {
        return PerformanceObserver.supportedEntryTypes.includes("largest-contentful-paint")
    } catch {
        return !1
    }
}
const QS = 2147483647;
let Uc = 0, Ee = {}, Le, _n;
function eb({recordClsStandaloneSpans: e, recordLcpStandaloneSpans: t}) {
    const n = ca();
    if (n && Oe()) {
        n.mark && H.performance.mark("sentry-tracing-init");
        const r = ib()
          , s = t ? KS() : ob()
          , o = ab()
          , i = e ? VS() : sb();
        return () => {
            r(),
            s == null || s(),
            o(),
            i == null || i()
        }
    }
    return () => {}
}
function tb() {
    $n("longtask", ({entries: e}) => {
        const t = ge();
        if (!t)
            return;
        const {op: n, start_timestamp: r} = z(t);
        for (const s of e) {
            const o = he(Oe() + s.startTime)
              , i = he(s.duration);
            n === "navigation" && r && o < r || Et(t, o, o + i, {
                name: "Main UI thread blocked",
                op: "ui.long-task",
                attributes: {
                    [Y]: "auto.ui.browser.metrics"
                }
            })
        }
    }
    )
}
function nb() {
    new PerformanceObserver(t => {
        const n = ge();
        if (n)
            for (const r of t.getEntries()) {
                if (!r.scripts[0])
                    continue;
                const s = he(Oe() + r.startTime)
                  , {start_timestamp: o, op: i} = z(n);
                if (i === "navigation" && o && s < o)
                    continue;
                const a = he(r.duration)
                  , c = {
                    [Y]: "auto.ui.browser.metrics"
                }
                  , u = r.scripts[0]
                  , {invoker: d, invokerType: l, sourceURL: f, sourceFunctionName: p, sourceCharPosition: h} = u;
                c["browser.script.invoker"] = d,
                c["browser.script.invoker_type"] = l,
                f && (c["code.filepath"] = f),
                p && (c["code.function"] = p),
                h !== -1 && (c["browser.script.source_char_position"] = h),
                Et(n, s, s + a, {
                    name: "Main UI thread blocked",
                    op: "ui.long-animation-frame",
                    attributes: c
                })
            }
    }
    ).observe({
        type: "long-animation-frame",
        buffered: !0
    })
}
function rb() {
    $n("event", ({entries: e}) => {
        const t = ge();
        if (t) {
            for (const n of e)
                if (n.name === "click") {
                    const r = he(Oe() + n.startTime)
                      , s = he(n.duration)
                      , o = {
                        name: qe(n.target),
                        op: `ui.interaction.${n.name}`,
                        startTime: r,
                        attributes: {
                            [Y]: "auto.ui.browser.metrics"
                        }
                    }
                      , i = nl(n.target);
                    i && (o.attributes["ui.component_name"] = i),
                    Et(t, r, r + s, o)
                }
        }
    }
    )
}
function sb() {
    return oa( ({metric: e}) => {
        const t = e.entries[e.entries.length - 1];
        t && (Ee.cls = {
            value: e.value,
            unit: ""
        },
        _n = t)
    }
    , !0)
}
function ob() {
    return ia( ({metric: e}) => {
        const t = e.entries[e.entries.length - 1];
        t && (Ee.lcp = {
            value: e.value,
            unit: "millisecond"
        },
        Le = t)
    }
    , !0)
}
function ib() {
    return Pd( ({metric: e}) => {
        const t = e.entries[e.entries.length - 1];
        if (!t)
            return;
        const n = he(Oe())
          , r = he(t.startTime);
        Ee.fid = {
            value: e.value,
            unit: "millisecond"
        },
        Ee["mark.fid"] = {
            value: n + r,
            unit: "second"
        }
    }
    )
}
function ab() {
    return BS( ({metric: e}) => {
        e.entries[e.entries.length - 1] && (Ee.ttfb = {
            value: e.value,
            unit: "millisecond"
        })
    }
    )
}
function cb(e, t) {
    const n = ca()
      , r = Oe();
    if (!(n != null && n.getEntries) || !r)
        return;
    const s = he(r)
      , o = n.getEntries()
      , {op: i, start_timestamp: a} = z(e);
    if (o.slice(Uc).forEach(c => {
        const u = he(c.startTime)
          , d = he(Math.max(0, c.duration));
        if (!(i === "navigation" && a && s + u < a))
            switch (c.entryType) {
            case "navigation":
                {
                    db(e, c, s);
                    break
                }
            case "mark":
            case "paint":
            case "measure":
                {
                    ub(e, c, u, d, s, t.ignorePerformanceApiSpans);
                    const l = no()
                      , f = c.startTime < l.firstHiddenTime;
                    c.name === "first-paint" && f && (Ee.fp = {
                        value: c.startTime,
                        unit: "millisecond"
                    }),
                    c.name === "first-contentful-paint" && f && (Ee.fcp = {
                        value: c.startTime,
                        unit: "millisecond"
                    });
                    break
                }
            case "resource":
                {
                    hb(e, c, c.name, u, d, s, t.ignoreResourceSpans);
                    break
                }
            }
    }
    ),
    Uc = Math.max(o.length - 1, 0),
    mb(e),
    i === "pageload") {
        _b(Ee);
        const c = Ee["mark.fid"];
        c && Ee.fid && (Et(e, c.value, c.value + he(Ee.fid.value), {
            name: "first input delay",
            op: "ui.action",
            attributes: {
                [Y]: "auto.ui.browser.metrics"
            }
        }),
        delete Ee["mark.fid"]),
        (!("fcp"in Ee) || !t.recordClsOnPageloadSpan) && delete Ee.cls,
        t.recordLcpOnPageloadSpan || delete Ee.lcp,
        Object.entries(Ee).forEach( ([u,d]) => {
            Wh(u, d.value, d.unit)
        }
        ),
        e.setAttribute("performance.timeOrigin", s),
        e.setAttribute("performance.activationStart", Xn()),
        gb(e, t)
    }
    Le = void 0,
    _n = void 0,
    Ee = {}
}
function ub(e, t, n, r, s, o) {
    if (["mark", "measure"].includes(t.entryType) && Je(t.name, o))
        return;
    const i = kr(!1)
      , a = he(i ? i.requestStart : 0)
      , c = s + Math.max(n, a)
      , u = s + n
      , d = u + r
      , l = {
        [Y]: "auto.resource.browser.metrics"
    };
    c !== u && (l["sentry.browser.measure_happened_before_request"] = !0,
    l["sentry.browser.measure_start_time"] = c),
    lb(l, t),
    c <= d && Et(e, c, d, {
        name: t.name,
        op: t.entryType,
        attributes: l
    })
}
function lb(e, t) {
    try {
        const n = t.detail;
        if (!n)
            return;
        if (typeof n == "object") {
            for (const [r,s] of Object.entries(n))
                if (s && kn(s))
                    e[`sentry.browser.measure.detail.${r}`] = s;
                else if (s !== void 0)
                    try {
                        e[`sentry.browser.measure.detail.${r}`] = JSON.stringify(s)
                    } catch {}
            return
        }
        if (kn(n)) {
            e["sentry.browser.measure.detail"] = n;
            return
        }
        try {
            e["sentry.browser.measure.detail"] = JSON.stringify(n)
        } catch {}
    } catch {}
}
function db(e, t, n) {
    ["unloadEvent", "redirect", "domContentLoadedEvent", "loadEvent", "connect"].forEach(r => {
        Gr(e, t, r, n)
    }
    ),
    Gr(e, t, "secureConnection", n, "TLS/SSL"),
    Gr(e, t, "fetch", n, "cache"),
    Gr(e, t, "domainLookup", n, "DNS"),
    pb(e, t, n)
}
function Gr(e, t, n, r, s=n) {
    const o = fb(n)
      , i = t[o]
      , a = t[`${n}Start`];
    !a || !i || Et(e, r + he(a), r + he(i), {
        op: `browser.${s}`,
        name: t.name,
        attributes: {
            [Y]: "auto.ui.browser.metrics",
            ...n === "redirect" && t.redirectCount != null ? {
                "http.redirect_count": t.redirectCount
            } : {}
        }
    })
}
function fb(e) {
    return e === "secureConnection" ? "connectEnd" : e === "fetch" ? "domainLookupStart" : `${e}End`
}
function pb(e, t, n) {
    const r = n + he(t.requestStart)
      , s = n + he(t.responseEnd)
      , o = n + he(t.responseStart);
    t.responseEnd && (Et(e, r, s, {
        op: "browser.request",
        name: t.name,
        attributes: {
            [Y]: "auto.ui.browser.metrics"
        }
    }),
    Et(e, o, s, {
        op: "browser.response",
        name: t.name,
        attributes: {
            [Y]: "auto.ui.browser.metrics"
        }
    }))
}
function hb(e, t, n, r, s, o, i) {
    if (t.initiatorType === "xmlhttprequest" || t.initiatorType === "fetch")
        return;
    const a = t.initiatorType ? `resource.${t.initiatorType}` : "resource.other";
    if (i != null && i.includes(a))
        return;
    const c = Kt(n)
      , u = {
        [Y]: "auto.resource.browser.metrics"
    };
    Fo(u, t, "transferSize", "http.response_transfer_size"),
    Fo(u, t, "encodedBodySize", "http.response_content_length"),
    Fo(u, t, "decodedBodySize", "http.decoded_response_content_length");
    const d = t.deliveryType;
    d != null && (u["http.response_delivery_type"] = d);
    const l = t.renderBlockingStatus;
    l && (u["resource.render_blocking_status"] = l),
    c.protocol && (u["url.scheme"] = c.protocol.split(":").pop()),
    c.host && (u["server.address"] = c.host),
    u["url.same_origin"] = n.includes(H.location.origin);
    const {name: f, version: p} = Bd(t.nextHopProtocol);
    u["network.protocol.name"] = f,
    u["network.protocol.version"] = p;
    const h = o + r
      , m = h + s;
    Et(e, h, m, {
        name: n.replace(H.location.origin, ""),
        op: a,
        attributes: u
    })
}
function mb(e) {
    const t = H.navigator;
    if (!t)
        return;
    const n = t.connection;
    n && (n.effectiveType && e.setAttribute("effectiveConnectionType", n.effectiveType),
    n.type && e.setAttribute("connectionType", n.type),
    Do(n.rtt) && (Ee["connection.rtt"] = {
        value: n.rtt,
        unit: "millisecond"
    })),
    Do(t.deviceMemory) && e.setAttribute("deviceMemory", `${t.deviceMemory} GB`),
    Do(t.hardwareConcurrency) && e.setAttribute("hardwareConcurrency", String(t.hardwareConcurrency))
}
function gb(e, t) {
    Le && t.recordLcpOnPageloadSpan && (Le.element && e.setAttribute("lcp.element", qe(Le.element)),
    Le.id && e.setAttribute("lcp.id", Le.id),
    Le.url && e.setAttribute("lcp.url", Le.url.trim().slice(0, 200)),
    Le.loadTime != null && e.setAttribute("lcp.loadTime", Le.loadTime),
    Le.renderTime != null && e.setAttribute("lcp.renderTime", Le.renderTime),
    e.setAttribute("lcp.size", Le.size)),
    _n != null && _n.sources && t.recordClsOnPageloadSpan && _n.sources.forEach( (n, r) => e.setAttribute(`cls.source.${r + 1}`, qe(n.node)))
}
function Fo(e, t, n, r) {
    const s = t[n];
    s != null && s < QS && (e[r] = s)
}
function _b(e) {
    const t = kr(!1);
    if (!t)
        return;
    const {responseStart: n, requestStart: r} = t;
    r <= n && (e["ttfb.requestTime"] = {
        value: n - r,
        unit: "millisecond"
    })
}
const yb = 1e3;
let Hc, bi, Ei;
function Ud(e) {
    const t = "dom";
    $t(t, e),
    Bt(t, Sb)
}
function Sb() {
    if (!H.document)
        return;
    const e = je.bind(null, "dom")
      , t = Wc(e, !0);
    H.document.addEventListener("click", t, !1),
    H.document.addEventListener("keypress", t, !1),
    ["EventTarget", "Node"].forEach(n => {
        var o, i;
        const s = (o = H[n]) == null ? void 0 : o.prototype;
        (i = s == null ? void 0 : s.hasOwnProperty) != null && i.call(s, "addEventListener") && (Me(s, "addEventListener", function(a) {
            return function(c, u, d) {
                if (c === "click" || c == "keypress")
                    try {
                        const l = this.__sentry_instrumentation_handlers__ = this.__sentry_instrumentation_handlers__ || {}
                          , f = l[c] = l[c] || {
                            refCount: 0
                        };
                        if (!f.handler) {
                            const p = Wc(e);
                            f.handler = p,
                            a.call(this, c, p, d)
                        }
                        f.refCount++
                    } catch {}
                return a.call(this, c, u, d)
            }
        }),
        Me(s, "removeEventListener", function(a) {
            return function(c, u, d) {
                if (c === "click" || c == "keypress")
                    try {
                        const l = this.__sentry_instrumentation_handlers__ || {}
                          , f = l[c];
                        f && (f.refCount--,
                        f.refCount <= 0 && (a.call(this, c, f.handler, d),
                        f.handler = void 0,
                        delete l[c]),
                        Object.keys(l).length === 0 && delete this.__sentry_instrumentation_handlers__)
                    } catch {}
                return a.call(this, c, u, d)
            }
        }))
    }
    )
}
function bb(e) {
    if (e.type !== bi)
        return !1;
    try {
        if (!e.target || e.target._sentryId !== Ei)
            return !1
    } catch {}
    return !0
}
function Eb(e, t) {
    return e !== "keypress" ? !1 : t != null && t.tagName ? !(t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) : !0
}
function Wc(e, t=!1) {
    return n => {
        if (!n || n._sentryCaptured)
            return;
        const r = vb(n);
        if (Eb(n.type, r))
            return;
        Ne(n, "_sentryCaptured", !0),
        r && !r._sentryId && Ne(r, "_sentryId", Ae());
        const s = n.type === "keypress" ? "input" : n.type;
        bb(n) || (e({
            event: n,
            name: s,
            global: t
        }),
        bi = n.type,
        Ei = r ? r._sentryId : void 0),
        clearTimeout(Hc),
        Hc = H.setTimeout( () => {
            Ei = void 0,
            bi = void 0
        }
        , yb)
    }
}
function vb(e) {
    try {
        return e.target
    } catch {
        return null
    }
}
let Vr;
function ro(e) {
    const t = "history";
    $t(t, e),
    Bt(t, wb)
}
function wb() {
    if (H.addEventListener("popstate", () => {
        const t = H.location.href
          , n = Vr;
        if (Vr = t,
        n === t)
            return;
        je("history", {
            from: n,
            to: t
        })
    }
    ),
    !T_())
        return;
    function e(t) {
        return function(...n) {
            const r = n.length > 2 ? n[2] : void 0;
            if (r) {
                const s = Vr
                  , o = Tb(String(r));
                if (Vr = o,
                s === o)
                    return t.apply(this, n);
                je("history", {
                    from: s,
                    to: o
                })
            }
            return t.apply(this, n)
        }
    }
    Me(H.history, "pushState", e),
    Me(H.history, "replaceState", e)
}
function Tb(e) {
    try {
        return new URL(e,H.location.origin).toString()
    } catch {
        return e
    }
}
const ps = {};
function ua(e) {
    const t = ps[e];
    if (t)
        return t;
    let n = H[e];
    if (ci(n))
        return ps[e] = n.bind(H);
    const r = H.document;
    if (r && typeof r.createElement == "function")
        try {
            const s = r.createElement("iframe");
            s.hidden = !0,
            r.head.appendChild(s);
            const o = s.contentWindow;
            o != null && o[e] && (n = o[e]),
            r.head.removeChild(s)
        } catch (s) {
            Fn && y.warn(`Could not create sandbox iframe for ${e} check, bailing to window.${e}: `, s)
        }
    return n && (ps[e] = n.bind(H))
}
function zc(e) {
    ps[e] = void 0
}
function Mr(...e) {
    return ua("setTimeout")(...e)
}
const ft = "__sentry_xhr_v3__";
function la(e) {
    const t = "xhr";
    $t(t, e),
    Bt(t, Ib)
}
function Ib() {
    if (!H.XMLHttpRequest)
        return;
    const e = XMLHttpRequest.prototype;
    e.open = new Proxy(e.open,{
        apply(t, n, r) {
            const s = new Error
              , o = me() * 1e3
              , i = Ke(r[0]) ? r[0].toUpperCase() : void 0
              , a = kb(r[1]);
            if (!i || !a)
                return t.apply(n, r);
            n[ft] = {
                method: i,
                url: a,
                request_headers: {}
            },
            i === "POST" && a.match(/sentry_key/) && (n.__sentry_own_request__ = !0);
            const c = () => {
                const u = n[ft];
                if (u && n.readyState === 4) {
                    try {
                        u.status_code = n.status
                    } catch {}
                    const d = {
                        endTimestamp: me() * 1e3,
                        startTimestamp: o,
                        xhr: n,
                        virtualError: s
                    };
                    je("xhr", d)
                }
            }
            ;
            return "onreadystatechange"in n && typeof n.onreadystatechange == "function" ? n.onreadystatechange = new Proxy(n.onreadystatechange,{
                apply(u, d, l) {
                    return c(),
                    u.apply(d, l)
                }
            }) : n.addEventListener("readystatechange", c),
            n.setRequestHeader = new Proxy(n.setRequestHeader,{
                apply(u, d, l) {
                    const [f,p] = l
                      , h = d[ft];
                    return h && Ke(f) && Ke(p) && (h.request_headers[f.toLowerCase()] = p),
                    u.apply(d, l)
                }
            }),
            t.apply(n, r)
        }
    }),
    e.send = new Proxy(e.send,{
        apply(t, n, r) {
            const s = n[ft];
            if (!s)
                return t.apply(n, r);
            r[0] !== void 0 && (s.body = r[0]);
            const o = {
                startTimestamp: me() * 1e3,
                xhr: n
            };
            return je("xhr", o),
            t.apply(n, r)
        }
    })
}
function kb(e) {
    if (Ke(e))
        return e;
    try {
        return e.toString()
    } catch {}
}
function Hd(e) {
    return new URLSearchParams(e).toString()
}
function Ds(e, t=y) {
    try {
        if (typeof e == "string")
            return [e];
        if (e instanceof URLSearchParams)
            return [e.toString()];
        if (e instanceof FormData)
            return [Hd(e)];
        if (!e)
            return [void 0]
    } catch (n) {
        return Fn && t.error(n, "Failed to serialize body", e),
        [void 0, "BODY_PARSE_ERROR"]
    }
    return Fn && t.info("Skipping network body because of body type", e),
    [void 0, "UNPARSEABLE_BODY_TYPE"]
}
function da(e=[]) {
    if (!(e.length !== 2 || typeof e[1] != "object"))
        return e[1].body
}
const $o = []
  , hs = new Map
  , Cb = 60;
function Rb() {
    if (ca() && Oe()) {
        const t = xb();
        return () => {
            t()
        }
    }
    return () => {}
}
const jc = {
    click: "click",
    pointerdown: "click",
    pointerup: "click",
    mousedown: "click",
    mouseup: "click",
    touchstart: "click",
    touchend: "click",
    mouseover: "hover",
    mouseout: "hover",
    mouseenter: "hover",
    mouseleave: "hover",
    pointerover: "hover",
    pointerout: "hover",
    pointerenter: "hover",
    pointerleave: "hover",
    dragstart: "drag",
    dragend: "drag",
    drag: "drag",
    dragenter: "drag",
    dragleave: "drag",
    dragover: "drag",
    drop: "drag",
    keydown: "press",
    keyup: "press",
    keypress: "press",
    input: "press"
};
function xb() {
    return Dd(Mb)
}
const Mb = ({metric: e}) => {
    if (e.value == null)
        return;
    const t = he(e.value);
    if (t > Cb)
        return;
    const n = e.entries.find(h => h.duration === e.value && jc[h.name]);
    if (!n)
        return;
    const {interactionId: r} = n
      , s = jc[n.name]
      , o = he(Oe() + n.startTime)
      , i = ge()
      , a = i ? ye(i) : void 0
      , u = (r != null ? hs.get(r) : void 0) || a
      , d = u ? z(u).description : j().getScopeData().transactionName
      , l = qe(n.target)
      , f = {
        [Y]: "auto.http.browser.inp",
        [be]: `ui.interaction.${s}`,
        [Gn]: n.duration
    }
      , p = aa({
        name: l,
        transaction: d,
        attributes: f,
        startTime: o
    });
    p && (p.addEvent("inp", {
        [br]: "millisecond",
        [Er]: e.value
    }),
    p.end(o + t))
}
;
function Ab() {
    const e = ({entries: t}) => {
        const n = ge()
          , r = n && ye(n);
        t.forEach(s => {
            if (!GS(s) || !r)
                return;
            const o = s.interactionId;
            if (o != null && !hs.has(o)) {
                if ($o.length > 10) {
                    const i = $o.shift();
                    hs.delete(i)
                }
                $o.push(o),
                hs.set(o, r)
            }
        }
        )
    }
    ;
    $n("event", e),
    $n("first-input", e)
}
function Wd(e, t=ua("fetch")) {
    let n = 0
      , r = 0;
    function s(o) {
        const i = o.body.length;
        n += i,
        r++;
        const a = {
            body: o.body,
            method: "POST",
            referrerPolicy: "strict-origin",
            headers: e.headers,
            keepalive: n <= 6e4 && r < 15,
            ...e.fetchOptions
        };
        if (!t)
            return zc("fetch"),
            Rs("No fetch implementation available");
        try {
            return t(e.url, a).then(c => (n -= i,
            r--,
            {
                statusCode: c.status,
                headers: {
                    "x-sentry-rate-limits": c.headers.get("X-Sentry-Rate-Limits"),
                    "retry-after": c.headers.get("Retry-After")
                }
            }))
        } catch (c) {
            return zc("fetch"),
            n -= i,
            r--,
            Rs(c)
        }
    }
    return jm(e, s)
}
const Nb = 10
  , Ob = 20
  , Lb = 30
  , Pb = 40
  , Db = 50;
function Bn(e, t, n, r) {
    const s = {
        filename: e,
        function: t === "<anonymous>" ? st : t,
        in_app: !0
    };
    return n !== void 0 && (s.lineno = n),
    r !== void 0 && (s.colno = r),
    s
}
const Fb = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i
  , $b = /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i
  , Bb = /\((\S*)(?::(\d+))(?::(\d+))\)/
  , Ub = e => {
    const t = Fb.exec(e);
    if (t) {
        const [,r,s,o] = t;
        return Bn(r, st, +s, +o)
    }
    const n = $b.exec(e);
    if (n) {
        if (n[2] && n[2].indexOf("eval") === 0) {
            const i = Bb.exec(n[2]);
            i && (n[2] = i[1],
            n[3] = i[2],
            n[4] = i[3])
        }
        const [s,o] = zd(n[1] || st, n[2]);
        return Bn(o, s, n[3] ? +n[3] : void 0, n[4] ? +n[4] : void 0)
    }
}
  , Hb = [Lb, Ub]
  , Wb = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i
  , zb = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i
  , jb = e => {
    const t = Wb.exec(e);
    if (t) {
        if (t[3] && t[3].indexOf(" > eval") > -1) {
            const o = zb.exec(t[3]);
            o && (t[1] = t[1] || "eval",
            t[3] = o[1],
            t[4] = o[2],
            t[5] = "")
        }
        let r = t[3]
          , s = t[1] || st;
        return [s,r] = zd(s, r),
        Bn(r, s, t[4] ? +t[4] : void 0, t[5] ? +t[5] : void 0)
    }
}
  , qb = [Db, jb]
  , Gb = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:[-a-z]+):.*?):(\d+)(?::(\d+))?\)?\s*$/i
  , Vb = e => {
    const t = Gb.exec(e);
    return t ? Bn(t[2], t[1] || st, +t[3], t[4] ? +t[4] : void 0) : void 0
}
  , Q1 = [Pb, Vb]
  , Yb = / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i
  , Xb = e => {
    const t = Yb.exec(e);
    return t ? Bn(t[2], t[3] || st, +t[1]) : void 0
}
  , ek = [Nb, Xb]
  , Kb = / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^)]+))\(.*\))? in (.*):\s*$/i
  , Jb = e => {
    const t = Kb.exec(e);
    return t ? Bn(t[5], t[3] || t[4] || st, +t[1], +t[2]) : void 0
}
  , tk = [Ob, Jb]
  , Zb = [Hb, qb]
  , Qb = Xu(...Zb)
  , zd = (e, t) => {
    const n = e.indexOf("safari-extension") !== -1
      , r = e.indexOf("safari-web-extension") !== -1;
    return n || r ? [e.indexOf("@") !== -1 ? e.split("@")[0] : st, n ? `safari-extension:${t}` : `safari-web-extension:${t}`] : [e, t]
}
;
function nk(e, {metadata: t, tunnel: n, dsn: r}) {
    const s = {
        event_id: e.event_id,
        sent_at: new Date().toISOString(),
        ...(t == null ? void 0 : t.sdk) && {
            sdk: {
                name: t.sdk.name,
                version: t.sdk.version
            }
        },
        ...!!n && !!r && {
            dsn: on(r)
        }
    }
      , o = eE(e);
    return wt(s, [o])
}
function eE(e) {
    return [{
        type: "user_report"
    }, e]
}
const V = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__
  , Yr = 1024
  , tE = "Breadcrumbs"
  , nE = (e={}) => {
    const t = {
        console: !0,
        dom: !0,
        fetch: !0,
        history: !0,
        sentry: !0,
        xhr: !0,
        ...e
    };
    return {
        name: tE,
        setup(n) {
            t.console && Vi(iE(n)),
            t.dom && Ud(oE(n, t.dom)),
            t.xhr && la(aE(n)),
            t.fetch && Xi(cE(n)),
            t.history && ro(uE(n)),
            t.sentry && n.on("beforeSendEvent", sE(n))
        }
    }
}
  , rE = nE;
function sE(e) {
    return function(n) {
        M() === e && it({
            category: `sentry.${n.type === "transaction" ? "transaction" : "event"}`,
            event_id: n.event_id,
            level: n.level,
            message: zt(n)
        }, {
            event: n
        })
    }
}
function oE(e, t) {
    return function(r) {
        if (M() !== e)
            return;
        let s, o, i = typeof t == "object" ? t.serializeAttribute : void 0, a = typeof t == "object" && typeof t.maxStringLength == "number" ? t.maxStringLength : void 0;
        a && a > Yr && (V && y.warn(`\`dom.maxStringLength\` cannot exceed ${Yr}, but a value of ${a} was configured. Sentry will use ${Yr} instead.`),
        a = Yr),
        typeof i == "string" && (i = [i]);
        try {
            const u = r.event
              , d = lE(u) ? u.target : u;
            s = qe(d, {
                keyAttrs: i,
                maxStringLength: a
            }),
            o = nl(d)
        } catch {
            s = "<unknown>"
        }
        if (s.length === 0)
            return;
        const c = {
            category: `ui.${r.name}`,
            message: s
        };
        o && (c.data = {
            "ui.component_name": o
        }),
        it(c, {
            event: r.event,
            name: r.name,
            global: r.global
        })
    }
}
function iE(e) {
    return function(n) {
        if (M() !== e)
            return;
        const r = {
            category: "console",
            data: {
                arguments: n.args,
                logger: "console"
            },
            level: Yi(n.level),
            message: Es(n.args, " ")
        };
        if (n.level === "assert")
            if (n.args[0] === !1)
                r.message = `Assertion failed: ${Es(n.args.slice(1), " ") || "console.assert"}`,
                r.data.arguments = n.args.slice(1);
            else
                return;
        it(r, {
            input: n.args,
            level: n.level
        })
    }
}
function aE(e) {
    return function(n) {
        if (M() !== e)
            return;
        const {startTimestamp: r, endTimestamp: s} = n
          , o = n.xhr[ft];
        if (!r || !s || !o)
            return;
        const {method: i, url: a, status_code: c, body: u} = o
          , d = {
            method: i,
            url: a,
            status_code: c
        }
          , l = {
            xhr: n.xhr,
            input: u,
            startTimestamp: r,
            endTimestamp: s
        }
          , f = {
            category: "xhr",
            data: d,
            type: "http",
            level: cd(c)
        };
        e.emit("beforeOutgoingRequestBreadcrumb", f, l),
        it(f, l)
    }
}
function cE(e) {
    return function(n) {
        if (M() !== e)
            return;
        const {startTimestamp: r, endTimestamp: s} = n;
        if (s && !(n.fetchData.url.match(/sentry_key/) && n.fetchData.method === "POST"))
            if (n.fetchData.method,
            n.fetchData.url,
            n.error) {
                const o = n.fetchData
                  , i = {
                    data: n.error,
                    input: n.args,
                    startTimestamp: r,
                    endTimestamp: s
                }
                  , a = {
                    category: "fetch",
                    data: o,
                    level: "error",
                    type: "http"
                };
                e.emit("beforeOutgoingRequestBreadcrumb", a, i),
                it(a, i)
            } else {
                const o = n.response
                  , i = {
                    ...n.fetchData,
                    status_code: o == null ? void 0 : o.status
                };
                n.fetchData.request_body_size,
                n.fetchData.response_body_size,
                o == null || o.status;
                const a = {
                    input: n.args,
                    response: o,
                    startTimestamp: r,
                    endTimestamp: s
                }
                  , c = {
                    category: "fetch",
                    data: i,
                    type: "http",
                    level: cd(i.status_code)
                };
                e.emit("beforeOutgoingRequestBreadcrumb", c, a),
                it(c, a)
            }
    }
}
function uE(e) {
    return function(n) {
        if (M() !== e)
            return;
        let r = n.from
          , s = n.to;
        const o = Kt(L.location.href);
        let i = r ? Kt(r) : void 0;
        const a = Kt(s);
        i != null && i.path || (i = o),
        o.protocol === a.protocol && o.host === a.host && (s = a.relative),
        o.protocol === i.protocol && o.host === i.host && (r = i.relative),
        it({
            category: "navigation",
            data: {
                from: r,
                to: s
            }
        })
    }
}
function lE(e) {
    return !!e && !!e.target
}
const dE = ["EventTarget", "Window", "Node", "ApplicationCache", "AudioTrackList", "BroadcastChannel", "ChannelMergerNode", "CryptoOperation", "EventSource", "FileReader", "HTMLUnknownElement", "IDBDatabase", "IDBRequest", "IDBTransaction", "KeyOperation", "MediaController", "MessagePort", "ModalWindow", "Notification", "SVGElementInstance", "Screen", "SharedWorker", "TextTrack", "TextTrackCue", "TextTrackList", "WebSocket", "WebSocketWorker", "Worker", "XMLHttpRequest", "XMLHttpRequestEventTarget", "XMLHttpRequestUpload"]
  , fE = "BrowserApiErrors"
  , pE = (e={}) => {
    const t = {
        XMLHttpRequest: !0,
        eventTarget: !0,
        requestAnimationFrame: !0,
        setInterval: !0,
        setTimeout: !0,
        unregisterOriginalCallbacks: !1,
        ...e
    };
    return {
        name: fE,
        setupOnce() {
            t.setTimeout && Me(L, "setTimeout", qc),
            t.setInterval && Me(L, "setInterval", qc),
            t.requestAnimationFrame && Me(L, "requestAnimationFrame", mE),
            t.XMLHttpRequest && "XMLHttpRequest"in L && Me(XMLHttpRequest.prototype, "send", gE);
            const n = t.eventTarget;
            n && (Array.isArray(n) ? n : dE).forEach(s => _E(s, t))
        }
    }
}
  , hE = pE;
function qc(e) {
    return function(...t) {
        const n = t[0];
        return t[0] = Dn(n, {
            mechanism: {
                data: {
                    function: mt(e)
                },
                handled: !1,
                type: "instrument"
            }
        }),
        e.apply(this, t)
    }
}
function mE(e) {
    return function(t) {
        return e.apply(this, [Dn(t, {
            mechanism: {
                data: {
                    function: "requestAnimationFrame",
                    handler: mt(e)
                },
                handled: !1,
                type: "instrument"
            }
        })])
    }
}
function gE(e) {
    return function(...t) {
        const n = this;
        return ["onload", "onerror", "onprogress", "onreadystatechange"].forEach(s => {
            s in n && typeof n[s] == "function" && Me(n, s, function(o) {
                const i = {
                    mechanism: {
                        data: {
                            function: s,
                            handler: mt(o)
                        },
                        handled: !1,
                        type: "instrument"
                    }
                }
                  , a = Pi(o);
                return a && (i.mechanism.data.handler = mt(a)),
                Dn(o, i)
            })
        }
        ),
        e.apply(this, t)
    }
}
function _E(e, t) {
    var s, o;
    const r = (s = L[e]) == null ? void 0 : s.prototype;
    (o = r == null ? void 0 : r.hasOwnProperty) != null && o.call(r, "addEventListener") && (Me(r, "addEventListener", function(i) {
        return function(a, c, u) {
            try {
                yE(c) && (c.handleEvent = Dn(c.handleEvent, {
                    mechanism: {
                        data: {
                            function: "handleEvent",
                            handler: mt(c),
                            target: e
                        },
                        handled: !1,
                        type: "instrument"
                    }
                }))
            } catch {}
            return t.unregisterOriginalCallbacks && SE(this, a, c),
            i.apply(this, [a, Dn(c, {
                mechanism: {
                    data: {
                        function: "addEventListener",
                        handler: mt(c),
                        target: e
                    },
                    handled: !1,
                    type: "instrument"
                }
            }), u])
        }
    }),
    Me(r, "removeEventListener", function(i) {
        return function(a, c, u) {
            try {
                const d = c.__sentry_wrapped__;
                d && i.call(this, a, d, u)
            } catch {}
            return i.call(this, a, c, u)
        }
    }))
}
function yE(e) {
    return typeof e.handleEvent == "function"
}
function SE(e, t, n) {
    e && typeof e == "object" && "removeEventListener"in e && typeof e.removeEventListener == "function" && e.removeEventListener(t, n)
}
const bE = () => ({
    name: "BrowserSession",
    setupOnce() {
        if (typeof L.document > "u") {
            V && y.warn("Using the `browserSessionIntegration` in non-browser environments is not supported.");
            return
        }
        Za({
            ignoreDuration: !0
        }),
        Qa(),
        ro( ({from: e, to: t}) => {
            e !== void 0 && e !== t && (Za({
                ignoreDuration: !0
            }),
            Qa())
        }
        )
    }
})
  , EE = "GlobalHandlers"
  , vE = (e={}) => {
    const t = {
        onerror: !0,
        onunhandledrejection: !0,
        ...e
    };
    return {
        name: EE,
        setupOnce() {
            Error.stackTraceLimit = 50
        },
        setup(n) {
            t.onerror && (TE(n),
            Gc("onerror")),
            t.onunhandledrejection && (IE(n),
            Gc("onunhandledrejection"))
        }
    }
}
  , wE = vE;
function TE(e) {
    Ku(t => {
        const {stackParser: n, attachStacktrace: r} = jd();
        if (M() !== e || Td())
            return;
        const {msg: s, url: o, line: i, column: a, error: c} = t
          , u = RE(ra(n, c || s, void 0, r, !1), o, i, a);
        u.level = "error",
        Js(u, {
            originalException: c,
            mechanism: {
                handled: !1,
                type: "onerror"
            }
        })
    }
    )
}
function IE(e) {
    Ju(t => {
        const {stackParser: n, attachStacktrace: r} = jd();
        if (M() !== e || Td())
            return;
        const s = kE(t)
          , o = kn(s) ? CE(s) : ra(n, s, void 0, r, !0);
        o.level = "error",
        Js(o, {
            originalException: s,
            mechanism: {
                handled: !1,
                type: "onunhandledrejection"
            }
        })
    }
    )
}
function kE(e) {
    if (kn(e))
        return e;
    try {
        if ("reason"in e)
            return e.reason;
        if ("detail"in e && "reason"in e.detail)
            return e.detail.reason
    } catch {}
    return e
}
function CE(e) {
    return {
        exception: {
            values: [{
                type: "UnhandledRejection",
                value: `Non-Error promise rejection captured with value: ${String(e)}`
            }]
        }
    }
}
function RE(e, t, n, r) {
    const s = e.exception = e.exception || {}
      , o = s.values = s.values || []
      , i = o[0] = o[0] || {}
      , a = i.stacktrace = i.stacktrace || {}
      , c = a.frames = a.frames || []
      , u = r
      , d = n
      , l = Ke(t) && t.length > 0 ? t : rn();
    return c.length === 0 && c.push({
        colno: u,
        filename: l,
        function: st,
        in_app: !0,
        lineno: d
    }),
    e
}
function Gc(e) {
    V && y.log(`Global Handler attached: ${e}`)
}
function jd() {
    const e = M();
    return (e == null ? void 0 : e.getOptions()) || {
        stackParser: () => [],
        attachStacktrace: !1
    }
}
const xE = () => ({
    name: "HttpContext",
    preprocessEvent(e) {
        var r;
        if (!L.navigator && !L.location && !L.document)
            return;
        const t = gi()
          , n = {
            ...t.headers,
            ...(r = e.request) == null ? void 0 : r.headers
        };
        e.request = {
            ...t,
            ...e.request,
            headers: n
        }
    }
})
  , ME = "cause"
  , AE = 5
  , NE = "LinkedErrors"
  , OE = (e={}) => {
    const t = e.limit || AE
      , n = e.key || ME;
    return {
        name: NE,
        preprocessEvent(r, s, o) {
            const i = o.getOptions();
            yg(ta, i.stackParser, n, t, r, s)
        }
    }
}
  , LE = OE;
function PE() {
    return DE() ? (V && nn( () => {
        console.error("[Sentry] You cannot use Sentry.init() in a browser extension, see: https://docs.sentry.io/platforms/javascript/best-practices/browser-extensions/")
    }
    ),
    !0) : !1
}
function DE() {
    var o;
    if (typeof L.window > "u")
        return !1;
    const e = L;
    if (e.nw)
        return !1;
    const t = e.chrome || e.browser;
    if (!((o = t == null ? void 0 : t.runtime) != null && o.id))
        return !1;
    const n = rn()
      , r = ["chrome-extension", "moz-extension", "ms-browser-extension", "safari-web-extension"];
    return !(L === L.top && r.some(i => n.startsWith(`${i}://`)))
}
function FE(e) {
    return [lg(), ig(), hE(), rE(), wE(), LE(), Cg(), xE(), bE()]
}
function $E(e={}) {
    const t = !e.skipBrowserExtensionCheck && PE()
      , n = {
        ...e,
        enabled: t ? !1 : e.enabled,
        stackParser: kp(e.stackParser || Qb),
        integrations: vm({
            integrations: e.integrations,
            defaultIntegrations: e.defaultIntegrations == null ? FE() : e.defaultIntegrations
        }),
        transport: e.transport || Wd
    };
    return $m(mS, n)
}
function rk() {}
function sk(e) {
    e()
}
function Vc(e={}) {
    const t = L.document
      , n = (t == null ? void 0 : t.head) || (t == null ? void 0 : t.body);
    if (!n) {
        V && y.error("[showReportDialog] Global document not defined");
        return
    }
    const r = j()
      , s = M()
      , o = s == null ? void 0 : s.getDsn();
    if (!o) {
        V && y.error("[showReportDialog] DSN not configured");
        return
    }
    const i = {
        ...e,
        user: {
            ...r.getUser(),
            ...e.user
        },
        eventId: e.eventId || hm()
    }
      , a = L.document.createElement("script");
    a.async = !0,
    a.crossOrigin = "anonymous",
    a.src = bm(o, i);
    const {onLoad: c, onClose: u} = i;
    if (c && (a.onload = c),
    u) {
        const d = l => {
            if (l.data === "__sentry_reportdialog_closed__")
                try {
                    u()
                } finally {
                    L.removeEventListener("message", d)
                }
        }
        ;
        L.addEventListener("message", d)
    }
    n.appendChild(a)
}
const BE = P
  , UE = "ReportingObserver"
  , Yc = new WeakMap
  , HE = (e={}) => {
    const t = e.types || ["crash", "deprecation", "intervention"];
    function n(r) {
        if (Yc.has(M()))
            for (const s of r)
                Be(o => {
                    o.setExtra("url", s.url);
                    const i = `ReportingObserver [${s.type}]`;
                    let a = "No details available";
                    if (s.body) {
                        const c = {};
                        for (const u in s.body)
                            c[u] = s.body[u];
                        if (o.setExtra("body", c),
                        s.type === "crash") {
                            const u = s.body;
                            a = [u.crashId || "", u.reason || ""].join(" ").trim() || a
                        } else
                            a = s.body.message || a
                    }
                    si(`${i}: ${a}`)
                }
                )
    }
    return {
        name: UE,
        setupOnce() {
            if (!k_())
                return;
            new BE.ReportingObserver(n,{
                buffered: !0,
                types: t
            }).observe()
        },
        setup(r) {
            Yc.set(r, !0)
        }
    }
}
  , ok = HE
  , WE = "HttpClient"
  , zE = (e={}) => {
    const t = {
        failedRequestStatusCodes: [[500, 599]],
        failedRequestTargets: [/.*/],
        ...e
    };
    return {
        name: WE,
        setup(n) {
            JE(n, t),
            ZE(n, t)
        }
    }
}
  , ik = zE;
function jE(e, t, n, r, s) {
    if (Gd(e, n.status, n.url)) {
        const o = QE(t, r);
        let i, a, c, u;
        Yd() && ([i,c] = Xc("Cookie", o),
        [a,u] = Xc("Set-Cookie", n));
        const d = Vd({
            url: o.url,
            method: o.method,
            status: n.status,
            requestHeaders: i,
            responseHeaders: a,
            requestCookies: c,
            responseCookies: u,
            error: s
        });
        Js(d)
    }
}
function Xc(e, t) {
    const n = VE(t.headers);
    let r;
    try {
        const s = n[e] || n[e.toLowerCase()] || void 0;
        s && (r = qd(s))
    } catch {}
    return [n, r]
}
function qE(e, t, n, r, s) {
    if (Gd(e, t.status, t.responseURL)) {
        let o, i, a;
        if (Yd()) {
            try {
                const u = t.getResponseHeader("Set-Cookie") || t.getResponseHeader("set-cookie") || void 0;
                u && (i = qd(u))
            } catch {}
            try {
                a = YE(t)
            } catch {}
            o = r
        }
        const c = Vd({
            url: t.responseURL,
            method: n,
            status: t.status,
            requestHeaders: o,
            responseHeaders: a,
            responseCookies: i,
            error: s
        });
        Js(c)
    }
}
function GE(e) {
    if (e) {
        const t = e["Content-Length"] || e["content-length"];
        if (t)
            return parseInt(t, 10)
    }
}
function qd(e) {
    return e.split("; ").reduce( (t, n) => {
        const [r,s] = n.split("=");
        return r && s && (t[r] = s),
        t
    }
    , {})
}
function VE(e) {
    const t = {};
    return e.forEach( (n, r) => {
        t[r] = n
    }
    ),
    t
}
function YE(e) {
    const t = e.getAllResponseHeaders();
    return t ? t.split(`\r
`).reduce( (n, r) => {
        const [s,o] = r.split(": ");
        return s && o && (n[s] = o),
        n
    }
    , {}) : {}
}
function XE(e, t) {
    return e.some(n => typeof n == "string" ? t.includes(n) : n.test(t))
}
function KE(e, t) {
    return e.some(n => typeof n == "number" ? n === t : t >= n[0] && t <= n[1])
}
function JE(e, t) {
    ud() && Xi(n => {
        if (M() !== e)
            return;
        const {response: r, args: s, error: o, virtualError: i} = n
          , [a,c] = s;
        r && jE(t, a, r, c, o || i)
    }
    , !1)
}
function ZE(e, t) {
    "XMLHttpRequest"in P && la(n => {
        if (M() !== e)
            return;
        const {error: r, virtualError: s} = n
          , o = n.xhr
          , i = o[ft];
        if (!i)
            return;
        const {method: a, request_headers: c} = i;
        try {
            qE(t, o, a, c, r || s)
        } catch (u) {
            V && y.warn("Error while extracting response event form XHR response", u)
        }
    }
    )
}
function Gd(e, t, n) {
    return KE(e.failedRequestStatusCodes, t) && XE(e.failedRequestTargets, n) && !Kl(n, M())
}
function Vd(e) {
    const t = M()
      , n = t && e.error && e.error instanceof Error ? e.error.stack : void 0
      , r = n && t ? t.getOptions().stackParser(n, 0, 1) : void 0
      , s = `HTTP Client Error with status code: ${e.status}`
      , o = {
        message: s,
        exception: {
            values: [{
                type: "Error",
                value: s,
                stacktrace: r ? {
                    frames: r
                } : void 0
            }]
        },
        request: {
            url: e.url,
            method: e.method,
            headers: e.requestHeaders,
            cookies: e.requestCookies
        },
        contexts: {
            response: {
                status_code: e.status,
                headers: e.responseHeaders,
                cookies: e.responseCookies,
                body_size: GE(e.responseHeaders)
            }
        }
    };
    return Pt(o, {
        type: "http.client",
        handled: !1
    }),
    o
}
function QE(e, t) {
    return !t && e instanceof Request || e instanceof Request && e.bodyUsed ? e : new Request(e,t)
}
function Yd() {
    const e = M();
    return e ? !!e.getOptions().sendDefaultPii : !1
}
const Bo = P
  , ev = 7
  , tv = "ContextLines"
  , nv = (e={}) => {
    const t = e.frameContextLines != null ? e.frameContextLines : ev;
    return {
        name: tv,
        processEvent(n) {
            return rv(n, t)
        }
    }
}
  , ak = nv;
function rv(e, t) {
    var a;
    const n = Bo.document
      , r = Bo.location && ad(Bo.location.href);
    if (!n || !r)
        return e;
    const s = (a = e.exception) == null ? void 0 : a.values;
    if (!(s != null && s.length))
        return e;
    const o = n.documentElement.innerHTML;
    if (!o)
        return e;
    const i = ["<!DOCTYPE html>", "<html>", ...o.split(`
`), "</html>"];
    return s.forEach(c => {
        const u = c.stacktrace;
        u != null && u.frames && (u.frames = u.frames.map(d => sv(d, i, r, t)))
    }
    ),
    e
}
function sv(e, t, n, r) {
    return e.filename !== n || !e.lineno || !t.length || Bp(t, e, r),
    e
}
const ov = "GraphQLClient"
  , iv = e => ({
    name: ov,
    setup(t) {
        av(t, e),
        cv(t, e)
    }
});
function av(e, t) {
    e.on("beforeOutgoingRequestSpan", (n, r) => {
        const o = z(n).data || {};
        if (!(o[be] === "http.client"))
            return;
        const c = o[eh] || o["http.url"]
          , u = o[Qp] || o["http.method"];
        if (!Ke(c) || !Ke(u))
            return;
        const {endpoints: d} = t
          , l = Je(c, d)
          , f = Kd(r);
        if (l && f) {
            const p = Jd(f);
            if (p) {
                const h = Xd(p);
                n.updateName(`${u} ${c} (${h})`),
                n.setAttribute("graphql.document", f)
            }
        }
    }
    )
}
function cv(e, t) {
    e.on("beforeOutgoingRequestBreadcrumb", (n, r) => {
        const {category: s, type: o, data: i} = n;
        if (o === "http" && (s === "fetch" || s === "xhr")) {
            const d = i == null ? void 0 : i.url
              , {endpoints: l} = t
              , f = Je(d, l)
              , p = Kd(r);
            if (f && i && p) {
                const h = Jd(p);
                if (!i.graphql && h) {
                    const m = Xd(h);
                    i["graphql.document"] = h.query,
                    i["graphql.operation"] = m
                }
            }
        }
    }
    )
}
function Xd(e) {
    const {query: t, operationName: n} = e
      , {operationName: r=n, operationType: s} = uv(t);
    return r ? `${s} ${r}` : `${s}`
}
function Kd(e) {
    const t = "xhr"in e;
    let n;
    if (t) {
        const r = e.xhr[ft];
        n = r && Ds(r.body)[0]
    } else {
        const r = da(e.input);
        n = Ds(r)[0]
    }
    return n
}
function uv(e) {
    const t = /^(?:\s*)(query|mutation|subscription)(?:\s*)(\w+)(?:\s*)[{(]/
      , n = /^(?:\s*)(query|mutation|subscription)(?:\s*)[{(]/
      , r = e.match(t);
    if (r)
        return {
            operationType: r[1],
            operationName: r[2]
        };
    const s = e.match(n);
    return s ? {
        operationType: s[1],
        operationName: void 0
    } : {
        operationType: void 0,
        operationName: void 0
    }
}
function Jd(e) {
    let t;
    try {
        const n = JSON.parse(e);
        !!n.query && (t = n)
    } finally {
        return t
    }
}
const ck = iv
  , ue = P
  , fa = "sentryReplaySession"
  , lv = "replay_event"
  , pa = "Unable to send Replay"
  , dv = 3e5
  , fv = 9e5
  , pv = 5e3
  , hv = 5500
  , mv = 6e4
  , gv = 5e3
  , _v = 3
  , Kc = 15e4
  , Xr = 5e3
  , yv = 3e3
  , Sv = 300
  , ha = 2e7
  , bv = 4999
  , Ev = 15e3
  , Jc = 36e5;
var vv = Object.defineProperty
  , wv = (e, t, n) => t in e ? vv(e, t, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: n
}) : e[t] = n
  , Zc = (e, t, n) => wv(e, typeof t != "symbol" ? t + "" : t, n)
  , ve = (e => (e[e.Document = 0] = "Document",
e[e.DocumentType = 1] = "DocumentType",
e[e.Element = 2] = "Element",
e[e.Text = 3] = "Text",
e[e.CDATA = 4] = "CDATA",
e[e.Comment = 5] = "Comment",
e))(ve || {});
function Tv(e) {
    return e.nodeType === e.ELEMENT_NODE
}
function rr(e) {
    const t = e == null ? void 0 : e.host;
    return (t == null ? void 0 : t.shadowRoot) === e
}
function sr(e) {
    return Object.prototype.toString.call(e) === "[object ShadowRoot]"
}
function Iv(e) {
    return e.includes(" background-clip: text;") && !e.includes(" -webkit-background-clip: text;") && (e = e.replace(/\sbackground-clip:\s*text;/g, " -webkit-background-clip: text; background-clip: text;")),
    e
}
function kv(e) {
    const {cssText: t} = e;
    if (t.split('"').length < 3)
        return t;
    const n = ["@import", `url(${JSON.stringify(e.href)})`];
    return e.layerName === "" ? n.push("layer") : e.layerName && n.push(`layer(${e.layerName})`),
    e.supportsText && n.push(`supports(${e.supportsText})`),
    e.media.length && n.push(e.media.mediaText),
    n.join(" ") + ";"
}
function Fs(e) {
    try {
        const t = e.rules || e.cssRules;
        return t ? Iv(Array.from(t, Zd).join("")) : null
    } catch {
        return null
    }
}
function Cv(e) {
    let t = "";
    for (let n = 0; n < e.style.length; n++) {
        const r = e.style
          , s = r[n]
          , o = r.getPropertyPriority(s);
        t += `${s}:${r.getPropertyValue(s)}${o ? " !important" : ""};`
    }
    return `${e.selectorText} { ${t} }`
}
function Zd(e) {
    let t;
    if (xv(e))
        try {
            t = Fs(e.styleSheet) || kv(e)
        } catch {}
    else if (Mv(e)) {
        let n = e.cssText;
        const r = e.selectorText.includes(":")
          , s = typeof e.style.all == "string" && e.style.all;
        if (s && (n = Cv(e)),
        r && (n = Rv(n)),
        r || s)
            return n
    }
    return t || e.cssText
}
function Rv(e) {
    const t = /(\[(?:[\w-]+)[^\\])(:(?:[\w-]+)\])/gm;
    return e.replace(t, "$1\\$2")
}
function xv(e) {
    return "styleSheet"in e
}
function Mv(e) {
    return "selectorText"in e
}
let Qd = class {
    constructor() {
        Zc(this, "idNodeMap", new Map),
        Zc(this, "nodeMetaMap", new WeakMap)
    }
    getId(t) {
        var r;
        return t ? ((r = this.getMeta(t)) == null ? void 0 : r.id) ?? -1 : -1
    }
    getNode(t) {
        return this.idNodeMap.get(t) || null
    }
    getIds() {
        return Array.from(this.idNodeMap.keys())
    }
    getMeta(t) {
        return this.nodeMetaMap.get(t) || null
    }
    removeNodeFromMap(t) {
        const n = this.getId(t);
        this.idNodeMap.delete(n),
        t.childNodes && t.childNodes.forEach(r => this.removeNodeFromMap(r))
    }
    has(t) {
        return this.idNodeMap.has(t)
    }
    hasNode(t) {
        return this.nodeMetaMap.has(t)
    }
    add(t, n) {
        const r = n.id;
        this.idNodeMap.set(r, t),
        this.nodeMetaMap.set(t, n)
    }
    replace(t, n) {
        const r = this.getNode(t);
        if (r) {
            const s = this.nodeMetaMap.get(r);
            s && this.nodeMetaMap.set(n, s)
        }
        this.idNodeMap.set(t, n)
    }
    reset() {
        this.idNodeMap = new Map,
        this.nodeMetaMap = new WeakMap
    }
}
;
function Av() {
    return new Qd
}
function so({maskInputOptions: e, tagName: t, type: n}) {
    return t === "OPTION" && (t = "SELECT"),
    !!(e[t.toLowerCase()] || n && e[n] || n === "password" || t === "INPUT" && !n && e.text)
}
function ur({isMasked: e, element: t, value: n, maskInputFn: r}) {
    let s = n || "";
    return e ? (r && (s = r(s, t)),
    "*".repeat(s.length)) : s
}
function Un(e) {
    return e.toLowerCase()
}
function vi(e) {
    return e.toUpperCase()
}
const Qc = "__rrweb_original__";
function Nv(e) {
    const t = e.getContext("2d");
    if (!t)
        return !0;
    const n = 50;
    for (let r = 0; r < e.width; r += n)
        for (let s = 0; s < e.height; s += n) {
            const o = t.getImageData
              , i = Qc in o ? o[Qc] : o;
            if (new Uint32Array(i.call(t, r, s, Math.min(n, e.width - r), Math.min(n, e.height - s)).data.buffer).some(c => c !== 0))
                return !1
        }
    return !0
}
function ma(e) {
    const t = e.type;
    return e.hasAttribute("data-rr-is-password") ? "password" : t ? Un(t) : null
}
function $s(e, t, n) {
    return t === "INPUT" && (n === "radio" || n === "checkbox") ? e.getAttribute("value") || "" : e.value
}
function ef(e, t) {
    let n;
    try {
        n = new URL(e,t ?? window.location.href)
    } catch {
        return null
    }
    const r = /\.([0-9a-z]+)(?:$)/i
      , s = n.pathname.match(r);
    return (s == null ? void 0 : s[1]) ?? null
}
const eu = {};
function tf(e) {
    const t = eu[e];
    if (t)
        return t;
    const n = window.document;
    let r = window[e];
    if (n && typeof n.createElement == "function")
        try {
            const s = n.createElement("iframe");
            s.hidden = !0,
            n.head.appendChild(s);
            const o = s.contentWindow;
            o && o[e] && (r = o[e]),
            n.head.removeChild(s)
        } catch {}
    return eu[e] = r.bind(window)
}
function wi(...e) {
    return tf("setTimeout")(...e)
}
function nf(...e) {
    return tf("clearTimeout")(...e)
}
function rf(e) {
    try {
        return e.contentDocument
    } catch {}
}
let Ov = 1;
const Lv = new RegExp("[^a-z0-9-_:]")
  , lr = -2;
function ga() {
    return Ov++
}
function Pv(e) {
    if (e instanceof HTMLFormElement)
        return "form";
    const t = Un(e.tagName);
    return Lv.test(t) ? "div" : t
}
function Dv(e) {
    let t = "";
    return e.indexOf("//") > -1 ? t = e.split("/").slice(0, 3).join("/") : t = e.split("/")[0],
    t = t.split("?")[0],
    t
}
let pn, tu;
const Fv = /url\((?:(')([^']*)'|(")(.*?)"|([^)]*))\)/gm
  , $v = /^(?:[a-z+]+:)?\/\//i
  , Bv = /^www\..*/i
  , Uv = /^(data:)([^,]*),(.*)/i;
function Bs(e, t) {
    return (e || "").replace(Fv, (n, r, s, o, i, a) => {
        const c = s || i || a
          , u = r || o || "";
        if (!c)
            return n;
        if ($v.test(c) || Bv.test(c))
            return `url(${u}${c}${u})`;
        if (Uv.test(c))
            return `url(${u}${c}${u})`;
        if (c[0] === "/")
            return `url(${u}${Dv(t) + c}${u})`;
        const d = t.split("/")
          , l = c.split("/");
        d.pop();
        for (const f of l)
            f !== "." && (f === ".." ? d.pop() : d.push(f));
        return `url(${u}${d.join("/")}${u})`
    }
    )
}
const Hv = /^[^ \t\n\r\u000c]+/
  , Wv = /^[, \t\n\r\u000c]+/;
function zv(e, t) {
    if (t.trim() === "")
        return t;
    let n = 0;
    function r(o) {
        let i;
        const a = o.exec(t.substring(n));
        return a ? (i = a[0],
        n += i.length,
        i) : ""
    }
    const s = [];
    for (; r(Wv),
    !(n >= t.length); ) {
        let o = r(Hv);
        if (o.slice(-1) === ",")
            o = yn(e, o.substring(0, o.length - 1)),
            s.push(o);
        else {
            let i = "";
            o = yn(e, o);
            let a = !1;
            for (; ; ) {
                const c = t.charAt(n);
                if (c === "") {
                    s.push((o + i).trim());
                    break
                } else if (a)
                    c === ")" && (a = !1);
                else if (c === ",") {
                    n += 1,
                    s.push((o + i).trim());
                    break
                } else
                    c === "(" && (a = !0);
                i += c,
                n += 1
            }
        }
    }
    return s.join(", ")
}
const nu = new WeakMap;
function yn(e, t) {
    return !t || t.trim() === "" ? t : oo(e, t)
}
function jv(e) {
    return !!(e.tagName === "svg" || e.ownerSVGElement)
}
function oo(e, t) {
    let n = nu.get(e);
    if (n || (n = e.createElement("a"),
    nu.set(e, n)),
    !t)
        t = "";
    else if (t.startsWith("blob:") || t.startsWith("data:"))
        return t;
    return n.setAttribute("href", t),
    n.href
}
function sf(e, t, n, r, s, o) {
    return r && (n === "src" || n === "href" && !(t === "use" && r[0] === "#") || n === "xlink:href" && r[0] !== "#" || n === "background" && (t === "table" || t === "td" || t === "th") ? yn(e, r) : n === "srcset" ? zv(e, r) : n === "style" ? Bs(r, oo(e)) : t === "object" && n === "data" ? yn(e, r) : typeof o == "function" ? o(n, r, s) : r)
}
function of(e, t, n) {
    return (e === "video" || e === "audio") && t === "autoplay"
}
function af(e, t, n, r) {
    try {
        if (r && e.matches(r))
            return !1;
        if (typeof t == "string") {
            if (e.classList.contains(t))
                return !0
        } else
            for (let s = e.classList.length; s--; ) {
                const o = e.classList[s];
                if (t.test(o))
                    return !0
            }
        if (n)
            return e.matches(n)
    } catch {}
    return !1
}
function qv(e, t) {
    for (let n = e.classList.length; n--; ) {
        const r = e.classList[n];
        if (t.test(r))
            return !0
    }
    return !1
}
function Gt(e, t, n=1 / 0, r=0) {
    return !e || e.nodeType !== e.ELEMENT_NODE || r > n ? -1 : t(e) ? r : Gt(e.parentNode, t, n, r + 1)
}
function Sn(e, t) {
    return n => {
        const r = n;
        if (r === null)
            return !1;
        try {
            if (e) {
                if (typeof e == "string") {
                    if (r.matches(`.${e}`))
                        return !0
                } else if (qv(r, e))
                    return !0
            }
            return !!(t && r.matches(t))
        } catch {
            return !1
        }
    }
}
function Hn(e, t, n, r, s, o) {
    try {
        const i = e.nodeType === e.ELEMENT_NODE ? e : e.parentElement;
        if (i === null)
            return !1;
        if (i.tagName === "INPUT") {
            const u = i.getAttribute("autocomplete");
            if (["current-password", "new-password", "cc-number", "cc-exp", "cc-exp-month", "cc-exp-year", "cc-csc"].includes(u))
                return !0
        }
        let a = -1
          , c = -1;
        if (o) {
            if (c = Gt(i, Sn(r, s)),
            c < 0)
                return !0;
            a = Gt(i, Sn(t, n), c >= 0 ? c : 1 / 0)
        } else {
            if (a = Gt(i, Sn(t, n)),
            a < 0)
                return !1;
            c = Gt(i, Sn(r, s), a >= 0 ? a : 1 / 0)
        }
        return a >= 0 ? c >= 0 ? a <= c : !0 : c >= 0 ? !1 : !!o
    } catch {}
    return !!o
}
function Gv(e, t, n) {
    const r = e.contentWindow;
    if (!r)
        return;
    let s = !1, o;
    try {
        o = r.document.readyState
    } catch {
        return
    }
    if (o !== "complete") {
        const a = wi( () => {
            s || (t(),
            s = !0)
        }
        , n);
        e.addEventListener("load", () => {
            nf(a),
            s = !0,
            t()
        }
        );
        return
    }
    const i = "about:blank";
    if (r.location.href !== i || e.src === i || e.src === "")
        return wi(t, 0),
        e.addEventListener("load", t);
    e.addEventListener("load", t)
}
function Vv(e, t, n) {
    let r = !1, s;
    try {
        s = e.sheet
    } catch {
        return
    }
    if (s)
        return;
    const o = wi( () => {
        r || (t(),
        r = !0)
    }
    , n);
    e.addEventListener("load", () => {
        nf(o),
        r = !0,
        t()
    }
    )
}
function Yv(e, t) {
    const {doc: n, mirror: r, blockClass: s, blockSelector: o, unblockSelector: i, maskAllText: a, maskAttributeFn: c, maskTextClass: u, unmaskTextClass: d, maskTextSelector: l, unmaskTextSelector: f, inlineStylesheet: p, maskInputOptions: h={}, maskTextFn: m, maskInputFn: _, dataURLOptions: g={}, inlineImages: b, recordCanvas: T, keepIframeSrcFn: C, newlyAddedElement: S=!1} = t
      , E = Xv(n, r);
    switch (e.nodeType) {
    case e.DOCUMENT_NODE:
        return e.compatMode !== "CSS1Compat" ? {
            type: ve.Document,
            childNodes: [],
            compatMode: e.compatMode
        } : {
            type: ve.Document,
            childNodes: []
        };
    case e.DOCUMENT_TYPE_NODE:
        return {
            type: ve.DocumentType,
            name: e.name,
            publicId: e.publicId,
            systemId: e.systemId,
            rootId: E
        };
    case e.ELEMENT_NODE:
        return Jv(e, {
            doc: n,
            blockClass: s,
            blockSelector: o,
            unblockSelector: i,
            inlineStylesheet: p,
            maskAttributeFn: c,
            maskInputOptions: h,
            maskInputFn: _,
            dataURLOptions: g,
            inlineImages: b,
            recordCanvas: T,
            keepIframeSrcFn: C,
            newlyAddedElement: S,
            rootId: E,
            maskTextClass: u,
            unmaskTextClass: d,
            maskTextSelector: l,
            unmaskTextSelector: f
        });
    case e.TEXT_NODE:
        return Kv(e, {
            doc: n,
            maskAllText: a,
            maskTextClass: u,
            unmaskTextClass: d,
            maskTextSelector: l,
            unmaskTextSelector: f,
            maskTextFn: m,
            maskInputOptions: h,
            maskInputFn: _,
            rootId: E
        });
    case e.CDATA_SECTION_NODE:
        return {
            type: ve.CDATA,
            textContent: "",
            rootId: E
        };
    case e.COMMENT_NODE:
        return {
            type: ve.Comment,
            textContent: e.textContent || "",
            rootId: E
        };
    default:
        return !1
    }
}
function Xv(e, t) {
    if (!t.hasNode(e))
        return;
    const n = t.getId(e);
    return n === 1 ? void 0 : n
}
function Kv(e, t) {
    var g;
    const {maskAllText: n, maskTextClass: r, unmaskTextClass: s, maskTextSelector: o, unmaskTextSelector: i, maskTextFn: a, maskInputOptions: c, maskInputFn: u, rootId: d} = t
      , l = e.parentNode && e.parentNode.tagName;
    let f = e.textContent;
    const p = l === "STYLE" ? !0 : void 0
      , h = l === "SCRIPT" ? !0 : void 0
      , m = l === "TEXTAREA" ? !0 : void 0;
    if (p && f) {
        try {
            e.nextSibling || e.previousSibling || (g = e.parentNode.sheet) != null && g.cssRules && (f = Fs(e.parentNode.sheet))
        } catch (b) {
            console.warn(`Cannot get CSS styles from text's parentNode. Error: ${b}`, e)
        }
        f = Bs(f, oo(t.doc))
    }
    h && (f = "SCRIPT_PLACEHOLDER");
    const _ = Hn(e, r, o, s, i, n);
    if (!p && !h && !m && f && _ && (f = a ? a(f, e.parentElement) : f.replace(/[\S]/g, "*")),
    m && f && (c.textarea || _) && (f = u ? u(f, e.parentNode) : f.replace(/[\S]/g, "*")),
    l === "OPTION" && f) {
        const b = so({
            type: null,
            tagName: l,
            maskInputOptions: c
        });
        f = ur({
            isMasked: Hn(e, r, o, s, i, b),
            element: e,
            value: f,
            maskInputFn: u
        })
    }
    return {
        type: ve.Text,
        textContent: f || "",
        isStyle: p,
        rootId: d
    }
}
function Jv(e, t) {
    const {doc: n, blockClass: r, blockSelector: s, unblockSelector: o, inlineStylesheet: i, maskInputOptions: a={}, maskAttributeFn: c, maskInputFn: u, dataURLOptions: d={}, inlineImages: l, recordCanvas: f, keepIframeSrcFn: p, newlyAddedElement: h=!1, rootId: m, maskTextClass: _, unmaskTextClass: g, maskTextSelector: b, unmaskTextSelector: T} = t
      , C = af(e, r, s, o)
      , S = Pv(e);
    let E = {};
    const k = e.attributes.length;
    for (let w = 0; w < k; w++) {
        const I = e.attributes[w];
        I.name && !of(S, I.name, I.value) && (E[I.name] = sf(n, S, Un(I.name), I.value, e, c))
    }
    if (S === "link" && i) {
        const w = Array.from(n.styleSheets).find(F => F.href === e.href);
        let I = null;
        w && (I = Fs(w)),
        I && (E.rel = null,
        E.href = null,
        E.crossorigin = null,
        E._cssText = Bs(I, w.href))
    }
    if (S === "style" && e.sheet && !(e.innerText || e.textContent || "").trim().length) {
        const w = Fs(e.sheet);
        w && (E._cssText = Bs(w, oo(n)))
    }
    if (S === "input" || S === "textarea" || S === "select" || S === "option") {
        const w = e
          , I = ma(w)
          , F = $s(w, vi(S), I)
          , v = w.checked;
        if (I !== "submit" && I !== "button" && F) {
            const R = Hn(w, _, b, g, T, so({
                type: I,
                tagName: vi(S),
                maskInputOptions: a
            }));
            E.value = ur({
                isMasked: R,
                element: w,
                value: F,
                maskInputFn: u
            })
        }
        v && (E.checked = v)
    }
    if (S === "option" && (e.selected && !a.select ? E.selected = !0 : delete E.selected),
    S === "canvas" && f) {
        if (e.__context === "2d")
            Nv(e) || (E.rr_dataURL = e.toDataURL(d.type, d.quality));
        else if (!("__context"in e)) {
            const w = e.toDataURL(d.type, d.quality)
              , I = n.createElement("canvas");
            I.width = e.width,
            I.height = e.height;
            const F = I.toDataURL(d.type, d.quality);
            w !== F && (E.rr_dataURL = w)
        }
    }
    if (S === "img" && l) {
        pn || (pn = n.createElement("canvas"),
        tu = pn.getContext("2d"));
        const w = e
          , I = w.currentSrc || w.getAttribute("src") || "<unknown-src>"
          , F = w.crossOrigin
          , v = () => {
            w.removeEventListener("load", v);
            try {
                pn.width = w.naturalWidth,
                pn.height = w.naturalHeight,
                tu.drawImage(w, 0, 0),
                E.rr_dataURL = pn.toDataURL(d.type, d.quality)
            } catch (R) {
                if (w.crossOrigin !== "anonymous") {
                    w.crossOrigin = "anonymous",
                    w.complete && w.naturalWidth !== 0 ? v() : w.addEventListener("load", v);
                    return
                } else
                    console.warn(`Cannot inline img src=${I}! Error: ${R}`)
            }
            w.crossOrigin === "anonymous" && (F ? E.crossOrigin = F : w.removeAttribute("crossorigin"))
        }
        ;
        w.complete && w.naturalWidth !== 0 ? v() : w.addEventListener("load", v)
    }
    if ((S === "audio" || S === "video") && (E.rr_mediaState = e.paused ? "paused" : "played",
    E.rr_mediaCurrentTime = e.currentTime),
    h || (e.scrollLeft && (E.rr_scrollLeft = e.scrollLeft),
    e.scrollTop && (E.rr_scrollTop = e.scrollTop)),
    C) {
        const {width: w, height: I} = e.getBoundingClientRect();
        E = {
            class: E.class,
            rr_width: `${w}px`,
            rr_height: `${I}px`
        }
    }
    S === "iframe" && !p(E.src) && (!C && !rf(e) && (E.rr_src = E.src),
    delete E.src);
    let N;
    try {
        customElements.get(S) && (N = !0)
    } catch {}
    return {
        type: ve.Element,
        tagName: S,
        attributes: E,
        childNodes: [],
        isSVG: jv(e) || void 0,
        needBlock: C,
        rootId: m,
        isCustom: N
    }
}
function ce(e) {
    return e == null ? "" : e.toLowerCase()
}
function Zv(e, t) {
    if (t.comment && e.type === ve.Comment)
        return !0;
    if (e.type === ve.Element) {
        if (t.script && (e.tagName === "script" || e.tagName === "link" && (e.attributes.rel === "preload" || e.attributes.rel === "modulepreload") || e.tagName === "link" && e.attributes.rel === "prefetch" && typeof e.attributes.href == "string" && ef(e.attributes.href) === "js"))
            return !0;
        if (t.headFavicon && (e.tagName === "link" && e.attributes.rel === "shortcut icon" || e.tagName === "meta" && (ce(e.attributes.name).match(/^msapplication-tile(image|color)$/) || ce(e.attributes.name) === "application-name" || ce(e.attributes.rel) === "icon" || ce(e.attributes.rel) === "apple-touch-icon" || ce(e.attributes.rel) === "shortcut icon")))
            return !0;
        if (e.tagName === "meta") {
            if (t.headMetaDescKeywords && ce(e.attributes.name).match(/^description|keywords$/))
                return !0;
            if (t.headMetaSocial && (ce(e.attributes.property).match(/^(og|twitter|fb):/) || ce(e.attributes.name).match(/^(og|twitter):/) || ce(e.attributes.name) === "pinterest"))
                return !0;
            if (t.headMetaRobots && (ce(e.attributes.name) === "robots" || ce(e.attributes.name) === "googlebot" || ce(e.attributes.name) === "bingbot"))
                return !0;
            if (t.headMetaHttpEquiv && e.attributes["http-equiv"] !== void 0)
                return !0;
            if (t.headMetaAuthorship && (ce(e.attributes.name) === "author" || ce(e.attributes.name) === "generator" || ce(e.attributes.name) === "framework" || ce(e.attributes.name) === "publisher" || ce(e.attributes.name) === "progid" || ce(e.attributes.property).match(/^article:/) || ce(e.attributes.property).match(/^product:/)))
                return !0;
            if (t.headMetaVerification && (ce(e.attributes.name) === "google-site-verification" || ce(e.attributes.name) === "yandex-verification" || ce(e.attributes.name) === "csrf-token" || ce(e.attributes.name) === "p:domain_verify" || ce(e.attributes.name) === "verify-v1" || ce(e.attributes.name) === "verification" || ce(e.attributes.name) === "shopify-checkout-api-token"))
                return !0
        }
    }
    return !1
}
function bn(e, t) {
    const {doc: n, mirror: r, blockClass: s, blockSelector: o, unblockSelector: i, maskAllText: a, maskTextClass: c, unmaskTextClass: u, maskTextSelector: d, unmaskTextSelector: l, skipChild: f=!1, inlineStylesheet: p=!0, maskInputOptions: h={}, maskAttributeFn: m, maskTextFn: _, maskInputFn: g, slimDOMOptions: b, dataURLOptions: T={}, inlineImages: C=!1, recordCanvas: S=!1, onSerialize: E, onIframeLoad: k, iframeLoadTimeout: N=5e3, onStylesheetLoad: w, stylesheetLoadTimeout: I=5e3, keepIframeSrcFn: F= () => !1, newlyAddedElement: v=!1} = t;
    let {preserveWhiteSpace: R=!0} = t;
    const A = Yv(e, {
        doc: n,
        mirror: r,
        blockClass: s,
        blockSelector: o,
        maskAllText: a,
        unblockSelector: i,
        maskTextClass: c,
        unmaskTextClass: u,
        maskTextSelector: d,
        unmaskTextSelector: l,
        inlineStylesheet: p,
        maskInputOptions: h,
        maskAttributeFn: m,
        maskTextFn: _,
        maskInputFn: g,
        dataURLOptions: T,
        inlineImages: C,
        recordCanvas: S,
        keepIframeSrcFn: F,
        newlyAddedElement: v
    });
    if (!A)
        return console.warn(e, "not serialized"),
        null;
    let U;
    r.hasNode(e) ? U = r.getId(e) : Zv(A, b) || !R && A.type === ve.Text && !A.isStyle && !A.textContent.replace(/^\s+|\s+$/gm, "").length ? U = lr : U = ga();
    const O = Object.assign(A, {
        id: U
    });
    if (r.add(e, O),
    U === lr)
        return null;
    E && E(e);
    let X = !f;
    if (O.type === ve.Element) {
        X = X && !O.needBlock,
        delete O.needBlock;
        const D = e.shadowRoot;
        D && sr(D) && (O.isShadowHost = !0)
    }
    if ((O.type === ve.Document || O.type === ve.Element) && X) {
        b.headWhitespace && O.type === ve.Element && O.tagName === "head" && (R = !1);
        const D = {
            doc: n,
            mirror: r,
            blockClass: s,
            blockSelector: o,
            maskAllText: a,
            unblockSelector: i,
            maskTextClass: c,
            unmaskTextClass: u,
            maskTextSelector: d,
            unmaskTextSelector: l,
            skipChild: f,
            inlineStylesheet: p,
            maskInputOptions: h,
            maskAttributeFn: m,
            maskTextFn: _,
            maskInputFn: g,
            slimDOMOptions: b,
            dataURLOptions: T,
            inlineImages: C,
            recordCanvas: S,
            preserveWhiteSpace: R,
            onSerialize: E,
            onIframeLoad: k,
            iframeLoadTimeout: N,
            onStylesheetLoad: w,
            stylesheetLoadTimeout: I,
            keepIframeSrcFn: F
        };
        for (const K of Array.from(e.childNodes)) {
            const Q = bn(K, D);
            Q && O.childNodes.push(Q)
        }
        if (Tv(e) && e.shadowRoot)
            for (const K of Array.from(e.shadowRoot.childNodes)) {
                const Q = bn(K, D);
                Q && (sr(e.shadowRoot) && (Q.isShadow = !0),
                O.childNodes.push(Q))
            }
    }
    return e.parentNode && rr(e.parentNode) && sr(e.parentNode) && (O.isShadow = !0),
    O.type === ve.Element && O.tagName === "iframe" && !af(e, s, o, i) && Gv(e, () => {
        const D = rf(e);
        if (D && k) {
            const K = bn(D, {
                doc: D,
                mirror: r,
                blockClass: s,
                blockSelector: o,
                unblockSelector: i,
                maskAllText: a,
                maskTextClass: c,
                unmaskTextClass: u,
                maskTextSelector: d,
                unmaskTextSelector: l,
                skipChild: !1,
                inlineStylesheet: p,
                maskInputOptions: h,
                maskAttributeFn: m,
                maskTextFn: _,
                maskInputFn: g,
                slimDOMOptions: b,
                dataURLOptions: T,
                inlineImages: C,
                recordCanvas: S,
                preserveWhiteSpace: R,
                onSerialize: E,
                onIframeLoad: k,
                iframeLoadTimeout: N,
                onStylesheetLoad: w,
                stylesheetLoadTimeout: I,
                keepIframeSrcFn: F
            });
            K && k(e, K)
        }
    }
    , N),
    O.type === ve.Element && O.tagName === "link" && typeof O.attributes.rel == "string" && (O.attributes.rel === "stylesheet" || O.attributes.rel === "preload" && typeof O.attributes.href == "string" && ef(O.attributes.href) === "css") && Vv(e, () => {
        if (w) {
            const D = bn(e, {
                doc: n,
                mirror: r,
                blockClass: s,
                blockSelector: o,
                unblockSelector: i,
                maskAllText: a,
                maskTextClass: c,
                unmaskTextClass: u,
                maskTextSelector: d,
                unmaskTextSelector: l,
                skipChild: !1,
                inlineStylesheet: p,
                maskInputOptions: h,
                maskAttributeFn: m,
                maskTextFn: _,
                maskInputFn: g,
                slimDOMOptions: b,
                dataURLOptions: T,
                inlineImages: C,
                recordCanvas: S,
                preserveWhiteSpace: R,
                onSerialize: E,
                onIframeLoad: k,
                iframeLoadTimeout: N,
                onStylesheetLoad: w,
                stylesheetLoadTimeout: I,
                keepIframeSrcFn: F
            });
            D && w(e, D)
        }
    }
    , I),
    O
}
function Qv(e, t) {
    const {mirror: n=new Qd, blockClass: r="rr-block", blockSelector: s=null, unblockSelector: o=null, maskAllText: i=!1, maskTextClass: a="rr-mask", unmaskTextClass: c=null, maskTextSelector: u=null, unmaskTextSelector: d=null, inlineStylesheet: l=!0, inlineImages: f=!1, recordCanvas: p=!1, maskAllInputs: h=!1, maskAttributeFn: m, maskTextFn: _, maskInputFn: g, slimDOM: b=!1, dataURLOptions: T, preserveWhiteSpace: C, onSerialize: S, onIframeLoad: E, iframeLoadTimeout: k, onStylesheetLoad: N, stylesheetLoadTimeout: w, keepIframeSrcFn: I= () => !1} = t || {};
    return bn(e, {
        doc: e,
        mirror: n,
        blockClass: r,
        blockSelector: s,
        unblockSelector: o,
        maskAllText: i,
        maskTextClass: a,
        unmaskTextClass: c,
        maskTextSelector: u,
        unmaskTextSelector: d,
        skipChild: !1,
        inlineStylesheet: l,
        maskInputOptions: h === !0 ? {
            color: !0,
            date: !0,
            "datetime-local": !0,
            email: !0,
            month: !0,
            number: !0,
            range: !0,
            search: !0,
            tel: !0,
            text: !0,
            time: !0,
            url: !0,
            week: !0,
            textarea: !0,
            select: !0
        } : h === !1 ? {} : h,
        maskAttributeFn: m,
        maskTextFn: _,
        maskInputFn: g,
        slimDOMOptions: b === !0 || b === "all" ? {
            script: !0,
            comment: !0,
            headFavicon: !0,
            headWhitespace: !0,
            headMetaDescKeywords: b === "all",
            headMetaSocial: !0,
            headMetaRobots: !0,
            headMetaHttpEquiv: !0,
            headMetaAuthorship: !0,
            headMetaVerification: !0
        } : b === !1 ? {} : b,
        dataURLOptions: T,
        inlineImages: f,
        recordCanvas: p,
        preserveWhiteSpace: C,
        onSerialize: S,
        onIframeLoad: E,
        iframeLoadTimeout: k,
        onStylesheetLoad: N,
        stylesheetLoadTimeout: w,
        keepIframeSrcFn: I,
        newlyAddedElement: !1
    })
}
function xe(e, t, n=document) {
    const r = {
        capture: !0,
        passive: !0
    };
    return n.addEventListener(e, t, r),
    () => n.removeEventListener(e, t, r)
}
const hn = `Please stop import mirror directly. Instead of that,\r
now you can use replayer.getMirror() to access the mirror instance of a replayer,\r
or you can use record.mirror to access the mirror instance during recording.`;
let ru = {
    map: {},
    getId() {
        return console.error(hn),
        -1
    },
    getNode() {
        return console.error(hn),
        null
    },
    removeNodeFromMap() {
        console.error(hn)
    },
    has() {
        return console.error(hn),
        !1
    },
    reset() {
        console.error(hn)
    }
};
typeof window < "u" && window.Proxy && window.Reflect && (ru = new Proxy(ru,{
    get(e, t, n) {
        return t === "map" && console.error(hn),
        Reflect.get(e, t, n)
    }
}));
function dr(e, t, n={}) {
    let r = null
      , s = 0;
    return function(...o) {
        const i = Date.now();
        !s && n.leading === !1 && (s = i);
        const a = t - (i - s)
          , c = this;
        a <= 0 || a > t ? (r && (i0(r),
        r = null),
        s = i,
        e.apply(c, o)) : !r && n.trailing !== !1 && (r = io( () => {
            s = n.leading === !1 ? 0 : Date.now(),
            r = null,
            e.apply(c, o)
        }
        , a))
    }
}
function cf(e, t, n, r, s=window) {
    const o = s.Object.getOwnPropertyDescriptor(e, t);
    return s.Object.defineProperty(e, t, r ? n : {
        set(i) {
            io( () => {
                n.set.call(this, i)
            }
            , 0),
            o && o.set && o.set.call(this, i)
        }
    }),
    () => cf(e, t, o || {}, !0)
}
function _a(e, t, n) {
    try {
        if (!(t in e))
            return () => {}
            ;
        const r = e[t]
          , s = n(r);
        return typeof s == "function" && (s.prototype = s.prototype || {},
        Object.defineProperties(s, {
            __rrweb_original__: {
                enumerable: !1,
                value: r
            }
        })),
        e[t] = s,
        () => {
            e[t] = r
        }
    } catch {
        return () => {}
    }
}
let Us = Date.now;
/[1-9][0-9]{12}/.test(Date.now().toString()) || (Us = () => new Date().getTime());
function uf(e) {
    var n, r, s, o, i, a;
    const t = e.document;
    return {
        left: t.scrollingElement ? t.scrollingElement.scrollLeft : e.pageXOffset !== void 0 ? e.pageXOffset : (t == null ? void 0 : t.documentElement.scrollLeft) || ((r = (n = t == null ? void 0 : t.body) == null ? void 0 : n.parentElement) == null ? void 0 : r.scrollLeft) || ((s = t == null ? void 0 : t.body) == null ? void 0 : s.scrollLeft) || 0,
        top: t.scrollingElement ? t.scrollingElement.scrollTop : e.pageYOffset !== void 0 ? e.pageYOffset : (t == null ? void 0 : t.documentElement.scrollTop) || ((i = (o = t == null ? void 0 : t.body) == null ? void 0 : o.parentElement) == null ? void 0 : i.scrollTop) || ((a = t == null ? void 0 : t.body) == null ? void 0 : a.scrollTop) || 0
    }
}
function lf() {
    return window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body && document.body.clientHeight
}
function df() {
    return window.innerWidth || document.documentElement && document.documentElement.clientWidth || document.body && document.body.clientWidth
}
function ff(e) {
    if (!e)
        return null;
    try {
        return e.nodeType === e.ELEMENT_NODE ? e : e.parentElement
    } catch {
        return null
    }
}
function Fe(e, t, n, r, s) {
    if (!e)
        return !1;
    const o = ff(e);
    if (!o)
        return !1;
    const i = Sn(t, n);
    if (!s) {
        const u = r && o.matches(r);
        return i(o) && !u
    }
    const a = Gt(o, i);
    let c = -1;
    return a < 0 ? !1 : (r && (c = Gt(o, Sn(null, r))),
    a > -1 && c < 0 ? !0 : a < c)
}
function e0(e, t) {
    return t.getId(e) !== -1
}
function Uo(e, t) {
    return t.getId(e) === lr
}
function pf(e, t) {
    if (rr(e))
        return !1;
    const n = t.getId(e);
    return t.has(n) ? e.parentNode && e.parentNode.nodeType === e.DOCUMENT_NODE ? !1 : e.parentNode ? pf(e.parentNode, t) : !0 : !0
}
function Ti(e) {
    return !!e.changedTouches
}
function t0(e=window) {
    "NodeList"in e && !e.NodeList.prototype.forEach && (e.NodeList.prototype.forEach = Array.prototype.forEach),
    "DOMTokenList"in e && !e.DOMTokenList.prototype.forEach && (e.DOMTokenList.prototype.forEach = Array.prototype.forEach),
    Node.prototype.contains || (Node.prototype.contains = (...t) => {
        let n = t[0];
        if (!(0 in t))
            throw new TypeError("1 argument is required");
        do
            if (this === n)
                return !0;
        while (n = n && n.parentNode);
        return !1
    }
    )
}
function hf(e, t) {
    return !!(e.nodeName === "IFRAME" && t.getMeta(e))
}
function mf(e, t) {
    return !!(e.nodeName === "LINK" && e.nodeType === e.ELEMENT_NODE && e.getAttribute && e.getAttribute("rel") === "stylesheet" && t.getMeta(e))
}
function Ii(e) {
    return !!(e != null && e.shadowRoot)
}
class n0 {
    constructor() {
        this.id = 1,
        this.styleIDMap = new WeakMap,
        this.idStyleMap = new Map
    }
    getId(t) {
        return this.styleIDMap.get(t) ?? -1
    }
    has(t) {
        return this.styleIDMap.has(t)
    }
    add(t, n) {
        if (this.has(t))
            return this.getId(t);
        let r;
        return n === void 0 ? r = this.id++ : r = n,
        this.styleIDMap.set(t, r),
        this.idStyleMap.set(r, t),
        r
    }
    getStyle(t) {
        return this.idStyleMap.get(t) || null
    }
    reset() {
        this.styleIDMap = new WeakMap,
        this.idStyleMap = new Map,
        this.id = 1
    }
    generateId() {
        return this.id++
    }
}
function gf(e) {
    var n, r;
    let t = null;
    return ((r = (n = e.getRootNode) == null ? void 0 : n.call(e)) == null ? void 0 : r.nodeType) === Node.DOCUMENT_FRAGMENT_NODE && e.getRootNode().host && (t = e.getRootNode().host),
    t
}
function r0(e) {
    let t = e, n;
    for (; n = gf(t); )
        t = n;
    return t
}
function s0(e) {
    const t = e.ownerDocument;
    if (!t)
        return !1;
    const n = r0(e);
    return t.contains(n)
}
function _f(e) {
    const t = e.ownerDocument;
    return t ? t.contains(e) || s0(e) : !1
}
const su = {};
function ya(e) {
    const t = su[e];
    if (t)
        return t;
    const n = window.document;
    let r = window[e];
    if (n && typeof n.createElement == "function")
        try {
            const s = n.createElement("iframe");
            s.hidden = !0,
            n.head.appendChild(s);
            const o = s.contentWindow;
            o && o[e] && (r = o[e]),
            n.head.removeChild(s)
        } catch {}
    return su[e] = r.bind(window)
}
function o0(...e) {
    return ya("requestAnimationFrame")(...e)
}
function io(...e) {
    return ya("setTimeout")(...e)
}
function i0(...e) {
    return ya("clearTimeout")(...e)
}
var q = (e => (e[e.DomContentLoaded = 0] = "DomContentLoaded",
e[e.Load = 1] = "Load",
e[e.FullSnapshot = 2] = "FullSnapshot",
e[e.IncrementalSnapshot = 3] = "IncrementalSnapshot",
e[e.Meta = 4] = "Meta",
e[e.Custom = 5] = "Custom",
e[e.Plugin = 6] = "Plugin",
e))(q || {})
  , W = (e => (e[e.Mutation = 0] = "Mutation",
e[e.MouseMove = 1] = "MouseMove",
e[e.MouseInteraction = 2] = "MouseInteraction",
e[e.Scroll = 3] = "Scroll",
e[e.ViewportResize = 4] = "ViewportResize",
e[e.Input = 5] = "Input",
e[e.TouchMove = 6] = "TouchMove",
e[e.MediaInteraction = 7] = "MediaInteraction",
e[e.StyleSheetRule = 8] = "StyleSheetRule",
e[e.CanvasMutation = 9] = "CanvasMutation",
e[e.Font = 10] = "Font",
e[e.Log = 11] = "Log",
e[e.Drag = 12] = "Drag",
e[e.StyleDeclaration = 13] = "StyleDeclaration",
e[e.Selection = 14] = "Selection",
e[e.AdoptedStyleSheet = 15] = "AdoptedStyleSheet",
e[e.CustomElement = 16] = "CustomElement",
e))(W || {})
  , Re = (e => (e[e.MouseUp = 0] = "MouseUp",
e[e.MouseDown = 1] = "MouseDown",
e[e.Click = 2] = "Click",
e[e.ContextMenu = 3] = "ContextMenu",
e[e.DblClick = 4] = "DblClick",
e[e.Focus = 5] = "Focus",
e[e.Blur = 6] = "Blur",
e[e.TouchStart = 7] = "TouchStart",
e[e.TouchMove_Departed = 8] = "TouchMove_Departed",
e[e.TouchEnd = 9] = "TouchEnd",
e[e.TouchCancel = 10] = "TouchCancel",
e))(Re || {})
  , lt = (e => (e[e.Mouse = 0] = "Mouse",
e[e.Pen = 1] = "Pen",
e[e.Touch = 2] = "Touch",
e))(lt || {})
  , mn = (e => (e[e.Play = 0] = "Play",
e[e.Pause = 1] = "Pause",
e[e.Seeked = 2] = "Seeked",
e[e.VolumeChange = 3] = "VolumeChange",
e[e.RateChange = 4] = "RateChange",
e))(mn || {});
function Sa(e) {
    try {
        return e.contentDocument
    } catch {}
}
function a0(e) {
    try {
        return e.contentWindow
    } catch {}
}
function ou(e) {
    return "__ln"in e
}
class c0 {
    constructor() {
        this.length = 0,
        this.head = null,
        this.tail = null
    }
    get(t) {
        if (t >= this.length)
            throw new Error("Position outside of list range");
        let n = this.head;
        for (let r = 0; r < t; r++)
            n = (n == null ? void 0 : n.next) || null;
        return n
    }
    addNode(t) {
        const n = {
            value: t,
            previous: null,
            next: null
        };
        if (t.__ln = n,
        t.previousSibling && ou(t.previousSibling)) {
            const r = t.previousSibling.__ln.next;
            n.next = r,
            n.previous = t.previousSibling.__ln,
            t.previousSibling.__ln.next = n,
            r && (r.previous = n)
        } else if (t.nextSibling && ou(t.nextSibling) && t.nextSibling.__ln.previous) {
            const r = t.nextSibling.__ln.previous;
            n.previous = r,
            n.next = t.nextSibling.__ln,
            t.nextSibling.__ln.previous = n,
            r && (r.next = n)
        } else
            this.head && (this.head.previous = n),
            n.next = this.head,
            this.head = n;
        n.next === null && (this.tail = n),
        this.length++
    }
    removeNode(t) {
        const n = t.__ln;
        this.head && (n.previous ? (n.previous.next = n.next,
        n.next ? n.next.previous = n.previous : this.tail = n.previous) : (this.head = n.next,
        this.head ? this.head.previous = null : this.tail = null),
        t.__ln && delete t.__ln,
        this.length--)
    }
}
const iu = (e, t) => `${e}@${t}`;
class u0 {
    constructor() {
        this.frozen = !1,
        this.locked = !1,
        this.texts = [],
        this.attributes = [],
        this.attributeMap = new WeakMap,
        this.removes = [],
        this.mapRemoves = [],
        this.movedMap = {},
        this.addedSet = new Set,
        this.movedSet = new Set,
        this.droppedSet = new Set,
        this.processMutations = t => {
            t.forEach(this.processMutation),
            this.emit()
        }
        ,
        this.emit = () => {
            if (this.frozen || this.locked)
                return;
            const t = []
              , n = new Set
              , r = new c0
              , s = c => {
                let u = c
                  , d = lr;
                for (; d === lr; )
                    u = u && u.nextSibling,
                    d = u && this.mirror.getId(u);
                return d
            }
              , o = c => {
                if (!c.parentNode || !_f(c))
                    return;
                const u = rr(c.parentNode) ? this.mirror.getId(gf(c)) : this.mirror.getId(c.parentNode)
                  , d = s(c);
                if (u === -1 || d === -1)
                    return r.addNode(c);
                const l = bn(c, {
                    doc: this.doc,
                    mirror: this.mirror,
                    blockClass: this.blockClass,
                    blockSelector: this.blockSelector,
                    maskAllText: this.maskAllText,
                    unblockSelector: this.unblockSelector,
                    maskTextClass: this.maskTextClass,
                    unmaskTextClass: this.unmaskTextClass,
                    maskTextSelector: this.maskTextSelector,
                    unmaskTextSelector: this.unmaskTextSelector,
                    skipChild: !0,
                    newlyAddedElement: !0,
                    inlineStylesheet: this.inlineStylesheet,
                    maskInputOptions: this.maskInputOptions,
                    maskAttributeFn: this.maskAttributeFn,
                    maskTextFn: this.maskTextFn,
                    maskInputFn: this.maskInputFn,
                    slimDOMOptions: this.slimDOMOptions,
                    dataURLOptions: this.dataURLOptions,
                    recordCanvas: this.recordCanvas,
                    inlineImages: this.inlineImages,
                    onSerialize: f => {
                        hf(f, this.mirror) && !Fe(f, this.blockClass, this.blockSelector, this.unblockSelector, !1) && this.iframeManager.addIframe(f),
                        mf(f, this.mirror) && this.stylesheetManager.trackLinkElement(f),
                        Ii(c) && this.shadowDomManager.addShadowRoot(c.shadowRoot, this.doc)
                    }
                    ,
                    onIframeLoad: (f, p) => {
                        Fe(f, this.blockClass, this.blockSelector, this.unblockSelector, !1) || (this.iframeManager.attachIframe(f, p),
                        f.contentWindow && this.canvasManager.addWindow(f.contentWindow),
                        this.shadowDomManager.observeAttachShadow(f))
                    }
                    ,
                    onStylesheetLoad: (f, p) => {
                        this.stylesheetManager.attachLinkElement(f, p)
                    }
                });
                l && (t.push({
                    parentId: u,
                    nextId: d,
                    node: l
                }),
                n.add(l.id))
            }
            ;
            for (; this.mapRemoves.length; )
                this.mirror.removeNodeFromMap(this.mapRemoves.shift());
            for (const c of this.movedSet)
                au(this.removes, c, this.mirror) && !this.movedSet.has(c.parentNode) || o(c);
            for (const c of this.addedSet)
                !cu(this.droppedSet, c) && !au(this.removes, c, this.mirror) || cu(this.movedSet, c) ? o(c) : this.droppedSet.add(c);
            let i = null;
            for (; r.length; ) {
                let c = null;
                if (i) {
                    const u = this.mirror.getId(i.value.parentNode)
                      , d = s(i.value);
                    u !== -1 && d !== -1 && (c = i)
                }
                if (!c) {
                    let u = r.tail;
                    for (; u; ) {
                        const d = u;
                        if (u = u.previous,
                        d) {
                            const l = this.mirror.getId(d.value.parentNode);
                            if (s(d.value) === -1)
                                continue;
                            if (l !== -1) {
                                c = d;
                                break
                            } else {
                                const p = d.value;
                                if (p.parentNode && p.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                                    const h = p.parentNode.host;
                                    if (this.mirror.getId(h) !== -1) {
                                        c = d;
                                        break
                                    }
                                }
                            }
                        }
                    }
                }
                if (!c) {
                    for (; r.head; )
                        r.removeNode(r.head.value);
                    break
                }
                i = c.previous,
                r.removeNode(c.value),
                o(c.value)
            }
            const a = {
                texts: this.texts.map(c => ({
                    id: this.mirror.getId(c.node),
                    value: c.value
                })).filter(c => !n.has(c.id)).filter(c => this.mirror.has(c.id)),
                attributes: this.attributes.map(c => {
                    const {attributes: u} = c;
                    if (typeof u.style == "string") {
                        const d = JSON.stringify(c.styleDiff)
                          , l = JSON.stringify(c._unchangedStyles);
                        d.length < u.style.length && (d + l).split("var(").length === u.style.split("var(").length && (u.style = c.styleDiff)
                    }
                    return {
                        id: this.mirror.getId(c.node),
                        attributes: u
                    }
                }
                ).filter(c => !n.has(c.id)).filter(c => this.mirror.has(c.id)),
                removes: this.removes,
                adds: t
            };
            !a.texts.length && !a.attributes.length && !a.removes.length && !a.adds.length || (this.texts = [],
            this.attributes = [],
            this.attributeMap = new WeakMap,
            this.removes = [],
            this.addedSet = new Set,
            this.movedSet = new Set,
            this.droppedSet = new Set,
            this.movedMap = {},
            this.mutationCb(a))
        }
        ,
        this.processMutation = t => {
            if (!Uo(t.target, this.mirror))
                switch (t.type) {
                case "characterData":
                    {
                        const n = t.target.textContent;
                        !Fe(t.target, this.blockClass, this.blockSelector, this.unblockSelector, !1) && n !== t.oldValue && this.texts.push({
                            value: Hn(t.target, this.maskTextClass, this.maskTextSelector, this.unmaskTextClass, this.unmaskTextSelector, this.maskAllText) && n ? this.maskTextFn ? this.maskTextFn(n, ff(t.target)) : n.replace(/[\S]/g, "*") : n,
                            node: t.target
                        });
                        break
                    }
                case "attributes":
                    {
                        const n = t.target;
                        let r = t.attributeName
                          , s = t.target.getAttribute(r);
                        if (r === "value") {
                            const i = ma(n)
                              , a = n.tagName;
                            s = $s(n, a, i);
                            const c = so({
                                maskInputOptions: this.maskInputOptions,
                                tagName: a,
                                type: i
                            })
                              , u = Hn(t.target, this.maskTextClass, this.maskTextSelector, this.unmaskTextClass, this.unmaskTextSelector, c);
                            s = ur({
                                isMasked: u,
                                element: n,
                                value: s,
                                maskInputFn: this.maskInputFn
                            })
                        }
                        if (Fe(t.target, this.blockClass, this.blockSelector, this.unblockSelector, !1) || s === t.oldValue)
                            return;
                        let o = this.attributeMap.get(t.target);
                        if (n.tagName === "IFRAME" && r === "src" && !this.keepIframeSrcFn(s))
                            if (!Sa(n))
                                r = "rr_src";
                            else
                                return;
                        if (o || (o = {
                            node: t.target,
                            attributes: {},
                            styleDiff: {},
                            _unchangedStyles: {}
                        },
                        this.attributes.push(o),
                        this.attributeMap.set(t.target, o)),
                        r === "type" && n.tagName === "INPUT" && (t.oldValue || "").toLowerCase() === "password" && n.setAttribute("data-rr-is-password", "true"),
                        !of(n.tagName, r) && (o.attributes[r] = sf(this.doc, Un(n.tagName), Un(r), s, n, this.maskAttributeFn),
                        r === "style")) {
                            if (!this.unattachedDoc)
                                try {
                                    this.unattachedDoc = document.implementation.createHTMLDocument()
                                } catch {
                                    this.unattachedDoc = this.doc
                                }
                            const i = this.unattachedDoc.createElement("span");
                            t.oldValue && i.setAttribute("style", t.oldValue);
                            for (const a of Array.from(n.style)) {
                                const c = n.style.getPropertyValue(a)
                                  , u = n.style.getPropertyPriority(a);
                                c !== i.style.getPropertyValue(a) || u !== i.style.getPropertyPriority(a) ? u === "" ? o.styleDiff[a] = c : o.styleDiff[a] = [c, u] : o._unchangedStyles[a] = [c, u]
                            }
                            for (const a of Array.from(i.style))
                                n.style.getPropertyValue(a) === "" && (o.styleDiff[a] = !1)
                        }
                        break
                    }
                case "childList":
                    {
                        if (Fe(t.target, this.blockClass, this.blockSelector, this.unblockSelector, !0))
                            return;
                        t.addedNodes.forEach(n => this.genAdds(n, t.target)),
                        t.removedNodes.forEach(n => {
                            const r = this.mirror.getId(n)
                              , s = rr(t.target) ? this.mirror.getId(t.target.host) : this.mirror.getId(t.target);
                            Fe(t.target, this.blockClass, this.blockSelector, this.unblockSelector, !1) || Uo(n, this.mirror) || !e0(n, this.mirror) || (this.addedSet.has(n) ? (ki(this.addedSet, n),
                            this.droppedSet.add(n)) : this.addedSet.has(t.target) && r === -1 || pf(t.target, this.mirror) || (this.movedSet.has(n) && this.movedMap[iu(r, s)] ? ki(this.movedSet, n) : this.removes.push({
                                parentId: s,
                                id: r,
                                isShadow: rr(t.target) && sr(t.target) ? !0 : void 0
                            })),
                            this.mapRemoves.push(n))
                        }
                        );
                        break
                    }
                }
        }
        ,
        this.genAdds = (t, n) => {
            if (!this.processedNodeManager.inOtherBuffer(t, this) && !(this.addedSet.has(t) || this.movedSet.has(t))) {
                if (this.mirror.hasNode(t)) {
                    if (Uo(t, this.mirror))
                        return;
                    this.movedSet.add(t);
                    let r = null;
                    n && this.mirror.hasNode(n) && (r = this.mirror.getId(n)),
                    r && r !== -1 && (this.movedMap[iu(this.mirror.getId(t), r)] = !0)
                } else
                    this.addedSet.add(t),
                    this.droppedSet.delete(t);
                Fe(t, this.blockClass, this.blockSelector, this.unblockSelector, !1) || (t.childNodes.forEach(r => this.genAdds(r)),
                Ii(t) && t.shadowRoot.childNodes.forEach(r => {
                    this.processedNodeManager.add(r, this),
                    this.genAdds(r, t)
                }
                ))
            }
        }
    }
    init(t) {
        ["mutationCb", "blockClass", "blockSelector", "unblockSelector", "maskAllText", "maskTextClass", "unmaskTextClass", "maskTextSelector", "unmaskTextSelector", "inlineStylesheet", "maskInputOptions", "maskAttributeFn", "maskTextFn", "maskInputFn", "keepIframeSrcFn", "recordCanvas", "inlineImages", "slimDOMOptions", "dataURLOptions", "doc", "mirror", "iframeManager", "stylesheetManager", "shadowDomManager", "canvasManager", "processedNodeManager"].forEach(n => {
            this[n] = t[n]
        }
        )
    }
    freeze() {
        this.frozen = !0,
        this.canvasManager.freeze()
    }
    unfreeze() {
        this.frozen = !1,
        this.canvasManager.unfreeze(),
        this.emit()
    }
    isFrozen() {
        return this.frozen
    }
    lock() {
        this.locked = !0,
        this.canvasManager.lock()
    }
    unlock() {
        this.locked = !1,
        this.canvasManager.unlock(),
        this.emit()
    }
    reset() {
        this.shadowDomManager.reset(),
        this.canvasManager.reset()
    }
}
function ki(e, t) {
    e.delete(t),
    t.childNodes.forEach(n => ki(e, n))
}
function au(e, t, n) {
    return e.length === 0 ? !1 : l0(e, t, n)
}
function l0(e, t, n) {
    let r = t.parentNode;
    for (; r; ) {
        const s = n.getId(r);
        if (e.some(o => o.id === s))
            return !0;
        r = r.parentNode
    }
    return !1
}
function cu(e, t) {
    return e.size === 0 ? !1 : yf(e, t)
}
function yf(e, t) {
    const {parentNode: n} = t;
    return n ? e.has(n) ? !0 : yf(e, n) : !1
}
let or;
function d0(e) {
    or = e
}
function f0() {
    or = void 0
}
const Z = e => or ? (...n) => {
    try {
        return e(...n)
    } catch (r) {
        if (or && or(r) === !0)
            return () => {}
            ;
        throw r
    }
}
: e
  , En = [];
function Ar(e) {
    try {
        if ("composedPath"in e) {
            const t = e.composedPath();
            if (t.length)
                return t[0]
        } else if ("path"in e && e.path.length)
            return e.path[0]
    } catch {}
    return e && e.target
}
function Sf(e, t) {
    var i, a;
    const n = new u0;
    En.push(n),
    n.init(e);
    let r = window.MutationObserver || window.__rrMutationObserver;
    const s = (a = (i = window == null ? void 0 : window.Zone) == null ? void 0 : i.__symbol__) == null ? void 0 : a.call(i, "MutationObserver");
    s && window[s] && (r = window[s]);
    const o = new r(Z(c => {
        e.onMutation && e.onMutation(c) === !1 || n.processMutations.bind(n)(c)
    }
    ));
    return o.observe(t, {
        attributes: !0,
        attributeOldValue: !0,
        characterData: !0,
        characterDataOldValue: !0,
        childList: !0,
        subtree: !0
    }),
    o
}
function p0({mousemoveCb: e, sampling: t, doc: n, mirror: r}) {
    if (t.mousemove === !1)
        return () => {}
        ;
    const s = typeof t.mousemove == "number" ? t.mousemove : 50
      , o = typeof t.mousemoveCallback == "number" ? t.mousemoveCallback : 500;
    let i = [], a;
    const c = dr(Z(l => {
        const f = Date.now() - a;
        e(i.map(p => (p.timeOffset -= f,
        p)), l),
        i = [],
        a = null
    }
    ), o)
      , u = Z(dr(Z(l => {
        const f = Ar(l)
          , {clientX: p, clientY: h} = Ti(l) ? l.changedTouches[0] : l;
        a || (a = Us()),
        i.push({
            x: p,
            y: h,
            id: r.getId(f),
            timeOffset: Us() - a
        }),
        c(typeof DragEvent < "u" && l instanceof DragEvent ? W.Drag : l instanceof MouseEvent ? W.MouseMove : W.TouchMove)
    }
    ), s, {
        trailing: !1
    }))
      , d = [xe("mousemove", u, n), xe("touchmove", u, n), xe("drag", u, n)];
    return Z( () => {
        d.forEach(l => l())
    }
    )
}
function h0({mouseInteractionCb: e, doc: t, mirror: n, blockClass: r, blockSelector: s, unblockSelector: o, sampling: i}) {
    if (i.mouseInteraction === !1)
        return () => {}
        ;
    const a = i.mouseInteraction === !0 || i.mouseInteraction === void 0 ? {} : i.mouseInteraction
      , c = [];
    let u = null;
    const d = l => f => {
        const p = Ar(f);
        if (Fe(p, r, s, o, !0))
            return;
        let h = null
          , m = l;
        if ("pointerType"in f) {
            switch (f.pointerType) {
            case "mouse":
                h = lt.Mouse;
                break;
            case "touch":
                h = lt.Touch;
                break;
            case "pen":
                h = lt.Pen;
                break
            }
            h === lt.Touch ? Re[l] === Re.MouseDown ? m = "TouchStart" : Re[l] === Re.MouseUp && (m = "TouchEnd") : lt.Pen
        } else
            Ti(f) && (h = lt.Touch);
        h !== null ? (u = h,
        (m.startsWith("Touch") && h === lt.Touch || m.startsWith("Mouse") && h === lt.Mouse) && (h = null)) : Re[l] === Re.Click && (h = u,
        u = null);
        const _ = Ti(f) ? f.changedTouches[0] : f;
        if (!_)
            return;
        const g = n.getId(p)
          , {clientX: b, clientY: T} = _;
        Z(e)({
            type: Re[m],
            id: g,
            x: b,
            y: T,
            ...h !== null && {
                pointerType: h
            }
        })
    }
    ;
    return Object.keys(Re).filter(l => Number.isNaN(Number(l)) && !l.endsWith("_Departed") && a[l] !== !1).forEach(l => {
        let f = Un(l);
        const p = d(l);
        if (window.PointerEvent)
            switch (Re[l]) {
            case Re.MouseDown:
            case Re.MouseUp:
                f = f.replace("mouse", "pointer");
                break;
            case Re.TouchStart:
            case Re.TouchEnd:
                return
            }
        c.push(xe(f, p, t))
    }
    ),
    Z( () => {
        c.forEach(l => l())
    }
    )
}
function bf({scrollCb: e, doc: t, mirror: n, blockClass: r, blockSelector: s, unblockSelector: o, sampling: i}) {
    const a = Z(dr(Z(c => {
        const u = Ar(c);
        if (!u || Fe(u, r, s, o, !0))
            return;
        const d = n.getId(u);
        if (u === t && t.defaultView) {
            const l = uf(t.defaultView);
            e({
                id: d,
                x: l.left,
                y: l.top
            })
        } else
            e({
                id: d,
                x: u.scrollLeft,
                y: u.scrollTop
            })
    }
    ), i.scroll || 100));
    return xe("scroll", a, t)
}
function m0({viewportResizeCb: e}, {win: t}) {
    let n = -1
      , r = -1;
    const s = Z(dr(Z( () => {
        const o = lf()
          , i = df();
        (n !== o || r !== i) && (e({
            width: Number(i),
            height: Number(o)
        }),
        n = o,
        r = i)
    }
    ), 200));
    return xe("resize", s, t)
}
const g0 = ["INPUT", "TEXTAREA", "SELECT"]
  , uu = new WeakMap;
function _0({inputCb: e, doc: t, mirror: n, blockClass: r, blockSelector: s, unblockSelector: o, ignoreClass: i, ignoreSelector: a, maskInputOptions: c, maskInputFn: u, sampling: d, userTriggeredOnInput: l, maskTextClass: f, unmaskTextClass: p, maskTextSelector: h, unmaskTextSelector: m}) {
    function _(k) {
        let N = Ar(k);
        const w = k.isTrusted
          , I = N && vi(N.tagName);
        if (I === "OPTION" && (N = N.parentElement),
        !N || !I || g0.indexOf(I) < 0 || Fe(N, r, s, o, !0))
            return;
        const F = N;
        if (F.classList.contains(i) || a && F.matches(a))
            return;
        const v = ma(N);
        let R = $s(F, I, v)
          , A = !1;
        const U = so({
            maskInputOptions: c,
            tagName: I,
            type: v
        })
          , O = Hn(N, f, h, p, m, U);
        (v === "radio" || v === "checkbox") && (A = N.checked),
        R = ur({
            isMasked: O,
            element: N,
            value: R,
            maskInputFn: u
        }),
        g(N, l ? {
            text: R,
            isChecked: A,
            userTriggered: w
        } : {
            text: R,
            isChecked: A
        });
        const X = N.name;
        v === "radio" && X && A && t.querySelectorAll(`input[type="radio"][name="${X}"]`).forEach(D => {
            if (D !== N) {
                const K = ur({
                    isMasked: O,
                    element: D,
                    value: $s(D, I, v),
                    maskInputFn: u
                });
                g(D, l ? {
                    text: K,
                    isChecked: !A,
                    userTriggered: !1
                } : {
                    text: K,
                    isChecked: !A
                })
            }
        }
        )
    }
    function g(k, N) {
        const w = uu.get(k);
        if (!w || w.text !== N.text || w.isChecked !== N.isChecked) {
            uu.set(k, N);
            const I = n.getId(k);
            Z(e)({
                ...N,
                id: I
            })
        }
    }
    const T = (d.input === "last" ? ["change"] : ["input", "change"]).map(k => xe(k, Z(_), t))
      , C = t.defaultView;
    if (!C)
        return () => {
            T.forEach(k => k())
        }
        ;
    const S = C.Object.getOwnPropertyDescriptor(C.HTMLInputElement.prototype, "value")
      , E = [[C.HTMLInputElement.prototype, "value"], [C.HTMLInputElement.prototype, "checked"], [C.HTMLSelectElement.prototype, "value"], [C.HTMLTextAreaElement.prototype, "value"], [C.HTMLSelectElement.prototype, "selectedIndex"], [C.HTMLOptionElement.prototype, "selected"]];
    return S && S.set && T.push(...E.map(k => cf(k[0], k[1], {
        set() {
            Z(_)({
                target: this,
                isTrusted: !1
            })
        }
    }, !1, C))),
    Z( () => {
        T.forEach(k => k())
    }
    )
}
function Hs(e) {
    const t = [];
    function n(r, s) {
        if (Kr("CSSGroupingRule") && r.parentRule instanceof CSSGroupingRule || Kr("CSSMediaRule") && r.parentRule instanceof CSSMediaRule || Kr("CSSSupportsRule") && r.parentRule instanceof CSSSupportsRule || Kr("CSSConditionRule") && r.parentRule instanceof CSSConditionRule) {
            const i = Array.from(r.parentRule.cssRules).indexOf(r);
            s.unshift(i)
        } else if (r.parentStyleSheet) {
            const i = Array.from(r.parentStyleSheet.cssRules).indexOf(r);
            s.unshift(i)
        }
        return s
    }
    return n(e, t)
}
function Ct(e, t, n) {
    let r, s;
    return e ? (e.ownerNode ? r = t.getId(e.ownerNode) : s = n.getId(e),
    {
        styleId: s,
        id: r
    }) : {}
}
function y0({styleSheetRuleCb: e, mirror: t, stylesheetManager: n}, {win: r}) {
    if (!r.CSSStyleSheet || !r.CSSStyleSheet.prototype)
        return () => {}
        ;
    const s = r.CSSStyleSheet.prototype.insertRule;
    r.CSSStyleSheet.prototype.insertRule = new Proxy(s,{
        apply: Z( (d, l, f) => {
            const [p,h] = f
              , {id: m, styleId: _} = Ct(l, t, n.styleMirror);
            return (m && m !== -1 || _ && _ !== -1) && e({
                id: m,
                styleId: _,
                adds: [{
                    rule: p,
                    index: h
                }]
            }),
            d.apply(l, f)
        }
        )
    });
    const o = r.CSSStyleSheet.prototype.deleteRule;
    r.CSSStyleSheet.prototype.deleteRule = new Proxy(o,{
        apply: Z( (d, l, f) => {
            const [p] = f
              , {id: h, styleId: m} = Ct(l, t, n.styleMirror);
            return (h && h !== -1 || m && m !== -1) && e({
                id: h,
                styleId: m,
                removes: [{
                    index: p
                }]
            }),
            d.apply(l, f)
        }
        )
    });
    let i;
    r.CSSStyleSheet.prototype.replace && (i = r.CSSStyleSheet.prototype.replace,
    r.CSSStyleSheet.prototype.replace = new Proxy(i,{
        apply: Z( (d, l, f) => {
            const [p] = f
              , {id: h, styleId: m} = Ct(l, t, n.styleMirror);
            return (h && h !== -1 || m && m !== -1) && e({
                id: h,
                styleId: m,
                replace: p
            }),
            d.apply(l, f)
        }
        )
    }));
    let a;
    r.CSSStyleSheet.prototype.replaceSync && (a = r.CSSStyleSheet.prototype.replaceSync,
    r.CSSStyleSheet.prototype.replaceSync = new Proxy(a,{
        apply: Z( (d, l, f) => {
            const [p] = f
              , {id: h, styleId: m} = Ct(l, t, n.styleMirror);
            return (h && h !== -1 || m && m !== -1) && e({
                id: h,
                styleId: m,
                replaceSync: p
            }),
            d.apply(l, f)
        }
        )
    }));
    const c = {};
    Jr("CSSGroupingRule") ? c.CSSGroupingRule = r.CSSGroupingRule : (Jr("CSSMediaRule") && (c.CSSMediaRule = r.CSSMediaRule),
    Jr("CSSConditionRule") && (c.CSSConditionRule = r.CSSConditionRule),
    Jr("CSSSupportsRule") && (c.CSSSupportsRule = r.CSSSupportsRule));
    const u = {};
    return Object.entries(c).forEach( ([d,l]) => {
        u[d] = {
            insertRule: l.prototype.insertRule,
            deleteRule: l.prototype.deleteRule
        },
        l.prototype.insertRule = new Proxy(u[d].insertRule,{
            apply: Z( (f, p, h) => {
                const [m,_] = h
                  , {id: g, styleId: b} = Ct(p.parentStyleSheet, t, n.styleMirror);
                return (g && g !== -1 || b && b !== -1) && e({
                    id: g,
                    styleId: b,
                    adds: [{
                        rule: m,
                        index: [...Hs(p), _ || 0]
                    }]
                }),
                f.apply(p, h)
            }
            )
        }),
        l.prototype.deleteRule = new Proxy(u[d].deleteRule,{
            apply: Z( (f, p, h) => {
                const [m] = h
                  , {id: _, styleId: g} = Ct(p.parentStyleSheet, t, n.styleMirror);
                return (_ && _ !== -1 || g && g !== -1) && e({
                    id: _,
                    styleId: g,
                    removes: [{
                        index: [...Hs(p), m]
                    }]
                }),
                f.apply(p, h)
            }
            )
        })
    }
    ),
    Z( () => {
        r.CSSStyleSheet.prototype.insertRule = s,
        r.CSSStyleSheet.prototype.deleteRule = o,
        i && (r.CSSStyleSheet.prototype.replace = i),
        a && (r.CSSStyleSheet.prototype.replaceSync = a),
        Object.entries(c).forEach( ([d,l]) => {
            l.prototype.insertRule = u[d].insertRule,
            l.prototype.deleteRule = u[d].deleteRule
        }
        )
    }
    )
}
function Ef({mirror: e, stylesheetManager: t}, n) {
    var i, a, c;
    let r = null;
    n.nodeName === "#document" ? r = e.getId(n) : r = e.getId(n.host);
    const s = n.nodeName === "#document" ? (i = n.defaultView) == null ? void 0 : i.Document : (c = (a = n.ownerDocument) == null ? void 0 : a.defaultView) == null ? void 0 : c.ShadowRoot
      , o = s != null && s.prototype ? Object.getOwnPropertyDescriptor(s == null ? void 0 : s.prototype, "adoptedStyleSheets") : void 0;
    return r === null || r === -1 || !s || !o ? () => {}
    : (Object.defineProperty(n, "adoptedStyleSheets", {
        configurable: o.configurable,
        enumerable: o.enumerable,
        get() {
            var u;
            return (u = o.get) == null ? void 0 : u.call(this)
        },
        set(u) {
            var l;
            const d = (l = o.set) == null ? void 0 : l.call(this, u);
            if (r !== null && r !== -1)
                try {
                    t.adoptStyleSheets(u, r)
                } catch {}
            return d
        }
    }),
    Z( () => {
        Object.defineProperty(n, "adoptedStyleSheets", {
            configurable: o.configurable,
            enumerable: o.enumerable,
            get: o.get,
            set: o.set
        })
    }
    ))
}
function S0({styleDeclarationCb: e, mirror: t, ignoreCSSAttributes: n, stylesheetManager: r}, {win: s}) {
    const o = s.CSSStyleDeclaration.prototype.setProperty;
    s.CSSStyleDeclaration.prototype.setProperty = new Proxy(o,{
        apply: Z( (a, c, u) => {
            var m;
            const [d,l,f] = u;
            if (n.has(d))
                return o.apply(c, [d, l, f]);
            const {id: p, styleId: h} = Ct((m = c.parentRule) == null ? void 0 : m.parentStyleSheet, t, r.styleMirror);
            return (p && p !== -1 || h && h !== -1) && e({
                id: p,
                styleId: h,
                set: {
                    property: d,
                    value: l,
                    priority: f
                },
                index: Hs(c.parentRule)
            }),
            a.apply(c, u)
        }
        )
    });
    const i = s.CSSStyleDeclaration.prototype.removeProperty;
    return s.CSSStyleDeclaration.prototype.removeProperty = new Proxy(i,{
        apply: Z( (a, c, u) => {
            var p;
            const [d] = u;
            if (n.has(d))
                return i.apply(c, [d]);
            const {id: l, styleId: f} = Ct((p = c.parentRule) == null ? void 0 : p.parentStyleSheet, t, r.styleMirror);
            return (l && l !== -1 || f && f !== -1) && e({
                id: l,
                styleId: f,
                remove: {
                    property: d
                },
                index: Hs(c.parentRule)
            }),
            a.apply(c, u)
        }
        )
    }),
    Z( () => {
        s.CSSStyleDeclaration.prototype.setProperty = o,
        s.CSSStyleDeclaration.prototype.removeProperty = i
    }
    )
}
function b0({mediaInteractionCb: e, blockClass: t, blockSelector: n, unblockSelector: r, mirror: s, sampling: o, doc: i}) {
    const a = Z(u => dr(Z(d => {
        const l = Ar(d);
        if (!l || Fe(l, t, n, r, !0))
            return;
        const {currentTime: f, volume: p, muted: h, playbackRate: m} = l;
        e({
            type: u,
            id: s.getId(l),
            currentTime: f,
            volume: p,
            muted: h,
            playbackRate: m
        })
    }
    ), o.media || 500))
      , c = [xe("play", a(mn.Play), i), xe("pause", a(mn.Pause), i), xe("seeked", a(mn.Seeked), i), xe("volumechange", a(mn.VolumeChange), i), xe("ratechange", a(mn.RateChange), i)];
    return Z( () => {
        c.forEach(u => u())
    }
    )
}
function E0({fontCb: e, doc: t}) {
    const n = t.defaultView;
    if (!n)
        return () => {}
        ;
    const r = []
      , s = new WeakMap
      , o = n.FontFace;
    n.FontFace = function(c, u, d) {
        const l = new o(c,u,d);
        return s.set(l, {
            family: c,
            buffer: typeof u != "string",
            descriptors: d,
            fontSource: typeof u == "string" ? u : JSON.stringify(Array.from(new Uint8Array(u)))
        }),
        l
    }
    ;
    const i = _a(t.fonts, "add", function(a) {
        return function(c) {
            return io(Z( () => {
                const u = s.get(c);
                u && (e(u),
                s.delete(c))
            }
            ), 0),
            a.apply(this, [c])
        }
    });
    return r.push( () => {
        n.FontFace = o
    }
    ),
    r.push(i),
    Z( () => {
        r.forEach(a => a())
    }
    )
}
function v0(e) {
    const {doc: t, mirror: n, blockClass: r, blockSelector: s, unblockSelector: o, selectionCb: i} = e;
    let a = !0;
    const c = Z( () => {
        const u = t.getSelection();
        if (!u || a && (u != null && u.isCollapsed))
            return;
        a = u.isCollapsed || !1;
        const d = []
          , l = u.rangeCount || 0;
        for (let f = 0; f < l; f++) {
            const p = u.getRangeAt(f)
              , {startContainer: h, startOffset: m, endContainer: _, endOffset: g} = p;
            Fe(h, r, s, o, !0) || Fe(_, r, s, o, !0) || d.push({
                start: n.getId(h),
                startOffset: m,
                end: n.getId(_),
                endOffset: g
            })
        }
        i({
            ranges: d
        })
    }
    );
    return c(),
    xe("selectionchange", c)
}
function w0({doc: e, customElementCb: t}) {
    const n = e.defaultView;
    return !n || !n.customElements ? () => {}
    : _a(n.customElements, "define", function(s) {
        return function(o, i, a) {
            try {
                t({
                    define: {
                        name: o
                    }
                })
            } catch {}
            return s.apply(this, [o, i, a])
        }
    })
}
function T0(e, t={}) {
    const n = e.doc.defaultView;
    if (!n)
        return () => {}
        ;
    let r;
    e.recordDOM && (r = Sf(e, e.doc));
    const s = p0(e)
      , o = h0(e)
      , i = bf(e)
      , a = m0(e, {
        win: n
    })
      , c = _0(e)
      , u = b0(e);
    let d = () => {}
      , l = () => {}
      , f = () => {}
      , p = () => {}
    ;
    e.recordDOM && (d = y0(e, {
        win: n
    }),
    l = Ef(e, e.doc),
    f = S0(e, {
        win: n
    }),
    e.collectFonts && (p = E0(e)));
    const h = v0(e)
      , m = w0(e)
      , _ = [];
    for (const g of e.plugins)
        _.push(g.observer(g.callback, n, g.options));
    return Z( () => {
        En.forEach(g => g.reset()),
        r == null || r.disconnect(),
        s(),
        o(),
        i(),
        a(),
        c(),
        u(),
        d(),
        l(),
        f(),
        p(),
        h(),
        m(),
        _.forEach(g => g())
    }
    )
}
function Kr(e) {
    return typeof window[e] < "u"
}
function Jr(e) {
    return !!(typeof window[e] < "u" && window[e].prototype && "insertRule"in window[e].prototype && "deleteRule"in window[e].prototype)
}
class Ci {
    constructor(t) {
        this.generateIdFn = t,
        this.iframeIdToRemoteIdMap = new WeakMap,
        this.iframeRemoteIdToIdMap = new WeakMap
    }
    getId(t, n, r, s) {
        const o = r || this.getIdToRemoteIdMap(t)
          , i = s || this.getRemoteIdToIdMap(t);
        let a = o.get(n);
        return a || (a = this.generateIdFn(),
        o.set(n, a),
        i.set(a, n)),
        a
    }
    getIds(t, n) {
        const r = this.getIdToRemoteIdMap(t)
          , s = this.getRemoteIdToIdMap(t);
        return n.map(o => this.getId(t, o, r, s))
    }
    getRemoteId(t, n, r) {
        const s = r || this.getRemoteIdToIdMap(t);
        if (typeof n != "number")
            return n;
        const o = s.get(n);
        return o || -1
    }
    getRemoteIds(t, n) {
        const r = this.getRemoteIdToIdMap(t);
        return n.map(s => this.getRemoteId(t, s, r))
    }
    reset(t) {
        if (!t) {
            this.iframeIdToRemoteIdMap = new WeakMap,
            this.iframeRemoteIdToIdMap = new WeakMap;
            return
        }
        this.iframeIdToRemoteIdMap.delete(t),
        this.iframeRemoteIdToIdMap.delete(t)
    }
    getIdToRemoteIdMap(t) {
        let n = this.iframeIdToRemoteIdMap.get(t);
        return n || (n = new Map,
        this.iframeIdToRemoteIdMap.set(t, n)),
        n
    }
    getRemoteIdToIdMap(t) {
        let n = this.iframeRemoteIdToIdMap.get(t);
        return n || (n = new Map,
        this.iframeRemoteIdToIdMap.set(t, n)),
        n
    }
}
class I0 {
    constructor() {
        this.crossOriginIframeMirror = new Ci(ga),
        this.crossOriginIframeRootIdMap = new WeakMap
    }
    addIframe() {}
    addLoadListener() {}
    attachIframe() {}
}
class k0 {
    constructor(t) {
        this.iframes = new WeakMap,
        this.crossOriginIframeMap = new WeakMap,
        this.crossOriginIframeMirror = new Ci(ga),
        this.crossOriginIframeRootIdMap = new WeakMap,
        this.mutationCb = t.mutationCb,
        this.wrappedEmit = t.wrappedEmit,
        this.stylesheetManager = t.stylesheetManager,
        this.recordCrossOriginIframes = t.recordCrossOriginIframes,
        this.crossOriginIframeStyleMirror = new Ci(this.stylesheetManager.styleMirror.generateId.bind(this.stylesheetManager.styleMirror)),
        this.mirror = t.mirror,
        this.recordCrossOriginIframes && window.addEventListener("message", this.handleMessage.bind(this))
    }
    addIframe(t) {
        this.iframes.set(t, !0),
        t.contentWindow && this.crossOriginIframeMap.set(t.contentWindow, t)
    }
    addLoadListener(t) {
        this.loadListener = t
    }
    attachIframe(t, n) {
        var s, o;
        this.mutationCb({
            adds: [{
                parentId: this.mirror.getId(t),
                nextId: null,
                node: n
            }],
            removes: [],
            texts: [],
            attributes: [],
            isAttachIframe: !0
        }),
        this.recordCrossOriginIframes && ((s = t.contentWindow) == null || s.addEventListener("message", this.handleMessage.bind(this))),
        (o = this.loadListener) == null || o.call(this, t);
        const r = Sa(t);
        r && r.adoptedStyleSheets && r.adoptedStyleSheets.length > 0 && this.stylesheetManager.adoptStyleSheets(r.adoptedStyleSheets, this.mirror.getId(r))
    }
    handleMessage(t) {
        const n = t;
        if (n.data.type !== "rrweb" || n.origin !== n.data.origin || !t.source)
            return;
        const s = this.crossOriginIframeMap.get(t.source);
        if (!s)
            return;
        const o = this.transformCrossOriginEvent(s, n.data.event);
        o && this.wrappedEmit(o, n.data.isCheckout)
    }
    transformCrossOriginEvent(t, n) {
        var r;
        switch (n.type) {
        case q.FullSnapshot:
            {
                this.crossOriginIframeMirror.reset(t),
                this.crossOriginIframeStyleMirror.reset(t),
                this.replaceIdOnNode(n.data.node, t);
                const s = n.data.node.id;
                return this.crossOriginIframeRootIdMap.set(t, s),
                this.patchRootIdOnNode(n.data.node, s),
                {
                    timestamp: n.timestamp,
                    type: q.IncrementalSnapshot,
                    data: {
                        source: W.Mutation,
                        adds: [{
                            parentId: this.mirror.getId(t),
                            nextId: null,
                            node: n.data.node
                        }],
                        removes: [],
                        texts: [],
                        attributes: [],
                        isAttachIframe: !0
                    }
                }
            }
        case q.Meta:
        case q.Load:
        case q.DomContentLoaded:
            return !1;
        case q.Plugin:
            return n;
        case q.Custom:
            return this.replaceIds(n.data.payload, t, ["id", "parentId", "previousId", "nextId"]),
            n;
        case q.IncrementalSnapshot:
            switch (n.data.source) {
            case W.Mutation:
                return n.data.adds.forEach(s => {
                    this.replaceIds(s, t, ["parentId", "nextId", "previousId"]),
                    this.replaceIdOnNode(s.node, t);
                    const o = this.crossOriginIframeRootIdMap.get(t);
                    o && this.patchRootIdOnNode(s.node, o)
                }
                ),
                n.data.removes.forEach(s => {
                    this.replaceIds(s, t, ["parentId", "id"])
                }
                ),
                n.data.attributes.forEach(s => {
                    this.replaceIds(s, t, ["id"])
                }
                ),
                n.data.texts.forEach(s => {
                    this.replaceIds(s, t, ["id"])
                }
                ),
                n;
            case W.Drag:
            case W.TouchMove:
            case W.MouseMove:
                return n.data.positions.forEach(s => {
                    this.replaceIds(s, t, ["id"])
                }
                ),
                n;
            case W.ViewportResize:
                return !1;
            case W.MediaInteraction:
            case W.MouseInteraction:
            case W.Scroll:
            case W.CanvasMutation:
            case W.Input:
                return this.replaceIds(n.data, t, ["id"]),
                n;
            case W.StyleSheetRule:
            case W.StyleDeclaration:
                return this.replaceIds(n.data, t, ["id"]),
                this.replaceStyleIds(n.data, t, ["styleId"]),
                n;
            case W.Font:
                return n;
            case W.Selection:
                return n.data.ranges.forEach(s => {
                    this.replaceIds(s, t, ["start", "end"])
                }
                ),
                n;
            case W.AdoptedStyleSheet:
                return this.replaceIds(n.data, t, ["id"]),
                this.replaceStyleIds(n.data, t, ["styleIds"]),
                (r = n.data.styles) == null || r.forEach(s => {
                    this.replaceStyleIds(s, t, ["styleId"])
                }
                ),
                n
            }
        }
        return !1
    }
    replace(t, n, r, s) {
        for (const o of s)
            !Array.isArray(n[o]) && typeof n[o] != "number" || (Array.isArray(n[o]) ? n[o] = t.getIds(r, n[o]) : n[o] = t.getId(r, n[o]));
        return n
    }
    replaceIds(t, n, r) {
        return this.replace(this.crossOriginIframeMirror, t, n, r)
    }
    replaceStyleIds(t, n, r) {
        return this.replace(this.crossOriginIframeStyleMirror, t, n, r)
    }
    replaceIdOnNode(t, n) {
        this.replaceIds(t, n, ["id", "rootId"]),
        "childNodes"in t && t.childNodes.forEach(r => {
            this.replaceIdOnNode(r, n)
        }
        )
    }
    patchRootIdOnNode(t, n) {
        t.type !== ve.Document && !t.rootId && (t.rootId = n),
        "childNodes"in t && t.childNodes.forEach(r => {
            this.patchRootIdOnNode(r, n)
        }
        )
    }
}
class C0 {
    init() {}
    addShadowRoot() {}
    observeAttachShadow() {}
    reset() {}
}
class R0 {
    constructor(t) {
        this.shadowDoms = new WeakSet,
        this.restoreHandlers = [],
        this.mutationCb = t.mutationCb,
        this.scrollCb = t.scrollCb,
        this.bypassOptions = t.bypassOptions,
        this.mirror = t.mirror,
        this.init()
    }
    init() {
        this.reset(),
        this.patchAttachShadow(Element, document)
    }
    addShadowRoot(t, n) {
        if (!sr(t) || this.shadowDoms.has(t))
            return;
        this.shadowDoms.add(t),
        this.bypassOptions.canvasManager.addShadowRoot(t);
        const r = Sf({
            ...this.bypassOptions,
            doc: n,
            mutationCb: this.mutationCb,
            mirror: this.mirror,
            shadowDomManager: this
        }, t);
        this.restoreHandlers.push( () => r.disconnect()),
        this.restoreHandlers.push(bf({
            ...this.bypassOptions,
            scrollCb: this.scrollCb,
            doc: t,
            mirror: this.mirror
        })),
        io( () => {
            t.adoptedStyleSheets && t.adoptedStyleSheets.length > 0 && this.bypassOptions.stylesheetManager.adoptStyleSheets(t.adoptedStyleSheets, this.mirror.getId(t.host)),
            this.restoreHandlers.push(Ef({
                mirror: this.mirror,
                stylesheetManager: this.bypassOptions.stylesheetManager
            }, t))
        }
        , 0)
    }
    observeAttachShadow(t) {
        const n = Sa(t)
          , r = a0(t);
        !n || !r || this.patchAttachShadow(r.Element, n)
    }
    patchAttachShadow(t, n) {
        const r = this;
        this.restoreHandlers.push(_a(t.prototype, "attachShadow", function(s) {
            return function(o) {
                const i = s.call(this, o);
                return this.shadowRoot && _f(this) && r.addShadowRoot(this.shadowRoot, n),
                i
            }
        }))
    }
    reset() {
        this.restoreHandlers.forEach(t => {
            try {
                t()
            } catch {}
        }
        ),
        this.restoreHandlers = [],
        this.shadowDoms = new WeakSet,
        this.bypassOptions.canvasManager.resetShadowRoots()
    }
}
var lu = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  , x0 = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var Zr = 0; Zr < lu.length; Zr++)
    x0[lu.charCodeAt(Zr)] = Zr;
class du {
    reset() {}
    freeze() {}
    unfreeze() {}
    lock() {}
    unlock() {}
    snapshot() {}
    addWindow() {}
    addShadowRoot() {}
    resetShadowRoots() {}
}
class M0 {
    constructor(t) {
        this.trackedLinkElements = new WeakSet,
        this.styleMirror = new n0,
        this.mutationCb = t.mutationCb,
        this.adoptedStyleSheetCb = t.adoptedStyleSheetCb
    }
    attachLinkElement(t, n) {
        "_cssText"in n.attributes && this.mutationCb({
            adds: [],
            removes: [],
            texts: [],
            attributes: [{
                id: n.id,
                attributes: n.attributes
            }]
        }),
        this.trackLinkElement(t)
    }
    trackLinkElement(t) {
        this.trackedLinkElements.has(t) || (this.trackedLinkElements.add(t),
        this.trackStylesheetInLinkElement(t))
    }
    adoptStyleSheets(t, n) {
        if (t.length === 0)
            return;
        const r = {
            id: n,
            styleIds: []
        }
          , s = [];
        for (const o of t) {
            let i;
            this.styleMirror.has(o) ? i = this.styleMirror.getId(o) : (i = this.styleMirror.add(o),
            s.push({
                styleId: i,
                rules: Array.from(o.rules || CSSRule, (a, c) => ({
                    rule: Zd(a),
                    index: c
                }))
            })),
            r.styleIds.push(i)
        }
        s.length > 0 && (r.styles = s),
        this.adoptedStyleSheetCb(r)
    }
    reset() {
        this.styleMirror.reset(),
        this.trackedLinkElements = new WeakSet
    }
    trackStylesheetInLinkElement(t) {}
}
class A0 {
    constructor() {
        this.nodeMap = new WeakMap,
        this.active = !1
    }
    inOtherBuffer(t, n) {
        const r = this.nodeMap.get(t);
        return r && Array.from(r).some(s => s !== n)
    }
    add(t, n) {
        this.active || (this.active = !0,
        o0( () => {
            this.nodeMap = new WeakMap,
            this.active = !1
        }
        )),
        this.nodeMap.set(t, (this.nodeMap.get(t) || new Set).add(n))
    }
    destroy() {}
}
let fe, Ws;
var qu;
try {
    if (Array.from([1], e => e * 2)[0] !== 2) {
        const e = document.createElement("iframe");
        document.body.appendChild(e),
        Array.from = ((qu = e.contentWindow) == null ? void 0 : qu.Array.from) || Array.from,
        document.body.removeChild(e)
    }
} catch (e) {
    console.debug("Unable to override Array.from", e)
}
const Ye = Av();
function ht(e={}) {
    const {emit: t, checkoutEveryNms: n, checkoutEveryNth: r, blockClass: s="rr-block", blockSelector: o=null, unblockSelector: i=null, ignoreClass: a="rr-ignore", ignoreSelector: c=null, maskAllText: u=!1, maskTextClass: d="rr-mask", unmaskTextClass: l=null, maskTextSelector: f=null, unmaskTextSelector: p=null, inlineStylesheet: h=!0, maskAllInputs: m, maskInputOptions: _, slimDOMOptions: g, maskAttributeFn: b, maskInputFn: T, maskTextFn: C, maxCanvasSize: S=null, packFn: E, sampling: k={}, dataURLOptions: N={}, mousemoveWait: w, recordDOM: I=!0, recordCanvas: F=!1, recordCrossOriginIframes: v=!1, recordAfter: R=e.recordAfter === "DOMContentLoaded" ? e.recordAfter : "load", userTriggeredOnInput: A=!1, collectFonts: U=!1, inlineImages: O=!1, plugins: X, keepIframeSrcFn: D= () => !1, ignoreCSSAttributes: K=new Set([]), errorHandler: Q, onMutation: Te, getCanvasManager: un} = e;
    d0(Q);
    const Pe = v ? window.parent === window : !0;
    let Ce = !1;
    if (!Pe)
        try {
            window.parent.document && (Ce = !1)
        } catch {
            Ce = !0
        }
    if (Pe && !t)
        throw new Error("emit function is required");
    if (!Pe && !Ce)
        return () => {}
        ;
    w !== void 0 && k.mousemove === void 0 && (k.mousemove = w),
    Ye.reset();
    const Ge = m === !0 ? {
        color: !0,
        date: !0,
        "datetime-local": !0,
        email: !0,
        month: !0,
        number: !0,
        range: !0,
        search: !0,
        tel: !0,
        text: !0,
        time: !0,
        url: !0,
        week: !0,
        textarea: !0,
        select: !0,
        radio: !0,
        checkbox: !0
    } : _ !== void 0 ? _ : {}
      , ct = g === !0 || g === "all" ? {
        script: !0,
        comment: !0,
        headFavicon: !0,
        headWhitespace: !0,
        headMetaSocial: !0,
        headMetaRobots: !0,
        headMetaHttpEquiv: !0,
        headMetaVerification: !0,
        headMetaAuthorship: g === "all",
        headMetaDescKeywords: g === "all"
    } : g || {};
    t0();
    let ln, dn = 0;
    const Zn = ee => {
        for (const Ve of X || [])
            Ve.eventProcessor && (ee = Ve.eventProcessor(ee));
        return E && !Ce && (ee = E(ee)),
        ee
    }
    ;
    fe = (ee, Ve) => {
        var He;
        const J = ee;
        if (J.timestamp = Us(),
        (He = En[0]) != null && He.isFrozen() && J.type !== q.FullSnapshot && !(J.type === q.IncrementalSnapshot && J.data.source === W.Mutation) && En.forEach(Qe => Qe.unfreeze()),
        Pe)
            t == null || t(Zn(J), Ve);
        else if (Ce) {
            const Qe = {
                type: "rrweb",
                event: Zn(J),
                origin: window.location.origin,
                isCheckout: Ve
            };
            window.parent.postMessage(Qe, "*")
        }
        if (J.type === q.FullSnapshot)
            ln = J,
            dn = 0;
        else if (J.type === q.IncrementalSnapshot) {
            if (J.data.source === W.Mutation && J.data.isAttachIframe)
                return;
            dn++;
            const Qe = r && dn >= r
              , se = n && ln && J.timestamp - ln.timestamp > n;
            (Qe || se) && _o(!0)
        }
    }
    ;
    const Tt = ee => {
        fe({
            type: q.IncrementalSnapshot,
            data: {
                source: W.Mutation,
                ...ee
            }
        })
    }
      , ne = ee => fe({
        type: q.IncrementalSnapshot,
        data: {
            source: W.Scroll,
            ...ee
        }
    })
      , Se = ee => fe({
        type: q.IncrementalSnapshot,
        data: {
            source: W.CanvasMutation,
            ...ee
        }
    })
      , Ue = ee => fe({
        type: q.IncrementalSnapshot,
        data: {
            source: W.AdoptedStyleSheet,
            ...ee
        }
    })
      , _e = new M0({
        mutationCb: Tt,
        adoptedStyleSheetCb: Ue
    })
      , re = typeof __RRWEB_EXCLUDE_IFRAME__ == "boolean" && __RRWEB_EXCLUDE_IFRAME__ ? new I0 : new k0({
        mirror: Ye,
        mutationCb: Tt,
        stylesheetManager: _e,
        recordCrossOriginIframes: v,
        wrappedEmit: fe
    });
    for (const ee of X || [])
        ee.getMirror && ee.getMirror({
            nodeMirror: Ye,
            crossOriginIframeMirror: re.crossOriginIframeMirror,
            crossOriginIframeStyleMirror: re.crossOriginIframeStyleMirror
        });
    const ke = new A0
      , Ht = O0(un, {
        mirror: Ye,
        win: window,
        mutationCb: ee => fe({
            type: q.IncrementalSnapshot,
            data: {
                source: W.CanvasMutation,
                ...ee
            }
        }),
        recordCanvas: F,
        blockClass: s,
        blockSelector: o,
        unblockSelector: i,
        maxCanvasSize: S,
        sampling: k.canvas,
        dataURLOptions: N,
        errorHandler: Q
    })
      , ut = typeof __RRWEB_EXCLUDE_SHADOW_DOM__ == "boolean" && __RRWEB_EXCLUDE_SHADOW_DOM__ ? new C0 : new R0({
        mutationCb: Tt,
        scrollCb: ne,
        bypassOptions: {
            onMutation: Te,
            blockClass: s,
            blockSelector: o,
            unblockSelector: i,
            maskAllText: u,
            maskTextClass: d,
            unmaskTextClass: l,
            maskTextSelector: f,
            unmaskTextSelector: p,
            inlineStylesheet: h,
            maskInputOptions: Ge,
            dataURLOptions: N,
            maskAttributeFn: b,
            maskTextFn: C,
            maskInputFn: T,
            recordCanvas: F,
            inlineImages: O,
            sampling: k,
            slimDOMOptions: ct,
            iframeManager: re,
            stylesheetManager: _e,
            canvasManager: Ht,
            keepIframeSrcFn: D,
            processedNodeManager: ke
        },
        mirror: Ye
    })
      , _o = (ee=!1) => {
        if (!I)
            return;
        fe({
            type: q.Meta,
            data: {
                href: window.location.href,
                width: df(),
                height: lf()
            }
        }, ee),
        _e.reset(),
        ut.init(),
        En.forEach(J => J.lock());
        const Ve = Qv(document, {
            mirror: Ye,
            blockClass: s,
            blockSelector: o,
            unblockSelector: i,
            maskAllText: u,
            maskTextClass: d,
            unmaskTextClass: l,
            maskTextSelector: f,
            unmaskTextSelector: p,
            inlineStylesheet: h,
            maskAllInputs: Ge,
            maskAttributeFn: b,
            maskInputFn: T,
            maskTextFn: C,
            slimDOM: ct,
            dataURLOptions: N,
            recordCanvas: F,
            inlineImages: O,
            onSerialize: J => {
                hf(J, Ye) && re.addIframe(J),
                mf(J, Ye) && _e.trackLinkElement(J),
                Ii(J) && ut.addShadowRoot(J.shadowRoot, document)
            }
            ,
            onIframeLoad: (J, He) => {
                re.attachIframe(J, He),
                J.contentWindow && Ht.addWindow(J.contentWindow),
                ut.observeAttachShadow(J)
            }
            ,
            onStylesheetLoad: (J, He) => {
                _e.attachLinkElement(J, He)
            }
            ,
            keepIframeSrcFn: D
        });
        if (!Ve)
            return console.warn("Failed to snapshot the document");
        fe({
            type: q.FullSnapshot,
            data: {
                node: Ve,
                initialOffset: uf(window)
            }
        }),
        En.forEach(J => J.unlock()),
        document.adoptedStyleSheets && document.adoptedStyleSheets.length > 0 && _e.adoptStyleSheets(document.adoptedStyleSheets, Ye.getId(document))
    }
    ;
    Ws = _o;
    try {
        const ee = []
          , Ve = He => {
            var Qe;
            return Z(T0)({
                onMutation: Te,
                mutationCb: Tt,
                mousemoveCb: (se, yo) => fe({
                    type: q.IncrementalSnapshot,
                    data: {
                        source: yo,
                        positions: se
                    }
                }),
                mouseInteractionCb: se => fe({
                    type: q.IncrementalSnapshot,
                    data: {
                        source: W.MouseInteraction,
                        ...se
                    }
                }),
                scrollCb: ne,
                viewportResizeCb: se => fe({
                    type: q.IncrementalSnapshot,
                    data: {
                        source: W.ViewportResize,
                        ...se
                    }
                }),
                inputCb: se => fe({
                    type: q.IncrementalSnapshot,
                    data: {
                        source: W.Input,
                        ...se
                    }
                }),
                mediaInteractionCb: se => fe({
                    type: q.IncrementalSnapshot,
                    data: {
                        source: W.MediaInteraction,
                        ...se
                    }
                }),
                styleSheetRuleCb: se => fe({
                    type: q.IncrementalSnapshot,
                    data: {
                        source: W.StyleSheetRule,
                        ...se
                    }
                }),
                styleDeclarationCb: se => fe({
                    type: q.IncrementalSnapshot,
                    data: {
                        source: W.StyleDeclaration,
                        ...se
                    }
                }),
                canvasMutationCb: Se,
                fontCb: se => fe({
                    type: q.IncrementalSnapshot,
                    data: {
                        source: W.Font,
                        ...se
                    }
                }),
                selectionCb: se => {
                    fe({
                        type: q.IncrementalSnapshot,
                        data: {
                            source: W.Selection,
                            ...se
                        }
                    })
                }
                ,
                customElementCb: se => {
                    fe({
                        type: q.IncrementalSnapshot,
                        data: {
                            source: W.CustomElement,
                            ...se
                        }
                    })
                }
                ,
                blockClass: s,
                ignoreClass: a,
                ignoreSelector: c,
                maskAllText: u,
                maskTextClass: d,
                unmaskTextClass: l,
                maskTextSelector: f,
                unmaskTextSelector: p,
                maskInputOptions: Ge,
                inlineStylesheet: h,
                sampling: k,
                recordDOM: I,
                recordCanvas: F,
                inlineImages: O,
                userTriggeredOnInput: A,
                collectFonts: U,
                doc: He,
                maskAttributeFn: b,
                maskInputFn: T,
                maskTextFn: C,
                keepIframeSrcFn: D,
                blockSelector: o,
                unblockSelector: i,
                slimDOMOptions: ct,
                dataURLOptions: N,
                mirror: Ye,
                iframeManager: re,
                stylesheetManager: _e,
                shadowDomManager: ut,
                processedNodeManager: ke,
                canvasManager: Ht,
                ignoreCSSAttributes: K,
                plugins: ((Qe = X == null ? void 0 : X.filter(se => se.observer)) == null ? void 0 : Qe.map(se => ({
                    observer: se.observer,
                    options: se.options,
                    callback: yo => fe({
                        type: q.Plugin,
                        data: {
                            plugin: se.name,
                            payload: yo
                        }
                    })
                }))) || []
            }, {})
        }
        ;
        re.addLoadListener(He => {
            try {
                ee.push(Ve(He.contentDocument))
            } catch (Qe) {
                console.warn(Qe)
            }
        }
        );
        const J = () => {
            _o(),
            ee.push(Ve(document))
        }
        ;
        return document.readyState === "interactive" || document.readyState === "complete" ? J() : (ee.push(xe("DOMContentLoaded", () => {
            fe({
                type: q.DomContentLoaded,
                data: {}
            }),
            R === "DOMContentLoaded" && J()
        }
        )),
        ee.push(xe("load", () => {
            fe({
                type: q.Load,
                data: {}
            }),
            R === "load" && J()
        }
        , window))),
        () => {
            ee.forEach(He => He()),
            ke.destroy(),
            Ws = void 0,
            f0()
        }
    } catch (ee) {
        console.warn(ee)
    }
}
function N0(e) {
    if (!Ws)
        throw new Error("please take full snapshot after start recording");
    Ws(e)
}
ht.mirror = Ye;
ht.takeFullSnapshot = N0;
function O0(e, t) {
    try {
        return e ? e(t) : new du
    } catch {
        return console.warn("Unable to initialize CanvasManager"),
        new du
    }
}
var fu;
(function(e) {
    e[e.NotStarted = 0] = "NotStarted",
    e[e.Running = 1] = "Running",
    e[e.Stopped = 2] = "Stopped"
}
)(fu || (fu = {}));
const L0 = 3
  , P0 = 5;
function ba(e) {
    return e > 9999999999 ? e : e * 1e3
}
function Ho(e) {
    return e > 9999999999 ? e / 1e3 : e
}
function Nr(e, t) {
    t.category !== "sentry.transaction" && (["ui.click", "ui.input"].includes(t.category) ? e.triggerUserActivity() : e.checkAndHandleExpiredSession(),
    e.addUpdate( () => (e.throttledAddEvent({
        type: q.Custom,
        timestamp: (t.timestamp || 0) * 1e3,
        data: {
            tag: "breadcrumb",
            payload: De(t, 10, 1e3)
        }
    }),
    t.category === "console")))
}
const D0 = "button,a";
function vf(e) {
    return e.closest(D0) || e
}
function wf(e) {
    const t = Tf(e);
    return !t || !(t instanceof Element) ? t : vf(t)
}
function Tf(e) {
    return F0(e) ? e.target : e
}
function F0(e) {
    return typeof e == "object" && !!e && "target"in e
}
let Rt;
function $0(e) {
    return Rt || (Rt = [],
    B0()),
    Rt.push(e),
    () => {
        const t = Rt ? Rt.indexOf(e) : -1;
        t > -1 && Rt.splice(t, 1)
    }
}
function B0() {
    Me(ue, "open", function(e) {
        return function(...t) {
            if (Rt)
                try {
                    Rt.forEach(n => n())
                } catch {}
            return e.apply(ue, t)
        }
    })
}
const U0 = new Set([W.Mutation, W.StyleSheetRule, W.StyleDeclaration, W.AdoptedStyleSheet, W.CanvasMutation, W.Selection, W.MediaInteraction]);
function H0(e, t, n) {
    e.handleClick(t, n)
}
class W0 {
    constructor(t, n, r=Nr) {
        this._lastMutation = 0,
        this._lastScroll = 0,
        this._clicks = [],
        this._timeout = n.timeout / 1e3,
        this._threshold = n.threshold / 1e3,
        this._scrollTimeout = n.scrollTimeout / 1e3,
        this._replay = t,
        this._ignoreSelector = n.ignoreSelector,
        this._addBreadcrumbEvent = r
    }
    addListeners() {
        const t = $0( () => {
            this._lastMutation = pu()
        }
        );
        this._teardown = () => {
            t(),
            this._clicks = [],
            this._lastMutation = 0,
            this._lastScroll = 0
        }
    }
    removeListeners() {
        this._teardown && this._teardown(),
        this._checkClickTimeout && clearTimeout(this._checkClickTimeout)
    }
    handleClick(t, n) {
        if (j0(n, this._ignoreSelector) || !q0(t))
            return;
        const r = {
            timestamp: Ho(t.timestamp),
            clickBreadcrumb: t,
            clickCount: 0,
            node: n
        };
        this._clicks.some(s => s.node === r.node && Math.abs(s.timestamp - r.timestamp) < 1) || (this._clicks.push(r),
        this._clicks.length === 1 && this._scheduleCheckClicks())
    }
    registerMutation(t=Date.now()) {
        this._lastMutation = Ho(t)
    }
    registerScroll(t=Date.now()) {
        this._lastScroll = Ho(t)
    }
    registerClick(t) {
        const n = vf(t);
        this._handleMultiClick(n)
    }
    _handleMultiClick(t) {
        this._getClicks(t).forEach(n => {
            n.clickCount++
        }
        )
    }
    _getClicks(t) {
        return this._clicks.filter(n => n.node === t)
    }
    _checkClicks() {
        const t = []
          , n = pu();
        this._clicks.forEach(r => {
            !r.mutationAfter && this._lastMutation && (r.mutationAfter = r.timestamp <= this._lastMutation ? this._lastMutation - r.timestamp : void 0),
            !r.scrollAfter && this._lastScroll && (r.scrollAfter = r.timestamp <= this._lastScroll ? this._lastScroll - r.timestamp : void 0),
            r.timestamp + this._timeout <= n && t.push(r)
        }
        );
        for (const r of t) {
            const s = this._clicks.indexOf(r);
            s > -1 && (this._generateBreadcrumbs(r),
            this._clicks.splice(s, 1))
        }
        this._clicks.length && this._scheduleCheckClicks()
    }
    _generateBreadcrumbs(t) {
        const n = this._replay
          , r = t.scrollAfter && t.scrollAfter <= this._scrollTimeout
          , s = t.mutationAfter && t.mutationAfter <= this._threshold
          , o = !r && !s
          , {clickCount: i, clickBreadcrumb: a} = t;
        if (o) {
            const c = Math.min(t.mutationAfter || this._timeout, this._timeout) * 1e3
              , u = c < this._timeout * 1e3 ? "mutation" : "timeout"
              , d = {
                type: "default",
                message: a.message,
                timestamp: a.timestamp,
                category: "ui.slowClickDetected",
                data: {
                    ...a.data,
                    url: ue.location.href,
                    route: n.getCurrentRoute(),
                    timeAfterClickMs: c,
                    endReason: u,
                    clickCount: i || 1
                }
            };
            this._addBreadcrumbEvent(n, d);
            return
        }
        if (i > 1) {
            const c = {
                type: "default",
                message: a.message,
                timestamp: a.timestamp,
                category: "ui.multiClick",
                data: {
                    ...a.data,
                    url: ue.location.href,
                    route: n.getCurrentRoute(),
                    clickCount: i,
                    metric: !0
                }
            };
            this._addBreadcrumbEvent(n, c)
        }
    }
    _scheduleCheckClicks() {
        this._checkClickTimeout && clearTimeout(this._checkClickTimeout),
        this._checkClickTimeout = Mr( () => this._checkClicks(), 1e3)
    }
}
const z0 = ["A", "BUTTON", "INPUT"];
function j0(e, t) {
    return !!(!z0.includes(e.tagName) || e.tagName === "INPUT" && !["submit", "button"].includes(e.getAttribute("type") || "") || e.tagName === "A" && (e.hasAttribute("download") || e.hasAttribute("target") && e.getAttribute("target") !== "_self") || t && e.matches(t))
}
function q0(e) {
    return !!(e.data && typeof e.data.nodeId == "number" && e.timestamp)
}
function pu() {
    return Date.now() / 1e3
}
function G0(e, t) {
    try {
        if (!V0(t))
            return;
        const {source: n} = t.data;
        if (U0.has(n) && e.registerMutation(t.timestamp),
        n === W.Scroll && e.registerScroll(t.timestamp),
        Y0(t)) {
            const {type: r, id: s} = t.data
              , o = ht.mirror.getNode(s);
            o instanceof HTMLElement && r === Re.Click && e.registerClick(o)
        }
    } catch {}
}
function V0(e) {
    return e.type === L0
}
function Y0(e) {
    return e.data.source === W.MouseInteraction
}
function tt(e) {
    return {
        timestamp: Date.now() / 1e3,
        type: "default",
        ...e
    }
}
var Ea = (e => (e[e.Document = 0] = "Document",
e[e.DocumentType = 1] = "DocumentType",
e[e.Element = 2] = "Element",
e[e.Text = 3] = "Text",
e[e.CDATA = 4] = "CDATA",
e[e.Comment = 5] = "Comment",
e))(Ea || {});
const X0 = new Set(["id", "class", "aria-label", "role", "name", "alt", "title", "data-test-id", "data-testid", "disabled", "aria-disabled", "data-sentry-component"]);
function K0(e) {
    const t = {};
    !e["data-sentry-component"] && e["data-sentry-element"] && (e["data-sentry-component"] = e["data-sentry-element"]);
    for (const n in e)
        if (X0.has(n)) {
            let r = n;
            (n === "data-testid" || n === "data-test-id") && (r = "testId"),
            t[r] = e[n]
        }
    return t
}
const J0 = e => t => {
    if (!e.isEnabled())
        return;
    const n = Z0(t);
    if (!n)
        return;
    const r = t.name === "click"
      , s = r ? t.event : void 0;
    r && e.clickDetector && s && s.target && !s.altKey && !s.metaKey && !s.ctrlKey && !s.shiftKey && H0(e.clickDetector, n, wf(t.event)),
    Nr(e, n)
}
;
function If(e, t) {
    const n = ht.mirror.getId(e)
      , r = n && ht.mirror.getNode(n)
      , s = r && ht.mirror.getMeta(r)
      , o = s && ew(s) ? s : null;
    return {
        message: t,
        data: o ? {
            nodeId: n,
            node: {
                id: n,
                tagName: o.tagName,
                textContent: Array.from(o.childNodes).map(i => i.type === Ea.Text && i.textContent).filter(Boolean).map(i => i.trim()).join(""),
                attributes: K0(o.attributes)
            }
        } : {}
    }
}
function Z0(e) {
    const {target: t, message: n} = Q0(e);
    return tt({
        category: `ui.${e.name}`,
        ...If(t, n)
    })
}
function Q0(e) {
    const t = e.name === "click";
    let n, r = null;
    try {
        r = t ? wf(e.event) : Tf(e.event),
        n = qe(r, {
            maxStringLength: 200
        }) || "<unknown>"
    } catch {
        n = "<unknown>"
    }
    return {
        target: r,
        message: n
    }
}
function ew(e) {
    return e.type === Ea.Element
}
function tw(e, t) {
    if (!e.isEnabled())
        return;
    e.updateUserActivity();
    const n = nw(t);
    n && Nr(e, n)
}
function nw(e) {
    const {metaKey: t, shiftKey: n, ctrlKey: r, altKey: s, key: o, target: i} = e;
    if (!i || rw(i) || !o)
        return null;
    const a = t || r || s
      , c = o.length === 1;
    if (!a && c)
        return null;
    const u = qe(i, {
        maxStringLength: 200
    }) || "<unknown>"
      , d = If(i, u);
    return tt({
        category: "ui.keyDown",
        message: u,
        data: {
            ...d.data,
            metaKey: t,
            shiftKey: n,
            ctrlKey: r,
            altKey: s,
            key: o
        }
    })
}
function rw(e) {
    return e.tagName === "INPUT" || e.tagName === "TEXTAREA" || e.isContentEditable
}
const sw = {
    resource: uw,
    paint: aw,
    navigation: cw
};
function Qr(e, t) {
    return ({metric: n}) => void t.replayPerformanceEntries.push(e(n))
}
function ow(e) {
    return e.map(iw).filter(Boolean)
}
function iw(e) {
    const t = sw[e.entryType];
    return t ? t(e) : null
}
function Wn(e) {
    return ((Oe() || ue.performance.timeOrigin) + e) / 1e3
}
function aw(e) {
    const {duration: t, entryType: n, name: r, startTime: s} = e
      , o = Wn(s);
    return {
        type: n,
        name: r,
        start: o,
        end: o + t,
        data: void 0
    }
}
function cw(e) {
    const {entryType: t, name: n, decodedBodySize: r, duration: s, domComplete: o, encodedBodySize: i, domContentLoadedEventStart: a, domContentLoadedEventEnd: c, domInteractive: u, loadEventStart: d, loadEventEnd: l, redirectCount: f, startTime: p, transferSize: h, type: m} = e;
    return s === 0 ? null : {
        type: `${t}.${m}`,
        start: Wn(p),
        end: Wn(o),
        name: n,
        data: {
            size: h,
            decodedBodySize: r,
            encodedBodySize: i,
            duration: s,
            domInteractive: u,
            domContentLoadedEventStart: a,
            domContentLoadedEventEnd: c,
            loadEventStart: d,
            loadEventEnd: l,
            domComplete: o,
            redirectCount: f
        }
    }
}
function uw(e) {
    const {entryType: t, initiatorType: n, name: r, responseEnd: s, startTime: o, decodedBodySize: i, encodedBodySize: a, responseStatus: c, transferSize: u} = e;
    return ["fetch", "xmlhttprequest"].includes(n) ? null : {
        type: `${t}.${n}`,
        start: Wn(o),
        end: Wn(s),
        name: r,
        data: {
            size: u,
            statusCode: c,
            decodedBodySize: i,
            encodedBodySize: a
        }
    }
}
function lw(e) {
    const t = e.entries[e.entries.length - 1]
      , n = t != null && t.element ? [t.element] : void 0;
    return ao(e, "largest-contentful-paint", n)
}
function dw(e) {
    return e.sources !== void 0
}
function fw(e) {
    const t = []
      , n = [];
    for (const r of e.entries)
        if (dw(r)) {
            const s = [];
            for (const o of r.sources)
                if (o.node) {
                    n.push(o.node);
                    const i = ht.mirror.getId(o.node);
                    i && s.push(i)
                }
            t.push({
                value: r.value,
                nodeIds: s.length ? s : void 0
            })
        }
    return ao(e, "cumulative-layout-shift", n, t)
}
function pw(e) {
    const t = e.entries[e.entries.length - 1]
      , n = t != null && t.target ? [t.target] : void 0;
    return ao(e, "first-input-delay", n)
}
function hw(e) {
    const t = e.entries[e.entries.length - 1]
      , n = t != null && t.target ? [t.target] : void 0;
    return ao(e, "interaction-to-next-paint", n)
}
function ao(e, t, n, r) {
    const s = e.value
      , o = e.rating
      , i = Wn(s);
    return {
        type: "web-vital",
        name: t,
        start: i,
        end: i,
        data: {
            value: s,
            size: s,
            rating: o,
            nodeIds: n ? n.map(a => ht.mirror.getId(a)) : void 0,
            attributions: r
        }
    }
}
function mw(e) {
    function t(s) {
        e.performanceEntries.includes(s) || e.performanceEntries.push(s)
    }
    function n({entries: s}) {
        s.forEach(t)
    }
    const r = [];
    return ["navigation", "paint", "resource"].forEach(s => {
        r.push($n(s, n))
    }
    ),
    r.push(ia(Qr(lw, e)), oa(Qr(fw, e)), Pd(Qr(pw, e)), Dd(Qr(hw, e))),
    () => {
        r.forEach(s => s())
    }
}
const $ = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__
  , gw = 'var t=Uint8Array,n=Uint16Array,r=Int32Array,e=new t([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),i=new t([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),s=new t([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),a=function(t,e){for(var i=new n(31),s=0;s<31;++s)i[s]=e+=1<<t[s-1];var a=new r(i[30]);for(s=1;s<30;++s)for(var o=i[s];o<i[s+1];++o)a[o]=o-i[s]<<5|s;return{b:i,r:a}},o=a(e,2),h=o.b,f=o.r;h[28]=258,f[258]=28;for(var l=a(i,0).r,u=new n(32768),c=0;c<32768;++c){var v=(43690&c)>>1|(21845&c)<<1;v=(61680&(v=(52428&v)>>2|(13107&v)<<2))>>4|(3855&v)<<4,u[c]=((65280&v)>>8|(255&v)<<8)>>1}var d=function(t,r,e){for(var i=t.length,s=0,a=new n(r);s<i;++s)t[s]&&++a[t[s]-1];var o,h=new n(r);for(s=1;s<r;++s)h[s]=h[s-1]+a[s-1]<<1;if(e){o=new n(1<<r);var f=15-r;for(s=0;s<i;++s)if(t[s])for(var l=s<<4|t[s],c=r-t[s],v=h[t[s]-1]++<<c,d=v|(1<<c)-1;v<=d;++v)o[u[v]>>f]=l}else for(o=new n(i),s=0;s<i;++s)t[s]&&(o[s]=u[h[t[s]-1]++]>>15-t[s]);return o},p=new t(288);for(c=0;c<144;++c)p[c]=8;for(c=144;c<256;++c)p[c]=9;for(c=256;c<280;++c)p[c]=7;for(c=280;c<288;++c)p[c]=8;var g=new t(32);for(c=0;c<32;++c)g[c]=5;var w=d(p,9,0),y=d(g,5,0),m=function(t){return(t+7)/8|0},b=function(n,r,e){return(null==e||e>n.length)&&(e=n.length),new t(n.subarray(r,e))},M=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],E=function(t,n,r){var e=new Error(n||M[t]);if(e.code=t,Error.captureStackTrace&&Error.captureStackTrace(e,E),!r)throw e;return e},z=function(t,n,r){r<<=7&n;var e=n/8|0;t[e]|=r,t[e+1]|=r>>8},_=function(t,n,r){r<<=7&n;var e=n/8|0;t[e]|=r,t[e+1]|=r>>8,t[e+2]|=r>>16},x=function(r,e){for(var i=[],s=0;s<r.length;++s)r[s]&&i.push({s:s,f:r[s]});var a=i.length,o=i.slice();if(!a)return{t:F,l:0};if(1==a){var h=new t(i[0].s+1);return h[i[0].s]=1,{t:h,l:1}}i.sort((function(t,n){return t.f-n.f})),i.push({s:-1,f:25001});var f=i[0],l=i[1],u=0,c=1,v=2;for(i[0]={s:-1,f:f.f+l.f,l:f,r:l};c!=a-1;)f=i[i[u].f<i[v].f?u++:v++],l=i[u!=c&&i[u].f<i[v].f?u++:v++],i[c++]={s:-1,f:f.f+l.f,l:f,r:l};var d=o[0].s;for(s=1;s<a;++s)o[s].s>d&&(d=o[s].s);var p=new n(d+1),g=A(i[c-1],p,0);if(g>e){s=0;var w=0,y=g-e,m=1<<y;for(o.sort((function(t,n){return p[n.s]-p[t.s]||t.f-n.f}));s<a;++s){var b=o[s].s;if(!(p[b]>e))break;w+=m-(1<<g-p[b]),p[b]=e}for(w>>=y;w>0;){var M=o[s].s;p[M]<e?w-=1<<e-p[M]++-1:++s}for(;s>=0&&w;--s){var E=o[s].s;p[E]==e&&(--p[E],++w)}g=e}return{t:new t(p),l:g}},A=function(t,n,r){return-1==t.s?Math.max(A(t.l,n,r+1),A(t.r,n,r+1)):n[t.s]=r},D=function(t){for(var r=t.length;r&&!t[--r];);for(var e=new n(++r),i=0,s=t[0],a=1,o=function(t){e[i++]=t},h=1;h<=r;++h)if(t[h]==s&&h!=r)++a;else{if(!s&&a>2){for(;a>138;a-=138)o(32754);a>2&&(o(a>10?a-11<<5|28690:a-3<<5|12305),a=0)}else if(a>3){for(o(s),--a;a>6;a-=6)o(8304);a>2&&(o(a-3<<5|8208),a=0)}for(;a--;)o(s);a=1,s=t[h]}return{c:e.subarray(0,i),n:r}},T=function(t,n){for(var r=0,e=0;e<n.length;++e)r+=t[e]*n[e];return r},k=function(t,n,r){var e=r.length,i=m(n+2);t[i]=255&e,t[i+1]=e>>8,t[i+2]=255^t[i],t[i+3]=255^t[i+1];for(var s=0;s<e;++s)t[i+s+4]=r[s];return 8*(i+4+e)},U=function(t,r,a,o,h,f,l,u,c,v,m){z(r,m++,a),++h[256];for(var b=x(h,15),M=b.t,E=b.l,A=x(f,15),U=A.t,C=A.l,F=D(M),I=F.c,S=F.n,L=D(U),O=L.c,j=L.n,q=new n(19),B=0;B<I.length;++B)++q[31&I[B]];for(B=0;B<O.length;++B)++q[31&O[B]];for(var G=x(q,7),H=G.t,J=G.l,K=19;K>4&&!H[s[K-1]];--K);var N,P,Q,R,V=v+5<<3,W=T(h,p)+T(f,g)+l,X=T(h,M)+T(f,U)+l+14+3*K+T(q,H)+2*q[16]+3*q[17]+7*q[18];if(c>=0&&V<=W&&V<=X)return k(r,m,t.subarray(c,c+v));if(z(r,m,1+(X<W)),m+=2,X<W){N=d(M,E,0),P=M,Q=d(U,C,0),R=U;var Y=d(H,J,0);z(r,m,S-257),z(r,m+5,j-1),z(r,m+10,K-4),m+=14;for(B=0;B<K;++B)z(r,m+3*B,H[s[B]]);m+=3*K;for(var Z=[I,O],$=0;$<2;++$){var tt=Z[$];for(B=0;B<tt.length;++B){var nt=31&tt[B];z(r,m,Y[nt]),m+=H[nt],nt>15&&(z(r,m,tt[B]>>5&127),m+=tt[B]>>12)}}}else N=w,P=p,Q=y,R=g;for(B=0;B<u;++B){var rt=o[B];if(rt>255){_(r,m,N[(nt=rt>>18&31)+257]),m+=P[nt+257],nt>7&&(z(r,m,rt>>23&31),m+=e[nt]);var et=31&rt;_(r,m,Q[et]),m+=R[et],et>3&&(_(r,m,rt>>5&8191),m+=i[et])}else _(r,m,N[rt]),m+=P[rt]}return _(r,m,N[256]),m+P[256]},C=new r([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),F=new t(0),I=function(){for(var t=new Int32Array(256),n=0;n<256;++n){for(var r=n,e=9;--e;)r=(1&r&&-306674912)^r>>>1;t[n]=r}return t}(),S=function(){var t=-1;return{p:function(n){for(var r=t,e=0;e<n.length;++e)r=I[255&r^n[e]]^r>>>8;t=r},d:function(){return~t}}},L=function(){var t=1,n=0;return{p:function(r){for(var e=t,i=n,s=0|r.length,a=0;a!=s;){for(var o=Math.min(a+2655,s);a<o;++a)i+=e+=r[a];e=(65535&e)+15*(e>>16),i=(65535&i)+15*(i>>16)}t=e,n=i},d:function(){return(255&(t%=65521))<<24|(65280&t)<<8|(255&(n%=65521))<<8|n>>8}}},O=function(s,a,o,h,u){if(!u&&(u={l:1},a.dictionary)){var c=a.dictionary.subarray(-32768),v=new t(c.length+s.length);v.set(c),v.set(s,c.length),s=v,u.w=c.length}return function(s,a,o,h,u,c){var v=c.z||s.length,d=new t(h+v+5*(1+Math.ceil(v/7e3))+u),p=d.subarray(h,d.length-u),g=c.l,w=7&(c.r||0);if(a){w&&(p[0]=c.r>>3);for(var y=C[a-1],M=y>>13,E=8191&y,z=(1<<o)-1,_=c.p||new n(32768),x=c.h||new n(z+1),A=Math.ceil(o/3),D=2*A,T=function(t){return(s[t]^s[t+1]<<A^s[t+2]<<D)&z},F=new r(25e3),I=new n(288),S=new n(32),L=0,O=0,j=c.i||0,q=0,B=c.w||0,G=0;j+2<v;++j){var H=T(j),J=32767&j,K=x[H];if(_[J]=K,x[H]=J,B<=j){var N=v-j;if((L>7e3||q>24576)&&(N>423||!g)){w=U(s,p,0,F,I,S,O,q,G,j-G,w),q=L=O=0,G=j;for(var P=0;P<286;++P)I[P]=0;for(P=0;P<30;++P)S[P]=0}var Q=2,R=0,V=E,W=J-K&32767;if(N>2&&H==T(j-W))for(var X=Math.min(M,N)-1,Y=Math.min(32767,j),Z=Math.min(258,N);W<=Y&&--V&&J!=K;){if(s[j+Q]==s[j+Q-W]){for(var $=0;$<Z&&s[j+$]==s[j+$-W];++$);if($>Q){if(Q=$,R=W,$>X)break;var tt=Math.min(W,$-2),nt=0;for(P=0;P<tt;++P){var rt=j-W+P&32767,et=rt-_[rt]&32767;et>nt&&(nt=et,K=rt)}}}W+=(J=K)-(K=_[J])&32767}if(R){F[q++]=268435456|f[Q]<<18|l[R];var it=31&f[Q],st=31&l[R];O+=e[it]+i[st],++I[257+it],++S[st],B=j+Q,++L}else F[q++]=s[j],++I[s[j]]}}for(j=Math.max(j,B);j<v;++j)F[q++]=s[j],++I[s[j]];w=U(s,p,g,F,I,S,O,q,G,j-G,w),g||(c.r=7&w|p[w/8|0]<<3,w-=7,c.h=x,c.p=_,c.i=j,c.w=B)}else{for(j=c.w||0;j<v+g;j+=65535){var at=j+65535;at>=v&&(p[w/8|0]=g,at=v),w=k(p,w+1,s.subarray(j,at))}c.i=v}return b(d,0,h+m(w)+u)}(s,null==a.level?6:a.level,null==a.mem?u.l?Math.ceil(1.5*Math.max(8,Math.min(13,Math.log(s.length)))):20:12+a.mem,o,h,u)},j=function(t,n,r){for(;r;++n)t[n]=r,r>>>=8},q=function(t,n){var r=n.filename;if(t[0]=31,t[1]=139,t[2]=8,t[8]=n.level<2?4:9==n.level?2:0,t[9]=3,0!=n.mtime&&j(t,4,Math.floor(new Date(n.mtime||Date.now())/1e3)),r){t[3]=8;for(var e=0;e<=r.length;++e)t[e+10]=r.charCodeAt(e)}},B=function(t){return 10+(t.filename?t.filename.length+1:0)},G=function(){function n(n,r){if("function"==typeof n&&(r=n,n={}),this.ondata=r,this.o=n||{},this.s={l:0,i:32768,w:32768,z:32768},this.b=new t(98304),this.o.dictionary){var e=this.o.dictionary.subarray(-32768);this.b.set(e,32768-e.length),this.s.i=32768-e.length}}return n.prototype.p=function(t,n){this.ondata(O(t,this.o,0,0,this.s),n)},n.prototype.push=function(n,r){this.ondata||E(5),this.s.l&&E(4);var e=n.length+this.s.z;if(e>this.b.length){if(e>2*this.b.length-32768){var i=new t(-32768&e);i.set(this.b.subarray(0,this.s.z)),this.b=i}var s=this.b.length-this.s.z;this.b.set(n.subarray(0,s),this.s.z),this.s.z=this.b.length,this.p(this.b,!1),this.b.set(this.b.subarray(-32768)),this.b.set(n.subarray(s),32768),this.s.z=n.length-s+32768,this.s.i=32766,this.s.w=32768}else this.b.set(n,this.s.z),this.s.z+=n.length;this.s.l=1&r,(this.s.z>this.s.w+8191||r)&&(this.p(this.b,r||!1),this.s.w=this.s.i,this.s.i-=2)},n.prototype.flush=function(){this.ondata||E(5),this.s.l&&E(4),this.p(this.b,!1),this.s.w=this.s.i,this.s.i-=2},n}();var H=function(){function t(t,n){this.c=L(),this.v=1,G.call(this,t,n)}return t.prototype.push=function(t,n){this.c.p(t),G.prototype.push.call(this,t,n)},t.prototype.p=function(t,n){var r=O(t,this.o,this.v&&(this.o.dictionary?6:2),n&&4,this.s);this.v&&(function(t,n){var r=n.level,e=0==r?0:r<6?1:9==r?3:2;if(t[0]=120,t[1]=e<<6|(n.dictionary&&32),t[1]|=31-(t[0]<<8|t[1])%31,n.dictionary){var i=L();i.p(n.dictionary),j(t,2,i.d())}}(r,this.o),this.v=0),n&&j(r,r.length-4,this.c.d()),this.ondata(r,n)},t.prototype.flush=function(){G.prototype.flush.call(this)},t}(),J="undefined"!=typeof TextEncoder&&new TextEncoder,K="undefined"!=typeof TextDecoder&&new TextDecoder;try{K.decode(F,{stream:!0})}catch(t){}var N=function(){function t(t){this.ondata=t}return t.prototype.push=function(t,n){this.ondata||E(5),this.d&&E(4),this.ondata(P(t),this.d=n||!1)},t}();function P(n,r){if(J)return J.encode(n);for(var e=n.length,i=new t(n.length+(n.length>>1)),s=0,a=function(t){i[s++]=t},o=0;o<e;++o){if(s+5>i.length){var h=new t(s+8+(e-o<<1));h.set(i),i=h}var f=n.charCodeAt(o);f<128||r?a(f):f<2048?(a(192|f>>6),a(128|63&f)):f>55295&&f<57344?(a(240|(f=65536+(1047552&f)|1023&n.charCodeAt(++o))>>18),a(128|f>>12&63),a(128|f>>6&63),a(128|63&f)):(a(224|f>>12),a(128|f>>6&63),a(128|63&f))}return b(i,0,s)}function Q(t){return function(t,n){n||(n={});var r=S(),e=t.length;r.p(t);var i=O(t,n,B(n),8),s=i.length;return q(i,n),j(i,s-8,r.d()),j(i,s-4,e),i}(P(t))}const R=new class{constructor(){this._init()}clear(){this._init()}addEvent(t){if(!t)throw new Error("Adding invalid event");const n=this._hasEvents?",":"";this.stream.push(n+t),this._hasEvents=!0}finish(){this.stream.push("]",!0);const t=function(t){let n=0;for(const r of t)n+=r.length;const r=new Uint8Array(n);for(let n=0,e=0,i=t.length;n<i;n++){const i=t[n];r.set(i,e),e+=i.length}return r}(this._deflatedData);return this._init(),t}_init(){this._hasEvents=!1,this._deflatedData=[],this.deflate=new H,this.deflate.ondata=(t,n)=>{this._deflatedData.push(t)},this.stream=new N(((t,n)=>{this.deflate.push(t,n)})),this.stream.push("[")}},V={clear:()=>{R.clear()},addEvent:t=>R.addEvent(t),finish:()=>R.finish(),compress:t=>Q(t)};addEventListener("message",(function(t){const n=t.data.method,r=t.data.id,e=t.data.arg;if(n in V&&"function"==typeof V[n])try{const t=V[n](e);postMessage({id:r,method:n,success:!0,response:t})}catch(t){postMessage({id:r,method:n,success:!1,response:t.message}),console.error(t)}})),postMessage({id:void 0,method:"init",success:!0,response:void 0});';
function _w() {
    const e = new Blob([gw]);
    return URL.createObjectURL(e)
}
const hu = ["info", "warn", "error", "log"]
  , ms = "[Replay] ";
function Wo(e, t="info") {
    it({
        category: "console",
        data: {
            logger: "replay"
        },
        level: t,
        message: `${ms}${e}`
    }, {
        level: t
    })
}
function yw() {
    let e = !1
      , t = !1;
    const n = {
        exception: () => {}
        ,
        infoTick: () => {}
        ,
        setConfig: r => {
            e = !!r.captureExceptions,
            t = !!r.traceInternals
        }
    };
    return $ ? (hu.forEach(r => {
        n[r] = (...s) => {
            y[r](ms, ...s),
            t && Wo(s.join(""), Yi(r))
        }
    }
    ),
    n.exception = (r, ...s) => {
        s.length && n.error && n.error(...s),
        y.error(ms, r),
        e ? tn(r) : t && Wo(r, "error")
    }
    ,
    n.infoTick = (...r) => {
        y.info(ms, ...r),
        t && setTimeout( () => Wo(r[0]), 0)
    }
    ) : hu.forEach(r => {
        n[r] = () => {}
    }
    ),
    n
}
const B = yw();
class va extends Error {
    constructor() {
        super(`Event buffer exceeded maximum size of ${ha}.`)
    }
}
class kf {
    constructor() {
        this.events = [],
        this._totalSize = 0,
        this.hasCheckout = !1,
        this.waitForCheckout = !1
    }
    get hasEvents() {
        return this.events.length > 0
    }
    get type() {
        return "sync"
    }
    destroy() {
        this.events = []
    }
    async addEvent(t) {
        const n = JSON.stringify(t).length;
        if (this._totalSize += n,
        this._totalSize > ha)
            throw new va;
        this.events.push(t)
    }
    finish() {
        return new Promise(t => {
            const n = this.events;
            this.clear(),
            t(JSON.stringify(n))
        }
        )
    }
    clear() {
        this.events = [],
        this._totalSize = 0,
        this.hasCheckout = !1
    }
    getEarliestTimestamp() {
        const t = this.events.map(n => n.timestamp).sort()[0];
        return t ? ba(t) : null
    }
}
class Sw {
    constructor(t) {
        this._worker = t,
        this._id = 0
    }
    ensureReady() {
        return this._ensureReadyPromise ? this._ensureReadyPromise : (this._ensureReadyPromise = new Promise( (t, n) => {
            this._worker.addEventListener("message", ({data: r}) => {
                r.success ? t() : n()
            }
            , {
                once: !0
            }),
            this._worker.addEventListener("error", r => {
                n(r)
            }
            , {
                once: !0
            })
        }
        ),
        this._ensureReadyPromise)
    }
    destroy() {
        $ && B.info("Destroying compression worker"),
        this._worker.terminate()
    }
    postMessage(t, n) {
        const r = this._getAndIncrementId();
        return new Promise( (s, o) => {
            const i = ({data: a}) => {
                const c = a;
                if (c.method === t && c.id === r) {
                    if (this._worker.removeEventListener("message", i),
                    !c.success) {
                        $ && B.error("Error in compression worker: ", c.response),
                        o(new Error("Error in compression worker"));
                        return
                    }
                    s(c.response)
                }
            }
            ;
            this._worker.addEventListener("message", i),
            this._worker.postMessage({
                id: r,
                method: t,
                arg: n
            })
        }
        )
    }
    _getAndIncrementId() {
        return this._id++
    }
}
class bw {
    constructor(t) {
        this._worker = new Sw(t),
        this._earliestTimestamp = null,
        this._totalSize = 0,
        this.hasCheckout = !1,
        this.waitForCheckout = !1
    }
    get hasEvents() {
        return !!this._earliestTimestamp
    }
    get type() {
        return "worker"
    }
    ensureReady() {
        return this._worker.ensureReady()
    }
    destroy() {
        this._worker.destroy()
    }
    addEvent(t) {
        const n = ba(t.timestamp);
        (!this._earliestTimestamp || n < this._earliestTimestamp) && (this._earliestTimestamp = n);
        const r = JSON.stringify(t);
        return this._totalSize += r.length,
        this._totalSize > ha ? Promise.reject(new va) : this._sendEventToWorker(r)
    }
    finish() {
        return this._finishRequest()
    }
    clear() {
        this._earliestTimestamp = null,
        this._totalSize = 0,
        this.hasCheckout = !1,
        this._worker.postMessage("clear").then(null, t => {
            $ && B.exception(t, 'Sending "clear" message to worker failed', t)
        }
        )
    }
    getEarliestTimestamp() {
        return this._earliestTimestamp
    }
    _sendEventToWorker(t) {
        return this._worker.postMessage("addEvent", t)
    }
    async _finishRequest() {
        const t = await this._worker.postMessage("finish");
        return this._earliestTimestamp = null,
        this._totalSize = 0,
        t
    }
}
class Ew {
    constructor(t) {
        this._fallback = new kf,
        this._compression = new bw(t),
        this._used = this._fallback,
        this._ensureWorkerIsLoadedPromise = this._ensureWorkerIsLoaded()
    }
    get waitForCheckout() {
        return this._used.waitForCheckout
    }
    get type() {
        return this._used.type
    }
    get hasEvents() {
        return this._used.hasEvents
    }
    get hasCheckout() {
        return this._used.hasCheckout
    }
    set hasCheckout(t) {
        this._used.hasCheckout = t
    }
    set waitForCheckout(t) {
        this._used.waitForCheckout = t
    }
    destroy() {
        this._fallback.destroy(),
        this._compression.destroy()
    }
    clear() {
        return this._used.clear()
    }
    getEarliestTimestamp() {
        return this._used.getEarliestTimestamp()
    }
    addEvent(t) {
        return this._used.addEvent(t)
    }
    async finish() {
        return await this.ensureWorkerIsLoaded(),
        this._used.finish()
    }
    ensureWorkerIsLoaded() {
        return this._ensureWorkerIsLoadedPromise
    }
    async _ensureWorkerIsLoaded() {
        try {
            await this._compression.ensureReady()
        } catch (t) {
            $ && B.exception(t, "Failed to load the compression worker, falling back to simple buffer");
            return
        }
        await this._switchToCompressionWorker()
    }
    async _switchToCompressionWorker() {
        const {events: t, hasCheckout: n, waitForCheckout: r} = this._fallback
          , s = [];
        for (const o of t)
            s.push(this._compression.addEvent(o));
        this._compression.hasCheckout = n,
        this._compression.waitForCheckout = r,
        this._used = this._compression;
        try {
            await Promise.all(s),
            this._fallback.clear()
        } catch (o) {
            $ && B.exception(o, "Failed to add events when switching buffers.")
        }
    }
}
function vw({useCompression: e, workerUrl: t}) {
    if (e && window.Worker) {
        const n = ww(t);
        if (n)
            return n
    }
    return $ && B.info("Using simple buffer"),
    new kf
}
function ww(e) {
    try {
        const t = e || Tw();
        if (!t)
            return;
        $ && B.info(`Using compression worker${e ? ` from ${e}` : ""}`);
        const n = new Worker(t);
        return new Ew(n)
    } catch (t) {
        $ && B.exception(t, "Failed to create compression worker")
    }
}
function Tw() {
    return typeof __SENTRY_EXCLUDE_REPLAY_WORKER__ > "u" || !__SENTRY_EXCLUDE_REPLAY_WORKER__ ? _w() : ""
}
function wa() {
    try {
        return "sessionStorage"in ue && !!ue.sessionStorage
    } catch {
        return !1
    }
}
function Iw(e) {
    kw(),
    e.session = void 0
}
function kw() {
    if (wa())
        try {
            ue.sessionStorage.removeItem(fa)
        } catch {}
}
function Cf(e) {
    return e === void 0 ? !1 : Math.random() < e
}
function Ta(e) {
    if (wa())
        try {
            ue.sessionStorage.setItem(fa, JSON.stringify(e))
        } catch {}
}
function Rf(e) {
    const t = Date.now()
      , n = e.id || Ae()
      , r = e.started || t
      , s = e.lastActivity || t
      , o = e.segmentId || 0
      , i = e.sampled
      , a = e.previousSessionId;
    return {
        id: n,
        started: r,
        lastActivity: s,
        segmentId: o,
        sampled: i,
        previousSessionId: a
    }
}
function Cw(e, t) {
    return Cf(e) ? "session" : t ? "buffer" : !1
}
function mu({sessionSampleRate: e, allowBuffering: t, stickySession: n=!1}, {previousSessionId: r}={}) {
    const s = Cw(e, t)
      , o = Rf({
        sampled: s,
        previousSessionId: r
    });
    return n && Ta(o),
    o
}
function Rw() {
    if (!wa())
        return null;
    try {
        const e = ue.sessionStorage.getItem(fa);
        if (!e)
            return null;
        const t = JSON.parse(e);
        return $ && B.infoTick("Loading existing session"),
        Rf(t)
    } catch {
        return null
    }
}
function Ri(e, t, n=+new Date) {
    return e === null || t === void 0 || t < 0 ? !0 : t === 0 ? !1 : e + t <= n
}
function xf(e, {maxReplayDuration: t, sessionIdleExpire: n, targetTime: r=Date.now()}) {
    return Ri(e.started, t, r) || Ri(e.lastActivity, n, r)
}
function Mf(e, {sessionIdleExpire: t, maxReplayDuration: n}) {
    return !(!xf(e, {
        sessionIdleExpire: t,
        maxReplayDuration: n
    }) || e.sampled === "buffer" && e.segmentId === 0)
}
function zo({sessionIdleExpire: e, maxReplayDuration: t, previousSessionId: n}, r) {
    const s = r.stickySession && Rw();
    return s ? Mf(s, {
        sessionIdleExpire: e,
        maxReplayDuration: t
    }) ? ($ && B.infoTick("Session in sessionStorage is expired, creating new one..."),
    mu(r, {
        previousSessionId: s.id
    })) : s : ($ && B.infoTick("Creating new session"),
    mu(r, {
        previousSessionId: n
    }))
}
function xw(e) {
    return e.type === q.Custom
}
function Ia(e, t, n) {
    return Nf(e, t) ? (Af(e, t, n),
    !0) : !1
}
function Mw(e, t, n) {
    return Nf(e, t) ? Af(e, t, n) : Promise.resolve(null)
}
async function Af(e, t, n) {
    const {eventBuffer: r} = e;
    if (!r || r.waitForCheckout && !n)
        return null;
    const s = e.recordingMode === "buffer";
    try {
        n && s && r.clear(),
        n && (r.hasCheckout = !0,
        r.waitForCheckout = !1);
        const o = e.getOptions()
          , i = Aw(t, o.beforeAddRecordingEvent);
        return i ? await r.addEvent(i) : void 0
    } catch (o) {
        const i = o && o instanceof va
          , a = i ? "addEventSizeExceeded" : "addEvent";
        if (i && s)
            return r.clear(),
            r.waitForCheckout = !0,
            null;
        e.handleException(o),
        await e.stop({
            reason: a
        });
        const c = M();
        c && c.recordDroppedEvent("internal_sdk_error", "replay")
    }
}
function Nf(e, t) {
    if (!e.eventBuffer || e.isPaused() || !e.isEnabled())
        return !1;
    const n = ba(t.timestamp);
    return n + e.timeouts.sessionIdlePause < Date.now() ? !1 : n > e.getContext().initialTimestamp + e.getOptions().maxReplayDuration ? ($ && B.infoTick(`Skipping event with timestamp ${n} because it is after maxReplayDuration`),
    !1) : !0
}
function Aw(e, t) {
    try {
        if (typeof t == "function" && xw(e))
            return t(e)
    } catch (n) {
        return $ && B.exception(n, "An error occurred in the `beforeAddRecordingEvent` callback, skipping the event..."),
        null
    }
    return e
}
function ka(e) {
    return !e.type
}
function xi(e) {
    return e.type === "transaction"
}
function Nw(e) {
    return e.type === "replay_event"
}
function gu(e) {
    return e.type === "feedback"
}
function Ow(e) {
    return (t, n) => {
        if (!e.isEnabled() || !ka(t) && !xi(t))
            return;
        const r = n == null ? void 0 : n.statusCode;
        if (!(!r || r < 200 || r >= 300)) {
            if (xi(t)) {
                Lw(e, t);
                return
            }
            Pw(e, t)
        }
    }
}
function Lw(e, t) {
    var r, s;
    const n = e.getContext();
    (s = (r = t.contexts) == null ? void 0 : r.trace) != null && s.trace_id && n.traceIds.size < 100 && n.traceIds.add(t.contexts.trace.trace_id)
}
function Pw(e, t) {
    const n = e.getContext();
    if (t.event_id && n.errorIds.size < 100 && n.errorIds.add(t.event_id),
    e.recordingMode !== "buffer" || !t.tags || !t.tags.replayId)
        return;
    const {beforeErrorSampling: r} = e.getOptions();
    typeof r == "function" && !r(t) || Mr(async () => {
        try {
            await e.sendBufferedReplayOrFlush()
        } catch (s) {
            e.handleException(s)
        }
    }
    )
}
function Dw(e) {
    return t => {
        !e.isEnabled() || !ka(t) || Fw(e, t)
    }
}
function Fw(e, t) {
    var r, s, o;
    const n = (o = (s = (r = t.exception) == null ? void 0 : r.values) == null ? void 0 : s[0]) == null ? void 0 : o.value;
    if (typeof n == "string" && (n.match(/(reactjs\.org\/docs\/error-decoder\.html\?invariant=|react\.dev\/errors\/)(418|419|422|423|425)/) || n.match(/(does not match server-rendered HTML|Hydration failed because)/i))) {
        const i = tt({
            category: "replay.hydrate-error",
            data: {
                url: rn()
            }
        });
        Nr(e, i)
    }
}
function $w(e) {
    const t = M();
    t && t.on("beforeAddBreadcrumb", n => Bw(e, n))
}
function Bw(e, t) {
    if (!e.isEnabled() || !Of(t))
        return;
    const n = Uw(t);
    n && Nr(e, n)
}
function Uw(e) {
    return !Of(e) || ["fetch", "xhr", "sentry.event", "sentry.transaction"].includes(e.category) || e.category.startsWith("ui.") ? null : e.category === "console" ? Hw(e) : tt(e)
}
function Hw(e) {
    var s;
    const t = (s = e.data) == null ? void 0 : s.arguments;
    if (!Array.isArray(t) || t.length === 0)
        return tt(e);
    let n = !1;
    const r = t.map(o => {
        if (!o)
            return o;
        if (typeof o == "string")
            return o.length > Xr ? (n = !0,
            `${o.slice(0, Xr)}…`) : o;
        if (typeof o == "object")
            try {
                const i = De(o, 7);
                return JSON.stringify(i).length > Xr ? (n = !0,
                `${JSON.stringify(i, null, 2).slice(0, Xr)}…`) : i
            } catch {}
        return o
    }
    );
    return tt({
        ...e,
        data: {
            ...e.data,
            arguments: r,
            ...n ? {
                _meta: {
                    warnings: ["CONSOLE_ARG_TRUNCATED"]
                }
            } : {}
        }
    })
}
function Of(e) {
    return !!e.category
}
function Ww(e, t) {
    var n;
    return e.type || !e.exception || !e.exception.values || !e.exception.values.length ? !1 : !!((n = t.originalException) != null && n.__rrweb__)
}
function Lf() {
    const e = j().getPropagationContext().dsc;
    e && delete e.replay_id;
    const t = ge();
    if (t) {
        const n = Ze(t);
        delete n.replay_id
    }
}
function zw(e, t) {
    e.triggerUserActivity(),
    e.addUpdate( () => t.timestamp ? (e.throttledAddEvent({
        type: q.Custom,
        timestamp: t.timestamp * 1e3,
        data: {
            tag: "breadcrumb",
            payload: {
                timestamp: t.timestamp,
                type: "default",
                category: "sentry.feedback",
                data: {
                    feedbackId: t.event_id
                }
            }
        }
    }),
    !1) : !0)
}
function jw(e, t) {
    return e.recordingMode !== "buffer" || t.message === pa || !t.exception || t.type ? !1 : Cf(e.getOptions().errorSampleRate)
}
function qw(e) {
    return Object.assign( (t, n) => !e.isEnabled() || e.isPaused() ? t : Nw(t) ? (delete t.breadcrumbs,
    t) : !ka(t) && !xi(t) && !gu(t) ? t : e.checkAndHandleExpiredSession() ? gu(t) ? (e.flush(),
    t.contexts.feedback.replay_id = e.getSessionId(),
    zw(e, t),
    t) : Ww(t, n) && !e.getOptions()._experiments.captureExceptions ? ($ && B.log("Ignoring error from rrweb internals", t),
    null) : ((jw(e, t) || e.recordingMode === "session") && (t.tags = {
        ...t.tags,
        replayId: e.getSessionId()
    }),
    t) : (Lf(),
    t), {
        id: "Replay"
    })
}
function co(e, t) {
    return t.map( ({type: n, start: r, end: s, name: o, data: i}) => {
        const a = e.throttledAddEvent({
            type: q.Custom,
            timestamp: r,
            data: {
                tag: "performanceSpan",
                payload: {
                    op: n,
                    description: o,
                    startTimestamp: r,
                    endTimestamp: s,
                    data: i
                }
            }
        });
        return typeof a == "string" ? Promise.resolve(null) : a
    }
    )
}
function Gw(e) {
    const {from: t, to: n} = e
      , r = Date.now() / 1e3;
    return {
        type: "navigation.push",
        start: r,
        end: r,
        name: n,
        data: {
            previous: t
        }
    }
}
function Vw(e) {
    return t => {
        if (!e.isEnabled())
            return;
        const n = Gw(t);
        n !== null && (e.getContext().urls.push(n.name),
        e.triggerUserActivity(),
        e.addUpdate( () => (co(e, [n]),
        !1)))
    }
}
function Yw(e, t) {
    return $ && e.getOptions()._experiments.traceInternals ? !1 : Kl(t, M())
}
function Pf(e, t) {
    e.isEnabled() && t !== null && (Yw(e, t.name) || e.addUpdate( () => (co(e, [t]),
    !0)))
}
function uo(e) {
    if (!e)
        return;
    const t = new TextEncoder;
    try {
        if (typeof e == "string")
            return t.encode(e).length;
        if (e instanceof URLSearchParams)
            return t.encode(e.toString()).length;
        if (e instanceof FormData) {
            const n = Hd(e);
            return t.encode(n).length
        }
        if (e instanceof Blob)
            return e.size;
        if (e instanceof ArrayBuffer)
            return e.byteLength
    } catch {}
}
function Df(e) {
    if (!e)
        return;
    const t = parseInt(e, 10);
    return isNaN(t) ? void 0 : t
}
function zs(e, t) {
    if (!e)
        return {
            headers: {},
            size: void 0,
            _meta: {
                warnings: [t]
            }
        };
    const n = {
        ...e._meta
    }
      , r = n.warnings || [];
    return n.warnings = [...r, t],
    e._meta = n,
    e
}
function Ff(e, t) {
    if (!t)
        return null;
    const {startTimestamp: n, endTimestamp: r, url: s, method: o, statusCode: i, request: a, response: c} = t;
    return {
        type: e,
        start: n / 1e3,
        end: r / 1e3,
        name: s,
        data: {
            method: o,
            statusCode: i,
            request: a,
            response: c
        }
    }
}
function fr(e) {
    return {
        headers: {},
        size: e,
        _meta: {
            warnings: ["URL_SKIPPED"]
        }
    }
}
function At(e, t, n) {
    if (!t && Object.keys(e).length === 0)
        return;
    if (!t)
        return {
            headers: e
        };
    if (!n)
        return {
            headers: e,
            size: t
        };
    const r = {
        headers: e,
        size: t
    }
      , {body: s, warnings: o} = Xw(n);
    return r.body = s,
    o != null && o.length && (r._meta = {
        warnings: o
    }),
    r
}
function Mi(e, t) {
    return Object.entries(e).reduce( (n, [r,s]) => {
        const o = r.toLowerCase();
        return t.includes(o) && e[r] && (n[o] = s),
        n
    }
    , {})
}
function Xw(e) {
    if (!e || typeof e != "string")
        return {
            body: e
        };
    const t = e.length > Kc
      , n = Kw(e);
    if (t) {
        const r = e.slice(0, Kc);
        return n ? {
            body: r,
            warnings: ["MAYBE_JSON_TRUNCATED"]
        } : {
            body: `${r}…`,
            warnings: ["TEXT_TRUNCATED"]
        }
    }
    if (n)
        try {
            return {
                body: JSON.parse(e)
            }
        } catch {}
    return {
        body: e
    }
}
function Kw(e) {
    const t = e[0]
      , n = e[e.length - 1];
    return t === "[" && n === "]" || t === "{" && n === "}"
}
function js(e, t) {
    const n = Jw(e);
    return Je(n, t)
}
function Jw(e, t=ue.document.baseURI) {
    if (e.startsWith("http://") || e.startsWith("https://") || e.startsWith(ue.location.origin))
        return e;
    const n = new URL(e,t);
    if (n.origin !== new URL(t).origin)
        return e;
    const r = n.href;
    return !e.endsWith("/") && r.endsWith("/") ? r.slice(0, -1) : r
}
async function Zw(e, t, n) {
    try {
        const r = await eT(e, t, n)
          , s = Ff("resource.fetch", r);
        Pf(n.replay, s)
    } catch (r) {
        $ && B.exception(r, "Failed to capture fetch breadcrumb")
    }
}
function Qw(e, t) {
    const {input: n, response: r} = t
      , s = n ? da(n) : void 0
      , o = uo(s)
      , i = r ? Df(r.headers.get("content-length")) : void 0;
    o !== void 0 && (e.data.request_body_size = o),
    i !== void 0 && (e.data.response_body_size = i)
}
async function eT(e, t, n) {
    const r = Date.now()
      , {startTimestamp: s=r, endTimestamp: o=r} = t
      , {url: i, method: a, status_code: c=0, request_body_size: u, response_body_size: d} = e.data
      , l = js(i, n.networkDetailAllowUrls) && !js(i, n.networkDetailDenyUrls)
      , f = l ? tT(n, t.input, u) : fr(u)
      , p = await nT(l, n, t.response, d);
    return {
        startTimestamp: s,
        endTimestamp: o,
        url: i,
        method: a,
        statusCode: c,
        request: f,
        response: p
    }
}
function tT({networkCaptureBodies: e, networkRequestHeaders: t}, n, r) {
    const s = n ? oT(n, t) : {};
    if (!e)
        return At(s, r, void 0);
    const o = da(n)
      , [i,a] = Ds(o, B)
      , c = At(s, r, i);
    return a ? zs(c, a) : c
}
async function nT(e, {networkCaptureBodies: t, networkResponseHeaders: n}, r, s) {
    if (!e && s !== void 0)
        return fr(s);
    const o = r ? $f(r.headers, n) : {};
    if (!r || !t && s !== void 0)
        return At(o, s, void 0);
    const [i,a] = await sT(r)
      , c = rT(i, {
        networkCaptureBodies: t,
        responseBodySize: s,
        captureDetails: e,
        headers: o
    });
    return a ? zs(c, a) : c
}
function rT(e, {networkCaptureBodies: t, responseBodySize: n, captureDetails: r, headers: s}) {
    try {
        const o = e != null && e.length && n === void 0 ? uo(e) : n;
        return r ? t ? At(s, o, e) : At(s, o, void 0) : fr(o)
    } catch (o) {
        return $ && B.exception(o, "Failed to serialize response body"),
        At(s, n, void 0)
    }
}
async function sT(e) {
    const t = iT(e);
    if (!t)
        return [void 0, "BODY_PARSE_ERROR"];
    try {
        return [await aT(t)]
    } catch (n) {
        return n instanceof Error && n.message.indexOf("Timeout") > -1 ? ($ && B.warn("Parsing text body from response timed out"),
        [void 0, "BODY_PARSE_TIMEOUT"]) : ($ && B.exception(n, "Failed to get text body from response"),
        [void 0, "BODY_PARSE_ERROR"])
    }
}
function $f(e, t) {
    const n = {};
    return t.forEach(r => {
        e.get(r) && (n[r] = e.get(r))
    }
    ),
    n
}
function oT(e, t) {
    return e.length === 1 && typeof e[0] != "string" ? _u(e[0], t) : e.length === 2 ? _u(e[1], t) : {}
}
function _u(e, t) {
    if (!e)
        return {};
    const n = e.headers;
    return n ? n instanceof Headers ? $f(n, t) : Array.isArray(n) ? {} : Mi(n, t) : {}
}
function iT(e) {
    try {
        return e.clone()
    } catch (t) {
        $ && B.exception(t, "Failed to clone response body")
    }
}
function aT(e) {
    return new Promise( (t, n) => {
        const r = Mr( () => n(new Error("Timeout while trying to read response body")), 500);
        cT(e).then(s => t(s), s => n(s)).finally( () => clearTimeout(r))
    }
    )
}
async function cT(e) {
    return await e.text()
}
async function uT(e, t, n) {
    try {
        const r = dT(e, t, n)
          , s = Ff("resource.xhr", r);
        Pf(n.replay, s)
    } catch (r) {
        $ && B.exception(r, "Failed to capture xhr breadcrumb")
    }
}
function lT(e, t) {
    const {xhr: n, input: r} = t;
    if (!n)
        return;
    const s = uo(r)
      , o = n.getResponseHeader("content-length") ? Df(n.getResponseHeader("content-length")) : mT(n.response, n.responseType);
    s !== void 0 && (e.data.request_body_size = s),
    o !== void 0 && (e.data.response_body_size = o)
}
function dT(e, t, n) {
    const r = Date.now()
      , {startTimestamp: s=r, endTimestamp: o=r, input: i, xhr: a} = t
      , {url: c, method: u, status_code: d=0, request_body_size: l, response_body_size: f} = e.data;
    if (!c)
        return null;
    if (!a || !js(c, n.networkDetailAllowUrls) || js(c, n.networkDetailDenyUrls)) {
        const E = fr(l)
          , k = fr(f);
        return {
            startTimestamp: s,
            endTimestamp: o,
            url: c,
            method: u,
            statusCode: d,
            request: E,
            response: k
        }
    }
    const p = a[ft]
      , h = p ? Mi(p.request_headers, n.networkRequestHeaders) : {}
      , m = Mi(fT(a), n.networkResponseHeaders)
      , [_,g] = n.networkCaptureBodies ? Ds(i, B) : [void 0]
      , [b,T] = n.networkCaptureBodies ? pT(a) : [void 0]
      , C = At(h, l, _)
      , S = At(m, f, b);
    return {
        startTimestamp: s,
        endTimestamp: o,
        url: c,
        method: u,
        statusCode: d,
        request: g ? zs(C, g) : C,
        response: T ? zs(S, T) : S
    }
}
function fT(e) {
    const t = e.getAllResponseHeaders();
    return t ? t.split(`\r
`).reduce( (n, r) => {
        const [s,o] = r.split(": ");
        return o && (n[s.toLowerCase()] = o),
        n
    }
    , {}) : {}
}
function pT(e) {
    const t = [];
    try {
        return [e.responseText]
    } catch (n) {
        t.push(n)
    }
    try {
        return hT(e.response, e.responseType)
    } catch (n) {
        t.push(n)
    }
    return $ && B.warn("Failed to get xhr response body", ...t),
    [void 0]
}
function hT(e, t) {
    try {
        if (typeof e == "string")
            return [e];
        if (e instanceof Document)
            return [e.body.outerHTML];
        if (t === "json" && e && typeof e == "object")
            return [JSON.stringify(e)];
        if (!e)
            return [void 0]
    } catch (n) {
        return $ && B.exception(n, "Failed to serialize body", e),
        [void 0, "BODY_PARSE_ERROR"]
    }
    return $ && B.info("Skipping network body because of body type", e),
    [void 0, "UNPARSEABLE_BODY_TYPE"]
}
function mT(e, t) {
    try {
        const n = t === "json" && e && typeof e == "object" ? JSON.stringify(e) : e;
        return uo(n)
    } catch {
        return
    }
}
function gT(e) {
    const t = M();
    try {
        const {networkDetailAllowUrls: n, networkDetailDenyUrls: r, networkCaptureBodies: s, networkRequestHeaders: o, networkResponseHeaders: i} = e.getOptions()
          , a = {
            replay: e,
            networkDetailAllowUrls: n,
            networkDetailDenyUrls: r,
            networkCaptureBodies: s,
            networkRequestHeaders: o,
            networkResponseHeaders: i
        };
        t && t.on("beforeAddBreadcrumb", (c, u) => _T(a, c, u))
    } catch {}
}
function _T(e, t, n) {
    if (t.data)
        try {
            yT(t) && bT(n) && (lT(t, n),
            uT(t, n, e)),
            ST(t) && ET(n) && (Qw(t, n),
            Zw(t, n, e))
        } catch (r) {
            $ && B.exception(r, "Error when enriching network breadcrumb")
        }
}
function yT(e) {
    return e.category === "xhr"
}
function ST(e) {
    return e.category === "fetch"
}
function bT(e) {
    return e == null ? void 0 : e.xhr
}
function ET(e) {
    return e == null ? void 0 : e.response
}
function vT(e, {autoFlushOnFeedback: t}) {
    const n = M();
    Ud(J0(e)),
    ro(Vw(e)),
    $w(e),
    gT(e);
    const r = qw(e);
    gm(r),
    n && (n.on("beforeSendEvent", Dw(e)),
    n.on("afterSendEvent", Ow(e)),
    n.on("createDsc", s => {
        const o = e.getSessionId();
        o && e.isEnabled() && e.recordingMode === "session" && e.checkAndHandleExpiredSession() && (s.replay_id = o)
    }
    ),
    n.on("spanStart", s => {
        e.lastActiveSpan = s
    }
    ),
    n.on("spanEnd", s => {
        e.lastActiveSpan = s
    }
    ),
    n.on("beforeSendFeedback", async (s, o) => {
        var a;
        const i = e.getSessionId();
        o != null && o.includeReplay && e.isEnabled() && i && ((a = s.contexts) != null && a.feedback) && (s.contexts.feedback.source === "api" && t && await e.flush(),
        s.contexts.feedback.replay_id = i)
    }
    ),
    t && n.on("openFeedbackWidget", async () => {
        await e.flush()
    }
    ))
}
async function wT(e) {
    try {
        return Promise.all(co(e, [TT(ue.performance.memory)]))
    } catch {
        return []
    }
}
function TT(e) {
    const {jsHeapSizeLimit: t, totalJSHeapSize: n, usedJSHeapSize: r} = e
      , s = Date.now() / 1e3;
    return {
        type: "memory",
        name: "memory",
        start: s,
        end: s,
        data: {
            memory: {
                jsHeapSizeLimit: t,
                totalJSHeapSize: n,
                usedJSHeapSize: r
            }
        }
    }
}
function IT(e, t, n) {
    return ng(e, t, {
        ...n,
        setTimeoutImpl: Mr
    })
}
const We = P.navigator;
function kT() {
    return /iPhone|iPad|iPod/i.test((We == null ? void 0 : We.userAgent) ?? "") || /Macintosh/i.test((We == null ? void 0 : We.userAgent) ?? "") && (We != null && We.maxTouchPoints) && (We == null ? void 0 : We.maxTouchPoints) > 1 ? {
        sampling: {
            mousemove: !1
        }
    } : {}
}
function CT(e) {
    let t = !1;
    return (n, r) => {
        if (!e.checkAndHandleExpiredSession()) {
            $ && B.warn("Received replay event after session expired.");
            return
        }
        const s = r || !t;
        t = !0,
        e.clickDetector && G0(e.clickDetector, n),
        e.addUpdate( () => {
            if (e.recordingMode === "buffer" && s && e.setInitialState(),
            !Ia(e, n, s))
                return !0;
            if (!s)
                return !1;
            const o = e.session;
            if (xT(e, s),
            e.recordingMode === "buffer" && o && e.eventBuffer) {
                const i = e.eventBuffer.getEarliestTimestamp();
                i && ($ && B.info(`Updating session start time to earliest event in buffer to ${new Date(i)}`),
                o.started = i,
                e.getOptions().stickySession && Ta(o))
            }
            return o != null && o.previousSessionId || e.recordingMode === "session" && e.flush(),
            !0
        }
        )
    }
}
function RT(e) {
    const t = e.getOptions();
    return {
        type: q.Custom,
        timestamp: Date.now(),
        data: {
            tag: "options",
            payload: {
                shouldRecordCanvas: e.isRecordingCanvas(),
                sessionSampleRate: t.sessionSampleRate,
                errorSampleRate: t.errorSampleRate,
                useCompressionOption: t.useCompression,
                blockAllMedia: t.blockAllMedia,
                maskAllText: t.maskAllText,
                maskAllInputs: t.maskAllInputs,
                useCompression: e.eventBuffer ? e.eventBuffer.type === "worker" : !1,
                networkDetailHasUrls: t.networkDetailAllowUrls.length > 0,
                networkCaptureBodies: t.networkCaptureBodies,
                networkRequestHasHeaders: t.networkRequestHeaders.length > 0,
                networkResponseHasHeaders: t.networkResponseHeaders.length > 0
            }
        }
    }
}
function xT(e, t) {
    !t || !e.session || e.session.segmentId !== 0 || Ia(e, RT(e), !1)
}
function MT(e, t, n, r) {
    return wt(Rl(e, Wi(e), r, n), [[{
        type: "replay_event"
    }, e], [{
        type: "replay_recording",
        length: typeof t == "string" ? new TextEncoder().encode(t).length : t.length
    }, t]])
}
function AT({recordingData: e, headers: t}) {
    let n;
    const r = `${JSON.stringify(t)}
`;
    if (typeof e == "string")
        n = `${r}${e}`;
    else {
        const o = new TextEncoder().encode(r);
        n = new Uint8Array(o.length + e.length),
        n.set(o),
        n.set(e, o.length)
    }
    return n
}
async function NT({client: e, scope: t, replayId: n, event: r}) {
    const s = typeof e._integrations == "object" && e._integrations !== null && !Array.isArray(e._integrations) ? Object.keys(e._integrations) : void 0
      , o = {
        event_id: n,
        integrations: s
    };
    e.emit("preprocessEvent", r, o);
    const i = await Ol(e.getOptions(), r, o, t, e, we());
    if (!i)
        return null;
    e.emit("postprocessEvent", i, o),
    i.platform = i.platform || "javascript";
    const a = e.getSdkMetadata()
      , {name: c, version: u} = (a == null ? void 0 : a.sdk) || {};
    return i.sdk = {
        ...i.sdk,
        name: c || "sentry.javascript.unknown",
        version: u || "0.0.0"
    },
    i
}
async function OT({recordingData: e, replayId: t, segmentId: n, eventContext: r, timestamp: s, session: o}) {
    const i = AT({
        recordingData: e,
        headers: {
            segment_id: n
        }
    })
      , {urls: a, errorIds: c, traceIds: u, initialTimestamp: d} = r
      , l = M()
      , f = j()
      , p = l == null ? void 0 : l.getTransport()
      , h = l == null ? void 0 : l.getDsn();
    if (!l || !p || !h || !o.sampled)
        return St({});
    const m = {
        type: lv,
        replay_start_timestamp: d / 1e3,
        timestamp: s / 1e3,
        error_ids: c,
        trace_ids: u,
        urls: a,
        replay_id: t,
        segment_id: n,
        replay_type: o.sampled
    }
      , _ = await NT({
        scope: f,
        client: l,
        replayId: t,
        event: m
    });
    if (!_)
        return l.recordDroppedEvent("event_processor", "replay"),
        $ && B.info("An event processor returned `null`, will not send event."),
        St({});
    delete _.sdkProcessingMetadata;
    const g = MT(_, i, h, l.getOptions().tunnel);
    let b;
    try {
        b = await p.send(g)
    } catch (C) {
        const S = new Error(pa);
        try {
            S.cause = C
        } catch {}
        throw S
    }
    if (typeof b.statusCode == "number" && (b.statusCode < 200 || b.statusCode >= 300))
        throw new Bf(b.statusCode);
    const T = Yl({}, b);
    if (Vl(T, "replay"))
        throw new Ca(T);
    return b
}
class Bf extends Error {
    constructor(t) {
        super(`Transport returned status code ${t}`)
    }
}
class Ca extends Error {
    constructor(t) {
        super("Rate limit hit"),
        this.rateLimits = t
    }
}
async function Uf(e, t={
    count: 0,
    interval: gv
}) {
    const {recordingData: n, onError: r} = e;
    if (n.length)
        try {
            return await OT(e),
            !0
        } catch (s) {
            if (s instanceof Bf || s instanceof Ca)
                throw s;
            if (Ll("Replays", {
                _retryCount: t.count
            }),
            r && r(s),
            t.count >= _v) {
                const o = new Error(`${pa} - max retries exceeded`);
                try {
                    o.cause = s
                } catch {}
                throw o
            }
            return t.interval *= ++t.count,
            new Promise( (o, i) => {
                Mr(async () => {
                    try {
                        await Uf(e, t),
                        o(!0)
                    } catch (a) {
                        i(a)
                    }
                }
                , t.interval)
            }
            )
        }
}
const Hf = "__THROTTLED"
  , LT = "__SKIPPED";
function PT(e, t, n) {
    const r = new Map
      , s = a => {
        const c = a - n;
        r.forEach( (u, d) => {
            d < c && r.delete(d)
        }
        )
    }
      , o = () => [...r.values()].reduce( (a, c) => a + c, 0);
    let i = !1;
    return (...a) => {
        const c = Math.floor(Date.now() / 1e3);
        if (s(c),
        o() >= t) {
            const d = i;
            return i = !0,
            d ? LT : Hf
        }
        i = !1;
        const u = r.get(c) || 0;
        return r.set(c, u + 1),
        e(...a)
    }
}
class DT {
    constructor({options: t, recordingOptions: n}) {
        this.eventBuffer = null,
        this.performanceEntries = [],
        this.replayPerformanceEntries = [],
        this.recordingMode = "session",
        this.timeouts = {
            sessionIdlePause: dv,
            sessionIdleExpire: fv
        },
        this._lastActivity = Date.now(),
        this._isEnabled = !1,
        this._isPaused = !1,
        this._requiresManualStart = !1,
        this._hasInitializedCoreListeners = !1,
        this._context = {
            errorIds: new Set,
            traceIds: new Set,
            urls: [],
            initialTimestamp: Date.now(),
            initialUrl: ""
        },
        this._recordingOptions = n,
        this._options = t,
        this._debouncedFlush = IT( () => this._flush(), this._options.flushMinDelay, {
            maxWait: this._options.flushMaxDelay
        }),
        this._throttledAddEvent = PT( (i, a) => Mw(this, i, a), 300, 5);
        const {slowClickTimeout: r, slowClickIgnoreSelectors: s} = this.getOptions()
          , o = r ? {
            threshold: Math.min(yv, r),
            timeout: r,
            scrollTimeout: Sv,
            ignoreSelector: s ? s.join(",") : ""
        } : void 0;
        if (o && (this.clickDetector = new W0(this,o)),
        $) {
            const i = t._experiments;
            B.setConfig({
                captureExceptions: !!i.captureExceptions,
                traceInternals: !!i.traceInternals
            })
        }
        this._handleVisibilityChange = () => {
            ue.document.visibilityState === "visible" ? this._doChangeToForegroundTasks() : this._doChangeToBackgroundTasks()
        }
        ,
        this._handleWindowBlur = () => {
            const i = tt({
                category: "ui.blur"
            });
            this._doChangeToBackgroundTasks(i)
        }
        ,
        this._handleWindowFocus = () => {
            const i = tt({
                category: "ui.focus"
            });
            this._doChangeToForegroundTasks(i)
        }
        ,
        this._handleKeyboardEvent = i => {
            tw(this, i)
        }
    }
    getContext() {
        return this._context
    }
    isEnabled() {
        return this._isEnabled
    }
    isPaused() {
        return this._isPaused
    }
    isRecordingCanvas() {
        return !!this._canvas
    }
    getOptions() {
        return this._options
    }
    handleException(t) {
        $ && B.exception(t),
        this._options.onError && this._options.onError(t)
    }
    initializeSampling(t) {
        const {errorSampleRate: n, sessionSampleRate: r} = this._options
          , s = n <= 0 && r <= 0;
        if (this._requiresManualStart = s,
        !s) {
            if (this._initializeSessionForSampling(t),
            !this.session) {
                $ && B.exception(new Error("Unable to initialize and create session"));
                return
            }
            this.session.sampled !== !1 && (this.recordingMode = this.session.sampled === "buffer" && this.session.segmentId === 0 ? "buffer" : "session",
            $ && B.infoTick(`Starting replay in ${this.recordingMode} mode`),
            this._initializeRecording())
        }
    }
    start() {
        if (this._isEnabled && this.recordingMode === "session") {
            $ && B.info("Recording is already in progress");
            return
        }
        if (this._isEnabled && this.recordingMode === "buffer") {
            $ && B.info("Buffering is in progress, call `flush()` to save the replay");
            return
        }
        $ && B.infoTick("Starting replay in session mode"),
        this._updateUserActivity();
        const t = zo({
            maxReplayDuration: this._options.maxReplayDuration,
            sessionIdleExpire: this.timeouts.sessionIdleExpire
        }, {
            stickySession: this._options.stickySession,
            sessionSampleRate: 1,
            allowBuffering: !1
        });
        this.session = t,
        this._initializeRecording()
    }
    startBuffering() {
        if (this._isEnabled) {
            $ && B.info("Buffering is in progress, call `flush()` to save the replay");
            return
        }
        $ && B.infoTick("Starting replay in buffer mode");
        const t = zo({
            sessionIdleExpire: this.timeouts.sessionIdleExpire,
            maxReplayDuration: this._options.maxReplayDuration
        }, {
            stickySession: this._options.stickySession,
            sessionSampleRate: 0,
            allowBuffering: !0
        });
        this.session = t,
        this.recordingMode = "buffer",
        this._initializeRecording()
    }
    startRecording() {
        try {
            const t = this._canvas;
            this._stopRecording = ht({
                ...this._recordingOptions,
                ...this.recordingMode === "buffer" ? {
                    checkoutEveryNms: mv
                } : this._options._experiments.continuousCheckout && {
                    checkoutEveryNms: Math.max(36e4, this._options._experiments.continuousCheckout)
                },
                emit: CT(this),
                ...kT(),
                onMutation: this._onMutationHandler.bind(this),
                ...t ? {
                    recordCanvas: t.recordCanvas,
                    getCanvasManager: t.getCanvasManager,
                    sampling: t.sampling,
                    dataURLOptions: t.dataURLOptions
                } : {}
            })
        } catch (t) {
            this.handleException(t)
        }
    }
    stopRecording() {
        try {
            return this._stopRecording && (this._stopRecording(),
            this._stopRecording = void 0),
            !0
        } catch (t) {
            return this.handleException(t),
            !1
        }
    }
    async stop({forceFlush: t=!1, reason: n}={}) {
        var r;
        if (this._isEnabled) {
            this._isEnabled = !1;
            try {
                $ && B.info(`Stopping Replay${n ? ` triggered by ${n}` : ""}`),
                Lf(),
                this._removeListeners(),
                this.stopRecording(),
                this._debouncedFlush.cancel(),
                t && await this._flush({
                    force: !0
                }),
                (r = this.eventBuffer) == null || r.destroy(),
                this.eventBuffer = null,
                Iw(this)
            } catch (s) {
                this.handleException(s)
            }
        }
    }
    pause() {
        this._isPaused || (this._isPaused = !0,
        this.stopRecording(),
        $ && B.info("Pausing replay"))
    }
    resume() {
        !this._isPaused || !this._checkSession() || (this._isPaused = !1,
        this.startRecording(),
        $ && B.info("Resuming replay"))
    }
    async sendBufferedReplayOrFlush({continueRecording: t=!0}={}) {
        if (this.recordingMode === "session")
            return this.flushImmediate();
        const n = Date.now();
        $ && B.info("Converting buffer to session"),
        await this.flushImmediate();
        const r = this.stopRecording();
        !t || !r || this.recordingMode !== "session" && (this.recordingMode = "session",
        this.session && (this._updateUserActivity(n),
        this._updateSessionActivity(n),
        this._maybeSaveSession()),
        this.startRecording())
    }
    addUpdate(t) {
        const n = t();
        this.recordingMode !== "buffer" && n !== !0 && this._debouncedFlush()
    }
    triggerUserActivity() {
        if (this._updateUserActivity(),
        !this._stopRecording) {
            if (!this._checkSession())
                return;
            this.resume();
            return
        }
        this.checkAndHandleExpiredSession(),
        this._updateSessionActivity()
    }
    updateUserActivity() {
        this._updateUserActivity(),
        this._updateSessionActivity()
    }
    conditionalFlush() {
        return this.recordingMode === "buffer" ? Promise.resolve() : this.flushImmediate()
    }
    flush() {
        return this._debouncedFlush()
    }
    flushImmediate() {
        return this._debouncedFlush(),
        this._debouncedFlush.flush()
    }
    cancelFlush() {
        this._debouncedFlush.cancel()
    }
    getSessionId() {
        var t;
        return (t = this.session) == null ? void 0 : t.id
    }
    checkAndHandleExpiredSession() {
        if (this._lastActivity && Ri(this._lastActivity, this.timeouts.sessionIdlePause) && this.session && this.session.sampled === "session") {
            this.pause();
            return
        }
        return !!this._checkSession()
    }
    setInitialState() {
        const t = `${ue.location.pathname}${ue.location.hash}${ue.location.search}`
          , n = `${ue.location.origin}${t}`;
        this.performanceEntries = [],
        this.replayPerformanceEntries = [],
        this._clearContext(),
        this._context.initialUrl = n,
        this._context.initialTimestamp = Date.now(),
        this._context.urls.push(n)
    }
    throttledAddEvent(t, n) {
        const r = this._throttledAddEvent(t, n);
        if (r === Hf) {
            const s = tt({
                category: "replay.throttled"
            });
            this.addUpdate( () => !Ia(this, {
                type: P0,
                timestamp: s.timestamp || 0,
                data: {
                    tag: "breadcrumb",
                    payload: s,
                    metric: !0
                }
            }))
        }
        return r
    }
    getCurrentRoute() {
        const t = this.lastActiveSpan || ge()
          , n = t && ye(t)
          , s = (n && z(n).data || {})[de];
        if (!(!n || !s || !["route", "custom"].includes(s)))
            return z(n).description
    }
    _initializeRecording() {
        this.setInitialState(),
        this._updateSessionActivity(),
        this.eventBuffer = vw({
            useCompression: this._options.useCompression,
            workerUrl: this._options.workerUrl
        }),
        this._removeListeners(),
        this._addListeners(),
        this._isEnabled = !0,
        this._isPaused = !1,
        this.startRecording()
    }
    _initializeSessionForSampling(t) {
        const n = this._options.errorSampleRate > 0
          , r = zo({
            sessionIdleExpire: this.timeouts.sessionIdleExpire,
            maxReplayDuration: this._options.maxReplayDuration,
            previousSessionId: t
        }, {
            stickySession: this._options.stickySession,
            sessionSampleRate: this._options.sessionSampleRate,
            allowBuffering: n
        });
        this.session = r
    }
    _checkSession() {
        if (!this.session)
            return !1;
        const t = this.session;
        return Mf(t, {
            sessionIdleExpire: this.timeouts.sessionIdleExpire,
            maxReplayDuration: this._options.maxReplayDuration
        }) ? (this._refreshSession(t),
        !1) : !0
    }
    async _refreshSession(t) {
        this._isEnabled && (await this.stop({
            reason: "refresh session"
        }),
        this.initializeSampling(t.id))
    }
    _addListeners() {
        try {
            ue.document.addEventListener("visibilitychange", this._handleVisibilityChange),
            ue.addEventListener("blur", this._handleWindowBlur),
            ue.addEventListener("focus", this._handleWindowFocus),
            ue.addEventListener("keydown", this._handleKeyboardEvent),
            this.clickDetector && this.clickDetector.addListeners(),
            this._hasInitializedCoreListeners || (vT(this, {
                autoFlushOnFeedback: this._options._experiments.autoFlushOnFeedback
            }),
            this._hasInitializedCoreListeners = !0)
        } catch (t) {
            this.handleException(t)
        }
        this._performanceCleanupCallback = mw(this)
    }
    _removeListeners() {
        try {
            ue.document.removeEventListener("visibilitychange", this._handleVisibilityChange),
            ue.removeEventListener("blur", this._handleWindowBlur),
            ue.removeEventListener("focus", this._handleWindowFocus),
            ue.removeEventListener("keydown", this._handleKeyboardEvent),
            this.clickDetector && this.clickDetector.removeListeners(),
            this._performanceCleanupCallback && this._performanceCleanupCallback()
        } catch (t) {
            this.handleException(t)
        }
    }
    _doChangeToBackgroundTasks(t) {
        !this.session || xf(this.session, {
            maxReplayDuration: this._options.maxReplayDuration,
            sessionIdleExpire: this.timeouts.sessionIdleExpire
        }) || (t && this._createCustomBreadcrumb(t),
        this.conditionalFlush())
    }
    _doChangeToForegroundTasks(t) {
        if (!this.session)
            return;
        if (!this.checkAndHandleExpiredSession()) {
            $ && B.info("Document has become active, but session has expired");
            return
        }
        t && this._createCustomBreadcrumb(t)
    }
    _updateUserActivity(t=Date.now()) {
        this._lastActivity = t
    }
    _updateSessionActivity(t=Date.now()) {
        this.session && (this.session.lastActivity = t,
        this._maybeSaveSession())
    }
    _createCustomBreadcrumb(t) {
        this.addUpdate( () => {
            this.throttledAddEvent({
                type: q.Custom,
                timestamp: t.timestamp || 0,
                data: {
                    tag: "breadcrumb",
                    payload: t
                }
            })
        }
        )
    }
    _addPerformanceEntries() {
        let t = ow(this.performanceEntries).concat(this.replayPerformanceEntries);
        if (this.performanceEntries = [],
        this.replayPerformanceEntries = [],
        this._requiresManualStart) {
            const n = this._context.initialTimestamp / 1e3;
            t = t.filter(r => r.start >= n)
        }
        return Promise.all(co(this, t))
    }
    _clearContext() {
        this._context.errorIds.clear(),
        this._context.traceIds.clear(),
        this._context.urls = []
    }
    _updateInitialTimestampFromEventBuffer() {
        const {session: t, eventBuffer: n} = this;
        if (!t || !n || this._requiresManualStart || t.segmentId)
            return;
        const r = n.getEarliestTimestamp();
        r && r < this._context.initialTimestamp && (this._context.initialTimestamp = r)
    }
    _popEventContext() {
        const t = {
            initialTimestamp: this._context.initialTimestamp,
            initialUrl: this._context.initialUrl,
            errorIds: Array.from(this._context.errorIds),
            traceIds: Array.from(this._context.traceIds),
            urls: this._context.urls
        };
        return this._clearContext(),
        t
    }
    async _runFlush() {
        var n;
        const t = this.getSessionId();
        if (!this.session || !this.eventBuffer || !t) {
            $ && B.error("No session or eventBuffer found to flush.");
            return
        }
        if (await this._addPerformanceEntries(),
        !!((n = this.eventBuffer) != null && n.hasEvents) && (await wT(this),
        !!this.eventBuffer && t === this.getSessionId()))
            try {
                this._updateInitialTimestampFromEventBuffer();
                const r = Date.now();
                if (r - this._context.initialTimestamp > this._options.maxReplayDuration + 3e4)
                    throw new Error("Session is too long, not sending replay");
                const s = this._popEventContext()
                  , o = this.session.segmentId++;
                this._maybeSaveSession();
                const i = await this.eventBuffer.finish();
                await Uf({
                    replayId: t,
                    recordingData: i,
                    segmentId: o,
                    eventContext: s,
                    session: this.session,
                    timestamp: r,
                    onError: a => this.handleException(a)
                })
            } catch (r) {
                this.handleException(r),
                this.stop({
                    reason: "sendReplay"
                });
                const s = M();
                if (s) {
                    const o = r instanceof Ca ? "ratelimit_backoff" : "send_error";
                    s.recordDroppedEvent(o, "replay")
                }
            }
    }
    async _flush({force: t=!1}={}) {
        if (!this._isEnabled && !t)
            return;
        if (!this.checkAndHandleExpiredSession()) {
            $ && B.error("Attempting to finish replay event after session expired.");
            return
        }
        if (!this.session)
            return;
        const n = this.session.started
          , s = Date.now() - n;
        this._debouncedFlush.cancel();
        const o = s < this._options.minReplayDuration
          , i = s > this._options.maxReplayDuration + 5e3;
        if (o || i) {
            $ && B.info(`Session duration (${Math.floor(s / 1e3)}s) is too ${o ? "short" : "long"}, not sending replay.`),
            o && this._debouncedFlush();
            return
        }
        const a = this.eventBuffer;
        a && this.session.segmentId === 0 && !a.hasCheckout && $ && B.info("Flushing initial segment without checkout.");
        const c = !!this._flushLock;
        this._flushLock || (this._flushLock = this._runFlush());
        try {
            await this._flushLock
        } catch (u) {
            this.handleException(u)
        } finally {
            this._flushLock = void 0,
            c && this._debouncedFlush()
        }
    }
    _maybeSaveSession() {
        this.session && this._options.stickySession && Ta(this.session)
    }
    _onMutationHandler(t) {
        const n = t.length
          , r = this._options.mutationLimit
          , s = this._options.mutationBreadcrumbLimit
          , o = r && n > r;
        if (n > s || o) {
            const i = tt({
                category: "replay.mutations",
                data: {
                    count: n,
                    limit: o
                }
            });
            this._createCustomBreadcrumb(i)
        }
        return o ? (this.stop({
            reason: "mutationLimit",
            forceFlush: this.recordingMode === "session"
        }),
        !1) : !0
    }
}
function Qn(e, t) {
    return [...e, ...t].join(",")
}
function FT({mask: e, unmask: t, block: n, unblock: r, ignore: s}) {
    const o = ["base", "iframe[srcdoc]:not([src])"]
      , i = Qn(e, [".sentry-mask", "[data-sentry-mask]"])
      , a = Qn(t, []);
    return {
        maskTextSelector: i,
        unmaskTextSelector: a,
        blockSelector: Qn(n, [".sentry-block", "[data-sentry-block]", ...o]),
        unblockSelector: Qn(r, []),
        ignoreSelector: Qn(s, [".sentry-ignore", "[data-sentry-ignore]", 'input[type="file"]'])
    }
}
function $T({el: e, key: t, maskAttributes: n, maskAllText: r, privacyOptions: s, value: o}) {
    return !r || s.unmaskTextSelector && e.matches(s.unmaskTextSelector) ? o : n.includes(t) || t === "value" && e.tagName === "INPUT" && ["submit", "button"].includes(e.getAttribute("type") || "") ? o.replace(/[\S]/g, "*") : o
}
const yu = 'img,image,svg,video,object,picture,embed,map,audio,link[rel="icon"],link[rel="apple-touch-icon"]'
  , BT = ["content-length", "content-type", "accept"];
let Su = !1;
const lk = e => new UT(e);
class UT {
    constructor({flushMinDelay: t=pv, flushMaxDelay: n=hv, minReplayDuration: r=bv, maxReplayDuration: s=Jc, stickySession: o=!0, useCompression: i=!0, workerUrl: a, _experiments: c={}, maskAllText: u=!0, maskAllInputs: d=!0, blockAllMedia: l=!0, mutationBreadcrumbLimit: f=750, mutationLimit: p=1e4, slowClickTimeout: h=7e3, slowClickIgnoreSelectors: m=[], networkDetailAllowUrls: _=[], networkDetailDenyUrls: g=[], networkCaptureBodies: b=!0, networkRequestHeaders: T=[], networkResponseHeaders: C=[], mask: S=[], maskAttributes: E=["title", "placeholder", "aria-label"], unmask: k=[], block: N=[], unblock: w=[], ignore: I=[], maskFn: F, beforeAddRecordingEvent: v, beforeErrorSampling: R, onError: A}={}) {
        this.name = "Replay";
        const U = FT({
            mask: S,
            unmask: k,
            block: N,
            unblock: w,
            ignore: I
        });
        if (this._recordingOptions = {
            maskAllInputs: d,
            maskAllText: u,
            maskInputOptions: {
                password: !0
            },
            maskTextFn: F,
            maskInputFn: F,
            maskAttributeFn: (O, X, D) => $T({
                maskAttributes: E,
                maskAllText: u,
                privacyOptions: U,
                key: O,
                value: X,
                el: D
            }),
            ...U,
            slimDOMOptions: "all",
            inlineStylesheet: !0,
            inlineImages: !1,
            collectFonts: !0,
            errorHandler: O => {
                try {
                    O.__rrweb__ = !0
                } catch {}
            }
            ,
            recordCrossOriginIframes: !!c.recordCrossOriginIframes
        },
        this._initialOptions = {
            flushMinDelay: t,
            flushMaxDelay: n,
            minReplayDuration: Math.min(r, Ev),
            maxReplayDuration: Math.min(s, Jc),
            stickySession: o,
            useCompression: i,
            workerUrl: a,
            blockAllMedia: l,
            maskAllInputs: d,
            maskAllText: u,
            mutationBreadcrumbLimit: f,
            mutationLimit: p,
            slowClickTimeout: h,
            slowClickIgnoreSelectors: m,
            networkDetailAllowUrls: _,
            networkDetailDenyUrls: g,
            networkCaptureBodies: b,
            networkRequestHeaders: bu(T),
            networkResponseHeaders: bu(C),
            beforeAddRecordingEvent: v,
            beforeErrorSampling: R,
            onError: A,
            _experiments: c
        },
        this._initialOptions.blockAllMedia && (this._recordingOptions.blockSelector = this._recordingOptions.blockSelector ? `${this._recordingOptions.blockSelector},${yu}` : yu),
        this._isInitialized && li())
            throw new Error("Multiple Sentry Session Replay instances are not supported");
        this._isInitialized = !0
    }
    get _isInitialized() {
        return Su
    }
    set _isInitialized(t) {
        Su = t
    }
    afterAllSetup(t) {
        !li() || this._replay || (this._setup(t),
        this._initialize(t))
    }
    start() {
        this._replay && this._replay.start()
    }
    startBuffering() {
        this._replay && this._replay.startBuffering()
    }
    stop() {
        return this._replay ? this._replay.stop({
            forceFlush: this._replay.recordingMode === "session"
        }) : Promise.resolve()
    }
    flush(t) {
        return this._replay ? this._replay.isEnabled() ? this._replay.sendBufferedReplayOrFlush(t) : (this._replay.start(),
        Promise.resolve()) : Promise.resolve()
    }
    getReplayId() {
        var t;
        if ((t = this._replay) != null && t.isEnabled())
            return this._replay.getSessionId()
    }
    getRecordingMode() {
        var t;
        if ((t = this._replay) != null && t.isEnabled())
            return this._replay.recordingMode
    }
    _initialize(t) {
        this._replay && (this._maybeLoadFromReplayCanvasIntegration(t),
        this._replay.initializeSampling())
    }
    _setup(t) {
        const n = HT(this._initialOptions, t);
        this._replay = new DT({
            options: n,
            recordingOptions: this._recordingOptions
        })
    }
    _maybeLoadFromReplayCanvasIntegration(t) {
        try {
            const n = t.getIntegrationByName("ReplayCanvas");
            if (!n)
                return;
            this._replay._canvas = n.getOptions()
        } catch {}
    }
}
function HT(e, t) {
    const n = t.getOptions()
      , r = {
        sessionSampleRate: 0,
        errorSampleRate: 0,
        ...e
    }
      , s = Qt(n.replaysSessionSampleRate)
      , o = Qt(n.replaysOnErrorSampleRate);
    return s == null && o == null && nn( () => {
        console.warn("Replay is disabled because neither `replaysSessionSampleRate` nor `replaysOnErrorSampleRate` are set.")
    }
    ),
    s != null && (r.sessionSampleRate = s),
    o != null && (r.errorSampleRate = o),
    r
}
function bu(e) {
    return [...BT, ...e.map(t => t.toLowerCase())]
}
function dk() {
    const e = M();
    return e == null ? void 0 : e.getIntegrationByName("Replay")
}
var WT = Object.defineProperty
  , zT = (e, t, n) => t in e ? WT(e, t, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: n
}) : e[t] = n
  , Eu = (e, t, n) => zT(e, typeof t != "symbol" ? t + "" : t, n);
class jT {
    constructor() {
        Eu(this, "idNodeMap", new Map),
        Eu(this, "nodeMetaMap", new WeakMap)
    }
    getId(t) {
        var r;
        return t ? ((r = this.getMeta(t)) == null ? void 0 : r.id) ?? -1 : -1
    }
    getNode(t) {
        return this.idNodeMap.get(t) || null
    }
    getIds() {
        return Array.from(this.idNodeMap.keys())
    }
    getMeta(t) {
        return this.nodeMetaMap.get(t) || null
    }
    removeNodeFromMap(t) {
        const n = this.getId(t);
        this.idNodeMap.delete(n),
        t.childNodes && t.childNodes.forEach(r => this.removeNodeFromMap(r))
    }
    has(t) {
        return this.idNodeMap.has(t)
    }
    hasNode(t) {
        return this.nodeMetaMap.has(t)
    }
    add(t, n) {
        const r = n.id;
        this.idNodeMap.set(r, t),
        this.nodeMetaMap.set(t, n)
    }
    replace(t, n) {
        const r = this.getNode(t);
        if (r) {
            const s = this.nodeMetaMap.get(r);
            s && this.nodeMetaMap.set(n, s)
        }
        this.idNodeMap.set(t, n)
    }
    reset() {
        this.idNodeMap = new Map,
        this.nodeMetaMap = new WeakMap
    }
}
function qT() {
    return new jT
}
function GT(e, t) {
    for (let n = e.classList.length; n--; ) {
        const r = e.classList[n];
        if (t.test(r))
            return !0
    }
    return !1
}
function Ai(e, t, n=1 / 0, r=0) {
    return !e || e.nodeType !== e.ELEMENT_NODE || r > n ? -1 : t(e) ? r : Ai(e.parentNode, t, n, r + 1)
}
function vu(e, t) {
    return n => {
        const r = n;
        if (r === null)
            return !1;
        try {
            if (e) {
                if (typeof e == "string") {
                    if (r.matches(`.${e}`))
                        return !0
                } else if (GT(r, e))
                    return !0
            }
            return !!(t && r.matches(t))
        } catch {
            return !1
        }
    }
}
const gn = `Please stop import mirror directly. Instead of that,\r
now you can use replayer.getMirror() to access the mirror instance of a replayer,\r
or you can use record.mirror to access the mirror instance during recording.`;
let wu = {
    map: {},
    getId() {
        return console.error(gn),
        -1
    },
    getNode() {
        return console.error(gn),
        null
    },
    removeNodeFromMap() {
        console.error(gn)
    },
    has() {
        return console.error(gn),
        !1
    },
    reset() {
        console.error(gn)
    }
};
typeof window < "u" && window.Proxy && window.Reflect && (wu = new Proxy(wu,{
    get(e, t, n) {
        return t === "map" && console.error(gn),
        Reflect.get(e, t, n)
    }
}));
function Ra(e, t, n, r, s=window) {
    const o = s.Object.getOwnPropertyDescriptor(e, t);
    return s.Object.defineProperty(e, t, r ? n : {
        set(i) {
            zf( () => {
                n.set.call(this, i)
            }
            , 0),
            o && o.set && o.set.call(this, i)
        }
    }),
    () => Ra(e, t, o || {}, !0)
}
function xa(e, t, n) {
    try {
        if (!(t in e))
            return () => {}
            ;
        const r = e[t]
          , s = n(r);
        return typeof s == "function" && (s.prototype = s.prototype || {},
        Object.defineProperties(s, {
            __rrweb_original__: {
                enumerable: !1,
                value: r
            }
        })),
        e[t] = s,
        () => {
            e[t] = r
        }
    } catch {
        return () => {}
    }
}
Date.now().toString();
function VT(e) {
    if (!e)
        return null;
    try {
        return e.nodeType === e.ELEMENT_NODE ? e : e.parentElement
    } catch {
        return null
    }
}
function lo(e, t, n, r, s) {
    if (!e)
        return !1;
    const o = VT(e);
    if (!o)
        return !1;
    const i = vu(t, n)
      , a = Ai(o, i);
    let c = -1;
    return a < 0 ? !1 : (r && (c = Ai(o, vu(null, r))),
    a > -1 && c < 0 ? !0 : a < c)
}
const Tu = {};
function Wf(e) {
    const t = Tu[e];
    if (t)
        return t;
    const n = window.document;
    let r = window[e];
    if (n && typeof n.createElement == "function")
        try {
            const s = n.createElement("iframe");
            s.hidden = !0,
            n.head.appendChild(s);
            const o = s.contentWindow;
            o && o[e] && (r = o[e]),
            n.head.removeChild(s)
        } catch {}
    return Tu[e] = r.bind(window)
}
function Wt(...e) {
    return Wf("requestAnimationFrame")(...e)
}
function zf(...e) {
    return Wf("setTimeout")(...e)
}
var zn = (e => (e[e["2D"] = 0] = "2D",
e[e.WebGL = 1] = "WebGL",
e[e.WebGL2 = 2] = "WebGL2",
e))(zn || {});
let gs;
function YT(e) {
    gs = e
}
const jo = e => gs ? (...n) => {
    try {
        return e(...n)
    } catch (r) {
        if (gs && gs(r) === !0)
            return () => {}
            ;
        throw r
    }
}
: e;
var vn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  , XT = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var es = 0; es < vn.length; es++)
    XT[vn.charCodeAt(es)] = es;
var KT = function(e) {
    var t = new Uint8Array(e), n, r = t.length, s = "";
    for (n = 0; n < r; n += 3)
        s += vn[t[n] >> 2],
        s += vn[(t[n] & 3) << 4 | t[n + 1] >> 4],
        s += vn[(t[n + 1] & 15) << 2 | t[n + 2] >> 6],
        s += vn[t[n + 2] & 63];
    return r % 3 === 2 ? s = s.substring(0, s.length - 1) + "=" : r % 3 === 1 && (s = s.substring(0, s.length - 2) + "=="),
    s
};
const Iu = new Map;
function JT(e, t) {
    let n = Iu.get(e);
    return n || (n = new Map,
    Iu.set(e, n)),
    n.has(t) || n.set(t, []),
    n.get(t)
}
const jf = (e, t, n) => {
    if (!e || !(Gf(e, t) || typeof e == "object"))
        return;
    const r = e.constructor.name
      , s = JT(n, r);
    let o = s.indexOf(e);
    return o === -1 && (o = s.length,
    s.push(e)),
    o
}
;
function _s(e, t, n) {
    if (e instanceof Array)
        return e.map(r => _s(r, t, n));
    if (e === null)
        return e;
    if (e instanceof Float32Array || e instanceof Float64Array || e instanceof Int32Array || e instanceof Uint32Array || e instanceof Uint8Array || e instanceof Uint16Array || e instanceof Int16Array || e instanceof Int8Array || e instanceof Uint8ClampedArray)
        return {
            rr_type: e.constructor.name,
            args: [Object.values(e)]
        };
    if (e instanceof ArrayBuffer) {
        const r = e.constructor.name
          , s = KT(e);
        return {
            rr_type: r,
            base64: s
        }
    } else {
        if (e instanceof DataView)
            return {
                rr_type: e.constructor.name,
                args: [_s(e.buffer, t, n), e.byteOffset, e.byteLength]
            };
        if (e instanceof HTMLImageElement) {
            const r = e.constructor.name
              , {src: s} = e;
            return {
                rr_type: r,
                src: s
            }
        } else if (e instanceof HTMLCanvasElement) {
            const r = "HTMLImageElement"
              , s = e.toDataURL();
            return {
                rr_type: r,
                src: s
            }
        } else {
            if (e instanceof ImageData)
                return {
                    rr_type: e.constructor.name,
                    args: [_s(e.data, t, n), e.width, e.height]
                };
            if (Gf(e, t) || typeof e == "object") {
                const r = e.constructor.name
                  , s = jf(e, t, n);
                return {
                    rr_type: r,
                    index: s
                }
            }
        }
    }
    return e
}
const qf = (e, t, n) => e.map(r => _s(r, t, n))
  , Gf = (e, t) => !!["WebGLActiveInfo", "WebGLBuffer", "WebGLFramebuffer", "WebGLProgram", "WebGLRenderbuffer", "WebGLShader", "WebGLShaderPrecisionFormat", "WebGLTexture", "WebGLUniformLocation", "WebGLVertexArrayObject", "WebGLVertexArrayObjectOES"].filter(s => typeof t[s] == "function").find(s => e instanceof t[s]);
function ZT(e, t, n, r, s) {
    const o = []
      , i = Object.getOwnPropertyNames(t.CanvasRenderingContext2D.prototype);
    for (const a of i)
        try {
            if (typeof t.CanvasRenderingContext2D.prototype[a] != "function")
                continue;
            const c = xa(t.CanvasRenderingContext2D.prototype, a, function(u) {
                return function(...d) {
                    return lo(this.canvas, n, r, s, !0) || zf( () => {
                        const l = qf(d, t, this);
                        e(this.canvas, {
                            type: zn["2D"],
                            property: a,
                            args: l
                        })
                    }
                    , 0),
                    u.apply(this, d)
                }
            });
            o.push(c)
        } catch {
            const c = Ra(t.CanvasRenderingContext2D.prototype, a, {
                set(u) {
                    e(this.canvas, {
                        type: zn["2D"],
                        property: a,
                        args: [u],
                        setter: !0
                    })
                }
            });
            o.push(c)
        }
    return () => {
        o.forEach(a => a())
    }
}
function QT(e) {
    return e === "experimental-webgl" ? "webgl" : e
}
function ku(e, t, n, r, s) {
    const o = [];
    try {
        const i = xa(e.HTMLCanvasElement.prototype, "getContext", function(a) {
            return function(c, ...u) {
                if (!lo(this, t, n, r, !0)) {
                    const d = QT(c);
                    if ("__context"in this || (this.__context = d),
                    s && ["webgl", "webgl2"].includes(d))
                        if (u[0] && typeof u[0] == "object") {
                            const l = u[0];
                            l.preserveDrawingBuffer || (l.preserveDrawingBuffer = !0)
                        } else
                            u.splice(0, 1, {
                                preserveDrawingBuffer: !0
                            })
                }
                return a.apply(this, [c, ...u])
            }
        });
        o.push(i)
    } catch {
        console.error("failed to patch HTMLCanvasElement.prototype.getContext")
    }
    return () => {
        o.forEach(i => i())
    }
}
function Cu(e, t, n, r, s, o, i, a) {
    const c = []
      , u = Object.getOwnPropertyNames(e);
    for (const d of u)
        if (!["isContextLost", "canvas", "drawingBufferWidth", "drawingBufferHeight"].includes(d))
            try {
                if (typeof e[d] != "function")
                    continue;
                const l = xa(e, d, function(f) {
                    return function(...p) {
                        const h = f.apply(this, p);
                        if (jf(h, a, this),
                        "tagName"in this.canvas && !lo(this.canvas, r, s, o, !0)) {
                            const m = qf(p, a, this)
                              , _ = {
                                type: t,
                                property: d,
                                args: m
                            };
                            n(this.canvas, _)
                        }
                        return h
                    }
                });
                c.push(l)
            } catch {
                const l = Ra(e, d, {
                    set(f) {
                        n(this.canvas, {
                            type: t,
                            property: d,
                            args: [f],
                            setter: !0
                        })
                    }
                });
                c.push(l)
            }
    return c
}
function eI(e, t, n, r, s, o) {
    const i = [];
    return i.push(...Cu(t.WebGLRenderingContext.prototype, zn.WebGL, e, n, r, s, o, t)),
    typeof t.WebGL2RenderingContext < "u" && i.push(...Cu(t.WebGL2RenderingContext.prototype, zn.WebGL2, e, n, r, s, o, t)),
    () => {
        i.forEach(a => a())
    }
}
const tI = 'for(var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t="undefined"==typeof Uint8Array?[]:new Uint8Array(256),a=0;a<64;a++)t[e.charCodeAt(a)]=a;var n=function(t){var a,n=new Uint8Array(t),r=n.length,s="";for(a=0;a<r;a+=3)s+=e[n[a]>>2],s+=e[(3&n[a])<<4|n[a+1]>>4],s+=e[(15&n[a+1])<<2|n[a+2]>>6],s+=e[63&n[a+2]];return r%3==2?s=s.substring(0,s.length-1)+"=":r%3==1&&(s=s.substring(0,s.length-2)+"=="),s};const r=new Map,s=new Map;const i=self;i.onmessage=async function(e){if(!("OffscreenCanvas"in globalThis))return i.postMessage({id:e.data.id});{const{id:t,bitmap:a,width:o,height:f,maxCanvasSize:c,dataURLOptions:g}=e.data,u=async function(e,t,a){const r=e+"-"+t;if("OffscreenCanvas"in globalThis){if(s.has(r))return s.get(r);const i=new OffscreenCanvas(e,t);i.getContext("2d");const o=await i.convertToBlob(a),f=await o.arrayBuffer(),c=n(f);return s.set(r,c),c}return""}(o,f,g),[h,d]=function(e,t,a){if(!a)return[e,t];const[n,r]=a;if(e<=n&&t<=r)return[e,t];let s=e,i=t;return s>n&&(i=Math.floor(n*t/e),s=n),i>r&&(s=Math.floor(r*e/t),i=r),[s,i]}(o,f,c),l=new OffscreenCanvas(h,d),w=l.getContext("bitmaprenderer"),p=h===o&&d===f?a:await createImageBitmap(a,{resizeWidth:h,resizeHeight:d,resizeQuality:"low"});w.transferFromImageBitmap(p),a.close();const y=await l.convertToBlob(g),v=y.type,b=await y.arrayBuffer(),m=n(b);if(p.close(),!r.has(t)&&await u===m)return r.set(t,m),i.postMessage({id:t});if(r.get(t)===m)return i.postMessage({id:t});i.postMessage({id:t,type:v,base64:m,width:o,height:f}),r.set(t,m)}};';
function nI() {
    const e = new Blob([tI]);
    return URL.createObjectURL(e)
}
class rI {
    constructor(t) {
        this.pendingCanvasMutations = new Map,
        this.rafStamps = {
            latestId: 0,
            invokeId: null
        },
        this.shadowDoms = new Set,
        this.windowsSet = new WeakSet,
        this.windows = [],
        this.restoreHandlers = [],
        this.frozen = !1,
        this.locked = !1,
        this.snapshotInProgressMap = new Map,
        this.worker = null,
        this.lastSnapshotTime = 0,
        this.processMutation = (l, f) => {
            (this.rafStamps.invokeId && this.rafStamps.latestId !== this.rafStamps.invokeId || !this.rafStamps.invokeId) && (this.rafStamps.invokeId = this.rafStamps.latestId),
            this.pendingCanvasMutations.has(l) || this.pendingCanvasMutations.set(l, []),
            this.pendingCanvasMutations.get(l).push(f)
        }
        ;
        const {sampling: n="all", win: r, blockClass: s, blockSelector: o, unblockSelector: i, maxCanvasSize: a, recordCanvas: c, dataURLOptions: u, errorHandler: d} = t;
        this.mutationCb = t.mutationCb,
        this.mirror = t.mirror,
        this.options = t,
        d && YT(d),
        (c && typeof n == "number" || t.enableManualSnapshot) && (this.worker = this.initFPSWorker()),
        this.addWindow(r),
        !t.enableManualSnapshot && jo( () => {
            c && n === "all" && (this.startRAFTimestamping(),
            this.startPendingCanvasMutationFlusher()),
            c && typeof n == "number" && this.initCanvasFPSObserver(n, s, o, i, a, {
                dataURLOptions: u
            })
        }
        )()
    }
    reset() {
        var t;
        this.pendingCanvasMutations.clear(),
        this.restoreHandlers.forEach(n => {
            try {
                n()
            } catch {}
        }
        ),
        this.restoreHandlers = [],
        this.windowsSet = new WeakSet,
        this.windows = [],
        this.shadowDoms = new Set,
        (t = this.worker) == null || t.terminate(),
        this.worker = null,
        this.snapshotInProgressMap = new Map
    }
    freeze() {
        this.frozen = !0
    }
    unfreeze() {
        this.frozen = !1
    }
    lock() {
        this.locked = !0
    }
    unlock() {
        this.locked = !1
    }
    addWindow(t) {
        const {sampling: n="all", blockClass: r, blockSelector: s, unblockSelector: o, recordCanvas: i, enableManualSnapshot: a} = this.options;
        if (!this.windowsSet.has(t)) {
            if (a) {
                this.windowsSet.add(t),
                this.windows.push(new WeakRef(t));
                return
            }
            jo( () => {
                if (i && n === "all" && this.initCanvasMutationObserver(t, r, s, o),
                i && typeof n == "number") {
                    const c = ku(t, r, s, o, !0);
                    this.restoreHandlers.push( () => {
                        c()
                    }
                    )
                }
            }
            )(),
            this.windowsSet.add(t),
            this.windows.push(new WeakRef(t))
        }
    }
    addShadowRoot(t) {
        this.shadowDoms.add(new WeakRef(t))
    }
    resetShadowRoots() {
        this.shadowDoms = new Set
    }
    initFPSWorker() {
        const t = new Worker(nI());
        return t.onmessage = n => {
            const r = n.data
              , {id: s} = r;
            if (this.snapshotInProgressMap.set(s, !1),
            !("base64"in r))
                return;
            const {base64: o, type: i, width: a, height: c} = r;
            this.mutationCb({
                id: s,
                type: zn["2D"],
                commands: [{
                    property: "clearRect",
                    args: [0, 0, a, c]
                }, {
                    property: "drawImage",
                    args: [{
                        rr_type: "ImageBitmap",
                        args: [{
                            rr_type: "Blob",
                            data: [{
                                rr_type: "ArrayBuffer",
                                base64: o
                            }],
                            type: i
                        }]
                    }, 0, 0, a, c]
                }]
            })
        }
        ,
        t
    }
    initCanvasFPSObserver(t, n, r, s, o, i) {
        const a = this.takeSnapshot(!1, t, n, r, s, o, i.dataURLOptions);
        this.restoreHandlers.push( () => {
            cancelAnimationFrame(a)
        }
        )
    }
    initCanvasMutationObserver(t, n, r, s) {
        const o = ku(t, n, r, s, !1)
          , i = ZT(this.processMutation.bind(this), t, n, r, s)
          , a = eI(this.processMutation.bind(this), t, n, r, s, this.mirror);
        this.restoreHandlers.push( () => {
            o(),
            i(),
            a()
        }
        )
    }
    snapshot(t) {
        const {options: n} = this
          , r = this.takeSnapshot(!0, n.sampling === "all" ? 2 : n.sampling || 2, n.blockClass, n.blockSelector, n.unblockSelector, n.maxCanvasSize, n.dataURLOptions, t);
        this.restoreHandlers.push( () => {
            cancelAnimationFrame(r)
        }
        )
    }
    takeSnapshot(t, n, r, s, o, i, a, c) {
        const u = 1e3 / n;
        let d;
        const l = p => {
            if (p)
                return [p];
            const h = []
              , m = _ => {
                _.querySelectorAll("canvas").forEach(g => {
                    lo(g, r, s, o) || h.push(g)
                }
                )
            }
            ;
            for (const _ of this.windows) {
                const g = _.deref();
                let b;
                try {
                    b = g && g.document
                } catch {}
                b && m(b)
            }
            for (const _ of this.shadowDoms) {
                const g = _.deref();
                g && m(g)
            }
            return h
        }
          , f = p => {
            if (this.windows.length) {
                if (this.lastSnapshotTime && p - this.lastSnapshotTime < u) {
                    d = Wt(f);
                    return
                }
                this.lastSnapshotTime = p,
                l(c).forEach(h => {
                    var _;
                    if (!this.mirror.hasNode(h))
                        return;
                    const m = this.mirror.getId(h);
                    if (!this.snapshotInProgressMap.get(m) && !(!h.width || !h.height)) {
                        if (this.snapshotInProgressMap.set(m, !0),
                        !t && ["webgl", "webgl2"].includes(h.__context)) {
                            const g = h.getContext(h.__context);
                            ((_ = g == null ? void 0 : g.getContextAttributes()) == null ? void 0 : _.preserveDrawingBuffer) === !1 && g.clear(g.COLOR_BUFFER_BIT)
                        }
                        createImageBitmap(h).then(g => {
                            var b;
                            (b = this.worker) == null || b.postMessage({
                                id: m,
                                bitmap: g,
                                width: h.width,
                                height: h.height,
                                dataURLOptions: a,
                                maxCanvasSize: i
                            }, [g])
                        }
                        ).catch(g => {
                            jo( () => {
                                throw g
                            }
                            )()
                        }
                        )
                    }
                }
                ),
                t || (d = Wt(f))
            }
        }
        ;
        return d = Wt(f),
        d
    }
    startPendingCanvasMutationFlusher() {
        Wt( () => this.flushPendingCanvasMutations())
    }
    startRAFTimestamping() {
        const t = n => {
            this.rafStamps.latestId = n,
            Wt(t)
        }
        ;
        Wt(t)
    }
    flushPendingCanvasMutations() {
        this.pendingCanvasMutations.forEach( (t, n) => {
            const r = this.mirror.getId(n);
            this.flushPendingCanvasMutationFor(n, r)
        }
        ),
        Wt( () => this.flushPendingCanvasMutations())
    }
    flushPendingCanvasMutationFor(t, n) {
        if (this.frozen || this.locked)
            return;
        const r = this.pendingCanvasMutations.get(t);
        if (!r || n === -1)
            return;
        const s = r.map(i => {
            const {type: a, ...c} = i;
            return c
        }
        )
          , {type: o} = r[0];
        this.mutationCb({
            id: n,
            type: o,
            commands: s
        }),
        this.pendingCanvasMutations.delete(t)
    }
}
var Gu;
try {
    if (Array.from([1], e => e * 2)[0] !== 2) {
        const e = document.createElement("iframe");
        document.body.appendChild(e),
        Array.from = ((Gu = e.contentWindow) == null ? void 0 : Gu.Array.from) || Array.from,
        document.body.removeChild(e)
    }
} catch (e) {
    console.debug("Unable to override Array.from", e)
}
qT();
var Ru;
(function(e) {
    e[e.NotStarted = 0] = "NotStarted",
    e[e.Running = 1] = "Running",
    e[e.Stopped = 2] = "Stopped"
}
)(Ru || (Ru = {}));
const xu = {
    low: {
        sampling: {
            canvas: 1
        },
        dataURLOptions: {
            type: "image/webp",
            quality: .25
        }
    },
    medium: {
        sampling: {
            canvas: 2
        },
        dataURLOptions: {
            type: "image/webp",
            quality: .4
        }
    },
    high: {
        sampling: {
            canvas: 4
        },
        dataURLOptions: {
            type: "image/webp",
            quality: .5
        }
    }
}
  , sI = "ReplayCanvas"
  , ts = 1280
  , oI = (e={}) => {
    const [t,n] = e.maxCanvasSize || []
      , r = {
        quality: e.quality || "medium",
        enableManualSnapshot: e.enableManualSnapshot,
        maxCanvasSize: [t ? Math.min(t, ts) : ts, n ? Math.min(n, ts) : ts]
    };
    let s;
    const o = new Promise(i => s = i);
    return {
        name: sI,
        getOptions() {
            const {quality: i, enableManualSnapshot: a, maxCanvasSize: c} = r;
            return {
                enableManualSnapshot: a,
                recordCanvas: !0,
                getCanvasManager: u => {
                    const d = new rI({
                        ...u,
                        enableManualSnapshot: a,
                        maxCanvasSize: c,
                        errorHandler: l => {
                            try {
                                typeof l == "object" && (l.__rrweb__ = !0)
                            } catch {}
                        }
                    });
                    return s(d),
                    d
                }
                ,
                ...xu[i] || xu.medium
            }
        },
        async snapshot(i) {
            (await o).snapshot(i)
        }
    }
}
  , fk = oI
  , Mu = new WeakMap
  , qo = new Map
  , Vf = {
    traceFetch: !0,
    traceXHR: !0,
    enableHTTPTimings: !0,
    trackFetchStreamPerformance: !1
};
function iI(e, t) {
    const {traceFetch: n, traceXHR: r, trackFetchStreamPerformance: s, shouldCreateSpanForRequest: o, enableHTTPTimings: i, tracePropagationTargets: a, onRequestSpanStart: c} = {
        ...Vf,
        ...t
    }
      , u = typeof o == "function" ? o : f => !0
      , d = f => uI(f, a)
      , l = {};
    n && (e.addEventProcessor(f => (f.type === "transaction" && f.spans && f.spans.forEach(p => {
        if (p.op === "http.client") {
            const h = qo.get(p.span_id);
            h && (p.timestamp = h / 1e3,
            qo.delete(p.span_id))
        }
    }
    ),
    f)),
    s && C_(f => {
        if (f.response) {
            const p = Mu.get(f.response);
            p && f.endTimestamp && qo.set(p, f.endTimestamp)
        }
    }
    ),
    Xi(f => {
        const p = h_(f, u, d, l);
        if (f.response && f.fetchData.__span && Mu.set(f.response, f.fetchData.__span),
        p) {
            const h = Yf(f.fetchData.url)
              , m = h ? Kt(h).host : void 0;
            p.setAttributes({
                "http.url": h,
                "server.address": m
            }),
            i && Au(p),
            c == null || c(p, {
                headers: f.headers
            })
        }
    }
    )),
    r && la(f => {
        var h;
        const p = lI(f, u, d, l);
        if (p) {
            i && Au(p);
            let m;
            try {
                m = new Headers((h = f.xhr.__sentry_xhr_v3__) == null ? void 0 : h.request_headers)
            } catch {}
            c == null || c(p, {
                headers: m
            })
        }
    }
    )
}
function aI(e) {
    return e.entryType === "resource" && "initiatorType"in e && typeof e.nextHopProtocol == "string" && (e.initiatorType === "fetch" || e.initiatorType === "xmlhttprequest")
}
function Au(e) {
    const {url: t} = z(e).data;
    if (!t || typeof t != "string")
        return;
    const n = $n("resource", ({entries: r}) => {
        r.forEach(s => {
            aI(s) && s.name.endsWith(t) && (cI(s).forEach(i => e.setAttribute(...i)),
            setTimeout(n))
        }
        )
    }
    )
}
function et(e=0) {
    return ((Oe() || performance.timeOrigin) + e) / 1e3
}
function cI(e) {
    const {name: t, version: n} = Bd(e.nextHopProtocol)
      , r = [];
    return r.push(["network.protocol.version", n], ["network.protocol.name", t]),
    Oe() ? [...r, ["http.request.redirect_start", et(e.redirectStart)], ["http.request.fetch_start", et(e.fetchStart)], ["http.request.domain_lookup_start", et(e.domainLookupStart)], ["http.request.domain_lookup_end", et(e.domainLookupEnd)], ["http.request.connect_start", et(e.connectStart)], ["http.request.secure_connection_start", et(e.secureConnectionStart)], ["http.request.connection_end", et(e.connectEnd)], ["http.request.request_start", et(e.requestStart)], ["http.request.response_start", et(e.responseStart)], ["http.request.response_end", et(e.responseEnd)]] : r
}
function uI(e, t) {
    const n = rn();
    if (n) {
        let r, s;
        try {
            r = new URL(e,n),
            s = new URL(n).origin
        } catch {
            return !1
        }
        const o = r.origin === s;
        return t ? Je(r.toString(), t) || o && Je(r.pathname, t) : o
    } else {
        const r = !!e.match(/^\/(?!\/)/);
        return t ? Je(e, t) : r
    }
}
function lI(e, t, n, r) {
    const s = e.xhr
      , o = s == null ? void 0 : s[ft];
    if (!s || s.__sentry_own_request__ || !o)
        return;
    const {url: i, method: a} = o
      , c = Dt() && t(i);
    if (e.endTimestamp && c) {
        const m = s.__sentry_xhr_span_id__;
        if (!m)
            return;
        const _ = r[m];
        _ && o.status_code !== void 0 && (ws(_, o.status_code),
        _.end(),
        delete r[m]);
        return
    }
    const u = Yf(i)
      , d = Kt(u || i)
      , l = ad(i)
      , f = !!ge()
      , p = c && f ? nt({
        name: `${a} ${l}`,
        attributes: {
            url: i,
            type: "xhr",
            "http.method": a,
            "http.url": u,
            "server.address": d == null ? void 0 : d.host,
            [Y]: "auto.http.browser",
            [be]: "http.client",
            ...(d == null ? void 0 : d.search) && {
                "http.query": d == null ? void 0 : d.search
            },
            ...(d == null ? void 0 : d.hash) && {
                "http.fragment": d == null ? void 0 : d.hash
            }
        }
    }) : new yt;
    s.__sentry_xhr_span_id__ = p.spanContext().spanId,
    r[s.__sentry_xhr_span_id__] = p,
    n(i) && dI(s, Dt() && f ? p : void 0);
    const h = M();
    return h && h.emit("beforeOutgoingRequestSpan", p, e),
    p
}
function dI(e, t) {
    const {"sentry-trace": n, baggage: r} = Zl({
        span: t
    });
    n && fI(e, n, r)
}
function fI(e, t, n) {
    var s;
    const r = (s = e.__sentry_xhr_v3__) == null ? void 0 : s.request_headers;
    if (!(r != null && r["sentry-trace"]))
        try {
            if (e.setRequestHeader("sentry-trace", t),
            n) {
                const o = r == null ? void 0 : r.baggage;
                (!o || !pI(o)) && e.setRequestHeader("baggage", n)
            }
        } catch {}
}
function pI(e) {
    return e.split(",").some(t => t.trim().startsWith("sentry-"))
}
function Yf(e) {
    try {
        return new URL(e,L.location.origin).href
    } catch {
        return
    }
}
function hI() {
    L.document ? L.document.addEventListener("visibilitychange", () => {
        const e = ge();
        if (!e)
            return;
        const t = ye(e);
        if (L.document.hidden && t) {
            const n = "cancelled"
              , {op: r, status: s} = z(t);
            V && y.log(`[Tracing] Transaction: ${n} -> since tab moved to the background, op: ${r}`),
            s || t.setStatus({
                code: pe,
                message: n
            }),
            t.setAttribute("sentry.cancellation_reason", "document.hidden"),
            t.end()
        }
    }
    ) : V && y.warn("[Tracing] Could not set up background tab detection due to lack of global document")
}
const mI = 3600
  , Xf = "sentry_previous_trace"
  , gI = "sentry.previous_trace";
function _I(e, {linkPreviousTrace: t, consistentTraceSampling: n}) {
    const r = t === "session-storage";
    let s = r ? bI() : void 0;
    e.on("spanStart", i => {
        if (ye(i) !== i)
            return;
        const a = j().getPropagationContext();
        s = yI(s, i, a),
        r && SI(s)
    }
    );
    let o = !0;
    n && e.on("beforeSampling", i => {
        if (!s)
            return;
        const a = j()
          , c = a.getPropagationContext();
        if (o && c.parentSpanId) {
            o = !1;
            return
        }
        a.setPropagationContext({
            ...c,
            dsc: {
                ...c.dsc,
                sample_rate: String(s.sampleRate),
                sampled: String(Ni(s.spanContext))
            },
            sampleRand: s.sampleRand
        }),
        i.parentSampled = Ni(s.spanContext),
        i.parentSampleRate = s.sampleRate,
        i.spanAttributes = {
            ...i.spanAttributes,
            [cl]: s.sampleRate
        }
    }
    )
}
function yI(e, t, n) {
    const r = z(t);
    function s() {
        var a, c;
        try {
            return Number((a = n.dsc) == null ? void 0 : a.sample_rate) ?? Number((c = r.data) == null ? void 0 : c[Di])
        } catch {
            return 0
        }
    }
    const o = {
        spanContext: t.spanContext(),
        startTimestamp: r.start_timestamp,
        sampleRate: s(),
        sampleRand: n.sampleRand
    };
    if (!e)
        return o;
    const i = e.spanContext;
    return i.traceId === r.trace_id ? e : (Date.now() / 1e3 - e.startTimestamp <= mI && (V && y.info(`Adding previous_trace ${i} link to span ${{
        op: r.op,
        ...t.spanContext()
    }}`),
    t.addLink({
        context: i,
        attributes: {
            [th]: "previous_trace"
        }
    }),
    t.setAttribute(gI, `${i.traceId}-${i.spanId}-${Ni(i) ? 1 : 0}`)),
    o)
}
function SI(e) {
    try {
        L.sessionStorage.setItem(Xf, JSON.stringify(e))
    } catch (t) {
        V && y.warn("Could not store previous trace in sessionStorage", t)
    }
}
function bI() {
    var e;
    try {
        const t = (e = L.sessionStorage) == null ? void 0 : e.getItem(Xf);
        return JSON.parse(t)
    } catch {
        return
    }
}
function Ni(e) {
    return e.traceFlags === 1
}
const EI = "BrowserTracing"
  , vI = {
    ...os,
    instrumentNavigation: !0,
    instrumentPageLoad: !0,
    markBackgroundSpan: !0,
    enableLongTask: !0,
    enableLongAnimationFrame: !0,
    enableInp: !0,
    ignoreResourceSpans: [],
    ignorePerformanceApiSpans: [],
    linkPreviousTrace: "in-memory",
    consistentTraceSampling: !1,
    _experiments: {},
    ...Vf
}
  , Or = (e={}) => {
    const t = {
        name: void 0,
        source: void 0
    }
      , n = L.document
      , {enableInp: r, enableLongTask: s, enableLongAnimationFrame: o, _experiments: {enableInteractions: i, enableStandaloneClsSpans: a, enableStandaloneLcpSpans: c}, beforeStartSpan: u, idleTimeout: d, finalTimeout: l, childSpanTimeout: f, markBackgroundSpan: p, traceFetch: h, traceXHR: m, trackFetchStreamPerformance: _, shouldCreateSpanForRequest: g, enableHTTPTimings: b, ignoreResourceSpans: T, ignorePerformanceApiSpans: C, instrumentPageLoad: S, instrumentNavigation: E, linkPreviousTrace: k, consistentTraceSampling: N, onRequestSpanStart: w} = {
        ...vI,
        ...e
    };
    let I;
    function F(v, R) {
        const A = R.op === "pageload"
          , U = u ? u(R) : R
          , O = U.attributes || {};
        R.name !== U.name && (O[de] = "custom",
        U.attributes = O),
        t.name = U.name,
        t.source = O[de];
        const X = Al(U, {
            idleTimeout: d,
            finalTimeout: l,
            childSpanTimeout: f,
            disableAutoFinish: A,
            beforeSpanEnd: K => {
                I == null || I(),
                cb(K, {
                    recordClsOnPageloadSpan: !a,
                    recordLcpOnPageloadSpan: !c,
                    ignoreResourceSpans: T,
                    ignorePerformanceApiSpans: C
                }),
                Ou(v, void 0);
                const Q = j()
                  , Te = Q.getPropagationContext();
                Q.setPropagationContext({
                    ...Te,
                    traceId: X.spanContext().traceId,
                    sampled: sn(X),
                    dsc: Ze(K)
                })
            }
        });
        Ou(v, X);
        function D() {
            n && ["interactive", "complete"].includes(n.readyState) && v.emit("idleSpanEnableAutoFinish", X)
        }
        A && n && (n.addEventListener("readystatechange", () => {
            D()
        }
        ),
        D())
    }
    return {
        name: EI,
        setup(v) {
            gh(),
            I = eb({
                recordClsStandaloneSpans: a || !1,
                recordLcpStandaloneSpans: c || !1
            }),
            r && Rb(),
            o && P.PerformanceObserver && PerformanceObserver.supportedEntryTypes && PerformanceObserver.supportedEntryTypes.includes("long-animation-frame") ? nb() : s && tb(),
            i && rb();
            function R() {
                const A = fo(v);
                A && !z(A).timestamp && (V && y.log(`[Tracing] Finishing current active span with op: ${z(A).op}`),
                A.setAttribute(vs, "cancelled"),
                A.end())
            }
            v.on("startNavigationSpan", A => {
                if (M() !== v)
                    return;
                R(),
                we().setPropagationContext({
                    traceId: _t(),
                    sampleRand: Math.random()
                });
                const U = j();
                U.setPropagationContext({
                    traceId: _t(),
                    sampleRand: Math.random()
                }),
                U.setSDKProcessingMetadata({
                    normalizedRequest: void 0
                }),
                F(v, {
                    op: "navigation",
                    ...A
                })
            }
            ),
            v.on("startPageLoadSpan", (A, U={}) => {
                if (M() !== v)
                    return;
                R();
                const O = U.sentryTrace || Nu("sentry-trace")
                  , X = U.baggage || Nu("baggage")
                  , D = hl(O, X)
                  , K = j();
                K.setPropagationContext(D),
                K.setSDKProcessingMetadata({
                    normalizedRequest: gi()
                }),
                F(v, {
                    op: "pageload",
                    ...A
                })
            }
            )
        },
        afterAllSetup(v) {
            let R = rn();
            if (k !== "off" && _I(v, {
                linkPreviousTrace: k,
                consistentTraceSampling: N
            }),
            L.location) {
                if (S) {
                    const A = Oe();
                    Lr(v, {
                        name: L.location.pathname,
                        startTime: A ? A / 1e3 : void 0,
                        attributes: {
                            [de]: "url",
                            [Y]: "auto.pageload.browser"
                        }
                    })
                }
                E && ro( ({to: A, from: U}) => {
                    if (U === void 0 && (R == null ? void 0 : R.indexOf(A)) !== -1) {
                        R = void 0;
                        return
                    }
                    R = void 0;
                    const O = id(A);
                    Pr(v, {
                        name: (O == null ? void 0 : O.pathname) || L.location.pathname,
                        attributes: {
                            [de]: "url",
                            [Y]: "auto.navigation.browser"
                        }
                    }),
                    j().setSDKProcessingMetadata({
                        normalizedRequest: {
                            ...gi(),
                            url: A
                        }
                    })
                }
                )
            }
            p && hI(),
            i && wI(v, d, l, f, t),
            r && Ab(),
            iI(v, {
                traceFetch: h,
                traceXHR: m,
                trackFetchStreamPerformance: _,
                tracePropagationTargets: v.getOptions().tracePropagationTargets,
                shouldCreateSpanForRequest: g,
                enableHTTPTimings: b,
                onRequestSpanStart: w
            })
        }
    }
}
;
function Lr(e, t, n) {
    return e.emit("startPageLoadSpan", t, n),
    j().setTransactionName(t.name),
    fo(e)
}
function Pr(e, t) {
    return e.emit("startNavigationSpan", t),
    j().setTransactionName(t.name),
    fo(e)
}
function Nu(e) {
    const t = L.document
      , n = t == null ? void 0 : t.querySelector(`meta[name=${e}]`);
    return (n == null ? void 0 : n.getAttribute("content")) || void 0
}
function wI(e, t, n, r, s) {
    const o = L.document;
    let i;
    const a = () => {
        const c = "ui.action.click"
          , u = fo(e);
        if (u) {
            const d = z(u).op;
            if (["navigation", "pageload"].includes(d)) {
                V && y.warn(`[Tracing] Did not create ${c} span because a pageload or navigation span is in progress.`);
                return
            }
        }
        if (i && (i.setAttribute(vs, "interactionInterrupted"),
        i.end(),
        i = void 0),
        !s.name) {
            V && y.warn(`[Tracing] Did not create ${c} transaction because _latestRouteName is missing.`);
            return
        }
        i = Al({
            name: s.name,
            op: c,
            attributes: {
                [de]: s.source || "url"
            }
        }, {
            idleTimeout: t,
            finalTimeout: n,
            childSpanTimeout: r
        })
    }
    ;
    o && addEventListener("click", a, {
        once: !1,
        capture: !0
    })
}
const Kf = "_sentry_idleSpan";
function fo(e) {
    return e[Kf]
}
function Ou(e, t) {
    Ne(e, Kf, t)
}
function jn(e) {
    return new Promise( (t, n) => {
        e.oncomplete = e.onsuccess = () => t(e.result),
        e.onabort = e.onerror = () => n(e.error)
    }
    )
}
function TI(e, t) {
    const n = indexedDB.open(e);
    n.onupgradeneeded = () => n.result.createObjectStore(t);
    const r = jn(n);
    return s => r.then(o => s(o.transaction(t, "readwrite").objectStore(t)))
}
function Ma(e) {
    return jn(e.getAllKeys())
}
function II(e, t, n) {
    return e(r => Ma(r).then(s => {
        if (!(s.length >= n))
            return r.put(t, Math.max(...s, 0) + 1),
            jn(r.transaction)
    }
    ))
}
function kI(e, t, n) {
    return e(r => Ma(r).then(s => {
        if (!(s.length >= n))
            return r.put(t, Math.min(...s, 0) - 1),
            jn(r.transaction)
    }
    ))
}
function CI(e) {
    return e(t => Ma(t).then(n => {
        const r = n[0];
        if (r != null)
            return jn(t.get(r)).then(s => (t.delete(r),
            jn(t.transaction).then( () => s)))
    }
    ))
}
function RI(e) {
    let t;
    function n() {
        return t == null && (t = TI(e.dbName || "sentry-offline", e.storeName || "queue")),
        t
    }
    return {
        push: async r => {
            try {
                const s = await ks(r);
                await II(n(), s, e.maxQueueSize || 30)
            } catch {}
        }
        ,
        unshift: async r => {
            try {
                const s = await ks(r);
                await kI(n(), s, e.maxQueueSize || 30)
            } catch {}
        }
        ,
        shift: async () => {
            try {
                const r = await CI(n());
                if (r)
                    return Lh(r)
            } catch {}
        }
    }
}
function xI(e) {
    return t => {
        const n = e({
            ...t,
            createStore: RI
        });
        return L.addEventListener("online", async r => {
            await n.flush()
        }
        ),
        n
    }
}
function pk(e=Wd) {
    return xI(Gm(e))
}
const Lu = 1e6
  , ys = String(0)
  , MI = "main"
  , ze = L.navigator;
let Jf = ""
  , Zf = ""
  , Qf = ""
  , Oi = (ze == null ? void 0 : ze.userAgent) || ""
  , ep = "";
var Vu;
const AI = (ze == null ? void 0 : ze.language) || ((Vu = ze == null ? void 0 : ze.languages) == null ? void 0 : Vu[0]) || "";
function NI(e) {
    return typeof e == "object" && e !== null && "getHighEntropyValues"in e
}
const Pu = ze == null ? void 0 : ze.userAgentData;
NI(Pu) && Pu.getHighEntropyValues(["architecture", "model", "platform", "platformVersion", "fullVersionList"]).then(e => {
    var t;
    if (Jf = e.platform || "",
    Qf = e.architecture || "",
    ep = e.model || "",
    Zf = e.platformVersion || "",
    (t = e.fullVersionList) != null && t.length) {
        const n = e.fullVersionList[e.fullVersionList.length - 1];
        Oi = `${n.brand} ${n.version}`
    }
}
).catch(e => {}
);
function OI(e) {
    return !("thread_metadata"in e)
}
function LI(e) {
    return OI(e) ? FI(e) : e
}
function PI(e) {
    var n, r;
    const t = (r = (n = e.contexts) == null ? void 0 : n.trace) == null ? void 0 : r.trace_id;
    return typeof t == "string" && t.length !== 32 && V && y.log(`[Profiling] Invalid traceId: ${t} on profiled event`),
    typeof t != "string" ? "" : t
}
function DI(e, t, n, r) {
    if (r.type !== "transaction")
        throw new TypeError("Profiling events may only be attached to transactions, this should never occur.");
    if (n == null)
        throw new TypeError(`Cannot construct profiling event envelope without a valid profile. Got ${n} instead.`);
    const s = PI(r)
      , o = LI(n)
      , i = t || (typeof r.start_timestamp == "number" ? r.start_timestamp * 1e3 : me() * 1e3)
      , a = typeof r.timestamp == "number" ? r.timestamp * 1e3 : me() * 1e3;
    return {
        event_id: e,
        timestamp: new Date(i).toISOString(),
        platform: "javascript",
        version: "1",
        release: r.release || "",
        environment: r.environment || Ks,
        runtime: {
            name: "javascript",
            version: L.navigator.userAgent
        },
        os: {
            name: Jf,
            version: Zf,
            build_number: Oi
        },
        device: {
            locale: AI,
            model: ep,
            manufacturer: Oi,
            architecture: Qf,
            is_emulator: !1
        },
        debug_meta: {
            images: UI(n.resources)
        },
        profile: o,
        transactions: [{
            name: r.transaction || "",
            id: r.event_id || Ae(),
            trace_id: s,
            active_thread_id: ys,
            relative_start_ns: "0",
            relative_end_ns: ((a - i) * 1e6).toFixed(0)
        }]
    }
}
function tp(e) {
    return z(e).op === "pageload"
}
function FI(e) {
    let t, n = 0;
    const r = {
        samples: [],
        stacks: [],
        frames: [],
        thread_metadata: {
            [ys]: {
                name: MI
            }
        }
    }
      , s = e.samples[0];
    if (!s)
        return r;
    const o = s.timestamp
      , i = Oe()
      , a = typeof performance.timeOrigin == "number" ? performance.timeOrigin : i || 0
      , c = a - (i || a);
    return e.samples.forEach( (u, d) => {
        if (u.stackId === void 0) {
            t === void 0 && (t = n,
            r.stacks[t] = [],
            n++),
            r.samples[d] = {
                elapsed_since_start_ns: ((u.timestamp + c - o) * Lu).toFixed(0),
                stack_id: t,
                thread_id: ys
            };
            return
        }
        let l = e.stacks[u.stackId];
        const f = [];
        for (; l; ) {
            f.push(l.frameId);
            const h = e.frames[l.frameId];
            h && r.frames[l.frameId] === void 0 && (r.frames[l.frameId] = {
                function: h.name,
                abs_path: typeof h.resourceId == "number" ? e.resources[h.resourceId] : void 0,
                lineno: h.line,
                colno: h.column
            }),
            l = l.parentId === void 0 ? void 0 : e.stacks[l.parentId]
        }
        const p = {
            elapsed_since_start_ns: ((u.timestamp + c - o) * Lu).toFixed(0),
            stack_id: n,
            thread_id: ys
        };
        r.stacks[n] = f,
        r.samples[d] = p,
        n++
    }
    ),
    r
}
function $I(e, t) {
    if (!t.length)
        return e;
    for (const n of t)
        e[1].push([{
            type: "profile"
        }, n]);
    return e
}
function BI(e) {
    const t = [];
    return en(e, (n, r) => {
        if (r === "transaction")
            for (let s = 1; s < n.length; s++) {
                const o = n[s];
                o != null && o.contexts && o.contexts.profile && o.contexts.profile.profile_id && t.push(n[s])
            }
    }
    ),
    t
}
function UI(e) {
    const t = M()
      , n = t == null ? void 0 : t.getOptions()
      , r = n == null ? void 0 : n.stackParser;
    return r ? rm(r, e) : []
}
function HI(e) {
    return typeof e != "number" && typeof e != "boolean" || typeof e == "number" && isNaN(e) ? (V && y.warn(`[Profiling] Invalid sample rate. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(e)} of type ${JSON.stringify(typeof e)}.`),
    !1) : e === !0 || e === !1 ? !0 : e < 0 || e > 1 ? (V && y.warn(`[Profiling] Invalid sample rate. Sample rate must be between 0 and 1. Got ${e}.`),
    !1) : !0
}
function WI(e) {
    return e.samples.length < 2 ? (V && y.log("[Profiling] Discarding profile because it contains less than 2 samples"),
    !1) : e.frames.length ? !0 : (V && y.log("[Profiling] Discarding profile because it contains no frames"),
    !1)
}
let np = !1;
const rp = 3e4;
function zI(e) {
    return typeof e == "function"
}
function jI() {
    const e = L.Profiler;
    if (!zI(e)) {
        V && y.log("[Profiling] Profiling is not supported by this browser, Profiler interface missing on window object.");
        return
    }
    const t = 10
      , n = Math.floor(rp / t);
    try {
        return new e({
            sampleInterval: t,
            maxBufferSize: n
        })
    } catch {
        V && (y.log("[Profiling] Failed to initialize the Profiling constructor, this is likely due to a missing 'Document-Policy': 'js-profiling' header."),
        y.log("[Profiling] Disabling profiling for current user session.")),
        np = !0
    }
}
function Du(e) {
    if (np)
        return V && y.log("[Profiling] Profiling has been disabled for the duration of the current user session."),
        !1;
    if (!e.isRecording())
        return V && y.log("[Profiling] Discarding profile because transaction was not sampled."),
        !1;
    const t = M()
      , n = t == null ? void 0 : t.getOptions();
    if (!n)
        return V && y.log("[Profiling] Profiling disabled, no options found."),
        !1;
    const r = n.profilesSampleRate;
    return HI(r) ? r ? (r === !0 ? !0 : Math.random() < r) ? !0 : (V && y.log(`[Profiling] Discarding profile because it's not included in the random sample (sampling rate = ${Number(r)})`),
    !1) : (V && y.log("[Profiling] Discarding profile because a negative sampling decision was inherited or profileSampleRate is set to 0"),
    !1) : (V && y.warn("[Profiling] Discarding profile because of invalid sample rate."),
    !1)
}
function qI(e, t, n, r) {
    return WI(n) ? DI(e, t, n, r) : null
}
const Vt = new Map;
function GI() {
    return Vt.size
}
function VI(e) {
    const t = Vt.get(e);
    return t && Vt.delete(e),
    t
}
function YI(e, t) {
    if (Vt.set(e, t),
    Vt.size > 30) {
        const n = Vt.keys().next().value;
        Vt.delete(n)
    }
}
function Fu(e) {
    let t;
    tp(e) && (t = me() * 1e3);
    const n = jI();
    if (!n)
        return;
    V && y.log(`[Profiling] started profiling span: ${z(e).description}`);
    const r = Ae();
    j().setContext("profile", {
        profile_id: r,
        start_timestamp: t
    });
    async function s() {
        if (e && n)
            return n.stop().then(c => {
                if (o && (L.clearTimeout(o),
                o = void 0),
                V && y.log(`[Profiling] stopped profiling of span: ${z(e).description}`),
                !c) {
                    V && y.log(`[Profiling] profiler returned null profile for: ${z(e).description}`, "this may indicate an overlapping span or a call to stopProfiling with a profile title that was never started");
                    return
                }
                YI(r, c)
            }
            ).catch(c => {
                V && y.log("[Profiling] error while stopping profiler:", c)
            }
            )
    }
    let o = L.setTimeout( () => {
        V && y.log("[Profiling] max profile duration elapsed, stopping profiling for:", z(e).description),
        s()
    }
    , rp);
    const i = e.end.bind(e);
    function a() {
        return e ? (s().then( () => {
            i()
        }
        , () => {
            i()
        }
        ),
        e) : i()
    }
    e.end = a
}
const XI = "BrowserProfiling"
  , KI = () => ({
    name: XI,
    setup(e) {
        const t = ge()
          , n = t && ye(t);
        n && tp(n) && Du(n) && Fu(n),
        e.on("spanStart", r => {
            r === ye(r) && Du(r) && Fu(r)
        }
        ),
        e.on("beforeEnvelope", r => {
            var i, a;
            if (!GI())
                return;
            const s = BI(r);
            if (!s.length)
                return;
            const o = [];
            for (const c of s) {
                const u = c == null ? void 0 : c.contexts
                  , d = (i = u == null ? void 0 : u.profile) == null ? void 0 : i.profile_id
                  , l = (a = u == null ? void 0 : u.profile) == null ? void 0 : a.start_timestamp;
                if (typeof d != "string") {
                    V && y.log("[Profiling] cannot find profile for a span without a profile context");
                    continue
                }
                if (!d) {
                    V && y.log("[Profiling] cannot find profile for a span without a profile context");
                    continue
                }
                u != null && u.profile && delete u.profile;
                const f = VI(d);
                if (!f) {
                    V && y.log(`[Profiling] Could not retrieve profile for span: ${d}`);
                    continue
                }
                const p = qI(d, l, f, c);
                p && o.push(p)
            }
            $I(r, o)
        }
        )
    }
})
  , hk = KI
  , JI = "SpotlightBrowser"
  , ZI = (e={}) => {
    const t = e.sidecarUrl || "http://localhost:8969/stream";
    return {
        name: JI,
        setup: () => {
            V && y.log("Using Sidecar URL", t)
        }
        ,
        processEvent: n => e1(n) ? null : n,
        afterAllSetup: n => {
            QI(n, t)
        }
    }
}
;
function QI(e, t) {
    const n = ua("fetch");
    let r = 0;
    e.on("beforeEnvelope", s => {
        if (r > 3) {
            y.warn("[Spotlight] Disabled Sentry -> Spotlight integration due to too many failed requests:", r);
            return
        }
        n(t, {
            method: "POST",
            body: ks(s),
            headers: {
                "Content-Type": "application/x-sentry-envelope"
            },
            mode: "cors"
        }).then(o => {
            o.status >= 200 && o.status < 400 && (r = 0)
        }
        , o => {
            r++,
            y.error("Sentry SDK can't connect to Sidecar is it running? See: https://spotlightjs.com/sidecar/npx/", o)
        }
        )
    }
    )
}
const mk = ZI;
function e1(e) {
    return !!(e.type === "transaction" && e.spans && e.contexts && e.contexts.trace && e.contexts.trace.op === "ui.action.click" && e.spans.some( ({description: t}) => t == null ? void 0 : t.includes("#sentry-spotlight")))
}
const gk = () => ({
    name: "LaunchDarkly",
    processEvent(e, t, n) {
        return wr(e)
    }
});
function _k() {
    return {
        name: "sentry-flag-auditor",
        type: "flag-used",
        synchronous: !0,
        method: (e, t, n) => {
            An(e, t.value),
            Nn(e, t.value)
        }
    }
}
const yk = () => ({
    name: "OpenFeature",
    processEvent(e, t, n) {
        return wr(e)
    }
});
class Sk {
    after(t, n) {
        An(n.flagKey, n.value),
        Nn(n.flagKey, n.value)
    }
    error(t, n, r) {
        An(t.flagKey, t.defaultValue),
        Nn(t.flagKey, t.defaultValue)
    }
}
const bk = ({featureFlagClientClass: e}) => ({
    name: "Unleash",
    setupOnce() {
        const t = e.prototype;
        Me(t, "isEnabled", t1)
    },
    processEvent(t, n, r) {
        return wr(t)
    }
});
function t1(e) {
    return function(...t) {
        const n = t[0]
          , r = e.apply(this, t);
        return typeof n == "string" && typeof r == "boolean" ? (An(n, r),
        Nn(n, r)) : V && y.error(`[Feature Flags] UnleashClient.isEnabled does not match expected signature. arg0: ${n} (${typeof n}), result: ${r} (${typeof r})`),
        r
    }
}
const Ek = ({featureFlagClient: e}) => ({
    name: "Statsig",
    setup(t) {
        e.on("gate_evaluation", n => {
            An(n.gate.name, n.gate.value),
            Nn(n.gate.name, n.gate.value)
        }
        )
    },
    processEvent(t, n, r) {
        return wr(t)
    }
});
async function vk() {
    const e = M();
    if (!e)
        return "no-client-active";
    if (!e.getDsn())
        return "no-dsn-configured";
    try {
        await fetch("https://o447951.ingest.sentry.io/api/1337/envelope/?sentry_version=7&sentry_key=1337&sentry_client=sentry.javascript.browser%2F1.33.7", {
            body: "{}",
            method: "POST",
            mode: "cors",
            credentials: "omit"
        })
    } catch {
        return "sentry-unreachable"
    }
}
function wk(e) {
    const t = {
        ...e
    };
    return Jl(t, "react"),
    Ll("react", {
        version: Ie.version
    }),
    $E(t)
}
function n1(e) {
    const t = e.match(/^([^.]+)/);
    return t !== null && parseInt(t[0]) >= 17
}
function r1(e, t) {
    const n = new WeakSet;
    function r(s, o) {
        if (!n.has(s)) {
            if (s.cause)
                return n.add(s),
                r(s.cause, o);
            s.cause = o
        }
    }
    r(e, t)
}
function sp(e, {componentStack: t}, n) {
    if (n1(Ie.version) && pt(e) && t) {
        const r = new Error(e.message);
        r.name = `React ErrorBoundary ${e.name}`,
        r.stack = t,
        r1(e, r)
    }
    return Be(r => (r.setContext("react", {
        componentStack: t
    }),
    tn(e, n)))
}
function Tk(e) {
    return (t, n) => {
        const r = sp(t, n);
        e && e(t, n, r)
    }
}
const op = "ui.react.render"
  , s1 = "ui.react.update"
  , ip = "ui.react.mount";
var Go = {
    exports: {}
}
  , te = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var $u;
function o1() {
    if ($u)
        return te;
    $u = 1;
    var e = typeof Symbol == "function" && Symbol.for
      , t = e ? Symbol.for("react.element") : 60103
      , n = e ? Symbol.for("react.portal") : 60106
      , r = e ? Symbol.for("react.fragment") : 60107
      , s = e ? Symbol.for("react.strict_mode") : 60108
      , o = e ? Symbol.for("react.profiler") : 60114
      , i = e ? Symbol.for("react.provider") : 60109
      , a = e ? Symbol.for("react.context") : 60110
      , c = e ? Symbol.for("react.async_mode") : 60111
      , u = e ? Symbol.for("react.concurrent_mode") : 60111
      , d = e ? Symbol.for("react.forward_ref") : 60112
      , l = e ? Symbol.for("react.suspense") : 60113
      , f = e ? Symbol.for("react.suspense_list") : 60120
      , p = e ? Symbol.for("react.memo") : 60115
      , h = e ? Symbol.for("react.lazy") : 60116
      , m = e ? Symbol.for("react.block") : 60121
      , _ = e ? Symbol.for("react.fundamental") : 60117
      , g = e ? Symbol.for("react.responder") : 60118
      , b = e ? Symbol.for("react.scope") : 60119;
    function T(S) {
        if (typeof S == "object" && S !== null) {
            var E = S.$$typeof;
            switch (E) {
            case t:
                switch (S = S.type,
                S) {
                case c:
                case u:
                case r:
                case o:
                case s:
                case l:
                    return S;
                default:
                    switch (S = S && S.$$typeof,
                    S) {
                    case a:
                    case d:
                    case h:
                    case p:
                    case i:
                        return S;
                    default:
                        return E
                    }
                }
            case n:
                return E
            }
        }
    }
    function C(S) {
        return T(S) === u
    }
    return te.AsyncMode = c,
    te.ConcurrentMode = u,
    te.ContextConsumer = a,
    te.ContextProvider = i,
    te.Element = t,
    te.ForwardRef = d,
    te.Fragment = r,
    te.Lazy = h,
    te.Memo = p,
    te.Portal = n,
    te.Profiler = o,
    te.StrictMode = s,
    te.Suspense = l,
    te.isAsyncMode = function(S) {
        return C(S) || T(S) === c
    }
    ,
    te.isConcurrentMode = C,
    te.isContextConsumer = function(S) {
        return T(S) === a
    }
    ,
    te.isContextProvider = function(S) {
        return T(S) === i
    }
    ,
    te.isElement = function(S) {
        return typeof S == "object" && S !== null && S.$$typeof === t
    }
    ,
    te.isForwardRef = function(S) {
        return T(S) === d
    }
    ,
    te.isFragment = function(S) {
        return T(S) === r
    }
    ,
    te.isLazy = function(S) {
        return T(S) === h
    }
    ,
    te.isMemo = function(S) {
        return T(S) === p
    }
    ,
    te.isPortal = function(S) {
        return T(S) === n
    }
    ,
    te.isProfiler = function(S) {
        return T(S) === o
    }
    ,
    te.isStrictMode = function(S) {
        return T(S) === s
    }
    ,
    te.isSuspense = function(S) {
        return T(S) === l
    }
    ,
    te.isValidElementType = function(S) {
        return typeof S == "string" || typeof S == "function" || S === r || S === u || S === o || S === s || S === l || S === f || typeof S == "object" && S !== null && (S.$$typeof === h || S.$$typeof === p || S.$$typeof === i || S.$$typeof === a || S.$$typeof === d || S.$$typeof === _ || S.$$typeof === g || S.$$typeof === b || S.$$typeof === m)
    }
    ,
    te.typeOf = T,
    te
}
var Bu;
function i1() {
    return Bu || (Bu = 1,
    Go.exports = o1()),
    Go.exports
}
var Vo, Uu;
function a1() {
    if (Uu)
        return Vo;
    Uu = 1;
    var e = i1()
      , t = {
        childContextTypes: !0,
        contextType: !0,
        contextTypes: !0,
        defaultProps: !0,
        displayName: !0,
        getDefaultProps: !0,
        getDerivedStateFromError: !0,
        getDerivedStateFromProps: !0,
        mixins: !0,
        propTypes: !0,
        type: !0
    }
      , n = {
        name: !0,
        length: !0,
        prototype: !0,
        caller: !0,
        callee: !0,
        arguments: !0,
        arity: !0
    }
      , r = {
        $$typeof: !0,
        render: !0,
        defaultProps: !0,
        displayName: !0,
        propTypes: !0
    }
      , s = {
        $$typeof: !0,
        compare: !0,
        defaultProps: !0,
        displayName: !0,
        propTypes: !0,
        type: !0
    }
      , o = {};
    o[e.ForwardRef] = r,
    o[e.Memo] = s;
    function i(h) {
        return e.isMemo(h) ? s : o[h.$$typeof] || t
    }
    var a = Object.defineProperty
      , c = Object.getOwnPropertyNames
      , u = Object.getOwnPropertySymbols
      , d = Object.getOwnPropertyDescriptor
      , l = Object.getPrototypeOf
      , f = Object.prototype;
    function p(h, m, _) {
        if (typeof m != "string") {
            if (f) {
                var g = l(m);
                g && g !== f && p(h, g, _)
            }
            var b = c(m);
            u && (b = b.concat(u(m)));
            for (var T = i(h), C = i(m), S = 0; S < b.length; ++S) {
                var E = b[S];
                if (!n[E] && !(_ && _[E]) && !(C && C[E]) && !(T && T[E])) {
                    var k = d(m, E);
                    try {
                        a(h, E, k)
                    } catch {}
                }
            }
        }
        return h
    }
    return Vo = p,
    Vo
}
var ap = a1();
const cp = vp(ap)
  , c1 = wp({
    __proto__: null,
    default: cp
}, [ap])
  , po = cp || c1
  , u1 = "unknown";
class up extends Ie.Component {
    constructor(t) {
        super(t);
        const {name: n, disabled: r=!1} = this.props;
        r || (this._mountSpan = nt({
            name: `<${n}>`,
            onlyIfParent: !0,
            op: ip,
            attributes: {
                [Y]: "auto.ui.react.profiler",
                "ui.component_name": n
            }
        }))
    }
    componentDidMount() {
        this._mountSpan && this._mountSpan.end()
    }
    shouldComponentUpdate({updateProps: t, includeUpdates: n=!0}) {
        if (n && this._mountSpan && t !== this.props.updateProps) {
            const r = Object.keys(t).filter(s => t[s] !== this.props.updateProps[s]);
            if (r.length > 0) {
                const s = me();
                this._updateSpan = Mn(this._mountSpan, () => nt({
                    name: `<${this.props.name}>`,
                    onlyIfParent: !0,
                    op: s1,
                    startTime: s,
                    attributes: {
                        [Y]: "auto.ui.react.profiler",
                        "ui.component_name": this.props.name,
                        "ui.react.changed_props": r
                    }
                }))
            }
        }
        return !0
    }
    componentDidUpdate() {
        this._updateSpan && (this._updateSpan.end(),
        this._updateSpan = void 0)
    }
    componentWillUnmount() {
        const t = me()
          , {name: n, includeRender: r=!0} = this.props;
        if (this._mountSpan && r) {
            const s = z(this._mountSpan).timestamp;
            Mn(this._mountSpan, () => {
                const o = nt({
                    onlyIfParent: !0,
                    name: `<${n}>`,
                    op,
                    startTime: s,
                    attributes: {
                        [Y]: "auto.ui.react.profiler",
                        "ui.component_name": n
                    }
                });
                o && o.end(t)
            }
            )
        }
    }
    render() {
        return this.props.children
    }
}
Object.assign(up, {
    defaultProps: {
        disabled: !1,
        includeRender: !0,
        includeUpdates: !0
    }
});
function Ik(e, t) {
    const n = (t == null ? void 0 : t.name) || e.displayName || e.name || u1
      , r = s => Ie.createElement(up, {
        ...t,
        name: n,
        updateProps: s
    }, Ie.createElement(e, {
        ...s
    }));
    return r.displayName = `profiler(${n})`,
    po(r, e),
    r
}
function kk(e, t={
    disabled: !1,
    hasRenderSpan: !0
}) {
    const [n] = Ie.useState( () => {
        if (!(t != null && t.disabled))
            return nt({
                name: `<${e}>`,
                onlyIfParent: !0,
                op: ip,
                attributes: {
                    [Y]: "auto.ui.react.profiler",
                    "ui.component_name": e
                }
            })
    }
    );
    Ie.useEffect( () => (n && n.end(),
    () => {
        if (n && t.hasRenderSpan) {
            const r = z(n).timestamp
              , s = me()
              , o = nt({
                name: `<${e}>`,
                onlyIfParent: !0,
                op,
                startTime: r,
                attributes: {
                    [Y]: "auto.ui.react.profiler",
                    "ui.component_name": e
                }
            });
            o && o.end(s)
        }
    }
    ), [])
}
const Dr = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__
  , l1 = "unknown"
  , Yo = {
    componentStack: null,
    error: null,
    eventId: null
};
class d1 extends Ie.Component {
    constructor(t) {
        super(t),
        this.state = Yo,
        this._openFallbackReportDialog = !0;
        const n = M();
        n && t.showDialog && (this._openFallbackReportDialog = !1,
        this._cleanupHook = n.on("afterSendEvent", r => {
            !r.type && this._lastEventId && r.event_id === this._lastEventId && Vc({
                ...t.dialogOptions,
                eventId: this._lastEventId
            })
        }
        ))
    }
    componentDidCatch(t, n) {
        const {componentStack: r} = n
          , {beforeCapture: s, onError: o, showDialog: i, dialogOptions: a} = this.props;
        Be(c => {
            s && s(c, t, r);
            const u = this.props.handled != null ? this.props.handled : !!this.props.fallback
              , d = sp(t, n, {
                mechanism: {
                    handled: u
                }
            });
            o && o(t, r, d),
            i && (this._lastEventId = d,
            this._openFallbackReportDialog && Vc({
                ...a,
                eventId: d
            })),
            this.setState({
                error: t,
                componentStack: r,
                eventId: d
            })
        }
        )
    }
    componentDidMount() {
        const {onMount: t} = this.props;
        t && t()
    }
    componentWillUnmount() {
        const {error: t, componentStack: n, eventId: r} = this.state
          , {onUnmount: s} = this.props;
        s && (this.state === Yo ? s(null, null, null) : s(t, n, r)),
        this._cleanupHook && (this._cleanupHook(),
        this._cleanupHook = void 0)
    }
    resetErrorBoundary() {
        const {onReset: t} = this.props
          , {error: n, componentStack: r, eventId: s} = this.state;
        t && t(n, r, s),
        this.setState(Yo)
    }
    render() {
        const {fallback: t, children: n} = this.props
          , r = this.state;
        if (r.componentStack === null)
            return typeof n == "function" ? n() : n;
        const s = typeof t == "function" ? Ie.createElement(t, {
            error: r.error,
            componentStack: r.componentStack,
            resetError: () => this.resetErrorBoundary(),
            eventId: r.eventId
        }) : t;
        return Ie.isValidElement(s) ? s : (t && Dr && y.warn("fallback did not produce a valid ReactElement"),
        null)
    }
}
function Ck(e, t) {
    const n = e.displayName || e.name || l1
      , r = s => Ie.createElement(d1, {
        ...t
    }, Ie.createElement(e, {
        ...s
    }));
    return r.displayName = `errorBoundary(${n})`,
    po(r, e),
    r
}
const f1 = "redux.action"
  , p1 = "info"
  , h1 = {
    attachReduxState: !0,
    actionTransformer: e => e,
    stateTransformer: e => e || null
};
function Rk(e) {
    const t = {
        ...h1,
        ...e
    };
    return n => (r, s) => {
        t.attachReduxState && Xs().addEventProcessor( (a, c) => {
            try {
                a.type === void 0 && a.contexts.state.state.type === "redux" && (c.attachments = [...c.attachments || [], {
                    filename: "redux_state.json",
                    data: JSON.stringify(a.contexts.state.state.value)
                }])
            } catch {}
            return a
        }
        );
        function o(a) {
            return (c, u) => {
                const d = a(c, u)
                  , l = j()
                  , f = t.actionTransformer(u);
                typeof f < "u" && f !== null && it({
                    category: f1,
                    data: f,
                    type: p1
                });
                const p = t.stateTransformer(d);
                if (typeof p < "u" && p !== null) {
                    const m = M()
                      , _ = m == null ? void 0 : m.getOptions()
                      , g = (_ == null ? void 0 : _.normalizeDepth) || 3
                      , b = {
                        state: {
                            type: "redux",
                            value: p
                        }
                    };
                    Ne(b, "__sentry_override_normalization_depth__", 3 + g),
                    l.setContext("state", b)
                } else
                    l.setContext("state", null);
                const {configureScopeWithState: h} = t;
                return typeof h == "function" && h(l, d),
                d
            }
        }
        const i = n(o(r), s);
        return i.replaceReducer = new Proxy(i.replaceReducer,{
            apply: function(a, c, u) {
                a.apply(c, [o(u[0])])
            }
        }),
        i
    }
}
function xk(e) {
    const t = Or({
        ...e,
        instrumentPageLoad: !1,
        instrumentNavigation: !1
    })
      , {history: n, routes: r, match: s, instrumentPageLoad: o=!0, instrumentNavigation: i=!0} = e;
    return {
        ...t,
        afterAllSetup(a) {
            t.afterAllSetup(a),
            o && L.location && Hu(r, L.location, s, (c, u="url") => {
                Lr(a, {
                    name: c,
                    attributes: {
                        [be]: "pageload",
                        [Y]: "auto.pageload.react.reactrouter_v3",
                        [de]: u
                    }
                })
            }
            ),
            i && n.listen && n.listen(c => {
                (c.action === "PUSH" || c.action === "POP") && Hu(r, c, s, (u, d="url") => {
                    Pr(a, {
                        name: u,
                        attributes: {
                            [be]: "navigation",
                            [Y]: "auto.navigation.react.reactrouter_v3",
                            [de]: d
                        }
                    })
                }
                )
            }
            )
        }
    }
}
function Hu(e, t, n, r) {
    let s = t.pathname;
    n({
        location: t,
        routes: e
    }, (o, i, a) => {
        if (o || !a)
            return r(s);
        const c = m1(a.routes || []);
        return c.length === 0 || c === "/*" ? r(s) : (s = c,
        r(s, "route"))
    }
    )
}
function m1(e) {
    var r;
    if (!Array.isArray(e) || e.length === 0)
        return "";
    const t = e.filter(s => !!s.path);
    let n = -1;
    for (let s = t.length - 1; s >= 0; s--)
        if ((r = t[s].path) != null && r.startsWith("/")) {
            n = s;
            break
        }
    return t.slice(n).reduce( (s, {path: o}) => {
        const i = s === "/" || s === "" ? o : `/${o}`;
        return `${s}${i}`
    }
    , "")
}
function Mk(e, t={}) {
    const n = e
      , r = Or({
        ...t,
        instrumentNavigation: !1,
        instrumentPageLoad: !1
    })
      , {instrumentPageLoad: s=!0, instrumentNavigation: o=!0} = t;
    return {
        ...r,
        afterAllSetup(i) {
            r.afterAllSetup(i);
            const a = L.location;
            if (s && a) {
                const c = n.matchRoutes(a.pathname, n.options.parseSearch(a.search), {
                    preload: !1,
                    throwOnError: !1
                })
                  , u = c[c.length - 1];
                Lr(i, {
                    name: u ? u.routeId : a.pathname,
                    attributes: {
                        [be]: "pageload",
                        [Y]: "auto.pageload.react.tanstack_router",
                        [de]: u ? "route" : "url",
                        ...Wu(u)
                    }
                })
            }
            o && n.subscribe("onBeforeNavigate", c => {
                var h;
                if (c.toLocation.state === ((h = c.fromLocation) == null ? void 0 : h.state))
                    return;
                const u = n.matchRoutes(c.toLocation.pathname, c.toLocation.search, {
                    preload: !1,
                    throwOnError: !1
                })
                  , d = u[u.length - 1]
                  , l = L.location
                  , f = Pr(i, {
                    name: d ? d.routeId : l.pathname,
                    attributes: {
                        [be]: "navigation",
                        [Y]: "auto.navigation.react.tanstack_router",
                        [de]: d ? "route" : "url"
                    }
                })
                  , p = n.subscribe("onResolved", m => {
                    if (p(),
                    f) {
                        const _ = n.matchRoutes(m.toLocation.pathname, m.toLocation.search, {
                            preload: !1,
                            throwOnError: !1
                        })
                          , g = _[_.length - 1];
                        g && (f.updateName(g.routeId),
                        f.setAttribute(de, "route"),
                        f.setAttributes(Wu(g)))
                    }
                }
                )
            }
            )
        }
    }
}
function Wu(e) {
    if (!e)
        return {};
    const t = {};
    return Object.entries(e.params).forEach( ([n,r]) => {
        t[`url.path.params.${n}`] = r
    }
    ),
    t
}
function Ak(e) {
    const t = Or({
        ...e,
        instrumentPageLoad: !1,
        instrumentNavigation: !1
    })
      , {history: n, routes: r, matchPath: s, instrumentPageLoad: o=!0, instrumentNavigation: i=!0} = e;
    return {
        ...t,
        afterAllSetup(a) {
            t.afterAllSetup(a),
            lp(a, o, i, n, "reactrouter_v4", r, s)
        }
    }
}
function Nk(e) {
    const t = Or({
        ...e,
        instrumentPageLoad: !1,
        instrumentNavigation: !1
    })
      , {history: n, routes: r, matchPath: s, instrumentPageLoad: o=!0, instrumentNavigation: i=!0} = e;
    return {
        ...t,
        afterAllSetup(a) {
            t.afterAllSetup(a),
            lp(a, o, i, n, "reactrouter_v5", r, s)
        }
    }
}
function lp(e, t, n, r, s, o=[], i) {
    function a() {
        if (r.location)
            return r.location.pathname;
        if (L.location)
            return L.location.pathname
    }
    function c(u) {
        if (o.length === 0 || !i)
            return [u, "url"];
        const d = dp(o, u, i);
        for (const l of d)
            if (l.match.isExact)
                return [l.match.path, "route"];
        return [u, "url"]
    }
    if (t) {
        const u = a();
        if (u) {
            const [d,l] = c(u);
            Lr(e, {
                name: d,
                attributes: {
                    [be]: "pageload",
                    [Y]: `auto.pageload.react.${s}`,
                    [de]: l
                }
            })
        }
    }
    n && r.listen && r.listen( (u, d) => {
        if (d && (d === "PUSH" || d === "POP")) {
            const [l,f] = c(u.pathname);
            Pr(e, {
                name: l,
                attributes: {
                    [be]: "navigation",
                    [Y]: `auto.navigation.react.${s}`,
                    [de]: f
                }
            })
        }
    }
    )
}
function dp(e, t, n, r=[]) {
    return e.some(s => {
        const o = s.path ? n(t, s) : r.length ? r[r.length - 1].match : g1(t);
        return o && (r.push({
            route: s,
            match: o
        }),
        s.routes && dp(s.routes, t, n, r)),
        !!o
    }
    ),
    r
}
function g1(e) {
    return {
        path: "/",
        url: "/",
        params: {},
        isExact: e === "/"
    }
}
function Ok(e) {
    const t = e.displayName || e.name
      , n = r => {
        var s;
        if ((s = r == null ? void 0 : r.computedMatch) != null && s.isExact) {
            const o = r.computedMatch.path
              , i = _1();
            j().setTransactionName(o),
            i && (i.updateName(o),
            i.setAttribute(de, "route"))
        }
        return Ie.createElement(e, {
            ...r
        })
    }
    ;
    return n.displayName = `sentryRoute(${t})`,
    po(n, e),
    n
}
function _1() {
    const e = ge()
      , t = e && ye(e);
    if (!t)
        return;
    const n = z(t).op;
    return n === "navigation" || n === "pageload" ? t : void 0
}
let Nt, Ot, Lt, Ss, at, wn = !1;
const fp = new WeakSet
  , rt = new Set;
function pp(e, t) {
    return !Nt || !Ot || !Lt || !at ? (Dr && y.warn(`reactRouterV${t}Instrumentation was unable to wrap the \`createRouter\` function because of one or more missing parameters.`),
    e) : function(n, r) {
        ho(n);
        const s = e(n, r)
          , o = r == null ? void 0 : r.basename
          , i = go();
        return s.state.historyAction === "POP" && i && mo(i, s.state.location, n, void 0, o, Array.from(rt)),
        s.subscribe(a => {
            (a.historyAction === "PUSH" || a.historyAction === "POP") && (a.navigation.state !== "idle" ? requestAnimationFrame( () => {
                pr({
                    location: a.location,
                    routes: n,
                    navigationType: a.historyAction,
                    version: t,
                    basename: o,
                    allRoutes: Array.from(rt)
                })
            }
            ) : pr({
                location: a.location,
                routes: n,
                navigationType: a.historyAction,
                version: t,
                basename: o,
                allRoutes: Array.from(rt)
            }))
        }
        ),
        s
    }
}
function hp(e, t) {
    return !Nt || !Ot || !Lt || !at ? (Dr && y.warn(`reactRouterV${t}Instrumentation was unable to wrap the \`createMemoryRouter\` function because of one or more missing parameters.`),
    e) : function(n, r) {
        ho(n);
        const s = e(n, r)
          , o = r == null ? void 0 : r.basename
          , i = go();
        let a;
        const c = r == null ? void 0 : r.initialEntries
          , u = r == null ? void 0 : r.initialIndex
          , d = c && c.length === 1
          , l = u !== void 0 && c && c[u];
        a = d ? c[0] : l ? c[u] : void 0;
        const f = a ? typeof a == "string" ? {
            pathname: a
        } : a : s.state.location;
        return s.state.historyAction === "POP" && i && mo(i, f, n, void 0, o, Array.from(rt)),
        s.subscribe(p => {
            const h = p.location;
            (p.historyAction === "PUSH" || p.historyAction === "POP") && pr({
                location: h,
                routes: n,
                navigationType: p.historyAction,
                version: t,
                basename: o,
                allRoutes: Array.from(rt)
            })
        }
        ),
        s
    }
}
function mp(e, t) {
    const n = Or({
        ...e,
        instrumentPageLoad: !1,
        instrumentNavigation: !1
    })
      , {useEffect: r, useLocation: s, useNavigationType: o, createRoutesFromChildren: i, matchRoutes: a, stripBasename: c, instrumentPageLoad: u=!0, instrumentNavigation: d=!0} = e;
    return {
        ...n,
        setup(l) {
            n.setup(l),
            Nt = r,
            Ot = s,
            Lt = o,
            at = a,
            Ss = i,
            wn = c || !1
        },
        afterAllSetup(l) {
            var p;
            n.afterAllSetup(l);
            const f = (p = L.location) == null ? void 0 : p.pathname;
            u && f && Lr(l, {
                name: f,
                attributes: {
                    [de]: "url",
                    [be]: "pageload",
                    [Y]: `auto.pageload.react.reactrouter_v${t}`
                }
            }),
            d && fp.add(l)
        }
    }
}
function gp(e, t) {
    if (!Nt || !Ot || !Lt || !at)
        return Dr && y.warn("reactRouterV6Instrumentation was unable to wrap `useRoutes` because of one or more missing parameters."),
        e;
    const n = r => {
        const s = Ie.useRef(!0)
          , {routes: o, locationArg: i} = r
          , a = e(o, i)
          , c = Ot()
          , u = Lt()
          , d = typeof i == "string" || i != null && i.pathname ? i : c;
        return Nt( () => {
            const l = typeof d == "string" ? {
                pathname: d
            } : d;
            s.current ? (ho(o),
            mo(go(), l, o, void 0, void 0, Array.from(rt)),
            s.current = !1) : pr({
                location: l,
                routes: o,
                navigationType: u,
                version: t,
                allRoutes: Array.from(rt)
            })
        }
        , [u, d]),
        a
    }
    ;
    return (r, s) => Ie.createElement(n, {
        routes: r,
        locationArg: s
    })
}
function pr(e) {
    const {location: t, routes: n, navigationType: r, version: s, matches: o, basename: i, allRoutes: a} = e
      , c = Array.isArray(o) ? o : at(n, t, i)
      , u = M();
    if (!(!u || !fp.has(u)) && (r === "PUSH" || r === "POP") && c) {
        let d, l = "url";
        const f = yp(t, a || n);
        f && (d = hr(Aa(a || n, t)),
        l = "route"),
        (!f || !d) && ([d,l] = bp(n, t, c, i));
        const p = ge();
        p && z(p).op === "navigation" ? (p == null || p.updateName(d),
        p == null || p.setAttribute(de, l)) : Pr(u, {
            name: d,
            attributes: {
                [de]: l,
                [be]: "navigation",
                [Y]: `auto.navigation.react.reactrouter_v${s}`
            }
        })
    }
}
function qs(e, t) {
    if (!t || t === "/" || !e.toLowerCase().startsWith(t.toLowerCase()))
        return e;
    const n = t.endsWith("/") ? t.length - 1 : t.length
      , r = e.charAt(n);
    return r && r !== "/" ? e : e.slice(n) || "/"
}
function y1(e, t, n) {
    const r = e || wn ? qs(t, n) : t;
    return [r[r.length - 1] === "/" || r.slice(-2) === "/*" ? r.slice(0, -1) : r, "route"]
}
function _p(e) {
    return e.endsWith("*")
}
function zu(e, t) {
    var n;
    return _p(e) && !!((n = t.route.children) != null && n.length) || !1
}
function S1(e) {
    var t;
    return !!(!e.children && e.element && ((t = e.path) != null && t.endsWith("/*")))
}
function yp(e, t) {
    const n = at(t, e);
    if (n) {
        for (const r of n)
            if (S1(r.route) && E1(r))
                return !0
    }
    return !1
}
function ho(e) {
    e.forEach(t => {
        Sp(t).forEach(r => {
            rt.add(r)
        }
        )
    }
    )
}
function Sp(e, t=new Set) {
    return t.has(e) || (t.add(e),
    e.children && !e.index && e.children.forEach(n => {
        Sp(n, t).forEach(s => {
            t.add(s)
        }
        )
    }
    )),
    t
}
function b1(e) {
    return v1(e.route.path || "")
}
function E1(e) {
    return e.params["*"] || ""
}
function v1(e) {
    return e[e.length - 1] === "*" ? e.slice(0, -1) : e
}
function In(e) {
    return e[e.length - 1] === "/" ? e.slice(0, -1) : e
}
function hr(e) {
    return e[0] === "/" ? e : `/${e}`
}
function Aa(e, t) {
    const n = at(e, t);
    if (!n || n.length === 0)
        return "";
    for (const r of n)
        if (r.route.path && r.route.path !== "*") {
            const s = b1(r)
              , o = qs(t.pathname, hr(r.pathnameBase));
            return t.pathname === o ? In(o) : In(In(s || "") + hr(Aa(e.filter(i => i !== r.route), {
                pathname: o
            })))
        }
    return ""
}
function bp(e, t, n, r="") {
    if (!e || e.length === 0)
        return [wn ? qs(t.pathname, r) : t.pathname, "url"];
    let s = "";
    if (n)
        for (const i of n) {
            const a = i.route;
            if (a) {
                if (a.index)
                    return y1(s, i.pathname, r);
                const c = a.path;
                if (c && !zu(c, i)) {
                    const u = c[0] === "/" || s[s.length - 1] === "/" ? c : `/${c}`;
                    if (s = In(s) + hr(u),
                    In(t.pathname) === In(r + i.pathname))
                        return ju(s) !== ju(i.pathname) && !_p(s) ? [(wn ? "" : r) + u, "route"] : (zu(s, i) && (s = s.slice(0, -1)),
                        [(wn ? "" : r) + s, "route"])
                }
            }
        }
    return [wn ? qs(t.pathname, r) : t.pathname || "/", "url"]
}
function mo(e, t, n, r, s, o) {
    const i = Array.isArray(r) ? r : at(o || n, t, s);
    if (i) {
        let a, c = "url";
        const u = yp(t, o || n);
        u && (a = hr(Aa(o || n, t)),
        c = "route"),
        (!u || !a) && ([a,c] = bp(n, t, i, s)),
        j().setTransactionName(a || "/"),
        e && (e.updateName(a),
        e.setAttribute(de, c))
    }
}
function Ep(e, t) {
    if (!Nt || !Ot || !Lt || !Ss || !at)
        return Dr && y.warn(`reactRouterV6Instrumentation was unable to wrap Routes because of one or more missing parameters.
      useEffect: ${Nt}. useLocation: ${Ot}. useNavigationType: ${Lt}.
      createRoutesFromChildren: ${Ss}. matchRoutes: ${at}.`),
        e;
    const n = r => {
        const s = Ie.useRef(!0)
          , o = Ot()
          , i = Lt();
        return Nt( () => {
            const a = Ss(r.children);
            s.current ? (ho(a),
            mo(go(), o, a, void 0, void 0, Array.from(rt)),
            s.current = !1) : pr({
                location: o,
                routes: a,
                navigationType: i,
                version: t,
                allRoutes: Array.from(rt)
            })
        }
        , [o, i]),
        Ie.createElement(e, {
            ...r
        })
    }
    ;
    return po(n, e),
    n
}
function go() {
    const e = ge()
      , t = e ? ye(e) : void 0;
    if (!t)
        return;
    const n = z(t).op;
    return n === "navigation" || n === "pageload" ? t : void 0
}
function ju(e) {
    return e.split(/\\?\//).filter(t => t.length > 0 && t !== ",").length
}
function Lk(e) {
    return mp(e, "6")
}
function Pk(e) {
    return gp(e, "6")
}
function Dk(e) {
    return pp(e, "6")
}
function Fk(e) {
    return hp(e, "6")
}
function $k(e) {
    return Ep(e, "6")
}
function Bk(e) {
    return mp(e, "7")
}
function Uk(e) {
    return Ep(e, "7")
}
function Hk(e) {
    return pp(e, "7")
}
function Wk(e) {
    return hp(e, "7")
}
function zk(e) {
    return gp(e, "7")
}
export {mS as BrowserClient, d1 as ErrorBoundary, Sk as OpenFeatureIntegrationHook, up as Profiler, Mt as SDK_VERSION, be as SEMANTIC_ATTRIBUTE_SENTRY_OP, Y as SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, Di as SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, de as SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, ot as Scope, L as WINDOW, it as addBreadcrumb, gm as addEventProcessor, nc as addIntegration, rE as breadcrumbsIntegration, hE as browserApiErrorsIntegration, hk as browserProfilingIntegration, bE as browserSessionIntegration, Or as browserTracingIntegration, _k as buildLaunchDarklyFlagUsedHandler, H1 as captureConsoleIntegration, Js as captureEvent, tn as captureException, b_ as captureFeedback, si as captureMessage, sp as captureReactException, Qa as captureSession, Hb as chromeStackLineParser, F1 as close, Y1 as consoleLoggingIntegration, ak as contextLinesIntegration, R1 as continueTrace, Rk as createReduxEnhancer, jm as createTransport, nk as createUserFeedbackEnvelope, Cg as dedupeIntegration, Vf as defaultRequestInstrumentationOptions, Zb as defaultStackLineParsers, Qb as defaultStackParser, vk as diagnoseSdkConnectivity, Pl as endSession, ug as eventFiltersIntegration, uS as eventFromException, lS as eventFromMessage, ta as exceptionFromError, W1 as extraErrorDataIntegration, V1 as featureFlagsIntegration, K1 as feedbackAsyncIntegration, J1 as feedbackIntegration, J1 as feedbackSyncIntegration, D1 as flush, rk as forceLoad, ig as functionToStringIntegration, qb as geckoStackLineParser, ge as getActiveSpan, M as getClient, j as getCurrentScope, FE as getDefaultIntegrations, X1 as getFeedback, Xs as getGlobalScope, we as getIsolationScope, dk as getReplay, ye as getRootSpan, rs as getSpanDescendants, rh as getSpanStatusFromHttpCode, Zl as getTraceData, wE as globalHandlersIntegration, ck as graphqlClientIntegration, ik as httpClientIntegration, xE as httpContextIntegration, lg as inboundFiltersIntegration, wk as init, iI as instrumentOutgoingRequests, Jg as instrumentSupabaseClient, mm as isEnabled, $1 as isInitialized, hm as lastEventId, gk as launchDarklyIntegration, Xy as lazyLoadIntegration, LE as linkedErrorsIntegration, Z1 as logger, pk as makeBrowserOfflineTransport, Wd as makeFetchTransport, B1 as makeMultiplexedTransport, U1 as moduleMetadataIntegration, sk as onLoad, yk as openFeatureIntegration, ek as opera10StackLineParser, tk as opera11StackLineParser, Jm as parameterize, Tk as reactErrorHandler, xk as reactRouterV3BrowserTracingIntegration, Ak as reactRouterV4BrowserTracingIntegration, Nk as reactRouterV5BrowserTracingIntegration, Lk as reactRouterV6BrowserTracingIntegration, Bk as reactRouterV7BrowserTracingIntegration, gh as registerSpanErrorInstrumentation, fk as replayCanvasIntegration, lk as replayIntegration, ok as reportingObserverIntegration, z1 as rewriteFramesIntegration, Q_ as sendFeedback, Ll as setContext, Bm as setCurrentClient, N1 as setExtra, A1 as setExtras, ws as setHttpStatus, Wh as setMeasurement, L1 as setTag, O1 as setTags, P1 as setUser, Vc as showReportDialog, k1 as spanToBaggageHeader, z as spanToJSON, fh as spanToTraceHeader, mk as spotlightBrowserIntegration, Pr as startBrowserTracingNavigationSpan, Lr as startBrowserTracingPageLoadSpan, nt as startInactiveSpan, M1 as startNewTrace, Za as startSession, xl as startSpan, C1 as startSpanManual, Ek as statsigIntegration, j1 as supabaseIntegration, x1 as suppressTracing, Mk as tanstackRouterBrowserTracingIntegration, G1 as thirdPartyErrorFilterIntegration, bk as unleashIntegration, I1 as updateSpanName, kk as useProfiler, Q1 as winjsStackLineParser, Mn as withActiveSpan, Ck as withErrorBoundary, T1 as withIsolationScope, Ik as withProfiler, Be as withScope, $k as withSentryReactRouterV6Routing, Uk as withSentryReactRouterV7Routing, Ok as withSentryRouting, Dk as wrapCreateBrowserRouterV6, Hk as wrapCreateBrowserRouterV7, Fk as wrapCreateMemoryRouterV6, Wk as wrapCreateMemoryRouterV7, Pk as wrapUseRoutesV6, zk as wrapUseRoutesV7, q1 as zodErrorsIntegration};

//# debugId=1296a824-f154-5e6c-b083-8940e7f9cbbe
