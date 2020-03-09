// Библиотеки расширяющие функционал.
import './modules/syncedPlayerComponent';

// Подключения наших модулей.
import './CEF';
import './DAYZ/events/render';
import './DAYZ/peds';
import './DAYZ/loot';

mp.keys.bind(0x47, true, function() {
    mp.events.callRemote('keypress:G');
});

mp.gui.chat.push('ПРИВЕТ ОТ ВЕБПАКА!');