import './handlers';
import './commands';
import './events';
import { Loot } from './Loot/Loot';
import { Colshape } from './entities/Colshape';
import { CreateItemParams, LootSpawn } from '../interfaces';

const invAPI = require('@modules/inventory-api');

invAPI.addItem("item_bodyarmor", "Body Armor", "Refills your armor when used.", 
(player: PlayerMp, inventoryIndex: number, itemKey: string, data: object) => {
    player.armour = 100;
    player.outputChatBox("Armor refilled.");
    player.removeItem(inventoryIndex);
});

invAPI.addItem("item_ak47Ammo", "AK-47 AMMO", "ammo......", 
(player: PlayerMp, inventoryIndex: number, itemKey: string, data: object) => {
    player.outputChatBox("Ты подобрал патроны на калаш.");

    console.log('--> data', data);

    player.removeItem(inventoryIndex);
});

const item_bodyarmor: Item = {
    key: 'item_bodyarmor',
    amount: 100,
    data: {
        level: 3
    }
};

const item_ak47Ammo: Item = {
    key: 'item_ak47Ammo',
    amount: 1,
    data: {
        ammo: 10 // 
    }
};

const item_ak47Weapon: Item = {
    key: 'item_ak47Weapon',
    amount: 5,
    data: {
        health: 100
    }
};

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
loot.createLootPoint([item_bodyarmor, item_ak47Ammo, item_ak47Weapon], createItemParams);
///

/// Создание точки для лута.
const createItemParams2: CreateItemParams = {
    colshapePosition: new mp.Vector3(110, 6627, 31),
    objectPosition: new mp.Vector3(110, 6627, 31),
    labelPosition: new mp.Vector3(110, 6627, 31),
    range: 3,
    labelText: LootSpawn.RELOAD,
    objectHash: 'gr_prop_gr_offchair_01a',
};

const loot2 = new Loot();
loot2.createLootPoint([item_bodyarmor, item_ak47Ammo, item_ak47Weapon], createItemParams2);
///
