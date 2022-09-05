import mysql from "mysql";
import util from "util";

export const connection = mysql.createConnection({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "bank",
  multipleStatements: true,
});

// to show sql queries
/* connection.on("enqueue", function (sequence) {
  if ("Query" === sequence.constructor.name) {
    console.log(sequence.sql);
  }
}); */

export const execQuery = util.promisify(connection.query.bind(connection));

export const connect = async () => connection.connect();
export const disconnect = async () => connection.end();

export const beginTransaction = async () => connection.beginTransaction();
export const commit = async () => connection.commit();
export const rollback = async () => connection.rollback();
