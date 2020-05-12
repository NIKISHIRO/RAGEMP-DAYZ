import { playerInstance, KeysSettings } from "../player/Player";
import { callRPC } from "../CallRPC";
import { changeUI, CEFRoute } from "../CEF/changeUI";
import { routeTo } from "../CEF/keypress/routeTo";

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
                mp.gui.chat.push(JSON.stringify(lootItems));

                // Отправляем данные лута в CEF.
                callRPC.cefSendLootItemsGround(lootItems);
                routeTo(CEFRoute.UIITEMS);
            }
        }
        // Получение содержимого машины.
        if (data.type === 'vehicle') {
            const vehicle = mp.vehicles.atRemoteId(data.remoteId);
            const lootItems = vehicle.getVariable('lootItems');
            
            if (lootItems) {
                // Отправляем данные лута в CEF.
                callRPC.cefSendLootItemsGround(lootItems);
                routeTo(CEFRoute.UIITEMS);
            }
        }
    }
});