import { config } from "dotenv";
import { Season, IJoinTime } from "./utils";
config();

export const mongoInfo = {
  url: process.env.MODE === "DEV" ? "localhost:27017" : "",
  database: "punch",
  collections: {
    member: "member",
    config: "config",
    record: "record"
  }
};

export const memberFilter: IJoinTime = {
  year: 2017,
  season: 3
};

export const { CORPID, CORPSECRET, INIT } = process.env;
