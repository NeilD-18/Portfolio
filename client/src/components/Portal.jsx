// src/components/Portal.jsx
import React, { useContext } from 'react';

import { useAuth } from '../../context/authContext';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Portal = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast('Logout Successful', {
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } catch (error) {
      
      console.error('Failed to logout', error);
      toast('Logout Failed. Try Again', {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  return (
    <div>
      <h1>Welcome to the Portal</h1>
      {!!user && <p>{user.username}</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Portal;