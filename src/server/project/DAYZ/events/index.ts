import { causesOfDeath } from "../causesOfDeath";
import { Player } from "../player/Player";
import { CallRPC } from "../CallRPC";
import { Character } from "../character/Character";
import { Auth } from "../auth/Auth";

export const events = {
    "playerReady": (player: PlayerMp) => {
        console.log(`[${player.name}]: скачал ресурсы.`);
    },

    "playerJoin": (player: PlayerMp) => {
        const plr = new Player(player);
        const cef = new CallRPC(player);
        
        const character = new Character(player);

        console.log(`${player.name}: Зашел на сервер.`);
        mp.players.broadcast(`!{#666666}${player.name}: Зашел на сервер.`);

        // Установка всех дефолтных св-в игроку.
        plr.init();

        // Устанавливает св-ва игроку для авторизации. Отключает чат, курсор, худы и т.д.
        cef.clientBeforeAuthInit();
    },

    "playerSpawn": (player: PlayerMp) => {
    },

    "playerQuit": (player: PlayerMp, exitType: any, reason: any) => {
        const plr = new Player(player);
        const auth = new Auth(player);
        auth.logout();
        console.log('logout');
    },

    "playerDeath": (player: PlayerMp, reason: number) => {
        if (causesOfDeath.hasOwnProperty(reason)) {
            mp.players.forEach(p => p.notify(`<font color="#00D4FF">${player.name}</font> умер по причине: <font color="#FA00FF">${causesOfDeath[reason]}</font>.`))
        }
        
        const character = new Character(player);
        character.setFullClothes(player.getVariable('clothes')[player.getVariable('gender')]);
        
        const plr = new Player(player);
        // plr.death();
        plr.spawnRandomCoords();
    },
}