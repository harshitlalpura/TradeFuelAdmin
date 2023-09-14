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

import {makeProtectedDataRequest, makeProtectedRequest, makeRequest} from "../api";


import Chart from "react-apexcharts";
import moment from "moment";


var IMGDIR = process.env.REACT_APP_IMGDIR;

class General extends React.Component {

    componentDidMount() {

        this.loadIndexes();


        /* setInterval( ()=>{

             this.loadIndexes();
         },30000);*/

    }


    loadIndexes = () => {
        this.fetchIndexes();

    }

    componentWillUnmount() {

    }


    fetchIndexes = () => {
        makeProtectedRequest('/fetchCurrentPrice', 'POST', {
            "symbols": "^NSEI,^BSESN,^NSEBANK"
        })
            .then((response) => {
                // Handle successful response
                this.setState({isOpen: false});


                console.log(response);
                if (response.data.success) {


                    for (var i = 0; i < response.data.data.length; i++) {

                        var data = response.data.data[i];


                        /*const series =
                            [{
                                data: intraday.open.map((value, index) => ({
                                    x: this.timeStamp_convertor(intraday.start_Time[index]),
                                    y: [intraday.open[index], intraday.high[index], intraday.low[index], intraday.close[index]]
                                }))
                            }];*/


                        const change = data.change;
                        const percentageChange = data.changesPercentage;
                        const price = data.price;

                        console.log(data);
                        if (data.symbol == "^NSEI") {


                            this.setState({niftyChange: change});
                            this.setState({niftyPrice: price});
                            this.setState({niftyPercentageChange: percentageChange});


                            // this.setState({nifty: series});
                        } else if (data.symbol == "^BSESN") {


                            this.setState({sensexChange: change});
                            this.setState({sensexPrice: price});
                            this.setState({sensexPercentageChange: percentageChange});

                            //   this.setState({sensex: series});
                        } else if (data.symbol == "^NSEBANK") {


                            this.setState({bankNiftyChange: change});
                            this.setState({bankNiftyPrice: price});
                            this.setState({bankNiftyPercentageChange: percentageChange});

                            //   this.setState({banknifty: series});
                        }

                        this.fetchIntradayData(data.symbol);
                    }


                } else {

                }

            })
            .catch((error) => {
                // Handle error
                console.error(error);
            });
    }

    fetchIntradayData = (symbol) => {
        makeProtectedRequest('/fetchIntradayData', 'POST', {
            "symbol": symbol
        })
            .then((response) => {
                // Handle successful response
                this.setState({isOpen: false});


                console.log(response);
                if (response.data.success) {


                    var data = response.data.data;
                    var series =
                        [{
                            data: data.map((value, index) => ({
                                x: new Date(value.date),
                                y: [value.open.toFixed(2), value.high.toFixed(2), value.low.toFixed(2), value.close.toFixed(2)]
                            }))
                        }];

                    if(data.length==0){
                        series=[];
                    }

                    console.log(series);
                    if (symbol == "^NSEI") {

                        this.setState({nifty: series});

                    } else if (symbol == "^BSESN") {

                        this.setState({sensex: series});

                    } else if (symbol == "^NSEBANK") {

                        this.setState({banknifty: series});
                    }

                } else {

                }

            })
            .catch((error) => {
                // Handle error
                console.error(error);
            });
    }

    constructor(props) {
        super(props);
        this.state = {

            niftyPrice: 0,
            niftyChange: 0,
            niftyPercentageChange: 0,

            sensexPrice: 0,
            sensexChange: 0,
            sensexPercentageChange: 0,


            bankNiftyPrice: 0,
            bankNiftyChange: 0,
            bankNiftyPercentageChange: 0,

            options: {
                chart: {
                    id: "basic-bar",

                    zoom: false, // Set zoom to false to hide the controls

                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        formatter: function (value) {
                            // Format the timestamp to local datetime string
                            const date = new Date(value);

                            // Extract time components
                            const hours = date.getHours();
                            const minutes = date.getMinutes();
                            const seconds = date.getSeconds();

                            // Format time as HH:mm:ss
                            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                        },
                    },
                },
                yaxis: {
                    tooltip: {
                        enabled: true
                    }
                }
            },


            nifty: [],
            sensex: [],
            banknifty: [],

            series: [],

            dropdownGainersOpen: false,
            dropdownLosersOpen: false,

            activeMarketTab: '1',

        };
    }

    toggleMarketTabs = (tab) => {
        if (this.state.activeMarketTab !== tab) {
            this.setState({
                activeMarketTab: tab
            });
        }
    }

    toggleGainerFilter = () => {
        this.setState(prevState => ({
            dropdownGainersOpen: !prevState.dropdownGainersOpen
        }));
    }

    toggleLoserFilter = () => {
        this.setState(prevState => ({
            dropdownLosersOpen: !prevState.dropdownLosersOpen
        }));
    }

    render() {


        return (
            <div>
                <div className="content">
                    <Row>
                        <Col xs={12} md={12}>

                            <div className="page-title">
                                <div className="float-left">
                                    <h1 className="title">Dashboard</h1>
                                </div>
                            </div>

                            <div className="clearfix"></div>

                            <div className="row margin-0">

                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                                    <a href="#" onClick={() => {
                                        this.toggleMarketTabs('1');
                                    }}>
                                        <div
                                            className={(this.state.activeMarketTab === '1') ? "db_box biggraph_widget centered p-0 marketBoxes selected" : "db_box biggraph_widget centered p-0 marketBoxes"}>
                                            <div className="widdata float-left">
                                                <h4 className="widtitle">Nifty</h4>
                                            </div>

                                            <div className="widdata float-left mt-0">
                                                <h3 className="m-0">{this.state.niftyPrice.toFixed(2)}</h3>

                                                {this.state.niftyPercentageChange < 0 ?
                                                    <h4 className="text-danger mt-0">{this.state.niftyChange.toFixed(2) + " (" + (this.state.niftyPercentageChange * -1).toFixed(2)}%)</h4> :
                                                    <h4 className="text-success mt-0">{"+" + this.state.niftyChange.toFixed(2) + " (" + this.state.niftyPercentageChange.toFixed(2)}%)</h4>}
                                            </div>
                                        </div>
                                    </a>
                                </div>

                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                                    <a href="#" onClick={() => {
                                        this.toggleMarketTabs('2');
                                    }}>
                                        <div
                                            className={(this.state.activeMarketTab === '2') ? "db_box biggraph_widget centered p-0 marketBoxes selected" : "db_box biggraph_widget centered p-0 marketBoxes"}>
                                            <div className="widdata float-left">
                                                <h4 className="widtitle">Sensex</h4>
                                            </div>

                                            <div className="widdata float-left mt-0">
                                                <h3 className="m-0">{this.state.sensexPrice.toFixed(2)}</h3>

                                                {this.state.sensexPercentageChange < 0 ?
                                                    <h4 className="text-danger mt-0">{this.state.sensexChange.toFixed(2) + " (" + (this.state.sensexPercentageChange * -1).toFixed(2)}%)</h4> :
                                                    <h4 className="text-success mt-0">{"+" + this.state.sensexChange.toFixed(2) + " (" + this.state.sensexPercentageChange.toFixed(2)}%)</h4>}
                                            </div>
                                        </div>
                                    </a>
                                </div>

                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                                    <a href="#" onClick={() => {
                                        this.toggleMarketTabs('3');
                                    }}>
                                        <div
                                            className={(this.state.activeMarketTab === '3') ? "db_box biggraph_widget centered p-0 marketBoxes selected" : "db_box biggraph_widget centered p-0 marketBoxes"}>
                                            <div className="widdata float-left">
                                                <h4 className="widtitle">Bank Nifty</h4>
                                            </div>

                                            <div className="widdata float-left mt-0">
                                                <h3 className="m-0">{this.state.bankNiftyPrice.toFixed(2)}</h3>

                                                {this.state.bankNiftyPercentageChange < 0 ?
                                                    <h4 className="text-danger mt-0">{this.state.bankNiftyChange.toFixed(2) + " (" + (this.state.bankNiftyPercentageChange * -1).toFixed(2)}%)</h4> :
                                                    <h4 className="text-success mt-0">{"+" + this.state.bankNiftyChange.toFixed(2) + " (" + this.state.bankNiftyPercentageChange.toFixed(2)}%)</h4>}
                                            </div>
                                        </div>
                                    </a>
                                </div>

                            </div>

                            <div className="row margin-0">


                                <div className="col-12 col-lg-12 col-xl-12 col-md-12">
                                    <section className="box ">
                                        {/* <header className="panel_header">
                                            <h2 className="title float-left">Market Movements</h2>

                                        </header>*/}
                                        <div className="content-body">

                                            <div className="row">
                                                <div className="col-12">
                                                    <div>
                                                        <br/>
                                                        {/*<Nav tabs>
                                                            <NavItem>
                                                                <NavLink
                                                                    className={classnames({active: this.state.activeMarketTab === '1'})}
                                                                    onClick={() => {
                                                                        this.toggleMarketTabs('1');
                                                                    }}
                                                                >
                                                                    <i className="i-chart"></i> NIFTY
                                                                </NavLink>
                                                            </NavItem>
                                                            <NavItem>
                                                                <NavLink
                                                                    className={classnames({active: this.state.activeMarketTab === '2'})}
                                                                    onClick={() => {
                                                                        this.toggleMarketTabs('2');
                                                                    }}
                                                                >
                                                                    <i className="i-chart"></i> SENSEX
                                                                </NavLink>
                                                            </NavItem>
                                                            <NavItem>
                                                                <NavLink
                                                                    className={classnames({active: this.state.activeMarketTab === '3'})}
                                                                    onClick={() => {
                                                                        this.toggleMarketTabs('3');
                                                                    }}
                                                                >
                                                                    <i className="i-chart"></i> BANK NIFTY
                                                                </NavLink>
                                                            </NavItem>
                                                        </Nav>*/}
                                                        <TabContent className="border-0"
                                                                    activeTab={this.state.activeMarketTab}>
                                                            <TabPane tabId="1">
                                                                <Row>
                                                                    <Col sm="12">
                                                                        <Chart
                                                                            options={this.state.options}
                                                                            series={this.state.nifty}
                                                                            type="candlestick"
                                                                            width="100%"
                                                                            height="400"
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </TabPane>
                                                            <TabPane tabId="2">
                                                                <Row>
                                                                    <Col sm="12">
                                                                        <Chart
                                                                            options={this.state.options}
                                                                            series={this.state.sensex}
                                                                            type="candlestick"
                                                                            width="100%"
                                                                            height="400"
                                                                        />
                                                                    </Col>

                                                                </Row>
                                                            </TabPane>
                                                            <TabPane tabId="3">
                                                                <Row>
                                                                    <Col sm="12">
                                                                        <Chart
                                                                            options={this.state.options}
                                                                            series={this.state.banknifty}
                                                                            type="candlestick"
                                                                            width="100%"
                                                                            height="400"
                                                                        />
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

                                <div className="col-12 col-lg-6 col-xl-6 col-md-12 col-sm-12">
                                    <section className="box ">
                                        <header className="panel_header">
                                            <h2 className="title float-left">Top Gainers</h2>

                                            <Dropdown className="mt-3 float-right"
                                                      isOpen={this.state.dropdownGainersOpen}
                                                      toggle={this.toggleGainerFilter}>
                                                <DropdownToggle caret>
                                                    Filter
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem>Daily</DropdownItem>
                                                    <DropdownItem>Weekly</DropdownItem>
                                                    <DropdownItem>Monthly</DropdownItem>
                                                    <DropdownItem>Quarterly</DropdownItem>
                                                    <DropdownItem>Yearly</DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </header>
                                        <div className="content-body">
                                            <div className="row">
                                                <div className="col-12">

                                                    <Table hover responsive>
                                                        <thead>
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Earnings</th>
                                                            <th>Trades</th>


                                                            <th>Subscription</th>

                                                        </tr>
                                                        </thead>
                                                        <tbody>

                                                        <tr>
                                                            <td className="user-inline-img">
                                                                <img src={IMGDIR + "/images/profile/avatar-5.jpg"}
                                                                     alt="user avatar"
                                                                     className="avatar-image img-inline"/>
                                                                Amanda Oliver
                                                            </td>
                                                            <td>$245,132<Badge color="success">+10.34%</Badge></td>
                                                            <td>76533</td>


                                                            <td>Standard</td>

                                                        </tr>
                                                        <tr>
                                                            <td className="user-inline-img">
                                                                <img src={IMGDIR + "/images/profile/avatar-3.jpg"}
                                                                     alt="user avatar"
                                                                     className="avatar-image img-inline"/>
                                                                Anna Rees
                                                            </td>
                                                            <td>$312,444 <Badge color="success">+9.34%</Badge></td>
                                                            <td>75646</td>


                                                            <td>Premium</td>

                                                        </tr>
                                                        <tr>
                                                            <td className="user-inline-img">
                                                                <img src={IMGDIR + "/images/profile/avatar-8.jpg"}
                                                                     alt="user avatar"
                                                                     className="avatar-image img-inline"/>
                                                                Caroline Quinn
                                                            </td>
                                                            <td>$532,232 <Badge color="success">+8.34%</Badge></td>
                                                            <td>64333</td>


                                                            <td>Standard</td>

                                                        </tr>
                                                        <tr>
                                                            <td className="user-inline-img">
                                                                <img src={IMGDIR + "/images/profile/avatar-9.jpg"}
                                                                     alt="user avatar"
                                                                     className="avatar-image img-inline"/>
                                                                Peter Lee
                                                            </td>
                                                            <td>$133,533 <Badge color="success">+7.34%</Badge></td>
                                                            <td>54567</td>


                                                            <td>Premium</td>

                                                        </tr>
                                                        <tr>
                                                            <td className="user-inline-img">
                                                                <img src={IMGDIR + "/images/profile/avatar-5.jpg"}
                                                                     alt="user avatar"
                                                                     className="avatar-image img-inline"/>
                                                                Amanda Oliver
                                                            </td>
                                                            <td>$245,132 <Badge color="success">+6.34%</Badge></td>
                                                            <td>76533</td>

                                                            <td>Standard</td>

                                                        </tr>
                                                        <tr>
                                                            <td className="user-inline-img">
                                                                <img src={IMGDIR + "/images/profile/avatar-3.jpg"}
                                                                     alt="user avatar"
                                                                     className="avatar-image img-inline"/>
                                                                Anna Rees
                                                            </td>
                                                            <td>$312,444 <Badge color="success">+5.34%</Badge></td>
                                                            <td>75646</td>


                                                            <td>Premium</td>

                                                        </tr>
                                                        <tr>
                                                            <td className="user-inline-img">
                                                                <img src={IMGDIR + "/images/profile/avatar-8.jpg"}
                                                                     alt="user avatar"
                                                                     className="avatar-image img-inline"/>
                                                                Caroline Quinn
                                                            </td>
                                                            <td>$532,232 <Badge color="success">+4.34%</Badge></td>
                                                            <td>64333</td>


                                                            <td>Standard</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="user-inline-img">
                                                                <img src={IMGDIR + "/images/profile/avatar-9.jpg"}
                                                                     alt="user avatar"
                                                                     className="avatar-image img-inline"/>
                                                                Peter Lee
                                                            </td>
                                                            <td>$133,533 <Badge color="success">+3.34%</Badge></td>
                                                            <td>54567</td>


                                                            <td>Premium</td>

                                                        </tr>
                                                        <tr>
                                                            <td className="user-inline-img">
                                                                <img src={IMGDIR + "/images/profile/avatar-8.jpg"}
                                                                     alt="user avatar"
                                                                     className="avatar-image img-inline"/>
                                                                Caroline Quinn
                                                            </td>
                                                            <td>$532,232 <Badge color="success">+2.34%</Badge></td>
                                                            <td>64333</td>


                                                            <td>Standard</td>

                                                        </tr>
                                                        <tr>
                                                            <td className="user-inline-img">
                                                                <img src={IMGDIR + "/images/profile/avatar-9.jpg"}
                                                                     alt="user avatar"
                                                                     className="avatar-image img-inline"/>
                                                                Peter Lee
                                                            </td>
                                                            <td>$133,533 <Badge color="success">+1.34%</Badge></td>
                                                            <td>54567</td>


                                                            <td>Premium</td>

                                                        </tr>

                                                        </tbody>


                                                    </Table>

                                                    <Pagination className=" float-right"
                                                                aria-label="Page navigation example">
                                                        <PaginationItem>
                                                            <PaginationLink previous href="#!"/>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink href="#!">
                                                                1
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink href="#!">
                                                                2
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink href="#!">
                                                                3
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink href="#!">
                                                                4
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink href="#!">
                                                                5
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink next href="#!"/>
                                                        </PaginationItem>
                                                    </Pagination>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>


                                <div className="col-12 col-lg-6 col-xl-6 col-md-12 col-sm-12">
                                    <section className="box ">
                                        <header className="panel_header">
                                            <h2 className="title float-left">Top Losers</h2>

                                            <Dropdown className="mt-3 float-right"
                                                      isOpen={this.state.dropdownLosersOpen}
                                                      toggle={this.toggleLoserFilter}>
                                                <DropdownToggle caret>
                                                    Filter
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem>Daily</DropdownItem>
                                                    <DropdownItem>Weekly</DropdownItem>
                                                    <DropdownItem>Monthly</DropdownItem>
                                                    <DropdownItem>Quarterly</DropdownItem>
                                                    <DropdownItem>Yearly</DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>

                                        </header>
                                        <div className="content-body">
                                            <div className="row">
                                                <div className="col-12">

                                                    <Table hover responsive>
                                                        <thead>
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Earnings</th>
                                                            <th>Trades</th>
                                                            <th>Subscription</th>

                                                        </tr>
                                                        </thead>
                                                        <tbody>

                                                        <tr>
                                                            <td className="user-inline-img">
                                                                <img src={IMGDIR + "/images/profile/avatar-5.jpg"}
                                                                     alt="user avatar"
                                                                     className="avatar-image img-inline"/>
                                                                Amanda Oliver
                                                            </td>
                                                            <td>$245,132 <Badge color="danger">-10.34%</Badge></td>
                                                            <td>76533</td>


                                                            <td>Standard</td>

                                                        </tr>
                                                        <tr>
                                                            <td className="user-inline-img">
                                                                <img src={IMGDIR + "/images/profile/avatar-3.jpg"}
                                                                     alt="user avatar"
                                                                     className="avatar-image img-inline"/>
                                                                Anna Rees
                                                            </td>
                                                            <td>$312,444 <Badge color="danger">-9.34%</Badge></td>
                                                            <td>75646</td>


                                                            <td>Premium</td>

                                                        </tr>
                                                        <tr>
                                                            <td className="user-inline-img">
                                                                <img src={IMGDIR + "/images/profile/avatar-8.jpg"}
                                                                     alt="user avatar"
                                                                     className="avatar-image img-inline"/>
                                                                Caroline Quinn
                                                            </td>
                                                            <td>$532,232 <Badge color="danger">-8.34%</Badge></td>
                                                            <td>64333</td>


                                                            <td>Standard</td>

                                                        </tr>
                                                        <tr>
                                                            <td className="user-inline-img">
                                                                <img src={IMGDIR + "/images/profile/avatar-9.jpg"}
                                                                     alt="user avatar"
                                                                     className="avatar-image img-inline"/>
                                                                Peter Lee
                                                            </td>
                                                            <td>$133,533 <Badge color="danger">-7.34%</Badge></td>
                                                            <td>54567</td>


                                                            <td>Premium</td>

                                                        </tr>
                                                        <tr>
                                                            <td className="user-inline-img">
                                                                <img src={IMGDIR + "/images/profile/avatar-5.jpg"}
                                                                     alt="user avatar"
                                                                     className="avatar-image img-inline"/>
                                                                Amanda Oliver
                                                            </td>
                                                            <td>$245,132 <Badge color="danger">-6.34%</Badge></td>
                                                            <td>76533</td>


                                                            <td>Standard</td>

                                                        </tr>
                                                        <tr>
                                                            <td className="user-inline-img">
                                                                <img src={IMGDIR + "/images/profile/avatar-3.jpg"}
                                                                     alt="user avatar"
                                                                     className="avatar-image img-inline"/>
                                                                Anna Rees
                                                            </td>
                                                            <td>$312,444 <Badge color="danger">-5.34%</Badge></td>
                                                            <td>75646</td>


                                                            <td>Premium</td>

                                                        </tr>
                                                        <tr>
                                                            <td className="user-inline-img">
                                                                <img src={IMGDIR + "/images/profile/avatar-8.jpg"}
                                                                     alt="user avatar"
                                                                     className="avatar-image img-inline"/>
                                                                Caroline Quinn
                                                            </td>
                                                            <td>$532,232 <Badge color="danger">-4.34%</Badge></td>
                                                            <td>64333</td>


                                                            <td>Standard</td>

                                                        </tr>
                                                        <tr>
                                                            <td className="user-inline-img">
                                                                <img src={IMGDIR + "/images/profile/avatar-9.jpg"}
                                                                     alt="user avatar"
                                                                     className="avatar-image img-inline"/>
                                                                Peter Lee
                                                            </td>
                                                            <td>$133,533 <Badge color="danger">-3.34%</Badge></td>
                                                            <td>54567</td>


                                                            <td>Premium</td>

                                                        </tr>
                                                        <tr>
                                                            <td className="user-inline-img">
                                                                <img src={IMGDIR + "/images/profile/avatar-8.jpg"}
                                                                     alt="user avatar"
                                                                     className="avatar-image img-inline"/>
                                                                Caroline Quinn
                                                            </td>
                                                            <td>$532,232 <Badge color="danger">-2.34%</Badge></td>
                                                            <td>64333</td>


                                                            <td>Standard</td>

                                                        </tr>
                                                        <tr>
                                                            <td className="user-inline-img">
                                                                <img src={IMGDIR + "/images/profile/avatar-9.jpg"}
                                                                     alt="user avatar"
                                                                     className="avatar-image img-inline"/>
                                                                Peter Lee
                                                            </td>
                                                            <td>$133,533 <Badge color="danger">-1.34%</Badge></td>
                                                            <td>54567</td>


                                                            <td>Premium</td>

                                                        </tr>

                                                        </tbody>


                                                    </Table>

                                                    <Pagination className=" float-right"
                                                                aria-label="Page navigation example">
                                                        <PaginationItem>
                                                            <PaginationLink previous href="#!"/>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink href="#!">
                                                                1
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink href="#!">
                                                                2
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink href="#!">
                                                                3
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink href="#!">
                                                                4
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink href="#!">
                                                                5
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink next href="#!"/>
                                                        </PaginationItem>
                                                    </Pagination>
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

export default General;
