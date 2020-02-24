import vehicleCoords from './vehicleCoords.json';
import { Car } from "./Car";

mp.events.addCommand('pos', () => {
    Car.saveCar("turismor", new mp.Vector3(111,111,111), new mp.Vector3(0,0,111), [255,255,255,0,0,0], 'spawn tachka');
});

mp.events.addCommand('sc', () => {
    vehicleCoords.forEach(car =>{
        Car.spawnCar(car.hash, new mp.Vector3(car.position.x,car.position.y,car.position.z), new mp.Vector3(car.rotation.x,car.rotation.y,car.rotation.z),[car.color[0],car.color[1],car.color[2],car.color[3],car.color[4],car.color[5]]);
    })
});

let carobj = Car.spawnCar('turismor', new mp.Vector3(111, 111, 111));

mp.events.addCommand('carobj', () => {
    console.log(carobj);
});

mp.events.addCommand('carexplode', () => {
    carobj.explode();
});

mp.events.addCommand('cardestroy', () => {
    carobj.explode();
});