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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormFeedback,
} from "reactstrap";

import { Button } from "components";
import plans from "../Transactions/transaction.js";
import Datatable from "react-bs-datatable";
import moment from "moment/moment";
import { Link } from "react-router-dom";
import { makeProtectedRequest } from "../api";
import { convertFromRaw, EditorState } from "draft-js";
import Swal from "sweetalert2";
import { Form, Formik } from "formik";
import * as Yup from "yup";

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
  { title: "Total", prop: "total", sortable: true, filterable: false },
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
    this.coinToggle = this.coinToggle.bind(this);

    this.state = {
      transactions: [],
      isOpen: false,
      modal: false,
      coinModel: false,
      coinDropdown: false,
      startDate: "",
      endDate: "",
      balance: "",
      coinValue: "",
      coninValueError: false,
      selectDropdownError: false,
      // selectedOption: null,
      user: {
        user_name: "",
        user_email: "",
        user_phone: "",
        user_block: false,
        user_created_at: new Date(),
        user_trash: false,
      },
      learnCategory: {
        coin_value: "",
        selectedOption: null,
      },
    };
  }
  componentDidMount() {
    const { location } = this.props;

    // if (location.state) {
    //   // Accessing the passed value from state

    //   if (location.state.user_id) {
    //     const user_id = location.state.user_id;

    //     // Accessing the passed value from query parameters
    //     // const queryParams = new URLSearchParams(location.search);
    //     // const passedValue = queryParams.get('passedValue');
    //     console.log("Passed Value:", user_id);
    //     this.setState({ user_id: user_id });

    //     this.fetchUser(user_id);
    //   }
    // }
    let user_id = localStorage.getItem("userId");
    if(user_id){
      this.setState({ user_id: user_id });

      this.fetchUser(user_id);
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
  // open add coin model
  coinToggle() {
    this.setState({ coinModel: !this.state.coinModel });
    this.setState({ coninValueError: false });
    this.setState({ selectDropdownError: false });
  }

  toggleDropdown = () => {
    this.setState({ coinDropdown: !this.state.coinDropdown });
  };

  handleBalanceChange = (event) => {
    const value = event.target.value;
    // Check if the value is a positive integer
    if (/^\d+$/.test(value) || value === "") {
      this.setState({ balance: value });
    }
  };
  validationCatSchema = () => {
    return Yup.object().shape({
      coin_value: Yup.string()
        .required("Coin value is Required")
        .matches(/^\d+$/, "Coin value must contain only digits"),
      selectedOption: Yup.object().nullable().required("Option is Required"),
    });
  };

  handleCoinChange = (event) => {
    const value = event.target.value;
    // Check if the value is a positive integer
    if (/^\d+$/.test(value) || value === "") {
      this.setState({ coinValue: value });
      this.setState({ coninValueError: false });
    }
  };

  handleSelect = (option) => {
    this.setState({
      selectedOption: option,
      isOpen: false,
    });
    this.setState({ selectDropdownError: false });
  };

  handleWallateBalance = () => {
    if (
      this.state.balance !== undefined &&
      this.state.balance !== null &&
      this.state.balance !== ""
    ) {
      //   console.log("clicked", this.state.balance);
      try {
        makeProtectedRequest("/saveBalance", "POST", {
          user_id: this.state.user_id,
          user_balance:
            Number(this.state.user.user_balance) + Number(this.state.balance),
        })
          .then((response) => {
            // console.log(">>>>", response)
            if (response.success) {
              this.fetchUser(this.state.user_id);
              this.setState({ balance: "" });
              this.toggle();
              Swal.fire({
                text: "Wallet Updated Successfully.",
                icon: "Success",
              });
            } else {
              console.log("else part");
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
  };

  handleCoinSave = () => {
    if (
      this.state.coinValue !== undefined &&
      this.state.coinValue !== null &&
      this.state.coinValue !== "" &&
      this.state.selectedOption !== undefined &&
      this.state.selectedOption !== null &&
      this.state.selectedOption !== ""
    ) {
      console.log("coin save", this.state.coinValue);
      console.log("selectedOption", this.state.selectedOption.label);
    } else {
      this.setState({ coninValueError: this.state.coinValue ? false : true });
      this.setState({
        selectDropdownError: this.state.selectedOption ? false : true,
      });
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
    const {
      user,
      transactions,
      balance,
      modal,
      startDate,
      endDate,
      coinValue,
      selectedOption,
      learnCategory,
    } = this.state;
    // console.log("response>>", user)
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
                          <button
                            type="button"
                            className="btn btn-purple btn-sm btn-icon  profile-btn"
                            onClick={() => this.coinToggle()}
                          >
                            <i className="fa fa-plus"></i> &nbsp;{" "}
                            <span>Coin</span>
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
                              <i className="i-wallet"></i>{" "}
                              {Number(user.user_balance).toFixed(2)} INR
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
                            {/* <Input
                              type="date"
                              name="date"
                              id="exampleDate"
                              placeholder=""
                              onChange={this.handleStartDateChange}
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
                              min={startDate} // Set min attribute dynamically
                              onChange={this.handleEndDateChange}
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
                          filteredTransactions &&
                          filteredTransactions.length > 0 &&
                          filteredTransactions.map((row, index) => ({
                            txn_no: index + 1,
                            txn_type: (
                              <Badge style={{ width: "100%" }} color="accent">
                                Stock
                              </Badge>
                            ),
                            txn_direction:
                              row.transactionType == "B" ? "Buy" : "Sell",
                            txn_volume: row.quantity,
                            txn_amount: Number(row.amount).toFixed(2),
                            txn_script:
                              row.stockSymbol && row.stockSymbol.split(".")[0],
                            total: (
                              Number(row.quantity) * Number(row.amount)
                            ).toFixed(2),
                            txn_datetime: moment
                              .tz(row.createdAt, "UTC")
                              .format("DD/MM/YYYY h:mm A"),
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
            <Col>
              <div className="col-xl-12">
                <section className="box profile-page">
                  <div className="content-body">
                    <div className="col-12">
                      <h4>Coin History:</h4>
                      <div className="clearfix"></div>
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
            <Input
              type="text"
              name="balance"
              id="balance"
              placeholder="Enter value"
              value={balance}
              onChange={this.handleBalanceChange}
            />
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

        <Modal
          isOpen={this.state.coinModel}
          toggle={this.coinToggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.coinToggle}>Coin</ModalHeader>
          <ModalBody>
            <Input
              type="text"
              name="coin"
              id="coin"
              placeholder="Enter value"
              value={coinValue}
              onChange={this.handleCoinChange}
            />
            {this.state.coninValueError ? (
              <div className="text-danger">Please enter value</div>
            ) : null}
            <Dropdown
              isOpen={this.state.coinDropdown}
              toggle={this.toggleDropdown}
              className="mt-2 w-100"
            >
              <DropdownToggle
                caret
                className="w-100"
                style={{
                  backgroundColor: "white",
                  color: "#505458",
                  textAlign: "left",
                  border: "1px solid #eeeeee",
                }}
              >
                {selectedOption ? selectedOption.label : "Select an option"}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={() =>
                    this.handleSelect({ value: 1, label: "Debit" })
                  }
                >
                  Debit
                </DropdownItem>
                <DropdownItem
                  onClick={() =>
                    this.handleSelect({ value: 2, label: "Credit" })
                  }
                >
                  Credit
                </DropdownItem>

                <DropdownItem divider />
              </DropdownMenu>
              {this.state.selectDropdownError ? (
                <div className="text-danger">Please select value</div>
              ) : null}
            </Dropdown>
            <br></br>
            <button
              type="button"
              className="btn btn-purple btn-sm btn-icon  profile-btn mt-3"
              onClick={this.handleCoinSave}
            >
              Save
            </button>
          </ModalBody>
        </Modal>
        {/* <Modal
          isOpen={this.state.coinModel}
          toggle={this.coinToggle}
          className={this.props.className}
        >
          <ModalBody>
            <Formik
              innerRef={this.formikRef}
              enableReinitialize={true}
              initialValues={this.state.learnCategory}
              validationSchema={this.validationCatSchema}
              onSubmit={(values) => {
                // same shape as initial values
                console.log(values);
                // this.saveCategory(values);
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
                  {" "}
                  <FormGroup>
                    <Label htmlFor="coin_value">Coin</Label>
                    <Input
                      type="text"
                      name="coin_value"
                      id="coin_value"
                      onChange={handleChange}
                      value={values.coin_value}
                      placeholder="Enter value"
                      invalid={errors.coin_value && touched.coin_value}
                    />
                    {errors.coin_value && touched.coin_value ? (
                      <FormFeedback>{errors.coin_value}</FormFeedback>
                    ) : null}
                   
                
                    <Dropdown
                      isOpen={this.state.coinDropdown}
                      toggle={this.toggleDropdown}
                      className="mt-2 w-100"
                    >
                      <DropdownToggle
                        caret
                        className="w-100"
                        style={{
                          backgroundColor: "white",
                          color: "#505458",
                          textAlign: "left",
                          border: "1px solid #eeeeee",
                        }}
                      >
                        {selectedOption
                          ? selectedOption.label
                          : "Select an option"}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          onClick={() =>
                            // this.handleSelect({ value: 1, label: "Debit" })
                            setFieldValue("selectedOption", { value: 1, label: "Debit" })
                          }
                        >
                          Debit
                        </DropdownItem>
                        <DropdownItem
                          onClick={() =>
                            // this.handleSelect({ value: 2, label: "Credit" })
                            setFieldValue("selectedOption", { value: 2, label: "Credit" })
                          }
                        >
                          Credit
                        </DropdownItem>
                        <DropdownItem divider />
                      </DropdownMenu>
                    </Dropdown>
                    {errors.selectedOption && touched.selectedOption ? (
                      <FormFeedback>{errors.selectedOption}</FormFeedback>
                    ) : null}
                  </FormGroup>
                  <Button className="float-left" type="submit">
                    Add
                  </Button>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </Modal> */}
      </div>
    );
  }
}

export default UserProfile;
