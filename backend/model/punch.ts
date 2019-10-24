import { writeFileSync } from "fs";
import { CORPID, CORPSECRET, mongoInfo } from "./consts";
import { databaseConnect } from "./db";
import { getUserList } from "./utils";
import { ICheckInData } from "./request";

const processPunchTime = async () => {
  const userlist = await getUserList();
  const { client, db } = await databaseConnect();
  const { collections } = mongoInfo;
  const col = db.collection(collections.record);
  const res = [];

  for (const user of userlist) {
    const { userId: userid, name, department } = user;
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
    res.push({ name, department, punchTime: (punchTime / 3600).toFixed(1) });
  }
  client.close();
  writeFileSync("punch.json", JSON.stringify(res));
};

const validatePunch = (record: ICheckInData) => {
  const date = new Date(record.checkin_time * 1000);
  const hour = date.getHours();
  return record.exception_type.length === 0 && hour >= 6 && hour < 24;
};

const validatePunchPeriod = (
  startRecord: ICheckInData,
  endRecord: ICheckInData
) => {
  const start = new Date(startRecord.checkin_time * 1000);
  const end = new Date(endRecord.checkin_time * 1000);
  return start.getDate() === end.getDate();
};

processPunchTime();
