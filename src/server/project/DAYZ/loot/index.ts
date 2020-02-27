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

const item_bodyarmor: Item = {
    key: 'item_bodyarmor',
    amount: 1,
    data: {
        testdata: 'test'
    }
};

const item_ak47Ammo: Item = {
    key: 'item_ak47Ammo',
    amount: 1,
    data: {
        testdata: 'test'
    }
};

const marker: MarkerMp = mp.markers.new(42, new mp.Vector3(111, 119, 113), 1);
const colshape: ColshapeMp = mp.colshapes.newSphere(111, 119, 113, 5);
const loot = new Loot(colshape, marker);
loot.addItem([item_bodyarmor, item_ak47Ammo]);

const marker2: MarkerMp = mp.markers.new(42, new mp.Vector3(94, 112, 109), 1);
const colshape2: ColshapeMp = mp.colshapes.newSphere(94, 112, 109, 5);
const loot2 = new Loot(colshape2, marker2);
loot2.addItem([item_bodyarmor]);

const marker3: MarkerMp = mp.markers.new(42, new mp.Vector3(92, 112, 109), 1);
const colshape3: ColshapeMp = mp.colshapes.newSphere(92, 112, 109, 5);
const loot3 = new Loot(colshape3, marker3);
loot3.addItem([item_ak47Ammo]);