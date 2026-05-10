import { describe, expect, it } from "bun:test";
import { AccountKind, type SessionHandle } from "~/models";
import { decodeDiscussionMessages } from "./discussion-messages";

const handle: SessionHandle = {
  // @ts-expect-error : we only fill the necessary fields.
  information: {
    order: 2,
    url: "https://demo.index-education.net/pronote",
    id: 1235678,
    accountKind: AccountKind.TEACHER,
    aesIV: "",
    aesKey: ""
  }
};

describe("decodeDiscussionMessages", () => {
  it("populates files on a top-level brouillon-only draft", () => {
    const result = decodeDiscussionMessages({
      brouillon: {
        _T: 24,
        V: {
          N: "108#draft-id",
          contenu: { _T: 21, V: "" },
          estHTML: true,
          objet: "",
          listeDocumentsJoints: {
            _T: 24,
            V: [
              { L: "rapport.pdf", N: "36#file-1", G: 1 },
              { L: "image.png", N: "36#file-2", G: 1 }
            ]
          },
          listeDestinataires: { _T: 24, V: [] }
        }
      }
    }, handle);

    expect(result.drafts).toHaveLength(1);
    expect(result.drafts[0].files).toHaveLength(2);
    expect(result.drafts[0].files[0].name).toBe("rapport.pdf");
    expect(result.drafts[0].files[0].id).toBe("36#file-1");
    expect(result.drafts[0].files[1].name).toBe("image.png");
  });

  it("returns empty files when brouillon has no listeDocumentsJoints", () => {
    const result = decodeDiscussionMessages({
      brouillon: {
        _T: 24,
        V: {
          N: "108#draft-id",
          contenu: { _T: 21, V: "" },
          estHTML: true
        }
      }
    }, handle);

    expect(result.drafts[0].files).toEqual([]);
  });

  it("populates files on an inline reply draft", () => {
    const result = decodeDiscussionMessages({
      listeMessages: {
        _T: 24,
        V: [
          {
            brouillon: true,
            possessionMessage: { V: { N: "108#reply-draft" } },
            messageSource: { V: { N: "msg-source" } },
            estHTML: true,
            contenu: { V: "<p>hello</p>" },
            listeDocumentsJoints: {
              _T: 24,
              V: [{ L: "joined.pdf", N: "36#file-3", G: 1 }]
            }
          }
        ]
      }
    }, handle);

    expect(result.drafts).toHaveLength(1);
    expect(result.drafts[0].files).toHaveLength(1);
    expect(result.drafts[0].files[0].name).toBe("joined.pdf");
  });
});
