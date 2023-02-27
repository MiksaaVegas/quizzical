export const {log} = console
export const APILink = 'https://63f9ddd9473885d837d3f896.mockapi.io/'
export const fetchUsers = async () => {
  const response = await fetch(APILink + 'users')
  const data = await response.json()

  return data
}

// TODO: DODAJ FETCH ZA KATEGORIITE