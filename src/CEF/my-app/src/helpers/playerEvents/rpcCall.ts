import rpc from 'rage-rpc';

type Result = {
    result: boolean;
    text: string;
}

// Подбор предмета с земли.
async function takeInventoryItemToServer(shortid: string, amount: number): Promise<Result> {
    return rpc.callServer('server_take_inventory_item', JSON.stringify({ shortid, amount }))
}

// Дроп предмета с инв.
async function dropInventoryItemToServer(itemKey: string, amount: number) {
    return rpc.callServer('server_drop_inventory_item', JSON.stringify({itemKey, amount}));
}

export {
    takeInventoryItemToServer,
    dropInventoryItemToServer,
}