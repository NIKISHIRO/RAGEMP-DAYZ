const browser: BrowserMp = mp.browsers.new("package://dist_UI/index.html");
browser.active = false;

mp.keys.bind(0x49, true, function() {
    browser.active = !browser.active;
});