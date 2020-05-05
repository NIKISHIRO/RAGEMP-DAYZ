export type Item = {
    key: ItemKey;
    amount: number;
    data: ItemData | BodyArmourData | WeaponData | ClothesData;
};

/* ОПИСАНИЕ ПРЕДМЕТА */
export enum ItemType {
    WEAPON = 'WEAPON',
    ARMOR = 'ARMOR',
    COMMON = 'COMMON',
    CLOTHES = 'CLOTHES',
};

export enum ItemKey {
    ITEM_WEAPON_AK47 = 'ITEM_WEAPON_AK47',
    ITEM_ARMOR = 'ITEM_ARMOR',
    ITEM_AMMO_SHOTGUN = 'ITEM_AMMO_SHOTGUN',
    ITEM_CLOTHES_MASK_1 = 'ITEM_CLOTHES_MASK_1',
    ITEM_CLOTHES_MASK_2 = 'ITEM_CLOTHES_MASK_2',
    ITEM_CLOTHES_MASK_3 = 'ITEM_CLOTHES_MASK_3',
    ITEM_CLOTHES_MASK_4 = 'ITEM_CLOTHES_MASK_4',
    ITEM_CLOTHES_MASK_5 = 'ITEM_CLOTHES_MASK_5',
};

export enum ItemRarity {
    RARITY_1 = 'RARITY_1',
    RARITY_2 = 'RARITY_2',
    RARITY_3 = 'RARITY_3',
    RARITY_4 = 'RARITY_4',
};

export type SpawnLootData = {
    id: number;
    items: ItemRarity[];
    position: number[];
};

/* ОПИСАНИЕ ПРЕДМЕТА */
export type ItemData = {
    type: ItemType;
    rarity: ItemRarity;
    name: string; // Название предмета.
    description: string;
    maxStackCount: number; // Максимальный стак предмета.
    shortid: string;
    serverId: string;
    weight: number;
    isDelete: boolean; // Удалить после использования?
};

export interface BodyArmourData extends ItemData {
    defence?: number;
};

export interface WeaponData extends ItemData {
    clip?: number;
};

export interface ClothesData extends ItemData {
    addSlots: number;
    componentId: number;
    drawable: number;
};