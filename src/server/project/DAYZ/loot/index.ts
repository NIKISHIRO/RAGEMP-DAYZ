import './inventoryEvents';
import './inventoryRegister';
import './commands';
import './events';
import './cef';
import { Loot } from './Loot';

async function spawnLoot() {
    const spawnDataArray = await Loot.getSpawnLootPoints();
    if (spawnDataArray) {
        Loot.spawnLoot(spawnDataArray);
    }
}

spawnLoot();