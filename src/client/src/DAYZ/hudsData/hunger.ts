import { playerInstance } from "../player/Player";
import { callRPC, HudsType } from "../CallRPC";

// Установка здоровья игроку для CEF.
let lastHunger = 0;
mp.events.add('render', function() {
    if (lastHunger !== playerInstance.getHunger()) {
        lastHunger = playerInstance.getHunger();
        mp.gui.chat.push(`HG: ${ lastHunger }`);
        callRPC.cefSetHudsValue(HudsType.CEF_SET_HUNGER_HUDS, lastHunger);
    }
});

// Установка текущего ХП при спавне игрока.
mp.events.add("playerSpawn", () => {
    callRPC.cefSetHudsValue(HudsType.CEF_SET_HUNGER_HUDS, playerInstance.getHunger());
    callRPC.serverSetHudProp('hunger', playerInstance.getHunger());
});