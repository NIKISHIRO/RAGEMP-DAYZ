import { callBrowser } from "../../rage-rpc";
import { Browser } from "../CEF/CEFBrowser";

export enum HudsType {
    CEF_SET_HEALTH_HUDS = 'cef_set_health_huds',
    CEF_SET_HUNGER_HUDS = 'cef_set_hunger_huds',
    CEF_SET_ARMOR_HUDS = 'cef_set_armor_huds',
    CEF_SET_DEHYDRATION_HUDS = 'cef_set_dehydration_huds',
}

function cefSetHudsValue(type: HudsType, value: number): any {
    callBrowser(Browser.getBrowser(), type, value);
}

function cefSendLootCreateData(data: any[]): any {
    callBrowser(Browser.getBrowser(), 'cef_set_loot_create_data', data);
}

export {
    cefSetHudsValue,
    cefSendLootCreateData,
}