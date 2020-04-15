export class CEFBrowser {
    private absolute_path: string = 'package://CEF/build/';
    private browser: BrowserMp;
    private cursorState: boolean;

    constructor(url: string) {
        const self = this;
        // Название, по которому можно будет получить объект браузера.
        this.cursorState = false;
        this.browser = mp.browsers.new(self.absolute_path + url);
    }

    get isActive() {
        return this.browser.active;
    }

    public getBrowser(): BrowserMp {
        return this.browser;
    }
    
    public getCursorState() {
        return this.cursorState;
    }

    public setActive(toggle: boolean) {
        this.browser.active = toggle;
    }

    public setCursor(state: boolean) {
        this.cursorState = state;
        mp.gui.cursor.visible = state;
    }

    public setURL(path: string) {
        this.browser.url = this.absolute_path + path;
    }
}