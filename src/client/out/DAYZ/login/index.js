"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Camera_1 = require("../Camera/Camera");
flyCamera();
const playerLocal = mp.players.local;
function flyCamera() {
    let pos;
    let flag = false;
    let count = .3;
    mp.keys.bind(0x58, true, () => {
        flag = !flag;
        playerLocal.freezePosition(flag);
        pos = playerLocal.position;
        Camera_1.PlayerCamera.setCoord('character', pos);
        Camera_1.PlayerCamera.render('character', flag);
    });
    mp.keys.bind(0x25, true, () => {
        pos.x -= count;
        Camera_1.PlayerCamera.setCoord('character', pos);
        getPos();
    });
    mp.keys.bind(0x27, true, () => {
        pos.x += count;
        Camera_1.PlayerCamera.setCoord('character', pos);
        getPos();
    });
    mp.keys.bind(0x26, true, () => {
        pos.y += count;
        Camera_1.PlayerCamera.setCoord('character', pos);
        getPos();
    });
    mp.keys.bind(0x28, true, () => {
        pos.y -= count;
        Camera_1.PlayerCamera.setCoord('character', pos);
        getPos();
    });
    mp.keys.bind(0x20, true, () => {
        pos.z += count;
        Camera_1.PlayerCamera.setCoord('character', pos);
        getPos();
    });
    mp.keys.bind(0x11, true, () => {
        pos.z -= count;
        Camera_1.PlayerCamera.setCoord('character', pos);
        getPos();
    });
    function getPos() {
        mp.gui.chat.push(JSON.stringify(pos));
    }
}
