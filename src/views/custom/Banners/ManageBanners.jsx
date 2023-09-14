import React from 'react';
import {
    Button, FormGroup, Label, Input, FormText, FormFeedback,
    InputGroup, InputGroupAddon, InputGroupText, InputGroupButtonDropdown,
    Row, Col, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';
import formik, {Formik, Field, Form} from 'formik';
import * as Yup from 'yup';
import {} from 'components';
import moment from "moment-timezone";
import {makeProtectedDataRequest, makeProtectedRequest, makeRequest} from "../api";
import Loader from "../Loader/Loader";
import DatePicker from "react-datepicker";

class ManageBanners extends React.Component {

    formikRef = React.createRef(); // Create a ref to access the Formik instance


    constructor(props) {


        super(props);


        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.toggleSplit = this.toggleSplit.bind(this);
        this.state = {
            isOpen: false,
            dropdownOpen: false,
            splitButtonOpen: false,
            banner_id: "",
            bannerImage: "/uploads/profile.png",
            file: null,
            mode: "create",
            banner: {

                banner_name: "",
                banner_type: "",
                banner_text: "",
                banner_image: "",
                banner_position: "",
                banner_date: "",
                banner_expires_at: moment(),
                banner_created_at: new Date(),
                banner_modified_at: new Date(),
                banner_trash: false,

            }
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

    handleImageChange = (e) => {
        const file = e.target.files[0];

        this.setState({bannerImage: URL.createObjectURL(file)});
        this.setState({file: file});
    }


    validationSchema = () => {

        var mode = this.state.mode;
        var banner_id = this.state.banner_id;
        return Yup.object().shape({
            banner_name: Yup.string()
                .min(2, 'Too Short!')
                .max(50, 'Too Long!')
                .required('Banner Name is Required'),

            banner_expires_at: Yup.string().required('Banner Expiry is Required')
        });
    }

    componentDidMount() {

        const {location} = this.props;


        if (location.state) {
            // Accessing the passed value from state

            if (location.state.banner_id) {
                const banner_id = location.state.banner_id;

                // Accessing the passed value from query parameters
                // const queryParams = new URLSearchParams(location.search);
                // const passedValue = queryParams.get('passedValue');
                console.log('Passed Value:', banner_id);
                this.setState({banner_id: banner_id});
                this.setState({mode: "update"});

                this.fetchBanner(banner_id);
            }
        }
    }

    fetchBanner = (banner_id) => {
        this.setState({isOpen: true});
        makeProtectedRequest('/fetchBanner', 'POST', {banner_id: banner_id})
            .then((response) => {
                // Handle successful response
                this.setState({isOpen: false});

                if (response.success) {

                    var banner = response.data;
                    this.setState({bannerImage: "/uploads/" + banner.banner_image})


                    this.setState({banner: banner});

                    this.formikRef.current.setValues(banner);
                } else {

                }

            })
            .catch((error) => {
                // Handle error
                console.error(error);
            });
    }
    saveBanner = (values) => {

        this.setState({isOpen: true});
        var url = "/saveBanner";
        if (this.state.mode === "update") {
            url = "/updateBanner";

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

                    this.props.history.push('/banners'); // redirect to home page


                } else {

                }

            })
            .catch((error) => {
                // Handle error
                console.error(error);
            });
    }


    render() {

        const {banner, mode, isOpen, bannerImage} = this.state;


        return (
            <div>
                <div className="content">
                    <Row>
                        <Col xs={12} md={12}>

                            <div className="page-title">
                                <div className="float-left">
                                    <h1 className="title">{mode === "create" ? "Create Banner" : "Edit Banner"}</h1>
                                </div>
                            </div>

                            <div className="col-12">
                                <section className="box ">
                                    <header className="panel_header">
                                        <h2 className="title float-left">Banner Information</h2>

                                    </header>
                                    <div className="content-body">
                                        <div className="row">
                                            <div className="col-12 col-sm-12 col-md-10 col-lg-10 col-xl-8">


                                                <Formik
                                                    innerRef={this.formikRef}
                                                    enableReinitialize={true}
                                                    initialValues={banner}
                                                    validationSchema={this.validationSchema}
                                                    onSubmit={values => {
                                                        // same shape as initial values

                                                        console.log(values);

                                                        this.saveBanner(values);
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
                                                                <Label htmlFor="banner_name">Name</Label>
                                                                <Input type="text" name="banner_name" id="banner_name"
                                                                       onChange={handleChange}
                                                                       value={values.banner_name}
                                                                       placeholder=""
                                                                       invalid={errors.banner_name && touched.banner_name}
                                                                />
                                                                {errors.banner_name && touched.banner_name ? (
                                                                    <FormFeedback>{errors.banner_name}</FormFeedback>) : null}
                                                            </FormGroup>
                                                            <FormGroup>
                                                                <Label htmlFor="banner_type">Type</Label>
                                                                <Input type="select" name="banner_type"
                                                                       id="banner_type"
                                                                       value={values.banner_type}
                                                                       onChange={handleChange}>
                                                                    <option value="Text">Text</option>
                                                                    <option value="Image">Image</option>

                                                                </Input>
                                                            </FormGroup>

                                                            <FormGroup>
                                                                <Label htmlFor="banner_text">Textual Information</Label>
                                                                <Input type="textarea" name="banner_text"
                                                                       id="banner_text"
                                                                       onChange={handleChange}
                                                                       value={values.banner_text}
                                                                       placeholder=""
                                                                       invalid={errors.banner_text && touched.banner_text}/>
                                                                {errors.banner_text && touched.banner_text ? (
                                                                    <FormFeedback>{errors.banner_text}</FormFeedback>) : null}
                                                            </FormGroup>

                                                            <FormGroup>
                                                                <Label htmlFor="banner_image">Images</Label>
                                                                <div
                                                                    className="uprofile-image col-xl-3 col-lg-3 col-md-3 col-sm-4 col-12 mb-2 pl-0">
                                                                    <img alt="" src={ bannerImage}
                                                                         className="img-fluid"/>
                                                                </div>
                                                                <Input type="file" name="banner_image" id="banner_image"
                                                                       onChange={this.handleImageChange}/>
                                                                <FormText color="muted">
                                                                    This is some placeholder block-level help text for
                                                                    the above
                                                                    input.
                                                                    It's a bit lighter and easily wraps to a new line.
                                                                </FormText>
                                                            </FormGroup>

                                                            <FormGroup>
                                                                <Label htmlFor="exampleSelect3">Position</Label>
                                                                <Input type="select" name="banner_position"
                                                                       id="banner_position"
                                                                       value={values.banner_position}
                                                                       onChange={handleChange}>
                                                                    <option value="Top">Top</option>
                                                                    <option value="Bottom">Bottom</option>
                                                                </Input>
                                                            </FormGroup>

                                                            <FormGroup>
                                                                <Label htmlFor="exampleDate">Expires</Label>

                                                                <DatePicker name="banner_expires_at"
                                                                            dateFormat="DD/MM/YYYY"
                                                                            id="banner_expires_at"
                                                                            invalid={errors.banner_expires_at && touched.banner_expires_at}
                                                                            selected={moment(values.banner_expires_at)}
                                                                            onChange={(date) => {
                                                                                setFieldValue('banner_expires_at', date);

                                                                            }} />

                                                                {errors.banner_expires_at && touched.banner_expires_at ? (
                                                                    <FormFeedback>{errors.banner_expires_at}</FormFeedback>) : null}
                                                            </FormGroup>


                                                            <br/>

                                                            <Button className="float-left"
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

export default ManageBanners;
