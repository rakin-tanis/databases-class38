import { execQuery } from "./connection.js";

const INSERT_ACCOUNT_1 = `INSERT INTO account (account_number, balance) VALUES (101, 2300);`;

const INSERT_ACCOUNT_2 = `INSERT INTO account (account_number, balance) VALUES (102, 650);`;

export const insertInitialValues = async () => {
  await execQuery(INSERT_ACCOUNT_1);
  await execQuery(INSERT_ACCOUNT_2);
};
