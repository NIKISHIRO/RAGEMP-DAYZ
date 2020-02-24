import { Loot } from './Loot';
import { logger } from '../shared/logger';

mp.events.addCommand('inv', (player: PlayerMp, ft: string) => {
    const inventory: Item[] = player.getInventory();

    player.outputChatBox(`INVENTORY: [${inventory.length}]`);
    inventory.forEach((v, idx) => {
        player.outputChatBox(` -> [${idx}]: ${v.key} - ${v.amount}`);
    });
});

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

mp.events.addCommand('loot', (p, ft, x: string, y: string, z: string, range: string) => {
    if (!ft) return p.outputChatBox('/loot x y z range');
    
    const loot = new Loot;
    loot.setShape(parseInt(x), parseInt(y), parseInt(z), parseInt(range));

}); // /loot 111 111 111 10