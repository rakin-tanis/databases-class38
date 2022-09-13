import { connect, disconnect } from "./app/connection.js";
import { transferMoney } from "./app/transactions.js";
import setup from "./app/setup.js";

const main = async () => {
  const client = await connect();
  try {
    
    await setup(client);

    await transferMoney(client, {
      from: 101,
      to: 102,
      amount: 550,
      message: "test transaction",
    });

  } catch (error) {
    console.log(error);
  } finally {
    await disconnect();
  }
};

main();
