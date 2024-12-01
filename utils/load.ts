import fs from "node:fs";

export function load(filename: string) {
  return fs.readFileSync(filename, "utf8").split("\n");
}
