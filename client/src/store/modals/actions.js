import TagManager from "react-gtm-module"
import {gtmEvent} from "../../helpers/GTM/events"


export const TOGGLE_LOGIN_MODAL = 'TOGGLE_LOGIN_MODAL'
export const TOGGLE_SIGN_UP_MODAL = 'TOGGLE_SIGN_UP_MODAL'
export const TOGGLE_RESTORE_MODAL = 'TOGGLE_RESTORE_MODAL'


// Actions

export const toggleLoginModal = (toggleValue) => ({
    type: TOGGLE_LOGIN_MODAL,
    login: toggleValue
})

const toggleSingUpModal = (toggleValue) => ({
    type: TOGGLE_SIGN_UP_MODAL,
    signUp: toggleValue
})

export const toggleRestoreModal = (toggleValue) => ({
    type: TOGGLE_RESTORE_MODAL,
    restore: toggleValue
})


// Thunks

export function toggleSingUpModalWithGTM(toggleValue) {
    return (dispatch, getState) => {
        const { modals } = getState()
        dispatch(toggleSingUpModal(toggleValue))
        if (!modals.signUp) {
            TagManager.dataLayer(gtmEvent.TMOpenSingUpModal)
            console.log('TMOpenSingUpModal')
        }
    }
}