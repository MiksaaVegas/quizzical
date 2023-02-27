import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../../components/Loading/Loading'
import { log, fetchUsers } from '../../exports'
import './Profile.css'

export default function Profile(){
  let {userID} = useParams()

  // States
  const [users, setUsers] = useState([])
  const [previewUser, setPreviewUser] = useState({})

  // Fetching the users
  useEffect(() => {
    const asyncFetch = async () => {
      setUsers(await fetchUsers())
    }

    asyncFetch()
  }, [])

  useEffect(() => {
    for (const user of users) {
      if(user.id == userID)
        setPreviewUser(user)
    }
  }, [users])

  return (
    <section className='profile'>
      {
        previewUser.username ? 
        <>
          <h1>Username: {previewUser.username}</h1>
          <p>ID: {previewUser.id}</p>
        </>
        : <Loading />
      }
    </section>
  )
}