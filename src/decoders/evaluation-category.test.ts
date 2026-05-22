import { describe, expect, it } from "bun:test";
import { decodeEvaluationCategory } from "./evaluation-category";

describe("decodeEvaluationCategory", () => {
  it("decodes the 'Aucune' sentinel entry", () => {
    const raw = { L: "Aucune", P: 0, estEditable: false, filtreMesCategories: true };
    expect(decodeEvaluationCategory(raw)).toEqual({
      id: undefined,
      name: "Aucune",
      color: undefined,
      owner: undefined,
      editable: false
    });
  });

  it("decodes a regular category with color and owner", () => {
    const raw = {
      L: "Travail de groupe",
      N: "170#abc",
      couleur: "#8080FF",
      proprietaire: "Mme X",
      estEditable: true,
      filtreMesCategories: false
    };
    expect(decodeEvaluationCategory(raw)).toEqual({
      id: "170#abc",
      name: "Travail de groupe",
      color: "#8080FF",
      owner: "Mme X",
      editable: true
    });
  });

  it("treats missing optional fields as undefined", () => {
    const raw = { L: "Bare", N: "170#bare", estEditable: false };
    expect(decodeEvaluationCategory(raw)).toEqual({
      id: "170#bare",
      name: "Bare",
      color: undefined,
      owner: undefined,
      editable: false
    });
  });
});
