import 'module-alias/register'; // Для работы alias-путей.
import '@modules/inventory-api';  // АПИ Инвентаря.
import '@modules/SyncedPlayerComponent'; // Синхронизация компонентов одежды.

const rpc = require('@modules/rage-rpc');

import {events} from './events';
mp.events.add(events);
import './commands';
import './loot';
import './car';
import './db';

