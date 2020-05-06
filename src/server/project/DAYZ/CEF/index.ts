import { Item } from "../types";
import { callBrowsers, callClient } from 'rage-rpc';
import { DisplayUI } from "../events/rpcRegister";

export type CharacterClientData = {
    gender: 'male' | 'female';
    face: { index: number; feature: number; }[];
    headArray: any[];
    hair: number;
};

// Класс через который происходит отправка данных в другие сущности(CLIENT, CEF).
class CEF {
    private player: PlayerMp;

    constructor(player: PlayerMp) {
        this.player = player;
    }

    // CEF - устанавливает предметы лежащие на земле около игрока в UI.
    public cefSetGroundItems(items: Item[]) {
        callBrowsers(this.player, 'cef_set_ground_items', items)
        .catch(e => console.log('server -> cef_set_ground_items -> e', e));
    }

    // Отображает или скрывает части в UI.
    public setDisplayUI(displayUI: DisplayUI) {
        callBrowsers(this.player, 'cef_set_display_ui', displayUI)
        .catch(e => console.log('server -> cef_set_display_ui -> e', e));
    }

    // Отправляет в CEF название маршрута по которому будет редирект на другой UI.
    public changeUI(name: string) {
        callBrowsers(this.player, 'cef_change_UI', name)
        .catch(e => console.log('server -> cef_change_UI -> e', e));
    }

    // Отправляет на клиент инфу что игрока зарегался или авторизовался.
    public clientAfterAuthInit() {
        callClient(this.player, 'client_after_auth_init');
    }

    // Отправляет на клиент инфу, что юзер зарегался и получает.
    public async clientCharacterReady(): Promise<CharacterClientData> {
        return await callClient(this.player, 'client_character_ready');
    }

    // Отправляет на клиент инфу что нужно установить св-ва игроку перед авторизацией.
    public clientBeforeAuthInit() {
        callClient(this.player, 'client_before_auth_init');
    }

    public async clientGetAmmoInClip() {
        return await callClient(this.player, 'client_get_ammo_in_clip');
    }
}

export {
    CEF,
}