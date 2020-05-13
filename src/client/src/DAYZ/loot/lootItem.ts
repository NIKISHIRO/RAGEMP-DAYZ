import { playerInstance, KeysSettings, Player } from "../player/Player";
import { callRPC, NotifyVariant, NotifyHorizontal, NotifyVertical } from "../CallRPC";
import { changeUI, CEFRoute } from "../CEF/changeUI";
import { routeTo } from "../CEF/keypress/routeTo";
import { PlayerCamera } from "../Camera/Camera";
import { Item } from "../../interfaces";

mp.keys.bind(playerInstance.getSettingsKeyCode(KeysSettings.ACTION), true, function() {
    function hasPlayerInStorage() {
        // Если объект это лут.
        let hasPlayerInStorage = false;

        mp.players.forEachInStreamRange(player => {
            if (player === mp.players.local) return;

            const poolLookingStorage = player.getVariable('lookingStorage').object;

            mp.gui.chat.push(JSON.stringify(poolLookingStorage));

            if (poolLookingStorage == data.remoteId) {
                hasPlayerInStorage = true;
            } else {
                playerInstance.setLookingStorage('object', data.remoteId);
            }
        });

        return hasPlayerInStorage;
    }

    // Получаем сущность либо null объекта на который смотрит игрок.
    const data = playerInstance.getLookingData();
    if (data) {
        // Получение содержимого объекта с лутом.
        if (data.type === 'object') {
            const object = mp.objects.atRemoteId(data.remoteId);
            const isOpeningStorage = object.getVariable('isOpeningStorage');
            const lootItems: Item[] = object.getVariable('lootItems');

            if (!lootItems && !lootItems.length) {
                return;
            }

            // Заблочить если кто то просматривает хранилище.
            if (hasPlayerInStorage()) {
                mp.gui.chat.push('Это хранилище занято!');
                return;
            }
            console.log(lootItems);
            mp.gui.chat.push(`isOpeningStorage ${isOpeningStorage}`);
            mp.gui.chat.push(`lootItems.length ${lootItems.length}`);
            mp.gui.chat.push(`isOpeningStorage ${isOpeningStorage}`);

            // Открывать хранилище лута?
            if (isOpeningStorage) {
                // Отправляем данные лута в CEF.
                callRPC.cefSendLootItemsGround(lootItems);
                routeTo(CEFRoute.UIITEMS);
            } else { // Если хранилище не открывать то взять предмет по клику.
                async function takeItem() {
                    const serverResult = await callRPC.serverTakeItem(lootItems[0].data.serverId, lootItems[0].amount);
                    console.log('serverResult');
                    console.log(serverResult);
                    await callRPC.serverNotify(
                        serverResult.text, 
                        serverResult ? NotifyVariant.DEFAULT : NotifyVariant.ERROR, 
                        {horizontal: NotifyHorizontal.CENTER, vertical: NotifyVertical.BOTTOM}
                    );
                }

                takeItem();
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