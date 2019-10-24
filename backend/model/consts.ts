import { config } from "dotenv";
config();

export const mongoInfo = {
  url: process.env.MODE === "DEV" ? "localhost:27017" : "",
  database: "punch",
  collections: {
    member: "member",
    config: "config"
  }
};

export const { CORPID, CORPSECRET } = process.env;
