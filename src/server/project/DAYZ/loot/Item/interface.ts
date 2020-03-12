/* ОПИСАНИЕ ПРЕДМЕТА */
export interface ItemData {
    type: ItemType;
    maxStackCount: 1; 
    name: string;
    description?: string;
}

export interface DataBodyArmour extends ItemData {
    defence: number;
}

export interface DataWeapon extends ItemData {
    clip: number;
}

export enum ItemType {
    WEAPON = 'WEAPON',
    ARMOUR = 'ARMOUR',
}