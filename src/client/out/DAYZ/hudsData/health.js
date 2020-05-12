"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CallRPC_1 = require("../CallRPC");
const localPlayer = mp.players.local;
let lastHealth = 0;
mp.events.add('render', function () {
    if (lastHealth !== localPlayer.getHealth()) {
        lastHealth = localPlayer.getHealth();
        mp.gui.chat.push(`HP: ${lastHealth}`);
        CallRPC_1.callRPC.cefSetHudsValue(CallRPC_1.HudsType.CEF_SET_HEALTH_HUDS, lastHealth);
    }
});
mp.events.add("playerSpawn", () => {
    CallRPC_1.callRPC.cefSetHudsValue(CallRPC_1.HudsType.CEF_SET_HEALTH_HUDS, localPlayer.getHealth());
});
