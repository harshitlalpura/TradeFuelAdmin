import React from 'react';
import {
    Button, FormGroup, Label, Input, FormText, FormFeedback,
    InputGroup, InputGroupAddon, InputGroupText, InputGroupButtonDropdown,
    Row, Col, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

import {} from 'components';
import moment from "moment-timezone";
import * as Yup from "yup";
import {makeProtectedDataRequest, makeProtectedRequest} from "../api";
import htmlToDraft from "html-to-draftjs";
import ContentState from "draft-js/lib/ContentState";
import {convertToRaw, EditorState} from "draft-js";
import draftToHtml from "draftjs-to-html";
import formik, {Formik, Field, Form} from 'formik';

class ManageSubscriptionPlan extends React.Component {

    constructor(props) {
        super(props);

        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.toggleSplit = this.toggleSplit.bind(this);
        this.state = {
            dropdownOpen: false,
            splitButtonOpen: false,
            mode: "create",
            plan: {
                plan_name: "",
                plan_discount: "",
                plan_type: "W",
                plan_price: 0,
                plan_features: "",
                plan_created_at: new Date(),
                plan_trash: false
            }
        }
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

    validationSchema = () => {


        return Yup.object().shape({
            plan_name: Yup.string()
                .min(2, 'Too Short!')
                .required('Plan name is Required.'),
            plan_price: Yup.number()
                .min(1, 'Price should be minimum 1.')
                .required('Plan name is Required.'),
        });
    }

    componentDidMount() {

        const {location} = this.props;


        // if (location.state) {
        //     // Accessing the passed value from state

        //     if (location.state.plan_id) {
        //         const plan_id = location.state.plan_id;
        //         console.log('Passed Value:', plan_id);
        //         this.setState({plan_id: plan_id});
        //         this.setState({mode: "update"});

        //         this.fetchPlan(plan_id);
        //     }
        // }
       
        const plan_id =  localStorage.getItem("planId");


        console.log('Passed Value:', plan_id);
        this.setState({plan_id: plan_id});
        this.setState({mode: "update"});

        this.fetchPlan(plan_id);
    }

    fetchPlan = (plan_id) => {
        this.setState({isOpen: true});
        makeProtectedRequest('/fetchPlan', 'POST', {plan_id: plan_id})
            .then((response) => {
                // Handle successful response
                this.setState({isOpen: false});

                if (response.success) {

                    var plan = response.data;


                    this.setState({plan: plan});

                    this.formikRef.current.setValues(plan);
                } else {

                }

            })
            .catch((error) => {
                // Handle error
                console.error(error);
            });
    }
    savePlan = (values) => {

        this.setState({isOpen: true});
        var url = "/savePlan";
        if (this.state.mode === "update") {
            url = "/updatePlan";

        }

        makeProtectedRequest(url, 'POST', values)
            .then((response) => {
                // Handle successful response
                this.setState({isOpen: false});
                console.log(response);
                if (response.success) {

                    this.props.history.push('/plans'); // redirect to home page


                } else {

                }

            })
            .catch((error) => {
                // Handle error
                console.error(error);
            });
    }

    render() {

        const {plan, mode, isOpen} = this.state;


        return (
            <div>
                <div className="content">
                    <Row>
                        <Col xs={12} md={12}>

                            <div className="page-title">
                                <div className="float-left">
                                    <h1 className="title">{mode === "create" ? "Create Subscription Plan" : "Edit Subscription Plan"}</h1>
                                </div>
                            </div>

                            <div className="col-12">
                                <section className="box ">
                                    <header className="panel_header">
                                        <h2 className="title float-left">Plan Information</h2>

                                    </header>
                                    <div className="content-body">
                                        <div className="row">
                                            <div className="col-12 col-sm-12 col-md-10 col-lg-10 col-xl-8">
                                                <Formik
                                                    innerRef={this.formikRef}
                                                    enableReinitialize={true}
                                                    initialValues={plan}
                                                    validationSchema={this.validationSchema}
                                                    onSubmit={values => {
                                                        // same shape as initial values

                                                        console.log(values);

                                                        this.savePlan(values);
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
                                                                <Label htmlFor="plan_name">Name</Label>
                                                                <Input type="text" name="plan_name" id="plan_name"
                                                                       onChange={handleChange}
                                                                       value={values.plan_name}
                                                                       placeholder=""
                                                                       invalid={errors.plan_name && touched.plan_name}
                                                                />
                                                                {errors.plan_name && touched.plan_name ? (
                                                                    <FormFeedback>{errors.plan_name}</FormFeedback>) : null}
                                                            </FormGroup>
                                                            <FormGroup>
                                                                <Label htmlFor="plan_price">Price</Label>
                                                                <Input type="number" name="plan_price" id="plan_price"
                                                                       onChange={handleChange}
                                                                       value={values.plan_price}
                                                                       placeholder=""
                                                                       invalid={errors.plan_price && touched.plan_price}
                                                                />
                                                                {errors.plan_price && touched.plan_price ? (
                                                                    <FormFeedback>{errors.plan_price}</FormFeedback>) : null}
                                                            </FormGroup>
                                                            <FormGroup>
                                                                <Label htmlFor="plan_discount">Discount</Label>
                                                                <Input type="text" name="plan_discount" id="plan_discount"
                                                                       onChange={handleChange}
                                                                       value={values.plan_discount}
                                                                       placeholder=""
                                                                       invalid={errors.plan_discount && touched.plan_discount}
                                                                />
                                                                {errors.plan_discount && touched.plan_discount ? (
                                                                    <FormFeedback>{errors.plan_discount}</FormFeedback>) : null}
                                                            </FormGroup>

                                                            <FormGroup>
                                                                <Label htmlFor="plan_type">Type</Label>
                                                                <Input type="select" name="plan_type"
                                                                       id="plan_type"
                                                                       value={values.plan_type}
                                                                       onChange={handleChange}>
                                                                    <option value="Y">Yearly</option>
                                                                    <option value="M">Montly</option>
                                                                    <option value="W">Weekly</option>

                                                                </Input>
                                                            </FormGroup>
                                                            <FormGroup>
                                                                <Label htmlFor="plan_features">Features</Label>
                                                                <Input type="textarea" name="plan_features" id="plan_features"    onChange={handleChange}
                                                                       value={values.plan_features} />
                                                            </FormGroup>


                                                            <br/>
                                                            <Button className="float-right"
                                                                    type="submit">{mode === "create" ? "Create" : "Update"}</Button>
                                                        </Form>)}
                                                </Formik>


                                            </div>
                                        </div>


                                    </div>
                                </section>
                            </div>


                        </Col>

                    </Row>
                </div>
            </div>
        );
    }

}

export default ManageSubscriptionPlan;
