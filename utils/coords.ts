export type Coord = { x: number; y: number };
export type Direction = { x: -1 | 0 | 1; y: -1 | 0 | 1 };

export function manhattanNeighbors({ x, y }: Coord) {
  const neighbors: Coord[] = [];
  neighbors.push({ x: x - 1, y });
  neighbors.push({ x: x + 1, y });
  neighbors.push({ x, y: y - 1 });
  neighbors.push({ x, y: y + 1 });
  return neighbors;
}

export function inBounds(coord: Coord, grid: string[][]) {
  return (
    coord.x >= 0 &&
    coord.y >= 0 &&
    coord.x < grid[0].length &&
    coord.y < grid.length
  );
}

export function add(a: Coord, b: Coord) {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function sub(a: Coord, b: Coord) {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function mul(a: Coord, n: number) {
  return { x: a.x * n, y: a.y * n };
}

export function div(a: Coord, n: number) {
  return { x: a.x / n, y: a.y / n };
}

export function mod(a: Coord, b: Coord) {
  return { x: a.x % b.x, y: a.y % b.y };
}

export function eq(a: Coord, b: Coord) {
  return a.x === b.x && a.y === b.y;
}

export function direction(a: Coord, b: Coord): Direction {
  return {
    x: Math.sign(b.x - a.x) as Direction["x"],
    y: Math.sign(b.y - a.y) as Direction["y"],
  };
}

export function rotate(direction: Direction): Direction {
  return {
    x: -direction.y as Direction["x"],
    y: direction.x as Direction["y"],
  };
}
