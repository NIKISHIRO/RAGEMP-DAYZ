import 'module-alias/register'; // Для работы alias-путей.
import '@s_modules/inventory-api';

mp.events.addCommand('test', (player: PlayerMp) => {
    console.log(player);
})
