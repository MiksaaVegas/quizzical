import { log, efficiencyColor } from '../../exports'
import './GameCard.css'

export default function GameCard(props){
  const {
    date, 
    numOfQuestions, 
    category,
    difficulty, 
    time, 
    correctQuestionsNum, 
    wrongQuestionsNum
  } = props
  const { floor } = Math

    const styles = {
    color: efficiencyColor(correctQuestionsNum, numOfQuestions),
    textShadow: `0 0 0.25rem ${efficiencyColor(correctQuestionsNum, numOfQuestions)}`
  }

  return (
    <div className='game-card'>
      <h2>
        <span style={styles}>{correctQuestionsNum}</span>/ 
        {numOfQuestions}
      </h2>
      <div className="game-card-info">
        <p>
          <img src="/src/assets/tag.svg" />
          <span title={category}>{category}</span>
        </p>
        <p>
          <img src="/src/assets/hourglass.svg" />
          <span>{time}</span>
        </p>
        <p>
          <img src="/src/assets/bar-chart.svg" />
          <span>{difficulty}</span>
        </p>
        <p>
          <img src="/src/assets/calendar.svg" />
          <span title={date}>{date}</span>
        </p>
      </div>
    </div>
  )
}