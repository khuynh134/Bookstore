import './Profile.css';
import { useState } from 'react';

function Profile() {
    const [userInfo, setUserInfo] = useState({
        name: 'John Doe',
        email: 'john_doe@email.com',
        address: '1234 Main St, City, Country'
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