"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("../player/Player");
const CallRPC_1 = require("../CallRPC");
let lastHunger = 0;
mp.events.add('render', function () {
    if (lastHunger !== Player_1.playerInstance.getHunger()) {
        lastHunger = Player_1.playerInstance.getHunger();
        mp.gui.chat.push(`HG: ${lastHunger}`);
        CallRPC_1.callRPC.cefSetHudsValue(CallRPC_1.HudsType.CEF_SET_HUNGER_HUDS, lastHunger);
    }
});
mp.events.add("playerSpawn", () => {
    CallRPC_1.callRPC.cefSetHudsValue(CallRPC_1.HudsType.CEF_SET_HUNGER_HUDS, Player_1.playerInstance.getHunger());
    CallRPC_1.callRPC.serverSetHudProp('hunger', Player_1.playerInstance.getHunger());
});
