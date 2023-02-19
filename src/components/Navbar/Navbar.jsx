import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar(props){
  const {log} = console

  // States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleClick = () => {
    setIsMobileMenuOpen(oldState => !oldState)
  }

  return (
    <nav>
      <div className="nav-desktop">
        <Link to='/'>
          <h1>Quizzical!</h1>
        </Link>
        <div className="nav-menu">
          <ul>
            <li>How to play?</li>
            <li>OTDB</li>
            <li>About</li>
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
            <li>How to play?</li>
            <li>OTDB</li>
            <li>About</li>
          </ul>
        </div>
      }
    </nav>
  )
}