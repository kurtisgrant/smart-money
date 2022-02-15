import React from "react";
import { FaTrashAlt } from 'react-icons/fa';
import './StudentListItem.scss';


const StudentListItem = function ({ id, name, accessCode, onDelete }) {
  
  return (
		<div className="student-item">
			<div className="col-1">{name}</div>
			<div className="col-2">{accessCode}</div>
			<div className="col-3">
				<FaTrashAlt size={15} onClick={() => onDelete(id)} />
			</div>
		</div>
  );
};

export default StudentListItem;