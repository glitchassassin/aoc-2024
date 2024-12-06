import { load } from "../../utils/load";

const map = load("./input.txt").map((line) => line.split(""));

type Guard = { x: number; y: number; direction: "N" | "E" | "S" | "W" };

let guard: Guard | null = null;

function rotate(guard: Guard): Guard {
  if (guard.direction === "N") return { ...guard, direction: "E" };
  if (guard.direction === "E") return { ...guard, direction: "S" };
  if (guard.direction === "S") return { ...guard, direction: "W" };
  return { ...guard, direction: "N" };
}

function nextPosition(guard: Guard): Guard {
  if (guard.direction === "N") return { ...guard, y: guard.y - 1 };
  if (guard.direction === "E") return { ...guard, x: guard.x + 1 };
  if (guard.direction === "S") return { ...guard, y: guard.y + 1 };
  return { ...guard, x: guard.x - 1 };
}

map.forEach((line, y) => {
  line.forEach((char, x) => {
    if (char === "^") {
      guard = { x, y, direction: "N" };
    }
  });
});

if (!guard) throw new Error("No guard found");

console.log({ guard });

const visited = new Set<string>();
while (true) {
  const next = nextPosition(guard);
  if (
    next.y < 0 ||
    next.y >= map.length ||
    next.x < 0 ||
    next.x >= map[0].length
  ) {
    break;
  }
  if (map[next.y][next.x] === "#") {
    guard = rotate(guard);
  } else {
    guard = next;
    visited.add(`${next.y},${next.x}`);
  }
}

console.log({ visited: visited.size });
