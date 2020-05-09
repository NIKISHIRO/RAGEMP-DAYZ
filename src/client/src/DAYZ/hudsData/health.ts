import { HudsType, cefSetHudsValue } from "../player/callBrowser";

// Установка здоровья игроку для CEF.
const localPlayer = mp.players.local;
let lastHealth = 0;
mp.events.add('render', function() {
    if (lastHealth !== localPlayer.getHealth()) {
        lastHealth = localPlayer.getHealth();
        mp.gui.chat.push(`HP: ${lastHealth}`);
        cefSetHudsValue(HudsType.CEF_SET_HEALTH_HUDS, lastHealth);
    }
});

// Установка текущего ХП при спавне игрока.
mp.events.add("playerSpawn", () => {
    cefSetHudsValue(HudsType.CEF_SET_HEALTH_HUDS, localPlayer.getHealth());
});