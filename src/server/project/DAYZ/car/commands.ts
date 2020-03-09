import vehicleCoords from './vehicleCoords.json';
import { Car } from "./Car";
import { Player } from '../player/Player.js';
import { ReturnInformation } from "../interfaces";
import fs from 'fs';
import {VehicleSpawn} from '../db/schema';

mp.events.addCommand('savecar', (player:PlayerMp,ft: string, hash: string, x: string, y:string, z:string, description: string, rx:string, ry:string, rz:string, c0:string, c1:string, c2:string, c3:string, c4:string, c5:string) => {
    if(!ft || !hash) return player.outputChatBox('/savecar hash x y z')
    if(!x) x = player.position.x.toString();
    if(!y) y = player.position.y.toString();
    if(!z) z = player.position.z.toString();

    const returnInformation: ReturnInformation = Car.saveCar(hash, // Название машины
                                                            new mp.Vector3(parseInt(x), parseInt(y), parseInt(z)), // Позиция машины x,y,z
                                                            new mp.Vector3(parseInt(rx), parseInt(ry), parseInt(rz)),// Угол машины
                                                            [c0, c1, c2, c3, c4, c5].map(n => parseInt(n)), // цвет машины
                                                            description); // описание машины;
x
    if (returnInformation.result) {
        player.outputChatBox(`!{#97CC24}${returnInformation.info}`);
    } else {
        player.outputChatBox(`!{#BC3C00}${returnInformation.info}`);
    }
});

mp.events.addCommand('vehicles', (player:PlayerMp) => {
    var vehicle = mp.vehicles.new(989294410, player.position); //Spawns Voltic2 at 'player' position
    vehicle.explode();
    console.log(mp.vehicles)
})

mp.events.addCommand("weapon", (player:PlayerMp, fullText: string, weapon:string, ammo:string) => {
    let weaponHash = mp.joaat(weapon);
    player.giveWeapon(weaponHash, parseInt(ammo) || 10000);
});

mp.events.addCommand('explode', (player:PlayerMp) => {
    let car = Car.getCar(player, 10)
    car.forEach(elem => {
        elem.explode();
    })
})

mp.events.addCommand('sc', () => {
    VehicleSpawn.find({},'_id color hash description position rotation isExplode', function(err, veh){
        if(err) console.log(err)
        veh.forEach(car => {
            if(car.isExplode) return
            Car.spawnCar(car.hash, 
                new mp.Vector3(car.position.x, car.position.y, car.position.z),
                new mp.Vector3(car.rotation.x, car.rotation.y, car.rotation.z),
                [car.color[0],car.color[1],car.color[2],car.color[3],car.color[4],car.color[5]]
                );
        });
    })
});

mp.events.addCommand('carput', (player:PlayerMp,ft: string, index:string, amount:string) =>{
    if(!ft || !index || !amount) return player.outputChatBox('/carput index amount')

    let car = Car.arrayCars(player)[0].objCar;
    const returnInformation: ReturnInformation = Player.putItemCar(player, car, parseInt(index), parseInt(amount));

    if (returnInformation.result) {
        player.outputChatBox(`!{#97CC24}${returnInformation.info}`);
    } else {
        player.outputChatBox(`!{#BC3C00}${returnInformation.info}`);
    }

    console.log('Окончательный результат машины',car.getVariable('carInventory'))
    console.log('Окончательный результат игрока',player.getInventory());
})

mp.events.addCommand('cartake', (player:PlayerMp, ft:string, index:string, amount:string) =>{
    if(!ft || !index || !amount) return player.outputChatBox('/cartake index amount')

    let car = Car.arrayCars(player)[0].objCar;
    const returnInformation: ReturnInformation = Player.takeItemCar(player, car, parseInt(index), parseInt(amount));

    if (returnInformation.result) {
        player.outputChatBox(`!{#97CC24}${returnInformation.info}`);
    } else {
        player.outputChatBox(`!{#BC3C00}${returnInformation.info}`);
    }

    console.log('Окончательный результат машины',car.getVariable('carInventory'));
    console.log('Окончательный результат игрока',player.getInventory());
})
