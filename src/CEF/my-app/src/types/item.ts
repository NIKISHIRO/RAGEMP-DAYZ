/* ОПИСАНИЕ ПРЕДМЕТА */
export enum ItemType {
    WEAPON = 'WEAPON',
    ARMOR = 'ARMOR',
}

export enum ItemKey {
    ITEM_WEAPON_AK47 = 'ITEM_WEAPON_AK47',
    ITEM_ARMOR = 'ITEM_ARMOR',
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
    shortid: string;
}

export interface DataBodyArmour extends ItemData {
    defence?: number;
}

export interface DataWeapon extends ItemData {
    clip?: number;
}