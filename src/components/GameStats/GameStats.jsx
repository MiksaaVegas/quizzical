import { efficiencyColor } from '../../exports'
import './GameStats.css'

export default function GameStats(props){
  const {
    category, difficulty, date, 
    correctQuestionsNum, wrongQuestionsNum,
    numOfQuestions, time, isLegend
  } = props
  const { floor } = Math
  const classes = isLegend ? 'game-stats-legend' : ''

    const styles = {
    color: efficiencyColor(correctQuestionsNum, numOfQuestions),
    textShadow: `0 0 0.1rem ${efficiencyColor(correctQuestionsNum, numOfQuestions)}`
  }

  return <div className={`game-stats-card ${classes}`}>
    <div className="game-stats-desktop">
      <p className="game-stats-category" title={category}>{category}</p>
      <p className="game-stats-difficulty">{difficulty}</p>
      <p className="game-stats-answers">
        {
          isLegend ? numOfQuestions :
          <>
            <span style={styles}>
              {correctQuestionsNum}
            </span> /&nbsp;
            {numOfQuestions}
          </>
        }
      </p>
      <p className="game-stats-time">{time}</p>
      <p className="game-stats-date" title={date}>{date}</p>
    </div>
    <div className="game-stats-mobile">
      <p className="game-stats-category" title={category}>
        <span>Category</span>
        <span>{category}</span>
      </p>
      <p className="game-stats-difficulty">
        <span>Difficulty</span>
        <span>{difficulty}</span>
      </p>
      <p className="game-stats-answers">
        <span>Answers</span>
        {
          isLegend ? numOfQuestions :
          <span>
            <span style={styles}>
              {correctQuestionsNum}
            </span> /&nbsp;
            {numOfQuestions}
          </span>
        }
      </p>
      <p className="game-stats-time">
        <span>Time</span>
        <span>{time}</span>
      </p>
      <p className="game-stats-date" title={date}>
        <span>Date</span>
        <span>{date}</span>
      </p>
    </div>
  </div>
}