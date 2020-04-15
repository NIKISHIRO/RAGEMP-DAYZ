import { logger } from "../shared/logger";
import { Colshape } from "../loot/entities/Colshape";
import { Label } from "../loot/entities/Label";
import { EObject } from "../loot/entities/Object";
import { Loot } from "../loot/Loot/Loot";
import { ReturnInformation, LootShapeInfo, CreateItemParams, LootSpawn, InventoryInfo, NotifyParams } from "../interfaces";
import { Blip } from "../loot/entities/Blip";
import { EItem } from "../loot/Item/Item";
import {SPAWNS} from '../playerSpawns';
import { callBrowsers } from 'rage-rpc';
import { Item } from "../types";
import { CEF } from "../CEF";

export class Player {

    constructor(player: PlayerMp) {
        this.player = player;
    }

    public player: PlayerMp;

    // С CEF приходит shortid. По shortid найти предмет.
    public takeItemByShortId(shortid: string, amount: number) {
        const colshapes = this.getColshapesObjectsGround();

        // Поиск предмета и колшип, который пытается взять игрок.
        let findItem;
        let findShape;
        colshapes.forEach(shape => {
            const itemList: Item[] = shape.getVariable('itemList');
            itemList.forEach(item => {
                if (item.data.shortid === shortid) {
                    findItem = item;
                    findShape = shape;
                }
            });
        });
        
        if (findItem !== undefined && findShape !== undefined) {
            const playersIdsOnColshape: number[] = findShape.getVariable('playersIdsOnColshape');
            const itemList = findShape.getVariable('itemList');

            const idx = itemList.findIndex(item => item.data.shortid === findItem.data.shortid);

            console.log('idx', idx);

            // Если в предметах колшипа не был найден предмет с данные shortid.
            if (idx === -1) {
                return;
            }

            const newItem = {...findItem};
            if (newItem.amount > amount) {
                newItem.amount -= amount;
                itemList.splice(idx, 1, EItem.createItem(newItem.key, newItem.amount, newItem.data));
                console.log(' ---> newItem.amount >= amount', amount);
            } 
            else if (newItem.amount <= amount) {
                itemList.splice(idx, 1);
                console.log(' ---> newItem.amount <= amount', amount);
            }
            
            // Перезаписать предмет в колшипе с которого он берется.
            findShape.setVariable('itemList', itemList);

            // Перерисовать UI. Ground.
            playersIdsOnColshape.forEach(plrId => {
                const player = mp.players.at(plrId);
                const plr = new Player(player);
                const cef = new CEF(player);
                
                if (!itemList.length) {
                    plr.removeItemPoint(findShape.id);
                }

                const items = plr.getItemsPlayerAround();
                cef.cefSetGroundItems(items);
            });

            // Если список предметов после манипуляция стал пуст - удалить кошлип и все сущности связанные с ним.
            // И удалить колшип из игрока.
            if (!itemList.length) {
                this.removeAllLootShapeEntity(findShape);
            }
        }
    }

    public removeAllLootShapeEntity(colshape: ColshapeMp) {
        const lootShapeInfo: LootShapeInfo = colshape.getVariable('lootShapeInfo');
        
        if (Colshape.destroy(colshape)) {
            const labelId = lootShapeInfo.labelId;
            const objId = lootShapeInfo.objectId;
            const blipId = lootShapeInfo.blipId;

            // Если label с таким ИД на серваке нету - вывести в консоль об этом.
            if (!mp.labels.exists(labelId)) {
                logger('red', 'Player', 'takeItem', 'mp.labels.exists', 'Такого Label не существует.');
            } else { // Уничтожить..
                Label.destroy(labelId);
            }

            // Если object с таким ИД на серваке нету - вывести в консоль об этом.
            if (!mp.objects.exists(objId)) {
                logger('red', 'Player', 'takeItem', 'mp.objects.exists', 'Такого Object не существует.');
            } else { // Уничтожить.
                EObject.destroy(objId);
            }

            // Если object с таким ИД на серваке нету - вывести в консоль об этом.
            if (!mp.blips.exists(blipId)) {
                logger('red', 'Player', 'takeItem', 'mp.objects.exists', 'Такого Object не существует.');
            } else { // Уничтожить.
                Blip.destroy(blipId);
            }

            logger('green', 'colshape', colshape.toString(), 'Удален.');
        }
    }

    // Возвращает массив объектов предметов вокруг игрока. (itemList).
    public getItemsPlayerAround(): Item[] {
        const colshapes = this.getColshapesObjectsGround();
        const items: Item[] = [];
        colshapes.forEach((shape) => {
            const itemList: Item[] = shape.getVariable('itemList');
            
            itemList.forEach(item => {
                items.push(item);
            });
        });
        
        return items;
    }

    // Добавляет ид объекта игрока в колшип.
    public addPlayerInColshape(colshape: ColshapeMp, player: PlayerMp): void {
        const colshapePlayers: number[] = colshape.getVariable('playersIdsOnColshape');
        colshapePlayers.push(player.id);
        colshape.setVariable('playersIdsOnColshape', colshapePlayers);
    }

    // Удаляет ид объ. игрока из колшипа.
    public removePlayerInColshape(colshape: ColshapeMp, player: PlayerMp) {
        const plrIndexes: number[] = colshape.getVariable('playersIdsOnColshape');
        const idx = plrIndexes.findIndex(id => id === player.id);
        plrIndexes.splice(idx, 1);
        colshape.setVariable('playersIdsOnColshape', plrIndexes);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////

    static spawnRandomCoords(player: PlayerMp) {
        // Массив координат спавна игрока.
        // Получение рандом. числа для индекса массива с коордами.
        const min: number = 0;
        const max: number = SPAWNS.length - 1;
        const randomNumber: number = Math.floor(min + Math.random() * (max + 1 - min));
        // рандомная коорината.
        const coordSpawn: number[] = SPAWNS[randomNumber];
        player.spawn(new mp.Vector3(coordSpawn[0], coordSpawn[1], coordSpawn[2]));
    }

    // Возвращает массив колшип-идов.
    public getItemPoints(): number[] {
        return this.player.getVariable('itemPoints');
    }

    // Добавляет ИД колшипа в itemPoints игрока.
    public addItemPoint(shapeId: number) {
        // Спавнит игрока на рандом. коорд. которые берет из playerSpawns.
        const itemPoints = this.player.getVariable('itemPoints');
        itemPoints.push(shapeId);
        this.player.setVariable('itemPoints', itemPoints);
    }

    // Удаляет колшип из массива itemPoints игрока.
    public removeItemPoint(shapeId: number) {
        const itemPoints = this.getItemPoints();
        const idx = itemPoints.findIndex(idx => shapeId === idx);
        
        if (idx === -1) return;

        itemPoints.splice(idx, 1);
        this.player.setVariable('itemPoints', itemPoints);
    }

    // Устанавливает массив ИДОВ колшипов.
    public setItemPoints(player: PlayerMp, shapeIds: number[]) {
        player.setVariable('itemPoints', shapeIds);
    }

    // Возвращает массив колшипов вокруг игрока.
    public getColshapesObjectsGround(): ColshapeMp[] {
        const itemPoints: number[] = this.getItemPoints();
        return itemPoints.map(shapeId => mp.colshapes.at(shapeId));
    }

    // return: Item[]. Получает itemList колшипа по ИД в массиве "доступных точек"(itemPoints) игрока.
    public getItemListByIndex(id: number): Item[] {
        if (isNaN(id) || !Number.isInteger(id)) {
            console.log('getItemListByIndex - ожидала число. Пришло = ', id);
            return [];
        }

        const colshapes: ColshapeMp[] = this.getColshapesObjectsGround();

        if (!colshapes[id]) {
            console.log('getItemListByIndex - ошибка', id);
            return [];
        }
        
        const itemList: Item[] = colshapes[id].getVariable('itemList');
        return itemList;
    }

    // cellId - Индекс элемента в массиве itemPoints игрока для получения колшипа.
    // itemId - Индекс предмета в массиве itemList полученного колшипа.
    public getItem(cellId: number, itemId: number): any {
        const itemList = this.getItemListByIndex(cellId);

        if (!itemList) {
            return false;
        }

        const item: Item = itemList[itemId];
        return item;
    }

    public takeColshapesItem() {
        
    }

    // Из itemPoints берет itemList из колшипа под индексом = cellId 
    // и берет из массива itemList предмет под индексом itemId
    public takeColshapeItem(cellId: number, itemId: number, amount: number): ReturnInformation {
        const item = this.getItem(cellId, itemId);
        const inventory: Item[] = [...this.player.getInventory()];
        const invInfo: InventoryInfo = this.player.getVariable('inventoryInfo');

        const returnInformation = {
            info: {
                text: 'Ввелите корректное, целое число!',
                data: {
                    takenItem: {},
                },
            },
            result: false
        };

        // Если хоть 1 число приходит не в нужном виде - return;
        if (!Number.isInteger(cellId) || !Number.isInteger(itemId) || !Number.isInteger(amount)) {
            return returnInformation;
        }
        
        if (item) {
            const colshapes: ColshapeMp[] = this.getColshapesObjectsGround();
            const colshape: ColshapeMp = colshapes[cellId];
            const colshapeId: number = colshape.id;
            const lootShapeInfo: LootShapeInfo = colshape.getVariable('lootShapeInfo');
            
            const itemPoints: number[] = this.getItemPoints();
            const itemListOrFalse = this.getItemListByIndex(cellId);

            // Проверка - находится ли игрок в пределах колшипа.
            if (!colshape.isPointWithin(this.player.position)) {
                returnInformation.info.text = 'Поблизости нет точки с лутом';
                returnInformation.result = false;
                return returnInformation;
            }

            // Если у игрока есть такой колшип, удалить его ид из массива
            // и сам колшип с карты.
            const idx = itemPoints.findIndex(i => i === colshapeId);
            if (idx !== -1) {
                // Если массив предметов в колшипе больше нуля, удалить выбранный предмет.
                if (itemListOrFalse && itemListOrFalse.length > 0) {
                    const itemList: Item[] = itemListOrFalse; // Явное приведение к itemList.

                    const item = itemList[itemId];
                    // Если в текущем колшипе нет amount предметов - return;
                    if (item.amount < amount) {
                        returnInformation.info.text = 'В этой точке нет ' + amount + 'шт. ' + item.key;
                        returnInformation.result = false;
                        return returnInformation;
                    } else { // Иначе удалить 'amount'шт. из этого предмета.
                        item.amount -= amount;
                    }

                    // Если кол-во предметов = 0, то удалить item из itemList.
                    if (item.amount === 0) {
                        itemList.splice(itemId, 1);
                    }

                    colshape.setVariable('itemList', itemList);
                    
                    returnInformation.info.text = 'Предмет был удален из этой точки. Осталось всего: ' + itemList.length + 'предметов.';
                    returnInformation.result = true;
                }
                // Если массив пуст, то удалить сам колшип.
                if (itemListOrFalse && !itemListOrFalse.length) {
                    this.player.setVariable('itemPoints', itemPoints);

                    // Перебор массива itemPoint каждого игрока.
                    // Если у игрока есть ИД такого колшипа - удалить его из массива ТОЧЕК.
                    mp.players.forEach(p => {
                        const itemPoints = p.getVariable('itemPoints');
                        
                        if (itemPoints.length) {
                            const idx = itemPoints.findIndex(id => id === colshapeId);
                            
                            if (idx !== -1) {
                                itemPoints.splice(idx, 1);
                                p.setVariable('itemPoints', itemPoints);
                            }   
                        }
                    });

                    // Если получилось уничтожить colshape.
                    if (Colshape.destroy(colshape)) {
                        console.log('lootShapeInfo', lootShapeInfo);
                        const labelId = lootShapeInfo.labelId;
                        const objId = lootShapeInfo.objectId;
                        const blipId = lootShapeInfo.blipId;

                        // Если label с таким ИД на серваке нету - вывести в консоль об этом.
                        if (!mp.labels.exists(labelId)) {
                            logger('red', 'Player', 'takeItem', 'mp.labels.exists', 'Такого Label не существует.');
                        } else { // Уничтожить..
                            Label.destroy(labelId);
                        }

                        // Если object с таким ИД на серваке нету - вывести в консоль об этом.
                        if (!mp.objects.exists(objId)) {
                            logger('red', 'Player', 'takeItem', 'mp.objects.exists', 'Такого Object не существует.');
                        } else { // Уничтожить.
                            EObject.destroy(objId);
                        }

                        // Если object с таким ИД на серваке нету - вывести в консоль об этом.
                        if (!mp.blips.exists(blipId)) {
                            logger('red', 'Player', 'takeItem', 'mp.objects.exists', 'Такого Object не существует.');
                        } else { // Уничтожить.
                            Blip.destroy(blipId);
                        }

                        returnInformation.info.text = `Эта точка была удалена.`;
                        returnInformation.result = true;

                        logger('green', 'colshape', colshapeId.toString(), 'Удален.');
                    }
                }

                if (this.player.giveItem(item.key, amount, item.data)) {
                    returnInformation.info.data.takenItem = EItem.createItem(item.key, amount, item.data);
                    returnInformation.info.text = 'Вы подобрали ' + amount + 'шт. ' + item.key;
                    returnInformation.result = true;
                } else {
                    returnInformation.info.text = 'ОШИБКА ВЗЯТИЯ ПРЕДМЕТА. '+item.key+' не зарегистрирован (он был удален)!';
                    returnInformation.result = false;
                } 
            }
        } else { // Если item = false.
            returnInformation.info.text = 'Такого предмета или точки здесь нет!';
            returnInformation.result = false;
            return returnInformation;
        }

        return returnInformation;
    }

    // Выкидывает предмет из инвентаря.
    public dropItem(itemIdx: number, amount: number, cellId?: number): ReturnInformation {
        const inventory = this.player.getInventory();
        const pos = this.player.position;

        const returnInformation: ReturnInformation = {
            result: false,
            info: {
                text: 'Введите корректные целые числа'
            } 
        };

        // Если пришло не число или не целое число, то return.
        if (isNaN(itemIdx) || isNaN(amount) || !Number.isInteger(itemIdx) || !Number.isInteger(amount)) {
            logger('red', 'dropItem', 'itemIdx', String(itemIdx), ', amount', String(amount));
            return returnInformation;
        }
        
        // Если инвентарь не имеет предмета под данным индексом - return.
        if (!inventory[itemIdx]) {
            returnInformation.info.text = 'У вас нет в инвентаре предмета с индексом '+itemIdx;
            return returnInformation;
        }

        const item: Item = inventory[itemIdx];

        // Если кол-во предметов в инвентаре меньше, чем указал игрок - return.
        if (this.player.getItemAmount(item.key) < amount) {
            returnInformation.info.text = 'В вашем инвентаре нет шт. '+amount+ ' ' + amount;
            return returnInformation;
        }

        // Минус 'amount' предметов.
        if(!this.player.removeItem(itemIdx, amount)) {
            returnInformation.result = false;
            returnInformation.info.text = `Ошибка удаления предмета из инвентаря.`;
            return returnInformation;
        }

        // Если указана ячейка (индекс колшипа) и он целое число.
        if (cellId !== undefined && Number.isInteger(cellId)) {
            const itemPoints = this.getItemPoints();

            if (itemPoints && itemPoints[cellId] !== undefined) {
                const colshapeId = itemPoints[cellId];
                const colshape = mp.colshapes.at(colshapeId);

                if (!mp.colshapes.exists(colshape)) {
                    returnInformation.result = false;
                    returnInformation.info.text = 'Не существует ячейки с ИД = ' + cellId;
                    return returnInformation;
                }

                Colshape.addItem(colshape, [EItem.createItem(item.key, amount, {...item.data})]);
                returnInformation.result = true;
                returnInformation.info.text = 'Вы положили предмет в колшип с ИД = ' + colshape.id!;
                return returnInformation;
            }

            returnInformation.result = false;
            returnInformation.info.text = 'Такой точки ' +cellId+ ' с лутом здесь нет!';
            return returnInformation;
        } else { // Если не указана - создать новый КОЛШИП С ПРЕДМЕТАМИ.
            // Создает предмет на координатах его выброса.
            const createItemParams: CreateItemParams = {
                colshapePosition: pos,
                objectPosition: pos,
                labelPosition: pos,
                range: 3, 
                labelText: LootSpawn.DROPPED, 
                objectHash: 'bkr_prop_duffel_bag_01a',
            };

            const loot = new Loot();

            const createdItem = EItem.createItem(item.key, amount, item.data);
            loot.createLootPoint([createdItem], createItemParams);

            returnInformation.result = true;
            returnInformation.info.text = 'Вы выбросили ' +amount+ 'шт. '+item.key;
        }

        return returnInformation;
    }

}       