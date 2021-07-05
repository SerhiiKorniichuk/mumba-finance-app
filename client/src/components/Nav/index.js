import {Nav, NavItem, NavLink} from "reactstrap";
import React from "react";
import {Link} from "react-router-dom";
import * as PropTypes from 'prop-types';

export default class extends React.Component {
    static propTypes = {
        active: PropTypes.string,
        list: PropTypes.array,
    };
    render() {
        return (
            <Nav
                className="nav-fill flex-column flex-sm-row"
                id="tabs-text"
                pills
                role="tablist"
            >
                {this.props.list.map(({title, to}, i) => ( <NavItem
                    key={i}>
                    <NavLink
                        tag={Link}
                        to={to}
                        active={this.props.active === to}
                        role="tab"
                    >
                        {title}
                    </NavLink>
                </NavItem>))}
            </Nav>
        );
    }
}