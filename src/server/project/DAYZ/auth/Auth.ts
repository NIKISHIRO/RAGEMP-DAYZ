import { CallRPC } from "../CallRPC";
import { postgres } from "../db";
import { PlayerData, CharacterClientData } from "../types";
import { CharacterPlayerData, Player } from "../player/Player";
import bcrypt from 'bcryptjs';

class Auth {
    player: PlayerMp;
    playerInstance: Player;

    constructor(player: PlayerMp) {
        const plr = new Player(player);
        this.player = player;
        this.playerInstance = plr;
    }

    // Регистрация игрока в бд.
    public async register(login: string, email: string, password: string) {
        const cef = new CallRPC(this.player);
        const loginRegular = /^[a-zA-Z0-9_-]{3,16}$/;
        const passwordRegular = /[0-9a-zA-Z!@#$%^&*]{6,30}/;
        const emailRegular = /.+@.+\..+/i;

        if (!loginRegular.test(login)) {
            return this.player.outputChatBox('!{#ff0000}Логин должен быть от 3 до 16 символов. Латинские буквы, цифры.');
        }

        if (!emailRegular.test(email)) {
            return this.player.outputChatBox('Не корректное мыло.')
        }

        if (!passwordRegular.test(password)) {
            return this.player.outputChatBox('!{ff0000}Пароль должен содержать мин. 1 заглавную букву, цифру, специальный символ. Размер 6 до 30 символов.')
        }

        const findUser = await postgres<PlayerData>('players').select('*').where({login});

        if (findUser.length) {
            return this.player.outputChatBox('!{ff0000}Игрок с таким логином уже зарегистрирован!')
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return console.log(err);
            }

            // Получаем данные с клиента о кастомизации.
            const { hair, face, gender, headArray, headOverlay, eyesColor, hairColor }: CharacterClientData = await cef.clientCharacterReady(); // Получает данные с клиента после кастомизации и регистрации.
            const clothes = this.player.getVariable('clothes')[gender]; // Берет данные скина по гендеру.
            
            // Установка волос с клиента.
            clothes[1] = hair;

            // Добавление пользователя в БД.
            await postgres<PlayerData>('players').insert({ 
                login: login,
                email: email,
                passwordHash: hash,
                face: face,
                gender: gender,
                headblend: headArray,
                clothes: clothes,
                headoverlay: headOverlay,
                eyescolor: eyesColor,
                haircolor: hairColor,
                inventory: [],
            });

            this.player.outputChatBox('!{00ff00}Вы успешно зарегистрировались!');
            
            // Установка персонажа после регистрации.
            const characterPlayerData: CharacterPlayerData = { 
                gender, 
                face, 
                clothes, 
                headblend: headArray, 
                eyescolor: eyesColor, 
                headoverlay: headOverlay,
                haircolor: hairColor, 
            };

            this.playerInstance.characterInit(characterPlayerData);
            
            // Инициал. св-в после регистра.
            this.playerInstance.registerInit();

            // Отправляет на клиент инфу что игрок залогинился.
            cef.clientAfterLoginInit();
        });
    }

    // Авторизация игрока в бд.
    public async login(login: string, password: string) {
        const data = await postgres<PlayerData>('players').select('*').where({ login });

        console.log(data);

        if (!data.length) {
            return this.player.outputChatBox('!{#ff0000}Не верный логин/пароль!');
        }

        const plrData = data[0];
        const compareResult = await bcrypt.compare(password, plrData.passwordHash)
        
        if (compareResult) {
            this.player.outputChatBox(`!{#00ff00} Вы успешно авторизовались!`);
            this.playerInstance.loginInit(plrData);
        } else {
            return this.player.outputChatBox('!{#ff0000}Не верный логин/пароль!');
        }
    }
}

export {
    Auth,
}