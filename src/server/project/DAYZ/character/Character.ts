import { postgres } from "../db";
import { Auth } from "../auth/Auth";
import { CharacterPlayerData } from "../types";

class Character {
    player: PlayerMp;

    constructor(player: PlayerMp) {
        this.player = player;
    }

    // ИНИЦИАЛИЗАЦИЯ ВНЕШНОСТИ ПЕРСОНАЖА. ПРИ ОШИБКЕ УСТАНАВЛИВАЕТ ДЕФОЛТ.
    public async characterInit(data: CharacterPlayerData) {
        if (!Auth.checkAuth(this.player)) return;

        let { face, headblend, gender, clothes, eyescolor, headoverlay, haircolor } = data;

        if (face === null || 
            headblend === null || 
            clothes === null || 
            gender === null || 
            headoverlay === null || 
            eyescolor === null ||
            haircolor === null) {
            console.log(`[${this.player.name}]:[characterInit]: Ошибка установления внешности.`.red);
            this.player.outputChatBox('!{ff0000}Ошибка установления кастомизации.');
            return;
        }

        const model = gender === 'male' ? mp.joaat('mp_m_freemode_01') : mp.joaat("mp_f_freemode_01");
        // Установка модели.
        this.player.model = model;
        // Установка цвета глаз.
        this.player.eyeColor = eyescolor;
        // Установка цвета волос.
        this.player.setHairColor(haircolor, 0);

        // Установка лица перса.
        data.face.forEach(i => {
            this.player.setFaceFeature(i.index, i.feature);
        });

        // Установка парам. головы.
        this.player.setHeadBlend(
            headblend[0],
            headblend[1],
            headblend[2],
            headblend[3],
            headblend[4],
            headblend[5],
            headblend[6],
            headblend[7],
            headblend[8],
        );

        headoverlay.forEach((index, overlayId) => {
            if (index === 0) index = 255;
            this.player.setHeadOverlay(overlayId, [index, 100, 0, 0]);
        });

        // Установка одежды.
        this.setFullClothes(clothes);
    }

    // drawable[].
    public setFullClothes(clothes: number[]) {
        if (!Auth.checkAuth(this.player)) return;

        console.log('setFullClothes clothes',clothes);

        if (clothes.length < 11) {
            console.log('[setFullClothes]: В массиве меньше 11 чисел!'.red);
            return;
        }

        clothes.forEach((drawable, id) => {
            if (typeof drawable !== 'number' || !Number.isInteger(drawable)) {
                console.log('[setFullClothes]: массив должен состоять из целых чисел!'.red);
                return;
            }

            this.player.changeClothes(id + 1, drawable, 0, true);
            const clothes = this.player.getVariable('clothes');
            const gender = this.player.getVariable('gender');

            clothes[gender][id] = drawable;
            this.player.setVariable('clothes', clothes);
        });
    }

    // drawable[].
    public getClothes(): number[] {
        if (!Auth.checkAuth(this.player)) return [];

        const gender = this.player.getVariable('gender');
        const clothes = this.player.getVariable('clothes');

        if (!clothes) {
            console.log('!clothes', clothes);
            return [];
        };
        if (gender == 'male' || gender == 'female') {
            return clothes[gender];
        };

        return [];
    }
}

export {
    Character,
}