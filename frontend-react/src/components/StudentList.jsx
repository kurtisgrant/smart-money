import React from "react";
import StudentListItem from './StudentListItem';

const StudentList = function () {
  const studentArray = [{
    id: 1,
    name: "Johnny Appleseed",
    accessCode: "M8H642",
  },
  {
    id: 2,
    name: "Jeffery Park",
    accessCode: "F662ZB",
  },
  {
    id: 3,
    name: "Robert Gladue",
    accessCode: "H2MNLZ"
  }]
  const StudentItem = studentArray.map((student) => (
    <StudentListItem
      key={student.id}
      name={student.name}
      accessCode={student.accessCode}
    />
  ));
  return (
    <section className="students">
      <h4 className="students__header">Students</h4>
      <ul className="class__list">{StudentItem}</ul>
    </section>
  );
};



export default StudentList;