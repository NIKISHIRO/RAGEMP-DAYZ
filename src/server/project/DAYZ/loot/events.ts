import { logger } from "../shared/logger";

mp.events.add({
    'playerEnterColshape': (player: PlayerMp, shape: ColshapeMp) => {
        logger('green', `Игрок ${player.name} встал на COLSHAPE ID =`, shape.id.toString());
        player.outputChatBox(`Вы встали на точку: COLSHAPE ID = ${shape.id}`);

        player.giveItem('item_ak47Ammo', 1, {itemKey: 'item_bodyarmour', ammo: 30 }); 
    },
    'playerExitColshape': (player: PlayerMp, shape: ColshapeMp) => {
        logger('red', `Игрок ${player.name} вышел на COLSHAPE ID =`, shape.id.toString());
        player.outputChatBox(`Вы вышли с точки ИД = COLSHAPE ID = ${shape.id}`);
    }
}); // /loot 111 111 111 5