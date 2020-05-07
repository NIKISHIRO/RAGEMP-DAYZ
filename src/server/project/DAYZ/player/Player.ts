import { Colshape } from "../loot/entities/Colshape";
import { Label } from "../loot/entities/Label";
import { EObject } from "../loot/entities/Object";
import { Loot } from "../loot/Loot";
import { ReturnInformation, LootShapeInfo } from "../interfaces";
import { Blip } from "../loot/entities/Blip";
import { EItem } from "../loot/Item/Item";
import { SPAWNS } from '../playerSpawns';
import { Item, PlayerData, CharacterFace, CharacterClientData } from "../types";
import { CallRPC } from "../CallRPC";
import { DisplayUI } from "../events/rpcRegister";
import { postgres } from "../db";

type ServerResult = {
    result: boolean;
    text: string;
};

export type CharacterPlayerData = {
    gender: 'male' | 'female';
    face: CharacterFace[];
    headblend: any[];
    clothes: number[];
    eyescolor: number;
    headoverlay: number[];
    haircolor: number;
};

export class Player {
    private player: PlayerMp;
    private callRpc: CallRPC;

    constructor(player: PlayerMp) {
        this.player = player;
        this.callRpc = new CallRPC(player);
    }

    public init() {
        this.player.setVariable('isAuth', false);
        this.player.setVariable('admin', 0);
        this.player.setVariable('itemPoints', []); // itemPoints - массив ИД-ов колшипов.
        this.setInventorySlots(10); // Устанавливает макс. кол-во слотов игроку.
        this.player.setVariable('displayUI', { // Отображение частей в CEF.
            huds: false,
        });

        // Дефолтная одежда.
        const male: number[] = [
            0, // masks
            0, // hair
            15, // torsos
            21, // legs
            0, // bags
            5, // shoes
            0, // accessories
            15, // Undershirts 
            0, // body armor
            0, // decals
            15, // tops
        ];
        const female: number[] = [
            0, // masks
            0, // hair
            15, // torsos
            16, // legs
            0, // bags
            5, // shoes
            0, // accessories
            7, // Undershirts 
            0, // body armor
            0, // decals
            101, // tops
        ];
        
        this.player.setVariable('clothes', {male, female});
    }

    // Устанавливает слоты и отправляет в CEF.
    public setInventorySlots(slots: number) {
        this.player.setVariable('invMaxWeight', slots); // Макс. вес для предметов игрока.
        this.callRpc.cefSetInventoryWeight(slots);
    }

    public addInventorySlots(slots: number) {
        let invMaxWeight = this.player.getVariable('invMaxWeight'); // Макс. вес для предметов игрока.
        invMaxWeight += slots;
        console.log('invMaxWeight',invMaxWeight);
        this.player.setVariable('invMaxWeight', invMaxWeight);
        this.callRpc.cefSetInventoryWeight(invMaxWeight);
    }

    public removeInventorySlots(slots: number) {
        let invMaxWeight = this.player.getVariable('invMaxWeight'); // Макс. вес для предметов игрока.
        invMaxWeight -= slots;
        this.player.setVariable('invMaxWeight', invMaxWeight);
        this.callRpc.cefSetInventoryWeight(invMaxWeight);
    }

    public getClothes(): number[] {
        return [
            this.player.getClothes(0)[0],
            this.player.getClothes(1)[0],
            this.player.getClothes(2)[0],
            this.player.getClothes(3)[0],
            this.player.getClothes(4)[0],
            this.player.getClothes(5)[0],
            this.player.getClothes(6)[0],
            this.player.getClothes(7)[0],
            this.player.getClothes(8)[0],
            this.player.getClothes(9)[0],
            this.player.getClothes(10)[0],
        ];
    }

    // Инициал. всех переменных игрока.
    public async registerInit() {
        this.init();
        this.player.health = 100;
        this.player.armour = 0;
        this.player.setVariable('isAuth', true);

        await this.callRpc.clientAfterLoginInit();
        // Спавнит игрока на рандом.коорд.
        this.spawnRandomCoords();
    }

    // Инициал. св-в после авторизации.
    public async loginInit(data: PlayerData) {
        let { position: pos, login, health, armor, inventory, admin, hunger, dehydration, face, headblend, gender, clothes, eyescolor, headoverlay, haircolor } = data;

        if (!health) {
            health = 100;
        }
        if (!armor) {
            armor = 0;
        }
        if (!hunger) {
            hunger = 100;
        }
        if (!dehydration) {
            dehydration = 100;
        }

        let position = new mp.Vector3(111, 111, 111);
        if (pos) {
            position = new mp.Vector3(pos.x, pos.y, pos.z)
        }

        this.init();
        this.player.name = login;
        this.player.position = position;
        this.player.health = health;
        this.player.armour = armor;
        this.player.setInventory(inventory);
        this.player.setVariable('isAuth', true);
        this.player.setVariable('admin', admin);
        this.player.setVariable('hunger', hunger);
        this.player.setVariable('dehydration', dehydration);

        await this.callRpc.clientAfterLoginInit();
        // Отправляет на клиент инфу что игрок аутентифицирован.
        await this.characterInit({ face, headblend, gender, clothes, eyescolor, headoverlay, haircolor });
    }

    // ИНИЦИАЛИЗАЦИЯ ВНЕШНОСТИ ПЕРСОНАЖА. ПРИ ОШИБКЕ УСТАНАВЛИВАЕТ ДЕФОЛТ.
    public async characterInit(data: CharacterPlayerData) {
        console.log('characterInit -> ', data);
        let { face, headblend, gender, clothes, eyescolor, headoverlay, haircolor } = data;

        if (face === null || 
            headblend === null || 
            clothes === null || 
            gender === null || 
            headoverlay === null || 
            eyescolor === null ||
            haircolor === null) {
            console.log(`[${this.player.name}]:[characterInit]: Ошибка установления внешности.`.red);
            this.player.outputChatBox('!{ff0000}Ошибка установления кастомизации. Сообщите пожалуйста администрации');
            return;
        }

        const model = gender === 'male' ? mp.joaat('mp_m_freemode_01') : mp.joaat("mp_f_freemode_01");
        // Установка модели.
        this.player.model = model;
        // Установка цвета глаз.
        this.player.eyeColor = eyescolor;
        // Установка цвета волос.
        this.player.setHairColor(haircolor, 0);

        // Установка лица перса.
        data.face.forEach(i => {
            this.player.setFaceFeature(i.index, i.feature);
        });

        // Установка парам. головы.
        this.player.setHeadBlend(
            headblend[0],
            headblend[1],
            headblend[2],
            headblend[3],
            headblend[4],
            headblend[5],
            headblend[6],
            headblend[7],
            headblend[8],
        );

        headoverlay.forEach((index, overlayId) => {
            if (index === 0) index = 255;
            this.player.setHeadOverlay(overlayId, [index, 100, 0, 0]);
        });

        // Установка одежды.
        this.player.changeClothes(1, clothes[0], 0, true);
        this.player.changeClothes(2, clothes[1], 0, true);
        this.player.changeClothes(3, clothes[2], 0, true);
        this.player.changeClothes(4, clothes[3], 0, true);
        this.player.changeClothes(5, clothes[4], 0, true);
        this.player.changeClothes(6, clothes[5], 0, true);
        this.player.changeClothes(7, clothes[6], 0, true);
        this.player.changeClothes(8, clothes[7], 0, true);
        this.player.changeClothes(9, clothes[8], 0, true);
        this.player.changeClothes(10, clothes[9], 0, true);
        this.player.changeClothes(11, clothes[10], 0, true);
    }

    public async logout() {
        const hunger = await this.callRpc.clientGetAnyProp('hunger');
        const dehydration = await this.callRpc.clientGetAnyProp('dehydration');

        await postgres<PlayerData>('players')
            .where({
                login: this.player.name,
            })
            .update({
                health: parseInt(String(this.player.health)),
                armor: parseInt(String(this.player.armour)),
                inventory: this.player.getInventory(),
                position: this.player.position,
                hunger: hunger || 1,
                dehydration: dehydration || 1,
                clothes: this.getClothes(),
            });
    }

    // Нужен для отображения каких-либо частей в верстке (НАПРИМЕР HUDS).
    public setDisplayUI(name: string, bool: boolean) {
        const displayUI: DisplayUI = this.player.getVariable('displayUI');

        if (displayUI.hasOwnProperty(name)) {
            displayUI[name] = bool;
            this.player.setVariable('displayUI', displayUI);
            this.callRpc.setDisplayUI(displayUI);
        } else {
            mp.players.broadcast(`setDisplayUI: ${name} - нет такого интерфейса!`);
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
                
                if (!itemList.length) {
                    plr.removeItemPoint(findShape.id);
                }

                const items = plr.getItemsPlayerAround();
                this.callRpc.cefSetGroundItems(items);
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
        loot.createLootPoints([createdItem]);

        return { result: true, text: `Вы выбросили ${item.data.name} - ${amount}` };
    }
}