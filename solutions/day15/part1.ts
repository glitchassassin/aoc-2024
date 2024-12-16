import fs from "fs";
import { add, Coord, inBounds } from "../../utils/coords";

type MapGrid = ("#" | "." | "O" | "@")[][];
type Direction = ">" | "<" | "^" | "v";

const DIRECTION_OFFSETS: Record<Direction, Coord> = {
  ">": { x: 1, y: 0 },
  "<": { x: -1, y: 0 },
  "^": { x: 0, y: -1 },
  v: { x: 0, y: 1 },
};

function loadMapAndDirections(filePath: string) {
  const data = fs.readFileSync(filePath, "utf-8");
  const [mapSection, ...directionLines] = data.split(/\r?\n\r?\n/);
  const map = mapSection
    .split("\n")
    .map((line) => line.split("") as MapGrid[number]);
  const directions = directionLines
    .join("")
    .replace(/\r?\n/g, "")
    .split("") as Direction[];
  const [robot] = map.reduce((acc, row, y) => {
    const x = row.findIndex((tile) => tile === "@");
    if (x !== -1) {
      acc.push({ x, y });
    }
    return acc;
  }, [] as Coord[]);
  if (!robot) throw new Error("No robot found");
  return { map, directions, robot };
}

function printMap(map: MapGrid) {
  console.log(map.map((row) => row.join("")).join("\n") + "\n");
}

const { map, directions, robot } = loadMapAndDirections("input.txt");
printMap(map);

function moveOrThrow(map: MapGrid, origin: Coord, direction: Direction) {
  const newCoord = add(origin, DIRECTION_OFFSETS[direction]);
  const originalTile = map[origin.y][origin.x];
  const nextTile = map[newCoord.y][newCoord.x];
  if (!inBounds(newCoord, map)) {
    return false;
  } else if (nextTile === "#") {
    return false;
  } else if (nextTile === "." || moveOrThrow(map, newCoord, direction)) {
    map[newCoord.y][newCoord.x] = originalTile;
    if (originalTile === "@") {
      map[origin.y][origin.x] = ".";
      robot.x = newCoord.x;
      robot.y = newCoord.y;
    }
    return true;
  }
  return false;
}

function scoreMap(map: MapGrid) {
  let score = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === "O") {
        score += y * 100 + x;
      }
    }
  }
  return score;
}

for (const direction of directions) {
  moveOrThrow(map, robot, direction);
}
printMap(map);
console.log(scoreMap(map));
