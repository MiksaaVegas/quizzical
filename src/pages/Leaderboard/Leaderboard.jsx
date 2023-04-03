import { useEffect, useState } from "react"
import { fetchUsers, getUserById, log } from "../../exports"
import { Link, useNavigate } from "react-router-dom"
import Loading from "../../components/Loading/Loading"
import './Leaderboard.css'
import LeaderboardItem from "../../components/LeaderboardItem/LeaderboardItem"

export default function Leaderboard({loggedUser, loggedUserId}){
  const navigate = useNavigate()

  // States
  const [loggedUserData, setLoggedUserData] = useState(null)
  const [listMarkup, setListMarkup] = useState(null)

  // Revoking access for non-logged users
  useEffect(() => {
    if(!loggedUser) navigate('/')

    if(loggedUser && loggedUserId) 
      getUserById(loggedUserId).then(data => 
        setLoggedUserData(data)
      )
  }, [loggedUserId])

  // Sorting the top players
  useEffect(() => {
    fetchUsers().then(data => {
      setListMarkup(data.sort((a, b) => {
        if(a.trophies - b.trophies > 0) return -1
        else if(b.trophies - a.trophies > 0) return 1
        
        return 0
      }).map((item, index) => (
        index < 10 ? <Link to={`/profile/${item.id}`}>
          <LeaderboardItem 
            key={index}
            order={index + 1}
            name={item.username}
            points={item.trophies}
          />
        </Link> : ''
      )))
    }).catch(error => {
      navigate('/notfound', {
        replace: true,
        state: error
      })
    })
  }, [])

  return (
    loggedUserData ? 
      <section className="leaderboard">
        {
          loggedUserData.level < 6 ?
          <div className="leaderboard-locked">
            <h1>Reach level 6 to unlock the leaderboard!</h1>
          </div> : 
          <div className="leaderboard-heading">
            <h1>Battle for Supremacy</h1>
            <p className="leaderboard-subtitle">
              Show Your Skills, Top the Scoreboard, and Fight for Glory! ⚔
            </p>
            {listMarkup || <Loading />}
          </div>
        }
      </section>
    : <Loading />
  )
}