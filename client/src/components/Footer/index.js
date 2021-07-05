/*eslint-disable*/
import React from "react";
import {Container,Row,Col, NavbarBrand} from "reactstrap";
import {Link} from 'react-router-dom';
import {MENU, SITE_NAME, FOLLOW_LINKS, LEGAL_LINKS} from "../../Config";
import * as Scroll from 'react-scroll';

let scroll = Scroll.animateScroll;


export default class extends React.Component {
	scrollOnClick = () => {
		scroll.scrollToTop();
	}
  	render() {
		return (
			<footer className="footer">
				<Container>
					<Row className="align-items-center justify-content-md-between">
						<Col lg="6">
							<div className="copyright">
								<div>
									&copy; {new Date().getFullYear()}{" "}
									<Link to="/">
										<img
											height={20}
											alt={SITE_NAME}
											src={require("assets/img/logo_dark.png")}
										/>
									</Link>
									<div className="mt-3">
										Jl. Karang Mas, Jimbaran, Kec. Kuta Sel., Kabupaten Badung, Bali 80361
									</div>
								</div>
							</div>
						</Col>
						<Col lg="6">
							<Row>
								<Col lg="4" sm="4" className="mt-2 col-4 footer__col">
									<h5 className="footer__col_title">Menu</h5>
									{MENU.map(({title, to}, i) => (<h6 key={i} className="footer__col_text">
										<Link to={to} onClick={this.scrollOnClick}>
											{title}
										</Link>
									</h6>))}
								</Col>
								<Col lg="4" sm="4" className="mt-2 col-4 footer__col">
									<h5 className="footer__col_title">Legal</h5>
									{LEGAL_LINKS.map(({title, to}, i) => (<h6 key={i} className="footer__col_text">
										<Link to={to} onClick={this.scrollOnClick}>
											{title}
										</Link>
									</h6>))}
								</Col>
								<Col lg="4" sm="4" className="mt-2 col-4 footer__col">
									<h5 className="footer__col_title">Follow us</h5>
									{FOLLOW_LINKS.map(({title, to}, i) => (<h6 key={i} className="footer__col_text">
										<a href={to} target="_blank">
											{title}
										</a>
									</h6>))}
								</Col>
							</Row>
						</Col>
					</Row>
				</Container>
			</footer>
		);
  	}
}

