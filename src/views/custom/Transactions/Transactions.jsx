import moment from "moment"; // Example for onSort prop
import React from "react"; // Import React
//import { render } from 'react-dom'; // Import render method
import Datatable from "react-bs-datatable"; // Import this package
import { Row, Col, Label, Input, FormGroup, Badge } from "reactstrap";

import plans from "./transaction.js";
import { Button } from "../../../components";
import { Link } from "react-router-dom";
import { makeProtectedRequest } from "../api.js";

// const header = [
//     {title: 'No', prop: 'txn_no', sortable: false, filterable: false},
//     {title: 'User', prop: 'txn_name', sortable: true, filterable: true},
//     {title: 'Type', prop: 'txn_type', sortable: true, filterable: false},
//     {title: 'Direction', prop: 'txn_direction', sortable: true, filterable: false},
//     {title: 'Volume', prop: 'txn_volume', sortable: true, filterable: false},
//     {title: 'Price', prop: 'txn_amount', sortable: true, filterable: false},
//     {title: 'Script', prop: 'txn_script', sortable: true, filterable: true},
//     {title: 'Date/Time', prop: 'txn_datetime', sortable: true, filterable: true},
//     {title: 'View', prop: 'view', sortable: false, filterable: false}
// ];
const userTimeZone = moment.tz.guess(); // Guess the user's timezone

const header = [
  { title: "No", prop: "no", sortable: false, filterable: false },
  { title: "User", prop: "user_name", sortable: true, filterable: true },
  { title: "Type", prop: "txn_type", sortable: true, filterable: false },
  {
    title: "Direction",
    prop: "transactionType",
    sortable: true,
    filterable: false,
  },
  { title: "Volume", prop: "quantity", sortable: true, filterable: false },
  { title: "Price", prop: "amount", sortable: true, filterable: false },
  { title: "Script", prop: "stockSymbol", sortable: true, filterable: true },
  { title: "Date/Time", prop: "createdAt", sortable: true, filterable: true },
  { title: "View", prop: "view", sortable: false, filterable: false },
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

// const ViewButton = (row) => (
//   <Link to="/viewtransaction" className="btn btn-primary btn-sm">
//     <i className="fa fa-eye"></i>{" "}
//   </Link>
// );

const ViewButton = (row) => {
  const handleClick = () => {
    localStorage.setItem("transId", row._id);
    console.log("row>>", row._id);
  };

  return (
    <Link
      to="/viewtransaction"
      className="btn btn-primary btn-sm"
      onClick={handleClick}
    >
      <i className="fa fa-eye"></i>
    </Link>
  );
};

const TxnType = (row) => {
  if (row.txn_type == "S") {
    return (
      <Badge style={{ width: "100%" }} color="accent">
        Stock
      </Badge>
    );
  } else {
    return (
      //   <Badge style={{ width: "100%" }} color="info">
      //     Subscription
      //   </Badge>
      <Badge style={{ width: "100%" }} color="accent">
        Stock
      </Badge>
    );
  }
};

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: "",
      endDate: "",
      transactions: [],
      users: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchAllTransactions();
    this.fetchUsers();
  }

  // fetch user
  fetchUsers = () => {
    try {
      makeProtectedRequest("/fetchUsers", "GET", {})
        .then((response) => {
          if (response.success) {
            this.setState({ users: response.data });
          } else {
            console.log("else part");
          }
        })
        .catch((error) => {
          // Handle error
          console.error(error);
        });
    } catch (error) {
      console.log("catch error", error);

      // this.setState({message: 'Error logging in'});
    }
  };

  // fetch all transaction
  fetchAllTransactions = () => {
    try {
      makeProtectedRequest("/transaction", "GET", {})
        .then((response) => {
          // Handle successful response
          if (response.success) {
            this.setState({ transactions: response.data });
          } else {
            console.log("else part");
          }
        })
        .catch((error) => {
          // Handle error
          console.error(error);
        });
    } catch (error) {
      console.log("catch error", error);
      // this.setState({message: 'Error logging in'});
    }
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
    const { transactions, users,   startDate, endDate, } = this.state;
    const filteredTransactions = transactions.filter((row) => {
        if (!startDate || !endDate) {
          return true; // No filtering if start or end date is not provided
        }
  
        const transactionDate = moment.tz(row.createdAt, "UTC");
        const startOfDay = moment(startDate).startOf("day");
        const endOfDay = moment(endDate).endOf("day");
  
        return transactionDate.isBetween(startOfDay, endOfDay, null, "[]");
      });
  
    return (
      <div>
        <div className="content">
          <Row>
            <Col xs={12} md={12}>
              <div className="page-title">
                <div className="float-left">
                  <h1 className="title">Transactions</h1>
                </div>
              </div>

              <div className="col-12">
                <div className="row margin-0">
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-6">
                    <div className="db_box iconbox">
                      <div className="widdata">
                        <i className="widicon i-wallet icon-lg icon-primary"></i>
                        <h3 className="widtitle">Revenue</h3>
                        <p className="widtag">32,300 INR</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-6">
                    <div className="db_box iconbox">
                      <div className="widdata">
                        <i className="widicon i-user icon-lg icon-primary"></i>
                        <h3 className="widtitle">Active Subscriptions</h3>
                        <p className="widtag">40</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-6">
                    <div className="db_box iconbox">
                      <div className="widdata">
                        <i className="widicon i-user icon-lg icon-primary"></i>
                        <h3 className="widtitle">Pending Subscriptions</h3>
                        <p className="widtag">10</p>
                      </div>
                    </div>
                  </div>
                </div>
                <section className="box ">
                  <header className="panel_header">
                    <h2 className="title float-left">All Transactions</h2>
                  </header>
                  <div className="content-body">
                    <div className="row">
                      <div className="col-lg-12 dt-disp">
                        <div className="row  p-0">
                          <div className="col-lg-4 m-0">
                            <FormGroup>
                              <Label htmlFor="exampleDate">Start Date</Label>
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
                          tableBody={filteredTransactions&&filteredTransactions.map((row, index) => {
                            const user = users.find(
                              (user) => user._id === row.userId
                            );
                            const userName = user ? user.user_name : "Unknown";

                            return {
                              ...row,
                              no: index + 1,
                              user_name: userName,
                              transactionType:
                                row.transactionType == "B" ? "Buy" : "Sell",
                              stockSymbol: row.stockSymbol.split(".")[0],
                              createdAt: moment
                                .tz(row.createdAt, userTimeZone)
                                .format("DD/MM/YYYY h:mm A"),
                              txn_type: <TxnType {...row} />,
                              view: <ViewButton {...row} />,
                            };
                          })}
                          keyName="userTable"
                          tableClass="striped table-hover table-responsive"
                          rowsPerPage={20}
                          rowsPerPageOption={[5, 10, 15, 20]}
                          initialSort={{ prop: "planno", isAscending: true }}
                          onSort={onSortFunction}
                          labels={customLabels}
                          table-props={{
                            search: false,
                          }}
                        />

                        <div className="float-right">
                          {/*  <Button className="btn btn-primary btn-sm mt-3"
                                                            to="/plans/create">Export</Button>*/}
                        </div>
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

export default Transactions;
