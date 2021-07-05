import React from 'react';
import Row from "reactstrap/es/Row";
import {Col, Container} from "reactstrap";
import {systemSetPage} from "../../store/system/actions";
import {connect} from "react-redux";

class NotFound extends React.Component {
    componentWillMount() {
        this.props.systemSetPage('notFound');
    }
    render() {
        return (<>
            <section className="section section-lg bg-gradient-pink">
                <Container>
                    <Row className="justify-content-center my-5">
                        <Col lg="10">
                            <Row className="justify-content-center">
                                <Col lg="3">
                                    <img src={require("assets/img/not_found.svg")}  alt="Page not found" className="img-fluid"/>
                                </Col>
                            </Row>
                            <p>
                                <h1 className="text-white text-center  my-1">Page not found</h1>
                            </p>
                        </Col>
                    </Row>
                </Container>
                <div className="separator separator-bottom separator-skew zindex-100">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        viewBox="0 0 2560 100"
                        x="0"
                        y="0"
                    >
                        <polygon
                            className="fill-white"
                            points="2560 0 2560 100 0 100"
                        />
                    </svg>
                </div>
            </section>
        </>);
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
    systemSetPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotFound);
