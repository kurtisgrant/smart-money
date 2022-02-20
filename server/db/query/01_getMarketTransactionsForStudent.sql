-- getMarketTransactionsForStudent: (studentId) => {
--   Return array with following structure:
--   [{ id, price, quantity, account_id }];
-- },

SELECT students.id AS student_id, market_transactions.price, market_transactions.quantity, market_transactions.account_id
FROM students
JOIN accounts ON accounts.student_id = students.id
JOIN market_transactions ON market_transactions.account_id = accounts.id
WHERE students.id = 10;