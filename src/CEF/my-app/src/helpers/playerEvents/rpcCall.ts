import rpc from 'rage-rpc';

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

export {
    takeInventoryItemToServer,
    dropInventoryItemToServer,
    usesInventoryItemByServerId,
}