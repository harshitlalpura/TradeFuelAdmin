import React from 'react';
import {

    Row, Col,
} from 'reactstrap';

import {

} from 'components';

class ViewTransaction extends React.Component{


    render(){

        return (
            <div>
                <div className="content">
                    <Row>
                        <Col xs={12} md={12}>

                    <div className="page-title">
                        <div className="float-left">
                            <h1 className="title">Transaction #43243</h1>
                        </div>
                    </div>






                    <div className="col-xl-12">
                        <section className="box ">
                            <header className="panel_header">
                                <h2 className="title float-left">Transaction Details</h2>

                            </header>
                            <div className="content-body">    <div className="">
                                    <div className="col-12">



                                        <div className="row">
                                            <div className="col-lg-12 col-md-12 col-12 invoice-head">
                                                <div className="">
                                                    <div className="row margin-0">
                                                        <div className="col-12 invoice-title">
                                                            <h2 className="">Order # 12345, 21st Jan 2023</h2>
                                                            <span className="invoice-order"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            <div className="clearfix"></div>
                                            <div className="row invoice-info">


                                            <div className="col-lg-3 col-md-6 invoice-infoblock">
                                                <h4>Payment: Credit Card</h4>
                                                <p>
                                                    Visa **** **** **** 4242<br/>
                                                        jsmith@email.com
                                                </p>
                                            </div>


                                                <div className="col-lg-3 col-md-6 invoice-infoblock">
                                                    <div className="invoice-due">
                                                        <h4>Type: Stock</h4>
                                                        <h2 className="text-primary">Buy</h2>
                                                    </div>

                                                </div>


                                                <div className="col-lg-3 col-md-6 invoice-infoblock">
                                                    <div className="invoice-due">
                                                        <h4>Total Amount:</h4>
                                                        <h2 className="text-primary">$2140.00</h2>
                                                    </div>

                                                </div>
                                        </div>
                                        </div>


                                            <div className="clearfix"></div>
                                            <div className="spacer"></div>
                                            <div className="spacer"></div>

                                        </div>

                                        <div className="row">
                                            <div className="col-12 invoice-summary">
                                                <div className="table-responsive">
                                                    <table className="table table-hover invoice-table">
                                                        <thead>
                                                            <tr>
                                                                <td><h4>SCRIPT</h4></td>
                                                                <td className="text-center"><h4>Price</h4></td>
                                                                <td className="text-center"><h4>Quantity</h4></td>
                                                                <td className="text-right"><h4>Totals</h4></td>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                            <tr>
                                                                <td>ADANI</td>
                                                                <td className="text-center">10</td>
                                                                <td className="text-center">20</td>
                                                                <td className="text-right">200</td>
                                                            </tr>


                                                            <tr>
                                                                <td className="thick-line"></td>
                                                                <td className="thick-line"></td>
                                                                <td className="thick-line text-center"><h4>Subtotal</h4></td>
                                                                <td className="thick-line text-right"><h4>200.00</h4></td>
                                                            </tr>

                                                            <tr>
                                                                <td className="no-line"></td>
                                                                <td className="no-line"></td>
                                                                <td className="no-line text-center"><h4>GST</h4></td>
                                                                <td className="no-line text-right"><h4>8.00</h4></td>
                                                            </tr>
                                                            <tr colspan-4>
                                                                <td className="no-line"></td>
                                                                <td className="no-line"></td>
                                                                <td className="no-line text-center"><h4>Total</h4></td>
                                                                <td className="no-line text-right"><h3 style={{margin:0}} className="text-primary">208.00</h3></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="clearfix"></div><br/>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="col-12 text-center">
                                                <a href="#!" target="_blank" className="btn btn-primary btn-md"><i className="i-printer"></i> &nbsp; Print </a> &nbsp;
                                                <a href="#!" target="_blank" className="btn btn-accent btn-md"><i className="i-paper-plane"></i> &nbsp; Refund </a>
                                            </div>
                                        </div>



                                    </div>
                                </div>
                            </div>
                        </section></div>







                        </Col>

                    </Row>
                </div>
            </div>
        );
    }
}

export default ViewTransaction;
