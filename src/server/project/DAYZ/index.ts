import 'module-alias/register'; // Для работы alias-путей.

// Библиотеки расширяющие функционал.
import '@modules/inventory-api';  // АПИ Инвентаря.
import '@modules/SyncedPlayerComponent'; // Синхронизация компонентов одежды.

import {events} from './events';
import './commands';

import './loot';

mp.events.add(events);