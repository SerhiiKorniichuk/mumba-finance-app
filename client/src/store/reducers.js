import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from "redux-thunk"
import { authReducer } from './auth/reducers'
import { systemReducer } from './system/reducers'
import { tabsReducer } from "./tabs/reducers"
import { modalsReducer } from "./modals/reducers"

export const rootReducer =  combineReducers({
    auth: authReducer,
    system: systemReducer,
    modals: modalsReducer,
	tabs: tabsReducer,
})

export const store = createStore(rootReducer, applyMiddleware(thunk))
