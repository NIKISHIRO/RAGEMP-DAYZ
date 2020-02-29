import { Colshape } from "./entities/Colshape";
import { CreateItemParams, LootShapeInfo, LootSpawn } from "../interfaces";

/*
    Лут - класс, который создает на указаных коорд. точку для взятия лута.
    У игрока вставшего на "точку" должна быть возможность взять лут с этой точки.

    Через этот класс идет регистрация сущностей, как предметов. 
*/

export class Loot {
    private colshape: ColshapeMp;
    private label: TextLabelMp;
    private object: ObjectMp

    private init() {
        const lootShapeInfo: LootShapeInfo = {
            type: LootSpawn.RELOAD,
            labelId: this.label.id,
            objectId: this.object.id,
        };
        
        this.colshape.setVariable('lootShapeInfo', lootShapeInfo);
        this.colshape.setVariable('itemList', []);
    }

    public getColshape(): ColshapeMp {
        return this.colshape;
    }

    public getLabel(): TextLabelMp {
        return this.label;
    }

    public createLootShape(pos: Vector3Mp, dist: number, labelText: string = 'Item', objectHash: string) {
        const colshape: ColshapeMp = mp.colshapes.newSphere(pos.x, pos.y, pos.z, dist);
        const object: ObjectMp = mp.objects.new(objectHash, pos);

        pos.z += 1;
        const label: TextLabelMp = mp.labels.new(labelText, pos, {drawDistance: dist});

        this.colshape = colshape;
        this.label = label;
        this.object = object;

        // Инициализация сущностей как предметов для лута.
        this.init();
    }

    static createItem(key: string, amount: number, data: object = {}): Item {
        return {key, amount, data};
    }

    // СОЗДАЕТ ТОЧКУ ДЛЯ ЛУТА.
    public createItemPoint(items: Item[], params: CreateItemParams) {
        this.createLootShape(params.pos, 3, params.labelText, params.objectHash);
        const colshape: ColshapeMp = this.getColshape();
        Colshape.addItem(colshape, [...items]);        
    }
}