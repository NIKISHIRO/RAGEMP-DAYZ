import { callRPC, HudsType } from "../CallRPC";

// Установка здоровья игроку для CEF.
const localPlayer = mp.players.local;
let lastHealth = 0;
mp.events.add('render', function() {
    if (lastHealth !== localPlayer.getHealth()) {
        lastHealth = localPlayer.getHealth();
        mp.gui.chat.push(`HP: ${lastHealth}`);
        callRPC.cefSetHudsValue(HudsType.CEF_SET_HEALTH_HUDS, lastHealth);
    }
});

// Установка текущего ХП при спавне игрока.
mp.events.add("playerSpawn", () => {
    callRPC.cefSetHudsValue(HudsType.CEF_SET_HEALTH_HUDS, localPlayer.getHealth());
});