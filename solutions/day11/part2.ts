import { readFileSync } from "node:fs";

const input = readFileSync("input.txt", "utf-8").split(" ").map(Number);

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

const cache = new Map<string, number>();

function blinkRecursive(input: number, depth = 75) {
  if (depth === 0) return 1;
  const cacheKey = `${input}-${depth}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);
  for (const rule of RULES) {
    const result = rule(input);
    if (result) {
      const value = result
        .map((value) => blinkRecursive(value, depth - 1))
        .reduce((a, b) => a + b, 0);
      cache.set(cacheKey, value);
      return value;
    }
  }
  return 0;
}

const result = input
  .map((value) => blinkRecursive(value, 75))
  .reduce((a, b) => a + b, 0);

console.log({ result });
