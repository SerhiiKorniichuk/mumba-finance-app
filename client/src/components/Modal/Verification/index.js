import React from 'react';
import {connect} from "react-redux";
import Loader from 'react-loader-spinner';

import {
    Button, Modal, Card, CardBody, Alert,
    Form, FormGroup, InputGroup, Input, Row, Col, Label
} from 'reactstrap';

import {SITE_NAME} from '../../../Config';
import {MUTATION_UPLOAD_PHOTO, MUTATION_VERIFICATION} from '../../../helpers/Api/Schema';
import {Mutation} from "react-apollo";
import {IsValidFirstName, IsValidLastName} from "../../../helpers/IsValidName";
import Select from "react-select";


class Verification extends React.Component {
    state = {
        step: 'start',
        bday: null,
        bmonth: null,
        byear: null,
        firstName: null,
        lastName: null,
        sex: null,
        country: null,
        documentPhoto: '',
        selfiePhoto: '',
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
    };

    prepareOpen = () => {
        this.setState({
            step: 'start',
            bday: null,
            bmonth: null,
            byear: null,
            firstName: null,
            lastName: null,
            sex: null,
            country: null,
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
        });
        if (this.props.data && this.props.data.viewer && this.props.data.viewer.verified) {
            const {verified} = this.props.data.viewer;
            switch (verified.status) {
                case 3:
                    this.setState({step: 'verified'});
                    break;
                case 2:
                    this.setState({step: 'declined'});
                    break;
                case 1:
                    this.setState({step: 'finish'});
                    break;
                case 0:
                    this.setState({step: 'start'});
                    break;
                default:
                    break;
            }
        }
    };
    uploadDocumentInput = React.createRef();

    uploadDocumentPhoto = (e) => {
        this.uploadDocumentInput.current.click();
    };

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (nextProps.isOpen && !this.props.isOpen) {
            this.prepareOpen();
        }
    }

    onClose = () => {
        this.props.reFetch();
        this.props.onClose();
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
    }

    onChange = (e) => {
        const { name, value } = e.currentTarget;
        this.setState({ [name]: value });
    };

    getCountry = (country) => {
        let countryRes = '';
        this.props.data && this.props.data.countries && this.props.data.countries.forEach(({countryCode, countryName}) => {
            if (countryCode.toString() === country) {
                countryRes = countryName;
            }
        });
        return countryRes;
    };

    render() {
        const {step} = this.state;
        const {viewer, countries} = this.props.data;
        let {firstName, lastName, sex, bday, bmonth, byear, country, documentPhoto, selfiePhoto} = this.state;
        const countriesList = countries.map(({countryCode, countryName}, i) => this.getValue(countryCode, countryName));
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.onClose} className={this.props.className} size="lg">
                <Card className="purple-gradient-bg shadow border-0">
                    <h3 className="m-5 text-center text-white">Verification in {SITE_NAME}</h3>
                    <CardBody className="px-lg-4 py-lg-4 card bg-secondary">
                        <Mutation mutation={MUTATION_VERIFICATION} >
                            {(mutate, {data, loading, error}) => {
                                if (data && data.verification && data.verification !== this.state.step) {
                                    this.setState({step: data.verification});
                                }

                                if (firstName === null) {
                                    firstName = viewer.firstName;
                                }
                                if (lastName === null) {
                                    lastName = viewer.lastName;
                                }
                                if (sex === null) {
                                    sex = viewer.sex;
                                }
                                if (bday === null) {
                                    bday = viewer.bday;
                                }
                                if (bmonth === null) {
                                    bmonth = viewer.bmonth;
                                    if (this.state.bmonth !== bmonth) {
                                        this.setState({bmonth});
                                        this.updateDays(bmonth, bday);
                                    }
                                }
                                if (byear === null) {
                                    byear = viewer.byear;
                                }
                                if (country === null) {
                                    country = viewer.country;
                                }
                                return (<Form role="form" onSubmit={e => {
                                    e.preventDefault();
                                    mutate({
                                        variables: {
                                            firstName,
                                            lastName,
                                            bday,
                                            bmonth,
                                            sex,
                                            country,
                                            byear,
                                            selfiePhoto,
                                            documentPhoto
                                        }
                                    });
                                }}>
                                    {error && error.graphQLErrors.map(({ message }, i) => (
                                        <Alert color="danger" key={i}>
                                            {message}
                                        </Alert>
                                    ))}

                                    {step === 'start' ? (
                                        <div>
                                            <div className="mb-2">
                                                <h6>ATTENTION!</h6>
                                                You must provide real First name and Last name mutual to the ID document.
                                            </div>
                                            {firstName && !IsValidFirstName(firstName.trim()) ? <Alert color="warning">First name must contain only latin characters</Alert> : ''}
                                            {lastName && !IsValidLastName(lastName.trim()) ? <Alert color="warning">Last name must contain only latin characters</Alert> : ''}
                                            <FormGroup>
                                                <Row>
                                                    <Col sm="6">
                                                        <Label>First name</Label>
                                                        <InputGroup>
                                                            <Input
                                                                placeholder="Enter your first name"
                                                                type="text"
                                                                name="firstName"
                                                                value={firstName}
                                                                onChange={this.onChange}
                                                            />
                                                        </InputGroup>
                                                    </Col>
                                                    <Col sm="6">
                                                        <Label>Last name</Label>
                                                        <InputGroup>
                                                            <Input
                                                                placeholder="Enter your last name"
                                                                type="text"
                                                                name="lastName"
                                                                value={lastName}
                                                                onChange={this.onChange}
                                                            />
                                                        </InputGroup>
                                                    </Col>
                                                </Row>
                                            </FormGroup>
                                            <FormGroup >
                                                <Label>Age</Label>
                                                <Row>
                                                    <Col sm="4">
                                                        <InputGroup >
                                                            <Select
                                                                placeholder="Day"
                                                                className="react-select-block"
                                                                value={this.getValue(bday + '', bday + '')}
                                                                options={this.state.bdays}
                                                                onChange={(res) => {
                                                                    this.setState({bday: parseInt(res.value)});
                                                                }}
                                                            />
                                                        </InputGroup>
                                                    </Col>
                                                    <Col sm="4">
                                                        <InputGroup>
                                                            <Select
                                                                className="react-select-block"
                                                                placeholder="Month"
                                                                value={this.getValue(bmonth + '', this.getMonthTitle(bmonth + ''))}
                                                                options={this.state.bmonths}
                                                                onChange={(res) => {
                                                                    this.setState({bmonth: parseInt(res.value)});
                                                                    this.updateDays(parseInt(res.value), bday);
                                                                }}
                                                            />
                                                        </InputGroup>
                                                    </Col>
                                                    <Col sm="4">
                                                        <InputGroup>
                                                            <Select
                                                                className="react-select-block"
                                                                placeholder="Year"
                                                                value={this.getValue(byear + '', byear + '')}
                                                                options={this.state.byears}
                                                                onChange={(res) => {
                                                                    this.setState({byear: parseInt(res.value)});
                                                                }}
                                                            />
                                                        </InputGroup>
                                                    </Col>
                                                </Row>
                                            </FormGroup>
                                            <FormGroup>
                                                <InputGroup>
                                                    <Label>Gender</Label>
                                                    <Select
                                                        className="react-select-block"
                                                        placeholder="Select gender"
                                                        value={this.getValue(sex + '', this.getSexLabel(sex + ''))}
                                                        options={this.state.sexList}
                                                        onChange={(res) => {
                                                            this.setState({sex: res.value});
                                                        }}
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                            <FormGroup>
                                                <InputGroup>
                                                    <Label>Nationality</Label>
                                                    <Select
                                                        className="react-select-block"
                                                        placeholder="Select nationality"
                                                        value={!country ? null : this.getValue(country + '', this.getCountry(country + ''))}
                                                        options={countriesList}
                                                        maxMenuHeight={100}
                                                        onChange={(res) => {
                                                            this.setState({country: res.value});
                                                        }}
                                                    />
                                                </InputGroup>
                                            </FormGroup>
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
                                                        /> : 'Next'}
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    ) : ''}

                                    {step === 'documentPhoto' ? (
                                        <div>
                                            <FormGroup className="p-3 card">
                                                <Row>
                                                    <Col xs="12">
                                                        Please fill the gaps reliable information
                                                        You need to upload a clear photo or scan of your ID document where english language available
                                                    </Col>
                                                </Row>
                                                <Row className="justify-content-center mt-4 text-center">
                                                    <Col sm="7">
                                                        <img
                                                            alt=""
                                                            className="img-fluid img"
                                                            src={documentPhoto ? documentPhoto : require("assets/img/reg_doc.svg")}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row className="justify-content-center mt-4 text-center">
                                                    <Col sm="7">
                                                        <Mutation mutation={MUTATION_UPLOAD_PHOTO} >
                                                            {(uploadDocumentPhoto, result) => {
                                                                if (result.data && result.data.uploadPhoto && documentPhoto !== result.data.uploadPhoto) {
                                                                    this.setState({documentPhoto: result.data.uploadPhoto});
                                                                }
                                                                return (<Button
                                                                    color="success"
                                                                    type="button"
                                                                    onClick={this.uploadDocumentPhoto}
                                                                >
                                                                    <input
                                                                        style={{visibility: 'hidden', display: 'none'}}
                                                                        type="file"
                                                                        required
                                                                        ref={this.uploadDocumentInput}
                                                                        onChange={({target: {validity, files: [file]}}) => {
                                                                            return validity.valid && uploadDocumentPhoto({ variables: { file } });
                                                                        }}/>
                                                                    {result.loading ? <Loader
                                                                        type="ThreeDots"
                                                                        color="#fff"
                                                                        height={7}
                                                                        width={45}
                                                                    /> : 'Select document'}
                                                                </Button>);
                                                            }}
                                                        </Mutation>
                                                    </Col>
                                                </Row>
                                            </FormGroup>
                                            <Row className="mt-5">
                                                <Col sm="3">
                                                    <Button
                                                        color="success"
                                                        type="submit"
                                                        disabled={!documentPhoto}
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

                                    {step === 'selfiePhoto' ? (
                                        <div>
                                            <FormGroup className="p-3 card">
                                                <Row>
                                                    <Col xs="12">
                                                        Please take a picture selfie with current date and {SITE_NAME} slogan on it
                                                    </Col>
                                                </Row>
                                                <Row className="justify-content-center mt-4 text-center">
                                                    <Col sm="7">
                                                        <img
                                                            alt=""
                                                            className="img-fluid img"
                                                            src={selfiePhoto ? selfiePhoto : require("assets/img/reg_selfie.svg")}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row className="justify-content-center mt-4 text-center">
                                                    <Col sm="7">
                                                        <Mutation mutation={MUTATION_UPLOAD_PHOTO} >
                                                            {(uploadDocumentPhoto, result) => {
                                                                if (result.data && result.data.uploadPhoto && selfiePhoto !== result.data.uploadPhoto) {
                                                                    this.setState({selfiePhoto: result.data.uploadPhoto});
                                                                }
                                                                return (<Button
                                                                    color="success"
                                                                    type="button"
                                                                    onClick={this.uploadDocumentPhoto}
                                                                >
                                                                    <input
                                                                        style={{visibility: 'hidden', display: 'none'}}
                                                                        type="file"
                                                                        required
                                                                        ref={this.uploadDocumentInput}
                                                                        onChange={({target: {validity, files: [file]}}) => {
                                                                            return validity.valid && uploadDocumentPhoto({ variables: { file } });
                                                                        }}/>
                                                                    {result.loading ? <Loader
                                                                        type="ThreeDots"
                                                                        color="#fff"
                                                                        height={7}
                                                                        width={45}
                                                                    /> : 'Select selfie'}
                                                                </Button>);
                                                            }}
                                                        </Mutation>
                                                    </Col>
                                                </Row>
                                            </FormGroup>
                                            <Row className="mt-5">
                                                <Col sm="3">
                                                    <Button
                                                        color="success"
                                                        type="submit"
                                                        disabled={!selfiePhoto}
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

                                    {step === 'finish' ? (
                                        <div>
                                            <Alert className="bg-gradient-info shadow">
                                                <Row >
                                                    <Col sm="10">
                                                        <h5 className="text-white mt-2">Your request to verification has been sent!</h5>
                                                    </Col>
                                                    <Col sm="2">
                                                        <Button
                                                            className="mt-1"
                                                            color="secondary"
                                                            type="button"
                                                            onClick={() => this.onClose()}
                                                        >
                                                           Close
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Alert>
                                        </div>
                                    ) : ''}

                                    {step === 'verified' ? (
                                        <div>
                                            <Alert className="bg-gradient-blue shadow">
                                                <Row >
                                                    <Col sm="9">
                                                        <h5 className="text-white mt-2">Congrats Your account has been verified!</h5>
                                                    </Col>
                                                    <Col sm="3">
                                                        <Button
                                                            className="mt-1"
                                                            color="secondary"
                                                            type="button"
                                                            onClick={() => this.onClose()}
                                                        >
                                                            Buy tokens
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Alert>
                                        </div>
                                    ) : ''}

                                    {step === 'declined' ? (
                                        <div>
                                            <Alert className="bg-gradient-danger shadow">
                                                <Row >
                                                    <Col sm="8">
                                                        <h5 className="text-white mt-2">Your request to verification has declined!</h5>
                                                        <div>{viewer.verified.message}</div>
                                                    </Col>
                                                    <Col sm="4" className="align-content-end text-right">
                                                        <Button
                                                            className="mt-1"
                                                            color="secondary"
                                                            type="button"
                                                            onClick={() => this.setState({step: 'start'})}
                                                        >
                                                            Pass verification
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

export default connect(mapStateToProps, mapDispatchToProps)(Verification);
