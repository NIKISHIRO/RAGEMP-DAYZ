"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const changeUI_1 = require("../../changeUI");
const CallRPC_1 = require("../../../CallRPC");
const Player_1 = require("../../../player/Player");
const routeTo_1 = require("../routeTo");
let flag = true;
mp.keys.bind(Player_1.playerInstance.getSettingsKeyCode(Player_1.KeysSettings.OPEN_INVENTORY), true, function () {
    if (!mp.players.local.getVariable('isAuth'))
        return;
    routeTo_1.routeTo(changeUI_1.CEFRoute.UIITEMS);
    CallRPC_1.callRPC.cefSendLootItemsGround([]);
});
