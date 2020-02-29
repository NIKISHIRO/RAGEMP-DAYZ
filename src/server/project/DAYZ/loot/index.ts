import './handlers';
import './commands';
import './events';
import { Loot } from './Loot';
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

const createItemParams: CreateItemParams = {pos: new mp.Vector3(-1850, 2984, 32), range: 3, labelText: LootSpawn.RELOAD, objectHash: 'gr_prop_gr_offchair_01a'}

const loot = new Loot();
loot.createItemPoint([item_bodyarmor, item_ak47Ammo, item_ak47Weapon], createItemParams);