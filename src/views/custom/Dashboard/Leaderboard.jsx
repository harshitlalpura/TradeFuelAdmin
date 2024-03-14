import React, { useEffect, useState } from 'react'
import moment from "moment";
import { makeProtectedRequest } from "../api";


export default function Leaderboard() {
    const [data, setData] = useState();
  const [selectedTab, setSelectedTab] = useState(0);
  const [timeSelected, setTimeSelected] = useState("D"); // Track the selected radio button
  const [fromDate, setFromDate] = useState(moment().format("DD/MM/YYYY"));
  const [toDate, setToDate] = useState(moment().format("DD/MM/YYYY"));


//   useEffect(() => {

//     fetchLeaderboard(0, timeSelected, moment().format("DD/MM/YYYY"), moment().format("DD/MM/YYYY"));

//   }, []);

    const handlePressTime = (index) => {


        let fromDate = new Date();
        let toDate = new Date(fromDate);
    
        const day = toDate.getDay(); // Sunday - 0, Monday - 1, etc.
    
        if (index == "D") {
    
          setToDate("");
          setFromDate(formatDate(fromDate));
        } else if (index == "W") {
    
          const lastMonday = day === 1 ? 7 : day || 7;
          fromDate.setDate(toDate.getDate() - lastMonday);
          setToDate(formatDate(toDate));
          setFromDate(formatDate(fromDate));
        } else if (index == "M") {
    
          fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1);
          setToDate(formatDate(toDate));
          setFromDate(formatDate(fromDate));
        }
    
    
        setTimeSelected(index);
    
        if (index != "C") {
        //   fetchLeaderboard(selectedTab, index, formatDate(fromDate), formatDate(toDate));
        }
      };

      function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
        const year = date.getFullYear();
    
        return `${day}/${month}/${year}`;
      }

      const fetchLeaderboard = async (index, time, fDate, tDate) => {


        try {
    
          let url = '';
    
          if (index == 0) {
            url = 'fetchLeaderboardByEarnings';
          } else {
            url = 'fetchLeaderboardByVolume';
          }
          console.log("index>", index)
          console.log("time>", time)
          console.log("fDate>", fDate)
          console.log("tDate>", tDate)
          const response = await makeProtectedRequest(url, {time: time, fromDate: fDate, toDate: tDate});
          console.log("RESP1", JSON.stringify(response)); // Handle the response as needed
    
    
          if (response.success) {
            //  await SecureStore.setItemAsync('userData', JSON.stringify(response.data[0]));
    
    
            var data = response.data;
            setData(data);
    
    
    
          } else {
            // catchErrorAlert( response.message);
            console.log("else error", response.message)
          }
        } catch (error) {
            console.log("error", error)
        //   catchErrorAlert(error);
        }
      }

      const handleTabPress = (tabIndex) => {
        console.log(">>",tabIndex);
        setSelectedTab(tabIndex);
        // fetchLeaderboard(tabIndex,timeSelected,fromDate,toDate);
      };

  return (
    <>
      <div className="container my-4 mt-5">
        <div className="row g-4">
          {/* <!-- Example index card --> */}

          <div className="col-lg-12 col-sm-12">
            <div className="card  shadow-sm" id="card">
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

                    <input onChange={()=>handlePressTime("D")} type="radio" id="x1" name="x" checked={timeSelected=="D"}/>
                        <label htmlFor="x1">Daily</label>

                        <input onChange={()=>handlePressTime("W")} type="radio" id="x2" name="x" checked={timeSelected=="W"}/>
                        <label htmlFor="x2">Weekly</label>

                        <input onChange={()=>handlePressTime("M")} type="radio" id="x3" name="x" checked={timeSelected=="M"}/>
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
                            className={selectedTab === 0 ? "nav-link active" : "nav-link"}
                            id="pills-home-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-home"
                            type="button"
                            role="tab"
                            aria-controls="pills-home"
                            aria-selected="true"
                            onClick={() => handleTabPress(0)}
                        >
                          By Earnings
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                            className={selectedTab === 1 ? "nav-link active" : "nav-link"}
                            id="pills-profile-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-profile"
                            type="button"
                            role="tab"
                            aria-controls="pills-profile"
                            aria-selected="false"
                            onClick={() => handleTabPress(1)}
                        >
                          By Volume
                        </button>
                      </li>
                    </ul>
                    <main className="cd__main p-0">
                      {/* datatable for display data */}
                      {/* <DataTable
                        columns={columns}
                        data={data}
                        customStyles={customStyles}
                        pagination
                        onRowClicked={()=>{

                        }}
                      /> */}
                    </main>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Repeat for other indices --> */}
        </div>
      </div>
    </>
  )
}
