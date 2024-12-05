import { load } from "../../utils/load";
import { countXmases } from "./part1";

const MATCHES = [
  [
    ["M", null, "S"],
    [null, "A", null],
    ["M", null, "S"],
  ],
  [
    ["S", null, "S"],
    [null, "A", null],
    ["M", null, "M"],
  ],
  [
    ["S", null, "M"],
    [null, "A", null],
    ["S", null, "M"],
  ],
  [
    ["M", null, "M"],
    [null, "A", null],
    ["S", null, "S"],
  ],
];

const sample = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`.split("\n");

const inputs = load("./input.txt");

const puzzleInput = inputs;

console.log({ part2: countXmases(MATCHES, puzzleInput) });
