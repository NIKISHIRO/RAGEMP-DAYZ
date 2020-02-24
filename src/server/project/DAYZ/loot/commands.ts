import { Loot } from './Loot';
import { logger } from '../shared/logger';
import { Player } from '../player/Player';

// Выводит инвентарь игрока.
mp.events.addCommand('inv', (player: PlayerMp, ft: string) => {
    const inventory: Item[] = player.getInventory();

    player.outputChatBox(`!{#20db63}INVENTORY: [${inventory.length}]`);
    inventory.forEach((v, idx) => {
        player.outputChatBox(`!{#20db63}-> (${idx}): ${v.key} | ${v.amount}`);
    });
    player.outputChatBox(`!{#20db63}---------------------------`);
});

// Использует предмет в инвентаре по ИД.
mp.events.addCommand('use', (player: PlayerMp, ft: string, idx: string) => {
    if (!ft) return player.outputChatBox('/use [ИД предмета в инвентаре]')

    const id: number = parseInt(idx);
    if (isNaN(id) || !Number.isInteger(id)) {
        return;
    }

    if (player.useItem(id)) {
        player.outputChatBox(`Вы использовали предмет с ID = ${id}.`);
    } else {
        player.outputChatBox("Ошибка использования предмета.");
    }
});

// Выводит места для лута (ИДЫ КОЛШИПОВ).
mp.events.addCommand('items', (player: PlayerMp, ft: string) => {
    const playerInstance = new Player(player);
    const itemPoints = playerInstance.getItemPoints();

    player.outputChatBox(`!{#20db63}Item Points: [${itemPoints.length}]`);
    itemPoints.forEach((shapeId, idx) => {
        player.outputChatBox(`!{#20db63}-> [${idx}]: ID - ${shapeId}`);
    });
    player.outputChatBox(`!{#20db63}---------------------------`);
});

mp.events.addCommand('item', (player: PlayerMp, ft: string, cellId: string, itemId: string) => {
    if (!ft) {
        player.outputChatBox('/item [ИД ячейки] - содержимое ячейки.');
        player.outputChatBox('/item [ИД ячейки] [ИД предмета] - получить предмет ячейки.');
        return;
    }

    if (cellId) {
        
    }

    const playerInstance = new Player(player);
    const itemList = playerInstance.getItemListById(parseInt(cellId));

    console.log('-> item ->', itemList);
    if (itemList) {
        if (!itemList.length) {
            player.outputChatBox('!{#BC3C00}Это пустая ячейка!');
            return;
        }
        
        player.outputChatBox('!{#97CC24}Предметы в этой ячейке:');
        itemList.forEach(item => {
            console.log(' -> item -> ', item);
            player.outputChatBox(`!{#97CC24}${item.key} | ${item.amount} |`);
        });
    } else {
        player.outputChatBox(`Такой ячейки нету!`);
    }

    // Если игрок передал второй аргумент команды.
    if (itemId) {
        playerInstance.getItem(parseInt(cellId), parseInt(itemId));
    }
});




