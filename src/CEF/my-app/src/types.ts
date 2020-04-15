/* ОПИСАНИЕ ПРЕДМЕТА */
export interface BodyArmourData extends ItemData {
    defence?: number;
}

export interface WeaponData extends ItemData {
    clip?: number;
}

/* ОПИСАНИЕ ПРЕДМЕТА */
export enum ItemType {
    WEAPON = 'WEAPON',
    ARMOR = 'ARMOR',
    BACKPACK = 'BACKPACK',
    AMMO = 'AMMO',
}

export enum ItemKey {
    ITEM_WEAPON_AK47 = 'ITEM_WEAPON_AK47',
    ITEM_ARMOR = 'ITEM_ARMOR',
    ITEM_AMMO_SHOTGUN = 'ITEM_AMMO_SHOTGUN',
}

export type Item = {
    key: ItemKey;
    amount: number;
    data: ItemData;
}

export type ItemData = {
    type: ItemType;
    name: string; // Название предмета.
    description: string;
    maxStackCount: number; // Максимальный стак предмета.
    weight: number; // Вес предмета (1 шт).
    shortid: string;
}

export interface DataBodyArmour extends ItemData {
    defence?: number;
}

export interface DataWeapon extends ItemData {
    clip?: number;
}

export interface DataBackpack extends ItemData {
    slots: number;
}