import React from "react";
import {Button, Card, FormGroup, Container, Row, Col, Form, Alert, InputGroup, Input} from "reactstrap";
import {connect} from "react-redux";
import {systemSetPage} from "../../../store/system/actions";
import TimezonePicker from "react-timezone";
import {Mutation, Query} from "react-apollo";
import {MUTATION_CHANGE_CONFIG, QUERY_GET_CONFIG} from "../../../helpers/Api/Schema";
import Skeleton from "react-loading-skeleton";
import Loader from "react-loader-spinner";
import Label from "reactstrap/es/Label";
import './Styles.css';
import {Redirect} from "react-router";
import AdminNav from "../../../components/AdminNav";


class AdminSettings extends React.Component {
    state = {
        siteName: null,
        metaKeywords: null,
        metaDescription: null,
        googleAnalytics: null,
        timeZone: null
    };

    componentWillMount() {
        this.props.systemSetPage('admin/settings');
    }
    onChange = (e) => {
        const { name, value } = e.currentTarget;
        this.setState({ [name]: value });
    };

    render() {
        if (!this.props.userId) {
            return (<Redirect to="/" />);
        }
        return (<>
            <section className="section section-lg bg-gradient-secondary">
                <Container>
                    <AdminNav active="/admin/settings"/>
                    <Card className="mt-4">
                        <div className="p-4">
                            <Row>
                                <Col lg="6">
                                    <h5>Site settings</h5>
                                    <Query query={QUERY_GET_CONFIG} >
                                        {({data, loading, error}) => {
                                            const queryLoading = loading;
                                            let {siteName, metaDescription, metaKeywords, timeZone, googleAnalytics} = this.state;
                                            const config = !queryLoading && data.getConfig ? data.getConfig : this.state;
                                            if (siteName === null) {
                                                siteName = config.siteName;
                                            }
                                            if (metaDescription === null) {
                                                metaDescription = config.metaDescription;
                                            }
                                            if (metaKeywords === null) {
                                                metaKeywords = config.metaKeywords;
                                            }
                                            if (timeZone === null) {
                                                timeZone = config.timeZone;
                                            }
                                            if (googleAnalytics === null) {
                                                googleAnalytics = config.googleAnalytics;
                                            }
                                            return (<Mutation mutation={MUTATION_CHANGE_CONFIG}>
                                                {(mutate, {data, loading, error}) => {
                                                    return (<Form
                                                        className="mt-3"
                                                        onSubmit={e => {
                                                            e.preventDefault();
                                                            mutate({
                                                                variables: {siteName, metaDescription, metaKeywords, timeZone, googleAnalytics},
                                                            });
                                                        }}>
                                                        {error && error.graphQLErrors.map(({ message }, i) => (
                                                            <Alert color="warning" key={i}>
                                                                {message}
                                                            </Alert>
                                                        ))}
                                                        {data ? <Alert color="success">
                                                            Settings has been changed!
                                                        </Alert> : false}
                                                        <FormGroup className="mb-3">
                                                            <Label>Site Name</Label>
                                                            {queryLoading ? <Skeleton height={42} /> : <InputGroup>
                                                                <Input
                                                                    type="text"
                                                                    name="siteName"
                                                                    value={siteName}
                                                                    onChange={this.onChange}
                                                                    placeholder="Enter site name"
                                                                />
                                                            </InputGroup>}
                                                        </FormGroup>
                                                        <FormGroup className="mb-3">
                                                            <Label>Time zone</Label>
                                                            {queryLoading ? <Skeleton height={42} /> : <TimezonePicker
                                                                className="form-control Admin--TimeZone"
                                                                value={timeZone}
                                                                onChange={timeZone => this.setState({timeZone})}
                                                                inputProps={{
                                                                    placeholder: 'Select Timezone...',
                                                                    name: 'timezone',
                                                                }}
                                                            />}
                                                        </FormGroup>
                                                        <FormGroup className="mb-3">
                                                            <Label>Google analytics</Label>
                                                            {queryLoading ? <Skeleton height={42} /> : <InputGroup>
                                                                <Input
                                                                    type="text"
                                                                    name="googleAnalytics"
                                                                    onChange={this.onChange}
                                                                    value={googleAnalytics}
                                                                    placeholder="Enter google analytics key"
                                                                />
                                                            </InputGroup>}
                                                        </FormGroup>
                                                        <FormGroup className="mb-3">
                                                            <Label>Meta description</Label>
                                                            {queryLoading ? <Skeleton height={42} /> : <InputGroup>
                                                                <Input
                                                                    type="text"
                                                                    name="metaDescription"
                                                                    onChange={this.onChange}
                                                                    value={metaDescription}
                                                                    placeholder="Enter meta description"
                                                                />
                                                            </InputGroup>}
                                                        </FormGroup>
                                                        <FormGroup className="mb-3">
                                                            <Label>Meta keywords</Label>
                                                            {queryLoading ? <Skeleton height={42} /> : <InputGroup>
                                                                <Input
                                                                    type="text"
                                                                    name="metaKeywords"
                                                                    onChange={this.onChange}
                                                                    value={metaKeywords}
                                                                    placeholder="Enter meta keywords"
                                                                />
                                                            </InputGroup>}
                                                        </FormGroup>
                                                        <FormGroup className="mt-4">
                                                            <Button disabled={queryLoading} color="success">
                                                                {loading ? <Loader
                                                                    type="ThreeDots"
                                                                    color="#fff"
                                                                    height={7}
                                                                    width={45}
                                                                /> : 'Change settings'}
                                                            </Button>
                                                        </FormGroup>
                                                    </Form>);
                                                }}
                                            </Mutation>);
                                        }}
                                    </Query>
                                </Col>
                            </Row>
                        </div>
                    </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminSettings);
