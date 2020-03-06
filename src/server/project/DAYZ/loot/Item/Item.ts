export class EItem {
    static createItem(key: string, amount: number, data: object = {}): Item {
        return {key, amount, data};
    }
}