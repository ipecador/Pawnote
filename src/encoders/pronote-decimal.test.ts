import { describe, expect, it } from "bun:test";
import { encodePronoteDecimal } from "./pronote-decimal";

describe("encodePronoteDecimal", () => {
  it("encodes a whole number with two decimals", () => {
    expect(encodePronoteDecimal(1)).toEqual({ _T: 10, V: "1,00" });
  });

  it("encodes a half value", () => {
    expect(encodePronoteDecimal(1.5)).toEqual({ _T: 10, V: "1,50" });
  });

  it("encodes ten", () => {
    expect(encodePronoteDecimal(10)).toEqual({ _T: 10, V: "10,00" });
  });

  it("encodes 10.25", () => {
    expect(encodePronoteDecimal(10.25)).toEqual({ _T: 10, V: "10,25" });
  });

  it("encodes 0.5", () => {
    expect(encodePronoteDecimal(0.5)).toEqual({ _T: 10, V: "0,50" });
  });

  it("encodes zero", () => {
    expect(encodePronoteDecimal(0)).toEqual({ _T: 10, V: "0,00" });
  });
});
