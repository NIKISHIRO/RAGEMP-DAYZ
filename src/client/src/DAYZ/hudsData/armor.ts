import { callRPC, HudsType } from "../CallRPC";

// Установка брони игроку для CEF.
const localPlayer = mp.players.local;
let lastArmor = localPlayer.getArmour();
mp.events.add('render', function() {
    if (lastArmor !== localPlayer.getArmour()) {
        lastArmor = localPlayer.getArmour();
        callRPC.cefSetHudsValue(HudsType.CEF_SET_ARMOR_HUDS, localPlayer.getArmour());
        mp.gui.chat.push(`ARMOR: ${lastArmor}`);
    }
});

// Установка текущего ХП при спавне игрока.
mp.events.add("playerSpawn", () => {
    callRPC.cefSetHudsValue(HudsType.CEF_SET_ARMOR_HUDS, localPlayer.getArmour());
});