import fs from "fs";

const input = fs.readFileSync("./input.txt", "utf8").replace(/\n/g, "");

const results = Array.from(
  input.matchAll(/(?<=(?:do\(\)|^)(?:(?!don't\(\)).)*?)mul\((\d+),(\d+)\)/g)
)
  .map(([_, first, second]) => Number(first) * Number(second))
  .reduce((acc, curr) => acc + curr, 0);

console.log({ results });
