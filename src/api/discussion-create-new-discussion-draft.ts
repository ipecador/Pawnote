import { DiscussionCommand, EntityState, type NewDiscussionRecipient, type SessionHandle } from "~/models";
import { discussionPostCommand } from "./private/discussion-post-command";
import { createEntityID } from "./helpers/entity-id";

/**
 * Create a draft for a new discussion (subject + recipients + content)
 * without sending it. The draft appears in the OCEM_Pre_Brouillon folder
 * on the server and is visible from the official PRONOTE clients.
 *
 * The `content` is plain text or HTML depending on whether the account
 * has the advanced discussion editor — same convention as {@link newDiscussion}.
 */
export const discussionCreateNewDiscussionDraft = async (
  session: SessionHandle,
  subject: string,
  content: string,
  recipients: Array<NewDiscussionRecipient>
): Promise<void> => {
  await discussionPostCommand(session, DiscussionCommand.brouillon, {
    id: createEntityID(),
    content: session.user.authorizations.hasAdvancedDiscussionEditor ? {
      _T: 21,
      V: content
    } : content,
    subject,
    recipients: recipients.map((recipient) => ({
      E: EntityState.MODIFICATION,
      G: recipient.kind,
      N: recipient.id
    }))
  });
};
