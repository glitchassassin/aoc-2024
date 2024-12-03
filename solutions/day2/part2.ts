import { load } from "../../utils/load";
import { testReport } from "./part1";

const safeReports = load("input.txt")
  .map((line) => line.split(/\s+/).map(Number))
  .map((report) => [
    report,
    ...report.map((_, i) => report.filter((_, j) => i !== j)),
  ])
  .filter((variants) => variants.some(testReport)).length;

console.log({ safeReports });
