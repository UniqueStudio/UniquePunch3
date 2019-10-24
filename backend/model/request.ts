import fetch from "node-fetch";
import { CORPID, CORPSECRET, mongoInfo, memberFilter } from "./consts";
import { IMember } from "./member";
import { databaseConnect } from "./db";
import { generateTime, getUserList, departmentMap } from "./utils";

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
  userlist: IUser[];
}

interface IUser {
  userid: string;
  name: number;
  gender: 0 | 1;
  department: number[];
  avatar: string;
  extattr: { attrs: { value: string }[] };
}

interface IRespPunch {
  checkindata: ICheckInData[];
}

export interface ICheckInData {
  userid: string;
  checkin_type: string;
  exception_type: string;
  checkin_time: number;
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

  const { client, db } = await databaseConnect();
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
  client.close();

  return access_token;
};

export const getAccessToken = async () => {
  const { client, db } = await databaseConnect();
  const { collections } = mongoInfo;
  const col = db.collection(collections.config);
  const query: IAccessToken = await col.findOne({ name: "config" });
  if (!query) {
    return await fetchAccessToken();
  }
  client.close();
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
        department: user.department.map(dept => departmentMap[dept]),
        gender: user.gender,
        avatar: user.avatar,
        joinTime: user.extattr.attrs[0].value
      };
    });

  const { client, db } = await databaseConnect();
  const { collections } = mongoInfo;
  const col = db.collection(collections.member);

  if ((await col.countDocuments({})) === 0) {
    await col.insertMany(members);
  }
  client.close();
};

export const removeAllMembers = async () => {
  const { client, db } = await databaseConnect();
  const { collections } = mongoInfo;
  const col = db.collection(collections.member);
  await col.deleteMany({});
  client.close();
};

export const fetchPunchRecordByUserlist = async (
  starttime: number,
  endtime: number,
  userlist: IMember[]
) => {
  const access_token = await getAccessToken();
  // console.log( userlist)
  const respRaw = await fetch(
    `https://qyapi.weixin.qq.com/cgi-bin/checkin/getcheckindata?access_token=${access_token}`,
    {
      method: "POST",
      body: JSON.stringify({
        opencheckindatatype: 3, // 1 for regular punch, 2 for outdoor punch and 3 for all types of punch
        starttime, // unix timestamp in second
        endtime: endtime,
        useridlist: userlist.map(user => user.userId)
      })
    }
  );
  const resp: IResp & IRespPunch = await respRaw.json();

  if (resp.errcode !== 0) {
    throw Error(`fetchPunchByUserlist: ${resp.errmsg}`);
  }

  const { client, db } = await databaseConnect();
  const { collections } = mongoInfo;
  const col = db.collection(collections.record);

  const res = await Promise.all(
    resp.checkindata.map(punch => {
      const { userid, checkin_type, checkin_time, exception_type } = punch;
      return col.updateOne(
        { checkin_time },
        {
          $set: {
            userid,
            checkin_type,
            exception_type,
            checkin_time
          }
        },
        { upsert: true }
      );
    })
  );
  client.close();
};

export const fetchAllPunchRecord = async (
  starttime: number,
  endtime: number
) => {
  const userlist = await getUserList();
  console.log(userlist)
  const page = Math.floor(userlist.length / 100 + 1);
  for (let i = 0; i < page; i++) {
    await fetchPunchRecordByUserlist(
      starttime,
      endtime,
      userlist.slice(i * 100, (i + 1) * 100)
    );
  }
};

// fetchAllMembers();
fetchAllPunchRecord(generateTime(10, 20, 0), generateTime(10, 27, 24));
