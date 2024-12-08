import { load } from "../../utils/load";

const input = load("./input.txt").map((line) => line.split(""));
const width = input[0].length;
const height = input.length;

type Coord = {
  x: number;
  y: number;
};
const nodes: Record<string, Coord[]> = {};

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const char = input[y][x];
    if (char === ".") continue;
    nodes[char] ??= [];
    nodes[char].push({ x, y });
  }
}

/**
 * Given a list of coordinates, pair each coordinate with every other coordinate.
 * Don't pair a coordinate with itself. Don't pair coordinates twice (e.g. [a, b] and [b, a] are the same pair)
 */
function coordPairs(coords: Coord[]) {
  const pairs: [Coord, Coord][] = [];

  for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      pairs.push([coords[i], coords[j]]);
    }
  }

  return pairs;
}

function addCoords(a: Coord, b: Coord) {
  return { x: a.x + b.x, y: a.y + b.y };
}
function subCoords(a: Coord, b: Coord) {
  return { x: a.x - b.x, y: a.y - b.y };
}
function multiplyCoords(a: Coord, b: number) {
  return { x: a.x * b, y: a.y * b };
}

function isInBounds(coord: Coord) {
  return coord.x >= 0 && coord.x < width && coord.y >= 0 && coord.y < height;
}

/**
 * Calculate the (x, y) offset between the two points.
 *
 * The antinodes are (point A) + offset (until it's outside the map) and (point B) - offset (until it's outside the map).
 **/
function antinodes(coords: [Coord, Coord]) {
  const offset = subCoords(coords[0], coords[1]);
  const result: Coord[] = [...coords];
  let multiplier = 1;
  while (multiplier < width) {
    const antinodes = [
      addCoords(coords[0], multiplyCoords(offset, multiplier)),
      subCoords(coords[1], multiplyCoords(offset, multiplier)),
    ].filter(isInBounds);
    if (!antinodes.length) {
      break;
    }
    antinodes.forEach((antinode) => result.push(antinode));
    multiplier++;
  }
  return result;
}

const result = new Set(
  Object.values(nodes)
    .flatMap(coordPairs)
    .flatMap(antinodes)
    .filter(({ x, y }) => x >= 0 && x < width && y >= 0 && y < height)
    .map(({ x, y }) => `${x},${y}`)
);

console.log(
  JSON.stringify(
    {
      nodes: Object.keys(nodes),
      width,
      height,
      antinodes: result.size,
    },
    null,
    2
  )
);
