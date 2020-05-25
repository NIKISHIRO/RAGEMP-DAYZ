import shortid from 'shortid';
import { ItemKey, ItemData, Item, WeaponData, ItemType, BodyArmourData, ClothesData, ItemRarity } from '../../types';

class EItem {
    static createItem(key: ItemKey, amount: number, data: ItemData): Item {
        return {key, amount, data: {...data, shortid: shortid.generate()}};
    }
}

class CommonItem<I> {
    public key: ItemKey;
    public amount: number;
    public data: I;

    constructor(
        itemKey: ItemKey,
        amount: number,
        type: ItemType,
        rarity: ItemRarity,
        maxStackCount: number,
        name: string,
        description: string,
        hash: string,
        isDelete: boolean,
        isCollision: boolean,
    )
    {
        this.key = itemKey;
        this.amount = amount;

        this.data = {
            type: type,
            rarity: rarity,
            maxStackCount: maxStackCount,
            name: name,
            description: description,
            hash: hash,
            isDelete: isDelete,
            isCollision: isCollision,
            serverId: shortid.generate(),
            shortid: shortid.generate(),
        };
    }
}

class ClothesItem extends CommonItem<ClothesData> {
    public addSlots: number;
    public componentId: number;
    public drawableId: number;

    constructor(
        itemKey: ItemKey,
        amount: number,
        rarity: ItemRarity,
        maxStackCount: number, 
        name: string, 
        description: string, 
        hash: string, 
        isDelete: boolean, 
        isCollision: boolean,
        addSlots: number,
        componentId: number,
        drawable: number,
    ) {
        super(itemKey, amount, ItemType.CLOTHES, rarity, maxStackCount, name, description, hash, isDelete, isCollision);

        this.data.addSlots = addSlots;
        this.data.componentId = componentId;
        this.data.drawable = drawable;
    }
}

class WeaponItem extends CommonItem<WeaponData> {
    constructor(
        itemKey: ItemKey,
        amount: number,
        rarity: ItemRarity, 
        maxStackCount: number,
        name: string,
        description: string, 
        hash: string,
        isDelete: boolean, 
        isCollision: boolean,
    ) 
    {
        super(itemKey, amount, ItemType.WEAPON, rarity, maxStackCount, name, description, hash, isDelete, isCollision);
    }
}

class BodyArmorItem extends CommonItem<BodyArmourData> {
    constructor(
        itemKey: ItemKey,
        amount: number,
        rarity: ItemRarity,
        maxStackCount: number, 
        name: string,
        description: string, 
        hash: string, 
        isDelete: boolean,
        isCollision: boolean,
    ) 
    {
        super(itemKey, amount, ItemType.ARMOR, rarity, maxStackCount, name, description, hash, isDelete, isCollision);
    }
}

export {
    CommonItem,
    ClothesItem,
    WeaponItem,
    BodyArmorItem,
    EItem,
}