import React from "react";
import {Table, Card, FormGroup, Badge, Container, Row, Col, Alert, InputGroup, Nav, NavLink, NavItem} from "reactstrap";
import {connect} from "react-redux";
import {systemSetPage} from "../../../store/system/actions";
import {Query} from "react-apollo";
import {QUERY_REQUESTS_COUNT, QUERY_USER_SEARCH} from "../../../helpers/Api/Schema";
import Skeleton from "react-loading-skeleton";
import Loader from "react-loader-spinner";
import InfiniteScroll from 'react-infinite-scroller';

import Moment from 'react-moment';
import {Redirect} from "react-router";
import AdminNav from "../../../components/AdminNav";
import SearchInput from "../../../components/SearchInput";

import ViewUser from '../../../components/Modal/ViewUser';

class AdminUsers extends React.Component {
    state = {
        query: null,
        activeTab: 'users',
        userId: 0,
    };

    componentWillMount() {
        this.props.systemSetPage('admin/users');
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
                    <AdminNav active="/admin/users" />
                    <ViewUser userId={this.state.userId} onClose={() => this.setState({userId: 0})}/>
                    <Card className="mt-4">
                        <div className="p-4">
                            <Row>
                                <Col lg="12">
                                    <Nav pills={true} className="mb-2">
                                        <NavItem className="m-1">
                                            <NavLink
                                                href="#"
                                                active={this.state.activeTab === 'users'}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    this.setState({activeTab: 'users'});
                                                }}
                                            >
                                                Users
                                            </NavLink>
                                        </NavItem>
                                        <NavItem className="m-1">
                                            <NavLink
                                                href="#"
                                                active={this.state.activeTab === 'verification'}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    this.setState({activeTab: 'verification'});
                                                }}
                                            >
                                                Verification <Query query={QUERY_REQUESTS_COUNT} children={({error, data, loading}) => {
                                                    if (loading) {
                                                        return (<Skeleton width={20} height={20} />);
                                                    }
                                                    if (error) {
                                                        return (<Badge color="warning" className="text-white bg-gradient-danger" >Error!</Badge>);
                                                    }
                                                    return (<Badge className="text-white bg-gradient-danger" color="warning">{data.userSearch.pagingInfo.totalCount}</Badge>);
                                                }} />
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                    <Query query={QUERY_USER_SEARCH} variables={{
                                        query: this.state.query,
                                        limit: 100,
                                        offset: 0,
                                        verifyRequests: this.state.activeTab === 'verification',
                                    }}>{({loading, error, data, fetchMore}) => {
                                        let hasMore = false;
                                        if (!loading && !error && data.userSearch) {
                                            hasMore = data.userSearch.pagingInfo.totalCount > data.userSearch.pagingInfo.offset;
                                        }
                                        const onLoadMore = () => hasMore && fetchMore({
                                            variables: {
                                                query: this.state.query,
                                                limit: data.userSearch.pagingInfo.limit,
                                                offset: data.userSearch.pagingInfo.offset,
                                                verifyRequests: this.state.activeTab === 'verification',
                                            },
                                            updateQuery: (prevResult, { fetchMoreResult }) => {
                                                if (fetchMoreResult.userSearch) {
                                                    const newItems = fetchMoreResult.userSearch.items;
                                                    const pagingInfo = fetchMoreResult.userSearch.pagingInfo;
                                                    return newItems.length
                                                        ? {
                                                            userSearch: {
                                                                __typename: prevResult.userSearch.__typename,
                                                                items: [...prevResult.userSearch.items, ...newItems],
                                                                pagingInfo
                                                            }
                                                        }
                                                        : prevResult;
                                                }
                                                return prevResult;
                                            }
                                        });

                                        return (<InfiniteScroll
                                            useWindow={false}
                                            loadMore={onLoadMore}
                                            hasMore={hasMore}
                                            loader={<Loader key={0} />}
                                        >
                                            {this.state.activeTab === 'users' ? (<FormGroup className="mb-3">
                                                <InputGroup>
                                                    <SearchInput
                                                        type="text"
                                                        name="query"
                                                        onChange={(query) => this.setState({query})}
                                                        placeholder="Enter username or phone or email for search users"
                                                    />
                                                </InputGroup>
                                            </FormGroup>) : ''}
                                            {this.state.activeTab === 'users' ? (<h6>Users {!loading && !error ? data.userSearch.pagingInfo.totalCount  : null}</h6>) : ''}
                                            {this.state.activeTab === 'verification' ? (<h6>Requests {!loading && !error ? data.userSearch.pagingInfo.totalCount  : null}</h6>) : ''}
                                            <div style={{overflowY: 'scroll'}}>
                                                <Table className="Users--Table">
                                                    <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Name</th>
                                                        <th>Username</th>
                                                        <th>Joined</th>
                                                        <th>Tokens</th>
                                                        <th>Verified</th>
                                                        <th />
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {error ? error.graphQLErrors.map(({ message }, i) => (
                                                       <tr key={i}>
                                                           <td colSpan={7}>
                                                               <Alert color="warning">
                                                                   {message}
                                                               </Alert>
                                                           </td>
                                                       </tr>
                                                    )) : null}
                                                    {!loading && !data.userSearch.pagingInfo.totalCount ? (<tr key={0}>
                                                        <td colSpan={7} className="text-center">
                                                           <h4 className="m-5 text-primary">Nothing has been found</h4>
                                                        </td>
                                                    </tr>) : null}
                                                    {loading ? (<tr key={0}>
                                                        <th><Skeleton count={10}/></th>
                                                        <td><Skeleton count={10}/></td>
                                                        <td><Skeleton count={10}/></td>
                                                        <td><Skeleton count={10}/></td>
                                                        <td><Skeleton count={10}/></td>
                                                        <td><Skeleton count={10}/></td>
                                                        <td><Skeleton count={10}/></td>
                                                    </tr>) : data.userSearch.items.map(({userId, firstName, lastName, username, joinDate, isVerified}, i) =>(<tr key={i}>
                                                        <th>{userId}</th>
                                                        <td>{firstName} {lastName}</td>
                                                        <td>{username}</td>
                                                        <td>
                                                            <Moment format="DD.MM.YYYY">{joinDate}</Moment>
                                                        </td>
                                                        <td>0</td>
                                                        <td>{isVerified ?(<div className="text-success">Yes</div>) : (<div className="text-warning">No</div>)}</td>
                                                        <td>
                                                            <button className="full-clean-btn" onClick={(e) => {
                                                                e.preventDefault();
                                                                this.setState({userId: userId});
                                                            }}>
                                                                <i className="ni ni-settings" />
                                                            </button>
                                                        </td>
                                                    </tr>))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </InfiniteScroll>);
                                    }}</Query>
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminUsers);
