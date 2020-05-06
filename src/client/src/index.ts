// Библиотеки расширяющие функционал.
import './rage-rpc';
import './_rage-console';
import './syncedPlayerComponent';

// Подключения наших модулей.
import './DAYZ/CEF/events';
import './DAYZ/CEF/browser';
import './DAYZ/CEF/keypress/UIItems';
import './DAYZ/CEF/keypress/AdminInterface';
import './DAYZ/CEF/keypress/huds';

import './DAYZ/events/render';

import './DAYZ/player';
import './DAYZ/player/events';
import './DAYZ/player/rpcRegister';

import './DAYZ/hudsData/armor';
import './DAYZ/hudsData/health';
import './DAYZ/hudsData/hunger';
import './DAYZ/hudsData/dehydration';

import './DAYZ/character';
import './DAYZ/character/events';

import './DAYZ/login';
import './DAYZ/login/events';

mp.keys.bind(0x0D, true, () => {
    mp.gui.chat.push(JSON.stringify(mp.players.local.getVariable('isAuth')));
});

let flag = true;
mp.keys.bind(0x47, true, function() {
    flag = !flag;
    mp.events.callRemote('keypress:G');
    mp.players.local.taskReloadWeapon(true);
    mp.gui.chat.push(`ammo: ${mp.players.local.getAmmoInClip(mp.players.local.weapon)}`);
    mp.gui.chat.push(`getWeaponTintCount: ${mp.game.weapon.getWeaponTintCount(mp.players.local.weapon)}`);
    this.player.setHeadOverlay(8, 0, 100, 0, 0);
});

mp.keys.bind(0x76, false, function () { // F7 key
    let weaponHash = mp.game.invoke(`0x0A6DB4965674D243`, mp.players.local.handle); //GET_SELECTED_PED_WEAPON
    let clipSize = mp.game.weapon.getWeaponClipSize(weaponHash);
    mp.gui.chat.push(`hash: ${weaponHash}, clipSize: ${clipSize}`);
    mp.players.local.setHeadOverlay(0, 21, 1, 1, 1);
})