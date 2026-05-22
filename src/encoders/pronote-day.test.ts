import { describe, expect, it } from "bun:test";
import { encodePronoteDay } from "./pronote-day";

describe("encodePronoteDay", () => {
  it("encodes January 1st without leading zeros", () => {
    expect(encodePronoteDay(new Date(2026, 0, 1))).toEqual({
      _T: 7,
      V: "1/1/2026 0:0:0"
    });
  });

  it("encodes April 7th 2026 (mono-digit month and day)", () => {
    expect(encodePronoteDay(new Date(2026, 3, 7))).toEqual({
      _T: 7,
      V: "7/4/2026 0:0:0"
    });
  });

  it("encodes December 25th with two-digit day and month", () => {
    expect(encodePronoteDay(new Date(2026, 11, 25))).toEqual({
      _T: 7,
      V: "25/12/2026 0:0:0"
    });
  });

  it("hardcodes the hour part regardless of the Date's time component", () => {
    expect(encodePronoteDay(new Date(2026, 3, 7, 14, 30, 45))).toEqual({
      _T: 7,
      V: "7/4/2026 0:0:0"
    });
  });
});
