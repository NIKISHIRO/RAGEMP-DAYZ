export type Item = {
    key: ItemKey;
    amount: number;
    data: ItemData | BodyArmourData | WeaponData | ClothesData;
};

export type CharacterPlayerData = {
    gender: 'male' | 'female';
    face: { index: number; feature: number; }[];
    headblend: any[]; // headblend.
    headoverlay: number[];
    clothes: number[];
    hair: number;
    haircolor: number;
    eyescolor: number;
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
    ITEM_WEAPON_PUMP_SHOTGUN = 'ITEM_WEAPON_PUMP_SHOTGUN',
    ITEM_ARMOR = 'ITEM_ARMOR',
    ITEM_AMMO_SHOTGUN = 'ITEM_AMMO_SHOTGUN',
    ITEM_AMMO_AK47 = 'ITEM_AMMO_AK47',
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
    id: number;
    login: string;
    passwordHash: string;
    email: string;
    health: number;
    armor: number;
    admin: number;
    position: { x: number; y: number; z: number };
    inventory: Item[];

    hunger: number;
    dehydration: number;
    temperature: number;

    gender: 'male' | 'female';
    haircolor:number;
    eyescolor: number;
    face: CharacterFace[];
    headblend: any[],
    clothes: number[];
    headoverlay: number[];
    hair: number;
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
    hash: string;
    type: ItemType;
    rarity: ItemRarity;
    name: string; // Название предмета.
    description: string;
    maxStackCount: number; // Максимальный стак предмета.
    shortid: string;
    serverId: string;
    isDelete: boolean; // Удалить после использования?
    isCollision: boolean; // Создавать коллизионный объект?
};

export interface BodyArmourData extends ItemData {
    defence: number;
};

export interface WeaponData extends ItemData {
    clip: number;
};

export interface ClothesData extends ItemData {
    addSlots: number;
    componentId: number;
    drawable: number;
};