import { Routes, Route, useNavigate } from 'react-router-dom'
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
import AllGames from './pages/AllGames/AllGames'
import './Form.css'
import About from './pages/About/About'
import DailyQuiz from './pages/DailyQuiz/DailyQuiz'
import LevelUp from './components/LevelUp/LevelUp'

export default function App(){
  const navigate = useNavigate()

  // States
  const [loggedUser, setLoggedUser] = useState(
    localStorage.getItem('loggedUser') || ''
  )
  const [loggedUserId, setLoggedUserId] = useState(0)
  const [levelUpModal, setLevelUpModal] = useState(false)

  // Verifying the user token
  const verifyToken = async () => {
    fetchUsers().then(data => {
      let userFound = false

      for (const user of data) {
        if(user.token == loggedUser){
          userFound = true
          setLoggedUserId(user.id)
        }
      }

      if(!userFound) {
        setLoggedUser('')
        localStorage.setItem('loggedUser', '')
        setLoggedUserId(0)
      }
    }).catch(error => {
      navigate('/notfound', {
        state: error,
        replace: true
      })
    })
    
  }

  useEffect(() => {
    localStorage.setItem('loggedUser', loggedUser)
    addEventListener('storage', verifyToken)

    if(loggedUser) verifyToken()
  }, [loggedUser])

  // The level up notification
  addEventListener('levelUp', e => setLevelUpModal(e.detail))

  return (
    <>
      <Navbar 
        loggedUser={loggedUser} 
        setLoggedUser={setLoggedUser}
        loggedUserId={loggedUserId}
      />
      <Routes>
        <Route path='/' element={<Home loggedUser={loggedUser} />} />
        <Route path='/setup' element={
          <Setup loggedUser={loggedUser} loggedUserId={loggedUserId} />
        } />
        <Route path='/quiz' element={
          <Quiz loggedUser={loggedUser} loggedUserId={loggedUserId}/>
        } />
        <Route path='/register' element={<Register loggedUser={loggedUser} />} />
        <Route path='/login' element={
          <Login setLoggedUser={setLoggedUser} loggedUser={loggedUser} />
        } />
        <Route path='/about' element={<About />} />
        <Route path='/profile/:userId' element={
          <Profile loggedUser={loggedUser} setLoggedUser={setLoggedUser} />
        } />
        <Route path='/allGames/:userId' element={
          <AllGames loggedUser={loggedUser} />
        } />
        <Route path='/daily' element={
          <DailyQuiz loggedUser={loggedUser} loggedUserId={loggedUserId} />
        }/>
        <Route path='*' element={<NotFound />} />
      </Routes>
      {
        levelUpModal ? <LevelUp 
          level={levelUpModal} 
          setLevelUpModal={setLevelUpModal} 
        /> : ''
      }
    </>
  )
}