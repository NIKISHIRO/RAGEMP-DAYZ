import rpc, { call, callClient, callServer } from 'rage-rpc';
import { LootCreateData } from '../../reducers/UIReducer';

type Result = {
    result: boolean;
    text: string;
}

export type HeadPropType = {name: 'mother' | 'father' | 'skin' | 'similarity', val: number};

type CharacterType = {
    gender: string;
    face: any[];
    head: any;
    eyes: number;
};

// Подбор предмета с земли.
async function takeInventoryItemToServer(serverId: string, amount: number): Promise<Result> {
    return callServer('server_take_inventory_item', JSON.stringify({ serverId, amount }));
    return { result: true, text: '"Взять предмет". Заглушка' };
}
// Дропает предмет из инвентаря.
async function dropInventoryItemToServer(itemKey: string, amount: number): Promise<Result> {
    return callServer('server_drop_inventory_item', JSON.stringify({itemKey, amount}));
    return { result: true, text: '"Выбосить предмет". Заглушка' };
}
// Отправка на сервак serverId чтобы использовать предмет в инвентаре по нему.
async function usesInventoryItemByServerId(serverId: string): Promise<Result> {
    return callServer('server_use_item_by_serverid', serverId);
    return { result: true, text: '"Использование предмета". Заглушка.' };
}

// Создает на клиенте объект с указанным хэшем и возвращает данные о нем.
async function lootCreate(objectHash: string): Promise<LootCreateData | false> {
    return callClient('client_set_loot_create', objectHash);
    return {
        objectId: 0,
        objectHash: 'w_ar_assaultrifle',
        position: [2, 32, 2320],
        rotation: [120, 231, 3],
    };
}

async function setLootCreateRotation(pos: number[]): Promise<any> {
    return callClient('client_set_loot_create_rotation', pos);
}

async function setLootCreateHash(hash: string): Promise<any> {
    return callClient('client_set_loot_create_hash', hash);
}

// Отправляет данные на сервер для регистрации.
async function serverRegister(login: string, email: string, password: string): Promise<Result> {
    return callServer('server_register', {login, email, password});
    return { result: true, text: 'Вы успешно зарегистрировались!' };
}

// Отправляет данные на сервер для авторизации.
async function serverLogin(login: string, password: string): Promise<Result> {
    return callServer('server_login', {login, password});
    // return { result: true, text: 'Вы успешно авторизовались!' };
}

// Изменяет положение игрока на клиенте.
async function setCharacterHeading(h: number): Promise<any> {
    return callClient('client_character_set_heading', h);
}

// Меняет хар-ки лица на клиенте.
async function setCharacterFaceFeature(index: number, feature: number): Promise<any> {
    return callClient('client_character_set_face', {index, feature});
}

// Меняет пол на клиенте.
async function setCharacterGender(gender: 'male' | 'female'): Promise<any> {
    return callClient('client_character_set_gender', gender);
}

async function setCharacterHeadProp(data: HeadPropType): Promise<any> {
    return callClient('client_character_set_head_prop', data);
}

async function resetCharacter(): Promise<any> {
    return callClient('client_character_reset');
}

async function setCharacterHair(dId: number) {
    return callClient('client_character_set_hair', dId);
}

async function setCharacterCamera(coord: 'x' | 'y' | 'z', n: number) {
    return callClient('client_character_set_camera_pos', {coord, n});
}

async function setCharacterReady() {
    return callClient('client_character_ready');
}

async function setCharacterHairColor(id: number): Promise<any> {
    return callClient('client_character_set_hair_color', id);
}

async function setCharacterHeadOverlay(overlayId: number, index: number): Promise<any> {
    return callClient('client_character_set_overlay', {overlayId, index});
}

async function setCharacterEyes(val: number) {
    return callClient('client_Character_set_eyes', val);
}

async function updateCharacterCameraPosition() {
    return callClient('update_character_camera_position');
}

async function serverCheckLogin(login: string): Promise<{result: boolean; text: string}> {
    return callServer('server_check_login', login);
    return {result: false, text: 'pizda vcem'};
}

async function serverCharacterReady(data: {login: string; email: string; password: string}) {
    return callServer('server_character_ready', data);
    return { text: 'test', result: true };
}

export type CharactersDataResult = {
    maxCharacters: number;
    hasCharacters: number;
};

export type CharactersServerResult = {
    result: boolean; 
    text: string; 
    data: CharactersDataResult;
};

export {
    takeInventoryItemToServer,
    dropInventoryItemToServer,
    usesInventoryItemByServerId,

    lootCreate,
    setLootCreateRotation,
    setLootCreateHash,

    serverRegister,
    serverLogin,
    serverCheckLogin,
    serverCharacterReady,

    setCharacterHeading,
    setCharacterFaceFeature,
    setCharacterGender,
    setCharacterHeadProp,
    resetCharacter,
    setCharacterHair,
    setCharacterCamera,
    setCharacterReady,
    setCharacterHairColor,
    setCharacterHeadOverlay,
    setCharacterEyes,

    updateCharacterCameraPosition,
}