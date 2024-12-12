import {
  add,
  Coord,
  direction,
  inBounds,
  manhattanNeighbors,
  rotate,
} from "../../utils/coords";
import { loadGrid } from "../../utils/load";

const grid = loadGrid("sample.txt");

function sameRegion(a: Coord, b: Coord) {
  return grid[a.y][a.x] === grid[b.y][b.x];
}

const visited = new Set<string>();
function floodfillRegion(grid: string[][], x: number, y: number) {
  let area = 0;
  let adjacentRegions = new Map<string, Coord>();
  let corner: Coord | null = null;
  const queue: Coord[] = [{ x, y }];
  const currentRegion = grid[y][x];

  // floodfill area
  while (queue.length > 0) {
    const next = queue.shift();
    if (next === undefined) break;
    const { x, y } = next;
    if (visited.has(`${y},${x}`)) continue;
    visited.add(`${y},${x}`);
    area++;
    const neighbors = manhattanNeighbors(next).filter((n) => inBounds(n, grid));
    const adjacent = neighbors.filter((n) => grid[n.y][n.x] !== currentRegion);
    for (const n of adjacent) {
      adjacentRegions.set(`${n.y},${n.x}`, n);
    }
    const inRegion = neighbors.filter((n) => grid[n.y][n.x] === currentRegion);
    for (const neighbor of inRegion) {
      queue.push(neighbor);
    }
    if (
      !corner &&
      // if there are 1 or 0 adjacent in-region plants, this is a corner
      (inRegion.length < 2 ||
        // if there are 2 adjacent plants, which are not across from each
        // other, this is a corner
        (inRegion.length === 2 &&
          direction(next, inRegion[0]) !== direction(inRegion[1], next)))
    ) {
      corner = next;
    }
  }

  // find perimeter
  if (!corner) throw new Error(`No corner found for region (${x}, ${y})`);
  const perimeter = findPerimeter(grid, corner);

  return {
    area,
    perimeter,
    price: perimeter * area,
    adjacentRegions,
  };
}

function findPerimeter(grid: string[][], corner: Coord) {
  let perimeter = 0;
  const visited = new Set<string>();
  let currentInside = corner;
  let currentOutside = manhattanNeighbors(corner).find(
    (adjacent) => !inBounds(adjacent, grid) || !sameRegion(adjacent, corner)
  );
  if (!currentOutside)
    throw new Error(`No outside found for region (${corner.x}, ${corner.y})`);
  let currentDirection = rotate(
    rotate(rotate(direction(currentInside, currentOutside)))
  ); // Keep the outside to the left
  function shouldRotate(coord: Coord) {
    const next = add(coord, currentDirection);
    console.log({
      coord,
      next,
      sameRegion: sameRegion(coord, next),
      nextPerimeter: add(next, rotate(currentDirection)),
    });
    return (
      // next plant is not in the same region, or
      !sameRegion(coord, next) ||
      // next plant is already visited, or
      visited.has(`${next.y},${next.x}`) ||
      // next plant is not on the same perimeter
      sameRegion(coord, add(next, rotate(currentDirection)))
    );
  }
  // pick starting direction
  while (shouldRotate(currentInside)) {
    currentDirection = rotate(currentDirection);
    if (currentDirection === direction(currentInside, currentOutside)) {
      // no adjacent plants; every side is a perimeter
      return 4;
    }
  }

  currentInside = add(currentInside, currentDirection);
  let iterations = 0;
  while (currentInside !== corner) {
    if (iterations++ > 10) break;
    console.log(currentInside);
    if (shouldRotate(currentInside)) {
      currentDirection = rotate(currentDirection);
      console.log({ rotate: currentDirection });
    } else {
      perimeter++;
      currentInside = add(currentInside, currentDirection);
      visited.add(`${currentInside.y},${currentInside.x}`);
    }
  }
  return perimeter;
}

// const frontier = [{ x: 0, y: 0 }];
// let totalPrice = 0;
// while (frontier.length > 0) {
//   const { x, y } = frontier.shift() ?? {};
//   if (x === undefined || y === undefined) break;
//   if (visited.has(`${y},${x}`)) continue;
//   const { area, perimeter, price, adjacentRegions } = floodfillRegion(
//     grid,
//     x,
//     y
//   );
//   // console.log({ region: grid[y][x], area, perimeter, price });
//   for (const [key, value] of adjacentRegions.entries()) {
//     if (visited.has(key)) continue;
//     frontier.push(value);
//   }
//   totalPrice += price;
// }

findPerimeter(grid, { x: 0, y: 0 });

// console.log({ totalPrice });
