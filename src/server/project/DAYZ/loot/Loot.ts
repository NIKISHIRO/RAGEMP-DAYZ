/*
    Лут - класс, который создает на указаных коорд. точку для взятия лута.
    У игрока вставшего на "точку" должна быть возможность взять лут с этой точки.
*/

enum LootSpawn {
    SPAWN = 'SPAWN'
}

interface LootShapeInfo {
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

        const itemList = this.shape.getVariable('itemList');
        itemList.push(...items);
        this.shape.setVariable('itemList', itemList);
    }
}

/*

Игрок
-> IF: в пределах точки.
    -> Дать возможность взять предмет. /take [id]
-> IF предметы в пределах игрока. 
    -> Вывести список доступных предметов.
    -> 
*/