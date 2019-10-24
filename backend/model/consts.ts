import {config} from "dotenv"
config();

export const mongoInfo = {
    url : process.env.MODE === "DEV" ? "localhost:27017" : "",
    database:"punch",
    collection:{
        member:"member"
    }
}

export const {CORPID,CORPSECRET} = process.env;