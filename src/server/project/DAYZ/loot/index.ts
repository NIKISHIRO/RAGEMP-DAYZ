import './handlers';
import './commands';
import './events';
import { Loot } from './Loot';
import { Colshape } from './Colshape';

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
        ammo: 30
    }
};

const item_ak47Weapon: Item = {
    key: 'item_ak47Weapon',
    amount: 5,
    data: {
        health: 100
    }
};

const loot = new Loot();
loot.createLootShape(new mp.Vector3(-1855, 2984, 32), 3, 'ANY LOOT');
const colshape: ColshapeMp = loot.getColshape();
Colshape.addItem(colshape, [item_bodyarmor, item_ak47Ammo, item_ak47Weapon]);

const loot2 = new Loot();
loot2.createLootShape(new mp.Vector3(-1850, 2984, 32), 3, 'ANY LOOT_2');
const colshape2: ColshapeMp = loot2.getColshape();
Colshape.addItem(colshape2, [item_bodyarmor, item_ak47Weapon, item_ak47Ammo, item_ak47Weapon]);