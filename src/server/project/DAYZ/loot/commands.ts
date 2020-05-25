import { Player } from '../player/Player';
import { Item } from '../types';

// Выводит инвентарь игрока.
mp.events.addCommand('inv', (player: PlayerMp, ft: string) => {
    const inventory: Item[] = player.getStorage();
    const plr = new Player(player);
    player.outputChatBox(`!{#20db63}INVENTORY: [${player.getEmptySlots()}]`);
    player.outputChatBox(JSON.stringify(inventory));
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

mp.events.addCommand('weight', (player: PlayerMp, ft: string, id: string, amount: string, cellId: string) => {
    const plr = new Player(player);
    const invMaxWeight: number = player.getVariable('invMaxWeight');
    player.outputChatBox(`Макс.вес игрока: ${invMaxWeight}`);
});