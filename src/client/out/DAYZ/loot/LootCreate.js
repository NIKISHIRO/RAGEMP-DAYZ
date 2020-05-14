"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LootCreate {
    constructor(player) {
        this.player = player;
        this.player.customData.admin.lootCreate = {};
    }
    setRotation(x, y, z) {
        const currentObject = this.getCurrentObject();
        if (currentObject) {
            const object = this.getObjectById(currentObject.objectId);
            if (object) {
                object.setRotation(x, y, z, 1, true);
                mp.gui.chat.push('Вращение объекта было изменено.');
            }
        }
    }
    getObjectById(id) {
        if (mp.objects.exists(id)) {
            return mp.objects.at(id);
        }
        else {
            mp.gui.chat.push('Объект не найден.');
            return false;
        }
    }
    removeObject() {
        const currentObject = this.getCurrentObject();
        if (currentObject) {
            const object = this.getObjectById(currentObject.objectId);
            if (object) {
                object.destroy();
            }
            this.player.customData.admin.lootCreate.currentObject = {};
        }
    }
    changeModel(objectHash) {
        const obj = this.getObjectById(this.getCurrentObject().objectId);
        if (obj) {
            this.createObject(objectHash, obj.position, obj.getRotation(1));
        }
    }
    createObject(objectHash, position, rotation = new mp.Vector3(0, 0, 0)) {
        const obj = mp.objects.new(mp.game.joaat(objectHash), position, {
            rotation: rotation,
            alpha: 255,
            dimension: this.player.dimension,
        });
        this.setCurrentObject(obj.id, objectHash, position, rotation);
    }
    setCurrentObject(objectId, objectHash, p, r) {
        this.removeObject();
        this.player.customData.admin.lootCreate.currentObject = { objectId, objectHash, position: [p.x, p.y, p.z], rotation: [r.x, r.y, r.z] };
    }
    getCurrentObject() {
        const currentObject = this.player.customData.admin.lootCreate.currentObject;
        if (currentObject) {
            return currentObject;
        }
        else {
            mp.gui.chat.push('Текущий объект не установлен.');
            false;
        }
    }
}
const lootCreate = new LootCreate(mp.players.local);
exports.lootCreate = lootCreate;
