"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Character {
    constructor(player) {
        this.mothers = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45];
        this.fathers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44];
        this.player = player;
        const character = {
            defaultCharacter: {},
            face: [
                { index: 0, feature: -1.0 },
                { index: 1, feature: -1.0 },
                { index: 2, feature: -1.0 },
                { index: 3, feature: -1.0 },
                { index: 4, feature: -1.0 },
                { index: 5, feature: -1.0 },
                { index: 6, feature: -1.0 },
                { index: 7, feature: -1.0 },
                { index: 8, feature: -1.0 },
                { index: 9, feature: -1.0 },
                { index: 10, feature: -1.0 },
                { index: 11, feature: -1.0 },
                { index: 12, feature: -1.0 },
                { index: 13, feature: -1.0 },
                { index: 14, feature: -1.0 },
                { index: 15, feature: -1.0 },
                { index: 16, feature: -1.0 },
                { index: 17, feature: -1.0 },
                { index: 18, feature: -1.0 },
                { index: 19, feature: -1.0 },
            ],
            head: {
                mother: 21,
                father: 0,
                similarity: 0.5,
                skin: 0.5,
                p3: 0,
                p6: 0,
                p9: 0.0,
                p10: true,
            },
            hair: {
                male: 0,
                female: 0,
            },
            hairColor: 0,
            headOverlay: [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
            ],
            eyes: 0,
            gender: 'male',
        };
        this.player.customData.character = character;
        this.player.customData.character.defaultCharacter = JSON.parse(JSON.stringify(character));
    }
    setEyeColor(val) {
        val = this.range(val, 0, 31);
        this.player.setEyeColor(val);
        this.player.customData.character.eyes = val;
    }
    setDefaultClothes() {
        const clothes = this.player.getVariable('clothes');
        if (clothes) {
            const gender = this.player.customData.character.gender;
            this.player.setComponentVariation(1, clothes[gender][0], 0, 0);
            this.player.setComponentVariation(2, clothes[gender][1], 0, 0);
            this.player.setComponentVariation(3, clothes[gender][2], 0, 0);
            this.player.setComponentVariation(4, clothes[gender][3], 0, 0);
            this.player.setComponentVariation(5, clothes[gender][4], 0, 0);
            this.player.setComponentVariation(6, clothes[gender][5], 0, 0);
            this.player.setComponentVariation(7, clothes[gender][6], 0, 0);
            this.player.setComponentVariation(8, clothes[gender][7], 0, 0);
            this.player.setComponentVariation(9, clothes[gender][8], 0, 0);
            this.player.setComponentVariation(10, clothes[gender][9], 0, 0);
            this.player.setComponentVariation(11, clothes[gender][10], 0, 0);
        }
    }
    range(value, min, max) {
        if (value < min) {
            value = min;
        }
        if (value > max) {
            value = max;
        }
        return value;
    }
    ;
    setHeadOverlay(overlayId, index) {
        if (index === 0)
            index = 255;
        this.player.setHeadOverlay(overlayId, index, 100, 0, 0);
        this.player.customData.character.headOverlay[overlayId] = index;
    }
    setHairColor(id) {
        const character = this.player.customData.character;
        id = this.range(id, 0, 63);
        this.player.setHairColor(id, 0);
        character.hairColor = id;
    }
    setHair(dId) {
        if ([24].includes(dId))
            return;
        this.player.setComponentVariation(2, dId, 0, 0);
        this.player.customData.character.hair[this.player.customData.character.gender] = dId;
    }
    headUpdate() {
        const characterHead = this.player.customData.character.head;
        this.player.setHeadBlendData(characterHead.mother, characterHead.father, characterHead.p3, characterHead.mother, characterHead.father, characterHead.p6, characterHead.similarity, characterHead.skin, characterHead.p9, characterHead.p10);
    }
    setHeadProp({ name, val }) {
        const characterHead = this.player.customData.character.head;
        if (characterHead.hasOwnProperty(name)) {
            if (name === 'skin' || name === 'similarity') {
                val = this.range(val, 0, 1);
            }
            if (name === 'father') {
                if (this.fathers.indexOf(val) === -1) {
                    return;
                }
            }
            if (name === 'mother') {
                if (this.mothers.indexOf(val) === -1) {
                    return;
                }
            }
            characterHead[name] = val;
            this.headUpdate();
        }
        else {
            mp.gui.chat.push('setHeadProp: Такого св-ва нет');
        }
    }
    setHeading(h) {
        this.player.setHeading(h);
    }
    faceUpdate() {
        this.player.customData.character.face.forEach(face => {
            this.player.setFaceFeature(face.index, face.feature);
        });
    }
    setFace(index, feature) {
        if (isNaN(index) || typeof index !== 'number' || isNaN(feature) || typeof feature !== 'number') {
            return mp.gui.chat.push('setFace - index и feature должны быть числом.');
        }
        if (!Number.isInteger(index)) {
            return mp.gui.chat.push('setFace - index должен быть целым числом.');
        }
        index = this.range(index, 0, 19);
        feature = this.range(feature, -1, 1);
        this.player.customData.character.face[index].index = index;
        this.player.customData.character.face[index].feature = feature;
        this.player.setFaceFeature(index, feature);
    }
    setGender(gender) {
        let hash = null;
        if (gender === 'male' && this.player.model !== mp.game.joaat("mp_m_freemode_01")) {
            hash = mp.game.joaat("mp_m_freemode_01");
            this.player.model = hash;
        }
        if (gender === 'female' && this.player.model !== mp.game.joaat("mp_f_freemode_01")) {
            hash = mp.game.joaat("mp_f_freemode_01");
            this.player.model = mp.game.joaat("mp_f_freemode_01");
        }
        this.player.customData.character.gender = gender;
        this.faceUpdate();
        this.headUpdate();
        this.setDefaultClothes();
    }
    reset() {
        const defaultCharacter = this.player.customData.character.defaultCharacter;
        const characterHead = defaultCharacter.head;
        const headOverlay = defaultCharacter.headOverlay;
        this.setGender('male');
        this.setHair(0);
        this.setHairColor(0);
        this.setEyeColor(0);
        headOverlay.forEach((i, id) => {
            this.setHeadOverlay(id, 255);
        });
        defaultCharacter.face.forEach(face => {
            this.player.setFaceFeature(face.index, face.feature);
        });
        this.player.setHeadBlendData(characterHead.mother, characterHead.father, characterHead.p3, characterHead.mother, characterHead.father, characterHead.p6, characterHead.similarity, characterHead.skin, characterHead.p9, characterHead.p10);
        this.player.customData.character = JSON.parse(JSON.stringify(defaultCharacter));
        this.player.customData.character.defaultCharacter = JSON.parse(JSON.stringify(defaultCharacter));
    }
    getCharacterDataForServer() {
        const character = this.player.customData.character;
        const gender = character.gender;
        const face = character.face;
        const headblend = [
            character.head.mother,
            character.head.father,
            character.head.p3,
            character.head.mother,
            character.head.father,
            character.head.p6,
            character.head.similarity,
            character.head.skin,
            character.head.p9,
            character.head.p10,
        ];
        const headoverlay = character.headOverlay;
        const eyescolor = character.eyes;
        const hair = character.hair[character.gender];
        const haircolor = character.hairColor;
        return { gender, face, headblend, hair, haircolor, headoverlay, eyescolor };
    }
}
const character = new Character(mp.players.local);
exports.character = character;
