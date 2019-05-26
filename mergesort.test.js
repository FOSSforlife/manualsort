const functions = require('./mergesort');

// first test
// test('Should return 2', () => {
//   expect(functions.exampleFunc()).toBe(2);
// })

test('groupsToMerge() test 1', () => {
  expect(functions.groupsToMerge([[1], [2]])).toContainEqual([1]);
  expect(functions.groupsToMerge([[1, 2], [3, 4]])).toContainEqual([1, 2]);
});

test('groupsToMerge() test 2', () => {
  expect(functions.groupsToMerge([[undefined], [undefined], [3], [4]])).toContainEqual([3]);
  expect(functions.groupsToMerge([[undefined, undefined], [undefined, undefined], [5, 6], [7, 8]])).toContainEqual([5, 6]);
});

test('groupsToMerge() test 3', () => {
  expect(functions.groupsToMerge([[undefined], [undefined], [3]])).toContainEqual([3]);
});

test('groupsToMerge() test 4', () => {
  expect(functions.groupsToMerge([[undefined], [undefined]])).toContain(-1);
});






const sortedArr1 = functions.main(functions.promptFake.get);
const sortedArr2 = functions.main(functions.promptFake.get);
const sortedArr3 = functions.main(functions.promptFake.get);

test('merge sort with numbers (random 1)', () => {
  expect(sortedArr1[0]).toEqual(sortedArr1[0].slice(0).sort((i, j) => i - j));
});

test('merge sort with numbers (random 2)', () => {
  expect(sortedArr2[0]).toEqual(sortedArr2[0].slice(0).sort((i, j) => i - j));
});

test('merge sort with numbers (random 3)', () => {
  expect(sortedArr3[0]).toEqual(sortedArr3[0].slice(0).sort((i, j) => i - j));
});