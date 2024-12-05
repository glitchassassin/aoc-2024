import fs from "node:fs";

// const input = fs.readFileSync("./sample.txt", "utf8");
const input = fs.readFileSync("./input.txt", "utf8");

const [rulesText, updatesText] = input.split("\n\n");

const rules = rulesText.split("\n").map((line) => line.split("|").map(Number));
const updates = updatesText
  .split("\n")
  .map((line) => line.split(",").map(Number));

const rulesIndex = new Map<number, number[][]>();

for (const rule of rules) {
  for (const page of rule) {
    const relevantRules = rulesIndex.get(page) ?? [];
    relevantRules.push(rule);
    rulesIndex.set(page, relevantRules);
  }
}

function ruleApplies(rule: number[], update: number[]) {
  const pos1 = update.indexOf(rule[0]);
  const pos2 = update.indexOf(rule[1]);
  return pos1 === -1 || pos2 === -1 || pos1 < pos2;
}

function relevantRules(update: number[]) {
  return [...new Set(update.flatMap((page) => rulesIndex.get(page) ?? []))];
}

function middleOfUpdate(update: number[]) {
  return update[Math.floor(update.length / 2)];
}

let sum = 0;
for (const update of updates) {
  const relevant = relevantRules(update);
  if (relevant.every((rule) => ruleApplies(rule, update))) {
    sum += middleOfUpdate(update);
  }
}

console.log({ sum });
