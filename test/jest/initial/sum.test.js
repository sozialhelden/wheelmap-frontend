/* eslint-disable no-undef */
/* eslint-disable quotes */
/* eslint-disable semi */
const sum = require("./sum");

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
