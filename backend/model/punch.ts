import { writeFileSync } from "fs";
import { CORPID, CORPSECRET, INIT, mongoInfo, THRESHOLD } from "./consts";
import { databaseConnect } from "./db";
import { getUserList, parseJoinTime } from "./utils";
import { ICheckInData } from "./request";

export const processPunchTime = async () => {
  const userlist = await getUserList();
  const { client, db } = await databaseConnect();
  const { collections } = mongoInfo;
  const col = db.collection(collections.record);
  const res = [];

  for (const user of userlist) {
    const { userid: userid, name, department, joinTime } = user;
    const records: ICheckInData[] = await col
      .find({ userid: userid })
      .sort({ checkin_time: 1 })
      .toArray();
    let needIn = true;
    let lastInRecord = {} as ICheckInData;
    let punchTime = 0;
    records
      .filter(record => validatePunch(record))
      .forEach((record, index, records) => {
        const { checkin_type, checkin_time } = record;
        if (needIn && checkin_type !== "上班打卡") {
          return;
        }
        if (checkin_type === "下班打卡") {
          if (validatePunchPeriod(lastInRecord, record)) {
            punchTime += checkin_time - lastInRecord.checkin_time;
          }
        } else {
          lastInRecord = record;
          needIn = false;
        }
      });
      const time = (punchTime / 3600).toFixed(1);
    res.push({
      userid,
      name,
      group: department,
      time,
      passed: parseJoinTime(joinTime) < +THRESHOLD ? 30 : 40,
    });
  }
  client.close();
  return res;
};
/**
 *
 * @param record
 * @description To check if the given record is valid (6:00 to 24:00 only).
 */
const validatePunch = (record: ICheckInData) => {
  const date = new Date(record.checkin_time * 1000);
  const hour = date.getHours();
  return record.exception_type.length === 0 && hour >= 6 && hour < 24;
};
/**
 *
 * @param startRecord
 * @param endRecord
 * @description To check if the given records are generated in the same day.
 */
const validatePunchPeriod = (
  startRecord: ICheckInData,
  endRecord: ICheckInData
) => {
  const start = new Date(startRecord.checkin_time * 1000);
  const end = new Date(endRecord.checkin_time * 1000);
  return start.getDate() === end.getDate();
};
