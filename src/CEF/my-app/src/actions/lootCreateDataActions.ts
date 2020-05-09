import { LootCreateData } from "../reducers/UIReducer";

export const SET_LOOT_CREATE_DATA = 'SET_LOOT_CREATE_DATA';

function setLootCreateData(data: LootCreateData) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_LOOT_CREATE_DATA,
            payload: data,
        });
    };
}

export enum PropType {
    OBJECT_HASH = 'objectHash',
    ROTATION = 'rotation',
    POSITION = 'position',
};

function setPropLootCreateData(type: PropType, value: any) {
    return (dispatch, getState) => {
        const { UI } = getState();
        const { lootCreate } = UI;

        const loot = {...lootCreate};
        loot[type] = value;

        dispatch({
            type: SET_LOOT_CREATE_DATA,
            payload: loot,
        })
    };
}

export {
    setLootCreateData,
    setPropLootCreateData,
}