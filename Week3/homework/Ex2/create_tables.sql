-- Active: 1662325308325@@127.0.0.1@3306@bank

CREATE DATABASE IF NOT EXISTS bank;

USE bank;


DROP TABLE IF EXISTS account_change;
DROP TABLE IF EXISTS account;


CREATE TABLE
    IF NOT EXISTS account (
        account_number int not null primary key auto_increment,
        balance int not null
    );

CREATE TABLE
    IF NOT EXISTS account_change (
        change_number int not null primary key auto_increment,
        account_number int not null,
        amount int not null,
        changed_date date not null,
        remark varchar(255) null,
        foreign key (account_number) references account(account_number)
    );

INSERT INTO account (account_number, balance) VALUES (101, 2300);

INSERT INTO account (account_number, balance) VALUES (102, 650);

SET autocommit = OFF;

START TRANSACTION;

UPDATE account SET balance=balance-1000 where account_number=101;

INSERT INTO account_change (account_number, amount, changed_date, remark) VALUES (101, -1000, NOW(), 'loan');

UPDATE account SET balance=balance+1000 where account_number=102;

INSERT INTO account_change (account_number, amount, changed_date, remark) VALUES (102, 1000, NOW(), 'take on debt');

COMMIT;

UPDATE account SET balance=23124 WHERE account_number=101;
