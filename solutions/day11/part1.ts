import { readFileSync } from "fs";

const input = readFileSync("input.txt", "utf-8").split(" ").map(Number);
// const input = [125, 17];

const RULES = [
  (input: number) => {
    if (input === 0) return [1];
    return undefined;
  },
  (input: number) => {
    const inputString = `${input}`;
    if (inputString.length % 2 !== 0) return undefined;
    return [
      Number(inputString.slice(0, inputString.length / 2)),
      Number(inputString.slice(inputString.length / 2)),
    ];
  },
  (input: number) => [input * 2024],
];

function blink(input: number[]) {
  return input.flatMap((value) => {
    for (const rule of RULES) {
      const result = rule(value);
      if (result) return result;
    }
    return [];
  });
}

let current = input;
for (let i = 0; i < 25; i++) {
  current = blink(current);
}
console.log({ current: current.length });
