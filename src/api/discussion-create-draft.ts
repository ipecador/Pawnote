import { type AttachmentChange, type Discussion, DiscussionCommand, type LibraryFile, type SessionHandle } from "~/models";
import { discussionPostCommand } from "./private/discussion-post-command";
import { createEntityID } from "./helpers/entity-id";
import { discussions } from "./discussions";
import { discussionMessages } from "./discussion-messages";

export const discussionCreateDraft = async (
  session: SessionHandle,
  discussion: Discussion,
  content: string,
  replyTo = discussion.messages?.defaultReplyMessageID,
  files?: AttachmentChange[]
): Promise<{ library?: LibraryFile[] }> => {
  const result = await discussionPostCommand(session, DiscussionCommand.brouillon, {
    id: createEntityID(),
    content,
    replyMessageID: replyTo,
    files
  });

  await discussions(session, discussion.cache);
  await discussionMessages(session, discussion);

  return result;
};
