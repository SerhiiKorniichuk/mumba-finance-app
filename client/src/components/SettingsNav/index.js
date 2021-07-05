import React from "react";
import Nav from "../Nav";


export default class extends React.Component {
    render() {
        return (
            <Nav active={this.props.active} list={[
                {title: 'Main', to: '/settings'},
                {title: 'Security', to: '/settings/security'},
                {title: 'Notifications', to: '/settings/notifications'},
            ]}/>
        );
    }
}
