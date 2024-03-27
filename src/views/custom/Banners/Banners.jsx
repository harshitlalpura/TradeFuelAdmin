import moment from "moment"; // Example for onSort prop
import React from "react"; // Import React
//import { render } from 'react-dom'; // Import render method
import Datatable from "react-bs-datatable"; // Import this package
import { Col, Row } from "reactstrap";

//import banners from './banner.js'
import { Link } from "react-router-dom";
import { Button } from "../../../components";
import { makeProtectedRequest } from "../api";

const userTimeZone = moment.tz.guess(); // Guess the user's timezone

const header = [
  { title: "No", prop: "banner_no", sortable: false, filterable: false },
  { title: "Name", prop: "banner_name", sortable: true, filterable: true },
  { title: "Type", prop: "banner_type", sortable: true, filterable: true },
  {
    title: "Position",
    prop: "banner_position",
    sortable: true,
    filterable: true,
  },
  {
    title: "Active Since",
    prop: "banner_created_at",
    sortable: true,
    filterable: true,
  },
  {
    title: "Expires",
    prop: "banner_expires_at",
    sortable: true,
    filterable: true,
  },
  { title: "View", prop: "view", sortable: false, filterable: false },
  { title: "Delete", prop: "delete", sortable: false, filterable: false },
];

const onSortFunction = {
  banner_created_at(columnValue) {
    // Convert the string date format to UTC timestamp
    // So the table could sort it by number instead of by string
    return moment(columnValue, "Do MMMM YYYY").valueOf();
  },
  banner_name(columnValue) {
    return columnValue.toLowerCase();
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

class Banners extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      banners: [],
    };
  }

  componentDidMount() {
    this.fetchBanners();
  }

  openBanner = (id) => {
    const { history } = this.props;
    localStorage.setItem("bannerId", id);
    history.push("/banner");

    // history.push('/banner', {banner_id: id});
  };
  deleteBanner = (id) => {
    try {
      makeProtectedRequest("/deleteBanner", "POST", { banner_id: id })
        .then((response) => {
          // Handle successful response

          if (response.success) {
            this.fetchBanners();
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
  fetchBanners = () => {
    try {
      makeProtectedRequest("/fetchBanners", "GET", {})
        .then((response) => {
          // Handle successful response

          if (response.success) {
            this.setState({ banners: response.data });
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
    const { banners } = this.state;

    banners.sort((a, b) => {
      // Convert 'user_created_at' strings to Date objects
      const dateA = new Date(a.feedback_created_at);
      const dateB = new Date(b.feedback_created_at);
      
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
                  <h1 className="title">Banners</h1>
                </div>
                <div className="float-right">
                  <Link
                    className="btn btn-primary btn-sm mt-3"
                    to="/banner"
                    onClick={() => localStorage.removeItem("bannerId")}
                  >
                    Create Banner
                  </Link>
                </div>
              </div>

              <div className="col-12">
                <section className="box ">
                  <header className="panel_header">
                    <h2 className="title float-left">All Banners</h2>
                  </header>
                  <div className="content-body">
                    <div className="row">
                      <div className="col-lg-12 dt-disp">
                        <Datatable
                          tableHeader={header}
                          tableBody={banners.map((row, index) => ({
                            ...row,
                            banner_no: index + 1,

                            banner_created_at: moment
                              .tz(row.banner_created_at, userTimeZone)
                              .format("DD/MM/YYYY h:mm A"),
                            banner_expires_at: moment
                              .tz(row.banner_expires_at, userTimeZone)
                              .format("DD/MM/YYYY"),

                            view: (
                              <Button
                                className="btn btn-primary btn-sm"
                                onClick={() => this.openBanner(`${row._id}`)}
                              >
                                <i className="fa fa-eye"></i>
                              </Button>
                            ),
                            delete: (
                              <Button
                                className="btn btn-primary btn-sm"
                                onClick={() => this.deleteBanner(`${row._id}`)}
                              >
                                <i className="fa fa-trash"></i>
                              </Button>
                            ),
                          }))}
                          keyName="userTable"
                          tableClass="striped bannersTable table-hover table-responsive"
                          rowsPerPage={20}
                          rowsPerPageOption={[5, 10, 15, 20]}
                          initialSort={{ prop: "banner_no", isAscending: true }}
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
      </div>
    );
  }
}

export default Banners;
