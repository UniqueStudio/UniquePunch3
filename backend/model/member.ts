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
  userid: string;
  department: TDepartment[];
  gender: 0 | 1;
  avatar: string;
  joinTime: string;
  // punchData: IPunchRecord[];
}

export interface IPunchRecord {
  ruleName: string;
  punchType: "IN" | "OUT";
  exceptionType?: string;
  punchTime: number;
}
