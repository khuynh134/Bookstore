import './Profile.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
      const fetchUser = async () => {
            const token = localStorage.getItem('token');
            try{
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8081/auth/profile', {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                if(response.status !== 200){
                    navigate('/login');
                }
            } catch (error){
                navigate('/login');
                console.error("Error fetching user profile:", error);
            }
        };
    useEffect(() => {
        fetchUser();
    }, []);
    
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);


    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        address: ''
    });


    return (
        <div className="profile-page">
            <h1 className="profile-title"> User's Profile</h1> 

            <div className="user-info">
            <h2 className="profile-info-header"> User's Information </h2>
                <div className="info-row">
                    <span className="info-label">Name :</span>
                    <span className="info-value">{userInfo.name}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Email :</span>
                    <span className="info-value">{userInfo.email}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Address :</span>
                    <span className="info-value">{userInfo.address}</span>
                </div>
                <button className="edit-profile-button">Edit Profile</button>
            </div>

            <div className="user-orders">
                <h2 className="profile-info-header"> User's Orders </h2>
                <p className="no-orders-message">No orders placed yet.</p>
            </div>
           
        </div>
    );
}

export default Profile;