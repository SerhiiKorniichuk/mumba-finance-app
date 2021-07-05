import {TOGGLE_LOGIN_MODAL, TOGGLE_SIGN_UP_MODAL, TOGGLE_RESTORE_MODAL} from "./actions"

const defaultState = {
    login: false,
    signUp: false,
    restore: false,
}

export const modalsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case TOGGLE_LOGIN_MODAL:
            return {
                ...state,
                login: action.login,
                signUp: false,
                restore: false
            }

        case TOGGLE_SIGN_UP_MODAL:
            return {
                ...state,
                signUp: action.signUp,
                restore: false,
            }

        case TOGGLE_RESTORE_MODAL:
            return {
                ...state,
                restore: action.restore,
                login: false,
                signUp: false
            }

        default:
            return state

    }
}