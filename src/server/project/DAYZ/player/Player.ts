import { logger } from "../shared/logger";
import { Colshape } from "../loot/entities/Colshape";
import { Label } from "../loot/entities/Label";
import { EObject } from "../loot/entities/Object";
import { Loot } from "../loot/Loot";
import { ReturnInformation, LootShapeInfo, CarReturnInformation } from "../interfaces";
import { Blip } from "../loot/entities/Blip";
import { EItem } from "../loot/Item/Item";
import { SPAWNS } from '../playerSpawns';
import { Item, PlayerData, CharacterFace } from "../types";
import { CEF, CharacterClientData } from "../CEF";
import { DisplayUI } from "../events/rpcRegister";
import { postgres } from "../db";
import bcrypt from 'bcryptjs';

type ServerResult = {
    result: boolean;
    text: string;
};

export type CharacterPlayerData = {
    gender: 'male' | 'female';
    face: CharacterFace[];
    headArray: any[];
    clothes: number[];
};

export class Player {
    public player: PlayerMp;

    constructor(player: PlayerMp) {
        this.player = player;
    }

    public init() {
        this.player.setVariable('isAuth', false);
        this.player.setVariable('admin', 0);
        this.player.setVariable('itemPoints', []); // itemPoints - массив ИД-ов колшипов.
        this.player.setVariable('invMaxWeight', 10); // Макс. вес для предметов игрока.
        this.player.setVariable('displayUI', { // Отображение частей в CEF.
            huds: false,
        });

        // Дефолтная одежда.
        const male: number[] = [
            0, // masks
            0, // hair
            0, // torsos
            14, // legs
            0, // bags
            5, // shoes
            0, // accessories
            0, // Undershirts 
            0, // body armor
            0, // decals
            44, // tops
        ];
        const female: number[] = [
            0, // masks
            0, // hair
            15, // torsos
            56, // legs
            0, // bags
            16, // shoes
            0, // accessories
            0, // Undershirts 
            0, // body armor
            0, // decals
            0, // tops
        ];
        
        this.player.setVariable('clothes', {male, female});        
    }

    // Инициал. всех переменных игрока.
    public async registerInit() {
        this.init();
        this.player.health = 100;
        this.player.armour = 0;
        this.player.setVariable('isAuth', true);

        // Спавнит игрока на рандом.коорд.
        this.spawnRandomCoords();
    }

    // Инициал. св-в после авторизации.
    public async authInit(data: PlayerData) {
        const cef = new CEF(this.player);
        let { position: pos, login, health, armor, inventory, admin, hunger, dehydration, face, headblend, gender, clothes } = data;

        if (!face || !headblend || !gender || !clothes) {
            console.log(`[${this.player.name}]:[authInit - face, headblend, gender, clothes]: один из этих параметров null!`.red);
            this.player.outputChatBox('!{ff0000}Ошибка установлении кастомизации.');
        }

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

        // Отправляет на клиент инфу что игрок аутентифицирован.
        cef.clientAfterAuthInit();

        await this.characterInit({ face, headArray: headblend, gender, clothes });
    }

    // ИНИЦИАЛИЗАЦИЯ ВНЕШНОСТИ ПЕРСОНАЖА.
    public async characterInit(data: CharacterPlayerData) {
        console.log('characterInit -> ', data);
        
        const { clothes, headArray, gender } = data;
        const model = gender === 'male' ? mp.joaat('mp_m_freemode_01') : mp.joaat("mp_f_freemode_01");

        // Установка модели.
        this.player.model = model;

        // Установка лица перса.
        data.face.forEach(i => {
            this.player.setFaceFeature(i.index, i.feature);
        });

        // Установка парам. головы.
        this.player.setHeadBlend(
            headArray[0],
            headArray[1],
            headArray[2],
            headArray[3],
            headArray[4],
            headArray[5],
            headArray[6],
            headArray[7],
            headArray[8],
        );

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
        await postgres<PlayerData>('players')
            .where({
                login: this.player.name,
            })
            .update({
                health: parseInt(String(this.player.health)),
                armor: parseInt(String(this.player.armour)),
                admin: this.player.getVariable('admin'),
                inventory: this.player.getInventory(),
                position: this.player.position,
                hunger: 3,
                dehydration: 2,
            });
    }
    // Регистрация игрока в бд.
    public async register(login: string, email: string, password: string) {
        const cef = new CEF(this.player);
        const loginRegular = /^[a-z0-9_-]{3,16}$/;
        const passwordRegular = /[0-9a-zA-Z!@#$%^&*]{6,30}/;
        const emailRegular = /.+@.+\..+/i;

        if (!loginRegular.test(login)) {
            return this.player.outputChatBox('!{#ff0000}Логин должен быть от 3 до 16 символов. Латинские буквы, цифры.');
        }

        if (!emailRegular.test(email)) {
            return this.player.outputChatBox('Не корректное мыло.')
        }

        if (!passwordRegular.test(password)) {
            return this.player.outputChatBox('!{ff0000}Пароль должен содержать мин. 1 заглавную букву, цифру, специальный символ. Размер 6 до 30 символов.')
        }

        const findUser = await postgres<PlayerData>('players').select('*').where({login});

        if (findUser.length) {
            return this.player.outputChatBox('!{ff0000}Игрок с таким логином уже зарегистрирован!')
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return console.log(err);
            }

            // Получаем данные с клиента о кастомизации.
            const { hair, face, gender, headArray }: CharacterClientData = await cef.clientCharacterReady(); // Получает данные с клиента после кастомизации и регистрации.
            const clothes = this.player.getVariable('clothes')[gender]; // Берет данные скина по гендеру.
            
            // Установка волос с клиента.
            clothes[1] = hair;

            // Добавление пользователя в БД.
            await postgres<PlayerData>('players').insert({ 
                login: login,
                email: email,
                passwordHash: hash,
                face: face,
                gender: gender,
                headblend: headArray,
                clothes: clothes,
                inventory: [],
            });

            this.player.outputChatBox('!{00ff00}Вы успешно зарегистрировались!');
            
            // Установка персонажа после регистрации.
            const characterPlayerData: CharacterPlayerData = { gender, face, headArray, clothes };
            this.characterInit(characterPlayerData);
            
            // Инициал. св-в после регистра.
            this.registerInit();

            // Отправляет на клиент инфу что игрок аутентифицирован.
            cef.clientAfterAuthInit();
        });
    }

    // Авторизация игрока в бд.
    public async login(login: string, password: string) {
        const data = await postgres<PlayerData>('players').select('*').where({ login });

        console.log(data);

        if (!data.length) {
            return this.player.outputChatBox('!{#ff0000}Не верный логин/пароль!');
        }

        const plrData = data[0];
        const compareResult = await bcrypt.compare(password, plrData.passwordHash)
        
        if (compareResult) {
            this.player.outputChatBox(`!{#00ff00} Вы успешно авторизовались!`);
            this.authInit(plrData);
        } else {
            return this.player.outputChatBox('!{#ff0000}Не верный логин/пароль!');
        }
    }

    // Нужен для отображения каких-либо частей в верстке (НАПРИМЕР HUDS).
    public setDisplayUI(name: string, bool: boolean) {
        const cef = new CEF(this.player);
        const displayUI: DisplayUI = this.player.getVariable('displayUI');

        if (displayUI.hasOwnProperty(name)) {
            displayUI[name] = bool;
            this.player.setVariable('displayUI', displayUI);
            cef.setDisplayUI(displayUI);
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
        loot.createLootPoints([createdItem]);

        return { result: true, text: `Вы выбросили ${item.data.name} - ${amount}` };
    }

    // Положить определнный предмет в каком то кол-ве
    public putItemCar(vehicle:VehicleMp, index: number, amount:number): CarReturnInformation{
        const returnInformation: CarReturnInformation = {
            info: '!{#DA3060} должно быть число',
            result: false
        };
        const carInventory = vehicle.getVariable('carInventory');
        const playerInventory: Item[] = this.player.getInventory();

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
        this.player.removeItem(index, amount);
        
        carItem.amount = amount;
        carInventory.push(carItem);
        vehicle.setVariable('carInventory', carInventory);

        returnInformation.info = `Вы успешно положили в машину ${amount}`;
        returnInformation.result = true
        return returnInformation
    }

    // Взять определенный предмет в каком то количестве
    public takeItemCar( vehicle:VehicleMp, index: number, amount:number): CarReturnInformation {
        const returnInformation: CarReturnInformation  = {
            info: '!{#DA3060} должно быть число',
            result: false
        };
        const carInventory = vehicle.getVariable('carInventory');
        const playerInventory: Item[] = this.player.getInventory();

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
        
        this.player.setInventory(playerInventory);
        carInventory[index].amount -= amount;
        vehicle.setVariable('carInventory', carInventory);
        return returnInformation
    }
}