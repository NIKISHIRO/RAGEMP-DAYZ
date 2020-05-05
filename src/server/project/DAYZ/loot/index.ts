import './inventoryEvents';
import './inventoryRegister';
import './commands';
import './events';
import './cef';
import { Loot } from './Loot';
import { ItemRarity, SpawnLootData } from '../types';
import { postgres } from '../db/config';

// Loot.addSpawnLootPoint([ItemRarity.RARITY_1, ItemRarity.RARITY_2], [-1166, 4926, 223]);
// Loot.addSpawnLootPoint([ItemRarity.RARITY_3, ItemRarity.RARITY_4], [-1168, 4927, 223]);
// Loot.addSpawnLootPoint([ItemRarity.RARITY_1, ItemRarity.RARITY_2], [456, 5572, 781]);
// Loot.addSpawnLootPoint([ItemRarity.RARITY_3, ItemRarity.RARITY_4], [28, 3642, 39]);

async function spawnLoot() {
    const spawnDataArray = await Loot.getSpawnLootPoints();
    Loot.spawnLoot(spawnDataArray);
}

spawnLoot()