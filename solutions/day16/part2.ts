import { add, Coord, direction, inBounds } from "../../utils/coords";
import { loadGrid } from "../../utils/load";

const map = loadGrid("sample.txt");

const [start] = map.reduce((acc, row, y) => {
  const x = row.indexOf("S");
  if (x !== -1) {
    acc.push({ x, y });
  }
  return acc;
}, [] as { x: number; y: number }[]);

const [end] = map.reduce((acc, row, y) => {
  const x = row.indexOf("E");
  if (x !== -1) {
    acc.push({ x, y });
  }
  return acc;
}, [] as { x: number; y: number }[]);

if (!start || !end) {
  throw new Error("Start or end not found");
}

console.log(start, end);

const DIRECTION_MAP = {
  N: { x: 0, y: -1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: 1 },
  W: { x: -1, y: 0 },
};

function neighbors(
  map: string[][],
  position: Coord,
  orientation: "N" | "E" | "S" | "W"
) {
  const neighbors: { position: Coord; cost: number }[] = [];
  if (orientation === "N") {
    neighbors.push({ position: add(position, DIRECTION_MAP.N), cost: 1 });
    neighbors.push({ position: add(position, DIRECTION_MAP.E), cost: 1001 });
    neighbors.push({ position: add(position, DIRECTION_MAP.W), cost: 1001 });
  } else if (orientation === "E") {
    neighbors.push({ position: add(position, DIRECTION_MAP.E), cost: 1 });
    neighbors.push({ position: add(position, DIRECTION_MAP.N), cost: 1001 });
    neighbors.push({ position: add(position, DIRECTION_MAP.S), cost: 1001 });
  } else if (orientation === "S") {
    neighbors.push({ position: add(position, DIRECTION_MAP.S), cost: 1 });
    neighbors.push({ position: add(position, DIRECTION_MAP.W), cost: 1001 });
    neighbors.push({ position: add(position, DIRECTION_MAP.E), cost: 1001 });
  } else if (orientation === "W") {
    neighbors.push({ position: add(position, DIRECTION_MAP.W), cost: 1 });
    neighbors.push({ position: add(position, DIRECTION_MAP.S), cost: 1001 });
    neighbors.push({ position: add(position, DIRECTION_MAP.N), cost: 1001 });
  }
  return neighbors.filter(
    (n) => inBounds(n.position, map) && map[n.position.y][n.position.x] !== "#"
  );
}

const visited = new Set<string>();
function adjacent(coord: Coord) {
  return [
    add(coord, DIRECTION_MAP.N),
    add(coord, DIRECTION_MAP.E),
    add(coord, DIRECTION_MAP.S),
    add(coord, DIRECTION_MAP.W),
  ];
}
function reconstructPath(
  costsSoFar: Map<string, number>,
  start: string,
  end: string
) {
  if (start === end) {
    visited.add(start);
    return;
  }
  const [x, y] = start.split(",");
  for (const coord of adjacent({ x: Number(x), y: Number(y) })) {
    const cost = costsSoFar.get(`${coord.x},${coord.y}`);
    if (cost !== undefined && cost < costsSoFar.get(start)!) {
      visited.add(`${coord.x},${coord.y}`);
      reconstructPath(costsSoFar, `${coord.x},${coord.y}`, end);
    }
  }
}

function findShortestPath(map: string[][], start: Coord) {
  const frontier: {
    position: Coord;
    cost: number;
  }[] = [{ position: start, cost: 0 }];

  const cameFrom: Map<string, string> = new Map();
  const costSoFar: Map<string, number> = new Map();

  while (frontier.length > 0) {
    frontier.sort((a, b) => a.cost - b.cost);

    const { position, cost } = frontier.shift()!;

    let orientation: "N" | "E" | "S" | "W" = "E";
    const previousPosition = cameFrom.get(`${position.x},${position.y}`);
    if (previousPosition) {
      const [x, y] = previousPosition.split(",");
      const dir = direction({ x: Number(x), y: Number(y) }, position);
      orientation = Object.entries(DIRECTION_MAP).find(
        ([_, value]) => value.x === dir.x && value.y === dir.y
      )?.[0] as "N" | "E" | "S" | "W";
      if (!orientation) {
        console.log(previousPosition, position);
        console.log(dir, orientation);
        throw new Error("Orientation not found");
      }
    }

    for (const neighbor of neighbors(map, position, orientation)) {
      const new_cost = cost + neighbor.cost;

      const next_cost = costSoFar.get(
        `${neighbor.position.x},${neighbor.position.y}`
      );
      if (next_cost === undefined || new_cost < next_cost) {
        costSoFar.set(
          `${neighbor.position.x},${neighbor.position.y}`,
          new_cost
        );
        cameFrom.set(
          `${neighbor.position.x},${neighbor.position.y}`,
          `${position.x},${position.y}`
        );
        frontier.push({
          ...neighbor,
          cost: new_cost,
        });
      }
    }
  }
  return costSoFar;
}

const costSoFar = findShortestPath(map, start);
reconstructPath(costSoFar, `${end.x},${end.y}`, `${start.x},${start.y}`);

console.log(visited.size);
