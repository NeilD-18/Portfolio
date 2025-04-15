import toast from "react-hot-toast";
import axios from "axios";

export const loginUser = async (e, data, navigate, login) => {
    e.preventDefault();
    const { username, password } = data;
    try {
      await login(username, password);
      toast('Login Successful', {
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      navigate('/portal');
    } catch (error) {
      toast(error.message, {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

export const registerUser = async (e, data, navigate ) => {
    e.preventDefault();
    const { username, password } = data;
    try {
      const response = await axios.post('/api/register', { username, password });
      const { data: responseData } = response;

      if (responseData.error) {
        toast(responseData.error,
                {
                icon: '❌',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                }
            ); 
      } 
      
      else {
        setData({ username: '', password: '' });
        toast('Registration Successful',
        {
          icon: '✅',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
        setTimeout(() => {
            navigate('/portal');
        }, 2000);
        
      }
    } catch (error) {
      console.error(error);
      toast("An error occured, please try again",
        {
            icon: '❌',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        }); 
    }
};
  