import { CEFBrowser } from './CEFBrowser';
import './inventory';

// Экземпляры CEFBrowser, содержащие объект браузера и методы для работы с ними.
const Browser = new CEFBrowser('index.html');
Browser.setActive(true);

// TAB.
let flag: boolean = false;
mp.keys.bind(0x09, true, function() {
    flag = !flag;
    Browser.setActive(flag);
    Browser.setCursor(flag);
});