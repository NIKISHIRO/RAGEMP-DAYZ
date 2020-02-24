import { logger } from "../shared/logger";
import { Loot } from "./Loot";
import { Player } from "../player/Player";

mp.events.add({
    'playerJoin': (player: PlayerMp) => {
        // -itemPoints - массив ИД-ов колшипов.
        player.setVariable('itemPoints', []);
    },

    'playerEnterColshape': (player: PlayerMp, shape: ColshapeMp) => {
        const playerInstance = new Player(player);
        playerInstance.addItemPoint(shape.id);
    },

    'playerExitColshape': (player: PlayerMp, shape: ColshapeMp) => {
        const playerInstance = new Player(player);
        playerInstance.removeItemPoint(shape.id);
    }
});