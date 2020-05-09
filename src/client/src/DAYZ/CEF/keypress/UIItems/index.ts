import { Browser } from "../../browser";
import { changeUI, CEFRoute } from "../../changeUI";

// TAB.
// Отправка на сервак нажатую клавишу TAB, чтобы установить настройку display_ui -> UIItems -> true.
let flag = true;
mp.keys.bind(0x09, true, function() {
    if (!mp.players.local.getVariable('isAuth')) return;
  
    flag = !flag;
    mp.gui.chat.push(`uiitems - ${flag}`);

    if (flag) {
        changeUI(CEFRoute.UIITEMS);
    } else {
        changeUI(CEFRoute.CLEAR);
    }

    Browser.setCursor(flag);
});