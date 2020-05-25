import { playerInstance, KeysSettings } from "../player/Player";
import { getObjectsForEachInRange } from "../entities/Object";
import { callRPC, CEFRoute } from "../CallRPC";
import { routeTo } from "../CEF/routeTo";
import { get2EntitiesRange } from "../entities/Entities";
import { Browser } from "../CEF/CEFBrowser";

const pLocal = mp.players.local;
const range = 1.5;

// Клавиша "действие".
mp.keys.bind(playerInstance.getSettingsKeyCode(KeysSettings.ACTION), true, async function() {
    // Если открыт UI, то запретить пользователю действия.
    if (Browser.getOpenPage()) return;

    // установить данные об этом хранилище сервере.
    const lookEnt = playerInstance.getLookingAtEntityData();
    const lootItems = lookEnt.getVariable('lootItems');

    if (!lootItems) {
        return;
    }

    const takingItem = lootItems[0];

    // Если тип сущности ОБЪЕКТ.
    if (lookEnt.type == 'object') {
        const lootType: 'storage' | 'item' = lookEnt.getVariable('lootType');

        // Если тип предмета ПРЕДМЕТ.
        if (lootType == 'item') {
            await playerInstance.setStorageData('item', lookEnt.remoteId);
            await callRPC.serverTakeItem(takingItem.key, takingItem.amount);
        }
        // Если тип предмета ХРАНИЛИЩЕ.
        if (lootType == 'storage') {

        }
    }
    if (lookEnt.type == 'vehicle') {
        mp.gui.chat.push(JSON.stringify(lookEnt.type));
        mp.gui.chat.push(JSON.stringify(lootItems));
        routeTo(CEFRoute.UIITEMS);
        await playerInstance.setStorageData('vehicle', lookEnt.remoteId);
        callRPC.cefSendLootItemsGround(lootItems);
    }
});

// Клавиша "Открыть инвентарь".
mp.keys.bind(playerInstance.getSettingsKeyCode(KeysSettings.OPEN_INVENTORY), true, async function() {
    if (!mp.players.local.getVariable('isAuth')) return;

    routeTo(CEFRoute.UIITEMS);

    // Если игрок не в машине.
    if (!pLocal.vehicle) {
        const objects = getObjectsForEachInRange(pLocal, range);
        mp.gui.chat.push('Кол-во объектов в пределах ' + range + ' метров: ' + objects.length);
        
        // Получить предметы из объектов и вывести их в CEF UI-GROUND.
        const getItems = (): any => {
            const array = [];

            objects.forEach(object => {
                const items = object.getVariable('lootItems');
                if (items && items.length > 0) {
                    array.push(...items);
                }
            });
            
            return array;
        };

        const items = getItems();
        callRPC.cefSendLootItemsGround(items);
    }
});

// const renderUIGroundStreamPlayers = (range: number) => {
//     mp.players.forEachInStreamRange(player => {
//         if (pLocal == player) return;

//         if (length > range) return;
//     });
// }; 