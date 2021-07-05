import React, {Component, createRef} from 'react'
import {connect} from 'react-redux'
import {MENU} from "../../Config"
import {Link, Redirect} from "react-router-dom"
import './CustomHeader.scss'
import {authSetUserId} from "../../store/auth/actions"
import {setSelectedTab} from "../../store/tabs/actions"
import {Query} from "react-apollo"
import {QUERY_HEADER_INFO} from "../../helpers/Api/Schema"
import Login from "../Modal/Login"
import Signup from "../Modal/Signup"
import Restore from "../Modal/Restore"
import Skeleton from "react-loading-skeleton"
import UserAvatar from "react-user-avatar"
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap"
import {getTransactionsData} from "../../store/tabs/api"
import {authDataDelete} from "../../helpers/AuthUtils"
import Headroom from "headroom.js"
import TagManager from "react-gtm-module"
import {gtmEvent} from "../../helpers/GTM/events"
import {toggleLoginModal, toggleRestoreModal, toggleSingUpModalWithGTM} from "../../store/modals/actions"


class HeaderMobileMenu extends Component {

    constructor(props) {
        super(props)
        this.headerMobileMenu = createRef()
        this.state = { menuHeadHeight: 0 }
    }

    componentDidMount() {
        const menuHeadHeight = this.headerMobileMenu.current.clientHeight
        this.setState({menuHeadHeight})
    }

    getLoggedMenu = () => {
        if (!this.props.userId) {
            return null
        }

        return (
            <Query query={QUERY_HEADER_INFO}>
                {({loading, error, data}) => {

                    if (!loading && (!data || !data.viewer || error)) {
                        this.props.onExit()
                        return <Redirect to="/"/>
                    }

                    return (
                        <>
                            <div className="divider"/>

                            <div className="mumba-header-mob-nav__item">
                                <Link
                                    to="/dashboard"
                                    className="mumba-header-mob-nav__link"
                                    onClick={() => {
                                        this.props.toggleMobileMenu()
                                        this.props.setSelectedTab(0)
                                    }}
                                >
                                    Dashboard
                                </Link>
                            </div>

                            <div className="mumba-header-mob-nav__item">
                                <Link
                                    to="/dashboard"
                                    className="mumba-header-mob-nav__link"
                                    onClick={() => {
                                        this.props.toggleMobileMenu()
                                        this.props.setSelectedTab(1)
                                    }}
                                >
                                    Profit
                                </Link>
                            </div>

                            <div className="mumba-header-mob-nav__item">
                                <Link
                                    to="/dashboard"
                                    className="mumba-header-mob-nav__link"
                                    onClick={() => {
                                        this.props.toggleMobileMenu()
                                        this.props.setSelectedTab(2)
                                        getTransactionsData()
                                    }}
                                >
                                    Transactions
                                </Link>
                            </div>

                            <div className="divider"/>

                            {!loading && data.viewer && data.viewer.isAdmin &&
                            <div className="mumba-header-mob-nav__item">
                                <Link
                                    to="/admin"
                                    className="mumba-header-mob-nav__link"
                                    onClick={this.props.toggleMobileMenu}
                                >
                                    Control panel
                                </Link>
                            </div>
                            }

                            <div className="mumba-header-mob-nav__item">
                                <Link
                                    to="/settings"
                                    className="mumba-header-mob-nav__link"
                                    onClick={this.props.toggleMobileMenu}
                                >
                                    Settings
                                </Link>
                            </div>

                            <div className="divider"/>

                            <div className="mumba-header-mob-nav__item">
                                <span
                                    className="mumba-header-mob-nav__link"
                                    onClick={() => {
                                        this.props.onExit()
                                        this.props.toggleMobileMenu()
                                    }}
                                >
                                    Logout
                                </span>
                            </div>
                        </>
                    )
                }}
            </Query>
        )
    }

    render() {
        const maxHeightForBody = window.innerHeight - this.state.menuHeadHeight

        return (
            <div className="header-mobile-menu">
                <div className="main-container">
                    <div ref={this.headerMobileMenu} className="header-mobile-menu__head">
                        <Link to="/" className="mumba-header-logo" onClick={this.props.toggleMobileMenu}>
                            <img src={require("assets/img/logo_dark.png")} alt="Logo"/>
                        </Link>
                        {this.props.getToggleMenuBtn()}
                    </div>
                    <div className="header-mobile-menu__body" style={{height: maxHeightForBody}}>
                        <div className="mumba-header-mob-nav">
                            <div className="mumba-header-mob-nav__body">
                                {MENU.map(({title, to}, index) => (
                                    <div key={index} className="mumba-header-mob-nav__item">
                                        <Link
                                            to={to}
                                            className="mumba-header-mob-nav__link"
                                            onClick={this.props.toggleMobileMenu}
                                        >
                                            {title}
                                        </Link>
                                    </div>
                                ))}
                                {this.getLoggedMenu()}
                            </div>
                            <div className="mumba-header-mob-nav__footer">
                                {!this.props.userId &&
                                <button
                                    className="t1-btn t1-btn--green"
                                    onClick={() => {
                                        this.props.toggleMobileMenu()
                                        this.props.toggleSignUp()
                                    }}
                                >
                                    <span>Login / Sign In</span>
                                </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


class CustomHeader extends Component {

    state = {
        fullName: '',
        profileDropDown: false,
        openMobileMenu: false,
        windowInnerWith: 0
    }

    componentDidMount() {
        this.headroom = new Headroom(document.getElementById('custom-header'))
        this.headroom.init();
        this.getWindowInnerWith()
        window.addEventListener('resize', this.getWindowInnerWith, true)
        window.addEventListener('scroll', this.onScroll, true)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.userId !== this.props.userId && this.props.userId !== 0) {
            TagManager.dataLayer(gtmEvent.TMUserLogged)
            console.log('TMUserLogged')
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.getWindowInnerWith, true)
        window.removeEventListener('scroll', this.onScroll, true)
    }

    getWindowInnerWith = () => {
        const {innerWidth: width} = window
        this.setState({windowInnerWith: width})
    }

    onScroll = () => {
        if (this.state.profileDropDown) {
            this.setState({profileDropDown: false})
        }
    }

    toggleLogin = () => {
        this.props.toggleLoginModal(!this.props.login)
    }

    toggleSignUp = () => {
        this.props.toggleSingUpModalWithGTM(!this.props.signUp)
        this.setState({ profileDropDown: false })
    }

    toggleRestore = () => {
        this.props.toggleRestoreModal(!this.props.restore)
    }

    toggleProfileDropDown = () => {
        this.setState(prevState => ({profileDropDown: !prevState.profileDropDown}))
    }

    toggleMobileMenu = () => {
        this.setState(prevState => ({openMobileMenu: !prevState.openMobileMenu}))
    }

    onExit = () => {
        authDataDelete()
        this.props.authSetUserId(0)
        this.props.toggleLoginModal(false)
        this.props.toggleSingUpModalWithGTM(false)
        this.props.toggleRestoreModal(false)
        this.setState({ profileDropDown: false })
    }

    unauthorizedModals = () => {
        let unauthorizedModals = ''
        if (!this.props.userId) {
            unauthorizedModals = (
                <>
                    <Login toggle={this.toggleLogin} signup={this.toggleSignUp} restore={this.toggleRestore} isOpen={this.props.login} />
                    <Signup toggle={this.toggleSignUp} login={this.toggleLogin} isOpen={this.props.signUp} />
                    <Restore toggle={this.toggleRestore} login={this.toggleLogin} isOpen={this.props.restore} />
                </>
            )
        }
        return <>{unauthorizedModals}</>
    }

    getToggleMenuBtn = () => {
        return (
            <button
                className={`mumba-header-toggle-btn ${this.state.openMobileMenu ? '_active' : ''}`}
                onClick={this.toggleMobileMenu}
            >
                <div className="mumba-header-toggle-btn__body">
                    <span/>
                </div>
            </button>
        )
    }

    getDropDownMenu = () => {
        if (!this.props.userId) {
            return (
                <button id="singUpBtn" className="t1-btn t1-btn--green" onClick={this.toggleSignUp}>
                    <span>Login / Sign In</span>
                </button>
            )
        }

        return (
            <Query query={QUERY_HEADER_INFO}>
                {({loading, error, data}) => {

                    if (!loading && (!data || !data.viewer || error)) {
                        this.onExit();
                        return <Redirect to="/"/>
                    }

                    const fullName = loading || error ? '' : `${data.viewer.firstName} ${data.viewer.lastName}`;

                    return (
                        <Dropdown
                            className="user-dropdown-menu"
                            isOpen={this.state.profileDropDown}
                            toggle={this.toggleProfileDropDown}
                        >
                            <DropdownToggle className="t1-btn t1-btn--purple">
                                <div className="user-preview">
                                    <div className="user-preview__photo">
                                        {loading
                                            ? <Skeleton width={30} height={30}/>
                                            : <UserAvatar
                                                src={this.props.userPhoto !== null ? this.props.userPhoto : data.viewer.photo}
                                                size="30"
                                                name={fullName}
                                            />
                                        }
                                    </div>
                                    <div className="user-preview__name">
                                        {loading
                                            ? <Skeleton width={100}/>
                                            : <span>{fullName}</span>
                                        }
                                    </div>
                                </div>
                            </DropdownToggle>

                            <DropdownMenu>
                                <DropdownItem
                                    tag={Link} to="/dashboard"
                                    onClick={() => {
                                        this.props.setSelectedTab(0)
                                    }}
                                >
                                    Dashboard
                                </DropdownItem>

                                <DropdownItem
                                    tag={Link} to="/dashboard"
                                    onClick={() => {
                                        this.props.setSelectedTab(1)
                                    }}
                                >
                                    Profit
                                </DropdownItem>

                                <DropdownItem
                                    tag={Link} to="/dashboard"
                                    onClick={() => {
                                        this.props.setSelectedTab(2)
                                        getTransactionsData()
                                    }}
                                >
                                    Transactions
                                </DropdownItem>

                                <DropdownItem divider/>

                                {!loading && data && data.viewer.isAdmin && (
                                    <DropdownItem tag={Link} to="/admin">Control panel</DropdownItem>
                                )}

                                <DropdownItem tag={Link} to="/settings">Settings</DropdownItem>

                                {this.state.windowInnerWith <= 991 && (
                                    <>
                                        <DropdownItem divider/>

                                        <DropdownItem tag={Link} to="/about">About</DropdownItem>

                                        <DropdownItem tag={Link} to="/token">Token</DropdownItem>

                                        <DropdownItem tag={Link} to="/Legal">Legal</DropdownItem>

                                        <DropdownItem tag={Link} to="/contacts">Contacts</DropdownItem>
                                    </>
                                )}

                                <DropdownItem divider/>

                                <DropdownItem onClick={this.onExit}>Logout</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    )
                }}
            </Query>
        )
    }

    getDesktopHeader = () => {
        return (
            <>
                <Link to="/" className="mumba-header-logo">
                    <img src={require("assets/img/logo_dark.png")} alt="Logo"/>
                </Link>
                <nav className="mumba-header-nav">
                    {(!this.props.userId || this.state.windowInnerWith >= 992) && MENU.map(({title, to}, index) => (
                        <div key={index} className="mumba-header-nav__item">
                            <Link to={to} className="mumba-header-nav__link">
                                {title}
                            </Link>
                        </div>
                    ))}
                </nav>
                <div className="mumba-header-menu">
                    {this.getDropDownMenu()}
                </div>
            </>
        )
    }

    getMobileHeader = () => {
        return (
            <>
                <Link to="/" className="mumba-header-logo">
                    <img src={require("assets/img/logo_dark.png")} alt="Logo"/>
                </Link>
                {this.getToggleMenuBtn()}
            </>
        )
    }

    render() {
        return (
            <header>
                <div id="custom-header" className="mumba-header">
                    <div className="main-container">
                        <div className="mumba-header__body">
                            {this.state.windowInnerWith >= 992
                                ? this.getDesktopHeader()
                                : this.getMobileHeader()
                            }
                        </div>
                    </div>
                </div>
                {(this.state.openMobileMenu && this.state.windowInnerWith < 992) &&
                    <HeaderMobileMenu
                        userId={this.props.userId}
                        toggleSignUp={this.toggleSignUp}
                        toggleMobileMenu={this.toggleMobileMenu}
                        getToggleMenuBtn={this.getToggleMenuBtn}
                        setSelectedTab={this.props.setSelectedTab}
                        onExit={this.onExit}
                    />
                }
                {this.unauthorizedModals()}
            </header>
        )
    }
}

const mapStateToProps = ({auth, system, modals}) => ({
    userId: auth.userId,
    userPhoto: auth.userPhoto,
    page: system.page,
    login: modals.login,
    signUp: modals.signUp,
    restore: modals.restore
})

const mapDispatchToProps = {
    toggleLoginModal,
    toggleSingUpModalWithGTM,
    toggleRestoreModal,
    authSetUserId,
    setSelectedTab,
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomHeader)