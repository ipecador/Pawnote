import { RequestFN } from "~/core/request-function";
import { Discussion, SessionHandle, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

export const discussionUnread = async (session: SessionHandle, discussion: Discussion): Promise<void> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "SaisieMessage", {
    [properties.signature]: { onglet: TabLocation.Discussions },
    [properties.data]: {
      commande: "pourLu",
      lu: false,
      listePossessionsMessages: discussion.possessions,
    },
  });

  await request.send();
};
