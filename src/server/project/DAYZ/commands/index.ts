import { Player } from "../player/Player";

mp.events.addCommand('kill', (player: PlayerMp) => {
    player.health = 0;
});

mp.events.addCommand('w', (player: PlayerMp, ft: string, hash: string, ammo: string) => {
    player.giveWeapon(mp.joaat(hash), parseInt(ammo)); // Assault Rifle, Carbine Rifle
});

mp.events.addCommand('reg', (player: PlayerMp, ft: string, login: string, email: string, pass: string) => {
    if (!ft) player.outputChatBox('/reg login password');
    const plr = new Player(player);
    plr.register(login, email, pass);
});

mp.events.addCommand('login', (player: PlayerMp, ft: string, login: string, pass: string) => {
    if (!ft) player.outputChatBox('/login login password');
    const plr = new Player(player);
    plr.login(login, pass);
});

mp.events.addCommand('logout', (player: PlayerMp, ft: string) => {
    const plr = new Player(player);
    plr.logout();
});

mp.events.addCommand('sc', (player: PlayerMp, ft: string, hash: string) => {
    player.position.z += 10;
    const veh = mp.vehicles.new(mp.joaat(hash), player.position);
});