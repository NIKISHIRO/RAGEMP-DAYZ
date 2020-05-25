import shortid from 'shortid';
import { ItemKey, ItemType, Item } from "../types";
import { SWAP_ITEMS, STACK_INVENTORY_ITEMS, SELECT_INVENTORY_ITEM, SWAP_INV_AND_GRND_ITEMS, SET_INVENTORY_ITEMS, SET_ITEMS } from '../actions/inventoryActions';

const getData = (): (Item | null)[] => [
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
        }
    },
    null,
    
    {
        key: ItemKey.ITEM_AMMO_SHOTGUN, 
        amount: 12,
        data: {
            type: ItemType.COMMON,
            name: 'SHOTGUN SHELL',
            description: 'Пережаризац',
            maxStackCount: 30,
            serverId: shortid.generate(),
            shortid: shortid.generate(),
            isDelete: false,
        }
    },
    {
        key: ItemKey.ITEM_AMMO_SHOTGUN, 
        amount: 13,
        data: {
            type: ItemType.COMMON,
            name: 'SHOTGUN SHELL',
            description: 'Пережаризац',
            maxStackCount: 30,
            serverId: shortid.generate(),
            shortid: shortid.generate(),
            isDelete: false,
        }
    },
    {
        key: ItemKey.ITEM_AMMO_SHOTGUN, 
        amount: 5,
        data: {
            type: ItemType.COMMON,
            name: 'SHOTGUN SHELL',
            description: 'Пережаризац',
            maxStackCount: 30,
            serverId: shortid.generate(),
            shortid: shortid.generate(),
            isDelete: false,
        }
    },
    {
        key: ItemKey.ITEM_AMMO_SHOTGUN, 
        amount: 5,
        data: {
            type: ItemType.COMMON,
            name: 'SHOTGUN SHELL',
            description: 'Пережаризац',
            maxStackCount: 30,
            serverId: shortid.generate(),
            shortid: shortid.generate(),
            isDelete: false,
        }
    },
    {
        key: ItemKey.ITEM_AMMO_SHOTGUN, 
        amount: 5,
        data: {
            type: ItemType.COMMON,
            name: 'SHOTGUN SHELL',
            description: 'Пережаризац',
            maxStackCount: 30,
            serverId: shortid.generate(),
            shortid: shortid.generate(),
            isDelete: false,
        }
    },
    null,

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
        }
    },
    null,

    {
        key: ItemKey.ITEM_CLOTHES_MASK_1, 
        amount: 1, 
        data: {
            type: ItemType.CLOTHES,
            name: 'Маска 1',
            description: 'ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ыфвфыфвы ',
            maxStackCount: 1,
            serverId: shortid.generate(),
            shortid: shortid.generate(),
            isDelete: true,
        }
    },

    null,
    null,
    null,
];

export type InventoryState = {
    inventoryItems: (Item | null)[];
    inventorySlots: number;
    selectInventoryItem: Item | null;

    groundItems: (Item | null)[];
};

const initialState: InventoryState = {
    inventoryItems: getData(),
    inventorySlots: 10,
    selectInventoryItem: null,

    groundItems: getData(),
};

function InventoryReducer(state = initialState, action: any) {
    switch(action.type) {
        case SELECT_INVENTORY_ITEM: {
            state.selectInventoryItem = action.item;
            return {
                ...state
            }
        }

        case STACK_INVENTORY_ITEMS: {
            const items: any = [...state[action.itemsType]];
            const dragId = action.dragId;
            const dropId = action.dropId;

            let msc = items[dragId].data.maxStackCount;
            let sum = items[dragId].amount + items[dropId].amount; // Сумма для стака предмета.
            let rest = 0;

            if (dropId != dragId) {
                if (sum > msc) {
                    rest = sum - msc;
                    items[dropId].amount = msc;
                    items[dragId].amount = rest;
                }
                else if (sum == msc) {
                    items[dropId].amount = msc;
                    items.splice(dragId, 1, null);
                }
                else if (sum < msc) {
                    items[dropId].amount = sum;
                    items.splice(dragId, 1, null);
                }
            }

            state[action.itemsType] = items;

            return {
                ...state,
            }
        }

        case SWAP_INV_AND_GRND_ITEMS: {
            const inventoryItems = [...state.inventoryItems];
            const groundItems = [...state.groundItems];

            const invId = action.invId; 
            const groundId = action.groundId;

            const invItem = inventoryItems[invId];
            const groundItem = groundItems[groundId];

            inventoryItems[invId] = groundItem;
            groundItems[groundId] = invItem;

            state.inventoryItems = inventoryItems;
            state.groundItems = groundItems;

            return {
                ...state
            }
        }

        case SWAP_ITEMS: {
            const items = [...state[action.itemsType]];
            const dragItem = items[action.dragId];
            const dropItem = items[action.dropId];
            
            items[action.dragId] = dropItem;
            items[action.dropId] = dragItem;

            state[action.itemsType] = items;
            return {
                ...state,
            }
        };

        case SET_ITEMS: {
            const items = action.items;
            state[action.itemsType] = items;
            return {
                ...state,
            }
        }

        default: {
            return {
                ...state,
            }
        }
    }
}

export {
    InventoryReducer,
}