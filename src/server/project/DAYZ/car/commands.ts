import vehicleCoords from './vehicleCoords.json';
import { Car } from "./Car";
import { Player } from '../player/Player.js';
import { ReturnInformation } from "project/interfaces";
import fs from 'fs';

mp.events.addCommand('savecar', (player:PlayerMp,ft: string, hash: string, x: string, y:string, z:string, description: string) => {
    if(!ft || !hash) return player.outputChatBox('/savecar hash x y z')
    if(!x) x = player.position.x.toString();
    if(!y) y = player.position.y.toString();
    if(!z) z = player.position.z.toString();

    const returnInformation: ReturnInformation = Car.saveCar(hash, // Название машины
                                                            new mp.Vector3(parseInt(x), parseInt(y), parseInt(z)), // Позиция машины x,y,z
                                                            description); // описание машины;

    if (returnInformation.result) {
        player.outputChatBox(`!{#97CC24}${returnInformation.info}`);
    } else {
        player.outputChatBox(`!{#BC3C00}${returnInformation.info}`);
    }
});

mp.events.addCommand('sc', () => {

    const path: string = "src/server/project/DAYZ/car/vehicleCoords.json";

    fs.readFile(path, 'utf-8', (err: any, result: any) => {
        if(err) return console.log(err)
        let objFile = JSON.parse(result);
        objFile.forEach(car => {
            Car.spawnCar(car.hash, 
                        new mp.Vector3(car.position.x, car.position.y, car.position.z),
                        new mp.Vector3(car.rotation.x, car.rotation.y, car.rotation.z),
                        [car.color[0], car.color[1], car.color[2], car.color[3], car.color[4], car.color[5]]);
        })
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
