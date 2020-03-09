import { invBrowser } from "../../../CEF";


mp.events.addDataHandler('inventoryInfo', (entity, value, oldValue) => {
    mp.gui.chat.push('addDataHandler -> inventoryInfo:');
    
    if (entity === mp.players.local) {
         mp.gui.chat.push(JSON.stringify(value));
     }
});

// Каждое изменение инвентаря отправляет в CEF.
mp.events.addDataHandler('inventory', (entity, value, oldValue) => {
    mp.gui.chat.push('addDataHandler -> inventory:');
    
    if (entity === mp.players.local) {
         mp.gui.chat.push(JSON.stringify(value));

        invBrowser.getBrowser().execute(`
            setInventoryBlockItem(5);
        `);
     }
});