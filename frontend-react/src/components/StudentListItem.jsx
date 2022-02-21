import React from "react";
import { FaTrashAlt } from 'react-icons/fa';
import './StudentListItem.scss';


const StudentListItem = function ({ name, accessCode, onDelete }) {
  return (
		<tr className="student-item">
			<td className="col-1">{name}</td>
			<td className="col-2">{accessCode}</td>
			<td className="col-3">
				<FaTrashAlt size={15} onClick={() => onDelete(accessCode)} />
			</td>
		</tr>
  );
};

export default StudentListItem;