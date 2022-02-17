import React from "react";
import StudentListItem from './StudentListItem';

const StudentList = function ({ studentsList, onDelete }) {
	const studentsListItems = studentsList.map((studentsListItem) => (
		<StudentListItem
			key={studentsListItem.id}
			id={studentsListItem.id}
			name={studentsListItem.name}
			accessCode={studentsListItem.accessCode || studentsListItem.accesscode}
      onDelete={onDelete}
		/>
	));

  return (
    <section className="students-container">
      <div className="students-list">{studentsListItems}</div>
    </section>
  );
};



export default StudentList;