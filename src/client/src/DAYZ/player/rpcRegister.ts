import { register } from "../../rage-rpc";
import { lootCreate } from "../loot/LootCreate";

// Отправка данных об созданных объектах в CEF.
register('client_set_loot_create', (objectHash: string) => {
    mp.gui.chat.push('CLIENT -> client_set_loot_create');
    // Удаляет и уничтожает текущий установленный объект.
    lootCreate.removeObject();
    // Создает новый объект и устнавливает его как текущий объект.
    const pos = mp.players.local.position;
    pos.z = mp.game.gameplay.getGroundZFor3dCoord(pos.x, pos.y, pos.z, parseFloat('0'), false);
    lootCreate.createObject(objectHash, pos);
    const createdObject = lootCreate.getCurrentObject(); // obj || false.
    mp.gui.chat.push(`createdObject: ${JSON.stringify(createdObject)}`);
    return createdObject;
});

register('client_set_loot_create_rotation', (pos: number[]) => {
    return lootCreate.setRotation(pos[0], pos[1], pos[2]);
});

register('client_set_loot_create_hash', (hash: string) => {
    mp.gui.chat.push('client_set_loot_create_hash');
    return lootCreate.changeModel(hash);
});