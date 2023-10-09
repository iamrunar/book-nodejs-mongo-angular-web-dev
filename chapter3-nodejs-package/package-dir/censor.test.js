const { censor, getCensoredText, getUncensoriedWords } = require('./censor');

test('censor replaces targeted words with "***"', () => {
  expect(censor("hui")).toBe("***");
  expect(censor("pizda")).toBe("***");
  expect(censor("skovoroda")).toBe("***");
  expect(censor("dzhigurda")).toBe("***");
});

test('censor does not change other words', () => {
  expect(censor("hello")).toBe("hello");
});

test('getCensoredText returns "***"', () => {
  expect(getCensoredText()).toBe("***");
});

test('getUncensoredWords returns array of uncensored words', () => {
  expect(getUncensoriedWords()).toEqual(["hui","pizda","skovoroda", "dzhigurda"]);
});
