"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CEFBrowser_1 = require("../CEFBrowser");
const changeUI_1 = require("../changeUI");
function routeTo(route) {
    if (CEFBrowser_1.Browser.getOpenPage()) {
        changeUI_1.changeUI(changeUI_1.CEFRoute.CLEAR);
        CEFBrowser_1.Browser.setCursor(false);
        CEFBrowser_1.Browser.setOpenPage(false);
        mp.gui.cursor.show(false, false);
    }
    else {
        mp.gui.cursor.show(true, true);
        CEFBrowser_1.Browser.setOpenPage(true);
        CEFBrowser_1.Browser.setCursor(true);
        changeUI_1.changeUI(route);
    }
}
exports.routeTo = routeTo;
