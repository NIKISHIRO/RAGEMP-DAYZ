import { CEFBrowser } from "../CEFBrowser";

// Экземпляры CEFBrowser, содержащие объект браузера и методы для работы с ними.
const Browser = new CEFBrowser('index.html');
Browser.setActive(true);

export {
    Browser,
}