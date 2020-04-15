import shortid from 'shortid';
import { ItemKey, ItemData, Item } from 'project/DAYZ/types';

export class EItem {
    static createItem(key: ItemKey, amount: number, data: ItemData): Item {
        return {key, amount, data: {...data, shortid: shortid.generate()}};
    }
}