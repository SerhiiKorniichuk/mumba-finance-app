import React from "react";
import { authSetUserId } from "../../store/auth/actions";
import { setSelectedTab } from "../../store/tabs/actions";
import { getTransactionsData } from '../../store/tabs/api';

import { Link, Redirect } from "react-router-dom";
import Headroom from "headroom.js";
import { Button, NavbarBrand, Navbar, NavItem, NavLink, Nav, Container, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Row, Col } from "reactstrap";
import { SITE_NAME, MENU } from "../../Config";
import Login from '../Modal/Login';
import Signup from '../Modal/Signup';
import { authDataDelete } from "../../helpers/AuthUtils";
import { connect } from "react-redux";
import Restore from "../Modal/Restore";
import Collapse from "reactstrap/es/Collapse";
import { QUERY_HEADER_INFO } from '../../helpers/Api/Schema';
import { Query } from "react-apollo";
import Skeleton from "react-loading-skeleton";
import './Styles.scss';
import UserAvatar from "react-user-avatar";


class Header extends React.Component {
	state = {
		Login: false,
		Signup: false,
		Restore: false,
		profileDropDown: false,
		collapsed: false,
		windowInnerWith: 0
	};

	toggleLogin = () => this.setState({ Login: !this.state.Login, Signup: false, Restore: false });
	toggleSignup = () => this.setState({ Signup: !this.state.Signup, Restore: false });
	toggleRestore = () => this.setState({ Restore: !this.state.Restore, Login: false, Signup: false });

	componentDidMount() {
		this.headroom = new Headroom(document.getElementById('header_main'));
		this.headroom.init();
		this.getWindowInnerWidth()
		window.addEventListener('resize', this.getWindowInnerWidth, true)
	}

	getWindowInnerWidth = () => {
		const { innerWidth: width } = window
		this.setState({ windowInnerWith: width })
	}

	onExit = () => {
		authDataDelete();
		this.props.authSetUserId(0);
		this.setState({ profileDropDown: false, Signup: false, Login: false, Restore: false });
	};


	toggleProfileDropDown = () => {
		this.setState(prevState => ({
			profileDropDown: !prevState.profileDropDown
		}));
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.page !== this.props.page) {
			window.GOOGLE_ANALYTICS('send', 'pageview');
		}
	}

	getMenu = () => {
		if (!this.props.userId) {
			return (
				<>
					<NavItem>
						<Button
							href="#"
							id="singUpBtn"
							className="btn-neutral btn-icon"
							color="default"
							onClick={(event) => {
								event.preventDefault();
								this.toggleSignup();
								this.setState({ collapsed: false });
							}}>
						<span className="nav-link-inner--text ">
							Sign up
						</span>
						</Button>
					</NavItem>
					<NavItem className="d-none d-lg-block ml-lg-4">
						<NavLink
							onClick={() => {
								this.toggleLogin();
								this.setState({ collapsed: false });
							}}>
							Login
						</NavLink>
					</NavItem>
					<NavItem className="d-lg-none">
						<Button
							id="loginBtn"
							className="btn-neutral btn-icon"
							color="default"
							onClick={() => {
								this.toggleLogin();
								this.setState({ collapsed: false });
							}}>
						<span className="nav-link-inner--text ">
							Login
						</span>
						</Button>
					</NavItem>
				</>
			)
		}
		return (
			<NavItem>
				<Query query={QUERY_HEADER_INFO}>
					{({ loading, error, data }) => {
						if (!loading && (!data || !data.viewer || error)) {
							this.onExit();
							return <Redirect to="/" />
						}
						const fullName = loading || error ? '' : `${data.viewer.firstName} ${data.viewer.lastName}`;
						return (
							<Dropdown isOpen={(this.state.windowInnerWith < 992) ? true : this.state.profileDropDown} toggle={this.toggleProfileDropDown}>
								<DropdownToggle className="bg-gradient-white" style={{ textTransform: 'none' }}>
									<Row>
										<Col xs="3" className="Header--User-Avatar">
											<div className="rounded-circle Header--User-Avatar-Inner text-white">
												{loading ? <Skeleton width={30} height={30} /> : <UserAvatar
													src={this.props.userPhoto !== null ? this.props.userPhoto : data.viewer.photo}
													size="30"
													name={fullName}
												/>}
											</div>
										</Col>
										<Col xs="9" className="Header--User-Name">
											{loading ? <Skeleton width={100} /> : fullName}
										</Col>
									</Row>
								</DropdownToggle>
								<DropdownMenu style={{ marginTop: 10 }}>

									<DropdownItem
										tag={Link} to="/dashboard"
										onClick={() => {
											this.setState({ collapsed: false })
											this.props.setSelectedTab(0)
										}}
									>
										Dashboard
									</DropdownItem>

									<DropdownItem
										tag={Link}
										to="/dashboard"
										onClick={() => {
											this.setState({ collapsed: false })
											this.props.setSelectedTab(1)
										}}
									>
										Profit
									</DropdownItem>

									<DropdownItem
										tag={Link}
										to="/dashboard"
										onClick={() => {
											this.setState({ collapsed: false })
											this.props.setSelectedTab(2)
											getTransactionsData()
										}}
									>
										Transactions
									</DropdownItem>

									<DropdownItem divider />

									{!loading && data && data.viewer.isAdmin ? (<DropdownItem tag={Link} to="/admin" onClick={() => this.setState({ collapsed: false })} >Control panel</DropdownItem>) : ''}

									<DropdownItem
										tag={Link}
										to="/settings"
										onClick={() => this.setState({ collapsed: false })}
									>
										Settings
									</DropdownItem>

									{this.state.windowInnerWith <= 991 && (
										<>
											<DropdownItem divider />
											<DropdownItem tag={Link} to="/about" onClick={() => this.setState({ collapsed: false })}>About</DropdownItem>
											<DropdownItem tag={Link} to="/token" onClick={() => this.setState({ collapsed: false })}>Token</DropdownItem>
											<DropdownItem tag={Link} to="/Legal" onClick={() => this.setState({ collapsed: false })}>Legal</DropdownItem>
											<DropdownItem tag={Link} to="/contacts" onClick={() => this.setState({ collapsed: false })} >Contacts</DropdownItem>
										</>
									)}
									<DropdownItem divider />
									<DropdownItem onClick={() => {
										this.onExit();
										this.setState({ collapsed: false });
									}}>Logout</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						);
					}}
				</Query>
			</NavItem>
		);
	};

	unauthorizedModals = () => {
		let unauthorizedModals = '';
		if (!this.props.userId) {
			unauthorizedModals = (<>
				<Login toggle={this.toggleLogin} signup={this.toggleSignup} restore={this.toggleRestore} isOpen={this.state.Login} />
				<Signup toggle={this.toggleSignup} login={this.toggleLogin} isOpen={this.state.Signup} />
				<Restore toggle={this.toggleRestore} login={this.toggleLogin} isOpen={this.state.Restore} />
			</>);
		}
		return <>{unauthorizedModals}</>;
	};

	getClasses = () => {
		const { page } = this.props;
		if (page === 'dashboard' || page === 'staticPage' || page.match(/admin/gi) || page.match(/settings/gi)) {
			return 'bg-gradient-blue shadow';
		}
		return '';
	};

	toggleNavbar = () => {
		this.setState({
			collapsed: !this.state.collapsed
		});
	};

	render() {
		return (
			<header className="header-global">
				<Navbar
					className={`navbar-main navbar-transparent navbar-light ${this.getClasses()}`}
					expand="lg"
					id="header_main"
				>
					<Container>
						<NavbarBrand className="mr-lg-5" to="/" tag={Link}>
							<img src={require("assets/img/logo.png")} alt={SITE_NAME} />
						</NavbarBrand>
						<button className="navbar-toggler" onClick={this.toggleNavbar} >
							<span className="navbar-toggler-icon" />
						</button>
						<Collapse navbar isOpen={this.state.collapsed} >
							<div className="navbar-collapse-header">
								<Row>
									<Col className="collapse-brand" xs="6">
										<Link to="/" onClick={() => this.setState({ collapsed: false })}>
											<img src={require("assets/img/logo_dark.png")} alt={SITE_NAME} className="mr-2" />
										</Link>
									</Col>
									<Col className="collapse-close" xs="6">
										<button className="navbar-toggler" onClick={this.toggleNavbar} >
											<span />
											<span />
										</button>
									</Col>
								</Row>
							</div>
							<Nav className="align-items-lg-center ml-lg-auto" navbar>
								{(!this.props.userId || this.state.windowInnerWith >= 992) && MENU.map(({ title, to }, i) => (
									<NavItem key={i}>
										<NavLink to={to} tag={Link} onClick={() => this.setState({ collapsed: false })}>
											{title}
										</NavLink>
									</NavItem>
								))}
								{(!this.props.userId || this.state.windowInnerWith >= 992) && <a href="/#teams_section" className="nav-link">Partners and Advisors</a>}
								{this.getMenu()}
							</Nav>
						</Collapse>
					</Container>
				</Navbar>
				{this.unauthorizedModals()}
			</header>
		);
	}
}

const mapStateToProps = ({ auth, system }) => ({
	userId: auth.userId,
	userPhoto: auth.userPhoto,
	page: system.page
});

const mapDispatchToProps = {
	authSetUserId,
	setSelectedTab,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
