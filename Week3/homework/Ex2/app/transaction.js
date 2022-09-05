import { beginTransaction, commit, execQuery, rollback } from "./connection.js";

const SELECT_BALANCE = `SELECT balance FROM account WHERE account_number=?;`;

const UPDATE_BALANCE = `UPDATE account SET balance=? WHERE account_number=?;`;

const INSERT_ACCOUNT_CHANGE = `INSERT INTO account_change (account_number, amount, changed_date, remark) VALUES ?;`;

const transactionalQuery = async (queryFunc) => {
  try {
    await beginTransaction();
    await queryFunc();
    await commit();
  } catch (error) {
    await rollback();
    console.log(error);
  }
};

const depositMoney = async (accountNumber, amount, message) => {
  if (amount <= 0) throw new Error("Amount must be greater than zero.");

  const balanceRecord = await execQuery(SELECT_BALANCE, [accountNumber]);
  const newBalance = balanceRecord[0].balance + amount;
  await execQuery(UPDATE_BALANCE, [newBalance, accountNumber]);
  await execQuery(INSERT_ACCOUNT_CHANGE, [
    [[accountNumber, amount, new Date(), message]],
  ]);
};

const withdrawMoney = async (accountNumber, amount, message) => {
  if (amount <= 0) throw new Error("Amount must be greater than zero.");

  const balanceRecord = await execQuery(SELECT_BALANCE, [accountNumber]);
  const balance = balanceRecord[0].balance;
  if (balance < amount) {
    throw new Error(
      "You do not have a sufficient amount in your account to withdraw money."
    );
  }
  const newBalance = balanceRecord[0].balance - amount;
  await execQuery(UPDATE_BALANCE, [newBalance, accountNumber]);
  await execQuery(INSERT_ACCOUNT_CHANGE, [
    [[accountNumber, -amount, new Date(), message]],
  ]);
};

const transferMoney = async (from, to, amount, message) => {
  if (amount <= 0) throw new Error("Amount must be greater than zero.");

  await withdrawMoney(from, amount, message);
  await depositMoney(to, amount, message);
};

export const deposit = async ({ accountNumber, amount, message }) => {
  await transactionalQuery(
    async () => await depositMoney(accountNumber, amount, message)
  );
};

export const withdraw = async ({ accountNumber, amount, message }) => {
  await transactionalQuery(
    async () => await withdrawMoney(accountNumber, amount, message)
  );
};

export const transfer = async ({ from, to, amount, message }) => {
  await transactionalQuery(
    async () => await transferMoney(from, to, amount, message)
  );
};
