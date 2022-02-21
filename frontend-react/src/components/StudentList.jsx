import React from 'react';
import StudentListItem from './StudentListItem';
import './StudentList.scss';

const StudentList = function ({ studentsList, onDelete }) {
	const studentsListItems = studentsList.map((studentsListItem) => (
		<StudentListItem
			key={studentsListItem.accessCode}
			name={studentsListItem.name}
			accessCode={studentsListItem.accessCode}
			onDelete={onDelete}
		/>
	));

	return (
		<table className="students-container">
			<tbody>
				<tr>
					<th className="head-col-1">Name</th>
					<th className="head-col-2">Access Code</th>
					<th className="head-col-3">Delete</th>
				</tr>
				{studentsListItems}
			</tbody>
			{/* <div className="students-list">{studentsListItems}</div> */}
		</table>
	);
};

export default StudentList;
