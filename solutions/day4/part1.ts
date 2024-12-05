import { load } from "../../utils/load";

const MATCHES = [
  [["X", "M", "A", "S"]],
  [["S", "A", "M", "X"]],
  [["X"], ["M"], ["A"], ["S"]],
  [["S"], ["A"], ["M"], ["X"]],
  [
    ["X", null, null, null],
    [null, "M", null, null],
    [null, null, "A", null],
    [null, null, null, "S"],
  ],
  [
    ["S", null, null, null],
    [null, "A", null, null],
    [null, null, "M", null],
    [null, null, null, "X"],
  ],
  [
    [null, null, null, "X"],
    [null, null, "M", null],
    [null, "A", null, null],
    ["S", null, null, null],
  ],
  [
    [null, null, null, "S"],
    [null, null, "A", null],
    [null, "M", null, null],
    ["X", null, null, null],
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

export function countXmases(matches: typeof MATCHES, input: string[]) {
  let xmases = 0;
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      for (const match of matches) {
        if (
          match.length > puzzleInput.length - y ||
          match[0].length > puzzleInput[y].length - x
        ) {
          continue;
        }
        if (
          match.every((row, i) =>
            row.every((char, j) => !char || char === input[y + i][x + j])
          )
        ) {
          xmases++;
        }
      }
    }
  }
  return xmases;
}

console.log({ part1: countXmases(MATCHES, puzzleInput) });
