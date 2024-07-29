import React, { useState } from 'react'
import { styles } from '../../styles'
import axios from 'axios'
import {toast} from 'react-hot-toast';
import { useNavigate } from 'react-router-dom/dist';
import { useAuth } from '../../../context/authContext';

const Form = () => {
    
    const navigate = useNavigate()
    const { login } = useAuth();
    
    const [data, setData]  = useState({
        username: '',
        password: '',
    })
    
    
    const loginUser = async (e) => {
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

    const registerUser = async (e) => {
        e.preventDefault();
        const { username, password } = data;
        try {
          const response = await axios.post('/register', { username, password });
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
      
    
    return (
    <form onSubmit={loginUser}>
        <div className='bg-gray-900 px-10 py-20 rounded-3xl border border-gray-700'>
            <h1 className={`${styles.heroHeadText} flex justify-center lg:text-[50px] text-white`}>Welcome!</h1>
            <p className='flex font-medium text-lg text-gray-400 justify-center'>Please Enter Your Details</p>

            <div>
                <div>
                    <label className='text-lg font-medium text-gray-300'>Username</label>
                    <input 
                        className='w-full border border-gray-700 rounded-xl p-4 mt-1 bg-gray-800 text-white'
                        placeholder='Please Enter Your Username'
                        value={data.username}
                        onChange={(e) => setData({...data, username: e.target.value})}
                    />
                </div>
                <div>
                    <label className='text-lg font-medium text-gray-300'>Password</label>
                    <input 
                        className='w-full border border-gray-700 rounded-xl p-4 mt-1 bg-gray-800 text-white'
                        placeholder='Please Enter Your Password'
                        type='password'
                        value={data.password}
                        onChange={(e) => setData({...data, password: e.target.value})}
                    />

                </div>
            </div>
            <div className='mt-8 flex flex-col gap-y-4'>
                <button type = 'submit' className='cursor-pointer active:scale-[.98] py-3 rounded-xl bg-violet-700 active:duration-75 transition-all hover:bg-violet-800 text-white text-lg font-bold'>Sign In</button>
            </div>
        </div>
    </form>
  )
}

export default Form
