import vehicleCoords from './vehicleCoords.json';
import { Car } from "./Car";
import { Item } from '../types';

mp.events.addCommand('pos', () => {
    Car.saveCar("turismor", new mp.Vector3(111,111,111), new mp.Vector3(0,0,111), [255,255,255,0,0,0], 'spawn tachka');
});

mp.events.addCommand('sc', () => {
    const items: Item[] = [];
    vehicleCoords.forEach(car => {
        let carObj = Car.spawnCar(car.hash, new mp.Vector3(car.position.x, car.position.y, car.position.z), new mp.Vector3(car.rotation.x, car.rotation.y, car.rotation.z),[car.color[0], car.color[1], car.color[2], car.color[3], car.color[4], car.color[5]]);
        carObj.setVariable('carInventory', items);
    })
});

mp.events.addCommand('carput', (player:PlayerMp) =>{
    let car = Car.arrayCars(player)[0].objCar;
    console.log(car.getVariable('carInventory'))
    Car.putItem(player, car,0)
})

mp.events.addCommand('tp', (player: PlayerMp, ft, x: string, y: string, z: string) => {
    player.position = new mp.Vector3(parseInt(x), parseInt(y), parseInt(z));

});