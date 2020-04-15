import { Colshape } from "../entities/Colshape";
import { LootSpawn, LootShapeInfo } from "../../interfaces";
import shortid from 'shortid';
import { EItem } from "../Item/Item";
import { Item, DataWeapon, ItemType, ItemKey, DataBodyArmour, ItemData, DataClothes } from "../../types";

class Loot {
    private colshape: ColshapeMp;
    private label: TextLabelMp;
    private object: ObjectMp
    private blip: BlipMp;

    static range: number = 2;

    constructor(colshape: ColshapeMp, object: ObjectMp, label: TextLabelMp, blip: BlipMp) {
        this.colshape = colshape;
        this.object = object;
        this.label = label;
        this.blip = blip;

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

    static createColshape(pos: Vector3Mp) {
        pos.z -= .9;
        return mp.colshapes.newSphere(pos.x, pos.y, pos.z, this.range);
    }

    static createObject(pos: Vector3Mp) {
        return mp.objects.new('sm_prop_smug_crate_m_medical', pos);
    }

    static createLabel(pos: Vector3Mp) {
        pos.z += 1
        return mp.labels.new('labelText', pos, {drawDistance: this.range});
    }

    static createBlip(pos: Vector3Mp) {
        return mp.blips.new(1, pos, {
            scale: .5,
            color: 3,
        });
    }

    // СОЗДАЕТ ТОЧКУ ДЛЯ ЛУТА.
    public createLootPoint(items: Item[]) {
        const instColshape = new Colshape(this.colshape);
        instColshape.addItem([...items]);
    }

    //////////////////////////////////////////////////////////////

    // СОЗДАНИЕ ОБЪЕКТОВ ПРЕДМЕТОВ.

    public createClothesItem(key: string, name: string, description: string, addSlots: number, weight: number, msc: number, amount: number) {
        const dataWeapon: DataClothes = {
            type: ItemType.WEAPON,
            name: name,
            weight: weight,
            addSlots: addSlots,
            componentId: 1,
            drawable: 1,
            description: description,
            maxStackCount: msc,
            shortid: shortid.generate(),
        };
        
        return EItem.createItem(ItemKey[key], amount, dataWeapon);
    }

    public createWeaponItem(name: string, description: string, weight: number, msc: number, amount: number): Item {
        const dataWeapon: DataWeapon = {
            type: ItemType.WEAPON,
            name: name,
            weight: weight,
            description: description,
            maxStackCount: msc,
            shortid: shortid.generate(),
        };
        
        return EItem.createItem(ItemKey.ITEM_WEAPON_AK47, amount, dataWeapon);
    }
    
    public createBodyArmorItem(name: string, description: string, weight: number, defence: number, maxStackCount: number, amount: number): Item {
        const dataBodyArmour: DataBodyArmour = {
            type: ItemType.ARMOR,
            defence: defence,
            name: name,
            weight: weight,
            description: description,
            maxStackCount: maxStackCount,
            shortid: shortid.generate(),
        };
    
        return EItem.createItem(ItemKey.ITEM_ARMOR, amount, dataBodyArmour);
    }

    public createItem(key: string, name: string, description: string, weight: number, maxStackCount: number, amount: number): Item {
        const data: ItemData = {
            type: ItemType.COMMON,
            name: name,
            weight: weight,
            description: description,
            maxStackCount: maxStackCount,
            shortid: shortid.generate(),
        };

        return EItem.createItem(ItemKey[key], amount, data);
    }
}

export {
    Loot,
}