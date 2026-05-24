import { describe, expect, it } from "bun:test";
import { GradeKind } from "~/models";
import { encodeTeacherGrade } from "./teacher-grade";

describe("encodeTeacherGrade", () => {
  it("encodes a whole numeric grade", () => {
    expect(encodeTeacherGrade({ kind: "numeric", value: 8 })).toEqual({ _T: 10, V: "8,00" });
  });

  it("encodes a decimal numeric grade", () => {
    expect(encodeTeacherGrade({ kind: "numeric", value: 9.5 })).toEqual({ _T: 10, V: "9,50" });
  });

  it("encodes zero", () => {
    expect(encodeTeacherGrade({ kind: "numeric", value: 0 })).toEqual({ _T: 10, V: "0,00" });
  });

  it("encodes Absent as |1", () => {
    expect(encodeTeacherGrade({ kind: "special", code: GradeKind.Absent })).toEqual({ _T: 10, V: "|1" });
  });

  it("encodes UnreturnedZero as |7", () => {
    expect(encodeTeacherGrade({ kind: "special", code: GradeKind.UnreturnedZero })).toEqual({ _T: 10, V: "|7" });
  });

  it("disambiguates a numeric 3 from GradeKind.NotGraded", () => {
    // GradeKind.NotGraded === 3. A teacher giving a 3/20 should encode "3,00",
    // not "|3" — the tagged union enforces this at the type level.
    expect(encodeTeacherGrade({ kind: "numeric", value: 3 })).toEqual({ _T: 10, V: "3,00" });
    expect(encodeTeacherGrade({ kind: "special", code: GradeKind.NotGraded })).toEqual({ _T: 10, V: "|3" });
  });

  it("encodes empty (deletion) as an empty string", () => {
    expect(encodeTeacherGrade({ kind: "empty" })).toEqual({ _T: 10, V: "" });
  });
});
