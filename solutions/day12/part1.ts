import { loadGrid } from "../../utils/load";

const grid = loadGrid("input.txt");

type Coord = { x: number; y: number };

function neighbors(x: number, y: number) {
  const neighbors: Coord[] = [];
  neighbors.push({ x: x - 1, y });
  neighbors.push({ x: x + 1, y });
  neighbors.push({ x, y: y - 1 });
  neighbors.push({ x, y: y + 1 });
  return neighbors;
}

let mapped = [...grid.map((row) => [...row])];

const visited = new Set<string>();
function floodfillRegion(grid: string[][], x: number, y: number) {
  let area = 0;
  let perimeter = 0;
  let adjacentRegions = new Map<string, Coord>();
  const queue: Coord[] = [{ x, y }];
  const currentRegion = grid[y][x];
  while (queue.length > 0) {
    const { x, y } = queue.shift() ?? {};
    if (x === undefined || y === undefined) break;
    if (visited.has(`${y},${x}`)) continue;
    visited.add(`${y},${x}`);
    area++;
    mapped[y][x] = ".";
    for (const neighbor of neighbors(x, y)) {
      if (
        neighbor.x < 0 ||
        neighbor.y < 0 ||
        neighbor.x >= grid[0].length ||
        neighbor.y >= grid.length
      ) {
        perimeter++;
      } else if (grid[neighbor.y][neighbor.x] === currentRegion) {
        queue.push(neighbor);
      } else {
        perimeter++;
        adjacentRegions.set(`${neighbor.y},${neighbor.x}`, neighbor);
      }
    }
  }
  return {
    area,
    perimeter,
    price: perimeter * area,
    adjacentRegions,
  };
}

const frontier = [{ x: 0, y: 0 }];
let totalPrice = 0;
while (frontier.length > 0) {
  const { x, y } = frontier.shift() ?? {};
  if (x === undefined || y === undefined) break;
  if (visited.has(`${y},${x}`)) continue;
  const { area, perimeter, price, adjacentRegions } = floodfillRegion(
    grid,
    x,
    y
  );
  // console.log({ region: grid[y][x], area, perimeter, price });
  for (const [key, value] of adjacentRegions.entries()) {
    if (visited.has(key)) continue;
    frontier.push(value);
  }
  totalPrice += price;
}

console.log({ totalPrice });
