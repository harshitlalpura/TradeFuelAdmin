import React from "react";
import {
  Row,
  Col,
  Badge,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

import { Button } from "components";
import plans from "../Transactions/transaction.js";
import Datatable from "react-bs-datatable";
import moment from "moment/moment";
import { Link } from "react-router-dom";
import { makeProtectedRequest } from "../api";
import { convertFromRaw, EditorState } from "draft-js";
import Swal from 'sweetalert2'

var IMGDIR = process.env.REACT_APP_IMGDIR;

const header = [
  { title: "No", prop: "txn_no", sortable: false, filterable: false },
  { title: "Type", prop: "txn_type", sortable: true, filterable: false },
  {
    title: "Direction",
    prop: "txn_direction",
    sortable: true,
    filterable: false,
  },
  { title: "Script", prop: "txn_script", sortable: true, filterable: true },

  { title: "Volume", prop: "txn_volume", sortable: true, filterable: false },
  { title: "Price", prop: "txn_amount", sortable: true, filterable: false },
  {title: "Total", prop: "total", sortable: true, filterable: false},
  {
    title: "Date/Time",
    prop: "txn_datetime",
    sortable: true,
    filterable: true,
  },
//   { title: "View", prop: "view", sortable: false, filterable: false },
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

const ViewButton = (row) => (
  <Link to="/viewtransaction" className="btn btn-primary btn-sm">
    <i className="fa fa-eye"></i>{" "}
  </Link>
);

const TxnType = (row) => {
  if (row.txn_type == "S") {
    return (
      <Badge style={{ width: "100%" }} color="accent">
        Stock
      </Badge>
    );
  } else {
    return (
      <Badge style={{ width: "100%" }} color="info">
        Subscription
      </Badge>
    );
  }
};
class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      transactions: [],
      isOpen: false,
      modal: false,
      balance:'',
      user: {
        user_name: "",
        user_email: "",
        user_phone: "",
        user_block: false,
        user_created_at: new Date(),
        user_trash: false,
      },
    };
  }
  componentDidMount() {
    const { location } = this.props;

    if (location.state) {
      // Accessing the passed value from state

      if (location.state.user_id) {
        const user_id = location.state.user_id;

        // Accessing the passed value from query parameters
        // const queryParams = new URLSearchParams(location.search);
        // const passedValue = queryParams.get('passedValue');
        console.log("Passed Value:", user_id);
        this.setState({ user_id: user_id });

        this.fetchUser(user_id);
      }
    }
  }

  fetchUser = (id) => {
    try {
      makeProtectedRequest("/fetchUser", "POST", { user_id: id })
        .then((response) => {
          // Handle successful response

          if (response.success) {
            this.setState({ user: response.data });

            this.fetchTransactions();
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

  fetchTransactions = () => {
    try {
      makeProtectedRequest("/fetchTransactions", "POST", {
        user_id: this.state.user_id,
      })
        .then((response) => {
          // Handle successful response

          if (response.success) {
            this.setState({ transactions: response.data.data });
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
  changeStatus = () => {
    try {
      makeProtectedRequest("/changeUserStatus", "POST", this.state.user)
        .then((response) => {
          // Handle successful response

          if (response.success) {
            this.fetchUser(this.state.user_id);
          } else {
          }
        })
        .catch((error) => {
          // Handle error
          console.log(error);
        });
    } catch (error) {
      this.setState({ message: "Error logging in" });
    }
  };
  deleteUser = () => {
    try {
      makeProtectedRequest("/deleteUser", "POST", {
        user_id: this.state.user_id,
      })
        .then((response) => {
          // Handle successful response

          //   if (response.success) {

          this.props.history.push("/users");

          //   } else {

          //   }
        })
        .catch((error) => {
          // Handle error
          console.error(error);
        });
    } catch (error) {
      this.setState({ message: "Error logging in" });
    }
  };
  // open add wallat balance model
  toggle() {
    this.setState({ modal: !this.state.modal });
  }

  handleBalanceChange = (event) => {
    const value = event.target.value;
    // Check if the value is a positive integer
    if (/^\d+$/.test(value) || value === '') {
      this.setState({ balance: value });
    }
  };

  handleWallateBalance = () => {
    if (this.state.balance !== undefined && this.state.balance !== null && this.state.balance !== '') {
    //   console.log("clicked", this.state.balance);
      try {
        makeProtectedRequest("/saveBalance", "POST", {
          user_id: this.state.user_id,
          user_balance: this.state.balance
        })
          .then((response) => {
            // console.log(">>>>", response)
            if (response.success) {
            this.fetchUser(this.state.user_id)
            this.setState({balance:""})
            this.toggle();
            Swal.fire({
                text: "Wallet Updated Successfully.",
                icon: "Success"
              });
            } else {
                console.log("else part")
            }
          })
          .catch((error) => {
            // Handle error
            console.error(error);
          });
      } catch (error) {
        this.setState({ message: "Error" });
      }
    } 
  }
  

  render() {
    const { user, transactions, balance, modal } = this.state;
    // console.log("response>>", user)
    return (
      <div>
        <div className="content">
          <Row>
            <Col xs={12} md={12}>
              <div className="page-title">
                <div className="float-left">
                  <h1 className="title">User Profile</h1>
                </div>
              </div>

              <div className="col-xl-12">
                <section className="box profile-page">
                  <div className="content-body">
                    <div className="col-12">
                      <div className="row uprofile">
                        <div className="uprofile-image col-xl-2 col-lg-3 col-md-3 col-sm-4 col-12">
                          <img
                            alt=""
                            src={
                              //   IMGDIR + "/images/social/socmembers/member-3.jpg"
                              IMGDIR + "/uploads/profile.png"
                            }
                            className="img-fluid"
                          />
                        </div>
                        <div className="uprofile-name col-xl-10 col-lg-9 col-md-9 col-sm-8 col-12">
                          <h3 className="uprofile-owner">
                            <a href="#!">{user.user_name}</a>
                          </h3>
                          <button
                            onClick={this.deleteUser}
                            className="btn btn-danger btn-sm btn-icon  profile-btn"
                          >
                            <i className="fa fa-trash"></i> &nbsp;{" "}
                            <span>Remove</span>
                          </button>

                          {user.user_block ? (
                            <button
                              type="button"
                              onClick={this.changeStatus}
                              className="btn btn-secondary btn-sm btn-icon  profile-btn"
                            >
                              <i className="fa fa-unlock"></i> &nbsp;{" "}
                              <span>Unblock</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={this.changeStatus}
                              className="btn btn-secondary btn-sm btn-icon  profile-btn"
                            >
                              <i className="fa fa-lock"></i> &nbsp;{" "}
                              <span>Block</span>
                            </button>
                          )}

                          <button
                            type="button"
                            className="btn btn-primary btn-sm btn-icon  profile-btn"
                            onClick={() => this.toggle()}
                          >
                            <i className="fa fa-plus"></i> &nbsp;{" "}
                            <span>Wallet Balance</span>
                          </button>
                          <div className="clearfix"></div>
                          <p className="uprofile-title">
                            {user.user_subscription}
                          </p>
                          <div className="clearfix"></div>

                          <p>
                            <span>
                              <i className="fa fa-envelope"></i>{" "}
                              {user.user_email}
                            </span>
                          </p>
                          <p>
                            <span>
                              <i className="fa fa-phone"></i> {user.user_phone}
                            </span>
                          </p>
                          <p>
                            <span>
                              <i className="i-wallet"></i> {Number(user.user_balance).toFixed(2)} INR
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <hr />

                      <h4>Transaction History:</h4>

                      <div className="clearfix"></div>
                    </div>
                    <div className="col-lg-12 dt-disp">
                      <div className="row  p-0">
                        <div className="col-lg-4 m-0">
                          <FormGroup>
                            <Label htmlFor="exampleDate">Start Date</Label>
                            <Input
                              type="date"
                              name="date"
                              id="exampleDate"
                              placeholder=""
                            />
                          </FormGroup>
                        </div>
                        <div className="col-lg-4">
                          <FormGroup>
                            <Label htmlFor="exampleDate">End Date</Label>
                            <Input
                              type="date"
                              name="date"
                              id="exampleDate"
                              placeholder=""
                            />
                          </FormGroup>
                        </div>
                      </div>

                      <Datatable
                        tableHeader={header}
                        // tableBody={
                        //   transactions &&
                        //   transactions.length > 0 &&
                        //   transactions.map((row) => ({
                        //     ...row,
                        //     txn_type: <TxnType {...row} />,
                        //     view: <ViewButton {...row} />,
                        //   }))
                        // }
                        tableBody={
                          transactions &&
                          transactions.length > 0 &&
                          transactions.map((row, index) => ({
                            txn_no: index + 1,
                            txn_type:   <Badge style={{ width: "100%" }} color="accent">
                            Stock
                          </Badge>,
                            txn_direction:
                              row.transactionType == "B" ? "Buy" : "Sell",
                            txn_volume: row.quantity,
                            txn_amount: Number(row.amount).toFixed(2),
                            txn_script: row.stockSymbol.split(".")[0],
                            total:(Number(row.quantity) * Number(row.amount)).toFixed(2),
                            txn_datetime:  moment.tz(row.createdAt, 'UTC').format("DD/MM/YYYY h:mm A"),
                            // view: <ViewButton {...row} />,
                          }))
                        }
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
                    </div>
                  </div>
                </section>
              </div>
            </Col>
          </Row>
        </div>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>Wallet Balance</ModalHeader>
          <ModalBody>
            <Input type="text" name="balance" id="balance" placeholder="Enter value" value={balance} onChange={this.handleBalanceChange} />
            {/* <Button style={{marginTop:"10px"}} onClick={this.handleWallateBalance}>Save</Button> */}
            <button
              type="button"
              className="btn btn-primary btn-sm btn-icon  profile-btn mt-3"
              onClick={this.handleWallateBalance}
            >
              Save
            </button>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default UserProfile;
