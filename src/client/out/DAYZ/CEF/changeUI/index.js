"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rage_rpc_1 = require("../../../rage-rpc");
var CEFRoute;
(function (CEFRoute) {
    CEFRoute["ADMININTERFACE"] = "AdminInterface";
    CEFRoute["UIITEMS"] = "UIItems";
    CEFRoute["CLEAR"] = "clear";
    CEFRoute["START_MENU"] = "StartMenu";
    CEFRoute["CHARACTER"] = "CHARACTER";
})(CEFRoute = exports.CEFRoute || (exports.CEFRoute = {}));
function changeUI(route) {
    rage_rpc_1.default.callServer('server_change_UI', route);
}
exports.changeUI = changeUI;
