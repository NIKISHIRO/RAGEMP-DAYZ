import { DisplayUI } from "../reducers/UIReducer";

export const SET_DISPLAY_UI = 'SET_DISPLAY_UI';

function setDisplayUI(displayUI: DisplayUI) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_DISPLAY_UI,
            payload: displayUI,
        })
    };
}

export {
    setDisplayUI,
}