console.log('---> Commands File.');

mp.events.addCommand('data', (player: PlayerMp, ft: string) => {
    // player.data.testdata = 'test';
    player.setVariable('testdata', 'valuetestikusikal');
    console.log(player.getVariable('testdata'));
});

mp.events.addCommand('kill', (player: PlayerMp) => {
    player.health = 0;
})