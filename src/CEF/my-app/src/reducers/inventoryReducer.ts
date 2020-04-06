import { SET_ITEMS, SELECT_ITEM, CLOSE_SELECT_ITEM } from "../actions/inventoryActions";
import { ItemData, ItemType, Item } from "../types/item";

export type InventoryState = {
    items: any;
    selectCurrentItem: Item | null;
}

function createItemObject(key: string, amount: number, data: ItemData): Item {
    return { key, amount, data }
}

const initialState: InventoryState = {
    selectCurrentItem: null,
    items: [
        createItemObject('item_weapon_ak47', 1, { type: ItemType.WEAPON, name: 'AK-47', maxStackCount: 5, condition: 95, description: 'adadada dadadada adadadada dadadad adadada' }),
        createItemObject('item_armor', 1, { type: ItemType.ARMOUR, name: 'ARMOR', maxStackCount: 1, condition: 33, description: 'adadada dadadada adadadada dadadad adadada' }),
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ],
};

function InventoryReducer(state = initialState, action: any) {
    console.log('InventoryReducer state', state);

    switch (action.type) {
        case SET_ITEMS:
            return { ...state, items: [...action.payload] };

        case SELECT_ITEM:
            return { ...state, selectCurrentItem: {...action.payload} }

        case CLOSE_SELECT_ITEM:
            return { ...state, selectCurrentItem: action.payload };

        default:
            return state;
    }
}

export {
    InventoryReducer,
    createItemObject,
}