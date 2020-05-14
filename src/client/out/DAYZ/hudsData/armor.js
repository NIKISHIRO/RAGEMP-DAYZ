"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CallRPC_1 = require("../CallRPC");
const localPlayer = mp.players.local;
let lastArmor = localPlayer.getArmour();
mp.events.add('render', function () {
    if (lastArmor !== localPlayer.getArmour()) {
        lastArmor = localPlayer.getArmour();
        CallRPC_1.callRPC.cefSetHudsValue(CallRPC_1.HudsType.CEF_SET_ARMOR_HUDS, localPlayer.getArmour());
        mp.gui.chat.push(`ARMOR: ${lastArmor}`);
    }
});
mp.events.add("playerSpawn", () => {
    CallRPC_1.callRPC.cefSetHudsValue(CallRPC_1.HudsType.CEF_SET_ARMOR_HUDS, localPlayer.getArmour());
});
