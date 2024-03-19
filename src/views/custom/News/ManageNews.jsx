import React from "react";
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
  textarea,
} from "reactstrap";
import formik, { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import {} from "components";
import moment from "moment-timezone";
import {
  makeProtectedDataRequest,
  makeProtectedRequest,
  makeRequest,
} from "../api";
import Loader from "../Loader/Loader";
import DatePicker from "react-datepicker";
import { Editor } from "react-draft-wysiwyg";
import {
  convertFromRaw,
  convertToRaw,
  EditorState,
  convertFromHTML,
} from "draft-js";
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

class ManageNews extends React.Component {
  formikRef = React.createRef(); // Create a ref to access the Formik instance

  constructor(props) {
    super(props);

    const contentState = convertFromRaw(content);

    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.toggleSplit = this.toggleSplit.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.onContentStateChange = this.onContentStateChange.bind(this);
    this.state = {
      editorState: EditorState.createEmpty(),
      contentState,
      isOpen: false,
      dropdownOpen: false,
      splitButtonOpen: false,
      news_id: "",
      newsImage: "/uploads/no-image.jpg",
      file: null,
      mode: "create",
      news: {
        news_title: "",
        news_body: "",
        news_image: "",
        news_author: "",
        news_video: "",
        news_created_at: new Date(),
        news_updated_at: new Date(),
        news_trash: false,
      },
    };
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

  toggleDropDown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  toggleSplit() {
    this.setState({
      splitButtonOpen: !this.state.splitButtonOpen,
    });
  }

  handleImageChange = (e) => {
    const file = e.target.files[0];

    this.setState({ newsImage: URL.createObjectURL(file) });
    this.setState({ file: file });
  };

  validationSchema = () => {
    var mode = this.state.mode;
    var news_id = this.state.news_id;
    return Yup.object().shape({
      news_title: Yup.string()
        .min(2, "Too Short!")
        .required("News title is Required"),
    });
  };

  componentDidMount() {
    const { location } = this.props;
    // if (location.state) {
    //     // Accessing the passed value from state
    //     if (location.state.news_id) {
    //         const news_id = location.state.news_id;
    //         // Accessing the passed value from query parameters
    //         // const queryParams = new URLSearchParams(location.search);
    //         // const passedValue = queryParams.get('passedValue');
    //         console.log('Passed Value:', news_id);
    //         this.setState({news_id: news_id});
    //         this.setState({mode: "update"});

    //         this.fetchNews(news_id);
    //     }
    // }
    const news_id = localStorage.getItem("newsId");
    this.setState({ news_id: news_id });
    this.setState({ mode: "update" });

    this.fetchNews(news_id);
  }

  fetchNews = (news_id) => {
    this.setState({ isOpen: true });
    makeProtectedRequest("/fetchNews", "POST", { news_id: news_id })
      .then((response) => {
        // Handle successful response
        this.setState({ isOpen: false });

        if (response.success) {
          var news = response.data;
          this.setState({ newsImage: "/uploads/" + news.news_image });

          /* this.setState({
                        editorState: news.news_body
                    });
                    */

          const contentBlock = htmlToDraft(news.news_body);
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(
              contentBlock.contentBlocks
            );
            this.setState({
              editorState: EditorState.createWithContent(contentState),
            });
          }

          this.setState({ news: news });

          this.formikRef.current.setValues(news);
        } else {
        }
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  };
  saveNews = (values) => {
    this.setState({ isOpen: true });
    var url = "/saveNews";
    if (this.state.mode === "update") {
      url = "/updateNews";
    }

    values.news_body = draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );

    const formData = new FormData();
    formData.append("data", JSON.stringify(values));

    formData.append("file", this.state.file);

    makeProtectedDataRequest(url, "POST", formData)
      .then((response) => {
        // Handle successful response
        this.setState({ isOpen: false });
        console.log(response);
        if (response.success) {
          this.props.history.push("/news"); // redirect to home page
        } else {
        }
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  };

  render() {
    const { news, mode, isOpen, newsImage, editorState, contentState } =
      this.state;

    return (
      <div>
        <div className="content">
          <Row>
            <Col xs={12} md={12}>
              <div className="page-title">
                <div className="float-left">
                  <h1 className="title">
                    {mode === "create" ? "Create News" : "Edit News"}
                  </h1>
                </div>
              </div>

              <div className="col-12">
                <section className="box ">
                  <header className="panel_header">
                    <h2 className="title float-left">News Information</h2>
                  </header>
                  <div className="content-body">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-10 col-lg-10 col-xl-8">
                        <Formik
                          innerRef={this.formikRef}
                          enableReinitialize={true}
                          initialValues={news}
                          validationSchema={this.validationSchema}
                          onSubmit={(values) => {
                            // same shape as initial values

                            console.log(values);

                            this.saveNews(values);
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
                                <Label htmlFor="news_title">Title</Label>
                                <Input
                                  type="text"
                                  name="news_title"
                                  id="news_title"
                                  onChange={handleChange}
                                  value={values.news_title}
                                  placeholder=""
                                  invalid={
                                    errors.news_title && touched.news_title
                                  }
                                />
                                {errors.news_title && touched.news_title ? (
                                  <FormFeedback>
                                    {errors.news_title}
                                  </FormFeedback>
                                ) : null}
                              </FormGroup>

                              <FormGroup>
                                <Label htmlFor="news_author">Author</Label>
                                <Input
                                  type="text"
                                  name="news_author"
                                  id="news_author"
                                  onChange={handleChange}
                                  value={values.news_author}
                                  placeholder=""
                                  invalid={
                                    errors.news_author && touched.news_author
                                  }
                                />
                                {errors.news_author && touched.news_author ? (
                                  <FormFeedback>
                                    {errors.news_author}
                                  </FormFeedback>
                                ) : null}
                              </FormGroup>

                              <FormGroup>
                                <Label htmlFor="news_video">
                                  Youtube Video URL
                                </Label>
                                <Input
                                  type="text"
                                  name="news_video"
                                  id="news_video"
                                  onChange={handleChange}
                                  value={values.news_video}
                                  placeholder=""
                                  invalid={
                                    errors.news_video && touched.news_video
                                  }
                                />
                                {errors.news_video && touched.news_video ? (
                                  <FormFeedback>
                                    {errors.news_video}
                                  </FormFeedback>
                                ) : null}

                                <FormText>
                                  Embed link for Youtube/Vimeo Video i.e.
                                  https://www.youtube.com/embed/t-rURJUMNKk
                                </FormText>
                              </FormGroup>

                              <FormGroup>
                                <Label htmlFor="news_image">Image</Label>
                                <div className="uprofile-image col-xl-3 col-lg-3 col-md-3 col-sm-4 col-12 mb-2 pl-0">
                                  <img
                                    alt=""
                                    src={newsImage}
                                    className="img-fluid"
                                  />
                                </div>
                                <Input
                                  type="file"
                                  name="news_image"
                                  id="news_image"
                                  onChange={this.handleImageChange}
                                />
                              </FormGroup>

                              <div className="form-group">
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
                              {/* <FormGroup>
                                                                <Label htmlFor="exampleText">HTML Format</Label>
                                                                <textarea className="form-control"
                                                                          disabled
                                                                          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                                                                />
                                                            </FormGroup>*/}

                              <br />

                              <Button className="float-left" type="submit">
                                {mode === "create" ? "Create" : "Update"}
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

export default ManageNews;
