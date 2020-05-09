import { Item } from "project/DAYZ/types";

export class Colshape {
    private colshape: ColshapeMp;

    constructor(colshape: ColshapeMp) {
        this.colshape = colshape;
    }
    
    // Уничтожает массив.
    public destroy(): boolean {
        console.log(' -> shape destroy');

        if (mp.colshapes.exists(this.colshape.id)) {
            this.colshape.destroy();
            return true;
        }
        return false;
    }

    public getItemList(): Item[] {
        return this.colshape.getVariable('itemList');
    }

    // Добавляет предметы в массив itemList.
    public addItem(items: Item[]): boolean {
        if (!items.length) {
            return false;
        }

        const itemList: Item[] = this.colshape.getVariable('itemList');
        itemList.push(...items);
        this.colshape.setVariable('itemList', itemList);
        
        return true;
    }    
}