import { register } from 'rage-rpc';
import { Player } from '../player/Player';
import { CallRPC } from '../CallRPC';
import { Hash } from 'crypto';

type TakeData = {
    serverId: string;
    amount: number;
};

type DropData = {
    itemKey: string;
    amount: number;
};

export type DisplayUI = {
    huds: boolean;
};

type DisplayData = {
    name: string;
    bool: boolean;    
};

type ServerRegister = {
    login: string;
    password: string;
    email: string;
};

type LoginRegister = {
    login: string;
    password: string;
};

register('server_take_inventory_item', (jsonData: string, info: any) => {
    const data: TakeData = JSON.parse(jsonData);
    const player = info.player;
    const plr = new Player(player);
    return plr.takeItemByServerId(data.serverId, data.amount);
});

register('server_drop_inventory_item', (jsonData: string, info: any) => {
    const player = info.player;
    const plr = new Player(player);
    const data: DropData = JSON.parse(jsonData);
    return plr.dropItem(data.itemKey, data.amount);
});

register('server_set_display', (jsonData: string, info: any) => {
    const player = info.player;
    const plr = new Player(player);
    const data: DisplayData = JSON.parse(jsonData);
    plr.setDisplayUI(data.name, data.bool);
});

register('server_change_UI', (name: string, info: any) => {
    const player = info.player;
    const cef = new CallRPC(player);
    cef.changeUI(name);
});

register('server_use_item_by_serverid', (serverId: string, info: any) => {
    const player = info.player;
    const plr = new Player(player);
    return plr.useItemByServerId(serverId);
});

register('server_set_health', (health: number, info: any) => {
    const player = info.player;
    player.health = health;
    console.log('server_set_health ' + health);
});

register('server_register', (data: ServerRegister, info: any) => {
    const player = info.player;
    const plr = new Player(player);
    plr.register(data.login, data.email, data.password);
});

register('server_login', (data: LoginRegister, info: any) => {

    const player = info.player;
    const plr = new Player(player);
    plr.login(data.login, data.password);
});

register('server_get_ammo', (data:number, info: any) => {
    console.log(data)
});