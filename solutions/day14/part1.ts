import { readFileSync } from "fs";
import { Coord, add, mod, mul } from "../../utils/coords";

type Robot = {
  position: Coord;
  velocity: Coord;
};

function parseInput(input: string): Robot[] {
  return input
    .trim()
    .split("\n")
    .map((line) => {
      // Match numbers (including negative) from the format "p=x,y v=dx,dy"
      const matches = line.match(/p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/);
      if (!matches) throw new Error(`Invalid line format: ${line}`);

      const [_, px, py, vx, vy] = matches.map(Number);

      return {
        position: { x: px, y: py },
        velocity: { x: vx, y: vy },
      };
    });
}

let robots = parseInput(readFileSync("input.txt", "utf-8"));

const gridSize = {
  x: 101,
  y: 103,
};

function wrap(coord: Coord) {
  return mod(add(gridSize, mod(coord, gridSize)), gridSize);
}

function moveRobot(robot: Robot, seconds: number) {
  return {
    position: wrap(add(robot.position, mul(robot.velocity, seconds))),
    velocity: robot.velocity,
  };
}

function moveRobots(robots: Robot[], seconds: number) {
  return robots.map((robot) => moveRobot(robot, seconds));
}

function visualize(robots: Robot[]) {
  const grid = Array.from({ length: gridSize.y }, () =>
    Array.from({ length: gridSize.x }, () => ".")
  );
  for (const robot of robots) {
    grid[robot.position.y][robot.position.x] = "#";
  }
  console.log(grid.map((row) => row.join(" ")).join("\n") + "\n");
}

function scoreQuadrants(robots: Robot[]) {
  const quadrants: [Robot[], Robot[], Robot[], Robot[]] = [[], [], [], []];
  const center = {
    x: Math.floor(gridSize.x / 2),
    y: Math.floor(gridSize.y / 2),
  };
  for (const robot of robots) {
    if (robot.position.x < center.x && robot.position.y < center.y) {
      quadrants[0].push(robot);
    } else if (robot.position.x < center.x && robot.position.y > center.y) {
      quadrants[1].push(robot);
    } else if (robot.position.x > center.x && robot.position.y < center.y) {
      quadrants[2].push(robot);
    } else if (robot.position.x > center.x && robot.position.y > center.y) {
      quadrants[3].push(robot);
    }
  }
  return quadrants
    .map((quadrant) => quadrant.length)
    .reduce((a, b) => a * b, 1);
}

// visualize(robots);
robots = moveRobots(robots, 100);
// visualize(robots);
console.log(scoreQuadrants(robots));
