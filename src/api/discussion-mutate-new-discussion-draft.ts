import { type DiscussionDraftMessage, DiscussionCommand, EntityState, type NewDiscussionRecipient, type SessionHandle } from "~/models";
import { discussionPostCommand } from "./private/discussion-post-command";

/**
 * Mutate a draft for a new discussion (subject + recipients + content) using
 * its `possessionID`. Mirrors {@link discussionCreateNewDiscussionDraft} but
 * targets an existing draft entity (state MODIFICATION) instead of creating
 * a new one.
 *
 * Unlike {@link discussionRemoteMutateDraft} (which only refreshes the
 * content of a reply draft), this function also sends `subject` and
 * `recipients` so the user can edit any field of a new-discussion draft.
 */
export const discussionMutateNewDiscussionDraft = async (
  session: SessionHandle,
  draft: DiscussionDraftMessage,
  subject: string,
  content: string,
  recipients: Array<NewDiscussionRecipient>
): Promise<void> => {
  await discussionPostCommand(session, DiscussionCommand.brouillon, {
    id: draft.possessionID,
    content,
    subject,
    recipients: recipients.map((recipient) => ({
      E: EntityState.MODIFICATION,
      G: recipient.kind,
      N: recipient.id
    }))
  });
};
