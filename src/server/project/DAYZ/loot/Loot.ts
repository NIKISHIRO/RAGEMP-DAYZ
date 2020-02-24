/*
    Лут - класс, который создает на указаных коорд. точку для взятия лута.
    У игрока вставшего на "точку" должна быть возможность взять лут с этой точки.
*/

export enum LootSpawn {
    SPAWN = 'SPAWN'
}

export interface LootShapeInfo {
    type: LootSpawn
}

export class Loot {
    private shape: ColshapeMp;

    constructor(colshape: ColshapeMp) {
        this.shape = colshape;

        const lootShapeInfo: LootShapeInfo = {
            type: LootSpawn.SPAWN
        };
        this.shape.setVariable('lootShapeInfo', lootShapeInfo);
        this.shape.setVariable('itemList', []);
    }

    public getItemList(): Item[] {
        return this.shape.getVariable('itemList');
    }

    public getShape(): ColshapeMp {
        return this.shape;
    }
    
    public shapeDestroy() {
        console.log(' -> shape destroy');
        this.shape.destroy();
    }

    public addItem(items: Item[]): void {
        if (!items.length) return;

        const itemList: Item[] = this.shape.getVariable('itemList');
        itemList.push(...items);
        
        this.shape.setVariable('itemList', itemList);
    }
}