"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("./Player");
const rage_rpc_1 = require("../../rage-rpc");
mp.events.add("playerSpawn", () => {
    Player_1.playerInstance.setHunger(75);
    Player_1.playerInstance.setDehydration(75);
    Player_1.playerInstance.clearHungerDecrement();
    Player_1.playerInstance.clearDehydrationDecrement();
});
mp.events.add('playerQuit', () => {
    Player_1.playerInstance.clearHungerDecrement();
    Player_1.playerInstance.clearCheckHungerInterval();
});
mp.events.add("playerEnterVehicle", (vehicle, seat) => {
    vehicle.setInvincible(false);
});
let ammo;
mp.events.add('playerWeaponShot', (targetPosition, targetEntity) => {
    let hash = mp.players.local.weapon;
    let countAmmo = mp.players.local.getAmmoInClip(hash);
    let maxAmmo = mp.game.weapon.getWeaponClipSize(hash);
    if (countAmmo > 0) {
        ammo = maxAmmo;
    }
    mp.gui.chat.push(maxAmmo.toString());
    if (countAmmo == 0) {
        mp.gui.chat.push(maxAmmo.toString());
        rage_rpc_1.callServer('server_get_ammo', ammo);
    }
    mp.gui.chat.push('You fired a weapon!');
});
mp.events.add('render', () => {
    if (mp.players.local.isSprinting()) {
        mp.game.player.restoreStamina(100);
    }
});
mp.events.addDataHandler('hunger', (entity, hunger, prevHunger) => {
    if (entity === mp.players.local) {
        Player_1.playerInstance.setHunger(hunger);
    }
});
mp.events.addDataHandler('dehydration', (entity, dehydration, prevDehydration) => {
    if (entity === mp.players.local) {
        Player_1.playerInstance.setDehydration(dehydration);
    }
});
mp.events.addDataHandler('temperature', (entity, temperature, prevTemperature) => {
    if (entity === mp.players.local) {
    }
});
