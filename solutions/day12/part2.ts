import { Coord } from "../../utils/coords";
import { loadGrid } from "../../utils/load";

const grid = loadGrid("input.txt");

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
  const adjacentRegions = new Map<string, Coord>();
  const perimeterEdges = new Map<string, [Coord, Coord]>();
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
        perimeterEdges.set(`${y},${x}|${neighbor.y},${neighbor.x}`, [
          { x, y },
          neighbor,
        ]);
      } else if (grid[neighbor.y][neighbor.x] === currentRegion) {
        queue.push(neighbor);
      } else {
        perimeterEdges.set(`${y},${x}|${neighbor.y},${neighbor.x}`, [
          { x, y },
          neighbor,
        ]);
        adjacentRegions.set(`${neighbor.y},${neighbor.x}`, neighbor);
      }
    }
  }

  const edges = condensePerimeterEdges([...perimeterEdges.values()]);

  return {
    area,
    perimeter: perimeterEdges.size,
    edges,
    price: edges.length * area,
    adjacentRegions,
  };
}

function condensePerimeterEdges(perimeterEdges: Array<[Coord, Coord]>) {
  // Group edges by their direction
  const byDirection = new Map<string, Array<[Coord, Coord]>>();

  for (const edge of perimeterEdges) {
    const [inside, outside] = edge;
    const dx = outside.x - inside.x;
    const dy = outside.y - inside.y;
    const dir = `${dy === 0 ? (dx > 0 ? "+x" : "-x") : dy > 0 ? "+y" : "-y"}`;

    if (!byDirection.has(dir)) {
      byDirection.set(dir, []);
    }
    byDirection.get(dir)?.push(edge);
  }

  // For each direction, find contiguous regions
  const condensed: Array<Array<[Coord, Coord]>> = [];

  for (const [dir, edges] of byDirection.entries()) {
    let current: Array<[Coord, Coord]> = [];

    if (dir === "+x" || dir === "-x") {
      edges.sort((a, b) => a[0].x - b[0].x || a[0].y - b[0].y);
    } else {
      edges.sort((a, b) => a[0].y - b[0].y || a[0].x - b[0].x);
    }

    for (const edge of edges) {
      const last = current[current.length - 1]?.[0];
      if (
        !last ||
        (Math.abs(edge[0].x - last.x) <= 1 && edge[0].y === last.y) ||
        (Math.abs(edge[0].y - last.y) <= 1 && edge[0].x === last.x)
      ) {
        current.push(edge);
      } else {
        if (current.length > 0) condensed.push(current);
        current = [edge];
      }
    }
    if (current.length > 0) condensed.push(current);
  }

  return condensed;
}

const frontier = [{ x: 0, y: 0 }];
let totalPrice = 0;
while (frontier.length > 0) {
  const { x, y } = frontier.shift() ?? {};
  if (x === undefined || y === undefined) break;
  if (visited.has(`${y},${x}`)) continue;
  const { area, perimeter, edges, price, adjacentRegions } = floodfillRegion(
    grid,
    x,
    y
  );
  // console.log({
  //   region: grid[y][x],
  //   area,
  //   edges: edges.length,
  //   price,
  // });
  for (const [key, value] of adjacentRegions.entries()) {
    if (visited.has(key)) continue;
    frontier.push(value);
  }
  totalPrice += price;
}

console.log({ totalPrice });
