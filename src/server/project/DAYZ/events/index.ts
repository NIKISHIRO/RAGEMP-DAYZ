export const events = {
    playerJoin: (player: PlayerMp) => {
        player.spawn(new mp.Vector3(111, 111, 111));
        console.log(`${player.name}: Зашел на сервер.`);
    },

    playerDeath: (player: PlayerMp) => {
        player.spawn(new mp.Vector3(111, 111, 111));

        
    }
};