"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rage_rpc_1 = require("../../rage-rpc");
const Camera_1 = require("../Camera/Camera");
const changeUI_1 = require("../CEF/changeUI");
const Character_1 = require("../character/Character");
const displayUI_1 = require("../CEF/displayUI");
const playerLocal = mp.players.local;
rage_rpc_1.register('client_before_auth_init', () => {
    Character_1.character.reset();
    Character_1.character.faceUpdate();
    Character_1.character.headUpdate();
    const playerDefaultPos = new mp.Vector3(-2167, 5182, 15.2);
    const cameraDefaultPos = new mp.Vector3(-2167, 5131, 20);
    playerLocal.position = playerDefaultPos;
    Camera_1.PlayerCamera.create('character', cameraDefaultPos, new mp.Vector3(0, 0, 0), 60);
    Camera_1.PlayerCamera.render('character', true);
    setTimeout(_ => {
        Character_1.character.setHeading(180);
    }, 500);
    mp.game.graphics.pushScaleformMovieFunction(1, "SET_HEALTH_ARMOUR_BAR_VISIBLE");
    mp.game.graphics.pushScaleformMovieFunctionParameterBool(false);
    mp.game.graphics.popScaleformMovieFunctionVoid();
    mp.game.ui.setRadarBigmapEnabled(false, false);
    mp.game.ui.displayRadar(false);
    playerLocal.setHelmet(false);
    playerLocal.freezePosition(true);
    mp.gui.chat.activate(false);
    setTimeout(() => { mp.gui.cursor.show(true, true); }, 500);
    mp.gui.chat.push('client_before_auth_init');
});
rage_rpc_1.register('client_after_register', () => {
    init();
});
rage_rpc_1.register('client_after_login', () => {
    init();
});
function init() {
    changeUI_1.changeUI(changeUI_1.CEFRoute.CLEAR);
    Camera_1.PlayerCamera.render('character', false);
    displayUI_1.setDisplayInterface('huds', true);
    mp.players.local.freezePosition(false);
    mp.gui.cursor.show(false, false);
    mp.gui.cursor.visible = false;
    mp.gui.chat.activate(true);
    mp.gui.chat.push('client_after_auth_init');
}
mp.events.add('render', () => {
});
