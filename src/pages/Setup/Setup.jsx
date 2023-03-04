import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCategories, log } from '../../exports'
import './Setup.css'

export default function Setup({loggedUser}){
  const {floor, random} = Math
  const navigate = useNavigate()
  
  // Revoking access to the page for non-logged users
  useEffect(() => {
    if(!loggedUser) navigate('/')
  }, [])

  // States
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    amount: 10,
    category: '',
    difficulty: '',
  })

  // Fetching the question categories
  useEffect(() => {
    const getCategories = async () => {
      setCategories(await fetchCategories().catch(error => {
        navigate('/notfound', {
          state: error,
          replace: true,
        })
      }))
    }

    getCategories()
  }, [])

  // Random selections for the random
  // category, difficulty and type
  const randomCategoryId = () => (
    floor(random() * categories.length) + 9
  )

  const randomDifficulty = () => {
    const selectionObject = {
      '1': 'easy',
      '2': 'medium',
      '3': 'hard'
    }

    let selectionId = floor(random() * 3) + 1
    return selectionObject[selectionId]
  }

  // Controling the form inputs
  const handleFormChange = ({id, value}) => {
    setFormData(oldData => ({
      ...oldData,
      [id]: value
    }))
  }

  // Handling form submission
  const handleSubmission = e => {
    e.preventDefault()
    navigate('/quiz', {
      replace: true,
      state: formData
    })
  }

  // Creating markup for the form options
  const categoriesElements = categories.map(({id, name}) => (
    <option key={id} value={id}>{name}</option>
  ))

  return (
    <section className='setup'>
      <div className="setup-title">
        <h1>Set up your quiz!</h1>
        <h2>Choose the settings of your wish.</h2>
      </div>
      <form onSubmit={handleSubmission}>
        <div>
          <label htmlFor="amount">Amount of Questions</label>
          <input 
            type="number" 
            id='amount' 
            max='20' 
            min='5'
            value={formData.amount}
            placeholder='Ex. 10'
            onChange={event => handleFormChange(event.target)}
          />
        </div>
        <div>
          <label htmlFor="category">Category</label>
          <select 
            id="category" 
            onChange={event => handleFormChange(event.target)}
            value={formData.category}
          >
            <option value="">Any Category</option>
            {categoriesElements}
            <option value={randomCategoryId()}>Random One</option>
          </select>
        </div>
        <div>
          <label htmlFor="difficulty">Difficulty</label>
          <select 
            id="difficulty" 
            onChange={event => handleFormChange(event.target)}
            value={formData.difficulty}
          >
            <option value="">Any Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value={randomDifficulty()}>Random One</option>
          </select>
        </div>
        <input type="submit" value="Generate Quiz" className='setup-submit' />
      </form>
    </section>
  )
}