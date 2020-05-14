import { callBrowser, callServer, callBrowsers } from "../../rage-rpc";
import { Item } from "../../interfaces";
import { Browser } from "../CEF/CEFBrowser";

export enum HudsType {
    CEF_SET_HEALTH_HUDS = 'cef_set_health_huds',
    CEF_SET_HUNGER_HUDS = 'cef_set_hunger_huds',
    CEF_SET_ARMOR_HUDS = 'cef_set_armor_huds',
    CEF_SET_DEHYDRATION_HUDS = 'cef_set_dehydration_huds',
}


export enum NotifyHorizontal {
    CENTER = 'center',
    LEFT = 'left',
    RIGHT = 'right',
}
export enum NotifyVertical {
    TOP = 'top',
    BOTTOM = 'bottom',
}
export type NotifyOrigin = {
    horizontal: NotifyHorizontal;
    vertical: NotifyVertical;
}
export enum NotifyVariant {
    DEFAULT = 'default',
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info',
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

    public serverNotify(text: string, variant: NotifyVariant, origin: NotifyOrigin) {
        return callBrowser(Browser.getBrowser(), 'cef_set_notify', {text, variant, origin})
    }

    public serverSetHealth(health) {
        callServer('server_set_health', health);
    }

    public serverSetHudProp(name: string, value: number) {
        callServer('server_set_hud_prop', {name, value});
    }

    public serverSetLookingStorage(name: 'object' | 'vehicle', value: number) {
        return callServer('server_set_looking_storage', {name, value});
    }

    public serverTakeItem(serverId: string, amount: number): Promise<{result: boolean; text: string}> {
        return callServer('server_take_inventory_item', {serverId, amount});
    }
}

const callRPC = new CallRPC;

export {
    callRPC,
}