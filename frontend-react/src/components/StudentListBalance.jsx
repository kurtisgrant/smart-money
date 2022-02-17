import React from 'react';
import './StudentListBalance.scss'

const StudentListBalance = function () {
	return (
		<table className="student-list-balance">
			<tr>
				<th>Name</th>
				<th>Chequing</th>
				<th>Saving</th>
				<th>Investment</th>
			</tr>
			<tr className="student">
				<td>John Doe</td>
				<td>$1,000</td>
				<td>$500</td>
				<td>$500</td>
			</tr>
			<tr className="student">
				<td>Adam Johns</td>
				<td>$900</td>
				<td>$300</td>
				<td>$800</td>
			</tr>
			<tr className="student">
				<td>Sam Lee</td>
				<td>$500</td>
				<td>$500</td>
				<td>$1,000</td>
			</tr>
		</table>
	);
};

export default StudentListBalance;
