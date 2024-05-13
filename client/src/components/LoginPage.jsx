import React from 'react'
import Form from './Form'
import { ComputersCanvas } from './canvas'

const LoginPage = () => {
  return (
    <div className='flex w-full h-screen bg-gray-900'>
     
      <div className='w-full flex items-center justify-center lg:w-1/2'>
        <Form />
      </div>
      
      <div className='hidden lg:flex h-full bg-gray-800 w-1/2 items-center justify-center'>
        <ComputersCanvas/>
      </div>
 
    </div>
    
  )
}

export default LoginPage
