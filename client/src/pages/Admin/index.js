import React from "react";
import {Card, Container, Row, Col, Alert} from "reactstrap";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {systemSetPage} from "../../store/system/actions";
import AdminNav from '../../components/AdminNav';
import {Query} from "react-apollo";
import {QUERY_DASHBOARD} from "../../helpers/Api/Schema";
import Skeleton from "react-loading-skeleton";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';




class Admin extends React.Component {
    state = {
    };
    componentWillMount() {
        this.props.systemSetPage('admin');
    }

    render() {
        if (!this.props.userId) {
            return (<Redirect to={"/"} />);
        }
        return (<>
            <section className="section section-lg bg-gradient-secondary">
                <Container>
                    <AdminNav active="/admin" />
                    <Query query={QUERY_DASHBOARD} >
                        {({data, loading, error}) => {
                            if (!loading && (!data || !data.dashboard)) {
                                return (<Alert color="danger" className="mt-3 mb-3">Unknown error!</Alert>);
                            }
                            return (<Row className="mt-4">
                                <Col lg="4">
                                    <Card className="p-4 mb-3 text-center">
                                        <h3>
                                            {loading ? <Skeleton /> : data.dashboard.allTokensCount}
                                        </h3>
                                        <div>All tokens</div>
                                    </Card>
                                </Col>
                                <Col lg="4">
                                    <Card className="p-4 mb-3 text-center">
                                        <h3>
                                            {loading ? <Skeleton /> : data.dashboard.soldTokensCount}
                                        </h3>
                                        <div>Sold tokens</div>
                                    </Card>
                                </Col>
                                <Col lg="4">
                                    <Card className="p-4 mb-3 text-center">
                                        <h3>
                                            {loading ? <Skeleton /> : data.dashboard.residueTokensCount}
                                        </h3>
                                        <div>Residue tokens</div>
                                    </Card>
                                </Col>
                                <Col lg="4">
                                    <Card className="p-4 mb-3 text-center">
                                        <h3>
                                            {loading ? <Skeleton /> : data.dashboard.receivedMoney}
                                        </h3>
                                        <div>Money received</div>
                                    </Card>
                                </Col>
                                <Col lg="4">
                                    <Card className="p-4 mb-3 text-center">
                                        <h3>
                                            {loading ? <Skeleton /> : data.dashboard.receivedBtc}
                                        </h3>
                                        <div>BTC received</div>
                                    </Card>
                                </Col>
                                <Col lg="4" >
                                    <Card className="p-4 mb-3 text-center">
                                        <h3>
                                            {loading ? <Skeleton /> : data.dashboard.receivedUsd}
                                        </h3>
                                        <div>USD received</div>
                                    </Card>
                                </Col>
                                <Col lg="6">
                                    <Card className="p-4 mb-3 text-center">
                                        <h3>
                                            {loading ? <Skeleton /> : data.dashboard.allUsersCount}
                                        </h3>
                                        <div>All users</div>
                                    </Card>
                                </Col>
                                <Col lg="6">
                                    <Card className="p-4 mb-3 text-center">
                                        <h3>
                                            {loading ? <Skeleton /> : data.dashboard.monthlyUsersCount}
                                        </h3>
                                        <div>Monthly new users</div>
                                    </Card>
                                </Col>
                                <Col lg="12">
                                    <Card className="p-4 mb-3 text-center" >
                                        <h3>Users stats</h3>
                                        <div style={{overflowY: 'scroll'}}>
                                            {loading ? <Skeleton
                                                width={950}
                                                height={400}
                                            /> : <LineChart
                                                width={950}
                                                height={400}
                                                data={JSON.parse(data.dashboard.usersChartData)}
                                                margin={{
                                                    top: 5, right: 30, left: 20, bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="Signup" stroke="#8884d8" activeDot={{ r: 8 }} />
                                                <Line type="monotone" dataKey="Visit" stroke="#82ca9d" />
                                            </LineChart>}
                                        </div>
                                    </Card>
                                </Col>
                            </Row>);
                        }}
                    </Query>
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

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
