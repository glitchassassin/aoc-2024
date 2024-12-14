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

function scoreTrailhead(trailhead: Coord) {
  const frontier = [trailhead];
  const visited = new Set<string>();
  let score = 0;

  while (frontier.length > 0) {
    const current = frontier.shift();
    if (!current) break;

    if (visited.has(`${current.x},${current.y}`)) continue;

    visited.add(`${current.x},${current.y}`);
    const currentValue = map[current.y][current.x];
    if (currentValue === 9) {
      score += 1;
      continue;
    }

    for (const [dx, dy] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]) {
      const neighbor = { x: current.x + dx, y: current.y + dy };
      if (
        neighbor.x >= 0 &&
        neighbor.x < map[0].length &&
        neighbor.y >= 0 &&
        neighbor.y < map.length &&
        !visited.has(`${neighbor.x},${neighbor.y}`) &&
        map[neighbor.y][neighbor.x] === currentValue + 1
      ) {
        frontier.push(neighbor);
      }
    }
  }

  // console.log({
  //   trailhead,
  //   visited,
  //   score,
  // });

  return score;
}

// scoreTrailhead(trailheads[4]);

const scores = trailheads.map(scoreTrailhead).reduce((a, b) => a + b, 0);

console.log({
  scores,
});
