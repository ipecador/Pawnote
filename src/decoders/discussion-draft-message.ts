import type { DiscussionDraftMessage, SessionHandle } from "~/models";
import { decodeAttachment } from "./attachment";

export const decodeDiscussionDraftMessage = (draft: any, session: SessionHandle): DiscussionDraftMessage => {
  const isHTML: boolean = draft.estHTML ?? false;

  return {
    possessionID: draft.possessionMessage.V.N,
    replyMessageID: draft.messageSource.V.N,
    content: isHTML ? draft.contenu.V : draft.contenu,
    isHTML,
    files: draft.listeDocumentsJoints?.V?.map((a: any) => decodeAttachment(a, session)) ?? [],
    // Reply drafts don't carry destinataires (the thread already has them) —
    // stays empty for this code path.
    selectedRecipients: draft.listeDestinataires?.V?.map((r: any) => ({
      id: r.N,
      name: r.L,
      kind: r.G
    })) ?? []
  };
};
