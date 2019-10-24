import fetch from "node-fetch";
import { mongoInfo } from "./consts";
import { databaseConnect } from "./db";

export const fetchAvatar = async () => {
  const { db, client } = await databaseConnect();
  const { member } = mongoInfo.collections;
  
};
