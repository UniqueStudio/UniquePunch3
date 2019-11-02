import { init } from "./model/db";
import {
  fetchAllMembers,
  fetchAllPunchRecord,
  removeAllMembers
} from "./model/request";
import { generateTime } from "./model/utils";
import { processPunchTime } from "./model/punch";
import { INIT } from "./model/consts";
import { writeFileSync, writeFile } from "fs";

(async () => {
  if (INIT === "TRUE") {
    await init();
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
  await fetchAllPunchRecord(generateTime(10, 17, 0), generateTime(10, 27, 24));
  console.log("Generating Punch Time...");
  // await fetchAllPunchRecord(generateTime(10, 20, 0), generateTime(10, 27, 24));
  const res = await processPunchTime();
  writeFile("punch.json", JSON.stringify(res), () => {
    console.log("Results saved in punch.json.");
  });
})();
