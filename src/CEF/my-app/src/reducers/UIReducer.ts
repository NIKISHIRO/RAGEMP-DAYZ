import { SET_INVENTORY_ITEMS, SET_GROUND_ITEMS, SET_INVENTORY_SLOTS, SET_SNACKBAR } from "../actions/inventoryActions";
import shortid from 'shortid';
import { Item, ItemKey, ItemType } from "../types";
import { ENQUEUE_SNACKBAR, CLOSE_SNACKBAR, REMOVE_SNACKBAR } from "../actions/notificationActions";
import { SET_DISPLAY_UI } from "../actions/displayUIActions";
import { SET_HEALTH_HUDS } from "../actions/hudsDataActions";

export type DisplayUI = {
    huds: boolean;
};

export type HudsData = {
    health: number;
};

export type UIState = {
    hudsData: HudsData;
    displayUI: DisplayUI;
    notifications: any[];
    inventory: {
        slots: number;
        items: Item[];
    };
    ground: {
        items: Item[];
    };
}

const getData = (): Item[] => [
    {
        key: ItemKey.ITEM_WEAPON_AK47, 
        amount: 1,
        data: {
            type: ItemType.WEAPON,
            name: 'Kalash',
            description: 'Убивац',
            maxStackCount: 1,
            serverId: shortid.generate(),
            shortid: shortid.generate(),
            isDelete: false,
            weight: 4,
        }
    },

    {
        key: ItemKey.ITEM_AMMO_SHOTGUN, 
        amount: 40,
        data: {
            type: ItemType.COMMON,
            name: 'SHOTGUN SHELL',
            description: 'Пережаризац',
            maxStackCount: 30,
            serverId: shortid.generate(),
            shortid: shortid.generate(),
            isDelete: false,
            weight: 0.1,
        }
    },

    {
        key: ItemKey.ITEM_ARMOR, 
        amount: 1, 
        data: {
            type: ItemType.ARMOR,
            name: 'ARMOR',
            description: 'Защищац',
            maxStackCount: 1,
            serverId: shortid.generate(),
            shortid: shortid.generate(),
            isDelete: false,
            weight: 6,
        }
    },

    {
        key: ItemKey.ITEM_CLOTHES_MASK_1, 
        amount: 1, 
        data: {
            type: ItemType.CLOTHES,
            name: 'Маска 1',
            description: 'Одевац',
            maxStackCount: 1,
            serverId: shortid.generate(),
            shortid: shortid.generate(),
            isDelete: true,
            weight: 2,
        }
    },
];

const initialState: UIState = {
    hudsData: {
        health: 25,
    },
    displayUI: {
        huds: true,
    },
    notifications: [],
    inventory: {
        slots: 10,
        items: [],
    },
    ground: {
        items: getData(),
    },
};

function UIReducer(state: UIState = initialState, action: any) {
    switch (action.type) {
        case SET_HEALTH_HUDS:
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
            return { ...state, snackbar: {...action.payload} }

        case SET_INVENTORY_ITEMS:
            state.inventory.items = action.payload;
            return { ...state };

        case SET_INVENTORY_SLOTS:
            state.inventory.slots = action.payload;
            return { ...state }

        case SET_GROUND_ITEMS:
            return { ...state, ground: { items: action.payload } };

        default:
            return state;
    }
}

export {
    UIReducer,
}