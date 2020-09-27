import { config } from "dotenv";
import { IJoinTime } from "./utils";

config();

export const mongoInfo = {
  url: process.env.MODE === "DEV" ? "localhost:27017" : "",
  database: "punch",
  collections: {
    member: "member",
    config: "config",
    record: "record",
  },
};

export const thisYear = new Date().getFullYear();

export const memberFilter: IJoinTime = {
  year: thisYear - 2,
  season: 3, // for '秋'
};

export const { CORPID, CORPSECRET, INIT, UPDATE_AVATAR } = process.env;

export const dateRange = {
  start: process.env.START_DATE.split("."),
  end: process.env.END_DATE.split("."),
};
