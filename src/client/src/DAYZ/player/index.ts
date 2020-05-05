// Здесь устанавливаются общие настройки, которые связаны с игроком. 
import { playerInstance } from "./Player";

playerInstance.init();
playerInstance.hungerInit();
playerInstance.dehydrationInit();

let flag = true;
mp.keys.bind(0x47, true, function() {
    flag = !flag;
    mp.events.callRemote('keypress:G');
    mp.gui.chat.push(`CA: ${mp.players.local.setArmour(30)}`);
});

// Обнуляют дефолтные показатели HP и ARMOR.
mp.game.graphics.pushScaleformMovieFunction(1, "SET_HEALTH_ARMOUR_BAR_VISIBLE");
mp.game.graphics.pushScaleformMovieFunctionParameterBool(false);
mp.game.graphics.popScaleformMovieFunctionVoid();

// Отключение радара у игрока.
mp.game.ui.displayRadar(true);
// Делает картку большой.
mp.game.ui.setRadarBigmapEnabled(true, false);