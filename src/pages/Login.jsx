import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { loginData } from "../utils/fetchFromAPI";
import Swal from "sweetalert2";

const Login = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();

        setErrors({});

        loginData({ 'email': email, 'password': password }).then((res) => {
            if (res?.code === 200) {
                localStorage.setItem('token', res?.data?.token);
                Swal.fire(
                    "Success !",
                    res?.message,
                    "success"
                );
                navigate('/admin/leads')
            }
        }).catch((err) => {
            if (err) {
                if (err?.response?.data?.code === 422) {
                    setErrors({ 
                        'password': err?.response?.data?.errors?.password[0] || '', 'email': err?.response?.data?.errors?.email[0] || ''
                    });
                }
                if (err?.response?.data?.code === 404) {
                    setErrors({ 'email': 'Credentials Doesn\'t Match !' })
                }
            }
        });
    };

    return (
        <>
            <div className="login">
                <div className="container">
                    <div className="row">
                        <div className="col-xxl-4 col-xl-5 col-lg-6 col-md-8 mx-auto">
                            <div className="card">
                                <div className="text-center pt-4">
                                    <h1 className="h4 fw-600">
                                        Login to your account.
                                    </h1>
                                </div>
                                <div className="px-4 py-3 py-lg-4">
                                    <div className='form-wrp'>
                                        <form className="form-default" onSubmit={handleSubmit}>
                                            <div className="form-group mb-3">
                                                <input type="email"  name="email" id="email" className="form-control" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)}/>
                                                {errors?.email ? <span className="text-danger">{errors?.email}</span> : <></>}
                                            </div>
                                            <div className="form-group mb-3">
                                                <input type="password" name="password" id="password" className="form-control" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)}/>
                                                {errors?.password ? <span className="text-danger">{errors?.password}</span> : <></>}
                                            </div>
                                            <div className="text-center">
                                                <button type="submit" className="btn btn-primary btn-block fw-600" onSubmit={handleSubmit}>Login</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;