import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { log, APILink, fetchUsers} from '../../exports'
import './Login.css'

export default function Login({setLoggedUser}){
  const navigate = useNavigate()
  const loggedUserToken = localStorage.getItem('loggedUser')
  
  // Revoking access to the page for logged users
  useEffect(() => {
    if(loggedUserToken) navigate('/')
  }, [])

  // States
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [errors, setErrors] = useState({
    username: [],
    password: [],
  })

  // Contrilling the inputs
  const handleFormChange = ({id, value}) => {
    setFormData(oldData => ({
      ...oldData,
      [id]: value
    }))
  }

  // Logging the user in
  const loginUser = (token, id) => {
    setLoggedUser(token)
    navigate('/profile/' + id)
  }

  // Handling form submission
  const handleSubmission = async event => {
    event.preventDefault()

    const usersData = await fetchUsers()
    let userToken = '', userID

    for (const user of usersData){
      if(user.username == formData.username){
        userToken = user.token
        userID = user.id
        
        if(user.password == formData.password){
          loginUser(userToken, userID)
        } else setErrors({
          username: [],
          password: [<p key={nanoid()} className='form-error'>
            Wrong password!
          </p>]
        })
      }
    }

    if(!userToken) setErrors({
      username: [<p key={nanoid()} className='form-error'>
        Wrong username!
      </p>],
      password: []
    })
  }

  return (
    <section className='login'>
      <div>
        <div className="login-title">
          <h1>Log in to Your Account</h1>
        </div>
        <form onSubmit={handleSubmission}>
          <label htmlFor="username">Username</label>
          <input 
            id='username' 
            type="text"
            value={formData.username}
            onChange={event => handleFormChange(event.target)}
          />
          {errors.username}
          <label htmlFor="password">Password</label>
          <input 
            id='password' 
            type="text"
            value={formData.password}
            onChange={event => handleFormChange(event.target)}
          />
          {errors.password}
          <input type="submit" value="Log In" />
        </form>
      </div> 
    </section>
  )
}