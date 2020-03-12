import { invBrowser } from "../../../CEF";
import { InventoryInfo, Item } from "../../../interfaces";

// mp.events.addDataHandler('inventoryInfo', (entity, inventoryInfo: InventoryInfo, oldValue: InventoryInfo) => {
//     if (entity === mp.players.local) {
//         mp.gui.chat.push('addDataHandler -> inventoryInfo:');
//         mp.gui.chat.push(JSON.stringify(inventoryInfo));

//         invBrowser.getBrowser().execute(`
//             setInventoryInfo(${JSON.stringify(inventoryInfo)});
//         `);
//      }
// });

mp.events.add('c_set_inventory_slots', (count: number) => {
    invBrowser.getBrowser().execute(`
        c_set_inventory_slots(${count});
    `);
});

mp.events.add('c_add_inventory_item', (strItem: string) => {
    const item: Item = JSON.parse(strItem);
    console.log('c_add_inventory_item');
    console.log('item', item);

    invBrowser.getBrowser().execute(`
        c_add_inventory_item(${strItem});
    `);
});