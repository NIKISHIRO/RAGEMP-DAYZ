import { CallRPC } from "../CallRPC";
import { postgres } from "../db";
import { PlayerData, CharacterPlayerData } from "../types";
import { Player } from "../player/Player";
import bcrypt from 'bcryptjs';
import { Character } from "../character/Character";
import { pluralize } from "mongoose";

class Auth {
    player: PlayerMp;

    constructor(player: PlayerMp) {
        this.player = player;
    }

    static checkAuth(player): boolean {
        const isAuth = player.getVariable('isAuth');
        !isAuth && player.outputChatBox('!{#ff0000} вы не авторизованы!');
        console.log('checkAuth', isAuth);
        return !!isAuth;
    }

    // Проверяет есть ли игрок с указанным ником.
    public async checkLogin(login: string) {
        const data = await postgres<PlayerData>('players').select('*').where({ login });

        console.log('data', data);

        if (!data.length) {
            return { result: true };
        } else {
            return { result: false, text: 'Такой ник уже занят.' };
        }
    }

    // Регистрация игрока в бд.
    public async register(login: string, email: string, password: string) {
        if (Auth.checkAuth(this.player)) return;
    
        const callRPC = new CallRPC(this.player);
        const loginRegular = /^[a-zA-Z0-9_-]{3,16}$/;
        const passwordRegular = /[0-9a-zA-Z!@#$%^&*]{6,30}/;
        const emailRegular = /.+@.+\..+/i;

        if (!loginRegular.test(login)) {
            this.player.outputChatBox('!{#ff0000}Логин должен быть от 3 до 16 символов. Латинские буквы, цифры.');
            return { result: false, text: 'Логин должен быть от 3 до 16 символов. Латинские буквы, цифры.' };
        }

        if (!emailRegular.test(email)) {
            this.player.outputChatBox('!{#ff0000}Не корректное мыло.');
            return { result: false, text: 'Не корректное мыло.' };
        }

        if (!passwordRegular.test(password)) {
            this.player.outputChatBox('!{ff0000}Пароль должен содержать мин. 1 заглавную букву, цифру, специальный символ. Размер 6 до 30 символов.')
            return { result: false, text: 'Не корректное мыло.' };
        }

        const findUser = await postgres<PlayerData>('players').select('*').where({ login });

        if (findUser.length) {
            this.player.outputChatBox('!{ff0000}Игрок с таким логином уже зарегистрирован!')
            return { result: false, text: 'Логин должен быть от 3 до 16 символов. Латинские буквы, цифры.' };
        }
        
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                this.player.outputChatBox('!{ff0000}Ошибка!')
                return console.log(err);
            }

            // Получаем данные с клиента о кастомизации.
            const characterData: CharacterPlayerData = await callRPC.clientCharacterReady(); // Получает данные с клиента после кастомизации и регистрации.
            const clothes = this.player.getVariable('clothes')[characterData.gender]; // Берет данные скина по гендеру.
            clothes[1] = characterData.hair;
            characterData.clothes = clothes;

            // Добавление пользователя в БД.
            await postgres<PlayerData>('players').insert({ 
                login: login,
                email: email,
                passwordHash: hash,
                inventory: [],
                face: characterData.face,
                gender: characterData.gender,
                headblend: characterData.headblend,
                clothes: characterData.clothes,
                headoverlay: characterData.headoverlay,
                eyescolor: characterData.eyescolor,
                haircolor: characterData.haircolor,
                hair: characterData.hair,
            });

            this.player.name = login;
            this.player.setVariable('isAuth', true);
            this.player.setVariable('gender', characterData.gender);

            const character = new Character(this.player);
            character.characterInit(characterData);
            const plr = new Player(this.player);
            plr.spawnRandomCoords();
            
            // Отправляет на клиент инфу что игрок ввел данные для регистрации.
            callRPC.clientAfterRegisterInit();
 
            this.player.outputChatBox('!{00ff00}Вы успешно зарегистрировались!');
 
            return { result: true, text: 'Вы успешно зарегистрировались' };
        });
    }

    // Авторизация игрока в бд.
    public async login(login: string, password: string) {
        if (Auth.checkAuth(this.player)) return;

        const data = await postgres<PlayerData>('players').select('*').where({ login });
        const character = new Character(this.player);
        
        if (!data.length) {
            this.player.outputChatBox('!{#ff0000}Не верный логин/пароль!');
            return { result: false, text: 'Не верный логин/пароль!!' };
        }

        const plrData = data[0];
        const compareResult = await bcrypt.compare(password, plrData.passwordHash);
        
        if (compareResult) {
            const callRPC = new CallRPC(this.player);
            const plr = new Player(this.player);
            let pos = plrData.position;

            console.log('login plrData', plrData);

            // Инициализация переменных.
            plr.init();
            this.player.setVariable('admin', plrData.admin);
            this.player.setVariable('isAuth', true);
            this.player.setVariable('gender', plrData.gender);
            this.player.setVariable('temperature', plrData.temperature);
            this.player.setVariable('dehydration', plrData.dehydration);
            this.player.setVariable('hunger', plrData.hunger);
            this.player.name = login;
            this.player.health = plrData.health;
            this.player.armour = plrData.armor;
            if (!pos) pos = {x: 111, y: 111, z: 111};
            this.player.position = new mp.Vector3(pos.x, pos.y, pos.z);

            // Отправка на клиент инфы что игрок прошел авторизацию.
            callRPC.clientAfterLoginInit();

            // Инициализация внешности перса.
            character.characterInit({
                hair: plrData.hair,
                haircolor: plrData.haircolor,
                face: plrData.face,
                eyescolor: plrData.eyescolor,
                gender: plrData.gender,
                headblend: plrData.headblend,
                headoverlay: plrData.headoverlay,
                clothes: plrData.clothes,
            });

            this.player.outputChatBox(`!{#00ff00} Вы успешно авторизовались!`);
            return { result: true, text: 'Вы успешно авторизовались!' };
        } else {
            this.player.outputChatBox('!{#ff0000}Не верный логин/пароль!');
            return { result: true, text: 'Не верный логин/пароль!!' };
        }
    }

    public async logout() {
        if (!Auth.checkAuth(this.player)) return;

        const callRPC = new CallRPC(this.player);
        const character = new Character(this.player);
        console.log('getClothes', character.getClothes());

        let hunger = this.player.getVariable('hunger');
        if (typeof hunger !== 'number') hunger = 0;

        let dehydration = this.player.getVariable('dehydration');
        if (typeof dehydration !== 'number') dehydration = 0;

        let temperature = this.player.getVariable('temperature');
        if (typeof temperature !== 'number') temperature = 0;

        const result = await postgres<PlayerData>('players')
            .where({login: this.player.name})
            .update({
                position: this.player.position,
                health: this.player.health,
                armor: this.player.armour,
                hunger,
                dehydration,
                temperature,
                clothes: character.getClothes(),
            })
            .catch(e => console.log(e));

        console.log('result', result);
    }
}

export {
    Auth,
}