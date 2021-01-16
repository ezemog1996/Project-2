CREATE DATABASE striveRite_db;
USE striveRite_db; 

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT, 
    users_name VARCHAR(50) NOT NULL, 
    users_age VARCHAR(50) NOT NULL,
    users_grade VARCHAR (50) NOT NULL, 
    PRIMARY KEY (id)
); 

---second table for parents age and number of kids 