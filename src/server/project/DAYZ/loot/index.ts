import './handlers';
import './commands';
import './events';
import { Loot } from './Loot';

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

// LOOT SHAPE.
const x: number = 111;
const y: number = 111;
const z: number = 111;
const range: number = 5;

const item: Item = {
    key: 'item_ak47Ammo',
    amount: 1,
    data: {
        testdata: 'test'
    }
};

const colshape: ColshapeMp = mp.colshapes.newSphere(x, y, z, range);
const loot = new Loot(colshape);
loot.addItem([item]);

const colshape2: ColshapeMp = mp.colshapes.newSphere(x, y, z, range);
const loot2 = new Loot(colshape2);
loot.addItem([item]);