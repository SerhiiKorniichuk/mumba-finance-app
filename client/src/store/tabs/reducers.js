import {SELECTED_TAB} from '../tabs/actions'

const defaultState = {
    tabIndex: 0,
};

export const tabsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SELECTED_TAB:
            return {
                ...state,
                tabIndex: action.tabIndex
            };
        default:
            return state;
    }
};