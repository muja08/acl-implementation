create database calories;

CREATE TABLE users (
    id int NOT NULL AUTO_INCREMENT,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    user_name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    UNIQUE (user_name),
    UNIQUE (email),
    UNIQUE (email, user_name),
    PRIMARY KEY (id)
);

CREATE TABLE user_role (
    id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    role ENUM ('admin','subscriber'),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE user_calories_threshold (
    id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    threshold DECIMAL(10,2) NOT NULL DEFAULT 2100,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);


insert into users (first_name, last_name, user_name, email, password) values ('admin', 'admin', 'admin', 'admin@gmail.com', 'password');
insert into user_role (user_id, role) values (1, 'admin');

insert into users (first_name, last_name, user_name, email, password) values ('subscriber', 'subscriber', 'subscriber', 'subscriber@gmail.com', 'password');
insert into user_role (user_id, role) values (2, 'subscriber');
insert into user_calories_threshold (user_id) values (2);

insert into users (first_name, last_name, user_name, email, password) values ('subscriber2', 'subscriber2', 'subscriber2', 'subscriber2@gmail.com', 'password');
insert into user_role (user_id, role) values (3, 'subscriber');
insert into user_calories_threshold (user_id) values (3);

CREATE TABLE foods (
    id int NOT NULL AUTO_INCREMENT,
    food_name varchar(255) NOT NULL,
    uom ENUM ('gram','litre'),
    unit DECIMAL(10,2) NOT NULL,
    calories DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE (food_name)
);



CREATE TABLE user_food_intake (
    id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    food_id int NOT NULL,
    unit DECIMAL(10,2) NOT NULL,
    intake_at TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (food_id) REFERENCES foods(id),
    INDEX (user_id, food_id)
);

-- food entries

insert into foods (food_name, uom, unit, calories) value ('potato', 'gram', 1000, 750);
insert into foods (food_name, uom, unit, calories) value ('chicken', 'gram', 500, 1100);
insert into foods (food_name, uom, unit, calories) value ('mutton', 'gram', 500, 1470);
insert into foods (food_name, uom, unit, calories) value ('milk', 'litre', 1, 630);
insert into foods (food_name, uom, unit, calories) value ('carrot', 'gram', 500, 205);


-- userid 2
insert into user_food_intake (user_id, food_id, unit, intake_at) values (2, 1, 1000, '2022-08-07 02:11:00'), (2, 2, 1000, '2022-08-07 02:11:00'), (2, 4, 1000, '2022-08-07 02:11:00'), (2, 1, 1000, '2022-08-06 02:11:00'), (2, 2, 1000, '2022-08-06 02:11:00'), (2, 4, 1000, '2022-08-06 02:11:00'), (2, 1, 1000, '2022-08-05 02:11:00'), (2, 2, 1000, '2022-08-05 02:11:00'), (2, 4, 1000, '2022-08-05 02:11:00'), (2, 5, 1000, '2022-08-04 02:11:00'), (2, 3, 1000, '2022-08-04 02:11:00'), (2, 4, 1000, '2022-08-04 02:11:00'), (2, 1, 1000, '2022-08-03 02:11:00'), (2, 2, 1000, '2022-08-02 02:11:00'), (2, 4, 1000, '2022-08-02 02:11:00'), (2, 1, 1000, '2022-08-01 02:11:00'), (2, 2, 1000, '2022-08-01 02:11:00'), (2, 4, 1000, '2022-08-01 02:11:00'), (2, 1, 1000, '2022-08-01 02:11:00'), (2, 2, 1000, '2022-07-31 02:11:00'), (2, 4, 1000, '2022-07-31 02:11:00'), (2, 5, 1000, '2022-07-31 02:11:00'), (2, 3, 1000, '2022-07-31 02:11:00'), (2, 4, 1000, '2022-07-30 02:11:00'), (2, 2, 1000, '2022-07-29 02:11:00'), (2, 4, 1000, '2022-07-29 02:11:00'), (2, 5, 1000, '2022-07-31 02:11:00'), (2, 3, 1000, '2022-07-29 02:11:00'), (2, 4, 1000, '2022-07-28 02:11:00'), (2, 2, 1000, '2022-07-27 02:11:00'), (2, 4, 1000, '2022-07-27 02:11:00'), (2, 5, 1000, '2022-07-27 02:11:00'), (2, 3, 1000, '2022-07-27 02:11:00'), (2, 4, 1000, '2022-07-30 02:11:00'), (2, 1, 1000, '2022-07-26 02:11:00'), (2, 2, 1000, '2022-07-26 02:11:00'), (2, 3, 1000, '2022-07-26 02:11:00'), (2, 3, 1000, '2022-07-26 02:11:00'), (2, 4, 1000, '2022-07-25 02:11:00'), (2, 2, 1000, '2022-07-27 02:11:00'), (2, 4, 1000, '2022-07-23 02:11:00'), (2, 5, 1000, '2022-07-23 02:11:00'), (2, 3, 1000, '2022-07-23 02:11:00'), (2, 4, 1000, '2022-07-23 02:11:00'), (2, 1, 1000, '2022-07-22 02:11:00'), (2, 2, 1000, '2022-07-22 02:11:00'), (2, 4, 1000, '2022-07-21 02:11:00'), (2, 1, 1000, '2022-07-20 02:11:00'), (2, 2, 1000, '2022-08-01 02:11:00'), (2, 4, 1000, '2022-08-01 02:11:00'), (2, 1, 1000, '2022-08-01 02:11:00'), (2, 2, 1000, '2022-07-31 02:11:00'), (2, 4, 1000, '2022-07-31 02:11:00'), (2, 5, 1000, '2022-07-31 02:11:00'), (2, 3, 1000, '2022-07-31 02:11:00'), (2, 4, 1000, '2022-07-30 02:11:00');

---userid 3

insert into user_food_intake (user_id, food_id, unit, intake_at) values (3, 1, 1000, '2022-08-07 02:11:00'), (3, 2, 1000, '2022-08-07 02:11:00'), (3, 4, 1000, '2022-08-07 02:11:00'), (3, 1, 1000, '2022-08-06 02:11:00'), (3, 2, 1000, '2022-08-06 02:11:00'), (3, 4, 1000, '2022-08-06 02:11:00'), (3, 1, 1000, '2022-08-05 02:11:00'), (3, 2, 1000, '2022-08-05 02:11:00'), (3, 4, 1000, '2022-08-05 02:11:00'), (3, 5, 1000, '2022-08-04 02:11:00'), (3, 3, 1000, '2022-08-04 02:11:00'), (3, 4, 1000, '2022-08-04 02:11:00'), (3, 1, 1000, '2022-08-03 02:11:00'), (3, 2, 1000, '2022-08-02 02:11:00'), (3, 4, 1000, '2022-08-02 02:11:00'), (3, 1, 1000, '2022-08-01 02:11:00'), (3, 2, 1000, '2022-08-01 02:11:00'), (3, 4, 1000, '2022-08-01 02:11:00'), (3, 1, 1000, '2022-08-01 02:11:00'), (3, 2, 1000, '2022-07-31 02:11:00'), (3, 4, 1000, '2022-07-31 02:11:00'), (3, 5, 1000, '2022-07-31 02:11:00'), (3, 3, 1000, '2022-07-31 02:11:00'), (3, 4, 1000, '2022-07-30 02:11:00'), (3, 2, 1000, '2022-07-29 02:11:00'), (3, 4, 1000, '2022-07-29 02:11:00'), (3, 5, 1000, '2022-07-31 02:11:00'), (3, 3, 1000, '2022-07-29 02:11:00'), (3, 4, 1000, '2022-07-28 02:11:00'), (3, 2, 1000, '2022-07-27 02:11:00'), (3, 4, 1000, '2022-07-27 02:11:00'), (3, 5, 1000, '2022-07-27 02:11:00'), (3, 3, 1000, '2022-07-27 02:11:00'), (3, 4, 1000, '2022-07-30 02:11:00'), (3, 1, 1000, '2022-07-26 02:11:00'), (3, 2, 1000, '2022-07-26 02:11:00'), (3, 3, 1000, '2022-07-26 02:11:00'), (3, 3, 1000, '2022-07-26 02:11:00'), (3, 4, 1000, '2022-07-25 02:11:00'), (3, 2, 1000, '2022-07-27 02:11:00'), (3, 4, 1000, '2022-07-23 02:11:00'), (3, 5, 1000, '2022-07-23 02:11:00'), (3, 3, 1000, '2022-07-23 02:11:00'), (3, 4, 1000, '2022-07-23 02:11:00'), (3, 1, 1000, '2022-07-22 02:11:00'), (3, 2, 1000, '2022-07-22 02:11:00'), (3, 4, 1000, '2022-07-21 02:11:00'), (3, 1, 1000, '2022-07-20 02:11:00'), (3, 2, 1000, '2022-08-01 02:11:00'), (3, 4, 1000, '2022-08-01 02:11:00'), (3, 1, 1000, '2022-08-01 02:11:00'), (3, 2, 1000, '2022-07-31 02:11:00'), (3, 4, 1000, '2022-07-31 02:11:00'), (3, 5, 1000, '2022-07-31 02:11:00'), (3, 3, 1000, '2022-07-31 02:11:00'), (3, 4, 1000, '2022-07-30 02:11:00');

