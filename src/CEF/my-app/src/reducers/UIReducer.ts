import { ENQUEUE_SNACKBAR, CLOSE_SNACKBAR, REMOVE_SNACKBAR, SET_SNACKBAR } from "../actions/notificationActions";
import { SET_DISPLAY_UI } from "../actions/displayUIActions";
import { HudType } from "../actions/hudsDataActions";

export type DisplayUI = {
    huds: boolean;
};

export type HudsData = {
    health: number;
    armor: number;
    hunger: number;
    dehydration: number;
    temperature: number;
    isBleeding: boolean;
};

export type LootCreateData = {
    objectId: number;
    objectHash: string;
    position: number[];
    rotation: number[];
};

export type UIState = {
    hudsData: HudsData;
    displayUI: DisplayUI;
    notifications: any[];
}

const initialState: UIState = {
    hudsData: {
        health: 100,
        armor: 100,
        hunger: 100,
        dehydration: 100,
        temperature: 100,
        isBleeding: true,
    },
    displayUI: {
        huds: false,
    },
    notifications: [],
};

function UIReducer(state: UIState = initialState, action: any) {
    switch (action.type) {
        case HudType.SET_TEMPERATURE_HUDS:
            return {
                ...state,
                hudsData: {
                    ...state.hudsData,
                    temperature: action.payload,
                },
            };

        case HudType.SET_HUNGER_HUDS:
            return {
                ...state,
                hudsData: {
                    ...state.hudsData,
                    hunger: action.payload,
                },
            };

        case HudType.SET_DEHYDRATION_HUDS:
            return {
                ...state,
                hudsData: {
                    ...state.hudsData,
                    dehydration: action.payload,
                },
            };

        case HudType.SET_ARMOR_HUDS:
            return {
                ...state,
                hudsData: {
                    ...state.hudsData,
                    armor: action.payload,
                },
            };

        case HudType.SET_HEALTH_HUDS:
            return {
                ...state,
                hudsData: {
                    ...state.hudsData,
                    health: action.payload,
                },
            };

        case SET_DISPLAY_UI:
            return {
                ...state,
                displayUI: action.payload,
            };

        case ENQUEUE_SNACKBAR:
            return {
                ...state,
                notifications: [
                    ...state.notifications,
                    {
                        key: action.key,
                        ...action.notification,
                    },
                ],
            };

        case CLOSE_SNACKBAR:
            return {
                ...state,
                notifications: state.notifications.map(notification => (
                    (action.dismissAll || notification.key === action.key)
                        ? { ...notification, dismissed: true }
                        : { ...notification }
                )),
            };

        case REMOVE_SNACKBAR:
            return {
                ...state,
                notifications: state.notifications.filter(
                    notification => notification.key !== action.key,
                ),
            };

        case SET_SNACKBAR:
            return { ...state, snackbar: {...action.payload} };

        default:
            return state;
    }
}

export {
    UIReducer,
}