import { MongoClient } from "mongodb";
import { mongoInfo } from "./consts";

export const databaseConnect = async function() {
  const { url, database } = mongoInfo;
  const client = await MongoClient.connect(`mongodb://${url}/${database}`, {
    useNewUrlParser: true
  });
  return { db: client.db(database), client: client };
};

