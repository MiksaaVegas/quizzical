import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import GameCard from '../../components/GameCard/GameCard'
import Loading from '../../components/Loading/Loading'
import { efficiencyColor, fetchCategories, fetchGames, getRankTitle, getUserById, log } from '../../exports'
import './Profile.css'

export default function Profile({loggedUser, setLoggedUser}){
  const navigate = useNavigate()
  const previewUserID = useParams().userId
  const numberOfCards = window.innerWidth < 580 ? 3 : 5
  const windowLocation = window.location.href
  const date = new Date
  const {floor} = Math
  
  // States
  const [previewUser, setPreviewUser] = useState(null)
  const [gamesHistory, setGamesHistory] = useState(null)
  const [statsStyles, setStatsStyles] = useState(null)
  const [rotationStyle, setRotationStyle] = useState(null)
  const [xpStyle, setXpStyle] = useState(null)

  // Revoking access for non-logged users
  useEffect(() => {
    if(!loggedUser) navigate('/')
  }, [])

  // Fetching the user data and setting styles
  useEffect(() => {
    getUserById(previewUserID).then(data => {
      setPreviewUser(data)

      setStatsStyles({
        color: efficiencyColor(data.efficiency, 100),
        textShadow: `0 0 0.2rem ${efficiencyColor(data.efficiency, 100)}`
      })

      setRotationStyle({
        rotate: `${data.efficiency * 1.8 + 135}deg`,
        borderTop: `1rem solid ${efficiencyColor(data.efficiency, 100)}`,
        borderRight: `1rem solid ${efficiencyColor(data.efficiency, 100)}`
      })

      setXpStyle({
        backgroundColor: efficiencyColor(data.xp, data.xpForLevelUp),
        boxShadow: `0 0 0.75rem 0.2rem ${efficiencyColor(data.xp, data.xpForLevelUp)}`,
        width: `${Math.floor(100 / data.xpForLevelUp * data.xp)}%`
      })

    }).catch(error => {
      navigate('/notfound', {
        state: error,
        replace: true
      })
    })
  }, [])

  // Creating markup for the played games
  useEffect(() => {
    if(previewUser){
      fetchGames(previewUserID).then(games => {
        fetchCategories().then(categories => {
          setGamesHistory(games.reverse().map((game, index) => {
            const {customId, time, questions, correctQuestionsNum,
               wrongQuestionsNum, difficulty, playedAt, category
            } = game

            if(index < numberOfCards){
              let gameCategory = 'Not Found -_-'
  
              for (const fetchedCategory of categories) {
                if (fetchedCategory.id == category) 
                  gameCategory = fetchedCategory.name
                if (category == '') 
                  gameCategory = 'Any'
              }
  
              return <GameCard
                key={customId}
                time={time}
                numOfQuestions={questions.length}
                correctQuestionsNum={correctQuestionsNum}
                wrongQuestionsNum={wrongQuestionsNum}
                category={gameCategory}
                difficulty={difficulty || 'Mixed'}
                date={playedAt}
              />
            }
          }))
        }).catch(error => {
          navigate('/notfound', {
            state: error,
            replace: true
          })
        })
      }).catch(error => {
        navigate('/notfound', {
          state: error,
          replace: true,
        })
      })
    }
  }, [previewUser])

  return (
    <section className='profile-section'>
      {
        previewUser ?
        <>
          <div className='profile-username'>
            <h1>
              <span>{getRankTitle(previewUser.trophies)} </span>
              {previewUser.username}
            </h1>
            {
              previewUser.level >= 6 && <Link to={'/leaderboard'}>
                <p><span>🏆</span> {floor(previewUser.trophies)}</p>
              </Link>
            }
          </div>
          <div className="level">
            <h2>XP Level {previewUser.level}</h2>
            <p>Level {previewUser.level}</p>
            <div className="xp-bar">
              <div className="xp-progress" style={xpStyle}></div>
            </div>
            <p>Level {previewUser.level + 1}</p>
          </div>
          <div className="profile-share">
            <p>Share profile on 
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${windowLocation}`}
                className='profile-share-facebook'
                target='_blank'
              >
                &nbsp;Facebook
              </a> or 
              <a 
                href={`https://twitter.com/intent/tweet?text=${windowLocation}`}
                className='profile-share-twitter'
                target='_blank'
              >
                &nbsp;Twitter
              </a>
            </p>
          </div>
            {
              previewUser.token == loggedUser && (
                previewUser.level < 5 ?
                <div className="daily-reminder">
                  <h1 className='daily-not-exist'>
                    Daily Quiz! <span>(Reach level 5 to unlock!)</span>
                  </h1>
                </div> :
                previewUser.daily.lastPlayedOn != date.getUTCDate() &&
                <div className="daily-reminder">
                  <Link to='/daily'>
                    <h1 className='daily-exist'>
                      Make sure you earn <span>3x</span> XP in today's Daily Quiz!
                    </h1>
                  </Link>
                </div>
              )
            }
          <div className="history-of-games">
            <h1>Recent Games 🎮</h1>
            <div className="history-of-games-cards">
              {gamesHistory}
              {
                previewUser.numberOfPlayedGames ? 
                <Link to={`/allGames/${previewUserID}`}>
                  <div className="game-card game-card-last">
                    <img src="/src/assets/rocket.svg" />
                    <h3>See all</h3>
                  </div>
                </Link> :
                <div className="game-card game-card-last">
                  <img src="/src/assets/emoji-sad.svg" />
                  <h4>No games</h4>
                </div>
              }
            </div>
          </div>
          <div className="statistics">
            {
              previewUser.level < 2 ?
              (
                previewUser.token == loggedUser ?
                <h1 className='stats-locked'>Reach level 2 to unlock statistics!</h1> :
                <h1 className='stats-locked'>Stats are locked for this user!</h1>
              ) :
              <>
                <h1>Statistics 📈</h1>
                <div className="statistics-panel">
                  <div className="column">
                    <div className="bar-clip">
                      <div className="bar" style={rotationStyle ?? ''}></div>
                    </div>
                    <span style={statsStyles ?? ''}>{previewUser.efficiency}%</span>
                    <p>Efficiency</p>
                  </div>
                  <div className="column">
                    <span>
                      {previewUser.averageTime.minutes}m&nbsp;
                      {previewUser.averageTime.seconds}s
                    </span>
                    <p>Average Time</p>
                  </div>
                  <div className="column">
                    <p>Quizzes played: 
                      <span> {previewUser.numberOfPlayedGames}</span>
                    </p>
                    <p>(Correct) Questions: <span></span>
                      <span>
                        ({previewUser.correctQuestions})&nbsp;
                        {previewUser.correctQuestions + previewUser.wrongQuestions}
                      </span>
                    </p>
                    <p>Questions per Quiz:
                      <span> {previewUser.questionsPerQuiz}</span>
                    </p>
                  </div>
                  <div className="column">
                    <p>Favorite Category:
                      <span> {
                        !previewUser.favoriteCategory ? 'None' 
                        : previewUser.favoriteCategory
                      }</span>
                    </p>
                    <p>Preferred Difficulty:
                      <span> {
                        !previewUser.favoriteDifficulty ? 'None'
                        : previewUser.favoriteDifficulty
                      }</span>
                    </p>
                    <p>Highest rank: 
                      <span> {getRankTitle(previewUser.highestTrophies) || 'None'}</span>
                    </p>
                  </div>
                </div>
              </>
            }
          </div>
        </>
        : <Loading />
      }
    </section>
  )
}