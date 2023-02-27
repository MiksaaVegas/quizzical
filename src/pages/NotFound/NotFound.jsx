import { useLocation } from "react-router-dom"

export default function NotFound(){
  const {log} = console
  // const [code, message] = useLocation().state
  
  return (
    <>
      <h1>Page not found</h1>
      {/* <h1>The Server responded with a status code of {
        typeof(code) == 'number' ? code : 'Unavailable'
      }</h1>
      {message && <p>Description: {message}</p>} */}
    </>
  )
}