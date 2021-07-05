import React from "react";
import {Card, Container} from "reactstrap";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {systemSetPage} from "../../../store/system/actions";
import AdminNav from "../../../components/AdminNav";
import { MDBDataTable } from "mdbreact";


class AdminSettings extends React.Component {
    
    state = {

    }

    componentWillMount() {
        this.props.systemSetPage('admin/payments');
    }

    componentDidMount() {
        
    }

    render() {
        if (!this.props.userId) {
            return (<Redirect to="/" />);
        }
        return (
            <section className="section section-lg bg-gradient-secondary">
                <Container>
                    <AdminNav active="/admin/payments" />
                    <Card className="mt-4">
                        <div className="p-4 text-center">
                            <h2>Under construction</h2>
                            <MDBDataTable hover striped bordered entriesOptions={[10, 25, 50, 100]} pagesAmount={4} data="https://mumba.finance/api/v1/datatable/payments.php" materialSearch responsive/>
                        </div>
                    </Card>
                </Container>
            </section>
        );
    }
}




const mapStateToProps = ({auth}) => ({
    userId: auth.userId
});

const mapDispatchToProps = {
    systemSetPage
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminSettings);
