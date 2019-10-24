import fetch from "node-fetch";
import { mongoInfo } from "./consts";
import { databaseConnect } from "./db";

export const updateAvatar = async () => {
  const { db, client } = await databaseConnect();
  const { member } = mongoInfo.collection;
};
