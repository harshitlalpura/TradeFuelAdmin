import React from 'react';
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from 'perfect-scrollbar';
import {
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

//import { Header, Footer, Sidebar, ChatSidebar } from 'components'

import dashboardRoutes from 'routes/general.jsx';
import customRoutes from "../routes/custom";

var ps;

class LoginPage extends React.Component{
    componentDidMount(){
        if(navigator.platform.indexOf('Win') > -1){
            ps = new PerfectScrollbar(this.refs.mainPanel);
            document.body.classList.toggle("perfect-scrollbar-on");
        }
    }
    componentWillUnmount(){
        if(navigator.platform.indexOf('Win') > -1){
            ps.destroy();
            document.body.classList.toggle("perfect-scrollbar-on");
        }
    }
    componentDidUpdate(e) {
      if(e.history.action === "PUSH"){
        this.refs.mainPanel.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
      }
    }
    render(){
        return (
            <div className="wrapper login_page">

                <div className="main-panel" ref="mainPanel">
                    <Switch>
                        {
                            customRoutes.map((prop,key) => {
                                if(prop.collapse){
                                    return prop.views.map((prop2,key2) => {
                                        return (
                                            <Route path={prop2.path} component={prop2.component} key={key2}/>
                                        );
                                    })
                                }
                                if(prop.redirect)
                                    return (
                                        <Redirect from={prop.path} to={prop.pathTo} key={key}/>
                                    );
                                return (
                                    <Route path={prop.path} component={prop.component} key={key}/>
                                );
                            })
                        }
                    </Switch>
                </div>
            </div>
        );
    }
}

export default LoginPage;
