
import { logger } from "../shared/logger";
import { Colshape } from "../loot/entities/Colshape";
import { Label } from "../loot/entities/Label";
import { EObject } from "../loot/entities/Object";
import { Loot } from "../loot/Loot/Loot";
import { ReturnInformation, LootShapeInfo, CreateItemParams, LootSpawn } from "../interfaces";
import { Blip } from "../loot/entities/Blip";
import { EItem } from "../loot/Item/Item";

/*
    itemPoints - Массив идов колшипов.
    addItemPoint(player, shapeId) - Добавляет новый ид колшипа в itemPoints.
    removeItemPoint(player, shapeId) - Удаляет ид колшипа из itemPoints.
    setItemPoints(player, shapeIds) - присваивает игроку itemPoints.
    getLootShapes(player) - От каждого ИДА в itemPoints получает объект и возвращает массив объектов колшипов.
    getItemListByIndex(player, id) - по ИД из массива itemPoints возвращает колшипа itemList, либо FALSE.

    getItem(player, cellId, itemId) - Комментарий перед методом функции.
    takeColshapeItem(player, cellId, itemId) - Комментарий перед методом функции.
*/

export class Player {
    static getItemPoints(player): number[] {
        return player.getVariable('itemPoints');
    }

    // Добавляет ИД колшипа в itemPoints.
    static addItemPoint(player: PlayerMp, shapeId: number) {
        const itemPoints = player.getVariable('itemPoints');
        itemPoints.push(shapeId);
        player.setVariable('itemPoints', itemPoints);
    }

    static removeItemPoint(player: PlayerMp, shapeId: number) {
        const itemPoints = Player.getItemPoints(player);
        const idx = itemPoints.findIndex(idx => shapeId === idx);

        if (idx === -1) return;

        itemPoints.splice(idx, 1);
        player.setVariable('itemPoints', itemPoints);
    }

    // Устанавливает массив ИДОВ колшипов.
    static setItemPoints(player: PlayerMp, shapeIds: number[]) {
        player.setVariable('itemPoints', shapeIds);
    }

    // Возвращает массив колшипов вокруг игрока.
    static getLootShapes(player): ColshapeMp[] {
        const itemPoints: number[] = Player.getItemPoints(player);
        return itemPoints.map(shapeId => mp.colshapes.at(shapeId));
    }

    // return: Item[] || FALSE. Получает itemList колшипа по ИД в массиве "доступных точек"(itemPoints) игрока.
    static getItemListByIndex(player: PlayerMp, id: number) {
        if (isNaN(id) || !Number.isInteger(id)) return false;

        const colshapes: ColshapeMp[] = Player.getLootShapes(player);

        if (!colshapes[id]) {
            return false;
        }
        
        const itemList: Item[] = colshapes[id].getVariable('itemList');
        return itemList;
    }

    // cellId - Индекс элемента в массиве itemPoints игрока для получения колшипа.
    // itemId - Индекс предмета в массиве itemList полученного колшипа.
    static getItem(player: PlayerMp, cellId: number, itemId: number): any {
        const itemList = Player.getItemListByIndex(player, cellId);

        if (!itemList) return false;

        const item: Item = itemList[itemId];
        return item;
    }

    static takeVehicleItem() {
        // пример в takeColshapeItem.
    }

    // Из itemPoints берет itemList из колшипа под индексом = cellId 
    // и берет из массива itemList предмет под индексом itemId
    static takeColshapeItem(player: PlayerMp, cellId: number, itemId: number, amount: number): ReturnInformation {
        const returnInformation = {
            info: {
                text: '!{#DA3060}Ввелите корректное, целое число!',
                data: {
                    takenItem: {}
                }
            },
            result: false
        };

        // Если хоть 1 число приходит не в нужном виде - return;
        if (!Number.isInteger(cellId) || !Number.isInteger(itemId) || !Number.isInteger(amount)) {
            return returnInformation;
        }
        
        const item = Player.getItem(player, cellId, itemId);
        
        if (item) {
            const colshapes: ColshapeMp[] = Player.getLootShapes(player);
            const colshape: ColshapeMp = colshapes[cellId];
            const colshapeId: number = colshape.id;
            const lootShapeInfo: LootShapeInfo = colshape.getVariable('lootShapeInfo');

            const itemPoints: number[] = Player.getItemPoints(player);
            const itemListOrFalse = Player.getItemListByIndex(player, cellId);

            // Проверка - находится ли игрок в пределах колшипа.
            if (!colshape.isPointWithin(player.position)) {
                returnInformation.info.text = '!{#DA3060}Поблизости нет точки с лутом';
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
                        returnInformation.info.text = `${amount}шт. ${item.key} нет в этой точке.`;
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
                    
                    returnInformation.info.text = `Предмет был удален из этой точки. Осталось всего: ${itemList.length} предметов.`;
                    returnInformation.result = true;
                }
                // Если массив пуст, то удалить сам колшип.
                if (itemListOrFalse && !itemListOrFalse.length) {
                    player.setVariable('itemPoints', itemPoints);

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

                    // Если получилось уничтожить colshape, 
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

                if (player.giveItem(item.key, amount, item.data)) {
                    returnInformation.info.data.takenItem = EItem.createItem(item.key, amount, item.data);
                    returnInformation.info.text = `!{#97CC24}Вы подобрали ${amount}шт. '${item.key}'`;
                    returnInformation.result = true;
                } else {
                    returnInformation.info.text = `!{#DA3060}ОШИБКА ВЗЯТИЯ ПРЕДМЕТА. '${item.key}' не зарегистрирован (он был удален)!`;
                    returnInformation.result = false;
                } 
            }
        } else { // Если item = false.
            returnInformation.info.text = '!{#DA3060}Такого предмета или точки здесь нет!';
            returnInformation.result = false;
            return returnInformation;
        }

        return returnInformation;
    }

    // Выкидывает предмет из инвентаря.
    static dropItem(player: PlayerMp, itemIdx: number, amount: number, cellId?: number): ReturnInformation {
        const inventory = player.getInventory();
        const pos = player.position;

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
            returnInformation.info.text = `У вас нет в инвентаре предмета с индексом '${itemIdx}'`;
            return returnInformation;
        }

        const item: Item = inventory[itemIdx];

        // Если кол-во предметов в инвентаре меньше, чем указал игрок - return.
        if (player.getItemAmount(item.key) < amount) {
            returnInformation.info.text = `В вашем инвентаре нет ${amount}шт. '${item.key}'.`;
            return returnInformation;
        }

        // Минус 'amount' предметов.
        if(!player.removeItem(itemIdx, amount)) {
            returnInformation.result = false;
            returnInformation.info.text = `Ошибка удаления предмета из инвентаря.`;
            return returnInformation;
        }

        // Если указана ячейка (индекс колшипа) и он целое число.
        if (cellId !== undefined && Number.isInteger(cellId)) {
            const itemPoints = Player.getItemPoints(player);

            if (itemPoints && itemPoints[cellId] !== undefined) {
                const colshapeId = itemPoints[cellId];
                const colshape = mp.colshapes.at(colshapeId);

                
                if (!mp.colshapes.exists(colshape)) {
                    returnInformation.result = false;
                    returnInformation.info.text = `Не существует ячейки с ИД = ${cellId} `;
                    return returnInformation;
                }

                Colshape.addItem(colshape, [EItem.createItem(item.key, amount)]);
                returnInformation.result = true;
                returnInformation.info.text = `Вы положили предмет в колшип с ИД = ${colshape.id}!`;
                return returnInformation;
            }

            returnInformation.result = false;
            returnInformation.info.text = `Такой точки(${cellId}) с лутом здесь нет!`;
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

            console.log('createItemParams', createItemParams);

            loot.createLootPoint([EItem.createItem(item.key, amount)], createItemParams);
    
            returnInformation.result = true;
            returnInformation.info.text = `Вы выбросили ${amount}шт. '${item.key}'`;
        }

        return returnInformation;
    }

    // Отправить на клиент информацию о взятом предмете.
    static toClientTakeItemInfo(player: PlayerMp, item: Item) {
        player.call('c_add_inventory_item', [JSON.stringify(item)]);
    }

    // Отправить на клиент кол-во слотов для установ. их в UI инвентарь.
    static toClientSetInventorySlots(player: PlayerMp, count: number) {
        if (!Number.isInteger(count)) {
            throw new Error('toClientSetInventorySlots -> count должно быть целым числом.');
        }
        
        player.call('c_set_inventory_slots', [count]);
    }

}       