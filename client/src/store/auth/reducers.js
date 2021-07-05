import {AUTH_SET_USER_ID, AUTH_SET_USER_PHOTO} from "./actions"

const defaultState = {
    userId: null,
    userPhoto: null,
}

export const authReducer = (state = defaultState, action) => {
    switch (action.type) {
        case AUTH_SET_USER_ID:
            return {
                ...state,
                userId: action.payload
            }
        case AUTH_SET_USER_PHOTO:
            return {
                ...state,
                userPhoto: action.payload
            }
        default:
            return state
    }
}

