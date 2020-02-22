import 'module-alias/register'; // Для работы alias-путей.

// Библиотеки расширяющие функционал.
import '@s_modules/inventory-api';  // АПИ Инвентаря.
import '@s_modules/SyncedPlayerComponent'; // Синхронизация компонентов одежды.

import {events} from './events';
import './commands';

// Выполнение событий событий.
mp.events.add(events);

