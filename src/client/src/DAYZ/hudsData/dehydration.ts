import { playerInstance } from "../player/Player";
import { callRPC, HudsType } from "../CallRPC";

// Установка здоровья игроку для CEF.
let lastDehydration = 0;
mp.events.add('render', function() {
    if (lastDehydration !== playerInstance.getDehydration()) {
        lastDehydration = playerInstance.getDehydration();
        mp.gui.chat.push(`DEH: ${ lastDehydration }`);
        callRPC.cefSetHudsValue(HudsType.CEF_SET_DEHYDRATION_HUDS, lastDehydration);   
    }
});

// Установка текущего ХП при спавне игрока.
mp.events.add("playerSpawn", () => {
    callRPC.cefSetHudsValue(HudsType.CEF_SET_DEHYDRATION_HUDS, playerInstance.getDehydration());
    callRPC.serverSetHudProp('dehydration', playerInstance.getDehydration());
});