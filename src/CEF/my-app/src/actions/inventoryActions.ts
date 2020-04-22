import { Item } from "../types";
import shortid from 'shortid';

export const SET_INVENTORY_ITEMS = 'SET_INVENTORY_ITEMS';
export const SET_GROUND_ITEMS = 'SET_GROUND_ITEMS';
export const SET_INVENTORY_SLOTS = 'SET_INVENTORY_SLOTS';
export const SET_SNACKBAR = 'SET_SNACKBAR';

const deleteInventoryItemById = (id: number) => {
    return (dispatch, getState) => {
        if (id === -1) {
            return;
        }

        const { UI } = getState();
        const { inventory } = UI;
        const { items: inventoryItems } = inventory;
        const invItems = [...inventoryItems];

        invItems.splice(id, 1);
        dispatch(
            setInventoryItems(invItems)
        );
    };
};

const addInventoryItem = () => {
    return (dispatch, getState) => {
        console.log('addInventoryItem getState', getState());
    };
};

const stackItems = (currentItemIndex: number, nextItemIndex: number) => {
    return (dispatch, getState) => {
        const { UI } = getState();
        const { inventory } = UI;
        const { items } = inventory;
        const invItems = [...items];

        if (currentItemIndex === -1 || nextItemIndex === -1) {
            return;
        }

        const currentItem = {...items[currentItemIndex]};
        const nextItem = {...items[nextItemIndex]};

        if (currentItem.key !== nextItem.key) {
            return;
        }

        const maxStackCount = currentItem.data.maxStackCount;
        const sum = currentItem.amount + nextItem.amount;

        console.log('maxStackCount', maxStackCount);
        console.log('sum', sum);

        if (sum > maxStackCount) {
            const amount = sum - maxStackCount;
            currentItem.amount = amount;
            nextItem.amount = maxStackCount;
            invItems.splice(currentItemIndex, 1, currentItem);
            invItems.splice(nextItemIndex, 1, nextItem);
        } else {
            nextItem.amount = sum; 
            invItems.splice(currentItemIndex, 1, nextItem);
            invItems.splice(nextItemIndex, 1);
        }

        dispatch({
            type: SET_INVENTORY_ITEMS,
            payload: invItems,
        });
    };
};

const setInventorySlots = (slots: number) => {
    return (dispatch, getState) => {
        dispatch({
            type: SET_INVENTORY_SLOTS,
            payload: slots,
        })
    };
};

const setInventoryItems = (items: Item[]) => {
    return (dispatch, getState) => {
        dispatch({
            type: SET_INVENTORY_ITEMS,
            payload: items,
        })
    };
};

// Разделяет предметы в инвентаре.
const splitInventoryItemByIndex = (itemId: number, splitCount: number) => {
    return (dispatch, getState) => {
        if (!Number.isInteger(splitCount)) {
            return;
        }

        if (splitCount <= 0) {
            return;
        }

        const { UI } = getState();
        const { inventory } = UI;
        const { items } = inventory;
        const invItems = [...items];
        const findItem = JSON.parse(JSON.stringify(invItems[itemId]));
        const newItem = JSON.parse(JSON.stringify(findItem));
        const item = invItems[itemId];

        if (item.amount <= splitCount) {
            return;
        }

        const amount = item.amount - splitCount;
        findItem.amount = amount;
        newItem.data.shortid = `__newItem${shortid.generate()}`;
        newItem.amount = splitCount;
    
        invItems.splice(itemId, 1);
        invItems.splice(itemId, 0, findItem, newItem);
        dispatch(setInventoryItems(invItems));
    };
};

const setGroundItems = (items: Item[]) => {
    return (dispatch, getState) => {
        dispatch({
            type: SET_GROUND_ITEMS,
            payload: items,
        })
    };
};

export {
    addInventoryItem,
    setInventoryItems,
    setInventorySlots,
    setGroundItems,
    stackItems,
    splitInventoryItemByIndex,
    deleteInventoryItemById,
}