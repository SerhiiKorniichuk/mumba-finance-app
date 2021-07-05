import React from "react";
import Nav from "../Nav";
import {QUERY_REQUESTS_COUNT} from "../../helpers/Api/Schema";
import Skeleton from "react-loading-skeleton";
import {Badge} from "reactstrap";
import {Query} from "react-apollo";

export default class extends React.Component {
    render() {
        return (
            <Nav active={this.props.active} list={[
                {title: 'HomeSection', to: '/admin'},
                {title: 'Settings', to: '/admin/settings'},
                {title: 'Payments', to: '/admin/payments'},
                {title: (<>
                        Users <Query query={QUERY_REQUESTS_COUNT} children={({error, data, loading}) => {
                            if (loading) {
                                return (<Skeleton width={20} height={19} />);
                            }
                            if (error) {
                                return (<Badge color="warning" className="text-white bg-gradient-danger">Error!</Badge>);
                            }
                            return (<Badge className="text-white bg-gradient-danger" color="warning">{data.userSearch.pagingInfo.totalCount}</Badge>);
                        }} />
                    </>), to: '/admin/users'},
                {title: 'Pages', to: '/admin/pages'},
            ]}/>
        );
    }
}
