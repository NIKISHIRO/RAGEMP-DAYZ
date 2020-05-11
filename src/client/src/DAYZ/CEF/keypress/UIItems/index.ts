import { changeUI, CEFRoute } from "../../changeUI";
import { callRPC } from "../../../CallRPC";
import { playerInstance, KeysSettings } from "../../../player/Player";
import { Browser } from "../../CEFBrowser";
import { routeTo } from "../routeTo";

let flag = true;
mp.keys.bind(playerInstance.getSettingsKeyCode(KeysSettings.OPEN_INVENTORY), true, function() {
    if (!mp.players.local.getVariable('isAuth')) return;
    routeTo(CEFRoute.UIITEMS)
    callRPC.cefSendLootItemsGround([]);
}); 