import { faker } from "@faker-js/faker";
// import moment from "moment";

const isNotExist = (array, item, fields) =>
  !array.find((inv) => fields.every((field) => inv[field] === item[field]));

const random = (min = 0, max = 10) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomFromArray = (array) =>
  array[Math.floor(Math.random() * array.length)];

const convertValueArray = (array) => [array.map((item) => Object.values(item))];

const generateRandomUniversity = (num) => {
  return [...Array(num).keys()].map(
    (_) => faker.address.cityName() + " University"
  );
};

const generateRandomAuthor = (num = 1) => {
  const authors = [];
  const universities = generateRandomUniversity(num);
  while (authors.length < num) {
    const gender = getRandomFromArray(["male", "female", "none"]);
    const author = {
      name: faker.name.fullName({ sex: gender != "none" ? gender : undefined }),
      university: getRandomFromArray(universities),
      dataOfBirth: faker.date.birthdate({ min: 30, max: 80, mode: "age" }),
      hIndex: Math.floor(Math.random() * 190),
      gender: gender,
    };
    if (isNotExist(authors, author, ["name"])) {
      authors.push(author);
    }
  }
  console.log("Random Authors Generated: ", authors);
  return authors;
};

const generateRandomResearchPaper = (num) => {
  const papers = [];
  while (papers.length < num) {
    const paper = {
      paper_title: faker.random.words(random(3, 8)),
      conference: `${faker.address.cityName()} ${faker.random.word()} Conference`,
      publish_date: faker.date.birthdate({ min: 0, max: 40, mode: "age" }),
    };
    if (isNotExist(papers, paper, ["paper_title"])) {
      papers.push(paper);
    }
  }
  console.log("Random Research Papers Generated: ", papers);
  return papers;
};

export const matchAuthorsWithRandomMentors = (authorIds) => {
  const matchList = authorIds
    .map((record) => record.author_no)
    .map((authorId, _, array) => {
      let mentorId = getRandomFromArray(array);
      if (mentorId === authorId) {
        return;
      }
      return [mentorId, authorId];
    })
    .filter((item) => !!item);
  return matchList;
};

export const matchPapersWithAuthors = (paperIds, authorsIds) => {
  const authorNoList = authorsIds.map((authorId) => authorId.author_no);
  const matchList = [];
  paperIds
    .map((paperIds) => paperIds.paper_id)
    .forEach((paper_id) => {
      const theNumberOfAuthorsThatPaperBelongs = random(1, 3);
      const authorCache = [];
      for (let i = 0; i < theNumberOfAuthorsThatPaperBelongs; i++) {
        let randomAuthor;
        do {
          randomAuthor = getRandomFromArray(authorNoList);
        } while (authorCache.includes(randomAuthor)); // for the purpose of guaranteeing the distinction of authors
        authorCache.push(randomAuthor);
        matchList.push([paper_id, getRandomFromArray(authorNoList)]);
      }
    });
  return [matchList];
};

export const authorVal = (num) => convertValueArray(generateRandomAuthor(num));
export const researchPaperVal = (num) =>
  convertValueArray(generateRandomResearchPaper(num));
