import React from 'react';
import {Button, Modal, Card, CardBody, Alert, Form, FormGroup, InputGroup, Input, Row, Col, Badge, InputGroupAddon, InputGroupText} from 'reactstrap';
import {SITE_NAME} from '../../../Config';
import {connect} from "react-redux";
import {MUTATION_LOGIN} from '../../../helpers/Api/Schema';
import {Mutation} from "react-apollo";
import {Redirect} from 'react-router-dom';
import {authDataSet} from "../../../helpers/AuthUtils";
import {authSetUserId} from "../../../store/auth/actions";
import Loader from 'react-loader-spinner';
import TagManager from "react-gtm-module";
import {gtmEvent} from "../../../helpers/GTM/events";
import {CloseOutlined} from "@material-ui/icons";


class Login extends React.Component {

    state = {
        username: '',
        password: '',
        code: '',
        phoneCode: '',
        resetCode: false,
        phoneResend: false,
        passwordShow: false,
        autoSubmited: false,
        result: {
            step: 'login'
        }
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (nextProps.isOpen && !this.props.isOpen) {
            this.prepareOpen();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {step} = this.state.result

        if (prevState.result.step !== step) {
            if (step === 'generatorInit') {
                TagManager.dataLayer(gtmEvent.TMLoginQRCodeWaiting)
                console.log('TMLoginQRCodeWaiting')
            }
        }
    }

    onChange = (e) => {
        const { name, value } = e.currentTarget;
        this.setState({ [name]: value });
    };

    onChangeCode = (e) => {
        const { name, value } = e.currentTarget;
        this.setState({ [name]: value.replace(/[^0-9]/g, '').slice(0, 6) });
    };

    prepareOpen = () => {
        this.setState({
            username: '',
            password: '',
            code: '',
            phoneCode: '',
            resetCode: false,
            phoneResend: false,
            passwordShow: false,
            autoSubmited: false,
            result: {
                step: 'login'
            }
        });
        if (this.props.authenticatorReset) {
            this.setState({
                resetCode: true,
                result: {
                    step: 'sure',
                }
            });
        }
    };

    onClose = () => {
        this.props.toggle();
    };

    setPasswordShow = (e) => {
        e.preventDefault();
        this.setState({passwordShow: !this.state.passwordShow});
    };

    onCompletedFormRequest = () => {
        const step = this.state.result.step

        if (step === 'generatorInit') {
            TagManager.dataLayer(gtmEvent.TMLoginQRCodeSend)
            console.log('TMLoginQRCodeSend')
        }
    }

    render() {
        const {username, password, code, phoneCode, resetCode, phoneResend} = this.state;
        const disabledSubmit = !username || !password;
        const {step} = this.state.result;
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.onClose} className={this.props.className} backdrop={'static'}>
                <button className="modal-close-btn" onClick={this.onClose}>
                    <CloseOutlined />
                </button>
                <Card className="purple-gradient-bg shadow border-0">
                    {!this.props.authenticatorReset ? (<h3 className="m-5 text-center text-white">Login to {SITE_NAME}</h3>) : ''}
                    <CardBody className="px-lg-4 py-lg-4 card bg-secondary">
                        <Mutation mutation={MUTATION_LOGIN} onCompleted={this.onCompletedFormRequest}>
                            {(mutate, {data, loading, error}) => {
                                if (!data) {
                                    data = this.state.result;
                                } else if (data.login && data.login !== this.state.result) {
                                    this.setState({result: data.login});
                                    data = data.login;
                                }
                                if (!loading && resetCode && (data.step === 'generatorVerify' || data.step === 'generatorInit')) {
                                    this.setState({resetCode: false});
                                }
                                if (this.state.result.accessToken && this.state.result.accessToken.userId) {
                                    authDataSet(this.state.result.accessToken);
                                    this.props.authSetUserId(this.state.result.accessToken.userId);
                                    return (<Redirect to={`/dashboard`} />)
                                }
                                const mutateCb = () => mutate({variables: {username, password, code, resetCode, phoneCode, phoneResend}});
                                if (code.length === 6 && !this.state.autoSubmited) {
                                    this.setState({autoSubmited: true});
                                    mutateCb();
                                }
                                return (
                                    <Form
                                        role="form"
                                        onSubmit={e => {
                                            e.preventDefault();
                                            mutateCb();
                                        }}
                                    >
                                        {error && error.graphQLErrors.map(({ message }, i) => (
                                            <Alert color="danger" key={i}>
                                                {message}
                                            </Alert>
                                        ))}

                                        {step === 'login' ? (
                                            <>
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
                                                <FormGroup>
                                                    <InputGroup className="input-group-alternative">
                                                        <Input
                                                            type={this.state.passwordShow ? 'text' : 'password'}
                                                            name="password"
                                                            placeholder="Enter your password"
                                                            value={this.state.password}
                                                            onChange={this.onChange}
                                                            attributes={{
                                                                autocomplete: 'off',
                                                            }}
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
                                                <Row className="mt-3">
                                                    <Col sm="3">
                                                        <Button
                                                            color="success"
                                                            type="submit"
                                                            disabled={disabledSubmit}
                                                        >
                                                            {loading ? <Loader
                                                                type="ThreeDots"
                                                                color="#fff"
                                                                height={7}
                                                                width={45}
                                                            /> : 'Login'}
                                                        </Button>
                                                    </Col>
                                                    <Col sm="9" className="pt-2">
                                                        <Row>
                                                            <Col>
                                                                <button
                                                                    className="full-clean-btn text-light"
                                                                    onClick={e => {
                                                                        e.preventDefault();
                                                                        this.props.restore();
                                                                    }}
                                                                >
                                                                    <small>Forgot password?</small>
                                                                </button>
                                                            </Col>
                                                            <Col className="text-right">
                                                                <button
                                                                    className="full-clean-btn text-light"
                                                                    onClick={e => {
                                                                        e.preventDefault();
                                                                        this.props.signup();
                                                                    }}
                                                                >
                                                                    <small>Create new account</small>
                                                                </button>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </>
                                        ) : ''}

                                        {step === 'generatorInit' ? (
                                            <>
                                                <p className="text-center">Scan the QR code below with authenticator app.</p>
                                                <div className="m-1">
                                                    <img
                                                        alt={this.state.result.generatorSecret}
                                                        style={{height: 150, width: 150}}
                                                        className="img-center img-thumbnail shadow"
                                                        src={this.state.result.generatorImage}
                                                    />
                                                </div>
                                                <p className="mt-3 text-center">Write down this secret key and keep it in save place:</p>
                                                <div className="text-center">
                                                    <Badge color="primary" className="shadow" style={{fontSize: '1.5rem'}}>
                                                        {this.state.result.generatorSecret}
                                                    </Badge>
                                                </div>
                                                <p className="mt-3 text-center">if your phone got lost or erased, you will need this key to restore 2-factor authentication.</p>
                                                <p className="mt-3 text-center">
                                                    Enter 6-digit code displayed on your authenticator app below:
                                                </p>
                                                <FormGroup>
                                                    <InputGroup className="input-group-alternative">
                                                        <Input
                                                            type="text"
                                                            name="code"
                                                            placeholder="Enter code here"
                                                            value={code}
                                                            onChange={this.onChangeCode}
                                                            attributes={{
                                                                autocomplete: 'off',
                                                            }}
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                                <Row className="mt-3">
                                                    <Col sm="3">
                                                        <Button
                                                            color="success"
                                                            type="submit"
                                                            disabled={code.length < 6}
                                                        >
                                                            {loading ? <Loader
                                                                type="ThreeDots"
                                                                color="#fff"
                                                                height={7}
                                                                width={45}
                                                            /> : 'Continue'}
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </>
                                        ) : ''}

                                        {step === 'generatorVerify' ? (
                                            <>
                                                <p>Enter code from authenticator app.</p>
                                                <FormGroup>
                                                    <InputGroup className="input-group-alternative">
                                                        <Input
                                                            type="text"
                                                            name="code"
                                                            placeholder="Enter code here"
                                                            value={code}
                                                            onChange={this.onChangeCode}
                                                            attributes={{
                                                                autocomplete: 'off',
                                                            }}
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                                <Row className="mt-3">
                                                    <Col sm="3" style={{
                                                        paddingLeft:0,
                                                        paddingRight: 0,
                                                        marginLeft: 10,
                                                    }}>
                                                        <Button
                                                            color="success"
                                                            type="submit"
                                                            disabled={code.length < 6}
                                                        >
                                                            {loading ? <Loader
                                                                type="ThreeDots"
                                                                color="#fff"
                                                                height={7}
                                                                width={45}
                                                            /> : 'Continue'}
                                                        </Button>
                                                    </Col>
                                                    <Col sm="5" style={{padding: 0}}>
                                                        <Button
                                                            color="link"
                                                            className="text-light"
                                                            onClick={e => {
                                                                this.setState({resetCode: true});
                                                            }}
                                                            type="submit"
                                                        >
                                                            Reset authenticator secret
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </>
                                        ) : ''}

                                        {step === 'phoneVerify' ? (
                                            <>
                                                <p>Reset authenticator secret</p>
                                                <FormGroup>
                                                    <InputGroup className="input-group-alternative">
                                                        <Input
                                                            type="text"
                                                            name="phoneCode"
                                                            placeholder="Enter here code from SMS"
                                                            value={phoneCode}
                                                            onChange={this.onChangeCode}
                                                            attributes={{
                                                                autocomplete: 'off',
                                                            }}
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                                <Row className="mt-3">
                                                    <Col sm="3">
                                                        <Button
                                                            color="success"
                                                            type="submit"
                                                            disabled={!phoneCode}
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
                                                                this.setState({phoneResend: true});
                                                                this.setState({phoneResend: false});
                                                            }}
                                                        >
                                                            <small>Resend</small>
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </>
                                        ) : ''}

                                        {step === 'sure' ? (
                                            <>
                                                <p>Are you sure want to reset authenticator secret?</p>
                                                <Row className="mt-3">
                                                    <Col sm="3">
                                                        <Button
                                                            color="success"
                                                            type="submit"
                                                        >
                                                            {loading ? <Loader
                                                                type="ThreeDots"
                                                                color="#fff"
                                                                height={7}
                                                                width={45}
                                                            /> : 'Reset secret'}
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </>
                                        ) : ''}
                                    </Form>
                                );
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

const mapDispatchToProps = {
    authSetUserId
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
