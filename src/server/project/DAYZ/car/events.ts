import { Car } from "./Car";

// Массив обьектов машин с ключами сортированными по дистанции от меньшего к большему
mp.events.add('car', (p: PlayerMp) => {
    console.log(Car.arrayCars(p));
})