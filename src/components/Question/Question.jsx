import './Question.css'

export default function Question({
  id, 
  text, 
  answers, 
  selectedAnswer, 
  questions, 
  setQuestions, 
  isCorrect, 
  correctAnswer}){
  const {log} = console

  // Algorithm for marking answer as selected
  const selectAnswer = answer => {
    if(isCorrect == null){
      setQuestions(oldQuestions => (
        oldQuestions.map(question => {
          if(question.id == id){
            if(question.selectedAnswer == answer)
              return {
                ...question,
                selectedAnswer: null
              }
            return {
              ...question,
              selectedAnswer: answer
            }
          } else return question
        })
      ))
    }
  }

  // Creating markup for the answers
  let answersMarkup = answers.map((answer, index) => {
    let stateClass = ''

    //* isCorrect === null means not answered
    if((isCorrect === null) && (answer == selectedAnswer))
      stateClass = 'answer-selected'
    else if(isCorrect && (answer == selectedAnswer))
      stateClass = 'answer-correct'
    else if(isCorrect === false){
      if(answer == selectedAnswer) stateClass = 'answer-incorrect'
      else if (answer == correctAnswer) stateClass = 'answer-correct'
    }

    return <p 
            key={index}
            className={`answer ${stateClass}`}
            onClick={() => selectAnswer(answers[index])}
          >{answer}
          </p>
  })

  return <div className="question-container">
          <h1 className="question">{text}</h1>
          <div className="answers">
            {answersMarkup}
          </div>
        </div>
}