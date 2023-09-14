import React from 'react';
import {
     Row, Col
} from 'reactstrap';

import {  } from 'components';

import 'font-awesome/css/font-awesome.min.css';
import fontawesome from 'variables/general/fontawesome';

class FontAwesome extends React.Component{
    render(){
        return (
            <div>
                <div className="content">
                    <Row>
                        <Col xs={12} md={12}>

                    <div className="page-title">
                        <div className="float-left">
                            <h1 className="title">Font Awesome Icons</h1>
                        </div>
                    </div>




                    <div className="col-12">
                        <section className="box ">
                            <header className="panel_header">
                                <h2 className="title float-left">Font Awesome</h2>
                                
                            </header>
                            <div className="content-body">
                                <div className="row">
                                    <div className="col-lg-12">
                            



                                    <Row>
                                        {
                                            fontawesome.map((prop,key) => {
                                                return (
                                                    <Col xl={2} lg={3} md={3} sm={4} xs={6} className="font-icon-list" key={key}>
                                                        <div className="ui-faicon">
                                                            <i className={"fa " + prop}></i>
                                                            <p>{prop}</p>
                                                        </div>
                                                    </Col>
                                                );
                                            })
                                        }
                                    </Row>

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

export default FontAwesome;
