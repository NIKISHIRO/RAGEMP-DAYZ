"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rage_rpc_1 = require("../../rage-rpc");
const LootCreate_1 = require("../loot/LootCreate");
const Player_1 = require("./Player");
rage_rpc_1.register('client_set_loot_create', (objectHash) => {
    mp.gui.chat.push('CLIENT -> client_set_loot_create');
    LootCreate_1.lootCreate.removeObject();
    const pos = mp.players.local.position;
    pos.z = mp.game.gameplay.getGroundZFor3dCoord(pos.x, pos.y, pos.z, parseFloat('0'), false);
    LootCreate_1.lootCreate.createObject(objectHash, pos);
    const createdObject = LootCreate_1.lootCreate.getCurrentObject();
    mp.gui.chat.push(`createdObject: ${JSON.stringify(createdObject)}`);
    return createdObject;
});
rage_rpc_1.register('client_set_loot_create_rotation', (pos) => {
    return LootCreate_1.lootCreate.setRotation(pos[0], pos[1], pos[2]);
});
rage_rpc_1.register('client_set_loot_create_hash', (hash) => {
    mp.gui.chat.push('client_set_loot_create_hash');
    return LootCreate_1.lootCreate.changeModel(hash);
});
rage_rpc_1.register('client_get_any_prop', (name) => {
    switch (name) {
        case 'hunger': {
            return Player_1.playerInstance.getHunger();
        }
        case 'dehydration': {
            return Player_1.playerInstance.getDehydration();
        }
        default: {
            return false;
        }
    }
});
