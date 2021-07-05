import React from "react";
import {Button, Card, FormGroup, Input, Container, Row, Progress, Col, Form, InputGroupAddon, InputGroupText, InputGroup} from "reactstrap";
import {MUTATION_CHANGE_PASSWORD} from "../../../helpers/Api/Schema";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {systemSetPage} from "../../../store/system/actions";
import {Mutation} from "react-apollo";
import Login from "../../../components/Modal/Login";
import Alert from "reactstrap/es/Alert";
import Loader from "react-loader-spinner";
import SettingsNav from "../../../components/SettingsNav";
import PasswordInput from 'react-password-indicator';

class SettingsSecurity extends React.Component {
    state = {
        Login: false,
        cleared: false,
        oldPassword: '',
        newPassword: '',
        newPasswordRepeat: '',
        newPasswordShow: false,
        oldPasswordShow: false,
    };

    componentWillMount() {
        this.props.systemSetPage('settings/security');
    }

    toggleLogin = () => this.setState({Login: !this.state.Login});

    onChange = (e) =>  {
        const { name, value } = e.currentTarget;
        this.setState({ [name]: value });
    };

    setNewPasswordShow = (e) => {
        e.preventDefault();
        this.setState({newPasswordShow: !this.state.newPasswordShow});
    };

    setOldPasswordShow = (e) => {
        e.preventDefault();
        this.setState({oldPasswordShow: !this.state.oldPasswordShow});
    };

    render() {
        if (!this.props.userId) {
            return (<Redirect to={"/"} />);
        }
        return (<>
            <section className="section section-lg bg-gradient-secondary">
                <Container>
                    <SettingsNav active="/settings/security" />
                    <Row className="mt-4">
                        <Col lg="12">
                            <Card className="shadow">
                                <div className="p-4">
                                    <Row>
                                        <Col md="6">
                                            <h5>Change password</h5>
                                            <Mutation mutation={MUTATION_CHANGE_PASSWORD}>
                                                {(mutate, {data, loading, error}) => {
                                                    let isFilledAll = this.state.oldPassword && this.state.newPassword &&
                                                        this.state.newPasswordRepeat && this.state.newPassword === this.state.newPasswordRepeat;
                                                    if (data && data.changePassword && !this.state.cleared &&  (this.state.newPasswordRepeat || this.state.oldPassword || this.state.newPassword)) {
                                                        this.setState({
                                                            cleared: true,
                                                            oldPassword: '',
                                                            newPassword: '',
                                                            newPasswordRepeat: '',
                                                        });
                                                    }
                                                    return (<Form
                                                        className="mt-4"
                                                        onSubmit={e => {
                                                            e.preventDefault();
                                                            mutate({
                                                                variables: {
                                                                    oldPassword: this.state.oldPassword,
                                                                    newPassword: this.state.newPassword,
                                                                    newPasswordRepeat: this.state.newPasswordRepeat,
                                                                },
                                                            });
                                                            this.setState({
                                                                cleared: false,
                                                            })
                                                        }}>

                                                        {error && error.graphQLErrors.map(({ message }, i) => (
                                                            <Alert color="warning" key={i}>
                                                                {message}
                                                            </Alert>
                                                        ))}
                                                        {data ? <Alert color="success">
                                                            Password has been changed
                                                        </Alert> : false}

                                                        <FormGroup>
                                                            <InputGroup>
                                                                <Input
                                                                    placeholder="Enter old password"
                                                                    type={this.state.oldPasswordShow ? 'text' : 'password'}
                                                                    name="oldPassword"
                                                                    value={this.state.oldPassword}
                                                                    onChange={this.onChange}
                                                                />
                                                                <InputGroupAddon addonType="append">
                                                                    <InputGroupText className="p-0">
                                                                        <button className="blank-btn show-password-eye-btn" onClick={this.setOldPasswordShow}>
                                                                            <i className={`fa fa-eye ` + (this.state.oldPasswordShow ? 'text-success' : 'text-primary')} />
                                                                        </button>
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                            </InputGroup>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <PasswordInput
                                                                minLen={6}
                                                                digits={2}
                                                                specialChars={2}
                                                                uppercaseChars={2}
                                                                maxLen={30}
                                                                isVisible={this.state.newPasswordShow}
                                                                name="newPassword"
                                                                onChange={(newPassword) => this.setState({newPassword})}
                                                            >
                                                                {({ getInputProps, valid, getProgressProps, errors, touched }) => (
                                                                    <React.Fragment>
                                                                            <InputGroup>
                                                                                <Input
                                                                                    className={touched ? (valid ? 'success' : 'error') : ''}
                                                                                    {...getInputProps()}
                                                                                    value={this.state.newPassword}
                                                                                    placeholder="Enter new password"

                                                                                />
                                                                                <InputGroupAddon addonType="append">
                                                                                    <InputGroupText className="p-0">
                                                                                        <button className="blank-btn show-password-eye-btn" onClick={this.setNewPasswordShow}>
                                                                                            <i className={`fa fa-eye ` + (this.state.newPasswordShow ? 'text-success' : 'text-primary')} />
                                                                                        </button>
                                                                                    </InputGroupText>
                                                                                </InputGroupAddon>
                                                                            </InputGroup>
                                                                        {touched ? <div className="mt-2 mb-2">
                                                                            <Progress {...getProgressProps()} color={getProgressProps().value < 2 ? 'danger' : getProgressProps().value < 4 ? 'warning' : 'success'} style={{marginBottom: 0}} />
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
                                                        <FormGroup>
                                                            <InputGroup>
                                                                <Input
                                                                    placeholder="Repeat new password"
                                                                    type={this.state.newPasswordShow ? 'text' : 'password'}
                                                                    name="newPasswordRepeat"
                                                                    value={this.state.newPasswordRepeat}
                                                                    onChange={this.onChange}
                                                                />
                                                            </InputGroup>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Button
                                                                color="success"
                                                                disabled={!isFilledAll}
                                                            >
                                                                {loading ? <Loader
                                                                    type="ThreeDots"
                                                                    color="#fff"
                                                                    height={7}
                                                                    width={45}
                                                                /> : 'Change password'}
                                                            </Button>
                                                        </FormGroup>
                                                    </Form>);
                                                }}
                                            </Mutation>
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col lg="12">
                            <Card className="shadow">
                                <div className="p-4">
                                    <Row >
                                        <Col md="6">
                                            <h5>Authenticator</h5>
                                            <FormGroup className="mt-4">
                                                <Button color="success" onClick={this.toggleLogin}>
                                                    Reset authenticator secret
                                                </Button>
                                                <Login isOpen={this.state.Login} toggle={this.toggleLogin} authenticatorReset={true} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>

            </section>
        </>);
    }
}


const mapStateToProps = ({auth}) => ({
    userId: auth.userId
});

const mapDispatchToProps = {
    systemSetPage
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsSecurity);
