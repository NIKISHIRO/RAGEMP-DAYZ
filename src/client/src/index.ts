import './rage-rpc';

// Библиотеки расширяющие функционал.
import './syncedPlayerComponent';
import './modules/_rage-console';

// Подключения наших модулей.
import './DAYZ/CEF/events';
import './DAYZ/CEF/browser';
import './DAYZ/CEF/keypress/UIItems';
import './DAYZ/CEF/keypress/AdminInterface';
import './DAYZ/CEF/keypress/huds';

import './DAYZ/events/render';

import './DAYZ/player';
import './DAYZ/player/events';
import './DAYZ/events/rpcRegister';

import './DAYZ/hudsData/armor';
import './DAYZ/hudsData/health';
import './DAYZ/hudsData/hunger';
import './DAYZ/hudsData/dehydration';

import './DAYZ/character/events';

import './DAYZ/login';
import './DAYZ/login/events';

mp.keys.bind(0x0D, true, () => {
    mp.gui.chat.push('auth: '+ JSON.stringify(mp.players.local.getVariable('isAuth')));
    mp.gui.chat.push('admin: '+ JSON.stringify(mp.players.local.getVariable('admin')));
}); 

let flag = true;
mp.keys.bind(0x47, true, function() {
    flag = !flag;
    mp.events.callRemote('keypress:G');
});