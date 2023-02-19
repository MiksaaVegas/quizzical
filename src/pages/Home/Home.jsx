import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProceedButton from '../../components/ProceedButton/ProceedButton'
import './Home.css'

export default function Home(){
  const {log} = console
  let date = new Date
  date = date.getFullYear()

  // States
  const [homepageStats, setHomepageStats] = useState({
    questions: '4000+',
    categories: '23+'
  })

  // Fetchng the number of questions and categories
  useEffect(() => {
    const getQuestionCount = async () => {
      const response = await fetch('https://opentdb.com/api_count_global.php')
      const data = await response.json()
      if(response.status < 300){
        setHomepageStats(defaultStats => ({
          ...defaultStats,
          questions: data.overall.total_num_of_verified_questions
        }))
      }
    }

    const getCategoriesCount = async () => {
      const response = await fetch('https://opentdb.com/api_category.php')
      const data = await response.json()
      if(response.status < 300){
        setHomepageStats(defaultStats => ({
          ...defaultStats,
          categories: data.trivia_categories.length
        }))
      }
    }

    getQuestionCount()
    getCategoriesCount()
  }, [])

  return (
    <section className="home">
      <div className="home-title">
        <h1>Quizzical!</h1>
        <h2>Take a Quiz of Your Own Choice</h2>
        <h3>
          Featuring {homepageStats.questions} Questions 
          in {homepageStats.categories} Different Categories
        </h3>
      </div>
      <Link to='/setup'>
        <ProceedButton value='Set up your quiz!' />
      </Link>
      <div className="copyright">
        <p>Powered by Mihail Kuzmanoski. All rights reserved &copy; {date}</p>
        <p>Photo by <a href="https://unsplash.com/@emilymorter?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Emily Morter</a> on <a href="https://unsplash.com/photos/8xAA0f9yQnE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></p>
      </div>
    </section>
  )
}