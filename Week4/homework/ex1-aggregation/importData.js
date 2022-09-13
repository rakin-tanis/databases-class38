import csvToJson from "convert-csv-to-json";

const DB = "exercise1";
const COLLECTION = "population_pyramid";

const importData = async (client) => {
  const hasCollection = await client
    .db(DB)
    .listCollections({ name: COLLECTION })
    .hasNext();

  if (hasCollection) {
    const populationCollection = await client.db(DB).collection(COLLECTION);

    // Remove all the documents
    await populationCollection.deleteMany({});

    // Convert data to array version of elements
    const documents = csvToJson.fieldDelimiter(',').getJsonFromCsv(
      "./population_pyramid_1950-2022.csv"
    );
    // Add our documents
    await populationCollection.insertMany(documents);
  } else {
    throw Error(`The collection '${COLLECTION}' does not exist!`);
  }
};

export default importData;
