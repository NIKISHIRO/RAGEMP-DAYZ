import { playerInstance } from "./Player";

mp.events.add("playerSpawn", () => {
    playerInstance.setHunger(75);
    playerInstance.setDehydration(75);
    playerInstance.clearHungerDecrement(); // Обнуление таймера голода.
    playerInstance.clearDehydrationDecrement(); // Обнуление таймера жажды.
});

mp.events.add('playerQuit', () => {
    playerInstance.clearHungerDecrement();
    playerInstance.clearCheckHungerInterval();
});

// Чтобы персонаж не запыхался.
mp.events.add('render', () => {
    if(mp.players.local.isSprinting()) {
        mp.game.player.restoreStamina(100);
    }
});