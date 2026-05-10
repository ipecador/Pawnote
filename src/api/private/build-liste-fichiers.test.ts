import { describe, expect, it } from "bun:test";
import { buildListeFichiers } from "./build-liste-fichiers";

describe("buildListeFichiers", () => {
  it("returns empty array when input is undefined", () => {
    expect(buildListeFichiers(undefined)).toEqual([]);
  });

  it("returns empty array when input is empty", () => {
    expect(buildListeFichiers([])).toEqual([]);
  });

  it("translates a `create` entry to E:1 with idFichier", () => {
    const items = buildListeFichiers([
      { kind: "create", idFichier: "selecfile_1_xxx", name: "rapport.pdf" }
    ]);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      E: 1,
      G: 1,
      L: "rapport.pdf",
      idFichier: "selecfile_1_xxx"
    });
    expect(typeof items[0].N).toBe("number");
    expect(items[0].N).toBeLessThan(0);
  });

  it("translates a `keep` entry to E:1 with serverID, no idFichier", () => {
    const items = buildListeFichiers([
      { kind: "keep", serverID: "36#abc", name: "rapport.pdf" }
    ]);
    expect(items).toEqual([
      { E: 1, G: 1, L: "rapport.pdf", N: "36#abc" }
    ]);
    expect(items[0]).not.toHaveProperty("idFichier");
  });

  it("translates a `delete` entry to E:3 with serverID", () => {
    const items = buildListeFichiers([
      { kind: "delete", serverID: "36#abc", name: "rapport.pdf" }
    ]);
    expect(items).toEqual([
      { E: 3, G: 1, L: "rapport.pdf", N: "36#abc" }
    ]);
  });

  it("preserves order in a mixed input", () => {
    const items = buildListeFichiers([
      { kind: "create", idFichier: "selecfile_1", name: "a.pdf" },
      { kind: "delete", serverID: "36#old", name: "old.pdf" },
      { kind: "keep", serverID: "36#kept", name: "kept.pdf" }
    ]);
    expect(items).toHaveLength(3);
    expect(items[0]).toMatchObject({ E: 1, idFichier: "selecfile_1", L: "a.pdf" });
    expect(items[1]).toMatchObject({ E: 3, N: "36#old", L: "old.pdf" });
    expect(items[2]).toMatchObject({ E: 1, N: "36#kept", L: "kept.pdf" });
  });
});
