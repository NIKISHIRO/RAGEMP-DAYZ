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

//Синхронизация player и машины
mp.events.add("playerEnterVehicle", (vehicle, seat) => {
	vehicle.setInvincible(false);
});

// Чтобы персонаж не запыхался.
mp.events.add('render', () => {
    if(mp.players.local.isSprinting()) {
        mp.game.player.restoreStamina(100);
    }
});

// Отлавливает изменение голода и жажды на сервере и устанавливает на клиенте.
mp.events.addDataHandler('hunger', (entity: PlayerMp, hunger: number, prevHunger: number) => {
    if (entity === mp.players.local) {
        playerInstance.setHunger(hunger);
     }
});
mp.events.addDataHandler('dehydration', (entity: PlayerMp, dehydration: number, prevDehydration: number) => {
    if (entity === mp.players.local) {
        playerInstance.setDehydration(dehydration);
     }
});
mp.events.addDataHandler('temperature', (entity: PlayerMp, temperature: number, prevTemperature: number) => {
    if (entity === mp.players.local) {
        // ...
     }
});
