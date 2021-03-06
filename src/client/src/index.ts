import './rage-rpc';

// Библиотеки расширяющие функционал.
import './syncedPlayerComponent';
import './_rage-console';

import './DAYZ/player';
import './DAYZ/player/events';

// Подключения наших модулей.
import './DAYZ/CEF/events';
import './DAYZ/CEF/keypress/AdminInterface';
import './DAYZ/CEF/keypress/huds';

import './DAYZ/events/render';
import './DAYZ/events/rpcRegister';

import './DAYZ/hudsData/armor';
import './DAYZ/hudsData/health';
import './DAYZ/hudsData/hunger';
import './DAYZ/hudsData/dehydration';

import './DAYZ/character/events';

import './DAYZ/login';
import './DAYZ/login/events';

import './DAYZ/weapon';
import './DAYZ/weapon/events';
import './DAYZ/weapon/keypress';

import './DAYZ/loot/lootItems';
import './DAYZ/lookingEntity';

mp.players.local.position = new mp.Vector3(-1167, 4923, 222);

mp.events.add('entityStreamIn', (entity) => {
    mp.gui.chat.push(`Вошел в поток ${entity.type}`);
});

mp.events.add('entityStreamOut', (entity) => {
    mp.gui.chat.push(`Вышел с потока ${entity.type}`);
});