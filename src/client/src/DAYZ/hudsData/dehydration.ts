import { playerInstance } from "../player/Player";
import { cefSetHudsValue, HudsType } from "../player/callBrowser";

// Установка здоровья игроку для CEF.
let lastDehydration = 0;
mp.events.add('render', function() {
    if (lastDehydration !== playerInstance.getDehydration()) {
        lastDehydration = playerInstance.getDehydration();
        mp.gui.chat.push(`DEH: ${ lastDehydration }`);
        cefSetHudsValue(HudsType.CEF_SET_DEHYDRATION_HUDS, lastDehydration);   
    }
});

// Установка текущего ХП при спавне игрока.
mp.events.add("playerSpawn", () => {
    cefSetHudsValue(HudsType.CEF_SET_DEHYDRATION_HUDS, playerInstance.getDehydration());
});