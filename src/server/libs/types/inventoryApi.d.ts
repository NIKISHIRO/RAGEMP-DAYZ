
type IItem = {
    key: any;
    amount: any;
    data: any;
}

interface PlayerMp_InvApi {
    _storage: IItem[];
    _slots: number;

    getStorage: () => IItem[];
    putItem: (item: IItem, idx: number) => {result: boolean, text: string};
    getEmptySlots: () => number;
    setEmptyCells: (slots: number) => void;
    getFirstEmptySlotIndex: () => number;

    // Возврашает массив инвентаря.
    // getInventory(): IItem[];
    // // Заменяет массив инвентаря на новый.   
    // setInventory(newInventory: any[]): boolean;
    // // Возвр. true || false. Есть ли в инв. предм. по itemKey.
    // hasItem(itemKey: string): boolean;
    // // Возвр. true || false. Тоже что и инвентаря игрока, но с data. 
    // hasItemWithData(itemKey: string, data: object): boolean;
    // // Возвр. ид предмета по itemKey.
    // getItemIndex(itemKey: string): number;
    // // Возвр. ид предмета по itemKey и data.
    // getItemIndexWithData(itemKey: string, data: object): number;
    // // Возвр. кол-во указанного предмета в инв.
    // getItemAmount(itemKey: string): number;
    // getItemAmountWithData(itemKey: string, data: object): number;
    // // Возвращает общее кол-во предметов, которое имеет игрок в своем инвентаре.
    // getTotalItemAmount(): number;
    // // Дает игроку предмет по 'itemKey' в количестве - 'amount'. 
    // giveItem(itemKey: string, amount: number, data?: object): boolean;
    // // Использует предмет по индексу.
    // useItem(itemIdx: number): boolean;
    // // Удаляет предмет по индексу из инв. игрока с опр. кол-вом(amount).
    // removeItem(itemIdx: number, amount?: number): boolean;
}