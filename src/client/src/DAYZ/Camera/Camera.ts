type CamerasObjects = {
    name: string;
    camera: CameraMp;
}

class PlayerCamera {
    static cameras: CamerasObjects[] = [];

    static create(name: string, pos: Vector3Mp, rot: Vector3Mp, fow: number) {
        const camera = mp.cameras.new(name, pos, rot, fow);
        PlayerCamera.cameras.push({ name, camera });
    }

    // Возвращает объект камеры по её названию, либо false.
    static getCameraByName(name: string) {
        const findCamera = this.cameras.find(c => c.name === name).camera;
        if (findCamera) {
            return findCamera;
        }

        mp.gui.chat.push(`Камера с названием '${name}' не найдена`);
        return false;
    }

    // Рендерит
    static render(name: string, render: boolean, ease: boolean = false, easeTime: number = 0) {
        const findCamera = PlayerCamera.getCameraByName(name);
        if (findCamera) {
            findCamera.setActive(render);
            mp.game.cam.renderScriptCams(render, ease, easeTime, true, false);
        } else {
            mp.gui.chat.push('Такой камеры нет.');
        }
    }

    static setActive(name: string, b: boolean) {
        const findCamera = PlayerCamera.getCameraByName(name);
        if (findCamera) {
            findCamera.setActive(b);
        }
    }

    static setCoord(name: string, pos: Vector3Mp) {
        const findCamera = PlayerCamera.getCameraByName(name);
        if (findCamera) {
            findCamera.setCoord(pos.x, pos.y, pos.z);
        }
    }

    static getCoord(name: string) {
        const findCamera = PlayerCamera.getCameraByName(name);
        if (findCamera) {
            return findCamera.getCoord();
        }
    }
}

export {
    PlayerCamera,
}