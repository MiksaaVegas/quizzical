import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'
import Quiz from './pages/Quiz/Quiz'
import Setup from './pages/Setup/Setup'

export default function App(){
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/setup' element={<Setup />} />
        <Route path='/quiz' element={<Quiz />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}