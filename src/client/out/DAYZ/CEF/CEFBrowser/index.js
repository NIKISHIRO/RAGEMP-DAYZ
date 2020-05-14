"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CEFBrowser {
    constructor(url) {
        this.absolute_path = 'package://CEF/build/';
        this.isOpenPage = false;
        const self = this;
        this.cursorState = false;
        this.browser = mp.browsers.new(self.absolute_path + url);
    }
    setOpenPage(b) {
        this.isOpenPage = b;
    }
    getOpenPage() {
        return this.isOpenPage;
    }
    get isActive() {
        return this.browser.active;
    }
    getBrowser() {
        return this.browser;
    }
    getCursorState() {
        return this.cursorState;
    }
    setActive(toggle) {
        this.browser.active = toggle;
    }
    setCursor(state) {
        this.cursorState = state;
        mp.gui.cursor.visible = state;
    }
    setURL(path) {
        this.browser.url = this.absolute_path + path;
    }
}
const Browser = new CEFBrowser('index.html');
exports.Browser = Browser;
Browser.setActive(true);
