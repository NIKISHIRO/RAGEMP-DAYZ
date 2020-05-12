"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const displayUI_1 = require("../../displayUI");
let flag = true;
mp.keys.bind(0x75, true, function () {
    if (!mp.players.local.getVariable('isAuth'))
        return;
    flag = !flag;
    mp.gui.chat.push(JSON.stringify(flag));
    displayUI_1.setDisplayInterface('huds', flag);
});
