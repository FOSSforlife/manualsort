const prompt = require('prompt');
const colors = require('colors/safe');
const util = require('./util');


// global
const tree = {numOfOperations: 0}; // where all merge-sorting takes place
let stdOut = true;

// functions
const newRow = (currentRow) => Array(Math.ceil((currentRow.length) / 2)).fill(0).map(() => []);
const isUndefined = (arr) => arr.every(a => a === undefined); 
const isGreater = (item1, item2) => {
  // will be replaced by user input
  return item1 >= item2;
};

const promptFake = {
  get: (junk, callback) => {
    if(tree.leftItem - tree.rightItem > 0) {
      callback(undefined, {isGreater: 1});
    }
    else {
      callback(undefined, {isGreater: 2});
    }
  }
}

const groupsToMerge = (row) => {
  let leftGroup = [], rightGroup = [];
  let i = 0;
  while(isUndefined(leftGroup) && isUndefined(rightGroup)) {
    if(row[i]) {
      leftGroup = row[i];
      rightGroup = row[i + 1] || [];
    }
    else { // if row is empty
      return [-1, -1];
    }
    i += 2;
  }
  return [leftGroup, rightGroup];
}


const getComparison = (tree) => {
  if(stdOut) {
    console.log(tree.nextRow);
  }
  if(tree.nextRow[0].length === tree.items.length) { // done
    return false;
  }

  [tree.leftGroup, tree.rightGroup] = groupsToMerge(tree.currentRow);
  if(!Array.isArray(tree.leftGroup)) {
    tree.currentRow = tree.nextRow;
    tree.nextRow = newRow(tree.currentRow);
    return getComparison(tree); // TEST: Make sure this works
  }
  let newGroupCapacity = tree.leftGroup.length + tree.rightGroup.length;
  let newGroup = [];
  tree.newGroupInd = -1;
  do {
    tree.newGroupInd++;
    newGroup = tree.nextRow[tree.newGroupInd];
  } while(newGroup.length >= newGroupCapacity)

  tree.leftItemInd = tree.leftGroup.findIndex(item => item !== undefined);
  tree.rightItemInd = tree.rightGroup.findIndex(item => item !== undefined);

  if(tree.leftItemInd == -1) { // if left array is empty add right item
    tree.nextRow[tree.newGroupInd].push(tree.rightGroup[tree.rightItemInd]);
    tree.rightGroup[tree.rightItemInd] = undefined;
    getComparison(tree);
    return getComparison(tree);
  }
  tree.leftItem = tree.leftGroup[tree.leftItemInd];

  if(tree.rightItemInd == -1) { // if right array is empty add left item
    tree.nextRow[tree.newGroupInd].push(tree.leftItem);
    tree.leftGroup[tree.leftItemInd] = undefined;
    getComparison(tree);
    return getComparison(tree);
  }
  tree.rightItem = tree.rightGroup[tree.rightItemInd] || undefined;

  return true;  

  // newGroupInd, leftGroup, leftItemInd, rightGroup, rightItemInd
};

const compare = (tree, compareFunc) => {
  if (getComparison(tree)) {
      tree.numOfOperations++;
      compareFunc({
        properties: {
          isGreater: {
            description: colors.green(`${tree.leftItem} (1) or ${tree.rightItem} (2)?`),
          type: 'number',
          required: true
        }
      }
    }, (err, result) => {
      if(result.isGreater == 1) {
        tree.nextRow[tree.newGroupInd].push(tree.rightItem);
        tree.rightGroup[tree.rightItemInd] = undefined;
      }
      else {
        tree.nextRow[tree.newGroupInd].push(tree.leftItem);
        tree.leftGroup[tree.leftItemInd] = undefined;
      }
      
      
      // recursive for now but doesn't have to be. this can be called at any time
      if(tree.nextRow[0].length < tree.items.length) {
        compare(tree, compareFunc);
      }
    });
}
  
}

const main = (options) => {
  const compareFunc = options.compareFunc || prompt.get;
  stdOut = options.enableStdOut || false;
  const itemsToMake = options.randomItemsNum || 13;
  tree.items = options.items || Array(itemsToMake).fill(0).map(() => Math.floor(Math.random()*50)); // initialize random array
  const numOfItems = tree.items.length;
  
  tree.currentRow = tree.items.map(item => [item]);
  tree.nextRow = Array(Math.ceil((tree.currentRow.length) / 2)).fill(0).map(() => []);
  if(stdOut) {
    console.log(tree.nextRow);
    console.log(tree.currentRow);
  }
  
  compare(tree, compareFunc);
  console.log(tree.nextRow[0]);
  console.log(tree.nextRow[0].slice(0).sort((i, j) => i - j));
  console.log(`${tree.numOfOperations} operations for ${tree.items.length} items`);
  return tree.nextRow;
}

// main();


module.exports = { 
  groupsToMerge,
  main,
  promptFake
};
