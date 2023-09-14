import React from 'react';
import {
    Button, Form, FormGroup, Label, Input, FormText, FormFeedback,
    InputGroup, InputGroupAddon, InputGroupText, InputGroupButtonDropdown,
    Row, Col, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

import {} from 'components';

class ManageGroup extends React.Component {

    constructor(props) {
        super(props);

        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.toggleSplit = this.toggleSplit.bind(this);
        this.state = {
            dropdownOpen: false,
            splitButtonOpen: false
        };
    }

    toggleDropDown() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    toggleSplit() {
        this.setState({
            splitButtonOpen: !this.state.splitButtonOpen
        });
    }


    render() {

        return (
            <div>
                <div className="content">
                    <Row>
                        <Col xs={12} md={12}>

                            <div className="page-title">
                                <div className="float-left">
                                    <h1 className="title">Create Admin</h1>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-6">
                                    <section className="box ">
                                        <header className="panel_header">
                                            <h2 className="title float-left">Account Information</h2>

                                        </header>
                                        <div className="content-body">
                                            <div className="row">
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">


                                                    <Form>
                                                        <FormGroup>
                                                            <Label htmlFor="exampleEmail7">Username</Label>
                                                            <Input type="text" name="email" id="exampleEmail7"
                                                                   placeholder=""/>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label htmlFor="exampleEmail7">Email</Label>
                                                            <Input type="email" name="email" id="exampleEmail7"
                                                                   placeholder=""/>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label htmlFor="exampleEmail7">Password</Label>
                                                            <Input type="password" name="email" id="exampleEmail7"
                                                                   placeholder=""/>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label htmlFor="exampleEmail7">Confirm Password</Label>
                                                            <Input type="password" name="email" id="exampleEmail7"
                                                                   placeholder=""/>
                                                        </FormGroup>

                                                        <FormGroup>
                                                            <Label htmlFor="exampleSelect3">Admin Role</Label>
                                                            <Input type="select" name="select" id="exampleSelect3">
                                                                <option>Super Admin</option>
                                                                <option>Sub Admin</option>

                                                            </Input>
                                                        </FormGroup>

                                                        <FormGroup>
                                                            <Label htmlFor="exampleFile1">Admin Access</Label>
                                                            <FormGroup check>
                                                                <Label check>
                                                                    <Input type="checkbox" />{' '}
                                                                    Dashboard
                                                                </Label>
                                                            </FormGroup>
                                                            <FormGroup check>
                                                                <Label check>
                                                                    <Input type="checkbox" />{' '}
                                                                    Susbscriptions
                                                                </Label>
                                                            </FormGroup>
                                                            <FormGroup check>
                                                                <Label check>
                                                                    <Input type="checkbox" />{' '}
                                                                    Banners
                                                                </Label>
                                                            </FormGroup>
                                                            <FormGroup check>
                                                                <Label check>
                                                                    <Input type="checkbox" />{' '}
                                                                    Transsactions
                                                                </Label>
                                                            </FormGroup>
                                                            <FormGroup check>
                                                                <Label check>
                                                                    <Input type="checkbox" />{' '}
                                                                    Feedbacks
                                                                </Label>
                                                            </FormGroup>
                                                            <FormGroup check>
                                                                <Label check>
                                                                    <Input type="checkbox" />{' '}
                                                                    Notifications
                                                                </Label>
                                                            </FormGroup>
                                                            <FormGroup check>
                                                                <Label check>
                                                                    <Input type="checkbox" />{' '}
                                                                    Admins
                                                                </Label>
                                                            </FormGroup>
                                                            <FormGroup check>
                                                                <Label check>
                                                                    <Input type="checkbox" />{' '}
                                                                    Settings
                                                                </Label>
                                                            </FormGroup>
                                                        </FormGroup>




                                                    </Form>


                                                </div>
                                            </div>


                                        </div>
                                    </section>
                                </div>
                                <div className="col-6">
                                    <section className="box ">
                                        <header className="panel_header">
                                            <h2 className="title float-left">Admin Information</h2>

                                        </header>
                                        <div className="content-body">
                                            <div className="row">
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">


                                                    <Form>
                                                        <FormGroup>
                                                            <Label htmlFor="exampleEmail7">Name</Label>
                                                            <Input type="text" name="email" id="exampleEmail7"
                                                                   placeholder=""/>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label htmlFor="exampleEmail7">Address</Label>
                                                            <Input type="text" name="email" id="exampleEmail7"
                                                                   placeholder=""/>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label htmlFor="exampleEmail7">Phone</Label>
                                                            <Input type="text" name="email" id="exampleEmail7"
                                                                   placeholder=""/>
                                                        </FormGroup>

                                                        <FormGroup>
                                                            <Label htmlFor="exampleSelect3">Department</Label>
                                                            <Input type="select" name="select" id="exampleSelect3">
                                                                <option>Management</option>
                                                                <option>Support</option>

                                                            </Input>
                                                        </FormGroup>


                                                        <FormGroup>
                                                            <Label htmlFor="exampleFile1">Profile Image</Label>
                                                            <Input type="file" name="file" id="exampleFile1"/>
                                                            <FormText color="muted">
                                                                This is some placeholder block-level help text for the
                                                                above input.
                                                                It's a bit lighter and easily wraps to a new line.
                                                            </FormText>
                                                        </FormGroup>





                                                        <br/>
                                                        <Button className="float-right">Create</Button>


                                                    </Form>


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

export default ManageGroup;
