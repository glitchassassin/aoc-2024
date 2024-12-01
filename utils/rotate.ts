export function rotate<T>(array: T[][]) {
  return array[0].map((_, colIndex) => array.map((row) => row[colIndex]));
}
