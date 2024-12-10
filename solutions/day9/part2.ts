import fs from "node:fs";

const input = fs.readFileSync("./input.txt", "utf-8").trim();

const disk: {
  id: number;
  filesize: number;
  freespace: number;
}[] = [];
for (let i = 0; i < input.length; i += 2) {
  let id = i / 2;

  disk.push({
    id,
    filesize: Number(input[i]),
    freespace: Number(input[i + 1]),
  });
}

// console.log({
//   disk: disk
//     .map(
//       (x) =>
//         `${Array.from({ length: x.filesize }, () => x.id).join("")}${Array.from(
//           { length: x.freespace },
//           () => "."
//         ).join("")}`
//     )
//     .join(""),
// });

for (let i = disk.length - 1; i >= 0; i--) {
  // try to find free space, starting at the beginning
  const moving = disk[i];
  const freeSpaceIndex = disk.findIndex((x) => x.freespace >= moving.filesize);
  if (freeSpaceIndex === -1 || freeSpaceIndex >= i) continue;
  const movingTo = disk[freeSpaceIndex];
  disk[i - 1].freespace += moving.filesize + moving.freespace;
  moving.freespace = movingTo.freespace - moving.filesize;
  movingTo.freespace = 0;
  disk.splice(i, 1);
  disk.splice(freeSpaceIndex + 1, 0, moving);
  i++;
}

// console.log({
//   disk: disk
//     .map(
//       (x) =>
//         `${Array.from({ length: x.filesize }, () => x.id).join(
//           ""
//         )}${Array.from({ length: x.freespace }, () => ".").join("")}`
//     )
//     .join(""),
// });

const diskArray = disk.flatMap((x) => [
  ...Array.from({ length: x.filesize }, () => x.id),
  ...Array.from({ length: x.freespace }, () => 0),
]);

const checksum = diskArray
  .map((x, i) => (x ?? 0) * i)
  .reduce((a, b) => a + b, 0);

console.log({
  checksum,
});
