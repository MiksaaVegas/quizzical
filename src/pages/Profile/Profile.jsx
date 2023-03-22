import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import GameCard from '../../components/GameCard/GameCard'
import Loading from '../../components/Loading/Loading'
import { efficiencyColor, fetchCategories, fetchGames, getUserById, log } from '../../exports'
import './Profile.css'

export default function Profile({loggedUser, setLoggedUser}){
  const navigate = useNavigate()
  const previewUserID = useParams().userId
  const numberOfCards = window.innerWidth < 580 ? 3 : 5
  
  // States
  const [previewUser, setPreviewUser] = useState(null)
  const [gamesHistory, setGamesHistory] = useState(null)
  const [statsStyles, setStatsStyles] = useState(null)
  const [rotationStyle, setRotationStyle] = useState(null)

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
                difficulty={difficulty || 'Any'}
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
            <h1>{previewUser.username}</h1>
            <p>ID: {previewUser.id}</p>
          </div>
          <div className="history-of-games">
            <h1>Recent Games</h1> <br />
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
            <h1>Statistics</h1>
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
                <p>Time Played: 
                  <span> {
                    `${previewUser.timePlayed.minutes}m ${previewUser.timePlayed.seconds}s`
                  }</span>
                </p>
              </div>
            </div>
          </div>
        </>
        : <Loading />
      }
    </section>
  )
}