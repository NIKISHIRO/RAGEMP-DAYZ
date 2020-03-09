import { Car } from "./Car";

// Массив обьектов машин с ключами сортированными по дистанции от меньшего к большему
mp.events.add('car', (p: PlayerMp) => {
    console.log(Car.arrayCars(p));
})

mp.events.add("vehicleDamage", (vehicle, bodyHealthLoss, engineHealthLoss) => {
    console.log(vehicle.bodyHealth);
    console.log(bodyHealthLoss);
    console.log(engineHealthLoss)
});

mp.events.add("vehicleDeath", (vehicle: VehicleMp) => {
    console.log(123)
    vehicle.destroy()
})