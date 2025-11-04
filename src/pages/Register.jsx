import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import axios from 'axios';

const Register = () => {
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/auth/register', values); //port number is the same port number from server.js port 
            if(response.status === 201){
                navigate('/login');
            }

        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="register">
            <div className="registerContainer">
                <h2 className="registerTitle">Create an Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-input">
                        <label htmlFor="username">Username:</label>
                        <input type="text" placeholder="Enter username"
                        name="username" value={values.username} onChange={handleChange} />
                    </div>
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
                    <p>Already have an account?</p>
                    <Link to="/login" className="login-link">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;