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

import {} from 'components';
import moment from "moment-timezone";

import NotificationAlert from 'react-notification-alert';
import {Formik, Field, Form} from 'formik';
import * as Yup from 'yup';
import {makeProtectedDataRequest, makeProtectedRequest, makeRequest} from "../api";
import Loader from "../Loader/Loader";

class StockMarketAPI extends React.Component {
    formikRef = React.createRef();
    constructor(props) {
        super(props);

        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.toggleSplit = this.toggleSplit.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.notify = this.notify.bind(this);
        this.state = {
            dropdownOpen: false, isOpen: false, splitButtonOpen: false, settings_id: "", mode: "create", settings: {
                payment_gateway_account: "",
                payment_gateway_auth_token: "",
                payment_gateway_key: "",
                payment_gateway_mode: "",
                stock_market_key: "",
                stock_market_token: "",
                contact_us_name: "",
                contact_us_address: "",
                contact_us_time: "",
                contact_us_phone: "",
                contact_us_email: "",
                maintainance_admin: "off",
                maintainance_app: "off",
                settings_updated_at: new Date()
            },
        };
    }

    toggleDropDown() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    toggleSplit() {
        this.setState({
            splitButtonOpen: !this.state.splitButtonOpen
        });
    }


    onDismiss() {
    }

    notify(place, msg) {
        var color = Math.floor((Math.random() * 5) + 1);
        var type='primary';

        var options = {};
        options = {
            place: place,
            message: (
                <div className="notification-msg">
                    <div>
                        {msg}
                    </div>
                </div>
            ),
            type: type,
            icon: "",
            autoDismiss: 7
        }
        this.refs.notificationAlert.notificationAlert(options);
    }

    componentDidMount() {


        this.fetchSettings();


    }

    fetchSettings = () => {
        this.setState({isOpen: true});
        makeProtectedRequest('/fetchSettings', 'GET', {})
            .then((response) => {
                // Handle successful response
                this.setState({isOpen: false});


                if (response.success) {


                    var settings = response.data;

                    if (settings._id) {

                        this.setState({settings_id: settings._id});
                        this.setState({settings: settings});
                        this.setState({mode: "update"});

                        this.formikRef.current.setValues(settings);
                    }
                } else {

                }

            })
            .catch((error) => {
                // Handle error
                console.error(error);
            });
    }

    saveSettings = (values) => {

        this.setState({isOpen: true});
        var url = "/saveSettings";
        if (this.state.mode === "update") {
            url = "/updateSettings";

        }
        var data = {data: values};
        makeProtectedRequest(url, 'POST', data)
            .then((response) => {
                // Handle successful response
                this.setState({isOpen: false});
                console.log(response);
                if (response.success) {

                    this.notify("tr", "Settings updated successfully.");
                    //   this.props.history.push('/admins'); // redirect to home page
                    this.fetchSettings();

                } else {

                }

            })
            .catch((error) => {
                // Handle error
                console.error(error);
            });
    }


    validationSchema = () => {

        var mode = this.state.mode;
        var settings_id = this.state.settings_id;
        return Yup.object().shape({
            stock_market_key: Yup.string(),
            stock_market_token: Yup.string()
        });
    }

    render() {

        const {settings, mode, isOpen} = this.state;
        return (<div>
            <Loader isOpen={isOpen}/>
            <div className="content">
                <Row>
                    <Col xs={12} md={12}>

                        <div className="page-title">
                            <div className="float-left">
                                <h1 className="title">Manage Stock Market API</h1>
                            </div>
                        </div>

                        <div className="col-12">
                            <section className="box ">
                                <header className="panel_header">
                                    <h2 className="title float-left">API Settings</h2>

                                </header>
                                <div className="content-body">
                                    <div className="row">
                                        <div className="col-12 col-sm-12 col-md-10 col-lg-10 col-xl-8">

                                            <div className="notification-popup">
                                                <NotificationAlert ref="notificationAlert"/>
                                            </div>
                                            <Formik
                                                innerRef={this.formikRef}
                                                enableReinitialize={true}
                                                initialValues={settings}
                                                validationSchema={this.validationSchema}
                                                onSubmit={values => {
                                                    // same shape as initial values

                                                    console.log(values);

                                                    this.saveSettings(values);
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

                                                        <FormGroup>
                                                            <Label htmlFor="stock_market_key">API Key</Label>
                                                            <Input type="text" name="stock_market_key"
                                                                   id="stock_market_key"
                                                                   onChange={handleChange}
                                                                   value={values.stock_market_key}
                                                                   placeholder=""/>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label htmlFor="stock_market_token">API Token</Label>
                                                            <Input type="text" name="stock_market_token"
                                                                   id="stock_market_token"
                                                                   onChange={handleChange}
                                                                   value={values.stock_market_token}/>
                                                        </FormGroup>


                                                        <br/>
                                                        <Button className="float-left"
                                                                type="submit">Save</Button>
                                                    </Form>
                                                )}
                                            </Formik>


                                        </div>
                                    </div>


                                </div>
                            </section>
                        </div>


                    </Col>

                </Row>
            </div>
        </div>);
    }
}

export default StockMarketAPI;
