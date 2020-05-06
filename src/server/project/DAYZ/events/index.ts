import { causesOfDeath } from "../causesOfDeath";
import { Player } from "../player/Player";
import { CEF } from "../CEF";
import { Car } from "../car/Car";

export const events = {
    "playerJoin": (player: PlayerMp) => {
        const plr = new Player(player);
        const cef = new CEF(player);

        console.log(`${player.name}: Зашел на сервер.`);
        mp.players.broadcast(`!{#666666}${player.name}: Зашел на сервер.`);
        // Установка всех дефолтных св-в игроку.
        plr.init();
        // Выключает худы.
        plr.setDisplayUI('huds', false);
        // Устанавливает св-ва игроку для авторизации. Отключает чат, курсор, худы и т.д.
        cef.clientBeforeAuthInit();
    },

    "playerSpawn": (player: PlayerMp) => {
        // Торс.
        player.changeClothes(3, 15, 0, true);
        // Ноги.
        player.changeClothes(4, 14, 0, true);
    },

    "playerQuit": (player: PlayerMp, exitType: any, reason: any) => {
        const plr = new Player(player);
        plr.logout();
    },

    "playerDeath": (player: PlayerMp, reason: number) => {
        if (causesOfDeath.hasOwnProperty(reason)) {
            mp.players.forEach(p => p.notify(`<font color="#00D4FF">${player.name}</font> умер по причине: <font color="#FA00FF">${causesOfDeath[reason]}</font>.`))
        }
                
        const plr = new Player(player);
        plr.spawnRandomCoords();
    },

    "keypress:G": (player: PlayerMp) => {
        player.outputChatBox('-> G');
        
        const vehicles: VehicleMp[] = [];
        mp.vehicles.forEachInRange(player.position, 5,
            (vehicle) => {
                vehicles.push(vehicle);
            }
        );
        
        player.outputChatBox(vehicles.length.toString());

        if (!vehicles.length) {
            player.outputChatBox('Около вас нет машины!');
            return;
        }

        const currentVeh = vehicles[0];
        const vehInventory = currentVeh.getVariable('vehInventory');
    }
}