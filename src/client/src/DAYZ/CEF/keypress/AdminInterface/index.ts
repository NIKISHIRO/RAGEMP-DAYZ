import { Browser } from "../../browser";
import { changeUI, CEFRoute } from "../../changeUI";

// F2
let flag = true;
mp.keys.bind(0x71, true, function() {
    flag = !flag;
    mp.gui.chat.push(`AI - ${flag}`);

    if (flag) {
        changeUI(CEFRoute.ADMININTERFACE);
    } else {
        changeUI(CEFRoute.CLEAR);
    }

    Browser.setCursor(flag);
});