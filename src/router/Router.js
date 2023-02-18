import React from 'react';
import { Routes , Route } from "react-router-dom";
import Leads from "../pages/Leads";
import Login from '../pages/Login';
import axios from 'axios';

const privateRoute = () => {
    if (!localStorage.getItem("token")) {
        return (window.location = "/login");
    }else{
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    }
};

const routes = () => {

    privateRoute();

    return (
        <Routes>
            <Route exact path='/leads' element={<Leads/>} />
            <Route exact path='/login' element={<Login/>} />
        </Routes>
    )
}

export default routes;