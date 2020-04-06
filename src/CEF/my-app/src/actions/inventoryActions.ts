import { Item } from "../types/item";

export const SET_ITEMS = 'SET_ITEMS';
export const SELECT_ITEM = 'SELECT_ITEM';
export const CLOSE_SELECT_ITEM = 'CLOSE_SELECT_ITEM';

function setInventoryItems(items: any) {
    console.log('items', items);

    return (dispatch) => {
        dispatch({
            type: SET_ITEMS,
            payload: items
        });
    };
}

function addInventoryItem(item: any) {
    return (dispatch, getState) => {
        const { inventory } = getState();
        const { items } = inventory;

        const idx = items.findIndex(i => i === null);

        if (idx === -1) {
            return;
        }

        items.splice(idx, 1, item);

        dispatch({
            type: SET_ITEMS,
            payload: items,
        });
    };
}

function selectItem(item: Item | null) {
    return (dispatch, getState) => {
        const { inventory } = getState();
        console.log('selectIteme wewadsadsadas');

        dispatch({
            type: SELECT_ITEM,
            payload: item,
        });
    };
}

function closeSelectItem() {
    return (dispatch, getState) => {
        const { inventory } = getState();

        console.log('selectIteme wewadsadsadas');

        dispatch({
            type: CLOSE_SELECT_ITEM,
            payload: null,
        });
    };
}

function putInventoryItem(dragCellIdx: number, dropCellIdx: number) {
    return (dispatch, getState) => {
        const inventoryItems = getState().inventory.items;
        const dragItem = inventoryItems[dragCellIdx] ? inventoryItems[dragCellIdx] : null;
        
        inventoryItems[dropCellIdx] = dragItem;
        inventoryItems[dragCellIdx] = null;

        dispatch({
            type: SET_ITEMS,
            payload: inventoryItems,
        })
    };
}

function swapInventoryItems(dragCellIdx: number, dropCellIdx: number) {
    return (dispatch, getState) => {
        const inventoryItems = getState().inventory.items;
        const dragItem = inventoryItems[dragCellIdx] ? inventoryItems[dragCellIdx] : null;
        const dropItem = inventoryItems[dropCellIdx] ? inventoryItems[dropCellIdx] : null;

        inventoryItems[dropCellIdx] = dragItem;
        inventoryItems[dragCellIdx] = dropItem;
        dispatch({
            type: SET_ITEMS,
            payload: inventoryItems,
        });
    };
}

function stackItems(dragCellIdx: number, dropCellIdx: number) {
    return (dispatch, getState) => {
        const inventoryItems = getState().inventory.items;
        let dragItem: Item | null = inventoryItems[dragCellIdx];
        let dropItem: Item | null = inventoryItems[dropCellIdx];
        
        console.log('stackItems');

        if (!dragItem || !dropItem) {
            return;
        }

        if (dragItem.data.type !== dropItem.data.type) {
            console.log('stackItems -> Предметы разного типа.');
        }

        // Состакать предмет на который кладут до maxStackCount, остаток установить dragItem
        const sum = dragItem.amount + dropItem.amount;
        const maxStackCount = dropItem.data.maxStackCount;
        if (sum > maxStackCount) {
            dropItem.amount = maxStackCount;
            dragItem.amount = sum - maxStackCount;
        }
        else if (sum === maxStackCount) {
            dropItem.amount = maxStackCount;
            dragItem = null;
        }
        else {
            dropItem.amount = sum;
            dragItem = null;
        }

        inventoryItems[dropCellIdx] = dropItem;
        inventoryItems[dragCellIdx] = dragItem;
        dispatch({
            type: SET_ITEMS,
            payload: inventoryItems,
        });
    };
}

export {
    setInventoryItems,
    addInventoryItem,
    putInventoryItem,
    swapInventoryItems,
    stackItems,
    selectItem,
    closeSelectItem,
}