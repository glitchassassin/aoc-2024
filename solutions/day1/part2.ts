// https://adventofcode.com/2024/day/1
import { load } from "../../utils/load";
import { rotate } from "../../utils/rotate";

// Read the sample input
// const inputText = fs.readFileSync("sample1.txt", "utf8");
const inputText = load("input.txt");

// split the columns and then rotate
const rows = inputText.map((line) => line.split(/\s+/).map(Number));
const columns = rotate(rows).map((row) => row.sort());

function similarityScore(value: number) {
  return columns[1].filter((v) => v === value).length;
}

let similarity = 0;
for (let i = 0; i < columns[0].length; i++) {
  similarity += columns[0][i] * similarityScore(columns[0][i]);
}

console.log({ similarity });
