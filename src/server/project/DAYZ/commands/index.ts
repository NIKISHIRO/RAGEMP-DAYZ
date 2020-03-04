console.log('---> Commands File.');

mp.events.addCommand('data', (player: PlayerMp, ft: string) => {
    // player.data.testdata = 'test';
    player.setVariable('testdata', 'valuetestikusikal');
    console.log(player.getVariable('testdata'));
});

mp.events.addCommand('kill', (player: PlayerMp) => {
    player.health = 0;
})

mp.events.addCommand('w', (player: PlayerMp, ft: string, hash: string, ammo: string) => {
    player.giveWeapon(mp.joaat(hash), parseInt(ammo)); // Assault Rifle, Carbine Rifle
})