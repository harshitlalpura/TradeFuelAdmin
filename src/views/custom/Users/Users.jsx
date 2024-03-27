import moment from 'moment-timezone'; // Example for onSort prop
import React from 'react'; // Import React
//import { render } from 'react-dom'; // Import render method
import Datatable from 'react-bs-datatable'; // Import this package
import {Col, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row,} from 'reactstrap';

//import user from "./user";
import {Button, Checkbox} from "../../../components";
import {makeProtectedRequest} from "../api";
import {Formik} from "formik";
import * as Yup from "yup";
import AlertModal from "../../../components/custom/AlertModal/AlertModal";

const userTimeZone = moment.tz.guess(); // Guess the user's timezone

const header = [
    {title: '', prop: 'checkbox', sortable: false, filterable: false},
    {title: 'No', prop: 'user_no', sortable: false, filterable: false},
    {title: 'Name', prop: 'user_name', sortable: true, filterable: true},
    {title: 'Email', prop: 'user_email', sortable: true, filterable: true},
    {title: 'Phone', prop: 'user_phone', sortable: true, filterable: true},
    {title: 'Subscription', prop: 'user_subscription', sortable: true, filterable: true},
    {title: 'Date/Time', prop: 'user_created_at', sortable: false, filterable: true},
    {title: 'Block', prop: 'block', sortable: false, filterable: false},
    {title: 'View', prop: 'view', sortable: false, filterable: false},
    {title: 'Delete', prop: 'delete', sortable: false, filterable: false},


];


const onSortFunction = {
    user_created_at(columnValue) {
        // Convert the string date format to UTC timestamp
        // So the table could sort it by number instead of by string
        return moment(columnValue, 'Do MMMM YYYY').valueOf();
    },
    user_name(columnValue) {
        return columnValue.toLowerCase();
    },
    user_email(columnValue) {
        return columnValue.toLowerCase();
    }
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


class Users extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            users: [],
            selectedUsers: [],
            notificationGroups: [],
            modalGroup: false,
            notificationGroup: {
                notification_group: ""
            },
            alertTitle: "",
            alertBody: "",
            alertIsOpen: false
        };
    }


    componentDidMount() {

        this.fetchUsers();
        this.fetchNotificationGroups();
    }


    openUser = (id) => {

        const {history} = this.props;

        // history.push('/profile', {user_id: id});
        localStorage.setItem('userId', id)
        history.push('/profile')
    }
    deleteUser = (id) => {
        try {

            makeProtectedRequest('/deleteUser', 'POST', {user_id: id})
                .then((response) => {
                    // Handle successful response


                    //   if (response.success) {

                    this.fetchUsers();

                    //   } else {

                    //   }

                })
                .catch((error) => {
                    // Handle error
                    console.error(error);
                });


        } catch (error) {
            this.setState({message: 'Error logging in'});

        }
    }

    toggleUserSelection = (userId) => {
        this.setState((prevState) => {
            const selectedUsers = [...prevState.selectedUsers];
            const index = selectedUsers.indexOf(userId);
            if (index === -1) {
                selectedUsers.push(userId);
            } else {
                selectedUsers.splice(index, 1);
            }
            return {selectedUsers};
        });
    };

    fetchUsers = () => {
        try {

            makeProtectedRequest('/fetchUsers', 'GET', {})
                .then((response) => {
                    // Handle successful response
                    

                    if (response.success) {

                        this.setState({users: response.data});

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

    changeStatus = (user) => {
        try {

            makeProtectedRequest('/changeUserStatus', 'POST', user)
                .then((response) => {
                    // Handle successful response


                    if (response.success) {

                        this.fetchUsers();

                    } else {

                    }

                })
                .catch((error) => {
                    // Handle error
                    console.log(error);
                });


        } catch (error) {
            this.setState({message: 'Error logging in'});

        }
    }

    fetchNotificationGroups = () => {
        try {

            makeProtectedRequest('/fetchAllNotificationGroups', 'GET', {})
                .then((response) => {
                    // Handle successful response


                    if (response.success) {

                        this.setState({notificationGroups: response.data});

                    } else {

                    }

                })
                .catch((error) => {
                    // Handle error
                    console.error(error);
                });


        } catch (error) {
            this.setState({message: 'Error fetching NotificationGroups'});

        }
    }

    toggleGroup=()=> {
        this.setState({
            modalGroup: !this.state.modalGroup
        });
    }

    validationNotificationGroupSchema = () => {

        return Yup.object().shape({
            notification_group: Yup.string()
                .min(2, 'Too Short!')
                .required('Group Name is Required'),
        });
    }

    addToGroup = (values) => {
        const {selectedUsers} = this.state;
        const {notification_group} = values;

        try {
            makeProtectedRequest('/updateNotificationGroup', 'POST', {
                notification_group_id: notification_group,
                notification_group_users: selectedUsers,
            })
                .then((response) => {
                    // Handle successful response

                    if (response.success) {
                        this.setState({alertTitle: "Notification Group"});
                        this.setState({alertBody: "Notification Group Inserted Successfully!"});
                        this.setState({alertIsOpen: true});
                    } else {
                        // Error message or handling failed response
                    }

                    this.toggleGroup();
                })
                .catch((error) => {
                    // Handle error
                    console.error(error);
                    // Optional: Show error message to the user
                });
        } catch (error) {
            // Handle error
            console.error(error);
            // Optional: Show error message to the user
        }
    };

    closeAlertModal = () => {
        this.setState({alertIsOpen: false});
    }

    render() {

        const {users} = this.state;
        users.sort((a, b) => {
            // Convert 'user_created_at' strings to Date objects
            const dateA = new Date(a.user_created_at);
            const dateB = new Date(b.user_created_at);
            
            // Compare the dates
            return dateB - dateA; // For descending order, use dateB - dateA
        });

        return (
            <div>
                <div className="content">
                    <Row>
                        <Col xs={12} md={12}>

                            <div className="page-title">
                                <div className="float-left">
                                    <h1 className="title">Users</h1>
                                </div>

                                {this.state.selectedUsers.length > 0 && (
                                    <div className="float-right">
                                        <Button className="btn btn-primary btn-sm mt-3"
                                                onClick={() => this.toggleGroup()}>Add to Notification Group</Button>
                                    </div>
                                )}
                            </div>


                            <div className="col-12">
                                <section className="box ">
                                    <header className="panel_header">
                                        <h2 className="title float-left">All Users</h2>

                                    </header>
                                    <div className="content-body">
                                        <div className="row">
                                            <div className="col-lg-12 dt-disp">


                                                <Datatable
                                                    tableHeader={header}

                                                    tableBody={users.map((row, index) => ({
                                                        ...row,
                                                        // checkbox: (
                                                        //     <Checkbox
                                                        //         inputProps={{
                                                        //             checked: this.state.selectedUsers.includes(row._id),
                                                        //             onChange: () => this.toggleUserSelection(row._id),
                                                        //         }}
                                                        //     />
                                                        // ),
                                                        user_no: (index + 1),
                                                        // user_created_at: moment.tz(row.user_created_at, userTimeZone).format("DD/MM/YYYY h:mm A"),
                                                        user_created_at: (
                                                            <div>
                                                                <div>{moment.tz(row.user_created_at, userTimeZone).format("DD/MM/YYYY")}</div>
                                                                <div>{moment.tz(row.user_created_at, userTimeZone).format("h:mm A")}</div>
                                                            </div>
                                                        ),
                                                        block: row.user_block ?
                                                            <Button className="btn btn-primary btn-sm"
                                                                    onClick={() => this.changeStatus(row)}><i
                                                                className="fa fa-unlock"></i></Button> :
                                                            <Button className="btn btn-primary btn-sm"
                                                                    onClick={() => this.changeStatus(row)}><i
                                                                className="fa fa-lock"></i></Button>,
                                                        view: <Button className="btn btn-primary btn-sm"
                                                                      onClick={() => this.openUser(`${row._id}`)}><i
                                                            className="fa fa-eye"></i></Button>,
                                                        delete: <Button className="btn btn-primary btn-sm"
                                                                        onClick={() => this.deleteUser(`${row._id}`)}><i
                                                            className="fa fa-trash"></i></Button>
                                                    }))}
                                                    keyName="userTable"
                                                    tableClass="user-table striped table-hover table-responsive"
                                                    rowsPerPage={20}
                                                    rowsPerPageOption={[5, 10, 15, 20]}
                                                    initialSort={{prop: "user_no", isAscending: true}}
                                                    onSort={onSortFunction}
                                                    labels={customLabels}
                                                />

                                                {/*{this.state.selectedUsers.length > 0 && (*/}
                                                {/*    <div className="float-right">*/}
                                                {/*        <Button className="btn btn-primary btn-sm mt-3">Export</Button>*/}
                                                {/*    </div>*/}
                                                {/*)}*/}

                                            </div>
                                        </div>


                                    </div>
                                </section>
                            </div>


                        </Col>

                    </Row>
                </div>
                <Modal isOpen={this.state.modalGroup} toggle={this.toggleGroup} className={this.props.className}>
                    <ModalHeader toggle={this.toggleGroup}>Add to Notification Group</ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <Formik
                                    innerRef={this.formikRef}
                                    enableReinitialize={true}
                                    initialValues={this.state.notificationGroup}
                                    validationSchema={this.validationNotificationGroupSchema}
                                    onSubmit={values => {
                                        // same shape as initial values
                                        console.log(values);
                                        this.addToGroup(values);
                                    }}
                                >
                                    {({
                                          errors,
                                          touched,
                                          handleChange,
                                          handleBlur,
                                          values,
                                          setFieldValue,
                                          validateField,
                                          handleSubmit
                                      }) => (
                                        <Form>
                                            <FormGroup>
                                                <Label htmlFor="notification_group">Notification Group</Label>
                                                <Input type="select" name="notification_group" id="notification_group"
                                                       onChange={handleChange}
                                                       value={values.notification_group}
                                                       placeholder=""
                                                       invalid={errors.notification_group && touched.notification_group}>
                                                    <option value="">Select a notification group</option>
                                                    {this.state.notificationGroups.map((notificationGroup, index) => (
                                                        <option key={index} value={notificationGroup._id}>
                                                            {notificationGroup.notification_group_name}
                                                        </option>
                                                    ))}
                                                </Input>
                                                {errors.learn_category && touched.learn_category ? (
                                                    <FormFeedback>{errors.learn_category}</FormFeedback>) : null}
                                            </FormGroup>
                                            <Button className="float-right" color="primary"
                                                    onClick={handleSubmit}>Add</Button>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                {this.state.alertIsOpen && (
                    <AlertModal
                        title={this.state.alertTitle}
                        body={this.state.alertBody}
                        closeAlertModal={this.closeAlertModal}
                    />
                )}
            </div>
        );
    }
}

export default Users;
