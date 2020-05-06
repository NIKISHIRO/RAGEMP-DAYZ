import { ItemType, ItemRarity, SpawnLootData } from "../../types";

// Предметы с указанным типом и редкостью, которые будут добавлены на коорд. указанных в position.
const spawnDataArray: SpawnLootData[] = [
    {
        items: [
            ItemRarity.RARITY_1,
        ],
        position: [-1166, 4926, 223],
    },

    {
        items: [
            ItemRarity.RARITY_1,
            ItemRarity.RARITY_1,
        ],
        position: [-1168, 4927, 223],
    },

    {
        items: [
            ItemRarity.RARITY_1,
            ItemRarity.RARITY_2,
            ItemRarity.RARITY_2,
            ItemRarity.RARITY_2,
            ItemRarity.RARITY_2,
            ItemRarity.RARITY_2,
            ItemRarity.RARITY_2,
            ItemRarity.RARITY_2,
            ItemRarity.RARITY_2,
        ],
        position: [-1160, 4927, 223],
    },

    {
        items: [
            ItemRarity.RARITY_1,
            ItemRarity.RARITY_1,
            ItemRarity.RARITY_4,
        ],
        position: [456, 5572, 781],
    },
    
    {
        items: [
            ItemRarity.RARITY_1,
            ItemRarity.RARITY_2,
            ItemRarity.RARITY_2,
            ItemRarity.RARITY_4,
        ],
        position: [28, 3642, 39],
    },
];

export {
    spawnDataArray,
}