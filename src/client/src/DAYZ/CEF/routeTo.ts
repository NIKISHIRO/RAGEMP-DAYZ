import { Browser } from "./CEFBrowser";
import { playerInstance } from "../player/Player";
import { CEFRoute, callRPC } from "../CallRPC";

// Если есть открытая страница, то закрыть, если нет - открыть.
function routeTo(route: CEFRoute) {
    if (Browser.getOpenPage()) {
        playerInstance.setStorageData(null, null); // удалить инфу о хранилище в котором игрок находится.
        callRPC.changeUI(CEFRoute.CLEAR);
        Browser.setCursor(false);
        Browser.setOpenPage(false);
        mp.gui.cursor.show(false, false);
    } else {
        playerInstance.setStorageData(null, null); // удалить инфу о хранилище в котором игрок находится.
        mp.gui.cursor.show(true, true);
        Browser.setOpenPage(true);
        Browser.setCursor(true);
        callRPC.changeUI(route);
    }
}

export {
    routeTo,
}