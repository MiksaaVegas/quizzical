import { log } from '../../exports'
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

  // Choosing color for the answers percentage
  const efficiencyColor = () => {
    const percentage = floor(correctQuestionsNum / numOfQuestions * 100)

    if(percentage <= 20) return '#D62424'
    else if(percentage <= 40) return '#EE5B00'
    else if(percentage <= 60) return '#EEE307'
    else if(percentage <= 80) return '#07C80B'
    else return '#099C27'
  }

  const styles = {
    color: efficiencyColor(),
    textShadow: `0 0 0.25rem ${efficiencyColor()}`
  }

  return (
    <div className='game-card'>
      <h1>
        <span style={styles}>{correctQuestionsNum}</span>/ 
        {numOfQuestions}
      </h1>
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