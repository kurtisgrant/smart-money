DROP TABLE IF EXISTS market_transactions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS simulations CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;

CREATE TABLE teachers (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  password VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE simulations (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  simulation_key VARCHAR(255),
  mock_market_data TEXT,
  current_month INT DEFAULT 0,
  is_playing BOOLEAN DEFAULT FALSE,
  income BIGINT,
  expense BIGINT,
  teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE
);

CREATE TABLE students (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  access_code VARCHAR(255) NOT NULL,
  income INT NOT NULL,
  expense INT NOT NULL,
  -- Chequing allocation calculated from income, expense, savings and investment
  savings_allocation INT NOT NULL DEFAULT 0,
  investment_allocation INT NOT NULL DEFAULT 0,
  simulation_id INTEGER REFERENCES simulations(id) ON DELETE CASCADE
);

CREATE TABLE accounts (
  id SERIAL PRIMARY KEY NOT NULL,
  account_type VARCHAR(255),
  balance BIGINT,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE market_transactions (
  id SERIAL PRIMARY KEY NOT NULL,
  price BIGINT,
  quantity INTEGER,
  account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE
);