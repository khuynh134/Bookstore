import './Profile.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({ name: '', email: '', address: ''});
    const [fetchError, setFetchError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showEdit, setShowEdit] = useState(false); 
    const [form, setForm] = useState({ username: '', email: '', address: '' });
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    const fetchUser = async () => {
        setIsLoading(true);
        setFetchError(null);

        const token = localStorage.getItem('token');
        if (!token){
            setFetchError('Not signed in - please log in.');
            setIsLoading(false);
            return;
        }

        try{
            console.log('Profile: requesting user profile /auth/profile');
            const response = await axios.get('http://localhost:8081/auth/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Profile: server responded', response.status, response.data);

            if( response.status !== 200){
                setFetchError('Authentication failed - please log in.');
                setIsLoading(false);
                return;
            }

            const user= response.data?.user;
            if( !user ) {
                setFetchError('No user data returned from server');
                setIsLoading(false);
                return;
            }

            setUserInfo({
                name: user.username || user.name || '',
                email: user.email || '',
                address: user.user_address || user.address || ''
            });
            setIsLoading(false);
        } catch (error) {
             console.error('Profile fetch error:', err, err?.response?.data);
            const serverMsg = err.response?.data?.message || err.response?.data?.detail || err.message;
            setFetchError(`Error fetching profile: ${serverMsg}`);
            setIsLoading(false);
        }
    }; 

    useEffect( () => {
        fetchUser();
    }, []);

    function openEdit() {
        setForm ({ username: userInfo.name, email: userInfo.email, address: userInfo.address });
        setSaveError(null);
        setShowEdit(true);
    }

    function closeEdit() {
        setShowEdit(false);
    }

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        setSaveError(null);

        const token = localStorage.getItem('token');
        if (!token) {
            setSaveError('Not authenticated. Please log in.');
            setSaving(false);
            return;
        }

        try {
            const payload = {
                username: form.username,
                email: form.email,
                user_address: form.address
            };
            const resp = await axios.put('http://localhost:8081/auth/profile', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updated = resp.data?.user;
            if (updated) {
                setUserInfo({
                    name: updated.username || updated.name || '',
                    email: updated.email || '',
                    address: updated.user_address || updated.address || ''
                });
            }
            setShowEdit(false);
        } catch (err) {
            console.error('Error saving profile:', err, err?.response?.data);
            setSaveError(err.response?.data?.message || err.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="profile-page">
            <h1 className="profile-title">{userInfo.name}'s Profile</h1>

            {isLoading ? (
                <div className="profile-loading">Loading profile...</div>
            ) : fetchError ? (
                <div className="profile-error">
                    <p>{fetchError}</p>
                    <button onClick={() => navigate('/login')}>Go to Login</button>
                </div>
            ) : (
                <>
                    <div className="user-info">
                        <h2 className="profile-info-header">User's Information</h2>
                        <div className="info-row">
                            <span className="info-label">UserName :</span>
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
                        <button className="profile-button" onClick={openEdit}>Edit Profile</button>
                    </div>

                    {showEdit && (
                        <div className="modal-backdrop">
                            <div className="modal">
                                <h3>Edit profile</h3>
                                <form onSubmit={handleSave}>
                                    <label className="modal-label">
                                        Username
                                        <input 
                                            value={form.username}
                                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                                        />
                                    </label>
                                    <label className="modal-label">
                                        Email
                                        <input
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        />
                                    </label>
                                    <label className="modal-label">
                                        Address
                                        <input
                                            className="modal-input"
                                            value={form.address}
                                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                                        />
                                    </label>
                                    {saveError && <div className="error">{saveError}</div>}
                                    <div className="modal-actions">
                                        <button className="profile-button" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                                        <button className="profile-button" type="button" onClick={closeEdit}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="user-orders">
                        <h2 className="profile-info-header">User's Orders</h2>
                        
                        <button className="profile-button"
                        onClick={() => navigate('/order-history')}
                        >Order History</button>

                    </div>
                    <div className="reviews-history">
                        <h2 className = "review-info-header">Activity </h2>

                        <button className="review-button"
                        onClick={() => navigate('/review-history')}
                        >My Review History</button>

                    </div>
                </>
            )}
        </div>
    );
}

export default Profile;