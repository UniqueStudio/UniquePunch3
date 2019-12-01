import { init } from "./model/db";
import {
  fetchAllMembers,
  fetchAllPunchRecord,
  removeAllMembers,
  removeAllRecords
} from "./model/request";
import { generateTime } from "./model/utils";
import { processPunchTime } from "./model/punch";
import { INIT, dateRange } from "./model/consts";
import { writeFile } from "fs";
import { serverStart } from "./server";

const { start, end } = dateRange;

(async () => {
  if (INIT === "TRUE") {
    await init();
    console.log("Removing all records...");
    await removeAllRecords();
    console.log("Removing all members...");
    await removeAllMembers();
    console.log("Fetching all members...");
    await fetchAllMembers();
    // await fetchAllPunchRecord(
    //   generateTime(10, 17, 0),
    //   generateTime(10, 27, 24)
    // );
    console.log("Initized successfully!");
  }
  console.log("Fetching designated records...");
  await fetchAllPunchRecord(
    generateTime(start[0], start[1], 0),
    generateTime(end[0], end[1], 24)
  );
  console.log("Generating Punch Time...");
  const res = await processPunchTime();
  writeFile(
    "punch.json",
    JSON.stringify({
      startTime: `2019-${start[0]}-${start[1]} 00:00`,
      endTime: `2019-${end[0]}-${end[1]} 24:00`,
      data: res.sort((a, b) => b.time - a.time)
    }),
    async () => {
      console.log("Results saved in punch.json.");
      serverStart();
    }
  );
})();
