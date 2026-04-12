import { Discussion, DiscussionCommand, SessionHandle } from "~/models";
import { discussionPostCommand } from "./private/discussion-post-command";

export const discussionUnarchive = async (session: SessionHandle, discussion: Discussion): Promise<void> => {
  await discussionPostCommand(session, DiscussionCommand.desarchiver, {
    possessions: discussion.possessions
  });
};
