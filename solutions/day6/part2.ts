import { load } from "../../utils/load";

const map = load("./input.txt").map((line) => line.split(""));

type Guard = { x: number; y: number; direction: "N" | "E" | "S" | "W" };

let guard: Guard | null = null;
let startingPosition: Guard | null = null;

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

function isOnMap(guard: Guard) {
  return (
    guard.y >= 0 &&
    guard.y < map.length &&
    guard.x >= 0 &&
    guard.x < map[0].length
  );
}

for (let y = 0; y < map.length; y++) {
  const line = map[y];
  for (let x = 0; x < line.length; x++) {
    const char = line[x];
    if (char === "^") {
      guard = { x, y, direction: "N" };
      startingPosition = guard;
    }
  }
}

if (!guard || !startingPosition) throw new Error("No guard found");

console.log({ guard });

function guardPath(
  guard: Guard,
  map: string[][],
  obstacle?: { x: number; y: number }
) {
  const visited = new Set<string>();
  const visitedWithDirection = new Set<string>();
  while (true) {
    const next = nextPosition(guard);
    if (!isOnMap(next)) {
      return {
        visited,
        result: "EXIT_MAP",
      };
    } else if (
      visitedWithDirection.has(`${next.y},${next.x},${next.direction}`)
    ) {
      return {
        visited,
        result: "LOOP",
      };
    }

    // next position is an obstacle - rotate and continue
    if (
      map[next.y][next.x] === "#" ||
      (obstacle && next.x === obstacle.x && next.y === obstacle.y)
    ) {
      guard = rotate(guard);
      continue;
    }

    guard = next;
    visited.add(`${next.y},${next.x}`);
    visitedWithDirection.add(`${next.y},${next.x},${guard.direction}`);
  }
}

const basePath = guardPath(guard, map);

console.log({
  basePath: {
    visited: basePath.visited.size,
    result: basePath.result,
  },
});

let viableObstacles = new Set<string>();
for (const obstacle of basePath.visited) {
  const [y, x] = obstacle.split(",").map(Number);
  const { result } = guardPath(guard, map, { x, y });
  if (result === "LOOP") {
    viableObstacles.add(`${y},${x}`);
  }
}

console.log({
  visited: basePath.visited.size,
  viableObstacles: viableObstacles.size,
});
