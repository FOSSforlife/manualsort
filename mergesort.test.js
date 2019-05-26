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