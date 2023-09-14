import jwt from 'jsonwebtoken';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { config } from '../../config.js';

// This HOC requires the user to be authenticated to access the component
function requireAuth(Component,access) {
    return function ProtectedComponent(props) {
        const history =   props.history;


        const [authenticated, setAuthenticated] = useState(false);

        useEffect(() => {
            const token = localStorage.getItem('token');

            if (!token) {
                history.push('/login');
            } else {

                try {

                    const payload = jwt.verify(token,config.SECRET_KEY);

                    console.log(payload.admin_access);
                    if(payload.admin_access[access]) {
                        setAuthenticated(true);
                    }else{
                        setAuthenticated(false);
                        localStorage.removeItem("token");
                        history.push('/login');
                    }
                } catch (err) {
                    console.log(err);
                    history.push('/login');
                }
            }
        }, []);

        if (!authenticated) {
            //localStorage.removeItem("token");
            //history.push('/login');
            return null;
        }

        return <Component {...props} />;
    };
}

export default requireAuth;
