import { type AttachmentChange, type Discussion, type DiscussionDraftMessage, DiscussionCommand, EntityState, type LibraryFile, type NewDiscussionRecipient, type SessionHandle } from "~/models";
import { discussionPostCommand } from "./private/discussion-post-command";
import { discussionMessages } from "./discussion-messages";
import { discussions } from "./discussions";

/**
 * Mutate a draft for a new discussion (subject + recipients + content) using
 * its `possessionID`. Mirrors {@link discussionCreateNewDiscussionDraft} but
 * targets an existing draft entity (state MODIFICATION) instead of creating
 * a new one.
 *
 * Unlike {@link discussionRemoteMutateDraft} (which only refreshes the
 * content of a reply draft), this function also sends `subject` and
 * `recipients` so the user can edit any field of a new-discussion draft.
 *
 * Refetches the discussion list and messages after the mutation so that
 * `discussion.messages` reflects the post-save server state (notably the
 * `listeDocumentsJoints` after a PJ add/remove). Mirrors the same
 * refetch tail as {@link discussionRemoteMutateDraft}.
 */
export const discussionMutateNewDiscussionDraft = async (
  session: SessionHandle,
  discussion: Discussion,
  draft: DiscussionDraftMessage,
  subject: string,
  content: string,
  recipients: Array<NewDiscussionRecipient>,
  files?: AttachmentChange[]
): Promise<{ library?: LibraryFile[] }> => {
  const result = await discussionPostCommand(session, DiscussionCommand.brouillon, {
    id: draft.possessionID,
    content,
    subject,
    recipients: recipients.map((recipient) => ({
      E: EntityState.MODIFICATION,
      G: recipient.kind,
      N: recipient.id
    })),
    files
  });

  await discussions(session, discussion.cache);
  await discussionMessages(session, discussion);

  return result;
};
