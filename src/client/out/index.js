"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rage_rpc_1 = require("./rage-rpc");
require("./_rage-console");
require("./syncedPlayerComponent");
require("./CEF");
require("./DAYZ/events/render");
require("./DAYZ/peds");
require("./DAYZ/loot");
require("./DAYZ/events");
mp.keys.bind(0x47, true, function () {
    rage_rpc_1.callBrowsers('testrpc', false);
    mp.events.callRemote('keypress:G');
});
mp.gui.chat.push('ПРИВЕТ ОТ ВЕБПАКА!');
