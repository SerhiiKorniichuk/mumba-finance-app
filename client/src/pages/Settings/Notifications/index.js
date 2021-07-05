import React from "react";
import {Button, Card, FormGroup, Container, Row, Col, Form, Alert} from "reactstrap";
import {MUTATION_CHANGE_NOTIFICATIONS, QUERY_EMAIL_NOTIFICATIONS} from "../../../helpers/Api/Schema";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";
import Skeleton from 'react-loading-skeleton';
import {systemSetPage} from "../../../store/system/actions";
import {Query, Mutation} from "react-apollo";
import Loader from "react-loader-spinner";
import SettingsNav from "../../../components/SettingsNav";


class Settings extends React.Component {
    state = {
        notifyNews: null,
        notifyIncoming: null,
    };

    componentWillMount() {
        this.props.systemSetPage('settings/notifications');
    }

    render() {
        if (!this.props.userId) {
            return (<Redirect to={"/"} />);
        }
        return (<>
            <section className="section section-lg bg-gradient-secondary">
                <Container>
                    <SettingsNav active="/settings/notifications" />
                    <Card className="shadow mt-4">
                        <div className="p-4">
                            <Row>
                                <Col lg="6">
                                    <h5>Email notifications</h5>
                                    <Query query={QUERY_EMAIL_NOTIFICATIONS} >
                                        {({data, loading, error}) => {
                                            const queryLoading = loading;
                                            if (!loading && (!data || !data.viewer)) {
                                                return (<Redirect to="/" />);
                                            }
                                            const {notifyIncoming, notifyNews} = !loading ? data.viewer : this.state;
                                            const notifyIncomingState = this.state.notifyIncoming !== null ? this.state.notifyIncoming : notifyIncoming;
                                            const notifyNewsState = this.state.notifyNews !== null ? this.state.notifyNews : notifyNews;
                                            return (<Mutation mutation={MUTATION_CHANGE_NOTIFICATIONS}>
                                                {(mutate, {data, loading, error}) => {
                                                    return (<Form
                                                        className="mt-3"
                                                        onSubmit={e => {
                                                            e.preventDefault();
                                                            mutate({
                                                                variables: {
                                                                    notifyIncoming: notifyIncomingState,
                                                                    notifyNews: notifyNewsState,
                                                                },
                                                            });
                                                        }}>
                                                        {error && error.graphQLErrors.map(({ message }, i) => (
                                                            <Alert color="warning" key={i}>
                                                                {message}
                                                            </Alert>
                                                        ))}
                                                        {data ? <Alert color="success">
                                                            Notifications settings has been updated
                                                        </Alert> : false}
                                                        {queryLoading ? <div className="mb-3">
                                                            <Skeleton height={20} />
                                                        </div> : <div className="custom-control custom-checkbox mb-3">
                                                            <input
                                                                className="custom-control-input"
                                                                name="notifyIncoming"
                                                                id="notifyIncoming"
                                                                type="checkbox"
                                                                onChange={(event) => this.setState({notifyIncoming: event.target.checked})}
                                                                defaultChecked={notifyIncomingState}
                                                            />
                                                            <label className="custom-control-label" htmlFor="notifyIncoming">
                                                                About new received income
                                                            </label>
                                                        </div>}
                                                        {queryLoading ? <div className="mb-3">
                                                            <Skeleton height={20} />
                                                        </div> : <div className="custom-control custom-checkbox mb-3">
                                                            <input
                                                                className="custom-control-input"
                                                                id="notifyNews"
                                                                name="notifyNews"
                                                                type="checkbox"
                                                                onChange={(event) => this.setState({notifyNews: event.target.checked})}
                                                                defaultChecked={notifyNewsState}
                                                            />
                                                            <label className="custom-control-label" htmlFor="notifyNews">
                                                                About new plans and other updates
                                                            </label>
                                                        </div>}
                                                        <FormGroup className="mt-4">
                                                            <Button disabled={queryLoading} color="success">
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

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
