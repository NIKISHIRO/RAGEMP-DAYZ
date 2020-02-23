interface Item {
    key: string;
    amount: number;
    data?: object;
}

interface PlayerMp_InvApi {
    getInventory(): Item[];
    setInventory(newInventory: Item[]): boolean;
    hasItem(itemKey: string): boolean;
    hasItemWithData(itemKey: string, data: object): boolean;
    getItemIndex(itemKey: string): number;
    getItemIndexWithData(itemKey: string, data: object): number;
    getItemAmount(itemKey: string): number;
    getItemAmountWithData(itemKey: string, data: object): number;
    getTotalItemAmount(): number;
    giveItem(itemKey: string, amount: number, data?: object): boolean;
    useItem(itemIdx: number): boolean;
    removeItem(itemIdx: number, amount?: number): boolean;
}