// https://adventofcode.com/2024/day/1
import { load } from "../../utils/load";
import { rotate } from "../../utils/rotate";

// Read the sample input
// const inputText = fs.readFileSync("sample1.txt", "utf8");
const inputText = load("input.txt");

// split the columns and then rotate
const rows = inputText.map((line) => line.split(/\s+/).map(Number));
const columns = rotate(rows).map((row) => row.sort());

// console.log({ columns });

let sum = 0;
for (let i = 0; i < columns[0].length; i++) {
  const distance = Math.abs(columns[0][i] - columns[1][i]);
  sum += distance;
  //   console.log({ distance });
}

console.log({ sum });
