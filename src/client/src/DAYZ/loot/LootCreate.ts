class LootCreate {
    player: PlayerMp;

    constructor(player: PlayerMp) {
        this.player = player;
        this.player.customData.admin.lootCreate = {
            // currentObject: {
            //     objectId: 0,
            //     objectHash: 'w_ar_assaultrifle', 
            //     position: [0, 0, 0],
            //     rotation: [0, 0, 0],
            // }
        };
    }

    // Устанавливает вращение объекту с указанным идом.
    public setRotation(x: number, y: number, z: number) {
        const currentObject = this.getCurrentObject();
        if (currentObject) {
            const object = this.getObjectById(currentObject.objectId);
            // Если объект существует.
            if (object) {
                // const rotation = object.getRotation(1);
                object.setRotation(x, y, z, 1, true);
                mp.gui.chat.push('Вращение объекта было изменено.');
            }
        }
    }

    // Возвращает объект по иду.
    private getObjectById(id: number): ObjectMp | false {
        if (mp.objects.exists(id)) {
            return mp.objects.at(id);
        } else {
            mp.gui.chat.push('Объект не найден.');
            return false;
        }
    }

    public removeObject() {
        const currentObject = this.getCurrentObject();
        // Если текущ. объект установлен.
        if (currentObject) {
            const object = this.getObjectById(currentObject.objectId);
            // Если объект существует.
            if (object) {
                object.destroy();
            }
            this.player.customData.admin.lootCreate.currentObject = {};
        }
    }

    public changeModel(objectHash: string) {
        const obj = this.getObjectById(this.getCurrentObject().objectId);
        if (obj) {
            this.createObject(objectHash, obj.position, obj.getRotation(1));
        }
    }

    public createObject(objectHash: string, position: Vector3Mp, rotation: Vector3Mp = new mp.Vector3(0, 0, 0)) {
        const obj = mp.objects.new(mp.game.joaat(objectHash), position,
        {
            rotation: rotation,
            alpha: 255,
            dimension: this.player.dimension,
        });
        this.setCurrentObject(obj.id, objectHash, position, rotation);
    }

    private setCurrentObject(objectId: number, objectHash: string, p: Vector3Mp, r: Vector3Mp) {
        this.removeObject();
        this.player.customData.admin.lootCreate.currentObject = {objectId, objectHash, position: [p.x, p.y, p.z], rotation: [r.x, r.y, r.z]};
    }

    public getCurrentObject(): any | false {
        const currentObject = this.player.customData.admin.lootCreate.currentObject;
        if (currentObject) {
            return currentObject;
        } else {
            mp.gui.chat.push('Текущий объект не установлен.');
            false;
        }
    }  
}

const lootCreate = new LootCreate(mp.players.local);

export {
    lootCreate,
}