import { logger } from "../shared/logger";
import { Colshape } from "../loot/entities/Colshape";
import { Label } from "../loot/entities/Label";
import { EObject } from "../loot/entities/Object";
import { Loot } from "../loot/Loot";
import { ReturnInformation, LootShapeInfo } from "../interfaces";
import { Blip } from "../loot/entities/Blip";
import { EItem } from "../loot/Item/Item";
import {SPAWNS} from '../playerSpawns';
import { Item } from "../types";
import { CEF } from "../CEF";
import { DisplayUI } from "../events/rpcRegister";

type ServerResult = {
    result: boolean;
    text: string;
}

export class Player {
    public player: PlayerMp;

    constructor(player: PlayerMp) {
        this.player = player;
    }

    public variablesInit() {
        this.player.setVariable('itemPoints', []); // itemPoints - массив ИД-ов колшипов.
        this.player.setVariable('invMaxWeight', 12); // Макс. вес для предметов игрока.
        this.player.setVariable('displayUI', {
            huds: true,
        });
    }

    // Нужен для отображения или убирания каких то кнкретных частей в верстке (НАПРИМЕР HUDS).
    public setDisplayUI(name: string, bool: boolean) {
        const cef = new CEF(this.player);
        const displayUI: DisplayUI = this.player.getVariable('displayUI');
        if (displayUI.hasOwnProperty(name)) {
            displayUI[name] = bool;
            this.player.setVariable('displayUI', displayUI);
            cef.setDisplayUI(displayUI);
        } else {
            console.log(`setDisplayUI: ${name} - нет такого интерфейса!`);
        }
    }

    // Получить вес массива предметов предметов в инвентаре.
    public getItemsWeight(items: Item[]) {
        return items.reduce((acc, item) => acc + (item.amount * item.data.weight), 0);
    }

    // Использование предмета в инвентаре по shortid.
    public useItemByServerId(serverId: string): ServerResult {
        const inventory = [...this.player.getInventory()];
        const idx = inventory.findIndex(i => i.data.serverId === serverId);
        
        // console.log('inventory', inventory);
        console.log('useItemByServerId', serverId, idx);
        
        if (idx !== -1) {
            const result = this.player.useItem(idx);

            if (result) {
                return { result: true, text: 'Вы использовали предмет ' + inventory[idx].data.name };
            }
            
            return { result: false, text: 'Ошибка использования предмета' };
        } else {
            return { result: false, text: 'Такого предмета нет' };
        }
    }

    // С CEF приходит shortid. По shortid найти предмет.
    public takeItemByServerId(serverId: string, amount: number): ServerResult {
        const colshapes = this.getColshapesObjectsGround();

        // Поиск предмета и колшип, который пытается взять игрок.
        let findItem;
        let findShape;
        colshapes.forEach(shape => {
            const itemList: Item[] = shape.getVariable('itemList');
            itemList.forEach(item => {
                if (item.data.serverId === serverId && item.amount === amount) {
                    findItem = item;
                    findShape = shape;
                }
            });
        });
        
        console.log('---> findItem', findItem);
        console.log('---> findShape', findShape);

        if (findItem !== undefined && findShape !== undefined) {
            const playersIdsOnColshape: number[] = findShape.getVariable('playersIdsOnColshape');
            const itemList = findShape.getVariable('itemList');

            const idx = itemList.findIndex(item => item.data.serverId === findItem.data.serverId);

            // Если в предметах колшипа не был найден предмет с данные serverId.
            if (idx === -1) {
                return { result: false, text: 'Такого предмета здесь нету.' };
            }

            const newItem = {...findItem};
            const invMaxWeight: number = this.player.getVariable('invMaxWeight');
            const plrInventory = [...this.player.getInventory()];
            plrInventory.push({...newItem});
            // Вес инвентаря с новым предметом.
            const weightWithItem = this.getItemsWeight(plrInventory);

            if (weightWithItem > invMaxWeight) {
                return { result: false, text: 'Не хватает места в инвентаре.' };
            }

            if (newItem.amount > amount) {
                newItem.amount -= amount;
                itemList.splice(idx, 1, newItem);
            } 
            else if (newItem.amount <= amount) {
                itemList.splice(idx, 1);
            }

            // Перезаписать предмет в колшипе с которого он берется.
            findShape.setVariable('itemList', itemList);

            // Перерисовать UI-Ground.
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
            
            const createdItem = EItem.createItem(newItem.key, newItem.amount, newItem.data);
            this.player.outputChatBox(`K: ${createdItem.key}, A: ${amount}`);
            
            if (!this.player.giveItem(createdItem.key, amount, createdItem.data)) {
                return { result: false, text: `Код ошибки #001` };
            }

            return { result: true, text: `${createdItem.data.name} + ${amount}` };
        }

        return { result: false, text: 'Такого предмета здесь нет.' };
    }

    public removeAllLootShapeEntity(colshape: ColshapeMp) {
        const lootShapeInfo: LootShapeInfo = colshape.getVariable('lootShapeInfo');
        const instColshape = new Colshape(colshape);

        if (instColshape.destroy()) {
            const labelId = lootShapeInfo.labelId;
            const objId = lootShapeInfo.objectId;
            const blipId = lootShapeInfo.blipId;

            // Удалить label.
            Label.destroy(labelId) && console.log(`[Label] с ID = ${labelId} удален.`);

            // Удалить объект.
            EObject.destroy(objId) && console.log(`[EObject] с ID = ${objId} удален.`);
            
            // Удалить блип.
            Blip.destroy(blipId) && console.log(`[Blip] с ID = ${blipId} удален.`);
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

    public spawnRandomCoords() {
        // Массив координат спавна игрока.
        // Получение рандом. числа для индекса массива с коордами.
        const min: number = 0;
        const max: number = SPAWNS.length - 1;
        const randomNumber: number = Math.floor(min + Math.random() * (max + 1 - min));
        // рандомная коорината.
        const coordSpawn: number[] = SPAWNS[randomNumber];
        this.player.spawn(new mp.Vector3(coordSpawn[0], coordSpawn[1], coordSpawn[2]));
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

    // Из itemPoints берет itemList из колшипа под индексом = cellId 
    // и берет из массива itemList предмет под индексом itemId
    public takeColshapeItem(cellId: number, itemId: number, amount: number): ReturnInformation {
        const item = this.getItem(cellId, itemId);

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
            const instColshape = new Colshape(colshape);
            
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
                    if (instColshape.destroy()) {
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

    public dropItem(itemKey: string, amount: number): ServerResult {
        const inventory = this.player.getInventory();
        const pos = this.player.position;

        const item = inventory.find(item => item.key === itemKey);

        if (!this.player.hasItem(itemKey) || item === undefined) {
            return { result: false, text: `У вас нет в инвентаре этого предмета.` };
        }

        // Если кол-во предметов в инвентаре меньше, чем указал игрок - return.
        if (this.player.getItemAmount(itemKey) < amount) {
            return { result: false, text: 'В вашем инвентаре нет столько предметов.' };
        }

        // Минус 'amount' предметов.
        if(!this.player.removeItem(this.player.getItemIndex(itemKey), amount)) {
            return { result: false, text: 'Не получилось выбросить предмет. Попробуйте еще раз.' };
        }

        // Создает предмет на координатах его выброса.
        const colshape = Loot.createColshape(pos);
        const object = Loot.createObject(pos);
        const label = Loot.createLabel(pos);
        const blip = Loot.createBlip(pos);
        const loot = new Loot(colshape, object, label, blip);

        const createdItem = EItem.createItem(item.key, amount, item.data);
        loot.createLootPoint([createdItem]);

        return { result: true, text: `Вы выбросили ${item.data.name} - ${amount}` };
    }

    // public dropItem(itemKey: string, amount: number): ServerResult {
    //     const inventory = this.player.getInventory();
    //     const pos = this.player.position;

    //     const item = inventory.find(item => item.key === itemKey);

    //     if (!this.player.hasItem(itemKey) || item === undefined) {
    //         return { result: false, text: `У вас нет в инвентаре этого предмета.` };
    //     }

    //     // Если кол-во предметов в инвентаре меньше, чем указал игрок - return.
    //     if (this.player.getItemAmount(itemKey) < amount) {
    //         return { result: false, text: 'В вашем инвентаре нет столько предметов.' };
    //     }

    //     // Минус 'amount' предметов.
    //     if(!this.player.removeItem(this.player.getItemIndex(itemKey), amount)) {
    //         return { result: false, text: 'Не получилось выбросить предмет. Попробуйте еще раз.' };
    //     }

    //     // Создает предмет на координатах его выброса.
    //     const colshape = Loot.createColshape(pos);
    //     const object = Loot.createObject(pos);
    //     const label = Loot.createLabel(pos);
    //     const blip = Loot.createBlip(pos);
    //     const loot = new Loot(colshape, object, label, blip);

    //     const createdItem = EItem.createItem(item.key, amount, item.data);
    //     loot.createLootPoint([createdItem]);

    //     return { result: true, text: `Вы выбросили ${item.data.name} - ${amount}` };
    // }
}