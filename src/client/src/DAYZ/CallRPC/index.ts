import { callBrowser, callServer, callBrowsers } from "../../rage-rpc";
import { Item } from "../../interfaces";
import { Browser } from "../CEF/CEFBrowser";

export enum HudsType {
    CEF_SET_HEALTH_HUDS = 'cef_set_health_huds',
    CEF_SET_HUNGER_HUDS = 'cef_set_hunger_huds',
    CEF_SET_ARMOR_HUDS = 'cef_set_armor_huds',
    CEF_SET_DEHYDRATION_HUDS = 'cef_set_dehydration_huds',
}

class CallRPC {
    public cefSetHudsValue(type: HudsType, value: number): any {
        callBrowser(Browser.getBrowser(), type, value);
    }
    
    public cefSendLootCreateData(data: any[]): any {
        callBrowser(Browser.getBrowser(), 'cef_set_loot_create_data', data);
    }

    // Отправка предметов лежащих на земле в CEF.
    public cefSendLootItemsGround(items: Item[]) {
        return callBrowser(Browser.getBrowser(), 'cef_set_ground_items', items);
    }

    public serverSetHealth(health) {
        callServer('server_set_health', health);
    }

    public serverSetHudProp(name: string, value: number) {
        callServer('server_set_hud_prop', {name, value});
    }
}

const callRPC = new CallRPC;

export {
    callRPC,
}