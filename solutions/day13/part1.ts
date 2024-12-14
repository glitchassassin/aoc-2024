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
        x: parseInt(prizeMatch[1]),
        y: parseInt(prizeMatch[2]),
      },
    });
  }

  return sets;
}

const sets = parseInputFile(readFileSync("input.txt", "utf-8"));

// (x1 * b1) + (x2 * b2) = prize.x
// (x1 * b1) + (x2 * b2) - prize.x = 0
// (y1 * b1) + (y2 * b2) = prize.y
// (y1 * b1) + (y2 * b2) - prize.y = 0

// (x1 * b1) + (x2 * b2) - prize.x = (y1 * b1) + (y2 * b2) - prize.y
// (x1 * b1) + (x2 * b2) - (y1 * b1) - (y2 * b2) = prize.x - prize.y
// (x1 * b1) - (y1 * b1) + (x2 * b2) - (y2 * b2) = prize.x - prize.y
// (x1 - y1) * b1 + (x2 - y2) * b2 = prize.x - prize.y
// (x1 - y1) * b1 = prize.x - prize.y - (x2 - y2) * b2
// b1 = (prize.x - prize.y - (x2 - y2) * b2) / (x1 - y1)

function cost(a: number, b: number) {
  return a * 3 + b;
}

let total = 0;
for (const set of sets) {
  for (let buttonAPresses = 0; buttonAPresses < 100; buttonAPresses++) {
    const offset = mul(set.buttonA, buttonAPresses);
    const remaining = sub(set.prize, offset);
    const x1 = remaining.x / set.buttonB.x;
    const y1 = remaining.y / set.buttonB.y;
    if (x1 % 1 !== 0 || y1 % 1 !== 0 || x1 !== y1) continue;
    total += cost(buttonAPresses, x1);
  }
}

console.log({ total });
