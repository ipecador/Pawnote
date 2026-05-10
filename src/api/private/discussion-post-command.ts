import { RequestFN } from "~/core/request-function";
import { type AttachmentChange, DiscussionCommand, DiscussionPostRejectedError, EntityState, type LibraryFile, TabLocation, type SessionHandle } from "~/models";
import { apiProperties } from "./api-properties";
import { buildListeFichiers } from "./build-liste-fichiers";

const decodeLibrary = (raw: any): LibraryFile[] | undefined => {
  const entries = raw?.Signature?.listeDonnees?.["0"]?.V;
  if (!Array.isArray(entries)) return undefined;

  return entries.map((e: any) => ({
    id: e.N,
    name: e.L ?? "",
    modifiable: Boolean(e.modifiable)
  }));
};

export const discussionPostCommand = async (
  session: SessionHandle,
  command: DiscussionCommand | "",
  extra: any
): Promise<{ library?: LibraryFile[] }> => {
  let payload;
  const listeFichiers = buildListeFichiers(extra.files as AttachmentChange[] | undefined);

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
        listeFichiers,
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
        listeFichiers,

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

  const response = await request.send();

  // PRONOTE returns HTTP 200 with a successful envelope even when the saisie
  // itself was rejected at the application layer (e.g. a file refused). The
  // flag lives in `RapportSaisie._erreurSaisie_`, with human messages in
  // `_messagesErreur_`. Surface it as an error so callers can react.
  const rapport = response.data?.RapportSaisie;
  if (rapport?._erreurSaisie_) {
    const messages: string[] = Array.isArray(rapport._messagesErreur_) ? rapport._messagesErreur_ : [];
    throw new DiscussionPostRejectedError(messages);
  }

  return {
    library: command === DiscussionCommand.brouillon ? decodeLibrary(response.data) : undefined
  };
};
