import { Player } from "../player/Player";
import { LootShapeInfo, LootSpawn, InventoryInfo } from "../interfaces";

mp.events.add({
    'playerJoin': (player: PlayerMp) => {
        // itemPoints - массив ИД-ов колшипов.
        player.setVariable('itemPoints', []);

        const inventoryInfo: InventoryInfo = {
            inventory: player._inventory,
            maxSlots: 8
        };
        player.setVariable('inventoryInfo', inventoryInfo);
    },

    'playerDeath': () => {},

    'playerEnterColshape': (player: PlayerMp, shape: ColshapeMp) => {
        const lootShapeInfo: LootShapeInfo = shape.getVariable('lootShapeInfo');
        if (lootShapeInfo.type !== LootSpawn.RELOAD) return;

        Player.addItemPoint(player, shape.id);

        player.outputChatBox('event -> playerEnterColshape');
    },

    'playerExitColshape': (player: PlayerMp, shape: ColshapeMp) => {
        const lootShapeInfo: LootShapeInfo = shape.getVariable('lootShapeInfo');
        if (lootShapeInfo.type !== LootSpawn.RELOAD) return;

        Player.removeItemPoint(player, shape.id);

        player.outputChatBox('event -> playerExitColshape');
    }
});