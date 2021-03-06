import { register, ProcedureListenerInfo } from 'rage-rpc';
import { Player } from '../player/Player';
import { CallRPC } from '../CallRPC';
import { Hash } from 'crypto';
import { Auth } from '../auth/Auth';
import { Item } from '../types';
import { WeaponData } from './../types';

type TakeData = {
    itemKey: string;
    amount: number;
};

type DropData = {
    itemKey: string;
    amount: number;
    putId: number;
};

export type DisplayUI = {
    huds: boolean;
    inventory: boolean;
    ground: boolean;
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

register('set_open_storage_data', ({type, id}: {type: string; id: number;}, info: any) => {
    const player = info.player;
    player.setVariable('openStorageData', {type, id});
    return true;
});

// Взять предмет с земли.
register('server_take_inventory_item', (data: TakeData, info: any) => {
    const player = info.player;
    const plr = new Player(player);
    console.log(' (event) ----> server_take_inventory_item');
    const takeResult = plr.takeItem(data.itemKey, data.amount);
    console.log('takeResult', takeResult);
    return takeResult;
});

register('server_drop_inventory_item', (data: DropData, info: any) => {
    const player = info.player;
    const plr = new Player(player);
    console.log('(event) ----> server_drop_inventory_item', data);
    return plr.dropItem(data.itemKey, data.amount, data.putId);
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

    console.log('server_use_item_by_serverid', serverId);

    return plr.useItemByServerId(serverId);
});

register('server_set_health', (health: number, info: any) => {
    const player = info.player;
    player.health = health;
    console.log('server_set_health ' + health);
});

register('server_register', (data: ServerRegister, info: any) => {
    const player = info.player;
    const auth = new Auth(player);
    return auth.register(data.login, data.email, data.password);
});

register('server_login', (data: LoginRegister, info: any) => {
    const player = info.player;
    const auth = new Auth(player);
    return auth.login(data.login, data.password);
});

register('server_check_login', (login: string, info: any) => {
    const player = info.player;
    const auth = new Auth(player);
    return auth.checkLogin(login);
});

register('server_character_ready', ({login, email, password}: {login: string; email: string; password: string}, info: any) => {
    const player = info.player;
    
    // Создание перса после регистрации.
    if (!player.getVariable('isAuth')) {
        const auth = new Auth(player);
        auth.register(login, email, password);
    }
});

register('server_set_hud_prop', ({name, value}: {name: string, value: number}, info) => {
    const player: any = info.player;

    if (name == 'hunger' || name == 'dehydration' || name === 'temperature') {
        player.setVariable(name, value);
    }
})

register('server_get_ammo', (ammo: number, info: any) => {
    const player: PlayerMp = info.player;
    console.log(player.weapon);
    console.log(ammo);
    let itemKey;
    switch(player.weapon){
        case RageEnums.Hashes.Weapon.ASSAULTRIFLE_MK2:
            itemKey = 'ITEM_AMMO_AK47'
    }
    const inventory: Item[] = player.getInventory();
    inventory.forEach(item => {
        console.log(itemKey);
        console.log(item.key);
        if(item.key == itemKey) {
            let index = player.getItemIndex(itemKey)
            if(item.amount >= ammo){
                player.giveWeapon(player.weapon, ammo);
                console.log('Выдали', ammo);
                player.removeItem(index, ammo)
            } else {
                player.giveWeapon(player.weapon, item.amount);
                console.log('Выдали', item.amount);
                player.removeItem(index, item.amount)
            }
        }
    });
});

register('server_set_storage_data', (data: {type: string, id: number}, info: any) => {
    const player: PlayerMp = info.player;
    player.setVariable('storageData', data);
});