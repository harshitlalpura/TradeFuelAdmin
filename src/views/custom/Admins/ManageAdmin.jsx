import React from 'react';
import {
    Button,
    FormGroup,

    Label,
    Input,
    FormText,
    FormFeedback,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupButtonDropdown,
    Row,
    Col,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';

import {Formik, Field, Form} from 'formik';
import * as Yup from 'yup';

import {} from 'components';
import moment from "moment-timezone";
import {makeProtectedDataRequest, makeProtectedRequest, makeRequest} from "../api";
import Loader from "../Loader/Loader";


class ManageAdmin extends React.Component {

    formikRef = React.createRef(); // Create a ref to access the Formik instance

    constructor(props) {
        super(props);

        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.toggleSplit = this.toggleSplit.bind(this);
        this.state = {
            isOpen: false,
            dropdownOpen: false,
            splitButtonOpen: false,
            adminLogo: "/uploads/profile.png",
            file: null,
            admin_id: "",
            mode: "create",
            admin: {
                admin_name: "",
                admin_username: "",
                admin_email: "",
                admin_phone: "",
                admin_password: "",
                admin_address: "",
                admin_department: "",
                admin_profile_image: "profile.png",
                admin_role: "",
                admin_confirm_password: "",
                admin_main: false,
                admin_access: {
                    dashboard: false,
                    subscriptions: false,
                    banners: false,
                    transactions: false,
                    feedbacks: false,
                    notifications: false,
                    admins: false,
                    news: false,
                    settings: false,
                }
            },
        };
    }

    handleImageChange = (e) => {
        const file = e.target.files[0];

        this.setState({adminLogo: URL.createObjectURL(file)});
        this.setState({file: file});
    }


    validationSchema = () => {

            var mode = this.state.mode;
            var admin_id = this.state.admin_id;
            return Yup.object().shape({
                admin_username: Yup.string()
                    .min(2, 'Too Short!')
                    .max(50, 'Too Long!')
                    .required('Username is Required')
                    .test('check-admin_username-exists', 'Username already exists', async function (value) {

                        var data = {admin_username: `${value}`}

                        if (mode === "update") {
                            data.admin_id = admin_id;
                        }

                        var response = await makeProtectedRequest('/verifyAdminUsername', 'POST', data);
                        return !response.data.length > 0;
                    }),
                admin_email: Yup.string()
                    .email('Invalid email.')
                    .required('Email is Required')
                    .test('check-admin_email-exists', 'Email already exists', async function (value) {

                        var data = {admin_email: `${value}`}

                        if (mode === "update") {
                            data.admin_id = admin_id;
                        }
                        var response = await makeProtectedRequest('/verifyAdminEmail', 'POST', data);
                        return !response.data.length > 0;
                    }),
                admin_password: Yup.string().min(8, 'Password should be of minimum 8 characters length').required('Password is required'),

                admin_confirm_password: Yup.string()
                    .oneOf([Yup.ref('admin_password'), null], 'Both Passwords must match')
                    .required('Confirm Password is required'),
                admin_access: Yup.object().test('check-at-least-one-checkbox', 'At least one checkbox must be selected', function (value) {
                    return (
                        value.dashboard ||
                        value.subscriptions ||
                        value.banners ||
                        value.transactions ||
                        value.feedbacks ||
                        value.notifications ||
                        value.admins ||
                        value.settings
                    );
                }),

                admin_name: Yup.string().min(2, 'Name should be of minimum 2 characters length').required('Name is required'),

            });
        }

        componentDidMount()
        {

            const {location} = this.props;


            if (location.state) {
                // Accessing the passed value from state

                if (location.state.admin_id) {
                    const admin_id = location.state.admin_id;

                    // Accessing the passed value from query parameters
                    // const queryParams = new URLSearchParams(location.search);
                    // const passedValue = queryParams.get('passedValue');
                    console.log('Passed Value:', admin_id);
                    this.setState({admin_id: admin_id});
                    this.setState({mode: "update"});

                    this.fetchAdmin(admin_id);
                }
            }
        }

        toggleDropDown()
        {
            this.setState({
                dropdownOpen: !this.state.dropdownOpen
            });
        }

        toggleSplit()
        {
            this.setState({
                splitButtonOpen: !this.state.splitButtonOpen
            });
        }

        fetchAdmin = (admin_id) => {
            this.setState({isOpen: true});
            makeProtectedRequest('/fetchAdmin', 'POST', {admin_id: admin_id})
                .then((response) => {
                    // Handle successful response
                    this.setState({isOpen: false});

                    if (response.success) {

                        var admin = response.data;
                        this.setState({adminLogo:"/uploads/"+admin.admin_profile_image})

                        admin.admin_confirm_password = admin.admin_password;
                        this.setState({admin: admin});

                        this.formikRef.current.setValues(admin);
                    } else {

                    }

                })
                .catch((error) => {
                    // Handle error
                    console.error(error);
                });
        }
        saveAdmin = (values) => {

            this.setState({isOpen: true});
            var url = "/saveAdmin";
            if (this.state.mode === "update") {
                url = "/updateAdmin";

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

                        this.props.history.push('/admins'); // redirect to home page


                    } else {

                    }

                })
                .catch((error) => {
                    // Handle error
                    console.error(error);
                });
        }

        render()
        {

            const {admin, mode, isOpen, adminLogo} = this.state;

            console.log(admin);
            return (<div>
                <Loader isOpen={isOpen}/>
                <div className="content">
                    <Row>
                        <Col xs={12} md={12}>

                            <div className="page-title">
                                <div className="float-left">
                                    <h1 className="title">{mode === "create" ? "Create Admin" : "Edit Admin"}</h1>
                                </div>
                            </div>

                            <Formik
                                innerRef={this.formikRef}
                                enableReinitialize={true}
                                initialValues={admin}
                                validationSchema={this.validationSchema}
                                onSubmit={values => {
                                    // same shape as initial values

                                    console.log(values);

                                    this.saveAdmin(values);
                                }}
                            >
                                {({
                                      errors,
                                      touched,
                                      handleChange,
                                      handleBlur,
                                      values,
                                      setFieldValue,
                                      validateField
                                  }) => (

                                    <Form>
                                        <div className="row">

                                            <div className="col-6">
                                                <section className="box ">
                                                    <header className="panel_header">
                                                        <h2 className="title float-left">Account Information</h2>

                                                    </header>
                                                    <div className="content-body">
                                                        <div className="row">
                                                            <div
                                                                className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">


                                                                <FormGroup>
                                                                    <Label htmlFor="admin_username">Username</Label>
                                                                    <Input type="text" name="admin_username"
                                                                           id="admin_username"
                                                                           onChange={handleChange}
                                                                           onBlur={async e => {
                                                                               handleBlur(e);
                                                                               await validateField('admin_username');
                                                                           }}
                                                                           value={values.admin_username}
                                                                           placeholder=""
                                                                           invalid={errors.admin_username && touched.admin_username}/>


                                                                    {errors.admin_username && touched.admin_username ? (
                                                                        <FormFeedback>{errors.admin_username}</FormFeedback>) : null}
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <Label htmlFor="admin_email">Email</Label>
                                                                    <Input type="email" name="admin_email"
                                                                           id="admin_email"
                                                                           onChange={handleChange}
                                                                           onBlur={async e => {
                                                                               handleBlur(e);
                                                                               await validateField('admin_email');
                                                                           }}
                                                                           value={values.admin_email}
                                                                           placeholder=""
                                                                           invalid={errors.admin_email && touched.admin_email}/>


                                                                    {errors.admin_email && touched.admin_email ? (
                                                                        <FormFeedback>{errors.admin_email}</FormFeedback>) : null}
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <Label htmlFor="admin_password">Password</Label>
                                                                    <Input type="password" name="admin_password"
                                                                           id="admin_password"
                                                                           onChange={handleChange}
                                                                           value={values.admin_password}
                                                                           placeholder=""
                                                                           invalid={errors.admin_password && touched.admin_password}/>


                                                                    {errors.admin_password && touched.admin_password ? (
                                                                        <FormFeedback>{errors.admin_password}</FormFeedback>) : null}
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <Label htmlFor="exampleEmail7">Confirm
                                                                        Password</Label>
                                                                    <Input type="password" name="admin_confirm_password"
                                                                           id="admin_confirm_password"
                                                                           onChange={handleChange}
                                                                           onBlur={handleBlur}
                                                                           value={values.admin_confirm_password}
                                                                           placeholder=""
                                                                           invalid={errors.admin_confirm_password && touched.admin_confirm_password}/>


                                                                    {errors.admin_confirm_password && touched.admin_confirm_password ? (
                                                                        <FormFeedback>{errors.admin_confirm_password}</FormFeedback>) : null}
                                                                </FormGroup>


                                                                <FormGroup>
                                                                    <Label htmlFor="admin_role">Admin Role</Label>
                                                                    <Input type="select" name="admin_role"
                                                                           id="admin_role"
                                                                           value={values.admin_role}
                                                                           onChange={handleChange}>
                                                                        <option value="S">Super Admin</option>
                                                                        <option value="A">Admin</option>

                                                                    </Input>
                                                                </FormGroup>

                                                                <FormGroup>
                                                                    <Label htmlFor="exampleFile1">Admin Access</Label>
                                                                    <FormGroup check>
                                                                        <Label check>
                                                                            <Input type="checkbox"
                                                                                   name="admin_access.dashboard"
                                                                                   checked={values.admin_access.dashboard}
                                                                                   onChange={(e) => {
                                                                                       setFieldValue(`admin_access.dashboard`, e.target.checked);
                                                                                   }}/>{' '}
                                                                            Dashboard
                                                                        </Label>
                                                                    </FormGroup>
                                                                    <FormGroup check>
                                                                        <Label check>
                                                                            <Input type="checkbox"
                                                                                   name="admin_access.subscriptions"
                                                                                   checked={values.admin_access.subscriptions}
                                                                                   onChange={handleChange}/>{' '}
                                                                            Subscriptions
                                                                        </Label>
                                                                    </FormGroup>
                                                                    <FormGroup check>
                                                                        <Label check>
                                                                            <Input type="checkbox"
                                                                                   name="admin_access.banners"
                                                                                   checked={values.admin_access.banners}
                                                                                   onChange={handleChange}/>{' '}
                                                                            Banners
                                                                        </Label>
                                                                    </FormGroup>
                                                                    <FormGroup check>
                                                                        <Label check>
                                                                            <Input type="checkbox"
                                                                                   name="admin_access.transactions"
                                                                                   checked={values.admin_access.transactions}
                                                                                   onChange={handleChange}/>{' '}
                                                                            Transactions
                                                                        </Label>
                                                                    </FormGroup>
                                                                    <FormGroup check>
                                                                        <Label check>
                                                                            <Input type="checkbox"
                                                                                   name="admin_access.feedbacks"
                                                                                   checked={values.admin_access.feedbacks}
                                                                                   onChange={handleChange}/>{' '}
                                                                            Feedbacks
                                                                        </Label>
                                                                    </FormGroup>
                                                                    <FormGroup check>
                                                                        <Label check>
                                                                            <Input type="checkbox"
                                                                                   name="admin_access.notifications"
                                                                                   checked={values.admin_access.notifications}
                                                                                   onChange={handleChange}/>{' '}
                                                                            Notifications
                                                                        </Label>
                                                                    </FormGroup>
                                                                    <FormGroup check>
                                                                        <Label check>
                                                                            <Input type="checkbox"
                                                                                   name="admin_access.admins"
                                                                                   checked={values.admin_access.admins}
                                                                                   onChange={handleChange}/>{' '}
                                                                            Admins
                                                                        </Label>
                                                                    </FormGroup>
                                                                    <FormGroup check>
                                                                        <Label check>
                                                                            <Input type="checkbox"
                                                                                   name="admin_access.settings"
                                                                                   checked={values.admin_access.settings}
                                                                                   onChange={handleChange}/> {' '}
                                                                            Settings
                                                                        </Label>
                                                                    </FormGroup>
                                                                    <FormGroup check>
                                                                        <Label check>
                                                                            <Input type="checkbox"
                                                                                   name="admin_access.news"
                                                                                   checked={values.admin_access.news}
                                                                                   onChange={handleChange}/> {' '}
                                                                            News
                                                                        </Label>
                                                                    </FormGroup>

                                                                    {/* Display checkbox error */}

                                                                    {errors.admin_access && touched.admin_access ? (
                                                                        <div
                                                                            className="invalid-feedback d-block">{errors.admin_access}</div>) : null}

                                                                </FormGroup>


                                                            </div>
                                                        </div>


                                                    </div>
                                                </section>
                                            </div>
                                            <div className="col-6">
                                                <section className="box ">
                                                    <header className="panel_header">
                                                        <h2 className="title float-left">Admin Information</h2>

                                                    </header>
                                                    <div className="content-body">
                                                        <div className="row">
                                                            <div
                                                                className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">


                                                                <FormGroup>
                                                                    <Label htmlFor="admin_name">Name</Label>
                                                                    <Input type="text" name="admin_name" id="admin_name"
                                                                           onChange={handleChange}
                                                                           value={values.admin_name}
                                                                           placeholder=""
                                                                           invalid={errors.admin_name && touched.admin_name}
                                                                    />
                                                                    {errors.admin_name && touched.admin_name ? (
                                                                        <FormFeedback>{errors.admin_name}</FormFeedback>) : null}
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <Label htmlFor="admin_address">Address</Label>
                                                                    <Input type="text" name="admin_address"
                                                                           id="admin_address"
                                                                           value={values.admin_address}
                                                                           onChange={handleChange}
                                                                           placeholder=""/>
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <Label htmlFor="admin_phone">Phone</Label>
                                                                    <Input type="text" name="admin_phone"
                                                                           id="admin_phone"
                                                                           value={values.admin_phone}
                                                                           onChange={handleChange}
                                                                           placeholder=""/>
                                                                </FormGroup>

                                                                <FormGroup>
                                                                    <Label htmlFor="admin_department">Department</Label>
                                                                    <Input type="select" name="admin_department"
                                                                           id="admin_department"
                                                                           value={values.admin_department}
                                                                           onChange={handleChange}>
                                                                        <option value="Management">Management</option>
                                                                        <option value="Support">Support</option>

                                                                    </Input>
                                                                </FormGroup>


                                                                <FormGroup>


                                                                    <Label htmlFor="admin_profile_image">Profile
                                                                        Image</Label>
                                                                    <div
                                                                        className="uprofile-image col-xl-3 col-lg-3 col-md-3 col-sm-4 col-12 mb-2 pl-0">
                                                                        <img alt="" src={ adminLogo}
                                                                             className="img-fluid"/>
                                                                    </div>
                                                                    <Input type="file" name="admin_profile_image"
                                                                           id="admin_profile_image"
                                                                           onChange={this.handleImageChange}/>
                                                                    <FormText color="muted">
                                                                        This is some placeholder block-level help text
                                                                        for
                                                                        the
                                                                        above input.
                                                                        It's a bit lighter and easily wraps to a new
                                                                        line.
                                                                    </FormText>
                                                                </FormGroup>


                                                                <br/>
                                                                <Button className="float-right"
                                                                        type="submit">{mode === "create" ? "Create" : "Update"}</Button>


                                                            </div>
                                                        </div>


                                                    </div>
                                                </section>
                                            </div>


                                        </div>
                                    </Form>)}
                            </Formik>


                        </Col>

                    </Row>
                </div>
            </div>);
        }
    }

    export
    default
    ManageAdmin;
