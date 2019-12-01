import fetch from "node-fetch";
import { promisify } from "util";
import { pipeline } from "stream";
import { createWriteStream } from "fs";
import { IUser } from "./request";

export const fetchAvatar = (user: IUser) => {
  fetch(user.avatar)
    .then(res => {
      if (!res.ok) {
        throw new Error(`unexpected response: ${res.statusText}`);
      }
      promisify(pipeline)(
        res.body,
        createWriteStream(`./avatar/${user.userid}.jpeg`)
      );
    })
    .catch(e => null);
  return `/avatar/${user.userid}.jpeg`;
};
