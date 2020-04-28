import { Colshape } from "../entities/Colshape";
import { LootSpawn, LootShapeInfo } from "../../interfaces";
import shortid from 'shortid';
import { EItem } from "../Item/Item";
import { Item, ItemType, ItemKey, ItemData, ClothesData, WeaponData, BodyArmourData, SpawnData, ItemRarity } from "../../types";
import { itemInfo } from "../Item/itemInfo";

class Loot {
    static range: number = 2;
    
    private colshape: ColshapeMp;
    private label: TextLabelMp;
    private object: ObjectMp
    private blip: BlipMp;

    constructor(colshape: ColshapeMp, object: ObjectMp, label: TextLabelMp, blip: BlipMp) {
        this.colshape = colshape;
        this.object = object;
        this.label = label;
        this.blip = blip;

        const lootShapeInfo: LootShapeInfo = {
            type: LootSpawn.SPAWN,
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
        return mp.objects.new('prop_michael_backpack', pos);
    }

    static createLabel(pos: Vector3Mp) {
        pos.z += 1;
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

    static spawnLoot(spawnData: SpawnData[]) {
        // получить случайное число (min-max).
        function randomInteger(min, max) {
            let rand = min - 0.5 + Math.random() * (max - min + 1);
            return Math.round(rand);
        }
    
        // Разделение предметов на редкость.
        function getRarItems() {
            return {
                [ItemRarity.RARITY_1]: itemInfo.map(i => i.data.rarity === ItemRarity.RARITY_1 ? i : null).filter(i => i !== null),
                [ItemRarity.RARITY_2]: itemInfo.map(i => i.data.rarity === ItemRarity.RARITY_2 ? i : null).filter(i => i !== null),
                [ItemRarity.RARITY_3]: itemInfo.map(i => i.data.rarity === ItemRarity.RARITY_3 ? i : null).filter(i => i !== null),
                [ItemRarity.RARITY_4]: itemInfo.map(i => i.data.rarity === ItemRarity.RARITY_4 ? i : null).filter(i => i !== null),
            }
        }
    
        spawnData.forEach(spawn => { 
            // Создание сущностей в одной точке.
            const vector3 = new mp.Vector3(spawn.position[0], spawn.position[1], spawn.position[2]);
            const colshape = Loot.createColshape(vector3);
            const object = Loot.createObject(vector3);
            const label = Loot.createLabel(vector3);
            const blip = Loot.createBlip(vector3);
            const loot = new Loot(colshape, object, label, blip);
    
            const items: any = spawn.items.map((item) => {
                const itemsByRarity = getRarItems()[item.rarity];
    
                // Заполняет массив рандомными предметами.
                for (let i = 0; i < spawn.items.length; i++) {
                    const randomIndex = randomInteger(0, itemsByRarity.length - 1);
                    const randomItem = itemsByRarity[randomIndex];
        
                    if (randomItem) {
                        console.log(`[LOOT CREATE]: ${randomItem.key} | ${randomItem.amount} | ${item.rarity}`.yellow);
                        return EItem.createItem(randomItem.key, randomItem.amount, randomItem.data);
                    }
    
                    return null;
                }
            });
    
            const lootItems = items.filter(i => i !== null);
            loot.createLootPoint(lootItems);
        });
    }
    
}

export {
    Loot,
}