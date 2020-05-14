import { Label } from "../loot/entities/Label";
import { EObject } from "../loot/entities/Object";
import { Loot } from "../loot/Loot";
import { ReturnInformation, LootShapeInfo, CarReturnInformation } from "../interfaces";
import { Blip } from "../loot/entities/Blip";
import { EItem } from "../loot/Item/Item";
import { SPAWNS } from '../playerSpawns';
import { Item, PlayerData, CharacterFace } from "../types";
import { CallRPC } from "../CallRPC";
import { DisplayUI } from "../events/rpcRegister";
import { postgres } from "../db";
import { Character } from "../character/Character";

type ServerResult = {
    result: boolean;
    text: string;
};

export class Player {
    private player: PlayerMp;
    private callRpc: CallRPC;
    private character: Character;

    constructor(player: PlayerMp) {
        this.player = player;
        this.callRpc = new CallRPC(player);
    }

    public init() {
        this.player.setVariable('login', '');
        this.player.setVariable('gender', 'male');
        this.player.setVariable('isAuth', true);
        this.player.setVariable('admin', 1);
        this.player.setVariable('lookingStorage', {vehicle: null, object: null});
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
        
        this.player.setVariable('defaultClothes', {male, female});
        this.player.setVariable('clothes', {male, female});
    }

    public death() {
        const inventory = this.player.getInventory();
        const position = this.player.position;

        if (!inventory.length) {
            return;
        }

        let objHash = 'bkr_prop_duffel_bag_01a';

        position.z -= .8
        // Создаем объект.
        const object = Loot.createObject(position, objHash);
        Loot.setLootableObject(object, null, object.id, this.player.name, true);

        // Обнуляем инвентарь на серваке и в CEF.
        this.player.setInventory([]);
        this.callRpc.cefSetInventoryItems([]);

        // Кладем в труп лут игрока.
        object.setVariable('lootItems', inventory);
    }

    public takeItemByServerId(serverId: string, amount: number, typeEntity: 'object' | 'vehicle'): { result: boolean; text: string } {
        const self = this;

        // Найти предмет на земле, если есть.
        function findGroundItem(lootItems: Item[]): Item | false {
            // Ищем предмет вокруг игрока по serverId.
            const takenItem = lootItems.find(item => item.data.serverId === serverId);
            if (!takenItem) {
                return false;
            }

            return takenItem;
        }

        // есть ли место в инвентаре.
        function hasInventoryWeight(takenItem: Item): boolean {
            const inventory: Item[] = self.player.getInventory();
            const takenItemWeight = self.getItemsWeight([takenItem]);
            const inventoryWeight = self.getItemsWeight(inventory);

            if ((takenItemWeight + inventoryWeight) <= self.getInventorySlots()) {
                return true;
            }
            return false;
        }

        function getRestItemAmount(lootItems: Item[], takenItem: Item, amount: number): number {
            const idx = lootItems.findIndex(i => i.data.serverId === takenItem.data.serverId);
            return lootItems[idx].amount - amount;
        }

        switch (typeEntity) {
            // Если сущность является объектом.
            case 'object': {
                let findObject: any;
                let findItem: any;
                let result;

                // Перебираем объекты вокруг игрока.
                mp.objects.forEachInRange(this.player.position, 10, (object) => {
                    const lootItems = object.getVariable('lootItems');
                    if (!lootItems) return;

                    const takenItem = findGroundItem(lootItems);
                    if (!takenItem) return;

                    findItem = {...takenItem};
                    findObject = object;
                });

                if (!findItem || !findObject) {
                    return result = {
                        result: false,
                        text: 'Здесь нет такого предмета.',
                    }
                }

                const lootItems: Item[] = findObject.getVariable('lootItems');
                if (!hasInventoryWeight(findItem)) {
                    return result = {
                        result: false,
                        text: 'В инвентаре недостаточно места!',
                    }
                }

                const rest = getRestItemAmount(lootItems, findItem, amount);
                const idx = lootItems.findIndex(i => i.data.serverId === findItem.data.serverId);
                if (rest <= 0) {
                    lootItems.splice(idx, 1);
                    amount = findItem.amount;
                    // entity.destroy();
                }
                if (rest > 0) {
                    lootItems[idx].amount = rest;
                }

                findObject.setVariable('lootItems', lootItems);

                // Выдать игроку предмет.
                if (self.player.giveItem(findItem.key, amount, findItem.data)) {
                    const callRPC = new CallRPC(self.player);
                    callRPC.cefSetGroundItems(lootItems);

                    return result = {
                        result: true,
                        text: `Вы подобрали x${amount} ${findItem.data.name}`,
                    }
                }

                return result;
            }

            case 'vehicle': {
                // let findItem;
                // let findObject;
                // mp.vehicles.forEachInRange(self.player.position, 10, (vehicle) => {
                //     const lootItems = vehicle.getVariable('lootItems');
                //     if (!lootItems) return;

                //     const takenItem = findGroundItem(lootItems);
                //     if (!takenItem) return;

                //     findItem = {...takenItem};
                //     findObject = vehicle;
                // });

                // if (!findItem || !findObject) {
                //     return {
                //         result: false,
                //         text: 'Здесь нет такого предмета.',
                //     }
                // }

                // return self.takeItemCar(findObject, serverId, amount);
            }

            default: {
                return {
                    result: false,
                    text: 'Ошибка!',
                }
            }
        }
    }

    // Устанавливает слоты и отправляет в CEF.
    public setInventorySlots(slots: number) {
        this.player.setVariable('invMaxWeight', slots); // Макс. вес для предметов игрока.
        this.callRpc.cefSetInventoryWeight(slots);
    }

    // вес для предметов игрока.
    public getInventorySlots(): number {
        return this.player.getVariable('invMaxWeight'); 
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
    public getItemsWeight(items: Item[]): number {
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
}