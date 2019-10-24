export type TDepartment =
  | "AI"
  | "Android"
  | "Design"
  | "Game"
  | "iOS"
  | "Lab"
  | "PM"
  | "Web"
  | "Other";

export interface IMember {
  name: string;
  userId: string;
  department: TDepartment[];
  gender: 0 | 1;
  avatar: string;
  joinTime: string;
  punchData: IPunchRecord[];
}

export interface IPunchRecord {
  groupName: string;
  punchType: "IN" | "OUT";
  exceptionType?: string;
  punchTime: number;
}
