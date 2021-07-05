import React, {Component} from 'react'
import {BrowserRouter} from 'react-router-dom'
import AppHelper from './helpers/AppHelper'

import "assets/vendor/nucleo/css/nucleo.css"
import "assets/vendor/font-awesome/css/font-awesome.min.css"
import "assets/scss/argon-design-system-react.scss"
import 'braft-editor/dist/index.css'

import Page from './components/Page'


class App extends Component {
    render() {		
        return (
            <BrowserRouter>
                <Page/>
            </BrowserRouter>
        )
    }
}

class AppWithProvider extends React.Component {
    render() {
        return (
            <AppHelper>
                <App/>
            </AppHelper>
        )
    }
}

export default AppWithProvider