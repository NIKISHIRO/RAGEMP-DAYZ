import { combineReducers } from "redux";
import { UIReducer, UIState } from "./UIReducer";
import { ClothesReducer, ClothesState } from "./clothesReducer";
import { connectRouter } from 'connected-react-router'
import { characterReducer, CharacterState } from "./characterReducer";

export type State = {
    character: CharacterState;
    UI: UIState;
    clothes: ClothesState;
}

const createRootReducer = (history) => combineReducers({
    character: characterReducer,
    UI: UIReducer,
    clothes: ClothesReducer,
    router: connectRouter(history),
  });

export {
    createRootReducer,
}