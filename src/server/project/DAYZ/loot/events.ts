import { Player } from "../player/Player";
import { Item } from "../types";
import { CEF } from "../CEF";

mp.events.add({
    'playerEnterColshape': (player: PlayerMp, shape: ColshapeMp) => {
        player.outputChatBox('event -> playerEnterColshape');

        const plr = new Player(player);
        const cef = new CEF(player);

        plr.addItemPoint(shape.id);
        plr.addPlayerInColshape(shape, player);
        player.outputChatBox(JSON.stringify(shape.getVariable('playersIdsOnColshape')));

        // Массив предметов на земле для передачи его в CEF.
        const items: Item[] = plr.getItemsPlayerAround();
        cef.cefSetGroundItems(items);

    },

    'playerExitColshape': (player: PlayerMp, shape: ColshapeMp) => {
        player.outputChatBox('event -> playerExitColshape');

        const plr = new Player(player);
        const cef = new CEF(player);

        plr.removePlayerInColshape(shape, player);
        player.outputChatBox(JSON.stringify(shape.getVariable('playersIdsOnColshape')));

        plr.removeItemPoint(shape.id);
        cef.cefSetGroundItems([]);
    },
});