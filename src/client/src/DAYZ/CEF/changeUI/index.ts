import rageRpc from "../../../rage-rpc";

export enum CEFRoute {
    ADMININTERFACE = 'AdminInterface',
    UIITEMS = 'UIItems',
    CLEAR = 'clear',
    START_MENU = 'StartMenu',
    CHARACTER = 'CHARACTER',
}

function changeUI(route: CEFRoute) {
    rageRpc.callServer('server_change_UI', route);
}

export {
    changeUI,
}