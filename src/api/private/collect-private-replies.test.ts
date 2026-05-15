import { describe, expect, it } from "bun:test";
import { collectPrivateReplies } from "./collect-private-replies";

describe("collectPrivateReplies", () => {
  it("returns an empty map when input is empty", () => {
    expect(collectPrivateReplies([])).toEqual(new Map());
  });

  it("ignores depth=0 entries (roots themselves)", () => {
    const raw = [
      { estUneDiscussion: true, profondeur: 0, initiateur: "X", nbNonLus: 1 }
    ];
    expect(collectPrivateReplies(raw)).toEqual(new Map());
  });

  it("ignores depth=1 entries that are NOT estUneDiscussion (regular messages)", () => {
    const raw = [
      { estUneDiscussion: true, profondeur: 0 },                          // 0: root
      { profondeur: 1, indicePere: 0, estUneDiscussion: false }           // 1: message
    ];
    expect(collectPrivateReplies(raw)).toEqual(new Map());
  });

  it("groups a single private reply under its root", () => {
    const raw = [
      { estUneDiscussion: true, profondeur: 0 },                                            // 0: root
      { estUneDiscussion: true, profondeur: 1, indicePere: 0, initiateur: "Mme X", nbNonLus: 2 }  // 1: PR
    ];
    const result = collectPrivateReplies(raw);
    expect(result.size).toBe(1);
    expect(result.get(0)).toEqual([{ pair: "Mme X", unreadCount: 2 }]);
  });

  it("groups multiple private replies under the same root", () => {
    const raw = [
      { estUneDiscussion: true, profondeur: 0 },                                            // 0: root
      { estUneDiscussion: true, profondeur: 1, indicePere: 0, initiateur: "Mme X", nbNonLus: 1 },
      { estUneDiscussion: true, profondeur: 1, indicePere: 0, initiateur: "Mme Y", nbNonLus: 0 }
    ];
    const result = collectPrivateReplies(raw);
    expect(result.get(0)).toEqual([
      { pair: "Mme X", unreadCount: 1 },
      { pair: "Mme Y", unreadCount: 0 }
    ]);
  });

  it("groups private replies for distinct roots independently", () => {
    const raw = [
      { estUneDiscussion: true, profondeur: 0 },                                            // 0: root A
      { estUneDiscussion: true, profondeur: 1, indicePere: 0, initiateur: "Mme X", nbNonLus: 3 },
      { estUneDiscussion: true, profondeur: 0 },                                            // 2: root B
      { estUneDiscussion: true, profondeur: 1, indicePere: 2, initiateur: "Mme Y", nbNonLus: 1 }
    ];
    const result = collectPrivateReplies(raw);
    expect(result.get(0)).toEqual([{ pair: "Mme X", unreadCount: 3 }]);
    expect(result.get(2)).toEqual([{ pair: "Mme Y", unreadCount: 1 }]);
  });

  it("falls back to `public` when `initiateur` is missing", () => {
    const raw = [
      { estUneDiscussion: true, profondeur: 0 },
      { estUneDiscussion: true, profondeur: 1, indicePere: 0, public: "Mme Z", nbNonLus: 0 }
    ];
    expect(collectPrivateReplies(raw).get(0)).toEqual([{ pair: "Mme Z", unreadCount: 0 }]);
  });

  it("defaults unreadCount to 0 when nbNonLus is missing", () => {
    const raw = [
      { estUneDiscussion: true, profondeur: 0 },
      { estUneDiscussion: true, profondeur: 1, indicePere: 0, initiateur: "Mme X" }
    ];
    expect(collectPrivateReplies(raw).get(0)).toEqual([{ pair: "Mme X", unreadCount: 0 }]);
  });

  it("ignores depth=1 entries whose parent is not a depth=0 root", () => {
    const raw = [
      { estUneDiscussion: true, profondeur: 0 },                                            // 0: root
      { profondeur: 1, indicePere: 0, estUneDiscussion: false },                            // 1: message (not a root)
      { estUneDiscussion: true, profondeur: 1, indicePere: 1, initiateur: "Mme X" }         // 2: PR with non-root parent
    ];
    expect(collectPrivateReplies(raw)).toEqual(new Map());
  });

  it("ignores depth=1 entries with no indicePere", () => {
    const raw = [
      { estUneDiscussion: true, profondeur: 0 },
      { estUneDiscussion: true, profondeur: 1, initiateur: "Mme X" }
    ];
    expect(collectPrivateReplies(raw)).toEqual(new Map());
  });

  it("ignores depth=2 entries (messages inside a private reply)", () => {
    const raw = [
      { estUneDiscussion: true, profondeur: 0 },                                            // 0: root
      { estUneDiscussion: true, profondeur: 1, indicePere: 0, initiateur: "Mme X" },        // 1: PR
      { profondeur: 2, indicePere: 1 }                                                      // 2: msg inside PR
    ];
    const result = collectPrivateReplies(raw);
    expect(result.size).toBe(1);
    expect(result.get(0)).toEqual([{ pair: "Mme X", unreadCount: 0 }]);
  });
});
