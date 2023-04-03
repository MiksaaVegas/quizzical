import { getRankTitle } from '../../exports'
import './LeaderboardItem.css'

export default function LeaderboardItem(props){
  const {order, name, points} = props

  return (
    <div className="leaderboard-item">
      <p>
        <span className='leaderboard-item-place'>{order}. </span> 
        <span className='leaderboard-item-rank'>{getRankTitle(points)}</span>
        <span className='leaderboard-item-name'> {name}</span>
      </p>
      <p>🏆 {Math.floor(points)}</p>
    </div>
  )
}