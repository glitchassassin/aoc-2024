import { load } from "../../utils/load";

const input = load("./input.txt").map((line) => {
  const [testValue, numbers] = line.split(": ");
  return {
    testValue: Number(testValue),
    numbers: numbers.split(" ").map(Number),
  };
});

type Test = (typeof input)[number];

const OPERATORS = [
  (a: number, b: number) => a + b,
  (a: number, b: number) => a * b,
  (a: number, b: number) => Number(`${a}${b}`),
];

/**
 * Generate all permutations of the given operators with the given length
 * @param operators - The operators to use
 * @param length - The length of the permutations
 */
function permutations(
  operators = OPERATORS,
  length = 3
): Array<((a: number, b: number) => number)[]> {
  if (length === 1) {
    return operators.map((operator) => [operator]);
  }

  const result: Array<((a: number, b: number) => number)[]> = [];
  const subPerms = permutations(operators, length - 1);

  for (const operator of operators) {
    for (const subPerm of subPerms) {
      result.push([operator, ...subPerm]);
    }
  }

  return result;
}

function checkTest(test: Test) {
  const operatorPermutations = permutations(OPERATORS, test.numbers.length - 1);
  for (const operatorPermutation of operatorPermutations) {
    let result = test.numbers[0];
    for (let i = 1; i < test.numbers.length; i++) {
      result = operatorPermutation[i - 1](result, test.numbers[i]);
    }
    if (result === test.testValue) {
      return true;
    }
  }
  return false;
}

const result = input
  .filter(checkTest)
  .reduce((acc, curr) => acc + curr.testValue, 0);
console.log({ result });
