import { faker } from "@faker-js/faker";
import moment from "moment";

export const isNotExist = (array, item, fields) =>
  !array.find((inv) => fields.every((field) => inv[field] === item[field]));

const getRandomFromArray = (array) =>
  array[Math.floor(Math.random() * array.length)];

export const generateRandomInvitee = (num = 1) => {
  const invitees = [];
  while (invitees.length < num) {
    const invitee = {
      name: faker.name.fullName(),
      invitedBy: faker.name.fullName(),
    };
    if (isNotExist(invitees, invitee, ["name"])) {
      invitees.push(invitee);
    }
  }
  console.log("random invitees generated: ", invitees);
  return invitees;
};

export const generateRandomRoom = (num = 1) => {
  const rooms = [];
  while (rooms.length < num) {
    const room = {
      name: faker.color.human(),
      floor: Math.floor(Math.random() * 10) + 1,
    };
    if (isNotExist(rooms, room, Object.keys(room))) {
      rooms.push(room);
    }
  }
  console.log("random rooms generated:", rooms);
  return rooms;
};

export const generateRandomMeeting = (roomIds, num = 1) => {
  const meetings = [];
  while (meetings.length < num) {
    const date = faker.date.future();
    const meeting = {
      title: faker.word.noun(),
      startDate: date,
      endDate: moment(date).add(2, "hours").toDate(),
      roomId: getRandomFromArray(roomIds),
    };
    if (isNotExist(meetings, meeting, Object.keys(meeting))) {
      meetings.push(meeting);
    }
  }
  console.log("random meetings generated:", meetings);
  return meetings;
};

export const matchInviteesWithMeeting = (inviteeIds, meetingIds) => {
  const result = inviteeIds.map((inv) => [inv, getRandomFromArray(meetingIds)]);
  return result;
};

export const convertValueArray = (array) => [
  array.map((item) => Object.keys(item).map((key) => item[key])),
];

export const inviteeVal = (num) =>
  convertValueArray(generateRandomInvitee(num));
export const roomVal = (num) => convertValueArray(generateRandomRoom(num));
export const meetingVal = (roomIds, num) =>
  convertValueArray(generateRandomMeeting(roomIds, num));
export const invMeetVal = (inviteeIds, meetingIds) =>
  convertValueArray(matchInviteesWithMeeting(inviteeIds, meetingIds));
