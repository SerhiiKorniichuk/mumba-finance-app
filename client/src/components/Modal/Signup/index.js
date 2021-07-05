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
    InputGroupAddon, InputGroupText, Progress,
} from 'reactstrap';
import {SITE_NAME} from '../../../Config';
import {MUTATION_SIGNUP} from '../../../helpers/Api/Schema';
import {Mutation} from "react-apollo";
import {authSetUserId} from "../../../store/auth/actions";
import Select from 'react-select';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/dist/style.css';
import {isValidPhoneNumber} from 'react-phone-number-input';

import './Styles.css';
import PasswordInput from "react-password-indicator";
import IsValidEmail from "../../../helpers/IsValidEmail";
import {IsValidFirstName, IsValidLastName} from "../../../helpers/IsValidName";
import isEmail from 'validator/lib/isEmail';
import * as TagManager from "react-gtm-module";
import {gtmEvent} from "../../../helpers/GTM/events"
import {CloseOutlined} from "@material-ui/icons";


class Signup extends React.Component {

    state = {
        email: '',
        emailCode: '',
        phone: '',
        phoneCode: '',
        phoneResend: false,
        emailResend: false,
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        passwordRepeat: '',
        bday: 0,
        bmonth: 0,
        byear: 0,
        sex: 0,
        result: {
            step: 'email'
        },
        bdays: [],
        bmonths: [],
        byears: [],
        bdayValue: null,
        passwordShow: false,
    };

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (nextProps.isOpen && !this.props.isOpen) {
            this.prepareOpen();
            this.initFilters();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {step} = this.state.result

        if (prevState.result.step !== step) {
            if (step === 'emailVerify') {
                TagManager.dataLayer(gtmEvent.TMSingUpWaitingPostVerifyCode)
                console.log('TMSingUpWaitingPostVerifyCode')
            }
            if (step === 'phone') {
                TagManager.dataLayer(gtmEvent.TMSingUpWaitingPhone)
                console.log('TMSingUpWaitingPhone')
            }
            if (step === 'phoneVerify') {
                TagManager.dataLayer(gtmEvent.TMSingUpWaitingPhoneVerifyCode)
                console.log('TMSingUpWaitingPhoneVerifyCode')
            }
            if (step === 'info') {
                TagManager.dataLayer(gtmEvent.TMSingUpWaitingUserInfo)
                console.log('TMSingUpWaitingUserInfo')
            }
            if (step === 'account') {
                TagManager.dataLayer(gtmEvent.TMSingUpEnterInAccountWaiting)
                console.log('TMSingUpEnterInAccountWaiting')
            }
        }
    }

    prepareOpen = () => {
        this.setState({
            email: '',
            emailCode: '',
            phone: '',
            phoneCode: '',
            phoneResend: false,
            emailResend: false,
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            passwordRepeat: '',
            bday: 0,
            bmonth: 0,
            byear: 0,
            sex: 0,
            result: {
                step: 'email'
            },
            bdays: [],
            bmonths: [],
            byears: [],
            bdayValue: null,
            passwordShow: false,
        });
    };

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


    getDay = (day) => {
        const result = this.state.bdays.filter(({value, label}) => {
            if (value === day) {
                return {value, label}
            }
            return null
        })
        if (result) {
            return result
        }
        return null
    };

    updateDays = () => {
        const days = [31, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const res = [];
        for(let i = 1; i <= days[this.state.bmonth]; i++) {
            res.push({ value: i.toString(), label: i.toString()});
        }
        this.setState({bdays: res});
        const result = res.slice().filter(({value, label}) => {
            if (value === this.state.bday) {
                return value;
            }
            return null
        });
        if (result && result[0] && result[0].value) {
            return;
        }
        return this.setState({bday: 1, bdayValue: res.slice()[0]});
    };

    initYears = () => {
        const res = [];
        for (let i = 2015; i >= 1935; i--) {
            res.push({ value: i.toString(), label: i.toString()});
        }
        this.setState({byears: res});
    };

    initMonths = () => {
        this.setState({
            bmonths: [
                {value: 1, label: 'January'},
                {value: 2, label: 'February'},
                {value: 3, label: 'March'},
                {value: 4, label: 'April'},
                {value: 5, label: 'May'},
                {value: 6, label: 'June'},
                {value: 7, label: 'July'},
                {value: 8, label: 'August'},
                {value: 9, label: 'September'},
                {value: 10,label:  'October'},
                {value: 11,label:  'November'},
                {value: 12,label:  'December'}
            ]
        });
    };

    initFilters = () => {
        this.updateDays();
        this.initYears();
        this.initMonths();
    };

    onCompletedFormRequest = () => {
        const step = this.state.result.step

        if (step === 'email') {
            TagManager.dataLayer(gtmEvent.TMSingUpPostSend)
            console.log('TMSingUpPostSend')
        } else if (step === 'emailVerify') {
            TagManager.dataLayer(gtmEvent.TMSingUpPostVerifyCodeSend)
            console.log('TMSingUpPostVerifyCodeSend')
        } else if (step === 'phone') {
            TagManager.dataLayer(gtmEvent.TMSingUpPhoneSend)
            console.log('TMSingUpPhoneSend')
        } else if (step === 'phoneVerify') {
            TagManager.dataLayer(gtmEvent.TMSingUpPhoneVerifyCodeSend)
            console.log('TMSingUpPhoneVerifyCodeSend')
        } else if (step === 'info') {
            TagManager.dataLayer(gtmEvent.TMSingUpUserInfoSend)
            console.log('TMSingUpUserInfoSend')
        } else if (step === 'account') {
            TagManager.dataLayer(gtmEvent.TMSingUpEnterInAccountSend)
            console.log('TMSingUpEnterInAccountSend')
        }
    }

    render() {
        let {email, emailCode, emailResend} = this.state;
        let {phone, phoneCode, phoneResend} = this.state;
        let {firstName, lastName, sex, bday, bmonth, byear} = this.state;
        let {username, password, passwordRepeat} = this.state;
        let {step} = this.state.result;

        return (
            <Modal isOpen={this.props.isOpen} toggle={this.onClose} className={this.props.className} backdrop={'static'}>
                <button className="modal-close-btn" onClick={this.onClose}>
                    <CloseOutlined />
                </button>
                <Card className="purple-gradient-bg shadow border-0">
                    <h3 className="m-5 text-center text-white">Sign up in {SITE_NAME}</h3>
                    <CardBody className="px-lg-4 py-lg-4 card bg-secondary">
                        <Mutation
                            mutation={MUTATION_SIGNUP}
                            onCompleted={this.onCompletedFormRequest}>
                            {(mutate, {data, loading, error}) => {
                                if (!loading && data && data.register && data.register !== this.state.result) {
                                    this.setState({result: data.register})
                                }
                                return (
                                    <Form
                                        role="form"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            mutate({variables: {email, phoneCode, emailCode, phoneResend, emailResend, phone,
                                                    username, password, passwordRepeat, sex, bday, bmonth, byear,
                                                    firstName, lastName}});
                                        }}
                                    >
                                        {error && error.graphQLErrors.map(({message}, i) => (
                                            <Alert color="danger" key={i}>{message}</Alert>
                                        ))}

                                        {step === 'email' ? (
                                            <div>
                                                {isEmail(email) && !IsValidEmail(email) ? <Alert color="warning">Email address must contain only latin characters</Alert> : ''}
                                                <FormGroup className="mb-3">
                                                    <InputGroup className="input-group-alternative">
                                                        <Input
                                                            type="text"
                                                            name="email"
                                                            placeholder="Enter your email"
                                                            value={email}
                                                            onChange={this.onChange}
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                                <Row className="mt-3">
                                                    <Col sm="3">
                                                        <Button
                                                            color="success"
                                                            type="submit"
                                                            disabled={!IsValidEmail(email)}
                                                        >
                                                            {loading ? <Loader
                                                                type="ThreeDots"
                                                                color="#fff"
                                                                height={7}
                                                                width={45}
                                                            /> : 'Next'}
                                                        </Button>
                                                    </Col>
                                                    <Col className="blank-btn-container">
                                                        <button className="full-clean-btn text-light">
                                                            <small onClick={this.props.login} >I already have an account</small>
                                                        </button>
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
                                                            placeholder="Enter code here"
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

                                        {step === 'phone' ? (
                                            <div>
                                                <FormGroup className="mb-3">
                                                    <InputGroup className="input-group-alternative">
                                                        <ReactPhoneInput
                                                            style={{width: '100%'}}
                                                            defaultCountry="us"
                                                            value={this.state.phone}
                                                            onChange={(value) => this.setState({ phone: value })}
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                                <Row className="mt-3">
                                                    <Col sm="3">
                                                        <Button
                                                            color="success"
                                                            type="submit"
                                                            disabled={!isValidPhoneNumber(phone)}
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

                                        {step === 'phoneVerify' ? (
                                            <div>
                                                <FormGroup className="mb-3">
                                                    <InputGroup className="input-group-alternative">
                                                        <Input
                                                            type="text"
                                                            name="phoneCode"
                                                            placeholder="Enter code here"
                                                            value={phoneCode}
                                                            onChange={this.onChangeCode}
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

                                        {step === 'info' ? (
                                            <div>
                                                {firstName && !IsValidFirstName(firstName.trim()) ? <Alert color="warning">First name must contain only latin characters</Alert> : ''}
                                                {lastName && !IsValidLastName(lastName.trim()) ? <Alert color="warning">Last name must contain only latin characters</Alert> : ''}
                                                <FormGroup className="mb-3">
                                                    <InputGroup className="input-group-alternative">
                                                        <Input
                                                            type="text"
                                                            name="firstName"
                                                            placeholder="Enter your first name"
                                                            value={firstName}
                                                            onChange={this.onChange}
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                                <FormGroup className="mb-3">
                                                    <InputGroup className="input-group-alternative">
                                                        <Input
                                                            type="text"
                                                            name="lastName"
                                                            placeholder="Enter your last name"
                                                            value={lastName}
                                                            onChange={this.onChange}
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Row>
                                                        <Col sm="4" className="mb-3">
                                                            <InputGroup className="input-group-alternative">
                                                                <Select
                                                                    placeholder="Day"
                                                                    className="react-select-container"
                                                                    value={this.state.bdayValue}
                                                                    options={this.state.bdays}
                                                                    onChange={(res) => {
                                                                        this.setState({bday: parseInt(res.value), bdayValue: res});
                                                                    }}
                                                                />
                                                            </InputGroup>
                                                        </Col>
                                                        <Col sm="4" className="mb-3">
                                                            <InputGroup className="input-group-alternative">
                                                                <Select
                                                                    className="react-select-container"
                                                                    placeholder="Month"
                                                                    options={this.state.bmonths}
                                                                    onChange={(res) => {
                                                                        this.setState({bmonth: parseInt(res.value)});
                                                                        this.updateDays();
                                                                    }}
                                                                />
                                                            </InputGroup>
                                                        </Col>
                                                        <Col sm="4" className="mb-3">
                                                            <InputGroup className="input-group-alternative">
                                                                <Select
                                                                    className="react-select-container"
                                                                    placeholder="Year"
                                                                    options={this.state.byears}
                                                                    onChange={(res) => {
                                                                        this.setState({byear: parseInt(res.value)});
                                                                    }}
                                                                />
                                                            </InputGroup>
                                                        </Col>
                                                    </Row>
                                                </FormGroup>
                                                <FormGroup className="mb-3">
                                                    <InputGroup className="input-group-alternative">
                                                        <Select
                                                            className="react-select-container"
                                                            placeholder="Gender"
                                                            options={[
                                                                {value: 1, label: 'Male'},
                                                                {value: 2, label: 'Female'}
                                                            ]}
                                                            onChange={(res) => {
                                                                this.setState({sex: res.value});
                                                            }}
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                                <Row className="mt-3">
                                                    <Col sm="3">
                                                        <Button
                                                            color="success"
                                                            type="submit"
                                                            disabled={(!IsValidFirstName(firstName) || !IsValidLastName(lastName) || !bday || !bmonth || !byear || !sex)}
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

                                        {step === 'account' ? (
                                            <div>
                                                <FormGroup className="mb-3">
                                                    <InputGroup className="input-group-alternative">
                                                        <Input
                                                            type="text"
                                                            name="username"
                                                            placeholder="Enter username"
                                                            value={username}
                                                            onChange={this.onChange}
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                                <FormGroup className="mb-3">

                                                    <PasswordInput
                                                        minLen={6}
                                                        digits={2}
                                                        specialChars={2}
                                                        uppercaseChars={2}
                                                        maxLen={30}
                                                        isVisible={this.state.passwordShow}
                                                        name="password"
                                                        onChange={(password) => this.setState({password})}
                                                    >
                                                        {({ getInputProps, valid, getProgressProps, errors, touched }) => (
                                                            <React.Fragment>
                                                                <InputGroup className="input-group-alternative">
                                                                    <Input
                                                                        className={touched ? (valid ? 'success' : 'error') : ''}
                                                                        {...getInputProps()}
                                                                        value={this.state.password}
                                                                        placeholder="Enter password"
                                                                    />
                                                                    <InputGroupAddon addonType="append">
                                                                        <InputGroupText >
                                                                            <button className="full-clean-btn" onClick={this.setPasswordShow}>
                                                                                <i className={`fa fa-eye ` + (this.state.passwordShow ? 'text-success' : 'text-primary')}/>
                                                                            </button>
                                                                        </InputGroupText>
                                                                    </InputGroupAddon>
                                                                </InputGroup>
                                                                {touched ? <div className="mt-2 mb-2">
                                                                    <Progress {...getProgressProps()} color={getProgressProps().value < 2 ? 'danger' : getProgressProps().value < 4 ? 'warning' : 'success'} style={{marginBottom: 0}}/>
                                                                </div> : ''}
                                                                {touched && (
                                                                    valid
                                                                        ? <Alert color="success">Password is valid!</Alert>
                                                                        : (
                                                                            <Alert color="warning">
                                                                                Password is invalid due to following errors:
                                                                                <ul style={{marginBottom: 0, paddingLeft: 10}}>
                                                                                    {errors.map((e) => (<li key={e.key}>{e.message}</li>))}
                                                                                </ul>
                                                                            </Alert>
                                                                        )
                                                                )}
                                                            </React.Fragment>
                                                        )}
                                                    </PasswordInput>
                                                </FormGroup>
                                                <FormGroup className="mb-3">
                                                    <InputGroup className="input-group-alternative">
                                                        <Input
                                                            type={this.state.passwordShow ? 'text' : 'password'}
                                                            name="passwordRepeat"
                                                            placeholder="Repeat password"
                                                            value={passwordRepeat}
                                                            onChange={this.onChange}
                                                        />
                                                    </InputGroup>
                                                </FormGroup>
                                                <Row className="mt-3">
                                                    <Col sm="3">
                                                        <Button
                                                            color="success"
                                                            type="submit"
                                                            disabled={(!username.match(/^[a-zA-Z0-9_\-.]+$/) || !password || password.length < 6 || !passwordRepeat || passwordRepeat.length < 6 || passwordRepeat !== password)}
                                                        >
                                                            {loading ? <Loader
                                                                type="ThreeDots"
                                                                color="#fff"
                                                                height={7}
                                                                width={45}
                                                            /> : 'Finish'}
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        ) : ''}

                                        {step === 'finish' ? (
                                            <div>
                                                <Alert className="bg-gradient-green shadow">
                                                    <Row >
                                                        <Col sm="9">
                                                            <h5 className="text-white">Sign up has been finished!</h5>
                                                            Now you can login with your credentials
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
                                    </Form>
                                )
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
})

const mapDispatchToProps = {
    authSetUserId
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
