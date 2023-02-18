import React, {useEffect} from 'react';
import { Routes , Route, Navigate } from "react-router-dom";
import Leads from "../pages/Leads";
import Swal from "sweetalert2";
import axios from 'axios';

const privateRoute = () => {
    if (!localStorage.getItem("token")) {
        return (window.location = "/admin/login");
    }else{
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    }
};

const InvalidRoute = () => {

    Swal.fire("FAILED!", "404 Not Found!", "warning");

    console.log("navigate");

    return <Navigate to="/admin/leads"/>
}

const AdminRoutes = () => {

    useEffect(()=>{
        privateRoute();
    }, [])

    return (
        <Routes>
            <Route exact path='/leads' element={<Leads/>} />
            <Route exact path='/*' element={<InvalidRoute/>}/>
        </Routes>
    )
}

export default AdminRoutes;