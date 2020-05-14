"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlayerCamera {
    static create(name, pos, rot, fow) {
        const camera = mp.cameras.new(name, pos, rot, fow);
        PlayerCamera.cameras.push({ name, camera });
    }
    static getCameraByName(name) {
        const findCamera = this.cameras.find(c => c.name === name).camera;
        if (findCamera) {
            return findCamera;
        }
        mp.gui.chat.push(`Камера с названием '${name}' не найдена`);
        return false;
    }
    static render(name, render, ease = false, easeTime = 0) {
        const findCamera = PlayerCamera.getCameraByName(name);
        if (findCamera) {
            findCamera.setActive(render);
            mp.game.cam.renderScriptCams(render, ease, easeTime, true, false);
        }
        else {
            mp.gui.chat.push('Такой камеры нет.');
        }
    }
    static setActive(name, b) {
        const findCamera = PlayerCamera.getCameraByName(name);
        if (findCamera) {
            findCamera.setActive(b);
        }
    }
    static setCoord(name, pos) {
        const findCamera = PlayerCamera.getCameraByName(name);
        if (findCamera) {
            findCamera.setCoord(pos.x, pos.y, pos.z);
        }
    }
    static getCoord(name) {
        const findCamera = PlayerCamera.getCameraByName(name);
        if (findCamera) {
            return findCamera.getCoord();
        }
    }
}
exports.PlayerCamera = PlayerCamera;
PlayerCamera.cameras = [];
