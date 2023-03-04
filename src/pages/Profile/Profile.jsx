import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import GameCard from '../../components/GameCard/GameCard'
import Loading from '../../components/Loading/Loading'
import { fetchCategories, fetchGames, getUserById, log } from '../../exports'
import './Profile.css'

export default function Profile({loggedUser, setLoggedUser}){
  const navigate = useNavigate()
  const previewUserID = useParams().userId
  const numberOfCards = window.innerWidth < 580 ? 3 : 5

  // States
  const [previewUser, setPreviewUser] = useState(null)
  const [gamesHistory, setGamesHistory] = useState(null)

  // Revoking access for non-logged users
  useEffect(() => {
    if(!loggedUser) navigate('/')
  }, [])

  // Fetching the user data
  useEffect(() => {
    getUserById(previewUserID).then(data => {
      setPreviewUser(data)
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
            {
              gamesHistory ?
              <>
                <h1>Recent Games</h1> <br />
                <div className="history-of-games-cards">
                  {gamesHistory}
                  {
                    previewUser.numberOfPlayedGames ? 
                    <Link to={`/allGames/${previewUserID}`}>
                      <div className="game-card game-card-last">
                        <img src="/src/assets/rocket.svg" />
                        <h2>See all</h2>
                      </div>
                    </Link> :
                    <h1>Play some quizzes to prove yourself!</h1>
                  }
                </div>
              </>
              : <Loading />
            }
          </div>
        </>
        : <Loading />
      }
    </section>
  )
}