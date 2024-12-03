import fs from "fs";

const input = fs.readFileSync("./input.txt", "utf8");

const results = Array.from(input.matchAll(/(do\(\)|^)([^]*?)(don't\(\)|$)/g))
  .map(([_, _start, content, _end]) => content.trim())
  .map((content) =>
    Array.from(content.matchAll(/mul\((?<first>\d+),(?<second>\d+)\)/g))
      .map(([_, first, second]) => Number(first) * Number(second))
      .reduce((acc, curr) => acc + curr, 0)
  )
  .reduce((acc, curr) => acc + curr, 0);

console.log(results);
