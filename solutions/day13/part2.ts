import { readFileSync } from "fs";
import { Coord, mul, sub } from "../../utils/coords";

interface PuzzleSet {
  buttonA: Coord;
  buttonB: Coord;
  prize: Coord;
}

function parseInputFile(fileContent: string): PuzzleSet[] {
  const sets: PuzzleSet[] = [];
  const lines = fileContent.trim().split("\n\n");

  for (const set of lines) {
    const [buttonALine, buttonBLine, prizeLine] = set.split("\n");

    // Parse Button A
    const buttonAMatch = buttonALine.match(/Button A: X\+(\d+), Y\+(\d+)/);
    if (!buttonAMatch)
      throw new Error(`Invalid Button A format: ${buttonALine}`);

    // Parse Button B
    const buttonBMatch = buttonBLine.match(/Button B: X\+(\d+), Y\+(\d+)/);
    if (!buttonBMatch)
      throw new Error(`Invalid Button B format: ${buttonBLine}`);

    // Parse Prize
    const prizeMatch = prizeLine.match(/Prize: X=(\d+), Y=(\d+)/);
    if (!prizeMatch) throw new Error(`Invalid Prize format: ${prizeLine}`);

    sets.push({
      buttonA: {
        x: parseInt(buttonAMatch[1]),
        y: parseInt(buttonAMatch[2]),
      },
      buttonB: {
        x: parseInt(buttonBMatch[1]),
        y: parseInt(buttonBMatch[2]),
      },
      prize: {
        x: parseInt(prizeMatch[1]) + 10000000000000,
        y: parseInt(prizeMatch[2]) + 10000000000000,
      },
    });
  }

  return sets;
}

const sets = parseInputFile(readFileSync("input.txt", "utf-8"));

function cost(a: number, b: number) {
  return a * 3 + b;
}

function scoreSet(set: PuzzleSet, buttonAPresses: number) {
  const offset = mul(set.buttonA, buttonAPresses);
  const remaining = sub(set.prize, offset);
  const x1 = remaining.x / set.buttonB.x;
  const y1 = remaining.y / set.buttonB.y;
  if (x1 % 1 !== 0 || y1 % 1 !== 0 || x1 !== y1) return undefined;
  return cost(buttonAPresses, x1);
}

let total = 0;
for (const set of sets) {
  const { buttonA, buttonB, prize } = set;
  const buttonAPresses =
    (prize.y * buttonB.x - buttonB.y * prize.x) /
    (buttonA.y * buttonB.x - buttonB.y * buttonA.x);
  if (buttonAPresses % 1 !== 0) continue;
  const score = scoreSet(set, buttonAPresses);
  if (score) {
    total += score;
  }
}

console.log({ total });
