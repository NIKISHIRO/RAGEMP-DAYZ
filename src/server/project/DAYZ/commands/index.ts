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

