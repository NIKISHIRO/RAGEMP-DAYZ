import { combineReducers } from "redux";
import { InventoryReducer, InventoryState } from "./inventoryReducer";
import { ClothesReducer, ClothesState } from "./clothesReducer";
import { connectRouter } from 'connected-react-router'

export type State = {
    inventory: InventoryState;
    clothes: ClothesState;
}

const createRootReducer = (history) => combineReducers({
    inventory: InventoryReducer,
    clothes: ClothesReducer,
    router: connectRouter(history),
  });

export {
    createRootReducer,
}