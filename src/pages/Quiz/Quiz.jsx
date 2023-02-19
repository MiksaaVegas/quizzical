import { useState } from "react"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Loading from "../../components/Loading/Loading"
import Question from "../../components/Question/Question"
import { nanoid } from 'nanoid'
import ProceedButton from "../../components/ProceedButton/ProceedButton"
import './Quiz.css'

export default function Quiz(){
  const {log} = console
  const {random} = Math
  const {amount, category, difficulty, type} = useLocation().state
  const APILink = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`
  const navigate = useNavigate()

  // States
  const [questions, setQuestions] = useState(false)

  // Fetching the questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(APILink)
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
          replace: true,
          state: [code, error]
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

  // Checking if answers are correct
  const checkAnswers = () => {
    setQuestions(oldQuestions => (
      oldQuestions.map(question => {
        if(question.selectedAnswer == question.correct_answer){
          log(true)
          return {
            ...question,
            isCorrect: true
          }
        }
        else {
          log(false)
          return {
            ...question,
            isCorrect: false
          }
        }
      })
    ))
  }

  return (
    <>
      { questions ?
        <section className="quiz">
          {questionsMarkup}
          <div className="quiz-submit">
            <div className='submit-btn-wrapper'>
              <ProceedButton value='Check Answers' whenClicked={checkAnswers}/>
            </div>
          </div>
        </section> :
        <Loading />
      }
    </>
  )
}