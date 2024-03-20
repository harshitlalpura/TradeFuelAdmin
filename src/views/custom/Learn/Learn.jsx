import moment from 'moment'; // Example for onSort prop
import React from 'react'; // Import React
//import { render } from 'react-dom'; // Import render method
import Datatable from 'react-bs-datatable'; // Import this package
import {
    Row, Col,
} from 'reactstrap';

import {Button} from "../../../components";
import {Link} from "react-router-dom";
import {makeProtectedRequest} from "../api";

const userTimeZone = moment.tz.guess(); // Guess the user's timezone

const header = [
    {title: 'No', prop: 'learn_no', sortable: false, filterable: false},
    {title: 'Title', prop: 'learn_title', sortable: true, filterable: true},
    {title: 'Category', prop: 'learn_category', sortable: true, filterable: true},
    {title: 'Date', prop: 'learn_created_at', sortable: true, filterable: true},
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


class Learn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            learn: [],
        };

    }

    componentDidMount() {

        this.fetchLearn();
    }

    openLearn = (id) => {

        const {history} = this.props;
        localStorage.setItem("learnId", id)
        history.push('/managelearn');

        // history.push('/managelearn', {learn_id: id});
    }
    deleteLearn = (id) => {
        try {

            makeProtectedRequest('/deleteLearn', 'POST', {learn_id: id})
                .then((response) => {
                    // Handle successful response


                    if (response.success) {

                        this.fetchLearn();

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
    fetchLearn = () => {
        try {

            makeProtectedRequest('/fetchAllLearn', 'GET', {})
                .then((response) => {
                    // Handle successful response


                    if (response.success) {

                        this.setState({learn: response.data});

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

        const {learn} = this.state;

        return (
            <div>
                <div className="content">
                    <Row>
                        <Col xs={12} md={12}>

                            <div className="page-title">
                                <div className="float-left">
                                    <h1 className="title">Learn</h1>
                                </div>
                                <div className="float-right">
                                    <Link className="btn btn-primary btn-sm mt-3" to="/managelearn" onClick={()=>localStorage.removeItem("learnId")}>Create
                                        Learn</Link>
                                </div>
                            </div>


                            <div className="col-12">
                                <section className="box ">
                                    <header className="panel_header">
                                        <h2 className="title float-left">All Learn</h2>

                                    </header>
                                    <div className="content-body">
                                        <div className="row">
                                            <div className="col-lg-12 dt-disp">

                                                <Datatable
                                                    tableHeader={header}

                                                    tableBody={learn.map((row,index) => {
                                                        console.log(row);
                                                        return {
                                                        ...row,
                                                        learn_no: (index + 1),
                                                        learn_category: row.learn_category.learn_cat_name,
                                                        learn_created_at: moment.tz(row.learn_created_at,userTimeZone).format("DD/MM/YYYY h:mm A"),

                                                        view: <Button className="btn btn-primary btn-sm"
                                                                      onClick={() => this.openLearn(`${row._id}`)}><i
                                                            className="fa fa-eye"></i></Button>,
                                                        delete: <Button className="btn btn-primary btn-sm"
                                                                        onClick={() => this.deleteLearn(`${row._id}`)}><i
                                                            className="fa fa-trash"></i></Button>
                                                    }})}
                                                    keyName="userTable"
                                                    tableClass="striped table-hover table-responsive"
                                                    rowsPerPage={20}
                                                    rowsPerPageOption={[5, 10, 15, 20]}
                                                    initialSort={{prop: "learn_no", isAscending: true}}
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

export default Learn;
