import mysql from "mysql";
import util from "util";
import dumpImporter from "./dumpImporter.js";

export const conn = mysql.createConnection({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "world",
  multipleStatements: true,
});



conn.on("enqueue", function (sequence) {
  if ("Query" === sequence.constructor.name) {
    console.log(sequence.sql);
  }
});

function getPopulation(Country, name, code, cb) {
  // assuming that connection to the database is established and stored as conn
  conn.query(
    `SELECT Population FROM ${Country} WHERE Name = '${name}' and code = '${code}'`,
    function (err, result) {
      if (err) cb(err);
      if (result.length == 0) cb(new Error("Not found"));
      cb(null, result);
    }
  );
}

function getPopulationSanitized(Country, name, code, cb) {
  // assuming that connection to the database is established and stored as conn
  conn.query(
    `SELECT Population FROM ? WHERE Name = ? and code = ?`,
    function (err, result) {
      if (err) cb(err);
      if (result.length == 0) cb(new Error("Not found"));
      cb(null, result);
    }
  );
}

const main = async() => {
  await dumpImporter();

  conn.connect();

  // without sql injection
  getPopulation("country", "Netherlands", "NLD", (err, result) => {
    console.log(err, result);
  });

  // with dangerous code
  const harmfulCode = `NLD'; drop table city; select name from country where name='%al`;
  
  // getPopulation("country", "Netherlands", harmfulCode, console.log); 
  

  getPopulationSanitized("country", "Netherlands", harmfulCode, console.log);

  conn.end();
};

main();
