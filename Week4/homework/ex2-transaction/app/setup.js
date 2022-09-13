import { DB, COLLECTION, COUNTER_COLLECTION } from "./constants.js";
import { getAutoIncId } from "./transactions.js";

const setup = async (client) => {
  await resetCollection(client, COLLECTION);
  await resetCollection(client, COUNTER_COLLECTION);

  const accountsCollection = client.db(DB).collection(COLLECTION);
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      const id1 = await getAutoIncId(client, session, 101);
      await accountsCollection.insertOne(
        {
          account_number: 101,
          balance: 2300,
          account_changes: [
            {
              change_number: id1,
              amount: 2300,
              changed_date: new Date(),
              remark: "initial amount",
            },
          ],
        },
        { session }
      );

      const id2 = await getAutoIncId(client, session, 102);
      await accountsCollection.insertOne(
        {
          account_number: 102,
          balance: 600,
          account_changes: [
            {
              change_number: id2,
              amount: 600,
              changed_date: new Date(),
              remark: "initial amount",
            },
          ],
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

const resetCollection = async (client, collection) => {
  const hasCollection = await client
    .db(DB)
    .listCollections({ name: collection })
    .hasNext();

  if (hasCollection) {
    await client.db(DB).collection(collection).deleteMany({});
  } else {
    await client.db(DB).createCollection(collection);
  }
};

export default setup;
