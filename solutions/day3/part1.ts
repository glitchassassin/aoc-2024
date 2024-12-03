import fs from "fs";

const input = fs.readFileSync("./input.txt", "utf8");

const results = Array.from(
  input.matchAll(/mul\((?<first>\d+),(?<second>\d+)\)/g)
)
  .map(([_, first, second]) => Number(first) * Number(second))
  .reduce((acc, curr) => acc + curr, 0);

console.log(results);
