import { combineReducers } from "redux";
import { UIReducer, UIState } from "./UIReducer";
import { ClothesReducer, ClothesState } from "./clothesReducer";
import { connectRouter } from 'connected-react-router'

export type State = {
    UI: UIState;
    clothes: ClothesState;
}

const createRootReducer = (history) => combineReducers({
    UI: UIReducer,
    clothes: ClothesReducer,
    router: connectRouter(history),
  });

export {
    createRootReducer,
}