import * as Knex from "knex";
import { SpawnLootData, ItemRarity } from '../../types';

export async function seed(knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    return knex("spawnlootinfo").del()
        .then(() => {
            // Inserts seed entries
            return knex<SpawnLootData>("spawnlootinfo").insert([
                { items: [ItemRarity.RARITY_1], position: [-1167, 4926, 224] },
                { items: [ItemRarity.RARITY_1], position: [-1168, 4926, 224] },
                { items: [ItemRarity.RARITY_1], position: [-1169, 4926, 224] },
                { items: [ItemRarity.RARITY_1], position: [-1160, 4926, 224] },
                { items: [ItemRarity.RARITY_2], position: [-1165, 4927, 224] },
                { items: [ItemRarity.RARITY_1], position: [-1180, 4927, 224] },
                { items: [ItemRarity.RARITY_4], position: [-1181, 4927, 224] },
                { items: [ItemRarity.RARITY_4], position: [-1182, 4927, 223] },
                { items: [ItemRarity.RARITY_3], position: [-1168, 4927, 223] },
                { items: [ItemRarity.RARITY_3], position: [-1168, 4927, 223] },
                { items: [ItemRarity.RARITY_2], position: [-1168, 4927, 223] },
                { items: [ItemRarity.RARITY_2], position: [-1168, 4927, 223] },
                { items: [ItemRarity.RARITY_2], position: [-1167.5, 4927, 223] },
                { items: [ItemRarity.RARITY_4], position: [-1167.6, 4927, 223] },
                { items: [ItemRarity.RARITY_4], position: [-1167.8, 4927, 223] },
            ]);
        });
};