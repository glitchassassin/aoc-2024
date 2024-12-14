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

function scoreRobots(robots: Robot[]) {
  let count = 0;
  for (let y = 0; y < gridSize.y; y++) {
    if (
      robots.some((robot) => robot.position.y === y && robot.position.x === 23)
    )
      count++;
  }
  return count;
}

let seconds = 14;
robots = moveRobots(robots, 14);

const MAX_ITERATIONS = 1000000;
let maxScore = 0;
while (seconds < MAX_ITERATIONS) {
  seconds += 101;
  robots = moveRobots(robots, 101);
  const score = scoreRobots(robots);
  if (score > maxScore) {
    maxScore = score;
    visualize(robots);
    console.log({ seconds, score });
  }
}

// visualize(robots);

// console.log(`Iterations: ${iterations}`);

// process.stdin.setRawMode(true);
// process.stdin.setEncoding("utf8");

// let seconds = 14;
// console.log(`Time: ${seconds} seconds`);

// process.stdin.on("data", (key: string) => {
//   if (key === "\u0003") {
//     // Ctrl+C
//     process.exit();
//   } else if (key === "\r" || key === "\n") {
//     seconds += 101;
//     console.clear(); // Clear the console for better visualization
//     robots = moveRobots(robots, 101);
//     visualize(robots);
//     console.log(`Time: ${seconds} seconds`);
//   }
// });

// console.log("Press Enter to advance time, Ctrl+C to exit");
