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

export type DisplayUI = {
    huds: boolean;
}

export enum CEFRoute {
    ADMININTERFACE = 'AdminInterface',
    UIITEMS = 'UIItems',
    CLEAR = 'clear',
    START_MENU = 'StartMenu',
    CHARACTER = 'CHARACTER',
}

class CallRPC {
    public changeUI(route: CEFRoute) {
        callServer('server_change_UI', route);
    }

    public cefSetHudsValue(type: HudsType, value: number): any {
        callBrowser(Browser.getBrowser(), type, value)
    }
    
    // Отправка предметов лежащих на земле в CEF.
    public cefSendLootItemsGround(items: Item[]) {
        return callBrowser(Browser.getBrowser(), 'cef_set_ground_items', items);
    }

    public setDisplayInterface(name: string, bool: boolean) {
        callServer('server_set_display', JSON.stringify({name, bool}));
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

    public serverSetLookingStorage(name, remoteId) {
        return callServer('server_set_looking_storage', {name, remoteId});
    }

    public serverRenderGroundUI(remoteID: number) {
        return callServer('server_render_ground_ui', remoteID);
    }

    public serverSetStorageData(type: string, id: number) {
        return callServer('server_set_storage_data', {type, id});
    }
    
    public serverTakeItem(itemKey: string, amount: number) {
        return callServer('server_take_inventory_item', {itemKey, amount});
    }
}

const callRPC = new CallRPC;

export {
    callRPC,
}