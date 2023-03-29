import { log } from "../../exports";
import Confetti from "react-confetti";
import './LevelUp.css'

export default function LevelUp({level, setLevelUpModal}){
  let message
  let {innerWidth, innerHeight} = window

  switch(level){
    case 2: message = 'Unlocked: Statistics! 📊'
    break
    case 3: message = 'Unlocked: New Difficulties! 📈'
    break
    case 4: message = 'Unlocked: Random selections! 🍀'
    break
    case 5: message = 'Unlocked: Daily quiz! ⏳'
    break
    case 6: message = 'Max questions per quiz: 15! ✔'
    break
    default: message = 'Continue to the next conquest! 🔥'
  }

  return (
    <section className="level-up">
      <Confetti width={innerWidth} height={innerHeight} />
      <audio autoPlay={true}>
        <source src="/src/assets/level-up.mp3" type="audio/mpeg" />
      </audio>
      <div className="level-up-modal">
        <img 
          src="/src/assets/close.svg" 
          onClick={() => setLevelUpModal(false)}
        />
        <h1>Well Done👏</h1>
        <p>You've reached a new level!</p>
        <h2>{level}</h2>
        <p>{message}</p>
      </div>
    </section>
  )
}