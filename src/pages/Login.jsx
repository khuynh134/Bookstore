import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const { login } = useAuth();
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/auth/login', values); //port number is the same port number from server.js port 
                        if(response.status === 200){
                                const token = response.data.token;
                                if (token) {
                                    login(token);
                                }
                                navigate('/profile');
                        }

        } catch (error) { // Handle error outside of status 2xx
            console.log(error);
            if (error.response.data.message){ // alert to show error message from backend
                let message = error.response.data.message;
                if (error.response.data.detail){
                    message += error.response.data.detail;
                }
                alert(message);
            }
        }
    };
    return (
        <div className="register">
            <div className="registerContainer">
                <h2 className="registerTitle">Sign in to your Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-input">
                        <label htmlFor="email">Email:</label>
                        <input type="email" placeholder="Enter email"
                        name="email" value={values.email} onChange={handleChange} />
                    </div>
                    <div className="form-input">
                        <label htmlFor="password">Password:</label>
                        <input type="password" placeholder="Enter password"
                        name="password" value={values.password} onChange={handleChange} />
                    </div>
                    <button className="registerButton" type="submit">
                        Submit
                    </button>
                </form>
                <div className="text-center">
                    <p>Don't have an account?</p>
                    <Link to="/register" className="login-link">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;