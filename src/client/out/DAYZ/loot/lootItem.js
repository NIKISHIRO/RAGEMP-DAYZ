"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("../player/Player");
const CallRPC_1 = require("../CallRPC");
const changeUI_1 = require("../CEF/changeUI");
const routeTo_1 = require("../CEF/keypress/routeTo");
mp.keys.bind(Player_1.playerInstance.getSettingsKeyCode(Player_1.KeysSettings.ACTION), true, function () {
    const data = Player_1.playerInstance.getLookingData();
    if (data) {
        if (data.type === 'object') {
            const object = mp.objects.atRemoteId(data.remoteId);
            const lootItems = object.getVariable('lootItems');
            if (lootItems) {
                mp.gui.chat.push(JSON.stringify(lootItems));
                CallRPC_1.callRPC.cefSendLootItemsGround(lootItems);
                routeTo_1.routeTo(changeUI_1.CEFRoute.UIITEMS);
            }
        }
        if (data.type === 'vehicle') {
            const vehicle = mp.vehicles.atRemoteId(data.remoteId);
            const lootItems = vehicle.getVariable('lootItems');
            if (lootItems) {
                CallRPC_1.callRPC.cefSendLootItemsGround(lootItems);
                routeTo_1.routeTo(changeUI_1.CEFRoute.UIITEMS);
            }
        }
    }
});
