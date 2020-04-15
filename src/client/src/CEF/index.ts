import { CEFBrowser } from './CEFBrowser';
import './keypress';
import './inventory';
import './notification';

// Экземпляры CEFBrowser, содержащие объект браузера и методы для работы с ними.
export const Browser = new CEFBrowser('index.html');