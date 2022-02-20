SELECT accounts.id
FROM accounts
JOIN students ON students.id = accounts.student_id
WHERE students.id = 10 AND accounts.account_type = 'Investment';

INSERT INTO market_transactions (price, quantity, account_id)
VALUES (100, 1, 30);