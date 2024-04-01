import React from "react";
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
} from "reactstrap";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { makeProtectedDataRequest, makeProtectedRequest } from "../api";
import { Editor } from "react-draft-wysiwyg";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import ContentState from "draft-js/lib/ContentState";

const content = {
  entityMap: {},
  blocks: [
    {
      key: "637gr",
      text: "Initialized from content state.",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
};

class Footer extends React.Component {
  formikRef = React.createRef(); // Create a ref to access the Formik instance

  constructor(props) {
    super(props);
    const contentState = convertFromRaw(content);
    this.onContentStateChange = this.onContentStateChange.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);

    this.state = {
      // footerImage: "/uploads/no-image.jpg",
      // file: null,
      editorState: EditorState.createEmpty(),

      footer: {
        footer_description: "",
        mode: "create",
        contentState,

        footer_privcacy: "",
        // footer_sub_title: "",
        // footer_body: "",
        facebook_link: "",
        twitter_link: "",
        instagram_link: "",
        linkedin_link: "",
        google_link:"",
        // footer_created_at: new Date(),
        // footer_updated_at: new Date(),
        // footer_trash: false,
      },
    };
  }

  validationCatSchema = () => {
    return Yup.object().shape({
      footer_cat_name: Yup.string()
        .min(2, "Too Short!")
        .required("Category Name is Required"),
    });
  };

  validationSchema = () => {
    return Yup.object().shape({
      footer_description: Yup.string()
        .min(2, "Too Short!")
        .required("Title is too short."),
      // footer_sub_title: Yup.string()
      //     .min(2, 'Too Short!')
      //     .required('Subtitle is too short.'),
      // footer_category: Yup.string()
      //     .required('Please select category.'),
    });
  };

  componentDidMount() {
    console.log("footer page");
    this.fetchFooter();
  }

  onEditorStateChange(content) {
    this.setState({
      editorState: content,
    });
  }

  onContentStateChange(content) {
    this.setState({
      contentState: content,
    });
  }
  saveFooter = (values) => {
    console.log("value", values);
    this.setState({ isOpen: true });
    var url = "/footerSave";
    if (this.state.mode === "update") {
      url = "/updateFooter";
    }
    values.footer_privcacy = draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );

    var data = { data: values };
    console.log("data", data);
    makeProtectedRequest(url, "POST", data)
      .then((response) => {
        // Handle successful response
        console.log(response);
        if (response.success) {
          this.fetchFooter();
          this.props.history.push("/footer"); // redirect to home page
        } else {
        }
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  };

  fetchFooter = () => {
    try {
      makeProtectedRequest("/fetchFooter", "GET", {})
        .then((response) => {
          // Handle successful response

          if (response.success) {
            console.log(">>", response.data.data);
            this.setState({
              footer_description: response.data.data[0].footer_description,
            });
            this.setState({ mode: "update" });
            this.formikRef.current.setValues(response.data.data[0]);

            const contentBlock = htmlToDraft(response.data.data[0].footer_privcacy);
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(
                contentBlock.contentBlocks
              );
              this.setState({
                editorState: EditorState.createWithContent(contentState),
              });
            }

            this.setState({ footer_privcacy: response.data.data[0] });

            this.formikRef.current.setValues(response.data.data[0]);
          } else {
          }
        })
        .catch((error) => {
          // Handle error
          console.error(error);
        });
    } catch (error) {
      this.setState({ message: "Error logging in" });
    }
  };

  render() {
    const { footer, editorState } = this.state;

    return (
      <div>
        <div className="content">
          <Row>
            <Col xs={12} md={12}>
              <div className="page-title">
                <div className="float-left">
                  <h1 className="title">Footer</h1>
                </div>
              </div>

              <div className="col-12">
                <section className="box ">
                  <header className="panel_header">
                    <h2 className="title float-left">footer Information</h2>
                  </header>
                  <div className="content-body">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-10 col-lg-10 col-xl-8">
                        <Formik
                          innerRef={this.formikRef}
                          enableReinitialize={true}
                          initialValues={footer}
                          validationSchema={this.validationSchema}
                          onSubmit={(values) => {
                            // same shape as initial values

                            console.log(values);

                            this.saveFooter(values);
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
                            <Form>
                              <FormGroup>
                                <Label htmlFor="footer_description">
                                  Description
                                </Label>
                                <Input
                                  type="text"
                                  name="footer_description"
                                  id="footer_description"
                                  style={{ height: "150px" }}
                                  onChange={handleChange}
                                  value={values.footer_description}
                                  placeholder=""
                                  invalid={
                                    errors.footer_description &&
                                    touched.footer_description
                                  }
                                />
                                {errors.footer_description &&
                                touched.footer_description ? (
                                  <FormFeedback>
                                    {errors.footer_description}
                                  </FormFeedback>
                                ) : null}
                              </FormGroup>
                              <div className="form-group">
                                <Label htmlFor="footer_privacy">
                                  Privacy Policy
                                </Label>
                                <div>
                                  <Editor
                                    editorState={editorState}
                                    wrapperClassName="demo-wrapper"
                                    editorClassName="demo-editor"
                                    onEditorStateChange={
                                      this.onEditorStateChange
                                    }
                                  />
                                </div>
                              </div>
                              <FormGroup>
                                <Label>Facebook</Label>
                                <Input
                                  type="text"
                                  name="facebook_link"
                                  id="facebook_link"
                                  onChange={handleChange}
                                  value={values.facebook_link}
                                  placeholder=""
                                />
                              </FormGroup>
                              <FormGroup>
                                <Label>Twitter</Label>
                                <Input
                                  type="text"
                                  name="twitter_link"
                                  id="twitter_link"
                                  onChange={handleChange}
                                  value={values.twitter_link}
                                />
                              </FormGroup>
                              <FormGroup>
                                <Label>Google</Label>
                                <Input
                                  type="text"
                                  name="google_link"
                                  id="google_link"
                                  onChange={handleChange}
                                  value={values.google_link}
                                />
                              </FormGroup>
                              <FormGroup>
                                <Label>Instagram</Label>
                                <Input
                                  type="text"
                                  name="instagram_link"
                                  id="instagram_link"
                                  onChange={handleChange}
                                  value={values.instagram_link}
                                />
                              </FormGroup>
                              <FormGroup>
                                <Label>Linkedin</Label>
                                <Input
                                  type="text"
                                  name="linkedin_link"
                                  id="linkedin_link"
                                  onChange={handleChange}
                                  value={values.linkedin_link}
                                />
                              </FormGroup>

                              <br />

                              <Button className="float-left" type="submit">
                                Save
                              </Button>
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
      </div>
    );
  }
}

export default Footer;
