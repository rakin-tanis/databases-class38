import { connect, disconnect } from "./app/connection.js";
import { createTables, resetDb } from "./app/transactions-create-tables.js";
import { insertInitialValues } from "./app/transactions-insert-values.js";
import { deposit, transfer, withdraw } from "./app/transaction.js";

const run = async () => {
  await resetDb();
  await createTables();
  await insertInitialValues();

  await deposit({
    accountNumber: 101,
    amount: 200,
    message: "200 euros deposit",
  });
  await withdraw({
    accountNumber: 101,
    amount: 100,
    message: "200 euros withdraw",
  });

  await transfer({
    from: 101,
    to: 102,
    amount: 550,
    message: "test transaction",
  });
};

const main = async () => {
  connect();
  try {
    await run();
  } catch (error) {
    console.log(error);
  } finally {
    disconnect();
  }
};

main();
