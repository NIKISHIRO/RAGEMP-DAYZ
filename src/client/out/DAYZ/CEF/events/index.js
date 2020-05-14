"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
mp.events.addDataHandler('displayUI', (entity, displayData, prevDisplayData) => {
    if (entity === mp.players.local) {
        mp.gui.chat.push('addDataHandler -> inventoryInfo:');
        mp.gui.chat.push(JSON.stringify(displayData));
    }
});
