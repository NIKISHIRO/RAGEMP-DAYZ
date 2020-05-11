import { Item } from "../types";
import shortid from 'shortid';

export const SET_INVENTORY_EMPTY = 'SET_INVENTORY_EMPTY'; 
export const SET_INVENTORY_ITEMS = 'SET_INVENTORY_ITEMS';
export const SET_GROUND_ITEMS = 'SET_GROUND_ITEMS';
export const SET_INVENTORY_SLOTS = 'SET_INVENTORY_SLOTS';
export const SET_SNACKBAR = 'SET_SNACKBAR';
export const GET_INVENTORY_ITEMS = 'GET_INVENTORY_ITEMS';
export const SWAP_INVENTORY_ITEMS = 'SWAP_INVENTORY_ITEMS';

function swapInventoryItems(dropCellId, dragCellId) {
    return (dispatch, getState) => {
        dispatch({
            type: SWAP_INVENTORY_ITEMS,
            dropCellId, 
            dragCellId,
        })
    };
}

export {
    swapInventoryItems,
}