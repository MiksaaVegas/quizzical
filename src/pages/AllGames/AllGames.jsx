import './AllGames.css'
import { log, getUserById, fetchGames, fetchCategories } from '../../exports'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GameStats from '../../components/GameStats/GameStats'
import Loading from '../../components/Loading/Loading'

export default function AllGames({loggedUser}){
  const previewUser = useParams().userId
  const navigate = useNavigate()

  // States
  const [userData, setUserData] = useState(null)
  const [gamesList, setGamesList] = useState(null)
  const [listMarkup, setListMarkup] = useState(null)
  const [categories, setCategories] = useState(null)

  // Revoking access for non-logged users
  useEffect(() => {
    if(!loggedUser) navigate('/')
  }, [])

  // Fetching user data
  useEffect(() => {
    const asyncFetch = async () => {
      setUserData(await getUserById(previewUser).catch(error => {
        navigate('/notfound', {
          state: error,
          replace: true,
        })
      }))
    }

    asyncFetch()
  }, [])

  // Fetching the games
  useEffect(() => {
    const asyncFetch = async () => {
      setGamesList(await fetchGames(previewUser).catch(error => {
        navigate('/notfound', {
          state: error,
          replace: true,
        })
      }))
    }

    asyncFetch()
  }, [])

  // Fetching the categories
  useEffect(() => {
    const asyncFetch = async () => {
      setCategories(await fetchCategories().catch(error => {
        navigate('/notfound', {
          state: error,
          replace: true,
        })
      }))
    }

    asyncFetch()
  }, [])

  // Generating markup for the games
  useEffect(() => {
    if(gamesList && categories){
      setListMarkup(gamesList.map(game => {
        const {
          category, difficulty, playedAt, id,
          correctQuestionsNum, wrongQuestionsNum,
          questions, time
        } = game
        let gameCategory = 'Not Found -_-'
  
        for (const testingCategory of categories) {
          if (testingCategory.id == category) 
            gameCategory = testingCategory.name
          if (category == '') 
            gameCategory = 'Any'
        }

        return <GameStats
          key={id} 
          category={gameCategory}
          difficulty={difficulty || 'Mixed'}
          date={playedAt}
          correctQuestionsNum={correctQuestionsNum}
          wrongQuestionsNum={wrongQuestionsNum}
          numOfQuestions={questions.length}
          time={time}
        />
      }).reverse())
    }
  }, [gamesList, categories])

  return <section className="all-games">
    <h1 className='all-games-heading'>
      {
        userData ?
        `${userData.username}'s Quizzography` :
        <Loading />
      }
    </h1>
    <div className="all-games-list">
      <GameStats 
        isLegend={true}
        category='Category'
        difficulty='Difficulty'
        date='Played At'
        time='Time Taken'
        numOfQuestions='Result'
      />
      {
        gamesList && categories ?
        listMarkup : <Loading />
      }
    </div>
  </section>
}