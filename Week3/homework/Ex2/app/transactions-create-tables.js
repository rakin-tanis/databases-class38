import { execQuery } from "./connection.js";


const DROP_ACCOUNT_CHANGE_TABLE = `DROP TABLE IF EXISTS account_change;`;
const DROP_ACCOUNT_TABLE = `DROP TABLE IF EXISTS account;`;


const CREATE_ACCOUNT_TABLE = `CREATE TABLE
                                  IF NOT EXISTS account (
                                      account_number int not null primary key auto_increment,
                                      balance int not null
                                  );`;

const CREATE_ACCOUNT_CHANGE_TABLE = `CREATE TABLE
                                        IF NOT EXISTS account_change (
                                            change_number int not null primary key auto_increment,
                                            account_number int not null,
                                            amount int not null,
                                            changed_date date not null,
                                            remark varchar(255) null,
                                            foreign key (account_number) references account(account_number)
                                        );`;

export const resetDb = async () => {
    execQuery(DROP_ACCOUNT_CHANGE_TABLE);
    execQuery(DROP_ACCOUNT_TABLE);
}

export const createTables = async () => {
    await execQuery(CREATE_ACCOUNT_TABLE);
    await execQuery(CREATE_ACCOUNT_CHANGE_TABLE);
}