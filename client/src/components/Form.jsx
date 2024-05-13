import React from 'react'
import { styles } from '../styles'

const Form = () => {
  return (
    <div className='bg-gray-900 px-10 py-20 rounded-3xl border border-gray-700'>
        <h1 className={`${styles.heroHeadText} flex justify-center lg:text-[50px] text-white`}>Welcome!</h1>
        <p className='flex font-medium text-lg text-gray-400 justify-center'>Please Enter Your Details</p>

        <div>
            <div>
                <label className='text-lg font-medium text-gray-300'>Username</label>
                <input 
                    className='w-full border border-gray-700 rounded-xl p-4 mt-1 bg-gray-800 text-white'
                    placeholder='Please Enter Your Username'
                 />
            </div>
            <div>
                <label className='text-lg font-medium text-gray-300'>Password</label>
                <input 
                    className='w-full border border-gray-700 rounded-xl p-4 mt-1 bg-gray-800 text-white'
                    placeholder='Please Enter Your Password'
                    type='password'
                 />

            </div>
        </div>
        <div className='mt-8 flex flex-col gap-y-4'>
            <button className='cursor-pointer active:scale-[.98] py-3 rounded-xl bg-violet-700 active:duration-75 transition-all hover:bg-violet-800 text-white text-lg font-bold'>Sign In</button>
        </div>
    </div>
  )
}

export default Form
