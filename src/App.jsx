import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { APILink, log, fetchUsers } from './exports'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'
import Quiz from './pages/Quiz/Quiz'
import Setup from './pages/Setup/Setup'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import Profile from './pages/Profile/Profile'
import '../src/components/Form/Form.css'

export default function App(){
  // States
  const [loggedUser, setLoggedUser] = useState(
    localStorage.getItem('loggedUser') || ''
  )
  const [loggedUserID, setLoggedUserID] = useState(0)

  // Verifying the user token
  const verifyToken = async () => {
    const data = await fetchUsers()
    let userFound = false

    for (const user of data) {
      if(user.token == loggedUser){
        userFound = true
        setLoggedUserID(user.id)
      }
    }

    if(!userFound) {
      setLoggedUser('')
      localStorage.setItem('loggedUser', '')
      setLoggedUserID(0)
    }
  }

  useEffect(() => {
    localStorage.setItem('loggedUser', loggedUser)
    addEventListener('storage', verifyToken)

    if(loggedUser) verifyToken()
  }, [loggedUser])

  return (
    <>
      <Navbar 
        loggedUser={loggedUser} 
        setLoggedUser={setLoggedUser}
        loggedUserID={loggedUserID}
      />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/setup' element={<Setup />} />
        <Route path='/quiz' element={<Quiz />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login setLoggedUser={setLoggedUser}/>} />
        <Route path='/profile/:userID' element={<Profile />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}