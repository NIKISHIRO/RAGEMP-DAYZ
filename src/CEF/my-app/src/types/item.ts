/* ОПИСАНИЕ ПРЕДМЕТА */
export enum ItemType {
    WEAPON = 'WEAPON',
    ARMOUR = 'ARMOUR',
}

export const ItemTypes = {
    ITEM: 'ITEM',
};

export type Item = {
    key: string;
    amount: number;
    data: ItemData;
}

export type ItemData = {
    type: ItemType;
    cellIdx?: number; // Ид ячейки в который лежит предмет.
    name: string; // Название предмета.
    description: string;
    maxStackCount: number; // Максимальный стак предмета.
    condition: number; // Состояние предмета.
}

export interface DataBodyArmour extends ItemData {
    defence?: number;
}

export interface DataWeapon extends ItemData {
    clip?: number;
}