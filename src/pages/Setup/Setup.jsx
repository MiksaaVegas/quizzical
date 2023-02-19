import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Setup.css'

export default function Setup(){
  const {log} = console
  const {floor, random} = Math
  const navigate = useNavigate()

  // States
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    amount: 10,
    category: '',
    difficulty: '',
    type: ''
  })

  // Fetching the question categories
  useEffect(() => {
    const getCategories = async () => {
      try{
        const response = await fetch('https://opentdb.com/api_category.php')
        const data = await response.json()
        
        if(response.status >= 300) throw(response.status)
        setCategories(data.trivia_categories)
      } catch(code){
        navigate('/notfound', {
          replace: true,
          state: [code, 'It seems like something went wrong. Please try again later']
        })
      }
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

    let selectionID = floor(random() * 3) + 1
    return selectionObject[selectionID]
  }

  const randomType = () => {
    const selectionObject = {
      '1': 'multiple',
      '2': 'boolean'
    }

    let selectionID = floor(random() * 2) + 1
    return selectionObject[selectionID]
  }

  // Storing the form data in state
  const handleFormChange = ({id, value}) => {
    setFormData(oldData => ({
      ...oldData,
      [id]: value
    }))
  }

  // Handling form submission
  const handleSubmission = e => {
    e.preventDefault()
    navigate('/quiz', {replace: true, state: formData})
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
            min='1'
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
        <div>
          <label htmlFor="type">Type</label>
          <select
            id="type" 
            onChange={event => handleFormChange(event.target)}
            value={formData.type}
          >
            <option value="">Any type</option>
            <option value="multiple">Multiple Choice</option>
            <option value="boolean">True/False</option>
            <option value={randomType()}>Random One</option>
          </select>
        </div>
        <input type="submit" value="Generate Quiz" className='setup-submit' />
      </form>
    </section>
  )
}