export interface InventoryInfo {
    maxSlots: number;
    inventory: Item[];
}

export interface Item {
    key: string;
    amount: number;
    data?: object;
}