
import { Car } from "./Car";

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

mp.events.addCommand('sc', () => {
        Car.spawnCar();
});
