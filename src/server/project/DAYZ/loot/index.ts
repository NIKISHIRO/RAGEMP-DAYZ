import './handlers';
import './commands';
import './events';
import './cef';
import { Loot } from './Loot';
import { ItemKey, DataClothes } from '../types';

const invAPI = require('@modules/inventory-api');

// INVAPI ITEM EVENTS
invAPI.on("itemDefined", (key, name, description) => {
    console.log(`Item defined, key: ${key} | name: ${name} | description: ${description}`);
});

invAPI.on("itemAdded", (player: PlayerMp, key, amount, data) => {

    console.log(`${player.name} received ${amount}x ${key}.`);
});

invAPI.on("itemUsed", (player: PlayerMp, invIdx, key, data) => {

    console.log(`${player.name} used ${key}.`);
});

invAPI.on("itemRemoved", (player: PlayerMp, invIdx, key, amount, data) => {

    console.log(`${player.name} lost ${amount}x ${key}.`);
});

invAPI.on("itemRemovedCompletely", (player: PlayerMp, key, data) => {

    console.log(`${player.name} no longer has ${key} (${data ? "with data" : "without data"}) in their inventory.`);
});

invAPI.on("inventoryReplaced", (player: PlayerMp, oldInventory, newInventory) => {

    console.log(`${player.name} had their inventory replaced. (Old item count: ${oldInventory.length}, new: ${newInventory.length})`);
});

invAPI.addItem(ItemKey.ITEM_ARMOR, "Body Armor", "Refills your armor when used.", (player, inventoryIndex, itemKey, data) => {
    player.armour = 100;
    player.outputChatBox("Armor refilled.");
    player.removeItem(inventoryIndex);
});

invAPI.addItem(ItemKey.ITEM_AMMO_SHOTGUN, "Патроны на шотик", "Refills your armor when used.", 
(player: PlayerMp, inventoryIndex: number, itemKey: string, data: object) => {
    player.armour = 100;
    player.outputChatBox("Armor refilled.");
    player.removeItem(inventoryIndex);
});

invAPI.addItem(ItemKey.ITEM_WEAPON_AK47, "AK-47 AMMO", "ammo......", 
(player: PlayerMp, inventoryIndex: number, itemKey: string, data: object) => {
    player.removeItem(inventoryIndex);
});

invAPI.addItem(ItemKey.ITEM_CLOTHES_MASK_1, ItemKey.ITEM_CLOTHES_MASK_1, ItemKey.ITEM_CLOTHES_MASK_1, (player: PlayerMp, inventoryIndex: number, itemKey: string, data: DataClothes) => {
    player.changeClothes(data.componentId, data.drawable, 1, true);
    player.removeItem(inventoryIndex);
});

const colshape = Loot.createColshape(new mp.Vector3(-1165, 4926, 223));
const object = Loot.createObject(new mp.Vector3(-1165, 4926, 223));
const label = Loot.createLabel(new mp.Vector3(-1165, 4926, 223));
const blip = Loot.createBlip(new mp.Vector3(-1165, 4926, 223));
const loot = new Loot(colshape, object, label, blip);

const items = [
    loot.createWeaponItem('Калаш', 'Пусто.', 4, 1, 3),
    loot.createBodyArmorItem('Броня', 'Пустое описание.', 8, 40, 1, 1),
    loot.createItem(ItemKey.ITEM_AMMO_SHOTGUN, 'Shotgun Shell', 'Патроны на дробовик', .2, 30, 30000000),
    loot.createClothesItem(ItemKey.ITEM_CLOTHES_MASK_1, 'Маска', 'Маска..', 1, 1, .2, 30),
];

loot.createLootPoint(items);