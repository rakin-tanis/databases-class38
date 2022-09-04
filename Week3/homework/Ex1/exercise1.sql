const CREATE_DATABASE = `CREATE DATABASE IF NOT EXISTS information_system;`;

const USE_DATABASE = `USE information_system;`;

-- Active: 1662294403235@@127.0.0.1@3306@information_system

CREATE DATABASE IF NOT EXISTS information_system;

USE information_system;

DROP TABLE IF EXISTS members_foods_joint;

DROP TABLE IF EXISTS dinners_members_joint;

DROP TABLE IF EXISTS dinners;

DROP TABLE IF EXISTS members;

DROP TABLE IF EXISTS foods;

DROP TABLE IF EXISTS venues;

-- Init table as the same as in the exercise

CREATE TABLE
    IF NOT EXISTS members (
        member_id int not null,
        member_name varchar(30) not null,
        member_address varchar(255) null,
        dinner_id varchar(9) not null,
        dinner_date varchar(10) null,
        venue_code varchar(3),
        venue_description varchar(255),
        food_code varchar(50),
        food_description varchar(255)
    );

INSERT INTO
    members (
        member_id,
        member_name,
        member_address,
        dinner_id,
        dinner_date,
        venue_code,
        venue_description,
        food_code,
        food_description
    )
VALUES (
        1,
        'Amit',
        '325 Max park',
        'D00001001',
        '2020-03-15',
        'B01',
        'Grand Ball Room',
        'C1, C2',
        'Curry, Cake'
    ), (
        2,
        'Ben',
        '24 Hudson lane',
        'D00001002',
        '2020/03/15',
        'B02',
        'Zoku Roof Top',
        'S1, C2',
        'Soup, Cake'
    ), (
        3,
        'Cristina',
        '516 6th Ave',
        'D00001002',
        '2020/03/15',
        'B02',
        'Zoku Roof Top',
        'S1, C2',
        'Soup, Cake'
    ), (
        4,
        'Dan',
        '89 John St',
        'D00001003',
        '20-03-2020',
        'B03',
        'Goat Farm',
        'P1, T1, M1',
        'Pie, Tea, Mousse'
    ), (
        1,
        'Amit',
        '325 Max park',
        'D00001003',
        '20-03-2020',
        'B03',
        'Goat Farm',
        'P1, T1, M1',
        'Pie, Tea, Mousse'
    ), (
        3,
        'Cristina',
        '516 6th Ave',
        'D00001004',
        'Mar 25 \'20',
        'B04',
        'Mama\'s Kitchen',
        'F1, M1',
        'Falafal, Mousse'
    ), (
        5,
        'Gabor',
        '54 Vivaldi St',
        'D00001005',
        'Mar 26 \'20',
        'B05',
        'Hungry Hungary',
        'G1, P2',
        'Goulash, Pasca'
    ), (
        6,
        'Hema',
        '9 Peter St',
        'D00001003',
        '01-04-2020',
        'B03',
        'Goat Farm',
        'P1, T1, M1',
        'Pie, Tea, Mousse '
    );

-- NF1

-- All data must be atomic (every column should only contain a single value)

-- create a seperate table for foods

CREATE TABLE
    IF NOT EXISTS foods (
        food_code varchar(2) not null unique,
        food_description varchar(255)
    );

INSERT INTO
    foods (food_code, food_description)
VALUES ('C1', 'Curry'), ('C2', 'Cake'), ('S1', 'Soup'), ('P1', 'Pie'), ('T1', 'Tea'), ('M1', 'Mousse'), ('F1', 'Falafal'), ('G1', 'Goulash'), ('P2', 'Pasca');

-- Repeating columns are not allowed

-- Prevent duplicate records (by applying primary keys)

-- Attribute domain should not change (all values in a column must be of the same kind or type).

-- I create a venues table to prevent dublicate records

CREATE TABLE
    IF NOT EXISTS venues (
        venue_code varchar(3) primary key not null,
        venue_description varchar(255)
    );

INSERT INTO
    venues (venue_code, venue_description)
VALUES ('B01', 'Grand Ball Room'), ('B02', 'Zoku Roof Top'), ('B03', 'Goat Farm'), ('B04', 'Mama\'s Kitchen'), ('B05', 'Hungry Hungary');

-- dinner table is also a joint table for venues and members, I didn't assign foreign key because of the same reason I mentioned before

CREATE TABLE
    IF NOT EXISTS dinners (
        dinner_id varchar(9) not null primary key,
        venue_code varchar(3) not null,
        foreign key (venue_code) references venues(venue_code)
    );

INSERT INTO
    dinners (dinner_id, venue_code)
VALUES ('D00001001', 'B01'), ('D00001002', 'B02'), ('D00001003', 'B03'), ('D00001004', 'B04'), ('D00001005', 'B05');

-- create a joint table for the dinners and members

-- I will not add foreign key for members table until I make the member_id column primary key. but before that, I need to clear dublicate records.

CREATE TABLE
    IF NOT EXISTS dinners_members_joint (
        id int not null primary key auto_increment,
        dinner_id varchar(9) not null,
        dinner_date date not null,
        member_id int not null,
        foreign key (dinner_id) references dinners(dinner_id) 
        -- foreign key (member_id) references members(member_id),
    );

INSERT INTO
    dinners_members_joint (
        dinner_id,
        dinner_date,
        member_id
    )
VALUES ('D00001001', '2020-03-15', 1), ('D00001002', '2020-03-15', 2), ('D00001002', '2020-03-15', 3), ('D00001003', '2020-03-20', 4), ('D00001003', '2020-03-20', 1), ('D00001004', '2020-03-25', 3), ('D00001005', '2020-03-26', 5), ('D00001003', '2020-04-01', 6);


-- I need another joint table between dinners_member_joint and foods
CREATE TABLE
    IF NOT EXISTS dinners_members_food_joint (
        id int not null primary key auto_increment,
        dinner_member_id int not null,
        food_code varchar(2) not null,
        foreign key (dinner_member_id) references dinners_members_joint(id), 
        foreign key (food_code) references foods(food_code)
    );

INSERT INTO
    dinners_members_food_joint (dinner_member_id, food_code)
VALUES (1, 'C1'), (1, 'C2'), (2, 'S1'), (2, 'C1'), (3, 'S1'), (3, 'C2'), (4, 'P1'), (4, 'T1'), (4, 'M1'), (5, 'P1'), (5, 'T1'), (5, 'M1'), (6, 'F1'), (6, 'M1'), (7, 'G1'), (7, 'P2'), (8, 'P1'), (8, 'T1'), (8, 'M1'); 


-- it is time to clean the members TABLE

-- clean dublicate records first

delete from members where member_id=1 and dinner_id='D00001003';

delete from members where member_id=3 and dinner_id='D00001004';

-- now clean the redundant columns

alter table
    members drop column food_description,
    drop column food_code,
    drop column venue_description,
    drop column venue_code,
    drop column dinner_date,
    drop column dinner_id;

-- make members_id column primary key

alter table members add primary key (member_id);

-- add foreign key to the foods dinner table

alter table dinners
add
    foreign key (member_id) references members(member_id);



/* select m.*, dmj.dinner_id, dmj.dinner_date, dmfj.food_code, f.food_description from members m
  left join dinners_members_joint dmj on m.member_id = dmj.member_id
  left join dinners_members_food_joint dmfj on dmfj.dinner_member_id=dmj.id
  left join foods f on dmfj.food_code=f.food_code; */