import './handlers';
import './commands';
import './events';
import './cef';
import { Loot } from './Loot/Loot';
import { Colshape } from './entities/Colshape';
import { CreateItemParams, LootSpawn, InventoryInfo } from '../interfaces';
import { EItem } from './Item/Item';
import { ItemKey } from '../types';

const invAPI = require('@modules/inventory-api');

// INVAPI ITEM EVENTS
invAPI.on("itemDefined", (key, name, description) => {
    console.log(`Item defined, key: ${key} | name: ${name} | description: ${description}`);
});

invAPI.on("itemAdded", (player: PlayerMp, key, amount, data) => {
    const inventoryInfo: InventoryInfo = {
        inventory: player._inventory,
        maxSlots: 8
    };
    player.setVariable('inventoryInfo', inventoryInfo);
    console.log(`${player.name} received ${amount}x ${key}.`);
});

invAPI.on("itemUsed", (player: PlayerMp, invIdx, key, data) => {
    const inventoryInfo: InventoryInfo = {
        inventory: player._inventory,
        maxSlots: 8
    };
    player.setVariable('inventoryInfo', inventoryInfo);
    console.log(`${player.name} used ${key}.`);
});

invAPI.on("itemRemoved", (player: PlayerMp, invIdx, key, amount, data) => {
    const inventoryInfo: InventoryInfo = {
        inventory: player._inventory,
        maxSlots: 8
    };
    player.setVariable('inventoryInfo', inventoryInfo);
    console.log(`${player.name} lost ${amount}x ${key}.`);
});

invAPI.on("itemRemovedCompletely", (player: PlayerMp, key, data) => {
    const inventoryInfo: InventoryInfo = {
        inventory: player._inventory,
        maxSlots: 8
    };
    player.setVariable('inventoryInfo', inventoryInfo);
    console.log(`${player.name} no longer has ${key} (${data ? "with data" : "without data"}) in their inventory.`);
});

invAPI.on("inventoryReplaced", (player: PlayerMp, oldInventory, newInventory) => {
    const inventoryInfo: InventoryInfo = {
        inventory: player._inventory,
        maxSlots: 8
    };
    player.setVariable('inventoryInfo', inventoryInfo);
    console.log(`${player.name} had their inventory replaced. (Old item count: ${oldInventory.length}, new: ${newInventory.length})`);
});

invAPI.addItem(ItemKey.ITEM_ARMOR, "Body Armor", "Refills your armor when used.", (player, inventoryIndex, itemKey, data) => {
    player.armour = 100;
    player.outputChatBox("Armor refilled.");
    player.removeItem(inventoryIndex);
});

invAPI.addItem(ItemKey.ITEM_ARMOR, "Body Armor", "Refills your armor when used.", 
(player: PlayerMp, inventoryIndex: number, itemKey: string, data: object) => {
    player.armour = 100;
    player.outputChatBox("Armor refilled.");
    player.removeItem(inventoryIndex);
});

invAPI.addItem(ItemKey.ITEM_WEAPON_AK47, "AK-47 AMMO", "ammo......", 
(player: PlayerMp, inventoryIndex: number, itemKey: string, data: object) => {
    player.outputChatBox("Ты подобрал патроны на калаш.");

    console.log('--> data', data);

    player.removeItem(inventoryIndex);
});

const loot = new Loot();
const createItemParams: CreateItemParams = {
    colshapePosition: new mp.Vector3(-1165, 4926, 223),
    objectPosition: new mp.Vector3(-1165, 4926, 223),
    labelPosition: new mp.Vector3(-1165, 4926, 223),
    range: 3,
    labelText: LootSpawn.RELOAD,
    objectHash: 'gr_prop_gr_offchair_01a',
};   
const items = [
    loot.createBodyArmorItem('Броня', 'Пустое описание.', 40, 1, 1), 
    loot.createWeaponItem('Калаш', 'Пусто.', 30, 1, 3),
];

loot.spawn(items, createItemParams);