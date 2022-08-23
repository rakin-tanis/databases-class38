import {
  isNotExist,
  getRandomFromArray,
  generateRandomInvitee,
  generateRandomRoom,
  generateRandomMeeting,
  convertValueArray,
} from "../helper.js";

describe("isNotExist", () => {
  it("it should return true", async () => {
    const array = [
      { name: "akin", invitedBy: "yavuz" },
      { name: "selim", invitedBy: "ahmet" },
    ];
    const item = { name: "mehmet", invitedBy: "huseyin" };
    const fields = Object.keys(item);

    expect(isNotExist(array, item, fields)).toBeTruthy();
  });

  it("it should return true", async () => {
    const array = [
      { name: "akin", invitedBy: "yavuz" },
      { name: "selim", invitedBy: "ahmet" },
    ];
    const item = { name: "akin", invitedBy: "huseyin" };
    const fields = Object.keys(item);

    expect(isNotExist(array, item, fields)).toBeTruthy();
  });

  it("it should return false when the same element is inside the array", async () => {
    const array = [
      { name: "akin", invitedBy: "yavuz" },
      { name: "selim", invitedBy: "ahmet" },
    ];
    const item = { name: "akin", invitedBy: "yavuz" };
    const fields = Object.keys(item);

    expect(isNotExist(array, item, fields)).toBeFalsy();
  });

  it("it should only check the given fields and return false", async () => {
    const array = [
      { name: "akin", invitedBy: "yavuz" },
      { name: "selim", invitedBy: "ahmet" },
    ];
    const item = { name: "akin", invitedBy: "ali" };
    const fields = ["name"];

    expect(isNotExist(array, item, fields)).toBeFalsy();
  });

  it("it should only check the given fields and return true", async () => {
    const array = [
      { name: "akin", invitedBy: "yavuz" },
      { name: "selim", invitedBy: "ahmet" },
    ];
    const item = { name: "ahmet", invitedBy: "ali" };
    const fields = ["name"];

    expect(isNotExist(array, item, fields)).toBeTruthy();
  });
});

describe("getRandomFromArray", () => {
  it("it should return random selected array items", () => {
    const array = [1, 2, 3, 4, 5, 6];
    Array.from(100).forEach((_) => {
      const random = getRandomFromArray(array);
      expect(array.includes(random)).toBeTruthy();
    });
  });
});

describe("generateRandomInvitee", () => {
  it("it should generate 5 number of distinct invitees", () => {
    const invitees = generateRandomInvitee(5);
    const distinctInvitees = Array.from(
      new Set(invitees.map((inv) => inv.name))
    );

    expect(distinctInvitees.length).toBe(5);
  });
});

describe("generateRandomRoom", () => {
  it("it should generate 5 number of distinct rooms", () => {
    const rooms = generateRandomRoom(5);
    const distinctRooms = Array.from(
      new Set(rooms.map((room) => room.name + " " + room.floor))
    );

    expect(distinctRooms.length).toBe(5);
  });
});

describe("generateRandomMeeting", () => {
  it("it should generate 5 number of distinct meetings", () => {
    const meetings = generateRandomMeeting([1, 2, 3, 4, 5], 5);
    const distinctMeetings = Array.from(
      new Set(
        meetings.map(
          (meeting) =>
            meeting.title +
            " " +
            meeting.startDate +
            " " +
            meeting.endDate +
            " " +
            meeting.roomId
        )
      )
    );

    expect(distinctMeetings.length).toBe(5);
  });
});

describe("convertValueArray", () => {
  it("it should return true", () => {
    const array = [
      { name: "fuchsia", floor: 1 },
      { name: "lime", floor: 8 },
      { name: "orange", floor: 4 },
      { name: "lavender", floor: 10 },
      { name: "salmon", floor: 2 },
    ];
    const valueArray = convertValueArray(array);
    expect(valueArray).toEqual([[
      ["fuchsia", 1],
      ["lime", 8],
      ["orange", 4],
      ["lavender", 10],
      ["salmon", 2],
    ]]);
  });
});
