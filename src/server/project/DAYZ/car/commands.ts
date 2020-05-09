
import { Car } from "./Car";
import { Player } from '../player/Player.js';

mp.events.addCommand('savecar', (player:PlayerMp,ft: string, hash: string, x: string, y:string, z:string, description: string, rx:string, ry:string, rz:string, c0:string, c1:string, c2:string, c3:string, c4:string, c5:string) => {
    if(!ft || !hash) return player.outputChatBox('/savecar hash x y z')
    if(!x) x = player.position.x.toString();
    if(!y) y = player.position.y.toString();
    if(!z) z = player.position.z.toString();
    console.log(x,y,z)

    Car.saveCar(player,
        hash, // Название машины
        new mp.Vector3(parseInt(x), parseInt(y), parseInt(z)), // Позиция машины x,y,z
        new mp.Vector3(parseInt(rx), parseInt(ry), parseInt(rz)),// Угол машины
        [c0, c1, c2, c3, c4, c5].map(n => parseInt(n)), // цвет машины
        description); // описание машины;
});

mp.events.addCommand('updCar', (player:PlayerMp) => {
    mp.vehicles.forEach(veh => {
        let id = veh.getVariable('id');
        let color: number[] = []
        
        veh.getColorRGB(0).map((first) => {
            color.push(first)
        })
        veh.getColorRGB(1).map((second) => {
            color.push(second)
        })

        Car.updateCar(id, veh.position, veh.rotation, color)
    })
})

mp.events.addCommand("weapon", (player:PlayerMp, fullText: string, weapon:string, ammo:string) => {
    let weaponHash = mp.joaat(weapon);
    player.giveWeapon(weaponHash, parseInt(ammo) || 10000);
});

mp.events.addCommand('explode', (player:PlayerMp) => {
    let car = Car.getCar(player, 100)
    car.forEach(elem => {
        elem.explode();
    })
})

mp.events.addCommand('sc', () => {
        Car.spawnCar();
});

mp.events.addCommand('carput', (player:PlayerMp,ft: string, index:string, amount:string) =>{
    if(!ft || !index || !amount) return player.outputChatBox('/carput index amount')

    const plr = new Player(player);
    let car = Car.arrayCars(player)[0].objCar;
    const returnInformation: CarReturnInformation = plr.putItemCar(car, parseInt(index), parseInt(amount));

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

    const plr = new Player(player)
    let car = Car.arrayCars(player)[0].objCar;
    const returnInformation: CarReturnInformation = plr.takeItemCar(car, parseInt(index), parseInt(amount));

    if (returnInformation.result) {
        player.outputChatBox(`!{#97CC24}${returnInformation.info}`);
    } else {
        player.outputChatBox(`!{#BC3C00}${returnInformation.info}`);
    }

    console.log('Окончательный результат машины',car.getVariable('carInventory'));
    console.log('Окончательный результат игрока',player.getInventory());
})


mp.events.addCommand('color', (player: PlayerMp,fullText:string, a:string, b: string, c:string, i:string, j: string, k:string) => {
        player.setHeadBlend(
            parseInt(a), parseInt(i), 0,
            parseInt(b), parseInt(j), 0,
            parseFloat(c), parseFloat(k), 0)
})