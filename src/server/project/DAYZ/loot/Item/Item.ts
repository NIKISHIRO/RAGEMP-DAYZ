import shortid from 'shortid';
import { ItemKey, ItemData, Item, WeaponData, ItemType, BodyArmourData, ClothesData, ItemRarity } from '../../types';

export class EItem {
    static createItem(key: ItemKey, amount: number, data: ItemData): Item {
        return {key, amount, data: {...data, shortid: shortid.generate()}};
    }

    static createSimpleItem(key: ItemKey, rarity: ItemRarity, name: string, description: string, weight: number, msc: number, amount: number, isDelete: boolean): Item {
        const data: ItemData = {
            type: ItemType.COMMON,
            rarity: rarity,
            name: name,
            weight: weight,
            description: description,
            maxStackCount: msc,
            serverId: shortid.generate(),
            shortid: shortid.generate(),
            isDelete,
        };

        return EItem.createItem(ItemKey[key], amount, data);
    }

    static createClothesItem(key: ItemKey, rarity: ItemRarity, name: string, description: string, addSlots: number, weight: number, amount: number, cId: number, dr: number, isDelete: boolean) {
        const data: ClothesData = {
            type: ItemType.CLOTHES,
            rarity: rarity,
            name: name,
            weight: weight,
            addSlots: addSlots,
            componentId: cId,
            drawable: dr,
            description: description,
            maxStackCount: 1,
            serverId: shortid.generate(),
            shortid: shortid.generate(),
            isDelete,
        };
        
        return EItem.createItem(ItemKey[key], amount, data);
    }

    static createWeaponItem(key: ItemKey, rarity: ItemRarity, name: string, description: string, weight: number, amount: number, isDelete: boolean): Item {
        const data: WeaponData = {
            type: ItemType.WEAPON,
            rarity: rarity,
            name: name,
            weight: weight,
            description: description,
            maxStackCount: 1,
            serverId: shortid.generate(),
            shortid: shortid.generate(),
            isDelete,
        };
        
        return EItem.createItem(ItemKey[key], amount, data);
    }
    
    static createBodyArmorItem(key: ItemKey, rarity: ItemRarity, name: string, description: string, weight: number, defence: number, amount: number, isDelete: boolean): Item {
        const data: BodyArmourData = {
            type: ItemType.ARMOR,
            rarity,
            defence,
            name,
            weight,
            description,
            maxStackCount: 1,
            serverId: shortid.generate(),
            shortid: shortid.generate(),
            isDelete,
        };
    
        return EItem.createItem(ItemKey[key], amount, data);
    }
}