import moment from 'moment'; // Example for onSort prop
import React from 'react'; // Import React
//import { render } from 'react-dom'; // Import render method
import Datatable from 'react-bs-datatable'; // Import this package
import {Col, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row,} from 'reactstrap';


import {Button} from "../../../components";
import {Formik} from "formik";
import * as Yup from "yup";
import {makeProtectedDataRequest, makeProtectedRequest} from "../api";
import AlertModal from "../../../components/custom/AlertModal/AlertModal";

const userTimeZone = moment.tz.guess(); // Guess the user's timezone

const header = [
    {title: 'No', prop: 'notification_no', sortable: false, filterable: false},
    {title: 'Heading', prop: 'notification_heading', sortable: true, filterable: true},
    // {title: 'Preview Text', prop: 'notification_preview_text', sortable: true, filterable: true},
    // {title: 'Notification', prop: 'notification_text', sortable: true, filterable: true},
    {title: 'Sent To', prop: 'notification_group', sortable: true, filterable: true},
    {title: 'Scheduled', prop: 'notification_scheduled', sortable: true, filterable: true},
    {title: 'Date/Time', prop: 'notification_datetime', sortable: true, filterable: true},
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


const DeleteButton = (row) => (
    <Button className="btn btn-primary btn-sm" onClick={() => alert(`Clicked row with ID: ${row.id}`)}><i
        className="fa fa-trash"></i></Button>
);

class Notifications extends React.Component {

    formikRef = React.createRef(); // Create a ref to access the Formik instance
    formikGroupRef = React.createRef(); // Create a ref to access the Formik instance
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            modalGroup: false,
            notificationImage: "/uploads/no-image.jpg",
            file: null,
            mode: "create",
            notificationGroup: {
                notification_group_name: ""
            },
            notification: {
                notification_heading: "",
                notification_preview_text: "",
                notification_text: "",
                notification_image: "",
                notification_type: "A",
                notification_group: "",
                notification_scheduled: false,
                notification_datetime: '',
                notification_created_at: Date.now(),
                notification_updated_at: Date.now(),
                notification_trash: false
            },
            notificationGroups: [],
            alertTitle: "",
            alertBody: "",
            alertIsOpen: false,
            notifications: [],
        };
        this.toggle = this.toggle.bind(this);
        this.formikRef = React.createRef();
        this.formikGroupRef = React.createRef();
    }

    componentDidMount() {

        this.fetchNotifications();
        this.fetchNotificationGroups();
    }

    fetchNotification = (notification_id) => {
        this.setState({isOpen: true});
        makeProtectedRequest('/fetchNotification', 'POST', {notification_id: notification_id})
            .then((response) => {
                // Handle successful response
                this.setState({isOpen: false});

                if (response.success) {

                    let notification = response.data;
                    this.setState({notificationImage: "/uploads/" + notification.notification_image})
                    this.setState({notification: notification});
                    console.log('notification');
                    console.log(notification);
                    this.toggle();
                    this.setState({mode: 'view'});
                    this.formikRef.current.setValues(notification);
                } else {

                }

            })
            .catch((error) => {
                // Handle error
                console.error(error);
            });
    }
    fetchNotifications = () => {
        try {

            makeProtectedRequest('/fetchAllNotifications', 'GET', {})
                .then((response) => {
                    // Handle successful response


                    if (response.success) {

                        this.setState({notifications: response.data});

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

    deleteNotification = (notification_id) => {
        try {

            makeProtectedRequest('/deleteNotification', 'POST', {notification_id: notification_id})
                .then((response) => {
                    // Handle successful response


                    if (response.success) {

                        this.fetchNotifications();

                    } else {

                    }

                })
                .catch((error) => {
                    // Handle error
                    console.error(error);
                });


        } catch (error) {
            this.setState({message: 'Error deleting notification'});

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

    toggle = () => {
        this.setState({mode: 'create'});
        this.setState({
            notification: {
                notification_heading: "",
                notification_preview_text: "",
                notification_text: "",
                notification_image: "",
                notification_type: "A",
                notification_group: "",
                notification_scheduled: false,
                notification_datetime: '',
                notification_created_at: Date.now(),
                notification_updated_at: Date.now(),
                notification_trash: false
            }
        })
        this.setState({
            modal: !this.state.modal
        });
    }

    validationNotificationSchema = () => {

        return Yup.object().shape({
            notification_heading: Yup.string()
                .min(2, 'Too Short!')
                .required('Notification Heading is Required'),
            notification_text: Yup.string()
                .min(2, 'Too Short!')
                .required('Notification Text is Required'),
        });
    }
    validationNotificationGroupSchema = () => {

        return Yup.object().shape({
            notification_group_name: Yup.string()
                .min(2, 'Too Short!')
                .required('Group Name is Required'),
        });
    }

    toggleGroup = () => {
        this.setState({
            modalGroup: !this.state.modalGroup
        });
    }

    createGroup = (values) => {
        this.setState({isOpen: true});
        makeProtectedRequest('/saveNotificationGroup', 'POST', values)
            .then((response) => {
                // Handle successful response
                this.setState({isOpen: false});
                console.log(response);
                if (response.success) {
                    this.setState({modalGroup: false})
                    this.fetchNotificationGroups();
                } else {

                }
            })
            .catch((error) => {
                // Handle error
                console.error(error);
            });
    }

    handleImageChange = (e) => {
        const file = e.target.files[0];

        this.setState({notificationImage: URL.createObjectURL(file)});
        this.setState({file: file});
    }

    saveNotification = (values) => {

        if (values.notification_group === "") {
            delete values.notification_group;
        }
        if (values.notification_scheduled == false) {
            values.notification_active = true;
        } else {
            values.notification_active = false;
        }

        this.setState({isOpen: true});
        var url = "/saveNotification";
        if (this.state.mode === "update") {
            url = "/updateNotification";
        }
        const formData = new FormData();

        formData.append('data', JSON.stringify(values));

        formData.append('file', this.state.file);


        makeProtectedDataRequest(url, 'POST', formData)
            .then((response) => {
                // Handle successful response
                this.setState({isOpen: false});
                console.log(response);
                if (response.success) {
                    this.setState({modal: false});
                    this.openAlertModal('Notification', 'Notification created successfully!');
                    this.fetchNotifications();
                } else {

                }

            })
            .catch((error) => {
                // Handle error
                console.error(error);
            });
    }

    openAlertModal = (title, body) => {
        this.setState({alertTitle: title});
        this.setState({alertBody: body});
        this.setState({alertIsOpen: true});
    }
    closeAlertModal = () => {
        this.setState({alertIsOpen: false});
        this.setState({alertTitle: ''});
        this.setState({alertBody: ''});
    }

    render() {

        return (
            <div>
                <div className="content">
                    <Row>
                        <Col xs={12} md={12}>

                            <div className="page-title">
                                <div className="float-left">
                                    <h1 className="title">Notifications</h1>
                                </div>

                                <div className="float-right">
                                    <Button className="btn btn-primary btn-sm mt-3" onClick={() => this.toggleGroup()}>Create
                                        Group</Button>
                                </div>
                                <div className="float-right">
                                    <Button className="btn btn-primary btn-sm mt-3" onClick={() => this.toggle()}>Create
                                        Notification</Button>
                                </div>

                            </div>


                            <div className="col-12">
                                <section className="box ">
                                    <header className="panel_header">
                                        <h2 className="title float-left">All Notifications</h2>

                                    </header>
                                    <div className="content-body">
                                        <div className="row">
                                            <div className="col-lg-12 dt-disp">


                                                <Datatable
                                                    tableHeader={header}

                                                    tableBody={this.state.notifications.map((row, index) => ({
                                                        ...row,
                                                        notification_no: (index + 1),
                                                        notification_group: (row.notification_group) ? row.notification_group.notification_group_name : "All",
                                                        notification_scheduled: row.notification_scheduled ? 'Yes' : 'No',
                                                        // notification_datetime: row.notification_datetime ? moment.tz(row.notification_datetime, userTimeZone).format("DD/MM/YYYY h:mm A") : moment.tz(row.notification_created_at, userTimeZone).format("DD/MM/YYYY h:mm A"),
                                                        notification_datetime: moment.tz(row.notification_datetime, userTimeZone).format("DD/MM/YYYY h:mm A"),

                                                        view: <Button
                                                            onClick={() => this.fetchNotification(`${row._id}`)}
                                                            className="btn btn-primary btn-sm"><i
                                                            className="fa fa-eye"></i> </Button>,
                                                        delete: <Button className="btn btn-primary btn-sm"
                                                                        onClick={() => this.deleteNotification(`${row._id}`)}><i
                                                            className="fa fa-trash"></i></Button>
                                                    }))}
                                                    keyName="userTable"
                                                    tableClass="striped table-hover table-responsive"
                                                    rowsPerPage={20}
                                                    rowsPerPageOption={[5, 10, 15, 20]}
                                                    initialSort={{prop: "notification_no", isAscending: true}}
                                                    onSort={onSortFunction}
                                                    labels={customLabels}
                                                />


                                            </div>
                                        </div>


                                    </div>
                                </section>
                            </div>


                        </Col>

                    </Row>
                </div>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Notification</ModalHeader>
                    <ModalBody>
                    <div className="row" style={this.state.mode === 'view' ? { pointerEvents: "none" } : {}}>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <Formik
                                    innerRef={this.formikRef}
                                    enableReinitialize={true}
                                    initialValues={this.state.notification}
                                    validationSchema={this.validationNotificationSchema}
                                    onSubmit={values => {
                                        // same shape as initial values
                                        console.log(values);
                                        this.saveNotification(values);
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
                                                <Label htmlFor="notification_heading">Heading</Label>
                                                <Input type="text" name="notification_heading" id="notification_heading"
                                                       onChange={handleChange}
                                                       value={values.notification_heading}
                                                       invalid={errors.notification_heading && touched.notification_heading}
                                                />
                                                {errors.notification_heading && touched.notification_heading ? (
                                                    <FormFeedback>{errors.notification_heading}</FormFeedback>) : null}
                                            </FormGroup>
                                            {/*<FormGroup>
                                                <Label htmlFor="notification_preview_text">Preview Text</Label>
                                                <Input type="text" name="notification_preview_text"
                                                       id="notification_preview_text"
                                                       onChange={handleChange}
                                                       value={values.notification_preview_text}
                                                       invalid={errors.notification_preview_text && touched.notification_preview_text}
                                                />
                                                {errors.notification_preview_text && touched.notification_preview_text ? (
                                                    <FormFeedback>{errors.notification_preview_text}</FormFeedback>) : null}
                                            </FormGroup>*/}
                                            <FormGroup>
                                                <Label htmlFor="notification_text">Notification Text</Label>
                                                <Input type="textarea" name="notification_text" id="notification_text"
                                                       onChange={handleChange}
                                                       value={values.notification_text}
                                                       invalid={errors.notification_text && touched.notification_text}
                                                />
                                                {errors.notification_text && touched.notification_text ? (
                                                    <FormFeedback>{errors.notification_text}</FormFeedback>) : null}
                                            </FormGroup>

                                            <FormGroup>
                                                <Label htmlFor="notification_type">Notification Type</Label>
                                                <Input type="select" name="notification_type" id="notification_type"
                                                       onChange={handleChange}
                                                       value={values.notification_type}
                                                       placeholder=""
                                                       invalid={errors.notification_type && touched.notification_type}>
                                                        <option value={"A"}>App</option>
                                                        <option value={"S"}>Stock</option>
                                                </Input>
                                                {errors.notification_group && touched.notification_group ? (
                                                    <FormFeedback>{errors.notification_group}</FormFeedback>) : null}
                                            </FormGroup>

                                            <FormGroup>
                                                <Label htmlFor="learn_image">Image</Label>
                                                <div
                                                    className="uprofile-image col-xl-3 col-lg-3 col-md-3 col-sm-4 col-12 mb-2 pl-0">
                                                    <img alt="" src={this.state.notificationImage}
                                                         className="img-fluid"/>
                                                </div>
                                                <Input type="file" name="learn_image" id="learn_image"
                                                       onChange={this.handleImageChange}/>
                                            </FormGroup>

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
                                                {errors.notification_group && touched.notification_group ? (
                                                    <FormFeedback>{errors.notification_group}</FormFeedback>) : null}
                                            </FormGroup>

                                            <FormGroup>
                                                <Label htmlFor="notification_scheduled">Scheduled</Label>
                                                <Input type="select" name="notification_scheduled"
                                                       id="notification_scheduled"
                                                       onChange={handleChange}
                                                       value={values.notification_scheduled}
                                                       placeholder=""
                                                       invalid={errors.notification_scheduled && touched.notification_scheduled}
                                                >
                                                    <option value={true}>Yes</option>
                                                    <option value={false}>No</option>
                                                </Input>
                                                {errors.notification_scheduled && touched.notification_scheduled ? (
                                                    <FormFeedback>{errors.notification_scheduled}</FormFeedback>) : null}
                                            </FormGroup>

                                            {values.notification_scheduled && (
                                                <FormGroup>
                                                    <Label htmlFor="notification_datetime">Scheduled Date/Time</Label>
                                                    <Input type="datetime-local" name="notification_datetime"
                                                           id="notification_datetime"
                                                           onChange={handleChange}
                                                           value={values.notification_datetime}
                                                           placeholder=""
                                                           invalid={errors.notification_datetime && touched.notification_datetime}
                                                    />
                                                    {errors.notification_datetime && touched.notification_datetime ? (
                                                        <FormFeedback>{errors.notification_datetime}</FormFeedback>) : null}
                                                </FormGroup>
                                            )}
                                            {this.state.mode == "create" && (
                                                <Button className="float-right" color="primary"
                                                        onClick={handleSubmit}>Send</Button>
                                            )}
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.modalGroup} toggle={this.toggleGroup} className={this.props.className}>
                    <ModalHeader toggle={this.toggleGroup}>Create Group</ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <Formik
                                    innerRef={this.formikGroupRef}
                                    enableReinitialize={true}
                                    initialValues={this.state.notificationGroup}
                                    validationSchema={this.validationNotificationGroupSchema}
                                    onSubmit={values => {
                                        // same shape as initial values
                                        console.log(values);
                                        this.createGroup(values);
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
                                                <Label htmlFor="notification_group_name">Group Name</Label>
                                                <Input type="text"
                                                       name="notification_group_name"
                                                       id="notification_group_name"
                                                       onChange={handleChange}
                                                       value={values.notification_group_name}
                                                       invalid={errors.notification_group_name && touched.notification_group_name}
                                                />
                                                {errors.notification_group_name && touched.notification_group_name ? (
                                                    <FormFeedback>{errors.notification_group_name}</FormFeedback>) : null}
                                            </FormGroup>
                                            <Button className="float-right" color="primary"
                                                    onClick={handleSubmit}>Create</Button>
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

export default Notifications;
