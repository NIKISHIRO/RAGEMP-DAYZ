import { causesOfDeath } from "../causesOfDeath";

export const events = {
    "playerJoin": (player: PlayerMp) => {
        player.spawn(new mp.Vector3(111, 111, 111));
        console.log(`${player.name}: Зашел на сервер.`);
    },
    /////////////////////////////////////////////////////////////////
    "playerDeath": (player: PlayerMp, reason: number) => {
        if (causesOfDeath.hasOwnProperty(reason)) {
            mp.players.forEach(player => player.notify(`<font color="#00D4FF">${player.name}</font> умер по причине: <font color="#FA00FF">${causesOfDeath[reason]}</font>.`))
        }    
    
        player.spawn(new mp.Vector3(111, 111, 111));
    },
    /////////////////////////////////////////////////////////////////
    "keypress:G": (player: PlayerMp) => {
        player.outputChatBox('-> G');
        
        const vehicles: VehicleMp[] = [];

        mp.vehicles.forEachInRange(player.position, 5,
            (vehicle) => {
                vehicles.push(vehicle);
            }
        );
        
        console.log('vehicles');
        player.outputChatBox(vehicles.length.toString());

        if (!vehicles.length) {
            player.outputChatBox('Около вас нет машины!');
            return;
        }

        const currentVeh = vehicles[0];
        const vehInventory = currentVeh.getVariable('vehInventory');
    },
/////////////////////////////////////////////////////////////////
};