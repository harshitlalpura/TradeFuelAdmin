import React from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup,
    Row, Col,
} from 'reactstrap';

import {} from 'components';
import {BeatLoader} from "react-spinners";

class Loader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        return (

            <Modal isOpen={this.props.isOpen} className="loader">
                <ModalBody>
                    <BeatLoader color="#36d7b7"/>
                </ModalBody>

            </Modal>
        );
    }
}

export default Loader;
