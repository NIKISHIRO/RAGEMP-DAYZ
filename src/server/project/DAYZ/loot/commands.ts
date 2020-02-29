import { Loot } from './Loot';
import { logger } from '../shared/logger';
import { Player } from '../player/Player';
import { ReturnInformation } from '../interfaces';

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
    const itemPoints = Player.getItemPoints(player);

    player.outputChatBox(`!{#20db63}Item Points: [${itemPoints.length}]`);
    itemPoints.forEach((shapeId, idx) => {
        player.outputChatBox(`!{#20db63}-> [${idx}]: ID - ${shapeId}`);
    });
    player.outputChatBox(`!{#20db63}---------------------------`);
});

mp.events.addCommand('item', (player: PlayerMp, ft: string, srcCellId: string, srcItemId: string, srcAmount: string) => {
    if (!ft) {
        player.outputChatBox('/item [ИД ячейки] - содержимое ячейки.');
        player.outputChatBox('/item [ИД ячейки] [ИД предмета] [Кол-во]- получить предмет ячейки.');
        return;
    }

    const cellId: number = parseInt(srcCellId);
    const itemId: number = parseInt(srcItemId);
    const amount: number = parseInt(srcAmount);

    const itemList = Player.getItemListByIndex(player, cellId);

    if (!itemList) {
        player.outputChatBox(`Такой ячейки нету!`);
    } else {
        if (!itemList.length) {
            player.outputChatBox('!{#BC3C00}Это пустая ячейка!');
            return;
        }
        
        // Если не передан 2 аргумент, вывести содержимое ячейки.
        if (!itemId && !Number.isInteger(itemId)) {
            player.outputChatBox('!{#97CC24}Предметы в этой ячейке:');

            itemList.forEach((item: Item, idx: number) => {
                player.outputChatBox(`!{#97CC24}[${idx}] ${item.key} | ${item.amount} |`);
            });
        }
    }

    // Если игрок передал 2 аргумент.
    if (Number.isInteger(itemId)) {
        const returnInformation: ReturnInformation = Player.takeColshapeItem(player, cellId, itemId, amount);
        player.outputChatBox(returnInformation.info);
    }
});

mp.events.addCommand('drop', (player: PlayerMp, ft: string, id: string, amount: string) => {
    if (!ft) return player.outputChatBox('/drop [ИД Предмета из инвентаря] (/inv)');

    const returnInformation: ReturnInformation = Player.dropItem(player, parseInt(id), parseInt(amount));

    if (returnInformation.result) {
        player.outputChatBox(`!{#97CC24}${returnInformation.info}`);
    } else {
        player.outputChatBox(`!{#BC3C00}${returnInformation.info}`);
    }
});