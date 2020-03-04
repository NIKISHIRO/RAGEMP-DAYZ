import { Colshape } from "../entities/Colshape";
import { CreateItemParams, LootShapeInfo, LootSpawn } from "../../interfaces";

/*
    Лут - класс, который создает на указаных коорд. точку для взятия лута.
    У игрока вставшего на "точку" должна быть возможность взять лут с этой точки.

    Через этот класс идет регистрация сущностей, как предметов. 
*/

export class Loot {
    private colshape: ColshapeMp;
    private label: TextLabelMp;
    private object: ObjectMp
    private blip: BlipMp;

    private init() {
        const lootShapeInfo: LootShapeInfo = {
            type: LootSpawn.RELOAD,
            labelId: this.label.id,
            objectId: this.object.id,
            blipId: this.blip.id,
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

    public createLootShape(params: CreateItemParams) {
        const colshape: ColshapeMp = mp.colshapes.newSphere(
            params.colshapePosition.x, 
            params.colshapePosition.y, 
            params.colshapePosition.z, 
            params.range
        );
        
            
        const object: ObjectMp = mp.objects.new(params.objectHash, params.objectPosition);
        let blip = mp.blips.new(1, params.colshapePosition, {
            scale: .5,
            color: 3
        });

        params.labelPosition.z += 1;
        const label: TextLabelMp = mp.labels.new(params.labelText, params.labelPosition, {drawDistance: params.range});

        this.colshape = colshape;
        this.label = label;
        this.object = object;
        this.blip = blip;

        // Инициализация сущностей как предметов для лута.
        this.init();
    }

    // СОЗДАЕТ ТОЧКУ ДЛЯ ЛУТА.
    public createLootPoint(items: Item[], params: CreateItemParams) {
        // Создание лута, инициализация свойств энтити.
        this.createLootShape(params);
        const colshape: ColshapeMp = this.getColshape();
        Colshape.addItem(colshape, [...items]);        
    }
}