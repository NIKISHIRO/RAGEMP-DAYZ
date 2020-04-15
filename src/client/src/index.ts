import { callBrowsers } from './rage-rpc';

// Библиотеки расширяющие функционал.
import './_rage-console';
import './syncedPlayerComponent';

// Подключения наших модулей.
import './CEF';
import './DAYZ/events/render';
import './DAYZ/peds';
import './DAYZ/loot';
import './DAYZ/events';


mp.keys.bind(0x47, true, function() {
    callBrowsers('testrpc', false);
    mp.events.callRemote('keypress:G');
});
