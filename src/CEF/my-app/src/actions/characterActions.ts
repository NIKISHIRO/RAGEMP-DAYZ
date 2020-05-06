export const SET_INITIAL_CHARACTER_STATE = 'SET_INITIAL_CHARACTER_STATE';
export const SET_FACE_FEATURE = 'SET_FACE_FEATURE';
export const SET_PARENT_INDEX = 'SET_PARENT_INDEX';
export const SET_HEAD_PROP = 'SET_HEAD_PROP';
export const SET_HAIR_ID = 'SET_HAIR_ID';
export const SET_GENDER = 'SET_GENDER';
export const SET_HAIR_COLOR = 'SET_HAIR_COLOR';
export const SET_HEAD_OVERLAY_PROP = 'SET_HEAD_OVERLAY_PROP';
export const SET_EYES_COLOR = 'SET_EYES_COLOR';

function setEyesColor(id: number) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_EYES_COLOR,
            payload: id,
        });
    };
}

function setHeadOverlayProp(overlayId: number, index: number) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_HEAD_OVERLAY_PROP,
            index,
            overlayId,
        });
    };
}

function setHairColor(id: number) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_HAIR_COLOR,
            payload: id,
        });
    };
}

function setGender(gender: 'male' | 'female') {
    return (dispatch, getState) => {
        dispatch({
            type: SET_GENDER,
            payload: gender,
        });
    };
}

function setHairId(id: number) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_HAIR_ID,
            payload: id,
        });
    };
}

function setInitialCharacter() {
    return (dispatch, getState) => {
        dispatch({
            type: SET_INITIAL_CHARACTER_STATE,
        });
    };
}

function setFaceFeature(index: number, feature: number) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_FACE_FEATURE,
            faceIndex: index,
            feature: feature,
        })
    };
}

function setParentIndex(parent: string, index: number) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_PARENT_INDEX,
            parent: parent,
            index: index,
        });
    };
}

function setHeadProp(name: string, value: number) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_HEAD_PROP,
            name,
            value,
        });
    };
}

export {
    setInitialCharacter,
    setFaceFeature,
    setParentIndex,
    setHeadProp,
    setHairId,
    setGender,
    setHairColor,
    setHeadOverlayProp,
    setEyesColor,
}