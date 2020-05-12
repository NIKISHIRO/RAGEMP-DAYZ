"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("../player/Player");
const CallRPC_1 = require("../CallRPC");
let lastDehydration = 0;
mp.events.add('render', function () {
    if (lastDehydration !== Player_1.playerInstance.getDehydration()) {
        lastDehydration = Player_1.playerInstance.getDehydration();
        mp.gui.chat.push(`DEH: ${lastDehydration}`);
        CallRPC_1.callRPC.cefSetHudsValue(CallRPC_1.HudsType.CEF_SET_DEHYDRATION_HUDS, lastDehydration);
    }
});
mp.events.add("playerSpawn", () => {
    CallRPC_1.callRPC.cefSetHudsValue(CallRPC_1.HudsType.CEF_SET_DEHYDRATION_HUDS, Player_1.playerInstance.getDehydration());
    CallRPC_1.callRPC.serverSetHudProp('dehydration', Player_1.playerInstance.getDehydration());
});
