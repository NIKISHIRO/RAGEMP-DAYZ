import { combineReducers } from "redux";
import { UIReducer, UIState } from "./UIReducer";
import { ClothesReducer, ClothesState } from "./clothesReducer";
import { connectRouter } from 'connected-react-router'
import { characterReducer, CharacterState } from "./characterReducer";
import { authReducer, AuthState } from "./authReducer";

export type State = {
    character: CharacterState;
    UI: UIState;
    clothes: ClothesState;
    auth: AuthState;
}

const createRootReducer = (history) => combineReducers({
    auth: authReducer,
    character: characterReducer,
    UI: UIReducer,
    clothes: ClothesReducer,
    router: connectRouter(history),
  });

export {
    createRootReducer,
}