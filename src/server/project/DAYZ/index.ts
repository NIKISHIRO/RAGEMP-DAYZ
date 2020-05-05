import 'module-alias/register'; // Для работы alias-путей.
import '@modules/inventory-api';  // АПИ Инвентаря.
import '@modules/SyncedPlayerComponent'; // Синхронизация компонентов одежды.

import {events} from './events';
mp.events.add(events);
import './events/rpcRegister';
import './commands';
import './loot';
import './db';
