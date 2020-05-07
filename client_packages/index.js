/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
const util = __webpack_require__(10);
const environment = util.getEnvironment();
if (!environment)
    throw 'Unknown RAGE environment';
const ERR_NOT_FOUND = 'PROCEDURE_NOT_FOUND';
const IDENTIFIER = '__rpc:id';
const PROCESS_EVENT = '__rpc:process';
const BROWSER_REGISTER = '__rpc:browserRegister';
const BROWSER_UNREGISTER = '__rpc:browserUnregister';
const TRIGGER_EVENT = '__rpc:triggerEvent';
const TRIGGER_EVENT_BROWSERS = '__rpc:triggerEventBrowsers';
const glob = environment === 'cef' ? window : global;
if (!glob[PROCESS_EVENT]) {
    glob.__rpcListeners = {};
    glob.__rpcPending = {};
    glob.__rpcEvListeners = {};
    glob[PROCESS_EVENT] = (player, rawData) => {
        if (environment !== "server")
            rawData = player;
        const data = util.parseData(rawData);
        if (data.req) {
            const info = {
                id: data.id,
                environment: data.fenv || data.env
            };
            if (environment === "server")
                info.player = player;
            const part = {
                ret: 1,
                id: data.id,
                env: environment
            };
            let ret;
            switch (environment) {
                case "server":
                    ret = ev => info.player.call(PROCESS_EVENT, [util.stringifyData(ev)]);
                    break;
                case "client": {
                    if (data.env === "server") {
                        ret = ev => mp.events.callRemote(PROCESS_EVENT, util.stringifyData(ev));
                    }
                    else if (data.env === "cef") {
                        const browser = data.b && glob.__rpcBrowsers[data.b];
                        info.browser = browser;
                        ret = ev => browser && util.isBrowserValid(browser) && passEventToBrowser(browser, ev, true);
                    }
                    break;
                }
                case "cef": {
                    ret = ev => mp.trigger(PROCESS_EVENT, util.stringifyData(ev));
                }
            }
            if (ret) {
                const promise = callProcedure(data.name, data.args, info);
                if (!data.noRet)
                    promise.then(res => ret(Object.assign(Object.assign({}, part), { res }))).catch(err => ret(Object.assign(Object.assign({}, part), { err: err ? err : null })));
            }
        }
        else if (data.ret) {
            const info = glob.__rpcPending[data.id];
            if (environment === "server" && info.player !== player)
                return;
            if (info) {
                info.resolve(data.hasOwnProperty('err') ? util.promiseReject(data.err) : util.promiseResolve(data.res));
                delete glob.__rpcPending[data.id];
            }
        }
    };
    if (environment !== "cef") {
        mp.events.add(PROCESS_EVENT, glob[PROCESS_EVENT]);
        if (environment === "client") {
            register('__rpc:callServer', ([name, args, noRet], info) => _callServer(name, args, { fenv: info.environment, noRet }));
            register('__rpc:callBrowsers', ([name, args, noRet], info) => _callBrowsers(null, name, args, { fenv: info.environment, noRet }));
            glob.__rpcBrowsers = {};
            const initBrowser = (browser) => {
                const id = util.uid();
                Object.keys(glob.__rpcBrowsers).forEach(key => {
                    const b = glob.__rpcBrowsers[key];
                    if (!b || !util.isBrowserValid(b) || b === browser)
                        delete glob.__rpcBrowsers[key];
                });
                glob.__rpcBrowsers[id] = browser;
                browser.execute(`
                    window.name = '${id}';
                    if(typeof window['${IDENTIFIER}'] === 'undefined'){
                        window['${IDENTIFIER}'] = Promise.resolve(window.name);
                    }else{
                        window['${IDENTIFIER}:resolve'](window.name);
                    }
                `);
            };
            mp.browsers.forEach(initBrowser);
            mp.events.add('browserCreated', initBrowser);
            glob.__rpcBrowserProcedures = {};
            mp.events.add(BROWSER_REGISTER, (data) => {
                const [browserId, name] = JSON.parse(data);
                glob.__rpcBrowserProcedures[name] = browserId;
            });
            mp.events.add(BROWSER_UNREGISTER, (data) => {
                const [browserId, name] = JSON.parse(data);
                if (glob.__rpcBrowserProcedures[name] === browserId)
                    delete glob.__rpcBrowserProcedures[name];
            });
            register(TRIGGER_EVENT_BROWSERS, ([name, args], info) => {
                Object.values(glob.__rpcBrowsers).forEach((browser) => {
                    _callBrowser(browser, TRIGGER_EVENT, [name, args], { fenv: info.environment, noRet: 1 });
                });
            });
        }
    }
    else {
        if (typeof glob[IDENTIFIER] === 'undefined') {
            glob[IDENTIFIER] = new Promise(resolve => {
                if (window.name) {
                    resolve(window.name);
                }
                else {
                    glob[IDENTIFIER + ':resolve'] = resolve;
                }
            });
        }
    }
    register(TRIGGER_EVENT, ([name, args], info) => callEvent(name, args, info));
}
function passEventToBrowser(browser, data, ignoreNotFound) {
    const raw = util.stringifyData(data);
    browser.execute(`var process = window["${PROCESS_EVENT}"]; if(process){ process(${JSON.stringify(raw)}); }else{ ${ignoreNotFound ? '' : `mp.trigger("${PROCESS_EVENT}", '{"ret":1,"id":"${data.id}","err":"${ERR_NOT_FOUND}","env":"cef"}');`} }`);
}
function callProcedure(name, args, info) {
    const listener = glob.__rpcListeners[name];
    if (!listener)
        return util.promiseReject(ERR_NOT_FOUND);
    return util.promiseResolve(listener(args, info));
}
function register(name, cb) {
    if (arguments.length !== 2)
        throw 'register expects 2 arguments: "name" and "cb"';
    if (environment === "cef")
        glob[IDENTIFIER].then((id) => mp.trigger(BROWSER_REGISTER, JSON.stringify([id, name])));
    glob.__rpcListeners[name] = cb;
    return () => unregister(name);
}
exports.register = register;
function unregister(name) {
    if (arguments.length !== 1)
        throw 'unregister expects 1 argument: "name"';
    if (environment === "cef")
        glob[IDENTIFIER].then((id) => mp.trigger(BROWSER_UNREGISTER, JSON.stringify([id, name])));
    glob.__rpcListeners[name] = undefined;
}
exports.unregister = unregister;
function call(name, args, options = {}) {
    if (arguments.length < 1 || arguments.length > 3)
        return util.promiseReject('call expects 1 to 3 arguments: "name", optional "args", and optional "options"');
    return util.promiseTimeout(callProcedure(name, args, { environment }), options.timeout);
}
exports.call = call;
function _callServer(name, args, extraData = {}) {
    switch (environment) {
        case "server": {
            return call(name, args);
        }
        case "client": {
            const id = util.uid();
            return new Promise(resolve => {
                if (!extraData.noRet) {
                    glob.__rpcPending[id] = {
                        resolve
                    };
                }
                const event = Object.assign({ req: 1, id,
                    name, env: environment, args }, extraData);
                mp.events.callRemote(PROCESS_EVENT, util.stringifyData(event));
            });
        }
        case "cef": {
            return callClient('__rpc:callServer', [name, args, +extraData.noRet]);
        }
    }
}
function callServer(name, args, options = {}) {
    if (arguments.length < 1 || arguments.length > 3)
        return util.promiseReject('callServer expects 1 to 3 arguments: "name", optional "args", and optional "options"');
    let extraData = {};
    if (options.noRet)
        extraData.noRet = 1;
    return util.promiseTimeout(_callServer(name, args, extraData), options.timeout);
}
exports.callServer = callServer;
function _callClient(player, name, args, extraData = {}) {
    switch (environment) {
        case 'client': {
            return call(name, args);
        }
        case 'server': {
            const id = util.uid();
            return new Promise(resolve => {
                if (!extraData.noRet) {
                    glob.__rpcPending[id] = {
                        resolve,
                        player
                    };
                }
                const event = Object.assign({ req: 1, id,
                    name, env: environment, args }, extraData);
                player.call(PROCESS_EVENT, [util.stringifyData(event)]);
            });
        }
        case 'cef': {
            const id = util.uid();
            return glob[IDENTIFIER].then((browserId) => {
                return new Promise(resolve => {
                    if (!extraData.noRet) {
                        glob.__rpcPending[id] = {
                            resolve
                        };
                    }
                    const event = Object.assign({ b: browserId, req: 1, id,
                        name, env: environment, args }, extraData);
                    mp.trigger(PROCESS_EVENT, util.stringifyData(event));
                });
            });
        }
    }
}
function callClient(player, name, args, options = {}) {
    switch (environment) {
        case 'client': {
            options = args || {};
            args = name;
            name = player;
            player = null;
            if ((arguments.length < 1 || arguments.length > 3) || typeof name !== 'string')
                return util.promiseReject('callClient from the client expects 1 to 3 arguments: "name", optional "args", and optional "options"');
            break;
        }
        case 'server': {
            if ((arguments.length < 2 || arguments.length > 4) || typeof player !== 'object')
                return util.promiseReject('callClient from the server expects 2 to 4 arguments: "player", "name", optional "args", and optional "options"');
            break;
        }
        case 'cef': {
            options = args || {};
            args = name;
            name = player;
            player = null;
            if ((arguments.length < 1 || arguments.length > 3) || typeof name !== 'string')
                return util.promiseReject('callClient from the browser expects 1 to 3 arguments: "name", optional "args", and optional "options"');
            break;
        }
    }
    let extraData = {};
    if (options.noRet)
        extraData.noRet = 1;
    return util.promiseTimeout(_callClient(player, name, args, extraData), options.timeout);
}
exports.callClient = callClient;
function _callBrowser(browser, name, args, extraData = {}) {
    return new Promise(resolve => {
        const id = util.uid();
        if (!extraData.noRet) {
            glob.__rpcPending[id] = {
                resolve
            };
        }
        passEventToBrowser(browser, Object.assign({ req: 1, id,
            name, env: environment, args }, extraData), false);
    });
}
function _callBrowsers(player, name, args, extraData = {}) {
    switch (environment) {
        case 'client':
            const browserId = glob.__rpcBrowserProcedures[name];
            if (!browserId)
                return util.promiseReject(ERR_NOT_FOUND);
            const browser = glob.__rpcBrowsers[browserId];
            if (!browser || !util.isBrowserValid(browser))
                return util.promiseReject(ERR_NOT_FOUND);
            return _callBrowser(browser, name, args, extraData);
        case 'server':
            return _callClient(player, '__rpc:callBrowsers', [name, args, +extraData.noRet], extraData);
        case 'cef':
            return _callClient(null, '__rpc:callBrowsers', [name, args, +extraData.noRet], extraData);
    }
}
function callBrowsers(player, name, args, options = {}) {
    let promise;
    let extraData = {};
    switch (environment) {
        case 'client':
        case 'cef':
            options = args || {};
            args = name;
            name = player;
            if (arguments.length < 1 || arguments.length > 3)
                return util.promiseReject('callBrowsers from the client or browser expects 1 to 3 arguments: "name", optional "args", and optional "options"');
            if (options.noRet)
                extraData.noRet = 1;
            promise = _callBrowsers(null, name, args, extraData);
            break;
        case 'server':
            if (arguments.length < 2 || arguments.length > 4)
                return util.promiseReject('callBrowsers from the server expects 2 to 4 arguments: "player", "name", optional "args", and optional "options"');
            if (options.noRet)
                extraData.noRet = 1;
            promise = _callBrowsers(player, name, args, extraData);
            break;
    }
    if (promise) {
        return util.promiseTimeout(promise, options.timeout);
    }
}
exports.callBrowsers = callBrowsers;
function callBrowser(browser, name, args, options = {}) {
    if (environment !== 'client')
        return util.promiseReject('callBrowser can only be used in the client environment');
    if (arguments.length < 2 || arguments.length > 4)
        return util.promiseReject('callBrowser expects 2 to 4 arguments: "browser", "name", optional "args", and optional "options"');
    let extraData = {};
    if (options.noRet)
        extraData.noRet = 1;
    return util.promiseTimeout(_callBrowser(browser, name, args, extraData), options.timeout);
}
exports.callBrowser = callBrowser;
function callEvent(name, args, info) {
    const listeners = glob.__rpcEvListeners[name];
    if (listeners) {
        listeners.forEach((listener) => listener(args, info));
    }
}
function on(name, cb) {
    if (arguments.length !== 2)
        throw 'on expects 2 arguments: "name" and "cb"';
    const listeners = glob.__rpcEvListeners[name] || new Set();
    listeners.add(cb);
    glob.__rpcEvListeners[name] = listeners;
    return () => off(name, cb);
}
exports.on = on;
function off(name, cb) {
    if (arguments.length !== 2)
        throw 'off expects 2 arguments: "name" and "cb"';
    const listeners = glob.__rpcEvListeners[name];
    if (listeners) {
        listeners.delete(cb);
    }
}
exports.off = off;
function trigger(name, args) {
    if (arguments.length < 1 || arguments.length > 2)
        throw 'trigger expects 1 or 2 arguments: "name", and optional "args"';
    callEvent(name, args, { environment });
}
exports.trigger = trigger;
function triggerClient(player, name, args) {
    switch (environment) {
        case 'client': {
            args = name;
            name = player;
            player = null;
            if ((arguments.length < 1 || arguments.length > 2) || typeof name !== 'string')
                throw 'triggerClient from the client expects 1 or 2 arguments: "name", and optional "args"';
            break;
        }
        case 'server': {
            if ((arguments.length < 2 || arguments.length > 3) || typeof player !== 'object')
                throw 'triggerClient from the server expects 2 or 3 arguments: "player", "name", and optional "args"';
            break;
        }
        case 'cef': {
            args = name;
            name = player;
            player = null;
            if ((arguments.length < 1 || arguments.length > 2) || typeof name !== 'string')
                throw 'triggerClient from the browser expects 1 or 2 arguments: "name", and optional "args"';
            break;
        }
    }
    _callClient(player, TRIGGER_EVENT, [name, args], { noRet: 1 });
}
exports.triggerClient = triggerClient;
function triggerServer(name, args) {
    if (arguments.length < 1 || arguments.length > 2)
        throw 'triggerServer expects 1 or 2 arguments: "name", and optional "args"';
    _callServer(TRIGGER_EVENT, [name, args], { noRet: 1 });
}
exports.triggerServer = triggerServer;
function triggerBrowsers(player, name, args) {
    switch (environment) {
        case 'client':
        case 'cef':
            args = name;
            name = player;
            player = null;
            if (arguments.length < 1 || arguments.length > 2)
                throw 'triggerBrowsers from the client or browser expects 1 or 2 arguments: "name", and optional "args"';
            break;
        case 'server':
            if (arguments.length < 2 || arguments.length > 3)
                throw 'triggerBrowsers from the server expects 2 or 3 arguments: "player", "name", and optional "args"';
            break;
    }
    _callClient(player, TRIGGER_EVENT_BROWSERS, [name, args], { noRet: 1 });
}
exports.triggerBrowsers = triggerBrowsers;
function triggerBrowser(browser, name, args) {
    if (environment !== 'client')
        throw 'callBrowser can only be used in the client environment';
    if (arguments.length < 2 || arguments.length > 4)
        throw 'callBrowser expects 2 or 3 arguments: "browser", "name", and optional "args"';
    _callBrowser(browser, TRIGGER_EVENT, [name, args], { noRet: 1 });
}
exports.triggerBrowser = triggerBrowser;
exports.default = {
    register,
    unregister,
    call,
    callServer,
    callClient,
    callBrowsers,
    callBrowser,
    on,
    off,
    trigger,
    triggerServer,
    triggerClient,
    triggerBrowsers,
    triggerBrowser
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const CallServer_1 = __webpack_require__(24);
const constants_1 = __webpack_require__(25);
class Player {
    constructor(player) {
        this.hungerDecrementIntervalId = null;
        this.checkHungerIntervalId = null;
        this.checkDehydrationIntervalId = null;
        this.dehydrationDecrementIntervalId = null;
        this.player = player;
    }
    init() {
        const customData = {
            hunger: 100,
            dehydration: 0,
            admin: {
                lootCreate: {
                    data: [],
                }
            },
            character: {
                gender: null,
                face: [],
                eyes: 0,
            },
        };
        mp.players.local['customData'] = customData;
        this.setHunger(100);
        this.setDehydration(100);
    }
    dehydrationInit() {
        const self = this;
        this.checkDehydrationIntervalId = setInterval(() => {
            let newDehydration = self.getDehydration() - constants_1.constants.DECREMENT_DEHYDRATION_BAR;
            if (newDehydration <= 0) {
                newDehydration = 0;
                if (self.dehydrationDecrementIntervalId === null) {
                    self.dehydrationDecrementIntervalId = setInterval(() => {
                        const currentHealth = self.player.getHealth();
                        const newHealth = currentHealth - constants_1.constants.DECREMENT_DEHYDRATION_HEALTH;
                        CallServer_1.serverSetHealth(newHealth);
                    }, constants_1.constants.DECREMENT_TIME);
                }
            }
            self.setDehydration(newDehydration);
        }, constants_1.constants.CHECK_TIME);
    }
    setDehydration(val) {
        if (val < 0) {
            val = 0;
        }
        if (val > 100) {
            val = 100;
        }
        this.player.customData.dehydration = val;
    }
    getDehydration() {
        return this.player.customData.dehydration;
    }
    clearDehydrationDecrement() {
        if (this.dehydrationDecrementIntervalId !== null) {
            clearInterval(this.dehydrationDecrementIntervalId);
            this.dehydrationDecrementIntervalId = null;
        }
    }
    clearCheckDehydrationInterval() {
        if (this.checkDehydrationIntervalId !== null) {
            clearInterval(this.checkDehydrationIntervalId);
            this.checkDehydrationIntervalId = null;
        }
    }
    hungerInit() {
        const self = this;
        this.checkHungerIntervalId = setInterval(() => {
            let newHunger = self.getHunger() - constants_1.constants.DECREMENT_HUNGER_BAR;
            mp.gui.chat.push(` newHunger = ${newHunger}`);
            if (newHunger <= 0) {
                newHunger = 0;
                if (self.hungerDecrementIntervalId === null) {
                    self.hungerDecrementIntervalId = setInterval(() => {
                        const currentHealth = self.player.getHealth();
                        const newHealth = currentHealth - constants_1.constants.DECREMENT_HUNGER_HEALTH;
                        CallServer_1.serverSetHealth(newHealth);
                    }, constants_1.constants.DECREMENT_DEHYDRATION_TIME);
                }
            }
            self.setHunger(newHunger);
            mp.gui.chat.push(`self.getHunger(): ${self.getHunger()}`);
        }, constants_1.constants.CHECK_DEHYDRATION_TIME);
    }
    clearHungerDecrement() {
        if (this.hungerDecrementIntervalId !== null) {
            clearInterval(this.hungerDecrementIntervalId);
            this.hungerDecrementIntervalId = null;
        }
    }
    clearCheckHungerInterval() {
        if (this.checkHungerIntervalId !== null) {
            clearInterval(this.checkHungerIntervalId);
            this.checkHungerIntervalId = null;
        }
    }
    setHunger(val) {
        if (val < 0) {
            val = 0;
        }
        if (val > 100) {
            val = 100;
        }
        this.player.customData.hunger = val;
    }
    getHunger() {
        return this.player.customData.hunger;
    }
}
const playerInstance = new Player(mp.players.local);
exports.playerInstance = playerInstance;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const CEFBrowser_1 = __webpack_require__(17);
const Browser = new CEFBrowser_1.CEFBrowser('index.html');
exports.Browser = Browser;
Browser.setActive(true);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const rage_rpc_1 = __webpack_require__(0);
const browser_1 = __webpack_require__(3);
var HudsType;
(function (HudsType) {
    HudsType["CEF_SET_HEALTH_HUDS"] = "cef_set_health_huds";
    HudsType["CEF_SET_HUNGER_HUDS"] = "cef_set_hunger_huds";
    HudsType["CEF_SET_ARMOR_HUDS"] = "cef_set_armor_huds";
    HudsType["CEF_SET_DEHYDRATION_HUDS"] = "cef_set_dehydration_huds";
})(HudsType = exports.HudsType || (exports.HudsType = {}));
function cefSetHudsValue(type, value) {
    rage_rpc_1.callBrowser(browser_1.Browser.getBrowser(), type, value);
}
exports.cefSetHudsValue = cefSetHudsValue;
function cefSendLootCreateData(data) {
    rage_rpc_1.callBrowser(browser_1.Browser.getBrowser(), 'cef_set_loot_create_data', data);
}
exports.cefSendLootCreateData = cefSendLootCreateData;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const rage_rpc_1 = __webpack_require__(0);
var CEFRoute;
(function (CEFRoute) {
    CEFRoute["ADMININTERFACE"] = "AdminInterface";
    CEFRoute["UIITEMS"] = "UIItems";
    CEFRoute["CLEAR"] = "clear";
})(CEFRoute = exports.CEFRoute || (exports.CEFRoute = {}));
function changeUI(route) {
    rage_rpc_1.default.callServer('server_change_UI', route);
}
exports.changeUI = changeUI;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class PlayerCamera {
    static create(name, pos, rot, fow) {
        const camera = mp.cameras.new(name, pos, rot, fow);
        PlayerCamera.cameras.push({ name, camera });
    }
    static getCameraByName(name) {
        const findCamera = this.cameras.find(c => c.name === name).camera;
        if (findCamera) {
            return findCamera;
        }
        mp.gui.chat.push(`Камера с названием '${name}' не найдена`);
        return false;
    }
    static render(name, render, ease = false, easeTime = 0) {
        const findCamera = PlayerCamera.getCameraByName(name);
        if (findCamera) {
            findCamera.setActive(render);
            mp.game.cam.renderScriptCams(render, ease, easeTime, true, false);
        }
        else {
            mp.gui.chat.push('Такой камеры нет.');
        }
    }
    static setActive(name, b) {
        const findCamera = PlayerCamera.getCameraByName(name);
        if (findCamera) {
            findCamera.setActive(b);
        }
    }
    static setCoord(name, pos) {
        const findCamera = PlayerCamera.getCameraByName(name);
        if (findCamera) {
            findCamera.setCoord(pos.x, pos.y, pos.z);
        }
    }
    static getCoord(name) {
        const findCamera = PlayerCamera.getCameraByName(name);
        if (findCamera) {
            return findCamera.getCoord();
        }
    }
}
exports.PlayerCamera = PlayerCamera;
PlayerCamera.cameras = [];


/***/ }),
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Character {
    constructor(player) {
        this.mothers = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45];
        this.fathers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44];
        this.player = player;
        const character = {
            defaultCharacter: {},
            face: [
                { index: 0, feature: -1.0 },
                { index: 1, feature: -1.0 },
                { index: 2, feature: -1.0 },
                { index: 3, feature: -1.0 },
                { index: 4, feature: -1.0 },
                { index: 5, feature: -1.0 },
                { index: 6, feature: -1.0 },
                { index: 7, feature: -1.0 },
                { index: 8, feature: -1.0 },
                { index: 9, feature: -1.0 },
                { index: 10, feature: -1.0 },
                { index: 11, feature: -1.0 },
                { index: 12, feature: -1.0 },
                { index: 13, feature: -1.0 },
                { index: 14, feature: -1.0 },
                { index: 15, feature: -1.0 },
                { index: 16, feature: -1.0 },
                { index: 17, feature: -1.0 },
                { index: 18, feature: -1.0 },
                { index: 19, feature: -1.0 },
            ],
            head: {
                mother: 21,
                father: 0,
                similarity: 0.8,
                skin: 0.8,
                p3: 0,
                p6: 0,
                p9: 0.0,
                p10: true,
            },
            hair: {
                male: 0,
                female: 0,
            },
            headOverlay: [
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
                0,
            ],
            eyes: 0,
            gender: 'male',
        };
        this.player.customData.character = character;
        this.player.customData.character.defaultCharacter = JSON.parse(JSON.stringify(character));
    }
    setEyeColor(val) {
        val = this.range(val, 0, 31);
        this.player.setEyeColor(val);
        this.player.customData.character.eyes = val;
    }
    setDefaultClothes() {
        const clothes = this.player.getVariable('clothes');
        if (clothes) {
            const gender = this.player.customData.character.gender;
            this.player.setComponentVariation(1, clothes[gender][0], 0, 0);
            this.player.setComponentVariation(2, clothes[gender][1], 0, 0);
            this.player.setComponentVariation(3, clothes[gender][2], 0, 0);
            this.player.setComponentVariation(4, clothes[gender][3], 0, 0);
            this.player.setComponentVariation(5, clothes[gender][4], 0, 0);
            this.player.setComponentVariation(6, clothes[gender][5], 0, 0);
            this.player.setComponentVariation(7, clothes[gender][6], 0, 0);
            this.player.setComponentVariation(8, clothes[gender][7], 0, 0);
            this.player.setComponentVariation(9, clothes[gender][8], 0, 0);
            this.player.setComponentVariation(10, clothes[gender][9], 0, 0);
            this.player.setComponentVariation(11, clothes[gender][10], 0, 0);
        }
    }
    range(value, min, max) {
        if (value < min) {
            value = min;
        }
        if (value > max) {
            value = max;
        }
        return value;
    }
    ;
    setHeadOverlay(overlayId, index) {
        if (overlayId === 4 && index === 0 || overlayId === 5 && index === 0)
            index = 255;
        this.player.setHeadOverlay(overlayId, index, 100, 0, 0);
        this.player.customData.character.headOverlay[overlayId] = index;
    }
    setHairColor(id) {
        id = this.range(id, 0, 63);
        this.player.setHairColor(id, 0);
    }
    setHair(dId) {
        this.player.setComponentVariation(2, dId, 0, 0);
        this.player.customData.character.hair[this.player.customData.character.gender] = dId;
    }
    headUpdate() {
        const characterHead = this.player.customData.character.head;
        this.player.setHeadBlendData(characterHead.mother, characterHead.father, characterHead.p3, characterHead.mother, characterHead.father, characterHead.p6, characterHead.similarity, characterHead.skin, characterHead.p9, characterHead.p10);
    }
    setHeadProp({ name, val }) {
        const characterHead = this.player.customData.character.head;
        if (characterHead.hasOwnProperty(name)) {
            if (name === 'skin' || name === 'similarity') {
                val = this.range(val, 0, 1);
            }
            if (name === 'father') {
                if (this.fathers.indexOf(val) === -1) {
                    return;
                }
            }
            if (name === 'mother') {
                if (this.mothers.indexOf(val) === -1) {
                    return;
                }
            }
            characterHead[name] = val;
            this.headUpdate();
        }
        else {
            mp.gui.chat.push('setHeadProp: Такого св-ва нет');
        }
    }
    setHeading(h) {
        this.player.setHeading(h);
    }
    faceUpdate() {
        this.player.customData.character.face.forEach(face => {
            this.player.setFaceFeature(face.index, face.feature);
        });
    }
    setFace(index, feature) {
        if (isNaN(index) || typeof index !== 'number' || isNaN(feature) || typeof feature !== 'number') {
            return mp.gui.chat.push('setFace - index и feature должны быть числом.');
        }
        if (!Number.isInteger(index)) {
            return mp.gui.chat.push('setFace - index должен быть целым числом.');
        }
        index = this.range(index, 0, 19);
        feature = this.range(feature, -1, 1);
        this.player.customData.character.face[index].index = index;
        this.player.customData.character.face[index].feature = feature;
        this.player.setFaceFeature(index, feature);
    }
    setGender(gender) {
        let hash = null;
        if (gender === 'male' && this.player.model !== mp.game.joaat("mp_m_freemode_01")) {
            hash = mp.game.joaat("mp_m_freemode_01");
            this.player.model = hash;
        }
        if (gender === 'female' && this.player.model !== mp.game.joaat("mp_f_freemode_01")) {
            hash = mp.game.joaat("mp_f_freemode_01");
            this.player.model = mp.game.joaat("mp_f_freemode_01");
        }
        this.player.customData.character.gender = gender;
        this.faceUpdate();
        this.headUpdate();
        this.setDefaultClothes();
    }
    reset() {
        const defaultCharacter = this.player.customData.character.defaultCharacter;
        const characterHead = defaultCharacter.head;
        const headOverlay = defaultCharacter.headOverlay;
        this.setGender('male');
        this.setHair(0);
        this.setEyeColor(0);
        headOverlay.forEach((i, id) => {
            this.setHeadOverlay(id, 255);
        });
        defaultCharacter.face.forEach(face => {
            this.player.setFaceFeature(face.index, face.feature);
        });
        this.player.setHeadBlendData(characterHead.mother, characterHead.father, characterHead.p3, characterHead.mother, characterHead.father, characterHead.p6, characterHead.similarity, characterHead.skin, characterHead.p9, characterHead.p10);
        this.player.customData.character = JSON.parse(JSON.stringify(defaultCharacter));
        this.player.customData.character.defaultCharacter = JSON.parse(JSON.stringify(defaultCharacter));
    }
    getCharacterDataForServer() {
        const character = this.player.customData.character;
        const gender = character.gender;
        const face = character.face;
        const headArray = [
            character.head.mother,
            character.head.father,
            character.head.p3,
            character.head.mother,
            character.head.father,
            character.head.p6,
            character.head.similarity,
            character.head.skin,
            character.head.p9,
            character.head.p10,
        ];
        const headOverlay = character.headOverlay;
        const eyesColor = character.eyes;
        const hair = this.player.customData.character.hair[this.player.customData.character.gender];
        return { gender, face, headArray, hair, headOverlay, eyesColor };
    }
}
const character = new Character(mp.players.local);
exports.character = character;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(0);
__webpack_require__(11);
__webpack_require__(15);
__webpack_require__(16);
__webpack_require__(3);
__webpack_require__(18);
__webpack_require__(19);
__webpack_require__(20);
__webpack_require__(22);
__webpack_require__(23);
__webpack_require__(26);
__webpack_require__(27);
__webpack_require__(29);
__webpack_require__(30);
__webpack_require__(31);
__webpack_require__(32);
__webpack_require__(33);
__webpack_require__(34);
__webpack_require__(35);
__webpack_require__(36);
__webpack_require__(37);
__webpack_require__(38);
__webpack_require__(39);
mp.keys.bind(0x0D, true, () => {
    mp.gui.chat.push(JSON.stringify(mp.players.local.getVariable('isAuth')));
});
let flag = true;
mp.keys.bind(0x47, true, function () {
    flag = !flag;
    mp.events.callRemote('keypress:G');
    mp.players.local.taskReloadWeapon(true);
    mp.gui.chat.push(`ammo: ${mp.players.local.getAmmoInClip(mp.players.local.weapon)}`);
    mp.gui.chat.push(`getWeaponTintCount: ${mp.game.weapon.getWeaponTintCount(mp.players.local.weapon)}`);
    this.player.setHeadOverlay(8, 0, 100, 0, 0);
});
mp.keys.bind(0x76, false, function () {
    let weaponHash = mp.game.invoke(`0x0A6DB4965674D243`, mp.players.local.handle);
    let clipSize = mp.game.weapon.getWeaponClipSize(weaponHash);
    mp.gui.chat.push(`hash: ${weaponHash}, clipSize: ${clipSize}`);
    mp.players.local.setHeadOverlay(0, 21, 1, 1, 1);
});


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MpTypes;
(function (MpTypes) {
    MpTypes["Blip"] = "b";
    MpTypes["Checkpoint"] = "cp";
    MpTypes["Colshape"] = "c";
    MpTypes["Label"] = "l";
    MpTypes["Marker"] = "m";
    MpTypes["Object"] = "o";
    MpTypes["Pickup"] = "p";
    MpTypes["Player"] = "pl";
    MpTypes["Vehicle"] = "v";
})(MpTypes || (MpTypes = {}));
function isObjectMpType(obj, type) {
    const client = getEnvironment() === 'client';
    if (obj && typeof obj === 'object' && typeof obj.id !== 'undefined') {
        const test = (type, collection, mpType) => client ? obj.type === type && collection.at(obj.id) === obj : obj instanceof mpType;
        switch (type) {
            case MpTypes.Blip: return test('blip', mp.blips, mp.Blip);
            case MpTypes.Checkpoint: return test('checkpoint', mp.checkpoints, mp.Checkpoint);
            case MpTypes.Colshape: return test('colshape', mp.colshapes, mp.Colshape);
            case MpTypes.Label: return test('textlabel', mp.labels, mp.TextLabel);
            case MpTypes.Marker: return test('marker', mp.markers, mp.Marker);
            case MpTypes.Object: return test('object', mp.objects, mp.Object);
            case MpTypes.Pickup: return test('pickup', mp.pickups, mp.Pickup);
            case MpTypes.Player: return test('player', mp.players, mp.Player);
            case MpTypes.Vehicle: return test('vehicle', mp.vehicles, mp.Vehicle);
        }
    }
    return false;
}
function uid() {
    const first = (Math.random() * 46656) | 0;
    const second = (Math.random() * 46656) | 0;
    const firstPart = ('000' + first.toString(36)).slice(-3);
    const secondPart = ('000' + second.toString(36)).slice(-3);
    return firstPart + secondPart;
}
exports.uid = uid;
function getEnvironment() {
    if (mp.joaat)
        return 'server';
    else if (mp.game && mp.game.joaat)
        return 'client';
    else if (mp.trigger)
        return 'cef';
}
exports.getEnvironment = getEnvironment;
function stringifyData(data) {
    const env = getEnvironment();
    return JSON.stringify(data, (_, value) => {
        if (env === 'client' || env === 'server' && value && typeof value === 'object') {
            let type;
            if (isObjectMpType(value, MpTypes.Blip))
                type = MpTypes.Blip;
            else if (isObjectMpType(value, MpTypes.Checkpoint))
                type = MpTypes.Checkpoint;
            else if (isObjectMpType(value, MpTypes.Colshape))
                type = MpTypes.Colshape;
            else if (isObjectMpType(value, MpTypes.Marker))
                type = MpTypes.Marker;
            else if (isObjectMpType(value, MpTypes.Object))
                type = MpTypes.Object;
            else if (isObjectMpType(value, MpTypes.Pickup))
                type = MpTypes.Pickup;
            else if (isObjectMpType(value, MpTypes.Player))
                type = MpTypes.Player;
            else if (isObjectMpType(value, MpTypes.Vehicle))
                type = MpTypes.Vehicle;
            if (type)
                return {
                    __t: type,
                    i: typeof value.remoteId === 'number' ? value.remoteId : value.id
                };
        }
        return value;
    });
}
exports.stringifyData = stringifyData;
function parseData(data) {
    const env = getEnvironment();
    return JSON.parse(data, (_, value) => {
        if ((env === 'client' || env === 'server') && value && typeof value === 'object' && typeof value['__t'] === 'string' && typeof value.i === 'number' && Object.keys(value).length === 2) {
            const id = value.i;
            const type = value['__t'];
            let collection;
            switch (type) {
                case MpTypes.Blip:
                    collection = mp.blips;
                    break;
                case MpTypes.Checkpoint:
                    collection = mp.checkpoints;
                    break;
                case MpTypes.Colshape:
                    collection = mp.colshapes;
                    break;
                case MpTypes.Label:
                    collection = mp.labels;
                    break;
                case MpTypes.Marker:
                    collection = mp.markers;
                    break;
                case MpTypes.Object:
                    collection = mp.objects;
                    break;
                case MpTypes.Pickup:
                    collection = mp.pickups;
                    break;
                case MpTypes.Player:
                    collection = mp.players;
                    break;
                case MpTypes.Vehicle:
                    collection = mp.vehicles;
                    break;
            }
            if (collection)
                return collection[env === 'client' ? 'atRemoteId' : 'at'](id);
        }
        return value;
    });
}
exports.parseData = parseData;
function promiseResolve(result) {
    return new Promise(resolve => setTimeout(() => resolve(result), 0));
}
exports.promiseResolve = promiseResolve;
function promiseReject(error) {
    return new Promise((_, reject) => setTimeout(() => reject(error), 0));
}
exports.promiseReject = promiseReject;
function promiseTimeout(promise, timeout) {
    if (typeof timeout === 'number') {
        return Promise.race([
            new Promise((_, reject) => {
                setTimeout(() => reject('TIMEOUT'), timeout);
            }),
            promise
        ]);
    }
    else
        return promise;
}
exports.promiseTimeout = promiseTimeout;
function isBrowserValid(browser) {
    try {
        browser.url;
    }
    catch (e) {
        return false;
    }
    return true;
}
exports.isBrowserValid = isBrowserValid;


/***/ }),
/* 11 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open 'B:\\gta 5\\project\\server-files\\src\\client\\src\\_rage-console\\index.js'");

/***/ }),
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */
/***/ (function(module, exports) {

mp.events.add("setComponentVariation", (componentId, drawable, texture) => {
	// if(drawable === -1 || mp.players.local.isComponentVariationValid(componentId, drawable, texture))
	mp.players.local.setComponentVariation(componentId, drawable, texture, 2);
});

mp.events.add("entityStreamIn", syncEntityComponents);
mp.events.addDataHandler("__componentSync", syncEntityComponents);

function syncEntityComponents(entity) {
	if (entity.type === "player" && entity.handle !== 0) {
		if (entity.getVariable("__componentSync") === false || !JSON.parse(entity.getVariable("__componentSync")))
			return;
		let clothes = JSON.parse(entity.getVariable("__componentSync"));
		for (let componentId in clothes) {
			if (clothes.hasOwnProperty(componentId)
				// && (clothes[componentId].drawable === -1 || entity.isComponentVariationValid(parseInt(componentId),
				// clothes[componentId].drawable, clothes[componentId].texture))
			) {
				entity.setComponentVariation(parseInt(componentId), clothes[componentId].drawable, clothes[componentId].texture, 2);
			}
		}
	}
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
mp.events.addDataHandler('displayUI', (entity, displayData, prevDisplayData) => {
    if (entity === mp.players.local) {
        mp.gui.chat.push('addDataHandler -> inventoryInfo:');
        mp.gui.chat.push(JSON.stringify(displayData));
    }
});


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class CEFBrowser {
    constructor(url) {
        this.absolute_path = 'package://CEF/build/';
        const self = this;
        this.cursorState = false;
        this.browser = mp.browsers.new(self.absolute_path + url);
    }
    get isActive() {
        return this.browser.active;
    }
    getBrowser() {
        return this.browser;
    }
    getCursorState() {
        return this.cursorState;
    }
    setActive(toggle) {
        this.browser.active = toggle;
    }
    setCursor(state) {
        this.cursorState = state;
        mp.gui.cursor.visible = state;
    }
    setURL(path) {
        this.browser.url = this.absolute_path + path;
    }
}
exports.CEFBrowser = CEFBrowser;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = __webpack_require__(3);
const changeUI_1 = __webpack_require__(5);
let flag = true;
mp.keys.bind(0x09, true, function () {
    if (!mp.players.local.getVariable('isAuth'))
        return;
    flag = !flag;
    mp.gui.chat.push(`uiitems - ${flag}`);
    if (flag) {
        changeUI_1.changeUI(changeUI_1.CEFRoute.UIITEMS);
    }
    else {
        changeUI_1.changeUI(changeUI_1.CEFRoute.CLEAR);
    }
    browser_1.Browser.setCursor(flag);
});


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = __webpack_require__(3);
const changeUI_1 = __webpack_require__(5);
let flag = true;
mp.keys.bind(0x71, true, function () {
    if (!mp.players.local.getVariable('isAuth'))
        return;
    if (!mp.players.local.getVariable('admin'))
        return;
    flag = !flag;
    mp.gui.chat.push(`AI - ${flag}`);
    if (flag) {
        changeUI_1.changeUI(changeUI_1.CEFRoute.ADMININTERFACE);
    }
    else {
        changeUI_1.changeUI(changeUI_1.CEFRoute.CLEAR);
    }
    browser_1.Browser.setCursor(flag);
});


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const displayUI_1 = __webpack_require__(21);
let flag = true;
mp.keys.bind(0x75, true, function () {
    if (!mp.players.local.getVariable('isAuth'))
        return;
    flag = !flag;
    mp.gui.chat.push(JSON.stringify(flag));
    displayUI_1.setDisplayInterface('huds', flag);
});


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const rage_rpc_1 = __webpack_require__(0);
function setDisplayInterface(name, bool) {
    rage_rpc_1.default.callServer('server_set_display', JSON.stringify({ name, bool }));
}
exports.setDisplayInterface = setDisplayInterface;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

let itemPoints = [];
mp.events.addDataHandler("itemPoints", (entity, value, oldValue) => {
    if (entity.type === 'player') {
        if (entity === mp.players.local) {
            itemPoints = value;
        }
    }
});
mp.events.add('render', () => {
    mp.game.graphics.drawText(`Точек для лута: ${itemPoints.length} | Индексы колшипов: ${itemPoints}`, [0.5, 0.005], {
        font: 4,
        color: [255, 255, 255, 255],
        scale: [0.5, 0.5],
        outline: true
    });
    mp.game.graphics.drawText(`[TAB] Инвентарь:`, [0.9, 0.8], { font: 4, color: [255, 255, 255, 255], scale: [0.3, 0.4], outline: true });
    mp.game.graphics.drawText(`[G] Зайти в инвентарь машины:`, [0.9, 0.83], { font: 4, color: [255, 255, 255, 255], scale: [0.3, 0.4], outline: true });
    mp.game.graphics.drawText(`[F6] HUDS:`, [0.9, 0.86], { font: 4, color: [255, 255, 255, 255], scale: [0.3, 0.4], outline: true });
    const pos = mp.players.local.position;
    mp.game.graphics.drawText(`[${pos.x}]-[${pos.y}]-[${pos.z}]`, [0.5, 0.95], { font: 4, color: [255, 255, 255, 255], scale: [0.7, 0.6], outline: true });
});


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = __webpack_require__(1);
Player_1.playerInstance.init();
Player_1.playerInstance.hungerInit();
Player_1.playerInstance.dehydrationInit();


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const rage_rpc_1 = __webpack_require__(0);
function serverSetHealth(health) {
    rage_rpc_1.callServer('server_set_health', health);
}
exports.serverSetHealth = serverSetHealth;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const constants = {
    DECREMENT_DEHYDRATION_HEALTH: 3,
    DECREMENT_DEHYDRATION_BAR: 1,
    DECREMENT_TIME: 5000,
    CHECK_TIME: 30000,
    DECREMENT_HUNGER_HEALTH: 3,
    DECREMENT_HUNGER_BAR: 1,
    DECREMENT_DEHYDRATION_TIME: 5000,
    CHECK_DEHYDRATION_TIME: 30000,
};
exports.constants = constants;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = __webpack_require__(1);
mp.events.add("playerSpawn", () => {
    Player_1.playerInstance.setHunger(75);
    Player_1.playerInstance.setDehydration(75);
    Player_1.playerInstance.clearHungerDecrement();
    Player_1.playerInstance.clearDehydrationDecrement();
});
mp.events.add('playerQuit', () => {
    Player_1.playerInstance.clearHungerDecrement();
    Player_1.playerInstance.clearCheckHungerInterval();
});
mp.events.add("playerEnterVehicle", (vehicle, seat) => {
    vehicle.setInvincible(false);
});
mp.events.add('render', () => {
    if (mp.players.local.isSprinting()) {
        mp.game.player.restoreStamina(100);
    }
});
mp.events.addDataHandler('hunger', (entity, hunger, prevHunger) => {
    if (entity === mp.players.local) {
        Player_1.playerInstance.setHunger(hunger);
    }
});
mp.events.addDataHandler('dehydration', (entity, dehydration, prevDehydration) => {
    if (entity === mp.players.local) {
        Player_1.playerInstance.setDehydration(dehydration);
    }
});
mp.events.addDataHandler('temperature', (entity, temperature, prevTemperature) => {
    if (entity === mp.players.local) {
    }
});


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const rage_rpc_1 = __webpack_require__(0);
const LootCreate_1 = __webpack_require__(28);
const Player_1 = __webpack_require__(1);
rage_rpc_1.register('client_set_loot_create', (objectHash) => {
    mp.gui.chat.push('CLIENT -> client_set_loot_create');
    LootCreate_1.lootCreate.removeObject();
    const pos = mp.players.local.position;
    pos.z = mp.game.gameplay.getGroundZFor3dCoord(pos.x, pos.y, pos.z, parseFloat('0'), false);
    LootCreate_1.lootCreate.createObject(objectHash, pos);
    const createdObject = LootCreate_1.lootCreate.getCurrentObject();
    mp.gui.chat.push(`createdObject: ${JSON.stringify(createdObject)}`);
    return createdObject;
});
rage_rpc_1.register('client_set_loot_create_rotation', (pos) => {
    return LootCreate_1.lootCreate.setRotation(pos[0], pos[1], pos[2]);
});
rage_rpc_1.register('client_set_loot_create_hash', (hash) => {
    mp.gui.chat.push('client_set_loot_create_hash');
    return LootCreate_1.lootCreate.changeModel(hash);
});
rage_rpc_1.register('client_get_any_prop', (name) => {
    switch (name) {
        case 'hunger': {
            return Player_1.playerInstance.getHunger();
        }
        case 'dehydration': {
            return Player_1.playerInstance.getDehydration();
        }
        default: {
            return false;
        }
    }
});


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class LootCreate {
    constructor(player) {
        this.player = player;
        this.player.customData.admin.lootCreate = {};
    }
    setRotation(x, y, z) {
        const currentObject = this.getCurrentObject();
        if (currentObject) {
            const object = this.getObjectById(currentObject.objectId);
            if (object) {
                object.setRotation(x, y, z, 1, true);
                mp.gui.chat.push('Вращение объекта было изменено.');
            }
        }
    }
    getObjectById(id) {
        if (mp.objects.exists(id)) {
            return mp.objects.at(id);
        }
        else {
            mp.gui.chat.push('Объект не найден.');
            return false;
        }
    }
    removeObject() {
        const currentObject = this.getCurrentObject();
        if (currentObject) {
            const object = this.getObjectById(currentObject.objectId);
            if (object) {
                object.destroy();
            }
            this.player.customData.admin.lootCreate.currentObject = {};
        }
    }
    changeModel(objectHash) {
        const obj = this.getObjectById(this.getCurrentObject().objectId);
        if (obj) {
            this.createObject(objectHash, obj.position, obj.getRotation(1));
        }
    }
    createObject(objectHash, position, rotation = new mp.Vector3(0, 0, 0)) {
        const obj = mp.objects.new(mp.game.joaat(objectHash), position, {
            rotation: rotation,
            alpha: 255,
            dimension: this.player.dimension,
        });
        this.setCurrentObject(obj.id, objectHash, position, rotation);
    }
    setCurrentObject(objectId, objectHash, p, r) {
        this.removeObject();
        this.player.customData.admin.lootCreate.currentObject = { objectId, objectHash, position: [p.x, p.y, p.z], rotation: [r.x, r.y, r.z] };
    }
    getCurrentObject() {
        const currentObject = this.player.customData.admin.lootCreate.currentObject;
        if (currentObject) {
            return currentObject;
        }
        else {
            mp.gui.chat.push('Текущий объект не установлен.');
            false;
        }
    }
}
const lootCreate = new LootCreate(mp.players.local);
exports.lootCreate = lootCreate;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const callBrowser_1 = __webpack_require__(4);
const localPlayer = mp.players.local;
let lastArmor = localPlayer.getArmour();
mp.events.add('render', function () {
    if (lastArmor !== localPlayer.getArmour()) {
        lastArmor = localPlayer.getArmour();
        callBrowser_1.cefSetHudsValue(callBrowser_1.HudsType.CEF_SET_ARMOR_HUDS, localPlayer.getArmour());
        mp.gui.chat.push(`ARMOR: ${lastArmor}`);
    }
});
mp.events.add("playerSpawn", () => {
    callBrowser_1.cefSetHudsValue(callBrowser_1.HudsType.CEF_SET_ARMOR_HUDS, localPlayer.getArmour());
});


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const callBrowser_1 = __webpack_require__(4);
const localPlayer = mp.players.local;
let lastHealth = 0;
mp.events.add('render', function () {
    if (lastHealth !== localPlayer.getHealth()) {
        lastHealth = localPlayer.getHealth();
        mp.gui.chat.push(`HP: ${lastHealth}`);
        callBrowser_1.cefSetHudsValue(callBrowser_1.HudsType.CEF_SET_HEALTH_HUDS, lastHealth);
    }
});
mp.events.add("playerSpawn", () => {
    callBrowser_1.cefSetHudsValue(callBrowser_1.HudsType.CEF_SET_HEALTH_HUDS, localPlayer.getHealth());
});


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = __webpack_require__(1);
const callBrowser_1 = __webpack_require__(4);
let lastHunger = 0;
mp.events.add('render', function () {
    if (lastHunger !== Player_1.playerInstance.getHunger()) {
        lastHunger = Player_1.playerInstance.getHunger();
        mp.gui.chat.push(`HG: ${lastHunger}`);
        callBrowser_1.cefSetHudsValue(callBrowser_1.HudsType.CEF_SET_HUNGER_HUDS, lastHunger);
    }
});
mp.events.add("playerSpawn", () => {
    callBrowser_1.cefSetHudsValue(callBrowser_1.HudsType.CEF_SET_HUNGER_HUDS, Player_1.playerInstance.getHunger());
});


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = __webpack_require__(1);
const callBrowser_1 = __webpack_require__(4);
let lastDehydration = 0;
mp.events.add('render', function () {
    if (lastDehydration !== Player_1.playerInstance.getDehydration()) {
        lastDehydration = Player_1.playerInstance.getDehydration();
        mp.gui.chat.push(`DEH: ${lastDehydration}`);
        callBrowser_1.cefSetHudsValue(callBrowser_1.HudsType.CEF_SET_DEHYDRATION_HUDS, lastDehydration);
    }
});
mp.events.add("playerSpawn", () => {
    callBrowser_1.cefSetHudsValue(callBrowser_1.HudsType.CEF_SET_DEHYDRATION_HUDS, Player_1.playerInstance.getDehydration());
});


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Character_1 = __webpack_require__(8);
const rage_rpc_1 = __webpack_require__(0);
const Camera_1 = __webpack_require__(6);
rage_rpc_1.register('client_character_set_heading', (h) => {
    Character_1.character.setHeading(h);
});
rage_rpc_1.register('client_character_set_face', ({ index, feature }) => {
    Character_1.character.setFace(index, feature);
});
rage_rpc_1.register('client_character_set_gender', (gender) => {
    Character_1.character.setGender(gender);
});
rage_rpc_1.register('client_character_set_head_prop', (data) => {
    Character_1.character.setHeadProp(data);
});
rage_rpc_1.register('client_character_reset', () => {
    Character_1.character.reset();
});
rage_rpc_1.register('client_character_set_hair', (dId) => {
    Character_1.character.setHair(dId);
});
rage_rpc_1.register('client_character_set_hair_color', (id) => {
    Character_1.character.setHairColor(id);
});
rage_rpc_1.register('client_character_set_camera_pos', ({ coord, n }) => {
    const pos = Camera_1.PlayerCamera.getCoord('character');
    pos[coord] = n;
    Camera_1.PlayerCamera.setCoord('character', pos);
});
rage_rpc_1.register('client_character_ready', () => {
    return Character_1.character.getCharacterDataForServer();
});
rage_rpc_1.register('client_character_set_overlay', ({ overlayId, index }) => {
    Character_1.character.setHeadOverlay(overlayId, index);
});
rage_rpc_1.register('client_Character_set_eyes', (val) => {
    Character_1.character.setEyeColor(val);
});


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Camera_1 = __webpack_require__(6);
flyCamera();
const playerLocal = mp.players.local;
function flyCamera() {
    let pos;
    let flag = false;
    let count = .3;
    mp.keys.bind(0x58, true, () => {
        flag = !flag;
        playerLocal.freezePosition(flag);
        pos = playerLocal.position;
        Camera_1.PlayerCamera.setCoord('character', pos);
        Camera_1.PlayerCamera.render('character', flag);
    });
    mp.keys.bind(0x25, true, () => {
        pos.x -= count;
        Camera_1.PlayerCamera.setCoord('character', pos);
        getPos();
    });
    mp.keys.bind(0x27, true, () => {
        pos.x += count;
        Camera_1.PlayerCamera.setCoord('character', pos);
        getPos();
    });
    mp.keys.bind(0x26, true, () => {
        pos.y += count;
        Camera_1.PlayerCamera.setCoord('character', pos);
        getPos();
    });
    mp.keys.bind(0x28, true, () => {
        pos.y -= count;
        Camera_1.PlayerCamera.setCoord('character', pos);
        getPos();
    });
    mp.keys.bind(0x20, true, () => {
        pos.z += count;
        Camera_1.PlayerCamera.setCoord('character', pos);
        getPos();
    });
    mp.keys.bind(0x11, true, () => {
        pos.z -= count;
        Camera_1.PlayerCamera.setCoord('character', pos);
        getPos();
    });
    function getPos() {
        mp.gui.chat.push(JSON.stringify(pos));
    }
}


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const rage_rpc_1 = __webpack_require__(0);
const Camera_1 = __webpack_require__(6);
const changeUI_1 = __webpack_require__(5);
const Character_1 = __webpack_require__(8);
const playerLocal = mp.players.local;
rage_rpc_1.register('client_before_auth_init', () => {
    Character_1.character.reset();
    Character_1.character.faceUpdate();
    Character_1.character.headUpdate();
    const playerDefaultPos = new mp.Vector3(-2167, 5182, 15.5);
    const cameraDefaultPos = new mp.Vector3(-2167, 5181, 16.1);
    playerLocal.position = playerDefaultPos;
    Camera_1.PlayerCamera.create('character', cameraDefaultPos, new mp.Vector3(0, 0, 0), 60);
    Camera_1.PlayerCamera.render('character', true);
    setTimeout(_ => {
        Character_1.character.setHeading(180);
    }, 500);
    mp.game.graphics.pushScaleformMovieFunction(1, "SET_HEALTH_ARMOUR_BAR_VISIBLE");
    mp.game.graphics.pushScaleformMovieFunctionParameterBool(false);
    mp.game.graphics.popScaleformMovieFunctionVoid();
    mp.game.ui.setRadarBigmapEnabled(false, false);
    mp.game.ui.displayRadar(false);
    playerLocal.setHelmet(false);
    playerLocal.freezePosition(false);
    mp.gui.chat.activate(false);
    setTimeout(() => { mp.gui.cursor.show(true, true); }, 500);
    mp.gui.chat.push('client_before_auth_init');
});
rage_rpc_1.register('client_after_auth_init', () => {
    mp.players.local.freezePosition(false);
    mp.gui.cursor.show(false, false);
    mp.gui.cursor.visible = false;
    mp.gui.chat.activate(true);
    Camera_1.PlayerCamera.render('character', false);
    changeUI_1.changeUI(changeUI_1.CEFRoute.CLEAR);
    mp.gui.chat.push('client_after_auth_init');
});


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const rage_rpc_1 = __webpack_require__(0);
rage_rpc_1.register('client_get_ammo_in_clip', (player) => {
    return player.getAmmoInClip();
});


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const rage_rpc_1 = __webpack_require__(0);
mp.keys.bind(0x52, true, function () {
    let countAmmo = mp.players.local.getAmmoInClip(mp.players.local.weapon);
    let maxAmmo = mp.game.weapon.getWeaponClipSize(mp.players.local.weapon);
    let ammo = maxAmmo - countAmmo;
    rage_rpc_1.callServer('server_get_ammo', ammo);
    mp.gui.chat.push('R key is pressed. 1111');
});


/***/ })
/******/ ]);
//# sourceMappingURL=index.map