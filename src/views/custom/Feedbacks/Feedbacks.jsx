import moment from "moment"; // Example for onSort prop
import React from "react"; // Import React
//import { render } from 'react-dom'; // Import render method
import Datatable from "react-bs-datatable"; // Import this package
import {
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

import { Button } from "../../../components";
//import feed from "./feed";
import StarRatings from "react-star-ratings/build/star-ratings";
import { makeProtectedRequest } from "../api";
const userTimeZone = moment.tz.guess(); // Guess the user's timezone

const header = [
  { title: "No", prop: "feedback_no", sortable: false, filterable: false },
  { title: "User", prop: "user_name", sortable: true, filterable: true },
  {
    title: "Subscription",
    prop: "customersubscription",
    sortable: true,
    filterable: true,
  },
  {
    title: "Feedback",
    prop: "feedback_star",
    sortable: false,
    filterable: false,
  },
  {
    title: "Date/Time",
    prop: "feedback_created_at",
    sortable: true,
    filterable: true,
  },
  { title: "View", prop: "feedback", sortable: true, filterable: true },
];

const onSortFunction = {
  date(columnValue) {
    // Convert the string date format to UTC timestamp
    // So the table could sort it by number instead of by string
    return moment(columnValue, "Do MMMM YYYY").valueOf();
  },
};

const customLabels = {
  first: "<<",
  last: ">>",
  prev: "<",
  next: ">",
  show: "Display ",
  entries: " rows",
  noResults: "There is no data to be displayed",
};

const Star = (row) => {
  return (
    <StarRatings
      rating={row.feedback_stars}
      starRatedColor="#26a69a"
      numberOfStars={5}
      starDimension="25px"
      starSpacing="4px"
      name="rating"
    />
  );
};

class Feedbacks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      feedbacks: [],
      msg: "",
      startDate: "",
      endDate: "",
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.fetchFeedbacks();
  }

  fetchFeedbacks = () => {
    try {
      makeProtectedRequest("/fetchFeedbacks", "GET", {})
        .then((response) => {
          // Handle successful response

          if (response.success) {
            this.setState({ feedbacks: response.data });
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
  toggle = (msg) => {
    if (msg) {
      this.setState({
        msg: msg,
      });
    } else {
      this.setState({
        msg: "",
      });
    }
    this.setState({
      modal: !this.state.modal,
    });
  };

  // date wise filter
  handleStartDateChange = (e) => {
    this.setState({ startDate: e.target.value });
    this.setState({ endDate: "" });
  };

  handleEndDateChange = (e) => {
    this.setState({ endDate: e.target.value });
  };

  render() {
    const { feedbacks, startDate, endDate } = this.state;

    feedbacks.sort((a, b) => {
      // Convert 'user_created_at' strings to Date objects
      const dateA = new Date(a.feedback_created_at);
      const dateB = new Date(b.feedback_created_at);
      
      // Compare the dates
      return dateB - dateA; // For descending order, use dateB - dateA
  });

    const filteredFeedback = feedbacks.filter((row) => {
      if (!startDate || !endDate) {
        return true; // No filtering if start or end date is not provided
      }

      const feedbackDate = moment.tz(row.feedback_created_at,userTimeZone);
      const startOfDay = moment(startDate).startOf("day");
      const endOfDay = moment(endDate).endOf("day");

      return feedbackDate.isBetween(startOfDay, endOfDay, null, "[]");
    });

    return (
      <div>
        <div className="content">
          <Row>
            <Col xs={12} md={12}>
              <div className="page-title">
                <div className="float-left">
                  <h1 className="title">Feedbacks</h1>
                </div>
              </div>

              <div className="col-12">
                <section className="box ">
                  <header className="panel_header">
                    <h2 className="title float-left">All Feedbacks</h2>
                  </header>
                  <div className="content-body">
                    <div className="row">
                      <div className="col-lg-12 dt-disp">
                        <div className="row  p-0">
                          <div className="col-lg-4 m-0">
                            <FormGroup>
                              <Label htmlFor="exampleDate">Start Date</Label>
                              {/* <Input type="date" name="date" id="exampleDate"
                                                                   placeholder=""/> */}
                              <div className="d-flex align-items-center">
                                <Input
                                  type="date"
                                  name="date"
                                  id="exampleDate"
                                  placeholder=""
                                  value={this.state.startDate}
                                  onChange={this.handleStartDateChange}
                                />
                                {/* {this.state.startDate && (
                                <span
                                  style={{ cursor: "pointer", color: "red" }}
                                  class="input-group-btn"
                                  onClick={() =>
                                    this.setState({ startDate: "" })
                                  }
                                >
                                  <i
                                    class="fa fa-times fa-fw"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              )} */}
                              </div>
                            </FormGroup>
                          </div>
                          <div className="col-lg-4">
                            <FormGroup>
                              <Label htmlFor="exampleDate">End Date</Label>
                              {/* <Input
                                type="date"
                                name="date"
                                id="exampleDate"
                                placeholder=""
                              /> */}
                              <div className="d-flex align-items-center">
                                <Input
                                  type="date"
                                  name="date"
                                  id="exampleDate"
                                  placeholder=""
                                  min={startDate}
                                  value={this.state.endDate}
                                  onChange={this.handleEndDateChange}
                                />
                                {/* {this.state.endDate && (
                                <span
                                  style={{ cursor: "pointer", color: "red" }}
                                  class="input-group-btn"
                                  onClick={() => this.setState({ endDate: "" })}
                                >
                                  <i
                                    class="fa fa-times fa-fw"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              )} */}
                              </div>
                            </FormGroup>
                          </div>
                        </div>

                        <Datatable
                          tableHeader={header}
                          tableBody={
                            filteredFeedback &&
                            filteredFeedback.length > 0 &&
                            filteredFeedback.map((row, index) => ({
                              ...row,
                              feedback_no: index + 1,
                              user_name: row.user && row.user.user_name,
                              customersubscription:
                                row.user && row.user.user_subscription,
                              feedback_star: <Star {...row} />,
                              // feedback_created_at: moment
                              //   .tz(row.feedback_created_at)
                              //   .format("DD/MM/YYYY h:mm A"),
                                
                                feedback_created_at: moment
                                .tz(row.feedback_created_at, userTimeZone)
                                .format("DD/MM/YYYY h:mm A"),
                              feedback: (
                                <Button
                                  className="btn btn-primary btn-sm"
                                  onClick={() =>
                                    this.toggle(row.feedback_comments)
                                  }
                                >
                                  <i className="fa fa-eye"></i>{" "}
                                </Button>
                              ),
                            }))
                          }
                          keyName="userTable"
                          tableClass="striped feedBackTable table-hover table-responsive"
                          rowsPerPage={20}
                          rowsPerPageOption={[5, 10, 15, 20]}
                          initialSort={{
                            prop: "feedback_no",
                            isAscending: true,
                          }}
                          onSort={onSortFunction}
                          labels={customLabels}
                          table-props={{
                            search: false,
                          }}
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
        <Modal
          isOpen={this.state.modal}
          toggle={() => this.toggle("")}
          className={this.props.className}
        >
          <ModalHeader toggle={() => this.toggle("")}>Feedback</ModalHeader>
          <ModalBody>{this.state.msg}</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => this.toggle("")}>
              Ok
            </Button>{" "}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Feedbacks;
