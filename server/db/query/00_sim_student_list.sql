SELECT simulations.id AS sim_id, students.name, accounts.*
FROM accounts
JOIN students ON students.id = accounts.student_id
JOIN simulations ON simulations.id = students.simulation_id
WHERE simulations.id = (SELECT id FROM simulations WHERE simulation_key = 'd2dEN4');
