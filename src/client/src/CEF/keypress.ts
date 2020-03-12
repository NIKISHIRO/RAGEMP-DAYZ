import { invBrowser } from '.';

let flag: boolean = false;
mp.keys.bind(0x09, true, function() {

    flag = !flag;
    invBrowser.setActive(flag);
    invBrowser.setCursor(flag);
});
