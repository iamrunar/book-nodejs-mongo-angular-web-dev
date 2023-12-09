const common = require('./common');

describe('', () => {
  let loopingATriangle;
  beforeEach(() => {
    loopingATriangle = new common.LoopingATriangle();
  });

  test('Looping a triangle', () => {
    const expected = `#
##
###
####
#####
######
#######
`;
    expect(loopingATriangle.loopingATriangle()).toBe(expected);
  });

  test('Looping a triangle -- book', () => {
    const expected = `#
##
###
####
#####
######
#######
`;
    expect(loopingATriangle.loopingATriangleBook()).toBe(expected);
  });
});

describe('FizzBuzz', () => {
  let fizzBuzz;
  beforeEach(() => {
    fizzBuzz = new common.FizzBuzz();
  });
  it('first part', () => {
    const count = 20;
    const expected = '12Fizz4BuzzFizz78FizzBuzz11Fizz1314Fizz1617Fizz19Buzz';
    expect(fizzBuzz.firstFunction(count)).toBe(expected);
  });

  it('second part', () => {
    const count = 20;
    const expected =
      '12Fizz4BuzzFizz78FizzBuzz11Fizz1314FizzBuzz1617Fizz19Buzz';
    expect(fizzBuzz.secondFunction(count)).toBe(expected);
  });
});

describe('Chessboard', () => {
  let chessboard;

  beforeEach(() => {
    chessboard = new common.Chessboard();
  });

  it('first part', () => {
    const expected = ` # # # #
# # # # 
 # # # #
# # # # 
 # # # #
# # # # 
 # # # #
# # # # 
`;
    expect(chessboard.first()).toBe(expected);
  });

  it('second part', () => {
    const size = 9;
    const expected = ` # # # # 
# # # # #
 # # # # 
# # # # #
 # # # # 
# # # # #
 # # # # 
# # # # #
 # # # # 
`;
    expect(chessboard.second(size)).toBe(expected);
  });
});
