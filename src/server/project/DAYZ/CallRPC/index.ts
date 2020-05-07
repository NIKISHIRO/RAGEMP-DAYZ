import { Item, CharacterClientData } from "../types";
import { callBrowsers, callClient } from 'rage-rpc';
import { DisplayUI } from "../events/rpcRegister";

// Класс через который происходит отправка данных в другие сущности(CLIENT, CEF).
class CallRPC {
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
        callClient(this.player, 'client_after_auth_init')
        .catch(e => console.log('client_after_auth_init -> e', e))
    }

    // Отправляет на клиент инфу, что юзер зарегался и получает.
    public async clientCharacterReady(): Promise<CharacterClientData> {
        return await callClient(this.player, 'client_character_ready');
    }

    // Отправляет на клиент инфу что нужно установить св-ва игроку перед авторизацией.
    public clientBeforeAuthInit() {
        callClient(this.player, 'client_before_auth_init');
    }

    // GET HUNGER, DEHYDRATION, TEMPERATURE ...
    public clientGetAnyProp(name: 'hunger' | 'dehydration' | 'temperature'): Promise<number | false> {
        return callClient(this.player, 'client_get_any_prop', name);
    }

    // Устанавливает в CEF кол-во макс.веса в рюкзаке.
    public cefSetInventoryWeight(weight: number): Promise<any> {
        return callBrowsers(this.player, 'cef_set_inventory_weight', weight);
    }
}

export {
    CallRPC,
}