import { Car } from "./Car";

// Массив обьектов машин с ключами сортированными по дистанции от меньшего к большему
mp.events.add('car', (p: PlayerMp) => {
    console.log(Car.arrayCars(p));
})

mp.events.addCommand('savecar', (player:PlayerMp,ft: string, hash: string, x: string, y:string, z:string) => {
    if(!ft) return player.outputChatBox('/pos hash position{3} rotation{3}? color[6]? description?')
    Car.saveCar(hash, new mp.Vector3(parseInt(x), parseInt(y), parseInt(z)));
});