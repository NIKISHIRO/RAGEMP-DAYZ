import './handlers';
import './commands';
import './events';
import { Loot } from './Loot/Loot';
import { Colshape } from './entities/Colshape';
import { CreateItemParams, LootSpawn } from '../interfaces';
import { EItem } from './Item/Item';
import { DataBodyArmour, DataWeapon } from './Item/interface';

const invAPI = require('@modules/inventory-api');

// INVAPI ITEM EVENTS
invAPI.on("itemDefined", (key, name, description) => {
    console.log(`Item defined, key: ${key} | name: ${name} | description: ${description}`);
});

invAPI.on("itemAdded", (player: PlayerMp, key, amount, data) => {
    player.setVariable('inventory', player._inventory);
    console.log(`${player.name} received ${amount}x ${key}.`);
});

invAPI.on("itemUsed", (player: PlayerMp, invIdx, key, data) => {
    player.setVariable('inventory', player._inventory);
    console.log(`${player.name} used ${key}.`);
});

invAPI.on("itemRemoved", (player: PlayerMp, invIdx, key, amount, data) => {
    player.setVariable('inventory', player._inventory);
    console.log(`${player.name} lost ${amount}x ${key}.`);
});

invAPI.on("itemRemovedCompletely", (player: PlayerMp, key, data) => {
    player.setVariable('inventory', player._inventory);
    console.log(`${player.name} no longer has ${key} (${data ? "with data" : "without data"}) in their inventory.`);
});

invAPI.on("inventoryReplaced", (player: PlayerMp, oldInventory, newInventory) => {
    player.setVariable('inventory', player._inventory);
    console.log(`${player.name} had their inventory replaced. (Old item count: ${oldInventory.length}, new: ${newInventory.length})`);
});

invAPI.addItem("item_bodyarmor", "Body Armor", "Refills your armor when used.", (player, inventoryIndex, itemKey, data) => {
    player.armour = 100;
    player.outputChatBox("Armor refilled.");
    player.removeItem(inventoryIndex);
});

invAPI.addItem("item_armour", "Body Armor", "Refills your armor when used.", 
(player: PlayerMp, inventoryIndex: number, itemKey: string, data: object) => {
    player.armour = 100;
    player.outputChatBox("Armor refilled.");
    player.removeItem(inventoryIndex);
});

invAPI.addItem("item_weapon_ak47", "AK-47 AMMO", "ammo......", 
(player: PlayerMp, inventoryIndex: number, itemKey: string, data: object) => {
    player.outputChatBox("Ты подобрал патроны на калаш.");

    console.log('--> data', data);

    player.removeItem(inventoryIndex);
});

// data-object for inventory.
const dataBodyArmour: DataBodyArmour = {
    defenceLevel: 40,
    name: 'Бронежелет',
    description: 'Бронежелет 3 уровня. Увеличивает ваш армор до 50%',
    weight: 30,
    maxStackCount: 1,
};
const item_armour = EItem.createItem('item_armour', 1, dataBodyArmour);

const dataWeapon: DataWeapon = {
    name: 'Калаш',
    description: 'AK-47.',
    weight: 6,
    clip: 30,
    maxStackCount: 1,
};
const item_weapon_ak47 = EItem.createItem('item_weapon_ak47', 1, dataWeapon);

/// Создание точки для лута.
const createItemParams: CreateItemParams = {
    colshapePosition: new mp.Vector3(-1144, 4909, 220),
    objectPosition: new mp.Vector3(-1144, 4909, 220),
    labelPosition: new mp.Vector3(-1144, 4909, 220),
    range: 3,
    labelText: LootSpawn.RELOAD, 
    objectHash: 'gr_prop_gr_offchair_01a',
};

const loot = new Loot();
loot.createLootPoint([item_armour, item_weapon_ak47], createItemParams);
///