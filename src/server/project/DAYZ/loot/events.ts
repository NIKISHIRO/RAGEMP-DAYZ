import { logger } from "../shared/logger";
import { Loot, LootShapeInfo, LootSpawn } from "./Loot";
import { Player } from "../player/Player";

mp.events.add({
    'playerJoin': (player: PlayerMp) => {
        // -itemPoints - массив ИД-ов колшипов.
        player.setVariable('itemPoints', []);
    },

    'playerEnterColshape': (player: PlayerMp, shape: ColshapeMp) => {
        const lootShapeInfo: LootShapeInfo = shape.getVariable('lootShapeInfo');
        if (lootShapeInfo.type !== LootSpawn.RELOAD) return;

        const playerInstance = new Player(player);
        playerInstance.addItemPoint(shape.id);

        player.outputChatBox('event -> playerEnterColshape');
    },

    'playerExitColshape': (player: PlayerMp, shape: ColshapeMp) => {
        const lootShapeInfo: LootShapeInfo = shape.getVariable('lootShapeInfo');
        if (lootShapeInfo.type !== LootSpawn.RELOAD) return;

        const playerInstance = new Player(player);
        playerInstance.removeItemPoint(shape.id);

        player.outputChatBox('event -> playerExitColshape');
    }
});