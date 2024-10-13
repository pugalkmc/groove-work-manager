// src/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import Header from './components/common/Header';
// import Cookies from 'js-cookie';

const PrivateRoute = () => {
    //   const token = Cookies.get('token');
    const token = localStorage.getItem('token');
    return (
        <>
            <Header />
            {
                token ? (
                    <h5>Hello</h5>
                ) : (
                    <Navigate to="/login" />
                )
            }
        </>
    )

};

export default PrivateRoute;