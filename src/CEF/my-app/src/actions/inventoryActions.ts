import { State } from "../reducers";
import { Item } from "../types";

export const SET_INVENTORY_SLOTS = 'SET_INVENTORY_SLOTS';
export const SWAP_ITEMS = 'SWAP_ITEMS';
export const STACK_INVENTORY_ITEMS = 'STACK_INVENTORY_ITEMS';
export const SELECT_INVENTORY_ITEM = 'SELECT_INVENTORY_ITEM';
export const SWAP_INV_AND_GRND_ITEMS = 'SWAP_INV_AND_GRND_ITEMS';
export const SET_INVENTORY_ITEMS = 'SET_INVENTORY_ITEMS';
export const SET_ITEMS = 'SET_ITEMS';

export type ItemsType = 'inventoryItems' | 'groundItems';

function setItems(itemsType: ItemsType, items: Item[]) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_ITEMS,
            itemsType,
            items,
        });
    };
}

function selectInvItem(item: Item | null) {
    return (dispatch, getState) => {
        dispatch({
            type: SELECT_INVENTORY_ITEM,
            item,
        });
    };
}

// Работа с 2 дроп зонами.
function swapInvAndGroundItems(invId: number, groundId: number) {
    return (dispatch, getState) => {
        dispatch({
            type: SWAP_INV_AND_GRND_ITEMS,
            invId,
            groundId,
        });
    };
}

// Работа в пределах одной ДРОП-ЗОНЫ.
function swapItems(dragId: number, dropId: number, itemsType: ItemsType) {
    return (dispatch, getState) => {
        const state: State = getState();
        const items: any = [...state.inventory[itemsType]];

        const isInventoryItems = itemsType === 'inventoryItems';

        // Перенос на пустую ячейку.
        if (items[dropId] === null) {
            dispatch({
                type: SWAP_ITEMS,
                dragId,
                dropId,
                itemsType,
            });
            return;
        }
        
        // Перенос на НЕ пустую ячейку.
        if (isInventoryItems) {
            if (items[dropId] !== null && items[dragId] !== null) {
                // Если два предмета одного типа и их макс. стак > 1.
                if (items[dragId].key == items[dropId].key && items[dragId].data.maxStackCount > 1) {
                    dispatch({
                        type: STACK_INVENTORY_ITEMS,
                        dragId,
                        dropId,
                        itemsType,
                    });                
                    return;
                }
            }
        }

        dispatch({
            type: SWAP_ITEMS,
            dragId,
            dropId,
            itemsType,
        });
    };
}

function setInventorySlots(slots: number) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_INVENTORY_SLOTS,
            slots
        });
    };
}

export {
    setItems,
    selectInvItem,
    swapInvAndGroundItems,
    swapItems,
    setInventorySlots,
}