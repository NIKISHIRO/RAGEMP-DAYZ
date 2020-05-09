export const UPDATE_REGISTER_PROP = 'UPDATE_REGISTER_PROP';
export const SET_REGISTER = 'SET_REGISTER';

function updateAuthProp(prop: string, subProp: string, value: any) {
    return (dispatch, getState) => {
        dispatch({
            type: UPDATE_REGISTER_PROP,
            prop,
            subProp,
            value,
        });
    };
}

function setRegister(register: any) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_REGISTER,
            payload: register
        });
    };
}

export {
    updateAuthProp,
    setRegister,
}