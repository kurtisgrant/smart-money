import classNames from "classnames";
import './Button.scss';

function Button({ children, green, white, onClick }) {

  let btnClass = classNames(
    "button",
    {
       "button--green": green,
       "button--white": white
    }
 );
   
   return (
      <button className={btnClass} onClick={onClick}>
        {children}
      </button>
   );
}

export default Button;