import React from "react";
import {Container, ListGroup, ListGroupItem} from "reactstrap";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {systemSetPage} from "../../../store/system/actions";
import AdminNav from "../../../components/AdminNav";
import {LEGAL_LINKS, MENU} from "../../../Config";

import PageEdit from '../../../components/Modal/PageEdit';

class Admin extends React.Component {
    state = {
        page: '',
    };
    componentWillMount() {
        this.props.systemSetPage('admin/pages');
    }

    onClose = () => this.setState({page: ''});
    openPage = (event, page) => {
        event.preventDefault();
        this.setState({page});
    };

    render() {
        if (!this.props.userId) {
            return (<Redirect to={"/"} />);
        }
        return (<>
            <section className="section section-lg bg-gradient-secondary">
                <Container>
                    <AdminNav active="/admin/pages" />
                    <PageEdit page={this.state.page} onClose={this.onClose}/>
                    <ListGroup className="mt-4" style={{borderRadius: '0.25rem', border: 0}}>
                        {MENU.map((page, i) => !page.notStatic ? <ListGroupItem key={i} tag="a" href="#" onClick={(e) => this.openPage(e, page.to)}>{page.title}</ListGroupItem>:'')}
                        {LEGAL_LINKS.map((page, i) => !page.notStatic ? <ListGroupItem key={i} tag="a" href="#" onClick={(e) => this.openPage(e, page.to)}>{page.title}</ListGroupItem>:'')}
                    </ListGroup>
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
