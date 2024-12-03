import { load } from "../../utils/load";

export function testReport(report: number[]) {
  const direction = Math.sign(report[0] - report[1]);
  if (direction === 0) return false;
  for (let i = 0; i < report.length - 1; i++) {
    if (
      Math.sign(report[i] - report[i + 1]) !== direction || // scores are increasing or decreasing together
      Math.abs(report[i] - report[i + 1]) > 3 // scores are not too far apart
    ) {
      return false;
    }
  }
  return true;
}

// const inputText = load("sample1.txt")
const safeReports = load("input.txt")
  .map((line) => line.split(/\s+/).map(Number))
  .filter(testReport).length;

console.log({ safeReports });
