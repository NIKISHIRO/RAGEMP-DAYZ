import { character, HeadPropType } from "./Character";
import { register, callServer } from "../../rage-rpc";
import { PlayerCamera } from "../Camera/Camera";

type Face = {
    index: number;
    feature: number;
};

register('client_character_set_heading', (h: number) => {
    character.setHeading(h);
});

register('client_character_set_face', ({index, feature}: Face) => {
    character.setFace(index, feature);
});

register('client_character_set_gender', (gender: 'male' | 'female') => {
    character.setGender(gender);
});

register('client_character_set_head_prop', (data: HeadPropType) => {
    character.setHeadProp(data);
});

register('client_character_reset', () => {
    character.reset();
});

register('client_character_set_hair', (dId: number) => {
    character.setHair(dId);
});

register('client_character_set_hair_color', (id: number) => {
    character.setHairColor(id);
});

register('client_character_set_camera_pos', ({coord, n}: {coord: 'x' | 'y' | 'z', n: number}) => {
    const pos = PlayerCamera.getCoord('character');
    pos[coord] = n;
    PlayerCamera.setCoord('character', pos);
});

register('client_character_ready', () => {
    return character.getCharacterDataForServer();
});

register('client_character_set_overlay', ({overlayId, index}: {overlayId: number, index: number}) => {
    character.setHeadOverlay(overlayId, index);
});

register('client_Character_set_eyes', (val: number) => {
    character.setEyeColor(val);
});