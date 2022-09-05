const { MongoClient, ServerApiVersion } = require("mongodb");
const { seedDatabase } = require("./seedDatabase.js");

const dotenv = require("dotenv");
dotenv.config();

const DB = "databaseWeek3";
const COLLECTION = "bob_ross_episodes";

async function createEpisodeExercise(client) {
  /**
   * We forgot to add the last episode of season 9. It has this information:
   *
   * episode: S09E13
   * title: MOUNTAIN HIDE-AWAY
   * elements: ["CIRRUS", "CLOUDS", "CONIFER", "DECIDIOUS", "GRASS", "MOUNTAIN", "MOUNTAINS", "RIVER", "SNOWY_MOUNTAIN", "TREE", "TREES"]
   */

  // Write code that will add this to the collection!
  const id = await client
    .db(DB)
    .collection(COLLECTION)
    .insertOne({
      episode: "S09E13",
      title: "MOUNTAIN HIDE-AWAY",
      elements: [
        "CIRRUS",
        "CLOUDS",
        "CONIFER",
        "DECIDIOUS",
        "GRASS",
        "MOUNTAIN",
        "MOUNTAINS",
        "RIVER",
        "SNOWY_MOUNTAIN",
        "TREE",
        "TREES",
      ],
    });

  console.log(
    `Created season 9 episode 13 and the document got the id ${id.insertedId}`
  );
}

async function findEpisodesExercises(client) {
  /**
   * Complete the following exercises.
   * The comments indicate what to do and what the result should be!
   */

  const collection = await client.db(DB).collection(COLLECTION);

  // Find the title of episode 2 in season 2 [Should be: WINTER SUN]
  const result1 = await collection.findOne({ episode: "S02E02" });
  console.log(`The title of episode 2 in season 2 is ${result1.title}`);

  // Find the season and episode number of the episode called "BLACK RIVER" [Should be: S02E06]
  const result2 = await collection.findOne({ title: "BLACK RIVER" });
  console.log(
    `The season and episode number of the "BLACK RIVER" episode is ${result2.episode}`
  );

  // Find all of the episode titles where Bob Ross painted a CLIFF [Should be: NIGHT LIGHT, EVENING SEASCAPE, SURF'S UP, CLIFFSIDE, BY THE SEA, DEEP WILDERNESS HOME, CRIMSON TIDE, GRACEFUL WATERFALL]
  const results3 = await collection.find({ elements: "CLIFF" });
  const resultArray3 = await results3.toArray();
  const titles3 = resultArray3.map((c) => c.title);
  console.log(`The episodes that Bob Ross painted a CLIFF are ${titles3}`);

  // Find all of the episode titles where Bob Ross painted a CLIFF and a LIGHTHOUSE [Should be: NIGHT LIGHT]
  const results4 = await collection.find({
    elements: { $all: ["CLIFF", "LIGHTHOUSE"] },
  });
  const resultArray4 = await results4.toArray();
  const titles4 = resultArray4.map((r) => r.title);
  console.log(
    `The episodes that Bob Ross painted a CLIFF and a LIGHTHOUSE are ${titles4}`
  );
}

async function updateEpisodeExercises(client) {
  /**
   * There are some problems in the initial data that was filled in.
   * Let's use update functions to update this information.
   *
   * Note: do NOT change the data.json file
   */
  const collection = await client.db(DB).collection(COLLECTION);

  // Episode 13 in season 30 should be called BLUE RIDGE FALLS, yet it is called BLUE RIDGE FALLERS now. Fix that
  const result1 = await collection.updateOne(
    { episode: "S30E13" },
    { $set: { title: "BLUE RIDGE FALLS" } }
  );
  console.log(
    `Ran a command to update episode 13 in season 30 and it updated ${result1.modifiedCount} episodes`
  );

  // Unfortunately we made a mistake in the arrays and the element type called 'BUSHES' should actually be 'BUSH' as sometimes only one bush was painted.
  // Update all of the documents in the collection that have `BUSHES` in the elements array to now have `BUSH`
  // It should update 120 episodes!
  const result2 = await collection.updateMany(
    {},
    { $set: { "elements.$[element]": "BUSH" } },
    { arrayFilters: [{ element: "BUSHES" }] }
  );
  console.log(
    `Ran a command to update all the BUSHES to BUSH and it updated ${result2.modifiedCount} episodes`
  );
}

async function deleteEpisodeExercise(client) {
  /**
   * It seems an errand episode has gotten into our data.
   * This is episode 14 in season 31. Please remove it and verify that it has been removed!
   */

  const result = await client
    .db(DB)
    .collection(COLLECTION)
    .deleteOne({ episode: "S31E14" });
  console.log(
    `Ran a command to delete episode and it deleted ${result.deletedCount} episodes`
  );
}

async function main() {
  if (process.env.MONGODB_URL == null) {
    throw Error(
      `You did not set up the environment variables correctly. Did you create a '.env' file and add a package to create it?`
    );
  }
  const client = new MongoClient(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();

    // Seed our database
    await seedDatabase(client);

    // CREATE
    await createEpisodeExercise(client);

    // READ
    await findEpisodesExercises(client);

    // UPDATE
    await updateEpisodeExercises(client);

    // DELETE
    await deleteEpisodeExercise(client);
  } catch (err) {
    console.error(err);
  } finally {
    // Always close the connection at the end
    client.close();
  }
}

main();

/**
 * In the end the console should read something like this: 

Created season 9 episode 13 and the document got the id 625e9addd11e82a59aa9ff93
The title of episode 2 in season 2 is WINTER SUN
The season and episode number of the "BLACK RIVER" episode is S02E06
The episodes that Bob Ross painted a CLIFF are NIGHT LIGHT, EVENING SEASCAPE, SURF'S UP, CLIFFSIDE, BY THE SEA, DEEP WILDERNESS HOME, CRIMSON TIDE, GRACEFUL WATERFALL
The episodes that Bob Ross painted a CLIFF and a LIGHTHOUSE are NIGHT LIGHT
Ran a command to update episode 13 in season 30 and it updated 1 episodes
Ran a command to update all the BUSHES to BUSH and it updated 120 episodes
Ran a command to delete episode and it deleted 1 episodes
 
*/
