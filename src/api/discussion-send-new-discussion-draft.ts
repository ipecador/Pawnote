import { type Discussion, DiscussionActionError, type DiscussionDraftMessage, EntityState, type NewDiscussionRecipient, type SessionHandle } from "~/models";
import { discussionPostCommand } from "./private/discussion-post-command";
import { encodeDiscussionSendAction } from "~/encoders/discussion-send-action";
import { discussions } from "./discussions";
import { discussionMessages } from "./discussion-messages";

/**
 * Send a draft of a new discussion as a real discussion.
 *
 * Mirrors {@link discussionSendDraft} but also passes `subject` and
 * `recipients` in the payload — without them, PRONOTE clears those fields
 * server-side at send time (the brouillon's stored values are NOT used as
 * fallbacks; an empty `listeDestinataires` is interpreted as "set to empty"
 * and the send fails with no destinataires).
 */
export const discussionSendNewDiscussionDraft = async (
  session: SessionHandle,
  discussion: Discussion,
  draft: DiscussionDraftMessage,
  subject: string,
  content: string,
  recipients: Array<NewDiscussionRecipient>,
  includeParentsAndStudents = false
): Promise<void> => {
  if (typeof discussion.messages?.sendAction === "undefined")
    throw new DiscussionActionError();

  await discussionPostCommand(session, "", {
    button: encodeDiscussionSendAction(discussion.messages.sendAction, includeParentsAndStudents),
    content,
    id: draft.possessionID,
    replyMessageID: draft.replyMessageID,
    subject,
    recipients: recipients.map((recipient) => ({
      E: EntityState.MODIFICATION,
      G: recipient.kind,
      N: recipient.id
    }))
  });

  await discussions(session, discussion.cache);
  await discussionMessages(session, discussion);
};
