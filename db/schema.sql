CREATE DATABASE striveRite_db;
USE striveRite_db; 

CREATE TABLE user (
    id INT NOT NULL AUTO_INCREMENT, 
    userName VARCHAR (20) NOT NULL,
    email VARCHAR (30) NOT NULL, 
    userState VARCHAR (2) NOT NULL, 
    userCity VARCHAR (50) NOT NULL, 
    userPass VARCHAR (30) NOT NULL, 
    PRIMARY KEY (id)
); 

CREATE TABLE guardian (
    id INT NOT NULL AUTO_INCREMENT, 
    fullName VARCHAR (50) NOT NULL, 
    age VARCHAR (50) NOT NULL,  
    childId INT NOT NULL, 
    PRIMARY KEY (id)
)


CREATE TABLE child (
    id INT NOT NULL AUTO_INCREMENT, 
    fullName VARCHAR (50) NOT NULL, 
    age VARCHAR (50) NOT NULL,  
    grade VARCHAR (50) NOT NULL, 
    guardianId INT NOT NULL, 
    PRIMARY KEY (id)
); 

 CREATE TABLE task(
     id INT NOT NULL AUTO_INCREMENT,
     title VARCHAR (30) NOT NULL, 
     details VARCHAR (256) NOT NULL, 
     dueDate DATE NOT NULL, 
     dueTime TIME NOT NULL, 
     assigneeId INT NOT NULL, 
     assignerId INT NOT NULL,
     taskPriority VARCHAR (6) NOT NULL, 
     startDate DATE NOT NULL, 
     PRIMARY KEY (id), 
 );




