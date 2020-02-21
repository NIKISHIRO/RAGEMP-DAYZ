console.log('---> Commands File.');

mp.events.addCommand('getArmour', (player: PlayerMp, fullText) => {
    player.armour = 50;
});