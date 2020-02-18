DROP TABLE IF EXISTS inventory;

DROP TABLE IF EXISTS product;

DROP TABLE IF EXISTS membership;

DROP TABLE IF EXISTS role;

DROP TABLE IF EXISTS location;

DROP TABLE IF EXISTS organization;

DROP TABLE IF EXISTS person;

CREATE TABLE person (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  pin INT NOT NULL,
  birth_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREATE TABLE organization (
--   id BIGSERIAL PRIMARY KEY,
--   title VARCHAR(100) NOT NULL
-- );
-- CREATE TABLE location (
--   id BIGSERIAL PRIMARY KEY,
--   organization_id BIGINT REFERENCES organization(id) NOT NULL,
--   title VARCHAR(100) NOT NULL,
--   country VARCHAR(50) NOT NULL,
--   region VARCHAR(50) NOT NULL,
--   city VARCHAR(50) NOT NULL,
--   street VARCHAR(100) NOT NULL,
--   postalcode VARCHAR(50) NOT NULL,
--   coordinates POINT NOT NULL
-- );
-- CREATE TABLE role (
--   id BIGSERIAL PRIMARY KEY,
--   title VARCHAR(50),
--   organization_id BIGINT REFERENCES organization(id) NOT NULL,
--   read BOOLEAN DEFAULT FALSE NOT NULL,
--   write BOOLEAN DEFAULT FALSE NOT NULL,
--   delete BOOLEAN DEFAULT FALSE NOT NULL
-- );
-- CREATE TABLE membership (
--   id BIGSERIAL PRIMARY KEY,
--   person_id BIGINT REFERENCES person(id) NOT NULL,
--   organization_id BIGINT REFERENCES organization(id) NOT NULL,
--   role_id BIGINT REFERENCES role(id) NOT NULL
-- );
-- CREATE TABLE product (
--   id BIGSERIAL PRIMARY KEY,
--   title VARCHAR(100) NOT NULL,
--   brand VARCHAR(100),
--   organization_id BIGINT REFERENCES organization(id)
-- );
-- CREATE TABLE inventory (
--   id BIGSERIAL PRIMARY KEY,
--   product_id BIGINT,
--   location_id BIGINT,
--   quantity INT,
--   price INT
-- );