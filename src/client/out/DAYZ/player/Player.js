"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const CallRPC_1 = require("../CallRPC");
var KeysSettings;
(function (KeysSettings) {
    KeysSettings["ACTION"] = "ACTION";
    KeysSettings["OPEN_INVENTORY"] = "OPEN_INVENTORY";
})(KeysSettings = exports.KeysSettings || (exports.KeysSettings = {}));
;
class Player {
    constructor(player) {
        this.hungerDecrementIntervalId = null;
        this.checkHungerIntervalId = null;
        this.checkDehydrationIntervalId = null;
        this.dehydrationDecrementIntervalId = null;
        this.player = player;
    }
    init() {
        const customData = {
            hunger: 100,
            dehydration: 0,
            admin: {
                lootCreate: {
                    data: [],
                }
            },
            character: {},
            lookingAtEntity: null,
            settings: {
                ACTION: 0x45,
                OPEN_INVENTORY: 0x09
            },
        };
        mp.players.local['customData'] = customData;
        this.setHunger(100);
        this.setDehydration(100);
    }
    getSettingsKeyCode(name) {
        return this.player.customData.settings[name];
    }
    getLookingAtEntity(distance = 1000) {
        let startPosition = this.player.getBoneCoords(12844, 0.5, 0, 0);
        let res = mp.game.graphics.getScreenActiveResolution(1, 1);
        let endPosition = mp.game.graphics.screen2dToWorld3d(new mp.Vector3(res.x / 2, res.y / 2, 0));
        if (!endPosition)
            return null;
        const result = mp.raycasting.testPointToPoint(startPosition, endPosition, this.player);
        if (result) {
            let entPos = result.entity.position;
            let plrPos = this.player.position;
            if (!entPos)
                return null;
            if (mp.game.gameplay.getDistanceBetweenCoords(entPos.x, entPos.y, entPos.z, plrPos.x, plrPos.y, plrPos.z, true) > distance) {
                return null;
            }
            return result;
        }
        return null;
    }
    getLookingData() {
        return this.player.customData.lookingAtEntity;
    }
    setLookingData(entity) {
        this.player.customData.lookingAtEntity = entity;
    }
    dehydrationInit() {
        const self = this;
        this.checkDehydrationIntervalId = setInterval(() => {
            let newDehydration = self.getDehydration() - constants_1.constants.DECREMENT_DEHYDRATION_BAR;
            if (newDehydration <= 0) {
                newDehydration = 0;
                if (self.dehydrationDecrementIntervalId === null) {
                    self.dehydrationDecrementIntervalId = setInterval(() => {
                        const currentHealth = self.player.getHealth();
                        const newHealth = currentHealth - constants_1.constants.DECREMENT_DEHYDRATION_HEALTH;
                        CallRPC_1.callRPC.serverSetHealth(newHealth);
                    }, constants_1.constants.DECREMENT_TIME);
                }
            }
            self.setDehydration(newDehydration);
            CallRPC_1.callRPC.serverSetHudProp('dehydration', newDehydration);
        }, constants_1.constants.CHECK_TIME);
    }
    setDehydration(val) {
        if (val < 0) {
            val = 0;
        }
        if (val > 100) {
            val = 100;
        }
        this.player.customData.dehydration = val;
    }
    getDehydration() {
        return this.player.customData.dehydration;
    }
    clearDehydrationDecrement() {
        if (this.dehydrationDecrementIntervalId !== null) {
            clearInterval(this.dehydrationDecrementIntervalId);
            this.dehydrationDecrementIntervalId = null;
        }
    }
    clearCheckDehydrationInterval() {
        if (this.checkDehydrationIntervalId !== null) {
            clearInterval(this.checkDehydrationIntervalId);
            this.checkDehydrationIntervalId = null;
        }
    }
    hungerInit() {
        const self = this;
        this.checkHungerIntervalId = setInterval(() => {
            let newHunger = self.getHunger() - constants_1.constants.DECREMENT_HUNGER_BAR;
            mp.gui.chat.push(` newHunger = ${newHunger}`);
            if (newHunger <= 0) {
                newHunger = 0;
                if (self.hungerDecrementIntervalId === null) {
                    self.hungerDecrementIntervalId = setInterval(() => {
                        const currentHealth = self.player.getHealth();
                        const newHealth = currentHealth - constants_1.constants.DECREMENT_HUNGER_HEALTH;
                        CallRPC_1.callRPC.serverSetHealth(newHealth);
                    }, constants_1.constants.DECREMENT_DEHYDRATION_TIME);
                }
            }
            self.setHunger(newHunger);
            CallRPC_1.callRPC.serverSetHudProp('hunger', newHunger);
            mp.gui.chat.push(`self.getHunger(): ${self.getHunger()}`);
        }, constants_1.constants.CHECK_DEHYDRATION_TIME);
    }
    clearHungerDecrement() {
        if (this.hungerDecrementIntervalId !== null) {
            clearInterval(this.hungerDecrementIntervalId);
            this.hungerDecrementIntervalId = null;
        }
    }
    clearCheckHungerInterval() {
        if (this.checkHungerIntervalId !== null) {
            clearInterval(this.checkHungerIntervalId);
            this.checkHungerIntervalId = null;
        }
    }
    setHunger(val) {
        if (val < 0) {
            val = 0;
        }
        if (val > 100) {
            val = 100;
        }
        this.player.customData.hunger = val;
    }
    getHunger() {
        return this.player.customData.hunger;
    }
}
const playerInstance = new Player(mp.players.local);
exports.playerInstance = playerInstance;
