import { playerInstance, KeysSettings, Player } from "../player/Player";
import { callRPC } from "../CallRPC";
import { changeUI, CEFRoute } from "../CEF/changeUI";
import { routeTo } from "../CEF/keypress/routeTo";
import { PlayerCamera } from "../Camera/Camera";

mp.keys.bind(playerInstance.getSettingsKeyCode(KeysSettings.ACTION), true, function() {
    // Получаем сущность либо null объекта на который смотрит игрок.
    const data = playerInstance.getLookingData();
    if (data) {
        // Получение содержимого объекта с лутом.
        if (data.type === 'object') {
            const object = mp.objects.atRemoteId(data.remoteId);
            const lootItems = object.getVariable('lootItems');

            // Если объект это лут.
            if (lootItems) {
                let hasPlayerInStorage = false;

                // Получить хранилище каждого игрока в пуле и перерисовать ui всем с одинаковым ИДОМ.
                let localLookingStorage = mp.players.local.getVariable('lookingStorage').object;
                mp.players.forEachInStreamRange(player => {
                    // const poolPlayerInstance = new Player(player);
                    if (player === mp.players.local) return;

                    const poolLookingStorage = player.getVariable('lookingStorage').object;

                    mp.gui.chat.push(JSON.stringify(poolLookingStorage));

                    if (poolLookingStorage == data.remoteId) {
                        hasPlayerInStorage = true;
                    } else {
                        playerInstance.setLookingStorage('object', data.remoteId);
                    }
                });

                // Если игрока нет в хранилище.
                if (!hasPlayerInStorage) {
                    // Отправляем данные лута в CEF.
                    callRPC.cefSendLootItemsGround(lootItems);
                    routeTo(CEFRoute.UIITEMS);
                } else {
                    mp.gui.chat.push('Это хранилище занято!');
                }
            }
        }

        // Получение содержимого машины.
        if (data.type === 'vehicle') {
            const vehicle = mp.vehicles.atRemoteId(data.remoteId);
            const lootItems = vehicle.getVariable('lootItems');
            mp.gui.chat.push(JSON.stringify(lootItems));

            if (lootItems) {
                // Отправляем данные лута в CEF.
                callRPC.cefSendLootItemsGround(lootItems);
                routeTo(CEFRoute.UIITEMS);
            }
        }
    }
});