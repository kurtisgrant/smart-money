SELECT students.name, accounts.*
FROM accounts
JOIN students ON students.id = accounts.student_id
JOIN simulations ON simulations.id = (SELECT id FROM simulations WHERE simulation_key = 'Jmyvyx')