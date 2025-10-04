import './Profile.css';
function Profile() {
    return (
        <div className="profile-page">
            <h1 className="profile-title">User Profile</h1>
            <p className="profile-user-info">Name: John Doe</p>
            <p className="profile-user-info">Email: john.doe@example.com</p>
            <p className="profile-user-info">Adress: 1234 Main St, City, County </p>
        </div>
    )
}

export default Profile;