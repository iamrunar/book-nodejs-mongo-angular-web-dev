/*
Looping a triangle
Write a loop that makes seven calls to console.log to output the following triangle:

#
##
###
####
#####
######
#######
*/
function LoopingATriangle() {}
LoopingATriangle.prototype.loopingATriangle = function () {
  const rowCount = 7;
  let triangle = '';
  for (let row = 1; row <= rowCount; row++) {
    for (let column = 1; column <= row; column++) {
      triangle += '#';
    }
    triangle += '\n';
  }
  return triangle;
};

LoopingATriangle.prototype.loopingATriangleBook = function () {
  const size = 7;
  let triangle = '';
  for (let row = '#'; row.length <= size; row += '#') {
    triangle += row + '\n';
  }
  return triangle;
};

/*
FizzBuzz
1 Write a program that uses console.log to print all the numbers from 1 to 100,
with two exceptions. For numbers divisible by 3, print "Fizz" instead of the number,
and for numbers divisible by 5 (and not 3), print "Buzz" instead.

2 When you have that working, modify your program to print "FizzBuzz" for numbers
that are divisible by both 3 and 5 (and still print "Fizz" or "Buzz"
for numbers divisible by only one of those).
*/
function FizzBuzz() {}

FizzBuzz.prototype.firstFunction = function (count) {
  let string = '';
  for (let number = 1; number <= count; number++) {
    if (number % 3 === 0) {
      string += 'Fizz';
    } else if (number % 5 === 0) {
      string += 'Buzz';
    } else {
      string += number;
    }
  }
  return string;
};

FizzBuzz.prototype.secondFunction = function (count) {
  let string = '';
  for (let number = 1; number <= count; number++) {
    let currentPhrase = '';
    if (number % 3 === 0) {
      currentPhrase = 'Fizz';
    }
    if (number % 5 === 0) {
      currentPhrase += 'Buzz';
    }

    if (!currentPhrase) {
      currentPhrase = '' + number;
    }
    string += currentPhrase;
  }
  return string;
};

function Chessboard() {}
Chessboard.prototype.first = function () {
  const size = 8;
  let chessBoard = '';
  let rowModSwitcher = 0;
  for (let row = 1; row <= size; row++) {
    let rowCells = '';
    for (let col = 1; col <= size; col++) {
      if (col % 2 === rowModSwitcher) {
        rowCells += '#';
      } else {
        rowCells += ' ';
      }
    }
    rowModSwitcher = rowModSwitcher === 0 ? 1 : 0;
    chessBoard += `${rowCells}\n`;
  }
  return chessBoard;
};

Chessboard.prototype.second = function (size) {
  let chessBoard = '';
  let rowModSwitcher = 0;
  for (let row = 1; row <= size; row++) {
    let rowCells = '';
    for (let col = 1; col <= size; col++) {
      if (col % 2 === rowModSwitcher) {
        rowCells += '#';
      } else {
        rowCells += ' ';
      }
    }
    rowModSwitcher = rowModSwitcher === 0 ? 1 : 0;
    chessBoard += `${rowCells}\n`;
  }
  return chessBoard;
};

module.exports.LoopingATriangle = LoopingATriangle;
module.exports.FizzBuzz = FizzBuzz;
module.exports.Chessboard = Chessboard;
