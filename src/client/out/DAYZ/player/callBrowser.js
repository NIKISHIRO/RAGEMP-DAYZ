"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rage_rpc_1 = require("../../rage-rpc");
const CEFBrowser_1 = require("../CEF/CEFBrowser");
var HudsType;
(function (HudsType) {
    HudsType["CEF_SET_HEALTH_HUDS"] = "cef_set_health_huds";
    HudsType["CEF_SET_HUNGER_HUDS"] = "cef_set_hunger_huds";
    HudsType["CEF_SET_ARMOR_HUDS"] = "cef_set_armor_huds";
    HudsType["CEF_SET_DEHYDRATION_HUDS"] = "cef_set_dehydration_huds";
})(HudsType = exports.HudsType || (exports.HudsType = {}));
function cefSetHudsValue(type, value) {
    rage_rpc_1.callBrowser(CEFBrowser_1.Browser.getBrowser(), type, value);
}
exports.cefSetHudsValue = cefSetHudsValue;
function cefSendLootCreateData(data) {
    rage_rpc_1.callBrowser(CEFBrowser_1.Browser.getBrowser(), 'cef_set_loot_create_data', data);
}
exports.cefSendLootCreateData = cefSendLootCreateData;
