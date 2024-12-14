import { load } from "../../utils/load";

const map = load("input.txt").map((line) => line.split("").map(Number));

type Coord = { x: number; y: number };

const trailheads: Coord[] = [];

for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[y].length; x++) {
    if (map[y][x] === 0) {
      trailheads.push({ x, y });
    }
  }
}

console.log({
  trailheads,
});

function getTrailsRecursively(point: Coord) {
  const currentValue = map[point.y][point.x];
  if (currentValue === 9) return 1;

  let score = 0;
  for (const [dx, dy] of [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ]) {
    const neighbor = { x: point.x + dx, y: point.y + dy };
    if (
      neighbor.x < 0 ||
      neighbor.x >= map[0].length ||
      neighbor.y < 0 ||
      neighbor.y >= map.length
    )
      continue;
    if (map[neighbor.y][neighbor.x] === currentValue + 1) {
      score += getTrailsRecursively(neighbor);
    }
  }
  return score;
}

const scores = trailheads.map(getTrailsRecursively).reduce((a, b) => a + b, 0);

console.log({
  scores,
});
