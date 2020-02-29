export class Colshape {
    static destroy(colshape: ColshapeMp): boolean {
        console.log(' -> shape destroy');

        if (mp.colshapes.exists(colshape.id)) {
            colshape.destroy();
            return true;
        }
        return false;
    }

    static getItemList(colshape: ColshapeMp): Item[] {
        return colshape.getVariable('itemList');
    }

    // Добавляет предметы в массив itemList.
    static addItem(colshape: ColshapeMp, items: Item[]): boolean {
        if (!items.length) {
            return false;
        }

        const itemList: Item[] = colshape.getVariable('itemList');
        itemList.push(...items);
        colshape.setVariable('itemList', itemList);
        
        return true;
    }    
}