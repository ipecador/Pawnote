import { Discussion, DiscussionCommand, SessionHandle } from "~/models";
import { discussionPostCommand } from "./private/discussion-post-command";

export const discussionArchive = async (session: SessionHandle, discussion: Discussion): Promise<void> => {
  await discussionPostCommand(session, DiscussionCommand.archiver, {
    possessions: discussion.possessions
  });
};
