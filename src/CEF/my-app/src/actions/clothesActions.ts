export const SET_SHOW = 'IS_SHOW';

function setShow(bool: boolean) {
    return (dispatch, getState) => {

        console.log('setShow', bool);

        dispatch({
            type: SET_SHOW,
            payload: bool,
        });
    };
}

export {
    setShow,
}