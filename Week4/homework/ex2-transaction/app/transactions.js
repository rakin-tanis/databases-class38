import { DB, COLLECTION, COUNTER_COLLECTION } from "./constants.js";
import { v4 as uuidv4 } from "uuid";

export const transferMoney = async (client, { from, to, amount, message }) => {
  const accountsCollection = client.db(DB).collection(COLLECTION);
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      const fromAccount = await accountsCollection.findOne({
        account_number: from,
      });

      if (fromAccount.balance < amount) {
        throw new Error("insufficient balance!");
      }

      const id1 = await getAutoIncId(client, session, from);
      await accountsCollection.updateOne(
        { account_number: from },
        {
          $inc: { balance: amount * -1 },
          $push: {
            account_changes: {
              change_number: id1,
              amount: amount * -1,
              changed_date: new Date(),
              remark: message,
            },
          },
        },
        { session }
      );

      const id2 = await getAutoIncId(client, session, to);
      await accountsCollection.updateOne(
        { account_number: to },
        {
          $inc: { balance: amount },
          $push: {
            account_changes: {
              change_number: id2,
              amount: amount,
              changed_date: new Date(),
              remark: message,
            },
          },
        },
        { session }
      );
    });
  } catch (err) {
    console.log(err.message);
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
};

export const getAutoIncId = async (client, session, accountNumber) => {
  const counterCollection = client.db(DB).collection(COUNTER_COLLECTION);
  await counterCollection.updateOne(
    { collection: COLLECTION, account_number: accountNumber },
    { $inc: { counter: 1 } },
    { upsert: true },
    { session }
  );
  const result = await counterCollection.findOne({ collection: COLLECTION });
  return result.counter;
};
