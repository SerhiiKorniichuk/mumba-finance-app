import React from "react";
import {Button, Card, FormGroup, Input, InputGroup, Container, Row, Col, Form, Alert} from "reactstrap";
import {MUTATION_CHANGE_EMAIL, MUTATION_CHANGE_INFO, MUTATION_CHANGE_PHONE, QUERY_SETTINGS} from "../../../helpers/Api/Schema";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";
import Skeleton from 'react-loading-skeleton';
import {systemSetPage} from "../../../store/system/actions";
import {Query, Mutation} from "react-apollo";
import SettingsNav from '../../../components/SettingsNav';
import Loader from "react-loader-spinner";
import Select from "react-select";
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/dist/style.css';
import {isValidPhoneNumber} from 'react-phone-number-input';
import IsValidEmail from '../../../helpers/IsValidEmail';
import isEmail from "validator/lib/isEmail";

import './Styles.css';
import {IsValidFirstName, IsValidLastName} from "../../../helpers/IsValidName";

class SettingsMain extends React.Component {
    state = {

        // Account info
        bday: null,
        bmonth: null,
        byear: null,
        firstName: null,
        lastName: null,
        sex: null,
        code: '',
        bdays: [],
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
            {value: 10,label: 'October'},
            {value: 11,label: 'November'},
            {value: 12,label: 'December'}
        ],
        byears: [],
        sexList: [
            {value: 1, label: 'Male'},
            {value: 2, label: 'Female'}
        ],

        // Phone
        phone: '',
        phoneResend: false,
        phoneCode: '',
        phoneStep: 'phone',

        // Email
        email: '',
        oldEmailResend: false,
        oldEmailCode: '',
        emailResend: false,
        emailCode: '',
        emailStep: 'email',

    };


    onChangeCode = (e) => {
        const { name, value } = e.currentTarget;
        this.setState({ [name]: value.replace(/[^0-9]/g, '').slice(0, 6) });
    };

    onChange = (e) => {
        const { name, value } = e.currentTarget;
        this.setState({ [name]: value });
    };


    getSexLabel(sex) {
        let SexStr = '';
        this.state.sexList.forEach(({value, label}) => {
            if (value.toString() === sex) {
                SexStr = label;
            }
        });
        return SexStr;
    }

    getValue = (value, label) => {
        return {value, label};
    };

    updateDays = (bmonth, day) => {
        const days = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const res = [];
        for(let i = 1; i <= days[bmonth]; i++) {
            res.push(this.getValue(i.toString(), i.toString()));
        }
        this.setState({bdays: res});
        const result = res.slice().filter(({value, label}) => {
            if (value === day) {
                return value;
            }
            return null
        });
        if (result && result[0] && result[0].value) {
            return;
        }
        return this.setState({bday: '1'});
    };

    initYears = () => {
        const res = [];
        for (let i = 2015; i >= 1935; i--) {
            res.push(this.getValue(i.toString(), i.toString()));
        }
        this.setState({byears: res});
    };

    getMonthTitle = (month) => {
        let monthStr = '';
        this.state.bmonths.forEach(({value, label}) => {
            if (value.toString() === month) {
                monthStr = label;
            }
        });
        return monthStr;
    };

    componentWillMount() {
        this.initYears();
        this.props.systemSetPage('settings');
    }

    render() {
        if (!this.props.userId) {
            return (<Redirect to={"/"} />);
        }
        const {code} = this.state;
        let {firstName, lastName, sex, bday, bmonth, byear} = this.state;
        const {phoneStep, phone, phoneCode, phoneResend} = this.state;
        const {emailStep, email, emailCode, emailResend, oldEmailCode, oldEmailResend} = this.state;
        return (
            <Query query={QUERY_SETTINGS} >
                {({data, loading, error, refetch}) => {
                    let obfuscatedPhone = '**';
                    let obfuscatedEmail = '**';

                    const queryLoading = loading;
                    let isVerified = false;
                    if (!loading) {
                        if (!data || !data.viewer) {
                            return (<Redirect to="/" />);
                        }
                        if (firstName === null) {
                            firstName = data.viewer.firstName;
                        }
                        if (lastName === null) {
                            lastName = data.viewer.lastName;
                        }
                        if (sex === null) {
                            sex = data.viewer.sex;
                        }
                        if (bday === null) {
                            bday = data.viewer.bday;
                        }
                        if (bmonth === null) {
                            bmonth = data.viewer.bmonth;
                            if (this.state.bmonth !== bmonth) {
                                this.setState({bmonth});
                                this.updateDays(bmonth, bday);
                            }
                        }
                        if (byear === null) {
                            byear = data.viewer.byear;
                        }

                        obfuscatedPhone = data.viewer.obfuscatedPhone;
                        obfuscatedEmail = data.viewer.obfuscatedEmail;
                        isVerified = data.viewer.isVerified || data.viewer.verified.status === 1;
                    }
                    return (
                        <section className="section section-lg bg-gradient-secondary">
                            <Container>
                                <SettingsNav active="/settings" />
                                <Card className="shadow mt-4">
                                    <div className="p-4">
                                        <Row>
                                            <Col lg="6">
                                                <h5>Account information</h5>
                                                <Mutation mutation={MUTATION_CHANGE_INFO}>
                                                    {(mutate, {data, loading, error}) => {
                                                        if (!loading && data && data.changeInfo) {
                                                            if (this.state.needFetch) {
                                                                refetch();
                                                                this.setState({needFetch: false});
                                                                this.setState({code: null});
                                                            }
                                                        }
                                                        return (<Form
                                                            className="mt-4"
                                                            onSubmit={e => {
                                                                e.preventDefault();
                                                                mutate({variables: {firstName, lastName, sex, bday, bmonth, byear, code}});
                                                                this.setState({needFetch: true});
                                                            }}>
                                                            {error && error.graphQLErrors.map(({ message }, i) => (
                                                                <Alert color="warning" key={i}>
                                                                    {message}
                                                                </Alert>
                                                            ))}
                                                            {!loading && data && data.changeInfo ? <Alert color="success">
                                                                Account information has been updated
                                                            </Alert> : false}
                                                            {firstName && !IsValidFirstName(firstName.trim()) ? <Alert color="warning">First name must contain only latin characters</Alert> : ''}
                                                            {lastName && !IsValidLastName(lastName.trim()) ? <Alert color="warning">Last name must contain only latin characters</Alert> : ''}
                                                            <FormGroup>
                                                                {queryLoading ? <Skeleton height={38} /> : <Input
                                                                    placeholder="First name"
                                                                    type="text"
                                                                    name="firstName"
                                                                    value={firstName}
                                                                    disabled={isVerified}
                                                                    onChange={this.onChange}
                                                                />}
                                                            </FormGroup>
                                                            <FormGroup>
                                                                {queryLoading ? <Skeleton height={38} /> : <Input
                                                                    placeholder="Last name"
                                                                    type="text"
                                                                    name="lastName"
                                                                    disabled={isVerified}
                                                                    value={lastName}
                                                                    onChange={this.onChange}
                                                                />}
                                                            </FormGroup>
                                                            <FormGroup >
                                                                <Row>
                                                                    <Col sm="4" className="mb-3">
                                                                        <InputGroup >
                                                                            {queryLoading ? <div className="react-select-block">
                                                                                <Skeleton height={38} />
                                                                            </div>: <Select
                                                                                placeholder="Day"
                                                                                className="react-select-block"
                                                                                isDisabled={isVerified}
                                                                                value={this.getValue(bday + '', bday + '')}
                                                                                options={this.state.bdays}
                                                                                onChange={(res) => {
                                                                                    this.setState({bday: parseInt(res.value)});
                                                                                }}
                                                                            />}
                                                                        </InputGroup>
                                                                    </Col>
                                                                    <Col sm="4" className="mb-3">
                                                                        <InputGroup>
                                                                            {queryLoading ? <div className="react-select-block">
                                                                                <Skeleton height={38} />
                                                                            </div>: <Select
                                                                                className="react-select-block"
                                                                                placeholder="Month"
                                                                                isDisabled={isVerified}
                                                                                value={this.getValue(bmonth + '', this.getMonthTitle(bmonth + ''))}
                                                                                options={this.state.bmonths}
                                                                                onChange={(res) => {
                                                                                    this.setState({bmonth: parseInt(res.value)});
                                                                                    this.updateDays(parseInt(res.value), bday);
                                                                                }}
                                                                            />}
                                                                        </InputGroup>
                                                                    </Col>
                                                                    <Col sm="4" className="mb-3">
                                                                        <InputGroup>
                                                                            {queryLoading ? <div className="react-select-block">
                                                                                <Skeleton height={38} />
                                                                            </div>: <Select
                                                                                className="react-select-block"
                                                                                placeholder="Year"
                                                                                isDisabled={isVerified}
                                                                                value={this.getValue(byear + '', byear + '')}
                                                                                options={this.state.byears}
                                                                                onChange={(res) => {
                                                                                    this.setState({byear: parseInt(res.value)});
                                                                                }}
                                                                            />}
                                                                        </InputGroup>
                                                                    </Col>
                                                                </Row>
                                                            </FormGroup>
                                                            <FormGroup className="mb-3">
                                                                <InputGroup>
                                                                    {queryLoading ? <div className="react-select-block">
                                                                        <Skeleton height={38} />
                                                                    </div> : <Select
                                                                        className="react-select-block"
                                                                        placeholder="Gender"
                                                                        isDisabled={isVerified}
                                                                        value={this.getValue(sex + '', this.getSexLabel(sex + ''))}
                                                                        options={this.state.sexList}
                                                                        onChange={(res) => {
                                                                            this.setState({sex: res.value});
                                                                        }}
                                                                    />}
                                                                </InputGroup>
                                                            </FormGroup>
                                                            <FormGroup className="mb-3">
                                                                <InputGroup>
                                                                    {queryLoading ? <div className="react-select-block">
                                                                        <Skeleton height={38} />
                                                                    </div> : <Input
                                                                        className="react-select-block"
                                                                        type="text"
                                                                        name="code"
                                                                        disabled={isVerified}
                                                                        placeholder="Enter code from authenticator app"
                                                                        value={code}
                                                                        onChange={this.onChangeCode}
                                                                        attributes={{
                                                                            autocomplete: 'off',
                                                                        }}
                                                                    />}
                                                                </InputGroup>
                                                            </FormGroup>
                                                            <FormGroup className="mt-2">
                                                                <Button disabled={queryLoading || !code || code.toString().length < 6 || isVerified} color="success">
                                                                    {loading ? <Loader
                                                                        type="ThreeDots"
                                                                        color="#fff"
                                                                        height={7}
                                                                        width={45}
                                                                    /> : 'Save changes'}
                                                                </Button>
                                                            </FormGroup>
                                                        </Form>);
                                                    }}
                                                </Mutation>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card>
                                <Card className="shadow mt-4">
                                    <div className="p-4">
                                        <Row>
                                            <Col lg="6">
                                                <h5>Phone number</h5>
                                                <Mutation mutation={MUTATION_CHANGE_PHONE}>
                                                    {(mutate, {data, loading, error}) => {
                                                        if (!loading && data && data.changePhone && phoneStep !== data.changePhone) {
                                                            if (data.changePhone === 'finish') {
                                                                this.setState({phoneCode: '', phone: ''});
                                                                refetch();
                                                            }
                                                            this.setState({phoneStep: data.changePhone});
                                                        }
                                                        return (<Form
                                                            className="mt-4"
                                                            onSubmit={e => {
                                                                e.preventDefault();
                                                                mutate({variables: {phone, phoneCode, phoneResend}});
                                                            }}>
                                                            {error && error.graphQLErrors.map(({ message }, i) => (
                                                                <Alert color="warning" key={i}>
                                                                    {message}
                                                                </Alert>
                                                            ))}
                                                            {phoneStep === 'finish' ? <Alert color="success">
                                                                Phone number has been updated
                                                            </Alert> : false}
                                                            <h6>{queryLoading ? <Skeleton height={25} /> : <>Current Phone: {obfuscatedPhone}</>}</h6>
                                                            <FormGroup className="mt-2">
                                                                {queryLoading ? <Skeleton height={47} /> : <div style={{
                                                                    padding: 0,
                                                                    margin: 0,
                                                                    height: 47
                                                                }} className="form-control"><ReactPhoneInput
                                                                    style={{width: '100%'}}
                                                                    defaultCountry="us"
                                                                    value={phone}
                                                                    onChange={(value) => this.setState({ phone: value })}
                                                                /></div>}
                                                            </FormGroup>
                                                            {(phoneStep === 'phone' || phoneStep === 'finish') ? <FormGroup className="mt-2">
                                                                <Button disabled={queryLoading || !isValidPhoneNumber(phone)} color="success">
                                                                    {loading ? <Loader
                                                                        type="ThreeDots"
                                                                        color="#fff"
                                                                        height={7}
                                                                        width={45}
                                                                    /> : 'Change phone number'}
                                                                </Button>
                                                            </FormGroup> : ''}
                                                            {phoneStep === 'phoneVerify' ? (<div>
                                                                <FormGroup className="mb-3">
                                                                    <InputGroup>
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
                                                            </div>) : ''}
                                                        </Form>);
                                                    }}
                                                </Mutation>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card>
                                <Card className="shadow mt-4">
                                    <div className="p-4">
                                        <Row>
                                            <Col lg="6">
                                                <h5>Email address</h5>
                                                <Mutation mutation={MUTATION_CHANGE_EMAIL}>
                                                    {(mutate, {data, loading, error}) => {
                                                        if (!loading && data && data.changeEmail && emailStep !== data.changeEmail) {
                                                            if (data.changeEmail === 'finish') {
                                                                this.setState({
                                                                    email: '',
                                                                    oldEmailResend: false,
                                                                    oldEmailCode: '',
                                                                    emailResend: false,
                                                                    emailCode: '',
                                                                });
                                                                refetch();
                                                            }
                                                            this.setState({emailStep: data.changeEmail});
                                                        }
                                                        return (<Form
                                                            className="mt-4"
                                                            onSubmit={e => {
                                                                e.preventDefault();
                                                                mutate({variables: {emailStep, email, emailCode, emailResend, oldEmailCode, oldEmailResend}});
                                                            }}>
                                                            {error && error.graphQLErrors.map(({ message }, i) => (
                                                                <Alert color="warning" key={i}>
                                                                    {message}
                                                                </Alert>
                                                            ))}
                                                            {isEmail(email) && !IsValidEmail(email) ? <Alert color="warning">Email address must contain only latin characters</Alert> : ''}
                                                            {emailStep === 'finish' ? <Alert color="success">
                                                                Email address has been updated
                                                            </Alert> : false}
                                                            <h6>{queryLoading ? <Skeleton height={25} /> : <>Current email: {obfuscatedEmail}</>}</h6>
                                                            <FormGroup className="mt-2">
                                                                {queryLoading ? <Skeleton height={38} /> : <Input
                                                                    placeholder="New Email address"
                                                                    type="text"
                                                                    name="email"
                                                                    value={this.state.email}
                                                                    onChange={this.onChange}
                                                                />}
                                                            </FormGroup>
                                                            {(emailStep === 'email' || emailStep === 'finish') ? <FormGroup className="mt-2">
                                                                <Button disabled={queryLoading || !IsValidEmail(email)} color="success">
                                                                    {loading ? <Loader
                                                                        type="ThreeDots"
                                                                        color="#fff"
                                                                        height={7}
                                                                        width={45}
                                                                    /> : 'Change email address'}
                                                                </Button>
                                                            </FormGroup> : ''}

                                                            {emailStep === 'oldEmailVerify' ? (<div>
                                                                <FormGroup className="mb-3">
                                                                    <InputGroup>
                                                                        <Input
                                                                            type="text"
                                                                            name="oldEmailCode"
                                                                            placeholder="Enter code here from old email address"
                                                                            value={oldEmailCode}
                                                                            onChange={this.onChangeCode}
                                                                        />
                                                                    </InputGroup>
                                                                </FormGroup>
                                                                <Row className="mt-3">
                                                                    <Col sm="3">
                                                                        <Button
                                                                            color="success"
                                                                            type="submit"
                                                                            disabled={!oldEmailCode}
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
                                                            </div>) : ''}

                                                            {emailStep === 'emailVerify' ? (<div>
                                                                <FormGroup className="mb-3">
                                                                    <InputGroup>
                                                                        <Input
                                                                            type="text"
                                                                            name="emailCode"
                                                                            placeholder="Enter code here from new email address"
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
                                                            </div>) : ''}

                                                        </Form>);
                                                    }}
                                                </Mutation>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card>
                            </Container>
                        </section>);
                }}
            </Query>
        );
    }
}


const mapStateToProps = ({auth}) => ({
    userId: auth.userId
});

const mapDispatchToProps = {
    systemSetPage
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsMain);
