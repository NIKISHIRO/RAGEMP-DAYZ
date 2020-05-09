import { playerInstance } from "../player/Player";
import { cefSetHudsValue, HudsType } from "../player/callBrowser";

// Установка здоровья игроку для CEF.
let lastHunger = 0;
mp.events.add('render', function() {
    if (lastHunger !== playerInstance.getHunger()) {
        lastHunger = playerInstance.getHunger();
        mp.gui.chat.push(`HG: ${ lastHunger }`);
        cefSetHudsValue(HudsType.CEF_SET_HUNGER_HUDS, lastHunger);
    }
});

// Установка текущего ХП при спавне игрока.
mp.events.add("playerSpawn", () => {
    cefSetHudsValue(HudsType.CEF_SET_HUNGER_HUDS, playerInstance.getHunger());
});