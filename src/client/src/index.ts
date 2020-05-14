import './rage-rpc';

// Библиотеки расширяющие функционал.
import './syncedPlayerComponent';
import './_rage-console';

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

mp.events.add('entityStreamIn', (entity) => {
    mp.gui.chat.push(`Вошел в поток ${entity.type}`);
});

mp.events.add('entityStreamOut', (entity) => {
    mp.gui.chat.push(`Вышел с потока ${entity.type}`);
});

mp.events.add('incomingDamage', (sourceEntity: EntityMp, sourcePlayer: EntityMp, targetEntity: EntityMp, weapon: number, boneIndex: number, damage: number) => {
    mp.gui.chat.push('incomingDamage');
    mp.gui.chat.push(JSON.stringify(sourceEntity));
    mp.gui.chat.push(JSON.stringify(sourcePlayer));
    mp.gui.chat.push(JSON.stringify(targetEntity));
    mp.gui.chat.push(`weapon: ${weapon}`);
    mp.gui.chat.push(` boneIndex: ${boneIndex} id current plr: ${mp.players.local.getBoneIndex(boneIndex) }`);
    mp.gui.chat.push(`damage: ${damage}`);
});

mp.events.add('outgoingDamage', (sourceEntity: EntityMp, sourcePlayer: EntityMp, targetEntity: EntityMp, weapon: number, boneIndex: number, damage: number) => {
    mp.gui.chat.push('outgoingDamage');
    mp.gui.chat.push(JSON.stringify(sourceEntity));
    mp.gui.chat.push(JSON.stringify(sourcePlayer));
    mp.gui.chat.push(JSON.stringify(targetEntity));
    mp.gui.chat.push(`weapon: ${weapon}`);
    mp.gui.chat.push(` boneIndex: ${boneIndex} id current plr: ${mp.players.local.getBoneIndex(boneIndex) }`);
    mp.gui.chat.push(`damage: ${damage}`);
});

mp.keys.bind(0x47, true, _ => {
    mp.gui.chat.push(JSON.stringify('test'))
});