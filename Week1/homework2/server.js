import dumpImporter from "./dumpImporter.js";

import util from "util";
import mysql from "mysql";

await dumpImporter();

const connection = mysql.createConnection({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "meetup",
});

const COUNTRIES_POPULATION_GT_8M =
  "SELECT Name FROM new_world.country WHERE Population > 8000000;";
const COUNTRIES_HAVE_LAND_IN_NAME =
  "SELECT name FROM new_world.country WHERE name LIKE '%land%';";
const CITIES_POP_BETWEEN_5T_1M =
  "SELECT Name FROM new_world.city WHERE Population > 500000 AND Population < 1000000;";
const COUNTRIES_ON_EUROPA =
  "SELECT Name FROM new_world.country WHERE Continent='Europe';";
const COUNTRIES_ORDER_BY_SURFACE_DESC =
  "SELECT Name FROM new_world.country ORDER BY SurfaceArea DESC;";
const CITIES_ON_NETHERLANDS =
  "SELECT ci.name FROM new_world.city ci LEFT OUTER JOIN new_world.country co ON ci.CountryCode = co.Code WHERE co.Name='Netherlands';";
const POPULATION_OF_ROTTERDAM =
  "SELECT population FROM new_world.city WHERE name='Rotterdam';";
const TOP_TEN_COUNTRIES_BY_SURFACE =
  "SELECT name, surfaceArea FROM new_world.country ORDER BY surfaceArea DESC LIMIT 10;";
const TOP_TEN_MOST_POPULATED_CITIES =
  "SELECT name, population FROM new_world.city ORDER BY population DESC LIMIT 10;";
const WORLD_POPULATION =
  "SELECT SUM(population) as world_population FROM new_world.country;";

const execQuery = util.promisify(connection.query.bind(connection));

const runQueries = async () => {
  connection.connect();

  console.log(
    "1-What are the names of countries with population greater than 8 million?",
    await execQuery(COUNTRIES_POPULATION_GT_8M)
  );

  console.log(
    "2-What are the names of countries that have “land” in their names?",
    await execQuery(COUNTRIES_HAVE_LAND_IN_NAME)
  );

  console.log(
    "3-What are the names of the cities with population in between 500,000 and 1 million?",
    await execQuery(CITIES_POP_BETWEEN_5T_1M)
  );

  console.log(
    "4-What's the name of all the countries on the continent ‘Europe’?",
    await execQuery(COUNTRIES_ON_EUROPA)
  );

  console.log(
    "5-List all the countries in the descending order of their surface areas.",
    await execQuery(COUNTRIES_ORDER_BY_SURFACE_DESC)
  );

  console.log(
    "6-What are the names of all the cities in the Netherlands?",
    await execQuery(CITIES_ON_NETHERLANDS)
  );

  console.log(
    "7-What is the population of Rotterdam?",
    await execQuery(POPULATION_OF_ROTTERDAM)
  );

  console.log(
    "8-What's the top 10 countries by Surface Area?",
    await execQuery(TOP_TEN_COUNTRIES_BY_SURFACE)
  );
  console.log(
    "9-What's the top 10 most populated cities?",
    await execQuery(TOP_TEN_MOST_POPULATED_CITIES)
  );
  
  console.log(
    "10-What is the population number of the world?",
    await execQuery(WORLD_POPULATION)
  );

  connection.end();
};

runQueries();
