export const {log} = console
export const APILink = 'https://63f9ddd9473885d837d3f896.mockapi.io/'

export const fetchUsers = async () => {
  try {
    const response = await fetch(APILink + 'users')
    const data = await response.json()

    if(!response.ok) throw(response.statusText)

    return data
  } catch (errorText) {
    return Promise.reject(errorText)
  }
}

export const getUserById = async id => {
  try {
    const response = await fetch(APILink + 'users/' + id)
    const data = await response.json()
    
    if(!response.ok) throw(response.statusText)

    return data
  } catch (errorText) {
    return Promise.reject(errorText)
  }
}

export const fetchGames = async userId => {
  try{
    const response = await fetch(`${APILink}users/${userId}/games`)
    const data = await response.json()

    if(!response.ok) throw(response.statusText)

    return data
  } catch(errorText){
    return Promise.reject(errorText)
  }
}

export const fetchCategories = async () => {
  try{
    const response = await fetch('https://opentdb.com/api_category.php')
    const data = await response.json()

    if(!response.ok) throw(response.statusText)

    return data.trivia_categories
  } catch(errorText){
    return Promise.reject(errorText)
  }
}

export const efficiencyColor = (value, maxValue) => {
  const percentage = Math.floor(value / maxValue * 100)

  if(percentage <= 10) return '#c20c0c'
  else if(percentage <= 20) return '#c23a0c'
  else if(percentage <= 30) return '#c2670c'
  else if(percentage <= 40) return '#c2b90c'
  else if(percentage <= 50) return '#dceb10'
  else if(percentage <= 60) return '#b8eb10'
  else if(percentage <= 70) return '#8ceb10'
  else if(percentage <= 80) return '#60eb10'
  else if(percentage <= 90) return '#31d111'
  else return '#179c08'
}

export const addXp = (addedXp, prevStats) => {
  let result = {
    xp: 0,
    level: 0,
    xpForLevelUp: 0
  }

  if(prevStats.xp + addedXp >= prevStats.xpForLevelUp){
    result.level = prevStats.level + 1
    result.xp = prevStats.xp + addedXp - prevStats.xpForLevelUp
    result.xpForLevelUp = 30 + result.level ** 2

    dispatchEvent(new CustomEvent('levelUp', {
      detail: result.level
    }))
  } else{
    result = {
      ...prevStats,
      xp: prevStats.xp + addedXp
    }
  }

  return result
}

export const getRankTitle = trophies => {
  if(trophies < 300) return ''
  else if(trophies < 500) return 'Rookie'
  else if(trophies < 800) return 'Novice'
  else if(trophies < 1000) return 'Apprentice'
  else if(trophies < 1300) return 'Learner'
  else if(trophies < 1600) return 'Explorer'
  else if(trophies < 1800) return 'Adventurer'
  else if(trophies < 2200) return 'Enthusiast'
  else if(trophies < 2500) return 'Conoisseur'
  else if(trophies < 2800) return 'Savant'
  else if(trophies < 3000) return 'Expert'
  else if(trophies < 3300) return 'Master'
  else if(trophies < 3600) return 'Grand Master'
  else return 'Quiz Wizard'
}