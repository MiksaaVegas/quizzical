import { useState } from "react"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Loading from "../../components/Loading/Loading"
import Question from "../../components/Question/Question"
import { nanoid } from 'nanoid'
import ProceedButton from "../../components/ProceedButton/ProceedButton"
import { APILink, getUserById, log } from '../../exports'
import './Quiz.css'

export default function Quiz({loggedUser, loggedUserId}){
  const {random} = Math
  const {amount, category, difficulty} = useLocation().state ?? 0
  const databaseAPI = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}`
  const navigate = useNavigate()
  const date = new Date()

  // Revoking access to the page for non-logged users
  useEffect(() => {
    if(!loggedUser) navigate('/')
  }, [])

  // States
  const [questions, setQuestions] = useState(false)
  const [isQuizFinished, setIsQuizFinished] = useState(false)
  const [areAnswersChecked, setAreAnswersChecked] = useState(false)
  const [correctQuestionNum, setCorrectQuestionNum] = useState(0)
  const [wrongQuestionNum, setWrongQuestionNum] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [minutes, setMinutes] = useState(0)

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
            return {
              ...question,
              isCorrect: true
            }
          }
          else {
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
        const minutesPlayed = minutes < 10 ? `0${minutes}` : minutes
        const secondsPlayed = seconds < 10 ? `0${seconds}` : seconds

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
          time: `${minutesPlayed}:${secondsPlayed}`,
          customId: nanoid()
        })
      }).then(response => response.json().then(gameData => {
        getUserById(loggedUserId).then(userData => {
          fetch(`${APILink}users/${loggedUserId}`, {
            method: 'PUT',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({
              ...userData,
              playedGames: [
                ...userData.playedGames, gameData.customId
              ],
              numberOfPlayedGames: Number(userData.numberOfPlayedGames) + 1
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
  }, [areAnswersChecked])

  // Timer
  useEffect(() => {
    setTimeout(() => {
      setSeconds(oldSeconds => {
        if(oldSeconds == 59) {
          setMinutes(oldMinutes => oldMinutes + 1)
          return 0
        }
        else return oldSeconds + 1
      })
    }, 1000)

  }, [seconds])

  return (
    <>
      { questions ?
        <section className="quiz">
          {questionsMarkup}
          <div className="quiz-submit">
            <div className='submit-btn-wrapper'>
              <ProceedButton 
                value='Check Answers' 
                whenClicked={() => setIsQuizFinished(true)}
              />
            </div>
          </div>
        </section> :
        <Loading />
      }
    </>
  )
}