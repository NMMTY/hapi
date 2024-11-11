CREATE TABLE IF NOT EXISTS uptime (
  id VARCHAR(32) PRIMARY KEY,
  url VARCHAR(255) NOT NULL,
  webhook VARCHAR(255) NOT NULL,
  response_time INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_check TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  live BOOLEAN DEFAULT FALSE
);