"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
let flag = false;
mp.keys.bind(0x09, true, function () {
    flag = !flag;
    _1.Browser.setActive(flag);
    _1.Browser.setCursor(flag);
});
