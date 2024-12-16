import fs from "fs";
import { add, Coord, inBounds } from "../../utils/coords";

type MapGrid = string[][];
type Direction = ">" | "<" | "^" | "v";

const DIRECTION_OFFSETS: Record<Direction, Coord> = {
  ">": { x: 1, y: 0 },
  "<": { x: -1, y: 0 },
  "^": { x: 0, y: -1 },
  v: { x: 0, y: 1 },
};

function expandMap(map: MapGrid): MapGrid {
  const newMap = map.map((row) =>
    row.flatMap((tile) => {
      if (tile === "@") {
        return ["@", "."];
      } else if (tile === "O") {
        return ["[", "]"];
      } else {
        return [tile, tile];
      }
    })
  );
  return newMap;
}

function loadMapAndDirections(filePath: string) {
  const data = fs.readFileSync(filePath, "utf-8");
  const [mapSection, ...directionLines] = data.split(/\r?\n\r?\n/);
  const map = expandMap(
    mapSection.split("\n").map((line) => line.split("") as MapGrid[number])
  );
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

function tryMove(map: MapGrid, origin: Coord, direction: Direction) {
  const newCoord = add(origin, DIRECTION_OFFSETS[direction]);
  const nextTile = map[newCoord.y][newCoord.x];
  if (!inBounds(newCoord, map)) {
    return false;
  } else if (nextTile === "#") {
    return false;
  } else if (nextTile === "[") {
    // half-boxes move together
    const otherHalfBox = add(newCoord, DIRECTION_OFFSETS[">"]);
    if (direction === ">" || direction === "<") {
      // other half-box will move on its own
      if (tryMove(map, newCoord, direction)) {
        return true;
      }
    } else {
      if (
        tryMove(map, newCoord, direction) &&
        tryMove(map, otherHalfBox, direction)
      ) {
        return true;
      }
    }
  } else if (nextTile === "]") {
    // half-boxes move together
    const otherHalfBox = add(newCoord, DIRECTION_OFFSETS["<"]);
    if (direction === "<" || direction === ">") {
      // other half-box will move on its own
      if (tryMove(map, newCoord, direction)) {
        return true;
      }
    } else {
      if (
        tryMove(map, newCoord, direction) &&
        tryMove(map, otherHalfBox, direction)
      ) {
        return true;
      }
    }
  } else if (nextTile === ".") {
    return true;
  }
  return false;
}
function doMove(map: MapGrid, origin: Coord, direction: Direction) {
  const newCoord = add(origin, DIRECTION_OFFSETS[direction]);
  const originalTile = map[origin.y][origin.x];
  const nextTile = map[newCoord.y][newCoord.x];
  function commitMove() {
    map[newCoord.y][newCoord.x] = originalTile;
    map[origin.y][origin.x] = ".";
    if (originalTile === "@") {
      robot.x = newCoord.x;
      robot.y = newCoord.y;
    }
  }
  if (!inBounds(newCoord, map)) {
    return false;
  } else if (nextTile === "#") {
    return false;
  } else if (nextTile === "[") {
    // half-boxes move together
    const otherHalfBox = add(newCoord, DIRECTION_OFFSETS[">"]);
    if (direction === ">") {
      // other half-box will move on its own
      if (doMove(map, newCoord, direction)) {
        commitMove();
        return true;
      }
    } else {
      if (
        doMove(map, newCoord, direction) &&
        doMove(map, otherHalfBox, direction)
      ) {
        commitMove();
        return true;
      }
    }
  } else if (nextTile === "]") {
    // half-boxes move together
    const otherHalfBox = add(newCoord, DIRECTION_OFFSETS["<"]);
    if (direction === "<") {
      // other half-box will move on its own
      if (doMove(map, newCoord, direction)) {
        commitMove();
        return true;
      }
    } else {
      if (
        doMove(map, newCoord, direction) &&
        doMove(map, otherHalfBox, direction)
      ) {
        commitMove();
        return true;
      }
    }
  } else if (nextTile === ".") {
    commitMove();
    return true;
  }
  return false;
}

function scoreMap(map: MapGrid) {
  let score = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === "[") {
        score += y * 100 + x;
      }
    }
  }
  return score;
}

for (const direction of directions) {
  if (tryMove(map, robot, direction)) doMove(map, robot, direction);
}
printMap(map);
console.log(scoreMap(map));
