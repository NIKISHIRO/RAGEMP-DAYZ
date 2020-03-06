
import { logger } from "../shared/logger";
import { Loot, LootShapeInfo } from "../loot/Loot";
import { Colshape } from "../loot/Colshape";
import { ReturnInformation } from "project/interfaces";
import { Label } from "../loot/Label";

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

        console.log('removeitempoint -> idx', idx);

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
            info: '!{#DA3060}Число должно быть целое!',
            result: false
        };

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
                returnInformation.info = '!{#DA3060}Поблизости нет точки с лутом';
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
                        returnInformation.info = `${amount}шт. ${item.key} нет в этой точке.`;
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
                    
                    returnInformation.info = `Предмет был удален из этой точки. Осталось всего: ${itemList.length} предметов.`;
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

                        // Если label с таким ИД на серваке нету - вывести в консоль об этом.
                        if (!mp.labels.exists(labelId)) {
                            logger('red', 'Player', 'takeItem', 'mp.labels.exists', 'Такого Label не существует.');
                        } else { // ИНАЧЕ - удалить его.
                            Label.destroy(labelId);
                        }

                        returnInformation.info = `Эта точка была удалена.`;
                        returnInformation.result = true;

                        logger('green', 'colshape', colshapeId.toString(), 'Удален.');
                    }
                }

                if (player.giveItem(item.key, amount, item.data)) {
                    returnInformation.info = `!{#97CC24}Вы подобрали ${amount}шт. '${item.key}'`;
                    returnInformation.result = true;
                } else {
                    returnInformation.info = `!{#DA3060}ОШИБКА ВЗЯТИЯ ПРЕДМЕТА. '${item.key}' не зарегистрирован!`;
                    returnInformation.result = false;
                } 
            }
        } else { // Если item = false.
            returnInformation.info = '!{#DA3060}Такого предмета или точки здесь нет!';
            returnInformation.result = false;
            return returnInformation;
        }

        return returnInformation;
    }

    // Выкидывает предмет из инвентаря.
    static dropItem(player: PlayerMp, itemIdx: number, amount: number): ReturnInformation {
        const inventory = player.getInventory();

        const returnInformation: ReturnInformation = {
            result: false,
            info: 'Введите корректные целые числа' 
        };

        // Если пришло не число или не целое число, то return.
        if (isNaN(itemIdx) || isNaN(amount) || !Number.isInteger(itemIdx) || !Number.isInteger(amount)) {
            logger('red', 'dropItem', 'itemIdx', String(itemIdx), ', amount', String(amount));
            return returnInformation;
        }
        
        // Если инвентарь не имеет предмета под данным индексом - return.
        if (!inventory[itemIdx]) {
            returnInformation.info = `У вас нет в инвентаре предмета с индексом '${itemIdx}'`;
            return returnInformation;
        }

        const item: Item = inventory[itemIdx];

        // Если кол-во предметов в инвентаре меньше, чем указал игрок - return.
        if (player.getItemAmount(item.key) < amount) {
            returnInformation.info = `В вашем инвентаре нет ${amount}шт. '${item.key}'.`;
            return returnInformation;
        }

        // Минус 'amount' предметов.
        player.removeItem(itemIdx, amount);
        
        returnInformation.result = true;
        returnInformation.info = `Вы выбросили ${amount}шт. '${item.key}'`;

        return returnInformation;
    }

    // Положить определнный предмет в каком то кол-ве
    static putItemCar(player:PlayerMp ,vehicle:VehicleMp, index: number, amount:number): ReturnInformation{
        const returnInformation: ReturnInformation = {
            info: '!{#DA3060} должно быть число',
            result: false
        };
        const carInventory = vehicle.getVariable('carInventory');
        const playerInventory: Item[] = player.getInventory();

        if(!Number.isInteger(index) || !Number.isInteger(amount)){
            return returnInformation;
        }

        if(!mp.vehicles.exists(vehicle)){
            returnInformation.info = `Рядом нет машины`;
            return returnInformation;
        }

        if(!playerInventory || !playerInventory[index]){
            returnInformation.info = 'У вас нет такого предмета в инвентаре';
            return returnInformation
        }

        if(amount <= 0){
            returnInformation.info = `Введите коректное число`;
            return returnInformation;
        }

        if(playerInventory[index].amount < amount){
            returnInformation.info = 'Такого количества предметов нет';
            return returnInformation
        }

        const carItem = {...playerInventory[index]}
        player.removeItem(index, amount);
        
        carItem.amount = amount;
        carInventory.push(carItem);
        vehicle.setVariable('carInventory', carInventory);

        returnInformation.info = `Вы успешно положили в машину ${amount}`;
        returnInformation.result = true
        return returnInformation
    }

    // Взять определенный предмет в каком то количестве
    static takeItemCar(player:PlayerMp, vehicle:VehicleMp, index: number, amount:number): ReturnInformation {
        const returnInformation: ReturnInformation  = {
            info: '!{#DA3060} должно быть число',
            result: false
        };
        const carInventory = vehicle.getVariable('carInventory');
        const playerInventory: Item[] = player.getInventory();

        if(!Number.isInteger(index) || !Number.isInteger(amount)){
            return returnInformation;
        }

        if(!mp.vehicles.exists(vehicle)){
            returnInformation.info = `Рядом нет машины`;
            return returnInformation;
        }

        if(!carInventory || !carInventory[index]){
            returnInformation.info = `У вас нет такого предмета в инвентаре`;
            return returnInformation;
        }

        if(amount <= 0){
            returnInformation.info = `Введите коректное число`;
            return returnInformation;
        }

        if(carInventory[index].amount < amount){
            returnInformation.info = 'Такого количества предметов нет';
            return returnInformation
        }else if(carInventory[index].amount == amount){
            returnInformation.info = 'Вы успешно взяли предмет в полном кол-ве';
            returnInformation.result = true;

            const playerItem = {...carInventory[index]}
            playerItem.amount = amount
            playerInventory.push(playerItem);

            carInventory.splice(carInventory[index], 1);
            vehicle.setVariable('carInventory', carInventory);
            return returnInformation
        }
        returnInformation.info = `Вы успешно взяли ${amount}`;
        returnInformation.result = true

        const playerItem = {...carInventory[index]}
        playerItem.amount = amount
        playerInventory.push(playerItem);
        
        player.setInventory(playerInventory);
        carInventory[index].amount -= amount;
        vehicle.setVariable('carInventory', carInventory);
        return returnInformation
    }
}