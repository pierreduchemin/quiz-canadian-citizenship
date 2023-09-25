import { expect, test } from "vitest";
import * as util from "../src/util";

test("getSeed() get an error if provided a negative length", () => {
  expect(() => util.getSeed(-1)).toThrowError(
    /^Length must be > 0$/,
  )
})

test("getSeed() generates a number in range", () => {
  expect(util.getSeed(1)).toBe(0);
})

test("getQuestionSet() returns an array of index of the correct length", () => {
  expect(util.getQuestionSet(0, 20, 20).length).toBe(20);
})

test("getQuestionSet() contains no doubles", () => {
  let indexes = util.getQuestionSet(6, 20, 20)
  for (let i = 0; i < indexes.length; i++) {
    for (let ii = 0; ii < indexes.length; ii++) {
      if (i !== ii) {
        expect(indexes[i] === indexes[ii]).toBe(false)
      }
    }
  }
})

test("getQuestionSet() get an error if provided a negative seed", () => {
  expect(() => util.getQuestionSet(-1, 20, 20)).toThrowError(
    /^Seed must be >= 0$/,
  )
})

test("getQuestionSet() get an error if provided a negative length", () => {
  expect(() => util.getQuestionSet(0, -1, 20)).toThrowError(
    /^TotalLength must be > 0$/,
  )
})
