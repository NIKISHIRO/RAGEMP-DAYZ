// Библиотеки расширяющие функционал.
import './syncedPlayerComponent';
import './_rage-console';

// Подключения наших модулей.
import './CEF';
import './DAYZ/events/render';
import './DAYZ/peds';
import './DAYZ/loot';

mp.keys.bind(0x47, true, function() {
    mp.events.callRemote('keypress:G');
});

mp.gui.chat.push('ПРИВЕТ ОТ ВЕБПАКА!');

mp.events.add("playerEnterVehicle", (vehicle, seat) => {
	vehicle.setInvincible(false);
});

mp.keys.bind(0x31, true, function(){
    mp.events.callRemote('previ');
})
mp.keys.bind(0x32, true, function(){
    mp.events.callRemote('nexti');
})
