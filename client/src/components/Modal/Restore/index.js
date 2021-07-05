import React from 'react';
import {connect} from "react-redux";
import Loader from 'react-loader-spinner';
import {
    Button,
    Modal,
    Card,
    CardBody,
    Alert,
    Form,
    FormGroup,
    InputGroup,
    Input,
    Row,
    Col,
    InputGroupAddon, InputGroupText,
} from 'reactstrap';
import {SITE_NAME} from '../../../Config';
import {MUTATION_RESTORE} from '../../../helpers/Api/Schema';
import {Mutation} from "react-apollo";
import {CloseOutlined} from "@material-ui/icons";


class Restore extends React.Component {
    state = {
        step: 'login',
        username: '',
        emailCode: '',
        emailResend: false,
        password: '',
        passwordRepeat: '',
        passwordShow: false,
        repeatPasswordShow: false,
    };

    prepareOpen = () => {
        this.setState({
            step: 'login',
            username: '',
            emailCode: '',
            emailResend: false,
            password: '',
            passwordRepeat: '',
            passwordShow: false,
            repeatPasswordShow: false,

        });
    };

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (nextProps.isOpen && !this.props.isOpen) {
            this.prepareOpen();
        }
    }

    onClose = () => {
        this.props.toggle();
    };

    onChange = (e) => {
        const { name, value } = e.currentTarget;
        this.setState({ [name]: value });
    };

    onChangeCode = (e) => {
        const { name, value } = e.currentTarget;
        this.setState({ [name]: value.replace(/[^0-9]/g, '').slice(0, 6) });
    };


    setPasswordShow = (e) => {
        e.preventDefault();
        this.setState({passwordShow: !this.state.passwordShow});
    };

    setRepeatPasswordShow = (e) => {
        e.preventDefault();
        this.setState({RepeatPasswordShow: !this.state.RepeatPasswordShow});
    };

    render() {
        const {username, emailCode, emailResend} = this.state;
        const {password, passwordRepeat, step} = this.state;
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.onClose} className={this.props.className} backdrop={'static'}>
                <button className="modal-close-btn" onClick={this.onClose}>
                    <CloseOutlined />
                </button>
                <Card className="purple-gradient-bg shadow border-0">
                    <h3 className="m-5 text-center text-white">Forgot password in {SITE_NAME}?</h3>
                    <CardBody className="px-lg-4 py-lg-4 card bg-secondary">
                        <Mutation mutation={MUTATION_RESTORE} >
                            {(mutate, {data, loading, error}) => {
                                if (data && data.restore && data.restore !== this.state.step) {
                                    this.setState({step: data.restore});
                                }
                                return (<Form role="form" onSubmit={e => {
                                    e.preventDefault();
                                    mutate({variables: {emailCode, emailResend, username, password, passwordRepeat}});
                                }}>
                                    {error && error.graphQLErrors.map(({ message }, i) => (
                                        <Alert color="danger" key={i}>
                                            {message}
                                        </Alert>
                                    ))}

                                    {step === 'login' ? (
                                        <div>
                                            <FormGroup className="mb-3">
                                                <InputGroup className="input-group-alternative">
                                                    <Input
                                                        type="text"
                                                        name="username"
                                                        placeholder="Enter your username, phone or email"
                                                        value={username}
                                                        onChange={this.onChange}
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                            <Row className="mt-3">
                                                <Col sm="3">
                                                    <Button
                                                        color="success"
                                                        type="submit"
                                                        disabled={!username.length}
                                                    >
                                                        {loading ? <Loader
                                                            type="ThreeDots"
                                                            color="#fff"
                                                            height={7}
                                                            width={45}
                                                        /> : 'Next'}
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    ) : ''}

                                    {step === 'emailVerify' ? (
                                        <div>
                                            <FormGroup className="mb-3">
                                                <InputGroup className="input-group-alternative">
                                                    <Input
                                                        type="text"
                                                        name="emailCode"
                                                        placeholder="Enter here code from email"
                                                        value={emailCode}
                                                        onChange={this.onChangeCode}
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                            <Row className="mt-3">
                                                <Col sm="3">
                                                    <Button
                                                        color="success"
                                                        type="submit"
                                                        disabled={!emailCode}
                                                    >
                                                        {loading ? <Loader
                                                            type="ThreeDots"
                                                            color="#fff"
                                                            height={7}
                                                            width={45}
                                                        /> : 'Verify'}
                                                    </Button>
                                                </Col>
                                                <Col sm="4">
                                                    <Button
                                                        style={{display: 'none'}}
                                                        color="link"
                                                        className="text-light"
                                                        type="submit"
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            this.setState({emailResend: true});
                                                            this.setState({emailResend: false});
                                                        }}
                                                    >
                                                        <small>Resend</small>
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    ) : ''}

                                    {step === 'password' ? (
                                        <div>
                                            <FormGroup className="mb-3">
                                                <InputGroup className="input-group-alternative">
                                                    <Input
                                                        type={this.state.passwordShow ? 'text' : 'password'}
                                                        name="password"
                                                        placeholder="Enter password"
                                                        value={password}
                                                        onChange={this.onChange}
                                                    />
                                                    <InputGroupAddon addonType="append">
                                                        <InputGroupText >
                                                            <button className="full-clean-btn" onClick={this.setPasswordShow}>
                                                                <i className={`fa fa-eye ` + (this.state.passwordShow ? 'text-success' : 'text-primary')}/>
                                                            </button>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </FormGroup>
                                            <FormGroup className="mb-3">
                                                <InputGroup className="input-group-alternative">
                                                    <Input
                                                        type={this.state.repeatPasswordShow ? 'text' : 'password'}
                                                        name="passwordRepeat"
                                                        placeholder="Repeat password"
                                                        value={passwordRepeat}
                                                        onChange={this.onChange}
                                                    />
                                                    <InputGroupAddon addonType="append">
                                                        <InputGroupText >
                                                            <button className="full-clean-btn" onClick={this.setRepeatPasswordShow}>
                                                                <i className={`fa fa-eye ` + (this.state.repeatPasswordShow ? 'text-success' : 'text-primary')}/>
                                                            </button>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </FormGroup>
                                            <Row className="mt-3">
                                                <Col sm="3">
                                                    <Button
                                                        color="success"
                                                        type="submit"
                                                        disabled={(!password || password.length < 6 || !passwordRepeat || passwordRepeat.length < 6 || passwordRepeat !== password)}
                                                    >
                                                        {loading ? <Loader
                                                            type="ThreeDots"
                                                            color="#fff"
                                                            height={7}
                                                            width={45}
                                                        /> : 'Change password'}
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    ) : ''}

                                    {step === 'finish' ? (
                                        <div>
                                            <Alert className="bg-gradient-blue shadow">
                                                <Row >
                                                    <Col sm="9">
                                                        <h5 className="text-white">Password has been changed!</h5>
                                                        Now you can login with your new password
                                                    </Col>
                                                    <Col sm="3">
                                                        <Button
                                                            className="mt-2"
                                                            color="secondary"
                                                            type="button"
                                                            onClick={() => {
                                                                this.onClose();
                                                                this.props.login();
                                                            }}
                                                        >
                                                            Login
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Alert>
                                        </div>
                                    ) : ''}
                                </Form>);
                            }}
                        </Mutation>
                    </CardBody>
                </Card>
            </Modal>
        );
    }
}

const mapStateToProps = ({auth}) => ({
    userId: auth.userId
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Restore);
