DROP TABLE IF EXISTS market_transactions CASCADE;
DROP TABLE IF EXISTS investment_accounts CASCADE;
DROP TABLE IF EXISTS basic_accounts CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS simulations CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;

CREATE TABLE teachers (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  password VARCHAR(255)
);

CREATE TABLE simulations (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_date TIMESTAMP,
  id_string VARCHAR(255),
  mock_market_data TEXT,
  -- mock_market_data JSON NOT NULL,
  current_month INT,
  -- current_month INT NOT NULL,
  state BOOLEAN,
  teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE
);

CREATE TABLE students (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  access_code VARCHAR(255) NOT NULL,
  simulation_id INTEGER REFERENCES simulations(id) ON DELETE CASCADE
);

CREATE TABLE basic_accounts (
  id SERIAL PRIMARY KEY NOT NULL,
  type VARCHAR(255),
  balance BIGINT,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE investment_accounts (
  id SERIAL PRIMARY KEY NOT NULL,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE market_transactions (
  id SERIAL PRIMARY KEY NOT NULL,
  month INT,
  price BIGINT,
  quantity INTEGER,
  investment_account_id INTEGER REFERENCES investment_accounts(id) ON DELETE CASCADE
);