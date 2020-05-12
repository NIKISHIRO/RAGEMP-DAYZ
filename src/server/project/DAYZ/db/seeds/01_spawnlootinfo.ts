import * as Knex from "knex";
import { SpawnLootData, ItemRarity } from '../../types';

export async function seed(knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    return knex("spawnlootinfo").del()
        .then(() => {
            // Inserts seed entries
            return knex<SpawnLootData>("spawnlootinfo").insert([
                { items: [ItemRarity.RARITY_1], position: [-1166, 4926, 223] },
                { items: [ItemRarity.RARITY_3, ItemRarity.RARITY_4], position: [-1168, 4927, 223] },
                { items: [ItemRarity.RARITY_1, ItemRarity.RARITY_1], position: [456, 5572, 781] },
                { items: [ItemRarity.RARITY_1, ItemRarity.RARITY_1], position: [28, 3642, 39] },
                { items: [ItemRarity.RARITY_1, ItemRarity.RARITY_1], position: [28, 3642, 39] },
                { items: [ItemRarity.RARITY_1, ItemRarity.RARITY_1], position: [28, 3642, 39] },
                { items: [ItemRarity.RARITY_1, ItemRarity.RARITY_1], position: [28, 3642, 39] }
            ]);
        });
};