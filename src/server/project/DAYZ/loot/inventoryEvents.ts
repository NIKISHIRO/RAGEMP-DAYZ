import { storageScript } from "../Storage";

storageScript.on("itemDefined", (key, name, description) => {
    console.log(`Item defined, key: ${key} | name: ${name} | description: ${description}`);
});

storageScript.on("itemAdded", (player: PlayerMp, key, amount, data) => {
    console.log(`${player.name} received ${amount}x ${key}.`);
});

storageScript.on("itemUsed", (player: PlayerMp, invIdx, key, data) => {
    console.log(`${player.name} used ${key}.`);
});

storageScript.on("itemRemoved", (player: PlayerMp, invIdx, key, amount, data) => {
    console.log(`${player.name} lost ${amount}x ${key}.`);
});

storageScript.on("itemRemovedCompletely", (player: PlayerMp, key, data) => {
    console.log(`${player.name} no longer has ${key} (${data ? "with data" : "without data"}) in their inventory.`);
});

storageScript.on("inventoryReplaced", (player: PlayerMp, oldInventory, newInventory) => {
    console.log(`${player.name} had their inventory replaced. (Old item count: ${oldInventory.length}, new: ${newInventory.length})`);
});

export {
    storageScript as itemAPI,
}