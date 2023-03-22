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

  if(percentage <= 20) return '#D62424'
  else if(percentage <= 40) return '#EE5B00'
  else if(percentage <= 60) return '#EEE307'
  else if(percentage <= 80) return '#07C80B'
  else return '#099C27'
}