export type Item = {
    key: ItemKey;
    amount: number;
    data: ItemData | BodyArmourData | WeaponData | ClothesData;
};

export type CharacterClientData = {
    gender: 'male' | 'female';
    face: { index: number; feature: number; }[];
    headArray: any[]; // headblend.
    headOverlay: number[];
    hair: number;
    hairColor: number;
    eyesColor: number;
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
    items: ItemRarity[];
    position: number[];
    playerId: number;
};

export type PlayerData = {
    login: string;
    passwordHash: string;
    email: string;
    gender: 'male' | 'female';
    hunger: number;
    dehydration: number;
    health: number;
    armor: number;
    admin: number;
    haircolor:number;
    eyescolor: number;
    position: { x: number; y: number; z: number };
    inventory: Item[];
    face: CharacterFace[];
    headblend: any[],
    clothes: number[];
    headoverlay: number[];
}

export type PositionCoords = {
    x: number;
    y: number; 
    z: number;
}

export type VehicleData = {
    id:number;
    hash: string;
    description: string;
    color: number[];
    defaultposition: PositionCoords;
    saveposition: PositionCoords;
    rotation: PositionCoords;
    isExplode: boolean;
}

export type CharacterFace = {
    index: number; 
    feature: number;
}

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