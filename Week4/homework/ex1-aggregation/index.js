import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import importData from "./importData.js";

dotenv.config();

const DB = "exercise1";
const COLLECTION = "population_pyramid";

const getTotalPopulationByCountry = async (client, country) => {
  const agg = [
    {
      $match: {
        Country: country,
      },
    },
    {
      $group: {
        _id: "$Year",
        countPopulation: {
          $sum: {
            $add: [
              {
                $toInt: "$M",
              },
              {
                $toInt: "$F",
              },
            ],
          },
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ];

  const cursor = await client.db(DB).collection(COLLECTION).aggregate(agg);
  const results = await cursor.toArray();
  results.forEach((result) => console.log(result));
};

const getPopulationOfContinents = async (client, year, age) => {
  const agg = [
    {
      $match: {
        Country: {
          $in: [
            "AFRICA",
            "ASIA",
            "EUROPE",
            "LATIN AMERICA AND THE CARIBBEAN",
            "NORTHERN AMERICA",
            "OCEANIA",
          ],
        },
        Year: year,
        Age: age,
      },
    },
    {
      $addFields: {
        TotalPopulation: {
          $add: [
            {
              $toInt: "$M",
            },
            {
              $toInt: "$F",
            },
          ],
        },
      },
    },
  ];

  const cursor = await client.db(DB).collection(COLLECTION).aggregate(agg);
  const results = await cursor.toArray();
  console.log(results);
};

async function main() {
  const client = new MongoClient(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  try {
    await client.connect();

    // import csv to database
    await importData(client);

    // get population of countries
    await getTotalPopulationByCountry(client, "Netherlands");
    
    // get population of continents
    await getPopulationOfContinents(client, "2020", "100+");

  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
}
main();
