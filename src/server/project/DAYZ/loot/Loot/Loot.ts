import { Colshape } from "../entities/Colshape";
import { CreateItemParams, LootSpawn, LootShapeInfo } from "../../interfaces";
import shortid from 'shortid';
import { EItem } from "../Item/Item";
import { Item, DataWeapon, ItemType, ItemKey, DataBodyArmour } from "../../types";

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
        this.colshape.setVariable('playersIdsOnColshape', []);
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
            params.range,
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

    public spawn(items: Item[], params: CreateItemParams) {
        // Создание точки для лута.
        this.createLootPoint(items, params);
    }

    // СОЗДАНИЕ ОБЪЕКТОВ ПРЕДМЕТОВ.
    public createWeaponItem(name: string, description: string, clip: number, maxStackCount: number, amount: number): Item {
        const dataWeapon: DataWeapon = {
            type: ItemType.WEAPON,
            name: name,
            description: description,
            clip: clip,
            maxStackCount: 1,
            shortid: shortid.generate(),
        };
        
        return EItem.createItem(ItemKey.ITEM_WEAPON_AK47, amount, dataWeapon);
    }
    
    public createBodyArmorItem(name: string, description: string, defence: number, maxStackCount: number, amount: number): Item {
        const dataBodyArmour: DataBodyArmour = {
            type: ItemType.ARMOR,
            defence: defence,
            name: name,
            description: description,
            maxStackCount: maxStackCount,
            shortid: shortid.generate(),
        };
    
        return EItem.createItem(ItemKey.ITEM_ARMOR, amount, dataBodyArmour);
    }
}