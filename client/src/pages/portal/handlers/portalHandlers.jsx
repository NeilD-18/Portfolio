import toast from "react-hot-toast";

export const handleLogout = async (logout, navigate) => {
 
  try {
    await logout();
    navigate('/');
    toast('Logout Successful', {
      icon: '✅',
      style: {
        borderRadius: '10px',
        background: '#1c1c1e',
        color: '#fff',
      },
    });
  } catch (error) {
    console.error('Failed to logout', error);
    toast('Logout Failed. Try Again', {
      icon: '❌',
      style: {
        borderRadius: '10px',
        background: '#1c1c1e',
        color: '#fff',
      },
    });
  }
};
