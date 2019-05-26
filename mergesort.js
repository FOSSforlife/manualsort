const prompt = require('prompt');
const colors = require('colors/safe');

// Array.flat() polyfill
if (!Array.prototype.flat) {
  Array.prototype.flat = function() {
    var depth = arguments[0];
    depth = depth === undefined ? 1 : Math.floor(depth);
    if (depth < 1) return Array.prototype.slice.call(this);
    return (function flat(arr, depth) {
      var len = arr.length >>> 0;
      var flattened = [];
      var i = 0;
      while (i < len) {
        if (i in arr) {
          var el = arr[i];
          if (Array.isArray(el) && depth > 0)
            flattened = flattened.concat(flat(el, depth - 1));
          else flattened.push(el);
        }
        i++;
      }
      return flattened;
    })(this, depth);
  };
}

// global
const tree = {}; // where all merge-sorting takes place
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

const main = (compareFunc = prompt.get, enableStdOut = false) => {
  stdOut = enableStdOut;
  tree.items = Array(13).fill(0).map(() => Math.floor(Math.random()*50)); // initialize random array
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
  return tree.nextRow;
}

// main();


module.exports = { 
  groupsToMerge,
  main,
  promptFake
};
