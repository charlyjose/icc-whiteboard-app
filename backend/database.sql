CREATE DATABASE tododb;

CREATE TABLE todo (
    id SERIAL PRIMARY KEY,
    userId KEY,
    title VARCHAR(255),
    description VARCHAR(255),
    category VARCHAR(255),
    schedule VARCHAR(255)
);

CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    userId KEY,
    categoryName VARCHAR(255)
);


\c tododb
\d todos
\d categories
select * from todos;