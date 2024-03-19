import moment from 'moment'; // Example for onSort prop
import React from 'react'; // Import React
//import { render } from 'react-dom'; // Import render method
import Datatable from 'react-bs-datatable'; // Import this package
import {
    Row, Col,
} from 'reactstrap';

import plans from './plans.js'
import {Button} from "../../../components";
import {Link} from "react-router-dom";
import {makeProtectedRequest} from "../api";

const header = [
    {title: 'No', prop: 'plan_no', sortable: false, filterable: false},
    {title: 'Plan', prop: 'plan_name', sortable: true, filterable: true},
    {title: 'Active Subscribers', prop: 'plan_subscribers', sortable: true, filterable: true},
    {title: 'Amount', prop: 'plan_price', sortable: true, filterable: true},
    {title: 'Active Since', prop: 'plan_created_at', sortable: true, filterable: true},
    {title: 'View', prop: 'view', sortable: false, filterable: false},
    {title: 'Delete', prop: 'delete', sortable: false, filterable: false},

];


const onSortFunction = {
    date(columnValue) {
        // Convert the string date format to UTC timestamp
        // So the table could sort it by number instead of by string
        return moment(columnValue, 'Do MMMM YYYY').valueOf();
    },
};

const customLabels = {
    first: '<<',
    last: '>>',
    prev: '<',
    next: '>',
    show: 'Display ',
    entries: ' rows',
    noResults: 'There is no data to be displayed',
};

class SubscriptionPlans extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            plans: [],
        };

    }

    componentDidMount() {
        this.fetchPlans();
    }



    openPlan = (id) => {

        const {history} = this.props;
        localStorage.setItem("planId", id)
        history.push('/createplan');

        // history.push('/createplan', {plan_id: id});
    }
    deletePlan = (id) => {

        try {

            makeProtectedRequest('/deletePlan', 'POST', {plan_id: id})
                .then((response) => {
                    // Handle successful response


                    if (response.success) {

                        this.fetchPlans();

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
    fetchPlans = () => {
        try {

            makeProtectedRequest('/fetchAllPlans', 'GET', {})
                .then((response) => {
                    // Handle successful response


                    if (response.success) {

                        this.setState({plans: response.data});

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


    render() {

        const {plans}= this.state;
        return (
            <div>
                <div className="content">
                    <Row>
                        <Col xs={12} md={12}>

                            <div className="page-title">
                                <div className="float-left">
                                    <h1 className="title">Subscription Plans</h1>
                                </div>
                                <div className="float-right">
                                    <Link className="btn btn-primary btn-sm mt-3" to="/createplan">Create Plan</Link>
                                </div>
                            </div>


                            <div className="col-12">
                                <section className="box ">
                                    <header className="panel_header">
                                        <h2 className="title float-left">All Plans</h2>

                                    </header>
                                    <div className="content-body">
                                        <div className="row">
                                            <div className="col-lg-12 dt-disp">

                                                <Datatable
                                                    tableHeader={header}

                                                    tableBody={plans.map((row,index) => ({
                                                        ...row,
                                                        plan_no:(index+1),
                                                        plan_created_at: moment.tz(row.plan_created_at,'UTC').format("DD/MM/YYYY h:mm A"),

                                                        view:         <Button className="btn btn-primary btn-sm" onClick={() => this.openPlan(row._id)}><i
                                                            className="fa fa-eye"></i> </Button>,
                                                        delete:   <Button className="btn btn-primary btn-sm" onClick={() => this.deletePlan(row._id)}><i
                                                            className="fa fa-trash"></i></Button>,
                                                    }))}
                                                    keyName="userTable"
                                                    tableClass="striped table-hover table-responsive"
                                                    rowsPerPage={20}
                                                    rowsPerPageOption={[5, 10, 15, 20]}
                                                    initialSort={{prop: "plan_created_at", isAscending: true}}
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

export default SubscriptionPlans;
