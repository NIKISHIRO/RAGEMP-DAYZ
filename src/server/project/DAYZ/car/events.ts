import { Car } from "./Car";
import {VehicleSpawn} from '../db/schema';

mp.events.add("vehicleDamage", (vehicle, bodyHealthLoss, engineHealthLoss) => {
    console.log(vehicle.bodyHealth);
    console.log(bodyHealthLoss);
    console.log(engineHealthLoss)
});

mp.events.add("vehicleDeath", (vehicle: VehicleMp) => {
    let id = vehicle.getVariable('id')
    VehicleSpawn.find({'_id':id}, 'hash defaultPosition savePosition', (err, veh) => {
        if(err) console.log(err);
        veh.forEach((car) => {
            Car.spawnCar(car.hash, new mp.Vector3(car.defaultPosition.x, car.defaultPosition.y, car.defaultPosition.z), new mp.Vector3(NaN, NaN, NaN), [NaN, NaN, NaN, NaN, NaN, NaN], id)
            VehicleSpawn.updateMany({'_id': id}, {$set: {savePosition: car.defaultPosition}})
            .then(result => console.log(result))
            .catch(err => console.log(err))
        })
    })
    setTimeout(() => {
        vehicle.destroy()
    }, 10000)
})
