create database one;

create table users (
    id int not null AUTO_INCREMENT,
    user_name varchar(255) not null,
    first_name varchar(255) not null,
    last_name varchar(255) not null,
    Password varchar(255) not null,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    primary key(id),
    unique(user_name)
);

create table user_role (
    id int not null AUTO_INCREMENT,
    user_id int not null,
    role enum ('admin', 'seller', 'supporter', 'customer'),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    primary key(id),
    unique(user_id)
);