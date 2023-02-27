import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { log } from '../../exports'
import './Navbar.css'

export default function Navbar(props){
  const {loggedUser, setLoggedUser, loggedUserID} = props

  // States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handling menu events
  const handleClick = () => {
    setIsMobileMenuOpen(oldState => !oldState)
  }


  // Logging user out
  const signOutUser = () => {
    alert('Successfully signed out!')
    setLoggedUser('')
  }

  return (
    <nav>
      <div className="nav-desktop">
        <Link to='/'>
          <h1 onClick={() => setIsMobileMenuOpen(false)}>
            Quizzical!
          </h1>
        </Link>
        <div className="nav-menu">
          <ul>
            {
              loggedUser ?
              <>
                <li onClick={() => setIsMobileMenuOpen(false)}>
                  <Link to={`/profile/${loggedUserID}`}>My Profile</Link>
                </li>
                <li onClick={signOutUser}>
                  <Link to='/'>Sign Out</Link>
                </li>
              </>
              :
              <>
                <li onClick={() => setIsMobileMenuOpen(false)}>
                  <Link to='/login'>Log in</Link>
                </li>
                <li onClick={() => setIsMobileMenuOpen(false)}>
                  <Link to='/register'>Register</Link>
                </li>
              </>
            }
            <li onClick={() => setIsMobileMenuOpen(false)}>
              <Link to='/'>How to play?</Link>
            </li>
            <li><a href="https://opentdb.com/">OTDB</a></li>
            <li onClick={() => setIsMobileMenuOpen(false)}>
              <Link to='/'>About</Link>
            </li>
          </ul>
          <div className="nav-hamburger">
            <img src="/src/assets/hamburger.svg" onClick={handleClick}/>
          </div>
        </div>
      </div>
      {
        isMobileMenuOpen && 
        <div className="nav-mobile">
          <ul>
            {
              loggedUser ?
              <>
                <li onClick={() => setIsMobileMenuOpen(false)}>
                  <Link to={`/profile/${loggedUserID}`}>My Profile</Link>
                </li>
                <li onClick={signOutUser}>
                  <Link to='/'>Sign Out</Link>
                </li>
              </>
              :
              <>
                <li onClick={() => setIsMobileMenuOpen(false)}>
                  <Link to='/login'>Log in</Link>
                </li>
                <li onClick={() => setIsMobileMenuOpen(false)}>
                  <Link to='/register'>Register</Link>
                </li>
              </>
            }
            <li><Link to='/'>How to play?</Link></li>
            <li><a href="https://opentdb.com/">OTDB</a></li>
            <li><Link to='/'>About</Link></li>
          </ul>
        </div>
      }
    </nav>
  )
}