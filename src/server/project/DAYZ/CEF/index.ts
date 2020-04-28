import { Item } from "../types";
import { callBrowsers } from 'rage-rpc';
import { DisplayUI } from "../events/rpcRegister";

class CEF {
    private player: PlayerMp;

    constructor(player: PlayerMp) {
        this.player = player;
    }

    // CEF - устанавливает предметы лежащие на земле около игрока в UI.
    public cefSetGroundItems(items: Item[]) {
        callBrowsers(this.player, 'cef_set_ground_items', items);
    }

    public setDisplayUI(displayUI: DisplayUI) {
        callBrowsers(this.player, 'cef_set_display_ui', displayUI);
    }

    // Отправляет в CEF название маршрута по которому будет редирект на другой UI.
    public changeUI(name: string) {
        callBrowsers(this.player, 'cef_change_UI', name)
        .catch(e => console.log('server -> cef_change_UI e', e))
    }
}

export {
    CEF,
}