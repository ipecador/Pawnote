import { type AttachmentChange, Discussion, DiscussionCommand, type DiscussionDraftMessage, type LibraryFile, type SessionHandle } from "~/models";
import { discussionPostCommand } from "./private/discussion-post-command";
import { discussions } from "./discussions";
import { discussionMessages } from "./discussion-messages";

/**
 * Send local changes to the object
 * to the server.
 */
export const discussionRemoteMutateDraft = async (
  session: SessionHandle,
  discussion: Discussion,
  draft: DiscussionDraftMessage,
  files?: AttachmentChange[]
): Promise<{ library?: LibraryFile[] }> => {
  const result = await discussionPostCommand(session, DiscussionCommand.brouillon, {
    id: draft.possessionID,
    content: draft.content,
    replyMessageID: draft.replyMessageID,
    files
  });

  await discussions(session, discussion.cache);
  await discussionMessages(session, discussion);

  return result;
};
