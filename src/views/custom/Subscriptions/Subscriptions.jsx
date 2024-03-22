import React from 'react';
import {
    Table,
    Row,
    Col,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Card,
    CardTitle,
    CardText,
    Button,
    Badge,
    Pagination,
    PaginationItem, PaginationLink, DropdownToggle, DropdownMenu, DropdownItem, Dropdown,
} from 'reactstrap';

import {} from 'components';

import {Line, Bar, Doughnut, Scatter, HorizontalBar} from 'react-chartjs-2';

//import styles from 'jvectormap/jquery-jvectormap.css'
import {VectorMap} from 'react-jvectormap';

import {
    playlistCharts,
    playlistCharts3,
    playlistCharts4,
    playlistCharts5,
    playlistCharts1,
    playlistCharts2,
} from 'variables/general/dashboard-charts.jsx';

import {
    //dashboardAllProductsChart,
    //dashboardAllProductsChart1,
    dashboardAllProductsChart3,
} from 'variables/general/dashboard-charts.jsx';

//import CountTo from 'react-count-to';

import {
    Mailbox,
} from 'components';

//import { messagewidget } from 'variables/general/widget.jsx';
import {mailbox} from 'variables/general/mailbox.jsx';

import PerfectScrollbar from 'perfect-scrollbar';
import classnames from "classnames";

import Chart from "react-apexcharts";
import {
    playlistCharts10,
    playlistCharts7,
    playlistCharts8,
    playlistCharts9
} from "../../../variables/general/dashboard-charts-9";
import {
    dashboardAllProductsChart,
    dashboardShippedProductsChart,
    dashboardSubscriptionChart
} from "../../../variables/general/charts";
import {makeProtectedRequest} from "../api";
import moment from "moment";

var mailps;

var IMGDIR = process.env.REACT_APP_IMGDIR;

const primaryColor = "#26a69a";
const accentColor = "#ff8a65";
const chartColor = "#FFFFFF";
const gradientChartOptionsConfiguration = {
    maintainAspectRatio: false,
    legend: {
        display: true
    },
    tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10
    },
    responsive: 1,
    scales: {
        yAxes: [{
            display: 1,
            ticks: {
                display: true
            },
            gridLines: {
                color: "rgba(0, 0, 0, 0.01)",

                drawBorder: false
            }
        }],
        xAxes: [{
            display: 1,
            ticks: {
                display: true
            },
            gridLines: {
                color: "rgba(0, 0, 0, 0.01)",
                zeroLineColor: "transparent",
                drawTicks: false,
                display: true,
                drawBorder: false
            }
        }]
    },
    layout: {
        padding: {left: 0, right: 0, top: 0, bottom: 0}
    }
};

class Subscriptions extends React.Component {
    chartRef = React.createRef();


    constructor(props) {
        super(props);
        this.state = {


            dropdownVisitorOpen: false,
            dropdownSubscriptionOpen: false,
            weeklyVisitorData: [],
            weeklySubscriptionData:[],
            monthlyVistorData: [],
            monthlySubscriptionData: [],
            activeMarketTab: '1',
            visitors: [],
            subscriptions:[],
            visitorChartType: "W",
            subscriptionChartType:"W",
            gradientFill: null,
            gradientStroke: null

        };
    }


    toggleMarketTabs = (tab) => {
        if (this.state.activeMarketTab !== tab) {
            this.setState({
                activeMarketTab: tab
            });
        }
    }

    toggleVisitorFilter = () => {
        this.setState(prevState => ({
            dropdownVisitorOpen: !prevState.dropdownVisitorOpen
        }));
    }

    toggleSubscriptionFilter = () => {
        this.setState(prevState => ({
            dropdownSubscriptionOpen: !prevState.dropdownSubscriptionOpen
        }));
    }

    changeVisitorFilter = (type) => {

        this.setState({visitorChartType: type});
    }

    componentDidMount() {
        const chartInstance = this.chartRef.current.chartInstance;
        const canvas = chartInstance.canvas;

        var ctx = canvas.getContext("2d");
        var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
        gradientStroke.addColorStop(0, 'rgba(255, 138, 101,1)');
        gradientStroke.addColorStop(1, chartColor);
        var gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
        gradientFill.addColorStop(0, "rgba(255, 138, 101, 1)");
        gradientFill.addColorStop(1, "rgba(255, 138, 101, 1)");

        this.setState({gradientStroke: gradientStroke});
        this.setState({gradientFill: gradientFill});


        this.fetchVisitors();
        this.fetchUsers()
    }

    fetchVisitors = () => {
        try {

            makeProtectedRequest('/fetchAllVisitors', 'GET', {})
                .then((response) => {
                    // Handle successful response


                    if (response.success) {

                          this.setState({visitors: response.data});

                        /*this.setState({
                            visitors: [
                                { user_created_at: '2022-01-01T09:00:00Z' },
                                { user_created_at: '2022-01-03T14:30:00Z' },
                                { user_created_at: '2022-01-05T11:45:00Z' },
                                { user_created_at: '2022-01-08T17:15:00Z' },
                                { user_created_at: '2022-01-12T10:00:00Z' },
                                { user_created_at: '2022-01-18T09:30:00Z' },
                                { user_created_at: '2022-01-21T16:45:00Z' },
                                { user_created_at: '2022-01-24T13:20:00Z' },
                                { user_created_at: '2022-01-28T10:15:00Z' },
                                { user_created_at: '2022-01-30T14:30:00Z' },
                                { user_created_at: '2022-02-01T09:00:00Z' },
                                { user_created_at: '2022-02-03T14:30:00Z' },
                                { user_created_at: '2022-02-05T11:45:00Z' },
                                { user_created_at: '2022-02-08T17:15:00Z' },
                                { user_created_at: '2022-02-12T10:00:00Z' },
                                { user_created_at: '2022-02-18T09:30:00Z' },
                                { user_created_at: '2022-02-21T16:45:00Z' },
                                { user_created_at: '2022-02-24T13:20:00Z' },
                                { user_created_at: '2022-02-28T10:15:00Z' },
                                { user_created_at: '2022-03-02T14:30:00Z' },
                                { user_created_at: '2022-03-05T11:45:00Z' },
                                { user_created_at: '2022-03-08T17:15:00Z' },
                                { user_created_at: '2022-03-12T10:00:00Z' },
                                { user_created_at: '2022-03-18T09:30:00Z' },
                                { user_created_at: '2022-03-21T16:45:00Z' },
                                { user_created_at: '2022-03-24T13:20:00Z' },
                                { user_created_at: '2022-03-28T10:15:00Z' },
                                { user_created_at: '2022-03-30T14:30:00Z' },
                                { user_created_at: '2022-04-01T09:00:00Z' },
                                { user_created_at: '2022-04-03T14:30:00Z' },
                                { user_created_at: '2022-04-05T11:45:00Z' },
                                { user_created_at: '2022-04-08T17:15:00Z' },
                                { user_created_at: '2022-04-12T10:00:00Z' },
                                { user_created_at: '2022-04-18T09:30:00Z' },
                                { user_created_at: '2022-04-21T16:45:00Z' },
                                { user_created_at: '2022-04-24T13:20:00Z' },
                                { user_created_at: '2022-04-28T10:15:00Z' },
                                { user_created_at: '2022-04-30T14:30:00Z' },
                                { user_created_at: '2022-05-01T09:00:00Z' },
                                { user_created_at: '2022-05-03T14:30:00Z' },
                                { user_created_at: '2022-05-05T11:45:00Z' },
                                { user_created_at: '2022-05-08T17:15:00Z' },
                                { user_created_at: '2022-05-12T10:00:00Z' },
                                { user_created_at: '2022-05-18T09:30:00Z' },
                                { user_created_at: '2022-05-21T16:45:00Z' },
                                { user_created_at: '2022-05-24T13:20:00Z' },
                                { user_created_at: '2022-05-28T10:15:00Z' },
                                { user_created_at: '2022-05-30T14:30:00Z' },
                                { user_created_at: '2022-06-18T09:30:00Z' },
                                { user_created_at: '2023-07-01T09:00:00Z' },
                                { user_created_at: '2023-07-03T14:30:00Z' },
                                { user_created_at: '2023-07-05T11:45:00Z' },
                                { user_created_at: '2023-07-08T17:15:00Z' },
                                { user_created_at: '2023-07-12T10:00:00Z' },
                                { user_created_at: '2023-07-17T15:30:00Z' },
                                { user_created_at: '2023-07-20T13:45:00Z' },
                                { user_created_at: '2023-07-23T09:30:00Z' },
                                { user_created_at: '2023-07-26T18:15:00Z' },
                                { user_created_at: '2023-07-29T11:00:00Z' },
                            ]
                        });*/

                        const weeklyData = this.generateWeeklyChartData();
                        this.setState({weeklyVisitorData: weeklyData});


                        const monthlyData = this.generateMonthlyChartData();
                        this.setState({monthlyVisitorData: monthlyData});

                        console.log(weeklyData);
                        console.log(monthlyData);

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


    generateWeeklyChartData = () => {
        const startDate = moment().startOf('week');
        const endDate = moment().endOf('week');
        console.log(startDate.format("DD-MM-YYYY")+" "+endDate.format("DD-MM-YYYY"));


        const weeklyLabels = [];
        const weeklyCounts = [];

        let currentDate = startDate;
        while (currentDate <= endDate) {
            const formattedDate = currentDate.format('dddd');
            weeklyLabels.push(formattedDate);

            const count = this.state.visitors.filter((user) => {
                const userDate = moment(user.user_created_at);
               // return userDate.isSame(currentDate, 'day');

                console.log(userDate.format("DD-MM-YYYY")+" "+currentDate.format("DD-MM-YYYY"));
                return (userDate.format("DD-MM-YYYY")==currentDate.format("DD-MM-YYYY"));
            }).length;

            weeklyCounts.push(count);

            currentDate = currentDate.clone().add(1, 'day');
        }



        return {
            labels: weeklyLabels,
            datasets: [
                {
                    label: 'Weekly User Registrations',
                    data: weeklyCounts,
                    borderColor: "rgba(255, 138, 101,1)",
                    pointBorderColor: "#FFF",
                    pointBackgroundColor: "rgba(255, 138, 101,1)",
                    pointBorderWidth: 2,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 1,
                    pointRadius: 4,
                    fill: true,
                    backgroundColor: this.state.gradientFill,
                    borderWidth: 2,
                },
            ],
        };
    };


    generateMonthlyChartData = () => {
        const startDate = moment().startOf('year');
        const endDate = moment().endOf('year');

        console.log(startDate.format("YYYY-MM-DD")+" "+endDate.format("YYYY-MM-DD"));
        const monthlyLabels = [];
        const monthlyCounts = [];

        let currentDate = startDate;
        while (currentDate <= endDate) {
            const formattedDate = currentDate.format('MMM');
            monthlyLabels.push(formattedDate);


            const count = this.state.visitors.filter((user) => {
                const userDate = moment(user.user_created_at);

                return (userDate.format("MM")==currentDate.format("MM"));

            }).length;


            monthlyCounts.push(count);

            currentDate = currentDate.clone().add(1, 'month');
        }


        return {
            labels: monthlyLabels,
            datasets: [
                {
                    label: 'Monthly User Registrations',
                    data: monthlyCounts,
                    borderColor: "rgba(255, 138, 101,1)",
                    pointBorderColor: "#FFF",
                    pointBackgroundColor: "rgba(255, 138, 101,1)",
                    pointBorderWidth: 2,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 1,
                    pointRadius: 4,
                    fill: true,
                    backgroundColor: this.state.gradientFill,
                    borderWidth: 2,
                },
            ],
        };
    };

    // fetch user for get info of subscriptions

    generateWeeklySubscriptionChartData = () => {
        const startDate = moment().startOf('week');
        const endDate = moment().endOf('week');
        // console.log(startDate.format("DD-MM-YYYY")+" "+endDate.format("DD-MM-YYYY"));


        const weeklyLabels = [];
        const weeklyCounts = [];

        let currentDate = startDate;
        while (currentDate <= endDate) {
            const formattedDate = currentDate.format('dddd');
            weeklyLabels.push(formattedDate);
            
            const count = this.state.subscriptions.filter((user) => {
                // if(user.user_subscription !== ""){
                const userDate = moment(user.planPurchasedAt);
                // return userDate.isSame(currentDate, 'day');
 
                //  console.log(userDate.format("DD-MM-YYYY")+" "+currentDate.format("DD-MM-YYYY"));
                 return (userDate.format("DD-MM-YYYY")==currentDate.format("DD-MM-YYYY"));
            //  }
            }).length;

            weeklyCounts.push(count);

            currentDate = currentDate.clone().add(1, 'day');
        }

       
        return {
            labels: weeklyLabels,
            datasets: [
                {
                    label: 'Weekly User Subscriptions',
                    data: weeklyCounts,
                    borderColor: "rgba(255, 138, 101,1)",
                    pointBorderColor: "#FFF",
                    pointBackgroundColor: "rgba(255, 138, 101,1)",
                    pointBorderWidth: 2,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 1,
                    pointRadius: 4,
                    fill: true,
                    backgroundColor: this.state.gradientFill,
                    borderWidth: 2,
                },
            ],
        };
    };

    generateMonthlySubSciberChartData = () => {
        const startDate = moment().startOf('year');
        const endDate = moment().endOf('year');

        console.log(startDate.format("YYYY-MM-DD")+" "+endDate.format("YYYY-MM-DD"));
        const monthlyLabels = [];
        const monthlyCounts = [];

        let currentDate = startDate;
        while (currentDate <= endDate) {
            const formattedDate = currentDate.format('MMM');
            monthlyLabels.push(formattedDate);

            const count = this.state.subscriptions.filter((user) => {
            //    if(user.user_subscription !== ""){
                const userDate = moment(user.planPurchasedAt);

                return (userDate.format("MM")==currentDate.format("MM"));
            //    }

            }).length;


            monthlyCounts.push(count);

            currentDate = currentDate.clone().add(1, 'month');
        }


        return {
            labels: monthlyLabels,
            datasets: [
                {
                    label: 'Monthly User Subscriptions',
                    data: monthlyCounts,
                    borderColor: "rgba(255, 138, 101,1)",
                    pointBorderColor: "#FFF",
                    pointBackgroundColor: "rgba(255, 138, 101,1)",
                    pointBorderWidth: 2,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 1,
                    pointRadius: 4,
                    fill: true,
                    backgroundColor: this.state.gradientFill,
                    borderWidth: 2,
                },
            ],
        };
    };

    changeSubscriptionFilter = (type) => {

        this.setState({subscriptionChartType: type});
    }
    fetchUsers = () => {
        try {

            // makeProtectedRequest('/fetchUsers', 'GET', {})
            //     .then((response) => {
            //         // Handle successful response
                    

            //         if (response.success) {
            //             console.log(">>", response.data)
            //             this.setState({subscriptions: response.data});
            //             const weeklyData = this.generateWeeklySubscriptionChartData();
            //             this.setState({weeklySubscriptionData: weeklyData});


            //             const monthlyData = this.generateMonthlySubSciberChartData();
            //             this.setState({monthlySubscriptionData: monthlyData});

            //             console.log("weeklyData", weeklyData);
            //             console.log("monthlyData", monthlyData);


            //         } else {

            //         }

            //     })
            //     .catch((error) => {
            //         // Handle error
            //         console.error(error);
            //     });
//  subscription
        makeProtectedRequest('/subscription', 'GET', {})
        .then((response) => {
            // Handle successful response
            console.log(">>", response.data)

            if (response.success) {
                // console.log(">>", response)
                                        console.log(">>", response.data)
                        this.setState({subscriptions: response.data});
                        const weeklyData = this.generateWeeklySubscriptionChartData();
                        this.setState({weeklySubscriptionData: weeklyData});


                        const monthlyData = this.generateMonthlySubSciberChartData();
                        this.setState({monthlySubscriptionData: monthlyData});

                        console.log("weeklyData", weeklyData);
                        console.log("monthlyData", monthlyData);
            }})


        } catch (error) {
            // this.setState({message: 'Error logging in'});

        }
    }

    render() {


        const {weeklyVisitorData, visitorChartType, monthlyVisitorData, subscriptionChartType, monthlySubscriptionData, weeklySubscriptionData} = this.state;
        return (
            <div>
                <div className="content">
                    <Row>
                        <Col xs={12} md={12}>

                            <div className="page-title">
                                <div className="float-left">
                                    <h1 className="title">Subscriptions</h1>
                                </div>
                            </div>

                            <div className="clearfix"></div>


                            <div className="row margin-0">

                                <div className="col-12 col-lg-12 col-xl-12 col-md-12">
                                    <section className="box ">
                                        <header className="panel_header">
                                            <h2 className="title float-left">Overview</h2>


                                        </header>
                                        <div className="content-body">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div>
                                                        <Nav tabs>
                                                            <NavItem>
                                                                <NavLink
                                                                    className={classnames({active: this.state.activeMarketTab === '1'})}
                                                                    onClick={() => {
                                                                        this.toggleMarketTabs('1');
                                                                    }}
                                                                >
                                                                    <i className="fa fa-user-plus"></i> New Visitors
                                                                </NavLink>
                                                            </NavItem>
                                                            <NavItem>
                                                                <NavLink
                                                                    className={classnames({active: this.state.activeMarketTab === '2'})}
                                                                    onClick={() => {
                                                                        this.toggleMarketTabs('2');
                                                                    }}
                                                                >
                                                                    <i className="fa fa-money"></i> New Subscriptions
                                                                </NavLink>
                                                            </NavItem>

                                                        </Nav>
                                                        <TabContent activeTab={this.state.activeMarketTab}>
                                                            <TabPane tabId="1">

                                                                <Row>
                                                                    <Col sm={"12"}>
                                                                        <Dropdown className="mt-3 float-right"

                                                                                  isOpen={this.state.dropdownVisitorOpen}
                                                                                  toggle={this.toggleVisitorFilter}>
                                                                            <DropdownToggle caret>
                                                                                Filter
                                                                            </DropdownToggle>
                                                                            <DropdownMenu>
                                                                                <DropdownItem
                                                                                    onClick={() => this.changeVisitorFilter("W")}>Weekly</DropdownItem>
                                                                                <DropdownItem
                                                                                    onClick={() => this.changeVisitorFilter("M")}>Monthly</DropdownItem>

                                                                            </DropdownMenu>
                                                                        </Dropdown>
                                                                    </Col>
                                                                    <Col sm="12">

                                                                        <div className="chart-area"
                                                                             style={{height: 400 + 'px'}}>
                                                                            {visitorChartType == "W" ?  <Line ref={this.chartRef}
                                                                                  data={weeklyVisitorData}
                                                                                  options={gradientChartOptionsConfiguration}/>:<Line ref={this.chartRef}
                                                                                                                                      data={monthlyVisitorData}
                                                                                                                                      options={gradientChartOptionsConfiguration}/>}
                                                                            {/*<Line
                                                                                data={dashboardShippedProductsChart.data}
                                                                               />*/}
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </TabPane>
                                                            <TabPane tabId="2">

                                                                <Row>
                                                                    <Col sm={"12"}>
                                                                        <Dropdown className="mt-3 float-right"
                                                                                  isOpen={this.state.dropdownSubscriptionOpen}
                                                                                  toggle={this.toggleSubscriptionFilter}>
                                                                            <DropdownToggle caret>
                                                                                Filter
                                                                            </DropdownToggle>
                                                                            <DropdownMenu>
                                                                                {/* <DropdownItem>Weekly</DropdownItem>
                                                                                <DropdownItem>Monthly</DropdownItem> */}
                                                                                 <DropdownItem
                                                                                    onClick={() => this.changeSubscriptionFilter("W")}>Weekly</DropdownItem>
                                                                                <DropdownItem
                                                                                    onClick={() => this.changeSubscriptionFilter("M")}>Monthly</DropdownItem>

                                                                            </DropdownMenu>
                                                                        </Dropdown>
                                                                    </Col>
                                                                    <Col sm="12">

                                                                        <div className="chart-area"
                                                                             style={{height: 400 + 'px'}}>

                                                                            {/* <Line
                                                                                data={dashboardSubscriptionChart.data}
                                                                                options={dashboardSubscriptionChart.options}/> */}
                                                                                 {subscriptionChartType == "W" ?  <Line ref={this.chartRef}
                                                                                  data={weeklySubscriptionData}
                                                                                  options={gradientChartOptionsConfiguration}/>:<Line ref={this.chartRef}
                                                                                                                                      data={monthlySubscriptionData}
                                                                                                                                      options={gradientChartOptionsConfiguration}/>}
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </TabPane>

                                                        </TabContent>
                                                    </div>


                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>


                            </div>


                        </Col>

                    </Row>
                </div>
            </div>
        );
    }
}

export default Subscriptions;
