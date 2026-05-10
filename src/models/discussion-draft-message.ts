import type { Attachment } from "./attachment";

/**
 * Explicit recipient of a new-discussion brouillon, taken from the draft's
 * `listeDestinataires` (NOT from the participants list, which always includes
 * the sender even when they didn't add themselves). Reply drafts don't carry
 * destinataires, so this stays empty for them.
 */
export type DiscussionDraftRecipient = Readonly<{
  id: string
  name: string
  kind: number
}>;

export type DiscussionDraftMessage = Readonly<{
  isHTML: boolean
  possessionID: string
  replyMessageID: string
  files: Attachment[]
  selectedRecipients: DiscussionDraftRecipient[]
}> & {
  content: string
};
