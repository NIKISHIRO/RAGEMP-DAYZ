"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rage_rpc_1 = require("../../rage-rpc");
function serverSetHealth(health) {
    rage_rpc_1.callServer('server_set_health', health);
}
exports.serverSetHealth = serverSetHealth;
