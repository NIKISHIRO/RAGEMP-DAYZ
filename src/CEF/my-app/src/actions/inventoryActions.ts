import { Item } from "../types/item";

export const SET_INVENTORY_ITEMS = 'SET_INVENTORY_ITEMS';
export const SET_GROUND_ITEMS = 'ITEMS_GROUND_ITEMS';

const addInventoryItem = () => {
    return (dispatch, getState) => {
        console.log('addInventoryItem getState', getState());
    };
};

const setInventoryItems = (items: Item[]) => {
    return (dispatch, getState) => {
        dispatch({
            type: SET_INVENTORY_ITEMS,
            payload: [...items],
        })
    };
};

const setGroundItems = (items: Item[]) => {
    return (dispatch, getState) => {
        dispatch({
            type: SET_GROUND_ITEMS,
            payload: [...items],
        })
    };
};

export {
    addInventoryItem,
    setInventoryItems,
    setGroundItems,
}