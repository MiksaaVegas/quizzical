import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import ProceedButton from "../../components/ProceedButton/ProceedButton";
import { APILink, fetchCategories, getUserById, log } from "../../exports";
import './DailyQuiz.css'

export default function DailyQuiz({loggedUser, loggedUserId}){
  const navigate = useNavigate()
  const {floor, random} = Math
  const date = new Date

  // States
  const [userData, setUserData] = useState(null)
  const [category, setCategory] = useState('')
  const [settings, setSettings] = useState(null)
  const [available, setAvailable] = useState(true)

  // Revoking access for non-logged users
  useEffect(() => {
    if(!loggedUser) navigate('/')
  }, [])

  // Fetching the user data
  useEffect(() => {
    if(loggedUserId)
      getUserById(loggedUserId).then(data => setUserData(data))
  }, [loggedUserId])

  // Fetching the categories
  useEffect(() => {
    fetchCategories().then(data => {
      const randomIndex = floor(random() * data.length)

      setCategory(data[randomIndex])
    })
  }, [])

  // Creating new challenge if needed
  useEffect(() => {
    if(userData && category){
      if(date.getUTCDate() != userData.daily.lastGeneratedOn){
        const randomDifficulty = () => {
          const selectionObject = {
            '1': 'easy',
            '2': 'medium',
            '3': 'hard'
          }
 
          let selectionId = floor(random() * 3) + 1
          return selectionObject[selectionId]
        }

        setSettings({
          amount: floor(random() * 3) + 5,
          category: category,
          difficulty: randomDifficulty()
        })
      } else {
        setSettings({
          amount: userData.daily.amount,
          category: userData.daily.category,
          difficulty: userData.daily.difficulty
        })

        if(date.getUTCDate() == userData.daily.lastPlayedOn)
          setAvailable(false)
      }
    }
  }, [userData, category])

  // Saving the new challenge
  useEffect(() => {
    if(settings) fetch(`${APILink}users/${loggedUserId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        ...userData,
        daily: {
          ...userData.daily,
          ...settings,
          lastGeneratedOn: date.getUTCDate(),
        }
      })
    })
  }, [settings])

  // Starting the challenge
  const handleAccept = () => {
    fetch(`${APILink}users/${loggedUserId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        ...userData,
        daily: {
          ...settings,
          lastGeneratedOn: date.getUTCDate(),
        }
      })
    })

    navigate('/quiz', {
      replace: true,
      state: {
        ...settings,
        category: settings.category.id,
        isDaily: true
      }
    })
  }

  return (
      userData ? (
        userData.level >= 5 ? 
        <section className="daily">
          <h1>Daily Challenge</h1>
          <p>Earn <strong>3x</strong> the XP of a regular Quiz, without affecting your stats!</p>
          <div className="daily-challenge">
            <h2>
              Questions: <span>{settings ? settings.amount : ''}</span>
            </h2>
            <h2>
              Category: <span>{settings ? settings.category.name : ''}</span>
            </h2>
            <h2>
              Difficulty: <span>{settings ? settings.difficulty : ''}</span>
            </h2>
            {
              available ? 
              <ProceedButton value={'Accept Challenge'} whenClicked={handleAccept}/> :
              <h3 className="daily-played">Already played. Stay tuned for the next one!🔥</h3>
            }
          </div>
        </section> : 
        <h1 className="daily-locked">Reach level 5 to unlock the Daily Challenge!</h1>
      ) : <Loading />
  )
}