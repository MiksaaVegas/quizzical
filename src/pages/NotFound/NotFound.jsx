import { useLocation } from "react-router-dom"

export default function NotFound(){
  const {log} = console
  const {message} = useLocation().state ?? ''
  
  return (
    <>
      <h1>Runtime error</h1>
      <p>{message}</p>
    </>
  )
}