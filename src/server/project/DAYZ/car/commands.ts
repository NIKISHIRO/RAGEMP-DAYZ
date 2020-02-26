import vehicleCoords from './vehicleCoords.json';
import { Car } from "./Car";

mp.events.addCommand('pos', () => {
    Car.saveCar("turismor", new mp.Vector3(111,111,111), new mp.Vector3(0,0,111), [255,255,255,0,0,0], 'spawn tachka');
});

mp.events.addCommand('sc', () => {
const items: Item[] = [
    {
        key: 'item_ak47Ammo',
        amount: 1
    }
];
    vehicleCoords.forEach(car =>{
        Car.spawnCar(car.hash, new mp.Vector3(car.position.x,car.position.y,car.position.z), new mp.Vector3(car.rotation.x,car.rotation.y,car.rotation.z),[car.color[0],car.color[1],car.color[2],car.color[3],car.color[4],car.color[5]])
        .setVariable('carInventory', items);
    })
});


mp.events.addCommand('carobj', () => {
});

mp.events.addCommand('carexplode', () => {

});

mp.events.addCommand('cardestroy', () => {

});

mp.events.addCommand('carloot',(p:PlayerMp)=>{

})

mp.events.addCommand('carinv',(p:PlayerMp)=>{
    const vehicles: any[] = [];
    let car = Car.getCar(p);
    car.forEach((elem, i) => {
            vehicles.push(elem.getVariable('carInventory'))
            p.outputChatBox('Инвентарь: ')
            p.outputChatBox('Вам доступен инвентарь машины');
    });
})