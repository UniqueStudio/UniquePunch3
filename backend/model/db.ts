import { MongoClient } from "mongodb";
import { mongoInfo } from "./consts";
import { fetchAllMembers, fetchAllPunchRecord } from "./request";
import { generateTime } from "./utils";

export const databaseConnect = async function() {
  const { url, database } = mongoInfo;
  const client = await MongoClient.connect(`mongodb://${url}/${database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  return { db: client.db(database), client: client };
};

export const init = async function() {
  const { client, db } = await databaseConnect();
  db.collection(mongoInfo.collections.record).createIndex({
    userid: 1,
    checkin_time: 1
  });
  db.collection(mongoInfo.collections.member).createIndex({ userid: 1 });
  client.close();
};