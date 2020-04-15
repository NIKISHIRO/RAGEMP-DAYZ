import { SET_INVENTORY_ITEMS, SET_GROUND_ITEMS, SET_INVENTORY_SLOTS, SET_SNACKBAR } from "../actions/inventoryActions";
import shortid from 'shortid';
import { Item, ItemKey, ItemType } from "../types";
import { SnackbarOrigin } from "@material-ui/core/Snackbar";

export type UIState = {
    snackbar: {
        open: boolean,
        text: string,
        origin: SnackbarOrigin,
    };
    inventory: {
        slots: number,
        items: Item[],
    };
    ground: {
        items: Item[],
    }
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
            shortid: shortid.generate(),
            weight: 5,
        }
    },

    {
        key: ItemKey.ITEM_AMMO_SHOTGUN, 
        amount: 99, 
        data: {
            type: ItemType.AMMO,
            name: 'SHOTGUN SHELL',
            description: 'Пережаризац',
            maxStackCount: 30,
            shortid: shortid.generate(),
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
            shortid: shortid.generate(),
            weight: 6,
        }
    },

    {
        key: ItemKey.ITEM_WEAPON_AK47, 
        amount: 1, 
        data: {
            type: ItemType.WEAPON,
            name: 'Kalash',
            description: 'Убивац',
            maxStackCount: 1,
            shortid: shortid.generate(),
            weight: 5,
        }
    },
];

const initialState: UIState = {
    snackbar: {
        open: false,
        text: '',
        origin: {
            vertical: 'bottom',
            horizontal: 'center',            
        }
    },
    inventory: {
        slots: 10,
        items: [],
    },
    ground: {
        items: getData(),
    },
};

function UIReducer(state = initialState, action: any) {
    switch (action.type) {
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