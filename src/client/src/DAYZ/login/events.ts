import { register } from "../../rage-rpc";
import { PlayerCamera } from "../Camera/Camera";
import { changeUI, CEFRoute } from "../CEF/changeUI";
import { character } from "../character/Character";

const playerLocal = mp.players.local;

// Установка св-в для авторизации игрока.
register('client_before_auth_init', () => {
    // Устанавливаем дефолтную внешность персу.
    character.reset();
    character.faceUpdate();
    character.headUpdate();

    // Координаты спавна игрока для кастомизации.
    const playerDefaultPos = new mp.Vector3(-2167, 5182, 15.5);
    // Координаты камеры игрока для кастомизации.
    const cameraDefaultPos = new mp.Vector3(-2167, 5131, 20);

    // Установка свойств до авторизации/регистрации.
    playerLocal.position = playerDefaultPos;
    // Создание камеры для кастомизации.
    PlayerCamera.create('character', cameraDefaultPos, new mp.Vector3(0, 0, 0), 60);
    PlayerCamera.render('character', true);
    // Установка деф. св-в кастомизации.
    setTimeout(_ => {
        character.setHeading(180);
    }, 500);

    // Обнуляют дефолтные показатели HP и ARMOR.
    mp.game.graphics.pushScaleformMovieFunction(1, "SET_HEALTH_ARMOUR_BAR_VISIBLE");
    mp.game.graphics.pushScaleformMovieFunctionParameterBool(false);
    mp.game.graphics.popScaleformMovieFunctionVoid();
    // Делает карту большой.
    mp.game.ui.setRadarBigmapEnabled(false, false);
    // Отключить радар.
    mp.game.ui.displayRadar(false);
    // Отключить шлем на мотоцикле.
    playerLocal.setHelmet(false);
    // Скорость перемещения.
    // playerLocal.setMoveRateOverride(1);
    // Зафризить игрока.
    playerLocal.freezePosition(false);
    mp.gui.chat.activate(false);
    setTimeout(() => { mp.gui.cursor.show(true, true); }, 500);
    mp.gui.chat.push('client_before_auth_init');
});

// Установка св-в после аутентификации игрока.
register('client_after_auth_init', () => {
    mp.players.local.freezePosition(false);
    mp.gui.cursor.show(false, false);
    mp.gui.cursor.visible = false;
    mp.gui.chat.activate(true);
    PlayerCamera.render('character', false);
    changeUI(CEFRoute.CLEAR);
    mp.gui.chat.push('client_after_auth_init');
});
