import React from 'react';
import {
    Row, Col, Alert,
} from 'reactstrap';

import {Button} from 'components';
import {Link} from "react-router-dom";
import {makeRequest} from "./api";
import {success} from "concurrently/dist/src/defaults";

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            admin_email: '',
            admin_password: '',
            message: '',
            success: false,
        };
    }

    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState({[name]: value});
    };

    handleSubmit = () => {
        try {
            const {admin_email, admin_password} = this.state;

            makeRequest('/signin', 'POST', {admin_email, admin_password})
                .then((response) => {
                    // Handle successful response

                    console.log(response);
                    if (response.success) {
                        localStorage.setItem('token', response.data.token);
                        localStorage.setItem('admin_name', response.data.admin_name);
                        localStorage.setItem('admin_profile_image', response.data.admin_profile_image);
                        localStorage.setItem('admin_department', response.data.admin_department);
                        this.setState({message: 'Logged in successfully'});
                        this.setState({success: true});
                        this.props.history.push('/dashboard'); // redirect to home page


                    } else {
                        this.setState({message: response.error.error});
                        this.setState({success: false});
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
        const {admin_email, admin_password, message,success} = this.state;

        return (
            <div>
                <div className="">
                    <Row>
                        <Col xs={12} md={12}>

                            <div className="container-fluid">
                                <div className="login-wrapper row">
                                    <div id="login"
                                         className="login loginpage offset-xl-4 offset-lg-3 offset-md-3 offset-0 col-12 col-md-6 col-xl-4">
                                        <h1><a href="#!" title="Login Page" tabIndex="-1">&nbsp;</a></h1>

                                        <form name="loginform">

                                            {message != "" ? success ? <Alert color="success">
                                                {message}
                                            </Alert> : <Alert color="danger">
                                                {message}
                                            </Alert> : <></>}

                                            <p>
                                                <label htmlFor="user_login">Email or Username<br/>
                                                    <input type="email"
                                                           name="admin_email"
                                                           placeholder="Email"
                                                           value={admin_email}
                                                           onChange={this.handleChange}
                                                           className="form-control"/>
                                                </label>
                                            </p>
                                            <p>
                                                <label htmlFor="user_pass">Password<br/>
                                                    <input type="password"
                                                           name="admin_password"
                                                           placeholder="Password"
                                                           value={admin_password}
                                                           onChange={this.handleChange}
                                                           className="input"
                                                           size="20"/></label>
                                            </p>
                                            <p className="submit">

                                                <input type="button" onClick={this.handleSubmit} name="wp-submit"
                                                       id="wp-submit"
                                                       className="btn btn-accent btn-block" value="Sign In"/>


                                            </p>
                                        </form>

                                        <p id="nav">
                                            <a href="#!" title="Password Lost and Found">Forgot password?</a>
                                        </p>


                                    </div>
                                </div>
                            </div>


                        </Col>

                    </Row>
                </div>
            </div>
        );
    }
}

export default Login;
