import { cefSetHudsValue, HudsType } from "../player/callBrowser";

// Установка брони игроку для CEF.
const localPlayer = mp.players.local;
let lastArmor = localPlayer.getArmour();
mp.events.add('render', function() {
    if (lastArmor !== localPlayer.getArmour()) {
        lastArmor = localPlayer.getArmour();
        cefSetHudsValue(HudsType.CEF_SET_ARMOR_HUDS, localPlayer.getArmour());
        mp.gui.chat.push(`ARMOR: ${lastArmor}`);
    }
});

// Установка текущего ХП при спавне игрока.
mp.events.add("playerSpawn", () => {
    cefSetHudsValue(HudsType.CEF_SET_ARMOR_HUDS, localPlayer.getArmour());
});