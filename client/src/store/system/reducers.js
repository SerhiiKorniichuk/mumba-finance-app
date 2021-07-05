import {SYSTEM_SET_PAGE} from "./actions";

const defaultState = {
    page: '',
};

export const systemReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SYSTEM_SET_PAGE:
            return {
                ...state,
                page: action.payload
            };
        default:
            return state;
    }
};