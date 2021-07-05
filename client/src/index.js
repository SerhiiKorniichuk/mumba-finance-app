import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import TagManager from 'react-gtm-module'

const tagManagerArgs = {
    gtmId: 'GTM-W6HVS7L'
}
TagManager.initialize(tagManagerArgs)


ReactDOM.render(<App />, document.getElementById('root'))

serviceWorker.unregister()
