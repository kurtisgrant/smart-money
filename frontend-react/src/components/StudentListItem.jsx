import React from "react";
import './StudentListItem.scss';


const StudentListItem = function (props) {
  
  return (
    <li className='student-item'>
      {/* hardcoded values for now until props passed down */}
      {props.name ? <p>{props.name}</p> : <p>Johnny Appleseed</p>}
      {props.accessCode && <p>{props.accessCode}</p>}
      {props.chequing && <p>${props.chequing}</p>}
      {props.savings && <p>{props.savings}</p>}
      {props.investment && <p>{props.investment}</p>}
    </li>
  );
};

export default StudentListItem;