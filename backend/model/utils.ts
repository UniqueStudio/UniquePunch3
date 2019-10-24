import { databaseConnect } from "./db";
import { mongoInfo, memberFilter } from "./consts";
import { IMember } from "./member";

export const departmentMap = {
  1: "Other",
  2: "Web",
  3: "PM",
  4: "AI",
  5: "Android",
  6: "Game",
  7: "Lab",
  8: "iOS",
  9: "Design"
};

export interface IJoinTime {
  year: number;
  season: Season;
}

export type Season = 1 | 2 | 3 | 4;

export const generateTime = (
  month,
  day,
  hour,
  year = new Date().getFullYear()
) => {
  const date = Date.UTC(year, month - 1, day, hour - 8, 0, 0, 0) / 1000;
  return date;
};

export const parseJoinTime = (joinTime: string) => {
  const year = parseInt(joinTime.substr(0, 4));
  let season: Season = 1; // 1, 2, 3, 4 for spring, summer, fall, winter
  [/春/, /夏/, /秋/, /冬/].forEach((regexp, index) => {
    if (regexp.test(joinTime)) {
      season += index;
    }
  });
  return year * 10 + season;
};

export const getUserList = async (filter: IJoinTime = memberFilter) => {
  const { client, db } = await databaseConnect();
  const { collections } = mongoInfo;
  const col = db.collection(collections.member);
  const res: IMember[] = await col
    .find({})
    .project({ _id: 0, userId: 1, name: 1, department: 1, joinTime: 1 })
    .toArray();
  client.close();
  return res.filter(user => {
    const joinTime = parseJoinTime(user.joinTime);
    return joinTime >= filter.year * 10 + filter.season;
  });
};
