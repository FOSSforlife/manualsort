const util = require('./util');

let items = [
  'Death Grips - The Money Store',
  'Animals As Leaders - The Joy of Motion',
  'Death Grips - The Powers That B',
  'Deathspell Omega - Paracletus',
  'Flying Lotus - Cosmogramma',
  'Street Sects - End Position',
  'Converge - All We Love We Leave Behind',
  'Danny Brown - Atrocity Exhibition',
  'Daughters - Daughters',
  'Death Grips - Exmilitary',
  'Lil Ugly Mane - Mista Thug Isolation',
  'The Ocean - Pelagial',
  'Run the Jewels - Run the Jewels 2',
  'Scale the Summit - The Migration',
  'Sleater-Kinney - No Cities To Love',
];
items = util.shuffle(items);

require('./mergesort').main({enableStdOut: true, items: items});
// require('./mergesort').main({enableStdOut: true, randomItemsNum: 5, compareFunc: require('./mergesort').promptFake.get});
// require('./mergesort').main(require('./mergesort').promptFake.get, true);