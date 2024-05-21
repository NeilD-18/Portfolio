import {useContext} from 'react'
import { UserContext } from '../../context/userContext'

const Portal = () => {
  
  const {user} = useContext(UserContext)
  
  return (
    <div>
        <h1>Portal Page</h1>
        {!!user && (<p>Hi {user.username}!</p>)}
    </div>
  )
}

export default Portal