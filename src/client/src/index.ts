import './rage-rpc';

// Библиотеки расширяющие функционал.
import './syncedPlayerComponent';
import './modules/_rage-console';

import './DAYZ/player';
import './DAYZ/player/events';

// Подключения наших модулей.
import './DAYZ/CEF/events';
import './DAYZ/CEF/keypress/UIItems';
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

import './DAYZ/loot/lootItem';
import './DAYZ/lookingEntity';

mp.players.local.position = new mp.Vector3(-1167, 4923, 222);