import './GameStats.css'

export default function GameStats(props){
  const {
    category, difficulty, date, 
    correctQuestionsNum, wrongQuestionsNum,
    numOfQuestions, time, isLegend
  } = props
  const { floor } = Math
  const classes = isLegend ? 'game-stats-legend' : ''

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
    textShadow: `0 0 0.1rem ${efficiencyColor()}`
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
            <span style={{color: efficiencyColor()}}>
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