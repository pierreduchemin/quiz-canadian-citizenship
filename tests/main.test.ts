import { expect, test } from "vitest";
import { selectQuestion } from "../src/util";

test("get an error if provided question array is empty", () => {
  expect(() => selectQuestion([])).toThrowError(
    /^Not able to select a question in an empty array$/,
  )
});

test("return index 0 if there's just one element in question array", () => {
  expect(selectQuestion([{ "id": 1 }])).toBe(0);
});
