import { describe, it, expect } from "bun:test";
import { decodeHomepage } from "./homepage";

const emptyLinks = {
  lienUtile: {
    listeLiens: {
      _T: 24,
      V: []
    }
  }
};

describe("decodeHomepage", () => {
  it("exposes stickyNote from penseBete.libelle when present", () => {
    const result = decodeHomepage({
      ...emptyLinks,
      penseBete: { libelle: "rappel 1\nrappel 2" }
    });

    expect(result.stickyNote).toBe("rappel 1\nrappel 2");
  });

  it("leaves stickyNote undefined when penseBete is absent", () => {
    const result = decodeHomepage(emptyLinks);

    expect(result.stickyNote).toBeUndefined();
  });

  it("exposes an empty stickyNote distinct from undefined", () => {
    const result = decodeHomepage({
      ...emptyLinks,
      penseBete: { libelle: "" }
    });

    expect(result.stickyNote).toBe("");
  });
});
