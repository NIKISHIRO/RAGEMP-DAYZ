import { SET_FACE_FEATURE, SET_INITIAL_CHARACTER_STATE, SET_PARENT_INDEX, SET_HEAD_PROP, SET_HAIR_ID, SET_GENDER, SET_HAIR_COLOR, SET_HEAD_OVERLAY_PROP, SET_EYES_COLOR } from "../actions/characterActions";

export type FaceType = {
        index: number;
        feature: number;
        name: string;
}; 

export type HeadType = {
    mother: {
        index: number;
    };
    father: {
        index: number;
    };
};

export type CharacterState = {
    defaultState: {
        face: FaceType[];
        head: HeadType;
        similarity: number;
        skin: number;
        hair: number;
        gender: 'male' | 'female';
        hairColorId: number;
        headOverlay: HeadOverlay[];
        eyes: number;
    };

    face: FaceType[];
    head: HeadType;
    similarity: number;
    skin: number;
    hair: number;
    gender: 'male' | 'female';
    hairColorId: number;
    headOverlay: HeadOverlay[];
    eyes: number;
};

export type HeadOverlay = {
    overlayId: number;
    index: number;
    name: string;
};

const defaultHead: HeadType = {
    father: { index: 0 },
    mother: { index: 0 },
};

const defaultFace: FaceType[] = [
    { index: 0, feature: -1.0, name: 'Ширина носа' },
    { index: 1, feature: -1.0, name: 'Высота носа' },
    { index: 2, feature: -1.0, name: 'Длина кончика носа' },
    { index: 3, feature: -1.0, name: 'Глубина моста носа' },
    { index: 4, feature: -1.0, name: 'Высота кончика носа' },
    { index: 5, feature: -1.0, name: 'Поломаность носа' },
    { index: 6, feature: -1.0, name: 'Высота бровей' },
    { index: 7, feature: -1.0, name: 'Глубина бровей' },
    { index: 8, feature: -1.0, name: 'Высота скул' },
    { index: 9, feature: -1.0, name: 'Ширина скул' },
    { index: 10, feature: -1.0, name: 'Глубина щек' },
    { index: 11, feature: -1.0, name: 'Размер глаз' },
    { index: 12, feature: -1.0, name: 'Толщина глуб' },
    { index: 13, feature: -1.0, name: 'Ширина челюсти' },
    { index: 14, feature: -1.0, name: 'Форма челюсти' },
    { index: 15, feature: -1.0, name: 'Высота подбородка' },
    { index: 16, feature: -1.0, name: 'Глубина подбородка' },
    { index: 17, feature: -1.0, name: 'Ширина подбородка' },
    { index: 18, feature: -1.0, name: 'Подбородочный отступ' },
    { index: 19, feature: -1.0, name: 'Обхват шеи' },
];

const defaultHeadOverlay = [
    { overlayId: 0, index: 0, name: 'Физические деффекты' },
    { overlayId: 1, index: 0, name: 'Волосы на лице' },
    { overlayId: 2, index: 0, name: 'Брови' },
    { overlayId: 3, index: 0, name: 'Старение' },
    { overlayId: 4, index: 0, name: 'Грим' },
    { overlayId: 5, index: 0, name: 'Румянец' },
    { overlayId: 6, index: 0, name: 'Цвет лица' },
    { overlayId: 7, index: 0, name: 'Загар' },
    { overlayId: 8, index: 0, name: 'Губы' },
    { overlayId: 9, index: 0, name: 'Родинки/веснушки' },
    { overlayId: 10, index: 0, name: 'Волосы на груди' },
    { overlayId: 11, index: 0, name: 'Пятна на теле' },
    { overlayId: 12, index: 0, name: 'Оставить пятна на теле?' },
];

const initialState: CharacterState = {
    defaultState: {
        headOverlay: JSON.parse(JSON.stringify(defaultHeadOverlay)),
        face: JSON.parse(JSON.stringify(defaultFace)),
        head: JSON.parse(JSON.stringify(defaultHead)),
        similarity: 0.5,
        skin: 0.5,
        hair: 0,
        gender: 'male',
        hairColorId: 0,
        eyes: 0,
    },
    headOverlay: defaultHeadOverlay,
    head: {...defaultHead},
    face: [...defaultFace],
    similarity: 0.5,
    skin: 0.5,
    hair: 0,
    gender: 'male',
    hairColorId: 0,
    eyes: 0,
};

function characterReducer(state = initialState, action: any) {
    switch (action.type) {

        case SET_EYES_COLOR: {
            state.eyes = action.payload;

            return {
                ...state,
            };
        }

        case SET_HEAD_OVERLAY_PROP: {
            state.headOverlay[action.overlayId].index = action.index;

            return {
                ...state,
            }        
        }

        case SET_HAIR_COLOR: {
            return {
                ...state,
                hairColorId: action.payload,
            }
        }

        case SET_GENDER: {
            state.gender = action.payload;
            return {
                ...state
            }
        }

        case SET_HAIR_ID: {
            state.hair = action.payload;
            return {
                ...state,
            }   
        }

        case SET_HEAD_PROP: {
            return {
                ...state,
                [action.name]: action.value,
            }
        }

        case SET_PARENT_INDEX: {
            state.head[action.parent].index = action.index;

            return {
                ...state,
            };
        }

        case SET_FACE_FEATURE:
            const characterState = {...state};
            const face = {...characterState.face};
            const faceIndex = action.faceIndex;
            const feature = action.feature;
            face[faceIndex].feature = feature;

            return {
                ...characterState,
            }

        case SET_INITIAL_CHARACTER_STATE: {
            return {
                ...state,
                ...JSON.parse(JSON.stringify(state.defaultState)),
            }
        }

        default: 
            return state;
    }
}

export {
    characterReducer,
}