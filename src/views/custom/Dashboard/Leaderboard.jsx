// import React, { useEffect, useState } from 'react'
// import moment from "moment";
// import Datatable from 'react-bs-datatable'; // Import this package

// import { makeProtectedRequest } from "../api";

// export default function Leaderboard() {
//     const [data, setData] = useState();
//   const [selectedTab, setSelectedTab] = useState(0);
//   const [timeSelected, setTimeSelected] = useState("D"); // Track the selected radio button
//   const [fromDate, setFromDate] = useState(moment().format("DD/MM/YYYY"));
//   const [toDate, setToDate] = useState(moment().format("DD/MM/YYYY"));

//   const customStyles = {
//     rows: {
//       style: {
//         cursor: 'pointer', // Set the cursor to pointer
//         // ... other row styles
//       },
//     },
//     headCells: {
//       style: {
//         fontSize: "14px", // Set the font size for header cells
//         fontWeight: "normal", // Set the font weight for header cells
//       },
//     },
//     cells: {
//       style: {
//         fontSize: "14px", // Set the font size for body cells
//         fontWeight: "normal", // Set the font weight for body cells
//       },
//     },
//   };
//   const columns = [
//     {
//       name: "#",
//       selector: (row, index) => index + 1,
//       sortable: false,
//       width: "50px", // Set the width to 200 pixels
//     },
//     {
//       name: "",
//       selector: (row) => row.symbol,
//       sortable: true,
//       cell: (row) => (
//           <i className="bi bi-person-circle" style={{fontSize:"22px"}}></i>
//       ),
//       width: "50px", // Set the width to 200 pixels
//     },
//     {
//       name: "Name",
//       selector: (row) => row.user_name,
//       sortable: true,
//       cell: (row) => <div style={{ whiteSpace: "pre-wrap" }}>{row.user_name}</div>,
//     },
//     {
//       name: selectedTab==0?"Amount":"Volume",
//       selector: (row) =>  selectedTab==0? "₹" + Number(row.totalProfit).toFixed(2) : row.totalQuantity,
//       sortable: true,
//     }

//   ];

// //   useEffect(() => {

// //     fetchLeaderboard(0, timeSelected, moment().format("DD/MM/YYYY"), moment().format("DD/MM/YYYY"));

// //   }, []);

//     const handlePressTime = (index) => {

//         let fromDate = new Date();
//         let toDate = new Date(fromDate);

//         const day = toDate.getDay(); // Sunday - 0, Monday - 1, etc.

//         if (index == "D") {

//           setToDate("");
//           setFromDate(formatDate(fromDate));
//         } else if (index == "W") {

//           const lastMonday = day === 1 ? 7 : day || 7;
//           fromDate.setDate(toDate.getDate() - lastMonday);
//           setToDate(formatDate(toDate));
//           setFromDate(formatDate(fromDate));
//         } else if (index == "M") {

//           fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1);
//           setToDate(formatDate(toDate));
//           setFromDate(formatDate(fromDate));
//         }

//         setTimeSelected(index);

//         if (index != "C") {
//         //   fetchLeaderboard(selectedTab, index, formatDate(fromDate), formatDate(toDate));
//         }
//       };

//       function formatDate(date) {
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
//         const year = date.getFullYear();

//         return `${day}/${month}/${year}`;
//       }

//       const fetchLeaderboard = async (index, time, fDate, tDate) => {

//         try {

//           let url = '';

//           if (index == 0) {
//             url = 'fetchLeaderboardByEarnings';
//           } else {
//             url = 'fetchLeaderboardByVolume';
//           }
//           console.log("index>", index)
//           console.log("time>", time)
//           console.log("fDate>", fDate)
//           console.log("tDate>", tDate)
//           const response = await makeProtectedRequest(url, {time: time, fromDate: fDate, toDate: tDate});
//           console.log("RESP1", JSON.stringify(response)); // Handle the response as needed

//           if (response.success) {
//             //  await SecureStore.setItemAsync('userData', JSON.stringify(response.data[0]));

//             var data = response.data;
//             setData(data);

//           } else {
//             // catchErrorAlert( response.message);
//             console.log("else error", response.message)
//           }
//         } catch (error) {
//             console.log("error", error)
//         //   catchErrorAlert(error);
//         }
//       }

//       const handleTabPress = (tabIndex) => {
//         console.log(">>",tabIndex);
//         setSelectedTab(tabIndex);
//         // fetchLeaderboard(tabIndex,timeSelected,fromDate,toDate);
//       };

//       const onSortFunction = {
//         date(columnValue) {
//           // Convert the string date format to UTC timestamp
//           // So the table could sort it by number instead of by string
//           return moment(columnValue, 'Do MMMM YYYY').valueOf();
//         },
//       };

//       const customLabels = {
//         first: '<<',
//         last: '>>',
//         prev: '<',
//         next: '>',
//         show: 'Display ',
//         entries: ' rows',
//         noResults: 'There is no data to be displayed',
//       };

//   return (
//     <>
//       <div className="container my-4 mt-5">
//         <div className="row g-4">
//           {/* <!-- Example index card --> */}

//           <div className="col-lg-12 col-sm-12">
//             <div className="card  shadow-sm" id="card">
//               <div className="card-body p-4">
//                 <div className="row g-4">
//                   <div className="col-lg-6 col-sm-12">
//                     <h5 className="card-title">Leaderboard</h5>
//                     <p className="card-text">
//                       Climb the Ranks: Showcase Your Skill, Seize the Spotlight
//                     </p>
//                   </div>
//                   <div className="col-lg-6 col-sm-12 text-right pb-0 mt-4">
//                     <div className="radioButtonGroup">

//                     <input onChange={()=>handlePressTime("D")} type="radio" id="x1" name="x" checked={timeSelected=="D"}/>
//                         <label htmlFor="x1">Daily</label>

//                         <input onChange={()=>handlePressTime("W")} type="radio" id="x2" name="x" checked={timeSelected=="W"}/>
//                         <label htmlFor="x2">Weekly</label>

//                         <input onChange={()=>handlePressTime("M")} type="radio" id="x3" name="x" checked={timeSelected=="M"}/>
//                         <label htmlFor="x3">Monthly</label>

//                     </div>
//                   </div>
//                   <div className="col-lg-12 mt-5">

//                     <ul
//                         className="nav nav-pills mb-3"
//                         id="pills-tab"
//                         role="tablist"
//                     >
//                       <li className="nav-item" role="presentation">
//                         <button
//                             className={selectedTab === 0 ? "nav-link active" : "nav-link"}
//                             id="pills-home-tab"
//                             data-bs-toggle="pill"
//                             data-bs-target="#pills-home"
//                             type="button"
//                             role="tab"
//                             aria-controls="pills-home"
//                             aria-selected="true"
//                             onClick={() => handleTabPress(0)}
//                         >
//                           By Earnings
//                         </button>
//                       </li>
//                       <li className="nav-item" role="presentation">
//                         <button
//                             className={selectedTab === 1 ? "nav-link active" : "nav-link"}
//                             id="pills-profile-tab"
//                             data-bs-toggle="pill"
//                             data-bs-target="#pills-profile"
//                             type="button"
//                             role="tab"
//                             aria-controls="pills-profile"
//                             aria-selected="false"
//                             onClick={() => handleTabPress(1)}
//                         >
//                           By Volume
//                         </button>
//                       </li>
//                     </ul>
//                     <main className="cd__main p-0">
//                       {/* datatable for display data */}
//                       {/* <Datatable
//                         columns={columns}
//                         data={data}
//                         customStyles={customStyles}
//                         pagination
//                         onRowClicked={()=>{

//                         }}
//                       /> */}
//                         <Datatable
//   tableHeader={columns}
//   tableBody={data}
//   keyName="userTable"
//   tableClass="striped table-hover table-responsive"
//   rowsPerPage={10}
//   rowsPerPageOption={[5, 10, 15, 20]}
//   initialSort={{prop: "id", isAscending: true}}
//   onSort={onSortFunction}
//   labels={customLabels}
// />
//                     </main>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* <!-- Repeat for other indices --> */}
//         </div>
//       </div>
//     </>
//   )
// }

import React, { Component } from "react";
import moment from "moment";
import Datatable from "react-bs-datatable";
import { makeProtectedRequest } from "../api";
import { Checkbox } from "../../../components";

const headerEarning = [
  { title: "", prop: "checkbox", sortable: false, filterable: false },
  { title: "No", prop: "no", sortable: false, filterable: false },
  { title: "Name", prop: "user_name", sortable: true, filterable: true },
  { title: "Amount", prop: "totalProfit", sortable: true, filterable: true },
];
const headerVolume = [
  { title: "", prop: "checkbox", sortable: false, filterable: false },
  { title: "No", prop: "no", sortable: false, filterable: false },
  { title: "Name", prop: "user_name", sortable: true, filterable: true },
  { title: "Volume", prop: "totalQuantity", sortable: true, filterable: true },
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

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedTab: 0,
      timeSelected: "D",
      fromDate: moment().format("DD/MM/YYYY"),
      toDate: moment().format("DD/MM/YYYY"),
    };
    this.customStyles = {
      rows: {
        style: {
          cursor: "pointer",
          // Other row styles
        },
      },
      headCells: {
        style: {
          fontSize: "14px",
          fontWeight: "normal",
        },
      },
      cells: {
        style: {
          fontSize: "14px",
          fontWeight: "normal",
        },
      },
    };

    // this.onSortFunction = {
    //   date(columnValue) {
    //     return moment(columnValue, "Do MMMM YYYY").valueOf();
    //   },
    // };
    // this.customLabels = {
    //   first: "<<",
    //   last: ">>",
    //   prev: "<",
    //   next: ">",
    //   show: "Display ",
    //   entries: " rows",
    //   noResults: "There is no data to be displayed",
    // };
  }

  componentDidMount() {
    this.fetchLeaderboard(
      0,
      this.state.timeSelected,
      moment().format("DD/MM/YYYY"),
      moment().format("DD/MM/YYYY")
    );
  }

  handlePressTime = (index) => {
    let fromDate = new Date();
    let toDate = new Date(fromDate);
    const day = toDate.getDay();

    if (index === "D") {
      this.setState({
        toDate: "",
        fromDate: this.formatDate(fromDate),
      });
    } else if (index === "W") {
      const lastMonday = day === 1 ? 7 : day || 7;
      fromDate.setDate(toDate.getDate() - lastMonday);
      this.setState({
        toDate: this.formatDate(toDate),
        fromDate: this.formatDate(fromDate),
      });
    } else if (index === "M") {
      fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1);
      this.setState({
        toDate: this.formatDate(toDate),
        fromDate: this.formatDate(fromDate),
      });
    }
    this.setState({
      timeSelected: index,
    });
    // if (index !== "C") {
    //   this.fetchLeaderboard(
    //     this.state.selectedTab,
    //     index,
    //     this.state.fromDate,
    //     this.state.toDate
    //   );
    // }
   
    // Ensure that fromDate and toDate are valid Date objects before calling formatDate
    if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
      this.setState({
        fromDate: this.formatDate(fromDate),
        toDate: this.formatDate(toDate),
        timeSelected: index,
      });

      if (index !== "C") {
        this.fetchLeaderboard(
          this.state.selectedTab,
          index,
          this.formatDate(fromDate),
          this.formatDate(toDate)
        );
      }
    } else {
      console.error("Invalid date objects:", fromDate, toDate);
    }
  };

  formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  fetchLeaderboard = async (index, time, fDate, tDate) => {
    try {
      let url = "";
      if (index === 0) {
        url = "/fetchLeaderboardByEarnings";
      } else {
        url = "/fetchLeaderboardByVolume";
      }

      const response = await makeProtectedRequest(url, "POST", {
        time,
        fromDate: fDate,
        toDate: tDate,
      });
      if (response.success) {
        console.log(">>", response.data.data);
        this.setState({
          data: response.data.data,
        });
      } else {
        console.error("Error fetching leaderboard:", response.message);
        // Handle error, such as displaying an error message to the user
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  handleTabPress = (tabIndex) => {
    this.setState({
      selectedTab: tabIndex,
    });
    this.fetchLeaderboard(
      tabIndex,
      this.state.timeSelected,
      this.state.fromDate,
      this.state.toDate
    );
  };

  render() {
    const { data } = this.state;

    return (
      <div className="container my-4 mt-5">
        <div className="row g-4">
          <div className="col-lg-12 col-sm-12">
            <div className="card shadow-sm" id="card">
              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-lg-6 col-sm-12">
                    <h5 className="card-title">Leaderboard</h5>
                    <p className="card-text">
                      Climb the Ranks: Showcase Your Skill, Seize the Spotlight
                    </p>
                  </div>
                  <div className="col-lg-6 col-sm-12 text-right pb-0 mt-4">
                    <div className="radioButtonGroup">
                      <input
                        onChange={() => this.handlePressTime("D")}
                        type="radio"
                        id="x1"
                        name="x"
                        checked={this.state.timeSelected === "D"}
                      />
                      <label htmlFor="x1">Daily</label>

                      <input
                        onChange={() => this.handlePressTime("W")}
                        type="radio"
                        id="x2"
                        name="x"
                        checked={this.state.timeSelected === "W"}
                      />
                      <label htmlFor="x2">Weekly</label>

                      <input
                        onChange={() => this.handlePressTime("M")}
                        type="radio"
                        id="x3"
                        name="x"
                        checked={this.state.timeSelected === "M"}
                      />
                      <label htmlFor="x3">Monthly</label>
                    </div>
                  </div>
                  <div className="col-lg-12 mt-5">
                    <ul
                      className="nav nav-pills mb-3"
                      id="pills-tab"
                      role="tablist"
                    >
                      <li className="nav-item" role="presentation">
                        <button
                          className={
                            this.state.selectedTab === 0
                              ? "nav-link active"
                              : "nav-link"
                          }
                          id="pills-home-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-home"
                          type="button"
                          role="tab"
                          aria-controls="pills-home"
                          aria-selected="true"
                          onClick={() => this.handleTabPress(0)}
                        >
                          By Earnings
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={
                            this.state.selectedTab === 1
                              ? "nav-link active"
                              : "nav-link"
                          }
                          id="pills-profile-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-profile"
                          type="button"
                          role="tab"
                          aria-controls="pills-profile"
                          aria-selected="false"
                          onClick={() => this.handleTabPress(1)}
                        >
                          By Volume
                        </button>
                      </li>
                    </ul>
                    <main className="cd__main p-0">
                      {/* <Datatable
                        tableHeader={this.columns}
                        tableBody={Array.isArray(this.state.data) ? this.state.data : []}
                        keyName="userTable"
                        tableClass="striped table-hover table-responsive"
                        rowsPerPage={10}
                        rowsPerPageOption={[5, 10, 15, 20]}
                        initialSort={{ prop: "id", isAscending: true }}
                        onSort={this.onSortFunction}
                        labels={this.customLabels}
                      /> */}
                      {data.length>0?
                      <Datatable
                        tableHeader={this.state.selectedTab == 0?headerEarning : headerVolume}
                        tableBody={data.map((row, index) => ({
                          ...row,
                          no: index + 1,
                          totalProfit: "₹" +  Number(row.totalProfit).toFixed(2)
                        }))}
                        keyName="leaderBoardTable"
                        tableClass="leader-board striped table-hover table-responsive"
                        rowsPerPage={20}
                        rowsPerPageOption={[5, 10, 15, 20]}
                        initialSort={{
                          prop: "_id",
                          isAscending: true,
                        }}
                        onSort={onSortFunction}
                        labels={customLabels}
                      />:<span className="d-flex justify-content-center">There are no records to display</span>}
                    </main>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Leaderboard;
