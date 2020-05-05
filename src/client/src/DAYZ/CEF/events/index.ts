import { DisplayUI } from "../displayUI";

// Отлавливает изменения св-ва displayUI у игрока и отправляет
mp.events.addDataHandler('displayUI', (entity: PlayerMp, displayData: DisplayUI, prevDisplayData: DisplayUI) => {
    if (entity === mp.players.local) {
        mp.gui.chat.push('addDataHandler -> inventoryInfo:');
        mp.gui.chat.push(JSON.stringify(displayData));
     }
});