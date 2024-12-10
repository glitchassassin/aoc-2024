import fs from "node:fs";

const input = fs.readFileSync("./input.txt", "utf-8").trim();

const disk: (number | undefined)[] = [];
for (let i = 0; i < input.length; i += 2) {
  let id = i / 2;

  disk.push(
    ...Array.from({ length: Number(input[i]) }, () => id),
    ...Array.from({ length: Number(input[i + 1]) }, () => undefined)
  );
}

// console.log({
//   disk: disk.map((x) => x ?? ".").join(""),
// });

for (let i = disk.length - 1; i >= 0; i--) {
  if (!disk.includes(undefined)) break;
  if (disk[i] !== undefined) {
    disk.splice(disk.indexOf(undefined), 1, disk[i]);
  }
  disk.splice(i, 1);
}

// console.log({
//   disk: disk.map((x) => x ?? ".").join(""),
// });

const checksum = disk.map((x, i) => (x ?? 0) * i).reduce((a, b) => a + b, 0);

console.log({
  checksum,
});
