import { constants } from "../constants";
import { callRPC } from "../CallRPC";

export enum KeysSettings {
    ACTION = 'ACTION',
    OPEN_INVENTORY = 'OPEN_INVENTORY',
};

class Player {
    private player: PlayerMp;

    public hungerDecrementIntervalId: any = null;// Счетчик вычитания здоровья по голоду.
    public checkHungerIntervalId: any = null;// Счетчик вычитания здоровья по голоду.
    public checkDehydrationIntervalId: any = null;
    public dehydrationDecrementIntervalId: any = null;

    constructor(player: PlayerMp) {
        this.player = player;
    }

    // Инициализация всех дефолтных св-в.
    public init() {
        const customData = {
            hunger: 100,
            dehydration: 0,
            admin: {
                lootCreate: {
                    data: [], // для LootCreate класса.
                }
            },
            character: {},
            lookingAtEntity: null, // Entity || null.

            settings: { // KEYS:
                ACTION: 0x45, // E.
                OPEN_INVENTORY: 0x09 // TAB.
            },
        };
        mp.players.local['customData'] = customData;

        this.setHunger(100);
        this.setDehydration(100);
    }

    public getSettingsKeyCode(name: KeysSettings) {
        return this.player.customData.settings[name];
    }

    public getLookingAtEntity(distance: number = 1000): RaycastResult | null {
        let startPosition = this.player.getBoneCoords(12844, 0.5, 0, 0);
        let res = mp.game.graphics.getScreenActiveResolution(1, 1);
        let endPosition = mp.game.graphics.screen2dToWorld3d(new mp.Vector3(res.x / 2, res.y / 2, 0));
    
        if (!endPosition) return null;
        
        const result = mp.raycasting.testPointToPoint(startPosition, endPosition, this.player);
    
        if (result) {
            let entPos = result.entity.position;
            let plrPos = this.player.position;

            if (!entPos) return null;

            if (mp.game.gameplay.getDistanceBetweenCoords(entPos.x, entPos.y, entPos.z, plrPos.x, plrPos.y, plrPos.z, true) > distance) {
                return null;
            }
    
            return result;
        }
        return null;
    }

    public getLookingData(): EntityMp | null {
        return this.player.customData.lookingAtEntity;
    }

    public setLookingData(entity: EntityMp | null) {
        this.player.customData.lookingAtEntity = entity;
    }

    public dehydrationInit() {
        const self = this;

        this.checkDehydrationIntervalId = setInterval(() => {
            let newDehydration = self.getDehydration() - constants.DECREMENT_DEHYDRATION_BAR;
            
            if (newDehydration <= 0) {
                newDehydration = 0;

                // Проверяем есть ли таймер.
                if (self.dehydrationDecrementIntervalId === null) {
                    self.dehydrationDecrementIntervalId = setInterval(() => {
                        const currentHealth = self.player.getHealth();
                        const newHealth = currentHealth - constants.DECREMENT_DEHYDRATION_HEALTH;
                        callRPC.serverSetHealth(newHealth);
                    }, constants.DECREMENT_TIME);
                }
            }

            self.setDehydration(newDehydration);
            callRPC.serverSetHudProp('dehydration', newDehydration);
        }, constants.CHECK_TIME);
    }

    public setDehydration(val: number) {
        if (val < 0) {
            val = 0;
        }
        if (val > 100) {
            val = 100;
        }
        this.player.customData.dehydration = val;
    }

    public getDehydration() {
        return this.player.customData.dehydration;
    }

    // Удаляет счетчик по которому уменьшается ХП из-за голода.
    public clearDehydrationDecrement(): any {
        if (this.dehydrationDecrementIntervalId !== null) {
            clearInterval(this.dehydrationDecrementIntervalId);
            this.dehydrationDecrementIntervalId = null;
        }
    }

    // Удаляет счетчик, который проверяет показатель голода.
    public clearCheckDehydrationInterval(): any {
        if (this.checkDehydrationIntervalId !== null) {
            clearInterval(this.checkDehydrationIntervalId);
            this.checkDehydrationIntervalId = null;
        }
    }

    public hungerInit() {
        const self = this;

        this.checkHungerIntervalId = setInterval(() => {
            let newHunger = self.getHunger() - constants.DECREMENT_HUNGER_BAR;
            
            mp.gui.chat.push(` newHunger = ${newHunger}`);
            if (newHunger <= 0) { // Если сытость достигла нуля.
                newHunger = 0;

                // Проверяем есть ли таймер.
                if (self.hungerDecrementIntervalId === null) {
                    self.hungerDecrementIntervalId = setInterval(() => {
                        const currentHealth = self.player.getHealth();
                        const newHealth = currentHealth - constants.DECREMENT_HUNGER_HEALTH;
                        callRPC.serverSetHealth(newHealth);
                    }, constants.DECREMENT_DEHYDRATION_TIME);
                } 
            }

            self.setHunger(newHunger);
            callRPC.serverSetHudProp('hunger', newHunger);
            mp.gui.chat.push(`self.getHunger(): ${self.getHunger()}`);
        }, constants.CHECK_DEHYDRATION_TIME);
    }

    // Удаляет счетчик по которому уменьшается ХП из-за голода.
    public clearHungerDecrement(): any {
        if (this.hungerDecrementIntervalId !== null) {
            clearInterval(this.hungerDecrementIntervalId);
            this.hungerDecrementIntervalId = null;
        }
    }

    // Удаляет счетчик, который проверяет показатель голода.
    public clearCheckHungerInterval(): any {
        if (this.checkHungerIntervalId !== null) {
            clearInterval(this.checkHungerIntervalId);
            this.checkHungerIntervalId = null;
        }
    }

    // Устанавливает указан. кол-во сытости игроку.
    public setHunger(val: number): any {
        if (val < 0) {
            val = 0;
        }
        if (val > 100) {
            val = 100;
        }
        this.player.customData.hunger = val;
    }

    // Получает сытость игрока.
    public getHunger(): number {
        return this.player.customData.hunger;
    }
}

const playerInstance = new Player(mp.players.local);

export {
    playerInstance,
}