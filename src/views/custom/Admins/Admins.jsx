import moment from 'moment-timezone'; // Example for onSort prop
import React from 'react'; // Import React
//import { render } from 'react-dom'; // Import render method
import Datatable from 'react-bs-datatable'; // Import this package
import {
    Row, Col, FormGroup, Label, Input, ModalHeader, ModalBody, ModalFooter, Modal,
} from 'reactstrap';


import {Button} from "../../../components";
import {Link} from "react-router-dom";

import StarRatings from "react-star-ratings/build/star-ratings";
import {makeProtectedRequest, makeRequest} from "../api";

const header = [
    {title: 'No', prop: 'admin_no', sortable: false, filterable: false},
    {title: 'Name', prop: 'admin_name', sortable: true, filterable: true},
    {title: 'Role', prop: 'admin_role', sortable: true, filterable: true},
    {title: 'Department', prop: 'admin_department', sortable: true, filterable: true},
    {title: 'Date/Time', prop: 'admin_created_at', sortable: true, filterable: true},
    {title: 'View', prop: 'view', sortable: false, filterable: false},
    {title: 'Delete', prop: 'delete', sortable: false, filterable: false},


];


const onSortFunction = {
    date(columnValue) {
        // Convert the string date format to UTC timestamp
        // So the table could sort it by number instead of by string
        return moment(columnValue, 'Do MMMM YYYY').valueOf();
    },
};

const customLabels = {
    first: '<<',
    last: '>>',
    prev: '<',
    next: '>',
    show: 'Display ',
    entries: ' rows',
    noResults: 'There is no data to be displayed',
};

const ProcessDate = (row) => (


    <span>{moment.tz(row.admin_created_at).format("DD/MM/YYYY h:mm A")}</span>

)
const AdminRole = (row) => (


    <span>{row.admin_role == "S" ? "Super Admin" : "Admin"}</span>

)


class Admins extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            admins: [],
        };

    }

    componentDidMount() {

        this.fetchAdmins();
    }

    openAdmin = (id) => {

        const {history} = this.props;

        history.push('/admin', {admin_id: id});
    }
    deleteAdmin = (id) => {
        try {

            makeProtectedRequest('/deleteAdmin', 'POST', {admin_id: id})
                .then((response) => {
                    // Handle successful response


                    if (response.success) {

                        this.fetchAdmins();

                    } else {

                    }

                })
                .catch((error) => {
                    // Handle error
                    console.error(error);
                });


        } catch (error) {
            this.setState({message: 'Error logging in'});

        }
    }
    fetchAdmins = () => {
        try {

            makeProtectedRequest('/fetchAdmins', 'GET', {})
                .then((response) => {
                    // Handle successful response


                    if (response.success) {

                        this.setState({admins: response.data});

                    } else {

                    }

                })
                .catch((error) => {
                    // Handle error
                    console.error(error);
                });


        } catch (error) {
            this.setState({message: 'Error logging in'});

        }
    }


    render() {

        const {admins} = this.state;


        return (
            <div>
                <div className="content">
                    <Row>
                        <Col xs={12} md={12}>

                            <div className="page-title">
                                <div className="float-left">
                                    <h1 className="title">Admins</h1>
                                </div>

                                <div className="float-right">
                                    <Link className="btn btn-primary btn-sm mt-3" to="/admin">Create Admin</Link>
                                </div>

                            </div>


                            <div className="col-12">
                                <section className="box ">
                                    <header className="panel_header">
                                        <h2 className="title float-left">All Admins</h2>

                                    </header>
                                    <div className="content-body">
                                        <div className="row">
                                            <div className="col-lg-12 dt-disp">


                                                <Datatable
                                                    tableHeader={header}

                                                    tableBody={admins.map((row, index) => ({
                                                        ...row,
                                                        admin_no: (index + 1),
                                                        admin_role: <AdminRole {...row}/>,
                                                        admin_created_at: <ProcessDate {...row}/>,
                                                        view: <Button className="btn btn-primary btn-sm"
                                                                      onClick={() => this.openAdmin(`${row._id}`)}><i
                                                            className="fa fa-eye"></i></Button>,
                                                        delete: <Button className="btn btn-primary btn-sm"
                                                                        onClick={() => this.deleteAdmin(`${row._id}`)}><i
                                                            className="fa fa-trash"></i></Button>
                                                    }))}
                                                    keyName="userTable"
                                                    tableClass="striped table-hover table-responsive"
                                                    rowsPerPage={20}
                                                    rowsPerPageOption={[5, 10, 15, 20]}
                                                    initialSort={{prop: "admin_created_at", isAscending: true}}
                                                    onSort={onSortFunction}
                                                    labels={customLabels}
                                                />

                                                {/*<div className="float-right">
                                                    <Button className="btn btn-primary btn-sm mt-3">Export</Button>
                                                </div>*/}

                                            </div>
                                        </div>


                                    </div>
                                </section>
                            </div>


                        </Col>

                    </Row>
                </div>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Feedback</ModalHeader>
                    <ModalBody>
                        {this.state.msg}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.toggle("")}>Ok</Button>{' '}
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Admins;
