import React from 'react';
import {
    Button,
    Col,
    FormFeedback,
    FormGroup,
    FormText,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
} from 'reactstrap';
import {Form, Formik} from 'formik';
import * as Yup from 'yup';
import {makeProtectedDataRequest, makeProtectedRequest} from "../api";
import {Editor} from "react-draft-wysiwyg";
import {convertFromRaw, convertToRaw, EditorState} from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from 'html-to-draftjs';
import ContentState from "draft-js/lib/ContentState";


const content = {
    "entityMap": {},
    "blocks": [{
        "key": "637gr",
        "text": "Initialized from content state.",
        "type": "unstyled",
        "depth": 0,
        "inlineStyleRanges": [],
        "entityRanges": [],
        "data": {}
    }]
};

class ManageLearn extends React.Component {

    formikRef = React.createRef(); // Create a ref to access the Formik instance


    constructor(props) {


        super(props);

        const contentState = convertFromRaw(content);

        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.toggleSplit = this.toggleSplit.bind(this);
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
        this.onContentStateChange = this.onContentStateChange.bind(this);
        this.toggle = this.toggle.bind(this);
        this.state = {
            editorState: EditorState.createEmpty(),
            contentState,
            isOpen: false,
            modal: false,
            dropdownOpen: false,
            splitButtonOpen: false,
            learn_id: "",
            learnCategories: [],
            learnImage: "/uploads/no-image.jpg",
            file: null,
            mode: "create",
            learn: {
                learn_title: "",
                learn_sub_title: "",
                learn_body: "",
                learn_image: "",
                learn_category: "",
                learn_video: "",
                learn_link:"",
                learn_created_at: new Date(),
                learn_updated_at: new Date(),
                learn_trash: false,
            },
            learnCategory: {
                learn_cat_name: ""
            }
        };
    }

    toggle() {
        this.setState({modal: !this.state.modal});
    }

    onEditorStateChange(content) {
        this.setState({
            editorState: content
        });
    }

    onContentStateChange(content) {
        this.setState({
            contentState: content
        });
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

        this.setState({learnImage: URL.createObjectURL(file)});
        this.setState({file: file});
    }


    validationCatSchema = () => {

        return Yup.object().shape({
            learn_cat_name: Yup.string()
                .min(2, 'Too Short!')
                .required('Category Name is Required'),
        });
    }

    validationSchema = () => {

        return Yup.object().shape({
            learn_title: Yup.string()
                .min(2, 'Too Short!')
                .required('Title is too short.'),
            learn_sub_title: Yup.string()
                .min(2, 'Too Short!')
                .required('Subtitle is too short.'),
            learn_category: Yup.string()
                .required('Please select category.'),
        });
    }

    componentDidMount() {

        this.fetchCategories();

        const {location} = this.props;


        if (location.state) {
            // Accessing the passed value from state

            if (location.state.learn_id) {
                const learn_id = location.state.learn_id;

                // Accessing the passed value from query parameters
                // const queryParams = new URLSearchParams(location.search);
                // const passedValue = queryParams.get('passedValue');
                console.log('Passed Value:', learn_id);
                this.setState({learn_id: learn_id});
                this.setState({mode: "update"});

                this.fetchLearn(learn_id);
            }
        }
    }

    fetchCategories = () => {
        try {

            makeProtectedRequest('/fetchAllLearnCategories', 'GET', {})
                .then((response) => {
                    // Handle successful response


                    if (response.success) {

                        this.setState({learnCategories: response.data});

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
    fetchLearn = (learn_id) => {
        this.setState({isOpen: true});
        makeProtectedRequest('/fetchLearn', 'POST', {learn_id: learn_id})
            .then((response) => {
                // Handle successful response
                this.setState({isOpen: false});

                if (response.success) {
                    console.log("resp>>>>>", response.data)
                    var learn = response.data;
                    this.setState({learnImage: "/uploads/" + learn.learn_image})

                    /* this.setState({
                         editorState: learn.learn_body
                     });
                     */

                    const contentBlock = htmlToDraft(learn.learn_body);
                    if (contentBlock) {
                        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
                        this.setState({editorState: EditorState.createWithContent(contentState)});
                    }


                    this.setState({learn: learn});

                    this.formikRef.current.setValues(learn);
                } else {

                }

            })
            .catch((error) => {
                // Handle error
                console.error(error);
            });
    }
    saveLearn = (values) => {

        this.setState({isOpen: true});
        var url = "/saveLearn";
        if (this.state.mode === "update") {
            url = "/updateLearn";

        }


        values.learn_body = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));

        const formData = new FormData();
        formData.append('data', JSON.stringify(values));

        formData.append('file', this.state.file);


        makeProtectedDataRequest(url, 'POST', formData)
            .then((response) => {
                // Handle successful response
                this.setState({isOpen: false});
                console.log(response);
                if (response.success) {

                    this.props.history.push('/learn'); // redirect to home page


                } else {

                }

            })
            .catch((error) => {
                // Handle error
                console.error(error);
            });
    }

    saveCategory = (values) => {
        this.setState({isOpen: true});
        makeProtectedRequest('/saveLearnCategory', 'POST', values)
            .then((response) => {
                // Handle successful response
                this.setState({isOpen: false});
                console.log(response);
                if (response.success) {
                    this.fetchCategories();
                    this.setState({modal: false});
                    this.setState({learn: {
                        ...this.state.learn,
                            learn_category: response.data._id
                        }});
                } else {

                }
            })
            .catch((error) => {
                // Handle error
                console.error(error);
            });
    }

    render() {

        const {learn, mode, isOpen, learnImage, editorState, contentState} = this.state;


        return (
            <div>
                <div className="content">
                    <Row>
                        <Col xs={12} md={12}>

                            <div className="page-title">
                                <div className="float-left">
                                    <h1 className="title">{mode === "create" ? "Create Learn" : "Edit Learn"}</h1>
                                </div>
                            </div>

                            <div className="col-12">
                                <section className="box ">
                                    <header className="panel_header">
                                        <h2 className="title float-left">Learn Information</h2>

                                    </header>
                                    <div className="content-body">
                                        <div className="row">
                                            <div className="col-12 col-sm-12 col-md-10 col-lg-10 col-xl-8">


                                                <Formik
                                                    innerRef={this.formikRef}
                                                    enableReinitialize={true}
                                                    initialValues={learn}
                                                    validationSchema={this.validationSchema}
                                                    onSubmit={values => {
                                                        // same shape as initial values

                                                        console.log(values);

                                                        this.saveLearn(values);
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
                                                                <Label htmlFor="learn_title">Title*</Label>
                                                                <Input type="text" name="learn_title" id="learn_title"
                                                                       onChange={handleChange}
                                                                       value={values.learn_title}
                                                                       placeholder=""
                                                                       invalid={errors.learn_title && touched.learn_title}
                                                                />
                                                                {errors.learn_title && touched.learn_title ? (
                                                                    <FormFeedback>{errors.learn_title}</FormFeedback>) : null}
                                                            </FormGroup>

                                                            <FormGroup>
                                                                <Label htmlFor="learn_sub_title">Sub-Title*</Label>
                                                                <Input type="text" name="learn_sub_title" id="learn_sub_title"
                                                                       onChange={handleChange}
                                                                       value={values.learn_sub_title}
                                                                       placeholder=""
                                                                       invalid={errors.learn_sub_title && touched.learn_sub_title}
                                                                />
                                                                {errors.learn_sub_title && touched.learn_sub_title ? (
                                                                    <FormFeedback>{errors.learn_sub_title}</FormFeedback>) : null}
                                                            </FormGroup>

                                                            <FormGroup>
                                                                <Label htmlFor="learn_category">Category*
                                                                    <Button className="btn btn-primary btn-sm ml-2"
                                                                            onClick={() => this.toggle()}>
                                                                        <i className="fa fa-plus"></i>
                                                                    </Button>
                                                                </Label>
                                                                <Input type="select" name="learn_category" id="learn_category"
                                                                       onChange={handleChange}
                                                                       value={values.learn_category}
                                                                       placeholder=""
                                                                       invalid={errors.learn_category && touched.learn_category}>
                                                                    <option value="">Select a category</option>
                                                                    {this.state.learnCategories.map((category, index) => (
                                                                        <option key={index} value={category._id}>
                                                                            {category.learn_cat_name}
                                                                        </option>
                                                                    ))}
                                                                </Input>
                                                                {errors.learn_category && touched.learn_category ? (
                                                                    <FormFeedback>{errors.learn_category}</FormFeedback>) : null}
                                                            </FormGroup>


                                                            <FormGroup>
                                                                <Label htmlFor="learn_video">Youtube Video URL</Label>
                                                                <Input type="text" name="learn_video"
                                                                       id="learn_video"

                                                                       onChange={handleChange}
                                                                       value={values.learn_video}
                                                                       placeholder=""
                                                                       invalid={errors.learn_video && touched.learn_video}/>
                                                                {errors.learn_video && touched.learn_video ? (
                                                                    <FormFeedback>{errors.learn_video}</FormFeedback>) : null}

                                                                <FormText>Embed link for Youtube/Vimeo Video i.e. https://www.youtube.com/embed/t-rURJUMNKk</FormText>
                                                            </FormGroup>
                                                            <FormGroup>
                                                                <Label htmlFor="learn_link">Link</Label>
                                                                <Input type="text" name="learn_link"
                                                                        id="learn_link"
                                                                        onChange={handleChange} 
                                                                        value={values.learn_link}
                                                                        invalid={errors.learn_link && touched.learn_link}
                                                                        />
                                                            </FormGroup>            
                                                            <FormGroup>
                                                                <Label htmlFor="learn_image">Image</Label>
                                                                <div
                                                                    className="uprofile-image col-xl-3 col-lg-3 col-md-3 col-sm-4 col-12 mb-2 pl-0">
                                                                    <img alt="" src={learnImage}
                                                                         className="img-fluid"/>
                                                                </div>
                                                                <Input type="file" name="learn_image" id="learn_image"
                                                                       onChange={this.handleImageChange}/>

                                                            </FormGroup>


                                                            <div className="form-group">

                                                                <div>
                                                                    <Editor
                                                                        editorState={editorState}
                                                                        wrapperClassName="demo-wrapper"
                                                                        editorClassName="demo-editor"
                                                                        onEditorStateChange={this.onEditorStateChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                            {/* <FormGroup>
                                                                <Label htmlFor="exampleText">HTML Format</Label>
                                                                <textarea className="form-control"
                                                                          disabled
                                                                          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                                                                />
                                                            </FormGroup>*/}


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
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Add New Category</ModalHeader>
                    <ModalBody>
                        <Formik
                            innerRef={this.formikRef}
                            enableReinitialize={true}
                            initialValues={this.state.learnCategory}
                            validationSchema={this.validationCatSchema}
                            onSubmit={values => {
                                // same shape as initial values
                                console.log(values);
                                this.saveCategory(values);
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
                              }) => (
                                <Form> {/* Add onSubmit to the form element */}
                                    <FormGroup>
                                        <Label htmlFor="learn_cat_name">Category Name</Label>
                                        <Input
                                            type="text"
                                            name="learn_cat_name"
                                            id="learn_cat_name"
                                            onChange={handleChange}
                                            value={values.learn_cat_name}
                                            placeholder=""
                                            invalid={errors.learn_cat_name && touched.learn_cat_name}
                                        />
                                        {errors.learn_cat_name && touched.learn_cat_name ? (
                                            <FormFeedback>{errors.learn_cat_name}</FormFeedback>
                                        ) : null}
                                    </FormGroup>

                                    {/* Move the submit button inside the form */}
                                    <Button className="float-left" type="submit">
                                        Add
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </ModalBody>
                    {/*<ModalFooter>
                         Remove the button outside of Formik
                    </ModalFooter>*/}
                </Modal>

            </div>
        );
    }
}

export default ManageLearn;
