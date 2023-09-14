import React from "react";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Button} from "../../index";

class AlertModal extends React.Component {
    constructor(props) {
        super(props);
    }

    toggleModal = () => {
      //  this.setState((prevState) => ({isOpen: !prevState.isOpen}));
        this.props.closeAlertModal();
    };

    render() {
        const {title, body} = this.props;

        return (
            <Modal isOpen={true} className={this.props.className}>
                <ModalHeader toggle={this.toggleModal}>{title}</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            {body}
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.props.closeAlertModal()}>Close</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default AlertModal;
