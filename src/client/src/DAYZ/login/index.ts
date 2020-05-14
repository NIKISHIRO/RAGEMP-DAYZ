import { PlayerCamera } from "../Camera/Camera";

flyCamera();
const playerLocal = mp.players.local;
function flyCamera() {
    let pos;
    let flag = false;
    let count = .3;
    
    // X.
    mp.keys.bind(0x58, true, () => {
        flag = !flag;
        playerLocal.freezePosition(flag);
        pos = playerLocal.position;
        PlayerCamera.setCoord('character', pos);
        PlayerCamera.render('character', flag);
    });

    // ARROW LEFT.
    mp.keys.bind(0x25, true, () => {
        pos.x -= count;
        PlayerCamera.setCoord('character', pos);
        getPos();
    });

    // ARROW RIGHT.
    mp.keys.bind(0x27, true, () => {
        pos.x += count;
        PlayerCamera.setCoord('character', pos);
        getPos();
    });

    // ARROW UP.
    mp.keys.bind(0x26, true, () => {
        pos.y += count;
        PlayerCamera.setCoord('character', pos);
        getPos();
    });

    // ARROW DOWN.
    mp.keys.bind(0x28, true, () => {
        pos.y -= count;
        PlayerCamera.setCoord('character', pos);
        getPos();
    });

    // SPACE.
    mp.keys.bind(0x20, true, () => {
        pos.z += count;
        PlayerCamera.setCoord('character', pos);
        getPos();
    });

    // CTRL.
    mp.keys.bind(0x11, true, () => {
        pos.z -= count;
        PlayerCamera.setCoord('character', pos);
        getPos();
    });

    function getPos() {
        mp.gui.chat.push(JSON.stringify(pos));
    }
}