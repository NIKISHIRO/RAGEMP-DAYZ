import { SET_SHOW } from "../actions/clothesActions";

export type ClothesState = {
    isShow: boolean;
}

const initialState: ClothesState = {
    isShow: true,
};

function ClothesReducer(state: ClothesState = initialState, action: any) {
    switch (action.type) {
        case SET_SHOW:
            return { ...state, isShow: action.payload };

        default:
            return { ...state };
            
    }
}

export {
    ClothesReducer,
}