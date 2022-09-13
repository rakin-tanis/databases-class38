import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

export const connect = async () => {
  try {
    await client.connect();
    return client;
  } catch (err) {
    console.log(err);
  }
};
export const disconnect = async () => await client.close();
