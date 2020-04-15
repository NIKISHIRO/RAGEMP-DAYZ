import { Item } from "../types";
import { callBrowsers } from 'rage-rpc';

class CEF {
    private player: PlayerMp;

    constructor(player: PlayerMp) {
        this.player = player;
    }

    // CEF - устанавливает предметы лежащие на земле около игрока в UI.
    public cefSetGroundItems(items: Item[]) {
        callBrowsers(this.player, 'cef_set_ground_items', items);
    }
}

export {
    CEF,
}