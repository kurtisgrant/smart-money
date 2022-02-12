import './Button.scss'

function Button({ onClick }) {
   
   return (
     <div>
       <p>..</p>
      <button className="button-1" onClick={onClick}>
        Button
      </button>
      <p>..</p>
      <button className="button-2" onClick={onClick}>
        Button
      </button>
      </div>
   );
}

export default Button;