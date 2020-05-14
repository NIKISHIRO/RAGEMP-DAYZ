"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rage_rpc_1 = require("../../../rage-rpc");
function setDisplayInterface(name, bool) {
    rage_rpc_1.default.callServer('server_set_display', JSON.stringify({ name, bool }));
}
exports.setDisplayInterface = setDisplayInterface;
