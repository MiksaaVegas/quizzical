import './ProceedButton.css'

export default function ProceedButton({value, classes, whenClicked}){
  classes ||= ''
  whenClicked ||= function() {}

  return <button 
            className={`proceed-button-initial ${classes}`}
            onClick={whenClicked}
          >
            {value}</button>
}