"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rage_rpc_1 = require("../../rage-rpc");
mp.keys.bind(0x52, true, function () {
    let countAmmo = mp.players.local.getAmmoInClip(mp.players.local.weapon);
    let maxAmmo = mp.game.weapon.getWeaponClipSize(mp.players.local.weapon);
    let ammo = maxAmmo - countAmmo;
    rage_rpc_1.callServer('server_get_ammo', ammo);
    mp.gui.chat.push('R key is pressed. 1111');
    if (ammo !== 0) {
        mp.players.local.taskReloadWeapon(true);
    }
});
