import React from 'react';
import './StudentListBalance.scss';

const StudentListBalance = function() {
	return (
		<table className="student-list-balance">
			<tbody>
				<tr>
					<th>Name</th>
					<th>Savings</th>
					<th>Investments</th>
					<th>Chequings</th>
				</tr>
				<tr className="student">
					<th>John Doe</th>
					<td>$1,000</td>
					<td>$500</td>
					<td>$500</td>
				</tr>
				<tr className="student">
					<th>Adam Johns</th>
					<td>$900</td>
					<td>$300</td>
					<td>$800</td>
				</tr>
				<tr className="student">
					<th>Sam Lee</th>
					<td>$500</td>
					<td>$500</td>
					<td>$1,000</td>
				</tr>
			</tbody>
		</table>
	);
};

export default StudentListBalance;
