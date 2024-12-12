import fs from "node:fs";

export function load(filename: string) {
  return fs.readFileSync(filename, "utf8").split("\n");
}

export function loadGrid(filename: string) {
  return fs
    .readFileSync(filename, "utf8")
    .split("\n")
    .map((line) => line.split(""));
}
