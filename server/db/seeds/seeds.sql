INSERT INTO teachers (name, email, password)
VALUES ('CLASS-1', 'kurtis.grant@lhl.com', '123456789');

INSERT INTO simulations(name,
                        created_date,
                        id_string,
                        mock_market_data,
                        current_month,
                        state,
                        teacher_id)
VALUES ('SIMULATION-1',
        '2022-02-10 21:10:22',
        'A1B2C3',
        jsonb_array_elements(
          '[{
            "customer": "Lily Bush",
            "items": {
              "product": "Diaper",
              "qty": 24
            }
          },
          {
            "customer": "Josh William",
            "items": {
              "product": "Toy Car",
              "qty": 1
            }
          },
          {
            "customer": "Mary Clark",
            "items": {
              "product": "Toy Train",
              "qty": 2
            }
          }]'::jsonb),
        2,
        FALSE,
        1);

INSERT INTO students (name, access_code, simulation_id)
VALUES ('Jeffery Park', 'abcde', 1),
       ('Robert Gladue', 'abcde', 1);

INSERT INTO basic_accounts (type, balance, student_id)
VALUES ('Chequing', 50000, 1),
       ('Savings', 100000, 1),
       ('Chequing', 50000, 2),
       ('Savings', 100000, 2);

INSERT INTO investment_accounts (student_id)
VALUES (1),
       (2);

INSERT INTO market_transactions (month, price, quantity, investment_account_id)
VALUES (10, 4000, 2, 1),
       (10, 5500, 1, 1),
       (10, 5500, 3, 2),
       (10, 6000, 1, 2);