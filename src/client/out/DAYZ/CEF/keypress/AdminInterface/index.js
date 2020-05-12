"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const changeUI_1 = require("../../changeUI");
const routeTo_1 = require("../routeTo");
let flag = true;
mp.keys.bind(0x71, true, function () {
    if (!mp.players.local.getVariable('isAuth'))
        return;
    if (!mp.players.local.getVariable('admin'))
        return;
    routeTo_1.routeTo(changeUI_1.CEFRoute.ADMININTERFACE);
});
