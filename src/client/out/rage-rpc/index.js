"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("./util");
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
