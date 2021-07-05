import React from "react";
import {Container, Row, Col, Alert, NavItem, Nav, NavLink} from "reactstrap";
import {connect} from 'react-redux';
import {systemSetPage} from '../../store/system/actions';
import {QUERY_STATIC_PAGE} from "../../helpers/Api/Schema";
import {Query} from "react-apollo";
import Skeleton from "react-loading-skeleton";
import {LEGAL_LINKS} from "../../Config";
import {Link} from "react-router-dom";


class StaticPage extends React.Component {
    
	componentWillMount() {
        this.props.systemSetPage('staticPage');
    }

    isLegalPage = () => {
        let isLegal = false;
        LEGAL_LINKS.forEach(({to}) => {
            if (this.props.location.pathname === to) {
              isLegal = true;
            }
        });
        return isLegal;
    };

    render() {
        
		const page = this.props.match.path;

		console.log(page)

        return(
			<Query query={QUERY_STATIC_PAGE} variables={{page}}>
				{({loading, error, data}) => {
					let title;
					let content;
					if (loading) {
						title = (<Skeleton />);
						content = (<Skeleton count={40} />);
					} else if (data && data.getStaticPage) {
						title = data.getStaticPage.title;
						content = (<div dangerouslySetInnerHTML={{ __html: data.getStaticPage.content}} />);
					} else {
						title ='';
						content = (<Row className="justify-content-center my-5">
								<Col lg="10">
									<Row className="justify-content-center">
										<Col lg="3">
											<img alt="Page not found" src={require("assets/img/not_found.svg")} className="img-fluid"/>
										</Col>
									</Row>
									<div>
										<h1 className="text-center  my-1">Page not found</h1>
									</div>
								</Col>
							</Row>);
					}
					return (
						<section className="section section-lg bg-gradient-secondary">
							<Container>
								<div className="pt-4">
									<div className="nav-wrapper">
										<Nav
											className="nav-fill flex-column flex-md-row"
											pills
											role="tablist"
										>
											{this.isLegalPage() ? LEGAL_LINKS.map(({title, to}, i) => (<NavItem key={i}>
												<NavLink
													to={to}
													tag={Link}
													active={this.props.location.pathname === to}
												>
													{title}
												</NavLink>
											</NavItem>)) : ''}
										</Nav>
									</div>
									<Row className="text-center justify-content-center">
										<Col lg="10">
											{error && error.graphQLErrors.map(({ message }, i) => (
												<Alert color="danger" key={i}>
													{message}
												</Alert>
											))}
											<h2 className="display-3 ">
												{title}
											</h2>
										</Col>
									</Row>
									<Row className="mt-5">
										<Col lg="12">
											{content}
										</Col>
									</Row>
								</div>
							</Container>
						</section>
					);
				}}
			</Query>
		)
    }
}


const mapStateToProps = ({auth}) => ({
    userId: auth.userId
});

const mapDispatchToProps = {
    systemSetPage
};

export default connect(mapStateToProps, mapDispatchToProps)(StaticPage);
