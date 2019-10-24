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
    console.log("Updating all members...");
    await removeAllMembers();
    await fetchAllMembers();
    console.log("Fetching designated records...");
    await fetchAllPunchRecord(generateTime(9, 1, 0), generateTime(10, 27, 24));
    console.log("Initized successfully!");
  }
  console.log("Generating Punch Time...");
  const res = await processPunchTime();
  writeFile("punch.json", JSON.stringify(res), () => {
    console.log("Results saved in punch.json.");
  });
})();
