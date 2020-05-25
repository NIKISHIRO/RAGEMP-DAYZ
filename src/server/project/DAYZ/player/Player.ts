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

    public async dropItem(itemKey: string, amount: number, putId: number | undefined = undefined) {
        const self = this;
        const storageData: {type: string, id: number} = self.player.getVariable('storageData');
        const inventory = [...self.player.getInventory()];
        let rest = 0;        
        let isRemoved = false;

        console.log('dropItem storageData', storageData);
        console.log('dropItem itemKey', itemKey);
        console.log('dropItem amount', amount);

        const idx = self.player.getItemIndex(itemKey);
        if (idx == -1) {
            return {result: false, text: 'В инвентаре нет такого предмета.'};
        }

        const takingItem = JSON.parse(JSON.stringify(inventory[idx]));
        
        if (takingItem.amount < amount) {
            return {result: false, text: 'В инвентаре нет столько предметов.'};
        }

        const pos = self.player.position;

        // Положить предмет на землю/машину/хранилище.
        if (storageData.type == null) {
            const groundZ = await self.callRpc.clientGetGroundCoordZ(pos);
            pos.z = groundZ;
            // const createdItem = EItem.createItem(takingItem.key, amount, takingItem.data);
            Loot.createLootObject(takingItem, pos);
            rest = amount;
        }
        else if (storageData.type == 'vehicle') {
            if (!mp.vehicles.exists(storageData.id)) {
                return {result: false, text: `${storageData.type} с ИД = ${storageData.id}`};
            }
        
            const vehicle = mp.vehicles.at(storageData.id);
            const distance = pos.subtract(vehicle.position).length();
            
            if (distance > 10) {
                return {result: false, text: 'Вы находитесь слишком далеко от машины.'};
            }

            self.player.outputChatBox('distance ' + distance);
            
            const lootItems = vehicle.getVariable('lootItems');

            if (!putId) {
                return {result: false, text: 'Не указан putId, либо такой ячейки нет.'};
            }

            if (lootItems[putId]) {
                const putItem = lootItems[putId];
                // Если ячейка в которую кладем не NULL.
                if (putItem !== null && putItem.key == takingItem.key) {
                    const msc = takingItem.data.maxStackCount;
                    const sum = takingItem.amount + putItem.amount;

                    if (sum > msc) {
                        rest = sum - msc;
                        putItem.amount = msc;
                    }
                    else if (sum == msc) {
                        rest = 0;
                    }
                    else if (sum < msc) {
                        rest = 0;
                    }

                    if (rest < 1) {
                        lootItems.splice(putId, 1);
                    }
                }
                lootItems.splice(putId, 1, takingItem);
            }

            self.player.removeItem(idx, rest) && (isRemoved = true);
    
            if (!isRemoved) {
                return {result: false, text: 'Вы инвентаре нет такого кол-ва этого предмета.'};
            }

            vehicle.setVariable('lootItems', lootItems);
        }

        return {result: true, text: `-${amount} ${takingItem.data.name}`}
    }

    public async takeItem(itemKey: string, amount: number): Promise<ServerResult> {
        const self = this;
        const storageData: {type: string, id: number} = self.player.getVariable('storageData');

        console.log('takeItem - storageData', storageData);
        console.log('takeItem - itemKey', itemKey);
        console.log('takeItem - amount', amount);

        if (!storageData) {
            return { result: false, text: 'Хранилище не установлено!' };
        }

        const emptySltosIdx = self.player.getFirstEmptySlotIndex();
        if (emptySltosIdx == -1) {
            return {result: false, text: 'В инвентаре нет свободного места.'};
        }

        let entity: EntityMp | null = null;

        // Предмет.
        if (storageData.type == 'item') {
            if (mp.objects.exists(storageData.id)) {
                entity = mp.objects.at(storageData.id);
            }
        }

        // ТС.
        if (storageData.type == 'vehicle') {
            if (mp.vehicles.exists(storageData.id)) {
                entity = mp.vehicles.at(storageData.id);
            }
        }

        // Обычные объекты.
        if (storageData.type == null) {
            mp.objects.forEachInRange(self.player.position, 10, (object) => {
                const lootItems: Item[] = object.getVariable('lootItems');
                if (!lootItems || !lootItems.length) {
                    return;
                }
                const item = lootItems.find(i => i.key === itemKey && i.amount === amount);
                if (item) {
                    entity = object;
                }
            });
        }

        if (!entity) {
            return {result: false, text: 'Такого предмета здесь нет.'};
        }

        console.log('takeItem - entity', entity.getVariable('lootItems'));
        const lootItems = entity.getVariable('lootItems');
        const idx = lootItems.findIndex(i => i.key === itemKey && i.amount === amount);
        const takingItem = {...lootItems[idx], data: {...lootItems[idx].data}};

        if (takingItem.amount < amount) {
            return {result: false, text: 'Здесь нет столько предметов.'};
        }
        if (takingItem.amount == amount) {
            lootItems.splice(idx, 1);
        }
        if (takingItem.amount > amount) {
            lootItems[idx].amount -= amount;
        }

        entity.setVariable('lootItems', lootItems);
        console.log('takeItem - entity', entity.getVariable('lootItems'));

        if (lootItems.length < 1) {
            // Если хранилище не установлено (значит предмет берется через UI)
            // ИЛИ берется 1 предмет.
            if (storageData.type == null || storageData.type == 'item') {
                const skinObjectId = entity.getVariable('skinObjectId');
                const collisionId = entity.getVariable('collisionId');
                // Удаляем коллизионный и обычный объекты.
                if (collisionId != null) {
                    if (mp.objects.exists(collisionId)) {
                        const object = mp.objects.at(collisionId);
                        object.destroy();
                    }
                } 
                if (skinObjectId != null) {
                    if (mp.objects.exists(skinObjectId)) {
                        const object = mp.objects.at(skinObjectId);
                        object.destroy();
                    }
                }
            } 
            if (storageData.type == 'vehicle') {
                // entity.destroy();
            }
        }

        const newItem = EItem.createItem(takingItem.key, amount, takingItem.data);

        if (self.player.putItem(newItem, emptySltosIdx).result) {
            await self.callRpc.cefAddInventoryItem(takingItem);
            return {result: true, text: `+${amount} ${takingItem.data.name}`};
        }

        return {result: false, text: 'Такой предмет не зарегистрирован, либо не верное кол-во.'};
    }

    // Устанавливает слоты и отправляет в CEF.
    public setInventorySlots(slots: number) {
        this.player.setVariable('invMaxWeight', slots); // Макс. вес для предметов игрока.
        this.callRpc.cefSetInventoryWeight(slots);
    }

    // макс. допустимый вес инвент. игрока.
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