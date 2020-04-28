import rpc from 'rage-rpc';
import { LootCreateData } from '../../reducers/UIReducer';

type Result = {
    result: boolean;
    text: string;
}

// Подбор предмета с земли.
async function takeInventoryItemToServer(serverId: string, amount: number): Promise<Result> {
    // return rpc.callServer('server_take_inventory_item', JSON.stringify({ serverId, amount }));
    return { result: true, text: '"Взять предмет". Заглушка' };
}

// Дроп предмета с инв.
async function dropInventoryItemToServer(itemKey: string, amount: number): Promise<Result> {
    // return rpc.callServer('server_drop_inventory_item', JSON.stringify({itemKey, amount}));
    return { result: true, text: '"Выбосить предмет". Заглушка' };
}

async function usesInventoryItemByServerId(serverId: string): Promise<Result> {
    // return rpc.callServer('server_use_item_by_serverid', serverId);
    return { result: true, text: '"Использование предмета". Заглушка.' };
}

// Создает на клиенте объект с указанным хэшем и возвращает данные о нем.
async function lootCreate(objectHash: string): Promise<LootCreateData | false> {
    // return rpc.callClient('client_set_loot_create', objectHash);

    return {
        objectId: 0,
        objectHash: 'w_ar_assaultrifle',
        position: [2, 32, 2320],
        rotation: [120, 231, 3],
    };
}

async function setLootCreateRotation(pos: number[]): Promise<any> {
    // return rpc.callClient('client_set_loot_create_rotation', pos);
}

async function setLootCreateHash(hash: string): Promise<any> {
    // return rpc.callClient('client_set_loot_create_hash', hash);
}

export {
    takeInventoryItemToServer,
    dropInventoryItemToServer,
    usesInventoryItemByServerId,
    lootCreate,
    setLootCreateRotation,
    setLootCreateHash,
}