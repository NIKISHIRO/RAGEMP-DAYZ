import { Colshape } from "../entities/Colshape";
import { LootSpawn, LootShapeInfo } from "../../interfaces";
import { EItem } from "../Item/Item";
import { Item, SpawnLootData, ItemRarity} from "../../types";
import { itemInfo } from "../Item/itemInfo";
import { randomInteger } from '../../helpers';
import { postgres } from "project/DAYZ/db";

type RarityItems = {
    [ItemRarity.RARITY_1]: Item[];
    [ItemRarity.RARITY_2]: Item[];
    [ItemRarity.RARITY_3]: Item[];
    [ItemRarity.RARITY_4]: Item[];
}

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

    // Добавляет новую точку с лутом.
    static async addSpawnLootPoint(items: ItemRarity[], position: number[]) {
        await postgres<SpawnLootData>('spawnlootinfo').insert({items, position});
        mp.players.broadcast(`Добавлена точка с лутом: ${items.join(', ')} | ${position.join(', ')}`);
    }

    // Возвращает все созданные точки с лутом, либо false.
    static async getSpawnLootPoints(): Promise<SpawnLootData[] | false> {        
        if (await postgres.schema.hasTable('spawnlootinfo')) {
            return postgres<SpawnLootData>('spawnlootinfo').select('*');
        } 
        
        return false;
    }

    // Разделение предметов на редкость. 
    static getRarItems(): RarityItems {
        return {
            [ItemRarity.RARITY_1]: itemInfo.map(i => i.data.rarity === ItemRarity.RARITY_1 ? i : null).filter(i => i !== null) as Item[],
            [ItemRarity.RARITY_2]: itemInfo.map(i => i.data.rarity === ItemRarity.RARITY_2 ? i : null).filter(i => i !== null) as Item[],
            [ItemRarity.RARITY_3]: itemInfo.map(i => i.data.rarity === ItemRarity.RARITY_3 ? i : null).filter(i => i !== null) as Item[],
            [ItemRarity.RARITY_4]: itemInfo.map(i => i.data.rarity === ItemRarity.RARITY_4 ? i : null).filter(i => i !== null) as Item[],
        }
    }

    static spawnLoot(spawnData: SpawnLootData[]) {
        spawnData.forEach(spawn => { 
            // Создание сущностей в одной точке.
            const vector3 = new mp.Vector3(spawn.position[0], spawn.position[1], spawn.position[2]);
            const colshape = Loot.createColshape(vector3);
            const object = Loot.createObject(vector3);
            const label = Loot.createLabel(vector3);
            const blip = Loot.createBlip(vector3);
            const loot = new Loot(colshape, object, label, blip);
    
            // Массив рандомных предметов, разделенные по редкости.
            const items: any = spawn.items.map(rarity => {
                const itemsByRarity = Loot.getRarItems()[rarity];
    
                // Заполняет массив рандомными предметами.
                for (let i = 0; i < spawn.items.length; i++) {
                    const randomIndex = randomInteger(0, itemsByRarity.length - 1);
                    const randomItem = itemsByRarity[randomIndex];
        
                    if (randomItem) {
                        console.log(`[LOOT CREATE]: ${randomItem.key} | ${randomItem.amount} | ${rarity}`.yellow);
                        return EItem.createItem(randomItem.key, randomItem.amount, randomItem.data);
                    }
    
                    return null;
                }
            })
            .filter(i => i !== null);
            loot.createLootPoints(items);
        });
    }

    public getColshape(): ColshapeMp {
        return this.colshape;
    }

    public getLabel(): TextLabelMp {
        return this.label;
    }
    
    // СОЗДАЕТ ТОЧКУ ДЛЯ ЛУТА.
    public createLootPoints(items: Item[]) {
        const instColshape = new Colshape(this.colshape);
        instColshape.addItem([...items]);
    }
}

export {
    Loot,
}