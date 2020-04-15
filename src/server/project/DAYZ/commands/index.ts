import { Player } from "../player/Player";

mp.events.addCommand('kill', (player: PlayerMp) => {
    player.health = 0;
});

mp.events.addCommand('w', (player: PlayerMp, ft: string, hash: string, ammo: string) => {
    player.giveWeapon(mp.joaat(hash), parseInt(ammo)); // Assault Rifle, Carbine Rifle
});
