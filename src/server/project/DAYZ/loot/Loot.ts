/*
    Лут - класс, который создает на указаных коорд. точку для взятия лута.
    У игрока вставшего на "точку" должна быть возможность взять лут с этой точки.

    Через этот класс идет регистрация сущностей, как предметов. 
*/

export enum LootSpawn {
    RELOAD = 'RELOAD'
}

export interface LootShapeInfo {
    type: LootSpawn,
    labelId: number
}

export class Loot {
    private colshape: ColshapeMp;
    private label: TextLabelMp;

    private init(colshape: ColshapeMp, label: TextLabelMp) {
        const lootShapeInfo: LootShapeInfo = {
            type: LootSpawn.RELOAD,
            labelId: label.id
        };
        
        colshape.setVariable('lootShapeInfo', lootShapeInfo);
        colshape.setVariable('itemList', []);

        this.colshape = colshape;
        this.label = label;
    }

    public getColshape(): ColshapeMp {
        return this.colshape;
    }

    public getLabel(): TextLabelMp {
        return this.label;
    }

    public createLootShape(pos: Vector3Mp, dist: number, labelText: string = 'No name') {
        const colshape: ColshapeMp = mp.colshapes.newSphere(pos.x, pos.y, pos.z, dist);
        const label: TextLabelMp = mp.labels.new(labelText, pos, {drawDistance: dist});

        // Инициализация сущностей как предметов для лута.
        this.init(colshape, label);
    }
}