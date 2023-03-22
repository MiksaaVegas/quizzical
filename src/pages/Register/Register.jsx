import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import { Link, useNavigate } from 'react-router-dom'
import { log, APILink, fetchUsers } from '../../exports'
import './Register.css'

export default function Register({loggedUser}){
  const navigate = useNavigate()
  
  // Revoking access to the page for logged users
  useEffect(() => {
    if(loggedUser) navigate('/')
  }, [])

  // States
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    repeatPW: '',
  })
  const [errors, setErrors] = useState({
    username: [],
    password: [],
    repeatPW: [],
  })
  const [registerSuccessful, setRegisterSuccessful] = useState(false)

  // Form input validation
  const validateForm = async () => {
    const newErrors = {
      username: [],
      password: [],
      repeatPW: [],
    }
    const usersData = await fetchUsers().catch(error => {
      navigate('/', {
        state: error,
        replace: true,
      })
    })

    for(const field in formData) {
      if(formData[field].length < 8)
        newErrors[field].push(<p key={nanoid()} className='form-error'>
          Please insert at least 8 characters!
        </p>)

      if(formData[field].length > 32)
        newErrors[field].push(<p key={nanoid()} className='form-error'>
          Please insert at least 32 characters!
        </p>)

      if(!/^[a-zA-Z0-9]*$/.test(formData[field]))
        newErrors[field].push(<p key={nanoid()} className='form-error'>
          Alphanumeric characters only!
        </p>)
    }

    if(formData.password !== formData.repeatPW){
      newErrors.password.push(<p key={nanoid()} className='form-error'>
        Passwords don't match!
      </p>)
      newErrors.repeatPW.push(<p key={nanoid()} className='form-error'>
        Passwords don't match!
      </p>)
    }

    for (const user of usersData) {
      if(user.username == formData.username)
        newErrors.username.push(<p key={nanoid} className='form-error'>
          Username is already taken!
        </p>)
    }

    setErrors(newErrors)

    for (const field in newErrors)
      if(newErrors[field].length)
        return false
    return true
  }

  // Controling the form inputs
  const handleChange = ({id, value}) => {
    setFormData(oldData => ({
      ...oldData,
      [id]: value
    }))
  }

  // Handling form submission
  const handleSubmission = event => {
    event.preventDefault()

    validateForm().then(isformValid => {
      if(isformValid){
        let data = {
          ...formData,
          token: nanoid() + nanoid(),
          playedGames: [],
          numberOfPlayedGames: 0,
          correctQuestions: 0,
          wrongQuestions: 0,
          questionsPerQuiz: 0,
          timePlayed: {
            minutes: 0,
            seconds: 0
          },
          averageTime: {
            minutes: 0,
            seconds: 0
          },
          efficiency: 0,
          gamesPlayedByCategories: {},
          gamesPlayedByDifficulty: {},
          favoriteCategory: null,
          favoriteDifficulty: null,
        }

        delete data.repeatPW
  
        fetch(`${APILink}users`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(data)
        }).then(response => setRegisterSuccessful(true))
      }
    })
  }

  return (
    <section className="register">
      {
        !registerSuccessful ?
        <div>
          <div className="register-title">
            <h1>Create an Account</h1>
            <p>Sign up to keep track of your played quizzes and compete against other players.</p>
          </div>
          <form onSubmit={handleSubmission}>
            <label htmlFor="username">Username</label>
            <input 
              id='username' 
              type="text"
              value={formData.username}
              onChange={event => handleChange(event.target)}
            />
            {errors.username}
            <label htmlFor="password">Password</label>
            <input 
              id='password' 
              type="text"
              value={formData.password}
              onChange={event => handleChange(event.target)}
            />
            {errors.password}
            <label htmlFor="repeatPW">Confirm Password</label>
            <input 
              id='repeatPW' 
              type="text"
              value={formData.repeatPW}
              onChange={event => handleChange(event.target)}
            />
            {errors.repeatPW}
            <input type="submit" value="Sign Up" />
          </form>
        </div> 
        : 
        <div className='register-successful'>
          <h1>You have successfully registered your account!</h1>
          <p>You can now <Link to='/login' replace>log in</Link>.</p>
        </div>
      }
    </section>
  )
}