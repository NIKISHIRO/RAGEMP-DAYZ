import { Player } from "../player/Player";
import { LootShapeInfo, LootSpawn, InventoryInfo } from "../interfaces";
import { Item } from "../types";
import { Loot } from "./Loot/Loot";
import { CEF } from "../CEF";

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

    'playerEnterColshape': (player: PlayerMp, shape: ColshapeMp) => {
        player.outputChatBox('event -> playerEnterColshape');

        const plr = new Player(player);
        const cef = new CEF(player);

        plr.addItemPoint(shape.id);
        const itemPoints = plr.getItemPoints();
        
        console.log('itemPoints', itemPoints);

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