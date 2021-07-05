import React from "react";
import {Button, Card, CardBody, FormGroup, Input, InputGroup, Container, Row, Col, Form, Alert} from "reactstrap";
import {MUTATION_CONTACTS} from "../../helpers/Api/Schema";
import {Mutation} from "react-apollo";
import ReactPhoneInput from 'react-phone-input-2';
import {isValidPhoneNumber} from 'react-phone-number-input';
import isEmail from 'validator/lib/isEmail'
import Loader from "react-loader-spinner";
import {systemSetPage} from "../../store/system/actions";
import {connect} from "react-redux";

class Contacts extends React.Component {

    state = {
        fullName: '',
        phone: '',
        email: '',
        comment: '',
    };

    componentWillMount() {
        this.props.systemSetPage('contacts');
    }

    onChange = (e) => {
        const {name, value} = e.currentTarget;
        this.setState({[name]: value});
    };

    render() {
        const {fullName, phone, email, comment} = this.state;
        const filledAll = isValidPhoneNumber(phone) && fullName.length > 3 && isEmail(email) && comment.length > 12;
        return (
            <>
                <section className="section section-lg bg-gradient-secondary">
                    <Container>
                        <Row className="justify-content-center mt-5 mb-5">
                            <h1 className="text-black text-center">Our contacts</h1>
                        </Row>
                        <Row className="justify-content-center">
                            <Col lg="10">
                                <Card className="bg-gradient-secondary shadow">
                                    <CardBody>
                                        <h4 className="mb-1 text-center">Need more info? Write to us!</h4>
                                        <Row className="mt-5">
                                            <Col lg="6" className="text-lg-right">
                                                <p>
                                                    help@mumba.finance
                                                </p>
                                                <p>
                                                    Jl. Karang Mas, Jimbaran, Kec. Kuta Sel., Kabupaten Badung, Bali
                                                    80361
                                                </p>
                                                <div className="mb-4">
                                                    <iframe
                                                        title="Map"
                                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942.9402816753063!2d115.1512931150645!3d-8.791681192290707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd244e8b2ea8c5f%3A0xead5c2012f3ab693!2sNayla%20Boutique%20Villas%20Jimbaran!5e0!3m2!1sen!2sid!4v1611607256926!5m2!1sen!2sid"
                                                        width="100%"
                                                        height="200"
                                                        allowFullScreen
                                                    />
                                                </div>
                                            </Col>
                                            <Col lg="6">
                                                <Mutation mutation={MUTATION_CONTACTS}>
                                                    {(mutate, {data, loading, error}) => {
                                                        return (
                                                            <Form
                                                                role="form"
                                                                onSubmit={e => {
                                                                    e.preventDefault();
                                                                    mutate({variables: {fullName, phone, email, comment}});
                                                                }}
                                                            >
                                                                {error && error.graphQLErrors.map(({message}, i) => (
                                                                    <Alert color="danger" key={i}>
                                                                        {message}
                                                                    </Alert>
                                                                ))}
                                                                {data && data.contacts ? (
                                                                    <Alert color="success" key={-1}>
                                                                        Success!
                                                                    </Alert>
                                                                ) : ''}
                                                                <FormGroup>
                                                                    <InputGroup className="input-group-alternative">
                                                                        <Input
                                                                            placeholder="Your full name"
                                                                            type="text"
                                                                            name="fullName"
                                                                            onChange={this.onChange}
                                                                        />
                                                                    </InputGroup>
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <InputGroup className="input-group-alternative">
                                                                        <Input
                                                                            placeholder="Email address"
                                                                            type="email"
                                                                            name="email"
                                                                            onChange={this.onChange}
                                                                        />
                                                                    </InputGroup>
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <InputGroup className="input-group-alternative">
                                                                        <ReactPhoneInput
                                                                            style={{width: '100%'}}
                                                                            defaultCountry="us"
                                                                            value={this.state.phone}
                                                                            onChange={(value) => this.setState({phone: value})}
                                                                        />
                                                                    </InputGroup>
                                                                </FormGroup>
                                                                <FormGroup className="mb-4">
                                                                    <Input
                                                                        className="form-control-alternative"
                                                                        cols="80"
                                                                        name="comment"
                                                                        placeholder="Type a message..."
                                                                        rows="4"
                                                                        onChange={this.onChange}
                                                                        type="textarea"
                                                                    />
                                                                </FormGroup>
                                                                <div>
                                                                    <Button
                                                                        block
                                                                        className="btn-round"
                                                                        color="success"
                                                                        size="lg"
                                                                        type="submit"
                                                                        disabled={!filledAll}
                                                                    >
                                                                        { loading
                                                                            ? <Loader type="ThreeDots" color="#fff" height={7} width={45} />
                                                                            : 'Send'
                                                                        }
                                                                    </Button>
                                                                </div>
                                                            </Form>
                                                        )
                                                    }}
                                                </Mutation>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </>
        );
    }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = {
    systemSetPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
