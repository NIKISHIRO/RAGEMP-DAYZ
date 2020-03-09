console.log('---> Commands File.');

// import { VehicleSpawn } from "../db/schema";
import { Player } from "../player/Player";
import { VehicleSpawn, VehicleSpawnProp } from "../db/schema";
import { logger } from "../shared/logger";

mp.events.addCommand('kill', (player: PlayerMp) => {
    player.health = 0;
})

mp.events.addCommand('w', (player: PlayerMp, ft: string, hash: string, ammo: string) => {
    player.giveWeapon(mp.joaat(hash), parseInt(ammo)); // Assault Rifle, Carbine Rifle
})

mp.events.addCommand('test', () => {
    console.log('test - cmd -  - -')
    const vehicle: VehicleSpawnProp = new VehicleSpawn({
        hash: 'turismor',
        description: 'descr',
        color: [255, 255, 255, 255, 255, 255],
        position: {
            x: 111,
            y: 111,
            z: 111,
        },
        rotation: {
            x: 111,
            y: 111,
            z: 111,
        },
    });
    
    VehicleCreate(vehicle);
});

async function VehicleCreate(vehicle: VehicleSpawnProp) {
    const collectionName = vehicle.collection.collectionName;

    await vehicle.save()
        .catch(error => console.log(error)) // Если ошибка есть, он её выведет.
        .then(result => {
            logger('green', `Добавлен новый документ в коллекцию: '${collectionName}'`);
            console.log(result);
        }) // Выводит результат, если ошибок нет.

    // await VehicleSpawn.create(vehicle)
    //     .catch(error => console.log(error)) // Если ошибка есть, он её выведет.
    //     .then(result => console.log(result)) // Выводит результат, если ошибок нет.
}