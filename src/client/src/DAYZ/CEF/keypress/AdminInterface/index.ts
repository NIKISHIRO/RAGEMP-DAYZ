import { Browser } from "../../CEFBrowser";
import { routeTo } from "../../routeTo";
import { CEFRoute } from "../../../CallRPC";

// F2
let flag = true;
mp.keys.bind(0x71, true, function() {
    if (!mp.players.local.getVariable('isAuth')) return;
    if (!mp.players.local.getVariable('admin')) return;

    routeTo(CEFRoute.ADMININTERFACE);
}); 