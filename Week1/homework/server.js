import util from "util";
import mysql from "mysql";
import { inviteeVal, meetingVal, roomVal, invMeetVal } from "./helper.js";

const connection = mysql.createConnection({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "meetup",
});

const execQuery = util.promisify(connection.query.bind(connection));

const CREATE_INVITEE_TABLE = `CREATE TABLE IF NOT EXISTS invitee(
	invitee_no int not null primary key auto_increment,
	invitee_name varchar(30) not null,
	invited_by varchar(30) null
);`;

const CREATE_ROOM_TABLE = `CREATE TABLE IF NOT EXISTS room(
	room_no int not null primary key auto_increment,
	room_name varchar(255) not null,
	floor_number int not null
);`;

const CREATE_MEETING_TABLE = `CREATE TABLE IF NOT EXISTS meeting(
	meeting_no int not null primary key auto_increment,
	meeting_title varchar(255) not null,
	starting_time date not null,
	ending_time date not null,
	room_no_fk int not null,
	foreign key (room_no_fk) 
		references room(room_no) 
			on delete cascade 
			on update cascade
);`;

const CREATE_INVITEE_MEETING_JOIN_TABLE = `CREATE TABLE IF NOT EXISTS inviteeMeeting(
	inviteeRoom int not null primary key auto_increment,
	invitee_fk int not null,
	meeting_no_fk int not null,
	foreign key (invitee_fk) 
		references invitee(invitee_no)
			on delete cascade 
			on update cascade,
	foreign key (meeting_no_fk) 
		references meeting(meeting_no)
			on delete cascade 
			on update cascade
);`;

const INSERT_INVITEE = `INSERT INTO meetup.invitee (invitee_name, invited_by) VALUES ?;`;
const INSERT_ROOM = `INSERT INTO meetup.room (room_name, floor_number) VALUES ?;`;
const INSERT_MEETING = `INSERT INTO meetup.meeting (meeting_title, starting_time, ending_time, room_no_fk) VALUES ?;`;
const INSERT_INVITEE_MEETING_JOIN = `INSERT INTO meetup.inviteeMeeting (invitee_fk, meeting_no_fk) VALUES ?;`;

const SELECT_ALL_INVITEES = `SELECT invitee_no, invitee_name, invited_by FROM meetup.invitee;`;
const SELECT_ALL_MEETINGS = `SELECT meeting_no, meeting_title, starting_time, ending_time, room_no_fk FROM meetup.meeting;`;
const SELECT_ALL_ROOMS = `SELECT room_no, room_name, floor_number FROM meetup.room;`;

const initialize = async () => {
  connection.connect();

  await execQuery(CREATE_INVITEE_TABLE);
  await execQuery(CREATE_ROOM_TABLE);
  await execQuery(CREATE_MEETING_TABLE);
  await execQuery(CREATE_INVITEE_MEETING_JOIN_TABLE);

  await execQuery(INSERT_INVITEE, inviteeVal(5));
  await execQuery(INSERT_ROOM, roomVal(5));

  const roomResult = await execQuery(SELECT_ALL_ROOMS);
  const roomIds = roomResult.map((res) => res.room_no);

  await execQuery(INSERT_MEETING, meetingVal(roomIds, 5));

  const inviteeResult = await execQuery(SELECT_ALL_INVITEES);
  const inviteeIds = inviteeResult.map((res) => res.invitee_no);

  const meetingResult = await execQuery(SELECT_ALL_MEETINGS);
  const meetIds = meetingResult.map((res) => res.meeting_no);

  await execQuery(INSERT_INVITEE_MEETING_JOIN, invMeetVal(inviteeIds, meetIds));

  connection.end();
};

initialize();
