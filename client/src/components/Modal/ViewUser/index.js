import React from "react";
import {Table, FormGroup, Row, Col, Alert, InputGroup, Nav, NavLink, NavItem, Modal, Input} from "reactstrap";
import {Query, Mutation} from "react-apollo/index";
import {QUERY_VIEW_USER, MUTATION_CHANGE_USER_TYPE, MUTATION_CHANGE_DEACTIVATED, MUTATION_CHANGE_VERIFIED} from "../../../helpers/Api/Schema";
import Skeleton from "react-loading-skeleton";
import UserAvatar from 'react-user-avatar';

import Moment from 'react-moment/dist/index';
import SearchInput from "../../SearchInput";
import './Styles.css';
import Button from "reactstrap/es/Button";
import Loader from "react-loader-spinner";
import ReactDatetime from 'react-datetime';
import moment from 'moment';
import ViewPhoto from '../ViewPhoto';

export default class extends React.Component {
    state = {
        verification: false,
        query: '',
        active: 'info',
        message: '',
        limit: 10,
        offset: 0,
        banDate: '',
        photo: '',
        verifiedStatus: 0,
    };
    statuses = {
        1: {title: 'Pending', color: 'text-info'},
        0: {title: 'None', color: 'text-primary'},
        2: {title: 'Declined', color: 'text-danger'},
        3: {title: 'Approved', color: 'text-success'}
    };

    prepareOpen = () => {
        this.setState({
            verification: false,
            query: '',
            active: 'info',
            message: '',
            limit: 10,
            offset: 0,
            banDate: '',
            photo: '',
        });
    };

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (nextProps.userId && !this.props.userId) {
            this.prepareOpen();
        }
    }

    onClose = () => {
        this.props.onClose();
    };

    getCountry = (country, countries) => {
        let countryRes = '';
        countries.forEach(({countryCode, countryName}) => {
            if (countryCode.toString() === country) {
                countryRes = countryName;
            }
        });
        return countryRes;
    };

    onChange = (e) => {
        const { name, value } = e.currentTarget;
        this.setState({ [name]: value });
    };

    render() {
        const {userId} = this.props;
        const {active, limit, offset, query} = this.state;
        const isOpen = userId > 0;
        return (<Modal isOpen={isOpen} toggle={this.onClose} size="lg">
            <ViewPhoto onClose={() => this.setState({photo: ''})} photo={this.state.photo}/>
            <div className="m-3">
                {isOpen ? <Query query={QUERY_VIEW_USER} variables={{userId, limit, offset, query}}>
                    {({loading, error, data, fetchMore, refetch}) => {
                        if (!loading && (!data || !data.user)) {
                            return error.graphQLErrors.map(({ message }, i) => (
                                <Alert color="warning" key={i}>
                                    {message}
                                </Alert>
                            ));
                        }
                        let hasMore = false;
                        if (!loading && !error && data.user.userLogs) {
                            hasMore = data.user.userLogs.pagingInfo.totalCount > data.user.userLogs.pagingInfo.offset;
                        }
                        const onLoadMore = () => hasMore && fetchMore({
                            variables: {
                                query: this.state.query,
                                limit: data.user.userLogs.pagingInfo.limit,
                                offset: data.user.userLogs.pagingInfo.offset
                            },
                            updateQuery: (prevResult, { fetchMoreResult }) => {
                                if (fetchMoreResult.user.userLogs) {
                                    const newItems = fetchMoreResult.user.userLogs.items;
                                    const pagingInfo = fetchMoreResult.user.userLogs.pagingInfo;
                                    return newItems.length
                                        ? {
                                            user: {
                                                ...prevResult.user,
                                                userLogs: {
                                                    __typename: prevResult.user.userLogs.__typename,
                                                    items: [...prevResult.user.userLogs.items, ...newItems],
                                                    pagingInfo
                                                }
                                            }
                                        }
                                        : prevResult;
                                }
                                return prevResult;
                            }
                        });

                        return (<>
                            <Nav pills={true}>
                                <NavItem className="m-1">
                                    {loading? <Skeleton width={100}  height={40}/> : <NavLink href="#" active={active === 'info'} onClick={(e) => {
                                        e.preventDefault();
                                        this.setState({active: 'info'});
                                    }}>
                                        Account
                                    </NavLink>}
                                </NavItem>
                                <NavItem className="m-1">
                                    {loading ? <Skeleton width={62}  height={40}/> : <NavLink href="#" active={active === 'logs'} onClick={(e) => {
                                        e.preventDefault();
                                        this.setState({active: 'logs'});
                                    }}>
                                        Logs
                                    </NavLink>}
                                </NavItem>
                            </Nav>
                            {active === 'info' ? (<div>
                                <Row className="m-3">
                                    <Col lg="2">
                                        {loading ? (<div className="ViewUser--Avatar-Placeholder">
                                            <Skeleton width={100} height={100} circle={true}/>
                                        </div>) : (<UserAvatar
                                            className="text-white display-3"
                                            src={data.user.photo}
                                            size={100}
                                            name={`${data.user.firstName} ${data.user.lastName}`}
                                        />)}
                                    </Col>
                                    <Col lg="10">
                                        <div>
                                            <h4 style={{margin: 0}} className="text-dark">
                                                {loading ? <Skeleton /> : `${data.user.firstName} ${data.user.lastName}`}
                                            </h4>
                                            <div className="text-warning text-lg-left">
                                                {!loading && data.user.deactivated === 1 ? (<div className="mt-2 mb-3">
                                                    Deactivated account by self
                                                </div>) : ''}
                                                {!loading && data.user.deactivated === 2 ? (<div className="mt-2 mb-3">
                                                    Account has been banned till <Moment format="DD.MM.YYYY ">{data.user.banDate}</Moment>
                                                </div>) : ''}
                                                {!loading && data.user.deactivated === 3 ? (<div className="mt-2 mb-3">
                                                    Account has been deleted by administrator
                                                </div>) : ''}
                                            </div>
                                            <div>
                                                {loading ? <Skeleton /> : (<Row className="mt-2">
                                                    <Col lg="2">Role:</Col>
                                                    <Col lg="10" className="text-dark">
                                                        {data.user.isAdmin ? `Administrator` : `User`}
                                                    </Col>
                                                </Row>)}
                                            </div>
                                            <div className="mt-2 mb-2">
                                                {loading ? <Skeleton /> : !data.user.isViewer ? <Mutation mutation={MUTATION_CHANGE_USER_TYPE}>
                                                    {(mutate, result) => {
                                                        const processMutate = (userType) => {
                                                           mutate({
                                                               variables: {
                                                                   userId: data.user.userId,
                                                                   userType
                                                               }
                                                           });
                                                       };
                                                       if (result.data && result.data.changeUserType) {
                                                           refetch();
                                                       }
                                                       if (result.error) {
                                                           return result.error.graphQLErrors.map(({ message }, i) => (
                                                               <Alert color="warning" key={i}>
                                                                   {message}
                                                               </Alert>
                                                           ));
                                                       }
                                                    if (data.user.isAdmin) {
                                                        return (<Button color="warning" size="sm" onClick={() => processMutate(0)}>
                                                            {result.loading ? <Loader
                                                                type="ThreeDots"
                                                                color="#fff"
                                                                height={7}
                                                                width={45}
                                                            /> : 'Downgrade to user'}
                                                            </Button>);
                                                    }
                                                    return (<Button color="success" size="sm" onClick={() => processMutate(1)}>
                                                        {result.loading ? <Loader
                                                        type="ThreeDots"
                                                        color="#fff"
                                                        height={7}
                                                        width={45}
                                                    /> : 'Promote to administrator'}
                                                    </Button>);
                                                }}
                                                </Mutation>: ''}
                                            </div>
                                            <div>{loading ? <Skeleton /> : (<Row className="mt-2">
                                                <Col lg="2">ID:</Col>
                                                <Col lg="10" className="text-dark">
                                                    {data.user.userId}
                                                </Col>
                                            </Row>)}</div>
                                            <div>{loading ? <Skeleton /> :  <Row className="mt-2">
                                                <Col lg="2">Username:</Col>
                                                <Col lg="10" className="text-dark">
                                                    {data.user.username}
                                                </Col>
                                            </Row>}</div>
                                            <div>{loading ? <Skeleton /> :  <Row className="mt-2">
                                                <Col lg="2">Birthday:</Col>
                                                <Col lg="10" className="text-dark">
                                                    {data.user.bday}.{data.user.bmonth}.{data.user.byear}
                                                </Col>
                                            </Row>}</div>
                                            <div>{loading ? <Skeleton /> :  <Row className="mt-2">
                                                <Col lg="2">Gender:</Col>
                                                <Col lg="10" className="text-dark">
                                                    {data.user.sex === 1 ? 'Male' : 'Female'}
                                                </Col>
                                            </Row>}</div>
                                            <div>{loading ? <Skeleton /> : (<Row className="mt-2">
                                                <Col lg="2">Last Visit:</Col>
                                                <Col lg="10" className="text-dark">
                                                    <Moment format="DD.MM.YYYY ">{data.user.lastVisit}</Moment>at
                                                    <Moment format=" h:m:s">{data.user.lastVisit}</Moment>
                                                </Col>
                                            </Row>)}</div>
                                            <div>{loading ? <Skeleton /> : (<Row className="mt-2">
                                                <Col lg="2">Last IP:</Col>
                                                <Col lg="10" className="text-dark">
                                                    {data.user.lastVisitIp}
                                                </Col>
                                            </Row>)}</div>
                                            <div>{loading ? <Skeleton /> : (<Row className="mt-2">
                                                <Col lg="2">Email:</Col>
                                                <Col lg="10" className="text-dark">
                                                    {data.user.email}
                                                </Col>
                                            </Row>)}</div>
                                            <div>{loading ? <Skeleton /> : (<Row className="mt-2">
                                                <Col lg="2">Phone:</Col>
                                                <Col lg="10" className="text-dark">
                                                    {data.user.phone}
                                                </Col>
                                            </Row>)}</div>
                                            <div>{loading ? <Skeleton /> : (<Row className="mt-2">
                                                <Col lg="2">Joined IP:</Col>
                                                <Col lg="10" className="text-dark">
                                                    {data.user.joinIp}
                                                </Col>
                                            </Row>)}</div>
                                            <div>{loading ? <Skeleton /> : (<Row className="mt-2">
                                                <Col lg="2">Joined:</Col>
                                                <Col lg="10" className="text-dark">
                                                    <Moment format="DD.MM.YYYY ">{data.user.joinDate}</Moment>at
                                                    <Moment format=" h:m:s">{data.user.joinDate}</Moment>
                                                </Col>
                                            </Row>)}</div>
                                            <div>{loading ? <Skeleton /> : (<Row className="mt-2">
                                                <Col lg="2">Verified:</Col>
                                                <Col lg="10" >
                                                    {data.user.isVerified ? (<div className="text-success">Yes</div>) : (<div className="text-warning">No</div>)}
                                                </Col>
                                            </Row>)}</div>
                                            <div>{loading ? <Skeleton /> : (data.user.country ? (<Row className="mt-2">
                                                <Col lg="2">Nationality:</Col>
                                                <Col lg="10" className="text-dark">
                                                    {this.getCountry(data.user.country, data.countries)}
                                                </Col>
                                            </Row>) : '')}</div>
                                            <div className="mt-2 mb-2">
                                                {loading ? <Skeleton /> : !data.user.isViewer && data.user.deactivated !== 1 ? <Mutation mutation={MUTATION_CHANGE_DEACTIVATED}>
                                                    {(mutate, result) => {
                                                        const processMutate = (deactivatedStatus) => {
                                                            mutate({
                                                                variables: {
                                                                    userId: data.user.userId,
                                                                    deactivatedStatus,
                                                                    banDate: this.state.banDate
                                                                }
                                                            });
                                                        };
                                                        if (result.data && result.data.changeUserDeactivated) {
                                                            refetch();
                                                        }
                                                        let errorMsg = '';
                                                        if (result.error) {
                                                            errorMsg = result.error.graphQLErrors.map(({ message }, i) => (
                                                                <Alert color="warning" key={i}>
                                                                    {message}
                                                                </Alert>
                                                            ));
                                                        }
                                                        if (data.user.deactivated === 0) {
                                                            return (<>
                                                                {errorMsg}
                                                                <Row className="mt-3">
                                                                    <Col lg="10">
                                                                        <FormGroup>
                                                                            <InputGroup>
                                                                                <ReactDatetime
                                                                                    isValidDate={(currentDate) =>  currentDate.isAfter(moment(new Date()))}
                                                                                    onChange={(result) => {
                                                                                        return this.setState({
                                                                                            banDate: moment(result._d).format('DD.MM.YYYY'),
                                                                                        });
                                                                                    }}
                                                                                    style={{
                                                                                        padding: 10
                                                                                    }}
                                                                                    inputProps={{
                                                                                        placeholder: "Ban date"
                                                                                    }}
                                                                                    timeFormat={false}
                                                                                />
                                                                                <Button
                                                                                    disabled={!this.state.banDate}
                                                                                    color="warning"
                                                                                    onClick={() => processMutate(2)}>
                                                                                    {result.loading ? <Loader
                                                                                        type="ThreeDots"
                                                                                        color="#fff"
                                                                                        height={7}
                                                                                        width={45}
                                                                                    /> : 'Ban user'}
                                                                                </Button>
                                                                            </InputGroup>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col lg="10">
                                                                        <Button color="danger" onClick={() => processMutate(3)}>
                                                                            {result.loading ? <Loader
                                                                                type="ThreeDots"
                                                                                color="#fff"
                                                                                height={7}
                                                                                width={45}
                                                                            /> : 'Delete user'}
                                                                        </Button>
                                                                    </Col>
                                                                </Row>
                                                            </>);

                                                        }
                                                        return (<>
                                                            {errorMsg}
                                                            <Button color="success" onClick={() => processMutate(0)}>
                                                                {result.loading ? <Loader
                                                                    type="ThreeDots"
                                                                    color="#fff"
                                                                    height={7}
                                                                    width={45}
                                                                /> : (data.user.deactivated === 2 ? 'Unban user' : 'Restore user')}
                                                            </Button>
                                                        </>);
                                                    }}
                                                </Mutation>: ''}
                                            </div>
                                            {!loading && data && data.user && data.user.verified && data.user.verified.status !== 0 ? (<div className="mt-3 mb-2">
                                                <Button
                                                    color={this.state.verification ? 'primary' : (data.user.verified === '1' ? 'warning' : 'info')}
                                                    onClick={() => this.setState({verification: !this.state.verification})}
                                                >Verification</Button>
                                                <div style={{display: this.state.verification ? "block" : "none"}}>{loading ? <Skeleton /> : (data.user.verified.photos ? <Row className="mt-2">
                                                    <Col lg="2">Photos:</Col>
                                                    {data.user.verified.photos.map((photo, i) => (<Col lg="4" className="text-dark mb-2" key={i}>
                                                        <a href={photo} onClick={(e) => {
                                                            e.preventDefault();
                                                            this.setState({photo: e.currentTarget.href});
                                                        }}>
                                                            <img
                                                                alt=""
                                                                className="img-fluid img"
                                                                src={photo}
                                                            />
                                                        </a>
                                                    </Col>))}
                                                    <Col xs="12">
                                                        <Row>
                                                            <Col lg="2">Status:</Col>
                                                            <Col lg="4" className={ `mb-2 `+ this.statuses[data.user.verified.status].color}>{this.statuses[data.user.verified.status].title}</Col>
                                                        </Row>
                                                    </Col>
                                                    {data.user.verified.message ? (<Col xs="12">
                                                        <Row>
                                                            <Col lg="2">Message:</Col>
                                                            <Col lg="4" className="text-dark mb-2">{data.user.verified.message}</Col>
                                                        </Row>
                                                    </Col>) : ''}
                                                    <Col lg="12">
                                                        <Mutation mutation={MUTATION_CHANGE_VERIFIED}>
                                                            {(mutate, result) => {
                                                                const processMutate = (verifiedStatus) => {
                                                                    mutate({
                                                                        variables: {
                                                                            userId: data.user.userId,
                                                                            verifiedStatus,
                                                                            message: this.state.message
                                                                        }
                                                                    });
                                                                    this.setState({verifiedStatus});
                                                                };
                                                                if (result.data && result.data.changeVerified && this.state.verifiedStatus !== data.user.verified.status) {
                                                                    refetch();
                                                                }
                                                                let errorMsg = '';
                                                                if (result.error) {
                                                                    errorMsg = result.error.graphQLErrors.map(({ message }, i) => (
                                                                        <Alert color="warning" key={i}>
                                                                            {message}
                                                                        </Alert>
                                                                    ));
                                                                }
                                                                if (data.user.verified.status === 1 || data.user.verified.status === 0) {
                                                                    return (<>
                                                                        {errorMsg}
                                                                        <Row className="mt-3">
                                                                            <Col lg="10">
                                                                                <FormGroup>
                                                                                    <Input
                                                                                        name="message"
                                                                                        onChange={this.onChange}
                                                                                        placeholder="Type here decline message"
                                                                                        type="textarea"
                                                                                    />
                                                                                </FormGroup>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col lg="10">
                                                                                <Button color="success" onClick={() => processMutate(3)}>
                                                                                    {result.loading && this.state.verifiedStatus === 3 ? <Loader
                                                                                        type="ThreeDots"
                                                                                        color="#fff"
                                                                                        height={7}
                                                                                        width={45}
                                                                                    /> : 'Approve'}
                                                                                </Button>
                                                                                <Button color="danger" onClick={() => processMutate(2)}>
                                                                                    {result.loading && this.state.verifiedStatus === 2 ? <Loader
                                                                                        type="ThreeDots"
                                                                                        color="#fff"
                                                                                        height={7}
                                                                                        width={45}
                                                                                    /> : 'Decline'}
                                                                                </Button>
                                                                            </Col>
                                                                        </Row>
                                                                    </>);
                                                                }
                                                                return (<>
                                                                    {errorMsg}
                                                                    <Button color="success" onClick={() => processMutate(1)}>
                                                                        {result.loading ? <Loader
                                                                            type="ThreeDots"
                                                                            color="#fff"
                                                                            height={7}
                                                                            width={45}
                                                                        /> : (data.user.verified.status === 2 ? 'Cancel decline' : 'Cancel approve')}
                                                                    </Button>
                                                                </>);
                                                            }}
                                                        </Mutation>
                                                    </Col>
                                                </Row> : '')}</div>
                                            </div>) : ''}
                                        </div>
                                    </Col>
                                </Row>
                            </div>) : ''}
                            {active === 'logs' ? (<div className="mt-3">
                                <FormGroup className="mb-3">
                                    <InputGroup>
                                        <SearchInput
                                            type="text"
                                            name="query"
                                            value={query}
                                            onChange={(query) => this.setState({query})}
                                            placeholder="Enter IP or browser or action for search in logs"
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <h6>Actions {!loading ? data.user.userLogs.pagingInfo.totalCount  : ''}</h6>
                                <div style={{overflowY: 'scroll'}}>
                                    <Table className="Users--Table">
                                        <thead>
                                        <tr>
                                            <th>Action</th>
                                            <th>Date</th>
                                            <th>Browser</th>
                                            <th>Platform</th>
                                            <th>IP</th>
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
                                        {!loading && !data.user.userLogs.pagingInfo.totalCount ? (<tr key={9}>
                                            <td colSpan={7} className="text-center">
                                                <h4 className="m-5 text-primary">Nothing has been found</h4>
                                            </td>
                                        </tr>) : null}
                                        {loading ? (<tr key={0}>
                                            <td><Skeleton count={10}/></td>
                                            <td><Skeleton count={10}/></td>
                                            <td><Skeleton count={10}/></td>
                                            <td><Skeleton count={10}/></td>
                                            <td><Skeleton count={10}/></td>
                                        </tr>) : data.user.userLogs.items.map(({actionType, actionComment, ipAddress, date, browserVersion, browser, browserPlatform}, i) => (<tr key={i}>
                                            <td>{actionComment}</td>
                                            <td>
                                                <Moment format="DD.MM.YYYY ">{date}</Moment>at
                                                <Moment format=" h:m:s">{date}</Moment>
                                            </td>
                                            <td>{browser} {browserVersion}</td>
                                            <td>{browserPlatform}</td>
                                            <td>{ipAddress}</td>
                                        </tr>))}
                                        </tbody>
                                    </Table>
                                </div>
                                {hasMore ? (<div>
                                    <Button color="success" onClick={() => onLoadMore()}>Load more</Button>
                                </div>) : ''}
                            </div>) : ''}
                        </>);
                    }}</Query> : ''}
            </div>
        </Modal>);
    }
}

