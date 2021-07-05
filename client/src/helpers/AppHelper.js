import React from 'react';
import {authSetUserId} from "../store/auth/actions";
import {store} from "../store/reducers";
import ApiProvider from './Api/Provider';
import {authDataGet} from "../helpers/AuthUtils";
import {Provider} from 'react-redux';

export default class extends React.Component {

    componentWillMount() {
        const authData = authDataGet();
        store.dispatch(authSetUserId(authData.userId));
    }

    render() {
        return (
            <Provider store={store}>
                <ApiProvider>{this.props.children}</ApiProvider>
            </Provider>
        );
    }
}