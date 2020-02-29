import vehicleCoords from './vehicleCoords.json';
import { Car } from "./Car";

mp.events.addCommand('savecar', (player:PlayerMp,ft: string, hash: string, x: string, y:string, z:string, rx:string, ry:string, rz: string) => {
    if(!ft || !x || !y || !z) return player.outputChatBox('/savecar hash x y z')
    if(rx || ry || rz) return  Car.saveCar(hash, new mp.Vector3(parseInt(x), parseInt(y), parseInt(z)), new mp.Vector3(parseInt(rx), parseInt(ry), parseInt(rz)));
    Car.saveCar(hash, new mp.Vector3(parseInt(x), parseInt(y), parseInt(z)));
});

mp.events.addCommand('sc', () => {
    const items: Item[] = [];
    vehicleCoords.forEach(car => {
        if(car.isExplode){
            let carObj = Car.spawnCar(car.hash, new mp.Vector3(car.position.x, car.position.y, car.position.z), new mp.Vector3(car.rotation.x, car.rotation.y, car.rotation.z),[car.color[0], car.color[1], car.color[2], car.color[3], car.color[4], car.color[5]]);
            carObj.setVariable('carInventory', items);
            car.isExplode = false;
        }
    })
});

mp.events.addCommand('carput', (player:PlayerMp) =>{
    let car = Car.arrayCars(player)[0].objCar;
    Car.putItemInCar(player, car,0)
    console.log(car.getVariable('carInventory'))
})

mp.events.addCommand('cartake', (player:PlayerMp) =>{
    let car = Car.arrayCars(player)[0].objCar;
    car.setVariable('carInventory',Car.takeItemInCar(player, car,0));
    console.log(car.getVariable('carInventory'))
})
