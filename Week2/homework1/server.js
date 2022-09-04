import mysql from "mysql";
import util from "util";

import {
  authorVal,
  researchPaperVal,
  matchAuthorsWithRandomMentors,
  matchPapersWithAuthors,
} from "./helper.js";

const connection = mysql.createConnection({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "meetup",
  multipleStatements: true,
});

const execQuery = util.promisify(connection.query.bind(connection));

const execBulkQuery = async (query, paramArray) => {
  const results = [];
  paramArray.forEach(async (params) => {
    const result = await execQuery(query, params);
    results.push(result);
  });
  return results;
};

const CREATE_DATABASE = `CREATE DATABASE IF NOT EXISTS research;`;

const USE_DATABASE = `USE research;`;

const DROP_AUTHOR_RESEARCH_TABLE = `DROP TABLE IF EXISTS author_research_paper;`;
const DROP_AUTHORS_TABLE = `DROP TABLE IF EXISTS authors;`;
const DROP_RESEARCH_TABLE = `DROP TABLE IF EXISTS research_Papers;`;

const CREATE_AUTHOR_TABLE = `CREATE TABLE IF NOT EXISTS authors(
                                author_no int not null primary key auto_increment,
                                author_name varchar(30) not null,
                                university varchar(50) null,
                                date_of_birth date null,
                                h_index int null,
                                gender varchar(6)
                            );`;

const ALTER_AUTHOR_TABLE_ADD_MENTOR = `ALTER TABLE authors ADD COLUMN mentor int;`;

const ALTER_AUTHOR_TABLE_ADD_FOREIGN_KEY = `ALTER TABLE authors ADD FOREIGN KEY (mentor) REFERENCES authors(author_no);`;

const CREATE_RESEARCH_TABLE = `CREATE TABLE IF NOT EXISTS research_Papers(
                                  paper_id int not null primary key auto_increment,
                                  paper_title varchar(255) not null,
                                  conference varchar(100) null,
                                  publish_date date null
                              );`;

const CREATE_AUTHOR_RESEARCH_JOINT_TABLE = `CREATE TABLE IF NOT EXISTS author_research_paper(
                                                author_research_id int not null primary key auto_increment,
                                                author_no int not null,
                                                paper_id int not null,
                                                foreign key (author_no) references authors(author_no),
                                                foreign key (paper_id) references research_Papers(paper_id)
                                            );`;

const INSERT_AUTHOR = `INSERT INTO authors (author_name, university, date_of_birth, h_index, gender) VALUES ?;`;
const INSERT_RESEARCH_PAPER = `INSERT INTO research_Papers (paper_title, conference, publish_date) VALUES ?;`;
const INSERT_AUTHOR_RESEARCH_PAPER = `INSERT INTO author_research_paper (paper_id, author_no) VALUES ?`;

const SELECT_AUTHOR_IDS = `SELECT author_no FROM authors;`;
const SELECT_PAPER_IDS = `SELECT paper_id FROM research_Papers;`;

const UPDATE_MENTORS = `UPDATE authors SET mentor = ? WHERE author_no = ?;`;

const SELECT_AUTHORS_WITH_MENTORS = `SELECT
                                          a.author_name AS author,
                                          m.author_name AS mentor
                                      FROM authors a
                                          LEFT JOIN authors m ON a.mentor = m.author_no;`;

const SELECT_AUTHORS_WITH_PAPERS = `SELECT a.*, rp.paper_title
                                    FROM authors a
                                        LEFT JOIN author_research_paper arp ON a.author_no = arp.author_no
                                        LEFT JOIN research_Papers rp ON arp.paper_id = rp.paper_id;`;

const SELECT_PAPERS_WITH_AUTHORS = `SELECT p.paper_title, COUNT(a.author_no) as author_count
                                    FROM research_Papers p
                                        LEFT JOIN author_research_paper arp ON p.paper_id = arp.paper_id
                                        LEFT JOIN authors a ON arp.author_no = a.author_no
                                    GROUP BY (p.paper_id)`;

const SUM_OF_PAPERS_WRITTEN_BY_A_FEMALE = `SELECT
                                                COUNT(DISTINCT(p.paper_id))
                                            FROM research_Papers p
                                                LEFT JOIN author_research_paper arp ON p.paper_id = arp.paper_id
                                                LEFT JOIN authors a ON arp.author_no = a.author_no
                                            WHERE a.gender = "female";`;

const AVG_H_INDEX_PER_UNIVERSITY = `SELECT university, AVG(h_index) FROM authors GROUP BY (university);`;

const TOTAL_PAPERS_PER_UNIVERSITY = `SELECT
                                          COUNT(DISTINCT(rp.paper_id)) as sumOfPapers,
                                          a.university
                                      FROM research_Papers rp
                                          LEFT JOIN author_research_paper arp ON rp.paper_id = arp.paper_id
                                          LEFT JOIN authors a ON arp.author_no = a.author_no
                                      GROUP BY (a.university)
                                      ORDER BY sumOfPapers DESC;`;

const MIN_MAX_H_INDEX_PER_UNIVERSITY = `SELECT
                                            COUNT(author_no) as numOfAuthor,
                                            MIN(h_index) as minHIndex,
                                            MAX(h_index) as maxHIndex,
                                            university
                                        FROM authors
                                        GROUP BY university
                                        ORDER BY numOfAuthor DESC`;

const initialize = async () => {
  connection.connect();

  /** Create Tables **/
  await execQuery(CREATE_DATABASE);
  await execQuery(USE_DATABASE);
  await execQuery(DROP_AUTHOR_RESEARCH_TABLE);
  await execQuery(DROP_AUTHORS_TABLE);
  await execQuery(DROP_RESEARCH_TABLE);
  await execQuery(CREATE_AUTHOR_TABLE);
  await execQuery(ALTER_AUTHOR_TABLE_ADD_MENTOR);
  await execQuery(ALTER_AUTHOR_TABLE_ADD_FOREIGN_KEY);
  await execQuery(CREATE_RESEARCH_TABLE);
  await execQuery(CREATE_AUTHOR_RESEARCH_JOINT_TABLE);

  /** Populate Tables **/
  // insert random 15 authors without mentors
  await execQuery(INSERT_AUTHOR, authorVal(15));
  const authorIds = await execQuery(SELECT_AUTHOR_IDS);

  // match the authors and mentors randomly
  const params = matchAuthorsWithRandomMentors(authorIds);
  await execBulkQuery(UPDATE_MENTORS, params);

  // insert random 30 research paper
  await execQuery(INSERT_RESEARCH_PAPER, researchPaperVal(30));
  const paperIds = await execQuery(SELECT_PAPER_IDS);

  // match the papers and authors,
  // just like one paper can be written by more than one author,
  // one author can contribute more than one papers
  // many-to-many relationship
  await execQuery(
    INSERT_AUTHOR_RESEARCH_PAPER,
    matchPapersWithAuthors(paperIds, authorIds)
  );

  /** Search Queries **/
  // 3.1 - Write a query that prints names of all authors and their corresponding mentors.
  console.log(
    "3.1 - names of all authors and their corresponding mentors.",
    await execQuery(SELECT_AUTHORS_WITH_MENTORS)
  );

  // 3.2 - Write a query that prints all columns of authors and their published paper_title. If there is an author without any research_Papers, print the information of that author too.
  console.log(
    "3.2 - all authors and their papers.",
    await execQuery(SELECT_AUTHORS_WITH_PAPERS)
  );

  // 4.1 - All research papers and the number of authors that wrote that paper.
  console.log(
    "4.1 - All papers and their authors.",
    await execQuery(SELECT_PAPERS_WITH_AUTHORS)
  );

  // 4.2 - Sum of the research papers published by all female authors.
  console.log(
    "4.2 - Sum of the research papers published by all female authors.",
    await execQuery(SUM_OF_PAPERS_WRITTEN_BY_A_FEMALE)
  );

  // 4.3 - Average of the h-index of all authors per university.
  console.log(
    "4.3 - Average of the h-index of all authors per university.",
    await execQuery(AVG_H_INDEX_PER_UNIVERSITY)
  );

  // 4.4 - Sum of the research papers of the authors per university.
  console.log(
    "4.4 - Sum of the research papers of the authors per university.",
    await execQuery(TOTAL_PAPERS_PER_UNIVERSITY)
  );

  // 4.5 - Minimum and maximum of the h-index of all authors per university.
  console.log(
    "4.5 - Minimum and maximum of the h-index of all authors per university.",
    await execQuery(MIN_MAX_H_INDEX_PER_UNIVERSITY)
  );

  connection.end();
};

initialize();
