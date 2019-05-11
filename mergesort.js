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

// functions
const newRow = (currentRow) => Array(Math.ceil((currentRow.length) / 2)).fill(0).map(() => []);
const isUndefined = (arr) => arr.every(a => a === undefined); 
const isGreater = (item1, item2) => {
  // will be replaced by user input
  return item1 >= item2;
};

const nextMove = () => {
  let leftGroup = [], rightGroup = [];
  let i = 0;
  while(isUndefined(leftGroup) && isUndefined(rightGroup)) {
    if(currentRow[i]) {
      leftGroup = currentRow[i];
      rightGroup = currentRow[i + 1] || [];
      i += 2;
    }
    else { // if currentRow.flat().length == 0
      currentRow = nextRow;
      nextRow = newRow(currentRow);
      return;
    }
  }
  let newGroupCapacity = leftGroup.length + rightGroup.length;
  let newGroup = [];
  let newGroupInd = -1;
  do {
    newGroupInd++;
    newGroup = nextRow[newGroupInd];
  } while(newGroup.length >= newGroupCapacity)

  let leftItemInd = leftGroup.findIndex(item => item !== undefined);
  let rightItemInd = rightGroup.findIndex(item => item !== undefined);

  if(leftItemInd == -1) { // if left array is empty add right item
    nextRow[newGroupInd].push(rightGroup[rightItemInd]);
    rightGroup[rightItemInd] = undefined;
    return;
  }
  let leftItem = leftGroup[leftItemInd];

  if(rightItemInd == -1) { // if right array is empty add left item
    nextRow[newGroupInd].push(leftItem);
    leftGroup[leftItemInd] = undefined;
    return;
  }
  let rightItem = rightGroup[rightItemInd] || undefined;

  if(!isGreater(leftItem, rightItem)) {
    nextRow[newGroupInd].push(leftItem);
    leftGroup[leftItemInd] = undefined;
  }
  else {
    nextRow[newGroupInd].push(rightItem);
    rightGroup[rightItemInd] = undefined;

  }
};

const items = Array(13).fill(0).map(() => Math.floor(Math.random()*50)); // initialize random array
const numOfItems = items.length;

let currentRow = items.map(item => [item]);
let nextRow = Array(Math.ceil((currentRow.length) / 2)).fill(0).map(() => []);
console.log(currentRow);
console.log(nextRow);

while(nextRow[0].length < numOfItems) {
  nextMove();
  console.log(nextRow);
}
