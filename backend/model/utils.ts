export const departmentMap = {
  1: "Other",
  2: "Web",
  3: "PM",
  4: "AI",
  5: "Android",
  6: "Game",
  7: "Lab",
  8: "iOS",
  9: "Design"
};

export const getTime = (month, day,hour, year = new Date().getFullYear()) => {
  const date =  Date.UTC(year, month - 1, day, hour-8, 0, 0, 0) / 1000;
  console.log(date);
  return date;
};
