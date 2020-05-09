import { Car } from "./Car";

mp.events.add("vehicleDamage", (vehicle, bodyHealthLoss, engineHealthLoss) => {
    console.log(vehicle.bodyHealth);
    console.log(bodyHealthLoss);
    console.log(engineHealthLoss)
});

mp.events.add("vehicleDeath", (vehicle: VehicleMp) => {
    let id = vehicle.getVariable('id')
    Car.respawnVehicle(id);
    setTimeout(() => {
        vehicle.destroy()
    }, 10000)
})
