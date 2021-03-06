import { LootSpawn, LootShapeInfo } from "../../interfaces";
import { EItem } from "../Item/Item";
import { Item, SpawnLootData, ItemRarity} from "../../types";
import { itemInfo } from "../Item/itemInfo";
import { randomInteger } from '../../helpers';
import { postgres } from "../../db";
import { EObject } from "../entities/Object";

type RarityItems = {
    [ItemRarity.RARITY_1]: Item[];
    [ItemRarity.RARITY_2]: Item[];
    [ItemRarity.RARITY_3]: Item[];
    [ItemRarity.RARITY_4]: Item[];
}

class Loot {
    // Создает объект.
    static createObject(pos: Vector3Mp, hash: string = 'prop_michael_backpack') {
        const object = mp.objects.new(hash, pos);
        return object;
    }

    // Создает блип.
    static createBlip(pos: Vector3Mp) {
        return mp.blips.new(1, pos, {
            scale: .4,
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
    
    static setLootableObject(
        object: ObjectMp,
        collisionId: number | null,
        skinObjectId: number | null,
        blipId: number,
        itemName: string,
        lootType: 'item' | 'storage')
    {
        object.setVariable('lootItems', []);
        object.setVariable('collisionId', collisionId);
        object.setVariable('objectId', object.id);
        object.setVariable('skinObjectId', skinObjectId);
        object.setVariable('blipId', blipId);
        object.setVariable('itemName', itemName);
        object.setVariable('lootItems', []);
        object.setVariable('lootType', lootType);
    }

    static createLootObject(item: Item, position: Vector3Mp) {
        const createdItem = EItem.createItem(item.key, item.amount, item.data);
        const blip = Loot.createBlip(position);

        let collisionObject: any = null;
        const skinObject = Loot.createObject(position, item.data.hash);

        if (item.data.isCollision) { // Предмет с коллизией.
            collisionObject = Loot.createObject(position, 'p_ld_am_ball_01');
            collisionObject.alpha = 50;
            Loot.setLootableObject(collisionObject, collisionObject.id, skinObject.id, blip.id, createdItem.data.name, 'item');
            
            Loot.addItems(collisionObject.id, [createdItem]);
        } else { // Если предмет без коллизии.
            Loot.setLootableObject(skinObject, null, skinObject.id, blip.id, createdItem.data.name, 'item');

            Loot.addItems(skinObject.id, [createdItem]);
        }
    }

    static spawnLoot(spawnData: SpawnLootData[]) {
        spawnData.forEach(spawn => {    
            // Массив рандомных предметов, разделенные по редкости.
            spawn.items.forEach(rarity => {
                const itemsByRarity = Loot.getRarItems()[rarity];
                // Заполняет массив рандомными предметами.
                const randomIndex = randomInteger(0, itemsByRarity.length - 1);
                const randomItem = itemsByRarity[randomIndex];
                if (randomItem) {
                    console.log(`[LOOT CREATE]: ${randomItem.key} | ${randomItem.amount} | ${rarity}`.yellow);
                    Loot.createLootObject(randomItem, new mp.Vector3(spawn.position[0], spawn.position[1], spawn.position[2]));
                }
            });
        });
    }

    static addItems(objId: number, items: Item[]): boolean {
        if (!items.length) {
            return false;
        }

        const object = mp.objects.at(objId);
        if (!mp.objects.exists(objId)) {
            return false;
        }

        const lootItems: Item[] = object.getVariable('lootItems');
        lootItems.push(...items);
        object.setVariable('lootItems', lootItems);

        return true;
    }
}

export {
    Loot,
}