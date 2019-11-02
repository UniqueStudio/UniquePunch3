require("fs").writeFile(
  "sorted.json",
  JSON.stringify(require("./punch.json").sort((a, b) => b.time - a.time)),
  ()=>{})