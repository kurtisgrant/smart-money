import classNames from "classnames";
import './Button.scss';

function Button({ green, white, onClick }) {

  let btnClass = classNames(
    "button",
    {
       "button--green": green,
       "button--white": white
    }
 );
   
   return (
     <div>
      <button className={btnClass} onClick={onClick}>
        Button
      </button>
      </div>
   );
}

export default Button;