import fetch from "node-fetch";
import { CORPID, CORPSECRET, mongoInfo } from "./consts";
import { IMember } from "./member";
import { databaseConnect } from "./db";

interface IResp {
  errcode: number;
  errmsg: string;
}

interface IAccessToken {
  access_token: string;
  expires_in: number;
  updateAt?: number;
}

interface IUserList {
  userlist: {
    userid: string;
    name: number;
    gender: 0 | 1;
    department: number[];
    avatar: string;
    extattr: { attrs: { value: string }[] };
  }[];
}

export const fetchAccessToken = async () => {
  const respRaw = await fetch(
    `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${CORPID}&corpsecret=${CORPSECRET}`
  );
  const resp: IResp & IAccessToken = await respRaw.json();

  if (resp.errcode !== 0) {
    throw Error(`updateAccessToken: ${resp.errmsg}`);
  }

  const { access_token, expires_in } = resp;
  const updateAt = Date.now();

  const { db } = await databaseConnect();
  const { collections } = mongoInfo;
  const col = db.collection(collections.config);

  if (!(await col.findOne({ name: "config" }))) {
    await col.insertOne({ name: "config", access_token, expires_in, updateAt });
  } else {
    await col.updateOne(
      { name: "config" },
      { $set: { access_token, expires_in, updateAt } }
    );
  }

  return access_token;
};

export const getAccessToken = async () => {
  const { db } = await databaseConnect();
  const { collections } = mongoInfo;
  const col = db.collection(collections.config);
  const query: IAccessToken = await col.findOne({ name: "config" });
  if (!query) {
    return await fetchAccessToken();
  }

  const { access_token, expires_in, updateAt } = query;
  if (Date.now() - updateAt >= expires_in * 1000) {
    return await fetchAccessToken();
  }

  return access_token;
};

export const fetchAllMembers = async () => {
  const access_token = await getAccessToken();
  const respRaw = await fetch(
    `https://qyapi.weixin.qq.com/cgi-bin/user/list?` +
      `access_token=${access_token}&department_id=${1}&fetch_child=${1}`
  );
  const resp: IResp & IUserList = await respRaw.json();

  if (resp.errcode !== 0) {
    throw Error(`updateAllUsers: ${resp.errmsg}`);
  }
  const members = resp.userlist
    .filter(user => user.extattr.attrs[0] && user.extattr.attrs[0].value !== "")
    .map(user => {
      return {
        name: user.name,
        userId: user.userid,
        department: user.department,
        gender: user.gender,
        avatar: user.avatar,
        joinTime: user.extattr.attrs[0].value
      };
    });

  const { db } = await databaseConnect();
  const { collections } = mongoInfo;
  const col = db.collection(collections.member);

  if ((await col.countDocuments({})) === 0) {
    await col.insertMany(members);
  }
  return;
};

export const removeAllMembers = async () => {
  const { db } = await databaseConnect();
  const { collections } = mongoInfo;
  const col = db.collection(collections.member);
  return await col.deleteMany({});
};
