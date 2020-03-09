/* ОПИСАНИЕ ПРЕДМЕТА */
export interface ItemData {
    weight: number;
    name: string;
    description?: string;
    maxStackCount: 1; 
}

export interface DataBodyArmour extends ItemData {
    defenceLevel: number;
}

export interface DataWeapon extends ItemData {
    clip: number;
}