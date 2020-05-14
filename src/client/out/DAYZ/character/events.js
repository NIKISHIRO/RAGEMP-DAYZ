"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Character_1 = require("./Character");
const rage_rpc_1 = require("../../rage-rpc");
const Camera_1 = require("../Camera/Camera");
rage_rpc_1.register('client_character_set_heading', (h) => {
    Character_1.character.setHeading(h);
});
rage_rpc_1.register('client_character_set_face', ({ index, feature }) => {
    Character_1.character.setFace(index, feature);
});
rage_rpc_1.register('client_character_set_gender', (gender) => {
    Character_1.character.setGender(gender);
});
rage_rpc_1.register('client_character_set_head_prop', (data) => {
    Character_1.character.setHeadProp(data);
});
rage_rpc_1.register('client_character_reset', () => {
    Character_1.character.reset();
});
rage_rpc_1.register('client_character_set_hair', (dId) => {
    Character_1.character.setHair(dId);
});
rage_rpc_1.register('client_character_set_hair_color', (id) => {
    Character_1.character.setHairColor(id);
});
rage_rpc_1.register('client_character_set_camera_pos', ({ coord, n }) => {
    const pos = Camera_1.PlayerCamera.getCoord('character');
    pos[coord] = n;
    Camera_1.PlayerCamera.setCoord('character', pos);
});
rage_rpc_1.register('client_character_ready', () => {
    return Character_1.character.getCharacterDataForServer();
});
rage_rpc_1.register('client_character_set_overlay', ({ overlayId, index }) => {
    Character_1.character.setHeadOverlay(overlayId, index);
});
rage_rpc_1.register('client_Character_set_eyes', (val) => {
    Character_1.character.setEyeColor(val);
});
rage_rpc_1.register('update_character_camera_position', () => {
    Camera_1.PlayerCamera.setCoord('character', new mp.Vector3(-2167, 5181, 16.1));
    Camera_1.PlayerCamera.render('character', true);
});
