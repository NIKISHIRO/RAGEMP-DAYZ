// АПИ Инвентаря.
const invAPI = require('@modules/inventory-api');

invAPI.on("[INVAPI]: itemDefined", (key: string, name: string, description: string) => {
    console.log(`Item defined, key: ${key} | name: ${name} | description: ${description}`);
});

invAPI.on("[INVAPI]: itemAdded", (player: PlayerMp, key: string, amount: number, data: object[]) => {
    console.log(`${player.name} received ${amount}x ${key}.`);
});

invAPI.on("[INVAPI]: itemUsed", (player: PlayerMp, invIdx: number, key: string, data: object[]) => {
    console.log(`${player.name} used ${key}.`);
});

invAPI.on("[INVAPI]: itemRemoved", (player: PlayerMp, invIdx: number, key: string, amount: number, data: object[]) => {
    console.log(`${player.name} lost ${amount}x ${key}.`);
});

invAPI.on("[INVAPI]: itemRemovedCompletely", (player: PlayerMp, key: string, data: object[]) => {
    console.log(`${player.name} no longer has ${key} (${data ? "with data" : "without data"}) in their inventory.`);
});

invAPI.on("[INVAPI]: inventoryReplaced", (player: PlayerMp, oldInventory: Item[], newInventory: Item[]) => {
    console.log(`${player.name} had their inventory replaced. (Old item count: ${oldInventory.length}, new: ${newInventory.length})`);
});