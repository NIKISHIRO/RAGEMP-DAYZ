type Face = { 
    index: number; 
    feature: number 
};

type Head = {
    mother: number;
    father: number;
    similarity: number;
    skin: number;

    p3?: number;
    p6?: number;
    p9?: number;
    p10?: boolean;
};

type CharacterType = {
    defaultCharacter: any;
    gender: 'male' | 'female';
    face: Face[];
    head: Head;
    headOverlay: number[];
    eyes: number;
    hair: {
        female: number;
        male: number;
    };
    hairColor: number;
};

export type HeadPropType = {name: 'mother' | 'father' | 'skin' | 'similarity', val: number};

class Character {
    private player: PlayerMp;
    
    private mothers = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45];
    private fathers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44];

    constructor(player: PlayerMp) {
        this.player = player;

        const character: CharacterType = {
            defaultCharacter: {},
            // index 0 - 19; feature -1.0 to 1.0;
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
                mother: 21, // 21-40, 41, 45;
                father: 0, // 0-20, 42-44;
                similarity: 0.5, // 0.0 - 1.0;
                skin: 0.5, // 0.0 - 1.0;

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
                0, // 0-23
                0, // 0-28
                0, // 0-33
                0, // 0-14
                0, // 0-74
                0, // 0-6
                0, // 0-11
                0, // 0-10
                0, // 0-9
                0, // 0-17
                0, // 0-16
                0, // 0-11
                0, // 0-1
            ],
            eyes: 0, // 0 - 31;
            gender: 'male', // hash.
        }

        this.player.customData.character = character;
        this.player.customData.character.defaultCharacter = JSON.parse(JSON.stringify(character));
    }
    
    public setEyeColor(val: number) {
        val = this.range(val, 0, 31);
        this.player.setEyeColor(val);
        this.player.customData.character.eyes = val;
    }

    // Устанавливает дефолтную внешность персонажу.
    public setDefaultClothes() {
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

    // устанавливает число в пределах min - max.
    private range(value: number, min: number, max: number) {
        if (value < min) {
            value = min;
        }
        if (value > max) {
            value = max;
        }
        return value;
    };

    public setHeadOverlay(overlayId: number, index: number) {
        if (index === 0) index = 255;
        this.player.setHeadOverlay(overlayId, index, 100, 0, 0);
        this.player.customData.character.headOverlay[overlayId] = index;
    }

    public setHairColor(id: number) {
        const character: CharacterType = this.player.customData.character;
        id = this.range(id, 0, 63);
        this.player.setHairColor(id, 0);
        character.hairColor = id;
    }

    public setHair(dId: number) {
        if ([24].includes(dId)) return;
        this.player.setComponentVariation(2, dId, 0, 0);
        this.player.customData.character.hair[this.player.customData.character.gender] = dId;
    }

    public headUpdate() {
        const characterHead: Head = this.player.customData.character.head;
        this.player.setHeadBlendData(
            characterHead.mother,
            characterHead.father,
            characterHead.p3,

            characterHead.mother,
            characterHead.father,
            characterHead.p6,
            
            characterHead.similarity,
            characterHead.skin,
            characterHead.p9,

            characterHead.p10
        );
    }

    // Меняет св-во head и обновляет его.
    public setHeadProp({ name, val }: HeadPropType) {
        const characterHead: Head = this.player.customData.character.head;
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
        } else {
            mp.gui.chat.push('setHeadProp: Такого св-ва нет');
        }
    }

    public setHeading(h: number) {
        this.player.setHeading(h);
    }

    public faceUpdate() {
        this.player.customData.character.face.forEach(face => {
            this.player.setFaceFeature(face.index, face.feature);
        });
    }

    public setFace(index: number, feature: number) {
        if (isNaN(index) || typeof index !== 'number' || isNaN(feature) || typeof feature !== 'number') {
            return mp.gui.chat.push('setFace - index и feature должны быть числом.');
        }

        if (!Number.isInteger(index)) {
            return mp.gui.chat.push('setFace - index должен быть целым числом.');
        }

        index = this.range(index, 0, 19);
        feature = this.range(feature, -1, 1);
        
        // Сохраняет данные.
        this.player.customData.character.face[index].index = index;
        this.player.customData.character.face[index].feature = feature;
        // Устанавливает.
        this.player.setFaceFeature(index, feature);
    }

    // Устанавливает муж. или жен. модель игроку.
    public setGender(gender: 'male' | 'female') {
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

    // Сброс всех настроек персонажа.
    public reset() {
        const defaultCharacter: CharacterType = this.player.customData.character.defaultCharacter;
        const characterHead = defaultCharacter.head;
        const headOverlay = defaultCharacter.headOverlay;

        // Сброс гендера, волос, цвета волос, цвета глаз.
        this.setGender('male');
        this.setHair(0);
        this.setHairColor(0);
        this.setEyeColor(0);


        // Сброс headOverlay.
        headOverlay.forEach((i, id) => {
            this.setHeadOverlay(id, 255);
        });

        // Сброс лица.
        defaultCharacter.face.forEach(face => {
            this.player.setFaceFeature(face.index, face.feature);
        });

        // Сброс внешности.
        this.player.setHeadBlendData(
            characterHead.mother,
            characterHead.father,
            characterHead.p3,
            characterHead.mother,
            characterHead.father,
            characterHead.p6,
            characterHead.similarity,
            characterHead.skin,
            characterHead.p9,
            characterHead.p10,
        );
        
        
        this.player.customData.character = JSON.parse(JSON.stringify(defaultCharacter));
        this.player.customData.character.defaultCharacter = JSON.parse(JSON.stringify(defaultCharacter));
    }

    // Собирает данные для отправки на сервер.
    public getCharacterDataForServer(): CharacterData {
        const character: CharacterType = this.player.customData.character; 
        
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

type CharacterData = {
    gender: 'male' | 'female';
    face: { index: number; feature: number; }[];
    headblend: any[]; // headblend.
    headoverlay: number[];
    hair: number;
    haircolor: number;
    eyescolor: number;
};

const character = new Character(mp.players.local);

export {
    character,
}