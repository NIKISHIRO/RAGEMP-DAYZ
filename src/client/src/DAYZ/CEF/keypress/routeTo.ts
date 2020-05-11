import { Browser } from "../CEFBrowser";
import { changeUI, CEFRoute } from "../changeUI";

// Если есть открытая страница, то закрыть, если нет - открыть.
function routeTo(route: CEFRoute) {
    if (Browser.getOpenPage()) {
        changeUI(CEFRoute.CLEAR);
        Browser.setCursor(false);
        Browser.setOpenPage(false);
        mp.gui.cursor.show(false, false);
    } else {
        mp.gui.cursor.show(true, true);
        Browser.setOpenPage(true);
        Browser.setCursor(true);
        changeUI(route);
    }
}

export {
    routeTo,
}