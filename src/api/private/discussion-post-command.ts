import { RequestFN } from "~/core/request-function";
import { DiscussionCommand, EntityState, TabLocation, type SessionHandle } from "~/models";
import { apiProperties } from "./api-properties";

export const discussionPostCommand = async (session: SessionHandle, command: DiscussionCommand | "", extra: any): Promise<void> => {
  let payload;

  switch (command) {
    case DiscussionCommand.brouillon:
      payload = {
        commande: command,
        brouillon: typeof extra.id === "number" ? {
          E: EntityState.CREATION,
          N: extra.id
        } : {
          E: EntityState.MODIFICATION,
          N: extra.id
        },

        contenu: session.user.authorizations.hasAdvancedDiscussionEditor ? {
          _T: 21,
          V: extra.content
        } : extra.content,

        messagePourReponse: {
          G: 0,
          N: extra.replyMessageID ?? 0
        },

        listeDestinataires: extra.recipients ?? [],
        listeFichiers: [],
        objet: extra.subject ?? ""
      };
      break;
    case "":
      payload = {
        commande: command,
        bouton: {
          N: 0,
          G: extra.button
        },

        brouillon: {
          N: extra.id
        },

        contenu: session.user.authorizations.hasAdvancedDiscussionEditor ? {
          _T: 21,
          V: extra.content
        } : extra.content,
        listeDestinataires: extra.recipients ?? [],
        listeFichiers: [],

        messagePourReponse: {
          G: 0,
          N: extra.replyMessageID
        },

        objet: extra.subject ?? ""
      };
      break;
    default:
      payload = {
        commande: command,
        listePossessionsMessages: extra.possessions
      };
  }

  const properties = apiProperties(session);

  const request = new RequestFN(session, "SaisieMessage", {
    [properties.signature]: { onglet: TabLocation.Discussions },
    [properties.data]: payload
  });

  await request.send();
};
