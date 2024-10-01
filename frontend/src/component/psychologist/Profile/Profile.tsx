import React from 'react';
import './Profile.css'; // Assuming you have a separate CSS file for styling

interface ProfileProps {
  user: {
    name: string;
    profilePicture: string;
  };
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="profile-container">
      <h2 className="profile-name">{user.name}</h2>
      <img src={user.profilePicture} alt="Profile" className="profile-picture" />
      
    </div>
  );
}

export default Profile;
