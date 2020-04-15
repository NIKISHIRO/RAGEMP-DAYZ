"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CEFBrowser_1 = require("./CEFBrowser");
require("./keypress");
require("./inventory");
require("./notification");
exports.Browser = new CEFBrowser_1.CEFBrowser('index.html');
