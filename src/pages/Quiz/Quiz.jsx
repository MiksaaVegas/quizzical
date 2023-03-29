import { useState } from "react"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Loading from "../../components/Loading/Loading"
import Question from "../../components/Question/Question"
import { nanoid } from 'nanoid'
import ProceedButton from "../../components/ProceedButton/ProceedButton"
import { APILink, getUserById, log, fetchCategories, addXp } from '../../exports'
import './Quiz.css'

export default function Quiz({loggedUser, loggedUserId}){
  const {random, floor} = Math
  const {amount, category, difficulty, isDaily} = useLocation().state ?? 0
  const databaseAPI = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}`
  const navigate = useNavigate()
  const date = new Date()
  
  // Revoking access to the page for non-logged users
  // And also for users who already played the quiz
  useEffect(() => {
    if(!loggedUser) navigate('/')
    if(loggedUserId && isDaily) getUserById(loggedUserId).then(userData => {
      if(userData.daily.lastPlayedOn == date.getUTCDate())
        navigate('/')
      else {
        fetch(`${APILink}users/${loggedUserId}`, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            ...userData,
            daily: {
              ...userData.daily,
              lastPlayedOn: date.getUTCDate()
            }
          })
        })
      }
    })
  }, [loggedUserId])

  // Getting the category name
  useEffect(() => {
    fetchCategories().then(results => {
      if(!category) setCategoryName('Any')
  
      for (const result of results) 
        if(category == result.id) setCategoryName(result.name)
    })
  }, [])

  // States
  const [questions, setQuestions] = useState(false)
  const [isQuizFinished, setIsQuizFinished] = useState(false)
  const [areAnswersChecked, setAreAnswersChecked] = useState(false)
  const [correctQuestionNum, setCorrectQuestionNum] = useState(0)
  const [wrongQuestionNum, setWrongQuestionNum] = useState(0)
  const [categoryName, setCategoryName] = useState(null)
  const [seconds, setSeconds] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [xpReward, setXpReward] = useState(0)

  const formattedDate = () => {
    let year = date.getFullYear()
    let month = date.getMonth() + 1 < 10 ?
      `0${date.getMonth() + 1}` : date.getMonth() + 1
    let day = date.getDate() < 10 ?
      `0${date.getDate()}` : date.getDate()
    let hours = date.getHours() < 10 ?
      `0${date.getHours()}` : date.getHours() 
    let mins = date.getMinutes() < 10 ?
      `0${date.getMinutes()}` : date.getMinutes() 

    return `${day}.${month}.${year} ${hours}:${mins}`
  }

  // Fetching the questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(databaseAPI)
        let {response_code, results} = await response.json()

        if(response_code) throw(response_code)

        // Decoding HTML entities
        const textarea = document.createElement('textarea')

        for (let result of results) {
          result.incorrect_answers = result.incorrect_answers.map(answer => {
            textarea.innerHTML = answer
            return textarea.value
          })

          textarea.innerHTML = result.correct_answer
          result.correct_answer = textarea.value

          textarea.innerHTML = result.question
          result.question = textarea.value
        }

        // Adding usefull properties and shuffling the answers
        results = [...results.map(result => ({
          ...result,
          id: nanoid(),
          answers: [
            result.correct_answer, 
            ...result.incorrect_answers
          ].sort(() => random() - 0.5).sort(() => random() - 0.5),
          selectedAnswer: null,
          isCorrect: null
        }))]

        setQuestions(results)

        // Error handling
      } catch (code) {
        let error = ''

        switch(code){
          case 1:
            error = 'Could not return results. The API doesn\'t have enough questions for your query.'
            break
          case 2: 
            error = 'Contains an invalid parameter. Arguements passed in aren\'t valid.'
            break
          case 3:
            error = 'Session Token does not exist.'
            break
          case 4:
            error = 'Token has returned all possible questions for the specified query. Resetting the Token is necessary.'
            break
        }

        navigate('/notfound', {
          state: {message: error},
          replace: true,
        })
      }
    }

    fetchQuestions()
  }, [])

  // Creating markup for the questions
  let questionsMarkup = questions ? questions.map(({
    id, question, answers, selectedAnswer, correct_answer, isCorrect}) => (
    <Question 
      key={id}
      id={id}
      text={question}
      answers={answers}
      selectedAnswer={selectedAnswer}
      correctAnswer={correct_answer}
      isCorrect={isCorrect}
      questions={questions}
      setQuestions={setQuestions}
    />
  )) : null

  // Checking if answers are correct when quiz is finished
  useEffect(() => {
    const checkAnswers = () => {
      setQuestions(oldQuestions => (
        oldQuestions.map(question => {
          if(question.selectedAnswer == question.correct_answer){
            setCorrectQuestionNum(oldNum => oldNum + 1)

            // Counting the XP reward
            switch(question.difficulty){
              case 'easy':
                setXpReward(oldValue => oldValue + 1)
              break
              case 'medium':
                setXpReward(oldValue => oldValue + 2)
              break
              case 'hard':
                setXpReward(oldValue => oldValue + 3)
              break
            }

            if(minutes * 60 + seconds <= amount * 4)
              setXpReward(oldValue => oldValue + 2)

            return {
              ...question,
              isCorrect: true
            }
          } else {
            setWrongQuestionNum(oldNum => oldNum + 1)
            return {
              ...question,
              isCorrect: false
            }
          }
        })
      ))

      setAreAnswersChecked(true)
    }
      
    if(isQuizFinished) checkAnswers()
  }, [isQuizFinished])

  // Saving the game after checking the answers
  useEffect(() => {
    if(isQuizFinished){ 
      if(isDaily){
        getUserById(loggedUserId).then(userData => {
          fetch(`${APILink}users/${loggedUserId}`, {
            method: 'PUT',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({
              ...userData,
              ...addXp(xpReward * 3, {
                xp: userData.xp,
                level: userData.level,
                xpForLevelUp: userData.xpForLevelUp
              })
            })
          })
        })
      } else {
        fetch(`${APILink}users/${loggedUserId}/games`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            questions: questions,
            correctQuestionsNum: correctQuestionNum,
            wrongQuestionsNum: wrongQuestionNum,
            category: category,
            difficulty: difficulty,
            playedAt: formattedDate(),
            time: `${minutes}m:${seconds}s`,
            customId: nanoid()
          })
        }).then(response => response.json().then(gameData => {
          getUserById(loggedUserId).then(userData => {
            const { 
              username, playedGames, numberOfPlayedGames, 
              correctQuestions, wrongQuestions, questionsPerQuiz,
              timePlayed, averageTime, efficiency, gamesPlayedByCategories,
              gamesPlayedByDifficulty, favoriteCategory, favoriteDifficulty,
              xp, level, xpForLevelUp,
            } = userData
  
            // Setter functions for user's new stats
            const newCorrectQuestions = Number(
              correctQuestions) + correctQuestionNum
  
            const newWrongQuestions = Number(
              wrongQuestions) + wrongQuestionNum
  
            const setFavoriteCategory = () => {
              const tempData = {
                ...gamesPlayedByCategories,
                [categoryName]: (
                  gamesPlayedByCategories[categoryName] ?? 0
                ) + 1
              }
              const keys = Object.keys(tempData)
              let temp = tempData[keys[0]]
  
              for (const key of keys) {
                if(temp < tempData[key])
                  temp = key
              }
  
              if(temp == tempData[keys[0]])
                return keys[0]
  
              return temp
            }
  
            const setFavoriteDifficulty = () => {
              const tempData = {
                ...gamesPlayedByDifficulty,
                [difficulty || 'any']: (
                  gamesPlayedByDifficulty[difficulty || 'any'] ?? 0
                ) + 1
              }
              const keys = Object.keys(tempData)
              let temp = tempData[keys[0]]
              
              for (const key of keys) {
                if(temp < tempData[key])
                  temp = key
              }
  
              if(temp == tempData[keys[0]])
                return keys[0]
  
              return temp
            }
  
            const setAverageTime = () => {
              const timeInSeconds = timePlayed.seconds + seconds + 
                (timePlayed.minutes + minutes) * 60
              const averageTimeInSeconds = floor(timeInSeconds / (Number(numberOfPlayedGames) + 1))
              const resultMinutes = floor(averageTimeInSeconds / 60)
              const resultSeconds = averageTimeInSeconds - (resultMinutes * 60)
  
              return {
                minutes: resultMinutes,
                seconds: resultSeconds
              }
            }
  
            const setTimePlayed = () => {
              let resultMinutes, resultSeconds
  
              resultMinutes = timePlayed.minutes + minutes
              if(timePlayed.seconds + seconds > 59){
                resultMinutes++
                resultSeconds = (timePlayed.seconds + seconds) - 60
              } else resultSeconds = timePlayed.seconds + seconds
  
              return {
                minutes: resultMinutes,
                seconds: resultSeconds
              }
            }
  
            // Modifying the user's stats
            fetch(`${APILink}users/${loggedUserId}`, {
              method: 'PUT',
              headers: {
                'Content-type': 'application/json'
              },
              body: JSON.stringify({
                ...userData,
                playedGames: [
                  ...playedGames, gameData.customId
                ],
                numberOfPlayedGames: Number(numberOfPlayedGames) + 1,
                correctQuestions: newCorrectQuestions,
                wrongQuestions: newWrongQuestions,
                efficiency: floor(
                  newCorrectQuestions / (newCorrectQuestions + newWrongQuestions) * 100
                ),
                timePlayed: setTimePlayed(),
                averageTime: setAverageTime(),
                questionsPerQuiz: floor(
                  (correctQuestions + wrongQuestions + questions.length) / 
                  (numberOfPlayedGames + 1)
                ),
                gamesPlayedByCategories: {
                  ...gamesPlayedByCategories,
                  [categoryName]: (
                    gamesPlayedByCategories[categoryName] ?? 0
                  ) + 1
                },
                favoriteCategory: setFavoriteCategory(),
                gamesPlayedByDifficulty: {
                  ...gamesPlayedByDifficulty,
                  [difficulty || 'any']: (
                    gamesPlayedByDifficulty[difficulty || 'any'] ?? 0
                  ) + 1
                },
                favoriteDifficulty: setFavoriteDifficulty(),
                ...addXp(xpReward, {
                  xp: xp,
                  level: level, 
                  xpForLevelUp: xpForLevelUp
                }),
              })
            })
          })
        })).catch(error => {
          navigate('/notfound', {
            state: error,
            replace: true,
          })
        })
      }
    }
  }, [areAnswersChecked])

  // Timer
  useEffect(() => {
    if(!isQuizFinished){
      setTimeout(() => {
        setSeconds(oldSeconds => {
          if(oldSeconds == 59) {
            setMinutes(oldMinutes => oldMinutes + 1)
            return 0
          }
          else return oldSeconds + 1
        })
        return 1
      }, 1000)
    }

  }, [seconds])

  return (
    <>
      { questions ?
        <section className="quiz">
          {questionsMarkup}
          <div className="quiz-submit">
            <div className='submit-btn-wrapper'>
              {
                !isQuizFinished ?
                <ProceedButton 
                  value='Check Answers ✔' 
                  whenClicked={() => setIsQuizFinished(true)}
                /> :
                <ProceedButton 
                  value='Back to Home 🔙' 
                  whenClicked={() => navigate('/')}
                />
              }
            </div>
          </div>
        </section> :
        <Loading />
      }
    </>
  )
}