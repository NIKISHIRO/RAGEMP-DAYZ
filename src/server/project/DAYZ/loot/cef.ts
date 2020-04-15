import { Player } from "../player/Player";
import rpc from "rage-rpc";

type TakeData = {
    shortid: string;
    amount: number;
};

type DropData = {
    itemKey: string;
    amount: number;
};

rpc.register('server_take_inventory_item', (jsonData: string, info: any) => {
    const data: TakeData = JSON.parse(jsonData);
    const player = info.player;
    const plr = new Player(player);
    return plr.takeItemByShortId(data.shortid, data.amount);
});

rpc.register('server_drop_inventory_item', (jsonData: string, info: any) => {
    const player = info.player;
    const plr = new Player(player);
    const data: DropData = JSON.parse(jsonData);
    return plr.dropItem(data.itemKey, data.amount);
});