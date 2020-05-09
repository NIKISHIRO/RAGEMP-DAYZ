import { UPDATE_REGISTER_PROP, SET_REGISTER } from "../actions/authActions";

export type AuthState = {
    register: {
        login: {
            val: string;
            isValid: boolean;
            isTouch: boolean,
            regular: RegExp;
        };
        password: {
            val: string;
            isValid: boolean;
            isTouch: boolean,
            regular: RegExp;
        };
        confirmPassword: {
            val: string;
            isTouch: boolean,
            isValid: boolean;
        };
        email: {
            val: string;
            isValid: boolean
            isTouch: boolean,
            regular: RegExp,
        }
    },
}

const initialState: AuthState = {
    register: {
        login: {
            val: '',
            isValid: false,
            isTouch: false,
            regular: /^[a-zA-Z0-9_-]{3,16}$/,
        },
        password: {
            val: '',
            isValid: false,
            isTouch: false,
            regular: /^[0-9a-zA-Z!@#$%^&*]{6,30}$/,
        },
        email: {
            val:'',
            isValid: false,
            isTouch: false,
            regular: /.+@.+\..+/i,
        },
        confirmPassword: {
            val: '',
            isValid: false,
            isTouch: false,
        }
    }
};

function authReducer(state = initialState, action: any) {
    switch (action.type) {
        case UPDATE_REGISTER_PROP: {
            state.register[action.prop][action.subProp] = action.value;
            
            return {
                ...state
            }
        }

        case SET_REGISTER: {
            const newState = {...state};
            newState.register = action.payload;

            return {
                ...newState,
            }
        }

        default: {
            return {
                ...state,
            }
        }
    }
}

export {
    authReducer,
}