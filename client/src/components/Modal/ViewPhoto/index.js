import React from 'react';
import {Modal, Row, Col} from 'reactstrap';

export default class extends React.Component {
    render() {
        return (
            <Modal isOpen={this.props.photo !== ''} toggle={this.props.onClose} size="lg">
                <Row className="justify-content-center text-center">
                    <Col sm={12}>
                        <img
                            src={this.props.photo}
                            className="img-fluid img"
                            alt="..."
                        />
                    </Col>
                </Row>
            </Modal>
        );
    }
}
