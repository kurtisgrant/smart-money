-- Performs multiple database queries to set balances for each account
-- setAccountBalances: (studentId, cheBal, savBal, invBal) => {
  
-- },

-- UPDATE accounts
-- SET balance = 1000
-- WHERE student_id = 10 AND account_type = 'Savings'


-- UPDATE accounts
-- SET account_type = u.a, balance = u.b
-- FROM (
--   VALUES ('Chequing', 1000),
--          ('Savings', 1000),
--          ('Investment', 1000)
-- ) as u(a, b)
-- WHERE accounts.student_id = 10;


UPDATE accounts SET balance = CASE
  WHEN account_type = 'Chequing' then 1000
  WHEN account_type = 'Savings' then 2000
  WHEN account_type = 'Investment' then 3000
  end
WHERE student_id = 10;