import { type AttachmentChange, DiscussionCommand, EntityState, type LibraryFile, type NewDiscussionRecipient, type SessionHandle } from "~/models";
import { discussionPostCommand } from "./private/discussion-post-command";
import { createEntityID } from "./helpers/entity-id";

/**
 * Create a draft for a new discussion (subject + recipients + content)
 * without sending it. The draft appears in the OCEM_Pre_Brouillon folder
 * on the server and is visible from the official PRONOTE clients.
 *
 * Content is wrapped centrally in {@link discussionPostCommand} based on
 * the account's `hasAdvancedDiscussionEditor` flag — pass plain text or
 * HTML as a string here.
 */
export const discussionCreateNewDiscussionDraft = async (
  session: SessionHandle,
  subject: string,
  content: string,
  recipients: Array<NewDiscussionRecipient>,
  files?: AttachmentChange[]
): Promise<{ library?: LibraryFile[] }> => {
  return discussionPostCommand(session, DiscussionCommand.brouillon, {
    id: createEntityID(),
    content,
    subject,
    recipients: recipients.map((recipient) => ({
      E: EntityState.MODIFICATION,
      G: recipient.kind,
      N: recipient.id
    })),
    files
  });
};
