export enum HudType {
    SET_HEALTH_HUDS = 'SET_HEALTH_HUDS',
    SET_ARMOR_HUDS = 'SET_ARMOR_HUDS',
    SET_HUNGER_HUDS = 'SET_HUNGER_HUDS',
    SET_DEHYDRATION_HUDS = 'SET_DEHYDRATION_HUDS',
    SET_TEMPERATURE_HUDS = 'SET_TEMPERATURE_HUDS',
}

function setHudsData(type: HudType, value: number) {
    return (dispatch, getState) => {
        
        if (value > 100) {
            value = 100;
        }
        if (value < 0) {
            value = 0;
        }
        
        dispatch({
            type: type,
            payload: value,
        });                
    };
}

export {
    setHudsData,
}